"use client";

import { useEffect, useState } from "react";

/**
 * A hairline at the top of the viewport showing position through a case study.
 *
 * These run 900+ words with figures, and the one thing a reader wants to know
 * on a long page is how much is left. It is the cheapest useful piece of UI on
 * the site — two pixels, no layout cost, and it answers a real question.
 *
 * Only rendered on case studies; the index and About are short enough that it
 * would be noise.
 */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setPct(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    // rAF-throttled: scroll fires far more often than the screen repaints.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="progress"
      style={{ width: `${pct * 100}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
