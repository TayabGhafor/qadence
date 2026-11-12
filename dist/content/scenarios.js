/* Qadence content · scenario-based tests (case study + linked questions).
   Schema: tools/CONTENT_SCHEMA.md ("Scenario tests") · validate: node tools/validate-content.js --file scenarios.js */
QA_CONTENT.addScenarios([
  /* ------------------------------------------------------------------ 1 */
  {
    id: 'sc-login-release',
    title: 'Two hours before release: PeopleOps login',
    level: 'beginner',
    stages: ['foundations', 'manual'],
    minutes: 15,
    summary: 'A new login page with account lockout ships tomorrow and you have two hours to test it. Decide what to test first, which techniques to use and which requirements are missing.',
    brief: [
      { t: 'p', html: 'The <b>PeopleOps</b> HR portal is replacing its login page. Release is <b>Friday 17:00</b>. You have <b>two hours on Thursday (14:00–16:00)</b> to test it on staging. The developer says “unit tests pass, it should be quick”. There is no automation for this page yet.' },
      { t: 'table', caption: 'Story LOG-112 — acceptance criteria', head: ['ID', 'Acceptance criterion'], rows: [
        ['AC1', 'A registered user can sign in with work email and password and lands on the Dashboard.'],
        ['AC2', 'After <b>5 consecutive</b> failed sign-in attempts, the account is locked for <b>30 minutes</b>.'],
        ['AC3', 'A successful sign-in resets the failed-attempt counter to zero.'],
        ['AC4', 'While locked, the user sees: “Your account is locked. Try again later or reset your password.”'],
        ['AC5', '“Forgot password?” sends a reset link to the registered email address.']
      ] },
      { t: 'callout', tone: 'warn', title: 'Constraints', html: 'Staging only · three test accounts: <code>ana@peopleops.test</code>, <code>bilal@peopleops.test</code>, <code>chen@peopleops.test</code> · the product owner answers chat messages until 15:00 · nobody can change the lock duration on staging.' }
    ],
    questions: [
      { q: 'With only two hours, which area should you test first?',
        options: ['Cross-browser layout of the new page in Chrome, Firefox, Safari, Edge and Opera', 'AC1–AC3: successful sign-in, the 5-failure lock and the counter reset', 'The wording and styling of the reset-password email', 'Load testing the login API with 1,000 virtual users'],
        correct: 1,
        why: ['Layout matters, but a broken lock or sign-in is far riskier. A quick check in the main browser is enough for now.', 'Right — sign-in and lockout are the core of the story and the biggest risk (users locked out, or attackers never locked out). Test the highest-risk behaviour first.', 'AC5 needs a check, but email wording is lower risk than the authentication logic. Do it if time remains.', 'Not feasible in two hours on staging and not part of the story. Raise performance as a risk if it matters.'] },
      { q: 'Which questions reveal requirements that are missing or ambiguous in LOG-112? Select all that apply.',
        options: ['Does resetting the password unlock the account straight away?', 'How long does the account stay locked?', 'Are failures counted per account, or per device or IP address?', 'Is the email matched case-insensitively (Ana@ vs ana@)?', 'What exact message should a locked user see?'],
        correct: [0, 2, 3],
        why: ['Correct — AC4 tells users to reset their password, but no criterion says whether a reset clears the lock. Ask before testing.', 'Already answered: AC2 says 30 minutes. Asking again wastes the product owner’s limited time.', 'Correct — the story does not say what is counted. Per-IP counting behaves very differently from per-account counting.', 'Correct — if “ANA@…” is treated as a different user, an attacker might bypass the lock. The story is silent.', 'Already answered: AC4 gives the exact message. Your job is to check it appears, not to ask for it.'] },
      { q: 'AC2–AC4 describe an account moving between “active”, “counting failures” and “locked”. Which test design technique fits best?',
        options: ['Pairwise testing of browsers and operating systems', 'Equivalence partitioning of password lengths', 'A decision table for language and “remember me” settings', 'State transition testing'],
        correct: 3,
        why: ['Pairwise reduces configuration combinations; it does not model how an account changes state over time.', 'No password length rule appears in the story, so this would not cover the lock behaviour.', 'Neither setting is mentioned in the acceptance criteria.', 'Right — the behaviour depends on the current state and the event (fail, succeed, wait), which is exactly what a state transition model captures.'] },
      { q: 'Which set of checks best applies boundary value analysis to the lock rule?',
        options: ['1, 3 and 5 failed attempts, checking for an error each time', 'Exactly 5 failed attempts, then confirm the lock message appears', '4 failures + correct password; 5 failures + correct password', '10 failed attempts in a row, to make sure the lock definitely triggers'],
        correct: 2,
        why: ['Values in the middle (1, 3) add little; the decision happens between 4 and 5.', 'Only half the boundary: it never proves that 4 failures still allow sign-in.', 'Right — 4 failures + correct password should sign in (and reset the counter); 5 failures + correct password should be refused with the AC4 message.', 'Far past the edge; an off-by-one bug (locking at 4 or 6) would go unnoticed.'] },
      { q: 'You enter a wrong password 3 times, sign in successfully, sign out, then enter a wrong password 2 more times. What is the expected state?',
        options: ['Not locked; the success reset the counter, which is now 2', 'Locked, because there have been 5 failed attempts in total', 'Not locked, but the very next failure will lock the account', 'Locked on this browser only, because counting is per device'],
        correct: 0,
        why: ['Right — AC3 resets the counter to zero, and AC2 needs 5 <b>consecutive</b> failures. Three more failures are needed to lock.', 'Ignores AC3 and the word “consecutive” in AC2.', 'The counter is at 2, not 4, so one more failure gives 3.', 'Nothing in the story says counting is per device — that is one of the open questions to ask.'] },
      { q: 'You need to confirm the account unlocks after 30 minutes, and you cannot change the lock duration. What is the most efficient approach?',
        options: ['Skip the unlock check; the developer said the unit tests cover it', 'Lock Ana, keep testing with Bilal and Chen, recheck Ana in 30 minutes', 'Set your laptop clock 30 minutes ahead and then try Ana’s account again', 'Lock all three accounts at once so that every unlock can be timed together'],
        correct: 1,
        why: ['Unit tests passing is not evidence that the deployed lock expires correctly. If you skip it, report it as untested.', 'Right — the wait runs in parallel with other useful testing, so it costs you almost nothing.', 'The lock timer runs on the server; changing your laptop clock does not affect it.', 'You would have no unlocked account for 30 minutes — a quarter of your test time wasted.'] },
      { q: 'At 15:45 you have logged four findings. Which should you raise as possible release blockers? Select all that apply.',
        options: ['Typing the email in capitals (ANA@PEOPLEOPS.TEST) gives 5 fresh attempts, so the lock never triggers', 'The lock message says “Try again latter” instead of “later”', 'Users whose email contains a + sign cannot sign in, even with the correct password', 'The Sign in button sits 2px lower than the design in Firefox'],
        correct: [0, 2],
        why: ['Correct — this defeats the lockout, the security purpose of the story. High severity; the team must decide before release.', 'A real defect worth fixing, but low severity — users still understand the message.', 'Correct — some real users cannot sign in at all (AC1 fails for them). High severity.', 'A cosmetic difference with no functional impact; log it, but it should not block release.'] }
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: 'sc-coupon-triage',
    title: 'Morning triage: ShopFlow coupon bugs',
    level: 'beginner',
    stages: ['manual'],
    minutes: 15,
    summary: 'Five bug reports arrive the morning a ShopFlow coupon campaign launches. Judge severity and priority, find the duplicate, fix a weak report and plan retest versus regression.',
    brief: [
      { t: 'p', html: 'ShopFlow’s <b>SAVE20</b> campaign starts at <b>12:00 today</b>, when a promo email goes to 200,000 customers. Five bugs were reported overnight. At 10:00 you join a triage call with the product manager (who sets priority) and the dev lead.' },
      { t: 'list', items: [
        'SAVE20 gives 20% off the <b>merchandise subtotal</b>. Shipping is never discounted.',
        'One coupon per order. Gift cards can be combined with coupons.',
        'Loyalty points: 1 point per $1 of merchandise subtotal <b>before</b> coupons.'
      ] },
      { t: 'table', caption: 'Overnight bug reports', head: ['ID', 'Reported by', 'Report (as written)'], rows: [
        ['SF-301', 'QA (Sara)', '<b>SAVE20 also discounts shipping.</b> Steps: add items worth $40.00, choose Standard shipping ($10.00), apply SAVE20. Expected discount $8.00; actual $10.00. Chrome 129, staging build 4.2.0, screenshot attached.'],
        ['SF-302', 'Support', '<b>Coupon doesn’t work.</b> “Customer says the coupon doesn’t work. Pls fix ASAP!!”'],
        ['SF-303', 'QA (Bilal)', '<b>500 error at checkout with coupon + gift card.</b> Steps attached, request ID <code>req-7f3a</code>. Gift cards are used in about 3% of orders.'],
        ['SF-304', 'Marketing', '<b>Brand name spelled “ShopFIow” (capital i) in the home-page promo banner.</b> Screenshot attached.'],
        ['SF-305', 'Support', '<b>Discount too big.</b> Order #88231: merchandise $100.00, shipping $30.00, discount shown $26.00.']
      ] },
      { t: 'code', lang: 'text', title: 'Release note for the fix', code: 'Build 4.2.1 (staging)\n- SF-301: discount calculation moved into the shared PriceService.\n  PriceService is also used by: gift card balance, loyalty points.\n- No other changes.' }
    ],
    questions: [
      { q: 'How should SF-304 (the misspelled brand name in the promo banner) be classified?',
        options: ['High severity, high priority', 'Low severity, high priority', 'Low severity, low priority', 'High severity, low priority'],
        correct: 1,
        why: ['The banner works and blocks nobody, so the impact on the system is small — severity is low even though it is urgent.', 'Right — tiny functional impact, but 200,000 customers will see the brand misspelled at noon, so the business wants it fixed now.', 'Severity is low, but priority is a business decision, and a brand typo in a mass campaign is usually urgent.', 'Reversed — the impact is small; it is the urgency that is high.'] },
      { q: 'Which statement about SF-303 is most accurate?',
        options: ['Severity is low, because only about 3% of orders use gift cards', 'Priority is the tester’s decision, because the tester found the bug', 'High severity (checkout fails); the PM decides priority', 'Severity and priority must always match, so both should be medium'],
        correct: 2,
        why: ['How many users are affected feeds into priority. Severity describes the impact when it happens, and a failed checkout is severe.', 'Testers assess severity and may recommend a priority, but priority is a business/product decision.', 'Right — the tester rates the impact (customers cannot pay); the product manager decides urgency, considering reach and the campaign.', 'They are independent. SF-304 shows low severity can go with high priority.'] },
      { q: 'What should you do with SF-305?',
        options: ['Verify $130 × 20% = $26, then link it as a duplicate of SF-301', 'Close SF-305 as “not a bug”, since the customer got more discount, not less', 'Keep SF-305 open as a separate bug so Support can track their own report', 'Mark SF-301 a duplicate of SF-305, because customer reports take precedence'],
        correct: 0,
        why: ['Right — $100 + $30 = $130 and 20% of that is $26 (expected $20), so shipping was discounted: the same root cause as SF-301. Link it and keep the real order as extra evidence.', 'Over-discounting breaks the rule and loses money on every coupon order — it is a real defect.', 'Two open bugs for one root cause split effort and confuse status. Link them; Support can follow the original.', 'Normally the newer, weaker report becomes the duplicate. SF-301 is older and has steps and environment.'] },
      { q: 'SF-302 cannot be acted on yet. Which details should you ask Support to collect? Select all that apply.',
        options: ['The customer’s full card number so you can repeat the payment', 'The exact code typed and the steps leading up to it', 'Whether the developer thinks it is a frontend or backend bug', 'What actually happened — the error text or a screenshot', 'Order or cart ID, date and time, device and browser'],
        correct: [1, 3, 4],
        why: ['Never collect card numbers in a bug report. It is sensitive and unnecessary — an order or cart ID is enough to trace it.', 'Correct — “SAVE 20”, “save20” or an old code behave differently. Exact input and steps make it reproducible.', 'A guess about the cause does not help reproduce the problem; facts from the customer do.', 'Correct — “doesn’t work” could mean an error, no discount, or the wrong discount (maybe SF-301 again).', 'Correct — these let you find logs for that session and match the environment.'] },
      { q: 'Which report should not be scheduled for a fix yet?',
        options: ['SF-303 — 500 error with a gift card', 'SF-304 — brand typo in the banner', 'SF-302 — “Coupon doesn’t work”', 'SF-301 — shipping is discounted'],
        correct: 2,
        why: ['Reproducible with steps and a request ID; the team can estimate and fix it.', 'Trivial to fix and urgent for the campaign.', 'Right — nobody can reproduce or estimate it yet. Request details first; it may turn out to be a duplicate or a user typing an expired code.', 'Clear steps, clear expected result and money at stake — ready to fix.'] },
      { q: 'Build 4.2.1 fixes SF-301. Which test plan fits the release note best?',
        options: ['Retest SF-301 only; the release note says nothing else changed', 'Run the whole regression suite first, then retest SF-301 if any time is left', 'Regression-test gift cards and loyalty only; the fix itself is done', 'Retest SF-301 and order #88231, then regression around PriceService users'],
        correct: 3,
        why: ['“No other changes” is misleading: PriceService is shared, so gift cards and loyalty may be affected. A retest alone misses that.', 'A full suite before noon is unrealistic, and the fix itself should be confirmed first.', 'You still need to confirm the fix works (confirmation testing). “Done” is the developer’s claim, not evidence.', 'Right — confirmation testing of the fix (including the $130 order), then regression testing focused on everything that uses the changed service.'] },
      { q: 'The SF-301 retest passes on 4.2.1. During regression you see that a $100 merchandise order with SAVE20 now earns 80 loyalty points; on 4.2.0 it earned 100. What is this?',
        options: ['A regression — log a new bug linked to the 4.2.1 change', 'A failed retest — reopen SF-301 and attach the loyalty points evidence', 'Expected — points should follow the discounted total', 'A duplicate of SF-305 — add a comment there'],
        correct: 0,
        why: ['Right — something that worked in 4.2.0 broke after the change. The rule says points are based on the subtotal <b>before</b> coupons, so 80 is wrong.', 'SF-301 (the shipping discount) is fixed — the retest passed. Reopening it mixes two different problems.', 'The rule says 1 point per $1 <b>before</b> coupons, so 100 points is correct.', 'SF-305 is about shipping being discounted; this is a different behaviour in a different feature.'] },
      { q: 'Which features make SF-301 a stronger report than SF-302? Select all that apply.',
        options: ['It was logged by QA, so its priority is automatically higher', 'It states expected and actual amounts, based on the written rule', 'It names the line of code that is wrong', 'It gives steps, the build, the browser and a screenshot'],
        correct: [1, 3],
        why: ['Who logged a bug does not set its priority; the product manager decides.', 'Correct — “expected $8.00, actual $10.00” is clear and checkable against the rule.', 'Read the report again — it does not. Good reports describe behaviour; root cause is for the developer to find.', 'Correct — anyone can reproduce it in the same environment.'] }
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: 'sc-sprint-risk',
    title: 'Too many stories, too little time: a PayLite sprint',
    level: 'intermediate',
    stages: ['foundations', 'manual'],
    minutes: 15,
    summary: 'You are the only tester on a PayLite sprint with more test work than time. Score risk, ask the right three amigos questions, apply the Definition of Done and communicate what you defer.',
    brief: [
      { t: 'p', html: 'You are the only tester on the <b>PayLite</b> wallet team. The two-week sprint has four stories. After meetings and support duties you have about <b>20 hours</b> of test time, but your first estimate adds up to <b>25 hours</b>. Sprint review is on Friday of week 2.' },
      { t: 'table', caption: 'Sprint backlog', head: ['Story', 'Change', 'Test estimate', 'Notes'], rows: [
        ['PL-41', 'Send money: new daily limit of <b>50,000 PKR</b> per user', '10 h', 'Changes the transfer service, which had 6 production bugs last quarter'],
        ['PL-42', 'Dark mode for the Settings screens', '6 h', 'Uses a new CSS theme library; no money involved'],
        ['PL-43', 'Bill payment: add electricity provider “VoltCo”', '8 h', 'Third-party API; its docs are two years old; VoltCo sandbox open only Wed–Thu of week 2'],
        ['PL-44', 'Rename the “Recent activity” tab to “History”', '1 h', 'The UI automation suite finds this tab with <code>getByText(\'Recent activity\')</code>']
      ] },
      { t: 'callout', tone: 'key', title: 'Team risk scoring', html: 'Risk = <b>Likelihood (1–3) × Impact (1–3)</b>. Score 6–9: test deeply · 3–4: test the main paths · 1–2: quick check.' },
      { t: 'list', items: [
        'Definition of Done (excerpt): acceptance criteria tested',
        'No open <b>Critical</b> or <b>High</b> defects on the story',
        'Regression checklist run for affected areas; test notes attached to the story'
      ] }
    ],
    questions: [
      { q: 'Using the team’s scoring, which rating fits PL-41 best?',
        options: ['Likelihood 1 × Impact 3 = 3: important, but the code is mature', 'Likelihood 3 × Impact 1 = 3: buggy area, but limits are a minor feature', 'Likelihood 2 × Impact 2 = 4: an average story, so test the main paths', 'Likelihood 3 × Impact 3 = 9: test deeply'],
        correct: 3,
        why: ['Six production bugs last quarter and a change to that service mean likelihood is high, not low.', 'A wrong limit moves real money or blocks legitimate transfers — impact is high.', 'Both factors are clearly at the top of the scale here; averaging hides the risk.', 'Right — a history of defects plus a change raises likelihood, and money movement makes impact high. It earns the deepest testing.'] },
      { q: 'What matters most when you test PL-44?',
        options: ['Update and run the UI tests that find the tab by its old text, then check the label', 'Nothing: a one-word label change cannot break anything, so mark it done untested', 'Run the full regression suite, because any change can break any feature', 'Ask the developer to write unit tests for the new label text'],
        correct: 0,
        why: ['Right — the brief says automation locates the tab by “Recent activity”. Those tests will fail after the rename even though the product works. Fixing them is part of the story.', 'The notes show a real side effect (the automation), and even a quick check is cheap.', 'Score 1–2 means a quick check; a full regression run for a label is waste.', 'Unit tests on a text label add little; the visible risk is the broken UI automation.'] },
      { q: 'Which questions should you raise in the three amigos session for PL-41? Select all that apply.',
        options: ['Is the limit per calendar day (in which time zone) or a rolling 24 hours?', 'Which programming language will the transfer service be written in?', 'Do failed or reversed transfers count toward the daily limit?', 'Can testing of PL-41 be skipped, since the developer will write unit tests?', 'Is a transfer that makes the day’s total exactly 50,000 PKR allowed?'],
        correct: [0, 2, 4],
        why: ['Correct — “daily” is ambiguous, and midnight in which time zone changes the expected results.', 'An implementation detail that does not change the expected behaviour you need to test.', 'Correct — whether failed or reversed transfers use up the limit changes the expected results; the story does not say.', 'Unit tests are welcome but do not replace testing the highest-risk story in the sprint.', 'Correct — a boundary question: is 50,000 inclusive? It decides your boundary tests (49,999 / 50,000 / 50,001).'] },
      { q: 'The VoltCo sandbox is only open on Wednesday and Thursday of week 2. What is the best plan for PL-43?',
        options: ['Leave PL-43 alone until Wednesday, when the sandbox becomes available', 'Test against VoltCo’s live API with a small real bill payment to save time', 'Accept the developer’s unit tests as evidence and mark PL-43 as done', 'Prepare cases now, test early against a stub, book the sandbox slots'],
        correct: 3,
        why: ['Waiting wastes week 1 and squeezes all the work into two days with no slack for fixes.', 'Using a live payment API for testing risks real charges and breaks the provider’s terms; use the sandbox.', 'Unit tests do not prove the integration works against the real provider, especially with old docs.', 'Right — do the preparation now, use a stub or mock for early checks, and reserve sandbox time. Also flag that two-year-old docs may not match the real API.'] },
      { q: 'You must cut about 5 hours from your 25-hour plan. Which decision is most defensible?',
        options: ['Cut PL-41 to happy-path checks only, since its developer is very experienced', 'Split the 20 hours equally, so each story gets about 5 hours of testing', 'Give PL-42 a one-hour light check and tell the PO what is not covered', 'Work evenings to cover all 25 hours without mentioning the gap to anyone'],
        correct: 2,
        why: ['PL-41 is the highest risk; experience does not remove the history of defects in that service.', 'Equal time ignores risk: PL-44 needs one hour, PL-41 needs ten.', 'Right — PL-42 has the lowest impact (cosmetic, no money). 10 + 1 + 8 + 1 = 20 hours. Making the gap visible lets the PO accept or change it.', 'Hidden overtime is not sustainable and hides a real planning problem from the team.'] },
      { q: 'On Thursday, PL-41 has an open High-severity defect: the limit can be bypassed by sending two transfers in the same second. The PO wants PL-41 counted as done at the review. What do you say?',
        options: ['It is done — every acceptance criterion has been tested at least once', 'Not done under our DoD; fix it first, or the PO moves it to the next sprint', 'Lower the defect to Medium so that it no longer blocks the Definition of Done', 'Close the defect as “cannot reproduce”, since it needs two transfers in one second'],
        correct: 1,
        why: ['Testing the criteria is only one part of the DoD; it also forbids open High defects.', 'Right — state the DoD calmly and offer options. The PO may decide, but the decision and its risk are visible.', 'Changing severity to pass a gate hides real risk. Severity reflects impact, and a bypassed money limit is high.', 'You did reproduce it. Timing-dependent bugs are exactly what attackers script.'] },
      { q: 'Which items belong in your end-of-sprint test summary? Select all that apply.',
        options: ['What was tested for each story, and the results', 'A statement that the sprint’s stories now contain no remaining bugs', 'What was only lightly tested or not tested (PL-42 screens), and why', 'Open defects with their severity and the risk they leave', 'A ranking of which developers caused the most defects'],
        correct: [0, 2, 3],
        why: ['Correct — the core of any test summary.', 'Testing shows the presence of defects, not their absence. No tester can promise zero bugs.', 'Correct — reduced coverage must be visible so the PO owns the decision.', 'Correct — residual risk is what the team needs to decide on release.', 'Blaming individuals harms the team and says nothing about product risk.'] }
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: 'sc-orders-api',
    title: 'Exploring the ShopFlow Orders API',
    level: 'intermediate',
    stages: ['sql-api'],
    minutes: 15,
    summary: 'Four API calls, four surprises. Read real requests and responses, spot status-code and access-control defects, verify persistence and decide which assertions to automate.',
    brief: [
      { t: 'p', html: 'Before the mobile app switches to <b>ShopFlow Orders API v2</b>, you run an exploratory session in an API client on staging with two test users: <b>Ayesha</b> (user 17) and <b>Omar</b> (user 23). You also have read-only access to the staging database.' },
      { t: 'list', items: [
        '<code>POST /api/v2/orders</code> creates an order for the authenticated user and returns 201 with a <code>Location</code> header.',
        'A user may read <b>only their own</b> orders.',
        'Errors use the body <code>{"error": {"code", "message"}}</code>.'
      ] },
      { t: 'code', lang: 'http', title: 'Calls 1–2', code: '### 1. Ayesha creates an order\nPOST /api/v2/orders HTTP/1.1\nHost: api.shopflow.test\nAuthorization: Bearer eyJ...ayesha\nContent-Type: application/json\n\n{"items":[{"sku":"MUG-01","qty":2}],"addressId":"addr-17-1"}\n\nHTTP/1.1 201 Created\nLocation: /api/v2/orders/9001\nContent-Type: application/json\n\n{"id":9001,"status":"created","total":1800}\n\n### 2. Ayesha reads it back, two seconds later\nGET /api/v2/orders/9001 HTTP/1.1\nAuthorization: Bearer eyJ...ayesha\n\nHTTP/1.1 404 Not Found\n{"error":{"code":"ORDER_NOT_FOUND","message":"Order not found"}}' },
      { t: 'code', lang: 'http', title: 'Calls 3–4', code: '### 3. Omar (user 23) requests Ayesha\'s older order 8875\nGET /api/v2/orders/8875 HTTP/1.1\nAuthorization: Bearer eyJ...omar\n\nHTTP/1.1 200 OK\n{"id":8875,"userId":17,"status":"delivered","total":4200,\n "shippingAddress":"House 12, Street 4, Gulberg, Lahore"}\n\n### 4. Ayesha\'s token expired at 10:00; sent at 10:05\nGET /api/v2/orders/8875 HTTP/1.1\nAuthorization: Bearer eyJ...ayesha-expired\n\nHTTP/1.1 403 Forbidden\n{"error":{"code":"FORBIDDEN","message":"Access denied"}}' }
    ],
    questions: [
      { q: 'Which observations are defects? Select all that apply.',
        options: ['Call 1’s response body includes the new order’s <code>id</code>', 'Call 3 returns 200 with Ayesha’s order and address to Omar', 'Call 1 returns 201 with a Location, but GET on that Location returns 404', 'Call 2’s error body uses the documented <code>error.code</code> format', 'Call 4 returns 403 for an expired token'],
        correct: [1, 2, 4],
        why: ['Returning the id is normal and useful; it is not a defect.', 'Correct — this breaks “a user may read only their own orders”: an IDOR (insecure direct object reference) exposing personal data.', 'Correct — a created resource should be readable at its Location. Either it was not saved or the read is broken.', 'The error format matches the documented contract — the defect in call 2 is the 404 itself, not the body shape.', 'Correct — an expired token means the caller is not authenticated: the right status is 401, not 403.'] },
      { q: 'Ayesha’s token expired at 10:00. Which status should the 10:05 request get, and why?',
        options: ['403 — she is known to the system but is no longer allowed in', '401 — the credentials are no longer valid, so she is not authenticated', '400 — the request is malformed because the token is out of date', '404 — hide the order, because an expired token cannot be trusted at all'],
        correct: 1,
        why: ['403 means “authenticated, but not permitted”. With an expired token the server cannot authenticate her at all.', 'Right — 401 Unauthorized covers missing, invalid and expired credentials. Clients use it to refresh the token or send the user to log in.', 'The request is well-formed; the problem is authentication.', '404 can hide resources from authenticated users who lack access, but an unauthenticated request should get 401.'] },
      { q: 'For call 3 (Omar asking for Ayesha’s order), which response would be acceptable?',
        options: ['200 with the address partly masked, e.g. “House ***, Lahore”', '401, because Omar is not the owner of the order he requested', '403 or 404 with no order data; 404 also hides that the order exists', '302 redirect to Omar’s own most recent order instead'],
        correct: 2,
        why: ['Masking still leaks the order, its status and part of the address. Omar should get no data.', 'Omar is authenticated — his token is valid. Not being allowed is an authorization problem, not 401.', 'Right — 403 says “you may not”; 404 deliberately hides the resource. Both are acceptable if the team is consistent.', 'Silently returning a different resource confuses clients and hides the access-control decision.'] },
      { q: 'What is the best next step to investigate calls 1–2?',
        options: ['Mark the create test as passed, because 201 Created means it was saved', 'Insert order 9001 into the database by hand so the GET can be tested', 'Log “GET /orders is broken” straight away, then move on to the next endpoint', 'Repeat the GET, then check with a read-only query whether order 9001 exists'],
        correct: 3,
        why: ['A 201 status alone does not prove persistence — the 404 is direct evidence that something is wrong.', 'Writing to the database hides the defect and changes the system you are testing.', 'You do not yet know whether create or read is broken. Gather evidence first so the report points to the right place.', 'Right — rule out a timing issue, then check the database (read-only) to see whether the row exists. Note the time and any request IDs.'] },
      { q: 'Five minutes later, the read-only query SELECT id, user_id FROM orders WHERE id = 9001; still returns zero rows. What is the most likely conclusion?',
        options: ['The order was never saved: create returned 201 without persisting it', 'The GET endpoint reads from the wrong table and needs fixing', 'Replication lag — wait longer and the order will appear', 'Ayesha’s account is only test data, so the result can be ignored'],
        correct: 0,
        why: ['Right — no row exists, so the problem is in create: the API reported success without saving. High severity, because customers would think they ordered.', 'The read is behaving correctly — there is nothing to read.', 'Five minutes on staging makes simple lag unlikely; raise it as a question, but the evidence points to create.', 'Test data still shows real product behaviour — the same code path runs for real customers.'] },
      { q: 'Which assertions should the automated check for POST /orders include? Select all that apply.',
        options: ['Response time is under 50 ms on every single run', 'Status is 201 and a <code>Location</code> header is present', 'The body exactly matches a saved snapshot, including <code>id</code> and timestamps', 'The created order belongs to the user in the token', 'A follow-up GET to the Location returns 200 with the same items and total'],
        correct: [1, 3, 4],
        why: ['A tight timing threshold in a functional test makes it flaky; measure performance separately.', 'Correct — the documented contract for create.', 'IDs and timestamps change every run, so an exact snapshot will fail for no reason. Assert stable fields.', 'Correct — confirms the server takes ownership from the token, not from the request body.', 'Correct — this is how you prove persistence through the API instead of trusting the status code.'] },
      { q: 'Which follow-up best shows the scope of the access-control defect from call 3?',
        options: ['As Omar, try PATCH and DELETE on order 8875, plus other order endpoints', 'Repeat Omar’s GET twenty times to confirm it is consistent', 'Send Ayesha’s own valid token to order 8875 and compare both responses', 'Run a load test on GET /orders/{id} with 500 virtual users'],
        correct: 0,
        why: ['Right — if reads are unprotected, writes may be too. Stay within test accounts and staging.', 'Once is enough for a deterministic 200; repetition adds no information about scope.', 'That only checks the owner’s access, which is not the problem.', 'Load says nothing about whether other users’ data is exposed.'] }
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: 'sc-sql-integrity',
    title: 'Charged twice: a ShopFlow data investigation',
    level: 'intermediate',
    stages: ['sql-api'],
    minutes: 16,
    summary: 'Customers say they were charged twice after a flash sale. Use query results to find duplicate orders and orphaned payments, pick the right SQL and recommend constraints that prevent a repeat.',
    brief: [
      { t: 'p', html: 'After last night’s ShopFlow flash sale (from 21:00), Support received complaints: “I clicked <b>Place order</b> once, the page hung, I clicked again — now I’m charged twice.” You have <b>read-only</b> access to the production database replica. Here is the relevant schema.' },
      { t: 'code', lang: 'sql', title: 'Schema (simplified)', code: "CREATE TABLE orders (\n  id          INT PRIMARY KEY,\n  customer_id INT NOT NULL,\n  cart_id     VARCHAR(36) NOT NULL,  -- one cart should become one order\n  total       DECIMAL(10,2) NOT NULL,\n  created_at  TIMESTAMP NOT NULL\n);\n\nCREATE TABLE payments (\n  id       INT PRIMARY KEY,\n  order_id INT,                      -- no foreign key\n  amount   DECIMAL(10,2) NOT NULL,\n  status   VARCHAR(20) NOT NULL       -- 'captured', 'refunded', 'failed'\n);" },
      { t: 'table', caption: 'Result 1 · SELECT * FROM orders WHERE customer_id = 5521;', head: ['id', 'customer_id', 'cart_id', 'total', 'created_at'], rows: [
        ['7710', '5521', 'c-9f2e', '64.00', '2026-11-10 21:14:03'],
        ['7711', '5521', 'c-9f2e', '64.00', '2026-11-10 21:14:04'],
        ['7712', '5521', 'c-1a7b', '12.50', '2026-11-10 21:40:19']
      ] },
      { t: 'table', caption: 'Result 2 · payments for those orders, plus one a support agent found (no order with id 7799 exists)', head: ['id', 'order_id', 'amount', 'status'], rows: [
        ['3301', '7710', '64.00', 'captured'],
        ['3302', '7711', '64.00', 'captured'],
        ['3303', '7799', '30.00', 'captured'],
        ['3304', '7712', '12.50', 'captured']
      ] },
      { t: 'callout', tone: 'warn', title: 'Constraints', html: 'Read-only access · the data contains personal information (names, emails, addresses) · avoid heavy queries during business hours.' }
    ],
    questions: [
      { q: 'Which query lists carts that turned into more than one order?',
        options: ['<code>SELECT DISTINCT cart_id FROM orders;</code>', '<code>SELECT cart_id, COUNT(*) FROM orders WHERE COUNT(*) &gt; 1 GROUP BY cart_id;</code>', '<code>SELECT cart_id, COUNT(*) FROM orders GROUP BY cart_id HAVING COUNT(*) &gt; 1;</code>', '<code>SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) &gt; 1;</code>'],
        correct: 2,
        why: ['DISTINCT collapses duplicates into one row each — it hides exactly what you are looking for.', 'Aggregates cannot be used in WHERE, which filters rows before grouping; this query fails. Filter groups with HAVING.', 'Right — group by the cart and keep only groups with more than one order.', 'This finds customers with more than one order, which is normal for repeat buyers — customer 5521’s order 7712 is legitimate.'] },
      { q: 'Which observations in Results 1 and 2 support the double-submission theory? Select all that apply.',
        options: ['Orders 7710 and 7711 share the cart <code>c-9f2e</code>', 'Those two orders were created one second apart', 'Payment 3303 points to order 7799, which does not exist', 'Order 7712 has a different cart and a different total', 'Each of the two orders has its own captured $64.00 payment'],
        correct: [0, 1, 4],
        why: ['Correct — one cart should become one order; two orders from one cart is the core symptom.', 'Correct — one second apart matches a second click while the page hung.', 'A real problem, but a separate one (an orphaned payment), not evidence of the double click.', 'This is a normal, separate purchase — it does not support the theory.', 'Correct — two captures explain why the customer sees two charges.'] },
      { q: 'Which query lists payments that do not belong to any existing order?',
        options: ['<code>SELECT p.* FROM payments p JOIN orders o ON o.id = p.order_id;</code>', '<code>SELECT p.* FROM payments p LEFT JOIN orders o ON o.id = p.order_id WHERE o.id = NULL;</code>', '<code>SELECT o.* FROM orders o LEFT JOIN payments p ON p.order_id = o.id WHERE p.id IS NULL;</code>', '<code>SELECT p.* FROM payments p LEFT JOIN orders o ON o.id = p.order_id WHERE o.id IS NULL;</code>'],
        correct: 3,
        why: ['An inner join returns only payments that do have a matching order — the opposite of what you need.', 'Nothing is ever equal to NULL, so <code>= NULL</code> returns no rows. Use <code>IS NULL</code>.', 'This is the reverse question: orders that have no payment.', 'Right — keep every payment, and the ones with no matching order have NULL in the order columns.'] },
      { q: 'What does payment 3303 most likely indicate?',
        options: ['Money was captured for an order that does not exist — refund and investigate', 'Normal behaviour: payments are often stored before their orders', 'A third charge for cart c-9f2e, which proves the double-click bug', 'A display bug in the database client; order 7799 probably exists'],
        correct: 0,
        why: ['Right — with no foreign key, nothing stopped a payment that references a missing order (perhaps the order insert failed after capture). A customer may have paid for nothing.', 'Even if a payment is recorded first, its order should exist afterwards. A day later, 7799 is still missing.', 'It is $30.00 for order 7799 — no link to cart c-9f2e or its $64.00 orders.', 'The brief states no order 7799 exists; blaming the tool without evidence delays a money problem.'] },
      { q: 'Which changes would prevent or detect these problems? Select all that apply.',
        options: ['An index on <code>orders.created_at</code>', 'A <code>UNIQUE</code> constraint on <code>orders.cart_id</code>', 'A foreign key from <code>payments.order_id</code> to <code>orders.id</code>', 'Storing <code>total</code> and <code>amount</code> as FLOAT instead of DECIMAL', 'An idempotency key on Place order, so a retried request returns the first order'],
        correct: [1, 2, 4],
        why: ['An index can speed up queries but enforces no rule, so duplicates still get in.', 'Correct — the database itself refuses a second order for the same cart.', 'Correct — payments can no longer reference orders that do not exist.', 'FLOAT introduces rounding errors; money belongs in DECIMAL. This makes things worse.', 'Correct — the API recognises the repeated click and returns the original order instead of creating a new one.'] },
      { q: 'Your GROUP BY query finds 37 carts with two orders since 21:00. How should you present this in the bug report?',
        options: ['Paste all 37 customers’ names, emails and order rows into the ticket', 'Give the count, the time window, a few order IDs and the query you used', 'Write “lots of customers were charged twice” and let developers dig', 'Delete the 37 duplicate orders yourself so customers stop complaining'],
        correct: 1,
        why: ['Personal data does not belong in a widely visible ticket; order IDs are enough to trace each case.', 'Right — specific, reproducible and minimal: anyone can re-run the query, and the business can size refunds.', 'Vague impact makes it hard to prioritise; the numbers are your strongest evidence.', 'You have read-only access for good reason. Deleting orders refunds no one, destroys evidence and breaks payment records.'] },
      { q: 'The fix adds a UNIQUE constraint on orders.cart_id through a database migration. What must the team deal with first?',
        options: ['Nothing — new constraints only apply to rows inserted afterwards', 'The existing duplicate carts, or the migration will fail', 'Nothing — the database will remove the duplicate rows by itself', 'The primary key on orders.id must be dropped before adding it'],
        correct: 1,
        why: ['Databases normally check existing rows when a unique constraint is added, so existing duplicates make it fail.', 'Right — the 37 duplicates (and their refunds) must be resolved first, and the migration should be tested on a copy of real data.', 'Constraints reject bad data; they never delete rows.', 'A table can have a primary key and other unique constraints at the same time.'] },
      { q: 'On staging, the fix adds an idempotency key to Place order plus the unique constraint. Which test gives the strongest evidence that it works?',
        options: ['Click Place order once on a fast connection and see one confirmation', 'Check that POST /orders still returns 201 Created after the change', 'Send two identical requests at once, then query: one order, one payment', 'Re-run the GROUP BY query on production and expect zero new rows'],
        correct: 2,
        why: ['A single click never triggered the bug, so this proves nothing about the fix.', 'A 201 says nothing about duplicates or persistence.', 'Right — reproduce the original conditions (concurrent duplicate submits, also a double-click on a throttled network) and verify the outcome in the data, not just the UI.', 'Useful monitoring after release, but it does not test the fix before release — zero rows may only mean nobody double-clicked yet.'] }
    ]
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: 'sc-mobile-upload',
    title: 'Lost uploads: MediBook prescription photos',
    level: 'intermediate',
    stages: ['web-mobile'],
    minutes: 15,
    summary: 'A new photo upload in the MediBook app crashes on one Android model, loses uploads in the background and mishandles denied permissions. Choose devices, design lifecycle tests and collect the right evidence.',
    brief: [
      { t: 'p', html: '<b>MediBook</b> 3.2 lets patients photograph a prescription and attach it to a clinic booking. The beta has been running for a week on Android and iOS. Three issues stand out.' },
      { t: 'table', head: ['Report', 'Device', 'Details'], rows: [
        ['CR-1 (crash reporter)', 'Zentro Z5 · Android 13 · 3 GB RAM', 'App closes right after the user takes a photo. 41 crashes this week, all on this model.'],
        ['FB-2 (beta feedback)', 'Nimbus 8 · Android 14', '“I started uploading on 4G, switched to my messages to reply, came back — the upload was gone. No error, and no photo on my booking.”'],
        ['FB-3 (beta feedback)', 'iPhone · iOS 17', '“I tapped Don’t Allow for the camera by mistake. Now Take photo does nothing at all.”']
      ] },
      { t: 'code', lang: 'text', title: 'CR-1 crash log (excerpt)', code: 'E AndroidRuntime: FATAL EXCEPTION: main\nE AndroidRuntime: Process: com.medibook.app, PID: 8812\nE AndroidRuntime: java.lang.OutOfMemoryError: Failed to allocate a\n  48000012 byte allocation with 25165824 free bytes and 24MB until OOM\nE AndroidRuntime:   at android.graphics.BitmapFactory.decodeFile(BitmapFactory.java)\nE AndroidRuntime:   at com.medibook.upload.PhotoPreview.load(PhotoPreview.kt:58)\nE AndroidRuntime:   at com.medibook.upload.UploadActivity.onPhotoTaken(UploadActivity.kt:112)' },
      { t: 'list', items: [
        'Analytics: 70% of users are on Android; the Zentro Z5 is 6% of Android users. Android 12–14 covers 85% of Android users.',
        'Device lab: Nimbus 8 (Android 14), Nimbus 6 (Android 12), one iPhone (iOS 17), plus emulators and simulators.',
        'Budget: you may buy or rent <b>one</b> more device this sprint.'
      ] }
    ],
    questions: [
      { q: 'Read the CR-1 crash log. Which hypothesis fits it best?',
        options: ['The upload request times out on slow mobile networks and the whole app crashes', 'Camera permission was denied, and the app did not handle the denial', 'The server rejects files over 25 MB and the app cannot parse the error', 'The full-resolution photo is decoded into memory without being scaled down'],
        correct: 3,
        why: ['The stack trace is in PhotoPreview.load, decoding a bitmap — before any upload starts. No network error appears.', 'A permission problem would show a security error or no camera at all, not an OutOfMemoryError after a photo was taken.', 'A server rejection arrives as an HTTP response; this crash happens on the device while decoding the image.', 'Right — a 48 MB allocation is roughly a 12-megapixel photo at 4 bytes per pixel. Decoding it at full size runs out of memory on low-RAM phones first.'] },
      { q: 'You can buy or rent one extra device. Which choice gives the most value?',
        options: ['A new flagship Android phone, to cover the very latest OS version', 'The Zentro Z5 itself, or another low-RAM model with the same OEM camera app', 'An Android tablet, because the upload screen also has a tablet layout', 'None — an emulator set to 3 GB of RAM reproduces this crash exactly'],
        correct: 1,
        why: ['Flagships have plenty of memory and are the least likely to show this crash.', 'Right — all 41 crashes are on this model (6% of Android users). You need it to reproduce the crash and to confirm the fix.', 'Nothing in the reports points at tablets.', 'Emulators help, but they do not reproduce the OEM camera app, real memory pressure from other apps, or the vendor’s Android changes.'] },
      { q: 'Which aspects of these issues need a real device rather than an emulator or simulator? Select all that apply.',
        options: ['How the Zentro Z5’s own camera app hands the photo back', 'Checking the wording of the upload screen labels', 'Uploads on a real 4G connection while the signal changes', 'Basic layout of the upload screen at common screen sizes', 'Real memory pressure with other apps open on a 3 GB phone'],
        correct: [0, 2, 4],
        why: ['Correct — OEM camera apps differ (image size, rotation data, how they return results). Emulators use a generic camera.', 'Text can be checked anywhere, including an emulator.', 'Correct — network throttling helps, but real radio conditions, handovers and power saving only happen on devices.', 'Emulators and simulators handle screen sizes well; this is a good use of them.', 'Correct — emulators run on a powerful host and do not reproduce a real low-RAM phone under load.'] },
      { q: 'Which test reproduces FB-2 most faithfully?',
        options: ['Upload a 100 KB photo on fast Wi-Fi and watch it finish inside the app', 'Rotate the phone during an upload, then check that the photo was saved', 'Start an 8 MB upload on a throttled network, switch apps for a minute, return', 'Force-close the app before tapping upload, then reopen it and try again'],
        correct: 2,
        why: ['A small, fast upload finishes before the user could leave the app, so the bug never appears.', 'Rotation is a useful lifecycle test, but FB-2 is about going to the background.', 'Right — a slow upload plus backgrounding matches the report. Repeat with the screen locked and with Android’s “Don’t keep activities” option to simulate the OS killing the app.', 'Closing the app before the upload starts does not test what happens to an upload in progress.'] },
      { q: 'The spec does not say what should happen if the app goes to the background mid-upload. Which expected behaviour should you propose to the product owner?',
        options: ['Discard the upload silently; the user can always take the photo again', 'Prevent the user from leaving the app while an upload is in progress', 'Restart the upload from zero on return, without telling the user', 'Continue or resume the upload, show progress and offer retry if it fails'],
        correct: 3,
        why: ['Silent data loss is exactly the complaint in FB-2; the user thinks the booking has the photo.', 'Apps cannot stop users switching apps or taking calls, and should not try.', 'Better than losing it, but silent restarts waste mobile data and leave the user unsure what happened.', 'Right — no silent loss: the user always sees the state and can retry without retaking the photo. Write it down as an acceptance criterion so it can be tested.'] },
      { q: 'Which permission scenarios belong in your test set for FB-3? Select all that apply.',
        options: ['Deny at the first prompt, then tap Take photo again', 'Expect the system camera prompt to reappear every time Take photo is tapped', 'Grant the permission later in system Settings, then return to the app', 'Revoke the permission in Settings while the app is in the background', 'Test only with permission granted, since denying is the user’s choice'],
        correct: [0, 2, 3],
        why: ['Correct — this is FB-3 itself. Expected: an explanation and a way forward (open Settings or choose from gallery), not a dead button.', 'On iOS the system prompt is shown only once; after a denial the app must explain and point to Settings. Expecting the prompt again is the wrong expected result.', 'Correct — the app should notice the new permission and let the user take a photo without restarting.', 'Correct — the OS may restart the app when a permission is revoked; it must recover without crashing or losing the booking.', 'Denial is a normal, expected path. Untested denial paths cause exactly the dead button in FB-3.'] },
      { q: 'Which evidence makes the CR-1 bug report most actionable?',
        options: ['Model, OS version, app build, full stack trace, steps, photo size, free RAM', 'A screen recording of the crash; other details are not needed', 'The title “App crashes on Android” and the number of crashes so far', 'Copies of angry store reviews from affected users, to show how serious it is'],
        correct: 0,
        why: ['Right — these details let a developer reproduce the crash and confirm the cause (image size versus available memory).', 'A recording shows that it crashed but not why; the stack trace and environment matter more.', 'Too vague: it happens on one model, after taking a photo. The count helps priority, not diagnosis.', 'Reviews can help the PM judge priority, but they do not help anyone reproduce or fix the crash.'] }
    ]
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: 'sc-flaky-ci',
    title: 'One in six: a flaky Playwright test in CI',
    level: 'advanced',
    stages: ['automation', 'code-git'],
    minutes: 18,
    summary: 'A PeopleOps Playwright test fails about one run in six, only in CI. Read the code and the CI log, diagnose two different causes, choose real fixes and set a sensible quarantine policy.',
    brief: [
      { t: 'p', html: 'The PeopleOps suite runs on every pull request with <b>4 parallel workers</b> and <code>retries: 1</code>. One test fails in about 1 of 6 CI runs but has never failed locally, where developers run a single worker. The team has started clicking “Re-run” until the pipeline goes green. Tracing is currently <code>off</code>.' },
      { t: 'code', lang: 'ts', title: 'leave/submit.spec.ts', code: "import { test, expect } from '@playwright/test';\n\ntest('employee can submit a leave request', async ({ page }) => {\n  await page.goto('/login');\n  await page.fill('#email', 'qa.shared@peopleops.test'); // used by many specs\n  await page.fill('#password', process.env.QA_PASSWORD!);\n  await page.click('button.btn-primary');\n  await page.waitForTimeout(2000); // wait for the dashboard\n\n  await page.goto('/leave/new');\n  await page.getByLabel('Start date').fill('2026-12-01');\n  await page.getByLabel('End date').fill('2026-12-03');\n  page.getByRole('button', { name: 'Submit request' }).click();\n\n  const rows = await page.locator('.leave-row').count();\n  expect(rows).toBe(1);\n  await expect(page.getByText('Request submitted')).toBeVisible();\n});" },
      { t: 'code', lang: 'text', title: 'CI logs (two failing runs)', code: "Run #812 · 48 tests · 4 workers · retries: 1\n  x leave/submit.spec.ts:3 > employee can submit a leave request\n    Error: expect(received).toBe(expected)\n    Expected: 1\n    Received: 0\n      at leave/submit.spec.ts:16:16\n  ok (retry #1) leave/submit.spec.ts:3 > employee can submit a leave request\n  1 flaky · 47 passed\n\nRun #815 · 48 tests · 4 workers · retries: 1\n  x leave/submit.spec.ts:3 > employee can submit a leave request\n    Error: expect(received).toBe(expected)\n    Expected: 1\n    Received: 2\n      at leave/submit.spec.ts:16:16\n  ok (retry #1) leave/submit.spec.ts:3 > employee can submit a leave request\n  1 flaky · 47 passed" },
      { t: 'list', items: [
        '<code>leave/cancel.spec.ts</code> and <code>leave/approve.spec.ts</code> also sign in as <code>qa.shared@peopleops.test</code> and create their own leave requests.',
        'CI machines are slower than developer laptops; locally the test passed 50 runs in a row with one worker.'
      ] }
    ],
    questions: [
      { q: 'Which problems in the test code can cause intermittent failures? Select all that apply.',
        options: ['<code>waitForTimeout(2000)</code> used to wait for the dashboard', 'Using <code>getByLabel</code> to find the date fields', 'No <code>await</code> before the Submit request click', 'A one-time <code>count()</code> checked with a plain <code>expect</code>', 'Reading the password from an environment variable'],
        correct: [0, 2, 3],
        why: ['Correct — a fixed sleep is a guess: too short on a slow CI machine, wasted time on a fast one. Wait for a condition (for example the dashboard heading) instead.', 'Label-based locators are recommended — they are stable and auto-wait.', 'Correct — the click is started but not awaited, so the next line can run before the submit has happened.', 'Correct — <code>count()</code> returns immediately and the plain <code>expect</code> does not retry, so it captures whatever is on screen at that instant.', 'Keeping secrets out of code is good practice and has no effect on timing.'] },
      { q: 'What best explains “Received: 0” in run #812?',
        options: ['The shared account already had another leave request at that moment', 'The date fields rejected 2026-12-01 because the format was wrong', 'The rows were counted before the unawaited submit had finished', 'The server deleted the request because the session had expired'],
        correct: 2,
        why: ['Another request would make the count higher (2), not 0 — that is run #815.', 'The retry passed with exactly the same dates; a format problem would fail every time.', 'Right — the test moved straight on from the click, and <code>count()</code> does not wait. On a slower CI machine the new row was not there yet.', 'Nothing points to an expired session, and the retry passed seconds later with the same flow.'] },
      { q: 'What best explains “Received: 2” in run #815?',
        options: ['Another worker’s test created a request on the same shared account', 'A product bug: the app saved the same request twice on submit', 'The missing await made the click fire twice, creating two rows', 'The 2-second wait was too short, so the dashboard loaded twice'],
        correct: 0,
        why: ['Right — cancel.spec.ts and approve.spec.ts use the same account in parallel workers, so their requests can appear in this test’s list.', 'Possible in theory, but the retry passed and the shared account explains it. A failed automated test is not automatically a product bug — check the data first.', 'A missing await does not repeat a click; it only stops the test waiting for it.', 'Loading a page twice would not create an extra leave request.'] },
      { q: 'Which change fixes the counting step properly?',
        options: ['Increase <code>waitForTimeout</code> to 10 seconds before counting the rows', 'Await the click, then <code>await expect(rowsLocator).toHaveCount(1)</code>', 'Keep <code>count()</code>, but relax the check to <code>toBeGreaterThan(0)</code>', 'Set retries to 3 so that the test eventually goes green in CI'],
        correct: 1,
        why: ['A longer sleep slows every run and can still be too short on a bad day.', 'Right — a web-first assertion retries until the condition holds or the timeout passes, and awaiting the click keeps the steps in order. (The shared-account problem still needs its own fix.)', 'Still a one-time snapshot, and now it would also pass with the wrong number of rows.', 'Retries hide the problem and the test keeps wasting CI time; they are not a fix.'] },
      { q: 'How should the team fix the shared-account problem?',
        options: ['Run CI with a single worker from now on, just like local runs', 'Delete all leave requests for the account at the start of each test', 'Mark submit.spec.ts as serial with <code>test.describe.serial</code>', 'Give each test its own user, created through the API in a fixture'],
        correct: 3,
        why: ['It hides the coupling and makes CI about four times slower. Tests should be independent.', 'With parallel workers, one test’s clean-up deletes another test’s data mid-run — a new source of flakiness.', 'Serial mode orders tests inside one file only; other files still run in parallel on the same account.', 'Right — isolated data per test (or per worker) removes the interference. Clean up through the API afterwards.'] },
      { q: 'Tracing is off, so nobody can see what the page looked like at the moment of failure. What is the best change?',
        options: ['Add <code>console.log</code> lines after every step of every test', 'Run CI in headed mode so that the browser window is visible', 'Set trace to <code>retain-on-failure</code> and upload the report as a CI artifact', 'Record video for every test on every run and keep all of the files'],
        correct: 2,
        why: ['Logs help a little, but they show none of the DOM, network or timing detail a trace gives.', 'Nobody watches a CI machine’s screen; headed mode only slows the run.', 'Right — the trace viewer shows each action, DOM snapshots, network and console for the failing attempt. (<code>on-first-retry</code> would record the retry, which here usually passes.)', 'Huge storage cost for little gain; keep artifacts for failures.'] },
      { q: 'While the fixes are in progress, which quarantine practices are sound? Select all that apply.',
        options: ['Quietly delete the test so the pipeline stays green', 'Tag it (e.g. @quarantine) and run it in a non-blocking job, with a ticket and owner', 'Raise retries to 5 for the whole suite so flaky tests pass', 'Set a deadline: fix it or remove it within one sprint', 'Track its pass rate in CI history to prove the fix worked'],
        correct: [1, 3, 4],
        why: ['Deleting it removes coverage of leave submission without anyone deciding that risk is acceptable.', 'Correct — the pipeline stops being blocked by noise, but the test still runs and someone owns the fix.', 'Suite-wide retries hide new flakiness and real intermittent product bugs.', 'Correct — quarantine without a deadline becomes a graveyard.', 'Correct — a fix for a 1-in-6 failure needs many green runs, not one, before you trust it.'] }
    ]
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: 'sc-a11y-signup',
    title: 'Accessibility audit: PayLite sign-up form',
    level: 'intermediate',
    stages: ['quality', 'web-mobile'],
    minutes: 15,
    summary: 'Five accessibility findings on a PayLite sign-up form. Map them to WCAG principles, judge contrast with real numbers, prioritise fixes and see what an automated checker cannot tell you.',
    brief: [
      { t: 'p', html: 'Before launch you review the new <b>PayLite</b> sign-up form against <b>WCAG 2.2 level AA</b> using only a keyboard, a built-in screen reader and an automated checker. Ticking “I agree to the Terms” is <b>required</b> and opens a Terms modal that must be closed before the form can be submitted.' },
      { t: 'table', caption: 'Findings', head: ['#', 'Finding', 'Detail'], rows: [
        ['F1', 'Placeholder-only fields', '“Full name”, “Email” and “Password” have placeholder text but no visible label; the text disappears when you type.'],
        ['F2', 'Colour-only errors', 'Invalid fields get a red border (<code>#E53935</code>, 4.2:1 against white). No error text appears.'],
        ['F3', 'Keyboard trap in Terms modal', 'Focus moves into the modal, but the Close (×) icon is not focusable and <kbd>Esc</kbd> does nothing. Keyboard users cannot get out.'],
        ['F4', 'Low-contrast button', '“Create account”: white 16px regular text on <code>#7FB3E6</code> — contrast ratio <b>2.2:1</b>.'],
        ['F5', 'Unnamed icon button', 'The eye icon that shows the password is announced only as “button”.']
      ] },
      { t: 'callout', tone: 'info', title: 'Automated checker result', html: '“5 issues: 3 form fields without labels (F1), 1 colour-contrast failure (F4), 1 button without an accessible name (F5)… no other issues found.”' },
      { t: 'callout', tone: 'key', title: 'AA contrast minimums', html: 'Normal text <b>4.5:1</b> · large text (about 24px, or about 18.7px bold) <b>3:1</b> · visual boundaries of UI components and meaningful graphics <b>3:1</b>.' }
    ],
    questions: [
      { q: 'Which pairings of finding and WCAG principle are correct? Select all that apply.',
        options: ['F3, the keyboard trap — Operable', 'F4, the 2.2:1 button text — Robust', 'F4, the 2.2:1 button text — Perceivable', 'F3, the keyboard trap — Perceivable', 'F5, the unnamed eye button — Robust'],
        correct: [0, 2, 4],
        why: ['Correct — 2.1.2 No Keyboard Trap sits under Operable: users must be able to operate and leave every component with a keyboard.', 'Robust is about working with assistive technologies (name, role, value). Contrast is about seeing content.', 'Correct — 1.4.3 Contrast (Minimum) is under Perceivable.', 'Users can perceive the modal; they cannot operate their way out of it.', 'Correct — 4.1.2 Name, Role, Value (Robust): controls need an accessible name. It also relates to 1.1.1 text alternatives.'] },
      { q: 'Is the “Create account” button text (F4) acceptable at level AA?',
        options: ['Passes — buttons only need 3:1 because they are UI components', 'Passes — level AA has no contrast rule for the text on buttons', 'Fails only at level AAA, which most products treat as optional', 'Fails — 16px regular text needs at least 4.5:1 at level AA'],
        correct: 3,
        why: ['3:1 is for large text and for the visual boundary of components. The label is normal-size text, so it needs 4.5:1.', 'Text on buttons is text like any other; 1.4.3 applies.', 'AAA asks for 7:1, but 2.2:1 fails the AA minimum of 4.5:1 as well.', 'Right — 2.2:1 is far below 4.5:1. A much darker background (for example a deep blue around 6:1) fixes it.'] },
      { q: 'F2’s red border measures 4.2:1 against white. Does the error state meet WCAG?',
        options: ['Yes — 4.2:1 is above the 3:1 needed for UI components', 'No — colour is the only cue; add an error message and an icon', 'Yes — red is universally understood to mean an error', 'No — error borders need a contrast ratio of at least 7:1'],
        correct: 1,
        why: ['The contrast is fine, but that is not the problem: the error is shown by colour alone.', 'Right — 1.4.1 Use of Color and 3.3.1 Error Identification. Show text that says what is wrong, link it to the field (e.g. <code>aria-describedby</code>) and mark the field invalid so screen readers announce it.', 'People with colour-vision deficiency may not see the red, and screen readers announce nothing.', 'There is no 7:1 rule for borders; 7:1 is the AAA level for text.'] },
      { q: 'What is the best fix for F1?',
        options: ['Add visible labels tied to each input; keep placeholders only as hints', 'Add <code>aria-label</code> to each input and keep the placeholder as the visible text', 'Make the placeholder text darker so that it meets the 4.5:1 ratio', 'Show the field name in a tooltip when the mouse hovers over the input'],
        correct: 0,
        why: ['Right — a visible <code>&lt;label&gt;</code> connected to its input works for everyone: screen readers announce it, and it stays visible while typing.', 'Screen readers would now announce a name, but sighted users still lose the label as soon as they type — hard for anyone with memory or attention difficulties.', 'Better contrast helps, but the label still disappears once the user types.', 'Hover does not exist for keyboard and touch users, so many people would never see it.'] },
      { q: 'If the team can fix only one finding before tomorrow’s internal beta, which should it be?',
        options: ['F1 — placeholder-only labels', 'F2 — colour-only error state', 'F3 — keyboard trap in the Terms modal', 'F4 — low-contrast Create account button', 'F5 — unnamed show-password button'],
        correct: 2,
        why: ['Serious and next in line, but people can often still complete the form; F3 makes sign-up impossible for every keyboard-only user.', 'Important, but users can still finish sign-up once they work out which field is wrong.', 'Right — the Terms modal is required, so a keyboard user who opens it can never finish sign-up. A total blocker beats a degraded experience.', 'Hard to read for some users, but the button still works for everyone.', 'The toggle is optional; users can still type a password without it.'] },
      { q: 'The checker said “no other issues found”. Which findings or checks did it miss, or cannot judge? Select all that apply.',
        options: ['F3, the keyboard trap — someone has to actually tab through the modal', 'F4, the contrast — checkers cannot measure colour contrast', 'F2, colour-only errors — the error state appears only after invalid input', 'Whether label and error wording is clear and helpful to a person', 'F5, the unnamed button — checkers cannot detect missing names'],
        correct: [0, 2, 3],
        why: ['Correct — keyboard traps only show up through interaction.', 'Checkers measure contrast well — this one found F4.', 'Correct — the scan saw the form before any error, and judging “colour is the only cue” needs a human.', 'Correct — a tool can confirm a label exists, not that it makes sense.', 'Missing accessible names are easy to detect automatically — this checker found F5.'] },
      { q: 'Developers say F3 is fixed. Which check best confirms it?',
        options: ['Re-run the automated checker and confirm it reports no keyboard issues', 'Keyboard only: open it, Tab stays inside, Esc and Close work, focus returns', 'Click the Close button with the mouse and confirm that the modal disappears', 'Inspect the HTML and confirm that the Close button now has a tabindex'],
        correct: 1,
        why: ['The checker never detected F3, so its silence proves nothing.', 'Right — retest the failed behaviour the way a keyboard user meets it, and confirm focus returns to the checkbox that opened the modal. Repeat with a screen reader.', 'Mouse users were never blocked; this tests the wrong thing.', 'Markup can look right and still fail (for example a script that moves focus back). Test the behaviour.'] }
    ]
  },

  /* ------------------------------------------------------------------ 9 */
  {
    id: 'sc-flash-sale-perf',
    title: 'Ready for the flash sale? Reading a ShopFlow load test',
    level: 'advanced',
    stages: ['quality'],
    minutes: 18,
    summary: 'Load test results arrive two days before a ShopFlow flash sale. Interpret percentiles, find the knee, form a bottleneck hypothesis, judge the test’s validity and give a conditional go/no-go.',
    brief: [
      { t: 'p', html: 'ShopFlow’s flash sale starts <b>Friday 20:00</b> and runs for four hours. A promo email goes out at 20:00, so most traffic arrives in the first few minutes. Marketing expects a peak of <b>800 concurrent users</b>. You ran a step load test of the checkout journey (browse → cart → pay) on staging, holding each step for 15 minutes.' },
      { t: 'list', items: [
        'Requirement: checkout <b>p95 ≤ 1,000 ms</b> and <b>error rate &lt; 1%</b> at the expected peak.',
        'Staging has 2 app servers (production has 4). The database server and its connection limit are the same as production.'
      ] },
      { t: 'table', caption: 'Step load test · checkout journey', head: ['Virtual users', 'Throughput', 'p50 / p95 / p99', 'Errors'], rows: [
        ['100', '48 req/s', '180 / 320 / 450 ms', '0.0%'],
        ['250', '119 req/s', '190 / 360 / 520 ms', '0.1%'],
        ['500', '236 req/s', '230 / 610 / 1,400 ms', '0.3%'],
        ['750', '251 req/s', '610 / 2,900 / 6,800 ms', '2.4%'],
        ['1,000', '244 req/s', '1,900 / 7,200 / 15,000 ms', '9.8%']
      ] },
      { t: 'code', lang: 'text', title: 'Monitoring excerpt', code: 'At 750 VUs (steady state)\napp-1   CPU 41%   heap 62%\napp-2   CPU 39%   heap 60%\ndb      CPU 58%   connections 100/100 (max_connections)\n        wait to get a connection: p95 2.3 s\nerrors  2.4% = 503 "upstream timeout" (71%)\n             + 500 "could not acquire DB connection" (29%)\n\nLoad generator CPU: 35% at 750 VUs · 97% at 1,000 VUs' }
    ],
    questions: [
      { q: 'At 500 VUs, p95 is 610 ms. What does that mean?',
        options: ['The average response time at 500 VUs was 610 ms', '95% of requests took longer than 610 ms to complete', 'The single slowest request at 500 VUs took 610 ms', '95% of requests took 610 ms or less; 5% were slower'],
        correct: 3,
        why: ['Percentiles are not averages. An average can look fine while many users wait much longer.', 'Reversed — p95 is the value that 95% of requests are at or below.', 'That would be the maximum (p100). p95 deliberately ignores the slowest 5%.', 'Right — sort all response times; p95 is the value 95% of them fall at or below.'] },
      { q: 'At 500 VUs, p50 is 230 ms and p99 is 1,400 ms. Which statement is most accurate?',
        options: ['About 2 requests every second take 1.4 s or more (1% of 236 req/s)', 'The average response time is 1,400 ms, so most users are unhappy', 'p99 only reflects a few outliers, so it can safely be ignored here', 'Half of all users wait about 1.4 seconds for each request'],
        correct: 0,
        why: ['Right — 1% sounds small, but at 236 requests per second it is two or three slow requests every second. A checkout makes several requests, so many shoppers will hit at least one.', 'p99 is not the average. The median (p50) is 230 ms.', 'At sale traffic, “1%” is a lot of real people — and tails usually grow first as load rises.', 'Half of requests take 230 ms or less — that is what p50 means.'] },
      { q: 'Where is the “knee” — the point where the system stops scaling?',
        options: ['Between 100 and 250 VUs, where p95 first starts to rise', 'Between 250 and 500 VUs, where the first errors appear', 'Between 500 and 750 VUs, where throughput flattens and p95 jumps', 'Above 1,000 VUs — the system has not reached its limit yet'],
        correct: 2,
        why: ['p95 moves from 320 to 360 ms while throughput more than doubles — healthy scaling.', 'Errors are tiny (0.1%) and throughput still doubles from 250 to 500 VUs, so the system is still scaling.', 'Right — 50% more users adds only 15 req/s (236 → 251), while p95 goes from 610 ms to 2,900 ms and errors pass 1%. Requests are queuing.', 'Throughput actually drops between 750 and 1,000 VUs (251 → 244 req/s) and errors reach 9.8%; the limit is well below 1,000.'] },
      { q: 'Based on the monitoring excerpt, which bottleneck hypothesis is strongest?',
        options: ['The app servers are CPU-bound and need more cores', 'Database connections are maxed out, so requests queue for one', 'The load generator is overloaded and is distorting the results', 'A memory leak in the app servers is slowly exhausting the heap'],
        correct: 1,
        why: ['App CPU is around 40% — there is plenty of headroom.', 'Right — 100/100 connections, a 2.3 s wait for a connection and “could not acquire DB connection” errors all point the same way. Next: check slow queries holding connections and the pool configuration.', 'At 750 VUs the generator is at 35% CPU — fine. (It does matter at 1,000 VUs.)', 'Heap is about 60% during a 15-minute stage; nothing suggests a leak. A soak test would show one.'] },
      { q: 'The requirement is p95 ≤ 1,000 ms and errors under 1% at 800 users. What do you recommend?',
        options: ['Go — production has twice the app servers, so it will cope with 1,600', 'Go — p50 at 750 VUs is 610 ms, which is within the 1,000 ms target', 'No-go — cancel the sale, since performance can never be guaranteed', 'Not ready as tested; go only if a fix passes a re-test at 800–1,000 VUs'],
        correct: 3,
        why: ['The bottleneck is the database connection limit, which is the same in production. More app servers can even add contention.', 'The target is p95, not p50. At 750 VUs p95 is 2,900 ms and errors are 2.4% — both fail.', 'Cancelling is a business call and is not justified while there are clear fix options. Your job is to state risk and conditions.', 'Right — a clear, conditional recommendation: fix the connection bottleneck, re-test with margin above 800, and prepare mitigations. The business decides with that information.'] },
      { q: 'Which additional tests matter most before Friday? Select all that apply.',
        options: ['A usability test of the new sale banner', 'A spike test: 0 → 1,000 users in about 2 minutes, like the email blast', 'The same step test again after the connection fix, to compare', 'A load test with 50 users, to get cleaner baseline numbers', 'A soak test at about 600 users for 4 hours, the length of the sale'],
        correct: [1, 2, 4],
        why: ['Useful, but it is not a performance test and does not reduce this risk.', 'Correct — a step test ramps gently; real traffic will arrive in a sudden spike, which stresses connection pools and autoscaling differently.', 'Correct — the same test before and after shows whether the fix actually moved the knee.', 'The 100-VU step already gives a clean baseline; 50 users adds nothing.', 'Correct — four hours of load can reveal leaks, connection exhaustion or growing queues that a 15-minute step cannot.'] },
      { q: 'During the 1,000-VU stage the load generator’s CPU was at 97%. What does that mean for those numbers?',
        options: ['They may be skewed by the generator itself; add more generators', 'They prove beyond doubt that the system cannot handle 1,000 users', 'Nothing — generator CPU has no effect on measured response times', 'They are more realistic, because real users also have busy devices'],
        correct: 0,
        why: ['Right — an overloaded generator sends requests late and times them badly, so the 1,000-VU row is unreliable. The knee at 750 VUs (generator at 35%) still stands.', 'The system is clearly struggling, but the exact 1,000-VU figures cannot be trusted as measured.', 'A saturated generator delays sending and timing, which inflates or hides latency.', 'The generator simulates many users on one machine; its overload is a test artefact, not user behaviour.'] },
      { q: 'Which mitigations can reduce risk during the sale itself? Select all that apply.',
        options: ['A waiting room that admits shoppers at a rate the system can handle', 'Turn off error logging during the sale to save server resources', 'A feature flag to switch off non-essential widgets under load', 'Turn off the payment provider’s fraud checks to speed up checkout', 'Live dashboards, named people on call and an agreed scale/rollback plan'],
        correct: [0, 2, 4],
        why: ['Correct — it keeps load below the knee instead of letting everyone fail together.', 'You would be blind exactly when you need evidence most.', 'Correct — shedding optional work (recommendations, live stock counters) frees capacity for checkout.', 'Trading fraud protection for speed creates a financial and security risk far bigger than slowness.', 'Correct — fast detection and pre-agreed actions shorten any incident.'] }
    ]
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: 'sc-release-go-no-go',
    title: 'Go or no-go: PeopleOps release 5.4',
    level: 'advanced',
    stages: ['quality', 'foundations'],
    minutes: 18,
    summary: 'You lead testing for a PeopleOps release with open defects, partial regression and one environment down. Make a conditional go/no-go call, use flags and rollback wisely and write the residual-risk message.',
    brief: [
      { t: 'p', html: '<b>PeopleOps 5.4</b> (payroll export v2, a new leave policy engine and a UI refresh) is planned for <b>22:00 tonight</b>, a low-traffic window. The go/no-go meeting is at 16:00. You are the QA lead and must give a recommendation. The build under test is <b>RC2</b>.' },
      { t: 'table', caption: 'Open and recent defects', head: ['ID', 'Summary', 'Severity', 'Status'], rows: [
        ['PO-881', 'Payroll CSV export rounds overtime to whole hours (7.5 → 8). Export is behind flag <code>payroll_export_v2</code>; next payroll run is on the 28th (12 days away).', 'High', 'Open'],
        ['PO-886', 'Leave balance negative for part-time staff after the policy change', 'High', 'Fixed in RC2 · retest passed'],
        ['PO-890', 'Date picker misaligned in Safari 17', 'Low', 'Open'],
        ['PO-893', 'Manager approval email sometimes sent twice (about 3% on staging)', 'Medium', 'Open'],
        ['PO-895', 'Typo in the Arabic label of the Submit button', 'Low', 'Open']
      ] },
      { t: 'table', caption: 'Regression results', head: ['Area', 'Planned', 'Run', 'Passed', 'Notes'], rows: [
        ['Login and roles', '40', '40', '40', 'RC2'],
        ['Leave requests and approvals', '85', '85', '82', 'Run on <b>RC1</b>; 3 failures = PO-893'],
        ['Payroll export', '30', '30', '27', 'RC2; 3 failures = PO-881'],
        ['Reports', '25', '10', '10', 'Reporting environment down since 11:00, ETA unknown'],
        ['Mobile web', '20', '20', '20', 'RC2']
      ] },
      { t: 'list', items: [
        'Reports changed only through the UI refresh (styling); no report logic changed.',
        '<code>payroll_export_v2</code> can be switched off — the old export then stays in use. The leave policy engine has no flag.',
        'Application rollback takes about 20 minutes. The leave policy <b>data migration cannot be rolled back automatically</b>.'
      ] }
    ],
    questions: [
      { q: 'What is the strongest overall recommendation for the 16:00 meeting?',
        options: ['No-go — two High-severity defects were found during this cycle', 'Go, with conditions: export flag off, known issues accepted, gaps closed', 'Go — 179 of 185 executed tests passed, which is a 97% pass rate', 'No-go until every open defect, even the Safari alignment issue, is fixed'],
        correct: 1,
        why: ['PO-886 is fixed and retested, and PO-881 sits behind a flag that can stay off. Counting severities without context is not a decision.', 'Right — the high risks are contained (flag off, fix retested), the rest are known, low-impact issues, and the gaps (Reports, leave regression on RC2) have a plan. State the conditions explicitly.', 'A pass rate hides what failed and what was not run (15 Reports tests). Decisions need risk, not percentages.', 'Waiting for zero defects means never releasing; low-severity cosmetic issues rarely justify a block.'] },
      { q: 'What is the best way to handle PO-881 tonight?',
        options: ['Release with the export flag off; fix and retest before the 28th', 'Release with the flag on and ask payroll staff to correct the rounding by hand', 'Lower it to Medium, because payroll does not run for another 12 days', 'Block the whole release until PO-881 is fixed and retested'],
        correct: 0,
        why: ['Right — the flag removes the risk from tonight’s release while the old export keeps working. Add “fix verified before the 28th” as a tracked condition.', 'Relying on manual correction of pay data invites errors in people’s salaries.', 'Severity reflects impact — wrong pay is serious. The 12 days affect priority and planning, not severity.', 'The flag already isolates the defect; blocking everything else adds delay without reducing risk.'] },
      { q: 'Fifteen Reports tests could not run because the reporting environment is down (ETA unknown). What is the right approach?',
        options: ['Mark them as passed — the release only changed the styling of reports', 'Remove them from the plan so that the results show 100% executed', 'Delay the release until the environment is back, however long that takes', 'Report them as not run, judge the risk, plan when they run, get sign-off'],
        correct: 3,
        why: ['Never report tests as passed when they did not run — that is false evidence.', 'Hiding gaps destroys trust in every future report.', 'With a styling-only change and an unknown ETA, an open-ended delay is out of proportion. Present it as an option, not the default.', 'Right — be transparent: 15 not run, low risk because only styling changed, run them when the environment returns (or a quick check in production), and let the owner accept the residual risk.'] },
      { q: 'Which statements belong in your residual-risk summary for stakeholders? Select all that apply.',
        options: ['“15 Reports tests not run (environment down); styling-only change; we run them at 09:00 tomorrow.”', '“All testing is complete and the release is free of bugs.”', '“PO-893: about 3% of approval emails may arrive twice; fix planned for 5.4.1.”', '“The IDs of all 179 passed test cases, for completeness.”', '“PO-881 avoided by keeping payroll_export_v2 off; fix must be verified before payroll on the 28th.”'],
        correct: [0, 2, 4],
        why: ['Correct — a known gap, its risk and the plan to close it.', 'Untrue on both counts, and testing can never show the absence of bugs.', 'Correct — a known issue described by its user impact, with a plan.', 'Noise. Stakeholders need risks and decisions, not raw lists.', 'Correct — the mitigation and the condition that must be met before payroll.'] },
      { q: 'Which item needs the most attention in the rollback plan?',
        options: ['The 20-minute application rollback, slower than the last release', 'The open Safari date-picker alignment defect', 'The leave data migration, which has no automatic rollback', 'The 20 mobile web regression tests, which all passed'],
        correct: 2,
        why: ['20 minutes is known and acceptable in a low-traffic window.', 'A cosmetic defect has nothing to do with rollback.', 'Right — rolling back the app does not undo migrated data. Confirm a fresh backup, a rehearsed restore or forward-fix plan, and who decides to use it.', 'Passing tests do not create rollback risk.'] },
      { q: 'PO-886 was fixed in RC2 and its retest passed, but the leave regression tests ran on RC1. What should you do before 16:00?',
        options: ['Nothing more — the retest passed, so the change is fully confirmed', 'Reopen PO-886, because it was not tested on the right build', 'Re-run the leave balance and approval regression tests on RC2', 'Re-run all 200 planned regression tests on RC2 from the start'],
        correct: 2,
        why: ['The retest confirms PO-886 is fixed; it does not show the fix broke nothing else in leave calculations.', 'The retest ran on RC2 and passed, so the fix is confirmed. What is missing is regression around it.', 'Right — regression testing focused on what the fix touched (leave balances, approvals, part-time policies), on the build you will release.', 'Ideal with unlimited time, but login, payroll and mobile web already ran on RC2. A targeted run gives most of the confidence in the time left.'] },
      { q: 'Which new facts should change your recommendation to no-go? Select all that apply.',
        options: ['New Critical defect: managers can approve leave for staff outside their team', 'PO-895, the Arabic typo, is still open', 'The <code>payroll_export_v2</code> flag cannot actually be switched off in production', 'A restore rehearsal of the leave migration backup fails', 'The Safari date picker is still misaligned'],
        correct: [0, 2, 3],
        why: ['Correct — a broken authorization rule is a security and data problem that must be fixed before release.', 'A low-severity typo is a known issue to note, not a blocker.', 'Correct — the main mitigation for PO-881 disappears, so wrong overtime pay could reach payroll.', 'Correct — an irreversible migration without a working restore means a bad night cannot be undone.', 'Cosmetic and already known; it does not change the risk picture.'] }
    ]
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: 'sc-invoice-idor',
    title: 'Change one digit: PayLite invoice access control',
    level: 'advanced',
    stages: ['quality', 'sql-api'],
    minutes: 18,
    summary: 'During an authorized test of PayLite invoices, changing an ID exposes another company’s bank details. Plan access-control tests, decide acceptable responses, and report the flaw securely and responsibly.',
    brief: [
      { t: 'p', html: '<b>PayLite</b> pays contractors on behalf of companies (“tenants”). You are running an <b>authorized</b> security test of the invoices module on staging: the security lead approved a written scope. Signed in as contractor Zara, you open her invoice at <code>/invoices/1042</code>, then try <code>/invoices/1043</code>.' },
      { t: 'table', caption: 'Test accounts and access rules', head: ['User', 'Role', 'Tenant', 'May see'], rows: [
        ['Zara', 'Contractor', 'Acme Ltd', 'Her own invoices only'],
        ['Hamid', 'Finance admin', 'Acme Ltd', 'All Acme invoices'],
        ['Lina', 'Contractor', 'Bolt Foods', 'Her own invoices only'],
        ['(none)', 'No token', '—', 'Nothing']
      ] },
      { t: 'code', lang: 'http', title: 'What you observed (bank details masked here)', code: 'GET /api/invoices/1042 HTTP/1.1\nAuthorization: Bearer <zara-token>\n\nHTTP/1.1 200 OK\n{"id":1042,"tenant":"acme","payee":"Zara Khan","amount":145000,\n "iban":"PK36 •••• •••• 1234"}\n\nGET /api/invoices/1043 HTTP/1.1\nAuthorization: Bearer <zara-token>\n\nHTTP/1.1 200 OK\n{"id":1043,"tenant":"bolt-foods","payee":"Lina Rauf","amount":98000,\n "iban":"PK12 •••• •••• 7788"}\n\nGET /api/invoices/1043/pdf HTTP/1.1\nAuthorization: Bearer <zara-token>\n\nHTTP/1.1 200 OK   (Content-Type: application/pdf)' },
      { t: 'list', items: [
        'Rules of engagement: staging only · test accounts only · invoices module only.',
        'Do not collect more personal data than needed to prove an issue; redact evidence.',
        'Report security findings through the security channel, not the public tracker.'
      ] }
    ],
    questions: [
      { q: 'You have just seen Lina’s invoice from Zara’s account. What should you do first?',
        options: ['Keep incrementing the ID to see how many invoices are exposed', 'Stop, save minimal redacted evidence and report it via the agreed channel', 'Post a screenshot in the team chat so developers see it right away', 'Note it down and include it in your end-of-week test summary'],
        correct: 1,
        why: ['You already have proof. Pulling more people’s data goes beyond what is needed and breaks the rules of engagement.', 'Right — the flaw exposes bank details across companies, so it is urgent. Keep the request, response and time with sensitive fields masked, and report promptly through the security channel.', 'Team chats are widely visible and permanent; the screenshot itself would leak personal data.', 'A cross-tenant data leak cannot wait days; report it as soon as you have minimal evidence.'] },
      { q: 'Which tests belong in your access-control plan for invoices? Select all that apply.',
        options: ['Zara requests another Acme contractor’s invoice — expect 403 or 404', 'Hamid (Acme finance admin) requests a Bolt Foods invoice — expect 403 or 404', 'A 1,000-user load test of the invoice endpoint', 'The same checks on the PDF download and on update and delete endpoints', 'Checking the invoice page layout on a small phone screen'],
        correct: [0, 1, 3],
        why: ['Correct — horizontal access inside the same tenant: contractors may see only their own invoices.', 'Correct — even a privileged role must not cross tenant boundaries.', 'Load testing does not tell you who can see whose data.', 'Correct — the PDF already leaked in the brief. Every endpoint that takes an ID needs the same check, not just the JSON read.', 'Layout matters, but it is not access control.'] },
      { q: 'Which set of expected responses is correct?',
        options: ['No token: 401 · Zara → Bolt invoice: 403 or 404 · Hamid → Acme invoice: 200', 'No token: 403 · Zara → Bolt invoice: 401 · Hamid → Acme invoice: 200', 'No token: 401 · Zara → Bolt invoice: 200, masked · Hamid → Acme invoice: 200', 'No token: 404 · Zara → Bolt invoice: 403 · Hamid → Acme invoice: 403'],
        correct: 0,
        why: ['Right — no credentials means not authenticated (401); Zara is authenticated but not allowed (403, or 404 to hide it); Hamid is allowed to see Acme invoices (200).', 'Swapped: a missing token is 401, and Zara’s valid token makes her case an authorization problem (403/404).', 'A masked 200 still confirms the invoice exists and leaks its other details. Zara should get no data.', 'Hamid is a finance admin for Acme and should see Acme invoices; blocking him breaks a legitimate feature.'] },
      { q: 'The team debates 403 versus 404 for invoices that belong to another tenant. Which statement is accurate?',
        options: ['Only 401 is correct, because Zara is not authorized for that invoice', '404 is wrong, because the invoice does exist and the API must not lie', '200 with an empty body is best, because it reveals nothing at all', 'Either is acceptable; 404 also hides that the invoice exists. Be consistent'],
        correct: 3,
        why: ['Zara is authenticated with a valid token. 401 is for missing, invalid or expired credentials; this is an authorization decision.', 'Returning 404 to hide a resource from someone who may not see it is an accepted practice and makes ID enumeration harder.', '200 means success and confuses clients, monitoring and tests; a denial should be explicit.', 'Right — pick one, document it and apply it to every invoice endpoint (JSON, PDF, update, delete) so the behaviour itself does not leak information.'] },
      { q: 'What should the server log when it denies a request like this?',
        options: ['Nothing — logging denied requests only helps attackers', 'The full invoice that was requested, including the IBAN, for audit', 'Who asked, for which invoice, when, the decision and a request ID', 'Only the client’s IP address, to keep the log files small'],
        correct: 2,
        why: ['Without logs nobody can detect someone working through invoice IDs, or investigate afterwards.', 'Copying bank details into logs spreads sensitive data to every system and person that can read logs.', 'Right — enough to investigate and to alert on patterns (for example one user denied 50 times in a minute), without storing the sensitive data itself.', 'An IP alone cannot tell you which account or which invoice was involved.'] },
      { q: 'Which bug report title and severity fit best?',
        options: ['Contractors can read other tenants’ invoices and bank details by changing the ID · Critical', 'Invoice page sometimes shows the wrong data · Low', 'Invoice IDs should be random UUIDs instead of numbers · Medium', 'SECURITY HOLE!!! The whole system is hacked · Critical'],
        correct: 0,
        why: ['Right — it states who can do what, to whose data, and how. Cross-tenant exposure of bank details is critical. File it with restricted visibility.', 'Vague and badly under-rated; it hides a data breach.', 'This proposes one possible fix instead of describing the defect, and random IDs alone do not fix missing authorization.', 'Alarmist and unspecific. Facts persuade; capital letters do not.'] },
      { q: 'The developer says: “Fixed — invoice IDs are now random UUIDs, so nobody can guess them.” How do you retest?',
        options: ['Accept it — UUIDs cannot realistically be guessed, so the risk is gone', 'Check that /invoices/1043 now returns 404, then close the bug', 'Run the automated scanner and close the bug if it finds nothing', 'As Zara, request Lina’s real invoice UUID; expect 403 or 404'],
        correct: 3,
        why: ['IDs leak through emails, links, logs and browser history. Unguessable IDs make enumeration harder but do not replace an authorization check.', 'The old numeric URL disappearing says nothing about whether the server now checks ownership.', 'Scanners rarely know who should see which record; access control needs role-based tests like these.', 'Right — use a valid ID that belongs to another tenant (taken from Lina’s account). If the server still returns it, the real defect — the missing ownership check — remains.'] },
      { q: 'Which actions follow responsible, authorized testing practice? Select all that apply.',
        options: ['Try the same flaw on production to see if real data is exposed', 'Stay within the written scope: staging, test accounts, invoices module', 'Redact bank details in evidence and delete downloaded PDFs after reporting', 'Publish a blog post now to warn other PayLite customers', 'Share details only through the agreed security channel until it is fixed'],
        correct: [1, 2, 4],
        why: ['Production is outside your approved scope. Testing it without permission is unauthorized access, whatever your intent. Recommend that the security team checks it.', 'Correct — written permission and scope are what make security testing legitimate.', 'Correct — keep only what proves the issue and dispose of the rest safely.', 'Public disclosure before a fix puts real users at risk; follow the agreed disclosure process.', 'Correct — limiting who knows the details until the fix ships protects users.'] }
    ]
  },

  /* ------------------------------------------------------------------ 12 */
  {
    id: 'sc-takehome-review',
    title: 'Reviewing a take-home: MediBook booking',
    level: 'intermediate',
    stages: ['capstone', 'automation'],
    minutes: 16,
    summary: 'Review a QA take-home assignment — a short test plan, a Playwright test and three bug reports — and pick the improvements that matter most to a hiring reviewer.',
    brief: [
      { t: 'p', html: 'The assignment: “Test the <b>MediBook</b> appointment booking page on staging. Submit a short test plan, one automated Playwright test and any bug reports.” Below is a draft — your own before submitting, or a friend’s you agreed to review. Reviewers score clarity of scope and risk, maintainable automation with meaningful assertions, and reproducible bug reports.' },
      { t: 'list', items: [
        '<b>Scope:</b> “Test everything on the booking page.” <b>Approach:</b> “Manual and automation.”',
        '<b>Test cases:</b> TC1 Book appointment → “works”; TC2 Invalid date → “error”; TC3 Cancel booking → “works”.',
        '<b>Out of scope / risks / assumptions:</b> (empty)'
      ] },
      { t: 'code', lang: 'ts', title: 'tests/booking.spec.ts', code: "import { test } from '@playwright/test';\n\ntest('book appointment', async ({ page }) => {\n  await page.goto('https://staging.medibook.test/book');\n  await page\n    .locator('#root > div > div:nth-child(3) > form > div:nth-child(2) > select')\n    .selectOption('Dr. Malik');\n  await page\n    .locator('//*[@id=\"root\"]/div/div[3]/form/div[3]/input')\n    .fill('2026-12-15');\n  await page.click('text=10:30');\n  await page.locator('.btn.btn-primary.mt-3').click();\n  await page.waitForTimeout(3000);\n  await page.screenshot({ path: 'booked.png' });\n});" },
      { t: 'table', caption: 'Bug report excerpts', head: ['Report', 'Text'], rows: [
        ['BR-1', '“Booking broken. Doesn’t work sometimes. Severity: Critical.”'],
        ['BR-2', '<b>Booking accepts a date in the past.</b> Steps: 1) open /book 2) choose Dr. Malik 3) enter 2024-01-10 4) pick 10:30 5) click Book. Expected: error “Choose a future date”, no booking created. Actual: confirmation shown, booking listed in My appointments. Env: Chrome 130, staging build 2.8.1. Severity: High.'],
        ['BR-3', '<b>Same slot booked by two patients.</b> Opened /book in two browsers as patients A and B, chose Dr. Malik, 2026-12-15, 10:30, clicked Book in both within a second. Both saw a confirmation. Screenshots attached. Severity: Low.']
      ] }
    ],
    questions: [
      { q: 'Which change to the test plan adds the most value for a reviewer?',
        options: ['Add more test cases in the same style, with “works” as the expected result', 'Copy textbook definitions of testing types into the plan to make it fuller', 'Swap “test everything” for risk-based scope, exclusions and assumptions', 'Add a cover page, a logo and a table of contents so it looks professional'],
        correct: 2,
        why: ['“Works” is not a checkable expected result; more of the same adds volume, not quality.', 'Reviewers want your judgement about this product, not definitions they already know.', 'Right — it shows judgement: what matters most (booking, date and slot rules, double booking), what you chose not to test and why, and what you assumed.', 'Presentation is fine, but it does not fix an empty risk section or vague scope.'] },
      { q: 'Which problems in the Playwright test should be fixed? Select all that apply.',
        options: ['Locators tied to page structure (nth-child CSS and an absolute XPath)', '<code>waitForTimeout(3000)</code> instead of waiting for an outcome', 'Using <code>selectOption</code> to choose the doctor', 'No assertion, so the test passes as long as nothing throws', 'Using <code>async</code>/<code>await</code> in the test function'],
        correct: [0, 1, 3],
        why: ['Correct — any layout change breaks these. Prefer <code>getByLabel(\'Doctor\')</code>, <code>getByRole</code> or <code>getByTestId</code>.', 'Correct — a fixed sleep is slow and still flaky; wait for the confirmation with a web-first assertion.', '<code>selectOption</code> is the right API for a native select element.', 'Correct — a screenshot is not a check. The test would pass even if booking were completely broken.', 'Playwright tests are asynchronous; async/await is required and correct.'] },
      { q: 'Which rewrite of the final steps is strongest?',
        options: ['<code>await page.locator(\'.btn.btn-primary.mt-3\').click(); await page.waitForTimeout(5000);</code>', '<code>await page.getByRole(\'button\', { name: \'Book\' }).click(); await expect(page.getByText(\'Appointment confirmed\')).toBeVisible();</code>', '<code>await page.getByRole(\'button\', { name: \'Book\' }).click(); expect(await page.isVisible(\'text=Appointment confirmed\')).toBe(true);</code>', '<code>await page.click(\'//button[3]\'); await page.screenshot({ path: \'ok.png\' });</code>'],
        correct: 1,
        why: ['Same brittle CSS locator, a longer sleep and still no assertion.', 'Right — a role-based locator that survives layout changes, and a web-first assertion that retries until the confirmation appears or times out. (Import <code>expect</code> too.)', 'Better locator, but <code>page.isVisible()</code> checks once without waiting, so it can run before the confirmation renders — a flaky check.', 'A positional XPath is brittle, and a screenshot asserts nothing.'] },
      { q: 'The test always books Dr. Malik at 10:30 on 2026-12-15. What will go wrong over time?',
        options: ['After one run the slot is taken, and after 15 Dec the date is in the past', 'Nothing — fixed data is exactly what makes automated tests deterministic', 'Only that each run overwrites the previous run’s screenshot file', 'Playwright cannot fill ISO-format dates such as 2026-12-15'],
        correct: 0,
        why: ['Right — each run changes the system’s state and the calendar moves on. Generate a future date and a free slot, or create and clean up the booking through an API, so every run is independent.', 'Fixed data is deterministic only if the state is reset; here each run books the slot.', 'A minor annoyance — the real failures come from the data.', 'Filling a date input with an ISO string is standard and works.'] },
      { q: 'Which bug report is the strongest, and why?',
        options: ['BR-1, because it marks the problem as Critical so it gets attention', 'BR-2: clear title, steps, expected vs actual, environment and build', 'BR-3, because evidence from two browsers is the hardest to collect', 'They are equally strong, since each one describes a real problem'],
        correct: 1,
        why: ['A severity label without facts cannot be reproduced or judged; it may even be ignored.', 'Right — anyone can follow the steps, compare expected with actual, and know where it happened.', 'BR-3 has good evidence but misses the environment and the expected result, and its severity is wrong.', 'Usefulness depends on whether someone can reproduce and judge the report; BR-1 cannot be acted on.'] },
      { q: 'Which changes would most improve BR-3? Select all that apply.',
        options: ['Add the expected result: second booking rejected, slot shown as taken', 'Remove the screenshots, since they make the report too long', 'Add the environment: browsers, build and test accounts used', 'Raise the severity from Low — two patients in one slot is high impact', 'Add “the developer obviously forgot a database lock”'],
        correct: [0, 2, 3],
        why: ['Correct — without an expected result, a reader has to guess the rule.', 'Screenshots of both confirmations are the strongest evidence in the report; keep them.', 'Correct — the build and browsers let developers reproduce it in the same conditions.', 'Correct — double-booking a clinic slot affects real patients and the clinic. Severity should reflect that impact.', 'Guessing the cause, with blame, weakens the report. Describe behaviour; let developers diagnose.'] },
      { q: 'BR-1 says “Booking broken. Doesn’t work sometimes. Severity: Critical.” What should happen to it before submission?',
        options: ['Delete BR-1, because intermittent problems are not real bugs', 'Keep it as it is — the Critical label will make sure it is looked at', 'Merge it into BR-2, since both reports are about booking', 'Reproduce it, then rewrite with steps, frequency, environment and evidence'],
        correct: 3,
        why: ['Intermittent bugs are real and often serious; they just need more evidence.', 'A reviewer will see an unsupported Critical label as a weakness, not a strength.', 'Nothing shows they are the same problem; merging hides a possibly different defect.', 'Right — record what you did, how often it fails (e.g. 2 of 10 attempts), where, and evidence such as console or network errors. Then set severity from the impact you can show.'] }
    ]
  }
]);
