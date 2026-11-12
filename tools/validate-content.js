#!/usr/bin/env node
/* Qadence content validator. Usage (from sqa-interview-practice/):
     node tools/validate-content.js            # errors fail, missing outline lessons are warnings
     node tools/validate-content.js --strict   # missing outline lessons are errors too
     node tools/validate-content.js --file lessons-manual-a.js   # only report on one file
   Loads dist/content/*.js in a sandbox exactly like the browser would (classic scripts). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'dist', 'content');
const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const ONLY = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

const OUTLINE = {
  foundations: ['fd-what-is-testing', 'fd-qa-qc-testing', 'fd-error-defect-failure', 'fd-sdlc-models', 'fd-stlc', 'fd-levels-types', 'fd-static-testing', 'fd-agile-testing', 'fd-risk-based'],
  manual: ['mt-requirements', 'mt-scenarios-cases', 'mt-equivalence', 'mt-boundary', 'mt-bug-reports', 'mt-decision-tables', 'mt-state-transition', 'mt-exploratory', 'mt-regression', 'mt-pairwise', 'mt-planning'],
  'web-mobile': ['wm-web-basics', 'wm-devtools', 'wm-forms-ui', 'wm-cross-browser', 'wm-mobile-basics', 'wm-mobile-conditions', 'wm-devices', 'wm-usability-l10n'],
  'sql-api': ['sa-sql-basics', 'sa-api-basics', 'sa-sql-joins', 'sa-db-testing', 'sa-postman', 'sa-auth', 'sa-api-negative', 'sa-mocking'],
  'code-git': ['cg-js-basics', 'cg-functions-data', 'cg-git', 'cg-async', 'cg-errors-debugging', 'cg-typescript', 'cg-collab', 'cg-clean-tests'],
  automation: ['au-what-to-automate', 'au-playwright-basics', 'au-waits', 'au-fixtures-data', 'au-frameworks', 'au-pom', 'au-flaky', 'au-ci', 'au-bdd-api-visual'],
  quality: ['qb-accessibility', 'qb-security', 'qb-performance', 'qb-nonfunctional', 'qb-perf-metrics', 'qb-privacy', 'qb-release', 'qb-prod-ai'],
  capstone: ['cp-portfolio', 'cp-resume', 'cp-interview-tech', 'cp-interview-behavioral', 'cp-metrics', 'cp-career']
};
const STAGES = Object.keys(OUTLINE);
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LABS = ['login', 'api', 'checkout', 'mobile', 'ui', 'bughunt'];
const CHALLENGES = ['peopleops-login', 'api-contract', 'shopflow-checkout', 'ui-interactions', 'mobile-resume', 'bug-report'];
const INTERVIEW = [].concat(...['m', 'a', 'p', 'd'].map(p => [1, 2, 3, 4, 5, 6].map(n => p + n)));
const LANGS = ['ur', 'ur-Latn', 'hi', 'ar', 'es'];
const EXTRA_LANGS = ['zh', 'ja', 'ko', 'fr', 'de', 'pt'];
const SCRIPT = { zh: /[\u4e00-\u9fff]/, ja: /[\u3040-\u30ff]/, ko: /[\uac00-\ud7af]/ };
const TONES = ['tip', 'warn', 'info', 'key'];
const CODE_LANGS = ['ts', 'js', 'sql', 'http', 'json', 'gherkin', 'text', 'bash', 'python', 'java', 'yaml'];
const ALLOWED_TAGS = new Set(['b', 'strong', 'i', 'em', 'code', 'kbd', 'br']);
const VISUAL = new Set(['table', 'flow', 'compare', 'cards']);

const errors = [], warnings = [];
const err = (file, where, msg) => errors.push(`${file} · ${where}: ${msg}`);
const warn = (file, where, msg) => warnings.push(`${file} · ${where}: ${msg}`);
const isStr = v => typeof v === 'string' && v.trim().length > 0;
const words = s => String(s || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

function checkHtml(file, where, s) {
  if (!isStr(s)) return err(file, where, 'expected non-empty string');
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let m;
  while ((m = re.exec(s))) {
    const tag = m[2].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) err(file, where, `tag <${tag}> not allowed`);
    else if (m[3].replace('/', '').trim()) err(file, where, `attributes not allowed on <${tag}>`);
  }
}
function checkPlain(file, where, s) {
  if (!isStr(s)) return err(file, where, 'expected non-empty plain-text string');
  if (/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^<>]*)?\/?>/.test(s.replace(/<\/?b>/g, ''))) err(file, where, 'plain-text field contains HTML');
}

function checkBlocks(file, where, blocks, min, max) {
  if (!Array.isArray(blocks)) return err(file, where, 'blocks must be an array');
  if (blocks.length < min || blocks.length > max) warn(file, where, `has ${blocks.length} blocks (expected ${min}–${max})`);
  blocks.forEach((b, i) => {
    const w = `${where}[${i}]`;
    if (!b || typeof b !== 'object') return err(file, w, 'block must be an object');
    switch (b.t) {
      case 'p': checkHtml(file, w + '.html', b.html); break;
      case 'h': checkPlain(file, w + '.text', b.text); break;
      case 'list':
        if (!Array.isArray(b.items) || b.items.length < 2) err(file, w, 'list needs ≥2 items');
        else b.items.forEach((x, k) => checkHtml(file, `${w}.items[${k}]`, x));
        break;
      case 'callout':
        if (!TONES.includes(b.tone)) err(file, w, `tone must be one of ${TONES.join(', ')}`);
        checkPlain(file, w + '.title', b.title); checkHtml(file, w + '.html', b.html); break;
      case 'table':
        if (!Array.isArray(b.head) || b.head.length < 2 || b.head.length > 6) err(file, w, 'table head needs 2–6 columns');
        if (!Array.isArray(b.rows) || !b.rows.length) err(file, w, 'table needs rows');
        else b.rows.forEach((r, k) => {
          if (!Array.isArray(r) || r.length !== (b.head || []).length) err(file, `${w}.rows[${k}]`, 'row length must equal head length');
          else r.forEach((c, j) => checkHtml(file, `${w}.rows[${k}][${j}]`, String(c)));
        });
        if (b.caption !== undefined) checkPlain(file, w + '.caption', b.caption);
        break;
      case 'code':
        if (!CODE_LANGS.includes(b.lang)) err(file, w, `code lang must be one of ${CODE_LANGS.join(' ')}`);
        if (!isStr(b.code)) err(file, w, 'code missing');
        else if (b.code.split('\n').length > 34) warn(file, w, 'code longer than 30 lines');
        break;
      case 'flow':
        if (!Array.isArray(b.steps) || b.steps.length < 3 || b.steps.length > 8) err(file, w, 'flow needs 3–7 steps');
        else b.steps.forEach((x, k) => checkPlain(file, `${w}.steps[${k}]`, x));
        break;
      case 'compare':
        for (const side of ['a', 'b']) {
          const s = b[side];
          if (!s || !isStr(s.title) || !Array.isArray(s.items) || !s.items.length) err(file, `${w}.${side}`, 'needs title and items');
          else s.items.forEach((x, k) => checkHtml(file, `${w}.${side}.items[${k}]`, x));
        }
        break;
      case 'cards':
        if (!Array.isArray(b.items) || b.items.length < 2 || b.items.length > 6) err(file, w, 'cards needs 2–6 items');
        else b.items.forEach((c, k) => { checkPlain(file, `${w}.items[${k}].title`, c && c.title); checkHtml(file, `${w}.items[${k}].html`, c && c.html); });
        break;
      case 'flowchart': case 'cycle': case 'pyramid': case 'matrix': case 'sequence': case 'tree': case 'timeline': case 'layers':
        checkDiagram(file, w, b); break;
      default: err(file, w, `unknown block type "${b.t}"`);
    }
  });
}

const DIAGRAMS = new Set(['flowchart', 'cycle', 'pyramid', 'matrix', 'sequence', 'tree', 'timeline', 'layers']);
function plainShort(file, where, s, max) { checkPlain(file, where, s); if (isStr(s) && s.length > max) warn(file, where, `label is ${s.length} chars (keep ≤ ${max})`); }
function checkDiagram(file, w, b) {
  if (b.title !== undefined) checkPlain(file, w + '.title', b.title);
  if (b.caption !== undefined) checkPlain(file, w + '.caption', b.caption);
  const arr = (v, lo, hi, name) => { if (!Array.isArray(v) || v.length < lo || v.length > hi) { err(file, w, `${name} needs ${lo}–${hi} items`); return false; } return true; };
  switch (b.t) {
    case 'flowchart': {
      if (b.dir !== undefined && !['down', 'right'].includes(b.dir)) err(file, w, 'dir must be down or right');
      if (!arr(b.nodes, 3, 12, 'nodes')) break;
      const ids = new Set();
      b.nodes.forEach((n, k) => {
        if (!n || !/^[a-z0-9-]+$/.test(n.id || '')) err(file, `${w}.nodes[${k}]`, 'id must be lowercase a-z0-9-');
        else if (ids.has(n.id)) err(file, `${w}.nodes[${k}]`, 'duplicate node id'); else ids.add(n.id);
        plainShort(file, `${w}.nodes[${k}].label`, n && n.label, 44);
        if (n && n.kind !== undefined && !['start', 'step', 'decision', 'end', 'io'].includes(n.kind)) err(file, `${w}.nodes[${k}]`, 'bad kind');
      });
      if (!arr(b.edges, 2, 24, 'edges')) break;
      b.edges.forEach((e, k) => {
        if (!e || !ids.has(e.from) || !ids.has(e.to)) err(file, `${w}.edges[${k}]`, 'edge references an unknown node');
        if (e && e.label !== undefined) plainShort(file, `${w}.edges[${k}].label`, e.label, 22);
      });
      b.nodes.filter(n => n && n.kind === 'decision').forEach(n => { const out = b.edges.filter(e => e && e.from === n.id); if (out.length < 2 || out.some(e => !isStr(e.label))) warn(file, w, `decision "${n.id}" should have ≥2 labelled outgoing edges`); });
      const reach = new Set(b.edges.flatMap(e => [e && e.from, e && e.to])); b.nodes.forEach(n => { if (n && !reach.has(n.id)) warn(file, w, `node "${n.id}" is not connected`); });
      break;
    }
    case 'cycle': if (arr(b.steps, 3, 8, 'steps')) b.steps.forEach((x, k) => plainShort(file, `${w}.steps[${k}]`, x, 30)); if (b.center !== undefined) plainShort(file, w + '.center', b.center, 24); break;
    case 'pyramid': if (arr(b.levels, 3, 6, 'levels')) b.levels.forEach((x, k) => { plainShort(file, `${w}.levels[${k}].label`, x && x.label, 34); if (x && x.note !== undefined) plainShort(file, `${w}.levels[${k}].note`, x.note, 80); }); break;
    case 'timeline': case 'layers': if (arr(b.items, b.t === 'layers' ? 2 : 3, b.t === 'layers' ? 6 : 8, 'items')) b.items.forEach((x, k) => { plainShort(file, `${w}.items[${k}].label`, x && x.label, 40); if (x && x.sub !== undefined) plainShort(file, `${w}.items[${k}].sub`, x.sub, 90); }); break;
    case 'matrix': {
      const ok = b.x && b.y && isStr(b.x.label) && isStr(b.y.label) && Array.isArray(b.x.ticks) && Array.isArray(b.y.ticks) && b.x.ticks.length >= 2 && b.x.ticks.length <= 5 && b.y.ticks.length >= 2 && b.y.ticks.length <= 5;
      if (!ok) { err(file, w, 'matrix needs x and y with label and 2–5 ticks'); break; }
      [...b.x.ticks, ...b.y.ticks].forEach((x, k) => plainShort(file, `${w}.ticks[${k}]`, x, 26));
      if (!Array.isArray(b.cells) || b.cells.length !== b.y.ticks.length || b.cells.some(r => !Array.isArray(r) || r.length !== b.x.ticks.length)) err(file, w, 'cells must be y.ticks rows × x.ticks columns');
      else b.cells.flat().forEach((c, k) => plainShort(file, `${w}.cells[${k}]`, c, 60));
      if (b.tones !== undefined && (!Array.isArray(b.tones) || b.tones.length !== b.y.ticks.length || b.tones.some(r => !Array.isArray(r) || r.length !== b.x.ticks.length || r.some(t => !['low', 'mid', 'high', 'none'].includes(t))))) err(file, w, 'tones must match cells and use low|mid|high|none');
      break;
    }
    case 'sequence': {
      if (!arr(b.actors, 2, 5, 'actors')) break;
      b.actors.forEach((x, k) => plainShort(file, `${w}.actors[${k}]`, x, 18));
      if (!arr(b.steps, 2, 12, 'steps')) break;
      b.steps.forEach((x, k) => { if (!x || !Number.isInteger(x.from) || !Number.isInteger(x.to) || x.from < 0 || x.to < 0 || x.from >= b.actors.length || x.to >= b.actors.length) err(file, `${w}.steps[${k}]`, 'from/to must be actor indexes'); plainShort(file, `${w}.steps[${k}].label`, x && x.label, 46); });
      break;
    }
    case 'tree': {
      let count = 0, depthMax = 0;
      const walk = (n, d, path) => { count++; depthMax = Math.max(depthMax, d); plainShort(file, path + '.label', n && n.label, 40); if (n && n.edge !== undefined) plainShort(file, path + '.edge', n.edge, 18); if (n && n.children !== undefined) { if (!Array.isArray(n.children) || !n.children.length) err(file, path, 'children must be a non-empty array'); else n.children.forEach((c, k) => walk(c, d + 1, `${path}.children[${k}]`)); } };
      if (!b.root) { err(file, w, 'tree needs root'); break; }
      walk(b.root, 1, w + '.root');
      if (count > 15) err(file, w, `tree has ${count} nodes (max 15)`);
      if (depthMax > 4) err(file, w, `tree depth ${depthMax} (max 4)`);
      break;
    }
  }
}

const mcqStats = {}; // file -> {pos:[...], longest:n, total:n}
function checkMcq(file, where, q, { allowMulti = false, maxOptions = 4 } = {}) {
  if (!q || typeof q !== 'object') return err(file, where, 'question must be an object');
  checkPlain(file, where + '.q', q.q);
  if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > maxOptions) return err(file, where, `needs ${maxOptions === 4 ? 'exactly 4' : '4–' + maxOptions} options`);
  q.options.forEach((o, k) => checkHtml(file, `${where}.options[${k}]`, o));
  const n = q.options.length;
  const multi = Array.isArray(q.correct);
  if (multi && !allowMulti) err(file, where, 'multi-select only allowed in scenario tests');
  const corrects = multi ? q.correct : [q.correct];
  if (!corrects.length || corrects.some(c => !Number.isInteger(c) || c < 0 || c >= n)) err(file, where, 'correct index out of range');
  if (multi && new Set(corrects).size !== corrects.length) err(file, where, 'duplicate correct indexes');
  if (!Array.isArray(q.why) || q.why.length !== n) err(file, where, 'why must have one explanation per option');
  else q.why.forEach((x, k) => checkHtml(file, `${where}.why[${k}]`, x));
  if (new Set(q.options.map(o => String(o).trim().toLowerCase())).size !== n) err(file, where, 'duplicate options');
  if (q.options.some(o => /all of the above|none of the above/i.test(o))) warn(file, where, 'avoid "all/none of the above"');
  const st = mcqStats[file] || (mcqStats[file] = { pos: [0, 0, 0, 0, 0], longest: 0, total: 0 });
  if (!multi && Number.isInteger(q.correct)) {
    st.pos[q.correct]++; st.total++;
    const lens = q.options.map(o => String(o).length);
    if (lens[q.correct] === Math.max(...lens) && lens.filter(l => l === lens[q.correct]).length === 1) st.longest++;
  }
}

function checkLinks(file, where, links) {
  if (links === undefined) return;
  if (!links || typeof links !== 'object') return err(file, where, 'links must be an object');
  const sets = { labs: LABS, challenges: CHALLENGES, interview: INTERVIEW };
  for (const [k, v] of Object.entries(links)) {
    if (!sets[k]) { err(file, where, `unknown link group "${k}"`); continue; }
    if (!Array.isArray(v)) { err(file, `${where}.${k}`, 'must be an array'); continue; }
    v.forEach(id => { if (!sets[k].includes(id)) err(file, `${where}.${k}`, `unknown id "${id}"`); });
  }
}

/* ---------- load ---------- */
const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'registry.js'), 'utf8'), sandbox, { filename: 'registry.js' });
const C = sandbox.QA_CONTENT;
const SKIP = new Set(['registry.js', 'roadmap-data.js', 'interview-bank.js']);
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.js') && !SKIP.has(f)).sort();
const origin = { lessons: [], bank: [], drills: [], scenarios: [], interview: [] };
for (const f of files) {
  const before = { lessons: C.lessons.length, bank: C.bank.length, drills: C.drills.length, scenarios: C.scenarios.length, interview: C.interview.length };
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }); }
  catch (e) { err(f, 'load', `script error: ${e.message}`); continue; }
  for (const k of Object.keys(origin)) for (let i = before[k]; i < C[k].length; i++) origin[k][i] = f;
}
const report = f => !ONLY || f === ONLY;
const TX = C.taxonomy;
if (TX && TX.path) { for (const k of Object.keys(OUTLINE)) delete OUTLINE[k]; Object.assign(OUTLINE, TX.path); }
else err('taxonomy.js', 'load', 'taxonomy missing — lesson order falls back to the built-in outline');
C.finalize && C.finalize();


