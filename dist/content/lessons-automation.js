/* Qadence content · stage "automation" · lessons 1–9 (what to automate → BDD, API and visual).
   Default framework: Playwright Test (TypeScript). Cypress and Selenium appear as alternatives.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-automation.js */
QA_CONTENT.addLessons('automation', [
  /* ───────────────────────── 1 · What to automate ───────────────────────── */
  {
    id: 'au-what-to-automate',
    n: 1,
    level: 'beginner',
    title: 'What to automate: the test pyramid and ROI',
    summary: 'Decide which checks deserve automation, place them at the right layer of the test pyramid and judge whether the effort will pay back.',
    minutes: 15,
    objectives: [
      'Compare what manual testing and automated checks are each good at',
      'Sort test ideas into good and poor automation candidates',
      'Explain the test pyramid and why the ice-cream cone is costly',
      'Estimate automation ROI including maintenance, not just build time'
    ],
    body: [
      { t: 'p', html: 'Automation is not “testing without people”. An automated test is a <b>script that repeats a check</b> you already know how to judge: given this input, expect that output. It is fast, tireless and consistent — but it only notices what it was told to look for. A human tester notices the odd layout, the confusing message and the feature that technically works but makes no sense. Good QA teams use both, and the skill lies in deciding which work goes where.' },
      { t: 'compare',
        a: { title: 'Manual testing is strongest at', items: ['Exploring new or changing features that have no stable expected result yet', 'Judging usability, wording, visual polish and “does this make sense?”', 'One-off checks, such as a campaign page that lives for a week', 'Following hunches and investigating odd behaviour'] },
        b: { title: 'Automated checks are strongest at', items: ['Repeating the same regression checks on every build', 'Running many data combinations quickly and identically', 'Giving fast feedback in CI before code is merged', 'Checks that are slow or error-prone by hand, such as comparing 200 prices'] } },
      { t: 'h', text: 'Good and poor automation candidates' },
      { t: 'table', head: ['Test idea', 'Automate?', 'Reason'], rows: [
        ['Login, checkout and other critical paths, run every release', '<b>Yes</b>', 'High value, stable and repeated often — classic regression'],
        ['Discount rules with 30 combinations of cart value and coupon', '<b>Yes</b>, at API or unit level', 'Data-driven and repetitive; much faster below the UI'],
        ['Smoke check that each deploy starts and the home page loads', '<b>Yes</b>', 'Runs many times a day and is cheap to keep'],
        ['A feature that is redesigned every sprint', '<b>Not yet</b>', 'The UI changes faster than scripts can be maintained'],
        ['“Is the new onboarding easy to understand?”', '<b>No</b>', 'Needs human judgement; there is no pass/fail oracle'],
        ['A check that needs a real card reader or an SMS on a physical phone', '<b>Rarely</b>', 'Hardware is hard to control; the cost often exceeds the value']
      ] },
      { t: 'h', text: 'The test pyramid' },
      { t: 'p', html: 'The <b>test pyramid</b> is a guideline for <i>where</i> automated checks should live. Put most checks at the bottom, where they are fast and precise, and keep only a thin layer of slow end-to-end (E2E) tests at the top. A failing unit test points to one function; a failing E2E test could be caused by the UI, the API, the database, the test data or the network — so it takes longer to diagnose.' },
      { t: 'table', caption: 'Layers of the pyramid for the ShopFlow store', head: ['Layer', 'ShopFlow example', 'Speed and cost', 'Share of checks'], rows: [
        ['<b>E2E / UI</b> (top)', 'A guest buys a product through the real browser flow', 'Seconds to minutes each; most fragile', 'Few — critical journeys only'],
        ['<b>Integration / API</b> (middle)', '<code>POST /api/cart</code> rejects quantity 11; the order service saves to the database', 'Milliseconds to seconds; stable', 'A solid middle layer'],
        ['<b>Unit</b> (base)', '<code>calculateShipping(49.99)</code> returns 6.00', 'Milliseconds; cheapest to run and fix', 'Most checks, usually written by developers']
      ] },
      { t: 'callout', tone: 'warn', title: 'The ice-cream cone anti-pattern', html: 'Some teams flip the pyramid: a huge layer of manual and UI tests, a few API tests and almost no unit tests. The suite takes hours, fails for unclear reasons, and every UI change breaks dozens of scripts. If a rule can be checked at the API or unit level, check it there — and keep the UI test for proving that the pieces work together.' },
      { t: 'h', text: 'Thinking about return on investment (ROI)' },
      { t: 'p', html: 'Every automated test is a small piece of software. It costs time to <b>build</b> and more time to <b>maintain</b>: locators change, test data expires and flaky runs need investigating. A rough check: <i>manual cost per run × number of runs</i> should clearly exceed <i>build cost + maintenance per run × number of runs</i>. A test that runs on every pull request pays back quickly; a test that runs twice a year rarely does — unless the risk it guards is severe.' },
      { t: 'list', items: [
        'How often will this check run — every commit, every release, or once?',
        'Is the feature stable enough that the script will not need rewriting next sprint?',
        'Is the expected result clear enough for a machine to judge?',
        'Can it be checked at a lower, cheaper layer (unit or API) instead of the UI?',
        'What does a missed bug here cost — money, data, trust or legal exposure?'
      ] },
      { t: 'callout', tone: 'key', title: 'Automation does not replace exploration', html: 'Automated checks confirm that <b>known</b> behaviour still works. They do not find the bugs nobody imagined. Many new defects are found by people exploring, asking “what if?” and noticing things a script never looks at. Automation frees time for that work — it does not remove the need for it.' }
    ],
    example: {
      title: 'Worked example: should we automate ShopFlow’s checkout regression?',
      blocks: [
        { t: 'p', html: 'The team runs <b>12 manual checkout regression cases</b> before every release. They take a tester about <b>3 hours</b>, and the team releases <b>twice a week</b> — 6 hours of repeated work every week.' },
        { t: 'table', head: ['Item', 'Estimate'], rows: [
          ['Build the checks in Playwright (API data setup + 3 UI journeys + rule checks at API level)', 'About 40 hours, once'],
          ['Maintenance and flaky-run investigation', 'About 1 hour per week'],
          ['Run time in CI', '8 minutes, unattended'],
          ['Time saved per week', '6 h manual − 1 h maintenance = <b>5 hours</b>'],
          ['Break-even point', '40 h ÷ 5 h ≈ <b>8 weeks</b>']
        ] },
        { t: 'p', html: '<b>Decision:</b> automate. Push the discount-rule combinations down to API tests, keep <b>three UI journeys</b> (guest checkout, logged-in checkout, payment declined), and spend the freed hours exploring the new wallet feature. A holiday banner that is live for 10 days, by contrast, is checked manually — it would be deleted before a script paid back.' }
      ]
    },
    explain: {
      'ur': 'ہر ٹیسٹ کو automate کرنا سمجھداری نہیں۔ Automation اُن checks کے لیے بہترین ہے جو بار بار چلتے ہیں، جن کا expected result واضح ہو اور feature مستحکم ہو — جیسے ہر release میں login اور checkout کی regression۔ جو feature ہر sprint میں بدل رہا ہو، یا جہاں انسانی رائے چاہیے (کیا یہ screen آسانی سے سمجھ آتی ہے؟)، وہاں manual testing بہتر ہے۔ <b>Test pyramid</b> کہتا ہے: سب سے زیادہ unit tests، درمیان میں API tests، اور اوپر صرف چند اہم UI (E2E) tests۔ اُلٹا pyramid یعنی "ice-cream cone" سست اور نازک ہوتا ہے۔ ROI سوچتے وقت script بنانے کے ساتھ اس کی maintenance کا وقت بھی گنیں۔ اور یاد رکھیں، نئے bugs ڈھونڈنے کے لیے automation کبھی exploratory testing کی جگہ نہیں لیتی۔',
      'ur-Latn': 'Har test ko automate karna samajhdaari nahin. Automation un checks ke liye best hai jo baar baar chalte hain, jin ka expected result clear ho aur feature stable ho — jaise har release mein login aur checkout ki regression. Jo feature har sprint mein badal raha ho, ya jahan insaani raaye chahiye (kya yeh screen aasaani se samajh aati hai?), wahan manual testing behtar hai. <b>Test pyramid</b> kehta hai: sab se zyada unit tests, beech mein API tests, aur upar sirf chand important UI (E2E) tests. Ulta pyramid yaani "ice-cream cone" slow aur fragile hota hai. ROI sochte waqt script banane ke saath us ki maintenance ka time bhi ginein. Aur yaad rakhein, naye bugs dhoondne ke liye automation kabhi exploratory testing ki jagah nahin leti.',
      'hi': 'हर test को automate करना समझदारी नहीं है। Automation उन checks के लिए सबसे अच्छा है जो बार-बार चलते हैं, जिनका expected result साफ़ हो और feature स्थिर हो — जैसे हर release में login और checkout की regression। जो feature हर sprint में बदल रहा हो, या जहाँ इंसानी राय चाहिए (क्या यह screen आसानी से समझ आती है?), वहाँ manual testing बेहतर है। <b>Test pyramid</b> कहता है: सबसे ज़्यादा unit tests, बीच में API tests, और ऊपर सिर्फ़ कुछ ज़रूरी UI (E2E) tests। उल्टा pyramid यानी "ice-cream cone" धीमा और नाज़ुक होता है। ROI सोचते समय script बनाने के साथ उसकी maintenance का समय भी गिनें। और याद रखें, नए bugs ढूँढने के लिए automation कभी exploratory testing की जगह नहीं लेता।',
      'ar': 'ليس من الحكمة أتمتة كل اختبار. الأتمتة (automation) مناسبة للفحوصات التي تتكرر كثيرًا، وتكون نتيجتها المتوقعة واضحة، والميزة فيها مستقرة — مثل اختبارات regression لتسجيل الدخول والدفع في كل إصدار. أما الميزة التي تتغير في كل sprint، أو الحالات التي تحتاج إلى حكم بشري (هل هذه الشاشة سهلة الفهم؟)، فالاختبار اليدوي فيها أفضل. يقول <b>هرم الاختبارات (test pyramid)</b>: أكثر الاختبارات unit tests، ثم طبقة من API tests، وفي القمة عدد قليل من اختبارات الواجهة (E2E) للرحلات المهمة فقط. أما الهرم المقلوب، أي "مخروط الآيس كريم"، فهو بطيء وهشّ. وعند حساب العائد (ROI) احسب وقت صيانة السكربت لا وقت كتابته فقط. وتذكّر أن الأتمتة لا تحلّ محل الاختبار الاستكشافي في اكتشاف الأخطاء الجديدة.',
      'es': 'No conviene automatizarlo todo. La automatización encaja mejor en comprobaciones que se repiten mucho, tienen un resultado esperado claro y cubren una funcionalidad estable, como la regresión de login y checkout en cada release. Si una pantalla cambia en cada sprint, o la pregunta necesita criterio humano («¿se entiende este flujo?»), es mejor probarla manualmente. La <b>pirámide de pruebas</b> propone muchas pruebas unitarias en la base, una capa sólida de pruebas de API en el medio y pocas pruebas E2E de interfaz arriba, solo para los recorridos críticos. La pirámide invertida, el «cono de helado», es lenta y frágil. Al calcular el ROI, suma también el tiempo de mantenimiento del script, no solo el de escribirlo. Y recuerda: la automatización no sustituye a las pruebas exploratorias para encontrar defectos nuevos.'
    },
    keyTerms: [
      { term: 'Test pyramid', def: 'A guideline to keep many fast unit tests, fewer integration/API tests and a small number of slow end-to-end UI tests.' },
      { term: 'Ice-cream cone', def: 'An anti-pattern with mostly manual and UI tests and few unit tests — slow, fragile and expensive to maintain.' },
      { term: 'End-to-end (E2E) test', def: 'A test that drives the whole system through the real user interface, from the browser down to the database.' },
      { term: 'Automation ROI', def: 'Return on investment: the time and risk a test saves compared with the cost to build, run and maintain it.' },
      { term: 'Regression suite', def: 'A set of checks re-run after changes to confirm that previously working behaviour still works.' }
    ],
    practice: [
      { q: 'PayLite wallet releases weekly. Classify each idea as <b>automate</b>, <b>not yet</b> or <b>keep manual</b>: (a) top-up with a saved card; (b) the brand-new rewards screen, redesigned every sprint; (c) whether the transfer-confirmation wording feels trustworthy; (d) currency conversion for 25 currency pairs.', hint: 'Ask: how often, how stable, is there a clear expected result, and at which layer?', answer: '(a) <b>Automate</b> — critical, stable and repeated weekly: one UI journey plus API checks. (b) <b>Not yet</b> — explore it manually until the design settles. (c) <b>Keep manual</b> — it needs human judgement. (d) <b>Automate at API or unit level</b> — data-driven and repetitive; 25 UI runs would be slow and fragile.' },
      { q: 'Your team has 400 UI tests, 40 API tests and 20 unit tests. The suite takes 3 hours and fails most nights. Name the pattern and propose a plan.', answer: 'It is the <b>ice-cream cone</b>. I would find UI tests that only verify business rules (validation, calculations, permissions) and move those checks to API or unit level with the developers, keep a small set of UI journeys for critical flows, delete duplicates, and fix or quarantine flaky tests. The goal is faster, more trustworthy feedback — not a smaller test count for its own sake.' },
      { q: 'A manual check takes 20 minutes and runs once per quarter. Automating it would take 2 days, plus about 30 minutes of maintenance per quarter. Is it worth it?', hint: 'Compare the time saved per run with the maintenance per run.', answer: 'On time alone, <b>no</b>: saving 20 minutes but spending 30 on maintenance is a loss every quarter, before counting the 2-day build. It could still be justified if the check guards something high-risk (a legal or payment rule) or must run on many configurations — ROI includes risk, not only hours.' }
    ],
    quiz: [
      { q: 'Which test idea is the best candidate for automation?', options: ['A usability review of a new onboarding flow', 'Login and checkout regression checks run every release', 'A one-week marketing page that will then be deleted', 'Exploring a feature that is redesigned every sprint'], correct: 1,
        why: ['Usability needs human judgement; there is no reliable pass/fail oracle.', 'Right — stable, high-value and repeated often, so automation pays back quickly.', 'It will be gone before an automated test repays its build cost.', 'Scripts would break every sprint; explore manually until the design settles.'] },
      { q: 'According to the test pyramid, where should most automated checks live?', options: ['In end-to-end UI tests, because they are closest to the user', 'In manual regression runs before each release', 'Spread evenly across all layers of the application', 'In fast unit and API tests below the UI'], correct: 3,
        why: ['UI tests are valuable but slow and fragile, so the pyramid keeps them few.', 'Manual runs are not automated checks; heavy manual regression is part of the ice-cream cone.', 'The pyramid deliberately weights the lower, cheaper layers rather than spreading evenly.', 'Right — lower layers are faster, more precise and cheaper to maintain.'] },
      { q: 'A team has hundreds of UI tests, a handful of API tests and almost no unit tests. The suite is slow and often red. What is this pattern called?', options: ['The ice-cream cone anti-pattern', 'The test pyramid', 'Shift-left testing', 'Risk-based testing'], correct: 0,
        why: ['Right — an inverted pyramid that is slow, fragile and costly to maintain.', 'The pyramid is the opposite shape: many unit tests and few UI tests.', 'Shift-left means testing earlier in the lifecycle, not a distribution of test layers.', 'Risk-based testing prioritises work by risk; it does not describe this imbalance.'] },
      { q: 'Which cost is most often forgotten when estimating automation ROI?', options: ['The licence cost of the operating system', 'The time to write the first version of the script', 'Ongoing maintenance and investigating flaky failures', 'The time the CI server spends idle at night'], correct: 2,
        why: ['Usually fixed or negligible, and not specific to any test.', 'People do count this — it is the most visible cost.', 'Right — locators, data and flows change, and every flaky run costs someone’s time.', 'Idle server time is not a cost created by the test.'] },
      { q: 'ShopFlow has 40 discount-rule combinations to verify on every release. What is the most efficient approach?', options: ['Run all 40 combinations as UI tests in the browser', 'Check them at API or unit level and keep one or two UI journeys', 'Test all 40 combinations manually before every release', 'Skip them, because one combination proves the rule works'], correct: 1,
        why: ['Forty browser runs are slow and fragile for logic that does not depend on the UI.', 'Right — data-heavy rules belong low in the pyramid; the UI journey proves the pieces connect.', 'Repetitive and error-prone by hand — exactly the work automation is for.', 'One value cannot reveal wrong behaviour in other combinations or at their boundaries.'] }
    ],
    interview: [
      { q: 'How do you decide which test cases to automate?', a: 'I look at <b>frequency, stability, value and clarity</b>. Good candidates run often (regression, smoke), cover critical or high-risk flows, are stable enough not to change every sprint, and have a clear expected result. I also pick the <b>lowest layer</b> that can catch the bug — business rules at API or unit level, a few UI tests for key journeys. I avoid automating one-off checks, rapidly changing features and anything that needs human judgement, such as usability. I estimate ROI including maintenance, and I protect time for exploratory testing, because automation only confirms what we already know.' },
      { q: 'What is the test pyramid, and why does it matter?', a: 'The test pyramid recommends many fast unit tests, a middle layer of integration and API tests, and a small number of end-to-end UI tests. Lower-level tests are faster, cheaper and point precisely to the cause, while UI tests are slow and can fail for many reasons. The opposite shape — the <b>ice-cream cone</b> — produces long, flaky suites that teams stop trusting. It is a guideline, not a law: the right mix depends on the product, but each check should live at the cheapest layer that can catch the problem.' }
    ],
    takeaways: [
      'Automate repeated, stable, high-value checks with a clear expected result.',
      'Keep human judgement for exploration, usability and fast-changing features.',
      'Many unit tests, a solid API layer, few UI journeys — avoid the ice-cream cone.',
      'ROI = time and risk saved minus build <b>and</b> maintenance cost.',
      'Automation confirms known behaviour; exploration finds new bugs.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions'], interview: ['p3'] }
  },

  /* ───────────────────────── 2 · Playwright basics ───────────────────────── */
  {
    id: 'au-playwright-basics',
    n: 2,
    level: 'intermediate',
    title: 'Playwright basics: locators, actions and assertions',
    summary: 'Set up Playwright, write a first test with user-facing locators, perform actions and check results with auto-retrying web-first assertions.',
    minutes: 22,
    objectives: [
      'Create a Playwright project and run tests from the CLI, headed and in UI mode',
      'Choose locators in priority order, starting with getByRole and getByLabel',
      'Use click, fill, check and selectOption on scoped, unambiguous locators',
      'Write web-first assertions that retry instead of one-off checks'
    ],
    body: [
      { t: 'p', html: 'Playwright is an open-source browser automation framework from Microsoft. With its test runner, <code>@playwright/test</code>, one script can drive Chromium (Chrome, Edge), Firefox and WebKit (the engine behind Safari). It ships with what a beginner needs: a test runner, assertions, parallel execution, an HTML report, a trace viewer and a code generator. This course uses <b>TypeScript</b>, the most common choice for new Playwright projects; you need Node.js installed, and the same tests run on Windows, macOS and Linux, locally and in CI.' },
      { t: 'code', lang: 'bash', title: 'Set up and run', code: `# Create a project (choose TypeScript, a tests folder, optional GitHub Actions workflow)
npm init playwright@latest

npx playwright test                      # run all tests headless, in parallel
npx playwright test tests/login.spec.ts  # run one file
npx playwright test --headed             # watch the browser while tests run
npx playwright test --ui                 # UI mode: pick, watch and time-travel
npx playwright show-report               # open the HTML report of the last run
npx playwright codegen http://localhost:3000   # record actions, suggest locators` },
      { t: 'p', html: 'The installer creates <code>playwright.config.ts</code> (browsers, base URL, retries, reporters), a <code>tests/</code> folder with an example spec, and downloads the browsers. A test file imports <code>test</code> and <code>expect</code>, groups related tests with <code>test.describe</code>, and shares setup through hooks such as <code>test.beforeEach</code>. Every test receives its own fresh, isolated <code>page</code> through a built-in <b>fixture</b>.' },
      { t: 'code', lang: 'ts', title: 'tests/login.spec.ts', code: `import { test, expect } from '@playwright/test';

test.describe('PeopleOps login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // resolved against baseURL in playwright.config.ts
  });

  test('valid user reaches the dashboard', async ({ page }) => {
    await page.getByLabel('Email').fill('asha@peopleops.test');
    await page.getByLabel('Password').fill('Secret123!');
    await page.getByRole('checkbox', { name: 'Remember me' }).check();
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: 'Welcome, Asha' })).toBeVisible();
  });

  test('wrong password shows an error', async ({ page }) => {
    await page.getByLabel('Email').fill('asha@peopleops.test');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect');
  });
});` },
      { t: 'h', text: 'Choosing locators: the priority list' },
      { t: 'p', html: 'A <b>locator</b> describes how to find an element <i>at the moment you use it</i> — it is lazy and re-resolved on every action. Playwright recommends locating elements the way a user or assistive technology perceives them. Such locators survive redesigns because they depend on behaviour and visible meaning, not on markup details like class names or DOM position. <code>getByAltText</code> (images) and <code>getByTitle</code> exist for rarer cases.' },
      { t: 'table', head: ['Priority', 'Locator', 'Best for', 'Example'], rows: [
        ['1', '<code>getByRole</code>', 'Buttons, links, headings, checkboxes, rows — anything with a role and an accessible name', "<code>getByRole('button', { name: 'Sign in' })</code>"],
        ['2', '<code>getByLabel</code>', 'Form fields with a visible label', "<code>getByLabel('Email')</code>"],
        ['3', '<code>getByPlaceholder</code>', 'Inputs that have placeholder text but no label', "<code>getByPlaceholder('Search products')</code>"],
        ['4', '<code>getByText</code>', 'Non-interactive text such as messages and paragraphs', "<code>getByText('Order placed')</code>"],
        ['5', '<code>getByTestId</code>', 'Elements with no stable role or text; uses an agreed <code>data-testid</code>', "<code>getByTestId('cart-count')</code>"],
        ['Last resort', '<code>locator()</code> with CSS or XPath', 'Legacy markup with no accessible name and no test id', "<code>locator('#legacy-total')</code>"]
      ] },
      { t: 'callout', tone: 'warn', title: 'Brittle selectors', html: 'Selectors such as <code>div.form &gt; div:nth-child(3) &gt; button</code> or <code>//div[2]/span[1]</code> break when a designer adds a wrapper or reorders fields, even though the feature still works. If an element has no usable role, label or text, that is useful feedback too: it often signals an accessibility gap. Ask developers for an accessible name or a <code>data-testid</code> rather than writing a fragile path.' },
      { t: 'h', text: 'Actions and strictness' },
      { t: 'p', html: "Everyday actions are <code>click()</code>, <code>fill()</code> (clears the field, then enters text), <code>check()</code> / <code>uncheck()</code>, <code>selectOption()</code> for &lt;select&gt; elements, <code>press('Enter')</code> and <code>hover()</code>. Locators are <b>strict</b>: if an action’s locator matches two or more elements, Playwright throws an error instead of guessing. Narrow it by scoping to a container, for example <code>page.getByRole('row').filter({ hasText: 'Asha Khan' }).getByRole('button', { name: 'Edit' })</code>." },
      { t: 'h', text: 'Web-first assertions' },
      { t: 'compare',
        a: { title: 'One-off check (avoid)', items: ["<code>expect(await page.getByText('Saved').isVisible()).toBe(true)</code>", 'Reads the state <b>once</b>; fails if the message appears 200 ms later', 'Failure says only “expected true, received false”'] },
        b: { title: 'Web-first assertion (prefer)', items: ["<code>await expect(page.getByText('Saved')).toBeVisible()</code>", '<b>Retries</b> until the condition holds or the assertion timeout (5 s by default) runs out', 'Clear failure: shows the locator, the expected state and what was found'] } },
      { t: 'p', html: 'Other everyday assertions are <code>toHaveText</code>, <code>toContainText</code>, <code>toHaveValue</code>, <code>toBeChecked</code>, <code>toBeEnabled</code>, <code>toHaveCount</code>, and the page-level <code>toHaveURL</code> and <code>toHaveTitle</code>. Always <code>await</code> them: without <code>await</code> the test moves on before the assertion has finished, so a failure can be missed or reported in the wrong place.' },
      { t: 'callout', tone: 'tip', title: 'Let the tools help', html: '<code>npx playwright codegen</code> records your clicks and suggests role-based locators — a great way to learn, but review and tidy its output before committing. In UI mode (<code>--ui</code>) you can step through each action, inspect DOM snapshots and use the locator picker to confirm that a locator matches exactly one element.' }
    ],
    example: {
      title: 'Worked example: repairing a brittle ShopFlow test',
      blocks: [
        { t: 'p', html: 'A new tester recorded this test against the old ShopFlow product list. After a redesign added a wrapper &lt;div&gt;, it fails even though adding to the cart still works for real users.' },
        { t: 'code', lang: 'ts', title: 'Before — brittle and slow', code: `await page.locator('#root > div > div:nth-child(2) > button').click();
await page.waitForTimeout(3000);
const badge = await page.locator('.hdr .badge').textContent();
expect(badge).toBe('1');` },
        { t: 'code', lang: 'ts', title: 'After — robust', code: `const product = page.getByRole('listitem').filter({ hasText: 'Wireless Mouse' });
await product.getByRole('button', { name: 'Add to cart' }).click();
await expect(page.getByTestId('cart-count')).toHaveText('1');` },
        { t: 'p', html: 'The new version finds the product the way a user does, scopes the repeated “Add to cart” buttons to one product card, and replaces the 3-second sleep plus one-off read with a web-first assertion that retries until the badge shows <b>1</b>. It is shorter, faster when the app is quick and patient when the app is slow.' }
      ]
    },
    explain: {
      'ur': 'Playwright میں test کے تین بنیادی حصے ہیں: <b>locator</b> (element ڈھونڈنا)، <b>action</b> (click، fill وغیرہ) اور <b>assertion</b> (نتیجہ چیک کرنا)۔ Element کو ویسے ڈھونڈیں جیسے user اسے دیکھتا ہے: پہلے getByRole، پھر getByLabel، getByPlaceholder، getByText، اور ضرورت ہو تو getByTestId۔ لمبے CSS یا XPath راستے آخری option ہیں کیونکہ design بدلتے ہی ٹوٹ جاتے ہیں۔ مثال: page.getByRole("button", { name: "Sign in" }).click()۔ نتیجہ چیک کرنے کے لیے await expect(locator).toBeVisible() جیسی <b>web-first assertion</b> استعمال کریں، جو شرط پوری ہونے تک خود دوبارہ کوشش کرتی ہے، اس لیے fixed wait کی ضرورت نہیں پڑتی۔ اگر ایک locator کئی elements سے match کرے تو Playwright غلطی دیتا ہے، اس لیے اسے row یا container تک محدود کریں۔',
      'ur-Latn': 'Playwright mein test ke teen basic hissay hain: <b>locator</b> (element dhoondna), <b>action</b> (click, fill waghera) aur <b>assertion</b> (result check karna). Element ko waise dhoondein jaise user usay dekhta hai: pehle getByRole, phir getByLabel, getByPlaceholder, getByText, aur zaroorat ho to getByTestId. Lambay CSS ya XPath raaste last option hain kyun ke design badalte hi toot jaate hain. Misaal: page.getByRole("button", { name: "Sign in" }).click(). Result check karne ke liye await expect(locator).toBeVisible() jaisi <b>web-first assertion</b> use karein, jo condition poori hone tak khud dobara try karti hai, is liye fixed wait ki zaroorat nahin parti. Agar ek locator kai elements se match kare to Playwright error deta hai, is liye usay row ya container tak mehdood karein.',
      'hi': 'Playwright में test के तीन बुनियादी हिस्से हैं: <b>locator</b> (element ढूँढना), <b>action</b> (click, fill आदि) और <b>assertion</b> (नतीजा जाँचना)। Element को वैसे ढूँढें जैसे user उसे देखता है: पहले getByRole, फिर getByLabel, getByPlaceholder, getByText, और ज़रूरत हो तो getByTestId। लंबे CSS या XPath रास्ते आख़िरी विकल्प हैं, क्योंकि design बदलते ही टूट जाते हैं। उदाहरण: page.getByRole("button", { name: "Sign in" }).click()। नतीजा जाँचने के लिए await expect(locator).toBeVisible() जैसी <b>web-first assertion</b> इस्तेमाल करें, जो शर्त पूरी होने तक ख़ुद दोबारा कोशिश करती है, इसलिए fixed wait की ज़रूरत नहीं पड़ती। अगर एक locator कई elements से match करे तो Playwright error देता है, इसलिए उसे row या container तक सीमित करें।',
      'ar': 'لاختبار Playwright ثلاثة أجزاء أساسية: <b>locator</b> (تحديد العنصر)، و<b>action</b> (مثل click وfill)، و<b>assertion</b> (التحقق من النتيجة). حدِّد العنصر كما يراه المستخدم: ابدأ بـ getByRole، ثم getByLabel وgetByPlaceholder وgetByText، واستخدم getByTestId عند الحاجة. أما مسارات CSS أو XPath الطويلة فهي الخيار الأخير لأنها تنكسر مع أي تغيير في التصميم. مثال: page.getByRole("button", { name: "Sign in" }).click(). وللتحقق من النتيجة استخدم <b>web-first assertion</b> مثل await expect(locator).toBeVisible()، فهي تعيد المحاولة تلقائيًا حتى يتحقق الشرط، فلا حاجة إلى انتظار ثابت. وإذا طابق الـ locator أكثر من عنصر واحد يرمي Playwright خطأً، لذا قيّده بصف أو حاوية محددة.',
      'es': 'Un test de Playwright tiene tres piezas básicas: el <b>locator</b> (encontrar el elemento), la <b>acción</b> (click, fill, etc.) y la <b>aserción</b> (comprobar el resultado). Busca los elementos como los percibe el usuario: primero getByRole, luego getByLabel, getByPlaceholder, getByText y, si hace falta, getByTestId. Las rutas largas de CSS o XPath son el último recurso, porque se rompen con cualquier rediseño. Ejemplo: page.getByRole("button", { name: "Sign in" }).click(). Para verificar, usa una <b>aserción web-first</b> como await expect(locator).toBeVisible(), que reintenta sola hasta que se cumple la condición, así que no necesitas esperas fijas. Si un locator coincide con varios elementos, Playwright lanza un error: acótalo a una fila o a un contenedor.'
    },
    keyTerms: [
      { term: 'Locator', def: 'A lazy description of how to find an element; it is resolved fresh every time an action or assertion uses it.' },
      { term: 'Accessible name', def: 'The name assistive technology announces for an element, such as a button’s text or a field’s label. getByRole matches on it.' },
      { term: 'Web-first assertion', def: 'An awaited expect on a locator or page, such as toBeVisible or toHaveText, that retries until it passes or times out.' },
      { term: 'Strictness', def: 'Playwright refuses to act on a locator that matches more than one element, so a test never clicks the wrong one by accident.' },
      { term: 'Codegen', def: 'npx playwright codegen records browser actions and generates test code with suggested locators.' }
    ],
    practice: [
      { q: 'Write the best locator for each element: (a) a “Place order” button; (b) an input labelled “Postal code”; (c) a search box whose only hint is the placeholder “Search products”; (d) a cart badge with no label but the attribute <code>data-testid="cart-count"</code>.', answer: "(a) <code>page.getByRole('button', { name: 'Place order' })</code> (b) <code>page.getByLabel('Postal code')</code> (c) <code>page.getByPlaceholder('Search products')</code> (d) <code>page.getByTestId('cart-count')</code> — <code>getByTestId</code> reads the <code>data-testid</code> attribute by default (configurable with <code>testIdAttribute</code>)." },
      { q: "A PeopleOps table lists employees and every row has an <b>Edit</b> button. <code>await page.getByRole('button', { name: 'Edit' }).click()</code> fails with a strict mode violation. Why, and how do you fix it?", hint: 'How many elements does the locator match?', answer: "The locator matches several buttons, so Playwright refuses to guess. Scope it to the row you mean: <code>page.getByRole('row').filter({ hasText: 'Asha Khan' }).getByRole('button', { name: 'Edit' })</code>. Avoid <code>.first()</code> or <code>.nth(2)</code> unless position is what you are testing — row order can change." },
      { q: "Rewrite this as a web-first assertion: <code>expect(await page.locator('.msg').textContent()).toBe('Profile saved')</code>", answer: "<code>await expect(page.getByText('Profile saved')).toBeVisible()</code>, or, if the app gives the message <code>role=\"status\"</code>, <code>await expect(page.getByRole('status')).toHaveText('Profile saved')</code>. The original reads the text once and fails if the message arrives a moment later; web-first assertions retry until they pass or time out." }
    ],
    quiz: [
      { q: 'Which locator does Playwright recommend first for a “Sign in” button?', options: ["<code>page.locator('#btn-submit-primary')</code>", "<code>page.locator('//form/div[3]/button')</code>", "<code>page.getByRole('button', { name: 'Sign in' })</code>", "<code>page.getByTestId('signin')</code>"], correct: 2,
        why: ['IDs can work, but they are implementation details that may change and say nothing about what the user sees.', 'Positional XPath breaks as soon as the form layout changes.', 'Right — role plus accessible name matches how users and assistive technology find the button.', 'A test id is a good fallback, but a button with a clear accessible name should be located by role first.'] },
      { q: "What happens when a test runs await page.getByRole('button', { name: 'Edit' }).click() and three Edit buttons are on the page?", options: ['Playwright throws a strict mode violation error', 'Playwright clicks the first matching button', 'Playwright clicks all three buttons in order', 'Playwright picks the most visible button and clicks it'], correct: 0,
        why: ['Right — locators are strict; scope the locator to a row or container instead.', 'Some older tools silently took the first match; Playwright locators refuse to guess.', 'An action targets exactly one element; clicking all of them would need a loop over a scoped list.', 'Playwright does not rank matches by visibility — it reports the ambiguity as an error.'] },
      { q: "Why is await expect(page.getByText('Saved')).toBeVisible() better than expect(await page.getByText('Saved').isVisible()).toBe(true)?", options: ['It runs faster because it does not query the DOM', 'It works only in headed mode, so it is easier to debug', 'It checks the message in every configured browser at once', 'It retries until the text is visible or the timeout expires'], correct: 3,
        why: ['Both query the DOM; speed is not the difference.', 'Web-first assertions behave the same headless and headed.', 'Browsers are chosen by projects in the config, not by an assertion.', 'Right — isVisible() checks once and returns immediately, so a message that appears a moment later fails the test.'] },
      { q: 'Which command opens Playwright’s interactive UI mode so you can watch and step through tests?', options: ['npx playwright show-report', 'npx playwright test --ui', 'npx playwright install --ui', 'npm init playwright@latest --ui'], correct: 1,
        why: ['show-report opens the HTML report of a finished run.', 'Right — UI mode lets you run, watch, filter and time-travel through tests.', 'install downloads browsers; it has no UI mode.', 'This scaffolds a new project; it does not run tests.'] },
      { q: 'A form field has the visible label “Postal code” and the generated class .inp-7x. Which locator is most robust?', options: ["<code>page.locator('.inp-7x')</code>", "<code>page.locator('form input').nth(4)</code>", "<code>page.getByText('Postal code')</code>", "<code>page.getByLabel('Postal code')</code>"], correct: 3,
        why: ['Generated class names often change with each build or style refactor.', 'Position breaks when fields are added or reordered.', 'getByText finds the label text itself, not the input you want to fill.', 'Right — getByLabel finds the input associated with that label, just as a user would.'] }
    ],
    interview: [
      { q: 'How do you choose locators in Playwright to make tests reliable?', a: 'I locate elements the way a user does. My first choice is <code>getByRole</code> with an accessible name, then <code>getByLabel</code> for form fields, then <code>getByPlaceholder</code> or <code>getByText</code>. If there is no stable user-facing hook, I use <code>getByTestId</code> with an agreed <code>data-testid</code>. CSS or XPath is a last resort, and never long positional paths. For repeated elements, such as an Edit button in every row, I scope to the row by its unique text with <code>filter({ hasText })</code> and then find the button inside it. I rely on auto-waiting and web-first assertions instead of fixed sleeps, and I check in UI mode that each locator matches exactly one element.' },
      { q: 'What is a web-first assertion?', a: 'It is an awaited <code>expect</code> on a locator or page, such as <code>await expect(locator).toBeVisible()</code> or <code>await expect(page).toHaveURL(/dashboard/)</code>. Instead of reading the state once, it <b>retries</b> until the condition is met or the assertion timeout expires — 5 seconds by default. That matches how modern apps behave, where content appears after network calls and rendering, so tests are faster and more stable than with fixed waits. The failure message also shows the locator and the value actually received, which speeds up debugging.' }
    ],
    takeaways: [
      'Start with <code>npm init playwright@latest</code>; run with <code>npx playwright test</code>, <code>--headed</code> or <code>--ui</code>.',
      'Locator priority: getByRole → getByLabel → getByPlaceholder → getByText → getByTestId → CSS/XPath last.',
      'Locators are strict — scope repeated elements to a row or container.',
      'Always <code>await</code> web-first assertions; they retry, one-off checks do not.',
      'Codegen is a learning aid; review its output before committing.'
    ],
    links: { labs: ['ui', 'login'], challenges: ['ui-interactions', 'peopleops-login'], interview: ['p1'] }
  },

  /* ───────────────────────── 3 · Waits and synchronisation ───────────────────────── */
  {
    id: 'au-waits',
    n: 3,
    level: 'intermediate',
    title: 'Auto-waiting, assertions and synchronisation',
    summary: 'Synchronise tests with the app by relying on auto-waiting and waiting for meaningful state — never for an arbitrary number of seconds.',
    minutes: 20,
    objectives: [
      'Describe the actionability checks Playwright runs before an action',
      'Explain why hard sleeps make tests both slow and flaky',
      'Wait for meaningful state with web-first assertions, expect.poll and waitForResponse',
      'Configure test, assertion and action timeouts deliberately'
    ],
    body: [
      { t: 'p', html: 'Web apps are asynchronous. After a click the browser may send a request, wait for the server, re-render a list and play an animation. A test that runs faster than the app checks the page too early and fails; a test that waits a fixed time is either too slow or, on a busy CI machine, still too early. <b>Synchronisation</b> means making the test wait for exactly the thing it needs — no more, no less.' },
      { t: 'h', text: 'Auto-waiting: actionability checks' },
      { t: 'p', html: "Before every action, Playwright resolves the locator to exactly one element and runs <b>actionability checks</b>, retrying until they all pass or the action times out. That is why <code>await page.getByRole('button', { name: 'Pay now' }).click()</code> does not fail just because the button is still disabled while the form validates: Playwright waits for it to become enabled. Which checks run depends on the action." },
      { t: 'table', head: ['Check', 'Meaning', 'Used by (examples)'], rows: [
        ['Visible', 'Has a non-empty bounding box and no <code>visibility: hidden</code> style', '<code>click</code>, <code>fill</code>, <code>check</code>, <code>hover</code>, <code>selectOption</code>'],
        ['Stable', 'Not animating — same bounding box for two consecutive animation frames', '<code>click</code>, <code>check</code>, <code>hover</code>'],
        ['Receives events', 'Is the actual hit target — not covered by an overlay, modal or cookie banner', '<code>click</code>, <code>check</code>, <code>hover</code>'],
        ['Enabled', 'Not disabled (no <code>disabled</code> attribute, not inside a disabled fieldset)', '<code>click</code>, <code>fill</code>, <code>check</code>, <code>selectOption</code>'],
        ['Editable', 'Enabled and not read-only', '<code>fill</code>, <code>clear</code>']
      ] },
      { t: 'callout', tone: 'warn', title: 'Do not “fix” waits with force', html: '<code>click({ force: true })</code> skips the non-essential checks. If a test only passes with <code>force</code>, a real user probably cannot click that element either — an overlay, an animation or a disabled state is in the way. Investigate the cause before forcing anything.' },
      { t: 'h', text: 'Why hard sleeps are flaky' },
      { t: 'compare',
        a: { title: 'Hard sleep', items: ['<code>await page.waitForTimeout(3000)</code> waits 3 s whether the app needs 0.2 s or 4 s', 'Too short on a slow CI runner → random failures', 'Too long on a fast machine → minutes wasted across hundreds of tests', 'Hides what the test is really waiting for'] },
        b: { title: 'Condition-based wait', items: ["<code>await expect(page.getByRole('row')).toHaveCount(3)</code> continues the moment the condition is true", 'Waits up to the timeout on slow runs, so it stays stable', 'Fast runs stay fast', 'Documents the expected state in the code itself'] } },
      { t: 'h', text: 'Wait for meaningful state' },
      { t: 'p', html: "Ask: “What would a user wait for before taking the next step?” Usually it is visible content — a results row, a heading, a success message, a URL change. Assert that state with a web-first assertion and the waiting comes for free. A disappearing spinner is a weak signal on its own: <code>toBeHidden()</code> passes instantly if the spinner has not appeared yet. Avoid <code>waitForLoadState('networkidle')</code> too — Playwright discourages it, because apps with polling or analytics may never go idle and “no requests” does not prove the right content rendered." },
      { t: 'code', lang: 'ts', title: 'MediBook: search results behind a spinner', code: `test('search shows matching doctors', async ({ page }) => {
  await page.goto('/doctors');
  await page.getByPlaceholder('Search by name or specialty').fill('cardio');
  await page.getByRole('button', { name: 'Search' }).click();

  // Positive, meaningful state first — then the spinner as an extra check
  const results = page.getByRole('listitem').filter({ hasText: 'Cardiology' });
  await expect(results).toHaveCount(3);
  await expect(results.first()).toContainText('Dr. Sara Malik');
  await expect(page.getByTestId('results-spinner')).toBeHidden();
  await expect(page).toHaveURL(/q=cardio/);
});` },
      { t: 'code', lang: 'ts', title: 'Network responses and values that are not on the page', code: `test('booking is saved and a reminder is scheduled', async ({ page, request }) => {
  await page.goto('/doctors/42/book');

  // Start listening BEFORE the click, then await the promise after it
  const saved = page.waitForResponse(res =>
    res.url().includes('/api/appointments') && res.request().method() === 'POST');
  await page.getByRole('button', { name: 'Confirm booking' }).click();
  expect((await saved).status()).toBe(201);
  await expect(page.getByRole('status')).toHaveText('Booking confirmed');

  // Retry a function until its value matches (here: a background job via the API)
  await expect.poll(async () => {
    const res = await request.get('/api/appointments/latest/reminder');
    return (await res.json()).state;
  }, { timeout: 15_000 }).toBe('scheduled');
});` },
      { t: 'p', html: 'The <code>waitForResponse</code> promise is created <b>before</b> the click: if you start listening afterwards, a fast response may already have arrived and the test hangs until it times out. <code>expect.poll</code> retries a function until the returned value satisfies the matcher — ideal for backend state. For a block of several assertions that must all pass together, <code>await expect(async () =&gt; { … }).toPass()</code> retries the whole block.' },
      { t: 'table', caption: 'Timeouts in Playwright Test and where to change them', head: ['Timeout', 'Default', 'Set with'], rows: [
        ['Whole test (including its hooks and fixtures)', '30 s', '<code>timeout</code> in the config, or <code>test.setTimeout()</code> inside a test'],
        ['Each web-first assertion', '5 s', '<code>expect: { timeout }</code> in the config, or <code>{ timeout }</code> on one assertion'],
        ['Each action (click, fill…)', 'No separate limit — bounded by the test timeout', '<code>use: { actionTimeout }</code>'],
        ['Each navigation (goto, waitForURL)', 'No separate limit — bounded by the test timeout', '<code>use: { navigationTimeout }</code>']
      ] },
      { t: 'callout', tone: 'key', title: 'Before you raise a timeout', html: 'A timeout failure is a question, not an instruction. Open the trace: did the request fail, did the spinner never stop, did a different message appear? Raise a timeout only for operations that are legitimately slow — such as a large report export — and raise it locally on that test or assertion, not for the whole suite.' }
    ],
    example: {
      title: 'Worked example: de-flaking the PeopleOps “Save profile” test',
      blocks: [
        { t: 'p', html: 'This test passes on laptops but fails about once in ten CI runs with “Expected: Profile saved — Received: Saving…”. The trace shows the save request took 2.4 s on the CI runner.' },
        { t: 'code', lang: 'ts', title: 'Before — a guess about timing', code: `await page.getByLabel('Phone').fill('+92 300 1234567');
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(2000);
const msg = await page.getByRole('status').textContent();
expect(msg).toBe('Profile saved');` },
        { t: 'code', lang: 'ts', title: 'After — waits for real state, then proves persistence', code: `await page.getByLabel('Phone').fill('+92 300 1234567');
const saved = page.waitForResponse(res =>
  res.url().includes('/api/profile') && res.request().method() === 'PUT');
await page.getByRole('button', { name: 'Save' }).click();
expect((await saved).ok()).toBeTruthy();
await expect(page.getByRole('status')).toHaveText('Profile saved');

await page.reload();
await expect(page.getByLabel('Phone')).toHaveValue('+92 300 1234567');` },
        { t: 'p', html: 'The 2-second sleep was a guess. The new version waits for the actual PUT response, then for the message with a retrying assertion. Reloading and checking the field proves the value was <b>persisted</b>, not merely displayed — a success toast alone does not prove the data was saved.' }
      ]
    },
    explain: {
      'ur': 'Web app میں ہر کام فوراً نہیں ہوتا: click کے بعد request جاتی ہے، server جواب دیتا ہے، پھر screen بدلتی ہے۔ Playwright ہر action سے پہلے خود انتظار کرتا ہے کہ element نظر آئے، رکا ہوا ہو، enabled ہو اور کسی overlay کے نیچے نہ ہو — اسے <b>auto-waiting</b> کہتے ہیں۔ waitForTimeout(3000) جیسا fixed انتظار غلط ہے: تیز machine پر وقت ضائع کرتا ہے اور سست CI پر پھر بھی کم پڑ جاتا ہے۔ اس کی بجائے اُس چیز کا انتظار کریں جس کا user انتظار کرتا ہے، مثلاً: await expect(page.getByText("Booking confirmed")).toBeVisible()۔ یہ assertion شرط پوری ہوتے ہی آگے بڑھ جاتی ہے۔ Network کے لیے waitForResponse کو click سے پہلے شروع کریں، اور timeout بڑھانے سے پہلے trace ضرور دیکھیں۔',
      'ur-Latn': 'Web app mein har kaam foran nahin hota: click ke baad request jaati hai, server jawab deta hai, phir screen badalti hai. Playwright har action se pehle khud intezar karta hai ke element nazar aaye, ruka hua ho, enabled ho aur kisi overlay ke neeche na ho — isay <b>auto-waiting</b> kehte hain. waitForTimeout(3000) jaisa fixed intezar ghalat hai: tez machine par waqt zaya karta hai aur slow CI par phir bhi kam par jaata hai. Is ke bajaye us cheez ka intezar karein jis ka user intezar karta hai, maslan: await expect(page.getByText("Booking confirmed")).toBeVisible(). Yeh assertion condition poori hote hi aagay barh jaati hai. Network ke liye waitForResponse ko click se pehle start karein, aur timeout barhane se pehle trace zaroor dekhein.',
      'hi': 'Web app में हर काम तुरंत नहीं होता: click के बाद request जाती है, server जवाब देता है, फिर screen बदलती है। Playwright हर action से पहले ख़ुद इंतज़ार करता है कि element दिखे, स्थिर हो, enabled हो और किसी overlay के नीचे न हो — इसे <b>auto-waiting</b> कहते हैं। waitForTimeout(3000) जैसा fixed इंतज़ार ग़लत है: तेज़ machine पर समय बर्बाद करता है और धीमे CI पर फिर भी कम पड़ जाता है। इसकी जगह उस चीज़ का इंतज़ार करें जिसका user इंतज़ार करता है, जैसे: await expect(page.getByText("Booking confirmed")).toBeVisible()। यह assertion शर्त पूरी होते ही आगे बढ़ जाती है। Network के लिए waitForResponse को click से पहले शुरू करें, और timeout बढ़ाने से पहले trace ज़रूर देखें।',
      'ar': 'في تطبيقات الويب لا يحدث كل شيء فورًا: بعد النقر يُرسَل طلب، ثم يردّ الخادم، ثم تتغير الشاشة. ينتظر Playwright تلقائيًا قبل كل action حتى يصبح العنصر ظاهرًا ومستقرًا ومفعّلًا وغير مغطّى بعنصر آخر — وهذا ما يسمى <b>auto-waiting</b>. أما الانتظار الثابت مثل waitForTimeout(3000) فهو خطأ: يضيّع الوقت على الجهاز السريع، وقد لا يكفي على خادم CI بطيء. بدلًا من ذلك انتظر الحالة التي ينتظرها المستخدم، مثل: await expect(page.getByText("Booking confirmed")).toBeVisible()، فهذه الـ assertion تكمل فور تحقق الشرط. وبالنسبة للشبكة ابدأ waitForResponse قبل النقر لا بعده، وقبل زيادة أي timeout افتح الـ trace وافهم السبب.',
      'es': 'En una aplicación web nada ocurre al instante: tras un clic se envía una petición, el servidor responde y luego cambia la pantalla. Playwright espera automáticamente antes de cada acción a que el elemento sea visible, esté quieto, habilitado y no tapado por otro; eso es el <b>auto-waiting</b>. Una espera fija como waitForTimeout(3000) es un error: desperdicia tiempo en una máquina rápida y aun así se queda corta en un CI lento. Espera, en cambio, lo mismo que esperaría el usuario, por ejemplo: await expect(page.getByText("Booking confirmed")).toBeVisible(). Esa aserción continúa en cuanto se cumple la condición. Para la red, crea el waitForResponse antes del clic, y antes de subir un timeout abre el trace y entiende la causa.'
    },
    keyTerms: [
      { term: 'Auto-waiting', def: 'Playwright waits for an element to pass actionability checks before acting, and web-first assertions retry, so manual waits are rarely needed.' },
      { term: 'Actionability checks', def: 'Conditions verified before an action — visible, stable, receives events, enabled, editable — depending on which action it is.' },
      { term: 'Hard sleep', def: 'A fixed pause such as waitForTimeout(3000): too short on slow machines, wasteful on fast ones, and a classic cause of flaky tests.' },
      { term: 'expect.poll', def: 'Retries an async function until its returned value satisfies the matcher; useful for values that are not shown on the page.' },
      { term: 'waitForResponse', def: 'Returns a promise that resolves when a matching network response arrives; create it before the action that triggers the request.' }
    ],
    practice: [
      { q: "A ShopFlow test clicks <b>Apply coupon</b> and immediately runs <code>expect(await page.getByTestId('total').textContent()).toBe('$45.00')</code>. It fails randomly. Explain why and fix it.", answer: "<code>textContent()</code> reads the total once, possibly before the discounted price renders. Use a retrying assertion: <code>await expect(page.getByTestId('total')).toHaveText('$45.00')</code>. It waits until the text matches or the assertion timeout expires — no sleep needed." },
      { q: 'A test waits for the loading spinner with <code>await expect(spinner).toBeHidden()</code> and then counts result rows. Sometimes it counts zero. What is the hidden race?', hint: 'What if the spinner has not appeared yet?', answer: "If the assertion runs before the spinner even appears, <code>toBeHidden()</code> passes immediately and the test races ahead of the search. Always assert the <b>positive</b> outcome, such as <code>await expect(page.getByRole('row')).toHaveCount(5)</code> or a specific result text. Checking the spinner is fine as an extra, not as the only wait." },
      { q: 'Write code that waits for the <code>POST /api/orders</code> response triggered by clicking <b>Place order</b> and checks it returned 201.', answer: "<code>const created = page.waitForResponse(r =&gt; r.url().includes('/api/orders') &amp;&amp; r.request().method() === 'POST');</code><br><code>await page.getByRole('button', { name: 'Place order' }).click();</code><br><code>expect((await created).status()).toBe(201);</code><br>The promise is created <b>before</b> the click so a fast response cannot be missed. Then assert the confirmation in the UI — and, to prove persistence, fetch the new order with a GET." }
    ],
    quiz: [
      { q: "Before page.getByRole('button', { name: 'Pay now' }).click() acts, what does Playwright do if the button is still disabled?", options: ['Waits and retries until it is enabled or the action times out', 'Clicks anyway, because disabled buttons still receive pointer events', 'Fails immediately with an “element is disabled” error', 'Reloads the page and then tries the click again'], correct: 0,
        why: ['Right — “enabled” is one of the actionability checks for click, so Playwright keeps checking.', 'Playwright will not click an element that fails actionability checks unless you pass force: true.', 'It does not fail at once; it retries until the action or test timeout.', 'Playwright never reloads the page on its own.'] },
      { q: 'Why does await page.waitForTimeout(3000) make a suite flaky as well as slow?', options: ['It turns off auto-waiting for every action that follows', 'It only works in Chromium, so other browsers skip it', 'A fixed delay can be too short on slow CI and wasted on fast runs', 'It pauses every parallel worker at once, causing collisions'], correct: 2,
        why: ['Auto-waiting keeps working; the sleep is simply an extra, blind pause.', 'waitForTimeout works in every browser — the problem is the guess, not the browser.', 'Right — a fixed time is a guess about app speed, which varies from run to run.', 'Each worker sleeps independently; there is no global pause.'] },
      { q: 'A search page shows a spinner while results load. What is the most reliable way to wait before checking the results?', options: ["Call page.waitForLoadState('networkidle') after searching", 'Assert the expected result rows with a web-first assertion', 'Add waitForTimeout(5000) to cover the slowest runs', 'Assert only that the spinner is hidden, then read the rows'], correct: 1,
        why: ['Discouraged: background polling can keep the network busy, and idle does not prove the right content rendered.', 'Right — wait for the meaningful outcome, e.g. toHaveCount or toContainText on the results.', 'A guess: slow runs may still exceed it, and every fast run wastes 5 seconds.', 'toBeHidden can pass before the spinner even appears; pair it with a positive assertion on the results.'] },
      { q: 'Why must page.waitForResponse(...) be called before the click that triggers the request?', options: ['Calling it later cancels requests that are still pending', 'Playwright allows only one waitForResponse per test', 'Responses are only recorded when running in headed mode', 'A fast response could arrive before you start listening'], correct: 3,
        why: ['It never cancels requests; it only listens for a matching response.', 'You can wait for as many responses as you need.', 'Network events are captured headless and headed alike.', 'Right — if the response arrives first, a late listener waits until it times out.'] },
      { q: 'With default settings, how long does await expect(locator).toBeVisible() keep retrying before it fails?', options: ['5 seconds', '30 seconds', '60 seconds', 'Until the whole test times out'], correct: 0,
        why: ['Right — the default expect timeout is 5 s; change it with expect: { timeout } in the config.', '30 s is the default timeout for a whole test, not for one assertion.', '60 s is not a Playwright default for assertions.', 'Assertions have their own timeout (5 s by default), separate from the 30 s test timeout.'] }
    ],
    interview: [
      { q: 'A spinner appears while results load. How should a Playwright test wait for the results?', a: "I assert the meaningful result with a web-first assertion, for example <code>await expect(page.getByRole('listitem').filter({ hasText: 'Cardiology' })).toHaveCount(3)</code>. It retries until the results appear, so it adapts to fast and slow runs. If the spinner matters to users I also assert <code>toBeHidden()</code>, but never as the only wait, because it can pass before the spinner even appears. I avoid fixed sleeps and <code>networkidle</code>. If the check times out, I open the trace to see whether the request failed or the UI showed something else before I touch any timeout setting." },
      { q: 'What is auto-waiting in Playwright, and does it remove the need for all waiting code?', a: 'Before each action Playwright waits for the element to pass <b>actionability checks</b> — for a click: visible, stable, receiving events and enabled — and web-first assertions retry until they pass. So I rarely write explicit waits. But auto-waiting does not understand <i>business</i> state: it cannot know that a search has finished or an order was saved. I express those states as assertions — a result row, a URL change, a success message — and use <code>waitForResponse</code> or <code>expect.poll</code> when the signal is a network response or a backend value rather than the DOM.' }
    ],
    takeaways: [
      'Actions auto-wait for actionability checks; web-first assertions retry until they pass.',
      'Never use <code>waitForTimeout</code> as a fix — wait for meaningful state instead.',
      'A hidden spinner alone is a weak signal; also assert the expected result.',
      'Create <code>waitForResponse</code> before the triggering click; use <code>expect.poll</code> for non-UI values.',
      'Defaults: test 30 s, assertion 5 s, actions no separate limit. Read the trace before raising timeouts.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions'], interview: ['p2', 'p6'] }
  },

  /* ───────────────────────── 4 · Fixtures, hooks and test data ───────────────────────── */
  {
    id: 'au-fixtures-data',
    n: 4,
    level: 'intermediate',
    title: 'Fixtures, hooks, test isolation and test data',
    summary: 'Keep tests independent with isolated browser contexts, hooks, custom fixtures, saved login state and parallel-safe test data.',
    minutes: 24,
    objectives: [
      'Explain what browser-context isolation does and does not protect',
      'Use beforeEach/afterEach and custom fixtures built with test.extend',
      'Reuse a logged-in session with storageState and a setup project',
      'Create unique, parallel-safe test data through the API and clean it up'
    ],
    body: [
      { t: 'p', html: 'An independent test can run <b>alone, in any order and in parallel</b> and still give the same result. Playwright helps by giving every test a new <b>browser context</b> — like a fresh incognito profile with its own cookies, local storage and session storage. Tests run in parallel <b>worker</b> processes, so a test that relies on another test’s leftovers will eventually fail when the order or timing changes. The goal of this lesson is simple to state: each test creates what it needs, uses it, and leaves nothing behind that another test could trip over.' },
      { t: 'callout', tone: 'key', title: 'Context isolation stops at the browser', html: 'A fresh context cannot reset the <b>server</b>. If two tests log in as the same user and one changes the account language, the other may see the change. If two workers create an employee called “Test User”, a search may find two rows. Isolating server-side data is your job: unique data, per-test or per-worker accounts, and reliable cleanup.' },
      { t: 'h', text: 'Hooks' },
      { t: 'table', head: ['Hook', 'Runs', 'Typical use', 'Caution'], rows: [
        ['<code>test.beforeEach</code>', 'Before every test in the file or describe block', 'Open the start page, prepare small data', 'Keep it lean — its cost multiplies by the number of tests'],
        ['<code>test.afterEach</code>', 'After every test, including failed ones', 'Delete data the test created, attach extra logs', 'Cleanup must not assume the test reached its last step'],
        ['<code>test.beforeAll</code> / <code>test.afterAll</code>', 'Once per worker for the file or describe block', 'Expensive setup that tests only read', 'No <code>page</code> fixture here; runs again in each worker; avoid mutable shared state']
      ] },
      { t: 'h', text: 'Custom fixtures with test.extend' },
      { t: 'p', html: 'A <b>fixture</b> is setup and teardown packaged as a named value that a test requests in its parameters, just like the built-in <code>page</code> and <code>request</code>. Code before <code>await use(value)</code> is setup; code after it is teardown, which runs even if the test fails. Fixtures are <b>on demand</b> — only tests that list them pay for them — and they compose, so one fixture can depend on another.' },
      { t: 'code', lang: 'ts', title: 'fixtures.ts', code: `import { test as base, expect } from '@playwright/test';

type Employee = { id: string; name: string };

export const test = base.extend<{ employee: Employee }>({
  employee: async ({ request }, use, testInfo) => {
    // Setup: unique data per test, created through the API (fast, no UI)
    const name = \`QA Temp \${testInfo.workerIndex}-\${Date.now()}\`;
    const res = await request.post('/api/employees', { data: { name, department: 'Finance' } });
    await expect(res).toBeOK();
    const employee: Employee = await res.json();

    await use(employee); // the test body runs here

    // Teardown: runs after the test, whether it passed or failed
    await request.delete(\`/api/employees/\${employee.id}\`);
  },
});
export { expect };` },
      { t: 'code', lang: 'ts', title: 'tests/employees.spec.ts', code: `import { test, expect } from '../fixtures';

test('HR can find a new employee by name', async ({ page, employee }) => {
  await page.goto('/employees');
  await page.getByPlaceholder('Search employees').fill(employee.name);
  await expect(page.getByRole('row').filter({ hasText: employee.name })).toHaveCount(1);
});` },
      { t: 'h', text: 'Logged-in sessions with storageState' },
      { t: 'p', html: 'Logging in through the UI in every test is slow and repeats the same steps hundreds of times. Instead, sign in <b>once</b> in a setup project, save the browser state to a file and load it into each test’s new context. <code>storageState</code> saves cookies and local storage (IndexedDB optionally) — <b>not</b> session storage. Every test still gets its own fresh context; it simply starts already signed in. Need several roles? Save one file per role (HR admin, employee, manager) and choose the right one per project or with <code>test.use({ storageState: … })</code> in a describe block. Keep one real UI login test so the login page itself stays covered.' },
      { t: 'code', lang: 'ts', title: 'tests/auth.setup.ts and playwright.config.ts (excerpt)', code: `// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('sign in as HR admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.HR_ADMIN_EMAIL!);
  await page.getByLabel('Password').fill(process.env.HR_ADMIN_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: 'playwright/.auth/hr-admin.json' });
});

// playwright.config.ts — inside defineConfig({ ... })
projects: [
  { name: 'setup', testMatch: /.*\\.setup\\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/hr-admin.json' },
    dependencies: ['setup'],
  },
],` },
      { t: 'h', text: 'Test data strategies' },
      { t: 'table', head: ['Strategy', 'How', 'Strength', 'Watch out'], rows: [
        ['Create per test via API', 'A fixture posts a new record and deletes it afterwards', 'Independent, fast and parallel-safe', 'Needs a test API and dependable cleanup'],
        ['Unique values', 'Add <code>testInfo.workerIndex</code>, a timestamp or <code>crypto.randomUUID()</code> to names and emails', 'No collisions between workers or reruns', 'Search with the exact unique value'],
        ['Seeded reference data', 'Fixed products, roles and countries loaded with the environment', 'Stable lookups for reading', 'Tests must never modify it'],
        ['Account per worker', 'One test user per <code>workerIndex</code>, each with its own storage state', 'Settings changes cannot leak into other workers', 'More accounts to create and maintain']
      ] },
      { t: 'callout', tone: 'warn', title: 'Do not hide shared-state bugs with serial runs', html: 'Running the whole suite on one worker, or chaining tests so test 2 uses data from test 1, “fixes” collisions by making everything slower and more fragile — one failure then cascades into many. Fix the data instead. Also add <code>playwright/.auth</code> to <code>.gitignore</code>: storage-state files contain live session tokens.' }
    ],
    example: {
      title: 'Worked example: a test that passes alone but fails in the suite',
      blocks: [
        { t: 'p', html: 'In PeopleOps, <code>settings.spec.ts</code> passes alone but fails in the full run about 30% of the time: the page header reads “Configuración” instead of “Settings”. The trace shows the app was already in Spanish when the test started.' },
        { t: 'list', ordered: true, items: [
          '<b>Evidence:</b> every spec signs in as the same <code>hr-admin</code> account through one shared storage-state file.',
          '<b>Root cause:</b> <code>locale.spec.ts</code> switches the account language to Spanish and switches it back only at the end — when it passes. Meanwhile, other workers see Spanish.',
          '<b>Fix 1:</b> the locale test now gets its own throwaway user from an API fixture, so its change cannot leak.',
          '<b>Fix 2:</b> resetting the language moves into fixture teardown, which runs even when the test fails.',
          '<b>Verify:</b> <code>npx playwright test --repeat-each=10 --workers=4</code> passes with no failures.'
        ] },
        { t: 'p', html: 'Notice what the team did <i>not</i> do: add retries, force serial mode or rename the file so it runs “last”. Each of those would have hidden the dependency instead of removing it.' }
      ]
    },
    explain: {
      'ur': 'اچھا automated test اکیلے بھی چلے، کسی بھی ترتیب میں بھی، اور دوسرے tests کے ساتھ parallel میں بھی — نتیجہ ایک ہی آئے۔ Playwright ہر test کو نیا <b>browser context</b> دیتا ہے، یعنی الگ cookies اور storage، جیسے نئی incognito window۔ لیکن یہ صرف browser کو الگ کرتا ہے، server کے data کو نہیں۔ اگر دو tests ایک ہی user استعمال کریں اور ایک اس کی settings بدل دے تو دوسرا fail ہو سکتا ہے۔ اس لیے <b>fixture</b> (test.extend) سے ہر test کے لیے API کے ذریعے نیا data بنائیں، نام میں unique حصہ لگائیں جیسے "QA Temp 3-1731300000"، اور test کے بعد اسے delete کریں۔ Login بار بار UI سے کرنے کی بجائے ایک بار کر کے storageState میں محفوظ کریں۔',
      'ur-Latn': 'Acha automated test akelay bhi chale, kisi bhi tarteeb mein bhi, aur doosre tests ke saath parallel mein bhi — result ek hi aaye. Playwright har test ko naya <b>browser context</b> deta hai, yaani alag cookies aur storage, jaise nayi incognito window. Lekin yeh sirf browser ko alag karta hai, server ke data ko nahin. Agar do tests ek hi user use karein aur ek us ki settings badal de to doosra fail ho sakta hai. Is liye <b>fixture</b> (test.extend) se har test ke liye API ke zariye naya data banayein, naam mein unique hissa lagayein jaise "QA Temp 3-1731300000", aur test ke baad usay delete karein. Login baar baar UI se karne ke bajaye ek baar kar ke storageState mein save karein.',
      'hi': 'अच्छा automated test अकेले भी चले, किसी भी क्रम में भी, और दूसरे tests के साथ parallel में भी — नतीजा एक ही आए। Playwright हर test को नया <b>browser context</b> देता है, यानी अलग cookies और storage, जैसे नई incognito window। लेकिन यह सिर्फ़ browser को अलग करता है, server के data को नहीं। अगर दो tests एक ही user इस्तेमाल करें और एक उसकी settings बदल दे, तो दूसरा fail हो सकता है। इसलिए <b>fixture</b> (test.extend) से हर test के लिए API के ज़रिए नया data बनाएँ, नाम में unique हिस्सा जोड़ें जैसे "QA Temp 3-1731300000", और test के बाद उसे delete करें। Login बार-बार UI से करने की जगह एक बार करके storageState में save करें।',
      'ar': 'الاختبار الآلي الجيد يعمل وحده، وبأي ترتيب، وبالتوازي مع غيره، ويعطي النتيجة نفسها دائمًا. يمنح Playwright كل اختبار <b>browser context</b> جديدًا، أي cookies وتخزينًا منفصلين، كأنه نافذة تصفح خفي جديدة. لكن هذا يعزل المتصفح فقط، لا بيانات الخادم. فإذا استخدم اختباران المستخدم نفسه وغيّر أحدهما إعداداته، فقد يفشل الآخر. لذلك استخدم <b>fixture</b> عبر test.extend لإنشاء بيانات جديدة لكل اختبار من خلال الـ API، وأضف إلى الاسم جزءًا فريدًا مثل "QA Temp 3-1731300000"، ثم احذفها بعد انتهاء الاختبار. وبدل تسجيل الدخول عبر الواجهة في كل اختبار، سجّل الدخول مرة واحدة واحفظ الحالة في storageState.',
      'es': 'Un buen test automatizado funciona solo, en cualquier orden y en paralelo con otros, y siempre da el mismo resultado. Playwright crea para cada test un <b>browser context</b> nuevo, con cookies y almacenamiento propios, como una ventana de incógnito recién abierta. Pero eso aísla el navegador, no los datos del servidor: si dos tests usan el mismo usuario y uno cambia su configuración, el otro puede fallar. Por eso conviene crear con una <b>fixture</b> (test.extend) datos nuevos para cada test a través de la API, con un nombre único como "QA Temp 3-1731300000", y borrarlos al terminar. En lugar de iniciar sesión por la interfaz en cada test, hazlo una sola vez y guarda el estado con storageState.'
    },
    keyTerms: [
      { term: 'Browser context', def: 'An isolated browser session with its own cookies and storage. Playwright creates a new one for every test.' },
      { term: 'Fixture', def: 'Named, on-demand setup and teardown given to a test through its parameters, such as page, request or a custom employee.' },
      { term: 'test.extend', def: 'Creates a test function with extra custom fixtures; code before await use() is setup and code after it is teardown.' },
      { term: 'storageState', def: 'A saved snapshot of cookies and local storage that lets new browser contexts start already logged in.' },
      { term: 'Worker', def: 'A separate process that runs tests in parallel. testInfo.workerIndex identifies it, which helps make test data unique.' }
    ],
    practice: [
      { q: 'Two ShopFlow tests both sign in as <code>qa@shopflow.test</code>. One empties the cart; the other expects two items in it. They pass alone but fail randomly together. Why didn’t browser-context isolation help, and what are two fixes?', answer: 'Contexts isolate cookies and storage in the <b>browser</b>, but the cart lives on the <b>server</b> and is shared by everyone using that account. Fixes: (1) give each test its own user or cart, created through an API fixture; (2) if accounts are limited, use one account per worker (keyed by <code>testInfo.workerIndex</code>) and have each test set up the exact cart it needs at the start instead of assuming earlier state.' },
      { q: 'Write a custom fixture <code>product</code> that creates a product through <code>POST /api/products</code> before the test and deletes it afterwards.', hint: 'Use base.extend, the request fixture and await use().', answer: "<code>export const test = base.extend&lt;{ product: Product }&gt;({</code><br><code>product: async ({ request }, use) =&gt; {</code><br><code>const res = await request.post('/api/products', { data: { name: 'Lamp ' + Date.now() } });</code><br><code>await expect(res).toBeOK();</code><br><code>const product = await res.json();</code><br><code>await use(product);</code><br><code>await request.delete('/api/products/' + product.id);</code><br><code>},</code><br><code>});</code><br>Everything before <code>use</code> is setup; the delete after it runs even if the test fails, and only tests that ask for <code>product</code> pay for it." },
      { q: 'Your team signs in through the UI at the start of all 300 tests. What would you change, and what must you remember about the saved file?', answer: "Add a <b>setup project</b> that signs in once and calls <code>page.context().storageState({ path })</code>, then set <code>storageState</code> on the browser projects with <code>dependencies: ['setup']</code>. Each test still gets a fresh context but starts signed in. The JSON file holds live session cookies, so add <code>playwright/.auth</code> to <code>.gitignore</code>, never publish it as an artifact, and keep one dedicated UI login test so the login page itself stays covered." }
    ],
    quiz: [
      { q: 'What does Playwright’s new browser context for each test isolate?', options: ['Everything, including records in the server database', 'Only the test’s source code and its imports', 'Network traffic between workers on the CI machine', 'Cookies, local storage and other browser state'], correct: 3,
        why: ['A browser context cannot reset or separate data stored on the server.', 'Contexts isolate browser sessions, not source code.', 'Contexts are about browser state, not network separation between processes.', 'Right — each test starts with a clean browser profile, but server data is still shared.'] },
      { q: 'In a custom fixture, when does the code written after await use(value) run?', options: ['Before the test starts, right after setup', 'After the test finishes, even if it failed', 'Only when the test passes', 'Once per worker, after every test in the file'], correct: 1,
        why: ['Code before use() is the setup; code after it is the teardown.', 'Right — which is why fixture teardown is a safe place for cleanup.', 'Teardown runs whether the test passed or failed.', 'That describes a worker-scoped fixture or afterAll, not a normal test-scoped fixture.'] },
      { q: 'Two parallel workers both create an employee named “Test User” and then search for it. What is the best fix?', options: ['Force the whole suite onto a single worker', 'Add retries so the collision is retried later', 'Make the name unique, e.g. with workerIndex', 'Wait a few seconds before running the search'], correct: 2,
        why: ['It hides the collision and slows the suite; parallel runs are still the goal.', 'Retries mask the problem, and the collision can happen again on the retry.', 'Right — unique data removes the collision at its source.', 'Waiting does not change the fact that two records share a name.'] },
      { q: 'What does storageState let you do?', options: ['Start tests signed in from saved cookies and local storage', 'Share one live page between every test running in the same worker', 'Store test results in a database for later reporting', 'Save session storage so it is restored on every page'], correct: 0,
        why: ['Right — sign in once, save the state, and load it into each new context.', 'Each test still gets its own fresh context and page; storageState only pre-fills it.', 'Reporters handle results; storageState is about browser state.', 'storageState does not include session storage; it covers cookies and local storage (IndexedDB optionally).'] },
      { q: 'Which hook should open the employee list page before every test in a file?', options: ['test.beforeAll', 'test.afterEach', 'test.beforeEach', 'test.afterAll'], correct: 2,
        why: ['beforeAll runs once per worker and cannot use the test-scoped page fixture; each test has its own page.', 'afterEach runs after each test — too late for setup.', 'Right — it runs before every test, on that test’s fresh page.', 'afterAll runs once at the end, which is far too late.'] }
    ],
    interview: [
      { q: 'A Playwright test passes alone but fails in the full suite. What would you check first?', a: 'I suspect <b>shared state or order dependence</b>. I compare traces from an isolated run and a suite run to see what was different when the test started. Then I look for shared accounts, server data, files or storage state that another test changes, data with non-unique names that collides in parallel, and cleanup that only runs on success. I fix it by giving the test its own data through an API fixture, making names unique per worker and moving cleanup into fixture teardown. I don’t use serial mode or retries as the fix, and I verify with <code>--repeat-each</code> and several workers.' },
      { q: 'Why create test data through the API instead of the UI?', a: 'Setup through the UI is slow and fragile — if the “create employee” page breaks, every test that needs an employee fails for the wrong reason. An API call takes milliseconds, is stable and lets each test create exactly the data it needs with unique values, then delete it afterwards. The UI journey for creating an employee still deserves its own focused test; other tests simply should not depend on it. Failures then point to the real problem, and parallel runs stay safe.' }
    ],
    takeaways: [
      'Every test gets a fresh browser context — but server data is still shared.',
      'Use fixtures (<code>test.extend</code>) for setup and teardown; teardown runs even after a failure.',
      'Sign in once with a setup project and <code>storageState</code>; keep the auth file out of git.',
      'Create data through the API with unique names; never depend on another test’s leftovers.',
      'Fix collisions at the source — not with serial runs or retries.'
    ],
    links: { labs: ['login'], challenges: ['peopleops-login', 'shopflow-checkout'], interview: ['p5', 'p3'] }
  },

  /* ───────────────────────── 5 · Framework comparison ───────────────────────── */
  {
    id: 'au-frameworks',
    n: 5,
    level: 'intermediate',
    title: 'Playwright, Cypress and Selenium compared',
    summary: 'Compare how Playwright, Cypress and Selenium work, where each shines and struggles, and choose a framework that fits the team’s context.',
    minutes: 18,
    objectives: [
      'Describe how Playwright, Cypress and Selenium each talk to the browser',
      'Compare languages, browser support, waiting, parallelism and multi-tab support',
      'Read an equivalent login test written in each framework',
      'Recommend a framework from team skills, product needs and existing investment'
    ],
    body: [
      { t: 'p', html: 'Playwright, Cypress and Selenium WebDriver can all open a browser, click, type and check results. The differences come from <b>how each one talks to the browser</b>, and those differences shape daily work: how waits behave, which browsers and languages you can use, how tests run in parallel and how easy multi-tab or iframe scenarios are. Interviewers ask about this to see whether you understand trade-offs — not to hear which tool is “best”.' },
      { t: 'cards', items: [
        { title: 'Playwright', html: 'A test runner and library (TypeScript/JavaScript, plus Python, Java and .NET bindings) that controls browsers <b>from outside</b> over a persistent connection. It ships tested browser builds — Chromium plus patched Firefox and WebKit — so one API works across all three engines.' },
        { title: 'Cypress', html: 'Runs your test code <b>inside the browser</b>, in the same run loop as the application, with a Node.js process alongside for tasks such as files and network control. That gives a superb interactive runner, but also limits: one tab, JavaScript/TypeScript only.' },
        { title: 'Selenium WebDriver', html: 'Sends commands through the <b>W3C WebDriver</b> standard to a driver for each browser (chromedriver, geckodriver, safaridriver). It is the oldest and most widely supported option; Selenium Manager (4.6+) fetches drivers automatically, and WebDriver BiDi adds event-driven features.' }
      ] },
      { t: 'table', head: ['Aspect', 'Playwright', 'Cypress', 'Selenium WebDriver'], rows: [
        ['Languages', 'TypeScript/JavaScript, Python, Java, .NET', 'JavaScript/TypeScript only', 'Java, Python, C#, JavaScript, Ruby (more via community)'],
        ['Browsers', 'Chromium (Chrome, Edge), Firefox, WebKit', 'Chrome-family, Edge, Electron, Firefox (WebKit experimental)', 'Chrome, Edge, Firefox and real Safari via safaridriver'],
        ['Waiting', 'Auto-waits before actions; web-first assertions retry', 'Retries queries and <code>.should()</code> assertions (4 s default)', 'No auto-wait; add explicit <code>WebDriverWait</code> conditions'],
        ['Parallelism', 'Built in and free: workers plus <code>--shard</code>', 'Spec-level, via Cypress Cloud or your own CI splitting', 'Through the runner (TestNG, JUnit, pytest-xdist) and Selenium Grid'],
        ['iframes / multi-tab', 'First-class: <code>frameLocator</code>, several pages and contexts', 'iframes need workarounds; no second tab; <code>cy.origin()</code> for other domains', 'Supported: <code>switchTo().frame()</code> and <code>switchTo().window()</code>'],
        ['Ecosystem', 'Trace viewer, codegen and API testing built in; growing fast', 'Polished runner with time-travel; large plugin ecosystem', 'Largest community; Grid and cloud vendors; Appium shares the protocol']
      ] },
      { t: 'h', text: 'The same login test in three tools' },
      { t: 'code', lang: 'ts', title: 'Playwright (TypeScript)', code: `test('user can sign in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('asha@peopleops.test');
  await page.getByLabel('Password').fill('Secret123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});` },
      { t: 'code', lang: 'js', title: 'Cypress (JavaScript)', code: `describe('Login', () => {
  it('user can sign in', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('asha@peopleops.test');
    cy.get('[data-testid="password"]').type('Secret123!');
    cy.contains('button', 'Sign in').click();
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('have.text', 'Dashboard');
  });
});` },
      { t: 'code', lang: 'python', title: 'Selenium WebDriver (Python)', code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()  # Selenium Manager resolves the driver
try:
    wait = WebDriverWait(driver, 10)  # explicit wait: poll up to 10 s
    driver.get("http://localhost:3000/login")
    wait.until(EC.element_to_be_clickable((By.ID, "email"))).send_keys("asha@peopleops.test")
    driver.find_element(By.ID, "password").send_keys("Secret123!")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    wait.until(EC.url_contains("/dashboard"))
    heading = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "h1")))
    assert heading.text == "Dashboard"
