import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://localhost:3300";
const executablePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
test("the BYD brand opens directly on the first model without JavaScript", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: "reduce",
    });
    await page.goto(`${base}/mn/brands/`);
    await page.getByRole("link", { name: "BYD Дэлгэрэнгүй үзэх" }).click();
    await page.waitForURL("**/mn/brands/byd/");
    const lineup = page.getByRole("region", { name: "BYD загварууд" });
    await lineup.waitFor({ timeout: 5000 });
    assert.deepEqual(await lineup.getByRole("heading", { level: 2 }).allTextContents(), [
      "BYD TI 7", "BYD SHARK 6", "BYD ATTO 3", "BYD SEALION 6",
    ]);

    const headerBottom = await page.locator(".site-header").evaluate(header => header.getBoundingClientRect().bottom);
    const firstModelTop = await page.locator("#ti-7").evaluate(model => model.getBoundingClientRect().top);
    assert.ok(Math.abs(firstModelTop - headerBottom) < 2, "TI 7 begins immediately below the site header");
    assert.equal(await lineup.getByRole("navigation").count(), 0);
    assert.equal(await page.locator("#byd-overview, #byd-design, #byd-technical").count(), 0,
      "the SEALION 6 details only appear on the model page");

    for (const [name, hash] of [["TI 7", "#ti-7"], ["SHARK 6", "#shark-6"], ["ATTO 3", "#atto-3"], ["SEALION 6", "#sealion-6"]]) {
      await page.goto(`${base}/mn/brands/byd/${hash}`);
      assert.equal(new URL(page.url()).hash, hash);
      const panel = lineup.getByRole("region", { name: `BYD ${name}`, exact: true });
      const desktopSource = await panel.getByRole("img").evaluate(async img => {
        await img.decode();
        return new URL(img.currentSrc).pathname;
      });
      assert.equal(desktopSource, `/byd-lineup/${hash.slice(1)}-desktop.webp`);
      const top = await panel.evaluate(section => section.getBoundingClientRect().top);
      assert.ok(top >= headerBottom - 2 && top < headerBottom + 40, `${name} begins beneath the site header`);
      const photo = await panel.getByRole("img").boundingBox();
      const title = await panel.getByRole("heading").boundingBox();
      const action = await panel.getByRole("link").boundingBox();
      assert.ok(title.y >= photo.y && title.y + title.height < photo.y + photo.height / 2,
        `${name} title sits over the upper half of the photo`);
      assert.ok(action.y > photo.y + photo.height / 2 && action.y + action.height <= photo.y + photo.height,
        `${name} action sits over the lower half of the photo`);

    }

    await lineup.getByRole("region", { name: "BYD SEALION 6", exact: true })
      .getByRole("link", { name: /Загвартай танилцах/ }).click();
    await page.waitForURL("**/mn/brands/byd/sealion-6/");
    assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), "BYD SEALION 6");
    assert.equal(await page.locator("#byd-overview-heading").textContent(), "BYD DM-i");
    assert.doesNotMatch(await page.locator(".byd-highlight").innerText(), /брошюрын үзүүлэлт/);
    const studio = page.getByRole("region", { name: "BYD SEALION 6", exact: true });
    const studioPhoto = studio.getByRole("img");
    await studioPhoto.evaluate(img => img.decode());
    assert.match(await studioPhoto.getAttribute("src"), /\/byd-sealion-6\/hero\.webp$/);
    assert.equal(await studio.getByRole("link", { name: "Туршилтын жолоодлого" }).getAttribute("href"), "#byd-test-drive");
    assert.equal(await studio.getByRole("link", { name: "Мэдээлэл" }).getAttribute("href"), "#byd-test-drive");
    assert.ok((await studio.boundingBox()).y < (await page.locator("#byd-overview-heading").boundingBox()).y);
  } finally { await browser.close(); }
});

