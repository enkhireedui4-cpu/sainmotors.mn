import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base=process.env.BASE_URL??"http://localhost:3300";
test("all eleven logo destinations are visible and keyboard reachable at phone and desktop sizes",async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 try {
 const page=await browser.newPage();
 for(const locale of ["mn","en"]) for(const width of [360,768,1440,1920]){
  await page.setViewportSize({width,height:900});await page.goto(base+"/"+locale+"/");
  const links=page.locator("[data-brand-directory] a");assert.equal(await links.count(),11);
  for(const link of await links.all()){
   await link.focus();
   const box=await link.boundingBox();assert.ok(box&&box.width>48&&box.height>48);
   assert.equal(await link.evaluate(e=>e===document.activeElement),true);
   assert.ok((await link.getAttribute("href")).includes("/brands/"));
  }
 }
 } finally{await browser.close();}
});
test("brand index presents all eleven logos as direct destinations without hover activation",async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 try{const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(base+"/en/brands/");assert.equal(await page.locator("[data-brand-directory] a").count(),11);
 assert.equal(await page.locator("[data-brand-directory] a img[alt=\"\"]").count(),11);
 await page.locator('[data-brand-directory] a[aria-label="SOUEAST"]').click();await page.waitForURL("**/en/brands/soueast/");
 assert.ok(await page.locator("main a[href^=tel]").count()>0);
 }finally{await browser.close();}
});
