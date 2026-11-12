/* Qadence content · additions A (ISTQB CTFL v4.0.1-aligned lessons).
   foundations: fd-test-process, fd-tdd-bdd, fd-maintenance
   manual:      mt-tools, mt-whitebox, mt-prioritization, mt-config-env
   Also: Test Center bank items for these lessons, drills mt-d7 and mt-d8, and their visual guides.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-additions-a.js */

/* part 1 · foundations: fd-test-process, fd-tdd-bdd (lessons, bank, visuals) */
QA_CONTENT.addLessons('foundations', [
  {
    id: 'fd-test-process',
    n: 10,
    level: 'beginner',
    title: 'Test activities, testware, traceability and independence',
    summary: 'Name the seven ISTQB test activities and their testware, trace tests to the test basis, and judge how much tester independence a project needs.',
    minutes: 18,
    objectives: [
      'Tell testing apart from debugging and explain who does each',
      'Name the seven ISTQB test activities, their main tasks and the testware each produces',
      'Use traceability between the test basis and testware to show coverage and the impact of change',
      'Compare the four levels of test independence and the whole-team approach, with benefits and drawbacks'
    ],
    body: [
      { t: 'p', html: 'Testing and debugging are often mixed up, but they are different activities, usually done by different people. <b>Testing</b> either triggers failures caused by defects (dynamic testing — running the software) or finds defects directly in a work product (static testing — such as reviewing a story). <b>Debugging</b> is the developer work that follows: reproduce the failure, diagnose the root cause and fix it. After the fix, <b>confirmation testing</b> checks the problem is really gone — ideally run by the person who found it — and <b>regression testing</b> checks the fix did not break anything else.' },
      { t: 'compare', a: { title: 'Testing', items: ['Goal: show failures or find defects, and give information about quality', 'Done by anyone in a testing role — testers, developers, business users', 'Output: test results, defect reports, coverage and risk information', 'Can be static (review a story or code) or dynamic (run the application)'] }, b: { title: 'Debugging', items: ['Goal: find and remove the cause of a failure', 'Usually done by the developer who owns the code', 'Typical steps: reproduce → diagnose → fix', 'For a defect found in a review there is no failure to reproduce — the author simply fixes the document or code'] } },
      { t: 'h', text: 'The seven test activities' },
      { t: 'p', html: 'ISTQB groups the work of testing into a <b>test process</b> of seven activities. They follow a logical order, but in practice they overlap, repeat and run in parallel — in an Agile team the whole set may happen for one story within a few days. The STLC lesson shows a common six-phase industry version; the ISTQB names below are the ones you meet in the Foundation exam and in many test strategies. Notice that planning and monitoring and control wrap around everything else, while analysis answers <i>what</i> to test and design answers <i>how</i>.' },
      { t: 'table', caption: 'ISTQB test activities, their main tasks and the testware they produce', head: ['Activity', 'Key question and main tasks', 'Typical testware'], rows: [
        ['<b>Test planning</b>', 'What are the objectives, and which approach fits our constraints? Define scope, approach, schedule, entry and exit criteria', 'Test plan, test schedule, risk register, entry and exit criteria'],
        ['<b>Monitoring and control</b>', 'Are we on track? Monitoring compares actual progress with the plan; control takes action — re-prioritise, move people, change scope', 'Test progress reports, control directives, updated risk information'],
        ['<b>Test analysis</b>', '<b>What</b> to test? Analyse the test basis, judge its testability, identify and prioritise test conditions and the related risks', 'Prioritised test conditions (e.g. acceptance criteria), defect reports on the test basis'],
        ['<b>Test design</b>', '<b>How</b> to test? Turn test conditions into test cases with test techniques; identify coverage items, test data and environment needs', 'Prioritised test cases, test charters, coverage items, test data and environment requirements'],
        ['<b>Test implementation</b>', 'Is everything ready to run? Build test procedures and automated scripts, assemble suites, prepare data, set up and check the environment', 'Test procedures, automated scripts, test suites, test data, execution schedule, stubs and drivers'],
        ['<b>Test execution</b>', 'Run tests per the schedule, compare actual with expected results, log results, analyse anomalies and report defects', 'Test logs, defect reports'],
        ['<b>Test completion</b>', 'At a milestone: raise change requests for unresolved defects, archive useful testware, shut down the environment, record lessons learned', 'Test completion report, lessons learned, improvement actions, change requests']
      ] },
      { t: 'callout', tone: 'key', title: 'Testware = every work product of testing', html: 'ISTQB calls everything the test process produces <b>testware</b>: plans, risk registers, test conditions, test cases, charters, scripts, test data, logs, defect reports and completion reports. Testware is not throwaway paperwork. Good testware is reviewed, version-controlled and reused — the regression suite you run next year is testware written this year.' },
      { t: 'h', text: 'Traceability: linking the test basis to testware' },
      { t: 'p', html: 'The <b>test basis</b> is whatever you derive tests from — requirements, user stories, acceptance criteria, designs, risk lists. <b>Traceability</b> means keeping links from each test-basis item to the test conditions, test cases, results and defects that relate to it. Those links answer questions that no pass rate can. In practice the links usually live in a test management tool or on the tickets themselves, using requirement IDs such as <code>PO-218 AC1</code>.' },
      { t: 'list', items: [
        '<b>Coverage:</b> every requirement or acceptance criterion links to at least one test, so gaps are visible at a glance.',
        '<b>Impact of change:</b> when a story changes, the links show which conditions, cases and scripts to update and re-run.',
        '<b>Residual risk:</b> results traced to risks show which high risks still have failing or unrun tests.',
        '<b>Reporting and audits:</b> “8 of 10 acceptance criteria verified” means more to stakeholders than “212 tests passed”.'
      ] },
      { t: 'h', text: 'Roles, the whole team, and independence' },
      { t: 'p', html: 'ISTQB describes two principal <b>roles</b>, not job titles. The <b>test management role</b> owns the test process and leads the effort — mainly planning, monitoring and control, and completion. The <b>testing role</b> owns the engineering side — mainly analysis, design, implementation and execution. A test lead, an Agile team or a development manager may take the management role, and one person can hold both. In the <b>whole-team approach</b>, anyone with the right skills does any task and everyone is responsible for quality: testers help business representatives write acceptance tests and agree automation with developers.' },
      { t: 'p', html: '<b>Independence</b> matters because authors and testers have different cognitive biases — we are blind to our own assumptions. ISTQB names four levels: testing by the <b>author</b> (no independence), by a <b>peer from the same team</b> (some), by <b>testers from outside the team but inside the organisation</b> (high), and by <b>testers from outside the organisation</b> (very high). Independence does not replace familiarity: developers find many defects in their own code efficiently. Most projects mix levels — developers test components, a test team runs system testing, business representatives run acceptance testing.' },
      { t: 'compare', a: { title: 'Benefits of independent testing', items: ['Recognises different kinds of failures and defects, thanks to a different background, perspective and biases', 'Can verify, challenge or disprove assumptions made during specification and implementation', 'Gives the separate check that safety-critical or regulated work may require'] }, b: { title: 'Drawbacks to manage', items: ['Isolation from developers: weaker collaboration, communication problems, even an adversarial relationship', 'Developers may lose their sense of responsibility for quality', 'Independent testers may be seen as a bottleneck or blamed for release delays'] } },
      { t: 'callout', tone: 'tip', title: 'Choose the mix to fit the risk', html: 'The whole-team approach and independence are not enemies. A PeopleOps Scrum team can test its stories together every sprint, while a separate group checks payroll calculations before each release. Where safety, money or legal compliance is at stake, add a more independent level; where speed and shared ownership matter most, keep testing close to the team — and actively manage the drawbacks of whichever you choose.' }
    ],
    example: {
      title: 'Worked example: one PeopleOps story through the test activities',
      blocks: [
        { t: 'p', html: '<b>Story PO-218:</b> “As an employee, I want to attach a sick note to my leave request, so that HR can approve sick leave without paper.” <b>AC1</b> PDF, JPG or PNG files up to 5 MB are accepted. <b>AC2</b> Other file types show “File type not supported”. <b>AC3</b> HR sees the attachment on the request. Hina holds the testing role; the team lead holds the test management role.' },
        { t: 'table', head: ['Activity', 'What happened', 'Testware'], rows: [
          ['Planning', 'Agreed to test through the API and the UI; exit criterion: all ACs pass, no open high-severity bugs', 'A short test plan section on the story'],
          ['Analysis', 'AC1 was silent on exactly 5 MB — Hina asked, and the product owner confirmed it is allowed', 'Six test conditions, a clarified AC1'],
          ['Design', 'Boundary values for size (5 MB − 1 byte, 5 MB, 5 MB + 1 byte) and partitions for file types', 'Test cases with data needs'],
          ['Implementation', 'Prepared sample files and an HR test account; automated an API check for AC2', 'Test data, a script, execution order'],
          ['Execution', 'A 5 MB + 1 byte file was accepted — logged PO-231; the developer debugged and fixed it; Hina retested and ran upload regression', 'Test log, defect report PO-231'],
          ['Monitoring and control', 'Daily: 4 of 6 conditions passed, PO-231 blocking; the lead moved Hina’s next story back one day', 'Progress note at stand-up'],
          ['Completion', 'All ACs verified; sample files kept for regression; lesson learned: ask about inclusive limits in refinement', 'Completion note, archived test data']
        ] },
        { t: 'p', html: 'Notice three things. Debugging PO-231 was the developer’s job; Hina’s job was to find the failure, report it clearly and confirm the fix. Traceability from AC1 to its test cases and to PO-231 let the lead say exactly which criterion was at risk. And the activities overlapped: the analysis question was raised before any code existed, while monitoring ran every day of the sprint.' }
      ]
    },
    explain: {
      'ur': 'Testing کوئی بے ترتیب کام نہیں بلکہ ایک process ہے۔ ISTQB اسے سات activities میں بانٹتا ہے: <b>test planning</b> (مقصد اور طریقہ طے کرنا)، <b>monitoring and control</b> (روزانہ دیکھنا کہ کام plan کے مطابق ہے یا نہیں)، <b>analysis</b> (کیا ٹیسٹ کرنا ہے)، <b>design</b> (کیسے ٹیسٹ کرنا ہے)، <b>implementation</b> (test data اور scripts تیار کرنا)، <b>execution</b> (tests چلانا اور bugs رپورٹ کرنا) اور <b>completion</b> (سبق لکھنا اور کام کی چیزیں محفوظ کرنا)۔ ان سب سے جو کچھ بنتا ہے اسے testware کہتے ہیں۔ ہر requirement کو اس کے test cases اور bugs سے جوڑنا traceability ہے، مثلاً AC1 کا تعلق TC-5 اور Bug-12 سے۔ یاد رکھیں: tester bug ڈھونڈتا ہے، developer اسے debug کر کے ٹھیک کرتا ہے۔ اور tester جتنا مصنف سے آزاد (independent) ہو، اتنے مختلف defects پکڑتا ہے۔',
      'ur-Latn': 'Testing koi random kaam nahin balke ek process hai. ISTQB isay saat activities mein baant-ta hai: <b>test planning</b> (maqsad aur tareeqa tay karna), <b>monitoring and control</b> (rozana dekhna ke kaam plan ke mutabiq hai ya nahin), <b>analysis</b> (kya test karna hai), <b>design</b> (kaise test karna hai), <b>implementation</b> (test data aur scripts tayyar karna), <b>execution</b> (tests chalana aur bugs report karna) aur <b>completion</b> (lessons likhna aur kaam ki cheezein save karna). In sab se jo kuch banta hai usay testware kehte hain. Har requirement ko uske test cases aur bugs se jorna traceability hai, misaal: AC1 ka link TC-5 aur Bug-12 se. Yaad rakhein: tester bug dhoondta hai, developer usay debug kar ke theek karta hai. Aur tester author se jitna independent ho, utne mukhtalif defects pakarta hai.',
      'hi': 'Testing कोई बेतरतीब काम नहीं, बल्कि एक process है। ISTQB इसे सात activities में बाँटता है: <b>test planning</b> (लक्ष्य और तरीका तय करना), <b>monitoring and control</b> (रोज़ देखना कि काम plan के अनुसार चल रहा है या नहीं), <b>analysis</b> (क्या test करना है), <b>design</b> (कैसे test करना है), <b>implementation</b> (test data और scripts तैयार करना), <b>execution</b> (tests चलाना और bugs report करना) और <b>completion</b> (सीख लिखना और काम की चीज़ें सहेजना)। इन सबसे जो कुछ बनता है उसे testware कहते हैं। हर requirement को उसके test cases और bugs से जोड़ना traceability है, जैसे AC1 का संबंध TC-5 और Bug-12 से। याद रखें: tester bug ढूँढता है, developer उसे debug करके ठीक करता है। और tester लेखक से जितना स्वतंत्र (independent) हो, उतने अलग तरह के defects पकड़ता है।',
      'ar': 'الاختبار ليس عملًا عشوائيًا بل عملية منظمة. يقسّمها ISTQB إلى سبعة أنشطة: <b>التخطيط</b> (تحديد الأهداف والأسلوب)، و<b>المراقبة والتحكم</b> (متابعة التقدم يوميًا مقارنةً بالخطة واتخاذ الإجراء اللازم)، و<b>التحليل</b> (ماذا نختبر؟)، و<b>التصميم</b> (كيف نختبر؟)، و<b>التهيئة</b> (implementation: تجهيز بيانات الاختبار والسكربتات)، و<b>التنفيذ</b> (execution: تشغيل الاختبارات والإبلاغ عن العيوب)، و<b>الإكمال</b> (تسجيل الدروس المستفادة وأرشفة ما يفيد لاحقًا). كل ما تنتجه هذه الأنشطة يسمى testware. وربط كل متطلب بحالات الاختبار والعيوب المرتبطة به يسمى traceability، مثلًا: المعيار AC1 مرتبط بالحالة TC-5 وبالعيب Bug-12. تذكّر: المختبِر يكشف العيب، والمطوّر يقوم بالـ debugging لإصلاحه. وكلما كان المختبِر أكثر استقلالًا عن كاتب العمل، اكتشف عيوبًا مختلفة.',
      'es': 'Probar no es improvisar: es un proceso. ISTQB lo divide en siete actividades: <b>planificación</b> (objetivos y enfoque), <b>monitoreo y control</b> (comparar cada día el avance con el plan y actuar), <b>análisis</b> (qué probar), <b>diseño</b> (cómo probar), <b>implementación</b> (preparar datos y scripts), <b>ejecución</b> (ejecutar pruebas y reportar defectos) y <b>cierre</b> (lecciones aprendidas y archivo de lo reutilizable). Todo lo que se produce se llama testware. Enlazar cada requisito con sus casos de prueba y defectos es la trazabilidad (traceability): por ejemplo, AC1 está ligado a TC-5 y a Bug-12. Recuerda: el tester encuentra el fallo y el desarrollador hace el debugging para corregirlo. Y cuanto más independiente es el tester del autor, más defectos distintos descubre.'
    },
    keyTerms: [
      { term: 'Test process', def: 'The set of test activities: planning, monitoring and control, analysis, design, implementation, execution and completion.' },
      { term: 'Testware', def: 'Work products created by testing, such as plans, test cases, scripts, test data, logs, defect reports and completion reports.' },
      { term: 'Test basis', def: 'The source that tests are derived from, such as requirements, user stories, acceptance criteria or designs.' },
      { term: 'Traceability', def: 'Links between test-basis items and the test conditions, test cases, results and defects that relate to them.' },
      { term: 'Debugging', def: 'The developer activity of reproducing a failure, diagnosing its root cause and fixing it.' },
      { term: 'Independence of testing', def: 'How separate the tester is from the author — from self-testing up to testers from outside the organisation.' }
    ],
    practice: [
      { q: 'Name the test activity for each task: (a) choosing boundary values for an age field; (b) telling the lead that 3 of 8 conditions are blocked and suggesting a new order; (c) asking what “recent orders” means while reading a story; (d) archiving test data and writing lessons learned; (e) assembling tonight’s test suite and execution order.', hint: 'Analysis = what to test, design = how to test, implementation = getting ready to run.', answer: '(a) <b>Test design</b> — applying a technique to create test cases. (b) <b>Monitoring and control</b> — comparing progress with the plan and proposing action. (c) <b>Test analysis</b> — evaluating the test basis and finding a defect in it. (d) <b>Test completion</b>. (e) <b>Test implementation</b> — test suites and the execution schedule are prepared there.' },
      { q: 'A developer says: <i>“I debugged and fixed the ShopFlow coupon bug, so there is no need for you to test it again.”</i> How do you respond?', answer: 'Politely explain that debugging and testing have different goals. Debugging removed the cause the developer found; <b>confirmation testing</b> checks that the original failure no longer occurs with the same steps, data and environment. Then <b>regression testing</b> around the change checks that the fix did not break other coupon or pricing behaviour. Offer to start immediately so the fix is not delayed.' },
      { q: 'For ShopFlow story SF-210 (“SAVE10 gives 10% off merchandise for orders of $30.00 or more”), name three traceability links you would keep and the question each one answers.', answer: '<b>AC → test cases:</b> is every criterion (minimum order, merchandise only, expired code) covered by at least one test? <b>Test cases → results and defects:</b> which criteria are failing, and which defect blocks them? <b>Risks → tests:</b> is the high risk “discount applied twice” covered, and what residual risk remains if those tests have not run? A fourth useful link is test case → automated script, so a rule change shows which scripts to update.' },
      { q: 'MediBook is adding a medicine-dose calculator for clinics. Which levels of test independence would you recommend, and which drawback would you watch for?', hint: 'Think about who tests components, the system and acceptance — and how much is at stake.', answer: 'Developers test their components (no independence, but fast and familiar). The team’s tester runs system tests (some independence). Because wrong doses could harm patients, add a <b>high or very high</b> level: a separate test team or an external specialist reviewing and testing the dose rules, plus acceptance testing by clinicians. Watch for isolation: keep the independent testers in contact with developers so that findings are discussed, not thrown over a wall, and make sure developers still feel responsible for quality.' }
    ],
    quiz: [
      { q: 'Which statement best describes the difference between testing and debugging?', options: ['Testing removes defects; debugging is how failures are first found', 'Testing shows failures or defects; debugging locates and removes the cause', 'Testing is manual work by testers; debugging is automated work by tools', 'Testing happens before a release; debugging happens only after go-live'], correct: 1,
        why: ['Reversed: testing finds failures and defects, and debugging removes their cause.', 'Right — testing triggers failures or finds defects; debugging reproduces, diagnoses and fixes the cause.', 'Both can involve people and tools; the difference is the goal, not manual versus automated.', 'Both happen throughout development; debugging is not limited to production.'] },
      { q: 'In which test activity do you identify and prioritise test conditions from the test basis — deciding what to test?', options: ['Test design', 'Test implementation', 'Test planning', 'Test analysis'], correct: 3,
        why: ['Design answers “how to test”: it turns existing test conditions into test cases.', 'Implementation prepares procedures, scripts, suites and data so that tests can be run.', 'Planning sets objectives, approach and criteria; it does not derive detailed test conditions.', 'Right — analysis evaluates the test basis and identifies prioritised test conditions: the “what”.'] },
      { q: 'Halfway through a ShopFlow test cycle, the lead sees that 40% of planned tests are blocked by a broken payment sandbox and moves the team onto API tests for other features. Which activity is this?', options: ['Test monitoring and control', 'Test completion reporting', 'Test analysis and design', 'Test execution and defect logging'], correct: 0,
        why: ['Right — comparing progress with the plan is monitoring; changing priorities to stay on track is control.', 'Completion happens at a milestone such as a release, not in the middle of a cycle.', 'No new test conditions or test cases are being derived here.', 'Running tests and logging results is execution; re-planning the team’s work is control.'] },
      { q: 'Which item is testware typically produced during test implementation?', options: ['The test completion report with lessons learned', 'Prioritised test conditions derived from acceptance criteria', 'Automated test scripts arranged in an execution schedule', 'A risk register listing the likelihood and impact of risks'], correct: 2,
        why: ['That is produced in test completion, at a milestone.', 'Test conditions come from test analysis.', 'Right — implementation creates procedures, scripts, suites, data and the execution schedule.', 'The risk register is a test planning work product.'] },
      { q: 'A separate QA group in another department now tests PayLite’s money-transfer feature. Which drawback of this higher independence should the lead watch for?', options: ['They will mostly find the very same defects the developers already found', 'Developers may feel less responsible for quality, and contact may weaken', 'Independent testers are not allowed to apply techniques such as BVA', 'Higher independence makes confirmation testing of fixes unnecessary'], correct: 1,
        why: ['The benefit of independence is the opposite: different biases lead to different defects.', 'Right — isolation, weaker communication and developers losing ownership of quality are the classic drawbacks.', 'Independent testers use the same techniques; independence is about who tests, not how.', 'Every fix still needs confirmation testing, whoever runs it.'] }
    ],
    interview: [
      { q: 'What is the difference between testing and debugging?', a: '<b>Testing</b> finds evidence of problems: dynamic testing triggers failures by running the software, and static testing finds defects directly in work products such as stories or code. <b>Debugging</b> is what the developer does next: reproduce the failure, diagnose the root cause and fix it. Then testing returns — <b>confirmation testing</b> re-runs the original test to prove the fix works, and <b>regression testing</b> checks nothing else broke. For example, I find that an upload accepts a 6 MB file when the limit is 5 MB; the developer debugs and finds a wrong size check; I retest at 5 MB and 5 MB + 1 byte, then run the upload regression. Different goals, usually different people — both are needed.' },
      { q: 'What are the benefits and drawbacks of independent testing?', a: 'Independent testers have different backgrounds, perspectives and biases from the author, so they <b>recognise different kinds of failures</b> and can <b>challenge assumptions</b> made during specification and implementation. ISTQB describes levels from none (the author tests) through a peer in the same team and a separate team in the organisation, to testers outside the organisation. The drawbacks are <b>isolation</b> — weaker collaboration or even an adversarial relationship — developers <b>losing ownership</b> of quality, and testers being seen as a <b>bottleneck</b>. So most projects mix levels: developers test components, a team tester runs system tests, users run acceptance tests, and higher independence is added where safety or money is at stake.' },
      { q: 'Walk me through the test activities and what each one produces.', a: '<b>Planning</b> sets objectives, approach and entry/exit criteria (test plan, risk register). <b>Monitoring and control</b> runs throughout, comparing progress with the plan and acting on deviations (progress reports). <b>Analysis</b> decides what to test by deriving prioritised test conditions from the test basis — and often finds defects in the requirements. <b>Design</b> decides how: test cases, charters, data and environment needs. <b>Implementation</b> gets everything ready: procedures, scripts, suites, data, the environment and an execution schedule. <b>Execution</b> runs the tests, logs results and reports defects. <b>Completion</b>, at a milestone, archives reusable testware and records lessons learned in a completion report. In Agile, all of this happens in small loops per story.' }
    ],
    takeaways: [
      'Testing finds failures and defects; debugging finds and removes their cause — then confirmation and regression testing follow.',
      'Seven activities: planning, monitoring and control, analysis (what), design (how), implementation, execution and completion.',
      'Everything testing produces is testware — review it, version it and reuse it.',
      'Traceability from the test basis to tests, results and defects shows coverage, the impact of change and residual risk.',
      'Mix levels of independence with the whole-team approach to fit the risk, and manage the drawbacks of isolation.'
    ],
    links: { labs: ['login'], challenges: ['peopleops-login'], interview: ['m1'] }
  },
  {
    id: 'fd-tdd-bdd',
    n: 11,
    level: 'intermediate',
    title: 'Test-first development: TDD, ATDD and BDD',
    summary: 'Explain how TDD, ATDD and BDD put tests before code, write examples and Given/When/Then scenarios with your team, and avoid the common traps.',
    minutes: 20,
    objectives: [
      'Describe the TDD red-green-refactor cycle and who usually practises it',
      'Run an ATDD-style specification workshop that turns acceptance criteria into examples',
      'Write declarative BDD scenarios in Given/When/Then that stakeholders can read',
      'Explain how testers contribute to test-first approaches and spot the common pitfalls'
    ],
    body: [
      { t: 'p', html: 'In a traditional flow, code is written first and tests follow. <b>Test-first</b> approaches flip that order: the test — or the example that will become a test — is written <i>before</i> the code that makes it pass. ISTQB names three: <b>test-driven development (TDD)</b>, <b>acceptance test-driven development (ATDD)</b> and <b>behaviour-driven development (BDD)</b>. All three apply early testing and shift-left, fit iterative development, and leave behind automated tests that protect the code when it is changed or refactored later.' },
      { t: 'table', caption: 'Three test-first approaches side by side', head: ['Aspect', 'TDD', 'ATDD', 'BDD'], rows: [
        ['Driven by', 'Small unit tests written before each piece of code', 'Acceptance criteria and examples agreed by the team', 'Desired behaviour described in business language'],
        ['Typical level', 'Component (unit)', 'System or acceptance — one user story', 'System or acceptance — one user story'],
        ['Who writes the tests', 'Mainly the developer', 'Business, developers and testers together', 'Business, developers and testers together'],
        ['Typical format', 'Code in a unit test framework', 'Examples, tables, natural-language test cases', 'Given/When/Then scenarios (Gherkin)'],
        ['Main benefit', 'Simple, well-tested design built in small steps', 'Shared understanding; tests become executable requirements', 'Readable specifications that tools can automate']
      ] },
      { t: 'h', text: 'TDD: red, green, refactor' },
      { t: 'p', html: 'TDD is a developer practice at the component level. The developer writes one small test for behaviour that does not exist yet and runs it: it fails (<b>red</b>), which proves the test can detect a problem. Next they write the <b>simplest code</b> that makes it pass (<b>green</b>). Then they <b>refactor</b> — clearer names, less duplication — re-running every test to confirm behaviour is unchanged. Each loop takes minutes, and the tests guide the design instead of a long up-front design document. Writing unit tests <i>after</i> the code is useful, but it is not TDD.' },
      { t: 'code', lang: 'js', title: 'ShopFlow free shipping, test-first (three snapshots of one file)', code: `// 1 · RED: tests come first. shippingFee() does not exist yet, so both fail.
test('orders of 50 or more ship free', () => {
  expect(shippingFee(50)).toBe(0);
});
test('orders under 50 pay a flat 4.99 fee', () => {
  expect(shippingFee(49.99)).toBe(4.99);
});

// 2 · GREEN: the simplest code that makes both tests pass.
function shippingFee(total) {
  if (total >= 50) return 0;
  return 4.99;
}

// 3 · REFACTOR: replaces snapshot 2. Magic numbers get names;
//     re-run the tests, which must still be green.
const FREE_SHIPPING_FROM = 50;
const FLAT_FEE = 4.99;
function shippingFee(total) {
  return total >= FREE_SHIPPING_FROM ? 0 : FLAT_FEE;
}` },
      { t: 'h', text: 'ATDD: examples agreed before the story is built' },
      { t: 'p', html: 'ATDD works at the level of a user story. It starts with a <b>specification workshop</b>: business representatives, developers and testers analyse the story and its acceptance criteria, and resolve gaps, ambiguities and defects before coding starts. Then they write test cases — usually concrete <b>examples</b> — based on those criteria. ISTQB suggests an order: <b>positive</b> examples first (correct behaviour, no errors), then <b>negative</b> ones, then <b>non-functional</b> characteristics such as performance or usability. Tests should cover the story without going beyond it, and no two tests should check the same characteristic.' },
      { t: 'table', caption: 'MediBook rule: “Patients can book an appointment up to 30 days ahead.” Examples agreed in the workshop (today = 1 March)', head: ['Kind', 'Example', 'Why it is there'], rows: [
        ['Positive', 'Book 2 March → booking confirmed and the slot disappears from search', 'The ordinary case everyone expects'],
        ['Positive', 'Book 31 March (exactly 30 days ahead) → booking confirmed', 'Confirms that the limit is inclusive'],
        ['Negative', 'Book 1 April (31 days ahead) → “You can book up to 30 days ahead”; no booking created', 'Just outside the limit; nothing must be saved'],
        ['Negative', 'Send a booking for 28 February straight to the API → rejected', 'The rule must hold even if the date picker is bypassed'],
        ['Non-functional', 'Confirmation appears within 2 seconds on the clinic Wi-Fi', 'A target the team agreed and can measure']
      ] },
      { t: 'h', text: 'BDD: behaviour in the language of the business' },
      { t: 'p', html: 'BDD grew out of TDD. It expresses desired behaviour in a simple, structured natural language that every stakeholder can read — usually <b>Given</b> (context), <b>When</b> (action) and <b>Then</b> (observable outcome). Tools such as Cucumber map each line to step-definition code, so one scenario is both a specification and an automated test. The usual story basics still apply: the card, the conversation and the confirmation (the <b>3 Cs</b>), and a story that is <b>INVEST</b> — above all <i>Testable</i>. If nobody can say how to check a story, it is not ready for scenarios.' },
      { t: 'compare', a: { title: 'Imperative scenario — avoid', items: ['<code>Given I open "/login"</code>', '<code>When I type "sara@shopflow.test" into "#email"</code>', '<code>And I click the button with id "btn-17"</code>', 'Breaks whenever the UI changes and hides the business rule'] }, b: { title: 'Declarative scenario — prefer', items: ['<code>Given Sara is a registered shopper</code>', '<code>When she signs in with valid credentials</code>', '<code>Then she sees her order history</code>', 'Survives UI redesigns, and the rule is readable by the business'] } },
      { t: 'h', text: 'How testers contribute — and common pitfalls' },
      { t: 'cards', items: [
        { title: 'Ask the awkward questions', html: 'In the workshop, probe limits, roles, errors and states: “Can I book exactly 30 days ahead? What if the clinic closes that day?” Gaps found here cost minutes, not days.' },
        { title: 'Propose examples', html: 'Bring boundary, negative and non-functional examples, not just the happy path. Concrete numbers expose disagreements that abstract rules hide.' },
        { title: 'Review scenarios', html: 'Keep them declarative, one behaviour each, with observable <b>Then</b> steps and no duplicates — readable by the product owner.' },
        { title: 'Automate and explore', html: 'Help write step definitions and keep the suite green — then explore around the scenarios, because a set of examples never covers everything.' }
      ] },
      { t: 'callout', tone: 'warn', title: 'Common pitfalls', html: '<b>Tool without conversation:</b> scenarios written alone, after development, are just test scripts in a costume.<br><b>UI scripts in Given/When/Then:</b> clicks and selectors make scenarios brittle and unreadable.<br><b>Scenario explosion:</b> hundreds of near-identical scenarios slow the suite; keep key examples and push combinations to lower-level tests.<br><b>“Green means done”:</b> passing scenarios prove the agreed examples, not the absence of defects — exploratory and non-functional testing are still needed.<br><b>Tests tied to implementation:</b> TDD tests that check private details break on every refactor.' }
    ],
    example: {
      title: 'Worked example: a PayLite story from workshop to scenarios',
      blocks: [
        { t: 'p', html: '<b>Story PL-77:</b> “As a PayLite user, I want to set a monthly spending limit, so that I don’t overspend.” The first draft said only: “Users can set a limit, and payments over it are blocked.” In a 30-minute specification workshop the tester asked: Can I spend <i>exactly</i> the limit? What are the smallest and largest limits allowed? When does spending reset? Does a declined payment take any money? The product owner answered each question, and the team wrote the answers as examples.' },
        { t: 'code', lang: 'gherkin', title: 'PayLite · monthly spending limit (declarative scenarios)', code: `Feature: Monthly spending limit

  Background:
    Given Ali has a monthly spending limit of 20,000 PKR

  Scenario: A payment that reaches the limit exactly is approved
    Given Ali has spent 15,000 PKR this month
    When he pays 5,000 PKR to a merchant
    Then the payment is approved
    And his remaining limit is 0 PKR

  Scenario: A payment that would exceed the limit is declined
    Given Ali has spent 15,000 PKR this month
    When he pays 5,001 PKR to a merchant
    Then the payment is declined with "Monthly limit reached"
    And no money leaves his wallet

  Scenario Outline: Limits outside 1,000–200,000 PKR are rejected
    When Ali tries to set his limit to <amount> PKR
    Then he sees "<message>"

    Examples:
      | amount  | message                               |
      | 999     | Limit must be at least 1,000 PKR      |
      | 200,001 | Limit cannot be more than 200,000 PKR |` },
        { t: 'p', html: 'The developer automated these scenarios with step definitions while building the feature, and used TDD for the limit calculation underneath. The tester kept the scenarios short and declarative, then wrote an exploratory charter for what they do not cover: the month changing at midnight, two payments sent at the same moment, and a refund that frees up limit. Scenarios are agreed examples — a strong start, not the whole test effort.' }
      ]
    },
    explain: {
      'ur': 'Test-first کا مطلب ہے کہ test کوڈ سے <b>پہلے</b> لکھا جائے۔ <b>TDD</b> میں developer پہلے ایک چھوٹا test لکھتا ہے جو fail ہوتا ہے (red)، پھر سب سے آسان code لکھتا ہے جس سے test pass ہو جائے (green)، اور آخر میں code کو صاف کرتا ہے (refactor)۔ مثال: test کہتا ہے کہ 50 ڈالر یا اس سے زیادہ کے order پر shipping free ہو؛ پہلے یہ fail ہوگا، پھر ایک سادہ if لکھنے سے pass ہو جائے گا۔ <b>ATDD</b> میں business، developer اور tester مل کر coding سے پہلے acceptance criteria سے مثالیں بناتے ہیں۔ <b>BDD</b> انہی مثالوں کو Given/When/Then کی سادہ زبان میں لکھتا ہے تاکہ سب پڑھ سکیں اور tools انہیں automate کر سکیں۔ Tester کا کام: سوال پوچھنا، negative اور boundary مثالیں دینا، اور scenarios کے بعد بھی exploratory testing کرنا۔',
      'ur-Latn': 'Test-first ka matlab hai ke test code se <b>pehle</b> likha jaye. <b>TDD</b> mein developer pehle ek chhota test likhta hai jo fail hota hai (red), phir sab se aasaan code likhta hai jis se test pass ho jaye (green), aur aakhir mein code saaf karta hai (refactor). Misaal: test kehta hai ke 50 dollar ya us se zyada ke order par shipping free ho; pehle yeh fail hoga, phir ek simple if likhne se pass ho jayega. <b>ATDD</b> mein business, developer aur tester mil kar coding se pehle acceptance criteria se examples banate hain. <b>BDD</b> inhi examples ko Given/When/Then ki simple zubaan mein likhta hai taake sab parh sakein aur tools inhein automate kar sakein. Tester ka kaam: sawal poochna, negative aur boundary examples dena, aur scenarios ke baad bhi exploratory testing karna.',
      'hi': 'Test-first का मतलब है कि test को code से <b>पहले</b> लिखा जाए। <b>TDD</b> में developer पहले एक छोटा test लिखता है जो fail होता है (red), फिर सबसे आसान code लिखता है जिससे test pass हो जाए (green), और आख़िर में code को साफ़ करता है (refactor)। उदाहरण: test कहता है कि 50 डॉलर या उससे ज़्यादा के order पर shipping free हो; पहले यह fail होगा, फिर एक सीधा-सा if लिखने से pass हो जाएगा। <b>ATDD</b> में business, developer और tester मिलकर coding से पहले acceptance criteria से उदाहरण बनाते हैं। <b>BDD</b> इन्हीं उदाहरणों को Given/When/Then की सरल भाषा में लिखता है ताकि सब पढ़ सकें और tools उन्हें automate कर सकें। Tester का काम: सवाल पूछना, negative और boundary उदाहरण देना, और scenarios के बाद भी exploratory testing करना।',
      'ar': 'نهج «الاختبار أولًا» (test-first) يعني كتابة الاختبار <b>قبل</b> الكود. في <b>TDD</b> يكتب المطوّر اختبارًا صغيرًا يفشل أولًا (red)، ثم أبسط كود يجعله ينجح (green)، ثم يحسّن الكود دون تغيير سلوكه (refactor). مثال: اختبار ينص على أن الشحن مجاني للطلبات من 50 دولارًا فأكثر؛ يفشل في البداية، ثم ينجح بعد كتابة شرط if بسيط. في <b>ATDD</b> يجتمع ممثلو العمل والمطوّرون والمختبِرون قبل البرمجة لتحويل معايير القبول إلى أمثلة واضحة. أما <b>BDD</b> فيكتب هذه الأمثلة بصيغة Given/When/Then بلغة بسيطة يفهمها الجميع ويمكن للأدوات أتمتتها. دور المختبِر: طرح الأسئلة، واقتراح أمثلة سلبية وحدّية، ومواصلة الاختبار الاستكشافي بعد السيناريوهات.',
      'es': 'Test-first significa escribir la prueba <b>antes</b> del código. En <b>TDD</b>, el desarrollador escribe una prueba pequeña que falla (red), luego el código más simple que la hace pasar (green) y después limpia el código sin cambiar su comportamiento (refactor). Ejemplo: una prueba dice que los pedidos de 50 dólares o más tienen envío gratis; primero falla y, tras escribir un simple if, pasa. En <b>ATDD</b>, negocio, desarrollo y testing convierten juntos los criterios de aceptación en ejemplos antes de programar. <b>BDD</b> escribe esos ejemplos con Given/When/Then, en un lenguaje sencillo que todos entienden y que las herramientas pueden automatizar. El tester aporta preguntas, ejemplos negativos y de límites, y sigue haciendo pruebas exploratorias después de los escenarios.'
    },
    keyTerms: [
      { term: 'TDD', def: 'Test-driven development: the developer writes a failing unit test first, then the code to pass it, then refactors.' },
      { term: 'Red-green-refactor', def: 'The TDD loop: see a new test fail, write the simplest code to pass it, then improve the code while all tests stay green.' },
      { term: 'ATDD', def: 'Acceptance test-driven development: the team derives acceptance tests from criteria and examples before the story is built.' },
      { term: 'Specification workshop', def: 'A session where business, development and testing analyse a story and agree its acceptance criteria and examples.' },
      { term: 'BDD', def: 'Behaviour-driven development: behaviour described in Given/When/Then natural language that tools can turn into executable tests.' },
      { term: 'Declarative scenario', def: 'A scenario that states the behaviour and business rule, not UI clicks, so it stays readable and survives redesigns.' }
    ],
    practice: [
      { q: 'Rule for PeopleOps: <i>“A password must be at least 8 characters.”</i> Write the first failing test in TDD style, then describe the green and refactor steps.', hint: 'Start with one tiny test, and let the next test force the next piece of code.', answer: 'Red: <code>test(\'rejects a 7-character password\', () =&gt; { expect(isValidPassword(\'abc1234\')).toBe(false); });</code> — it fails because <code>isValidPassword</code> does not exist. Green: the simplest code, e.g. <code>return pw.length &gt;= 8;</code>. Add the next test — an 8-character password returns <code>true</code> — and confirm it passes too. Refactor: name the constant (<code>MIN_LENGTH = 8</code>), re-run the tests and see them stay green. Each new rule (such as “must contain a digit”) starts with a new failing test.' },
      { q: 'Rewrite this scenario declaratively: <i>Given I open "/cart" · When I click "#apply" after typing "SAVE10" in "#code" · Then the element ".total" shows "36.00"</i>.', answer: '<code>Given Sara has a $40.00 Canvas Tote in her cart</code><br><code>When she applies the code SAVE10</code><br><code>Then her merchandise total is $36.00</code><br>The rule — 10% off — is now visible to a product owner, and a UI redesign changes only the step definitions, not the scenario.' },
      { q: 'MediBook story: <i>“Patients can cancel an appointment up to 24 hours before it starts.”</i> List examples in the ATDD order: positive, negative, then non-functional.', answer: '<b>Positive:</b> cancel 3 days before → cancelled, slot freed; cancel exactly 24 h 00 min before → cancelled (confirm that the limit is inclusive). <b>Negative:</b> cancel 23 h 59 min before → “Please call the clinic”, booking unchanged; cancel someone else’s appointment through the API → rejected; cancel an already-cancelled appointment → clear message, no second email. <b>Non-functional:</b> the cancellation confirmation appears within an agreed time; the Cancel button is reachable by keyboard and labelled for screen readers.' },
      { q: 'Your team bought a BDD tool. The product owner never reads the feature files, and testers write all the scenarios after development has finished. What is going wrong, and what would you change?', answer: 'The team uses the tool but not the practice: there is no collaboration and nothing is test-<i>first</i>. The scenarios are test scripts written in Gherkin. Change: hold a short specification workshop (business, developer, tester) before each story is built; write a few key declarative examples together; ask the product owner to confirm them as acceptance criteria; let developers automate them while building. Keep combinations in lower-level tests, and continue exploratory testing for what the examples miss.' }
    ],
    quiz: [
      { q: 'What is the correct order of steps in the TDD cycle?', options: ['Write code, then write a test, then refactor', 'Refactor, write a failing test, then write code', 'Write a failing test, make it pass, refactor', 'Write a passing test, add code, run regression'], correct: 2,
        why: ['Code-first followed by tests is test-last, not TDD.', 'Refactoring comes after the test passes, when there is working code to improve safely.', 'Right — red (failing test), green (simplest passing code), refactor (improve while staying green).', 'A test that passes before the code exists proves nothing; TDD starts with a failing test.'] },
      { q: 'Which approach expresses tests in Given/When/Then natural language so that business stakeholders can read them and tools can execute them?', options: ['Behaviour-driven development', 'Test-driven development', 'Checklist-based testing', 'Session-based exploratory testing'], correct: 0,
        why: ['Right — BDD describes behaviour in readable Given/When/Then scenarios that can be automated.', 'TDD tests are code in a unit test framework, written mainly for developers.', 'Checklist-based testing uses lists of test conditions, usually run manually.', 'Exploratory sessions are guided by charters, not pre-written executable scenarios.'] },
      { q: 'In an ATDD specification workshop for a MediBook story, the team has agreed three positive examples. According to ISTQB guidance, what should come next?', options: ['Start coding, since positive examples are enough to accept a story', 'Add examples for features the next story will introduce', 'Write a UI script for each example before discussing errors', 'Add negative examples, then cover non-functional characteristics'], correct: 3,
        why: ['Positive examples alone leave error handling undefined, where many defects hide.', 'Tests should cover the story without going beyond it.', 'Examples should express behaviour, not UI scripts; and the error cases are still missing.', 'Right — positive first, then negative, then non-functional characteristics such as performance or usability.'] },
      { q: 'A ShopFlow scenario reads: “When I click the element with id btn-17 and wait 3 seconds”. What is the main problem?', options: ['Gherkin does not allow the word “wait” inside a When step', 'It is an imperative UI script, so it is brittle and hides the rule', 'Scenarios may only be written by developers, never by testers', 'A When step must always contain at least two separate actions'], correct: 1,
        why: ['Gherkin has no banned words; the issue is what the step describes.', 'Right — clicks, ids and fixed waits tie the scenario to the UI; a declarative step states the behaviour instead.', 'Testers often write or co-write scenarios; that is part of their contribution.', 'The opposite: a good When step describes one action.'] },
      { q: 'Which statement about TDD, ATDD and BDD is accurate?', options: ['They remove any need for exploratory and non-functional testing later', 'They are only suitable for sequential models such as Waterfall', 'Their tests are thrown away once the feature has been released', 'Tests come before the code and can live on as automated regression'], correct: 3,
        why: ['Agreed examples cannot cover everything; exploratory and non-functional testing are still needed.', 'They support iterative and Agile development, where short feedback loops matter most.', 'The tests usually persist as automated tests that protect future changes.', 'Right — all three are test-first, apply shift-left, and often leave a valuable automated regression suite.'] }
    ],
    interview: [
      { q: 'What is the difference between TDD and BDD?', a: '<b>TDD</b> is a developer practice at the unit level: write a small failing test, write the simplest code to pass it, then refactor — red, green, refactor. Its tests are code, aimed at developers, and they drive the design. <b>BDD</b> grew out of TDD but works at the behaviour level: business, developers and testers agree examples and write them as Given/When/Then scenarios that a product owner can read, and tools such as Cucumber turn them into automated tests. A team often uses both: BDD scenarios for the story’s behaviour, TDD for the code underneath. Neither replaces exploratory or non-functional testing.' },
      { q: 'How does a tester contribute in an ATDD or BDD team?', a: 'Mostly <b>before</b> code exists. In the specification workshop or three amigos session I ask about limits, roles, errors and states, and I propose concrete examples — boundaries, negative cases and non-functional targets — so the team discovers disagreements early. I review scenarios to keep them declarative, one behaviour each, with observable outcomes and no duplicates. During the sprint I help automate step definitions and keep the suite reliable. Finally I explore around the scenarios, because agreed examples never cover everything — race conditions, odd data and usability issues usually live outside them.' }
    ],
    takeaways: [
      'TDD, ATDD and BDD are test-first: tests or examples come before the code they check.',
      'TDD is red-green-refactor at the unit level, mainly done by developers.',
      'ATDD starts with a specification workshop; write positive, then negative, then non-functional examples.',
      'BDD scenarios should be declarative Given/When/Then that the business can read — not UI scripts.',
      'Passing scenarios prove the agreed examples, not the absence of defects; keep exploring.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'], interview: ['m5'] }
  }
]);

