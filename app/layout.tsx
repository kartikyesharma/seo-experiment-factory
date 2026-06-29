import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { getSiteConfig } from "@/lib/site";
import "./styles.css";

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return {
    metadataBase: new URL(site.domain),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    alternates: { canonical: "/" }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = getSiteConfig();
  return (
    <html lang={site.language}>
      <body style={{ "--accent": site.accent } as React.CSSProperties}>
        <header><Link className="brand" href="/">{site.name}</Link><span>Independent information</span></header>
        <main>{children}</main>
        <footer>
          <p>© {new Date().getFullYear()} Somnath Trip Notes. Independent informational guide; no official affiliation.</p>
          <nav><Link href="/privacy-policy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/refund-policy/">Refunds</Link><Link href="/disclaimer/">Disclaimer</Link></nav>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
