# Touchstone

Independent **defensive operations desk** for biosecurity safeguard engagement: partner CRM, payload-free findings, disclosure workflows, and governance checklists.

Foundational tools are implemented in **Rust**, sourced from the sovereignty stack:

| Crate | Source | Role |
|---|---|---|
| `touchstone-chain` | Stratum + STELE | Canonical bytes + tamper-evident hash chains |
| `touchstone-ledger` | [Stratum](https://github.com/mazze93/stratum) | Evidence-gated append-only decision ledger |
| `touchstone-integrity` | [STELE](https://github.com/mazze93/stele) | Monotonic integrity state + desk tripwires |
| `touchstone-anchor` | Checkmate (private; contract from Stratum ADR-003) | Forward-only head-digest hub |
| `touchstone-cli` | — | `touchstone` CLI: decide / verify / tessera / scan / anchor |

See [`vendor/SOURCES.md`](vendor/SOURCES.md).

## Guardrail

This product stores **operational metadata only**. Sequences, jailbreak prompts, reproduction steps, and other attack payloads are refused at the desk boundary and must stay in offline controlled channels referenced by opaque `OFF-…` ids.

## Research inputs

Curated under `vendor/research/` and surfaced in the desk at `/app/research`:

- **MAESTRO in Practice** — structural threat-model axis (L1–L7) for tagging findings
- **Field Note 01** — evidence-gated remediation / authority boundaries (inputs ≠ grants)
- **The Naked Truth** — claim ≠ evidence ≠ authority ≠ state ≠ truth; Bearing vs runtime authority
- **LLM ATT&CK Navigator** (Anthropic) — external trend awareness only; no technique playbooks

Findings carry a MAESTRO layer tag and a Stratum-style authority basis (`narrative` / `provisional` / `authoritative_verified` / `authoritative_axiomatic`).

## Web desk

```bash
npm install
npm run dev -- --port 3847
```

Open [http://localhost:3847](http://localhost:3847).

## Rust tools

```bash
cargo test --workspace
cargo run -p touchstone-cli -- decide "Adopt partner-first disclosure" --log touchstone-ops
cargo run -p touchstone-cli -- tessera --log touchstone-ops
cargo run -p touchstone-cli -- scan "Partner acknowledged weekend escalation gap"
```

## Stack

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Rust 2021 workspace (`crates/`)
- Local-first demo state in `localStorage` (no database required)

