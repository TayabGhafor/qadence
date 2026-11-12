# Qadence content schema (Learning Lab, Test Center, Practice drills)

Qadence (formerly "SQA Practice Room") is a static, browser-only SQA learning site. Content lives in
`dist/content/*.js` as **classic scripts** (no `import`/`export`, no `fetch`, no JSON files) so the site
still works when `index.html` is opened directly from disk. Each file calls the registry defined in
`dist/content/registry.js`:

```js
/* Qadence content · stage "manual" · lessons 1–6 */
QA_CONTENT.addLessons('manual', [ /* lesson objects */ ]);
QA_CONTENT.addBank('manual', [ /* extra MCQs used only by the Test Center */ ]);
QA_CONTENT.addDrills('manual', [ /* interactive practice drills */ ]);
QA_CONTENT.addScenarios([ /* scenario-based tests */ ]);
```

Validate with: `node tools/validate-content.js` (run from the `sqa-interview-practice` folder).
The validator must report **0 errors** before you finish.

Audience: people starting a QA career up to 1–2 year QA Engineer / QA Analyst interview level, plus
advanced material for growth. Many learners are in Pakistan/India; English is the primary language.
Tone: clear, warm, practical, precise. Prefer small concrete examples first, then an interview-level
scenario. No hype, no hiring guarantees, no links to external websites. Use fictional products
(e.g. "ShopFlow" store, "PeopleOps" HR portal, "PayLite" wallet, "MediBook" clinic booking).

Accuracy traps that MUST be correct wherever they appear:
- **401 Unauthorized** = not authenticated (missing/invalid/expired credentials). **403 Forbidden** =
  authenticated but not allowed (authorization). 404 can be used deliberately to hide a resource.
- **Severity** = impact on the system/user (tester-assessed). **Priority** = urgency/order of fixing
  (business/product decision). A typo in the company name on the home page = low severity, high priority.
- **Retest / confirmation testing** = re-run the failed case after a fix. **Regression testing** =
  check that the change did not break things that previously worked.
- **Verification** = built right (against spec). **Validation** = built the right thing (user need).
- Error (human mistake) → defect (flaw in artifact) → failure (observed wrong behaviour).
- A failed automated test is not automatically a product bug (could be test, data or environment).
- A 200/201 status alone does not prove persistence — verify via GET or a read-only DB query.
- Emulators/simulators are useful but do not replace real devices for sensors, performance, OEM quirks.
- Testing shows the presence of defects, not their absence. Exhaustive testing is impossible.
- Three-value BVA for range 1–10 → 0,1,2,9,10,11. Two-value BVA → 0,1,10,11.
- Smoke = broad, shallow "is the build testable?"; Sanity = narrow, focused check of a specific fix/area.
- Playwright locators auto-wait; prefer `getByRole`/`getByLabel`/`getByTestId` over brittle CSS/XPath;
  web-first assertions such as `await expect(locator).toBeVisible()` retry; avoid `waitForTimeout`.

## Identifiers you may link to (anything else fails validation)

- `labs`: `login`, `api`, `checkout`, `mobile`, `ui`, `bughunt`
- `challenges`: `peopleops-login`, `api-contract`, `shopflow-checkout`, `ui-interactions`, `mobile-resume`, `bug-report`
- `interview` (existing question bank): `m1`–`m6` (manual), `a1`–`a6` (API), `p1`–`p6` (Playwright), `d1`–`d6` (mobile)
- Stage ids: `foundations`, `manual`, `web-mobile`, `sql-api`, `code-git`, `automation`, `quality`, `capstone`

## Inline HTML

Fields named `html`, list `items`, table cells, `answer`, `a` and option text may use only these inline
tags: `<b> <strong> <i> <em> <code> <kbd> <br>`. No attributes, no links, no images, no block tags.
All other string fields are plain text. Use typographic quotes/apostrophes freely (’ “ ” – —).
Escape `<` as `&lt;` in html fields when you mean a literal less-than sign (e.g. `&lt;input&gt;`).
In `code` blocks write raw code (no escaping) — it is rendered as text.

