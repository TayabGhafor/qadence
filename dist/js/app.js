/* Qadence · app shell: boot, navigation, menus, search, dashboard, profile and progress.
   Loads last. Uses core.js helpers and the ported engine globals (state, save, session…). */
(function () {
  'use strict';
  const esc = s => escapeHtml(s == null ? '' : s);
  const shell = $id('appShell');

  /* ───────────── chrome: sidebar level card, streak/xp chips, avatar ───────────── */
  function profileName() { return (state.profile && state.profile.name) || (Profiles.active() && Profiles.active().name) || 'Learner'; }
  function profileColor() { return (state.profile && state.profile.color) || (Profiles.active() && Profiles.active().color) || AVATAR_COLORS[0]; }
  function avatarHtml(cls) { return `<span class="avatar ${cls || ''}" style="--av-bg:${profileColor()}">${esc(initials(profileName()))}</span>`; }
  let lastLevel = null;
  function refreshChrome() {
    if (typeof state === 'undefined') return;
    const st = computeStats();
    const lv = st.level;
    const card = $id('sidebarLevel');
    if (card) card.innerHTML = `<div class="row"><div><small>${esc(t('common.level', { n: lv.n }))}</small><b>${esc(lv.title)}</b></div><span class="badge" style="background:rgba(255,255,255,.1);color:#FCD34D">${icon('zap')}${lv.xp} XP</span></div>${barHtml(lv.pct, `${lv.into} of ${lv.span} XP to level ${lv.n + 1}`, 'bar-sm')}<div class="row" style="margin-top:8px"><small>${lv.into}/${lv.span} XP</small><small>${icon('flame', 'ic-xs')} ${st.streak}</small></div>`;
    const sc = $id('streakChip'); if (sc) { sc.querySelector('b').textContent = st.streak; sc.title = `${st.streak}-day streak`; }
    const xc = $id('xpChip'); if (xc) { xc.querySelector('b').textContent = st.xp; xc.title = `${st.xp} XP · level ${lv.n}`; }
    const name = profileName(), color = profileColor();
    [$id('topAvatar'), $id('popAvatar')].forEach(a => { if (a) { a.textContent = initials(name); a.style.setProperty('--av-bg', color); } });
    const an = $id('accountName'); if (an) an.textContent = name;
    const sub = $id('accountSub'); if (sub) sub.textContent = `${t('common.level', { n: lv.n })} · ${lv.title}`;
    if (lastLevel !== null && lv.n > lastLevel) celebrate(`Level ${lv.n} reached — ${lv.title}!`);
    lastLevel = lv.n;
  }
  QA.refreshChrome = refreshChrome;

  function celebrate(msg) {
    toast(msg, 'sparkles');
    if (!motionOK()) return;
    const burst = document.createElement('div'); burst.className = 'confetti'; burst.setAttribute('aria-hidden', 'true');
    const colors = ['#14B8A6', '#FBBF24', '#F97316', '#818CF8', '#34D399', '#F472B6'];
    for (let i = 0; i < 36; i++) { const p = document.createElement('i'); p.style.setProperty('--x', (Math.random() * 2 - 1).toFixed(2)); p.style.setProperty('--d', (0.6 + Math.random() * 0.9).toFixed(2) + 's'); p.style.setProperty('--r', Math.round(Math.random() * 720) + 'deg'); p.style.background = colors[i % colors.length]; p.style.left = (35 + Math.random() * 30) + '%'; burst.appendChild(p); }
    document.body.appendChild(burst); setTimeout(() => burst.remove(), 1800);
  }
  QA.celebrate = celebrate;

  /* ───────────── navigation events ───────────── */
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-screen]');
    if (nav && shell.contains(nav) && !nav.closest('[data-legacy-nav]')) {
      e.preventDefault();
      closePops();
      const id = nav.dataset.screen, parts = nav.dataset.parts ? nav.dataset.parts.split('/') : [];
      showScreen(id, { parts });
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go && shell.contains(go)) { e.preventDefault(); const [id, ...parts] = go.dataset.go.split('/'); showScreen(id, { parts }); return; }
    if (e.target.closest('[data-open-drawer]')) { shell.classList.add('drawer-open'); document.querySelectorAll('[data-open-drawer]').forEach(b => b.setAttribute('aria-expanded', 'true')); $id('sidebar').querySelector('.nav-item')?.focus(); return; }
    if (e.target.closest('[data-close-drawer]')) { closeDrawer(); return; }
    if (e.target.closest('[data-back-landing]')) { e.preventDefault(); openLanding(); return; }
    if (!e.target.closest('.menu-pop')) closePops();
  });
  window.addEventListener('popstate', () => { if (!shell.hidden) { const [id, ...parts] = currentPathFromHash(); showScreen(id, { parts, fromHash: true }); } });
  window.addEventListener('hashchange', () => {
    if (shell.hidden) return;
    const [id, ...parts] = currentPathFromHash();
    if (id !== QA.current || parts.join('/') !== QA.parts.join('/')) showScreen(id, { parts, fromHash: true });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePops(); closeDrawer(); hideSearch(); }
    if (e.key === '/' && !shell.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); const s = $id('searchInput'); $id('globalSearch').classList.add('open'); s.focus(); }
  });

  /* ───────────── menus: language, theme, account ───────────── */
  function closePops() {
    document.querySelectorAll('.menu-pop .pop').forEach(p => { p.hidden = true; });
    document.querySelectorAll('.menu-pop [aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  function openPop(btn, pop) { const open = pop.hidden; closePops(); pop.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) pop.querySelector('button')?.focus(); }
  document.querySelectorAll('[data-lang-menu]').forEach(menu => {
    const btn = menu.querySelector('[data-lang-toggle]');
    const pop = document.createElement('div'); pop.className = 'pop lang-pop'; pop.hidden = true;
    menu.appendChild(pop);
    const fill = () => {
      pop.innerHTML = `<div class="pop-head"><span class="tile">${icon('translate')}</span><div><b>${esc(t('prof.language'))}</b><small lang="en">Lessons stay in English.</small></div></div>
        <div class="lang-options" role="menu" aria-label="${esc(t('prof.language'))}">
          ${QA_I18N.langs.map(l => `<button class="pop-item" type="button" role="menuitemradio" aria-checked="${l.code === QA_I18N.lang}" data-set-lang="${l.code}"><span lang="${l.code}" dir="auto">${esc(l.native)}</span><span class="native" lang="en" dir="ltr">${l.name === l.native ? '' : esc(l.name)}</span><span class="lang-check">${icon('check', 'ic-sm')}</span></button>`).join('')}
        </div>`;
    };
    fill();
    btn.addEventListener('click', e => { e.stopPropagation(); fill(); openPop(btn, pop); });
    pop.addEventListener('click', e => { const b = e.target.closest('[data-set-lang]'); if (!b) return; QA_I18N.set(b.dataset.setLang); closePops(); btn.focus(); });
    pop.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); closePops(); btn.focus(); return; }
      const items = [...pop.querySelectorAll('[data-set-lang]')], index = items.indexOf(e.target);
      const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[e.key];
      if (index < 0 || next === undefined) return;
      e.preventDefault();
      items[(next + items.length) % items.length].focus();
    });
  });
  document.addEventListener('qa:lang', () => {
    if (!shell.hidden) { refreshChrome(); showScreen(QA.current, { parts: QA.parts, replace: true, keepScroll: true, noFocus: true }); }
    renderLandingLevels();
    const lang = QA_I18N.lang;
    if (typeof state !== 'undefined' && state.academy && lang !== 'en' && !state.academy.langs.includes(lang)) { state.academy.langs.push(lang); save(); }
    toast(`${QA_I18N.info().native} · ${t('common.saved')}`, 'translate');
  });
  $id('themeToggle')?.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(dark ? 'light' : 'dark');
  });
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(Prefs.get().theme)); } catch {}
  $id('accountBtn')?.addEventListener('click', e => { e.stopPropagation(); openPop($id('accountBtn'), $id('accountPop')); });
  $id('togglePw')?.addEventListener('click', () => {
    const pw = $id('authPassword'), b = $id('togglePw'), show = pw.type === 'password';
    pw.type = show ? 'text' : 'password'; b.setAttribute('aria-pressed', String(show)); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    b.querySelector('use').setAttribute('href', show ? '#i-eye-off' : '#i-eye');
  });

  /* ───────────── global search ───────────── */
  const searchIndex = () => [
    ...LESSONS.map(l => ({ kind: 'lesson', id: l.id, title: l.title, sub: `${stageName(l.stage)} · ${t('lvl.' + l.level)}`, text: [l.title, l.summary, ...(l.keyTerms || []).map(k => k.term)].join(' ').toLowerCase(), icon: STAGE_META[l.stage].icon, go: ['academy', 'lesson', l.id] })),
    ...CONTENT.drills.map(d => ({ kind: 'drill', id: d.id, title: d.title, sub: `${t('nav.drills')} · ${stageName(d.stage)}`, text: (d.title + ' ' + d.prompt).toLowerCase(), icon: 'puzzle', go: ['drills', d.id] })),
    ...CONTENT.scenarios.map(s => ({ kind: 'scenario', id: s.id, title: s.title, sub: `${t('tests.scenario')} · ${t('lvl.' + s.level)}`, text: (s.title + ' ' + s.summary).toLowerCase(), icon: 'file-search', go: ['tests', 'scenario', s.id] }))
  ];
  let idx = null, sel = -1, results = [];
  const sInput = $id('searchInput'), sBox = $id('searchResults');
  function hideSearch() { if (!sBox) return; sBox.hidden = true; sInput.setAttribute('aria-expanded', 'false'); $id('globalSearch').classList.remove('open'); sel = -1; }
  function runSearch() {
    idx = idx || searchIndex();
    const q = sInput.value.trim().toLowerCase();
    if (!q) { hideSearch(); return; }
    const terms = q.split(/\s+/);
    results = idx.filter(r => terms.every(w => r.text.includes(w))).slice(0, 9);
    sel = results.length ? 0 : -1;
    sBox.innerHTML = results.length ? results.map((r, i) => `<button type="button" role="option" id="sr-${i}" aria-selected="${i === sel}" data-sr="${i}"><span class="tile tile-sm">${icon(r.icon)}</span><span><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></span></button>`).join('') : `<div class="empty" style="padding:18px">${esc(t('search.empty'))}</div>`;
    sBox.hidden = false; sInput.setAttribute('aria-expanded', 'true');
    sInput.setAttribute('aria-activedescendant', sel >= 0 ? `sr-${sel}` : '');
  }
  function pick(i) { const r = results[i]; if (!r) return; sInput.value = ''; hideSearch(); showScreen(r.go[0], { parts: r.go.slice(1) }); }
  if (sInput) {
    sInput.addEventListener('input', runSearch);
    sInput.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!results.length) return; sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length; sBox.querySelectorAll('[data-sr]').forEach((b, i) => b.setAttribute('aria-selected', String(i === sel))); sInput.setAttribute('aria-activedescendant', `sr-${sel}`); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
    });
    sInput.addEventListener('blur', () => setTimeout(hideSearch, 150));
    sBox.addEventListener('mousedown', e => { const b = e.target.closest('[data-sr]'); if (b) { e.preventDefault(); pick(Number(b.dataset.sr)); } });
    $id('searchToggle')?.addEventListener('click', () => { $id('globalSearch').classList.add('open'); sInput.focus(); });
  }

  /* ───────────── dashboard ───────────── */
  function nextLesson() {
    const a = state.academy;
    const last = a.last && LESSON_BY_ID.get(a.last);
    if (last && !a.completed[last.id]) return last;
    const pref = state.profile.level || 'beginner';
    const start = LEVELS.indexOf(pref);
    return LESSONS.find(l => !a.completed[l.id] && LEVELS.indexOf(l.level) >= start) || LESSONS.find(l => !a.completed[l.id]) || null;
  }
  QA.nextLesson = nextLesson;
  function weakTopics() {
    const tally = {};
    (state.tests || []).forEach(r => r.answers.forEach(a => { if (!a.topic || !LESSON_BY_ID.has(a.topic)) return; const x = tally[a.topic] || (tally[a.topic] = { right: 0, total: 0 }); x.total++; if (a.correct) x.right++; }));
    Object.entries(state.academy.quiz || {}).forEach(([id, qs]) => Object.values(qs).forEach(q => { const x = tally[id] || (tally[id] = { right: 0, total: 0 }); x.total++; if (q.firstTry) x.right++; }));
    return Object.entries(tally).filter(([, x]) => x.total >= 2 && x.right / x.total < 0.6).sort((a, b) => a[1].right / a[1].total - b[1].right / b[1].total).map(([id, x]) => ({ lesson: LESSON_BY_ID.get(id), pct: Math.round(x.right / x.total * 100), total: x.total }));
  }
  QA.weakTopics = weakTopics;
  function lessonMini(l, note) {
    const done = !!state.academy.completed[l.id];
    return `<button class="lesson-mini" type="button" data-go="academy/lesson/${l.id}" style="${stageStyle(l.stage)}"><span class="tile tile-sm stage-tile">${icon(STAGE_META[l.stage].icon)}</span><span class="lm-body"><b>${esc(l.title)}</b><small>${esc(stageName(l.stage))} · ${esc(t('common.min', { n: l.minutes }))}${note ? ' · ' + esc(note) : ''}</small></span>${done ? `<span class="badge badge-success">${icon('check')}</span>` : icon('chevron-right', 'flip-rtl muted')}</button>`;
  }
  function weekStrip() {
    const names = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], set = new Set(state.days), out = [];
    const d = new Date(); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow);
    for (let i = 0; i < 7; i++) { const day = localDay(d), on = set.has(day), isToday = day === localDay(); out.push(`<div class="wk-day${on ? ' on' : ''}${isToday ? ' today' : ''}"><span>${names[i]}</span><i>${on ? icon('check', 'ic-xs') : d.getDate()}</i></div>`); d.setDate(d.getDate() + 1); }
    return `<div class="wk-strip" aria-label="This week’s active days">${out.join('')}</div>`;
  }
  function renderOnboarding() {
    return `<section class="card onboard" aria-labelledby="obH">
      <div class="onboard-art" aria-hidden="true"><svg class="logo-mark" style="width:56px;height:56px"><use href="#logo-mark"/></svg></div>
      <div class="onboard-main"><span class="eyebrow">${icon('sparkles', 'ic-sm')}${esc(t('ob.eyebrow'))}</span><h2 id="obH">${esc(t('ob.title'))}</h2><p class="muted">${esc(t('ob.sub'))}</p>
      <form id="onboardForm" class="onboard-form">
        <div class="field"><label for="obName">${esc(t('ob.name'))}</label><input class="input" id="obName" maxlength="40" value="${esc(state.profile.name || '')}" placeholder="${esc(t('ob.namePh'))}"></div>
        <div class="field"><label for="obRole">${esc(t('prof.role'))}</label><select class="select" id="obRole"><option value="">${esc(t('ob.choose'))}</option>${ROLES.map(r => `<option${state.profile.role === r ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
        <div class="field"><span class="label" id="obLvlL">${esc(t('ob.level'))}</span><div class="seg" role="group" aria-labelledby="obLvlL">${LEVELS.map(lv => `<button type="button" data-ob-level="${lv}" aria-pressed="${(state.profile.level || 'beginner') === lv}">${icon(LEVEL_ICON[lv], 'ic-sm')}${esc(t('lvl.' + lv))}</button>`).join('')}</div></div>
        <div class="field"><label for="obGoal">${esc(t('prof.goal'))}</label><select class="select" id="obGoal">${[2, 3, 4, 5, 7, 10].map(n => `<option value="${n}"${(state.profile.goal || 4) === n ? ' selected' : ''}>${esc(t('ob.perWeek', { n }))}</option>`).join('')}</select></div>
        <div class="onboard-actions"><button class="btn btn-primary" type="submit">${icon('rocket')}${esc(t('ob.start'))}</button><button class="btn btn-ghost" type="button" id="obSkip">${esc(t('ob.skip'))}</button></div>
      </form></div>
    </section>`;
  }
  function bindOnboarding() {
    const f = $id('onboardForm'); if (!f) return;
    let level = state.profile.level || 'beginner';
    f.querySelectorAll('[data-ob-level]').forEach(b => b.addEventListener('click', () => { level = b.dataset.obLevel; f.querySelectorAll('[data-ob-level]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
    f.addEventListener('submit', e => {
      e.preventDefault();
      const name = $id('obName').value.trim().slice(0, 40);
      Object.assign(state.profile, { name, role: $id('obRole').value, level, goal: Number($id('obGoal').value) || 4, onboarded: true, createdAt: state.profile.createdAt || new Date().toISOString() });
      if (name) Profiles.rename(PROFILES.active, name);
      save(); renderDashboard(); toast(`Welcome, ${name || 'learner'}! Your path is ready.`, 'sparkles');
    });
    $id('obSkip').addEventListener('click', () => { state.profile.onboarded = true; if (!state.profile.createdAt) state.profile.createdAt = new Date().toISOString(); save(); renderDashboard(); });
  }
  function renderDashboard() {
    const root = $id('home'); if (!root) return;
    const st = computeStats(), lv = st.level, nl = nextLesson();
    const hour = new Date().getHours();
    const greet = t(hour < 12 ? 'dash.greetMorning' : hour < 18 ? 'dash.greetAfternoon' : 'dash.greetEvening', { name: profileName().split(' ')[0] });
    const overall = st.totalLessons ? Math.round(st.completed / st.totalLessons * 100) : 0;
    const recent = (state.tests || []).slice(-4).reverse();
    const weak = weakTopics().slice(0, 3);
    const recs = [];
    if (nl) recs.push([nl, t('dash.nextLesson')]);
    weak.forEach(w => { if (w.lesson && !recs.some(r => r[0].id === w.lesson.id)) recs.push([w.lesson, `${w.pct}%`]); });
    state.academy.bookmarks.forEach(id => { const l = LESSON_BY_ID.get(id); if (l && !state.academy.completed[id] && !recs.some(r => r[0].id === id)) recs.push([l, t('acad.bookmarked')]); });
    LESSONS.filter(l => !state.academy.completed[l.id] && !recs.some(r => r[0].id === l.id)).slice(0, 4).forEach(l => recs.push([l, '']));
    const earned = st.badges.filter(b => b.earned);
    const goalPct = Math.min(100, Math.round(st.doneThisWeek / st.goal * 100));
    const resume = session ? `<div class="callout callout-info dash-resume">${icon('mic')}<div><b class="title">Unfinished interview round</b>${esc(trackName(session.track))} · question ${session.index + 1} of ${session.questions.length}. <button class="link-btn" type="button" data-screen="practice">Resume ${icon('arrow-right', 'ic-sm flip-rtl')}</button></div></div>` : '';
    root.innerHTML = `
${!state.profile.onboarded ? renderOnboarding() : ''}
<section class="dash-hero">
  <div class="dash-hero-main">
    <span class="eyebrow on-dark-eyebrow">${icon('sparkles', 'ic-sm')}${esc(t('common.level', { n: lv.n }))} · ${esc(lv.title)}</span>
    <h1>${esc(greet)}</h1>
    <p>${esc(t('dash.sub'))}</p>
    ${nl ? `<div class="dash-next">
      <span class="tile" style="${stageStyle(nl.stage)}">${icon(STAGE_META[nl.stage].icon)}</span>
      <div class="dash-next-body"><small>${esc(state.academy.last === nl.id ? t('dash.continue') : st.completed ? t('dash.nextLesson') : t('dash.startHere'))} · ${esc(stageName(nl.stage))}</small><b>${esc(nl.title)}</b><span>${lvlBadge(nl.level)}<span class="muted-on-dark">${icon('clock', 'ic-xs')} ${esc(t('common.min', { n: nl.minutes }))}</span></span></div>
      <button class="btn btn-light" type="button" data-go="academy/lesson/${nl.id}">${icon('play')}${esc(state.academy.last === nl.id ? t('common.resume') : t('common.start'))}</button>
    </div>` : `<div class="dash-next"><span class="tile">${icon('trophy')}</span><div class="dash-next-body"><b>Every lesson complete — outstanding!</b><span class="muted-on-dark">Keep sharp with tests and drills.</span></div><button class="btn btn-light" type="button" data-go="tests">${icon('clipboard')}${esc(t('nav.tests'))}</button></div>`}
    <div class="dash-xp"><div class="row spread"><small>${lv.into} / ${lv.span} XP</small><small>${esc(t('common.level', { n: lv.n + 1 }))}</small></div>${barHtml(lv.pct, 'XP to next level')}</div>
  </div>
  <div class="dash-hero-ring">
    <div class="ring" style="--size:150px">${ringSvg(overall, 150, 12)}<div class="ring-label"><b>${overall}%</b><span>${esc(t('common.of', { a: st.completed, b: st.totalLessons }))}</span></div></div>
    <button class="btn btn-glass btn-sm" type="button" data-go="tests/quick">${icon('zap')}${esc(t('tests.quick'))}</button>
  </div>
</section>
${resume}
<div class="grid g-4 stat-grid">
  <div class="card stat-card"><span class="tile" data-tone="accent">${icon('flame')}</span><div><b class="tnum">${st.streak}</b><span>${esc(t('dash.streak'))}</span></div></div>
  <div class="card stat-card"><span class="tile">${icon('book')}</span><div><b class="tnum">${st.completed}<small>/${st.totalLessons}</small></b><span>${esc(t('dash.lessonsDone'))}</span></div></div>
  <div class="card stat-card"><span class="tile" data-tone="gold">${icon('clipboard')}</span><div><b class="tnum">${st.avg == null ? '—' : st.avg + '%'}</b><span>${esc(t('dash.avgScore'))} · ${st.tests} ${esc(t('dash.testsTaken').toLowerCase())}</span></div></div>
  <div class="card stat-card"><span class="tile" data-tone="violet">${icon('puzzle')}</span><div><b class="tnum">${st.drillsSolved}<small>/${CONTENT.drills.length}</small></b><span>${esc(t('dash.drillsDone'))}</span></div></div>
</div>
<div class="dash-grid">
  <section class="card dash-levels" aria-labelledby="dlH">
    <div class="card-title"><h2 id="dlH">${esc(t('dash.byLevel'))}</h2><button class="link-btn" type="button" data-screen="academy">${esc(t('common.viewAll'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
    <div class="level-rows">${LEVELS.map(lvName => { const x = st.byLevel[lvName]; return `<button type="button" class="level-row" data-go="academy/level/${lvName}"><span class="tile tile-sm lvl-tile-${lvName}">${icon(LEVEL_ICON[lvName])}</span><span class="lr-body"><span class="row spread"><b>${esc(t('lvl.' + lvName))}</b><small class="tnum">${x.done}/${x.total}</small></span>${barHtml(x.pct, t('lvl.' + lvName) + ' progress', 'bar-sm lvl-bar-' + lvName)}</span></button>`; }).join('')}</div>
    <div class="stage-chips">${STAGE_ORDER.map(sg => { const x = st.byStage[sg]; return `<button type="button" class="stage-chip" data-go="academy/stage/${sg}" style="${stageStyle(sg)}" title="${esc(stageName(sg))}: ${x.done}/${x.total}"><span class="sc-ring" style="--p:${x.pct}"></span><span>${esc(stageName(sg))}</span></button>`; }).join('')}</div>
  </section>
  <section class="card dash-goal" aria-labelledby="dgH">
    <div class="card-title"><h2 id="dgH">${esc(t('dash.weekly'))}</h2><button class="link-btn" type="button" data-screen="profile">${icon('edit', 'ic-sm')}${esc(t('common.edit'))}</button></div>
    <div class="goal-body"><div class="ring" style="--size:112px;--stroke:10px">${ringSvg(goalPct, 112, 10)}<div class="ring-label"><b>${st.doneThisWeek}</b><span>/ ${st.goal}</span></div></div><p>${esc(t('dash.goalText', { done: st.doneThisWeek, goal: st.goal }))}</p></div>
    ${weekStrip()}
  </section>
  <section class="card dash-recs" aria-labelledby="drH">
    <div class="card-title"><h2 id="drH">${esc(t('dash.recommended'))}</h2></div>
    <div class="stack">${recs.slice(0, 4).map(([l, note]) => lessonMini(l, note)).join('') || `<div class="empty">${icon('trophy', 'ic-xl')}<p>Nothing left — try a level exam.</p></div>`}</div>
  </section>
  <section class="card dash-tests" aria-labelledby="dtH">
    <div class="card-title"><h2 id="dtH">${esc(t('dash.recentTests'))}</h2><button class="link-btn" type="button" data-screen="tests">${esc(t('nav.tests'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
    ${recent.length ? `<div class="stack">${recent.map(r => `<button type="button" class="test-row" data-go="tests/result/${encodeURIComponent(r.id)}"><span class="score-pill ${r.score >= 70 ? 'good' : r.score >= 50 ? 'mid' : 'low'}">${r.score}%</span><span class="tr-body"><b>${esc(r.title)}</b><small>${esc(relDate(r.date))} · ${r.correct}/${r.total}</small></span>${icon('chevron-right', 'flip-rtl muted')}</button>`).join('')}</div>` : `<div class="empty"><span class="tile" data-tone="gold">${icon('clipboard')}</span><h3>No tests yet</h3><p>Take a 10-question quick quiz to see where you stand.</p><button class="btn btn-soft btn-sm" type="button" data-go="tests/quick">${icon('zap')}${esc(t('tests.quick'))}</button></div>`}
  </section>
  <section class="card dash-weak" aria-labelledby="dwH">
    <div class="card-title"><h2 id="dwH">${esc(t('dash.weak'))}</h2>${weak.length ? `<button class="btn btn-soft btn-sm" type="button" data-go="tests/weak">${icon('target')}Practise these</button>` : ''}</div>
    ${weak.length ? `<div class="stack">${weak.map(w => `<button type="button" class="weak-row" data-go="academy/lesson/${w.lesson.id}"><span class="score-pill low">${w.pct}%</span><span><b>${esc(w.lesson.title)}</b><small>${esc(stageName(w.lesson.stage))} · ${w.total} answers</small></span></button>`).join('')}</div>` : `<p class="muted">${esc(t('dash.noWeak'))}</p>`}
  </section>
  <section class="card dash-badges" aria-labelledby="dbH">
    <div class="card-title"><h2 id="dbH">${esc(t('dash.badges'))} <span class="badge badge-gold">${earned.length}/${st.badges.length}</span></h2><button class="link-btn" type="button" data-screen="profile">${esc(t('dash.allBadges'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
    <div class="badge-grid compact">${st.badges.slice().sort((a, b) => b.earned - a.earned).slice(0, 8).map(badgeHtml).join('')}</div>
  </section>
</div>
<div class="section-title"><div><h2>${esc(t('dash.quick'))}</h2></div></div>
<div class="grid g-4 quick-grid">
  ${[['practice', 'mic', 'info', t('nav.interview'), 'Model answers & self-scoring'], ['lab', 'flask', 'accent', t('nav.labs'), 'Six simulated apps'], ['challenges', 'trophy', 'gold', t('nav.challenges'), 'Write tests, get rubric feedback'], ['learning', 'route', 'violet', t('nav.roadmap'), '24-week career roadmap']].map(([id, ic, tone, title, sub]) => `<button type="button" class="card card-hover quick-card" data-screen="${id}"><span class="tile" data-tone="${tone}">${icon(ic)}</span><b>${esc(title)}</b><small>${esc(sub)}</small></button>`).join('')}
</div>`;
    bindOnboarding();
  }
  function badgeHtml(b) { return `<div class="badge-tile${b.earned ? ' earned' : ''}" title="${esc(b.desc)}"><span class="badge-medal">${icon(b.icon)}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small>${b.earned ? '' : `<span class="sr-only">Not earned yet</span>`}</div>`; }
  QA.badgeHtml = badgeHtml;
  QA.views.home = renderDashboard;

  /* ───────────── profile ───────────── */
  function renderProfile() {
    const root = $id('profile'); if (!root) return;
    const st = computeStats(), p = state.profile, prefs = Prefs.get();
    const color = profileColor(), name = profileName();
    const since = p.createdAt || (Profiles.active() && Profiles.active().createdAt);
    const earned = st.badges.filter(b => b.earned).length;
    root.innerHTML = `
<div class="page-head profile-heading"><div><h1>${esc(t('prof.title'))}</h1><p>${esc(t('prof.sub'))}</p></div></div>
<section class="profile-hero card" aria-labelledby="profileDisplayName">
  <div class="profile-identity">
    <span class="avatar avatar-xl" id="profileAvatarPreview" aria-hidden="true" style="--av-bg:${color}">${esc(initials(name))}</span>
    <div class="ph-main"><h2 id="profileDisplayName">${esc(name)}</h2><p>${esc(p.role || 'QA learner')}${since ? ' · ' + esc(t('prof.memberSince', { date: new Date(since).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) })) : ''}</p>
      ${lvlBadge(p.level || 'beginner')}
    </div>
  </div>
  <div class="profile-level">
    <div class="row spread"><b>Level ${st.level.n}</b><span>${esc(st.level.title)}</span></div>
    ${barHtml(st.level.pct, 'Progress to next level', 'bar-sm')}
    <small>${st.level.next - st.xp} XP to level ${st.level.n + 1}</small>
  </div>
</section>
<dl class="profile-stats">
  ${[['zap', 'gold', 'Total XP', st.xp], ['flame', 'accent', 'Day streak', st.streak], ['target', 'brand', 'Weekly lessons', `${st.doneThisWeek}/${st.goal}`], ['award', 'violet', 'Badges earned', `${earned}/${st.badges.length}`]].map(([ic, tone, label, value]) => `<div class="card"><dt><span class="tile tile-sm" data-tone="${tone}">${icon(ic)}</span><span>${label}</span></dt><dd class="tnum">${value}</dd></div>`).join('')}
</dl>
<div class="grid profile-grid">
  <section class="card profile-panel" aria-labelledby="pfEditH">
    <div class="card-title"><span class="tile tile-sm">${icon('edit')}</span><h2 id="pfEditH">Edit profile</h2></div>
    <form id="profileForm" class="form-grid">
      <div class="field"><label for="pfName">${esc(t('prof.name'))}</label><input class="input" id="pfName" maxlength="40" value="${esc(p.name || name)}" required></div>
      <div class="field"><label for="pfRole">${esc(t('prof.role'))}</label><select class="select" id="pfRole"><option value="">${esc(t('ob.choose'))}</option>${ROLES.map(r => `<option${p.role === r ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select></div>
      <div class="field span-2"><span class="label" id="pfLvlL">${esc(t('prof.levelSelf'))}</span><div class="seg" role="group" aria-labelledby="pfLvlL">${LEVELS.map(lv => `<button type="button" data-pf-level="${lv}" aria-pressed="${(p.level || 'beginner') === lv}">${icon(LEVEL_ICON[lv], 'ic-sm')}${esc(t('lvl.' + lv))}</button>`).join('')}</div></div>
      <div class="field"><label for="pfGoal">${esc(t('prof.goal'))}</label><input class="input" id="pfGoal" type="number" min="1" max="21" value="${p.goal || 4}"><span class="help">Lessons per week.</span></div>
      <div class="field"><span class="label" id="pfColL">${esc(t('prof.avatar'))}</span><div class="swatches" role="radiogroup" aria-labelledby="pfColL">${AVATAR_COLORS.map(c => `<button type="button" role="radio" class="swatch" style="--sw:${c}" data-color="${c}" aria-checked="${c === color}" aria-label="Colour ${c}"></button>`).join('')}</div></div>
      <div class="field span-2"><label for="pfBio">${esc(t('prof.bio'))}</label><textarea class="textarea" id="pfBio" maxlength="400" rows="3" placeholder="Your goals, current role, what you are learning…">${esc(p.bio || '')}</textarea></div>
      <div class="span-2 row profile-save"><button class="btn btn-primary" type="submit">${icon('save')}${esc(t('common.save'))}</button><span class="help" id="pfStatus" role="status"></span></div>
    </form>
  </section>
  <div class="profile-sidebar">
  <section class="card profile-panel" aria-labelledby="pfPrefH">
    <div class="card-title"><span class="tile tile-sm" data-tone="info">${icon('sliders')}</span><h2 id="pfPrefH">Preferences</h2></div>
    <div class="stack">
      <div class="field"><label for="pfLang">${esc(t('prof.language'))}</label><select class="select" id="pfLang">${QA_I18N.langs.map(l => `<option value="${l.code}"${l.code === QA_I18N.lang ? ' selected' : ''}>${esc(l.native)} — ${esc(l.name)}</option>`).join('')}</select><span class="help">Lessons stay in English; menus and simple explanations switch.</span></div>
      <div class="field"><span class="label" id="pfThemeL">${esc(t('prof.theme'))}</span><div class="seg" role="group" aria-labelledby="pfThemeL">${[['light', 'sun', 'prof.themeLight'], ['dark', 'moon', 'prof.themeDark'], ['system', 'monitor', 'prof.themeSystem']].map(([v, ic, k]) => `<button type="button" data-theme-set="${v}" aria-pressed="${(prefs.theme || 'system') === v}">${icon(ic, 'ic-sm')}${esc(t(k))}</button>`).join('')}</div></div>
    </div>
  </section>
  <section class="card profile-panel" aria-labelledby="pfProfilesH">
    <div class="card-title"><span class="tile tile-sm" data-tone="violet">${icon('users')}</span><h2 id="pfProfilesH">${esc(t('prof.profiles'))}</h2></div>
    <div class="stack" id="profileList">${Profiles.all().map(x => `<div class="profile-row"><span class="avatar avatar-sm" style="--av-bg:${x.id === PROFILES.active ? color : x.color}">${esc(initials(x.id === PROFILES.active ? name : x.name))}</span><span class="pr-name"><b>${esc(x.id === PROFILES.active ? name : x.name)}</b><small>${x.id === 'default' ? 'Original profile' : 'Added ' + esc(new Date(x.createdAt).toLocaleDateString())}</small></span>${x.id === PROFILES.active ? `<span class="badge badge-brand">${icon('check')}${esc(t('prof.active'))}</span>` : `<button class="btn btn-secondary btn-sm" type="button" data-switch-profile="${x.id}">${esc(t('prof.switch'))}</button>${x.id !== 'default' ? `<button class="icon-btn" type="button" data-delete-profile="${x.id}" aria-label="Delete profile ${esc(x.name)}">${icon('trash')}</button>` : ''}`}</div>`).join('')}</div>
    <form class="row add-profile" id="addProfileForm"><label class="sr-only" for="newProfileName">New profile name</label><input class="input" id="newProfileName" maxlength="40" placeholder="New learner’s name" required><button class="btn btn-soft" type="submit">${icon('plus')}${esc(t('prof.addProfile'))}</button></form>
    <p class="help profile-local-note">Each local profile has its own progress. Anyone using this browser can switch profiles.</p>
  </section>
  </div>
</div>
<section class="card profile-panel profile-achievements" aria-labelledby="pfBadgesH">
  <div class="card-title"><span class="tile tile-sm" data-tone="gold">${icon('award')}</span><h2 id="pfBadgesH">${esc(t('prof.achievements'))}</h2></div>
  <div class="badge-grid">${st.badges.map(badgeHtml).join('')}</div>
</section>`;
    let level = p.level || 'beginner', col = color;
    root.querySelectorAll('[data-pf-level]').forEach(b => b.addEventListener('click', () => { level = b.dataset.pfLevel; root.querySelectorAll('[data-pf-level]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
    const preview = $id('profileAvatarPreview'), nameInput = $id('pfName');
    nameInput.addEventListener('input', () => { preview.textContent = initials(nameInput.value.trim() || name); });
    root.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => {
      col = b.dataset.color;
      preview.style.setProperty('--av-bg', col);
      root.querySelectorAll('[data-color]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    }));
    $id('profileForm').addEventListener('submit', e => {
      e.preventDefault();
      const nm = $id('pfName').value.trim().slice(0, 40);
      if (!nm) { $id('pfStatus').textContent = 'Please enter a display name.'; $id('pfName').focus(); return; }
      Object.assign(state.profile, { name: nm, role: $id('pfRole').value, level, goal: Math.max(1, Math.min(21, Number($id('pfGoal').value) || 4)), bio: $id('pfBio').value.slice(0, 400), color: col, onboarded: true, createdAt: state.profile.createdAt || new Date().toISOString() });
      Profiles.rename(PROFILES.active, nm, col);
      const ok = save(); refreshChrome(); renderProfile();
      $id('pfStatus').textContent = ok ? t('prof.saved') : 'Could not save — browser storage is unavailable.';
      $id('profileForm').querySelector('[type="submit"]').focus({ preventScroll: true });
      if (ok) toast(t('prof.saved'), 'user');
    });
    $id('pfLang').addEventListener('change', e => QA_I18N.set(e.target.value));
    root.querySelectorAll('[data-theme-set]').forEach(b => b.addEventListener('click', () => { setTheme(b.dataset.themeSet === 'system' ? null : b.dataset.themeSet); root.querySelectorAll('[data-theme-set]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
    root.querySelectorAll('[data-switch-profile]').forEach(b => b.addEventListener('click', () => Profiles.switchTo(b.dataset.switchProfile)));
    root.querySelectorAll('[data-delete-profile]').forEach(b => b.addEventListener('click', async () => {
      const x = Profiles.all().find(p2 => p2.id === b.dataset.deleteProfile); if (!x) return;
      const choice = await dialog({ title: `Delete “${x.name}”?`, body: `<p>This permanently removes that learner profile and all of its progress from this browser. Your current profile is not affected.</p>`, confirmCheck: 'I understand this cannot be undone', actions: [{ label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Delete profile', value: 'delete', kind: 'danger', needsCheck: true }] });
      if (choice === 'delete' && Profiles.remove(x.id)) { toast('Profile deleted.', 'trash'); renderProfile(); }
    }));
    $id('addProfileForm').addEventListener('submit', async e => {
      e.preventDefault();
      const nm = $id('newProfileName').value.trim(); if (!nm) return;
      const id = Profiles.create(nm);
      const choice = await dialog({ title: `Profile “${nm}” created`, body: '<p>Switch to it now? The page reloads into the new profile with a fresh start. You can switch back any time from Profile.</p>', actions: [{ label: 'Stay here', value: 'stay', kind: 'quiet' }, { label: 'Switch now', value: 'switch', kind: 'primary' }] });
      if (choice === 'switch') Profiles.switchTo(id); else renderProfile();
    });
  }
  QA.views.profile = renderProfile;

  /* ───────────── progress ───────────── */
  function heatmap(weeks) {
    const counts = {};
    state.days.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
    Object.values(state.academy.completed).forEach(iso => { const d = localDay(iso); counts[d] = (counts[d] || 0) + 1; });
    (state.tests || []).forEach(r => { const d = localDay(r.date); counts[d] = (counts[d] || 0) + 1; });
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - (weeks * 7 - 1) - ((end.getDay() + 6) % 7 === 6 ? 0 : 0));
    const startDow = (start.getDay() + 6) % 7; start.setDate(start.getDate() - startDow);
    const cells = []; const d = new Date(start);
    while (d <= end) { const k = localDay(d), n = counts[k] || 0; cells.push(`<i class="hm-c l${Math.min(4, n)}" title="${k}: ${n} activit${n === 1 ? 'y' : 'ies'}"></i>`); d.setDate(d.getDate() + 1); }
    const active = Object.keys(counts).filter(k => k >= localDay(start)).length;
    return `<div class="heatmap" role="img" aria-label="Activity over the last ${weeks} weeks: ${active} active days">${cells.join('')}</div><div class="hm-legend"><span>Less</span><i class="hm-c l0"></i><i class="hm-c l1"></i><i class="hm-c l2"></i><i class="hm-c l3"></i><i class="hm-c l4"></i><span>More</span></div>`;
  }
  function renderProgress() {
    const root = $id('progressMain'); if (!root) return;
    const st = computeStats();
    const tests = (state.tests || []).slice().reverse();
    const trend = (state.tests || []).slice(-12);
    const weak = weakTopics();
    root.innerHTML = `
<div class="page-head"><div><span class="eyebrow">${icon('chart', 'ic-sm')}${esc(t('nav.groupYou'))}</span><h1>${esc(t('progress.title'))}</h1><p>${esc(t('progress.sub'))}</p></div><div class="actions"><button class="btn btn-secondary btn-sm" type="button" id="exportBtn2">${icon('download')}Download my progress</button></div></div>
<div class="grid g-4 stat-grid">
  <div class="card stat-card"><span class="tile" data-tone="gold">${icon('zap')}</span><div><b class="tnum">${st.xp}</b><span>XP · ${esc(t('common.level', { n: st.level.n }))}</span></div></div>
  <div class="card stat-card"><span class="tile">${icon('book')}</span><div><b class="tnum">${st.completed}<small>/${st.totalLessons}</small></b><span>${esc(t('dash.lessonsDone'))}</span></div></div>
  <div class="card stat-card"><span class="tile" data-tone="info">${icon('clipboard')}</span><div><b class="tnum">${st.tests}</b><span>${esc(t('dash.testsTaken'))}${st.avg != null ? ' · avg ' + st.avg + '%' : ''}</span></div></div>
  <div class="card stat-card"><span class="tile" data-tone="accent">${icon('flame')}</span><div><b class="tnum">${st.streak}</b><span>${esc(t('dash.streak'))} · ${state.days.length} active days</span></div></div>
</div>
<div class="grid g-2" style="margin-top:18px">
  <section class="card" aria-labelledby="pgActH"><div class="card-title"><h2 id="pgActH">${esc(t('dash.activity'))}</h2><small class="muted">Last 18 weeks</small></div>${heatmap(18)}</section>
  <section class="card" aria-labelledby="pgTrendH"><div class="card-title"><h2 id="pgTrendH">Test score trend</h2><small class="muted">Last ${trend.length || 0} tests</small></div>
    ${trend.length ? `<div class="trend" role="img" aria-label="Scores: ${trend.map(r => r.score + '%').join(', ')}">${trend.map(r => `<div class="trend-bar"><i class="${r.score >= 70 ? 'good' : r.score >= 50 ? 'mid' : 'low'}" style="height:${Math.max(4, r.score)}%"></i><span>${r.score}</span></div>`).join('')}</div><p class="help">Green = 70%+ (pass mark), amber = 50–69%, red = below 50%.</p>` : `<div class="empty"><p>Your test scores will chart here.</p></div>`}
  </section>
</div>
<section class="card" aria-labelledby="pgStageH" style="margin-top:18px"><div class="card-title"><h2 id="pgStageH">Learning Lab by stage</h2><button class="link-btn" type="button" data-screen="academy">${esc(t('nav.academy'))}${icon('arrow-right', 'ic-sm flip-rtl')}</button></div>
  <div class="stage-progress">${STAGE_ORDER.map(sg => { const x = st.byStage[sg]; return `<button type="button" class="sp-row" data-go="academy/stage/${sg}" style="${stageStyle(sg)}"><span class="tile tile-sm stage-tile">${icon(STAGE_META[sg].icon)}</span><span class="sp-name"><b>${esc(stageName(sg))}</b><small>${x.done}/${x.total} lessons</small></span><span class="sp-bar">${barHtml(x.pct, stageName(sg) + ' progress', 'bar-sm stage-bar')}</span><b class="tnum sp-pct">${x.pct}%</b></button>`; }).join('')}</div>
</section>
<div class="grid g-2" style="margin-top:18px">
  <section class="card" aria-labelledby="pgWeakH"><div class="card-title"><h2 id="pgWeakH">${esc(t('dash.weak'))}</h2>${weak.length ? `<button class="btn btn-soft btn-sm" type="button" data-go="tests/weak">${icon('target')}Practise weak topics</button>` : ''}</div>
    ${weak.length ? `<div class="stack">${weak.slice(0, 8).map(w => `<button type="button" class="weak-row" data-go="academy/lesson/${w.lesson.id}"><span class="score-pill low">${w.pct}%</span><span><b>${esc(w.lesson.title)}</b><small>${esc(stageName(w.lesson.stage))} · ${w.total} answers</small></span></button>`).join('')}</div>` : `<p class="muted">${esc(t('dash.noWeak'))}</p>`}
  </section>
  <section class="card" aria-labelledby="pgLvlH"><div class="card-title"><h2 id="pgLvlH">${esc(t('dash.byLevel'))}</h2></div>
    <div class="level-rows">${LEVELS.map(lvName => { const x = st.byLevel[lvName]; return `<button type="button" class="level-row" data-go="academy/level/${lvName}"><span class="tile tile-sm lvl-tile-${lvName}">${icon(LEVEL_ICON[lvName])}</span><span class="lr-body"><span class="row spread"><b>${esc(t('lvl.' + lvName))}</b><small class="tnum">${x.done}/${x.total} · ${x.pct}%</small></span>${barHtml(x.pct, t('lvl.' + lvName) + ' progress', 'bar-sm lvl-bar-' + lvName)}</span></button>`; }).join('')}</div>
  </section>
</div>
<section class="card" aria-labelledby="pgHistH" style="margin-top:18px"><div class="card-title"><h2 id="pgHistH">${esc(t('tests.history'))}</h2><small class="muted">${tests.length} tests</small></div>
  ${tests.length ? `<div class="tbl-wrap"><table class="tbl"><caption class="sr-only">Test history</caption><thead><tr><th scope="col">Test</th><th scope="col">Date</th><th scope="col">Score</th><th scope="col">Time</th><th scope="col"><span class="sr-only">Review</span></th></tr></thead><tbody>${tests.slice(0, 25).map(r => `<tr><th scope="row">${esc(r.title)}</th><td>${esc(new Date(r.date).toLocaleDateString())}</td><td><span class="score-pill ${r.score >= 70 ? 'good' : r.score >= 50 ? 'mid' : 'low'}">${r.score}%</span> <small class="muted">${r.correct}/${r.total}</small></td><td class="tnum">${r.seconds ? fmtDuration(r.seconds) : '—'}</td><td><button class="link-btn" type="button" data-go="tests/result/${encodeURIComponent(r.id)}">${esc(t('common.review'))}</button></td></tr>`).join('')}</tbody></table></div>` : `<p class="muted">No tests yet.</p>`}
</section>
<div class="section-title"><div><h2>Practice history</h2></div></div>`;
    $id('exportBtn2')?.addEventListener('click', () => window.exportPracticeData && window.exportPracticeData());
    try { renderHistory(); renderChallengeProgress(); } catch (e) { console.error(e); }
  }
  QA.views.progress = renderProgress;

  /* ───────────── ported screens: make sure they are populated when shown ───────────── */
  QA.views.challenges = () => { try { renderChallenges(); } catch (e) { console.error(e); } };
  QA.views.submissions = () => { try { renderSubmissions(); } catch (e) { console.error(e); } };
  QA.views.workspace = () => { if (!$id('targetAppView').childElementCount) beginChallenge(activeChallenge.id, { silent: true }); };
  QA.views.practice = parts => { if (QA.renderInterviewHub) { QA.renderInterviewHub(parts || []); return; } if (!session) beginPractice(); };
  QA.views.lab = parts => { if (parts[0]) { const b = document.querySelector(`.lab-tab[data-lab="${CSS.escape(parts[0])}"]`); if (b) b.click(); } };
  QA.views.learning = () => {};
  QA.views.settings = () => {};

  QA.afterDataChange = () => { refreshChrome(); if (QA.current === 'home') renderDashboard(); if (QA.current === 'progress') renderProgress(); if (QA.current === 'profile') renderProfile(); };
  document.addEventListener('qa:saved', refreshChrome);

  /* ───────────── entering the app ───────────── */
  QA.enterApp = function () {
    refreshChrome();
    const [id, ...parts] = currentPathFromHash();
    showScreen(id, { parts, replace: true });
  };

  /* ───────────── landing ───────────── */
  function renderLandingLevels() {
    const root = $id('landingLevels'); if (!root) return;
    const colors = { beginner: '#15803D', intermediate: '#1D4ED8', advanced: '#6D28D9' };
    const blurbs = {
      beginner: 'The QA mindset, SDLC/STLC, test cases, boundary values, bug reports, web and API basics.',
      intermediate: 'Decision tables, exploratory testing, SQL joins, Postman, auth, Playwright, accessibility and security.',
      advanced: 'Risk-based strategy, pairwise testing, contract tests, flaky tests, CI/CD, performance, release decisions.'
    };
    root.innerHTML = LEVELS.map(lv => {
      const list = LESSONS.filter(l => l.level === lv);
      return `<article class="l-level" style="--lv-c:${colors[lv]}"><span class="tile lvl-tile-${lv}">${icon(LEVEL_ICON[lv])}</span><h3>${esc(t('lvl.' + lv))}</h3><p>${esc(blurbs[lv])}</p><ul>${list.slice(0, 5).map(l => `<li>${icon('check-circle', 'ic-sm')}<span>${esc(l.title)}</span></li>`).join('')}</ul><p style="margin-top:14px"><b>${list.length}</b> lessons</p></article>`;
    }).join('');
    const counts = { lessons: LESSONS.length, questions: QUESTION_POOL.length + CONTENT.scenarios.reduce((n, s) => n + s.questions.length, 0), scenarios: CONTENT.scenarios.length };
    document.querySelectorAll('[data-count]').forEach(el => { const n = counts[el.dataset.count]; if (n) el.textContent = n; });
  }

  /* ───────────── boot ───────────── */
  QA_I18N.setDocLang();
  QA_I18N.apply();
  applyTheme(Prefs.get().theme);
  /* In English the curriculum and counters are already in index.html (pre-rendered by tools/build-seo.js from this
     same function, kept in sync by its --check), so boot skips the identical re-render. */
  if (QA_I18N.lang !== 'en' || !document.querySelector('#landingLevels .l-level')) renderLandingLevels();
  if (location.protocol !== 'file:') document.querySelectorAll('a[href="#top"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: motionOK() ? 'smooth' : 'auto' }); }));
  let signedIn = false;
  try { const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); signedIn = auth && auth.username === DEMO_USERNAME; } catch {}
  if (signedIn) openApp(); else if (window.QA_PENDING === 'login') openLogin(); else openLanding();
  window.QA_PENDING = null;
  document.documentElement.removeAttribute('data-boot');
  window.QadenceApp = { computeStats, refreshChrome, renderDashboard, version: SCHEMA_VERSION };
})();
