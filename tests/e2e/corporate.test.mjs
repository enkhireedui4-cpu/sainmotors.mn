import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

test("corporate home leads to real services and retains brand contact journeys", async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: "reduce" });
    await page.goto(base + "/en/");
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("video[autoplay], .brand-spotlight, .brand-marquee").count(), 0);
    await page.locator('.orbit-service-card[href="/en/services/#service-repair"]').click();
    await page.waitForURL("**/en/services/#service-repair");
    assert.equal(await page.locator("#service-repair").isVisible(), true);
    assert.deepEqual((await page.locator(".site-nav").getByRole("link").allInnerTexts()).map(t => t.trim()), ["About", "Dealer network", "Services", "News", "Contact"]);
    await page.locator(".site-footer").getByRole("link", {name:"Brands",exact:true}).click();
    await page.waitForURL("**/en/brands/");
    await page.locator('[data-brand-directory] a[href="/en/brands/byd/"]').click();
    await page.waitForURL("**/en/brands/byd/");
    assert.ok(await page.locator('main a[href^="tel:"]').count() > 0);
    assert.ok(await page.locator('main a[href*="google.com/maps"], main a[href^="https://maps.app.goo.gl/"]').count() > 0);
    assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
  } finally { await browser.close(); }
});
