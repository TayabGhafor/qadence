/* Qadence content · stage "capstone" · lessons 1–6 (portfolio → career growth), bank and drills.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-capstone.js
   Career guidance here is practical advice, not a hiring guarantee. No salary figures or invented statistics. */
QA_CONTENT.addLessons('capstone', [
  {
    id: 'cp-portfolio',
    n: 1,
    level: 'beginner',
    title: 'Build a QA portfolio and capstone project',
    summary: 'Plan and publish an honest capstone portfolio — plan, cases, bugs, API, SQL, automation and a README — that proves your skills with evidence.',
    minutes: 18,
    objectives: [
      'Explain why evidence beats claims when reviewers judge a junior QA candidate',
      'Choose a practice app you are allowed to test and publish results from',
      'Plan the artifacts of a capstone and organise them in a GitHub repository',
      'Write a README that tells the story and keeps company data and secrets out'
    ],
    body: [
      { t: 'p', html: 'Many junior QA resumes list the same words: manual testing, API testing, SQL, Selenium, Playwright. A list of tools is a <b>claim</b>. A hiring manager cannot tell from it whether you can design a useful test or write a bug report a developer can reproduce. A portfolio gives them <b>evidence</b>: cases you designed, defects you documented, checks that run in CI and a README that explains your choices. It turns “I know boundary value analysis” into “here are the boundary cases I wrote for a checkout, and the defect one of them found.”' },
      { t: 'compare', a: { title: 'A claim', items: ['“Strong knowledge of API testing”', '“Detail-oriented team player”', '“Familiar with Playwright, Cypress, Selenium, Appium…”', '“Found many critical bugs”'] }, b: { title: 'Evidence', items: ['A Postman collection with positive, negative and ownership checks', 'Bug reports with steps, expected vs actual, environment and screenshots', 'A small Playwright suite that runs green from a clean checkout in CI', 'Five reproducible findings, each linked to the case that found it'] } },
      { t: 'cards', items: [
        { title: 'Judgement', html: 'You chose a scope, ranked risks and explained what you left out and why.' },
        { title: 'Clarity', html: 'Cases and reports a stranger can follow without asking you questions.' },
        { title: 'Range', html: 'UI, API, SQL and basic automation applied to the <b>same</b> feature.' },
        { title: 'Honesty', html: 'Seeded defects labelled, failed and blocked results shown, limitations stated.' }
      ] },
      { t: 'h', text: 'Choosing a practice app' },
      { t: 'p', html: 'Test only systems you are <b>allowed</b> to test. Good options are a demo app published for testing practice, an open-source application you run on your own machine, or a small app you build yourself. Do not point load tests, scanners or security probes at a live website you do not own — that can break its terms of service or the law, even if you “only looked”. Never use an employer’s or client’s system for a public portfolio. The ShopFlow challenge on this site is a safe starting slice.' },
      { t: 'list', items: [
        '<b>Permitted:</b> built for practice, open source, or your own',
        '<b>Layered:</b> it has a UI, an API and a database you can read',
        '<b>Resettable:</b> seed data you can restore, so every run starts the same',
        '<b>Scoped:</b> sign-in, cart and checkout are enough — finish one journey well',
        '<b>Stable:</b> a failure should mean a finding, not a broken setup'
      ] },
      { t: 'h', text: 'What goes in the capstone' },
      { t: 'table', caption: 'Suggested targets from this roadmap — evidence quality matters more than the count', head: ['Artifact', 'What it proves', 'Suggested size'], rows: [
        ['Test plan', 'Scope, top risks, out of scope, environments, entry and exit criteria', '1–2 pages'],
        ['Manual test cases', 'Techniques (BVA, decision tables, state transitions) with expected results', 'About 20 (fuller target 25–35)'],
        ['Bug reports', 'Reproducible steps, expected vs actual, severity, evidence', '5 real or clearly labelled seeded defects'],
        ['API collection', 'Positive, negative, auth and ownership checks — with no secrets inside', 'About 10 checks'],
        ['SQL checks', 'Read-only queries confirming what the UI and API claim', 'About 5 queries'],
        ['Automation + CI', 'Independent tests of critical journeys with useful failure output', '5–10 checks'],
        ['Test summary report', 'Passed / failed / blocked, findings, residual risk and limitations', '1 page']
      ] },
      { t: 'callout', tone: 'key', title: 'Trace one requirement through every layer', html: 'The strongest single thing in a capstone is one requirement followed all the way: <code>REQ-ORDER-01</code> → manual case → API check → SQL query → automated test → summary, using the same order ID. If the layers disagree, that is an investigation to write up — not automatic proof that the database is wrong.' },
      { t: 'h', text: 'Repository structure and README' },
      { t: 'code', lang: 'text', title: 'A simple, navigable layout', code: `shopflow-qa-capstone/
├── README.md              ← the story: scope, risks, results
├── docs/
│   ├── test-plan.md
│   ├── traceability.md    ← requirement → tests → results
│   └── test-summary.md
├── manual/
│   ├── test-cases.md
│   └── bug-reports/       ← one file per defect
├── api/
│   └── shopflow.postman_collection.json   (no tokens)
├── sql/
│   └── checks.sql         ← read-only SELECT queries
├── tests/                 ← Playwright specs
├── .github/workflows/ci.yml
├── .env.example           ← variable names only, no values
└── .gitignore             ← includes .env` },
      { t: 'table', caption: 'What each folder proves to a reviewer', head: ['Folder', 'What goes there', 'Reviewer question it answers'], rows: [
        ['<code>docs/</code>', 'Test plan, traceability matrix, test summary', '“What did you test, why, and what is left?”'],
        ['<code>manual/</code>', 'Test cases and one file per bug report', '“Can I follow and reproduce your work?”'],
        ['<code>api/</code>', 'Postman collection and an environment template with no secrets', '“Do you check status, data, auth and ownership?”'],
        ['<code>sql/</code>', 'Read-only queries tied to UI and API actions', '“Do you confirm what is actually stored?”'],
        ['<code>tests/</code> + CI', 'Playwright specs and the workflow that runs them on every push', '“Does it run from a clean checkout, and are failures diagnosable?”']
      ] },
      { t: 'p', html: 'Your README is the cover letter for the repository. In a couple of minutes a reviewer should understand <b>what you tested and why</b>, what you did yourself versus sample application code, how to set up and run everything, where each kind of evidence lives, and the results on a named build — passed, failed and blocked, with seeded defects labelled. Finish with what is <b>out of scope or still risky</b> and a short “What I would do next”. That shows judgement, not weakness.' },
      { t: 'callout', tone: 'warn', title: 'Privacy: no real company data', html: 'Never publish an employer’s or client’s code, test cases, screenshots, internal URLs or customer records — not even “anonymised”. Keep passwords and tokens out of Git: use a <code>.env</code> file listed in <code>.gitignore</code>, commit only <code>.env.example</code>, and store values as CI secrets. Use obviously fictional data such as <code>buyer.a@example.test</code>, and crop or blur screenshots. A leaked secret or a fabricated result is a reason not to publish at all.' }
    ],
    example: {
      title: 'Worked example: one ShopFlow requirement, end to end',
      blocks: [
        { t: 'p', html: '<b>Requirement:</b> “Orders with a merchandise subtotal of $50.00 or more get free shipping.” Sara, a fictional learner, runs ShopFlow locally with a seed script, so every run starts with the same products and two buyer accounts. She traces this one rule through every layer of her capstone, using the same cart and order IDs throughout.' },
        { t: 'table', head: ['ID', 'Evidence', 'Result'], rows: [
          ['TC-SHIP-01 to 03', 'Manual cases at $49.99, $50.00 and $50.01', '$50.00 still charged shipping — <b>failed</b>'],
          ['BUG-03', 'Report with steps, expected vs actual, screenshot, build 0.3', 'Seeded defect, labelled as seeded'],
          ['API-SHIP-01', 'Quote request for a $50.00 cart, then GET the same cart', '<code>shipping: 6.00</code> — matches the UI'],
          ['SQL-SHIP-01', 'Read-only SELECT on the stored order', 'Shipping stored as 6.00'],
          ['AUTO-SHIP-01', 'Playwright check marked as an expected failure linked to BUG-03', 'Runs in CI; alerts her when the fix lands']
        ] },
        { t: 'p', html: 'Her README states it in one honest line: “BUG-03 is a seeded defect in the practice app; TC-SHIP-02 found it and the API and database checks confirmed it.” A reviewer now sees technique, layering, honesty and automation in one row of evidence — far more convincing than a longer list of tools.' }
      ]
    },
    explain: {
      'ur': 'Portfolio کا مطلب ہے ثبوت، صرف دعوے نہیں۔ resume پر “مجھے API testing آتی ہے” لکھنے کے بجائے ایک چھوٹا سا project دکھائیں: test plan، test cases، bug reports، API collection، چند SQL checks اور CI میں چلنے والا چھوٹا automation suite۔ مثال: ایک practice store میں free shipping کو $49.99، $50.00 اور $50.01 پر ٹیسٹ کریں، اور جو bug ملے اسے API اور database check سے جوڑیں۔ صرف وہی apps ٹیسٹ کریں جن کی اجازت ہو، جیسے practice apps یا اپنی بنائی ہوئی app۔ کبھی بھی کمپنی کا data یا اصلی passwords شائع نہ کریں۔ ایک واضح README لکھیں جس میں بتائیں کہ کیا ٹیسٹ کیا، کیوں کیا، نتائج کیا رہے اور کیا باقی ہے۔ seeded bugs کو ایمانداری سے seeded لکھیں۔',
      'ur-Latn': 'Portfolio ka matlab hai saboot, sirf daawe nahi. Resume par “mujhe API testing aati hai” likhne ke bajaye ek chhota sa project dikhayein: test plan, test cases, bug reports, API collection, kuch SQL checks aur CI mein chalne wala chhota automation suite. Misaal: ek practice store mein free shipping ko $49.99, $50.00 aur $50.01 par test karein, aur jo bug mile usay API aur database check se jorein. Sirf wohi apps test karein jin ki ijazat ho — practice apps ya apni banayi hui app. Kabhi bhi company ka data ya asli passwords publish na karein. Ek saaf README likhein jo bataye ke kya test kiya, kyun kiya, results kya rahe aur kya baqi hai. Seeded bugs ko imaandari se seeded likhein.',
      'hi': 'Portfolio का मतलब है सबूत, सिर्फ़ दावे नहीं। Resume पर “मुझे API testing आती है” लिखने के बजाय एक छोटा-सा project दिखाइए: test plan, test cases, bug reports, API collection, कुछ SQL checks और CI में चलने वाला छोटा automation suite। उदाहरण: एक practice store में free shipping को $49.99, $50.00 और $50.01 पर test करें, और जो bug मिले उसे API और database check से जोड़ें। सिर्फ़ वही apps test करें जिनकी अनुमति हो — practice apps या अपनी बनाई हुई app। कभी भी कंपनी का data या असली passwords publish न करें। एक साफ़ README लिखें जिसमें बताएँ कि क्या test किया, क्यों किया, नतीजे क्या रहे और क्या बाकी है। Seeded bugs को ईमानदारी से seeded लिखें।',
      'ar': 'ملف الأعمال (portfolio) دليل عملي وليس مجرد ادعاءات. بدلًا من أن تكتب في سيرتك الذاتية «أُتقن اختبار API»، اعرض مشروعًا صغيرًا يضم خطة اختبار، وحالات اختبار (test cases)، وتقارير أخطاء، ومجموعة طلبات API، وبعض استعلامات SQL، ومجموعة اختبارات آلية صغيرة تعمل في CI. مثال: في متجر تدريبي، اختبر الشحن المجاني عند 49.99$ و50.00$ و50.01$، واربط الخطأ الذي تجده بفحص على مستوى API وقاعدة البيانات. لا تختبر إلا التطبيقات المسموح لك باختبارها، مثل تطبيقات التدريب أو تطبيقك الخاص، ولا تنشر أبدًا بيانات شركة أو كلمات مرور حقيقية. اكتب ملف README واضحًا يشرح ماذا اختبرت ولماذا، وما النتائج، وما الذي بقي خارج النطاق، واذكر بصدق أن الأخطاء المزروعة (seeded) مزروعة.',
      'es': 'Un portafolio es evidencia, no promesas. En lugar de escribir en tu CV «sé hacer pruebas de API», muestra un proyecto pequeño: un plan de pruebas, casos de prueba (test cases), reportes de bugs, una colección de API, algunas consultas SQL y una pequeña suite automatizada que se ejecute en CI. Ejemplo: en una tienda de práctica, prueba el envío gratis con $49.99, $50.00 y $50.01, y vincula el bug que encuentres con una verificación en la API y en la base de datos. Prueba solo aplicaciones que tengas permiso de probar —apps de práctica o tuyas— y nunca publiques datos de una empresa ni contraseñas reales. Escribe un README claro que diga qué probaste, por qué, los resultados y las limitaciones. Indica con honestidad qué bugs fueron sembrados (seeded).'
    },
    keyTerms: [
      { term: 'Portfolio', def: 'A public collection of your testing work — plans, cases, reports, code — that lets reviewers judge your skills from evidence.' },
      { term: 'Capstone', def: 'One integrated project that applies everything you have learned to a single system, end to end.' },
      { term: 'Seeded defect', def: 'A bug deliberately placed in a practice app for learners to find. Label it as seeded in your portfolio.' },
      { term: 'Traceability', def: 'Links from each requirement to the tests that cover it and their results, so gaps and impact are visible.' },
      { term: 'Redaction', def: 'Removing or masking secrets and personal data (tokens, emails, IDs) in files and screenshots before sharing them.' }
    ],
    practice: [
      { q: 'Which of these are acceptable capstone targets, and why? (a) your bank’s mobile app, (b) an open-source store you run locally, (c) your employer’s staging server, (d) a demo app published for testing practice.', hint: 'Ask two questions: do I have permission, and may I publish what I find?', answer: '<b>(b)</b> and <b>(d)</b>. You can run, reset and publish results from an open-source app on your own machine, and practice apps exist for this purpose (follow their stated rules, such as no load testing). <b>(a)</b> is a live system you do not own — probing it can break terms of service or the law. <b>(c)</b> belongs to your employer; its code, data and findings are confidential, so it can never be public portfolio material.' },
      { q: 'Write the “What is tested and why” section of a README for a ShopFlow sign-in, cart and checkout capstone (4–6 lines).', answer: 'For example: “<b>Scope:</b> sign-in, cart and checkout of ShopFlow 0.3, run locally with seed data. <b>Users:</b> shoppers buying 1–10 items. <b>Top risks:</b> wrong totals or shipping at price boundaries, orders visible to the wrong user, duplicate orders on double-click, declined payments leaving stock reserved. <b>Out of scope:</b> performance, payment-provider internals, mobile apps. Evidence for each risk is linked in docs/traceability.md.”' },
      { q: 'While reviewing <code>git log -p</code> you see that a commit two weeks ago included <code>.env</code> with a real API token. What do you do?', hint: 'Deleting the file now does not remove it from history.', answer: 'Treat the secret as leaked: <b>revoke or rotate the token first</b>. Then remove the file from Git history with a history-rewriting tool (and understand the impact before force-pushing), add <code>.env</code> to <code>.gitignore</code>, commit a <code>.env.example</code> with variable names only, and move the value into CI secrets. Note it privately as a lesson learned.' },
      { q: 'Your capstone suite has 8 Playwright tests and one fails because of a seeded defect. How should that appear in CI and in the README?', answer: 'Keep the evidence visible. Either let it fail with a clear link to the bug report, or mark it as an expected failure (for example <code>test.fail()</code> with a comment naming <code>BUG-03</code>) so CI stays meaningful and tells you when the fix lands. In the README, report “7 passed, 1 expected failure (BUG-03, seeded)”. Never delete the test or change the assertion to match the wrong behaviour.' }
    ],
    quiz: [
      { q: 'A hiring manager has two minutes with your application. Which is the most convincing proof of test design skill?', options: ['A skills section listing fifteen testing tools you have tried at least once', 'A linked test plan and cases that name the techniques used and record results', 'A certificate of completion from an online testing course you have finished', 'A summary line describing you as a detail-oriented, passionate, fast-learning tester'], correct: 1,
        why: ['Tool names are claims; they do not show whether you can design a single good test.', 'Right — real artifacts with named techniques and results let the reviewer judge your thinking directly.', 'A course certificate can show effort, but it does not show how you design or execute tests.', 'Adjectives are claims every applicant makes; evidence is what separates you.'] },
      { q: 'Which system is the most appropriate target for a public capstone project?', options: ['Your current employer’s staging environment, since you already have access', 'A large online store, as long as you only test its public pages', 'A banking app, provided you never complete a real payment', 'An open-source store you run locally with resettable seed data'], correct: 3,
        why: ['Access for work is not permission to publish; the code, data and findings are confidential.', 'A live site you do not own is not yours to probe or to publish findings about, even its public pages.', 'Live financial systems are especially sensitive; testing them without permission can be illegal.', 'Right — you have permission, can reset the data for repeatable runs, and can publish freely.'] },
      { q: 'You notice that a Postman collection in your public repo contains a valid bearer token. What should you do first?', options: ['Revoke or rotate the token, then clean it from history and use variables', 'Delete the collection file in a new commit and push the change right away', 'Make the repository private for a week until the token is forgotten', 'Add a note in the README politely asking readers not to use the token'], correct: 0,
        why: ['Right — assume it is compromised: invalidate it first, then remove it from history and move secrets to environment variables or CI secrets.', 'The token is still in Git history and may already be copied; it stays valid until it is revoked.', 'Anyone may already have cloned or cached it; hiding the repo does not invalidate the secret.', 'A note does not stop misuse; only revoking the token does.'] },
      { q: 'Which line belongs in an honest capstone test summary?', options: ['All tested features are now completely bug-free and ready for a production release', 'Testing was thorough and complete, so no risks remain for this build', '22 passed, 2 failed, 1 blocked on build 0.3; payment retries untested', 'Everything was tested in every browser and on every available device'], correct: 2,
        why: ['Testing shows the presence of defects, not their absence — “bug-free” is a claim no test set can support.', 'Exhaustive testing is impossible; a good summary names remaining risks instead of denying them.', 'Right — specific results on a named build plus a stated gap give the reader an honest picture.', 'Vague and almost certainly untrue; name the browsers and devices you actually used.'] },
      { q: 'A reviewer opens your capstone repository. What should the top of the README explain?', options: ['Every single tool installed on your laptop, with exact version numbers', 'What you tested and why: scope, top risks and where the evidence is', 'Your personal story and why you decided to switch into QA', 'A gallery of screenshots showing every passing test run'], correct: 1,
        why: ['Versions belong in the setup section, not at the top.', 'Right — scope and risks frame everything else, and links let the reviewer jump straight to evidence.', 'A short motivation can live on LinkedIn; the README should be about the testing.', 'Screenshots of green runs prove little; reviewers want your reasoning and results.'] }
    ],
    interview: [
      { q: 'Walk me through your portfolio project.', a: 'I keep it to about five minutes. First the users, scope and top risks — for my ShopFlow capstone that was sign-in, cart and checkout, with totals, ownership and duplicate orders as the main risks. Next, one requirement and how I covered it manually with boundary cases. Then the API and read-only SQL evidence for the <b>same order ID</b>, so you can see the layers agree. Then an automated run in CI and what a failure trace looks like. I finish with what I did not cover, the seeded defects I labelled, and what I would improve next.' },
      { q: 'Your projects use practice apps. Why should we value them?', a: 'They are not client work, and I say so clearly. What they show is how I think: how I chose scope and risks, which techniques I used, how I wrote reproducible reports and how I confirmed results at the API and database. Everything is in the repository with results on a named build, so you can <b>check my claims instead of trusting them</b>. I am happy to walk through any test or rerun the suite now.' }
    ],
    takeaways: [
      'Reviewers trust evidence — artifacts, results and reasoning — over lists of tools.',
      'Test only apps you are allowed to test, and never publish company data or secrets.',
      'One requirement traced through UI, API, SQL and automation beats many shallow tests.',
      'The README tells the story: scope, risks, setup, evidence, results and limitations.',
      'Label seeded defects and gaps honestly — honesty is part of the evidence.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout', 'bug-report'], interview: ['m2', 'm3'] }
  },
  {
    id: 'cp-resume',
    n: 2,
    level: 'beginner',
    title: 'Resume, LinkedIn and applying for QA roles',
    summary: 'Write a one-page QA resume with honest impact bullets, tailor it to each job, and run a focused, realistic application routine.',
    minutes: 18,
    objectives: [
      'Structure a one-page junior QA resume that people and ATS can read',
      'Write impact bullets from an action, what you tested, how, and an honest result',
      'Tailor your resume and LinkedIn to a job description without keyword stuffing',
      'Plan a focused application routine that uses referrals and feedback'
    ],
    body: [
      { t: 'p', html: 'A resume has one job: to earn you a conversation. Reviewers skim, so the most relevant evidence must sit near the top in short, scannable lines. For a junior QA role, <b>one page is enough</b>. You are not trying to list everything you have ever touched; you are trying to show, quickly and honestly, that you can test — and to point to the portfolio that proves it.' },
      { t: 'h', text: 'A one-page QA resume, top to bottom' },
      { t: 'table', head: ['Section', 'What to include', 'Junior tip'], rows: [
        ['Header', 'Name, city, email, phone, LinkedIn and GitHub or portfolio link', 'Leave out ID-card numbers (CNIC, Aadhaar) and your full home address'],
        ['Summary (2–3 lines)', 'Target role, core skills, strongest evidence', '“Entry-level QA tester with a capstone covering UI, API, SQL and Playwright”'],
        ['Skills', 'Grouped: testing, API, data, automation, tools', 'Only what you could discuss for five minutes'],
        ['Projects', 'Capstone and smaller projects, 2–4 impact bullets each', 'Place above Experience if you have no QA job yet'],
        ['Experience', 'Any job, with transferable bullets (support, data checks, documentation)', 'Non-QA work still shows reliability and communication'],
        ['Education and certifications', 'Degree or courses; certifications only if earned', 'Certifications support evidence — they do not replace it']
      ] },
      { t: 'h', text: 'Impact bullets: action + what + result' },
      { t: 'flow', caption: 'Check every bullet against this formula', steps: ['Action verb', 'What you tested', 'How (technique or tool)', 'Result you can prove'] },
      { t: 'compare', a: { title: 'Weak bullets', items: ['Responsible for testing the website', 'Did API testing using Postman', 'Improved product quality by 40%', 'Worked on automation'] }, b: { title: 'Stronger bullets', items: ['Designed 24 risk-based cases for a practice checkout using boundary values and decision tables', 'Built a 12-check Postman collection covering auth, validation and ownership (401 vs 403)', 'Logged 5 reproducible defects with steps, evidence and severity in a capstone project', 'Automated 6 critical journeys in Playwright + TypeScript, running in GitHub Actions on every push'] } },
      { t: 'callout', tone: 'warn', title: 'Honest numbers only', html: 'Use numbers you can show: cases written, checks built, defects documented, a suite’s runtime before and after a change. Never invent business impact such as “improved quality by 40%” or “saved the company 200 hours”. Interviewers ask “how did you measure that?” — if you cannot answer, the bullet costs you trust instead of earning it.' },
      { t: 'h', text: 'Skills, tailoring and ATS' },
      { t: 'p', html: 'Group skills so they are easy to scan — for example <b>Testing:</b> test design (BVA, equivalence partitioning, decision tables), exploratory testing, bug reporting; <b>API:</b> REST, Postman, status codes; <b>Data:</b> SQL joins and aggregates; <b>Automation:</b> Playwright with TypeScript (basic), Git, CI. Avoid <b>keyword stuffing</b>: thirty tools, rating bars or hidden keywords look padded to a person, and every item you list is fair game in an interview.' },
      { t: 'p', html: 'Tailor for each role. Split the job description into must-haves and nice-to-haves, move matching evidence to the top, and use the employer’s own terms where they are true — if the ad says “API testing”, do not call it “web service checks”. Many companies use an <b>applicant tracking system (ATS)</b> to store, search and filter applications. Help it read you: standard headings, a single-column layout, real text rather than images, common fonts and the file type requested. Then remember that a person reads what gets through.' },
      { t: 'h', text: 'LinkedIn and applying' },
      { t: 'list', items: [
        '<b>Headline:</b> role + skills + evidence, e.g. “QA Tester (entry level) · Manual, API & SQL testing · Learning Playwright”',
        '<b>About:</b> three short paragraphs — what you test, what you have built (mention the capstone), what role you want',
        '<b>Featured:</b> your capstone repository and one strong bug report or test summary',
        '<b>Activity:</b> now and then, share something you learned, such as a technique or a bug you reproduced in a practice app'
      ] },
      { t: 'list', items: [
        '<b>Quality over quantity:</b> a starting weekly routine is 5–8 tailored applications, 2–3 professional conversations and one mock interview',
        '<b>Track</b> every application — company, role, date, resume version, outcome — in a simple sheet',
        '<b>Referrals:</b> ask people you have actually interacted with; send the job link, your tailored resume and a two-line fit summary',
        '<b>Review, don’t just repeat:</b> after two weeks without responses, check your targeting and evidence before sending more',
        '<b>Be realistic:</b> entry-level roles attract many applicants, and silence or rejection is common and not a verdict on you; consider internships and trainee programmes too'
      ] },
      { t: 'callout', tone: 'key', title: 'Never fake experience', html: 'Fake experience letters, inflated years and practice projects presented as client work tend to surface through reference checks, background verification and simple technical follow-up questions — and can lead to a withdrawn offer or dismissal. Label work honestly (“Learning project”, “Personal project”). An honest junior with solid evidence is a safer hire than an “experienced” candidate who cannot explain their own resume.' }
    ],
    example: {
      title: 'Worked example: tailoring one resume to one job ad',
      blocks: [
        { t: 'p', html: '<b>Job ad (excerpt):</b> “Junior QA Engineer. Must have: manual testing of web apps, clear bug reports, basic SQL. Nice to have: API testing with Postman, any automation tool.” Bilal, a fictional applicant, has a capstone covering all of these and a part-time customer-support job.' },
        { t: 'table', head: ['The ad asks for', 'Evidence Bilal has', 'Bullet he moves to the top'], rows: [
          ['Manual web testing', '26 cases for a ShopFlow checkout', '“Designed 26 risk-based cases for a practice web checkout using BVA and decision tables”'],
          ['Clear bug reports', '5 reports, 2 of them seeded and labelled', '“Wrote 5 reproducible bug reports with steps, expected vs actual and screenshots”'],
          ['Basic SQL', '6 read-only checks', '“Verified orders and stock with SQL joins after UI and API actions”'],
          ['API (nice to have)', '12 Postman checks', '“Built a 12-check Postman collection covering auth, validation and ownership”']
        ] },
        { t: 'p', html: 'From his support job he keeps one transferable bullet: “Reproduced customer-reported issues and escalated them to the tech team with clear steps and screenshots.” He removes tools the ad does not mention and that he barely knows. Same person, same evidence — now ordered to match what this employer asked for.' }
      ]
    },
    explain: {
      'ur': 'Resume کا کام آپ کو interview تک پہنچانا ہے، نوکری کی ضمانت نہیں۔ اسے ایک صفحے کا رکھیں: نام اور links، دو تین لائن کا summary، گروپ کی ہوئی skills، projects (جیسے آپ کا capstone)، experience اور تعلیم۔ ہر bullet یوں لکھیں: action + کیا ٹیسٹ کیا + نتیجہ، اور صرف سچے نمبر استعمال کریں۔ مثال: کمزور bullet ہے “testing کی”، جبکہ مضبوط bullet ہے “ایک practice checkout کے لیے BVA سے 24 test cases بنائے اور 5 reproducible bugs رپورٹ کیے”۔ ہر job ad کے مطابق resume کو tailor کریں اور ان کے الفاظ صرف تب استعمال کریں جب وہ آپ کے بارے میں سچ ہوں۔ ATS ایک software ہے جو resume پڑھتا ہے، اس لیے سادہ layout رکھیں۔ کم مگر سوچ سمجھ کر apply کریں، referral ادب سے مانگیں، اور کبھی جعلی experience نہ دکھائیں۔',
      'ur-Latn': 'Resume ka kaam aap ko interview tak pohanchana hai, naukri ki guarantee nahi. Isay ek page ka rakhein: naam aur links, do teen line ka summary, group ki hui skills, projects (jaise aap ka capstone), experience aur taleem. Har bullet aise likhein: action + kya test kiya + result, aur sirf sachay numbers use karein. Misaal: kamzor bullet hai “testing ki”, jab ke mazboot bullet hai “ek practice checkout ke liye BVA se 24 test cases banaye aur 5 reproducible bugs report kiye”. Har job ad ke mutabiq resume tailor karein aur un ke words sirf tab use karein jab woh aap ke baare mein sach hon. ATS ek software hai jo resume parhta hai, is liye simple layout rakhein. Kam magar soch samajh kar apply karein, referral tameez se maangein, aur kabhi fake experience na dikhayein.',
      'hi': 'Resume का काम आपको interview तक पहुँचाना है, नौकरी की गारंटी नहीं। इसे एक पेज का रखें: नाम और links, दो-तीन लाइन का summary, group की हुई skills, projects (जैसे आपका capstone), experience और शिक्षा। हर bullet ऐसे लिखें: action + क्या test किया + नतीजा, और सिर्फ़ सच्चे numbers इस्तेमाल करें। उदाहरण: कमज़ोर bullet है “testing की”, जबकि मज़बूत bullet है “एक practice checkout के लिए BVA से 24 test cases बनाए और 5 reproducible bugs report किए”। हर job ad के हिसाब से resume को tailor करें और उनके शब्द तभी इस्तेमाल करें जब वे आपके बारे में सच हों। ATS एक software है जो resume पढ़ता है, इसलिए simple layout रखें। कम लेकिन सोच-समझकर apply करें, referral विनम्रता से माँगें, और कभी नकली experience न दिखाएँ।',
      'ar': 'وظيفة السيرة الذاتية أن توصلك إلى مقابلة، لا أن تضمن لك وظيفة. اجعلها صفحة واحدة: الاسم والروابط، وملخص من سطرين أو ثلاثة، ومهارات مُجمَّعة، ومشاريع (مثل مشروع الـ capstone)، والخبرة، والتعليم. اكتب كل نقطة بهذا الشكل: فعل + ماذا اختبرت + النتيجة، واستخدم أرقامًا صادقة فقط. مثال: النقطة الضعيفة هي «قمت بالاختبار»، أما القوية فهي «صمّمت 24 حالة اختبار (test cases) لصفحة دفع تدريبية باستخدام BVA وسجّلت 5 أخطاء قابلة لإعادة الإنتاج». خصّص سيرتك لكل إعلان وظيفة، واستخدم كلماته فقط حين تكون صحيحة في حقك. نظام ATS برنامج يقرأ السير الذاتية ويفرزها، لذا استخدم تنسيقًا بسيطًا. قدّم على عدد أقل من الوظائف ولكن بعناية، واطلب التوصية (referral) بأدب، ولا تختلق خبرة أبدًا.',
      'es': 'El trabajo del CV es conseguirte una entrevista, no garantizarte un empleo. Mantenlo en una página: nombre y enlaces, un resumen de dos o tres líneas, habilidades agrupadas, proyectos (como tu capstone), experiencia y formación. Escribe cada viñeta como acción + qué probaste + resultado, y usa solo números reales. Ejemplo: una viñeta débil es «hice pruebas»; una fuerte es «diseñé 24 casos de prueba para un checkout de práctica con BVA y reporté 5 bugs reproducibles». Adapta el CV a cada oferta y usa sus palabras solo cuando sean verdad en tu caso. Un ATS es un software que lee y filtra currículums, así que usa un diseño sencillo. Postúlate a menos ofertas pero con cuidado, pide referencias con educación y nunca inventes experiencia.'
    },
    keyTerms: [
      { term: 'Impact bullet', def: 'A resume line built from an action verb, what you tested, how you tested it, and a result you can prove.' },
      { term: 'ATS', def: 'Applicant tracking system — software employers use to store, search and filter job applications.' },
      { term: 'Keyword stuffing', def: 'Cramming in tools and buzzwords you cannot back up. It looks padded to readers and falls apart in interviews.' },
      { term: 'Tailoring', def: 'Reordering and rewording your true evidence to match what one specific job description asks for.' },
      { term: 'Referral', def: 'A recommendation from someone inside a company who passes your application to the hiring team.' }
    ],
    practice: [
      { q: 'Rewrite this bullet using action + what + how + result: “Did testing of the login page.”', hint: 'What did you design, with which technique, and what did it produce?', answer: 'For example: “Designed 14 test cases for the PeopleOps practice login using equivalence partitions and boundary values (password 8–64 characters); reported 2 reproducible defects, including a missing lockout that the requirements specified.” Use your real numbers — if you wrote 9 cases, say 9.' },
      { q: 'Write a LinkedIn headline (under 120 characters) for an entry-level tester with manual, API and SQL skills who is learning Playwright.', answer: 'For example: “QA Tester (entry level) · Manual, API & SQL testing · Building Playwright skills · Portfolio on GitHub”. It names the role, the true skills and where the evidence is. Avoid “Expert”, long tool lists, or job titles you have not held.' },
      { q: 'A job ad says: “Must have: test case design, Jira, SQL. Nice to have: Playwright, performance testing.” You have the must-haves (Jira only from a course project) and basic Playwright. Do you apply, and what do you change?', answer: 'Yes — you meet the must-haves. Move your test design and SQL bullets to the top of Projects, mention Jira honestly (“tracked capstone defects on a Jira board”), keep Playwright as a basic but demonstrable skill, and leave out performance testing unless you have real evidence. Use their exact terms wherever they are true.' },
      { q: 'Find the problems in this skills line: “Selenium, Cypress, Playwright, Appium, JMeter, LoadRunner, Burp Suite, Java, Python, C#, Kubernetes ★★★★★”.', answer: 'It is <b>keyword stuffing</b>: far too many tools for a junior to discuss in depth, no grouping, no sense of level, and a star rating that means nothing to a reader and may not parse in an ATS. Keep the tools you used in your projects, group them, and let your bullets show the depth.' }
    ],
    quiz: [
      { q: 'Which resume bullet is strongest for a junior QA applicant?', options: ['Responsible for overall testing and quality of the company website and app', 'Expert in manual, automation, API, performance, security and mobile testing tools', 'Wrote 24 BVA-based cases for a practice checkout; logged 5 reproducible bugs', 'Helped the team improve software quality by 60% through dedicated testing'], correct: 2,
        why: ['“Responsible for” describes a duty, not what you did or achieved.', 'Claiming expertise in everything is not believable for a junior and invites hard questions.', 'Right — a specific action, technique, scope and result you can show.', 'An invented percentage with no measurement behind it damages trust.'] },
      { q: 'Which resume format choice best helps an applicant tracking system read your resume?', options: ['Standard headings such as Skills and Experience in a single-column layout', 'A two-column design with skills shown as star ratings and icon graphics', 'A hidden block of extra keywords typed in white text at the very bottom', 'Exporting the whole resume as one image so the layout never changes'], correct: 0,
        why: ['Right — plain structure and real text are easiest for parsers and people alike.', 'Graphics and complex columns can parse poorly, and star ratings mean little to readers.', 'Hidden text is a known trick; it looks dishonest the moment a person sees the parsed text.', 'Text inside an image may not be read at all.'] },
      { q: 'You parallelised your capstone Playwright suite and its CI run dropped from 11 to 4 minutes. Which bullet is honest and specific?', options: ['Reduced company-wide test execution time by 64%, saving thousands of hours', 'Optimised enterprise CI/CD pipelines across several product teams', 'Significantly improved test performance using advanced techniques', 'Cut my capstone suite’s CI run from 11 to 4 minutes with parallel workers'], correct: 3,
        why: ['There was no company and no thousands of hours; this inflates a practice result.', 'It claims a scope you did not have, and one follow-up question exposes it.', 'Vague — “significantly” and “advanced” give the reader nothing to check.', 'Right — real scope, real numbers and the method used.'] },
      { q: 'A job ad lists manual testing, SQL and Jira as must-haves and Playwright as nice-to-have. You have the must-haves and basic Playwright from your capstone. What is the best move?', options: ['Skip it, because you are not yet an expert in Playwright', 'Apply, mirror their terms where true, and show Playwright as basic', 'Apply and describe Playwright as three years of professional work', 'Send your usual generic resume so you can apply to more jobs today'], correct: 1,
        why: ['Nice-to-haves are not requirements, and you match every must-have.', 'Right — tailor honestly: their words, your real evidence, your real level.', 'Fabricated experience is discovered quickly and can cost you the offer.', 'A generic resume hides your most relevant evidence; tailoring beats volume.'] },
      { q: 'A former classmate works at a company with a junior QA opening. What is the best way to ask for a referral?', options: ['Ask them to promise you an interview because you studied together', 'Send your resume with no message and wait for them to act on it', 'Share the job link, your tailored resume and a short fit summary', 'Message ten of their colleagues you have never spoken to for a referral'], correct: 2,
        why: ['A referral passes your application on; nobody can promise an interview, and pressure strains the relationship.', 'Without the job link and context, they have to do your work for you.', 'Right — you make it easy for them and leave them free to say no.', 'Mass requests to strangers rarely work and can come across as spam.'] }
    ],
    interview: [
      { q: 'You have no professional QA experience. Why should we hire you?', a: 'I will not pretend to have experience I do not have. What I can show is evidence: a capstone where I tested sign-in, cart and checkout through the UI, API and database, with test cases, reproducible bug reports and a small Playwright suite in CI — and I can explain every choice in it. I ask questions early, and in my support job I learned to reproduce customer issues and describe them clearly. I would expect to start on scoped tasks with review, and grow from there.' },
      { q: 'Walk me through your resume.', a: 'I keep it to about a minute and a half and follow the page. A one-line summary of who I am as a tester, then my capstone: what I tested, the main risks and one finding I am proud of. Then relevant experience and the transferable skills from it, and finally what I am learning now. I end by connecting it to the role: “Your ad mentions API testing and SQL — those are the parts of my project I would most like to show you.”' }
    ],
    takeaways: [
      'A junior QA resume fits on one page and leads with evidence.',
      'Write bullets as action + what + how + a result you can prove.',
      'Tailor to each job using the employer’s words — only where they are true.',
      'Keep the layout simple so both an ATS and a person can read it.',
      'Never fake experience; label practice work honestly.'
    ],
    links: { challenges: ['shopflow-checkout', 'bug-report'], interview: ['m2'] }
  },
  {
    id: 'cp-interview-tech',
    n: 3,
    level: 'intermediate',
    title: 'Technical interview preparation',
    summary: 'Prepare for QA technical rounds: answer test-design prompts with a clear method, handle live SQL and Playwright tasks, and think aloud honestly.',
    minutes: 22,
    objectives: [
      'Map the common technical question areas and practise each with real examples',
      'Answer open test-design prompts with clarify, risks, tests, evidence and priorities',
      'Complete live exercises: test cases, an SQL query and a small Playwright test',
      'Think aloud and handle questions you cannot answer without bluffing'
    ],
    body: [
      { t: 'p', html: 'Technical rounds for junior QA roles rarely test trivia for its own sake. Interviewers want to see <b>how you think</b>: do you clarify before testing, do you notice risk, can you explain a concept in your own words, and can you do a small piece of real work — a few test cases, a query, a short script — while talking it through? Preparation means practising those behaviours, not memorising answers word for word.' },
      { t: 'h', text: 'Common question areas' },
      { t: 'table', caption: 'Interview ids refer to questions in this site’s interview bank', head: ['Area', 'Typical questions', 'What they are checking', 'Practise with'], rows: [
        ['Fundamentals', 'Severity vs priority; retest vs regression; verification vs validation; STLC', 'Precise vocabulary, explained with an example', 'Foundations and Manual stages'],
        ['Test design', '“How would you test a login, a pen, an elevator?”; boundary values for a discount', 'Structure, risk focus, techniques', '<code>m1</code>, <code>m5</code>'],
        ['Bug reports', '“The checkout button sometimes does nothing — what goes in the report?”; “not reproducible” pushback', 'Reproducibility, evidence, calm communication', '<code>m2</code>, <code>m4</code>'],
        ['API', 'Testing a create-user endpoint; investigating a 401; useful assertions', 'Status, schema, persistence, auth (401 vs 403)', '<code>a1</code>, <code>a3</code>, <code>a4</code>'],
        ['SQL', 'Join two tables; find duplicates; find orders with no payment', 'Correct joins, filtering, aggregation', 'SQL & API stage'],
        ['Automation', 'Choosing locators; a test that flakes in CI; structuring a journey test', 'Stability, readable structure, debugging', '<code>p1</code>, <code>p2</code>, <code>p3</code>'],
        ['Scenario and release', 'Regression for a changed calculation; a browser unavailable before release; choosing devices', 'Risk-based judgement and honest reporting', '<code>m3</code>, <code>m6</code>, <code>d1</code>']
      ] },
      { t: 'h', text: 'Answering open test-design prompts' },
      { t: 'p', html: '“How would you test a pen?” is not a trick question. It checks whether you jump straight into a list or work with a method. Use the same five steps as the rest of this roadmap and say them out loud. Clarifying questions are not a sign of weakness — they are exactly what a good tester does on the first day of any new feature.' },
      { t: 'flow', caption: 'The interview method used throughout this roadmap', steps: ['Clarify the goal', 'Identify risks', 'Choose representative tests', 'Data and evidence', 'Priorities and limits'] },
      { t: 'cards', items: [
        { title: 'Clarify', html: 'Who uses it, for what, under which constraints? “Is this a login for a bank or a game? Web, mobile or both? Is there MFA, lockout or single sign-on?”' },
        { title: 'Risks', html: 'What would hurt users or the business most? For a login: account takeover, real users locked out, revealing whether an email has an account.' },
        { title: 'Categories', html: 'Functional, boundary and negative, security, usability and accessibility, compatibility, performance — pick the ones that matter <b>here</b>.' },
        { title: 'Prioritise', html: 'Say what you would run first if you had one hour, and what you would leave out and why. That is the senior part of the answer.' }
      ] },
      { t: 'p', html: '<b>Live exercises.</b> Many interviews include a short practical task. Expect one of three: <b>write test cases</b> for a small form, <b>write an SQL query</b> against two or three tables, or <b>read or write a short automation snippet</b>. Interviewers care more about a clear, correct small answer than a large clever one. State your assumptions (“I’ll assume emails are unique”), start simple, then improve.' },
      { t: 'code', lang: 'sql', title: 'Typical SQL tasks — say what each part does as you write it', code: `-- 1. Orders that have no payment record (LEFT JOIN + IS NULL)
SELECT o.id, o.customer_id, o.total
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
WHERE p.id IS NULL;

-- 2. Emails registered more than once (duplicates)
SELECT email, COUNT(*) AS accounts
FROM users
GROUP BY email
HAVING COUNT(*) > 1;` },
      { t: 'code', lang: 'ts', title: 'A small Playwright login test — stable locators, web-first assertions', code: `import { test, expect } from '@playwright/test';

test('registered buyer can sign in', async ({ page }) => {
  await page.goto('/login'); // baseURL comes from playwright.config
  await page.getByLabel('Email').fill('buyer.a@example.test');
  await page.getByLabel('Password').fill(process.env.BUYER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\\/account/);
  await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
});` },
      { t: 'p', html: 'Explain your choices as you go: role and label locators survive styling changes; <code>await expect(locator).toBeVisible()</code> retries until the condition holds, so there is no need for <code>waitForTimeout</code>; the password comes from an environment variable, not the code. If they ask “what else would you test?”, name the negative cases — wrong password, locked account, empty fields — and say you would keep each test independent.' },
      { t: 'h', text: 'Thinking aloud and “I don’t know”' },
      { t: 'compare', a: { title: 'Bluffing', items: ['Guesses confidently and hopes it sounds right', 'Stares silently at the task for five minutes', 'Says “I know Selenium”, then cannot explain a locator', 'Changes the subject to something else'] }, b: { title: 'Honest and useful', items: ['“I haven’t used that tool. Here’s the related concept I do know…”', 'Narrates: “First I’ll check the join, then the filter”', '“I’d verify this in the docs — my guess is X, because…”', 'Asks a clarifying question, then answers it'] } },
      { t: 'callout', tone: 'tip', title: 'If you get stuck', html: 'Say what you know, what you would try next and how you would check it. “I don’t remember the exact syntax for <code>HAVING</code>, but I need to group by email and keep groups with more than one row” earns more credit than a silent pause or a confident wrong answer.' }
    ],
    example: {
      title: 'Worked example: “How would you test an elevator?”',
      blocks: [
        { t: 'p', html: 'A candidate answers out loud, following the method. <b>Clarify:</b> “Is this a passenger lift in an office or a hospital? How many floors? Is there an emergency system, a weight limit, card access for some floors?” The interviewer replies: a 10-floor office building, an 8-person limit, card access to floor 10.' },
        { t: 'table', head: ['Step', 'What the candidate says'], rows: [
          ['Risks', '“Safety first: doors closing on people, moving with the doors open, overload, trapped passengers. Then access control for floor 10, then efficiency.”'],
          ['Functional', 'Call from each floor, select floors inside, doors open and close, the display and chime match the floor'],
          ['Boundaries', 'Floors 1 and 10 (no travel below or above); load at the limit and one person over — expect an overload alarm and no movement'],
          ['Negative and security', 'Press every button at once; request floor 10 with no card and with an expired card'],
          ['Reliability and usability', 'Power cut and alarm-button behaviour; braille, audio announcements, reachable button height']
        ] },
        { t: 'p', html: '<b>Prioritise:</b> “With limited time I’d start with door safety, overload and emergency behaviour, then floor-10 access, then normal travel. Waiting times at rush hour I’d note as a separate performance test with the right tools.” The answer is structured, risk-led and honest about limits. That is what scores — not the number of ideas.' }
      ]
    },
    explain: {
      'ur': 'Technical interview میں یہ دیکھا جاتا ہے کہ آپ کیسے سوچتے ہیں، صرف رٹے ہوئے جواب نہیں۔ اگر پوچھا جائے “login کو کیسے test کریں گے؟” تو فوراً لمبی فہرست شروع نہ کریں۔ پہلے سوال پوچھیں: یہ کس کے لیے ہے، web ہے یا mobile، lockout یا MFA ہے؟ پھر risks بتائیں، جیسے account کا غلط ہاتھوں میں چلے جانا۔ پھر چند اہم tests چنیں: صحیح login، غلط password، خالی fields، boundary values اور security۔ آخر میں بتائیں کہ وقت کم ہو تو پہلے کیا کریں گے۔ SQL یا Playwright کا live task ہو تو بلند آواز میں سوچیں تاکہ interviewer آپ کی سوچ سمجھ سکے۔ اگر کوئی چیز نہیں آتی تو صاف کہیں، اور بتائیں کہ اس سے ملتی جلتی کون سی بات آپ جانتے ہیں اور اسے کیسے check کریں گے۔',
      'ur-Latn': 'Technical interview mein yeh dekha jata hai ke aap kaise sochte hain, sirf ratay hue jawab nahi. Agar poocha jaye “login ko kaise test karenge?” to foran lambi list shuru na karein. Pehle sawal poochein: yeh kis ke liye hai, web hai ya mobile, lockout ya MFA hai? Phir risks batayein, jaise account ka ghalat haathon mein chala jana. Phir kuch ahem tests chunein: sahi login, ghalat password, khaali fields, boundary values aur security. Aakhir mein batayein ke waqt kam ho to pehle kya karenge. SQL ya Playwright ka live task ho to aonchi awaaz mein sochein taa ke interviewer aap ki soch samajh sake. Agar koi cheez nahi aati to saaf kahein, aur batayein ke us se milti julti kaunsi baat aap jaante hain aur usay kaise check karenge.',
      'hi': 'Technical interview में यह देखा जाता है कि आप कैसे सोचते हैं, सिर्फ़ रटे हुए जवाब नहीं। अगर पूछा जाए “login को कैसे test करेंगे?” तो तुरंत लंबी सूची शुरू न करें। पहले सवाल पूछें: यह किसके लिए है, web है या mobile, lockout या MFA है? फिर risks बताएँ, जैसे account का ग़लत हाथों में चले जाना। फिर कुछ ज़रूरी tests चुनें: सही login, ग़लत password, खाली fields, boundary values और security। आख़िर में बताएँ कि समय कम हो तो पहले क्या करेंगे। SQL या Playwright का live task हो तो अपनी सोच बोलते हुए काम करें, ताकि interviewer आपकी सोच समझ सके। अगर कोई चीज़ नहीं आती तो साफ़ कहें, और बताएँ कि उससे मिलती-जुलती कौन-सी बात आप जानते हैं और उसे कैसे check करेंगे।',
      'ar': 'في المقابلة التقنية يريد المُحاوِر أن يرى طريقة تفكيرك، لا إجابات محفوظة. إذا سُئلت «كيف تختبر صفحة تسجيل الدخول؟» فلا تبدأ فورًا بقائمة طويلة. اطرح أولًا أسئلة توضيحية: لمن هذا النظام؟ هل هو ويب أم تطبيق جوال؟ هل يوجد قفل للحساب أو مصادقة متعددة العوامل (MFA)؟ ثم اذكر المخاطر، مثل استيلاء شخص آخر على الحساب. بعد ذلك اختر اختبارات ممثِّلة: دخول صحيح، وكلمة مرور خاطئة، وحقول فارغة، وقيم حدّية (boundary values)، وجوانب أمنية. وفي النهاية قل ماذا ستختبر أولًا إن كان الوقت قصيرًا. في المهام العملية مثل SQL أو Playwright فكّر بصوت مسموع حتى يفهم المُحاوِر طريقتك. وإن لم تعرف شيئًا فقل ذلك بصراحة، ثم اشرح ما تعرفه من مفاهيم قريبة وكيف ستتحقق من الإجابة.',
      'es': 'En una entrevista técnica quieren ver cómo piensas, no respuestas memorizadas. Si te preguntan «¿cómo probarías un login?», no empieces con una lista larga. Primero aclara: ¿para quién es?, ¿web o móvil?, ¿hay bloqueo de cuenta o MFA? Luego nombra los riesgos, como que otra persona tome el control de la cuenta. Después elige pruebas representativas: login correcto, contraseña incorrecta, campos vacíos, valores límite (boundary values) y seguridad. Al final di qué harías primero si el tiempo es corto. En ejercicios en vivo de SQL o Playwright, piensa en voz alta para que el entrevistador siga tu razonamiento. Si no sabes algo, dilo con honestidad, explica qué concepto relacionado conoces y cómo lo comprobarías.'
    },
    keyTerms: [
      { term: 'Clarifying question', def: 'A question asked before testing to pin down users, scope and constraints, such as “Is there an account lockout rule?”' },
      { term: 'Thinking aloud', def: 'Narrating your reasoning while you work, so the interviewer can follow — and help with — your approach.' },
      { term: 'Representative tests', def: 'A small set of tests chosen to cover each important risk and partition, instead of an exhaustive list.' },
      { term: 'Web-first assertion', def: 'A Playwright assertion such as toBeVisible() that keeps retrying until the condition is met or the timeout expires.' },
      { term: 'LEFT JOIN … IS NULL', def: 'An SQL pattern that returns rows from the left table with no match in the right table, such as orders without payments.' }
    ],
    practice: [
      { q: 'You are asked: “How would you test a pen?” Write your first three clarifying questions and your top three risks.', hint: 'A pen for whom, and for what? What would make it fail its purpose?', answer: 'Questions: <b>what kind of pen, and for whom</b> (an office ballpoint, a child’s pen, a pen for signing contracts)? <b>What claims are made</b> (ink lasts a stated distance, waterproof, writes upside down)? <b>Which safety rules apply</b> (for example a child-safe cap with an air hole)? Risks: the cap is a choking hazard; the ink leaks or smears; it stops writing before its claimed life. Then categories: functional (writes, clicks), durability, usability (grip), safety, environment (heat, altitude).' },
      { q: 'Write an SQL query that lists each customer’s name with their number of orders, including customers with zero orders. Tables: <code>customers(id, name)</code> and <code>orders(id, customer_id, total)</code>.', hint: 'Which join keeps customers who have no orders? Which column should you count?', answer: '<code>SELECT c.name, COUNT(o.id) AS order_count FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name;</code> — the <b>LEFT JOIN</b> keeps customers with no orders, and <b>COUNT(o.id)</b> counts only matched orders, so those customers show 0. <code>COUNT(*)</code> would wrongly show 1 for them, because the joined row still exists.' },
      { q: 'An interviewer asks “How does Playwright handle waiting?” and you are unsure of the details. Write an honest, useful answer.', answer: 'For example: “I know the main idea: locator actions such as <code>click()</code> auto-wait for the element to be actionable, and web-first assertions like <code>await expect(locator).toBeVisible()</code> retry until a timeout. So I avoid fixed waits like <code>waitForTimeout</code>. I’m less sure of every actionability check it performs — I’d confirm that in the documentation before relying on it.”' },
      { q: 'Live task: write five test cases for a “Forgot password” form that takes an email address, then put them in priority order.', answer: '<b>1.</b> Registered email → generic confirmation; a reset email arrives with a single-use, expiring link. <b>2.</b> Unregistered email → the <b>same</b> generic message, so the page does not reveal whether an account exists. <b>3.</b> Reset link used twice or after expiry → rejected with a clear message. <b>4.</b> Empty or badly formatted email → validation message, no request sent. <b>5.</b> After reset, the old password fails and the new one works. Priority: 1, 3, 5, 2, 4 — the core journey and security first. Compare interview question <code>m1</code>.' }
    ],
    quiz: [
      { q: 'An interviewer asks “How would you test an elevator?” What is the best first step?', options: ['Ask clarifying questions about the building, users, limits and safety features', 'Immediately list as many test cases as you can to show how much you know', 'Explain that elevators are hardware, so a software tester cannot really test them', 'Start with performance tests, because waiting time is what users complain about most'], correct: 0,
        why: ['Right — clarifying first tells you which risks matter (an office lift is not a hospital lift) and shows a method.', 'Quantity without structure hides your judgement and skips prioritisation.', 'The prompt tests your thinking, not your hardware access; any system can be analysed for risks and tests.', 'Safety risks such as doors and overload outrank waiting time; jumping to one category skips risk analysis.'] },
      { q: 'You need a list of customers who have never placed an order. Which SQL approach fits?', options: ['customers INNER JOIN orders, keeping every row the join returns', 'Select from the orders table only, keeping rows WHERE customer_id IS NULL', 'customers JOIN orders, grouped by customer, HAVING COUNT(*) > 1', 'customers LEFT JOIN orders, keeping rows where orders.id IS NULL'], correct: 3,
        why: ['An inner join keeps only customers who have matching orders — the opposite of what you need.', 'Customers with no orders have no rows in the orders table at all, so that table alone cannot find them.', 'This finds customers with more than one order, not customers with none.', 'Right — the left join keeps every customer, and a NULL order id means no matching order exists.'] },
      { q: 'In a live coding round you forget the exact syntax for a Playwright assertion. What is the best response?', options: ['Stay silent and keep thinking until you remember it, however long it takes', 'Say so, state the intent, write your best attempt and offer to check the docs', 'Replace the assertion with a fixed waitForTimeout(5000) and simply move on', 'Tell the interviewer the assertion is not really needed for this kind of test'], correct: 1,
        why: ['Long silence hides your thinking; interviewers cannot give credit for what they cannot see.', 'Right — intent and honesty show understanding, and exact syntax is easy to look up on the job.', 'A fixed wait is not an assertion; it checks nothing and makes tests slow and flaky.', 'A test without an assertion only proves the script did not crash; it verifies nothing.'] },
      { q: 'Asked “What is the difference between severity and priority?”, which answer is strongest?', options: ['They mean the same thing, and teams simply use whichever word they prefer', 'Severity is set by the developer, and priority by the tester who found the bug', 'Severity is impact; priority is fix urgency (logo typo: low severity, high priority)', 'Priority always follows severity, so a team really only needs one of the two fields'], correct: 2,
        why: ['They are separate fields precisely because impact and urgency can disagree.', 'Usually the tester assesses severity and the product owner or business decides priority.', 'Right — a precise definition plus a concrete example where the two disagree.', 'A crash in a rarely used admin screen can be high severity yet lower priority than a visible checkout typo.'] },
      { q: 'During a live test-case exercise for a “Forgot password” form, which case shows the strongest security thinking?', options: ['Entering a valid registered email shows a confirmation message', 'The submit button is disabled while the email field is empty', 'The page title reads “Forgot password” in every browser tab you check', 'An unregistered email shows the same message as a registered one'], correct: 3,
        why: ['Important for the happy path, but it does not probe any security risk.', 'A reasonable usability check, not a security one.', 'Cosmetic; it carries little risk.', 'Right — identical responses stop attackers from discovering which emails have accounts (account enumeration).'] }
    ],
    interview: [
      { q: 'How would you test a login page?', a: 'I start by clarifying: web or mobile, which credentials, is there a lockout rule, MFA, “remember me” or single sign-on? Then the risks: account takeover, real users locked out, revealing whether an email exists. Functional cases: valid login, wrong password, unknown user, empty fields, password length boundaries. Security: lockout after the agreed number of failures, generic error messages, masked password, a session created only after success, HTTPS. Then usability and accessibility — labels, keyboard use, clear errors — and the main browsers. With limited time I start with the valid journey, lockout and error messages, and <b>say what I left out</b>.' },
      { q: 'Tell me about something technical you do not know yet.', a: 'Honestly, I have not used performance testing tools beyond tutorials. I understand the concepts — load versus stress testing, response-time percentiles such as p95, why the test environment must resemble production — and I know a load test against a live system needs permission. If I needed it here, I would start from the team’s existing scripts, pair with whoever owns them, and practise on a local app first. I would rather tell you that than <b>claim a skill I cannot show</b>.' }
    ],
    takeaways: [
      'Interviewers assess how you think: clarify, risks, representative tests, evidence, priorities.',
      'Practise live tasks — test cases, a join, a short Playwright test — and explain each choice.',
      'Use precise vocabulary with an example: severity vs priority, 401 vs 403, retest vs regression.',
      'Think aloud; silence hides good reasoning.',
      'If you do not know, say so, share related knowledge and explain how you would verify it.'
    ],
    links: { labs: ['login', 'api'], challenges: ['shopflow-checkout'], interview: ['m1', 'm2', 'a1', 'a3', 'p1', 'p2', 'd1'] }
  },
  {
    id: 'cp-interview-behavioral',
    n: 4,
    level: 'intermediate',
    title: 'Behavioural interviews and the STAR method',
    summary: 'Answer behavioural questions with clear STAR stories — missed bugs, conflicts, deadlines, learning — and ask good questions about the role.',
    minutes: 20,
    objectives: [
      'Structure behavioural answers with Situation, Task, Action and Result',
      'Prepare honest stories about a missed bug, a priority disagreement, a deadline and a new tool',
      'Ask interviewers questions that reveal how quality really works in their team',
      'Approach salary and offer conversations calmly, with research and no invented numbers'
    ],
    body: [
      { t: 'p', html: 'Behavioural questions start with “Tell me about a time…”. The idea is that how you handled real situations is a reasonable guide to how you will handle the next one. Interviewers listen for ownership, communication, judgement under pressure and willingness to learn. A rambling story hides those qualities; a structured one shows them. The <b>STAR</b> method gives you that structure.' },
      { t: 'flow', caption: 'STAR — spend most of your time on Action', steps: ['Situation', 'Task', 'Action', 'Result', 'Reflection'] },
      { t: 'table', head: ['Part', 'What to say', 'How long'], rows: [
        ['<b>S</b>ituation', 'Context: project, team, stage', 'One or two sentences'],
        ['<b>T</b>ask', 'Your responsibility, or the problem you had to solve', 'One sentence'],
        ['<b>A</b>ction', 'What <b>you</b> did, step by step — say “I”, not only “we”', 'Most of your answer'],
        ['<b>R</b>esult', 'What happened, with honest evidence — including what did not go well', 'Two or three sentences'],
        ['Reflection (optional)', 'What you learned or now do differently', 'One line']
      ] },
      { t: 'callout', tone: 'tip', title: 'Build a story bank', html: 'Prepare five or six true stories you can adapt: a mistake or missed bug, a disagreement, a deadline, learning something new, a process you improved, and your proudest finding. Learning projects, university work and non-QA jobs all count — just say honestly where each story comes from.' },
      { t: 'h', text: 'Story 1: a bug you missed' },
      { t: 'p', html: 'This question checks ownership. Do not claim you have never missed a bug: testing can show that defects are present but cannot prove they are absent, so nobody believes it. <b>S:</b> “In my capstone, a coupon applied twice when I double-clicked Apply; I had tested single clicks only.” <b>A:</b> “I reproduced it, logged it with steps and a recording, added a double-submit case to my checklist for every form, and wrote an automated check.” <b>R:</b> “A week later the same checklist caught a similar issue in the cart.” Own it, fix the process, show the learning.' },
      { t: 'h', text: 'Story 2: disagreeing with a developer about priority' },
      { t: 'p', html: '<b>Priority is a business decision</b>, so the goal is not to win an argument but to make sure the decision is informed. <b>S/T:</b> “In a team project I logged a bug where a discount rounded one cent too low on some orders. The developer marked it low priority.” <b>A:</b> “I gathered evidence — which test orders were affected and that the invoice total disagreed with the payment amount — and brought it to triage with the product owner instead of debating in comments.” <b>R:</b> “The product owner scheduled it for the next release because reconciliation depended on it. I would have accepted either decision.”' },
      { t: 'h', text: 'Stories 3 and 4: a tight deadline, a new tool' },
      { t: 'compare', a: { title: 'Tight deadline — strong moves', items: ['Ask what the release decision depends on', 'Rank areas by risk and test critical journeys first', 'Share a short status: tested, failed, not tested', 'Say what remains risky instead of claiming full coverage'] }, b: { title: 'Learning a new tool — strong moves', items: ['Name the tool and why you needed it', 'Describe how you learned: docs, a small spike, pairing', 'Show a concrete output: a working test, a CI run', 'Be honest about your current level and next step'] } },
      { t: 'h', text: 'Questions to ask the interviewer' },
      { t: 'list', items: [
        'How is QA involved before development starts — refinement, acceptance criteria, design reviews?',
        'How are bugs triaged, and who decides their priority?',
        'What does the current test automation cover, and who maintains it?',
        'What would success look like for this role in the first three months?',
        'How do new testers get onboarding, mentoring and feedback?'
      ] },
      { t: 'callout', tone: 'info', title: 'Salary and offers — keep it general and calm', html: 'Before the conversation, research typical ranges for the role, level and city from several sources — job ads that show ranges, people you trust, published surveys. If asked for your expectations, give a researched range or ask whether the role has a budgeted range. Compare the <b>whole package</b> (allowances, health cover, leave, learning budget, remote or hybrid days), ask for the offer in writing, and ask for time to decide if you need it. Never invent a competing offer or a current salary. Room to negotiate is often smaller at junior level, and norms differ between countries and companies.' }
    ],
    example: {
      title: 'Worked example: two answers to “Tell me about a tight deadline”',
      blocks: [
        { t: 'compare', a: { title: 'Weak answer', items: ['“We had a deadline and everyone worked really hard.”', '“I tested everything quickly and we released on time.”', 'No “I”, no decisions, no evidence, no risk mentioned'] }, b: { title: 'STAR answer', items: ['<b>S:</b> “In a four-person team project, a checkout change landed one day before our demo.”', '<b>T:</b> “I had half a day to decide what was safe to show.”', '<b>A:</b> “I listed the changed areas, ran checkout smoke and payment-decline cases first, then targeted regression on cart totals, and posted a status: 18 run, 1 failed, coupons not retested.”', '<b>R:</b> “We demoed with coupons hidden and fixed the failure the next day. I learned to ask for change notes earlier.”'] } },
        { t: 'p', html: 'The STAR version is longer only where it matters: the <b>Action</b>. It shows risk-based prioritisation, clear status reporting and honest limits — exactly what a QA team needs when a deadline is close. It also uses numbers the candidate can back up and names what was not retested.' }
      ]
    },
    explain: {
      'ur': 'Behavioural سوالات عموماً “مجھے اس وقت کے بارے میں بتائیں جب…” سے شروع ہوتے ہیں۔ ان سے یہ دیکھا جاتا ہے کہ آپ نے حقیقی حالات میں کیا کیا۔ جواب کو STAR میں ترتیب دیں: Situation یعنی مختصر پس منظر، Task یعنی آپ کی ذمہ داری، Action یعنی آپ نے خود کیا کیا، اور یہی سب سے لمبا حصہ ہو، پھر Result یعنی ایمانداری سے نتیجہ اور آپ نے کیا سیکھا۔ مثال: اگر آپ سے کوئی bug رہ گیا تھا تو اسے مانیں، بتائیں کہ آپ نے اسے کیسے reproduce اور report کیا، اور آئندہ کے لیے کون سا check یا طریقہ شامل کیا۔ developer سے priority پر اختلاف ہو تو بحث کے بجائے ثبوت لے کر product owner کے پاس جائیں، کیونکہ priority کاروباری فیصلہ ہے۔ پانچ چھ سچی کہانیاں پہلے سے تیار رکھیں۔',
      'ur-Latn': 'Behavioural sawal aam tor par “mujhe us waqt ke baare mein batayein jab…” se shuru hote hain. In se yeh dekha jata hai ke aap ne asal halaat mein kya kiya. Jawab ko STAR mein tarteeb dein: Situation yani mukhtasar background, Task yani aap ki zimmedari, Action yani aap ne khud kya kiya — aur yehi sab se lamba hissa ho — phir Result yani imaandari se natija aur aap ne kya seekha. Misaal: agar aap se koi bug reh gaya tha to usay maanein, batayein ke aap ne usay kaise reproduce aur report kiya, aur aage ke liye kaunsa check ya tareeqa add kiya. Developer se priority par ikhtilaf ho to behas ke bajaye saboot le kar product owner ke paas jayein, kyun ke priority business ka faisla hai. Paanch chhe sachi kahaniyan pehle se tayyar rakhein.',
      'hi': 'Behavioural सवाल अक्सर “मुझे उस समय के बारे में बताइए जब…” से शुरू होते हैं। इनसे यह देखा जाता है कि आपने असली हालात में क्या किया। जवाब को STAR में रखें: Situation यानी छोटा-सा background, Task यानी आपकी ज़िम्मेदारी, Action यानी आपने ख़ुद क्या किया — और यही सबसे लंबा हिस्सा हो — फिर Result यानी ईमानदारी से नतीजा और आपने क्या सीखा। उदाहरण: अगर आपसे कोई bug छूट गया था तो उसे मानें, बताएँ कि आपने उसे कैसे reproduce और report किया, और आगे के लिए कौन-सा check या तरीका जोड़ा। Developer से priority पर असहमति हो तो बहस करने के बजाय सबूत लेकर product owner के पास जाएँ, क्योंकि priority एक business फ़ैसला है। पाँच-छह सच्ची कहानियाँ पहले से तैयार रखें।',
      'ar': 'تبدأ الأسئلة السلوكية عادةً بعبارة «حدّثني عن موقف…». والهدف منها معرفة كيف تصرّفت فعلًا في مواقف حقيقية. رتّب إجابتك وفق طريقة STAR: الموقف (Situation) في جملة أو جملتين، والمهمة (Task) أي مسؤوليتك، والإجراء (Action) أي ما فعلته أنت شخصيًا، وهو الجزء الأطول، ثم النتيجة (Result) بصدق مع ما تعلّمته. مثال: إذا فاتك خطأ (bug) ما، فاعترف بذلك، واشرح كيف أعدت إنتاجه وأبلغت عنه، وما الفحص أو الخطوة التي أضفتها لتجنّب تكراره. وإذا اختلفت مع مطوّر حول الأولوية (priority)، فلا تدخل في جدال، بل اعرض الأدلة على مالك المنتج (product owner)، لأن الأولوية قرار يخص العمل. جهّز مسبقًا خمس أو ست قصص حقيقية.',
      'es': 'Las preguntas de comportamiento suelen empezar con «Cuéntame de una vez en que…». Buscan saber cómo actuaste en situaciones reales. Ordena tu respuesta con STAR: Situación (contexto breve), Tarea (tu responsabilidad), Acción (lo que hiciste tú, la parte más larga) y Resultado (qué pasó, con honestidad, y qué aprendiste). Ejemplo: si se te escapó un bug, admítelo, explica cómo lo reprodujiste y lo reportaste, y qué verificación o hábito añadiste para que no se repita. Si un desarrollador no está de acuerdo con la prioridad (priority) de un bug, no discutas: lleva evidencia al product owner, porque la prioridad es una decisión de negocio. Prepara de antemano cinco o seis historias reales.'
    },
    keyTerms: [
      { term: 'Behavioural question', def: 'A question about past behaviour (“Tell me about a time…”) used to judge how you are likely to act in similar situations.' },
      { term: 'STAR', def: 'Situation, Task, Action, Result — a structure for telling a short, complete story with your own actions at the centre.' },
      { term: 'Story bank', def: 'Five or six prepared, true stories you can adapt to many different behavioural questions.' },
      { term: 'Triage', def: 'A meeting or process where bugs are reviewed and given a priority, usually decided by the product owner or business.' },
      { term: 'Total package', def: 'Everything an offer includes — base pay, allowances, health cover, leave, learning budget and working arrangements.' }
    ],
    practice: [
      { q: 'Turn this weak answer into a STAR answer: “I once missed a bug. It happens. The developer fixed it.”', hint: 'What was the situation, what did you do about it, and what changed afterwards?', answer: 'For example: <b>S:</b> “In my capstone, the order history page showed another buyer’s order when I switched accounts without logging out.” <b>T:</b> “I had tested history with one account only, so the gap was mine.” <b>A:</b> “I reproduced it with two accounts, logged it with steps and a recording, added two-user ownership cases to every page that shows personal data, and wrote an API check.” <b>R:</b> “My retest confirmed the fix and the new check runs in CI. I now plan multi-user cases for any personal data.”' },
      { q: 'A developer says your bug is “not important” and closes it. Write the Action part of a STAR answer that respects who decides priority.', answer: '“I reopened the conversation politely and asked what information would help. I added evidence — exact steps, which users are affected and the business impact (totals disagreeing with invoices). I suggested we take it to triage, where the product owner sets priority. I gave my severity assessment, accepted the product owner’s decision, and recorded the risk in the test summary.”' },
      { q: 'Write three questions you would ask at the end of an interview for a junior QA role, and say what each one reveals.', answer: '<b>“Who decides bug priority, and how does triage work?”</b> — shows how quality decisions are made. <b>“What does onboarding look like for a new tester?”</b> — shows whether you will get support and feedback. <b>“What would success look like in the first three months?”</b> — shows expectations, so you can judge fit. Avoid questions their website already answers.' },
      { q: 'An HR interviewer asks: “What are your salary expectations?” Write a calm, general answer without inventing numbers.', answer: 'For example: “From my research on junior QA roles in this city — job ads with ranges and people working in the field — I’m looking for something within the typical range for this level. Could you share the budgeted range for the role? I’m also interested in the overall package, such as learning support and health cover.” If they ask again, give your own researched range. Never quote a fake current salary or competing offer.' }
    ],
    quiz: [
      { q: 'In a STAR answer, which part should usually take the most time?', options: ['Situation, because interviewers need the full background of the project', 'Task, because it explains the job description you had at the time', 'Result, because only the final outcome matters to interviewers', 'Action, because it shows what you personally did and why'], correct: 3,
        why: ['A short context is enough; too much background crowds out what you did.', 'One sentence about your responsibility is enough.', 'Results matter, but without the actions the interviewer cannot judge your behaviour.', 'Right — your decisions and steps are the evidence the question is looking for.'] },
      { q: 'Which answer to “Tell me about a bug you missed” is strongest?', options: ['“I have never missed a single bug, because I always test every case very thoroughly.”', '“I missed a double-submit case, so I logged it and added it to my checklist.”', '“The developer’s code quality was poor, so honestly the missed bug was not my fault.”', '“Bugs always get missed because management never gives testers enough time to test.”'], correct: 1,
        why: ['Not believable — testing cannot prove the absence of defects — and it suggests you do not reflect.', 'Right — ownership, a concrete fix and a process change, all in one line.', 'Blaming others signals poor collaboration; the question is about your part.', 'A general excuse avoids the question and shows no learning.'] },
      { q: 'You and a developer disagree about a bug’s priority. Which action is best to describe in your answer?', options: ['Change the priority field yourself, since you found the bug', 'Escalate to the developer’s manager to make sure you win', 'Bring evidence of impact to triage and let the product owner decide', 'Drop it silently to avoid conflict and keep the relationship good'], correct: 2,
        why: ['Priority is usually a business decision; overriding it on your own damages trust.', 'Going over someone’s head first turns a quality question into a personal conflict.', 'Right — you provide severity and evidence; the product owner weighs business urgency.', 'Silence can let a real risk ship; disagreement can be respectful and evidence-based.'] },
      { q: 'Which question to ask the interviewer best reveals how quality works in their team?', options: ['Who decides bug priority, and how does triage work here?', 'How many days of holiday will I get during my first year here?', 'What does your company do, and who are its main customers?', 'Can I work fully from home every day, starting in week one?'], correct: 0,
        why: ['Right — it shows how decisions about bugs are made and how much weight QA’s voice carries.', 'A fair topic later, usually with HR or at offer stage, but it says nothing about quality.', 'You should research this before the interview; asking it suggests you did not prepare.', 'Working arrangements matter, but this reveals nothing about how the team handles quality.'] },
      { q: 'An offer arrives by phone and you are asked to accept immediately. What is the most professional response?', options: ['Thank them, then ask for it in writing and a day or two to review', 'Accept straight away on the call in case the offer is withdrawn later', 'Say another company has offered more, even though that is not true', 'Decline politely, because an offer made by phone is never serious'], correct: 0,
        why: ['Right — a written offer shows the full terms, and asking for brief review time is normal and professional.', 'Accepting before seeing the terms in writing risks surprises about pay, role or conditions.', 'Inventing a competing offer is dishonest and can backfire if they ask for details.', 'Phone offers are common; ask for the details in writing rather than dismissing it.'] }
    ],
    interview: [
      { q: 'Tell me about a time you disagreed with a developer.', a: '<b>S:</b> In a team project, I reported that a discount was calculated one cent too low on some orders, and the developer marked it low priority. <b>T:</b> I wanted the decision made with full information, not to win an argument. <b>A:</b> I gathered evidence — the exact orders, the rounding rule and the invoice totals that disagreed with payment amounts — and suggested we take it to triage with the product owner. I explained the severity calmly and listened to the developer’s view on effort. <b>R:</b> The product owner scheduled it for the next release. I learned that evidence and the right forum resolve most disagreements.' },
      { q: 'Tell me about a time you had to learn a new tool quickly.', a: '<b>S:</b> For my capstone I needed automated checks, but I had only done manual testing. <b>T:</b> I gave myself two weeks to automate the three most critical journeys. <b>A:</b> I worked through the official Playwright documentation, built one small test first, learned role-based locators and web-first assertions, then added a CI workflow. When a test flaked, I removed a fixed wait and asserted on the visible result instead. <b>R:</b> Six stable tests now run on every push. I am still a beginner with fixtures and parallel runs, and that is what I am learning next.' }
    ],
    takeaways: [
      'STAR gives behavioural answers a clear shape; Action should be the longest part.',
      'Own mistakes: show the fix and the process change — never claim you never miss bugs.',
      'In priority disagreements, bring evidence to triage; priority is a business decision.',
      'Prepare five or six true stories, and say honestly where each one comes from.',
      'For salary, research ranges, weigh the whole package and never invent offers.'
    ],
    links: { challenges: ['bug-report'], interview: ['m4', 'm6'] }
  },
  {
    id: 'cp-metrics',
    n: 5,
    level: 'advanced',
    title: 'QA metrics that matter (and those that mislead)',
    summary: 'Measure quality with metrics that drive decisions — escaped defects, DRE, coverage, flaky rate, DORA — and spot vanity numbers before they mislead.',
    minutes: 24,
    objectives: [
      'Calculate defect density, escaped defects and defect removal efficiency correctly',
      'Distinguish requirements coverage from code coverage and explain what each cannot prove',
      'Use flaky rate and delivery metrics such as lead time and recovery time with care',
      'Recognise vanity metrics and Goodhart’s law, and design a small, honest quality dashboard'
    ],
    body: [
      { t: 'p', html: 'A metric is useful only if it helps someone make a decision: release or wait, invest in automation or in reviews, fix flaky tests now or later. Many QA reports are full of numbers that look impressive and decide nothing — “1,200 test cases, 97% passed”. This lesson covers metrics that tend to inform real decisions, how to calculate them, and how each one can mislead when it is read alone or turned into a target.' },
      { t: 'h', text: 'Defect metrics' },
      { t: 'table', head: ['Metric', 'How to calculate', 'What it tells you', 'Watch out for'], rows: [
        ['Defect density', 'Defects found ÷ size (per KLOC, per feature or per module)', 'Which areas are fragile and deserve more testing or refactoring', 'Size measures vary by language and style; compare within one codebase over time, not across teams'],
        ['Escaped defects', 'Defects found after release — by users, support or monitoring — within a defined window', 'What the process missed and where to strengthen it', 'Classify by severity: one escaped payment bug outweighs ten typos'],
        ['Defect removal efficiency (DRE)', 'Defects found before release ÷ (before + after release) × 100', 'How much of the known defect total was caught before users saw it', 'Depends on the window; a quiet launch with little usage flatters the number'],
        ['Reopen rate', 'Fixed bugs that are reopened ÷ fixed bugs', 'Quality of fixes and of retesting', 'A few complex bugs can swing it; read it with the bug details']
      ] },
      { t: 'callout', tone: 'key', title: 'The DRE formula', html: '<b>DRE = defects found before release ÷ (defects found before release + defects found after release) × 100.</b> Example: 45 found in testing and 5 reported in the first 90 days after release → 45 ÷ 50 × 100 = <b>90%</b>. Always state the window (“90 days after release”) so numbers from different releases are comparable.' },
      { t: 'h', text: 'Coverage: requirements vs code' },
      { t: 'compare', a: { title: 'Requirements coverage', items: ['Share of requirements or acceptance criteria with at least one linked test — and how many of those passed', 'Built from a traceability matrix', 'Shows <b>gaps in what you planned to test</b>', 'Cannot show whether each test is any good'] }, b: { title: 'Code coverage', items: ['Share of code executed by tests: statements, branches, functions or lines', 'Measured by tools during automated test runs', '100% branch coverage implies 100% statement coverage — not the reverse', 'Shows <b>untested code</b>, but executed code is not necessarily verified code'] } },
      { t: 'p', html: 'Both help you find gaps, and both are easy to misread. A test that executes a function but asserts nothing still raises code coverage. A requirement “covered” by one happy-path case is not well tested. And code coverage can never reveal a feature that was never built. Treat low coverage as a <b>prompt to look</b>, and high coverage as <b>necessary but not sufficient</b>.' },
      { t: 'h', text: 'Flakiness and delivery metrics' },
      { t: 'p', html: 'A <b>flaky test</b> passes and fails on the same code with no change. Flaky rate is the share of tests that showed both outcomes on the same commit over a period — for example, failed and then passed on retry. Flakiness destroys trust in CI: people start rerunning and ignoring red builds. Track it, quarantine flaky tests with an owner and a deadline, and fix root causes such as shared data, timing and environment.' },
      { t: 'p', html: 'Team-level delivery metrics popularised by the DORA research programme are widely used to discuss speed and stability together: <b>deployment frequency</b>, <b>lead time for changes</b> (from commit to running in production), <b>change failure rate</b> (share of deployments that cause a failure needing remediation) and <b>time to restore service</b> — often called MTTR, mean time to restore, and named “failed deployment recovery time” in newer DORA reports. They describe the delivery system, not individual testers.' },
      { t: 'h', text: 'Vanity metrics and Goodhart’s law' },
      { t: 'list', items: [
        '<b>Test case count:</b> 1,200 cases says nothing about risk coverage, and it rewards splitting one case into five',
        '<b>Pass rate without context:</b> 98% passing can hide that the 2% failing are all payment tests, or that 50 tests were skipped',
        '<b>Bugs per tester:</b> encourages trivial and duplicate reports and damages collaboration with developers',
        '<b>Automation percentage:</b> “80% automated” can mean many shallow checks and none on the critical journeys'
      ] },
      { t: 'callout', tone: 'warn', title: 'Goodhart’s law', html: 'Commonly stated as “when a measure becomes a target, it ceases to be a good measure”. Reward testers for bug counts and you get many trivial bugs; demand 90% code coverage and you get tests that execute code without asserting anything. Use metrics to <b>ask questions</b>, pair them so one cannot be gamed without another showing it, and never use them to rank individuals.' },
      { t: 'p', html: '<b>A small quality dashboard</b> beats a large one. Pick five or six metrics, each tied to a question a real person asks: “Is it safe to release?”, “Can we trust CI?”, “Are users finding what we miss?”. Show <b>trends</b> across several releases rather than single numbers, pair speed with stability, add one line of interpretation per metric, and review it with the team. If nobody would change a decision because of a number, remove it.' }
    ],
    example: {
      title: 'Worked example: a one-screen quality dashboard for ShopFlow 2.4',
      blocks: [
        { t: 'table', head: ['Metric', 'Release 2.3', 'Release 2.4', 'Reading'], rows: [
          ['Escaped defects, severity 1–2 (90 days)', '3', '1', 'Improving; the one escape was a payment-provider timeout'],
          ['DRE, all severities (90 days)', '45 ÷ 50 = 90%', '38 ÷ 40 = 95%', 'Better — but 2.4 had a quieter launch, so read it alongside usage'],
          ['Requirements coverage, critical journeys', '42 of 48 linked', '48 of 48 linked, 46 passed', 'Two open failures are known, accepted risks'],
          ['Flaky rate in CI (two weeks)', '6%', '2%', 'Quarantine plus test-data fixes worked'],
          ['Median lead time for changes', '4 days', '3 days', 'Faster, with change failure rate stable']
        ] },
        { t: 'p', html: 'Notice what is <b>not</b> there: total test cases, a raw pass rate and bugs per tester. Every row answers a question, shows a trend and carries one line of interpretation. The team lead reads it in a minute and asks the right follow-up: “What made the 2.4 launch quieter, and does that flatter the DRE?”' }
      ]
    },
    explain: {
      'ur': 'Metric تبھی مفید ہے جب وہ کسی فیصلے میں مدد کرے۔ ایک اہم metric ہے DRE یعنی Defect Removal Efficiency: release سے پہلے ملنے والے defects کو کل defects (پہلے + بعد) سے تقسیم کر کے 100 سے ضرب دیں۔ مثال: testing میں 45 bugs ملے اور release کے بعد پہلے 90 دنوں میں users نے 5 بتائے، تو DRE = 45 ÷ 50 × 100 = 90%۔ Release کے بعد ملنے والے bugs کو escaped defects کہتے ہیں۔ Code coverage صرف یہ بتاتی ہے کہ کون سا code چلا، یہ نہیں کہ اسے صحیح طرح check کیا گیا۔ صرف test cases کی تعداد یا pass rate دکھانا vanity metric ہے۔ Goodhart’s law یاد رکھیں: جب کوئی پیمانہ ہدف بن جائے تو وہ اچھا پیمانہ نہیں رہتا۔ کم metrics رکھیں، trend دکھائیں اور لوگوں کی ranking نہ کریں۔',
      'ur-Latn': 'Metric tabhi mufeed hai jab woh kisi faisle mein madad kare. Ek ahem metric hai DRE yani Defect Removal Efficiency: release se pehle milne wale defects ko kul defects (pehle + baad) se divide kar ke 100 se multiply karein. Misaal: testing mein 45 bugs mile aur release ke baad pehle 90 dinon mein users ne 5 bataye, to DRE = 45 ÷ 50 × 100 = 90%. Release ke baad milne wale bugs ko escaped defects kehte hain. Code coverage sirf yeh batati hai ke kaunsa code chala, yeh nahi ke usay sahi tarah check kiya gaya. Sirf test cases ki ginti ya pass rate dikhana vanity metric hai. Goodhart’s law yaad rakhein: jab koi paimana target ban jaye to woh achha paimana nahi rehta. Kam metrics rakhein, trend dikhayein aur logon ki ranking na karein.',
      'hi': 'Metric तभी काम का है जब वह किसी फ़ैसले में मदद करे। एक ज़रूरी metric है DRE यानी Defect Removal Efficiency: release से पहले मिले defects को कुल defects (पहले + बाद) से भाग देकर 100 से गुणा करें। उदाहरण: testing में 45 bugs मिले और release के बाद पहले 90 दिनों में users ने 5 बताए, तो DRE = 45 ÷ 50 × 100 = 90%। Release के बाद मिलने वाले bugs को escaped defects कहते हैं। Code coverage सिर्फ़ यह बताती है कि कौन-सा code चला, यह नहीं कि उसे सही तरह check किया गया। सिर्फ़ test cases की गिनती या pass rate दिखाना vanity metric है। Goodhart’s law याद रखें: जब कोई पैमाना लक्ष्य बन जाए, तो वह अच्छा पैमाना नहीं रहता। कम metrics रखें, trend दिखाएँ और लोगों की ranking न करें।',
      'ar': 'المقياس (metric) مفيد فقط إذا ساعد في اتخاذ قرار، مثل: هل نُصدر النسخة أم ننتظر؟ من أهم المقاييس كفاءة إزالة العيوب (DRE): اقسم عدد العيوب المكتشفة قبل الإصدار على مجموع العيوب (قبل الإصدار وبعده) ثم اضرب الناتج في 100. مثال: وُجد 45 خطأ أثناء الاختبار، وأبلغ المستخدمون عن 5 أخطاء في أول 90 يومًا بعد الإصدار، إذن DRE = 45 ÷ 50 × 100 = 90%. العيوب التي تُكتشف بعد الإصدار تُسمّى العيوب المتسرّبة (escaped defects). تغطية الشيفرة (code coverage) تخبرك بالشيفرة التي نُفِّذت، لا بأنها فُحصت جيدًا. أما عرض عدد حالات الاختبار أو نسبة النجاح وحدها فهو مقياس شكلي (vanity metric). وتذكّر قانون غودهارت: عندما يصبح المقياس هدفًا، يتوقف عن كونه مقياسًا جيدًا. استخدم مقاييس قليلة، واعرض الاتجاهات، ولا تُصنِّف الأفراد بها.',
      'es': 'Una métrica solo sirve si ayuda a tomar una decisión. Una métrica clave es la DRE (Defect Removal Efficiency): divide los defectos encontrados antes del lanzamiento entre el total de defectos (antes + después) y multiplica por 100. Ejemplo: en pruebas se encontraron 45 bugs y los usuarios reportaron 5 en los primeros 90 días tras el lanzamiento, así que DRE = 45 ÷ 50 × 100 = 90%. Los bugs que aparecen después del lanzamiento se llaman defectos escapados (escaped defects). La cobertura de código (code coverage) indica qué código se ejecutó, no que se haya verificado bien. Mostrar solo el número de casos o el porcentaje de aprobados es una métrica de vanidad. Recuerda la ley de Goodhart: cuando una medida se convierte en objetivo, deja de ser una buena medida. Usa pocas métricas, muestra tendencias y nunca clasifiques a personas.'
    },
    keyTerms: [
      { term: 'Defect removal efficiency (DRE)', def: 'Defects found before release ÷ (defects found before + after release, within a stated window) × 100.' },
      { term: 'Escaped defect', def: 'A defect found after release — by users, support or monitoring — that earlier testing did not catch.' },
      { term: 'Defect density', def: 'Defects found relative to size, such as per KLOC, feature or module; best compared within one codebase over time.' },
      { term: 'Flaky test', def: 'A test that both passes and fails on the same code without any change, often because of timing, data or environment.' },
      { term: 'Vanity metric', def: 'A number that looks impressive but informs no decision, such as a raw count of test cases.' },
      { term: 'Goodhart’s law', def: 'When a measure becomes a target, it ceases to be a good measure — people optimise the number instead of the goal.' }
    ],
    practice: [
      { q: 'Release 3.1: testing found 72 defects; in the 90 days after release, users and monitoring reported 8 more. Calculate DRE and say what else you would want to know.', hint: 'Before ÷ (before + after) × 100.', answer: 'DRE = 72 ÷ (72 + 8) × 100 = <b>90%</b>. Before drawing conclusions, ask: how severe were the 8 escapes (one payment failure matters more than eight typos)? Was usage after release normal, or was the launch quiet? Is the 90-day window the same as for previous releases? Which part of the process should have caught each escape?' },
      { q: 'Module A has 18 defects in 6 KLOC; module B has 10 defects in 2 KLOC. Which looks more fragile, and what caution would you add?', answer: 'Density: A = 18 ÷ 6 = <b>3 per KLOC</b>; B = 10 ÷ 2 = <b>5 per KLOC</b>, so B looks more fragile per unit of code and may deserve more testing or review. Cautions: defect counts depend on how much each module was tested, severity is ignored, and KLOC is a rough size measure — use it to ask questions, not to blame a team.' },
      { q: 'Your manager wants to report “98% of tests passed” to leadership. What context would you add so the number does not mislead?', answer: 'Which tests failed and what they cover (if the 2% are checkout or payment tests, that may block release); how many tests were <b>skipped or quarantined</b>; whether failures are product bugs, test issues or environment problems; how the suite maps to critical requirements; and the trend over recent builds. A pass rate alone is not a release recommendation.' },
      { q: 'Leadership proposes rewarding testers by the number of bugs logged per month. Using Goodhart’s law, explain the risk and suggest a better approach.', answer: 'Once bug count becomes a target, people optimise the count: trivial and duplicate reports, one defect split into several, and friction with developers — while the real goal, fewer serious escapes, may not improve at all. Better: track team-level outcomes such as severe escaped defects and DRE trends, review the <b>quality</b> of reports, and use metrics to start conversations, not to rank individuals.' }
    ],
    quiz: [
      { q: 'Testing found 45 defects before release, and 5 more were reported in the 90 days after release. What is the DRE?', options: ['10%', '50%', '90%', '45%'], correct: 2,
        why: ['That is the escaped share (5 ÷ 50), not the removal efficiency.', 'That would mean as many defects escaped as were caught; it does not follow from the numbers.', 'Right — 45 ÷ (45 + 5) × 100 = 90%.', 'That is the raw count of pre-release defects, not a share of the total.'] },
      { q: 'A suite reports 100% statement coverage. What can you correctly conclude?', options: ['The code has been fully verified and has no remaining defects', 'Every statement ran at least once during the tests', 'Every branch and condition outcome was exercised', 'Every requirement has been verified by at least one test'], correct: 1,
        why: ['Executing code is not verifying it, and testing cannot prove the absence of defects.', 'Right — that is all statement coverage measures; it says nothing about assertions or missing logic.', 'Statement coverage does not imply branch coverage: an <code>if</code> with no <code>else</code> can be fully covered without ever taking the false path. The reverse holds.', 'Code coverage is not requirements coverage; a missing feature has no code to cover.'] },
      { q: 'Which of these is most likely to be a vanity metric when shown on its own?', options: ['Severe escaped defects per release, tracked over several releases', 'Flaky test rate in CI, measured over the last two weeks', 'Lead time from commit to production, as a median', 'Total number of test cases in the test management tool'], correct: 3,
        why: ['This tracks outcomes users feel and shows where to strengthen testing.', 'This shows whether CI results can be trusted and guides maintenance work.', 'This informs delivery speed and is usually read alongside change failure rate.', 'Right — a count of cases says nothing about risk coverage or quality, and it is easy to inflate by splitting cases.'] },
      { q: 'After testers were rewarded for code coverage above 90%, coverage rose fast but escaped defects did not fall. What best explains this?', options: ['Goodhart’s law: tests were written to raise the number, not to verify behaviour', 'Code coverage tools are always inaccurate, so teams should never use them', 'Escaped defects are random, so no kind of testing can influence them', 'The coverage target was simply too low and should be raised to 100% next quarter'], correct: 0,
        why: ['Right — once coverage became the target, tests that execute code without meaningful assertions raised the number without improving quality.', 'The tools measure execution accurately; the problem is what people did to hit the target.', 'Escapes have causes you can analyse and address through better test design and review.', 'A higher target strengthens the same incentive and makes the gaming worse.'] },
      { q: 'Which statement about the DORA delivery metrics is accurate?', options: ['They are designed to rank individual testers and developers by their speed', 'They pair speed measures with stability measures for a whole team', 'They fully replace the need for defect, coverage and flakiness metrics', 'They measure how many automated tests a team runs on each deployment'], correct: 1,
        why: ['They describe a team’s delivery system; using them to rank individuals invites gaming.', 'Right — deployment frequency and lead time show speed, while change failure rate and recovery time show stability.', 'They complement testing metrics; they do not tell you which risks were tested.', 'None of them counts tests; they measure deployments, lead time, failures and recovery.'] }
    ],
    interview: [
      { q: 'Which QA metrics would you track, and why?', a: 'I pick a few that answer real questions. For “are we catching problems before users do?”: <b>escaped defects by severity</b> and <b>DRE</b> with a fixed window. For “can we trust our safety net?”: <b>flaky rate</b> and requirements coverage for critical journeys. For delivery: lead time and change failure rate, so speed and stability are read together. I show trends with one line of interpretation, avoid vanity numbers such as total test cases or a pass rate without context, and never use metrics to rank individuals — Goodhart’s law makes that backfire.' },
      { q: 'Our pass rate is 99%. Are we ready to release?', a: 'Not on that number alone. I would want to know what the 1% covers — one failing payment test can block a release — how many tests are skipped or quarantined, and whether the suite covers the changed areas and critical requirements. I would also check open severe defects, exploratory results on the change, and known environment issues. Then I give a recommendation with the <b>residual risks stated</b>, and the product owner makes the release decision.' }
    ],
    takeaways: [
      'A metric earns its place only if it changes a decision.',
      'DRE = before ÷ (before + after) × 100 — always state the counting window.',
      'Code coverage shows what ran, not what was verified; requirements coverage shows planned gaps.',
      'Raw test counts and pass rates without context are vanity metrics.',
      'Goodhart’s law: targets get gamed — pair metrics and never rank individuals.'
    ],
    links: { interview: ['m3', 'm6', 'p2'] }
  },
  {
    id: 'cp-career',
    n: 6,
    level: 'advanced',
    title: 'Career paths, certifications and growing into a lead',
    summary: 'Explore QA career paths, judge certifications such as ISTQB realistically, plan continuous learning, and grow influence as a mentor and lead.',
    minutes: 22,
    objectives: [
      'Compare the main QA career paths and the skills each one builds on',
      'Describe ISTQB Foundation and higher-level options accurately, without overclaiming their value',
      'Create a realistic continuous-learning plan with evidence at each step',
      'Explain how leads, mentors and quality coaches influence quality culture'
    ],
    body: [
      { t: 'p', html: 'There is no single QA career ladder. After a year or two of solid testing, most people feel pulled in one of a few directions: deeper technical work, a specialism, or leading people and practices. You do not need to choose on day one. Notice which problems you enjoy — debugging flaky pipelines, finding security holes, making apps usable for everyone, or helping a team work better — and grow evidence in that direction.' },
      { t: 'h', text: 'Common paths' },
      { t: 'cards', items: [
        { title: 'Automation / SDET', html: 'Builds and maintains test frameworks, API and UI suites, CI pipelines and test-data tooling. Needs solid programming, design and debugging skills.' },
        { title: 'Performance', html: 'Designs load, stress and soak tests, analyses percentiles and bottlenecks, and works closely with developers and operations.' },
        { title: 'Security', html: 'Starts with authorization checks and common web risks; deeper penetration testing needs specialist training and explicit permission.' },
        { title: 'Accessibility', html: 'Tests against WCAG with keyboards, screen readers and contrast tools, and coaches teams to build accessible products from the start.' },
        { title: 'QA lead / manager', html: 'Owns test strategy, planning and risk reporting, mentors testers, and represents quality in release decisions.' },
        { title: 'Quality coach', html: 'Helps whole teams own quality — pairing, workshops, sharper acceptance criteria — rather than testing everything personally.' }
      ] },
      { t: 'p', html: 'Paths also connect sideways: testers move into business analysis, product, DevOps or development, and take their risk-thinking with them. Titles vary between companies — an “SDET” in one place is a “QA Automation Engineer” in another — so read the responsibilities, not just the title.' },
      { t: 'h', text: 'Certifications: ISTQB in perspective' },
      { t: 'table', caption: 'ISTQB module names and syllabus versions change — check the current portfolio before you plan', head: ['Level', 'Examples', 'Realistic value'], rows: [
        ['Foundation', '<b>CTFL</b> — Certified Tester Foundation Level', 'Shared vocabulary and a broad overview; mentioned in some job ads; the usual prerequisite for higher ISTQB certifications'],
        ['Advanced', 'Test Analyst, Technical Test Analyst, Test Management', 'Deeper technique and management knowledge; most useful once you have real project experience'],
        ['Agile and specialist', 'Modules on agile testing, test automation, performance, security, accessibility, mobile and AI testing', 'Structured learning in one area; its value depends on the role, the employer and the region']
      ] },
      { t: 'callout', tone: 'key', title: 'Certificates support evidence — they do not replace it', html: 'A certificate shows you studied a body of knowledge and passed an exam. It does not show that you can design good tests, write a clear bug report or debug a flaky pipeline. Some employers and regions value CTFL in screening; many hiring decisions still rest on your portfolio and interview. If you take it, learn the material properly — the vocabulary genuinely helps in interviews — and keep building practical evidence alongside it.' },
      { t: 'h', text: 'A continuous-learning plan' },
      { t: 'list', ordered: true, items: [
        '<b>Choose one direction per quarter</b> — for example API automation or accessibility — rather than five tools at once',
        '<b>Set a concrete output:</b> a small project, a test suite, an internal demo or a short write-up',
        '<b>Learn from primary sources:</b> official documentation, standards and syllabi, plus practice on apps you are allowed to test',
        '<b>Get feedback:</b> code review, a mentor or a community of practice',
        '<b>Reflect and record:</b> update your portfolio and resume with honest evidence, then choose the next step'
      ] },
      { t: 'h', text: 'Growing into a lead: mentoring and quality culture' },
      { t: 'p', html: 'Leadership in quality starts before the title. You lead when you <b>mentor</b> a newer tester — pairing on a test design, reviewing a bug report kindly and specifically — and when you are mentored yourself, bringing concrete questions to someone more experienced. You <b>influence quality culture</b> when you join refinement to sharpen acceptance criteria, pair with developers on unit and API tests, run a short bug bash before a release, or suggest a blameless review after an incident.' },
      { t: 'compare', a: { title: 'Quality as a gate', items: ['Testers “sign off” at the very end', 'Bugs are found late and argued about', 'Metrics are used to judge people', 'Knowledge stays in a few heads'] }, b: { title: 'Quality as a shared habit', items: ['Testers join from refinement onwards', 'Risks are discussed before code is written', 'Metrics are used to ask better questions', 'Practices are shared through a community of practice'] } },
      { t: 'p', html: 'A <b>community of practice</b> is a regular, voluntary group of people who share a craft — for example testers across several teams. Start small: a fortnightly 45-minute session, rotating presenters, one shared notes page and a short list of agreed practices such as a bug-report template or locator guidelines. Invite developers and product people too. The value is not the meetings themselves but faster learning, consistent standards and a network of people who help each other.' }
    ],
    example: {
      title: 'Worked example: Hina’s first-year growth plan in a junior QA role',
      blocks: [
        { t: 'table', head: ['Quarter', 'Focus', 'Evidence at the end'], rows: [
          ['Q1', 'Learn the product, its risks and the team’s process; ask a lot of questions', 'A risk map of the main journeys, reviewed with her lead'],
          ['Q2', 'API testing and SQL checks for her squad’s features', 'A shared Postman collection with negative and auth checks; two escaped-defect reviews'],
          ['Q3', 'Playwright basics with a mentor', 'Five stable journey tests in CI, reviewed by a developer'],
          ['Q4', 'Study for CTFL alongside work; start mentoring a new intern', 'Exam taken; an onboarding checklist for new testers']
        ] },
        { t: 'p', html: 'Each quarter has one focus and one piece of evidence. The certification sits <b>alongside</b> practical work rather than replacing it, and mentoring starts early — explaining things to someone newer is one of the fastest ways to deepen your own understanding. Plans like this change as the job changes, and that is normal.' }
      ]
    },
    explain: {
      'ur': 'QA میں ترقی کا کوئی ایک ہی راستہ نہیں۔ ایک دو سال کی اچھی testing کے بعد آپ automation یا SDET، performance، security، accessibility، QA lead یا manager، یا quality coach کی طرف جا سکتے ہیں۔ ISTQB کا CTFL (Foundation Level) ایک عام پہلا certificate ہے: یہ testing کی بنیادی اصطلاحات سکھاتا ہے اور عموماً advanced levels کے لیے شرط ہوتا ہے۔ لیکن یہ عملی مہارت کا ثبوت نہیں؛ portfolio اور interview کی کارکردگی اب بھی بہت اہم ہیں۔ سیکھنے کا منصوبہ یوں بنائیں: ہر تین مہینے میں ایک focus، جیسے API automation، اور آخر میں ایک ٹھوس نتیجہ، جیسے CI میں چلنے والے پانچ مستحکم tests۔ Lead بننے کی تیاری عہدے سے پہلے شروع ہوتی ہے: نئے testers کی mentoring کریں، refinement میں شامل ہوں، developers کے ساتھ pairing کریں، اور testers کی ایک community of practice بنائیں۔',
      'ur-Latn': 'QA mein taraqqi ka koi ek hi rasta nahi. Ek do saal ki testing ke baad aap automation ya SDET, performance, security, accessibility, QA lead ya manager, ya quality coach ki taraf ja sakte hain. ISTQB ka CTFL (Foundation Level) ek aam pehla certificate hai: yeh testing ki buniyadi terms sikhata hai aur aam tor par advanced levels ke liye shart hota hai. Lekin yeh practical skill ka saboot nahi; portfolio aur interview ki performance ab bhi bohat ahem hain. Seekhne ka plan aise banayein: har teen mahine mein ek focus, jaise API automation, aur aakhir mein ek thos result, jaise CI mein paanch stable tests. Lead banne ki tayyari ohde se pehle shuru hoti hai: naye testers ki mentoring karein, refinement mein shamil hon, developers ke saath pairing karein, aur testers ki ek community of practice banayein.',
      'hi': 'QA में आगे बढ़ने का कोई एक ही रास्ता नहीं है। एक-दो साल की testing के बाद आप automation या SDET, performance, security, accessibility, QA lead या manager, या quality coach की तरफ़ जा सकते हैं। ISTQB का CTFL (Foundation Level) एक आम पहला certificate है: यह testing की बुनियादी शब्दावली सिखाता है और आम तौर पर advanced levels के लिए शर्त होता है। लेकिन यह practical skill का सबूत नहीं है; portfolio और interview का प्रदर्शन अब भी बहुत अहम हैं। सीखने की योजना ऐसे बनाएँ: हर तीन महीने में एक focus, जैसे API automation, और आख़िर में एक ठोस नतीजा, जैसे CI में पाँच stable tests। Lead बनने की तैयारी पद मिलने से पहले शुरू होती है: नए testers की mentoring करें, refinement में शामिल हों, developers के साथ pairing करें, और testers की एक community of practice बनाएँ।',
      'ar': 'لا يوجد طريق واحد للتقدّم في مجال ضمان الجودة. بعد سنة أو سنتين من الاختبار الجيد يمكنك أن تتجه إلى الأتمتة (automation أو SDET)، أو اختبار الأداء، أو الأمن، أو إمكانية الوصول (accessibility)، أو قيادة فريق الجودة وإدارته، أو العمل مدرّبًا للجودة (quality coach). شهادة CTFL من ISTQB (المستوى التأسيسي) شهادة أولى شائعة: تعلّمك المصطلحات الأساسية للاختبار، وهي في العادة شرط مسبق للمستويات المتقدمة. لكنها ليست دليلًا على المهارة العملية، فملف أعمالك وأداؤك في المقابلة ما زالا مهمّين جدًا. خطّط لتعلّمك هكذا: تركيز واحد كل ثلاثة أشهر، مثل أتمتة API، مع نتيجة ملموسة في النهاية، مثل خمسة اختبارات مستقرة تعمل في CI. والاستعداد للقيادة يبدأ قبل المنصب: وجّه المختبرين الجدد (mentoring)، وشارك في جلسات refinement، واعمل مع المطوّرين بأسلوب pairing، وأنشئ مجتمع ممارسة (community of practice) للمختبرين.',
      'es': 'No existe una única escalera profesional en QA. Tras uno o dos años de buen testing puedes orientarte hacia automatización o SDET, rendimiento, seguridad, accesibilidad, liderazgo o gestión de QA, o quality coach. La certificación CTFL de ISTQB (nivel Foundation) es un primer certificado común: enseña el vocabulario básico de pruebas y suele ser requisito para los niveles avanzados. Pero no demuestra habilidad práctica; tu portafolio y tu desempeño en la entrevista siguen siendo muy importantes. Planifica tu aprendizaje así: un foco por trimestre, como automatización de API, con un resultado concreto al final, por ejemplo cinco tests estables en CI. Prepararte para liderar empieza antes del cargo: haz mentoring a testers nuevos, participa en el refinement, trabaja en pareja con desarrolladores y crea una comunidad de práctica de testers.'
    },
    keyTerms: [
      { term: 'SDET', def: 'Software Development Engineer in Test — a role focused on building test frameworks, tooling and automated suites, with strong coding skills.' },
      { term: 'CTFL', def: 'ISTQB Certified Tester Foundation Level — an entry-level certification covering testing vocabulary and fundamentals.' },
      { term: 'Quality coach', def: 'A role that helps whole teams own quality through coaching, pairing and better practices, rather than testing everything personally.' },
      { term: 'Community of practice', def: 'A regular, voluntary group of people who share a craft and learn together, such as testers across several teams.' },
      { term: 'Blameless review', def: 'A post-incident review that looks for causes in systems and processes rather than individuals to blame.' }
    ],
    practice: [
      { q: 'A colleague says: “Get ISTQB CTFL and you’ll definitely get hired.” Rewrite this as an accurate statement.', answer: 'For example: “CTFL gives you shared testing vocabulary and a broad overview, and some employers mention it in job ads or use it in screening. It does not prove you can design tests or debug failures, and it guarantees nothing. Combine it with a portfolio and practical skills — that combination is what interviews actually probe.”' },
      { q: 'Write a one-quarter learning plan for moving towards automation: one focus, three activities and one piece of evidence.', answer: '<b>Focus:</b> UI and API automation with Playwright and TypeScript. <b>Activities:</b> work through the official docs and build one test per week on a permitted practice app; pair with a developer to review your code; add the suite to CI with traces on failure. <b>Evidence:</b> 6–8 independent, stable tests running on every push, plus a README explaining your locator and test-data choices.' },
      { q: 'You are asked to start a testing community of practice across three teams. Outline your first month.', hint: 'Start small, useful and voluntary.', answer: '<b>Week 1:</b> ask testers and developers what they struggle with; pick a time and a 45-minute format. <b>Week 2:</b> first session — one short talk (for example on writing better bug reports) and an open discussion; create a shared notes page. <b>Week 3:</b> agree one small shared practice, such as a bug-report template. <b>Week 4:</b> second session with a different presenter; collect feedback and adjust.' },
      { q: 'A developer keeps closing your bugs as “works on my machine”. As someone growing into a lead, how could you improve the process instead of arguing each case?', answer: 'Suggest team-level fixes: a bug-report template with environment, build, data and evidence fields; short pairing sessions to reproduce issues together; aligning test and development environments or documenting the differences; and a definition of done that says how bugs are verified. Raise it in a retrospective as a process question, not a personal one.' }
    ],
    quiz: [
      { q: 'Which statement about ISTQB CTFL is most accurate?', options: ['It guarantees you a QA job offer shortly after you pass the exam', 'It is legally required before anyone can be employed as a software tester', 'It replaces the need for a portfolio, since it proves your practical skill', 'It covers testing fundamentals and is the usual base for higher levels'], correct: 3,
        why: ['No certificate guarantees employment; hiring depends on many factors.', 'There is no such general legal requirement; some employers simply prefer or request it.', 'An exam tests knowledge of a syllabus, not the ability to design tests or debug failures.', 'Right — it gives shared vocabulary and fundamentals, and is generally the prerequisite for ISTQB Advanced Level certifications.'] },
      { q: 'A tester enjoys coding, debugging CI pipelines and building reusable test tools. Which path fits best?', options: ['Automation engineer / SDET', 'Accessibility testing specialist', 'QA manager of several teams', 'Business analyst on a product team'], correct: 0,
        why: ['Right — frameworks, CI and tooling are the core of automation and SDET work.', 'Accessibility work uses tools too, but its focus is WCAG, assistive technology and inclusive design.', 'Management focuses on people, planning and risk reporting more than on building tools.', 'Business analysis focuses on requirements and stakeholders rather than code and pipelines.'] },
      { q: 'Which action best shows a tester influencing quality culture rather than only finding bugs?', options: ['Logging more bugs than anyone else on the team each sprint', 'Testing every story alone at the end of the sprint before sign-off', 'Joining refinement to sharpen acceptance criteria before coding starts', 'Keeping your test knowledge private so the whole team has to depend on you'], correct: 2,
        why: ['Bug counts measure output, not culture, and can create friction.', 'Testing alone at the end treats quality as a gate rather than a shared habit.', 'Right — sharper criteria prevent defects and help the whole team think about risk early.', 'Hoarding knowledge creates a bottleneck; leads spread knowledge.'] },
      { q: 'You want to grow into a QA lead within a few years. Which first step is most realistic?', options: ['Wait until you are promoted before doing any mentoring or test planning', 'Mentor a newer tester and take ownership of test planning for one feature', 'Collect as many certificates as you possibly can, as quickly as you can', 'Switch companies every few months so that you collect senior titles faster'], correct: 1,
        why: ['Leadership is usually shown before the title, not after it.', 'Right — mentoring and owning a plan build the exact skills and evidence a lead role needs.', 'Certificates can support learning, but they do not show leadership or judgement.', 'Very short stays rarely build the depth, trust and results a lead role requires.'] },
      { q: 'What makes a testing community of practice most likely to succeed?', options: ['Making attendance mandatory and tracking everyone who misses a session', 'Inviting only senior testers, so that the discussions always stay advanced', 'Holding one long annual workshop instead of short, regular sessions', 'Regular short sessions, rotating presenters and shared agreed practices'], correct: 3,
        why: ['Forced attendance turns a learning community into a meeting people resent.', 'Excluding juniors removes the people who benefit most and narrows perspectives.', 'Learning sticks through regular practice; one event a year loses momentum.', 'Right — regular, voluntary sessions with shared ownership and practical outputs keep it useful.'] }
    ],
    interview: [
      { q: 'Where do you see yourself in a few years?', a: 'First I want to become a strong all-round tester — solid test design, API and database checks — and then go deeper into automation, because I enjoy building reliable checks and debugging pipelines. Within a few years I would like to own the test approach for a product area and <b>mentor newer testers</b>. I am open about the exact path; I would rather grow where I can add the most value here than chase a title.' },
      { q: 'Is ISTQB certification worth it?', a: 'It can be, for the right reasons. CTFL gives a shared vocabulary and a broad overview of testing, and some employers mention it in job ads. But it is a knowledge exam — it does not show whether someone can design good tests or communicate risk. I see it as a <b>useful complement to practical evidence, not a substitute</b>. If I took a further certification, I would pick one that matches the work I am doing, such as automation or test management.' }
    ],
    takeaways: [
      'QA careers branch into automation/SDET, performance, security, accessibility, leadership and coaching.',
      'CTFL teaches fundamentals and opens higher ISTQB levels, but it does not prove practical skill.',
      'Learn in focused quarters, each ending with honest, visible evidence.',
      'Leadership starts before the title: mentor, plan and improve how the team works.',
      'Communities of practice spread knowledge and standards across teams.'
    ],
    links: { interview: ['p4', 'm6'] }
  }
  /* @@LESSONS-END */
]);