finally:
    driver.quit()` },
      { t: 'p', html: 'Notice the waiting model. Playwright waits inside every action and assertion. Cypress queues commands and retries queries and <code>.should()</code> until they pass; commands are not promises, so you do not <code>await</code> them. Selenium does exactly what you say, immediately — you add an explicit wait for each condition that matters. Selenium’s own documentation warns against mixing implicit and explicit waits, because the combination produces unpredictable wait times.' },
      { t: 'h', text: 'Choosing by team context' },
      { t: 'table', head: ['Situation', 'Likely fit', 'Why'], rows: [
        ['New web project, TypeScript team, Chrome, Firefox and Safari users', 'Playwright', 'Three engines, built-in parallelism, traces and API testing at no extra cost'],
        ['Front-end developers who also write component tests and love an interactive runner', 'Cypress', 'Excellent developer experience; tests live close to the front-end code'],
        ['Java or C# organisation with a stable Selenium framework and Grid', 'Selenium — keep and improve', 'Rewriting working coverage is expensive; skills and infrastructure already exist'],
        ['Must test real Safari on macOS, or share code with Appium mobile tests', 'Selenium (with Appium)', 'safaridriver drives real Safari; Appium speaks the same WebDriver protocol'],
        ['Flows with pop-up windows, several tabs or cross-domain payment pages', 'Playwright or Selenium', 'Cypress cannot drive a second tab; cross-origin steps need <code>cy.origin()</code>']
      ] },
      { t: 'callout', tone: 'key', title: 'Skills transfer between tools', html: 'Good locators, waiting for meaningful state, independent test data, page objects and readable reports matter in every framework. An engineer who understands those can switch tools in weeks. Decide with the team: language skills, existing code, the browsers your users actually have, CI budget and who will maintain the suite.' },
      { t: 'callout', tone: 'tip', title: 'In interviews, avoid tool wars', html: 'Say what you used, what it did well and one real limitation you worked around. “We chose Playwright for WebKit coverage and built-in sharding; our earlier Cypress suite struggled with a payment pop-up” sounds far stronger than “Selenium is outdated”.' }
    ],
    example: {
      title: 'Worked example: choosing a framework for PayLite',
      blocks: [
        { t: 'p', html: '<b>Context:</b> PayLite, a digital wallet, has a React web app, six TypeScript developers and two QA engineers. Analytics show 35% of web users on Safari (iOS and macOS). Card top-ups open the bank’s verification page in a <b>pop-up window</b>. There is no UI automation yet.' },
        { t: 'table', head: ['Need', 'Playwright', 'Cypress', 'Selenium'], rows: [
          ['TypeScript, shared with developers', 'Yes', 'Yes', 'Possible (JavaScript bindings), less common'],
          ['Safari coverage', 'WebKit engine', 'WebKit is experimental', 'Real Safari on macOS'],
          ['Bank pop-up window', "Yes — <code>page.waitForEvent('popup')</code>", 'No second tab', 'Yes — window handles'],
          ['Parallel CI runs at no extra cost', 'Workers and sharding', 'Cypress Cloud or custom splitting', 'Yes, with a Grid to run']
        ] },
        { t: 'p', html: '<b>Recommendation:</b> Playwright for the regression suite — it handles the pop-up and WebKit with little setup and fits the team’s language. Because WebKit is close to, but not identical with, Safari, the team adds a short check on real iPhones and a Mac before each release. The decision and its trade-offs are written down so they can be revisited.' }
      ]
    },
    explain: {
      'ur': 'Playwright، Cypress اور Selenium تینوں browser کو automate کرتے ہیں، لیکن ان کا طریقہ مختلف ہے۔ <b>Playwright</b> باہر سے browser کو control کرتا ہے، خود انتظار (auto-wait) کرتا ہے، Chromium، Firefox اور WebKit تینوں چلاتا ہے، اور parallel runs مفت دیتا ہے۔ <b>Cypress</b> browser کے اندر چلتا ہے اور اس میں debugging بہت آسان ہے، مگر یہ صرف JavaScript/TypeScript میں ہے اور دوسرا tab نہیں چلا سکتا۔ <b>Selenium</b> سب سے پرانا ہے، W3C WebDriver standard پر چلتا ہے اور Java، Python، C# جیسی کئی زبانیں support کرتا ہے، لیکن اس میں WebDriverWait جیسے explicit waits خود لکھنے پڑتے ہیں۔ مثال: اگر team Java میں کام کرتی ہے اور Selenium framework اچھا چل رہا ہے تو اسے بہتر بنانا اکثر نئے tool پر جانے سے بہتر ہے۔ Tool کا انتخاب team کی زبان، ضروری browsers اور موجودہ کام دیکھ کر کریں۔',
      'ur-Latn': 'Playwright, Cypress aur Selenium teeno browser ko automate karte hain, lekin in ka tareeqa mukhtalif hai. <b>Playwright</b> bahar se browser ko control karta hai, khud intezar (auto-wait) karta hai, Chromium, Firefox aur WebKit teeno chalata hai, aur parallel runs free deta hai. <b>Cypress</b> browser ke andar chalta hai aur is mein debugging bohat aasaan hai, magar yeh sirf JavaScript/TypeScript mein hai aur doosra tab nahin chala sakta. <b>Selenium</b> sab se purana hai, W3C WebDriver standard par chalta hai aur Java, Python, C# jaisi kai languages support karta hai, lekin is mein WebDriverWait jaise explicit waits khud likhne parte hain. Misaal: agar team Java mein kaam karti hai aur Selenium framework acha chal raha hai to usay behtar banana aksar naye tool par jaane se behtar hai. Tool ka intikhab team ki language, zaroori browsers aur maujooda kaam dekh kar karein.',
      'hi': 'Playwright, Cypress और Selenium तीनों browser को automate करते हैं, लेकिन इनका तरीक़ा अलग है। <b>Playwright</b> बाहर से browser को control करता है, ख़ुद इंतज़ार (auto-wait) करता है, Chromium, Firefox और WebKit तीनों चलाता है, और parallel runs मुफ़्त देता है। <b>Cypress</b> browser के अंदर चलता है और इसमें debugging बहुत आसान है, मगर यह सिर्फ़ JavaScript/TypeScript में है और दूसरा tab नहीं चला सकता। <b>Selenium</b> सबसे पुराना है, W3C WebDriver standard पर चलता है और Java, Python, C# जैसी कई भाषाएँ support करता है, लेकिन इसमें WebDriverWait जैसे explicit waits ख़ुद लिखने पड़ते हैं। उदाहरण: अगर team Java में काम करती है और Selenium framework अच्छा चल रहा है, तो उसे बेहतर बनाना अक्सर नए tool पर जाने से बेहतर है। Tool का चुनाव team की भाषा, ज़रूरी browsers और मौजूदा काम देखकर करें।',
      'ar': 'تقوم أدوات Playwright وCypress وSelenium جميعها بأتمتة المتصفح، لكن بطرق مختلفة. <b>Playwright</b> يتحكم في المتصفح من الخارج، وينتظر تلقائيًا (auto-wait)، ويشغّل Chromium وFirefox وWebKit، ويوفّر التشغيل المتوازي مجانًا. <b>Cypress</b> يعمل داخل المتصفح نفسه وتصحيح الأخطاء فيه سهل جدًا، لكنه يدعم JavaScript/TypeScript فقط ولا يستطيع التحكم في تبويب ثانٍ. <b>Selenium</b> هو الأقدم، ويعتمد على معيار W3C WebDriver، ويدعم لغات كثيرة مثل Java وPython وC#، لكن عليك كتابة انتظارات صريحة مثل WebDriverWait بنفسك. مثال: إذا كان الفريق يعمل بلغة Java ولديه إطار Selenium يعمل جيدًا، فتحسينه غالبًا أفضل من الانتقال إلى أداة جديدة. اختر الأداة بحسب لغة الفريق والمتصفحات المطلوبة والعمل الموجود مسبقًا.',
      'es': 'Playwright, Cypress y Selenium automatizan el navegador, pero de formas distintas. <b>Playwright</b> controla el navegador desde fuera, espera automáticamente (auto-wait), ejecuta Chromium, Firefox y WebKit, y ofrece paralelismo gratuito. <b>Cypress</b> corre dentro del navegador y depurar con él es muy cómodo, pero solo admite JavaScript/TypeScript y no puede controlar una segunda pestaña. <b>Selenium</b> es el más veterano, se basa en el estándar W3C WebDriver y admite muchos lenguajes como Java, Python y C#, aunque las esperas explícitas, como WebDriverWait, las escribes tú. Ejemplo: si el equipo trabaja en Java y ya tiene un framework de Selenium que funciona bien, mejorarlo suele ser más sensato que migrar. Elige la herramienta según el lenguaje del equipo, los navegadores que importan y lo que ya existe.'
    },
    keyTerms: [
      { term: 'W3C WebDriver', def: 'A browser-automation standard. Selenium sends commands through it to a driver such as chromedriver, geckodriver or safaridriver.' },
      { term: 'Selenium Manager', def: 'Bundled with Selenium 4.6 and later; it finds or downloads the matching browser driver automatically.' },
      { term: 'Explicit wait', def: 'In Selenium, WebDriverWait polls for a specific condition, such as visibility, up to a timeout before continuing.' },
      { term: 'Command queue (Cypress)', def: 'Cypress commands are queued and run in order with built-in retries; they are not promises and are not awaited.' },
      { term: 'WebKit', def: 'The browser engine behind Safari. Playwright tests WebKit builds, which are close to — but not identical with — Safari.' }
    ],
    practice: [
      { q: 'A team’s checkout opens the bank’s payment page in a <b>new tab</b>. Which of the three frameworks would struggle, and why?', answer: "<b>Cypress</b> — it runs inside a single tab and cannot control a second one. Workarounds such as removing <code>target=\"_blank\"</code> or stubbing the bank page test less than the real flow. Playwright handles it with <code>page.waitForEvent('popup')</code> (or <code>context.waitForEvent('page')</code>), and Selenium with window handles and <code>switchTo().window()</code>." },
      { q: 'This Selenium (Java) line sometimes throws <code>NoSuchElementException</code>: <code>driver.findElement(By.id("total")).getText()</code>. Rewrite it so it waits properly.', answer: '<code>WebElement total = new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOfElementLocated(By.id("total")));</code><br>then read <code>total.getText()</code>. The explicit wait polls until the element is visible or 10 seconds pass. Do not add <code>Thread.sleep</code>, and do not combine this with a large implicit wait.' },
      { q: 'Your manager asks: “Should we rewrite our 600 stable Selenium Java tests in Playwright?” What would you ask before answering?', answer: 'What problem are we solving — flakiness, speed, missing browsers, hiring? How flaky and slow is the current suite, and why? What languages does the team know? How long would a rewrite take compared with fixing waits, data and the Grid? A sensible path is often to fix the existing suite’s biggest pain points and pilot Playwright on <b>new</b> features, comparing results before any large migration.' }
    ],
    quiz: [
      { q: 'Which framework runs its test code inside the browser, alongside the application under test?', options: ['Playwright', 'Cypress', 'Selenium WebDriver', 'Appium'], correct: 1,
        why: ['Playwright controls the browser from a separate process over a protocol connection.', 'Right — Cypress executes in the browser’s run loop, which enables time-travel debugging but limits multi-tab work.', 'Selenium sends W3C WebDriver commands to a separate driver process.', 'Appium automates mobile apps through the WebDriver protocol; it does not run inside the browser.'] },
      { q: 'A Selenium test sometimes fails with NoSuchElementException right after clicking Search. What is the most appropriate fix?', options: ['Add Thread.sleep(5000) after the click', 'Set a large implicit wait and also add explicit waits', 'Switch the locator to a full absolute XPath', 'Use WebDriverWait until the expected result is visible'], correct: 3,
        why: ['A fixed sleep is a guess: slow on fast runs and still too short on slow ones.', 'Selenium’s documentation warns against mixing implicit and explicit waits — wait times become unpredictable.', 'A longer, more brittle locator does not solve a timing problem.', 'Right — an explicit wait polls for the exact condition the test needs.'] },
      { q: 'Which statement about Cypress is accurate?', options: ['It is JavaScript/TypeScript only and cannot control a second tab', 'It needs a separate driver binary, such as chromedriver, per browser', 'Its commands return promises that you must await one at a time', 'It cannot run in CI pipelines without a paid subscription'], correct: 0,
        why: ['Right — Cypress is JS/TS only and works inside one tab; cy.origin helps with other domains, not extra tabs.', 'That describes Selenium; Cypress launches and controls supported browsers itself.', 'Cypress commands are queued and chained, not awaited like promises.', 'Cypress runs free in any CI; Cypress Cloud is an optional paid service for orchestration and dashboards.'] },
      { q: 'A Java organisation has 600 stable Selenium tests running on a Grid. A new manager wants “the modern tool”. What is the most sensible first step?', options: ['Rewrite all 600 tests in Playwright straight away', 'Freeze the Selenium suite and stop maintaining it', 'Find the current pain points, then pilot before migrating', 'Move everything to Cypress because more teams use it nowadays'], correct: 2,
        why: ['A big-bang rewrite is costly and risky, and it throws away working coverage.', 'An unmaintained suite rots quickly and loses its value.', 'Right — fix what hurts, pilot a new tool on new work, then decide from evidence.', 'Popularity is not a requirement, and Cypress would also force a switch from Java to JavaScript.'] },
      { q: 'Your product must be tested on Chromium, Firefox and WebKit, and its payment flow opens a pop-up window. Which framework fits most naturally?', options: ['Cypress, because its interactive runner shows every step', 'Selenium IDE, because recording is the quickest way to start', 'Any of them, provided that all locators are written in XPath', 'Playwright: three engines and pop-ups are built in'], correct: 3,
        why: ['The runner is excellent, but Cypress cannot control a second window and its WebKit support is experimental.', 'Record-and-playback tools produce brittle scripts and do not address the browser or pop-up needs.', 'Locator syntax has nothing to do with browser engines or pop-up support.', "Right — Playwright drives Chromium, Firefox and WebKit and handles pop-ups with <code>waitForEvent('popup')</code>."] }
    ],
    interview: [
      { q: 'How would you compare Playwright, Cypress and Selenium?', a: 'I compare them by architecture and fit. <b>Playwright</b> controls Chromium, Firefox and WebKit from outside the browser, auto-waits, supports several languages, multiple tabs and iframes, and includes parallelism, tracing and API testing. <b>Cypress</b> runs inside the browser, which gives a superb interactive runner, but it is JavaScript/TypeScript only and cannot drive a second tab. <b>Selenium</b> uses the W3C WebDriver standard, supports the most languages and real Safari, and has a huge ecosystem, but I add explicit waits myself. I choose based on team skills, required browsers, existing code and CI budget rather than popularity.' },
      { q: 'Your team uses Selenium and the tests are flaky. Is switching to Playwright the fix?', a: 'Not automatically. I would first find out <i>why</i> they are flaky: fixed sleeps, missing explicit waits, shared test data, brittle locators or an unstable environment. Most of those causes would follow us into any tool. Playwright’s auto-waiting and trace viewer would help with timing and diagnosis, so a pilot on new features may be worthwhile. But fixing waits and data in the existing suite often gives a quicker win than a rewrite, and a migration should be justified by measured pain, not by a tool’s reputation.' }
    ],
    takeaways: [
      'Playwright: out-of-process, auto-waiting, Chromium/Firefox/WebKit, built-in parallelism and tracing.',
      'Cypress: runs in the browser, JavaScript/TypeScript only, great debugging, no second tab.',
      'Selenium: W3C WebDriver, many languages, real Safari, explicit waits — never mixed with implicit ones.',
      'Choose by team skills, browsers, existing investment and maintenance — not hype.',
      'Locators, waits, data isolation and page objects transfer between all three tools.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions'], interview: ['p2'] }
  },

  /* ───────────────────────── 6 · Page Object Model ───────────────────────── */
  {
    id: 'au-pom',
    n: 6,
    level: 'advanced',
    title: 'Page Object Model and framework design',
    summary: 'Design maintainable test code with page objects, component objects and clear folder, config and environment structure — without over-engineering.',
    minutes: 22,
    objectives: [
      'Explain the maintenance problem the Page Object Model solves',
      'Write a TypeScript page object with readonly locators and intention-revealing methods',
      'Decide where assertions belong and provide page objects through fixtures',
      'Organise folders, config and environments while avoiding over-abstraction'
    ],
    body: [
      { t: 'p', html: "Imagine 40 tests that each contain <code>page.getByLabel('Email')</code>, <code>page.getByLabel('Password')</code> and a click on <b>Sign in</b>. When the label changes to “Work email”, you edit 40 files. The <b>Page Object Model (POM)</b> fixes this by putting knowledge of <i>how</i> a page works into one class, so tests describe <i>what</i> the user does. One UI change then means one edit, and tests read like short user stories instead of lists of selectors." },
      { t: 'compare',
        a: { title: 'Without page objects', items: ['Locators copied into every test', 'Tests read like a list of clicks and selectors', 'A renamed button breaks dozens of files', 'Reviewers struggle to see the intent'] },
        b: { title: 'With page objects', items: ['Each locator defined once, in the page class', 'Tests read like user stories: <code>login.signIn(email, password)</code>', 'A UI change is fixed in one place', 'New tests are quicker to write and review'] } },
      { t: 'h', text: 'A clean TypeScript page object' },
      { t: 'code', lang: 'ts', title: 'pages/login-page.ts', code: `import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async signIn(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }
}` },
      { t: 'code', lang: 'ts', title: 'tests/login.spec.ts', code: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test('wrong password shows an error and stays on login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.signIn('asha@peopleops.test', 'wrong-password');

  await expect(login.errorAlert).toHaveText('Email or password is incorrect');
  await expect(page).toHaveURL(/login/);
});` },
      { t: 'p', html: 'Design rules: locators are <b>readonly properties</b> built in the constructor — creating a locator does not touch the page, so this is cheap and safe even before navigation. Methods are named after <b>user intentions</b> (<code>signIn</code>, <code>addToCart</code>, <code>searchFor</code>), not mechanics (<code>clickButton3</code>). Keep test data and secrets out of page objects; tests pass them in. When an action navigates to another page, a method may return the next page object.' },
      { t: 'h', text: 'Assertions: in tests or in page objects?' },
      { t: 'p', html: 'A common guideline — and the one this course follows — is to keep <b>assertions in tests</b>. Page objects expose locators and actions; tests decide what “correct” means. That keeps a page object reusable for positive and negative cases, and a reader sees every check in the test itself. Some teams add small helpers such as <code>expectLoaded()</code> for a “page is ready” check that every test repeats. Either works if the team agrees and stays consistent; what hurts is hiding a test’s main verification inside a method called <code>submit()</code>.' },
      { t: 'h', text: 'Folder structure, config and environments' },
      { t: 'code', lang: 'text', title: 'A typical layout', code: `e2e/
├─ playwright.config.ts    # projects, baseURL, reporters, retries
├─ fixtures/
│  └─ index.ts             # test.extend: page objects, data, auth
├─ pages/
│  ├─ login-page.ts
│  └─ checkout-page.ts
├─ components/
│  ├─ header.ts            # search, cart badge, user menu
│  └─ data-table.ts
├─ tests/
│  ├─ auth.setup.ts
│  ├─ checkout/            # specs grouped by feature
│  └─ employees/
└─ test-data/              # builders and static reference data` },
      { t: 'p', html: "Keep environment-specific values out of the code. Read them from environment variables in <code>playwright.config.ts</code> — for example <code>baseURL: process.env.BASE_URL ?? 'http://localhost:3000'</code> — optionally load a local, git-ignored <code>.env</code> file with a package such as dotenv, and inject secrets from the CI secret store. The same suite can then run against local, staging and pre-production by changing variables only." },
      { t: 'cards', items: [
        { title: 'Page object', html: 'One per page or major screen — <code>LoginPage</code>, <code>CheckoutPage</code>. Owns page-level locators and journeys.' },
        { title: 'Component object', html: 'A widget that appears on many pages — header, data table, date picker, modal — built from a <b>root locator</b> so it works wherever it appears.' },
        { title: 'Fixture', html: 'Creates page objects for tests: <code>loginPage: async ({ page }, use) =&gt; use(new LoginPage(page))</code>, so a test simply asks for <code>loginPage</code>.' },
        { title: 'Data builder', html: "Produces valid test data with sensible defaults and unique values, e.g. <code>buildEmployee({ department: 'Finance' })</code>." }
      ] },
      { t: 'p', html: 'Treat test code like production code. It goes through code review, a linter (the Playwright ESLint plugin catches a missing <code>await</code> on an assertion), TypeScript type checks and consistent naming. A reviewer should be able to read a spec without opening the page objects and still understand what is being verified — if not, the abstraction is hiding too much.' },
      { t: 'callout', tone: 'warn', title: 'Avoid over-abstraction', html: 'Warning signs: a <code>BasePage</code> with 50 generic helpers; wrappers such as <code>clickElement(selector)</code> that only call <code>locator.click()</code> and hide Playwright’s readable API; deep inheritance chains; page objects for screens used by a single test. Abstract when duplication actually appears (a common rule of thumb: the third time), keep classes small, and prefer composition — a page <i>has</i> a header component — over inheritance.' }
    ],
    example: {
      title: 'Worked example: a reusable data-table component in PeopleOps',
      blocks: [
        { t: 'p', html: 'The employee list, leave requests and payroll screens all use the same table panel with a search box and row actions. Instead of repeating locators in three page objects, the team writes one component object scoped to a root locator.' },
        { t: 'code', lang: 'ts', title: 'components/data-table.ts', code: `import { type Locator } from '@playwright/test';

export class DataTable {
  readonly search: Locator;
  readonly rows: Locator;

  constructor(private readonly root: Locator) {
    this.search = root.getByRole('searchbox');
    this.rows = root.getByRole('row');
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async openRowAction(rowText: string, action: 'Edit' | 'Delete') {
    await this.row(rowText).getByRole('button', { name: action }).click();
  }
}
// In EmployeesPage:
// this.table = new DataTable(page.getByRole('region', { name: 'Employees' }));` },
        { t: 'code', lang: 'ts', title: 'A test using page-object and data fixtures', code: `test('HR can open an employee for editing', async ({ page, employeesPage, employee }) => {
  await employeesPage.goto();
  await employeesPage.table.search.fill(employee.name);
  await expect(employeesPage.table.row(employee.name)).toHaveCount(1);
  await employeesPage.table.openRowAction(employee.name, 'Edit');
  await expect(page.getByRole('heading', { name: \`Edit \${employee.name}\` })).toBeVisible();
});` },
        { t: 'p', html: 'Locators are scoped to the root, so the same class works on all three screens and never accidentally matches a row in another table on the page. The test still owns its assertions, and fixtures (<code>employeesPage</code>, <code>employee</code>) keep setup out of the test body.' }
      ]
    },
    explain: {
      'ur': '<b>Page Object Model (POM)</b> کا مطلب ہے کہ ہر page کے لیے ایک class بنائیں جس میں اس page کے locators اور actions ایک ہی جگہ ہوں۔ مثال: LoginPage میں email، password اور Sign in button کے locators ہوں، اور ایک method signIn(email, password) ہو۔ اب 40 tests صرف login.signIn(...) لکھتے ہیں۔ اگر کل button کا نام بدل جائے تو صرف ایک فائل بدلنی پڑے گی، 40 نہیں۔ Methods کے نام user کے ارادے پر رکھیں (addToCart)، click کی تفصیل پر نہیں۔ عام طور پر assertions یعنی expect والی checks test میں ہی رکھیں تاکہ پڑھنے والا دیکھ سکے کہ کیا verify ہو رہا ہے۔ اور حد سے زیادہ abstraction سے بچیں: ہر چھوٹی چیز کے لیے wrapper یا بہت بڑی BasePage بنانا code کو آسان نہیں، مشکل بناتا ہے۔',
      'ur-Latn': '<b>Page Object Model (POM)</b> ka matlab hai ke har page ke liye ek class banayein jis mein us page ke locators aur actions ek hi jagah hon. Misaal: LoginPage mein email, password aur Sign in button ke locators hon, aur ek method signIn(email, password) ho. Ab 40 tests sirf login.signIn(...) likhte hain. Agar kal button ka naam badal jaaye to sirf ek file badalni paregi, 40 nahin. Methods ke naam user ke iraaday par rakhein (addToCart), click ki tafseel par nahin. Aam taur par assertions yaani expect wali checks test mein hi rakhein taake parhne wala dekh sake ke kya verify ho raha hai. Aur hadd se zyada abstraction se bachein: har choti cheez ke liye wrapper ya bohat bari BasePage banana code ko aasaan nahin, mushkil banata hai.',
      'hi': '<b>Page Object Model (POM)</b> का मतलब है कि हर page के लिए एक class बनाएँ, जिसमें उस page के locators और actions एक ही जगह हों। उदाहरण: LoginPage में email, password और Sign in button के locators हों, और एक method signIn(email, password) हो। अब 40 tests सिर्फ़ login.signIn(...) लिखते हैं। अगर कल button का नाम बदल जाए, तो सिर्फ़ एक file बदलनी पड़ेगी, 40 नहीं। Methods के नाम user के इरादे पर रखें (addToCart), click की बारीकी पर नहीं। आम तौर पर assertions यानी expect वाली checks test में ही रखें, ताकि पढ़ने वाला देख सके कि क्या verify हो रहा है। और ज़रूरत से ज़्यादा abstraction से बचें: हर छोटी चीज़ के लिए wrapper या बहुत बड़ी BasePage बनाना code को आसान नहीं, मुश्किल बनाता है।',
      'ar': '<b>نموذج كائن الصفحة (Page Object Model)</b> يعني أن تنشئ لكل صفحة class واحدة تجمع locators تلك الصفحة وإجراءاتها في مكان واحد. مثال: تحتوي LoginPage على locators لحقلي البريد وكلمة المرور وزر Sign in، وعلى method اسمها signIn(email, password). الآن تكتب 40 اختبارًا login.signIn(...) فقط، وإذا تغيّر اسم الزر غدًا فستعدّل ملفًا واحدًا لا 40 ملفًا. سمِّ الـ methods بحسب نية المستخدم مثل addToCart، لا بحسب تفاصيل النقر. وعادةً تبقى الـ assertions، أي فحوصات expect، داخل الاختبار نفسه حتى يرى القارئ ما الذي يتم التحقق منه. وتجنّب التجريد المفرط: إنشاء wrapper لكل شيء صغير أو BasePage ضخمة يجعل الكود أصعب لا أسهل.',
      'es': 'El <b>Page Object Model (POM)</b> consiste en crear una clase por página que reúna en un solo lugar sus locators y acciones. Ejemplo: LoginPage contiene los locators del email, la contraseña y el botón Sign in, y un método signIn(email, password). Así, 40 tests solo escriben login.signIn(...). Si mañana cambia el nombre del botón, editas un archivo, no 40. Nombra los métodos según la intención del usuario (addToCart), no según los clics. Normalmente las aserciones, es decir, los expect, se quedan en el test, para que quien lo lea vea qué se verifica. Y evita la sobreabstracción: un wrapper para cada pequeña acción o una BasePage gigante hacen el código más difícil, no más fácil.'
    },
    keyTerms: [
      { term: 'Page Object Model', def: 'A design pattern where one class per page holds its locators and user actions, so tests describe intent and UI changes are fixed once.' },
      { term: 'Component object', def: 'A reusable class for a widget that appears on many pages, such as a header or data table, scoped to a root locator.' },
      { term: 'Intention-revealing method', def: 'A method named after what the user achieves, such as signIn or addToCart, rather than the clicks involved.' },
      { term: 'Over-abstraction', def: 'Layers of wrappers, base classes and helpers that add indirection without removing real duplication.' },
      { term: 'baseURL', def: 'A config value that relative paths in page.goto and request calls resolve against; usually read from an environment variable.' }
    ],
    practice: [
      { q: "Review this page object method and suggest improvements: <code>async clickBtn2() { await this.page.locator('div.actions button:nth-child(2)').click(); await expect(this.page.getByText('Order placed')).toBeVisible(); }</code>", answer: "Three problems. The name says nothing about intent — <code>placeOrder()</code> would. The locator is positional CSS — use <code>getByRole('button', { name: 'Place order' })</code>, ideally as a readonly property. And the main verification is hidden inside an action, so a “payment declined” test cannot reuse it. Move the check into the test: <code>await checkout.placeOrder();</code> then <code>await expect(checkout.confirmation).toHaveText('Order placed')</code>." },
      { q: 'Write a fixture that gives every test that asks for it a ready-made <code>loginPage</code>.', hint: 'test.extend with a fixture that calls use(new LoginPage(page)).', answer: '<code>export const test = base.extend&lt;{ loginPage: LoginPage }&gt;({</code><br><code>loginPage: async ({ page }, use) =&gt; { await use(new LoginPage(page)); },</code><br><code>});</code><br>Tests then declare <code>async ({ loginPage }) =&gt; { … }</code>. Only tests that request it create it, and the wiring lives in one place.' },
      { q: 'A teammate proposes a <code>BasePage</code> that every page must extend, with methods like <code>clickElement(selector)</code>, <code>typeText(selector, text)</code> and <code>waitForSeconds(n)</code>. What feedback would you give?', answer: 'These wrappers add a layer without adding meaning. <code>clickElement(selector)</code> is worse than <code>locator.click()</code>: it pushes tests back to raw selectors and hides the locator API (getByRole, filter, strictness). <code>waitForSeconds</code> invites hard sleeps. Keep shared pieces that genuinely repeat — a <code>Header</code> or <code>DataTable</code> component — compose them into pages, and let pages expose locators and intention-revealing methods.' }
    ],
    quiz: [
      { q: 'What is the main benefit of the Page Object Model?', options: ['Tests run faster, because page objects cache the DOM between steps', 'It removes the need to write assertions inside tests', 'UI details live in one place, so a change is fixed once', 'It lets UI tests run without launching any browser'], correct: 2,
        why: ['Page objects are code organisation; locators are still resolved fresh on every action.', 'Tests still need assertions; POM changes where locators and actions live.', 'Right — locators and actions are defined once, and tests describe user intent.', 'Page objects drive a real browser through the page fixture like any other test.'] },
      { q: 'Which page object method name best follows the intention-revealing guideline?', options: ['addToCart(product)', 'clickButton3()', 'fillInput(selector, value)', 'doStep2()'], correct: 0,
        why: ['Right — it says what the user achieves; the clicks are an implementation detail.', 'Names a mechanic and a position; it loses meaning when the layout changes.', 'A generic wrapper that pushes raw selectors back into the tests.', 'Says nothing about what happens or why.'] },
      { q: 'Why is it safe to create locators in a page object’s constructor before the page has loaded?', options: ['The constructor automatically waits for the page to load first', 'Locators are lazy and resolve only when used', 'Playwright caches every element the first time it is accessed', 'The constructor only runs after the page has fired its load event'], correct: 1,
        why: ['A constructor cannot be async, so it does not wait for anything.', 'Right — a locator is a recipe that is resolved fresh each time an action or assertion uses it.', 'Locators are re-resolved on each use, which is why they survive re-renders.', 'A constructor runs when you call new; it has no link to page events.'] },
      { q: 'A suite has a BasePage with 60 generic helpers such as clickElement(selector) and waitForSeconds(n). What is the main problem?', options: ['It has too few helpers to cover every page in the application', 'Playwright does not support class inheritance in test files', 'Generic helper methods force every test to run in serial mode', 'It adds indirection, hides locators and invites hard sleeps'], correct: 3,
        why: ['More helpers would make it worse, not better.', 'TypeScript classes and inheritance work fine; the issue is design, not support.', 'Helpers have no effect on whether tests run in parallel.', 'Right — wrappers without meaning add a layer to learn and debug, and waitForSeconds encourages flaky sleeps.'] },
      { q: 'A team runs the same suite against local, staging and pre-production. Where should the active base URL come from?', options: ['Hard-coded inside each page object’s own goto() method', 'An environment variable read into baseURL in the config', 'A constant declared at the top of every single spec file', 'A comment telling testers which line to edit before a run'], correct: 1,
        why: ['Every environment switch would mean editing many files.', 'Right — one config value, set per environment and in CI, while page objects use relative paths.', 'Duplicated values drift apart and are easy to forget.', 'Manual edits are error-prone and impossible in CI.'] }
    ],
    interview: [
      { q: 'How do you structure a Playwright framework so it stays maintainable?', a: 'I group specs by feature and keep a <b>page object</b> per major screen, with locators as readonly properties and intention-revealing methods. Reusable widgets such as headers and data tables become <b>component objects</b> scoped to a root locator. Page objects, test data and authentication are provided through <b>fixtures</b> built with <code>test.extend</code>, so tests stay short. Environment values such as <code>baseURL</code> come from environment variables in <code>playwright.config.ts</code>, and secrets from the CI secret store. I keep assertions in tests, avoid generic wrapper layers, and refactor only when real duplication appears.' },
      { q: 'Should assertions live in page objects or in tests?', a: 'My default is <b>in tests</b>. Page objects describe how to interact with a page; tests decide what correct behaviour is. That keeps one page object usable for both positive and negative scenarios, and reviewers can see every check in the test. I accept small helpers like <code>expectLoaded()</code> for a “page is ready” condition that many tests repeat, as long as the team agrees on the convention. What I avoid is an action such as <code>submit()</code> that silently asserts success, because then a test for a failed submission cannot reuse it.' }
    ],
    takeaways: [
      'Page objects hold locators and actions once; tests read like user intent.',
      'Locators as readonly properties; methods named for goals such as <code>signIn</code> or <code>addToCart</code>.',
      'Default to assertions in tests, and agree a team convention for small helpers.',
      'Use component objects for shared widgets and fixtures to hand page objects to tests.',
      'Config and secrets come from the environment; abstract only real duplication.'
    ],
    links: { labs: ['login', 'ui'], challenges: ['peopleops-login'], interview: ['p4'] }
  },

  /* ───────────────────────── 7 · Flaky tests ───────────────────────── */
  {
    id: 'au-flaky',
    n: 7,
    level: 'advanced',
    title: 'Flaky tests: causes, diagnosis and fixes',
    summary: 'Recognise, diagnose and fix flaky tests with repeat runs and traces, and manage them with a clear retry and quarantine policy.',
    minutes: 22,
    objectives: [
      'Define a flaky test and explain why it damages trust in the whole suite',
      'Match common causes of flakiness to their symptoms and fixes',
      'Diagnose failures with repeat runs, traces, screenshots and video',
      'Treat retries and quarantine as tracked signals, not as cures'
    ],
    body: [
      { t: 'p', html: 'A <b>flaky test</b> passes and fails on the <i>same</i> code and environment without any change. One flaky test looks harmless, but flakiness compounds: if 50 tests each fail randomly 1% of the time, a whole run is red about 40% of the time (1 − 0.99^50 ≈ 0.39). Soon people re-run red builds without reading them — and on the day a real regression appears, nobody believes the failure.' },
      { t: 'table', head: ['Cause', 'Typical symptom', 'Fix pattern'], rows: [
        ['Timing and race conditions', 'Fails on slow CI; the error shows an earlier state such as “Saving…”', 'Assert meaningful state with web-first assertions; create <code>waitForResponse</code> before the click'],
        ['Shared state / order dependence', 'Passes alone, fails in the full suite or next to certain tests', 'Independent setup per test; cleanup in fixture teardown'],
        ['Test data collisions', 'Duplicate rows, “email already exists”, wrong counts', 'Unique data per test or per worker'],
        ['Unstable environment', 'Timeouts or 502/503 errors across unrelated tests at the same moment', 'Health check before the run; a dedicated test environment; raise infrastructure issues'],
        ['Animations and transitions', 'Clicks land on moving elements; screenshots differ slightly', 'Let actionability checks work; reduce motion in test builds; stable screenshot settings'],
        ['Third-party calls', 'Payment, maps or email provider is slow or rate-limited', 'Mock with <code>page.route</code> in most UI tests; keep a few sandbox or contract checks'],
        ['Dates, time zones, randomness', 'Fails around midnight, month end or in another time zone', 'Control the clock with <code>page.clock</code>, set <code>timezoneId</code>, fix random seeds']
      ] },
      { t: 'h', text: 'Diagnose before you fix' },
      { t: 'flow', caption: 'A disciplined flaky-test investigation', steps: ['Reproduce with repeats', 'Collect trace, video, screenshot', 'Compare pass vs fail', 'Name the root cause', 'Fix, then re-verify in parallel'] },
      { t: 'code', lang: 'bash', title: 'Reproduce and inspect', code: `# Run one spec 30 times across 4 workers to expose intermittent failures
npx playwright test tests/cart.spec.ts --repeat-each=30 --workers=4

# Record a full trace for every test in this run
npx playwright test tests/cart.spec.ts --trace on

# Open one trace, or the HTML report (it links each test's trace)
npx playwright show-trace test-results/cart-adds-item-chromium/trace.zip
npx playwright show-report` },
      { t: 'code', lang: 'ts', title: 'playwright.config.ts (excerpt) — evidence when it matters', code: `export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',       // full timeline whenever a test is retried
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});` },
      { t: 'p', html: 'The <b>trace viewer</b> is the most useful tool here. It replays every action on a timeline with DOM snapshots before and after, the locator used, console messages, network requests with status codes and timings, and the test source. Put a passing and a failing trace side by side: the first point where they differ — a slower response, a different row count, an overlay still visible — usually reveals the cause.' },
      { t: 'h', text: 'Retries are a signal, not a cure' },
      { t: 'callout', tone: 'warn', title: 'What retries really tell you', html: 'With <code>retries: 2</code>, a test that fails and then passes is reported as <b>flaky</b>, not as passed. That label is information: something is non-deterministic in the test, the data, the environment — or the product. Treat flaky results as work items. If you only watch for a green tick, retries quietly hide real race conditions that customers will hit too.' },
      { t: 'h', text: 'A quarantine policy' },
      { t: 'list', items: [
        "Quarantine only with a <b>ticket and an owner</b>; tag the test, e.g. <code>test('…', { tag: '@quarantine' }, …)</code>, so it stays visible and searchable.",
        'Exclude it from the gating run with <code>--grep-invert @quarantine</code> — never by silently deleting it.',
        'Keep running quarantined tests in a separate, non-blocking job so you keep collecting evidence.',
        'Set a time limit, such as two weeks: fix it, rewrite it at a lower layer, or delete it with a recorded reason.',
        'Track the count — a growing quarantine list is a quality signal for the team, not a parking lot.'
      ] },
      { t: 'compare',
        a: { title: 'Patch “fixes” (avoid)', items: ['Add <code>waitForTimeout</code>', 'Raise every timeout', 'Add <code>force: true</code> to clicks', 'Increase retries until it turns green', 'Run the whole suite on one worker'] },
        b: { title: 'Root-cause fixes (prefer)', items: ['Assert the meaningful state the user waits for', 'Create unique, independent data per test', 'Mock unstable third parties at the network layer', 'Control clocks, time zones and random seeds', 'Report a genuine race condition in the product as a bug'] } },
      { t: 'callout', tone: 'key', title: 'Sometimes the app is the flaky part', html: 'If the trace shows a double-submitted order, or a button that only works after an animation ends, the product may have a genuine race condition. A failed or flaky test is not automatically a test bug — investigate, and raise a product defect with the trace as evidence when the behaviour would also hurt users.' }
    ],
    example: {
      title: 'Worked example: the “Save address” test that fails in CI',
      blocks: [
        { t: 'p', html: 'ShopFlow’s <code>address.spec.ts</code> is flagged flaky: 4 failures in 50 CI runs, none locally. The failing trace shows the click on <b>Save address</b>, then the check reading the page while the button still says “Saving…”. In passing traces the PUT response arrives in about 300 ms; in failing ones it takes 1.8 s.' },
        { t: 'code', lang: 'ts', title: 'Before — a guessed sleep and a one-off check', code: `await page.getByRole('button', { name: 'Save address' }).click();
await page.waitForTimeout(1000);
expect(await page.getByText('Address saved').isVisible()).toBe(true);` },
        { t: 'code', lang: 'ts', title: 'After — retrying assertions on meaningful state', code: `await page.getByRole('button', { name: 'Save address' }).click();
await expect(page.getByText('Address saved')).toBeVisible();
await expect(page.getByRole('button', { name: 'Save address' })).toBeEnabled();` },
        { t: 'p', html: '<b>Root cause:</b> a one-off visibility check after a guessed 1-second sleep. The fix uses web-first assertions that wait up to the assertion timeout. The team verifies with <code>--repeat-each=50 --workers=4</code> — 200 runs, no failures — and removes the test from quarantine. They also log the 1.8 s save time as an observation for the performance backlog.' }
      ]
    },
    explain: {
      'ur': '<b>Flaky test</b> وہ ہے جو ایک ہی code پر، بغیر کسی تبدیلی کے، کبھی pass اور کبھی fail ہو۔ یہ خطرناک ہے کیونکہ team سرخ (red) build پر یقین کرنا چھوڑ دیتی ہے۔ عام وجوہات: timing (fixed wait یا جلدی check)، tests کا آپس میں data share کرنا، ایک جیسے نام والا test data، غیر مستحکم environment، animations اور third-party services۔ پہلے وجہ تلاش کریں: --repeat-each سے test کئی بار چلائیں اور trace viewer میں pass اور fail دونوں runs کا موازنہ کریں۔ مثال: trace دکھائے کہ message آنے سے پہلے ہی check ہو گیا — تو waitForTimeout کی بجائے await expect(...).toBeVisible() لگائیں۔ Retries صرف اشارہ ہیں، علاج نہیں؛ اور test کو quarantine میں رکھیں تو ticket، owner اور deadline کے ساتھ۔',
      'ur-Latn': '<b>Flaky test</b> woh hai jo ek hi code par, baghair kisi change ke, kabhi pass aur kabhi fail ho. Yeh khatarnak hai kyun ke team red build par yaqeen karna chhor deti hai. Aam wajoohat: timing (fixed wait ya jaldi check), tests ka aapas mein data share karna, ek jaise naam wala test data, unstable environment, animations aur third-party services. Pehle wajah talaash karein: --repeat-each se test kai baar chalayein aur trace viewer mein pass aur fail dono runs ka muqabla karein. Misaal: trace dikhaye ke message aane se pehle hi check ho gaya — to waitForTimeout ke bajaye await expect(...).toBeVisible() lagayein. Retries sirf ishara hain, ilaaj nahin; aur test ko quarantine mein rakhein to ticket, owner aur deadline ke saath.',
      'hi': '<b>Flaky test</b> वह है जो एक ही code पर, बिना किसी बदलाव के, कभी pass और कभी fail हो। यह ख़तरनाक है, क्योंकि team red build पर भरोसा करना छोड़ देती है। आम वजहें: timing (fixed wait या जल्दी check), tests का आपस में data share करना, एक जैसे नाम वाला test data, अस्थिर environment, animations और third-party services। पहले वजह खोजें: --repeat-each से test कई बार चलाएँ और trace viewer में pass और fail दोनों runs की तुलना करें। उदाहरण: trace दिखाए कि message आने से पहले ही check हो गया — तो waitForTimeout की जगह await expect(...).toBeVisible() लगाएँ। Retries सिर्फ़ संकेत हैं, इलाज नहीं; और test को quarantine में रखें तो ticket, owner और deadline के साथ।',
      'ar': '<b>الاختبار المتقلّب (flaky test)</b> هو اختبار ينجح أحيانًا ويفشل أحيانًا على الكود نفسه دون أي تغيير. وهو خطير لأن الفريق يتوقف عن الثقة في البناء الأحمر. أشهر الأسباب: التوقيت (انتظار ثابت أو تحقق مبكر)، ومشاركة البيانات بين الاختبارات، وبيانات اختبار بأسماء مكررة، وبيئة غير مستقرة، والحركات (animations)، والخدمات الخارجية. ابحث عن السبب أولًا: شغّل الاختبار مرات عدة باستخدام --repeat-each، وقارن في trace viewer بين تشغيل ناجح وآخر فاشل. مثال: إذا أظهر الـ trace أن التحقق حدث قبل ظهور الرسالة، فاستبدل waitForTimeout بـ await expect(...).toBeVisible(). إعادة المحاولة (retries) إشارة لا علاج، وإذا عزلت اختبارًا (quarantine) فليكن ذلك مع تذكرة ومسؤول وموعد نهائي.',
      'es': 'Un <b>test inestable (flaky)</b> pasa unas veces y falla otras con el mismo código y sin ningún cambio. Es peligroso porque el equipo deja de creer en un build en rojo. Causas habituales: tiempos (esperas fijas o comprobaciones demasiado pronto), datos compartidos entre tests, datos de prueba con nombres repetidos, entornos inestables, animaciones y servicios de terceros. Primero busca la causa: ejecuta el test muchas veces con --repeat-each y compara en el trace viewer una ejecución que pasa con otra que falla. Ejemplo: si el trace muestra que se comprobó el mensaje antes de que apareciera, sustituye waitForTimeout por await expect(...).toBeVisible(). Los reintentos son una señal, no una cura; y si pones un test en cuarentena, que sea con ticket, responsable y fecha límite.'
    },
    keyTerms: [
      { term: 'Flaky test', def: 'A test that passes and fails on the same code and environment without any change.' },
      { term: 'Trace viewer', def: 'Playwright’s replay tool showing actions, DOM snapshots, console, network and source; opened with npx playwright show-trace.' },
      { term: 'Retry', def: 'Automatically re-running a failed test. In Playwright, a test that fails and then passes on retry is reported as flaky.' },
      { term: 'Quarantine', def: 'Temporarily removing a known-flaky test from the blocking run while it is tagged, tracked, owned and fixed.' },
      { term: '--repeat-each', def: 'A CLI option that runs each selected test many times; useful for reproducing intermittent failures.' }
    ],
    practice: [
      { q: 'Name the likely cause of each symptom: (a) a test fails only when run in the full suite; (b) every test fails with 502 between 02:00 and 02:10; (c) a search finds two “Test Customer” rows; (d) a test fails only on the last day of the month.', answer: '(a) <b>Shared state / order dependence</b> — another test changes data it relies on. (b) <b>Environment</b> — probably a deploy or backup window; check infrastructure, not the tests. (c) <b>Data collision</b> — make names unique per test or worker. (d) <b>Date logic</b> — control the clock (for example with <code>page.clock</code>) and test month end deliberately; it may also be a real product bug.' },
      { q: 'Your config has <code>retries: 5</code> and the dashboard shows 100% green. The manager is happy. What would you check, and what would you change?', hint: 'What does Playwright report for a test that only passed on retry?', answer: "Check how many tests are marked <b>flaky</b> (failed, then passed on retry) in the HTML report — “100% green” may hide many. Lower retries to 1–2 in CI and 0 locally, set <code>trace: 'on-first-retry'</code> so every flaky run leaves evidence, open tickets with owners for the flaky tests, and track the flaky count as a team metric." },
      { q: 'Write a short quarantine policy (4–5 rules) for a team of three QA engineers with 900 automated tests.', answer: '1) A test is quarantined only with a ticket, an owner and the trace attached. 2) It is tagged <code>@quarantine</code> and excluded from the gating run with <code>--grep-invert @quarantine</code>, but still runs in a nightly non-blocking job. 3) Maximum stay is two weeks — then fix it, move it to a lower layer, or delete it with a recorded reason. 4) If more than about 2% of the suite is quarantined, flakiness work takes priority over new tests. 5) The list is reviewed at every retrospective.' }
    ],
    quiz: [
      { q: 'Which best describes a flaky test?', options: ['It passes and fails on the same code without any change', 'It fails every time because the product has a bug', 'It is skipped because nobody has written it yet', 'It always passes locally and always fails on the CI server'], correct: 0,
        why: ['Right — non-deterministic results on unchanged code are the definition of flakiness.', 'A consistent failure is deterministic — it points to a bug or a broken test, not flakiness.', 'That is a pending or fixme test, not a flaky one.', 'Always failing in CI is consistent, not random — usually an environment or configuration difference.'] },
      { q: 'With retries: 2, a test fails on its first attempt and passes on the second. How does Playwright report it?', options: ['As passed, with no further mention', 'As failed, and the whole run fails', 'As flaky', 'As skipped'], correct: 2,
        why: ['Playwright distinguishes a clean pass from a pass after a retry.', 'With retries enabled, a test that eventually passes does not fail the run by default.', 'Right — the flaky label is a signal to investigate, not a success.', 'Skipped means the test did not run at all.'] },
      { q: 'A test passes alone but fails about 20% of the time in the full parallel suite. What should you investigate first?', options: ['Raising the expect timeout to 30 seconds', 'Switching the test to run in headed mode', 'Replacing getByRole locators with CSS selectors', 'Shared data or state that other tests change'], correct: 3,
        why: ['Timeouts do not fix interference between tests; they only make failures slower.', 'Headed mode changes nothing about shared data and is slower in CI.', 'Locator style does not explain why the test passes when run alone.', 'Right — passing alone but failing in the suite points to shared state or order dependence.'] },
      { q: 'Which artefact gives the richest evidence for diagnosing a flaky Playwright failure?', options: ['The plain console log printed by the CI job', 'A Playwright trace of the failing run', 'A single screenshot taken at the moment of failure', 'The list of every test that passed in the same run'], correct: 1,
        why: ['Useful, but it shows only text output — not what the page looked like or which requests ran.', 'Right — the trace shows each action with before/after DOM snapshots, network, console and source.', 'One frame shows the end state, not how the page got there.', 'Passing tests rarely explain why another test failed.'] },
      { q: 'Which response to a flaky test is a root-cause fix rather than a patch?', options: ['Assert the state the user waits for instead of sleeping', 'Raise the retry count from two to five so it turns green', 'Add force: true to the failing click so checks are skipped', 'Run the whole suite on a single worker to avoid any overlap'], correct: 0,
        why: ['Right — it removes the timing guess and documents the expected state.', 'More retries hide the problem and make failing runs slower.', 'force skips actionability checks and can hide real overlay or disabled-state bugs.', 'Serial runs hide shared-state problems and slow the suite down.'] }
    ],
    interview: [
      { q: 'A Playwright test passes locally but flakes in CI. What would you investigate?', a: 'I start with evidence: the trace, screenshot, video and logs from a failing CI run, compared with a passing one. I check whether the test waits for a user-visible outcome after each action — for example the success message after <b>Save</b> — rather than assuming the click finished the work. Then I look at CI-specific factors: slower machines, parallel workers sharing accounts or data, environment instability, third-party calls and time zones. I reproduce with <code>--repeat-each</code> and several workers, fix the root cause with condition-based waits or isolated data, and treat retries as a signal — a pass on retry is still reported as flaky and gets a ticket.' },
      { q: 'A UI redesign broke many tests, and some now fail intermittently. How do you decide what to change?', a: 'I inspect a representative failure first: does the feature still work for a user? If only structure or styling changed, the tests were coupled to presentation — class names, DOM position — so I move them to roles, labels or agreed test ids, ideally inside page objects so each fix happens once. Intermittent failures after a redesign often come from new animations or loading states, so I assert the meaningful end state instead of adding sleeps. If behaviour or accessibility changed unexpectedly, I raise a product bug rather than simply updating the test to match.' }
    ],
    takeaways: [
      'Flaky means different results on unchanged code — it destroys trust in red builds.',
      'Reproduce with <code>--repeat-each</code>; diagnose with traces before changing anything.',
      'A pass on retry is reported as flaky — treat it as a work item, not a success.',
      'Quarantine needs a tag, a ticket, an owner and a deadline.',
      'Fix root causes: meaningful waits, isolated data, mocked third parties, controlled clocks.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions', 'shopflow-checkout'], interview: ['p2', 'p4'] }
  },

  /* ───────────────────────── 8 · CI/CD ───────────────────────── */
  {
    id: 'au-ci',
    n: 8,
    level: 'advanced',
    title: 'Running tests in CI/CD',
    summary: 'Run Playwright in a CI/CD pipeline with a correct GitHub Actions workflow, sharding, reports, safe secrets and quality gates teams trust.',
    minutes: 22,
    objectives: [
      'Place automated checks at the right stages of a CI/CD pipeline',
      'Write a GitHub Actions workflow that installs, runs and reports Playwright tests',
      'Speed up suites with workers and sharding, and publish HTML and JUnit reports',
      'Handle secrets safely and define smoke, regression and quality-gate policies'
    ],
    body: [
      { t: 'p', html: 'Tests that only run on a laptop protect nobody. <b>Continuous integration (CI)</b> runs checks automatically on every push or pull request, so a regression is caught minutes after it is written — when it is cheapest to fix. <b>Continuous delivery/deployment (CD)</b> carries a build through test environments towards production. Automated tests are the safety net at each step, ordered from fastest to slowest so feedback arrives early. As a QA engineer you are expected to read pipeline results, keep the test jobs healthy and help decide which checks block a release.' },
      { t: 'flow', caption: 'A typical pipeline: fast, cheap checks first', steps: ['Push / pull request', 'Install and lint', 'Unit tests', 'API tests', 'Deploy to test env', 'E2E smoke', 'Report and gate'] },
      { t: 'h', text: 'A GitHub Actions workflow for Playwright' },
      { t: 'code', lang: 'yaml', title: '.github/workflows/playwright.yml', code: `name: Playwright Tests
on:
  pull_request:
  push:
    branches: [main]

jobs:
  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
      - run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: \${{ vars.STAGING_URL }}
          QA_USER_PASSWORD: \${{ secrets.QA_USER_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14` },
      { t: 'p', html: 'Step by step: <code>npm ci</code> installs exactly what the lockfile says, so CI matches what developers tested. <code>npx playwright install --with-deps</code> downloads the browsers <b>and</b> the operating-system libraries they need on a fresh Linux runner. Tests read the target URL and credentials from variables and secrets. The upload step uses <code>if: ${{ !cancelled() }}</code> so the HTML report is saved even when tests fail — exactly when you need it most.' },
      { t: 'h', text: 'Parallelism and sharding' },
      { t: 'p', html: 'On one machine, Playwright runs test files in parallel <b>workers</b> (<code>fullyParallel: true</code> also parallelises tests inside a file). Across machines, <b>sharding</b> splits the suite: <code>npx playwright test --shard=2/4</code> runs the second quarter. In CI each shard writes a <b>blob</b> report (<code>reporter: process.env.CI ? \'blob\' : \'html\'</code>); a final job downloads them all and runs <code>npx playwright merge-reports --reporter html ./all-blob-reports</code> to build one combined HTML report.' },
      { t: 'code', lang: 'yaml', title: 'Sharding with a matrix (excerpt)', code: `jobs:
  e2e:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      # ...checkout, setup-node, npm ci and browser install as above...
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: blob-report-\${{ matrix.shardIndex }}
          path: blob-report
          retention-days: 1` },
      { t: 'h', text: 'Reports, secrets and what runs when' },
      { t: 'code', lang: 'ts', title: 'playwright.config.ts (excerpt) — CI-friendly settings', code: `export default defineConfig({
  forbidOnly: !!process.env.CI,          // fail CI if a stray test.only was committed
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],                       // for people: traces, screenshots
    ['junit', { outputFile: 'results/junit.xml' }],    // for CI dashboards and test tools
  ],  // when sharding in CI use reporter: [['blob']] instead, then run merge-reports
  use: { baseURL: process.env.BASE_URL, trace: 'on-first-retry' },
});` },
      { t: 'p', html: 'Use more than one reporter. The <b>HTML report</b> is for people: filter failures, open traces and see screenshots and videos. The <b>JUnit XML</b> file is for machines: CI systems and test-management tools read it to show pass/fail per test and trends over time. <code>forbidOnly</code> stops a forgotten <code>test.only</code> from silently skipping the rest of the suite, and fewer workers on small CI runners often makes runs <i>more</i> stable because the app and browsers are not fighting for CPU — the time lost is frequently won back through fewer retries and re-runs.' },
      { t: 'callout', tone: 'warn', title: 'Secrets in CI', html: 'Store passwords, tokens and API keys in the CI secret store and read them as environment variables — never in the repository, the config or test data. Use dedicated test accounts with minimum permissions. CI masks secret values in logs, but never print them. Traces, videos and storage-state files can contain session tokens and personal data, so keep artifact retention short and access restricted. Pull requests from forks do not receive secrets by default — plan for that.' },
      { t: 'table', head: ['Trigger', 'What runs', 'Time budget', 'Purpose'], rows: [
        ['Every pull request', 'Lint, unit and API tests plus an E2E <b>smoke</b> set on one browser', '≈ 10 minutes', 'Fast feedback; blocks the merge if red'],
        ['Merge to main', 'Broader regression on the shared test environment', '≈ 20–30 minutes', 'Catch integration problems early'],
        ['Nightly (scheduled)', 'Full cross-browser regression, visual checks, long data-driven suites', 'An hour or more is acceptable', 'Depth without slowing developers down'],
        ['Before release', 'Full regression plus exploratory testing and sign-off checks', 'Planned in advance', 'Evidence for the go/no-go decision']
      ] },
      { t: 'callout', tone: 'key', title: 'Quality gates must be trusted', html: 'A <b>quality gate</b> is a rule the pipeline enforces, such as “merge is blocked if smoke tests fail” or “no open critical defects before release”. Gates only work if the team believes them: a gate that is often red because of flaky tests gets bypassed. Keep gating suites small, fast and stable, and move slower or less reliable checks into non-blocking jobs until they are fixed.' }
    ],
    example: {
      title: 'Worked example: cutting MediBook’s PR checks from 48 to 12 minutes',
      blocks: [
        { t: 'p', html: 'MediBook ran all 600 Playwright tests on three browsers in a single job for every pull request: <b>48 minutes</b>. Developers started merging without waiting for results. The QA lead proposed four changes:' },
        { t: 'table', head: ['Change', 'Effect'], rows: [
          ['Tag 60 critical journeys <code>@smoke</code> and run them on PRs with <code>--grep @smoke</code> on Chromium only', 'E2E feedback on PRs in about 6 minutes'],
          ['Run the full suite on all three browsers on a nightly schedule, split with <code>--shard=1/4</code> … <code>--shard=4/4</code>', 'Full coverage every night in about 20 minutes'],
          ['Move 150 validation-only UI tests down to API tests', 'Faster and less flaky; the same rules are still covered'],
          ['Merge the blob reports into one HTML report and share its link with the team', 'One place to triage failures each morning']
        ] },
        { t: 'p', html: '<b>Result:</b> PR checks take about <b>12 minutes</b> including install, build and unit tests, and nobody bypasses them. The nightly job catches cross-browser issues and is reviewed every morning. The trade-off — some browser-specific bugs surface the next morning instead of on the PR — was discussed and accepted explicitly.' }
      ]
    },
    explain: {
      'ur': '<b>CI</b> کا مطلب ہے کہ ہر push یا pull request پر tests خود بخود چلیں، تاکہ غلطی چند منٹ میں پکڑی جائے۔ Pipeline میں پہلے تیز checks آتے ہیں (lint، unit، API) اور آخر میں سست E2E tests۔ GitHub Actions میں Playwright کے بنیادی steps یہ ہیں: checkout، setup-node، npm ci، npx playwright install --with-deps، npx playwright test، اور آخر میں report کو artifact کے طور پر upload کرنا — tests fail ہوں تب بھی۔ مثال: ہر PR پر صرف 10 منٹ کا smoke set چلائیں، اور پوری regression رات کو sharding کے ساتھ (--shard=1/4)۔ Passwords اور tokens کبھی code میں نہ لکھیں، انہیں CI کے secrets میں رکھیں۔ Quality gate، جیسے "smoke fail ہو تو merge بند"، تبھی کام کرتا ہے جب tests قابلِ اعتماد ہوں۔',
      'ur-Latn': '<b>CI</b> ka matlab hai ke har push ya pull request par tests khud ba khud chalein, taake ghalti chand minute mein pakri jaaye. Pipeline mein pehle tez checks aate hain (lint, unit, API) aur aakhir mein slow E2E tests. GitHub Actions mein Playwright ke basic steps yeh hain: checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test, aur aakhir mein report ko artifact ke taur par upload karna — tests fail hon tab bhi. Misaal: har PR par sirf 10 minute ka smoke set chalayein, aur poori regression raat ko sharding ke saath (--shard=1/4). Passwords aur tokens kabhi code mein na likhein, unhein CI ke secrets mein rakhein. Quality gate, jaise "smoke fail ho to merge band", tabhi kaam karta hai jab tests qabil-e-aitmaad hon.',
      'hi': '<b>CI</b> का मतलब है कि हर push या pull request पर tests अपने-आप चलें, ताकि गलती कुछ ही मिनटों में पकड़ी जाए। Pipeline में पहले तेज़ checks आते हैं (lint, unit, API) और आख़िर में धीमे E2E tests। GitHub Actions में Playwright के बुनियादी steps ये हैं: checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test, और आख़िर में report को artifact के रूप में upload करना — tests fail हों तब भी। उदाहरण: हर PR पर सिर्फ़ 10 मिनट का smoke set चलाएँ, और पूरी regression रात में sharding के साथ (--shard=1/4)। Passwords और tokens कभी code में न लिखें, उन्हें CI के secrets में रखें। Quality gate, जैसे "smoke fail हो तो merge बंद", तभी काम करता है जब tests भरोसेमंद हों।',
      'ar': '<b>التكامل المستمر (CI)</b> يعني أن تعمل الاختبارات تلقائيًا مع كل push أو pull request، فيُكتشف الخطأ خلال دقائق من كتابته. في الـ pipeline تأتي الفحوصات السريعة أولًا (lint وunit وAPI)، ثم اختبارات E2E الأبطأ في النهاية. الخطوات الأساسية لـ Playwright في GitHub Actions هي: checkout ثم setup-node ثم npm ci ثم npx playwright install --with-deps ثم npx playwright test، وأخيرًا رفع التقرير كـ artifact حتى عند فشل الاختبارات. مثال: شغّل مجموعة smoke مدتها نحو 10 دقائق مع كل PR، وشغّل الـ regression الكامل ليلًا مع التقسيم (--shard=1/4). لا تكتب كلمات المرور أو الـ tokens في الكود أبدًا، بل احفظها في secrets الخاصة بالـ CI. وبوابة الجودة (quality gate)، مثل منع الدمج عند فشل الـ smoke، لا تنجح إلا إذا كانت الاختبارات موثوقة.',
      'es': '<b>CI (integración continua)</b> significa que las pruebas se ejecutan solas en cada push o pull request, para detectar un error pocos minutos después de escribirlo. En el pipeline van primero las comprobaciones rápidas (lint, unitarias, API) y al final las E2E, más lentas. En GitHub Actions, los pasos básicos para Playwright son: checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test y, por último, subir el informe como artifact, también cuando hay fallos. Ejemplo: en cada PR, un conjunto smoke de unos 10 minutos; la regresión completa, por la noche y repartida con sharding (--shard=1/4). Nunca escribas contraseñas ni tokens en el código: guárdalos en los secrets del CI. Y una quality gate, como «si falla el smoke no se fusiona», solo funciona si las pruebas son fiables.'
    },
    keyTerms: [
      { term: 'Continuous integration (CI)', def: 'Automatically building and testing every change pushed to a shared repository, so problems surface within minutes.' },
      { term: 'Sharding', def: 'Splitting a test suite across several machines, e.g. --shard=1/4, then merging their reports.' },
      { term: 'Artifact', def: 'A file a CI job saves for later download, such as the HTML report, traces or JUnit XML.' },
      { term: 'Quality gate', def: 'A rule the pipeline enforces before a change can merge or deploy, such as all smoke tests passing.' },
      { term: 'Smoke suite', def: 'A small, broad set of critical checks that quickly shows whether a build is testable at all.' }
    ],
    practice: [
      { q: 'Put these CI steps in order and explain one of them: run tests · upload report · <code>npm ci</code> · checkout · install browsers · setup-node.', answer: 'Checkout → setup-node → <code>npm ci</code> → <code>npx playwright install --with-deps</code> → <code>npx playwright test</code> → upload report (with <code>if: ${{ !cancelled() }}</code>). Browsers are installed after <code>npm ci</code> because the install uses the Playwright version just pulled from the lockfile, and <code>--with-deps</code> adds the OS libraries a fresh runner lacks.' },
      { q: 'A suite of 800 tests takes 70 minutes on one CI machine. Describe two ways to make pull-request feedback faster without losing coverage.', answer: '(1) Split responsibilities: run a tagged <code>@smoke</code> subset on every PR (<code>--grep @smoke</code>) and the full suite nightly or on merge. (2) Parallelise: more workers per machine and <code>--shard=i/n</code> across machines with a matrix, merging blob reports into one HTML report. Also look for UI tests that only check business rules and move them to faster API tests.' },
      { q: "A teammate commits <code>const password = 'Admin@123'</code> in a test so the CI run works. What is wrong, and what should they do instead?", answer: 'A secret in the repository is visible to everyone with access and stays in git history even after it is deleted. They should rotate that password, store the new one in the CI secret store, pass it as an environment variable (<code>QA_USER_PASSWORD: ${{ secrets.QA_USER_PASSWORD }}</code>) and read <code>process.env.QA_USER_PASSWORD</code> in the test. Use a dedicated low-privilege test account and never print the value in logs.' }
    ],
    quiz: [
      { q: 'Why does the workflow run npx playwright install --with-deps on a fresh CI runner?', options: ['To install the Playwright npm package from the registry', 'To update Node.js to the latest LTS version', 'To start the application server before the tests', 'To download browsers and the OS libraries they need'], correct: 3,
        why: ['npm ci installs the npm package; this step installs browsers.', 'setup-node handles the Node.js version.', 'Starting the app is a separate step or the webServer config option.', 'Right — a fresh runner has neither the browser binaries nor their system dependencies.'] },
      { q: 'Why does the report upload step use if: ${{ !cancelled() }}?', options: ['To skip the upload whenever the tests pass', 'To keep the report even when tests fail', 'To upload the report only on the main branch', 'To make the upload run before the tests start'], correct: 1,
        why: ['It does not skip anything on success — it runs whatever the test result.', 'Right — without it, a failing test step would skip the upload and lose the evidence you need most.', 'Branch filtering is done with on: triggers or other conditions, not cancelled().', 'Steps run in order; a condition does not move a step.'] },
      { q: 'What does npx playwright test --shard=2/4 do?', options: ['Runs every test four times using two separate workers', 'Runs only the tests whose title includes the text 2/4', 'Runs the second quarter of the suite', 'Splits each test into four smaller steps run in order'], correct: 2,
        why: ['Repetition is --repeat-each and worker count is --workers; neither is sharding.', 'Filtering by title is done with --grep.', 'Right — shards let several machines share a suite; their blob reports are merged afterwards.', 'Sharding distributes whole tests; it never splits a test into steps.'] },
      { q: 'A team wants fast pull-request feedback and full coverage. Which schedule fits best?', options: ['Smoke on every PR, full cross-browser regression nightly', 'Full regression on every browser for each single pull request', 'Manual testing only, in the week before each release', 'Full regression once a month, run by one engineer'], correct: 0,
        why: ['Right — fast, critical checks gate merges; the deep suite runs when nobody is waiting.', 'Thorough but slow; developers stop waiting for it or bypass it.', 'Removes automated feedback entirely.', 'Regressions would go unnoticed for weeks.'] },
      { q: 'Where should a CI pipeline get the password for the test account?', options: ['From a constant written in playwright.config.ts', 'From a JSON file committed to the test-data folder', 'From CI secrets, via an environment variable', 'From the saved HTML report of the previous run'], correct: 2,
        why: ['Anything in the repository is visible to everyone and stays in git history.', 'Committed files leak the secret the same way, even inside a test folder.', 'Right — the secret stays out of the code and is masked in logs.', 'Reports must never contain secrets; that would leak them further.'] }
    ],
    interview: [
      { q: 'How would you set up Playwright tests in a CI/CD pipeline?', a: "I run them in a workflow triggered on pull requests and merges to main: checkout, <code>setup-node</code>, <code>npm ci</code>, <code>npx playwright install --with-deps</code>, then <code>npx playwright test</code>, with the base URL and credentials coming from CI variables and secrets. The HTML report and traces are uploaded as artifacts even when tests fail. On PRs a fast <b>smoke</b> set acts as the merge gate; the full cross-browser regression runs nightly, sharded across machines with merged reports. JUnit output feeds the dashboard. I keep retries low, use <code>trace: 'on-first-retry'</code> for evidence, and set <code>forbidOnly</code> so a stray <code>test.only</code> cannot slip through." },
      { q: 'Your CI gate is often red because of flaky tests, and developers have started to bypass it. What do you do?', a: 'A gate that is ignored is worse than none, so I restore trust first. I move known-flaky tests out of the gating run into a tracked quarantine with owners and deadlines, keep the gate to a small set of stable, high-value checks, and make its report easy to read. In parallel I fix root causes — waits, shared data, environment — using traces. I share the flaky count as a team metric so it stays visible. Once the gate is reliably green for real reasons, I add tests back gradually.' }
    ],
    takeaways: [
      'Order the pipeline from fast to slow: lint, unit, API, then E2E.',
      'Workflow core: checkout → setup-node → <code>npm ci</code> → <code>install --with-deps</code> → test → upload report.',
      'Upload reports with <code>!cancelled()</code> so failures always leave evidence.',
      'Smoke on every PR, full sharded regression nightly; HTML for people, JUnit for tools.',
      'Secrets live in the CI store; gates must stay small, stable and trusted.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p2'] }
  },

  /* ───────────────────────── 9 · BDD, API and visual ───────────────────────── */
  {
    id: 'au-bdd-api-visual',
    n: 9,
    level: 'advanced',
    title: 'BDD, API automation and visual regression',
    summary: 'Use BDD for shared understanding, the request fixture for API tests and setup, page.route for mocking, and screenshot comparisons wisely.',
    minutes: 26,
    objectives: [
      'Explain when BDD and Gherkin help and when they only add overhead',
      'Write API tests with Playwright’s request fixture and use the API to set up UI tests',
      'Mock network responses with page.route to test error and edge states',
      'Use toHaveScreenshot with masks and thresholds, and balance contract and E2E tests'
    ],
    body: [
      { t: 'p', html: 'Three techniques extend browser automation. <b>BDD</b> improves the team’s shared understanding of requirements. <b>API automation</b> gives fast, stable checks and quick test setup. <b>Visual regression</b> catches layout and styling changes that functional assertions miss. Each solves a real problem and brings its own costs, so a strong tester also knows when <i>not</i> to use them. The common thread is choosing the cheapest, most reliable layer for each question: talk to people for shared understanding, call the API for rules and data, and use the browser — including screenshots — for what only the browser can show.' },
      { t: 'h', text: 'BDD and Gherkin: collaboration first' },
      { t: 'code', lang: 'gherkin', title: 'features/free-shipping.feature', code: `Feature: Free shipping threshold
  Orders with a merchandise subtotal of $50.00 or more ship free.

  Scenario: Subtotal exactly on the threshold
    Given my cart contains items worth $50.00
    When I open the checkout page
    Then the shipping cost should be $0.00

  Scenario: Subtotal just below the threshold
    Given my cart contains items worth $49.99
    When I open the checkout page
    Then the shipping cost should be $6.00` },
      { t: 'compare',
        a: { title: 'BDD helps when', items: ['Product, developers and testers write examples <b>together</b> before coding (the “Three Amigos”)', 'Business rules are complex and examples remove ambiguity', 'Non-technical stakeholders actually read and review the scenarios', 'Scenarios are maintained as living documentation'] },
        b: { title: 'BDD hurts when', items: ['Testers write Gherkin alone after development — it is just extra syntax', 'Steps turn into UI scripts: “When I click the blue button”', 'A large step-definition layer sits on top of page objects', 'Nobody outside QA ever reads the feature files'] } },
      { t: 'p', html: 'Tools such as Cucumber (and community packages that connect Gherkin to Playwright Test) map each step to code, and that glue layer has a maintenance cost. If the conversations are not happening, plain Playwright tests with clear names give the same coverage with less machinery. Write steps in business language — <i>what</i> the user wants — and keep the <i>how</i> in page objects.' },
      { t: 'h', text: 'API tests, hybrid setup and mocking' },
      { t: 'code', lang: 'ts', title: 'tests/api/orders.spec.ts', code: `import { test, expect } from '@playwright/test';

const auth = { Authorization: \`Bearer \${process.env.API_TOKEN}\` };

test('POST /api/orders creates an order that can be read back', async ({ request }) => {
  const create = await request.post('/api/orders', {
    data: { productId: 'SKU-1001', quantity: 2 },
    headers: auth,
  });
  expect(create.status()).toBe(201);
  const order = await create.json();
  expect(order).toMatchObject({ productId: 'SKU-1001', quantity: 2, status: 'pending' });

  // 201 alone does not prove persistence — read the order back
  const read = await request.get(\`/api/orders/\${order.id}\`, { headers: auth });
  await expect(read).toBeOK();
  expect((await read.json()).quantity).toBe(2);
});

test('rejects a request without a token', async ({ request }) => {
  const res = await request.post('/api/orders', { data: { productId: 'SKU-1001', quantity: 1 } });
  expect(res.status()).toBe(401);
});` },
      { t: 'p', html: 'The <code>request</code> fixture resolves paths against <code>baseURL</code> from the config. The same fixture powers <b>hybrid tests</b>: create data through the API in milliseconds, then use the browser only for what the test is really about — for example, create an order with <code>POST /api/orders</code>, open <code>/account/orders</code> and assert the row is visible, instead of clicking through checkout first. Note the missing-token case: <b>401</b> means not authenticated, while <b>403</b> would mean authenticated but not allowed.' },
      { t: 'code', lang: 'ts', title: 'Mocking a payment outage with page.route', code: `test('shows a friendly message when payments are down', async ({ page }) => {
  await page.route('**/api/payments', route =>
    route.fulfill({ status: 503, json: { error: 'Service unavailable' } })
  );
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Payments are temporarily unavailable. You have not been charged.'
  );
});` },
      { t: 'p', html: '<code>page.route</code> intercepts matching requests from the page: <code>route.fulfill()</code> returns your response, <code>route.abort()</code> simulates a network failure, and <code>route.continue()</code> lets the request through, optionally modified. Mocking makes rare states — outages, empty lists, slow responses, odd data — reliable to test. The trade-off: a mocked test no longer proves the real backend works, so keep some unmocked journeys and contract tests too.' },
      { t: 'h', text: 'Visual regression with toHaveScreenshot' },
      { t: 'code', lang: 'ts', title: 'A screenshot comparison with masks', code: `test('order summary looks right', async ({ page }) => {
  await page.goto('/orders/ORD-1001');
  await expect(page).toHaveScreenshot('order-summary.png', {
    mask: [page.getByTestId('order-date'), page.getByTestId('promo-banner')],
    maxDiffPixelRatio: 0.01,
  });
});
// First run: no baseline exists, so the test fails and writes one.
// Review it and commit it. After an intended UI change, run:
//   npx playwright test --update-snapshots` },
      { t: 'table', head: ['Pitfall', 'Why it happens', 'Mitigation'], rows: [
        ['Fonts and rendering differ', 'Baselines are browser- and OS-specific; a Mac baseline will not match Linux CI', 'Create and update baselines in the same environment as CI, e.g. the same Docker image'],
        ['Dynamic data', 'Dates, prices, ads and avatars change on every run', '<code>mask</code> those locators, use fixed test data or control the clock'],
        ['Animations and carets', 'The page is captured mid-transition', '<code>toHaveScreenshot</code> disables CSS animations and hides the caret by default; wait for a stable state'],
        ['Thresholds too loose or too tight', 'Too tight creates noise; too loose lets real changes through', 'Start strict and tune <code>maxDiffPixels</code>, <code>maxDiffPixelRatio</code> or <code>threshold</code> per screenshot'],
        ['Rubber-stamp updates', '<code>--update-snapshots</code> run without looking at the diffs', 'Review every image diff in the report before committing new baselines']
      ] },
      { t: 'callout', tone: 'key', title: 'Balance contract, API and E2E tests', html: 'E2E tests prove that a few critical journeys work through every layer, but they are slow and costly. <b>Contract tests</b> check that a provider API still matches what its consumers expect — fields, types, status codes — quickly and without a full environment; consumer-driven tools such as Pact automate this. Use contract and API tests for breadth across endpoints and fields, and keep E2E for the handful of journeys users care about most.' }
    ],
    example: {
      title: 'Worked example: a hybrid test for ShopFlow order history',
      blocks: [
        { t: 'p', html: '<b>Goal:</b> check that a customer’s order history shows a new order, and that an empty history shows a helpful message — without clicking through checkout every time. The page is signed in through <code>storageState</code> as the same customer whose token is in <code>API_TOKEN</code>.' },
        { t: 'code', lang: 'ts', title: 'tests/order-history.spec.ts', code: `test('order history lists a newly created order', async ({ page, request }) => {
  // Arrange through the API (fast)
  const res = await request.post('/api/orders', {
    data: { productId: 'SKU-2002', quantity: 1 },
    headers: { Authorization: \`Bearer \${process.env.API_TOKEN}\` },
  });
  expect(res.status()).toBe(201);
  const { id } = await res.json();

  // Assert through the UI (what the customer actually sees)
  await page.goto('/account/orders');
  await expect(page.getByRole('row').filter({ hasText: id })).toContainText('Pending');
});

test('empty history shows a helpful message', async ({ page }) => {
  await page.route('**/api/orders*', route => route.fulfill({ json: [] }));
  await page.goto('/account/orders');
  await expect(page.getByText('You have no orders yet')).toBeVisible();
});` },
        { t: 'p', html: 'The first test arranges data through the API and asserts only what matters in the UI; the second uses <code>page.route</code> to produce an empty state on demand. Together they run in a couple of seconds, while the full checkout journey is covered once, separately, by a dedicated E2E test.' }
      ]
    },
    explain: {
      'ur': 'یہ سبق تین چیزیں سکھاتا ہے۔ <b>BDD</b> اصل میں تعاون (collaboration) ہے: product، developer اور tester مل کر Given/When/Then مثالیں لکھتے ہیں؛ اگر tester اکیلا بعد میں Gherkin لکھے تو یہ صرف اضافی syntax ہے۔ <b>API testing</b> کے لیے Playwright کا request fixture استعمال کریں: مثلاً POST /api/orders سے order بنائیں، 201 چیک کریں، پھر GET سے دوبارہ پڑھ کر ثابت کریں کہ data واقعی save ہوا۔ یہی API، UI tests کا data جلدی تیار کرنے میں بھی کام آتی ہے۔ page.route سے server کا جواب mock کر کے error والی حالت آسانی سے test ہو جاتی ہے۔ <b>Visual testing</b> میں toHaveScreenshot تصویروں کا موازنہ کرتا ہے؛ بدلتی تاریخیں mask کریں اور baseline اسی environment میں بنائیں جہاں CI چلتا ہے۔',
      'ur-Latn': 'Yeh sabaq teen cheezein sikhata hai. <b>BDD</b> asal mein collaboration hai: product, developer aur tester mil kar Given/When/Then misaalein likhte hain; agar tester akela baad mein Gherkin likhe to yeh sirf extra syntax hai. <b>API testing</b> ke liye Playwright ka request fixture use karein: maslan POST /api/orders se order banayein, 201 check karein, phir GET se dobara parh kar saabit karein ke data waqai save hua. Yehi API, UI tests ka data jaldi tayyar karne mein bhi kaam aati hai. page.route se server ka jawab mock kar ke error wali haalat aasaani se test ho jaati hai. <b>Visual testing</b> mein toHaveScreenshot tasveeron ka muqabla karta hai; badalti tareekhein mask karein aur baseline usi environment mein banayein jahan CI chalta hai.',
      'hi': 'यह पाठ तीन चीज़ें सिखाता है। <b>BDD</b> असल में collaboration है: product, developer और tester मिलकर Given/When/Then उदाहरण लिखते हैं; अगर tester अकेले बाद में Gherkin लिखे, तो यह सिर्फ़ अतिरिक्त syntax है। <b>API testing</b> के लिए Playwright का request fixture इस्तेमाल करें: जैसे POST /api/orders से order बनाएँ, 201 जाँचें, फिर GET से दोबारा पढ़कर साबित करें कि data सच में save हुआ। यही API, UI tests का data जल्दी तैयार करने में भी काम आती है। page.route से server का जवाब mock करके error वाली स्थिति आसानी से test हो जाती है। <b>Visual testing</b> में toHaveScreenshot तस्वीरों की तुलना करता है; बदलती तारीख़ें mask करें और baseline उसी environment में बनाएँ जहाँ CI चलता है।',
      'ar': 'يعلّمك هذا الدرس ثلاثة أمور. <b>BDD</b> في جوهره تعاون: يكتب مسؤول المنتج والمطوّر والمختبِر معًا أمثلة Given/When/Then؛ أما إذا كتب المختبِر Gherkin وحده بعد التطوير فهو مجرد صياغة إضافية. وفي <b>اختبار الـ API</b> استخدم الـ request fixture في Playwright: مثلًا أنشئ طلبًا عبر POST /api/orders، وتحقق من الرمز 201، ثم اقرأه مجددًا عبر GET لتثبت أن البيانات حُفظت فعلًا. وتفيد الـ API نفسها في تجهيز بيانات اختبارات الواجهة بسرعة. ومع page.route يمكنك محاكاة (mock) ردّ الخادم لاختبار حالات الخطأ بسهولة. وفي <b>الاختبار المرئي</b> تقارن toHaveScreenshot الصور؛ أخفِ التواريخ المتغيرة باستخدام mask، وأنشئ الصورة المرجعية في البيئة نفسها التي يعمل فيها الـ CI.',
      'es': 'Esta lección cubre tres ideas. <b>BDD</b> es, ante todo, colaboración: producto, desarrollo y QA escriben juntos ejemplos Given/When/Then; si QA escribe Gherkin a solas y después del desarrollo, solo es sintaxis extra. Para las <b>pruebas de API</b>, usa el fixture request de Playwright: por ejemplo, crea un pedido con POST /api/orders, comprueba el 201 y vuelve a leerlo con GET para demostrar que se guardó de verdad. Esa misma API sirve para preparar rápido los datos de las pruebas de interfaz. Con page.route puedes simular (mock) la respuesta del servidor y probar estados de error con facilidad. En las <b>pruebas visuales</b>, toHaveScreenshot compara imágenes: enmascara las fechas que cambian y genera la referencia en el mismo entorno donde corre el CI.'
    },
    keyTerms: [
      { term: 'BDD', def: 'Behaviour-driven development: a collaborative practice where the team agrees concrete examples of behaviour before building it.' },
      { term: 'Gherkin', def: 'The Given/When/Then plain-language format for BDD scenarios, executed by tools such as Cucumber.' },
      { term: 'request fixture', def: 'Playwright’s built-in API client (APIRequestContext) for HTTP calls in tests; it shares baseURL with the config.' },
      { term: 'page.route', def: 'Intercepts network requests from the page so a test can fulfil, modify or abort them — the basis of UI-level mocking.' },
      { term: 'Visual baseline', def: 'The approved reference screenshot that toHaveScreenshot compares against; it is specific to browser and operating system.' },
      { term: 'Contract test', def: 'A fast check that an API still matches the structure its consumers expect, without running a full end-to-end flow.' }
    ],
    practice: [
      { q: 'Rewrite this UI-script style step in business language: <i>“When I click the element with id btn-apply after typing SAVE10 into the third input”</i>.', answer: '<b>When I apply the coupon “SAVE10”</b>. The step says <i>what</i> the user does; the step definition (or page object) knows <i>how</i> — which field and which button. If the layout changes, the scenario stays the same and only the page object changes.' },
      { q: 'Write a Playwright API test that checks <code>GET /api/products/SKU-404</code> returns 404 for a product that does not exist.', answer: "<code>test('unknown product returns 404', async ({ request }) =&gt; {</code><br><code>const res = await request.get('/api/products/SKU-404');</code><br><code>expect(res.status()).toBe(404);</code><br><code>});</code><br>Optionally also check the error body, e.g. <code>expect(await res.json()).toMatchObject({ error: 'Product not found' })</code>, and that no stack trace or internal detail leaks." },
      { q: 'A <code>toHaveScreenshot</code> test passes on your Mac but fails on Linux CI with a 3% pixel difference around the text. What is happening, and what do you do?', hint: 'Where were the baselines generated?', answer: 'Baselines are <b>browser- and OS-specific</b>: font rendering differs between macOS and Linux. Create and update baselines in the environment CI uses — for example run <code>--update-snapshots</code> inside the same Docker image or in a CI job — review the new images and commit them. Do not just raise the threshold to 5%; that would hide real layout regressions.' }
    ],
    quiz: [
      { q: 'What is the main purpose of BDD?', options: ['To let testers automate tests without any programming', 'Shared understanding through agreed examples', 'To replace all unit tests with Gherkin scenarios', 'To generate longer, more detailed reports for managers'], correct: 1,
        why: ['Step definitions are still code; BDD is not a no-code tool.', 'Right — the value is the conversation that produces clear examples; Gherkin is just the format.', 'BDD complements unit tests; it does not replace them.', 'Reporting is a side effect, not the purpose.'] },
      { q: "A test calls request.post('/api/users', { data }) and receives 201. What should it do next to prove the user was saved?", options: ['Read the user back with a GET and check its fields', 'Nothing more — a 201 Created status proves it was stored', 'Check that the response arrived in under one second', 'Send the same POST again and expect another 201'], correct: 0,
        why: ['Right — a 201 alone does not prove persistence; reading it back (or a read-only DB query) does.', 'A status code reports what the server claims; a bug can return 201 without saving.', 'Speed is a separate, non-functional concern.', 'A repeated POST tests duplicate handling, not persistence — and could wrongly create a second user.'] },
      { q: "What does this code do? await page.route('**/api/payments', route => route.fulfill({ status: 503, json: { error: 'Down' } }))", options: ['Sends a real 503 error to the payment server', 'Blocks every network request made by the page', 'Makes the test wait until payments return 503', 'Answers the page’s payment calls with a fake 503'], correct: 3,
        why: ['Nothing reaches the real server; the request is answered locally.', 'Only requests matching the URL pattern are intercepted.', 'route does not wait for anything; it intercepts requests.', 'Right — matching requests get the mocked 503, so the UI’s error handling can be tested.'] },
      { q: 'A toHaveScreenshot test fails on every run because the page shows today’s date. What is the best fix?', options: ['Delete the visual test, since it keeps failing', 'Raise maxDiffPixelRatio to 0.5 so it always passes', 'Mask the date or control the clock', 'Run --update-snapshots automatically before each run'], correct: 2,
        why: ['The test may still catch real layout regressions; remove the noise instead.', 'Allowing half the pixels to differ would hide genuine regressions.', 'Right — mask the dynamic element or fix the date (for example with page.clock) so only real changes are flagged.', 'Auto-updating baselines means the test can never fail — it compares the page with itself.'] },
      { q: 'Which balance between contract/API tests and E2E tests is usually healthiest?', options: ['Broad contract and API tests, plus a few E2E journeys', 'Only E2E tests, because they check every layer at once', 'Only contract tests, because they are fastest', 'Equal numbers of each, whatever the product'], correct: 0,
        why: ['Right — breadth comes from fast, precise lower-level tests; E2E proves the key journeys work end to end.', 'Slow, flaky and hard to diagnose at scale — the ice-cream cone again.', 'Contracts cannot show that a whole journey works for a user.', 'The right mix depends on risk and architecture, not a fixed ratio.'] }
    ],
    interview: [
      { q: 'What is BDD, and have you found it useful?', a: 'BDD is a collaboration practice: product, development and QA agree concrete examples of behaviour — often written as Given/When/Then — before a feature is built. Its value is the conversation, which exposes ambiguity early; tools like Cucumber can then automate those scenarios. It works well when business people really take part and the rules are complex. When testers write Gherkin alone after development, it becomes an extra layer to maintain without the benefit, and I would rather write clear Playwright tests. Either way, I keep steps in business language and UI details in page objects.' },
      { q: 'How do you combine API and UI automation?', a: 'I use the API for <b>breadth and setup</b> and the UI for <b>what only the UI can show</b>. Validation rules, permissions and status codes are tested at API level with the <code>request</code> fixture — fast and precise — and I verify persistence with a follow-up GET, not just a 201. For UI tests I create the data they need through the API, then open the page and assert what the user sees. I use <code>page.route</code> to mock rare states such as outages or empty lists, and a few unmocked E2E journeys prove the whole stack works together.' }
    ],
    takeaways: [
      'BDD is collaboration on examples; Gherkin on its own is just syntax.',
      'Use the <code>request</code> fixture for fast API tests — and GET after POST to prove persistence.',
      'Set up UI tests through the API; assert in the UI only what matters there.',
      '<code>page.route</code> makes outages and edge states easy to test, but keep some unmocked journeys.',
      'Screenshot baselines are OS-specific; mask dynamic data and review every diff.'
    ],
    links: { labs: ['api', 'checkout'], challenges: ['api-contract', 'shopflow-checkout'], interview: ['p3'] }
  }
  /* LESSONS-END */
]);

