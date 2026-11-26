import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });

async function waitForPlayingFilm(page, path) {
  await page.waitForFunction(expected => {
    const film = document.querySelector(".cinematic-hero__film");
    return film?.currentSrc && new URL(film.currentSrc).pathname === expected
      && film.videoWidth > 0 && film.currentTime > .1 && !film.paused
      && Number(getComputedStyle(film).opacity) > .9;
  }, path);
}

test("mobile portrait and landscape keep the hero copy and touch controls inside the opening screen", async () => {
  const page=await browser.newPage({isMobile:true,hasTouch:true,reducedMotion:"reduce"});
  try {
    for(const locale of ["mn","en"]) for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[667,375],[844,390]]) {
      await page.setViewportSize({width,height});
      await page.goto(base+"/"+locale+"/",{waitUntil:"networkidle"});
      const layout=await page.evaluate(()=>{
        const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();
        return {
          hero:box(".home-orbit-hero"),title:box(".home-orbit-hero__title"),motto:box(".home-orbit-hero__motto"),link:box(".home-orbit-hero__discover"),
          media:box(".cinematic-hero__media"),fit:getComputedStyle(document.querySelector(".cinematic-hero__film")).objectFit,
          filmFilter:getComputedStyle(document.querySelector(".cinematic-hero__film")).filter,
          viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,
        };
      });
      assert.equal(layout.fit,"cover");
      assert.equal(layout.filmFilter,"none");
      if (width < height) {
        assert.ok(layout.hero.bottom < layout.viewport - 40);
      }
      assert.equal(layout.media.height,layout.hero.height);
      assert.ok(layout.motto.top >= layout.title.bottom);
      assert.ok(layout.link.top >= layout.motto.bottom);
      assert.ok(Math.abs(layout.title.x + layout.title.width / 2 - width / 2) < 1);
      assert.ok(Math.abs(layout.link.x + layout.link.width / 2 - width / 2) < 1);
      assert.ok(layout.link.bottom<=layout.hero.bottom-8);
      assert.ok(layout.link.width>=44&&layout.link.height>=44);
      assert.equal(layout.overflow,false);
    }
  }finally{await page.close();}
});

test("a touch phone plays the Ayud Tower film in portrait and landscape", async () => {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:"no-preference"});
  try {
    const requests = new Set();
    page.on("request",request => requests.add(new URL(request.url()).pathname));
    await page.goto(base+"/mn/",{waitUntil:"domcontentloaded"});
    const artwork=await page.locator(".cinematic-hero__media img").evaluate(async img=>{
      await img.decode();
      return new URL(img.currentSrc).pathname;
    });
    assert.equal(artwork,"/art/ayud-tower.webp");
    await waitForPlayingFilm(page, "/video/hero/ayud-tower-mobile.mp4");
    assert.equal(requests.has("/video/hero/ayud-tower.mp4"), false);
    assert.equal(await page.getByRole("heading",{level:1,name:"Sain Motors",exact:true}).count(),1);
    const pauseVideo = page.getByRole("button", { name: "Видеог түр зогсоох", exact: true });
    assert.equal(await pauseVideo.isVisible(), true);
    assert.equal(await pauseVideo.innerText(), "Түр зогсоох");
    await pauseVideo.tap();
    assert.ok(await page.locator(".cinematic-hero__film").evaluate(film => film.paused));
    const playVideo = page.getByRole("button", { name: "Видеог тоглуулах", exact: true });
    assert.equal(await playVideo.innerText(), "Тоглуулах");
    await playVideo.tap();
    await waitForPlayingFilm(page, "/video/hero/ayud-tower-mobile.mp4");
    await page.getByRole("button",{name:"Цэс",exact:true}).click();
    assert.equal(await page.locator("#mobile-menu").isVisible(),true);
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 844, height: 390 });
    await waitForPlayingFilm(page, "/video/hero/ayud-tower-mobile.mp4");
    assert.equal(await page.locator(".cinematic-hero__media img").evaluate(img=>new URL(img.currentSrc).pathname), "/art/ayud-tower.webp");
    assert.equal([...requests].some(path => /sain-earth|home-automotive-studio/.test(path)), false);
  }finally{await page.close();}
});



