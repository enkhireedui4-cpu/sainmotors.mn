import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("services opens with a readable photo banner and its shortcuts reach the correct service below the header", async () => {
  for (const locale of ["mn", "en"]) for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, reducedMotion: "no-preference" });
    try {
      await page.goto(`${base}/${locale}/services/`, { waitUntil: "networkidle" });
      const banner = page.locator(".site-banner");
      assert.ok((await banner.boundingBox()).width >= width - 2, `${locale}/${width}: full banner`);
      const title = await banner.locator('h1').boundingBox();
      assert.ok(title.height > 20 && title.y >= 0);
      const shortcut = page.locator('.service-jump a').last();
      const target = await shortcut.getAttribute('href');
      await shortcut.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(selector => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return rect.top >= header.bottom && rect.top < innerHeight;
      }, target);
      assert.equal(await page.locator(target + ' h2').count(), 1);
      assert.ok(await page.locator(".services-page a[href^='tel:+976']").count() > 0);
      assert.equal(await page.locator('.location-list--centres .location').evaluateAll(cards => cards.some(card => {
        const rects = [...card.children].map(child => child.getBoundingClientRect());
        return rects.some((a, i) => rects.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1));
      })), false, 'centre information must not overlap at either width');
    } finally { await page.close(); }
  }
});
