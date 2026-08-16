"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProcessPills.module.css";

// The hero's automation, running — as a race rather than a checklist.
//
// Two lanes run the same four stages left to right: the automation clears
// all four in seconds, while the manual lane is still working its first
// handoff. Showing them on a shared timeline is the whole point; a single
// lane proves the steps happen but says nothing about what they cost.

const STAGES = [
  { label: "Comment", running: "Watching comments…", done: "Comment captured" },
  { label: "DM sent", running: "Sending the DM…", done: "DM delivered" },
  { label: "Qualified", running: "Qualifying…", done: "Lead qualified" },
  { label: "In CRM", running: "Writing to CRM…", done: "Booked at 3:14am" },
];

// One full cycle of the loop, in ms. The automation finishes inside the
// first AUTO_SHARE of it; the rest of the cycle is dwell time on the
// finished state so the contrast has a moment to land.
const CYCLE_MS = 9000;
const AUTO_SHARE = 0.42;
// Where the manual lane gets to in the same wall-clock time.
const MANUAL_SHARE = 0.62;

// Wall-clock the two lanes claim by the end of a full run.
const AUTO_SECONDS = 3.1;
const MANUAL_MINUTES = 47;

const ORB_POINTS = 40;
const ORB_SIZE = 18;

function ThinkingOrb({ spinning }: { spinning: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = ORB_SIZE * dpr;
    canvas.height = ORB_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fibonacci sphere — evenly spread points, no clumping.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: ORB_POINTS }, (_, i) => {
      const y = 1 - (i / (ORB_POINTS - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    const c = ORB_SIZE / 2;
    const radius = ORB_SIZE * 0.38;

    function draw(spin: number) {
      ctx!.clearRect(0, 0, ORB_SIZE, ORB_SIZE);
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);

      points.forEach((p) => {
        const x = p.x * cos + p.z * sin;
        const z = -p.x * sin + p.z * cos;
        const depth = (z + 1) / 2; // 0 = back, 1 = front
        const scale = 0.72 + depth * 0.28;

        ctx!.beginPath();
        ctx!.arc(c + x * radius * scale, c - p.y * radius * scale, 0.55 + depth * 0.75, 0, Math.PI * 2);
        ctx!.fillStyle = spinning
          ? `rgba(205, 255, 6, ${0.25 + depth * 0.7})`
          : `rgba(233, 231, 221, ${0.1 + depth * 0.22})`;
        ctx!.fill();
      });
    }

    if (!spinning || reduceMotion) {
      draw(0.6);
      return;
    }

    const start = performance.now();
    let rafId = 0;

    function frame(now: number) {
      draw(((now - start) / 1000) * 1.6);
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
  }, [spinning]);

  return <canvas ref={canvasRef} className={styles.orb} style={{ width: ORB_SIZE, height: ORB_SIZE }} />;
}

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LaneProps {
  name: string;
  elapsed: string;
  /** 0–1 across the whole four-stage run. */
  progress: number;
  automated: boolean;
}

function Lane({ name, elapsed, progress, automated }: LaneProps) {
  const reached = progress * STAGES.length;
  // The stage currently being worked: the one the token is inside.
  const activeIndex = Math.min(STAGES.length - 1, Math.floor(reached));
  const complete = progress >= 1;

  return (
    <div className={`${styles.lane} ${automated ? styles.laneAuto : styles.laneManual}`}>
      <div className={styles.laneHead}>
        <span className={styles.laneName}>
          <i className={styles.laneDot} aria-hidden="true" />
          {name}
        </span>
        <span className={styles.laneTime}>{elapsed}</span>
      </div>

      <ol className={styles.track}>
        {/* The rail sits behind the nodes; its fill is the token's reach. */}
        <span className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} style={{ width: `${progress * 100}%` }} />
        </span>

        {STAGES.map((stage, i) => {
          const done = i < reached && (i + 1 <= reached || complete);
          const running = !done && i === activeIndex && progress > 0;
          const state = done ? "done" : running ? "running" : "waiting";

          return (
            <li key={stage.label} className={`${styles.node} ${styles[state]}`}>
              <span className={styles.marker}>
                {done ? <Check /> : running && automated ? <ThinkingOrb spinning /> : <i className={styles.pip} />}
              </span>
              <span className={styles.nodeLabel}>{stage.label}</span>
              <span className={styles.nodeStatus}>
                {done ? stage.done : running ? stage.running : "Waiting"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ProcessPills() {
  // Starts at zero so the server and first client render agree.
  const [t, setT] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      return;
    }

    // Ticked on an interval rather than rAF: every tick re-renders both
    // lanes, and 60fps of that is a lot of React for a progress bar. At
    // ~12fps the clock still counts smoothly and the rail fill is carried
    // the rest of the way by its CSS transition.
    //
    // Intervals are not throttled the way rAF is, so this has to be stopped
    // by hand — otherwise it re-renders twelve times a second for the whole
    // visit, including while the tab sits in the background.
    const start = performance.now();
    let id: ReturnType<typeof setInterval> | undefined;

    const run = () => {
      if (id !== undefined) return;
      id = setInterval(() => {
        setT(((performance.now() - start) % CYCLE_MS) / CYCLE_MS);
      }, 80);
    };
    const stop = () => {
      if (id === undefined) return;
      clearInterval(id);
      id = undefined;
    };

    let onScreen = true;
    const sync = () => (onScreen && !document.hidden ? run() : stop());

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    if (rootRef.current) observer.observe(rootRef.current);

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const autoProgress = Math.min(1, t / AUTO_SHARE);
  const manualProgress = Math.min(1, t * MANUAL_SHARE);

  const autoElapsed = `${(autoProgress * AUTO_SECONDS).toFixed(1)}s`;
  const manualElapsed = `${Math.round(manualProgress * MANUAL_MINUTES)} min`;

  return (
    <div ref={rootRef} className={styles.wrap} aria-label="The same four-stage process run by an automation and by hand">
      <Lane name="Automated" elapsed={autoElapsed} progress={autoProgress} automated />
      <Lane name="By hand" elapsed={manualElapsed} progress={manualProgress} automated={false} />

      <p className={styles.summary}>
        Same four stages.{" "}
        <strong>
          {AUTO_SECONDS}s vs {MANUAL_MINUTES} min
        </strong>{" "}
        — and it never forgets step three.
      </p>
    </div>
  );
}
