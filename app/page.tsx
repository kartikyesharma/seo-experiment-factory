import Link from "next/link";
import { getPages, getSiteConfig } from "@/lib/site";

export default function Home() {
  const site = getSiteConfig();
  const pages = getPages();
  return <>
    <section className="hero"><p className="eyebrow">Plan with confidence</p><h1>{site.name}</h1><p>{site.description}</p></section>
    <section><h2>Independent practical guides</h2><div className="card-grid">{pages.map((page) => <Link className="guide-card" href={`/${page.slug}/`} key={page.slug}><h3>{page.title}</h3><p>{page.description}</p><span>Read guide →</span></Link>)}</div></section>
  </>;
}
