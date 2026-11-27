import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const models = [
  ["byd/ti-7", "#byd-enquiry", ["159900000"]],
  ["byd/atto-3", "#byd-enquiry", ["128900000"]],
  ["byd/shark-6", "#byd-enquiry", ["159900000"]],
  ["byd/sealion-6", "tel:", ["127900000"]],
  ["rely", "tel:", ["69900000", "74900000", "84900000", "89900000"]],
];

test("developed models display their purchase section and route shoppers to sales", async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  try {
    for (const locale of ["mn", "en"]) {
      const page = await browser.newPage({ viewport: { width: locale === "mn" ? 390 : 1440, height: 844 } });
      try {
        for (const [model, destination, prices] of models) {
          const response = await page.goto(`${base}/${locale}/brands/${model}/`);
          assert.equal(response.status(), 200, model);
          const section = page.getByRole("region", { name: locale === "mn" ? "Үнэ ба бэлэн байдал" : "Price and availability" });
          assert.equal(await section.count(), 1, model);
          assert.deepEqual(await section.locator("data").evaluateAll(amounts => amounts.map(amount => amount.value)), prices, model);
          const action = section.getByRole("link", { name: locale === "mn" ? "Үнэ лавлах" : "Enquire about price" });
          const href = await action.getAttribute("href");
          assert.ok(href.startsWith(destination), model);
          if (href.startsWith("#")) assert.equal(await page.locator(href).count(), 1, model);
          assert.ok(await section.evaluate(node => node.scrollWidth <= node.clientWidth), model);
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
});
