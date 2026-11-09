# SQA Practice Hub — implementation plan and live tracker

## Goal

Deliver a polished, open-access frontend for the SQA practice hub. All training targets and flows are simulated inside the site. Authentication is a clearly labeled shared demo gate; user progress, submissions, and session state stay in that browser's local storage. No backend is wired in this phase.

## Plan and status

| Feature | Planned work | Status | Evidence |
|---|---|---|---|
| 1. Source and deployment setup | Open existing Sites source, preserve project ID, confirm publication path | Complete | Existing Site ID verified; source checkout opened at commit `0d00696369d15c943e875f41d8adb7e156650aa9` |
| 2. Landing and login | Premium responsive landing page, login form, visible shared demo credentials, client-only login flow | Complete | Added landing and login views; the `Admin` / `admin@123` demo gate writes a username/timestamp only |
| 3. Session and local data | Login/logout, route guard, localStorage session, drafts, submissions, weak topics, progress | Implemented | Demo auth, interview session resume, drafts, reports, attempts, and progress stay in browser storage; passwords are not persisted |
| 4. Dashboard and navigation | Progress overview, resume session, track cards, responsive shell | Implemented | Existing four-track dashboard extended with challenge library, workspace, submission history, progress views, and logout |
| 5. Built-in practice apps | PeopleOps, ShopFlow, UI Playground, API Sandbox, Mobile Lab, Bug Hunt | Implemented | Six first-party simulated environments with in-site interactions; no external target links |
| 6. Challenges and practice workspace | Difficulty/framework filters, detailed briefs, editable code/approach/test cases, hidden hints | Implemented | Six filtered scenarios; Playwright, Cypress, Selenium, Postman, and manual templates; embedded target, approach/test tabs, hidden hint/model approach |
| 7. Submission and revision | Rubric scoring, feedback, saved attempts, weak-topic retry, history | Implemented | Browser-local submissions include source, approach, test cases, score breakdown, export, and retry; code is not run by the Site |
| 8. QA and publish | Check routes, responsive layout, storage persistence, logout, external-link absence; publish existing Site | Complete | HTML and JavaScript checks pass; responsive browser review at 390px, 1024px, and 1440px shows no document overflow; browser console has no errors; existing public Site update deployed successfully |
| 9. Backend integration | Replace demo gate and local-only persistence with a real backend when ready | Not started | Intentionally deferred to the next phase |
| 10. Responsive UI and code workspace | Align navigation, buttons, icons, selects, challenge filters, and rebuild the workspace layout for desktop, tablet, and phone | Complete | Consistent 44px controls, aligned responsive navigation, full-width mobile filters, three-panel desktop workspace, two-column tablet layout, readable single-column phone editor; default simulated target now renders on first workspace visit |

## Scope notes

- Demo account shown on the login screen: `Admin` / `admin@123`.
- The credentials are intentionally public demo credentials, not secure authentication. Do not store the password in local storage.
- Each browser profile has its own progress and submissions. Clearing site data resets them; they do not sync across devices.
- Build simulated first-party practice apps inspired by the kinds of exercises in the provided references. Do not redirect learners to those references for core practice.
- Code can be drafted, saved, submitted, exported, and reviewed in this frontend. It is not executed by a backend in this phase.
- Maintain the existing Site ID. The user requested open use; access was changed to public for the published demo. The project includes an MIT license.

## Progress log

- 2026-11-09 — Plan and feature tracker created before product implementation. Existing Site identified as `appgprj_6af1d49c3c648191adc460f643c380a7`; current audience is custom owner-only.
- 2026-11-09 — Sites source helper opened the existing checkout successfully. No product files changed yet.
- 2026-11-09 — Feature 2 complete: premium responsive landing page, visible shared demo credentials, client-side sign-in validation, persistent local session, and logout-to-landing flow.
- 2026-11-09 — Feature 3 complete: local storage now preserves auth session (without password), active interview session, drafts, lab attempts, bug reports, submissions, scores, and weak topics.
- 2026-11-09 — Feature 4 complete: dashboard navigation now includes challenge library, workspace, submissions, and progress; the dashboard resumes the in-site PeopleOps challenge.
- 2026-11-09 — Feature 5 complete: in-site PeopleOps, ShopFlow, UI Playground, API Sandbox, Mobile Experience, and Bug Hunt simulations are available in the lab/workspace.
- 2026-11-09 — Feature 6 complete: six filtered scenarios open an embedded practice target, editable framework starter, approach and test case fields, and request-only hints/model guidance.
- 2026-11-09 — Feature 7 complete: submissions use a transparent heuristic rubric, persist locally, appear in history, export, and add low-score challenges to the revision queue. Execution is not claimed.
- 2026-11-09 — QA checkpoint: HTML parser and JavaScript syntax checks pass; seven expected app screens exist; static IDs are unique; login credentials and local storage are present; app markup contains no outbound practice URLs; Site ID is unchanged.
- 2026-11-09 — Published the existing Site. Access mode changed from owner-only custom to public as requested for open use. Live URL: `https://sqa-interview-practice-hub.maytrix-inc.chatgpt.site`.
- 2026-11-09 — Remaining verification limit: no interactive browser pass was completed in this environment; automated/static checks and the Sites deployment result are recorded above.
- 2026-11-09 — Feature 10 implemented: refreshed shared controls and icon tiles; aligned the dashboard header; rebuilt the code workspace at desktop, tablet, and phone breakpoints; improved editor readability, framework selection, tabs, hints, and scoring layout. Responsive browser verification and publishing are in progress.
- 2026-11-09 — Feature 10 verified: published workspace reviewed at 390px, 1024px, and 1440px; document width stayed within each viewport, the built-in PeopleOps target and starter script rendered, and browser console reported no errors. Site version 7 deployed successfully.
