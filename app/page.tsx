import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Method } from "@/components/Method";
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

      <Method />

      <section className="work rise rise-6">
        <div className="work-head">
          <span className="eyebrow">Selected work</span>
          <span className="spacer" />
          <span className="count">
            {String(studies.length).padStart(2, "0")} entries
          </span>
        </div>

        {/* Said once, here, rather than as a defensive footnote on each entry.
            A reader who wonders why the projects are self-built hits the answer
            before the first one. */}
        <p className="note">
          Client work in federal programmes, healthcare and life sciences does
          not leave the client. Two of the three projects below rebuild that
          work in public — same problem, same failure modes, generated or open
          data — so the method can be read end to end instead of taken on trust.
        </p>

        {studies.map((s, i) => (
          <article key={s.slug} className="entry">
            {/* The index column is a record reference, not decoration: it
                carries the entry number and the year the work was done. */}
            <div className="entry-index">
              <span className="no">{String(i + 1).padStart(2, "0")}</span>
              <span className="yr">{s.period}</span>
            </div>

            <div className="entry-body">
              <span className="prov">{s.provenance}</span>

              <div className="entry-title">
                <h2>
                  <Link href={`/work/${s.slug}`}>{s.title}</Link>
                </h2>
                <span className="go" aria-hidden="true">
                  →
                </span>
              </div>

              <p>{s.summary}</p>

              {/* The finding, on the index. The whole reason this site is not
                  a true one-pager is that the evidence lives a click away —
                  this is the part of the evidence that survives the skim. */}
              <div className="entry-result">
                <span className="rk">Result</span>
                <span>{s.result}</span>
              </div>

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
