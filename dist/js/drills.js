/* Qadence · Practice drills: classify, order, spot and fill. Every interaction has a
   button/keyboard path (no drag-only actions). Best scores live in state.drills.
   Routes: #/drills · #/drills/<id> */
(function () {
  'use strict';
  const esc = s => escapeHtml(s == null ? '' : s);
  const root = $id('drills');
  const TYPE_ICON = { classify: 'layers', order: 'list', spot: 'search', fill: 'edit' };
  const TYPE_TONE = { classify: 'info', order: 'violet', spot: 'accent', fill: 'gold' };
  const hubFilter = { type: 'all', stage: 'all' };
  let cur = null;   // { d, answer state, checked }

  function hub() {
    const list = CONTENT.drills.filter(d => (hubFilter.type === 'all' || d.type === hubFilter.type) && (hubFilter.stage === 'all' || d.stage === hubFilter.stage));
    const solved = Object.values(state.drills).filter(x => x.best === 100).length;
    root.innerHTML = `
<div class="page-head"><div><span class="eyebrow">${icon('puzzle', 'ic-sm')}${esc(t('nav.groupPractice'))}</span><h1>${esc(t('drills.title'))}</h1><p>${esc(t('drills.sub'))}</p></div><span class="badge badge-violet">${icon('check-circle')}${solved}/${CONTENT.drills.length} solved</span></div>
<div class="filterbar">
  <div class="seg" role="group" aria-label="Drill type">${['all', 'classify', 'order', 'spot', 'fill'].map(ty => `<button type="button" data-ty="${ty}" aria-pressed="${hubFilter.type === ty}">${ty === 'all' ? icon('grid', 'ic-sm') : icon(TYPE_ICON[ty], 'ic-sm')}${esc(ty === 'all' ? t('common.all') : t('drills.' + ty))}</button>`).join('')}</div>
  <label class="sr-only" for="drStage">Stage</label><select class="select" id="drStage" style="width:auto"><option value="all">All stages</option>${STAGE_ORDER.map(sg => `<option value="${sg}"${hubFilter.stage === sg ? ' selected' : ''}>${esc(stageName(sg))}</option>`).join('')}</select>
</div>
${list.length ? `<div class="test-cards">${list.map(d => { const r = state.drills[d.id]; return `<button type="button" class="test-card drill-card" data-go="drills/${d.id}" style="${stageStyle(d.stage)}">${r ? `<span class="score-pill ${r.best === 100 ? 'good' : r.best >= 60 ? 'mid' : 'low'} tc-best">${r.best}%</span>` : ''}<span class="tile" data-tone="${TYPE_TONE[d.type]}">${icon(TYPE_ICON[d.type])}</span><h3>${esc(d.title)}</h3><p>${esc(d.prompt)}</p><span class="tc-meta"><span>${esc(t('drills.' + d.type))}</span>${lvlBadge(d.level)}<span>${esc(stageName(d.stage))}</span></span></button>`; }).join('')}</div>` : `<div class="empty card">${icon('puzzle', 'ic-xl')}<h3>No drills match</h3></div>`}`;
    root.querySelectorAll('[data-ty]').forEach(b => b.addEventListener('click', () => { hubFilter.type = b.dataset.ty; hub(); }));
    $id('drStage').addEventListener('change', e => { hubFilter.stage = e.target.value; hub(); });
  }

  /* ───────────── drill page ───────────── */
  function initAnswer(d) {
    if (d.type === 'classify') return d.items.map(() => null);
    if (d.type === 'order') { let o = shuffle(d.items.map((_, i) => i)); if (o.every((v, i) => v === i) && o.length > 1) o = o.slice(1).concat(o[0]); return o; }
    if (d.type === 'spot') return d.lines.map(() => false);
    if (d.type === 'fill') return d.fields.map(() => '');
    return null;
  }
  function open(id) {
    const d = DRILL_BY_ID.get(id);
    if (!d) { hub(); toast('That drill was not found.', 'info'); return; }
    if (!cur || cur.d.id !== id) cur = { d, ans: initAnswer(d), checked: false, order: d.type === 'spot' ? shuffle(d.lines.map((_, i) => i)) : null };
    render();
  }
  const norm = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  function grade() {
    const { d, ans } = cur;
    if (d.type === 'classify') return d.items.map((it, i) => ans[i] === it.cat);
    if (d.type === 'order') return ans.map((orig, pos) => orig === pos);
    if (d.type === 'spot') return d.lines.map((ln, i) => ans[i] === ln.flaw);
    if (d.type === 'fill') return d.fields.map((f, i) => f.accept.some(a => norm(a) === norm(ans[i])));
    return [];
  }
  function body() {
    const { d, ans, checked } = cur, res = checked ? grade() : null;
    if (d.type === 'classify') return d.items.map((it, i) => `<div class="cls-item ${res ? (res[i] ? 'ok' : 'bad') : ''}"><span>${esc(it.text)}</span><div class="seg" role="radiogroup" aria-label="${esc(it.text)}">${d.categories.map((c, k) => `<button type="button" role="radio" data-cls="${i}:${k}" aria-checked="${ans[i] === k}" aria-pressed="${ans[i] === k}"${checked ? ' disabled' : ''}>${esc(c)}</button>`).join('')}</div>${res ? `<span class="why">${icon(res[i] ? 'check-circle' : 'x-circle', 'ic-sm')} <b>${esc(d.categories[it.cat])}.</b> ${rich(it.why)}</span>` : ''}</div>`).join('');
    if (d.type === 'order') return `<ol class="order-list">${ans.map((orig, pos) => `<li class="order-item ${res ? (res[pos] ? 'ok' : 'bad') : ''}"><span class="pos">${pos + 1}</span><span class="txt">${esc(d.items[orig])}${res && !res[pos] ? ` <small class="muted">(belongs at ${orig + 1})</small>` : ''}</span>${checked ? '' : `<span class="moves"><button class="icon-btn bordered" type="button" data-mv="${pos}:-1" aria-label="${esc(t('drills.moveUp'))}: ${esc(d.items[orig])}"${pos === 0 ? ' disabled' : ''}>${icon('chevron-up')}</button><button class="icon-btn bordered" type="button" data-mv="${pos}:1" aria-label="${esc(t('drills.moveDown'))}: ${esc(d.items[orig])}"${pos === ans.length - 1 ? ' disabled' : ''}>${icon('chevron-down')}</button></span>`}</li>`).join('')}</ol>${res ? `<div class="callout callout-info" style="margin-top:14px">${icon('info')}<div>${rich(d.explain)}</div></div>` : ''}`;
    if (d.type === 'spot') return `<div class="spot-list">${cur.order.map(i => { const ln = d.lines[i]; return `<button type="button" class="spot-line ${res ? (res[i] ? 'ok' : 'bad') : ''}" data-spot="${i}" aria-pressed="${ans[i]}"${checked ? ' disabled' : ''}><span class="box">${ans[i] ? icon('check', 'ic-xs') : ''}</span><span>${esc(ln.text)}</span>${res ? `<span class="why">${icon(ln.flaw ? 'alert' : 'check-circle', 'ic-sm')} <b>${ln.flaw ? 'Flawed' : 'Fine'}.</b> ${rich(ln.why)}</span>` : ''}</button>`; }).join('')}</div>`;
    if (d.type === 'fill') return `<div class="fill-grid">${d.fields.map((f, i) => `<div class="fill-row ${res ? (res[i] ? 'ok' : 'bad') : ''}"><label for="fill-${i}">${esc(f.label)}</label><input class="input" id="fill-${i}" data-fill="${i}" value="${esc(ans[i])}" autocomplete="off" spellcheck="false"${checked ? ' readonly' : ''}>${res ? `<span class="why">${icon(res[i] ? 'check-circle' : 'x-circle', 'ic-sm')} ${res[i] ? '' : `Accepted: <b>${esc(f.accept[0])}</b>. `}${rich(f.why)}</span>` : ''}</div>`).join('')}</div>`;
    return '';
  }
  function render() {
    const { d, checked } = cur, rec = state.drills[d.id];
    const list = CONTENT.drills, idx = list.indexOf(d), next = list[idx + 1];
    const res = checked ? grade() : null, score = res ? Math.round(res.filter(Boolean).length / res.length * 100) : null;
    root.innerHTML = `
<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="drills">${esc(t('drills.title'))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(d.title)}</span></nav>
<div class="page-head"><div><div class="row row-wrap"><span class="badge" style="background:var(--${TYPE_TONE[d.type]}-soft)">${icon(TYPE_ICON[d.type])}${esc(t('drills.' + d.type))}</span>${lvlBadge(d.level)}<span class="badge badge-outline">${esc(stageName(d.stage))}</span>${rec ? `<span class="badge badge-gold">${icon('star')}${esc(t('drills.best', { n: rec.best }))}</span>` : ''}</div><h1>${esc(d.title)}</h1></div></div>
<section class="drill-stage" lang="en" aria-labelledby="drPrompt">
  <p class="drill-prompt" id="drPrompt">${esc(d.prompt)}</p>
  ${d.type === 'spot' ? `<p class="help" style="margin:-8px 0 14px">Select every line you think is flawed, then check.</p>` : d.type === 'order' ? `<p class="help" style="margin:-8px 0 14px">Use the arrows to move each step. Keyboard: Tab to a button, Enter to move.</p>` : ''}
  <div id="drBody">${body()}</div>
  <div class="drill-result" id="drResult" role="status" aria-live="polite">
    ${checked ? `<span class="score-pill ${score === 100 ? 'good' : score >= 60 ? 'mid' : 'low'}">${score}%</span><b>${score === 100 ? 'Perfect — every answer right!' : `${res.filter(Boolean).length} of ${res.length} right. Read the explanations, then try again.`}</b><span class="row" style="margin-inline-start:auto"><button class="btn btn-secondary btn-sm" type="button" id="drRetry">${icon('rotate')}${esc(t('common.retry'))}</button>${next ? `<button class="btn btn-primary btn-sm" type="button" data-go="drills/${next.id}">${esc(t('common.next'))}${icon('arrow-right', 'flip-rtl')}</button>` : ''}</span>`
      : `<button class="btn btn-primary" type="button" id="drCheck">${icon('check-circle')}${esc(t('drills.checkAnswers'))}</button><span class="help" id="drHint"></span>`}
  </div>
</section>`;
    bind();
  }
  function bind() {
    const box = $id('drBody');
    box.addEventListener('click', e => {
      const c = e.target.closest('[data-cls]'), m = e.target.closest('[data-mv]'), s = e.target.closest('[data-spot]');
      if (c) { const [i, k] = c.dataset.cls.split(':').map(Number); cur.ans[i] = k; c.parentElement.querySelectorAll('button').forEach(b => { const on = b === c; b.setAttribute('aria-checked', String(on)); b.setAttribute('aria-pressed', String(on)); }); }
      if (m) {
        const [pos, dir] = m.dataset.mv.split(':').map(Number), to = pos + dir;
        if (to < 0 || to >= cur.ans.length) return;
        [cur.ans[pos], cur.ans[to]] = [cur.ans[to], cur.ans[pos]];
        box.innerHTML = body();
        const target = box.querySelector(`[data-mv="${to}:${dir}"]`) || box.querySelector(`[data-mv="${to}:${-dir}"]`); target?.focus();
      }
      if (s) { const i = Number(s.dataset.spot); cur.ans[i] = !cur.ans[i]; s.setAttribute('aria-pressed', String(cur.ans[i])); s.querySelector('.box').innerHTML = cur.ans[i] ? icon('check', 'ic-xs') : ''; }
    });
    box.addEventListener('input', e => { const f = e.target.closest('[data-fill]'); if (f) cur.ans[Number(f.dataset.fill)] = f.value; });
    $id('drCheck')?.addEventListener('click', () => {
      const d = cur.d;
      const missing = d.type === 'classify' ? cur.ans.filter(v => v == null).length : d.type === 'fill' ? cur.ans.filter(v => !String(v).trim()).length : 0;
      if (missing) { $id('drHint').textContent = `${missing} still empty — answer everything first.`; return; }
      if (d.type === 'spot' && !cur.ans.some(Boolean)) { $id('drHint').textContent = 'Select at least one flawed line first.'; return; }
      cur.checked = true;
      const res = grade(), score = Math.round(res.filter(Boolean).length / res.length * 100);
      const prev = state.drills[d.id];
      state.drills[d.id] = { best: Math.max(score, prev ? prev.best : 0), attempts: (prev ? prev.attempts : 0) + 1, last: new Date().toISOString() };
      markActive(); save();
      render();
      $id('drResult')?.querySelector('button')?.focus();
      if (score === 100) QA.celebrate(prev && prev.best === 100 ? 'Perfect again!' : 'Drill solved! +15 XP');
    });
    $id('drRetry')?.addEventListener('click', () => { cur = { d: cur.d, ans: initAnswer(cur.d), checked: false, order: cur.d.type === 'spot' ? shuffle(cur.d.lines.map((_, i) => i)) : null }; render(); $id('drBody').querySelector('button, input')?.focus(); });
  }

  QA.views.drills = parts => { const [id] = parts || []; if (id) open(id); else { cur = null; hub(); } };
  window.QadenceDrills = { open };
})();
