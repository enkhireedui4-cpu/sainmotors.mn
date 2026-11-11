import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3200";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("hero photo controls stay inside the image and keep the counter, photo and keyboard focus in sync", async () => {
  const page = await browser.newPage({ viewport: { width: 921, height: 950 }, reducedMotion: "reduce" });
  try {
    await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
    const hero = page.locator(".hero-gallery");
    const counter = hero.locator(".hero-gallery__position");
    assert.equal(await counter.count(), 1, "The reference puts the photo position inside the hero image");
    assert.match(await counter.innerText(), /01\s*\/\s*04/);
    const next = hero.locator(".hero-gallery__arrow--next");
    const previous = hero.locator(".hero-gallery__arrow--previous");
    const initialPhoto = await hero.locator("[data-active] img").getAttribute("src");
    await next.click();
    assert.match(await counter.innerText(), /02\s*\/\s*04/);
    assert.notEqual(await hero.locator("[data-active] img").getAttribute("src"), initialPhoto);
    await page.keyboard.press("ArrowLeft");
    assert.match(await counter.innerText(), /01\s*\/\s*04/);
    assert.equal(await next.evaluate(el => el === document.activeElement), true);
    await previous.click();
    assert.match(await counter.innerText(), /04\s*\/\s*04/);
    await next.click();
    assert.match(await counter.innerText(), /01\s*\/\s*04/);
    for (const width of [375, 921, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      const frame = await hero.locator(".hero-gallery__frame").boundingBox();
      if (width < 768) {
        assert.equal(await counter.isVisible(), false);
        assert.equal(await hero.locator(".hero-gallery__dots").isVisible(), true);
      } else {
        const position = await counter.boundingBox();
        assert.ok(position.y > frame.y + frame.height * .65 && position.y + position.height < frame.y + frame.height);
      }
      for (const arrow of [previous, next]) {
        const box = await arrow.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
        assert.ok(box.x > frame.x + frame.width * .5 && box.y > frame.y + frame.height * .65);
      }
    }
    const frame = hero.locator(".hero-gallery__frame");
    await frame.dispatchEvent("pointerdown", { pointerId: 7, pointerType: "touch", clientX: 250, clientY: 200 });
    await frame.dispatchEvent("pointerup", { pointerId: 7, pointerType: "touch", clientX: 245, clientY: 350 });
    assert.match(await counter.innerText(), /01\s*\/\s*04/, "Vertical scrolling should keep the current photo");
    await frame.dispatchEvent("pointerdown", { pointerId: 8, pointerType: "touch", clientX: 280, clientY: 200 });
    await frame.dispatchEvent("pointerup", { pointerId: 8, pointerType: "touch", clientX: 100, clientY: 205 });
    assert.match(await counter.innerText(), /02\s*\/\s*04/);
  } finally { await page.close(); }
});

test("mobile hero flows from large copy and paired actions to the photo, working dots and one moving logo row", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true });
  try {
    await page.goto(`${base}/mn/`, { waitUntil: "networkidle" });
    const dots = page.locator(".hero-gallery__dots button");
    assert.equal(await dots.count(), 4, "The mobile reference has four photo selectors below the image");
    assert.equal(await page.locator(".site-header__inner > .lang-switch").isVisible(), true);
    await dots.last().click();
    assert.equal(await dots.last().getAttribute("aria-pressed"), "true");
    await page.keyboard.press("ArrowRight");
    assert.equal(await dots.first().getAttribute("aria-pressed"), "true");
    assert.equal(await dots.first().evaluate(el => el === document.activeElement), true);
    await page.locator(".hero-gallery__arrow--next").click();
    assert.equal(await dots.nth(1).getAttribute("aria-pressed"), "true");
    for (const width of [360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      const actions = await page.locator(".home-arrival .actions a").all();
      const [primary, secondary, photo] = await Promise.all([actions[0].boundingBox(), actions[1].boundingBox(), page.locator(".hero-gallery__frame").boundingBox()]);
      assert.ok(Math.abs(primary.y - secondary.y) < 1, `${width}: mobile actions should share a row`);
      assert.ok(photo.y > primary.y + primary.height, `${width}: the photo follows the actions`);
      assert.ok(primary.height >= 44 && secondary.height >= 44);
      const fontSize = await page.locator(".home-arrival h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      assert.ok(fontSize >= 40, `${width}: the mobile headline should remain prominent`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
    await page.locator(".site-logo").focus();
    const strip = page.locator(".brand-marquee");
    await strip.locator(".brand-marquee__viewport").scrollIntoViewIfNeeded();
    assert.equal(await strip.getAttribute("data-ready"), "true");
    const first = strip.locator("li").first();
    const transform = await first.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(180);
    assert.notEqual(await first.evaluate(el => getComputedStyle(el).transform), transform);
    const rows = await strip.locator("li").evaluateAll(items => items.map(el => el.getBoundingClientRect().top));
    assert.ok(rows.every(y => Math.abs(y - rows[0]) < 1), "Mobile logos remain on one row");
    const viewport = strip.locator(".brand-marquee__viewport");
    await viewport.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 3 });
    assert.equal(await strip.getAttribute("data-paused"), "true");
    await viewport.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 4 });
    assert.equal(await strip.getAttribute("data-paused"), "false");
    const resumed = await first.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(180);
    assert.notEqual(await first.evaluate(el => getComputedStyle(el).transform), resumed, "Touch can resume the mobile logo loop");
  } finally { await page.close(); }
});

