import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
].find((path) => existsSync(path));
let browser;

before(async () => {
  assert.ok(executablePath, "Set CHROME_PATH to an installed Chrome or Edge");
  browser = await chromium.launch({ executablePath });
});

after(async () => { await browser?.close(); });

test("language switching preserves dynamically selected location filters and the anchor", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`${BASE}/mn/locations/#main`);
    await page.locator(".location-directory[data-ready='true']").waitFor();
    await page.locator("select").nth(0).selectOption("maxus");
    await page.locator("select").nth(1).selectOption("darkhan");
    await page.locator(".site-header__inner > .lang-switch a[lang=en]").click();
    await page.waitForURL("**/en/locations/**");
    const url = new URL(page.url());
    assert.equal(url.searchParams.get("brand"), "maxus");
    assert.equal(url.searchParams.get("city"), "darkhan");
    assert.equal(url.hash, "#main");
    await page.locator(".location-directory[data-ready='true']").waitFor();
    assert.equal(await page.locator(".location-directory__row").count(), 1);
  } finally { await page.close(); }
});

test("locations routes have complete server-rendered contact rows in both languages without JavaScript", async () => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const locale of ["mn", "en"]) {
      const response = await page.goto(`${BASE}/${locale}/locations/`);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".location-directory__row").count(), 7);
      assert.equal(await page.locator(".location-directory__row a[href^='tel:']").count(), 11);
      assert.equal(await page.locator(".location-directory__map").count(), 7);
      assert.equal(await page.locator("noscript").count() > 0, true);
    }
  } finally { await context.close(); }
});

test("brand and city filters intersect, create a shareable URL, and restore after refresh and Back", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${BASE}/en/locations/?utm_source=partner`);
    await page.locator(".location-directory[data-ready='true']").waitFor();
    await page.getByLabel("Brand", { exact: true }).selectOption("jetour");
    await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 2);
    assert.equal(new URL(page.url()).searchParams.get("brand"), "jetour");
    await page.getByLabel("City", { exact: true }).selectOption("darkhan");
    await page.getByRole("heading", { name: "No matching locations" }).waitFor();
    assert.equal(await page.locator(".location-directory__row").count(), 0);
    assert.match(await page.locator(".location-directory__empty").innerText(), /Change the brand or city/);
    assert.equal(new URL(page.url()).searchParams.get("city"), "darkhan");
    assert.equal(new URL(page.url()).searchParams.get("utm_source"), "partner");
    await page.reload();
    await page.getByRole("heading", { name: "No matching locations" }).waitFor();
    assert.equal(await page.getByLabel("Brand", { exact: true }).inputValue(), "jetour");
    assert.equal(await page.getByLabel("City", { exact: true }).inputValue(), "darkhan");
    await page.goBack();
    await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 2);
    assert.equal(await page.getByLabel("City", { exact: true }).inputValue(), "");
    await page.getByRole("button", { name: "Clear filters", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 7);
    assert.equal(new URL(page.url()).searchParams.has("brand"), false);
    assert.equal(new URL(page.url()).searchParams.get("utm_source"), "partner");
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

test("direct location links use the same city keys in MN and EN and retain literal brand coverage", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    for (const locale of ["mn", "en"]) {
      await page.goto(`${BASE}/${locale}/locations/?city=darkhan&brand=maxus`);
      await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 1);
      assert.equal(await page.locator(".location-directory__row").getAttribute("id"), "darkhan");
      assert.equal(await page.locator("#location-brand").inputValue(), "maxus");
      assert.equal(await page.locator("#location-city").inputValue(), "darkhan");
    }
    await page.goto(`${BASE}/en/locations/?brand=unknown&city=unknown`);
    await page.locator(".location-directory[data-ready='true']").waitFor();
    assert.equal(await page.locator(".location-directory__row").count(), 7);
  } finally { await context.close(); }
});

test("location actions retain supplied phones, verified directions and honest search and hours labels", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`${BASE}/en/locations/`);
    assert.equal(await page.locator("#jetour-c1 a[href='tel:+97670108855']").count(), 1);
    assert.equal(await page.locator("#chery-narny a[href='tel:+97672558855']").count(), 1);
    assert.equal(await page.locator("#jetour-c1 .location-directory__map").getAttribute("href"), "https://www.google.com/maps/dir/?api=1&destination=47.9210074%2C106.9015123");
    assert.match(await page.locator("#jetour-c1 .location-directory__map").innerText(), /Get directions/);
    assert.match(await page.locator("#sansar .location-directory__map").getAttribute("href"), /^https:\/\/www\.google\.com\/maps\/search\//);
    assert.match(await page.locator("#sansar .location-directory__map").innerText(), /Search map/);
    assert.match(await page.locator("#sansar").innerText(), /Call ahead for opening hours/);
    assert.equal(await page.locator("#sansar .location-directory__hours dl").count(), 0);
    assert.match(await page.locator("#jetour-c1 .location-directory__hours").innerText(), /10:30 – 19:30/);
  } finally { await context.close(); }
});

test("locations remain readable and keyboard operable across the approved widths", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    for (const width of [360, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${BASE}/mn/locations/`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `No overflow at ${width}px`);
      const controls = page.locator(".location-directory select, .location-directory__map, .location-directory__phone");
      for (const control of await controls.all()) {
        const box = await control.boundingBox();
        assert.ok(box.height >= 48, `Touch target ${box.height}px at ${width}px`);
      }
    }
    await page.locator("#location-brand").focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.locator("#location-city").evaluate((element) => element === document.activeElement), true);
  } finally { await context.close(); }
});
