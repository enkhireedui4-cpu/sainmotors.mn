import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://localhost:3200';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

test('news categories filter real stories and the footer works across languages and sizes', async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless:true });
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    for (const locale of ['en','mn']) for (const width of [320,390,768,900,1024,1440,1920]) {
      await page.setViewportSize({width,height:960});
      await page.goto(`${base}/${locale}/news/`,{waitUntil:'networkidle'});
      assert.equal(await page.locator('.news-directory__filters button').count(),4);
      assert.equal(await page.locator('.news-list article:visible').count(),11);
      await page.locator('[data-news-category="media"]').click();
      assert.equal(await page.locator('.news-list article:visible').count(),2);
      assert.equal(await page.locator('.news-directory__empty').count(),0);
      await page.locator('[data-news-category="csr"]').click();
      assert.equal(await page.locator('.news-list article:visible').count(),2);
      await page.locator('[data-news-category="news"]').click();
      assert.equal(await page.locator('.news-list article:visible').count(),7);
      assert.equal(await page.locator('.orbis-footer nav a').count(),3);
      assert.equal(await page.locator(`.orbis-footer a[href="/${locale}/brands/"]`).count(),0);
      const dealerLink=page.locator(`.orbis-footer nav a[href="/${locale}/locations/"]`);
      assert.equal(await dealerLink.textContent(),locale==='en'?'Dealer network':'Дилерийн сүлжээ');
      assert.equal(await page.locator('.orbis-footer').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 0, 0)');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('.orbis-footer__top').click();
      await page.waitForFunction(()=>scrollY<5);
      await dealerLink.click();
      await page.waitForURL(`**/${locale}/locations/`);
    }
  } finally {await browser.close();}
});

test('news card dates are readable below the photographs', async () => {
  const browser = await chromium.launch({ executablePath: chrome });
  try {
    const page = await browser.newPage();
    for (const locale of ['en', 'mn']) for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      const listing = `${base}/${locale}/news/`;
      const article = `${listing}byd-official-distributor-2025/`;
      await page.goto(listing);
      const bydDate = page.locator(`.news-card[href="/${locale}/news/byd-official-distributor-2025/"] time`);
      assert.equal(await bydDate.getAttribute('datetime'), '2025-10-01');
      assert.equal(await bydDate.textContent(), locale === 'en' ? '1 Oct 2025' : '2025.10.01');
      for (const url of [listing, article]) {
        if (url !== listing) await page.goto(url);
        const dates = await page.locator('.news-card time').evaluateAll(times => times.map(time => {
          const card = time.closest('a');
          const media = card.querySelector('.news-card__media');
          let background;
          for (let element = time; element && !background; element = element.parentElement) {
            const color = getComputedStyle(element).backgroundColor;
            if (color.startsWith('rgb(')) background = color;
          }
          return {
            href: card.getAttribute('href'),
            inBody: card.querySelector('.news-card__body').contains(time),
            dateTop: time.getBoundingClientRect().top,
            photoBottom: media.getBoundingClientRect().bottom,
            foreground: getComputedStyle(time).color,
            background,
          };
        }));
        assert.ok(dates.length > 0, `Expected dated cards on ${url}`);
        for (const { href, inBody, dateTop, photoBottom, foreground, background } of dates) {
          assert.ok(inBody && dateTop >= photoBottom, `Expected the date below the photo on ${href} at ${width}px`);
          assert.ok(background, `Expected a solid date background on ${href}`);
          const levels = [foreground, background].map(relativeLuminance).sort((a, b) => b - a);
          const contrast = (levels[0] + 0.05) / (levels[1] + 0.05);
          assert.ok(contrast >= 4.5, `Date contrast on ${href} was ${contrast.toFixed(2)}:1`);
        }
      }
    }
  } finally {
    await browser.close();
  }
});

function relativeLuminance(color) {
  const [red, green, blue] = color.match(/\d+/g).map(value => {
    const channel = Number(value) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

test('news article text keeps a readable measure inside the full-width photo column', async () => {
  const browser = await chromium.launch({ executablePath: chrome });
  try {
    const page = await browser.newPage();
    for (const locale of ['en', 'mn']) for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`${base}/${locale}/news/byd-official-distributor-2025/`);
      await page.evaluate(async () => { await document.fonts.ready; });
      const { coverWidth, columnWidth, photoWidths, textBlocks } = await page.locator('.news-feature').evaluate(article => {
        const widthOf = element => element.getBoundingClientRect().width;
        const column = article.querySelector('.news-feature__body');
        const textBlocks = Array.from(column.querySelectorAll('.news-feature__section > :is(p, ul)'), block => {
          const lines = new Map();
          const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
          const range = new Range();
          while (walker.nextNode()) {
            const text = walker.currentNode;
            for (let index = 0; index < text.length; index++) {
              range.setStart(text, index);
              range.setEnd(text, index + 1);
              const rect = range.getBoundingClientRect();
              if (rect.width > 0) {
                const line = Math.round(rect.top);
                lines.set(line, (lines.get(line) ?? '') + text.data[index]);
              }
            }
          }
          const longestLine = Math.max(0, ...Array.from(lines.values(), line => line.trim().length));
          return { tag: block.tagName, pixels: widthOf(block), longestLine };
        });
        return {
          coverWidth: widthOf(article.querySelector('.news-feature__cover img')),
          columnWidth: widthOf(column),
          photoWidths: Array.from(column.querySelectorAll('.news-feature__photo img'), widthOf),
          textBlocks,
        };
      });
      assert.ok(photoWidths.length > 0, 'Expected in-article photographs');
      assert.ok(textBlocks.some(({ tag }) => tag === 'P') && textBlocks.some(({ tag }) => tag === 'UL'));
      assert.ok(Math.abs(columnWidth - coverWidth) < 1, 'Expected the body column to match the cover');
      assert.ok(photoWidths.every(photoWidth => Math.abs(photoWidth - coverWidth) < 1), 'Expected full-width in-article photographs');
      for (const { tag, pixels, longestLine } of textBlocks) {
        if (width === 1440) {
          assert.ok(coverWidth > 750, 'Expected the wide article photo column');
          assert.ok(pixels < coverWidth, `Expected ${locale} ${tag} to be narrower than the photos`);
          assert.ok(longestLine <= 80, `${locale} ${tag} wraps at ${longestLine} characters`);
        } else {
          assert.ok(Math.abs(pixels - coverWidth) < 1, `Expected ${locale} ${tag} to fill the mobile column`);
        }
      }
    }
  } finally {
    await browser.close();
  }
});
