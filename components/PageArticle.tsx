import type { Product, SeoPage, SiteConfig } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import { LeadForm } from "./LeadForm";
import { TrackedLink } from "./TrackedLink";

export function PageArticle({ page, product, site }: { page: SeoPage; product?: Product; site: SiteConfig }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <p className="eyebrow">Independent travel guide</p>
      <h1>{page.title}</h1>
      <p className="lede">{page.description}</p>
      <p className="updated">Last updated: <time dateTime={page.updated}>{new Date(`${page.updated}T00:00:00`).toLocaleDateString(site.locale, { dateStyle: "long" })}</time></p>
      <aside className="notice"><strong>Important:</strong> This is an independent informational guide. It is not affiliated with or endorsed by any temple, trust, government body, booking provider, or service.</aside>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />

      {product && <p><TrackedLink className="button" href="#pdf-guide" event="pdf_cta_click">See the printable PDF guide</TrackedLink></p>}

      <section className="official-links">
        <h2>Verify with official sources</h2>
        <p>Schedules, rules, prices, and availability can change. Confirm details before travelling.</p>
        <ul>{site.officialLinks.map((link) => <li key={link.url}><a href={link.url} rel="noopener noreferrer" target="_blank">{link.label}</a></li>)}</ul>
      </section>

      {product && <section className="product-card" id="pdf-guide">
        <p className="eyebrow">Optional paid PDF</p>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p className="price">₹{product.price}</p>
        <div className="cta-row">
          <TrackedLink className="button" href={product.paymentLink} event="payment_click" rel="nofollow sponsored noopener" target="_blank">Buy securely</TrackedLink>
        </div>
        <small>Payment is processed by a third party. The guide is independently produced and is not an official publication.</small>
      </section>}

      {(site.serviceCta || site.affiliateCta) && <section>
        <h2>Useful next steps</h2>
        {[site.serviceCta, site.affiliateCta].filter(Boolean).map((cta) => cta && <p key={cta.url}>
          <TrackedLink href={cta.url} event="service_cta_click" rel="nofollow sponsored noopener" target="_blank">{cta.label}</TrackedLink>
          {cta.disclosure && <small className="disclosure"> — {cta.disclosure}</small>}
        </p>)}
      </section>}

      <LeadForm siteId={site.id} source={page.slug} />
      <section>
        <h2>Frequently asked questions</h2>
        {page.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
      </section>
    </article>
  );
}
