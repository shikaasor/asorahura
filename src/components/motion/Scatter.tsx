"use client";

import { Children, type CSSProperties, type ReactNode } from "react";
import { useInView } from "./useInView";
import styles from "./Scatter.module.css";

interface ScatterProps {
  children: ReactNode;
  /** Applied to the group element, which replaces the grid you wrapped. */
  className?: string;
  /**
   * Max rotation in degrees, either side. Cards can carry a real tilt;
   * full-width rows cannot — a rotated row shears against its own rule, so
   * pass 0 and let the stagger do the work.
   */
  tilt?: number;
}

// Hash rather than Math.random: the server and the client must derive the
// same offsets or React reports a hydration mismatch on every card.
//
// Rounded because "same formula" is not enough — Math.sin is not required
// to be bit-identical across engines, and Node and the browser disagree in
// the last few digits, which is a mismatch React does report.
function hash(index: number, seed: number) {
  const n = Math.sin((index + 1) * seed) * 43758.5453;
  return n - Math.floor(n);
}

function px(value: number) {
  return `${value.toFixed(2)}px`;
}

const SPREAD_X = 26; // px, either side
const DROP_MIN = 34; // px below rest
const DROP_RANGE = 30;
const STEP = 0.09; // seconds between cards

export default function Scatter({ children, className, tilt = 7 }: ScatterProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={className} data-in={inView || undefined}>
      {Children.map(children, (child, i) => (
        <div
          className={styles.item}
          style={
            {
              "--sx": px((hash(i, 12.9898) * 2 - 1) * SPREAD_X),
              "--sy": px(DROP_MIN + hash(i, 78.233) * DROP_RANGE),
              "--sr": `${((hash(i, 39.3468) * 2 - 1) * tilt).toFixed(2)}deg`,
              transitionDelay: `${i * STEP}s`,
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
