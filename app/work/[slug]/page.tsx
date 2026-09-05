import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { mdxComponents } from "@/components/mdx";
import { getAllCaseStudies, getCaseStudy } from "@/lib/content";

export function generateStaticParams() {
  return getAllCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: `${study.title} — Manish Kumar Dhawal`, description: study.summary };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="page">
      <Link href="/" className="backlink">
        ← All work
      </Link>

      <header className="cs-header">
        <span className="eyebrow">{study.subtitle}</span>
        <h1>{study.title}</h1>
        <p className="cs-summary">{study.summary}</p>
      </header>

      <dl className="factbox">
        <div>
          <dt>Role</dt>
          <dd>{study.role}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{study.period}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{study.stack.join(", ")}</dd>
        </div>
        {study.repo && (
          <div>
            <dt>Code</dt>
            <dd>
              <a href={study.repo}>Repository</a>
            </dd>
          </div>
        )}
      </dl>

      <article className="prose">
        <MDXRemote
          source={study.body}
          components={mdxComponents(study.data)}
        />
      </article>

      <Footer />
    </main>
  );
}