QA_CONTENT.addBank('foundations', [
  { level: 'beginner', topic: 'fd-test-process',
    q: 'A review finds that a PeopleOps user story contradicts the API specification. What does debugging involve in this case?',
    options: ['Reproducing the failure in the test environment before anything else', 'Running a full regression suite to locate where the failure happens', 'Removing the defect — there is no failure to reproduce or diagnose', 'Nothing, because defects found in reviews are not real defects'], correct: 2,
    why: ['A review finds the defect directly; no software was run, so there is no failure to reproduce.', 'Regression testing checks for side effects of a change; it is not how a review defect is located.', 'Right — for defects found by static testing, debugging is simply removing the defect from the work product.', 'Defects in stories and specifications are real and are the cheapest ones to fix.'] },
  { level: 'beginner', topic: 'fd-test-process',
    q: 'A Scrum team has no dedicated test manager. According to ISTQB, what typically happens to the test management tasks?',
    options: ['The team handles most; cross-team ones may go to a test manager outside it', 'They disappear, because Agile teams never plan, monitor or control testing', 'The product owner must do all of them, since they already order the backlog', 'They are postponed to a final hardening sprint just before the release date'], correct: 0,
    why: ['Right — the test management role is a role, not a job title: an Agile team can take on many of its tasks, while tasks spanning several teams may sit with a test manager outside the team.', 'Agile teams still plan, monitor and control testing — just in smaller, more frequent loops.', 'The product owner orders the backlog; test management tasks are not automatically theirs.', 'Postponing planning and monitoring to the end would remove the feedback they are meant to give.'] },
  { level: 'intermediate', topic: 'fd-tdd-bdd',
    q: 'In TDD, a developer writes a new test and it passes immediately, before any new code has been written. What should they conclude?',
    options: ['The cycle worked as intended, so they can move straight to refactoring', 'The feature is complete and the user story can be closed', 'The unit test framework must be misconfigured and needs replacing', 'The test may not check the new behaviour and should be reviewed'], correct: 3,
    why: ['The red step is missing: a test never seen failing has not proved it can detect anything.', 'One passing test says nothing about the rest of the story’s behaviour.', 'Possible but unlikely; the usual cause is a test that does not exercise the new behaviour, or behaviour that already exists.', 'Right — a new TDD test should fail first; if it passes, check what it actually asserts.'] },
  { level: 'intermediate', topic: 'fd-tdd-bdd',
    q: 'Which statement about ATDD test cases matches ISTQB guidance?',
    options: ['They should go beyond the story to cover future features as well', 'Several cases should check the same characteristic, for safety', 'They cover the whole story but do not go beyond it', 'They must be automated; manual ATDD test cases are not allowed'], correct: 2,
    why: ['Tests for future features belong to those future stories.', 'Duplicated checks add maintenance without adding information; no two cases should test the same characteristic.', 'Right — ATDD tests cover all characteristics of the story, without going beyond it, and without duplicates.', 'ATDD test cases may be run manually or automated; automating them turns them into executable requirements.'] }
]);

