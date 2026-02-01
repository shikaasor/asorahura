"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    baseY: number;
    size: number;
    speed: number;
    offset: number;
    opacity: number;
}

const CONNECTION_DIST = 60;

export default function ParticleWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(width / 15);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    baseY: Math.random() * height,
                    y: 0,
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 0.002 + 0.001,
                    offset: Math.random() * 100,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update positions
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.offset += p.speed;

                const wave1 = Math.sin(p.x * 0.003 + p.offset * 12) * 40;
                const wave2 = Math.cos(p.x * 0.007 + p.offset * 8) * 25;
                const wave3 = Math.sin(p.x * 0.001 + p.offset * 5) * 15;

                p.y = p.baseY + wave1 + wave2 + wave3;
            }

            // Spatial grid for connection optimization
            const cellSize = CONNECTION_DIST;
            const cols = Math.ceil(width / cellSize);
            const rows = Math.ceil(height / cellSize);
            const grid: number[][] = new Array(cols * rows);

            for (let i = 0; i < grid.length; i++) {
                grid[i] = [];
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const col = Math.min(Math.floor(p.x / cellSize), cols - 1);
                const row = Math.min(Math.floor(p.y / cellSize), rows - 1);
                if (col >= 0 && row >= 0) {
                    grid[row * cols + col].push(i);
                }
            }

            // Draw connections using spatial grid
            ctx.lineWidth = 1;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const cellIdx = row * cols + col;
                    const cell = grid[cellIdx];
                    if (!cell || cell.length === 0) continue;

                    // Check current cell + right + bottom + bottom-right neighbors
                    const neighbors = [cellIdx];
                    if (col + 1 < cols) neighbors.push(cellIdx + 1);
                    if (row + 1 < rows) neighbors.push(cellIdx + cols);
                    if (col + 1 < cols && row + 1 < rows) neighbors.push(cellIdx + cols + 1);
                    if (col - 1 >= 0 && row + 1 < rows) neighbors.push(cellIdx + cols - 1);

                    for (const ni of neighbors) {
                        const neighborCell = grid[ni];
                        if (!neighborCell) continue;

                        for (const i of cell) {
                            const startJ = ni === cellIdx ? cell.indexOf(i) + 1 : 0;
                            const list = ni === cellIdx ? cell : neighborCell;
                            for (let jIdx = startJ; jIdx < list.length; jIdx++) {
                                const j = list[jIdx];
                                const dx = particles[i].x - particles[j].x;
                                const dy = particles[i].y - particles[j].y;
                                const dist = dx * dx + dy * dy;

                                if (dist < CONNECTION_DIST * CONNECTION_DIST) {
                                    const alpha = 0.06 * (1 - Math.sqrt(dist) / CONNECTION_DIST);
                                    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                                    ctx.beginPath();
                                    ctx.moveTo(particles[i].x, particles[i].y);
                                    ctx.lineTo(particles[j].x, particles[j].y);
                                    ctx.stroke();
                                }
                            }
                        }
                    }
                }
            }

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
