// Regression smoke for the SQA site (old and new builds). Usage: node smoke.js <baseUrl>
const { chromium, firefox } = require('playwright-core');
const engine = process.env.BROWSER === 'firefox' ? firefox : chromium;
const base = process.argv[2] || 'http://127.0.0.1:8765/';
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`); };

// The app scripts load right after first paint, so the load event can fire before the app has booted:
// wait for js/app.js to finish (it sets window.QadenceApp). Older builds without it just wait out the timeout.
const booted = page => page.waitForFunction(() => !!window.QadenceApp, null, { timeout: 10000 }).catch(() => {});

async function go(page, screen) {
  // click the first visible nav control for a screen (old: .nav button, new: sidebar link)
  const clicked = await page.evaluate(s => {
    const els = [...document.querySelectorAll(`[data-screen="${s}"]`)].filter(e => e.offsetParent !== null);
    if (!els.length) return false; els[0].click(); return true;
  }, screen);
  if (!clicked) await page.evaluate(s => { location.hash = '#/' + s; }, screen);
  await page.waitForTimeout(250);
}

(async () => {
  const browser = await engine.launch();
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('dialog', d => { errors.push('native dialog: ' + d.message()); d.dismiss(); });

  await page.goto(base); await booted(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload(); await booted(page);

  // 1. login
  const openLogin = await page.$('[data-open-login]');
  if (openLogin && await openLogin.isVisible()) await openLogin.click();
  await page.fill('#authUsername', 'Admin');
  await page.fill('#authPassword', 'admin@123');
  await page.click('#authForm [type=submit]');
  await page.waitForTimeout(400);
  const shellVisible = await page.evaluate(() => { const s = document.getElementById('appShell'); return !!s && !s.hidden; });
  ok('login opens the app shell', shellVisible);
  const auth = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))));
  ok('no password in localStorage', !auth.includes('admin@123'));

  // 2. reload keeps session
  await page.reload(); await booted(page); await page.waitForTimeout(400);
  ok('reload keeps sign-in', await page.evaluate(() => !document.getElementById('appShell').hidden));

  // 3. challenge → submit → submissions
  await go(page, 'challenges');
  const ch = await page.$('[data-challenge="peopleops-login"]');
  ok('challenge library lists peopleops-login', !!ch);
  if (ch) {
    await page.evaluate(() => [...document.querySelectorAll('[data-challenge="peopleops-login"]')].find(e => e.offsetParent !== null)?.click());
    await page.waitForTimeout(300);
    await page.fill('#scriptEditor', "test('login', async ({ page }) => {\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByText('Welcome')).toBeVisible();\n});");
    await page.evaluate(() => { const t = document.querySelector('[data-editor-pane="approach"]'); t && t.click(); });
    await page.fill('#approachEditor', 'Risk first: valid login, invalid password, logout then protected route. Role-based locators, web-first assertions.');
    await page.click('#submitWorkspace');
    await page.waitForTimeout(400);
    await go(page, 'submissions');
    const subs = await page.textContent('#submissionList');
    ok('submission saved and listed', /PeopleOps/i.test(subs || ''));
  }

  // 4. interview practice
  await go(page, 'practice');
  await page.evaluate(() => { const tab = document.querySelector('[data-iv-tab="rounds"]'); if (tab) tab.click(); });
  await page.waitForTimeout(250);
  await page.evaluate(() => { const b = [...document.querySelectorAll('[data-start-track]')].find(e => e.offsetParent !== null); if (b) b.click(); });
  await page.waitForTimeout(300);
  const q = await page.textContent('#questionCard').catch(() => '');
  ok('interview practice renders a question', (q || '').trim().length > 40);

  // 5. labs API
  await go(page, 'lab');
  await page.evaluate(() => { const t = [...document.querySelectorAll('[data-lab="api"]')].find(e => e.offsetParent !== null); t && t.click(); });
  await page.waitForTimeout(150);
  await page.click('#sendApi').catch(() => {});
  await page.waitForTimeout(250);
  ok('API lab responds', /200|401|404|500/.test(await page.textContent('#apiStatus').catch(() => '')));

  // 6. export from settings contains no password
  await go(page, 'settings');
  const exportBtn = await page.$('#profileExport');
  if (exportBtn) {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 4000 }).catch(() => null), exportBtn.click()]);
    if (dl) {
      const p = await dl.path(); const txt = require('fs').readFileSync(p, 'utf8');
      ok('export downloads JSON without password', txt.startsWith('{') && !txt.includes('admin@123'), dl.suggestedFilename());
    } else ok('export downloads JSON without password', false, 'no download event');
  } else ok('export button present', false);

  // 7. overflow at widths
  for (const w of [360, 768, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const s of ['home', 'learning', 'challenges', 'settings']) {
      await go(page, s);
      const over = await page.evaluate(() => {
        const W = document.documentElement.clientWidth; let n = 0, first = '';
        for (const el of document.querySelectorAll('#appShell *')) {
          if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
          if (el.closest('.sidebar') && !document.querySelector('.shell.drawer-open')) continue;   // closed drawer is off-screen by design
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > W + 1 || r.left < -1)) {
            let p = el.parentElement, clipped = false;
            while (p && p !== document.body && p !== document.documentElement) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 1 && pr.left >= -1) { clipped = true; break; } } p = p.parentElement; }
            if (!clipped) { n++; if (!first) first = el.tagName + '.' + el.className; }
          }
        }
        return { n, first };
      });
      ok(`no overflow ${s} @${w}`, over.n === 0, over.n ? `${over.n} el, e.g. ${over.first}` : '');
    }
  }

  // 8. logout
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { const b = document.getElementById('logoutBtn'); b && b.click(); });
  await page.waitForTimeout(300);
  ok('logout returns to landing', await page.evaluate(() => document.getElementById('appShell').hidden));

  ok('no console errors / native dialogs', errors.length === 0, errors.slice(0, 5).join(' | '));
  await browser.close();
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
})();