QA_CONTENT.addVisuals({
  'fd-test-process': [
    { t: 'cycle', title: 'The ISTQB test activities', center: 'Monitoring and control',
      steps: ['Test planning', 'Test analysis', 'Test design', 'Test implementation', 'Test execution', 'Test completion'],
      caption: 'Six activities follow a logical order, often in short loops per story or sprint. Monitoring and control sits in the middle because it runs alongside all of them, and completion feeds lessons learned into the next round of planning.' },
    { t: 'layers', title: 'Four levels of test independence',
      items: [
        { label: 'Tested by the author', sub: 'No independence: the developer checks their own code' },
        { label: 'Tested by a peer in the same team', sub: 'Some independence: a teammate or the team’s own tester' },
        { label: 'Separate team, same organisation', sub: 'High independence: for example a central QA or test team' },
        { label: 'Testers outside the organisation', sub: 'Very high independence: for example an external test lab' }
      ],
      caption: 'Moving down the stack, testers share fewer of the author’s assumptions and find different defects, but risk losing contact with the team. Most projects combine several levels.' }
  ],
  'fd-tdd-bdd': [
    { t: 'cycle', title: 'The TDD loop', center: 'Minutes per loop',
      steps: ['Red: write a failing test', 'Green: simplest code to pass', 'Refactor: tidy, stay green'],
      caption: 'Each loop adds one small behaviour. Seeing the test fail first proves it can catch a problem, and refactoring is safe only because the whole suite is re-run after every change.' },
    { t: 'flowchart', title: 'From story to executable acceptance tests', dir: 'down',
      nodes: [
        { id: 'story', label: 'User story drafted', kind: 'start' },
        { id: 'workshop', label: 'Specification workshop' },
        { id: 'clear', label: 'Criteria clear and complete?', kind: 'decision' },
        { id: 'examples', label: 'Examples: positive, negative, NFR' },
        { id: 'scenarios', label: 'Write Given/When/Then scenarios' },
        { id: 'build', label: 'Build feature and automate steps' },
        { id: 'pass', label: 'All scenarios pass?', kind: 'decision' },
        { id: 'done', label: 'Story accepted; tests join regression', kind: 'end' }
      ],
      edges: [
        { from: 'story', to: 'workshop' },
        { from: 'workshop', to: 'clear' },
        { from: 'clear', to: 'workshop', label: 'No: ask and refine' },
        { from: 'clear', to: 'examples', label: 'Yes' },
        { from: 'examples', to: 'scenarios' },
        { from: 'scenarios', to: 'build' },
        { from: 'build', to: 'pass' },
        { from: 'pass', to: 'build', label: 'No: fix the code' },
        { from: 'pass', to: 'done', label: 'Yes' }
      ],
      caption: 'The two loops are the point: unclear criteria go back to the conversation before any code exists, and failing scenarios go back to development. Passing scenarios live on as automated regression tests.' }
  ]
});

