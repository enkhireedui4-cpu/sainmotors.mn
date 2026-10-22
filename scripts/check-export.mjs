// Validates existing static output only. No build, network request or asset mutation.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const sourceIndex = args.indexOf("--source");
const source = path.resolve(sourceIndex >= 0 ? args[sourceIndex + 1] : "out");
const release = args.includes("--release");
const errors = [];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    const info = fs.lstatSync(target);
    if (info.isDirectory()) walk(target);
    else if (info.isFile()) files.push(target);
    else errors.push(`Unsupported file type: ${target}`);
  }
};
if (!fs.existsSync(source)) { console.error(`Export missing: ${source}`); process.exit(1); }
walk(source);
const apache = path.join(source, ".htaccess");
if (fs.existsSync(apache) && fs.readFileSync(apache).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) errors.push(".htaccess contains a UTF-8 BOM; Apache directives must be saved without BOM");
for (const required of ["mn/index.html", "en/index.html", "404.html", "robots.txt", "sitemap.xml"]) {
  if (!fs.existsSync(path.join(source, required))) errors.push(`Missing ${required}`);
}
const robotsPath = path.join(source, "robots.txt");
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : "";
if (release ? /Disallow:\s*\//i.test(robots) : !/Disallow:\s*\//i.test(robots)) errors.push(`robots.txt does not match ${release ? "release" : "preview"} indexing policy`);
for (const file of files.filter((name) => name.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(source, file).replaceAll(path.sep, "/");
  if (/^(mn|en)\//.test(relative)) {
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) errors.push(`${relative}: expected one h1`);
    const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    if (release ? noindex : !noindex) errors.push(`${relative}: wrong ${release ? "release" : "preview"} robots metadata`);
    if (release && /rel=["']canonical["'][^>]*href=["'](?!https:\/\/sainmotors\.mn\/)/i.test(html)) errors.push(`${relative}: canonical is not production`);
  }
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
    let local;
    try { local = decodeURIComponent(url); } catch { errors.push(`${relative}: invalid URL ${url}`); continue; }
    const target = local.startsWith("/") ? path.join(source, local) : path.resolve(path.dirname(file), local);
    if (target !== source && !target.startsWith(source + path.sep)) { errors.push(`${relative}: path escapes export ${url}`); continue; }
    if (![target, path.join(target, "index.html")].some((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) errors.push(`${relative}: missing local destination ${url}`);
  }
}
if (errors.length) { console.error(`Export check failed (${errors.length}):\n${errors.map((error) => `  - ${error}`).join("\n")}`); process.exitCode = 1; }
else console.log(`Export check passed: ${files.length} files, ${release ? "release" : "preview"} indexing, local links/assets and h1 checked.`);