test("without JavaScript the official Sain Motors logo, artwork and readable header remain available", async () => {
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
  try {
    const films=[];
    page.on("request",r=>{if(new URL(r.url()).pathname.endsWith(".mp4"))films.push(r.url());});
    await page.goto(base+"/en/",{waitUntil:"networkidle"});
    assert.ok(await page.locator(".site-header .site-logo").isVisible());
    assert.match(await page.locator(".site-header .site-logo").evaluate(el=>getComputedStyle(el).backgroundImage), /sain-on-dark/);
    assert.ok(await page.getByRole("heading",{level:1,name:"Sain Motors",exact:true}).isVisible());
    assert.equal(await page.locator(".cinematic-hero__media").evaluate(el=>getComputedStyle(el).transform),"none");
    assert.equal(await page.locator(".site-header").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(0, 0, 0)");
    assert.ok(await page.locator(".cinematic-hero__media img").evaluate(img=>img.complete&&img.naturalWidth>0));
    assert.deepEqual(films,[]);
  }finally{await page.close();}
});



test("the home header overlays the artwork transparently and becomes solid below it", async () => {
  const page=await browser.newPage({reducedMotion:"reduce"});
  try {
    for(const width of [1440,390]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base+"/en/",{waitUntil:"networkidle"});
      const initial=await page.locator(".site-header").evaluate(el=>({background:getComputedStyle(el).backgroundColor,position:getComputedStyle(el).position}));
      assert.equal(initial.background,"rgba(0, 0, 0, 0)");
      assert.equal(initial.position,"fixed");
      assert.equal((await page.locator(".home-orbit-hero").boundingBox()).y,0);
      await page.locator(".orbit-services").evaluate(el=>el.scrollIntoView({behavior:"instant",block:"start"}));
      await page.waitForFunction(()=>getComputedStyle(document.querySelector(".site-header")).backgroundColor==="rgb(255, 255, 255)");
      assert.equal((await page.locator(".site-header").boundingBox()).y,0);
    }
  } finally {await page.close();}
});



test("the desktop Ayud Tower hero exposes its motto and brand link during the wordmark animation", async () => {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"no-preference"});
  try {
    await page.goto(base + "/en/",{waitUntil:"domcontentloaded"});
    const image = page.locator(".cinematic-hero__media img");
    assert.equal(await image.getAttribute("src"),"/art/ayud-tower.webp");
    const identity = page.locator(".home-orbit-hero__identity");
    const trace = identity.locator(".cinematic-wordmark__trace");
    assert.equal(await trace.textContent(), "S");
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    assert.equal(await trace.evaluate(el => getComputedStyle(el).animationName), "cinematic-s-draw");
    const foot = page.locator(".home-orbit-hero__foot");
    const copyAtStart = await foot.evaluate(el => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 0;
      }
      return [".home-orbit-hero__motto", ".home-orbit-hero__discover"].map(selector => {
        const { visibility, opacity } = getComputedStyle(el.querySelector(selector));
        return { visibility, opacity };
      });
    });
    assert.deepEqual(copyAtStart, [{ visibility: "visible", opacity: "1" }, { visibility: "visible", opacity: "1" }]);
    await foot.locator(".home-orbit-hero__discover").click({ trial: true, timeout: 2_000 });
    await foot.evaluate(async el => {
      const animations = el.getAnimations({ subtree: true });
      for (const animation of animations) animation.play();
      await Promise.all(animations.map(animation => animation.finished));
    });
    assert.ok(await identity.getByText("A new car for Mongolians", { exact:true }).isVisible());
    assert.equal(await trace.evaluate(el => parseFloat(getComputedStyle(el).strokeDashoffset)), 0);
    assert.ok(await identity.locator(".cinematic-wordmark__letter").evaluateAll(letters =>
      letters.length === 9 && letters.every(el => getComputedStyle(el).opacity === "1")));
    const heading = await page.getByRole("heading",{level:1,name:"Sain Motors",exact:true}).boundingBox();
    const link = await page.locator(".home-orbit-hero__discover").boundingBox();
    assert.ok(Math.abs(heading.x + heading.width / 2 - 720) < 1);
    assert.ok(Math.abs(link.x + link.width / 2 - 720) < 1 && link.y > heading.y + heading.height);
    await image.evaluate(img=>img.decode());
    await waitForPlayingFilm(page, "/video/hero/ayud-tower.mp4");
    const film = page.locator(".cinematic-hero__film");
    assert.ok(await film.evaluate(el => el.muted && el.playsInline && el.loop && !el.controls));
  } finally {await page.close();}
});


