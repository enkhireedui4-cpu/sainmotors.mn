import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const base=process.env.BASE_URL??'http://localhost:3200';
test('feedback is responsive, validates consent and prepares an email with the chosen showroom',async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{const page=await browser.newPage({reducedMotion:'reduce'});
  await page.addInitScript(()=>{
   const click=HTMLAnchorElement.prototype.click;
   HTMLAnchorElement.prototype.click=function(){
    if(this.protocol==='mailto:'){window.__emailDraft=this.href;return;}
    return click.call(this);
   };
  });
  for(const locale of ['mn','en'])for(const width of [320,390,768,1024,1920]){
   await page.setViewportSize({width,height:960});await page.goto(`${base}/${locale}/contact/`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.feedback-form input[type=radio]').count(),3);
   assert.equal(await page.locator('#feedback-heading').textContent(),locale==='mn'?'SAIN Motors-той холбогдох':'Get in touch with SAIN Motors');
   assert.equal(await page.locator('.feedback-submit').textContent(),locale==='mn'?'Имэйлийн ноорог нээх':'Open email draft');
   assert.equal(await page.locator('#feedback-showroom option:checked').textContent(),locale==='mn'?'Салбар сонгох':'Select a showroom');
   assert.equal(await page.locator('#feedback-comment').getAttribute('placeholder'),locale==='mn'?'Асуулт, санал хүсэлтээ бичнэ үү.':'Tell us how we can help.');
   assert.equal(await page.locator('.feedback-action .feedback-notice + .feedback-submit').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('.feedback-submit').click();assert.ok(await page.locator('.feedback-error:visible').count()>0);
   assert.equal(await page.locator('#feedback-name').evaluate(e=>e===document.activeElement),true);
   await page.locator('#feedback-name').fill('Synthetic QA');await page.locator('#feedback-phone').fill('00000000');
   await page.locator('#feedback-comment').fill('Synthetic feedback check');
   await page.locator('#feedback-showroom').selectOption({index:1});
   const place=await page.locator('#feedback-showroom option:checked').textContent();
   await page.locator('.feedback-submit').click();assert.equal(await page.locator('#feedback-consent-error').isVisible(),true);
   assert.equal(await page.evaluate(()=>window.__emailDraft),undefined);
   await page.locator('#feedback-consent').check();await page.locator('.feedback-submit').click();
   const href=await page.locator('.feedback-email-draft').getAttribute('href');
   assert.equal(await page.evaluate(()=>window.__emailDraft),href);
   assert.ok(href.startsWith('mailto:marketing2@esain.mn?'));
   const body=new URL(href).searchParams.get('body');assert.ok(body.includes('Synthetic QA')&&body.includes('00000000')&&body.includes('Synthetic feedback check')&&body.includes(place));
   await page.locator('#feedback-name').fill('Updated QA');assert.equal(await page.locator('.feedback-email-draft').count(),0);
  }
  const staticPage=await browser.newPage({javaScriptEnabled:false});await staticPage.goto(`${base}/en/contact/`);
  assert.equal(await staticPage.locator('.feedback-submit').isDisabled(),true);
  assert.ok(await staticPage.locator('a[href="mailto:marketing2@esain.mn"]').count()>0);
 }finally{await browser.close();}
});
