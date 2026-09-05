# proof-of-work

Case studies for work that does not fit on a CV. Next.js, MDX, deployed on Vercel.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; both routes prerender statically
```

## Adding a case study

Two files, no code:

1. `content/case-studies/<slug>.mdx` — frontmatter plus prose.
2. `content/case-studies/<slug>.data.json` — the figures its charts read.

The route, the home-page entry and the static params all come from the file
being there. Nothing else needs editing.

### Frontmatter

```yaml
---
title: "..."
subtitle: "..."      # eyebrow above the title
role: "..."          # "Solo project", "Team of 4 — I owned X"
period: "2026"       # also the sort key, newest first
stack: ["Python", "dbt"]
repo: "https://..."  # optional
summary: "..."       # shown on the home page and as the page description
---
```

### Charts

A case study never writes JavaScript. Each chart names a block in its sibling
JSON and takes nothing else:

```mdx
<StatRow from="headline" />
<Bars from="failureModes" />
<Provenance />
```

Everything the chart needs lives in that block:

```json
"failureModes": {
  "max": 1,
  "names": { "value": "After", "baseline": "Before" },
  "rows": [
    { "label": "Billing outlier", "baseline": 0.82, "value": 1.0 }
  ]
}
```

`rows` may also be a bare array when a chart needs no configuration. Naming a
key that is not in the JSON throws at build time with the available keys listed,
rather than rendering an empty chart.

**Why one prop.** `next-mdx-remote` 6 — the release that patches the RSC
code-execution advisory
([GHSA-g4xw-jxrg-5f6m](https://github.com/advisories/GHSA-g4xw-jxrg-5f6m)) —
passes **string attributes only.** Expression attributes such as `max={1}` are
stripped before the component sees them, and stripped *silently*: the chart
renders with defaults and nothing warns you. Imports and a `scope` prop are not
supported either. Keeping configuration in the JSON sidesteps all of it.

## The chart set

`components/charts/` holds two components and one token file, and that is
deliberate. Bespoke chart code per case study is how a portfolio ends up with one
finished project and two abandoned ones.

- `Bars` — horizontal bars, one or two series. Hover tooltip, legend when there
  are two series, direct value labels.
- `StatRow` — headline figures. Not a chart; three or four numbers with no shape
  do not need a plot.
- `theme.ts` — palette and type tokens, light and dark in one place.

The colours are validated for colour-vision deficiency rather than chosen by
eye: worst-pair separation ΔE 15.9 under protanopia simulation, 17.8 at normal
vision, contrast at or above 3:1 on both surfaces. The grey "before" series is
deliberately desaturated — it is a reference mark, not a second identity, so
every chart using it also carries a legend and direct labels.

## Structure

```
app/
  page.tsx              home — masthead and the work index
  work/[slug]/page.tsx  case study route, statically generated
  globals.css           the whole design system
components/
  charts/               the reusable chart set
  mdx.tsx               the component vocabulary MDX can use
  Footer.tsx
content/case-studies/   the actual writing
lib/content.ts          frontmatter parsing and the planned-work list
public/                 résumé PDF goes here
```

## Dependencies

Pinned with carets so security patches arrive without a manual bump. `npm audit`
should stay at zero; if it does not, fix it before deploying.

Three of these have behaviour worth knowing about:

- **Recharts 3** removed the `<Legend>` render this site was using, so `Bars`
  draws its own legend from the same tokens. Its formatters also receive a loose
  value type now, coerced once in `looseFormat`.
- **Recharts 3** draws nothing for a zero-value bar, which silently dropped the
  "0.000" labels that carry real meaning here. `minPointSize={2}` restores a
  visible stub.
- **Recharts 3** picks its own axis tick stops and ignored the domain maximum,
  ending an axis at 0.900 and making 0.887 look like full scale. `Bars` states
  its ticks explicitly.

## Deploying

Push to GitHub, import the repo on Vercel, accept the defaults. No environment
variables. A custom domain is added in the Vercel project settings.

## Notes

- No email address appears in the markup — it is the one contact detail scrapers
  harvest, and LinkedIn covers the same job.
- `public/Manish_Kumar_Dhawal_Resume.pdf` is referenced by the footer and needs
  to be added; the link 404s until it is.
- Two entries on the home page are marked *in progress* and live in `PLANNED` in
  `lib/content.ts`. Remove an entry from that array when its case study ships.
