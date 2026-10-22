// One review record for every status-bearing content object, including nested photos.
// Node 26 runs the same typed registry used by the release gate.
import fs from "node:fs";
import path from "node:path";
import { collectContentReview, contentRegistry } from "../src/content/registry.ts";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
if (outputIndex >= 0 && !args[outputIndex + 1]) throw new Error("--output requires a file path");
const output = outputIndex >= 0 ? path.resolve(args[outputIndex + 1]) : path.join(root, "docs/content-checklist.csv");
const records = collectContentReview();
const media = JSON.parse(fs.readFileSync(path.join(root, "src/content/generated/media.json"), "utf8"));
for (const record of records) {
  const brandIndex = /^brands\[(\d+)\]$/.exec(record.path);
  if (brandIndex) {
    const slug = contentRegistry.brands[Number(brandIndex[1])].slug;
    const normal = media.logos[slug]; const onDark = media.logosOnDark[slug];
    record.asset = normal?.src ?? onDark?.src ?? "Logo missing";
    if (!normal && onDark) record.note = "Supplied dark-background logo: render on a dark plate";
  }
}
const header = ["Section", "Path", "MN", "EN", "Image/logo", "Owner", "Approver", "Status", "Source", "Note"];
const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const rows = records.map((record) => [record.path.split(/[.\[]/)[0], record.path, record.mn, record.en, record.asset, record.owner, record.approver, record.status, record.source, record.note]);
const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, "\ufeff" + csv + "\r\n", "utf8");
const counts = records.reduce((totals, record) => ({ ...totals, [record.status]: (totals[record.status] ?? 0) + 1 }), {});
console.log(`Content checklist: ${records.length} records → ${path.relative(root, output)}`);
console.log(JSON.stringify(counts));

