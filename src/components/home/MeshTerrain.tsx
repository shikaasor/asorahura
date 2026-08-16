"use client";

import { useEffect, useRef } from "react";
import { createVisibleRaf } from "@/lib/visibleRaf";
import styles from "./MeshTerrain.module.css";

// A wireframe horizon that sits between the last section and the footer.
// Lines are drawn as stacked noise profiles: rows near the top are almost
// flat and nearly transparent, rows near the bottom are tall and bright,
// which reads as ground receding toward a vanishing point without any 3D.
export default function MeshTerrain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let resizeTimer: ReturnType<typeof setTimeout>;
        let width = 0;
        let height = 0;

        const fit = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const noise = (x: number, z: number, t: number) =>
            Math.sin(x * 1.7 + z * 2.1 + t) * 0.5 +
            Math.sin(x * 3.3 - z * 1.3 + t * 0.7) * 0.28 +
            Math.sin(x * 7.1 + z * 4.7 - t * 0.5) * 0.14 +
            Math.sin(x * 12.7 + z * 3.1 + t * 1.1) * 0.07;

        const draw = (t: number) => {
            ctx.clearRect(0, 0, width, height);

            const ROWS = 64;
            const STEP = Math.max(5, width / 190);
            ctx.lineWidth = 1;

            for (let i = 0; i < ROWS; i++) {
                const u = i / (ROWS - 1);
                const yBase = height * Math.pow(u, 1.9);
                const amp = 6 + 40 * Math.pow(u, 1.6);

                ctx.beginPath();
                for (let px = -STEP; px <= width + STEP; px += STEP) {
                    const nx = (px / width) * 5.5;
                    const y = yBase - noise(nx, u * 3.4, t) * amp;
                    if (px <= 0) ctx.moveTo(px, y);
                    else ctx.lineTo(px, y);
                }
                ctx.strokeStyle = `rgba(255,255,255,${(0.05 + 0.38 * u).toFixed(3)})`;
                ctx.stroke();
            }
        };

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                fit();
                draw(0);
            }, 150);
        };

        fit();
        draw(0);

        window.addEventListener("resize", handleResize);

        // Only animate while the strip is actually on screen — it lives at
        // the bottom of every page and would otherwise run the whole visit.
        // The shared gate also parks it when the tab is in the background,
        // which the previous hand-rolled observer did not.
        const stop = createVisibleRaf(canvas, (t) => draw(t * 0.42), { paused: reduce });

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
            stop();
        };
    }, []);

    return (
        <div className={styles.mesh} aria-hidden="true">
            <canvas ref={canvasRef} className={styles.canvas} />
        </div>
    );
}
