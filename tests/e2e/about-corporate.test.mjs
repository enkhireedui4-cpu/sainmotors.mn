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
   assert.equal(await page.locator('.about-network .about-film video').count(),1);
   assert.equal(await page.locator('.about-network .about-film video').getAttribute('src'),null,'Reduced motion does not download a film');
   assert.equal(await page.locator('.about-network .about-film__toggle').isVisible(),false);
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
   assert.equal(await page.locator('.about-care figure').count(),3,'Reference has three floating car photos');
   assert.equal(await page.locator('.about-purpose__panel').count(),4,'Mission, vision, diagram and values');
   assert.equal(await page.locator('.about-purpose__values li').count(),5);
   assert.equal(await page.locator('[class*="award"]').count(),0,'Awards are intentionally omitted');
   const panels=await page.locator('.about-purpose__panel').evaluateAll(items=>items.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,scrollHeight:el.scrollHeight,height:el.clientHeight};}));
   if(width>=768){assert.equal(panels[0].y,panels[1].y);assert.equal(panels[2].y,panels[3].y);assert.ok(Math.abs(panels[0].w-width/2)<1);}
   else{assert.ok(panels.every(r=>Math.abs(r.w-width)<1));assert.ok(panels.every((r,i)=>i===0||r.y>=panels[i-1].y+panels[i-1].h-1));}
   assert.ok(panels.every(r=>r.scrollHeight<=r.height+1),'Panel copy fits without clipping');
   for(const section of ['.about-care','.about-mission','.about-vision','.about-diagram','.about-purpose__values'])await page.locator(section).scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>[...document.querySelectorAll('.corporate-about img')].every(img=>!img.getClientRects().length||(img.complete&&img.naturalWidth>0)));
   await page.locator('.corporate-about img:visible').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
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
  assert.equal(await staticPage.locator('.about-network .about-film__poster').isVisible(),true);
  assert.equal(await staticPage.locator('.about-network .about-film__toggle').isVisible(),false);
  assert.equal(await staticPage.locator('.about-purpose__panel h2').count(),4);
  assert.equal(await staticPage.locator('.about-care h2').isVisible(),true);
  assert.ok(await staticPage.locator('.about-care h2 span').evaluateAll(words=>words.every(word=>getComputedStyle(word).opacity==='1')));
 }finally{await browser.close();}
});

test('About film plays silently, supports pause/resume and suspends offscreen',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  await page.goto(`${base}/en/about/`);
  const video=page.locator('.about-network .about-film video');
  const toggle=page.locator('.about-network .about-film__toggle');
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
  await page.locator('.about-diagram').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const v=document.querySelector('.about-diagram video');return v.readyState>=2&&!v.paused&&v.currentTime>.1;});
  assert.equal(await video.evaluate(v=>v.paused),true,'Top film pauses while diagram film is visible');
  await page.locator('.about-diagram .about-film__toggle').click();
  assert.equal(await page.locator('.about-diagram video').evaluate(v=>v.paused),true);
 }finally{await browser.close();}
});

test('philosophy fills as it scrolls and longer replacement text grows the panels',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  await page.goto(`${base}/en/about/`,{waitUntil:'networkidle'});
  const heading=page.locator('#about-care-heading');
  await heading.evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.6,behavior:'instant'}));
  await page.waitForFunction(()=>{const values=[...document.querySelectorAll('#about-care-heading span')].map(el=>Number(getComputedStyle(el).opacity));return values.some(value=>value<.5)&&values.some(value=>value===1);});
  await heading.evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.15,behavior:'instant'}));
  await page.waitForFunction(()=>[...document.querySelectorAll('#about-care-heading span')].every(el=>getComputedStyle(el).opacity==='1'));
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});
   await page.locator('.about-purpose__copy p').evaluateAll(paragraphs=>paragraphs.forEach(p=>p.textContent=p.textContent.repeat(3)));
   assert.ok(await page.locator('.about-purpose__panel').evaluateAll(panels=>panels.every(panel=>panel.scrollHeight<=panel.clientHeight+1)),'Long replacement copy remains fully inside growing panels');
  }
 }finally{await browser.close();}
});

test('About retains its poster and links when video fails or save-data is enabled',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const failed=await browser.newPage({reducedMotion:'no-preference'});
  await failed.route('**/video/about/*.mp4',route=>route.abort());
  await failed.goto(`${base}/en/about/`);
  await failed.waitForFunction(()=>document.querySelector('.about-film').dataset.media==='fallback');
  assert.equal(await failed.locator('.about-network .about-film__poster').isVisible(),true);
  assert.equal(await failed.locator('.about-network .about-film__toggle').isVisible(),false);
  assert.equal(await failed.locator('.about-network__brands a').count(),11);
  const saveData=await browser.newPage({reducedMotion:'no-preference'});
  await saveData.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
  await saveData.goto(`${base}/mn/about/`,{waitUntil:'networkidle'});
  assert.equal(await saveData.locator('.about-network .about-film video').getAttribute('src'),null);
  assert.equal(await saveData.locator('.about-network .about-film__toggle').isVisible(),false);
  assert.equal(await saveData.locator('.about-network .about-film__poster').isVisible(),true);
 }finally{await browser.close();}
});
