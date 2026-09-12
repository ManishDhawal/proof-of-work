import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * A thin bar across every page. The site previously had no persistent
 * navigation at all — from a case study the only way back was a single link
 * above the title, and there was nowhere to put the theme control.
 */
export function SiteHeader({ current }: { current?: string }) {
  return (
    <div className="site-header">
      <Link href="/" className="home">
        MKD
      </Link>
      {current && <span style={{ color: "var(--faint)" }}>/ {current}</span>}
      <span className="spacer" />
      <ThemeToggle />
    </div>
  );
}
