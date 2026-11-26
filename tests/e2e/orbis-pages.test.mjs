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

test("PageBand breadcrumb links stay readable at rest and on hover", async () => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const locale of ["mn", "en"]) {
    await page.goto(`${base}/${locale}/about/`);
    const link = page.locator(".page-band__crumbs a").first();
    const measure = () => link.evaluate(el => {
      const band = el.closest(".page-band");
      const channels = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = rgb => rgb.map(channel => {
        const value = channel / 255;
        return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      const background = channels(getComputedStyle(band).backgroundColor);
      let opacity = 1;
      for (let node = el; node && node !== band; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
      const text = channels(getComputedStyle(el).color).map((value, index) => value * opacity + background[index] * (1 - opacity));
      const values = [luminance(text), luminance(background)];
      return (Math.max(...values) + .05) / (Math.min(...values) + .05);
    });
    const normal = await measure();
    await link.hover();
    await link.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
    const hover = await measure();
    assert.ok(normal >= 4.5, `${locale} normal contrast: ${normal.toFixed(2)}:1`);
    assert.ok(hover >= normal, `${locale} hover contrast: ${hover.toFixed(2)}:1`);
  }
});
