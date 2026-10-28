import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = process.env.BASE_URL ?? 'http://localhost:3320';
const fullSite = process.env.FULL_SITE === '1';
const output = path.resolve(fullSite ? 'docs/review/2026-10-28-fullsite' : 'docs/review/2026-10-28');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { origin, capturedAt: new Date().toISOString(), note: 'Local lab observations; no field CWV or INP claim. Unthrottled desktop and mobile viewport; not a real mobile network. LCP/CLS and resource totals sampled before scrolling; full-page captures then load offscreen images for visual QA.', pages: [] };
try {
  const captures = fullSite
    ? [['home-wide','/mn/',1920,1080], ...[['home','/mn/'],['home-en','/en/'],['about','/mn/about/'],['brands','/en/brands/'],['jetour','/mn/brands/jetour/'],['services','/mn/services/'],['locations','/mn/locations/'],['news','/mn/news/'],['article','/en/news/mega-test-drive-7/'],['contact','/mn/contact/'],['privacy','/en/privacy/']].flatMap(([name,route]) => [[name+'-desktop',route,1440,1000],[name+'-mobile',route,390,844]])]
    : [['home-desktop','/mn/',1440,1000],['home-mobile','/mn/',390,844],['brands-desktop','/en/brands/',1440,1000],['brands-mobile','/mn/brands/',390,844],['contact-desktop','/en/contact/?intent=service&brand=byd',1440,1000],['contact-mobile','/mn/contact/?intent=service&brand=jetour',390,844],['services-desktop','/mn/services/',1440,1000]];
  for (const [name, route, width, height] of captures) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.__lab = { lcp: null, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__lab.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const response = await page.goto(origin + route);
    await page.waitForLoadState('networkidle');
    const initialMetrics = await page.evaluate(() => ({ ...window.__lab, bytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.transferSize, 0), requests: performance.getEntriesByType('resource').length }));
    await page.screenshot({ path: path.join(output, `${name}-viewport.png`) });
    // Full-page screenshots do not trigger offscreen native lazy images. Visit each screen first.
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 70)); } });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(() => [...document.images].every(image => image.getBoundingClientRect().width === 0 || image.complete && image.naturalWidth > 0));
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
    const metrics = { ...initialMetrics, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1) };
    report.pages.push({ name, route, viewport: { width, height }, status: response.status(), errors, ...metrics });
    console.log(name, JSON.stringify(report.pages.at(-1)));
    await page.close();
  }
  await writeFile(path.join(output, 'lab-baseline.json'), JSON.stringify(report, null, 2) + '\n');
} finally { await browser.close(); }
