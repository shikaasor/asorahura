"use client";

import { useEffect, useRef } from "react";
import styles from "./LiquidGoldBackground.module.css";

const VERTEX_SRC = `
  attribute vec2 aPos;
  void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FRAGMENT_SRC = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;

  vec3 cream = vec3(0.992, 0.980, 0.957);
  vec3 gold  = vec3(0.788, 0.659, 0.427);
  vec3 goldDeep = vec3(0.631, 0.522, 0.290);

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0) * 1.6;

    vec2 mouseInfluence = (uMouse - uv) * 0.15;

    vec2 q = vec2(fbm(p + uTime * 0.035), fbm(p + vec2(1.7, 4.2) + uTime * 0.03));
    vec2 r = vec2(
      fbm(p + 1.4 * q + vec2(3.2, 1.1) + uTime * 0.02 + mouseInfluence),
      fbm(p + 1.4 * q + vec2(0.6, 5.3) + uTime * 0.018 + mouseInfluence)
    );
    float pattern = fbm(p + 1.2 * r);

    float goldMix = smoothstep(0.25, 0.75, pattern) * 0.4;
    vec3 color = mix(cream, gold, goldMix);

    float sheen = pow(clamp(pattern, 0.0, 1.0), 5.0) * 0.5;
    color = mix(color, goldDeep, sheen);

    vec2 centered = uv - 0.5;
    float vignette = 1.0 - dot(centered, centered) * 0.35;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string) {
  const program = gl.createProgram()!;
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSrc));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc));
  gl.linkProgram(program);
  return program;
}

export default function LiquidGoldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const program = createProgram(gl, VERTEX_SRC, FRAGMENT_SRC);
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "aPos");
    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const timeLoc = gl.getUniformLocation(program, "uTime");
    const mouseLoc = gl.getUniformLocation(program, "uMouse");

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let width = 0;
    let height = 0;
    const mouse = { x: 0.5, y: 0.5 };

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);

    const startTime = performance.now();
    let rafId = 0;

    function frame() {
      if (!gl || !canvas) return;
      const elapsed = reduceMotion ? 0 : (performance.now() - startTime) / 1000;

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduceMotion) {
        rafId = requestAnimationFrame(frame);
      }
    }

    frame();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
