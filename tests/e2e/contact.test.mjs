import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3300';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('feedback keeps real phone, email and map contacts alongside the form', async () => {
 const browser=await chromium.launch({executablePath,headless:true});
 try{const page=await browser.newPage();for(const locale of ['en','mn']){
  await page.goto(base+'/'+locale+'/contact/');
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('.feedback-contact-links a[href="tel:+97670108855"]').count(),1);
  assert.equal(await page.locator('.feedback-contact-links a[href="mailto:marketing2@esain.mn"]').count(),1);
  assert.equal(await page.locator('.feedback-contact-links a[href="https://maps.app.goo.gl/qh4YXME6ZKwLokRQ8"]').count(),1);
 }}finally{await browser.close();}
});

test('brand enquiry actions land at the relevant team on phone and desktop', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/en/brands/byd/`);
      await page.locator('[data-brand-actions] a').filter({ hasText: 'Models & pricing' }).click();
      await page.waitForURL('**/en/contact/?intent=sales&brand=byd#enquiry-heading');
      await page.locator('.enquiry-journey[data-ready=true]').waitFor();
      await page.waitForFunction(() => {
        const phone = document.querySelector('[data-enquiry-result] .enquiry-result__phone')?.getBoundingClientRect();
        const header = document.querySelector('.site-header')?.getBoundingClientRect();
        return phone && header && phone.top >= header.bottom && phone.bottom <= innerHeight;
      });
      assert.match(await page.locator('[data-enquiry-result]').innerText(), /BYD/);
    }
  } finally { await browser.close(); }
});
