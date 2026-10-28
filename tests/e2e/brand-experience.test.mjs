import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("brand photograph contracts from viewport width to the content column as the visitor scrolls and expands on return", async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: "no-preference" });
  try {
    await page.goto(`${base}/en/brands/byd/`, { waitUntil: "networkidle" });
    const image = page.locator(".brand-hero__image");
    const initial = await image.boundingBox();
    assert.ok(initial.width >= 1918, "The initial photograph should fill the viewport");
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
    await page.waitForFunction(() => document.querySelector(".brand-hero__image").getBoundingClientRect().width < 1400);
    const contracted = await image.boundingBox();
    assert.ok(contracted.width >= 1250 && contracted.width <= 1314);
    assert.ok(Math.abs(contracted.x - (1920 - contracted.width) / 2) < 2);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(() => document.querySelector(".brand-hero__image").getBoundingClientRect().width >= 1918);
  } finally { await page.close(); }
});

test("the moving photograph never paints over the overview at initial or intermediate scroll positions", async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1440 }, reducedMotion: "no-preference" });
  try {
    await page.goto(`${base}/en/brands/byd/`, { waitUntil: "networkidle" });
    for (const y of [0, 100, 250, 450, 700]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(50);
      const image = await page.locator(".brand-hero__image").boundingBox();
      const overview = await page.locator(".brand-overview__grid").boundingBox();
      assert.ok(overview.y >= image.y + image.height, `Overview overlaps the image at scroll ${y}`);
    }
  } finally { await page.close(); }
});

test("phone hero uses a tall image that contracts on scroll and a full-column logo panel", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  try {
    await page.goto(`${base}/mn/brands/byd/`, { waitUntil: "networkidle" });
    const initial = await page.locator(".brand-hero__image").boundingBox();
    assert.ok(initial.width >= 389 && initial.height >= 480);
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: "instant" }));
    await page.waitForFunction(() => document.querySelector(".brand-hero__image").getBoundingClientRect().width <= 352);
    const logo = await page.locator(".brand-hero__identity").boundingBox();
    assert.ok(logo.width >= 348 && logo.height >= 205 && logo.height <= 240);
  } finally { await page.close(); }
});

test("fresh section fragment links remain visible after the hero finishes sizing", async () => {
  for (const width of [1920, 390]) for (const id of ["brand-overview", "brand-models", "brand-showroom"]) {
    const page = await browser.newPage({ viewport: { width, height: 1440 }, reducedMotion: "no-preference" });
    try {
      await page.goto(`${base}/en/brands/byd/#${id}`, { waitUntil: "networkidle" });
      const position = await page.locator(`#${id}`).evaluate(section => {
        const header = document.querySelector(".site-header").getBoundingClientRect();
        const nav = document.querySelector(".brand-section-nav").getBoundingClientRect();
        return { top: section.getBoundingClientRect().top, bars: nav.top <= header.bottom + 1 ? nav.bottom : header.bottom };
      });
      assert.ok(position.top >= position.bars - 2, `${width} #${id}: ${JSON.stringify(position)}`);
      assert.ok(position.top < 650);
    } finally { await page.close(); }
  }
});

test("brand section navigation reaches the showroom below both sticky bars using the keyboard", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  try {
    await page.goto(`${base}/en/brands/byd/`);
    const nav = page.getByRole("navigation", { name: "Brand page sections", exact: true });
    assert.equal(await nav.count(), 1);
    const showroom = nav.getByRole("link", { name: "Showroom", exact: true });
    await showroom.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/#brand-showroom");
    await page.waitForFunction(() => document.querySelector('a[href="#brand-showroom"][aria-current="location"]'));
    const position = await page.locator("#brand-showroom").evaluate(section => ({
      top: section.getBoundingClientRect().top,
      bars: document.querySelector(".site-header").getBoundingClientRect().height + document.querySelector(".brand-section-nav").getBoundingClientRect().height,
    }));
    assert.ok(position.top >= position.bars - 2, `Section hidden by sticky bars: ${JSON.stringify(position)}`);
    assert.ok(position.top < 600, "Section should be visible after following the anchor");
    assert.ok(await page.locator("#brand-showroom a[href^='tel:+976']").count() > 0);
    assert.equal(await page.locator(".brand-title h1").evaluate(el => getComputedStyle(el).animationName), "none");
  } finally { await page.close(); }
});

test("brand section links have real server-rendered destinations without JavaScript, including brands without model records", async () => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  try {
    const page = await context.newPage();
    for (const [locale, brand, expected] of [["mn", "byd", 3], ["en", "jetour", 2], ["en", "soueast", 3]]) {
      await page.goto(`${base}/${locale}/brands/${brand}/`);
      const links = page.locator(".brand-section-nav__links a");
      assert.equal(await links.count(), expected, `${locale}/${brand}`);
      for (const href of await links.evaluateAll(nodes => nodes.map(n => n.getAttribute("href")))) {
        assert.equal(await page.locator(href).count(), 1, `${brand}: missing ${href}`);
      }
      await links.first().click();
      assert.equal(new URL(page.url()).hash, "#brand-overview");
      assert.ok(await page.locator("main a[href*='google.com/maps'], main a[href^='https://maps.app.goo.gl/']").count() > 0);
    }
  } finally { await context.close(); }
});
