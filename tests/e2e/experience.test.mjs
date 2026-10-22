import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base=process.env.BASE_URL??"http://localhost:3300";
test("news links show the correct sourced event and request film only after explicit playback",async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 try{
 const page=await browser.newPage();const videos=[];page.on("request",r=>{if(r.url().includes("/video/"))videos.push(r.url());});
 await page.goto(base+"/en/");assert.equal(videos.length,0);
 await page.locator('.news-card[href="/en/news/mega-test-drive-8/"]').click();await page.waitForURL("**/mega-test-drive-8/");
 assert.match(await page.locator("h1").textContent(),/8/);assert.match(await page.locator("main").textContent(),/Darkhan/);assert.equal(await page.locator("video").count(),0);
 await page.goto(base+"/en/news/mega-test-drive-7/");
 const film=page.locator("video");assert.equal(await film.getAttribute("preload"),"none");assert.equal(videos.length,0);
 assert.equal(await film.getAttribute("controls")!==null,true);assert.match(await film.locator("source").getAttribute("src"),/mtd7-full.mp4/);
 const request=page.waitForRequest(r=>r.url().includes("/video/mtd7-full.mp4"));
 await film.evaluate(v=>{void v.play().catch(()=>{})});await request;
 await page.waitForFunction(()=>document.querySelector("video").readyState>=2 || document.querySelector("video").error);
 assert.equal(await film.evaluate(v=>v.error),null);await film.evaluate(v=>v.pause());
 }finally{await browser.close();}
});
test("services keep static readable source coverage and a real training photo grid",async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 try{const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(base+"/en/services/");
 assert.equal(await page.locator(".service").count(),4);assert.equal(await page.locator(".service-photo-grid img").count(),6);
 assert.equal(await page.locator("#service-repair").count(),1);assert.equal(await page.locator("#service-centre").count(),1);
 assert.equal(await page.locator(".hscroll,canvas").count(),0);
 }finally{await browser.close();}
});
