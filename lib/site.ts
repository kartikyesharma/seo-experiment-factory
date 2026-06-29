import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Product, SeoPage, SiteConfig } from "./types";

const sitesDir = path.join(process.cwd(), "sites");

export function activeSiteId() {
  return process.env.NEXT_PUBLIC_SITE_ID || process.env.SITE_ID || "somnath";
}

export function getSiteConfig(id = activeSiteId()): SiteConfig {
  return JSON.parse(fs.readFileSync(path.join(sitesDir, id, "site.json"), "utf8"));
}

export function getProducts(id = activeSiteId()): Product[] {
  return JSON.parse(fs.readFileSync(path.join(sitesDir, id, "products.json"), "utf8"));
}

export function getPages(id = activeSiteId()): SeoPage[] {
  const dir = path.join(sitesDir, id, "pages");
  return fs.readdirSync(dir).filter((name) => name.endsWith(".md")).map((name) => {
    const parsed = matter(fs.readFileSync(path.join(dir, name), "utf8"));
    const data = parsed.data as Omit<SeoPage, "body">;
    return { ...data, body: parsed.content.trim() };
  });
}

export function getPage(slug: string, id = activeSiteId()) {
  return getPages(id).find((page) => page.slug === slug);
}
