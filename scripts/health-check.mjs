// Read-only post-upload HTTP smoke check. Explicit origin required; never disables TLS validation.
const args = process.argv.slice(2);
const origin = args.find((arg) => !arg.startsWith("--"));
const release = args.includes("--release");
if (!origin) { console.error("Usage: npm run health:check -- https://staging.example.mn [--release]"); process.exit(1); }
const base = new URL(origin);
if (!["http:", "https:"].includes(base.protocol) || base.pathname !== "/" || base.search || base.hash || base.username || base.password) throw new Error("Provide an HTTP(S) origin without path, credentials, query or fragment");
if (release && base.origin !== "https://sainmotors.mn") throw new Error("Release health checks require https://sainmotors.mn");
const errors = [];
const get = async (route, options = {}) => {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(10000), headers: { "Accept-Encoding": "gzip" }, ...options });
  return { response, text: await response.text() };
};
try {
  let asset;
  for (const locale of ["mn", "en"]) {
    const { response, text } = await get(`/${locale}/`);
    if (response.status !== 200) errors.push(`${locale}: HTTP ${response.status}`);
    if (!text.includes(`<html lang="${locale}"`)) errors.push(`${locale}: HTML lang missing`);
    if ((text.match(/<h1(?:\s|>)/g) ?? []).length !== 1) errors.push(`${locale}: expected one h1`);
    const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(text) || /noindex/i.test(response.headers.get("x-robots-tag") ?? "");
    if (release ? noindex : !noindex) errors.push(`${locale}: indexing does not match ${release ? "release" : "preview"}`);
    if (!text.includes(`https://sainmotors.mn/${locale}/`) && release) errors.push(`${locale}: production canonical missing`);
    if (!response.headers.get("content-type")?.includes("text/html")) errors.push(`${locale}: HTML MIME missing`);
    asset ??= text.match(/\bsrc="(\/media\/[^"?]+)/)?.[1];
  }
  const robots = await get("/robots.txt");
  if (robots.response.status !== 200 || (release ? /Disallow:\s*\//i.test(robots.text) : !/Disallow:\s*\//i.test(robots.text))) errors.push("robots.txt: wrong status/indexing policy");
  const sitemap = await get("/sitemap.xml");
  if (sitemap.response.status !== 200 || !sitemap.text.includes("<urlset")) errors.push("sitemap.xml missing/invalid");
  const missing = await get("/__sain_health_missing_404__/");
  if (missing.response.status !== 404) errors.push(`Missing route: HTTP ${missing.response.status}, expected 404`);
  if (asset) {
    const response = await fetch(new URL(asset, base), { signal: AbortSignal.timeout(10000) });
    if (response.status !== 200 || !response.headers.get("content-type")?.startsWith("image/")) errors.push(`Image unavailable: ${asset}`);
    await response.body?.cancel();
  }
  if (release) {
    for (const source of ["http://sainmotors.mn/en/", "http://www.sainmotors.mn/en/", "https://www.sainmotors.mn/en/"]) {
      const response = await fetch(source, { redirect: "manual", signal: AbortSignal.timeout(10000) });
      if (![301, 308].includes(response.status) || response.headers.get("location") !== "https://sainmotors.mn/en/") errors.push(`Canonical redirect failed: ${source}`);
      await response.body?.cancel();
    }
  }
} catch (error) { errors.push(error.message); }
if (errors.length) { console.error(`Health check failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`); process.exitCode = 1; }
else console.log(`Health check passed: ${base.origin} (${release ? "release" : "preview"}); bilingual HTML, indexing, sitemap, assets and real 404 verified.`);
