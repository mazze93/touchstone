"use client";

import {
  AUTHORITY_DISTINCTIONS,
  MAESTRO_LAYERS,
  RESEARCH_DOCS,
} from "@/lib/research/catalog";
import { StatusBadge } from "@/components/status-badge";

const kindTone = {
  framework: "teal",
  "field-note": "amber",
  "external-analysis": "slate",
  "stack-paper": "green",
} as const;

export default function ResearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Research library
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          Frameworks informing the desk
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sourced into <code className="font-mono text-xs">vendor/research/</code>.
          These materials shape governance and tagging — they are not attack
          playbooks, and the desk still refuses technical payloads.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">
          Claim ≠ evidence ≠ authority ≠ state ≠ truth
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {AUTHORITY_DISTINCTIONS.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-border/80 bg-background/70 p-3"
            >
              <p className="font-heading text-sm font-semibold">{d.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {d.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">
          MAESTRO layers (structural axis)
        </h2>
        <p className="text-sm text-muted-foreground">
          Adopted as Touchstone’s threat-model axis per{" "}
          <em>MAESTRO in Practice</em>. L3 is the most consistent surface across
          compiled case studies; the desk records layer tags, not techniques.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/80">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Layer</th>
                <th className="px-3 py-2 font-medium">Scope</th>
                <th className="px-3 py-2 font-medium">Desk relevance</th>
              </tr>
            </thead>
            <tbody>
              {MAESTRO_LAYERS.map((l) => (
                <tr key={l.id} className="border-t border-border/70 align-top">
                  <td className="px-3 py-2.5 font-medium">
                    {l.id} · {l.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{l.scope}</td>
                  <td className="px-3 py-2.5">{l.deskRelevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Documents</h2>
        <ul className="space-y-3">
          {RESEARCH_DOCS.map((doc) => (
            <li
              key={doc.id}
              className="rounded-xl border border-border/80 bg-background/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-base font-semibold">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{doc.authors}</p>
                </div>
                <StatusBadge label={doc.kind} tone={kindTone[doc.kind]} />
              </div>
              <p className="mt-2 text-sm text-foreground/85">{doc.summary}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-foreground">Touchstone use: </span>
                {doc.touchstoneUse}
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {doc.path}
                {doc.externalUrl ? ` · ${doc.externalUrl}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
