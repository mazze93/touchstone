# The Naked Truth: Using the Bearing Engine to Operationalize and Falsify Claims of AI Rigor

## Executive summary

The strongest defensible research claim is **not** that Aletheia, Temenos, Stratum, Apatea, Stele, Adaptive Response, and the Bearing engine “implement Olteanu et al.’s six forms of rigor.” Olteanu et al. explicitly define rigor more broadly than methodological correctness: epistemic, normative, conceptual, methodological, reporting, and interpretative rigor each require not only explicitness but *appropriateness, justification, or support*. A runtime can mechanically expose provenance, authority basis, transitions, checks, and reporting history; it cannot mechanically establish that the underlying knowledge is appropriate, the norm legitimate, the construct valid, or the substantive interpretation sound.

The stronger—and falsifiable—claim is:

> **The stack (Aletheia, Temenos, Stratum, Apatea, Stele, Adaptive Response) operationalizes enforceable conditions that support all six dimensions of rigor, while the Bearing engine can make claims about that operationalization themselves auditable, adversarially testable, and corrigible.**

The evidence for that claim is already substantial. Stratum implements a typed distinction between claims and checked evidence, derives state by folding an append-only history, keeps `authoritative_verified` separate from `authoritative_axiomatic`, fails closed when authoritative projections lack backing, and explicitly disclaims correctness as something its provenance contract can prove. Aletheia separately represents origin, trust class, carried taint, governing parameters, and effect capability, and explicitly says that trust concerns authority to govern action rather than factual correctness; its classifier is separated from its policy decision. Temenos composes Aletheia with deterministic policy and Stratum while preserving checked-versus-cited evidence and surfacing persistence failures as unresolved state. Apatea already adversarially searches representation changes under explicit invariants rather than relying on a fixed attack list.

The **Intentional Fragility Bearing engine is the missing metascientific layer**. It does not store verdicts. It derives a claim’s bearing from an append-only argument ledger, counts independent supporting frames rather than raw evidence quantity, makes unrun checks count zero, preserves contradiction without silently subtracting it, computes leave-one-frame-out sensitivity, and warns when a formally valid corpus flatters itself through ungrounded, check-lifted, unchallenged, or dependency-entangled claims. This is well suited to testing whether the “operationalization of rigor” thesis survives changes in representation, evidence frame, system component, and external literature.

The resulting research design should maintain two separate state machines:
$$

\boxed{\text{Bearing robustness} \neq \text{runtime authority}}

$$
A Bearing claim may be `robust`, `fragile`, `gone`, or explicitly `refuted`. That describes **argument support across evidence frames**. A Stratum record may be narrative, provisional, `authoritative_verified`, or `authoritative_axiomatic`. That describes the **basis under which information is allowed to govern runtime state**. Neither means “true.”

This distinction should become the conceptual center of the paper:
$$

\boxed{
\text{Claim}
\neq
\text{Evidence}
\neq
\text{Authority}
\neq
\text{State}
\neq
\text{Truth}
}

$$
The stack's central research contribution is better described as **epistemic condition preservation** or **authority integrity** than generic provenance. Aletheia currently exposes a meaningful subset of the conditions relevant to authority—origin, trust, taint, governing parameters, and risk factors—but the more general “unconcealment” representation discussed in the paper would be a proposed extension, not an implemented feature. Temenos then governs what follows from those disclosed conditions; Stratum preserves how authority arose; Apatea contests invariants; Bearing tests whether the research claims made about the system survive independent evidence and adversarial removal.

This is also well differentiated from the closest 2026 work. AGATE already combines runtime authorization and data provenance, parameter-bound grants, deterministic judgment, and replayable evidence; its evaluation reports 153 exercised attack-chain records, a parameter-rewriting bypass, utility costs, and perfect live/replay agreement for 63 scenarios on each of two evaluated platforms. EAL-Bench independently shows why persistent state must be treated as an authorization surface: false authority reached 50.2% in one evaluated condition, and executors acted on already-formed false authority in 98.6% of matched trials. Agent Flight Recorder establishes a strong neighboring result for tamper-evident, semantically structured forensic histories. The novel target here is narrower: **whether the epistemically relevant conditions under which information becomes authoritative remain unconcealed, distinguishable, and reconstructible across transformations—and whether claims about that property themselves survive adversarial scrutiny.**

