"use client";

import { useState } from "react";
import { StatusBadge, statusTone } from "@/components/status-badge";
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
import { ENGAGEMENT_STATUS_LABEL } from "@/lib/labels";
import { useStore } from "@/lib/store";
import type { EngagementStatus } from "@/lib/types";

const statuses = Object.keys(ENGAGEMENT_STATUS_LABEL) as EngagementStatus[];

export default function EngagementsPage() {
  const { partners, engagements, addEngagement, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    partnerId: "",
    title: "",
    objective: "",
    owner: "",
    status: "scoping" as EngagementStatus,
    nextAction: "",
    nextActionDue: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading engagements…</p>
    );
  }

  function submit() {
    if (!form.partnerId || !form.title.trim() || !form.nextAction.trim()) {
      setError("Partner, title, and next action are required.");
      return;
    }
    addEngagement(form);
    setOpen(false);
    setError(null);
    setForm({
      partnerId: "",
      title: "",
      objective: "",
      owner: "",
      status: "scoping",
      nextAction: "",
      nextActionDue: "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Engagements
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Active workstreams
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Scoped conversations and pilots with partners — objectives and next
            actions, not technical procedures.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm((f) => ({
              ...f,
              partnerId: partners[0]?.id ?? "",
            }));
            setOpen(true);
          }}
        >
          New engagement
        </Button>
      </div>

      <div className="grid gap-3">
        {engagements.map((e) => {
          const partner = partners.find((p) => p.id === e.partnerId);
          return (
            <article
              key={e.id}
              className="rounded-xl border border-border/80 bg-background/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-semibold">{e.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {partner?.name ?? "Unknown partner"} · owner {e.owner} ·
                    opened {e.createdAt}
                  </p>
                </div>
                <StatusBadge
                  label={ENGAGEMENT_STATUS_LABEL[e.status]}
                  tone={statusTone(e.status)}
                />
              </div>
              <p className="mt-3 text-sm text-foreground/85">{e.objective}</p>
              <p className="mt-3 text-sm">
                <span className="text-muted-foreground">Next: </span>
                {e.nextAction}{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  (due {e.nextActionDue})
                </span>
              </p>
            </article>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New engagement</DialogTitle>
            <DialogDescription>
              Capture a workstream boundary and the next non-technical action.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="partner">Partner</Label>
              <NativeSelect
                id="partner"
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="objective">Objective</Label>
              <Textarea
                id="objective"
                rows={3}
                value={form.objective}
                onChange={(e) =>
                  setForm({ ...form, objective: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="estatus">Status</Label>
                <NativeSelect
                  id="estatus"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as EngagementStatus,
                    })
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {ENGAGEMENT_STATUS_LABEL[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="next">Next action</Label>
              <Input
                id="next"
                value={form.nextAction}
                onChange={(e) =>
                  setForm({ ...form, nextAction: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="date"
                value={form.nextActionDue}
                onChange={(e) =>
                  setForm({ ...form, nextActionDue: e.target.value })
                }
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save engagement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
