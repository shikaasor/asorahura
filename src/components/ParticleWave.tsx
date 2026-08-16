"use client";

import { useEffect, useRef } from "react";
import { createVisibleRaf } from "@/lib/visibleRaf";

// The ambient page texture: a fixed grid of tiny cells whose opacity is
// driven by a travelling wave, so only a shifting minority of cells are
// lit at any moment. A hash per cell decides both its phase and its hue,
// which keeps the field from ever resolving into visible rows.
const CELL_W = 9;
const CELL_H = 11;
const THRESHOLD = 0.62;

// This canvas is fixed and full-viewport, so it is on screen on every page
// for the whole session — it has to be the cheapest thing here, not the
// most expensive. 30fps is plenty for a wave this slow.
const FPS = 30;

// Hue tiers, indexed by the cell's hue hash.
const HUES = ["236,238,235", "120,160,255", "160,225,140", "235,130,150"];

export default function ParticleWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;

        // Per-cell constants, computed once per resize rather than once per
        // cell per frame. Both hashes are pure functions of (x, y) — they
        // were being recomputed 25,000+ times a frame to produce the exact
        // same numbers, which was two thirds of this component's cost.
        let phase = new Float32Array(0);
        let hue = new Uint8Array(0);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            cols = Math.ceil(width / CELL_W);
            rows = Math.ceil(height / CELL_H);
            phase = new Float32Array(cols * rows);
            hue = new Uint8Array(cols * rows);

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                    n -= Math.floor(n);
                    let m = Math.sin(x * 39.3468 + y * 11.135) * 24634.6345;
                    m -= Math.floor(m);

                    const i = x * rows + y;
                    phase[i] = n;
                    // Mostly neutral, with a thin tail of colour so the
                    // accents appear as rare sparks rather than a wash.
                    hue[i] = m < 0.72 ? 0 : m < 0.81 ? 1 : m < 0.9 ? 2 : 3;
                }
            }
        };

        const draw = (t: number) => {
            ctx.clearRect(0, 0, width, height);

            for (let x = 0; x < cols; x++) {
                const xw = x * 0.11 - t * 0.3;
                for (let y = 0; y < rows; y++) {
                    const i = x * rows + y;
                    const n = phase[i];

                    const wave = Math.sin(xw + y * 0.07 + n * 6.28);
                    const a = (wave * 0.5 + 0.5) * n;
                    if (a < THRESHOLD) continue;

                    const v = (a - THRESHOLD) / (1 - THRESHOLD);
                    ctx.fillStyle = `rgba(${HUES[hue[i]]},${(v * 0.1).toFixed(3)})`;
                    ctx.fillRect(x * CELL_W + 1, y * CELL_H + 2, CELL_W - 4, CELL_H - 6);
                }
            }
        };

        const handleResize = () => {
            resize();
            draw(0);
        };

        resize();

        window.addEventListener("resize", handleResize);

        // alwaysOnScreen: a fixed full-viewport canvas always intersects, so
        // the IntersectionObserver gate would never fire. The document
        // visibility gate and the frame cap are what do the work here.
        const stop = createVisibleRaf(canvas, draw, {
            fps: FPS,
            alwaysOnScreen: true,
            paused: reduce,
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            stop();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.9,
            }}
        />
    );
}
