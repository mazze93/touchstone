import { AUTHORITY_DISTINCTIONS } from "@/lib/research/catalog";
import { cn } from "@/lib/utils";

export function DoctrineStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 border-y border-border/80 py-2 text-[11px] tracking-[0.04em] text-muted-foreground uppercase",
        className,
      )}
      aria-label="Desk doctrine"
    >
      {AUTHORITY_DISTINCTIONS.map((d, i) => (
        <span key={d.id} className="inline-flex items-baseline gap-2">
          {i > 0 ? (
            <span aria-hidden className="text-assay/70">
              ≠
            </span>
          ) : null}
          <span className="font-heading text-[12px] font-semibold normal-case tracking-tight text-foreground">
            {d.label}
          </span>
        </span>
      ))}
    </div>
  );
}
