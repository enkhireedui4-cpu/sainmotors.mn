import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const base=process.env.BASE_URL??'http://localhost:3200';
const executablePath=process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
const names=['BYD','FAW HONGQI','CHERY','JETOUR','FAW BESTUNE','AITO','MAXUS','SOUEAST','212','RIDDARA','CHERY RELY'];

test('About shows the company, all eleven linked brands and onward service routes at every size',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  for(const locale of ['mn','en'])for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});
   await page.goto(`${base}/${locale}/about/`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('.about-story__team').count(),0,'Requested team portrait has been removed');
   assert.equal(await page.locator('.about-network__logo').count(),0,'Requested oversized SAIN Motors logo has been removed');
   assert.equal(await page.locator('.about-network #about-statement').count(),1,'Introduction and brands share one cinematic section');
   assert.equal(await page.locator('.about-film video').count(),1);
   assert.equal(await page.locator('.about-film video').getAttribute('src'),null,'Reduced motion does not download a film');
   assert.equal(await page.locator('.about-film__toggle').isVisible(),false);
   assert.equal(await page.locator('.page-band').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
   assert.equal(await page.locator('#about-statement').textContent(),locale==='mn'?'SAIN Motors нь 11 автомашины брэндийг нэгтгэсэн групп компани юм.':'SAIN Motors is a group company bringing together 11 automotive brands.');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${locale} ${width}`);
   const links=page.locator('.about-network__brands a');
   assert.deepEqual(await links.evaluateAll(items=>items.map(el=>el.getAttribute('aria-label'))),names);
   assert.equal(await page.locator('.about-network__brands a[aria-label="JETOUR"]').getAttribute('href'),'https://jetour.mn/');
   assert.equal(await page.locator('.about-network__brands a[aria-label="CHERY"]').getAttribute('href'),'https://chery.mn/');
   assert.equal(await page.locator('.about-network__brands a[aria-label="BYD"]').getAttribute('href'),`/${locale}/brands/byd/`);
   const rectangles=await links.evaluateAll(items=>items.map(el=>{const r=el.getBoundingClientRect();return {y:r.y,w:r.width,h:r.height};}));
   const rows=[...new Set(rectangles.map(r=>r.y))].map(y=>rectangles.filter(r=>r.y===y).length);
   assert.deepEqual(rows,width<768?[2,2,2,2,2,1]:width<1024?[4,4,3]:[6,5]);
   assert.ok(rectangles.every(r=>r.h>=44&&r.w>=44));
   await links.first().focus();
   assert.equal(await links.first().evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
   await page.locator('.about-care').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>[...document.querySelectorAll('.corporate-about img')].every(img=>img.complete&&img.naturalWidth>0));
   await page.locator('.corporate-about img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.equal(await page.locator(`.about-care a[href="/${locale}/locations/"]`).count(),1);
   assert.equal(await page.locator(`.about-care a[href="/${locale}/services/"]`).count(),1);
   if([390,1920].includes(width)){
    await links.first().blur();
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`.tmp-assets/about-${locale}-${width}.png`,fullPage:true});
   }
  }
  const staticPage=await browser.newPage({javaScriptEnabled:false});
  await staticPage.goto(`${base}/en/about/`);
  assert.equal(await staticPage.locator('.about-network__brands a').count(),11);
  assert.equal(await staticPage.locator('.about-care a').count(),2);
  assert.equal(await staticPage.locator('.about-film__poster').isVisible(),true);
  assert.equal(await staticPage.locator('.about-film__toggle').isVisible(),false);
 }finally{await browser.close();}
});

test('About film plays silently, supports pause/resume and suspends offscreen',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  await page.goto(`${base}/en/about/`);
  const video=page.locator('.about-film video');
  const toggle=page.locator('.about-film__toggle');
  await page.waitForFunction(()=>{const v=document.querySelector('.about-film video');return v.readyState>=2&&!v.paused&&v.currentTime>.1;});
  const media=await video.evaluate(v=>({src:v.currentSrc,width:v.videoWidth,height:v.videoHeight,duration:v.duration,muted:v.muted,loop:v.loop,audio:v.captureStream().getAudioTracks().length}));
  assert.ok(media.src.endsWith('showroom-desktop.mp4'));
  assert.equal(media.width,1280);assert.equal(media.height,720);
  assert.ok(media.duration>14&&media.duration<20);
  assert.equal(media.muted,true);assert.equal(media.loop,true);assert.equal(media.audio,0);
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-label'),'Play background video');
  assert.equal(await video.evaluate(v=>v.paused),true);
  const stoppedAt=await video.evaluate(v=>v.currentTime);
  await page.waitForTimeout(300);
  assert.ok(Math.abs(await video.evaluate(v=>v.currentTime)-stoppedAt)<.08);
  await toggle.click();
  await page.waitForFunction(()=>!document.querySelector('.about-film video').paused);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('.about-film video').paused);
  await page.locator('.about-network').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>!document.querySelector('.about-film video').paused);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await video.evaluate(v=>v.paused),true);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(()=>!document.querySelector('.about-film video').paused);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.about-film video').paused);
  assert.equal(await toggle.isVisible(),false);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>{const v=document.querySelector('.about-film video');return v.currentSrc.endsWith('showroom-mobile.mp4')&&v.readyState>=2&&!v.paused;});
  assert.equal(await video.evaluate(v=>v.videoWidth),540);
  assert.equal(await video.evaluate(v=>v.videoHeight),960);
 }finally{await browser.close();}
});

test('About retains its poster and links when video fails or save-data is enabled',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const failed=await browser.newPage({reducedMotion:'no-preference'});
  await failed.route('**/video/about/*.mp4',route=>route.abort());
  await failed.goto(`${base}/en/about/`);
  await failed.waitForFunction(()=>document.querySelector('.about-film').dataset.media==='fallback');
  assert.equal(await failed.locator('.about-film__poster').isVisible(),true);
  assert.equal(await failed.locator('.about-film__toggle').isVisible(),false);
  assert.equal(await failed.locator('.about-network__brands a').count(),11);
  const saveData=await browser.newPage({reducedMotion:'no-preference'});
  await saveData.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
  await saveData.goto(`${base}/mn/about/`,{waitUntil:'networkidle'});
  assert.equal(await saveData.locator('.about-film video').getAttribute('src'),null);
  assert.equal(await saveData.locator('.about-film__toggle').isVisible(),false);
  assert.equal(await saveData.locator('.about-film__poster').isVisible(),true);
 }finally{await browser.close();}
});
