"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import FlameWrap from "./FlameWrap";

// Hover-gated wrapper around FlameWrap, with a scroll-gated fallback where
// there is no hover to gate on.
//
// The effect stays mounted so the children never remount — but at rest every
// emissive term is driven to zero and `active: false` parks the render loop,
// so an idle card costs nothing beyond its WebGL context. Five of these sit
// on the catalog page; idling five shader passes would be a real frame-rate
// cost for something nobody is looking at.
//
// captureContent is off deliberately: the html-in-canvas path re-renders the
// subtree as a texture, and these cards contain links and the waitlist
// trigger. Keeping the DOM real keeps them clickable and selectable.

interface FlameHoverProps {
  children: ReactNode;
  className?: string;
  /** Corner radius of the burning outline. Match the child's radius. */
  radius?: number;
  /** Flame color as [r, g, b] in 0-1 range. */
  color?: [number, number, number];
}

/**
 * How much of the viewport's height the card must cover before it lights on a
 * touch device. Half is deliberately high: the cards run ~70% of a phone
 * viewport, so at this level exactly one card qualifies at a time. Drop it
 * much lower and two neighbours ignite together, which both looks wrong and
 * doubles the shader cost on the weakest hardware we run on.
 */
const VIEWPORT_SHARE = 0.5;

// Coverage is measured off intersectionRect, but the observer only *fires*
// on threshold crossings, so it needs enough of them to resolve the moment
// the card passes half the screen.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export default function FlameHover({
  children,
  className,
  radius = 18,
  color = [0.27, 0.84, 0.5],
}: FlameHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  // Assume hover until the client says otherwise: it matches the desktop
  // majority and keeps the server and first client render identical.
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const sync = () => setCanHover(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Desktop keeps the pointer handlers below as the only trigger.
    if (canHover) return;

    const element = ref.current;
    if (!element) return;

    // Igniting things as the page scrolls is exactly what someone asking for
    // reduced motion is asking not to happen, and with no hover there is no
    // other way in — so on these devices the card simply stays unlit.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const share = entry.intersectionRect.height / (window.innerHeight || 1);
        setLit(share >= VIEWPORT_SHARE);
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      setLit(false);
    };
  }, [canHover]);

  return (
    <div
      ref={ref}
      className={className}
      // Guarded rather than removed: touch browsers still synthesise
      // pointerenter on tap, which would light a card and leave it lit with
      // nothing to extinguish it.
      onPointerEnter={() => canHover && setLit(true)}
      onPointerLeave={() => canHover && setLit(false)}
      onFocusCapture={() => canHover && setLit(true)}
      onBlurCapture={(event) => {
        // Only extinguish once focus has left the card entirely, otherwise
        // tabbing between the title link and the CTA flickers it off.
        if (!canHover) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setLit(false);
        }
      }}
      style={{ height: "100%" }}
    >
      <FlameWrap
        captureContent={false}
        active={lit}
        color={color}
        radius={radius}
        height={lit ? 120 : 24}
        spread={10}
        intensity={lit ? 0.62 : 0}
        rim={lit ? 2.2 : 0}
        sparks={lit ? 1.4 : 0}
        sparkSize={0.3}
        sparkDensity={0.9}
        smoke={lit ? 0.9 : 0}
        melt={0}
        ember={0}
        scorch={0}
        distortion={0}
        speed={0.3}
        scale={0.8}
        style={{ height: "100%" }}
      >
        {children}
      </FlameWrap>
    </div>
  );
}
