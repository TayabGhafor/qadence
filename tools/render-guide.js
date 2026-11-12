// Renders docs/seo-setup-guide.html to docs/SEO-Setup-Guide.pdf (A4, page numbers in the footer).
// Needs playwright-core and a Playwright Chromium: `npm i -D playwright-core && npx playwright install chromium`.
// Usage: node tools/render-guide.js
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

(async () => {
  const src = path.join(__dirname, '..', 'docs', 'seo-setup-guide.html');
  const out = path.join(__dirname, '..', 'docs', 'SEO-Setup-Guide.pdf');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(src).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:8px system-ui,sans-serif;color:#7A8A87;padding:0 15mm;display:flex;justify-content:space-between"><span>Qadence · Search Console &amp; custom domain guide</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'
  });
  await browser.close();
  console.log('wrote', path.relative(process.cwd(), out));
})().catch(e => { console.error(e); process.exitCode = 1; });
