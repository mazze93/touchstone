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

This is also well differentiated from the closest 2026 work. AGATE already combines runtime authorization and data provenance, parameter-bound grants, deterministic judgment, and replayable evidence; its evaluation reports 153 exercised attack-chain records, a parameter-rewriting bypass, utility costs, and perfect live/replay agreement for 63 scenarios on each of two evaluated platforms. EAL-Bench independently shows why persistent state must be treated as an authorization surface: false authority reached 50.2% in one evaluated condition, and executors acted on already-formed false authority in 98.6% of matched trials. Agent Flight Recorder establishes a strong neighboring result for tamper-evident, semantically structured forensic histories. The novel target here is narrower: **whether the epistemically releva