test("mobile SEALION 6 has local specifications, working colour selection and real contact links", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 760 }, isMobile: true, deviceScaleFactor: 1, hasTouch: true });
    await page.goto(`${base}/en/brands/byd/`);
    const overview = page.locator("#byd-overview");
    const specs = page.locator("#byd-technical");
    const headerBottom = await page.locator(".site-header").evaluate(header => header.getBoundingClientRect().bottom);
    const firstModelTop = await page.locator("#ti-7").evaluate(model => model.getBoundingClientRect().top);
    assert.ok(Math.abs(firstModelTop - headerBottom) < 2, "the first model begins immediately below the mobile header");
    const mobileSources = [];
    for (const image of await page.locator(".byd-model img").all()) {
      await image.scrollIntoViewIfNeeded();
      mobileSources.push(await image.evaluate(async img => {
        await img.decode();
        return new URL(img.currentSrc).pathname;
      }));
    }
    assert.deepEqual(mobileSources, [
      "/byd-lineup/ti-7-mobile.webp", "/byd-lineup/shark-6-mobile.webp",
      "/byd-lineup/atto-3-mobile.webp", "/byd-lineup/sealion-6-mobile.webp",
    ]);
    await page.locator("#sealion-6").getByRole("link", { name: /Explore the model/ }).tap();
    await page.waitForURL("**/en/brands/byd/sealion-6/");
    assert.match(await overview.innerText(), /18\.3\s*kWh/);
    assert.match(await overview.innerText(), /300\s*hp/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    const roadPhoto = overview.getByRole("img", { name: "Silver BYD SEALION 6 driving along a mountain road" });
    await roadPhoto.scrollIntoViewIfNeeded();
    const roadRatios = await roadPhoto.evaluate(async img => {
      await img.decode();
      return [img.clientWidth / img.clientHeight, img.naturalWidth / img.naturalHeight];
    });
    assert.ok(Math.abs(roadRatios[0] - roadRatios[1]) < 0.02, "the full road composition fits on mobile");
    await page.getByRole("button", { name: "Azure blue", exact: true }).tap();
    const paint = page.getByRole("img", { name: "Exterior colours · Azure blue" });
    assert.match(await paint.getAttribute("src"), /\/blue\.webp$/);
    await paint.evaluate(img => img.decode());
    const upholstery = page.getByRole("group", { name: "Interior colours" });
    const cabinPhotos = [];
    for (const name of ["Light", "Black and brown", "Black"]) {
      const swatch = upholstery.getByRole("button", { name, exact: true });
      await swatch.tap();
      assert.equal(await swatch.getAttribute("aria-pressed"), "true");
      const cabin = page.getByRole("img", { name: `Interior colours · ${name}` });
      await cabin.evaluate(img => img.decode());
      cabinPhotos.push(await cabin.getAttribute("src"));
    }
    assert.equal(new Set(cabinPhotos).size, 3);
    const comfort = page.getByText("Front seat adjustment", { exact: true });
    await comfort.tap();
    assert.equal(await page.getByText(/driver’s seat adjusts electrically/).isVisible(), true);
    await specs.getByText("Safety", { exact: true }).tap();
    assert.equal(await specs.getByText("ISOFIX", { exact: true }).isVisible(), true);
    await specs.getByText("Powertrain and drive", { exact: true }).tap();
    assert.match(await specs.innerText(), /1,100\s*km/);
    const contact = page.locator("#byd-contact");
    assert.equal(await contact.getByRole("link", { name: "Ask about a test drive" }).getAttribute("href"), "#byd-test-drive");
    assert.equal(await contact.getByRole("link", { name: "Information" }).getAttribute("href"), "#byd-test-drive");
    assert.equal(await contact.locator('a[href^="tel:"]').getAttribute("href"), "tel:+97672508855");
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(img => img.decode());
    }
  } finally { await browser.close(); }
});

test("model navigation scrolls to its sections with JavaScript disabled", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.goto(`${base}/en/brands/byd/sealion-6/`);
    const nav = page.getByRole("navigation", { name: "Model sections" });
    const links = await nav.getByRole("link").all();
    assert.equal(links.length, 4);
    for (const link of links) {
      const anchor = await link.getAttribute("href");
      await link.focus();
      await page.keyboard.press("Enter");
      assert.equal(new URL(page.url()).hash, anchor);
      const position = await page.locator(anchor).evaluate(section => ({
        section: section.getBoundingClientRect().top,
        header: document.querySelector(".site-header").getBoundingClientRect().bottom,
        nav: document.querySelector(".byd-subnav").getBoundingClientRect().bottom,
      }));
      assert.ok(position.section >= Math.max(position.header, position.nav) - 2, `${anchor}: ${JSON.stringify(position)}`);
      assert.ok(position.section < 720, anchor);
    }
  } finally { await browser.close(); }
});

