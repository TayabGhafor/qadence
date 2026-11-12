#!/usr/bin/env node
/* Qadence · SEO / GEO / AEO build step. No dependencies. Usage (from sqa-interview-practice/):
     node tools/build-seo.js            # regenerate everything below (only changed files are written)
     node tools/build-seo.js --check    # exit 1 if any generated output is out of date (writes nothing)

   Loads the real browser scripts in a sandbox (js/icons.js, js/i18n.js, every content/*.js in the order
   index.html loads them, js/core.js) and runs the real renderLandingLevels() from js/app.js, so the
   static markup is exactly what the app renders. It regenerates:
     dist/index.html     the blocks between <!-- seo:NAME --> … <!-- /seo:NAME --> markers:
                         meta (title, description, canonical, Open Graph, Twitter), jsonld (one @graph),
                         levels (#landingLevels, pre-rendered) and faq (visible FAQ — edit the FAQ text HERE,
                         the FAQPage JSON-LD is built from the same strings so they always match word for word);
                         plus the landing stat numbers (data-count / data-seo-count).
     dist/llms.txt, dist/sitemap.xml, dist/robots.txt, dist/manifest.webmanifest, dist/404.html
   Idempotent: running it twice changes nothing. sitemap <lastmod> only moves when the generated pages
   or the content files change (tracked by a hash comment inside sitemap.xml). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

/* The one place the public URL lives. Change it (keep the trailing slash) and re-run. */
const SITE_URL = 'https://tayabghafor.github.io/qadence/';
const REPO_URL = 'https://github.com/TayabGhafor/qadence';

const DIST = path.join(__dirname, '..', 'dist');
const CHECK = process.argv.includes('--check');
const read = f => fs.readFileSync(path.join(DIST, f), 'utf8');

