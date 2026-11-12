/* Qadence · career roadmap (eight PDF-derived stage guides), revision, storage helpers,
   dialog, and data export / import / reset. Ported from the SQA Practice Room learning hub.
   Extends the browser-local state (key "sqaPracticeRoom.v1", schema v3). Nothing here talks
   to a server, runs learner code, or stores the shared demo password. */
(function () {
  'use strict';
  const L = window.SQA_LEARNING;
  if (!L || !Array.isArray(L.stages)) { console.error('[Learning hub] content did not load.'); return; }

  const STAGES = L.stages, STEPS = L.steps, LABS = L.labs;
  const AUTH = 'sqaPracticeRoom.auth.v1';
  const UNREADABLE = KEY + '.unreadable';
  const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
  const $ = id => document.getElementById(id);
  const esc = s => escapeHtml(s == null ? '' : s);
  const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const stageIds = new Set(STAGES.map(s => s.id));
  const stageNo = s => String(STAGES.indexOf(s) + 1).padStart(2, '0');
  const behavior = () => (motionOK() ? 'smooth' : 'auto');

  /* ───────────── state: defaults, migration, normalisation ───────────── */
  function defaultLearning() {
    return { version: 2, completed: [], completedAt: {}, quiz: {}, review: {}, notes: {}, code: {}, step: {}, seen: {}, visited: {}, taskDone: {}, readiness: [], pace: 'base', active: null };
  }
  function normalizeLearning(input) {
    const l = isObj(input) ? input : {};
    const out = defaultLearning();
    out.completed = Array.isArray(l.completed) ? [...new Set(l.completed.filter(id => stageIds.has(id)))] : [];
    if (isObj(l.completedAt)) for (const [id, v] of Object.entries(l.completedAt)) {
      if (out.completed.includes(id) && typeof v === 'string' && Number.isFinite(Date.parse(v))) out.completedAt[id] = new Date(v).toISOString();
    }
    if (isObj(l.quiz)) for (const [id, answers] of Object.entries(l.quiz)) {
      const stage = STAGES.find(s => s.id === id);
      if (!stage || !isObj(answers)) continue;
      const clean = {};
      for (const [k, a] of Object.entries(answers)) {
        const i = Number(k), q = stage.quiz[i];
        if (!Number.isInteger(i) || !q || !isObj(a)) continue;
        const choice = Number(a.choice);
        if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) continue;
        const attempts = Number.isInteger(Number(a.attempts)) ? Math.max(1, Math.min(99, Number(a.attempts))) : 1;
        const correct = choice === q.correct;
        clean[i] = { choice, correct, attempts, firstTry: correct && (a.firstTry === true || (a.firstTry === undefined && attempts === 1)) };
      }
      if (Object.keys(clean).length) out.quiz[id] = clean;
    }
    const flagMap = src => isObj(src) ? Object.fromEntries(Object.entries(src).filter(([id, v]) => stageIds.has(id) && v).map(([id]) => [id, true])) : {};
    out.review = flagMap(l.review);
    out.visited = flagMap(l.visited);
    out.taskDone = flagMap(l.taskDone);
    if (isObj(l.notes)) for (const [id, v] of Object.entries(l.notes)) if (stageIds.has(id) && typeof v === 'string' && v.trim()) out.notes[id] = v.slice(0, 20000);
    if (isObj(l.code)) for (const [key, v] of Object.entries(l.code)) {
      const [id, k] = key.split(':'), stage = STAGES.find(s => s.id === id);
      if (stage && stage.codes[Number(k)] && typeof v === 'string' && v !== stage.codes[Number(k)].text) out.code[`${id}:${Number(k)}`] = v.slice(0, 50000);
    }
    const stepMap = src => isObj(src) ? Object.fromEntries(Object.entries(src).filter(([id, v]) => stageIds.has(id) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) < STEPS.length).map(([id, v]) => [id, Number(v)])) : {};
    out.step = stepMap(l.step);
    out.seen = stepMap(l.seen);
    const capstone = STAGES.find(s => s.readiness);
    out.readiness = Array.isArray(l.readiness) ? [...new Set(l.readiness.map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < (capstone?.readiness.length || 0)))] : [];
    out.pace = L.paces.some(p => p.id === l.pace) ? l.pace : 'base';
    out.active = stageIds.has(l.active) ? l.active : null;
    // Earlier draft builds stored completion, notes and a single quizAnswers map. Completion,
    // notes and position carry over above; old single-question answers do not map to the new checks.
    return out;
  }
  function ensureState() {
    state.learning = normalizeLearning(state.learning);
    normalizeV3(state, state);
    if (!Array.isArray(state.challengeWeak)) state.challengeWeak = [];
  }
  const ld = () => state.learning;

  /* Validated restore of a backup file; every field is type-checked, clamped and trimmed. */
  function normalizeImportedState(input) {
    const knownQuestion = id => bank.find(q => q.id === id);
    const knownChallenge = id => challengeData.find(c => c.id === id);
    const validDay = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
    const isoOrNow = v => typeof v === 'string' && Number.isFinite(Date.parse(v)) ? new Date(v).toISOString() : new Date().toISOString();
    const safe = freshState();
    safe.days = Array.isArray(input.days) ? [...new Set(input.days.filter(validDay))].slice(0, 2000) : [];
    safe.sessions = Array.isArray(input.sessions) ? input.sessions
      .filter(x => isObj(x) && tracks.some(t => t.id === x.track) && validDay(x.date) && Number.isFinite(+x.average))
      .slice(0, 1000)
      .map(x => ({ id: String(x.id || '').slice(0, 80), track: x.track, date: x.date, average: Math.max(0, Math.min(8, +x.average)), answered: Number.isFinite(+x.answered) ? Math.max(0, Math.min(20, +x.answered)) : 0, revision: !!x.revision })) : [];
    if (isObj(input.scores)) for (const [id, value] of Object.entries(input.scores)) if (knownQuestion(id) && Number.isFinite(+value)) {
      safe.scores[id] = Math.max(0, Math.min(8, +value));
      if (safe.scores[id] < 6) safe.weak[id] = 1;
    }
    safe.lastTrack = tracks.some(t => t.id === input.lastTrack) ? input.lastTrack : null;
    if (isObj(input.workspaceDrafts)) for (const [id, d] of Object.entries(input.workspaceDrafts)) {
      if (knownChallenge(id) && isObj(d)) safe.workspaceDrafts[id] = { challengeId: id, framework: String(d.framework || '').slice(0, 40), code: String(d.code || '').slice(0, 50000), approach: String(d.approach || '').slice(0, 10000), testCases: String(d.testCases || '').slice(0, 10000), updatedAt: isoOrNow(d.updatedAt) };
    }
    safe.submissions = Array.isArray(input.submissions) ? input.submissions.filter(x => isObj(x) && knownChallenge(x.challengeId)).slice(0, 200).map((x, n) => {
      const c = knownChallenge(x.challengeId), r = isObj(x.rubric) ? x.rubric : {};
      const clamp = (v, max) => Math.max(0, Math.min(max, Math.round(+v || 0)));
      return { id: `import-${Date.now()}-${n}`, challengeId: c.id, title: c.title, framework: String(x.framework || '').slice(0, 60), code: String(x.code || '').slice(0, 50000), approach: String(x.approach || '').slice(0, 10000), testCases: String(x.testCases || '').slice(0, 10000), rubric: { coverage: clamp(r.coverage, 30), assertions: clamp(r.assertions, 25), reliability: clamp(r.reliability, 25), approach: clamp(r.approach, 20) }, score: clamp(x.score, 100), createdAt: isoOrNow(x.createdAt), executed: isObj(x.run), run: isObj(x.run) ? { passed: clamp(x.run.passed, 999), failed: clamp(x.run.failed, 999), total: clamp(x.run.total, 999) } : null };
    }) : [];
    safe.challengeWeak = Array.isArray(input.challengeWeak) ? [...new Set(input.challengeWeak.filter(id => knownChallenge(id)))] : [];
    safe.labAttempts = isObj(input.labAttempts) ? Object.fromEntries(Object.entries(input.labAttempts).filter(([k]) => Object.prototype.hasOwnProperty.call(LABS, k)).map(([k, v]) => [k, Math.max(0, Math.min(100000, Math.round(+v || 0)))])) : {};
    safe.bugReports = Array.isArray(input.bugReports) ? input.bugReports.filter(isObj).slice(0, 200).map(r => ({ title: String(r.title || '').slice(0, 300), steps: String(r.steps || '').slice(0, 5000), expected: String(r.expected || '').slice(0, 5000), actual: String(r.actual || '').slice(0, 5000), severity: String(r.severity || '').slice(0, 40), createdAt: isoOrNow(r.createdAt) })) : [];
    safe.notes = typeof input.notes === 'string' ? input.notes.slice(0, 20000) : '';
    safe.learning = normalizeLearning(input.learning);
    const old = input.activeSession;
    if (isObj(old) && tracks.some(t => t.id === old.track) && Array.isArray(old.questions)) {
      const questions = old.questions.map(q => knownQuestion(q?.id)).filter(q => q && q.track === old.track).slice(0, 10);
      if (questions.length) {
        const answers = {};
        for (const q of questions) {
          const a = isObj(old.answers) && isObj(old.answers[q.id]) ? old.answers[q.id] : {};
          const rubric = Array.isArray(a.rubric) ? q.criteria.map((_, i) => Math.max(0, Math.min(2, Number.isInteger(+a.rubric[i]) ? +a.rubric[i] : 0))) : [];
          answers[q.id] = { text: typeof a.text === 'string' ? a.text.slice(0, 10000) : '', ...(rubric.length ? { rubric, score: rubric.reduce((sum, v) => sum + v, 0), saved: true } : {}) };
        }
        safe.activeSession = { id: `resume-${Date.now()}`, track: old.track, level: 'all', questions, index: Math.max(0, Math.min(questions.length - 1, Number.isInteger(+old.index) ? +old.index : 0)), answers, started: new Date().toISOString(), revision: !!old.revision };
      }
    }
    normalizeV3(safe, input);
    return safe;
  }

  /* ───────────── storage helpers ───────────── */
  function storageStatus() {
    try {
      const probe = KEY + '.probe';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return window.__storageIssue === 'unreadable' ? 'unreadable' : 'ok';
    } catch (e) {
      return e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) ? 'full' : 'blocked';
    }
  }
  function storedEntries() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sqaPracticeRoom')) out.push({ key: k, bytes: (k.length + (localStorage.getItem(k) || '').length) * 2 });
      }
    } catch { return null; }
    return out;
  }
  function fmtBytes(n) {
    if (n < 1024) return `${n} bytes`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); } catch { return String(iso); }
  }
  // One debounced save queue; every field waiting on it hears the result.
  let pendingSave = null, pendingCallbacks = [], lastSaveFailed = false;
  function persist() {
    clearTimeout(pendingSave); pendingSave = null;
    const ok = save();
    const callbacks = pendingCallbacks; pendingCallbacks = [];
    callbacks.forEach(cb => { try { cb(ok); } catch {} });
    return ok;
  }
  function persistSoon(onDone) {
    if (onDone && !pendingCallbacks.includes(onDone)) pendingCallbacks.push(onDone);
    clearTimeout(pendingSave);
    pendingSave = setTimeout(persist, 500);
  }
  function flushPending() { if (pendingSave) persist(); }
  function effectiveStatus() {
    const status = storageStatus();
    return status === 'ok' && lastSaveFailed ? 'full' : status;
  }

  function updateStorageBanner() {
    const el = $('storageBanner');
    if (!el) return;
    const status = effectiveStatus();
    const messages = {
      blocked: '<b>This browser is not saving site data.</b> You can keep practising, but your progress will be lost when this tab closes. Allow site data for this site in your browser settings, or export a backup before leaving.',
      full: '<b>Browser storage for this site is full.</b> Recent changes may not be saved. Export a backup, then free space in Profile &amp; data.',
      unreadable: `<b>Your earlier saved progress could not be read</b>, so a fresh start was loaded. A copy of the unreadable data was kept in this browser under “${esc(UNREADABLE)}”.`
    };
    if (status === 'ok' || el.dataset.dismissed === status) { el.hidden = true; return; }
    el.innerHTML = `<p>${messages[status]}</p><div><button class="button small outline" type="button" data-goto-settings>Profile &amp; data</button><button class="quiet" type="button" data-dismiss-banner="${status}" aria-label="Dismiss storage message">Dismiss</button></div>`;
    el.hidden = false;
  }

  /* ───────────── in-page dialog (no native alert/confirm) ───────────── */
  function dialog({ title, body, actions, confirmCheck }) {
    const d = $('appDialog');
    return new Promise(resolve => {
      const opener = document.activeElement;
      if (!d || typeof d.showModal !== 'function') {
        const tmp = document.createElement('div'); tmp.innerHTML = body;
        const primary = actions.find(a => a.kind === 'primary' || a.kind === 'danger');
        resolve(window.confirm(`${title}\n\n${tmp.textContent.trim()}`) && primary ? primary.value : 'cancel');
        return;
      }
      $('appDialogTitle').textContent = title;
      $('appDialogBody').innerHTML = body + (confirmCheck ? `<label class="dlg-check"><input type="checkbox" id="dlgCheck"> <span>${esc(confirmCheck)}</span></label>` : '');
      const box = $('appDialogActions');
      box.innerHTML = actions.map((a, i) => {
        const cls = a.kind === 'quiet' ? 'quiet' : `button small${a.kind === 'danger' ? ' danger-button' : a.kind === 'primary' ? '' : ' outline'}`;
        return `<button type="button" class="${cls}" data-dlg="${i}"${a.needsCheck ? ' disabled' : ''}>${esc(a.label)}</button>`;
      }).join('');
      const check = $('dlgCheck');
      if (check) check.addEventListener('change', () => box.querySelectorAll('button').forEach((b, i) => { if (actions[i].needsCheck) b.disabled = !check.checked; }));
      let settled = false;
      const finish = value => {
        if (settled) return; settled = true;
        box.removeEventListener('click', onClick); d.removeEventListener('cancel', onCancel);
        if (d.open) d.close();
        if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
        resolve(value);
      };
      const onClick = e => {
        const b = e.target.closest('[data-dlg]'); if (!b) return;
        const a = actions[Number(b.dataset.dlg)];
        if (a.keepOpen) { a.onClick?.(); return; }
        finish(a.value);
      };
      const onCancel = e => { e.preventDefault(); finish('cancel'); };
      box.addEventListener('click', onClick); d.addEventListener('cancel', onCancel);
      d.showModal();
      const safe = actions.findIndex(a => a.kind === 'quiet' || a.value === 'cancel');
      (box.querySelectorAll('button')[safe >= 0 ? safe : 0] || box).focus();
    });
  }

  /* ───────────── derived learning data ───────────── */
  const STATUS_TEXT = { complete: 'Complete', progress: 'In progress', new: 'Not started' };
  const statusHtml = k => `<span class="lh-dot" aria-hidden="true"></span>${STATUS_TEXT[k]}`;
  function stageState(s) {
    const l = ld(), q = l.quiz[s.id] || {};
    const done = l.completed.includes(s.id);
    const correct = s.quiz.filter((_, i) => q[i] && q[i].correct).length;
    const started = done || l.visited[s.id] || Object.keys(q).length > 0 || !!l.notes[s.id] || l.taskDone[s.id] || Object.keys(l.code).some(k => k.startsWith(s.id + ':'));
    return { done, correct, total: s.quiz.length, review: !!l.review[s.id], status: done ? 'complete' : started ? 'progress' : 'new' };
  }
  const pace = () => L.paces.find(p => p.id === ld().pace) || L.paces[1];
  function weeksAtPace(s) {
    const p = pace();
    if (p.id === 'base') return `${s.weeks} at the roadmap baseline`;
    const lo = Math.max(1, Math.round(s.hours[0] / p.hi)), hi = Math.max(lo, Math.ceil(s.hours[1] / p.lo));
    return `≈ ${lo === hi ? lo : `${lo}–${hi}`} weeks at ${p.label}`;
  }
  function stepDone(s, i) {
    const l = ld(), st = stageState(s);
    if (i <= 2) return (l.seen[s.id] ?? 0) > i;
    if (i === 3) return !!l.taskDone[s.id];
    if (i === 4) return st.correct === st.total;
    return st.done;
  }
  function challengeTitle(id) { return challengeData.find(c => c.id === id)?.title || id; }
  function relatedStatus(s) {
    const bits = [];
    const cid = s.task.challenge;
    if (cid) {
      const draft = state.workspaceDrafts?.[cid];
      const subs = (state.submissions || []).filter(x => x.challengeId === cid);
      const best = subs.length ? Math.max(...subs.map(x => +x.score || 0)) : null;
      bits.push(`<li><b>${esc(challengeTitle(cid))}:</b> ${draft ? `draft saved ${esc(fmtDate(draft.updatedAt))}` : 'no draft yet'}${subs.length ? ` · ${subs.length} submission${subs.length > 1 ? 's' : ''}, best ${best}/100` : ''}</li>`);
    }
    const lab = s.task.lab;
    if (lab) {
      const n = +(state.labAttempts?.[lab] || 0);
      bits.push(`<li><b>${esc(LABS[lab])}:</b> ${n ? `${n} recorded check${n > 1 ? 's' : ''}` : 'no recorded checks yet'}</li>`);
    }
    return bits.length ? `<ul class="lh-related">${bits.join('')}</ul>` : '';
  }

  /* ───────────── learning path overview ───────────── */
  function meter(pct, label, small) {
    return `<div class="lh-meter${small ? ' small' : ''}" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>`;
  }
  function nextStage() { return STAGES.find(s => !ld().completed.includes(s.id)); }
  function primaryAction(cls) {
    const l = ld(), active = STAGES.find(s => s.id === l.active && !l.completed.includes(s.id)), next = nextStage();
    const target = active || next;
    if (!target) return '';
    const verb = active ? 'Resume' : l.completed.length ? 'Continue with' : 'Start';
    return `<button class="button ${cls}" type="button" data-open-stage="${target.id}">${verb} Stage ${stageNo(target)}: ${esc(target.title)}${icon('arrow-right','ic-sm flip-rtl')}</button>`;
  }
  const LADDER = [
    { icon: 'sprout', title: 'Learner', when: 'Stages 1–4', text: 'Fundamentals, test design, bug reports, web basics, first API and SQL checks, a small portfolio.' },
    { icon: 'user', title: 'Junior QA / QA Analyst', when: 'Typically 0–2 years', text: 'Designs and runs tests for features, writes reproducible bugs, verifies APIs and data, joins sprint ceremonies.' },
    { icon: 'shield', title: 'QA Engineer', when: 'Typically 2–4 years', text: 'Owns feature quality end to end, plans by risk, automates useful checks and keeps CI healthy.' },
    { icon: 'rocket', title: 'Senior QA / SDET', when: 'Typically 4–7 years', text: 'Shapes test strategy and frameworks, mentors others, improves quality across teams.' },
    { icon: 'award', title: 'Lead · Architect · Manager', when: 'Typically 6+ years', text: 'Quality strategy and people leadership, or deep test architecture for many teams.' }
  ];
  const BRANCHES = [
    { icon: 'rocket', title: 'Automation / SDET', group: 'automation', skills: ['Playwright or Selenium framework design', 'API automation and contract tests', 'CI/CD pipelines and reporting'] },
    { icon: 'gauge', title: 'Performance engineering', group: 'nonfunctional', skills: ['Load, stress and soak testing', 'k6 / JMeter scripting', 'Bottleneck analysis with monitoring'] },
    { icon: 'lock', title: 'Security testing', group: 'nonfunctional', skills: ['OWASP Top 10 and access control', 'Authorised, safe test practice', 'Threat modelling basics'] },
    { icon: 'a11y', title: 'Accessibility specialist', group: 'nonfunctional', skills: ['WCAG 2.2 AA audits', 'Screen reader and keyboard testing', 'Coaching teams on inclusive UI'] },
    { icon: 'phone', title: 'Mobile QA', group: 'web-mobile', skills: ['Device and OS coverage strategy', 'Lifecycle, network and permission tests', 'Appium basics'] },
    { icon: 'users', title: 'QA Lead → QA Manager', group: 'management', skills: ['Planning, estimation and reporting', 'Release risk and go/no-go', 'Hiring, mentoring and process'] }
  ];
  function roadStop(s, i) {
    const st = stageState(s), lessons = (typeof LESSONS !== 'undefined') ? LESSONS.filter(x => x.stage === s.id) : [];
    const lDone = lessons.filter(x => state.academy && state.academy.completed[x.id]).length;
    const verb = st.status === 'complete' ? 'Review guide' : st.status === 'progress' ? 'Continue guide' : 'Open stage guide';
    const side = i % 2 ? 'right' : 'left';
    return `<li class="road-stop ${side} is-${st.status}" style="--st:var(--st-${s.id})">
      <span class="road-node" aria-hidden="true">${st.status === 'complete' ? icon('check') : stageNo(s)}</span>
      <article class="road-card">
        <div class="road-card-top"><span class="tile stage-tile">${icon((typeof STAGE_META !== 'undefined' && STAGE_META[s.id] && STAGE_META[s.id].icon) || 'flag')}</span><div><small>Stage ${stageNo(s)} · ${esc(s.weeks)}</small><h3>${esc(s.title)}</h3></div><span class="lh-status s-${st.status}">${statusHtml(st.status)}</span></div>
        <p class="road-tag">${esc(s.tagline)}</p>
        <div class="road-facts"><span>${icon('clock', 'ic-xs')}${s.hours[0]}–${s.hours[1]} h</span>${pace().id === 'base' ? '' : `<span>${icon('calendar', 'ic-xs')}${esc(weeksAtPace(s))}</span>`}<span>${icon('book', 'ic-xs')}${lDone}/${lessons.length} lessons</span></div>
        <p class="road-deliver"><span class="sr-only">Deliverable: </span>${icon('target', 'ic-xs')}${esc(s.deliver.replace(/\s*\(Visual Roadmap[^)]*\)/, ''))}</p>
        ${barHtml(lessons.length ? lDone / lessons.length * 100 : 0, `Stage ${stageNo(s)} lessons complete`, 'bar-sm stage-bar')}
        <div class="road-actions"><button class="btn btn-sm ${st.status === 'complete' ? 'btn-secondary' : 'btn-primary'}" type="button" data-open-stage="${s.id}" aria-label="${verb}: Stage ${stageNo(s)}, ${esc(s.title)}">${icon('route')}${verb}</button><button class="btn btn-ghost btn-sm" type="button" data-go="academy/stage/${s.id}">${icon('book')}Lessons</button>${st.review ? `<span class="lh-flag">${icon('rotate', 'ic-xs')}Review suggested</span>` : ''}</div>
      </article>
    </li>`;
  }
  function renderOverview() {
    const root = $('learningOverview');
    if (!root) return;
    const l = ld(), done = l.completed.length, pct = Math.round(done / STAGES.length * 100);
    const reviewStages = STAGES.filter(s => l.review[s.id]);
    const weakQ = Object.keys(state.weak || {}).filter(id => bank.some(q => q.id === id));
    const weakC = (state.challengeWeak || []).filter(id => challengeData.some(c => c.id === id));
    const p = pace();
    const reviseCount = reviewStages.length + (weakQ.length ? 1 : 0) + weakC.length;
    const hrs = STAGES.reduce((a, s) => [a[0] + s.hours[0], a[1] + s.hours[1]], [0, 0]);
    const curIdx = STAGES.findIndex(s => !l.completed.includes(s.id));
    const rhythmTotal = L.plan.rhythm.reduce((n, r) => n + parseFloat(r.hours), 0) || 10;
    const rhythmColors = ['var(--brand-2)', 'var(--info)', 'var(--gold)', 'var(--violet)'];
    const flags = { 4: { icon: 'flag', title: 'Apply for internships', text: 'Show manual testing, API checks and SQL evidence — keep learning while you apply.' }, 6: { icon: 'rocket', title: 'Junior automation ready', text: 'A maintainable suite that runs reliably from a clean checkout and in CI.' }, 8: { icon: 'trophy', title: 'Job-ready portfolio', text: 'Capstone, resume and interview practice complete.' } };
    root.innerHTML = `
<section class="road-hero">
  <div class="road-hero-copy">
    <span class="eyebrow on-dark-eyebrow">${icon('route', 'ic-sm')}Career roadmap · ${STAGES.length} stages · about 24 weeks</span>
    <h2>From first test case to your first QA job</h2>
    <p>Eight self-paced stages, each with one deliverable for your portfolio. Hours are estimates, not guarantees.</p>
    <div class="road-hero-stats"><div><b>${STAGES.length}</b><span>stages</span></div><div><b>${hrs[0]}–${hrs[1]}</b><span>hours (estimate)</span></div><div><b>${done}/${STAGES.length}</b><span>complete</span></div><div><b>${esc(p.label.replace(' a week', ''))}</b><span>your pace</span></div></div>
    <div class="lh-hero-actions">${primaryAction('light') || '<p class="lh-done-all">All eight stages are complete. Keep revising, applying and improving from feedback.</p>'}${reviseCount ? `<button class="btn btn-glass btn-sm" type="button" data-goto-revise>${icon('rotate')}Revise weak areas (${reviseCount})</button>` : ''}</div>
  </div>
  <div class="road-hero-ring ring" style="--size:168px" aria-hidden="true">${ringSvg(pct, 168, 13)}<div class="ring-label"><b>${pct}%</b><span>of the road</span></div></div>
</section>
<section class="road-section" aria-labelledby="lhStagesH">
  <div class="section-title"><div><h2 id="lhStagesH">${icon('route')} Your learning road</h2></div></div>
  <ol class="road" style="--done:${STAGES.length ? (curIdx < 0 ? 100 : (curIdx / STAGES.length) * 100) : 0}%">
    <li class="road-start" aria-hidden="true"><span>${icon('play', 'ic-sm')}Start</span></li>
    ${STAGES.map((s, i) => roadStop(s, i) + (flags[i + 1] ? `<li class="road-flag${STAGES.slice(0, i + 1).every(x => l.completed.includes(x.id)) ? ' met' : ''}"><span class="road-flag-pin">${icon(flags[i + 1].icon)}</span><div><b>${esc(flags[i + 1].title)}</b><small>${esc(flags[i + 1].text)}</small></div></li>` : '')).join('')}
  </ol>
</section>
<section class="road-section" aria-labelledby="ladderH">
  <div class="section-title"><div><h2 id="ladderH">${icon('trending')} Where QA careers go</h2><p>Typical titles — they vary by company and country.</p></div></div>
  <ol class="ladder">${LADDER.map((x, i) => `<li class="ladder-step${i === 0 ? ' now' : ''}" style="--i:${i}"><span class="ladder-icon">${icon(x.icon)}</span><small>${esc(x.when)}</small><b>${esc(x.title)}</b><p>${esc(x.text)}</p></li>`).join('')}</ol>
  <div class="branches-head">${icon('git', 'ic-sm')}Specialise as you grow</div>
  <div class="branches">${BRANCHES.map(b => `<button type="button" class="branch" data-go="academy/topic/${b.group}"><span class="tile tile-sm">${icon(b.icon)}</span><b>${esc(b.title)}</b><span class="branch-skills">${b.skills.map(esc).join(' · ')}</span><span class="branch-go">Related lessons${icon('arrow-right', 'ic-xs flip-rtl')}</span></button>`).join('')}</div>
</section>
<div class="road-grid">
  <section class="card road-panel" aria-labelledby="lhLevelsH"><div class="card-title"><h3 id="lhLevelsH">${icon('flag')} Three levels of readiness</h3></div>
    <ol class="ready-steps">${L.plan.levels.map((v, i) => { const met = STAGES.slice(0, v.after).every(s => l.completed.includes(s.id)); return `<li class="${met ? 'met' : ''}"><span class="ready-dot">${met ? icon('check', 'ic-xs') : i + 1}</span><div><b>${esc(v.label)}</b><small>after Stage ${v.after}</small><p title="${esc(v.text)}">${esc(v.text)}</p></div></li>`; }).join('')}</ol>
  </section>
  <section class="card road-panel" aria-labelledby="lhPlanH"><div class="card-title"><h3 id="lhPlanH">${icon('calendar')} A sustainable week (${rhythmTotal} hours)</h3></div>
    <div class="rhythm-bar" role="img" aria-label="${L.plan.rhythm.map(r => r.label + ' ' + r.hours).join(', ')}">${L.plan.rhythm.map((r, i) => `<span style="flex:${parseFloat(r.hours)};background:${rhythmColors[i % 4]}" title="${esc(r.label)}: ${esc(r.hours)}"></span>`).join('')}</div>
    <ul class="rhythm-legend">${L.plan.rhythm.map((r, i) => `<li><i style="background:${rhythmColors[i % 4]}"></i><b>${esc(r.hours)}</b>${esc(r.label)}</li>`).join('')}</ul>
    <h4 class="road-h4">First 30 / 60 / 90 days</h4>
    <ol class="days-tl">${L.plan.days.map(d => `<li><b>${esc(d.day)}</b><span>${esc(d.text)}</span></li>`).join('')}</ol>
  </section>
  <section class="card road-panel" aria-labelledby="lhPaceH"><div class="card-title"><h3 id="lhPaceH">${icon('clock')} Your pace</h3></div>
    <fieldset class="lh-pace"><legend class="sr-only">Study hours per week</legend>
    ${L.paces.map(x => `<label class="lh-radio"><input type="radio" name="lhPace" value="${x.id}"${x.id === p.id ? ' checked' : ''}><span><b>${esc(x.label)}</b><small>${esc(x.total)}</small></span></label>`).join('')}
    </fieldset>
  </section>
  <section class="card road-panel lh-panel" aria-labelledby="lhReviseH"><div class="card-title"><h3 id="lhReviseH">${icon('rotate')} Revise weak areas</h3></div>
    ${reviewStages.length || weakQ.length || weakC.length ? `<ul class="lh-revise">
      ${reviewStages.map(s => `<li><span>Stage ${stageNo(s)} · ${esc(s.title)} <small>a knowledge check was missed first time</small></span><button class="btn btn-ghost btn-sm" type="button" data-open-stage="${s.id}" data-step="4">Retake check${icon('arrow-right', 'ic-sm flip-rtl')}</button></li>`).join('')}
      ${weakQ.length ? `<li><span>${weakQ.length} interview answer${weakQ.length > 1 ? 's' : ''} scored below 6/8</span><button class="btn btn-ghost btn-sm" type="button" data-revise-interview>Revise${icon('arrow-right', 'ic-sm flip-rtl')}</button></li>` : ''}
      ${weakC.map(id => `<li><span>${esc(challengeTitle(id))} <small>low challenge score</small></span><button class="btn btn-ghost btn-sm" type="button" data-open-challenge="${id}">Revise${icon('arrow-right', 'ic-sm flip-rtl')}</button></li>`).join('')}
    </ul>` : '<p class="lh-empty">Nothing to revise yet — missed checks and low scores will show up here.</p>'}
  </section>
</div>
<p class="source-note">Adapted from an SQA career roadmap handbook. Hours, weeks and targets are planning estimates, not hiring guarantees.</p>`;
  }
  function stageCard(s) {
    const st = stageState(s);
    const verb = st.status === 'complete' ? 'Review lesson' : st.status === 'progress' ? 'Continue' : 'Start lesson';
    return `<li class="lh-stage is-${st.status}">
  <div class="lh-stage-top"><span class="tile tile-sm stage-tile" style="--st:var(--st-${s.id})">${icon((typeof STAGE_META !== 'undefined' && STAGE_META[s.id] && STAGE_META[s.id].icon) || 'flag')}</span><span class="lh-num">Stage ${stageNo(s)} · ${esc(s.weeks)}</span><span class="lh-status s-${st.status}">${statusHtml(st.status)}</span></div>
  <h3 class="lh-stage-title">${esc(s.title)}</h3>
  <p class="lh-tag">${esc(s.tagline)}</p>
  <p class="lh-deliver"><b>Deliver:</b> ${esc(s.deliver)}</p>
  <div class="lh-stage-meta"><span>${s.hours[0]}–${s.hours[1]} h (est.)</span><span>${esc(weeksAtPace(s))}</span><span>Checks ${st.correct}/${st.total}</span></div>
  ${st.review ? `<p class="lh-flag">${icon('rotate','ic-xs')}Review suggested</p>` : ''}
  ${s.milestone ? `<p class="lh-milestone">${icon('flag','ic-sm')}After this stage: start internship and junior manual QA applications.</p>` : ''}
  <button class="button small${st.status === 'complete' ? ' outline' : ''}" type="button" data-open-stage="${s.id}" aria-label="${verb}: Stage ${stageNo(s)}, ${esc(s.title)}">${verb}${icon('arrow-right','ic-sm flip-rtl')}</button>
</li>`;
  }

  /* ───────────── lesson detail ───────────── */
  let current = null;      // { id, step } for the open lesson
  let returnTo = null;     // lesson to return to after opening a lab, challenge or interview round

  function openStage(id, opts = {}) {
    const s = STAGES.find(x => x.id === id);
    if (!s) return;
    flushPending();
    const l = ld();
    const step = Number.isInteger(opts.step) ? opts.step : (l.step[id] || 0);
    l.active = id; l.visited[id] = true; l.step[id] = step;
    l.seen[id] = Math.max(l.seen[id] ?? 0, step);
    persist();
    current = { id, step };
    returnTo = null;
    if (!$('learning').classList.contains('active')) showScreen('learning', { keepLesson: true });
    renderLesson(s);
    $('learningOverview').hidden = true;
    $('lessonDetail').hidden = false;
    renderReturnBar('learning');
    $('learning').scrollIntoView({ behavior: behavior(), block: 'start' });
    const focusTarget = opts.step != null && opts.step > 0 ? $(`lsh-${step}`) : $('lhLessonTitle');
    focusTarget?.focus({ preventScroll: true });
  }
  function closeLesson(focusId) {
    flushPending();
    current = null;
    const detail = $('lessonDetail');
    if (detail) { detail.hidden = true; detail.innerHTML = ''; }
    $('learningOverview').hidden = false;
    renderOverview();
    if (focusId) {
      const btn = document.querySelector(`.lh-stages [data-open-stage="${focusId}"]`);
      btn?.focus({ preventScroll: true });
      btn?.closest('.lh-stage')?.scrollIntoView({ behavior: behavior(), block: 'center' });
    }
  }
  function goToStep(i, focus = true) {
    if (!current) return;
    const s = STAGES.find(x => x.id === current.id);
    i = Math.max(0, Math.min(STEPS.length - 1, i));
    flushPending();
    current.step = i;
    const l = ld();
    l.step[s.id] = i;
    l.seen[s.id] = Math.max(l.seen[s.id] ?? 0, i);
    persist();
    document.querySelectorAll('.lesson-panel').forEach((p, k) => { p.hidden = k !== i; });
    updateStepper(s);
    const pos = $('lhStepPos'); if (pos) pos.textContent = `Step ${i + 1} of ${STEPS.length}`;
    const prev = $('lhPrev'), next = $('lhNext');
    if (prev) prev.disabled = i === 0;
    if (next) { next.hidden = i === STEPS.length - 1; next.innerHTML = i < STEPS.length - 1 ? `Next: ${esc(STEPS[i + 1].label)}${icon('arrow-right','ic-sm flip-rtl')}` : ''; }
    if (i === 5) refreshCompleteBox(s);
    if (i === 3) { const r = $('lhRelated'); if (r) r.innerHTML = relatedStatus(s); }
    if (i === 2) markScrollables();
    if (focus) {
      $('lhStepper')?.scrollIntoView({ behavior: behavior(), block: 'nearest' });
      $(`lsh-${i}`)?.focus({ preventScroll: true });
    }
  }
  function updateStepper(s) {
    document.querySelectorAll('#lhStepper .lesson-step').forEach((b, i) => {
      if (i === current.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      const done = stepDone(s, i);
      b.classList.toggle('done', done);
      const mark = b.querySelector('.lesson-step-done');
      if (mark) mark.innerHTML = done ? icon('check','ic-xs') : '';
      b.setAttribute('aria-label', `Step ${i + 1}: ${STEPS[i].label}${done ? ' (done)' : ''}`);
    });
    const st = stageState(s), pill = $('lhLessonStatus');
    if (pill) { pill.className = `lh-status s-${st.status}`; pill.innerHTML = statusHtml(st.status); }
  }

  function renderLesson(s) {
    const root = $('lessonDetail'), l = ld(), st = stageState(s), i = current.step, n = stageNo(s);
    const next = STAGES[STAGES.indexOf(s) + 1];
    const panel = (k, heading, html) => `<section class="lesson-panel" id="lstep-${k}" aria-labelledby="lsh-${k}"${k !== i ? ' hidden' : ''}><h3 class="lesson-panel-h" id="lsh-${k}" tabindex="-1">${heading}</h3>${html}</section>`;
    root.innerHTML = `
<article class="lesson" aria-labelledby="lhLessonTitle">
  <div class="lesson-crumbs"><button class="quiet" type="button" id="lhBack">${icon('arrow-left','ic-sm flip-rtl')}Career roadmap</button><span aria-hidden="true">/</span><span>Stage ${n} of ${STAGES.length}</span></div>
  <header class="lesson-head">
    <div><span class="eyebrow">Stage ${n} · ${esc(s.weeks)} · ${s.hours[0]}–${s.hours[1]} hours (estimate)</span><h2 id="lhLessonTitle" tabindex="-1">${esc(s.title)}</h2><p>${esc(s.tagline)}</p></div>
    <span class="lh-status s-${st.status}" id="lhLessonStatus">${statusHtml(st.status)}</span>
  </header>
  <nav aria-label="Lesson steps"><ol class="lesson-steps" id="lhStepper">${STEPS.map((x, k) => `<li><button type="button" class="lesson-step" data-step="${k}" aria-controls="lstep-${k}"><span class="lesson-step-n" aria-hidden="true">${k + 1}</span><span class="lesson-step-l">${esc(x.label)}</span><span class="lesson-step-done" aria-hidden="true"></span></button></li>`).join('')}</ol></nav>
  <div class="lesson-panels">
    ${panel(0, 'Stage overview', overviewPanel(s))}
    ${panel(1, 'The idea in plain English', learnPanel(s))}
    ${panel(2, 'See it: visual and worked example', seePanel(s))}
    ${panel(3, 'Try it in a built-in simulation', tryPanel(s))}
    ${panel(4, 'Check your understanding', checkPanel(s))}
    ${panel(5, 'Wrap up and next steps', wrapPanel(s, next))}
  </div>
  <div class="lesson-nav"><button class="button outline small" type="button" id="lhPrev"${i === 0 ? ' disabled' : ''}>${icon('arrow-left','ic-sm flip-rtl')}Previous</button><span class="lesson-nav-pos" id="lhStepPos">Step ${i + 1} of ${STEPS.length}</span><button class="button small" type="button" id="lhNext"${i === STEPS.length - 1 ? ' hidden' : ''}>${i < STEPS.length - 1 ? `Next: ${esc(STEPS[i + 1].label)}${icon('arrow-right','ic-sm flip-rtl')}` : ''}</button></div>
</article>`;
    // User-authored text is assigned through .value — never parsed as HTML.
    const notes = $('lhNotes'); if (notes) notes.value = l.notes[s.id] || '';
    s.codes.forEach((c, k) => { const ta = $(`lc-${s.id}-${k}`); if (ta) ta.value = l.code[`${s.id}:${k}`] ?? c.text; });
    s.quiz.forEach((_, k) => paintQuiz(s, k));
    updateQuizSummary(s);
    updateStepper(s);
    refreshCompleteBox(s);
    bindLesson(s);
    markScrollables();
  }

  function overviewPanel(s) {
    const l = ld(), seen = l.seen[s.id] ?? 0;
    return `<div class="lesson-grid">
  <div class="lcard"><h4>Outcome</h4><p>${esc(s.outcome)}</p><h4>Before you start</h4><p>${esc(s.prereq)}</p><h4>What you will learn</h4><ul>${s.learn.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="lcard lcard-soft"><h4>Time estimate</h4><p><b>${s.hours[0]}–${s.hours[1]} focused hours</b> — ${esc(s.weeks)} at the roadmap baseline of 10–12 hours a week.${pace().id !== 'base' ? ` At your pace: ${esc(weeksAtPace(s))}.` : ''}</p><p class="lnote">Estimates only. Repeat weak milestones and adapt to your background and target roles.</p><h4>Roadmap deliverable</h4><p>${esc(s.deliver)}</p><h4>Ready to move on when</h4><p>${esc(s.gate)}</p></div>
</div>
<div class="lesson-start"><button class="button" type="button" data-goto-step="1">${icon('play')}${seen > 0 ? 'Continue the lesson' : 'Start the lesson'}</button><span class="lnote">Six short steps: overview → learn → see it → try it → check → wrap up. Your place is saved.</span></div>`;
  }
  function learnPanel(s) {
    return `<div class="lesson-grid wide">
  <div class="lcard prose">${s.concept.map(p => `<p>${p}</p>`).join('')}</div>
  <aside class="lcard lroman" aria-labelledby="lhRomanH"><h4 id="lhRomanH">Roman Urdu summary</h4><p lang="ur-Latn">${esc(s.roman)}</p></aside>
</div>`;
  }
  function seePanel(s) {
    const tabs = s.visuals.length > 1;
    return `<div class="lcard lvisuals">
  ${tabs ? `<div class="lv-tabs" role="tablist" aria-label="Visual guides">${s.visuals.map((v, k) => `<button type="button" role="tab" class="lv-tab" id="lvt-${s.id}-${k}" aria-controls="lvp-${s.id}-${k}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}">${esc(v.label)}</button>`).join('')}</div>` : ''}
  ${s.visuals.map((v, k) => `<figure class="lv" ${tabs ? `role="tabpanel" id="lvp-${s.id}-${k}" aria-labelledby="lvt-${s.id}-${k}"${k ? ' hidden' : ''}` : ''}><div class="lv-body">${v.html}</div><figcaption><b>${esc(v.label)}.</b> ${esc(v.caption)}</figcaption></figure>`).join('')}
</div>
<div class="lcard"><h4>Worked example · ${esc(s.example.title)}</h4><div class="prose">${s.example.html}</div></div>
${s.codes.map((c, k) => `<div class="lcard lcode">
  <div class="lcode-head"><label for="lc-${s.id}-${k}">${esc(c.label)}</label><span class="lcode-tag">Editable draft · not executed</span></div>
  <textarea id="lc-${s.id}-${k}" class="lcode-area" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off" rows="${Math.min(18, Math.max(6, c.text.split('\n').length + 1))}" aria-describedby="lcn-${s.id}-${k}"></textarea>
  <p class="lnote" id="lcn-${s.id}-${k}">${esc(c.note)}</p>
  <div class="lcode-actions"><button class="button small outline" type="button" data-review-code="${k}">Review my draft</button><button class="quiet" type="button" data-reset-code="${k}">Reset to example</button><span class="lsave" id="lcs-${s.id}-${k}" role="status" aria-live="polite"></span></div>
  <div class="lcode-review" id="lcr-${s.id}-${k}" hidden></div>
</div>`).join('')}`;
  }
  function tryPanel(s) {
    const l = ld(), t = s.task;
    return `<div class="lesson-grid">
  <div class="lcard ltask"><h4>${esc(t.title)}</h4><ol>${t.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
    <div class="ltask-actions">${t.lab ? `<button class="button small" type="button" data-open-lab="${t.lab}">${icon('flask')}Open ${esc(LABS[t.lab])}</button>` : ''}${t.challenge ? `<button class="button small${t.lab ? ' outline' : ''}" type="button" data-open-challenge="${t.challenge}">${icon('terminal')}Open challenge in the code workspace</button>` : ''}</div>
    <p class="lnote">Everything opens inside this site. A “Back to the lesson” bar brings you straight back here.</p>
    <div id="lhRelated">${relatedStatus(s)}</div>
    <label class="lcheck"><input type="checkbox" id="lhTaskDone"${l.taskDone[s.id] ? ' checked' : ''}> <span>I completed this practice task</span></label>
  </div>
  <div class="lcard"><h4><label for="lhNotes">Your notes</label></h4><p class="lnote" id="lhNotesHelp">What you tried, what you observed (expected vs actual), and one question you still have. Saved in this browser only.</p><textarea id="lhNotes" class="lnotes" rows="10" aria-describedby="lhNotesHelp lhNotesStatus" placeholder="Approach · expected · actual · question"></textarea><p class="lsave" id="lhNotesStatus" role="status" aria-live="polite">${l.notes[s.id] ? 'Notes saved in this browser.' : ''}</p></div>
</div>`;
  }
  function checkPanel(s) {
    return `<p class="lnote">Choose an answer, then select “Check answer”. You get an explanation either way, and you can try again. The interview-level question comes last.</p>
${s.quiz.map((q, k) => `<fieldset class="lq" id="lq-${s.id}-${k}"><legend><span class="lq-level">${esc(q.level)} · ${k + 1} of ${s.quiz.length}</span>${esc(q.q)}</legend>
  <div class="lq-options">${q.options.map((o, j) => `<label class="lq-opt" id="lqo-${s.id}-${k}-${j}"><input type="radio" name="lq-${s.id}-${k}" value="${j}"><span>${esc(o.t)}</span></label>`).join('')}</div>
  <div class="lq-actions"><button class="button small" type="button" data-check="${k}">Check answer</button></div>
  <div class="lq-feedback" id="lqf-${s.id}-${k}" role="status" aria-live="polite"></div>
</fieldset>`).join('')}
<div class="lq-summary"><p id="lhQuizSummary" role="status" aria-live="polite"></p><button class="button outline small" type="button" id="lhQuizRetake" hidden>Retake this check</button></div>`;
  }
  function wrapPanel(s, next) {
    const l = ld(), iv = s.next.interview;
    const items = [];
    (s.next.challenges || []).forEach(c => items.push(`<button class="lnext-item" type="button" data-open-challenge="${c}"><small>Coding challenge</small><b>${esc(challengeTitle(c))}</b></button>`));
    (s.next.labs || []).forEach(lab => items.push(`<button class="lnext-item" type="button" data-open-lab="${lab}"><small>Practice lab</small><b>${esc(LABS[lab])}</b></button>`));
    if (iv) items.push(`<button class="lnext-item" type="button" data-start-interview="${s.id}"><small>Interview practice</small><b>${iv.ids.length} ${esc(trackName(iv.track))} questions</b></button>`);
    items.push(`<button class="lnext-item" type="button" data-goto-step="4"><small>Revision</small><b>Revisit this stage’s check</b></button>`);
    return `<div class="lesson-grid">
  <div class="lcard"><h4>Common misconceptions</h4><ul class="lmyths">${s.myths.map(m => `<li><p><span class="ltag bad">${icon('x-circle','ic-xs')}Myth</span> ${esc(m.myth)}</p><p><span class="ltag ok">${icon('check-circle','ic-xs')}Better</span> ${esc(m.fact)}</p></li>`).join('')}</ul>
    <h4>Tips</h4><ul>${s.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="lcard"><h4>Evidence to save for your portfolio</h4><ul class="levidence">${s.evidence.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <h4>Ready to move on when</h4><p class="lgate">${esc(s.gate)}</p>
    ${s.milestone ? `<p class="lh-milestone">${icon('flag','ic-sm')}${esc(s.milestone)}</p>` : ''}
    ${s.readiness ? `<fieldset class="lready"><legend>Ready to apply when you can…</legend>${s.readiness.map((r, k) => `<label class="lcheck"><input type="checkbox" data-ready="${k}"${l.readiness.includes(k) ? ' checked' : ''}> <span>${esc(r)}</span></label>`).join('')}<p class="lnote">Job path: portfolio → one-page resume + LinkedIn → targeted junior QA / internship applications → mock interviews → improve from feedback.</p></fieldset>` : ''}
  </div>
</div>
<div class="lcard"><h4>Next steps</h4><div class="lnext">${items.join('')}</div></div>
<div class="lcard lcomplete" id="lhCompleteBox" tabindex="-1"></div>
<p class="source-note">Source: ${esc(s.source)}${next ? '' : ' Timelines are planning estimates, not hiring guarantees.'}</p>`;
  }

  /* A visual that must scroll sideways becomes a focusable, labelled region so it can be scrolled by keyboard. */
  function markScrollables() {
    document.querySelectorAll('#lessonDetail .lv-body').forEach(b => {
      const fig = b.closest('figure');
      if (!fig || fig.hidden) return;
      if (b.scrollWidth > b.clientWidth + 1) {
        b.tabIndex = 0; b.setAttribute('role', 'region');
        b.setAttribute('aria-label', `${fig.querySelector('figcaption b')?.textContent.replace(/\.$/, '') || 'Visual'} — scroll sideways to see all of it`);
      } else { b.removeAttribute('tabindex'); b.removeAttribute('role'); b.removeAttribute('aria-label'); }
    });
  }
  window.addEventListener('resize', () => { clearTimeout(markScrollables.t); markScrollables.t = setTimeout(markScrollables, 150); });

  /* quiz */
  function paintQuiz(s, k) {
    const fs = $(`lq-${s.id}-${k}`); if (!fs) return;
    const q = s.quiz[k], a = (ld().quiz[s.id] || {})[k];
    const fb = $(`lqf-${s.id}-${k}`), btn = fs.querySelector('[data-check]');
    fs.querySelectorAll('.lq-opt').forEach((lab, j) => {
      lab.classList.remove('is-right', 'is-wrong');
      const input = lab.querySelector('input');
      input.disabled = !!(a && a.correct);
      if (a && j === a.choice) { input.checked = true; lab.classList.add(a.correct ? 'is-right' : 'is-wrong'); }
    });
    if (!a) { fb.className = 'lq-feedback'; fb.innerHTML = ''; btn.disabled = false; btn.textContent = 'Check answer'; return; }
    if (a.correct) {
      fb.className = 'lq-feedback ok';
      fb.innerHTML = `<b>${icon('check-circle','ic-sm')}Correct.</b> ${esc(q.options[a.choice].why)}${a.firstTry ? '' : ' <span class="lq-note">(Saved for revision because the first try missed.)</span>'}`;
      btn.disabled = true; btn.innerHTML = `${icon('check','ic-sm')}Answered`;
    } else {
      fb.className = 'lq-feedback bad';
      const reveal = a.attempts >= 2 ? ` <span class="lq-reveal">The best answer is “${esc(q.options[q.correct].t)}” — ${esc(q.options[q.correct].why)} Select it to finish this check.</span>` : ' Try another option.';
      fb.innerHTML = `<b>${icon('x-circle','ic-sm')}Not quite.</b> ${esc(q.options[a.choice].why)}${reveal}`;
      btn.disabled = false; btn.textContent = 'Check answer';
    }
  }
  function checkAnswer(s, k) {
    const fs = $(`lq-${s.id}-${k}`), sel = fs?.querySelector('input:checked'), fb = $(`lqf-${s.id}-${k}`);
    if (!sel) { fb.className = 'lq-feedback warn'; fb.textContent = 'Choose an answer first.'; return; }
    const l = ld(), q = s.quiz[k], answers = l.quiz[s.id] || (l.quiz[s.id] = {}), prev = answers[k];
    if (prev && prev.correct) return;
    const choice = Number(sel.value), attempts = (prev ? prev.attempts : 0) + 1, correct = choice === q.correct;
    answers[k] = { choice, correct, attempts, firstTry: correct && attempts === 1 };
    if (!correct) l.review[s.id] = true;
    else if (s.quiz.every((_, j) => answers[j] && answers[j].correct && answers[j].firstTry)) delete l.review[s.id];
    if (!state.days.includes(today())) state.days.push(today());
    persist();
    paintQuiz(s, k);
    updateQuizSummary(s);
    updateStepper(s);
  }
  function updateQuizSummary(s) {
    const st = stageState(s), answers = ld().quiz[s.id] || {}, el = $('lhQuizSummary'), retake = $('lhQuizRetake');
    if (!el) return;
    const answered = s.quiz.filter((_, k) => answers[k]).length;
    el.textContent = st.correct === st.total
      ? `All ${st.total} checks answered correctly.${st.review ? ' This stage is in your revision list because a first try missed — retake the check later to clear it.' : ''}`
      : `${st.correct} of ${st.total} checks answered correctly${answered > st.correct ? '; keep going on the ones marked “Not quite”' : ''}.`;
    if (retake) retake.hidden = answered === 0;
  }

  /* completion */
  function refreshCompleteBox(s) {
    const box = $('lhCompleteBox'); if (!box) return;
    const l = ld(), st = stageState(s), next = STAGES[STAGES.indexOf(s) + 1];
    if (st.done) {
      box.innerHTML = `<h4>${icon('check-circle')}Stage ${stageNo(s)} complete</h4><p>Completed ${l.completedAt[s.id] ? esc(fmtDate(l.completedAt[s.id])) : ''} and saved in this browser.${st.review ? ' A missed first try keeps it in your revision list.' : ''}</p>
<div class="lcomplete-actions">${next ? `<button class="button small" type="button" data-open-stage="${next.id}" data-step="0">Next: Stage ${stageNo(next)} · ${esc(next.title)}${icon('arrow-right','ic-sm flip-rtl')}</button>` : '<span class="lnote">You have finished the last stage. Keep your portfolio current and keep practising interviews.</span>'}<button class="button small outline" type="button" data-back-path>Back to the learning path</button><button class="quiet" type="button" id="lhUncomplete">Mark as not complete</button></div>`;
    } else {
      const notes = !!l.notes[s.id], task = !!l.taskDone[s.id];
      box.innerHTML = `<h4>Complete this stage</h4>
<ul class="lreq"><li class="${st.correct === st.total ? 'ok' : 'todo'}">${icon(st.correct === st.total ? 'check-circle' : 'circle', 'ic-sm')} Knowledge check: ${st.correct} of ${st.total} correct <small>(required)</small></li>
<li class="${task ? 'ok' : 'todo'}">${icon(task ? 'check-circle' : 'circle', 'ic-sm')} Practice task marked done <small>(recommended)</small></li>
<li class="${notes ? 'ok' : 'todo'}">${icon(notes ? 'check-circle' : 'circle', 'ic-sm')} Notes saved <small>(recommended)</small></li></ul>
<div class="lcomplete-actions"><button class="button small" type="button" id="lhComplete">Mark stage complete</button>${st.correct < st.total ? `<button class="quiet" type="button" data-goto-step="4">Go to the check${icon('arrow-right','ic-sm flip-rtl')}</button>` : ''}</div>
<p class="lsave" id="lhCompleteMsg" role="status" aria-live="polite"></p>`;
    }
  }
  function completeStage(s) {
    const st = stageState(s), msg = $('lhCompleteMsg');
    if (st.correct < st.total) { if (msg) msg.textContent = `Answer all ${st.total} knowledge checks correctly first — ${st.correct} done so far.`; return; }
    const l = ld();
    if (!l.completed.includes(s.id)) l.completed.push(s.id);
    l.completedAt[s.id] = new Date().toISOString();
    if (!state.days.includes(today())) state.days.push(today());
    const ok = persist();
    refreshCompleteBox(s); updateStepper(s);
    $('lhCompleteBox')?.focus({ preventScroll: true });
    toast(ok ? `Stage ${stageNo(s)} complete — saved in this browser.` : `Stage ${stageNo(s)} marked complete for now, but this browser did not save it.`);
  }

  /* editable examples */
  function reviewCode(s, k) {
    const c = s.codes[k], ta = $(`lc-${s.id}-${k}`), out = $(`lcr-${s.id}-${k}`);
    const src = ta.value;
    const results = c.checks.map(ch => ({ label: ch.label, pass: ch.invert ? !ch.re.test(src) : ch.re.test(src) }));
    const met = results.filter(r => r.pass).length;
    out.hidden = false;
    out.innerHTML = `<p><b>${met} of ${results.length} pattern checks met.</b> This is a text review of your draft — the code was not run.</p><ul>${results.map(r => `<li class="${r.pass ? 'ok' : 'todo'}">${icon(r.pass ? 'check-circle' : 'circle', 'ic-sm')} ${esc(r.label)}</li>`).join('')}</ul>`;
  }

  /* ───────────── leaving a lesson for a lab, challenge or interview round ───────────── */
  function leaveTo(fn) {
    flushPending();
    returnTo = current ? { ...current } : null;
    fn();
  }
  function openLab(lab) {
    if (!LABS[lab] || !$(`lab-${lab}`)) { toast('That practice lab is not available.'); return; }
    leaveTo(() => {
      document.querySelectorAll('.lab-tab').forEach(x => x.classList.toggle('active', x.dataset.lab === lab));
      document.querySelectorAll('.lab-panel').forEach(x => x.classList.toggle('active', x.id === `lab-${lab}`));
      showScreen('lab');
    });
  }
  function openChallenge(id) {
    if (!challengeData.some(c => c.id === id)) { toast('That challenge is not available.'); return; }
    leaveTo(() => beginChallenge(id));
  }
  async function startInterview(s) {
    const iv = s.next.interview;
    const questions = iv.ids.map(id => bank.find(q => q.id === id)).filter(q => q && q.track === iv.track);
    if (!questions.length) { toast('Those interview questions are not available.'); return; }
    if (session && Array.isArray(session.questions) && Object.values(session.answers || {}).some(a => (a.text || '').trim() || a.saved)) {
      const choice = await dialog({
        title: 'You have an interview round in progress',
        body: `<p>${esc(trackName(session.track))} · question ${session.index + 1} of ${session.questions.length}. Starting this lesson’s questions replaces that unfinished round. Answer scores you already saved stay in your progress.</p>`,
        actions: [{ label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Resume my round', value: 'resume', kind: 'outline' }, { label: 'Start lesson questions', value: 'start', kind: 'primary' }]
      });
      if (choice === 'resume') { leaveTo(() => { renderPractice(); showScreen('practice'); }); return; }
      if (choice !== 'start') return;
    }
    leaveTo(() => {
      session = { id: 's' + Date.now(), track: iv.track, revision: false, level: 'all', questions, index: 0, answers: {}, started: new Date().toISOString() };
      state.lastTrack = iv.track; showAnswer = false; showHint = false;
      $('practiceTitle').textContent = `Lesson practice · Stage ${stageNo(s)}: ${s.title}`;
      $('practiceSub').textContent = `${trackName(iv.track)} · Try the answer first, then compare it with the model answer and scorecard.`;
      renderPractice(); showScreen('practice');
      state.activeSession = session; persist();
    });
  }
  function renderReturnBar(screenId) {
    const bar = $('lessonReturn'); if (!bar) return;
    const s = returnTo && STAGES.find(x => x.id === returnTo.id);
    if (!s || screenId === 'learning') { bar.hidden = true; bar.innerHTML = ''; return; }
    bar.innerHTML = `<span>${icon('route','ic-sm')}From <b>Stage ${stageNo(s)} · ${esc(s.title)}</b> — your place is saved.</span><div><button class="button small outline" type="button" data-return-lesson>${icon('arrow-left','ic-sm flip-rtl')}Back to the lesson</button><button class="quiet" type="button" data-dismiss-return aria-label="Dismiss the back-to-lesson bar">Dismiss</button></div>`;
    bar.hidden = false;
  }

  /* ───────────── dashboard and progress panels ───────────── */
  function renderLearningHome() {
    const root = $('learningHomePanel'); if (!root) return;
    const l = ld(), done = l.completed.length, pct = Math.round(done / STAGES.length * 100);
    const active = STAGES.find(s => s.id === l.active && !l.completed.includes(s.id)) || nextStage();
    const review = STAGES.filter(s => l.review[s.id]);
    root.innerHTML = `<section class="lh-home" aria-labelledby="lhHomeH">
  <div class="lh-home-main"><span class="eyebrow">Your learning path</span>
    <h2 id="lhHomeH">${active ? `Stage ${stageNo(active)} · ${esc(active.title)}` : 'All eight stages complete'}</h2>
    <p>${done} of ${STAGES.length} stages complete${active ? ` · ${esc(active.tagline)}` : ''}</p>
    ${meter(pct, 'Learning path completion', true)}
    ${review.length ? `<p class="lh-flag">${icon('rotate','ic-xs')}Review suggested: ${review.map(s => `Stage ${stageNo(s)}`).join(', ')}</p>` : ''}
  </div>
  <div class="lh-home-actions">${primaryAction('small') || ''}<button class="button small outline" type="button" data-goto-learning>View all stages</button></div>
</section>`;
  }
  function renderLearningProgress() {
    const root = $('learningProgressPanel'); if (!root) return;
    const l = ld(), totalChecks = STAGES.reduce((n, s) => n + s.quiz.length, 0);
    const correct = STAGES.reduce((n, s) => n + stageState(s).correct, 0);
    root.innerHTML = `<div class="panel-head"><span class="tile tile-sm" data-tone="violet">${icon('route')}</span><div><h3>Career roadmap progress</h3><p class="sub">${l.completed.length}/${STAGES.length} stages · ${correct}/${totalChecks} checks correct</p></div></div>
<div class="tbl-wrap"><table class="lv-table lh-progress-table"><caption class="sr-only">Progress for each learning stage</caption><thead><tr><th scope="col">Stage</th><th scope="col">Status</th><th scope="col">Checks</th><th scope="col"><span class="sr-only">Open</span></th></tr></thead><tbody>
${STAGES.map(s => { const st = stageState(s); return `<tr><th scope="row">${stageNo(s)} · ${esc(s.title)}${st.review ? ` <small class="lh-flag-inline">${icon('rotate','ic-xs')}review</small>` : ''}</th><td><span class="lh-status s-${st.status}">${statusHtml(st.status)}</span></td><td>${st.correct}/${st.total}</td><td><button class="quiet" type="button" data-open-stage="${s.id}" aria-label="Open Stage ${stageNo(s)}, ${esc(s.title)}">Open${icon('arrow-right','ic-sm flip-rtl')}</button></td></tr>`; }).join('')}
</tbody></table></div>`;
  }

  /* ───────────── profile & data ───────────── */
  function summarize(st) {
    const lr = st.learning || defaultLearning();
    return [
      ['Interview sessions', (st.sessions || []).length],
      ['Interview answer scores', Object.keys(st.scores || {}).length],
      ['Workspace drafts', Object.keys(st.workspaceDrafts || {}).length],
      ['Challenge submissions', (st.submissions || []).length],
      ['Bug Hunt reports', (st.bugReports || []).length],
      ['Learning stages complete', `${(lr.completed || []).length} of ${STAGES.length}`],
      ['Roadmap stage notes', Object.keys(lr.notes || {}).length],
      ...summaryRowsV3(st)
    ];
  }
  function renderSettings() {
    const root = $('profileSettings'); if (!root) return;
    const head = $('settingsHead');
    if (head) head.innerHTML = '';
    const l = ld(), status = effectiveStatus(), entries = storedEntries();
    const total = entries ? entries.reduce((n, e) => n + e.bytes, 0) : null;
    const signedIn = (() => { try { return !!JSON.parse(localStorage.getItem(AUTH) || 'null'); } catch { return false; } })();
    const statusText = {
      ok: 'Saving normally in this browser.',
      blocked: 'This browser is blocking site storage. Changes last only until this tab closes.',
      full: 'Storage for this site is full. New changes may not be saved.',
      unreadable: 'Earlier saved data could not be read; a fresh start was loaded and the unreadable copy was kept.'
    }[status];
    const statusIcon = { ok: 'check-circle', blocked: 'x-circle', full: 'alert', unreadable: 'alert' }[status];
    const quizCount = Object.values(l.quiz).reduce((n, q) => n + Object.keys(q).length, 0);
    const active = STAGES.find(s => s.id === l.active);
    const ac = state.academy || {}, ib = state.interviewBank || { marks: {}, mocks: [] };
    const prof = (typeof Profiles !== 'undefined' && Profiles.active()) || { name: 'Admin' };
    const pct = total != null ? Math.min(100, Math.max(1, Math.round(total / (5 * 1024 * 1024) * 100))) : 0;
    const groups = [
      { icon: 'user', tone: '', title: 'Account & preferences', rows: [
        ['Demo sign-in session', AUTH, signedIn ? 'Username “Admin” and sign-in time only' : 'Not stored'],
        ['Theme and language preference', PREFS_KEY, 'Device-wide'],
        ['Learner profiles list (names and colours)', PROFILES_KEY, (typeof Profiles !== 'undefined' ? Profiles.all().length : 1) + ' profile(s)'],
        ['Profile details (name, role, goal, bio)', KEY, state.profile && state.profile.name ? 'Set' : 'Not set']] },
      { icon: 'book', tone: '', title: 'Learning Lab', rows: [
        ['Completed lessons (with dates)', KEY, `${Object.keys(ac.completed || {}).length} of ${LESSONS.length}`],
        ['Quiz answers, practice marks, notes, bookmarks', KEY, `${Object.keys(ac.quiz || {}).length} quizzes · ${Object.keys(ac.notes || {}).length} notes · ${(ac.bookmarks || []).length} bookmarks`]] },
      { icon: 'clipboard', tone: 'gold', title: 'Tests & drills', rows: [
        ['Test Center results and answers', KEY, (state.tests || []).length],
        ['Practice drill best scores', KEY, Object.keys(state.drills || {}).length]] },
      { icon: 'mic', tone: 'info', title: 'Interview prep', rows: [
        ['Question bank ratings and mock interview scores', KEY, `${Object.keys(ib.marks || {}).length} rated · ${(ib.mocks || []).length} mocks`],
        ['Practice round sessions', KEY, state.sessions.length],
        ['Answer scores and weak topics', KEY, `${Object.keys(state.scores).length} scores · ${Object.keys(state.weak).length} weak`],
        ['Unfinished round (answers typed so far)', KEY, state.activeSession ? 'Yes' : 'None']] },
      { icon: 'code', tone: 'violet', title: 'Labs, challenges & workspace', rows: [
        ['Code workspace drafts (code, approach, test cases)', KEY, Object.keys(state.workspaceDrafts).length],
        ['Challenge submissions with rubric scores', KEY, (state.submissions || []).length],
        ['Weak challenge topics', KEY, (state.challengeWeak || []).length],
        ['Lab check counters', KEY, Object.values(state.labAttempts || {}).reduce((n, v) => n + (+v || 0), 0)],
        ['Bug Hunt reports', KEY, (state.bugReports || []).length]] },
      { icon: 'route', tone: 'accent', title: 'Career roadmap & activity', rows: [
        ['Active days (streak)', KEY, state.days.length],
        ['Roadmap stages completed (with dates)', KEY, `${l.completed.length} of ${STAGES.length}`],
        ['Roadmap knowledge-check answers and attempts', KEY, quizCount],
        ['Roadmap notes and edited examples', KEY, `${Object.keys(l.notes).length} notes · ${Object.keys(l.code).length} examples`],
        ['Position, steps seen, task ticks, pace, readiness checklist', KEY, active ? `Last opened: Stage ${stageNo(active)} · pace ${esc(pace().label)}` : `Pace ${esc(pace().label)}`]] }
    ];
    const flow = window.QA_DIAGRAMS ? QA_DIAGRAMS.render({ t: 'flowchart', dir: 'right', nodes: [
      { id: 'you', label: 'You learn and practise', kind: 'start' }, { id: 'app', label: 'Qadence runs in this browser' }, { id: 'ls', label: 'Saved in local storage on this device', kind: 'io' },
      { id: 'q', label: 'Want a copy?', kind: 'decision' }, { id: 'file', label: 'JSON backup file you download', kind: 'end' }, { id: 'stay', label: 'Stays only here — no server', kind: 'end' }],
      edges: [{ from: 'you', to: 'app' }, { from: 'app', to: 'ls' }, { from: 'ls', to: 'q' }, { from: 'q', to: 'file', label: 'Export' }, { from: 'q', to: 'stay', label: 'No' }],
      caption: '' }) : '';
    const n = v => `<b class="tnum">${v}</b>`;
    const tiles = [
      { icon: 'book', tone: '', label: 'Learning Lab', value: `${Object.keys(ac.completed || {}).length}<small>/${LESSONS.length}</small>`, sub: `lessons · ${Object.keys(ac.notes || {}).length} notes` },
      { icon: 'clipboard', tone: 'gold', label: 'Tests & drills', value: (state.tests || []).length, sub: `results · ${Object.keys(state.drills || {}).length} drills` },
      { icon: 'mic', tone: 'info', label: 'Interview prep', value: Object.keys(ib.marks || {}).length, sub: `rated · ${(ib.mocks || []).length} mocks · ${state.sessions.length} rounds` },
      { icon: 'code', tone: 'violet', label: 'Labs & code', value: Object.keys(state.workspaceDrafts).length, sub: `drafts · ${(state.submissions || []).length} submissions` },
      { icon: 'route', tone: 'accent', label: 'Career roadmap', value: `${l.completed.length}<small>/${STAGES.length}</small>`, sub: `stages · ${state.days.length} active days` },
      { icon: 'user', tone: '', label: 'Account', value: (typeof Profiles !== 'undefined' ? Profiles.all().length : 1), sub: 'profiles · no password' }
    ];
    const qa = (ic, q, a, extra) => `<details class="acc"><summary>${icon(ic)}<span>${q}</span>${icon('chevron-down', 'chev')}</summary><div class="acc-body">${a}${extra || ''}</div></details>`;
    root.innerHTML = `
<div class="page-head priv-head">
  <div><span class="eyebrow">${icon('shield', 'ic-sm')}${esc(t('nav.groupYou'))}</span><h1>${esc(t('settings.title'))}</h1><p>Your progress is saved only in this browser — profile “${esc(prof.name)}”.</p></div>
  <div class="priv-status" data-status="${status}" role="status">${icon(statusIcon, 'ic-sm')}<span>${statusText}</span></div>
</div>
<section class="card priv-summary" aria-label="Storage">
  <div class="priv-meter">
    <span class="tile">${icon('database')}</span>
    <div><b class="tnum">${total != null ? fmtBytes(total) : '—'}</b><span>of ~5 MB used${state.savedAt ? ` · saved ${esc(fmtDate(state.savedAt))}` : ''}</span>${barHtml(pct, 'Browser storage used', 'bar-sm')}</div>
  </div>
  <ul class="priv-chips">
    <li>${icon('monitor', 'ic-sm')}Only on this device</li>
    <li>${icon('key', 'ic-sm')}No passwords stored</li>
    <li>${icon('x-circle', 'ic-sm')}No sync or uploads</li>
  </ul>
</section>
<div class="data-actions" aria-label="Manage your data">
  <div class="card data-action"><span class="tile">${icon('download')}</span><div><h2>Export</h2><p>Download a JSON backup. Never includes the password.</p></div><button class="btn btn-primary btn-sm" type="button" id="profileExport">${icon('download')}<span>Export data</span></button></div>
  <div class="card data-action"><span class="tile" data-tone="info">${icon('upload')}</span><div><h2>Import</h2><p>Restore a backup. You confirm before anything changes.</p></div><button class="btn btn-secondary btn-sm" type="button" id="profileImport">${icon('upload')}<span>Import backup…</span></button><input type="file" id="profileImportFile" accept="application/json,.json" hidden></div>
  <div class="card data-action danger"><span class="tile" data-tone="danger">${icon('trash')}</span><div><h2>Reset</h2><p>Erase this profile’s practice data from this browser.</p></div><button class="btn btn-danger btn-sm" type="button" id="profileReset">${icon('trash')}<span>Erase data…</span></button></div>
</div>
<p class="data-status" id="dataStatus" role="status" aria-live="polite"></p>
<div class="data-error" id="dataError" role="alert"></div>
<div class="section-title"><div><h2>What’s saved</h2></div></div>
<div class="grid g-3 priv-tiles">${tiles.map(x => `<div class="card stat-card"><span class="tile"${x.tone ? ` data-tone="${x.tone}"` : ''}>${icon(x.icon)}</span><div><small class="priv-tile-label">${esc(x.label)}</small>${n(x.value)}<span>${x.sub}</span></div></div>`).join('')}</div>
<details class="acc priv-tech"><summary>${icon('list')}<span>Full list of saved records and storage keys</span>${icon('chevron-down', 'chev')}</summary><div class="acc-body">
  <div class="tbl-wrap"><table class="tbl"><caption class="sr-only">Saved practice records, their storage key and current amount</caption><thead><tr><th scope="col">Record</th><th scope="col">Browser storage key</th><th scope="col">Now saved</th></tr></thead><tbody>
  ${groups.flatMap(g => g.rows).map(([a, k, v]) => `<tr><th scope="row">${esc(a)}</th><td><code>${esc(k)}</code></td><td>${v}</td></tr>`).join('')}
  </tbody></table></div>
  ${entries ? `<p class="help" style="margin-top:12px">Keys present now: ${entries.map(e => `<code>${esc(e.key)}</code> (${fmtBytes(e.bytes)})`).join(', ') || 'none'}.</p>` : ''}
</div></details>
<div class="section-title"><div><h2>Questions</h2></div></div>
<div class="accordion priv-faq">
  ${qa('users', 'Who can see this data?', 'Anyone who uses this browser profile, including every learner profile on it. The Admin login is a shared public demo, not real security.')}
  ${qa('clock', 'How long does it last?', 'Until you erase it here or <b>clear this site’s data</b> in your browser — that deletes it for good unless you exported a backup. Private windows discard it on close. Signing out keeps it.')}
  ${qa('monitor', 'Can I use it on another device?', 'There is no sync. Export a backup here and import it on the other browser.')}
  ${qa('code', 'Is my code run or uploaded?', 'Only when you press Run, and only inside an isolated sandbox in this browser with no network access. Nothing is uploaded; drafts stay here and submissions are scored with a transparent rubric.')}
  ${qa('route', 'How does my data flow?', 'No server, no analytics, no sync — the only copy you can make is an export.', `<div class="priv-flow">${flow}</div>`)}
</div>`;
  }
  function dataStatus(msg) { const el = $('dataStatus'); if (el) el.textContent = msg; const er = $('dataError'); if (er) er.textContent = ''; }
  function dataError(msg) { const el = $('dataError'); if (el) el.textContent = msg; const ok = $('dataStatus'); if (ok) ok.textContent = ''; }

  const STATE_KEYS = () => [...Object.keys(EMPTY_STATE), 'learning', 'schemaVersion', 'savedAt'];
  function buildBackup() {
    flushPending();
    const copy = {};
    for (const k of STATE_KEYS()) if (state[k] !== undefined) copy[k] = state[k];
    return { format: 'sqa-practice-room-backup', version: 3, app: 'Qadence', exportedAt: new Date().toISOString(), note: 'Practice data from one browser profile. It contains no password or sign-in session. Review notes and code before sharing.', state: JSON.parse(JSON.stringify(copy)) };
  }
  function exportPracticeData() {
    try {
      const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `qadence-backup-${today()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      dataStatus(`Backup downloaded (${fmtBytes(blob.size)}). It contains your notes and code, so review it before sharing.`);
      toast('Backup downloaded.');
      return true;
    } catch (e) {
      dataError('The backup could not be created in this browser.');
      return false;
    }
  }
  function parseBackup(text) {
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('This file is not valid JSON, so it is not a backup from this site.'); }
    if (!isObj(data)) throw new Error('This file does not contain practice data.');
    let src = null;
    if (data.format === 'sqa-practice-room-backup') {
      if (!(data.version === 1 || data.version === 2 || data.version === 3)) throw new Error('This backup was made by a newer or unknown version of the site.');
      src = data.state;
    } else if (isObj(data.progress) && Array.isArray(data.progress.sessions)) src = data.progress;      // older “Export submissions” file
    else if (Array.isArray(data.sessions)) src = data;                                                   // older “Download my progress” file
    if (!isObj(src) || !Array.isArray(src.sessions)) throw new Error('This file is not a Qadence backup. Choose a file named like “qadence-backup-….json” (older “sqa-practice-room-backup-….json” files work too).');
    return { next: normalizeImportedState(src), exportedAt: typeof data.exportedAt === 'string' && Number.isFinite(Date.parse(data.exportedAt)) ? data.exportedAt : null };
  }
  async function importBackupText(text) {
    let parsed;
    try { parsed = parseBackup(text); } catch (e) { dataError(`${e.message} Your current data was not changed.`); return 'invalid'; }
    const now = summarize(state), incoming = summarize(parsed.next);
    const choice = await dialog({
      title: 'Restore this backup?',
      body: `<p>Restoring <b>replaces</b> the practice data saved in this browser${parsed.exportedAt ? ` with the backup from ${esc(fmtDate(parsed.exportedAt))}` : ''}. Your demo sign-in is not affected.</p>
<table class="lv-table dlg-table"><caption class="sr-only">Current data compared with the backup</caption><thead><tr><th scope="col">Record</th><th scope="col">In this browser</th><th scope="col">In the backup</th></tr></thead><tbody>${now.map(([label, v], i) => `<tr><th scope="row">${esc(label)}</th><td>${esc(v)}</td><td>${esc(incoming[i][1])}</td></tr>`).join('')}</tbody></table>
<p class="lnote">Want to keep what is here now? Download it first.</p>`,
      actions: [{ label: 'Download current data first', kind: 'outline', keepOpen: true, onClick: exportPracticeData }, { label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Replace with backup', value: 'replace', kind: 'primary' }]
    });
    if (choice !== 'replace') { dataStatus('Import cancelled. Nothing was changed.'); return 'cancelled'; }
    const prevState = state, prevSession = session;
    state = parsed.next; session = state.activeSession || null;
    ensureState();
    if (!persist()) {
      state = prevState; session = prevSession;
      afterDataChange();
      dataError('The backup could not be saved — browser storage may be blocked or full. Your previous data is still in place.');
      return 'failed';
    }
    afterDataChange();
    dataStatus('Backup restored. Your learning path, practice history and drafts now match the backup.');
    toast('Backup restored in this browser.');
    return 'restored';
  }
  async function handleImportFile(file) {
    if (!file) return 'none';
    if (file.size > MAX_IMPORT_BYTES) { dataError('That file is larger than 5 MB, so it is not a backup from this site. Your current data was not changed.'); return 'invalid'; }
    let text;
    try { text = await file.text(); } catch { dataError('The file could not be read. Try choosing it again. Your current data was not changed.'); return 'invalid'; }
    return importBackupText(text);
  }
  async function requestPracticeReset() {
    const choice = await dialog({
      title: 'Erase practice data from this browser?',
      body: `<p>This permanently deletes, for the active learner profile in this browser: Learning Lab progress, quiz answers and notes; test results; drill scores; interview sessions, scores and weak topics; workspace drafts and submissions; lab counters and bug reports; and roadmap progress.</p><p>Your demo sign-in and your profile name and preferences stay. Nothing outside this site’s practice records is touched. This cannot be undone unless you have a backup.</p>`,
      confirmCheck: 'I understand this cannot be undone',
      actions: [{ label: 'Download a backup first', kind: 'outline', keepOpen: true, onClick: exportPracticeData }, { label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Erase practice data', value: 'erase', kind: 'danger', needsCheck: true }]
    });
    if (choice !== 'erase') { dataStatus('Reset cancelled. Nothing was changed.'); return 'cancelled'; }
    try { localStorage.removeItem(KEY); localStorage.removeItem(UNREADABLE); }
    catch { dataError('This browser blocked storage access, so saved data could not be erased here. Clear this site’s data in your browser settings instead.'); return 'failed'; }
    window.__storageIssue = null;
    const banner = $('storageBanner'); if (banner) delete banner.dataset.dismissed;
    const keepProfile = state.profile;
    state = freshState(); session = null;
    state.profile = keepProfile;
    ensureState();
    persist();
    afterDataChange();
    dataStatus('Practice data erased from this browser. You are starting fresh.');
    toast('Local practice data erased.');
    return 'erased';
  }
  function afterDataChange() {
    current = null; returnTo = null;
    const detail = $('lessonDetail'); if (detail) { detail.hidden = true; detail.innerHTML = ''; }
    const ov = $('learningOverview'); if (ov) ov.hidden = false;
    // Refill the workspace editors so stale text cannot overwrite restored drafts.
    try {
      const d = state.workspaceDrafts[activeChallenge.id];
      $('scriptEditor').value = d?.code || defaultScript($('frameworkSelect').value);
      $('approachEditor').value = d?.approach || '';
      $('testCasesEditor').value = d?.testCases || '';
      $('draftState').textContent = d?.updatedAt ? `Draft saved ${new Date(d.updatedAt).toLocaleString()}` : 'New draft';
    } catch {}
    renderHome(); renderOverview(); renderHistory(); renderSubmissions(); renderSettings(); renderReturnBar(activeScreen());
    if (activeScreen() === 'practice') { if (session) renderPractice(); else showScreen('home'); }
    updateStorageBanner();
    if (window.QA && QA.afterDataChange) QA.afterDataChange();
  }
  const activeScreen = () => document.querySelector('.screen.active')?.id || 'home';

  /* ───────────── wrap the main app's functions ───────────── */
  const baseShowScreen = showScreen;
  showScreen = function (id, opts) {
    flushPending();
    baseShowScreen(id, opts);
    if (id === 'learning' && !(opts && opts.keepLesson)) closeLesson();
    if (id === 'settings') renderSettings();
    if (id === 'progress') renderLearningProgress();
    renderReturnBar(id);
  };
  const baseRenderHome = renderHome;
  renderHome = function () { baseRenderHome(); renderLearningHome(); };
  const baseRenderHistory = renderHistory;
  renderHistory = function () { baseRenderHistory(); renderLearningProgress(); };
  const baseSave = save;
  save = function () {
    const ok = baseSave();
    const banner = $('storageBanner');
    const changed = lastSaveFailed !== !ok;
    lastSaveFailed = !ok;
    if (changed || !ok || (banner && !banner.hidden)) updateStorageBanner();
    return ok;
  };

  /* ───────────── events ───────────── */
  function currentStage() { return current && STAGES.find(s => s.id === current.id); }
  function bindLesson(s) {
    const root = $('lessonDetail');
    $('lhBack').onclick = () => closeLesson(s.id);
    $('lhPrev').onclick = () => goToStep(current.step - 1);
    $('lhNext').onclick = () => goToStep(current.step + 1);
    root.querySelectorAll('.lesson-step').forEach(b => { b.onclick = () => goToStep(Number(b.dataset.step)); });
    const notes = $('lhNotes'), status = $('lhNotesStatus');
    const savedMsg = ok => { status.textContent = ok ? `Notes saved in this browser · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved — this browser is blocking or out of storage. Copy your notes somewhere safe.'; };
    notes.addEventListener('input', () => {
      const v = notes.value.slice(0, 20000);
      if (v.trim()) ld().notes[s.id] = v; else delete ld().notes[s.id];
      status.textContent = 'Saving…';
      persistSoon(savedMsg);
    });
    notes.addEventListener('blur', () => { flushPending(); updateStepper(s); refreshCompleteBox(s); });
    $('lhTaskDone').addEventListener('change', e => {
      if (e.target.checked) ld().taskDone[s.id] = true; else delete ld().taskDone[s.id];
      persist(); updateStepper(s);
    });
    s.codes.forEach((c, k) => {
      const ta = $(`lc-${s.id}-${k}`), st = $(`lcs-${s.id}-${k}`), key = `${s.id}:${k}`;
      ta.addEventListener('input', () => {
        if (ta.value === c.text) delete ld().code[key]; else ld().code[key] = ta.value.slice(0, 50000);
        st.textContent = 'Saving…';
        persistSoon(ok => { st.textContent = ok ? 'Draft saved in this browser.' : 'Not saved — browser storage unavailable.'; });
      });
    });
    root.querySelectorAll('[data-review-code]').forEach(b => { b.onclick = () => reviewCode(s, Number(b.dataset.reviewCode)); });
    root.querySelectorAll('[data-reset-code]').forEach(b => {
      b.onclick = async () => {
        const k = Number(b.dataset.resetCode), ta = $(`lc-${s.id}-${k}`);
        if (ta.value === s.codes[k].text) { $(`lcs-${s.id}-${k}`).textContent = 'Already showing the original example.'; return; }
        const ok = await dialog({ title: 'Reset this example?', body: '<p>Your edits to this example will be replaced by the original. Your notes are not affected.</p>', actions: [{ label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Reset example', value: 'reset', kind: 'primary' }] });
        if (ok !== 'reset') return;
        ta.value = s.codes[k].text; delete ld().code[`${s.id}:${k}`]; persist();
        $(`lcs-${s.id}-${k}`).textContent = 'Example reset.'; $(`lcr-${s.id}-${k}`).hidden = true; ta.focus();
      };
    });
    root.querySelectorAll('[data-check]').forEach(b => { b.onclick = () => checkAnswer(s, Number(b.dataset.check)); });
    root.querySelectorAll('.lq input[type=radio]').forEach(r => r.addEventListener('change', () => {
      const fs = r.closest('.lq'), fb = fs.querySelector('.lq-feedback');
      if (fb.classList.contains('warn')) { fb.className = 'lq-feedback'; fb.textContent = ''; }
    }));
    $('lhQuizRetake').onclick = () => {
      delete ld().quiz[s.id]; persist();
      s.quiz.forEach((_, k) => { const fs = $(`lq-${s.id}-${k}`); fs.querySelectorAll('input').forEach(i => { i.checked = false; }); paintQuiz(s, k); });
      updateQuizSummary(s); updateStepper(s);
      $(`lq-${s.id}-0`)?.querySelector('input')?.focus();
      $('lhQuizSummary').textContent = 'Check reset. Answer each question again — getting all of them right first time clears the revision flag.';
    };
    root.querySelectorAll('[data-ready]').forEach(c => c.addEventListener('change', () => {
      const k = Number(c.dataset.ready), r = ld().readiness;
      const i = r.indexOf(k);
      if (c.checked && i < 0) r.push(k); else if (!c.checked && i >= 0) r.splice(i, 1);
      persist();
    }));
    // Visual tabs: arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
    const tabs = [...root.querySelectorAll('.lv-tab')];
    const select = t => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        $(x.getAttribute('aria-controls')).hidden = !on;
      });
      markScrollables();
    };
    tabs.forEach((t, k) => {
      t.onclick = () => select(t);
      t.onkeydown = e => {
        const m = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (m === undefined) return;
        e.preventDefault();
        const nt = tabs[(m + tabs.length) % tabs.length]; select(nt); nt.focus();
      };
    });
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open-stage],[data-goto-step],[data-goto-learning],[data-open-lab],[data-open-challenge],[data-start-interview],[data-revise-interview],[data-return-lesson],[data-dismiss-return],[data-back-path],[data-goto-settings],[data-dismiss-banner],[data-goto-revise],#lhComplete,#lhUncomplete,#profileExport,#profileImport,#profileReset');
    if (!t || !document.getElementById('appShell')?.contains(t)) return;
    const s = currentStage();
    if (t.dataset.openStage) { openStage(t.dataset.openStage, t.dataset.step != null ? { step: Number(t.dataset.step) } : {}); return; }
    if (t.dataset.gotoStep != null) { goToStep(Number(t.dataset.gotoStep)); return; }
    if (t.hasAttribute('data-goto-learning')) { showScreen('learning'); $('lhStagesH')?.scrollIntoView({ behavior: behavior(), block: 'start' }); return; }
    if (t.dataset.openLab) { openLab(t.dataset.openLab); return; }
    if (t.dataset.openChallenge) { openChallenge(t.dataset.openChallenge); return; }
    if (t.dataset.startInterview) { const st = STAGES.find(x => x.id === t.dataset.startInterview); if (st) startInterview(st); return; }
    if (t.hasAttribute('data-revise-interview')) { const first = bank.find(q => state.weak[q.id]); if (first) leaveTo(() => beginPractice(first.track, true, 'all')); return; }
    if (t.hasAttribute('data-return-lesson')) { const r = returnTo; if (r) openStage(r.id, { step: r.step }); return; }
    if (t.hasAttribute('data-dismiss-return')) { returnTo = null; renderReturnBar(activeScreen()); return; }
    if (t.hasAttribute('data-back-path')) { closeLesson(s?.id); return; }
    if (t.hasAttribute('data-goto-settings')) { showScreen('settings'); return; }
    if (t.hasAttribute('data-goto-revise')) { const h = $('lhReviseH'); h?.scrollIntoView({ behavior: behavior(), block: 'start' }); h?.closest('.lh-panel')?.querySelector('button')?.focus({ preventScroll: true }); return; }
    if (t.dataset.dismissBanner) { const b = $('storageBanner'); b.dataset.dismissed = t.dataset.dismissBanner; b.hidden = true; return; }
    if (t.id === 'lhComplete' && s) { completeStage(s); return; }
    if (t.id === 'lhUncomplete' && s) {
      const l = ld(); l.completed = l.completed.filter(id => id !== s.id); delete l.completedAt[s.id];
      persist(); refreshCompleteBox(s); updateStepper(s); $('lhCompleteBox')?.focus({ preventScroll: true });
      toast(`Stage ${stageNo(s)} marked as not complete.`); return;
    }
    if (t.id === 'profileExport') { exportPracticeData(); return; }
    if (t.id === 'profileImport') { $('profileImportFile').click(); return; }
    if (t.id === 'profileReset') { requestPracticeReset(); return; }
  });
  document.addEventListener('change', async e => {
    if (e.target.id === 'profileImportFile') {
      const input = e.target, file = input.files && input.files[0];
      try { await handleImportFile(file); } finally { input.value = ''; }
      return;
    }
    if (e.target.name === 'lhPace') {
      ld().pace = e.target.value; persist(); renderOverview();
      document.querySelector(`input[name="lhPace"][value="${e.target.value}"]`)?.focus();
    }
  });
  $('learningQuickBtn')?.addEventListener('click', () => showScreen('learning'));
  window.addEventListener('pagehide', flushPending);

  /* ───────────── start ───────────── */
  function validateLinks() {
    const problems = [];
    STAGES.forEach(s => {
      [...(s.next.challenges || []), ...(s.task.challenge ? [s.task.challenge] : [])].forEach(c => { if (!challengeData.some(x => x.id === c)) problems.push(`${s.id}: unknown challenge "${c}"`); });
      [...(s.next.labs || []), ...(s.task.lab ? [s.task.lab] : [])].forEach(lab => { if (!LABS[lab] || !$(`lab-${lab}`)) problems.push(`${s.id}: unknown lab "${lab}"`); });
      const iv = s.next.interview;
      if (iv) iv.ids.forEach(id => { const q = bank.find(x => x.id === id); if (!q || q.track !== iv.track) problems.push(`${s.id}: interview question "${id}" missing or not in track ${iv.track}`); });
      s.quiz.forEach((q, k) => { if (!q.options[q.correct]) problems.push(`${s.id}: quiz ${k} has no correct option`); });
    });
    if (problems.length) console.warn('[Learning hub] link problems:', problems);
    return problems;
  }
  ensureState();
  const linkProblems = validateLinks();
  renderOverview();
  renderLearningHome();
  renderLearningProgress();
  renderSettings();
  updateStorageBanner();

  window.exportPracticeData = exportPracticeData;
  Object.assign(window, { dialog, persist, persistSoon, flushPendingSave: flushPending, storageStatus, effectiveStatus, storedEntries, fmtBytes, fmtDate, updateStorageBanner, renderLearningProgress, renderOverview });
  window.requestPracticeReset = requestPracticeReset;
  // Small, read-mostly surface for automated checks of this frontend.
  window.LearningHub = { openStage, goToStep, buildBackup, parseBackup, importBackupText, requestPracticeReset, storageStatus, normalizeLearning, linkProblems, stages: STAGES };
})();
