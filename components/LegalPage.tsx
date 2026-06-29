import { getSiteConfig } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const site = getSiteConfig();
  return <article className="legal"><p className="eyebrow">Legal information</p><h1>{title}</h1><p className="updated">Last updated: 29 June 2026</p>{children}<h2>Contact</h2><p>Questions may be sent to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.</p></article>;
}
