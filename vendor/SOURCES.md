# Sourced primitives

Touchstone’s foundational Rust crates are adapted from Mazze LeCzzare’s sovereignty stack.

| Source | Public URL | What we take |
|---|---|---|
| **Stratum** | https://github.com/mazze93/stratum | Append-only epistemic ledger, evidence ≠ claim, status as a fold over transition markers, RFC 8785-style canonical bytes, SHA-256 hash chain (`prev ‖ canonicalize(record)`), genesis `0×64`. |
| **STELE** | https://github.com/mazze93/stele | Integrity state machine (monotonic escalate-only), length-prefixed injective chain encoding (`v2` + `len:value` fields), tripwire registry posture. |
| **Checkmate** | Private sibling (not publicly cloneable in this environment) | Forward-only head-digest hub: accept only strict chain extensions; a fork is refused (HTTP 409 semantics). Contract reconstructed from Stratum `ADR-003` / `trust-trace` references (`anchor-head-to-checkmate-hub`, claude-stamp forward-only hub). |

## Guardrails for Touchstone

- Ops records store **operational metadata only** — never sequences, jailbreak prompts, reproduction steps, or other attack payloads.
- Evidence that is *cited* is not *checked* until a binding (reproducible check or signed attestation) is present.
- Integrity tripwires refuse payload-shaped content at the desk boundary.
- Offline vault references (`OFF-…`) are opaque handles; Touchstone never dereferences them into payload storage.

Upstream licenses: Stratum MIT; STELE Apache-2.0. Adaptations here remain MIT under Touchstone.

## Research corpus (`vendor/research/`)

| Document | Role in Touchstone |
|---|---|
| `maestro-in-practice.txt` | MAESTRO L1–L7 as the desk’s structural threat-model axis |
| `field-note-authority-boundaries.txt` | Evidence-gated remediation; inputs never grants |
| `naked-truth-bearing-rigor.md` | Authority-basis discipline; Bearing ≠ runtime authority |
| `llm-attack-navigator-anthropic.txt` | External trend context for scoping — not executable ATT&CK content |
