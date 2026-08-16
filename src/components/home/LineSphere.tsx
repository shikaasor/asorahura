"use client";

import { useEffect, useRef } from "react";
import { createVisibleRaf } from "@/lib/visibleRaf";
import styles from "./LineSphere.module.css";

// Port of alteredqualia's lines_sphere demo: one set of short radial line
// segments scattered over a sphere, drawn as several counter-rotating shells
// at different scales. Kept faint — it's the background layer for the whole hero.

// Segment count was tuned for the ~610x500 stage panel this used to live
// in. The orb now spans the entire hero and line density falls off with
// the square of the radius, so this is higher than the original 2400 — but
// every segment costs two trig-derived projections and a path op on every
// frame, times the shell count. 3600 across 5 shells is the point where
// the figure still reads solid without the draw becoming the most
// expensive thing on the page.
const SEGMENTS = 3600;
const CAM_DIST = 3.4;
const FOCAL = 2.4;
const TILT = -0.3;

// Sits in the gap between the two columns, pulled slightly left of centre.
// Dead-centre put the core directly under the stage panel's left edge,
// where it washed out the first stage's status line straight through the
// translucent panel — the copy side has a scrim to absorb it, the panel
// only has 35% of a background.
const CENTER_X = 0.43;
const CENTER_Y = 0.42;

// [scale, rgb, alpha, lineWidth]
// Cream carries the structure and the accents only tint the core, so the
// orb stays a light source rather than becoming a coloured object.
// The outermost shell was dropped: at 0.04 alpha it was invisible against
// the hero scrim while costing a sixth of the whole draw.
const SHELLS: [number, string, number, number][] = [
  [0.26, "205, 255, 6", 0.42, 1.6],
  [0.36, "69, 214, 127", 0.34, 1.3],
  [0.5, "69, 214, 127", 0.2, 1.1],
  [0.8, "236, 238, 235", 0.12, 1],
  [1.3, "236, 238, 235", 0.08, 1],
];

interface Segment {
  x: number;
  y: number;
  z: number;
  len: number;
}

// Deterministic directions, so the figure is identical across resizes.
function buildSegments(): Segment[] {
  let seed = 0x9e3779b9;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  return Array.from({ length: SEGMENTS }, () => {
    const z = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    return { x: r * Math.cos(t), y: r * Math.sin(t), z, len: 1 + rand() * 0.09 };
  });
}

export default function LineSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const segments = buildSegments();

    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);

    let width = 0;
    let height = 0;
    let radius = 0;
    let glow: CanvasGradient | null = null;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sized off the LARGER dimension so the outer shells run past both
      // edges of the hero — the orb should read as the space the section
      // sits inside, not as an object placed within it. Uncapped, so it
      // grows with the viewport.
      radius = Math.max(width, height) * 0.62;

      const gx = width * CENTER_X;
      const gy = height * CENTER_Y;
      glow = ctx!.createRadialGradient(gx, gy, 0, gx, gy, radius * 0.7);
      // Softer than before: at this size the same alpha became a wash
      // across the whole hero rather than a core.
      glow.addColorStop(0, "rgba(69, 214, 127, 0.13)");
      glow.addColorStop(0.45, "rgba(69, 214, 127, 0.05)");
      glow.addColorStop(1, "rgba(69, 214, 127, 0)");

      // Resizing clears the canvas, and the still frame has no loop to repaint it.
      if (reduceMotion) draw(0);
    }

    function draw(time: number) {
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, width, height);
      // Overlapping shells build up into a core, the way the original reads.
      ctx!.globalCompositeOperation = "lighter";
      ctx!.lineCap = "round";
      const cx = width * CENTER_X;
      const cy = height * CENTER_Y;

      if (glow) {
        ctx!.fillStyle = glow;
        ctx!.fillRect(0, 0, width, height);
      }

      SHELLS.forEach(([scale, rgb, alpha, lineWidth], i) => {
        const spin = time * (i < 4 ? i + 1 : -(i + 1)) * 0.045;
        const pulse = 1 + 0.045 * Math.sin(time * 0.8 + i);
        const cosSpin = Math.cos(spin);
        const sinSpin = Math.sin(spin);

        ctx!.beginPath();

        segments.forEach((seg) => {
          // rotate the direction about Y, then tilt about X
          const dx = seg.x * cosSpin + seg.z * sinSpin;
          const spunZ = -seg.x * sinSpin + seg.z * cosSpin;
          const dy = seg.y * cosTilt - spunZ * sinTilt;
          const dz = seg.y * sinTilt + spunZ * cosTilt;

          const near = scale * pulse;
          const far = near * seg.len;

          const pz1 = dz * near + CAM_DIST;
          const pz2 = dz * far + CAM_DIST;
          if (pz1 < 0.1 || pz2 < 0.1) return;

          const k1 = (FOCAL * radius) / pz1;
          const k2 = (FOCAL * radius) / pz2;

          ctx!.moveTo(cx + dx * near * k1, cy - dy * near * k1);
          ctx!.lineTo(cx + dx * far * k2, cy - dy * far * k2);
        });

        ctx!.strokeStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.lineWidth = lineWidth;
        ctx!.stroke();
      });
    }

    resize();
    // The stage is a grid cell — it can resize without the window doing so.
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);

    // Gated on the hero being on screen. This is the most expensive draw on
    // the site, and it used to keep running the entire time a visitor read
    // the rest of the page.
    const stop = createVisibleRaf(canvas, draw, { paused: reduceMotion });

    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
