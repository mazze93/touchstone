| **C18** | The full proposed stack has empirically demonstrated near-zero UAER.                                                                                   | No current system-wide UAER experiment found.                                                                                                                            | Run B0–B4 campaign.                                                                                                      | **WEAKENS to unsupported/proposed**                                                                                                 |

This dossier is already useful because it forces the paper's language to narrow before experiments begin. In particular, C02, C05, C08, C13, C14, C15, and C18 prevent the manuscript from quietly presenting design intent as existing empirical fact.

There is a deeper point here. The Bearing engine's honesty audit warns that a formally valid corpus can still “flatter itself,” including through unrun checks, support only by other claims/checks, check-lifted robustness, absence of counter-evidence, unverified sources, and shared dependency. That is almost perfectly suited to this paper. A claim that “the stack operationalizes rigor” should itself fail the paper's release gate if it is supported only by documentation written by the stack's author.

## Paper architecture, Deep-review challenges, and source dossier

The paper should be framed as a systems-and-methods paper whose primary object is the transition from **information to authority**, with Bearing acting as a metaevaluation instrument.

**Proposed title**

> **The Naked Truth: Unconcealed Epistemic Conditions for Axiomatic Authority in Rigorous AI Systems**

A more conventional subtitle could be:

> *Operationalizing Responsible-AI Rigor Through Provenance, Authority Transitions, Adversarial Mutation, and Reconstructible State*

**Draft abstract**

> Agentic AI systems transform information across contexts: external content becomes model output, output becomes memory, memory becomes planning state, and state can eventually govern consequential action. These transformations create an epistemic failure mode in which the conditions under which information acquired authority become obscured. We study whether selected requirements of rigorous AI practice can be represented and tested as runtime properties. Building on Olteanu et al.'s distinction among epistemic, normative, conceptual, methodological, reporting, and interpretative rigor, we formalize assertions, evidence, authority, and state as distinct objects and introduce an axiomatic-unconcealment requirement: authority grounded in explicit policy or ratification must remain distinguishable from authority grounded in checked evidence across representation and state transformations. We examine a reference architecture comprising Aletheia for provenance-aware disclosure, Temenos for deterministic policy mediation, Stratum for append-only epistemic state, and Apatea for adversarial invariant testing. We use the Intentional Fragility Bearing engine as a meta-evaluation layer in which claims about these systems are themselves recorded in an append-only claim graph, supported across independent evidence frames, challenged by counter-evidence, and subjected to leave-one-frame-out tests. We propose an adversarial evaluation spanning lexical, encoding, structural, provenance, temporal, and topological mutations and five cumulative runtime baselines. The resulting methodology does not claim to establish substantive truth or the normative correctness of policy. It instead tests whether the epistemically relevant conditions of authority remain unconcealed, reconstructible, and resistant to laundering across transformations.

The results sentence should remain unwritten until B0–B4 experiments exist.

### Manuscript Skeleton

| Section | Purpose | Suggested figure/table |
|---|---|---|
| **Abstract** | State problem, architecture, method, empirical result only after measurement | — |
| **Introduction** | Generation→persistence→authority problem; six facets of rigor; research questions; contributions | Fig. 1: assertion/evidence/authority/state separation |
| **Background and Related Work** | Olteanu; W3C provenance; runtime authorization; memory laundering; agent audit; OWASP/NIST positioning | Table: differential against AGATE, EAL-Bench, Agent Flight Recorder |
| **Formal Model** | Signal, claim, evidence, authority basis, state, epistemic disclosure; authority laundering, evidence laundering, axiom laundering | Fig. 2: typed transitions |
| **Architecture** | Aletheia→Temenos→Stratum, with Apatea challenge and Bearing metaevaluation | Architecture Mermaid/redrawn vector figure |
| **Bearing as a Rigor Instrument** | Corpus design; independent frames; checks; contradictions; leave-one-out; dependency disclosure | Table: claim schema + evidence frames |
| **Adversarial Evaluation** | Mutation algebra, B0–B4, authority sinks, canonical oracles | Fig. 3: mutation topology; Table: operators |
| **Metrics and Statistical Analysis** | UAER, PCR, FVA, FAR\(_A\), RDR, DIR, RDR\(_{audit}\), SCR; paired/hierarchical plan | Table: metric definitions |
| **Results** | Per-baseline, per-family, per-sink rates; utility tradeoffs; negative results | UAER chart; sink heat map; Bearing leave-one-out heat map |
| **Discussion** | What became executable; what remained judgment; implications of explicit axioms | Table: six rigor facets vs observed support |
| **Limitations and Threats to Validity** | Author dependence, evidence-frame independence, semantic-equivalence oracle, observation coverage, TCB, external validity | — |
| **Conclusion** | Narrow claim: conditions of authority can be exposed/tested without claiming truth | — |

The appendices should be treated as release artifacts rather than supplementary decoration:

