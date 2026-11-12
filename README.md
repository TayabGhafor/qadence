# Qadence

**Learn software testing, step by step.** Qadence (formerly *SQA Practice Room*) is a browser-only learning platform for software quality assurance — from your first test case to automation, APIs, performance, security and release decisions. It is aimed at people starting a QA career and at junior / 1–2 year QA Engineers and QA Analysts preparing for interviews, with advanced material for growth.

**Live site:** https://tayabghafor.github.io/qadence/

## What is inside

| Area | What you get |
|---|---|
| **Learning Lab** | 80 lessons in a recommended sequence across 8 stages, tagged beginner / intermediate / advanced and mapped to the ISTQB CTFL v4.0.1 syllabus plus the topics most asked in QA interviews. Browse by **Path**, by **Topic** (10 concept groups) or on a **Concept map**, and filter by level, topic, status, search or collection (*ISTQB Foundation prep*, *Interview essentials*, *Manual QA path*, *Automation / SDET path*). Each lesson: objectives, explanation, a **visual guide** (212 diagrams in total), worked example, key terms, practice exercises with model answers, a 5-question quick check where every option is explained, interview questions, takeaways, notes, prerequisites and completion. |
| **Visual guides** | A built-in diagram engine draws flowcharts (decisions and loops), cycles, pyramids, heat-map matrices, sequence diagrams, decision trees, timelines and layer stacks — theme-aware, responsive, each with a screen-reader text alternative. |
| **Explanations in your language** | English is the primary language. Every lesson adds a simple explanation in 11 languages: اردو (Urdu), Roman Urdu, हिन्दी (Hindi), العربية (Arabic), Español, Français, Deutsch, Português, 中文, 日本語 and 한국어. The whole interface switches to any of these 12 languages (Urdu and Arabic switch the layout to right-to-left); missing strings fall back to English. |
| **Interview prep** | A researched **question bank** of 221 frequently asked questions across 13 topics (fundamentals, test design, defects, Agile, "how would you test…?", API, SQL, Selenium, Playwright, coding/OOP, performance & security, mobile, HR & behavioural), each with a short answer, model answer, likely follow-ups and mistakes to avoid; browse grouped topics (core QA, technical, automation & code, career) with pagination and group-by topic, level or frequency; filter by level, frequency and rating; search with highlighting; each answer opens to a 30-second answer plus model answer, follow-ups and mistakes tabs; rate your confidence; **flashcards**; **mock interviews** with self-scoring; plus the original scored practice rounds. |
| **Test Center** | Quick quiz, stage quizzes, timed level exams (20 questions, 25 minutes, 70% pass mark), a custom test builder, weak-topic tests and 12 scenario-based case studies (88 questions, some "select all that apply"). Every result is saved with a full explained review and a by-topic breakdown. |
| **Practice drills** | 41 interactive drills: sort it, put in order, spot the flaw, fill the blank — instant feedback, keyboard-operable. |
| **Career roadmap** | A visual road through the 8 stages (~24 weeks, 240–288 hours as planning estimates), milestone flags for when to apply, a career ladder from learner to lead with specialisation branches, readiness levels, a weekly rhythm chart and a 30/60/90-day plan, plus the detailed stage guides. |
| **Practice labs & challenges** | Six simulated apps and six challenges with a code workspace and transparent rubric feedback. |
| **Dashboard, profile & progress** | XP, levels, streaks, weekly goal, 17 badges, activity heatmap, test score trend, weak topics, editable learner profile, light/dark/system theme, and multiple learner profiles on one device. |
| **Data & privacy** | A clear picture of what is stored, a data-flow diagram, export / validated import / reset, and a privacy FAQ. |

Content totals: 80 lessons · 542 MCQs (400 lesson checks + 142 test-bank questions) · 302 practice exercises · 212 diagrams · 12 scenario tests (88 questions) · 41 drills · 221 interview questions · explanations in 11 languages.

## Run locally

Open `dist/index.html` in a modern browser. No build step or server is required — every script is a classic script file, fonts are bundled, and the page makes no external requests. The landing page paints first; a small loader at the end of `index.html` then loads the app scripts in order.

## Demo login

- Username: `Admin`
- Password: `admin@123`

This shared demo login is public by design. It is a frontend navigation gate, not secure authentication. Do not reuse the password for another account.

## Local data

