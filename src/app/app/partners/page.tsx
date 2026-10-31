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
import {
  ENGAGEMENT_STATUS_LABEL,
  PARTNER_KIND_LABEL,
} from "@/lib/labels";
import { useStore } from "@/lib/store";
import type { EngagementStatus, PartnerKind } from "@/lib/types";

const kinds = Object.keys(PARTNER_KIND_LABEL) as PartnerKind[];
const statuses = Object.keys(ENGAGEMENT_STATUS_LABEL) as EngagementStatus[];

export default function PartnersPage() {
  const { partners, addPartner, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    kind: "synthesis-provider" as PartnerKind,
    region: "",
    primaryContact: "",
    email: "",
    engagementStatus: "prospect" as EngagementStatus,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Loading partners…</p>;
  }

  function submit() {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    addPartner(form);
    setOpen(false);
    setError(null);
    setForm({
      name: "",
      kind: "synthesis-provider",
      region: "",
      primaryContact: "",
      email: "",
      engagementStatus: "prospect",
      notes: "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Partner CRM
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Partners
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Synthesis providers, AI lab safety teams, repositories, and policy
            bodies — engagement status only.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Add partner</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Organization</th>
              <th className="px-3 py-2 font-medium">Kind</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Last touch</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-t border-border/70 align-top">
                <td className="px-3 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.primaryContact} · {p.email}
                  </p>
                  {p.notes ? (
                    <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3">{PARTNER_KIND_LABEL[p.kind]}</td>
                <td className="px-3 py-3">{p.region}</td>
                <td className="px-3 py-3">
                  <StatusBadge
                    label={ENGAGEMENT_STATUS_LABEL[p.engagementStatus]}
                    tone={statusTone(p.engagementStatus)}
                  />
                </td>
                <td className="px-3 py-3 font-mono text-xs">{p.lastTouch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add partner</DialogTitle>
            <DialogDescription>
              Record an organization for coordinated engagement. No technical
              artifacts belong in this form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Organization</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="kind">Kind</Label>
                <NativeSelect
                  id="kind"
                  value={form.kind}
                  onChange={(e) =>
                    setForm({ ...form, kind: e.target.value as PartnerKind })
                  }
                >
                  {kinds.map((k) => (
                    <option key={k} value={k}>
                      {PARTNER_KIND_LABEL[k]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <NativeSelect
                  id="status"
                  value={form.engagementStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      engagementStatus: e.target.value as EngagementStatus,
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
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="contact">Primary contact</Label>
                <Input
                  id="contact"
                  value={form.primaryContact}
                  onChange={(e) =>
                    setForm({ ...form, primaryContact: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
