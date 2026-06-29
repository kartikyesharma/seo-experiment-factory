import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { args } from "./lib/cli.mjs";

const siteId = args().site || process.env.SITE_ID || process.env.NEXT_PUBLIC_SITE_ID || "somnath";
const root = process.cwd();
const products = JSON.parse(fs.readFileSync(path.join(root, "sites", siteId, "products.json"), "utf8"));
const outputDir = path.join(root, "public", "products");
fs.mkdirSync(outputDir, { recursive: true });

const clean = (line) => line
  .replace(/^>\s?/, "")
  .replace(/^#{1,6}\s+/, "")
  .replace(/^[-*]\s+/, "• ")
  .replace(/^\d+\.\s+/, "• ")
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
  .replace(/[–—]/g, "-")
  .replace(/[“”]/g, '"')
  .replace(/[’]/g, "'");

function wrap(text, font, size, width) {
  const words = text.split(/\s+/); const lines = []; let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) current = candidate;
    else { if (current) lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines;
}

for (const product of products) {
  const source = path.join(root, "sites", siteId, product.sourceMarkdown);
  const parsed = matter(fs.readFileSync(source, "utf8"));
  const pdf = await PDFDocument.create();
  pdf.setTitle(parsed.data.title || product.title);
  pdf.setAuthor("Independent informational guide");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page, y, pageNumber = 0;
  const newPage = () => {
    page = pdf.addPage([595.28, 841.89]); y = 785; pageNumber += 1;
    page.drawText("INDEPENDENT INFORMATIONAL GUIDE - NOT AN OFFICIAL PUBLICATION", { x: 46, y: 812, size: 8, font: bold, color: rgb(.55, .22, .09) });
    page.drawText(`Page ${pageNumber}`, { x: 505, y: 24, size: 8, font: regular, color: rgb(.4, .4, .4) });
  };
  newPage();
  const markdownLines = [`# ${parsed.data.title || product.title}`, parsed.data.subtitle || "", parsed.data.version || "", ...parsed.content.split("\n")];
  for (const raw of markdownLines) {
    if (!raw.trim()) { y -= 7; continue; }
    const heading = raw.match(/^(#{1,3})\s/);
    const size = heading?.[1].length === 1 ? 21 : heading ? 14 : 10.5;
    const font = heading || raw.startsWith("> **Independent") ? bold : regular;
    const gap = heading ? 8 : 4;
    for (const line of wrap(clean(raw), font, size, 500)) {
      if (y < 55) newPage();
      page.drawText(line, { x: 47, y, size, font, color: rgb(.12, .12, .11) }); y -= size * 1.42;
    }
    y -= gap;
  }
  const file = path.join(outputDir, `${product.id}.pdf`);
  fs.writeFileSync(file, await pdf.save());
  console.log(`Generated ${path.relative(root, file)}`);
}
