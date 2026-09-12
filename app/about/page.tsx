import Link from "next/link";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME } from "@/lib/site";

const TITLE = "About — Manish Kumar Dhawal";
const DESCRIPTION =
  "Data analyst, four years building reporting for federal programmes, healthcare and life sciences. Currently in Worcester, MA, and looking for a senior analyst or BI role.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

/** Roles, most recent first. Dates and figures come from the résumé. */
const ROLES = [
  {
    period: "2025 — now",
    org: "CGI",
    place: "Arlington, VA",
    role: "Data Analyst",
    body: "Automated Power BI reporting suites for federal government clients — the kind leadership opens every morning. Most of the job is upstream of the dashboard: gathering requirements from stakeholders who do not think in tables, then writing the data lineage records that say where every metric came from, so the reporting survives a cross-departmental audit. Also rebuilt a set of Azure Data Factory pipelines, cutting data latency by about a quarter.",
  },
  {
    period: "2024 — 2025",
    org: "Veeva Systems",
    place: "Remote, contract",
    role: "Data Analyst",
    body: "Power BI and Tableau over sales and clinical metrics for life-sciences clients, and the documentation that let their teams sustain HIPAA and GDPR compliance across Salesforce and Veeva Vault. I also ran the onboarding — walking client teams through what each metric actually meant, which is usually where adoption is won or lost. Automating the recurring preparation with SQL and Python took roughly 40% off the manual load.",
  },
  {
    period: "2020 — 2023",
    org: "Global Computers and Communication",
    place: "Bangalore",
    role: "Data Analyst",
    body: "Three years and more than twenty Power BI dashboards for spend analysis and forecasting. The part I would point at is not the dashboards — it is that I trained every finance and operations user on them and wrote the guides, which is why the repeat support requests dropped. A dashboard nobody can use unaided is not finished.",
  },
  {
    period: "2018",
    org: "DRDO — SAG Labs",
    place: "Delhi",
    role: "Data Analyst Intern",
    body: "Ten thousand optimisation simulations turned into something senior scientists could read at a glance. First time I understood that the translation is the work.",
  },
];

const EDUCATION = [
  { period: "2025", what: "M.S. Data Analytics", where: "Clark University, Worcester, MA" },
  { period: "2023", what: "PG Diploma, Data Science", where: "IIIT Bengaluru" },
];

export default function About() {
  return (
    <main className="page">
      <SiteHeader current="About" />

      <Link href="/" className="backlink">
        <span className="go" aria-hidden="true">←</span> All work
      </Link>

      <header className="masthead">
        <div className="name rise rise-1">About</div>
        <h1 className="rise rise-2">I build numbers that somebody else has to defend.</h1>
        <p className="lede rise rise-3">
          Four years of reporting work, and the constant across all of it is
          that I am not the one in the room when the number gets questioned. A
          federal auditor asks where a figure came from. A compliance officer
          asks what happens to it between the source system and the slide. A
          finance lead has to stand behind a forecast they did not build. That
          shapes everything about how I work.
        </p>
      </header>

      <section className="about-section measure rise rise-4">
        <p>
          It is why I care more about metric definitions and lineage records
          than most people think is reasonable, and why the three projects on
          this site are all variations on one question:{" "}
          <em>can you actually defend this number?</em> Each of them ends with
          something that went wrong — a risk score that turned out to be noise,
          a dashboard that disproved its own data, a model that learned to say
          yes to everything. Those are the parts worth reading, and the parts I
          would want to be asked about.
        </p>
      </section>

      <section className="work">
        <div className="work-head">
          <span className="eyebrow">Experience</span>
        </div>

        {ROLES.map((r) => (
          <article key={r.org} className="cv-entry">
            <div className="cv-when">
              <span className="cv-period">{r.period}</span>
              <span className="cv-place">{r.place}</span>
            </div>
            <div className="cv-what">
              <h2>{r.org}</h2>
              <span className="eyebrow">{r.role}</span>
              <p>{r.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="work">
        <div className="work-head">
          <span className="eyebrow">Education</span>
        </div>
        {EDUCATION.map((e) => (
          <article key={e.what} className="cv-entry">
            <div className="cv-when">
              <span className="cv-period">{e.period}</span>
            </div>
            <div className="cv-what">
              <h3>{e.what}</h3>
              <p className="cv-where">{e.where}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="about-section measure looking">
        <span className="eyebrow">Looking</span>
        <h2>What I want next</h2>
        <p>
          I am looking for a senior data or BI analyst role, ideally somewhere
          the reporting has consequences — regulated industries, or any team
          where a number ending up wrong is a real problem rather than an
          inconvenience. Healthcare, government and life sciences are where I
          have spent my career, but the thing I am actually good at travels:
          taking a messy source system and a stakeholder who cannot describe
          what they need, and producing something they trust and can explain to
          their own boss.
        </p>
        <p>
          Based in Worcester, Massachusetts. Open to remote and to relocating
          for the right team.
        </p>
        <p>
          The fastest way to judge whether I would be useful to you is{" "}
          <Link href="/">the work itself</Link>. If it looks like a fit,{" "}
          <a href="https://www.linkedin.com/in/manishdhawal">
            reach me on LinkedIn
          </a>
          .
        </p>
      </section>

      <Footer />
    </main>
  );
}
