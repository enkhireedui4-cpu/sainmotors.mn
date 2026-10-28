import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.env.BASE_URL ?? 'http://localhost:3300';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('corporate home gives two direct journeys and all eleven brands without an autoplay carousel', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(`${base}/en/`);
    assert.equal(await page.locator('.corporate-hero a[href="/en/brands/"]').count(), 1);
    assert.equal(await page.locator('.corporate-hero a[href="/en/locations/"]').count(), 1);
    const links = await page.locator('[data-brand-directory] a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    assert.deepEqual(links.sort(), ['212','aito','bestune','byd','chery','hongqi','jetour','maxus','rely','riddara','soueast'].map(s => `/en/brands/${s}/`).sort());
    assert.equal(await page.locator('video[autoplay], [aria-roledescription="carousel"]').count(), 0);
    assert.equal(await page.locator('.home-brands .brand-panel__description, .home-brands__note').count(), 0);
    assert.equal(await page.locator('h1').count(), 1);
    const style = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    assert.equal(style, 'rgb(255, 255, 255)');
    assert.ok(await page.locator('body').evaluate(el => el.scrollHeight < 6500));
    await page.locator('.brand-marquee__viewport').hover();
    await page.locator('[data-brand-directory] a[href="/en/brands/byd/"]').click();
    await page.waitForURL('**/en/brands/byd/');
    assert.ok(await page.locator('main a[href^="tel:"]').count() > 0);
    assert.ok(await page.locator('main a[href*="google.com/maps"], main a[href^="https://maps.app.goo.gl/"]').count() > 0);
  } finally { await browser.close(); }
});