/* ---------- lessons ---------- */
const lessonIds = new Map(), nSeen = new Set();
C.lessons.forEach((l, i) => {
  const f = origin.lessons[i];
  const w = `lesson ${l && l.id || '#' + i}`;
  if (!STAGES.includes(l.stage)) err(f, w, `unknown stage "${l.stage}"`);
  if (!isStr(l.id) || !/^[a-z]{2}-[a-z0-9-]+$/.test(l.id)) err(f, w, 'bad id');
  if (lessonIds.has(l.id)) err(f, w, `duplicate id (also in ${lessonIds.get(l.id)})`); else lessonIds.set(l.id, f);
  if (OUTLINE[l.stage] && !OUTLINE[l.stage].includes(l.id)) err(f, w, `id not in the outline for stage ${l.stage}`);
  if (!Number.isInteger(l.n)) err(f, w, 'n must be an integer');
  else { const key = l.stage + ':' + l.n; if (nSeen.has(key)) err(f, w, `n ${l.n} already used in stage ${l.stage}`); nSeen.add(key); }
  if (!LEVELS.includes(l.level)) err(f, w, 'bad level');
  checkPlain(f, w + '.title', l.title);
  checkPlain(f, w + '.summary', l.summary);
  if (isStr(l.summary) && l.summary.length > 180) warn(f, w, 'summary longer than 160 chars');
  if (!Number.isInteger(l.minutes) || l.minutes < 5 || l.minutes > 40) err(f, w, 'minutes must be an integer 5–40');
  if (!Array.isArray(l.objectives) || l.objectives.length < 3 || l.objectives.length > 5) err(f, w, 'objectives needs 3–4 items');
  else l.objectives.forEach((x, k) => checkPlain(f, `${w}.objectives[${k}]`, x));
  checkBlocks(f, w + '.body', l.body, 7, 14);
  if (Array.isArray(l.body)) {
    if (!l.body.some(b => b && VISUAL.has(b.t))) err(f, w, 'body needs at least one visual block (table/flow/compare/cards)');
    const bw = l.body.reduce((n, b) => n + words(b.html || b.text || (b.items || []).map(x => typeof x === 'string' ? x : (x.title + ' ' + x.html)).join(' ') + (b.rows ? b.rows.flat().join(' ') : '') + (b.a ? b.a.items.join(' ') + b.b.items.join(' ') : '')), 0);
    if (bw < 450) warn(f, w, `body is short (${bw} words; aim 600–1100)`);
  }
  if (!l.example || !isStr(l.example.title)) err(f, w, 'example needs a title');
  else checkBlocks(f, w + '.example', l.example.blocks, 2, 6);
  if (!l.explain || typeof l.explain !== 'object') err(f, w, 'explain missing');
  else LANGS.forEach(lang => {
    const s = l.explain[lang];
    if (!isStr(s)) return err(f, w, `explain.${lang} missing`);
    checkPlain(f, `${w}.explain.${lang}`, s);
    const n = words(s);
    if (lang !== 'ur' && lang !== 'ar' && lang !== 'hi' && (n < 45 || n > 190)) warn(f, w, `explain.${lang} is ${n} words (aim 60–140)`);
    if (lang === 'ur' && !/[؀-ۿ]/.test(s)) err(f, w, 'explain.ur must be in Urdu script');
    if (lang === 'ar' && !/[؀-ۿ]/.test(s)) err(f, w, 'explain.ar must be in Arabic script');
    if (lang === 'hi' && !/[ऀ-ॿ]/.test(s)) err(f, w, 'explain.hi must be in Devanagari');
  });
  if (l.explain) EXTRA_LANGS.forEach(lang => {
    const s2 = l.explain[lang];
    if (!isStr(s2)) { (STRICT ? errors : warnings).push(`${f} · ${w}: explain.${lang} missing (explain-${lang}.js)`); return; }
    checkPlain(f, `${w}.explain.${lang}`, s2);
    if (SCRIPT[lang] && !SCRIPT[lang].test(s2)) err(f, w, `explain.${lang} is not in the expected script`);
    if (!SCRIPT[lang] && /[\u0600-\u06FF\u0900-\u097F\u4e00-\u9fff]/.test(s2)) err(f, w, `explain.${lang} contains non-Latin script`);
  });
  const vis = l.visuals || [];
  if (!vis.length) (STRICT ? errors : warnings).push(`${f} · ${w}: no visual guide yet (visuals-*.js)`);
  if (vis.length > 4) warn(f, w, `${vis.length} visuals (aim 1–3)`);
  vis.forEach((b, k) => { if (!b || !DIAGRAMS.has(b.t)) err(f, `${w}.visuals[${k}]`, 'visuals must be diagram blocks'); else { if (!isStr(b.title)) err(f, `${w}.visuals[${k}]`, 'visual needs a title'); if (!isStr(b.caption)) err(f, `${w}.visuals[${k}]`, 'visual needs a caption'); } });
  checkBlocks(f, w + '.visuals', vis, 0, 4);
  if (!Array.isArray(l.keyTerms) || l.keyTerms.length < 3 || l.keyTerms.length > 7) err(f, w, 'keyTerms needs 3–6 items');
  else l.keyTerms.forEach((k, j) => { checkPlain(f, `${w}.keyTerms[${j}].term`, k && k.term); checkPlain(f, `${w}.keyTerms[${j}].def`, k && k.def); });
  if (!Array.isArray(l.practice) || l.practice.length < 3 || l.practice.length > 5) err(f, w, 'practice needs 3–4 items');
  else l.practice.forEach((p, j) => { checkHtml(f, `${w}.practice[${j}].q`, p && p.q); checkHtml(f, `${w}.practice[${j}].answer`, p && p.answer); if (p && p.hint !== undefined) checkPlain(f, `${w}.practice[${j}].hint`, p.hint); });
  if (!Array.isArray(l.quiz) || l.quiz.length !== 5) err(f, w, 'quiz must have exactly 5 questions');
  if (Array.isArray(l.quiz)) l.quiz.forEach((q, j) => checkMcq(f, `${w}.quiz[${j}]`, q));
  if (!Array.isArray(l.interview) || l.interview.length < 1 || l.interview.length > 3) err(f, w, 'interview needs 1–3 items');
  else l.interview.forEach((x, j) => { checkPlain(f, `${w}.interview[${j}].q`, x && x.q); checkHtml(f, `${w}.interview[${j}].a`, x && x.a); });
  if (!Array.isArray(l.takeaways) || l.takeaways.length < 3 || l.takeaways.length > 6) err(f, w, 'takeaways needs 3–5 items');
  else l.takeaways.forEach((x, j) => checkHtml(f, `${w}.takeaways[${j}]`, x));
  checkLinks(f, w + '.links', l.links);
});

