import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright-core';
const base=process.env.BASE_URL??'http://localhost:3200';
const executablePath='C:/Program Files/Google/Chrome/Application/chrome.exe';
const endpoint='**/functions/v1/submit-feedback';

test('feedback validates and submits a stored request in both languages and at every size',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});const bodies=[];
  await fs.mkdir('.tmp-assets/contact-feedback-send',{recursive:true});
  await page.route(endpoint,route=>{bodies.push(route.request().postDataJSON());return route.fulfill({status:201,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({id:'00000000-0000-4000-8000-000000000001'})});});
  for(const locale of ['mn','en'])for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/${locale}/contact/`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.feedback-submit').textContent(),locale==='mn'?'Илгээх':'Send');
   assert.equal(await page.locator('.feedback-form input[type=radio]').count(),3);
   assert.equal(await page.locator('.feedback-notice,.feedback-email-draft').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   if(width>=768){
    const intro=await page.locator('.feedback-intro').boundingBox();
    const form=await page.locator('.feedback-form').boundingBox();
    const fields=await page.locator('.feedback-fields').boundingBox();
    const comments=await page.locator('.feedback-comments').boundingBox();
    assert.ok(intro.x+intro.width<=form.x+1,'Introduction remains to the left of the form');
    assert.ok(fields.x+fields.width<=comments.x+1,'Comments remain in the second form column');
   }
   if([390,1440].includes(width))await page.screenshot({path:`.tmp-assets/contact-feedback-send/${locale}-${width}.png`,fullPage:true});
   const before=bodies.length;
   await page.locator('.feedback-submit').click();assert.equal(bodies.length,before);
   assert.equal(await page.locator('#feedback-name').evaluate(el=>el===document.activeElement),true);
   await page.locator('#feedback-name').fill('Synthetic QA');await page.locator('#feedback-phone').fill('123');
   await page.locator('.feedback-submit').click();assert.equal(await page.locator('#feedback-phone-error').isVisible(),true);
   await page.locator('#feedback-phone').fill('00000000');await page.locator('#feedback-comment').fill('Synthetic feedback check');
   await page.locator('#feedback-showroom').selectOption({index:1});const showroom=await page.locator('#feedback-showroom').inputValue();
   await page.locator('.feedback-submit').click();assert.equal(await page.locator('#feedback-consent-error').isVisible(),true);assert.equal(bodies.length,before);
   await page.locator('#feedback-consent').check();await page.locator('.feedback-submit').click();
   await page.locator('.feedback-success').waitFor();
   assert.equal(bodies.length,before+1);
   assert.deepEqual(bodies.at(-1),{audience:'client',name:'Synthetic QA',phone:'+97600000000',showroom,message:'Synthetic feedback check',consent:true,locale,website:''});
   assert.equal(await page.locator('#feedback-success-heading').evaluate(el=>el===document.activeElement),true);
   await page.locator('.feedback-again').click();assert.equal(await page.locator('#feedback-name').inputValue(),'');
   assert.equal(await page.locator('#feedback-consent').isChecked(),false);
  }
  const noJs=await browser.newPage({javaScriptEnabled:false});await noJs.goto(`${base}/en/contact/`);
  assert.equal(await noJs.locator('.feedback-submit').isDisabled(),true);
  assert.ok(await noJs.locator('a[href="mailto:marketing2@esain.mn"]').count()>0);
 }finally{await browser.close();}
});

test('pending submissions cannot duplicate; server errors preserve data and never show false success',async()=>{
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  let release;const pending=new Promise(resolve=>release=resolve);let calls=0;
  await page.route(endpoint,async route=>{calls++;if(calls===1)await pending;return route.fulfill({status:calls===1?503:201,contentType:'application/json',body:JSON.stringify(calls===2?{}:calls===3?{id:'saved-request'}:{error:'Unavailable'})});});
  await page.goto(`${base}/en/contact/`,{waitUntil:'networkidle'});
  await page.locator('#feedback-name').fill('Synthetic retry');await page.locator('#feedback-phone').fill('00000000');await page.locator('#feedback-comment').fill('Keep this message');await page.locator('#feedback-consent').check();
  await page.locator('.feedback-submit').click();await page.waitForFunction(()=>document.querySelector('.feedback-form').dataset.state==='sending');
  assert.equal(await page.locator('.feedback-submit').isDisabled(),true);assert.equal(await page.locator('#feedback-name').isDisabled(),true);
  await page.locator('.feedback-form').evaluate(form=>form.requestSubmit());assert.equal(calls,1);
  release();await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('#feedback-name').inputValue(),'Synthetic retry');assert.equal(await page.locator('#feedback-comment').inputValue(),'Keep this message');assert.equal(await page.locator('.feedback-success').count(),0);
  await page.locator('.feedback-submit').click();await page.waitForFunction(()=>document.querySelector('.feedback-form').dataset.state==='error');assert.equal(await page.locator('.feedback-success').count(),0);
  await page.locator('.feedback-submit').click();await page.locator('.feedback-success').waitFor();assert.equal(calls,3);
 }finally{await browser.close();}
});
