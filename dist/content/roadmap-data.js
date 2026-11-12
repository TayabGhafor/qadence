/* SQA Practice Room · learning path content.
   Sequence, hours, exercises, evidence targets and cautions come from the two
   user-provided roadmaps: SQA_Career_Roadmap.pdf (35-page handbook) and
   SQA_Visual_Roadmap.pdf (3-page visual edition). Hours and weeks are planning
   estimates, not hiring guarantees. All practice links stay inside this site. */
window.SQA_LEARNING = (function () {
  const paces = [
    { id: 'light', label: '5–6 hours a week', lo: 5, hi: 6, total: 'about 40–58 weeks (roughly 9–12 months)' },
    { id: 'base', label: '10–12 hours a week', lo: 10, hi: 12, total: 'about 24 weeks — the roadmap baseline (240–288 hours)' },
    { id: 'intense', label: '20 hours a week', lo: 20, hi: 20, total: 'about 12–15 weeks may be feasible, but feedback and repetition still take time' }
  ];

  const labs = {
    login: 'Sign-in validation lab',
    api: 'API request console',
    checkout: 'Checkout flow lab',
    mobile: 'Mobile interruption lab',
    ui: 'UI Playground',
    bughunt: 'Bug Hunt · seeded defect'
  };

  const steps = [
    { id: 'overview', label: 'Overview' },
    { id: 'learn', label: 'Learn' },
    { id: 'see', label: 'See it' },
    { id: 'try', label: 'Try it' },
    { id: 'check', label: 'Check' },
    { id: 'wrap', label: 'Wrap up' }
  ];

  const stages = [
    /* ───────────────────────── Stage 1 ───────────────────────── */
    {
      id: 'foundations',
      title: 'Understand QA',
      tagline: 'SDLC / STLC · risk · Agile / Scrum',
      weeks: 'Weeks 1–2', hours: [20, 24],
      deliver: 'Explain how testing fits into delivery.',
      outcome: 'Explain what QA and testing do, how risk guides what you test, how testing runs through the SDLC/STLC, and what a single test result can and cannot prove.',
      prereq: 'None. Bring curiosity and a browser — no paid tools are needed.',
      learn: [
        'QA, quality control and testing; verification versus validation',
        'Error → defect → failure, and why a failed test is not always a product bug',
        'Risk-based prioritisation: impact, likelihood and exposure',
        'How the SDLC and STLC overlap, and how testing fits into Agile/Scrum',
        'Turning vague requirements into observable acceptance criteria'
      ],
      concept: [
        'Software Quality Assurance (SQA) supports confidence in how software is built and delivered. <b>QA</b> focuses on processes that help prevent problems, <b>quality control</b> evaluates outputs, and <b>testing</b> is the main evaluation activity: compare what the product does with an agreed expectation, then report what you found — including risk and uncertainty. In real teams these titles overlap.',
        '<b>Verification</b> asks “did we build it as specified?” <b>Validation</b> asks “does it meet the user’s need?” A requirements review can find a problem before any code exists. An <b>error</b> is a human mistake, a <b>defect</b> is the resulting flaw in code or a document, and a <b>failure</b> is the incorrect behaviour you observe. A failed test can also come from faulty test data or a broken environment, so investigate before blaming the product.',
        'Testing reduces uncertainty; it cannot prove defects are absent. Exhaustive testing is usually impossible, so prioritise by <b>impact</b> (how bad), <b>likelihood</b> (how probable) and <b>exposure</b> (how many people, how often). Use positive tests for valid behaviour, negative tests for invalid or unauthorised behaviour, and exploratory testing to learn beyond a script.',
        'The SDLC is the path from a need to an operating product; the STLC groups testing work: analyse requirements → plan → design cases and data → prepare the environment → execute and report defects → evaluate exit criteria and report completion. In Agile/Scrum this happens inside every sprint: ask about acceptance criteria in refinement, raise risks in planning, surface blockers at the Daily Scrum, and agree a Definition of Done with quality checks. A tester works within the team, not as a final gate.'
      ],
      roman: 'QA ka maqsad process behtar karke masail ko pehle hi rokna hai; testing product ko expected behavior se compare karke evidence deti hai. Testing yeh prove nahi kar sakti ke koi bug nahi — sirf risk aur uncertainty kam karti hai. Error insaan ki ghalti hai, defect us ka nateeja, aur failure woh ghalat behavior jo hum dekhte hain. Testing requirements ke waqt se shuru hoti hai, coding ke baad nahi.',
      visuals: [
        {
          label: 'SDLC ↔ testing activities',
          caption: 'Testing runs alongside every SDLC activity, not only after the build. Adapted from the handbook’s Phase 1 mapping.',
          html: `<table class="lv-table"><caption>What testing does at each SDLC activity</caption><thead><tr><th scope="col">SDLC activity</th><th scope="col">Testing activity</th><th scope="col">Example output</th></tr></thead><tbody>
<tr><th scope="row">Discover &amp; define</th><td>Review needs; find ambiguities and risks</td><td>Questions, acceptance criteria</td></tr>
<tr><th scope="row">Design</th><td>Review data, interfaces and testability</td><td>Risk list, test approach</td></tr>
<tr><th scope="row">Build</th><td>Design cases; prepare data; review component checks</td><td>Cases, fixtures, early feedback</td></tr>
<tr><th scope="row">Verify &amp; integrate</th><td>Execute; investigate; retest; run regression</td><td>Results, defects, traceability</td></tr>
<tr><th scope="row">Release</th><td>Summarise coverage and residual risk</td><td>Release recommendation</td></tr>
<tr><th scope="row">Operate &amp; improve</th><td>Learn from incidents and feedback</td><td>Regression additions</td></tr></tbody></table>`
        },
        {
          label: 'Error → defect → failure',
          caption: 'Follow the chain from a mistake to what a user sees — and remember that a failed test may point at the test, its data or the environment instead.',
          html: `<ol class="lv-flow"><li><b>Error</b><span>A person makes a mistake — e.g. reads “≥ 50” as “&gt; 50”.</span></li><li><b>Defect</b><span>The flaw lands in code or a document — the discount check uses &gt; 50.</span></li><li><b>Failure</b><span>Observed wrong behaviour — a cart of exactly 50 gets no discount.</span></li></ol>
<div class="lv-aside"><b>Before you call it a product failure, rule out:</b><ul><li>Wrong or deleted test data</li><li>An environment or dependency that was down</li><li>A mistake in the test itself (wrong expected value, broken locator)</li></ul></div>`
        },
        {
          label: 'Risk: impact × likelihood',
          caption: 'Spend your limited time where impact and likelihood are both high. Exposure (how many users, how often) moves an item up.',
          html: `<div class="lv-quad" role="group" aria-label="Risk grid with four examples"><div class="lv-axis-y">Impact ↑</div><div class="lv-cell hi"><b>Test first</b><span>Checkout double-charges after a retry (high impact, likely)</span></div><div class="lv-cell mid"><b>Test early</b><span>Password reset link never expires (high impact, less likely)</span></div><div class="lv-cell mid"><b>Plan coverage</b><span>Search shows stale results after edits (lower impact, likely)</span></div><div class="lv-cell lo"><b>Test if time allows</b><span>Footer spacing is 2px off (low impact, low likelihood)</span></div><div class="lv-axis-x">Likelihood →</div></div>`
        }
      ],
      example: {
        title: 'From vague to testable',
        html: `<p><b>Vague:</b> “Checkout should work.” <b>Testable acceptance criterion:</b> Given an in-stock item costing 1,000 minor currency units and quantity 2, when the buyer submits a valid order, then the order contains two units, its item subtotal is 2,000 and stock decreases by two. Shipping, taxes and currency precision need separate rules.</p>
<p><b>Another vague one:</b> “The system should be fast.” Ask: which user action, under what load, on which environment, measured how, against what target? Record unanswered questions as assumptions or risks — never invent the requirement.</p>`
      },
      codes: [
        {
          label: 'Acceptance criteria (Given / When / Then)',
          lang: 'gherkin',
          note: 'Edit this into criteria for a feature you know. A good “Then” describes something you can observe and measure.',
          text: `Feature: Place an order

  Scenario: Valid order reduces stock
    Given item "SKU-01" costs 1000 minor units and has stock 5
    And buyer A is signed in
    When buyer A orders quantity 2
    Then the order contains 2 units
    And the item subtotal is 2000
    And the stock for "SKU-01" is 3`,
          checks: [
            { label: 'Has Given, When and Then steps', re: /\bgiven\b[\s\S]*\bwhen\b[\s\S]*\bthen\b/i },
            { label: 'A “Then” line contains a number you can check', re: /\bthen\b[^\n]*\d/i },
            { label: 'Avoids vague outcomes such as “works”, “properly” or “fast”', re: /\b(then|and)\b[^\n]*\b(works?|properly|correctly|fast|nice|good)\b/i, invert: true }
          ]
        }
      ],
      task: {
        title: 'Five risks for one sign-in screen',
        steps: [
          'Open the Sign-in validation lab (built into this site).',
          'Write five user risks for the login feature, e.g. “a valid user is locked out” or “an error message reveals whether an email is registered”.',
          'For each risk write one test with an observable expected result, then try it in the lab using the scenario chips or your own input.',
          'Record expected versus actual for each, and one thing your checks cannot prove (for example, behaviour on another browser).'
        ],
        lab: 'login', challenge: 'peopleops-login'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'A test passes in Chrome on your laptop. What is the strongest accurate conclusion?',
          options: [
            { t: 'The feature has no defects.', why: 'Testing reduces uncertainty; it cannot prove that defects are absent.' },
            { t: 'The release is safe for every user.', why: 'Other browsers, data, roles and environments were not checked, so this overstates the evidence.' },
            { t: 'The checked behaviour matched the expectation in that browser, build and data.', why: 'Right — a result supports exactly what was checked, in that setup. Say so, and name what was not covered.' }
          ],
          correct: 2
        },
        {
          level: 'Starter',
          q: 'A checkout test fails because its test account was deleted overnight. What kind of problem is this most likely?',
          options: [
            { t: 'A test data / environment problem to investigate and report as such.', why: 'Right — the product did not violate an expectation; the test lost its precondition. Fix the data and say the run did not establish product quality.' },
            { t: 'A product defect in checkout.', why: 'There is no evidence the product behaved wrongly — the test’s data was missing. That is an assumption, not evidence.' },
            { t: 'Proof that a developer made an error.', why: 'An error is a human mistake that leads to a defect. A missing account says nothing about the code.' }
          ],
          correct: 0
        },
        {
          level: 'Interview',
          q: 'A product owner says “search should be fast.” What should you do first?',
          options: [
            { t: 'Write a test asserting search returns in under one second.', why: 'That invents a requirement. The number may be wrong for the user, the load or the environment.' },
            { t: 'Ask which action, load, environment, measurement and target they mean, and record open points as assumptions or risks.', why: 'Right — turn a vague need into an observable criterion, and keep unanswered questions visible instead of guessing.' },
            { t: 'Skip it — performance is not QA’s job.', why: 'Non-functional qualities such as performance are part of quality and need observable expectations too.' }
          ],
          correct: 1
        }
      ],
      myths: [
        { myth: 'QA means testing at the end.', fact: 'Testing starts at requirements. A review can find a problem before code exists, which is the cheapest time to fix it.' },
        { myth: 'A passing test proves there are no bugs.', fact: 'It shows one example behaved as expected in one setup. State the scope of your evidence.' },
        { myth: 'Every failed test is a product bug.', fact: 'Check test data, environment and the test itself first. Report what the evidence supports, not what you assume.' }
      ],
      tips: [
        'Explain concepts using one feature you know well, such as login or a cart, instead of reciting definitions.',
        'When a requirement is vague, write questions — not invented answers.',
        'Separate evidence (“I saw X on build 0.3 in Firefox”) from assumptions (“it probably works on Safari”).'
      ],
      evidence: [
        'A one-page concept map and a 15-term glossary written in your own words',
        'A simple SDLC/STLC mapping',
        'A questions log plus six acceptance criteria rewritten from vague requirements'
      ],
      gate: 'You can explain a test result, its limitation and the user risk — without reciting a definition.',
      next: { challenges: ['peopleops-login'], labs: ['login'], interview: { track: 'manual', ids: ['m1', 'm6'] } },
      source: 'Career Roadmap pp. 5–6 (Phase 1) and p. 33 (Agile/Scrum); Visual Roadmap p. 1.'
    },

    /* ───────────────────────── Stage 2 ───────────────────────── */
    {
      id: 'manual',
      title: 'Practise manual testing',
      tagline: 'Requirements → cases → execution → bugs',
      weeks: 'Weeks 3–6', hours: [40, 48],
      deliver: '20 test cases + 5 clear bug reports (Visual Roadmap minimum).',
      outcome: 'Plan and prioritise a small test cycle, design cases with proven techniques, execute them honestly, and write defect reports another person can reproduce.',
      prereq: 'Stage 1 — risk and acceptance criteria.',
      learn: [
        'A one-page test plan: scope, risks, approach, entry and exit criteria; traceability',
        'Equivalence partitioning and boundary value analysis',
        'Decision tables and state transitions (and pairwise for many options)',
        'Exploratory testing with a timed charter',
        'Smoke vs sanity vs retest (confirmation) vs regression',
        'Reproducible defect reports; severity vs priority'
      ],
      concept: [
        'A useful <b>test plan</b> explains what you will evaluate, why it matters, and what will remain uncertain — one or two pages is enough for a small project. Rank risks by business impact and likelihood: double charging matters more than a spacing glitch. A <b>traceability matrix</b> links requirements to tests, results and defects so gaps are visible (a link alone does not prove a requirement was adequately tested).',
        'Design techniques help you choose a few powerful examples. <b>Equivalence partitioning</b> groups inputs expected to behave alike. <b>Boundary value analysis</b> tests the edges, where off-by-one mistakes live. <b>Decision tables</b> cover combinations of business conditions. <b>State transitions</b> check allowed and forbidden moves in a workflow. <b>Exploratory testing</b> uses a timed charter to learn and investigate.',
        'Execute with a routine: record build, environment, account role and data; run <b>smoke</b> checks first to confirm the build is testable; then record each case as Pass, Fail, Blocked or Not run — a blocked test is never a pass. <b>Retesting</b> (confirmation) repeats the exact reproduction after a fix; <b>regression testing</b> looks for unintended effects in related areas.',
        'A <b>defect report</b> lets someone else reproduce the problem and judge impact: title, environment and build, preconditions, numbered steps, expected versus actual, frequency (e.g. 3 of 3), impact and evidence. <b>Severity</b> describes impact; <b>priority</b> describes when the team should address it — agreed in triage. A developer marking a fix complete is not the same as independent confirmation.'
      ],
      roman: 'Test plan batata hai kya test karna hai, kyun, aur kya risk baqi hai. Boundary testing mein limit ke bilkul paas wali values (0, 1, 10, 11) check karte hain. Decision table conditions ke combinations cover karti hai. Retest sirf fix hua bug dobara check karta hai; regression dekhta hai ke change ne kuch aur to nahi toda. Severity = impact, priority = kab fix karna hai. Blocked test kabhi pass nahi hota.',
      visuals: [
        {
          label: 'Boundary values · quantity 1–10',
          caption: 'Three partitions (below, valid, above) and the six values a three-value boundary approach picks. Also try non-integer and missing input.',
          html: `<div class="lv-boundary"><div class="lv-parts" aria-hidden="true"><span class="bad">Invalid: below 1</span><span class="ok">Valid partition: 1–10</span><span class="bad">Invalid: above 10</span></div>
<table class="lv-table lv-points"><caption>Boundary test values for an allowed quantity of 1 to 10</caption><thead><tr><th scope="col">Input</th><th scope="col">Partition</th><th scope="col">Expected</th></tr></thead><tbody>
<tr class="bad"><td><b>0</b></td><td>Below the range</td><td>✕ Rejected with a clear message</td></tr>
<tr class="ok"><td><b>1</b></td><td>Lower edge</td><td>✓ Accepted</td></tr>
<tr class="ok"><td><b>2</b></td><td>Just inside</td><td>✓ Accepted</td></tr>
<tr class="ok"><td><b>9</b></td><td>Just inside</td><td>✓ Accepted</td></tr>
<tr class="ok"><td><b>10</b></td><td>Upper edge</td><td>✓ Accepted</td></tr>
<tr class="bad"><td><b>11</b></td><td>Above the range</td><td>✕ Rejected; cart quantity unchanged</td></tr></tbody></table>
<p class="lv-note">Also: 1.5 (non-integer), empty (missing), “abc” (wrong type).</p></div>`
        },
        {
          label: 'Decision table · free delivery',
          caption: 'Rule: free delivery only if the buyer is a member AND the subtotal is at least 50. Four combinations, four tests.',
          html: `<table class="lv-table lv-decision"><caption>Free delivery decision table</caption><thead><tr><th scope="col">Rule</th><th scope="col">Member?</th><th scope="col">Subtotal ≥ 50?</th><th scope="col">Free delivery?</th></tr></thead><tbody>
<tr><th scope="row">R1</th><td>Yes</td><td>Yes</td><td class="yes">✓ Yes</td></tr>
<tr><th scope="row">R2</th><td>Yes</td><td>No</td><td class="no">✕ No</td></tr>
<tr><th scope="row">R3</th><td>No</td><td>Yes</td><td class="no">✕ No</td></tr>
<tr><th scope="row">R4</th><td>No</td><td>No</td><td class="no">✕ No</td></tr></tbody></table>
<p class="lv-note">Combine with boundaries: test R1 and R3 at exactly 50 and at 49.99.</p>`
        },
        {
          label: 'State transitions · order status',
          caption: 'Test the allowed moves and prove the forbidden ones are rejected without changing the order.',
          html: `<div class="lv-states" aria-hidden="true"><span class="node">Draft</span><span class="edge">pay ✓</span><span class="node">Paid</span><span class="edge">ship ✓</span><span class="node">Shipped</span></div>
<table class="lv-table"><caption>Order status transitions to test</caption><thead><tr><th scope="col">From → to</th><th scope="col">Expected</th></tr></thead><tbody>
<tr><td>Draft → Paid</td><td class="yes">✓ Allowed</td></tr>
<tr><td>Paid → Shipped</td><td class="yes">✓ Allowed</td></tr>
<tr><td>Shipped → Draft</td><td class="no">✕ Rejected; status stays Shipped</td></tr>
<tr><td>Draft → Shipped</td><td class="no">✕ Rejected; cannot skip payment</td></tr></tbody></table>`
        },
        {
          label: 'Severity vs priority',
          caption: 'Severity is impact; priority is urgency. They often differ — the team agrees both in triage.',
          html: `<div class="lv-quad" role="group" aria-label="Severity and priority examples"><div class="lv-axis-y">Severity (impact) ↑</div><div class="lv-cell hi"><b>High severity · high priority</b><span>Checkout creates two orders after a double click.</span></div><div class="lv-cell mid"><b>High severity · lower priority</b><span>Rare data loss with a verified temporary workaround.</span></div><div class="lv-cell mid"><b>Low severity · high priority</b><span>Company name misspelled on the launch page before a campaign.</span></div><div class="lv-cell lo"><b>Low severity · low priority</b><span>Footer spacing slightly uneven.</span></div><div class="lv-axis-x">Priority (urgency) →</div></div>`
        }
      ],
      example: {
        title: 'A concrete case and a reproducible bug',
        html: `<p><b>TC-CART-04 · Reject quantity above the maximum.</b> Requirement CART-02. Preconditions: signed-in buyer; item available; documented maximum 10. Data: quantity 11. Steps: open item, set quantity to 11, try to add it. Expected: an actionable validation message appears and the cart quantity does not increase. Also check the rule through the API — a disabled UI control alone does not enforce a business rule.</p>
<p><b>BUG-07 · Checkout creates two orders after a double click.</b> Environment: local learning app, build 0.3, Chromium, buyer account A. Preconditions: stock 5, cart quantity 1. Steps: open checkout; complete required fields; double-click Place order. Expected: one order (REQ-03). Actual: two order IDs; stock drops to 3. Reproduced 3 of 3. Impact: duplicate fulfilment. Proposed severity: high; priority agreed in triage. Evidence: redacted recording and request IDs.</p>`
      },
      codes: [
        {
          label: 'Test case (edit into your own)',
          lang: 'text',
          note: 'A peer should be able to run this without guessing the expected result. Keep IDs stable so you can trace them.',
          text: `TC-CART-04 | Reject quantity above the maximum
Requirement: CART-02 (quantity must be 1–10)
Priority: High — prevents invalid orders
Preconditions: signed-in buyer; item in stock; maximum quantity 10
Test data: quantity = 11
Steps:
  1. Open the item page
  2. Set quantity to 11
  3. Select "Add to cart"
Expected: an actionable validation message appears
          and the cart quantity does not increase
Actual: (record during execution)
Build / browser / status / evidence: (record during execution)`,
          checks: [
            { label: 'Has a stable ID such as TC-…', re: /\bTC-[A-Z0-9-]+/i },
            { label: 'Links to a requirement', re: /requirement|REQ-|CART-\d/i },
            { label: 'Lists preconditions or test data', re: /precondition|test data|data:/i },
            { label: 'Has numbered steps', re: /^\s*\d+[.)]\s+\S/m },
            { label: 'States an observable expected result', re: /expected\s*:?\s*\S/i }
          ]
        }
      ],
      task: {
        title: 'Reproduce and report the seeded discount defect',
        steps: [
          'Open Bug Hunt. The cart has $48.00 of merchandise and $6.00 shipping; promo SAVE10 is meant to discount merchandise only.',
          'Select “Recalculate cart” to reproduce the problem and note the displayed discount and total.',
          'Write a report: title, environment, preconditions, numbered steps, expected (10% of $48 = $4.80), actual ($5.40), frequency, user impact and a proposed severity. Label it as a seeded defect.',
          'Then build a decision table for the coupon rule (member? subtotal ≥ 50? before expiry?) in your notes and list the boundary values you would test.'
        ],
        lab: 'bughunt', challenge: 'bug-report'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'Quantity is valid from 1 to 10 (whole numbers). Which set best applies three-value boundary analysis?',
          options: [
            { t: '1, 5, 10', why: 'This misses the invalid neighbours 0 and 11 and the just-inside values 2 and 9.' },
            { t: '0, 1, 2, 9, 10, 11', why: 'Right — each edge plus its neighbour on both sides. Off-by-one mistakes show up here.' },
            { t: '−100, 50, 1000', why: 'These are far from the edges, so they rarely reveal off-by-one defects.' }
          ],
          correct: 1
        },
        {
          level: 'Starter',
          q: 'After a fix, you repeat the exact steps from the original bug report. What is this called?',
          options: [
            { t: 'Regression testing', why: 'Regression looks for unintended effects in related areas. It usually follows the retest.' },
            { t: 'Smoke testing', why: 'Smoke testing is a quick check that a build is testable at all.' },
            { t: 'Retesting (confirmation testing)', why: 'Right — confirm the specific fix with the original reproduction, then run targeted regression nearby.' }
          ],
          correct: 2
        },
        {
          level: 'Interview',
          q: 'The company name is misspelled on the launch page the day before a marketing campaign. How would you classify it?',
          options: [
            { t: 'Low severity, high priority — little functional impact but urgent for the business; agree it in triage.', why: 'Right — severity is impact, priority is urgency. Business timing makes a low-impact defect urgent.' },
            { t: 'Critical severity, because everyone will see it.', why: 'Visibility is not the same as impact on function or data. Keep the two scales separate.' },
            { t: 'Low priority, because it is only text.', why: 'Timing matters: a launch-day typo can be very urgent even though it is technically minor.' }
          ],
          correct: 0
        }
      ],
      myths: [
        { myth: 'More test cases means better coverage.', fact: 'Purposeful cases beat near-duplicates. A small data table can express the same coverage.' },
        { myth: 'Retest and regression are the same thing.', fact: 'A retest confirms one fix; regression checks for side effects in related behaviour.' },
        { myth: 'Severity and priority always match.', fact: 'Impact and urgency differ. The team agrees both in triage — QA informs, it does not decide alone.' },
        { myth: 'A disabled button enforces the rule.', fact: 'Also test the server-side behaviour through the API; UI controls alone do not enforce business rules.' }
      ],
      tips: [
        'Use neutral, observable language in bug reports. Include a workaround only if you verified it.',
        'Record Pass, Fail, Blocked or Not run honestly — never count blocked tests as passes.',
        'If the expected behaviour is unclear, raise a requirement question instead of logging a defect.'
      ],
      evidence: [
        'A one-page plan, risk register and traceability matrix',
        'Purposeful cases linked to requirements — the Visual Roadmap’s minimum is 20; the handbook suggests 25–35 — including a boundary table, a decision table and one state model',
        'Two 30-minute exploratory charters with notes',
        'An execution log and a one-page completion report',
        'Reproducible bug reports (Visual Roadmap: 5; handbook exercise: 3) — label seeded or simulated defects honestly'
      ],
      gate: 'A peer could execute your cases without guessing the expected outcome, and another person can reproduce each defect.',
      next: { challenges: ['bug-report'], labs: ['bughunt', 'checkout'], interview: { track: 'manual', ids: ['m5', 'm2', 'm3', 'm4'] } },
      source: 'Career Roadmap pp. 7–10 (Phase 2); Visual Roadmap pp. 1–2.'
    },

    /* ───────────────────────── Stage 3 ───────────────────────── */
    {
      id: 'web-mobile',
      title: 'Test web and mobile',
      tagline: 'DevTools · browsers · responsive layouts',
      weeks: 'Weeks 7–8', hours: [20, 24],
      deliver: 'A device / browser test checklist.',
      outcome: 'Choose a practical browser and device matrix, check responsive layout, keyboard and touch, test mobile states such as network loss, permissions and interruptions, and explain the limits of emulation.',
      prereq: 'Stage 2 — writing cases and exploratory charters.',
      learn: [
        'Client/server basics, browser storage, cookies and sessions; DevTools elements, console and network',
        'A compatibility matrix: browser engines, viewports, a real device, network and state',
        'Keyboard and touch; zoom and reflow; no unintended horizontal scrolling',
        'Mobile web versus native apps: keyboard covering inputs, orientation, install/upgrade, permissions, background/resume, interruptions, offline',
        'What emulation can and cannot prove'
      ],
      concept: [
        'Learn basic HTML structure, CSS layout, browser storage, cookies, sessions and the client/server model. Use browser <b>DevTools</b> to inspect elements, console errors and network requests. The UI, API and database can disagree — DevTools helps you find which layer is wrong.',
        'Coverage is a choice, not “test every device”. Build a <b>compatibility matrix</b> from support policy and audience data: browser engines (Chromium, Firefox, WebKit), viewports (for example 360, 768 and 1440 CSS pixels plus nearby breakpoints), at least one real Android or iOS device, and network/state conditions such as slow or offline connections, refresh and session expiry. Record actual versions and list untested combinations.',
        'Mobile testing goes beyond a small screen. On mobile web, check the virtual keyboard hiding controls, tap behaviour, portrait/landscape, scrolling and poor connectivity. For native apps, add install and upgrade, permission denial, background/resume, incoming interruptions, local storage and offline sync. Ask: what state should survive, and can the user recover without duplicates?',
        '<b>Emulation helps coverage, but it does not prove behaviour on real mobile hardware or in the Safari app.</b> Also separate a <b>browser issue</b> (one engine behaves differently) from a <b>responsive issue</b> (layout breaks at a width in every browser).'
      ],
      roman: 'Har device test karna mumkin nahi — support policy aur users ke data se matrix banayein: browsers, screen widths, kam az kam ek real device, aur network/state. Mobile mein keyboard, orientation, permission deny, background/resume aur offline recovery check karein. Emulator breadth deta hai lekin real hardware ya Safari app ka saboot nahi. Browser issue aur responsive issue ka farq samjhein.',
      visuals: [
        {
          label: 'Starter compatibility matrix',
          caption: 'A starting matrix from the handbook. Choose the final one from your product’s support policy and audience data.',
          html: `<table class="lv-table"><caption>Compatibility matrix: dimension, starter coverage, what to investigate</caption><thead><tr><th scope="col">Dimension</th><th scope="col">Starter coverage</th><th scope="col">What to investigate</th></tr></thead><tbody>
<tr><th scope="row">Browser</th><td>Chromium, Firefox and WebKit engines</td><td>Forms, navigation, storage, layout</td></tr>
<tr><th scope="row">Viewport</th><td>360, 768 and 1440 CSS px; nearby breakpoints</td><td>Overflow, wrapping, menus, touch targets</td></tr>
<tr><th scope="row">Real device</th><td>At least one available Android or iOS device</td><td>Touch, keyboard, orientation, interruptions</td></tr>
<tr><th scope="row">Network &amp; state</th><td>Slow/offline connection; refresh; session expiry</td><td>Recovery, duplicate submission, stale data</td></tr></tbody></table>`
        },
        {
          label: 'App lifecycle and recovery',
          caption: 'Each arrow is a test idea: interrupt the app, then verify what survives and whether the user can recover safely.',
          html: `<table class="lv-table"><caption>Interruptions and what to verify on return</caption><thead><tr><th scope="col">Interruption</th><th scope="col">What should happen on return</th></tr></thead><tbody>
<tr><td>Foreground → background (call, app switch) → resume</td><td>Same step and entered data, or a clear timeout message</td></tr>
<tr><td>Background → OS reclaims the app → relaunch</td><td>Draft restored, or the user is told what was lost</td></tr>
<tr><td>Online → offline → online during upload</td><td>Progress resumes or retries clearly; the file is saved exactly once</td></tr>
<tr><td>Permission denied → enabled in system settings</td><td>Guidance and a safe alternative, then the feature works after return</td></tr>
<tr><td>Portrait ↔ landscape mid-form</td><td>No lost input; controls stay reachable</td></tr></tbody></table>`
        },
        {
          label: 'Emulation vs a real device',
          caption: 'Use both: emulation for breadth and repeatability, real devices for what hardware and real conditions change.',
          html: `<div class="lv-compare"><div><b>Emulation / DevTools is good for</b><ul><li>Layout at many widths and zoom levels</li><li>Throttled or offline network</li><li>Quick, repeatable checks of many combinations</li></ul></div><div><b>Needs a real device</b><ul><li>Camera, sensors and other hardware</li><li>Real interruptions and OS behaviour</li><li>Performance and battery on real hardware</li><li>Safari app and virtual keyboard quirks</li></ul></div></div>`
        }
      ],
      example: {
        title: 'Browser issue or responsive issue?',
        html: `<p><b>Case A:</b> the date picker fails in Firefox at every width, but works in Chromium and WebKit → a <b>browser issue</b>. <b>Case B:</b> the Pay button is pushed off-screen at 360 px in all three engines → a <b>responsive issue</b>.</p>
<p><b>Photo upload coverage:</b> a current and an older supported OS on Android and iOS; denied camera permission, then enabled in settings; offline mid-upload; background and resume; a narrow viewport. Record versions and device models, and list what you did not test.</p>`
      },
      codes: [
        {
          label: 'Exploratory charter (edit into your own)',
          lang: 'text',
          note: 'Charter format from the handbook: Explore [target] with [conditions] to discover [risks]. Keep it timeboxed.',
          text: `Charter: Explore photo upload with network loss, backgrounding
and permission changes to discover lost progress, duplicate uploads
or unclear recovery messages.
Timebox: 30 minutes
Setup: Mobile interruption lab · simulated phone · upload at 64%

Ideas to try:
  - Network off, then on → does progress resume exactly once?
  - App to background during upload → what state on return?
  - Photo permission denied → guidance and a safe alternative?

Notes:
Findings (evidence / issue IDs):
Untested / follow-up:`,
          checks: [
            { label: 'Names what to explore', re: /\bexplore\b/i },
            { label: 'States the risks to discover', re: /to discover/i },
            { label: 'Has a timebox', re: /timebox\s*:?\s*\d+/i },
            { label: 'Leaves room for what remains untested', re: /untested|follow-up|remaining/i }
          ]
        }
      ],
      task: {
        title: 'Interrupt an upload and verify recovery',
        steps: [
          'Open the Mobile interruption lab. Note the normal state: upload in progress, network on, app in foreground, permission granted.',
          'Run three recovery checks: network off → resume; app to background → resume; photo permission off → resume. Record what the screen says each time.',
          'For each, write expected versus actual and whether the upload could be duplicated.',
          'Then open the UI Playground, narrow your browser window (or zoom to 200%) and complete the form with the keyboard only. Note anything that overflows or becomes unreachable.'
        ],
        lab: 'mobile', challenge: 'mobile-resume'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'Which statement about mobile emulation is accurate?',
          options: [
            { t: 'It widens layout and network coverage, but real devices are still needed for hardware, real interruptions and Safari app behaviour.', why: 'Right — emulation is great for breadth and repeatability; it does not prove real-device behaviour.' },
            { t: 'It proves camera and sensor behaviour.', why: 'Emulators approximate hardware; sensors and cameras can behave differently on a physical phone.' },
            { t: 'If every width passes in the emulator, real-device testing is unnecessary.', why: 'Widths are only one dimension. Interruptions, performance and the Safari app still need real devices.' }
          ],
          correct: 0
        },
        {
          level: 'Starter',
          q: 'The Pay button is pushed off-screen at 360 px wide in Chrome, Firefox and Safari. What kind of issue is it most likely?',
          options: [
            { t: 'A browser compatibility issue', why: 'It happens in all three engines, so the engine is not the variable — the width is.' },
            { t: 'A network issue', why: 'Network conditions affect loading and recovery, not where a button is laid out.' },
            { t: 'A responsive layout issue', why: 'Right — the layout breaks at a narrow width regardless of engine.' }
          ],
          correct: 2
        },
        {
          level: 'Interview',
          q: 'A user loses connection while uploading a photo, then reconnects. What is the most important thing to verify?',
          options: [
            { t: 'That an error toast appears.', why: 'A message helps, but it does not show whether the upload recovers or duplicates.' },
            { t: 'That progress resumes or retries clearly and the photo is saved exactly once.', why: 'Right — recovery plus duplicate prevention is the user-impacting risk. Verify the final state, not just the message.' },
            { t: 'That the app silently restarts the upload from zero.', why: 'Silent restarts can waste data and create duplicates, and the user is not told what happened.' }
          ],
          correct: 1
        }
      ],
      myths: [
        { myth: 'You must test every device.', fact: 'Choose a representative matrix from support policy and audience data, and list the untested combinations.' },
        { myth: 'Responsive testing means shrinking the window once.', fact: 'Check breakpoints, zoom and reflow, orientation, touch targets and the virtual keyboard.' },
        { myth: 'If it works in the emulator, it works on the phone.', fact: 'Emulation does not prove real hardware or Safari app behaviour.' }
      ],
      tips: [
        'Record real browser versions, operating systems and device models — “latest Chrome” is not evidence.',
        'Use DevTools throttling for slow and offline checks, then confirm critical paths on a real device.',
        'Start revisiting internship listings now to learn what they ask for.'
      ],
      evidence: [
        'A compatibility report with screenshots, versions and explicit untested combinations',
        'An exploratory charter for offline recovery and another for mobile form entry'
      ],
      gate: 'You can explain a browser issue versus a responsive issue and state the limits of emulation.',
      next: { challenges: ['mobile-resume'], labs: ['mobile', 'ui'], interview: { track: 'mobile', ids: ['d1', 'd2', 'd3', 'd6'] } },
      source: 'Career Roadmap p. 11 (Phase 3); Visual Roadmap p. 1.'
    },

    /* ───────────────────────── Stage 4 ───────────────────────── */
    {
      id: 'sql-api',
      title: 'Connect API and database',
      tagline: 'Postman · HTTP / JSON · SQL joins',
      weeks: 'Weeks 9–12', hours: [40, 48],
      deliver: 'API checks + matching SQL evidence.',
      outcome: 'Verify an API contract — methods, status, headers, schema, authentication, negative and ownership cases — and confirm what was stored with safe, read-only SQL instead of trusting a status code.',
      prereq: 'Stage 2 test design and Stage 3 DevTools network basics.',
      learn: [
        'SQL in order: SELECT/WHERE → ORDER BY/LIMIT → COUNT/SUM → GROUP BY/HAVING → INNER and LEFT JOIN → NULL → constraints → transactions',
        'Integrity checks: duplicates, orphaned records, invalid NULLs, mismatched totals',
        'HTTP methods, status codes, headers, JSON schema; authentication versus authorization',
        'Negative and ownership cases; create → read → update → read → delete → verify',
        'Postman collections, environments and assertions — without leaking tokens',
        'Verifying persistence instead of trusting a status code (and why a mock proves less)'
      ],
      concept: [
        'SQL lets you check what was actually stored. Learn in this order: SELECT and WHERE → ORDER BY and LIMIT → COUNT and SUM → GROUP BY and HAVING → INNER JOIN and LEFT JOIN → NULL handling → constraints → basic transactions. <b>Practise INSERT and UPDATE only in your own disposable local database; use read-only access for verification anywhere else.</b>',
        'An <b>INNER JOIN</b> keeps only matching rows; a <b>LEFT JOIN</b> also keeps unmatched rows from the left table — which is how you find orders with no items. Integrity questions: does one successful action produce the expected row and relationships? Do rejected operations leave data unchanged? Are duplicates, orphans, invalid NULLs and wrong totals prevented?',
        'An API is a contract. GET reads; POST commonly creates; PUT replaces a representation; PATCH applies a partial change; DELETE removes — always confirm against the API’s own contract. Check status, schema and types, required fields, values, headers and business effect. Then go negative: missing fields, invalid values, missing or expired credentials, another user’s resource, and nonexistent IDs.',
        '<b>Authentication</b> establishes who you are — a 401 generally means missing or invalid credentials. <b>Authorization</b> decides what you may do — a 403 indicates refusal (some APIs return 404 to avoid revealing a resource exists; check the contract). <b>A 201 is evidence, not proof:</b> confirm with a follow-up GET or a read-only query. A mock response tests how the client handles a response; it never proves persistent storage.'
      ],
      roman: 'SQL se check karte hain ke data waqai save hua. INNER JOIN sirf matching rows deta hai; LEFT JOIN left table ki unmatched rows bhi rakhta hai. API ek contract hai: method, status, headers, schema aur business effect check karein. 401 = pehchan (authentication) ka masla, 403 = ijazat (authorization) nahi. Sirf 201 dekh kar yaqeen na karein — GET ya read-only query se persistence verify karein. Mock response storage ka saboot nahi. Token kabhi export mein na daalein.',
      visuals: [
        {
          label: 'Status is evidence, not proof',
          caption: 'Follow one order from request to stored data. Each step adds independent evidence.',
          html: `<ol class="lv-flow"><li><b>Request</b><span>POST /orders · quantity 2 · buyer A’s token</span></li><li><b>Response</b><span>201 + body with an order ID and quantity 2</span></li><li><b>Read again</b><span>GET /orders/{id} returns the same values</span></li><li><b>Stored data</b><span>Read-only SELECT shows one row owned by buyer A; stock reduced by 2</span></li></ol>`
        },
        {
          label: 'INNER vs LEFT JOIN',
          caption: 'Order 103 has no items. INNER JOIN hides it; LEFT JOIN keeps it with NULL item columns — so you can detect it.',
          html: `<div class="lv-joins"><table class="lv-table"><caption>orders</caption><thead><tr><th scope="col">id</th></tr></thead><tbody><tr><td>101</td></tr><tr><td>102</td></tr><tr><td>103</td></tr></tbody></table>
<table class="lv-table"><caption>order_items</caption><thead><tr><th scope="col">order_id</th><th scope="col">qty</th></tr></thead><tbody><tr><td>101</td><td>2</td></tr><tr><td>101</td><td>1</td></tr><tr><td>102</td><td>1</td></tr></tbody></table>
<table class="lv-table"><caption>INNER JOIN → 3 rows</caption><thead><tr><th scope="col">id</th><th scope="col">qty</th></tr></thead><tbody><tr><td>101</td><td>2</td></tr><tr><td>101</td><td>1</td></tr><tr><td>102</td><td>1</td></tr></tbody></table>
<table class="lv-table"><caption>LEFT JOIN → 4 rows</caption><thead><tr><th scope="col">id</th><th scope="col">qty</th></tr></thead><tbody><tr><td>101</td><td>2</td></tr><tr><td>101</td><td>1</td></tr><tr><td>102</td><td>1</td></tr><tr class="bad"><td>103</td><td>NULL</td></tr></tbody></table></div>`
        },
        {
          label: '401 vs 403 vs 404',
          caption: 'Who you are (authentication) is checked before what you may do (authorization). Always confirm the exact codes in the API contract.',
          html: `<table class="lv-table"><caption>Typical responses for GET /orders/A1 (an order owned by buyer A)</caption><thead><tr><th scope="col">Request</th><th scope="col">Typical status</th><th scope="col">What it tests</th></tr></thead><tbody>
<tr><td>No token, or an expired token</td><td>401</td><td>Authentication — who are you?</td></tr>
<tr><td>Buyer B’s valid token</td><td>403 (or 404 by policy)</td><td>Authorization — B may not see A’s order</td></tr>
<tr><td>Buyer A’s token</td><td>200</td><td>Happy path — owner can read it</td></tr>
<tr><td>Buyer A’s token, nonexistent ID</td><td>404</td><td>Resource does not exist</td></tr></tbody></table>`
        }
      ],
      example: {
        title: 'Find mismatched totals — read-only',
        html: `<p>Assume <code>orders(id, user_id, total_minor)</code> and <code>order_items(order_id, quantity, unit_price_minor)</code>, a simplified fixture with no taxes, shipping or discounts. The query in the editor finds orders whose stored total differs from the sum of their items. <b>Expected for a consistent seeded fixture: zero rows</b> — which is evidence for that fixture, not proof about all data. Use a LEFT JOIN separately to find orders without items, because an INNER JOIN omits them.</p>
<p>In Postman, keep the base URL in an environment variable, generate test data, add post-response assertions, and run the collection repeatedly to confirm it resets its own data. Export only sanitized examples — never tokens.</p>`
      },
      codes: [
        {
          label: 'SQL · orders with mismatched totals',
          lang: 'sql',
          note: 'Read-only verification query from the handbook. Expected on a consistent fixture: zero rows.',
          text: `SELECT o.id, o.total_minor,
       SUM(i.quantity * i.unit_price_minor) AS item_total
FROM orders o
JOIN order_items i ON i.order_id = o.id
GROUP BY o.id, o.total_minor
HAVING o.total_minor <>
       SUM(i.quantity * i.unit_price_minor);`,
          checks: [
            { label: 'Starts with SELECT (read-only)', re: /^\s*(--[^\n]*\n\s*)*select\b/i },
            { label: 'No data-changing statements (INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE)', re: /\b(insert|update|delete|drop|alter|truncate)\b/i, invert: true },
            { label: 'Groups rows before comparing totals', re: /group\s+by/i },
            { label: 'Uses HAVING to filter on the aggregate', re: /\bhaving\b/i }
          ]
        },
        {
          label: 'SQL · your turn: orders with no items',
          lang: 'sql',
          note: 'Complete this so it lists orders that have no rows in order_items. Hint: LEFT JOIN, then filter where the item side IS NULL.',
          text: `-- Find orders that have no items.
-- An INNER JOIN would hide them, so start from orders.
SELECT o.id
FROM orders o
`,
          checks: [
            { label: 'Uses a LEFT JOIN from orders to order_items', re: /left\s+(outer\s+)?join\s+order_items/i },
            { label: 'Filters with IS NULL (not “= NULL”)', re: /\bis\s+null\b/i },
            { label: 'Does not compare with “= NULL”, which never matches', re: /=\s*null\b/i, invert: true },
            { label: 'Stays read-only', re: /\b(insert|update|delete|drop|alter|truncate)\b/i, invert: true }
          ]
        },
        {
          label: 'Postman · post-response assertions',
          lang: 'javascript',
          note: 'Teaching snippet assuming a contract that returns 201 with id and quantity. Adapt it to your API, then verify persistence separately.',
          text: `pm.test("Order created", () => {
  pm.response.to.have.status(201);
  const order = pm.response.json();
  pm.expect(order.id).to.exist;
  pm.expect(order.quantity).to.eql(2);
});

// Next: GET /orders/{{orderId}} or a read-only query
// to confirm the order was really stored.`,
          checks: [
            { label: 'Asserts the status code', re: /to\.have\.status\(\s*\d{3}\s*\)|response\.code/ },
            { label: 'Parses the JSON body', re: /response\.json\(\)/ },
            { label: 'Asserts at least one field value', re: /expect\([^)]*\)\.to\.(eql|equal|be|exist|have)/ },
            { label: 'No hard-coded token pasted in', re: /bearer\s+[a-z0-9._-]{12,}|eyJ[a-zA-Z0-9_-]{10,}/i, invert: true }
          ]
        }
      ],
      task: {
        title: 'Probe the API console like a tester',
        steps: [
          'Open the API request console. Send GET /api/users/42 with the 200, 401 and 404 scenarios, and POST /api/orders with 200 and 500.',
          'For each response, note the status, the body fields and one thing the status alone does not prove.',
          'In the code workspace (API Sandbox challenge), write two pm.test assertions and explain in the Approach tab how a follow-up GET or a read-only query would confirm persistence.',
          'Remember the console is simulated: a mock response shows how a client should react, not what a real database stored.'
        ],
        lab: 'api', challenge: 'api-contract'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'Orders 101 and 102 have items; order 103 has none. Which query lists order 103?',
          options: [
            { t: 'orders INNER JOIN order_items', why: 'INNER JOIN keeps only matching rows, so order 103 disappears from the result.' },
            { t: 'orders LEFT JOIN order_items … WHERE the item side IS NULL', why: 'Right — LEFT JOIN keeps unmatched orders with NULL item columns; filtering on IS NULL leaves just those.' },
            { t: 'Neither — SQL cannot find missing rows.', why: 'Outer joins exist precisely to detect missing relationships such as orphaned or empty orders.' }
          ],
          correct: 1
        },
        {
          level: 'Starter',
          q: 'With no token the API returns 401. With buyer B’s valid token for buyer A’s order it returns 403. What do these two checks test?',
          options: [
            { t: 'Both test authentication.', why: 'Only the first does. In the second, B is authenticated — the question is whether B is allowed.' },
            { t: 'Both are server errors.', why: 'Server errors are 5xx. 401 and 403 are client-side refusals defined by the contract.' },
            { t: '401 tests authentication (who you are); 403 tests authorization (what you may access).', why: 'Right — keep the two separate in your cases and your bug reports.' }
          ],
          correct: 2
        },
        {
          level: 'Interview',
          q: 'POST /orders returns 201 with an order ID, but the order is missing from the buyer’s history. What do you do?',
          options: [
            { t: 'Compare the contract and body, GET the ID, check stored data read-only, correlate IDs and logs, then separate response, data and environment causes before reporting.', why: 'Right — a mismatch starts an investigation. Gather independent evidence before naming the faulty layer.' },
            { t: 'Pass the test — 201 proves the order was created.', why: 'A status is one piece of evidence. The missing history is a contradiction you must investigate.' },
            { t: 'Immediately report a database defect.', why: 'That assumes the cause. It could be the history endpoint, caching, ownership or the environment.' }
          ],
          correct: 0
        }
      ],
      myths: [
        { myth: '200 or 201 means it worked.', fact: 'Status is one piece of evidence. Verify the body, persistence and side effects too.' },
        { myth: '401 and 403 are interchangeable.', fact: 'Authentication (who you are) is not authorization (what you may do). Check the contract.' },
        { myth: 'It is fine to UPDATE rows on a shared database while testing.', fact: 'Write only in your disposable local database; verify everywhere else read-only.' },
        { myth: 'A mock API proves the data is saved.', fact: 'A mock proves the client handles a response. Persistence needs a real read-back or query.' }
      ],
      tips: [
        'Store money as integer minor units in fixtures and state the excluded rules (tax, shipping, discounts).',
        'Run your Postman collection repeatedly to prove it resets its own data.',
        'For eventual consistency, agree a bounded observation window before declaring a defect.'
      ],
      evidence: [
        'SQL files with schema notes, expected results and sanitized result examples — 15 queries including two joins, one aggregation and three integrity checks',
        'A Postman collection export without secrets, an environment example and a run report',
        'One API lifecycle compared with SQL, with data-verification notes'
      ],
      gate: 'You can predict query results, investigate an unexpected response and reproduce it outside the UI.',
      milestone: 'Milestone: with your manual testing evidence plus basic SQL and API checks, you can start applying for internships and junior manual QA roles. Keep learning while you apply.',
      next: { challenges: ['api-contract'], labs: ['api'], interview: { track: 'api', ids: ['a1', 'a3', 'a4', 'a5'] } },
      source: 'Career Roadmap pp. 12–13 (Phase 4) and p. 27; Visual Roadmap p. 1.'
    },

    /* ───────────────────────── Stage 5 ───────────────────────── */
    {
      id: 'code-git',
      title: 'Learn code and Git',
      tagline: 'JavaScript → TypeScript · Git / GitHub',
      weeks: 'Weeks 13–15', hours: [30, 36],
      deliver: 'Small scripts + a tidy repository.',
      outcome: 'Write and explain small JavaScript programs for test data and assertions, debug an ordinary failing assertion, and keep a clean, reviewable Git history with no secrets.',
      prereq: 'Stage 4 — reading JSON responses. Comfort with a text editor.',
      learn: [
        'Variables, strings, numbers, booleans, arrays and objects; conditions, loops and functions',
        'Modules, a package manager and lockfile, JSON parsing, environment variables',
        'Assertions, exceptions and error handling; async/await and promises',
        'Debugging: read a stack trace, isolate a small reproduction, inspect values',
        'Git status, diff, add, commit, branch, pull, push; pull requests; one merge conflict',
        'Secret hygiene: .gitignore, .env.example, and rotating a leaked secret'
      ],
      concept: [
        'For this web automation path, learn <b>JavaScript first</b>, then enough <b>TypeScript</b> to describe your test data. Choose Java if the roles you target consistently use Java/Selenium, or Python when the team stack requires it — and avoid starting three languages at once.',
        'QA code is usually small: build test data, call something, assert the result. Learn functions, arrays and objects, JSON parsing, errors and <b>async/await</b> — browser actions return promises, so a missing <code>await</code> lets the test continue before the action finishes. Keep classes simple; don’t build an elaborate framework before you have useful tests.',
        'Debugging is a skill: read the stack trace down to your own file, reduce the problem to a small reproduction, and inspect intermediate values. Use AI suggestions only when you can check their assumptions and behaviour, and never paste private credentials or customer data into them.',
        '<b>Git</b> records local history; <b>GitHub</b> hosts collaboration. Work on a short-lived branch, review <code>git diff</code> before committing, make small commits with clear messages, and open a pull request that explains the change. Ignore .env files, dependency folders and local auth state; publish .env.example with dummy values. <b>If a secret is committed, revoke or rotate it</b> — deleting the latest file does not erase the exposure.'
      ],
      roman: 'Web automation ke liye pehle JavaScript, phir thori TypeScript seekhein; ek waqt mein teen languages shuru na karein. QA code aam tor par chhota hota hai: data banao, function chalao, result assert karo. await bhoolna confusing failures ka sabab banta hai. Git mein chhoti branch, git diff review aur chhote commits rakhein. .env file kabhi commit na karein; secret leak ho jaye to use rotate karein — sirf file delete karna kaafi nahi.',
      visuals: [
        {
          label: 'Git workflow',
          caption: 'A short-lived branch, a reviewed diff and a pull request make every change easy to inspect and revert.',
          html: `<ol class="lv-flow"><li><b>Branch</b><span>git switch -c add-cart-cases</span></li><li><b>Review</b><span>git status · git diff</span></li><li><b>Stage &amp; commit</b><span>git add … · git commit -m "Add cart quantity boundary cases"</span></li><li><b>Push</b><span>git push -u origin add-cart-cases</span></li><li><b>Pull request</b><span>Explain the change; reviewer reads the diff; merge</span></li></ol>
<div class="lv-aside"><b>Never commit:</b> <code>.env</code>, tokens, dependency folders, local auth state. Commit <code>.env.example</code> with names and dummy values.</div>`
        },
        {
          label: 'Input → function → assertion',
          caption: 'Each row is one test idea for a tiny function. Note the invalid inputs — they matter as much as the happy path.',
          html: `<table class="lv-table"><caption>Test ideas for lineTotal(quantity, unitPriceMinor)</caption><thead><tr><th scope="col">Input</th><th scope="col">Expected</th><th scope="col">Why</th></tr></thead><tbody>
<tr><td>(2, 1250)</td><td>2500</td><td>Normal case</td></tr>
<tr><td>(0, 1250)</td><td>0</td><td>Zero quantity</td></tr>
<tr><td>(−1, 1250)</td><td>Throws an error</td><td>Negative is invalid</td></tr>
<tr><td>(1.5, 1250)</td><td>Throws an error</td><td>Non-integer</td></tr>
<tr><td>("2", 1250)</td><td>Throws an error</td><td>Wrong type</td></tr></tbody></table>`
        },
        {
          label: 'Why integer minor units?',
          caption: 'Binary floating point cannot represent many decimals exactly. Integer cents avoid surprising totals in fixtures and assertions.',
          html: `<div class="lv-compare"><div><b>Decimals (floating point)</b><ul><li><code>0.1 + 0.2</code> → <code>0.30000000000000004</code></li><li>Equality checks on money can fail unexpectedly</li></ul></div><div><b>Integer minor units</b><ul><li><code>10 + 20</code> → <code>30</code> (cents)</li><li>Exact sums; format for display only at the edge</li></ul></div></div>`
        }
      ],
      example: {
        title: 'A cart subtotal you can explain line by line',
        html: `<p>The editor shows a small function that validates its input and sums line totals in integer minor units, followed by example checks. Practice programs from the handbook: a cart subtotal function, a data-driven boundary checker and a script that validates a JSON response shape. Cover empty input, invalid types, zero values and duplicates, and explain your code aloud.</p>`
      },
      codes: [
        {
          label: 'JavaScript · cart subtotal with checks',
          lang: 'javascript',
          note: 'Draft only — this site does not run code. Read it, change it, and run it later in your own Node.js setup.',
          text: `// Cart subtotal in integer minor units (for example, cents)
function lineTotal(quantity, unitPriceMinor) {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer");
  }
  return quantity * unitPriceMinor;
}

function subtotal(items) {
  return items.reduce(
    (sum, item) => sum + lineTotal(item.quantity, item.priceMinor),
    0
  );
}

// Example checks
console.assert(subtotal([{ quantity: 2, priceMinor: 1250 }]) === 2500, "two items");
console.assert(subtotal([]) === 0, "empty cart");`,
          checks: [
            { label: 'Validates the quantity type (e.g. Number.isInteger)', re: /Number\.isInteger|typeof\s+\w+\s*[!=]==/ },
            { label: 'Throws an error for invalid input', re: /throw\s+new\s+Error/ },
            { label: 'Has at least two assertions', re: /(assert|expect)[\s\S]*(assert|expect)/ },
            { label: 'Covers the empty-cart case', re: /\(\s*\[\s*\]\s*\)/ }
          ]
        },
        {
          label: 'Git · one reviewed change',
          lang: 'bash',
          note: 'Commands from the handbook. Notice the review step before committing, and a message that explains the change.',
          text: `git switch -c add-cart-cases
git status
git diff
git add docs/test-cases.md
git commit -m "Add cart quantity boundary cases"
git push -u origin add-cart-cases`,
          checks: [
            { label: 'Creates a short-lived branch', re: /git\s+(switch\s+-c|checkout\s+-b)\s+\S+/ },
            { label: 'Reviews changes before committing (git diff)', re: /git\s+diff/ },
            { label: 'Commit message says what changed (not just “update” or “fix”)', re: /commit\s+-m\s+["'](update|fix|changes?|wip|stuff)["']/i, invert: true },
            { label: 'Does not add a .env file', re: /git\s+add[^\n]*\.env(\s|$)/, invert: true }
          ]
        }
      ],
      task: {
        title: 'Write a data-driven check in the workspace',
        steps: [
          'Open the ShopFlow challenge in the code workspace.',
          'In the Code tab, write a small data-driven check for the cart subtotal with normal, empty, zero, boundary and invalid inputs. Pseudocode is fine.',
          'In the Approach tab, explain each line in plain words and why money is kept in integer minor units.',
          'Save your draft, then list in your notes five meaningful commit messages you would use for this work.'
        ],
        lab: null, challenge: 'shopflow-checkout'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'Why keep money as integer minor units (for example 1250 cents) in test data?',
          options: [
            { t: 'JavaScript cannot store decimals.', why: 'It can — but binary floating point represents many decimals inexactly, which is the real problem.' },
            { t: 'To avoid floating-point surprises such as 0.1 + 0.2 ≠ 0.3.', why: 'Right — integer sums are exact. Format to a decimal only for display.' },
            { t: 'Because bigger numbers are easier to read.', why: 'Readability is not the reason; exact arithmetic is.' }
          ],
          correct: 1
        },
        {
          level: 'Starter',
          q: 'A browser test sometimes fails at a step that is missing await. What is happening?',
          options: [
            { t: 'The promise is not awaited, so the test moves on before the action finishes — a test-code bug.', why: 'Right — this is a test failure, not a product failure. Add the await and re-run.' },
            { t: 'The browser is broken.', why: 'The browser is doing what it was told; the test simply did not wait for the action.' },
            { t: 'The server is slow, so add a fixed sleep.', why: 'A sleep hides the real cause and makes tests slow and still flaky.' }
          ],
          correct: 0
        },
        {
          level: 'Interview',
          q: 'You pushed a commit that contains an API token. What is the right response?',
          options: [
            { t: 'Delete the file in the next commit — done.', why: 'The token is still in history and in any clones. Deleting the file does not undo the exposure.' },
            { t: 'Make the repository private and keep using the token.', why: 'The token may already be copied. Hiding the repo does not make it safe.' },
            { t: 'Revoke or rotate the token, remove it from the code, add the file to .gitignore, and tell the owner following team process.', why: 'Right — rotation removes the risk; the cleanup prevents a repeat.' }
          ],
          correct: 2
        }
      ],
      myths: [
        { myth: 'I need Java, Python and JavaScript before I can automate.', fact: 'Pick one language for your target roles. Depth beats breadth.' },
        { myth: 'Deleting a committed secret fixes it.', fact: 'Revoke or rotate it. History and clones keep the old value.' },
        { myth: 'Big commits save time.', fact: 'Small, focused commits are faster to review, explain and revert.' }
      ],
      tips: [
        'Explain your code line by line out loud — if you cannot, you do not own it yet.',
        'When an assertion fails, read the expected and received values before changing anything.',
        'Practise resolving one harmless merge conflict in a learning repository.'
      ],
      evidence: [
        'Three small programs (cart subtotal, data-driven boundary checker, JSON shape validator) with sample inputs and assertions',
        'README instructions and a clean repository',
        'Five meaningful commits and one reviewed pull request'
      ],
      gate: 'You can change a test without blindly copying code and recover from an ordinary failing assertion.',
      next: { challenges: ['shopflow-checkout'], labs: [], interview: { track: 'playwright', ids: ['p5', 'p4'] } },
      source: 'Career Roadmap p. 14 (Phase 5); Visual Roadmap p. 1.'
    },

    /* ───────────────────────── Stage 6 ───────────────────────── */
    {
      id: 'automation',
      title: 'Automate useful checks',
      tagline: 'One framework · reliable tests · CI/CD',
      weeks: 'Weeks 16–19', hours: [40, 48],
      deliver: '5–10 critical checks running in CI (Visual Roadmap).',
      outcome: 'Build a small, reliable suite in one framework — Playwright by default — place each check at the right layer, diagnose flaky results with traces, and run it in CI.',
      prereq: 'Stage 5 JavaScript/TypeScript and Git, plus Stage 2 manual cases worth automating.',
      learn: [
        'Choosing one framework: Playwright as the default; Cypress or Selenium when target roles use them',
        'User-facing locators and auto-waiting assertions',
        'Isolation: fixtures, independent data, no order dependence',
        'Traces and screenshots; causes of flakiness; why a retry pass is not clean',
        'The test pyramid as a heuristic; placing each risk at the lowest reliable layer',
        'CI fundamentals; product vs test vs environment failures'
      ],
      concept: [
        'Automation is repeatable execution of useful checks. It does not replace test design, exploratory investigation or judgement about user risk — <b>automate stable, high-value behaviour after you have tested it manually</b>. Pick one framework. <b>Playwright</b> is a practical default for this web path (Chromium, Firefox and WebKit, plus API checks). Choose <b>Cypress</b> if your target team uses it, or <b>Selenium</b> when roles need its WebDriver ecosystem, often with Java or Python. Learn a second one only when a job or project justifies it.',
        'Reliable tests locate elements the way users do — by role and accessible name, label, or an agreed test ID. They assert visible business outcomes with auto-waiting assertions, give each test its own data through fixtures, and never depend on test order. Avoid arbitrary sleeps. Debug with traces and screenshots.',
        'The <b>test pyramid</b> is a planning heuristic, not a required ratio: many fast unit/component checks, fewer API/integration checks, a small set of critical UI journeys. Place each check at the lowest layer that can reveal the risk reliably. Developers often own much of the unit layer; QA contributes scenarios and cross-layer coverage.',
        '<b>CI</b> runs checks when changes integrate: pull request → get the code → install locked dependencies → start a disposable app and database → wait for readiness → run checks → publish reports and traces → clean up. When it fails, classify it: a <b>product failure</b>, a <b>test failure</b>, an <b>environment failure</b>, or a <b>flaky result</b>. A retry pass is not a clean pass — preserve the first failure.'
      ],
      roman: 'Automation useful checks ko dohrati hai, test design ya exploratory testing ka badal nahi. Ek framework chunein — web ke liye Playwright acha default hai. Role/label locators, auto-waiting assertions aur har test ka alag data use karein; fixed sleep se bachein. Pyramid ek rehnuma usool hai, lazmi ratio nahi. CI fail ho to dekhein: product, test, environment ya flaky? Retry se pass hona clean pass nahi.',
      visuals: [
        {
          label: 'Test pyramid + risk → layer',
          caption: 'A heuristic, not a ratio or maturity score. Each risk goes to the lowest layer that can reveal it reliably.',
          html: `<div class="lv-pyramid-wrap"><svg class="lv-pyramid" viewBox="0 0 360 220" role="img" aria-labelledby="pyrT pyrD"><title id="pyrT">Test pyramid</title><desc id="pyrD">Three layers. Bottom and widest: many fast unit and component checks. Middle: API and integration checks. Top and narrowest: a few critical UI journeys.</desc>
<polygon points="130,10 230,10 260,75 100,75" class="py-top"/><polygon points="100,80 260,80 295,145 65,145" class="py-mid"/><polygon points="65,150 295,150 330,215 30,215" class="py-base"/>
<text x="180" y="48" text-anchor="middle">Few UI journeys</text><text x="180" y="118" text-anchor="middle">API / integration</text><text x="180" y="188" text-anchor="middle">Many unit / component</text></svg>
<table class="lv-table"><caption>Where each risk starts</caption><thead><tr><th scope="col">Risk</th><th scope="col">Best starting layer</th></tr></thead><tbody>
<tr><td>Rounding logic is wrong</td><td>Unit / component</td></tr>
<tr><td>A user reads another user’s order</td><td>API / integration</td></tr>
<tr><td>A buyer cannot complete checkout</td><td>UI journey</td></tr>
<tr><td>The flow is confusing or inaccessible</td><td>Exploration + targeted checks</td></tr></tbody></table></div>`
        },
        {
          label: 'A starter CI pipeline',
          caption: 'Run a small smoke suite on pull requests and broader coverage on an agreed schedule.',
          html: `<ol class="lv-flow lv-flow-wrap"><li><b>Pull request</b><span>Triggers the workflow</span></li><li><b>Get the code</b><span>Clean checkout</span></li><li><b>Install</b><span>Locked dependencies</span></li><li><b>Prepare</b><span>Disposable app + database</span></li><li><b>Wait</b><span>Health check — not a fixed sleep</span></li><li><b>Run checks</b><span>Fail the job on failure</span></li><li><b>Publish</b><span>Reports, traces — even on failure</span></li><li><b>Clean up</b><span>Remove data and containers</span></li></ol>`
        },
        {
          label: 'What does a red run mean?',
          caption: 'Classify before you act. Only one of these is a product bug.',
          html: `<table class="lv-table"><caption>Failure types and the right response</caption><thead><tr><th scope="col">Type</th><th scope="col">Meaning</th><th scope="col">Response</th></tr></thead><tbody>
<tr><th scope="row">Product failure</th><td>The app violates an agreed expectation</td><td>Link the defect and the failing evidence</td></tr>
<tr><th scope="row">Test failure</th><td>A locator, assertion or fixture is wrong</td><td>Repair the test; explain any lost coverage</td></tr>
<tr><th scope="row">Environment failure</th><td>The app did not start or a dependency was down</td><td>Report that the run did not establish product quality</td></tr>
<tr><th scope="row">Flaky result</th><td>Equivalent runs give different outcomes</td><td>Keep the first failure; investigate shared state, timing, selectors, environment — or a real intermittent bug</td></tr></tbody></table>`
        }
      ],
      example: {
        title: 'One focused, readable Playwright check',
        html: `<p>The editor shows an illustrative test for a request form like the one in this site’s UI Playground. It uses label and role locators, performs one user action, and asserts the visible outcome with an auto-waiting assertion. Adapt the URL and accessible names to your own app. Week by week, the handbook suggests: run one test and learn locators (week 16), add fixtures and isolated data (17), debug with traces and remove sleeps (18), then run in CI and keep failure evidence (19).</p>`
      },
      codes: [
        {
          label: 'Playwright · TypeScript',
          lang: 'typescript',
          note: 'Draft only — not executed here. Run it in your own Playwright project and break the assertion on purpose to see it fail.',
          text: `import { test, expect } from "@playwright/test";

test("shows a required-fields message when email is missing", async ({ page }) => {
  await page.goto("/practice/request-form"); // illustrative URL
  await page.getByRole("combobox", { name: "Requested role" })
    .selectOption("QA Analyst");
  await page.getByRole("button", { name: "Submit request" }).click();

  // Assert the user-visible outcome; this assertion waits automatically
  await expect(page.getByRole("heading", { name: "Required fields" }))
    .toBeVisible();
});`,
          checks: [
            { label: 'Uses user-facing locators (getByRole / getByLabel / getByTestId)', re: /getBy(Role|Label|TestId|Text|Placeholder)\(/ },
            { label: 'Asserts an outcome with expect(...)', re: /expect\(/ },
            { label: 'No fixed sleeps (waitForTimeout / sleep)', re: /waitForTimeout|\bsleep\(|setTimeout\(/, invert: true },
            { label: 'Avoids brittle positional selectors (nth-child, long XPath)', re: /nth-child|\/\/div|xpath=/i, invert: true },
            { label: 'Test name describes behaviour', re: /test\(\s*["'`][^"'`]{12,}["'`]/ }
          ]
        }
      ],
      task: {
        title: 'Three reliable checks for the UI Playground',
        steps: [
          'Open the UI Playground challenge in the code workspace and explore the built-in target.',
          'Write three Playwright checks: missing required fields, an invalid email, and a table filter with no results. Use role or label locators and assert visible outcomes.',
          'In the Approach tab, say which risks you would push down to the API or unit layer instead of the UI.',
          'Describe how you would deliberately break one behaviour to prove the right test fails — then submit your attempt for rubric feedback.'
        ],
        lab: 'ui', challenge: 'ui-interactions'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'A test clicks Save, then immediately checks for “Saved”. It flakes in CI. What is the best fix?',
          options: [
            { t: 'Add waitForTimeout(5000).', why: 'Fixed sleeps make tests slow and still flaky when CI is slower than five seconds.' },
            { t: 'Turn on retries until it passes.', why: 'Retries hide the symptom. A retry pass is not a clean pass.' },
            { t: 'Use an auto-waiting assertion on the visible outcome and inspect the trace.', why: 'Right — wait for observable behaviour, then use the trace to confirm the cause.' }
          ],
          correct: 2
        },
        {
          level: 'Starter',
          q: 'Where should you first check that a discount rounds correctly across 50 price values?',
          options: [
            { t: 'At the unit / component layer.', why: 'Right — fast and precise coverage of many values. Keep one UI journey for the connected experience.' },
            { t: 'In 50 separate UI tests.', why: 'Slow and brittle. The UI is the wrong layer for exhaustive calculation checks.' },
            { t: 'Only through exploratory testing.', why: 'Exploration is valuable, but repeated numeric checks belong in automated lower-level tests.' }
          ],
          correct: 0
        },
        {
          level: 'Interview',
          q: 'A CI run fails because the application container never started. How do you report it?',
          options: [
            { t: 'As a product failure — log a bug against checkout.', why: 'The product was never exercised. Logging a product bug would be an assumption, not evidence.' },
            { t: 'As an environment failure: the run did not establish product quality; keep the logs and fix the setup.', why: 'Right — say clearly that no product conclusion can be drawn from this run.' },
            { t: 'Re-run until it is green and report a pass.', why: 'That hides the problem and misreports the evidence.' }
          ],
          correct: 1
        }
      ],
      myths: [
        { myth: 'Automate everything.', fact: 'Automate stable, high-value checks. Keep exploratory, usability and accessibility review alongside.' },
        { myth: 'A green CI run means good coverage.', fact: 'It means the selected checks passed in that run. Coverage is a separate question.' },
        { myth: 'Retries fix flaky tests.', fact: 'Retries hide symptoms. Track flaky failures separately with an owner and a repair date.' },
        { myth: 'The pyramid is a required ratio.', fact: 'It is a planning heuristic, not a maturity score.' }
      ],
      tips: [
        'Add a second browser only after the first run is stable.',
        'Deep evidence in one tool is more credible than three shallow tutorial repositories.',
        'Review about 20 relevant job descriptions to check which framework your local market asks for.'
      ],
      evidence: [
        'A suite of 8–12 purposeful checks (Visual Roadmap: 5–10 in CI) including two negative cases and one end-to-end journey',
        'Readable test names, isolated data, failure artifacts and run instructions',
        'Passing and failing CI run references with setup instructions and a triage note'
      ],
      gate: 'You can deliberately break a behaviour, see the correct test fail, fix it and explain the result — and a reviewer can tell product, test and environment failures apart.',
      next: { challenges: ['ui-interactions', 'peopleops-login'], labs: ['ui'], interview: { track: 'playwright', ids: ['p1', 'p2', 'p3', 'p6'] } },
      source: 'Career Roadmap pp. 15–17 (Phase 6); Visual Roadmap pp. 1–2.'
    },

    /* ───────────────────────── Stage 7 ───────────────────────── */
    {
      id: 'quality',
      title: 'Broaden quality coverage',
      tagline: 'Accessibility · performance · security basics',
      weeks: 'Weeks 20–21', hours: [20, 24],
      deliver: 'A short risk and findings report.',
      outcome: 'Run an introductory accessibility review, a small local performance experiment and a two-account authorization check — and report scope, method, findings and limitations honestly.',
      prereq: 'Stages 3–4 (DevTools, API authentication). Stage 6 helps but is not required.',
      learn: [
        'Accessibility basics: keyboard, focus order and visibility, labels, errors, headings, alt text, zoom and reflow',
        'Performance: load, stress, spike and soak; p95 latency, throughput, error rate, saturation',
        'Security awareness: authentication vs authorization, input handling, data exposure, sessions, dependencies',
        'Staying inside an authorised scope — local labs only',
        'Communicating residual risk and when to ask a specialist'
      ],
      concept: [
        '<b>Accessibility.</b> Use W3C WAI guidance to check keyboard operation, logical focus order, visible focus, form labels, understandable errors, headings, alternative text and zoom/reflow. Run a scanner, then check manually with the keyboard and a basic screen reader — automated tools cannot establish full accessibility. Call it an introductory review, not a compliance certification.',
        '<b>Performance.</b> Load testing runs at expected demand, stress beyond expected capacity, spike under sudden changes, and soak over time. Learn latency percentiles (such as p95), throughput, error rate and resource saturation. A small run on your own laptop is a learning experiment, not a production capacity claim.',
        '<b>Security awareness.</b> Authentication establishes who someone is; authorization decides what they may do. Also think about unsafe input handling, sensitive data exposure, session behaviour and dependency risk. With two local accounts, verify user B cannot read or change user A’s order, and that logs and exported evidence contain no passwords or tokens. That is a focused authorization check, not a penetration test.',
        '<b>Stay in scope.</b> Test only a local lab or an explicitly authorised environment — never run scans or load tests against arbitrary public sites. Then report what each review proves, what remains unknown, and when specialist support is needed.'
      ],
      roman: 'Accessibility: sirf keyboard se poora flow chalayein, focus nazar aaye, labels aur error messages samajh aayein. Scanner ke saath manual check zaroori hai. Performance: load, stress, spike aur soak ka farq samjhein; laptop par chhota test production capacity ka saboot nahi. Security: authentication = aap kaun hain, authorization = aap kya kar sakte hain. User B ko user A ka order nahi dikhna chahiye. Sirf apni local lab ya ijazat wale environment mein test karein.',
      visuals: [
        {
          label: 'What each review proves',
          caption: 'Every review has limits. Write them in your report next to the findings.',
          html: `<div class="lv-cards">
<div><b>Accessibility</b><dl><dt>Quick method</dt><dd>Keyboard-only journey, scanner, basic screen reader</dd><dt>Shows</dt><dd>Barriers found in the checked flows</dd><dt>Does not prove</dt><dd>Full accessibility or compliance</dd></dl></div>
<div><b>Performance</b><dl><dt>Quick method</dt><dd>5 virtual users for 2 minutes on a local app</dd><dt>Shows</dt><dd>p95, throughput and errors for that workload</dd><dt>Does not prove</dt><dd>Production capacity</dd></dl></div>
<div><b>Authorization</b><dl><dt>Quick method</dt><dd>Two local accounts; B requests A’s order</dd><dt>Shows</dt><dd>Whether that access is refused</dd><dt>Does not prove</dt><dd>Overall security (not a penetration test)</dd></dl></div>
<div><b>Compatibility</b><dl><dt>Quick method</dt><dd>The matrix from Stage 3</dd><dt>Shows</dt><dd>Behaviour on the listed combinations</dd><dt>Does not prove</dt><dd>Untested browsers and devices</dd></dl></div></div>`
        },
        {
          label: 'Authentication vs authorization',
          caption: 'Two accounts, one order. The check passes only if access is refused AND the data is unchanged.',
          html: `<ol class="lv-flow"><li><b>Buyer A</b><span>Signs in (authenticated) and creates order A1</span></li><li><b>Buyer B</b><span>Signs in with their own valid account (authenticated)</span></li><li><b>B requests A1</b><span>Expected: refused — 403, or 404 by policy (authorization)</span></li><li><b>Verify</b><span>A re-reads A1: unchanged; evidence has no tokens</span></li></ol>`
        },
        {
          label: 'Performance test types',
          caption: 'Four workload shapes answer four different questions. Define the workload before you measure.',
          html: `<table class="lv-table"><caption>Performance test types</caption><thead><tr><th scope="col">Type</th><th scope="col">Workload</th><th scope="col">Question it answers</th></tr></thead><tbody>
<tr><th scope="row">Load</th><td>Expected demand</td><td>Does it meet targets under normal use?</td></tr>
<tr><th scope="row">Stress</th><td>Beyond expected capacity</td><td>Where and how does it break?</td></tr>
<tr><th scope="row">Spike</th><td>Sudden jump in demand</td><td>Does it cope and recover?</td></tr>
<tr><th scope="row">Soak</th><td>Steady load for a long time</td><td>Do leaks or slowdowns appear over time?</td></tr></tbody></table>`
        }
      ],
      example: {
        title: 'An introductory accessibility finding',
        html: `<p><b>A11Y-01 · Focus is not visible on “Submit request”.</b> Environment: Chromium on desktop, keyboard only. Steps: Tab through the request form. Expected: a visible focus indicator on each control (WCAG 2.2, 2.4.7 Focus Visible). Actual: no indicator on the submit button. Impact: keyboard users lose their place. Limitation: introductory review of one flow — not a full audit.</p>
<p><b>Performance note:</b> “5 virtual users browsing for 2 minutes on my local app: p95 180 ms, 0 errors, after a 30-second warm-up. Illustrative threshold only — production targets need business and capacity context.”</p>`
      },
      codes: [
        {
          label: 'Two-account authorization check',
          lang: 'javascript',
          note: 'Postman-style draft for a local lab only. Not executed here. Use variables for tokens — never paste real ones.',
          text: `// Precondition: buyer A owns order {{orderA}}.
// This request is sent with buyer B's token from the environment.
pm.test("Buyer B cannot read buyer A's order", () => {
  // The contract decides 403 or 404; both refuse access
  pm.expect(pm.response.code).to.be.oneOf([403, 404]);
  pm.expect(pm.response.text()).to.not.include("shippingAddress");
});

// Follow-up evidence: re-read {{orderA}} as buyer A and
// confirm nothing changed. Check exported evidence for tokens.`,
          checks: [
            { label: 'Expects a refusal status (403 or 404)', re: /40[34]/ },
            { label: 'Asserts that no order data leaked', re: /not\.(include|have)|to\.not\./ },
            { label: 'No real token pasted in', re: /bearer\s+[a-z0-9._-]{12,}|eyJ[a-zA-Z0-9_-]{10,}/i, invert: true },
            { label: 'Plans a follow-up check that data is unchanged', re: /follow-up|unchanged|re-read|confirm/i }
          ]
        }
      ],
      task: {
        title: 'A keyboard-only review and an access check',
        steps: [
          'Open the UI Playground. Complete the request form using only Tab, Shift+Tab, Enter, Space and arrow keys. Trigger the validation error and recover from it.',
          'Note each control’s visible label, whether focus is always visible, and whether the error explains how to fix it.',
          'Open the API request console and compare 200 and 401 for GET /api/users/42. In your notes, describe what a two-account check would add.',
          'Write a short report with scope, method, findings and limitations. Keep it to this site’s simulated labs.'
        ],
        lab: 'ui', challenge: 'ui-interactions'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'An automated accessibility scanner reports zero issues. What can you conclude?',
          options: [
            { t: 'The page is fully accessible.', why: 'Scanners catch only a subset of issues. Keyboard and screen-reader checks are still needed.' },
            { t: 'No issues the scanner can detect were found; manual keyboard and screen-reader checks are still needed.', why: 'Right — report it as an introductory review with clear limits.' },
            { t: 'The page is WCAG certified.', why: 'A scan is not a certification. Do not overstate the evidence.' }
          ],
          correct: 1
        },
        {
          level: 'Starter',
          q: 'Buyer B, signed in with their own account, opens buyer A’s order URL and sees it. What failed?',
          options: [
            { t: 'Authorization (access control).', why: 'Right — B was correctly authenticated but should not be allowed to access A’s order.' },
            { t: 'Authentication.', why: 'Authentication worked: the system correctly knew B was B.' },
            { t: 'Performance.', why: 'Speed is not the issue; data was exposed to the wrong user.' }
          ],
          correct: 0
        },
        {
          level: 'Interview',
          q: 'You ran 5 virtual users for 2 minutes on your laptop; p95 was 180 ms. How do you report it?',
          options: [
            { t: '“The system can handle production traffic.”', why: 'A small local run is not a production capacity claim.' },
            { t: 'Do not report it — it is too small to matter.', why: 'Small experiments are useful when their scope is clear. Report them honestly.' },
            { t: 'Report workload, environment, warm-up, data, p95, throughput and errors, and state it is a small local experiment.', why: 'Right — the numbers plus their context and limits are the useful evidence.' }
          ],
          correct: 2
        }
      ],
      myths: [
        { myth: 'A clean scanner result means the page is accessible.', fact: 'Tools catch a subset. Manual keyboard and screen-reader checks are required.' },
        { myth: 'Signed in means allowed.', fact: 'Authentication is not authorization. Check what each role may access.' },
        { myth: 'A quick load test on my laptop proves capacity.', fact: 'Production targets need business and capacity context.' },
        { myth: 'It is fine to scan a public demo site to practise.', fact: 'Test only local or explicitly authorised environments.' }
      ],
      tips: [
        'Record user impact, environment and the relevant guideline for each accessibility finding.',
        'Check logs and exported evidence for passwords or tokens before sharing anything.',
        'Say when a finding needs a specialist — that is a strength, not a weakness.'
      ],
      evidence: [
        'An introductory accessibility review with scope, method, findings and limitations',
        'A small local performance experiment with workload, environment, p95, throughput and errors',
        'A two-account authorization check report — clearly labelled as a focused check, not a penetration test'
      ],
      gate: 'You can explain what each review proves, what remains unknown, and when specialist support is needed.',
      next: { challenges: ['ui-interactions'], labs: ['ui', 'api'], interview: { track: 'api', ids: ['a3', 'a4'] } },
      source: 'Career Roadmap p. 18 (Phase 7); Visual Roadmap p. 1.'
    },

    /* ───────────────────────── Stage 8 ───────────────────────── */
    {
      id: 'capstone',
      title: 'Build proof and apply',
      tagline: 'Capstone · portfolio · interview practice',
      weeks: 'Weeks 22–24', hours: [30, 36],
      deliver: 'One complete project you can explain.',
      outcome: 'Deliver one integrated capstone — sign-in, cart and checkout tested through UI, API, SQL and automation — publish an honest portfolio, and explain it in a five-minute interview demo.',
      prereq: 'Your artifacts from Stages 1–7. Reuse them: this is consolidation, not starting from zero.',
      learn: [
        'Choosing a testable local system with a UI, an API and a readable database',
        'The cross-layer evidence chain: requirement → manual case → API check → SQL → automation → report',
        'Required scenarios: happy path, boundary, invalid input, ownership, duplicate submission, state changes, failure handling',
        'A portfolio README reviewers can navigate; resume and LinkedIn bullets built on evidence',
        'Interview method: clarify → risks → representative tests → data and evidence → priorities and limits'
      ],
      concept: [
        'Build one capstone you can explain: test sign-in, cart and checkout in a local practice app with API and database access. The Visual Roadmap’s finish line is <b>20 manual cases, 5 reproducible bugs or clearly labelled seeded defects, 10 API checks, 5 SQL checks and 5–10 automated checks</b>. The handbook’s fuller iteration targets are 25–35 cases, 15–20 API checks, 10–15 SQL checks and 8–12 automated checks. Evidence quality matters more than a bug count.',
        'Trace one requirement across layers: REQ-ORDER-01 → manual TC-ORDER-01 → API-ORDER-01 → SQL-ORDER-01 → AUTO-ORDER-01 → execution report, correlating the same order ID. <b>A mismatch starts an investigation — not an automatically assumed database defect.</b>',
        'Be honest. Label seeded defects as seeded and sample reports as simulated; mark unsuccessful checks as failed or blocked. A clean build may yield no defects — a thorough coverage and limitations report is still useful. Redact accounts, tokens and personal data. Any leaked secret, fabricated result or inability to reproduce the central journey blocks publication, whatever the score.',
        'Then apply: portfolio → one-page resume and LinkedIn → targeted junior QA and internship applications → mock interviews → improve from feedback. In interviews, structure answers as clarify the goal → identify risks → select representative tests → explain data and evidence → state priorities and limitations. <b>All timelines here are learning estimates, not hiring guarantees.</b>'
      ],
      roman: 'Ek capstone banayein jo aap samjha sakein: sign-in, cart aur checkout ko UI, API, SQL aur automation se test karein. Ek requirement ko har layer tak trace karein aur same order ID se jorein; mismatch ho to investigate karein, foran database ko qusoorwar na thehrayein. Seeded bugs ko seeded likhein, koi result ghar ke na banayein, aur tokens/personal data hata dein. Phir portfolio, resume, LinkedIn, targeted applications aur mock interviews. Yeh plan hai, naukri ki guarantee nahi.',
      visuals: [
        {
          label: 'One storefront, three kinds of proof',
          caption: 'From the Visual Roadmap: one local storefront feeds manual, API + SQL and automation evidence into a portfolio you can demo.',
          html: `<ol class="lv-flow"><li><b>One local storefront</b><span>Sign in → browse → cart → order</span></li><li><b>Manual</b><span>Cases and bug reports</span></li><li><b>API + SQL</b><span>Responses and stored data</span></li><li><b>Automation</b><span>Critical journeys in CI</span></li><li><b>Portfolio → demo → applications</b><span>README, evidence, test code, CI results</span></li></ol>`
        },
        {
          label: 'Cross-layer evidence chain',
          caption: 'Suggested fixture from the handbook: SKU-01 costs 1,000 minor units with stock 5; buyer A orders quantity 2.',
          html: `<table class="lv-table"><caption>One requirement traced through every layer</caption><thead><tr><th scope="col">Evidence</th><th scope="col">What it checks</th><th scope="col">Expected</th></tr></thead><tbody>
<tr><th scope="row">REQ-ORDER-01</th><td>Valid order reduces stock</td><td>Agreed contract</td></tr>
<tr><th scope="row">TC-ORDER-01</th><td>Buyer A orders 2 through the UI</td><td>Confirmation shows 2 units, subtotal 2,000</td></tr>
<tr><th scope="row">API-ORDER-01</th><td>Response and GET of the same order ID</td><td>Owner A; quantity 2</td></tr>
<tr><th scope="row">SQL-ORDER-01</th><td>Read-only query on order and stock</td><td>One order; stock 3</td></tr>
<tr><th scope="row">AUTO-ORDER-01</th><td>Automated regression of the journey</td><td>Passes in CI with a trace on failure</td></tr>
<tr><th scope="row">Repeat + ownership</th><td>Same idempotency key; buyer B reads it</td><td>Values unchanged; B is refused</td></tr></tbody></table>`
        },
        {
          label: 'Capstone self-review rubric',
          caption: 'A self-review, not a hiring prediction. Aim for at least 75/100 with evidence in every category.',
          html: `<table class="lv-table"><caption>Capstone rubric (100 points)</caption><thead><tr><th scope="col">Criterion</th><th scope="col">Points</th><th scope="col">Good evidence looks like</th></tr></thead><tbody>
<tr><th scope="row">Risk and requirements</th><td>15</td><td>Clear scope, prioritised risks, testable criteria</td></tr>
<tr><th scope="row">Manual design and execution</th><td>20</td><td>Useful techniques, repeatable cases, actual results</td></tr>
<tr><th scope="row">API coverage</th><td>15</td><td>Positive, negative, ownership and lifecycle checks</td></tr>
<tr><th scope="row">Database validation</th><td>15</td><td>Correct joins and integrity checks tied to actions</td></tr>
<tr><th scope="row">Automation and CI</th><td>20</td><td>Independent tests, meaningful assertions, diagnosable failures</td></tr>
<tr><th scope="row">Communication</th><td>15</td><td>Clear README, redacted evidence, report and limitations</td></tr></tbody></table>`
        }
      ],
      example: {
        title: 'A five-minute demo',
        html: `<ol class="lv-list"><li><b>Minute 1:</b> users, scope and top risks.</li><li><b>Minute 2:</b> one requirement and its manual coverage.</li><li><b>Minute 3:</b> API and SQL evidence for the same order.</li><li><b>Minute 4:</b> an automated run and a useful failure trace.</li><li><b>Minute 5:</b> remaining risks, limitations and your next improvement.</li></ol>
<p><b>Resume bullet — use only after doing the work:</b> “Designed 30 risk-based tests for a learning storefront, linked them to acceptance criteria and documented execution results across two browser engines.” Avoid invented business impact, customer numbers or years of experience.</p>`
      },
      codes: [
        {
          label: 'Capstone README outline',
          lang: 'markdown',
          note: 'Every project README should answer these questions. Replace each line with your own evidence.',
          text: `# OrderFlow capstone — QA portfolio

## What is tested and why
Users, scope (sign-in, cart, checkout) and the top risks.

## My contribution
What I did versus sample application code.

## Setup and run
Prerequisites and versions · seed data · run · clean up.

## Evidence
- Test plan and traceability: docs/
- Manual cases and execution results:
- API collection (no secrets):
- SQL checks:
- Automated suite and CI run:

## Results on build 0.3
Passed / failed / blocked · findings (seeded defects labelled)

## Out of scope and remaining risks`,
          checks: [
            { label: 'States scope and risks', re: /scope|risk/i },
            { label: 'Explains how to set up and run it', re: /setup|install|run/i },
            { label: 'Reports passed, failed and blocked results', re: /pass[\s\S]*fail[\s\S]*block|block[\s\S]*fail/i },
            { label: 'Names what is out of scope or still risky', re: /out of scope|remaining risk|limitation/i },
            { label: 'No secrets pasted in', re: /password\s*[:=]\s*\S+|token\s*[:=]\s*\S{8,}|bearer\s+[a-z0-9._-]{12,}/i, invert: true }
          ]
        },
        {
          label: 'Interview story (Situation · Task · Action · Result)',
          lang: 'text',
          note: 'Prepare stories about uncertainty, a mistake, a disagreement and a technical investigation. A learning project is fine if labelled honestly.',
          text: `Situation: In my learning storefront capstone, an order showed
in the API response but not in the buyer's history.
Task: Find which layer was wrong before reporting a bug.
Action: I re-read the order by ID, ran a read-only query on
orders and stock, and compared the history endpoint's filter.
Result: The history endpoint filtered by the wrong owner field.
I logged a reproducible report with request IDs and added an
API regression check. Remaining risk: pagination was untested.`,
          checks: [
            { label: 'Covers Situation, Task, Action and Result', re: /situation[\s\S]*task[\s\S]*action[\s\S]*result/i },
            { label: 'Mentions the evidence you used', re: /query|request|log|trace|evidence|screenshot|recording/i },
            { label: 'States a limitation or remaining risk', re: /remaining|untested|limitation|next time|would improve/i }
          ]
        }
      ],
      task: {
        title: 'A mini-capstone on ShopFlow',
        steps: [
          'Open the ShopFlow challenge in the code workspace — treat it as a small capstone slice.',
          'Approach tab: a short test plan with scope, top risks and what is out of scope.',
          'Test cases tab: five cases — happy path, a boundary, an invalid coupon, a declined payment and a duplicate submission.',
          'Code tab: one automated check for the most critical journey. Submit, read the rubric feedback, and use the readiness checklist below to plan your next step.'
        ],
        lab: 'checkout', challenge: 'shopflow-checkout'
      },
      quiz: [
        {
          level: 'Starter',
          q: 'Your capstone build revealed no defects. What is the honest portfolio approach?',
          options: [
            { t: 'Report coverage, results and limitations; label any seeded defects as seeded.', why: 'Right — a clean build with a thorough coverage report is still useful evidence.' },
            { t: 'Invent a few bugs so the project looks thorough.', why: 'Fabricated results block publication and destroy trust in everything else you show.' },
            { t: 'Leave out the testing report.', why: 'The report is the evidence of your thinking. Without it there is nothing to assess.' }
          ],
          correct: 0
        },
        {
          level: 'Starter',
          q: 'An interviewer asks about a tool you have never used. What is the best answer?',
          options: [
            { t: 'Say you have used it.', why: 'Claims you cannot back up are quickly exposed and damage trust.' },
            { t: 'Change the subject to a tool you know.', why: 'Avoiding the question misses the chance to show how you learn.' },
            { t: 'Say so, explain the related concepts you know, and how you would validate the unfamiliar part.', why: 'Right — honest, and it shows transferable understanding.' }
          ],
          correct: 2
        },
        {
          level: 'Interview',
          q: 'Only 30 minutes remain before release. What do you do?',
          options: [
            { t: 'Start the full regression suite and hope it finishes.', why: 'Without prioritising, the most important risks may not be covered in time.' },
            { t: 'Review the change and its risk, run critical smoke journeys and targeted regression, then report what remains untested.', why: 'Right — prioritise by risk and make the remaining gaps visible to the decision owner.' },
            { t: 'Approve it because earlier builds passed.', why: 'Earlier results do not cover the latest change. QA informs the release decision with current evidence.' }
          ],
          correct: 1
        }
      ],
      myths: [
        { myth: 'More bugs found means a better portfolio.', fact: 'Evidence quality and honest limitations matter more than a bug count.' },
        { myth: 'A certificate replaces a portfolio.', fact: 'Certifications can help some screening, but they do not substitute for practical evidence.' },
        { myth: 'Wait until you have mastered everything before applying.', fact: 'Start internship applications after Stage 4 and keep learning while you apply.' },
        { myth: 'Following the roadmap guarantees a job in six months.', fact: 'The weeks and hours are learning estimates, not hiring guarantees.' }
      ],
      tips: [
        'A starting weekly routine: 5–8 tailored applications, 2–3 professional conversations and one mock interview.',
        'After two weeks without responses, review your targeting and evidence before increasing volume.',
        'Describe your current level accurately and show your strongest evidence first. Never present a practice app as client work.'
      ],
      evidence: [
        'A versioned portfolio release with clean setup instructions and a five-minute walkthrough',
        'A README covering scope, your contribution, setup, evidence, results and what is out of scope',
        'One requirement shown across all four layers, and one investigation from first symptom to conclusion'
      ],
      gate: 'A reviewer can follow your evidence and reproduce a run without private credentials or unexplained steps.',
      readiness: [
        'Explain your test choices and report a reproducible defect.',
        'Check one feature through UI, API and database.',
        'Walk through your GitHub README, evidence and findings.',
        'Discuss one project in an interview without reading a script.'
      ],
      next: { challenges: ['shopflow-checkout', 'bug-report'], labs: ['checkout'], interview: { track: 'manual', ids: ['m6', 'm3', 'm1', 'm2'] } },
      source: 'Career Roadmap pp. 20–27 (Phase 8, portfolio, applications, interviews); Visual Roadmap p. 3.'
    }
  ];

  const plan = {
    rhythm: [
      { label: 'Learn', hours: '2 h' },
      { label: 'Practise', hours: '5 h' },
      { label: 'Save evidence', hours: '2 h' },
      { label: 'Review', hours: '1 h' }
    ],
    days: [
      { day: 'Day 30', text: 'Explain the testing lifecycle and write usable cases.' },
      { day: 'Day 60', text: 'Finish a manual web/mobile project and bug reports.' },
      { day: 'Day 90', text: 'Demonstrate API + SQL checks; start suitable internship applications.' }
    ],
    levels: [
      { label: 'Internship ready', text: 'Explain core concepts, investigate a feature, write reproducible defects and show a small manual portfolio. Basic SQL and API evidence strengthens it — the visual roadmap suggests applying after Stage 4.', after: 4 },
      { label: 'Junior manual QA ready', text: 'Independently plan and execute scoped testing, communicate residual risk, and validate API and database behaviour.', after: 4 },
      { label: 'Junior automation ready', text: 'All of the above, plus a maintainable suite that runs reliably from a clean checkout and in CI. A green run alone does not prove coverage.', after: 6 }
    ]
  };

  return {
    paces, labs, steps, stages, plan,
    sourceNote: 'Adapted from two user-provided roadmaps: “Software Quality Assurance Career Roadmap” (35-page handbook, prepared 20 September 2026) and “SQA Career Roadmap — Concise Visual Edition” (3 pages). Hours, weeks and counts are planning estimates and suggested targets — not industry requirements or hiring guarantees.'
  };
})();
