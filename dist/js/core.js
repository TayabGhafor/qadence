/* Qadence · core: profiles, preferences, storage key, routing, toasts, content index,
   schema-v3 normalisers and derived gamification (XP, level, streak, badges).
   Classic script: top-level declarations are shared with later scripts. Nothing here
   talks to a server or stores the shared demo password. */
'use strict';

const BRAND = { name: 'Qadence', word: 'qadence' };
const BASE_KEY = 'sqaPracticeRoom.v1';               // unchanged so existing learners keep their progress
const AUTH_KEY = 'sqaPracticeRoom.auth.v1';
const PREFS_KEY = 'sqaPracticeRoom.prefs.v1';
const PROFILES_KEY = 'sqaPracticeRoom.profiles.v1';
const SCHEMA_VERSION = 3;

const $id = id => document.getElementById(id);
const isPlainObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function motionOK() { try { return !matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return true; } }
function today() { return localDay(); }   // local calendar day, same as streaks
function localDay(d) { const x = d ? new Date(d) : new Date(); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; }
function readJSON(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function writeJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }

/* Trusted content may use a few inline tags. Parse inertly and keep only those, without attributes. */
const RICH_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'CODE', 'KBD', 'BR']);
const richCache = new Map();
function rich(html) {
  if (html == null) return '';
  const key = String(html);
  if (richCache.has(key)) return richCache.get(key);
  const tpl = document.createElement('template');
  tpl.innerHTML = key;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 1) {
        if (!RICH_TAGS.has(n.tagName)) { n.replaceWith(document.createTextNode(n.textContent)); return; }
        [...n.attributes].forEach(a => n.removeAttribute(a.name));
        walk(n);
      } else if (n.nodeType !== 3) n.remove();
    });
  };
  walk(tpl.content);
  const div = document.createElement('div'); div.appendChild(tpl.content);
  const out = div.innerHTML; richCache.set(key, out);
  return out;
}

/* ───────────── preferences (device-level: theme, language) ───────────── */
const Prefs = {
  get() { const p = readJSON(PREFS_KEY); return isPlainObj(p) ? p : {}; },
  set(patch) { const p = Object.assign(Prefs.get(), patch); writeJSON(PREFS_KEY, p); return p; }
};
function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode); else root.removeAttribute('data-theme');
  const dark = mode === 'dark' || (mode !== 'light' && (() => { try { return matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; } })());
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', dark ? '#08100F' : '#F3F6F5');
  document.querySelectorAll('#themeToggle use').forEach(u => u.setAttribute('href', dark ? '#i-sun' : '#i-moon'));
  return dark;
}
function setTheme(mode) { Prefs.set({ theme: mode }); applyTheme(mode); document.dispatchEvent(new CustomEvent('qa:theme', { detail: { mode } })); }

/* ───────────── learner profiles on this device ─────────────
   The first profile keeps the original key so existing progress is untouched. Each extra
   profile has its own state key. Switching reloads the page, so no state ever leaks across. */