test("the Sain Motors opening shows the static wordmark and links to localized brand pages under reduced motion", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const locale of ["en", "mn"]) {
      const mediaRequests = [];
      const collect = request => { if (new URL(request.url()).pathname.endsWith(".mp4")) mediaRequests.push(request.url()); };
      page.on("request", collect);
      await page.goto(base + "/" + locale + "/", { waitUntil: "networkidle" });
      assert.equal(await page.locator(".home-orbit-hero").count(), 1);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".home-video-hero, .home-brands, .brand-spotlight").count(), 0);
      assert.ok(await page.locator(".cinematic-hero__media img").evaluate(img=>img.complete&&img.naturalWidth>0));
      assert.deepEqual(mediaRequests, []);
      assert.equal(await page.locator(".home-orbit-hero button").count(), 0);
      assert.ok(await page.getByRole("heading",{level:1,name:"Sain Motors",exact:true}).isVisible());
      assert.equal(await page.locator(".home-orbit-hero").getByText(/car sales and|автомашины худалдаа/i).count(), 0);
      assert.equal(await page.locator(".cinematic-wordmark__initial").evaluate(el => getComputedStyle(el).animationName), "none");
      assert.doesNotMatch(await page.locator(".home-orbit-hero").innerText(), /distributor|дистрибьютор/i);
      assert.match(await page.locator("#home-company .orbit-statement").innerText(), /11/);
      const discover = page.locator(".home-orbit-hero__discover");
      assert.equal(await discover.getAttribute("href"), `/${locale}/brands/`);
      assert.equal(await discover.innerText(), locale === "en" ? "Explore brands" : "Брэндүүдтэй танилцах");
      await discover.click();
      await page.waitForURL(base + `/${locale}/brands/`);
      await page.locator(".brand-directory h1").waitFor({ state: "visible" });
      page.off("request", collect);
    }
  } finally { await page.close(); }
});

test("a phone with data saving enabled shows the Ayud Tower poster without downloading a film", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  try {
    await page.addInitScript(() => {
      Object.defineProperty(navigator.connection, "saveData", { get: () => true });
    });
    const films = [];
    page.on("request", request => {
      const path = new URL(request.url()).pathname;
      if (path.endsWith(".mp4")) films.push(path);
    });
    await page.goto(base + "/en/", { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "reduced");
    const poster = page.locator(".cinematic-hero__media img");
    assert.equal(await poster.evaluate(async img => {
      await img.decode();
      return new URL(img.currentSrc).pathname;
    }), "/art/ayud-tower.webp");
    assert.deepEqual(films, []);
  } finally { await page.close(); }
});

test("the old company and service blocks are replaced by the reference statement, facts and photographic services", async () => {
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  try {
    for (const locale of ["mn","en"]) {
      await page.goto(base + "/" + locale + "/", {waitUntil:"networkidle"});
      assert.equal(await page.locator(".editorial-split, .company-facts-grid, .home-service-list").count(), 0);
      assert.equal(await page.locator("#home-company .orbit-statement").count(), 1);
      assert.equal(await page.locator(".orbit-photo-strip img").count(), 4);
      assert.deepEqual(await page.locator(".orbit-facts dd").allTextContents(), ["11","7","2","3"]);
      const brandHeading = locale === "mn"
        ? "Бид дараах 11 автомашины брэндтэй хамтран ажилладаг."
        : "We work with the following 11 automotive brands.";
      const brands = page.getByRole("region", { name: brandHeading, exact: true });
      assert.equal(await page.getByText(brandHeading, { exact: true }).count(), 1, locale);
      assert.equal(await brands.getByRole("heading", { name: brandHeading, exact: true }).isVisible(), true);
      const brandList = brands.getByRole("list");
      assert.equal(await brandList.getByRole("listitem").count(), 11);
      const brandLinks = await brandList.getByRole("link").evaluateAll(links => links.map(link => link.getAttribute("href")));
      assert.deepEqual(brandLinks.sort(), [`/${locale}/brands/byd/`, `/${locale}/brands/rely/`, "https://chery.mn/", "https://jetour.mn/"]);
      const services = page.locator(".orbit-service-card");
      assert.equal(await services.count(), 4);
      for (const card of await services.all()) {
        const href = await card.getAttribute("href");
        assert.match(href, new RegExp("^/" + locale + "/services/#service-"));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
  } finally { await page.close(); }
});

test("the opening remains legible on phone, tablet and desktop under reduced motion", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 1000], [844, 390]]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + "/en/", { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      const hero = await page.locator(".home-orbit-hero").boundingBox();
      const title = await page.locator(".home-orbit-hero__title").boundingBox();
      assert.ok(title.width > 140 && title.y + title.height <= hero.y + hero.height + 1);
      assert.ok(hero.y + hero.height <= height + 1);
      assert.ok(title.x >= 0 && title.x + title.width <= width + 1);
      assert.equal(await page.locator(".cinematic-hero").getAttribute("data-motion"), "reduced");
      assert.equal(await page.locator(".cinematic-hero").evaluate(el => el.getAnimations({subtree:true}).filter(a=>a.playState === "running").length), 0);
    }
  } finally { await page.close(); }
});

