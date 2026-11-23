import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
test("the BYD brand card opens a dedicated SEALION 6 page", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/mn/brands/`);
    await page.getByRole("link", { name: "BYD Дэлгэрэнгүй үзэх" }).click();
    await page.waitForURL("**/mn/brands/byd/");
    await page.getByRole("heading", { level: 1, name: "BYD SEALION 6" }).waitFor();
    await page.locator(".byd-hero__visual img").evaluate(img => img.decode());
    assert.equal(await page.locator(".byd-hero button").count(), 0);
    await page.getByRole("link", { name: "Загвартай танилцах" }).click();
    assert.match(page.url(), /#byd-overview$/);
    assert.equal(await page.locator("#byd-overview-heading").textContent(), "BYD DM-i");

    await page.goto(`${base}/mn/brands/byd/?model=shark-6`, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), "BYD SEALION 6");
  } finally { await browser.close(); }
});

test("mobile SEALION 6 has local specifications, working colour selection and real contact links", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 760 }, isMobile: true, deviceScaleFactor: 1, hasTouch: true });
    await page.goto(`${base}/en/brands/byd/`);
    const overview = page.locator("#byd-overview");
    const specs = page.locator("#byd-technical");
    assert.equal(await page.locator(".byd-hero button").count(), 0);
    assert.match(await overview.innerText(), /18\.3\s*kWh/);
    assert.match(await overview.innerText(), /300\s*hp/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    const roadPhoto = overview.getByRole("img", { name: "Silver BYD SEALION 6 driving along a mountain road" });
    await roadPhoto.scrollIntoViewIfNeeded();
    const roadRatios = await roadPhoto.evaluate(async img => {
      await img.decode();
      return [img.clientWidth / img.clientHeight, img.naturalWidth / img.naturalHeight];
    });
    assert.ok(Math.abs(roadRatios[0] - roadRatios[1]) < 0.02, "the full road composition fits on mobile");
    await page.getByRole("button", { name: "Azure blue", exact: true }).tap();
    const paint = page.getByRole("img", { name: "Exterior colours · Azure blue" });
    assert.match(await paint.getAttribute("src"), /\/blue\.webp$/);
    await paint.evaluate(img => img.decode());
    const upholstery = page.getByRole("group", { name: "Interior colours" });
    const cabinPhotos = [];
    for (const name of ["Light", "Black and brown", "Black"]) {
      const swatch = upholstery.getByRole("button", { name, exact: true });
      await swatch.tap();
      assert.equal(await swatch.getAttribute("aria-pressed"), "true");
      const cabin = page.getByRole("img", { name: `Interior colours · ${name}` });
      await cabin.evaluate(img => img.decode());
      cabinPhotos.push(await cabin.getAttribute("src"));
    }
    assert.equal(new Set(cabinPhotos).size, 3);
    const comfort = page.getByText("Front seat adjustment", { exact: true });
    await comfort.tap();
    assert.equal(await page.getByText(/driver’s seat adjusts electrically/).isVisible(), true);
    await specs.getByText("Safety", { exact: true }).tap();
    assert.equal(await specs.getByText("ISOFIX", { exact: true }).isVisible(), true);
    await specs.getByText("Powertrain and drive", { exact: true }).tap();
    assert.match(await specs.innerText(), /1,100\s*km/);
    const contact = page.locator("#byd-contact");
    assert.equal(await contact.getByRole("link", { name: "Ask about a test drive" }).getAttribute("href"), "/en/contact/?intent=test-drive&brand=byd#enquiry-heading");
    assert.equal(await contact.locator('a[href^="tel:"]').getAttribute("href"), "tel:+97672508855");
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(img => img.decode());
    }
  } finally { await browser.close(); }
});

test("model navigation scrolls to its sections with JavaScript disabled", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.goto(`${base}/en/brands/byd/`);
    const nav = page.getByRole("navigation", { name: "Model sections" });
    const links = await nav.getByRole("link").all();
    assert.equal(links.length, 4);
    for (const link of links) {
      const anchor = await link.getAttribute("href");
      await link.focus();
      await page.keyboard.press("Enter");
      assert.equal(new URL(page.url()).hash, anchor);
      const position = await page.locator(anchor).evaluate(section => ({
        section: section.getBoundingClientRect().top,
        header: document.querySelector(".site-header").getBoundingClientRect().bottom,
        nav: document.querySelector(".byd-subnav").getBoundingClientRect().bottom,
      }));
      assert.ok(position.section >= Math.max(position.header, position.nav) - 2, `${anchor}: ${JSON.stringify(position)}`);
      assert.ok(position.section < 720, anchor);
    }
  } finally { await browser.close(); }
});
