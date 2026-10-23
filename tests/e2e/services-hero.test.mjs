import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("services photograph fills the viewport, contracts on scroll and keeps the service content below it", async () => {
  for (const locale of ["mn", "en"]) for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, reducedMotion: "no-preference" });
    try {
      await page.goto(`${base}/${locale}/services/`, { waitUntil: "networkidle" });
      const image = page.locator(".services-header");
      assert.ok((await image.boundingBox()).width >= width - 2, `${locale}/${width}: full initial image`);
      await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
      await page.waitForFunction(width => document.querySelector(".services-header").getBoundingClientRect().width <= (width === 1920 ? 1314 : 352), width);
      const contracted = await image.boundingBox();
      assert.ok(Math.abs(contracted.x - (width - contracted.width) / 2) < 2);
      const services = await page.locator(".services-section").boundingBox();
      assert.ok(services.y >= contracted.y + contracted.height - 1);
      assert.ok(await page.locator(".services-page a[href^='tel:+976']").count() > 0);
    } finally { await page.close(); }
  }
});
