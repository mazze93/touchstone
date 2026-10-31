"use client";

import { useMemo, useState } from "react";
import {
  StatusBadge,
  severityTone,
  statusTone,
} from "@/components/status-badge";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AUTHORITY_BASIS_LABEL,
  DISCLOSURE_STAGE_LABEL,
  FINDING_CATEGORY_LABEL,
  FINDING_SEVERITY_LABEL,
  FINDING_STATUS_LABEL,
  MAESTRO_LAYER_LABEL,
} from "@/lib/labels";
import { useStore } from "@/lib/store";
import type {
  AuthorityBasis,
  DisclosureStage,
  FindingCategory,
  FindingSeverity,
  FindingStatus,
  MaestroLayerId,
} from "@/lib/types";

const categories = Object.keys(FINDING_CATEGORY_LABEL) as FindingCategory[];
const severities = Object.keys(FINDING_SEVERITY_LABEL) as FindingSeverity[];
const statuses = Object.keys(FINDING_STATUS_LABEL) as FindingStatus[];
const stages = Object.keys(DISCLOSURE_STAGE_LABEL) as DisclosureStage[];
const layers = Object.keys(MAESTRO_LAYER_LABEL) as MaestroLayerId[];
const bases = Object.keys(AUTHORITY_BASIS_LABEL) as AuthorityBasis[];

const BLOCKED =
  /(ignore\s+(previous|all|prior)|jailbreak|bypass\s+(filter|restrict|safeguard)|reproduction\s+steps|proof[-\s]?of[-\s]?concept|exploit\s+payload|\b[acgtu]{48,}\b)/i;

