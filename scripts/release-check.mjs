import fs from "node:fs";
import path from "node:path";
import { collectContentReview, contentRegistry } from "../src/content/registry.ts";
import { evaluateRelease } from "../src/lib/release-policy.ts";

const root = path.resolve(import.meta.dirname, "..");
const media = JSON.parse(fs.readFileSync(path.join(root, "src/content/generated/media.json"), "utf8"));
const records = collectContentReview();
const problems = evaluateRelease(records, contentRegistry.brands, (slug) => Boolean(media.logos[slug] ?? media.logosOnDark[slug]));
const counts = records.reduce((total, item) => ({ ...total, [item.status]: (total[item.status] ?? 0) + 1 }), {});
console.log(`Content review: ${records.length} records ${JSON.stringify(counts)}`);
if (problems.length) {
  console.error(`Release blocked: ${problems.length} outstanding item(s).`);
  console.error(problems.map((problem) => `  - ${problem}`).join("\n"));
  process.exitCode = 1;
} else console.log("Release content and supplied logo checks passed.");
