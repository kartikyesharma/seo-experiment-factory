import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { args } from "./lib/cli.mjs";

const cli = args();
const site = cli.site || process.env.SITE_ID || "somnath";
const gates = ["domain", "pdf", "launch"];
const missing = gates.filter((gate) => !fs.existsSync(`approvals/${site}/${gate}.approved`));
if (missing.length) {
  console.error(`Deployment blocked. Manual approvals missing: ${missing.join(", ")}\nCreate approvals/${site}/<gate>.approved only after a human records approval.`);
  process.exit(2);
}
const config = JSON.parse(fs.readFileSync(`sites/${site}/site.json`, "utf8"));
const products = JSON.parse(fs.readFileSync(`sites/${site}/products.json`, "utf8"));
if (config.domain.includes("example.com") || products.some((p) => /REPLACE_|example\.com/.test(p.paymentLink))) {
  console.error("Deployment blocked: replace the example domain and payment link after their respective approvals.");
  process.exit(2);
}
const run = (command, argv, env = process.env) => {
  const result = spawnSync(command, argv, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run("npm", ["run", "site:validate", "--", "--site", site]);
run("npm", ["run", "pdf:build", "--", "--site", site]);
if (cli["dry-run"]) { console.log("Dry run passed; production deployment was not started."); process.exit(0); }
run("npx", ["vercel", "--prod", "--yes", "--token", process.env.VERCEL_TOKEN || ""], { ...process.env, NEXT_PUBLIC_SITE_ID: site });
