import type {
  AuthorityBasis,
  DisclosureStage,
  EngagementStatus,
  FindingCategory,
  FindingSeverity,
  FindingStatus,
  MaestroLayerId,
  PartnerKind,
} from "@/lib/types";

export const PARTNER_KIND_LABEL: Record<PartnerKind, string> = {
  "synthesis-provider": "Synthesis provider",
  "ai-lab": "AI lab",
  repository: "Pathogen repository",
  cro: "Contract research",
  government: "Government",
  philanthropy: "Philanthropy",
  "research-org": "Research org",
};

export const ENGAGEMENT_STATUS_LABEL: Record<EngagementStatus, string> = {
  prospect: "Prospect",
  intro: "Intro",
  scoping: "Scoping",
  active: "Active",
  paused: "Paused",
  closed: "Closed",
};

export const FINDING_CATEGORY_LABEL: Record<FindingCategory, string> = {
  process: "Process",
  governance: "Governance",
  policy: "Policy",
  "vendor-ops": "Vendor ops",
  comms: "Communications",
};

export const FINDING_SEVERITY_LABEL: Record<FindingSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  intake: "Intake",
  triaged: "Triaged",
  "partner-notified": "Partner notified",
  remediating: "Remediating",
  closed: "Closed",
  "policy-escalated": "Policy escalated",
};

export const DISCLOSURE_STAGE_LABEL: Record<DisclosureStage, string> = {
  "internal-only": "Internal only",
  "partner-draft": "Partner draft",
  "partner-shared": "Partner shared",
  "remediation-tracking": "Remediation tracking",
  "public-summary": "Public summary",
  closed: "Closed",
};

export const AUTHORITY_BASIS_LABEL: Record<AuthorityBasis, string> = {
  narrative: "Narrative",
  provisional: "Provisional",
  authoritative_verified: "Verified (checked evidence)",
  authoritative_axiomatic: "Axiomatic (policy/trust root)",
};

export const MAESTRO_LAYER_LABEL: Record<MaestroLayerId, string> = {
  L1: "L1 · Foundation models",
  L2: "L2 · Data operations",
  L3: "L3 · Agent frameworks",
  L4: "L4 · Deployment",
  L5: "L5 · Evaluation & observability",
  L6: "L6 · Security & compliance",
  L7: "L7 · Agent ecosystem",
  "cross-layer": "Cross-layer",
};
