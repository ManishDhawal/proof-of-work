"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FORMATS, type FormatName } from "@/lib/formats";

import { font, palette, resolveChartMode, type Mode } from "./theme";

export type BarRow = {
  /** Category label on the axis. */
  label: string;
  /** Primary value. With `baseline` set, this is the "after" series. */
  value: number;
  /** Optional reference value, drawn recessive. */
  baseline?: number;
};

type Props = {
  data: BarRow[];
  /** Axis maximum. Defaults to the data max, rounded up. */
  max?: number;
  /** Name of a format in lib/formats. Defaults to decimal3, which suits 0–1 scores. */
  format?: FormatName;
  /** Series names. Only used when rows carry a `baseline`. */
  names?: { value: string; baseline: string };
  /** Height in px. Grows with row count if omitted. */
  height?: number;
};



/**
 * Recharts 3 hands formatters a loose value type that can be undefined or a
 * string. Coerce once here rather than casting at each call site, and render
 * nothing for a missing value instead of "NaN".
 */
function looseFormat(format: (n: number) => string) {
  return (v: unknown): string => {
    if (v === null || v === undefined || v === "") return "";
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? format(n) : "";
  };
}

/**
 * Horizontal bars, one or two series.
 *
 * Horizontal because category labels here are multi-word identifiers that would
 * otherwise be rotated or truncated. One measure, one axis — never two scales.
 */
export function Bars({
  data,
  max,
  format = "decimal3",
  names,
  height,
}: Props) {
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
  const fmt = looseFormat(FORMATS[format] ?? FORMATS.decimal3);
  const grouped = data.some((d) => d.baseline !== undefined);
  const domainMax = max ?? Math.ceil(Math.max(...data.map((d) => d.value)) * 10) / 10;
  // Recharts 3 picks its own tick stops and would end this axis at 0.900,
  // which makes 0.887 look like the top of the scale. State them.
  const ticks = Array.from({ length: 5 }, (_, i) => (domainMax / 4) * i);
  const h = height ?? Math.max(180, data.length * (grouped ? 52 : 38) + 60);

  return (
    <div
      style={{ background: c.surface, padding: "14px 12px 6px", borderRadius: 2 }}
    >
      {grouped && names && (
        <div
          style={{
            display: "flex",
            gap: 18,
            padding: "2px 0 10px 10px",
            fontFamily: font,
            fontSize: 12,
            color: c.inkSecondary,
          }}
        >
          {[
            { label: names.baseline, fill: c.baseline },
            { label: names.value, fill: c.series },
          ].map((s) => (
            <span
              key={s.label}
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  background: s.fill,
                  borderRadius: 1,
                  flex: "0 0 auto",
                }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <ResponsiveContainer width="100%" height={h}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 56, bottom: 4, left: 4 }}
          barCategoryGap={grouped ? 14 : 10}
          barGap={2}
        >
          <CartesianGrid
            horizontal={false}
            stroke={c.grid}
            strokeWidth={1}
          />
          <XAxis
            type="number"
            domain={[0, domainMax]}
            ticks={ticks}
            tick={{ fill: c.inkMuted, fontSize: 11, fontFamily: font }}
            tickFormatter={fmt}
            axisLine={{ stroke: c.axis }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={215}
            tick={{ fill: c.inkSecondary, fontSize: 12, fontFamily: font }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: c.grid, fillOpacity: 0.45 }}
            contentStyle={{
              background: c.surface,
              border: `1px solid ${c.axis}`,
              borderRadius: 2,
              fontFamily: font,
              fontSize: 12,
              color: c.inkPrimary,
            }}
            labelStyle={{ color: c.inkPrimary, fontWeight: 600 }}
            formatter={fmt}
          />
          {grouped && (
            <Bar
              dataKey="baseline"
              name={names?.baseline ?? "Before"}
              fill={c.baseline}
              minPointSize={2}
              radius={[0, 3, 3, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="baseline"
                position="right"
                formatter={fmt}
                style={{ fill: c.inkMuted, fontSize: 11, fontFamily: font }}
              />
            </Bar>
          )}

          <Bar
            dataKey="value"
            name={names?.value ?? "Value"}
            fill={c.series}
            radius={[0, 3, 3, 0]}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={c.series} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={fmt}
              style={{
                fill: c.inkSecondary,
                fontSize: 11,
                fontFamily: font,
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
