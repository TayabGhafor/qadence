# Claude implementation prompt — SQA Practice Room

You are working in the existing SQA Practice Room repository. Implement the learning hub in the real application and leave it usable, responsive, and ready to publish. Do not return only a plan, a mockup, or a list of recommendations. Inspect the source and the supplied roadmap documents first, then build and verify the requested experience.

## Product goal

Create a polished, beginner-friendly SQA learning and practice hub for someone starting a QA career and preparing for junior / 1–2 year SQA Engineer or QA Analyst interviews. Help learners understand a concept, see it explained visually, try a small practical exercise, write code or test cases, receive useful feedback, and revisit weak areas. Lessons must connect to the built-in simulations and interview practice so a learner can apply an idea immediately.

The practice products named in the project history are inspiration for in-site scenarios only. Build and keep practice interactions inside this application. Do not solve the request by linking or redirecting people to OrangeHRM, DemoQA, WebdriverUniversity, AcademyBugs, SauceDemo, Testing Challenges, or other external practice sites.

## Read the source material first

Read both user-provided roadmap files before changing curriculum, sequence, hours, or milestones:

- `../docs/SQA_Career_Roadmap.pdf`
- `../docs/SQA_Visual_Roadmap.pdf`

If the checkout is elsewhere, locate the `docs` folder in the surrounding workspace. Do not claim the files are unavailable until checking the parent workspace. Extract and use the document's actual learning order, exercises, evidence targets, capstone, and cautions. The roadmap is planning guidance, not a job guarantee. Preserve the realistic pace alternatives and present hours as estimates.

Also read `IMPLEMENTATION_TRACKER.md`, `README.md`, `.openai/hosting.json`, and the application source. The tracker is the source of implementation status: update it as features are completed and append dated progress notes. Do not overwrite project identity, remove working flows, or make an already implemented feature regress.

## Existing scope and constraints

- Keep the current frontend-only, open-source phase. Use mock/simulated data and browser local storage; do not add backend services, real account authentication, remote databases, or external writes.
- Keep the existing demo login visible on the login screen: username `Admin`, password `admin@123`. It is a shared demo gate, not secure authentication. Never persist the password in local storage.
- Progress and profile data belong to this browser profile on this device. Clearly explain this in profile/settings: what is stored, where it is stored, that it does not sync, and that clearing browser site data deletes it. Do not call this secure or private from other users of the same browser profile.
- Preserve existing interview questions, difficulty levels, model answers, Roman Urdu explanations, request-only hints, answer scoring, weak-topic revision, labs, challenge workspace, code drafts, submissions, and progress history.
- Scripts typed into the site are drafts only. Do not claim submitted code is executed unless a real, safely isolated runner exists (none is part of this phase).
- Retain the current Sites project ID, audience, visual identity, and deployment approach. Do not create a replacement site.
- Keep it accessible: semantic landmarks and headings, keyboard operation, visible focus, useful labels, readable contrast, announced feedback, and reduced-motion support.

## Curriculum and teaching experience

Create a navigable, self-paced learning path that reflects the source roadmap's eight phases:

1. Foundations and the testing role; quality vs testing; risk; SDLC and STLC.
2. Manual planning and prioritization; equivalence classes; boundary values; decision tables; state transitions; exploratory testing; smoke/sanity/retest/regression; reproducible defect reports; severity vs priority.
3. Web and mobile; compatibility matrix; viewport/browser coverage; keyboard/touch; app lifecycle, network, permissions, interruptions, and recovery; explain limits of emulation.
4. SQL and API testing: SELECT/WHERE through joins/aggregation/integrity; safe read-only verification; HTTP methods/status/headers/schema/auth; negative and ownership cases; Postman collections/environments/assertions; verify persistence instead of trusting status alone.
5. Programming and Git: practical JavaScript/TypeScript for the default web path, data and functions, JSON, assertions, errors, async/await, debugging, small commits, diffs, branches, and secret hygiene. Mention Python/Java only as alternatives when role context calls for them.
6. Automation with one chosen framework; Playwright as a sensible default for this web path, with Cypress/Selenium as role-dependent alternatives. Cover locators, assertions, isolation, fixtures, waits, traces, flakiness, and the test pyramid. Include CI fundamentals.
7. Quality breadth: accessibility, performance, security/privacy, compatibility, risk communication, and clear residual coverage.
8. Capstone, evidence, portfolio, resume/application and interview readiness.

