import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome"].find(existsSync);
let browser;
before(async () => { browser = await chromium.launch({ executablePath }); });
after(async () => { await browser?.close(); });

// Tests exercise local map behavior without automated traffic to community tile servers.
const tile = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf1sAAAAASUVORK5CYII=", "base64");

test("brand and Mongolia city controls coordinate with the bilingual directory", async () => {
  const page = await browser.newPage();
  try {
    await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/png", body: tile }));
    for (const locale of ["en", "mn"]) {
      await page.goto(`${BASE}/${locale}/locations/`);
      await page.locator(".location-directory[data-ready=true]").waitFor();
      assert.equal(await page.locator(".network-brands button").count(), 12);
      assert.deepEqual(await page.locator(".network-city__count").allTextContents(), ["6", "1", "1"]);
      await page.locator('.network-city[data-city="darkhan"]').click();
      await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 1);
      assert.equal(await page.locator("#location-city").inputValue(), "darkhan");
      assert.equal(await page.locator(".location-directory__row").getAttribute("id"), "darkhan");
      await page.locator('.network-brands button[data-brand="jetour"]').click();
      assert.equal(await page.locator("#location-brand").inputValue(), "jetour");
      await page.locator(".location-directory__empty").waitFor();
      await page.locator(".location-directory__clear").click();
      await page.waitForFunction(() => document.querySelectorAll(".location-directory__row").length === 8);
    }
  } finally { await page.close(); }
});

test("verified pins, city areas and contact accordions remain synchronized", async () => {
  const page = await browser.newPage();
  try {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("https://tile.openstreetmap.org/**", route => route.fulfill({ contentType: "image/png", body: tile }));
    await page.goto(`${BASE}/en/locations/`);
    await page.locator(".network-map").scrollIntoViewIfNeeded();
    await page.locator(".network-map[data-loaded=true]").waitFor();
    assert.equal(await page.locator(".network-pin--exact").count(), 4);
    assert.equal(await page.locator(".network-pin--city").count(), 3);
    await page.locator("#chery-narny .location-directory__toggle").click();
    assert.equal(await page.locator("#chery-narny .location-directory__toggle").getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator(".network-map").getAttribute("data-selected"), "chery-narny");
    await page.locator("#sansar .location-directory__toggle").click();
    assert.equal(await page.locator("#chery-narny .location-directory__toggle").getAttribute("aria-expanded"), "false");
    await page.locator(".network-map__area-note").waitFor();
    assert.match(await page.locator(".network-map__area-note").innerText(), /City area/);
    await page.locator('.network-map__reset').click();
    await page.locator('.network-pin--city[title*="Erdenet"]').click();
    assert.equal(await page.locator("#erdenet .location-directory__toggle").getAttribute("aria-expanded"), "true");
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test("unavailable street tiles leave a useful map fallback and accessible contact actions", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.route("https://tile.openstreetmap.org/**", route => route.abort());
    await page.goto(`${BASE}/en/locations/?city=erdenet`);
    await page.locator(".network-map__mobile-toggle").click();
    await page.locator(".network-map").scrollIntoViewIfNeeded();
    await page.locator(".network-map__unavailable").waitFor();
    await page.locator("#erdenet .location-directory__toggle").click();
    assert.equal(await page.locator('#erdenet a[href="tel:+97699096347"]').isVisible(), true);
    assert.match(await page.locator("#erdenet .location-directory__map").getAttribute("href"), /maps\/search/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally { await page.close(); }
});
