"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  size?: "sm" | "default" | "icon-sm";
};

export function ThemeToggle({
  className,
  size = "icon-sm",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn(
        "border-ink/20 bg-background/70 backdrop-blur dark:border-border dark:bg-card/50",
        className,
      )}
      aria-label={dark ? "Switch to light mineral mode" : "Switch to dark basalt mode"}
      aria-pressed={dark}
      onClick={toggleTheme}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
