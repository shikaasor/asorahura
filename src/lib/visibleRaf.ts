// A requestAnimationFrame loop that only runs when its target is actually
// on screen and the document is visible.
//
// The homepage previously ran three uncapped rAF loops at once — the
// ambient cell field, the hero orb, and the workflow ASCII field — none of
// which stopped when scrolled out of view. Together they were enough to
// starve video decode on the same machine. Everything animated should go
// through here so the page costs nothing to look at when nothing is
// visible.

interface VisibleRafOptions {
  /** Cap the callback rate. Omit for full refresh rate. */
  fps?: number;
  /**
   * Skip the IntersectionObserver gate. Only for `position: fixed`
   * elements, which are always intersecting and so gain nothing from it.
   */
  alwaysOnScreen?: boolean;
  /** Draw one frame and park, instead of looping. */
  paused?: boolean;
}

/**
 * @param target element whose visibility gates the loop
 * @param draw called with elapsed seconds since start
 * @returns cleanup that stops the loop and detaches observers
 */
export function createVisibleRaf(
  target: Element,
  draw: (elapsedSeconds: number) => void,
  options: VisibleRafOptions = {},
): () => void {
  const { fps, alwaysOnScreen = false, paused = false } = options;
  const minDelta = fps ? 1000 / fps - 1 : 0;

  let rafId = 0;
  let running = false;
  let onScreen = alwaysOnScreen;
  let docVisible = !document.hidden;
  let lastDraw = 0;
  const start = performance.now();

  if (paused) {
    draw(0);
    return () => {};
  }

  const frame = (now: number) => {
    if (!onScreen || !docVisible) {
      running = false;
      return;
    }
    // Throttling here rather than in each component keeps the elapsed time
    // continuous — the animation stays on the same clock whatever rate it
    // is drawn at, so a throttled field looks slower, not choppier.
    if (now - lastDraw >= minDelta) {
      lastDraw = now;
      draw((now - start) / 1000);
    }
    rafId = requestAnimationFrame(frame);
  };

  const run = () => {
    if (running || !onScreen || !docVisible) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  const onVisibility = () => {
    docVisible = !document.hidden;
    if (docVisible) run();
    else stop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  let observer: IntersectionObserver | undefined;
  if (!alwaysOnScreen) {
    observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
        if (onScreen) run();
        else stop();
      },
      // Start a little before the element scrolls in so nothing pops.
      { rootMargin: "200px 0px" },
    );
    observer.observe(target);
  }

  run();

  return () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibility);
    observer?.disconnect();
  };
}
