"use client";

import { useEffect, useRef } from "react";
import styles from "./GlyphLadder.module.css";

type Vec3 = [number, number, number];

interface Face {
  verts: Vec3[];
  n: Vec3;
}

interface TrailPoint {
  x: number;
  y: number;
  s: number;
}

const RAMP = " .·:+/#$";
const GRANULARITY = 8;
const INK: [number, number, number] = [31, 27, 23];
const GOLD: [number, number, number] = [161, 133, 74];

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}
function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
}
function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
}
function transform(p: Vec3, theta: number, tilt: number): Vec3 {
  return rotX(rotY(p, theta), tilt);
}

const CAM_DIST = 6.2;
const FOCAL = 3.4;

function project(p: Vec3, cx: number, cy: number, scale: number) {
  const pz = p[2] + CAM_DIST;
  return { x: cx + (p[0] / pz) * FOCAL * scale, y: cy - (p[1] / pz) * FOCAL * scale, z: pz };
}

const LIGHT = normalize([0.45, 0.8, 0.5]);

const STEPS = 5;
const BOX_W = 0.85;
const GAP = 0.18;
const DEPTH = 0.95;
const HEIGHTS = [0.55, 1.0, 1.5, 2.0, 2.55];
const TOTAL_W = STEPS * BOX_W + (STEPS - 1) * GAP;
const START_X = -TOTAL_W / 2;

const BOXES = Array.from({ length: STEPS }, (_, i) => {
  const x0 = START_X + i * (BOX_W + GAP);
  return { x0, x1: x0 + BOX_W, h: HEIGHTS[i] };
});

function faceSet(box: { x0: number; x1: number; h: number }, theta: number): Face[] {
  const { x0, x1, h } = box;
  const z0 = -DEPTH / 2;
  const z1 = DEPTH / 2;
  const sideAtRight = theta >= 0;
  const top: Face = {
    verts: [
      [x0, h, z0],
      [x1, h, z0],
      [x1, h, z1],
      [x0, h, z1],
    ],
    n: [0, 1, 0],
  };
  const front: Face = {
    verts: [
      [x0, 0, z1],
      [x1, 0, z1],
      [x1, h, z1],
      [x0, h, z1],
    ],
    n: [0, 0, 1],
  };
  const side: Face = sideAtRight
    ? {
        verts: [
          [x1, 0, z0],
          [x1, 0, z1],
          [x1, h, z1],
          [x1, h, z0],
        ],
        n: [1, 0, 0],
      }
    : {
        verts: [
          [x0, 0, z1],
          [x0, 0, z0],
          [x0, h, z0],
          [x0, h, z1],
        ],
        n: [-1, 0, 0],
      };
  return [side, front, top];
}