/* part 2 · fd-maintenance (foundations) and mt-tools (manual) */
QA_CONTENT.addLessons('foundations', [
  {
    id: 'fd-maintenance',
    n: 12,
    level: 'intermediate',
    title: 'Maintenance testing and impact analysis',
    summary: 'Test changes to a live system safely: recognise maintenance triggers, run impact analysis, scope regression by risk, and check hot fixes and data migrations.',
    minutes: 18,
    objectives: [
      'Explain what maintenance testing checks and why most of the system is still in scope',
      'Classify a change by its trigger: modification, upgrade or migration, or retirement',
      'Use impact analysis and risk to decide the scope of testing for a change',
      'Plan testing for a hot fix and for a data migration'
    ],
    body: [
      { t: 'p', html: 'Most software spends far longer in production than in development. Once ShopFlow or PayLite is live, it keeps changing: bugs are fixed, features are added, servers are upgraded, data moves to new databases and, one day, the system is switched off. Testing changes to a system that is already in operation is <b>maintenance testing</b>. It has two jobs: confirm that the change itself works, and check for <b>regressions</b> in the parts that were not changed — which is usually most of the system. The skill that connects the two is <b>impact analysis</b>.' },
      { t: 'cards', items: [
        { title: 'Corrective change', html: 'Fixes a defect found in operation, such as a refund that returns the wrong amount. Often small and urgent, but it touches code that real customers use every day.' },
        { title: 'Adaptive change', html: 'Keeps the system working when its <b>environment</b> changes: a new OS or browser version, a new payment-gateway API version, a new tax rule or a new hosting platform.' },
        { title: 'Improvement', html: 'Improves <b>performance</b> or <b>maintainability</b> — faster queries, refactored code, upgraded libraries — or adds a planned enhancement. Behaviour should only change where intended.' },
        { title: 'Planned or unplanned', html: 'Most changes ship in <b>planned releases</b> with normal testing time. <b>Hot fixes</b> are unplanned, urgent releases with hours, not days, to test.' }
      ] },
      { t: 'h', text: 'Three triggers for maintenance testing' },
      { t: 'list', items: [
        '<b>Modifications</b> — planned enhancements, corrective changes and hot fixes. Test the change itself, then run the regression tests that impact analysis points to.',
        '<b>Upgrades or migrations of the operational environment</b> — moving to a new platform, OS, database version or cloud provider. Test the system in the new environment as well as any changed software, and test <b>data conversion</b> when data from another application is migrated in.',
        '<b>Retirement</b> — the application reaches the end of its life. If data must be kept for years, test <b>data archiving</b>, and test the <b>restore and retrieval</b> procedures so archived records can still be produced when someone needs them.'
      ] },
      { t: 'h', text: 'Impact analysis: what can this change break?' },
      { t: 'p', html: '<b>Impact analysis</b> identifies everything a change could affect: code that calls the changed function, screens and reports that show its data, interfaces to other systems, configuration, documentation and the tests themselves. It can be done <b>before</b> a change is made, to help decide whether the change is worth its consequences, and again afterwards to choose the tests. Good traceability makes it far easier: when requirements, code areas and test cases are linked, you follow the links instead of guessing.' },
      { t: 'list', items: [
        '<b>What exactly changed?</b> Read the ticket, the pull request description and the release notes; ask the developer which functions, tables and settings were touched.',
        '<b>Who else uses it?</b> Shared services, APIs, database tables, batch jobs, exports, emails and older mobile app versions that read the same data.',
        '<b>How risky is each area?</b> Money, personal data, legal rules and high-traffic flows rank first; areas with a history of defects come next.',
        '<b>Which tests exist?</b> Linked cases to update and retest, regression tests to select, and new tests for the new behaviour.'
      ] },
      { t: 'callout', tone: 'key', title: 'How much maintenance testing is enough?', html: 'The ISTQB syllabus names three factors: the <b>degree of risk</b> of the change, the <b>size of the existing system</b> and the <b>size of the change</b>. A one-line change to a shared pricing service in a large system can deserve more testing than a new, isolated settings page. Write down the scope you chose and what you left out, so the release decision is made with the risk visible.' },
      { t: 'h', text: 'Hot fixes: fast, but not careless' },
      { t: 'flow', caption: 'A typical hot-fix testing path', steps: ['Reproduce in test env', 'Fix on hot-fix branch', 'Retest the failure', 'Targeted regression', 'Deploy + production smoke', 'Merge fix back to main'] },
      { t: 'p', html: 'With only hours available, focus. <b>Retest</b> the exact failure first, then run a <b>targeted regression</b> around the changed code and the core journeys, and a quick <b>smoke test in production</b> straight after deployment. Finally, make sure the fix is <b>merged back</b> into the main development branch and a regression test for the bug is added. If the fix lives only on the hot-fix branch, the next planned release can quietly bring the bug back — a classic, avoidable regression.' },
      { t: 'h', text: 'Testing a data migration' },
      { t: 'table', caption: 'Checks for data moved or converted into a new system', head: ['Check', 'What you compare', 'Example'], rows: [
        ['<b>Completeness</b>', 'Record counts and totals, source vs target', 'Same number of appointments per clinic and year; sum of wallet balances identical'],
        ['<b>Mapping and transformation</b>', 'Each field lands in the right place, in the right format', 'Dates move from DD/MM/YYYY to ISO format without swapping day and month'],
        ['<b>Encoding</b>', 'Text survives the move unchanged', 'Urdu and Arabic names, apostrophes (O’Brien) and emoji are not garbled'],
        ['<b>Referential integrity</b>', 'Links between records still resolve', 'Every appointment still points to an existing patient and doctor'],
        ['<b>Duplicates, nulls, defaults</b>', 'No doubled rows; empty fields get the agreed default', 'A patient with no phone number is not given a fake “0000000000”'],
        ['<b>Rollback and timing</b>', 'The plan still works if the migration fails', 'Rollback rehearsed; migration time measured on full-size, masked data']
      ] },
      { t: 'callout', tone: 'info', title: 'When the test basis is out of date', html: 'Older systems often have missing or outdated specifications. Then the <b>current production behaviour</b> becomes an important reference: record what the system does today before changing it, read support tickets and logs, and ask the people who use it daily. If you find behaviour that looks wrong but that users rely on, raise it — “fixing” it is itself a change that needs agreement.' }
    ],
    example: {
      title: 'Worked example: impact analysis for a ShopFlow delivery-fee change',
      blocks: [
        { t: 'p', html: '<b>Change request SF-530:</b> the free-delivery threshold drops from PKR 3,000 to PKR 2,500. While making it, the developer moves the delivery-fee calculation into the shared pricing service. The code change is small, but before planning the tester asks one question: “What else calls this calculation?” A code search and a five-minute chat with the developer produced this map.' },
        { t: 'table', head: ['Area', 'Link to the change', 'Test decision'], rows: [
          ['Delivery rule', 'Changed directly', '<b>New tests:</b> carts of PKR 2,499, 2,500 and 2,501; with and without a coupon'],
          ['Cart and checkout totals', 'Call the shared pricing service', '<b>Regression:</b> multi-item carts, coupons, totals shown at each step'],
          ['Order confirmation email', 'Shows the fee from the service', '<b>Regression:</b> one order above and one below the threshold'],
          ['Partial refunds', 'Recalculate delivery when items are returned', '<b>Regression:</b> a refund that drops an order below PKR 2,500'],
          ['Older mobile app version', 'Still shows the threshold text from the old rule', '<b>Check</b> the label on the current and previous supported versions'],
          ['Login, search, reviews', 'Do not use the pricing service', 'Covered by the standard smoke test only']
        ] },
        { t: 'p', html: 'Notice the refund row: no requirement mentioned refunds, and only the code search revealed the dependency. Money is involved and the change touches a shared component, so the regression scope is wider than the small code change suggests — yet login, search and reviews stay out because nothing connects them to pricing. The tester records that decision in the test summary so the product owner knows exactly what was and was not tested.' }
      ]
    },
    explain: {
      'ur': 'Software live ہونے کے بعد بھی بدلتا رہتا ہے: bug fix، نئی feature، نیا server یا database، اور آخر میں system کو بند کرنا (retirement)۔ ایسے ہر change کو test کرنا <b>maintenance testing</b> کہلاتا ہے۔ اس کے دو سوال ہیں: کیا change ٹھیک کام کر رہا ہے؟ اور کیا باقی system پہلے کی طرح چل رہا ہے (regression)؟ کیا test کرنا ہے، یہ <b>impact analysis</b> سے طے ہوتا ہے: دیکھیں کہ بدلا ہوا code، data یا configuration اور کہاں کہاں استعمال ہوتا ہے۔ مثال: ShopFlow نے free delivery کی حد 3000 سے 2500 روپے کر دی۔ آپ صرف نیا rule نہیں بلکہ cart، checkout، order email اور refund بھی test کریں گے، کیونکہ سب یہی calculation استعمال کرتے ہیں۔ Hotfix کے بعد یہ بھی یقینی بنائیں کہ fix main branch میں merge ہو۔',
      'ur-Latn': 'Software live hone ke baad bhi badalta rehta hai: bug fix, nayi feature, naya server ya database, aur aakhir mein system band karna (retirement). Aise har change ko test karna <b>maintenance testing</b> kehlata hai. Iske do sawal hain: kya change theek kaam kar raha hai? Aur kya baqi system pehle ki tarah chal raha hai (regression)? Kya test karna hai, yeh <b>impact analysis</b> batati hai: dekhein ke badla hua code, data ya configuration aur kahan kahan use hota hai. Misaal: ShopFlow ne free delivery ki limit 3000 se 2500 rupay kar di. Aap sirf naya rule nahi, balke cart, checkout, order email aur refund bhi test karenge, kyun ke sab yehi calculation use karte hain. Hotfix ke baad yeh bhi confirm karein ke fix main branch mein merge ho gaya hai.',
      'hi': 'Software live होने के बाद भी बदलता रहता है: bug fix, नई feature, नया server या database, और आख़िर में system को बंद करना (retirement)। ऐसे हर change को test करना <b>maintenance testing</b> कहलाता है। इसके दो सवाल हैं: क्या change ठीक काम कर रहा है? और क्या बाक़ी system पहले की तरह चल रहा है (regression)? क्या test करना है, यह <b>impact analysis</b> से तय होता है: देखें कि बदला हुआ code, data या configuration और कहाँ-कहाँ इस्तेमाल होता है। उदाहरण: ShopFlow ने free delivery की सीमा 3000 से 2500 रुपये कर दी। आप सिर्फ़ नया rule नहीं, बल्कि cart, checkout, order email और refund भी test करेंगे, क्योंकि सब यही calculation इस्तेमाल करते हैं। Hotfix के बाद यह भी पक्का करें कि fix main branch में merge हो गया है।',
      'ar': 'لا يتوقف البرنامج عن التغيّر بعد إطلاقه: إصلاح أخطاء، وميزات جديدة، وانتقال إلى خادم أو قاعدة بيانات جديدة، وفي النهاية إيقاف النظام (retirement). اختبار هذه التغييرات في نظام يعمل فعلًا يُسمّى <b>اختبار الصيانة</b> (maintenance testing)، وله سؤالان: هل يعمل التغيير بشكل صحيح؟ وهل ما زالت بقية أجزاء النظام تعمل كما كانت (regression)؟ أما ما يجب اختباره فيحدده <b>تحليل الأثر</b> (impact analysis): أين يُستخدم الكود أو البيانات أو الإعدادات التي تغيّرت؟ مثال: خفّض متجر ShopFlow حدّ التوصيل المجاني من 3000 إلى 2500 روبية. لن تختبر القاعدة الجديدة فقط، بل أيضًا سلة الشراء والدفع وبريد تأكيد الطلب والاسترداد، لأنها جميعًا تستخدم الحساب نفسه. وبعد أي hotfix تأكّد من دمج الإصلاح في الفرع الرئيسي.',
      'es': 'El software sigue cambiando después de publicarse: correcciones de errores, nuevas funciones, migraciones a otro servidor o base de datos y, al final, la retirada del sistema. Probar esos cambios en un sistema que ya está en producción se llama <b>pruebas de mantenimiento</b> (maintenance testing). Responden a dos preguntas: ¿funciona el cambio? y ¿el resto del sistema sigue funcionando como antes (regresión)? Qué probar lo decide el <b>análisis de impacto</b>: ¿dónde más se usan el código, los datos o la configuración que cambiaron? Ejemplo: ShopFlow baja el umbral de envío gratis de 3000 a 2500 rupias. No pruebas solo la regla nueva, sino también el carrito, el checkout, el correo del pedido y los reembolsos, porque todos usan ese cálculo. Tras un hotfix, confirma que la corrección también se fusionó en la rama principal.'
    },
    keyTerms: [
      { term: 'Maintenance testing', def: 'Testing changes to a system already in operation, including checks that the unchanged parts have not regressed.' },
      { term: 'Impact analysis', def: 'Identifying the code, data, interfaces and tests a change can affect, to decide whether to make it and what to test.' },
      { term: 'Hot fix', def: 'An unplanned, urgent release that fixes a production problem, usually with very little time for testing.' },
      { term: 'Adaptive change', def: 'A change that keeps software working when its environment changes, such as a new OS, browser or third-party API version.' },
      { term: 'Data migration testing', def: 'Checking that data moved or converted into a new system is complete, correctly transformed and still consistent.' },
      { term: 'Data archiving', def: 'Moving data from an active or retired system into long-term storage from which it can be restored and retrieved.' }
    ],
    practice: [
      { q: 'Name the maintenance trigger for each situation and one extra thing you would test: (a) PeopleOps moves from an on-premise server to a cloud platform; (b) a PayLite bug double-charges a transfer fee and must be fixed tonight; (c) MediBook’s old SMS reminder module is switched off, but message history must be kept for five years.', hint: 'The three trigger classes are modifications, upgrades or migrations, and retirement.', answer: '(a) <b>Upgrade/migration</b> of the operational environment — test the system in the new environment (configuration, integrations, performance) plus any data conversion. (b) <b>Modification</b> — a corrective hot fix: retest the double charge, run targeted regression on fees and transfers, smoke-test production after deployment and confirm the fix is merged back. (c) <b>Retirement</b> — test that the history is archived completely and that it can be restored and retrieved when someone requests it.' },
      { q: 'PeopleOps changes leave rounding: half-day requests are now rounded to the nearest half day instead of up to a whole day. List the areas your impact analysis should check.', answer: 'The leave request form and its balance preview; the manager’s approval screen; the stored balance after approval and after cancellation; carry-over at year end; the payroll export of unpaid leave; leave reports and the HR dashboard; email notifications that show the number of days; the API used by the mobile app; and existing requests created under the old rule — are they recalculated or left alone? Ask the developer which code and tables changed, and confirm the expected behaviour for old data with the product owner.' },
      { q: 'MediBook is migrating five years of appointments from a legacy system. Write six checks you would run.', hint: 'Think completeness, correctness, consistency, and what happens if it fails.', answer: '1. Record counts per year and per clinic match between source and target. 2. A random sample of records matches field by field. 3. Dates and times are converted correctly, including time zones and day/month order. 4. Names in Urdu and names with apostrophes are not garbled. 5. Every appointment still links to an existing patient and doctor, and no duplicates appeared. 6. The rollback has been rehearsed and the migration finishes within the agreed downtime window. Then regression-test the features that read the data, such as patient history and reports.' },
      { q: 'A PayLite hot fix must go live in two hours. Describe your testing in order, and say why the last step matters.', answer: 'Reproduce the failure on a test environment if that has not been done, then <b>retest</b> the exact failing case on the fix build. Run a <b>targeted regression</b> on the changed code and the core money flows — send, receive, top-up. After deployment, run a short <b>production smoke</b> check on the fixed flow. Finally, confirm the fix is <b>merged back</b> into the main branch and a regression test for the bug is added. Without the merge, the next planned release would reintroduce the bug.' }
    ],
    quiz: [
      { q: 'What two things does maintenance testing check after a change to a live system?', options: ['The change works, and unchanged parts still behave as before', 'Only the changed code, because the rest passed in earlier releases', 'The whole system from scratch, exactly as on the first release', 'Only performance, because the functions were tested already'], correct: 0,
        why: ['Right — it confirms the change and checks the unchanged parts, usually most of the system, for regressions.', 'Earlier passes do not protect against side effects; a change in shared code can break features nobody touched.', 'Retesting everything from scratch is rarely affordable or necessary; impact analysis and risk decide the scope.', 'Functional side effects are the main concern; performance may matter, but it is not the whole job.'] },
      { q: 'PayLite is moving from an on-premise server to a cloud platform, and its transaction history will be converted into a new database. Which trigger is this, and what extra testing does it need?', options: ['A modification — run only the regression suite for recent features', 'Retirement — test that old data is archived and can be restored', 'A migration — test the new environment and the converted data', 'A hot fix — retest the failed case and deploy as fast as possible'], correct: 2,
        why: ['Moving platform and converting data is more than a feature change; the new environment and the data need their own tests.', 'Retirement means switching the system off; here PayLite keeps running on a new platform.', 'Right — an upgrade or migration of the operational environment needs tests in the new environment and tests of the data conversion.', 'A hot fix is an urgent repair of a production defect, not a planned platform move.'] },
      { q: 'Why might a team carry out impact analysis before a change has even been made?', options: ['To produce the release notes that customers read after deployment', 'To help decide whether the change should be made at all', 'To replace regression testing once the change has been deployed', 'To measure how many defects the developers introduced last sprint'], correct: 1,
        why: ['Release notes come later; impact analysis is about consequences, not customer communication.', 'Right — ISTQB notes that impact analysis may be done before a change, to help decide whether to make it given its effect on other areas.', 'Impact analysis guides regression testing; it never replaces it.', 'It looks at what a change can affect, not at how developers performed.'] },
      { q: 'A one-line PayLite hot fix passed retest and targeted regression and went live on Friday. In the next planned release, the same bug reappears. What was most likely missed?', options: ['A full regression of every feature before the hot fix went live', 'A production smoke test straight after the hot-fix deployment', 'A performance test of the rounding function under heavy load', 'Merging the hot fix back into the main development branch'], correct: 3,
        why: ['A full regression would not have helped: the hot fix itself worked in production.', 'A production smoke test checks that deployment, but the bug returned in a later release built from a different branch.', 'Performance has nothing to do with a fix disappearing from the next release.', 'Right — if the fix exists only on the hot-fix branch, the next release built from main reintroduces the bug. Merge back and add a regression test.'] },
      { q: 'MediBook migrated 1,240,000 appointment records, and the new system shows the same record count. Which additional check is most likely to reveal a conversion defect?', options: ['Compare sampled records field by field, including Urdu names', 'Count the records again using a different database client', 'Confirm the migration script finished without printing errors', 'Check that the new login page loads quickly on the staging server'], correct: 0,
        why: ['Right — matching counts prove completeness, not correctness. Field-by-field sampling catches broken mappings, swapped dates and garbled characters.', 'Counting the same rows twice cannot reveal wrong content inside the records.', 'A script can finish “successfully” while silently truncating or mis-mapping fields.', 'Login speed says nothing about whether appointment data was converted correctly.'] }
    ],
    interview: [
      { q: 'What is maintenance testing, and how do you decide how much to test?', a: '<b>Maintenance testing</b> is testing changes to a system that is already in production — corrective fixes, enhancements, hot fixes, environment upgrades or migrations, and retirement. It checks two things: the change works, and the unchanged parts have not regressed. To decide scope I start with <b>impact analysis</b>: what changed, what depends on it (shared services, reports, interfaces, data) and how risky those areas are. ISTQB lists three factors: the risk of the change, the size of the existing system and the size of the change. I test the change itself, retest linked cases, run regression on affected high-risk areas plus core journeys, and state clearly what I left out.' },
      { q: 'How would you test a data migration?', a: 'I treat it as a small test project of its own. Before: understand the field mapping and transformation rules, profile the source data for oddities such as nulls, duplicates and special characters, and agree a rollback plan. In a rehearsal on production-sized, masked data: reconcile <b>record counts and totals</b> between source and target, compare a sample of records field by field, and check <b>referential integrity</b>, encoding (for example Urdu names), date and currency formats, and how long the migration takes. After: regression-test the features that read the migrated data, and confirm a migrated user can log in and see their history. A matching count alone proves nothing about content.' }
    ],
    takeaways: [
      'Maintenance testing checks that a change works and that unchanged parts did not regress.',
      'Triggers: modifications (including hot fixes), upgrades or migrations, and retirement.',
      'Impact analysis finds what a change can affect — and can even decide whether to make it.',
      'Scope depends on the risk of the change, the size of the system and the size of the change.',
      'Hot fixes need a retest, targeted regression, a production smoke test and a merge back to main.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'], interview: ['m3', 'm6'] }
  }
]);
QA_CONTENT.addLessons('manual', [
  {
    id: 'mt-tools',
    n: 12,
    level: 'beginner',
    title: 'QA tools: Jira, test management and bug tracking',
    summary: 'Use an issue tracker and a test management tool day to day: workflows, bug fields, JQL filters, test runs, traceability links and dashboards.',
    minutes: 18,
    objectives: [
      'Describe a Jira-style workflow and fill in the key fields of a bug ticket',
      'Write simple JQL queries and save them as filters for boards and dashboards',
      'Explain test repositories, test runs and traceability in a test management tool',
      'Weigh the benefits and risks of tool support when a team chooses a tool'
    ],
    body: [
      { t: 'p', html: 'Read any QA job advert and you will see the same family of tools: an <b>issue tracker</b> such as Jira, Azure DevOps Boards or GitHub Issues, and a <b>test management tool</b> such as TestRail, Zephyr or Xray. Tools do not make anyone a good tester, but every team uses them to share work, record evidence and make decisions. Interviewers rarely care which buttons you clicked; they care whether you understand the concepts — workflows, fields, queries, test runs and traceability — because those transfer to any tool.' },
      { t: 'h', text: 'Issue trackers and workflows' },
      { t: 'p', html: 'In an issue tracker every piece of work is an <b>issue</b> (ticket) with a type — epic, story, task, bug, sub-task — and a key such as <code>SHOP-245</code>, where SHOP is the project. Each issue moves through a <b>workflow</b>: a set of statuses and the transitions allowed between them, for example To Do → In Progress → Ready for QA → Done. Workflows are configured per team, so names differ. Learn what each status promises: “Ready for QA” should mean the fix is deployed to a test build, not merely merged.' },
      { t: 'table', caption: 'Key fields on a bug ticket (names vary with each team’s configuration)', head: ['Field', 'What it holds', 'Tip'], rows: [
        ['<b>Summary</b>', 'One line: what fails, where, under which condition', '“Checkout: SAVE10 also discounts the shipping fee” beats “Coupon bug”'],
        ['<b>Priority</b>', 'Built-in field: how urgently it should be fixed', 'A business decision, usually confirmed by the product owner in triage'],
        ['<b>Severity</b>', 'Impact on the user or system — usually a <b>custom field</b> the team adds', 'The tester’s assessment; keep it separate from Priority'],
        ['<b>Affects / Fix version</b>', 'The release where it was found; the release that will contain the fix', 'Fix version drives release filters and dashboards'],
        ['<b>Component and labels</b>', 'Product area and free-form tags', 'Make queries such as “all open checkout bugs” possible'],
        ['<b>Environment</b>', 'Where it was seen', 'Staging, build 5.9.0-rc2, Chrome on Windows 11'],
        ['<b>Linked issues</b>', 'Relations to stories, tests and other bugs', 'Links power traceability and duplicate tracking']
      ] },
      { t: 'callout', tone: 'warn', title: 'Don’t make Priority do Severity’s job', html: 'Jira’s built-in <b>Priority</b> field means urgency, not impact. If your project has no Severity field, describe the impact in the description or ask the team to add one — never inflate Priority to get attention. A typo in the company name on the home page is low severity but can still be high priority.' },
      { t: 'h', text: 'Finding work with JQL' },
      { t: 'p', html: '<b>JQL</b> (Jira Query Language) finds issues with clauses of the form <i>field operator value</i>, joined with <code>AND</code> or <code>OR</code> and sorted with <code>ORDER BY</code>. Save a query as a <b>filter</b>, subscribe to it by email, or show it on a <b>dashboard</b> with gadgets such as Filter Results, Pie Chart or Created vs. Resolved. Other trackers use their own query syntax, but the habit is the same: build the list once and let the tool keep it up to date.' },
      { t: 'code', lang: 'text', title: 'Everyday JQL (lines starting with # are notes, not JQL)', code: `# Open ShopFlow bugs, most urgent first
project = SHOP AND issuetype = Bug AND resolution = Unresolved ORDER BY priority DESC, created ASC

# Bugs waiting for me to retest
project = SHOP AND issuetype = Bug AND status = "Ready for QA" AND assignee = currentUser()

# Checkout bugs reported in the last 7 days
project = SHOP AND issuetype = Bug AND labels = checkout AND created >= -7d

# Unresolved bugs planned for release 5.9.0
project = SHOP AND issuetype = Bug AND fixVersion = "5.9.0" AND resolution = Unresolved

# Stories in the current sprint that are not Done yet
project = SHOP AND issuetype = Story AND sprint in openSprints() AND status != Done

# Duplicate check before logging a new coupon bug
project = SHOP AND issuetype = Bug AND text ~ "coupon" ORDER BY created DESC` },
      { t: 'h', text: 'Test management tools' },
      { t: 'cards', items: [
        { title: 'Test repository', html: 'All test cases in folders or sections, with steps, expected results, priority and links to requirements. Cases are reused across releases, not rewritten.' },
        { title: 'Test run or cycle', html: 'A selection of cases to execute against one build or sprint. Names differ: TestRail calls it a <b>test run</b>, Zephyr a <b>test cycle</b>, Xray a <b>Test Execution</b>.' },
        { title: 'Results', html: 'Each case in a run gets a status such as Untested, Passed, Failed, Blocked or Retest, plus comments, attachments and any bug it raised.' },
        { title: 'Traceability and reports', html: 'Story ↔ test case ↔ result ↔ bug links feed coverage and progress reports: which stories are untested, failing or blocked.' }
      ] },
      { t: 'p', html: 'Links are what turn tools into evidence. A failed case should raise or link a bug, the bug should link to the story it affects, and the story should show its tests. Jira’s standard link types include <i>blocks / is blocked by</i>, <i>relates to</i>, <i>duplicates / is duplicated by</i> and <i>clones / is cloned by</i>. When the product owner opens story SHOP-210 and sees two passed cases, one failed case and an open linked bug, nobody needs to ask “where are we?”.' },
      { t: 'h', text: 'Benefits and risks of tool support' },
      { t: 'compare', a: { title: 'Benefits (ISTQB chapter 6)', items: ['Less repetitive manual work, such as copying results or building reports', 'More consistency and fewer simple human errors', 'Objective measures that are hard to collect by hand, such as coverage', 'Easy access to test information: statistics, graphs and aggregated data', 'Faster feedback when execution and reporting are automated'] }, b: { title: 'Risks (ISTQB chapter 6)', items: ['Unrealistic expectations of what the tool will do', 'Underestimating the time, cost and effort to introduce and maintain it', 'Using a tool where manual work is more appropriate', 'Relying on the tool so much that critical thinking stops', 'Dependence on a vendor, or on an open-source project that gets abandoned', 'Poor fit with the platform or with regulatory requirements'] } },
      { t: 'callout', tone: 'tip', title: 'Choosing a tool', html: 'Start from the team’s needs, not a feature list. Does it integrate with the tracker, CI pipeline and automation framework you already use? Can the whole team learn it quickly? Where is the data stored, and does that meet your privacy and compliance rules? Is vendor or community support reliable? Run a short <b>trial or proof of concept</b> on real work before committing, and include the effort of migrating existing test cases.' }
    ],
    example: {
      title: 'Worked example: from a failed run to a tracked fix in ShopFlow',
      blocks: [
        { t: 'p', html: '<b>Situation:</b> ShopFlow build 5.9.0-rc2 is on staging. In the test run “Sprint 14 · regression · rc2”, case TC-CART-033 (“SAVE10 never discounts the shipping fee”) fails: the shipping line drops from PKR 250 to PKR 225. The tester marks the case Failed and uses the tool’s create-defect action, so the new bug is linked to the run result automatically.' },
        { t: 'code', lang: 'text', title: 'SHOP-245 as created', code: `Project:       SHOP (ShopFlow)
Issue type:    Bug
Summary:       Checkout: SAVE10 also discounts the shipping fee
Priority:      High    (confirmed by the PO in triage)
Severity:      Major   (custom field)
Affects ver.:  5.9.0-rc2
Component:     Checkout       Labels: coupon, regression
Environment:   Staging, build 5.9.0-rc2, Chrome on Windows 11
Description:   Preconditions, steps, expected and actual result, screenshot
Links:         relates to SHOP-210 (coupon story)
Test result:   TC-CART-033 Failed in run "Sprint 14 · regression · rc2"` },
        { t: 'table', head: ['Step', 'Where', 'What changes'], rows: [
          ['1. Triage', 'Issue tracker', 'PO confirms Priority High and sets Fix version 5.9.0; the bug is assigned to a developer'],
          ['2. Fix', 'Issue tracker', 'Developer moves SHOP-245 to Ready for QA once rc3 is deployed to staging'],
          ['3. Retest', 'Test management tool', 'New run “Sprint 14 · rc3” holds TC-CART-033 and nearby coupon cases; all Passed'],
          ['4. Close', 'Issue tracker', 'Tester closes SHOP-245, noting the build it was verified on'],
          ['5. Report', 'Dashboard', 'The filter “Unresolved bugs for 5.9.0” drops by one; story SHOP-210 shows all linked tests passed']
        ] },
        { t: 'p', html: 'Nobody needed a status meeting. Because the run, the case, the bug and the story were linked, anyone could follow the trail — and the old rc2 run still shows the failure, which is useful evidence if the same bug ever returns.' }
      ]
    },
    explain: {
      'ur': 'QA کے روزمرہ کام میں دو قسم کے tools سب سے زیادہ استعمال ہوتے ہیں۔ <b>Issue tracker</b> (جیسے Jira) میں ہر story، task اور bug ایک ticket ہوتا ہے جو workflow کے statuses سے گزرتا ہے، مثلاً Open، In Progress، Ready for QA اور Closed۔ <b>Test management tool</b> میں test cases محفوظ رہتے ہیں اور ہر build کے لیے ایک نیا test run بنتا ہے جس میں ہر case کا نتیجہ Passed، Failed یا Blocked لکھا جاتا ہے۔ اصل طاقت links میں ہے: story ↔ test case ↔ bug۔ مثال: TC-CART-033 fail ہوا تو آپ وہیں سے bug بنائیں، وہ test اور story دونوں سے جڑ جائے گا۔ JQL سے filters بنتے ہیں، جیسے «میرے retest والے bugs»۔ Jira میں Priority پہلے سے موجود ہوتی ہے، Severity عموماً custom field ہوتی ہے۔ یاد رکھیں: tool سوچتا نہیں، tester سوچتا ہے۔',
      'ur-Latn': 'QA ke rozmarra kaam mein do qisam ke tools sab se zyada use hote hain. <b>Issue tracker</b> (jaise Jira) mein har story, task aur bug ek ticket hota hai jo workflow ke statuses se guzarta hai, maslan Open, In Progress, Ready for QA aur Closed. <b>Test management tool</b> mein test cases save rehte hain aur har build ke liye ek naya test run banta hai jismein har case ka result Passed, Failed ya Blocked likha jata hai. Asal taaqat links mein hai: story ↔ test case ↔ bug. Misaal: TC-CART-033 fail hua to aap wahin se bug banayein, woh test aur story dono se jur jayega. JQL se filters bante hain, jaise “mere retest wale bugs”. Jira mein Priority pehle se hoti hai, Severity aam tor par custom field hoti hai. Yaad rakhein: tool sochta nahi, tester sochta hai.',
      'hi': 'QA के रोज़ के काम में दो तरह के tools सबसे ज़्यादा इस्तेमाल होते हैं। <b>Issue tracker</b> (जैसे Jira) में हर story, task और bug एक ticket होता है जो workflow के statuses से गुज़रता है, जैसे Open, In Progress, Ready for QA और Closed। <b>Test management tool</b> में test cases सुरक्षित रहते हैं और हर build के लिए एक नया test run बनता है, जिसमें हर case का नतीजा Passed, Failed या Blocked लिखा जाता है। असली ताक़त links में है: story ↔ test case ↔ bug। उदाहरण: TC-CART-033 fail हुआ तो आप वहीं से bug बनाएँ, वह test और story दोनों से जुड़ जाएगा। JQL से filters बनते हैं, जैसे “मेरे retest वाले bugs”। Jira में Priority पहले से होती है, Severity आमतौर पर custom field होती है। याद रखें: tool सोचता नहीं, tester सोचता है।',
      'ar': 'في العمل اليومي لمختبِر الجودة نوعان من الأدوات هما الأكثر استخدامًا. في <b>أداة تتبّع المشكلات</b> (issue tracker) مثل Jira تكون كل قصة ومهمة وخطأ تذكرةً (ticket) تنتقل عبر حالات سير العمل (workflow)، مثل Open ثم In Progress ثم Ready for QA وأخيرًا Closed. وفي <b>أداة إدارة الاختبارات</b> (test management tool) تُحفظ حالات الاختبار، ويُنشأ لكل build تشغيل اختبار (test run) جديد تُسجَّل فيه نتيجة كل حالة: Passed أو Failed أو Blocked. القوة الحقيقية في الروابط: القصة ↔ حالة الاختبار ↔ الخطأ. مثال: إذا فشلت الحالة TC-CART-033 فأنشئ الخطأ منها مباشرة، فيرتبط تلقائيًا بالاختبار والقصة. وبلغة JQL تبني مرشّحات مثل «الأخطاء التي تنتظر إعادة اختباري». في Jira حقل Priority مدمج، أما Severity فغالبًا حقل مخصّص. وتذكّر: الأداة لا تفكّر، المختبِر هو من يفكّر.',
      'es': 'En QA se usan sobre todo dos tipos de herramientas. En un <b>issue tracker</b> como Jira, cada historia, tarea o bug es un ticket que avanza por los estados de un workflow, por ejemplo Open, In Progress, Ready for QA y Closed. En una <b>herramienta de gestión de pruebas</b> se guardan los casos de prueba y, para cada build, se crea una nueva ejecución (test run) donde cada caso queda como Passed, Failed o Blocked. La verdadera fuerza está en los enlaces: historia ↔ caso de prueba ↔ bug. Ejemplo: si falla TC-CART-033, crea el bug desde ese resultado y quedará enlazado al caso y a la historia. Con JQL creas filtros como «bugs pendientes de mi retest». En Jira, Priority viene de serie; Severity suele ser un campo personalizado. Recuerda: la herramienta no piensa; piensa el tester.'
    },
    keyTerms: [
      { term: 'Issue tracker', def: 'A tool such as Jira that records stories, tasks and bugs as tickets and moves them through a workflow.' },
      { term: 'Workflow', def: 'The statuses an issue can have and the transitions allowed between them, configured per team or project.' },
      { term: 'JQL', def: 'Jira Query Language: field-operator-value clauses joined with AND or OR, used to build filters and dashboards.' },
      { term: 'Test run (test cycle)', def: 'A set of test cases selected for execution against a specific build or sprint, each with a result status.' },
      { term: 'Custom field', def: 'A field a team adds to its tracker, such as Severity, because the default configuration does not include it.' },
      { term: 'Traceability link', def: 'A recorded relation between a requirement, its tests and related defects, used for coverage and impact analysis.' }
    ],
    practice: [
      { q: 'Write a JQL query for: unresolved bugs in project PAY that <b>you</b> reported in the last 14 days, highest priority first.', hint: 'You need project, issuetype, reporter, resolution, created and ORDER BY.', answer: '<code>project = PAY AND issuetype = Bug AND reporter = currentUser() AND resolution = Unresolved AND created >= -14d ORDER BY priority DESC</code>. Save it as a filter such as “My open PAY bugs” so you can reuse it or add it to a dashboard.' },
      { q: 'While testing PeopleOps you find that approving a leave request for an employee in another department shows a blank page. Which fields would you fill in, and with what values?', answer: 'Summary: “Leave approval: blank page when approving a request from another department”. Type: Bug. Component: Leave. Affects version: the build under test. Environment: staging, build number, browser. Severity (custom field): Major — managers cannot finish the task for some employees. Priority: suggest High, but the product owner confirms it in triage. Description: preconditions, steps, expected and actual result, with a screenshot and the console error. Links: <i>relates to</i> the approval story, plus the failed test case or run result.' },
      { q: 'Your team must re-run 40 regression cases on a new build next week. How would you set this up in a test management tool, and why not simply edit last week’s run?', answer: 'Create a <b>new run or cycle</b> (often by copying last week’s), named after the build or sprint, containing the same 40 cases with status Untested, and assign the cases. Record results per case against the new build. Editing the old run would overwrite evidence: you would lose what failed on the previous build and the ability to compare builds or show that a bug was once present.' },
      { q: 'Your manager asks you to recommend a test management tool. List five questions you would ask before choosing.', answer: 'Does it integrate with our issue tracker, CI pipeline and automation results? How quickly can the whole team learn it? Can it import our existing test cases — and export them if we ever leave? Where is the data hosted, and does that meet our privacy or compliance rules? How reliable is vendor or community support, and is the product actively maintained? Then run a short trial on a real sprint before deciding.' }
    ],
    quiz: [
      { q: 'In a default Jira setup, which statement about Priority and Severity is accurate?', options: ['Severity is built in and Priority must be added as a custom field', 'They are the same field, shown under two names in different views', 'Priority describes technical impact, so testers always set it alone', 'Priority is built in; teams often add Severity as a custom field'], correct: 3,
        why: ['It is the other way round: Priority ships with Jira, and Severity is typically added by the team.', 'They are different ideas — urgency versus impact — and belong in separate fields.', 'Priority is about urgency and is usually decided by the business, not by testers alone.', 'Right — Priority (urgency) is a default field; many teams add Severity (impact) as a custom field.'] },
      { q: 'What does this JQL return? project = SHOP AND issuetype = Bug AND resolution = Unresolved ORDER BY priority DESC', options: ['Every SHOP bug ever created, sorted by its creation date', 'Open SHOP bugs that have no resolution, most urgent first', 'Resolved SHOP bugs, sorted from lowest to highest priority', 'Unresolved issues of every type across all Jira projects'], correct: 1,
        why: ['The resolution clause excludes resolved bugs, and the sort is by priority, not creation date.', 'Right — unresolved bugs in project SHOP, sorted from the highest priority down.', 'resolution = Unresolved keeps open issues only, and DESC sorts from the highest priority down.', 'The project and issuetype clauses limit the results to bugs in SHOP.'] },
      { q: 'You must re-run 60 regression cases on build 5.9.0-rc3 in a test management tool and keep last week’s rc2 results. What is the usual approach?', options: ['Edit last week’s results and overwrite them with the new outcomes', 'Copy the 60 test cases into a new folder so they can be run again', 'Create a new test run or cycle with those cases for build rc3', 'Export the cases to a spreadsheet and record the results there'], correct: 2,
        why: ['Overwriting destroys the evidence of what failed on rc2 and makes builds impossible to compare.', 'Copying cases creates duplicates to maintain; the repository is meant to be reused.', 'Right — a new run or cycle reuses the same cases, records results against rc3 and keeps the rc2 history.', 'A spreadsheet loses the links to cases, bugs and stories that the tool provides.'] },
      { q: 'You are about to log a bug: coupons fail at ShopFlow checkout. What should you do in the issue tracker first?', options: ['Search existing issues for “coupon” to avoid logging a duplicate', 'Assign the new ticket straight to the developer who built checkout', 'Set the Priority to Highest so the team notices the bug quickly', 'Create a separate Jira project so checkout bugs are kept apart'], correct: 0,
        why: ['Right — a quick search (for example with <code>text ~ "coupon"</code>) prevents duplicates; if a ticket exists, add your evidence to it.', 'Assignment usually happens in triage, and skipping the search may still create a duplicate.', 'Priority is a business decision about urgency, not a way to get attention.', 'Creating projects is an admin task and would hide the bug from the team’s filters.'] },
      { q: 'Which of these is a risk of tool support named in the ISTQB syllabus?', options: ['Tools make results less consistent than people working by hand', 'Tools always cut the total cost of testing within the first year', 'Underestimating the effort to introduce and maintain the tool', 'Tools remove the need for testers to think critically about results'], correct: 2,
        why: ['Consistency is a benefit of tools: they repeat the same steps the same way every time.', 'Tools have introduction and maintenance costs; savings are never guaranteed, let alone within a year.', 'Right — ISTQB lists inaccurate estimates of the time, cost and effort to introduce a tool and maintain its scripts as a risk.', 'The real risk is the opposite: relying on a tool so much that people stop thinking critically.'] }
    ],
    interview: [
      { q: 'Which tools have you used for bug tracking and test management, and how did you use them?', a: 'Answer with concepts, not just names. For example: “I used Jira for stories and bugs. I logged bugs with clear summaries, steps, environment and severity, linked them to the story they affected, and followed them through our workflow — retesting when they reached Ready for QA and reopening them if the fix failed. I kept JQL filters for bugs waiting for my retest and for unresolved bugs in the next fix version, and those fed our release dashboard. Test cases lived in a test management tool; for each build we created a run, recorded Passed, Failed or Blocked, and raised bugs straight from failed results so the links were automatic.” If you have only used a tool in practice projects, say so honestly.' },
      { q: 'How do you maintain traceability between requirements, tests and defects?', a: 'I keep the links in the tools rather than in a separate spreadsheet. Each test case references the story or requirement it covers; each test run records results per build; each bug is created from, or linked to, the failed result and linked to the story with a relation such as <i>relates to</i> or <i>is blocked by</i>. That lets me answer “which stories have no tests?”, “which stories are failing?” and “what must I re-run if this requirement changes?” with a filter or a coverage report instead of guesswork.' }
    ],
    takeaways: [
      'An issue tracker moves tickets through a team-configured workflow; know what each status promises.',
      'In Jira, Priority is built in (urgency); Severity is usually a custom field (impact).',
      'JQL filters — field operator value, AND/OR, ORDER BY — feed boards and dashboards.',
      'Test management tools keep a reusable repository and a new run or cycle for each build.',
      'Links between stories, tests and bugs turn tools into evidence; tools support thinking, they don’t replace it.'
    ],
    links: { labs: ['bughunt'], challenges: ['bug-report'], interview: ['m2'] }
  }
]);
QA_CONTENT.addBank('foundations', [
  { level: 'intermediate', topic: 'fd-maintenance',
    q: 'Which factors does the ISTQB syllabus say the scope of maintenance testing typically depends on?',
    options: ['The number of testers available and the length of the sprint', 'Risk of the change, size of the system, size of the change', 'The age of the code and the programming language it uses', 'The number of open defects and the date of the last release'], correct: 1,
    why: ['Team capacity limits what you can do, but it does not define what the change needs.', 'Right — the degree of risk of the change, the size of the existing system and the size of the change drive the scope.', 'Old code may be risky, but age and language are not the factors the syllabus names.', 'Defect counts and dates may inform risk, but they are not the defined scope factors.'] },
  { level: 'intermediate', topic: 'fd-maintenance',
    q: 'PeopleOps is being retired, but HR must keep employee records for seven years. What should maintenance testing focus on?',
    options: ['Regression testing all PeopleOps features before switching it off', 'Performance testing the system with seven years of extra data', 'Archiving the data and testing restore and retrieval', 'Usability testing the old screens with newly hired HR staff'], correct: 2,
    why: ['The features are about to disappear; re-checking them all adds little value at retirement.', 'The system will no longer run, so its performance with more data is not the concern.', 'Right — retirement with long data retention needs archiving tests plus restore and retrieval tests, so records can be produced on request.', 'Usability of screens that are being switched off is not a priority.'] }
]);
QA_CONTENT.addBank('manual', [
  { level: 'beginner', topic: 'mt-tools',
    q: 'A product owner wants to see, on story SHOP-210, which tests cover it and whether any linked bug is still open. What makes this possible?',
    options: ['Links between the story, its test cases and the related bugs', 'A higher Priority on the story so testers report on it first', 'A separate spreadsheet that the tester updates every Friday', 'A label named coverage added to every ticket in the project'], correct: 0,
    why: ['Right — story ↔ test ↔ bug links let the tools show coverage and open defects on the story itself.', 'Priority orders work; it does not show coverage or defects.', 'A manual spreadsheet goes stale and lives apart from the story the product owner is looking at.', 'A label tags tickets, but it records no relation between a story, its tests and its bugs.'] },
  { level: 'beginner', topic: 'mt-tools',
    q: 'In a Jira-style issue tracker, what is a workflow?',
    options: ['The list of fields a reporter must fill in on every bug ticket', 'A saved JQL filter that feeds the charts on the team dashboard', 'The order in which test cases are arranged within a test run', 'The statuses an issue moves through and the allowed moves'], correct: 3,
    why: ['That is the screen or field configuration, not the workflow.', 'That is a saved filter; dashboards use filters, not workflows.', 'Test runs belong to test management, and their order is an execution schedule.', 'Right — a workflow defines the statuses (for example Open, In Progress, Ready for QA, Closed) and the transitions allowed between them.'] }
]);
QA_CONTENT.addVisuals({
  'fd-maintenance': [
    { t: 'tree', title: 'What triggers maintenance testing?', root: { label: 'Maintenance testing triggers', children: [
      { label: 'Modifications', children: [{ label: 'Planned enhancements' }, { label: 'Corrective changes' }, { label: 'Hot fixes' }] },
      { label: 'Upgrades and migrations', children: [{ label: 'New platform or OS version' }, { label: 'Database or cloud move' }, { label: 'Data conversion' }] },
      { label: 'Retirement', children: [{ label: 'Data archiving' }, { label: 'Restore and retrieval' }] }
    ] }, caption: 'Each branch adds its own tests on top of regression: migrations need tests in the new environment and of converted data, and retirement needs archiving plus restore and retrieval tests.' },
    { t: 'flowchart', title: 'Impact analysis from change request to test scope', dir: 'down', nodes: [
      { id: 'cr', label: 'Change request or bug fix', kind: 'start' },
      { id: 'items', label: 'List changed code, data, config, APIs' },
      { id: 'trace', label: 'Trace dependents: callers, reports, links' },
      { id: 'risk', label: 'Rate the risk of each affected area' },
      { id: 'worth', label: 'Benefit worth the risk?', kind: 'decision' },
      { id: 'stop', label: 'Rework or drop the change', kind: 'end' },
      { id: 'select', label: 'Select tests: new, retest, regression' },
      { id: 'run', label: 'Execute, then smoke-test after deploy' },
      { id: 'report', label: 'Report results and residual risk', kind: 'end' }
    ], edges: [
      { from: 'cr', to: 'items' }, { from: 'items', to: 'trace' }, { from: 'trace', to: 'risk' }, { from: 'risk', to: 'worth' },
      { from: 'worth', to: 'select', label: 'Yes' }, { from: 'worth', to: 'stop', label: 'No' },
      { from: 'select', to: 'run' }, { from: 'run', to: 'report' }
    ], caption: 'Impact analysis can run before the change is built: if the affected areas carry more risk than the change is worth, the team can rework or drop it instead of testing it.' }
  ],
  'mt-tools': [
    { t: 'flowchart', title: 'A Jira-style bug workflow with a Reopen loop', dir: 'down', nodes: [
      { id: 'new', label: 'New bug logged', kind: 'start' },
      { id: 'valid', label: 'Valid and not a duplicate?', kind: 'decision' },
      { id: 'rejected', label: 'Rejected or Duplicate', kind: 'end' },
      { id: 'open', label: 'Open: prioritised and assigned' },
      { id: 'prog', label: 'In Progress: developer fixes' },
      { id: 'qa', label: 'Ready for QA: fix in a test build' },
      { id: 'retest', label: 'Retest passes?', kind: 'decision' },
      { id: 'closed', label: 'Closed', kind: 'end' },
      { id: 'reopen', label: 'Reopened' }
    ], edges: [
      { from: 'new', to: 'valid' }, { from: 'valid', to: 'open', label: 'Yes' }, { from: 'valid', to: 'rejected', label: 'No' },
      { from: 'open', to: 'prog' }, { from: 'prog', to: 'qa' }, { from: 'qa', to: 'retest' },
      { from: 'retest', to: 'closed', label: 'Yes' }, { from: 'retest', to: 'reopen', label: 'No' },
      { from: 'reopen', to: 'prog', label: 'Back to developer' }
    ], caption: 'Status names are configured per team, but the shape is common: only a passed retest closes a bug, and a failed retest loops back through Reopened.' },
    { t: 'sequence', title: 'From a failed test run to a linked bug', actors: ['Tester', 'Test mgmt tool', 'Issue tracker', 'Developer'], steps: [
      { from: 0, to: 1, label: 'Mark TC-CART-033 Failed in run rc2' },
      { from: 1, to: 2, label: 'Create bug SHOP-245 from the result' },
      { from: 2, to: 1, label: 'Bug key linked to the result', reply: true },
      { from: 2, to: 3, label: 'Assigned after triage' },
      { from: 3, to: 2, label: 'Fixed in rc3: status Ready for QA' },
      { from: 2, to: 0, label: 'Notification: ready to retest', reply: true },
      { from: 0, to: 1, label: 'Retest in new run rc3: Passed' },
      { from: 0, to: 2, label: 'Close SHOP-245, note verified build' }
    ], caption: 'Creating the bug from the failed result is what builds the traceability chain: the run, the case, the bug and the story stay linked without any manual copying.' }
  ]
});

