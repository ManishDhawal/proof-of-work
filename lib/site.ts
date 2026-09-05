/**
 * One place for the things that change when a domain is added.
 *
 * Set NEXT_PUBLIC_SITE_URL in the Vercel project when a custom domain is
 * pointed at the site; everything else — canonical URLs, the share card, the
 * sitemap — follows from it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://proof-of-work-orcin.vercel.app";

export const SITE_NAME = "Manish Kumar Dhawal — Proof of Work";

export const SITE_DESCRIPTION =
  "Data analyst. Reporting and pipelines for regulated environments — federal programmes, healthcare, life sciences.";
