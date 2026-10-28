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

test('homepage follows the supplied desktop split and an independent stacked phone composition', async () => {
  const browser=await chromium.launch({executablePath,headless:true});
  try {
    const page=await browser.newPage({reducedMotion:'reduce'});
    for(const locale of ['mn','en']) for(const width of [360,720,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base+'/'+locale+'/');
      await page.evaluate(()=>document.fonts.ready);
      const title=await page.locator('.home-arrival h1').boundingBox();
      const photo=await page.locator('.home-arrival__photograph').boundingBox();
      if(width>=1024) {
        assert.ok(title.x+title.width<=photo.x+1,'desktop title sits to the left of the photograph');
        assert.ok(photo.width>=Math.min(width*.45,700));
      } else {
        assert.ok(title.y+title.height<=photo.y,'phone copy precedes the photograph');
        assert.ok(photo.width>=width*.8);
        const frame=await page.locator('.home-arrival .hero-gallery__frame').boundingBox();
        assert.ok(Math.abs(frame.width/frame.height-4/3)<.02);
      }
      const actions=await page.locator('.home-arrival .actions a').all();
      assert.equal(actions.length,2);
      for(const action of actions)assert.ok((await action.boundingBox()).height>=48);
      if(width===360) {
        const first=await actions[0].boundingBox(),second=await actions[1].boundingBox();
        assert.ok(second.y>=first.y+first.height,'small-phone actions stack');
        const fontSize=await page.locator('.home-arrival h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
        assert.ok(fontSize>=34&&fontSize<=38);
      }
      assert.equal(await page.locator('.home-arrival a[href="/'+locale+'/brands/"]').count(),1);
      assert.equal(await page.locator('.home-arrival a[href="/'+locale+'/locations/"]').count(),1);
      assert.equal(await page.locator('.journey-strip').count(),0);
      assert.equal(await page.locator('.home-brands .brand-panel a').count(),11);
      assert.equal(await page.locator('.home-brands .brand-panel__description').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    }
  } finally {await browser.close();}
});