The experimental centerpiece should therefore be **authority-laundering under epistemic-condition mutation**, not prompt-injection detection accuracy. The central falsifiable invariant is:
$$

\Delta A_g(x) > 0
\Rightarrow
\exists T_{\text{authorized}}

$$
and, for axiomatic authority:
$$

A_{\text{axiomatic}}
\not\xrightarrow{\text{persistence, paraphrase, consensus}}
A_{\text{verified}}

$$
The system need not discover universal truth. It must not allow its reason for treating something as authoritative to become concealed.

## Evidence base and artifact inventory

The inventory below distinguishes **implemented**, **observed/documented**, and **proposed** properties. That distinction is essential because some of the conceptual architecture is ahead of current integration.

| Artifact                             | What is implemented now                                                                                                                                                                                                                                                                                                         | What remains proposed or outside its current perimeter                                                                                                                                                                                   | Rigor significance                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bearing / Intentional Fragility**  | Typed `Claim`, `Image`, `Fragment`, `Check`, `Source` nodes; append-only argument ledger; `supports`, `tested-by`, `derives-from`, `contradicts`; pure deterministic fold; `robust/fragile/gone/refuted`; leave-one-out; check outcomes; frame provenance validation; honesty audit; derived book/surfaces; Python/JS parity.   | Automatic extraction/generation of claims from repositories is **not** implemented. Roadmap still lists `bearing new ...` helpers and engine split/publication work as open. The rigor-specific corpus proposed here does not yet exist. | Meta-evaluation layer: makes the paper's claims themselves subject to evidence breadth, challenge, retraction, and leave-one-frame-out tests.             |
| **Aletheia**                         | Explicit origin/trust classes; carried taint rather than inferred taint; allowed effects by source; governing-parameter extraction; injection-risk factors; classifier/enforcer separation; shadow/enforce policy; Python/TypeScript parity infrastructure.                                                                     | The generalized disclosure vector \(\Lambda^*\) proposed below—derivation lineage, evidence relation, unresolved assumptions, authority basis/history—is not yet a single Aletheia object.                                               | Strong support for epistemic/conceptual rigor through explicit provenance and category separation; candidate substrate for “unconcealment.”               |
| **Apatea**                           | Transformation algebra over Unicode adjacency, invisibles, normalization, guarded case changes, prose→JSON/YAML/array/value-shape transformations; invariants for monotonicity, extent stability, determinism; vulnerable/fixed/live targets.                                                                                   | Provenance, temporal, lifecycle, multi-agent/topological, and authority-state transformations proposed here are not in the current algebra.                                                                                              | Methodological rigor through adversarial falsification; particularly valuable because “meaning preserving” is itself treated as a claim requiring guards. |
| **Stratum**                          | Disjoint claim/evidence fields; checked-versus-cited evidence; append-only events; status fold by logical sequence; replay; legal transition system; distinct verified/axiomatic/provisional/narrative authority; invalidation/review derivation; fail-closed incomplete projection; reported 16-invariant reference semantics. | Recursive authority-registry/PKI integration and some broader governance extensions are research-agenda items. Stratum explicitly does not prove evidence adequacy or substantive correctness.                                           | Strongest current operationalization of conceptual, epistemic, methodological, and reporting constraints.                                                 |
| **Temenos — conceptual system**      | Architecture separates signal → Aletheia → deterministic policy → Stratum → human review, with Apatea out-of-band.                                                                                                                                                                                                              | Full composition with Stele and Adaptive Response is a wider-stack goal rather than current Temenos 0.1 runtime behavior.                                                                                                                | Provides the governance transition between disclosure and durable state.                                                                                  |
