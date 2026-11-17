import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
let browser;
before(async () => {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
});
after(async () => { await browser?.close(); });


test("mobile portrait and landscape keep the hero copy and touch controls inside the opening screen", async () => {
  const page=await browser.newPage({isMobile:true,hasTouch:true,reducedMotion:"reduce"});
  try {
    for(const locale of ["mn","en"]) for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[667,375],[844,390]]) {
      await page.setViewportSize({width,height});
      await page.goto(base+"/"+locale+"/",{waitUntil:"networkidle"});
      const layout=await page.evaluate(()=>{
        const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();
        return {
          hero:box(".home-orbit-hero"),promise:box(".home-orbit-hero__promise"),foot:box(".home-orbit-hero__foot"),
          social:box(".home-orbit-hero__socials a"),
          viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,
        };
      });
      assert.ok(Math.abs(layout.hero.bottom-layout.viewport)<2,locale+" "+width+"x"+height+": opening must fit one screen");
      assert.ok(layout.foot.top>=layout.promise.bottom+8,locale+" "+width+"x"+height+": copy must not overlap");
      assert.ok(layout.foot.bottom<=layout.viewport-8);
      assert.ok(layout.social.width>=44&&layout.social.height>=44);
      assert.equal(layout.overflow,false);
    }
  }finally{await page.close();}
});

test("a touch phone plays the Earth inline and finishes the same S-to-name sequence", async () => {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:"no-preference"});
  try {
    await page.goto(base+"/mn/",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelector(".cinematic-hero")?.dataset.intro==="complete");
    await page.waitForFunction(()=>{const v=document.querySelector(".cinematic-hero__video");return v.readyState>=2&&v.currentTime>.2&&!v.paused;});
    const video=await page.locator(".cinematic-hero__video").evaluate(v=>({inline:v.playsInline,muted:v.muted,controls:v.controls,time:v.currentTime}));
    assert.ok(video.inline&&video.muted&&!video.controls);
    await page.waitForFunction(time=>document.querySelector(".cinematic-hero__video").currentTime>time+.15,video.time);
    assert.equal(await page.locator("h1").getAttribute("aria-label"),"SAIN MOTORS");
    await page.getByRole("button",{name:"Цэс",exact:true}).click();
    assert.equal(await page.locator("#mobile-menu").isVisible(),true);
    await page.keyboard.press("Escape");
  }finally{await page.close();}
});



test("without JavaScript the complete wordmark, poster and readable header remain available", async () => {
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
  try {
    const films=[];
    page.on("request",r=>{if(new URL(r.url()).pathname.endsWith(".mp4"))films.push(r.url());});
    await page.goto(base+"/en/",{waitUntil:"networkidle"});
    assert.equal(await page.locator(".cinematic-wordmark__letter").last().evaluate(el=>getComputedStyle(el).opacity),"1");
    assert.equal(await page.locator(".home-orbit-hero__motion").isVisible(),false);
    assert.equal(await page.locator(".site-header").evaluate(el=>getComputedStyle(el).backgroundColor),"rgb(0, 0, 0)");
    assert.ok(await page.locator(".cinematic-hero__media img").evaluate(el=>el.complete&&el.naturalWidth>0));
    assert.deepEqual(films,[]);
  }finally{await page.close();}
});