/* ---------- bank ---------- */
const bankSeen = new Set();
C.bank.forEach((q, i) => {
  const f = origin.bank[i], w = `bank[${i}]`;
  if (!STAGES.includes(q.stage)) err(f, w, 'unknown stage');
  if (!LEVELS.includes(q.level)) err(f, w, 'bad level');
  if (!OUTLINE[q.stage] || !OUTLINE[q.stage].includes(q.topic)) err(f, w, `topic "${q.topic}" is not a lesson id of stage ${q.stage}`);
  checkMcq(f, w, q);
  const key = String(q.q).trim().toLowerCase();
  if (bankSeen.has(key)) err(f, w, 'duplicate question text'); bankSeen.add(key);
});
// bank must not copy lesson quiz questions
const quizTexts = new Set(C.lessons.flatMap(l => (l.quiz || []).map(q => String(q.q).trim().toLowerCase())));
C.bank.forEach((q, i) => { if (quizTexts.has(String(q.q).trim().toLowerCase())) err(origin.bank[i], `bank[${i}]`, 'copies a lesson quiz question'); });

/* ---------- drills ---------- */
const drillIds = new Set();
C.drills.forEach((d, i) => {
  const f = origin.drills[i], w = `drill ${d && d.id || '#' + i}`;
  if (!isStr(d.id)) err(f, w, 'id missing'); else if (drillIds.has(d.id)) err(f, w, 'duplicate id'); else drillIds.add(d.id);
  if (!STAGES.includes(d.stage)) err(f, w, 'unknown stage');
  if (!LEVELS.includes(d.level)) err(f, w, 'bad level');
  checkPlain(f, w + '.title', d.title); checkPlain(f, w + '.prompt', d.prompt);
  if (d.type === 'classify') {
    if (!Array.isArray(d.categories) || d.categories.length < 2 || d.categories.length > 4) err(f, w, 'categories needs 2–4');
    if (!Array.isArray(d.items) || d.items.length < 4 || d.items.length > 9) err(f, w, 'items needs 5–8');
    else d.items.forEach((x, k) => {
      checkPlain(f, `${w}.items[${k}].text`, x && x.text); checkHtml(f, `${w}.items[${k}].why`, x && x.why);
      if (!Number.isInteger(x.cat) || x.cat < 0 || x.cat >= (d.categories || []).length) err(f, `${w}.items[${k}]`, 'cat out of range');
    });
  } else if (d.type === 'order') {
    if (!Array.isArray(d.items) || d.items.length < 4 || d.items.length > 8) err(f, w, 'order needs 4–7 items');
    else d.items.forEach((x, k) => checkPlain(f, `${w}.items[${k}]`, x));
    checkHtml(f, w + '.explain', d.explain);
  } else if (d.type === 'spot') {
    if (!Array.isArray(d.lines) || d.lines.length < 5 || d.lines.length > 10) err(f, w, 'spot needs 5–9 lines');
    else {
      const flaws = d.lines.filter(x => x && x.flaw === true).length;
      if (flaws < 1 || flaws > 5) err(f, w, `spot needs 2–4 flawed lines (has ${flaws})`);
      d.lines.forEach((x, k) => { checkPlain(f, `${w}.lines[${k}].text`, x && x.text); checkHtml(f, `${w}.lines[${k}].why`, x && x.why); if (typeof (x && x.flaw) !== 'boolean') err(f, `${w}.lines[${k}]`, 'flaw must be boolean'); });
    }
  } else if (d.type === 'fill') {
    if (!Array.isArray(d.fields) || d.fields.length < 2 || d.fields.length > 6) err(f, w, 'fill needs 2–6 fields');
    else d.fields.forEach((x, k) => {
      checkPlain(f, `${w}.fields[${k}].label`, x && x.label); checkHtml(f, `${w}.fields[${k}].why`, x && x.why);
      if (!Array.isArray(x.accept) || !x.accept.length || x.accept.some(a => !isStr(String(a)))) err(f, `${w}.fields[${k}]`, 'accept needs ≥1 answer');
    });
  } else err(f, w, `unknown drill type "${d.type}"`);
});

