"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  FileWarning,
  Handshake,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { DoctrineStrip } from "@/components/doctrine-strip";
import { TessellationField } from "@/components/tessellation-field";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/partners", label: "Partners", icon: Building2 },
  { href: "/app/engagements", label: "Engagements", icon: Handshake },
  { href: "/app/findings", label: "Findings", icon: FileWarning },
  { href: "/app/governance", label: "Governance", icon: ClipboardCheck },
  { href: "/app/research", label: "Research", icon: BookOpen },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-assay bg-accent/60 font-medium text-ink"
                : "border-transparent text-muted-foreground hover:border-stone hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="surface-mineral relative min-h-screen">
      <div aria-hidden className="surface-grain absolute inset-0 z-[1] opacity-45" />
      <TessellationField intensity="desk" className="z-[2]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl gap-0 md:gap-8 md:px-6 md:py-6">
        <aside className="animate-rise hidden w-56 shrink-0 flex-col border border-border/80 bg-card/90 p-4 md:flex">
          <Link href="/" className="mb-5 px-2">
            <p className="font-heading text-lg font-semibold tracking-tight text-ink">
              Touchstone
            </p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Assay desk
            </p>
          </Link>
          <NavLinks />
          <div className="mt-auto border border-dashed border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <p className="font-heading text-xs font-semibold text-foreground">
              Boundary
            </p>
            <p className="mt-1">
              Technical payloads are refused here. Offline refs only —
              <span className="font-mono"> OFF-…</span>
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur md:hidden">
            <Link href="/" className="font-heading font-semibold tracking-tight">
              Touchstone
            </Link>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent side="left" className="w-72 p-4">
                <div className="mb-6">
                  <p className="font-heading font-semibold">Touchstone</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Assay desk
                  </p>
                </div>
                <NavLinks onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </header>

          <main className="animate-rise flex-1 px-4 py-5 md:border md:border-border/80 md:bg-card/85 md:px-7 md:py-7">
            <DoctrineStrip className="mb-6 hidden sm:flex" />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
