"use client";

import { useEffect, useId, useRef } from "react";

const SQRT3 = Math.sqrt(3);

type Hex = {
  x: number;
  y: number;
  lift: number;
  glow: number;
};

function hexCenter(q: number, r: number, size: number) {
  return {
    x: size * SQRT3 * (q + r / 2),
    y: size * 1.5 * r,
  };
}

function hexPath(cx: number, cy: number, size: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push(
      `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`,
    );
  }
  return `M${pts.join("L")}Z`;
}

function readCssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

type TessellationFieldProps = {
  className?: string;
  intensity?: "hero" | "desk";
};

export function TessellationField({
  className = "",
  intensity = "hero",
}: TessellationFieldProps) {
  const reactId = useId().replace(/:/g, "");
  const patternId = `tess-imprint-${reactId}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const showCursor = intensity === "hero";
    const cursorEl = cursorRef.current;

    const hexes: Hex[] = [];
    let size = 30;
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let alive = true;
    let dark = document.documentElement.classList.contains("dark");

    const syncSvgTheme = () => {
      dark = document.documentElement.classList.contains("dark");
      const fill = readCssColor("--hex-fill", "rgba(22, 28, 40, 0.16)");
      const stroke = readCssColor("--hex-stroke", "rgba(18, 24, 36, 0.88)");
      const svg = svgRef.current;
      if (!svg) return;
      svg.querySelectorAll("path").forEach((path) => {
        path.setAttribute("fill", fill);
        path.setAttribute("stroke", stroke);
      });
      svg.style.opacity = String(
        intensity === "hero" ? (dark ? 0.85 : 0.72) : dark ? 0.45 : 0.35,
      );
    };

    const rebuild = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      size =
        intensity === "hero"
          ? Math.max(26, Math.min(38, w / 36))
          : Math.max(18, Math.min(26, w / 48));

      const cols = Math.ceil(w / (size * SQRT3)) + 4;
      const rows = Math.ceil(h / (size * 1.5)) + 4;
      const offsetX = -size * SQRT3;
      const offsetY = -size * 1.5;

      hexes.length = 0;
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const { x, y } = hexCenter(q, r, size);
          hexes.push({
            x: x + offsetX,
            y: y + offsetY,
            lift: 0,
            glow: 0,
          });
        }
      }
      canvas.dataset.hexCount = String(hexes.length);
      canvas.dataset.grid = `${cols}x${rows}@${size.toFixed(1)}`;
      canvas.dataset.theme = dark ? "dark" : "light";
      syncSvgTheme();
    };

    const draw = () => {
      if (!alive) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const reach = size * (intensity === "hero" ? 5.4 : 3.6);
      const liftMax = intensity === "hero" ? 12 : 5;

      for (const hex of hexes) {
        const dist = Math.hypot(pointer.x - hex.x, pointer.y - hex.y);
        const target =
          pointer.active && dist < reach
            ? Math.pow(1 - dist / reach, 1.2)
            : 0;
        const ease = reducedMotion ? 1 : 0.32;
        hex.lift += (target - hex.lift) * ease;
        hex.glow += (target - hex.glow) * ease;
        if (hex.glow < 0.002 && target === 0) {
          hex.lift = 0;
          hex.glow = 0;
          continue;
        }

        const lift = hex.lift * liftMax;
        const cx = hex.x;
        const cy = hex.y - lift;
        const path = new Path2D(hexPath(cx, cy, size * 0.9));

        ctx.save();
        ctx.shadowColor = `rgba(56, 140, 120, ${0.25 + hex.glow * 0.75})`;
        ctx.shadowBlur = 14 + hex.glow * 32;
        ctx.fillStyle = `rgba(64, 148, 128, ${hex.glow * (dark ? 0.4 : 0.32)})`;
        ctx.fill(path);
        ctx.strokeStyle = `rgba(72, 168, 142, ${0.45 + hex.glow * 0.55})`;
        ctx.lineWidth = 1.8 + hex.glow * 1.5;
        ctx.stroke(path);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, 1.8 + hex.glow * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 190, 160, ${hex.glow * 0.95})`;
        ctx.fill();
      }

      canvas.dataset.frames = String(
        (Number(canvas.dataset.frames) || 0) + 1,
      );
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      if (showCursor && cursorEl) {
        cursorEl.style.opacity = "1";
        cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onLeave = () => {
      pointer.active = false;
      if (cursorEl) cursorEl.style.opacity = "0";
    };

    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.classList.contains("dark");
      if (next !== dark) rebuild();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    rebuild();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", rebuild);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    if (showCursor) {
      document.documentElement.classList.add("tessellation-cursor");
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("tessellation-cursor");
    };
  }, [intensity]);

  const isHero = intensity === "hero";
  const s = isHero ? 34 : 24;
  const tileW = s * SQRT3;
  const tileH = s * 3;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 size-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: isHero ? 0.72 : 0.35 }}
      >
        <defs>
          <pattern
            id={patternId}
            width={tileW}
            height={tileH}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={hexPath(tileW * 0.5, s * 0.75, s * 0.88)}
              fill="rgba(22, 28, 40, 0.18)"
              stroke="rgba(18, 24, 36, 0.92)"
              strokeWidth="1.4"
            />
            <path
              d={hexPath(0, s * 2.25, s * 0.88)}
              fill="rgba(22, 28, 40, 0.14)"
              stroke="rgba(18, 24, 36, 0.88)"
              strokeWidth="1.4"
            />
            <path
              d={hexPath(tileW, s * 2.25, s * 0.88)}
              fill="rgba(22, 28, 40, 0.14)"
              stroke="rgba(18, 24, 36, 0.88)"
              strokeWidth="1.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />

      {isHero ? (
        <div
          ref={cursorRef}
          className="tessellation-cursor-dot pointer-events-none fixed top-0 left-0 z-[80] opacity-0"
        />
      ) : null}
    </div>
  );
}
