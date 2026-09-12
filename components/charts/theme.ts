/**
 * Chart tokens. One place, so every case study looks like one system.
 *
 * Colours are drawn from the page palette — cool neutrals, a navy-family series
 * — and re-validated for colour-vision deficiency after the move: series against
 * baseline separates by ΔE 39.3 (protan) / 44.2 (deutan) in light mode and 26.9
 * / 30.8 in dark, and every mark clears 3:1 against its own surface (light
 * series 6.81, baseline 3.85; dark series 6.88, baseline 5.38).
 *
 * `baseline` is deliberately desaturated — it marks a "before" or reference
 * series and is meant to recede. Because it reads as grey rather than as a
 * second identity, every chart that uses it also carries a legend, distinct
 * value labels, or both, so identity is never colour alone.
 */

export type Mode = "light" | "dark";

export const palette = {
  light: {
    surface: "#ffffff",
    inkPrimary: "#0d1117",
    inkSecondary: "#384049",
    inkMuted: "#69727d",
    grid: "#e6e9ee",
    axis: "#c2c9d1",
    series: "#1f5c9e",
    baseline: "#7a838d",
  },
  dark: {
    surface: "#14181d",
    inkPrimary: "#eef1f5",
    inkSecondary: "#c0c8d2",
    inkMuted: "#8891a0",
    grid: "#262c34",
    axis: "#343c47",
    series: "#6aa6dd",
    baseline: "#858e9b",
  },
} as const;

/* Charts inherit the page face rather than system-ui, so a figure reads as part
   of the document instead of a screenshot pasted into it. */
export const font =
  '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

/** Resolves the viewer's theme: OS preference, plus an explicit data-theme stamp. */
export function resolveChartMode(): Mode {
  if (typeof window === "undefined") return "light";
  const root = document.documentElement;
  const stamped = root.getAttribute("data-theme");
  if (stamped === "dark") return "dark";
  if (stamped === "light") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