test("the original hero and moving logo row precede the full-screen brand showcase", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const [width, height] of [[1440, 900], [1920, 1080], [1366, 768], [390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${base}/mn/`, { waitUntil: "networkidle" });
      const header = await page.locator(".site-header").boundingBox();
      const hero = await page.locator(".home-arrival").boundingBox();
      const logos = await page.locator(".home-brands").boundingBox();
      const showcase = await page.locator(".brand-spotlight").boundingBox();
      const available = height - header.height;
      assert.ok(logos.y >= hero.y + hero.height - 1 && logos.y < hero.y + hero.height + 2, `${width}: the moving logos should follow the original hero immediately`);
      assert.ok(showcase.y >= logos.y + logos.height - 1, `${width}: the new studio should follow the moving logos`);
      if (width >= 1024) assert.ok(hero.height < available - 40, `${width}: retain the original compact hero`);
      assert.ok(Math.abs(showcase.height - available) <= 2, `${width}: the showcase should fill the next screen (${showcase.height} vs ${available})`);
      await page.locator(".brand-spotlight").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
      const heading = await page.locator(".brand-spotlight__heading").boundingBox();
      const count = await page.locator(".brand-spotlight__count").boundingBox();
      assert.ok(heading.y >= header.height, `${width}: the heading should clear the header`);
      assert.ok(count.y + count.height <= height, `${width}: the position should be visible without further scrolling`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
  } finally { await page.close(); }
});

test("home showcase keeps the visible car, brand link and position together through buttons and keyboard wrapping", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  try {
    await page.goto(`${base}/mn/`, { waitUntil: "networkidle" });
    const gallery = page.locator(".brand-spotlight");
    assert.equal(await gallery.count(), 1, "The hero should be followed by the new brand showcase");
    await gallery.scrollIntoViewIfNeeded();
    const link = gallery.locator(".brand-spotlight__link");
    assert.equal(await link.getAttribute("href"), "/mn/brands/jetour/");
    assert.match(await gallery.locator(".brand-spotlight__count").innerText(), /01\s*\/\s*11/);
    await gallery.getByRole("button", { name: "Дараагийн брэнд", exact: true }).click();
    assert.equal(await link.getAttribute("href"), "/mn/brands/soueast/");
    assert.equal(await gallery.locator('[data-position="active"] img').getAttribute("alt"), "SOUEAST S08");
    await gallery.getByRole("button", { name: "Өмнөх брэнд", exact: true }).focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await link.getAttribute("href"), "/mn/brands/hongqi/");
    assert.match(await gallery.locator(".brand-spotlight__count").innerText(), /11\s*\/\s*11/);
    await page.keyboard.press("ArrowRight");
    assert.equal(await link.getAttribute("href"), "/mn/brands/jetour/");
    await link.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await link.getAttribute("href"), "/mn/brands/soueast/");
    assert.equal(await link.evaluate(el => el === document.activeElement), true, "Changing slides from the brand link must preserve keyboard focus");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await link.getAttribute("href"), "/mn/brands/jetour/");
    assert.equal(await link.evaluate(el => el === document.activeElement), true);
    assert.deepEqual(errors, [], "Switching brands must not produce rendering errors");
    await link.click();
    await page.waitForURL("**/mn/brands/jetour/");
  } finally { await page.close(); }
});

test("phone swipe changes the brand without overflow and English keeps its own destinations", async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
  try {
    await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
    const gallery = page.locator(".brand-spotlight");
    assert.equal(await gallery.count(), 1);
    await gallery.scrollIntoViewIfNeeded();
    const stage = gallery.locator(".brand-spotlight__stage");
    await stage.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1, clientX: 280, clientY: 350 });
    await stage.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 1, clientX: 100, clientY: 355 });
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "/en/brands/soueast/");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.equal(await gallery.locator('[data-position="active"]').evaluate(el => getComputedStyle(el).transitionDuration), "0s");
    const previous = await gallery.locator(".brand-spotlight__arrow--previous").boundingBox();
    const next = await gallery.locator(".brand-spotlight__arrow--next").boundingBox();
    const progress = await gallery.locator(".brand-spotlight__progress").boundingBox();
    const count = await gallery.locator(".brand-spotlight__count").boundingBox();
    const explore = await gallery.locator(".brand-spotlight__link").boundingBox();
    assert.ok(previous.y > explore.y + explore.height && next.y > explore.y + explore.height, "Phone arrows belong below the model and brand link");
    assert.ok(previous.x + previous.width < progress.x && progress.x + progress.width < next.x, "Phone progress sits between the two arrows");
    assert.ok(count.y > progress.y + progress.height, "Phone position sits beneath the progress line");
    assert.ok(Math.abs(previous.y - next.y) < 1);
    for (const button of await gallery.getByRole("button").all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, "Gallery controls need comfortable touch targets");
    }
    await gallery.evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
    const nextButton = gallery.locator(".brand-spotlight__arrow--next");
    const target = await nextButton.boundingBox();
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "/en/brands/chery/");
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - scrollY) < 1, "Using the footer controls keeps the studio in view");
    assert.equal(await nextButton.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "/en/brands/soueast/");
  } finally { await page.close(); }
});
