//! Append-only, evidence-gated decision ledger.
//!
//! Sourced from Stratum (`mazze93/stratum`): status is a fold over transition
//! markers; prose claims never become authoritative without checked evidence;
//! the head digest is a content address of the whole log.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::json;
use thiserror::Error;
use touchstone_chain::{stratum_digest, stratum_link, GENESIS_DIGEST};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Status {
    Asserted,
    PendingEvidence,
    Validated,
    Contradicted,
    Superseded,
    Ratified,
    Disputed,
    Rejected,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EventType {
    Decision,
    Foreclosure,
    Verification,
    Supersession,
    Contradiction,
    Ratification,
    Rejection,
    Dispute,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Binding {
    ReproducibleCheck {
        command: String,
        repo: String,
        commit: String,
        expect_exit: i32,
    },
    SignedAttestation {
        subject_sha256: String,
        predicate: String,
        key_id: String,
        signature: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Evidence {
    pub kind: String,
    pub reference: String,
    #[serde(default)]
    pub checked_at: Option<DateTime<Utc>>,
    pub binding: Option<Binding>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub event_type: EventType,
    pub claim: String,
    #[serde(default)]
    pub targets: Vec<String>,
    #[serde(default)]
    pub evidence: Vec<Evidence>,
    pub timestamp: DateTime<Utc>,
    pub agent_id: String,
    /// Opaque offline handle only — never a payload.
    #[serde(default)]
    pub offline_reference: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recorded {
    pub event: Event,
    pub chain_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tessera {
    pub epoch: usize,
    pub head: String,
    pub decisions: usize,
    pub validated: usize,
    pub pending: usize,
    pub foreclosed: usize,
}

#[derive(Debug, Error, PartialEq, Eq)]
pub enum LedgerError {
    #[error("log must be named; refusing silent default")]
    LogUnnamed,
    #[error("unknown target {0}")]
    UnknownTarget(String),
    #[error("illegal transition from {from:?}")]
    IllegalTransition { from: Status },
    #[error("verification requires a well-formed evidence binding")]
    BindingRequired,
    #[error("payload-shaped content refused at ledger boundary")]
    PayloadRefused,
    #[error(transparent)]
    Chain(#[from] touchstone_chain::ChainError),
}

#[derive(Debug, Default)]
pub struct Ledger {
    name: String,
    records: Vec<Recorded>,
}

impl Ledger {
    pub fn open(name: impl Into<String>) -> Result<Self, LedgerError> {
        let name = name.into();
        if name.trim().is_empty() || name == "true" {
            return Err(LedgerError::LogUnnamed);
        }
        Ok(Self {
            name,
            records: Vec::new(),
        })
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn records(&self) -> &[Recorded] {
        &self.records
    }

    pub fn head(&self) -> String {
        self.records
            .last()
            .map(|r| r.chain_hash.clone())
            .unwrap_or_else(|| GENESIS_DIGEST.to_string())
    }

    fn fold_status(&self, id: &str) -> Option<Status> {
        let mut status: Option<Status> = None;
        for r in &self.records {
            let e = &r.event;
            match e.event_type {
                EventType::Decision if e.id == id => status = Some(Status::PendingEvidence),
                EventType::Foreclosure if e.id == id => status = Some(Status::Asserted),
                EventType::Verification if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Validated)
                }
                EventType::Supersession if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Superseded)
                }
                EventType::Contradiction if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Contradicted)
                }
                EventType::Ratification if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Ratified)
                }
                EventType::Rejection if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Rejected)
                }
                EventType::Dispute if e.targets.iter().any(|t| t == id) => {
                    status = Some(Status::Disputed)
                }
                _ => {}
            }
        }
        status
    }

    pub fn append(&mut self, mut event: Event) -> Result<&Recorded, LedgerError> {
        if looks_like_payload(&event.claim) {
            return Err(LedgerError::PayloadRefused);
        }
        if let Some(off) = &event.offline_reference {
            if looks_like_payload(off) {
                return Err(LedgerError::PayloadRefused);
            }
        }

        match event.event_type {
            EventType::Decision | EventType::Foreclosure => {
                if !event.targets.is_empty() {
                    // originating events name themselves; targets reserved for markers
                }
            }
            EventType::Verification => {
                if event.targets.is_empty() {
                    return Err(LedgerError::UnknownTarget("(empty)".into()));
                }
                for t in &event.targets {
                    let from = self
                        .fold_status(t)
                        .ok_or_else(|| LedgerError::UnknownTarget(t.clone()))?;
                    if !matches!(
                        from,
                        Status::PendingEvidence | Status::Disputed | Status::Asserted
                    ) {
                        return Err(LedgerError::IllegalTransition { from });
                    }
                }
                let has_binding = event.evidence.iter().any(|e| e.binding.is_some());
                if !has_binding {
                    return Err(LedgerError::BindingRequired);
                }
                for e in &mut event.evidence {
                    if e.binding.is_some() && e.checked_at.is_none() {
                        e.checked_at = Some(Utc::now());
                    }
                }
            }
            _ => {
                for t in &event.targets {
                    if self.fold_status(t).is_none() {
                        return Err(LedgerError::UnknownTarget(t.clone()));
                    }
                }
            }
        }

        let value = serde_json::to_value(&event).map_err(|_| LedgerError::PayloadRefused)?;
        let prev = self.head();
        let chain_hash = stratum_link(&prev, &value)?;
        self.records.push(Recorded { event, chain_hash });
        Ok(self.records.last().unwrap())
    }

    pub fn tessera(&self) -> Tessera {
        let mut decisions = 0;
        let mut validated = 0;
        let mut pending = 0;
        let mut foreclosed = 0;
        for r in &self.records {
            match r.event.event_type {
                EventType::Decision => {
                    decisions += 1;
                    match self.fold_status(&r.event.id) {
                        Some(Status::Validated) | Some(Status::Ratified) => validated += 1,
                        Some(Status::PendingEvidence) | Some(Status::Disputed) => pending += 1,
                        _ => {}
                    }
                }
                EventType::Foreclosure => foreclosed += 1,
                _ => {}
            }
        }
        Tessera {
            epoch: self.records.len(),
            head: self.head(),
            decisions,
            validated,
            pending,
            foreclosed,
        }
    }

    pub fn export_jsonl(&self) -> Result<String, LedgerError> {
        let mut out = String::new();
        for r in &self.records {
            let line = serde_json::to_string(r).map_err(|_| LedgerError::PayloadRefused)?;
            out.push_str(&line);
            out.push('\n');
        }
        Ok(out)
    }

    pub fn verify_chain(&self) -> Result<String, LedgerError> {
        let values: Vec<_> = self
            .records
            .iter()
            .map(|r| json!(r.event))
            .collect();
        // Recompute via digest for the head; also check stored hashes.
        let mut prev = GENESIS_DIGEST.to_string();
        for (i, r) in self.records.iter().enumerate() {
            let expected = stratum_link(&prev, &values[i])?;
            if expected != r.chain_hash {
                return Err(LedgerError::Chain(touchstone_chain::ChainError::Break {
                    index: i,
                    expected,
                    got: r.chain_hash.clone(),
                }));
            }
            prev = expected;
        }
        let _ = stratum_digest(&values)?;
        Ok(prev)
    }
}

