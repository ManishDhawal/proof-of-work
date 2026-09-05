import { Bars, type BarRow } from "@/components/charts/Bars";
import { StatRow, type Stat } from "@/components/charts/StatRow";

type Data = Record<string, unknown>;

/**
 * The component vocabulary an .mdx case study can use.
 *
 * next-mdx-remote's RSC build resolves neither imports nor a `scope` prop, so
 * the case study's figures are bound here instead: MDX names a key from its
 * sibling .data.json and the value is looked up at render time.
 *
 *     <StatRow from="headline" />
 *     <Bars from="failureModes" names={{ value: "After", baseline: "Before" }} />
 *
 * Writing a case study therefore needs no JavaScript — a key, and the numbers
 * live in the JSON where they can be regenerated from a pipeline run.
 */
export function mdxComponents(data: Data) {
  function pick<T>(from: string): T[] {
    const rows = data[from];
    if (!Array.isArray(rows)) {
      throw new Error(
        `Case study data has no array at "${from}". Available keys: ${Object.keys(data).join(", ") || "(none)"}`,
      );
    }
    return rows as T[];
  }

  return {
    StatRow: ({ from }: { from: string }) => (
      <div className="figure">
        <StatRow stats={pick<Stat>(from)} />
      </div>
    ),

    Bars: ({
      from,
      ...rest
    }: { from: string } & Omit<Parameters<typeof Bars>[0], "data">) => (
      <figure className="figure">
        <Bars data={pick<BarRow>(from)} {...rest} />
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
