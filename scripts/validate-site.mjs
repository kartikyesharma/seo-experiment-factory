import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { args } from "./lib/cli.mjs";

const siteId = args().site || process.env.SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || "somnath";
const dir = path.join(process.cwd(), "sites", siteId);
const errors = [];
const config = JSON.parse(fs.readFileSync(path.join(dir, "site.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(dir, "products.json"), "utf8"));
const requiredConfig = ["id", "name", "domain", "description", "supportEmail", "officialLinks", "legal"];
for (const key of requiredConfig) if (!config[key]) errors.push(`site.json missing ${key}`);
for (const product of products) {
  if (product.price < 99 || product.price > 499) errors.push(`${product.id}: price must be ₹99-₹499`);
  for (const key of ["paymentLink", "pdfUrl", "sourceMarkdown", "deliveryEmailTemplate"]) if (!product[key]) errors.push(`${product.id}: missing ${key}`);
  if (!fs.existsSync(path.join(dir, product.sourceMarkdown))) errors.push(`${product.id}: source markdown not found`);
  const source = fs.readFileSync(path.join(dir, product.sourceMarkdown), "utf8").toLowerCase();
  if (!source.includes("independent informational guide")) errors.push(`${product.id}: PDF source lacks independence notice`);
}
const files = fs.readdirSync(path.join(dir, "pages")).filter((f) => f.endsWith(".md"));
for (const file of files) {
  const parsed = matter(fs.readFileSync(path.join(dir, "pages", file), "utf8"));
  for (const key of ["slug", "title", "description", "keyword", "updated", "faq"]) if (!parsed.data[key]) errors.push(`${file}: missing ${key}`);
  if (!Array.isArray(parsed.data.faq) || parsed.data.faq.length < 2) errors.push(`${file}: needs at least two FAQs`);
  if (parsed.data.productId && !products.some((p) => p.id === parsed.data.productId)) errors.push(`${file}: unknown productId`);
}
if (errors.length) { console.error(errors.map((e) => `- ${e}`).join("\n")); process.exit(1); }
console.log(`Validated ${siteId}: ${files.length} pages, ${products.length} products`);