test("the homepage service cards open directly and stay readable on a narrow phone", async () => {
  const page = await browser.newPage({ viewport: { width: 320, height: 760 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  try {
    for (const locale of ["mn", "en"]) {
      await page.goto(`${base}/${locale}/#home-services`);
      const section = page.locator("#home-services");
      assert.equal(await section.count(), 1, locale);
      const cards = section.locator(".orbit-service-card");
      assert.deepEqual(await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute("href"))),
        ["sales", "financing", "after-sales", "repair"].map(service => `/${locale}/services/#service-${service}`));
      const layout = await section.evaluate(node => ({
        columns: getComputedStyle(node.querySelector(".orbit-services__grid")).gridTemplateColumns.split(" ").length,
        labels: Array.from(node.querySelectorAll(".orbit-service-card__label h3"), label => label.scrollWidth <= label.clientWidth),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert.deepEqual(layout, { columns: 2, labels: [true, true, true, true], overflow: false }, locale);
    }
  } finally { await page.close(); }
});

test("the hero film only autoplays on screen and respects a manual pause", async () => {
  const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:"no-preference" });
  try {
    await page.goto(base + "/en/", {waitUntil:"networkidle"});
    await waitForPlayingFilm(page, "/video/hero/ayud-tower.mp4");
    await page.locator("#home-company").evaluate(el => el.scrollIntoView({block:"start"}));
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "paused");
    assert.ok(await page.locator(".cinematic-hero__film").evaluate(film => film.paused));
    await page.evaluate(() => window.scrollTo(0,0));
    await waitForPlayingFilm(page, "/video/hero/ayud-tower.mp4");
    const pauseVideo = page.getByRole("button", { name: "Pause video", exact: true });
    assert.equal(await pauseVideo.isVisible(), true);
    await pauseVideo.press("Enter");
    const film = page.locator(".cinematic-hero__film");
    assert.ok(await film.evaluate(video => video.paused && getComputedStyle(video).opacity === "1"));
    await page.locator("#home-company").evaluate(el => el.scrollIntoView({ block: "start" }));
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "paused");
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    assert.ok(await film.evaluate(video => video.paused));
    const playVideo = page.getByRole("button", { name: "Play video", exact: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "reduced");
    await playVideo.waitFor({ state: "hidden" });
    assert.equal(await film.getAttribute("src"), null);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    await playVideo.waitFor({ timeout: 2_000 });
    assert.ok(await film.evaluate(video => video.paused));
    await playVideo.press("Enter");
    await waitForPlayingFilm(page, "/video/hero/ayud-tower.mp4");
  } finally { await page.close(); }
});

test("live motion preferences and navigation restore the correct header appearance", async () => {
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:"no-preference"});
  try {
    await page.goto(base + "/en/", {waitUntil:"networkidle"});
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    assert.equal(await page.locator('.site-header__inner > .lang-switch a').evaluate(el => getComputedStyle(el).color), "rgb(198, 198, 198)");
    await page.emulateMedia({reducedMotion:"reduce"});
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "reduced");
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    await page.locator(".orbit-services").evaluate(el => el.scrollIntoView({behavior:"instant",block:"start"}));
    await page.waitForFunction(() => document.body.dataset.orbitScrolled === "true");
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".site-header")).backgroundColor === "rgb(255, 255, 255)");
    assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
    await page.getByRole("button",{name:"Menu",exact:true}).click();
    assert.equal(await page.locator(".mobile-menu").evaluate(el => getComputedStyle(el).getPropertyValue("--focus").trim()), "#e20a17");
    await page.locator("#mobile-menu nav").getByRole("link",{name:"Services",exact:true}).click();
    await page.waitForURL("**/en/services/");
    await page.waitForFunction(() => !document.body.hasAttribute("data-orbit-scrolled"));
    assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
  } finally { await page.close(); }
});
