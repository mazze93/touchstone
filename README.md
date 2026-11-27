# Touchstone

**Assay the engagement record. Never the payload.**

Independent defensive operations desk for biosecurity safeguard engagement — partner CRM, payload-free findings, disclosure ladders, and governance, with Stratum authority and STELE tripwires.

<p align="center">
  <img src="docs/previews/landing-glow.jpg" alt="Touchstone landing — solid copy plate over stained hex imprint with verdigris cursor glow" width="920" />
</p>

<p align="center"><em>Landing: mineral copy plate, stained hex imprint, assay cursor that lifts tiles with a verdigris glow.</em></p>

## What it is

Touchstone is opinionated about what may enter the desk. It keeps **operational metadata only** — sequences, jailbreak prompts, reproduction steps, and other attack payloads stay offline behind opaque `OFF-…` refs.

| Surface | Purpose |
|---|---|
| **Landing** | Brand + doctrine on a solid mineral plate over the tessellation field |
| **Desk** | Overview, partners, engagements, findings, governance, research |
| **Rust crates** | Chain, ledger, integrity, anchor, and CLI for decide / verify / tessera / scan |

## Previews

| Landing (cursor glow) | Assay desk |
|---|---|
| <img src="docs/previews/landing-glow.jpg" alt="Landing with verdigris glow" width="440" /> | <img src="docs/previews/desk-overview.jpg" alt="Touchstone assay desk overview" width="440" /> |

| At rest |
|---|
| <img src="docs/previews/landing-imprint.jpg" alt="Landing hex imprint at rest" width="640" /> |

Glow demo: [`docs/previews/landing-glow-demo.mp4`](docs/previews/landing-glow-demo.mp4)

## Guardrail

This product stores **operational metadata only**. Attack payloads are refused at the desk boundary and must stay in offline controlled channels.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

```bash
cargo test --workspace
cargo run -p touchstone-cli -- decide "Adopt partner-first disclosure" --log touchstone-ops
cargo run -p touchstone-cli -- tessera --log touchstone-ops
cargo run -p touchstone-cli -- scan "Partner acknowledged weekend escalation gap"
```

## Foundations (Rust)

| Crate | Source | Role |
|---|---|---|
| `touchstone-chain` | Stratum + STELE | Canonical bytes + tamper-evident hash chains |
| `touchstone-ledger` | [Stratum](https://github.com/mazze93/stratum) | Evidence-gated append-only decision ledger |
| `touchstone-integrity` | [STELE](https://github.com/mazze93/stele) | Monotonic integrity state + desk tripwires |
| `touchstone-anchor` | Checkmate (private; Stratum ADR-003) | Forward-only head-digest hub |
| `touchstone-cli` | — | `decide` / `verify` / `tessera` / `scan` / `anchor` |

See [`vendor/SOURCES.md`](vendor/SOURCES.md).

## Research inputs

Curated under `vendor/research/`, surfaced at `/app/research`:

- **MAESTRO in Practice** — L1–L7 structural threat-model axis for findings
- **Field Note 01** — evidence-gated remediation; inputs ≠ grants
- **The Naked Truth** — claim ≠ evidence ≠ authority ≠ state ≠ truth
- **LLM ATT&CK Navigator** (Anthropic) — trend awareness only; no technique playbooks

Findings carry a MAESTRO layer and Stratum-style authority basis (`narrative` / `provisional` / `authoritative_verified` / `authoritative_axiomatic`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Rust 2021 workspace (`crates/`)
- Local-first demo state in `localStorage` (no database required)

## Interaction notes

- Hero copy sits on a solid mineral plate so type stays legible over the imprint.
- Custom verdigris assay cursor (fine pointer); nearby tiles lift and glow on hover.
- Desk keeps a quieter imprint without taking over the system cursor.