/* part-3 · stage "manual" · mt-whitebox (n 13), mt-prioritization (n 14), bank, drill mt-d8, visuals */
QA_CONTENT.addLessons('manual', [
  {
    id: 'mt-whitebox',
    n: 13,
    level: 'intermediate',
    title: 'White-box testing: statement and branch coverage',
    summary: 'Measure statement and branch coverage on real code, design tests to close the gaps, and explain what 100% coverage does — and does not — prove.',
    minutes: 18,
    objectives: [
      'Calculate statement and branch coverage for a small function',
      'Explain why 100% branch coverage implies 100% statement coverage, but not the reverse',
      'Design the minimum set of tests needed to reach full branch coverage',
      'Describe what code coverage can and cannot tell you about quality'
    ],
    body: [
      { t: 'p', html: 'Black-box techniques such as equivalence partitioning and boundary value analysis design tests from the specification, without looking at the code. <b>White-box testing</b> (also called structure-based testing) works the other way round: it uses the internal structure of the code to design tests and to measure how much of that structure the tests have exercised. That measurement is called <b>code coverage</b>. At foundation level you need two kinds: <b>statement coverage</b> and <b>branch coverage</b>. Developers apply them most at component (unit) level, but a tester who can read a coverage report spots untested logic that no requirement mentions.' },
      { t: 'compare', a: { title: 'Black-box testing', items: ['Test basis: requirements, user stories, specifications', 'Asks “does it do what it should?”', 'Can find <b>missing</b> behaviour — a rule nobody coded', 'Gives no measure of how much code actually ran'] }, b: { title: 'White-box testing', items: ['Test basis: the code, its structure and control flow', 'Asks “has each part of the code been exercised?”', 'Finds untested logic, dead code and unexpected paths', 'Gives an objective coverage measure, but cannot see code that was never written'] } },
      { t: 'h', text: 'Statements, decisions and branches' },
      { t: 'p', html: 'Here is a small ShopFlow function. The business rule: delivery costs Rs 200, orders of Rs 3,000 or more ship free, members get Rs 50 off the fee, and <b>the fee is never negative</b>. The comments label each executable statement S1–S6 and the two decisions D1 and D2. Keep the rule in mind — the code has a defect that coverage numbers alone will not reveal.' },
      { t: 'code', lang: 'js', title: 'ShopFlow · deliveryFee()', code: `function deliveryFee(total, isMember) {
  let fee = 200;            // S1
  if (total >= 3000) {      // S2 (decision D1)
    fee = 0;                // S3
  }
  if (isMember) {           // S4 (decision D2)
    fee = fee - 50;         // S5
  }
  return fee;               // S6
}` },
      { t: 'p', html: 'Our counting rule: the six executable statements S1–S6 count — each <code>if</code> line and the <code>return</code> included — while the function header and closing braces do not. Each decision has two outcomes, true and false, so the function has <b>4 branches</b>. An <code>if</code> without an <code>else</code> still has a false outcome: control simply jumps past the block, and that invisible path is exactly where branch coverage earns its keep. Strictly, ISTQB defines a branch as any transfer of control in the control-flow graph, including unconditional ones, but coverage tools and most exercises count decision outcomes, as we do here.' },
      { t: 'callout', tone: 'key', title: 'The two formulas', html: '<b>Statement coverage</b> = statements executed ÷ total executable statements × 100%.<br><b>Branch coverage</b> = branch outcomes exercised ÷ total branch outcomes × 100%.<br>Example: <code>deliveryFee(1000, false)</code> runs S1, S2, S4 and S6 → 4 ÷ 6 ≈ <b>67%</b> statement coverage. It takes D1 false and D2 false → 2 ÷ 4 = <b>50%</b> branch coverage.' },
      { t: 'h', text: 'Why 100% statement is not 100% branch' },
      { t: 'p', html: 'Now call <code>deliveryFee(5000, true)</code>. The order is over Rs 3,000 and the customer is a member, so both <code>if</code> blocks run: every statement S1–S6 executes, giving <b>100% statement coverage</b> from a single test. Yet neither false outcome was taken, so branch coverage is only <b>2 ÷ 4 = 50%</b>. Add <code>deliveryFee(1000, false)</code> and both false outcomes are covered: 100% branch. This is why ISTQB says branch coverage <b>subsumes</b> statement coverage — any test set with 100% branch coverage also has 100% statement coverage, but not the other way round.' },
      { t: 'table', caption: 'Coverage criteria at a glance', head: ['Criterion', 'Coverage item', '100% guarantees', 'Does not guarantee'], rows: [
        ['<b>Statement</b>', 'Each executable statement', 'Every statement ran at least once', 'Every decision outcome; data-dependent failures such as a division that fails only when the divisor is 0'],
        ['<b>Branch (decision)</b>', 'Each outcome of each decision', 'Every true and false outcome — and therefore every statement', 'Every path, i.e. every combination of outcomes across decisions'],
        ['<b>Condition, MC/DC</b> (beyond foundation)', 'Each single condition inside a compound decision such as <code>a &amp;&amp; b</code>', 'Each condition takes both values; MC/DC also shows each one independently changes the outcome', 'Correct results or missing requirements — like every coverage measure, it only measures execution']
      ] },
      { t: 'h', text: 'Value and limits of white-box testing' },
      { t: 'cards', items: [
        { title: 'Sees the whole implementation', html: 'Tests are designed from what the code actually does, so they help even when the specification is vague, outdated or incomplete.' },
        { title: 'Gives an objective measure', html: 'Black-box testing alone cannot tell you how much code ran. A coverage report shows exactly which lines and branches no test reached, so you can add targeted tests.' },
        { title: 'Works without running code', html: 'White-box thinking is also used in static testing: reviewers dry-run code, pseudocode or a control-flow graph before the code can even execute.' },
        { title: 'Blind to omissions', html: 'If a requirement was never implemented, there is no code to cover. A missing “fee is never negative” check produces no uncovered branch.' },
        { title: 'Execution is not verification', html: 'A test that runs a line without asserting its result still counts as coverage. Coverage measures what ran, not whether anyone checked the answer.' }
      ] },
      { t: 'p', html: 'Coverage is measured by tools that instrument the code while tests run — for example Istanbul (nyc) or the <code>--coverage</code> option of Jest and Vitest for JavaScript, JaCoCo for Java and coverage.py for Python. The report lists statement, branch, function and line percentages per file and highlights uncovered lines. Use it as a <b>map of untested logic</b>: open the uncovered areas, ask what behaviour lives there, and design a meaningful test with a real expected result. Stronger criteria such as condition coverage and MC/DC go beyond foundation level; they are mainly required in safety-critical domains such as avionics.' },
      { t: 'callout', tone: 'warn', title: 'Coverage is a guide, not a target', html: 'When a team is told “reach 90% coverage”, it is easy to write tests that execute code but assert nothing — the number rises, quality does not. Treat low coverage as a clear signal (that code was never run by the measured tests) and high coverage as necessary but not sufficient. The better question is: which risky behaviour still has no test with a real expected result?' }
    ],
    example: {
      title: 'Worked example: checking the coverage of deliveryFee by hand',
      blocks: [
        { t: 'p', html: 'The developer’s unit suite has two tests, C <code>deliveryFee(5000, false)</code> and D <code>deliveryFee(1000, true)</code>, and the coverage report shows 100% statement and 100% branch coverage. The tester recalculates by hand and compares it with other possible suites.' },
        { t: 'table', head: ['Suite', 'Statements executed', 'Statement coverage', 'Branch outcomes taken', 'Branch coverage'], rows: [
          ['A: <code>(1000, false)</code>', 'S1, S2, S4, S6', '4/6 ≈ 67%', 'D1 false, D2 false', '2/4 = 50%'],
          ['B: <code>(5000, true)</code>', 'S1–S6', '6/6 = 100%', 'D1 true, D2 true', '2/4 = 50%'],
          ['A + B', 'S1–S6', '100%', 'All four', '100%'],
          ['C + D: <code>(5000, false)</code>, <code>(1000, true)</code>', 'C: S1–S4, S6 · D: S1, S2, S4–S6', '100%', 'C: D1 true, D2 false · D: D1 false, D2 true', '100%']
        ] },
        { t: 'p', html: 'Suites A + B and C + D look identical in the report: 100% statement and 100% branch. But only test B runs the path <b>D1 true → D2 true</b>, and that path returns <b>−50</b>: a member with a Rs 5,000 order is “paid” Rs 50 for delivery, breaking the rule that the fee is never negative. The developer’s suite C + D reaches full branch coverage and never sees it. Two decisions already give four paths (2 × 2); ten independent decisions would give 1,024, which is why branch coverage stops at outcomes, not combinations.' },
        { t: 'callout', tone: 'tip', title: 'What the tester does with this', html: 'Report the defect with the exact input: <code>deliveryFee(5000, true)</code> returns <code>-50</code>, expected <code>0</code>. Ask for test B to be added with an assertion on the exact fee. And note in the review that the report said 100% — the bug was found by combining the business rule with a deliberate choice of path, not by the coverage number.' }
      ]
    },
    explain: {
      'ur': 'White-box testing میں ہم code کے اندر دیکھ کر tests بناتے ہیں۔ <b>Statement coverage</b> بتاتی ہے کہ tests نے code کے کتنے فیصد statements کم از کم ایک بار چلائے۔ <b>Branch coverage</b> بتاتی ہے کہ ہر decision (if) کے true اور false دونوں راستے چلے یا نہیں۔ مثال: delivery fee والے function میں 6 statements اور 4 branches ہیں۔ صرف ایک test (5000, true) سارے statements چلا دیتا ہے، یعنی 100% statement coverage، لیکن false والے راستے نہیں چلے، اس لیے branch coverage صرف 50% ہے۔ یاد رکھیں: 100% branch coverage سے 100% statement coverage خود بخود مل جاتی ہے، الٹا نہیں۔ اور coverage صرف یہ بتاتی ہے کہ code چلا — یہ نہیں کہ نتیجہ درست تھا، اور نہ یہ کہ کوئی requirement code میں لکھنا ہی رہ گئی۔',
      'ur-Latn': 'White-box testing mein hum code ke andar dekh kar tests banate hain. <b>Statement coverage</b> batati hai ke tests ne code ke kitne percent statements kam az kam ek baar chalaye. <b>Branch coverage</b> batati hai ke har decision (if) ke true aur false dono raste chale ya nahi. Misaal: delivery fee wale function mein 6 statements aur 4 branches hain. Sirf ek test (5000, true) saare statements chala deta hai, yani 100% statement coverage, lekin false wale raste nahi chale, is liye branch coverage sirf 50% hai. Yaad rakhein: 100% branch coverage se 100% statement coverage khud ba khud mil jati hai, ulta nahi. Aur coverage sirf yeh batati hai ke code chala — yeh nahi ke result sahi tha, aur na yeh ke koi requirement code mein likhni hi reh gayi.',
      'hi': 'White-box testing में हम code के अंदर देखकर tests बनाते हैं। <b>Statement coverage</b> बताती है कि tests ने code के कितने प्रतिशत statements कम से कम एक बार चलाए। <b>Branch coverage</b> बताती है कि हर decision (if) के true और false दोनों रास्ते चले या नहीं। उदाहरण: delivery fee वाले function में 6 statements और 4 branches हैं। सिर्फ़ एक test (5000, true) सारे statements चला देता है, यानी 100% statement coverage, लेकिन false वाले रास्ते नहीं चले, इसलिए branch coverage सिर्फ़ 50% है। याद रखें: 100% branch coverage से 100% statement coverage अपने आप मिल जाती है, उल्टा नहीं। और coverage सिर्फ़ यह बताती है कि code चला — यह नहीं कि नतीजा सही था, और न यह कि कोई requirement code में लिखी ही नहीं गई।',
      'ar': 'في اختبار الصندوق الأبيض (white-box testing) ننظر داخل الكود ونصمّم الاختبارات بناءً على بنيته. <b>تغطية الجمل (statement coverage)</b> هي نسبة الجمل القابلة للتنفيذ التي شغّلتها الاختبارات مرة واحدة على الأقل. <b>تغطية الفروع (branch coverage)</b> تقيس هل جرّبنا المخرجين true وfalse لكل قرار (if). مثال: دالة رسوم التوصيل فيها 6 جمل و4 فروع. اختبار واحد (5000, true) يشغّل كل الجمل، أي تغطية جمل 100%، لكنه لا يمرّ بمسارات false، فتغطية الفروع 50% فقط. تذكّر: تغطية الفروع 100% تعني تلقائيًا تغطية جمل 100%، والعكس غير صحيح. والتغطية تخبرك أن الكود نُفِّذ، لا أن النتيجة صحيحة، ولا تكشف متطلبًا لم يُبرمَج أصلًا.',
      'es': 'En las pruebas de caja blanca (white-box testing) miramos dentro del código y diseñamos pruebas según su estructura. La <b>cobertura de sentencias</b> (statement coverage) es el porcentaje de sentencias ejecutables que las pruebas ejecutaron al menos una vez. La <b>cobertura de ramas</b> (branch coverage) mide si probamos la salida true y la salida false de cada decisión (if). Ejemplo: la función de gastos de envío tiene 6 sentencias y 4 ramas. Una sola prueba (5000, true) ejecuta todas las sentencias, es decir 100% de sentencias, pero ninguna salida false, así que la cobertura de ramas es solo 50%. Recuerda: 100% de ramas implica 100% de sentencias, no al revés. Y la cobertura dice que el código se ejecutó, no que el resultado fuera correcto ni que falte un requisito sin programar.'
    },
    keyTerms: [
      { term: 'White-box testing', def: 'Testing based on the internal structure of the code, used to design tests and measure coverage. Also called structure-based testing.' },
      { term: 'Statement coverage', def: 'Share of executable statements run by the tests: statements executed ÷ total executable statements × 100%.' },
      { term: 'Branch coverage', def: 'Share of branch outcomes exercised, such as the true and false outcome of every decision. 100% branch implies 100% statement.' },
      { term: 'Decision', def: 'A point where the code chooses between paths, such as an if, a switch case or a loop condition. Each has at least two outcomes.' },
      { term: 'Path', def: 'One complete route through the code from entry to exit. Full branch coverage does not mean every path was run.' },
      { term: 'Coverage tool', def: 'A tool such as Istanbul, JaCoCo or coverage.py that instruments code during test runs and reports what was executed.' }
    ],
    practice: [
      { q: 'Using <code>deliveryFee</code>, calculate statement and branch coverage for the single test <code>deliveryFee(2999, true)</code>. What does the function return?', hint: 'Is 2999 at least 3000? Then list the statements that run.', answer: '2999 is below 3000, so D1 is false and S3 is skipped; the member discount runs. Statements executed: S1, S2, S4, S5, S6 = <b>5 of 6 ≈ 83%</b>. Branch outcomes: D1 false and D2 true = <b>2 of 4 = 50%</b>. It returns <b>150</b> (200 − 50). Notice that 2999 is also a boundary value — white-box and black-box ideas combine well.' },
      { q: 'What is the minimum number of tests for 100% statement coverage of <code>deliveryFee</code>? And for 100% branch coverage? Give example inputs.', answer: '<b>Statement: 1 test</b> — <code>(5000, true)</code> runs both if-blocks and therefore every statement. <b>Branch: 2 tests</b> — each decision needs a true and a false outcome, and one test can take only one outcome per decision. Either <code>(5000, true)</code> + <code>(1000, false)</code> or <code>(5000, false)</code> + <code>(1000, true)</code> works. Prefer the first pair: it also runs the risky “free delivery + member” path that exposes the −50 fee.' },
      { q: 'MediBook has this check: <code>if (age &lt; 18 || !verified) { return false; } return true;</code> Give a minimal test set for 100% branch coverage, then say what it still misses.', hint: 'One decision with two outcomes — but two conditions inside it.', answer: 'Two tests are enough: <code>(16, true)</code> makes the decision true and returns false; <code>(30, true)</code> makes it false and returns true. That is 100% branch coverage, yet <code>verified = false</code> never made the decision true on its own, so a bug in the <code>!verified</code> part would go unnoticed. <b>Condition coverage</b> would add <code>(30, false)</code>. At foundation level, it is enough to know that such stronger criteria exist.' },
      { q: 'A developer says: <i>“We have 100% statement coverage, so this module is fully tested.”</i> How would you respond?', answer: 'Politely separate execution from verification. 100% statement coverage means every statement ran at least once — not that every decision outcome ran (branch coverage may be much lower), not that the tests assert the right results, and not that every path or input combination was tried. It also cannot reveal requirements that were never coded. I would check the branch figure, read a few tests for meaningful assertions, and compare the code with the acceptance criteria for anything missing.' }
    ],
    quiz: [
      { q: 'Which formula gives statement coverage?', options: ['Defective statements ÷ all executable statements × 100', 'Executed statements ÷ all executable statements × 100', 'Passed test cases ÷ all executed test cases × 100', 'Changed lines ÷ all lines in the release × 100'], correct: 1,
        why: ['That resembles defect density, not coverage — coverage measures what the tests executed, not where defects are.', 'Right — statement coverage is the share of executable statements the tests ran at least once.', 'That is a pass rate. It says nothing about how much of the code the tests reached.', 'That describes the size of a change — useful for impact analysis, but it is not coverage.'] },
      { q: 'Which statement about statement and branch coverage is true?', options: ['Any test set with 100% branch coverage also has 100% statement coverage', 'Any test set with 100% statement coverage also has 100% branch coverage', 'A test set with 100% branch coverage has run every path through the code', 'Branch coverage and statement coverage always show the same percentage'], correct: 0,
        why: ['Right — branch coverage subsumes statement coverage: if every outcome of every decision ran, every statement on those branches ran too.', 'The reverse is false: one test can run every statement of an <code>if</code> without <code>else</code> and never take its false outcome.', 'Branches are not paths. Two decisions give four paths, and full branch coverage can be reached with two tests that skip some combinations.', 'They often differ — in the lesson, one test gave 100% statement coverage but only 50% branch coverage.'] },
      { q: 'The only test for deliveryFee is deliveryFee(5000, true). Using the lesson’s counting rule, what coverage does it achieve?', options: ['100% statement and 100% branch', '67% statement and 50% branch', '50% statement and 100% branch', '100% statement and 50% branch'], correct: 3,
        why: ['Every statement runs, but both false outcomes are missing, so branch coverage cannot be 100%.', 'Those are the figures for <code>deliveryFee(1000, false)</code>, which skips S3 and S5.', 'Impossible: 100% branch coverage would imply 100% statement coverage.', 'Right — S1–S6 all run (6/6), but only D1 true and D2 true are taken (2/4).'] },
      { q: 'A ShopFlow suite reports 100% statement and 100% branch coverage. A customer then finds a wrong fee that appears only when two particular decisions are both true. What is the best explanation?', options: ['The coverage tool must have measured the code incorrectly', 'The defect sits in a statement no test ever executed', 'Branch coverage takes each outcome, not every combination', 'Statement coverage should have been measured instead'], correct: 2,
        why: ['Possible in theory, but there is a simpler, expected explanation: the numbers can be accurate while the path stays untested.', 'At 100% statement coverage every statement ran at least once, so the defect is not in unexecuted code.', 'Right — full branch coverage can be reached without running the specific path where both decisions are true, exactly as suite C + D showed.', 'Statement coverage is weaker than branch coverage; switching to it would reveal less, not more.'] },
      { q: 'The PayLite spec says refunds above Rs 10,000 need manager approval, but the developer never wrote that check. The unit tests show 100% branch coverage. Why did coverage give no warning?', options: ['Coverage measures existing code; missing code has no branches', 'Branch coverage cannot be measured on refund or payment logic', 'One more test of each true outcome would have exposed the gap', 'Requirement gaps cannot be found by any kind of testing at all'], correct: 0,
        why: ['Right — white-box coverage is blind to omissions. A black-box test derived from the requirement, such as a Rs 10,001 refund, would catch it.', 'Coverage tools work on any code; the business domain does not matter.', 'Every existing outcome was already covered; the missing check adds no branch for a test to take.', 'Black-box tests from the specification, and reviews of the code against the requirement, can find this kind of gap.'] }
    ],
    interview: [
      { q: 'What is the difference between statement coverage and branch coverage?', a: '<b>Statement coverage</b> is the percentage of executable statements the tests ran at least once. <b>Branch coverage</b> is the percentage of decision outcomes exercised — for every <code>if</code>, both the true and the false outcome. Branch coverage is stronger: 100% branch coverage guarantees 100% statement coverage, but not the reverse. Example: <code>if (total >= 3000) { fee = 0; }</code> with no else. One test with a total of 5000 runs every statement, so statement coverage is 100%, but the false outcome is never taken, so branch coverage is 50%. A bug that only shows when the block is skipped stays hidden until I add a test with, say, 1000.' },
      { q: 'Does high code coverage mean the software is well tested?', a: 'No — it is necessary but not sufficient. Coverage tells you which code ran during the tests, so low coverage clearly signals untested code. High coverage does not show that the tests checked the right results: a test with no assertions still counts. It cannot find missing functionality, because unwritten code has nothing to cover, and full branch coverage still does not exercise every path or input combination. I use coverage as a map to find untested areas and design meaningful tests for them, alongside requirements coverage and risk — not as a target to hit.' }
    ],
    takeaways: [
      'Statement coverage = statements executed ÷ executable statements × 100%.',
      'Branch coverage = decision outcomes exercised ÷ total outcomes × 100%; an <code>if</code> without <code>else</code> still has two outcomes.',
      '100% branch coverage implies 100% statement coverage — never the reverse.',
      'Coverage measures execution, not correctness: it misses untested paths, weak assertions and missing requirements.',
      'Use coverage reports as a map of untested logic, not as a target to game.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'] }
  },
  {
    id: 'mt-prioritization',
    n: 14,
    level: 'intermediate',
    title: 'Test case prioritization and checklist-based testing',
    summary: 'Decide which tests run first using risk, coverage and requirement priority, handle dependencies, test from checklists and explain what you left out.',
    minutes: 16,
    objectives: [
      'Order test cases using risk-based, coverage-based and requirements-based prioritization',
      'Adjust a priority order for dependencies and limited resources',
      'Write useful checklist items and apply checklist-based testing',
      'Explain clearly which tests you deprioritised and what risk remains'
    ],
    body: [
      { t: 'p', html: 'Imagine ShopFlow build 6.3 lands with 120 planned test cases and one working day before the release decision. You will not run everything — so the <b>order</b> of execution decides what you know when time runs out. ISTQB calls this <b>test case prioritization</b>: once test cases are assembled into test suites, the suites are arranged in a <b>test execution schedule</b> that sets the order in which they run. A good schedule means that if testing stops early, the most important information has already been gathered.' },
      { t: 'h', text: 'Three ways to order tests' },
      { t: 'table', head: ['Strategy', 'Order by', 'Best when', 'Watch out for'], rows: [
        ['<b>Risk-based</b>', 'The results of risk analysis — tests covering the most important risks run first', 'You have a current risk list for the release', 'Risks change; revisit the order when scope or code changes'],
        ['<b>Coverage-based</b>', 'Coverage achieved (code, requirements or other coverage items) — highest coverage first', 'Many tests overlap and you want broad coverage quickly', 'Broad coverage is not the same as covering what matters most'],
        ['<b>Requirements-based</b>', 'The priority stakeholders gave to the requirements each test traces to', 'Stakeholders have ranked features, e.g. Must / Should / Could', 'Needs up-to-date traceability from tests to requirements']
      ] },
      { t: 'p', html: 'Coverage-based prioritization has a smarter variant called <b>additional coverage</b> prioritization. Run the test with the highest coverage first; then, each time, pick the test that adds the most coverage <i>not yet achieved</i>. Two tests that cover the same items are redundant early on, so this variant reaches broad coverage in fewer runs. The worked example below shows the difference with real numbers. In practice teams often combine strategies — risk sets the big picture, coverage breaks ties between similar tests.' },
      { t: 'h', text: 'Dependencies and resources' },
      { t: 'p', html: 'A perfect priority list can still be impossible to execute. If a high-priority test <b>depends</b> on a lower-priority one, the lower-priority test must run first: on PayLite, “Refund a split payment” (high) needs a completed payment created by “Pay a bill” (medium). The order must also respect <b>resource availability</b> — a payment sandbox open only from 2 to 4 pm, the single Android device with NFC, or a specialist who is free only on Thursday. Schedule around those windows instead of letting a strict priority list leave people idle.' },
      { t: 'p', html: 'When time is short, a dependable order is: <b>smoke</b> test the build first (if it fails, nothing else is worth running); then the <b>critical path</b> — the end-to-end journeys the business cannot lose, such as sign-up, log-in and checkout; then <b>changed and high-risk areas</b>; then modules with a history of defects; and only then lower-priority requirements and polish. The visual guide shows this order as a timeline you can reuse on any release.' },
      { t: 'h', text: 'Checklist-based testing' },
      { t: 'p', html: 'In <b>checklist-based testing</b>, the tester designs, implements and executes tests to cover the test conditions on a checklist. Checklists are built from experience, from knowledge of what matters to users, and from an understanding of why and how software fails. They are especially useful when there are no detailed test cases: they give guidance and some consistency. Because high-level items leave room for interpretation, two testers may test them differently — potentially more coverage, but less repeatability.' },
      { t: 'compare', a: { title: 'Weak checklist items', items: ['“Is the app of good quality?” — too general to check', '“Do all unit tests pass in CI?” — a tool already checks it automatically', '“Is the build deployed to staging?” — an entry criterion, not a test condition', 'A 200-item list that nobody ever finishes'] }, b: { title: 'Good checklist items', items: ['Phrased as a question: “Does every error message say how to fix the problem?”', 'Each item can be checked separately and directly', 'Covers requirements, UI properties or quality characteristics such as usability', 'Short enough to use, and updated after defect analysis'] } },
      { t: 'callout', tone: 'tip', title: 'Keep checklists alive', html: 'Items lose power over time because developers learn to avoid the same mistakes. After each release, add items for new high-severity defects and remove items that never find anything, so the list stays short and sharp. A ShopFlow item born from a real bug: <i>“Does the cart total update after removing the last item?”</i>' },
      { t: 'h', text: 'Explaining what you deprioritised' },
      { t: 'p', html: 'Deprioritising a test is a decision about risk, so it must be visible. Never quietly drop tests or count them as passed. List what was not run, say what risk that leaves, and let the person who owns the release decision — usually the product owner or release manager — accept it or give more time. Saying this <b>before</b> the deadline turns “QA didn’t test it” into a shared, informed choice.' },
      { t: 'callout', tone: 'key', title: 'A status message that works', html: '“Ran 82 of 120 tests: smoke, checkout, payments and the new wishlist all pass. <b>Not run:</b> 38 low-risk tests on profile settings and theme colours. <b>Residual risk:</b> cosmetic or settings issues could reach users; nothing touching money or data. <b>Recommendation:</b> release and finish the remaining tests on Monday — or give us half a day more.”' }
    ],
    example: {
      title: 'Worked example: ordering tests for a PayLite release with half a day left',
      blocks: [
        { t: 'p', html: 'PayLite 3.2 adds <b>split bill</b>, with six acceptance criteria R1–R6, and changes the transfer fee calculation. Five candidate split-bill tests exist. The tester first compares two coverage-based orders using R1–R6 as coverage items.' },
        { t: 'table', caption: 'Ties are kept in test ID order', head: ['Test', 'Covers', 'Total-coverage order', 'Additional-coverage order'], rows: [
          ['T1', 'R1, R2, R3, R4', '1st (4 items)', '1st — adds R1–R4'],
          ['T2', 'R3, R4, R5', '2nd (3 items)', '3rd — adds nothing new'],
          ['T3', 'R1, R2', '3rd (2 items)', '4th — adds nothing new'],
          ['T4', 'R5, R6', '4th (2 items)', '2nd — adds R5 and R6'],
          ['T5', 'R6', '5th (1 item)', '5th — adds nothing new']
        ] },
        { t: 'p', html: 'By total coverage, the first two tests (T1, T2) cover R1–R5 and leave R6 untested. By additional coverage, T1 then T4 cover <b>all six</b> criteria in two runs, because T4 adds two new items while T2 would add only one. Once everything is covered, the remaining tests follow by total coverage. Then the tester builds the full schedule, respecting risk and dependencies:' },
        { t: 'table', head: ['Order', 'Test group', 'Reason'], rows: [
          ['1', 'Smoke: log in, balance, send money', 'Is the build testable at all?'],
          ['2', 'Transfer fee calculation', 'Changed code that moves money — highest risk'],
          ['3', 'Pay a bill (creates a payment)', 'Medium priority, but the refund test depends on it'],
          ['4', 'Refund a split payment', 'High risk; runs straight after its dependency'],
          ['5', 'Split bill: T1, then T4', 'Must-have requirement, in additional-coverage order'],
          ['6', 'Checklist sweep of the new screens', 'Quick consistency pass if time allows'],
          ['Not run', 'T2, T3, T5; theme and profile tests', 'Listed with residual risk for the product owner’s decision']
        ] },
        { t: 'p', html: 'By 5 pm the tester had finished step 6. The report named every test that was not run and why it was judged low risk; the product owner accepted releasing, with the remaining tests scheduled for the next morning.' }
      ]
    },
    explain: {
      'ur': 'جب وقت کم ہو تو سارے test cases نہیں چل سکتے، اس لیے یہ فیصلہ کہ <b>پہلے کیا چلے</b> بہت اہم ہے۔ تین عام طریقے ہیں: <b>risk-based</b> یعنی سب سے زیادہ risk والے tests پہلے؛ <b>coverage-based</b> یعنی جو test سب سے زیادہ نئی coverage دے وہ پہلے؛ اور <b>requirements-based</b> یعنی جس requirement کو stakeholders نے سب سے اہم کہا اس کے tests پہلے۔ Dependency کا خیال رکھیں: refund کا اہم test تبھی چلے گا جب order بنانے والا test پہلے چل چکا ہو۔ مثال: release سے دو گھنٹے پہلے build آئی — پہلے smoke test، پھر login اور checkout جیسے critical راستے، پھر بدلے ہوئے اور risky حصے۔ آخر میں جو tests نہیں چلے ان کی list اور ان کا risk صاف صاف report کریں تاکہ فیصلہ product owner کرے۔',
      'ur-Latn': 'Jab waqt kam ho to saare test cases nahi chal sakte, is liye yeh faisla ke <b>pehle kya chale</b> bohat ahem hai. Teen aam tareeqe hain: <b>risk-based</b> yani sab se zyada risk wale tests pehle; <b>coverage-based</b> yani jo test sab se zyada nayi coverage de woh pehle; aur <b>requirements-based</b> yani jis requirement ko stakeholders ne sab se ahem kaha uske tests pehle. Dependency ka khayal rakhein: refund ka ahem test tabhi chalega jab order banane wala test pehle chal chuka ho. Misaal: release se do ghante pehle build aayi — pehle smoke test, phir login aur checkout jaise critical raste, phir badle hue aur risky hisse. Aakhir mein jo tests nahi chale unki list aur unka risk saaf saaf report karein taake faisla product owner kare.',
      'hi': 'जब समय कम हो तो सारे test cases नहीं चल सकते, इसलिए यह फ़ैसला कि <b>पहले क्या चले</b> बहुत अहम है। तीन आम तरीके हैं: <b>risk-based</b> यानी सबसे ज़्यादा risk वाले tests पहले; <b>coverage-based</b> यानी जो test सबसे ज़्यादा नई coverage दे वह पहले; और <b>requirements-based</b> यानी जिस requirement को stakeholders ने सबसे अहम कहा उसके tests पहले। Dependency का ध्यान रखें: refund का अहम test तभी चलेगा जब order बनाने वाला test पहले चल चुका हो। उदाहरण: release से दो घंटे पहले build आई — पहले smoke test, फिर login और checkout जैसे critical रास्ते, फिर बदले हुए और risky हिस्से। आख़िर में जो tests नहीं चले उनकी list और उनका risk साफ़-साफ़ report करें ताकि फ़ैसला product owner ले।',
      'ar': 'عندما يكون الوقت ضيقًا لا يمكن تشغيل كل حالات الاختبار، لذلك يصبح <b>ترتيب التنفيذ</b> قرارًا مهمًا. هناك ثلاث طرق شائعة: <b>حسب المخاطر</b> (risk-based) فتُشغَّل الاختبارات الأعلى خطرًا أولًا؛ و<b>حسب التغطية</b> (coverage-based) فيأتي أولًا الاختبار الذي يضيف أكبر تغطية جديدة؛ و<b>حسب المتطلبات</b> (requirements-based) فتُقدَّم اختبارات المتطلبات التي يراها أصحاب المصلحة الأهم. انتبه للاعتماديات: اختبار الاسترداد المهم لا يعمل إلا بعد اختبار إنشاء الطلب. مثال: وصل الإصدار قبل ساعتين من الإطلاق — ابدأ بـ smoke test، ثم المسارات الحرجة مثل تسجيل الدخول والدفع، ثم الأجزاء المتغيّرة والخطرة. وفي النهاية اذكر بوضوح الاختبارات التي لم تُنفَّذ والمخاطر المتبقية، ليتخذ مالك المنتج القرار.',
      'es': 'Cuando el tiempo es corto no se pueden ejecutar todos los casos de prueba, así que el <b>orden</b> es una decisión clave. Hay tres estrategias comunes: <b>basada en riesgo</b> (primero las pruebas de mayor riesgo), <b>basada en cobertura</b> (primero la prueba que aporta más cobertura nueva) y <b>basada en requisitos</b> (primero las pruebas de los requisitos que los interesados consideran más importantes). Cuidado con las dependencias: la prueba de reembolso, aunque sea prioritaria, necesita antes la prueba que crea el pedido. Ejemplo: el build llega dos horas antes del lanzamiento — primero un smoke test, luego los caminos críticos como login y checkout, y después las zonas cambiadas y de riesgo. Al final informa con claridad qué pruebas no se ejecutaron y qué riesgo queda, para que decida el product owner.'
    },
    keyTerms: [
      { term: 'Test case prioritization', def: 'Deciding the order in which test cases run, so the most important information arrives first if time runs out.' },
      { term: 'Test execution schedule', def: 'The planned order of test suites and procedures, taking priority, dependencies and available resources into account.' },
      { term: 'Additional coverage prioritization', def: 'Run the highest-coverage test first, then repeatedly the test that adds the most coverage not yet achieved.' },
      { term: 'Checklist-based testing', def: 'An experience-based technique in which the tester covers the test conditions listed on a checklist, often phrased as questions.' },
      { term: 'Critical path', def: 'The end-to-end user journeys the business cannot afford to break, such as log-in, checkout and payment.' },
      { term: 'Residual risk', def: 'The risk that remains after testing, including the risk carried by tests that were not run.' }
    ],
    practice: [
      { q: 'Four tests and coverage items A–F: <b>T1</b> covers A, B, C · <b>T2</b> covers C, D · <b>T3</b> covers A, B · <b>T4</b> covers D, E, F. Order them by additional coverage.', hint: 'Start with the highest coverage, then always pick the test that adds the most new items.', answer: 'T1 and T4 both cover 3 items; take T1 first (break ties by ID). Still uncovered: D, E, F. T4 adds 3, T2 adds 1, T3 adds 0 → <b>T4</b> runs second, and all six items are covered after just two tests. The rest follow by total coverage: <b>T2</b>, then <b>T3</b> (both cover 2; tie broken by ID). Order: <b>T1, T4, T2, T3</b>.' },
      { q: 'MediBook priorities: “Cancel an appointment” (high), “Book an appointment” (medium), “Change profile photo” (low), “Doctor approves booking” (high). Cancelling needs a booked and approved appointment. Put them in execution order.', answer: '<b>Book an appointment</b> (medium, but a dependency) → <b>Doctor approves booking</b> (high) → <b>Cancel an appointment</b> (high) → <b>Change profile photo</b> (low). The two high-priority tests depend on the medium one, so it must run first. Priority decides the order only among tests that are free to run.' },
      { q: 'Write five checklist items for testing any new form in PeopleOps.', hint: 'Phrase each one as a question that can be checked directly and on its own.', answer: 'For example: Does every field have a visible label? Are required fields marked before the user submits? Does each error appear next to its field and say how to fix it? Is the entered data kept after a validation error? Can the whole form be completed with the keyboard alone? Are leading and trailing spaces trimmed from text fields? Each is a separate question with a clear yes/no answer — unlike “Is the form user-friendly?”.' },
      { q: 'The release is in two hours and you have run 60% of the plan. Write the message you would send to the product owner.', answer: 'Something like: “Status for ShopFlow 6.3: smoke, checkout, payments and the changed coupon logic are tested and passing. Not run: 48 tests on account settings, wishlists and email templates (low to medium risk). Residual risk: issues there could reach users, but none touch payments or stored data. Options: release now and finish the rest tomorrow morning, or delay two hours for the medium-risk wishlist tests. I recommend releasing — your call.” It states what ran, what did not, the risk, and who decides.' }
    ],
    quiz: [
      { q: 'In coverage-based prioritization using the “additional coverage” variant, which test runs second?', options: ['The test with the second-highest total coverage', 'The test that covers the most business-critical requirement', 'The test that adds the most coverage not yet achieved', 'The test that takes the shortest time to execute'], correct: 2,
        why: ['That is plain total-coverage ordering, which may pick a test that overlaps heavily with the first one.', 'That describes requirements-based prioritization, a different strategy.', 'Right — after the highest-coverage test, each next test is the one adding the most new coverage.', 'Execution time can matter in scheduling, but it is not the rule of the additional coverage variant.'] },
      { q: 'On ShopFlow, “Refund a delivered order” has high priority and “Place an order” has medium priority. The refund test needs an order created by the other test. How should they be scheduled?', options: ['Refund first, because high priority always runs before medium', 'Skip the refund test until a later test cycle is planned', 'Lower the refund test to medium so the priorities match', 'Place an order first, because the refund test depends on it'], correct: 3,
        why: ['Priority orders only the tests that can run. Without an order to refund, the high-priority test cannot even start.', 'Skipping the highest-priority test would leave the riskiest area untested for no good reason.', 'The refund is still high risk; changing its label hides that instead of solving the ordering problem.', 'Right — a lower-priority test that a higher-priority test depends on must be executed first.'] },
      { q: 'Which item is best suited to a checklist used for checklist-based testing?', options: ['Is the application of good overall quality for users?', 'Does each error message explain how to fix it?', 'Do all unit tests pass in the CI pipeline?', 'Has the build been deployed to staging yet?'], correct: 1,
        why: ['Too general — two testers could not check it directly or agree on the answer.', 'Right — a specific question that can be checked directly and separately, on any screen.', 'Automation already checks this; checklist items should be things a human tester verifies.', 'That is an entry criterion for testing, not a test condition.'] },
      { q: 'ShopFlow build 6.3 reaches the test environment two hours before the release meeting. Which tests should run first?', options: ['A smoke test of log-in, search, cart and checkout', 'The full regression suite in alphabetical order', 'Exploratory testing of the new wishlist colours', 'The low-risk tests first, because they finish fastest'], correct: 0,
        why: ['Right — first confirm the build is testable; if smoke fails, every other result would be wasted effort.', 'Alphabetical order ignores risk, and a full run will not fit into two hours.', 'Cosmetic changes are low risk; they can wait until the critical paths are confirmed.', 'Speed is not importance. Running easy tests first leaves the riskiest areas unknown when time runs out.'] },
      { q: 'You ran 70 of 100 planned tests before the deadline. What is the best way to handle the 30 you deprioritised?', options: ['Mark them as passed, because they were low priority', 'Leave them out of the report so it stays short and clear', 'Report just the pass rate of the 70 tests that were executed', 'List them with their risk and let the release owner decide'], correct: 3,
        why: ['Untested is not passed. Marking them passed misreports the state of the product.', 'Hiding them removes exactly the information the release decision needs.', 'A pass rate of executed tests hides the 30 that never ran; report against the plan too.', 'Right — make the gap and its residual risk visible; the release owner accepts it or gives more time.'] }
    ],
    interview: [
      { q: 'You only have time to run half of your test cases before a release. How do you decide which ones to run?', a: 'I order them so the most important information comes first. First a <b>smoke test</b> to confirm the build is testable. Then the <b>critical path</b> — journeys the business cannot lose, like log-in, checkout and payment. Next, <b>changed and high-risk areas</b>, using the risk list and the requirement priorities set by the product owner; among similar tests I prefer those that add the most new coverage. I respect dependencies — setup tests run before the high-priority tests that need them — and resources such as sandboxes or devices. Finally, I report exactly which tests were not run and what risk that leaves, so the release owner makes an informed decision.' },
      { q: 'What is checklist-based testing, and when is it useful?', a: 'It is an experience-based technique: the tester designs and runs tests to cover the conditions on a checklist, usually items phrased as questions — “Does every error message say how to fix the problem?” Good items can each be checked directly; they are not things automation already checks, not entry criteria and not vague goals. It is useful when there are no detailed test cases, for recurring checks on new screens, and for non-functional areas such as usability heuristics. The trade-off: high-level items give variety but less repeatability. I keep checklists short and update them after defect analysis, adding items for new serious bugs.' }
    ],
    takeaways: [
      'Order tests so the most important information arrives first if time runs out.',
      'Prioritise by risk, by coverage (additional coverage reaches breadth fastest) or by requirement priority.',
      'Dependencies and resource windows can override a pure priority order.',
      'Good checklist items are questions you can check directly, one at a time — keep the list short and updated.',
      'Always report what you did not run and the risk it leaves; the release owner decides.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'], interview: ['m1', 'm6'] }
  }
]);

