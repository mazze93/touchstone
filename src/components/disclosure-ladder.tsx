import { DISCLOSURE_STAGE_LABEL } from "@/lib/labels";
import type { DisclosureStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDER: DisclosureStage[] = [
  "internal-only",
  "partner-draft",
  "partner-shared",
  "remediation-tracking",
  "public-summary",
  "closed",
];

export function DisclosureLadder({
  stage,
  className,
}: {
  stage: DisclosureStage;
  className?: string;
}) {
  const active = ORDER.indexOf(stage);

  return (
    <div className={cn("w-full", className)} aria-label={`Disclosure: ${DISCLOSURE_STAGE_LABEL[stage]}`}>
      <div className="flex items-center gap-1">
        {ORDER.map((s, i) => {
          const reached = i <= active;
          const current = i === active;
          return (
            <div key={s} className="flex min-w-0 flex-1 items-center gap-1">
              <span
                title={DISCLOSURE_STAGE_LABEL[s]}
                className={cn(
                  "h-1.5 flex-1 rounded-[1px] transition-colors",
                  reached ? "bg-assay" : "bg-border",
                  current && "ring-1 ring-assay/40 ring-offset-1 ring-offset-background",
                )}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Disclosure · {DISCLOSURE_STAGE_LABEL[stage]}
      </p>
    </div>
  );
}
