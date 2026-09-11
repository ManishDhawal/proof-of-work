import Link from "next/link";

import { Footer } from "@/components/Footer";
import { PLANNED, getAllCaseStudies } from "@/lib/content";

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <main className="page">
      <header className="masthead">
        <div className="name">Manish Kumar Dhawal</div>
        <h1>
          Reporting and data pipelines for environments where the numbers get
          audited.
        </h1>
        <p className="lede">
          Four years building Power BI and SQL reporting for federal programmes,
          healthcare and life sciences — the kind of work where a metric needs a
          definition, a lineage record, and someone who can explain it to the
          people it affects.
        </p>
        <div className="meta-row">
          <span>Worcester, MA</span>
          <span>M.S. Data Analytics, Clark University</span>
          <Link href="/about">About me →</Link>
        </div>
      </header>

      <section className="work">
        <div className="work-head">
          <span className="eyebrow">Selected work</span>
        </div>

        {studies.map((s) => (
          <article key={s.slug} className="entry">
            <div className="entry-title">
              <h2>
                <Link href={`/work/${s.slug}`}>{s.title}</Link>
              </h2>
            </div>
            <p>{s.summary}</p>
            <div className="stack">
              {s.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}

        {PLANNED.map((p) => (
          <article key={p.title} className="entry pending">
            <div className="entry-title">
              <h2>{p.title}</h2>
              <span className="eyebrow">In progress</span>
            </div>
            <p>{p.blurb}</p>
            <div className="stack">
              {p.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
