"use client";

import { useEffect, useRef, useState } from "react";

// One-shot visibility gate for entrance animations.
//
// Deliberately not built on createVisibleRaf: nothing here runs per frame.
// The observer fires once, sets a flag, and disconnects, so a settled
// element costs nothing for the rest of the session.
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion and no-observer both resolve to "already arrived"
    // rather than "never arrives" — the content must not stay hidden.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setInView(true);
      return;
    }

    let delivered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 },
    );
    observer.observe(el);

    // Failsafe. These elements start at opacity 0, so anything that stops the
    // observer from ever delivering leaves real content — headings, card
    // grids — permanently invisible. An observer normally delivers an initial
    // callback for every target within a frame or two of observe(), whether it
    // intersects or not, so silence past this point means it is not running.
    //
    // The usual cause is a hidden document: callbacks are delivered during the
    // rendering lifecycle, which browsers skip for background tabs. That case
    // is not a fault and recovers on its own when the tab is focused, so the
    // timer is only armed while the document is visible and re-armed when it
    // becomes visible.
    let timer = 0;
    const arm = () => {
      if (document.hidden || delivered || timer) return;
      timer = window.setTimeout(() => {
        if (!delivered) setInView(true);
      }, 1500);
    };
    const onVisibility = () => {
      if (!document.hidden) arm();
    };
    arm();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rootMargin]);

  return { ref, inView };
}
