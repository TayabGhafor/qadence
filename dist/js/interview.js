/* Qadence · Interview prep: researched question bank (default tab), flashcards and mock
   interviews, alongside the existing scored practice rounds.
   Routes: #/practice · /bank/cat/<cat> · /bank/lesson/<id> · /flash · /mock · /rounds */
(function () {
  'use strict';
  const esc = s => escapeHtml(s == null ? '' : s);
  const root = $id('practice');
  if (!root) return;
  const legacyHub = QA.renderInterviewHub;            // practice rounds (ported)
  const BANK = (CONTENT.interview || []).slice();
  const CATS = [
    ['fundamentals', 'compass', 'Testing fundamentals'], ['design', 'puzzle', 'Test design'], ['defects', 'bug', 'Bugs & defects'], ['agile', 'route', 'Agile & process'],
    ['scenario', 'target', 'How would you test…?'], ['api', 'plug', 'API testing'], ['sql', 'database', 'SQL & databases'], ['automation', 'rocket', 'Automation & Selenium'],
    ['playwright', 'terminal', 'Playwright'], ['coding', 'code', 'Coding & OOP'], ['nonfunctional', 'gauge', 'Performance & security'], ['mobile', 'phone', 'Mobile testing'], ['behavioral', 'users', 'HR & behavioural']
  ].filter(([id]) => BANK.some(q => q.cat === id));
  const CAT = Object.fromEntries(CATS.map(([id, ic, name]) => [id, { id, icon: ic, name }]));
  const FREQ = { 'very-common': ['iv.veryCommon', 'flame', 'accent'], common: ['iv.common', 'trending', 'info'], occasional: ['iv.occasional', 'circle', 'muted'] };   // label keys resolved at render time
  const FREQ_RANK = { 'very-common': 0, common: 1, occasional: 2 };
  const f = { cat: 'all', level: 'all', freq: 'all', status: 'all', q: '', lesson: null, page: 1, size: 10, group: 'topic' };
  let tab = 'bank', flash = null, mock = null;

  const bankState = () => state.interviewBank || (state.interviewBank = { marks: {}, mocks: [] });
  const mark = id => bankState().marks[id];
  function setMark(id, v) { const m = bankState().marks; if (m[id] === v) delete m[id]; else m[id] = v; markActive(); save(); }
  function filtered() {
    const words = f.q ? f.q.split(/\s+/) : [];
    return BANK.filter(q => (f.cat === 'all' || q.cat === f.cat) && (f.level === 'all' || q.level === f.level) && (f.freq === 'all' || q.freq === f.freq)
      && (f.status === 'all' || (f.status === 'new' ? !mark(q.id) : mark(q.id) === f.status)) && (!f.lesson || q.lesson === f.lesson)
      && (!words.length || words.every(w => (q.q + ' ' + q.short).toLowerCase().includes(w))));
  }

  /* ───────────── shell with tabs ───────────── */
  function ensureShell() {
    let tabs = $id('ivTabs'), bank = $id('interviewBank');
    if (!tabs) {
      tabs = document.createElement('div'); tabs.id = 'ivTabs';
      bank = document.createElement('div'); bank.id = 'interviewBank';
      root.insertBefore(bank, root.firstChild); root.insertBefore(tabs, root.firstChild);
    }
    return { tabs, bank };
  }
  function renderTabs() {
    const { tabs } = ensureShell();
    const confident = Object.values(bankState().marks).filter(v => v === 'confident').length;
    tabs.innerHTML = `<div class="page-head iv-head"><div><span class="eyebrow">${icon('mic', 'ic-sm')}${esc(t('nav.interview'))}</span><h1>${esc(t('iv.title'))}</h1><p>${BANK.length} most-asked questions with model answers, flashcards and mock interviews.</p></div><div class="actions"><span class="badge badge-success">${icon('check-circle')}${esc(t('iv.confident', { n: confident }))}</span></div></div>
      <div class="tabs iv-tabs" role="tablist" aria-label="Interview prep">${[['bank', 'list-checks', t('iv.tabBank')], ['flash', 'layers', t('iv.tabFlash')], ['mock', 'timer', t('iv.tabMock')], ['rounds', 'message', t('iv.tabRounds')]].map(([id, ic, label]) => `<button type="button" role="tab" data-iv-tab="${id}" aria-selected="${tab === id}">${icon(ic, 'ic-sm')}${esc(label)}</button>`).join('')}</div>`;
    tabs.querySelectorAll('[data-iv-tab]').forEach(b => b.addEventListener('click', () => showScreen('practice', { parts: b.dataset.ivTab === 'bank' ? [] : [b.dataset.ivTab], replace: true, keepScroll: true })));
  }
  function showPane(which) {
    const { tabs, bank } = ensureShell();
    const hub = $id('interviewHub'), sess = $id('interviewSession');
    tabs.hidden = which === 'session';
    bank.hidden = !(which === 'bank' || which === 'flash' || which === 'mock');
    if (hub) hub.hidden = which !== 'rounds';
    if (sess && which !== 'session') sess.hidden = true;
  }

  /* ───────────── question bank ───────────── */
  /* Topics are grouped in the sidebar; the list is grouped (topic, level or frequency), paginated, and each
     question opens into a 30-second answer plus tabs for the model answer, follow-ups and mistakes. */
  const GROUPS = [
    ['core', 'Core QA', ['fundamentals', 'design', 'defects', 'agile', 'scenario']],
    ['tech', 'Technical', ['api', 'sql', 'nonfunctional', 'mobile']],
    ['code', 'Automation & code', ['automation', 'playwright', 'coding']],
    ['career', 'Career', ['behavioral']]
  ].map(([id, name, cats]) => [id, name, cats.filter(c => CAT[c])]).filter(g => g[2].length);
  (() => { const seen = new Set(GROUPS.flatMap(g => g[2])), rest = CATS.map(c => c[0]).filter(c => !seen.has(c)); if (rest.length) GROUPS.push(['more', 'More topics', rest]); })();
  const TONE = { fundamentals: '#0F766E', design: '#4F46E5', defects: '#DC2626', agile: '#EA580C', scenario: '#D97706', api: '#0284C7', sql: '#2563EB', automation: '#DB2777', playwright: '#16A34A', coding: '#7C3AED', nonfunctional: '#0891B2', mobile: '#65A30D', behavioral: '#C026D3' };
  const tone = c => TONE[c] || '#0F766E';
  const HEAT = { 'very-common': 3, common: 2, occasional: 1 };
  const SIZES = [10, 20, 50];
  const GROUP_BY = { topic: 'Topic', level: 'Level', freq: 'How often asked' };
  const LVL_RANK = l => Math.max(0, LEVELS.indexOf(l));
  const CAT_RANK = c => CATS.findIndex(x => x[0] === c);
  const BANK_RANK = new Map(BANK.map((q, i) => [q.id, i]));
  const navMQ = matchMedia('(max-width: 1100px)');
  let expandAll = false;

  function groupOf(q) {
    if (f.group === 'level') return { key: q.level, rank: LVL_RANK(q.level) };
    if (f.group === 'freq') return { key: q.freq, rank: FREQ_RANK[q.freq] };
    return { key: q.cat, rank: CAT_RANK(q.cat) };
  }
  function sorted() {
    return filtered().sort((a, b) => groupOf(a).rank - groupOf(b).rank || FREQ_RANK[a.freq] - FREQ_RANK[b.freq]
      || LVL_RANK(a.level) - LVL_RANK(b.level) || CAT_RANK(a.cat) - CAT_RANK(b.cat) || BANK_RANK.get(a.id) - BANK_RANK.get(b.id));
  }
  function counts() {
    const marks = bankState().marks; let conf = 0, rev = 0;
    BANK.forEach(q => { if (marks[q.id] === 'confident') conf++; else if (marks[q.id] === 'review') rev++; });
    return { conf, rev, fresh: BANK.length - conf - rev };
  }
  /* Highlight search words in a plain-text string (escapes every piece). */
  function hl(text) {
    const words = f.q ? f.q.split(/\s+/).filter(Boolean) : [];
    if (!words.length) return esc(text);
    const re = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return String(text).split(re).map((part, i) => (i % 2 ? `<mark>${esc(part)}</mark>` : esc(part))).join('');
  }
  const heatBars = n => `<span class="iv-heat-bars b${n}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  const heat = q => { const fr = FREQ[q.freq] || FREQ.common; return `<span class="iv-heat h${HEAT[q.freq] || 2}">${heatBars(HEAT[q.freq] || 2)}${esc(t(fr[0]))}</span>`; };

  function qCard(q, n, open, tabSel, last) {
    const m = mark(q.id), c = CAT[q.cat] || { icon: 'help', name: q.cat }, lesson = q.lesson && LESSON_BY_ID.get(q.lesson), id = q.id, ts = tabSel || 'a';
    const tabs = [['a', 'book', t('iv.modelAnswer')], ['f', 'message', t('iv.followups'), q.followups.length], ['m', 'alert', t('iv.avoid'), q.mistakes.length]];
    const stateLabel = m === 'confident' ? 'Confident' : 'Review later';
    return `<details class="iv-q${m ? ' m-' + m : ''}" data-q="${id}" style="--tc:${tone(q.cat)}"${open ? ' open' : ''}>
  <summary>
    <span class="iv-num">${String(n).padStart(2, '0')}</span>
    <span class="iv-q-main"><b class="iv-q-text">${hl(q.q)}</b><span class="iv-meta"><span class="iv-tag">${icon(c.icon, 'ic-xs')}${esc(c.name)}</span>${lvlBadge(q.level)}${heat(q)}</span></span>
    <span class="iv-end">${m ? `<span class="iv-state s-${m}" title="${stateLabel}">${icon(m === 'confident' ? 'check' : 'bookmark', 'ic-sm')}<span class="sr-only">${stateLabel}</span></span>` : ''}<span class="iv-chev" aria-hidden="true">${icon('chevron-down', 'ic-sm')}</span></span>
  </summary>
  <div class="iv-body" lang="en">
    <div class="iv-short"><span class="iv-short-ic">${icon('zap', 'ic-sm')}</span><div><b class="title">${esc(t('iv.shortAnswer'))}</b><p dir="ltr">${esc(q.short)}</p></div></div>
    <div class="iv-seg" role="tablist" aria-label="Answer details">${tabs.map(([k, ic, label, cnt]) => `<button type="button" role="tab" id="ivt-${id}-${k}" aria-controls="ivp-${id}-${k}" aria-selected="${k === ts}" tabindex="${k === ts ? 0 : -1}" data-ivt="${k}">${icon(ic, 'ic-sm')}<span>${esc(label)}</span>${cnt ? `<em>${cnt}</em>` : ''}</button>`).join('')}</div>
    <div class="iv-panel prose-sm" dir="ltr" role="tabpanel" id="ivp-${id}-a" aria-labelledby="ivt-${id}-a"${ts === 'a' ? '' : ' hidden'}>${rich(q.answer)}</div>
    <div class="iv-panel" dir="ltr" role="tabpanel" id="ivp-${id}-f" aria-labelledby="ivt-${id}-f"${ts === 'f' ? '' : ' hidden'}><ul class="iv-prompts">${q.followups.map(x => `<li>${icon('message', 'ic-sm')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
    <div class="iv-panel" dir="ltr" role="tabpanel" id="ivp-${id}-m" aria-labelledby="ivt-${id}-m"${ts === 'm' ? '' : ' hidden'}><ul class="iv-avoid">${q.mistakes.map(x => `<li>${icon('x-circle', 'ic-sm')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
    <div class="iv-actions">
      <div class="iv-rate" role="group" aria-label="${esc(t('iv.howConfident'))}"><span class="help">${esc(t('iv.howConfident'))}</span><button class="iv-rate-btn r-review" type="button" data-mark="${id}:review" aria-pressed="${m === 'review'}">${icon('bookmark', 'ic-sm')}<span>${esc(t('iv.reviewLater'))}</span></button><button class="iv-rate-btn r-confident" type="button" data-mark="${id}:confident" aria-pressed="${m === 'confident'}">${icon('check-circle', 'ic-sm')}<span>${esc(t('iv.imConfident'))}</span></button></div>
      <div class="iv-act-end">${lesson ? `<button class="btn btn-ghost btn-sm" type="button" data-go="academy/lesson/${lesson.id}" title="${esc(lesson.title)}">${icon('book', 'ic-sm')}<span>Study lesson</span></button>` : ''}<button class="btn btn-secondary btn-sm" type="button" data-next${last ? ' disabled' : ''}><span>${last ? 'Last question' : 'Next question'}</span>${last ? '' : icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
    </div>
  </div>
</details>`;
  }

  function groupHead(key, items, continued) {
    const ok = items.filter(q => mark(q.id) === 'confident').length, pct = items.length ? Math.round(ok / items.length * 100) : 0;
    let ic, name, col;
    if (f.group === 'level') { ic = LEVEL_ICON[key] || 'sprout'; name = t('lvl.' + key); col = { beginner: '#16A34A', intermediate: '#2563EB', advanced: '#7C3AED' }[key] || '#0F766E'; }
    else if (f.group === 'freq') { ic = (FREQ[key] || FREQ.common)[1]; name = t((FREQ[key] || FREQ.common)[0]); col = { 'very-common': '#EA580C', common: '#2563EB', occasional: '#64748B' }[key]; }
    else { const c = CAT[key] || { icon: 'help', name: key }; ic = c.icon; name = c.name; col = tone(key); }
    return `<header class="ivb-sec-head" style="--tc:${col}"><span class="ivb-sec-ic">${icon(ic)}</span><div class="ivb-sec-t"><h3>${esc(name)}${continued ? '<small>continued</small>' : ''}</h3><span>${items.length} question${items.length === 1 ? '' : 's'} · ${ok} confident</span></div><span class="ivb-sec-bar" role="img" aria-label="${pct}% confident"><i style="width:${pct}%"></i></span></header>`;
  }

  function navHtml() {
    const marks = bankState().marks;
    const row = (id, ic, name, list, col) => {
      const ok = list.filter(q => marks[q.id] === 'confident').length, pct = list.length ? Math.round(ok / list.length * 100) : 0, on = f.cat === id;
      return `<button type="button" class="ivb-topic${on ? ' on' : ''}" data-cat="${id}" aria-pressed="${on}" style="--tc:${col};--p:${pct}" title="${esc(name)}: ${ok} of ${list.length} confident"><span class="ivb-ti">${icon(ic, 'ic-sm')}</span><span class="ivb-tn">${esc(name)}</span><span class="ivb-tc">${list.length}</span><span class="ivb-tp" aria-hidden="true"></span><span class="sr-only">, ${ok} confident</span></button>`;
    };
    return `<details class="ivb-navbox" id="ivNavBox" open><summary>${icon('layers', 'ic-sm')}<span>Topic: <b>${esc(f.cat === 'all' ? 'All topics' : CAT[f.cat].name)}</b></span>${icon('chevron-down', 'ic-sm chev')}</summary>
  <nav class="ivb-nav" aria-label="Question topics">
    <div class="ivb-group ivb-group-all">${row('all', 'grid', 'All topics', BANK, '#0F766E')}</div>
    ${GROUPS.map(([gid, gname, cats]) => `<div class="ivb-group" role="group" aria-labelledby="ivg-${gid}"><h3 id="ivg-${gid}">${esc(gname)}</h3>${cats.map(c => row(c, CAT[c].icon, CAT[c].name, BANK.filter(q => q.cat === c), tone(c))).join('')}</div>`).join('')}
  </nav></details>`;
  }
  function heroHtml() {
    const c = counts(), pct = Math.round(c.conf / Math.max(1, BANK.length) * 100);
    const st = [['all', 'list', 'All', BANK.length], ['new', 'circle', 'Not rated', c.fresh], ['review', 'bookmark', t('iv.reviewLater'), c.rev], ['confident', 'check-circle', 'Confident', c.conf]];
    return `<section class="ivb-hero" aria-label="Your interview readiness">
  <div class="ring ivb-ring" style="--size:76px">${ringSvg(pct, 76, 8)}<div class="ring-label"><b>${pct}%</b></div></div>
  <div class="ivb-hero-t"><h2>Interview readiness</h2><p><b>${c.conf}</b> of ${BANK.length} questions confident${c.rev ? ` · <b>${c.rev}</b> to review` : ''}</p></div>
  <div class="ivb-status" role="group" aria-label="Show questions by rating">${st.map(([k, ic, label, n]) => `<button type="button" data-status="${k}" aria-pressed="${f.status === k}">${icon(ic, 'ic-sm')}<span>${esc(label)}</span><em>${n}</em></button>`).join('')}</div>
</section>`;
  }
  function toolsHtml() {
    const fq = [['all', 'Any frequency'], ...Object.entries(FREQ).map(([k, v]) => [k, t(v[0])])];
    return `<div class="ivb-tools">
  <div class="input-icon ivb-search">${icon('search')}<label class="sr-only" for="ivSearch">Search questions</label><input class="input" id="ivSearch" type="search" autocomplete="off" placeholder="Search ${BANK.length} questions and answers…" value="${esc(f.q)}"></div>
  <div class="ivb-filters">
    <div class="seg" role="group" aria-label="Level">${['all', ...LEVELS].map(lv => `<button type="button" data-lv="${lv}" aria-pressed="${f.level === lv}">${esc(t(lv === 'all' ? 'lvl.all' : 'lvl.' + lv))}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="How often asked">${fq.map(([k, label]) => `<button type="button" data-fq="${k}" aria-pressed="${f.freq === k}">${k !== 'all' ? heatBars(HEAT[k]) : ''}${esc(label)}</button>`).join('')}</div>
    <label class="ivb-groupby"><span>${icon('layers', 'ic-sm')}Group by</span><select class="select" id="ivGroup">${Object.entries(GROUP_BY).map(([k, v]) => `<option value="${k}"${f.group === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
  </div>
</div>`;
  }

  function renderBank() {
    const { bank } = ensureShell();
    const les = f.lesson && LESSON_BY_ID.get(f.lesson);
    bank.innerHTML = `<div class="ivb">
  <aside class="ivb-side" id="ivSide">${navHtml()}</aside>
  <div class="ivb-main">
    <div id="ivHero">${heroHtml()}</div>
    ${toolsHtml()}
    ${les ? `<div class="callout callout-info ivb-lesson">${icon('book')}<div>Questions related to <b>${esc(les.title)}</b>. <button class="link-btn" type="button" id="ivClearLesson">Show all</button></div></div>` : ''}
    <div class="ivb-results-head" id="ivResults"><div><h2 id="ivResultsH" tabindex="-1"></h2><p class="filter-summary" id="ivSummary" role="status" aria-live="polite"></p></div><button class="btn btn-ghost btn-sm" type="button" id="ivExpand" aria-pressed="${expandAll}">${icon('list', 'ic-sm')}<span>${expandAll ? 'Collapse all' : 'Expand all'}</span></button></div>
    <div class="ivb-list" id="ivList"></div>
    <nav class="ivb-pager" id="ivPager" aria-label="Question pages"></nav>
  </div>
</div>`;
    syncNavBox();
    wireBank(bank);
    let tmr; $id('ivSearch').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { setFilter({ q: e.target.value.trim().toLowerCase() }); renderList(); }, 160); });
    renderList();
  }
  function syncNavBox() { const nb = $id('ivNavBox'); if (nb) nb.open = !navMQ.matches; }
  function renderNav() { const side = $id('ivSide'); if (side) { side.innerHTML = navHtml(); syncNavBox(); } }
  function renderHero() { const h = $id('ivHero'); if (h) h.innerHTML = heroHtml(); }
  function setFilter(patch) { Object.assign(f, patch, { page: 1 }); }
  function press(sel, el) { $id('interviewBank').querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', String(x === el))); }
  function toResults(focus) {
    const head = $id('ivResults'); if (!head) return;
    if (head.getBoundingClientRect().top < 70 || focus) head.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' });
    if (focus) $id('ivResultsH')?.focus({ preventScroll: true });
  }
  function reveal(d) {   // keep an opened card's question in view (an earlier card above it may have just closed)
    requestAnimationFrame(() => { const top = d.getBoundingClientRect().top; if (top < 70 || top > innerHeight - 120) d.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' }); });
  }

  function wireBank(bank) {
    if (bank.dataset.wired) return;
    bank.dataset.wired = '1';
    navMQ.addEventListener?.('change', syncNavBox);
    bank.addEventListener('click', e => {
      if (tab !== 'bank') return;
      const el = e.target.closest('[data-cat],[data-status],[data-lv],[data-fq],[data-page],[data-mark],[data-ivt],[data-next],#ivExpand,#ivClearLesson,[data-iv-clear]');
      if (!el || !bank.contains(el)) return;
      const d = el.dataset;
      if (d.cat) { setFilter({ cat: d.cat === 'all' || f.cat === d.cat ? 'all' : d.cat }); renderNav(); renderList(); toResults(false); return; }
      if (d.status) { setFilter({ status: d.status }); renderHero(); renderList(); return; }
      if (d.lv) { setFilter({ level: d.lv }); press('[data-lv]', el); renderList(); return; }
      if (d.fq) { setFilter({ freq: d.fq }); press('[data-fq]', el); renderList(); return; }
      if (d.page) { f.page = d.page === 'prev' ? f.page - 1 : d.page === 'next' ? f.page + 1 : Number(d.page); renderList(); toResults(true); return; }
      if (d.mark) { e.preventDefault(); rate(el); return; }
      if (d.ivt) { selectTab(el, false); return; }
      if (el.hasAttribute('data-next')) { nextQuestion(el.closest('.iv-q')); return; }
      if (el.id === 'ivExpand') { expandAll = !expandAll; el.setAttribute('aria-pressed', String(expandAll)); el.querySelector('span').textContent = expandAll ? 'Collapse all' : 'Expand all'; bank.querySelectorAll('.iv-q').forEach(x => { x.open = expandAll; }); return; }
      if (el.id === 'ivClearLesson') { f.lesson = null; showScreen('practice', { parts: [], replace: true }); return; }
      if (el.hasAttribute('data-iv-clear')) { Object.assign(f, { cat: 'all', level: 'all', freq: 'all', status: 'all', q: '', lesson: null, page: 1 }); renderBank(); }
    });
    bank.addEventListener('change', e => {
      if (e.target.id === 'ivGroup') { setFilter({ group: e.target.value }); renderList(); }
      if (e.target.id === 'ivSize') { setFilter({ size: Number(e.target.value) || 10 }); renderList(); toResults(true); }
    });
    bank.addEventListener('keydown', e => {
      const tb = e.target.closest && e.target.closest('.iv-seg [role="tab"]'); if (!tb) return;
      const all = [...tb.parentElement.querySelectorAll('[role="tab"]')], i = all.indexOf(tb);
      const k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: all.length - 1 - i }[e.key]; if (k == null) return;
      e.preventDefault(); const dir = document.documentElement.dir === 'rtl' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') ? -k : k;
      selectTab(all[(i + dir + all.length) % all.length], true);
    });
    /* One question open at a time (unless "Expand all"); keep the opened one in view. */
    bank.addEventListener('toggle', e => {
      const d = e.target; if (!d.classList || !d.classList.contains('iv-q') || !d.open || expandAll) return;
      bank.querySelectorAll('.iv-q[open]').forEach(x => { if (x !== d) x.open = false; });
      reveal(d);
    }, true);
  }
  function selectTab(tb, focus) {
    const card = tb.closest('.iv-q'), k = tb.dataset.ivt;
    card.querySelectorAll('.iv-seg [role="tab"]').forEach(b => { const on = b === tb; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    card.querySelectorAll('.iv-panel').forEach(p => { p.hidden = !p.id.endsWith('-' + k); });
    if (focus) tb.focus();
  }
  function rate(b) {
    const [id, v] = b.dataset.mark.split(':'); setMark(id, v);
    const d = b.closest('.iv-q'), q = BANK.find(x => x.id === id); if (!d || !q) return;
    const n = Number(d.querySelector('.iv-num').textContent), sel = d.querySelector('.iv-seg [aria-selected="true"]'), last = !!d.querySelector('[data-next][disabled]');
    const tmp = document.createElement('div'); tmp.innerHTML = qCard(q, n, true, sel && sel.dataset.ivt, last);
    const nd = tmp.firstElementChild; d.replaceWith(nd);
    nd.querySelector(`[data-mark="${id}:${v}"]`)?.focus();
    toast(mark(id) === 'confident' ? 'Marked as confident.' : mark(id) === 'review' ? 'Saved to review later.' : 'Rating cleared.', mark(id) === 'confident' ? 'check-circle' : 'bookmark');
    renderTabs(); renderNav(); renderHero(); refreshGroupHeads();
  }
  function refreshGroupHeads() {
    const list = sorted(), by = new Map(); list.forEach(q => { const k = groupOf(q).key; if (!by.has(k)) by.set(k, []); by.get(k).push(q); });
    document.querySelectorAll('#ivList .ivb-sec').forEach(sec => { const items = by.get(sec.dataset.g); const h = sec.querySelector('.ivb-sec-head'); if (items && h) h.outerHTML = groupHead(sec.dataset.g, items, sec.dataset.cont === '1'); });
  }
  function openCard(card) {
    card.open = true;
    card.querySelector('summary').focus({ preventScroll: true });
    requestAnimationFrame(() => card.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' }));
  }
  function nextQuestion(d) {
    const cards = [...$id('ivList').querySelectorAll('.iv-q')], i = cards.indexOf(d);
    if (i >= 0 && i < cards.length - 1) { if (!expandAll) d.open = false; openCard(cards[i + 1]); return; }
    const pages = Math.ceil(sorted().length / f.size);
    if (f.page < pages) { f.page++; renderList(); const first = $id('ivList').querySelector('.iv-q'); if (first) openCard(first); }
  }

  function pageList(cur, n) {
    const s = new Set([1, n, cur - 1, cur, cur + 1]);
    if (cur <= 3) [2, 3, 4].forEach(p => s.add(p));
    if (cur >= n - 2) [n - 1, n - 2, n - 3].forEach(p => s.add(p));
    const arr = [...s].filter(p => p >= 1 && p <= n).sort((a, b) => a - b), out = [];
    arr.forEach((p, i) => { if (i && p - arr[i - 1] > 1) out.push('…'); out.push(p); });
    return out;
  }
  function renderPager(total, pages) {
    const el = $id('ivPager'); if (!el) return;
    el.hidden = total <= SIZES[0];
    if (el.hidden) { el.innerHTML = ''; return; }
    el.innerHTML = `<div class="ivb-pages">
  <button type="button" class="ivb-pg ivb-pg-step" data-page="prev"${f.page <= 1 ? ' disabled' : ''} aria-label="Previous page">${icon('chevron-left', 'ic-sm flip-rtl')}<span>Previous</span></button>
  <span class="ivb-pg-nums">${pageList(f.page, pages).map(p => p === '…' ? '<span class="ivb-pg-gap" aria-hidden="true">…</span>' : `<button type="button" class="ivb-pg" data-page="${p}"${p === f.page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`).join('')}</span>
  <span class="ivb-pg-of">Page ${f.page} of ${pages}</span>
  <button type="button" class="ivb-pg ivb-pg-step" data-page="next"${f.page >= pages ? ' disabled' : ''} aria-label="Next page"><span>Next</span>${icon('chevron-right', 'ic-sm flip-rtl')}</button>
</div>
<label class="ivb-size"><span>Per page</span><select class="select" id="ivSize">${SIZES.map(s => `<option value="${s}"${s === f.size ? ' selected' : ''}>${s}</option>`).join('')}</select></label>`;
  }
  function renderList() {
    const box = $id('ivList'); if (!box) return;
    const list = sorted(), total = list.length, pages = Math.max(1, Math.ceil(total / f.size));
    f.page = Math.min(Math.max(1, f.page || 1), pages);
    const start = (f.page - 1) * f.size, slice = list.slice(start, start + f.size);
    const les = f.lesson && LESSON_BY_ID.get(f.lesson);
    $id('ivResultsH').textContent = les ? 'Related questions' : f.cat !== 'all' ? CAT[f.cat].name : 'All questions';
    $id('ivSummary').textContent = total ? `Showing ${start + 1}–${start + slice.length} of ${total} · grouped by ${GROUP_BY[f.group].toLowerCase()}, most asked first` : 'No questions match these filters';
    $id('ivExpand').hidden = !total;
    if (!total) {
      box.innerHTML = `<div class="empty card ivb-empty"><span class="tile">${icon('search')}</span><h3>No questions match</h3><p>Try another word or clear the filters.</p><button class="btn btn-secondary btn-sm" type="button" data-iv-clear>${icon('rotate', 'ic-sm')}Clear filters</button></div>`;
      renderPager(0, 1); return;
    }
    const by = new Map(); list.forEach(q => { const k = groupOf(q).key; if (!by.has(k)) by.set(k, []); by.get(k).push(q); });
    let html = '', cur = null;
    slice.forEach((q, i) => {
      const k = groupOf(q).key;
      if (k !== cur) {
        if (cur !== null) html += '</div></section>';
        cur = k; const cont = by.get(k)[0] !== q;
        html += `<section class="ivb-sec" data-g="${esc(k)}" data-cont="${cont ? 1 : 0}">${groupHead(k, by.get(k), cont)}<div class="ivb-sec-body">`;
      }
      html += qCard(q, start + i + 1, expandAll, 'a', start + i + 1 === total);
    });
    box.className = 'ivb-list g-' + f.group;
    box.innerHTML = html + '</div></section>';
    renderPager(total, pages);
  }

  /* ───────────── flashcards ───────────── */
  function startFlash() { const list = shuffle(filtered().filter(q => mark(q.id) !== 'confident')); flash = { list: list.length ? list : shuffle(filtered()), i: 0, flipped: false, known: 0 }; }
  function renderFlash() {
    const { bank } = ensureShell();
    if (!flash) startFlash();
    const q = flash.list[flash.i];
    if (!q) { bank.innerHTML = `<div class="empty card">${icon('layers', 'ic-xl')}<h3>No cards for this filter</h3><button class="btn btn-secondary btn-sm" type="button" data-iv-reset>${icon('rotate')}Use all questions</button></div>`; bank.querySelector('[data-iv-reset]').addEventListener('click', () => { Object.assign(f, { cat: 'all', level: 'all', freq: 'all', status: 'all', q: '' }); flash = null; renderFlash(); }); return; }
    const c = CAT[q.cat] || { icon: 'help', name: q.cat };
    bank.innerHTML = `
<div class="flash-wrap">
  <div class="flash-top"><span class="muted">Card ${flash.i + 1} of ${flash.list.length}${f.cat !== 'all' ? ' · ' + esc(CAT[f.cat].name) : ''}</span>${barHtml((flash.i) / flash.list.length * 100, 'Deck progress', 'bar-sm')}<label class="sr-only" for="flashCat">Topic</label><select class="select" id="flashCat" style="width:auto"><option value="all">All topics</option>${CATS.map(([id, , name]) => `<option value="${id}"${f.cat === id ? ' selected' : ''}>${esc(name)}</option>`).join('')}</select></div>
  <div class="flash-card${flash.flipped ? ' flipped' : ''}" id="flashCard" tabindex="0" role="button" aria-label="${flash.flipped ? 'Answer shown. Press to show the question' : 'Question. Press to reveal the answer'}" lang="en">
    <div class="flash-face flash-front"><span class="badge">${icon(c.icon)}${esc(c.name)}</span><h2>${esc(q.q)}</h2><span class="flash-hint">${icon('eye', 'ic-sm')}Say your answer out loud, then flip — tap or press Space</span></div>
    <div class="flash-face flash-back"><span class="badge badge-success">${icon('zap')}Answer</span><p class="flash-short">${esc(q.short)}</p><div class="prose-sm flash-long">${rich(q.answer)}</div></div>
  </div>
  <div class="flash-actions">${flash.flipped ? `<button class="btn btn-secondary" type="button" data-flash="again">${icon('rotate')}${esc(t('iv.stillLearning'))}</button><button class="btn btn-primary" type="button" data-flash="know">${icon('check-circle')}${esc(t('iv.knewIt'))}</button>` : `<button class="btn btn-primary btn-lg" type="button" data-flash="flip">${icon('eye')}${esc(t('iv.showAnswer'))}</button>`}</div>
  <p class="help" style="text-align:center">“I knew it” marks the question as confident; “Still learning” saves it for review. Keyboard: Space flips, ← → move.</p>
</div>`;
    const card = $id('flashCard');
    const flip = () => { flash.flipped = !flash.flipped; renderFlash(); $id('flashCard')?.focus(); };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft' && flash.i > 0) { flash.i--; flash.flipped = false; renderFlash(); $id('flashCard')?.focus(); } });
    const next = (verdict) => {
      if (verdict) { bankState().marks[q.id] = verdict === 'know' ? 'confident' : 'review'; if (verdict === 'know') flash.known++; markActive(); save(); }
      flash.i++; flash.flipped = false;
      if (flash.i >= flash.list.length) { const known = flash.known; flash = null; const { bank: bk } = ensureShell(); bk.innerHTML = `<div class="card flash-done">${icon('trophy', 'ic-xl')}<h2>Deck complete</h2><p>You knew <b>${known}</b> of these cards. Cards you’re still learning are saved under “Review later”.</p><div class="row" style="justify-content:center"><button class="btn btn-primary" type="button" id="flashAgain">${icon('rotate')}New deck</button><button class="btn btn-secondary" type="button" data-go="practice">${icon('list-checks')}Question bank</button></div></div>`; $id('flashAgain').addEventListener('click', () => renderFlash()); renderTabs(); return; }
      renderFlash(); $id('flashCard')?.focus();
    };
    bank.querySelectorAll('[data-flash]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const v = b.dataset.flash; if (v === 'flip') flip(); else next(v); }));
    $id('flashCat').addEventListener('change', e => { f.cat = e.target.value; flash = null; renderFlash(); });
  }

  /* ───────────── mock interview ───────────── */
  const mockCfg = { cats: [], count: 6 };
  function mockPool() {
    return mockCfg.cats.length ? BANK.filter(q => mockCfg.cats.includes(q.cat)) : BANK;
  }
  function renderMockSetup() {
    const { bank } = ensureShell();
    const past = bankState().mocks.slice().reverse().slice(0, 5);
    bank.innerHTML = `
<div class="mock-grid">
  <section class="card mock-setup" aria-labelledby="mkH">
    <header class="mock-heading">
      <span class="tile tile-lg">${icon('mic')}</span>
      <div><h2 id="mkH">Set up a mock interview</h2><p>Answer one question at a time, compare with the model answer, and score yourself.</p></div>
    </header>
    <div class="mock-controls">
      <fieldset class="mock-field">
        <legend>Topics</legend>
        <div class="mock-topics">
          ${[['', 'shuffle', 'Mixed topics'], ...CATS].map(([id, ic, name]) => `<button type="button" class="mock-topic" data-mk="${id}" aria-pressed="${id ? mockCfg.cats.includes(id) : !mockCfg.cats.length}">${icon(ic, 'ic-sm')}<span>${esc(name)}</span>${icon('check', 'ic-sm mock-topic-check')}</button>`).join('')}
        </div>
      </fieldset>
      <fieldset class="mock-field">
        <legend>Number of questions</legend>
        <div class="seg mock-count">${[4, 6, 8, 10].map(n => `<button type="button" data-mkc="${n}" aria-pressed="${mockCfg.count === n}">${n}</button>`).join('')}</div>
      </fieldset>
    </div>
    <footer class="mock-launch">
      <div class="mock-preview" role="status"><b id="mkPreviewCount"></b><small id="mkPreviewTopics"></small></div>
      <button class="btn btn-primary" type="button" id="mkStart">${icon('play')}${esc(t('iv.startMock'))}</button>
    </footer>
  </section>
  <div class="mock-sidebar">
    <section class="card mock-history" aria-labelledby="mkPastH"><div class="card-title"><h2 id="mkPastH">${icon('clock')} Recent mock interviews</h2></div>
      ${past.length ? `<ul class="mock-history-list">${past.map(m => `<li class="mock-history-row"><span class="tr-body"><b>${m.count} questions</b><small>${esc(relDate(m.date))}</small></span><span class="score-pill ${m.score >= 70 ? 'good' : m.score >= 50 ? 'mid' : 'low'}">${m.score}%</span></li>`).join('')}</ul>` : `<div class="mock-history-empty"><span class="tile" data-tone="info">${icon('clock')}</span><div><h3>No mock interviews yet</h3><p>Completed sessions and scores will appear here.</p></div></div>`}
    </section>
    <aside class="callout callout-tip mock-tip">${icon('bulb')}<div><b class="title">Interview tip</b>Define the concept, give a real project example, then explain why it matters.</div></aside>
  </div>
</div>`;
    const topicButtons = bank.querySelectorAll('[data-mk]');
    const countButtons = bank.querySelectorAll('[data-mkc]');
    const updatePreview = () => {
      const available = mockPool().length;
      const selected = mockCfg.cats.length;
      const count = Math.min(mockCfg.count, available);
      $id('mkPreviewCount').textContent = `${count} ${count === 1 ? 'question' : 'questions'}`;
      $id('mkPreviewTopics').textContent = selected ? `${selected} ${selected === 1 ? 'topic' : 'topics'} selected · ${available} available` : 'Mixed across all topics';
    };
    topicButtons.forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.mk;
      if (!id) mockCfg.cats = [];
      else if (mockCfg.cats.includes(id)) mockCfg.cats = mockCfg.cats.filter(x => x !== id);
      else mockCfg.cats.push(id);
      topicButtons.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.mk ? mockCfg.cats.includes(x.dataset.mk) : !mockCfg.cats.length)));
      updatePreview();
    }));
    countButtons.forEach(b => b.addEventListener('click', () => {
      mockCfg.count = Number(b.dataset.mkc);
      countButtons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      updatePreview();
    }));
    updatePreview();
    $id('mkStart').addEventListener('click', () => {
      const pool = mockPool();
      const pick = shuffle(pool.filter(q => q.freq !== 'occasional')).concat(shuffle(pool.filter(q => q.freq === 'occasional'))).slice(0, mockCfg.count);
      mock = { list: shuffle(pick), i: 0, revealed: false, scores: [], start: Date.now(), qStart: Date.now() };
      renderMock();
      bank.querySelector('.runner-head h1')?.focus();
    });
  }
  let mockTimer = null;
  function renderMock() {
    clearInterval(mockTimer);
    const { bank } = ensureShell();
    if (!mock) return renderMockSetup();
    const q = mock.list[mock.i];
    if (!q) {
      const score = Math.round(mock.scores.reduce((a, b) => a + b, 0) / (mock.scores.length * 3) * 100) || 0;
      bankState().mocks.push({ date: new Date().toISOString(), count: mock.scores.length, score }); markActive(); save();
      const rows = mock.list.map((x, k) => `<div class="test-row" style="cursor:default"><span class="score-pill ${mock.scores[k] >= 2 ? 'good' : mock.scores[k] === 1 ? 'mid' : 'low'}">${mock.scores[k]}/3</span><span class="tr-body"><b>${esc(x.q)}</b><small>${esc((CAT[x.cat] || {}).name || '')}</small></span></div>`).join('');
      mock = null;
      bank.innerHTML = `<div class="card mock-done"><div class="ring" style="--size:130px">${ringSvg(score, 130, 11)}<div class="ring-label"><b>${score}%</b><span>self-score</span></div></div><h2>Mock interview complete</h2><p class="muted">Questions you scored 0–1 were saved to “Review later” in the question bank.</p><div class="stack" style="text-align:start;margin-top:12px">${rows}</div><div class="row" style="justify-content:center;margin-top:16px"><button class="btn btn-primary" type="button" id="mkAgain">${icon('rotate')}Another mock interview</button><button class="btn btn-secondary" type="button" data-go="practice">${icon('list-checks')}Question bank</button></div></div>`;
      $id('mkAgain').addEventListener('click', renderMockSetup);
      if (score >= 70) QA.celebrate('Strong mock interview!');
      renderTabs();
      return;
    }
    const c = CAT[q.cat] || { icon: 'help', name: q.cat };
    bank.innerHTML = `
<div class="mock-run">
  <div class="runner-head" style="position:static"><div><h1 tabindex="-1">Mock interview</h1><small class="muted">Question ${mock.i + 1} of ${mock.list.length}</small></div>${barHtml(mock.i / mock.list.length * 100, 'Interview progress')}<span class="timer" id="mkTimer">${icon('clock', 'ic-sm')}<span>0:00</span></span></div>
  <section class="q-card" lang="en"><div class="q-top"><span class="badge">${icon(c.icon)}${esc(c.name)}</span>${lvlBadge(q.level)}</div>
    <h2>${esc(q.q)}</h2>
    <label class="label" for="mkAns">Your answer (optional — not saved)</label><textarea class="textarea" id="mkAns" placeholder="Type key points, or answer out loud…"></textarea>
    ${mock.revealed ? `<div class="iv-short" style="margin-top:14px">${icon('zap', 'ic-sm')}<div><b class="title">Short answer</b>${esc(q.short)}</div></div><div class="iv-answer"><h4>Model answer</h4><div class="prose-sm">${rich(q.answer)}</div></div>
      <div class="mock-score"><span class="label">Score yourself</span><div class="seg" role="group" aria-label="Self score">${[[0, 'Missed it'], [1, 'Partly'], [2, 'Good'], [3, 'Excellent']].map(([v, l]) => `<button type="button" data-score="${v}">${v} · ${l}</button>`).join('')}</div></div>` : `<div class="q-nav"><span></span><button class="btn btn-primary" type="button" id="mkReveal">${icon('eye')}Reveal model answer</button></div>`}
  </section>
</div>`;
    const tEl = $id('mkTimer');
    mockTimer = setInterval(() => { if (!document.body.contains(tEl)) { clearInterval(mockTimer); return; } const s = Math.round((Date.now() - mock.qStart) / 1000); tEl.querySelector('span').textContent = fmtDuration(s); tEl.classList.toggle('warn', s > 150); }, 1000);
    $id('mkReveal')?.addEventListener('click', () => { const txt = $id('mkAns').value; mock.revealed = true; renderMock(); $id('mkAns').value = txt; });
    bank.querySelectorAll('[data-score]').forEach(b => b.addEventListener('click', () => {
      const v = Number(b.dataset.score); mock.scores.push(v);
      bankState().marks[q.id] = v >= 2 ? 'confident' : 'review';
      mock.i++; mock.revealed = false; mock.qStart = Date.now(); renderMock();
    }));
  }

  /* ───────────── router entry ───────────── */
  QA.renderInterviewHub = function (parts) {
    parts = parts || [];
    clearInterval(mockTimer);
    if (typeof session !== 'undefined' && session && typeof interviewView !== 'undefined' && interviewView === 'session' && !parts.length) { showPane('session'); legacyHub && legacyHub(); return; }
    if (parts[0] === 'rounds' || (!parts.length && tab === 'rounds' && typeof interviewView !== 'undefined' && interviewView === 'hub' && session)) tab = 'rounds';
    else if (parts[0] === 'flash') tab = 'flash';
    else if (parts[0] === 'mock') tab = 'mock';
    else { tab = 'bank'; if (parts[0] === 'bank' && parts[1] === 'cat' && CAT[parts[2]]) { f.cat = parts[2]; f.lesson = null; f.page = 1; } if (parts[0] === 'bank' && parts[1] === 'lesson' && LESSON_BY_ID.has(parts[2])) { f.lesson = parts[2]; f.cat = 'all'; f.page = 1; } }
    renderTabs();
    if (tab === 'rounds') { if (typeof interviewView !== 'undefined') interviewView = 'hub'; showPane('rounds'); legacyHub && legacyHub(); return; }
    showPane(tab);
    if (tab === 'flash') { flash = null; renderFlash(); } else if (tab === 'mock') { if (!mock) renderMockSetup(); else renderMock(); } else renderBank();
  };
  QA.onLeave.practice = () => clearInterval(mockTimer);
  if (typeof renderPractice === 'function') {
    const baseRenderPractice = renderPractice;
    renderPractice = function () { const r = baseRenderPractice.apply(this, arguments); showPane('session'); return r; };
  }
  window.QadenceInterview = { bank: BANK, cats: CATS };
})();
