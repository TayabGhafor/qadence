// Code workspace (IDE + sandboxed runner) checks. Usage: node workspace.js <baseUrl>   (BROWSER=firefox for Firefox)
const { chromium, firefox } = require('playwright-core');
const engine = process.env.BROWSER === 'firefox' ? firefox : chromium;
const base = process.argv[2] || 'http://127.0.0.1:8765/';
const results = [];
const ok = (name, pass, info = '') => { results.push(pass); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`); };

(async () => {
  const browser = await engine.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  // The blocked-network checks below trigger CSP violation reports on purpose (Firefox logs them as errors).
  page.on('console', m => { if (m.type() === 'error' && !/Content-Security-Policy.*connect-src/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('dialog', d => { errors.push('native dialog'); d.dismiss(); });
  const booted = () => page.waitForFunction(() => !!window.QadenceApp, null, { timeout: 15000 });

  await page.goto(base); await booted();
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('sqaPracticeRoom.auth.v1', JSON.stringify({ username: 'Admin', signedInAt: new Date().toISOString() })); localStorage.setItem('sqaPracticeRoom.prefs.v1', JSON.stringify({ onboarded: true })); });
  await page.goto(base + '#/workspace'); await page.reload(); await booted(); await page.waitForTimeout(300);
  await page.evaluate(() => { const d = document.querySelector('dialog[open]'); if (d) d.close(); });

  const runAndWait = async (ms = 15000) => {
    await page.click('#ideRun');
    await page.waitForFunction(() => window.QadenceIDE && !window.QadenceIDE.running && window.QadenceIDE.results && window.QadenceIDE.results.done, null, { timeout: ms });
    await page.waitForTimeout(80);
    return page.evaluate(() => JSON.parse(JSON.stringify(window.QadenceIDE.results)));
  };
  const setCode = async code => { await page.fill('#scriptEditor', code); };

  ok('IDE renders editor, preview and runner card', await page.isVisible('#scriptEditor') && await page.isVisible('#targetAppView input') && /Runs in your browser/.test(await page.textContent('#ideRunnerCard')));
  ok('syntax highlighting renders tokens', await page.$$eval('#pane-code .ce-hl .t-kw', e => e.length) > 0 && await page.$$eval('#pane-code .ce-gutter span', e => e.length) > 5);

  // 1. starter runs: actions pass, assertions are TODOs → "no assertions" flag
  let r = await runAndWait();
  ok('starter runs and collects 2 tests', r.tests.length === 2 && r.tests.every(t => t.status === 'passed'), r.tests.map(t => t.status).join(','));
  ok('starter test is flagged as having no assertions', await page.isVisible('#ideTests .tr-flag'));
  ok('starter test drove the preview (goto, 2 fills, click)', r.tests[0].steps.length === 4 && /getByRole\('button', \{ name: 'Sign in' \}\)\.click\(\)/.test(r.tests[0].steps[3].title) && /'••••••'/.test(r.tests[0].steps[2].title), r.tests[0].steps.map(x => x.title).join(' | '));

  // 2. a real passing test
  await setCode(`import { test, expect } from '@playwright/test';\n\ntest('employee can sign in', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByLabel('Username').fill('qa.learner@peopleops.local');\n  await page.getByLabel('Password').fill('LabPass123');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByText('Signed in')).toBeVisible();\n  await expect(page.getByLabel('Username')).toHaveValue('qa.learner@peopleops.local');\n});\n`);
  r = await runAndWait();
  ok('passing test passes with assertions and steps', r.tests.length === 1 && r.tests[0].status === 'passed' && r.tests[0].assertions === 2 && r.tests[0].steps.length >= 6, JSON.stringify(r.tests[0] && { s: r.tests[0].status, a: r.tests[0].assertions, n: r.tests[0].steps.length }));
  ok('status bar reports the result', /1 passed · 0 failed/.test(await page.textContent('#ideRunState')));

  // 3. failing assertion → expected vs received + correct line + go to line
  await setCode(`test('shows a welcome banner', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n\n  await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 500 });\n});\n`);
  r = await runAndWait();
  const t = r.tests[0] || {};
  ok('failing assertion fails with expected/received', t.status === 'failed' && /Expected: visible/.test(t.error.message) && /Received: element not found/.test(t.error.message), t.error && t.error.message);
  ok('failure points at the expect() line', t.error && t.error.line === 5, 'line ' + (t.error && t.error.line));
  await page.click('#ideTests [data-goto-line]');
  const caretLine = await page.evaluate(() => { const ta = document.getElementById('scriptEditor'); return ta.value.slice(0, ta.selectionStart).split('\n').length; });
  ok('Go to line moves the caret and marks the gutter', caretLine === 5 && await page.$$eval('#pane-code .ce-gutter span.err', e => e.length) === 1);

  // 4. strict mode violation
  await setCode(`test('ambiguous locator', async ({ page }) => {\n  await page.goto('/login');\n  await page.locator('input').fill('x');\n});\n`);
  r = await runAndWait();
  ok('strict mode violation is explained', r.tests[0].status === 'failed' && /strict mode violation/.test(r.tests[0].error.message) && /2 elements/.test(r.tests[0].error.message));

  // 5. plain JavaScript + console output, escaped
  await setCode(`const nums = [1, 2, 3];\nconsole.log(nums.map(n => n * 2));\nconsole.log('<img src=x onerror="window.__xss=1">');\nconsole.warn({ ok: true });\n`);
  r = await runAndWait();
  const out = await page.textContent('#ideConsole');
  ok('plain JS runs and prints to Output', r.plain && /\[ 2, 4, 6 \]/.test(out) && /\{ ok: true \}/.test(out));
  ok('console output is shown as text (no HTML injection)', out.includes('<img src=x') && await page.$$eval('#ideConsole img', e => e.length) === 0 && !(await page.evaluate(() => window.__xss)));

  // 6. network is blocked inside the sandbox
  await setCode(`try { await fetch('https://example.com'); console.log('reached the network'); } catch (e) { console.log('blocked: ' + e.message); }\ntry { new XMLHttpRequest(); } catch (e) { console.log('xhr blocked'); }\n`);
  r = await runAndWait();
  const net = await page.textContent('#ideConsole');
  ok('fetch and XMLHttpRequest are blocked', /blocked: fetch is disabled/.test(net) && /xhr blocked/.test(net) && !/reached the network/.test(net));

  // 6b. forged worker messages cannot inject HTML; other network routes are closed too
  await setCode(`postMessage({ type: 'collected', tests: [{ id: '"><img src=x onerror="window.__pwn=1">', title: '<img src=x onerror="window.__pwn=2">' }] });\npostMessage({ type: 'testEnd', id: 0, status: 'x"><img src=x onerror="window.__pwn=3">', error: { message: '<img src=x onerror="window.__pwn=4">', line: '"><img src=x onerror="window.__pwn=5">' } });\npostMessage({ type: 'log', level: 'x"><img src=x onerror="window.__pwn=6">', text: '<img src=x onerror="window.__pwn=7">' });\npostMessage({ type: 'cmd', id: 1, cmd: 'constructor', args: {} });\npostMessage({ type: 'done', ms: 'x', error: { message: 'forged', line: '<img src=x onerror="window.__pwn=8">' } });\n`);
  await runAndWait();
  await page.waitForTimeout(300);
  ok('forged worker messages are rendered inert', await page.$$eval('#ideTests img, #ideConsole img', e => e.length) === 0 && !(await page.evaluate(() => window.__pwn)));
  await setCode(`try { const c = await caches.open('q'); await c.add('https://example.com/'); console.log('cache fetched'); } catch (e) { console.log('cache blocked'); }`);
  await runAndWait();
  ok('Cache API cannot reach the network either', /cache blocked/.test(await page.textContent('#ideConsole')) && !/cache fetched/.test(await page.textContent('#ideConsole')));

  // 7. infinite loop is stopped and the next run still works
  await setCode(`console.log('start');\nwhile (true) {}\n`);
  r = await runAndWait(20000);
  ok('infinite loop is stopped by the watchdog', r.done && r.error && /infinite loop/.test(r.error.message));
  await setCode(`console.log('after loop');`);
  r = await runAndWait();
  ok('the next run works after a stop', r.plain && !r.error && /after loop/.test(await page.textContent('#ideConsole')));

  // 8. TypeScript annotations get a friendly message
  await setCode(`const count: number = 1;\nconsole.log(count);`);
  r = await runAndWait();
  ok('TypeScript syntax gets a clear hint', !!r.compileError && r.compileError.ts && /TypeScript/.test(await page.textContent('#ideTests')));

  // 9. Cypress subset
  await page.selectOption('#frameworkSelect', 'Cypress · JavaScript'); await page.waitForTimeout(150);
  ok('Cypress starter loads with .cy.js file name', /cy\.visit/.test(await page.inputValue('#scriptEditor')) && (await page.textContent('#ideFileName')) === 'draft.cy.js');
  await setCode(`describe('PeopleOps sign-in', () => {\n  it('signs in', () => {\n    cy.visit('/login');\n    cy.contains('label', 'Password').find('input').clear().type('LabPass123');\n    cy.contains('button', 'Sign in').click();\n    cy.contains('Signed in').should('be.visible');\n  });\n  it('fails on a wrong expectation', () => {\n    cy.visit('/login');\n    cy.get('#targetAppResult').should('contain', 'Dashboard ready');\n  });\n});\n`);
  r = await runAndWait();
  ok('Cypress tests run (1 pass, 1 fail)', r.tests.length === 2 && r.tests[0].status === 'passed' && r.tests[1].status === 'failed', r.tests.map(x => x.status).join(','));

  // 10. Postman against the API Sandbox response
  await page.evaluate(() => window.beginChallenge('api-contract', { silent: true })); await page.waitForTimeout(200);
  ok('switching challenge updates title, framework and preview', /API Sandbox/.test(await page.textContent('#workspaceTitle')) && (await page.inputValue('#frameworkSelect')) === 'Postman' && await page.isVisible('#embeddedEndpoint'));
  await setCode(`pm.test('returns the employee', () => {\n  pm.response.to.have.status(200);\n  const body = pm.response.json();\n  pm.expect(body).to.have.property('id', 'EMP-104');\n  pm.expect(body.role).to.be.a('string');\n});\npm.test('missing employee is 404', () => {\n  pm.response.to.have.status(404);\n});\n`);
  r = await runAndWait();
  ok('Postman pm tests run against the sandbox response', r.tests.length === 2 && r.tests[0].status === 'passed' && r.tests[0].assertions === 3 && r.tests[1].status === 'failed' && /status code 404 but got 200/.test(r.tests[1].error.message));

  // 11. Python is not runnable
  await page.selectOption('#frameworkSelect', 'Selenium · Python'); await page.waitForTimeout(150);
  ok('Selenium/Python disables Run with a reason', await page.isDisabled('#ideRun') && /Python runs on your machine/.test(await page.textContent('#ideTests')));
  await page.selectOption('#frameworkSelect', 'Postman'); await page.waitForTimeout(100);

  // 12. editor keyboard: Tab indents, undo works, Esc then Tab leaves
  await page.evaluate(() => window.beginChallenge('peopleops-login', { silent: true })); await page.waitForTimeout(150);
  await page.fill('#scriptEditor', 'abc');
  await page.focus('#scriptEditor'); await page.keyboard.press('End'); await page.keyboard.press('Home');
  await page.keyboard.press('Tab');
  ok('Tab inserts two spaces', (await page.inputValue('#scriptEditor')) === '  abc');
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
  ok('undo reverts the indent', (await page.inputValue('#scriptEditor')) === 'abc');
  await page.keyboard.press('End'); await page.keyboard.type('{'); await page.keyboard.press('Enter');
  ok('Enter after { auto-indents', (await page.inputValue('#scriptEditor')) === 'abc{\n  ');
  await page.keyboard.press('Escape'); await page.keyboard.press('Tab');
  ok('Esc then Tab moves focus out of the editor', await page.evaluate(() => document.activeElement && document.activeElement.id !== 'scriptEditor'));

  // 13. Ctrl+Enter runs; submit records the run
  await setCode(`test('signs in', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByText('Signed in')).toBeVisible();\n});\n`);
  await page.focus('#scriptEditor');
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter');
  await page.waitForFunction(() => window.QadenceIDE.results && window.QadenceIDE.results.done && !window.QadenceIDE.running, null, { timeout: 15000 });
  ok('Ctrl+Enter runs the code', (await page.evaluate(() => window.QadenceIDE.results.tests[0].status)) === 'passed');
  await page.click('#submitWorkspace'); await page.waitForTimeout(200);
  const sub = await page.evaluate(() => JSON.parse(localStorage.getItem('sqaPracticeRoom.v1')).submissions[0]);
  ok('submission records the sandbox run', sub && sub.executed === true && sub.run && sub.run.passed === 1 && sub.run.total === 1);
  ok('submit opens the review guide with feedback', await page.isVisible('#submitFeedback') && /1 of 1 tests passed/.test(await page.textContent('#submitRunNote')));

  // 14. phone layout
  await page.setViewportSize({ width: 390, height: 860 }); await page.waitForTimeout(200);
  ok('phone: view switcher shown, no horizontal overflow', await page.isVisible('.ide-views') && await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await page.click('[data-ide-view="preview"]'); await page.waitForTimeout(100);
  ok('phone: Preview view shows the app', await page.isVisible('#targetAppView') && !(await page.isVisible('#scriptEditor')));
  await page.click('[data-ide-view="code"]'); await page.waitForTimeout(100);
  ok('phone: Code view shows the editor', await page.isVisible('#scriptEditor'));
  await setCode(`test('signs in on a phone', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByLabel('Password').fill('LabPass123');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByText('Signed in')).toBeVisible();\n});\n`);
  r = await runAndWait();
  ok('phone: a run drives the preview and passes', r.tests[0] && r.tests[0].status === 'passed', r.tests[0] && (r.tests[0].error || {}).message);
  await page.waitForTimeout(900);
  ok('phone: results view follows the run', (await page.getAttribute('#ide', 'data-view')) === 'output' && await page.isVisible('#ideTests .tr-sum'));

  ok('no console errors / native dialogs', errors.length === 0, errors.slice(0, 4).join(' | '));
  await browser.close();
  const failed = results.filter(x => !x).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
})().catch(e => { console.error(e); process.exitCode = 2; });