/* ---------- scenarios ---------- */
const scIds = new Set();
C.scenarios.forEach((s, i) => {
  const f = origin.scenarios[i], w = `scenario ${s && s.id || '#' + i}`;
  if (!isStr(s.id) || !/^sc-[a-z0-9-]+$/.test(s.id)) err(f, w, 'id must start with sc-');
  else if (scIds.has(s.id)) err(f, w, 'duplicate id'); else scIds.add(s.id);
  checkPlain(f, w + '.title', s.title); checkPlain(f, w + '.summary', s.summary);
  if (!LEVELS.includes(s.level)) err(f, w, 'bad level');
  if (!Array.isArray(s.stages) || !s.stages.length || s.stages.some(x => !STAGES.includes(x))) err(f, w, 'stages must be valid stage ids');
  if (!Number.isInteger(s.minutes)) err(f, w, 'minutes must be an integer');
  checkBlocks(f, w + '.brief', s.brief, 2, 7);
  if (!Array.isArray(s.questions) || s.questions.length < 5 || s.questions.length > 9) err(f, w, 'questions needs 6–8');
  else {
    s.questions.forEach((q, k) => checkMcq(f, `${w}.questions[${k}]`, q, { allowMulti: true, maxOptions: 5 }));
    if (!s.questions.some(q => Array.isArray(q.correct))) warn(f, w, 'include at least one multi-select question');
  }
});

