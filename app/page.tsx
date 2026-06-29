import type { Metadata } from "next";
import Link from "next/link";
import { AssistanceForm } from "@/components/AssistanceForm";
import { TrackedLink } from "@/components/TrackedLink";
import { getProducts, getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Somnath Darshan, Official Website, Tickets, Hotels & Trip Guide",
  description: "Independent Somnath trip-planning guide covering the official website, temple timings, tickets, hotels, transport, PDFs, and simple Hindi answers.",
  alternates: { canonical: "/" }
};

const guides = [
  ["Somnath Temple Official Website", "/somnath-temple-official-website/", "Find the genuine portal and check current notices safely."],
  ["Somnath Temple Tickets", "/somnath-temple-tickets/", "Understand what to verify before paying anyone."],
  ["Somnath Temple Timings", "/somnath-temple-timings/", "Plan around current hours, queues, and date-specific notices."],
  ["Hotels in Somnath Near Somnath Temple", "/hotels-near-somnath-temple/", "Compare location, access, cancellation, and arrival time."],
  ["Somnath Temple Trust", "/somnath-temple-trust/", "Separate official trust information from third-party sites."],
  ["How to Reach Somnath", "/how-to-reach-somnath/", "Compare train, road, and air routes door to door."],
  ["Somnath Two-Day Itinerary", "/somnath-two-day-itinerary/", "Use a flexible two-day plan with sensible buffers."],
  ["Somnath Online Pooja Booking", "/somnath-online-pooja-booking/", "Check whether a service is listed by the official portal."],
] as const;

const faqs = [
  ["Is this the official Somnath temple or trust website?", "No. This is an independent information guide. The official Shree Somnath Trust website is linked clearly so you can verify final details."],
  ["What is the official Somnath temple website?", "Use the Shree Somnath Trust link on our official-links page. Check the domain carefully before entering personal details or making a payment."],
  ["Do I need a ticket for Somnath temple darshan?", "Do not rely on a blanket yes-or-no answer because arrangements can differ by service, date, or special event. Check the current official portal before travelling or paying."],
  ["What are the current Somnath temple timings?", "Timings and access conditions can change. Use the official trust portal for the current schedule and allow extra time for security and queues."],
  ["Can this website guarantee darshan?", "No. We do not issue passes, control access, or guarantee darshan, queue time, ceremony attendance, or availability."],
  ["Can I book pooja through this website?", "No. We provide independent information only. Use a service only when you can verify it through the official portal and its current instructions."],
  ["Which station is convenient for Somnath?", "Veraval is commonly used for the area, but routes and stopping patterns can change. Confirm your exact train and station through Indian Railways."],
  ["How should I choose a hotel near Somnath temple?", "Compare map location, recent guest reviews, check-in time, cancellation terms, transport access, and the property's own confirmation—not distance claims alone."],
  ["Is a two-day Somnath trip enough?", "Two days can support a calm main visit and a limited number of nearby stops when your arrival and departure include realistic buffers."],
  ["Does the PDF replace official information?", "No. The PDFs are independent planning aids. Every guide asks you to reconfirm changing details with primary official sources."],
  ["Can I request hotel or cab help here?", "You may leave an enquiry using the placeholder form. It is not a confirmed booking, and no arrangement exists until a provider gives you written terms that you accept."],
  ["How can I avoid fake booking links?", "Start from the official trust website, inspect the full domain, avoid guarantees and pressure tactics, and verify the recipient before sharing documents or paying."],
  ["Somnath mandir kaise jaye?", "Train, road aur air options ko total travel time ke saath compare karein. Final train, bus, flight aur local transfer details official operator se check karein."],
] as const;

