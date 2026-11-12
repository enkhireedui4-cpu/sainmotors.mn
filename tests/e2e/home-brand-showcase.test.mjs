import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3200";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

test("the moving brand row retains its eleven destinations, touch pause and movement below the video", async () => {
  const slugs = ["jetour", "soueast", "chery", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi"];
  for (const locale of ["mn", "en"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true });
    try {
      await page.goto(base + "/" + locale + "/", { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator("#brands-heading").innerText(), locale === "mn" ? "11 брэндийн албан ёсны дистрибьютор" : "Official distributor of 11 brands");
      assert.equal(await page.locator(".site-header__inner > .lang-switch").isVisible(), true);
      const strip = page.locator(".brand-marquee");
      const viewport = strip.locator(".brand-marquee__viewport");
      await viewport.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector(".brand-marquee")?.getAttribute("data-ready") === "true");
      const links = strip.locator("[data-brand-directory] a");
      assert.equal(await links.count(), 11);
      for (const [index, slug] of slugs.entries()) {
        const expected = slug === "jetour" ? "https://jetour.mn/" : slug === "chery" ? "https://chery.mn/" : "/" + locale + "/brands/" + slug + "/";
        assert.equal(await links.nth(index).getAttribute("href"), expected);
      }
      const first = strip.locator("li").first();
      const transform = await first.evaluate(el => getComputedStyle(el).transform);
      await page.waitForTimeout(180);
      assert.notEqual(await first.evaluate(el => getComputedStyle(el).transform), transform);
      const rows = await strip.locator("li").evaluateAll(items => items.map(el => el.getBoundingClientRect().top));
      assert.ok(rows.every(y => Math.abs(y - rows[0]) < 1), "Mobile logos remain on one row");
      await viewport.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 3 });
      assert.equal(await strip.getAttribute("data-paused"), "true");
      await viewport.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 4 });
      assert.equal(await strip.getAttribute("data-paused"), "false");
      const resumed = await first.evaluate(el => getComputedStyle(el).transform);
      await page.waitForTimeout(180);
      assert.notEqual(await first.evaluate(el => getComputedStyle(el).transform), resumed, "Touch can resume the mobile logo loop");
    } finally { await page.close(); }
  }
});

test("the viewport video and moving logos precede the unchanged full-screen brand showcase and company sections", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const [width, height] of [[1440, 900], [1920, 1080], [1366, 768], [390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + "/mn/", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const header = await page.locator(".site-header").boundingBox();
      const hero = await page.locator(".home-video-hero").boundingBox();
      const logos = await page.locator(".home-brands").boundingBox();
      const showcase = await page.locator(".brand-spotlight").boundingBox();
      const available = height - header.height;
      assert.ok(Math.abs(hero.height - available) <= 2, width + ": header and video fill the first screen");
      assert.ok(logos.y >= hero.y + hero.height - 1 && logos.y < hero.y + hero.height + 2, width + ": the moving logos immediately follow the video");
      assert.ok(showcase.y >= logos.y + logos.height - 1, width + ": the brand studio follows the moving logos");
      assert.ok(Math.abs(showcase.height - available) <= 2, width + ": the showcase keeps its screen height");
      const sections = await page.locator(".corporate-home > section").evaluateAll(elements => elements.map(el => el.getAttribute("aria-labelledby")));
      assert.deepEqual(sections.slice(-4), ["home-company-heading", "home-services-heading", "home-news-heading", "visit-heading"], "Company, services, news and the visit invitation keep their original order below the brand studio");
      assert.equal(await page.locator(".home-service-list a").count(), 4);
      assert.equal(await page.locator('.corporate-home a[href="/mn/about/"]').count(), 1);
      assert.equal(await page.locator('.corporate-home a[href="/mn/news/"]').count(), 1);
      await page.locator(".brand-spotlight").evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
      const heading = await page.locator(".brand-spotlight__heading").boundingBox();
      const count = await page.locator(".brand-spotlight__count").boundingBox();
      assert.ok(heading.y >= header.height, width + ": the heading clears the existing header");
      assert.ok(count.y + count.height <= height, width + ": the position stays visible without extra scrolling");
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
    await page.goto(`${base}/mn/`, { waitUntil: "domcontentloaded" });
    const gallery = page.locator(".brand-spotlight");
    assert.equal(await gallery.count(), 1, "The hero should be followed by the new brand showcase");
    await gallery.scrollIntoViewIfNeeded();
    const link = gallery.locator(".brand-spotlight__link");
    assert.equal(await link.getAttribute("href"), "https://jetour.mn/");
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
    assert.equal(await link.getAttribute("href"), "https://jetour.mn/");
    await link.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await link.getAttribute("href"), "/mn/brands/soueast/");
    assert.equal(await link.evaluate(el => el === document.activeElement), true, "Changing slides from the brand link must preserve keyboard focus");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await link.getAttribute("href"), "https://jetour.mn/");
    assert.equal(await link.evaluate(el => el === document.activeElement), true);
    assert.deepEqual(errors, [], "Switching brands must not produce rendering errors");
    await page.route("https://jetour.mn/**", route => route.fulfill({ contentType: "text/html", body: "<h1>JETOUR official website</h1>" }));
    await link.click();
    await page.waitForURL("https://jetour.mn/");
  } finally { await page.close(); }
});

