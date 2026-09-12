import Link from "next/link";

import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllCaseStudies } from "@/lib/content";

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <main className="page">
      <SiteHeader />

      <header className="masthead">
        <div className="name rise rise-1">Manish Kumar Dhawal</div>
        <h1 className="rise rise-2">
          Reporting and data pipelines for environments where the numbers get
          audited.
        </h1>
        <p className="lede rise rise-3">
          Four years building Power BI and SQL reporting for federal programmes,
          healthcare and life sciences — the kind of work where a metric needs a
          definition, a lineage record, and someone who can explain it to the
          people it affects.
        </p>
        <div className="meta-row rise rise-4">
          <span>Worcester, MA</span>
          <span>M.S. Data Analytics, Clark University</span>
          <Link href="/about">About me →</Link>
        </div>
      </header>

      <section className="work rise rise-4">
        <div className="work-head">
          <span className="eyebrow">Selected work</span>
          <span className="spacer" />
          <span className="count">
            {String(studies.length).padStart(2, "0")} entries
          </span>
        </div>

        {studies.map((s, i) => (
          <article key={s.slug} className="entry">
            {/* The index column is a record reference, not decoration: it
                carries the entry number and the year the work was done. */}
            <div className="entry-index">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="yr">{s.period}</span>
            </div>

            <div className="entry-body">
              <div className="entry-title">
                <h2>
                  <Link href={`/work/${s.slug}`}>{s.title}</Link>
                </h2>
                <span className="go" aria-hidden="true">
                  →
                </span>
              </div>
              <p>{s.summary}</p>
              <div className="stack">
                {s.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