All progress is stored in this browser's local storage, per learner profile: Learning Lab progress, quiz answers, notes and bookmarks; test results; drill scores; interview sessions; workspace drafts and submissions; lab counters; roadmap progress; profile details. Theme and language are device-wide preferences. Nothing syncs across browsers or devices, and clearing this site's browser data deletes it. Passwords are never saved. Anyone using the same browser profile can open this data, including every learner profile on the device.

The **Data & privacy** screen lists exactly what is stored, shows storage status and size, and lets you export a JSON backup, restore a validated backup (older *SQA Practice Room* backups still import), or erase local practice data. Storage keys are unchanged from earlier versions (`sqaPracticeRoom.v1`, schema version 3), so existing progress carries over.

The practice targets use fictional, simulated data inside this page. Code typed into the workspace is stored and reviewed with a transparent heuristic rubric; the site does not execute submitted code.

## Project layout

```
dist/
  index.html            landing, sign-in and app shell
  css/app.css           design tokens (light/dark), components, shell, landing
  css/pages.css         dashboard, profile, progress, Learning Lab, Test Center, drills
  css/legacy.css        styles for the ported labs, challenges, workspace, interview and roadmap screens
  js/icons.js           custom SVG icon set
  js/i18n.js            i18n engine + English UI strings; js/i18n-dict.js holds 11 other languages
  js/diagrams.js        diagram engine (flowchart, cycle, pyramid, matrix, sequence, tree, timeline, layers)
  js/core.js            profiles, preferences, routing, schema-v3 normalisers, XP/levels/badges
  js/legacy-markup.js, js/legacy-core.js   ported interview, labs, challenges, workspace, sign-in
  js/roadmap.js         career roadmap, storage helpers, export / import / reset
  js/academy.js, js/tests.js, js/drills.js, js/interview.js, js/app.js
  css/diagrams.css      diagram styles
  content/              curriculum (classic scripts): taxonomy.js (order, groups, collections, prerequisites),
                        lessons-*.js, visuals-*.js, explain-<lang>.js, interview-*.js, scenarios.js, roadmap-data.js
  assets/               logo, favicons, app icons, og-image.png, fonts (Plus Jakarta Sans, JetBrains Mono — SIL Open Font License)
  llms.txt, robots.txt, sitemap.xml, manifest.webmanifest, 404.html   generated by tools/build-seo.js
tools/
  CONTENT_SCHEMA.md     the content contract for lessons, MCQs, drills and scenarios
  validate-content.js   `node tools/validate-content.js --strict` — must report 0 errors
  build-seo.js          SEO/GEO/AEO generator: meta + Open Graph tags, JSON-LD, the landing FAQ and pre-rendered
                        curriculum in index.html, plus llms.txt, sitemap, robots, manifest and 404 page.
                        Site URL lives in its SITE_URL constant. `--check` fails if anything is stale.
  og-image.html, render-images.js   social card and app icons (needs playwright-core locally)
  render-guide.js       renders docs/seo-setup-guide.html to docs/SEO-Setup-Guide.pdf (needs playwright-core locally)
  e2e/                  browser checks (regression smoke + feature suite) — see tools/e2e/README.md
docs/SEO-Setup-Guide.pdf      step-by-step guide: Google Search Console and an optional custom domain
.github/workflows/pages.yml   validates content and SEO files, then deploys dist/ to GitHub Pages
```

## Deploy and SEO

Every push to `main` runs `.github/workflows/pages.yml`: it validates the content, checks that the generated SEO files are current and publishes `dist/` to GitHub Pages. After changing lessons, counts or the FAQ, run `node tools/build-seo.js` and commit the result.

The landing page is the only crawlable page (the app uses `#/…` routes behind the demo login), so it carries the search and answer-engine work: a descriptive title and meta description, canonical URL, Open Graph/Twitter card, JSON-LD (`WebSite`, `Organization`, `WebApplication`, `Course`, `FAQPage` matching the visible FAQ), pre-rendered curriculum and counts, and `llms.txt` for AI assistants. On a GitHub Pages project site, crawlers only read `robots.txt` at the domain root, so submit `sitemap.xml` in Google Search Console (or move to a custom domain) — see [docs/SEO-Setup-Guide.pdf](docs/SEO-Setup-Guide.pdf).

## Open source

This project is released under the MIT License. See [LICENSE](LICENSE). The bundled fonts are licensed under the SIL Open Font License 1.1.
