# SEO Micro-site Experiment Factory

A config-driven Next.js static-site factory for small, independent informational sites selling ₹99–₹499 PDF guides. One codebase builds one selected site at a time; content and commercial settings live under `sites/<site-id>`.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run site:validate -- --site somnath
npm run pdf:build -- --site somnath
NEXT_PUBLIC_SITE_ID=somnath npm run dev
```

The Somnath payment, service, domain, support email, GA4 ID, and webhook are deliberately non-production placeholders. They must be replaced and manually approved before launch.

## Repository map

```text
app/                    Next.js pages, policies, sitemap and robots
components/             article, lead form, analytics and tracked CTAs
lib/                    typed site loader and shared helpers
sites/_template/        copyable starter configuration
sites/somnath/          sample site, SEO pages, keywords and product source
public/products/        generated PDF artifacts
scripts/                keyword pipeline, validation, PDF and deploy tools
state/supabase.sql      optional Supabase state schema
n8n/                    workflow contracts and implementation notes
approvals/              human gate protocol (markers are not automated)
docs/DEPLOYMENT.md       GitHub/Vercel/n8n launch runbook
tests/                  pipeline tests
```

## Create another site

Copy `sites/_template` to `sites/<id>`, fill `site.json` and `products.json`, then add Markdown pages. Set `NEXT_PUBLIC_SITE_ID=<id>` locally and in that site's Vercel project. A separate Vercel project per site gives clean domains, environment variables, analytics, and rollback history while reusing this repository.

Import a Google Keyword Planner CSV:

```bash
npm run keywords:import -- \
  --input sites/somnath/keywords/sample-keyword-planner.csv \
  --site somnath
```

This writes `generated/scored-keywords.csv` and `generated/clusters.json`. Scores blend logarithmic volume (45%), lower competition (20%), high-range CPC (20%), and observable planning/commercial intent (15%). Scores prioritise editorial review; they are not traffic forecasts. Clustering uses token overlap and is deliberately inspectable.

## Editorial and compliance guarantees

The shared page template renders the disclaimer, official links, last-updated date, guide body, paid PDF CTA, service/affiliate CTA, lead form, visible FAQs, and FAQ JSON-LD. PDF generation adds an independence banner to every page and validates that the source includes the required notice. No config should imitate an official organisation, and all time-sensitive claims should point readers back to primary sources.

See [the deployment runbook](docs/DEPLOYMENT.md) before connecting real money or a domain.