/* ---------- interview bank ---------- */
const IV_CATS = ['fundamentals', 'design', 'defects', 'agile', 'scenario', 'api', 'sql', 'automation', 'playwright', 'coding', 'nonfunctional', 'mobile', 'behavioral'];
const ivIds = new Set(), ivQs = new Set();
C.interview.forEach((q, i) => {
  const f = origin.interview[i], w = `interview ${q && q.id || '#' + i}`;
  if (!q || !isStr(q.id) || !/^iq-[a-z0-9-]+$/.test(q.id)) return err(f, w, 'id must start with iq-');
  if (ivIds.has(q.id)) err(f, w, 'duplicate id'); ivIds.add(q.id);
  if (!IV_CATS.includes(q.cat)) err(f, w, `cat must be one of ${IV_CATS.join(', ')}`);
  if (!LEVELS.includes(q.level)) err(f, w, 'bad level');
  if (!['very-common', 'common', 'occasional'].includes(q.freq)) err(f, w, 'freq must be very-common | common | occasional');
  checkPlain(f, w + '.q', q.q);
  const key = String(q.q || '').trim().toLowerCase(); if (ivQs.has(key)) err(f, w, 'duplicate question text'); ivQs.add(key);
  checkPlain(f, w + '.short', q.short); if (isStr(q.short) && q.short.length > 300) warn(f, w, 'short answer longer than 260 chars');
  checkHtml(f, w + '.answer', q.answer); const aw = words(q.answer); if (aw < 50 || aw > 260) warn(f, w, `answer is ${aw} words (aim 70–200)`);
  if (!Array.isArray(q.followups) || q.followups.length < 1 || q.followups.length > 4) err(f, w, 'followups needs 1–3 items'); else q.followups.forEach((x, k) => checkPlain(f, `${w}.followups[${k}]`, x));
  if (!Array.isArray(q.mistakes) || q.mistakes.length < 1 || q.mistakes.length > 3) err(f, w, 'mistakes needs 1–2 items'); else q.mistakes.forEach((x, k) => checkPlain(f, `${w}.mistakes[${k}]`, x));
  if (q.lesson !== undefined && !lessonIds.has(q.lesson) && !Object.values(OUTLINE).flat().includes(q.lesson)) err(f, w, `lesson "${q.lesson}" is not a lesson id`);
});