QA_CONTENT.addBank('manual', [
  { level: 'intermediate', topic: 'mt-whitebox',
    q: 'A function contains a single if statement with no else. How many outcomes must the tests take for 100% branch coverage of that decision?',
    options: ['One — only the true outcome exists without an else', 'Three — true, false and the statement after the if', 'Two — the true outcome and the false outcome', 'None — a decision without an else has no branches'], correct: 2,
    why: ['The false outcome exists even without an else: control jumps past the block. Missing it is the classic statement-vs-branch gap.', 'The statement after the if is reached by both outcomes; it is not a separate outcome of the decision.', 'Right — every decision has a true and a false outcome, whether or not an else is written.', 'An if always creates two outcomes; the else keyword only adds code to the false one.'] },
  { level: 'intermediate', topic: 'mt-whitebox',
    q: 'A unit test runs 5 of a function’s 6 executable statements and takes 2 of its 4 branch outcomes. What should the coverage report show?',
    options: ['100% statement coverage and 50% branch coverage', 'About 83% statement coverage and 50% branch coverage', 'About 83% statement coverage and 75% branch coverage', 'About 67% statement coverage and 25% branch coverage'], correct: 1,
    why: ['One statement never ran, so statement coverage cannot be 100%.', 'Right — 5 ÷ 6 ≈ 83% statement coverage and 2 ÷ 4 = 50% branch coverage.', 'The statement figure is right, but 2 of 4 outcomes is 50%, not 75%.', 'These would be 4 of 6 statements and 1 of 4 outcomes — not what was measured.'] },
  { level: 'intermediate', topic: 'mt-prioritization',
    q: 'Requirements-based prioritization orders test cases by what?',
    options: ['How many defects each test found in earlier releases', 'How long each test case takes to execute', 'How much statement coverage each test achieves', 'The priority stakeholders gave the linked requirement'], correct: 3,
    why: ['Defect history can inform risk, but it is not the basis of requirements-based prioritization.', 'Duration may affect scheduling, but it is not what this strategy orders by.', 'That is coverage-based prioritization.', 'Right — tests inherit the priority of the requirements they trace to, as set by stakeholders.'] },
  { level: 'intermediate', topic: 'mt-prioritization',
    q: 'A payment sandbox is only available from 2 pm to 4 pm, and your highest-risk test needs it. It is 10 am. What is the sensible plan?',
    options: ['Run other high-risk tests now; book the payment test for 2 pm', 'Wait until 2 pm so execution follows the priority list exactly', 'Mark the payment test as blocked and skip it for this release', 'Run the payment test now against the live production gateway'], correct: 0,
    why: ['Right — resource availability is part of scheduling: plan around the window and keep testing meanwhile.', 'Leaving the team idle for four hours wastes testing time; priority order does not require idling.', 'The test can run today inside the window — skipping it drops the riskiest check for no reason.', 'Testing against live production payments is risky and usually forbidden; use the sandbox window.'] }
]);

