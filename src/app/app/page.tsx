"use client";

import Link from "next/link";
import { AuthorityMark } from "@/components/authority-mark";
import { DisclosureLadder } from "@/components/disclosure-ladder";
import {
  StatusBadge,
  severityTone,
  statusTone,
} from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DISCLOSURE_STAGE_LABEL,
  FINDING_SEVERITY_LABEL,
  FINDING_STATUS_LABEL,
} from "@/lib/labels";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const { partners, engagements, findings, governance, refusals, hydrated } =
    useStore();

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading desk state…</p>
    );
  }

  const openFindings = findings.filter((f) => f.status !== "closed");
  const unverified = openFindings.filter(
    (f) =>
      f.authorityBasis === "narrative" || f.authorityBasis === "provisional",
  );
  const govRequired = governance.filter((g) => g.required);
  const govOpen = govRequired.filter((g) => !g.completed).length;
  const dueSoon = [...engagements].sort((a, b) =>
    a.nextActionDue.localeCompare(b.nextActionDue),
  );

  return (
    <div className="space-y-9">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Desk posture
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Assay what you can stand behind
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Touchstone keeps the engagement record — partners, disclosure stage,
          authority basis. Reproduction material stays offline.
        </p>
      </div>

      <section className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <div className="bg-card px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Boundary
          </p>
          <p className="mt-2 font-heading text-xl font-semibold text-assay">
            Holding
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {refusals.length === 0
              ? "No payload text refused this session."
              : `${refusals.length} intake refusal${refusals.length === 1 ? "" : "s"} this session.`}
          </p>
        </div>
        <div className="bg-card px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Authority debt
          </p>
          <p className="mt-2 font-heading text-xl font-semibold text-ink">
            {unverified.length}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / {openFindings.length} open
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Still narrative or provisional — not yet verified or axiomatic.
          </p>
        </div>
        <div className="bg-card px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Governance
          </p>
          <p className="mt-2 font-heading text-xl font-semibold text-ink">
            {govOpen === 0 ? "Clear" : `${govOpen} open`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Required controls before deeper partner work.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-ink">
              Disclosure ladder
            </h2>
            <p className="text-xs text-muted-foreground">
              Open findings ordered by severity — stage is the record, not the
              exploit.
            </p>
          </div>
          <Link
            href="/app/findings"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Register
          </Link>
        </div>
        <ul className="divide-y divide-border border border-border">
          {openFindings.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">
              No open findings. Intake stays payload-free.
            </li>
          ) : (
            openFindings.slice(0, 4).map((f) => (
              <li key={f.id} className="bg-card/80 px-4 py-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{f.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge
                        label={FINDING_SEVERITY_LABEL[f.severity]}
                        tone={severityTone(f.severity)}
                      />
                      <StatusBadge
                        label={FINDING_STATUS_LABEL[f.status]}
                        tone={statusTone(f.status)}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {f.offlineReferenceId}
                      </span>
                    </div>
                  </div>
                  <AuthorityMark
                    basis={f.authorityBasis}
                    className="w-44 shrink-0"
                  />
                </div>
                <DisclosureLadder stage={f.disclosureStage} className="mt-3" />
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Next assays
            </h2>
            <Link
              href="/app/engagements"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Engagements
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border">
            {dueSoon.map((e) => {
              const partner = partners.find((p) => p.id === e.partnerId);
              return (
                <li key={e.id} className="bg-card/80 px-4 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{e.title}</p>
                    <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {e.nextActionDue}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {partner?.name ?? "Unknown"}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/85">
                    {e.nextAction}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Session boundary log
            </h2>
            <Link
              href="/app/governance"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Controls
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border">
            {refusals.length === 0 ? (
              <li className="bg-card/80 px-4 py-6 text-sm text-muted-foreground">
                Refusals appear here when intake hits the desk tripwire —
                sequences, jailbreaks, reproduction steps.
              </li>
            ) : (
              refusals
                .slice()
                .reverse()
                .slice(0, 6)
                .map((r) => (
                  <li key={r.id} className="bg-card/80 px-4 py-3 text-sm">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {r.at}
                    </p>
                    <p className="mt-1 text-ink">{r.reason}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Field: {r.field}
                    </p>
                  </li>
                ))
            )}
          </ul>
          <p className="text-[11px] text-muted-foreground">
            Active partners:{" "}
            {
              partners.filter((p) =>
                ["active", "scoping", "intro"].includes(p.engagementStatus),
              ).length
            }{" "}
            · Disclosure stages tracked:{" "}
            {new Set(findings.map((f) => DISCLOSURE_STAGE_LABEL[f.disclosureStage]))
              .size}
          </p>
        </div>
      </section>
    </div>
  );
}
