import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3200";
const ENDPOINT = "https://uzffaelpmhwffcuiqgjq.supabase.co/functions/v1/submit-r8-lead";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
});
after(async () => { await browser?.close(); });

test("R8 selectors change the photographic content and details in both languages", async () => {
  for (const locale of ["en", "mn"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${BASE}/${locale}/brands/rely/`);
    const product = page.locator(".r8-experience");
    await product.waitFor({ timeout: 10000 });
    assert.match(await product.locator(".r8-hero img").getAttribute("src"), /hero-1-clean\.webp$/);
    assert.equal(await product.locator(".r8-hero h1").textContent(), "RELY R8");
    assert.equal((await product.locator(".r8-hero__tagline").textContent()).replace(/\s+/g, " "), locale === "mn" ? "Дэлхийг ухаалагжуулна" : "INTELLIGENTIZE THE WORLD");
    assert.equal(await product.locator('.r8-hero button, img[src*="hero-2"]').count(), 0);
    assert.equal(await product.locator(".r8-global-note, .r8-feature-panel__note").count(), 0);
    assert.equal(await page.locator(".brand-title").count(), 0);
    const tabs = product.getByRole("tab");
    await tabs.nth(1).click();
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    assert.match(await product.locator(".r8-terrain__photo picture img").getAttribute("src"), /terrain-2\.webp$/);
    await tabs.nth(1).press("ArrowRight");
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    assert.match(await product.locator(".r8-terrain__photo picture img").getAttribute("src"), /terrain-3\.webp$/);
    const panel = product.locator("#r8-feature-panel");
    for (const [index, firstImage] of [[0, 5], [1, 1], [2, 7], [3, 10]]) {
      const feature = product.locator(".r8-feature__trigger").nth(index);
      await feature.click();
      await panel.waitFor({ state: "visible" });
      assert.ok(await panel.locator(`img[src="/rely-r8/detail-${firstImage}.webp"]`).count());
      await panel.press("Escape");
      await panel.waitFor({ state: "hidden" });
      assert.equal(await feature.evaluate(el => el === document.activeElement), true);
    }
    const configuration = product.locator(".r8-configuration");
    await configuration.click();
    const specs = product.locator("#r8-specifications");
    assert.equal(await specs.evaluate(el => el.open), true);
    assert.equal(await specs.locator('.r8-brochure-pages img').count(), 2);
    assert.equal(await specs.locator('img[src="/rely-r8/specifications.webp"]').count(), 0);
    const pdf = specs.locator('.r8-specifications__links a[target="_blank"]');
    assert.equal(await pdf.getAttribute("href"), "/rely-r8/RELY-R8-brochure.pdf");
    if (locale === "en") {
      const response = await page.request.get(`${BASE}/rely-r8/RELY-R8-brochure.pdf`, { headers: { Range: "bytes=0-7" } });
      assert.equal(response.status(), 206);
      assert.equal(response.headers()["content-type"], "application/pdf");
      assert.equal((await response.body()).subarray(0, 5).toString(), "%PDF-");
      const downloadEvent = page.waitForEvent("download");
      await specs.locator("a[download]").click();
      const download = await downloadEvent;
      assert.equal(download.suggestedFilename(), "RELY-R8-brochure.pdf");
      const downloaded = await readFile(await download.path());
      const original = await readFile(new URL("../../public/rely-r8/RELY-R8-brochure.pdf", import.meta.url));
      assert.equal(createHash("sha256").update(downloaded).digest("hex"), createHash("sha256").update(original).digest("hex"));
      assert.equal(downloaded.subarray(0, 5).toString(), "%PDF-");
    }
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.getElementById("r8-specifications").open);
    assert.equal(await configuration.evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator("h1").count(), 1);
    const introduction = page.locator("#brand-overview");
    assert.equal(await introduction.locator("p").count(), 2);
    assert.equal(await introduction.evaluate(el => el.nextElementSibling?.id), "r8-test-drive");
    assert.equal(await introduction.locator('a[href="tel:72228855"], a[href="tel:+97672228855"]').count(), 1);
    assert.ok(await page.locator("#brand-showroom").count());
    await page.close();
  }
});

test("R8 mobile details trap focus, Escape returns it, terrain swipes and short layouts fit", async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 }, reducedMotion: "reduce" });
  await page.goto(`${BASE}/en/brands/rely/`);
  await page.locator(".r8-experience").waitFor({ timeout: 10000 });
  assert.match(await page.locator(".r8-hero img").evaluate(el => el.currentSrc), /hero-1-clean-mobile\.webp$/);
  assert.equal(await page.locator('.brand-title, .r8-hero button, img[src*="hero-2"]').count(), 0);
  const terrain = page.locator(".r8-terrain__photo");
  await terrain.scrollIntoViewIfNeeded();
  const box = await terrain.boundingBox();
  await terrain.dispatchEvent("touchstart", { changedTouches: [{ identifier: 1, clientX: box.x + box.width - 20, clientY: box.y + 80 }] });
  await terrain.dispatchEvent("touchend", { changedTouches: [{ identifier: 1, clientX: box.x + 20, clientY: box.y + 80 }] });
  assert.match(await terrain.locator("picture img").getAttribute("src"), /terrain-2\.webp$/);
  const trigger = page.locator(".r8-feature__trigger").last();
  await trigger.click();
  const panel = page.locator("#r8-feature-panel");
  assert.equal(await panel.evaluate(el => el.matches(":modal")), true);
  const close = panel.locator(".r8-feature-panel__close");
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  assert.equal(await panel.evaluate(el => el.contains(document.activeElement)), true);
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden" });
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  await page.locator(".r8-configuration").click();
  const brochure = page.locator("#r8-specifications");
  await brochure.locator(".r8-brochure-pages img").last().scrollIntoViewIfNeeded();
  await brochure.locator(".r8-brochure-pages img").last().evaluate(image => image.decode());
  assert.equal(await brochure.evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
  await page.keyboard.press("Escape");
  await page.locator("#r8-test-drive").scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  assert.equal(await page.locator('a[href="/en/privacy/"]').count() > 0, true);
  const broken = await page.locator(".r8-experience img").evaluateAll(images => images.filter(el => el.complete && el.naturalWidth === 0).map(el => el.src));
  assert.deepEqual(broken, []);
  await page.close();
});

test("R8 city selector defaults to Ulaanbaatar and offers Erdenet and Darkhan in both languages", async () => {
  for (const [locale, label, labels] of [["mn", "Хот", ["Улаанбаатар", "Эрдэнэт", "Дархан"]], ["en", "City", ["Ulaanbaatar", "Erdenet", "Darkhan"]]]) {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE}/${locale}/brands/rely/`);
      const city = page.locator("#r8-test-drive form").getByLabel(label, { exact: true });
      assert.equal(await city.inputValue(), "ulaanbaatar");
      assert.deepEqual(await city.locator("option").allTextContents(), labels);
      await city.selectOption("erdenet");
      assert.equal(await city.inputValue(), "erdenet");
      await city.selectOption("darkhan");
      assert.equal(await city.inputValue(), "darkhan");
    } finally { await page.close(); }
  }
});

