"use client";

import type { ReactNode } from "react";
import FlameWrap from "./FlameWrap";

// Permanently lit flame for the primary call-to-action.
//
// Not FlameHover with active={true}: the tile settings are tuned for a burst
// you see for a second while the pointer is over a large card. Held
// permanently, at that intensity, on a small pill, they read as an alarm and
// pull the eye off the label. Everything here is roughly a third of the tile
// values — enough to be clearly alight, quiet enough to sit behind text you
// are meant to read.
//
// captureContent stays off for the same reason as FlameHover: the child is a
// real link and must stay clickable rather than becoming a texture.

interface FlameCtaProps {
  children: ReactNode;
  /** Corner radius of the burning outline. Match the control's radius. */
  radius?: number;
  className?: string;
}

export default function FlameCta({ children, radius = 22, className }: FlameCtaProps) {
  return (
    <FlameWrap
      captureContent={false}
      active
      // The same green the catalog tiles burn, so the two read as one system.
      color={[0.27, 0.84, 0.5]}
      radius={radius}
      height={34}
      spread={5}
      intensity={0.36}
      rim={1.1}
      sparks={0.7}
      sparkSize={0.24}
      sparkDensity={0.55}
      smoke={0}
      melt={0}
      ember={0}
      scorch={0}
      distortion={0}
      speed={0.26}
      scale={0.85}
      className={className}
      style={{ display: "inline-flex" }}
    >
      {children}
    </FlameWrap>
  );
}
