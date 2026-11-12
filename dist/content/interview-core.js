/* Qadence content · interview question bank · core QA topics:
   fundamentals (iq-fun), test design (iq-des), defects (iq-def), Agile (iq-agi). */
QA_CONTENT.addInterview([

  /* ===================== Fundamentals ===================== */
  {
    id: 'iq-fun-01', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is software testing, and why is it needed?',
    short: 'Testing evaluates software and its work products to find defects, check it meets requirements and user needs, and give stakeholders facts about quality and risk so they can make release decisions.',
    answer: '<b>Software testing</b> is the process of evaluating software — and the documents around it, such as requirements and designs — to find defects, check that it does what it should, and show how much risk is left.<br><br><b>Why it is needed:</b><br>• People make mistakes under time pressure and complexity, so defects are normal, not exceptional.<br>• Defects found early are far cheaper to fix than defects found by customers.<br>• Failures cost money, reputation and sometimes safety — imagine PayLite charging a customer twice.<br>• Many products must meet contracts, laws or regulations.<br>• Test results give managers facts for the go/no-go decision.<br><br>A strong closing line: testing does not add quality by itself — it provides <b>information</b> so the team can fix problems and decide with confidence. It reduces risk, but it can never prove the software is bug-free.',
    followups: ['Can testing prove that software has no bugs?', 'Why is a defect found in production more expensive than one found in a requirements review?', 'What qualities make a good tester?'],
    mistakes: ['Saying testing is only “finding bugs” and ignoring risk information, requirement checks and early reviews.', 'Claiming that thorough testing guarantees bug-free software.'],
    lesson: 'fd-what-is-testing'
  },
  {
    id: 'iq-fun-02', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between QA, QC and testing?',
    short: 'QA is process-focused and preventive — improving how we build so fewer defects happen. QC is product-focused and detective — checking the product for defects. Testing is the main QC activity.',
    answer: '<b>Quality Assurance (QA)</b> — <i>process</i>-focused and <b>preventive</b>. It asks “are we following a good process so defects are less likely?” Examples: review checklists, coding standards, a definition of done, retrospectives, training.<br><b>Quality Control (QC)</b> — <i>product</i>-focused and <b>detective</b>. It asks “does this build actually meet the standard?” Examples: inspections of deliverables, reviews, testing.<br><b>Testing</b> — the main QC activity: executing or examining the product to find defects and evaluate quality.<br><br>A simple picture: QA contains QC, and QC contains testing. On a MediBook release, agreeing that every story needs reviewed acceptance criteria is QA; running the booking test cases on build 4.2 is testing, which is part of QC.<br><br>In job titles, “QA Engineer” usually means a tester who also improves the process — and quality stays everyone’s responsibility, not just the QA team’s.',
    followups: ['Give an example of a QA activity that does not involve testing.', 'Who is responsible for quality in a team?'],
    mistakes: ['Treating QA and testing as the same thing with different names.', 'Saying QA happens only after development is finished.'],
    lesson: 'fd-qa-qc-testing'
  },
  {
    id: 'iq-fun-03', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between SDLC and STLC, and what are the phases of the STLC?',
    short: 'The SDLC is the whole life cycle of building software, from requirements to maintenance. The STLC is the testing part inside it: requirement analysis, test planning, test case design, environment setup, test execution and test closure.',
    answer: '<b>SDLC</b> (Software Development Life Cycle) covers everything needed to deliver software: requirements, design, development, testing, deployment and maintenance. BAs, developers, testers and ops all take part.<br><b>STLC</b> (Software Testing Life Cycle) is the structured set of testing activities that runs alongside it:<br>1. <b>Requirement analysis</b> — study requirements, find what is testable, raise questions.<br>2. <b>Test planning</b> — scope, approach, effort, risks, entry and exit criteria.<br>3. <b>Test case design</b> — write cases and test data, update the traceability matrix.<br>4. <b>Environment setup</b> — prepare builds, data and accounts; run a smoke test.<br>5. <b>Test execution</b> — run tests, log defects, retest fixes, run regression.<br>6. <b>Test closure</b> — summary report, metrics, lessons learned.<br><br>Each phase has entry criteria, deliverables and exit criteria. In Agile the same phases happen in small loops every sprint instead of once per project.',
    followups: ['What are the entry and exit criteria for test execution?', 'Does the STLC still exist in Agile?', 'What deliverables come out of test closure?'],
    mistakes: ['Saying the STLC starts only after coding finishes — requirement analysis and planning start much earlier.', 'Listing SDLC phases when asked for the STLC phases.'],
    lesson: 'fd-stlc'
  },
  {
    id: 'iq-fun-04', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between verification and validation?',
    short: 'Verification checks we are building the product right — does it match the specification? Validation checks we are building the right product — does it meet the user’s real need?',
    answer: '<b>Verification</b> — “Are we building the product <b>right</b>?” It checks a work product against its specification or standards. It is often static — reviews, walkthroughs and inspections of requirements, designs and code — but also includes confirming that built features match the spec.<br><b>Validation</b> — “Are we building the <b>right product</b>?” It checks that the software meets users’ actual needs in a realistic context. It is typically dynamic: testing real workflows, UAT, beta testing.<br><br><b>Example (PeopleOps leave form):</b> the spec says dates use DD/MM/YYYY. Checking the build shows that format — verification. Watching HR staff apply for leave and discovering they really need half-day leave, which the spec never mentioned — validation.<br><br>You need both: a product can match every line of the spec and still fail its users. That is the “absence-of-defects fallacy” from the testing principles.',
    followups: ['Is a code review verification or validation?', 'Can a product pass verification but fail validation? Give an example.', 'Which test level is mainly about validation?'],
    mistakes: ['Swapping the two definitions.', 'Saying verification is always manual and validation is always automated.'],
    lesson: 'fd-static-testing'
  },
  {
    id: 'iq-fun-05', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What are the seven principles of software testing?',
    short: 'Testing shows the presence of defects, not their absence; exhaustive testing is impossible; early testing saves time and money; defects cluster; tests wear out (pesticide paradox); testing is context dependent; the absence-of-defects fallacy.',
    answer: '1. <b>Testing shows the presence of defects, not their absence</b> — passing tests lower risk but never prove the product is bug-free.<br>2. <b>Exhaustive testing is impossible</b> — even one 10-character text field has an astronomical number of possible values, so we use risk and techniques like partitions and boundaries.<br>3. <b>Early testing saves time and money</b> — a requirement gap caught in review costs minutes; caught in production it costs days.<br>4. <b>Defects cluster together</b> — a few modules hold most bugs, so look harder where bugs were already found.<br>5. <b>Tests wear out</b> (the “pesticide paradox”) — repeating the same tests finds fewer new bugs; refresh tests and data.<br>6. <b>Testing is context dependent</b> — a banking app and a casual game need different approaches.<br>7. <b>Absence-of-defects fallacy</b> — a bug-free product that does not meet user needs is still a failure.<br><br>Tip: give one example per principle from your own work — that separates you from someone reciting a list.',
    followups: ['How do you deal with the pesticide paradox in a regression suite?', 'Give a real example of defect clustering.', 'If exhaustive testing is impossible, how do you decide what to test?'],
    mistakes: ['Saying “we keep testing until there are no bugs left”.', 'Reciting the names without being able to explain or give an example of any of them.'],
    lesson: 'fd-error-defect-failure'
  },
  {
    id: 'iq-fun-06', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between an error, a defect (bug) and a failure?',
    short: 'An error is a human mistake; it can introduce a defect (bug or fault) in code or a document; when defective code runs, it can cause a failure — visible wrong behaviour.',
    answer: 'The chain is <b>error → defect → failure</b>:<br>• <b>Error (mistake)</b> — a wrong human action, e.g. a developer reads “discount above 5,000” as “5,000 and above”.<br>• <b>Defect (bug, fault)</b> — the flaw that mistake leaves in a work product: the code says <code>&gt;=</code> instead of <code>&gt;</code>. Defects can also live in requirements, designs or test scripts.<br>• <b>Failure</b> — what you observe when the defect is executed: a ShopFlow cart of exactly 5,000 gets a discount it should not.<br><br>Useful nuances:<br>• Not every defect causes a failure — if nobody orders exactly 5,000, it stays hidden.<br>• Failures can also come from the environment (bad configuration, hardware), not only from defects.<br>• The <b>root cause</b> is why the error happened — for example, an ambiguous requirement.<br><br>In everyday team language, “bug” and “defect” are used interchangeably.',
    followups: ['Can a defect exist without ever causing a failure?', 'What is a root cause, and how is it different from a defect?'],
    mistakes: ['Using all three words as synonyms with no distinction.', 'Saying every failure means there is a bug in the code — it may be data, configuration or environment.'],
    lesson: 'fd-error-defect-failure'
  },
  {
    id: 'iq-fun-07', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What are the different levels of testing?',
    short: 'The four classic levels are unit (component), integration, system and acceptance testing. ISTQB v4 splits integration into component integration and system integration, which gives five.',
    answer: 'Test levels describe <b>at what scale</b> we test:<br>1. <b>Unit / component testing</b> — one function or class in isolation, usually by developers with frameworks such as JUnit or Jest.<br>2. <b>Integration testing</b> — the interfaces between parts: <i>component integration</i> (our own modules together, e.g. cart + pricing service) and <i>system integration</i> (our system with external ones, e.g. PayLite with a bank gateway).<br>3. <b>System testing</b> — the complete product against requirements, functional and non-functional, usually by the QA team in a production-like environment.<br>4. <b>Acceptance testing</b> — is it fit for the business? UAT by users, plus operational, contractual/regulatory acceptance, alpha and beta.<br><br>Most interviewers expect the four classic levels; adding that ISTQB v4 lists five shows depth. Each level has its own objectives, test basis and typical owner, and defects are cheaper to fix at the lower levels.',
    followups: ['What is the difference between system testing and UAT?', 'What are stubs and drivers in integration testing?', 'What is the difference between a test level and a test type?'],
    mistakes: ['Mixing levels with types, e.g. listing “regression” or “performance” as a test level.', 'Saying unit testing is the tester’s main job in every team.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-08', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between functional and non-functional testing?',
    short: 'Functional testing checks what the system does — features against requirements. Non-functional testing checks how well it does it — performance, security, usability, reliability, compatibility.',
    answer: '<b>Functional testing</b> checks <b>what</b> the system does: does each feature behave as the requirement says? For MediBook: booking an appointment, cancelling it, receiving a confirmation SMS, rejecting a date in the past.<br><b>Non-functional testing</b> checks <b>how well</b> it does it — quality characteristics such as:<br>• <b>Performance</b> — does search return in under 2 seconds with 500 users?<br>• <b>Security</b> — can patient A see patient B’s records?<br>• <b>Usability and accessibility</b> — can a screen-reader user book a slot?<br>• <b>Compatibility</b> — does it work on Chrome, Safari and older Android phones?<br>• <b>Reliability</b> — does it recover after a server restart?<br><br>Both can be tested at any level. Non-functional requirements are often vague (“should be fast”), so a good tester asks for measurable targets first. A feature that works but takes 30 seconds still fails the user.',
    followups: ['How would you test a requirement that only says “the page should be fast”?', 'Is usability testing functional or non-functional?'],
    mistakes: ['Thinking non-functional testing means only performance testing.', 'Treating non-functional testing as optional or “nice to have”.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-09', cat: 'fundamentals', level: 'beginner', freq: 'very-common',
    q: 'Explain black-box, white-box and grey-box testing.',
    short: 'Black-box testing designs tests from requirements without looking at the code. White-box testing designs tests from the internal structure (statements, branches). Grey-box uses partial knowledge of the internals to guide tests run from outside.',
    answer: '<b>Black-box (specification-based)</b> — you test through inputs and outputs using requirements, stories and use cases, with no knowledge of the code. Techniques: equivalence partitioning, boundary value analysis, decision tables, state transition, use-case testing. Most manual QA work is black-box.<br><b>White-box (structure-based)</b> — you design tests from the internal structure so that statements, branches or paths are exercised. Usually done by developers or SDETs, often at unit level, and measured with coverage tools.<br><b>Grey-box</b> — you test from the outside but use some inside knowledge: the database schema, API contracts, logs or architecture. Example: after placing a ShopFlow order through the UI, you run a read-only SQL query to confirm the order row and the stock update were saved correctly.<br><br>Good testers mix all three — black-box for user behaviour, grey-box to confirm what really happened behind the screen.',
    followups: ['Which black-box techniques have you used, and when?', 'What is the difference between statement and branch coverage?', 'Is API testing black-box or grey-box?'],
    mistakes: ['Saying black-box testing means testing without any documentation.', 'Claiming white-box knowledge is only for developers and testers never need it.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-10', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What is the difference between static and dynamic testing?',
    short: 'Static testing examines work products without running the code — reviews, walkthroughs, static analysis. Dynamic testing executes the software and compares actual behaviour with expected results.',
    answer: '<b>Static testing</b> — no code is executed. You examine requirements, user stories, designs, code or test cases to find defects directly. Methods: informal reviews, walkthroughs, technical reviews, inspections, and static analysis tools such as linters and code scanners.<br><b>Dynamic testing</b> — the software runs. You give inputs, observe outputs and compare them with expected results: unit tests, system tests, exploratory sessions, performance tests.<br><br><b>Why both matter:</b> static testing finds problems early and cheaply. While reviewing a PayLite story you notice it never says what happens when a transfer exceeds the daily limit — a gap that would have become a production bug. It also spots things that are hard to see at run time, such as unreachable code or contradictory requirements. Dynamic testing finds problems that only appear when the software runs — timing, integration and performance issues.<br><br>In short: static testing finds <b>defects</b> directly; dynamic testing reveals <b>failures</b> that point to defects.',
    followups: ['What types of review do you know, and how formal is each one?', 'Can static analysis find every kind of defect?'],
    mistakes: ['Saying static testing means “testing a static web page”.', 'Thinking static testing is only done by developers on code.'],
    lesson: 'fd-static-testing'
  },
  {
    id: 'iq-fun-11', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What is the difference between alpha testing and beta testing?',
    short: 'Both are forms of acceptance testing. Alpha testing is done by internal staff or invited users in a controlled setting before release; beta testing is done by real external users in their own environments before general release.',
    answer: 'Both are forms of <b>acceptance testing</b>, mostly for products released to many users.<br><br><b>Alpha testing</b><br>• Done by internal staff (not the developers who built the feature) or invited customers, usually at the vendor’s site or in a controlled environment.<br>• Happens near the end of development; the team can watch and fix quickly.<br><br><b>Beta testing</b><br>• Done by real external users in their own environments — their phones, networks and data.<br>• Happens after alpha and before general release; feedback comes through surveys, crash reports and analytics.<br><br><b>Example:</b> PayLite staff use the new bill-payment feature internally for two weeks (alpha), then 2,000 volunteer users get it through a beta channel on the app store (beta).<br><br>Beta finds what controlled environments miss: unusual devices, slow networks and unexpected usage. It is common for consumer apps, games and SaaS products, less so for custom software built for one client.',
    followups: ['How is beta testing different from UAT?', 'What kinds of defects does beta testing find that system testing misses?'],
    mistakes: ['Saying alpha testing is done by developers on their own machines.', 'Confusing beta testing with a build that happens to have “beta” in its version name.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-12', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What is user acceptance testing (UAT), and how is it different from system testing?',
    short: 'UAT is the final level where business users or the client confirm the system supports their real work and is ready to go live. System testing is done by QA against requirements; UAT is done by users against business needs.',
    answer: '<b>UAT</b> is acceptance testing by the people who will use or own the system — business users, the client or the product owner. They run realistic business scenarios to answer one question: <b>can we go live with this?</b><br><br><b>System testing vs UAT:</b><br>• <b>Who</b> — system testing: the QA team; UAT: end users or client representatives.<br>• <b>Basis</b> — system testing: requirements and specifications; UAT: business processes and acceptance criteria.<br>• <b>Goal</b> — system testing: find defects; UAT: build confidence that it fits the business (validation).<br>• <b>Environment</b> — UAT runs in a production-like environment with realistic data.<br><br><b>Example:</b> QA has tested PeopleOps payroll against every rule. In UAT, the HR manager runs last month’s real payroll scenario and checks the totals match what Finance expects.<br><br>QA usually supports UAT: preparing the environment and data, helping users write scenarios, and logging and triaging the issues they raise.',
    followups: ['What is the tester’s role during UAT?', 'What happens if UAT finds a major defect a day before go-live?', 'What types of acceptance testing exist besides UAT?'],
    mistakes: ['Saying UAT is just system testing repeated by the QA team.', 'Treating UAT as the main place to find defects.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-13', cat: 'fundamentals', level: 'intermediate', freq: 'common',
    q: 'What is the difference between a test level and a test type? Name some test types.',
    short: 'A test level is the scale of testing (unit, integration, system, acceptance). A test type is the purpose (functional, non-functional, white-box, change-related). Any type can run at any level.',
    answer: 'A <b>test level</b> answers “at what scale?” — unit, integration, system, acceptance.<br>A <b>test type</b> answers “what are we checking, and why?” The main families are:<br>• <b>Functional</b> — features behave as specified.<br>• <b>Non-functional</b> — performance, security, usability, compatibility, reliability.<br>• <b>White-box (structural)</b> — the internal structure is covered.<br>• <b>Change-related</b> — <b>confirmation testing</b> (retest a fix) and <b>regression testing</b> (nothing else broke).<br><br>They are independent dimensions — any type can appear at any level:<br>• Performance at unit level: timing one pricing function. At system level: load testing ShopFlow checkout with 1,000 users.<br>• Regression at unit level: re-running the unit suite on every commit. At system level: running the end-to-end regression pack before release.<br><br>Names like smoke, sanity, exploratory or ad-hoc describe testing <i>approaches</i> or subsets of tests — not separate levels.',
    followups: ['Which test types do you usually run during system testing?', 'Is regression testing a level or a type?'],
    mistakes: ['Listing “regression” or “smoke” as test levels.', 'Saying non-functional testing can only happen at system level.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-14', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What are entry and exit criteria in testing?',
    short: 'Entry criteria are the conditions that must be true before a test activity starts; exit criteria are the conditions that must be met before it can be called complete. They stop teams starting too early or stopping too soon.',
    answer: '<b>Entry criteria</b> — preconditions to <b>start</b> an activity. For system test execution, typically:<br>• requirements and test cases reviewed and approved;<br>• the build deployed to the test environment and the smoke test passed;<br>• test data and accounts ready.<br><br><b>Exit criteria</b> — conditions to <b>finish</b> it (also called completion criteria). Typically:<br>• planned tests executed (e.g. 100% of high-priority tests, 95% overall);<br>• no open critical or high-severity defects, and the remaining ones reviewed and accepted;<br>• requirement coverage achieved (traceability matrix complete);<br>• test summary report shared.<br><br>They are written in the <b>test plan</b> and agreed with stakeholders up front, so the go/no-go discussion is based on facts, not pressure. If the deadline arrives and exit criteria are not met, the tester’s job is to report the gap and the risk clearly — the business owner decides whether to accept it.',
    followups: ['What would you do if the release date arrives but the exit criteria are not met?', 'Who defines and approves the exit criteria?'],
    mistakes: ['Saying exit criteria simply means “zero open bugs”.', 'Starting test execution on a build that failed the smoke test.'],
    lesson: 'fd-stlc'
  },
  {
    id: 'iq-fun-15', cat: 'fundamentals', level: 'intermediate', freq: 'very-common',
    q: 'What is the difference between a test plan and a test strategy?',
    short: 'A test strategy is the high-level approach to testing, usually organisation- or product-wide and long-lived. A test plan is specific to a project or release: scope, schedule, people, environments, risks and entry/exit criteria.',
    answer: '<b>Test strategy</b> — <b>how we test, in general</b>. Usually long-lived and written at organisation, product or programme level by a QA manager or lead. It covers test levels and types, the risk approach, automation approach, tools, environments, the defect process and metrics.<br><br><b>Test plan</b> — <b>what, when and who for this release or project</b>. Written by a test lead and updated as things change. Typical contents: scope (in and out), features to test, approach, schedule, team and responsibilities, environments and test data, entry/exit and suspension criteria, risks and mitigations, deliverables.<br><br><b>Example:</b> ShopFlow’s strategy says every release gets automated API regression plus risk-based manual testing. The plan for the “Buy now, pay later” release names the features, the two testers, the sandbox payment provider, the dates and the exit criteria.<br><br>In small Agile teams the strategy may be one page and the plan a light sprint test plan — but both sets of questions still need answers.',
    followups: ['What are the main sections of a test plan?', 'What are suspension and resumption criteria?', 'Who writes and approves the test plan?'],
    mistakes: ['Saying they are the same document with different names.', 'Describing a test plan as just a list of test cases.'],
    lesson: 'mt-planning'
  },
  {
    id: 'iq-fun-16', cat: 'fundamentals', level: 'beginner', freq: 'occasional',
    q: 'What is the difference between ad-hoc testing, monkey testing and exploratory testing?',
    short: 'Ad-hoc testing is informal and unplanned, driven by intuition. Monkey testing feeds random inputs, often via a tool, to see whether the system crashes. Exploratory testing is structured: learning, designing and executing at once, guided by a charter.',
    answer: '<b>Ad-hoc testing</b> — informal testing with no plan or documentation. The tester uses knowledge and intuition to try to break the feature. Quick, but hard to repeat or to report coverage.<br><b>Monkey testing</b> — random inputs with little or no knowledge of the system: random taps, keystrokes or data, often generated by a tool (Android’s UI/Application Exerciser Monkey is a classic example). Good for finding crashes and robustness problems, poor at checking correct behaviour.<br><b>Exploratory testing</b> — <b>structured</b> freedom. You learn, design and execute at the same time, guided by a <b>charter</b> (“Explore MediBook rescheduling with an expired session to find data loss”) inside a time box, and you take notes so the results can be reported.<br><br>Key point for interviews: exploratory testing is not the same as ad-hoc testing. It has a goal, a time box and a debrief, which makes it a professional technique rather than random clicking.',
    followups: ['When is ad-hoc testing useful?', 'What is a test charter, and what does it contain?'],
    mistakes: ['Saying exploratory testing is just random clicking with no planning.', 'Using monkey testing as a replacement for functional testing.'],
    lesson: 'mt-exploratory'
  },
  {
    id: 'iq-fun-17', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What is the difference between positive and negative testing?',
    short: 'Positive testing checks the system works with valid input and expected behaviour. Negative testing checks it handles invalid input and unexpected actions gracefully — clear errors, no crashes, no bad data saved.',
    answer: '<b>Positive testing</b> — valid data and expected actions; the system should do what it promises. Example for a PeopleOps age field that accepts 18–60: enter 30 and the form saves.<br><b>Negative testing</b> — invalid data or unexpected actions; the system should reject them gracefully. Examples:<br>• age 17, 61, -5, “abc” or blank;<br>• a 5,000-character name;<br>• script text such as <code>&lt;script&gt;</code> pasted into a field;<br>• double-clicking Submit, pressing Back after payment, losing the network mid-save.<br><br>“Gracefully” means a clear, helpful error message, no crash or stack trace, no partial or corrupt data saved, and a way for the user to recover.<br><br>A good test set has both. Beginners often write only happy paths, yet many production bugs come from inputs and actions nobody expected. Equivalence partitioning helps you choose invalid classes systematically, and boundary values find the edges.',
    followups: ['Write three negative test cases for a login page.', 'What does a good error message look like?'],
    mistakes: ['Writing only happy-path test cases.', 'Thinking a negative test “fails” when the system correctly shows an error — that is a pass.'],
    lesson: 'mt-scenarios-cases'
  },
  {
    id: 'iq-fun-18', cat: 'fundamentals', level: 'intermediate', freq: 'common',
    q: 'What is end-to-end testing, and how is it different from system testing?',
    short: 'End-to-end testing checks a complete user or business journey across every connected part — UI, APIs, database and external services — as a real user would. System testing checks the whole system against its requirements, often feature by feature.',
    answer: '<b>End-to-end (E2E) testing</b> follows a real business journey from start to finish across all the pieces involved.<br><br><b>Example — a ShopFlow order:</b> search a product → add to cart → apply a coupon → pay through the payment sandbox → order saved in the database → stock reduced → confirmation email sent → order visible in the admin panel.<br><br><b>How it differs from system testing:</b><br>• System testing is a <b>test level</b>: the whole system against its requirements, including feature-level and non-functional checks.<br>• E2E is a <b>journey-focused</b> style that often runs during system and system-integration testing, emphasising how data passes between components and external services.<br>• A system test might check that the coupon rule is correct; the E2E test checks the discounted amount survives all the way to the invoice and the refund.<br><br>E2E tests are valuable but slow and fragile when automated, so teams keep a small set for critical journeys and push most checks down to the API and unit layers (the test pyramid).',
    followups: ['Why should automated end-to-end tests be few?', 'Which end-to-end journeys would you pick for an e-commerce site?'],
    mistakes: ['Saying end-to-end testing means testing every feature of the system.', 'Building most of the automation suite as UI end-to-end tests.'],
    lesson: 'fd-levels-types'
  },
  {
    id: 'iq-fun-19', cat: 'fundamentals', level: 'intermediate', freq: 'occasional',
    q: 'Why shouldn’t developers be the only people who test their own code?',
    short: 'Authors share the same assumptions as their code, so they tend to miss the same things. Independent testers bring different perspectives and challenge assumptions — but developer testing is still valuable; the best approach mixes levels of independence.',
    answer: '<b>Why independence helps:</b><br>• The author tends to test what they <i>meant</i> to build; an independent tester checks what the spec says and what the <i>user</i> needs.<br>• Different backgrounds expose different kinds of defects and question hidden assumptions in requirements and design.<br>• People are naturally less critical of their own work.<br><br><b>But it is not either/or:</b> developers know the code best and catch many defects quickly with unit tests. A common mix: developers do unit and component integration testing, the QA team does system testing, and business users do acceptance testing.<br><br><b>Too much independence has costs:</b> testers isolated from the team, slower feedback, an “us vs them” culture, developers feeling quality is “QA’s job”, and testers blamed as the bottleneck.<br><br>So my answer: developers should test their own code, but should not be the only safety net — independent eyes plus close collaboration gives the best result.',
    followups: ['What are the drawbacks of a completely separate test team?', 'How do you build a good working relationship with developers?'],
    mistakes: ['Saying developers should never test their own code.', 'Implying developers are careless or that testers exist to catch them out.'],
    lesson: 'fd-test-process'
  },
  {
    id: 'iq-fun-20', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'What is the difference between testing and debugging?',
    short: 'Testing finds failures and defects and reports them. Debugging is the development activity of locating the cause of a failure, fixing it and checking the fix. Testers test; developers usually debug.',
    answer: '<b>Testing</b> shows that something is wrong. Dynamic testing triggers failures; static testing (reviews) finds defects directly. The output is a clear bug report with steps, evidence and impact. Usually done by testers, and by developers at unit level.<br><br><b>Debugging</b> finds <b>why</b> it is wrong and removes it: reproduce the failure, locate the defect in the code, fix it. Usually done by developers using breakpoints, logs and stack traces.<br><br>Then testing returns: <b>confirmation testing</b> (retest) proves the fix works, and <b>regression testing</b> checks it broke nothing else.<br><br><b>Example:</b> a tester finds the PayLite balance is wrong after a refund and reports it with the transaction id and screenshots. The developer debugs, finds a rounding error in the refund service and fixes it. The tester retests the refund and runs regression on payments.<br><br>A tester who attaches console logs or network evidence makes debugging faster — but the fix still belongs to the developer.',
    followups: ['What information in a bug report speeds up debugging?', 'What happens after a developer marks a bug as fixed?'],
    mistakes: ['Using “testing” and “debugging” as synonyms.', 'Saying testers should fix the code themselves when they find a bug.'],
    lesson: 'fd-what-is-testing'
  },
  {
    id: 'iq-fun-21', cat: 'fundamentals', level: 'beginner', freq: 'common',
    q: 'Explain the V-model. How is it different from the Waterfall model?',
    short: 'The V-model pairs each development phase with a test level — requirements with acceptance, system design with system testing, architecture with integration, detailed design with unit testing — so test design starts early, unlike classic Waterfall.',
    answer: 'In <b>Waterfall</b>, phases run strictly in sequence — requirements, design, coding, testing, deployment — and testing is one late phase, so requirement defects are found very late, when they are expensive.<br><br>The <b>V-model</b> is still sequential, but it links each development phase on the left side of the “V” to a test level on the right:<br>• Business requirements ↔ <b>acceptance testing</b><br>• System requirements and design ↔ <b>system testing</b><br>• Architecture / high-level design ↔ <b>integration testing</b><br>• Detailed design ↔ <b>unit testing</b><br>Coding sits at the bottom of the V.<br><br><b>Benefit:</b> testers start early — designing acceptance tests while requirements are written exposes ambiguous or untestable requirements before coding. <b>Drawback:</b> like Waterfall, it copes badly with changing requirements and delivers working software late. That is why most product teams now work iteratively, while the V-model remains common in regulated domains such as medical devices and automotive.',
    followups: ['Which SDLC model have you worked with, and how did testing fit in?', 'Why is the V-model popular in regulated industries?'],
    mistakes: ['Saying that in the V-model testing starts only after coding.', 'Describing the V-model as an Agile model.'],
    lesson: 'fd-sdlc-models'
  },

  /* ===================== Test design ===================== */
  {
    id: 'iq-des-01', cat: 'design', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between a test scenario, a test case and a test script?',
    short: 'A test scenario is a one-line, high-level “what to test”. A test case is the detailed “how”: preconditions, data, steps and expected result. A test script is usually the automated code that runs a test case.',
    answer: '<b>Test scenario</b> — a one-line, high-level idea of <b>what</b> to test, usually traced to a requirement. Example: “Verify a registered user can log in to PeopleOps.”<br><b>Test case</b> — the detailed <b>how</b> for one condition of that scenario: ID, title, preconditions, test data, steps and expected result. One scenario usually becomes several cases — valid login, wrong password, locked account, empty fields, case-sensitive password.<br><b>Test script</b> — in most teams, the <b>automated</b> code that executes a test case (for example a Playwright or Selenium test). In manual-heavy contexts it can also mean a very detailed step-by-step procedure.<br><b>Test suite</b> — a collection of test cases grouped for a purpose, such as the login regression suite or the smoke suite.<br><br>Scenarios are quick to review with the product owner for coverage; test cases make execution repeatable by any tester; scripts make it repeatable by a machine.',
    followups: ['Write five test scenarios for a shopping cart.', 'When would you write scenarios only, without detailed test cases?'],
    mistakes: ['Saying a test scenario and a test case are the same thing.', 'Writing one huge test case that checks ten different conditions.'],
    lesson: 'mt-scenarios-cases'
  },
  {
    id: 'iq-des-02', cat: 'design', level: 'beginner', freq: 'very-common',
    q: 'How do you write a good test case, and what fields does it contain?',
    short: 'A good test case is clear, atomic and repeatable by anyone. It has an ID, a clear title, a requirement link, preconditions, test data, numbered steps, a specific expected result and a priority, plus fields for the actual result and status.',
    answer: '<b>Typical fields:</b> test case ID · title · requirement or story ID · preconditions · test data · steps · expected result · priority · actual result · status (pass / fail / blocked) · author, date and environment where relevant.<br><br><b>What makes it good:</b><br>• <b>Atomic</b> — one condition per case, so a failure points to one thing.<br>• <b>Specific expected result</b> — “the message ‘Password must be 8–20 characters’ appears under the field and the form is not submitted”, not “an error is shown”.<br>• <b>Repeatable</b> — exact data and preconditions, so another tester gets the same result.<br>• <b>Traceable</b> — linked to a requirement, so coverage can be shown.<br>• <b>Independent</b> — does not rely on another case running first, unless that is stated.<br>• <b>Clear and short</b> — simple action steps (“Enter…”, “Click…”).<br><br><b>Example title:</b> “Login with a valid email and wrong password shows a generic error and reveals no account details.” I also ask a peer or the BA to review my cases to catch gaps early.',
    followups: ['What is the difference between a precondition and a test step?', 'How do you keep test cases maintainable when the UI changes often?', 'How many steps should a single test case have?'],
    mistakes: ['Writing vague expected results such as “should work properly”.', 'Combining many conditions into one long test case.'],
    lesson: 'mt-scenarios-cases'
  },
  {
    id: 'iq-des-03', cat: 'design', level: 'beginner', freq: 'very-common',
    q: 'What is equivalence partitioning? Give an example.',
    short: 'Equivalence partitioning divides inputs into groups the system should treat the same way — valid and invalid — and tests one representative value from each group, cutting the number of tests while still covering every rule.',
    answer: '<b>Idea:</b> if the system treats every value in a group the same way, one value from that group is as good as all of them. So you split inputs (and outputs) into <b>partitions</b> — valid and invalid — and test one representative of each.<br><br><b>Example — PeopleOps age field, valid 18–60:</b><br>• Invalid, below 18 → test 10<br>• Valid, 18–60 → test 35<br>• Invalid, above 60 → test 75<br>• Invalid by type: “abc”, blank, or 25.5 if only whole numbers are allowed<br><br>That is a handful of tests instead of hundreds.<br><br><b>Good practice:</b><br>• Test invalid partitions <b>one at a time</b>, otherwise one error can hide another.<br>• Partitions apply to outputs too — tax bands, shipping fee tiers, grade ranges.<br>• Combine it with <b>boundary value analysis</b>, because defects gather at the edges of partitions, and one middle value per partition will not catch them.',
    followups: ['What are the boundary values for the same 18–60 field?', 'Why should invalid partitions be tested one at a time?', 'How would you partition a file upload field?'],
    mistakes: ['Choosing only valid partitions and forgetting the invalid ones.', 'Testing many values from the same partition and calling it extra coverage.'],
    lesson: 'mt-equivalence'
  },
  {
    id: 'iq-des-04', cat: 'design', level: 'beginner', freq: 'very-common',
    q: 'What is boundary value analysis? Which values would you test for a field that accepts 1 to 10?',
    short: 'BVA tests values at and just around the edges of valid ranges, where off-by-one defects hide. For 1–10, two-value BVA tests 0, 1, 10 and 11; three-value BVA tests 0, 1, 2, 9, 10 and 11.',
    answer: '<b>Boundary value analysis (BVA)</b> builds on equivalence partitioning by testing the <b>edges</b> of each partition, because developers often get comparisons wrong (<code>&lt;</code> instead of <code>&lt;=</code>).<br><br><b>Field accepting whole numbers 1–10:</b><br>• <b>Two-value BVA</b> — each boundary and its closest neighbour outside: <b>0, 1, 10, 11</b>.<br>• <b>Three-value BVA</b> — each boundary plus the value on each side of it: <b>0, 1, 2, 9, 10, 11</b>.<br>Expected: 0 and 11 rejected; 1, 2, 9 and 10 accepted.<br><br><b>Practical extras:</b><br>• Ask about type and precision: for a price with two decimals and a minimum of 1.00, the neighbours are 0.99 and 1.01.<br>• Lengths have boundaries too: a password of 8–20 characters → test 7, 8, 20 and 21 characters.<br>• Add invalid types from partitioning (blank, text, negative).<br><br>BVA gives a small, sharp set of tests that catches the most common off-by-one bugs.',
    followups: ['Which values would you test for a discount that applies to orders over 5,000?', 'How does BVA apply to a date range?', 'Is BVA useful for fields that have no numeric range?'],
    mistakes: ['Testing only the boundaries themselves (1 and 10) without the values just outside them.', 'Mixing up two-value and three-value BVA, or listing a middle value like 5 as a boundary.'],
    lesson: 'mt-boundary'
  },
  {
    id: 'iq-des-05', cat: 'design', level: 'intermediate', freq: 'common',
    q: 'What is decision table testing, and when would you use it?',
    short: 'Decision table testing models business rules that combine several conditions. Each column (rule) is one combination of conditions with its expected action, so every meaningful combination is covered systematically.',
    answer: 'Use it when the outcome depends on <b>combinations</b> of conditions — discounts, eligibility, pricing, access rights.<br><br><b>How:</b> list the conditions and actions as rows and create one column (rule) per combination. With <i>n</i> yes/no conditions there are 2ⁿ combinations; then merge columns where a condition makes no difference to the result.<br><br><b>Example — ShopFlow free shipping:</b> free if the customer is a member <b>or</b> the cart is over 3,000, but never for oversized items.<br>• Member Y, cart over 3,000 Y, oversized N → free<br>• Member Y, cart N, oversized N → free<br>• Member N, cart Y, oversized N → free<br>• Member N, cart N, oversized N → paid<br>• Oversized Y, any other values → paid<br>Each rule becomes at least one test case.<br><br><b>Why interviewers like it:</b> building the table exposes missing or contradictory rules — it often produces a question for the BA (“does a member with an oversized item pay?”) before any code is written.',
    followups: ['How many rules does a table with four yes/no conditions have before you collapse it?', 'How is a decision table different from pairwise testing?'],
    mistakes: ['Testing each condition on its own and never testing combinations.', 'Collapsing rules without checking that the merged condition really makes no difference.'],
    lesson: 'mt-decision-tables'
  },
  {
    id: 'iq-des-06', cat: 'design', level: 'intermediate', freq: 'common',
    q: 'What is state transition testing? Give an example.',
    short: 'State transition testing models a system whose behaviour depends on its current state and past events. You test the valid transitions, and also invalid ones that should be blocked, using a state diagram or state table.',
    answer: 'Use it when the same input gives different results depending on <b>history</b> — order status, account locking, approval workflows, ATM sessions.<br><br><b>Elements:</b> states, events (inputs), transitions, and guards or actions.<br><br><b>Example — PeopleOps login lock:</b><br>• States: Active → 1 failed → 2 failed → Locked.<br>• A wrong password moves one step along; a correct password from 1 or 2 failed resets to Active; a third wrong attempt locks the account.<br>• From Locked, even the correct password is refused until an admin unlocks it or 30 minutes pass.<br><br><b>Tests to design:</b><br>• every valid transition at least once;<br>• <b>invalid transitions</b> — logging in while Locked, or cancelling an order that is already Delivered;<br>• sequences — fail, fail, succeed, then fail again: does the counter reset correctly?<br><br>A state table (states × events) is a handy way to spot combinations nobody specified.',
    followups: ['What is the difference between a state diagram and a state table?', 'List the states of an e-commerce order and name two invalid transitions.'],
    mistakes: ['Testing only the happy path of transitions and skipping invalid ones.', 'Confusing state transition testing with simply checking that each screen works.'],
    lesson: 'mt-state-transition'
  },
  {
    id: 'iq-des-07', cat: 'design', level: 'intermediate', freq: 'occasional',
    q: 'What is use case testing?',
    short: 'Use case testing derives tests from use cases — the interactions between an actor and the system to reach a goal. You test the main success flow, the alternative flows and the exception flows, from the user’s point of view.',
    answer: 'A <b>use case</b> describes how an <b>actor</b> (a user or an external system) interacts with the system to reach a goal, with a main flow and its variations.<br><br><b>Test design:</b><br>• <b>Main (basic) flow</b> — the happy path.<br>• <b>Alternative flows</b> — valid variations that still reach the goal.<br>• <b>Exception flows</b> — errors that block the goal and need graceful handling.<br>• Preconditions and postconditions become setup and verification steps.<br><br><b>Example — MediBook “Book appointment”:</b><br>• Main: the patient logs in, picks a doctor and slot, confirms and receives an SMS.<br>• Alternative: books as a guest using an OTP; picks another slot after the first is taken.<br>• Exception: the slot is taken at the moment of confirming; payment fails; the session expires.<br>• Postcondition: the slot is no longer offered to other patients.<br><br>Use case testing suits system and acceptance testing because it follows real user goals and finds gaps between steps.',
    followups: ['How is a use case different from a user story?', 'Which flow would you test first, and why?'],
    mistakes: ['Testing only the main success flow.', 'Forgetting to verify postconditions, such as data saved or slots updated.'],
    lesson: 'mt-pairwise'
  },
  {
    id: 'iq-des-08', cat: 'design', level: 'beginner', freq: 'common',
    q: 'What is error guessing in software testing?',
    short: 'Error guessing is an experience-based technique: the tester predicts likely mistakes and failures — from past defects, common developer errors and domain knowledge — and designs tests aimed at them.',
    answer: '<b>Error guessing</b> uses the tester’s experience to predict where the software is likely to break, then targets those spots. It complements formal techniques rather than replacing them.<br><br><b>Where the guesses come from:</b> defects in past releases, typical developer mistakes, weak spots of the technology, and knowledge of the domain.<br><br><b>Classic guesses for a form or API:</b><br>• blank, spaces-only and very long input;<br>• apostrophes, accents and emojis in names (O’Brien, José);<br>• leading zeros, negative numbers, zero quantity;<br>• dates — 29 February, time zones, month end;<br>• double submission, pressing Back after payment;<br>• uploading a 0 KB file or an .exe renamed to .jpg.<br><br>A more structured version is a <b>fault attack</b>: keep a checklist of past defect types and deliberately try each one. In interviews, say you build such checklists from your bug history — it shows the technique is systematic, not luck.',
    followups: ['Give five error-guessing tests for a file upload feature.', 'How is error guessing different from exploratory testing?'],
    mistakes: ['Describing error guessing as random guessing with no basis.', 'Relying on error guessing alone instead of combining it with formal techniques.'],
    lesson: 'mt-exploratory'
  },
  {
    id: 'iq-des-09', cat: 'design', level: 'beginner', freq: 'common',
    q: 'What is exploratory testing, and how do you carry it out?',
    short: 'Exploratory testing is simultaneous learning, test design and execution. You work in time-boxed sessions guided by a charter, adapt to what you find, and record notes, bugs and questions for a debrief.',
    answer: 'In exploratory testing you <b>design and run tests at the same time</b>, using what each result teaches you to choose the next test. It shines when requirements are thin, time is short, or scripted tests have already passed.<br><br><b>How I run it (session-based):</b><br>1. <b>Charter</b> — a mission: “Explore ShopFlow coupon codes with different cart contents to find wrong totals.”<br>2. <b>Time box</b> — usually 60–90 minutes without interruptions.<br>3. <b>Explore with heuristics</b> — boundaries, interruptions, create/read/update/delete, different roles, “what if I go back?”.<br>4. <b>Take notes</b> — what I covered, data used, bugs, questions, ideas for the next session.<br>5. <b>Debrief</b> — share findings and coverage with the lead or team.<br><br>It finds bugs scripted tests miss because the tester is thinking, not just following steps — and it stays accountable because the charter and notes show what was covered. It works best alongside scripted and automated regression, not instead of them.',
    followups: ['What does a good test charter contain?', 'How do you report coverage from exploratory testing?', 'When is exploratory testing a poor choice?'],
    mistakes: ['Saying exploratory testing is unplanned random clicking.', 'Claiming exploratory testing needs no notes or documentation at all.'],
    lesson: 'mt-exploratory'
  },
  {
    id: 'iq-des-10', cat: 'design', level: 'beginner', freq: 'very-common',
    q: 'What is a requirement traceability matrix (RTM), and why is it useful?',
    short: 'An RTM maps each requirement to the test cases that cover it, and often to results and defects. It reveals coverage gaps, supports impact analysis when requirements change, and gives evidence of what was tested.',
    answer: 'An <b>RTM</b> is a table linking <b>requirements → test cases → execution results → defects</b>.<br><br><b>Example rows:</b><br>• REQ-12 “Reset link expires after 30 minutes” → TC-41, TC-42 → Pass, Fail → BUG-210<br>• REQ-13 “Reset link works only once” → <i>no test cases</i> — a coverage gap!<br><br><b>Why it is useful:</b><br>• <b>Coverage</b> — every requirement has at least one test, so nothing is forgotten.<br>• <b>Impact analysis</b> — when REQ-12 changes from 30 to 15 minutes, you know exactly which tests to update and rerun.<br>• <b>Status reporting</b> — “18 of 20 requirements pass; REQ-12 is blocked by a high-severity bug.”<br>• <b>Audit and compliance</b> — evidence for regulated domains such as banking and health.<br><br><b>Types:</b> forward (requirements → tests), backward (tests → requirements, which exposes tests with no purpose) and bidirectional. In Agile teams, links between stories, tests and bugs in tools like Jira often provide the same traceability.',
    followups: ['At which STLC phase do you create the RTM?', 'What is the difference between forward and backward traceability?'],
    mistakes: ['Describing the RTM as just a list of test cases.', 'Treating it as a one-time document that is never updated when requirements change.'],
    lesson: 'mt-planning'
  },
  {
    id: 'iq-des-11', cat: 'design', level: 'intermediate', freq: 'common',
    q: 'What is test coverage, and is 100% coverage possible?',
    short: 'Test coverage measures how much of something your tests exercise — requirements, risks, code or configurations. 100% of one chosen measure is achievable, but it never means every possible behaviour has been tested.',
    answer: '<b>Coverage</b> = items exercised by tests ÷ total items × 100, for a chosen kind of item:<br>• <b>Requirement coverage</b> — requirements with at least one test (shown in the RTM).<br>• <b>Risk coverage</b> — high-risk areas tested to the planned depth.<br>• <b>Code coverage</b> — statements or branches executed, measured by tools during automated tests.<br>• <b>Configuration coverage</b> — the browsers, devices and OS versions tested.<br><br><b>Is 100% possible?</b> For one specific measure, yes — every requirement has a test, or every statement runs. But covering <b>all inputs, paths and combinations</b> is impossible, because exhaustive testing is impossible. And 100% code coverage only shows the code ran — not that the assertions were good, or that missing features were noticed.<br><br><b>Strong answer:</b> “I aim for full requirement coverage with risk-based depth, track code coverage as a signal, and always report what was <i>not</i> covered.”',
    followups: ['What is the difference between statement and branch coverage?', 'How can a suite with 100% code coverage still miss bugs?'],
    mistakes: ['Claiming 100% coverage means the software is fully tested.', 'Talking only about code coverage when the question is about test coverage in general.'],
    lesson: 'mt-planning'
  },
  {
    id: 'iq-des-12', cat: 'design', level: 'intermediate', freq: 'common',
    q: 'How do you decide how many test cases are enough?',
    short: 'There is no fixed number. It is enough when every requirement and risk is covered to an agreed depth using test techniques, the exit criteria are met, and the remaining risk is understood and accepted by stakeholders.',
    answer: 'Because exhaustive testing is impossible, “enough” is a <b>risk decision</b>, not a count.<br><br><b>How I decide:</b><br>• <b>Requirement coverage</b> — every acceptance criterion has positive and negative tests, checked through the RTM.<br>• <b>Techniques, not guesswork</b> — partitions and boundaries for inputs, decision tables for rule combinations, state transitions for workflows. They give a justified minimum set.<br>• <b>Risk-based depth</b> — payments or personal data get more and deeper tests; a static “About us” page gets very few.<br>• <b>Exit criteria</b> — agreed targets for execution, pass rate and open defects.<br>• <b>Feedback</b> — if new tests keep finding bugs in an area, we are not done there.<br><br><b>Example:</b> for PayLite’s daily transfer limit, about 15 well-chosen cases — boundaries, account types, roles, failure paths — beat 200 random ones.<br><br>What I tell stakeholders: “Here is what we covered, here is what remains, and here is the risk.”',
    followups: ['How do you explain residual risk to a product owner?', 'What would you cut first if the number of test cases had to be halved?'],
    mistakes: ['Giving a fixed number or ratio, such as “ten test cases per requirement”.', 'Saying you keep testing until no more bugs are found.'],
    lesson: 'fd-risk-based'
  },
  {
    id: 'iq-des-13', cat: 'design', level: 'intermediate', freq: 'occasional',
    q: 'What is pairwise testing, and when would you use it?',
    short: 'Pairwise (all-pairs) testing makes sure every pair of parameter values appears together in at least one test, instead of testing every full combination. It shrinks huge combination sets while still catching most interaction bugs.',
    answer: '<b>The problem:</b> combinations explode. A ShopFlow checkout with 4 browsers × 3 payment methods × 3 shipping options × 2 user types has <b>72</b> full combinations.<br><br><b>The idea:</b> most interaction defects are triggered by just <b>two</b> factors together (e.g. Safari + wallet payment). So instead of every full combination, make sure every <b>pair</b> of values appears in at least one test. For the example above, about 12 tests can cover all pairs.<br><br><b>How:</b> use a generator tool (PICT is a well-known free one), add constraints for impossible combinations (“no cash on delivery for digital goods”), then review the output and add must-have combinations based on risk.<br><br><b>Good for:</b> browser/device/OS configurations, forms with many independent options, settings screens.<br><b>Limits:</b> it can miss defects that need three or more factors at once, and it does not replace decision tables when specific combinations drive different business outcomes.',
    followups: ['How is pairwise testing different from decision table testing?', 'How would you choose which browsers and devices to test on?'],
    mistakes: ['Claiming pairwise testing covers all combinations.', 'Using pairwise testing for business rules where specific combinations produce different outcomes.'],
    lesson: 'mt-pairwise'
  },
  {
    id: 'iq-des-14', cat: 'design', level: 'intermediate', freq: 'common',
    q: 'How do you prepare and manage test data?',
    short: 'I derive data from the test design (partitions, boundaries, roles, states), create it repeatably via APIs, scripts or fixtures, keep it independent per test, mask or synthesise anything personal, and clean up afterwards.',
    answer: '<b>1. Decide what is needed</b> from the test design: valid and invalid partitions, boundary values, and different roles and states — new user, locked account, zero balance, order already shipped.<br><b>2. Create it repeatably:</b><br>• through APIs or seed scripts rather than slow manual UI setup;<br>• SQL inserts for complex states, on test databases only;<br>• fixtures or factories in automation with unique values (e.g. timestamped emails), so parallel tests do not collide.<br><b>3. Keep tests independent</b> — each test creates or reserves its own data, so run order and other testers cannot break it.<br><b>4. Protect privacy</b> — never copy real customer data into test environments without masking; prefer synthetic data, especially for health (MediBook) and finance (PayLite).<br><b>5. Maintain it</b> — document shared accounts, reseed after environment resets, and clean up what tests create.<br><br>Many “flaky” or “cannot reproduce” issues turn out to be test data problems, so good data management saves real time.',
    followups: ['Why is using a copy of production data in testing risky?', 'How do you stop parallel automated tests from interfering with each other’s data?'],
    mistakes: ['Using one shared account for every test and every tester.', 'Copying real customer data into a test environment without masking it.'],
    lesson: 'mt-config-env'
  },
  {
    id: 'iq-des-15', cat: 'design', level: 'intermediate', freq: 'very-common',
    q: 'You have limited time and too many test cases. How do you prioritise?',
    short: 'I prioritise by risk — likelihood of failure times business impact. Critical journeys, changed and fixed areas, defect-prone modules and anything touching money, security or personal data come first; I report clearly what was skipped.',
    answer: 'I use <b>risk-based prioritisation</b>: risk = likelihood of failure × impact if it fails.<br><br><b>My order:</b><br>1. <b>Smoke</b> — is the build testable at all?<br>2. <b>Critical business journeys</b> — for ShopFlow: sign in, search, add to cart, pay, order confirmation.<br>3. <b>What changed</b> — new and modified features, plus <b>retests</b> of bug fixes.<br>4. <b>High-impact areas</b> — money, security, personal data, legal requirements.<br>5. <b>Defect-prone areas</b> — modules with a bug history, since defects cluster.<br>6. <b>Integration points</b> around the change — targeted regression.<br>7. Low-risk, stable, rarely used features last.<br><br>I confirm these priorities quickly with the product owner and dev lead, so business impact is judged correctly, and I run tests in that order so the most important information arrives first.<br><br>Most importantly, I <b>report what was not tested</b> and the risk that leaves, so the release decision is made with full information — never by quietly skipping tests.',
    followups: ['What would you test in the last 30 minutes before a release?', 'Who should decide which tests are skipped?'],
    mistakes: ['Running tests in document order and simply stopping when time runs out.', 'Skipping tests silently without telling stakeholders what risk remains.'],
    lesson: 'mt-prioritization'
  },
  {
    id: 'iq-des-16', cat: 'design', level: 'advanced', freq: 'occasional',
    q: 'What is the difference between statement coverage and branch coverage?',
    short: 'Statement coverage is the share of executable statements run by tests. Branch (decision) coverage is the share of decision outcomes exercised — true and false for each decision. 100% branch coverage guarantees 100% statement coverage, not the reverse.',
    answer: 'Both are <b>white-box coverage</b> measures:<br>• <b>Statement coverage</b> = statements executed ÷ executable statements × 100.<br>• <b>Branch (decision) coverage</b> = branch outcomes exercised ÷ all branch outcomes × 100 — every <code>if</code> must go both true <b>and</b> false.<br><br><b>Classic example:</b><br><code>let discount;</code><br><code>if (isMember) { discount = 10; }</code><br><code>total = price - discount;</code><br>• One test with <code>isMember = true</code> runs <b>every statement</b> → 100% statement coverage.<br>• But the false outcome never ran → only 50% branch coverage, and the bug for non-members (<code>discount</code> is undefined, so the total becomes NaN) is missed.<br>• Adding a test with <code>isMember = false</code> reaches 100% branch coverage and exposes it.<br><br><b>Key rule:</b> 100% branch coverage implies 100% statement coverage, but 100% statement coverage does <b>not</b> imply 100% branch coverage — branch coverage is stronger. Neither proves correctness; they show which code ran, not whether the checks were right.',
    followups: ['How many tests are needed for full statement and full branch coverage of two separate if statements with no else?', 'Can a suite with 100% branch coverage still miss defects?'],
    mistakes: ['Saying statement coverage and branch coverage are the same thing.', 'Claiming 100% statement coverage implies 100% branch coverage.'],
    lesson: 'mt-whitebox'
  },
  {
    id: 'iq-des-17', cat: 'design', level: 'beginner', freq: 'common',
    q: 'Which test design techniques do you know, and how do you choose one?',
    short: 'Black-box (equivalence partitioning, boundary values, decision tables, state transition, use cases), white-box (statement and branch coverage) and experience-based (error guessing, exploratory, checklists). The requirement’s shape decides which.',
    answer: '<b>Three families:</b><br>• <b>Black-box (specification-based)</b> — equivalence partitioning, boundary value analysis, decision tables, state transition, use case testing, pairwise.<br>• <b>White-box (structure-based)</b> — statement and branch coverage, usually in unit tests.<br>• <b>Experience-based</b> — error guessing, exploratory testing, checklist-based testing.<br><br><b>How I choose — the requirement’s shape decides:</b><br>• Inputs with ranges or formats → <b>EP + BVA</b> (age 18–60, password 8–20 characters).<br>• Several conditions combining into an outcome → <b>decision table</b> (discount rules).<br>• Behaviour that depends on status or history → <b>state transition</b> (order status, account lock).<br>• End-to-end user goals → <b>use case</b> testing.<br>• Many independent configuration options → <b>pairwise</b>.<br>• Vague requirements, new features, tight time → <b>exploratory</b> plus <b>error guessing</b>.<br><br>In practice I combine them: on a PayLite transfer screen, BVA for the amount, a decision table for limits by account type, and an exploratory session for interruptions.',
    followups: ['Which technique would you use for an account that locks after three failed logins?', 'What is the difference between specification-based and experience-based techniques?'],
    mistakes: ['Naming techniques without explaining when each one fits.', 'Saying you write test cases purely from experience and never use techniques.'],
    lesson: 'mt-equivalence'
  },
  {
    id: 'iq-des-18', cat: 'design', level: 'intermediate', freq: 'very-common',
    q: 'How do you write test cases when requirements are missing, unclear or keep changing?',
    short: 'I clarify early — take specific questions to the BA, product owner and developers, use concrete examples and record the answers. Meanwhile I use other oracles (similar features, mock-ups, standards), write light scenarios first, and explore the build.',
    answer: '<b>1. Ask, don’t assume.</b> List concrete questions for the product owner, BA or developer — “What happens if the coupon expires during checkout?” — and record the answers in the story so they become part of the requirement.<br><b>2. Use examples.</b> Turning a vague rule into examples (“cart 2,999 → no free shipping; 3,000 → free?”) surfaces disagreements in minutes. Three amigos sessions help here.<br><b>3. Find other oracles:</b> earlier versions, similar features in the product, mock-ups, competitor apps, platform and accessibility guidelines, and reasonable user expectations.<br><b>4. Start lightweight.</b> Write scenarios and checklists first, review them with the team, and add detail as the requirement settles, so changes cost less.<br><b>5. Explore the build</b> to compare real behaviour with what the team intended.<br><b>6. Make assumptions visible</b> — note them in the test cases and flag them as risks in status reports.<br><br>An unclear requirement is a defect in itself; raising it early is one of the most valuable things a tester does.',
    followups: ['What questions would you ask about a story that says “users can reset their password”?', 'What is a test oracle?'],
    mistakes: ['Saying you would wait until the requirements are complete before doing anything.', 'Silently guessing the expected behaviour and testing against your own assumption.'],
    lesson: 'mt-requirements'
  },

  /* ===================== Defects ===================== */
  {
    id: 'iq-def-01', cat: 'defects', level: 'beginner', freq: 'very-common',
    q: 'Explain the bug (defect) life cycle.',
    short: 'A defect usually moves New → Assigned → Open → Fixed → Retest → Verified → Closed. If the retest fails it is Reopened; triage can also mark it Rejected, Duplicate or Deferred. Exact names depend on the team’s tool and workflow.',
    answer: '<b>Main path:</b><br>• <b>New</b> — the tester logs the bug.<br>• <b>Assigned</b> — triage accepts it and gives it to a developer.<br>• <b>Open / In progress</b> — the developer analyses and fixes it.<br>• <b>Fixed</b> — the fix is in a build available for testing.<br>• <b>Retest</b> — the tester re-runs the original steps on that build.<br>• <b>Verified → Closed</b> — the fix is confirmed, with a quick regression check around it.<br><br><b>Side paths:</b><br>• <b>Reopened</b> — the retest failed; back to the developer with the build number and evidence.<br>• <b>Rejected</b> — not a defect (works as designed, or invalid).<br>• <b>Duplicate</b> — already reported; linked to the original.<br>• <b>Deferred</b> — a real defect, postponed to a later release.<br>• <b>Cannot reproduce / Need info</b> — more detail is required.<br><br>I always add that names vary between companies and tools such as Jira. What matters is that every state has a clear owner, and that a bug is closed only after the tester (or the agreed role) has verified the fix.',
    followups: ['Who is allowed to close a bug, and why?', 'What do you do when the same bug is reopened several times?', 'What is the difference between Deferred and Rejected?'],
    mistakes: ['Saying the developer closes the bug as soon as they have fixed it.', 'Reciting state names without saying who moves the bug between them.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-02', cat: 'defects', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between severity and priority? Give examples.',
    short: 'Severity is the impact of a defect on the system or user, usually set by the tester. Priority is how urgently it should be fixed, a business decision. A typo in the company name on the home page is low severity but high priority.',
    answer: '<b>Severity</b> = <b>impact</b> — how badly the defect affects the system or the user. Usually assessed by the tester (e.g. Critical, Major, Minor, Trivial).<br><b>Priority</b> = <b>urgency</b> — how soon it must be fixed. A business or product decision (e.g. P1–P4), often confirmed in triage.<br><br><b>The four combinations:</b><br>• <b>High severity, high priority</b> — ShopFlow checkout crashes for every user. Fix now.<br>• <b>Low severity, high priority</b> — the company name is misspelled on the home page. Nothing is functionally broken, but it hurts the brand, so it is fixed fast.<br>• <b>High severity, low priority</b> — a crash in a rarely used admin report that runs once a year and has a workaround. Serious impact, but it can wait for a planned release.<br>• <b>Low severity, low priority</b> — a slight misalignment on a seldom-visited help page.<br><br>The two often move together, but not always — that is exactly why bug trackers keep both fields.',
    followups: ['Who sets severity and who sets priority in your team?', 'Can priority change over time while severity stays the same?', 'Which would you fix first: high severity with low priority, or low severity with high priority?'],
    mistakes: ['Treating severity and priority as the same field.', 'Reversing the classic examples, such as calling a home-page typo high severity.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-03', cat: 'defects', level: 'beginner', freq: 'very-common',
    q: 'What makes a good bug report, and what does it contain?',
    short: 'A good bug report lets anyone reproduce the problem and judge its impact: a specific title, environment and build, preconditions, exact steps, expected vs actual result, reproduction rate, evidence such as screenshots and logs, severity, and neutral wording.',
    answer: '<b>Fields:</b><br>• <b>ID and a specific title</b> — what, where, when: “Checkout: SAVE10 coupon is ignored when the cart contains a sale item”.<br>• <b>Environment</b> — build or app version, URL, browser or device, OS, test account.<br>• <b>Preconditions and test data</b>.<br>• <b>Steps to reproduce</b> — numbered, minimal, exact.<br>• <b>Expected result</b> (with the requirement reference) vs <b>actual result</b>.<br>• <b>Reproducibility</b> — “3 of 3 attempts” or “2 of 10”.<br>• <b>Evidence</b> — screenshot, short video, console errors, network request and response, log extract.<br>• <b>Severity</b> (and suggested priority), component, and links to the story or related bugs.<br><br><b>Qualities:</b> one bug per report; factual, neutral language that describes behaviour and never blames people; a duplicate search before logging; the minimum steps needed.<br><br>My test: could a developer who has never seen this feature reproduce it in five minutes without messaging me? If yes, the report is good.',
    followups: ['How do you report a bug that only happens sometimes?', 'What do you check before logging a bug to avoid duplicates?'],
    mistakes: ['Vague titles such as “Checkout not working”.', 'Leaving out the environment, build number or expected result.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-04', cat: 'defects', level: 'intermediate', freq: 'common',
    q: 'What is the difference between bug leakage and bug release?',
    short: 'Bug leakage is a defect that testing missed and that was found later — in UAT or by customers in production. Bug release is when the team knowingly ships a build with known, usually low-impact defects, documented in the release notes.',
    answer: '<b>Bug leakage</b> — a defect that <b>slipped through</b> a test phase unnoticed and was found later, typically in UAT or by users in production. Example: a currency rounding error in PayLite that QA did not catch and a customer reported after release. It points to a gap in coverage, test data, environment or process.<br><br><b>Bug release</b> — the team <b>knowingly</b> releases software with known defects after deciding they are acceptable for now: low impact or low urgency, or with a workaround, and a fix planned for a later version. They are documented in the release notes or a known-issues list. Example: a minor layout issue on an old Android version shipped on purpose to hit a launch date.<br><br><b>Key difference:</b> leakage is <b>unknown and unintended</b>; release is <b>known and deliberate</b> — a risk the business has accepted.<br><br>Leakage is tracked with metrics such as escaped defects and defect removal efficiency, and each leak deserves a short root cause review.',
    followups: ['How would you measure bug leakage for a release?', 'Who decides whether a known bug can be released?'],
    mistakes: ['Saying the two terms mean the same thing.', 'Describing bug release as a process failure rather than a deliberate, documented risk decision.'],
    lesson: 'qb-release'
  },
  {
    id: 'iq-def-05', cat: 'defects', level: 'intermediate', freq: 'occasional',
    q: 'What is defect density, and which other defect metrics do you know?',
    short: 'Defect density is the number of confirmed defects divided by the size of the software — per KLOC, per function point or per module. It helps compare quality across modules or releases and find hotspots that need more attention.',
    answer: '<b>Defect density</b> = confirmed defects ÷ size.<br>Size can be thousands of lines of code (KLOC), function points, or simply a module or feature.<br><br><b>Example:</b> the PayLite transfers module (8 KLOC) had 24 defects → 3 per KLOC; the profile module (10 KLOC) had 5 → 0.5 per KLOC. Transfers is a hotspot that needs more review, testing and regression depth.<br><br><b>Other useful metrics:</b><br>• <b>Defect removal efficiency (DRE)</b> = defects found before release ÷ (found before + found after release) × 100. 95 before and 5 after → 95%.<br>• <b>Escaped defects</b> — bugs found in production per release.<br>• <b>Defect age / time to fix</b>, <b>reopen rate</b>, <b>rejection rate</b>.<br>• <b>Defect distribution</b> by module, severity or root cause.<br><br><b>Caution:</b> metrics should support decisions, not judge people. Counting bugs per tester or per developer encourages gaming — splitting bugs, arguing over severity — instead of improving quality.',
    followups: ['How do you calculate defect removal efficiency?', 'Why is “number of bugs found per tester” a poor metric?'],
    mistakes: ['Defining defect density as the raw number of defects without dividing by size.', 'Using defect metrics to rank or blame individual people.'],
    lesson: 'cp-metrics'
  },
  {
    id: 'iq-def-06', cat: 'defects', level: 'intermediate', freq: 'common',
    q: 'What is defect triage, and what is the tester’s role in it?',
    short: 'Defect triage is a regular meeting or process where the product owner, dev lead and QA review new defects, confirm they are valid, agree severity and priority, and decide who fixes them and when — or whether to defer or reject them.',
    answer: '<b>Triage</b> (a word borrowed from hospitals, where patients are sorted by urgency) is how a team decides what happens to each new defect.<br><br><b>Who:</b> typically the product owner or project manager, the dev lead and the QA lead or tester — sometimes support or business representatives.<br><br><b>For each bug they decide:</b><br>• Is it valid, reproducible and not a duplicate?<br>• Is the <b>severity</b> right, given the evidence?<br>• What is its <b>priority</b> against the release goals?<br>• Who fixes it, in which sprint or release — or is it deferred or rejected, with a reason?<br>• Is more information needed?<br><br><b>Tester’s role:</b> present each bug clearly — user impact, reproducibility, evidence — and answer questions. Good preparation keeps important bugs from being wrongly rejected.<br><br><b>Example:</b> before a ShopFlow release, triage decides the coupon rounding error is fixed now, a tooltip typo is deferred, and a reported tax “bug” is rejected because it matches the new tax rule.',
    followups: ['How often should triage happen close to a release?', 'What do you do if triage rejects a bug you believe is important?'],
    mistakes: ['Saying triage means the tester decides priorities alone.', 'Arriving at triage without evidence of user impact.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-07', cat: 'defects', level: 'beginner', freq: 'common',
    q: 'What do you do when a fixed bug fails your retest, or keeps getting reopened?',
    short: 'If the retest fails, I reopen it with the build number, exact steps, data and fresh evidence, after confirming it is the same issue and not a new one. If a bug keeps coming back, I work with the developer and lead to find the root cause.',
    answer: '<b>When my retest fails:</b><br>1. Confirm I am on the build that contains the fix and the environment is right (latest deployment, cache cleared).<br>2. Re-run the <b>original</b> steps and data exactly.<br>3. If it still fails, set the bug to <b>Reopened</b> with the build number, what I saw and new evidence.<br>4. If the original problem is fixed but something different now fails, log a <b>new bug</b> and link it instead of reopening the old one.<br><br><b>When a bug is reopened again and again:</b><br>• Talk to the developer directly — a 10-minute call often shows we understand the expected behaviour differently, or that only one of several code paths was fixed.<br>• Check whether the fix was lost in a merge or not deployed to every environment.<br>• Raise it at stand-up or with the lead if it blocks the release, and suggest an automated regression test so it cannot quietly return.<br><br>A high <b>reopen rate</b> is worth tracking — it points to unclear requirements, rushed fixes or deployment problems.',
    followups: ['When should you log a new bug instead of reopening the old one?', 'What might make a fixed bug reappear in a later release?'],
    mistakes: ['Reopening a bug for a different symptom instead of logging a new, linked bug.', 'Reopening without stating the build number and fresh evidence.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-08', cat: 'defects', level: 'intermediate', freq: 'very-common',
    q: 'A developer says your bug is “not a bug” or “works as designed”. What do you do?',
    short: 'I stay calm and evidence-based: re-check the requirement and acceptance criteria, then discuss it with the developer, focusing on user impact. If we still disagree, the product owner or BA decides. Either way I record the outcome in the ticket.',
    answer: '<b>1. Check myself first.</b> Re-read the requirement, acceptance criteria, designs and any recent change requests. Maybe the behaviour really did change and I missed it.<br><b>2. Talk, don’t argue in comments.</b> A short call or desk chat with the developer: show the steps, the evidence and the reference I am testing against, and listen to their reasoning.<br><b>3. Focus on user impact.</b> “Works as designed” can still be a poor design, so I describe what the user experiences: “Users who type a space after their email cannot log in and get no explanation.”<br><b>4. Bring in the right decision maker.</b> If we still disagree, the <b>product owner or BA</b> decides the expected behaviour — not the tester or the developer alone.<br><b>5. Record the outcome.</b> If it is rejected, the reason goes in the ticket; if it is a requirement gap, it becomes a new story or change request.<br><br>The goal is not to “win” — it is to make sure the team makes an informed decision about a real user risk.',
    followups: ['What if the product owner also says it is not a bug, but you believe users will be affected?', 'How do you keep a good relationship with a developer who often rejects your bugs?'],
    mistakes: ['Arguing in ticket comments or escalating to managers before talking to the developer.', 'Closing the bug silently without recording why it was rejected.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-09', cat: 'defects', level: 'intermediate', freq: 'common',
    q: 'A developer cannot reproduce your bug, or it only happens sometimes. How do you handle it?',
    short: 'I reproduce it again myself and compare environments — build, browser or device, account, data, configuration, timing. I add precise steps, the reproduction rate and evidence such as video, logs and network traces, and pair with the developer if needed.',
    answer: '<b>1. Reproduce it again myself</b> on the latest build and note exactly what it needs — data, account, sequence and timing.<br><b>2. Compare environments</b> with the developer. Typical differences: build version, browser or device, OS, user role, test data, feature flags, time zone or language, network speed, cache or cookies, and local versus shared test servers.<br><b>3. Strengthen the evidence:</b> a screen recording, timestamps, console errors, the network request and response (with any request ID), and server log lines if I can access them.<br><b>4. For intermittent bugs</b>, record the <b>reproduction rate</b> (“3 of 10 attempts”) and look for patterns — first login of the day, slow network, two tabs open, data created around midnight.<br><b>5. Pair up</b> — reproducing it together on my machine often reveals the cause in minutes.<br><br>If it still cannot be reproduced, I mark it “cannot reproduce” or “need info” according to team process, with everything we tried recorded. I do not simply close it, especially if money or data could be affected.',
    followups: ['How would you report a bug that happens once in twenty attempts?', 'Which DevTools information would you attach to a web bug?'],
    mistakes: ['Closing the bug immediately because the developer could not reproduce it once.', 'Changing several variables at once while trying to reproduce, so you cannot tell which one matters.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-10', cat: 'defects', level: 'beginner', freq: 'common',
    q: 'What do the Duplicate, Deferred and Rejected bug statuses mean?',
    short: 'Duplicate means the same defect is already reported, so it is linked to the original. Deferred means it is a real defect whose fix is postponed to a later release. Rejected means the team decided it is not a defect — for example, it works as designed.',
    answer: '<b>Duplicate</b> — the same underlying problem is already logged. Link the new ticket to the original and add any new information (another browser, extra steps) there. Search by keywords, component and error message <i>before</i> logging to avoid duplicates.<br><br><b>Deferred (postponed)</b> — a valid defect, but the team chooses to fix it later: low priority, low risk, a large change, or a workaround exists. It needs a target release and should stay visible — deferred bugs often appear in release notes as known issues.<br><br><b>Rejected</b> — the team decides it is not a defect: works as designed, a misread requirement, a test environment or data problem, or not reproducible after investigation. A clear reason must be recorded.<br><br><b>Tester’s responsibility:</b> make sure each of these carries an explanation, and track deferred bugs so they are not forgotten. If many of my bugs were rejected, I would check whether I understand the requirements well enough.',
    followups: ['How do you avoid logging duplicate bugs?', 'Who decides that a bug is deferred?'],
    mistakes: ['Treating Deferred as the same as Rejected.', 'Closing duplicates without linking them to the original ticket.'],
    lesson: 'mt-bug-reports'
  },
  {
    id: 'iq-def-11', cat: 'defects', level: 'advanced', freq: 'occasional',
    q: 'What is root cause analysis (RCA) for defects, and how do you do it?',
    short: 'RCA finds the underlying reason a defect was introduced or escaped — not just the faulty line of code — so the team can prevent similar defects. Common tools are the 5 Whys and fishbone diagrams; the output is process improvements.',
    answer: 'A fix removes one defect; <b>RCA</b> asks <b>why it happened and why we did not catch it</b>, so a whole class of similar defects can be prevented.<br><br><b>Common techniques:</b><br>• <b>5 Whys</b> — keep asking “why?” until you reach a process cause.<br>• <b>Fishbone (Ishikawa) diagram</b> — group possible causes: people, process, requirements, tools, environment, data.<br>• <b>Defect categorisation</b> — tag defects by root cause (requirement gap, coding error, configuration, test gap) and study the trends.<br><br><b>Example — PayLite charged some users twice:</b><br>Why? The payment request was sent twice. → Why? The gateway timed out and the app retried automatically. → Why was there no protection? Duplicate-request handling (idempotency) was not in the design. → Why wasn’t it caught? No test covered timeouts.<br><b>Actions:</b> add idempotency keys, add timeout scenarios to regression, and add “retry behaviour” to the design review checklist.<br><br>RCA must be <b>blameless</b> — it targets the process, not the person.',
    followups: ['When is RCA worth the effort, and when is it overkill?', 'How would you run an RCA for a bug that leaked to production?'],
    mistakes: ['Stopping at “the developer made a mistake” as the root cause.', 'Turning RCA into a blame session instead of a process improvement.'],
    lesson: 'fd-error-defect-failure'
  },
  {
    id: 'iq-def-12', cat: 'defects', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between retesting and regression testing?',
    short: 'Retesting (confirmation testing) re-runs the failed test after a fix to confirm that specific defect is gone. Regression testing re-runs tests of previously working features to make sure the change did not break anything else.',
    answer: '<b>Retesting (confirmation testing)</b><br>• Purpose: confirm a <b>specific defect is fixed</b>.<br>• Scope: the failed test case — the original steps and data — on the build that contains the fix.<br>• Done once per fix, manually or by re-running the failing automated test.<br><br><b>Regression testing</b><br>• Purpose: confirm that a change (fix, feature, configuration, upgrade) did <b>not break things that previously worked</b>.<br>• Scope: tests around and beyond the change, chosen by impact and risk — often a large suite.<br>• Repeats every build or release, so it is the best candidate for automation.<br><br><b>Example:</b> PayLite fixes a bug where a 0.5% fee was rounded wrongly. Retest: run the original fee test with the same amount — now correct. Regression: check other fee types, refunds, statements and the balance display, because they share the rounding function.<br><br>Order matters: retest first (is it fixed?), then regression (did the fix break anything else?).',
    followups: ['Can retesting be automated?', 'How do you choose regression tests for a small change?'],
    mistakes: ['Using retesting and regression testing as synonyms.', 'Running only the retest after a fix and skipping regression around the changed code.'],
    lesson: 'mt-regression'
  },
  {
    id: 'iq-def-13', cat: 'defects', level: 'beginner', freq: 'very-common',
    q: 'What is the difference between smoke testing and sanity testing?',
    short: 'Smoke testing is a broad, shallow check of a new build — do the main functions work, is it stable enough to test? Sanity testing is a narrow, focused check that a specific fix or changed area works before deeper testing. Some teams use the terms loosely.',
    answer: '<b>Smoke testing</b> — “Is this build testable at all?”<br>• <b>Broad and shallow</b>: the app starts, login works, main pages and critical flows load.<br>• Run on every new build, often automated in the CI pipeline; also called build verification testing.<br>• If it fails, the build is rejected and testing stops.<br><br><b>Sanity testing</b> — “Does this specific change behave sensibly?”<br>• <b>Narrow and focused</b>: a quick check of one fix or changed area and its immediate neighbours.<br>• Run after a small change or hotfix, often unscripted.<br>• If it fails, the fix goes back and deeper testing of that area is skipped.<br><br><b>Example (ShopFlow):</b> smoke — home, search, cart and checkout load and a test order can be placed. Sanity — after the coupon fix, SAVE10 gives exactly 10%, only once, and the total updates.<br><br>I usually add that some companies use the two words as synonyms, so I follow the team’s own definitions — but broad-versus-narrow is the common distinction.',
    followups: ['Is smoke testing a subset of regression testing?', 'Which smoke tests would you automate for a web application?'],
    mistakes: ['Swapping the definitions — calling smoke narrow and sanity broad.', 'Describing smoke testing as deep testing of every feature.'],
    lesson: 'mt-regression'
  },
  {
    id: 'iq-def-14', cat: 'defects', level: 'intermediate', freq: 'common',
    q: 'When do you stop testing?',
    short: 'Testing never proves zero defects, so you stop when agreed exit criteria are met — coverage reached, no open critical defects, discovery levelling off — and stakeholders accept the remaining risk; or when time runs out and that risk is reported.',
    answer: 'Since exhaustive testing is impossible, stopping is a <b>risk-based decision</b> guided by agreed exit criteria, not by “no bugs left”.<br><br><b>Typical signals that we can stop:</b><br>• Planned tests executed, with requirements and high-risk areas covered (checked in the traceability matrix).<br>• Pass rate meets the target and there are <b>no open critical or high-severity defects</b>; the rest are triaged and accepted.<br>• The <b>defect discovery rate has levelled off</b> — new bugs are rare and minor.<br>• Regression on the final build has passed.<br>• Stakeholders understand and accept the residual risk.<br><br><b>Practical limits</b> — a deadline, budget or the end of a sprint — also stop testing. Then my job is to report clearly what was tested, what was not, the open defects and the remaining risk, so the business makes the go/no-go call knowingly.<br><br>Testing can also be <b>suspended</b> rather than finished — for example when the build is unstable or the environment is down — and resumed once the resumption criteria are met.',
    followups: ['What would you say if a manager asked you to sign off with two open high-severity bugs?', 'What is the difference between suspension criteria and exit criteria?'],
    mistakes: ['Saying you stop when all the bugs have been found.', 'Saying you stop only because the deadline arrived, without reporting the remaining risk.'],
    lesson: 'mt-planning'
  },
  {
    id: 'iq-def-15', cat: 'defects', level: 'intermediate', freq: 'common',
    q: 'A critical bug was found in production that QA missed. How do you handle it?',
    short: 'First help contain it: reproduce, assess impact, support and verify the hotfix. Then run a blameless analysis of why it escaped — missing test, data, environment or requirement gap — and add tests or process changes so that kind of bug cannot slip through.',
    answer: '<b>1. Contain first.</b> Reproduce it quickly (on staging with production-like data if possible), assess how many users and how much money or data are affected, and give developers clear steps and evidence. Help decide on a rollback, feature flag or hotfix.<br><b>2. Verify the fix.</b> Retest the hotfix, run focused regression on the affected area, and confirm in production after deployment with a safe check and the monitoring dashboards.<br><b>3. Own it honestly.</b> No defensiveness — quality is a team responsibility, but I want to understand our part in it.<br><b>4. Analyse why it escaped</b> (blameless RCA): was the scenario missing from the requirements, missing from our tests, impossible in our environment (different data, configuration or third-party versions), or dropped under time pressure?<br><b>5. Prevent recurrence:</b> add the missing test to regression, ideally automated; improve test data or environment parity; update checklists; and track it as an <b>escaped defect</b>.<br><br>A good closing line: “The aim is to make that whole class of bug hard to miss next time.”',
    followups: ['What would you change in your process after an incident like this?', 'How do you calculate the escaped defect rate for a release?'],
    mistakes: ['Being defensive, or blaming developers or the environment straight away.', 'Fixing the single bug but adding no test or process change to prevent similar escapes.'],
    lesson: 'cp-metrics'
  },
  {
    id: 'iq-def-16', cat: 'defects', level: 'intermediate', freq: 'occasional',
    q: 'What is the difference between a latent defect and a masked defect?',
    short: 'A latent defect has existed in the software for some time without causing a failure, because its trigger conditions never occurred. A masked defect is hidden by another defect and only shows up once that other defect is fixed.',
    answer: '<b>Latent defect</b> — present in released software but has not caused a failure yet, because the conditions that trigger it have not happened.<br>• Example: PeopleOps calculates leave correctly every year, but a bug that appears only on 29 February stayed hidden for three years.<br>• Famous real-world case: two-digit year storage that worked for decades until the year 2000.<br><br><b>Masked defect</b> — hidden <b>by another defect</b>, so testers cannot reach or observe it.<br>• Example: on MediBook the “Confirm booking” button crashes the page, so nobody reaches the confirmation email. Once the crash is fixed, testers find the email shows the wrong time zone — that bug was masked.<br><br><b>Why it matters:</b><br>• After a blocking bug is fixed, test the flow <b>beyond</b> it more deeply, expecting masked defects.<br>• Latent defects are why boundary dates, rare configurations and unusual data deserve explicit tests.<br><br>Both show that “no failures seen” is not the same as “no defects” — the first testing principle in action.',
    followups: ['How would you look for latent defects before a release?', 'What is defect cascading?'],
    mistakes: ['Saying a latent defect is simply a bug that was reported late.', 'Confusing a masked defect with a duplicate bug.'],
    lesson: 'fd-error-defect-failure'
  },

  /* ===================== Agile ===================== */
  {
    id: 'iq-agi-01', cat: 'agile', level: 'beginner', freq: 'very-common',
    q: 'What is the role of a tester in an Agile team?',
    short: 'The tester is part of the cross-functional team from day one: clarifying stories and acceptance criteria, testing continuously during the sprint, automating regression, exploring, and helping the whole team own quality — not just testing at the end.',
    answer: 'In Agile, the tester is a full team member who helps <b>build quality in</b>, not a gate at the end.<br><br><b>Through the sprint:</b><br>• <b>Refinement and planning</b> — question stories, add acceptance criteria and examples, spot risks and dependencies, estimate testing effort.<br>• <b>During development</b> — prepare test ideas and data, test each story as soon as it is ready (even partial builds or APIs), pair with developers and give fast feedback.<br>• <b>Automation</b> — add API and UI regression checks to the CI pipeline so each change is verified quickly.<br>• <b>Exploratory testing</b> — go beyond the acceptance criteria to find what nobody thought of.<br>• <b>Review and retrospective</b> — share quality status and suggest process improvements.<br><br><b>Mindset:</b> quality belongs to the whole team. Developers write unit tests, the product owner clarifies expectations, and the tester acts as quality coach and the user’s advocate.<br><br>Back this up with one real example — say, how joining refinement meant fewer stories bounced back from testing.',
    followups: ['How is testing in Agile different from testing in Waterfall?', 'What do you do in the first days of a sprint, before any build is ready?', 'Who is responsible for quality in a Scrum team?'],
    mistakes: ['Describing the tester as someone who waits for development to finish and then tests.', 'Saying testers are not needed in Agile because developers write unit tests.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-02', cat: 'agile', level: 'beginner', freq: 'very-common',
    q: 'What are the Scrum roles and events, and what does a tester do in each event?',
    short: 'Scrum has three accountabilities — Product Owner, Scrum Master and Developers (testers count as Developers) — and five events: the Sprint, Sprint Planning, Daily Scrum, Sprint Review and Sprint Retrospective. Backlog refinement is an ongoing activity.',
    answer: '<b>Roles (accountabilities in the Scrum Guide):</b><br>• <b>Product Owner</b> — owns the product backlog and its order; decides what gets built.<br>• <b>Scrum Master</b> — coaches the team on Scrum and helps remove impediments.<br>• <b>Developers</b> — everyone who builds the increment, <b>including testers</b>. Scrum has no separate test team.<br><br><b>Events, from a tester’s view:</b><br>• <b>Sprint</b> (1–4 weeks) — the container for all the work.<br>• <b>Sprint Planning</b> — help choose stories, raise risks, include testing and automation tasks in the estimates.<br>• <b>Daily Scrum</b> — share testing progress and blockers (“Story 42 is blocked; the test environment is down”).<br>• <b>Sprint Review</b> — demonstrate tested features and mention known issues honestly.<br>• <b>Sprint Retrospective</b> — suggest improvements, e.g. “stories reach testing on the last day”.<br><br><b>Backlog refinement</b> is an ongoing activity rather than a formal event — and it is where testers add the most value, by clarifying acceptance criteria before work starts.',
    followups: ['What is the difference between the product backlog and the sprint backlog?', 'What would you raise in a retrospective as a tester?'],
    mistakes: ['Saying the tester is a separate fourth role in Scrum.', 'Mixing up roles and events, for example calling the stand-up a role.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-03', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'What is the difference between the Definition of Ready and the Definition of Done?',
    short: 'The Definition of Ready is a team checklist for when a story is clear enough to start (testable criteria, designs, dependencies known). The Definition of Done is the quality bar every item must meet to count as complete (reviewed, tested, regression passed).',
    answer: '<b>Definition of Ready (DoR)</b> — when a backlog item is <b>ready to be pulled into a sprint</b>. A common team practice, though not part of the official Scrum Guide. Typical items: a clear user story, testable acceptance criteria, designs attached, dependencies identified, estimated, small enough for one sprint.<br><br><b>Definition of Done (DoD)</b> — the quality bar that <b>every</b> item must meet before it counts as done; it is part of Scrum. Typical items: code reviewed and merged; unit tests passing; acceptance criteria tested; no open high-severity bugs; automated regression green in CI; documentation updated; deployable.<br><br><b>DoD vs acceptance criteria:</b> the DoD applies to <b>all</b> stories; acceptance criteria are <b>specific to one</b> story. A story is done only when it meets both.<br><br><b>Tester’s role:</b> push for testing items in both — testable criteria in the DoR so tests can be designed early, and real testing and regression in the DoD so “done” means done, not just “coded”.',
    followups: ['What would you add to a Definition of Done from a QA point of view?', 'What happens to a story that does not meet the DoD by the end of the sprint?'],
    mistakes: ['Saying the Definition of Done and acceptance criteria are the same thing.', 'Treating “done” as “the developer has finished coding”.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-04', cat: 'agile', level: 'beginner', freq: 'very-common',
    q: 'What is a user story, and what makes good acceptance criteria?',
    short: 'A user story is a short requirement from the user’s point of view: “As a [role], I want [goal], so that [benefit].” Good acceptance criteria are clear, specific, testable conditions — including negative and edge cases — that define when the story is complete.',
    answer: '<b>User story:</b> “As a <i>[role]</i>, I want <i>[goal]</i>, so that <i>[benefit]</i>.” Example: “As a MediBook patient, I want to cancel my appointment online, so that I don’t have to call the clinic.”<br><br><b>Acceptance criteria</b> define when the story is done — as a checklist or in <b>Given–When–Then</b> form:<br>• <i>Given</i> an appointment more than 24 hours away, <i>when</i> I cancel, <i>then</i> it is cancelled and the slot becomes free.<br>• <i>Given</i> an appointment less than 24 hours away, <i>when</i> I try to cancel, <i>then</i> I see “Please call the clinic” and nothing changes.<br>• A confirmation email arrives within 5 minutes.<br><br><b>Good criteria are</b> testable (pass or fail is obvious), specific (numbers, not “fast”), cover <b>negative and edge cases</b>, describe behaviour rather than implementation, and are agreed before development starts.<br><br>Good stories follow <b>INVEST</b>: Independent, Negotiable, Valuable, Estimable, Small, Testable. The tester’s key question in refinement: “How will we know this works — and what happens when it doesn’t?”',
    followups: ['Write acceptance criteria for a “forgot password” story.', 'What does INVEST stand for?', 'What would you do if a story has no acceptance criteria?'],
    mistakes: ['Writing vague criteria such as “cancellation should work properly”.', 'Covering only the happy path in the acceptance criteria.'],
    lesson: 'mt-requirements'
  },
  {
    id: 'iq-agi-05', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'What do shift-left and shift-right testing mean?',
    short: 'Shift-left means testing earlier — requirement reviews, testers in design talks, unit and API tests in CI — to prevent and catch defects sooner. Shift-right means testing and learning in or near production — monitoring, feature flags, canaries, A/B tests.',
    answer: 'Picture the lifecycle as a line from requirements (left) to production (right).<br><br><b>Shift-left</b> — move testing <b>earlier</b>:<br>• testers in refinement and three amigos sessions, reviewing stories and designs;<br>• acceptance criteria and examples written before coding (BDD/ATDD);<br>• unit tests, static analysis and API tests running in CI on every commit.<br>Benefit: defects are prevented or found when they are cheapest to fix.<br><br><b>Shift-right</b> — keep testing and learning <b>in or near production</b>:<br>• monitoring, alerts, error tracking and synthetic checks on live journeys;<br>• feature flags, canary or staged rollouts, A/B tests;<br>• using real user behaviour and incidents to improve the test suite.<br>Benefit: it catches what no test environment can reproduce — real traffic, data and devices.<br><br><b>They complement each other.</b> Example: ShopFlow’s new checkout is reviewed and automated early (left), then released to 5% of users behind a feature flag with error-rate monitoring before full rollout (right).',
    followups: ['Name three concrete shift-left practices you have used.', 'Does shift-right mean testing on real customers instead of testing before release?'],
    mistakes: ['Saying shift-right means skipping pre-release testing and letting users find the bugs.', 'Describing shift-left only as “testers start earlier” without any concrete practices.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-06', cat: 'agile', level: 'intermediate', freq: 'occasional',
    q: 'What is a three amigos session?',
    short: 'A short meeting where three perspectives — business (product owner or BA), development and testing — discuss a user story before development, agree on examples and acceptance criteria, and uncover questions and edge cases early.',
    answer: '<b>Three amigos</b> brings together the three main perspectives on a story <b>before</b> development starts:<br>• <b>Business</b> (product owner or BA) — what problem are we solving, and what exactly is the rule?<br>• <b>Development</b> — how might we build it, and what are the technical limits?<br>• <b>Testing</b> — what could go wrong, what are the edge cases, how will we know it works?<br>Others can join (a designer, a security specialist), but the session stays small and short — often 15–30 minutes per story.<br><br><b>Output:</b> agreed acceptance criteria and concrete examples (often Given–When–Then scenarios for BDD), open questions with owners, and a shared understanding of scope.<br><br><b>Example:</b> discussing a PayLite “split bill” story, the tester asks “what if one friend has an insufficient balance?” and “how is 100 split three ways rounded?” Both become new acceptance criteria — two bugs prevented before any code exists.<br><br>It is one of the most effective shift-left practices, because a misunderstanding is the cheapest defect to fix.',
    followups: ['How is a three amigos session related to BDD?', 'Which questions would you bring as the tester?'],
    mistakes: ['Insisting the meeting must have exactly three people.', 'Holding it after development is finished, when it can no longer prevent defects.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-07', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'How do you estimate testing effort in Agile, and what are story points?',
    short: 'Story points are a relative measure of a story’s size — effort, complexity and uncertainty — estimated by the whole team, often with planning poker. Testing effort is part of every story’s estimate, not a separate number added later.',
    answer: '<b>Story points</b> are <b>relative</b>: a story is compared with reference stories (“about twice the login story”), usually on a Fibonacci-like scale (1, 2, 3, 5, 8, 13). They combine effort, complexity and uncertainty — they are not hours.<br><br><b>Planning poker:</b> everyone reveals an estimate at once, and big differences trigger discussion. Often the tester’s higher number exposes hidden work: “This touches three payment methods and needs a sandbox gateway account.”<br><br><b>What I factor in as a tester:</b><br>• test design and test data setup;<br>• the number of browsers, devices or integrations;<br>• automation to add or update;<br>• regression impact and environment risks;<br>• unknowns in the requirement.<br><br><b>Key point:</b> the team estimates the <b>whole story, including testing</b>. If testing is left out, the sprint quietly overcommits and testing gets squeezed at the end.<br><br>Over several sprints, the average points completed (<b>velocity</b>) helps the team plan — it is a planning aid, not a performance score.',
    followups: ['Why are story points not converted directly into hours?', 'What is velocity, and how should it be used?'],
    mistakes: ['Estimating only development and adding testing time separately afterwards.', 'Using velocity to compare teams or individual people.'],
    lesson: 'mt-planning'
  },
  {
    id: 'iq-agi-08', cat: 'agile', level: 'intermediate', freq: 'very-common',
    q: 'Developers hand over most stories on the last day of the sprint. How do you manage testing?',
    short: 'I avoid the end-of-sprint crunch by testing continuously: smaller stories, testing pieces as they become ready, preparing tests and data early, pairing with developers, relying on automated regression, and raising the pattern in the retrospective with data.',
    answer: 'This is a classic problem — a “mini-waterfall” inside the sprint. I tackle it on three fronts.<br><br><b>Prevent it (planning):</b><br>• Split stories smaller so they finish throughout the sprint.<br>• Include testing in estimates and in the Definition of Done.<br>• Agree a team habit of finishing before starting — limit work in progress.<br><br><b>Work in parallel (during the sprint):</b><br>• Prepare test ideas, data and automation skeletons from day one, using the acceptance criteria and mock-ups.<br>• Test API endpoints or partial features as soon as they are deployed, before the UI is complete.<br>• Pair with developers — they can run my checklist before handing over, and I can suggest unit-test cases.<br>• Lean on automated regression in CI so manual time goes to new features and exploration.<br><br><b>Be transparent:</b> a story that arrives too late to test properly is not done — it moves to the next sprint instead of being released untested. Then I raise the pattern in the retrospective with data: “4 of 6 stories reached testing on day 9.”',
    followups: ['What would you do if the team insists on releasing an untested story?', 'How do you test a feature whose UI is not ready yet?'],
    mistakes: ['Offering “I would work late or at the weekend” as the only solution.', 'Quietly marking stories done without proper testing to protect the sprint goal.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-09', cat: 'agile', level: 'advanced', freq: 'occasional',
    q: 'What are the Agile testing quadrants?',
    short: 'A model from Brian Marick, popularised by Lisa Crispin and Janet Gregory, that sorts tests on two axes — business-facing vs technology-facing, and supporting the team vs critiquing the product — into four quadrants, so no kind of testing is forgotten.',
    answer: 'The quadrants use two axes: <b>business-facing vs technology-facing</b>, and tests that <b>support the team</b> (guide development) vs tests that <b>critique the product</b> (evaluate it against expectations).<br><br>• <b>Q1 — technology-facing, supports the team:</b> unit/component and component integration tests — automated and part of every CI run.<br>• <b>Q2 — business-facing, supports the team:</b> functional and story tests built from examples, API tests, prototypes and simulations — they confirm the acceptance criteria are met, by hand or by tool.<br>• <b>Q3 — business-facing, critiques the product:</b> exploratory, usability and user acceptance testing, plus alpha and beta — seen through the user’s eyes and done mainly by people, not scripts.<br>• <b>Q4 — technology-facing, critiques the product:</b> performance, load, security, reliability and other non-functional tests (the ISTQB syllabus also places smoke tests here). Usually tool-driven.<br><br><b>How to use it:</b> the numbers are not an execution order. It is a planning checklist — a ShopFlow team strong in Q1 and Q2 automation might realise that nobody owns performance (Q4) or usability (Q3) testing.',
    followups: ['Which quadrant does exploratory testing belong to?', 'How would you use the quadrants when planning testing for a release?'],
    mistakes: ['Thinking the quadrants must be done in order, from Q1 to Q4.', 'Putting usability testing in Q4 with the other non-functional tests.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-10', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'What is the difference between TDD, BDD and ATDD?',
    short: 'TDD is a developer practice: write a failing unit test, write code to pass it, then refactor. BDD describes behaviour in business language (Given–When–Then) agreed by the team. ATDD has the team write acceptance tests from the criteria before development.',
    answer: '<b>TDD — Test-Driven Development</b><br>• Developer-focused, at unit level. Cycle: <b>red</b> (write a failing test) → <b>green</b> (write just enough code to pass) → <b>refactor</b>.<br>• Result: well-tested, modular code and a fast regression safety net.<br><br><b>BDD — Behaviour-Driven Development</b><br>• Team-focused. Business, development and testing agree on behaviour through concrete examples in plain language, often Gherkin:<br><code>Given my cart total is 3,000</code><br><code>When I add an item costing 1</code><br><code>Then shipping should be free</code><br>• The scenarios can be automated with tools such as Cucumber or SpecFlow and serve as living documentation.<br><br><b>ATDD — Acceptance Test-Driven Development</b><br>• The team writes <b>acceptance tests</b> from the acceptance criteria <b>before</b> coding; the story is done when they pass. Very close to BDD, which puts extra weight on shared language and behaviour examples.<br><br><b>In one line:</b> TDD helps build the code right; BDD and ATDD help build the right thing, agreed up front.',
    followups: ['Have you written Gherkin scenarios? What makes a good one?', 'Does using Cucumber mean a team is doing BDD?'],
    mistakes: ['Saying BDD is just a tool such as Cucumber.', 'Describing TDD as testers writing test cases before development starts.'],
    lesson: 'fd-tdd-bdd'
  },
  {
    id: 'iq-agi-11', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'What is continuous testing, and where does testing fit in a DevOps CI/CD pipeline?',
    short: 'Continuous testing means automated checks run at every stage of the CI/CD pipeline for fast feedback on each change: static checks and unit tests on every commit, API tests on merge, a small end-to-end suite before release, and monitoring after.',
    answer: '<b>DevOps</b> joins development and operations so changes reach production often and safely. <b>Continuous testing</b> is its quality engine: every change is checked automatically as it moves through the pipeline.<br><br><b>Typical stages:</b><br>1. <b>Commit / pull request</b> — linting, static analysis, unit tests (minutes).<br>2. <b>Build and merge</b> — component, API and contract tests.<br>3. <b>Deploy to test or staging</b> — smoke tests, a focused set of UI end-to-end tests for critical journeys, perhaps security scans and performance checks.<br>4. <b>Release</b> — gradual rollout with feature flags or canary deployments.<br>5. <b>Production</b> — monitoring, alerts and synthetic checks (shift-right).<br><br><b>Principles:</b> fastest feedback first (the test pyramid — many unit tests, few UI tests); a failing stage stops the pipeline; flaky tests are fixed or quarantined quickly because they destroy trust.<br><br><b>Tester’s role:</b> decide what to automate at which layer, keep suites reliable, and keep exploring — automation checks known risks; people find new ones.',
    followups: ['What would you do about a flaky test that keeps blocking the pipeline?', 'Which tests should run on every commit, and which nightly?'],
    mistakes: ['Saying DevOps means manual or exploratory testing is no longer needed.', 'Putting a large, slow UI suite on every commit.'],
    lesson: 'au-ci'
  },
  {
    id: 'iq-agi-12', cat: 'agile', level: 'intermediate', freq: 'common',
    q: 'How do you handle requirements that change in the middle of a sprint?',
    short: 'Agile welcomes change, but changes should come through the product owner. I check the impact on tests and the sprint goal, update criteria and test cases, re-plan regression, and make the extra effort and risk visible so scope can be renegotiated.',
    answer: '<b>1. Confirm it is a real, agreed change.</b> It should come through the <b>product owner</b> and be recorded in the story — not a quick chat with one developer.<br><b>2. Assess impact quickly:</b> which acceptance criteria, test cases, automation and test data are affected, and which neighbouring features need regression? Traceability links help here.<br><b>3. Make the cost visible.</b> Tell the team what it means for testing effort and the sprint goal. If new work threatens the goal, scope is renegotiated with the product owner — something else moves out, or the change becomes a new story.<br><b>4. Update and test:</b> revise criteria and cases, update automation, retest the changed behaviour and run focused regression.<br><b>5. Learn from it.</b> If mid-sprint changes are frequent, raise it in the retrospective — better refinement and three amigos sessions catch many of them earlier.<br><br><b>Example:</b> mid-sprint, MediBook changes the online cancellation window from 24 to 12 hours. I update the boundary tests (11 hours 59 minutes, exactly 12 hours, 12 hours 1 minute before the slot) and the reminder email checks.',
    followups: ['What if a stakeholder asks a developer directly for a change, bypassing the product owner?', 'How do you keep test cases maintainable when requirements change often?'],
    mistakes: ['Refusing every change because “the sprint is locked”.', 'Accepting every change silently and squeezing testing to absorb the extra work.'],
    lesson: 'fd-agile-testing'
  },
  {
    id: 'iq-agi-13', cat: 'agile', level: 'beginner', freq: 'common',
    q: 'How do you build a good working relationship with developers?',
    short: 'By collaborating early and often: joining refinement, sharing test ideas before coding, writing neutral, high-quality bug reports, talking before escalating, respecting their time, and treating quality as a shared goal rather than “catching” people out.',
    answer: '<b>Same goal, different angle.</b> I treat developers as partners — we both want a product users love — and act on it:<br><br>• <b>Involve early:</b> share test ideas and edge cases during refinement or before coding starts, so the feature is built right first time. “Here are five cases I will try” is usually more welcome than five bug reports later.<br>• <b>Write excellent bug reports:</b> reproducible steps, evidence, and neutral wording about behaviour, never the person (“the total is wrong when…”, not “you broke the total”).<br>• <b>Talk before typing:</b> for unclear or disputed bugs, a quick conversation beats a long comment thread.<br>• <b>Respect their time:</b> group small issues, check for duplicates, retest fixes promptly.<br>• <b>Learn their world:</b> understanding the architecture, logs and APIs makes my bugs sharper and conversations easier.<br>• <b>Share credit:</b> recognise good fixes and good unit tests — quality is a team result.<br><br>When we disagree, I go back to evidence and user impact, and let the product owner decide the expected behaviour.',
    followups: ['Describe a disagreement with a developer and how you resolved it.', 'How do you give feedback on a developer’s work without sounding critical?'],
    mistakes: ['Describing the relationship as “QA versus developers”, or boasting about bugs found against someone.', 'Saying you avoid talking to developers and communicate only through tickets.'],
    lesson: 'fd-qa-qc-testing'
  },
  {
    id: 'iq-agi-14', cat: 'agile', level: 'beginner', freq: 'occasional',
    q: 'What is the difference between Scrum and Kanban from a tester’s point of view?',
    short: 'Scrum works in fixed-length sprints with planned scope, defined roles and events. Kanban is a continuous flow with work-in-progress limits and no fixed iterations. Kanban makes testing bottlenecks visible on the board; Scrum gives a sprint rhythm.',
    answer: '<b>Scrum</b><br>• Fixed-length sprints (1–4 weeks) with a sprint goal and planned scope.<br>• Defined accountabilities (Product Owner, Scrum Master, Developers) and events (planning, daily scrum, review, retrospective).<br>• Progress often tracked with velocity and burndown charts.<br><br><b>Kanban</b><br>• Continuous flow — items are pulled when there is capacity; no fixed iterations.<br>• A visual board (To do → In development → In test → Done) with <b>work-in-progress (WIP) limits</b> per column.<br>• Progress measured with <b>lead time</b> and <b>cycle time</b>.<br><br><b>Tester’s view:</b><br>• In Kanban, when the “In test” column is full, developers cannot push more work in — they help test or fix bugs instead. Testing bottlenecks become visible immediately rather than piling up.<br>• Kanban suits support and maintenance teams with unpredictable work, such as production bug fixes.<br>• In Scrum, testing must fit inside the sprint, so the main risk is an end-of-sprint crunch.<br><br>Many teams blend the two, sometimes called “Scrumban”.',
    followups: ['What is a WIP limit, and how does it help quality?', 'Which approach suits a team handling production support tickets?'],
    mistakes: ['Saying Kanban has no process or planning at all.', 'Saying testers have no place in a Kanban team.'],
    lesson: 'fd-sdlc-models'
  },
  {
    id: 'iq-agi-15', cat: 'agile', level: 'beginner', freq: 'very-common',
    q: 'How is testing in Agile different from testing in the Waterfall model?',
    short: 'In Waterfall, testing is a separate phase after development, based on fixed upfront requirements and heavier documents. In Agile, testing is continuous in every sprint, testers join from the start, requirements evolve, and automation and fast feedback matter.',
    answer: '<b>Waterfall</b><br>• Testing is a <b>phase</b> that starts after development finishes.<br>• Requirements are fixed and documented up front; detailed test plans and cases are written from them.<br>• Testers often form a separate team; feedback arrives late, so defects are expensive.<br>• Change is hard and goes through formal change requests.<br><br><b>Agile</b><br>• Testing is <b>continuous</b> — each story is tested in the same sprint it is built.<br>• Testers join from refinement and help shape requirements and acceptance criteria.<br>• Documentation is lighter: user stories, acceptance criteria, checklists, charters.<br>• Regression must be fast, so <b>automation</b> is essential.<br>• Quality is a whole-team responsibility, and change is expected.<br><br><b>What stays the same:</b> you still analyse, plan, design, execute and report — the STLC simply runs in small loops.<br><br>Interview tip: avoid saying one is simply “better”. Waterfall or the V-model can still fit fixed-scope, regulated projects; Agile suits products whose needs evolve and where fast feedback matters.',
    followups: ['What challenges come with moving from Waterfall-style testing to Agile?', 'Is documentation still needed in Agile testing?'],
    mistakes: ['Saying there is no test planning or documentation in Agile.', 'Claiming Agile means testers are no longer needed.'],
    lesson: 'fd-sdlc-models'
  }

]);
