import type { MetadataRoute } from "next";
import { getPages, getSiteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const legal = ["", "privacy-policy", "terms", "refund-policy", "disclaimer"];
  return [
    ...legal.map((slug) => ({ url: `${site.domain}/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: slug ? 0.3 : 1 })),
    ...getPages().map((page) => ({ url: `${site.domain}/${page.slug}`, lastModified: new Date(page.updated), changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
