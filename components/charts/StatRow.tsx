"use client";

import { useEffect, useState } from "react";

import { font, palette, resolveChartMode, type Mode } from "./theme";

export type Stat = {
  value: string;
  label: string;
  /** Optional qualifier, e.g. the comparison a figure is measured against. */
  note?: string;
};

/**
 * A row of headline figures.
 *
 * Not a chart — for three or four numbers with no shape to show, a plot adds
 * decoration and no information. Used only where the figures themselves are the
 * point of the section.
 */
export function StatRow({ stats }: { stats: Stat[] }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const sync = () => setMode(resolveChartMode());
    sync();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      mq.removeEventListener("change", sync);
      obs.disconnect();
    };
  }, []);

  const c = palette[mode];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
        gap: 1,
        background: c.grid,
        border: `1px solid ${c.grid}`,
        fontFamily: font,
        margin: "24px 0",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: c.surface,
            padding: "16px 18px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <span
            style={{
              fontSize: 26,
              lineHeight: 1.1,
              color: c.inkPrimary,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {s.value}
          </span>
          <span style={{ fontSize: 12.5, color: c.inkSecondary }}>
            {s.label}
          </span>
          {s.note && (
            <span style={{ fontSize: 11.5, color: c.inkMuted }}>{s.note}</span>
          )}
        </div>
      ))}
    </div>
  );
}
