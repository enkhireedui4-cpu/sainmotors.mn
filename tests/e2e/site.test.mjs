import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3300";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sainmotors.mn";
const BRANDS = ["jetour","soueast","chery","byd","riddara","aito","212","bestune","rely","maxus","hongqi"];
const paths = ["","about/","brands/","services/","locations/","news/","contact/","privacy/",...BRANDS.map(s=>"brands/"+s+"/"),...[8,7,6].map(n=>"news/mega-test-drive-"+n+"/")];
let browser;
before(async()=>{ browser=await chromium.launch({executablePath:process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"}); });
after(async()=>{await browser?.close();});

test("every MN/EN page has one h1, canonical, reciprocal language links and review noindex",async()=>{
 const page=await browser.newPage();
 for(const locale of ["mn","en"]) for(const path of paths){
  const url=BASE+"/"+locale+"/"+path;
  const response=await page.goto(url);
  assert.equal(response.status(),200,url);
  assert.equal(await page.locator("h1").count(),1,url);
  assert.equal(await page.locator("html").getAttribute("lang"),locale,url);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),SITE+"/"+locale+"/"+path,url);
  for(const language of ["mn","en"]) assert.equal(await page.locator('link[rel=alternate][hreflang="'+language+'"]').getAttribute("href"),SITE+"/"+language+"/"+path,url);
  assert.match(await page.locator('meta[name=robots]').getAttribute("content"),/noindex/,url);
 }
 await page.close();
});

test("all layouts fit 360, 390, 768, 1440 and 1920 and show no broken assets or runtime errors",async()=>{
 const page=await browser.newPage(); const errors=[];
 page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error") errors.push(m.text());});
 for(const locale of ["mn","en"]) for(const width of [360,390,768,1440,1920]){
  await page.setViewportSize({width,height:900});
  for(const path of ["","brands/","brands/byd/","brands/soueast/","about/","services/","contact/","privacy/","news/","news/mega-test-drive-7/"]){
   await page.goto(BASE+"/"+locale+"/"+path);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,locale+path+width);
   await page.locator("footer").scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>[...document.images].every(i=>i.loading==="lazy"&&!i.complete || i.complete&&i.naturalWidth>0));
   const broken=await page.locator("img").evaluateAll(images=>images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));
   assert.deepEqual(broken,[],locale+path+width);
  }
 }
 assert.deepEqual(errors,[]);await page.close();
});

test("native mobile menu supports Escape, return focus, real route selection and active section",async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(BASE+"/en/");
 const button=page.getByRole("button",{name:"Menu",exact:true});await button.click();
 assert.equal(await page.locator("#mobile-menu").evaluate(d=>d.open),true);
 // aria-expanded follows the dialog's close event, so wait for it instead of reading it in the same tick.
 await page.keyboard.press("Escape");await page.waitForFunction(()=>{const b=document.querySelector(".menu-button");return b?.getAttribute("aria-expanded")==="false"&&b===document.activeElement;},null,{timeout:2000});
 assert.equal(await button.getAttribute("aria-expanded"),"false");assert.equal(await button.evaluate(b=>b===document.activeElement),true);
 await button.click();await page.locator("#mobile-menu").getByRole("link",{name:"Locations",exact:true}).click();
 await page.waitForURL("**/en/locations/");assert.equal(await page.locator("#mobile-menu").evaluate(d=>d.open),false);
 await page.close();
});

test("language switching retains every brand and news route",async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 for(const path of [...BRANDS.map(s=>"brands/"+s+"/"),"news/mega-test-drive-7/"]){
  await page.goto(BASE+"/mn/"+path);
  await page.locator(".site-header__inner > .lang-switch a[lang=en]").click();
  await page.waitForURL(BASE+"/en/"+path);assert.equal(await page.locator("html").getAttribute("lang"),"en");
 }
 await page.close();
});

test("all brand pages retain real sales channels and sourced model galleries",async()=>{
 const page=await browser.newPage();
 for(const brand of BRANDS){
  await page.goto(BASE+"/mn/brands/"+brand+"/");
  assert.ok(await page.locator("main a[href^='tel:+976']").count()>0,brand);
  assert.equal(await page.locator(".brand-hero__identity img").count(),1,brand);
  for(const href of await page.locator("a.brand-link").evaluateAll(a=>a.map(x=>x.href))) assert.ok(href.startsWith("https://"));
  assert.equal(await page.locator(".brand-hero__image img").count(),1,brand);
 }
 await page.goto(BASE+"/en/brands/chery/");
 assert.ok(await page.locator("main").textContent().then(t=>t.includes("09:00")));
 assert.ok(await page.locator('a[href*="47.904448"]').count()>0);
 await page.close();
});

test("unknown addresses return the bilingual 404 with working home routes",async()=>{
 const page=await browser.newPage();const response=await page.goto(BASE+"/does-not-exist/");
 assert.equal(response.status(),404);assert.equal(await page.locator("h1").count(),1);
 assert.equal(await page.locator('a[href="/mn/"]').count()>0,true);assert.equal(await page.locator('a[href="/en/"]').count()>0,true);
 await page.close();
});
