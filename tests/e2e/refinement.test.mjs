import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base=process.env.BASE_URL??"http://localhost:3300";
test("reduced motion removes interaction transitions and home never autoplays media",async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 try{const page=await browser.newPage({reducedMotion:"reduce"});
 await page.goto(base+"/mn/");assert.equal(await page.locator("video[autoplay],canvas").count(),0);
 assert.equal(await page.locator(".button").first().evaluate(e=>getComputedStyle(e).transitionDuration),"0s");
 const title=await page.locator("h1").textContent();await page.waitForTimeout(500);assert.equal(await page.locator("h1").textContent(),title);
 }finally{await browser.close();}
});
