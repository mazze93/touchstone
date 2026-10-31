export type ResearchDoc = {
  id: string;
  title: string;
  kind: "framework" | "field-note" | "external-analysis" | "stack-paper";
  authors: string;
  summary: string;
  touchstoneUse: string;
  path: string;
  externalUrl?: string;
};

export type MaestroLayer = {
  id: "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";
  name: string;
  scope: string;
  deskRelevance: string;
};

/** MAESTRO layers (Huang / CSA) — structural threat model axis for the desk. */
export const MAESTRO_LAYERS: MaestroLayer[] = [
  {
    id: "L1",
    name: "Foundation Models",
    scope: "Model weights, training pipeline, inference, base alignment.",
    deskRelevance:
      "Partner engagements with frontier lab safety teams; refusal/policy consistency tracked as process findings only.",
  },
  {
    id: "L2",
    name: "Data Operations",
    scope: "Databases, vector stores, RAG, training datasets, embeddings.",
    deskRelevance:
      "Memory/persistence risk is recorded as governance posture — no corpus contents stored here.",
  },
  {
    id: "L3",
    name: "Agent Frameworks",
    scope: "Orchestrators, tool dispatch, agent runtimes.",
    deskRelevance:
      "Highest cross-study surface. Touchstone refuses collapsing L1→L3→L4 into one trust domain in ops records.",
  },
  {
    id: "L4",
    name: "Deployment & Infrastructure",
    scope: "Containers, cloud, networks, IaC, serverless.",
    deskRelevance:
      "Maps to evidence-gated remediation boundaries (agent proposes; gate + IAM execute).",
  },
  {
    id: "L5",
    name: "Evaluation & Observability",
    scope: "Logging, metrics, anomaly detection, drift monitoring.",
    deskRelevance:
      "Disclosure pipeline and offline reference discipline are the desk’s L5 surface.",
  },
  {
    id: "L6",
    name: "Security & Compliance",
    scope: "AuthN/Z, audit trails, regulatory mapping, key management.",
    deskRelevance:
      "Governance checklist, MoUs, and Checkmate forward-only anchors live here.",
  },
  {
    id: "L7",
    name: "Agent Ecosystem",
    scope: "Registries, A2A, MCP servers, multi-agent integrations.",
    deskRelevance:
      "MCP/tool responses are inputs, never grants — see authority-boundary field note.",
  },
];

export const AUTHORITY_DISTINCTIONS = [
  {
    id: "claim",
    label: "Claim",
    note: "Narrative assertion. Never governing by itself.",
  },
  {
    id: "evidence",
    label: "Evidence",
    note: "Cited ≠ checked until a binding exists.",
  },
  {
    id: "authority",
    label: "Authority",
    note: "Verified (checked evidence) ≠ axiomatic (declared policy).",
  },
  {
    id: "state",
    label: "State",
    note: "Projected fold over the log — not a stored truth bit.",
  },
  {
    id: "truth",
    label: "Truth",
    note: "Outside the mechanical perimeter. The desk does not claim it.",
  },
] as const;

export const RESEARCH_DOCS: ResearchDoc[] = [
  {
    id: "maestro",
    title: "MAESTRO in Practice",
    kind: "framework",
    authors: "Mazze LeCzzare Frazer (compiling CSA / IriusRisk / preprint cases)",
    summary:
      "Seven-layer agentic threat model with 12 case studies. L3 (agent frameworks) is the most consistent surface; collapsing L1→L3→L4 into one trust domain is the recurring failure.",
    touchstoneUse:
      "Primary structural axis for tagging partner findings and governance coverage. Technique taxonomies stay external; the desk stores layer + process metadata only.",
    path: "vendor/research/maestro-in-practice.txt",
  },
  {
    id: "authority-boundaries",
    title: "Field Note 01 — Agent-to-Infrastructure Controls",
    kind: "field-note",
    authors: "Mazze LeCzzare Frazer",
    summary:
      "Evidence-gated remediation: tickets, CSPM findings, repo content, and MCP responses are inputs, never grants. Agent proposes; deterministic gate + IAM execute; owners approve.",
    touchstoneUse:
      "Shapes engagement next-actions and governance items for fail-closed provenance, scope, and independently observed outcomes.",
    path: "vendor/research/field-note-authority-boundaries.txt",
  },
  {
    id: "naked-truth",
    title: "The Naked Truth — Bearing & epistemic rigor",
    kind: "stack-paper",
    authors: "Mazze LeCzzare Frazer (research design)",
    summary:
      "Claim ≠ evidence ≠ authority ≠ state ≠ truth. Bearing robustness is separate from runtime authority. Stratum/STELE/Aletheia/Temenos operationalize enforceable conditions of rigor — not substantive truth.",
    touchstoneUse:
      "Keeps the desk honest: findings are operational claims; offline refs are handles; verified/axiomatic authority never silently collapses.",
    path: "vendor/research/naked-truth-bearing-rigor.md",
  },
  {
    id: "llm-attack",
    title: "LLM ATT&CK Navigator insights",
    kind: "external-analysis",
    authors: "Kyla Guru, Alex Moix, Jacob Klein (Anthropic)",
    summary:
      "External trend analysis of AI-enabled cyber operations mapped to MITRE ATT&CK. Medium+/high-risk actor share rose markedly across the study window.",
    touchstoneUse:
      "Situational awareness for partner scoping and policy escalation — not a playbook. No ATT&CK procedures are reproduced in the desk.",
    path: "vendor/research/llm-attack-navigator-anthropic.txt",
    externalUrl: "https://red.anthropic.com",
  },
];
