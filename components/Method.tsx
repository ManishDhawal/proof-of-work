/**
 * The method band.
 *
 * It fills the gap between the headline and the case studies: a recruiter who
 * is not going to read two thousand words still needs to learn what the job
 * is and which tools do it. Structuring it by stage rather than by tool is the
 * point — a skills grid says what I have touched, a workflow says what I do.
 *
 * The tool names are <strong>, which on this site means a tonal step rather
 * than a weight jump (see globals.css). They are keywords, and they need to be
 * findable on a skim without turning the paragraph into a highlighter test.
 */

const STAGES = [
  {
    no: "01",
    name: "Define",
    body: (
      <>
        Reporting fails upstream of the chart. The work starts with stakeholders
        who cannot describe what they need in table terms and ends with a metric
        dictionary and a lineage record — what a number means, where it came
        from, what it excludes. Written as <strong>SQL</strong> and{" "}
        <strong>dbt</strong> models, because a definition nobody can execute is
        a memo.
      </>
    ),
  },
  {
    no: "02",
    name: "Build",
    body: (
      <>
        Ingestion, transformation, validation.{" "}
        <strong>Azure Data Factory</strong> and <strong>Python</strong> move the
        data, <strong>dbt</strong> and <strong>PostgreSQL</strong> hold its
        shape, and tests fail loudly when a row breaks a rule it is supposed to
        obey. Where a model earns its place, <strong>scikit-learn</strong> — and
        where it does not, that gets said out loud.
      </>
    ),
  },
  {
    no: "03",
    name: "Defend",
    body: (
      <>
        The part that gets audited. <strong>Power BI</strong> and{" "}
        <strong>DAX</strong> for the reporting leadership opens every morning,{" "}
        <strong>Tableau</strong> where a client already lives there, and the
        documentation and onboarding that let their own team answer the question
        without me in the room.
      </>
    ),
  },
];

export function Method() {
  return (
    <section className="band rise rise-5" aria-labelledby="method-head">
      <span className="eyebrow" id="method-head">
        Method
      </span>
      <p className="band-lede">
        Every number I put on a dashboard has to survive somebody else being
        asked where it came from. That one constraint shapes all three stages.
      </p>

      <div className="caps">
        {STAGES.map((s) => (
          <article key={s.no} className="cap">
            <span className="cap-no">{s.no}</span>
            <h2>{s.name}</h2>
            <p>{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