QA_CONTENT.addBank('capstone', [
  { level: 'beginner', topic: 'cp-portfolio', q: 'You were a QA intern at a fintech startup and want to show that work in your public portfolio. What is the right approach?', options: ['Upload the test cases you wrote there, with the company name carefully removed', 'Describe the work generally and rebuild similar artifacts on a practice app', 'Post screenshots of their staging app, with all customer names carefully blurred', 'Copy their Postman collection into your repo, after deleting every token first'], correct: 1,
    why: ['Removing the name does not make confidential work yours to publish; the content still belongs to the company.', 'Right — you can talk about what you did without publishing their material, and prove the skills with a project you own.', 'Screens of internal systems reveal confidential product details even with names blurred.', 'Endpoints, payloads and structure are confidential too, not just the tokens.'] },
  { level: 'intermediate', topic: 'cp-portfolio', q: 'Which capstone repository is most convincing to a reviewer?', options: ['A README with scope and results, a test plan, 20 cases, 5 labelled bugs and CI', 'Three hundred test cases in a spreadsheet, but no README, setup steps or results', 'A long list of every tool used, but no runnable tests, reports or evidence', 'Automated tests only, copied from a public tutorial and lightly renamed'], correct: 0,
    why: ['Right — a navigable story with evidence, honest labels and a working pipeline lets the reviewer judge you quickly.', 'Volume without context is hard to assess and suggests you did not prioritise.', 'Tool lists are claims; reviewers look for artifacts they can open and run.', 'Copied work shows nothing about your thinking and is usually easy to recognise.'] },
  { level: 'beginner', topic: 'cp-resume', q: 'Which summary line best suits an entry-level QA resume?', options: ['Results-driven QA rockstar with expert knowledge of all testing tools', 'Entry-level QA tester; capstone covers UI, API, SQL and Playwright in CI', 'Seeking a challenging position in a reputed organisation to grow my career', 'Senior QA engineer with extensive experience in many enterprise domains'], correct: 1,
    why: ['Buzzwords and “expert in all tools” are claims no reviewer believes from a junior.', 'Right — an honest level, concrete evidence and the skills the reader is scanning for.', 'A generic objective says nothing about you and could sit on any resume.', 'Misstating your level is quickly exposed and destroys trust.'] },
  { level: 'intermediate', topic: 'cp-resume', q: 'Two weeks after sending 40 identical applications, you have had no responses. What is the best next step?', options: ['Send another hundred identical applications so the odds work in your favour', 'Add every testing tool you have ever heard of to your skills section', 'Review your targeting and evidence, then send fewer, tailored applications', 'Stop applying completely until you can show three years of experience'], correct: 2,
    why: ['More of what is not working rarely fixes it; review before increasing volume.', 'Keyword stuffing makes the resume less credible and sets interview traps.', 'Right — check whether the roles fit your level and whether your strongest evidence is visible, then tailor.', 'Entry-level roles exist for people without experience; keep improving while you apply.'] },
  { level: 'intermediate', topic: 'cp-interview-tech', q: 'An interviewer asks: “A logged-in user opens another user’s order and the API returns 403. Bug or not?” What is the best answer?', options: ['Bug — 403 means the token is missing, invalid or expired', 'Bug — the server should return 200 and show the order anyway', 'Likely correct: 403 means authenticated but not allowed', 'Not a bug, because 403 means that the order does not exist'], correct: 2,
    why: ['That describes 401 Unauthorized — missing, invalid or expired credentials.', 'Returning another user’s order would be a serious access-control defect.', 'Right — the user is authenticated but not authorised for that resource. Some APIs deliberately return 404 instead, to avoid revealing that it exists.', '404 is the usual “not found” code; 403 means access is refused.'] },
  { level: 'advanced', topic: 'cp-interview-tech', q: 'In a live exercise you write a Playwright test that clicks “Place order” and then calls waitForTimeout(3000). How should you improve it?', options: ['Increase the fixed wait to 10 seconds so it never fails in CI', 'Wrap the click in a try/catch block and silently ignore any errors', 'Switch to a long CSS path selector so the button is located faster', 'Assert the confirmation with a web-first check like toBeVisible()'], correct: 3,
    why: ['A longer fixed wait makes the suite slower and still fails whenever the system is slower than expected.', 'Swallowing errors hides real failures and makes the test meaningless.', 'Long CSS paths are brittle; prefer role, label or test-id locators.', 'Right — web-first assertions retry until the condition holds or the timeout expires, so the test is faster and more reliable.'] },
  { level: 'beginner', topic: 'cp-interview-behavioral', q: 'Which opening is the best Situation for a STAR answer?', options: ['“In my ShopFlow capstone, checkout totals were wrong for some coupon codes.”', '“So basically, I was born in Lahore, studied computer science, and then…”', '“Testing is very important because bugs cost companies a lot of money.”', '“We were a great team and we always worked very hard on everything.”'], correct: 0,
    why: ['Right — short, specific context that sets up the task and the action.', 'Personal history is not the situation the question asks about, and it uses up your time.', 'A general opinion is not a situation; the interviewer wants a real example.', 'Vague praise gives no context and no “I”.'] },
  { level: 'intermediate', topic: 'cp-interview-behavioral', q: 'Which answer to “Tell me about a tight deadline” is best?', options: ['“We all worked late every single night and somehow got everything done.”', '“The deadline was unrealistic, so I told the manager it was entirely their fault.”', '“I skipped the test plan and executed random cases as fast as I could.”', '“I ranked changes by risk, tested checkout first, reported what was untested.”'], correct: 3,
    why: ['Effort is not a strategy; there is no decision, no evidence and no “I”.', 'Blame shows poor collaboration and no problem-solving.', 'Random execution under pressure skips the riskiest areas and hides gaps.', 'Right — risk-based prioritisation and honest reporting of gaps, described as your own actions.'] },
  { level: 'intermediate', topic: 'cp-metrics', q: 'In one sprint, 12 of 400 CI tests both passed and failed on the same commit. What is the flaky rate for that period?', options: ['3%', '12%', '0.3%', '33%'], correct: 0,
    why: ['Right — 12 ÷ 400 = 0.03, which is 3%.', 'That is the number of flaky tests, not the rate.', 'Off by a factor of ten: 12 ÷ 400 is 0.03, which is 3%.', 'That would be 12 out of about 36 tests; it ignores the 400 total.'] },
  { level: 'advanced', topic: 'cp-metrics', q: 'Team A reports a defect density of 2 per KLOC and team B reports 6 per KLOC, on different products. A manager wants to rank the teams. What is the best response?', options: ['Rank team B lower, because its code clearly has three times the defects', 'Rank team A lower, because a low density proves that they test much less', 'Avoid ranking: compare each team’s own trend, since contexts differ', 'Average the two figures and make 4 per KLOC the target for both teams'], correct: 2,
    why: ['Higher density can reflect more thorough testing, a different language or a different size measure — not worse work.', 'Low density is ambiguous too; on its own it proves nothing.', 'Right — density is comparable within one codebase over time, not across different products and teams.', 'An averaged target invites gaming (Goodhart’s law) and ignores context.'] },
  { level: 'beginner', topic: 'cp-career', q: 'Which role mainly focuses on helping a whole team own quality through coaching and better practices?', options: ['Quality coach', 'Performance tester', 'SDET', 'Security tester'], correct: 0,
    why: ['Right — a quality coach spreads testing skills and practices so the team owns quality together.', 'Performance testers specialise in load, stress and response-time analysis.', 'An SDET mainly builds test frameworks and automation.', 'Security testers focus on vulnerabilities and access control.'] },
  { level: 'advanced', topic: 'cp-career', q: 'Your company offers to pay for one certification. You work mostly on Playwright and API automation. Which choice is most sensible?', options: ['Whichever certification has the most impressive-sounding title to recruiters', 'Several unrelated certifications, just to fill out the resume', 'One aligned with your automation work, taken alongside real projects', 'None, because every certification is worthless for every tester'], correct: 2,
    why: ['A title chosen to impress may teach little you will actually use.', 'Unrelated certificates spread your effort thin and add little evidence.', 'Right — aligned study reinforces your daily work, and real projects show you can apply it.', 'Too absolute; a well-chosen certification can give structure and shared vocabulary.'] }
  /* @@BANK-END */
]);