## Content blocks (used in `body`, `example.blocks`, scenario `brief`)

| `t` | Fields | Use |
|---|---|---|
| `p` | `html` | Paragraph (40–110 words). |
| `h` | `text` | Sub-heading inside the lesson. |
| `list` | `items: [html]`, optional `ordered: true` | 2–7 bullets. |
| `callout` | `tone: 'tip'\|'warn'\|'info'\|'key'`, `title`, `html` | Highlighted note. `key` = key idea. |
| `table` | `head: [text]`, `rows: [[html]]`, optional `caption` | Comparisons, matrices, decision tables. 2–5 columns. |
| `code` | `lang`, `code`, optional `title` | `lang` ∈ `ts js sql http json gherkin text bash python java yaml`. ≤ 30 lines. Must be accurate. |
| `flow` | `steps: [text]` (3–7, short), optional `caption` | A left-to-right process diagram. |
| `compare` | `a: {title, items:[html]}`, `b: {title, items:[html]}` | Two-column contrast (e.g. Retest vs Regression). |
| `cards` | `items: [{title, html}]` (2–6) | Grid of mini concept cards. |

## Lesson object

```js
{
  id: 'mt-boundary',              // given to you in the outline — use exactly
  n: 4,                           // order within the stage — given in the outline
  level: 'beginner',              // 'beginner' | 'intermediate' | 'advanced' — given in the outline
  title: 'Boundary value analysis',
  summary: 'One sentence (≤ 160 chars) describing what the learner will be able to do.',
  minutes: 15,                    // realistic reading + practice estimate, 8–30
  objectives: ['3–4 short “you will…” outcomes'],
  body: [ /* 7–14 blocks, roughly 600–1100 words total; must include ≥1 visual block (table, flow, compare or cards) */ ],
  example: { title: 'Worked example: …', blocks: [ /* 2–5 blocks walking through a concrete case */ ] },
  explain: {                      // simple explanation of the SAME core idea, 60–140 words each, plain text (<b> allowed)
    'ur':      '… Urdu script (اردو) …',
    'ur-Latn': '… Roman Urdu …',
    'hi':      '… Hindi (देवनागरी) …',
    'ar':      '… Modern Standard Arabic …',
    'es':      '… Spanish …'
  },
  keyTerms: [{ term: 'Boundary', def: 'Plain-text definition (≤ 200 chars).' }],   // 3–6
  practice: [                     // 3–4 hands-on exercises; learner tries, then reveals the model answer
    { q: 'Exercise prompt (html ok).', hint: 'Optional nudge (plain text).', answer: 'Model answer (html ok, can be several sentences).' }
  ],
  quiz: [                         // exactly 5 MCQs; mix of recall, understanding, and ≥2 scenario-based
    { q: 'Question text (plain text).', options: ['A', 'B', 'C', 'D'], correct: 2,
      why: ['Why A is wrong', 'Why B is wrong', 'Why C is right', 'Why D is wrong'] }
  ],
  interview: [{ q: 'Likely interview question', a: 'Strong model answer, 50–150 words (html ok).' }],  // 1–3
  takeaways: ['3–5 one-line key takeaways'],
  links: { labs: ['bughunt'], challenges: ['bug-report'], interview: ['m5'] }      // optional; only valid ids
}
```

Rules for MCQs (lesson `quiz`, `bank`, scenario questions):
- Exactly 4 options (scenario questions may have 4–5). One correct answer unless `correct` is an array
  (multi-select, scenario tests only).
- `why` has one entry per option explaining why it is right or wrong — teach, don't just say "Incorrect".
- Distractors must be plausible misconceptions, similar in length to the correct answer. Avoid
  "all of the above"/"none of the above".
- **Spread the correct index**: across a file, each position 0–3 should hold roughly a quarter of
  correct answers. Don't make the longest option always correct.
- Never contradict the accuracy traps above.

