import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base=process.env.BASE_URL??'http://localhost:3300';
test('brand strip moves, pauses by choice/hover/focus, and respects reduced motion without duplicate destinations',async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  await page.goto(base+'/mn/');
  await page.locator('.brand-marquee[data-ready=true]').waitFor();
  const track=page.locator('.brand-marquee [data-brand-directory] li').first(), viewport=page.locator('.brand-marquee__viewport');
  assert.equal(await page.locator('[data-brand-directory] a').count(),11);
  assert.equal(await page.locator('.brand-marquee__duplicate a').count(),0);
  await viewport.scrollIntoViewIfNeeded();
  const first=await track.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(250);
  assert.notEqual(await track.evaluate(el=>getComputedStyle(el).transform),first);
  await viewport.hover();
  assert.equal(await track.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await page.mouse.move(1,1);
  assert.equal(await page.locator('.brand-marquee button').count(),0);
  await viewport.focus();
  await page.keyboard.press('Space');
  await page.locator('.site-logo').focus();
  assert.equal(await page.locator('.brand-marquee').getAttribute('data-paused'),'true');
  assert.equal(await track.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await viewport.focus();
  await page.keyboard.press('Space');
  await page.locator('[data-brand-directory] a').last().focus();
  assert.equal(await track.evaluate(el=>getComputedStyle(el).animationName),'none');
  const box=await page.locator('[data-brand-directory] a').last().boundingBox();
  const frame=await viewport.boundingBox();
  assert.ok(box.x>=frame.x-1&&box.x+box.width<=frame.x+frame.width+1,'keyboard reaches the last logo');
  await page.setViewportSize({width:390,height:844});
  assert.equal(await track.evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('.brand-marquee__duplicate').isVisible(),false);
  const links=page.locator('[data-brand-directory] a');
  const row=await Promise.all([0,1,2,3,9,10].map(i=>links.nth(i).boundingBox()));
  assert.ok(Math.abs(row[0].y-row[2].y)<1&&row[3].y>row[0].y,'phone keeps three columns');
  const viewportBox=await viewport.boundingBox();
  assert.ok(Math.abs((row[4].x+row[5].x+row[5].width)/2-(viewportBox.x+viewportBox.width/2))<2,'final two logos centred');
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await track.evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('.brand-marquee__duplicate').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  for(const link of await page.locator('[data-brand-directory] a').all())assert.equal(await link.getAttribute('title'),await link.getAttribute('aria-label'));
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/mn/');
  await page.locator('.brand-marquee[data-ready=true]').waitFor();
  await page.locator('.brand-marquee__viewport').hover();
  await page.locator('[data-brand-directory] a').nth(2).click();
  await page.waitForURL('**/mn/brands/chery/');

 } finally {await browser.close();}
});

test('every sequential Tab reveals the complete focused brand at tablet and desktop widths',async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page=await browser.newPage({reducedMotion:'no-preference'});
  for(const width of [768,1440]) {
   await page.setViewportSize({width,height:1000});
   await page.goto(base+'/mn/');
   const viewport=page.locator('.brand-marquee__viewport');
   await page.locator('.brand-marquee[data-ready=true]').waitFor();
   await viewport.focus();
   const links=page.locator('[data-brand-directory] a');
   for(let i=0;i<11;i++){
    await page.keyboard.press('Tab');
    await page.waitForTimeout(40);
    assert.ok(await links.nth(i).evaluate(el=>el===document.activeElement));
    const box=await links.nth(i).boundingBox(),frame=await viewport.boundingBox();
    assert.ok(box.x>=frame.x-1&&box.x+box.width<=frame.x+frame.width+1,'complete focused logo '+i+' at '+width);
   }
  }
 }finally{await browser.close();}
});
