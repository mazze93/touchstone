"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useStore } from "@/lib/store";

export default function GovernancePage() {
  const { governance, toggleGovernance, resetDemoData, hydrated } = useStore();

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading governance…</p>
    );
  }

  const sections = Array.from(new Set(governance.map((g) => g.section)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Governance
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            OpSec & disclosure controls
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Required controls before deeper partner work. Foundations also live
            in the Rust crates under <code className="font-mono text-xs">crates/</code>{" "}
            — Stratum ledger, STELE integrity, Checkmate forward-only anchors.
          </p>
        </div>
        <Button variant="outline" onClick={resetDemoData}>
          Reset demo data
        </Button>
      </div>

      <div className="rounded-xl border border-border/80 bg-background/70 p-4 text-sm leading-relaxed text-foreground/85">
        <p className="font-heading font-semibold">Sourced primitives</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>
            <span className="text-foreground">Stratum</span> — evidence-gated
            append-only decisions (`touchstone-ledger`)
          </li>
          <li>
            <span className="text-foreground">STELE</span> — monotonic integrity
            + desk tripwires (`touchstone-integrity`)
          </li>
          <li>
            <span className="text-foreground">Checkmate</span> — forward-only
            head hub (`touchstone-anchor`; private upstream, contract from ADR-003)
          </li>
        </ul>
      </div>

      {sections.map((section) => (
        <section key={section} className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">{section}</h2>
          <ul className="space-y-2">
            {governance
              .filter((g) => g.section === section)
              .map((g) => (
                <li
                  key={g.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background/70 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{g.title}</p>
                      {g.required ? (
                        <StatusBadge label="Required" tone="amber" />
                      ) : null}
                      <StatusBadge
                        label={g.completed ? "Complete" : "Open"}
                        tone={g.completed ? "green" : "slate"}
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {g.description}
                    </p>
                    {g.completed ? (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {g.completedBy} · {g.completedAt}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    variant={g.completed ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleGovernance(g.id, "Ops lead")}
                  >
                    {g.completed ? "Mark open" : "Mark complete"}
                  </Button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
