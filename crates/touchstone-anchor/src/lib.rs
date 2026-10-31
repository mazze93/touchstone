//! Forward-only head-digest hub.
//!
//! Checkmate is a private sibling in the sovereignty stack. Its contract is
//! reconstructed from Stratum ADR-003 / trust-trace references:
//! - accept only **strict extensions** of a previously anchored chain
//! - a fork (same height, different digest — or a digest that is not a
//!   descendant of the last anchor) is refused with conflict semantics
//! - the hub stores head digests, never event payloads

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use touchstone_chain::GENESIS_DIGEST;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AnchorRecord {
    pub log: String,
    pub height: usize,
    pub head: String,
    pub previous_head: String,
    pub anchored_at: DateTime<Utc>,
}

#[derive(Debug, Error, PartialEq, Eq)]
pub enum AnchorError {
    #[error("conflict: proposed head forks the anchored chain (checkmate forward-only)")]
    Fork,
    #[error("conflict: height {got} is not a strict extension of {have}")]
    NotExtension { have: usize, got: usize },
    #[error("invalid head digest")]
    InvalidDigest,
    #[error("log name required")]
    Unnamed,
}

#[derive(Debug, Default)]
pub struct ForwardOnlyHub {
    /// log name → anchors in height order
    logs: std::collections::BTreeMap<String, Vec<AnchorRecord>>,
}

impl ForwardOnlyHub {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn latest(&self, log: &str) -> Option<&AnchorRecord> {
        self.logs.get(log).and_then(|v| v.last())
    }

    pub fn history(&self, log: &str) -> &[AnchorRecord] {
        self.logs
            .get(log)
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }

    /// Anchor a new head. Strict extension only — Checkmate 409-on-fork.
    pub fn anchor(
        &mut self,
        log: impl Into<String>,
        height: usize,
        head: impl Into<String>,
        previous_head: impl Into<String>,
    ) -> Result<&AnchorRecord, AnchorError> {
        let log = log.into();
        if log.trim().is_empty() {
            return Err(AnchorError::Unnamed);
        }
        let head = head.into();
        let previous_head = previous_head.into();
        if !is_sha256_hex(&head) || !is_sha256_hex(&previous_head) {
            return Err(AnchorError::InvalidDigest);
        }

        match self.latest(&log) {
            None => {
                // Bootstrap: first published head must extend genesis.
                if previous_head != GENESIS_DIGEST {
                    return Err(AnchorError::Fork);
                }
                if height == 0 && head != GENESIS_DIGEST {
                    return Err(AnchorError::Fork);
                }
            }
            Some(prev) => {
                if height <= prev.height {
                    return Err(AnchorError::NotExtension {
                        have: prev.height,
                        got: height,
                    });
                }
                if previous_head != prev.head {
                    return Err(AnchorError::Fork);
                }
                if head == prev.head {
                    return Err(AnchorError::Fork);
                }
            }
        }

        let rec = AnchorRecord {
            log: log.clone(),
            height,
            head,
            previous_head,
            anchored_at: Utc::now(),
        };
        let entry = self.logs.entry(log).or_default();
        entry.push(rec);
        Ok(entry.last().unwrap())
    }
}

fn is_sha256_hex(s: &str) -> bool {
    s.len() == 64 && s.chars().all(|c| c.is_ascii_hexdigit())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn forward_only_accepts_extension_refuses_fork() {
        let mut hub = ForwardOnlyHub::new();
        let h1 = "11".repeat(32);
        hub.anchor("ops", 1, &h1, GENESIS_DIGEST).unwrap();

        let h2 = "22".repeat(32);
        hub.anchor("ops", 2, &h2, &h1).unwrap();

        // Same height → conflict
        let err = hub
            .anchor("ops", 2, "33".repeat(32), &h1)
            .unwrap_err();
        assert!(matches!(err, AnchorError::NotExtension { .. }));

        // Wrong previous → fork
        let err = hub
            .anchor("ops", 3, "33".repeat(32), GENESIS_DIGEST)
            .unwrap_err();
        assert_eq!(err, AnchorError::Fork);
    }
}