test("the SEALION 6 page sends a tagged BYD test-drive lead after consent", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const requests = [];
    await page.route("**/functions/v1/submit-feedback", async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status: 201, json: { id: "byd-browser-test" } });
    });
    await page.goto(`${base}/en/brands/byd/`);
    const section = page.locator("#byd-test-drive");
    assert.equal(await section.count(), 0, "the BYD lineup does not include the form");
    await page.locator("#sealion-6").getByRole("link", { name: /Explore the model/ }).click();
    await page.waitForURL("**/en/brands/byd/sealion-6/");
    assert.equal(await page.locator(".byd-details + #byd-test-drive").count(), 1);
    await section.getByRole("img").scrollIntoViewIfNeeded();
    await section.getByRole("img").evaluate(img => img.decode());
    const form = section.locator("form");
    assert.equal(await form.getByLabel("City", { exact: true }).inputValue(), "ulaanbaatar");
    await form.getByLabel("City", { exact: true }).selectOption("erdenet");
    await form.getByLabel("First name", { exact: true }).fill("Synthetic");
    await form.getByLabel("Last name", { exact: true }).fill("Request");
    await form.getByLabel("Mobile number", { exact: true }).fill("00000000");
    const send = form.getByRole("button", { name: "Send request", exact: true });
    await send.click();
    assert.equal(requests.length, 0);
    await form.getByRole("checkbox").check();
    await send.click();
    await form.getByRole("status").waitFor();
    assert.deepEqual(requests, [{
      name: "Synthetic Request", phone: "+97600000000", audience: "client", showroom: "byd-4s",
      message: "Test drive: BYD SEALION 6\nCity: Erdenet", consent: true, locale: "en", website: "",
    }]);
    assert.equal(await send.isDisabled(), true);
  } finally { await browser.close(); }
});

