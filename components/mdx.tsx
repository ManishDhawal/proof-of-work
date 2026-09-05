import Image from "next/image";

import { FORMAT_NAMES, type FormatName } from "@/lib/formats";

import { Bars, type BarRow } from "@/components/charts/Bars";
import { StatRow, type Stat } from "@/components/charts/StatRow";

type Data = Record<string, unknown>;


/** A chart block in a case study's .data.json: its rows plus its configuration. */
type ChartBlock = {
  rows: BarRow[];
  max?: number;
  height?: number;
  names?: { value: string; baseline: string };
  /** One of FORMATS. Defaults to decimal3, which suits 0–1 scores. */
  format?: FormatName;
};

/**
 * The component vocabulary an .mdx case study can use.
 *
 * MDX here passes exactly one prop: a string key naming a block in the sibling
 * .data.json.
 *
 *     <StatRow from="headline" />
 *     <Bars from="failureModes" />
 *
 * That is not a stylistic choice. next-mdx-remote 6 — the release that patches
 * the RSC code-execution advisory (GHSA-g4xw-jxrg-5f6m) — passes string
 * attributes only. Expression attributes such as `max={1}` are stripped before
 * the component sees them, and stripped silently: the chart renders with
 * defaults and nothing warns you. Anything a chart needs beyond its rows
 * therefore lives in the JSON:
 *
 *     "failureModes": {
 *       "max": 1,
 *       "names": { "value": "After", "baseline": "Before" },
 *       "rows": [ ... ]
 *     }
 *
 * Which is the better arrangement regardless: the prose is content, the figures
 * are data, and neither needs JavaScript to edit.
 */
export function mdxComponents(data: Data) {
  function block(from: string): ChartBlock {
    const raw = data[from];

    // A bare array is still accepted — rows with no configuration.
    if (Array.isArray(raw)) return { rows: raw as BarRow[] };

    if (raw && typeof raw === "object" && Array.isArray((raw as ChartBlock).rows)) {
      return raw as ChartBlock;
    }

    throw new Error(
      `Case study data has no chart at "${from}". Expected an array of rows, or ` +
        `an object with a "rows" array. Available keys: ${Object.keys(data).join(", ") || "(none)"}`,
    );
  }

  return {
    StatRow: ({ from }: { from: string }) => (
      <div className="figure">
        <StatRow stats={block(from).rows as unknown as Stat[]} />
      </div>
    ),

    Bars: ({ from }: { from: string }) => {
      const { rows, ...config } = block(from);
      if (config.format && !FORMAT_NAMES.includes(config.format)) {
        throw new Error(
          `Chart "${from}" asks for format "${config.format}". Available: ${FORMAT_NAMES.join(", ")}`,
        );
      }
      return (
        <figure className="figure">
          <Bars data={rows} {...config} />
        </figure>
      );
    },

    /**
     * A screenshot with its caption. All-string props, per the constraint above.
     * Width and height are given as strings and coerced here.
     */
    Shot: ({
      src,
      alt,
      caption,
      w,
      h,
    }: {
      src: string;
      alt: string;
      caption?: string;
      w?: string;
      h?: string;
    }) => (
      <figure className="figure shot">
        <Image
          src={src}
          alt={alt}
          width={Number(w ?? 1300)}
          height={Number(h ?? 780)}
          sizes="(max-width: 820px) 100vw, 800px"
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    ),

    /** Reproducibility footnote, rendered from the data rather than retyped. */
    Provenance: () => {
      const p = (data.provenance ?? {}) as {
        injected?: number;
        rows?: number;
        seed?: number;
        reproduce?: string;
      };
      if (!p.rows) return null;
      return (
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 32 }}>
          All figures reproduce with <code>{p.reproduce ?? "make score"}</code> —{" "}
          {p.injected?.toLocaleString()} injected anomalies in{" "}
          {p.rows.toLocaleString()} rows, seed {p.seed}.
        </p>
      );
    },
  };
}
