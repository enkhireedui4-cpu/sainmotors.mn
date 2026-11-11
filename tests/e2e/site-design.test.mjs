import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3300';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('supporting pages give a readable photographic introduction and real onward routes in both languages', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(5000);
    for (const locale of ['mn', 'en']) for (const route of ['about', 'brands', 'services', 'locations', 'news']) {
      await page.goto(`${base}/${locale}/${route}/`);
      await page.locator('.site-banner h1').waitFor();
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('.site-banner img').count(), 1);
      assert.equal(await page.locator(`.site-banner a[href='/${locale}/']`).count(), 1);
      assert.equal(await page.locator(`.site-invitation a[href='/${locale}/locations/']`).count(), 1);
      const heading = await page.locator('.site-banner h1').boundingBox();
      assert.ok(heading.y >= 0 && heading.height > 20);
    }
  } finally { await browser.close(); }
});

test('homepage keeps its global header, brand directory and onward company routes below the video', async () => {
  const browser=await chromium.launch({executablePath,headless:true});
  try {
    const page=await browser.newPage({reducedMotion:'reduce'});
    for(const locale of ['mn','en']) for(const width of [360,720,921,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base+'/'+locale+'/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('.home-video-hero video').count(),1);
      assert.equal(await page.locator('.site-header .site-logo').getAttribute('href'),'/'+locale+'/');
      assert.equal(await page.locator('.site-header__inner > .lang-switch').isVisible(),true);
      assert.equal(await page.locator('.corporate-home a[href="/'+locale+'/about/"]').count(),1);
      assert.equal(await page.locator('.corporate-home a[href="/'+locale+'/services/"]').count(),1);
      assert.equal(await page.locator('.corporate-home a[href="/'+locale+'/news/"]').count(),1);
      assert.equal(await page.locator('.site-invitation a[href="/'+locale+'/locations/"]').count(),1);
      assert.equal(await page.locator('.home-service-list a').count(),4);
      assert.equal(await page.locator('.journey-strip').count(),0);
      assert.equal(await page.locator('.home-brands .brand-panel a').count(),11);
      assert.equal(await page.locator('.home-brands .brand-panel__description').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    }
  } finally {await browser.close();}
});
