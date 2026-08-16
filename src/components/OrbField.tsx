"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createVisibleRaf } from "@/lib/visibleRaf";
import styles from "./OrbField.module.css";

// The page backdrop for every route except the homepage.
//
// Port of the procedural orb prototype (webGL/orb.html): three great circles
// whose orthographic projections are ellipses, smooth-unioned into one figure
// that furls out of a single ring and back once per loop.
//
// Three things changed in the port. The original drew ink on an opaque paper
// plate — this draws light on transparent, so it composites over the gradient
// field instead of replacing it. The plate frame and crosshair rules are gone:
// full-viewport rules through the middle of a text page read as a UI artifact,
// not as structure. And a sparse twinkling star layer was added, which is what
// turns a lone figure into something sitting in a field.
//
// The homepage is excluded because LineSphere already owns that background,
// and two orbs behind one hero is one too many.

const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uSize;
uniform float uT;

const float R      = 334.5;   // sphere radius, design units
const float T0     = 2.19;    // half stroke of one great circle
const float KS     = 36.0;    // smooth-union radius
const float PERIOD = 15.0;
const float TAU    = 6.283185307179586;

// Half-extent of the short viewport axis in design units. Larger than the
// prototype's 450 so the orb reads as the space the page sits in rather than
// an object centred on it.
const float VIEW = 620.0;

const vec3 GREEN = vec3(0.271, 0.839, 0.498); // --green  #45d67f
const vec3 BLUE  = vec3(0.184, 0.420, 1.000); // --blue   #2f6bff
const vec3 CREAM = vec3(0.957, 0.945, 0.894); // --cream  #f4f1e4

float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

/* Orthographic projection of a great circle with unit normal n: an ellipse
   whose minor axis (R*|n.z|) lies along n.xy and whose major axis (R) lies
   perpendicular to it. Signed distance via the gradient-normalised implicit
   form. */
float greatCircle(vec3 n, vec2 p){
  vec2  m  = n.xy;
  float ml = length(m);
  vec2  dm = ml > 1e-5 ? m / ml : vec2(1.0, 0.0);
  vec2  dM = vec2(-dm.y, dm.x);
  vec2  e  = vec2(max(R * abs(n.z), 0.6), R);
  vec2  q  = vec2(dot(p, dm), dot(p, dM)) + 1e-3;
  float k1 = length(q / e);
  float k2 = length(q / (e * e));
  return (k1 - 1.0) * k1 / max(k2, 1e-8);
}

const vec3 TILT_MID  = vec3(0.30, 0.58, 0.82);
const vec3 TILT_AMP  = vec3(0.28, 0.24, 0.14);
const vec3 TILT_RATE = vec3(2.0, 1.0, 3.0);
const vec3 TILT_PH   = vec3(0.9, 1.9, 3.6);
const vec3 AZ_RATE   = vec3(2.0, 1.0, 3.0);
const vec3 AZ_PH     = vec3(1.0, 3.4, 5.8);
const float FAN      = 0.55;

float orb(vec2 p, float t){
  float u = fract(t / PERIOD);
  float s = smoothstep(0.0, 0.14, u) * (1.0 - smoothstep(0.88, 1.0, u));
  float spread = 1.05 - 0.68 * pow(0.5 + 0.5 * cos(TAU * u + 1.3), 3.0);

  float d = 1e9;
  for(int k = 0; k < 3; k++){
    float fk = float(k);
    float h  = TILT_MID[k] + TILT_AMP[k] * cos(TAU * TILT_RATE[k] * u + TILT_PH[k]);
    float th = s * 1.5707963 * h;
    float ph = TAU * u + spread * TAU * fk / 3.0 + FAN * sin(TAU * AZ_RATE[k] * u + AZ_PH[k]);
    float st = sin(th);
    vec3  n  = vec3(st * cos(ph), st * sin(ph), cos(th));
    float dk = abs(greatCircle(n, p)) - T0;
    d = (k == 0) ? dk : smin(d, dk, KS);
  }
  return d;
}

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

/* Sparse points on a jittered lattice. Only ~12% of cells carry one, and each
   twinkles on its own phase so the field never pulses in unison. */
float stars(vec2 p, float t){
  vec2 g  = p / 58.0;
  vec2 id = floor(g);
  vec2 f  = fract(g) - 0.5;

  float h = hash21(id);
  float present = step(0.85, h);

  vec2 off = (vec2(hash21(id + 7.1), hash21(id + 13.7)) - 0.5) * 0.72;
  float sd = length(f - off);

  float tw = 0.45 + 0.55 * sin(t * 1.1 + h * TAU * 5.0);
  return present * max(tw, 0.0) * exp(-sd * sd * 115.0);
}

