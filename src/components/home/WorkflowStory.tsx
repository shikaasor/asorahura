"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./WorkflowStory.module.css";

const RAMP = " .·:+*#%@";
const GRANULARITY = 7;
const INK: [number, number, number] = [31, 27, 23];
const GOLD: [number, number, number] = [161, 133, 74];

type Point = [number, number];

interface WorkflowNode {
  chaos: Point;
  clean: Point;
}

const NODES: WorkflowNode[] = [
  { chaos: [-0.78, -0.5], clean: [-0.85, 0] },
  { chaos: [-0.22, 0.62], clean: [-0.5, 0] },
  { chaos: [0.18, -0.68], clean: [-0.16, 0] },
  { chaos: [0.58, 0.48], clean: [0.16, 0] },
  { chaos: [0.08, 0.08], clean: [0.5, 0] },
  { chaos: [0.78, -0.22], clean: [0.85, 0] },
];

interface WorkflowEdge {
  a: number;
  b: number;
  redundant: boolean;
  bow: number;
}

const EDGES: WorkflowEdge[] = [
  { a: 0, b: 1, redundant: false, bow: 0 },
  { a: 1, b: 2, redundant: false, bow: 0 },
  { a: 2, b: 1, redundant: true, bow: 40 },
  { a: 1, b: 3, redundant: true, bow: -50 },
  { a: 3, b: 2, redundant: false, bow: 0 },
  { a: 2, b: 4, redundant: false, bow: 0 },
  { a: 4, b: 3, redundant: true, bow: 45 },
  { a: 4, b: 5, redundant: false, bow: 0 },
  { a: 3, b: 5, redundant: true, bow: -40 },
];

interface Packet {
  edge: number;
  t: number;
  speed: number;
}