function hashCell(x: number, y: number) {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function easeOutCubic(x: number) {
  const c = Math.max(0, Math.min(1, x));
  return 1 - Math.pow(1 - c, 3);
}

export default function GlyphLadder() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    const scene = document.createElement("canvas");
    const sctx = scene.getContext("2d", { willReadFrequently: true });
    if (!ctx || !sctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const trail: TrailPoint[] = [];
    let pointerActive = false;

    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      trail.unshift({ x: e.clientX - rect.left, y: e.clientY - rect.top, s: 1 });
      if (trail.length > 10) trail.pop();
      pointerActive = true;
    }
    function onLeave() {
      pointerActive = false;
    }
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas!.width = width;
      canvas!.height = height;
      scene.width = width;
      scene.height = height;
      ctx!.font = `${GRANULARITY + 3}px "IBM Plex Mono", Consolas, Menlo, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
    }
    resize();
    window.addEventListener("resize", resize);

    function renderScene(theta: number) {
      sctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height * 0.62;
      const scale = Math.min(width, height) * 0.5;
      const polys: { proj: { x: number; y: number; z: number }[]; z: number; b: number }[] = [];

      BOXES.forEach((box) => {
        faceSet(box, theta).forEach((face) => {
          const pts = face.verts.map((v) => transform(v, theta, -0.38));
          const n = transform(face.n, theta, -0.38);
          const view = normalize([0, 0, CAM_DIST]);
          if (dot(n, view) <= 0.02) return;
          const proj = pts.map((p) => project(p, cx, cy, scale));
          const avgZ = proj.reduce((s, p) => s + p.z, 0) / proj.length;
          const b = Math.max(0.14, Math.min(1, dot(n, LIGHT)));
          polys.push({ proj, z: avgZ, b });
        });
      });

      polys.sort((a, b) => b.z - a.z);
      polys.forEach((poly) => {
        const v = Math.round(poly.b * 255);
        sctx!.fillStyle = `rgb(${v},${v},${v})`;
        sctx!.beginPath();
        poly.proj.forEach((p, idx) => (idx === 0 ? sctx!.moveTo(p.x, p.y) : sctx!.lineTo(p.x, p.y)));
        sctx!.closePath();
        sctx!.fill();
      });
    }

    function composite(reveal: number) {
      const data = sctx!.getImageData(0, 0, width, height).data;
      ctx!.clearRect(0, 0, width, height);

      for (let gy = 0; gy < height; gy += GRANULARITY) {
        for (let gx = 0; gx < width; gx += GRANULARITY) {
          const px = Math.min(width - 1, gx + Math.floor(GRANULARITY / 2));
          const py = Math.min(height - 1, gy + Math.floor(GRANULARITY / 2));
          const idx = (py * width + px) * 4;
          const a = data[idx + 3];
          if (a < 12) continue;

          const cellHash = hashCell(gx * 0.13, gy * 0.13);
          if (reveal < cellHash * 0.92) continue;

          const lum = data[idx] / 255;
          const density = 1 - lum;

          const leftA = gx >= GRANULARITY ? data[(py * width + (px - GRANULARITY)) * 4 + 3] : 0;
          const rightA = gx + GRANULARITY < width ? data[(py * width + (px + GRANULARITY)) * 4 + 3] : 0;
          const edge = leftA < 12 || rightA < 12;

          let trailStrength = 0;
          if (pointerActive) {
            for (let t = 0; t < trail.length; t++) {
              const dx = trail[t].x - gx;
              const dy = trail[t].y - gy;
              const d = Math.sqrt(dx * dx + dy * dy);
              const s = trail[t].s * (1 - t / trail.length) * Math.max(0, 1 - d / 46);
              if (s > trailStrength) trailStrength = s;
            }
          }

          const rampIdx = Math.min(RAMP.length - 1, Math.floor(density * RAMP.length));
          let ch = RAMP.charAt(rampIdx);
          if (density > 0.82 && (Math.floor(gx / GRANULARITY) + Math.floor(gy / GRANULARITY)) % 11 === 0) {
            ch = "$";
          }

          const useGold = edge && trailStrength > 0.12;
          const col = useGold ? GOLD : INK;
          const alpha = useGold ? Math.min(1, 0.5 + trailStrength) : 0.32 + density * 0.62;

          ctx!.globalAlpha = alpha;
          ctx!.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
          ctx!.fillText(ch, gx + GRANULARITY / 2, gy + GRANULARITY / 2);
        }
      }
      ctx!.globalAlpha = 1;
    }

    const start = performance.now();
    let mouseTheta = 0;
    let rafId = 0;

    function frame(now: number) {
      const elapsed = (now - start) / 1000;
      const reveal = reduceMotion ? 1 : Math.min(1, easeOutCubic(elapsed / 1.5));
      const autoTheta = reduceMotion ? 0.22 : Math.sin(now * 0.00014) * 0.32;
      const targetTheta = pointerActive && trail[0] ? (trail[0].x / width - 0.5) * 0.7 : 0;
      mouseTheta += (targetTheta - mouseTheta) * 0.06;

      renderScene(autoTheta + mouseTheta);
      composite(reveal);
      trail.forEach((p) => (p.s *= 0.93));

      if (!reduceMotion) rafId = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      renderScene(0.22);
      composite(1);
    } else {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      wrap!.removeEventListener("pointermove", onMove);
      wrap!.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.caption}>the ladder, materializing</span>
    </div>
  );
}
