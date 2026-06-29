# n8n Cloud workflow implementation notes

`workflows.json` is a provider-neutral specification because n8n export JSON embeds node versions and credential references that vary by account. Build the workflows from these contracts using Webhook, Code, Supabase (or HTTP Request/Baserow), Send Email, Google Search Console/HTTP, Schedule Trigger, and Error Trigger nodes.

## State mapping

For Supabase, use `state/supabase.sql`. In Baserow create `leads`, `product_catalog`, `orders`, `page_metrics`, and `experiment_suggestions` tables with equivalent columns and unique provider payment IDs. Copy approved product price, provider-link reference, email template, and private object-storage key from `products.json` into `product_catalog`; activate it only after PDF approval. n8n is the only writer; the static browser never receives a database service credential.

The PDFs in `public/products` are explicit sample artifacts for repository review. Do not put a paid production file in that public directory. Upload the approved production PDF to private object storage and let the verified payment workflow create a short-lived signed URL using `private_pdf_key`.

## Required secrets

- `PAYMENT_WEBHOOK_SECRET` for the chosen provider
- Supabase service role or Baserow database token
- SMTP/transactional email credential and verified sender
- Google Search Console OAuth2 credential
- Optional GA4 Measurement Protocol API secret

Signature verification must follow the current provider documentation and use the raw body. Keep separate test and production secrets. Test invalid signatures and duplicate deliveries before launch.

## Search Console rules to start with

- CTR opportunity: impressions ≥ 100, average position 4–15, CTR below the site's rolling median.
- Refresh candidate: clicks or impressions down ≥ 30% period over period with at least 100 prior impressions.
- Content gap: query impressions ≥ 50, position 8–20, and no page whose primary keyword or cluster contains the query terms.

These thresholds create editorial suggestions, not automatic conclusions. Seasonality, brand queries, query intent, and statistical noise need a human review.
