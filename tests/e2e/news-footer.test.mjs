import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3200';

test('news categories filter real stories and the footer works across languages and sizes', async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    for (const locale of ['en','mn']) for (const width of [320,390,768,900,1024,1440,1920]) {
      await page.setViewportSize({width,height:960});
      await page.goto(`${base}/${locale}/news/`,{waitUntil:'networkidle'});
      assert.equal(await page.locator('.news-directory__filters button').count(),4);
      assert.equal(await page.locator('.news-list article:visible').count(),3);
      await page.locator('[data-news-category="media"]').click();
      assert.equal(await page.locator('.news-list article:visible').count(),0);
      assert.equal(await page.locator('.news-directory__empty').isVisible(),true);
      await page.locator('[data-news-category="news"]').click();
      assert.equal(await page.locator('.news-list article:visible').count(),3);
      assert.equal(await page.locator('.orbis-footer nav a').count(),3);
      assert.equal(await page.locator(`.orbis-footer a[href="/${locale}/brands/"]`).count(),0);
      const dealerLink=page.locator(`.orbis-footer nav a[href="/${locale}/locations/"]`);
      assert.equal(await dealerLink.textContent(),locale==='en'?'Dealer network':'Дилерийн сүлжээ');
      assert.equal(await page.locator('.orbis-footer').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 0, 0)');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('.orbis-footer__top').click();
      await page.waitForFunction(()=>scrollY<5);
      await dealerLink.click();
      await page.waitForURL(`**/${locale}/locations/`);
    }
  } finally {await browser.close();}
});