QA_CONTENT.addBank('automation', [
  { level: 'beginner', topic: 'au-what-to-automate',
    q: 'A startup has one tester and a product whose screens change every week. Which automation investment gives the best return right now?',
    options: ['A full UI regression suite covering every screen', 'Visual screenshot tests for every page', 'API tests for the stable core business rules', 'No testing at all until the design settles'], correct: 2,
    why: ['UI scripts would break every week as the screens change.', 'Screenshots of changing screens produce constant diffs and baseline churn.', 'Right — the API and business rules are more stable than the UI, so checks there survive redesigns.', 'Risk does not wait for the design; test manually and automate the stable parts.'] },
  { level: 'intermediate', topic: 'au-playwright-basics',
    q: "Each ShopFlow product card is a listitem containing an 'Add to cart' button. Which locator targets the button for 'Wireless Mouse' most robustly?",
    options: ["<code>page.getByRole('button', { name: 'Add to cart' }).nth(3)</code>", "<code>page.getByRole('listitem').filter({ hasText: 'Wireless Mouse' }).getByRole('button', { name: 'Add to cart' })</code>", "<code>page.locator('ul &gt; li:nth-child(4) button')</code>", "<code>page.getByText('Add to cart').first()</code>"], correct: 1,
    why: ['Position breaks as soon as the product order changes or a product is added.', 'Right — scope to the card by its visible product name, then find the button inside it.', 'A positional CSS path couples the test to list order and markup structure.', 'first() picks whichever card happens to be first — not necessarily Wireless Mouse.'] },
  { level: 'intermediate', topic: 'au-waits',
    q: "What is wrong with this line? expect(await page.getByRole('row').count()).toBe(5)",
    options: ['count() is not a Playwright locator method', 'It should use toEqual instead of toBe', 'Rows can only be counted with CSS selectors', 'It counts once, so rows still loading make it fail'], correct: 3,
    why: ['count() exists on locators — it simply returns the number once, without retrying.', 'toBe and toEqual behave the same for numbers; the matcher is not the problem.', 'getByRole works for table rows; the issue is timing.', "Right — use <code>await expect(page.getByRole('row')).toHaveCount(5)</code>, which retries until the count matches."] },
  { level: 'advanced', topic: 'au-waits',
    q: 'Which situation is expect.poll designed for?',
    options: ['Waiting for a backend value, such as a job status', 'Waiting for a button to become enabled before a click', 'Retrying a whole test after it fails', 'Slowing every action down by a fixed delay'], correct: 0,
    why: ['Right — expect.poll retries a function until its returned value matches, ideal for values that are not on the page.', 'Actions already auto-wait for the enabled state; no polling is needed.', 'Test retries are set with retries in the config, not with expect.poll.', 'That would be a hard sleep; expect.poll continues as soon as the value matches.'] },
  { level: 'intermediate', topic: 'au-fixtures-data',
    q: 'In this fixture, what happens if the test body throws an error? employee: async ({ request }, use) => { const e = await createEmployee(request); await use(e); await deleteEmployee(request, e.id); }',
    options: ['Nothing more — the fixture stops at use(e)', 'Only createEmployee runs again', 'deleteEmployee still runs as teardown', 'The worker restarts before deleteEmployee can run'], correct: 2,
    why: ['use() returns after the test finishes — pass or fail — and the code after it continues.', 'Setup does not re-run; the fixture moves on to teardown.', 'Right — code after await use() is teardown and runs whether the test passed or failed.', 'Playwright may start a fresh worker after a failure, but only after tearing down that test’s fixtures.'] },
  { level: 'advanced', topic: 'au-fixtures-data',
    q: 'Ten parallel workers share one test account. Tests that change the account’s settings fail randomly. Which fix scales best?',
    options: ['Run every settings test on one single worker only', 'Add retries: 3 just for the settings tests', 'Rename the file so the settings tests run last', 'Give each worker its own account and session'], correct: 3,
    why: ['It hides the collision and slows the suite; other files can still interfere.', 'Retries mask the shared-state problem, and the collision can repeat.', 'File order is not a contract in parallel runs, and it creates hidden coupling.', 'Right — per-worker accounts (keyed by workerIndex) remove the shared state while keeping parallelism.'] },
  { level: 'intermediate', topic: 'au-frameworks',
    q: 'Which Cypress line correctly retries until the cart badge shows 3?',
    options: ["<code>expect(cy.get('.badge').text()).toBe('3')</code>", "<code>cy.get('.badge').should('have.text', '3')</code>", "<code>const t = await cy.get('.badge').text()</code>", "<code>cy.wait(3000); cy.get('.badge').contains('3')</code>"], correct: 1,
    why: ['cy.get() yields a chainable subject, not an element with a text() method you can read synchronously.', 'Right — .should() retries the query and assertion until it passes or the default 4 s timeout ends.', 'Cypress commands are queued, not promises, so they are not awaited.', 'cy.wait(3000) is a hard sleep; the query would retry on its own without it.'] },
  { level: 'beginner', topic: 'au-frameworks',
    q: 'Since Selenium 4.6, what usually takes care of getting the matching chromedriver?',
    options: ['Selenium Manager, bundled with Selenium', 'The tester, by hand, before every single run', 'Playwright’s npx playwright install command', 'The operating system’s automatic updates'], correct: 0,
    why: ['Right — Selenium Manager detects the browser and fetches a matching driver automatically.', 'That was common years ago; Selenium Manager now does it.', 'Playwright installs its own browsers; it does not manage Selenium drivers.', 'OS updates do not install WebDriver binaries.'] },
  { level: 'advanced', topic: 'au-pom',
    q: "A page object contains: async addToCart(name: string) { await this.page.getByRole('listitem').filter({ hasText: name }).getByRole('button', { name: 'Add to cart' }).click(); } Which statement is accurate?",
    options: ['It should also assert the cart count inside the method', 'It needs a waitForTimeout before the click to be safe', 'It reveals intent well; tests should assert the result', 'It breaks POM, because page objects must never hold locators'], correct: 2,
    why: ['An assertion inside would stop negative tests (for example, out of stock) from reusing it.', 'Locators auto-wait; a sleep would only slow it down and make it less stable.', 'Right — it names the user goal, scopes the repeated button to one card and leaves verification to the test.', 'Holding locators is exactly what page objects are for.'] },
  { level: 'intermediate', topic: 'au-pom',
    q: 'A date-picker widget appears on five different pages. Where should it be modelled?',
    options: ['Copied into each of the five page objects separately', 'In a BasePage class that every page must extend', 'Written directly in each spec file that uses it', 'As a component object scoped to a root locator'], correct: 3,
    why: ['Duplication means five edits for every change to the widget.', 'Inheritance forces the widget onto pages that do not have it and grows a “god class”.', 'Specs would repeat widget details and lose readability.', 'Right — a component object is composed into each page that contains the widget.'] },
  { level: 'intermediate', topic: 'au-flaky',
    q: 'Every test in a nightly run failed with 502 Bad Gateway between 02:00 and 02:08, then everything passed again. What is the most likely explanation?',
    options: ['Every locator in the suite became brittle at once', 'The environment was down, e.g. during a deploy', 'The suite simply needs a higher retry count', 'A new product bug appeared in every single feature'], correct: 1,
    why: ['Locators do not all break in the same minute and then recover.', 'Right — simultaneous 502s across unrelated tests point to infrastructure; check deploy and maintenance windows.', 'Retries would hide an environment problem that should be fixed or scheduled around.', 'Unrelated features failing together and then recovering points to a shared dependency, not many bugs.'] },
  { level: 'advanced', topic: 'au-flaky',
    q: "Which line makes this test flaky? 1) await page.goto('/cart'); 2) await page.getByRole('button', { name: 'Checkout' }).click(); 3) expect(page.url()).toContain('/checkout'); 4) await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();",
    options: ['Line 1', 'Line 2', 'Line 3', 'Line 4'], correct: 2,
    why: ['goto waits for the page load event by default, so it is not the timing risk.', 'click auto-waits for the button to be visible, stable, enabled and receiving events.', 'Right — page.url() is read once, possibly before navigation finishes; use <code>await expect(page).toHaveURL(/checkout/)</code> instead.', 'toBeVisible is a web-first assertion and retries.'] },
  { level: 'beginner', topic: 'au-ci',
    q: 'In a CI workflow, why use npm ci rather than npm install?',
    options: ['It installs exactly what the lockfile pins', 'It also downloads the Playwright browser binaries', 'It is the only install command that works on Linux', 'It skips devDependencies, making installs smaller'], correct: 0,
    why: ['Right — npm ci installs from package-lock.json exactly (and fails if it is out of sync), so CI matches what was tested.', 'Browsers are installed separately with npx playwright install --with-deps.', 'npm install works on Linux too; reproducibility is the reason.', 'npm ci installs devDependencies by default — and @playwright/test is usually one of them.'] },
  { level: 'advanced', topic: 'au-ci',
    q: 'A pull request from a contributor’s fork fails because QA_USER_PASSWORD is empty in the GitHub Actions run. Why?',
    options: ['The secret was deleted when the fork was created', 'GitHub Actions cannot pass environment variables', 'Secrets are only available on Windows runners', 'Forked PRs do not receive secrets by default'], correct: 3,
    why: ['Forking does not delete anything in the original repository.', 'Environment variables work fine; the value is withheld on purpose.', 'Secrets work on every runner type.', 'Right — this protects secrets from untrusted code; plan another path, such as running E2E after review or on merge.'] },
  { level: 'intermediate', topic: 'au-bdd-api-visual',
    q: "What does this API test prove? const res = await request.post('/api/cart', { data: { sku: 'SKU-1', qty: 11 } }); expect(res.status()).toBe(400);",
    options: ['That the cart page displays a clear error message', 'That the API rejects quantity 11 with a 400', 'That quantity 11 was safely saved in the database', 'That the request was sent without valid login details'], correct: 1,
    why: ['No browser is involved; the UI message needs its own check.', 'Right — a server-side boundary check the UI cannot bypass; ideally also assert the error body.', 'A 400 means the request was rejected; nothing should be saved (a GET could confirm it).', 'Missing or invalid credentials would give 401, not 400.'] },
  { level: 'advanced', topic: 'au-bdd-api-visual',
    q: 'The team’s toHaveScreenshot baselines were generated on a developer’s Mac, and CI runs on Linux. What should they do?',
    options: ['Raise the diff threshold until the CI run passes', 'Switch off visual tests in CI and run them locally', 'Regenerate baselines in the CI environment', 'Take every screenshot in headed mode instead'], correct: 2,
    why: ['A loose threshold hides real regressions.', 'Local-only visual checks are inconsistent and easy to skip.', 'Right — baselines are OS- and browser-specific; create them where the comparison runs, e.g. the same Docker image.', 'Headed versus headless is not the cause; operating-system font rendering is.'] }
  /* BANK-END */
]);

