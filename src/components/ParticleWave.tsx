"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    baseY: number;
    size: number;
    speed: number;
    offset: number;
}

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
            const particleCount = Math.floor(width / 10); // Density
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: height / 2,
                    baseY: height / 2, // Center of wave
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 0.002 + 0.001,
                    offset: Math.random() * 100 // Randomize wave phase
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw particles
            particles.forEach((p) => {
                // Update position
                p.offset += p.speed;
                // Wave movement: sin wave + noise
                const wave = Math.sin(p.x * 0.005 + p.offset * 20) * 50;
                const wave2 = Math.cos(p.x * 0.01 + p.offset * 15) * 30;
                
                p.y = p.baseY + wave + wave2;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`; // Blue with varying opacity
                ctx.fill();
            });

            // Connect particles nearby (optional, for web effect)
            ctx.strokeStyle = "rgba(59, 130, 246, 0.05)";
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
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
                position: "absolute",
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
