import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3300';
const executablePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('brand search, enquiry routing, history and language form a working journey', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    page.setDefaultTimeout(5000);
    await page.goto(`${base}/en/brands/`);
    await page.getByLabel('Search brands and models', { exact: true }).fill('S08');
    assert.equal(await page.locator('.discovery-card:visible').count(), 1);
    await page.locator('.discovery-card:visible a').click();
    await page.waitForURL('**/en/brands/soueast/');
    await page.locator('[data-brand-actions] a').filter({ hasText: 'Ask about a test drive' }).click();
    await page.waitForURL('**/contact/?intent=test-drive&brand=soueast#enquiry-heading');
    await page.locator('.enquiry-journey[data-ready=true]').waitFor();
    assert.equal(await page.getByLabel('Brand of interest', { exact: true }).inputValue(), 'soueast');
    assert.equal(await page.locator('[data-enquiry-result] a[href="tel:+97672778855"]').count(), 1);
    await page.getByRole('combobox', { name: 'How can we help?', exact: true }).selectOption('service');
    assert.equal(await page.locator('[data-enquiry-result] address').count(), 0, 'shared sales showroom is not a service location');
    await page.getByLabel('Brand of interest', { exact: true }).selectOption('byd');
    assert.equal(await page.locator('[data-enquiry-result] a[href="https://maps.app.goo.gl/BkpbhfBnyKxKoxyM8"]').count(), 1);
    await page.reload();
    await page.locator('.enquiry-journey[data-ready=true]').waitFor();
    assert.equal(await page.getByLabel('Brand of interest', { exact: true }).inputValue(), 'byd');
    await page.locator('.site-header__inner > .lang-switch a').click();
    await page.waitForURL('**/mn/contact/?intent=service&brand=byd#enquiry-heading');
    await page.locator('.enquiry-journey[data-ready=true]').waitFor();
    assert.equal(await page.locator('#enquiry-brand').inputValue(), 'byd');
    await page.locator('#enquiry-brand').selectOption('jetour');
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('#enquiry-brand')?.value === 'byd');
    assert.equal(await page.locator('#enquiry-brand').inputValue(), 'byd');
  } finally { await browser.close(); }
});

test('same-route header navigation clears stale enquiry and catalogue selection', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(`${base}/en/contact/?intent=service&brand=byd`);
    await page.locator('.enquiry-journey[data-ready=true]').waitFor();
    assert.equal(await page.locator('#enquiry-brand').inputValue(), 'byd');
    await page.locator('.site-nav').getByRole('link', { name: 'Contact', exact: true }).click();
    await page.waitForURL('**/en/contact/');
    await page.waitForFunction(() => document.querySelector('#enquiry-brand')?.value === '', null, { timeout: 3000 });
    assert.equal(await page.locator('#enquiry-intent').inputValue(), 'sales');
    await page.goto(`${base}/en/brands/?q=S08`);
    await page.locator('.brand-catalogue[data-ready=true]').waitFor();
    assert.equal(await page.locator('.discovery-card:visible').count(), 1);
    await page.locator('.site-nav').getByRole('link', { name: 'Brands', exact: true }).click();
    await page.waitForURL('**/en/brands/');
    await page.waitForFunction(() => document.querySelector('#brand-search')?.value === '', null, { timeout: 3000 });
    assert.equal(await page.locator('.discovery-card:visible').count(), 11);
  } finally { await browser.close(); }
});

test('catalogue has every brand without JavaScript and empty filters recover', async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const staticPage = await browser.newPage({ javaScriptEnabled: false });
    await staticPage.goto(`${base}/mn/brands/`);
    assert.equal(await staticPage.locator('.discovery-card a').count(), 11);
    const page = await browser.newPage({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
    await page.goto(`${base}/en/brands/`);
    await page.getByLabel('Search brands and models', { exact: true }).fill('no-such-model');
    assert.equal(await page.locator('.discovery-card:visible').count(), 0);
    assert.equal(await page.getByRole('heading', { name: 'No matching brands' }).count(), 1);
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    assert.equal(await page.locator('.discovery-card:visible').count(), 11);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  } finally { await browser.close(); }
});
