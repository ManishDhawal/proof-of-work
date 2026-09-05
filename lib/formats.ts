/**
 * Named value formats, shared by the server-side MDX binding and the client-side
 * chart that applies them.
 *
 * The indirection exists because of a React Server Components rule: a function
 * cannot be passed as a prop from a server component to a client one. Charts are
 * client components (they read the viewer's theme), and the MDX binding is a
 * server module — so what crosses the boundary is the *name* of a format, and
 * the chart looks it up itself.
 *
 * This module is deliberately plain: no "use client", so both sides can import it.
 */
export const FORMATS = {
  decimal3: (n: number) => n.toFixed(3),
  integer: (n: number) => Math.round(n).toLocaleString("en-US"),
  usd: (n: number) => `$${Math.round(n).toLocaleString("en-US")}`,
  usdK: (n: number) => `$${(n / 1000).toFixed(1)}k`,
  percent: (n: number) => `${(n * 100).toFixed(0)}%`,
} as const;

export type FormatName = keyof typeof FORMATS;

export const FORMAT_NAMES = Object.keys(FORMATS) as FormatName[];
