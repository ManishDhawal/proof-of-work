"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  /** Formats values in labels and tooltips. */
  format?: (n: number) => string;
  /** Series names. Only used when rows carry a `baseline`. */
  names?: { value: string; baseline: string };
  /** Height in px. Grows with row count if omitted. */
  height?: number;
};

const fmtDefault = (n: number) => n.toFixed(3);

/**
 * Horizontal bars, one or two series.
 *
 * Horizontal because category labels here are multi-word identifiers that would
 * otherwise be rotated or truncated. One measure, one axis — never two scales.
 */
export function Bars({
  data,
  max,
  format = fmtDefault,
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
  const grouped = data.some((d) => d.baseline !== undefined);
  const domainMax = max ?? Math.ceil(Math.max(...data.map((d) => d.value)) * 10) / 10;
  const h = height ?? Math.max(180, data.length * (grouped ? 52 : 38) + 60);

  return (
    <div
      style={{ background: c.surface, padding: "14px 12px 6px", borderRadius: 2 }}
    >
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
            tick={{ fill: c.inkMuted, fontSize: 11, fontFamily: font }}
            tickFormatter={format}
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
            formatter={(v: number) => format(v)}
          />
          {grouped && names && (
            <Legend
              verticalAlign="top"
              align="left"
              height={28}
              wrapperStyle={{
                fontFamily: font,
                fontSize: 12,
                color: c.inkSecondary,
              }}
            />
          )}

          {grouped && (
            <Bar
              dataKey="baseline"
              name={names?.baseline ?? "Before"}
              fill={c.baseline}
              radius={[0, 3, 3, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="baseline"
                position="right"
                formatter={format}
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
              formatter={format}
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
