import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3200";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

test("catalogue navigation, brand filters and all card destinations work in both languages", async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  try {
    for (const locale of ["en", "mn"]) {
      const mobile = locale === "mn";
      await page.setViewportSize({ width: mobile ? 390 : 1440, height: 900 });
      await page.goto(base + "/" + locale + "/about/");
      if (mobile) await page.locator(".menu-button").click();
      const menu = page.locator(mobile ? "#mobile-menu" : ".site-nav");
      const menuLinks = await menu.getByRole("link").evaluateAll(links => links.map(link => link.pathname));
      const brandsIndex = menuLinks.indexOf("/" + locale + "/brands/");
      assert.ok(brandsIndex >= 0);
      assert.equal(menuLinks[brandsIndex + 1], "/" + locale + "/brochures/");
      await menu.getByRole("link", { name: mobile ? "Каталог" : "Catalogue", exact: true }).click();
      await page.waitForURL("**/" + locale + "/brochures/");
      await page.getByRole("heading", { level: 1, name: mobile ? "Автомашины каталог" : "Vehicle catalogue" }).waitFor();
      assert.deepEqual(await page.locator(".brochure-section-menu a").allTextContents(),
        mobile ? ["Загварууд", "Түгээмэл асуулт"] : ["Models", "FAQs"]);

      const groups = page.locator(".brochure-group");
      await groups.first().waitFor();
      assert.equal(await groups.count(), 10);
      const firstBrands = ["BYD", "CHERY", "JETOUR"];
      assert.deepEqual((await groups.locator("h3").allTextContents()).slice(0, 3), firstBrands);
      assert.deepEqual((await page.locator(".brochure-filters__options button").allTextContents()).slice(1, 4), firstBrands);
      assert.equal(await page.locator("#catalog-hongqi").count(), 0);
      assert.equal(await page.getByRole("searchbox").count(), 0);
      assert.equal(await page.getByText(mobile ? "PDF хараахан нэмэгдээгүй" : "PDF not yet available", { exact: true }).count(), 0);
      const cards = page.locator(".brochure-card");
      assert.ok(await cards.count() >= 36);
      assert.deepEqual(await page.locator("#catalog-chery + ul h4").allTextContents(), ["TIGGO 4", "TIGGO 7"]);
      const tiggo7 = cards.filter({ has: page.getByRole("heading", { name: "TIGGO 7", exact: true }) });
      assert.equal(await tiggo7.locator("img").getAttribute("src"), "/brochure-vehicles/cutouts/chery-tiggo-7-white.webp");
      const rd6TwoWheelDrive = page.locator("#catalog-riddara + ul .brochure-card").filter({ has: page.getByText("2WD", { exact: true }) });
      assert.equal(await rd6TwoWheelDrive.count(), 1);
      assert.equal(await rd6TwoWheelDrive.locator(".brochure-card__media img").count(), 0);
      assert.equal(await rd6TwoWheelDrive.locator(".brochure-card__media").textContent(), "");
      assert.equal(await rd6TwoWheelDrive.locator("a.button--primary[target='_blank']").count(), 1);
      assert.equal(await page.locator(".brochure-card__media").count(), await cards.count());
      assert.ok((await page.locator(".brochure-card__media img").evaluateAll(images =>
        images.map(image => image.width > 0 && image.getAttribute("width") === "900" && image.getAttribute("height") === "560")
      )).every(Boolean));
      assert.ok((await cards.evaluateAll(items => items.map(card => {
        const brochure = card.querySelector("a.button--primary");
        const model = card.querySelector(".brochure-model-link");
        return brochure && model && (model.tagName === "BUTTON" || brochure.href !== model.href);
      }))).every(Boolean));
      assert.deepEqual(await page.locator('#catalog-byd + ul .brochure-model-link').evaluateAll(links => links.map(link => link.pathname)),
        ["ti-7", "shark-6", "atto-3", "sealion-6"].map(id => "/" + locale + "/brands/byd/" + id + "/"));
      assert.equal(await page.locator('#catalog-rely + ul .brochure-model-link').getAttribute("href"), "/" + locale + "/brands/rely/");
      const brand212 = page.locator('#catalog-212 + ul');
      assert.deepEqual(await brand212.locator("h4").allTextContents(), ["212", "212", "Adventurer", "T01", "Pickup", "Highland"]);
      assert.equal(await brand212.locator('a[target="_blank"][href="/brochures/212-longwind/brochure.pdf"]').count(), 2);
      assert.equal(await brand212.locator('a[target="_blank"][href="/brochures/212-adventurer/brochure.pdf"]').count(), 1);
      const pickup = brand212.locator(".brochure-card").filter({ has: page.getByRole("heading", { name: "Pickup", exact: true }) });
      const pickupPdf = pickup.locator('a[target="_blank"][href="/brochures/212-pickup-diesel/brochure.pdf"]');
      assert.equal(await pickupPdf.count(), 1);
      assert.equal(await pickupPdf.getAttribute("download"), null);
      const pickupResponse = await page.request.head(base + await pickupPdf.getAttribute("href"));
      assert.equal(pickupResponse.status(), 200);
      assert.match(pickupResponse.headers()["content-type"], /application\/pdf/);
      assert.deepEqual(await page.locator("#catalog-bestune + ul h4").allTextContents(), ["T77", "T90", "T99", "B70", "NAT"]);
      for (const [brand, models] of [
        ["jetour", ["t2", "t1", "x50", "t1-phev", "t2-phev", "g700", "x70-plus", "x1"]],
        ["soueast", ["s06", "s07", "s08"]],
        ["bestune", ["t77", "t90", "t99", "b70", "nat"]],
        ["212", ["longwind", "longwind", "adventurer", "pickup-diesel", "highland"]],
      ]) {
        const urls = await page.locator(`#catalog-${brand} + ul a.button--primary[target="_blank"]`).evaluateAll(links =>
          links.map(link => link.pathname));
        assert.deepEqual(urls, models.map(id => `/brochures/${brand}-${id}/brochure.pdf`));
        for (const url of new Set(urls)) {
          const response = await page.request.get(base + url, { headers: { Range: "bytes=0-4" } });
          assert.equal(response.status(), 206, url);
          assert.match(response.headers()["content-type"], /application\/pdf/, url);
          assert.equal((await response.body()).toString("ascii"), "%PDF-", url);
          await response.dispose();
        }
      }
      const aito = page.locator("#catalog-aito + ul .brochure-card");
      const aitoNames = ["AITO 5", "AITO 7", "AITO 9"];
      assert.deepEqual(await aito.locator("h4").allTextContents(), aitoNames);
      assert.equal(await aito.first().locator("img").getAttribute("src"), "/brochure-vehicles/cutouts/aito-5-red.webp");
      assert.deepEqual(await aito.locator("a.button--primary").evaluateAll(links =>
        links.map(link => link.getAttribute("aria-label").split(" · ").at(-1))), aitoNames);
      const g700 = cards.filter({ has: page.getByRole("heading", { name: "G700", exact: true }) });
      assert.equal(await g700.locator("img").getAttribute("src"), "/brochure-vehicles/cutouts/jetour-g700-black.webp");
      for (const [brand, models] of [
        ["aito", ["aito-m5", "aito-m7", "aito-m9"]],
        ["riddara", ["riddara-rd6-2wd", "riddara-rd6-4wd", "riddara-rd6-econ"]],
      ]) {
        const urls = await page.locator(`#catalog-${brand} + ul a.button--primary[target="_blank"]`).evaluateAll(links =>
          links.map(link => link.pathname));
        assert.deepEqual(urls, models.map(id => "/brochures/" + id + "/brochure.pdf"));
      }
      const s100 = cards.filter({ has: page.getByRole("heading", { name: "S100", exact: true }) });
      assert.equal(await s100.locator("img").getAttribute("src"), "/brochure-vehicles/cutouts/maxus-s100.webp");
      assert.deepEqual(await page.locator("#catalog-maxus + ul h4").allTextContents(), ["S80", "S100-28D5", "S100", "C100", "C300"]);
      const coming = page.locator('#catalog-soueast + ul button.brochure-model-link').first();
      const unchanged = page.url();
      await coming.click();
      const notice = coming.locator("..").getByRole("status");
      await notice.getByText(mobile ? "Тун удахгүй" : "Coming soon").waitFor();
      assert.equal(page.url(), unchanged);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), mobile ? 390 : 1440);
      if (mobile) {
        assert.equal(await page.locator(".brochure-filters__options").evaluate(element =>
          element.scrollWidth > element.clientWidth && getComputedStyle(element).flexWrap === "nowrap"
        ), true);
      }

      const byBrand = page.getByRole("button", { name: "CHERY", exact: true });
      await byBrand.click();
      await page.waitForSelector('.brochure-filters button[aria-pressed="true"]:text-is("CHERY")');
      assert.equal(await groups.count(), 1);
      assert.match(page.url(), /\?brand=chery$/);
      await page.locator(".brochure-section-menu a[href='#faq']").click();
      await page.locator("#faq summary").first().click();
      assert.ok(await page.locator("#faq details").first().evaluate(element => element.open));
      await page.locator(".brochure-section-menu a[href='#catalog']").click();
      assert.equal(await groups.count(), 1);

      const tiggo = cards.filter({ has: page.getByRole("heading", { name: "TIGGO 4", exact: true }) });
      const brochure = tiggo.locator(".button--primary");
      const brochureLabel = mobile ? "Брошур үзэх" : "View brochure";
      assert.match(await brochure.getAttribute("aria-label"), new RegExp("^" + brochureLabel + " · "));
      assert.equal(await brochure.locator("span[aria-hidden='true']").textContent(), "↗");
      assert.equal(await tiggo.locator(".brochure-model-link").textContent(), mobile ? "Загвар үзэх" : "View model");
      const pdf = await brochure.getAttribute("href");
      const response = await page.request.head(base + pdf);
      assert.equal(response.status(), 200);
      assert.match(response.headers()["content-type"], /application\/pdf/);
      assert.doesNotMatch(response.headers()["content-disposition"] ?? "", /attachment/i);
      assert.equal(await brochure.getAttribute("target"), "_blank");
      assert.equal(await brochure.getAttribute("download"), null);
      const [viewer] = await Promise.all([page.waitForEvent("popup"), brochure.click()]);
      await viewer.waitForURL(base + pdf);
      await viewer.close();
      assert.equal(await tiggo.locator(".brochure-model-link").getAttribute("href"),
        "https://chery.mn/" + (locale === "en" ? "en/" : "") + "models/tiggo-4");
      await tiggo.locator(".brochure-card__media a").click();
      await page.waitForURL("**/brochures/models/chery-tiggo-4/");
      assert.ok(await page.locator(".brochure-model__phone").getAttribute("href"));
      const gallery = page.locator(".brochure-gallery a");
      assert.equal(await gallery.count(), 12);
      const photo = await gallery.first().getAttribute("href");
      assert.match((await page.request.head(base + photo)).headers()["content-type"], /image\/webp/);

      await page.goto(base + "/" + locale + "/brochures/?brand=soueast");
      await page.waitForSelector('.brochure-filters button[aria-pressed="true"]:text-is("SOUEAST")');
      const s07 = cards.filter({ has: page.getByRole("heading", { name: "S07", exact: true }) });
      await s07.locator(".brochure-card__media a").click();
      await page.waitForURL("**/brochures/models/soueast-s07/");
      assert.deepEqual((await gallery.evaluateAll(links => links.map(link => link.pathname))).slice(0, 2),
        ["001", "002"].map(number => "/brochure-galleries/soueast-s07/" + number + ".webp"));

      await page.goto(base + "/" + locale + "/brochures/?brand=jetour");
      await page.waitForSelector('.brochure-filters button[aria-pressed="true"]:text-is("JETOUR")');
      assert.equal(await groups.count(), 1);
      assert.deepEqual(await cards.locator("h4").allTextContents(), ["T2", "T1", "X50", "T1 PHEV", "T2 PHEV", "G700", "X70 Plus", "X1"]);
      const t1Phev = cards.filter({ has: page.getByRole("heading", { name: "T1 PHEV", exact: true }) });
      assert.equal(await t1Phev.locator(".brochure-card__media img").getAttribute("src"),
        "/brochure-vehicles/cutouts/jetour-t1-phev-silver.webp");
      assert.deepEqual(await cards.locator("a.brochure-model-link").evaluateAll(items => items.map(link => link.href)),
        ["t2","t1","x50","t1-phev","t2-phev","g700"].map(id => "https://jetour.mn/models/" + id));
      assert.deepEqual(await page.locator(".brochure-card__media a").evaluateAll(links => links.map(link => link.pathname)),
        ["t2", "t1", "x50", "t1-phev"].map(id => "/" + locale + "/brochures/models/jetour-" + id + "/"));
      await page.goto(base + "/" + locale + "/brochures/?brand=byd");
      await page.waitForSelector('.brochure-filters button[aria-pressed="true"]:text-is("BYD")');
      const pending = page.locator(".brochure-card__actions a[href$='/byd-ti-7/']");
      assert.equal(await pending.textContent(), brochureLabel);
      assert.equal(await pending.getAttribute("target"), null);
      await pending.click();
      await page.waitForURL("**/brochures/byd-ti-7/");
      await page.locator(".brochure-reader__pending").waitFor();
      assert.equal(await page.locator(".brochure-reader a[target='_blank']").count(), 0);
    }
  } finally {
    await browser.close();
  }
});