const AVATAR_COLORS = ['#0F766E', '#4F46E5', '#0369A1', '#B45309', '#7C3AED', '#BE185D', '#047857', '#C2410C', '#334155'];   // all ≥ 5:1 with white initials
function loadProfiles() {
  const raw = readJSON(PROFILES_KEY);
  const list = Array.isArray(raw && raw.list) ? raw.list.filter(p => isPlainObj(p) && typeof p.id === 'string' && /^[a-z0-9-]{1,40}$/.test(p.id)).map(p => ({ id: p.id, name: String(p.name || 'Learner').slice(0, 40), color: AVATAR_COLORS.includes(p.color) ? p.color : AVATAR_COLORS[0], createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString() })) : [];
  if (!list.some(p => p.id === 'default')) list.unshift({ id: 'default', name: 'Admin', color: AVATAR_COLORS[0], createdAt: new Date().toISOString() });
  const active = list.some(p => p.id === (raw && raw.active)) ? raw.active : 'default';
  return { active, list };
}
const PROFILES = loadProfiles();
const KEY = PROFILES.active === 'default' ? BASE_KEY : `${BASE_KEY}.profile.${PROFILES.active}`;
const Profiles = {
  all: () => PROFILES.list,
  active: () => PROFILES.list.find(p => p.id === PROFILES.active),
  save() { return writeJSON(PROFILES_KEY, PROFILES); },
  rename(id, name, color) { const p = PROFILES.list.find(x => x.id === id); if (!p) return; if (name) p.name = String(name).slice(0, 40); if (color && AVATAR_COLORS.includes(color)) p.color = color; Profiles.save(); },
  create(name, color) {
    const id = 'p' + Date.now().toString(36);
    PROFILES.list.push({ id, name: String(name || 'Learner').slice(0, 40), color: AVATAR_COLORS.includes(color) ? color : AVATAR_COLORS[PROFILES.list.length % AVATAR_COLORS.length], createdAt: new Date().toISOString() });
    Profiles.save(); return id;
  },
  switchTo(id) { if (!PROFILES.list.some(p => p.id === id)) return; if (typeof flushPendingSave === 'function') flushPendingSave(); PROFILES.active = id; Profiles.save(); location.hash = '#/home'; location.reload(); },
  remove(id) {
    if (id === 'default' || id === PROFILES.active) return false;
    try { localStorage.removeItem(`${BASE_KEY}.profile.${id}`); localStorage.removeItem(`${BASE_KEY}.profile.${id}.unreadable`); } catch {}
    PROFILES.list = PROFILES.list.filter(p => p.id !== id); Profiles.save(); return true;
  },
  keyFor: id => id === 'default' ? BASE_KEY : `${BASE_KEY}.profile.${id}`
};

/* ───────────── content index ───────────── */
const CONTENT = window.QA_CONTENT || { lessons: [], bank: [], drills: [], scenarios: [] };
const STAGE_ORDER = ['foundations', 'manual', 'web-mobile', 'sql-api', 'code-git', 'automation', 'quality', 'capstone'];
const STAGE_META = {
  foundations: { icon: 'compass', n: 1 }, manual: { icon: 'list-checks', n: 2 }, 'web-mobile': { icon: 'phone', n: 3 }, 'sql-api': { icon: 'plug', n: 4 },
  'code-git': { icon: 'git', n: 5 }, automation: { icon: 'rocket', n: 6 }, quality: { icon: 'shield', n: 7 }, capstone: { icon: 'briefcase', n: 8 }
};
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_ICON = { beginner: 'sprout', intermediate: 'trending', advanced: 'mountain' };
if (CONTENT.finalize) CONTENT.finalize();
const TAXONOMY = CONTENT.taxonomy || { path: {}, groups: [], collections: [], requires: {} };
const PATH_POS = new Map();
STAGE_ORDER.forEach((sg, si) => (TAXONOMY.path[sg] || []).forEach((id, k) => PATH_POS.set(id, si * 1000 + k)));
const LESSONS = CONTENT.lessons.slice().sort((a, b) => (PATH_POS.has(a.id) ? PATH_POS.get(a.id) : STAGE_ORDER.indexOf(a.stage) * 1000 + 500 + a.n) - (PATH_POS.has(b.id) ? PATH_POS.get(b.id) : STAGE_ORDER.indexOf(b.stage) * 1000 + 500 + b.n));
LESSONS.forEach((l, i) => { l.seq = i + 1; });   // global recommended sequence number
const GROUPS = (TAXONOMY.groups || []).map(g => ({ ...g, lessons: (g.lessons || []).filter(id => LESSONS.some(l => l.id === id)) }));
const GROUP_OF = new Map(); GROUPS.forEach(g => g.lessons.forEach(id => GROUP_OF.set(id, g)));
const COLLECTIONS = (TAXONOMY.collections || []).map(c => ({ ...c, lessons: (c.lessons || []).filter(id => LESSONS.some(l => l.id === id)) }));
const REQUIRES = TAXONOMY.requires || {};
const LESSON_BY_ID = new Map(LESSONS.map(l => [l.id, l]));
const DRILL_BY_ID = new Map(CONTENT.drills.map(d => [d.id, d]));
const SCENARIO_BY_ID = new Map(CONTENT.scenarios.map(s => [s.id, s]));
const lessonsIn = stage => LESSONS.filter(l => l.stage === stage);
/* Every MCQ gets a stable id (lesson quiz: lessonId#q3; bank: bank:stage:hash) for review and weak-topic tracking. */
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
const QUESTION_POOL = [];
LESSONS.forEach(l => (l.quiz || []).forEach((q, i) => QUESTION_POOL.push(Object.assign({ id: `${l.id}#q${i}`, stage: l.stage, level: l.level, topic: l.id, src: 'lesson' }, q))));
CONTENT.bank.forEach(q => QUESTION_POOL.push(Object.assign({ id: `bank:${q.stage}:${hashStr(q.q)}`, src: 'bank' }, q)));
const QUESTION_BY_ID = new Map(QUESTION_POOL.map(q => [q.id, q]));

