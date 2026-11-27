import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const bydModels = ["ti-7", "atto-3", "shark-6", "sealion-6"];
const relyPrices = ["69900000", "74900000", "84900000", "89900000"];

test("RELY R8 displays its four prices and BYD model pages omit the price section", async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  try {
    for (const locale of ["mn", "en"]) {
      const page = await browser.newPage({ viewport: { width: locale === "mn" ? 390 : 1440, height: 844 } });
      try {
        const section = page.getByRole("region", { name: locale === "mn" ? "Үнэ ба бэлэн байдал" : "Price and availability" });
        const relyResponse = await page.goto(`${base}/${locale}/brands/rely/`);
        assert.equal(relyResponse.status(), 200);
        assert.equal(await section.count(), 1);
        assert.deepEqual(await section.locator("data").evaluateAll(amounts => amounts.map(amount => amount.value)), relyPrices);
        const action = section.getByRole("link", { name: locale === "mn" ? "Үнэ лавлах" : "Enquire about price" });
        assert.match(await action.getAttribute("href"), /^tel:/);
        assert.ok(await section.evaluate(node => node.scrollWidth <= node.clientWidth));

        for (const model of bydModels) {
          const response = await page.goto(`${base}/${locale}/brands/byd/${model}/`);
          assert.equal(response.status(), 200, model);
          assert.equal(await section.count(), 0, model);
          if (model !== "sealion-6") assert.equal(await page.locator("#byd-enquiry").count(), 1, model);
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});