void main(){
  // Aspect-correct: scale by the SHORT axis so the orb stays circular and the
  // long axis simply shows more field.
  vec2 p = (gl_FragCoord.xy - 0.5 * uSize) / min(uSize.x, uSize.y) * (2.0 * VIEW);

  float d = orb(p, uT);
  float w = max(fwidth(d), 1e-4);

  float core = 1.0 - smoothstep(0.0, w * 1.5, d);   // the stroke itself
  float halo = exp(-max(d, 0.0) * 0.016);           // soft bloom around it

  // Green at the core, blue toward the rim — the same two hues the page field
  // uses, so the orb belongs to it.
  float rad = clamp(length(p) / (R * 1.5), 0.0, 1.0);
  vec3  col = mix(GREEN, BLUE, rad);
  // Only a little cream. Pushing the core further than this desaturates the
  // whole figure to grey and the two brand hues stop reading at all.
  col = mix(col, CREAM, core * 0.4);

  float st = stars(p, uT);
  // Stars stay pale rather than taking the orb's green/blue — a tinted star
  // reads as a stray dot, a white one reads as distance.
  col = mix(col, CREAM, clamp(st * 1.3, 0.0, 0.85));

  // Fades out toward the corners so there is no visible edge to the field.
  float vignette = 1.0 - smoothstep(0.55, 1.25, length(p) / VIEW);

  // Ceilings set by contrast, not by taste. This backdrop sits behind live
  // body copy on every content page, so the brightest thing it may paint is
  // bounded by what --ink-3 (#82827a, the caption tier) can survive: at
  // ~0.09 composite alpha over #0a0a0a that tier still clears 4.5:1. The
  // stroke used to peak at 0.26 and took it down to 3.1:1.
  float a = (core * 0.06 + halo * 0.045 + st * 0.22) * vignette;

  // Premultiplied: the context is created with premultipliedAlpha left on.
  fragColor = vec4(col * a, a);
}`;

// Soft glow needs no crisp detail, so the buffer is rendered below device
// resolution and upscaled. Halves the fill cost on a retina display for no
// visible difference.
const RES_SCALE = 0.72;
const MAX_DPR = 2;
const FPS = 30;

// Roughly 40% through the loop: all three rings are open and well separated.
const PARKED_FRAME = 6.0;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src.trim());
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Silent failure here means an invisible backdrop and no way to tell why.
    console.error("[OrbField] shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function OrbField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const enabled = pathname !== "/";

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // No WebGL2 means no backdrop. The gradient field behind it still stands
    // on its own, so there is nothing to fall back to.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[OrbField] program link failed:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uSize = gl.getUniformLocation(prog, "uSize");
    const uT = gl.getUniformLocation(prog, "uT");

    let bufW = 0;
    let bufH = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RES_SCALE;
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (w === bufW && h === bufH) return;
      bufW = canvas!.width = w;
      bufH = canvas!.height = h;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uSize, w, h);
    }

    function draw(elapsed: number) {
      resize();
      gl!.uniform1f(uT, elapsed);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Size and paint once, synchronously, before the loop is involved.
    // createVisibleRaf will not run a frame while document.hidden is true, so
    // a backdrop that only ever sized itself inside draw() stays at the
    // default 300x150 when the page is opened in a background tab — and stays
    // there until something happens to trigger a redraw.
    //
    // Reduced motion stops here: parked mid-furl, where all three rings are
    // open. The figure is the point; the oscillation is decoration.
    resize();
    draw(reduceMotion ? PARKED_FRAME : 0);

    if (reduceMotion) return;

    window.addEventListener("resize", resize);
    // alwaysOnScreen: it is position:fixed, so it is always intersecting and
    // the observer would never gate anything. The visibilitychange half still
    // stops it when the tab is hidden.
    const stop = createVisibleRaf(canvas, draw, { fps: FPS, alwaysOnScreen: true });

    // Deliberately does NOT call WEBGL_lose_context. A canvas hands out one
    // context for its lifetime, so losing it on cleanup means React's
    // development double-invoke (mount, cleanup, mount) leaves the second
    // mount holding a dead context and nothing ever draws again.
    return () => {
      stop();
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
