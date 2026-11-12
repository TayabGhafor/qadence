/* Qadence · Code workspace: a minimal in-browser IDE.
   - Editor: syntax highlighting, line numbers, current line, Tab indent, auto-indent, Ctrl+/ comments,
     Ctrl+Enter run, Ctrl+S save, Esc-then-Tab to leave (no keyboard trap). Undo keeps working.
   - Runner: user code runs in a fresh Web Worker (no DOM, no storage, network APIs disabled) with a
     watchdog that terminates it. Page actions are sent as messages to a driver that only touches the
     live preview (#targetAppView). Supports plain JavaScript, a Playwright-style API, a Cypress
     subset and Postman pm tests. Python/Manual drafts are saved but never "run".
   Builds on legacy-core.js (beginChallenge, defaultScript, saveWorkspaceDraft, renderTargetApp, …). */
(function () {
  'use strict';
  const ide = document.getElementById('ide');
  if (!ide || typeof beginChallenge !== 'function') return;
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(s == null ? '' : String(s));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ───────────── frameworks ───────────── */
  const FW = {
    'Playwright · TypeScript': { mode: 'playwright', lang: 'js', file: 'draft.spec.js', ext: 'js', label: 'JavaScript · Playwright API' },
    'Cypress · JavaScript': { mode: 'cypress', lang: 'js', file: 'draft.cy.js', ext: 'js', label: 'JavaScript · Cypress API' },
    Postman: { mode: 'postman', lang: 'js', file: 'tests.postman.js', ext: 'js', label: 'JavaScript · Postman pm' },
    'Selenium · Python': { mode: 'python', lang: 'py', file: 'test_draft.py', ext: 'py', label: 'Python', runnable: false },
    Manual: { mode: 'manual', lang: 'md', file: 'test-plan.md', ext: 'md', label: 'Markdown', runnable: false }
  };
  const fwOf = v => FW[v] || FW['Playwright · TypeScript'];
  const curFw = () => fwOf($('frameworkSelect').value);
  const HOST = { login: 'peopleops.sim', api: 'api.sandbox.sim', checkout: 'shopflow.sim', bughunt: 'shopflow.sim', ui: 'ui-playground.sim', mobile: 'mobile-lab.sim' };
  const PATH = { login: '/login', api: '/api', checkout: '/cart', bughunt: '/cart', ui: '/employees', mobile: '/upload' };

  /* ───────────── runnable starters (assertions left as TODOs on purpose) ───────────── */
  const PW = {
    login: [`test('employee can sign in', async ({ page }) => {`, `  await page.goto('/login');`, `  await page.getByLabel('Username').fill('qa.learner@peopleops.local');`, `  await page.getByLabel('Password').fill('LabPass123');`, `  await page.getByRole('button', { name: 'Sign in' }).click();`, `  // TODO: assert that the signed-in message is visible`, `});`, ``, `test('wrong password shows a safe error', async ({ page }) => {`, `  await page.goto('/login');`, `  // TODO: fill the username and a wrong password, sign in,`, `  //       then assert the error message is visible`, `});`],
    checkout: [`test('SAVE10 discounts merchandise only', async ({ page }) => {`, `  await page.goto('/cart');`, `  await page.getByLabel('Promotion').selectOption('SAVE10');`, `  await page.getByRole('button', { name: 'Recalculate' }).click();`, `  // TODO: assert the total: $48.00 - 10% + $6.00 shipping = $49.20`, `});`],
    ui: [`test('filter shows matching employees', async ({ page }) => {`, `  await page.goto('/employees');`, `  await page.getByLabel('Filter employees').fill('quality');`, `  await page.getByRole('button', { name: 'Apply filter' }).click();`, `  // TODO: assert both Quality Engineering employees are listed`, `});`, ``, `test('no match shows an empty state', async ({ page }) => {`, `  await page.goto('/employees');`, `  // TODO: filter by a name that does not exist and assert the empty state`, `});`],
    api: [`test('API Sandbox returns the employee', async ({ page }) => {`, `  await page.goto('/api');`, `  await page.getByLabel('Endpoint').fill('/api/employees/104');`, `  await page.getByRole('button', { name: 'Send' }).click();`, `  // TODO: assert the response shows status 200 and the employee id`, `});`],
    mobile: [`test('upload stays paused while offline', async ({ page }) => {`, `  await page.goto('/upload');`, `  await page.getByLabel('Simulate offline network').check();`, `  await page.getByRole('button', { name: 'Resume upload' }).click();`, `  // TODO: assert the progress stays at 68% while offline`, `});`]
  };
  const CY = {
    login: [`describe('PeopleOps sign-in', () => {`, `  it('employee can sign in', () => {`, `    cy.visit('/login');`, `    cy.contains('label', 'Username').find('input').clear().type('qa.learner@peopleops.local');`, `    cy.contains('label', 'Password').find('input').clear().type('LabPass123');`, `    cy.contains('button', 'Sign in').click();`, `    // TODO: assert that the signed-in message is visible`, `  });`, `});`],
    checkout: [`describe('ShopFlow cart', () => {`, `  it('SAVE10 discounts merchandise only', () => {`, `    cy.visit('/cart');`, `    cy.contains('label', 'Promotion').find('select').select('SAVE10');`, `    cy.contains('button', 'Recalculate').click();`, `    // TODO: assert the total is $49.20`, `  });`, `});`],
    ui: [`describe('Employee table', () => {`, `  it('filters by team', () => {`, `    cy.visit('/employees');`, `    cy.contains('label', 'Filter employees').find('input').type('quality');`, `    cy.contains('button', 'Apply filter').click();`, `    // TODO: assert the matching rows are shown`, `  });`, `});`],
    api: [`describe('API Sandbox', () => {`, `  it('returns the employee', () => {`, `    cy.visit('/api');`, `    cy.contains('button', 'Send').click();`, `    // TODO: assert the response contains EMP-104`, `  });`, `});`],
    mobile: [`describe('Mobile upload', () => {`, `  it('pauses while offline', () => {`, `    cy.visit('/upload');`, `    cy.contains('label', 'Simulate offline network').find('input').check();`, `    cy.contains('button', 'Resume upload').click();`, `    // TODO: assert the progress stays at 68%`, `  });`, `});`]
  };
  const labKey = lab => (lab === 'bughunt' ? 'checkout' : PW[lab] ? lab : 'login');
  const baseDefaultScript = defaultScript;
  defaultScript = function (framework) {
    const lab = labKey(activeChallenge && activeChallenge.lab), target = (activeChallenge && activeChallenge.target) || 'the app';
    const fw = fwOf(framework);
    const head = `// Runs in your browser against the live ${target} simulation (right).\n// Press Run (Ctrl+Enter). Finish the TODOs, then Submit.\n`;
    if (fw.mode === 'playwright') return `${head}import { test, expect } from '@playwright/test';\n\n${PW[lab].join('\n')}\n`;
    if (fw.mode === 'cypress') return `${head}${CY[lab].join('\n')}\n`;
    if (fw.mode === 'postman') return `// Runs against the API Sandbox response. Set the method and endpoint on the right.\n// Press Run (Ctrl+Enter). Finish the TODOs, then Submit.\npm.test('returns the employee profile', () => {\n  pm.response.to.have.status(200);\n  const body = pm.response.json();\n  // TODO: check body.id, body.name and body.role\n});\n\n// TODO: add a negative test for /api/employees/missing (it should return 404)\n`;
    if (fw.mode === 'manual') return `# Test plan · ${target}\n\nScope: ${(activeChallenge && activeChallenge.scenario) || ''}\n\n1. Case:\n   Steps:\n   Expected:\n2. Case:\n   Steps:\n   Expected:\n\nRisks and test data notes:\n`;
    return baseDefaultScript(framework);
  };

  /* ───────────── syntax highlighting ───────────── */
  const JS_KW = new Set('await async break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return super switch this throw try typeof var void while with yield'.split(' '));
  const JS_LIT = new Set('true false null undefined NaN Infinity'.split(' '));
  const JS_API = new Set('test it describe context expect page cy pm require console beforeEach afterEach beforeAll afterAll'.split(' '));
  const PY_KW = new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
  const PY_LIT = new Set('True False None self'.split(' '));
  const span = (c, t) => `<span class="t-${c}">${esc(t)}</span>`;
  function hlJs(src) {
    const re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|(`(?:\\[\s\S]|[^\\`])*`?|'(?:\\.|[^\\'\n])*'?|"(?:\\.|[^\\"\n])*"?)|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_$][\w$]*)/g;
    let out = '', i = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(i, m.index)); i = re.lastIndex;
      if (m[1]) out += span('com', m[1]);
      else if (m[2]) out += span('str', m[2]);
      else if (m[3]) out += span('num', m[3]);
      else {
        const w = m[4], prev = src[m.index - 1], nextCh = (/^\s*(\S)/.exec(src.slice(re.lastIndex)) || [])[1];
        out += JS_KW.has(w) ? span('kw', w) : JS_LIT.has(w) ? span('lit', w) : prev === '.' ? span(nextCh === '(' ? 'fn' : 'prop', w) : JS_API.has(w) ? span('api', w) : nextCh === '(' ? span('fn', w) : esc(w);
      }
    }
    return out + esc(src.slice(i));
  }
  function hlPy(src) {
    const re = /(#[^\n]*)|("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|'(?:\\.|[^\\'\n])*'?|"(?:\\.|[^\\"\n])*"?)|(@[A-Za-z_][\w.]*)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][\w]*)/g;
    let out = '', i = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(i, m.index)); i = re.lastIndex;
      if (m[1]) out += span('com', m[1]); else if (m[2]) out += span('str', m[2]); else if (m[3]) out += span('api', m[3]); else if (m[4]) out += span('num', m[4]);
      else { const w = m[5], prev = src[m.index - 1], nextCh = (/^\s*(\S)/.exec(src.slice(re.lastIndex)) || [])[1]; out += PY_KW.has(w) ? span('kw', w) : PY_LIT.has(w) ? span('lit', w) : prev === '.' ? span(nextCh === '(' ? 'fn' : 'prop', w) : nextCh === '(' ? span('fn', w) : esc(w); }
    }
    return out + esc(src.slice(i));
  }
  function hlMd(src) {
    return src.split('\n').map(line => {
      const h = /^(#{1,6}\s.*)$/.exec(line); if (h) return span('kw', line);
      const li = /^(\s*)([-*+]|\d+\.)(\s.*)?$/.exec(line);
      const inline = s => esc(s).replace(/`([^`]+)`/g, '<span class="t-str">`$1`</span>').replace(/\*\*([^*]+)\*\*/g, '<span class="t-b">**$1**</span>');
      if (li) return esc(li[1]) + span('num', li[2]) + inline(li[3] || '');
      return inline(line);
    }).join('\n');
  }
  const highlight = (src, lang) => (lang === 'py' ? hlPy(src) : lang === 'md' ? hlMd(src) : hlJs(src));

  /* ───────────── editor ───────────── */
  /* Nothing is measured until the workspace is first shown (keeps the landing page's main thread free). */
  let activeEd = null, ready = false;
  class Editor {
    constructor(ta, lang) {
      this.ta = ta; this.lang = lang; this.root = ta.closest('.ce');
      this.code = this.root.querySelector('.ce-hl code'); this.pre = this.root.querySelector('.ce-hl');
      this.gut = this.root.querySelector('.ce-gutter'); this.cur = this.root.querySelector('.ce-line');
      this.n = 0; this.escaped = false; this.errLine = 0;
      ta.addEventListener('input', () => { this.errLine = 0; this.refresh(); });
      ta.addEventListener('scroll', () => this.sync());
      ['keyup', 'click', 'select', 'focus'].forEach(ev => ta.addEventListener(ev, () => { activeEd = this; this.caret(); }));
      ta.addEventListener('keydown', e => this.onKey(e));
      ta.addEventListener('blur', () => { this.escaped = false; });
    }
    metrics() { const cs = getComputedStyle(this.ta); return { lh: parseFloat(cs.lineHeight) || 22, pad: parseFloat(cs.paddingTop) || 14 }; }
    setLang(l) { this.lang = l; this.root.dataset.lang = l; this.refresh(); }
    refresh() {
      if (!ready) return;
      const v = this.ta.value;
      this.code.innerHTML = highlight(v, this.lang) + '\n';
      const n = v.split('\n').length;
      if (n !== this.n || this.errLine !== this.shownErr) { this.n = n; this.shownErr = this.errLine; this.gut.innerHTML = Array.from({ length: n }, (_, i) => `<span${i + 1 === this.errLine ? ' class="err"' : ''}>${i + 1}</span>`).join(''); }
      this.sync();
    }
    sync() { if (!ready) return; this.pre.scrollTop = this.ta.scrollTop; this.pre.scrollLeft = this.ta.scrollLeft; this.gut.scrollTop = this.ta.scrollTop; this.caret(); }
    caret() {
      if (!ready) return;
      const ta = this.ta, pos = ta.selectionStart, before = ta.value.slice(0, pos), ln = before.split('\n').length, col = pos - before.lastIndexOf('\n');
      const { lh, pad } = this.metrics();
      this.cur.style.transform = `translateY(${pad + (ln - 1) * lh - ta.scrollTop}px)`;
      this.cur.style.height = lh + 'px';
      if (this.ln !== ln) { this.gut.querySelector('.on')?.classList.remove('on'); this.gut.children[ln - 1]?.classList.add('on'); this.ln = ln; }
      if (activeEd === this) $('ideCursor').textContent = `Ln ${ln}, Col ${col}`;
    }
    insert(text) {
      const ta = this.ta; ta.focus();
      let ok = false; try { ok = document.execCommand('insertText', false, text); } catch (e) {}
      if (!ok) { ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    lineRange() { const v = this.ta.value, s = this.ta.selectionStart, e = this.ta.selectionEnd; const a = v.lastIndexOf('\n', s - 1) + 1; let b = v.indexOf('\n', e - (e > s && v[e - 1] === '\n' ? 1 : 0)); if (b < 0) b = v.length; return [a, b]; }
    mapLines(fn) {
      const ta = this.ta, [a, b] = this.lineRange(), lines = ta.value.slice(a, b).split('\n'), next = fn(lines).join('\n');
      ta.setSelectionRange(a, b); this.insert(next); ta.setSelectionRange(a, a + next.length);
    }
    onKey(e) {
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') { this.escaped = true; return; }
      if (e.key === 'Tab' && this.escaped) { this.escaped = false; return; }   // let focus move on
      if (!['Shift', 'Control', 'Meta', 'Alt'].includes(e.key)) this.escaped = false;
      if (mod && e.key === 'Enter') { e.preventDefault(); runOrStop(); return; }
      if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); saveWorkspaceDraft(true); return; }
      if (mod && e.key === '/') { e.preventDefault(); this.toggleComment(); return; }
      if (e.key === 'Tab' && !mod && !e.altKey) {
        e.preventDefault();
        const multi = this.ta.value.slice(this.ta.selectionStart, this.ta.selectionEnd).includes('\n');
        if (e.shiftKey) this.mapLines(ls => ls.map(l => l.replace(/^ {1,2}/, '')));
        else if (multi) this.mapLines(ls => ls.map(l => (l ? '  ' + l : l)));
        else this.insert('  ');
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !mod && !e.altKey && !e.isComposing) { e.preventDefault(); this.newline(); }
    }
    newline() {
      const ta = this.ta, v = ta.value, s = ta.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
      const ind = /^[ \t]*/.exec(line)[0], prev = line.trimEnd().slice(-1), next = v[ta.selectionEnd];
      if (this.lang === 'md') {
        const li = /^(\s*)([-*+]|(\d+)\.)\s+(.*)$/.exec(line);
        if (li && !li[4]) { ta.setSelectionRange(ls, s); this.insert(''); return; }   // empty bullet ends the list
        if (li) { this.insert('\n' + li[1] + (li[3] ? (+li[3] + 1) + '.' : li[2]) + ' '); return; }
        this.insert('\n' + ind); return;
      }
      const opens = this.lang === 'py' ? ':' : '{[(';
      if (prev && opens.includes(prev)) {
        const inner = ind + '  ';
        if (this.lang !== 'py' && next && ')]}'.includes(next)) { this.insert('\n' + inner + '\n' + ind); const p = s + 1 + inner.length; ta.setSelectionRange(p, p); this.caret(); }
        else this.insert('\n' + inner);
        return;
      }
      this.insert('\n' + ind);
    }
    toggleComment() {
      const tok = this.lang === 'py' ? '#' : this.lang === 'js' ? '//' : null; if (!tok) return;
      this.mapLines(lines => {
        const filled = lines.filter(l => l.trim());
        const all = filled.length && filled.every(l => l.trimStart().startsWith(tok));
        const minInd = Math.min(...filled.map(l => /^\s*/.exec(l)[0].length), 99);
        return lines.map(l => !l.trim() ? l : all ? l.replace(new RegExp('^(\\s*)' + tok.replace(/\//g, '\\/') + ' ?'), '$1') : l.slice(0, minInd) + tok + ' ' + l.slice(minInd));
      });
    }
    goto(line) {
      const ta = this.ta, lines = ta.value.split('\n'), l = Math.max(1, Math.min(line, lines.length));
      const pos = lines.slice(0, l - 1).reduce((n, x) => n + x.length + 1, 0);
      ta.focus({ preventScroll: true }); ta.setSelectionRange(pos, pos + lines[l - 1].length);
      const { lh } = this.metrics(); ta.scrollTop = Math.max(0, (l - 4) * lh);
      this.errLine = line; this.refresh(); activeEd = this; this.caret();
    }
  }
  const eds = {
    code: new Editor($('scriptEditor'), curFw().lang),
    approach: new Editor($('approachEditor'), 'md'),
    tests: new Editor($('testCasesEditor'), 'md')
  };
  activeEd = eds.code;
  const refreshAll = () => Object.values(eds).forEach(ed => ed.refresh());
  function ensureReady() {
    if (!ready) { ready = true; layoutSizes(); }
    refreshAll(); requestAnimationFrame(() => activeEd && activeEd.sync());
  }
  document.addEventListener('qa:screen', e => { if (e.detail && e.detail.id === 'workspace') ensureReady(); });

  /* ───────────── shell: rail, files, tabs, challenge switcher ───────────── */
  function showSide(name, keepOpen) {
    const collapse = !keepOpen && ide.dataset.side === name && !ide.classList.contains('side-collapsed');
    ide.classList.toggle('side-collapsed', collapse);
    ide.dataset.side = name;
    ide.querySelectorAll('[data-ide-side]').forEach(b => b.setAttribute('aria-pressed', String(!collapse && b.dataset.ideSide === name)));
    ide.querySelectorAll('.ide-pane').forEach(p => { p.hidden = p.dataset.pane !== name; });
  }
  ide.dataset.side = 'files';
  ide.querySelectorAll('[data-ide-side]').forEach(b => b.addEventListener('click', () => showSide(b.dataset.ideSide)));
  ide.querySelectorAll('[data-file]').forEach(b => b.addEventListener('click', () => ide.querySelector(`.editor-tab[data-editor-pane="${b.dataset.file}"]`)?.click()));
  ide.querySelectorAll('.editor-tab').forEach(b => b.addEventListener('click', () => {   // runs after legacy-core's pane toggle
    const k = b.dataset.editorPane; activeEd = eds[k] || eds.code;
    ide.querySelectorAll('[data-file]').forEach(f => f.classList.toggle('on', f.dataset.file === k));
    $('ideLang').textContent = k === 'code' ? curFw().label : 'Markdown';
    requestAnimationFrame(() => { activeEd.refresh(); activeEd.caret(); });
  }));
  function fillChallengeSelect() {
    const sel = $('ideChallenge');
    sel.innerHTML = challengeData.map(c => `<option value="${esc(c.id)}"${c.id === activeChallenge.id ? ' selected' : ''}>${esc(c.title)}</option>`).join('');
  }
  $('ideChallenge').addEventListener('change', e => beginChallenge(e.target.value, { silent: true }));
  function updateBrief() {
    const c = activeChallenge;
    $('ideTrack').textContent = `${c.track} · ${c.level}`;
    $('ideBriefTags').innerHTML = [c.track, c.level, ...c.frameworks].map(x => `<span>${esc(x)}</span>`).join('');
  }
  function updateFramework() {
    const fw = curFw();
    eds.code.setLang(fw.lang);
    $('ideFileName').textContent = fw.file; $('ideFileTree').textContent = fw.file;
    ide.querySelectorAll('.editor-tab[data-editor-pane="code"] .ide-file-ic, .ide-file[data-file="code"] .ide-file-ic').forEach(x => { x.dataset.ext = fw.ext; x.textContent = fw.ext.toUpperCase(); });
    if (activeEd === eds.code) $('ideLang').textContent = fw.label;
    const runnable = fw.runnable !== false;
    $('ideRun').disabled = !runnable;
    $('ideRun').title = runnable ? 'Run (Ctrl+Enter)' : (fw.mode === 'python' ? 'Python runs on your machine — the browser runner executes JavaScript' : 'Manual test plans are not executed');
    $('ideRunnerCard').innerHTML = runnerCard(fw);
    if (!running) $('ideRunState').textContent = runnable ? 'Runner ready' : 'Not runnable in the browser';
    if (!running && !hasResults) renderEmpty();
  }
  function runnerCard(fw) {
    const ok = `<span class="ide-rc-badge ok">${icon('check-circle', 'ic-xs')}Runs in your browser</span>`;
    const no = `<span class="ide-rc-badge no">${icon('info', 'ic-xs')}Not run in the browser</span>`;
    const lines = {
      playwright: 'page.goto · getByRole / Label / Text / Placeholder / TestId · locator · fill · click · check · selectOption · expect(…).toBeVisible / toHaveText / toContainText / toHaveValue / toHaveCount',
      cypress: 'cy.visit · get · contains · find · type · clear · click · check · select · should(\'be.visible\' | \'contain\' | \'have.text\' | \'have.value\' | \'have.length\')',
      postman: 'pm.test · pm.expect (Chai) · pm.response.code · json() · to.have.status — against the API Sandbox response',
      python: 'Run it locally: pip install selenium pytest, then pytest test_draft.py. Drafts are saved and scored here.',
      manual: 'Manual plans are not executed — tick the checklist in the brief and submit.'
    }[fw.mode];
    return `${fw.runnable === false ? no : ok}<p>${esc(lines)}</p>${fw.runnable === false ? '' : '<p class="ide-rc-sub">Plain JavaScript with console.log works too. Isolated sandbox · no network · 10 s limit per test.</p>'}`;
  }
  let resetArmed = 0;
  $('ideReset').addEventListener('click', e => {
    const b = e.currentTarget;
    if (Date.now() - resetArmed > 3000) { resetArmed = Date.now(); b.querySelector('span').textContent = 'Click again to replace your code'; setTimeout(() => { b.querySelector('span').textContent = 'Reset to starter'; }, 3000); return; }
    resetArmed = 0; b.querySelector('span').textContent = 'Reset to starter';
    const ta = $('scriptEditor'); ta.value = defaultScript($('frameworkSelect').value); ta.dispatchEvent(new Event('input', { bubbles: true }));
    toast('Starter code restored.', 'rotate');
  });
  $('frameworkSelect').addEventListener('change', () => { clearResults(); updateFramework(); eds.code.refresh(); });

  /* challenge changes come from beginChallenge (library, revise buttons, the switcher) */
  const baseBegin = beginChallenge;
  beginChallenge = function (id, opts) {
    stopRun(true);
    const r = baseBegin.apply(this, arguments);
    fillChallengeSelect(); updateBrief(); clearResults(); updateFramework(); refreshAll(); setUrl(PATH[activeChallenge.lab] || '/');
    return r;
  };

  /* ───────────── output panel ───────────── */
  let hasResults = false, results = null, logs = 0;
  function setOutTab(k) {
    ide.querySelectorAll('[data-ide-out]').forEach(b => { const on = b.dataset.ideOut === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $('ideTests').hidden = k !== 'tests'; $('ideConsole').hidden = k !== 'output';
  }
  ide.querySelectorAll('[data-ide-out]').forEach(b => b.addEventListener('click', () => setOutTab(b.dataset.ideOut)));
  ide.querySelector('.ide-ptabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const tabs = [...ide.querySelectorAll('[data-ide-out]')], i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const n = tabs[(i + 1) % tabs.length]; setOutTab(n.dataset.ideOut); n.focus();
  });
  $('ideClear').addEventListener('click', () => { $('ideConsole').innerHTML = ''; logs = 0; badge('ideLogBadge', 0); if (!running) clearResults(); });
  $('ideCollapse').addEventListener('click', () => setCollapsed(!ide.classList.contains('panel-collapsed')));
  function setCollapsed(on) { ide.classList.toggle('panel-collapsed', on); $('ideCollapse').setAttribute('aria-expanded', String(!on)); }
  function badge(id, n, cls) { const b = $(id); b.hidden = !n; b.textContent = n; b.className = cls || ''; }
  function renderEmpty() {
    const fw = curFw();
    $('ideTests').innerHTML = fw.runnable === false
      ? `<div class="ide-empty"><span class="ide-empty-ic">${icon(fw.mode === 'python' ? 'terminal' : 'note')}</span><h3>${fw.mode === 'python' ? 'Python runs on your machine' : 'Manual plans are not executed'}</h3><p>${fw.mode === 'python' ? 'The browser runner executes JavaScript. Install Selenium locally (<code>pip install selenium pytest</code>) and run <code>pytest test_draft.py</code>. Your draft is still saved and scored here.' : 'Write the cases, tick the checklist in the brief, then submit for rubric feedback.'}</p></div>`
      : `<div class="ide-empty"><span class="ide-empty-ic">${icon('play')}</span><h3>Run your code</h3><p>Press <b>Run</b> or <kbd>Ctrl</kbd> <kbd>Enter</kbd>. Tests execute in an isolated sandbox in your browser and drive the live preview — every action is highlighted there.</p></div>`;
  }
  function clearResults() { hasResults = false; results = null; badge('ideTestsBadge', 0); renderEmpty(); eds.code.errLine = 0; eds.code.refresh(); }
  function log(level, text) {
    const box = $('ideConsole'), row = document.createElement('div');
    row.className = 'cl cl-' + level;
    row.innerHTML = `<span class="cl-ic">${icon(level === 'error' ? 'x-circle' : level === 'warn' ? 'alert' : level === 'info' ? 'info' : 'chevron-right', 'ic-xs')}</span><pre></pre>`;
    row.querySelector('pre').textContent = text;   // never parsed as HTML
    box.appendChild(row); box.scrollTop = box.scrollHeight;
    logs++; badge('ideLogBadge', logs, level === 'error' ? 'bad' : '');
  }

  /* ───────────── tests rendering ───────────── */
  const ICON = { passed: 'check-circle', failed: 'x-circle', skipped: 'minus', running: 'circle-dot', pending: 'circle' };
  function renderResults() {
    if (!results) return;
    const r = results, list = r.tests;
    const passed = list.filter(t => t.status === 'passed').length, failed = list.filter(t => t.status === 'failed').length, skipped = list.filter(t => t.status === 'skipped').length;
    const sum = r.done ? `<div class="tr-sum ${failed || r.error ? 'is-fail' : 'is-pass'}"><span class="tr-pill pass">${icon('check-circle', 'ic-xs')}${passed} passed</span>${failed ? `<span class="tr-pill fail">${icon('x-circle', 'ic-xs')}${failed} failed</span>` : ''}${skipped ? `<span class="tr-pill skip">${skipped} skipped</span>` : ''}<span class="tr-time">${fmtMs(r.ms)}</span></div>`
      : `<div class="tr-sum is-run"><span class="ide-spin" aria-hidden="true"></span><span>Running ${list.length ? list.length + ' test' + (list.length === 1 ? '' : 's') : 'your code'}…</span></div>`;
    const errBlock = (e, cls) => e ? `<div class="tr-err${cls ? ' ' + cls : ''}"><pre>${esc(e.message)}</pre>${e.line ? `<button type="button" class="ide-link" data-goto-line="${e.line}">${icon('arrow-right', 'ic-xs flip-rtl')}<span>Go to line ${e.line}</span></button>` : ''}</div>` : '';
    let body = '';
    if (r.compileError) body = `<div class="tr-err is-top"><b>Your code could not start</b><pre>${esc(r.compileError.message)}</pre>${r.compileError.ts ? '<p>This looks like TypeScript type syntax. The browser runner executes JavaScript — remove type annotations such as <code>: Page</code> and run again.</p>' : ''}</div>`;
    else if (r.plain) body = r.error ? errBlock(r.error, 'is-top') : `<div class="tr-plain">${icon('check-circle', 'ic-sm')}<span>Ran without errors in ${fmtMs(r.ms)}. No tests were defined — see <button type="button" class="ide-link" data-show-output>Output</button> for console logs.</span></div>`;
    else {
      if (r.error) body += errBlock(r.error, 'is-top');
      body += `<ol class="tr-list">${list.map(t => {
        const open = t.open != null ? t.open : t.status === 'failed';
        return `<li class="tr-test is-${t.status}"><button type="button" class="tr-head" data-tid="${t.id}" aria-expanded="${open}"><span class="tr-ic">${t.status === 'running' ? '<span class="ide-spin" aria-hidden="true"></span>' : icon(ICON[t.status] || 'circle', 'ic-sm')}</span><span class="tr-name">${esc(t.title)}</span>${t.status === 'passed' && !t.assertions ? `<span class="tr-flag">${icon('alert', 'ic-xs')}no assertions</span>` : ''}<span class="tr-ms">${t.ms != null ? fmtMs(t.ms) : ''}</span>${t.steps.length ? icon('chevron-down', 'ic-xs tr-chev') : ''}</button>
          <div class="tr-detail"${open ? '' : ' hidden'}>${t.steps.length ? `<ol class="tr-steps">${t.steps.map(s => `<li class="${s.ok ? 'ok' : 'bad'}">${icon(s.ok ? 'check' : 'x', 'ic-xs')}<code>${esc(s.title)}</code><span class="tr-ms">${fmtMs(s.ms)}</span></li>`).join('')}</ol>` : ''}${errBlock(t.error)}${t.status === 'passed' && !t.assertions ? '<p class="tr-warn">Passed, but no assertions ran — add an expect() so the test can actually fail.</p>' : ''}</div></li>`;
      }).join('')}</ol>`;
    }
    $('ideTests').innerHTML = sum + body;
    badge('ideTestsBadge', r.done ? (failed || (r.error || r.compileError ? 1 : 0)) || passed : 0, r.done ? (failed || r.error || r.compileError ? 'bad' : 'good') : '');
  }
  const fmtMs = ms => (ms == null ? '' : ms < 1000 ? Math.round(ms) + ' ms' : (ms / 1000).toFixed(1) + ' s');
  $('ideTests').addEventListener('click', e => {
    const g = e.target.closest('[data-goto-line]'); if (g) { showEditorView(); eds.code.goto(+g.dataset.gotoLine); return; }
    if (e.target.closest('[data-show-output]')) { setOutTab('output'); return; }
    const h = e.target.closest('.tr-head'); if (!h || !results) return;
    const t = results.tests.find(x => String(x.id) === h.dataset.tid); if (!t) return;
    t.open = h.getAttribute('aria-expanded') !== 'true'; renderResults();
    $('ideTests').querySelector(`.tr-head[data-tid="${t.id}"]`)?.focus();
  });
  function showEditorView() { setView('code'); ide.querySelector('.editor-tab[data-editor-pane="code"]')?.click(); }

  /* ───────────── preview driver (main thread; only touches #targetAppView) ───────────── */
  let pageUrl = '/';
  function setUrl(path) { pageUrl = path || '/'; $('ideUrl').textContent = (HOST[activeChallenge.lab] || 'app.sim') + pageUrl; }
  const proot = () => $('targetAppView');
  const norm = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  function textMatch(actual, m, exact) {
    if (m == null) return true;
    if (typeof m === 'object' && m.re != null) { try { return new RegExp(m.re, m.flags).test(norm(actual)); } catch (e) { return false; } }
    const a = norm(actual), x = norm(m);
    return exact ? a === x : a.toLowerCase().includes(x.toLowerCase());
  }
  function role(el) {
    const r = el.getAttribute('role'); if (r) return r.split(/\s+/)[0];
    const tag = el.tagName, type = (el.getAttribute('type') || '').toLowerCase();
    if (tag === 'BUTTON') return 'button';
    if (tag === 'A' && el.hasAttribute('href')) return 'link';
    if (tag === 'INPUT') return ['button', 'submit', 'reset', 'image'].includes(type) ? 'button' : type === 'checkbox' ? 'checkbox' : type === 'radio' ? 'radio' : type === 'range' ? 'slider' : type === 'number' ? 'spinbutton' : type === 'search' ? 'searchbox' : ['', 'text', 'email', 'tel', 'url'].includes(type) ? 'textbox' : null;
    if (tag === 'TEXTAREA') return 'textbox';
    if (tag === 'SELECT') return el.multiple ? 'listbox' : 'combobox';
    return { H1: 'heading', H2: 'heading', H3: 'heading', H4: 'heading', H5: 'heading', H6: 'heading', IMG: 'img', UL: 'list', OL: 'list', LI: 'listitem', TABLE: 'table', TR: 'row', TD: 'cell', TH: 'columnheader', OUTPUT: 'status', NAV: 'navigation', FORM: 'form' }[tag] || null;
  }
  function labelText(el) {
    const parts = [];
    if (el.id) proot().querySelectorAll(`label[for="${CSS.escape(el.id)}"]`).forEach(l => parts.push(l.textContent));
    const wrap = el.closest('label'); if (wrap) { const c = wrap.cloneNode(true); c.querySelectorAll('input,select,textarea,button').forEach(x => x.remove()); parts.push(c.textContent); }
    return norm(parts.join(' ')) || norm(el.getAttribute('aria-label'));
  }
  function accName(el) {
    const al = el.getAttribute('aria-label'); if (al) return norm(al);
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) { const t = (el.type || '').toLowerCase(); if (['button', 'submit', 'reset'].includes(t)) return norm(el.value); return labelText(el) || norm(el.getAttribute('placeholder') || el.getAttribute('title')); }
    if (el.tagName === 'IMG') return norm(el.alt);
    return norm(el.textContent) || norm(el.getAttribute('title'));
  }
  const visible = el => !!el && el.isConnected && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
  function resolve(chain) {
    let set = [proot()];
    for (const s of chain) {
      if (s.k === 'first') { set = set.slice(0, 1); continue; }
      if (s.k === 'last') { set = set.slice(-1); continue; }
      if (s.k === 'nth') { set = s.i < 0 ? set.slice(s.i).slice(0, 1) : set.slice(s.i, s.i + 1); continue; }
      if (s.k === 'filter') { set = set.filter(el => textMatch(el.textContent, s.text, false)); continue; }
      const out = [];
      for (const sc of set) {
        const all = () => [...sc.querySelectorAll('*')];
        let c;
        if (s.k === 'css') { try { c = [...sc.querySelectorAll(s.sel)]; } catch (e) { throw new Error(`Invalid selector: ${s.sel}`); } }
        else if (s.k === 'role') c = all().filter(el => role(el) === s.role && (s.name == null || textMatch(accName(el), s.name, s.exact)));
        else if (s.k === 'label') c = all().filter(el => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && textMatch(labelText(el), s.text, s.exact));
        else if (s.k === 'placeholder') c = all().filter(el => el.hasAttribute('placeholder') && textMatch(el.getAttribute('placeholder'), s.text, s.exact));
        else if (s.k === 'testid') c = [...sc.querySelectorAll(`[data-testid="${CSS.escape(s.id)}"]`)];
        else if (s.k === 'text') { const m = all().filter(el => !/^(SCRIPT|STYLE|OPTION|SELECT)$/.test(el.tagName) && textMatch(el.textContent, s.text, s.exact)); c = m.filter(el => !m.some(o => o !== el && el.contains(o))); }
        else c = [];
        out.push(...c);
      }
      set = [...new Set(out)];
    }
    return chain.length ? set : [];
  }
  async function waitOne(chain, desc, timeout, needVisible) {
    const end = Date.now() + (timeout || 2000);
    for (;;) {
      const els = resolve(chain);
      if (els.length > 1) throw new Error(`strict mode violation: ${desc} resolved to ${els.length} elements. Make it specific — add { exact: true }, a fuller name, or .first().`);
      if (els.length === 1 && (needVisible === false || visible(els[0]))) return els[0];
      if (Date.now() > end) throw new Error(els.length ? `${desc} resolved to a hidden element.` : `Timed out after ${timeout || 2000} ms waiting for ${desc} — nothing in the preview matches it.`);
      await sleep(80);
    }
  }
  function setVal(el, v) {
    const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
    if (d && d.set) d.set.call(el, v); else el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function flash(el, label) {
    const body = $('idePreviewBody'); if (!body || !body.offsetParent) return;
    el.classList.add('ide-hl'); clearTimeout(el.__ideT); el.__ideT = setTimeout(() => el.classList.remove('ide-hl'), 750);
    const r = el.getBoundingClientRect(), br = body.getBoundingClientRect();
    if (r.top < br.top || r.bottom > br.bottom) body.scrollTop += r.top - br.top - 40;
    const r2 = el.getBoundingClientRect(), tag = document.createElement('span');
    tag.className = 'ide-hl-tag'; tag.textContent = label;
    tag.style.top = Math.max(2, r2.top - br.top + body.scrollTop - 24) + 'px'; tag.style.left = Math.max(2, r2.left - br.left) + 'px';
    body.appendChild(tag); setTimeout(() => tag.remove(), 850);
  }
  const STEP_DELAY = () => (motionOK() ? 140 : 40);
  const driver = {
    async goto({ url }) {
      let p = String(url || '/'); try { if (/^https?:/i.test(p)) p = new URL(p).pathname; } catch (e) {}
      renderTargetApp(); setUrl(p.startsWith('/') ? p : '/' + p); await sleep(STEP_DELAY()); return null;
    },
    async act({ loc, desc, action, value }) {
      const el = await waitOne(loc, desc, 2000, true);
      flash(el, action === 'select' ? 'select' : action);
      if (action === 'click') { if (el.disabled) throw new Error(`${desc} is disabled.`); el.focus({ preventScroll: true }); el.click(); }
      else if (action === 'fill' || action === 'type') {
        if (!/^(INPUT|TEXTAREA)$/.test(el.tagName) || /^(checkbox|radio|button|submit|reset)$/i.test(el.type)) throw new Error(`${desc} is not a text field — ${action}() needs an <input> or <textarea>.`);
        if (el.disabled || el.readOnly) throw new Error(`${desc} is not editable.`);
        el.focus({ preventScroll: true }); setVal(el, action === 'type' ? el.value + value : value);
      } else if (action === 'check' || action === 'uncheck') {
        if (!/^(checkbox|radio)$/i.test(el.type)) throw new Error(`${desc} is not a checkbox or radio button.`);
        if (el.checked !== (action === 'check')) el.click();
      } else if (action === 'select') {
        if (el.tagName !== 'SELECT') throw new Error(`${desc} is not a <select>.`);
        const opt = [...el.options].find(o => o.value === value || norm(o.textContent) === norm(value));
        if (!opt) throw new Error(`Option "${value}" not found in ${desc}. Options: ${[...el.options].map(o => norm(o.textContent)).join(', ')}.`);
        el.value = opt.value; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (action === 'press') {
        el.focus({ preventScroll: true });
        ['keydown', 'keyup'].forEach(t => el.dispatchEvent(new KeyboardEvent(t, { key: value, bubbles: true })));
        if (value === 'Enter') { if (el.form && el.form.requestSubmit) el.form.requestSubmit(); else if (role(el) === 'button') el.click(); }
      } else if (action === 'hover' || action === 'focus') el.focus && el.focus({ preventScroll: true });
      else if (action === 'blur') el.blur();
      await sleep(STEP_DELAY());
      return null;
    },
    async query({ loc, desc, q, name }) {
      if (q === 'count') return resolve(loc).length;
      if (q === 'alltext') return resolve(loc).map(e => norm(e.textContent));
      if (q === 'visible') { const els = resolve(loc); if (els.length > 1) throw new Error(`strict mode violation: ${desc} resolved to ${els.length} elements.`); return visible(els[0]); }
      const el = await waitOne(loc, desc, 2000, false);
      return q === 'text' ? norm(el.textContent) : q === 'value' ? (el.value != null ? el.value : '') : q === 'checked' ? !!el.checked : q === 'enabled' ? !el.disabled : q === 'attr' ? el.getAttribute(name) : null;
    },
    async assert({ loc, desc, kind, expected, not, timeout }) {
      const end = Date.now() + (timeout || 2000);
      let res;
      for (;;) {
        res = check(loc, kind, expected);
        if (res.pass !== not) return { pass: true };
        if (Date.now() > end) break;
        await sleep(90);
      }
      return { pass: false, received: res.received, expected: res.expected, note: res.note || '' };
    },
    async url() { return pageUrl; },
    async title() { return activeChallenge.target; },
    async key({ key }) {
      const el = document.activeElement;
      if (!el || !proot().contains(el)) throw new Error(`page.keyboard.press('${key}') needs a focused element in the preview — click or focus one first.`);
      ['keydown', 'keyup'].forEach(t => el.dispatchEvent(new KeyboardEvent(t, { key, bubbles: true })));
      if (key === 'Enter') { if (el.form && el.form.requestSubmit) el.form.requestSubmit(); else if (role(el) === 'button') el.click(); }
      await sleep(STEP_DELAY()); return null;
    }
  };
  const showExp = v => (v && typeof v === 'object' && v.re != null ? `/${v.re}/${v.flags}` : JSON.stringify(v));
  function check(loc, kind, expected) {
    if (kind === 'url') return { pass: textMatch(pageUrl, expected, false), received: JSON.stringify(pageUrl), expected: showExp(expected) };
    if (kind === 'title') return { pass: textMatch(activeChallenge.target, expected, false), received: JSON.stringify(activeChallenge.target), expected: showExp(expected) };
    const els = resolve(loc), one = els.length === 1 ? els[0] : null;
    const multi = els.length > 1 ? { received: `${els.length} elements`, note: 'strict mode violation — the locator matches more than one element.' } : null;
    const missing = 'element not found';
    switch (kind) {
      case 'visible': return multi ? Object.assign({ pass: false, expected: 'visible' }, multi) : { pass: !!one && visible(one), received: one ? (visible(one) ? 'visible' : 'hidden') : missing, expected: 'visible' };
      case 'hidden': return { pass: !els.some(visible), received: els.some(visible) ? 'visible' : 'hidden', expected: 'hidden' };
      case 'attached': return { pass: els.length > 0, received: els.length ? 'attached' : missing, expected: 'attached' };
      case 'checked': return multi ? Object.assign({ pass: false, expected: 'checked' }, multi) : { pass: !!one && !!one.checked, received: one ? (one.checked ? 'checked' : 'unchecked') : missing, expected: 'checked' };
      case 'enabled': return { pass: !!one && !one.disabled, received: one ? (one.disabled ? 'disabled' : 'enabled') : missing, expected: 'enabled' };
      case 'disabled': return { pass: !!one && !!one.disabled, received: one ? (one.disabled ? 'disabled' : 'enabled') : missing, expected: 'disabled' };
      case 'empty': return { pass: !!one && !norm(one.value != null && /^(INPUT|TEXTAREA|SELECT)$/.test(one.tagName) ? one.value : one.textContent), received: one ? JSON.stringify(norm(one.value || one.textContent)) : missing, expected: 'empty' };
      case 'count': return { pass: els.length === +expected, received: String(els.length), expected: String(expected) };
      case 'text': case 'contain': {
        if (multi) return Object.assign({ pass: false, expected: showExp(expected) }, multi);
        if (!one) return { pass: false, received: missing, expected: showExp(expected) };
        const t = norm(one.textContent);
        const pass = expected && typeof expected === 'object' && expected.re != null ? textMatch(t, expected) : kind === 'text' ? t === norm(expected) : t.includes(norm(expected));
        return { pass, received: JSON.stringify(t), expected: (kind === 'contain' ? 'text containing ' : '') + showExp(expected) };
      }
      case 'value': {
        if (!one) return { pass: false, received: multi ? multi.received : missing, expected: showExp(expected), note: multi ? multi.note : '' };
        const v = one.value != null ? String(one.value) : '';
        return { pass: expected && typeof expected === 'object' && expected.re != null ? textMatch(v, expected) : v === String(expected), received: JSON.stringify(v), expected: showExp(expected) };
      }
      case 'attr': {
        const [n, v] = expected || [];
        if (!one) return { pass: false, received: missing, expected: `${n}=${showExp(v)}` };
        const a = one.getAttribute(n);
        return { pass: v === undefined || v === null ? a !== null : a === String(v), received: a === null ? `no ${n} attribute` : JSON.stringify(a), expected: v == null ? `${n} attribute` : `${n}=${JSON.stringify(String(v))}` };
      }
    }
    return { pass: false, received: 'unsupported assertion', expected: kind };
  }
  function apiResponse() {
    const m = $('embeddedMethod'), ep = $('embeddedEndpoint');
    const method = m ? m.value : 'GET', url = ep ? ep.value : '/api/employees/104', ok = !url.includes('missing');
    return { method, url, status: ok ? (method === 'GET' ? 200 : 201) : 404, statusText: ok ? (method === 'GET' ? 'OK' : 'Created') : 'Not Found', time: 40 + Math.round(Math.random() * 80), headers: { 'content-type': 'application/json; charset=utf-8' }, body: ok ? { id: 'EMP-104', name: 'Alex Carter', role: 'QA Analyst' } : { error: 'employee_not_found' } };
  }

  /* ───────────── sandboxed runner ───────────── */
  /* Everything inside workerMain runs in the Worker: no DOM, no localStorage, network APIs replaced. */
  function workerMain() {
    'use strict';
    const post = m => postMessage(m);
    const blocked = n => function () { throw new Error(n + ' is disabled in the Qadence runner — the sandbox has no network access.'); };
    try { self.fetch = blocked('fetch'); } catch (e) {}
    ['XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'BroadcastChannel', 'importScripts'].forEach(n => { try { self[n] = blocked(n); } catch (e) {} });

    function fmt(v, d, seen) {
      d = d || 0; seen = seen || new WeakSet();
      if (v === null) return 'null'; if (v === undefined) return 'undefined';
      const t = typeof v;
      if (t === 'string') return d ? JSON.stringify(v) : v;
      if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v);
      if (t === 'symbol') return v.toString();
      if (t === 'function') return '[Function ' + (v.name || 'anonymous') + ']';
      if (v instanceof Error) return v.name + ': ' + v.message;
      if (v.__loc) return 'Locator(' + v.__desc + ')';
      if (v instanceof RegExp) return String(v);
      if (v instanceof Date) return v.toISOString();
      if (seen.has(v)) return '[Circular]';
      seen.add(v);
      if (d > 3) return Array.isArray(v) ? '[Array]' : '[Object]';
      if (Array.isArray(v)) return '[ ' + v.slice(0, 50).map(x => fmt(x, d + 1, seen)).join(', ') + (v.length > 50 ? ', …' : '') + ' ]';
      if (v instanceof Map) return 'Map(' + v.size + ') { ' + [...v].slice(0, 30).map(([k, x]) => fmt(k, d + 1, seen) + ' => ' + fmt(x, d + 1, seen)).join(', ') + ' }';
      if (v instanceof Set) return 'Set(' + v.size + ') { ' + [...v].slice(0, 30).map(x => fmt(x, d + 1, seen)).join(', ') + ' }';
      const keys = Object.keys(v);
      return '{ ' + keys.slice(0, 30).map(k => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ' + fmt(v[k], d + 1, seen)).join(', ') + (keys.length > 30 ? ', …' : '') + ' }';
    }
    const ucon = {};
    ['log', 'info', 'warn', 'error', 'debug', 'trace'].forEach(l => { ucon[l] = (...a) => post({ type: 'log', level: l === 'debug' || l === 'trace' ? 'log' : l, text: a.map(x => fmt(x)).join(' ') }); });
    ucon.table = x => ucon.log(x); ucon.dir = x => ucon.log(x); ucon.group = ucon.log; ucon.groupEnd = () => {}; ucon.time = () => {}; ucon.timeEnd = () => {};
    ucon.assert = (c, ...a) => { if (!c) ucon.error('Assertion failed:', ...a); };
    try { self.console = ucon; } catch (e) {}

    let OFFSET = 0; const PRE = 2;
    try { new Function('a', '\n\nthrow new Error("probe")')(); } catch (e) { const m = /(?:<anonymous>|> Function):(\d+):\d+/.exec(e.stack || ''); if (m) OFFSET = +m[1] - 3; }
    function lineOf(err) {
      const st = String((err && err.stack) || '').split('\n');
      for (const fr of st) { const m = /(?:<anonymous>|> Function):(\d+):\d+/.exec(fr); if (m) { const n = +m[1] - OFFSET - PRE; if (n > 0) return n; } }
      return 0;
    }
    let seq = 0; const pending = new Map();
    function rpc(cmd, args) { const id = ++seq; post({ type: 'cmd', id, cmd, args }); return new Promise((res, rej) => pending.set(id, { res, rej })); }
    self.onmessage = e => {
      const m = e.data || {};
      if (m.type === 'reply') { const p = pending.get(m.id); if (!p) return; pending.delete(m.id); if (m.error) p.rej(new Error(m.error)); else p.res(m.value); }
      else if (m.type === 'run') run(m);
    };
    self.addEventListener('unhandledrejection', ev => { ev.preventDefault(); ucon.error('Unhandled promise rejection: ' + fmt(ev.reason) + ' — did you forget an await?'); });

    class AssertionError extends Error {}
    let tests = [], stack = [], hooks, assertions = 0, curTest = null, curCy = null;
    const step = (title, ok, t0, err, at) => { if (curTest) post({ type: 'step', id: curTest.id, title, ok, ms: Date.now() - t0 }); };
    const S = v => (v instanceof RegExp ? { re: v.source, flags: v.flags } : v == null ? null : String(v));
    const SX = v => (v instanceof RegExp ? { re: v.source, flags: v.flags } : Array.isArray(v) ? v.map(SX) : v);
    const show = v => (v instanceof RegExp ? String(v) : typeof v === 'string' ? "'" + v.replace(/'/g, "\\'") + "'" : fmt(v, 1));
    const showS = s => (s && s.re != null ? '/' + s.re + '/' + s.flags : "'" + String(s).replace(/'/g, "\\'") + "'");
    const trunc = s => (s.length > 48 ? s.slice(0, 45) + "…'" : s);
    function descStep(s) {
      switch (s.k) {
        case 'role': return "getByRole('" + s.role + "'" + (s.name != null ? ', { name: ' + showS(s.name) + (s.exact ? ', exact: true' : '') + ' }' : '') + ')';
        case 'label': return 'getByLabel(' + showS(s.text) + ')';
        case 'text': return 'getByText(' + showS(s.text) + ')';
        case 'placeholder': return 'getByPlaceholder(' + showS(s.text) + ')';
        case 'testid': return "getByTestId('" + s.id + "')";
        case 'css': return "locator('" + s.sel + "')";
        case 'first': return 'first()';
        case 'last': return 'last()';
        case 'nth': return 'nth(' + s.i + ')';
        case 'filter': return 'filter({ hasText: ' + showS(s.text) + ' })';
      }
      return '?';
    }
    function makeLoc(chain, label) {
      const desc = label || chain.map(descStep).join('.');
      const add = st => makeLoc(chain.concat(st));
      const L = {
        __loc: true, __chain: chain, __desc: desc,
        getByRole: (r, o) => add({ k: 'role', role: String(r), name: S((o || {}).name), exact: !!(o || {}).exact }),
        getByLabel: (t, o) => add({ k: 'label', text: S(t), exact: !!(o || {}).exact }),
        getByText: (t, o) => add({ k: 'text', text: S(t), exact: !!(o || {}).exact }),
        getByPlaceholder: (t, o) => add({ k: 'placeholder', text: S(t), exact: !!(o || {}).exact }),
        getByTestId: id => add({ k: 'testid', id: String(id) }),
        locator: sel => add({ k: 'css', sel: String(sel) }),
        first: () => add({ k: 'first' }), last: () => add({ k: 'last' }), nth: i => add({ k: 'nth', i: +i }),
        filter: o => add({ k: 'filter', text: S((o || {}).hasText) }),
        click: () => act(L, 'click'), dblclick: () => act(L, 'click'), tap: () => act(L, 'click'),
        fill: v => act(L, 'fill', String(v)), clear: () => act(L, 'fill', ''),
        type: v => act(L, 'type', String(v)), pressSequentially: v => act(L, 'type', String(v)), press: k => act(L, 'press', String(k)),
        check: () => act(L, 'check'), uncheck: () => act(L, 'uncheck'), setChecked: v => act(L, v ? 'check' : 'uncheck'),
        selectOption: v => act(L, 'select', Array.isArray(v) ? String(v[0]) : v && typeof v === 'object' ? String(v.label || v.value) : String(v)),
        hover: () => act(L, 'hover'), focus: () => act(L, 'focus'), blur: () => act(L, 'blur'), scrollIntoViewIfNeeded: () => act(L, 'hover'),
        textContent: () => query(L, 'text'), innerText: () => query(L, 'text'), inputValue: () => query(L, 'value'),
        isVisible: () => query(L, 'visible'), isHidden: async () => !(await query(L, 'visible')), isChecked: () => query(L, 'checked'),
        isEnabled: () => query(L, 'enabled'), isDisabled: async () => !(await query(L, 'enabled')), count: () => query(L, 'count'),
        getAttribute: n => query(L, 'attr', n), allTextContents: () => query(L, 'alltext'), allInnerTexts: () => query(L, 'alltext'),
        waitFor: o => locAssert(L, (o || {}).state === 'hidden' || (o || {}).state === 'detached' ? 'hidden' : 'visible', null, false, (o || {}).timeout, 'waitFor()', true)
      };
      return L;
    }
    async function act(L, action, value) {
      const at = lineOf(new Error()), t0 = Date.now();
      const v = value == null ? '' : /password/i.test(L.__desc) && action !== 'press' ? "'••••••'" : trunc(show(value));
      const title = L.__desc + '.' + (action === 'select' ? 'selectOption' : action) + '(' + v + ')';
      try { await rpc('act', { loc: L.__chain, desc: L.__desc, action, value }); step(title, true, t0); }
      catch (e) { e.line = e.line || at; step(title, false, t0); throw e; }
    }
    async function query(L, q, name) {
      const at = lineOf(new Error());
      try { return await rpc('query', { loc: L.__chain, desc: L.__desc, q, name }); } catch (e) { e.line = e.line || at; throw e; }
    }
    async function locAssert(L, kind, expected, not, timeout, label, silent) {
      if (!silent) assertions++;
      const at = lineOf(new Error()), t0 = Date.now();
      const title = silent ? L.__desc + '.' + label : 'expect(' + L.__desc + ').' + (not ? 'not.' : '') + label;
      const r = await rpc('assert', { loc: L.__chain, desc: L.__desc, kind, expected: SX(expected), not, timeout: timeout || 2000 });
      if (r.pass) { step(title, true, t0); return; }
      const e = new AssertionError(title + ' failed\n\nLocator:  ' + L.__desc + '\nExpected: ' + (not ? 'not ' : '') + r.expected + '\nReceived: ' + r.received + (r.note ? '\n' + r.note : ''));
      e.line = at; step(title, false, t0); throw e;
    }
    function deepEq(a, b) {
      if (Object.is(a, b)) return true;
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (a instanceof Date && b instanceof Date) return +a === +b;
      const ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every(k => deepEq(a[k], b[k]));
    }
    const getPath = (o, p) => String(p).split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
    const hasPath = (o, p) => { let x = o; for (const k of String(p).split('.')) { if (x == null || !(k in Object(x))) return false; x = x[k]; } return true; };
    function valMatchers(a, not) {
      const chk = (pass, name, exp, hasExp) => {
        assertions++;
        if (pass === not) {
          const e = new AssertionError('expect(received).' + (not ? 'not.' : '') + name + '(' + (hasExp ? 'expected' : '') + ')\n\n' + (hasExp ? 'Expected: ' + (not ? 'not ' : '') + fmt(exp, 1) + '\n' : '') + 'Received: ' + fmt(a, 1));
          e.line = lineOf(new Error()); throw e;
        }
      };
      const m = {
        toBe: e => chk(Object.is(a, e), 'toBe', e, 1), toEqual: e => chk(deepEq(a, e), 'toEqual', e, 1), toStrictEqual: e => chk(deepEq(a, e), 'toStrictEqual', e, 1),
        toContain: e => chk(a != null && typeof a.includes === 'function' && a.includes(e), 'toContain', e, 1),
        toContainEqual: e => chk(Array.isArray(a) && a.some(x => deepEq(x, e)), 'toContainEqual', e, 1),
        toBeTruthy: () => chk(!!a, 'toBeTruthy'), toBeFalsy: () => chk(!a, 'toBeFalsy'), toBeNull: () => chk(a === null, 'toBeNull'),
        toBeUndefined: () => chk(a === undefined, 'toBeUndefined'), toBeDefined: () => chk(a !== undefined, 'toBeDefined'), toBeNaN: () => chk(Number.isNaN(a), 'toBeNaN'),
        toBeGreaterThan: e => chk(a > e, 'toBeGreaterThan', e, 1), toBeGreaterThanOrEqual: e => chk(a >= e, 'toBeGreaterThanOrEqual', e, 1),
        toBeLessThan: e => chk(a < e, 'toBeLessThan', e, 1), toBeLessThanOrEqual: e => chk(a <= e, 'toBeLessThanOrEqual', e, 1),
        toBeCloseTo: (e, dg) => chk(Math.abs(a - e) < Math.pow(10, -(dg == null ? 2 : dg)) / 2, 'toBeCloseTo', e, 1),
        toHaveLength: e => chk(a != null && a.length === e, 'toHaveLength', e, 1),
        toMatch: e => chk(typeof a === 'string' && (e instanceof RegExp ? e.test(a) : a.includes(e)), 'toMatch', e, 1),
        toHaveProperty: (k, ...v) => chk(hasPath(a, k) && (!v.length || deepEq(getPath(a, k), v[0])), 'toHaveProperty', k, 1),
        toBeInstanceOf: C => chk(typeof C === 'function' && a instanceof C, 'toBeInstanceOf', C && C.name, 1),
        toThrow: e => { let threw = false, err; try { a(); } catch (x) { threw = true; err = x; } const msg = String(err && err.message); chk(threw && (e === undefined || (e instanceof RegExp ? e.test(msg) : typeof e === 'string' ? msg.includes(e) : true)), 'toThrow', e, e !== undefined); }
      };
      if (!not) m.not = valMatchers(a, true);
      return m;
    }
    function locMatchers(L, not, o0) {
      const t = o => (o && o.timeout) || (o0 && o0.timeout);
      const m = {
        toBeVisible: o => locAssert(L, 'visible', null, not, t(o), 'toBeVisible()'), toBeHidden: o => locAssert(L, 'hidden', null, not, t(o), 'toBeHidden()'),
        toBeAttached: o => locAssert(L, 'attached', null, not, t(o), 'toBeAttached()'), toBeChecked: o => locAssert(L, 'checked', null, not, t(o), 'toBeChecked()'),
        toBeEnabled: o => locAssert(L, 'enabled', null, not, t(o), 'toBeEnabled()'), toBeDisabled: o => locAssert(L, 'disabled', null, not, t(o), 'toBeDisabled()'),
        toBeEditable: o => locAssert(L, 'enabled', null, not, t(o), 'toBeEditable()'), toBeEmpty: o => locAssert(L, 'empty', null, not, t(o), 'toBeEmpty()'),
        toHaveText: (x, o) => locAssert(L, 'text', x, not, t(o), 'toHaveText(' + show(x) + ')'), toContainText: (x, o) => locAssert(L, 'contain', x, not, t(o), 'toContainText(' + show(x) + ')'),
        toHaveValue: (x, o) => locAssert(L, 'value', x, not, t(o), 'toHaveValue(' + show(x) + ')'), toHaveCount: (x, o) => locAssert(L, 'count', x, not, t(o), 'toHaveCount(' + x + ')'),
        toHaveAttribute: (n, v, o) => locAssert(L, 'attr', [n, v], not, t(o), 'toHaveAttribute(' + show(n) + (v !== undefined ? ', ' + show(v) : '') + ')')
      };
      if (!not) m.not = locMatchers(L, true, o0);
      return m;
    }
    function pageMatchers(not) {
      const run = async (kind, x, label) => {
        assertions++; const at = lineOf(new Error()), t0 = Date.now(), title = 'expect(page).' + (not ? 'not.' : '') + label;
        const r = await rpc('assert', { loc: [], desc: 'page', kind, expected: SX(x), not, timeout: 2000 });
        if (r.pass) { step(title, true, t0); return; }
        const e = new AssertionError(title + ' failed\n\nExpected: ' + (not ? 'not ' : '') + r.expected + '\nReceived: ' + r.received); e.line = at; step(title, false, t0); throw e;
      };
      const m = { toHaveURL: x => run('url', x, 'toHaveURL(' + show(x) + ')'), toHaveTitle: x => run('title', x, 'toHaveTitle(' + show(x) + ')') };
      if (!not) m.not = pageMatchers(true);
      return m;
    }
    function expect(actual, opts) { return actual && actual.__loc ? locMatchers(actual, false, opts) : actual && actual.__page ? pageMatchers(false) : valMatchers(actual, false); }
    expect.soft = expect;

    const page = {
      __page: true,
      goto: async url => { const t0 = Date.now(); await rpc('goto', { url: String(url == null ? '/' : url) }); step("page.goto('" + url + "')", true, t0); return null; },
      reload: async () => { const t0 = Date.now(); await rpc('goto', { url: null }); step('page.reload()', true, t0); return null; },
      url: () => rpc('url'), title: () => rpc('title'),
      waitForTimeout: ms => new Promise(r => setTimeout(r, Math.min(+ms || 0, 5000))),
      waitForLoadState: async () => {}, waitForURL: async () => {}, setViewportSize: async () => {}, close: async () => {}, pause: async () => {}, bringToFront: async () => {}, on: () => {},
      waitForSelector: sel => makeLoc([{ k: 'css', sel: String(sel) }]).waitFor(),
      screenshot: async () => { ucon.info('page.screenshot() is skipped in the browser runner.'); return null; },
      evaluate: async () => { throw new Error('page.evaluate() is not available in the browser runner — use locators and expect() instead.'); },
      keyboard: { press: k => rpc('key', { key: String(k) }), type: async () => { throw new Error('page.keyboard.type() is not available — use locator.fill() or pressSequentially().'); } },
      locator: sel => makeLoc([{ k: 'css', sel: String(sel) }])
    };
    ['getByRole', 'getByLabel', 'getByText', 'getByPlaceholder', 'getByTestId'].forEach(n => { page[n] = (...a) => makeLoc([])[n](...a); });
    ['click', 'fill', 'check', 'uncheck', 'selectOption', 'textContent', 'isVisible', 'inputValue', 'press', 'type', 'hover'].forEach(n => { page[n] = (sel, ...a) => makeLoc([{ k: 'css', sel: String(sel) }])[n](...a); });

    /* Cypress subset: commands queue during the test body and run in order afterwards. */
    const CY_SHOULD = { 'be.visible': ['visible'], exist: ['attached'], 'be.checked': ['checked'], 'be.disabled': ['disabled'], 'be.enabled': ['enabled'], 'be.empty': ['empty'], 'have.text': ['text', 1], contain: ['contain', 1], 'contain.text': ['contain', 1], 'include.text': ['contain', 1], 'have.value': ['value', 1], 'have.length': ['count', 1], 'have.attr': ['attr', 2] };
    function cyChain(chain, label) {
      const at0 = () => lineOf(new Error());
      const q = (title, fn) => { if (!curCy) throw new Error('Use cy commands inside it(), beforeEach() or a test.'); curCy.push({ title, fn, at: at0() }); };
      const sub = {
        type: text => { q(label + '.type(' + (/password/i.test(label) ? "'••••••'" : trunc(show(String(text)))) + ')', () => cyType(chain, label, String(text))); return sub; },
        clear: () => { q(label + '.clear()', () => rpc('act', { loc: chain, desc: label, action: 'fill', value: '' })); return sub; },
        click: () => { q(label + '.click()', () => rpc('act', { loc: chain, desc: label, action: 'click' })); return sub; },
        check: () => { q(label + '.check()', () => rpc('act', { loc: chain, desc: label, action: 'check' })); return sub; },
        uncheck: () => { q(label + '.uncheck()', () => rpc('act', { loc: chain, desc: label, action: 'uncheck' })); return sub; },
        select: v => { q(label + '.select(' + show(v) + ')', () => rpc('act', { loc: chain, desc: label, action: 'select', value: String(v) })); return sub; },
        focus: () => { q(label + '.focus()', () => rpc('act', { loc: chain, desc: label, action: 'focus' })); return sub; },
        should: (ch, a, b) => { q(label + ".should('" + ch + "'" + (a !== undefined ? ', ' + show(a) : '') + (b !== undefined ? ', ' + show(b) : '') + ')', () => cyShould(chain, label, String(ch), a, b)); return sub; },
        find: sel => cyChain(chain.concat({ k: 'css', sel: String(sel) }), label + ".find('" + sel + "')"),
        contains: (a, b) => (b === undefined ? cyChain(chain.concat({ k: 'text', text: S(a) }, { k: 'first' }), label + '.contains(' + show(a) + ')') : cyChain(chain.concat({ k: 'css', sel: String(a) }, { k: 'filter', text: S(b) }, { k: 'first' }), label + ".contains('" + a + "', " + show(b) + ')')),
        first: () => cyChain(chain.concat({ k: 'first' }), label + '.first()'), last: () => cyChain(chain.concat({ k: 'last' }), label + '.last()'), eq: i => cyChain(chain.concat({ k: 'nth', i: +i }), label + '.eq(' + i + ')')
      };
      sub.and = sub.should;
      return sub;
    }
    async function cyType(chain, label, text) {
      for (const part of text.split(/(\{[^}]+\})/)) {
        if (!part) continue;
        const k = /^\{(\w+)\}$/.exec(part);
        if (k) { const key = { enter: 'Enter', tab: 'Tab', esc: 'Escape', backspace: 'Backspace' }[k[1].toLowerCase()]; if (key) await rpc('act', { loc: chain, desc: label, action: 'press', value: key }); }
        else await rpc('act', { loc: chain, desc: label, action: 'type', value: part });
      }
    }
    async function cyShould(chain, label, ch, a, b) {
      assertions++;
      const not = ch.startsWith('not.'), key = not ? ch.slice(4) : ch;
      if (key === 'be.visible' && not) return cyAssert(chain, label, 'hidden', null, false, ch);
      if (key === 'exist' && not) return cyAssert(chain, label, 'attached', null, true, ch);
      const spec = CY_SHOULD[key];
      if (!spec) throw new Error("should('" + ch + "') isn't supported in the browser runner.");
      return cyAssert(chain, label, spec[0], spec[1] === 2 ? [a, b] : spec[1] ? a : null, not, ch);
    }
    async function cyAssert(chain, label, kind, expected, not, ch) {
      const r = await rpc('assert', { loc: chain, desc: label, kind, expected: SX(expected), not, timeout: 2000 });
      if (!r.pass) throw new AssertionError(label + ".should('" + ch + "') failed\n\nExpected: " + (not ? 'not ' : '') + r.expected + '\nReceived: ' + r.received + (r.note ? '\n' + r.note : ''));
    }
    const cy = {
      visit: url => { if (!curCy) throw new Error('Use cy.visit() inside it() or beforeEach().'); curCy.push({ title: "cy.visit('" + url + "')", fn: () => rpc('goto', { url: String(url) }), at: lineOf(new Error()) }); return cy; },
      get: sel => cyChain([{ k: 'css', sel: String(sel) }], "cy.get('" + sel + "')"),
      contains: (a, b) => (b === undefined ? cyChain([{ k: 'text', text: S(a) }, { k: 'first' }], 'cy.contains(' + show(a) + ')') : cyChain([{ k: 'css', sel: String(a) }, { k: 'filter', text: S(b) }, { k: 'first' }], "cy.contains('" + a + "', " + show(b) + ')')),
      wait: ms => { if (curCy) curCy.push({ title: 'cy.wait(' + ms + ')', fn: () => new Promise(r => setTimeout(r, Math.min(+ms || 0, 5000))), at: lineOf(new Error()) }); return cy; },
      log: msg => { if (curCy) curCy.push({ title: 'cy.log(' + show(msg) + ')', fn: async () => ucon.log(String(msg)), at: 0 }); return cy; },
      reload: () => { if (curCy) curCy.push({ title: 'cy.reload()', fn: () => rpc('goto', { url: null }), at: 0 }); return cy; },
      url: () => ({ should: (ch, v) => { curCy.push({ title: "cy.url().should('" + ch + "', " + show(v) + ')', fn: async () => { assertions++; const r = await rpc('assert', { loc: [], desc: 'url', kind: 'url', expected: SX(v), not: ch.startsWith('not.'), timeout: 2000 }); if (!r.pass) throw new AssertionError("cy.url().should('" + ch + "') failed\n\nExpected: " + r.expected + '\nReceived: ' + r.received); }, at: lineOf(new Error()) }); } }),
      viewport: () => cy, intercept: () => { throw new Error('cy.intercept() is not available in the browser runner.'); }
    };

    /* Postman pm with a Chai-style expect, against the API Sandbox response. */
    function chai(a, neg) {
      const o = {};
      const chk = (pass, msg) => { assertions++; if (pass === !!neg) { const e = new AssertionError((neg ? 'expected NOT: ' : '') + msg); e.line = lineOf(new Error()); throw e; } return o; };
      ['to', 'be', 'been', 'is', 'that', 'which', 'and', 'has', 'have', 'with', 'at', 'of', 'same', 'but', 'does', 'still', 'also', 'deep', 'own', 'nested', 'any', 'all'].forEach(k => Object.defineProperty(o, k, { get: () => o }));
      Object.defineProperty(o, 'not', { get: () => chai(a, !neg) });
      const ty = () => (Array.isArray(a) ? 'array' : a === null ? 'null' : typeof a);
      o.equal = o.equals = o.eq = e => chk(a === e, 'expected ' + fmt(a, 1) + ' to equal ' + fmt(e, 1));
      o.eql = e => chk(deepEq(a, e), 'expected ' + fmt(a, 1) + ' to deeply equal ' + fmt(e, 1));
      o.a = o.an = t => chk(ty() === String(t).toLowerCase(), 'expected ' + fmt(a, 1) + ' to be a ' + t);
      o.property = (k, ...v) => { chk(a != null && k in Object(a) && (!v.length || deepEq(a[k], v[0])), 'expected ' + fmt(a, 1) + " to have property '" + k + "'" + (v.length ? ' of ' + fmt(v[0], 1) : '')); return v.length ? o : chai(a != null ? a[k] : undefined, false); };
      o.include = o.contain = o.includes = o.contains = e => chk(typeof a === 'string' ? a.includes(e) : Array.isArray(a) ? a.some(x => deepEq(x, e)) : a && e && typeof e === 'object' ? Object.keys(e).every(k => deepEq(a[k], e[k])) : false, 'expected ' + fmt(a, 1) + ' to include ' + fmt(e, 1));
      o.above = o.gt = o.greaterThan = n => chk(a > n, 'expected ' + fmt(a, 1) + ' to be above ' + n);
      o.below = o.lt = o.lessThan = n => chk(a < n, 'expected ' + fmt(a, 1) + ' to be below ' + n);
      o.least = o.gte = n => chk(a >= n, 'expected ' + fmt(a, 1) + ' to be at least ' + n);
      o.most = o.lte = n => chk(a <= n, 'expected ' + fmt(a, 1) + ' to be at most ' + n);
      o.lengthOf = n => chk(a != null && a.length === n, 'expected ' + fmt(a, 1) + ' to have length ' + n);
      o.match = re => chk(re instanceof RegExp && re.test(String(a)), 'expected ' + fmt(a, 1) + ' to match ' + re);
      o.oneOf = arr => chk(Array.isArray(arr) && arr.some(x => deepEq(x, a)), 'expected ' + fmt(a, 1) + ' to be one of ' + fmt(arr, 1));
      o.keys = (...k) => { const ks = (Array.isArray(k[0]) ? k[0] : k); return chk(a && ks.every(x => x in Object(a)), 'expected ' + fmt(a, 1) + ' to have keys ' + ks.join(', ')); };
      const gets = { true: () => a === true, false: () => a === false, null: () => a === null, undefined: () => a === undefined, ok: () => !!a, exist: () => a != null, NaN: () => Number.isNaN(a), empty: () => (a == null ? false : typeof a === 'string' || Array.isArray(a) ? a.length === 0 : Object.keys(a).length === 0) };
      Object.keys(gets).forEach(k => Object.defineProperty(o, k, { get: () => chk(gets[k](), 'expected ' + fmt(a, 1) + ' to be ' + k) }));
      return o;
    }
    function makePm(resp) {
      const store = () => { const m = new Map(); return { get: k => m.get(k), set: (k, v) => m.set(k, v), has: k => m.has(k), unset: k => m.delete(k), clear: () => m.clear() }; };
      const status = c => { assertions++; if (resp.status !== c) { const e = new AssertionError('expected response to have status code ' + c + ' but got ' + resp.status); e.line = lineOf(new Error()); throw e; } };
      const be = {};
      [['ok', () => resp.status >= 200 && resp.status < 300], ['success', () => resp.status >= 200 && resp.status < 300], ['notFound', () => resp.status === 404], ['clientError', () => resp.status >= 400 && resp.status < 500], ['serverError', () => resp.status >= 500]].forEach(([k, f]) => Object.defineProperty(be, k, { get: () => { assertions++; if (!f()) { const e = new AssertionError('expected response to be ' + k + ' but status was ' + resp.status); e.line = lineOf(new Error()); throw e; } } }));
      return {
        test: (name, fn) => addTest(name, fn),
        expect: x => chai(x, false),
        response: {
          code: resp.status, status: resp.statusText, responseTime: resp.time,
          headers: { get: h => resp.headers[String(h).toLowerCase()] },
          json: () => JSON.parse(JSON.stringify(resp.body)), text: () => JSON.stringify(resp.body),
          to: { have: { status, header: h => { assertions++; if (!(String(h).toLowerCase() in resp.headers)) throw new AssertionError('expected response to have header ' + h); } }, be }
        },
        request: { method: resp.method, url: { toString: () => resp.url } },
        environment: store(), variables: store(), collectionVariables: store(), globals: store(),
        sendRequest: () => { throw new Error('pm.sendRequest() is not available in the browser runner.'); }
      };
    }

    function addTest(name, fn, mode) { if (typeof name === 'function') { fn = name; name = 'test'; } tests.push({ id: tests.length, title: stack.concat(String(name)).join(' › '), fn, mode }); }
    const test = (n, f) => addTest(n, f);
    test.only = (n, f) => addTest(n, f, 'only'); test.skip = (n, f) => addTest(n, f, 'skip'); test.fixme = test.skip;
    function describe(n, f) { stack.push(String(n)); try { if (typeof f === 'function') f(); } finally { stack.pop(); } }
    describe.only = describe;
    describe.skip = (n, f) => { const b = tests.length; describe(n, f); tests.slice(b).forEach(t => { t.mode = 'skip'; }); };
    test.describe = describe; describe.serial = describe; describe.parallel = describe; describe.configure = () => {};
    test.beforeEach = f => hooks.beforeEach.push(f); test.afterEach = f => hooks.afterEach.push(f);
    test.beforeAll = f => hooks.beforeAll.push(f); test.afterAll = f => hooks.afterAll.push(f);
    test.step = async (title, fn) => { const t0 = Date.now(); try { const r = await fn(); step(String(title), true, t0); return r; } catch (e) { step(String(title), false, t0); throw e; } };
    test.setTimeout = () => {}; test.use = () => {}; test.slow = () => {}; test.info = () => ({ title: curTest ? curTest.title : '' });
    const assert = (c, m) => { assertions++; if (!c) throw new AssertionError(m || 'Assertion failed'); };
    assert.ok = assert; assert.equal = (x, y, m) => assert(x == y, m || fmt(x, 1) + ' == ' + fmt(y, 1)); assert.strictEqual = (x, y, m) => assert(x === y, m || fmt(x, 1) + ' === ' + fmt(y, 1));
    assert.notEqual = (x, y, m) => assert(x != y, m); assert.deepEqual = (x, y, m) => assert(deepEq(x, y), m || 'expected deep equality'); assert.deepStrictEqual = assert.deepEqual;
    const MODULES = { '@playwright/test': () => ({ test, expect, devices: {} }), 'playwright/test': () => ({ test, expect }), chai: () => ({ expect: x => chai(x, false), assert }), assert: () => assert, 'node:assert': () => assert };
    const req = n => { if (!MODULES[n]) throw new Error("Module '" + n + "' isn't available in the browser runner. Available: @playwright/test, chai, assert."); return MODULES[n](); };

    function prep(src) {
      const out = []; let inImport = false;
      for (const line of src.split('\n')) {
        if (inImport) { out.push(''); if (/from\s*['"][^'"]+['"]\s*;?\s*$/.test(line)) inImport = false; continue; }
        if (/^\s*import\s+type\b/.test(line) || /^\s*import\s*['"][^'"]+['"]\s*;?\s*$/.test(line) || /^\s*import\s[^;]*from\s*['"][^'"]+['"]\s*;?\s*$/.test(line)) { out.push(''); continue; }
        if (/^\s*import\s*\{[^}]*$/.test(line)) { out.push(''); inImport = true; continue; }
        out.push(line.replace(/^(\s*)export\s+default\s+/, '$1').replace(/^(\s*)export\s+(?=(const|let|var|function|class|async)\b)/, '$1'));
      }
      return out.join('\n');
    }
    const looksTS = c => /\binterface\s+\w+\s*\{|\btype\s+\w+\s*=|:\s*(string|number|boolean|any|void|unknown|Page|Locator|BrowserContext)\b|\bas\s+(const|string|number|any|unknown)\b/.test(c);
    const errInfo = e => ({ message: e && e.message ? (e instanceof AssertionError || !e.name || e.name === 'Error' ? '' : e.name + ': ') + e.message : 'Thrown: ' + fmt(e, 1), line: (e && e.line) || lineOf(e) });
    const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Test timeout of ' + ms + ' ms exceeded.')), ms))]);

    async function run(m) {
      tests = []; stack = []; hooks = { beforeEach: [], afterEach: [], beforeAll: [], afterAll: [] }; assertions = 0;
      const pm = makePm(m.api);
      let fn;
      const body = 'const { test, it, describe, context, expect, page, cy, pm, require, console, assert, beforeEach, afterEach, beforeAll, afterAll, before, after } = __rt;\nreturn (async () => {\n' + prep(m.code) + '\n})();';
      try { fn = new Function('__rt', body); }
      catch (e) { post({ type: 'done', ms: 0, compileError: { message: e.name + ': ' + e.message, ts: looksTS(m.code) } }); return; }
      const rt = { test, it: test, describe, context: describe, expect, page, cy, pm, require: req, console: ucon, assert, beforeEach: test.beforeEach, afterEach: test.afterEach, beforeAll: test.beforeAll, afterAll: test.afterAll, before: test.beforeAll, after: test.afterAll };
      const t0 = Date.now();
      try { await fn(rt); }
      catch (e) { post({ type: 'done', ms: Date.now() - t0, plain: !tests.length, error: errInfo(e) }); return; }
      if (!tests.length) { post({ type: 'done', ms: Date.now() - t0, plain: true }); return; }
      const only = tests.some(t => t.mode === 'only'), skipped = t => t.mode === 'skip' || (only && t.mode !== 'only');
      post({ type: 'collected', tests: tests.map(t => ({ id: t.id, title: t.title, skip: skipped(t) })) });
      let topErr = null;
      try { for (const h of hooks.beforeAll) await h({ page }); } catch (e) { topErr = errInfo(e); }
      for (const t of tests) {
        if (skipped(t) || topErr) { post({ type: 'testEnd', id: t.id, status: 'skipped', ms: 0 }); continue; }
        curTest = t; curCy = []; const a0 = assertions, s0 = Date.now();
        post({ type: 'testStart', id: t.id });
        let err = null;
        try {
          await withTimeout((async () => {
            for (const h of hooks.beforeEach) await h({ page });
            await t.fn({ page, request: undefined, context: undefined, browserName: 'chromium' });
            for (const c of curCy) { const c0 = Date.now(); try { await c.fn(); step(c.title, true, c0); } catch (e) { e.line = e.line || c.at; step(c.title, false, c0); throw e; } }
            for (const h of hooks.afterEach) await h({ page });
          })(), 10000);
        } catch (e) { err = errInfo(e); }
        post({ type: 'testEnd', id: t.id, status: err ? 'failed' : 'passed', ms: Date.now() - s0, error: err, assertions: assertions - a0 });
        curTest = null; curCy = null;
      }
      try { for (const h of hooks.afterAll) await h({ page }); } catch (e) { topErr = topErr || errInfo(e); }
      post({ type: 'done', ms: Date.now() - t0, error: topErr });
    }
    post({ type: 'ready' });
  }

  let worker = null, workerUrl = null, running = false, watchdog = 0, runId = 0, lastRun = null;
  function stopRun(silent) {
    clearTimeout(watchdog);
    if (worker) { worker.terminate(); worker = null; }
    if (workerUrl) { URL.revokeObjectURL(workerUrl); workerUrl = null; }
    if (running && !silent && results) {
      results.tests.forEach(t => { if (t.status === 'running') { t.status = 'failed'; t.error = { message: 'Stopped.' }; } else if (t.status === 'pending') t.status = 'skipped'; });
      results.done = true; results.ms = Date.now() - results.t0; renderResults();
    }
    setRunning(false);
  }
  function setRunning(on) {
    running = on;
    const b = $('ideRun');
    b.classList.toggle('is-running', on);
    b.querySelector('.ide-run-label').textContent = on ? 'Stop' : 'Run';
    b.querySelector('.ic use')?.setAttribute('href', on ? '#i-x' : '#i-play');
    b.title = on ? 'Stop the run' : 'Run (Ctrl+Enter)';
    $('idePanel').setAttribute('aria-busy', String(on));
  }
  function arm(ms) { clearTimeout(watchdog); watchdog = setTimeout(() => onTimeout(ms), ms); }
  function onTimeout(ms) {
    if (!running) return;
    const r = results;
    if (r) {
      const cur = r.tests.find(t => t.status === 'running');
      if (cur) { cur.status = 'failed'; cur.error = { message: `Stopped after ${ms / 1000} s without finishing — check for an infinite loop or a missing await.` }; }
      else if (!r.tests.length) { r.plain = true; r.error = { message: `Stopped after ${ms / 1000} s without finishing — check for an infinite loop.` }; }
      r.tests.forEach(t => { if (t.status === 'pending') t.status = 'skipped'; });
      r.done = true; r.ms = Date.now() - r.t0;
    }
    log('error', `Run stopped: no response for ${ms / 1000} s.`);
    stopRun(true); renderResults(); finishRun();
  }
  function runOrStop() { if (running) { stopRun(false); finishRun(); return; } runCode(); }
  function runCode() {
    const fw = curFw();
    if (fw.runnable === false) { toast(fw.mode === 'python' ? 'Python runs on your machine — the browser runner executes JavaScript.' : 'Manual plans are not executed.', 'info'); return; }
    stopRun(true);
    const code = $('scriptEditor').value;
    try { workerUrl = URL.createObjectURL(new Blob(['(' + workerMain.toString() + ')()'], { type: 'text/javascript' })); worker = new Worker(workerUrl); }
    catch (e) { log('error', 'The code runner is unavailable in this browser (Web Workers are blocked). Your draft is still saved.'); $('ideRunState').textContent = 'Runner unavailable'; return; }
    const id = ++runId;
    results = { tests: [], done: false, t0: Date.now(), ms: 0 }; hasResults = true;
    $('ideConsole').innerHTML = ''; logs = 0; badge('ideLogBadge', 0);
    eds.code.errLine = 0; eds.code.refresh();
    setRunning(true); setCollapsed(false);
    setOutTab(/\b(test|it|pm\.test)\s*\(/.test(code) ? 'tests' : 'output');
    if (phone()) setView('preview');   // watch the test drive the app; results follow
    $('ideRunState').textContent = 'Running…';
    renderResults();
    if (fw.mode === 'postman' && $('embeddedEndpoint') && typeof handleTargetAction === 'function') handleTargetAction('api-run');
    worker.onmessage = e => onMsg(id, e.data || {});
    worker.onerror = e => { e.preventDefault(); if (id !== runId) return; log('error', 'Runner error: ' + (e.message || 'unknown')); };
    worker.postMessage({ type: 'run', code, api: apiResponse() });
    arm(12000);
  }
  function onMsg(id, m) {
    if (id !== runId || !results) return;
    const r = results;
    if (m.type === 'cmd') {
      const fn = driver[m.cmd];
      Promise.resolve(fn ? fn(m.args || {}) : Promise.reject(new Error('Unknown command ' + m.cmd)))
        .then(value => { if (worker && id === runId) worker.postMessage({ type: 'reply', id: m.id, value }); },
          err => { if (worker && id === runId) worker.postMessage({ type: 'reply', id: m.id, error: (err && err.message) || String(err) }); });
      return;
    }
    if (m.type === 'log') { log(m.level, m.text); return; }
    if (m.type === 'clear') { $('ideConsole').innerHTML = ''; return; }
    if (m.type === 'collected') { r.tests = m.tests.map(t => ({ id: t.id, title: t.title, status: t.skip ? 'skipped' : 'pending', steps: [], ms: null })); renderResults(); return; }
    const t = r.tests.find(x => x.id === m.id);
    if (m.type === 'testStart' && t) { t.status = 'running'; renderTargetApp(); setUrl('/'); arm(12000); renderResults(); return; }
    if (m.type === 'step' && t) { t.steps.push({ title: m.title, ok: m.ok, ms: m.ms }); renderResults(); return; }
    if (m.type === 'testEnd' && t) { Object.assign(t, { status: m.status, ms: m.ms, error: m.error || null, assertions: m.assertions || 0 }); renderResults(); return; }
    if (m.type === 'done') {
      Object.assign(r, { done: true, ms: m.ms, plain: !!m.plain, error: m.error || null, compileError: m.compileError || null });
      if (m.compileError) log('error', m.compileError.message);
      else if (m.error) log('error', m.error.message + (m.error.line ? `  (line ${m.error.line})` : ''));
      stopRun(true); renderResults(); finishRun();
    }
  }
  function finishRun() {
    const r = results; if (!r) return;
    const passed = r.tests.filter(t => t.status === 'passed').length, failed = r.tests.filter(t => t.status === 'failed').length + (r.error || r.compileError ? 1 : 0);
    const firstErr = (r.compileError ? null : r.error) || (r.tests.find(t => t.error) || {}).error;
    if (firstErr && firstErr.line) { eds.code.errLine = firstErr.line; eds.code.refresh(); }
    lastRun = { code: $('scriptEditor').value, passed, failed, total: r.tests.filter(t => t.status !== 'skipped').length };
    const msg = r.compileError ? 'Could not start — see Tests' : r.plain ? (r.error ? 'Error — see Tests' : `Ran in ${fmtMs(r.ms)}`) : `${passed} passed · ${failed} failed · ${fmtMs(r.ms)}`;
    $('ideRunState').textContent = msg;
    $('ideRunState').dataset.state = failed ? 'bad' : 'good';
    if (r.plain && !r.error && !r.compileError) setOutTab('output');
    if (phone() && ide.dataset.view === 'preview') setTimeout(() => { if (!running) setView('output'); }, r.plain ? 0 : 600);
  }
  $('ideRun').addEventListener('click', runOrStop);

  /* record run results on the next submission */
  $('submitWorkspace').addEventListener('click', () => {   // runs after legacy-core's submit handler
    const rec = state.submissions && state.submissions[0];
    if (!rec || rec.id !== state.lastSubmissionId || rec.__ide) return;
    const ran = lastRun && lastRun.code === rec.code && lastRun.total;
    rec.executed = !!ran; rec.run = ran ? { passed: lastRun.passed, failed: lastRun.failed, total: lastRun.total } : null;
    save();
    const note = $('submitRunNote');
    if (note) note.innerHTML = `${icon('info', 'ic-xs')} ${ran ? `Last run: ${lastRun.passed} of ${lastRun.total} tests passed in the sandbox.` : curFw().runnable === false ? 'Saved in this browser. The score comes from a transparent rubric.' : 'Tip: press Run before submitting to check that your tests pass.'}`;
    if (typeof renderSubmissions === 'function') renderSubmissions();
    showSide('guide', true);
    if (phone()) setView('side');
  });

  /* ───────────── layout: splitters, mobile views ───────────── */
  function splitter(el, axis, cssVar, def, min, maxFn) {
    let size = def;
    const apply = v => { size = Math.max(min, Math.min(maxFn(), v)); ide.style.setProperty(cssVar, size + 'px'); el.setAttribute('aria-valuenow', String(Math.round(size))); el.setAttribute('aria-valuemin', String(min)); el.setAttribute('aria-valuemax', String(Math.round(maxFn()))); requestAnimationFrame(() => activeEd && activeEd.sync()); };
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('dragging');
      const start = axis === 'x' ? e.clientX : e.clientY, base = size, dir = document.documentElement.dir === 'rtl' && axis === 'x' ? -1 : 1;
      const move = ev => apply(base + (start - (axis === 'x' ? ev.clientX : ev.clientY)) * dir);
      const up = () => { el.classList.remove('dragging'); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    el.addEventListener('keydown', e => {
      const grow = axis === 'x' ? 'ArrowLeft' : 'ArrowUp', shrink = axis === 'x' ? 'ArrowRight' : 'ArrowDown';
      if (e.key === grow) { e.preventDefault(); apply(size + 24); } else if (e.key === shrink) { e.preventDefault(); apply(size - 24); } else if (e.key === 'Home') { e.preventDefault(); apply(min); } else if (e.key === 'End') { e.preventDefault(); apply(maxFn()); }
    });
    ide.style.setProperty(cssVar, def + 'px');   // no layout reads at start-up
    sizers.push(() => apply(size));
  }
  const sizers = [];
  function layoutSizes() { sizers.forEach(f => f()); }
  splitter(ide.querySelector('.ide-split-v'), 'x', '--ide-prev-w', 380, 280, () => Math.max(300, Math.min(760, ide.clientWidth - 620)));
  splitter(ide.querySelector('.ide-split-h'), 'y', '--ide-panel-h', 230, 110, () => Math.max(140, (ide.querySelector('.ide-center').clientHeight || 600) - 170));
  const phone = () => window.matchMedia('(max-width: 900px)').matches;
  function setView(v) {
    ide.dataset.view = v;
    $('idePreview').setAttribute('aria-hidden', String(phone() && v !== 'preview'));
    ide.querySelectorAll('[data-ide-view]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.ideView === v)));
    if (v === 'side') showSide(ide.dataset.side || 'brief', true);
    if (v === 'code') requestAnimationFrame(() => activeEd && activeEd.refresh());
  }
  ide.querySelectorAll('[data-ide-view]').forEach(b => b.addEventListener('click', () => { if (b.dataset.ideView === 'side' && ide.dataset.side === 'files') showSide('brief', true); setView(b.dataset.ideView); }));
  $('ideReload').addEventListener('click', () => { renderTargetApp(); setUrl(PATH[activeChallenge.lab] || '/'); toast('Preview reset.', 'rotate'); });

  /* global shortcuts while the workspace is open */
  document.addEventListener('keydown', e => {
    if (typeof QA === 'undefined' || QA.current !== 'workspace' || !(e.ctrlKey || e.metaKey)) return;
    if (e.target && e.target.classList && e.target.classList.contains('ce-input')) return;   // the editor handles its own
    if (e.key === 'Enter') { e.preventDefault(); runOrStop(); }
    else if (e.key === 's' || e.key === 'S') { e.preventDefault(); saveWorkspaceDraft(true); }
  });
  window.addEventListener('resize', () => activeEd && activeEd.sync());
  if (QA.onLeave) { const prev = QA.onLeave.workspace; QA.onLeave.workspace = () => { if (prev) prev(); if (running) { stopRun(false); finishRun(); } }; }

  fillChallengeSelect(); updateBrief(); updateFramework(); setUrl(PATH[activeChallenge.lab] || '/');
  window.QadenceIDE = { run: runCode, stop: () => stopRun(false), editors: eds, get running() { return running; }, get results() { return results; } };
})();