/* ---------- taxonomy ---------- */
if (TX) {
  const all = Object.values(TX.path || {}).flat(), seen = new Set();
  all.forEach(id => { if (seen.has(id)) err('taxonomy.js', 'path', `"${id}" appears twice`); seen.add(id); });
  for (const [stage, ids] of Object.entries(TX.path || {})) ids.forEach(id => { const l = C.lessons.find(x => x.id === id); if (l && l.stage !== stage) err('taxonomy.js', 'path', `"${id}" listed under ${stage} but registered in ${l.stage}`); });
  C.lessons.forEach(l => { if (!seen.has(l.id)) err('taxonomy.js', 'path', `lesson "${l.id}" is not in path`); });
  const inGroup = new Map();
  (TX.groups || []).forEach(g => (g.lessons || []).forEach(id => { if (inGroup.has(id)) err('taxonomy.js', 'groups', `"${id}" is in both ${inGroup.get(id)} and ${g.id}`); inGroup.set(id, g.id); if (!seen.has(id)) err('taxonomy.js', `groups.${g.id}`, `unknown lesson "${id}"`); }));
  all.forEach(id => { if (!inGroup.has(id)) err('taxonomy.js', 'groups', `"${id}" is in no group`); });
  (TX.collections || []).forEach(c => (c.lessons || []).forEach(id => { if (!seen.has(id)) err('taxonomy.js', `collections.${c.id}`, `unknown lesson "${id}"`); }));
  for (const [id, reqs] of Object.entries(TX.requires || {})) [id, ...reqs].forEach(x => { if (!seen.has(x)) err('taxonomy.js', 'requires', `unknown lesson "${x}"`); });
}