QA_CONTENT.addDrills('automation', [
  {
    id: 'au-d1', type: 'classify', level: 'intermediate',
    title: 'Robust or brittle locator?',
    prompt: 'Sort each Playwright locator: will it survive a redesign that keeps behaviour the same, or break at the first layout change?',
    categories: ['Robust', 'Brittle'],
    items: [
      { text: "page.getByRole('button', { name: 'Place order' })", cat: 0, why: 'Role plus accessible name — how users and assistive technology find the button.' },
      { text: "page.locator('#root > div:nth-child(3) > button')", cat: 1, why: 'A positional CSS path breaks as soon as a wrapper is added or elements are reordered.' },
      { text: "page.getByLabel('Email address')", cat: 0, why: 'Tied to the visible label that users read.' },
      { text: "page.locator('//div[2]/form/input[1]')", cat: 1, why: 'A positional XPath (div[2], input[1]) breaks as soon as elements are added or reordered — it is relative because it starts with //, but still tied to the exact DOM structure.' },
      { text: "page.getByTestId('cart-count')", cat: 0, why: 'An agreed <code>data-testid</code> is a stable contract that does not depend on styling.' },
      { text: "page.locator('.btn-primary-x7f3')", cat: 1, why: 'Generated or styling class names change with refactors and builds.' },
      { text: "page.getByRole('row').filter({ hasText: 'INV-1042' })", cat: 0, why: 'Scopes to one row by unique visible content.' },
      { text: "page.getByRole('button').nth(4)", cat: 1, why: 'Index-based: any new button on the page shifts the position.' }
    ]
  },
  {
    id: 'au-d2', type: 'spot', level: 'advanced',
    title: 'Spot the flaky patterns',
    prompt: 'This PeopleOps test fails now and then in CI. Select every line that makes it flaky or order-dependent.',
    lines: [
      { text: "test('manager approves a leave request', async ({ page }) => {", flaw: false, why: 'A normal test declaration.' },
      { text: "// Uses the leave request created by the 'submit leave' test that runs before this one", flaw: true, why: 'Order dependence: if the other test fails, is skipped or runs later in parallel, this one breaks. Create the request in a fixture through the API.' },
      { text: "await page.goto('/leave-requests');", flaw: false, why: 'Navigation to a relative path resolved against baseURL is fine.' },
      { text: "await page.getByRole('row').filter({ hasText: 'Asha Khan' }).getByRole('button', { name: 'Approve' }).click();", flaw: false, why: 'A scoped, role-based locator; the click auto-waits.' },
      { text: 'await page.waitForTimeout(2000);', flaw: true, why: 'A hard sleep: too short on a slow CI runner, wasted time on fast runs.' },
      { text: "expect(await page.getByRole('status').textContent()).toBe('Request approved');", flaw: true, why: "A one-off read with no retry. Use <code>await expect(page.getByRole('status')).toHaveText('Request approved')</code>." },
      { text: "expect(await page.locator('table tr').count()).toBe(4);", flaw: true, why: 'A non-retrying count with a brittle CSS selector, and it assumes exactly four rows — data from other tests changes that.' },
      { text: "await expect(page.getByRole('row').filter({ hasText: 'Asha Khan' })).toContainText('Approved');", flaw: false, why: 'A web-first assertion on meaningful state — this is the good pattern.' },
      { text: '});', flaw: false, why: 'Closes the test.' }
    ]
  },
  {
    id: 'au-d3', type: 'order', level: 'intermediate',
    title: 'Order the CI workflow steps',
    prompt: 'Put the steps of a GitHub Actions job for Playwright in the order they must run.',
    items: [
      'Check out the repository (actions/checkout)',
      'Set up Node.js (actions/setup-node)',
      'Install dependencies with npm ci',
      'Install browsers with npx playwright install --with-deps',
      'Run npx playwright test',
      'Upload the HTML report as an artifact, even if tests failed'
    ],
    explain: 'The code must be checked out first, and Node.js is needed before npm can run. <code>npm ci</code> installs <code>@playwright/test</code> at the lockfile version, which then installs its matching browsers and OS libraries. Only then can the tests run. The report upload comes last and uses <code>if: ${{ !cancelled() }}</code> so failed runs still leave evidence.'
  },
  {
    id: 'au-d4', type: 'classify', level: 'beginner',
    title: 'Which layer of the test pyramid?',
    prompt: 'Place each ShopFlow or PeopleOps check at the lowest pyramid layer it belongs to.',
    categories: ['Unit', 'Integration / API', 'E2E / UI'],
    items: [
      { text: 'calculateDiscount(120, "SAVE10") returns 108', cat: 0, why: 'One function, no browser, network or database — a unit test.' },
      { text: 'POST /api/orders with quantity 0 returns 400 and a clear error body', cat: 1, why: 'Exercises the API and its validation without a browser.' },
      { text: 'A guest searches, adds a product to the cart and pays in the real browser', cat: 2, why: 'A full user journey through the UI and every layer behind it.' },
      { text: 'The order service saves an order and the database row has status "pending"', cat: 1, why: 'Two components working together — service and database — is integration.' },
      { text: 'isValidEmail("asha@") returns false', cat: 0, why: 'A pure function with a clear input and output.' },
      { text: 'An HR admin signs in, approves leave and sees the status change on screen', cat: 2, why: 'Needs the real UI to prove the journey works end to end.' },
      { text: 'GET /api/employees/42 without a token returns 401', cat: 1, why: 'An API-level authentication check — fast and precise without a browser.' },
      { text: 'formatPrice(1234.5) returns "$1,234.50"', cat: 0, why: 'A small formatting function — test it directly.' }
    ]
  },
  {
    id: 'au-d5', type: 'fill', level: 'intermediate',
    title: 'Pick the Playwright locator method',
    prompt: 'Type the best Playwright locator method for each element (the method name is enough, for example getByText).',
    fields: [
      { label: 'A “Sign in” button', accept: ['getByRole', 'page.getByRole', 'getByRole()', 'page.getByRole()'], why: "Buttons have a role and an accessible name: <code>getByRole('button', { name: 'Sign in' })</code>." },
      { label: 'An input with the visible label “Postal code”', accept: ['getByLabel', 'page.getByLabel', 'getByLabel()', 'page.getByLabel()'], why: "<code>getByLabel('Postal code')</code> finds the input associated with that label." },
      { label: 'A search box whose only hint is the grey text “Search products” inside it', accept: ['getByPlaceholder', 'page.getByPlaceholder', 'getByPlaceholder()', 'page.getByPlaceholder()'], why: 'With no label, the placeholder is the best user-facing hook (and a hint to add a label for accessibility).' },
      { label: 'A cart badge with no text label but the attribute data-testid="cart-count"', accept: ['getByTestId', 'page.getByTestId', 'getByTestId()', 'page.getByTestId()'], why: "<code>getByTestId('cart-count')</code> reads <code>data-testid</code> by default." },
      { label: 'A paragraph that says “Your order has shipped”', accept: ['getByText', 'page.getByText', 'getByText()', 'page.getByText()'], why: 'Non-interactive text is best found with <code>getByText</code>.' },
      { label: 'A logo image with the alt text “ShopFlow”', accept: ['getByAltText', 'page.getByAltText', 'getByAltText()', 'page.getByAltText()'], why: 'Images are located by their alternative text with <code>getByAltText</code> (or <code>getByRole(\'img\', { name })</code>).' }
    ]
  }
  /* DRILLS-END */
]);
