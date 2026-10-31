import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  teal: "bg-[oklch(0.94_0.03_180)] text-[oklch(0.32_0.06_180)] border-transparent",
  amber: "bg-[oklch(0.95_0.04_85)] text-[oklch(0.42_0.1_55)] border-transparent",
  rose: "bg-[oklch(0.95_0.03_20)] text-[oklch(0.45_0.12_25)] border-transparent",
  slate: "bg-[oklch(0.93_0.01_220)] text-[oklch(0.35_0.03_230)] border-transparent",
  green: "bg-[oklch(0.94_0.04_145)] text-[oklch(0.35_0.08_145)] border-transparent",
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
