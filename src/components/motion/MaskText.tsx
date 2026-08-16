"use client";

import { createElement, Fragment } from "react";
import { useInView } from "./useInView";
import styles from "./MaskText.module.css";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface MaskTextProps {
  /** Plain text. Split on spaces, so it carries no markup of its own. */
  text: string;
  as?: Tag;
  className?: string;
  /** Seconds before the first word starts moving. */
  delay?: number;
}

/** Stagger between words. Slow enough to read as a wave, fast enough that a
 *  long heading has finished before the reader gets to the end of it. */
const STEP = 0.045;

export default function MaskText({ text, as = "h2", className, delay = 0 }: MaskTextProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const words = text.split(" ");

  return createElement(
    as,
    {
      ref,
      className: className ? `${styles.root} ${className}` : styles.root,
      "data-in": inView || undefined,
    },
    words.map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span className={styles.word}>
          <span className={styles.inner} style={{ transitionDelay: `${delay + i * STEP}s` }}>
            {word}
          </span>
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
