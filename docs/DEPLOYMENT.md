# GitHub, Vercel, and launch runbook

## 1. Put the repository on GitHub

Create a private GitHub repository, add this directory as its remote, and push a reviewed branch. Protect `main`, require the `verify` check, and restrict who can change production environment variables. The included workflow validates, generates PDFs, type-checks, tests, and builds Somnath without deploying it.

## 2. Create one Vercel project per site

Import the same GitHub repository into Vercel. Set `NEXT_PUBLIC_SITE_ID` to the target site ID and add:

- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_LEAD_WEBHOOK_URL`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only if the browser will directly use Supabase (the sample sends leads to n8n instead)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` only in the trusted deployment environment

Keep preview deployments enabled. Production deployment via `scripts/deploy-vercel.mjs` additionally requires a real domain, a real approved payment link, and all three manual approval markers. Vercel dashboard Git auto-deploy should remain disabled until the launch gate is approved, otherwise it can bypass the local gate script.

## 3. Configure state

Create a Supabase project and run `state/supabase.sql` in its SQL editor. Give n8n the project URL and a server-side service-role credential; never expose that credential as a `NEXT_PUBLIC_` variable. Baserow can be substituted using tables with the same fields described in `n8n/README.md`.

## 4. Configure n8n Cloud

Build the three workflows in `n8n/workflows.json` using the node contracts in `n8n/README.md`. Store payment webhook secrets, Supabase credentials, email credentials, and Google OAuth in n8n credentials. Do not put them in workflow JSON or Git.

For payments, create a provider webhook for a successful Payment Link event. Verify its signature against the exact raw request body, deduplicate the provider payment ID, look up the server-side product record, and only then send a short-lived/private PDF link. Never trust product ID, amount, status, or email supplied only by a browser redirect. The committed PDFs are samples; paid production PDFs belong in private object storage, not `public/`.

## 5. Analytics and Search Console

Create a GA4 property, set its measurement ID, and mark purchase only from a verified server-side payment workflow if purchase reporting is required. The UI emits `page_view`, `pdf_cta_click`, `payment_click`, `service_cta_click`, and `form_submit`.

After domain ownership, verify Search Console, submit `/sitemap.xml`, and grant the n8n Google credential read access. The weekly workflow records query/page metrics and creates review suggestions; it does not publish content automatically.

## 6. Manual gates and production

1. Purchase the domain and confirm DNS ownership. A human records `approvals/<site>/domain.approved`.
2. Review the exact generated PDF, links, independence notice, price, and delivery email. A human records `pdf.approved`.
3. On a preview URL, test mobile layout, policies, analytics DebugView, webhook signature rejection, lead consent, email delivery, duplicate webhook delivery, refund support, and one real low-value payment. A human records `launch.approved`.
4. Replace all `.example.com` and `REPLACE_` values.
5. Run `npm run deploy -- --site <id> --dry-run`, then remove `--dry-run` for production.

Domain purchase, PDF approval, and launch approval are deliberately never automated.
