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
  const f = { cat: 'all', level: 'all', freq: 'all', status: 'all', q: '', lesson: null, limit: 20 };
  let tab = 'bank', flash = null, mock = null;

  const bankState = () => state.interviewBank || (state.interviewBank = { marks: {}, mocks: [] });
  const mark = id => bankState().marks[id];
  function setMark(id, v) { const m = bankState().marks; if (m[id] === v) delete m[id]; else m[id] = v; markActive(); save(); }
  function filtered() {
    const words = f.q ? f.q.split(/\s+/) : [];
    return BANK.filter(q => (f.cat === 'all' || q.cat === f.cat) && (f.level === 'all' || q.level === f.level) && (f.freq === 'all' || q.freq === f.freq)
      && (f.status === 'all' || (f.status === 'new' ? !mark(q.id) : mark(q.id) === f.status)) && (!f.lesson || q.lesson === f.lesson)
      && (!words.length || words.every(w => (q.q + ' ' + q.short).toLowerCase().includes(w))))
      .sort((a, b) => FREQ_RANK[a.freq] - FREQ_RANK[b.freq] || CATS.findIndex(c => c[0] === a.cat) - CATS.findIndex(c => c[0] === b.cat));
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
  function qCard(q, i) {
    const m = mark(q.id), fr = FREQ[q.freq], c = CAT[q.cat] || { icon: 'help', name: q.cat }, lesson = q.lesson && LESSON_BY_ID.get(q.lesson);
    return `<details class="iv-q${m ? ' m-' + m : ''}" data-q="${q.id}">
      <summary><span class="iv-num">${String(i + 1).padStart(2, '0')}</span><span class="iv-q-main"><b>${esc(q.q)}</b><span class="iv-meta"><span class="badge">${icon(c.icon)}${esc(c.name)}</span>${lvlBadge(q.level)}<span class="badge badge-${fr[2] === 'muted' ? 'outline' : fr[2]}">${icon(fr[1])}${esc(t(fr[0]))}</span>${m ? `<span class="badge ${m === 'confident' ? 'badge-success' : 'badge-gold'}">${icon(m === 'confident' ? 'check' : 'bookmark')}${m === 'confident' ? 'Confident' : 'Review'}</span>` : ''}</span></span>${icon('chevron-down', 'chev')}</summary>
      <div class="iv-body" lang="en">
        <div class="iv-short">${icon('zap', 'ic-sm')}<div><b class="title">${esc(t('iv.shortAnswer'))}</b>${esc(q.short)}</div></div>
        <div class="iv-answer"><h4>${esc(t('iv.modelAnswer'))}</h4><div class="prose-sm">${rich(q.answer)}</div></div>
        <div class="iv-cols"><div><h4>${icon('message', 'ic-sm')} ${esc(t('iv.followups'))}</h4><ul>${q.followups.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>${icon('alert', 'ic-sm')} ${esc(t('iv.avoid'))}</h4><ul class="iv-avoid">${q.mistakes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
        <div class="iv-actions"><span class="help">${esc(t('iv.howConfident'))}</span><button class="btn btn-sm ${m === 'review' ? 'btn-soft' : 'btn-ghost'}" type="button" data-mark="${q.id}:review" aria-pressed="${m === 'review'}">${icon('bookmark')}${esc(t('iv.reviewLater'))}</button><button class="btn btn-sm ${m === 'confident' ? 'btn-primary' : 'btn-secondary'}" type="button" data-mark="${q.id}:confident" aria-pressed="${m === 'confident'}">${icon('check-circle')}${esc(t('iv.imConfident'))}</button>${lesson ? `<button class="link-btn" type="button" data-go="academy/lesson/${lesson.id}" style="margin-inline-start:auto">${icon('book', 'ic-sm')}Study: ${esc(lesson.title)}</button>` : ''}</div>
      </div>
    </details>`;
  }
  function renderBank() {
    const { bank } = ensureShell();
    const marks = bankState().marks;
    const vc = BANK.filter(q => q.freq === 'very-common');
    bank.innerHTML = `
<section class="iv-topics" aria-label="Topics">${CATS.map(([id, ic, name]) => { const list = BANK.filter(q => q.cat === id), ok = list.filter(q => marks[q.id] === 'confident').length; return `<button type="button" class="iv-topic${f.cat === id ? ' on' : ''}" data-cat="${id}" aria-pressed="${f.cat === id}"><span class="iv-topic-ring" style="--p:${list.length ? Math.round(ok / list.length * 100) : 0}">${icon(ic)}</span><span><b>${esc(name)}</b><small>${list.length} questions · ${ok} confident</small></span></button>`; }).join('')}</section>
<div class="filterbar">
  <div class="input-icon">${icon('search')}<label class="sr-only" for="ivSearch">Search questions</label><input class="input" id="ivSearch" type="search" placeholder="Search ${BANK.length} questions…" value="${esc(f.q)}"></div>
  <div class="seg" role="group" aria-label="Level">${['all', ...LEVELS].map(lv => `<button type="button" data-lv="${lv}" aria-pressed="${f.level === lv}">${esc(t(lv === 'all' ? 'lvl.all' : 'lvl.' + lv))}</button>`).join('')}</div>
  <label class="sr-only" for="ivFreq">How often asked</label><select class="select" id="ivFreq" style="width:auto"><option value="all">Any frequency</option>${Object.entries(FREQ).map(([k, v]) => `<option value="${k}"${f.freq === k ? ' selected' : ''}>${esc(t(v[0]))}</option>`).join('')}</select>
  <label class="sr-only" for="ivStatus">Status</label><select class="select" id="ivStatus" style="width:auto">${[['all', 'All questions'], ['new', 'Not rated yet'], ['review', 'Review later'], ['confident', 'Confident']].map(([k, v]) => `<option value="${k}"${f.status === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
</div>
${f.lesson && LESSON_BY_ID.get(f.lesson) ? `<div class="callout callout-info" style="margin-bottom:14px">${icon('book')}<div>Showing questions related to <b>${esc(LESSON_BY_ID.get(f.lesson).title)}</b>. <button class="link-btn" type="button" id="ivClearLesson">Show all</button></div></div>` : ''}
<div class="iv-toolbar"><p class="filter-summary" id="ivSummary" role="status" aria-live="polite"></p><div class="row"><button class="btn btn-secondary btn-sm" type="button" id="ivTop">${icon('flame')}${esc(t('iv.topAsked', { n: Math.min(30, vc.length) }))}</button><button class="btn btn-ghost btn-sm" type="button" id="ivExpand">${icon('list')}Expand all</button></div></div>
<div class="iv-list" id="ivList"></div>`;
    renderList();
    bank.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { f.cat = f.cat === b.dataset.cat ? 'all' : b.dataset.cat; f.limit = 20; renderBank(); }));
    bank.querySelectorAll('[data-lv]').forEach(b => b.addEventListener('click', () => { f.level = b.dataset.lv; f.limit = 20; bank.querySelectorAll('[data-lv]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderList(); }));
    $id('ivFreq').addEventListener('change', e => { f.freq = e.target.value; f.limit = 20; renderList(); });
    $id('ivStatus').addEventListener('change', e => { f.status = e.target.value; f.limit = 20; renderList(); });
    let tmr; $id('ivSearch').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { f.q = e.target.value.trim().toLowerCase(); f.limit = 20; renderList(); }, 140); });
    $id('ivClearLesson')?.addEventListener('click', () => { f.lesson = null; showScreen('practice', { parts: [], replace: true }); });
    $id('ivTop').addEventListener('click', () => { Object.assign(f, { cat: 'all', level: 'all', freq: 'very-common', status: 'all', q: '', limit: 30 }); renderBank(); });
    $id('ivExpand').addEventListener('click', e => { const open = e.currentTarget.dataset.open !== '1'; e.currentTarget.dataset.open = open ? '1' : '0'; e.currentTarget.innerHTML = `${icon('list')}${open ? 'Collapse all' : 'Expand all'}`; bank.querySelectorAll('.iv-q').forEach(d => { d.open = open; }); });
  }
  function renderList() {
    const list = filtered(), box = $id('ivList'); if (!box) return;
    $id('ivSummary').textContent = `${list.length} question${list.length === 1 ? '' : 's'}${f.cat !== 'all' ? ' in ' + CAT[f.cat].name : ''} · most asked first`;
    box.innerHTML = list.length ? list.slice(0, f.limit).map(qCard).join('') + (list.length > f.limit ? `<button class="btn btn-secondary iv-more" type="button" id="ivMore">${icon('chevron-down')}Show ${Math.min(20, list.length - f.limit)} more</button>` : '') : `<div class="empty card">${icon('search', 'ic-xl')}<h3>No questions match</h3><p>Try clearing a filter.</p></div>`;
    $id('ivMore')?.addEventListener('click', () => { f.limit += 20; renderList(); });
    box.onclick = e => {
      const b = e.target.closest('[data-mark]'); if (!b || !box.contains(b)) return;
      e.preventDefault();
      const [id, v] = b.dataset.mark.split(':'); setMark(id, v);
      const d = b.closest('.iv-q'), idx = [...box.querySelectorAll('.iv-q')].indexOf(d), q = BANK.find(x => x.id === id);
      const tmp = document.createElement('div'); tmp.innerHTML = qCard(q, idx); const nd = tmp.firstElementChild; nd.open = true; d.replaceWith(nd);
      nd.querySelector(`[data-mark="${id}:${v}"]`)?.focus();
      toast(mark(id) === 'confident' ? 'Marked as confident.' : mark(id) === 'review' ? 'Saved to review later.' : 'Rating cleared.', mark(id) === 'confident' ? 'check-circle' : 'bookmark');
      renderTabs();
    };
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
  function renderMockSetup() {
    const { bank } = ensureShell();
    const past = bankState().mocks.slice().reverse().slice(0, 5);
    bank.innerHTML = `
<div class="grid g-2 mock-grid">
  <section class="card mock-setup" aria-labelledby="mkH"><div class="card-title"><h2 id="mkH">${icon('timer')} Set up a mock interview</h2></div>
    <p class="muted" style="font-size:14px;margin-bottom:14px">Questions come one at a time, mixed like a real interview. Answer out loud or type, reveal the model answer, then score yourself honestly.</p>
    <div class="field"><span class="label">Topics (none selected = mixed)</span><div class="chip-row">${CATS.map(([id, ic, name]) => `<button type="button" class="chip chip-sm" data-mk="${id}" aria-pressed="${mockCfg.cats.includes(id)}">${icon(ic, 'ic-sm')}${esc(name)}</button>`).join('')}</div></div>
    <div class="field" style="margin-top:14px"><span class="label" id="mkCountL">Number of questions</span><div class="seg" role="group" aria-labelledby="mkCountL">${[4, 6, 8, 10].map(n => `<button type="button" data-mkc="${n}" aria-pressed="${mockCfg.count === n}">${n}</button>`).join('')}</div></div>
    <button class="btn btn-primary btn-lg" type="button" id="mkStart" style="margin-top:18px">${icon('play')}${esc(t('iv.startMock'))}</button>
  </section>
  <section class="card" aria-labelledby="mkPastH"><div class="card-title"><h2 id="mkPastH">${icon('clock')} Recent mock interviews</h2></div>
    ${past.length ? `<div class="stack">${past.map(m => `<div class="test-row" style="cursor:default"><span class="score-pill ${m.score >= 70 ? 'good' : m.score >= 50 ? 'mid' : 'low'}">${m.score}%</span><span class="tr-body"><b>${m.count} questions</b><small>${esc(relDate(m.date))}</small></span></div>`).join('')}</div>` : `<div class="empty"><span class="tile" data-tone="info">${icon('mic')}</span><h3>No mock interviews yet</h3><p>Your self-scores will appear here.</p></div>`}
    <div class="callout callout-tip" style="margin-top:16px">${icon('bulb')}<div><b class="title">Interview tip</b>Structure answers: definition → example from a real project → why it matters. For “how would you test…”, clarify first, then cover risks and categories.</div></div>
  </section>
</div>`;
    bank.querySelectorAll('[data-mk]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.mk; mockCfg.cats = mockCfg.cats.includes(id) ? mockCfg.cats.filter(x => x !== id) : [...mockCfg.cats, id]; b.setAttribute('aria-pressed', String(mockCfg.cats.includes(id))); }));
    bank.querySelectorAll('[data-mkc]').forEach(b => b.addEventListener('click', () => { mockCfg.count = Number(b.dataset.mkc); bank.querySelectorAll('[data-mkc]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
    $id('mkStart').addEventListener('click', () => {
      const pool = BANK.filter(q => !mockCfg.cats.length || mockCfg.cats.includes(q.cat));
      const pick = shuffle(pool.filter(q => q.freq !== 'occasional')).concat(shuffle(pool.filter(q => q.freq === 'occasional'))).slice(0, mockCfg.count);
      mock = { list: shuffle(pick), i: 0, revealed: false, scores: [], start: Date.now(), qStart: Date.now() };
      renderMock();
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
  <div class="runner-head" style="position:static"><div><h1>Mock interview</h1><small class="muted">Question ${mock.i + 1} of ${mock.list.length}</small></div>${barHtml(mock.i / mock.list.length * 100, 'Interview progress')}<span class="timer" id="mkTimer">${icon('clock', 'ic-sm')}<span>0:00</span></span></div>
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
    else { tab = 'bank'; if (parts[0] === 'bank' && parts[1] === 'cat' && CAT[parts[2]]) { f.cat = parts[2]; f.lesson = null; } if (parts[0] === 'bank' && parts[1] === 'lesson' && LESSON_BY_ID.has(parts[2])) { f.lesson = parts[2]; f.cat = 'all'; } }
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
