/**
 * Chart tokens. One place, so every case study looks like one system.
 *
 * Colours come from a palette validated for colour-vision deficiency in both
 * light and dark mode: worst-pair separation ΔE 15.9 (protan) and 17.8 (normal
 * vision), both comfortably above the floors, contrast ≥ 3:1 on each surface.
 *
 * `baseline` is deliberately desaturated — it marks a "before" or reference
 * series and is meant to recede. Because it reads as grey rather than as a
 * second identity, every chart that uses it also carries a legend, distinct
 * value labels, or both, so identity is never colour alone.
 */

export type Mode = "light" | "dark";

export const palette = {
  light: {
    surface: "#fcfcfb",
    inkPrimary: "#0b0b0b",
    inkSecondary: "#52514e",
    inkMuted: "#898781",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    series: "#2a78d6",
    baseline: "#898781",
  },
  dark: {
    surface: "#1a1a19",
    inkPrimary: "#ffffff",
    inkSecondary: "#c3c2b7",
    inkMuted: "#898781",
    grid: "#2c2c2a",
    axis: "#383835",
    series: "#3987e5",
    baseline: "#898781",
  },
} as const;

export const font =
  'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif';

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