/* ───────────── load the app's own data ───────────── */
function collect() {
  const html = read('index.html');
  const captured = { levels: null, counts: {} };
  const levelsRoot = { set innerHTML(v) { captured.levels = v; }, get innerHTML() { return captured.levels || ''; } };
  const countEl = name => ({ dataset: { count: name }, set textContent(v) { captured.counts[name] = String(v); } });
  const storage = { getItem: () => null, setItem() {}, removeItem() {} };
  const document = {
    body: null, documentElement: { setAttribute() {}, removeAttribute() {}, getAttribute: () => null },
    addEventListener() {}, getElementById: id => (id === 'landingLevels' ? levelsRoot : null),
    querySelector: () => null,
    querySelectorAll: sel => (sel === '[data-count]' ? ['lessons', 'questions', 'scenarios'].map(countEl) : [])
  };
  const sb = { console, document, localStorage: storage, matchMedia: () => ({ matches: false, addEventListener() {} }), CustomEvent: function () {}, setTimeout, clearTimeout };
  sb.window = sb; sb.self = sb;
  vm.createContext(sb);
  const run = f => vm.runInContext(read(f), sb, { filename: f });
  run('js/icons.js');
  run('js/i18n.js');
  /* Content files in load order: listed in index.html's script loader (or as plain <script src> tags). */
  const contentFiles = [...html.matchAll(/(?:\bsrc="|')(content\/[^"']+\.js)["']/g)].map(m => m[1]);
  if (!contentFiles.includes('content/registry.js')) throw new Error('index.html does not load content/registry.js');
  contentFiles.forEach(run);
  run('js/core.js');

  /* Run the real landing renderer from js/app.js. */
  const app = read('js/app.js');
  const start = app.indexOf('function renderLandingLevels()');
  if (start < 0) throw new Error('renderLandingLevels() not found in js/app.js');
  let i = app.indexOf('{', start), depth = 0, end = -1;
  for (; i < app.length; i++) { if (app[i] === '{') depth++; else if (app[i] === '}' && --depth === 0) { end = i + 1; break; } }
  const fnSrc = app.slice(start, end);
  vm.runInContext(`(() => { const esc = s => escapeHtml(s == null ? '' : s);\n${fnSrc}\nrenderLandingLevels(); })();`, sb, { filename: 'app.js#renderLandingLevels' });
  if (!captured.levels) throw new Error('renderLandingLevels() produced no markup');

  const g = expr => vm.runInContext(expr, sb);
  const C = g('CONTENT');
  const lessons = g('LESSONS.map(l => ({ id: l.id, stage: l.stage, level: l.level, title: l.title, minutes: l.minutes, quiz: (l.quiz || []).length, visuals: (l.visuals || []).length, explain: Object.keys(l.explain || {}) }))');
  const stageOrder = g('STAGE_ORDER.slice()');
  const langs = g('QA_I18N.langs.map(l => ({ code: l.code, name: l.name, native: l.native, dir: l.dir }))');
  const stageName = id => g(`t(${JSON.stringify('stage.' + id)})`);
  const explainCodes = new Set(lessons.flatMap(l => l.explain));
  const roadmap = (sb.SQA_LEARNING && sb.SQA_LEARNING.stages) || [];
  const hours = id => { const st = roadmap.find(s => s.id === id); return st && Array.isArray(st.hours) ? st.hours : null; };
  const basePace = ((sb.SQA_LEARNING && sb.SQA_LEARNING.paces) || []).find(p => p.id === 'base') || {};
  const weeksMatch = String(basePace.total || '').match(/about (\d+) weeks/);

  /* Interview topic names live in js/interview.js (CATS); fall back to the category id. */
  const ivSrc = read('js/interview.js');
  const catsSrc = (ivSrc.match(/const CATS = \[([\s\S]*?)\]\.filter\(/) || [, ''])[1];   // only the CATS array literal
  const ivNames = Object.fromEntries([...catsSrc.matchAll(/\['([a-z]+)', '[a-z0-9-]+', '([^']+)'\]/g)].map(m => [m[1], m[2]]));
  const ivCats = [];
  C.interview.forEach(q => { let c = ivCats.find(x => x.id === q.cat); if (!c) ivCats.push(c = { id: q.cat, name: ivNames[q.cat] || q.cat, n: 0 }); c.n++; });
  const ivOrder = Object.keys(ivNames); ivCats.sort((a, b) => ivOrder.indexOf(a.id) - ivOrder.indexOf(b.id));

  const stages = stageOrder.map((id, k) => ({ id, n: k + 1, name: stageName(id), hours: hours(id), lessons: lessons.filter(l => l.stage === id) }));
  const quizSizes = [...new Set(lessons.map(l => l.quiz))];
  const s = {
    lessons: lessons.length,
    stages: stages.length,
    mcqs: Number(captured.counts.questions),
    lessonChecks: lessons.reduce((n, l) => n + l.quiz, 0),
    bank: C.bank.length,
    scenarios: C.scenarios.length,
    scenarioQs: C.scenarios.reduce((n, x) => n + x.questions.length, 0),
    drills: C.drills.length,
    interview: C.interview.length,
    ivTopics: ivCats.length,
    diagrams: lessons.reduce((n, l) => n + l.visuals, 0),
    quizSize: quizSizes.length === 1 ? quizSizes[0] : null,
    explainLangs: langs.filter(l => explainCodes.has(l.code)),
    uiLangs: langs,
    hoursLo: stages.reduce((n, x) => n + (x.hours ? x.hours[0] : 0), 0),
    hoursHi: stages.reduce((n, x) => n + (x.hours ? x.hours[1] : 0), 0),
    groups: (C.taxonomy && C.taxonomy.groups || []).map(x => x.name),
    weeks: weeksMatch ? Number(weeksMatch[1]) : 24,
    pace: basePace.label || '10–12 hours a week'
  };
  const lvlCount = lv => lessons.filter(l => l.level === lv).length;
  s.byLevel = { beginner: lvlCount('beginner'), intermediate: lvlCount('intermediate'), advanced: lvlCount('advanced') };
  if (String(s.lessons) !== captured.counts.lessons || String(s.scenarios) !== captured.counts.scenarios) throw new Error('landing counters disagree with the content index');
  return { s, stages, ivCats, levelsHtml: captured.levels, counts: captured.counts, contentFiles };
}

/* ───────────── copy (edit the FAQ here) ───────────── */
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const list = a => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
const lcFirst = x => (/^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);   // "Manual testing" → "manual testing", keeps "QA", "SQL"

function copy({ s, stages }) {
  const nEx = s.explainLangs.length, nUi = s.uiLangs.length;
  const weeks = s.weeks;   // roadmap baseline pace (content/roadmap-data.js "base")
  const faq = [
    { q: 'What is Qadence?',
      a: `Qadence is a free, open-source website for learning software testing and quality assurance (QA) step by step, from your first test case to automation, APIs, performance and security. It has ${s.lessons} lessons in ${s.stages} stages, ${s.mcqs} multiple-choice questions, ${s.scenarios} scenario tests, ${s.drills} practice drills and ${s.interview} interview questions, and it runs entirely in your browser.` },
    { q: 'Is Qadence free, and do I need an account?',
      a: 'Yes, Qadence is completely free and open source under the MIT License. There is no sign-up: the sign-in screen shows a shared demo login that anyone can use, and it is a simple gate, not a real account.' },
    { q: 'What will I learn?',
      a: `You learn software testing in ${s.stages} stages: ${list(stages.map(x => lcFirst(x.name)))}. Every lesson is tagged beginner, intermediate or advanced and has a visual guide, a worked example, practice exercises${s.quizSize ? ` and a ${s.quizSize}-question quick check` : ' and a quick check'}.` },
    { q: 'Does Qadence help with QA interviews and the ISTQB Foundation exam?',
      a: `Yes. The lessons are mapped to the ISTQB CTFL v4.0.1 syllabus, and the interview prep has ${s.interview} frequently asked questions in ${s.ivTopics} topics with model answers, flashcards and mock interviews. Qadence is an independent project and is not affiliated with or endorsed by ISTQB.` },
    { q: 'Which languages does Qadence support?',
      a: `Lessons are written in English, and every lesson adds a simple explanation in ${nEx} languages: ${list(s.explainLangs.map(l => l.name))}. The whole interface can switch to any of these ${nUi} languages, with a right-to-left layout for Urdu and Arabic.` },
    { q: 'Where is my progress saved?',
      a: 'Only in this browser’s local storage on your device; nothing is sent to a server. Progress does not sync across browsers or devices, and clearing this site’s browser data deletes it, so export a backup from Data & privacy if you want to keep it.' },
    { q: 'How long does it take to finish?',
      a: `The full roadmap is planned at about ${weeks} weeks, or roughly ${s.hoursLo}–${s.hoursHi} hours of study at ${s.pace}. These are planning estimates, not a promise: go at your own pace, and finishing the course does not guarantee a job.` }
  ];
  const title = 'Qadence — Learn Software Testing & QA, Step by Step';
  const description = `Free, open-source course to learn software testing and QA step by step: ${s.lessons} lessons in ${s.stages} stages, ${s.mcqs} MCQs, scenario tests, drills and QA interview prep.`;
  const ogDescription = `${s.lessons} lessons in ${s.stages} stages, ${s.mcqs} MCQs, ${s.scenarios} scenario tests, ${s.drills} drills and ${s.interview} interview questions — with simple explanations in ${nEx} languages. Free, open source, runs in your browser.`;
  const imageAlt = `Qadence — learn software testing step by step. ${s.lessons} lessons, ${s.mcqs} MCQs, ${s.interview} interview questions, ${nEx} explanation languages. Free and open source.`;
  if (title.length > 60) throw new Error(`title is ${title.length} chars (max 60)`);
  if (description.length < 140 || description.length > 160) throw new Error(`meta description is ${description.length} chars (want 140–160): ${description}`);
  return { faq, title, description, ogDescription, imageAlt, weeks };
}

/* ───────────── index.html blocks ───────────── */
function metaBlock(c) {
  const img = SITE_URL + 'assets/og-image.png';
  return [
    `<title>${esc(c.title)}</title>`,
    `<meta name="description" content="${esc(c.description)}">`,
    `<link rel="canonical" href="${SITE_URL}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Qadence">',
    `<meta property="og:title" content="${esc(c.title)}">`,
    `<meta property="og:description" content="${esc(c.ogDescription)}">`,
    `<meta property="og:url" content="${SITE_URL}">`,
    `<meta property="og:image" content="${img}">`,
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(c.imageAlt)}">`,
    '<meta property="og:locale" content="en_US">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(c.title)}">`,
    `<meta name="twitter:description" content="${esc(c.ogDescription)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${esc(c.imageAlt)}">`
  ].map(x => '  ' + x).join('\n');
}

function jsonLd(d, c) {
  const { s, stages } = d;
  const org = { '@id': SITE_URL + '#organization' };
  const language = l => ({ '@type': 'Language', name: l.name, alternateName: l.code });
  const free = extra => Object.assign({ '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, extra || {});
  const graph = [
    { '@type': 'WebSite', '@id': SITE_URL + '#website', url: SITE_URL, name: 'Qadence', alternateName: 'SQA Practice Room', description: c.description, inLanguage: 'en', publisher: org },
    { '@type': 'Organization', '@id': SITE_URL + '#organization', name: 'Qadence', url: SITE_URL,
      logo: { '@type': 'ImageObject', url: SITE_URL + 'assets/icon-512.png', width: 512, height: 512 }, sameAs: [REPO_URL] },
    { '@type': 'WebApplication', '@id': SITE_URL + '#app', name: 'Qadence', url: SITE_URL, description: c.ogDescription,
      applicationCategory: 'EducationalApplication', operatingSystem: 'Any — runs in a web browser', browserRequirements: 'Requires JavaScript and a modern web browser.',
      offers: free(), isAccessibleForFree: true, inLanguage: s.uiLangs.map(language),   // schema.org defines availableLanguage on Course, not on WebApplication
      image: SITE_URL + 'assets/og-image.png', license: 'https://opensource.org/licenses/MIT', publisher: org },
    { '@type': 'Course', '@id': SITE_URL + '#course', name: 'Software testing and QA, step by step',
      description: `A free, self-paced software testing (SQA) course from beginner to advanced: ${s.lessons} lessons in ${s.stages} stages mapped to the ISTQB CTFL v4.0.1 syllabus, with ${s.mcqs} MCQs, ${s.scenarios} scenario tests, ${s.drills} practice drills and ${s.interview} interview questions. Every lesson adds a simple explanation in ${s.explainLangs.length} languages.`,
      url: SITE_URL, provider: Object.assign({ '@type': 'Organization', name: 'Qadence', sameAs: REPO_URL }, org),
      educationalLevel: 'Beginner to Advanced', coursePrerequisites: 'None — no prior testing or programming experience needed.',
      inLanguage: 'en', availableLanguage: [language(s.uiLangs[0])].concat(s.explainLangs.map(language)), isAccessibleForFree: true,
      offers: free({ category: 'Free' }),
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `PT${s.hoursLo}H`,
        description: `Self-paced. The roadmap baseline is about ${c.weeks} weeks at ${s.pace} (${s.hoursLo}–${s.hoursHi} hours) — a planning estimate, not a guarantee.` },
      teaches: s.groups,
      syllabusSections: stages.map(x => Object.assign({ '@type': 'Syllabus', name: `Stage ${x.n}: ${x.name}`,
        description: `${x.lessons.length} lessons: ${x.lessons.map(l => l.title).join('; ')}.` }, x.hours ? { timeRequired: `PT${x.hours[0]}H` } : {})) },
    { '@type': 'FAQPage', '@id': SITE_URL + '#faq', url: SITE_URL + '#faq', inLanguage: 'en',
      mainEntity: c.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  ];
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1).replace(/</g, '\\u003c');
  JSON.parse(json);   // must stay valid JSON
  return `  <script type="application/ld+json">\n${json}\n  </script>`;
}

function faqBlock(c) {
  const items = c.faq.map((f, k) => `        <details class="l-faq-item"${k === 0 ? ' open' : ''}><summary><h3>${esc(f.q)}</h3><svg class="ic" aria-hidden="true" focusable="false"><use href="#i-chevron-down"></use></svg></summary><div class="l-faq-a"><p>${esc(f.a)}</p></div></details>`).join('\n');
  return `  <section id="faq" class="l-section" lang="en" dir="ltr" aria-labelledby="faqTitle">
    <div class="l-container l-faq-wrap">
      <div class="l-head"><span class="eyebrow">FAQ</span><h2 id="faqTitle">Questions, answered.</h2><p>Quick answers about what Qadence is, what it costs, what you learn and where your progress lives.</p></div>
      <div class="l-faq">
${items}
      </div>
    </div>
  </section>`;
}

function replaceBlock(html, name, body) {
  const re = new RegExp(`^([ \\t]*)(<!-- seo:${name}\\b[^>]*-->)[\\s\\S]*?(<!-- /seo:${name} -->)`, 'm');
  if (!re.test(html)) throw new Error(`marker <!-- seo:${name} --> … <!-- /seo:${name} --> missing in dist/index.html`);
  return html.replace(re, (m, ind, a, b) => `${ind}${a}\n${body}\n${ind}${b}`);
}
function replaceInline(html, name, body) {   // same, without line breaks (inside an element)
  const re = new RegExp(`(<!-- seo:${name} -->)[\\s\\S]*?(<!-- /seo:${name} -->)`);
  if (!re.test(html)) throw new Error(`marker <!-- seo:${name} --> missing in dist/index.html`);
  return html.replace(re, (m, a, b) => a + body + b);
}

function buildIndex(d, c) {
  let html = read('index.html');
  html = replaceBlock(html, 'meta', metaBlock(c));
  html = replaceBlock(html, 'jsonld', jsonLd(d, c));
  html = replaceInline(html, 'levels', d.levelsHtml);
  html = replaceBlock(html, 'faq', faqBlock(c));
  for (const [k, v] of Object.entries(d.counts)) html = html.replace(new RegExp(`(<b data-count="${k}">)[^<]*(</b>)`), `$1${v}$2`);
  html = html.replace(/(<b data-seo-count="langs">)[^<]*(<\/b>)/, `$1${d.s.explainLangs.length}$2`);
  return html;
}

/* ───────────── llms.txt ───────────── */
function llms(d, c) {
  const { s, stages, ivCats } = d;
  const L = [];
  L.push('# Qadence', '');
  L.push(`> Qadence is a free, open-source, browser-only course for learning software testing and quality assurance (QA) step by step: ${s.lessons} lessons in ${s.stages} stages mapped to the ISTQB CTFL v4.0.1 syllabus, ${s.mcqs} MCQs, ${s.scenarios} scenario tests, ${s.drills} practice drills and ${s.interview} interview questions, with a simple explanation of every lesson in ${s.explainLangs.length} languages.`, '');
  L.push(`Qadence is for people starting a QA career and for junior QA Engineers and QA Analysts (about 1–2 years) preparing for interviews, with advanced material for growth. The site is a static single page: the landing page at ${SITE_URL} is public; the app itself runs in the browser behind a shared demo login that is shown on the sign-in screen (a navigation gate, not an account). There are no separate lesson URLs — screens use client-side "#/..." routes.`, '');
  L.push('Key facts:', '');
  L.push('- Free and open source (MIT License). No sign-up, no payments, no ads, no analytics and no external requests — fonts are bundled.');
  L.push('- Progress is stored only in this browser’s localStorage, per learner profile. Nothing syncs across browsers or devices; clearing site data deletes it. The Data & privacy screen exports and imports a JSON backup.');
  L.push(`- English is the primary language. Simple explanations: ${list(s.explainLangs.map(l => (l.native === l.name ? l.name : `${l.name} (${l.native})`)))}. The interface switches to any of these ${s.uiLangs.length} languages; Urdu and Arabic use right-to-left layout.`);
  L.push('- Lessons are mapped to the ISTQB CTFL v4.0.1 syllabus. Qadence is independent: not affiliated with, endorsed or certified by ISTQB.');
  L.push(`- The career roadmap is planned at about ${c.weeks} weeks (${s.hoursLo}–${s.hoursHi} hours at ${s.pace}). These are planning estimates, not a job guarantee.`);
  L.push(`- Content totals: ${s.lessons} lessons (${s.byLevel.beginner} beginner, ${s.byLevel.intermediate} intermediate, ${s.byLevel.advanced} advanced) · ${s.mcqs} MCQs (${s.lessonChecks} lesson checks + ${s.bank} test-bank + ${s.scenarioQs} scenario questions) · ${s.diagrams} diagrams · ${s.scenarios} scenario tests · ${s.drills} drills · ${s.interview} interview questions in ${s.ivTopics} topics.`, '');
  L.push('## Links', '');
  L.push(`- [Qadence](${SITE_URL}): the live site — landing page, curriculum overview and FAQ; sign in with the demo login shown on screen to open the app`);
  L.push(`- [README](${SITE_URL}README.md): what is inside, content totals, local data, demo login and project layout`);
  L.push(`- [Source code on GitHub](${REPO_URL}): the MIT-licensed repository (static HTML, CSS and classic JavaScript, no build step)`, '');
  L.push('## Curriculum', '');
  L.push(`Each lesson has objectives, an explanation, a visual guide, a worked example, key terms, practice exercises with model answers, a ${s.quizSize || 5}-question quick check with every option explained, interview questions and takeaways.`, '');
  for (const st of stages) {
    L.push(`### Stage ${st.n}: ${st.name} (${st.lessons.length} lessons${st.hours ? `, about ${st.hours[0]}–${st.hours[1]} hours` : ''})`, '');
    st.lessons.forEach(l => L.push(`- ${l.title} (${l.level}${l.minutes ? `, ${l.minutes} min` : ''})`));
    L.push('');
  }
  L.push('## Interview prep', '');
  L.push(`A question bank of ${s.interview} frequently asked QA interview questions, each with a short answer, a model answer, likely follow-ups and mistakes to avoid; plus flashcards, mock interviews with self-scoring and scored practice rounds. Topics:`, '');
  ivCats.forEach(x => L.push(`- ${x.name} (${x.n} questions)`));
  L.push('');
  L.push('## Practice and tests', '');
  L.push('- Test Center: quick quiz, stage quizzes, timed level exams (20 questions, 25 minutes, 70% pass mark), a custom test builder and weak-topic tests, each with an explained review.');
  L.push(`- ${s.scenarios} scenario-based case studies (${s.scenarioQs} questions, some "select all that apply").`);
  L.push(`- ${s.drills} interactive drills: sort it, put in order, spot the flaw, fill the blank.`);
  L.push('- Six simulated practice apps and six challenges with a code workspace and transparent rubric feedback (submitted code is reviewed by a heuristic rubric, never executed).');
  L.push('- Career roadmap with milestones, a career ladder, readiness levels and a 30/60/90-day plan; dashboard with XP, levels, streaks and badges.', '');
  L.push('## Optional', '');
  L.push(`- [Content schema](${REPO_URL}/blob/main/tools/CONTENT_SCHEMA.md): the data contract for lessons, MCQs, drills and scenarios`);
  L.push(`- [License](${SITE_URL}LICENSE): MIT License`);
  return L.join('\n') + '\n';
}

/* ───────────── other static files ───────────── */
function robots() {
  const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'];
  return `# Qadence — everything here is public. All crawlers, including AI crawlers, are welcome.
User-agent: *
Allow: /

${ai.map(a => `User-agent: ${a}`).join('\n')}
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`;
}

function sitemap(hash, previous) {
  const old = previous && previous.match(/<!-- content-hash: ([a-f0-9]+) -->/);
  const oldDate = previous && previous.match(/<lastmod>([^<]+)<\/lastmod>/);
  const lastmod = old && old[1] === hash && oldDate ? oldDate[1] : new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by tools/build-seo.js. Only the canonical page is listed: "#/..." app routes are fragments, not URLs. -->
<!-- content-hash: ${hash} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;
}

function manifest(c) {
  return JSON.stringify({
    name: 'Qadence — Learn software testing',
    short_name: 'Qadence',
    description: c.description,
    lang: 'en',
    dir: 'ltr',
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: '#F3F6F5',
    theme_color: '#0F766E',
    categories: ['education'],
    icons: [
      { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'assets/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: 'assets/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ]
  }, null, 2) + '\n';
}

function notFound() {
  const base = new URL(SITE_URL).pathname;   // "/qadence/" — root-relative so it works at any depth under the site
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
<title>Page not found · Qadence</title>
<!-- Generated by tools/build-seo.js. GitHub Pages serves this for unknown paths; links are root-relative to ${base}. -->
<style>
  :root { color-scheme: light dark; --bg: #F3F6F5; --card: #FFFFFF; --text: #0E1B1A; --muted: #586865; --line: #E0E8E5; --brand: #0F766E; }
  @media (prefers-color-scheme: dark) { :root { --bg: #08100F; --card: #0F1A19; --text: #E8F1EF; --muted: #93A7A3; --line: #213331; --brand: #2DD4BF; } }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; background: var(--bg); color: var(--text); font: 400 16px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif; }
  main { width: min(480px, 100%); background: var(--card); border: 1px solid var(--line); border-radius: 24px; padding: 36px 28px; text-align: center; }
  svg { width: 56px; height: 56px; display: block; margin: 0 auto 18px; }
  .code { font: 700 13px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: .14em; color: var(--brand); }
  h1 { font-size: 28px; line-height: 1.15; letter-spacing: -.03em; margin: 10px 0 10px; }
  p { margin: 0 0 24px; color: var(--muted); }
  a.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 22px; border-radius: 14px; background: #0F766E; color: #fff; font-weight: 700; text-decoration: none; }
  a.btn:hover { background: #0B5E58; }
  a.btn:focus-visible { outline: 3px solid #14B8A6; outline-offset: 3px; }
</style>
</head>
<body>
<main>
  <svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16332F"/><stop offset="1" stop-color="#0A1514"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#t)"/><g transform="translate(-1.5 1.5)" fill="none" stroke-linecap="round" stroke-width="4.4"><path d="M30.5 32.6A11.5 11.5 0 1 1 35.3 22.4" stroke="#fff"/><path d="M24 27.5l4.6 4.6 10.4-10.4" stroke="#2DD4BF" stroke-linejoin="round"/></g></svg>
  <div class="code">404</div>
  <h1>This page does not exist</h1>
  <p>The link may be old or mistyped. Everything in Qadence — lessons, tests, drills and interview prep — starts from the home page.</p>
  <a class="btn" href="${base}">Go to Qadence</a>
</main>
</body>
</html>
`;
}

/* ───────────── main ───────────── */
function main() {
  const d = collect();
  const c = copy(d);
  const index = buildIndex(d, c);
  const hashSrc = [index, ...d.contentFiles.map(f => read(f))].join('\n');
  const hash = crypto.createHash('sha256').update(hashSrc).digest('hex').slice(0, 16);
  const prevSitemap = fs.existsSync(path.join(DIST, 'sitemap.xml')) ? read('sitemap.xml') : null;
  const out = {
    'index.html': index,
    'llms.txt': llms(d, c),
    'robots.txt': robots(),
    'sitemap.xml': sitemap(hash, prevSitemap),
    'manifest.webmanifest': manifest(c),
    '404.html': notFound()
  };
  let stale = 0;
  for (const [f, body] of Object.entries(out)) {
    const p = path.join(DIST, f);
    const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    if (cur === body) { console.log(`  unchanged  dist/${f}`); continue; }
    stale++;
    if (CHECK) console.log(`  OUT OF DATE  dist/${f}`);
    else { fs.writeFileSync(p, body); console.log(`  wrote      dist/${f}`); }
  }
  const { s } = d;
  console.log(`\n${s.lessons} lessons · ${s.stages} stages · ${s.mcqs} MCQs · ${s.scenarios} scenarios · ${s.drills} drills · ${s.interview} interview questions (${s.ivTopics} topics) · ${s.diagrams} diagrams · ${s.explainLangs.length} explanation languages · ${s.uiLangs.length} UI languages · ${s.hoursLo}–${s.hoursHi} h`);
  console.log(`title ${c.title.length} chars · description ${c.description.length} chars · site ${SITE_URL}`);
  if (CHECK && stale) process.exitCode = 1;
}

module.exports = { SITE_URL, REPO_URL, collect };
if (require.main === module) main();