## Test bank (`addBank`) — extra MCQs for the Test Center

Same shape as a quiz item plus `level` and `topic` (a lesson id from your stage):
`{ level: 'intermediate', topic: 'mt-boundary', q, options, correct, why }`. These must be **new** questions,
not copies of lesson quiz questions. Include a healthy share of short scenario questions.

## Drills (`addDrills`) — interactive practice

Every drill: `id` (prefix with your stage code, e.g. `mt-d1`), `type`, `title`, `level`, `prompt` (plain text).

| `type` | Extra fields | What the learner does |
|---|---|---|
| `classify` | `categories: [2–4 text]`, `items: [{ text, cat: index, why }]` (5–8) | Assign each item to a category. |
| `order` | `items: [text]` **in correct order** (4–7), `explain` | Put shuffled steps in order. |
| `spot` | `lines: [{ text, flaw: true\|false, why }]` (5–9, with 2–4 flaws) | Select the flawed lines (bad test steps, risky code, weak bug-report lines…). |
| `fill` | `fields: [{ label, accept: [text], why }]` (2–6) | Type short answers; matching is case-insensitive and trims spaces. List every reasonable accepted spelling (e.g. `['403', '403 forbidden']`). |

## Scenario tests (`addScenarios`)

```js
{
  id: 'sc-checkout-release', title: 'Friday release: ShopFlow checkout', level: 'intermediate',
  stages: ['manual', 'sql-api'], minutes: 15,
  summary: 'One or two sentences.',
  brief: [ /* 2–6 blocks: context, requirement excerpts, a log/response/table, constraints */ ],
  questions: [ /* 6–8 items: { q, options: [4–5], correct: index | [indexes], why: [...] } — at least one multi-select */ ]
}
```

## Translation guidance for `explain`

- Explain the core idea simply, as a friendly senior tester would to a beginner — not a word-for-word
  translation of the English body. Include one tiny example.