const STAGES = [
  {
    label: "STATE 01 — CHAOS",
    heading: "The problem isn't always the amount of work.",
    body: "It's how many times the work has to move.",
  },
  {
    label: "STATE 02 — CONNECTION",
    heading: "We map the workflow before we automate it.",
    body: "Automating a broken process only makes the broken process faster.",
  },
  {
    label: "STATE 03 — AUTOMATION",
    heading: "Then the unnecessary steps disappear.",
    body: "Connect the tools you already use. Remove repetitive handoffs. Automate predictable decisions. Keep judgment calls in your hands.",
  },
  {
    label: "STATE 04 — LEVERAGE",
    heading: "The work gets quieter.",
    body: "You get your time back.",
    cta: true,
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function hashCell(x: number, y: number) {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export default function WorkflowStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    let cols = 0;
    let rows = 0;
    let progress = 0;
    let activeStage = -1;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      cols = Math.ceil(width / GRANULARITY);
      rows = Math.ceil(height / GRANULARITY);
      canvas!.width = width;
      canvas!.height = height;
      scene.width = cols;
      scene.height = rows;
      ctx!.font = `${GRANULARITY + 3}px "IBM Plex Mono", Consolas, Menlo, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
    }
    resize();
    window.addEventListener("resize", resize);

    function updateProgress() {
      const rect = wrap!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      const stageIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
      if (stageIndex !== activeStage) {
        activeStage = stageIndex;
        stageRefs.current.forEach((el, i) => {
          if (!el) return;
          el.classList.toggle(styles.active, i === activeStage);
        });
      }
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const packets: Packet[] = Array.from({ length: 44 }, () => ({
      edge: Math.floor(Math.random() * EDGES.length),
      t: Math.random(),
      speed: 0.4 + Math.random() * 0.4,
    }));

    function nodePos(i: number, eased: number, cx: number, cy: number, scale: number) {
      const n = NODES[i];
      const x = lerp(n.chaos[0], n.clean[0], eased);
      const y = lerp(n.chaos[1], n.clean[1], eased);
      return { x: cx + x * scale, y: cy + y * scale };
    }

    let framePackets: { x: number; y: number }[] = [];

    // Scene is rendered directly at glyph-grid resolution (cols x rows), not
    // full pixel resolution — keeps getImageData() cheap enough to run every
    // frame across a full-viewport section.
    function renderScene(p: number) {
      sctx!.clearRect(0, 0, cols, rows);
      const cx = cols / 2;
      const cy = rows / 2;
      const scale = Math.min(cols, rows) * 0.42;
      const eased = easeInOut(p);

      const positions = NODES.map((_, i) => nodePos(i, eased, cx, cy, scale));
      const redundantFade = p < 0.6 ? 1 : Math.max(0, 1 - (p - 0.6) / 0.15);

      sctx!.lineCap = "round";
      EDGES.forEach((e) => {
        if (e.redundant && redundantFade <= 0.02) return;
        const a = positions[e.a];
        const b = positions[e.b];
        const alpha = e.redundant ? 0.4 * redundantFade : 0.9;
        sctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
        sctx!.lineWidth = e.redundant ? 0.6 : 1;
        sctx!.beginPath();
        sctx!.moveTo(a.x, a.y);
        const bow = e.bow / GRANULARITY;
        const mx = (a.x + b.x) / 2 + (e.redundant ? bow : 0);
        const my = (a.y + b.y) / 2 + (e.redundant ? -bow * 0.4 : 0);
        sctx!.quadraticCurveTo(mx, my, b.x, b.y);
        sctx!.stroke();
      });

      positions.forEach((pos) => {
        sctx!.fillStyle = "rgba(255,255,255,0.95)";
        sctx!.beginPath();
        sctx!.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
        sctx!.fill();
      });

      const packetCount = Math.round(lerp(44, 12, p));
      const packetSpeed = lerp(0.5, 1.6, p);
      const usableEdges = EDGES.filter((e) => !e.redundant || redundantFade > 0.05);
      framePackets = [];

      for (let i = 0; i < packetCount; i++) {
        const packet = packets[i];
        if (!reduceMotion) {
          packet.t += packet.speed * packetSpeed * 0.012;
          if (packet.t > 1) {
            packet.t = 0;
            packet.edge = Math.floor(Math.random() * usableEdges.length);
          }
        }
        const e = usableEdges[packet.edge % usableEdges.length];
        if (!e) continue;
        const a = positions[e.a];
        const b = positions[e.b];
        const x = lerp(a.x, b.x, packet.t);
        const y = lerp(a.y, b.y, packet.t);
        sctx!.fillStyle = "rgba(255,255,255,1)";
        sctx!.beginPath();
        sctx!.arc(x, y, 0.9, 0, Math.PI * 2);
        sctx!.fill();
        framePackets.push({ x, y });
      }
    }

    function composite() {
      const data = sctx!.getImageData(0, 0, cols, rows).data;
      ctx!.clearRect(0, 0, width, height);

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const idx = (gy * cols + gx) * 4;
          const alpha = data[idx + 3];
          if (alpha < 10) continue;

          const density = alpha / 255;

          const leftA = gx > 0 ? data[(gy * cols + (gx - 1)) * 4 + 3] : 0;
          const rightA = gx + 1 < cols ? data[(gy * cols + (gx + 1)) * 4 + 3] : 0;
          const edge = leftA < 10 || rightA < 10;

          let packetStrength = 0;
          for (let t = 0; t < framePackets.length; t++) {
            const dx = framePackets[t].x - gx;
            const dy = framePackets[t].y - gy;
            const d = Math.sqrt(dx * dx + dy * dy);
            const s = Math.max(0, 1 - d / 4);
            if (s > packetStrength) packetStrength = s;
          }

          const rampIdx = Math.min(RAMP.length - 1, Math.floor(density * RAMP.length));
          let ch = RAMP.charAt(rampIdx);
          if (edge && (gx + gy) % 9 === 0) {
            ch = "%";
          }

          const usesGold = packetStrength > 0.1;
          const col = usesGold ? GOLD : INK;
          const drawAlpha = usesGold ? Math.min(1, 0.55 + packetStrength) : 0.25 + density * 0.55;

          ctx!.globalAlpha = drawAlpha;
          ctx!.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
          ctx!.fillText(ch, gx * GRANULARITY + GRANULARITY / 2, gy * GRANULARITY + GRANULARITY / 2);
        }
      }
      ctx!.globalAlpha = 1;
    }

    let rafId = 0;
    function frame() {
      renderScene(progress);
      composite();
      if (!reduceMotion) rafId = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      const onReducedScroll = () => {
        updateProgress();
        renderScene(progress);
        composite();
      };
      window.addEventListener("scroll", onReducedScroll, { passive: true });
      renderScene(progress);
      composite();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("scroll", onReducedScroll);
      };
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <section className={styles.wrapper} ref={wrapRef}>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.copyStack}>
          {STAGES.map((stage, i) => (
            <div
              key={stage.label}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className={`${styles.stage} ${i === 0 ? styles.active : ""}`}
            >
              <p className={styles.label}>{stage.label}</p>
              <h2 className={styles.heading}>{stage.heading}</h2>
              <p className={styles.body}>{stage.body}</p>
              {stage.cta && (
                <Link href="/automate" className={styles.cta}>
                  See the automations →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
