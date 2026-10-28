import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3300';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('contact overview keeps real address, phone and email together beside local photography', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(5000);
    for (const locale of ['mn', 'en']) {
      await page.goto(`${base}/${locale}/contact/`);
      await page.locator('[data-contact-overview]').waitFor();
      assert.equal(await page.locator('[data-contact-overview] a[href="tel:+97670108855"]').count(), 1);
      assert.equal(await page.locator('[data-contact-overview] a[href="mailto:marketing2@esain.mn"]').count(), 1);
      assert.equal(await page.locator('[data-contact-overview] a[href="https://maps.app.goo.gl/qh4YXME6ZKwLokRQ8"]').count(), 1);
      assert.match(await page.locator('.contact-card--address').innerText(), /JETOUR.*SOUEAST/);
      const picture = await page.locator('.contact-overview__photo').boundingBox();
      const cards = await page.locator('.contact-overview__cards').boundingBox();
      assert.ok(picture.x + picture.width <= cards.x + 1, 'photograph and contact cards sit side by side');
      assert.equal(await page.locator('h1').count(), 1);
    }
  } finally { await browser.close(); }
});

test('contact cards remain readable and keyboard reachable on mobile and at a 200% desktop viewport equivalent', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    for (const width of [360, 390, 720]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/mn/contact/`);
      assert.equal(await page.locator('.contact-card').count(), 3);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      for (const link of await page.locator('.contact-card').all()) {
        await link.focus();
        assert.equal(await link.evaluate(element => element === document.activeElement), true);
        const box = await link.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
      }
    }
  } finally { await browser.close(); }
});

test('contact request disclosures open from the keyboard and use the real general email', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`${base}/en/contact/`);
    const summary = page.locator('.contact-accordions summary').filter({ hasText: 'Careers' });
    await summary.focus();
    await page.keyboard.press('Enter');
    const details = summary.locator('..');
    assert.equal(await details.evaluate(element => element.open), true);
    assert.equal(await details.locator('a[href="mailto:marketing2@esain.mn?subject=%5BSain%20Motors%5D%20Careers"]').count(), 1);
    await page.keyboard.press('Enter');
    assert.equal(await details.evaluate(element => element.open), false);
  } finally { await browser.close(); }
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