- Keep standard technical terms in English where practitioners do (e.g. "test case", "boundary value
  analysis", "API", "status code", "regression"), optionally with a native gloss the first time.
- `ur`: natural Urdu in Urdu script. `ur-Latn`: conversational Roman Urdu (as used in Pakistan).
  `hi`: natural Hindi in Devanagari. `ar`: clear Modern Standard Arabic. `es`: neutral Spanish.
- Plain text only (you may use `<b>`). No line breaks needed.

---

# v2 additions (visual guides, more languages, interview bank, new lessons)

## Lesson order and grouping

`dist/content/taxonomy.js` is the single source of truth for lesson **order** (`path` per stage), **concept
groups**, **collections** and **prerequisites**. A lesson's `n` only needs to be a unique integer inside its stage.
Every lesson id must appear in `path` and in exactly one group.

## Diagram blocks (allowed in `body`, `example.blocks`, `visuals` and scenario `brief`)

All labels are plain text (no HTML). Keep labels short — they are drawn inside shapes.

| `t` | Fields | Use for |
|---|---|---|
| `flowchart` | `nodes: [{ id, label, kind? }]` (3–12), `edges: [{ from, to, label? }]`, optional `dir: 'down' \| 'right'` (default `down`) | Processes with decisions and loops: bug triage, "is it a defect?", CI pipeline, release go/no-go. `kind` ∈ `start`, `step` (default), `decision` (label ends with `?`, ≥2 labelled outgoing edges such as Yes/No), `end`, `io`. Node `id` = lowercase `a-z0-9-`. Labels ≤ 42 characters. Back-edges (loops) are allowed. |
| `cycle` | `steps: [text]` (3–8, ≤ 28 chars each), optional `center` | Repeating processes: STLC, sprint, PDCA, red-green-refactor, defect life loop. |
| `pyramid` | `levels: [{ label, note? }]` (3–6), **top → bottom** | Test pyramid, ISTQB test levels, testing priorities. Top = narrowest/fewest. |
| `matrix` | `x: { label, ticks: [text] }`, `y: { label, ticks: [text] }` (2–5 ticks each; `y.ticks` top → bottom), `cells: [[text]]` (one row per y tick, one cell per x tick), optional `tones: [['low'\|'mid'\|'high'\|'none']]` same shape | Risk heat maps (likelihood × impact), severity × priority, Agile testing quadrants, tool comparison grids. |
| `sequence` | `actors: [text]` (2–5), `steps: [{ from, to, label, reply? }]` (2–12; `from`/`to` are actor indexes; `reply: true` draws a dashed return arrow) | Request/response and handshake flows: login + token, OAuth, API → DB persistence check, CI trigger. |
| `tree` | `root: { label, children?: [{ label, edge?, children? }] }` (depth ≤ 4, ≤ 15 nodes) | Decision trees and classifications: which test technique, severity decision, types of testing. `edge` labels the branch (e.g. `Yes`). |
| `timeline` | `items: [{ label, sub? }]` (3–8) | Ordered milestones: release steps, evolution of a bug, career steps. |
| `layers` | `items: [{ label, sub? }]` (2–6), optional `nested: true` | Stacks (UI → API → service → DB) or, with `nested`, containment (QA ⊃ QC ⊃ Testing). |

Every diagram also takes optional `title` (plain text, shown above it) and `caption` (one or two sentences
telling the learner what to notice). Diagrams must be accurate and teach something the lesson's text does not
already show in a table.

## Visual guide files (`dist/content/visuals-<area>.js`)

```js
QA_CONTENT.addVisuals({
  'mt-boundary': [
    { t: 'flowchart', title: 'Deriving boundary tests', dir: 'right', nodes: [...], edges: [...], caption: '…' },
    { t: 'matrix', title: '…', x: {...}, y: {...}, cells: [[...]], caption: '…' }
  ]
});
```
Each lesson gets **1–3** diagrams, each with a `title` and a `caption`. They render in a "Visual guide" section of the lesson.

## Explanation language files (`dist/content/explain-<lang>.js`)

```js
QA_CONTENT.addExplain('zh', { 'fd-what-is-testing': '…', 'fd-qa-qc-testing': '…' });
```
One entry per lesson id in `taxonomy.js`. Same guidance as `explain` above (simple explanation of the core idea with
one tiny example; standard QA terms may stay in English). Length: 60–140 words for alphabetic languages; for
Chinese/Japanese 120–300 characters; Korean 60–160 words-equivalent. Plain text (`<b>` allowed).
Languages: `zh` (Simplified Chinese), `ja` (Japanese), `ko` (Korean), `fr` (French), `de` (German), `pt` (Brazilian Portuguese).

## Interview question bank (`dist/content/interview-<area>.js`)

```js
QA_CONTENT.addInterview([
  {
    id: 'iq-fun-01',                // prefix per file; unique
    cat: 'fundamentals',            // see categories below
    level: 'beginner',              // beginner | intermediate | advanced
    freq: 'very-common',            // very-common | common | occasional (how often interviewers ask it)
    q: 'What is the difference between verification and validation?',
    short: 'One or two crisp sentences — the answer you would give first (plain text, ≤ 260 chars).',
    answer: 'Full model answer, 70–200 words (inline html ok). Structured, accurate, with a small example.',
    followups: ['Likely follow-up question', '…'],        // 1–3, plain text
    mistakes: ['A common weak or wrong answer to avoid'],  // 1–2, plain text
    lesson: 'fd-static-testing'     // optional: related lesson id from taxonomy.js
  }
]);
```
Categories (`cat`): `fundamentals`, `design`, `defects`, `agile`, `scenario` ("How would you test…?"),
`api`, `sql`, `automation` (general + Selenium), `playwright`, `coding`, `nonfunctional`, `mobile`, `behavioral`.
Write answers in your own words (never copy text from websites), keep them accurate against the accuracy traps
above, and prefer the questions that genuinely come up most often in QA Analyst / QA Engineer / SDET interviews.
