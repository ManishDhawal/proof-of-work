import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyMeta = {
  slug: string;
  title: string;
  subtitle: string;
  role: string;
  period: string;
  stack: string[];
  repo?: string;
  summary: string;
};

export type CaseStudy = CaseStudyMeta & {
  body: string;
  /** Figures for the charts, from the sibling <slug>.data.json. */
  data: Record<string, unknown>;
};

/**
 * Every case study, newest period first.
 *
 * Adding one means dropping an .mdx file in content/case-studies — no routing,
 * no index to update. That is the whole reason content lives outside app/.
 */
export function getAllCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
      return { slug, ...(data as Omit<CaseStudyMeta, "slug">) };
    })
    .sort((a, b) => b.period.localeCompare(a.period));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data: fm, content } = matter(fs.readFileSync(file, "utf8"));

  // Chart figures live beside the prose so adding a case study means adding
  // files, not editing React.
  const dataFile = path.join(CONTENT_DIR, `${slug}.data.json`);
  const data = fs.existsSync(dataFile)
    ? (JSON.parse(fs.readFileSync(dataFile, "utf8")) as Record<string, unknown>)
    : {};

  return { slug, body: content, data, ...(fm as Omit<CaseStudyMeta, "slug">) };
}

/** Projects not yet written up. Empty once every planned case study has shipped. */
export const PLANNED: { title: string; blurb: string; stack: string[] }[] = [];
