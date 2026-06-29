import fs from "node:fs";
import path from "node:path";
import { args, csvRows, toCsv } from "./lib/cli.mjs";

const cli = args();
if (!cli.input) {
  console.error("Usage: npm run keywords:import -- --input <planner.csv> [--site somnath] [--output dir]");
  process.exit(1);
}

const aliases = {
  keyword: ["keyword", "search term"],
  volume: ["avg. monthly searches", "average monthly searches", "search volume"],
  competition: ["competition", "competition (indexed value)"],
  bidLow: ["top of page bid (low range)", "top of page bid low range"],
  bidHigh: ["top of page bid (high range)", "top of page bid high range"]
};
const rows = csvRows(fs.readFileSync(cli.input, "utf8"));
const headers = rows.shift().map((h) => h.trim().toLowerCase());
const index = Object.fromEntries(Object.entries(aliases).map(([key, names]) => [key, headers.findIndex((h) => names.includes(h))]));
if (index.keyword < 0 || index.volume < 0) throw new Error("CSV needs Keyword and Avg. monthly searches columns");

const number = (value = "0") => Number(String(value).replace(/[₹,$,<>]/g, "").replace(/\s/g, "")) || 0;
const competition = (value = "") => ({ low: .2, medium: .55, high: .9 }[value.toLowerCase()] ?? Math.min(1, number(value) / 100));
const intentWords = /timing|time|how|itinerary|guide|cost|price|book|near|reach|best|plan/i;
const parsed = rows.map((row) => ({
  keyword: row[index.keyword]?.trim().toLowerCase(),
  volume: number(row[index.volume]),
  competition: competition(row[index.competition]),
  bidLow: number(row[index.bidLow]),
  bidHigh: number(row[index.bidHigh])
})).filter((item) => item.keyword && item.volume > 0);

const maxVolume = Math.max(...parsed.map((item) => item.volume), 1);
const maxBid = Math.max(...parsed.map((item) => item.bidHigh), 1);
const stop = new Set(["a", "an", "the", "to", "in", "of", "for", "and", "by"]);
const tokens = (keyword) => new Set(keyword.split(/\W+/).filter((word) => word.length > 1 && !stop.has(word)).map((word) => word.replace(/(ing|es|s)$/, "")));
const overlap = (a, b) => {
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / Math.max(1, new Set([...a, ...b]).size);
};

const scored = parsed.map((item) => ({
  ...item,
  score: Math.round(100 * (
    .45 * (Math.log10(item.volume + 1) / Math.log10(maxVolume + 1)) +
    .2 * (1 - item.competition) +
    .2 * (item.bidHigh / maxBid) +
    .15 * (intentWords.test(item.keyword) ? 1 : .25)
  )) / 100
})).sort((a, b) => b.score - a.score);

const clusters = [];
for (const item of scored) {
  const itemTokens = tokens(item.keyword);
  const match = clusters.find((cluster) => overlap(itemTokens, cluster.tokens) >= .24);
  if (match) {
    match.keywords.push(item);
    match.tokens = new Set([...match.tokens, ...itemTokens]);
  } else clusters.push({ id: `cluster-${clusters.length + 1}`, tokens: itemTokens, keywords: [item] });
}

const output = path.resolve(cli.output || `sites/${cli.site || "generated"}/generated`);
fs.mkdirSync(output, { recursive: true });
const result = clusters.map((cluster) => ({
  id: cluster.id,
  primaryKeyword: cluster.keywords[0].keyword,
  slug: cluster.keywords[0].keyword.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  opportunityScore: cluster.keywords[0].score,
  keywords: cluster.keywords.map(({ keyword, volume, competition, bidLow, bidHigh, score }) => ({ keyword, volume, competition, bidLow, bidHigh, score }))
}));
fs.writeFileSync(path.join(output, "clusters.json"), JSON.stringify(result, null, 2) + "\n");
fs.writeFileSync(path.join(output, "scored-keywords.csv"), toCsv([["keyword", "volume", "competition", "bid_low", "bid_high", "score", "cluster"], ...result.flatMap((cluster) => cluster.keywords.map((k) => [k.keyword, k.volume, k.competition, k.bidLow, k.bidHigh, k.score, cluster.id]))]));
console.log(`Wrote ${scored.length} keywords in ${result.length} clusters to ${output}`);
