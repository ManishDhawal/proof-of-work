import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SiteHeader } from "@/components/SiteHeader";
import { mdxComponents } from "@/components/mdx";
import { getAllCaseStudies, getCaseStudy } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

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

  const title = `${study.title} — Manish Kumar Dhawal`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title,
      description: study.summary,
      url: `/work/${slug}`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.summary,
      images: ["/og.png"],
    },
  };
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
      <ReadingProgress />
      <SiteHeader current="Work" />

      <Link href="/" className="backlink">
        <span className="go" aria-hidden="true">←</span> All work
      </Link>

      <header className="cs-header rise rise-1">
        <span className="prov">{study.provenance}</span>
        <span className="eyebrow">{study.subtitle}</span>
        <h1>{study.title}</h1>
        <p className="cs-summary">{study.summary}</p>

        {/* Why a self-built project is here at all — answered before the
            reader has to wonder, and answered per project rather than once in
            the abstract, because the answer is different for the capstone. */}
        <p className="mirrors">
          <strong>Why this exists.</strong> {study.mirrors}
        </p>
      </header>

      <dl className="factbox rise rise-2">
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

      <article className="prose rise rise-3">
        <MDXRemote
          source={study.body}
          components={mdxComponents(study.data)}
        />
      </article>

      <Footer />
    </main>
  );
}
