//! Integrity controller primitives sourced from STELE.
//!
//! - Monotonic escalate-only state machine (`ZANSHIN → … → EPOCHÉ`)
//! - Desk-boundary tripwires that refuse payload-shaped content
//! - Length-prefixed SHA-256 audit chain (STELE `v2` encoding)

use chrono::{DateTime, Utc};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::sync::OnceLock;
use thiserror::Error;
use touchstone_chain::{stele_link, GENESIS_DIGEST};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum IntegrityState {
    Zanshin,
    Unheimlich,
    Wabi,
    Epoque,
}

impl IntegrityState {
    pub fn label(self) -> &'static str {
        match self {
            Self::Zanshin => "ZANSHIN",
            Self::Unheimlich => "UNHEIMLICH",
            Self::Wabi => "WABI",
            Self::Epoque => "EPOCHE",
        }
    }

    pub fn allows_writes(self) -> bool {
        !matches!(self, Self::Epoque)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Transition {
    Unheimlich,
    Wabi,
    Epoque,
}

impl From<Transition> for IntegrityState {
    fn from(t: Transition) -> Self {
        match t {
            Transition::Unheimlich => IntegrityState::Unheimlich,
            Transition::Wabi => IntegrityState::Wabi,
            Transition::Epoque => IntegrityState::Epoque,
        }
    }
}

/// Always escalate — never de-escalate within a session (STELE invariant).
pub fn escalate(current: IntegrityState, transition: Transition) -> IntegrityState {
    current.max(transition.into())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TripHit {
    pub id: &'static str,
    pub name: &'static str,
    pub message: &'static str,
    pub transition: Transition,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEntry {
    pub timestamp: DateTime<Utc>,
    pub action: String,
    pub tobira_id: Option<String>,
    pub tobira_code: Option<String>,
    pub from_state: Option<String>,
    pub to_state: Option<String>,
    pub secrets_detected: bool,
    pub fields_extracted: Vec<String>,
    pub fields_rejected: Vec<String>,
    pub integrity_hash: String,
    pub session_id: String,
}

#[derive(Debug, Clone)]
pub struct Session {
    pub session_id: String,
    pub state: IntegrityState,
    pub entries: Vec<AuditEntry>,
}

#[derive(Debug, Error, PartialEq, Eq)]
pub enum IntegrityError {
    #[error("session locked (EPOCHE); refusing further writes")]
    Locked,
    #[error("desk boundary refused: {0}")]
    Boundary(&'static str),
}

impl Session {
    pub fn new(session_id: impl Into<String>) -> Self {
        Self {
            session_id: session_id.into(),
            state: IntegrityState::Zanshin,
            entries: Vec::new(),
        }
    }

    fn prev_hash(&self) -> &str {
        self.entries
            .last()
            .map(|e| e.integrity_hash.as_str())
            .unwrap_or(GENESIS_DIGEST)
    }

    fn append(
        &mut self,
        action: &str,
        tobira_id: Option<&str>,
        tobira_code: Option<&str>,
        from: Option<IntegrityState>,
        to: Option<IntegrityState>,
        secrets_detected: bool,
        extracted: Vec<String>,
        rejected: Vec<String>,
    ) -> Result<&AuditEntry, IntegrityError> {
        if !self.state.allows_writes() && action != "epoche-entered" {
            return Err(IntegrityError::Locked);
        }
        let ts = Utc::now();
        let ts_s = ts.to_rfc3339();
        let hash = stele_link(
            self.prev_hash(),
            action,
            tobira_id.unwrap_or(""),
            tobira_code.unwrap_or(""),
            from.map(|s| s.label()).unwrap_or(""),
            to.map(|s| s.label()).unwrap_or(""),
            secrets_detected,
            &extracted,
            &rejected,
            &self.session_id,
            &ts_s,
        );
        self.entries.push(AuditEntry {
            timestamp: ts,
            action: action.into(),
            tobira_id: tobira_id.map(str::to_string),
            tobira_code: tobira_code.map(str::to_string),
            from_state: from.map(|s| s.label().to_string()),
            to_state: to.map(|s| s.label().to_string()),
            secrets_detected,
            fields_extracted: extracted,
            fields_rejected: rejected,
            integrity_hash: hash,
            session_id: self.session_id.clone(),
        });
        Ok(self.entries.last().unwrap())
    }

    /// Scan operational text at the desk boundary. Payload-shaped content escalates.
    pub fn scan_desk_text(&mut self, text: &str) -> Result<Vec<TripHit>, IntegrityError> {
        let hits = scan_tripwires(text);
        for hit in &hits {
            let from = self.state;
            let to = escalate(self.state, hit.transition);
            // Record the tripwire while still writable, then advance state.
            self.append(
                "tobira-fired",
                Some(hit.id),
                Some(hit.name),
                Some(from),
                Some(to),
                false,
                vec![],
                vec!["operational_summary".into()],
            )?;
            self.state = to;
            if to == IntegrityState::Epoque {
                self.append(
                    "epoche-entered",
                    Some(hit.id),
                    Some(hit.name),
                    Some(from),
                    Some(to),
                    false,
                    vec![],
                    vec![],
                )?;
                return Err(IntegrityError::Boundary(hit.message));
            }
        }
        if !hits.is_empty() {
            return Err(IntegrityError::Boundary(hits[0].message));
        }
        Ok(hits)
    }

    pub fn accept_ops_field(
        &mut self,
        field: &str,
        value: &str,
    ) -> Result<(), IntegrityError> {
        self.scan_desk_text(value)?;
        self.append(
            "field-accepted",
            None,
            None,
            Some(self.state),
            Some(self.state),
            false,
            vec![field.into()],
            vec![],
        )?;
        Ok(())
    }

    pub fn verify_chain(&self) -> bool {
        let mut prev = GENESIS_DIGEST.to_string();
        for e in &self.entries {
            let expected = stele_link(
                &prev,
                &e.action,
                e.tobira_id.as_deref().unwrap_or(""),
                e.tobira_code.as_deref().unwrap_or(""),
                e.from_state.as_deref().unwrap_or(""),
                e.to_state.as_deref().unwrap_or(""),
                e.secrets_detected,
                &e.fields_extracted,
                &e.fields_rejected,
                &e.session_id,
                &e.timestamp.to_rfc3339(),
            );
            if expected != e.integrity_hash {
                return false;
            }
            prev = expected;
        }
        true
    }
}

struct Wire {
    id: &'static str,
    name: &'static str,
    message: &'static str,
    transition: Transition,
    re: &'static str,
}

fn wires() -> &'static [Wire] {
    &[
        Wire {
            id: "TW-DESK-001",
            name: "PAYLOAD-SEQUENCE",
            message: "Sequence-like content refused — keep technical material offline.",
            transition: Transition::Epoque,
            re: r"(?i)\b[acgtu]{48,}\b",
        },
        Wire {
            id: "TW-DESK-002",
            name: "PAYLOAD-JAILBREAK",
            message: "Jailbreak / override language refused at the desk boundary.",
            transition: Transition::Epoque,
            re: r"(?i)ignore\s+(previous|all|prior)|jailbreak|bypass\s+(filter|restrict|safeguard)",
        },
        Wire {
            id: "TW-DESK-003",
            name: "AUTHORITY-IMPERSONATION",
            message: "Authority impersonation pattern detected.",
            transition: Transition::Wabi,
            re: r"(?i)admin\s+override|developer\s+mode|you are now|system\s+prompt:",
        },
        Wire {
            id: "TW-DESK-004",
            name: "HIDDEN-INSTRUCTION",
            message: "Hidden instruction block detected.",
            transition: Transition::Wabi,
            re: r"(?i)<!--[\s\S]*?(ignore|system|override|bypass)[\s\S]*?-->",
        },
        Wire {
            id: "TW-DESK-005",
            name: "REPRODUCTION-STEPS",
            message: "Reproduction / exploit-step language refused — ops summaries only.",
            transition: Transition::Epoque,
            re: r"(?i)reproduction\s+steps|proof[-\s]?of[-\s]?concept|exploit\s+payload|bypass\s+procedure",
        },
    ]
}

fn compiled() -> &'static Vec<(regex::Regex, &'static Wire)> {
    static CELL: OnceLock<Vec<(Regex, &'static Wire)>> = OnceLock::new();
    CELL.get_or_init(|| {
        wires()
            .iter()
            .map(|w| (Regex::new(w.re).expect("valid tripwire"), w))
            .collect()
    })
}

pub fn scan_tripwires(text: &str) -> Vec<TripHit> {
    let mut hits = Vec::new();
    for (re, w) in compiled().iter() {
        if re.is_match(text) {
            hits.push(TripHit {
                id: w.id,
                name: w.name,
                message: w.message,
                transition: w.transition,
            });
        }
    }
    hits
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escalate_is_monotonic() {
        let s = escalate(IntegrityState::Zanshin, Transition::Unheimlich);
        let s = escalate(s, Transition::Wabi);
        assert_eq!(s, IntegrityState::Wabi);
        let s = escalate(s, Transition::Unheimlich);
        assert_eq!(s, IntegrityState::Wabi);
    }

    #[test]
    fn refuses_sequence_payload() {
        let mut s = Session::new("sess-1");
        let seq = "acgt".repeat(20);
        let err = s.scan_desk_text(&seq).unwrap_err();
        assert!(matches!(err, IntegrityError::Boundary(_)));
        assert_eq!(s.state, IntegrityState::Epoque);
        assert!(s.verify_chain());
    }

    #[test]
    fn accepts_ops_prose() {
        let mut s = Session::new("sess-2");
        s.accept_ops_field(
            "operational_summary",
            "Partner acknowledged weekend escalation gap; backup owner assigned.",
        )
        .unwrap();
        assert_eq!(s.state, IntegrityState::Zanshin);
        assert!(s.verify_chain());
    }
}