/* ───────────── schema v3 slices: defaults + normalisers (used on load and on import) ───────────── */
const clampInt = (v, lo, hi, d = lo) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const isoOr = (v, d = null) => typeof v === 'string' && Number.isFinite(Date.parse(v)) ? new Date(v).toISOString() : d;
const str = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
function defaultAcademy() { return { completed: {}, quiz: {}, practice: {}, notes: {}, bookmarks: [], last: null, langs: [], seen: {} }; }
function normalizeAcademy(input) {
  const a = isPlainObj(input) ? input : {}, out = defaultAcademy();
  if (isPlainObj(a.completed)) for (const [id, v] of Object.entries(a.completed)) if (LESSON_BY_ID.has(id)) out.completed[id] = isoOr(v, new Date().toISOString());
  if (isPlainObj(a.quiz)) for (const [id, answers] of Object.entries(a.quiz)) {
    const l = LESSON_BY_ID.get(id); if (!l || !isPlainObj(answers)) continue;
    const clean = {};
    for (const [k, x] of Object.entries(answers)) {
      const i = Number(k), q = l.quiz[i]; if (!Number.isInteger(i) || !q || !isPlainObj(x)) continue;
      const choice = Number(x.choice); if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) continue;
      const attempts = clampInt(x.attempts, 1, 99, 1), correct = choice === q.correct;
      clean[i] = { choice, correct, attempts, firstTry: correct && (x.firstTry === true || (x.firstTry === undefined && attempts === 1)) };
    }
    if (Object.keys(clean).length) out.quiz[id] = clean;
  }
  if (isPlainObj(a.practice)) for (const [id, marks] of Object.entries(a.practice)) {
    const l = LESSON_BY_ID.get(id); if (!l || !isPlainObj(marks)) continue;
    const clean = {}; for (const [k, v] of Object.entries(marks)) { const i = Number(k); if (Number.isInteger(i) && l.practice[i] && (v === 'got' || v === 'review')) clean[i] = v; }
    if (Object.keys(clean).length) out.practice[id] = clean;
  }
  if (isPlainObj(a.notes)) for (const [id, v] of Object.entries(a.notes)) if (LESSON_BY_ID.has(id) && typeof v === 'string' && v.trim()) out.notes[id] = v.slice(0, 20000);
  if (isPlainObj(a.seen)) for (const [id, v] of Object.entries(a.seen)) if (LESSON_BY_ID.has(id)) out.seen[id] = isoOr(v, new Date().toISOString());
  out.bookmarks = Array.isArray(a.bookmarks) ? [...new Set(a.bookmarks.filter(id => LESSON_BY_ID.has(id)))].slice(0, 500) : [];
  out.last = LESSON_BY_ID.has(a.last) ? a.last : null;
  out.langs = Array.isArray(a.langs) ? [...new Set(a.langs.filter(l => QA_I18N.langs.some(x => x.code === l)))] : [];
  return out;
}
const TEST_KINDS = ['quick', 'stage', 'level', 'custom', 'scenario', 'weak'];
function normalizeTests(input) {
  if (!Array.isArray(input)) return [];
  return input.filter(isPlainObj).slice(-300).map((r, n) => {
    const answers = Array.isArray(r.answers) ? r.answers.filter(isPlainObj).slice(0, 120).map(a => {
      const q = r.kind === 'scenario' ? null : QUESTION_BY_ID.get(a.qid);
      const pick = Array.isArray(a.pick) ? [...new Set(a.pick.map(Number).filter(Number.isInteger))].slice(0, 6) : (Number.isInteger(Number(a.pick)) ? Number(a.pick) : null);
      return { qid: String(a.qid || '').slice(0, 120), pick, correct: a.correct === true, topic: q ? q.topic : str(a.topic, 60) };
    }) : [];
    const total = clampInt(r.total, 0, 200, answers.length), correct = clampInt(r.correct, 0, total, answers.filter(a => a.correct).length);
    return {
      id: str(r.id, 60) || `t-import-${n}`, kind: TEST_KINDS.includes(r.kind) ? r.kind : 'custom', ref: str(r.ref, 80), title: str(r.title, 140) || 'Test',
      date: isoOr(r.date, new Date().toISOString()), total, correct, score: total ? Math.round(correct / total * 100) : 0,
      seconds: clampInt(r.seconds, 0, 60 * 60 * 6, 0), answers
    };
  });
}
function normalizeDrills(input) {
  const out = {};
  if (isPlainObj(input)) for (const [id, v] of Object.entries(input)) if (DRILL_BY_ID.has(id) && isPlainObj(v)) out[id] = { best: clampInt(v.best, 0, 100, 0), attempts: clampInt(v.attempts, 0, 9999, 1), last: isoOr(v.last, new Date().toISOString()) };
  return out;
}
const ROLES = ['QA Analyst', 'Manual QA Engineer', 'SQA Engineer', 'Automation / SDET', 'QA Lead', 'Student / career switcher'];
function normalizeProfile(input) {
  const p = isPlainObj(input) ? input : {};
  return {
    name: str(p.name, 40).trim(), role: ROLES.includes(p.role) ? p.role : '', level: LEVELS.includes(p.level) ? p.level : 'beginner',
    goal: clampInt(p.goal, 1, 21, 4), bio: str(p.bio, 400), color: AVATAR_COLORS.includes(p.color) ? p.color : '',
    createdAt: isoOr(p.createdAt, null), onboarded: p.onboarded === true
  };
}
const IV_BY_ID = new Map((CONTENT.interview || []).map(q => [q.id, q]));
function normalizeInterviewBank(input) {
  const v = isPlainObj(input) ? input : {}, out = { marks: {}, mocks: [] };
  if (isPlainObj(v.marks)) for (const [id, m] of Object.entries(v.marks)) if (IV_BY_ID.has(id) && (m === 'confident' || m === 'review')) out.marks[id] = m;
  out.mocks = Array.isArray(v.mocks) ? v.mocks.filter(isPlainObj).slice(-30).map(m => ({ date: isoOr(m.date, new Date().toISOString()), count: clampInt(m.count, 0, 50, 0), score: clampInt(m.score, 0, 100, 0) })) : [];
  return out;
}
/* Apply every v3 slice onto target from input (target === input on load). */
function normalizeV3(target, input) {
  const src = isPlainObj(input) ? input : {};
  target.academy = normalizeAcademy(src.academy);
  target.tests = normalizeTests(src.tests);
  target.drills = normalizeDrills(src.drills);
  target.profile = normalizeProfile(src.profile);
  target.interviewBank = normalizeInterviewBank(src.interviewBank);
  target.days = Array.isArray(src.days) ? [...new Set(src.days.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-2000) : [];
  target.schemaVersion = SCHEMA_VERSION;
  return target;
}
function summaryRowsV3(st) {
  const a = st.academy || defaultAcademy();
  return [
    ['Learning Lab lessons complete', `${Object.keys(a.completed || {}).length} of ${LESSONS.length}`],
    ['Learning Lab notes', Object.keys(a.notes || {}).length],
    ['Tests taken', (st.tests || []).length],
    ['Practice drills solved', Object.keys(st.drills || {}).length],
    ['Interview questions rated', Object.keys((st.interviewBank && st.interviewBank.marks) || {}).length]
  ];
}

/* ───────────── activity & gamification (derived — nothing extra to store or validate) ───────────── */
function markActive() { if (typeof state === 'undefined') return; const d = localDay(); if (!state.days.includes(d)) state.days.push(d); }
function streakOf(days) {
  const set = new Set(days || []); let n = 0; const d = new Date();
  if (!set.has(localDay(d))) d.setDate(d.getDate() - 1);   // today not done yet: streak still alive from yesterday
  while (set.has(localDay(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const LEVEL_TITLES = ['Curious Tester', 'Bug Spotter', 'Test Designer', 'Quality Analyst', 'API Explorer', 'Automation Apprentice', 'Release Guardian', 'QA Engineer', 'Senior QA', 'Quality Coach', 'Quality Champion'];
const levelFloor = n => 100 * (n - 1) * n / 2;   // L1 0, L2 100, L3 300, L4 600, L5 1000 …
function xpLevel(xp) { let n = 1; while (xp >= levelFloor(n + 1)) n++; const lo = levelFloor(n), hi = levelFloor(n + 1); return { n, title: LEVEL_TITLES[Math.min(n - 1, LEVEL_TITLES.length - 1)], xp, into: xp - lo, span: hi - lo, pct: Math.round((xp - lo) / (hi - lo) * 100), next: hi }; }
function bestBy(list, keyFn, valFn) { const m = new Map(); list.forEach(x => { const k = keyFn(x), v = valFn(x); if (!m.has(k) || m.get(k) < v) m.set(k, v); }); return m; }
function computeStats(st) {
  const s = st || state, a = s.academy || defaultAcademy();
  const completed = Object.keys(a.completed || {});
  const firstTry = Object.values(a.quiz || {}).reduce((n, q) => n + Object.values(q).filter(x => x.firstTry).length, 0);
  const practiceGot = Object.values(a.practice || {}).reduce((n, m) => n + Object.values(m).filter(v => v === 'got').length, 0);
  const tests = s.tests || [];
  const bestTests = bestBy(tests.filter(t => t.kind !== 'quick' && t.kind !== 'custom' && t.kind !== 'weak'), t => t.kind + ':' + t.ref, t => t.correct);
  let testXp = 0; bestTests.forEach((v, k) => { testXp += v * (k.startsWith('scenario') ? 6 : 4); });
  testXp += Math.min(300, tests.filter(t => t.kind === 'quick' || t.kind === 'custom' || t.kind === 'weak').reduce((n, t) => n + t.correct * 2, 0));
  const drills = Object.values(s.drills || {});
  const drillXp = drills.reduce((n, d) => n + Math.round(d.best / 100 * 15), 0);
  const interviewXp = (s.sessions || []).length * 20;
  const challengeXp = new Set((s.submissions || []).map(x => x.challengeId)).size * 30;
  const roadmapXp = ((s.learning && s.learning.completed) || []).length * 40;
  const labXp = Object.values(s.labAttempts || {}).reduce((n, v) => n + Math.min(20, (+v || 0) * 2), 0);
  const bugXp = Math.min(5, (s.bugReports || []).length) * 10;
  const xp = completed.length * 50 + firstTry * 10 + practiceGot * 5 + testXp + drillXp + interviewXp + challengeXp + roadmapXp + labXp + bugXp;
  const byLevel = Object.fromEntries(LEVELS.map(lv => { const all = LESSONS.filter(l => l.level === lv); const done = all.filter(l => a.completed[l.id]).length; return [lv, { done, total: all.length, pct: all.length ? Math.round(done / all.length * 100) : 0 }]; }));
  const byStage = Object.fromEntries(STAGE_ORDER.map(sg => { const all = lessonsIn(sg); const done = all.filter(l => a.completed[l.id]).length; return [sg, { done, total: all.length, pct: all.length ? Math.round(done / all.length * 100) : 0 }]; }));
  const scored = tests.filter(t => t.total > 0);
  const avg = scored.length ? Math.round(scored.reduce((n, t) => n + t.score, 0) / scored.length) : null;
  const streak = streakOf(s.days);
  const weekStart = (() => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return localDay(d); })();
  const doneThisWeek = completed.filter(id => localDay(a.completed[id]) >= weekStart).length;
  const scenarioPassed = new Set(tests.filter(t => t.kind === 'scenario' && t.score >= 70).map(t => t.ref)).size;
  const stats = {
    xp, level: xpLevel(xp), streak, completed: completed.length, totalLessons: LESSONS.length, byLevel, byStage, tests: tests.length, avg,
    drillsSolved: drills.filter(d => d.best === 100).length, drillsTried: drills.length, firstTry, doneThisWeek, goal: (s.profile && s.profile.goal) || 4,
    scenarioPassed, interviews: (s.sessions || []).length, submissions: (s.submissions || []).length
  };
  stats.badges = BADGES.map(b => ({ ...b, earned: !!b.test(stats, s) }));
  return stats;
}
const BADGES = [
  { id: 'first-lesson', icon: 'sprout', name: 'First steps', desc: 'Complete your first lesson', test: x => x.completed >= 1 },
  { id: 'ten-lessons', icon: 'book', name: 'Bookworm', desc: 'Complete 10 lessons', test: x => x.completed >= 10 },
  { id: 'thirty-lessons', icon: 'cap', name: 'Scholar', desc: 'Complete 30 lessons', test: x => x.completed >= 30 },
  { id: 'beginner-done', icon: 'sprout', name: 'Foundations laid', desc: 'Finish every beginner lesson', test: x => x.byLevel.beginner.total > 0 && x.byLevel.beginner.done === x.byLevel.beginner.total },
  { id: 'intermediate-done', icon: 'trending', name: 'Level up', desc: 'Finish every intermediate lesson', test: x => x.byLevel.intermediate.total > 0 && x.byLevel.intermediate.done === x.byLevel.intermediate.total },
  { id: 'advanced-done', icon: 'mountain', name: 'Summit', desc: 'Finish every advanced lesson', test: x => x.byLevel.advanced.total > 0 && x.byLevel.advanced.done === x.byLevel.advanced.total },
  { id: 'sharp-shooter', icon: 'target', name: 'Sharp shooter', desc: 'Answer 25 lesson checks right first time', test: x => x.firstTry >= 25 },
  { id: 'perfect-test', icon: 'star', name: 'Flawless', desc: 'Score 100% on a test of 10+ questions', test: (x, s) => (s.tests || []).some(t => t.total >= 10 && t.score === 100) },
  { id: 'exam-pass', icon: 'medal', name: 'Certified-ish', desc: 'Pass a level exam (70%+)', test: (x, s) => (s.tests || []).some(t => t.kind === 'level' && t.score >= 70) },
  { id: 'scenario-3', icon: 'file-search', name: 'Case cracker', desc: 'Pass 3 different scenario tests', test: x => x.scenarioPassed >= 3 },
  { id: 'drills-10', icon: 'puzzle', name: 'Drill sergeant', desc: 'Solve 10 drills perfectly', test: x => x.drillsSolved >= 10 },
  { id: 'streak-3', icon: 'flame', name: 'On a roll', desc: 'Keep a 3-day streak', test: x => x.streak >= 3 },
  { id: 'streak-7', icon: 'flame', name: 'Unstoppable', desc: 'Keep a 7-day streak', test: x => x.streak >= 7 },
  { id: 'interview-3', icon: 'mic', name: 'Interview ready', desc: 'Finish 3 interview practice rounds', test: x => x.interviews >= 3 },
  { id: 'builder', icon: 'code', name: 'Builder', desc: 'Submit a challenge solution', test: x => x.submissions >= 1 },
  { id: 'bug-hunter', icon: 'bug', name: 'Bug hunter', desc: 'File a bug report in the Bug Hunt lab', test: (x, s) => (s.bugReports || []).length >= 1 },
  { id: 'polyglot', icon: 'translate', name: 'Polyglot', desc: 'Read explanations in 3 languages', test: (x, s) => ((s.academy && s.academy.langs) || []).length >= 3 }
];

/* ───────────── toasts ───────────── */
function toast(msg, iconName) {
  const region = $id('toastRegion'); if (!region) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon(iconName || 'check-circle')}<span></span>`;
  el.querySelector('span').textContent = msg;
  region.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3200);
  while (region.children.length > 3) region.firstChild.remove();
}

/* ───────────── routing (hash deep links: #/academy/lesson/mt-boundary) ───────────── */
const SCREENS = ['home', 'academy', 'learning', 'tests', 'drills', 'practice', 'lab', 'challenges', 'workspace', 'submissions', 'progress', 'profile', 'settings'];
const QA = window.QA = { views: {}, onLeave: {}, current: 'home', parts: [] };
function currentPathFromHash() {
  const h = (location.hash || '').replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean).map(decodeURIComponent);
  return SCREENS.includes(parts[0]) ? parts : ['home'];
}
function showScreen(id, opts) {
  if (!SCREENS.includes(id)) id = 'home';
  const o = opts || {};
  const parts = o.parts || [];
  const prev = QA.current;
  if (prev !== id && QA.onLeave[prev]) { try { QA.onLeave[prev](); } catch (e) { console.error(e); } }
  QA.current = id; QA.parts = parts;
  document.querySelectorAll('.screen').forEach(x => x.classList.toggle('active', x.id === id));
  document.querySelectorAll('[data-screen]').forEach(x => {
    if (!x.matches('.nav-item, .bottom-nav button')) return;
    const on = x.dataset.screen === id;
    if (on) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
  });
  const path = '#/' + [id, ...parts].map(encodeURIComponent).join('/');
  if (location.hash !== path) {
    try { history[o.replace || o.fromHash ? 'replaceState' : 'pushState'](null, '', path); } catch { /* file:// in some browsers */ }
  }
  closeDrawer();
  if (QA.views[id]) { try { QA.views[id](parts, o); } catch (e) { console.error(`[view ${id}]`, e); } }
  if (!o.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  if (!o.fromHash && !o.noFocus) { const main = $id('appMain'); if (main && document.activeElement && !main.contains(document.activeElement)) main.focus({ preventScroll: true }); }
  document.dispatchEvent(new CustomEvent('qa:screen', { detail: { id, parts } }));
}
function navigate(id, ...parts) { showScreen(id, { parts }); }
function closeDrawer() { const s = $id('appShell'); if (s && s.classList.contains('drawer-open')) { s.classList.remove('drawer-open'); document.querySelectorAll('[data-open-drawer]').forEach(b => b.setAttribute('aria-expanded', 'false')); } }

/* ───────────── small render helpers shared by every view ───────────── */
function lvlBadge(level) { return `<span class="lvl lvl-${level}">${icon(LEVEL_ICON[level] || 'sprout')}${escapeHtml(t('lvl.' + level))}</span>`; }
function stageName(id) { return t('stage.' + id); }
function stageStyle(id) { return `--st: var(--st-${id})`; }
function ringSvg(pct, size = 120, stroke = 10) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}"/><circle class="value" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/></svg>`;
}
function barHtml(pct, label, cls) { const p = Math.max(0, Math.min(100, Math.round(pct))); return `<div class="bar ${cls || ''}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="${escapeHtml(label || 'Progress')}"><i style="width:${p}%"></i></div>`; }
function initials(name) { const parts = String(name || 'A').trim().split(/\s+/); return ((parts[0] || 'A')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase(); }
function shuffle(items) { const a = items.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function fmtDuration(sec) { const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, '0')}`; }
function relDate(iso) {
  try {
    const d = new Date(iso), diff = (Date.now() - d.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(QA_I18N.lang === 'ur-Latn' ? 'en' : QA_I18N.lang, { numeric: 'auto' });
    if (diff < 60) return rtf.format(0, 'second');
    if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
    if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
    if (diff < 86400 * 30) return rtf.format(-Math.round(diff / 86400), 'day');
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch { return String(iso).slice(0, 10); }
}
