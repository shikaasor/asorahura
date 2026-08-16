"use client";

import { useState, type ReactNode } from "react";
import FlameWrap from "./FlameWrap";

// Hover-gated wrapper around FlameWrap.
//
// The effect stays mounted so the children never remount on hover — but at
// rest every emissive term is driven to zero and `active: false` parks the
// render loop, so an idle card costs nothing beyond its WebGL context.
// Five of these sit on the catalog page; idling five shader passes would
// be a real frame-rate cost for something nobody is looking at.
//
// captureContent is off deliberately: the html-in-canvas path re-renders
// the subtree as a texture, and these cards contain links and the waitlist
// trigger. Keeping the DOM real keeps them clickable and selectable.

interface FlameHoverProps {
  children: ReactNode;
  className?: string;
  /** Corner radius of the burning outline. Match the child's radius. */
  radius?: number;
  /** Flame color as [r, g, b] in 0-1 range. */
  color?: [number, number, number];
}

export default function FlameHover({
  children,
  className,
  radius = 18,
  color = [0.27, 0.84, 0.5],
}: FlameHoverProps) {
  const [lit, setLit] = useState(false);

  return (
    <div
      className={className}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
      onFocusCapture={() => setLit(true)}
      onBlurCapture={(event) => {
        // Only extinguish once focus has left the card entirely, otherwise
        // tabbing between the title link and the CTA flickers it off.
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