test("the BYD lineup opens the localized TI 7, ATTO 3 and SHARK 6 model pages", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    for (const [locale, width, height, imageVariant] of [["mn", 1440, 900, "desktop"], ["en", 390, 844, "mobile"]]) {
      const page = await browser.newPage({ viewport: { width, height }, javaScriptEnabled: false, reducedMotion: "reduce" });
      for (const [id, name, action, stories] of [
        ["ti-7", "BYD TI 7", locale === "mn" ? /Загвартай танилцах/ : /Explore the model/, ["exterior", "hybrid", "cabin", "storage"]],
        ["atto-3", "BYD ATTO 3", locale === "mn" ? /Дэлгэрэнгүй үзэх/ : /View details/, ["exterior", "cabin", "platform", "battery", "heat-pump", "charging", "connectivity"]],
        ["shark-6", "BYD SHARK 6", locale === "mn" ? /Дэлгэрэнгүй үзэх/ : /View details/, []],
      ]) {
        await page.goto(`${base}/${locale}/brands/byd/`);
        await page.getByRole("region", { name, exact: true }).getByRole("link", { name: action }).click({ timeout: 4000 });
        await page.waitForURL(`**/${locale}/brands/byd/${id}/`);
        const hero = page.getByRole("region", { name, exact: true });
        assert.equal(await hero.getByRole("heading", { level: 1 }).textContent(), name);
        assert.equal(await hero.getByRole("img").evaluate(async img => {
          await img.decode();
          return new URL(img.currentSrc).pathname;
        }), `/byd-${id}/hero-${imageVariant}.webp`);
        assert.equal(await hero.locator("dl dd").count(), 3);
        if (id === "shark-6") {
          const studio = hero.locator(".byd-studio");
          assert.equal(await studio.count(), 1);
          const heading = await studio.getByRole("heading", { level: 1 }).boundingBox();
          const photo = await studio.getByRole("img").boundingBox();
          const action = await studio.locator(".byd-actions").boundingBox();
          assert.ok(heading && photo && action);
          assert.ok(heading.y + heading.height <= photo.y);
          assert.ok(photo.y + photo.height <= action.y);
          assert.ok(Math.abs((photo.x + photo.width / 2) - width / 2) < 10);
        }
        assert.doesNotMatch(await hero.innerText(), /Сайн Моторсын танилцуулгын үзүүлэлт|Figures from the Sain Motors model sheet/);
        const anchor = "#byd-test-drive";
        for (const label of locale === "mn" ? ["Мэдээлэл", "Туршилтын жолоодлого"] : ["Information", "Test drive"]) {
          const action = hero.getByRole("link", { name: label, exact: true });
          assert.equal(await action.getAttribute("href"), anchor);
          await action.click();
          assert.equal(new URL(page.url()).pathname, "/" + locale + "/brands/byd/" + id + "/");
          assert.equal(new URL(page.url()).hash, anchor);
          assert.equal(await page.locator(anchor).isVisible(), true);
          assert.match(await page.locator(anchor).innerText(), new RegExp(name));
        }
        const lead = page.locator(anchor);
        const leadForm = lead.locator("form");
        assert.equal(await leadForm.evaluate(form => getComputedStyle(form).backgroundColor), "rgba(0, 0, 0, 0)");
        const formBounds = await leadForm.boundingBox();
        assert.ok(formBounds);
        if (id === "ti-7") {
          assert.ok(Math.abs(formBounds.x + formBounds.width / 2 - width / 2) < 10);
        } else {
          const leadPhoto = await lead.getByRole("img").boundingBox();
          assert.ok(leadPhoto);
          if (imageVariant === "desktop") assert.ok(leadPhoto.x + leadPhoto.width <= formBounds.x);
          else assert.ok(leadPhoto.y + leadPhoto.height <= formBounds.y);
        }
        assert.doesNotMatch(await page.locator("main").innerText(), /Сайн Моторсын (танилцуулга|тоноглол)|Sain Motors\S? (brochure|model sheet|equipment list)/i);
        const equipment = page.locator(".byd-profile__equipment");
        assert.ok(await equipment.evaluate(node => parseFloat(getComputedStyle(node).borderTopLeftRadius) <= 24));
        assert.equal(await equipment.locator(".byd-profile__swatch").count(), id === "ti-7" ? 5 : 4);
        if (id === "ti-7") {
          assert.equal(await equipment.locator("img").count(), 0);
          assert.equal(await page.locator("#byd-enquiry img, #byd-test-drive img").count(), 0);
          const battery = page.getByRole("region", { name: "BYD Blade Battery" });
          const photo = battery.getByRole("img");
          const cardBounds = await battery.boundingBox();
          const titleBounds = await battery.getByRole("heading").boundingBox();
          const photoBounds = await photo.boundingBox();
          assert.ok(cardBounds.width < width && photoBounds.width < cardBounds.width);
          if (imageVariant === "desktop") assert.ok(titleBounds.x + titleBounds.width < photoBounds.x);
          else assert.ok(titleBounds.y + titleBounds.height < photoBounds.y);
          await photo.scrollIntoViewIfNeeded();
          assert.equal(await photo.evaluate(async img => {
            await img.decode();
            return new URL(img.currentSrc).pathname;
          }), "/byd-ti-7/blade-battery-" + imageVariant + ".webp");
          await battery.locator("summary").click();
          assert.match(await battery.locator("details[open]").innerText(), /35\.6.*130|130.*35\.6/s);
        }
        if (stories.length) {
          const navigation = page.locator(".byd-profile__nav");
          await navigation.getByRole("link").first().click();
          assert.equal(new URL(page.url()).hash, "#byd-explore");
          assert.equal(await page.locator("#byd-explore article").count(), stories.length);
          for (const story of stories) {
            const photo = page.locator("#byd-feature-" + story + " img");
            await photo.scrollIntoViewIfNeeded();
            const chosenPhoto = await photo.evaluate(async img => {
              await img.decode();
              return new URL(img.currentSrc).pathname;
            });
            assert.equal(chosenPhoto, "/byd-" + id + "/" + story + "-" + imageVariant + ".webp");
          }
          const question = page.locator("#byd-faq details").first();
          await question.locator("summary").click();
          assert.equal(await question.getAttribute("open"), "");
          assert.equal(await page.locator('#byd-faq a[href*="intent=finance"]').count(), 1);
        } else {
          const values = await hero.locator("dl dd").allTextContents();
          assert.deepEqual(values.map(value => value.split(" ")[0]), ["431", "670", "5.7"]);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        await hero.getByRole("link", { name: locale === "mn" ? "BYD загварууд" : "BYD models", exact: true }).click();
        await page.waitForURL(`**/${locale}/brands/byd/#${id}`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
test("the three BYD model pages submit requests with their own model and purpose", async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const requests = [];
    await page.route("**/functions/v1/submit-feedback", async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status: 201, json: { id: "byd-browser-test" } });
    });
    for (const [id, name] of [["ti-7", "BYD TI 7"], ["atto-3", "BYD ATTO 3"], ["shark-6", "BYD SHARK 6"]]) {
      for (const [anchor, intent] of [["#byd-enquiry", "Sales enquiry"], ["#byd-test-drive", "Test drive"]]) {
        await page.goto(base + "/en/brands/byd/" + id + "/" + anchor);
        const form = page.locator(anchor + " form");
        await form.getByLabel("First name", { exact: true }).fill("Synthetic");
        await form.getByLabel("Last name", { exact: true }).fill("Request");
        await form.getByLabel("Mobile number", { exact: true }).fill("00000000");
        if (intent === "Sales enquiry") await form.getByLabel(/Your question/).fill("Please share availability.");
        const send = form.getByRole("button", { name: "Send request", exact: true });
        const before = requests.length;
        await send.click();
        assert.equal(requests.length, before);
        await form.getByRole("checkbox").check();
        await send.click();
        await form.getByRole("status").waitFor();
        assert.deepEqual(requests.at(-1), {
          name: "Synthetic Request", phone: "+97600000000", audience: "client", showroom: "byd-4s",
          message: intent + ": " + name + "\nCity: Ulaanbaatar" + (intent === "Sales enquiry" ? "\n\nPlease share availability." : ""),
          consent: true, locale: "en", website: "",
        });
        assert.equal(await send.isDisabled(), true);
      }
    }
  } finally { await browser.close(); }
});
