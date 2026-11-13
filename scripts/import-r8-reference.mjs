// Optimize the locally captured manufacturer artwork without changing its geometry.
// node scripts/import-r8-reference.mjs [capture-directory]
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const capture = path.resolve(process.argv[2] ?? path.join(root, ".firecrawl/r8-reference"));
const output = path.join(root, "public/rely-r8");
const sourceAssets = JSON.parse(await fs.readFile(path.join(capture, "assets-downloaded.json"), "utf8"));
const sources = new Map(sourceAssets.map(asset => [asset.name, asset.url]));
sources.set("53-R8detailmb.jpg", "https://cherycvglobal.com/images/R8/R8detailmb.jpg");
const mapping = [
  ["hero-1", "29-banner-2x--4-.jpg", 2560],
  ["hero-1-mobile", "30-bannermb.jpg", 1125],
  ["hero-2", "31-banner-2x--5-.jpg", 2560],
  ["hero-2-mobile", "32-banner-2x--5-mb.jpg", 1125],
  ["mission-bg", "42-content1bg.png", 2560],
  ["mission-bg-mobile", "46-content1bgmb.png", 1125],
  ["mission-mark", "37-content1icon.png", 662],
  ["mission-mark-mobile", "38-content1iconmb.png", 618],
  ["terrain-1", "00-B1.jpg", 1920],
  ["terrain-2", "01-B2.jpg", 1920],
  ["terrain-3", "02-B3.jpg", 1920],
  ["terrain-4", "03-B4.jpg", 1920],
  ["terrain-1-mobile", "04-con2mb1.jpg", 1044],
  ["terrain-2-mobile", "05-con2mb2.jpg", 1044],
  ["terrain-3-mobile", "06-con2mb3.jpg", 1044],
  ["terrain-4-mobile", "07-con2mb4.jpg", 1044],
  ["terrain-mark", "08-c2logo.png", 472],
  ["feature-tough", "09-TOUGH.png", 960],
  ["feature-tough-mobile", "10-TOUGHmb.png", 1125],
  ["feature-strong", "11-STRONG.png", 960],
  ["feature-strong-mobile", "12-STRONGmb.png", 1125],
  ["feature-reliable", "13-RELIABLE.png", 960],
  ["feature-reliable-mobile", "14-RELIABLEmb.png", 1125],
  ["feature-intelligent", "15-INTELLIGENT.jpg", 960],
  ["feature-intelligent-mobile", "16-INTELLIGENTmb.png", 1125],
  ...Array.from({ length: 11 }, (_, index) => [`detail-${index + 1}`, `${String(index + 17).padStart(2, "0")}-s${index + 1}.png`, 1920]),
  ["accessories-bg", "44-c4bg.png", 2560],
  ["accessories-bg-mobile", "48-c4bgmb.png", 1125],
  ["powertrain-bg", "43-c5bg.png", 2560],
  ["powertrain-bg-mobile", "47-c5bgmb.png", 1125],
  ["lead-vehicle", "28-R8.png", 692],
  ["lead-bg", "50-bg.jpg", 1000],
  ["lead-bg-mobile", "51-bgmb.jpg", 957],
  ["specifications", "53-R8detailmb.jpg", 1920],
];
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
await fs.mkdir(output, { recursive: true });
const manifest = [];
for (const [name, filename, width] of mapping) {
  const bytes = await fs.readFile(path.join(capture, "assets", filename));
  const original = await sharp(bytes).metadata();
  const result = await sharp(bytes).rotate().resize({ width, withoutEnlargement: true })
    .webp({ quality: 89, alphaQuality: 100, effort: 5 }).toBuffer({ resolveWithObject: true });
  const url = `/rely-r8/${name}.webp`;
  await fs.writeFile(path.join(output, `${name}.webp`), result.data);
  manifest.push({
    name, source: sources.get(filename), sourceSha256: digest(bytes),
    original: { width: original.width, height: original.height, bytes: bytes.length },
    output: { url, width: result.info.width, height: result.info.height, bytes: result.data.length, sha256: digest(result.data) },
  });
}
const countries = JSON.parse(await fs.readFile(path.join(capture, "assets/52-country.json"), "utf8")).map(country => country.e);
if (countries.length !== 192 || !countries.includes("Mongolia")) throw new Error("Unexpected source country list");
await fs.writeFile(path.join(root, "src/content/r8-countries.json"), JSON.stringify(countries, null, 2) + "\n");
await fs.writeFile(path.join(root, "docs/rely-r8-assets.json"), JSON.stringify({
  source: "https://cherycvglobal.com/R8", captured: "2026-11-13", assets: manifest,
}, null, 2) + "\n");
console.log(`R8: ${manifest.length} images, ${(manifest.reduce((sum, item) => sum + item.output.bytes, 0) / 1048576).toFixed(2)} MiB, ${countries.length} countries`);
