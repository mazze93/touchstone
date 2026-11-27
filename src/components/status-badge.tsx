import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground border-border/60",
  teal: "bg-[oklch(0.94_0.03_170)] text-[oklch(0.32_0.07_170)] border-[oklch(0.82_0.04_170)]",
  amber: "bg-[oklch(0.95_0.04_85)] text-[oklch(0.42_0.1_55)] border-[oklch(0.86_0.05_80)]",
  rose: "bg-[oklch(0.95_0.03_20)] text-[oklch(0.45_0.12_25)] border-[oklch(0.86_0.04_25)]",
  slate: "bg-[oklch(0.94_0.01_250)] text-[oklch(0.35_0.03_250)] border-[oklch(0.86_0.015_250)]",
  green: "bg-[oklch(0.94_0.04_145)] text-[oklch(0.35_0.08_145)] border-[oklch(0.84_0.04_145)]",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: keyof typeof toneClass;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 font-medium tracking-wide",
        toneClass[tone],
        className,
      )}
    >
      {label}
    </Badge>
  );
}

export function severityTone(severity: string) {
  if (severity === "critical" || severity === "high") return "rose" as const;
  if (severity === "medium") return "amber" as const;
  return "slate" as const;
}

export function statusTone(status: string) {
  if (status === "active" || status === "remediating" || status === "partner-notified")
    return "teal" as const;
  if (status === "closed") return "green" as const;
  if (status === "paused" || status === "policy-escalated") return "amber" as const;
  return "slate" as const;
}
