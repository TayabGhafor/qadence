/* Qadence · Test Center: quick quiz, stage quizzes, timed level exams, custom and weak-topic
   tests, and scenario-based case studies. Results (with every answer) are saved to state.tests.
   Routes: #/tests · /quick · /weak · /stage/<id> · /level/<lvl> · /scenario/<id> · /custom · /run · /result/<id> */
(function () {
  'use strict';
  const esc = s => escapeHtml(s == null ? '' : s);
  const root = $id('tests');
  const PASS = 70;
  let run = null, timer = null;
  const custom = { stages: [], level: 'all', count: 15, timed: false };

  /* ───────────── question picking ───────────── */
  function poolFor({ stages, level }) {
    return QUESTION_POOL.filter(q => (!stages || !stages.length || stages.includes(q.stage)) && (!level || level === 'all' || q.level === level));
  }
  function pick(pool, n) {
    // prefer bank questions (new to the learner), then lesson checks; spread across topics
    const bankQs = shuffle(pool.filter(q => q.src === 'bank')), lessonQs = shuffle(pool.filter(q => q.src !== 'bank'));
    const ordered = [...bankQs, ...lessonQs], out = [], topics = new Map();
    for (const q of ordered) { if (out.length >= n) break; const c = topics.get(q.topic) || 0; if (c < 2) { out.push(q); topics.set(q.topic, c + 1); } }
    for (const q of ordered) { if (out.length >= n) break; if (!out.includes(q)) out.push(q); }
    return shuffle(out);
  }
  const item = (q, shuffleOpts = true) => ({ qid: q.id, q, order: shuffleOpts ? shuffle(q.options.map((_, i) => i)) : q.options.map((_, i) => i), multi: Array.isArray(q.correct) });
  function weakPool() {
    const weak = (QA.weakTopics ? QA.weakTopics() : []).map(w => w.lesson && w.lesson.id).filter(Boolean);
    return QUESTION_POOL.filter(q => weak.includes(q.topic));
  }
  function bestFor(kind, ref) { const list = (state.tests || []).filter(r => r.kind === kind && r.ref === ref); return list.length ? Math.max(...list.map(r => r.score)) : null; }
  const bestBadge = (kind, ref) => { const b = bestFor(kind, ref); return b == null ? '' : `<span class="score-pill ${b >= PASS ? 'good' : b >= 50 ? 'mid' : 'low'} tc-best" title="Best score">${b}%</span>`; };

  function start(cfg) {
    let items = [];
    if (cfg.kind === 'scenario') {
      const sc = SCENARIO_BY_ID.get(cfg.ref); if (!sc) return hub();
      items = sc.questions.map((q, i) => item(Object.assign({ id: `${sc.id}#q${i}`, topic: '' }, q), false));
      run = { kind: 'scenario', ref: sc.id, title: sc.title, scenario: sc, items, limit: null };
    } else {
      let pool, n = cfg.count || 10;
      if (cfg.kind === 'stage') pool = poolFor({ stages: [cfg.ref] });
      else if (cfg.kind === 'level') { pool = poolFor({ level: cfg.ref }); n = 20; }
      else if (cfg.kind === 'weak') pool = weakPool();
      else if (cfg.kind === 'custom') pool = poolFor({ stages: cfg.stages, level: cfg.level });
      else { const lv = state.profile.level || 'beginner'; pool = poolFor({}).filter(q => LEVELS.indexOf(q.level) <= LEVELS.indexOf(lv) + 1); }
      if (!pool.length) { toast('No questions match that selection yet.', 'alert'); return hub(); }
      items = pick(pool, Math.min(n, pool.length)).map(q => item(q));
      const titles = { quick: t('tests.quick'), stage: `${t('acad.moduleTest')}: ${stageName(cfg.ref)}`, level: t('tests.levelExam', { level: t('lvl.' + cfg.ref) }), weak: 'Weak topics test', custom: 'Custom test' };
      run = { kind: cfg.kind, ref: cfg.ref || cfg.kind, title: titles[cfg.kind] || 'Test', items, limit: cfg.kind === 'level' ? 25 * 60 : (cfg.timed ? Math.max(5, Math.round(items.length * 1.25)) * 60 : null) };
    }
    Object.assign(run, { picks: {}, flags: {}, index: 0, started: Date.now(), done: false });
    showScreen('tests', { parts: ['run'], replace: true });
  }

  /* ───────────── hub ───────────── */
  function hub() {
    stopTimer();
    const weak = QA.weakTopics ? QA.weakTopics() : [];
    const history = (state.tests || []).slice().reverse().slice(0, 8);
    const stCount = sg => poolFor({ stages: [sg] }).length;
    root.innerHTML = `
<div class="page-head"><div><span class="eyebrow">${icon('clipboard', 'ic-sm')}${esc(t('nav.groupPractice'))}</span><h1>${esc(t('tests.title'))}</h1><p>${esc(t('tests.sub'))}</p></div><span class="badge badge-gold">${icon('target')}${QUESTION_POOL.length + CONTENT.scenarios.reduce((n, s) => n + s.questions.length, 0)} questions</span></div>
${run && !run.done ? `<div class="callout callout-info" style="margin-bottom:18px">${icon('timer')}<div><b class="title">Test in progress: ${esc(run.title)}</b>${Object.keys(run.picks).length} of ${run.items.length} answered. <button class="link-btn" type="button" data-go="tests/run">${esc(t('common.resume'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div></div>` : ''}
<div class="tc-hero">
  <section class="tc-quick"><span class="eyebrow on-dark-eyebrow">${icon('zap', 'ic-sm')}10 questions · untimed</span><h2>${esc(t('tests.quick'))}</h2><p>A mixed check across the curriculum, matched to your level. Every answer comes with an explanation.</p><div class="row row-wrap"><button class="btn btn-light" type="button" data-go="tests/quick">${icon('play')}${esc(t('tests.start'))}</button>${weak.length ? `<button class="btn btn-glass" type="button" data-go="tests/weak">${icon('target')}Weak topics (${weak.length})</button>` : ''}</div></section>
  <section class="card"><div class="card-title"><h2>${icon('mountain')} ${esc(t('tests.level'))}</h2></div><p class="muted" style="font-size:13.5px;margin-bottom:12px">20 questions · 25-minute timer · pass mark ${PASS}%</p><div class="stack">${LEVELS.map(lv => `<button type="button" class="level-row" data-go="tests/level/${lv}"><span class="tile tile-sm lvl-tile-${lv}">${icon(LEVEL_ICON[lv])}</span><span class="lr-body"><b>${esc(t('tests.levelExam', { level: t('lvl.' + lv) }))}</b><small class="muted">${poolFor({ level: lv }).length} questions in the pool</small></span>${bestFor('level', lv) != null ? `<span class="score-pill ${bestFor('level', lv) >= PASS ? 'good' : 'low'}">${bestFor('level', lv)}%</span>` : icon('chevron-right', 'flip-rtl muted')}</button>`).join('')}</div></section>
</div>
<div class="section-title"><div><h2>${icon('file-search')} ${esc(t('tests.scenario'))}</h2><p>Read a short brief, then answer linked questions.</p></div></div>
<div class="test-cards">${CONTENT.scenarios.map(s => `<button type="button" class="test-card" data-go="tests/scenario/${s.id}">${bestBadge('scenario', s.id)}<span class="tile" data-tone="gold">${icon('file-search')}</span><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><span class="tc-meta">${lvlBadge(s.level)}<span>${icon('list-checks', 'ic-xs')}${s.questions.length}</span><span>${icon('clock', 'ic-xs')}${s.minutes} min</span></span></button>`).join('')}</div>
<div class="section-title"><div><h2>${icon('layers')} ${esc(t('tests.stage'))}</h2><p>10 questions from one stage.</p></div></div>
<div class="test-cards">${STAGE_ORDER.map(sg => `<button type="button" class="test-card" data-go="tests/stage/${sg}" style="${stageStyle(sg)}">${bestBadge('stage', sg)}<span class="tile stage-tile">${icon(STAGE_META[sg].icon)}</span><h3>${esc(stageName(sg))}</h3><span class="tc-meta"><span>${icon('hash', 'ic-xs')}${esc(t('acad.stage', { n: STAGE_META[sg].n }))}</span><span>${icon('list-checks', 'ic-xs')}${stCount(sg)} in pool</span></span></button>`).join('')}</div>
<div class="grid g-2" style="margin-top:28px">
  <section class="card builder" aria-labelledby="bH"><div class="card-title"><h2 id="bH">${icon('sliders')} ${esc(t('tests.custom'))}</h2></div>
    <div class="field"><span class="label">Stages (none selected = all)</span><div class="chip-row">${STAGE_ORDER.map(sg => `<button type="button" class="chip" data-cs="${sg}" aria-pressed="${custom.stages.includes(sg)}">${esc(stageName(sg))}</button>`).join('')}</div></div>
    <div class="field"><span class="label" id="cLvlL">${esc(t('acad.levelFilter'))}</span><div class="seg" role="group" aria-labelledby="cLvlL">${['all', ...LEVELS].map(lv => `<button type="button" data-cl="${lv}" aria-pressed="${custom.level === lv}">${esc(t(lv === 'all' ? 'lvl.all' : 'lvl.' + lv))}</button>`).join('')}</div></div>
    <div class="row row-wrap"><div class="field"><label for="cCount">Questions</label><select class="select" id="cCount" style="width:auto">${[10, 15, 20, 30, 40].map(n => `<option${custom.count === n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="field"><span class="label">${esc(t('tests.timed'))}</span><button type="button" class="switch" role="switch" id="cTimed" aria-checked="${custom.timed}" aria-label="${esc(t('tests.timed'))}"></button></div></div>
    <p class="help" id="cAvail"></p>
    <div><button class="btn btn-primary" type="button" id="cStart">${icon('play')}${esc(t('tests.start'))}</button></div>
  </section>
  <section class="card" aria-labelledby="hH"><div class="card-title"><h2 id="hH">${icon('clock')} ${esc(t('tests.history'))}</h2><button class="link-btn" type="button" data-screen="progress">${esc(t('nav.progress'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
    ${history.length ? `<div class="stack">${history.map(r => `<button type="button" class="test-row" data-go="tests/result/${encodeURIComponent(r.id)}"><span class="score-pill ${r.score >= PASS ? 'good' : r.score >= 50 ? 'mid' : 'low'}">${r.score}%</span><span class="tr-body"><b>${esc(r.title)}</b><small>${esc(relDate(r.date))} · ${r.correct}/${r.total}${r.seconds ? ' · ' + fmtDuration(r.seconds) : ''}</small></span>${icon('chevron-right', 'flip-rtl muted')}</button>`).join('')}</div>` : `<div class="empty"><span class="tile" data-tone="gold">${icon('clipboard')}</span><h3>No tests yet</h3><p>Your results and reviews will appear here.</p></div>`}
  </section>
</div>`;
    const avail = () => { const n = poolFor({ stages: custom.stages, level: custom.level }).length; $id('cAvail').textContent = `${n} questions match. ${n < custom.count ? 'The test will use all of them.' : ''}`; };
    avail();
    root.querySelectorAll('[data-cs]').forEach(b => b.addEventListener('click', () => { const s = b.dataset.cs; custom.stages = custom.stages.includes(s) ? custom.stages.filter(x => x !== s) : [...custom.stages, s]; b.setAttribute('aria-pressed', String(custom.stages.includes(s))); avail(); }));
    root.querySelectorAll('[data-cl]').forEach(b => b.addEventListener('click', () => { custom.level = b.dataset.cl; root.querySelectorAll('[data-cl]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); avail(); }));
    $id('cCount').addEventListener('change', e => { custom.count = Number(e.target.value); avail(); });
    $id('cTimed').addEventListener('click', e => { custom.timed = !custom.timed; e.currentTarget.setAttribute('aria-checked', String(custom.timed)); });
    $id('cStart').addEventListener('click', () => start({ kind: 'custom', ref: 'custom', stages: custom.stages, level: custom.level, count: custom.count, timed: custom.timed }));
  }

  /* ───────────── intro pages (level exam, scenario) ───────────── */
  function intro(kind, ref) {
    stopTimer();
    if (kind === 'scenario') {
      const sc = SCENARIO_BY_ID.get(ref); if (!sc) return hub();
      root.innerHTML = `<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="tests">${esc(t('tests.title'))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(sc.title)}</span></nav>
<section class="stage-hero" style="--st:var(--gold)"><div><span class="eyebrow" style="color:var(--gold-ink)">${icon('file-search', 'ic-sm')}${esc(t('tests.scenario'))}</span><h1>${esc(sc.title)}</h1><p>${esc(sc.summary)}</p>
  <div class="row row-wrap" style="margin-top:14px">${lvlBadge(sc.level)}<span class="badge">${icon('list-checks')}${sc.questions.length} questions</span><span class="badge">${icon('clock')}~${sc.minutes} min</span>${sc.stages.map(s => `<span class="badge badge-outline">${esc(stageName(s))}</span>`).join('')}${bestFor('scenario', sc.id) != null ? `<span class="badge badge-gold">${icon('star')}Best ${bestFor('scenario', sc.id)}%</span>` : ''}</div>
  <div class="row" style="margin-top:18px"><button class="btn btn-primary" type="button" id="goRun">${icon('play')}${esc(t('tests.start'))}</button><button class="btn btn-ghost" type="button" data-go="tests">${esc(t('common.back'))}</button></div></div></section>
<section class="card"><div class="card-title"><h2>${icon('note')} Case brief preview</h2><small class="muted">It stays visible while you answer.</small></div><div class="prose" lang="en">${QA.renderBlocks(sc.brief)}</div></section>`;
      $id('goRun').addEventListener('click', () => start({ kind: 'scenario', ref: sc.id }));
      return;
    }
    if (!LEVELS.includes(ref)) return hub();
    const pool = poolFor({ level: ref });
    root.innerHTML = `<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="tests">${esc(t('tests.title'))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(t('lvl.' + ref))} exam</span></nav>
<section class="stage-hero"><div><span class="eyebrow">${icon(LEVEL_ICON[ref], 'ic-sm')}${esc(t('tests.level'))}</span><h1>${esc(t('lvl.' + ref))} exam</h1><p>20 questions drawn from ${pool.length} ${esc(t('lvl.' + ref).toLowerCase())}-level questions across every stage. You have 25 minutes; the test submits itself when time runs out. Pass mark ${PASS}%.</p>
<ul class="ticks" style="margin-top:14px"><li>Flag questions to come back to them; use the question palette to jump.</li><li>You can change answers until you submit.</li><li>After submitting, review every question with an explanation.</li></ul>
<div class="row" style="margin-top:18px"><button class="btn btn-primary" type="button" id="goRun">${icon('timer')}Start 25-minute exam</button><button class="btn btn-ghost" type="button" data-go="tests">${esc(t('common.back'))}</button></div></div>
<div class="ring" style="--size:120px">${ringSvg(bestFor('level', ref) || 0, 120, 10)}<div class="ring-label"><b>${bestFor('level', ref) != null ? bestFor('level', ref) + '%' : '—'}</b><span>best</span></div></div></section>`;
    $id('goRun').addEventListener('click', () => start({ kind: 'level', ref }));
  }

  /* ───────────── runner ───────────── */
  const elapsed = () => Math.round((Date.now() - run.started) / 1000);
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function tick() {
    const el = $id('runTimer'); if (!run || !el) { stopTimer(); return; }
    if (run.limit) {
      const left = run.limit - elapsed();
      el.querySelector('span').textContent = fmtDuration(Math.max(0, left));
      el.classList.toggle('warn', left <= 60);
      if (left === 60) toast('One minute left.', 'timer');
      if (left <= 0) { stopTimer(); toast('Time is up — your test was submitted.', 'timer'); submit(true); }
    } else el.querySelector('span').textContent = fmtDuration(elapsed());
  }
  function answered(i) { const p = run.picks[i]; return Array.isArray(p) ? p.length > 0 : p != null; }
  function optionsHtml(it, i) {
    const p = run.picks[i];
    return `<div class="opt-list" role="${it.multi ? 'group' : 'radiogroup'}" aria-labelledby="qText">${it.order.map((orig, k) => {
      const checked = it.multi ? (Array.isArray(p) && p.includes(orig)) : p === orig;
      return `<label class="opt"><input type="${it.multi ? 'checkbox' : 'radio'}" name="runq" value="${orig}"${checked ? ' checked' : ''}><span class="mark">${'ABCDE'[k]}</span><span class="opt-text">${rich(it.q.options[orig])}</span></label>`;
    }).join('')}</div>`;
  }
  function renderRun() {
    if (!run || run.done) { hub(); if (!run) toast('No test is in progress.', 'info'); return; }
    const it = run.items[run.index], n = run.items.length, i = run.index;
    const answeredCount = run.items.filter((_, k) => answered(k)).length;
    const sc = run.scenario;
    root.innerHTML = `
<div class="runner-head"><div><h1>${esc(run.title)}</h1><small class="muted">${esc(t('tests.question', { a: i + 1, b: n }))} · ${esc(t('tests.answered', { a: answeredCount, b: n }))}</small></div>
  ${barHtml(answeredCount / n * 100, 'Answered')}
  <div class="row"><span class="timer" id="runTimer" aria-label="${run.limit ? esc(t('tests.timeLeft')) : 'Time elapsed'}">${icon(run.limit ? 'timer' : 'clock', 'ic-sm')}<span>${run.limit ? fmtDuration(Math.max(0, run.limit - elapsed())) : fmtDuration(elapsed())}</span></span><button class="btn btn-primary btn-sm" type="button" id="runSubmit">${icon('send')}${esc(t('tests.submit'))}</button></div></div>
<div class="runner ${sc ? 'has-brief' : ''}">
  ${sc ? `<aside class="brief-panel" aria-label="Case brief"><h2>${icon('note')} Case brief</h2><div class="prose" lang="en">${QA.renderBlocks(sc.brief)}</div></aside>` : ''}
  <div>
    <section class="q-card" aria-labelledby="qText" lang="en">
      <div class="q-top"><span class="badge badge-brand">${esc(t('tests.question', { a: i + 1, b: n }))}</span>${it.q.level ? lvlBadge(it.q.level) : ''}${it.multi ? `<span class="badge badge-accent">${icon('list-checks')}${esc(t('tests.selectAll'))}</span>` : ''}${it.q.topic && LESSON_BY_ID.get(it.q.topic) ? `<span class="badge badge-outline">${esc(LESSON_BY_ID.get(it.q.topic).title)}</span>` : ''}</div>
      <h2 id="qText">${esc(it.q.q)}</h2>
      ${optionsHtml(it, i)}
      <div class="q-nav"><button class="btn btn-secondary" type="button" id="runPrev"${i === 0 ? ' disabled' : ''}>${icon('arrow-left', 'flip-rtl')}${esc(t('common.previous'))}</button><button class="btn btn-ghost" type="button" id="runFlag" aria-pressed="${!!run.flags[i]}">${icon('flag')}${esc(run.flags[i] ? t('tests.flagged') : t('tests.flag'))}</button>${i < n - 1 ? `<button class="btn btn-primary" type="button" id="runNext">${esc(t('common.next'))}${icon('arrow-right', 'flip-rtl')}</button>` : `<button class="btn btn-primary" type="button" id="runSubmit2">${icon('send')}${esc(t('tests.submit'))}</button>`}</div>
    </section>
    <section class="card" style="margin-top:16px" aria-label="Question palette"><div class="card-title"><h3 style="font-size:14px">Questions</h3><small class="muted">${icon('flag', 'ic-xs')} flagged · filled = answered</small></div><div class="palette">${run.items.map((_, k) => `<button type="button" data-jump="${k}" class="${answered(k) ? 'answered' : ''} ${k === i ? 'current' : ''} ${run.flags[k] ? 'flagged' : ''}" aria-label="Question ${k + 1}${answered(k) ? ', answered' : ''}${run.flags[k] ? ', flagged' : ''}"${k === i ? ' aria-current="step"' : ''}>${k + 1}</button>`).join('')}</div></section>
  </div>
</div>`;
    root.querySelector('.opt-list').addEventListener('change', () => {
      const inputs = [...root.querySelectorAll('input[name="runq"]')];
      if (it.multi) run.picks[i] = inputs.filter(x => x.checked).map(x => Number(x.value)).sort((a, b) => a - b);
      else { const c = inputs.find(x => x.checked); run.picks[i] = c ? Number(c.value) : null; }
      root.querySelectorAll('.palette button')[i].classList.toggle('answered', answered(i));
      const cnt = run.items.filter((_, k) => answered(k)).length;
      root.querySelector('.runner-head small').textContent = `${t('tests.question', { a: i + 1, b: n })} · ${t('tests.answered', { a: cnt, b: n })}`;
      const bar = root.querySelector('.runner-head .bar'); if (bar) { bar.querySelector('i').style.width = (cnt / n * 100) + '%'; bar.setAttribute('aria-valuenow', Math.round(cnt / n * 100)); }
    });
    const go = k => { run.index = Math.max(0, Math.min(n - 1, k)); renderRun(); root.querySelector('#qText')?.setAttribute('tabindex', '-1'); root.querySelector('#qText')?.focus({ preventScroll: false }); };
    $id('runPrev')?.addEventListener('click', () => go(i - 1));
    $id('runNext')?.addEventListener('click', () => go(i + 1));
    $id('runFlag').addEventListener('click', () => { run.flags[i] = !run.flags[i]; renderRun(); $id('runFlag')?.focus(); });
    root.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.jump))));
    [$id('runSubmit'), $id('runSubmit2')].forEach(b => b && b.addEventListener('click', () => submit(false)));
    stopTimer(); timer = setInterval(tick, 1000);
  }
  function isCorrect(it, p) {
    if (it.multi) { const want = it.q.correct.slice().sort((a, b) => a - b); return Array.isArray(p) && p.length === want.length && p.every((v, k) => v === want[k]); }
    return p === it.q.correct;
  }
  async function submit(forced) {
    if (!run || run.done) return;
    const unanswered = run.items.filter((_, k) => !answered(k)).length;
    if (!forced && unanswered) {
      const v = await dialog({ title: `Submit with ${unanswered} unanswered?`, body: `<p>Unanswered questions count as incorrect. You can go back and answer them first.</p>`, actions: [{ label: 'Keep answering', value: 'cancel', kind: 'quiet' }, { label: 'Submit anyway', value: 'submit', kind: 'primary' }] });
      if (v !== 'submit') return;
    }
    stopTimer();
    const answers = run.items.map((it, k) => ({ qid: it.qid, pick: run.picks[k] == null ? null : run.picks[k], correct: isCorrect(it, run.picks[k]), topic: it.q.topic || '' }));
    const correct = answers.filter(a => a.correct).length, total = answers.length;
    const rec = { id: 't' + Date.now().toString(36), kind: run.kind, ref: run.ref, title: run.title, date: new Date().toISOString(), total, correct, score: total ? Math.round(correct / total * 100) : 0, seconds: Math.min(elapsed(), run.limit || Infinity), answers };
    state.tests.push(rec);
    if (state.tests.length > 300) state.tests.splice(0, state.tests.length - 300);
    run.done = true;
    markActive();
    const ok = save();
    if (!ok) toast('Result shown but not saved — browser storage is unavailable.', 'alert');
    run = null;
    showScreen('tests', { parts: ['result', rec.id], replace: true });
    if (rec.score >= PASS && total >= 5) QA.celebrate(`${rec.score}% — ${t('tests.passed')}!`);
  }

  /* ───────────── result & review ───────────── */
  function qFor(a) {
    if (QUESTION_BY_ID.has(a.qid)) return { q: QUESTION_BY_ID.get(a.qid), multi: false };
    const [scId, qi] = a.qid.split('#q'); const sc = SCENARIO_BY_ID.get(scId);
    const q = sc && sc.questions[Number(qi)];
    return q ? { q, multi: Array.isArray(q.correct), scenario: sc } : null;
  }
  function reviewItem(a, k) {
    const f = qFor(a); if (!f) return '';
    const q = f.q, picks = a.pick == null ? [] : (Array.isArray(a.pick) ? a.pick : [a.pick]), want = Array.isArray(q.correct) ? q.correct : [q.correct];
    return `<article class="review-item ${a.correct ? 'ok' : 'bad'}" data-ok="${a.correct}" lang="en">
      <div class="row row-wrap" style="margin-bottom:8px"><span class="badge ${a.correct ? 'badge-success' : 'badge-danger'}">${icon(a.correct ? 'check' : 'x')}${esc(a.correct ? t('common.correct') : (picks.length ? t('common.incorrect') : 'Not answered'))}</span><span class="muted" style="font-size:12.5px;font-weight:650">Q${k + 1}</span>${q.topic && LESSON_BY_ID.get(q.topic) ? `<button class="link-btn" type="button" data-go="academy/lesson/${q.topic}">${icon('book', 'ic-sm')}${esc(LESSON_BY_ID.get(q.topic).title)}</button>` : ''}</div>
      <h3>${esc(q.q)}</h3>
      <div class="opt-list">${q.options.map((o, i) => {
        const isWant = want.includes(i), isPick = picks.includes(i);
        const cls = isWant ? 'is-correct' : isPick ? 'is-wrong' : '';
        const why = (isWant || isPick) ? `<span class="why">${rich(q.why[i])}</span>` : '';
        return `<div class="opt ${cls}" style="cursor:default"><span class="mark">${'ABCDE'[i]}</span><span class="opt-text">${rich(o)}${isPick ? ` <span class="badge badge-outline" style="height:20px">Your answer</span>` : ''}${why}</span></div>`;
      }).join('')}</div>
    </article>`;
  }
  function result(id) {
    stopTimer();
    const rec = (state.tests || []).find(r => r.id === id);
    if (!rec) { hub(); toast('That result was not found.', 'info'); return; }
    const pass = rec.score >= PASS;
    const topics = {};
    rec.answers.forEach(a => { if (!a.topic || !LESSON_BY_ID.has(a.topic)) return; const x = topics[a.topic] || (topics[a.topic] = { right: 0, total: 0 }); x.total++; if (a.correct) x.right++; });
    const topicRows = Object.entries(topics).sort((a, b) => a[1].right / a[1].total - b[1].right / b[1].total);
    const sc = rec.kind === 'scenario' ? SCENARIO_BY_ID.get(rec.ref) : null;
    const retakeGo = rec.kind === 'scenario' ? `tests/scenario/${rec.ref}` : rec.kind === 'level' ? `tests/level/${rec.ref}` : rec.kind === 'stage' ? `tests/stage/${rec.ref}` : rec.kind === 'weak' ? 'tests/weak' : rec.kind === 'custom' ? 'tests' : 'tests/quick';
    root.innerHTML = `
<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="tests">${esc(t('tests.title'))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(t('tests.result'))}</span></nav>
<section class="result-hero ${pass ? '' : 'fail'}">
  <div class="ring" style="--size:140px">${ringSvg(rec.score, 140, 12)}<div class="ring-label"><b>${rec.score}%</b><span>${rec.correct}/${rec.total}</span></div></div>
  <div><span class="eyebrow">${icon(pass ? 'award' : 'trending', 'ic-sm')}${esc(pass ? t('tests.passed') : t('tests.failed'))}</span><h1>${esc(rec.title)}</h1><p class="muted">${esc(new Date(rec.date).toLocaleString())} · ${esc(t('tests.passMark', { n: PASS }))}</p>
    <div class="result-stats"><div><b class="tnum">${rec.correct}</b><span>${esc(t('common.correct'))}</span></div><div><b class="tnum">${rec.total - rec.correct}</b><span>To review</span></div><div><b class="tnum">${rec.seconds ? fmtDuration(rec.seconds) : '—'}</b><span>Time</span></div></div></div>
  <div class="stack"><button class="btn btn-primary" type="button" data-go="${retakeGo}">${icon('rotate')}${esc(t('tests.retake'))}</button><button class="btn btn-secondary" type="button" data-go="tests">${icon('clipboard')}${esc(t('tests.newTest'))}</button></div>
</section>
${topicRows.length ? `<section class="card" style="margin-bottom:18px"><div class="card-title"><h2>${icon('bars')} ${esc(t('tests.byTopic'))}</h2><small class="muted">Weakest first — open a lesson to revise</small></div><div class="topic-rows">${topicRows.map(([tid, x]) => { const p = Math.round(x.right / x.total * 100); return `<div class="topic-row"><button class="link-btn" type="button" data-go="academy/lesson/${tid}" style="justify-self:start;text-align:start">${esc(LESSON_BY_ID.get(tid).title)}</button>${barHtml(p, LESSON_BY_ID.get(tid).title, 'bar-sm')}<span class="score-pill ${p >= PASS ? 'good' : p >= 50 ? 'mid' : 'low'}">${x.right}/${x.total}</span></div>`; }).join('')}</div></section>` : ''}
${sc ? `<details class="acc" style="margin-bottom:18px"><summary>${icon('note')}<span>Case brief: ${esc(sc.title)}</span>${icon('chevron-down', 'chev')}</summary><div class="acc-body prose" lang="en">${QA.renderBlocks(sc.brief)}</div></details>` : ''}
<div class="section-title" style="margin-top:8px"><div><h2>${esc(t('tests.reviewAnswers'))}</h2><p>Every option you chose — and the right one — is explained.</p></div><div class="seg review-filter" role="group" aria-label="Filter review"><button type="button" data-rf="all" aria-pressed="true">${esc(t('common.all'))} (${rec.total})</button><button type="button" data-rf="bad" aria-pressed="false">To review (${rec.total - rec.correct})</button><button type="button" data-rf="ok" aria-pressed="false">${esc(t('common.correct'))} (${rec.correct})</button></div></div>
<div class="stack" id="reviewList">${rec.answers.map(reviewItem).join('')}</div>`;
    root.querySelectorAll('[data-rf]').forEach(b => b.addEventListener('click', () => {
      root.querySelectorAll('[data-rf]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      root.querySelectorAll('.review-item').forEach(r => { r.hidden = b.dataset.rf !== 'all' && r.dataset.ok !== String(b.dataset.rf === 'ok'); });
    }));
  }

  /* ───────────── routing ───────────── */
  QA.onLeave.tests = () => stopTimer();
  QA.views.tests = parts => {
    const [kind, ref] = parts || [];
    if (kind === 'run') return renderRun();
    if (kind === 'result') return result(ref);
    if (kind === 'quick' || kind === 'weak') return start({ kind });
    if (kind === 'stage' && STAGE_ORDER.includes(ref)) return start({ kind: 'stage', ref });
    if (kind === 'level' || kind === 'scenario') return intro(kind, ref);
    hub();
  };
  window.QadenceTests = { start, get run() { return run; } };
})();
