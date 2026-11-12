/* Qadence content · stage "manual" · lessons 1–6 (requirements → decision tables).
   Lessons 7–11, the manual test bank and drills live in lessons-manual-b.js.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js */
QA_CONTENT.addLessons('manual', [
  {
    id: 'mt-requirements',
    n: 1,
    level: 'beginner',
    title: 'Reading requirements and writing acceptance criteria',
    summary: 'Turn vague user stories into clear, testable acceptance criteria and a first list of test ideas — before any code exists.',
    minutes: 18,
    objectives: [
      'Read a user story and identify the user, the goal and the value',
      'Spot ambiguous wording and ask the questions that remove it',
      'Write specific, pass/fail acceptance criteria, including in Given/When/Then form',
      'Map each requirement to test ideas you can trace back to it'
    ],
    body: [
      { t: 'p', html: 'Many defects are born before any code is written — in a requirement that is vague, incomplete or contradictory. If a story says “search should be fast” and nobody asks what fast means, the developer guesses, the tester guesses differently, and the argument happens after release. Reading requirements critically is a form of <b>static testing</b>: you test the document instead of the software. It is the cheapest place to find a problem, because fixing a sentence takes minutes while fixing shipped code takes days.' },
      { t: 'h', text: 'User stories and the three Cs' },
      { t: 'p', html: 'Agile teams usually capture requirements as <b>user stories</b>: <i>“As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;.”</i> For example: “As an employee, I want to request annual leave online, so that I don’t have to email HR.” A story is deliberately short. It is a reminder to have a conversation, and the details agreed in that conversation are written down as <b>acceptance criteria (AC)</b> — the conditions the story must meet before the product owner accepts it as done.' },
      { t: 'cards', items: [
        { title: 'Card', html: 'The short story text on the board. It names the user, the goal and the value — not every detail.' },
        { title: 'Conversation', html: 'Product owner, developer and tester discuss rules, limits and edge cases. This is where testers ask the awkward “what if…?” questions.' },
        { title: 'Confirmation', html: 'Acceptance criteria that confirm the story is done. They become the basis for test cases and the demo.' }
      ] },
      { t: 'h', text: 'Hunting for ambiguity' },
      { t: 'table', caption: 'Vague words to circle in every requirement', head: ['Vague wording', 'Why it is untestable', 'Testable version'], rows: [
        ['“Search should be <b>fast</b>”', 'Fast for whom, with how much data, on what network?', 'Results appear within <b>2 seconds</b> for 95% of searches on the staging data set'],
        ['“The form is <b>user-friendly</b>”', 'An opinion, not a pass/fail check', 'Every field has a visible label; errors appear next to the field in plain words'],
        ['“Show an <b>appropriate</b> error”', 'Every reader imagines a different message', 'Show “Card declined. Try another card.” and keep the cart unchanged'],
        ['“Supports images, PDFs <b>etc.</b>”', '“etc.” hides an open-ended list', 'Accepts JPG, PNG and PDF up to 5 MB; other types show “File type not supported”'],
        ['“Users <b>can</b> edit requests”', 'Which users? Until when? Optional or required?', 'Employees can edit their own request while its status is Pending']
      ] },
      { t: 'list', items: [
        '<b>Who?</b> Which roles can do this, and what happens for roles that cannot?',
        '<b>Limits?</b> Minimum, maximum, allowed formats, and whether each edge is inclusive.',
        '<b>When it fails?</b> Which exact message appears, and what must <i>not</i> happen (no record saved, no money charged)?',
        '<b>States and timing?</b> Can it be edited, cancelled or repeated? Do weekends, holidays or time zones matter?',
        '<b>Beyond function?</b> Expected speed, devices, accessibility, and what is explicitly out of scope.'
      ] },
      { t: 'h', text: 'Writing testable acceptance criteria' },
      { t: 'p', html: 'Good acceptance criteria are <b>specific</b>, <b>observable</b> and have a clear <b>pass/fail</b> outcome. They describe behaviour and business rules, not button colours or code. Include the unhappy paths too: too much, too little, the wrong thing, the wrong user. Many teams write AC in <b>Given/When/Then</b> form (the Gherkin syntax): <b>Given</b> sets the starting context, <b>When</b> is the single action, and <b>Then</b> is the observable result. <b>And</b> and <b>But</b> add more lines of the same kind.' },
      { t: 'code', lang: 'gherkin', title: 'PeopleOps · annual leave request', code: `Feature: Annual leave request
  Employees request leave online instead of emailing HR.

  Background:
    Given Sara is logged in to PeopleOps as an employee
    And her annual leave balance is 10 working days

  Scenario: Request within balance goes for approval
    When she requests 3 working days of annual leave
    Then the request status is "Pending approval"
    And her manager receives an approval notification
    And her balance shows 10 days with 3 days pending

  Scenario: Request above balance is blocked
    When she requests 11 working days of annual leave
    Then she sees "You only have 10 days available"
    And no leave request is created

  Scenario: Start date in the past is rejected
    When she requests leave starting yesterday
    Then she sees "Start date cannot be in the past"` },
      { t: 'callout', tone: 'info', title: 'INVEST: is the story ready to build?', html: 'A well-formed story is <b>I</b>ndependent, <b>N</b>egotiable, <b>V</b>aluable, <b>E</b>stimable, <b>S</b>mall and <b>T</b>estable. Testers naturally own the “T”: if nobody can say how to prove the story is done, it is not ready. Raise that in refinement rather than discovering it in the middle of the test cycle.' },
      { t: 'compare', a: { title: 'Untestable criteria', items: ['“Leave requests work correctly.”', '“The page loads fast.”', '“Show a message if something goes wrong.”', 'Only the happy path is described'] }, b: { title: 'Testable criteria', items: ['“A request for more days than the balance is blocked and no record is created.”', '“The leave form loads within 2 seconds on the office network.”', '“If the end date is before the start date, show ‘End date must be after start date’.”', 'Happy path, invalid input and permission rules are all covered'] } },
      { t: 'p', html: 'Once the criteria are clear, turn each one into <b>test ideas</b> — one-line notes of what to check, later expanded into test cases. Give each requirement or criterion an ID (for example <code>LV-AC2</code>) and reference it from your tests. This simple <b>traceability</b> lets you answer two questions every test lead asks: “Is every requirement covered?” and “Which tests must change if this rule changes?”' },
      { t: 'callout', tone: 'warn', title: 'Never fill gaps with silent assumptions', html: 'If you assume “fast” means 5 seconds and the product owner meant 1, your passed test is meaningless. Ask, then write the answer into the story or ticket so the whole team shares it. An ambiguity reported before development is a defect found in the requirement — a real contribution, not a nuisance.' }
    ],
    example: {
      title: 'Worked example: refining a MediBook cancellation story',
      blocks: [
        { t: 'p', html: '<b>Story:</b> “As a patient, I want to cancel my appointment, so that the slot is freed for someone else.” <b>Original AC:</b> “Patients can cancel easily. Cancellation should be quick and the slot becomes available.” In a 15-minute refinement call, the tester raised four gaps.' },
        { t: 'table', head: ['Gap found', 'Question asked', 'Agreed acceptance criterion'], rows: [
          ['No time limit', 'Can a patient cancel 10 minutes before the visit?', '<b>AC1</b> Cancel is allowed up to and including 24 hours before the start time; after that the button is hidden and “Please call the clinic” is shown'],
          ['“Easily”', 'How many steps? Is there a confirmation?', '<b>AC2</b> In My Appointments, Cancel opens a confirmation dialog; choosing Keep changes nothing'],
          ['“Slot becomes available”', 'Available to whom, and how soon?', '<b>AC3</b> The freed slot can be booked by other patients immediately'],
          ['No proof for the patient', 'Does the patient get a confirmation?', '<b>AC4</b> One cancellation email is sent, showing the date and the doctor’s name']
        ] },
        { t: 'table', head: ['Criterion', 'Test ideas'], rows: [
          ['AC1', 'Cancel at 24 h 01 min, exactly 24 h 00 min and 23 h 59 min before the start; patient and clinic in different time zones'],
          ['AC2', 'Confirm cancels; Keep leaves the booking unchanged; double-clicking Confirm does not send two cancellations'],
          ['AC3', 'A second patient sees and books the freed slot; the slot does not appear twice'],
          ['AC4', 'Email content is correct; no email is sent when the patient chooses Keep']
        ] },
        { t: 'p', html: 'Notice the “exactly 24 h 00 min” idea: “up to 24 hours before” is itself a boundary, so the tester confirmed it is inclusive. Four short questions produced four testable criteria and a dozen test ideas before a line of code was written.' }
      ]
    },
    explain: {
      'ur': 'Testing شروع کرنے سے پہلے requirement کو ایک جاسوس کی طرح پڑھیں۔ User story بتاتی ہے کہ کون، کیا اور کیوں چاہتا ہے۔ آپ کا کام “fast” یا “user-friendly” جیسے مبہم الفاظ ڈھونڈنا اور اتنے سوال پوچھنا ہے کہ ہر rule ناپا جا سکے۔ مثال: “Search fast ہونی چاہیے” کو بدل کر لکھیں “نتائج 2 سیکنڈ کے اندر نظر آئیں”۔ پھر acceptance criteria کو Given/When/Then کی شکل میں لکھیں: Given میرے پاس 10 دن کی چھٹی باقی ہے، When میں 11 دن مانگتا ہوں، Then مجھے error نظر آئے اور کوئی request نہ بنے۔ ہر criterion سے ایک یا زیادہ test ideas بنتے ہیں۔ جو کمی آج پکڑی جائے اسے ٹھیک کرنے میں چند منٹ لگتے ہیں، release کے بعد وہی کمی کئی دن لے لیتی ہے۔',
      'ur-Latn': 'Testing shuru karne se pehle requirement ko ek detective ki tarah parhein. User story batati hai ke kaun, kya aur kyun chahta hai. Aap ka kaam “fast” ya “user-friendly” jaise vague words dhoondna aur itne sawal poochna hai ke har rule measurable ho jaye. Misaal: “Search fast honi chahiye” ko badal kar likhein “results 2 second ke andar nazar aayein”. Phir acceptance criteria Given/When/Then format mein likhein: Given mere paas 10 din ki chutti baqi hai, When main 11 din maangta hoon, Then mujhe error nazar aaye aur koi request na bane. Har criterion se ek ya zyada test ideas bante hain. Jo gap aaj pakra jaye usay theek karne mein chand minute lagte hain; release ke baad wahi gap kai din le leta hai.',
      'hi': 'Testing शुरू करने से पहले requirement को एक जासूस की तरह पढ़ें। User story बताती है कि कौन, क्या और क्यों चाहता है। आपका काम “fast” या “user-friendly” जैसे अस्पष्ट शब्द ढूँढना और इतने सवाल पूछना है कि हर नियम मापने लायक हो जाए। उदाहरण: “Search fast होनी चाहिए” को बदलकर लिखें “नतीजे 2 सेकंड के अंदर दिखें”। फिर acceptance criteria को Given/When/Then रूप में लिखें: Given मेरे पास 10 दिन की छुट्टी बाकी है, When मैं 11 दिन माँगता हूँ, Then मुझे error दिखे और कोई request न बने। हर criterion से एक या ज़्यादा test ideas बनते हैं। जो कमी आज पकड़ी जाए उसे ठीक करने में कुछ मिनट लगते हैं; release के बाद वही कमी कई दिन ले लेती है।',
      'ar': 'قبل أن تبدأ الاختبار، اقرأ المتطلب كأنك محقق. قصة المستخدم (user story) توضّح من يريد ماذا ولماذا. مهمتك أن تبحث عن الكلمات الغامضة مثل «سريع» أو «سهل الاستخدام» وأن تطرح الأسئلة حتى تصبح كل قاعدة قابلة للقياس. مثال: «يجب أن يكون البحث سريعًا» تصبح «تظهر النتائج خلال ثانيتين». ثم اكتب معايير القبول (acceptance criteria) بصيغة Given/When/Then: Given لديّ رصيد إجازة 10 أيام، When أطلب 11 يومًا، Then تظهر رسالة خطأ ولا يُنشأ أي طلب. كل معيار يتحول إلى فكرة اختبار واحدة أو أكثر. الثغرة التي تكتشفها اليوم يُصلحها تعديل بسيط في دقائق، أما بعد الإصدار فقد تكلّف أيامًا.',
      'es': 'Antes de probar, lee el requisito como un detective. Una historia de usuario (user story) dice quién quiere qué y para qué. Tu trabajo es encontrar palabras vagas como «rápido» o «fácil de usar» y hacer preguntas hasta que cada regla se pueda medir. Ejemplo: «La búsqueda debe ser rápida» pasa a ser «Los resultados aparecen en menos de 2 segundos». Después escribe los criterios de aceptación con el formato Given/When/Then: Given tengo 10 días de vacaciones, When solicito 11 días, Then veo un error y no se crea ninguna solicitud. Cada criterio se convierte en una o más ideas de prueba. Un hueco detectado hoy se corrige en minutos; después del lanzamiento puede costar días.'
    },
    keyTerms: [
      { term: 'User story', def: 'A short description of a feature from the user’s view: As a [role], I want [goal], so that [benefit].' },
      { term: 'Acceptance criteria', def: 'Specific, testable conditions a story must meet before the product owner accepts it as done.' },
      { term: 'Ambiguity', def: 'Wording that different readers can reasonably interpret in different ways, such as “fast” or “appropriate”.' },
      { term: 'Given/When/Then', def: 'The Gherkin structure for criteria and scenarios: starting context, one action, observable outcome.' },
      { term: 'INVEST', def: 'Checklist for a good story: Independent, Negotiable, Valuable, Estimable, Small, Testable.' },
      { term: 'Traceability', def: 'Links between requirements and tests, usually via IDs, showing what is covered and what a change affects.' }
    ],
    practice: [
      { q: 'Rewrite this into two testable acceptance criteria: <i>“The product search should be fast and user-friendly.”</i>', hint: 'Replace each vague word with something you can measure or observe.', answer: 'For example: <b>AC1</b> With the 10,000-product staging catalogue, search results appear within 2 seconds. <b>AC2</b> If nothing matches, the page shows “No results for ‘xyz’” and a Clear filters link. Your numbers may differ — what matters is that each criterion has a clear pass/fail outcome agreed with the product owner.' },
      { q: 'Story: <i>“As a shopper, I want to apply a discount code at checkout, so that I pay less.”</i> List at least five questions you would ask in refinement.', answer: 'Is the code case-sensitive? Can more than one code be used per order? Is there a minimum order value, or excluded products such as sale items? Is the discount applied before or after shipping and tax? Which exact message appears for an expired or already-used code? Is there a per-customer usage limit? If items are removed and the cart drops below the minimum, is the discount removed?' },
      { q: 'Write Given/When/Then criteria for <i>“Accounts are locked after 3 failed login attempts.”</i> Then name two questions the rule leaves open.', answer: '<b>Given</b> a user has entered a wrong password 2 times in a row<br><b>When</b> they enter a wrong password a 3rd time<br><b>Then</b> the account is locked and they see “Account locked. Try again in 15 minutes or reset your password.”<br>Open questions: how long is the lock (the 15 minutes must be confirmed, not invented)? Does a successful login reset the counter? Are attempts counted per account or per device?' },
      { q: 'Criterion: <i>“The password must be 8–64 characters and contain at least one number.”</i> Map it to test ideas.', hint: 'Think about the length edges, the number rule, and what counts as a character.', answer: 'Length: 7 (rejected), 8 (accepted), 64 (accepted), 65 (rejected). Number rule: 8 letters only (rejected), 7 letters + 1 digit (accepted), digits only (accepted unless another rule exists — ask). Characters: spaces, emoji and non-English letters — allowed, and counted correctly? Also check that each error message names the rule that failed.' }
    ],
    quiz: [
      { q: 'Which acceptance criterion is testable as written?', options: ['Checkout pages should load quickly for every single customer', 'The form must be clear and user-friendly on every device', 'Order confirmation shows within 3 seconds of clicking Pay', 'Errors are handled appropriately and shown to the user'], correct: 2,
        why: ['“Quickly” has no measurable limit, so two testers could disagree on pass or fail.', '“Clear” and “user-friendly” are opinions; they need observable checks such as labels and message wording.', 'Right — a specific trigger, a specific outcome and a measurable time limit give a clear pass/fail.', '“Appropriately” hides the real rule: which message, where, and what must not happen?'] },
      { q: 'In a Given/When/Then criterion, what belongs in the “Then” part?', options: ['The observable outcome that proves the rule worked', 'The starting state and data before the action', 'The single action the user or system performs', 'The technical design the developer will use'], correct: 0,
        why: ['Correct — Then states a result you can see and check, such as a message or a saved record.', 'That is the Given part: context and preconditions.', 'That is the When part: the trigger.', 'Acceptance criteria describe behaviour, not implementation; design details do not belong here.'] },
      { q: 'A story says: “Users can upload a profile photo. Large files are not allowed.” What should the tester do first?', options: ['Test with a 50 MB file and report a bug if it is accepted', 'Assume a 5 MB limit because it is common, and write tests', 'Wait until development is finished, then explore the feature freely', 'Ask the product owner for the exact limit and allowed formats'], correct: 3,
        why: ['Without an agreed limit you cannot say 50 MB is wrong; the “bug” may be expected behaviour.', 'A silent assumption makes your tests check your guess, not the agreed rule.', 'Waiting wastes the cheapest moment to fix the requirement; the gap will still be there later.', 'Right — clarify “large” and the file types, then record the answer in the story so everyone shares it.'] },
      { q: 'A story reads: “Improve the dashboard experience.” Which INVEST quality is it most clearly missing?', options: ['Independent', 'Testable', 'Valuable', 'Negotiable'], correct: 1,
        why: ['Nothing suggests it depends on another story; the problem lies elsewhere.', 'Right — there is no observable outcome, so nobody can prove it is done. It needs concrete acceptance criteria.', 'A better dashboard may well be valuable; the issue is that the value cannot be checked.', 'A vague story is, if anything, too open to negotiation — that is not what is missing.'] },
      { q: 'In refinement, a criterion says: “The discount applies to eligible orders.” Which question adds the most testing value?', options: ['Which orders are eligible — minimum value, categories, customer type?', 'What colour and size should the discount banner be on mobile screens?', 'Can I start testing as soon as the build reaches the QA environment?', 'How many test cases does the team expect me to write for this story?'], correct: 0,
        why: ['Right — “eligible” is the undefined rule; the answer gives you the partitions and boundaries to test.', 'A fair design detail, but it does not resolve the ambiguous business rule.', 'A planning question; it does not clarify what correct behaviour is.', 'The number of cases follows from clear rules, not the other way round.'] }
    ],
    interview: [
      { q: 'What do you do when a requirement is unclear or incomplete?', a: 'I don’t guess. I list the specific gaps — vague words, missing limits, undefined error behaviour, unclear roles — and take them to the product owner or BA, ideally in refinement before development starts. I offer concrete options to make answering easy (“Should the limit be 5 MB or 10 MB?”). I record the agreed answer in the story as acceptance criteria, so developers and testers share one source of truth. If an answer is still pending when testing starts, I note the assumption in my test notes and flag it as a risk instead of silently passing or failing tests.' },
      { q: 'What is the difference between acceptance criteria and test cases?', a: '<b>Acceptance criteria</b> state <i>what</i> must be true for a story to be accepted, in business language, agreed with the product owner. <b>Test cases</b> describe <i>how</i> we check it: preconditions, data, steps and expected results. One criterion usually needs several test cases — a positive case, negative cases and boundaries. For example, “a request above the leave balance is blocked” leads to tests for balance + 1 day, exactly the balance, a zero balance and a half-day request.' }
    ],
    takeaways: [
      'Read requirements as a tester: hunt for vague words, missing limits and undefined error behaviour.',
      'Ask, don’t assume — and write the agreed answer into the story.',
      'Good acceptance criteria are specific, observable and pass/fail, including unhappy paths.',
      'Given = starting context, When = one action, Then = observable result.',
      'Give requirements IDs and map each one to test ideas for traceability.'
    ],
    links: { labs: ['login'], challenges: ['peopleops-login'], interview: ['m1'] }
  },
  {
    id: 'mt-scenarios-cases',
    n: 2,
    level: 'beginner',
    title: 'Test scenarios and test cases anyone can run',
    summary: 'Break a feature into scenarios, then write clear test cases with preconditions, data, steps and expected results that any teammate can run.',
    minutes: 18,
    objectives: [
      'Explain the difference between a test scenario and a test case',
      'Write a complete test case with preconditions, test data, steps and an expected result',
      'Cover positive and negative paths with deliberately chosen test data',
      'Keep test cases maintainable and traceable to requirements'
    ],
    body: [
      { t: 'p', html: 'Imagine you are on leave and a teammate must run your tests tonight. Could they? A good test case is written for that person: someone who knows the product a little but cannot read your mind. It removes guesswork about where to start, what to type and what “passed” looks like. Before writing cases, though, you decide <i>what</i> to test at a higher level — that is the job of test scenarios.' },
      { t: 'h', text: 'Scenario vs test case' },
      { t: 'compare', a: { title: 'Test scenario', items: ['<b>What</b> to test, in one line — e.g. “Log in with a wrong password”', 'High level, quick to write and review', 'Useful for coverage discussions and exploratory sessions', 'One scenario usually produces several test cases'] }, b: { title: 'Test case', items: ['<b>How</b> to test — exact data, steps and expected result', 'Detailed enough for anyone to run and reach the same verdict', 'Needed for regression, audits, handovers and automation', 'Each case checks one specific condition'] } },
      { t: 'p', html: 'For the PeopleOps login page, scenarios might be: log in with valid credentials, log in with a wrong password, lock the account after repeated failures, reset a forgotten password, and log out. Each scenario then splits into cases. “Wrong password” alone gives a case for a wrong password with a registered email, one for an unregistered email, and one checking that the message does not reveal which of the two was wrong.' },
      { t: 'h', text: 'Anatomy of a test case' },
      { t: 'table', head: ['Field', 'What it holds', 'Example'], rows: [
        ['ID', 'A unique, stable reference', '<code>TC-LOGIN-004</code>'],
        ['Title', 'The condition and expected outcome in one line', 'Wrong password shows a generic error'],
        ['Requirement', 'The story or criterion it covers', '<code>PO-112 AC2</code>'],
        ['Preconditions', 'State that must be true before step 1', 'User <i>sara@peopleops.test</i> exists and is active; browser is logged out'],
        ['Test data', 'Exact inputs, or where to get them', 'Password <code>Wrong#Pass1</code>'],
        ['Steps', 'Numbered actions, one action per step', '1. Open /login 2. Enter the email 3. Enter the password 4. Click Sign in'],
        ['Expected result', 'The observable outcome that decides pass or fail', '“Email or password is incorrect” is shown; user stays on /login'],
        ['Priority', 'How important it is to run (High / Medium / Low)', 'High — security-relevant']
      ] },
      { t: 'callout', tone: 'key', title: 'The expected result is the heart of the case', html: 'A case without an expected result is just a set of instructions. Write what the user <i>sees</i> (message text, page, value) and what must or must not happen behind the scenes (record saved, email sent, no charge made). “It should work” is not an expected result. At run time you add the <b>actual result</b> and a status: Pass, Fail or Blocked.' },
      { t: 'compare', a: { title: 'Weak test case', items: ['Title: “Login test”', 'Steps: “Try logging in with wrong details”', 'Data: not stated', 'Expected: “Error should come”', 'Checks wrong password, empty fields and lockout all at once'] }, b: { title: 'Strong test case', items: ['Title: “Wrong password shows generic error”', 'Steps: numbered, one action each, starting from a stated URL', 'Data: active user <i>sara@peopleops.test</i>, password <code>Wrong#Pass1</code>', 'Expected: exact message; user stays on /login; no session is created', 'Checks one condition, so a failure has one clear cause'] } },
      { t: 'h', text: 'Positive, negative and test data' },
      { t: 'p', html: '<b>Positive</b> cases use valid input and confirm the feature does what it should. <b>Negative</b> cases use invalid input or wrong conditions and confirm the system rejects them safely — a clear message and no side effects. Many real bugs hide in negative paths, so plan both. Choose <b>test data</b> deliberately: realistic values, boundary values, special characters (O’Brien, José), and data in the right state — an active user, a locked user, an expired coupon. Name test accounts by purpose, such as <i>locked.user@peopleops.test</i>.' },
      { t: 'list', items: [
        'One condition per case, so a failure points to one cause.',
        'Describe intent, not pixels: “Click Sign in”, not “Click the blue button at the top right”.',
        'Put shared setup in preconditions instead of repeating ten setup steps in every case.',
        'Avoid data that expires: write “a date 3 days from today”, not a fixed calendar date.',
        'Review and retire cases when requirements change — outdated cases cause false failures.'
      ] },
      { t: 'callout', tone: 'info', title: 'Traceability IDs', html: 'Linking each case to a requirement ID — and each bug to the case that found it — builds a <b>traceability matrix</b>. It shows uncovered requirements at a glance and tells you which cases to update and re-run when a requirement changes.' },
      { t: 'p', html: 'How much detail is right? Enough that a new teammate gets the same verdict as you, and no more. High-risk flows such as payments deserve detailed cases; a low-risk settings screen may be covered by a scenario checklist plus exploratory testing. Detail has a cost: every extra step must be read, run and maintained.' }
    ],
    example: {
      title: 'Worked example: from one scenario to runnable cases',
      blocks: [
        { t: 'p', html: 'Scenario <b>SC-CART-03: Apply a coupon at checkout</b> covers story SF-210: “SAVE10 gives 10% off merchandise for orders of $30.00 or more. Shipping is never discounted.” The tester lists the conditions worth checking, then writes one case per condition.' },
        { t: 'table', head: ['ID', 'Title', 'Type', 'Priority'], rows: [
          ['TC-CART-031', 'SAVE10 on a $40.00 cart gives $4.00 off', 'Positive', 'High'],
          ['TC-CART-032', 'SAVE10 on a $29.99 cart is rejected with a minimum-order message', 'Negative', 'High'],
          ['TC-CART-033', 'SAVE10 discounts merchandise only, never the shipping fee', 'Positive', 'High'],
          ['TC-CART-034', 'SAVE10 is removed when items are deleted and the cart drops below $30.00', 'Negative', 'Medium'],
          ['TC-CART-035', 'An expired coupon shows “This code has expired”', 'Negative', 'Medium']
        ] },
        { t: 'code', lang: 'text', title: 'TC-CART-031 written out in full', code: `ID:            TC-CART-031
Title:         SAVE10 on a $40.00 cart gives $4.00 off
Requirement:   SF-210 AC1
Priority:      High
Preconditions: Logged in as shopper.basic@shopflow.test
               Cart is empty; coupon SAVE10 is active
Test data:     1 x "Canvas Tote" ($40.00), code SAVE10
Steps:
  1. Add 1 x Canvas Tote to the cart
  2. Open the cart and click Checkout
  3. Type SAVE10 in "Discount code" and click Apply
Expected:
  - Message "SAVE10 applied" is shown
  - Discount line shows -$4.00
  - Merchandise total after discount shows $36.00
  - Shipping fee is unchanged` },
        { t: 'p', html: 'Any teammate can run this and reach the same verdict. The case states the starting cart (empty), the exact product and price, and four observable checks. TC-CART-032 comes straight from boundary thinking, and TC-CART-033 from reading the rule closely — exactly the kind of defect seeded in the Bug Hunt lab.' }
      ]
    },
    explain: {
      'ur': 'Test scenario ایک لائن میں بتاتا ہے کہ <b>کیا</b> ٹیسٹ کرنا ہے، جیسے “غلط password کے ساتھ login”۔ Test case بالکل واضح بتاتا ہے کہ <b>کیسے</b>: ID، preconditions، test data، نمبر وار steps اور expected result۔ اسے ایسے لکھیں کہ ٹیم کا کوئی بھی ساتھی اسے چلائے تو وہی نتیجہ نکالے۔ مثال: precondition — user کا account active ہے؛ data — password Wrong#1؛ steps — login page کھولیں، email اور password لکھیں، Sign in پر کلک کریں؛ expected — “Email or password is incorrect” نظر آئے اور user اسی login page پر رہے۔ ہر case میں ایک ہی condition چیک کریں، positive اور negative دونوں طرح کے cases لکھیں، اور ہر case کو اس کی requirement ID سے جوڑیں۔',
      'ur-Latn': 'Test scenario ek line mein batata hai ke <b>kya</b> test karna hai, jaise “ghalat password ke saath login”. Test case bilkul saaf batata hai ke <b>kaise</b>: ID, preconditions, test data, number-wise steps aur expected result. Isay aise likhein ke team ka koi bhi saathi chalaye to wohi result nikaale. Misaal: precondition — user ka account active hai; data — password Wrong#1; steps — login page kholein, email aur password likhein, Sign in par click karein; expected — “Email or password is incorrect” nazar aaye aur user usi login page par rahe. Har case mein sirf ek condition check karein, positive aur negative dono tarah ke cases likhein, aur har case ko uski requirement ID se link karein.',
      'hi': 'Test scenario एक लाइन में बताता है कि <b>क्या</b> test करना है, जैसे “गलत password के साथ login”। Test case बिल्कुल साफ़ बताता है कि <b>कैसे</b>: ID, preconditions, test data, क्रम से लिखे steps और expected result। इसे ऐसे लिखें कि टीम का कोई भी साथी इसे चलाए तो वही नतीजा निकाले। उदाहरण: precondition — user का account active है; data — password Wrong#1; steps — login page खोलें, email और password डालें, Sign in पर click करें; expected — “Email or password is incorrect” दिखे और user उसी login page पर रहे। हर case में एक ही condition जाँचें, positive और negative दोनों तरह के cases लिखें, और हर case को उसकी requirement ID से जोड़ें।',
      'ar': 'سيناريو الاختبار (test scenario) يوضّح في سطر واحد <b>ماذا</b> سنختبر، مثل «تسجيل الدخول بكلمة مرور خاطئة». أما حالة الاختبار (test case) فتوضّح بدقة <b>كيف</b>: المعرّف (ID)، والشروط المسبقة، وبيانات الاختبار، وخطوات مرقّمة، والنتيجة المتوقعة. اكتبها بحيث يستطيع أي زميل تنفيذها والوصول إلى الحكم نفسه. مثال: الشرط المسبق — حساب المستخدم مفعّل؛ البيانات — كلمة المرور Wrong#1؛ الخطوات — افتح صفحة تسجيل الدخول، أدخل البريد وكلمة المرور، اضغط Sign in؛ النتيجة المتوقعة — تظهر رسالة «Email or password is incorrect» ويبقى المستخدم في صفحة الدخول. افحص شرطًا واحدًا في كل حالة، واكتب حالات إيجابية وسلبية، واربط كل حالة بمعرّف المتطلب الخاص بها.',
      'es': 'Un escenario de prueba (test scenario) indica en una línea <b>qué</b> probar, por ejemplo «Iniciar sesión con una contraseña incorrecta». Un caso de prueba (test case) explica exactamente <b>cómo</b>: ID, precondiciones, datos de prueba, pasos numerados y resultado esperado. Escríbelo para que cualquier compañero pueda ejecutarlo y llegar al mismo veredicto. Ejemplo: precondición — la cuenta del usuario está activa; datos — contraseña Wrong#1; pasos — abrir la página de login, escribir el correo y la contraseña, pulsar Sign in; resultado esperado — aparece «Email or password is incorrect» y el usuario sigue en la página de login. Comprueba una sola condición por caso, escribe casos positivos y negativos, y enlaza cada caso con el ID de su requisito.'
    },
    keyTerms: [
      { term: 'Test scenario', def: 'A one-line statement of what to test, such as “Apply a coupon at checkout”. Usually expands into several test cases.' },
      { term: 'Test case', def: 'A runnable check with an ID, preconditions, test data, steps and an expected result.' },
      { term: 'Precondition', def: 'A state that must be true before the first step, such as “user exists and is logged out”.' },
      { term: 'Expected result', def: 'The specific, observable outcome that decides whether the case passes or fails.' },
      { term: 'Negative test', def: 'A test that uses invalid input or conditions to confirm the system rejects them safely.' },
      { term: 'Traceability matrix', def: 'A mapping of requirements to test cases (and defects) that shows coverage and the impact of changes.' }
    ],
    practice: [
      { q: 'Turn this weak case into a strong one: <i>“Check signup works.”</i>', hint: 'Add an ID, preconditions, exact data, numbered steps and an observable expected result.', answer: '<b>TC-SIGNUP-001</b> · New user can sign up with valid details · Preconditions: email <i>new.user1@peopleops.test</i> is not registered. Steps: 1. Open /signup 2. Enter name “Ali Raza”, the email above and password <code>Valid#Pass9</code> 3. Tick “I accept the terms” 4. Click Create account. Expected: “Check your inbox to verify your email” is shown; a verification email arrives; the account exists with status Unverified.' },
      { q: 'List four scenarios for a “Forgot password” feature, then name two test cases under one of them.', answer: 'Scenarios: request a reset link for a registered email; request one for an unregistered email; use the reset link to set a new password; use an expired or already-used link. Cases under “use an expired or already-used link”: (1) a link used once shows “This link has already been used” when opened again; (2) a link older than its expiry time shows “This link has expired” and offers a new request.' },
      { q: 'Which test data would you prepare for a <b>Name</b> field on a profile form?', answer: 'A typical name (Ayesha Khan); an apostrophe (O’Brien); accents (José); a hyphen (Mary-Jane); non-Latin script such as Urdu or Arabic; the maximum length and one over it; leading and trailing spaces; only spaces; empty; digits; and text such as <code>&lt;b&gt;hi&lt;/b&gt;</code> to confirm it is shown as plain text, not rendered.' },
      { q: 'A case says: <i>“1. Log in. 2. Go to Reports and check everything looks right.”</i> What is wrong, and how would you fix it?', answer: 'No user or role, no data, two vague steps and no expected result — two testers could reach opposite verdicts. Fix: state the precondition (logged in as <i>manager@peopleops.test</i> with 3 seeded leave requests), make each step a single action (open Reports, choose “Leave”, set the date range), and write observable results: “Table shows 3 rows with these names and dates; total days = 7.”' }
    ],
    quiz: [
      { q: 'What is the main difference between a test scenario and a test case?', options: ['A scenario is for automation; a case is for manual testing', 'A scenario lists bugs; a case lists the features to test', 'A scenario is written by developers; a case by testers', 'A scenario says what to test; a case says exactly how'], correct: 3,
        why: ['Both can be run manually or automated; that is not the distinction.', 'Neither is a bug list — both describe tests.', 'Anyone can write either; ownership is not the difference.', 'Right — a scenario is a one-line “what”; a case adds data, steps and an expected result.'] },
      { q: 'Which is the best expected result for a wrong-password test case?', options: ['The page should respond correctly and show an error to the user', 'An error message is displayed somewhere near the password field', 'Shows “Email or password is incorrect”; user stays on /login', 'The system behaves as described in the requirement document'], correct: 2,
        why: ['“Correctly” and “an error” leave the verdict to opinion: which message, where?', 'Too vague — any error text would pass, even a wrong or revealing one.', 'Right — the exact message and the page state are observable, so the verdict is unambiguous.', 'Pointing to another document hides the actual check and slows down whoever runs the case.'] },
      { q: 'One test case checks a wrong password, an empty email and account lockout in a single long run of steps. It fails at step 9. What is the main problem with this design?', options: ['The failure does not point to one cause, and later checks never run', 'Long cases always take more time to execute than short ones do', 'Test cases are never allowed to have more than five steps', 'Account lockout should only ever be tested by automation'], correct: 0,
        why: ['Right — one condition per case gives a clear failure cause and lets the other checks still run.', 'Execution time is not the main issue; diagnosis and blocked checks are.', 'There is no fixed step limit; some flows genuinely need more steps.', 'Lockout can be tested manually or automatically; the problem is mixing conditions.'] },
      { q: 'Which of these belongs in Preconditions rather than in Steps?', options: ['Click the Sign in button', 'Verify the dashboard shows “Welcome back, Sara”', 'The user account exists and is active', 'Enter the password Wrong#Pass1'], correct: 2,
        why: ['An action performed during the test, so it is a step.', 'That is an expected-result check.', 'Right — it is a state that must already be true before step 1.', 'An action with test data, so it is a step.'] },
      { q: 'The coupon rule changes from 10% to 15% off. How does traceability help you most?', options: ['It automatically rewrites the expected results of every linked test case', 'It lists the cases linked to that rule, so you update and re-run them', 'It proves the new discount rule has no remaining defects', 'It removes the need to run any regression tests afterwards'], correct: 1,
        why: ['Traceability links artefacts; it does not rewrite cases for you.', 'Right — requirement-to-test links show exactly which cases the change affects.', 'Testing shows the presence of defects, never their absence; links prove nothing about quality.', 'You still need regression around the change; traceability just helps you choose what to run.'] }
    ],
    interview: [
      { q: 'What makes a good test case?', a: 'A good test case can be run by anyone and gives the same verdict. It has a unique ID, a title that states the condition and outcome, a link to the requirement, clear preconditions, exact test data, numbered steps with one action each, and an observable expected result — message text, page state, and side effects such as “no order created”. It checks one condition, has a priority, and avoids details that change often, like pixel positions or fixed dates. And it is maintained: when the requirement changes, the case changes too.' },
      { q: 'What is the difference between a test scenario and a test case? Give an example.', a: 'A <b>scenario</b> is a one-line statement of what to test, such as “Apply a coupon at checkout”. It helps the team agree on coverage quickly. A <b>test case</b> is a detailed, runnable check under that scenario — for example, “SAVE10 on a $29.99 cart is rejected” with preconditions, data, steps and the exact expected message. One scenario typically produces several cases: positive, negative and boundary.' }
    ],
    takeaways: [
      'Scenario = what to test; test case = exactly how, with data and an expected result.',
      'Write cases so any teammate reaches the same verdict.',
      'One condition per case, with precise, observable expected results.',
      'Plan positive and negative cases and prepare test data deliberately.',
      'Link cases to requirement IDs so gaps and changes are easy to see.'
    ],
    links: { labs: ['login', 'checkout'], challenges: ['peopleops-login', 'shopflow-checkout'], interview: ['m1'] }
  },
  {
    id: 'mt-equivalence',
    n: 3,
    level: 'beginner',
    title: 'Equivalence partitioning',
    summary: 'Split any input into groups the system should treat alike, test one representative per group, and cut thousands of possible tests to a handful.',
    minutes: 16,
    objectives: [
      'Identify valid and invalid partitions for numeric and non-numeric inputs',
      'Choose one representative per partition and state its expected result',
      'Design tests for several inputs without letting errors mask each other',
      'Combine partitions with boundary values and avoid common mistakes'
    ],
    body: [
      { t: 'p', html: 'A quantity box that accepts 1–10 could receive an endless variety of input: every integer, decimals, negative numbers, letters, emoji, nothing at all. You cannot try them all — exhaustive testing is impossible. <b>Equivalence partitioning (EP)</b> gives you a principled shortcut: group inputs that the system <i>should</i> handle in the same way, and assume that if one value from a group works (or fails), the others in that group will too.' },
      { t: 'h', text: 'Valid and invalid partitions' },
      { t: 'p', html: 'A <b>partition</b> (or equivalence class) is a set of values expected to produce the same behaviour. <b>Valid partitions</b> hold values the system should accept; <b>invalid partitions</b> hold values it should reject. For the 1–10 quantity there are three numeric partitions — below 1, 1 to 10, above 10 — plus non-numeric ones such as empty, decimal and text input. You test <b>one representative</b> from each, because extra values from the same partition rarely reveal anything new.' },
      { t: 'table', caption: 'Quantity: whole number from 1 to 10', head: ['Partition', 'Valid?', 'Representative', 'Expected result'], rows: [
        ['Below range (≤ 0)', 'Invalid', '-3', 'Error “Enter a quantity from 1 to 10”; cart unchanged'],
        ['In range (1–10)', 'Valid', '4', 'Item added with quantity 4'],
        ['Above range (≥ 11)', 'Invalid', '25', 'Same range error; cart unchanged'],
        ['Decimal', 'Invalid', '2.5', 'Error “Enter a whole number”'],
        ['Not a number', 'Invalid', 'abc', 'Rejected with a number error'],
        ['Empty', 'Invalid', '(blank)', 'Error “Quantity is required”']
      ] },
      { t: 'callout', tone: 'key', title: 'The core assumption', html: 'EP assumes every value in a partition is handled by the same logic. If you suspect two values in one group are treated differently — for example, quantities above 5 trigger bulk pricing — then it is really <b>two partitions</b>. Ask about the rules behind an input, not just the limits printed next to the field.' },
      { t: 'h', text: 'Partitions are not only numbers' },
      { t: 'cards', items: [
        { title: 'Types and formats', html: 'Email: valid, missing @, missing domain, space inside. Date: valid, 31 February, wrong format such as 2026/13/01.' },
        { title: 'Options', html: 'Shipping: Standard, Express, Pickup. Each option that follows a different rule is its own valid partition — and “none selected” is an invalid one.' },
        { title: 'States', html: 'Account: active, locked, unverified, deleted. Each state should get a different, deliberate response at login.' },
        { title: 'Files', html: 'Upload: allowed type within the size limit, allowed type too large, disallowed type such as .exe, empty file.' }
      ] },
      { t: 'h', text: 'Several inputs at once' },
      { t: 'p', html: 'With more than one field, you can cover <b>valid partitions</b> together — one test can carry a valid value for every field. For <b>invalid partitions</b>, test one invalid value at a time and keep every other field valid. If you send an invalid email <i>and</i> an invalid age together, the form may stop at the first error and you never learn whether the second check works. This is called <b>error masking</b>.' },
      { t: 'compare', a: { title: 'Careless combination', items: ['Email “abc” + age 150 + empty name in one test', 'Only the first error is shown; the other rules are never exercised', 'A missing age check slips through unnoticed'] }, b: { title: 'One invalid value at a time', items: ['Invalid email; valid age and name', 'Invalid age; valid email and name', 'Each test proves exactly one rejection rule'] } },
      { t: 'p', html: 'EP and <b>boundary value analysis</b> work as a pair. EP tells you where the groups are; BVA picks the sharpest values at the edges between them. Boundary values can double as representatives — 0 already belongs to the below-range partition — so a practical set for 1–10 is 0, 1, 10, 11 plus one mid value such as 4, and the non-numeric partitions: 2.5, abc and blank.' },
      { t: 'h', text: 'Common mistakes' },
      { t: 'list', items: [
        'Testing many values from the same partition (3, 4, 5, 6) and calling it thorough.',
        'Forgetting invalid partitions, or covering only the numeric ones — no empty, text or decimal input.',
        'Merging values that follow different rules, such as member and non-member prices.',
        'Combining several invalid values in one test, so one error masks another.',
        'Listing values without writing the expected result for each.'
      ] }
    ],
    example: {
      title: 'Worked example: partitions for a PayLite transfer',
      blocks: [
        { t: 'p', html: '<b>Rule:</b> a PayLite transfer needs an <b>amount</b> from 1.00 to 500.00 (at most two decimals, and not more than the balance), a <b>recipient</b> who is a registered PayLite user other than the sender, and an optional <b>note</b> of up to 100 characters. In the test account the sender’s balance is 300.00.' },
        { t: 'table', head: ['Input', 'Valid partitions', 'Invalid partitions'], rows: [
          ['Amount', '1.00–300.00 (within the limit and the balance)', 'Below 1.00 · 300.01–500.00 (above balance) · above 500.00 · three decimals · text · empty'],
          ['Recipient', 'Registered user', 'Unregistered number · sender’s own number · badly formatted number · empty'],
          ['Note', 'Empty · 1–100 characters', '101 or more characters']
        ] },
        { t: 'table', caption: 'Each test starts from a balance of 300.00', head: ['Test', 'Amount', 'Recipient', 'Note', 'Expected'], rows: [
          ['T1', '50.00', 'Registered', 'Empty', 'Transfer succeeds; balance 250.00'],
          ['T2', '75.25', 'Registered', '“Rent share”', 'Succeeds; note visible to both users'],
          ['T3', '400.00', 'Registered', 'Empty', '“Insufficient balance”; nothing sent'],
          ['T4', '0.50', 'Registered', 'Empty', '“Minimum transfer is 1.00”'],
          ['T5', '50.00', 'Unregistered', 'Empty', '“Recipient not found”'],
          ['T6', '50.00', 'Own number', 'Empty', '“You cannot send money to yourself”']
        ] },
        { t: 'p', html: 'T1 and T2 cover both valid note partitions while everything else stays valid, and every invalid test changes <b>exactly one</b> input. Notice that the balance created a partition (300.01–500.00) that the 1–500 limit alone would hide — partitions come from <i>all</i> the rules, not only the field label. Next, add boundaries: 0.99/1.00, 300.00/300.01, and — with a test balance above 500 — 500.00/500.01.' }
      ]
    },
    explain: {
      'ur': 'Equivalence partitioning کا مطلب ہے inputs کو ایسے گروپوں میں بانٹنا جن کے ساتھ system کو ایک جیسا سلوک کرنا چاہیے، اور پھر ہر گروپ سے صرف ایک value ٹیسٹ کرنا۔ مثال: quantity 1 سے 10 تک ہونی چاہیے۔ گروپ یہ ہیں: 1 سے کم (مثلاً منفی 3)، 1 سے 10 (مثلاً 4)، 10 سے زیادہ (مثلاً 25)، اور ساتھ میں text جیسے “abc” اور خالی field۔ یوں ہزاروں کی بجائے تقریباً چھ tests کافی ہیں۔ اگر گروپ کی ایک value ٹھیک چلتی ہے تو باقی بھی ویسے ہی چلنی چاہییں۔ کئی fields ہوں تو ایک وقت میں صرف ایک invalid value رکھیں اور باقی سب valid، تاکہ ایک error دوسرے کو چھپا نہ دے۔ آخر میں ہر گروپ کے کناروں پر boundary values بھی شامل کریں۔',
      'ur-Latn': 'Equivalence partitioning ka matlab hai inputs ko aise groups mein baantna jin ke saath system ko ek jaisa behave karna chahiye, aur phir har group se sirf ek value test karna. Misaal: quantity 1 se 10 tak honi chahiye. Groups yeh hain: 1 se kam (maslan -3), 1 se 10 (maslan 4), 10 se zyada (maslan 25), aur saath mein text jaise “abc” aur khaali field. Yun hazaron ki bajaye taqreeban chhe tests kaafi hain. Agar group ki ek value theek chalti hai to baaqi bhi waise hi chalni chahiyein. Kayi fields hon to ek waqt mein sirf ek invalid value rakhein aur baaqi sab valid, taake ek error doosre ko chupa na de. Aakhir mein har group ke kinaron par boundary values bhi shamil karein.',
      'hi': 'Equivalence partitioning का मतलब है inputs को ऐसे समूहों में बाँटना जिनके साथ system को एक जैसा व्यवहार करना चाहिए, और फिर हर समूह से सिर्फ़ एक value test करना। उदाहरण: quantity 1 से 10 तक होनी चाहिए। समूह ये हैं: 1 से कम (जैसे -3), 1 से 10 (जैसे 4), 10 से ज़्यादा (जैसे 25), और साथ में text जैसे “abc” और खाली field। इस तरह हज़ारों की जगह लगभग छह tests काफ़ी हैं। अगर समूह की एक value सही चलती है तो बाकी भी वैसे ही चलनी चाहिए। कई fields हों तो एक बार में सिर्फ़ एक invalid value रखें और बाकी सब valid, ताकि एक error दूसरी को छिपा न दे। आख़िर में हर समूह के किनारों पर boundary values भी जोड़ें।',
      'ar': 'تقسيم التكافؤ (Equivalence partitioning) يعني تقسيم المدخلات إلى مجموعات يجب أن يتعامل معها النظام بالطريقة نفسها، ثم اختبار قيمة واحدة فقط من كل مجموعة. مثال: يجب أن تكون الكمية من 1 إلى 10. المجموعات هي: أقل من 1 (مثل سالب 3)، ومن 1 إلى 10 (مثل 4)، وأكبر من 10 (مثل 25)، إضافة إلى نص مثل «abc» وحقل فارغ. بهذا تكفي ستة اختبارات تقريبًا بدلًا من آلاف. إذا نجحت قيمة من مجموعة ما، فيُفترض أن تنجح بقية قيمها أيضًا. وعند وجود عدة حقول، اختبر قيمة غير صالحة واحدة في كل مرة مع إبقاء الحقول الأخرى صالحة، حتى لا يُخفي خطأٌ خطأً آخر. بعد ذلك أضف القيم الحدّية عند أطراف كل مجموعة.',
      'es': 'La partición de equivalencia (equivalence partitioning) consiste en dividir las entradas en grupos que el sistema debería tratar igual y probar solo un valor de cada grupo. Ejemplo: la cantidad debe ser de 1 a 10. Los grupos son: menor que 1 (por ejemplo -3), de 1 a 10 (por ejemplo 4), mayor que 10 (por ejemplo 25), además de texto como «abc» y el campo vacío. Así bastan unas seis pruebas en lugar de miles. Si un valor del grupo funciona, los demás del mismo grupo deberían funcionar igual. Con varios campos, prueba un solo valor inválido a la vez y deja los demás válidos, para que un error no oculte a otro. Después añade valores límite en los bordes de cada grupo.'
    },
    keyTerms: [
      { term: 'Equivalence partition', def: 'A group of inputs the system should handle the same way, so one representative stands for the whole group. Also called an equivalence class.' },
      { term: 'Valid partition', def: 'A group of values the system should accept, such as quantities 1–10.' },
      { term: 'Invalid partition', def: 'A group of values the system should reject safely, such as quantities below 1, decimals or text.' },
      { term: 'Representative value', def: 'The single value chosen to stand for a partition in a test, such as 4 for the range 1–10.' },
      { term: 'Error masking', def: 'When one invalid input triggers an error that hides whether a second invalid input is checked at all.' }
    ],
    practice: [
      { q: 'An <b>email</b> field on a signup form: list at least four invalid partitions with one representative each, plus the valid partitions.', hint: 'Think about format, missing parts, spaces, length and empty input.', answer: 'Invalid: missing @ (<i>sara.peopleops.test</i>); missing domain (<i>sara@</i>); space inside (<i>sara @peopleops.test</i>); two @ signs (<i>sara@@peopleops.test</i>); empty; longer than the maximum (ask what it is). Valid: a standard address (<i>sara@peopleops.test</i>) and, as a separate partition worth checking, a plus address (<i>sara+qa@peopleops.test</i>), which some systems wrongly reject.' },
      { q: 'MediBook accepts patients aged <b>0–120</b>. Patients under 12 must also enter a guardian’s name. Identify the partitions for age.', answer: 'Invalid: below 0, above 120, decimal, text, empty. Valid: <b>two</b> partitions, not one — 0–11 (guardian name required) and 12–120 (guardian name not required). The guardian rule splits the valid range because the system behaves differently, so test one value from each (e.g. 7 and 40), then add boundaries 11/12 as well as -1/0 and 120/121.' },
      { q: 'ShopFlow offers Standard shipping (free on orders over $50), Express ($12) and Pickup (free). What partitions do you see?', hint: 'An option can contain more than one partition if a rule splits it.', answer: 'Valid: Standard below the threshold (charged), Standard above it (free), Express, Pickup. Invalid: no option selected, and a tampered value sent to the API (e.g. <code>"method": "drone"</code>). Also ask whether “over $50” includes exactly $50.00 — that decides the boundary tests.' },
      { q: 'A colleague proposes these tests for an age field that accepts 18–65: <b>20, 30, 40, 50, 60</b>. Critique the set and improve it.', answer: 'All five values sit in the same valid partition, so four of them add almost nothing, and there are no invalid partitions or boundaries at all. A better set: 17 and 66 (invalid ranges, also boundaries), 18 and 65 (valid boundaries), one mid value such as 40, plus empty, text and a decimal such as 30.5.' }
    ],
    quiz: [
      { q: 'A field accepts whole numbers from 1 to 10. How many numeric equivalence partitions are there?', options: ['Three: below 1, 1 to 10, and above 10', 'Two: one valid group and one invalid group', 'Ten: one partition for each valid number', 'Four: the values 0, 1, 10 and 11'], correct: 0,
        why: ['Right — one valid partition and two invalid ones, because “too low” and “too high” are checked separately and can fail differently.', 'Too coarse: “too low” and “too high” are different invalid partitions, each needing its own test.', 'All values from 1 to 10 should behave the same, so together they form one partition.', 'Those are boundary values, not partitions.'] },
      { q: 'What is the main benefit of equivalence partitioning?', options: ['It guarantees that the software has no defects', 'It replaces the need for boundary value analysis', 'It tests every possible input value automatically', 'It cuts countless inputs down to a few reasoned tests'], correct: 3,
        why: ['No technique can prove the absence of defects; testing shows their presence.', 'EP and BVA complement each other — the edges between partitions still need BVA.', 'It does the opposite: it avoids exhaustive testing, which is impossible.', 'Right — one representative per group gives good coverage with very few tests.'] },
      { q: 'A signup form has email, age (18–65) and password. You want to prove that age 15 is rejected. How should you set up the test?', options: ['Use age 15 with an invalid email to test two rules at once', 'Use age 15 and leave every other field empty', 'Use age 15 with a valid email and a valid password', 'Use age 15 only after testing every valid age'], correct: 2,
        why: ['Errors can mask each other: you may see only the email error and never prove the age rule.', 'Empty required fields trigger their own errors and hide the age result.', 'Right — keep every other input valid so only the age rule can cause the rejection.', 'There is no need to test every valid age; one representative covers the valid partition.'] },
      { q: 'A store gives members 10% off and non-members no discount. Prices range from 0.01 to 9,999.99. Why is “all valid prices” not a single partition for discount testing?', options: ['Because prices with decimals always need separate partitions', 'Because member and non-member prices follow different rules', 'Because the upper limit is too high to test', 'Because partitions only apply to whole numbers'], correct: 1,
        why: ['Decimal input is normal for prices; it does not create a new rule on its own.', 'Right — values handled by different logic belong to different partitions, so test each customer type.', 'Partitions are chosen by behaviour, not by how big the range is.', 'Partitions apply to any input: text, options, states, files and decimals.'] },
      { q: 'An upload accepts JPG and PNG files up to 5 MB. Which set covers the partitions best?', options: ['JPG 1 MB, JPG 2 MB, JPG 3 MB, JPG 4 MB', 'JPG 1 MB, PNG 1 MB, JPG 5 MB, PNG 5 MB', 'PNG 2 MB, PNG 6 MB, PNG 9 MB, GIF 2 MB', 'JPG 1 MB, PNG 1 MB, JPG 6 MB, PDF 1 MB'], correct: 3,
        why: ['Four values from the same valid partition — no PNG, no oversize file and no wrong type.', 'Good valid and boundary coverage, but no invalid partition is tested at all.', 'Covers oversize and wrong type, but never tries a valid JPG, and 6 MB and 9 MB sit in the same partition.', 'Right — both valid types, one oversize file and one disallowed type: one representative per partition.'] }
    ],
    interview: [
      { q: 'Explain equivalence partitioning with an example.', a: 'Equivalence partitioning divides possible inputs into groups the system should treat the same way, then tests one representative from each. For a quantity field that accepts 1–10, I have one valid partition (test 4) and invalid partitions for below 1 (−3), above 10 (25), decimals (2.5), text and empty — six tests instead of thousands. The technique assumes values in a partition share the same logic, so if I suspect a sub-rule, such as bulk pricing above 5, I split the partition. Then I add boundary values at the edges.' },
      { q: 'How do you apply equivalence partitioning to a form with several fields?', a: 'I list the partitions for each field — valid and invalid, including empty, wrong type and wrong format. I cover the valid partitions with as few tests as possible, since one test can carry a valid value for every field. For invalid partitions I change <b>one field at a time</b> and keep the others valid, so one error cannot mask another. Finally I add boundary values and check rules that link fields, such as a guardian name that is required only for patients under 12.' }
    ],
    takeaways: [
      'Group inputs the system should treat alike; test one representative per group.',
      'Always include invalid partitions: too low, too high, wrong type, wrong format, empty.',
      'Partitions apply to text, options, states and files — not just numbers.',
      'Test invalid values one at a time so errors do not mask each other.',
      'Use EP to find the groups and BVA to test their edges.'
    ],
    links: { labs: ['checkout', 'login'], challenges: ['shopflow-checkout'], interview: ['m5'] }
  },
  {
    id: 'mt-boundary',
    n: 4,
    level: 'beginner',
    title: 'Boundary value analysis',
    summary: 'Find the bugs that hide at the edges of valid ranges by choosing a small, sharp set of boundary values.',
    minutes: 15,
    objectives: [
      'Explain why defects cluster at the edges of input ranges',
      'Pick two-value and three-value boundary sets for any numeric range',
      'Combine boundary values with equivalence partitions to keep test sets small',
      'Apply boundaries to lengths, dates, money and counts — not only numbers'
    ],
    body: [
      { t: 'p', html: 'Developers write rules such as <code>if (qty &gt;= 1 &amp;&amp; qty &lt;= 10)</code>. One wrong character — <code>&gt;</code> instead of <code>&gt;=</code>, or 10 typed as 100 — moves the edge of the rule. Values in the middle of the range still behave, so a quick “happy path” check passes. The mistake only shows <b>at the boundary</b>. That is why <b>boundary value analysis (BVA)</b> is one of the most productive test design techniques you can learn.' },
      { t: 'p', html: 'BVA builds on <b>equivalence partitioning</b>: first split inputs into groups the system should treat the same way (for example invalid-low, valid, invalid-high). Then, instead of picking any value from each group, you pick values <b>on and next to each edge</b> between groups.' },
      { t: 'h', text: 'Two-value vs three-value boundaries' },
      { t: 'table', caption: 'Quantity must be a whole number from 1 to 10', head: ['Approach', 'Values to test', 'When to use it'], rows: [
        ['Two-value BVA', '<b>0, 1</b> and <b>10, 11</b> — each boundary plus its nearest neighbour outside', 'Default for most fields; small and effective'],
        ['Three-value BVA', '<b>0, 1, 2</b> and <b>9, 10, 11</b> — each boundary plus both neighbours', 'High-risk rules such as money, limits and security'],
        ['Plus one mid value', 'e.g. <b>5</b> — a typical valid value', 'Confirms the valid partition works at all']
      ] },
      { t: 'flow', caption: 'How to derive boundary tests for any rule', steps: ['Read the rule', 'Find each edge', 'List partitions', 'Pick on/off values', 'Write expected results'] },
      { t: 'p', html: 'Always write the <b>expected result</b> next to each value before you test. “0 → error ‘Enter a quantity from 1 to 10’, item not added” is a test. “Try 0” is only an idea. Expected results turn values into evidence you can report.' },
      { t: 'callout', tone: 'key', title: 'Edges are not only numbers', html: 'Anything with a limit has boundaries: text length (username 3–20 characters → test 2, 3, 20, 21), dates (offer ends 31 March 23:59 → test 23:59 and 00:00), money (free shipping over $50 → test $49.99, $50.00, $50.01), counts (max 5 uploads → test 5 and 6) and time-outs (session expires after 15 minutes → test 14:59 and 15:01).' },
      { t: 'h', text: 'Questions that reveal hidden boundaries' },
      { t: 'list', items: [
        'Is the limit <b>inclusive</b> (“up to 10”) or <b>exclusive</b> (“under 10”)? Ask — requirements are often vague here.',
        'What is the smallest step? Whole numbers step by 1, prices by 0.01, dates by a day or a minute.',
        'What happens with empty, zero, negative and non-numeric input?',
        'Is the same limit enforced in the UI, the API and the database? Each can disagree.'
      ] },
      { t: 'p', html: 'Some rules have <b>several edges</b>. If a PayLite transfer fee is 2% below 100.00, 1% from 100.00 to 999.99 and free from 1,000.00, there are two boundaries, so test 99.99/100.00 and 999.99/1,000.00. Other rules state only <b>one edge</b>: “password of at least 8 characters” gives 7 and 8, but no maximum. That is a question to ask, not permission to skip — every real system has a practical limit somewhere (a database column, a request size), so probe it with a very long value and record what happens.' },
      { t: 'compare', a: { title: 'Weak boundary testing', items: ['Tests 5, 50 and 500 for a 1–10 rule', 'Checks only that “it works”', 'Tests only the UI field, which blocks typing 11'] }, b: { title: 'Strong boundary testing', items: ['Tests 0, 1, 10, 11 (and 2, 9 when risk is high)', 'States the expected message and side effect for each value', 'Also sends 11 directly to the API, where the UI cannot block it'] } },
      { t: 'callout', tone: 'warn', title: 'Client-side checks are not enough', html: 'A field that refuses to accept “11” proves only that the browser blocks it. Someone can still send <code>quantity: 11</code> to the API. When you can, test the same boundary at the API level too.' }
    ],
    example: {
      title: 'Worked example: free-shipping threshold in ShopFlow',
      blocks: [
        { t: 'p', html: '<b>Rule:</b> “Orders with a merchandise subtotal of <b>$50.00 or more</b> get free shipping. Shipping charges do not count toward the subtotal.” Prices step by one cent.' },
        { t: 'table', head: ['Subtotal', 'Partition', 'Expected result'], rows: [
          ['$49.99', 'Below threshold', 'Shipping $6.00 is charged'],
          ['$50.00', 'On the boundary (inclusive)', 'Shipping is free'],
          ['$50.01', 'Just above', 'Shipping is free'],
          ['$45.00 + $6.00 shipping', 'Trap: shipping must not count', 'Subtotal stays $45.00, shipping charged']
        ] },
        { t: 'p', html: 'The last row comes from reading the rule carefully: the boundary applies to <i>merchandise</i>, so a tester checks that shipping does not push the total over the edge. Bugs like this appear in the Bug Hunt lab.' }
      ]
    },
    explain: {
      'ur': 'Boundary value analysis کا مطلب ہے کہ ہم کسی حد (limit) کے بالکل کنارے والی قیمتیں ٹیسٹ کریں، کیونکہ زیادہ تر bugs وہیں چھپے ہوتے ہیں۔ مثال: اگر quantity صرف 1 سے 10 تک قبول ہونی چاہیے، تو ہم 0، 1، 10 اور 11 ضرور ٹیسٹ کرتے ہیں۔ 0 اور 11 پر error آنا چاہیے، جبکہ 1 اور 10 قبول ہونے چاہییں۔ اگر developer نے غلطی سے > کی جگہ >= لکھ دیا ہو تو یہی ٹیسٹ اسے پکڑ لیں گے۔ ہر قیمت کے ساتھ expected result پہلے لکھیں، اور یاد رکھیں کہ text کی لمبائی، تاریخ اور پیسوں کی بھی حدیں ہوتی ہیں۔',
      'ur-Latn': 'Boundary value analysis ka matlab hai ke hum kisi limit ke bilkul kinaare wali values test karein, kyun ke zyada tar bugs wahin chupay hotay hain. Misaal: agar quantity sirf 1 se 10 tak allowed hai, to hum 0, 1, 10 aur 11 zaroor test karte hain. 0 aur 11 par error aana chahiye, jab ke 1 aur 10 accept hone chahiyein. Agar developer ne ghalti se > ki jagah >= likh diya ho to yehi tests usay pakar lenge. Har value ke saath expected result pehle likhein, aur yaad rakhein ke text length, dates aur paison ki bhi boundaries hoti hain.',
      'hi': 'Boundary value analysis का मतलब है कि हम किसी limit के बिल्कुल किनारे वाली values को test करें, क्योंकि ज़्यादातर bugs वहीं छिपे होते हैं। उदाहरण: अगर quantity सिर्फ़ 1 से 10 तक स्वीकार होनी चाहिए, तो हम 0, 1, 10 और 11 ज़रूर test करते हैं। 0 और 11 पर error आना चाहिए, जबकि 1 और 10 स्वीकार होने चाहिए। अगर developer ने गलती से > की जगह >= लिख दिया हो, तो यही tests उसे पकड़ लेंगे। हर value के साथ expected result पहले लिखें, और याद रखें कि text की लंबाई, तारीख़ और पैसों की भी सीमाएँ होती हैं।',
      'ar': 'تحليل القيم الحدّية (Boundary value analysis) يعني أن نختبر القيم الموجودة على حافة أي حدّ مسموح به، لأن معظم الأخطاء تختبئ هناك. مثال: إذا كانت الكمية المقبولة من 1 إلى 10 فقط، فإننا نختبر دائمًا القيم 0 و1 و10 و11. يجب أن تظهر رسالة خطأ عند 0 و11، بينما تُقبل القيمتان 1 و10. إذا كتب المطوّر بالخطأ > بدلًا من >= فإن هذه الاختبارات ستكشف ذلك. اكتب النتيجة المتوقعة لكل قيمة قبل التنفيذ، وتذكّر أن لطول النص والتواريخ والمبالغ المالية حدودًا أيضًا.',
      'es': 'El análisis de valores límite (boundary value analysis) consiste en probar los valores que están justo en el borde de un rango permitido, porque ahí se esconden muchos defectos. Ejemplo: si la cantidad válida es de 1 a 10, siempre probamos 0, 1, 10 y 11. Con 0 y 11 debe aparecer un error, mientras que 1 y 10 deben aceptarse. Si el desarrollador escribió por error > en lugar de >=, estas pruebas lo detectarán. Escribe el resultado esperado de cada valor antes de probar, y recuerda que la longitud de un texto, las fechas y los importes también tienen límites.'
    },
    keyTerms: [
      { term: 'Boundary', def: 'The edge between two partitions, such as the point where a valid range ends and an invalid one begins.' },
      { term: 'Two-value BVA', def: 'Test each boundary value and its closest neighbour on the other side (for 1–10: 0, 1, 10, 11).' },
      { term: 'Three-value BVA', def: 'Test each boundary and the values just below and above it (for 1–10: 0, 1, 2, 9, 10, 11).' },
      { term: 'Inclusive / exclusive', def: 'Whether the limit value itself is allowed (“up to 10”) or not (“less than 10”).' },
      { term: 'Off-by-one error', def: 'A defect where a limit is shifted by one step, often from using < instead of <=.' }
    ],
    practice: [
      { q: 'A username must be <b>3 to 20 characters</b>. List the two-value boundary lengths and the expected result for each.', hint: 'There are two edges, so you need four values.', answer: '<b>2</b> → rejected with a clear length message; <b>3</b> → accepted; <b>20</b> → accepted; <b>21</b> → rejected (or the field stops input at 20 — then also send 21 characters through the API).' },
      { q: 'A coupon is valid “until 31 March”. What boundary questions would you ask before writing tests?', answer: 'Is 31 March inclusive? Until what time — 23:59:59 in which time zone (the user’s or the server’s)? What happens to a cart opened before midnight and paid after? Then test the last valid minute and the first invalid minute.' },
      { q: 'Age must be <b>18–65</b> for an insurance quote. Write a three-value boundary set. Which partition values would you add?', answer: 'Three-value set: <b>17, 18, 19</b> and <b>64, 65, 66</b>. Add one mid value (e.g. 40) for the valid partition and check non-numeric, empty and negative input as separate invalid partitions.' }
    ],
    quiz: [
      { q: 'A field accepts whole numbers from 1 to 10. Which set applies two-value boundary value analysis?', options: ['1, 5, 10', '0, 1, 10, 11', '-1, 0, 11, 12', '1, 2, 9, 10'], correct: 1,
        why: ['Misses the invalid neighbours 0 and 11, where off-by-one bugs show.', 'Right — each boundary plus its closest invalid neighbour.', 'These are all invalid; you never confirm that 1 and 10 are accepted.', 'All valid values; nothing checks that 0 and 11 are rejected.'] },
      { q: 'Why do boundary values find more defects than random values from the middle of a range?', options: ['Mistakes in comparisons such as < vs <= only change behaviour at the edges', 'Middle values are never tested by developers, so only edges remain', 'Boundary values are easier to automate than values from the middle of a range', 'Testing standards require boundary values to be included in every test plan'], correct: 0,
        why: ['Correct — an off-by-one error leaves middle values working and breaks only the edge.', 'Developers often do test typical values; that is not the reason.', 'Ease of automation is unrelated to defect density.', 'Standards describe the technique, but its value comes from where bugs actually occur.'] },
      { q: 'Free shipping applies to subtotals of $50.00 or more. Prices step by $0.01. Which values best test the boundary?', options: ['$49.00, $50.00, $51.00', '$0.00, $50.00, $100.00', '$49.99, $50.00, $50.01', '$50.00 only'], correct: 2,
        why: ['Steps of $1 skip the cent-level edge where rounding bugs hide.', 'It includes $50.00, but $0.00 and $100.00 are far from the edge, so a bug at $49.99 would be missed.', 'Right — the smallest step is one cent, so test on and next to $50.00.', 'One value cannot show which side of the edge is wrong.'] },
      { q: 'The UI quantity box will not let you type 11. What should a tester do next?', options: ['Mark the boundary as tested and passed', 'Report a bug because 11 cannot be entered', 'Skip the upper boundary since users cannot reach it', 'Send quantity 11 directly to the API and check it is rejected'], correct: 3,
        why: ['The UI block proves only client-side behaviour.', 'Blocking invalid input in the UI is usually correct behaviour, not a bug.', 'Users, scripts and integrations can bypass the UI, so the server-side rule still matters.', 'Correct — servers must enforce rules too; the API is reachable without the UI.'] },
      { q: 'A password must be at least 8 characters with no maximum stated. What is the best next step?', options: ['Test only 7 and 8 characters, because the minimum is the only rule stated', 'Ask for the maximum; test 7, 8 and a very long value like 1,000 characters', 'Assume there is no maximum length, so no upper boundary test is needed at all', 'Test exactly 8 characters, because that is the stated minimum'], correct: 1,
        why: ['Covers the lower edge but ignores the unknown upper limit, where storage or hashing limits can fail.', 'Right — clarify the missing boundary and still probe very long input.', 'Systems almost always have a practical maximum; unknown limits are a risk to raise.', 'One value cannot show whether 7 is correctly rejected.'] }
    ],
    interview: [
      { q: 'How would you test a field that accepts an age between 18 and 65?', a: 'I would split inputs into partitions — below 18, 18–65, above 65, and invalid types such as empty, negative or text. Then I apply boundary value analysis: <b>17, 18, 65, 66</b> at minimum, plus 19 and 64 if the rule is high-risk. I write the expected result for each before testing, check the error message is clear, and verify the same rule at the API level because the UI can be bypassed. Finally I confirm whether 18 and 65 are inclusive with the product owner if the requirement is ambiguous.' },
      { q: 'What is the difference between equivalence partitioning and boundary value analysis?', a: 'Equivalence partitioning groups inputs the system should treat the same and tests one representative per group, which keeps the test set small. Boundary value analysis focuses on the <b>edges between those groups</b>, where off-by-one defects appear. I use them together: partitions tell me where the edges are, and boundaries tell me which exact values to pick.' }
    ],
    takeaways: [
      'Defects cluster at the edges of ranges — test on and next to every boundary.',
      'Two-value BVA for 1–10 is 0, 1, 10, 11; three-value adds 2 and 9.',
      'Write the expected result for every value before you test.',
      'Lengths, dates, money, counts and time-outs all have boundaries.',
      'Check boundaries at the API too — the UI can be bypassed.'
    ],
    links: { labs: ['checkout', 'bughunt'], challenges: ['bug-report'], interview: ['m5'] }
  },
  {
    id: 'mt-bug-reports',
    n: 5,
    level: 'beginner',
    title: 'The bug life cycle and bug reports developers love',
    summary: 'Follow a defect from New to Closed, and write clear, neutral bug reports with well-judged severity and priority.',
    minutes: 20,
    objectives: [
      'Trace a defect through its life cycle states and know who moves it between them',
      'Write a report with a precise title, environment, steps, expected vs actual and evidence',
      'Set severity and priority independently and justify each one',
      'Keep reports neutral, reproducible and focused on a single problem'
    ],
    body: [
      { t: 'p', html: 'A bug you find but cannot communicate stays in the product. The bug report is a tester’s main deliverable: developers use it to reproduce and fix, product owners use it to decide what ships, and future testers use it to understand history. Strictly speaking, what you observe is a <b>failure</b>; the <b>defect</b> is the flaw in the code or document that causes it, introduced by a human <b>error</b>. In daily work everyone just says “bug” — what matters is that your report lets someone find and fix the defect quickly.' },
      { t: 'h', text: 'The defect life cycle' },
      { t: 'flow', caption: 'The usual path of a defect that gets fixed', steps: ['New', 'Assigned', 'Open', 'Fixed', 'Retest', 'Verified', 'Closed'] },
      { t: 'table', head: ['State', 'Meaning', 'Usually set by'], rows: [
        ['New', 'Reported, not yet reviewed', 'Tester'],
        ['Assigned', 'Accepted in triage and given to a developer', 'Lead or triage group'],
        ['Open', 'The developer is analysing or fixing it', 'Developer'],
        ['Fixed', 'A code change is made and available in a test build', 'Developer'],
        ['Retest', 'Waiting for the tester to re-run the original steps on that build', 'Tester'],
        ['Reopened', 'The retest failed — the problem is still there', 'Tester'],
        ['Verified → Closed', 'The retest passed; the fix is confirmed and the ticket closed', 'Tester (sometimes the lead)'],
        ['Rejected · Duplicate · Deferred', 'Not a defect, already reported, or real but postponed to a later release', 'Triage or product owner']
      ] },
      { t: 'p', html: 'Two side paths matter. If the retest fails, the bug goes to <b>Reopened</b> and back to the developer, with a comment naming the build and what you saw. If triage decides not to fix it now, it ends as <b>Rejected</b> (works as designed), <b>Duplicate</b> (link the original) or <b>Deferred</b> (fix later). Names vary between teams and tools such as Jira, so learn your team’s workflow. Re-running the failed steps after a fix is <b>confirmation testing</b>; checking that the fix broke nothing else is <b>regression testing</b>.' },
      { t: 'h', text: 'Anatomy of a great report' },
      { t: 'list', items: [
        '<b>Title</b> — area, what goes wrong, and under which condition: “Checkout: saving an address with an apostrophe shows ‘Something went wrong’”.',
        '<b>Environment</b> — build or app version, URL, browser or device and OS, test account and relevant data.',
        '<b>Steps to reproduce</b> — numbered and minimal, from a known starting state, with exact data.',
        '<b>Expected vs actual</b> — what should happen (cite the requirement) and what happened, with exact values and messages.',
        '<b>Evidence</b> — screenshot or short video, console errors, network response, log excerpt, timestamp.',
        '<b>Severity, priority and frequency</b> — the impact, a suggested urgency, and how often it reproduces (e.g. 4 of 5 tries).'
      ] },
      { t: 'h', text: 'Severity vs priority' },
      { t: 'p', html: '<b>Severity</b> is the <b>impact</b> of the defect on the system or user — how bad it is when it happens. The tester usually assesses it, on a scale such as Critical, Major, Minor and Trivial. <b>Priority</b> is the <b>urgency</b> — how soon it should be fixed compared with other work — and it is a business decision made by the product owner or triage group, often as P1–P4 or High/Medium/Low. The two are independent, which is why interviewers love asking for an example of every combination.' },
      { t: 'table', caption: 'The classic severity / priority matrix', head: ['Combination', 'Example', 'Why'], rows: [
        ['<b>High severity, high priority</b>', 'Card payment fails for every customer at checkout', 'A core function is broken and the business is losing money now'],
        ['<b>High severity, low priority</b>', 'The app crashes when exporting an annual report over 50,000 rows; monthly exports work', 'A crash is severe, but it is rare and has a workaround, so it can be scheduled'],
        ['<b>Low severity, high priority</b>', 'The company name is misspelled on the home page', 'Nothing breaks, but every visitor sees it and it damages trust'],
        ['<b>Low severity, low priority</b>', 'A footer icon is two pixels out of line on the About page', 'Cosmetic, rarely noticed, no business impact']
      ] },
      { t: 'callout', tone: 'warn', title: 'Neutral tone, facts only', html: 'Describe the software, not the person: “The total ignores the coupon” — never “someone forgot the coupon logic again”. Avoid sarcasm, capitals, “!!!” and words like “obviously”. State what you observed and what the requirement says, and label any root-cause idea clearly as a guess. Developers are teammates fixing a shared product.' },
      { t: 'callout', tone: 'tip', title: 'Reproduce before you report', html: 'Repeat the steps from a clean state and note how often the bug appears: always, 3 of 5 tries, or once. Narrow it down — another browser, another account, a smaller cart? An intermittent bug is still worth reporting: say it is intermittent and attach every clue, such as timestamps, logs and network calls.' },
      { t: 'compare', a: { title: 'A report that bounces back', items: ['Title: “Checkout broken!!!”', 'No build, browser or account', 'Steps: “add stuff and try to save address”', '“It doesn’t work” — no expected or actual result', 'No evidence; three unrelated problems in one ticket'] }, b: { title: 'A report that gets fixed', items: ['Title: “Checkout: saving an address with an apostrophe shows ‘Something went wrong’”', 'Build 2.14.0 on staging · Chrome on Windows 11 · <i>shopper.basic@shopflow.test</i>', 'Four numbered steps using the street “O’Brien Road”', 'Expected: address saved (SF-188 AC1). Actual: error banner; address not saved', 'Screenshot plus the 500 response from <code>POST /api/addresses</code>; one problem per report'] } }
    ],
    example: {
      title: 'Worked example: a PeopleOps leave-balance report',
      blocks: [
        { t: 'p', html: 'While testing PeopleOps, Hina cancels an approved 3-day leave request. The status changes to “Cancelled”, but her balance still shows 7 days instead of 10. She repeats it with a second account, gets the same result, notices that cancelling a <i>pending</i> request works fine, and writes this report.' },
        { t: 'code', lang: 'text', title: 'PO-BUG-231', code: `Title:     Leave balance not restored after cancelling an
           approved request
Build:     PeopleOps 3.8.2 (staging) · Chrome on Windows 11
Account:   hina.employee@peopleops.test (balance 10 days)
Severity:  Major        Priority: High (suggested)
Frequency: 3 of 3 attempts, 2 different accounts
Requirement: PO-140 AC4 "Cancelling an approved request
             returns the days to the balance"

Steps to reproduce:
  1. Log in as hina.employee@peopleops.test
  2. Request annual leave for 3 working days
  3. Log in as her manager and approve the request
  4. Log in as Hina, open My Requests, click Cancel, confirm
  5. Look at the Leave Balance card on the dashboard

Expected: status "Cancelled"; balance shows 10 days
Actual:   status "Cancelled"; balance still shows 7 days
          (unchanged after logging out and in again)

Evidence: balance-after-cancel.png; GET /api/leave/balance
          returned {"available": 7} at 10:42 UTC
Notes:    Cancelling a Pending (not yet approved) request
          restores the balance correctly.` },
        { t: 'p', html: 'Why these ratings? Severity is <b>Major</b>: nothing crashes, but a core business rule is wrong and employees lose leave they are entitled to. Priority is only <i>suggested</i> as High, because payroll runs at month end — the product owner makes the final call. The note about pending requests is gold for the developer: it narrows the cause to the approved-request path. And the tone is neutral throughout.' },
        { t: 'p', html: 'What happens next: triage moves it to <b>Assigned</b>; the developer fixes it in 3.8.3 and marks it <b>Fixed</b>. Hina re-runs the same five steps (confirmation testing), then runs regression around balances, approvals and pending cancellations. Both pass, so the bug moves to <b>Verified</b> and then <b>Closed</b>.' }
      ]
    },
    explain: {
      'ur': 'Bug report developer کے لیے آپ کا پیغام ہے۔ اس میں واضح title، environment (build، browser، device)، نمبر وار steps، expected اور actual result، اور screenshot یا log شامل کریں۔ لہجہ غیر جانبدار رکھیں — software کے بارے میں لکھیں، کسی شخص کے بارے میں نہیں۔ <b>Severity</b> کا مطلب ہے اثر کتنا بڑا ہے؛ <b>priority</b> کا مطلب ہے اسے کتنی جلدی ٹھیک کرنا ہے۔ یہ دونوں الگ چیزیں ہیں: home page پر کمپنی کے نام میں spelling کی غلطی low severity مگر high priority ہے، کیونکہ ہر visitor اسے دیکھتا ہے۔ Bug عموماً ان مراحل سے گزرتا ہے: New، Assigned، Open، Fixed، Retest، Verified اور آخر میں Closed۔ اگر retest میں مسئلہ باقی ہو تو bug کو Reopened کر دیا جاتا ہے۔',
      'ur-Latn': 'Bug report developer ke liye aap ka message hai. Is mein saaf title, environment (build, browser, device), number-wise steps, expected aur actual result, aur screenshot ya log shamil karein. Tone neutral rakhein — software ke baare mein likhein, kisi insaan ke baare mein nahi. <b>Severity</b> ka matlab hai impact kitna bara hai; <b>priority</b> ka matlab hai isay kitni jaldi theek karna hai. Yeh dono alag cheezein hain: home page par company ke naam mein spelling ki ghalti low severity magar high priority hai, kyun ke har visitor usay dekhta hai. Bug aam taur par in states se guzarta hai: New → Assigned → Open → Fixed → Retest → Verified → Closed. Agar retest mein masla baqi ho to bug Reopened ho jata hai.',
      'hi': 'Bug report developer के लिए आपका संदेश है। इसमें साफ़ title, environment (build, browser, device), क्रम से लिखे steps, expected और actual result, और screenshot या log शामिल करें। लहजा neutral रखें — software के बारे में लिखें, किसी व्यक्ति के बारे में नहीं। <b>Severity</b> का मतलब है असर कितना बड़ा है; <b>priority</b> का मतलब है इसे कितनी जल्दी ठीक करना है। ये दोनों अलग हैं: home page पर कंपनी के नाम में spelling की गलती low severity लेकिन high priority है, क्योंकि हर visitor उसे देखता है। Bug आम तौर पर इन states से गुज़रता है: New → Assigned → Open → Fixed → Retest → Verified → Closed। अगर retest में समस्या बनी रहे तो bug Reopened हो जाता है।',
      'ar': 'تقرير الخطأ (bug report) هو رسالتك إلى المطوّر. اكتب فيه عنوانًا واضحًا، وبيئة الاختبار (رقم الإصدار، المتصفح، الجهاز)، وخطوات مرقّمة، والنتيجة المتوقعة مقابل النتيجة الفعلية، وأرفق لقطة شاشة أو سجلًا. حافظ على نبرة محايدة — صِف البرنامج لا الأشخاص. <b>الخطورة (severity)</b> تعني حجم التأثير، و<b>الأولوية (priority)</b> تعني مدى الاستعجال في الإصلاح. وهما مختلفتان: خطأ إملائي في اسم الشركة على الصفحة الرئيسية خطورته منخفضة لكن أولويته عالية، لأن كل زائر يراه. يمرّ الخطأ عادةً بالمراحل: New ثم Assigned ثم Open ثم Fixed ثم Retest ثم Verified وأخيرًا Closed. وإذا فشلت إعادة الاختبار يُعاد فتحه بحالة Reopened.',
      'es': 'Un reporte de bug es tu mensaje al desarrollador. Incluye un título claro, el entorno (versión, navegador, dispositivo), pasos numerados, el resultado esperado frente al real, y una captura o un log. Mantén un tono neutral: describe el software, no a las personas. La <b>severidad (severity)</b> indica cuánto impacto tiene; la <b>prioridad (priority)</b> indica con qué urgencia hay que corregirlo. Son distintas: una errata en el nombre de la empresa en la página de inicio tiene severidad baja pero prioridad alta, porque la ve cada visitante. Un bug suele pasar por estos estados: New → Assigned → Open → Fixed → Retest → Verified → Closed. Si el retest falla, se marca como Reopened.'
    },
    keyTerms: [
      { term: 'Defect life cycle', def: 'The states a defect moves through from report to closure, such as New, Assigned, Open, Fixed, Retest, Verified and Closed.' },
      { term: 'Severity', def: 'The impact of a defect on the system or user, usually assessed by the tester (e.g. Critical, Major, Minor, Trivial).' },
      { term: 'Priority', def: 'How urgently a defect should be fixed compared with other work — a business decision by the product owner or triage.' },
      { term: 'Steps to reproduce', def: 'Minimal, numbered actions from a known starting state that make the defect appear.' },
      { term: 'Reopened', def: 'The state used when a retest shows the reported problem still happens after the fix.' },
      { term: 'Deferred', def: 'A confirmed defect whose fix is postponed to a later release, usually by product decision.' }
    ],
    practice: [
      { q: 'Rate severity and priority for each, and justify: (a) login fails for all users; (b) a typo in a rarely visited help article; (c) the CEO’s name is misspelled on the investor page the day before an investor event; (d) exporting an annual report with 50,000+ rows crashes, but monthly exports work.', answer: '(a) <b>High / High</b> — nobody can use the product. (b) <b>Low / Low</b> — cosmetic and rarely seen. (c) <b>Low / High</b> — nothing breaks, but it is highly visible at a critical moment. (d) <b>High / Low</b> (or Medium) — a crash is severe, but it is rare and has a workaround. For priority you suggest; the product owner decides.' },
      { q: 'Rewrite this title so a developer knows where to look: <i>“Bug in profile page”</i>.', hint: 'A useful pattern: Area: what goes wrong + when or with what.', answer: '“Profile: saving a phone number that starts with + shows ‘Invalid input’ (e.g. +92 300 1234567)”. It names the area, the action, the triggering condition and the symptom — and includes the exact data.' },
      { q: 'A developer marks your bug “Cannot reproduce”. What do you do?', answer: 'Re-run it on the latest build from a clean state. Compare environments: build, browser, device, account, test data, feature flags and time zone. Add what was missing — a video, timestamps, console and network logs, the frequency. Offer to reproduce it together. If it truly no longer happens on the new build, say so in the ticket and agree with the developer whether to close it or keep watching.' },
      { q: 'Your retest of a “Fixed” bug fails on the new build. Which state do you use, and what do you write?', answer: 'Move it to <b>Reopened</b> (not a new ticket, unless it is a different problem). Comment with the build number you tested, the steps you re-ran, the actual result, and fresh evidence — e.g. “Retested on 3.8.3 staging: balance still 7 after cancelling an approved request; screenshot and API response attached.”' }
    ],
    quiz: [
      { q: 'Which example is low severity but high priority?', options: ['Checkout crashes for every customer who pays by card', 'A rarely used admin export crashes; a workaround exists', 'The company name is misspelled on the home page', 'A link on an old help page has a small spelling mistake'], correct: 2,
        why: ['High severity (a core function is broken) and high priority — fix immediately.', 'High severity (a crash) but usually lower priority, because it is rare and has a workaround.', 'Right — nothing breaks, but every visitor sees it and it harms trust, so it is fixed urgently.', 'Low severity and low priority — cosmetic and rarely seen.'] },
      { q: 'Who usually makes the final decision on a defect’s priority?', options: ['The product owner or triage group, based on business needs', 'The tester who found it, based on how severe the failure looks', 'The developer, based on how long the fix will take', 'The automation suite, based on how many tests fail'], correct: 0,
        why: ['Right — priority is about urgency and business value, so the product side decides, often in triage.', 'Testers assess severity and may suggest a priority, but urgency is a business call.', 'Effort informs planning, but urgency comes from business impact, not the size of the fix.', 'Failing tests are an input to triage; they do not set business priority.'] },
      { q: 'After a fix, you re-run the exact steps from the bug report on the new build and the problem is gone. What is this activity, and what state comes next?', options: ['Regression testing; the bug moves to Closed directly', 'Smoke testing; the bug moves to Deferred', 'Exploratory testing; the bug moves to Open', 'Confirmation testing (retest); the bug moves to Verified'], correct: 3,
        why: ['Regression checks that other, previously working areas still work; re-running the failed steps is a retest.', 'Smoke testing is a broad, shallow check that a build is testable — and Deferred means postponed, not fixed.', 'Exploratory testing is simultaneous learning and testing; Open means a developer is working on the bug.', 'Right — re-running the failed case is confirmation testing; a passed retest moves the bug to Verified, then Closed.'] },
      { q: 'Which bug title is the most useful?', options: ['URGENT: the checkout page is completely broken again, fix ASAP!!!', 'Checkout: saving an address with an apostrophe shows an error', 'Error on the checkout page found during testing today', 'Problem with addresses in the checkout'], correct: 1,
        why: ['Emotional and vague — it says neither what fails nor when, and “again” adds blame, not information.', 'Right — area, action, condition and symptom in one line, so a developer knows where to look.', 'It says where, but not what goes wrong or under which condition.', 'Too vague: which problem, under which condition, with what symptom?'] },
      { q: 'A checkout bug happens in about 2 of 10 attempts and you cannot find the pattern yet. What should you do?', options: ['Report it as intermittent, with frequency, timestamps, logs and video', 'Wait until you can make it happen every time before reporting it', 'Report it as Critical severity so that someone looks at it quickly', 'Mention it to the developer in a quick chat message instead of logging it'], correct: 0,
        why: ['Right — intermittent bugs are real; the frequency and clues (time, logs, network calls, video) help developers find the pattern.', 'It may never become consistent, and waiting hides a real risk from the team.', 'Inflating severity damages your credibility; rate the impact honestly and let triage set priority.', 'Chat messages get lost; without a ticket there is no tracking, triage or retest.'] }
    ],
    interview: [
      { q: 'What is the difference between severity and priority? Give examples.', a: '<b>Severity</b> is the impact of a defect on the system or user, and the tester usually assesses it. <b>Priority</b> is how urgently it should be fixed, decided by the product owner or triage based on business needs. They are independent. A payment failure for all users is high severity and high priority. A crash in a yearly export with a workaround is high severity but often lower priority. A misspelled company name on the home page is low severity but high priority, because every visitor sees it. A tiny misalignment on a rarely visited page is low on both.' },
      { q: 'What do you include in a good bug report?', a: 'A specific title — area, action, condition and symptom. The environment: build, URL or app version, browser or device and OS, and the test account. Minimal numbered steps from a known starting state, with exact data. The expected result, ideally citing the requirement, and the actual result with exact values or messages. Evidence such as a screenshot, video, console or network logs and a timestamp. Severity, suggested priority and frequency. One problem per report, in a neutral tone that is about the product, not people.' },
      { q: 'Walk me through the defect life cycle.', a: 'I log the bug as <b>New</b>. In triage it is either <b>Assigned</b> to a developer or closed as Rejected (works as designed), Duplicate (linked to the original) or Deferred (fix later). The developer moves it to <b>Open</b> while working and to <b>Fixed</b> when the change is in a test build. I then retest the original steps on that build: if it passes, I mark it <b>Verified</b> and it is <b>Closed</b>, usually after related regression checks; if it fails, I move it to <b>Reopened</b> with the build number and fresh evidence. Exact state names vary by team and tool.' }
    ],
    takeaways: [
      'Defects move New → Assigned → Open → Fixed → Retest → Verified → Closed, with Reopened, Rejected, Duplicate and Deferred as side paths.',
      'A great report has a specific title, environment, minimal steps, expected vs actual, and evidence.',
      'Severity = impact (tester-assessed); priority = urgency (business decision).',
      'A typo in the company name on the home page is low severity, high priority.',
      'Stay neutral, reproduce first, report intermittent bugs honestly — one problem per report.'
    ],
    links: { labs: ['bughunt'], challenges: ['bug-report'], interview: ['m2', 'm4'] }
  },
  {
    id: 'mt-decision-tables',
    n: 6,
    level: 'intermediate',
    title: 'Decision table testing',
    summary: 'Model business rules that combine several conditions as a decision table, collapse it safely, and derive one test case per rule.',
    minutes: 20,
    objectives: [
      'Identify the conditions and actions hidden in a business rule',
      'Build a complete decision table with 2ⁿ rules for n yes/no conditions',
      'Collapse rules with “don’t care” entries without losing coverage',
      'Derive one test per rule and spot missing or contradictory requirements'
    ],
    body: [
      { t: 'p', html: 'Partitions and boundaries look at one input at a time. Many real bugs come from <b>combinations</b>: members get a discount, coupons give a discount, large orders ship free — but what does a member with a coupon and a $60 order pay? When behaviour depends on several conditions together, a <b>decision table</b> lays out every combination so that none is forgotten, by the developer or by you.' },
      { t: 'h', text: 'Conditions, actions and rules' },
      { t: 'cards', items: [
        { title: 'Conditions', html: 'The inputs or situations that influence the outcome, phrased as yes/no questions: “Is the customer a member?”' },
        { title: 'Actions', html: 'What the system does as a result: apply 10% off, charge shipping, show a message, send for approval.' },
        { title: 'Rules', html: 'One unique combination of condition values plus the actions that follow. Each rule becomes at least one test case.' }
      ] },
      { t: 'p', html: 'With <b>n</b> yes/no conditions there are <b>2ⁿ</b> combinations: 2 conditions give 4 rules, 3 give 8, 4 give 16. Writing them all out is the point — it forces questions about combinations nobody discussed. A reliable way to fill the table: in the first condition column, make the first half of the rows Y and the second half N; in the next column alternate in pairs; in the last column alternate Y, N. Every combination then appears exactly once.' },
      { t: 'table', caption: 'Store pricing rule — member 10% off; valid coupon 15% off; discounts never stack (the larger applies); subtotal ≥ $100 ships free', head: ['Rule', 'Member?', 'Valid coupon?', 'Subtotal ≥ $100?', 'Expected actions'], rows: [
        ['R1', 'Y', 'Y', 'Y', '15% off · free shipping'],
        ['R2', 'Y', 'Y', 'N', '15% off · shipping charged'],
        ['R3', 'Y', 'N', 'Y', '10% off · free shipping'],
        ['R4', 'Y', 'N', 'N', '10% off · shipping charged'],
        ['R5', 'N', 'Y', 'Y', '15% off · free shipping'],
        ['R6', 'N', 'Y', 'N', '15% off · shipping charged'],
        ['R7', 'N', 'N', 'Y', 'No discount · free shipping'],
        ['R8', 'N', 'N', 'N', 'No discount · shipping charged']
      ] },
      { t: 'h', text: 'Collapsing rules with “don’t care”' },
      { t: 'p', html: 'Compare R1 and R5: the coupon wins whether or not the customer is a member, so membership does not change the outcome. When two rules differ in only one condition and have identical actions, you can merge them and mark that condition <b>–</b> (“don’t care”). R2 and R6 merge the same way, leaving six rules: <b>R1+R5</b> (–, Y, Y), <b>R2+R6</b> (–, Y, N), R3, R4, R7 and R8. Collapse only when the requirement really makes the condition irrelevant, and pick a concrete value for the “–” when you run the test.' },
      { t: 'callout', tone: 'key', title: 'The table finds gaps before it finds bugs', html: 'Building this table raised two questions the requirement never answered. Is the $100 threshold checked <b>before or after</b> the discount? (A $105 member order becomes $94.50.) And is an <b>expired</b> coupon treated as “no coupon” or shown as an error? Gaps like these are requirement defects — raise them before writing a single test.' },
      { t: 'h', text: 'From rules to test cases' },
      { t: 'p', html: 'Each rule becomes at least one test case: choose concrete data that makes every condition true or false as the rule requires, and turn the actions into expected results. R4 becomes: “Member, no coupon, $60.00 subtotal → $6.00 discount, shipping charged.” Add <b>boundary values</b> for numeric conditions — run at least one rule at $99.99 and $100.00. Finally, look for <b>impossible</b> combinations (mark them so nobody tests them) and rules with <b>no action defined</b>, which are gaps to raise.' },
      { t: 'list', items: [
        'Pricing, discounts, fees and tax rules with several conditions.',
        'Eligibility and approval: loans, insurance quotes, leave or expense approval.',
        'Permission matrices: role × action × state of the record.',
        'Forms where one answer changes which other fields are required.',
        'Any requirement full of “if… and… unless…” sentences.'
      ] },
      { t: 'callout', tone: 'info', title: 'Cause–effect graphing', html: 'A related technique, <b>cause–effect graphing</b>, draws causes (conditions) and effects (actions) as a diagram joined by AND, OR and NOT, then converts it into a decision table. You will rarely draw one in daily work, but interviewers may ask: it is a systematic way to derive a decision table from complex logic.' }
    ],
    example: {
      title: 'Worked example: PayLite micro-loan approval',
      blocks: [
        { t: 'p', html: '<b>Requirement:</b> “An applicant whose identity is not verified is always rejected. A verified applicant with a credit score of 650 or more <i>and</i> a monthly income of at least twice the instalment is approved. If only one of those two conditions is met, the application goes to manual review. If neither is met, it is rejected.” Three yes/no conditions give 2³ = 8 rules; the four “not verified” rules share one action, so they collapse into one.' },
        { t: 'table', caption: 'Collapsed decision table (– = don’t care)', head: ['Rule', 'Verified?', 'Score ≥ 650?', 'Income ≥ 2× instalment?', 'Action'], rows: [
          ['R1', 'N', '–', '–', 'Reject'],
          ['R2', 'Y', 'Y', 'Y', 'Approve'],
          ['R3', 'Y', 'Y', 'N', 'Manual review'],
          ['R4', 'Y', 'N', 'Y', 'Manual review'],
          ['R5', 'Y', 'N', 'N', 'Reject']
        ] },
        { t: 'table', head: ['Test', 'Rule', 'Test data', 'Expected result'], rows: [
          ['DT-01', 'R1', 'Not verified; score 800; income 3× instalment', 'Rejected — despite the strong score and income'],
          ['DT-02', 'R2', 'Verified; score exactly 650; income exactly 2× instalment', 'Approved (both limits are inclusive)'],
          ['DT-03', 'R3', 'Verified; score 720; income 1.5× instalment', 'Sent to manual review'],
          ['DT-04', 'R4', 'Verified; score 649; income 3× instalment', 'Sent to manual review'],
          ['DT-05', 'R5', 'Verified; score 600; income 1.5× instalment', 'Rejected']
        ] },
        { t: 'p', html: 'Five tests cover every rule. DT-01 deliberately uses the <i>strongest</i> score and income: if the system approves it, the verification check is missing or runs too late — weak values would be rejected anyway and hide that defect. DT-02 and DT-04 put the score on its boundary (650 and 649), combining decision tables with BVA. A tester who checked only one approval and one rejection would miss both manual-review rules.' }
      ]
    },
    explain: {
      'ur': 'جب نتیجہ ایک ساتھ کئی conditions پر منحصر ہو تو decision table استعمال کی جاتی ہے۔ ہر condition کو ہاں/نہیں والے سوال کی طرح لکھیں اور تمام combinations کی فہرست بنائیں: 3 conditions ہوں تو 2×2×2 یعنی 8 combinations (rules) بنتے ہیں۔ ہر rule کے سامنے expected action لکھیں۔ مثال: loan کے لیے — کیا identity verified ہے؟ کیا credit score کم از کم 650 ہے؟ کیا آمدنی کافی ہے؟ اگر identity verified نہیں تو loan ہمیشہ reject ہوگا، اس لیے وہ 4 rules مل کر ایک rule بن جاتے ہیں (باقی conditions “don’t care” ہیں)۔ باقی ہر rule ایک test case بنتا ہے۔ یہ table ایسی کمیاں بھی سامنے لاتی ہے جیسے کوئی combination جس کا جواب requirement میں لکھا ہی نہیں۔',
      'ur-Latn': 'Jab result ek saath kayi conditions par depend kare to decision table use hoti hai. Har condition ko haan/nahi wale sawal ki tarah likhein aur saare combinations ki list banayein: 3 conditions hon to 2×2×2 yani 8 combinations (rules) bante hain. Har rule ke saamne expected action likhein. Misaal: loan ke liye — kya identity verified hai? Kya credit score kam az kam 650 hai? Kya income kaafi hai? Agar identity verified nahi to loan hamesha reject hoga, is liye woh 4 rules mil kar ek rule ban jate hain (baaqi conditions “don’t care” hain). Baaqi har rule ek test case banta hai. Yeh table aisi kamiyan bhi saamne laati hai jaise koi combination jis ka jawab requirement mein likha hi nahi.',
      'hi': 'जब नतीजा एक साथ कई conditions पर निर्भर हो, तब decision table का इस्तेमाल होता है। हर condition को हाँ/नहीं वाले सवाल की तरह लिखें और सारे combinations की सूची बनाएँ: 3 conditions हों तो 2×2×2 यानी 8 combinations (rules) बनते हैं। हर rule के सामने expected action लिखें। उदाहरण: loan के लिए — क्या identity verified है? क्या credit score कम से कम 650 है? क्या आमदनी काफ़ी है? अगर identity verified नहीं है तो loan हमेशा reject होगा, इसलिए वे 4 rules मिलकर एक rule बन जाते हैं (बाकी conditions “don’t care” हैं)। बाकी हर rule एक test case बनता है। यह table ऐसी कमियाँ भी सामने लाती है, जैसे कोई combination जिसका जवाब requirement में लिखा ही नहीं।',
      'ar': 'نستخدم جدول القرار (decision table) عندما تعتمد النتيجة على عدة شروط معًا. اكتب كل شرط كسؤال إجابته نعم أو لا، ثم اذكر كل التركيبات الممكنة: مع 3 شروط توجد 2×2×2 أي 8 تركيبات (قواعد). اكتب أمام كل قاعدة الإجراء المتوقع. مثال: في طلب قرض — هل الهوية موثّقة؟ هل درجة الائتمان 650 أو أكثر؟ هل الدخل كافٍ؟ إذا لم تكن الهوية موثّقة يُرفض الطلب دائمًا، لذلك تُدمج تلك القواعد الأربع في قاعدة واحدة (والشروط الأخرى «لا يهم»). كل قاعدة متبقية تصبح حالة اختبار. كما يكشف الجدول ثغرات في المتطلبات، مثل تركيبة لم يحدد أحد ما يجب أن يحدث فيها.',
      'es': 'Una tabla de decisión (decision table) se usa cuando el resultado depende de varias condiciones a la vez. Escribe cada condición como una pregunta de sí o no y enumera todas las combinaciones: con 3 condiciones hay 2×2×2, es decir, 8 combinaciones (reglas). Para cada regla anota la acción esperada. Ejemplo: en un préstamo — ¿la identidad está verificada? ¿la puntuación de crédito es de al menos 650? ¿los ingresos son suficientes? Si la identidad no está verificada, siempre se rechaza, así que esas 4 reglas se combinan en una sola (las demás condiciones dan igual: don’t care). Cada regla restante se convierte en un caso de prueba. La tabla también revela huecos en el requisito, como una combinación que nadie definió.'
    },
    keyTerms: [
      { term: 'Decision table', def: 'A table listing combinations of conditions and the actions the system should take for each combination.' },
      { term: 'Condition', def: 'A factor that influences the outcome, usually phrased as a yes/no question such as “Is the customer a member?”' },
      { term: 'Action', def: 'The expected system behaviour for a rule, such as approve, reject or apply a discount.' },
      { term: 'Rule', def: 'One unique combination of condition values with its actions; each rule becomes at least one test case.' },
      { term: 'Don’t care (–)', def: 'Marks a condition that does not affect the outcome in a collapsed rule.' },
      { term: 'Cause–effect graphing', def: 'Models causes and effects with logical links (AND, OR, NOT) and converts them into a decision table.' }
    ],
    practice: [
      { q: 'PeopleOps expense claims: claims up to $200 are auto-approved, claims above $200 need manager approval, and claims without a receipt are always rejected. Build the decision table and derive tests.', hint: 'Two yes/no conditions give four rules. Can any be merged?', answer: 'Conditions: Receipt attached? Amount ≤ $200? Rules: (Y, Y) → auto-approve; (Y, N) → manager approval; (N, Y) and (N, N) → reject, which collapse to <b>(N, –) → reject</b>. Tests: $200.00 with receipt → auto-approved; $200.01 with receipt → manager approval; no receipt with $500.00 → rejected (a high amount makes a missing receipt check obvious). Confirm with the product owner that “up to $200” includes $200.00.' },
      { q: 'How many rules does a full table have for <b>4</b> yes/no conditions? What if one condition has three values (Gold, Silver, None) and two others are yes/no?', answer: '4 yes/no conditions: 2⁴ = <b>16</b> rules. With one three-value condition and two yes/no conditions: 3 × 2 × 2 = <b>12</b> rules. Multiply the number of possible values of each condition.' },
      { q: 'In the PayLite example, rule R1 is (Not verified, –, –) → Reject. Which values would you pick for the two “–” conditions, and why?', answer: 'The <b>strongest</b> ones: a high score and a high income. If verification is not enforced, a strong applicant would be approved and the defect becomes visible. With weak values the application is rejected for the wrong reason, so the test passes and hides the bug. For a high-risk rule you might add a second test with mixed values.' },
      { q: 'Requirement: <i>“Free delivery for orders over $50. Express delivery costs $10 extra.”</i> Sketch the decision table and list the questions it raises.', answer: 'Conditions: Order over $50? Express selected? Four rules: (Y, N) → free standard delivery; (N, N) → standard fee; (Y, Y) and (N, Y) → express fee. Questions: what is the standard fee? On an order over $50, does express cost $10 or the standard fee + $10? Does “over $50” exclude exactly $50.00? Is the $50 measured before or after discounts?' }
    ],
    quiz: [
      { q: 'A business rule depends on 3 independent yes/no conditions. How many rules does the full decision table have?', options: ['6', '8', '9', '3'], correct: 1,
        why: ['That is 3 × 2, but combinations multiply: 2 × 2 × 2.', 'Right — 2³ = 8 combinations.', '3² = 9 would mean two conditions with three values each; here there are three conditions with two values each.', 'That counts the conditions, not the combinations of their values.'] },
      { q: 'What does a “–” (don’t care) entry in a collapsed decision table mean?', options: ['The condition was forgotten and must be added later', 'The rule is impossible and should never be tested', 'The tester may skip that rule during execution', 'The condition does not change the outcome for that rule'], correct: 3,
        why: ['A missing condition is a gap to raise; “–” is a deliberate statement that it does not matter.', 'Impossible combinations are marked separately; a “–” rule is real and is tested.', 'A collapsed rule is still a rule — it is tested once, with a concrete value chosen for the “–”.', 'Right — whatever the value, the actions are the same, so the rules can be merged.'] },
      { q: 'When is decision table testing the best fit?', options: ['When the outcome depends on combinations of several conditions', 'When a single numeric field has a minimum and a maximum', 'When the system moves through states such as Pending and Approved', 'When you need to explore a new feature without any documentation'], correct: 0,
        why: ['Right — decision tables make every combination of conditions, and its actions, explicit.', 'That is a job for boundary value analysis and equivalence partitioning.', 'State-based behaviour is modelled with state transition testing.', 'That calls for exploratory testing; a decision table needs known rules to model.'] },
      { q: 'Insurance rule: drivers under 25 pay a surcharge; drivers with a claim in the last 3 years pay a surcharge; drivers with both pay both. A tester tests “under 25, no claim” and “25 or older, with a claim”. What is still untested?', options: ['Only the rule for a driver under 25 with a recent claim', 'Only the rule for a driver 25 or older with no claims', 'Under 25 with a claim, and 25 or older with no claim', 'No rules — each condition has already been tested once as true'], correct: 2,
        why: ['It is missing, but so is the rule with no surcharge at all.', 'It is missing, but so is the rule where both surcharges apply — the riskiest combination.', 'Right — 2² = 4 rules and only two were tested; “both surcharges” and “no surcharge” are untested.', 'Testing each condition once is not the same as testing each combination; the “pay both” interaction goes unchecked.'] },
      { q: 'While building a decision table for a discount, you find a combination for which the requirement defines no action. What should you do?', options: ['Pick the most sensible action yourself and test against it', 'Leave the combination out, since users rarely reach it', 'Raise it with the product owner as a requirement gap', 'Log it as a code defect assigned to the developer'], correct: 2,
        why: ['Your guess may differ from the business rule; the test would check your assumption, not the requirement.', 'Rare combinations still happen in production, and undefined behaviour is a real risk.', 'Right — a missing rule is a requirement defect; get the expected action agreed and documented.', 'No code has been shown to be wrong yet; the gap is in the requirement, so clarify it first.'] }
    ],
    interview: [
      { q: 'What is decision table testing, and when would you use it?', a: 'Decision table testing models business rules where the outcome depends on a <b>combination</b> of conditions. I list the conditions as yes/no questions, write out every combination — 2ⁿ for n yes/no conditions — and record the expected action for each rule. Then I collapse rules where a condition does not affect the result and derive at least one test per remaining rule, adding boundary values for numeric conditions. I use it for pricing, discounts, eligibility, approvals and permissions. A big benefit is that it exposes missing or contradictory requirements before testing starts.' },
      { q: 'Your decision table has 64 rules. How do you keep the testing practical?', a: '64 rules means six yes/no conditions. First I collapse rules with “don’t care” conditions where the requirement allows it, and remove impossible combinations. Then I check whether some conditions are independent — for example, shipping depends only on the subtotal — and split them into smaller tables. If it is still large, I prioritise rules by risk and business impact, and I can use pairwise techniques for broad interaction coverage. I make every reduction explicit so the team knows what is not covered.' }
    ],
    takeaways: [
      'Use decision tables when the outcome depends on combinations of conditions.',
      'n yes/no conditions give 2ⁿ rules — write them all out before reducing.',
      'Collapse only where a condition truly does not change the outcome (“–”).',
      'Each rule becomes at least one test; add boundary values for numeric conditions.',
      'Missing or contradictory rules are requirement defects — raise them early.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'] }
  }
]);