export default function Home() {
  const site = getSiteConfig();
  const products = getProducts().slice(0, 3);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

    <section className="hero home-hero">
      <p className="independence-strip">Independent information guide — we are not the official temple or trust website.</p>
      <p className="eyebrow">Plan first. Verify officially. Travel calmly.</p>
      <h1>Somnath Darshan, Official Website, Tickets, Hotels &amp; Trip Guide</h1>
      <p className="lede">Practical Somnath planning in one place: official-source checks, timings, ticket questions, nearby stays, transport, simple itineraries, and printable independent PDF guides.</p>
      <p className="hero-verify">Always verify final timings, rules, services, availability, and payment details on the relevant official portal before booking or paying.</p>
      <div className="cta-row">
        <TrackedLink className="button" href="#pdf-guides" event="pdf_cta_click">Download PDF guide</TrackedLink>
        <Link className="button button-secondary" href="#most-read">Browse most-read guides</Link>
        <Link className="text-link" href="/official-links/">Open official links</Link>
      </div>
    </section>

    <section id="most-read" className="home-section wide-section">
      <div className="section-heading"><div><p className="eyebrow">Start here</p><h2>Most-Read Somnath Guides</h2></div><p>Short, focused explainers for the questions people usually search before a visit.</p></div>
      <div className="guide-index">{guides.map(([title, href, description], index) => <Link className="index-card" href={href} key={href}><span className="index-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p><strong>Read guide →</strong></div></Link>)}</div>
    </section>

    <section id="pdf-guides" className="home-section wide-section product-band">
      <div className="section-heading"><div><p className="eyebrow">Printable planning aids</p><h2>Somnath PDF Guides</h2></div><p>Optional independent PDFs for travellers who prefer a compact offline checklist. These are not official publications or booking documents.</p></div>
      <div className="product-grid">{products.map((product) => <article className="home-product" key={product.id}>
        <p className="eyebrow">PDF guide</p><h3>{product.title}</h3><p>{product.description}</p><p className="price">₹{product.price}</p>
        <TrackedLink className="button" href={product.paymentLink} event="payment_click" rel="nofollow sponsored noopener" target="_blank">Get the PDF</TrackedLink>
        <small>Independent guide. Secure payment link must be verified before launch.</small>
      </article>)}</div>
    </section>

    <section className="home-section prose-section">
      <p className="eyebrow">Use primary sources</p>
      <h2>How to check the official Somnath website</h2>
      <p>Search results can mix the trust portal with travel blogs, advertisements, directories, and similarly named domains. Begin with our <Link href="/official-links/">official links page</Link>, which separates primary sources from this independent guide. Before entering a phone number, identity document, or payment information, inspect the complete web address and confirm that the same service appears on the trust's current portal.</p>
      <p>A logo or the word “official” in a search result is not proof of affiliation. Avoid links sent by unknown agents, promises of guaranteed access, and urgent payment requests. If information here differs from a current official notice, follow the official notice.</p>
      <div className="inline-cta"><Link className="button button-secondary" href="/somnath-temple-official-website/">Read the website-check guide</Link><Link href="/official-links/">View primary official links →</Link></div>
    </section>

    <section className="home-section split-section">
      <div><p className="eyebrow">Build in a buffer</p><h2>Somnath temple timings and darshan planning</h2><p>A published schedule is only a starting point. Date-specific notices, ceremonies, crowd levels, weather, security arrangements, and special events may affect the practical experience. Recheck close to departure and on the day of your visit.</p><p>Leave room for local traffic, walking, security, queues, storing restricted belongings, meals, and rest. Do not connect your planned visit to a tightly timed train or bus without a fallback.</p><Link href="/somnath-temple-timings/">Plan around current timings →</Link></div>
      <aside className="soft-card"><h3>Quick planning check</h3><ul><li>Open the trust's current notice or schedule.</li><li>Confirm rules for your exact date.</li><li>Carry only permitted essentials.</li><li>Keep onward travel flexible.</li><li>Save official links offline.</li></ul></aside>
    </section>

    <section className="home-section prose-section">
      <p className="eyebrow">Payment caution</p><h2>Are tickets needed for Somnath temple?</h2>
      <p>Different searches use “ticket” to mean general entry, a particular service, a ceremony, a donation, or a third-party travel package. Those are not interchangeable. We therefore do not publish a universal ticket claim or accept money for temple access.</p>
      <p>Check what the official portal currently lists, whether the item is optional, who receives the payment, what identity information is required, and what cancellation terms apply. Never treat a hotel, driver, social-media account, or this website as proof that a temple payment is valid.</p>
      <Link href="/somnath-temple-tickets/">Read the independent ticket explainer →</Link>
    </section>

    <section className="home-section split-section reverse-split">
      <div><p className="eyebrow">Stay planning</p><h2>Hotels near Somnath temple</h2><p>“Near” can mean walking distance, a short auto ride, or simply the wider Somnath–Veraval area. Check the map pin yourself and ask the property about actual access, late check-in, parking, luggage, stairs or lifts, and cancellation terms.</p><p>Price and availability change quickly. A lead submitted here is only an enquiry—not a reservation or recommendation. Confirm the final provider, room, taxes, refund terms, and payment recipient in writing.</p><Link href="/hotels-near-somnath-temple/">Use the hotel comparison checklist →</Link></div>
      <aside className="soft-card"><h3>Before paying a hotel</h3><ul><li>Confirm the full property name and address.</li><li>Check recent reviews across more than one source.</li><li>Ask for the total price including taxes.</li><li>Read cancellation and check-in rules.</li><li>Pay only through a channel you trust.</li></ul></aside>
    </section>

    <section className="home-section prose-section">
      <p className="eyebrow">Door-to-door planning</p><h2>How to reach Somnath by train, road, and air</h2>
      <p>Compare the whole journey rather than only its longest leg. Train travellers commonly investigate Veraval, but the exact station, date, and stopping pattern must be checked with Indian Railways. Road estimates need buffers for traffic, breaks, weather, and seasonal conditions. An air itinerary still includes a substantial ground transfer whose current availability and cost should be confirmed.</p>
      <p>Arrange the final local connection before a late arrival and avoid scheduling your main visit immediately after an optimistic arrival time. Our <Link href="/how-to-reach-somnath/">transport guide</Link> helps you compare these trade-offs.</p>
      <div className="inline-cta"><Link className="button button-secondary" href="/how-to-reach-somnath/">Compare travel routes</Link><TrackedLink className="text-link" href="#travel-help" event="service_cta_click">Ask about hotel/cab help</TrackedLink></div>
    </section>

    <section className="home-section mistakes-section">
      <p className="eyebrow">A little caution goes a long way</p><h2>Common mistakes devotees should avoid</h2>
      <div className="mistake-grid">
        <div><strong>Trusting a search snippet</strong><p>Open the primary source and check its date instead of relying on a cropped result.</p></div>
        <div><strong>Paying for a guarantee</strong><p>No third party can use this website to promise darshan, queue time, or official access.</p></div>
        <div><strong>Overpacking the day</strong><p>Security, crowds, heat, meals, and transport all need breathing room.</p></div>
        <div><strong>Ignoring the final kilometre</strong><p>Plan the station, airport, bus stop, hotel, and temple-area transfers together.</p></div>
        <div><strong>Skipping cancellation terms</strong><p>Read hotel, transport, service, and payment terms before committing.</p></div>
        <div><strong>Sharing documents casually</strong><p>Send identity details only through a verified channel when genuinely required.</p></div>
      </div>
    </section>

    <section className="home-section hinglish-section">
      <p className="eyebrow">Simple Hindi / Hinglish help</p><h2>Somnath yatra ke common sawaal</h2>
      <div className="hinglish-grid">
        <div><h3>Somnath mandir darshan time</h3><p>Darshan ka current time official trust website par check karein. Weekend, festival ya special notice ke time schedule aur waiting badal sakti hai, isliye travel wale din dobara verify karein.</p></div>
        <div><h3>Somnath mandir ticket</h3><p>Har “ticket” ek jaisa nahi hota. General darshan, special service aur travel package ko mix na karein. Payment se pehle official portal par exact service aur receiver check karein.</p></div>
        <div><h3>Somnath mandir ke paas hotel</h3><p>Sirf “near temple” title par bharosa na karein. Map location, recent reviews, check-in time, total price aur cancellation policy khud compare karein.</p></div>
        <div><h3>Somnath mandir kaise jaye</h3><p>Train, road aur flight ke saath last local transfer bhi plan karein. Exact schedule official railway, bus ya airline source se confirm karein aur thoda buffer rakhein.</p></div>
      </div>
    </section>

    <section id="travel-help" className="home-section assistance-section">
      <div><p className="eyebrow">Optional travel enquiry</p><h2>Hotel or cab help placeholder</h2><p>Share what you are looking for and a future approved service workflow can respond. Submitting this form does not make a booking, reserve a room or cab, or guarantee any temple-related service.</p></div>
      <AssistanceForm siteId={site.id} />
    </section>

    <section className="home-section faq-section">
      <p className="eyebrow">Clear answers, no guarantees</p><h2>Somnath planning FAQs</h2>
      {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </section>

    <section className="home-section closing-cta">
      <p className="eyebrow">Keep your plan together</p><h2>Take the practical checklist with you</h2><p>Use the PDF as an offline planning aid, then verify changing details through the official sources before you book, pay, or travel.</p>
      <div className="cta-row"><TrackedLink className="button" href="#pdf-guides" event="pdf_cta_click">Download PDF guide</TrackedLink><Link className="button button-secondary" href="/official-links/">Check official links</Link><TrackedLink className="text-link" href="#travel-help" event="service_cta_click">Hotel/cab help</TrackedLink></div>
    </section>
  </>;
}
