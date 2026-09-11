import Link from "next/link";

/**
 * No email address in the markup — it is the one contact detail scrapers
 * harvest, and LinkedIn covers the same job. Recruiters who need it ask.
 */
export function Footer() {
  return (
    <footer>
      <Link href="/about">About</Link>
      <a href="https://www.linkedin.com/in/manishdhawal">LinkedIn</a>
      <a href="https://github.com/ManishDhawal">GitHub</a>
      <a href="/Manish_Kumar_Dhawal_Resume.pdf">Résumé (PDF)</a>
      <span className="spacer" />
      <span>Built with Next.js · source on GitHub</span>
    </footer>
  );
}
