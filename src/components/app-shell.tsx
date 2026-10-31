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
  Shield,
} from "lucide-react";
import { useState } from "react";
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
    <nav className="flex flex-col gap-1">
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
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,oklch(0.93_0.04_180),transparent),radial-gradient(900px_500px_at_90%_0%,oklch(0.94_0.03_220),transparent),oklch(0.985_0.01_180)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-0 md:gap-6 md:px-6 md:py-6">
        <aside className="hidden w-60 shrink-0 flex-col rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur md:flex animate-rise">
          <Link href="/" className="mb-6 flex items-center gap-2 px-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="size-4" />
            </span>
            <div>
              <p className="font-heading text-base font-semibold tracking-tight">
                Touchstone
              </p>
              <p className="text-[11px] text-muted-foreground">
                Defensive ops only
              </p>
            </div>
          </Link>
          <NavLinks />
          <div className="mt-auto rounded-xl border border-dashed border-border/80 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            Technical payloads are never stored here. Use offline references
            for controlled materials.
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="size-3.5" />
              </span>
              <span className="font-heading font-semibold">Touchstone</span>
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
                <div className="mb-6 flex items-center gap-2">
                  <Shield className="size-4 text-primary" />
                  <span className="font-heading font-semibold">Touchstone</span>
                </div>
                <NavLinks onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex-1 px-4 py-5 animate-rise md:rounded-2xl md:border md:border-border/70 md:bg-card/70 md:px-6 md:py-6 md:shadow-sm md:backdrop-blur">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
