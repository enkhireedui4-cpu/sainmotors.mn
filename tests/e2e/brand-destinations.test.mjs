import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const unfinished = ["soueast", "riddara", "aito", "212", "bestune", "maxus", "hongqi"];

test("the brand directory links only to the two model pages and two official websites", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const [locale, homeLabel] of [["mn", "Бүх брэнд харах"], ["en", "View all brands"]]) {
      await page.goto(`${base}/${locale}/`);
      assert.equal(await page.getByRole("link", { name: homeLabel, exact: true }).getAttribute("href", { timeout: 3000 }), `/${locale}/brands/`);
      await page.goto(`${base}/${locale}/brands/`);
      const links = await page.locator("[data-brand-directory] a[href]").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
      assert.deepEqual(links.sort(), [
        "https://jetour.mn/", "https://chery.mn/", `/${locale}/brands/rely/`, `/${locale}/brands/byd/`,
      ].sort());
    }
  } finally { await context.close(); await browser.close(); }
});

test("all eleven logo-led brand introductions fit a 320 px phone", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 760 } });
    for (const locale of ["mn", "en"]) {
      await page.goto(`${base}/${locale}/brands/?q=obsolete&category=pickup`);
      const section = page.locator(".brand-directory__content");
      assert.equal(await section.locator("input, fieldset, [role='status']").count(), 0, locale);
      const catalogue = section.locator("[data-brand-directory]");
      const cards = await catalogue.locator("li").all();
      assert.equal(cards.length, 11, locale);
      for (const card of cards) {
        assert.equal(await card.locator("img").count(), 1);
        assert.equal(await card.isVisible(), true);
        assert.equal(await card.getByRole("heading", { level: 2 }).isVisible(), true);
        assert.ok((await card.locator("p").innerText()).length > 60);
      }
      const details = locale === "mn" ? "Дэлгэрэнгүй үзэх" : "View details";
      assert.deepEqual(await catalogue.locator('a[href^="/"] .discovery-card__action').allTextContents(), [details, details]);
      assert.equal(await catalogue.locator("li:not(:has(a, button))").count(), 7, locale);
      const marks = await catalogue.locator(".wordmark-crop").evaluateAll(nodes => nodes.map(node => ({
        height: node.getBoundingClientRect().height,
        cropped: parseFloat(getComputedStyle(node.querySelector("img")).left) < 0,
        brand: node.closest("li").querySelector("h2").textContent,
      })));
      assert.equal(marks.length, 11);
      assert.ok(marks.every(mark => mark.height > 0 && Math.abs(mark.height - marks[0].height) < 1), locale);
      assert.deepEqual(marks.filter(mark => mark.cropped).map(mark => mark.brand).sort(), ["FAW BESTUNE", "FAW HONGQI", "MAXUS"]);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320, locale);
    }
  } finally { await browser.close(); }
});

test("old external brand addresses redirect while unfinished brand pages remain unavailable", async () => {
  for (const locale of ["mn", "en"]) {
    for (const slug of ["jetour", "chery"]) for (const suffix of ["", "/", "/index.html", "/old-model/?from=bookmark"]) {
      const response = await fetch(`${base}/${locale}/brands/${slug}${suffix}`, { redirect: "manual" });
      assert.ok([301, 308].includes(response.status), `${locale}/${slug}${suffix}: ${response.status}`);
      assert.equal(response.headers.get("location"), `https://${slug}.mn/${suffix.includes("?") ? "?from=bookmark" : ""}`);
      await response.body?.cancel();
    }
    for (const slug of unfinished) {
      const response = await fetch(`${base}/${locale}/brands/${slug}/`);
      assert.equal(response.status, 404);
      await response.body?.cancel();
    }
    const rely = await fetch(`${base}/${locale}/brands/rely/`);
    assert.equal(rely.status, 200);
    assert.match(await rely.text(), /RELY R8/);
    const byd = await fetch(`${base}/${locale}/brands/byd/`);
    assert.equal(byd.status, 200);
    assert.match(await byd.text(), /SEALION 6/);
  }
  for (const route of ["/mn/brands/jetourish/", "/en/brands/unknown/"]) {
    const response = await fetch(base + route, { redirect: "manual" });
    assert.equal(response.status, 404);
    await response.body?.cancel();
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.doesNotMatch(sitemap, /\/brands\/(?:jetour|chery|soueast|riddara|aito|212|bestune|maxus|hongqi)\//);
  assert.match(sitemap, /\/mn\/brands\/byd\//);
  assert.match(sitemap, /\/en\/brands\/byd\//);
});

test("all brand entry points expose official destinations before JavaScript loads", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const locale of ["mn", "en"]) for (const path of ["", "brands/", "about/", "locations/", "brands/rely/"]) {
      await page.goto(`${base}/${locale}/${path}`);
      assert.equal(await page.locator('a[href*="/brands/jetour"], a[href*="/brands/chery"]').count(), 0, `${locale}/${path}`);
      for (const slug of unfinished) assert.equal(await page.locator(`a[href*="/brands/${slug}/"]`).count(), 0, `${locale}/${path}: ${slug}`);
      for (const slug of ["jetour", "chery"]) {
        // The company timeline contains a JETOUR milestone, but no CHERY milestone.
        if (path === "about/" && slug === "chery") continue;
        assert.ok(await page.locator(`a[href="https://${slug}.mn/"]`).count() > 0, `${locale}/${path}: ${slug}`);
      }
    }
  } finally { await context.close(); await browser.close(); }
});
