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

MDX cannot import anything here — `next-mdx-remote` resolves neither imports nor
a `scope` prop in its RSC build. Components are injected in `components/mdx.tsx`
instead, and each one names a key from the sibling JSON:

```mdx
<StatRow from="headline" />
<Bars from="failureModes" max={1} names={{ value: "After", baseline: "Before" }} />
<Provenance />
```

Naming a key that is not in the JSON throws at build time with the available
keys listed, rather than rendering an empty chart.

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
