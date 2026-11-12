// Feature checks for the new Qadence modules. Usage: node features.js http://127.0.0.1:8765/
const { chromium, firefox } = require('playwright-core');
const engine = process.env.BROWSER === 'firefox' ? firefox : chromium;
const fs = require('fs');
const base = process.argv[2] || 'http://127.0.0.1:8765/';
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? '  — ' + info : ''}`); };
const st = page => page.evaluate(() => JSON.parse(localStorage.getItem('sqaPracticeRoom.v1') || '{}'));
async function go(page, hash) { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(350); }
async function overflow(page) {
  return page.evaluate(() => {
    const W = document.documentElement.clientWidth; let n = 0, first = '';
    for (const el of document.querySelectorAll('#appShell *')) {
      if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
          if (el.closest('.sidebar') && !document.querySelector('.shell.drawer-open')) continue;   // closed drawer is off-screen by design
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > W + 1 || r.left < -1)) {
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body && p !== document.documentElement) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 1 && pr.left >= -1) { clipped = true; break; } } p = p.parentElement; }
        if (!clipped) { n++; if (!first) first = el.tagName + '.' + String(el.className).slice(0, 40); }
      }
    }
    return { n, first };
  });
}

(async () => {
  const browser = await engine.launch();
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('dialog', d => { errors.push('native dialog: ' + d.message()); d.dismiss(); });

  await page.goto(base); await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.click('[data-open-login]'); await page.click('#authForm [type=submit]'); await page.waitForTimeout(400);

  // onboarding
  ok('onboarding card shows for a new learner', await page.isVisible('#onboardForm'));
  await page.fill('#obName', 'Sara Khan'); await page.selectOption('#obRole', 'QA Analyst'); await page.click('[data-ob-level="beginner"]');
  await page.click('#onboardForm [type=submit]'); await page.waitForTimeout(300);
  ok('greeting uses the profile name', /Sara/.test(await page.textContent('.dash-hero h1')));
  ok('avatar initials update', (await page.textContent('#topAvatar')).trim() === 'SK');

  // academy catalog
  await go(page, '#/academy');
  const cards = await page.$$eval('.lesson-card', els => els.length);
  const totalLessons = await page.evaluate(() => LESSONS.length);
  ok('catalog lists every lesson', cards === totalLessons && totalLessons >= 80, `${cards} cards of ${totalLessons}`);
  await page.click('[data-lvl="advanced"]'); await page.waitForTimeout(200);
  const lv = await page.$$eval('.lesson-card .lvl', els => [...new Set(els.map(e => e.className))]);
  ok('level filter shows only advanced', lv.length === 1 && /advanced/.test(lv[0]), lv.join(','));
  await page.click('[data-lvl="all"]');
  await page.fill('#acadFilter', 'boundary'); await page.waitForTimeout(300);
  ok('text filter narrows lessons', (await page.$$eval('.lesson-card', e => e.length)) >= 1 && (await page.$$eval('.lesson-card', e => e.length)) < 10);

  // lesson
  await go(page, '#/academy/lesson/mt-boundary');
  ok('lesson renders all sections incl. visual guide', (await page.$$eval('#academy .lesson-sec', e => e.length)) === 11 && await page.isVisible('#sec-visuals'));
  const l = await page.evaluate(() => { const x = LESSON_BY_ID.get('mt-boundary'); return { correct: x.quiz[0].correct, n: x.quiz[0].options.length }; });
  const wrong = (l.correct + 1) % l.n;
  await page.click(`#lq-mt-boundary-0 input[value="${wrong}"]`, { force: true }); await page.click('#lq-mt-boundary-0 [data-check]'); await page.waitForTimeout(150);
  ok('wrong answer shows explanation', (await page.$$eval('#lq-mt-boundary-0 .why', e => e.length)) >= 1 && /Not quite/.test(await page.textContent('#lq-mt-boundary-0 .feedback')));
  await page.click(`#lq-mt-boundary-0 input[value="${l.correct}"]`, { force: true }); await page.click('#lq-mt-boundary-0 [data-check]'); await page.waitForTimeout(150);
  let s = await st(page);
  ok('quiz answer saved (correct, not first try)', s.academy.quiz['mt-boundary'][0].correct === true && s.academy.quiz['mt-boundary'][0].firstTry === false);
  await page.click('[data-reveal="0"]'); await page.click('[data-mark="0:got"]'); await page.waitForTimeout(150);
  s = await st(page); ok('practice self-mark saved', s.academy.practice['mt-boundary'][0] === 'got');
  await page.click('[data-explain="hi"]'); await page.waitForTimeout(100);
  ok('explanation switches language', (await page.getAttribute('#explainBody .explain-body', 'lang')) === 'hi');
  await page.fill('#lessonNotes', 'Edges: 0,1,10,11 <script>alert(1)</script>'); await page.waitForTimeout(800);
  await page.click('#lessonComplete'); await page.waitForTimeout(300);
  s = await st(page); ok('lesson completion saved', !!s.academy.completed['mt-boundary']);
  const xp = Number(await page.textContent('#xpChip b'));
  ok('XP increases after completion', xp >= 50, `${xp} XP`);
  await page.reload(); await page.waitForTimeout(500);
  ok('notes persist across reload and render as text', (await page.inputValue('#lessonNotes')).includes('<script>') && !(await page.$('#lessonNotes ~ script')));
  ok('deep link restores the lesson after reload', /Boundary value analysis/.test(await page.textContent('#lessonTitle')));

  // tests: quick quiz
  await go(page, '#/tests/quick');
  ok('quick quiz starts', await page.isVisible('.q-card'));
  const qn = await page.$$eval('#tests .palette button', e => e.length);
  for (let i = 0; i < qn; i++) { await page.click('#tests .opt-list .opt >> nth=0'); if (i < qn - 1) await page.click('#runNext'); }
  await page.click('#runSubmit'); await page.waitForTimeout(400);
  ok('result page shows score', await page.isVisible('.result-hero'));
  ok('review lists every question', (await page.$$eval('.review-item', e => e.length)) === qn, `${qn}`);
  s = await st(page); ok('test result saved with answers', s.tests.length === 1 && s.tests[0].answers.length === qn);
  // scenario
  await go(page, '#/tests/scenario/sc-login-release');
  await page.click('#goRun'); await page.waitForTimeout(250);
  ok('scenario runner shows the brief', await page.isVisible('.brief-panel'));
  const sn = await page.$$eval('#tests .palette button', e => e.length);
  for (let i = 0; i < sn; i++) { await page.click('#tests .opt-list .opt >> nth=0'); if (i < sn - 1) await page.click('#runNext'); }
  await page.click('#runSubmit'); await page.waitForTimeout(400);
  s = await st(page); ok('scenario result saved', s.tests.length === 2 && s.tests[1].kind === 'scenario');
  // level exam timer + unanswered confirm uses in-page dialog
  await go(page, '#/tests/level/beginner'); await page.click('#goRun'); await page.waitForTimeout(1300);
  ok('level exam shows a countdown', /24:5\d|25:00/.test(await page.textContent('#runTimer')));
  await page.click('#runSubmit'); await page.waitForTimeout(200);
  ok('unanswered submit asks in an in-page dialog', await page.isVisible('#appDialog'));
  await page.click('#appDialogActions [data-dlg="0"]');
  await go(page, '#/tests');
  ok('hub offers to resume the running test', /Test in progress/.test(await page.textContent('#tests')));

  // drills of every type
  for (const type of ['classify', 'order', 'spot', 'fill']) {
    const id = await page.evaluate(t => CONTENT.drills.find(d => d.type === t).id, type);
    await go(page, '#/drills/' + id);
    if (type === 'classify') { const n = await page.$$eval('.cls-item', e => e.length); for (let i = 0; i < n; i++) await page.click(`[data-cls="${i}:0"]`); }
    if (type === 'order') { await page.click('[data-mv="1:-1"]'); }
    if (type === 'spot') { await page.click('#drills .spot-line >> nth=0'); }
    if (type === 'fill') { const n = await page.$$eval('[data-fill]', e => e.length); for (let i = 0; i < n; i++) await page.fill(`#fill-${i}`, 'x'); }
    await page.click('#drCheck'); await page.waitForTimeout(200);
    s = await st(page); ok(`${type} drill checks and saves`, !!s.drills[id] && await page.isVisible('#drRetry'));
  }
  // correct answers give 100
  const perfect = await page.evaluate(() => CONTENT.drills.find(d => d.type === 'fill'));
  await go(page, '#/drills/' + perfect.id); await page.click('#drRetry').catch(() => {});
  for (let i = 0; i < perfect.fields.length; i++) await page.fill(`#fill-${i}`, perfect.fields[i].accept[0]);
  await page.click('#drCheck'); await page.waitForTimeout(200);
  s = await st(page); ok('accepted answers score 100%', s.drills[perfect.id].best === 100);

  // profile + theme
  await go(page, '#/profile');
  await page.fill('#pfName', 'Sara Ahmed'); await page.click('[data-color="#7C3AED"]'); await page.click('#profileForm [type=submit]'); await page.waitForTimeout(250);
  ok('profile edit saves and updates avatar', (await page.textContent('#topAvatar')).trim() === 'SA');
  await page.click('[data-theme-set="dark"]'); await page.waitForTimeout(100);
  ok('dark theme applies', (await page.getAttribute('html', 'data-theme')) === 'dark');
  ok('badges render', (await page.$$eval('.badge-tile.earned', e => e.length)) >= 1);

  // second profile: switch and back
  await page.fill('#newProfileName', 'Ali'); await page.click('#addProfileForm [type=submit]'); await page.waitForTimeout(200);
  await Promise.all([page.waitForNavigation(), page.click('#appDialogActions [data-dlg="1"]')]); await page.waitForTimeout(600);
  const fresh = await page.evaluate(() => ({ completed: Object.keys(state.academy.completed).length, key: KEY }));
  ok('new profile starts fresh under its own key', fresh.completed === 0 && fresh.key !== 'sqaPracticeRoom.v1', fresh.key);
  await go(page, '#/profile');
  await Promise.all([page.waitForNavigation(), page.click('[data-switch-profile="default"]')]); await page.waitForTimeout(600);
  s = await st(page); ok('switching back keeps original progress', !!s.academy.completed['mt-boundary'] && s.profile.name === 'Sara Ahmed');

  // RTL + overflow
  await page.evaluate(() => QA_I18N.set('ur')); await page.waitForTimeout(300);
  ok('Urdu switches the document to RTL', (await page.getAttribute('html', 'dir')) === 'rtl');
  for (const w of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const h of ['#/home', '#/academy', '#/academy/lesson/sa-api-basics', '#/academy/lesson/fd-stlc', '#/academy/stage/automation', '#/tests', '#/tests/scenario/sc-orders-api', '#/drills', '#/profile', '#/progress', '#/settings', '#/practice', '#/lab', '#/challenges', '#/workspace', '#/submissions', '#/learning']) {
      await go(page, h);
      const o = await overflow(page);
      ok(`no overflow ${h} @${w} (rtl)`, o.n === 0, o.n ? `${o.n} e.g. ${o.first}` : '');
    }
  }
  await page.evaluate(() => QA_I18N.set('en')); await page.setViewportSize({ width: 390, height: 860 });
  for (const h of ['#/home', '#/academy/lesson/au-ci', '#/tests/result/' + s.tests[0].id, '#/drills/' + perfect.id]) {
    await go(page, h); const o = await overflow(page); ok(`no overflow ${h} @390 (ltr)`, o.n === 0, o.n ? `${o.n} e.g. ${o.first}` : '');
  }
  await page.setViewportSize({ width: 1440, height: 900 });

  // v2: Learning Lab views, collections, visual guides, languages
  await go(page, '#/academy');
  await page.click('[data-view="topics"]'); await page.waitForTimeout(200);
  ok('topics view groups lessons by concept', (await page.$$eval('#academy .topic-block', e => e.length)) >= 8);
  await page.click('[data-view="map"]'); await page.waitForTimeout(200);
  ok('concept map shows every lesson as a stop', (await page.$$eval('#academy .cmap-stop', e => e.length)) === (await page.evaluate(() => LESSONS.length)));
  await page.click('[data-view="path"]'); await page.click('[data-coll="istqb"]'); await page.waitForTimeout(200);
  const istqb = await page.evaluate(() => COLLECTIONS.find(c => c.id === 'istqb').lessons.length);
  ok('collection filter narrows to the ISTQB set', (await page.$$eval('#academy .lesson-card', e => e.length)) === istqb, `${istqb}`);
  await page.click('[data-coll="istqb"]');
  const visLesson = await page.evaluate(() => (LESSONS.find(l => (l.visuals || []).length >= 2) || {}).id);
  await go(page, '#/academy/lesson/' + visLesson);
  ok('lesson shows a visual guide with rendered diagrams', (await page.$$eval('#sec-visuals .dg', e => e.length)) >= 2 && (await page.$$eval('#sec-visuals .dg-body > *', e => e.length)) >= 2);
  await page.click('[data-explain="zh"]'); await page.waitForTimeout(100);
  ok('explanation picker includes Chinese', (await page.getAttribute('#explainBody .explain-body', 'lang')) === 'zh');
  await page.click('[data-explain="fr"]'); await page.waitForTimeout(100);
  ok('explanation picker includes French', (await page.getAttribute('#explainBody .explain-body', 'lang')) === 'fr');
  ok('every lesson renders all its diagrams without errors', await page.evaluate(() => LESSONS.every(l => (l.visuals || []).every(b => !/could not be drawn/.test(QA_DIAGRAMS.render(b))))));

  // v2: interview question bank, flashcards, mock interview
  await go(page, '#/practice');
  const qCount = await page.$$eval('#interviewBank .iv-q', e => e.length);
  ok('question bank lists questions', qCount >= 10, `${qCount} shown`);
  await page.click('#interviewBank [data-cat="api"]'); await page.waitForTimeout(200);
  ok('category filter shows only API questions', await page.$$eval('#interviewBank .iv-q', els => els.length > 0 && els.every(d => /API/.test(d.querySelector('.iv-meta').textContent))));
  await page.click('#interviewBank .iv-q summary'); await page.waitForTimeout(100);
  const firstId = await page.getAttribute('#interviewBank .iv-q', 'data-q');
  await page.click(`#interviewBank [data-mark="${firstId}:confident"]`); await page.waitForTimeout(150);
  s = await st(page); ok('rating a question persists', s.interviewBank.marks[firstId] === 'confident');
  await go(page, '#/practice/flash');
  await page.click('#flashCard'); await page.waitForTimeout(150);
  ok('flashcard flips to the answer', await page.$eval('#flashCard', e => e.classList.contains('flipped')));
  await page.click('[data-flash="know"]'); await page.waitForTimeout(150);
  ok('flashcard advances after rating', /Card 2/.test(await page.textContent('.flash-top')));
  await go(page, '#/practice/mock');
  await page.click('[data-mkc="4"]'); await page.click('#mkStart'); await page.waitForTimeout(150);
  for (let i = 0; i < 4; i++) { await page.click('#mkReveal'); await page.waitForTimeout(80); await page.click('[data-score="2"]'); await page.waitForTimeout(80); }
  s = await st(page); ok('mock interview completes and records a score', s.interviewBank.mocks.length === 1 && s.interviewBank.mocks[0].score === 67 && await page.isVisible('.mock-done'));
  await go(page, '#/practice/rounds'); await page.waitForTimeout(150);
  ok('practice rounds tab still shows the scored tracks', (await page.$$eval('[data-start-track]', e => e.filter(x => x.offsetParent).length)) >= 4);
  await go(page, '#/practice');
  await page.click('#interviewBank [data-cat="sql"]'); await page.waitForTimeout(150);
  await page.click('#interviewBank .iv-q summary'); await page.waitForTimeout(100);
  const rid = await page.getAttribute('#interviewBank .iv-q', 'data-q');
  await page.click(`#interviewBank [data-mark="${rid}:confident"]`); await page.waitForTimeout(120);
  await page.click(`#interviewBank [data-mark="${rid}:review"]`); await page.waitForTimeout(120);
  s = await st(page); ok('changing a rating on the same card saves the new value', s.interviewBank.marks[rid] === 'review');
  await go(page, '#/academy/lesson/mt-boundary');
  await page.click('#academy [data-interview-round]'); await page.waitForTimeout(350);
  ok('lesson → interview round shows only the session', await page.isVisible('#questionCard') && !(await page.isVisible('#interviewBank')) && !(await page.isVisible('#ivTabs')));
  ok('matrix diagrams expose a real table to screen readers', await page.evaluate(() => { const m = QA_DIAGRAMS.render({ t: 'matrix', title: 'T', x: { label: 'X', ticks: ['a', 'b'] }, y: { label: 'Y', ticks: ['c', 'd'] }, cells: [['1', '2'], ['3', '4']] }); return /<table>/.test(m) && !/role="table"/.test(m); }));

  // v2: visual career roadmap and data flow
  await go(page, '#/learning');
  ok('roadmap draws 8 stops and 3 milestone flags on the road', (await page.$$eval('.road-stop', e => e.length)) === 8 && (await page.$$eval('.road-flag', e => e.length)) === 3);
  ok('career ladder and specialisations render', (await page.$$eval('.ladder-step', e => e.length)) === 5 && (await page.$$eval('.branch', e => e.length)) >= 6);
  await page.click('.road-stop [data-open-stage="manual"]'); await page.waitForTimeout(250);
  ok('road stop opens the stage guide', await page.isVisible('#lessonDetail'));
  await go(page, '#/settings');
  ok('data & privacy shows the data-flow diagram', (await page.$$eval('#settings .priv-flow svg', e => e.length)) === 1);
  await page.evaluate(() => QA_I18N.set('ja')); await page.waitForTimeout(250);
  ok('Japanese interface applies', (await page.getAttribute('html', 'lang')) === 'ja' && (await page.getAttribute('html', 'dir')) === 'ltr');
  await page.evaluate(() => QA_I18N.set('en')); await page.waitForTimeout(150);

  // keyboard focus is visible on key controls
  await go(page, '#/home'); await page.keyboard.press('Tab');
  const focusRes = await page.evaluate(() => {
    const sels = ['#home .btn-light', '#home .btn-glass', '.quick-card', '.nav-item', '#themeToggle'];
    return sels.map(sel => { const el = document.querySelector(sel); if (!el) return sel + ':missing'; el.focus(); const cs = getComputedStyle(el); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) ? 'ok' : sel + ':' + cs.outlineStyle; });
  });
  ok('keyboard focus ring visible on buttons, cards, nav', focusRes.every(x => x === 'ok'), focusRes.filter(x => x !== 'ok').join(', '));
  await go(page, '#/profile'); await page.keyboard.press('Tab');
  const segRes = await page.evaluate(() => ['#profile .seg button[aria-pressed="true"]', '#profile .swatch[aria-checked="true"]', '#profileForm .btn-primary'].map(sel => { const el = document.querySelector(sel); if (!el) return sel + ':missing'; el.focus(); return getComputedStyle(el).outlineStyle !== 'none' ? 'ok' : sel; }));
  ok('focus ring visible on pressed segments, swatches, primary button', segRes.every(x => x === 'ok'), segRes.filter(x => x !== 'ok').join(', '));

  // export / import of v3 data
  await go(page, '#/settings');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#profileExport')]);
  const backup = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  ok('export includes v3 slices, no password', backup.version === 3 && !!backup.state.academy && Array.isArray(backup.state.tests) && !!backup.state.profile && !JSON.stringify(backup).includes('admin@123'));
  backup.state.academy.completed['not-a-lesson'] = '2026-01-01'; backup.state.tests[0].score = 9999; backup.state.profile.name = '<img src=x onerror=alert(1)>'.repeat(3); backup.state.password = 'admin@123';
  const file = require('path').join(require('os').tmpdir(), `qadence-hostile-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(backup));
  await page.setInputFiles('#profileImportFile', file); await page.waitForTimeout(300);
  await page.click('#appDialogActions [data-dlg="2"]'); await page.waitForTimeout(400);
  s = await st(page);
  ok('hostile import is normalised', !s.academy.completed['not-a-lesson'] && s.tests[0].score <= 100 && s.profile.name.length <= 40 && !('password' in s));
  await go(page, '#/home');
  ok('hostile name renders inert', !(await page.$('.dash-hero h1 img')));

  ok('no console errors / native dialogs', errors.length === 0, errors.slice(0, 6).join(' | '));
  await browser.close();
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
})().catch(e => { console.error(e); process.exitCode = 2; });
