"use client";

import Link from "next/link";
import {
  StatusBadge,
  severityTone,
  statusTone,
} from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DISCLOSURE_STAGE_LABEL,
  ENGAGEMENT_STATUS_LABEL,
  FINDING_SEVERITY_LABEL,
  FINDING_STATUS_LABEL,
  PARTNER_KIND_LABEL,
} from "@/lib/labels";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const { partners, engagements, findings, governance, hydrated } = useStore();

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading desk state…</p>
    );
  }

  const openFindings = findings.filter((f) => f.status !== "closed");
  const activePartners = partners.filter((p) =>
    ["active", "scoping", "intro"].includes(p.engagementStatus),
  );
  const govDone = governance.filter((g) => g.completed).length;
  const govRequired = governance.filter((g) => g.required).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Operations overview
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          Touchstone desk
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track provider engagements and manage findings as operational
          metadata. Technical payloads are refused here and referenced only by
          offline handles.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active partners", value: activePartners.length },
          { label: "Open findings", value: openFindings.length },
          { label: "Live engagements", value: engagements.filter((e) => e.status === "active").length },
          { label: "Governance checks", value: `${govDone}/${govRequired}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/80 bg-background/70 px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-heading text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">Disclosure pipeline</h2>
          <Link href="/app/findings" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            All findings
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/80">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Finding</th>
                <th className="px-3 py-2 font-medium">Severity</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Disclosure</th>
                <th className="px-3 py-2 font-medium">Offline ref</th>
              </tr>
            </thead>
            <tbody>
              {findings.slice(0, 5).map((f) => (
                <tr key={f.id} className="border-t border-border/70">
                  <td className="px-3 py-2.5">{f.title}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge
                      label={FINDING_SEVERITY_LABEL[f.severity]}
                      tone={severityTone(f.severity)}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge
                      label={FINDING_STATUS_LABEL[f.status]}
                      tone={statusTone(f.status)}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {DISCLOSURE_STAGE_LABEL[f.disclosureStage]}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    {f.offlineReferenceId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Partners</h2>
            <Link href="/app/partners" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              CRM
            </Link>
          </div>
          <ul className="space-y-2">
            {partners.slice(0, 4).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {PARTNER_KIND_LABEL[p.kind]} · {p.region}
                  </p>
                </div>
                <StatusBadge
                  label={ENGAGEMENT_STATUS_LABEL[p.engagementStatus]}
                  tone={statusTone(p.engagementStatus)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Next actions</h2>
            <Link href="/app/engagements" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Engagements
            </Link>
          </div>
          <ul className="space-y-2">
            {engagements.map((e) => {
              const partner = partners.find((p) => p.id === e.partnerId);
              return (
                <li
                  key={e.id}
                  className="rounded-xl border border-border/70 bg-background/60 px-3 py-2.5"
                >
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {partner?.name ?? "Unknown"} · due {e.nextActionDue}
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{e.nextAction}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