for (const reducedMotion of ["reduce", "no-preference"]) {
  test(`desktop dragging follows the mouse and settles after outside releases (${reducedMotion})`, async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
      await page.goto(`${base}/mn/`, { waitUntil: "networkidle" });
      const gallery = page.locator(".brand-spotlight__gallery");
      const stage = gallery.locator(".brand-spotlight__stage");
      const link = gallery.locator(".brand-spotlight__link");
      await stage.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector(".brand-spotlight__gallery")?.hasAttribute("data-ready"));
      const box = await stage.boundingBox();
      const x = box.x + box.width / 2;
      const y = box.y + box.height / 2;
      await page.mouse.move(x, y);
      const car = gallery.locator('[data-position="active"]');
      const initial = await car.boundingBox();
      await page.mouse.down();
      await page.mouse.move(x - 110, y, { steps: 8 });
      assert.ok((await car.boundingBox()).x < initial.x - 90, "The car follows the mouse before it is released");
      assert.equal(await stage.evaluate(el => getComputedStyle(el).cursor), "grabbing");
      assert.equal(await link.getAttribute("href"), "https://jetour.mn/", "The selected brand changes on release");
      await page.mouse.move(box.x - 20, y, { steps: 8 });
      await page.mouse.up();
      assert.equal(await link.getAttribute("href"), "/mn/brands/soueast/");
      assert.match(await gallery.locator(".brand-spotlight__count").innerText(), /02\s*\/\s*11/);
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width + 20, y, { steps: 10 });
      await page.mouse.up();
      assert.equal(await link.getAttribute("href"), "https://jetour.mn/");
      assert.equal(await stage.evaluate(el => getComputedStyle(el).cursor), "grab");
      await page.waitForFunction(() => document.querySelector(".brand-spotlight__stage")?.getAnimations({ subtree: true }).every(animation => animation.playState !== "running"));
      const settled = await car.boundingBox();
      assert.ok(Math.abs(settled.x + settled.width / 2 - x) < 1, "After consecutive drags the selected car settles in the center");
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  });
}

test("short, vertical and cancelled drags leave the selected brand in place", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  try {
    await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
    const gallery = page.locator(".brand-spotlight__gallery");
    const stage = gallery.locator(".brand-spotlight__stage");
    await stage.scrollIntoViewIfNeeded();
    const box = await stage.boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const car = gallery.locator('[data-position="active"]');
    const initial = await car.boundingBox();
    for (const [dx, dy, button] of [[18, 0, "left"], [5, 90, "left"], [-120, 0, "right"]]) {
      await page.mouse.move(x, y);
      await page.mouse.down({ button });
      await page.mouse.move(x + dx, y + dy, { steps: 6 });
      await page.mouse.up({ button });
      assert.equal(await gallery.getAttribute("data-current"), "0");
      assert.ok(Math.abs((await car.boundingBox()).x - initial.x) < 1, "An incomplete drag returns the car to its position");
    }
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 120, y, { steps: 6 });
    await stage.evaluate(el => el.releasePointerCapture(1));
    await page.mouse.up();
    assert.equal(await gallery.getAttribute("data-current"), "0", "Losing pointer capture cancels the drag");
    assert.equal(await stage.evaluate(el => getComputedStyle(el).cursor), "grab");
    assert.ok(Math.abs((await car.boundingBox()).x - initial.x) < 1);
  } finally { await page.close(); }
});

