#!/usr/bin/env node
/* Qadence · renders the social card and app icons into dist/assets/. Dev-only: needs playwright-core and an
   installed Chromium (see tools/e2e/README.md); the site itself never loads Playwright.
     node tools/render-images.js
   Writes og-image.png (1200×630, from tools/og-image.html with the live content totals), icon-192.png,
   icon-512.png, icon-maskable-512.png (glyph inside the 80% safe zone), apple-touch-icon.png (180, opaque)
   and favicon-32.png. If python3 with Pillow is available the PNGs are then palette-optimised. */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright-core');
const { collect } = require('./build-seo');

const ASSETS = path.join(__dirname, '..', 'dist', 'assets');
const GRAD = '<linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16332F"/><stop offset="1" stop-color="#0A1514"/></linearGradient>';
const glyph = (sw = 4.4) => `<g transform="translate(-1.5 1.5)" fill="none" stroke-linecap="round" stroke-width="${sw}"><path d="M30.5 32.6A11.5 11.5 0 1 1 35.3 22.4" stroke="#fff"/><path d="M24 27.5l4.6 4.6 10.4-10.4" stroke="#2DD4BF" stroke-linejoin="round"/></g>`;
/* rounded tile with transparent corners (same as assets/favicon.svg / the in-page logo mark) */
const tile = sw => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs>${GRAD}</defs><rect width="48" height="48" rx="14" fill="url(#t)"/>${glyph(sw)}</svg>`;
/* full-bleed square (no transparency): the glyph scaled about the centre */
const square = scale => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs>${GRAD}</defs><rect width="48" height="48" fill="url(#t)"/><g transform="translate(24 24) scale(${scale}) translate(-24 -24)">${glyph(4.4)}</g></svg>`;

const ICONS = [
  { file: 'favicon-32.png', size: 32, svg: tile(4.6) },
  { file: 'icon-192.png', size: 192, svg: tile(4.4) },
  { file: 'icon-512.png', size: 512, svg: tile(4.4) },
  { file: 'icon-maskable-512.png', size: 512, svg: square(0.78) },
  { file: 'apple-touch-icon.png', size: 180, svg: square(0.9) }
];

(async () => {
  const { s } = collect();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const hash = new URLSearchParams({ lessons: s.lessons, mcqs: s.mcqs, interview: s.interview, langs: s.explainLangs.length }).toString();
    await page.goto('file://' + path.join(__dirname, 'og-image.html') + '#' + hash);
    await page.evaluate(() => document.fonts.ready);
    const fontOk = await page.evaluate(() => document.fonts.check('800 76px "Plus Jakarta Sans"'));
    if (!fontOk) throw new Error('Plus Jakarta Sans did not load in tools/og-image.html');
    await page.screenshot({ path: path.join(ASSETS, 'og-image.png') });
    console.log('  wrote dist/assets/og-image.png');
    for (const ic of ICONS) {
      await page.setViewportSize({ width: ic.size, height: ic.size });
      await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${ic.size}px;height:${ic.size}px}</style>${ic.svg}`);
      await page.screenshot({ path: path.join(ASSETS, ic.file), omitBackground: true });
      console.log(`  wrote dist/assets/${ic.file}`);
    }
  } finally { await browser.close(); }

  const files = ['og-image.png', ...ICONS.map(i => i.file)].map(f => path.join(ASSETS, f));
  const py = `
import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p); im.load()
    big = im.size[0] * im.size[1] > 300000
    method = Image.Quantize.FASTOCTREE if im.mode == 'RGBA' else Image.Quantize.MEDIANCUT
    q = im.quantize(colors=256, method=method, dither=Image.Dither.FLOYDSTEINBERG)
    q.save(p, optimize=True)
    print('  optimised', p.split('/')[-1], im.size)
`;
  const r = spawnSync('python3', ['-I', '-c', py, ...files], { encoding: 'utf8' });
  if (r.status === 0) process.stdout.write(r.stdout); else console.log('  (python3 + Pillow not available — PNGs left unoptimised)', r.stderr ? r.stderr.trim().split('\n').pop() : '');
  files.forEach(f => console.log(`  ${path.basename(f)}  ${(fs.statSync(f).size / 1024).toFixed(1)} KiB`));
})().catch(e => { console.error(e); process.exit(1); });