export default function FindingsPage() {
  const { partners, findings, addFinding, updateFinding, hydrated } =
    useStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "process" as FindingCategory,
    severity: "medium" as FindingSeverity,
    status: "intake" as FindingStatus,
    disclosureStage: "internal-only" as DisclosureStage,
    partnerId: "",
    operationalSummary: "",
    offlineReferenceId: "",
    owner: "",
    acknowledgedNoPayload: false,
    maestroLayer: "L6" as MaestroLayerId,
    authorityBasis: "provisional" as AuthorityBasis,
  });

  const partnerName = useMemo(() => {
    const map = new Map(partners.map((p) => [p.id, p.name]));
    return (id: string) => map.get(id) ?? "Unknown";
  }, [partners]);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Loading findings…</p>;
  }

  function submit() {
    if (!form.title.trim() || !form.partnerId || !form.operationalSummary.trim()) {
      setError("Title, partner, and operational summary are required.");
      return;
    }
    if (!form.acknowledgedNoPayload) {
      setError("Confirm that no technical payload is being stored.");
      return;
    }
    if (!/^OFF-[A-Z0-9-]+$/i.test(form.offlineReferenceId.trim())) {
      setError("Offline reference must look like OFF-2026-0041.");
      return;
    }
    if (
      BLOCKED.test(form.title) ||
      BLOCKED.test(form.operationalSummary) ||
      BLOCKED.test(form.offlineReferenceId)
    ) {
      setError(
        "Desk boundary refused this text. Keep sequences, jailbreaks, and reproduction steps offline.",
      );
      return;
    }
    addFinding({
      ...form,
      offlineReferenceId: form.offlineReferenceId.trim().toUpperCase(),
      acknowledgedNoPayload: true,
    });
    setOpen(false);
    setError(null);
    setForm({
      title: "",
      category: "process",
      severity: "medium",
      status: "intake",
      disclosureStage: "internal-only",
      partnerId: "",
      operationalSummary: "",
      offlineReferenceId: "",
      owner: "",
      acknowledgedNoPayload: false,
      maestroLayer: "L6",
      authorityBasis: "provisional",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Findings
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Payload-free register
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Operational metadata and disclosure stage only. Technical detail
            lives behind an offline reference id — never in this system.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm((f) => ({ ...f, partnerId: partners[0]?.id ?? "" }));
            setOpen(true);
          }}
        >
          Intake finding
        </Button>
      </div>

      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
        Boundary rule: titles and summaries describe process, policy, or
        communications outcomes. If material would help someone reproduce a
        bypass, it does not belong here.
      </div>

      <div className="grid gap-3">
        {findings.map((f) => (
          <article
            key={f.id}
            className="rounded-xl border border-border/80 bg-background/70 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-semibold">{f.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {partnerName(f.partnerId)} · {FINDING_CATEGORY_LABEL[f.category]}{" "}
                  · owner {f.owner}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge
                  label={FINDING_SEVERITY_LABEL[f.severity]}
                  tone={severityTone(f.severity)}
                />
                <StatusBadge
                  label={FINDING_STATUS_LABEL[f.status]}
                  tone={statusTone(f.status)}
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/85">
              {f.operationalSummary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                Disclosure: {DISCLOSURE_STAGE_LABEL[f.disclosureStage]}
              </span>
              <span>{MAESTRO_LAYER_LABEL[f.maestroLayer]}</span>
              <span>{AUTHORITY_BASIS_LABEL[f.authorityBasis]}</span>
              <span className="font-mono">{f.offlineReferenceId}</span>
              <span>Updated {f.updatedAt}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <NativeSelect
                className="w-auto"
                value={f.status}
                onChange={(e) =>
                  updateFinding(f.id, {
                    status: e.target.value as FindingStatus,
                  })
                }
                aria-label="Update status"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {FINDING_STATUS_LABEL[s]}
                  </option>
                ))}
              </NativeSelect>
              <NativeSelect
                className="w-auto"
                value={f.disclosureStage}
                onChange={(e) =>
                  updateFinding(f.id, {
                    disclosureStage: e.target.value as DisclosureStage,
                  })
                }
                aria-label="Update disclosure stage"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {DISCLOSURE_STAGE_LABEL[s]}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Intake finding</DialogTitle>
            <DialogDescription>
              Operational summary only. Paste an offline vault id for technical
              material — never the material itself.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ftitle">Title</Label>
              <Input
                id="ftitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <NativeSelect
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as FindingCategory,
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {FINDING_CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label>Severity</Label>
                <NativeSelect
                  value={form.severity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      severity: e.target.value as FindingSeverity,
                    })
                  }
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>
                      {FINDING_SEVERITY_LABEL[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Partner</Label>
              <NativeSelect
                value={form.partnerId}
                onChange={(e) =>
                  setForm({ ...form, partnerId: e.target.value })
                }
              >
                <option value="">Select…</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="summary">Operational summary</Label>
              <Textarea
                id="summary"
                rows={4}
                value={form.operationalSummary}
                onChange={(e) =>
                  setForm({ ...form, operationalSummary: e.target.value })
                }
                placeholder="What changed in process/policy/comms? Who owns remediation?"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="off">Offline reference</Label>
                <Input
                  id="off"
                  placeholder="OFF-2026-0041"
                  value={form.offlineReferenceId}
                  onChange={(e) =>
                    setForm({ ...form, offlineReferenceId: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>MAESTRO layer</Label>
                <NativeSelect
                  value={form.maestroLayer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maestroLayer: e.target.value as MaestroLayerId,
                    })
                  }
                >
                  {layers.map((l) => (
                    <option key={l} value={l}>
                      {MAESTRO_LAYER_LABEL[l]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label>Authority basis</Label>
                <NativeSelect
                  value={form.authorityBasis}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      authorityBasis: e.target.value as AuthorityBasis,
                    })
                  }
                >
                  {bases.map((b) => (
                    <option key={b} value={b}>
                      {AUTHORITY_BASIS_LABEL[b]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.acknowledgedNoPayload}
                onChange={(e) =>
                  setForm({
                    ...form,
                    acknowledgedNoPayload: e.target.checked,
                  })
                }
              />
              <span>
                I confirm this record contains no sequences, prompts,
                reproduction steps, or other attack payloads.
              </span>
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save finding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