| Appendix | Content |
|---|---|
| **Formal specification** | Type definitions, transition semantics, authority-basis rules, invariants |
| **Mutation corpus** | Every seed, transform, equivalence label, provenance change, expected canonical result, hash |
| **Statistical preregistration** | Endpoints, exclusions, clustering, multiple-comparison policy, sample-size logic |
| **Artifact instructions** | Exact commits, environment, commands, deterministic seeds, hashes, replay procedure |
| **Bearing corpus** | `graph/`, `ledger.yml`, source verification records, checks, audit output, leave-one-out results |
| **W3C PROV export** | Proposed mapping and machine-readable provenance representation |
| **Human-review rubric** | Rules for mutation equivalence, normative appropriateness, conceptual-validity review |
| **Negative findings** | Failed hypotheses, invalid transformations, false stops, architecture limitations |

The strongest Deep-review challenges should be entered into Bearing as **counterclaims**, not left in prose:

| Challenge claim | Why it threatens the thesis | Follow-up experiment |
|---|---|---|
| **“Aletheia is a risk classifier, not a general unconcealment mechanism.”** | Current \(\Lambda_{\text{impl}}\) does not contain full derivation/evidence/history semantics. | Build disclosure-preservation adapter; measure EDPR through summary→memory→agent hops. |
| **“Making an axiom visible does not make it normatively rigorous.”** | Olteanu's normative rigor concerns appropriateness and justification, not merely explicitness. citeturn11search0 | Independent policy-review frame; compare explicit-but-bad policy against explicit-and-justified policy. |
| **“Two disjoint Bearing frames are not necessarily independent evidence.”** | Shared author, implementation, test oracle, or literature ancestry can create pseudo-independence. | Add dependency annotations; rerun bearings with correlated frames collapsed or non-counting. |
| **“`robust ≥ 2` is an arbitrary policy threshold.”** | Correct. It is useful machinery, not a theorem. | Sensitivity analysis at \(k=1,2,3\); include known false/true calibration claims. |
| **“Meaning-preserving mutation is itself the weakest oracle.”** | Apatea has already encountered invalid transformations while testing itself. fileciteturn21file0L2-L2 | Dual annotation + deterministic structural oracle where possible; report invalid-mutation rate. |
| **“Stratum's checked evidence can still be semantically hollow.”** | Stratum states this explicitly. fileciteturn41file0L2-L2 | Mutation-test the verification procedures themselves; add independent check-quality frame. |
| **“Temenos does not yet enforce general authority elevation.”** | Current Stratum writes are asserted decisions, not automatically verified/ratified state. fileciteturn29file0L2-L2 | Implement explicit authority transition gate; measure UAER before/after. |
| **“Human ratification is not automatically an authenticated axiom.”** | Identity, scope, validity, delegation, and revocation remain necessary. | Signed approval tokens with principal/scope/time binding; forged/expired/delegated FAR\(_A\) suite. |
| **“Aletheia taint may not survive every real memory/transformation boundary.”** | Carrying a field is only useful where adapters actually propagate it. | Cross-component taint conservation property tests; deliberately strip field at each hop. |
| **“Fail-loud ledger loss may still permit unrecorded consequential action.”** | Current Temenos returns the decision while marking write failure unresolved. fileciteturn28file0L2-L2 | Assurance-tier experiment: fail-open/loud vs fail-closed for high-impact sinks. |
| **“Stele composes with Temenos only in diagrams.”** | Current README explicitly says it is not a runtime dependency. fileciteturn45file0L2-L2 | Build adapter + ADR + tests; only then add as a counted implementation frame. |
| **“Typed output can make false conclusions look more rigorous.”** | Schema correctness is not semantic correctness. | Feed semantically false but schema-perfect responses through Adaptive Response; test FVA/reporting claims. |
| **“The six rigor facets are being reduced to observability.”** | This would reproduce exactly the narrowing Olteanu et al. object to. | Require every facet claim to state both mechanically operationalized condition and non-mechanical residual judgment. |

The most important follow-up experiment is therefore not a larger prompt-injection benchmark. It is a **closed-loop Bearing experiment on the paper itself**:

1. Instantiate approximately 15–20 claims, including C01–C18 above.
2. Mark the author's own architectural descriptions as a provenance-only/non-counting frame unless independently reproduced.
3. Add code evidence and executable checks.
4. Add independent external literature support and contradiction.
5. Run the new mutation corpus.
6. Append every mutation outcome rather than overwriting prior evidence.
7. Run `bearing audit --strict`, fold at the final read-point, and perform leave-one-frame-out on every central contribution claim.
8. Publish the complete claim graph and ledger alongside the paper.
9. Invite an independent reviewer to add counter-evidence without editing existing events.
10. Regenerate the manuscript's claim dossier from the same ledger.

That would make the paper unusually self-referential in a scientifically useful way: its central thesis—that rigorous authority depends on unconcealed epistemic conditions—would itself be published with unconcealed epistemic conditions.

A central claim should require:

$$
robust
\land
\text{at least one external-world source}
\land
\text{at least one executed check}
\land
\text{counter-evidence present}
\land
\text{dependency audit disclosed}
$$

and the prose should explicitly state whenever leave-one-out causes it to become fragile.

The engine treats surfaces as derived, contradiction as visible, tests as non-counting until actually run, and formal validity as insufficient protection against self-flattery.

## **Primary source dossier**