QA_CONTENT.addDrills('capstone', [
  {
    id: 'cp-d1', type: 'order', level: 'beginner',
    title: 'Put a STAR answer in order',
    prompt: 'These sentences answer “Tell me about a bug you missed.” Arrange them in the order a strong STAR answer would use.',
    items: [
      'In my capstone, a coupon was applied twice when Apply was double-clicked',
      'I had only tested single clicks, so closing that gap was my job',
      'I reproduced it and logged it with steps and a screen recording',
      'I added a double-submit case to my checklist and wrote an automated check',
      'The fix passed my retest, and the new check now runs in CI on every push',
      'Since then I plan double-submit cases for every form I test'
    ],
    explain: 'This follows <b>Situation → Task → Action → Result</b>, plus a one-line reflection. The situation sets the context, the task states your responsibility, the two action steps move from investigating and reporting to preventing a repeat, the result gives honest evidence (a retest of the fix and a check in CI), and the reflection shows what you learned. Reporting comes before prevention because the team needs the bug first.'
  },
  {
    id: 'cp-d2', type: 'spot', level: 'beginner',
    title: 'Spot the weak resume bullets',
    prompt: 'These lines come from a junior QA resume. Select every bullet that is weak, inflated or misleading.',
    lines: [
      { text: 'Designed 22 test cases for a practice checkout using boundary values and decision tables', flaw: false, why: 'Strong: an action, a scope, named techniques and a number you can show.' },
      { text: 'Responsible for all testing activities', flaw: true, why: 'A duty, not an achievement — it says nothing about what you actually did or produced.' },
      { text: 'Improved overall product quality by 45% through dedicated testing', flaw: true, why: 'An invented percentage with no measurement behind it; “how did you measure that?” has no honest answer.' },
      { text: 'Logged 6 reproducible defects with steps, evidence and severity in a capstone project', flaw: false, why: 'Strong: honest scope (“capstone project”) and a result a reviewer can check.' },
      { text: 'Expert in Selenium, Cypress, Playwright, Appium, JMeter and Burp Suite', flaw: true, why: 'Keyword stuffing and overclaiming — a junior cannot credibly be an expert in six tools, and each one invites a deep follow-up question.' },
      { text: 'Built a 12-check Postman collection covering auth, validation and ownership (401 vs 403)', flaw: false, why: 'Strong: specific, technical and verifiable in the portfolio.' },
      { text: '2 years of professional QA experience (gained through self-study and practice projects)', flaw: true, why: 'Self-study is valuable, but calling it professional experience is misleading. List it under Projects instead.' },
      { text: 'Automated 5 critical journeys in Playwright + TypeScript, running in GitHub Actions on every push', flaw: false, why: 'Strong: a concrete output, the tools used and how it runs.' }
    ]
  },
  {
    id: 'cp-d3', type: 'classify', level: 'advanced',
    title: 'Useful signal or vanity metric?',
    prompt: 'Classify each metric as if it were shown on its own on a team quality dashboard. Read each explanation for the nuance — context can change the answer.',
    categories: ['Useful decision signal', 'Useful only with context', 'Vanity or easily gamed'],
    items: [
      { text: 'Severe escaped defects per release, trended over time', cat: 0, why: 'Tracks what users actually experienced and points to where testing should improve. Keep the counting window and severity rules consistent.' },
      { text: 'Total number of test cases in the test management tool', cat: 2, why: 'Says nothing about risk coverage and grows when cases are split. Fine as an inventory figure, never as a quality signal.' },
      { text: 'Overall pass rate of the regression suite', cat: 1, why: 'Meaningless until you know which tests failed, how many were skipped or quarantined, and what the suite covers.' },
      { text: 'Flaky test rate in CI over the last two weeks', cat: 0, why: 'Shows whether red builds can be trusted and guides maintenance. Define “flaky” consistently: passed and failed on the same commit.' },
      { text: 'Bugs logged per tester per month', cat: 2, why: 'Rewards trivial and duplicate reports and sets testers against developers — a textbook Goodhart’s law trap.' },
      { text: 'Code coverage percentage', cat: 1, why: 'Good for finding untested code, but high coverage does not prove the code was verified. Never make it a hard target on its own.' },
      { text: 'Defect removal efficiency with a 90-day window', cat: 0, why: 'A solid trend measure of how much was caught before users saw it. Read it alongside usage — a quiet launch flatters it.' },
      { text: 'Percentage of test cases that are automated', cat: 2, why: '“80% automated” can mean many shallow checks and none on critical journeys. Ask instead which critical risks have reliable automated checks.' }
    ]
  },
  {
    id: 'cp-d4', type: 'fill', level: 'intermediate',
    title: 'Complete the DRE calculation',
    prompt: 'Release 5.0: testing found 57 defects before release. In the 90 days after release, users and monitoring reported 3 more. Fill in each part of the defect removal efficiency calculation.',
    fields: [
      { label: 'Numerator: defects found before release', accept: ['57'], why: 'The numerator is everything caught before users saw it: <b>57</b>.' },
      { label: 'Denominator: total defects (before + after release)', accept: ['60', '57+3', '57 + 3'], why: '57 found before + 3 found after = <b>60</b> defects within the 90-day window.' },
      { label: 'DRE as a percentage', accept: ['95', '95%', '95 %', '95.0', '95.0%', '0.95'], why: '57 ÷ 60 × 100 = <b>95%</b>.' },
      { label: 'Defects found after release are called ___ defects', accept: ['escaped', 'escaped defects', 'escape', 'leaked', 'leakage'], why: 'They <b>escaped</b> testing and reached users. Track them by severity; they are the input to root-cause reviews.' },
      { label: 'What must you always state alongside a DRE figure?', accept: ['window', 'the window', 'counting window', 'the counting window', 'time window', 'the time window', '90 days', '90-day window', 'the 90-day window', 'period', 'time period', 'the period'], why: 'The <b>counting window</b> (here, 90 days after release). Without it, DRE figures from different releases cannot be compared, and a short window makes the number look better.' }
    ]
  }
  /* @@DRILLS-END */
]);