test("phone swipe changes the brand without overflow and English keeps its own destinations", async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  try {
    await page.goto(`${base}/en/`, { waitUntil: "domcontentloaded" });
    const gallery = page.locator(".brand-spotlight");
    assert.equal(await gallery.count(), 1);
    await gallery.scrollIntoViewIfNeeded();
    const stage = gallery.locator(".brand-spotlight__stage");
    const touch = await page.context().newCDPSession(page);
    const stageBox = await stage.boundingBox();
    const touchY = stageBox.y + stageBox.height / 2;
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 280, y: touchY }] });
    for (let index = 1; index <= 8; index++) {
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 280 - index * 22.5, y: touchY }] });
    }
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForFunction(() => document.querySelector(".brand-spotlight__gallery")?.getAttribute("data-current") === "1");
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
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "https://chery.mn/");
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - scrollY) < 1, "Using the footer controls keeps the studio in view");
    assert.equal(await nextButton.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "/en/brands/soueast/");
    const verticalBox = await stage.boundingBox();
    const verticalY = verticalBox.y + verticalBox.height / 2;
    const beforeScroll = await page.evaluate(() => window.scrollY);
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 190, y: verticalY }] });
    for (let index = 1; index <= 8; index++) {
      await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y: verticalY - index * 15 }] });
    }
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForFunction(y => window.scrollY > y + 30, beforeScroll);
    assert.equal(await gallery.locator(".brand-spotlight__link").getAttribute("href"), "/en/brands/soueast/", "Vertical touch gestures scroll the page without changing the brand");
    await touch.detach();
  } finally { await page.close(); }
});

test("homepage brand CTAs identify official sites and keep the other nine destinations inside Sain Motors", async () => {
  const slugs = ["jetour", "soueast", "chery", "byd", "riddara", "aito", "212", "bestune", "rely", "maxus", "hongqi"];
  const sites = { jetour: "https://jetour.mn/", chery: "https://chery.mn/" };
  for (const locale of ["mn", "en"]) {
    const page = await browser.newPage({ viewport: { width: locale === "mn" ? 1440 : 390, height: 960 }, reducedMotion: "reduce" });
    try {
      await page.goto(`${base}/${locale}/`, { waitUntil: "domcontentloaded" });
      const gallery = page.locator(".brand-spotlight");
      const link = gallery.locator(".brand-spotlight__link");
      await link.focus();
      for (const slug of slugs) {
        const site = sites[slug];
        const brand = slug === "jetour" ? "Jetour" : "Chery";
        assert.equal(await link.getAttribute("href"), site ?? `/${locale}/brands/${slug}/`);
        assert.equal(await link.innerText(), site
          ? (locale === "mn" ? `${brand}-ийн сайт руу` : `Visit ${brand} website`)
          : (locale === "mn" ? "Брэндтэй танилцах" : "Explore the brand"));
        assert.equal(await link.getAttribute("rel"), site ? "external" : null);
        assert.equal(await link.getAttribute("target"), null, "The CTA navigates directly in the current tab");
        await page.keyboard.press("ArrowRight");
        assert.equal(await link.evaluate(el => el === document.activeElement), true);
      }
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      await page.route("https://chery.mn/**", route => route.fulfill({ contentType: "text/html", body: "<h1>CHERY official website</h1>" }));
      await link.click();
      await page.waitForURL("https://chery.mn/");
    } finally { await page.close(); }
  }
});
