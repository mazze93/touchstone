import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.985_0.012_185)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-drift bg-[radial-gradient(900px_520px_at_15%_10%,oklch(0.9_0.05_185),transparent_60%),radial-gradient(700px_480px_at_85%_0%,oklch(0.92_0.04_220),transparent_55%),linear-gradient(165deg,oklch(0.97_0.02_180),oklch(0.99_0.01_200))]"
      />
      <div
        aria-hidden
        className="animate-pulse-soft pointer-events-none absolute -left-24 top-32 size-72 rounded-full bg-[oklch(0.75_0.08_175_/0.18)] blur-3xl"
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-4" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Touchstone
          </span>
        </div>
        <Link
          href="/app"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Open desk
        </Link>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col px-6 pb-20 pt-10 md:pt-20">
        <p className="animate-rise font-heading text-5xl font-semibold tracking-tight text-foreground md:text-7xl md:leading-[1.05]">
          Touchstone
        </p>
        <h1 className="animate-rise-delay mt-5 max-w-2xl text-xl text-foreground/85 md:text-2xl md:leading-snug">
          Defensive operations for safeguard engagement — partners, disclosure,
          and governance without attack payloads.
        </h1>
        <p className="animate-rise-delay mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Built on Stratum’s evidence-gated ledger, STELE’s integrity boundary,
          and Checkmate’s forward-only head anchors. Technical material stays
          offline; the desk keeps the record.
        </p>
        <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
          <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            Enter operations desk
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/app/governance"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Review governance
          </Link>
        </div>
      </main>
    </div>
  );
}
