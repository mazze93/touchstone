//! Tamper-evident hash chains for Touchstone.
//!
//! Two encodings, both sourced from the sovereignty stack:
//! - [`stratum_link`] — Stratum ADR-003 / `core/src/chain.ts`:
//!   `sha256_hex(utf8(prev) ‖ canonicalize(record))`, genesis `0×64`.
//! - [`stele_link`] — STELE `stele-core/src/chain.ts` length-prefixed injective
//!   preimage (`CHAIN_VERSION` + `len:value` fields).

use serde_json::Value;
use sha2::{Digest, Sha256};
use thiserror::Error;

pub const GENESIS_DIGEST: &str =
    "0000000000000000000000000000000000000000000000000000000000000000";

pub const STELE_CHAIN_VERSION: &str = "v2";

#[derive(Debug, Error, PartialEq, Eq)]
pub enum ChainError {
    #[error("canonical: non-finite number")]
    NonFiniteNumber,
    #[error("canonical: value is not JSON")]
    NotJson,
    #[error("chain break at index {index}: expected {expected}, got {got}")]
    Break {
        index: usize,
        expected: String,
        got: String,
    },
}

fn sha256_hex(bytes: impl AsRef<[u8]>) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes.as_ref());
    hex::encode(hasher.finalize())
}

/// Minimal RFC 8785-style canonicalization for JSON values (Stratum twin).
pub fn canonicalize(value: &Value) -> Result<String, ChainError> {
    match value {
        Value::Null => Ok("null".into()),
        Value::Bool(b) => Ok(if *b { "true" } else { "false" }.into()),
        Value::Number(n) => {
            let f = n.as_f64().ok_or(ChainError::NonFiniteNumber)?;
            if !f.is_finite() {
                return Err(ChainError::NonFiniteNumber);
            }
            if f == 0.0 {
                return Ok("0".into());
            }
            Ok(n.to_string())
        }
        Value::String(s) => Ok(serde_json::to_string(s).unwrap()),
        Value::Array(xs) => {
            let parts: Result<Vec<_>, _> = xs.iter().map(canonicalize).collect();
            Ok(format!("[{}]", parts?.join(",")))
        }
        Value::Object(map) => {
            let mut keys: Vec<&String> = map.keys().collect();
            keys.sort();
            let mut parts = Vec::with_capacity(keys.len());
            for k in keys {
                let key = serde_json::to_string(k).unwrap();
                let val = canonicalize(&map[k])?;
                parts.push(format!("{key}:{val}"));
            }
            Ok(format!("{{{}}}", parts.join(",")))
        }
    }
}

/// Stratum chain link: `sha256(prev ‖ canonicalize(record))`.
pub fn stratum_link(prev: &str, record: &Value) -> Result<String, ChainError> {
    let canon = canonicalize(record)?;
    Ok(sha256_hex(format!("{prev}{canon}")))
}

pub fn stratum_digest(records: &[Value]) -> Result<String, ChainError> {
    let mut prev = GENESIS_DIGEST.to_string();
    for r in records {
        prev = stratum_link(&prev, r)?;
    }
    Ok(prev)
}

pub fn verify_stratum_chain(records: &[Value], stored: &[String]) -> Result<(), ChainError> {
    if records.len() != stored.len() {
        return Err(ChainError::Break {
            index: 0,
            expected: format!("{} hashes", records.len()),
            got: format!("{} hashes", stored.len()),
        });
    }
    let mut prev = GENESIS_DIGEST.to_string();
    for (i, (r, h)) in records.iter().zip(stored.iter()).enumerate() {
        let expected = stratum_link(&prev, r)?;
        if &expected != h {
            return Err(ChainError::Break {
                index: i,
                expected,
                got: h.clone(),
            });
        }
        prev = expected;
    }
    Ok(())
}

/// Length-prefixed field encoding from STELE (injective over unrestricted strings).
pub fn stele_field(s: &str) -> String {
    format!("{}:{s}", s.len())
}

pub fn stele_list(xs: &[String]) -> String {
    let inner: String = xs.iter().map(|s| stele_field(s)).collect();
    stele_field(&inner)
}

/// STELE durable-chain preimage (action + optional integrity fields).
pub fn stele_preimage(
    prev: &str,
    action: &str,
    tobira_id: &str,
    tobira_code: &str,
    from_state: &str,
    to_state: &str,
    secrets_detected: bool,
    fields_extracted: &[String],
    fields_rejected: &[String],
    session_id: &str,
    ts: &str,
) -> String {
    format!(
        "{}{}{}{}{}{}{}{}{}{}{}{}",
        STELE_CHAIN_VERSION,
        stele_field(prev),
        stele_field(action),
        stele_field(tobira_id),
        stele_field(tobira_code),
        stele_field(from_state),
        stele_field(to_state),
        stele_field(&secrets_detected.to_string()),
        stele_list(fields_extracted),
        stele_list(fields_rejected),
        stele_field(session_id),
        stele_field(ts),
    )
}

pub fn stele_link(
    prev: &str,
    action: &str,
    tobira_id: &str,
    tobira_code: &str,
    from_state: &str,
    to_state: &str,
    secrets_detected: bool,
    fields_extracted: &[String],
    fields_rejected: &[String],
    session_id: &str,
    ts: &str,
) -> String {
    sha256_hex(stele_preimage(
        prev,
        action,
        tobira_id,
        tobira_code,
        from_state,
        to_state,
        secrets_detected,
        fields_extracted,
        fields_rejected,
        session_id,
        ts,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn stratum_empty_is_genesis() {
        assert_eq!(stratum_digest(&[]).unwrap(), GENESIS_DIGEST);
    }

    #[test]
    fn stratum_chain_is_deterministic() {
        let records = vec![json!({"id":"a","n":1}), json!({"id":"b","n":2})];
        let d1 = stratum_digest(&records).unwrap();
        let d2 = stratum_digest(&records).unwrap();
        assert_eq!(d1, d2);
        assert_ne!(d1, GENESIS_DIGEST);
    }

    #[test]
    fn stele_field_is_injective_across_delimiter() {
        // "KAPU|001" + "" vs "KAPU" + "001" must differ (STELE's stated bug class).
        let a = stele_preimage(
            GENESIS_DIGEST,
            "tobira-fired",
            "KAPU|001",
            "",
            "",
            "",
            false,
            &[],
            &[],
            "s1",
            "t1",
        );
        let b = stele_preimage(
            GENESIS_DIGEST,
            "tobira-fired",
            "KAPU",
            "001",
            "",
            "",
            false,
            &[],
            &[],
            "s1",
            "t1",
        );
        assert_ne!(a, b);
    }
}
