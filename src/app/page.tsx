import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TessellationField } from "@/components/tessellation-field";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="surface-mineral relative min-h-screen overflow-hidden">
      <div aria-hidden className="surface-grain absolute inset-0 z-[1] opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[36%] max-w-lg bg-[linear-gradient(105deg,oklch(0.22_0.03_255_/0.9),oklch(0.28_0.04_250_/0.35)_48%,transparent)]"
      />
      <TessellationField intensity="hero" className="z-[5]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="font-heading text-sm font-semibold tracking-[0.18em] text-ink">
          TOUCHSTONE
        </p>
        <Link
          href="/app"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-ink/20 bg-background/70 backdrop-blur",
          )}
        >
          Open desk
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-6xl flex-col justify-end px-6 pb-16 pt-10 md:justify-center md:pb-24 md:pt-0">
        <p className="animate-ink-settle font-heading text-[clamp(3.25rem,12vw,7.5rem)] font-semibold leading-[0.9] tracking-tight text-ink md:max-w-[11ch]">
          Touchstone
        </p>
        <div className="animate-assay-draw assay-rule mt-6" />
        <h1 className="animate-rise-delay mt-6 max-w-xl font-heading text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
          Assay the engagement record.
          <span className="block text-assay">Never the payload.</span>
        </h1>
        <p className="animate-rise-late mt-4 max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">
          Partner CRM, disclosure ladders, and governance for safeguard work —
          with Stratum authority, STELE tripwires, and offline refs only.
        </p>
        <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
          <Link
            href="/app"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 bg-ink text-primary-foreground hover:bg-ink/90",
            )}
          >
            Enter the desk
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/app/findings"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-ink/25 bg-background/60",
            )}
          >
            Payload-free register
          </Link>
        </div>
      </main>
    </div>
  );
}