QA_CONTENT.addDrills('manual', [
  {
    id: 'mt-d8', type: 'fill', level: 'intermediate',
    title: 'Fill in the coverage percentages',
    prompt: 'ShopFlow’s deliveryFee(total, isMember) has six executable statements: S1 fee = 200; S2 if (total >= 3000), decision D1; S3 fee = 0; S4 if (isMember), decision D2; S5 fee = fee - 50; S6 return fee. Count S1–S6 as the statements and the true and false outcomes of D1 and D2 as 4 branches. Type each answer as a percentage (whole numbers are fine).',
    fields: [
      { label: 'deliveryFee(1000, false) alone: statement coverage', accept: ['67', '67%', '67 %', '66.7', '66.7%', '66.7 %', '66.67', '66.67%', '66.67 %'], why: '1000 is below 3000 and the customer is not a member, so S3 and S5 are skipped. S1, S2, S4 and S6 run: 4 ÷ 6 ≈ <b>67%</b>.' },
      { label: 'deliveryFee(1000, false) alone: branch coverage', accept: ['50', '50%', '50 %'], why: 'Only D1 false and D2 false are taken: 2 of 4 outcomes = <b>50%</b>.' },
      { label: 'deliveryFee(5000, true) alone: statement coverage', accept: ['100', '100%', '100 %'], why: 'Both if-blocks run, so all six statements execute: 6 ÷ 6 = <b>100%</b>.' },
      { label: 'deliveryFee(5000, true) alone: branch coverage', accept: ['50', '50%', '50 %'], why: 'Only D1 true and D2 true are taken: 2 of 4 = <b>50%</b>. Full statement coverage, half the branches.' },
      { label: 'Both tests together: branch coverage', accept: ['100', '100%', '100 %'], why: 'Together they take D1 true, D1 false, D2 true and D2 false: 4 of 4 = <b>100%</b> — and therefore 100% statement coverage too.' }
    ]
  }
]);

QA_CONTENT.addVisuals({
  'mt-whitebox': [
    { t: 'flowchart', title: 'Control flow of deliveryFee()', dir: 'down',
      nodes: [
        { id: 'start', label: 'Call deliveryFee(total, isMember)', kind: 'start' },
        { id: 's1', label: 'S1: fee = 200' },
        { id: 'd1', label: 'S2 / D1: total >= 3000?', kind: 'decision' },
        { id: 's3', label: 'S3: fee = 0' },
        { id: 'd2', label: 'S4 / D2: isMember?', kind: 'decision' },
        { id: 's5', label: 'S5: fee = fee - 50' },
        { id: 's6', label: 'S6: return fee', kind: 'end' }
      ],
      edges: [
        { from: 'start', to: 's1' },
        { from: 's1', to: 'd1' },
        { from: 'd1', to: 's3', label: 'True' },
        { from: 'd1', to: 'd2', label: 'False' },
        { from: 's3', to: 'd2' },
        { from: 'd2', to: 's5', label: 'True' },
        { from: 'd2', to: 's6', label: 'False' },
        { from: 's5', to: 's6' }
      ],
      caption: 'Each decision has a True and a False edge, even without an else. One test can follow both True edges and visit every box (100% statement coverage) while both False edges stay untested.' },
    { t: 'matrix', title: 'Which test takes which branch outcome?',
      x: { label: 'Branch outcome', ticks: ['D1 true', 'D1 false', 'D2 true', 'D2 false'] },
      y: { label: 'Test input', ticks: ['(1000, false)', '(5000, true)', '(5000, false)', '(1000, true)'] },
      cells: [
        ['—', 'Taken', '—', 'Taken'],
        ['Taken', '—', 'Taken', '—'],
        ['Taken', '—', '—', 'Taken'],
        ['—', 'Taken', 'Taken', '—']
      ],
      tones: [
        ['none', 'high', 'none', 'high'],
        ['high', 'none', 'high', 'none'],
        ['high', 'none', 'none', 'high'],
        ['none', 'high', 'high', 'none']
      ],
      caption: 'Rows 1 + 2 and rows 3 + 4 each fill all four columns, so both pairs reach 100% branch coverage. Only row 2 takes D1 true together with D2 true — the path that returns a −50 fee.' }
  ],
  'mt-prioritization': [
    { t: 'matrix', title: 'Ordering tests by risk and effort',
      x: { label: 'Effort to run', ticks: ['Low effort', 'High effort'] },
      y: { label: 'Risk if it fails', ticks: ['High risk', 'Medium risk', 'Low risk'] },
      cells: [
        ['Run first', 'Run early; split or automate'],
        ['Run next', 'Run if time allows'],
        ['Quick checklist sweep', 'Defer and report as not run']
      ],
      tones: [
        ['high', 'high'],
        ['mid', 'mid'],
        ['low', 'low']
      ],
      caption: 'Risk decides the row; effort only breaks ties inside a row. A slow high-risk test is never dropped for being slow — it is scheduled early, split into smaller checks or automated.' },
    { t: 'timeline', title: 'Execution order when time is short',
      items: [
        { label: 'Smoke test the build', sub: 'If it fails, reject the build — nothing else is worth running' },
        { label: 'Critical-path journeys', sub: 'Sign-up, log-in, checkout, payment: what the business cannot lose' },
        { label: 'Changed and high-risk areas', sub: 'New code, money, personal data, security' },
        { label: 'Dependent tests in order', sub: 'Setup tests run before the high-priority tests that need them' },
        { label: 'Lower-priority requirements', sub: 'Then checklist and exploratory sweeps if time allows' },
        { label: 'Report what was not run', sub: 'Deferred tests, residual risk and who decides' }
      ],
      caption: 'Stopping at any point still leaves you with the most valuable information gathered so far. The last step is never optional: what you did not test must be visible.' }
  ]
});

