import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { csvRows } from "../scripts/lib/cli.mjs";

const root = process.cwd();

test("CSV parser handles quoted Keyword Planner values", () => {
  assert.deepEqual(csvRows('Keyword,Volume\n"somnath, gujarat",1,000\n')[1], ["somnath, gujarat", "1", "000"]);
  assert.deepEqual(csvRows('Keyword,Note\nfoo,"a ""quoted"" value"\n')[1], ["foo", 'a "quoted" value']);
});

test("Somnath pages contain required editorial fields", () => {
  const pageDir = path.join(root, "sites/somnath/pages");
  for (const file of fs.readdirSync(pageDir)) {
    const parsed = matter(fs.readFileSync(path.join(pageDir, file), "utf8"));
    for (const field of ["slug", "title", "description", "keyword", "updated", "faq"])
      assert.ok(parsed.data[field], `${file} missing ${field}`);
    assert.ok(parsed.content.trim().length > 300, `${file} has thin sample content`);
  }
});

test("every product PDF source states independence", () => {
  for (const site of ["_template", "somnath"]) {
    const products = JSON.parse(fs.readFileSync(path.join(root, "sites", site, "products.json"), "utf8"));
    for (const product of products) {
      const source = fs.readFileSync(path.join(root, "sites", site, product.sourceMarkdown), "utf8").toLowerCase();
      assert.match(source, /independent informational guide/);
    }
  }
});
