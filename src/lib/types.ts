export type PartnerKind =
  | "synthesis-provider"
  | "ai-lab"
  | "repository"
  | "cro"
  | "government"
  | "philanthropy"
  | "research-org";

export type EngagementStatus =
  | "prospect"
  | "intro"
  | "scoping"
  | "active"
  | "paused"
  | "closed";

export type FindingCategory =
  | "process"
  | "governance"
  | "policy"
  | "vendor-ops"
  | "comms";

export type FindingSeverity = "low" | "medium" | "high" | "critical";

export type FindingStatus =
  | "intake"
  | "triaged"
  | "partner-notified"
  | "remediating"
  | "closed"
  | "policy-escalated";

export type DisclosureStage =
  | "internal-only"
  | "partner-draft"
  | "partner-shared"
  | "remediation-tracking"
  | "public-summary"
  | "closed";

/** Stratum authority basis — never collapse axiomatic into verified. */
export type AuthorityBasis =
  | "narrative"
  | "provisional"
  | "authoritative_verified"
  | "authoritative_axiomatic";

export type MaestroLayerId =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "cross-layer";

export interface Partner {
  id: string;
  name: string;
  kind: PartnerKind;
  region: string;
  primaryContact: string;
  email: string;
  engagementStatus: EngagementStatus;
  notes: string;
  lastTouch: string;
}

export interface Engagement {
  id: string;
  partnerId: string;
  title: string;
  objective: string;
  owner: string;
  status: EngagementStatus;
  nextAction: string;
  nextActionDue: string;
  createdAt: string;
}

/**
 * Findings hold operational metadata only.
 * Technical payloads, reproduction steps, sequences, prompts, and
 * bypass procedures are intentionally excluded from this system and
 * must remain in offline, access-controlled channels.
 */
export interface Finding {
  id: string;
  title: string;
  category: FindingCategory;
  severity: FindingSeverity;
  status: FindingStatus;
  disclosureStage: DisclosureStage;
  partnerId: string;
  operationalSummary: string;
  offlineReferenceId: string;
  acknowledgedNoPayload: boolean;
  owner: string;
  /** MAESTRO structural layer tag — metadata only. */
  maestroLayer: MaestroLayerId;
  /** Stratum-style authority basis for this ops claim. */
  authorityBasis: AuthorityBasis;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceItem {
  id: string;
  section: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}