Each stage should be a complete micro-lesson, not just a title. Include:

- outcome, prerequisites or “what you will learn,” and realistic time estimate;
- plain English concept explanation plus a short Roman Urdu explanation;
- a compact visual (flow, matrix, decision table, boundary illustration, test pyramid, state diagram, etc.) that actually teaches the concept, with labels and accessible text;
- a simple worked example and an accurate, editable code/query/test example when appropriate;
- a practical task using a built-in simulated application or the code workspace;
- one or more knowledge checks with immediate explanatory feedback, not just a green/red score;
- common misconceptions, tips, and “what evidence to save” for the learner's portfolio;
- a clear next step to a related lab, coding challenge, interview question, or revision item.

Use small approachable examples first, then add an interview-level scenario. Keep answers accurate: distinguish evidence from assumptions, distinguish authentication from authorization, severity from priority, retest from regression, test failure from product failure, and mock behavior from persisted data. Do not make false promises about hiring timelines.

## Practical work and learning progress

Build real in-page interactions for the lessons: answer quizzes, write and save lesson notes, record completion, open the related simulated lab/challenge, and return later to resume. Include a roadmap overview with stage status and a visible overall completion indicator. Offer a sensible weak-topic/revision entry point. Repeated visits must reuse the learner's progress rather than resetting it.

Use local storage only for this phase. Extend the existing state schema without losing old learner data. Add a human-readable profile/data page with:

- browser/device-local storage disclosure and the exact kinds of learner data saved;
- no-sync / clearing-site-data explanation and the shared-demo-account limitation;
- export all practice state as JSON;
- import a validated prior export, with clear replace/restore confirmation and friendly error recovery;
- reset local practice data with an explicit confirmation;
- accurate storage size/status feedback. Do not expose secrets in exports or persist the shared password.

If local storage is blocked or full, fail gracefully and tell the learner what happened. Escape user-entered text before rendering it. Avoid unsafe HTML injection from imported files or lesson notes. Preserve keyboard and screen-reader feedback when an action succeeds or fails.

## UI and interactions

Keep the existing premium editorial style. Improve it where needed without making the screen dense. Make the curriculum easy to scan and lesson content easy to read. Use responsive layouts at phone, tablet, and desktop widths. Avoid horizontal page overflow, tiny click targets, misaligned controls, cramped code, and navigation that cannot be reached on mobile. Use intentional, restrained motion for transitions and feedback; support `prefers-reduced-motion`. Do not install an animation dependency for a static HTML app unless the project already uses a framework that needs it.

Prioritize these screens and transitions:

- dashboard → learning path → stage overview → lesson detail;
- lesson concept → visual/example → learner task/notes → quiz feedback → completion;
- lesson → relevant in-site lab/challenge → saved code/approach submission → progress/revision;
- profile & data → export/import/reset and clear privacy disclosure;
- existing login, dashboard, interview practice, labs, challenge workspace, submissions, and progress remain connected and responsive.

## Definition of done

Before finishing, confirm all of the following and record evidence in `IMPLEMENTATION_TRACKER.md`:

1. Both source PDFs informed the sequence and learning outcomes; roadmap-derived claims are accurate and estimates are clearly labeled.
2. Every one of the eight stages has a plain-English lesson, Roman Urdu summary, useful visual, small example, practical exercise, knowledge check and next step.
3. Learners can answer a check, receive explanation, save notes, complete a lesson, navigate away, return, and see progress persist.
4. Profile/settings explains local storage precisely; export/import/reset handles valid, invalid, cancelled, and repeated operations without corrupting unrelated browser data.
5. No passwords or real secrets are added to learner-state storage; user-authored content is rendered safely.
6. Existing flows still work. No practice task redirects to external practice sites; no code-execution claim is made.
7. Check HTML structure, unique IDs, JavaScript syntax, links/assets, storage migration behavior, responsive layout, keyboard use, reduced-motion, and browser console errors where a browser preview is available. Do not report a check as passed unless it was actually run.
8. Update the tracker with complete / in progress / not started status and concrete evidence. Clearly record any remaining backend work as deferred.
9. Package and publish to the existing Site using its existing project ID and audience after source checks are complete. Return the exact published URL and version/result. Keep credentials out of files, command arguments, logs, and responses.

Start by inspecting the real files and roadmap documents. Then implement the feature in the existing application, verify it, update the tracker, and publish the completed frontend. Do not stop after writing another plan or prompt.
