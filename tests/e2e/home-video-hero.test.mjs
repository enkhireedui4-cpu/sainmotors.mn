import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const desktopVideo = "/video/hero/sain-motors-hero-desktop.mp4";
const mobileVideo = "/video/hero/sain-motors-hero-mobile.mp4";
// Independent scene fixtures: the requested parked-car lineup, not the file end.
const holdTime = { desktop: 38, phone: 38 };
let browser;

before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
});
after(async () => { await browser?.close(); });

async function openHome(page, locale = "mn") {
  await page.goto(`${base}/${locale}/`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".home-video-hero").count(), 1, "The first section must be the requested video hero");
  await page.evaluate(() => document.fonts.ready);
}

async function waitForPlayback(page) {
  await page.waitForFunction(() => {
    const video = document.querySelector(".home-video-hero video");
    return video && video.readyState >= 2 && video.currentTime >= 1 && !video.paused;
  }, null, { timeout: 15000 });
}

async function assertAdvances(page, video) {
  const beforeTime = await video.evaluate(el => el.currentTime);
  await page.waitForFunction(time => document.querySelector(".home-video-hero video").currentTime > time + .2, beforeTime, { timeout: 5000 });
}

test("video hero and the existing header fill one viewport with only the requested down-arrow link", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const locale of ["mn", "en"]) {
      for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900]]) {
        await page.setViewportSize({ width, height });
        await openHome(page, locale);
        const hero = page.locator(".home-video-hero");
        const header = await page.locator(".site-header").boundingBox();
        const bounds = await hero.boundingBox();
        assert.ok(Math.abs(bounds.y - (header.y + header.height)) <= 2, `${locale}@${width}: video starts directly after the global header`);
        assert.ok(Math.abs(bounds.y + bounds.height - height) <= 2, `${locale}@${width}: header plus video fills the first screen`);
        assert.ok(bounds.x <= 1 && Math.abs(bounds.width - width) <= 2, `${locale}@${width}: video is full bleed`);
        assert.equal(await hero.locator("video").count(), 1, "Responsive media must share one playback surface");
        assert.equal(await hero.locator("a").count(), 1, "The down arrow is the only hero link");
        assert.equal(await hero.locator("button, [role=button], input, select, textarea").count(), 0, "No playback buttons or other overlay controls belong in the video hero");
        const down = hero.locator('a[href="#home-brand-showcase"]');
        assert.equal(await down.count(), 1);
        assert.match(await down.getAttribute("aria-label"), locale === "mn" ? /брэнд/i : /brand/i, "The icon has a meaningful localized accessible name");
        assert.equal(await hero.locator("video").evaluate(el => el.controls), false);
        const visibleText = await hero.evaluate(root => {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          const text = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent.trim() || ["SCRIPT", "STYLE", "title", "desc"].includes(node.parentElement.tagName)) continue;
            let visible = true;
            for (let element = node.parentElement; element && element !== root.parentElement; element = element.parentElement) {
              const style = getComputedStyle(element), rect = element.getBoundingClientRect();
              if (style.display === "none" || style.visibility !== "visible" || Number(style.opacity) === 0 || (rect.width <= 2 && rect.height <= 2)) visible = false;
            }
            if (visible) text.push(node.textContent.trim());
          }
          return text;
        });
        assert.deepEqual(visibleText, [], "A visually hidden H1 is allowed; visible hero copy is not");
        assert.equal(await page.locator("h1").count(), 1, "The homepage retains its accessible document heading");
        assert.equal(await page.locator(".site-header__inner > .lang-switch").isVisible(), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${locale}@${width}: no horizontal overflow`);
        const firstSection = await page.locator(".corporate-home > section").first().evaluate(el => el.classList.contains("home-video-hero"));
        assert.equal(firstSection, true);
      }
    }
  } finally { await page.close(); }
});

for (const [label, width, height, expected] of [["desktop", 1440, 900, desktopVideo], ["phone", 390, 844, mobileVideo], ["767px phone boundary", 767, 900, mobileVideo], ["768px desktop boundary", 768, 900, desktopVideo]]) {
  test(`${label} fetches only its matching hero video, skips the first second and actually plays`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "no-preference" });
    const requests = new Set();
    page.on("request", request => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith("/video/hero/") && path.endsWith(".mp4")) requests.add(path);
    });
    try {
      await page.addInitScript(() => {
        window.__heroVisibleStartTimes = [];
        const sample = () => {
          const root = document.querySelector(".home-video-hero");
          const video = root?.querySelector("video");
          if (root?.getAttribute("data-ready") === "true" && video?.readyState >= 2 && window.__heroVisibleStartTimes.length < 180) window.__heroVisibleStartTimes.push(video.currentTime);
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await openHome(page);
      const video = page.locator(".home-video-hero video");
      await waitForPlayback(page);
      assert.equal(await video.evaluate(el => new URL(el.currentSrc).pathname), expected);
      const duration = await video.evaluate(el => el.duration);
      assert.ok(Math.abs(duration - 40.96) <= .05, `The actual MP4 omits the confirmed two-second segment (duration ${duration}s)`);
      assert.deepEqual([...requests], [expected], "The other viewport's MP4 must not be downloaded");
      assert.equal(await video.evaluate(el => el.muted && el.playsInline), true);
      await assertAdvances(page, video);
      assert.ok(await video.evaluate(el => el.currentTime >= 1), "The opening second is omitted rather than played before the hero appears");
      const firstFrames = await page.evaluate(() => window.__heroVisibleStartTimes);
      assert.ok(firstFrames.length > 0, "Playback becomes ready after seeking to the opening cut");
      assert.ok(firstFrames.every(time => time >= .98), `No ready frame may reveal the omitted second: ${firstFrames.join(", ")}`);
    } finally { await page.close(); }
  });
}

async function reachLineupHold(page, video, at) {
  const previousEnds = await video.evaluate(el => {
    if (window.__heroNaturalEnds === undefined) {
      window.__heroNaturalEnds = 0;
      el.addEventListener("ended", () => { window.__heroNaturalEnds++; });
    }
    const previous = window.__heroNaturalEnds;
    // Exercise the real ending without waiting through the whole 40.96-second file.
    el.currentTime = el.duration - .2;
    return previous;
  });
  await page.waitForFunction(({ time, previous }) => {
    const video = document.querySelector(".home-video-hero video");
    return window.__heroNaturalEnds > previous && video.paused && !video.seeking && Math.abs(video.currentTime - time) < .08;
  }, { time: at, previous: previousEnds }, { timeout: 3500 });
  assert.equal(await page.locator(".home-video-hero").getAttribute("data-ready"), "true", "The actual lineup frame stays on screen during the hold");
}

async function waitForRestart(page) {
  await page.waitForFunction(() => {
    const video = document.querySelector(".home-video-hero video");
    return !video.paused && !video.seeking && video.currentTime >= .98 && video.currentTime < 2.5;
  }, null, { timeout: 4500 });
}

for (const [label, width, height] of [["desktop", 1440, 900], ["phone", 390, 844]]) {
  test(`${label} holds the nighttime lineup frame for three seconds before restarting at one second`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "no-preference" });
    try {
      await openHome(page);
      await waitForPlayback(page);
      const video = page.locator(".home-video-hero video");
      const at = holdTime[label];
      await reachLineupHold(page, video, at);
      const entered = performance.now();
      await page.waitForTimeout(2500);
      assert.equal(await video.evaluate(el => el.paused), true, "The hold must last three seconds, rather than immediately looping");
      assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - at) < .08, "The lineup remains the displayed frame throughout the hold");
      await waitForRestart(page);
      const heldFor = performance.now() - entered;
      assert.ok(heldFor >= 2800 && heldFor < 4500, `Visible hold lasted ${heldFor}ms`);
      await assertAdvances(page, video);
      // The next cycle must enter the same hold, rather than falling back to a native zero-second loop.
      await reachLineupHold(page, video, at);
      await page.waitForTimeout(200);
      assert.equal(await video.evaluate(el => el.paused), true);
    } finally { await page.close(); }
  });
}

test("click, Enter and Space skip the lineup hold and immediately restart at one second", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    for (const action of ["click", "Enter", "Space"]) {
      await reachLineupHold(page, video, holdTime.desktop);
      const requested = performance.now();
      if (action === "click") await video.click();
      else { await video.focus(); await page.keyboard.press(action); }
      await waitForRestart(page);
      assert.ok(performance.now() - requested < 1200, `${action} must skip the remaining hold`);
      await assertAdvances(page, video);
    }
  } finally { await page.close(); }
});

test("a phone tap skips the lineup hold instead of resuming the tail of the clip", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await reachLineupHold(page, video, holdTime.phone);
    const requested = performance.now();
    await video.tap();
    await waitForRestart(page);
    assert.ok(performance.now() - requested < 1200);
    await assertAdvances(page, video);
  } finally { await page.close(); }
});

test("the lineup hold counts only visible time and resumes its remaining delay after scrolling back", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await reachLineupHold(page, video, holdTime.desktop);
    await page.waitForTimeout(850);
    await page.locator("#home-company-heading").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").getBoundingClientRect().bottom <= 0);
    await page.waitForTimeout(3300);
    assert.equal(await video.evaluate(el => el.paused), true, "An offscreen hero must not autoplay or consume the three-second hold");
    assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - holdTime.desktop) < .08);
    const returned = performance.now();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1500);
    assert.equal(await video.evaluate(el => el.paused), true, "Returning must finish the remaining hold instead of immediately playing");
    assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - holdTime.desktop) < .08);
    await waitForRestart(page);
    const remaining = performance.now() - returned;
    assert.ok(remaining >= 1700 && remaining < 2800, `Return consumed the remaining delay (${remaining}ms), not a new three-second countdown`);
    await assertAdvances(page, video);
  } finally { await page.close(); }
});

test("scrolling the holding hero behind the sticky header preserves the remaining lineup delay", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await reachLineupHold(page, video, holdTime.desktop);
    await page.waitForTimeout(850);
    await page.evaluate(() => {
      const hero = document.querySelector(".home-video-hero").getBoundingClientRect();
      const header = document.querySelector(".site-header").getBoundingClientRect();
      window.scrollTo({ top: scrollY + hero.bottom - header.bottom, behavior: "instant" });
    });
    await page.waitForFunction(() => {
      const hero = document.querySelector(".home-video-hero").getBoundingClientRect();
      const header = document.querySelector(".site-header").getBoundingClientRect();
      return scrollY > 0 && hero.bottom <= header.bottom + 1;
    }, null, { timeout: 2000 });
    await page.waitForTimeout(150);
    const occlusion = await page.evaluate(() => ({
      heroBottom: document.querySelector(".home-video-hero").getBoundingClientRect().bottom,
      headerBottom: document.querySelector(".site-header").getBoundingClientRect().bottom,
    }));
    assert.ok(occlusion.heroBottom > 0 && occlusion.heroBottom <= occlusion.headerBottom + 1, "The remaining hero pixels are fully covered by the sticky header");
    await page.waitForTimeout(3300);
    assert.equal(await video.evaluate(el => el.paused), true, "A fully header-occluded hero must not consume its hold and autoplay");
    assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - holdTime.desktop) < .08, "The selected lineup frame remains held while covered");
    const returned = performance.now();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(500);
    assert.equal(await video.evaluate(el => el.paused), true, "Returning to the hero first completes the remaining hold");
    await waitForRestart(page);
    assert.ok(performance.now() - returned < 2800, "Returning finishes the existing countdown rather than beginning a fresh three-second hold");
    await assertAdvances(page, video);
  } finally { await page.close(); }
});

test("click, Space, Enter and Escape operate the video without visible playback UI", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await video.click();
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    const stopped = await video.evaluate(el => el.currentTime);
    await page.waitForTimeout(250);
    assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - stopped) < .1, "Click pauses actual playback");
    await video.focus();
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Space");
    await waitForPlayback(page);
    await assertAdvances(page, video);
    assert.equal(await page.evaluate(() => window.scrollY), scrollY, "Space operates the focused video instead of scrolling the page");
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    await page.keyboard.press("Enter");
    await waitForPlayback(page);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    await page.keyboard.press("Escape");
    assert.equal(await video.evaluate(el => el.paused), true, "Escape keeps a paused video paused");
    await video.click();
    await waitForPlayback(page);
    assert.equal(await page.locator('.home-video-hero a[href="#home-brand-showcase"]').count(), 1);
    assert.equal(await page.locator(".home-video-hero button").count(), 0);
  } finally { await page.close(); }
});

test("a phone tap pauses and resumes its own video", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await video.tap();
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    await video.tap();
    await waitForPlayback(page);
    await assertAdvances(page, video);
  } finally { await page.close(); }
});

test("offscreen video pauses, returns only when appropriate, and preserves an intentional pause", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page);
    await waitForPlayback(page);
    const video = page.locator(".home-video-hero video");
    await page.locator("#home-company-heading").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await waitForPlayback(page);
    await video.click();
    await page.waitForFunction(() => document.querySelector(".home-video-hero video").paused);
    await page.locator("#home-company-heading").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(350);
    assert.equal(await video.evaluate(el => el.paused), true, "Returning on screen must respect the visitor's pause");
  } finally { await page.close(); }
});

test("reduced motion keeps a loaded responsive poster and does not autoplay", async () => {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    try {
      await openHome(page, "en");
      const hero = page.locator(".home-video-hero");
      const video = hero.locator("video");
      const posterUrl = await hero.evaluate(root => root.querySelector("video").poster || root.querySelector("img")?.currentSrc || root.querySelector("img")?.src);
      assert.ok(posterUrl, "Reduced motion needs a real poster rather than an empty media region");
      const image = await page.evaluate(url => new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = url;
      }), posterUrl);
      assert.ok(image && image.width > 0 && image.height > 0, "The poster asset must load");
      assert.equal(width < 768 ? image.height > image.width : image.width > image.height, true, "The poster uses the matching portrait or landscape composition");
      const initial = await video.evaluate(el => ({ time: el.currentTime, paused: el.paused }));
      await page.waitForTimeout(350);
      assert.equal(initial.paused, true);
      assert.equal(await video.evaluate(el => el.paused), true);
      assert.ok(Math.abs(await video.evaluate(el => el.currentTime) - initial.time) < .1, "Reduced motion does not advance the video");
    } finally { await page.close(); }
  }
});

test("the hero down arrow pauses at the brand heading and moving logos before continuing to the car studio", async () => {
  for (const [locale, width, height] of [["mn", 1440, 900], ["en", 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "no-preference" });
    try {
      await openHome(page, locale);
      const hero = page.locator(".home-video-hero");
      const arrow = hero.locator('a[href="#home-brand-showcase"]');
      assert.equal(await arrow.count(), 1, "The requested arrow must exist inside the video hero");
      const heroBounds = await hero.boundingBox();
      const arrowBounds = await arrow.boundingBox();
      assert.ok(arrowBounds.x > heroBounds.x + heroBounds.width * .7 && arrowBounds.y > heroBounds.y + heroBounds.height * .7, "The arrow sits in the hero's bottom-right corner");
      assert.ok(arrowBounds.x + arrowBounds.width <= heroBounds.x + heroBounds.width && arrowBounds.y + arrowBounds.height <= heroBounds.y + heroBounds.height);
      assert.ok(arrowBounds.width >= 44 && arrowBounds.height >= 44, "The arrow remains a usable touch target");
      await arrow.click();
      await page.waitForTimeout(140);
      const early = await page.evaluate(() => window.scrollY);
      await page.waitForTimeout(660);
      const pausedAtBrands = await page.evaluate(() => window.scrollY);
      const firstHeader = await page.locator(".site-header").boundingBox();
      const brands = await page.locator(".home-brands").boundingBox();
      const brandsHeading = await page.locator("#brands-heading").boundingBox();
      const logos = await page.locator(".home-brands .brand-marquee").boundingBox();
      assert.ok(early > 0 && pausedAtBrands > early, "The first leg has actual intermediate scroll positions");
      assert.ok(Math.abs(brands.y - firstHeader.height) <= 2, "The first leg stops at the moving-brand section below the sticky header");
      assert.ok(brandsHeading.y >= firstHeader.height && brandsHeading.y + brandsHeading.height < height, "The distributor heading is fully visible during the pause");
      assert.ok(logos.y >= firstHeader.height && logos.y + logos.height <= height, "The moving brand logos are fully visible during the pause");
      await page.waitForTimeout(950);
      assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - pausedAtBrands) < 2, "The journey lingers on the heading and logos for about a second");
      await page.waitForTimeout(1100);
      const final = await page.evaluate(() => window.scrollY);
      assert.ok(final > pausedAtBrands + 2, "The second leg continues from the moving brands to the car studio");
      const header = await page.locator(".site-header").boundingBox();
      const studio = await page.locator("#home-brand-showcase").boundingBox();
      const heading = await page.locator("#brand-spotlight-heading").boundingBox();
      const car = await page.locator('#home-brand-showcase [data-position="active"] img').boundingBox();
      const position = await page.locator("#home-brand-showcase .brand-spotlight__count").boundingBox();
      assert.ok(Math.abs(studio.y - header.height) <= 2, "The car studio aligns directly below the global header, after passing the moving logo section");
      assert.ok(heading.y >= header.height - 1 && heading.y < height * .6, "The destination heading clears the existing sticky header");
      assert.ok(car.y >= header.height - 1 && car.y + car.height <= height + 1, "The active car is visible on arrival");
      assert.ok(position.y >= header.height && position.y + position.height <= height + 1, "The studio position indicator fits the destination screen");
      assert.equal(await page.locator("#brand-spotlight-heading").evaluate(el => el === document.activeElement), true, "The completed journey moves keyboard focus to the studio heading");
      await page.waitForTimeout(150);
      assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - final) < 2, "The section is reached without a long trailing scroll");
      await page.locator("#home-company-heading").scrollIntoViewIfNeeded();
      assert.ok((await arrow.boundingBox()).y + arrowBounds.height < 0, "The arrow scrolls away with the hero instead of becoming a fixed global control");
    } finally { await page.close(); }
  }
});

test("a native wheel scroll during the brand-row pause cancels the pending studio journey", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  try {
    await openHome(page, "mn");
    await page.locator('.home-video-hero a[href="#home-brand-showcase"]').click();
    await page.waitForTimeout(800);
    const brands = await page.locator(".home-brands").boundingBox();
    const header = await page.locator(".site-header").boundingBox();
    assert.ok(Math.abs(brands.y - header.height) <= 2, "Cancel is exercised during the dwell, before the second leg");
    const firstStop = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(250);
    const manuallyScrolled = await page.evaluate(() => window.scrollY);
    assert.ok(manuallyScrolled > firstStop + 10, "A real wheel gesture retains its normal page-scrolling effect");
    await page.waitForTimeout(2100);
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - manuallyScrolled) < 3, "The canceled dwell timer must not later pull the visitor into the car studio");
    const studio = await page.locator("#home-brand-showcase").boundingBox();
    assert.ok(studio.y > header.height + 20, "The visitor's chosen intermediate position is preserved");
  } finally { await page.close(); }
});

test("the hero down arrow reaches the car studio immediately with reduced motion", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  try {
    await openHome(page, "mn");
    const arrow = page.locator('.home-video-hero a[href="#home-brand-showcase"]');
    assert.equal(await arrow.count(), 1);
    await arrow.click();
    await page.waitForFunction(() => {
      const heading = document.querySelector("#brand-spotlight-heading").getBoundingClientRect();
      return scrollY > 0 && heading.top >= document.querySelector(".site-header").getBoundingClientRect().height - 1 && heading.top < innerHeight * .6;
    }, null, { timeout: 200 });
    const landed = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(200);
    assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - landed) < 2, "Reduced motion does not leave an animated scroll running");
  } finally { await page.close(); }
});
