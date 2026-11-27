import { AUTHORITY_BASIS_LABEL } from "@/lib/labels";
import type { AuthorityBasis } from "@/lib/types";
import { cn } from "@/lib/utils";

const basisStyle: Record<
  AuthorityBasis,
  { bar: string; label: string; hint: string }
> = {
  narrative: {
    bar: "bg-stone",
    label: "text-muted-foreground",
    hint: "Prose only — never governing",
  },
  provisional: {
    bar: "bg-[oklch(0.62_0.1_75)]",
    label: "text-[oklch(0.4_0.08_65)]",
    hint: "Working claim — pending checks",
  },
  authoritative_verified: {
    bar: "bg-assay",
    label: "text-[oklch(0.35_0.08_170)]",
    hint: "Checked evidence binds this claim",
  },
  authoritative_axiomatic: {
    bar: "bg-ink",
    label: "text-ink",
    hint: "Declared policy / trust root",
  },
};

export function AuthorityMark({
  basis,
  className,
  showHint = true,
}: {
  basis: AuthorityBasis;
  className?: string;
  showHint?: boolean;
}) {
  const style = basisStyle[basis];
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn("h-4 w-1 shrink-0 rounded-[1px]", style.bar)}
        />
        <p className={cn("text-xs font-semibold tracking-wide", style.label)}>
          {AUTHORITY_BASIS_LABEL[basis]}
        </p>
      </div>
      {showHint ? (
        <p className="mt-0.5 pl-3 text-[11px] leading-snug text-muted-foreground">
          {style.hint}
        </p>
      ) : null}
    </div>
  );
}