/* ---- mt-config-env · environments, configuration management and test data (+ drill mt-d7) ---- */
QA_CONTENT.addLessons('manual', [
  {
    id: 'mt-config-env',
    n: 15,
    level: 'intermediate',
    title: 'Test environments, configuration management and test data',
    summary: 'Know exactly which build, configuration and data you tested, keep environments trustworthy, and tell an environment problem from a product defect.',
    minutes: 18,
    objectives: [
      'Explain configuration management, configuration items and baselines in testing',
      'Describe dev, test, staging and production environments and why parity with production matters',
      'Choose between synthetic and masked production test data while protecting privacy',
      'Tell an environment issue or test data issue from a product defect and report each correctly'
    ],
    body: [
      { t: 'p', html: '“It passed on QA” is only useful if everyone knows <i>what</i> passed. A test result describes one specific combination: a <b>build</b> of the software, an <b>environment</b> it ran on, a <b>configuration</b> (settings, feature flags, connected services) and a set of <b>test data</b>. Change any one of them and the result may change too. Testers who track these four things can reproduce failures, explain surprises and avoid the classic argument where a developer says “works on my machine” and both sides are right.' },
      { t: 'p', html: 'The discipline that keeps this under control is <b>configuration management (CM)</b>. In testing, CM identifies, controls and tracks work products as <b>configuration items</b>: the test items themselves (the parts of the test object, such as an app build or an API version) and the testware — test plans, test cases, scripts, test data, results, logs and reports. For a complex item such as a test environment, CM records what it consists of, how the parts relate and which versions are used. Once a configuration is approved for testing it becomes a <b>baseline</b>: it changes only through formal change control, and you can return to an earlier baseline to reproduce earlier results.' },
      { t: 'table', caption: 'Configuration items for a PayLite wallet release', head: ['Configuration item', 'PayLite example', 'How it is identified'], rows: [
        ['Test item: mobile app', 'PayLite Android app', 'Version <code>3.5.0</code>, build <code>812</code>, Git commit <code>a1b2c3d</code>'],
        ['Test item: backend service', 'Payments API', 'Image tag <code>payments-api:2.9.1</code>'],
        ['Configuration', 'Feature flags and settings', 'Config file versioned in Git; flag <code>instantTransfer = on</code>'],
        ['Testware', 'Test cases and automation scripts', 'Test case set v12 in the test management tool; scripts tagged with the release'],
        ['Test data', 'Seed data for wallets and limits', '<code>seed-v7.sql</code>, versioned next to the scripts'],
        ['Test environment', 'Staging', 'Environment definition listing OS, database, service versions and settings']
      ] },
      { t: 'callout', tone: 'key', title: 'What CM guarantees for testing', html: 'Every configuration item — including each test item — is <b>uniquely identified</b>, <b>version controlled</b>, <b>tracked for changes</b> and <b>related</b> to other items, so traceability survives the whole test process. Test documentation refers to items unambiguously: “build 812 on staging with seed-v7”, never “the latest build”. In CI/CD pipelines much of this is automated — each pipeline run records the commit, the artefact version and the configuration it used.' },
      { t: 'h', text: 'Environments, parity and release notes' },
      { t: 'table', head: ['Environment', 'Main purpose', 'Typical users', 'Typical data'], rows: [
        ['<b>Development</b>', 'Build and debug; unit and component tests', 'Developers', 'Small fake data sets, mocks and stubs'],
        ['<b>Test / QA</b>', 'Functional, integration and regression testing of new builds', 'Testers, automation suites', 'Synthetic or masked data that can be reset'],
        ['<b>Staging / pre-production</b>', 'Final checks of the release candidate in a production-like setup: UAT, performance, deployment rehearsal', 'QA, product owner, business users, operations', 'Production-like volume and shape, masked or synthetic'],
        ['<b>Production</b>', 'Real users doing real work', 'Customers; the team monitors and runs agreed smoke checks after deployment', 'Real data — test only with safe, agreed checks']
      ] },
      { t: 'p', html: '<b>Environment parity</b> means staging mirrors production as closely as is practical: the same operating system, runtime and database versions, the same configuration structure, similar infrastructure (load balancer, caching, CDN) and data of a realistic shape and size. Every difference is a place where defects can hide. If staging runs one application server and production runs three behind a load balancer, a session bug may only appear in production. When parity is not possible — cost, a smaller database, a third-party sandbox instead of the real gateway — write the known differences into the test plan as risks.' },
      { t: 'cards', items: [
        { title: 'Build identity', html: 'Version, build number and commit. Confirm on the <b>About</b> screen or a version endpoint that the environment really runs this build before you start.' },
        { title: 'What changed', html: 'Stories and fixes included, with ticket IDs. Fixed bugs need a <b>retest</b>; new stories need new tests; changed areas need regression.' },
        { title: 'Known issues', html: 'Problems the team already knows about. Check here before logging a duplicate, and include them in your test report.' },
        { title: 'Config and migrations', html: 'New environment variables, feature flags or database migrations. They tell you what the environment and test data need before testing can start.' }
      ] },
      { t: 'h', text: 'Test data management' },
      { t: 'compare', a: { title: 'Synthetic test data', items: ['Created by scripts, generators or fixtures — no real person behind any record', 'Privacy-safe by design', 'Edge cases can be built on purpose: boundary values, O’Brien, José, rare account states', 'Easy to reset and to version together with the tests', 'May miss the messiness of real data: legacy records, odd formats, real volume'] }, b: { title: 'Masked production data', items: ['A copy of real data with personal fields replaced by realistic fake values', 'Real distributions, legacy oddities and volume', 'Masking must be complete — one missed column leaks personal data', 'Masking must keep formats and relationships: the same customer gets the same fake ID in every table', 'Needs approval, restricted access and a refresh and deletion plan'] } },
      { t: 'callout', tone: 'warn', title: 'Never copy raw personal data into test environments', html: 'Names, national ID numbers (such as CNIC), phone numbers, salaries, medical records and card numbers do not belong in a test database unless they are masked and the copy is approved. Privacy laws such as the EU GDPR and company policy apply to test copies too, and pseudonymised data that can be linked back to a person is often still treated as personal data. For payments, use the test card numbers that payment providers publish for their sandboxes — never real cards.' },
      { t: 'h', text: 'Environment issue or product defect?' },
      { t: 'p', html: 'When a test fails unexpectedly, check the setup before blaming the code. Is the deployed build the one in the release notes? Are the services it depends on healthy, and is the configuration what you expect? Is the test data in the right state? Does the failure reproduce on a clean, correctly deployed environment with fresh data? If the environment is at fault, mark the affected tests <b>Blocked</b> (not Failed), raise it with whoever owns the environment and record the lost time. Remember one exception: configuration that <b>ships with the release</b> is part of the product, so a wrong production setting is a defect.' },
      { t: 'table', head: ['What you saw', 'What was really wrong', 'Classification'], rows: [
        ['Every checkout test on staging returns <code>503 Service Unavailable</code>', 'The inventory service was not redeployed after a config change', 'Environment issue'],
        ['The feature in the release notes is missing on QA', 'QA still runs yesterday’s build; the deployment job failed', 'Environment (deployment) issue'],
        ['The login test fails with “Account locked”', 'Another tester used the same shared account and locked it', 'Test data issue'],
        ['A coupon test fails on every environment', 'The seed data hard-codes an expiry date that has now passed', 'Test data issue'],
        ['Saving the surname O’Brien gives a 500 error on every healthy environment', 'The API does not escape the apostrophe', 'Product defect'],
        ['Release 3.5 sends live payments to the sandbox gateway', 'The production config file shipped with the release has the wrong URL', 'Product defect (shipped configuration)']
      ] }
    ],
    example: {
      title: 'Worked example: PayLite transfers fail on staging — environment or defect?',
      blocks: [
        { t: 'p', html: '<b>Situation:</b> release candidate <code>3.5.0-rc2</code> is deployed to staging in the morning. Twelve automated transfer tests fail with <code>500 Internal Server Error</code>. Yesterday the same tests passed on the QA environment with <code>rc1</code>. The release review is tomorrow. The tester works through the setup before logging anything.' },
        { t: 'table', head: ['Check', 'What the tester found', 'Conclusion'], rows: [
          ['1. Build identity', 'The version endpoint reports <code>3.5.0-rc2</code>, matching the release notes, which add a new fraud-check service', 'Right build — keep going'],
          ['2. Service health', 'The fraud-check health endpoint does not respond; the service is missing from the staging deployment', 'Environment issue: tests marked Blocked, DevOps informed'],
          ['3. Logs', 'Payments API log: <code>connection refused fraud-check:8080</code>', 'Confirms the cause'],
          ['4. Re-run after DevOps deploys the service', '11 tests pass. One still fails: a transfer of exactly 50,000 PKR is rejected, although the daily limit is 50,000 PKR inclusive', 'Product defect — reproduces on a healthy environment']
        ] },
        { t: 'code', lang: 'text', title: 'Environment section of the bug report', code: `Title:        Transfer of exactly the daily limit (50,000 PKR) is rejected
Build:        PayLite payments-api 2.9.1, app 3.5.0-rc2 (build 812)
Environment:  Staging, all services healthy (checked 10:40)
Config:       instantTransfer = on, dailyLimit = 50000
Test data:    seed-v7, wallet W-1042 with 0 PKR sent today
Steps:        Send 50,000 PKR from W-1042 to W-2001
Expected:     Transfer succeeds (limit is inclusive, PL-311 AC2)
Actual:       "Daily limit exceeded"; no transfer created` },
        { t: 'p', html: 'Notice what the tester did <b>not</b> do: log twelve bugs against the product. The outage was reported once, to the people who own the environment, and the affected tests were marked Blocked so the pass rate was not distorted. The one real defect was reported with the exact build, environment, configuration and data, so a developer can reproduce it next week — even after rc3 has replaced rc2. The test summary also notes the three hours lost to the environment.' }
      ]
    },
    explain: {
      'ur': 'کسی test کا نتیجہ تبھی معنی رکھتا ہے جب آپ کو پتا ہو کہ آپ نے <b>کون سا build</b>، کس <b>environment</b> پر، کس configuration اور کس test data کے ساتھ ٹیسٹ کیا۔ Configuration management ہر چیز کو ایک ID اور version دیتا ہے، اور approved حالت کو baseline کہتے ہیں جو صرف change control کے ذریعے بدلتی ہے۔ عام طور پر dev، test، staging اور production environments ہوتے ہیں؛ staging جتنا production جیسا ہو اتنا بہتر۔ Test data کے لیے synthetic data سب سے محفوظ ہے؛ اصلی data صرف masking اور اجازت کے بعد استعمال کریں۔ مثال: staging پر تمام payment tests کو 503 error ملتا ہے کیونکہ ایک service deploy ہی نہیں ہوئی — یہ environment issue ہے، product bug نہیں۔ ایسے tests کو Blocked لکھیں اور DevOps کو بتائیں۔',
      'ur-Latn': 'Kisi test ka result tabhi maayne rakhta hai jab aap ko pata ho ke aap ne <b>kaun sa build</b>, kis <b>environment</b> par, kis configuration aur kis test data ke saath test kiya. Configuration management har cheez ko ek ID aur version deta hai, aur approved state ko baseline kehte hain jo sirf change control ke zariye badalti hai. Aam tor par dev, test, staging aur production environments hote hain; staging jitna production jaisa ho utna behtar. Test data ke liye synthetic data sab se mehfooz hai; asli data sirf masking aur ijazat ke baad use karein. Misaal: staging par saare payment tests ko 503 error milta hai kyunke ek service deploy hi nahi hui — yeh environment issue hai, product bug nahi. Aise tests ko Blocked mark karein aur DevOps ko batayein.',
      'hi': 'किसी test का नतीजा तभी मायने रखता है जब आपको पता हो कि आपने <b>कौन-सा build</b>, किस <b>environment</b> पर, किस configuration और किस test data के साथ टेस्ट किया। Configuration management हर चीज़ को एक ID और version देता है, और approved स्थिति को baseline कहते हैं, जो सिर्फ़ change control से बदलती है। आम तौर पर dev, test, staging और production environments होते हैं; staging जितना production जैसा हो, उतना अच्छा। Test data के लिए synthetic data सबसे सुरक्षित है; असली data सिर्फ़ masking और अनुमति के बाद इस्तेमाल करें। उदाहरण: staging पर सभी payment tests को 503 error मिलता है क्योंकि एक service deploy ही नहीं हुई — यह environment issue है, product bug नहीं। ऐसे tests को Blocked लिखें और DevOps को बताएँ।',
      'ar': 'نتيجة الاختبار لا تعني شيئًا إلا إذا عرفت بالضبط <b>أي إصدار (build)</b> اختبرت، وعلى <b>أي بيئة</b>، وبأي إعدادات وبيانات اختبار. إدارة التهيئة (configuration management) تعطي كل عنصر معرّفًا ورقم إصدار، والحالة المعتمدة تسمّى خط الأساس (baseline) ولا تتغير إلا عبر ضبط التغيير. عادةً توجد بيئات dev وtest وstaging وproduction، وكلما كانت staging أقرب إلى بيئة الإنتاج كان ذلك أفضل. البيانات الاصطناعية (synthetic) هي الأكثر أمانًا، أما البيانات الحقيقية فلا تُستخدم إلا بعد إخفاء هويتها (masking) والحصول على موافقة. مثال: كل اختبارات الدفع على staging تعطي الخطأ 503 لأن إحدى الخدمات لم تُنشر أصلًا — هذه مشكلة بيئة وليست خللًا في المنتج، فنعلّم الاختبارات بأنها Blocked ونبلغ فريق DevOps.',
      'es': 'Un resultado de prueba solo tiene sentido si sabes exactamente <b>qué build</b> probaste, en <b>qué entorno</b>, con qué configuración y con qué datos. La gestión de la configuración (configuration management) da a cada elemento un identificador y una versión; el estado aprobado se llama línea base (baseline) y solo cambia mediante control de cambios. Lo habitual es tener entornos dev, test, staging y production, y cuanto más se parezca staging a producción, mejor. Los datos sintéticos son la opción más segura; los datos reales solo se usan enmascarados y con autorización. Ejemplo: todas las pruebas de pago en staging devuelven un error 503 porque un servicio no se desplegó: es un problema de entorno, no un defecto del producto. Marca esas pruebas como Blocked y avisa a DevOps.'
    },
    keyTerms: [
      { term: 'Configuration item', def: 'Any work product placed under configuration management: a build, a service version, a config file, a set of test cases, a data set or an environment definition.' },
      { term: 'Baseline', def: 'An approved, versioned set of configuration items that changes only through formal change control and can be restored later to reproduce results.' },
      { term: 'Environment parity', def: 'How closely a test or staging environment matches production in versions, configuration, infrastructure and data shape.' },
      { term: 'Release notes', def: 'The description that comes with a build: version, included changes and fixes, known issues, and configuration or migration notes.' },
      { term: 'Data masking', def: 'Replacing personal or sensitive values in copied data with realistic fake values while keeping formats and relationships intact.' },
      { term: 'Synthetic test data', def: 'Data created artificially by scripts, generators or fixtures, containing no real personal information.' }
    ],
    practice: [
      { q: 'A bug report says: <i>“Transfer fails. Environment: staging, latest build.”</i> What is missing, and why does it matter?', hint: 'Think about what a developer needs to reproduce it next week.', answer: 'The exact <b>build</b> (version, build number or commit), the <b>configuration</b> that matters (feature flags such as instantTransfer, limits), the <b>test data</b> (which wallet, what it had sent that day) and the time it happened. “Latest” changes every day: by the time a developer looks, staging may run a different build, so they may fail to reproduce it — or the bug may already be fixed. Unambiguous references to configuration items are exactly what configuration management asks for.' },
      { q: 'The team proposes copying the production PeopleOps database — names, national ID numbers, salaries and bank accounts — into the test environment “for realistic data”. What do you recommend?', answer: 'Do not copy it raw. Prefer <b>synthetic data</b> generated by scripts, with edge cases built in on purpose. If production-like realism or volume is truly needed, use an <b>approved, masked subset</b>: replace every personal field with realistic fake values, keep formats valid, keep relationships consistent (the same employee gets the same fake ID in every table), restrict access, and plan when the copy is refreshed and deleted. Follow company policy and the privacy laws that apply — they cover test copies too.' },
      { q: 'Classify each and say how you would report it: (a) all API tests fail with “certificate has expired” on the test environment; (b) the password reset email greets the user with another person’s name; (c) a test fails because the coupon in the seed data expired yesterday.', answer: '(a) <b>Environment issue</b> — infrastructure, not product code. Mark tests Blocked and raise it with the environment owner (DevOps). (b) <b>Product defect</b>, and a serious one: it leaks personal data. Log it with build, environment and data, high severity. (c) <b>Test data issue</b> — fix the seed data (use dates relative to today, such as “expires in 30 days”) and re-run; it is not a product bug.' },
      { q: 'Staging runs one application server; production runs three behind a load balancer. Which risks does this difference create, and what would you do about it?', hint: 'What changes when requests from one user can reach different servers?', answer: 'Risks: sessions stored in one server’s memory get lost when the next request reaches another server; files uploaded to one server’s local disk are missing on the others; in-memory caches disagree; scheduled jobs may run three times. Actions: record the difference in the test plan as a known risk; ask whether staging can run at least two servers, even briefly, for a targeted test; review how sessions, uploads and jobs are designed; and watch logs and monitoring closely after release.' }
    ],
    quiz: [
      { q: 'In configuration management, what is a baseline?', options: ['An approved set of item versions, changed only through change control', 'The first build a developer creates on a laptop for a new feature', 'The minimum smoke test suite that must pass before any other testing', 'The production environment that every other environment is copied from'], correct: 0,
        why: ['Right — once approved for testing, a configuration becomes a baseline. It changes only through formal change control, and you can return to it to reproduce earlier results.', 'A local developer build is not approved or controlled, so it is not a baseline.', 'A smoke suite may be an entry criterion, but it is a set of tests, not a controlled snapshot of configuration items.', 'Production is an environment. A baseline is an approved, versioned set of configuration items, which may describe any environment.'] },
      { q: 'Ten checkout tests fail on staging with “503 Service Unavailable” right after a deployment. The same build passed them on the QA environment an hour ago. What should the tester do first?', options: ['Log ten separate high-severity bugs, one for each failed checkout test', 'Re-run the full regression suite on staging to collect more evidence', 'Check service health, deployment logs and config before logging bugs', 'Mark the release as failed and tell the product owner it cannot ship'], correct: 2,
        why: ['Same build, different environment, widespread 503s: the evidence points to the environment. Ten product bugs would be noise that someone has to close later.', 'Running more tests on a broken environment produces more failures, not more understanding.', 'Right — a 503 across many tests straight after a deployment usually means a service is down or misconfigured. Confirm the setup first, then mark tests Blocked and raise it with the environment owner.', 'Far too early — nothing yet shows a product problem, and the release decision belongs to stakeholders, based on evidence.'] },
      { q: 'Why should a staging environment mirror production as closely as is practical?', options: ['So testers can safely use real customer accounts in their tests', 'So bugs tied to versions, config or infrastructure surface early', 'So that no checks at all are needed in production after release', 'So that developers can deploy to it without any release notes'], correct: 1,
        why: ['Parity is about versions, configuration and infrastructure — not about using real customers’ accounts, which raises privacy problems.', 'Right — every difference between staging and production is a place where a defect can hide until release. Known differences should be recorded as risks.', 'Even with good parity, teams still run agreed smoke checks and monitor production after deployment.', 'Release notes are still needed: they tell testers which build, changes and configuration to expect.'] },
      { q: 'A team needs realistic PeopleOps data for performance testing. Which approach best protects employee privacy while keeping the data useful?', options: ['Copy production exactly as it is, but limit access to the QA team', 'Use production data and just delete the salary column before importing it', 'Type a handful of employee records by hand into the test database', 'Mask personal fields consistently and generate extra synthetic volume'], correct: 3,
        why: ['Restricting access does not make an unmasked copy of personal data acceptable; it is still raw personal data outside production.', 'Names, national IDs and bank details would remain — removing one column is not masking.', 'Privacy-safe, but a handful of records is useless for performance testing, which needs realistic volume.', 'Right — consistent masking keeps formats and relationships realistic, and generated synthetic records add volume without exposing anyone.'] },
      { q: 'A defect report says only “Environment: test, build: latest.” Two days later the developer cannot reproduce it. Which practice would have helped most?', options: ['Running the same test again later on the developer’s own machine', 'Recording the exact build, config and data version in the report', 'Giving the bug a higher priority so it is fixed before things change', 'Keeping every tester on one shared environment for the whole release'], correct: 1,
        why: ['A different machine with a different setup is exactly what makes the failure hard to reproduce.', 'Right — configuration management asks that items are referenced unambiguously. With the exact build, configuration and data, the developer can recreate the same setup.', 'Priority is a business decision about urgency; it does not tell anyone what was tested.', 'A shared environment does not record which build was deployed when the failure happened, and it creates new conflicts over test data.'] }
    ],
    interview: [
      { q: 'How do you tell whether a failure is an environment issue or a real defect?', a: 'I check the setup before blaming the code. First, is the deployed build the one in the release notes? Second, are dependent services healthy, and is the configuration (flags, URLs, certificates) what I expect? Many tests failing at once with 5xx errors or timeouts usually points to the environment. Third, is my test data in the right state? Then I try to reproduce the failure on a clean, correctly deployed environment with fresh data, or compare with another environment. If the environment is at fault, I mark the tests <b>Blocked</b>, raise it with the environment owner and record the lost time. If it reproduces on a healthy setup, I log a product bug with the exact build, environment, configuration and data. One exception: configuration that ships with the release is part of the product.' },
      { q: 'What test data strategy would you use for an application that stores personal data?', a: 'By default I use <b>synthetic data</b> created by scripts or fixtures. It is privacy-safe, I can build edge cases deliberately, and it can be reset and versioned with the tests. Where we need production-like realism or volume, for example for performance or migration testing, I would use an <b>approved, masked subset</b> of production: every personal field replaced consistently, formats kept valid, relationships intact, access restricted, and a plan for refreshing and deleting it. For payments I use the provider’s sandbox test cards, never real ones. I also avoid shared accounts that tests can lock or change for each other — each test, or each tester, gets its own data.' }
    ],
    takeaways: [
      'A test result only means something if you know the exact build, environment, configuration and data behind it.',
      'Configuration management identifies and versions test items and testware; a baseline changes only through change control.',
      'Keep staging as production-like as practical and record the known differences as risks.',
      'Prefer synthetic data; use production data only when it is masked, approved and access-controlled.',
      'Check build, service health, configuration and data before logging a bug — environment issues block tests; they are not product defects.'
    ],
    links: { labs: ['api'], challenges: ['api-contract'], interview: ['m4', 'm6'] }
  }
]);

QA_CONTENT.addBank('manual', [
  { level: 'intermediate', topic: 'mt-config-env',
    q: 'A tester notices that the QA environment runs build 4.2.0-rc3, but the release notes for today’s test cycle describe rc4. What is the best next step?',
    options: ['Test rc3 anyway and report the results as rc4 to stay on schedule', 'Pause and confirm with the team which build should be deployed', 'Log a product defect against rc4 for each feature that is missing', 'Delete the rc3 results and redeploy a build on the environment alone'], correct: 1,
    why: ['Reporting rc3 results as rc4 would make every result misleading — exactly what configuration management exists to prevent.', 'Right — the environment does not match the expected configuration. Confirm which build is intended (and why the deployment differs) before spending effort on tests.', 'Features are missing because the wrong build is deployed, not because rc4 is faulty. These would be false defects.', 'Redeploying without agreement can disrupt other people’s testing and skips the change control the team relies on.'] },
  { level: 'intermediate', topic: 'mt-config-env',
    q: 'When masking a copied ShopFlow database, why should the same customer receive the same fake email address in every table?',
    options: ['Masking tools only work when email addresses are unique in each table', 'Privacy laws require every masked value to be reversible later on', 'Orders, payments and accounts must still join correctly during tests', 'Testers may need to contact the real customer when a test fails'], correct: 2,
    why: ['Uniqueness is a data rule, not a requirement of masking tools; it does not explain consistency across tables.', 'Masking for test data aims to make values non-identifying; nothing requires it to be reversible — reversibility actually increases privacy risk.', 'Right — consistent masking preserves relationships, so joins, lookups and end-to-end flows still behave like the real data.', 'Testers should never contact real customers from test data; that would defeat the purpose of masking.'] }
]);

QA_CONTENT.addDrills('manual', [
  {
    id: 'mt-d7', type: 'classify', level: 'intermediate',
    title: 'Environment issue, test data issue or product defect?',
    prompt: 'Each failure was investigated and its real cause is described. Classify it so it is reported to the right people.',
    categories: ['Environment issue', 'Product defect', 'Test data issue'],
    items: [
      { text: 'All API calls on staging fail with “certificate has expired”', cat: 0, why: 'An expired certificate is infrastructure configuration. Mark the affected tests Blocked and raise it with the environment owner.' },
      { text: 'Saving the surname O’Brien gives a 500 error on every healthy environment', cat: 1, why: 'It reproduces on correctly deployed, healthy environments, so the code is at fault: the apostrophe is not handled.' },
      { text: 'The login test fails because another tester changed the shared account’s password', cat: 2, why: 'The product behaved correctly for the data it was given. Give each test or tester its own account.' },
      { text: 'Checkout shows old prices because the QA environment is still on yesterday’s build', cat: 0, why: 'A failed or missed deployment is an environment issue. Confirm the build against the release notes before testing.' },
      { text: 'The daily transfer limit lets 60,000 PKR through although the agreed limit is 50,000', cat: 1, why: 'The software breaks an agreed business rule. Log it with the exact build, configuration and data.' },
      { text: 'A coupon test fails because the seed data hard-codes an expiry date that has passed', cat: 2, why: 'The data aged, not the product. Use dates relative to today (for example “expires in 30 days”).' },
      { text: 'The production config file shipped in release 3.5 points payments at the sandbox gateway', cat: 1, why: 'Configuration that ships with the release is part of the product, so this is a (serious) defect, not an environment problem.' },
      { text: 'Password reset emails never arrive on the test environment because no mail server is set up there', cat: 0, why: 'The environment is missing a dependency. Report it as an environment gap; email checks are blocked until it is fixed.' }
    ]
  }
]);

QA_CONTENT.addVisuals({
  'mt-config-env': [
    { t: 'timeline', title: 'Build once, promote through environments',
      items: [
        { label: 'Commit and CI build', sub: 'Unit tests run; the artefact gets a version and build number' },
        { label: 'Development', sub: 'Developers integrate and debug with mocks and small data sets' },
        { label: 'Test / QA', sub: 'Functional, integration and regression testing of the baselined build' },
        { label: 'Staging', sub: 'Release candidate in a production-like setup: UAT, performance, rehearsal' },
        { label: 'Production', sub: 'Deployment, agreed smoke checks and monitoring' }
      ],
      caption: 'Many teams build the artefact once and promote that same version from environment to environment; only the configuration changes. Rebuilding for each environment would mean the build you release is not the build you tested.' },
    { t: 'flowchart', title: 'Environment issue, data issue or product defect?', dir: 'down',
      nodes: [
        { id: 'fail', label: 'Test fails unexpectedly', kind: 'start' },
        { id: 'build', label: 'Deployed build matches release notes?', kind: 'decision' },
        { id: 'redeploy', label: 'Fix the deployment, then re-run', kind: 'end' },
        { id: 'health', label: 'Services healthy and config as expected?', kind: 'decision' },
        { id: 'env', label: 'Environment issue: Blocked, tell owner', kind: 'end' },
        { id: 'data', label: 'Test data in the expected state?', kind: 'decision' },
        { id: 'fixdata', label: 'Test data issue: fix data, re-run', kind: 'end' },
        { id: 'clean', label: 'Reproduces on a clean, correct setup?', kind: 'decision' },
        { id: 'bug', label: 'Product defect: log build, env and data', kind: 'end' },
        { id: 'script', label: 'Check the test script or flakiness', kind: 'end' }
      ],
      edges: [
        { from: 'fail', to: 'build' },
        { from: 'build', to: 'redeploy', label: 'No' },
        { from: 'build', to: 'health', label: 'Yes' },
        { from: 'health', to: 'env', label: 'No' },
        { from: 'health', to: 'data', label: 'Yes' },
        { from: 'data', to: 'fixdata', label: 'No' },
        { from: 'data', to: 'clean', label: 'Yes' },
        { from: 'clean', to: 'bug', label: 'Yes' },
        { from: 'clean', to: 'script', label: 'No' }
      ],
      caption: 'Rule out the cheap explanations — wrong build, broken environment, stale data — before logging a product bug. A failure that reproduces on a clean, correct setup is very likely a real defect.' }
  ]
});