fn looks_like_payload(s: &str) -> bool {
    let lower = s.to_lowercase();
    lower.contains("atgc") && s.len() > 80
        || lower.contains("jailbreak")
        || lower.contains("ignore previous instructions")
        || lower.contains("base64,") && s.len() > 120
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decide_then_verify_with_binding() {
        let mut log = Ledger::open("touchstone-ops").unwrap();
        let d = log
            .append(Event {
                id: "d-1".into(),
                event_type: EventType::Decision,
                claim: "Adopt partner-first disclosure cadence".into(),
                targets: vec![],
                evidence: vec![],
                timestamp: Utc::now(),
                agent_id: "ops".into(),
                offline_reference: Some("OFF-2026-0001".into()),
            })
            .unwrap();
        assert_eq!(d.event.id, "d-1");
        assert_eq!(log.fold_status("d-1"), Some(Status::PendingEvidence));

        log.append(Event {
            id: "v-1".into(),
            event_type: EventType::Verification,
            claim: "MoU signed; process check recorded".into(),
            targets: vec!["d-1".into()],
            evidence: vec![Evidence {
                kind: "artifact".into(),
                reference: "governance/mou-ack.md".into(),
                checked_at: None,
                binding: Some(Binding::ReproducibleCheck {
                    command: "test -f governance/mou-ack.md".into(),
                    repo: "touchstone".into(),
                    commit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".into(),
                    expect_exit: 0,
                }),
            }],
            timestamp: Utc::now(),
            agent_id: "ops".into(),
            offline_reference: None,
        })
        .unwrap();

        assert_eq!(log.fold_status("d-1"), Some(Status::Validated));
        let t = log.tessera();
        assert_eq!(t.validated, 1);
        assert!(log.verify_chain().is_ok());
    }

    #[test]
    fn refuses_unnamed_log() {
        assert_eq!(Ledger::open("").unwrap_err(), LedgerError::LogUnnamed);
    }
}