test("R8 rejects blank names, invalid phone and missing consent before requesting storage", async () => {
  const page = await browser.newPage();
  let requests = 0;
  await page.route(ENDPOINT, async route => { requests++; await route.abort(); });
  await page.goto(`${BASE}/en/brands/rely/`);
  const form = page.locator("#r8-test-drive form");
  await form.getByLabel("City", { exact: true }).selectOption("ulaanbaatar");
  await form.getByLabel("First name", { exact: true }).fill("   ");
  await form.getByLabel("Last name", { exact: true }).fill("   ");
  await form.getByLabel("Mobile number", { exact: true }).fill("abc");
  await form.getByRole("button", { name: "Send request", exact: true }).click();
  assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
  assert.match(await form.locator("#r8-phone-error").textContent(), /valid mobile number/i);
  assert.equal(requests, 0);
  assert.equal(await form.getByLabel("First name", { exact: true }).inputValue(), "   ");
  await page.close();
});

test("R8 keeps rejected input, prevents duplicate sends and requires a server acknowledgement", async () => {
  const page = await browser.newPage();
  let attempts = 0;
  let release;
  let payload;
  await page.route(ENDPOINT, async route => {
    attempts++;
    payload = route.request().postDataJSON();
    if (attempts === 1) {
      await route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"unavailable"}' });
    } else if (attempts === 2) {
      await route.fulfill({ status: 200, contentType: "application/json", body: '{}' });
    } else {
      await new Promise(resolve => { release = resolve; });
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"id":"r8-controlled-test"}' });
    }
  });
  await page.goto(`${BASE}/mn/brands/rely/`);
  const form = page.locator("#r8-test-drive form");
  assert.equal(await form.locator('[name="city"]').inputValue(), "ulaanbaatar");
  await form.locator('[name="city"]').selectOption("darkhan");
  await form.locator('[name="firstName"]').fill("Бат");
  await form.locator('[name="lastName"]').fill("Дорж");
  await form.locator('[name="phone"]').fill("99112233");
  await form.locator('[name="consent"]').check();
  const send = form.locator('[type="submit"]');
  await send.click();
  await form.locator('[data-state="error"]').waitFor();
  assert.equal(await form.locator('[name="firstName"]').inputValue(), "Бат");
  assert.equal(await form.locator('[name="phone"]').inputValue(), "99112233");
  await send.click();
  await page.waitForFunction(() => document.querySelector("#r8-test-drive form")?.dataset.state === "error");
  assert.equal(await form.locator('[data-state="success"]').count(), 0);
  await send.click();
  await page.waitForFunction(() => document.querySelector("#r8-test-drive button[type=submit]")?.disabled);
  assert.equal(await send.isDisabled(), true);
  await form.evaluate(el => { el.requestSubmit(); el.requestSubmit(); });
  await page.waitForFunction(() => document.querySelector("#r8-test-drive form")?.dataset.state === "pending");
  assert.equal(attempts, 3);
  assert.equal(payload.locale, "mn");
  assert.equal(payload.country, "Mongolia");
  assert.equal(payload.city, "darkhan");
  release();
  await form.locator('[data-state="success"]').waitFor();
  assert.match(await form.locator('[data-state="success"]').textContent(), /хүлээн авлаа/);
  assert.equal(await send.isDisabled(), true);
  await page.close();
});
