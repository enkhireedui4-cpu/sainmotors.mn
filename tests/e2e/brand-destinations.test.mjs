import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const internal = ["soueast", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi"];

test("old brand addresses permanently redirect externally while nine detail pages remain available", async () => {
  for (const locale of ["mn", "en"]) {
    for (const slug of ["jetour", "chery"]) for (const suffix of ["", "/", "/index.html", "/old-model/?from=bookmark"]) {
      const response = await fetch(`${base}/${locale}/brands/${slug}${suffix}`, { redirect: "manual" });
      assert.ok([301, 308].includes(response.status), `${locale}/${slug}${suffix}: ${response.status}`);
      assert.equal(response.headers.get("location"), `https://${slug}.mn/${suffix.includes("?") ? "?from=bookmark" : ""}`);
      await response.body?.cancel();
    }
    for (const slug of internal) {
      const response = await fetch(`${base}/${locale}/brands/${slug}/`);
      assert.equal(response.status, 200);
      assert.match(await response.text(), /brand-overview/);
    }
  }
  for (const route of ["/mn/brands/jetourish/", "/en/brands/unknown/"]) {
    const response = await fetch(base + route, { redirect: "manual" });
    assert.equal(response.status, 404);
    await response.body?.cancel();
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.doesNotMatch(sitemap, /\/brands\/(?:jetour|chery)\//);
});

test("all brand entry points expose official destinations before JavaScript loads", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const locale of ["mn", "en"]) for (const path of ["", "brands/", "about/", "locations/", "brands/byd/"]) {
      await page.goto(`${base}/${locale}/${path}`);
      assert.equal(await page.locator('a[href*="/brands/jetour"], a[href*="/brands/chery"]').count(), 0, `${locale}/${path}`);
      for (const slug of ["jetour", "chery"]) {
        // The company timeline contains a JETOUR milestone, but no CHERY milestone.
        if (path === "about/" && slug === "chery") continue;
        assert.ok(await page.locator(`a[href="https://${slug}.mn/"]`).count() > 0, `${locale}/${path}: ${slug}`);
      }
    }
  } finally { await context.close(); await browser.close(); }
});