test("the home header overlays the film transparently and becomes solid below it", async () => {
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



test("the supplied Earth film plays behind an S trace followed by individual name letters", async () => {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"no-preference"});
  try {
    await page.goto(base + "/en/",{waitUntil:"domcontentloaded"});
    assert.equal(await page.locator(".cinematic-hero__video").count(),1);
    await page.waitForFunction(()=>document.querySelector(".cinematic-hero")?.dataset.motion==="running");
    const letters = page.locator(".cinematic-wordmark__letter");
    assert.equal(await letters.count(),9);
    assert.equal(await letters.last().evaluate(el=>Number(getComputedStyle(el).opacity)),0);
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector(".cinematic-wordmark__letter")).opacity)>.2);
    assert.ok(await letters.last().evaluate(el=>Number(getComputedStyle(el).opacity))<.15,"The final S must wait for earlier letters");
    await page.waitForFunction(()=>document.querySelector(".cinematic-hero")?.dataset.intro==="complete");
    assert.equal(await letters.last().evaluate(el=>Number(getComputedStyle(el).opacity)),1);
    const video=page.locator(".cinematic-hero__video");
    await page.waitForFunction(()=>{const v=document.querySelector(".cinematic-hero__video");return v.readyState>=2&&!v.paused&&v.currentTime>.1;});
    const info=await video.evaluate(v=>({path:new URL(v.currentSrc).pathname,width:v.videoWidth,height:v.videoHeight,duration:v.duration,muted:v.muted,inline:v.playsInline,loop:v.loop,time:v.currentTime}));
    assert.equal(info.path,"/video/hero/sain-earth.mp4");
    assert.equal(info.width,1920);assert.equal(info.height,1080);
    assert.ok(Math.abs(info.duration-16.068209)<.1);
    assert.ok(info.muted&&info.inline&&info.loop);
    assert.equal(await page.locator('.home-orbit-hero__motion').count(),0,'Background film has no pause control');
    await page.waitForFunction(time=>document.querySelector(".cinematic-hero__video").currentTime>time+.2,info.time);
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.cinematic-hero__video').paused);
    await page.locator('.home-orbit-hero').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>!document.querySelector('.cinematic-hero__video').paused);
  } finally {await page.close();}
});


test("the Sain Motors opening keeps the localized motto and static poster under reduced motion", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const locale of ["en", "mn"]) {
      const mediaRequests = [];
      const collect = request => { if (new URL(request.url()).pathname.endsWith(".mp4")) mediaRequests.push(request.url()); };
      page.on("request", collect);
      await page.goto(base + "/" + locale + "/", { waitUntil: "networkidle" });
      assert.equal(await page.locator(".home-orbit-hero").count(), 1);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("h1").getAttribute("aria-label"), "SAIN MOTORS");
      assert.equal(await page.locator(".home-video-hero, .home-brands, .brand-spotlight").count(), 0);
      assert.equal(await page.locator(".home-orbit-hero video").count(), 1);
      assert.deepEqual(mediaRequests, []);
      assert.equal(await page.locator(".home-orbit-hero__promise").innerText(),locale === "en" ? "A NEW CAR FOR MONGOLIANS" : "МОНГОЛ ХҮНД ШИНЭ МАШИН");
      assert.equal(await page.locator(".home-orbit-hero__description").count(),0);
      const down=page.locator('.home-orbit-hero__discover[href="#home-company"]');
      assert.equal(await down.count(),1);
      await down.click();
      await page.waitForFunction(()=>location.hash==="#home-company");
      const target=await page.locator("#home-company").boundingBox();
      assert.ok(target.y<130&&target.y>=0,"The restored link reaches the company section");
      page.off("request", collect);
    }
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

test("the opening remains legible on phone, tablet and desktop, with a static reduced-motion wordmark", async () => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 1000], [844, 390]]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + "/en/", { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      const hero = await page.locator(".home-orbit-hero").boundingBox();
      const motto = await page.locator(".home-orbit-hero__promise").boundingBox();
      assert.ok(motto.width > 140 && motto.y + motto.height <= hero.y + hero.height + 1);
      assert.ok(Math.abs(hero.y + hero.height - height) < 3 || height < 500, "The first screen fits the viewport unless it is short landscape");
      const wordmark = await page.locator("h1").boundingBox();
      assert.ok(wordmark.x >= 0 && wordmark.x + wordmark.width <= width + 1);
      assert.equal(await page.locator(".cinematic-hero").getAttribute("data-motion"), "reduced");
      assert.equal(await page.locator(".cinematic-hero").evaluate(el => el.getAnimations({subtree:true}).filter(a=>a.playState === "running").length), 0);
    }
  } finally { await page.close(); }
});

test("motion runs automatically only while the opening is visible", async () => {
  const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:"no-preference" });
  try {
    await page.goto(base + "/en/", {waitUntil:"networkidle"});
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
    assert.equal(await page.getByRole('button',{name:/Pause animation|Play animation/}).count(),0);
    await page.locator("#home-company").evaluate(el => el.scrollIntoView({block:"start"}));
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "paused");
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForFunction(() => document.querySelector(".cinematic-hero")?.dataset.motion === "running");
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