/* ---------- coverage & distribution ---------- */
for (const [stage, ids] of Object.entries(OUTLINE)) {
  const missing = ids.filter(id => !lessonIds.has(id));
  if (missing.length) (STRICT ? errors : warnings).push(`coverage · ${stage}: missing lessons ${missing.join(', ')}`);
}
for (const [f, st] of Object.entries(mcqStats)) {
  if (st.total >= 12) {
    st.pos.slice(0, 4).forEach((n, p) => { const share = n / st.total; if (share > 0.4 || share < 0.12) warn(f, 'answer spread', `position ${'ABCD'[p]} holds ${(share * 100).toFixed(0)}% of correct answers (${st.pos.slice(0, 4).join('/')})`); });
    if (st.longest / st.total > 0.5) warn(f, 'answer spread', `the longest option is correct in ${(100 * st.longest / st.total).toFixed(0)}% of questions`);
  }
}

const fe = errors.filter(e => report(e.split(' · ')[0]) || e.startsWith('coverage'));
const fw = warnings.filter(e => report(e.split(' · ')[0]) || e.startsWith('coverage'));
console.log(`Files: ${files.join(', ') || '(none)'}`);
console.log(`Lessons ${C.lessons.length} · bank ${C.bank.length} · drills ${C.drills.length} · scenarios ${C.scenarios.length} · interview ${C.interview.length} · lessons with visuals ${C.lessons.filter(l => (l.visuals || []).length).length}`);
for (const [f, st] of Object.entries(mcqStats)) if (report(f)) console.log(`  ${f}: ${st.total} single-answer MCQs, correct positions A/B/C/D = ${st.pos.slice(0, 4).join('/')}`);
if (fw.length) { console.log(`\nWarnings (${fw.length}):`); fw.forEach(x => console.log('  ! ' + x)); }
if (fe.length) { console.log(`\nErrors (${fe.length}):`); fe.forEach(x => console.log('  ✗ ' + x)); process.exitCode = 1; }
else console.log('\n✓ 0 errors');
