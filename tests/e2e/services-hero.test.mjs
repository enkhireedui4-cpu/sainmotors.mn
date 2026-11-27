import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("services shows a workshop introduction without chips and keeps its enquiry and location routes", async () => {
  for (const locale of ["mn", "en"]) for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    try {
      await page.goto(`${base}/${locale}/services/`, { waitUntil: "networkidle" });
      const banner = page.locator(".page-band");
      assert.equal(await banner.locator('a[href^="#service-"]').count(), 0, `${locale}/${width}: no service chips in the banner`);
      assert.ok((await banner.boundingBox()).width >= width - 2, `${locale}/${width}: full banner`);
      const title = await banner.locator("h1").boundingBox();
      assert.ok(title.height > 20 && title.y >= 0);
      assert.ok(await banner.locator("img").evaluate(img => img.complete && img.naturalWidth > 0 && img.alt.length > 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${width}: no horizontal scroll`);
      assert.deepEqual(await page.locator(".service-list > li").evaluateAll(items => items.map(item => item.id)),
        ["service-sales", "service-financing", "service-after-sales", "service-repair"]);
      assert.equal(await page.locator(`#service-sales a[href="/${locale}/brochures/"]`).count(), 1);
      assert.equal(await page.locator(`#service-financing a[href="/${locale}/contact/?intent=finance&brand=jetour#enquiry-heading"]`).count(), 1);
      assert.equal(await page.locator(`#service-repair a[href="/${locale}/locations/#service-centre"]`).count(), 1);

      await page.goto(`${base}/${locale}/services/#service-repair`);
      await page.waitForFunction(selector => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return rect.top >= header.bottom && rect.top < innerHeight;
      }, "#service-repair");
      assert.equal(await page.locator("#service-repair h2").count(), 1);
      assert.ok(await page.locator(".services-page a[href^='tel:+976']").count() > 0);
      assert.equal(await page.locator(".location-list--centres .location").count(), 2);
      assert.equal(await page.locator('.location-list--centres .location').evaluateAll(cards => cards.some(card => {
        const rects = [...card.children].map(child => child.getBoundingClientRect());
        return rects.some((a, i) => rects.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1));
      })), false, 'centre information must not overlap at either width');
    } finally { await page.close(); }
  }
});
