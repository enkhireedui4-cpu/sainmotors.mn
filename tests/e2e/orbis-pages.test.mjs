import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROUTES = ["about", "news", "services", "brands", "contact", "privacy", "news/mega-test-drive-6", "brands/byd"];
let browser, page;

before(async () => {
  browser = await chromium.launch({ executablePath, headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(8000);
});
after(async () => { await browser?.close(); });

test("every inner page arrives through the black Sain title treatment", async () => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const locale of ["mn", "en"]) for (const route of ROUTES) {
    await page.goto(`${base}/${locale}/${route}/`);
    assert.equal(await page.locator("h1").count(), 1, route);
    const header=route.startsWith('news/')?'.news-feature__header':'.page-band';
    assert.equal(await page.locator(`${header} h1`).count(),1,route);
    assert.equal(await page.locator(`${header} nav a[href='/${locale}/']`).count(),1,route);
    assert.equal(await page.locator(header).evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)',route);
    assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)", route);
  }
});

test("long Mongolian titles wrap at 360px without sideways scroll", async () => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const locale of ["mn", "en"]) for (const route of ROUTES) {
    await page.goto(`${base}/${locale}/${route}/`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}/${route}`);
  }
});
