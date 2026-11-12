/* Qadence content · stage "manual" · lessons 7–11 (state transitions → planning),
   plus the Test Center bank and practice drills for the whole manual stage.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-manual-b.js */
QA_CONTENT.addLessons('manual', [
  {
    id: 'mt-state-transition',
    n: 7,
    level: 'intermediate',
    title: 'State transition testing',
    summary: 'Model behaviour that depends on history — states, events, transitions and guards — and test both the valid moves and the forbidden ones.',
    minutes: 20,
    objectives: [
      'Identify states, events, transitions, guards and actions in a requirement',
      'Turn a state diagram into a state transition table that includes invalid transitions',
      'Design test sequences that achieve 0-switch (valid transitions) coverage',
      'Write invalid-transition tests with clear expected results'
    ],
    body: [
      { t: 'p', html: 'Some features answer the same input differently depending on <b>what happened before</b>. The correct password logs you in on the second attempt, but not after the account is locked. A “Cancel order” button works for a paid order but must not work once the parcel has shipped. Equivalence partitions and boundaries look at single inputs; they do not capture history. <b>State transition testing</b> models the system as a set of states and the events that move it between them, then tests both the moves that should happen and the ones that must not.' },
      { t: 'cards', items: [
        { title: 'State', html: 'A condition the system stays in until something happens — <i>Active</i>, <i>Locked</i>, <i>Paid</i>, <i>Shipped</i>. The same input can give different results in different states.' },
        { title: 'Event', html: 'Something that happens to the system: a user action (enter password), a message (payment confirmed) or time passing (30 minutes elapse).' },
        { title: 'Transition', html: 'The move from one state to another caused by an event. A transition can also loop back to the same state.' },
        { title: 'Guard', html: 'A condition that must be true for the transition to fire, written in brackets: <code>wrong password [failures = 2]</code> → Locked.' },
        { title: 'Action', html: 'What the system does during the transition — reset a counter, send an email, issue a refund. Check actions, not just the new state.' }
      ] },
      { t: 'h', text: 'From diagram to state transition table' },
      { t: 'p', html: 'A <b>state diagram</b> draws states as boxes and transitions as labelled arrows. It is great for discussion, but a missing arrow is easy to overlook. A <b>state transition table</b> lists every state against every event. Each cell says where the system goes — or that the event is <b>invalid</b> in that state. Cells nobody can fill are questions for the product owner: “What should happen if an admin unlocks an account that is not locked?”' },
      { t: 'table', caption: 'PeopleOps login: the account locks on the 3rd consecutive wrong password; a successful login resets the count; S4 = Logged in', head: ['Current state', 'Correct password', 'Wrong password', 'Admin unlocks'], rows: [
        ['<b>S0</b> Active, 0 failures', '→ S4 Logged in', '→ S1', '<i>Invalid</i> — no change'],
        ['<b>S1</b> Active, 1 failure', '→ S4, counter reset to 0', '→ S2', '<i>Invalid</i> — no change'],
        ['<b>S2</b> Active, 2 failures', '→ S4, counter reset to 0', '→ S3 Locked, email sent', '<i>Invalid</i> — no change'],
        ['<b>S3</b> Locked', '<i>Invalid</i> — stays S3, “Account locked”, <b>no login</b>', '<i>Invalid</i> — stays S3, no second email', '→ S0, counter reset']
      ] },
      { t: 'p', html: 'This table has <b>7 valid transitions</b> and <b>5 invalid cells</b>. The most important negative test sits in the S3 row: the <b>correct</b> password must still be refused while the account is locked. A lockout that accepts the right password is no lockout at all — an attacker can simply keep guessing until one attempt succeeds. Code that checks the password before it checks the lock flag fails exactly here.' },
      { t: 'h', text: 'How much coverage is enough?' },
      { t: 'table', head: ['Coverage level', 'What you must exercise', 'Login example'], rows: [
        ['All states', 'Visit every state at least once', 'One long sequence: wrong ×3, unlock, correct'],
        ['<b>0-switch</b> (valid transitions)', 'Every valid transition at least once', 'All 7 valid arrows — three sequences are enough'],
        ['All transitions', 'Every valid transition, plus an attempt at every invalid cell', '7 valid transitions + 5 invalid attempts'],
        ['1-switch', 'Every pair of consecutive valid transitions', 'e.g. S1→S2 followed by S2→S3; kept for high-risk flows']
      ] },
      { t: 'callout', tone: 'key', title: '0-switch coverage in one sentence', html: '<b>0-switch coverage</b> means every valid single transition is exercised at least once. A test is usually a <i>sequence</i> of events, so one test can cover several transitions — the number of tests is often smaller than the number of transitions. ISTQB also calls it <b>valid transitions coverage</b>; adding attempts at the invalid cells gives <b>all transitions coverage</b>.' },
      { t: 'h', text: 'Invalid transitions: where serious bugs hide' },
      { t: 'p', html: 'Users, browsers and integrations do not always follow the happy path. They press <kbd>Back</kbd> after paying, double-click buttons, open the same order in two tabs, or call the API directly. Each of these can fire an event in a state where it is not allowed. For every invalid cell, test that the system <b>refuses the event, shows a clear message and leaves the state and data unchanged</b>. Try the risky ones through the API too, because a hidden button in the UI is not a server-side rule.' },
      { t: 'list', items: [
        '<b>Accounts:</b> active, locked, suspended, deleted; password-reset links that are unused, used or expired',
        '<b>Orders and payments:</b> pending payment, paid, shipped, delivered, cancelled, refunded',
        '<b>Subscriptions:</b> trial, active, past due, cancelled',
        '<b>Workflows:</b> leave requests, document approvals — and the defect life cycle itself',
        '<b>Sessions and timers:</b> logged in, idle, timed out'
      ] },
      { t: 'callout', tone: 'warn', title: 'Guards and timers need boundaries too', html: 'Guards are often counts or times, so combine state testing with boundary value analysis. If the account locks on the 3rd consecutive failure, test exactly 2 and 3 failures, and a success in between. If a lock lifts after 30 minutes, test 29:59 (still locked) and 30:00 (unlocked). Also ask what resets the counter — a successful login, a password reset, or midnight?' }
    ],
    example: {
      title: 'Worked example: ShopFlow order status flow',
      blocks: [
        { t: 'p', html: '<b>Rules:</b> a new order starts as <i>Pending payment</i>. Payment moves it to <i>Paid</i>. Paid orders can be shipped, and shipped orders delivered. Customers may cancel while the order is Pending payment or Paid (a paid order is refunded). Once shipped, cancellation is not allowed — the customer uses the returns flow instead.' },
        { t: 'table', head: ['State', 'Pay', 'Ship', 'Deliver', 'Cancel'], rows: [
          ['Pending payment', '→ Paid', 'Invalid', 'Invalid', '→ Cancelled'],
          ['Paid', '<b>Invalid</b> (double-charge risk)', '→ Shipped', 'Invalid', '→ Cancelled + refund'],
          ['Shipped', 'Invalid', 'Invalid', '→ Delivered', '<b>Invalid</b> (use returns)'],
          ['Delivered', 'Invalid', 'Invalid', 'Invalid', 'Invalid'],
          ['Cancelled', 'Invalid', '<b>Invalid</b>', 'Invalid', 'Invalid']
        ] },
        { t: 'p', html: '<b>0-switch coverage:</b> there are 5 valid transitions, and three sequences cover them all: <b>T1</b> Pay → Ship → Deliver; <b>T2</b> Cancel from Pending payment; <b>T3</b> Pay → Cancel (check the refund action). Of the 15 invalid cells, start with the risky ones: pay twice for one order, cancel a shipped order, ship a cancelled order, and send each event to a delivered order through the API. Expected result for every invalid attempt: refused with a clear message, no state change, no money moved.' },
        { t: 'callout', tone: 'tip', title: 'Name tests by their path', html: 'Titles such as “Paid → Cancelled: refund issued to the original card” make coverage visible at a glance and map straight back to the table during review.' }
      ]
    },
    explain: {
      'ur': 'State transition testing اس وقت استعمال ہوتی ہے جب سسٹم کا جواب اس بات پر منحصر ہو کہ پہلے کیا ہو چکا ہے۔ مثال: PeopleOps میں تین بار غلط password ڈالنے پر account لاک ہو جاتا ہے۔ اب اگر صحیح password بھی ڈالیں تو login نہیں ہونا چاہیے۔ یعنی ایک ہی input مختلف state میں مختلف نتیجہ دیتا ہے۔ ہم پہلے states (جیسے Active، Locked)، events (صحیح یا غلط password) اور transitions کی ایک table بناتے ہیں۔ پھر ہر valid transition کو کم از کم ایک بار ٹیسٹ کرتے ہیں، جسے 0-switch coverage کہتے ہیں۔ اس کے بعد invalid transitions بھی آزماتے ہیں، جیسے shipped order کو cancel کرنا۔ ایسی کوشش پر سسٹم کو صاف پیغام دینا چاہیے اور state نہیں بدلنی چاہیے۔',
      'ur-Latn': 'State transition testing tab kaam aati hai jab system ka jawab is baat par depend kare ke pehle kya ho chuka hai. Misaal: PeopleOps mein teen dafa ghalat password dalne par account lock ho jata hai. Ab agar sahi password bhi dalein to login nahi hona chahiye. Yani ek hi input alag state mein alag result deta hai. Hum pehle states (jaise Active, Locked), events (sahi ya ghalat password) aur transitions ki ek table banate hain. Phir har valid transition ko kam az kam ek dafa test karte hain — isay 0-switch coverage kehte hain. Us ke baad invalid transitions bhi try karte hain, jaise shipped order ko cancel karna. Aisi koshish par system ko saaf message dena chahiye aur state change nahi honi chahiye.',
      'hi': 'State transition testing तब काम आती है जब system का जवाब इस बात पर निर्भर करे कि पहले क्या हो चुका है। उदाहरण: PeopleOps में तीन बार गलत password डालने पर account lock हो जाता है। अब सही password डालने पर भी login नहीं होना चाहिए। यानी एक ही input अलग state में अलग नतीजा देता है। हम पहले states (जैसे Active, Locked), events (सही या गलत password) और transitions की एक table बनाते हैं। फिर हर valid transition को कम से कम एक बार test करते हैं — इसे 0-switch coverage कहते हैं। इसके बाद invalid transitions भी आज़माते हैं, जैसे shipped order को cancel करना। ऐसी कोशिश पर system को साफ़ message देना चाहिए और state नहीं बदलनी चाहिए।',
      'ar': 'نستخدم اختبار انتقال الحالات (State transition testing) عندما تعتمد استجابة النظام على ما حدث من قبل. مثال: في نظام PeopleOps يُقفل الحساب بعد ثلاث محاولات خاطئة متتالية لكلمة المرور، وبعدها يجب ألا يتم تسجيل الدخول حتى لو أُدخلت كلمة المرور الصحيحة. أي أن المُدخل نفسه يعطي نتيجة مختلفة في حالة مختلفة. نبدأ بجدول يضم الحالات (مثل Active وLocked) والأحداث (كلمة مرور صحيحة أو خاطئة) والانتقالات بينها. ثم نختبر كل انتقال صالح مرة واحدة على الأقل، وهذا ما يُسمّى 0-switch coverage. بعد ذلك نجرّب الانتقالات غير الصالحة، مثل إلغاء طلب تم شحنه، ويجب أن يرفض النظام ذلك برسالة واضحة دون أن تتغير الحالة.',
      'es': 'Las pruebas de transición de estados (state transition testing) sirven cuando la respuesta del sistema depende de lo que pasó antes. Ejemplo: en PeopleOps la cuenta se bloquea tras tres contraseñas incorrectas seguidas; a partir de ahí, ni siquiera la contraseña correcta debe permitir el acceso. La misma entrada da un resultado distinto según el estado. Primero hacemos una tabla con los estados (Active, Locked), los eventos (contraseña correcta o incorrecta) y las transiciones. Luego probamos cada transición válida al menos una vez, lo que se llama 0-switch coverage. Después intentamos las transiciones inválidas, como cancelar un pedido ya enviado: el sistema debe rechazarlo con un mensaje claro y sin cambiar de estado.'
    },
    keyTerms: [
      { term: 'State', def: 'A condition the system remains in until an event occurs, such as Active, Locked, Paid or Shipped.' },
      { term: 'Event', def: 'Something that happens to the system — a user action, a message or time passing — that may trigger a transition.' },
      { term: 'Guard', def: 'A condition that must be true for a transition to fire, e.g. [failures = 2] before a wrong password locks the account.' },
      { term: 'State transition table', def: 'A grid of every state against every event, showing the resulting state or that the event is invalid there.' },
      { term: '0-switch coverage', def: 'Every valid single transition exercised at least once. Also called valid transitions coverage.' },
      { term: 'Invalid transition', def: 'An event that must be refused in the current state, such as cancelling an order that has already shipped.' }
    ],
    practice: [
      { q: 'Using the PeopleOps login table above, write the <b>fewest event sequences</b> that achieve 0-switch coverage.', hint: 'One sequence can pass through many transitions. Admin unlock returns you to S0, so the sequence can continue.', answer: 'Three sequences are enough: <b>(a)</b> wrong, correct (S0→S1, S1→S4); <b>(b)</b> wrong, wrong, correct (S0→S1→S2→S4); <b>(c)</b> wrong ×3, admin unlock, correct (S0→S1→S2→S3→S0→S4). Together they exercise all 7 valid transitions. You cannot do it in two, because three different transitions end in S4 and each sequence ends there. On each step, also check the action: the counter resets after success and the email is sent on locking.' },
      { q: 'List the invalid-transition tests for the same table, with the expected result for each.', answer: '<b>Locked + correct password</b> → refused, “Account locked”, no session created (the critical one). <b>Locked + wrong password</b> → refused, still locked, no second lock email. <b>Admin unlock on S0, S1 or S2</b> → no change and no error. Then send the login request straight to the API while locked — the server must refuse it, not only the UI.' },
      { q: 'A PayLite subscription starts in <b>Trial</b>. Payment success moves it to <b>Active</b>; a failed renewal moves it to <b>Past due</b>; a successful retry returns it to Active; a third failed retry or a user cancellation moves it to <b>Cancelled</b>. Name the states, the events and two invalid transitions you would test.', hint: 'Think about events that make no sense in Active or Cancelled.', answer: 'States: Trial, Active, Past due, Cancelled. Events: payment succeeds, renewal fails, retry succeeds, third retry fails, user cancels. Invalid examples: <b>“retry succeeds”</b> on an Active or Cancelled subscription (there is nothing to retry — it must not charge the card), and <b>“renewal fails”</b> on a Cancelled subscription. Also ask what happens when a trial ends without payment, and whether a Cancelled subscription can be reactivated — gaps in the table are questions for the product owner.' },
      { q: 'The lock lifts automatically after <b>30 minutes</b>. Which time-based tests would you add?', answer: 'Try to log in just before 30:00 → still locked; at 30:00 or just after → the correct password works and the counter is back to 0. Confirm which clock counts (the server’s, not the user’s device) and whether a login attempt during the lock restarts the 30-minute timer — that rule must be written down before you can test it.' }
    ],
    quiz: [
      { q: 'In a state model, what is a guard?', options: ['The event that triggers a transition', 'The action the system performs after moving', 'A condition that must be true for a transition to fire', 'A final state with no outgoing transitions'], correct: 2,
        why: ['The event is the trigger; a guard is an extra condition checked when the event happens.', 'That is an action, such as sending an email. A guard is checked before the move happens.', 'Correct — e.g. <code>wrong password [failures = 2]</code> locks the account only when the condition holds.', 'That describes a final (terminal) state, such as Delivered.'] },
      { q: 'What does 0-switch coverage require?', options: ['Every valid single transition is exercised at least once', 'Every state is visited at least once', 'Every pair of consecutive transitions is tested', 'Every cell of the table, valid or invalid, is tried'], correct: 0,
        why: ['Correct — it is also called valid transitions coverage.', 'That is all states coverage, which is weaker: you can visit every state without using every arrow.', 'That is 1-switch coverage — more thorough and more expensive.', 'That is all transitions coverage, which adds attempts at the invalid cells.'] },
      { q: 'An account locks after 3 consecutive wrong passwords. A tester locks it and then enters the correct password. What is the expected result?', options: ['Login succeeds because the password is correct', 'Login succeeds and the failure counter resets', 'A 4th failure is recorded and a CAPTCHA appears', 'Login is refused with a locked message; the account stays locked'], correct: 3,
        why: ['A lockout that accepts the right password gives no protection — an attacker could keep guessing.', 'A successful login resets the counter only while the account is active, not while it is locked.', 'The password was correct, so it is not a failure, and nothing in the rule mentions a CAPTCHA.', 'Correct — in the Locked state, login attempts are invalid events: refuse them, keep the state and show a clear message.'] },
      { q: 'In ShopFlow, an order can be cancelled only before it ships. Which test targets an invalid transition?', options: ['Pay for a pending order and check it becomes Paid', 'Try to cancel an order that is already Shipped', 'Ship a paid order and check the tracking number', 'Mark a shipped order as Delivered'], correct: 1,
        why: ['A valid transition (Pending payment → Paid).', 'Correct — Cancel is not allowed in Shipped; expect a refusal, no state change and no refund.', 'A valid transition (Paid → Shipped) and its action.', 'A valid transition (Shipped → Delivered).'] },
      { q: 'Why turn a state diagram into a state transition table?', options: ['Testing standards do not accept diagrams as a test basis', 'Automation tools can run a table directly as test scripts', 'Every state–event pair appears, so gaps become visible', 'A table means invalid transitions no longer need testing'], correct: 2,
        why: ['Diagrams are a perfectly good test basis; the table simply makes gaps easier to see.', 'A table is a design aid, not an executable script.', 'Correct — each empty or unclear cell is an undefined or invalid transition to clarify and test.', 'The opposite: the table is what reveals the invalid transitions you need to test.'] }
    ],
    interview: [
      { q: 'When would you use state transition testing? Give an example.', a: 'I use it when behaviour depends on history rather than a single input — account lockout, order status, subscriptions, approval workflows or session time-outs. For a lockout rule I list the states (active with 0, 1 or 2 failures, locked, logged in), the events (correct password, wrong password, unlock) and build a state transition table. I cover every valid transition at least once (<b>0-switch coverage</b>), then test the invalid cells — especially the correct password while locked, which must still be refused. I also check actions such as the lock email and counter reset, and repeat key invalid events through the API.' },
      { q: 'What is the difference between 0-switch and 1-switch coverage?', a: '<b>0-switch</b> coverage exercises every single valid transition at least once. <b>1-switch</b> coverage exercises every valid <i>pair</i> of consecutive transitions — for example Paid → Shipped followed by Shipped → Delivered. 1-switch finds bugs that depend on the previous step, such as a counter that is not reset, but it needs many more tests. I use 0-switch by default and 1-switch, or selected longer paths, for high-risk flows such as payments and security.' }
    ],
    takeaways: [
      'Use state transition testing when the result depends on what happened before.',
      'Model states, events, transitions, guards and actions, then write them as a table.',
      '0-switch coverage = every valid transition at least once; one sequence can cover several.',
      'Invalid cells are test cases: the event must be refused with no state or data change.',
      'The correct password must still fail while an account is locked.'
    ],
    links: { labs: ['login', 'checkout'], challenges: ['peopleops-login'], interview: ['m1'] }
  },
  {
    id: 'mt-exploratory',
    n: 8,
    level: 'intermediate',
    title: 'Exploratory testing, charters and error guessing',
    summary: 'Plan, run and report time-boxed exploratory sessions using charters, heuristics and error guessing — and know when scripted tests fit better.',
    minutes: 18,
    objectives: [
      'Explain exploratory testing and how it differs from ad hoc testing',
      'Write a focused charter and run a time-boxed session with useful notes',
      'Use heuristics, tours and error guessing to generate test ideas quickly',
      'Decide when to use scripted tests, exploratory sessions or a blend'
    ],
    body: [
      { t: 'p', html: 'Scripted test cases check the things you already knew to ask about. Many bugs that reach production are the ones nobody thought to write down. <b>Exploratory testing</b> is <b>simultaneous learning, test design and test execution</b>: you use the product, notice something, form a new idea and try it straight away. Each result shapes the next test. Done well, it is one of the fastest ways to find important bugs in a new or thinly specified feature.' },
      { t: 'compare', a: { title: 'Scripted testing', items: ['Tests designed in advance, then executed step by step', 'Repeatable and easy to audit or automate', 'Strong when requirements are clear and stable', 'Finds what the designer anticipated'] }, b: { title: 'Exploratory testing', items: ['Design and execution happen together, guided by a charter', 'Adapts instantly to what the tester discovers', 'Strong when specs are thin, time is short or risk is unknown', 'Finds surprises that nobody wrote down'] } },
      { t: 'callout', tone: 'key', title: 'Exploratory is not ad hoc', html: 'Ad hoc testing is unplanned and leaves no record. Exploratory testing has a <b>mission (charter)</b>, a <b>time box</b>, <b>notes</b> and a <b>debrief</b>. Those four things make it accountable: a lead can see what was covered, what was found and what is still unknown.' },
      { t: 'h', text: 'Session-based test management' },
      { t: 'flow', caption: 'One exploratory session, from mission to follow-up', steps: ['Write a charter', 'Run a 60–120 min session', 'Take notes, log bugs', 'Debrief with the lead', 'Plan next charters'] },
      { t: 'p', html: '<b>Session-based test management (SBTM)</b> organises exploratory work into uninterrupted sessions, typically 60–120 minutes, each with one charter. Afterwards the tester and lead hold a short <b>debrief</b>. A popular checklist is <b>PROOF</b>: <b>P</b>ast (what happened), <b>R</b>esults (what was found), <b>O</b>bstacles (what got in the way), <b>O</b>utlook (what still needs testing) and <b>F</b>eelings (how confident the tester is). Many teams also record a rough time split — setup, testing and bug investigation — to spot sessions lost to broken environments.' },
      { t: 'h', text: 'Writing a useful charter' },
      { t: 'table', caption: 'Template: Explore [target] with [resources] to discover [information]', head: ['Explore…', 'With…', 'To discover…'], rows: [
        ['the ShopFlow coupon field', 'expired, lowercase and stacked codes', 'discount calculation errors'],
        ['PeopleOps leave approval', 'one manager and two employee accounts', 'permission and double-approval problems'],
        ['MediBook booking on mobile', 'slow-3G throttling and app backgrounding', 'lost or duplicated appointments']
      ] },
      { t: 'p', html: 'A charter should be narrow enough to finish in one session and broad enough to leave room for discovery. “Test checkout” is too vague; “Click Pay with the Visa card ending 4242” is a script step, not a mission. If a session uncovers a big new area, write a new charter for it rather than drifting away from the current one.' },
      { t: 'h', text: 'Heuristics and tours that spark ideas' },
      { t: 'cards', items: [
        { title: 'CRUD', html: 'Create, read, update and delete every kind of data. Edit something, then view it elsewhere; delete it and check nothing still points to it.' },
        { title: 'Goldilocks', html: 'Too small, too big, just right: empty input, one character, 10,000 characters, huge files, zero and negative amounts.' },
        { title: 'Interruptions', html: 'Press <kbd>Back</kbd>, refresh mid-submit, drop the network, background the app, let the session time out, open two tabs.' },
        { title: 'Follow the data', html: 'Enter a value once and trace it through screens, emails, exports, reports and API responses.' },
        { title: 'Error guessing', html: 'Use experience to target likely mistakes: double-clicks, leading spaces, special characters, leap days, time zones.' },
        { title: 'Money tour', html: 'Exercise first the features customers pay for and the ones the sales demo promises.' }
      ] },
      { t: 'p', html: '<b>Error guessing</b> grows stronger when it is written down as a <b>checklist</b> built from past defects, production incidents and common developer mistakes. A checklist keeps experience from leaving with the people who move teams, and it gives new testers a running start. Review it after each release and add every type of bug that escaped.' },
      { t: 'callout', tone: 'tip', title: 'Notes that make debriefs easy', html: 'Timestamp your notes and keep four headings: <b>tested</b> (what you did), <b>bugs</b>, <b>issues/questions</b> (things that block you or need a decision) and <b>ideas</b> (future charters). Capture screenshots, console errors and request IDs as you go — evidence is hard to rebuild later.' },
      { t: 'p', html: '<b>Which approach when?</b> Use scripted tests for regulated or contractual checks, regression suites and anything you plan to automate. Use exploratory sessions for new features, vague requirements, late changes and areas where bugs keep escaping. Most teams blend both: scripts protect what is known, while exploration hunts for what is not.' }
    ],
    example: {
      title: 'Worked example: a 60-minute session on MediBook rescheduling',
      blocks: [
        { t: 'p', html: '<b>Charter:</b> Explore appointment rescheduling with two patient accounts and slow-3G throttling to discover double-booking and notification problems. Tester: Ayesha. Time box: 60 minutes. Her session sheet:' },
        { t: 'code', lang: 'text', title: 'Session sheet (abridged)', code: 'CHARTER  Explore rescheduling with two patient accounts and\n         slow-3G throttling to discover double-booking and\n         notification problems\nTIME     60 min · setup 10% · testing 65% · bug investigation 25%\n\n10:02  Moved Dr. Khan 10:00 -> 11:00 as patient A. OK, SMS received.\n10:09  Goldilocks: chose a slot 90 days ahead. Allowed.\n       QUESTION: story says bookings open 60 days ahead?\n10:17  Interruption: tapped Confirm, airplane mode on, then off.\n       App retried twice.  BUG-1: two appointments created.\n10:31  Two phones, patients A and B, same 11:30 slot, confirmed\n       within a second. Both succeeded.  BUG-2: double booking.\n10:44  Rescheduled, then cancelled. Both slots freed. OK.\n10:52  Phone set to UTC+4: times shown in device time, no label.\n       ISSUE: confusing for travelling patients.\nIDEAS  Reschedule while the doctor edits availability.\n       Notification text in the Urdu locale.' },
        { t: 'p', html: '<b>Debrief (PROOF):</b> the session covered rescheduling and cancellation on mobile. It found two bugs — both high severity, because patients could lose or share a slot — one question for the product owner and one usability issue. The obstacle was a slow test SMS gateway. Outlook: two new charters from the ideas list. Ayesha rates her confidence in rescheduling as low until BUG-2 is fixed — a sentence that often helps a release decision more than a pass count.' }
      ]
    },
    explain: {
      'ur': 'Exploratory testing کا مطلب ہے کہ ہم ساتھ ساتھ سیکھتے، ٹیسٹ سوچتے اور چلاتے ہیں۔ یہ بے ترتیب clicking نہیں ہے۔ ہر session کا ایک charter ہوتا ہے، مثلاً: "ShopFlow کے coupon field کو expired اور lowercase codes کے ساتھ explore کرو تاکہ discount کی غلطیاں ملیں۔" پھر 60 سے 90 منٹ کا time box رکھیں، notes لیں، bugs اور سوالات لکھیں، اور آخر میں lead کے ساتھ debrief کریں۔ نئے ideas کے لیے heuristics استعمال کریں: Goldilocks (بہت چھوٹا، بہت بڑا، بالکل ٹھیک)، interruptions (Back بٹن، network بند ہونا) اور error guessing، یعنی تجربے کی بنیاد پر اندازہ کہ غلطی کہاں ہو سکتی ہے، جیسے Pay بٹن پر double-click۔ نئی یا غیر واضح feature کے لیے exploratory بہترین ہے، جبکہ regression اور automation کے لیے scripted tests بہتر ہیں۔',
      'ur-Latn': 'Exploratory testing ka matlab hai ke hum saath saath seekhte, test sochte aur chalate hain. Yeh random clicking nahi hai. Har session ka ek charter hota hai, maslan: "ShopFlow ke coupon field ko expired aur lowercase codes ke saath explore karo taake discount ki ghaltiyan milein." Phir 60 se 90 minute ka time box rakhein, notes lein, bugs aur sawalat likhein, aur aakhir mein lead ke saath debrief karein. Naye ideas ke liye heuristics use karein: Goldilocks (bohat chhota, bohat bara, bilkul theek), interruptions (Back button, network band hona) aur error guessing — yani tajurbe se andaza ke ghalti kahan ho sakti hai, jaise Pay button par double-click. Nayi ya ghair-wazeh feature ke liye exploratory behtareen hai, jab ke regression aur automation ke liye scripted tests behtar hain.',
      'hi': 'Exploratory testing का मतलब है कि हम साथ-साथ सीखते, test सोचते और चलाते हैं। यह बेतरतीब clicking नहीं है। हर session का एक charter होता है, जैसे: "ShopFlow के coupon field को expired और lowercase codes के साथ explore करो ताकि discount की गलतियाँ मिलें।" फिर 60 से 90 मिनट का time box रखें, notes लें, bugs और सवाल लिखें, और आख़िर में lead के साथ debrief करें। नए ideas के लिए heuristics इस्तेमाल करें: Goldilocks (बहुत छोटा, बहुत बड़ा, बिल्कुल ठीक), interruptions (Back बटन, network बंद होना) और error guessing — यानी अनुभव से अंदाज़ा कि गलती कहाँ हो सकती है, जैसे Pay बटन पर double-click। नए या अस्पष्ट feature के लिए exploratory सबसे अच्छा है, जबकि regression और automation के लिए scripted tests बेहतर हैं।',
      'ar': 'الاختبار الاستكشافي (Exploratory testing) يعني أن نتعلّم ونصمّم الاختبارات وننفّذها في الوقت نفسه، وهو ليس نقرًا عشوائيًا. لكل جلسة ميثاق (charter) واضح، مثل: «استكشف حقل القسائم في ShopFlow باستخدام رموز منتهية الصلاحية ومكتوبة بأحرف صغيرة لاكتشاف أخطاء حساب الخصم». نحدّد مدة الجلسة بين 60 و90 دقيقة، ونسجّل الملاحظات والأخطاء والأسئلة، ثم نراجع النتائج مع قائد الفريق في جلسة debrief. ولتوليد الأفكار نستخدم قواعد إرشادية (heuristics) مثل Goldilocks (صغير جدًا، كبير جدًا، مناسب تمامًا)، والمقاطعات (زر الرجوع، انقطاع الشبكة)، وتخمين الأخطاء (error guessing) اعتمادًا على الخبرة، مثل النقر المزدوج على زر الدفع. الاستكشاف مثالي للميزات الجديدة أو الغامضة، أما الحالات المكتوبة مسبقًا فهي أفضل لاختبار الانحدار (regression) والأتمتة.',
      'es': 'Las pruebas exploratorias (exploratory testing) consisten en aprender, diseñar pruebas y ejecutarlas al mismo tiempo. No son clics al azar: cada sesión tiene un charter, por ejemplo: «Explorar el campo de cupones de ShopFlow con códigos caducados y en minúsculas para descubrir errores en el cálculo del descuento». Se fija un tiempo de 60 a 90 minutos, se toman notas de lo probado, los bugs y las dudas, y al final se hace un debrief con el líder. Para generar ideas se usan heurísticas como Goldilocks (demasiado pequeño, demasiado grande, justo), interrupciones (botón Atrás, pérdida de red) y error guessing, es decir, anticipar errores por experiencia, como hacer doble clic en Pagar. Lo exploratorio es ideal para funciones nuevas o poco claras; los casos guionizados funcionan mejor para regresión y automatización.'
    },
    keyTerms: [
      { term: 'Exploratory testing', def: 'Simultaneous learning, test design and test execution, guided by a goal and adapted to what the tester discovers.' },
      { term: 'Charter', def: 'A short mission for one session: Explore [target] with [resources] to discover [information].' },
      { term: 'Session-based test management', def: 'Organising exploratory testing into time-boxed sessions, each with a charter, notes and a debrief.' },
      { term: 'Heuristic', def: 'A rule of thumb that suggests test ideas quickly, such as CRUD or Goldilocks. Useful, but not guaranteed to find everything.' },
      { term: 'Error guessing', def: 'Designing tests from experience of likely mistakes, often captured as a checklist of past defects.' },
      { term: 'Debrief', def: 'A short review after a session: what was tested, what was found, what blocked the tester and what still needs work.' }
    ],
    practice: [
      { q: 'Write a charter for the new <b>PeopleOps</b> “carry forward unused leave” feature using the template <i>Explore &lt;target&gt; with &lt;resources&gt; to discover &lt;information&gt;</i>.', hint: 'Name a specific area, the data or accounts you will use, and the kind of problem you are hunting.', answer: 'Example: <i>Explore year-end leave carry-forward with employees who have 0, 4.5 and 30 unused days and a mid-year joiner to discover wrong balances and rounding errors.</i> It is narrow enough for one session, names concrete data (including boundaries and an unusual case) and states the information wanted.' },
      { q: 'Apply the <b>CRUD</b> heuristic to “saved addresses” in ShopFlow. List at least five test ideas.', answer: '<b>Create:</b> an address with maximum-length fields and Urdu characters; a duplicate of an existing address. <b>Read:</b> check it appears correctly in checkout, the account page and the order confirmation. <b>Update:</b> edit the default address while an order is in progress — which address does that order use? <b>Delete:</b> remove an address used by a past order (the old order must keep its original address), and delete the only address to see what checkout does.' },
      { q: 'Build an <b>error-guessing checklist</b> for a phone-number field (at least six items).', answer: 'Empty value; leading or trailing spaces; different country-code formats (+92, 0092, 0); spaces, dashes and brackets inside the number; letters and emoji; numbers that are too short or too long; pasted text with an invisible character; a number already used by another account; Urdu/Arabic-Indic digits such as ۰۳۰۰ instead of 0300.' },
      { q: 'Your manager asks: “How do I know exploratory testing actually happened and what it covered?” What do you show?', answer: 'The charters and session sheets (time box, time split, timestamped notes), the bugs and questions logged with evidence, the debrief summaries, and a simple list of charters done versus planned. I also state what was <b>not</b> explored and my confidence in each area — more honest and more useful than a pass count.' }
    ],
    quiz: [
      { q: 'Which statement best describes exploratory testing?', options: ['Random clicking around the app without a plan, notes or goal', 'Simultaneous learning, test design and execution guided by a goal', 'Running the scripted test cases in a different order each time', 'User acceptance testing performed only by end users before release'], correct: 1,
        why: ['That is ad hoc testing. Exploratory testing has a charter, a time box and notes.', 'Correct — each result informs the next test, within a clear mission.', 'Shuffling a script is still scripted testing; no design happens during execution.', 'User acceptance testing is a different activity; testers explore throughout development.'] },
      { q: 'Which is the most useful exploratory charter?', options: ['Test the checkout page and report every bug you can find', 'Check all fields of checkout with every possible input value', 'Run test cases TC-101 to TC-140 on the checkout page today', 'Explore coupon codes with expired and stacked codes to find discount errors'], correct: 3,
        why: ['Too vague — no focus, resources or information goal, so coverage is impossible to judge.', 'Impossible to finish and not a mission; exhaustive input testing cannot be done.', 'That is a scripted run, not an exploratory mission.', 'Correct — a clear target, resources and the information wanted, sized for one session.'] },
      { q: 'A new feature arrives with a two-line user story. Release is tomorrow and you have two hours. What is the best approach?', options: ['Time-boxed exploratory sessions with charters aimed at the riskiest areas', 'Write detailed step-by-step cases for every field before testing anything', 'Refuse to test until a complete specification is provided', 'Automate the end-to-end flow first, then explore if time is left'], correct: 0,
        why: ['Correct — exploration learns the feature and finds high-impact bugs fast, and the notes show what was covered.', 'Writing full scripts would use up the time before any testing happens.', 'Raising the spec gap is right, but refusing to test leaves the release with no information at all.', 'Automating an unknown, changing feature in two hours is slow and likely to be thrown away.'] },
      { q: 'What does the Goldilocks heuristic suggest?', options: ['Repeat the same action three times to check consistency', 'Test only the values a typical user would enter', 'Try inputs that are too small, too big and just right', 'Interrupt a workflow at its start, middle and end'], correct: 2,
        why: ['Repeating actions can find bugs, but it is not Goldilocks.', 'Typical values are only the “just right” part; Goldilocks pushes to the extremes too.', 'Correct — empty, tiny, huge and normal inputs, e.g. 0, 1 and 10,000 characters.', 'That is the interruptions heuristic.'] },
      { q: 'On a slow network, the PayLite “Pay now” button takes three seconds to respond. Which test idea comes from error guessing?', options: ['Double-click Pay now while throttled and check for a double charge', 'Compare the button colour and font against the design system', 'Pay with a valid card and confirm the success page appears', 'Re-read the user story to confirm the exact text of the button label'], correct: 0,
        why: ['Correct — experience says slow buttons invite repeat clicks, and duplicate payments are a classic defect.', 'A valid UI check, but it comes from the design spec, not from guessing likely errors.', 'This is the happy path — needed, but not error guessing.', 'Reviewing requirements is useful static testing, not error guessing.'] }
    ],
    interview: [
      { q: 'What is exploratory testing, and how do you make it accountable?', a: 'Exploratory testing is simultaneous learning, test design and execution: I use what each test teaches me to choose the next one. To keep it accountable I work in time-boxed sessions with a charter, such as “Explore coupon codes with expired and stacked codes to discover discount errors”. I keep timestamped notes of what I tested, bugs, questions and new ideas, capture evidence, and debrief with the lead afterwards. The result is a list of charters covered, bugs found and areas still at risk — so the team knows exactly what exploration did and did not cover.' },
      { q: 'Is exploratory testing the same as ad hoc testing?', a: 'No. Ad hoc testing is informal and usually undocumented. Exploratory testing is <b>structured</b>: it has a mission, a time box, notes and a debrief, and it uses heuristics and error guessing deliberately. Both are unscripted, but exploratory testing produces evidence of coverage and findings that the team can review and build on.' }
    ],
    takeaways: [
      'Exploratory testing = learning, test design and execution at the same time.',
      'Charters, time boxes, notes and debriefs make exploration accountable.',
      'Heuristics such as CRUD, Goldilocks and interruptions generate ideas fast.',
      'Turn error guessing into a living checklist built from real defects.',
      'Blend approaches: scripts protect the known, exploration finds the unknown.'
    ],
    links: { labs: ['bughunt', 'ui'], challenges: ['bug-report'], interview: ['m4'] }
  },
  {
    id: 'mt-regression',
    n: 9,
    level: 'intermediate',
    title: 'Smoke, sanity, retest and regression testing',
    summary: 'Tell smoke, sanity, retest and regression testing apart, pick a regression set by risk and change impact, and sequence them for a release.',
    minutes: 18,
    objectives: [
      'Define smoke, sanity, retest and regression testing precisely',
      'Explain why a fix that passes its retest still needs regression testing',
      'Select a regression set using change impact, risk and defect history',
      'Choose sensible automation candidates and order the work for a release'
    ],
    body: [
      { t: 'p', html: 'A new build lands on the test environment. Before anyone says “QA passed”, four different questions need answers: <i>Is this build testable at all? Does the changed area behave sensibly? Is the reported bug really fixed? Did the change break anything that used to work?</i> Those questions map to <b>smoke</b>, <b>sanity</b>, <b>retest</b> and <b>regression</b> testing. Interviewers ask about these terms constantly, because teams mix them up — and mixing them up leads to the wrong tests at the wrong time.' },
      { t: 'cards', items: [
        { title: 'Smoke', html: '<b>Broad and shallow.</b> “Is this build stable enough to test?” Login works, main pages and key flows load. If it fails, the build is rejected.' },
        { title: 'Sanity', html: '<b>Narrow and focused.</b> A quick check that a specific fix or changed area behaves sensibly before deeper testing.' },
        { title: 'Retest', html: 'Also called <b>confirmation testing</b>. Re-run the test that failed, after the fix, to confirm the defect is gone.' },
        { title: 'Regression', html: 'Re-run tests of things that <b>previously worked</b> to check that the change did not break them.' }
      ] },
      { t: 'h', text: 'Smoke vs sanity' },
      { t: 'table', head: ['Aspect', 'Smoke testing', 'Sanity testing'], rows: [
        ['Question', 'Is the build testable at all?', 'Does this specific fix or area behave sensibly?'],
        ['Scope', 'Broad and shallow — main features end to end', 'Narrow and focused — one feature or fix'],
        ['When', 'Every new build, before other testing', 'After a small change or fix, before deeper testing'],
        ['Form', 'Usually scripted, often automated in the pipeline', 'Often a quick, unscripted check by a tester'],
        ['If it fails', 'Reject the build; testing stops', 'Send the fix back; skip deeper testing of that area'],
        ['ShopFlow example', 'Home, search, cart and checkout load; login works', 'The coupon fix: SAVE10 now gives exactly 10%, once']
      ] },
      { t: 'callout', tone: 'info', title: 'The words vary between teams', html: 'Some companies — and some testing glossaries — use “smoke” and “sanity” as synonyms. In interviews, give the common distinction — a broad build check versus a narrow, focused check — and add that you would follow the team’s own definitions.' },
      { t: 'h', text: 'Retest vs regression' },
      { t: 'compare', a: { title: 'Retest (confirmation testing)', items: ['Re-runs the <b>failed</b> test case after the fix', 'Same steps, data and environment as the bug report', 'Goal: prove <b>this defect</b> is fixed', 'Scope is known exactly: the failed case(s)', 'Usually manual, and done first'] }, b: { title: 'Regression testing', items: ['Re-runs tests that <b>previously passed</b>', 'Covers areas affected by, or near, the change', 'Goal: show <b>nothing else broke</b>', 'Scope is a judgement based on risk and impact', 'A strong candidate for automation'] } },
      { t: 'p', html: 'Order matters: <b>retest first</b>, then regression — if the fix does not work, regression on that build is wasted effort. But a passed retest is not the end. A developer who fixes rounding in the tax function may have changed code that invoices, refunds and reports also call. Those features worked before; only regression testing shows whether they still do. Regression is needed even when no product code changed: a library upgrade, a new server configuration or a database migration can all break working features.' },
      { t: 'h', text: 'Choosing what goes into a regression run' },
      { t: 'list', items: [
        '<b>Change impact:</b> what code, data, API or configuration changed, and what else uses it? Ask the developer, read the change description, look for shared components.',
        '<b>Areas near the change:</b> the same screen, the same workflow, and the steps just before and after it.',
        '<b>Risk:</b> business-critical, high-traffic and money-moving flows — login, checkout, payments, payroll.',
        '<b>Defect history:</b> modules that broke before tend to break again.',
        '<b>Core journeys:</b> a short set of end-to-end paths that must always work, whatever changed.'
      ] },
      { t: 'p', html: 'Running everything (“retest all”) is the safest option but often too slow. Most teams keep <b>tiers</b>: a smoke suite that runs in minutes on every build, a core regression suite for each merge or daily build, and a full regression run before major releases. Within the time available, run the highest-risk tests first so the most important information arrives early — and say clearly what was not run.' },
      { t: 'callout', tone: 'tip', title: 'Good regression automation candidates', html: 'Automate tests that are <b>repetitive, stable, deterministic and valuable</b>: login, search, checkout, pricing rules, API contracts and data-driven calculations. Keep manual: one-off checks, screens redesigned every sprint, and judgements about look, feel and usability. Add a regression test for every defect that escaped to production.' }
    ],
    example: {
      title: 'Worked example: a Friday hotfix for ShopFlow coupons',
      blocks: [
        { t: 'p', html: '<b>Situation:</b> production bug SF-412 — the coupon <code>SAVE10</code> is applied twice when a customer refreshes the payment page, giving 20% off. A one-line fix to the discount service arrives as build 5.8.1 on Friday afternoon. The release window closes at 6 pm.' },
        { t: 'flow', caption: 'Order of work for the hotfix', steps: ['Smoke build 5.8.1', 'Retest SF-412', 'Sanity on coupons', 'Targeted regression', 'Report and sign-off'] },
        { t: 'table', head: ['Regression area', 'Why it was selected'], rows: [
          ['Other coupon types (fixed amount, free shipping)', 'Same discount service changed — direct impact'],
          ['Cart totals, tax and rounding', 'Downstream: they consume the discount value'],
          ['Refunds of discounted orders', 'Money-moving; refunds recalculate discounts'],
          ['Checkout with no coupon', 'Core journey that must work whatever changed'],
          ['Automated smoke and API suites', 'Cheap to run; catch unexpected breakage elsewhere']
        ] },
        { t: 'p', html: 'Smoke passed in 10 minutes. The retest of SF-412 passed: refreshing no longer re-applies the coupon. The sanity check confirmed SAVE10 gives exactly 10%, once. Regression then found that combining a <b>free-shipping coupon with SAVE10</b> was now rejected — a regression introduced by the fix. The tester reported it with evidence and a clear choice for the product owner: ship the fix and accept that combined coupons fail until Monday, or delay. Either way, the decision was made on facts.' }
      ]
    },
    explain: {
      'ur': 'جب نیا build آتا ہے تو چار مختلف سوال ہوتے ہیں۔ Smoke testing: کیا build اتنا stable ہے کہ ٹیسٹ کیا جا سکے؟ یہ وسیع مگر سطحی چیک ہے، جیسے login، search اور checkout کا کھلنا۔ Sanity testing: کسی خاص fix یا حصے کا محدود اور مرکوز چیک۔ Retest (confirmation testing): جو test fail ہوا تھا، fix کے بعد وہی دوبارہ چلانا تاکہ پتا چلے کہ bug ٹھیک ہو گیا۔ Regression testing: یہ دیکھنا کہ اس تبدیلی نے پہلے سے ٹھیک چلنے والی چیزیں تو نہیں توڑ دیں۔ مثال: coupon کا bug ٹھیک ہوا اور retest pass ہو گیا، لیکن regression میں پتا چلا کہ دو coupons اکٹھے اب کام نہیں کرتے۔ اسی لیے پہلے retest کریں، پھر risk اور change impact کی بنیاد پر regression۔',
      'ur-Latn': 'Jab naya build aata hai to chaar alag sawal hote hain. Smoke testing: kya build itna stable hai ke test kiya ja sake? Yeh broad magar shallow check hai, jaise login, search aur checkout ka khulna. Sanity testing: kisi khaas fix ya hissay ka narrow aur focused check. Retest (confirmation testing): jo test fail hua tha, fix ke baad wahi dobara chalana taake pata chale ke bug theek ho gaya. Regression testing: yeh dekhna ke is change ne pehle se theek chalne wali cheezein to nahi tod deen. Misaal: coupon ka bug theek hua aur retest pass ho gaya, lekin regression mein pata chala ke do coupons ikatthe ab kaam nahi karte. Isi liye pehle retest karein, phir risk aur change impact ki bunyaad par regression.',
      'hi': 'जब नया build आता है तो चार अलग सवाल होते हैं। Smoke testing: क्या build इतना stable है कि test किया जा सके? यह व्यापक लेकिन सतही check है, जैसे login, search और checkout का खुलना। Sanity testing: किसी ख़ास fix या हिस्से का सीमित और केंद्रित check। Retest (confirmation testing): जो test fail हुआ था, fix के बाद वही दोबारा चलाना ताकि पता चले कि bug ठीक हो गया। Regression testing: यह देखना कि इस बदलाव ने पहले से ठीक चल रही चीज़ों को तो नहीं तोड़ा। उदाहरण: coupon का bug ठीक हुआ और retest pass हो गया, लेकिन regression में पता चला कि दो coupons एक साथ अब काम नहीं करते। इसीलिए पहले retest करें, फिर risk और change impact के आधार पर regression।',
      'ar': 'عندما يصل build جديد توجد أربعة أسئلة مختلفة. اختبار الدخان (Smoke testing): هل الإصدار مستقر بما يكفي لبدء الاختبار؟ وهو فحص واسع وسطحي، مثل التأكد من أن تسجيل الدخول والبحث والدفع تعمل. اختبار السلامة (Sanity testing): فحص ضيّق ومركّز لإصلاح أو جزء محدّد. إعادة الاختبار (Retest أو confirmation testing): تشغيل الحالة التي فشلت نفسها بعد الإصلاح للتأكد من زوال الخلل. اختبار الانحدار (Regression testing): التحقق من أن التغيير لم يُفسد ما كان يعمل سابقًا. مثال: أُصلح خلل في القسيمة ونجحت إعادة الاختبار، لكن اختبار الانحدار كشف أن استخدام قسيمتين معًا لم يعد يعمل. لذلك نبدأ بإعادة الاختبار، ثم نختار اختبارات الانحدار حسب المخاطر وأثر التغيير.',
      'es': 'Cuando llega un build nuevo hay cuatro preguntas distintas. Smoke testing: ¿el build es lo bastante estable para probarlo? Es una revisión amplia y superficial: el login, la búsqueda y el checkout funcionan. Sanity testing: una comprobación estrecha y enfocada de una corrección o zona concreta. Retest (confirmation testing): volver a ejecutar el caso que falló, después de la corrección, para confirmar que el defecto desapareció. Regression testing: comprobar que el cambio no rompió lo que antes funcionaba. Ejemplo: se corrige un bug del cupón y el retest pasa, pero la regresión descubre que ya no se pueden combinar dos cupones. Por eso primero se hace el retest y luego la regresión, elegida según el riesgo y el impacto del cambio.'
    },
    keyTerms: [
      { term: 'Smoke testing', def: 'A broad, shallow check of the main functions to decide whether a build is stable enough for further testing.' },
      { term: 'Sanity testing', def: 'A narrow, focused check that a specific fix or changed area behaves sensibly before deeper testing.' },
      { term: 'Retesting (confirmation testing)', def: 'Re-running the test that failed, after a fix, to confirm the defect is gone.' },
      { term: 'Regression testing', def: 'Re-running tests of previously working features to check that a change did not break them.' },
      { term: 'Change impact analysis', def: 'Working out which code, data and features a change can affect, to decide what to regression-test.' }
    ],
    practice: [
      { q: 'Label each activity as smoke, sanity, retest or regression: <b>(a)</b> re-running BUG-77’s steps on the fixed build; <b>(b)</b> checking that login, search, cart and checkout load on build 3.2; <b>(c)</b> re-running the payments suite after a currency-library upgrade; <b>(d)</b> quickly checking the corrected VAT label on the invoice screen.', answer: '(a) <b>Retest</b> — the exact failed case after a fix. (b) <b>Smoke</b> — a broad, shallow check that the build is testable. (c) <b>Regression</b> — previously working features after a change, even a library change. (d) <b>Sanity</b> — a narrow, focused check of a specific fix.' },
      { q: 'PeopleOps switches its password-hashing library. Which areas would you include in regression, and why?', hint: 'Think about everything that creates, checks or changes a password.', answer: 'Login with <b>existing</b> passwords (old hashes must still verify, or be migrated on login); new sign-up; password change and reset; lockout counting; any API or SSO login that uses the same service; login speed under load (new hashing can be slower). Also confirm the database stores the new hash format and that no plain-text password appears in logs.' },
      { q: 'Your full regression suite takes 6 hours and the team deploys daily. Propose a better structure.', answer: 'Tier it: a <b>smoke</b> suite (10–15 minutes) on every build; a <b>core regression</b> suite (around an hour) per merge or daily, covering critical journeys and recently changed areas; the <b>full</b> suite nightly or before major releases. Order tests by risk, run them in parallel where possible, and regularly remove obsolete or duplicate tests.' },
      { q: 'A developer says: “It’s just a CSS change — no regression needed.” How do you respond?', answer: 'Ask, politely, what the change touches. A shared stylesheet can hide a button, overlap a field on mobile or break a print layout. Run a quick visual and functional check of the pages that use the changed styles — key flows on the main browsers and a mobile width — scaled to the risk, rather than skipping regression entirely.' }
    ],
    quiz: [
      { q: 'A developer fixes BUG-88 in the cart and deploys a new build. Which activities should follow, in order?', options: ['Regression of the whole app, then retest BUG-88 if time allows', 'Smoke test only, since the developer has already tested the fix', 'A sanity check of the login page, then close BUG-88', 'Retest BUG-88, then regression of the cart and related areas'], correct: 3,
        why: ['Backwards: if the fix does not work, the regression run is wasted — and the retest is not optional.', 'Developer testing does not replace independent confirmation and regression.', 'Login is unrelated to the change, and closing a bug needs a passed retest.', 'Correct — confirm the fix first (retest), then check that nothing around it broke (regression).'] },
      { q: 'What is the main purpose of smoke testing?', options: ['To explore every edge case of a newly added feature', 'To decide whether a new build is stable enough to test', 'To confirm that one specific bug fix works', 'To measure page response times while under heavy user load'], correct: 1,
        why: ['Edge cases belong to deeper functional testing, after the build is accepted.', 'Correct — a broad, shallow check that decides whether testing can start.', 'That is retesting (or a sanity check of the fixed area).', 'That is performance (load) testing.'] },
      { q: 'A rounding bug in the shared tax function was fixed and its retest passed. Which regression set is most appropriate?', options: ['Only the original failing test, run once more on the build', 'Every test in the repository, run manually in full before release', 'Totals, invoices, refunds and reports that use the tax function', 'Login and profile pages only, because they get the most traffic'], correct: 2,
        why: ['That is the retest again; it says nothing about other features.', 'Usually far too slow, and it spreads effort evenly instead of by risk.', 'Correct — change impact analysis: everything that calls the changed function is at risk.', 'Popular pages matter in smoke tests, but they do not use the changed code.'] },
      { q: 'A checkout fix passed its retest, but order confirmation emails have stopped on the same build. What does this most likely show?', options: ['A regression: the change broke something that worked before', 'The retest was done wrongly and must be repeated', 'A smoke failure, so the fix itself was never deployed', 'An environment issue, since emails are unrelated to checkout'], correct: 0,
        why: ['Correct — a previously working feature failed after the change. Investigate (including the environment) and report it as a likely regression with evidence.', 'The retest shows the original bug is fixed; the email failure is a separate problem.', 'If the fix were missing, the retest would have failed too.', 'Worth checking — but checkout triggers the emails, and blaming the environment without evidence is risky.'] },
      { q: 'Which is the best candidate for regression automation?', options: ['A one-time check of a data migration script', 'Judging whether a new illustration feels friendly', 'A screen whose layout is redesigned every sprint', 'Login, search and checkout paths run on every build'], correct: 3,
        why: ['A test you run once rarely repays the cost of automating it.', 'A human judgement about look and feel — keep it manual.', 'Constant UI change means constant script maintenance.', 'Correct — stable, repetitive, high-value paths are ideal for automated regression.'] }
    ],
    interview: [
      { q: 'What is the difference between retesting and regression testing?', a: '<b>Retesting</b>, or confirmation testing, re-runs the test that failed, after the fix, to confirm that specific defect is gone — same steps, data and environment. <b>Regression testing</b> re-runs tests of features that previously worked, to check the change did not break them. I retest first, because regression on a build where the fix failed is wasted. Then I choose regression by change impact and risk: for a tax rounding fix, that means totals, invoices, refunds and reports that share the function, plus core journeys and the automated suite.' },
      { q: 'Smoke vs sanity testing — how do you explain the difference?', a: '<b>Smoke testing</b> is broad and shallow: on every new build I check that the main features work — login, key pages, the core purchase flow — to decide whether the build is testable. <b>Sanity testing</b> is narrow and focused: after a small fix I check that the specific area behaves sensibly before deeper testing. Some teams and glossaries use the terms interchangeably, so I align with the team’s own definitions.' },
      { q: 'You have two hours before a release and a regression suite that takes eight. What do you do?', a: 'I select by <b>risk and change impact</b>: tests around the changed code and its consumers, money-moving and high-traffic journeys, and modules with a history of defects. I run the automated smoke and API suites in parallel because they are cheap. I run the highest-risk tests first, record what I could not cover, and report clearly: what passed, what failed, what was not run and the remaining risk — so the product owner makes the release decision with full information.' }
    ],
    takeaways: [
      'Smoke = broad, shallow “is the build testable?”; sanity = narrow, focused check of a fix or area.',
      'Retest = re-run the failed case after the fix; regression = check nothing that worked is now broken.',
      'Retest first, then regression — a passed retest is not the end.',
      'Choose regression by change impact, risk, defect history and core journeys.',
      'Automate stable, repetitive, high-value checks and add a test for every escaped bug.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'], interview: ['m3', 'm6'] }
  },
  {
    id: 'mt-pairwise',
    n: 10,
    level: 'advanced',
    title: 'Use cases, pairwise and combinatorial testing',
    summary: 'Derive tests from use-case flows, tame combinatorial explosion with pairwise testing, and recognise when two-way coverage is not enough.',
    minutes: 22,
    objectives: [
      'Derive test cases from a use case’s main, alternate and exception flows',
      'Explain combinatorial explosion and why exhaustive combinations are impractical',
      'Build and check a small pairwise (all-pairs) test set',
      'Recognise when pairwise is not enough and add targeted combinations'
    ],
    body: [
      { t: 'p', html: 'Two problems appear as products grow. First, features are really <b>goals users try to reach</b> through several steps, with detours and failures along the way — testing fields one at a time misses those journeys. Second, the number of <b>configurations</b> (browsers, devices, payment methods, languages, account types) multiplies faster than any team can test. Use case testing addresses the first problem; pairwise testing addresses the second.' },
      { t: 'h', text: 'Use case testing' },
      { t: 'p', html: 'A <b>use case</b> describes how an <b>actor</b> (a user or another system) achieves a <b>goal</b>. It has <b>preconditions</b>, a <b>main success scenario</b> (the normal path), <b>alternate flows</b> (different paths that still reach the goal), <b>exception flows</b> (paths where the goal cannot be reached and the system must fail safely) and <b>postconditions</b> — what must be true afterwards. Cover every flow at least once, and check the postconditions, not just the final screen: was the slot reserved, the email sent, the stock reduced?' },
      { t: 'flow', caption: 'Parts of a use case — every flow becomes at least one test', steps: ['Actor and goal', 'Preconditions', 'Main success scenario', 'Alternate flows', 'Exception flows', 'Postconditions'] },
      { t: 'h', text: 'Combinatorial explosion' },
      { t: 'p', html: 'ShopFlow supports 3 browsers, 2 desktop operating systems, 3 payment methods and 2 account types (guest or registered). Testing every combination means 3 × 2 × 3 × 2 = <b>36</b> checkout runs. Add 4 languages and 3 currencies and it becomes <b>432</b>. Each new parameter <b>multiplies</b> the total, so exhaustive combination testing quickly becomes impossible — yet picking a few combinations at random leaves dangerous gaps.' },
      { t: 'h', text: 'Pairwise (all-pairs) testing' },
      { t: 'p', html: '<b>Pairwise testing</b> chooses a set of tests in which <b>every pair of values from any two parameters appears together at least once</b>. The rationale is empirical: most interaction defects are triggered by a single parameter or by two parameters interacting — “wallet payments fail on Firefox”. Far fewer need three or more specific values at the same time. Pairwise covers all two-way interactions with a fraction of the tests.' },
      { t: 'table', caption: 'Pairwise set for ShopFlow checkout: 9 tests instead of 36', head: ['Test', 'Browser', 'OS', 'Payment', 'Account'], rows: [
        ['1', 'Chrome', 'Windows', 'Card', 'Guest'],
        ['2', 'Chrome', 'macOS', 'Wallet', 'Guest'],
        ['3', 'Chrome', 'Windows', 'Cash on delivery', 'Registered'],
        ['4', 'Firefox', 'macOS', 'Card', 'Registered'],
        ['5', 'Firefox', 'Windows', 'Wallet', 'Guest'],
        ['6', 'Firefox', 'Windows', 'Cash on delivery', 'Guest'],
        ['7', 'Edge', 'Windows', 'Card', 'Guest'],
        ['8', 'Edge', 'Windows', 'Wallet', 'Registered'],
        ['9', 'Edge', 'macOS', 'Cash on delivery', 'Guest']
      ] },
      { t: 'p', html: 'Check it yourself: every browser meets every payment method exactly once (9 pairs); every browser, payment method and account type appears with both operating systems; guest and registered each appear with every browser and every payment method. The table was derived from the <b>L9 orthogonal array</b>, a balanced design. Because OS and account have only two values, some pairs appear twice, which is fine. Pairwise tools generate similar <b>covering arrays</b>, where each pair simply appears at least once.' },
      { t: 'list', ordered: true, items: [
        'List only the parameters that can really change behaviour — not every setting in the app.',
        'Choose the values for each parameter with equivalence partitioning and boundaries.',
        'Write down constraints: combinations that cannot exist, such as Safari on Windows.',
        'Generate the set with a tool or an orthogonal array, then add the must-test combinations.',
        'Write an expected result for every row and review that each row makes sense.'
      ] },
      { t: 'code', lang: 'text', title: 'The same model for a pairwise tool (PICT syntax), extended with Safari', code: '# ShopFlow checkout: PICT generates pairwise rows by default\nBrowser: Chrome, Firefox, Edge, Safari\nOS:      Windows, macOS\nPayment: Card, Wallet, COD\nAccount: Guest, Registered\n\n# Constraint: Safari is only supported on macOS\nIF [Browser] = "Safari" THEN [OS] = "macOS";\n\n# Run:  pict checkout.txt          (pairwise)\n#       pict checkout.txt /o:3     (all 3-way combinations)' },
      { t: 'callout', tone: 'warn', title: 'When pairwise is not enough', html: 'Pairwise picks <i>inputs</i>, not expected results, and treats every pair as equally important. Add explicit tests for <b>known high-risk combinations</b> (the bank and card type behind last month’s incident), raise the strength to <b>3-way</b> for payment or safety-related logic, and declare <b>constraints</b> so impossible rows are not generated. When the output depends on all conditions together — a premium calculated from age, plan and region — use a decision table instead.' },
      { t: 'p', html: 'Pairwise also does not choose the values inside each parameter. Use equivalence partitioning and boundary values first — “Card” may really mean a valid card, a declined card and an expired card — and then combine. The technique decides <b>which combinations</b> to run; your other test design skills decide <b>which values</b> and <b>what should happen</b>.' }
    ],
    example: {
      title: 'Worked example: MediBook “Book an appointment” use case',
      blocks: [
        { t: 'p', html: '<b>Use case UC-04.</b> Actor: logged-in patient. Goal: book a consultation. Precondition: the doctor has published availability. Postconditions: the appointment is saved, the slot is no longer offered to others, and an SMS confirmation is sent. Main success scenario:' },
        { t: 'list', ordered: true, items: [
          'Patient searches for a doctor by speciality.',
          'System lists doctors with free slots.',
          'Patient selects a slot; the system holds it for 5 minutes.',
          'Patient confirms the booking.',
          'System saves the appointment, sends an SMS and shows a confirmation.'
        ] },
        { t: 'table', head: ['Flow', 'Test', 'Expected result'], rows: [
          ['Main', 'Book a free slot end to end', 'Appointment saved, slot unavailable to others, SMS received'],
          ['Alternate 2a', 'Change the date filter, then book', 'Slots refresh for the new date; booking succeeds'],
          ['Alternate 5a', 'SMS gateway stubbed as down', 'Booking saved; in-app notice shown; SMS retried later'],
          ['Exception 3a', 'A second patient books the same slot first', '“Slot no longer available”; back to the list; no double booking'],
          ['Exception 4a', 'Wait past the 5-minute hold, then confirm', 'Hold released, clear message, no appointment created']
        ] },
        { t: 'p', html: 'Five tests cover every flow at least once. Notice how the exception flows connect to other techniques: the 5-minute hold is a <b>boundary</b> (test just before and just after 5 minutes), and two patients competing for one slot is a <b>state</b> and concurrency problem.' }
      ]
    },
    explain: {
      'ur': 'جب browsers، operating systems، payment methods اور account types جیسے کئی parameters ہوں تو combinations بہت تیزی سے بڑھتے ہیں۔ مثال: 3 browsers × 2 OS × 3 payment methods × 2 account types = 36 tests۔ Pairwise testing میں ہم ایسے tests چنتے ہیں کہ کسی بھی دو parameters کی ہر جوڑی (pair) کم از کم ایک بار ضرور آئے۔ اس مثال میں صرف 9 tests کافی ہیں۔ وجہ یہ ہے کہ زیادہ تر bugs ایک یا دو parameters کے ملنے سے آتے ہیں، جیسے "Firefox پر wallet payment fail"۔ لیکن pairwise ہمیشہ کافی نہیں: جو combination پہلے production میں مسئلہ بنا ہو اسے الگ test کے طور پر شامل کریں، اور payments جیسے حساس حصوں کے لیے 3-way coverage پر غور کریں۔ PICT جیسے tools یہ table بنا دیتے ہیں، مگر expected result آپ کو خود لکھنا ہوتا ہے۔',
      'ur-Latn': 'Jab browsers, operating systems, payment methods aur account types jaise kai parameters hon to combinations bohat tezi se barhte hain. Misaal: 3 browsers × 2 OS × 3 payment methods × 2 account types = 36 tests. Pairwise testing mein hum aise tests chunte hain ke kisi bhi do parameters ki har pair kam az kam ek dafa zaroor aaye. Is misaal mein sirf 9 tests kaafi hain. Wajah yeh hai ke zyada tar bugs ek ya do parameters ke milne se aate hain, jaise "Firefox par wallet payment fail". Lekin pairwise hamesha kaafi nahi: jo combination pehle production mein masla bana ho usay alag test ke taur par shamil karein, aur payments jaise sensitive hisson ke liye 3-way coverage par ghaur karein. PICT jaise tools yeh table bana dete hain, magar expected result aap ko khud likhna hota hai.',
      'hi': 'जब browsers, operating systems, payment methods और account types जैसे कई parameters हों, तो combinations बहुत तेज़ी से बढ़ते हैं। उदाहरण: 3 browsers × 2 OS × 3 payment methods × 2 account types = 36 tests। Pairwise testing में हम ऐसे tests चुनते हैं कि किन्हीं भी दो parameters की हर जोड़ी (pair) कम से कम एक बार ज़रूर आए। इस उदाहरण में सिर्फ़ 9 tests काफ़ी हैं। वजह यह है कि ज़्यादातर bugs एक या दो parameters के मेल से आते हैं, जैसे "Firefox पर wallet payment fail"। लेकिन pairwise हमेशा काफ़ी नहीं होता: जो combination पहले production में समस्या बना हो, उसे अलग test के रूप में जोड़ें, और payments जैसे संवेदनशील हिस्सों के लिए 3-way coverage पर विचार करें। PICT जैसे tools यह table बना देते हैं, लेकिन expected result आपको ख़ुद लिखना होता है।',
      'ar': 'عندما توجد معاملات (parameters) كثيرة مثل المتصفحات وأنظمة التشغيل وطرق الدفع وأنواع الحسابات، تتضاعف التركيبات بسرعة كبيرة. مثال: 3 متصفحات × 2 نظام تشغيل × 3 طرق دفع × 2 نوع حساب = 36 اختبارًا. في الاختبار الثنائي (Pairwise testing) نختار مجموعة اختبارات بحيث يظهر كل زوج من القيم لأي معاملين معًا مرة واحدة على الأقل، وفي هذا المثال تكفي 9 اختبارات فقط. السبب أن معظم الأخطاء تنتج عن معامل واحد أو عن تفاعل معاملين، مثل «فشل الدفع بالمحفظة على Firefox». لكن هذه الطريقة لا تكفي دائمًا: أضف اختبارًا صريحًا لأي تركيبة سبّبت مشكلة سابقًا في بيئة الإنتاج، وفكّر في تغطية ثلاثية (3-way) للأجزاء الحساسة مثل الدفع. أدوات مثل PICT تولّد الجدول، لكن كتابة النتيجة المتوقعة تبقى مسؤوليتك.',
      'es': 'Cuando hay muchos parámetros —navegadores, sistemas operativos, métodos de pago, tipos de cuenta— las combinaciones crecen muy rápido. Ejemplo: 3 navegadores × 2 sistemas × 3 métodos de pago × 2 tipos de cuenta = 36 pruebas. Con pairwise testing (pruebas por pares) elegimos pruebas de modo que cada par de valores de dos parámetros cualesquiera aparezca junto al menos una vez; en este ejemplo bastan 9. Funciona porque la mayoría de los defectos los provoca un solo parámetro o la interacción de dos, como «el pago con wallet falla en Firefox». Pero no siempre basta: añade pruebas explícitas para combinaciones que ya fallaron en producción y considera cobertura de tres parámetros (3-way) en zonas sensibles como los pagos. Herramientas como PICT generan la tabla, pero el resultado esperado lo defines tú.'
    },
    keyTerms: [
      { term: 'Use case', def: 'A description of how an actor achieves a goal, with a main success scenario, alternate flows and exception flows.' },
      { term: 'Exception flow', def: 'A use case path where the goal cannot be reached and the system must fail safely with a clear message.' },
      { term: 'Combinatorial explosion', def: 'The rapid growth in combinations as parameters are added, because each new parameter multiplies the total.' },
      { term: 'Pairwise testing', def: 'Choosing tests so that every pair of values from any two parameters appears together at least once.' },
      { term: 'Orthogonal array', def: 'A balanced table in which each pair of values appears the same number of times; one way to build a pairwise set.' },
      { term: '3-way coverage', def: 'Stronger combinatorial coverage in which every combination of values from any three parameters appears in some test.' }
    ],
    practice: [
      { q: 'MediBook runs on <b>3 platforms</b> (Android, iOS, web) in <b>3 languages</b> (English, Urdu, Arabic), for <b>2 appointment types</b> (in-person, video) with <b>3 payment options</b> (card, insurance, pay at clinic). How many full combinations are there, and what is the minimum size of any pairwise set?', hint: 'Multiply for the full set. For the pairwise lower bound, multiply the two largest parameters.', answer: 'Full: 3 × 3 × 2 × 3 = <b>54</b>. Any pairwise set needs at least <b>9</b> tests (3 × 3, from two of the largest parameters), because every platform–language pair must appear somewhere. Here 9 is achievable with an L9 orthogonal array; a tool will typically produce 9–10 rows.' },
      { q: 'Check this pairwise set for OS (Android, iOS), app version (old, new) and network (Wi-Fi, 4G): <b>1</b> Android, old, Wi-Fi · <b>2</b> Android, new, 4G · <b>3</b> iOS, old, 4G · <b>4</b> iOS, new, 4G. Which pairs are missing, and what single change fixes it?', hint: 'List the 4 pairs for each of the 3 parameter pairs, then tick them off.', answer: 'Missing: <b>iOS + Wi-Fi</b> and <b>new + Wi-Fi</b>. Change row 4 to iOS, new, <b>Wi-Fi</b>. All 12 pairs then appear in just 4 tests, where the full set needs 8.' },
      { q: 'Write the flows for a PeopleOps “Reset password” use case and one test per flow.', answer: '<b>Main:</b> request a reset, receive the email link, set a valid new password, log in with it — and confirm the old password no longer works. <b>Alternate:</b> request a second link; the newest link works (and decide whether older links are invalidated). <b>Exceptions:</b> unknown email (show the same neutral message, so the page does not reveal which emails exist); expired link (refused, offer a new one); link already used (refused); new password breaks the policy (clear rule shown, link still usable).' },
      { q: 'Write a PICT-style model for browser (Chrome, Safari, Edge), OS (Windows, macOS, iOS) and payment (Card, Wallet), where Safari is not available on Windows and ShopFlow does not offer Wallet on Windows.', hint: 'Parameters are written Name: value, value. Constraints use IF … THEN …; with text values in quotes.', answer: '<code>Browser: Chrome, Safari, Edge</code><br><code>OS: Windows, macOS, iOS</code><br><code>Payment: Card, Wallet</code><br><code>IF [Browser] = "Safari" THEN [OS] &lt;&gt; "Windows";</code><br><code>IF [OS] = "Windows" THEN [Payment] &lt;&gt; "Wallet";</code><br>Constraints stop the tool from generating impossible rows. Then add an expected result to each generated row.' }
    ],
    quiz: [
      { q: 'What does pairwise testing guarantee?', options: ['Every pair of values from any two parameters appears in some test', 'Every possible combination of all parameter values is tested once', 'Each parameter is tested with exactly two values', 'Tests are executed in pairs by two testers at once'], correct: 0,
        why: ['Correct — all two-way interactions are covered, usually with far fewer tests than exhaustive testing.', 'That is exhaustive combinatorial testing — the explosion pairwise is designed to avoid.', '“Pair” refers to combinations across two parameters, not two values per parameter.', 'That is pair testing, a collaboration practice — not a test design technique.'] },
      { q: 'In a use case, what is an alternate flow?', options: ['The normal path where everything goes as expected', 'The developer’s implementation steps for the feature', 'A different path that still lets the actor reach the goal', 'A path that ends with the actor failing to reach the goal'], correct: 2,
        why: ['That is the main success scenario.', 'Use cases describe actor–system interaction, not implementation.', 'Correct — e.g. paying with a saved card instead of a new one; the order is still placed.', 'That is an exception flow, where the system must fail safely.'] },
      { q: 'Checkout has 4 browsers, 3 operating systems, 5 languages and 4 payment methods. What is the smallest number of tests any pairwise set could have?', options: ['15', '20', '60', '240'], correct: 1,
        why: ['Too few: the 5 languages × 4 payment methods alone form 20 pairs, and each must appear.', 'Correct — the two largest parameters (5 × 4) set the lower bound; a tool may produce slightly more.', 'More than needed; 60 is a three-parameter product (5 × 4 × 3).', 'That is the exhaustive total (4 × 3 × 5 × 4).'] },
      { q: 'Support reports a crash that happens only with Safari on iOS 17 using Apple Pay. Your pairwise suite never generated that exact trio. What is the best response?', options: ['Trust the pairwise suite, since that combination is too rare to matter', 'Switch every feature to exhaustive combination testing', 'Drop Safari from the list of supported browsers', 'Add the trio as an explicit test; consider 3-way coverage for payments'], correct: 3,
        why: ['Real users hit it — a known failing combination must be tested, however rare.', 'Exhaustive testing is impractical; the fix is targeted, not total.', 'Removing support is a business decision, not a testing fix, and it hides the defect.', 'Correct — pairwise covers two-way interactions only; known risky combinations and payment logic may need higher strength.'] },
      { q: 'A tool generated 12 pairwise rows for you. What must you still add before they are useful tests?', options: ['Nothing — the generated rows are complete test cases', 'Expected results, plus known high-risk combinations', 'A second tool run to remove any duplicate rows', 'Every remaining combination, to reach full coverage'], correct: 1,
        why: ['Rows are input combinations only; without expected results nothing can pass or fail.', 'Correct — the tool chooses inputs; the tester supplies expected results and the must-test combinations.', 'Pairwise tools do not produce duplicate rows; this adds nothing.', 'That defeats the purpose of pairwise and brings the explosion back.'] }
    ],
    interview: [
      { q: 'What is pairwise testing, and when would you not rely on it alone?', a: 'Pairwise (all-pairs) testing selects combinations so that every pair of values from any two parameters appears together at least once. Most interaction bugs involve one or two parameters, so it can cut 36 configurations to 9 with little loss. I would not rely on it alone for <b>known high-risk combinations</b> — I add those explicitly — or for payment and safety-critical logic, where I raise the strength to 3-way. It also does not give expected results or pick values within a parameter: I use equivalence partitioning and boundaries for that, plus constraints to exclude impossible rows.' },
      { q: 'How do you derive test cases from a use case?', a: 'I read the actor, goal, preconditions and postconditions, then write at least one test for the <b>main success scenario</b>, each <b>alternate flow</b> and each <b>exception flow</b>. For every test I state the expected result including the postconditions — data saved, slot released, message sent — not only the final screen. Then I add boundaries such as time-outs and limits, and concurrency tests where flows compete for the same resource.' }
    ],
    takeaways: [
      'Use cases give end-to-end tests: cover main, alternate and exception flows and check postconditions.',
      'Each new parameter multiplies the combinations — exhaustive testing does not scale.',
      'Pairwise covers every pair of values at least once with a fraction of the tests.',
      'Add known risky combinations explicitly and raise to 3-way for critical logic.',
      'Tools generate inputs; you still supply values, constraints and expected results.'
    ],
    links: { labs: ['checkout', 'ui'], challenges: ['shopflow-checkout'], interview: ['m3'] }
  },
  {
    id: 'mt-planning',
    n: 11,
    level: 'advanced',
    title: 'Test planning, estimation, traceability and reporting',
    summary: 'Write a practical test plan, estimate effort with three-point estimates and history, trace requirements to tests, and report status honestly.',
    minutes: 25,
    objectives: [
      'Write the key sections of a test plan in plain language',
      'Estimate test effort with work breakdown, three-point estimates and historical data',
      'Build a requirements traceability matrix and use it to find gaps',
      'Write an honest test summary report and avoid misleading metrics'
    ],
    body: [
      { t: 'p', html: 'A <b>test plan</b> answers practical questions before testing starts: what will we test, how, with what, when and by whom; what could go wrong; and how will we know we are done? It does not need to be a 40-page document. On many agile teams it is one or two pages, updated as the project learns. What matters is that the decisions are written down, agreed and visible — especially what is <b>out of scope</b>.' },
      { t: 'table', caption: 'Classic IEEE 829-style sections in plain language, for the PeopleOps leave module', head: ['Section', 'Question it answers', 'Example'], rows: [
        ['Scope', 'What is in, and what is out?', 'In: leave request, approval, balances. Out: payroll export'],
        ['Approach', 'How will we test it?', 'Risk-based; EP/BVA for balances; API tests for approvals; exploratory sessions'],
        ['Entry / exit criteria', 'When can we start, and when are we done?', 'Start: smoke passes. Done: no open critical defects'],
        ['Suspension / resumption', 'When do we pause, and what lets us resume?', 'Pause if login is broken; resume after a passing smoke run'],
        ['Environment and data', 'Where, and with what data?', 'Staging with SSO; 20 test employees across 3 leave policies'],
        ['Schedule and roles', 'When, and who does what?', 'Two-week cycle; Sana owns approvals, Bilal owns balances'],
        ['Risks and contingencies', 'What could go wrong, and what then?', 'SSO environment unstable → mock SSO for non-login tests'],
        ['Deliverables', 'What will we hand over?', 'Test cases, RTM, defect reports, summary report']
      ] },
      { t: 'callout', tone: 'info', title: 'Is IEEE 829 still current?', html: 'IEEE 829 has been superseded by <b>ISO/IEC/IEEE 29119-3</b>, but its section list remains a practical checklist. Interviewers care less about the standard’s name than about whether you can explain scope, approach, risks and exit criteria for a real project.' },
      { t: 'h', text: 'Entry and exit criteria' },
      { t: 'compare', a: { title: 'Entry criteria (ready to start)', items: ['Stories or requirements reviewed and baselined', 'Test environment deployed and smoke test passed', 'Test data and accounts available', 'Blocking defects from the last cycle fixed'] }, b: { title: 'Exit criteria (ready to stop)', items: ['All planned high-risk tests executed', 'No open critical defects; open majors agreed with the product owner', 'Requirement coverage reviewed in the RTM', 'Summary report shared and residual risks accepted'] } },
      { t: 'h', text: 'Estimating test effort' },
      { t: 'list', items: [
        '<b>Work breakdown:</b> split testing into tasks — design, environment and data setup, execution cycles, retest and regression, reporting — and estimate each one. Small tasks are easier to estimate than one big number.',
        '<b>Three-point estimate:</b> for each task give optimistic (O), most likely (M) and pessimistic (P) values, then combine them.',
        '<b>Historical data:</b> use numbers from similar past work, e.g. “the last module averaged 2.5 hours per requirement, including retests”.',
        '<b>Expert judgement:</b> ask several experienced people separately, then discuss the differences (Wideband Delphi, planning poker).'
      ] },
      { t: 'callout', tone: 'key', title: 'Three-point (PERT) estimate', html: '<b>E = (O + 4M + P) ÷ 6</b>, with a standard deviation of roughly <b>(P − O) ÷ 6</b>. Example: O = 6 days, M = 10, P = 20 → E = (6 + 40 + 20) ÷ 6 = <b>11 days</b>, SD ≈ 2.3 days. Report it as a range — “about 11 days, likely 9–13” — not a promise. The simpler triangular average, (O + M + P) ÷ 3, would give 12 days here.' },
      { t: 'h', text: 'Requirements traceability matrix (RTM)' },
      { t: 'table', head: ['Requirement', 'Test cases', 'Latest result', 'Open defects'], rows: [
        ['REQ-1 Employee submits a leave request', 'TC-01, TC-02, TC-03', 'Pass', '—'],
        ['REQ-2 Manager approves or rejects', 'TC-04, TC-05', '<b>Fail</b> (TC-05)', 'PO-341 (critical)'],
        ['REQ-3 Balance updates after approval', 'TC-06, TC-07', 'Blocked', 'Waiting on PO-341'],
        ['REQ-4 Email notification to employee', '<b>None</b>', '—', '<b>Gap: no tests written</b>']
      ] },
      { t: 'p', html: 'Read the matrix both ways. <b>Forward</b> (requirement → tests) shows gaps: REQ-4 has no tests at all, which no pass rate would ever reveal. <b>Backward</b> (test → requirement) shows tests that no longer trace to anything and may be obsolete. When a requirement changes, the RTM tells you which tests to update and re-run. In Jira or a test management tool, the same links usually live on the tickets themselves.' },
      { t: 'h', text: 'Reporting status honestly' },
      { t: 'p', html: 'A <b>test summary report</b> tells decision-makers what they need to know: the build and scope tested; what was <b>not</b> tested and why; results (executed, passed, failed, blocked, not run); open defects by severity; whether exit criteria are met; residual risks; and a clear recommendation. Numbers support the story — they are not the story. The release decision belongs to the product owner or release manager; the tester’s job is to make it a well-informed one.' },
      { t: 'callout', tone: 'warn', title: 'Metrics that mislead', html: 'A <b>95% pass rate</b> can hide one critical payment failure. A pass rate “of executed tests” hides blocked and unrun tests — report it against <b>planned</b> tests too. Test case counts are not coverage. Ranking testers by bug count invites duplicates and trivial bugs: when a measure becomes a target, it stops being a good measure. Always pair numbers with risk.' }
    ],
    example: {
      title: 'Worked example: estimating and reporting the PeopleOps leave release',
      blocks: [
        { t: 'p', html: 'The lead breaks the work down and asks the team for three-point estimates, in days, for each task:' },
        { t: 'table', head: ['Task', 'O', 'M', 'P', 'E = (O + 4M + P) ÷ 6'], rows: [
          ['Test design (40 requirements)', '3', '4', '8', '4.5'],
          ['Environment and data setup', '1', '2', '6', '2.5'],
          ['Execution, cycle 1', '4', '6', '11', '6.5'],
          ['Retest and regression, cycle 2', '2', '3', '7', '3.5'],
          ['Reporting and sign-off', '1', '1', '4', '1.5'],
          ['<b>Total</b>', '11', '16', '36', '<b>18.5</b>']
        ] },
        { t: 'p', html: 'The expected total (18.5 days) is higher than the sum of the “most likely” values (16 days) because risk is lopsided: tasks rarely finish much earlier than expected, but they can run much later. Two weeks later, the summary report reads:' },
        { t: 'code', lang: 'text', title: 'Test summary (abridged)', code: 'TEST SUMMARY  PeopleOps Leave 2.3 · build 2.3.0-rc2 · 14 Nov\nVERDICT       NOT READY: 1 critical defect open (exit criteria not met)\n\nScope       Leave request, approval, balances. Out: payroll export\nExecuted    118 of 124 planned; 6 blocked (4 SSO env down, 2 by PO-341)\nResults     109 passed, 9 failed\nPass rate   92% of executed, 88% of planned\nDefects     Open: 1 critical, 2 major, 5 minor\n            PO-341 critical: double-clicking Approve deducts the\n            leave balance twice\nNot tested  SSO login paths (environment down)\nRisk        Wrong balances flow into payroll if PO-341 ships\nAsk         Fix PO-341 and restore the SSO env, then 1 day for\n            retest and regression of approvals and balances' }
      ]
    },
    explain: {
      'ur': 'Test planning کا مقصد یہ طے کرنا ہے کہ کیا ٹیسٹ کرنا ہے، کیسے، کب، کس کے ذریعے، اور کب کہیں گے کہ کام مکمل ہو گیا (exit criteria)۔ Effort کا اندازہ لگانے کے لیے three-point estimate استعمال کریں: E = (O + 4M + P) ÷ 6۔ مثال: optimistic 6 دن، most likely 10 دن اور pessimistic 20 دن ہوں تو E = 11 دن۔ Requirements traceability matrix (RTM) ہر requirement کو اس کے test cases اور نتائج سے جوڑتی ہے، اس طرح وہ requirement فوراً نظر آ جاتی ہے جس کا کوئی test ہی نہیں۔ آخر میں report ایمانداری سے لکھیں: 95% pass rate اچھا لگتا ہے، لیکن اگر ایک critical payment bug کھلا ہے تو release تیار نہیں۔ یہ بھی بتائیں کہ کیا ٹیسٹ نہیں ہو سکا اور کیوں۔',
      'ur-Latn': 'Test planning ka maqsad yeh tay karna hai ke kya test karna hai, kaise, kab, kis ke zariye, aur kab kahenge ke kaam mukammal ho gaya (exit criteria). Effort ka andaza lagane ke liye three-point estimate use karein: E = (O + 4M + P) ÷ 6. Misaal: optimistic 6 din, most likely 10 din aur pessimistic 20 din hon to E = 11 din. Requirements traceability matrix (RTM) har requirement ko us ke test cases aur results se jorti hai, is tarah woh requirement foran nazar aa jati hai jis ka koi test hi nahi. Aakhir mein report imandari se likhein: 95% pass rate acha lagta hai, lekin agar ek critical payment bug khula hai to release tayyar nahi. Yeh bhi batayein ke kya test nahi ho saka aur kyun.',
      'hi': 'Test planning का मकसद यह तय करना है कि क्या test करना है, कैसे, कब, किसके द्वारा, और कब कहेंगे कि काम पूरा हो गया (exit criteria)। Effort का अनुमान लगाने के लिए three-point estimate इस्तेमाल करें: E = (O + 4M + P) ÷ 6। उदाहरण: optimistic 6 दिन, most likely 10 दिन और pessimistic 20 दिन हों, तो E = 11 दिन। Requirements traceability matrix (RTM) हर requirement को उसके test cases और नतीजों से जोड़ती है, जिससे वह requirement तुरंत दिख जाती है जिसका कोई test ही नहीं है। आख़िर में report ईमानदारी से लिखें: 95% pass rate अच्छा लगता है, लेकिन अगर एक critical payment bug खुला है तो release तैयार नहीं है। यह भी बताएँ कि क्या test नहीं हो सका और क्यों।',
      'ar': 'الهدف من تخطيط الاختبار (Test planning) هو أن نحدّد ماذا سنختبر، وكيف، ومتى، ومن سيقوم بذلك، ومتى نعتبر العمل منتهيًا (exit criteria). لتقدير الجهد نستخدم التقدير ثلاثي النقاط (three-point estimate): E = (O + 4M + P) ÷ 6. مثال: إذا كان التقدير المتفائل 6 أيام، والأرجح 10 أيام، والمتشائم 20 يومًا، فإن E = 11 يومًا. أما مصفوفة تتبّع المتطلبات (RTM) فتربط كل متطلب بحالات الاختبار ونتائجها، فيظهر فورًا أي متطلب ليس له اختبار أصلًا. وأخيرًا اكتب التقرير بصدق: نسبة نجاح 95% تبدو جيدة، لكن إذا بقي خلل حرج في الدفع مفتوحًا فالإصدار غير جاهز. واذكر أيضًا ما لم يُختبر ولماذا.',
      'es': 'Planificar las pruebas (test planning) es decidir qué se va a probar, cómo, cuándo, quién lo hará y cuándo diremos que hemos terminado (exit criteria). Para estimar el esfuerzo se usa la estimación de tres puntos (three-point estimate): E = (O + 4M + P) ÷ 6. Ejemplo: optimista 6 días, más probable 10 y pesimista 20; entonces E = 11 días. La matriz de trazabilidad de requisitos (RTM) une cada requisito con sus casos de prueba y resultados, así se ve enseguida qué requisito no tiene ninguna prueba. Por último, informa con honestidad: un 95% de pass rate parece bueno, pero si hay un bug crítico de pagos abierto, la versión no está lista. Indica también qué no se pudo probar y por qué.'
    },
    keyTerms: [
      { term: 'Test plan', def: 'A document, often short, recording the scope, approach, resources, schedule, risks and entry/exit criteria for testing.' },
      { term: 'Entry criteria', def: 'Conditions that must be met before testing starts, such as a passing smoke test and ready test data.' },
      { term: 'Exit criteria', def: 'Conditions that define when testing is done, such as no open critical defects and all high-risk tests executed.' },
      { term: 'Three-point estimate', def: 'An estimate combining optimistic, most likely and pessimistic values, commonly E = (O + 4M + P) ÷ 6.' },
      { term: 'Requirements traceability matrix', def: 'A table linking each requirement to its tests, results and defects, used to find gaps and assess change impact.' },
      { term: 'Test summary report', def: 'An end-of-cycle report of scope, results, open defects, residual risks and a recommendation.' }
    ],
    practice: [
      { q: 'Estimate API regression work with O = 3 days, M = 5 days and P = 13 days using the three-point (PERT) formula. Give the estimate and a sensible range.', hint: 'E = (O + 4M + P) ÷ 6 and SD ≈ (P − O) ÷ 6.', answer: 'E = (3 + 20 + 13) ÷ 6 = 36 ÷ 6 = <b>6 days</b>. SD ≈ (13 − 3) ÷ 6 ≈ 1.7 days, so a sensible way to say it is “about 6 days, likely 4–8”. E sits above the most likely value (5) because the pessimistic case is far out — a sign of risk worth naming in the plan.' },
      { q: 'Build a mini RTM and name the gaps. Requirements: REQ-A guest checkout, REQ-B saved cards, REQ-C order history. Tests: TC-1 guest checkout with card, TC-2 guest checkout with cash on delivery, TC-3 view order history, TC-9 apply loyalty points.', answer: 'REQ-A → TC-1, TC-2. REQ-B → <b>no tests</b> (a forward gap). REQ-C → TC-3. TC-9 traces to <b>no requirement</b> (a backward gap): either a requirement is missing from the list or the test is obsolete. Both gaps need a conversation before sign-off.' },
      { q: 'Rewrite this status line so it is honest and useful: <i>“Testing 95% complete, all good, 190/200 passed.”</i> Assume the facts are: 190 of 200 planned tests executed, 182 passed, 8 failed, 10 blocked by the environment, and one failure is critical.', answer: '“<b>Not ready yet.</b> 190 of 200 planned tests executed: 182 passed, 8 failed; 10 blocked because the refund environment is down. Open defects: 1 critical (partial refunds charged twice), 3 minor. Risk: refunds untested on the release build. Recommendation: fix the critical defect and restore the environment, then allow 1 day for retest and refund regression.” It separates executed from planned, names the critical defect and states what was not covered.' },
      { q: 'Write three entry and three exit criteria for a two-week sprint testing MediBook’s new video-consultation feature.', answer: '<b>Entry:</b> stories have acceptance criteria reviewed by QA; the build is on staging and the smoke test passed; test doctor and patient accounts and the agreed devices are available. <b>Exit:</b> all acceptance criteria tested on the agreed devices; no open critical or major defects (or majors accepted in writing by the product owner); summary report shared, including what was not tested.' }
    ],
    quiz: [
      { q: 'Using the PERT three-point formula, what is the estimate for O = 4 days, M = 6 days and P = 14 days?', options: ['6 days', '8 days', '7 days', '24 days'], correct: 2,
        why: ['That is the most likely value alone; it ignores the risk in the pessimistic case.', 'That is the simple triangular average, (4 + 6 + 14) ÷ 3, not the PERT formula.', 'Correct — (4 + 4×6 + 14) ÷ 6 = 42 ÷ 6 = 7 days.', 'That is the sum of the three values, not an estimate.'] },
      { q: 'What is the main purpose of a requirements traceability matrix?', options: ['To record how long each test case took to run', 'To rank every open defect by severity for the release meeting', 'To track which tester executed which test case', 'To link requirements to tests and results so gaps show'], correct: 3,
        why: ['Execution time belongs in test run records, not in the RTM.', 'That is a defect report or dashboard; an RTM may link defects, but it is organised by requirement.', 'Assignment tracking is a test-management feature, not the purpose of traceability.', 'Correct — forward and backward links reveal untested requirements and orphan tests, and support change impact analysis.'] },
      { q: 'The dashboard shows a 96% pass rate, above the 95% target. One of the failures is “payment captured twice on retry”. What should the summary report say?', options: ['Not ready: a critical payment defect is still open', 'Ready: the pass rate is above the agreed 95% target', 'Ready with minor issues, since only a few tests failed', 'Not ready: every single test must pass at 100% before any release'], correct: 0,
        why: ['Correct — impact outweighs the percentage. Charging customers twice blocks the release whatever the pass rate says.', 'A target met on paper does not cancel a critical defect; exit criteria should include “no open critical defects”.', 'Counting failures ignores their impact — this one moves customers’ money twice.', 'A 100% rule is unrealistic; teams can release with known minor defects when the risk is understood and accepted.'] },
      { q: 'Which of these is an exit criterion rather than an entry criterion?', options: ['The test environment is installed and reachable', 'No open critical defects and all high-risk tests run', 'Requirements are reviewed and baselined', 'The new build has passed the smoke test'], correct: 1,
        why: ['Entry criterion — you need a working environment before testing starts.', 'Correct — it defines when testing can stop and a release decision can be made.', 'Entry criterion — a stable test basis is needed before designing tests.', 'Entry criterion — a failed smoke test means the build is not ready to test.'] },
      { q: 'A manager proposes ranking testers by the number of bugs they log each week. What is the biggest risk?', options: ['Testers will move to automation and stop logging manual bugs', 'Developers will start rejecting every bug report', 'Bug counts will fall because writing reports takes too much time', 'Testers chase easy, duplicate bugs instead of high-risk areas'], correct: 3,
        why: ['Not a likely effect: the incentive pushes testers to log more bugs, not fewer.', 'Some friction is possible, but the main damage is to what testers choose to test.', 'The incentive works the other way — people log more, not fewer.', 'Correct — when a measure becomes a target, it stops being a good measure; effort drifts to countable bugs instead of risk.'] }
    ],
    interview: [
      { q: 'What goes into a test plan?', a: 'In plain terms: <b>scope</b> (what is in and out), <b>approach</b> (levels, techniques, manual versus automated, tools), <b>entry and exit criteria</b>, suspension and resumption rules, <b>environment and test data</b>, schedule and responsibilities, <b>risks and contingencies</b>, and deliverables such as the RTM and summary report. Those headings come from IEEE 829, now superseded by ISO/IEC/IEEE 29119-3. On an agile team I keep the plan to a page or two and update it each sprint. The most valuable parts are usually what is out of scope and the risks — they prevent surprises later.' },
      { q: 'How do you estimate testing effort?', a: 'I break the work down — test design, environment and data setup, execution cycles, retest and regression, reporting — and estimate each task. For uncertain tasks I use a <b>three-point estimate</b>, E = (O + 4M + P) ÷ 6, and compare it with <b>historical data</b> from similar features. I always include at least one retest-and-regression cycle, because defects will be found. I give the result as a range with stated assumptions, and re-estimate when scope or risk changes.' },
      { q: 'How do you report status when the numbers look good but you are worried?', a: 'I lead with the risk, not the percentage — for example: “92% of executed tests passed, but one critical defect is open in approvals, and SSO login was not tested because the environment was down. Exit criteria are not met.” I separate executed from planned tests, list open defects by severity, say what was not covered and why, and give a clear recommendation with options. The product owner decides on the release; my job is to make sure that decision is fully informed.' }
    ],
    takeaways: [
      'A good plan makes scope, approach, risks and entry/exit criteria explicit — especially what is out of scope.',
      'Estimate by breaking work down; use E = (O + 4M + P) ÷ 6 and historical data, and give a range.',
      'An RTM links requirements to tests and results, exposing untested requirements and orphan tests.',
      'Report executed vs planned, defects by severity, untested areas and a clear recommendation.',
      'A high pass rate never cancels an open critical defect.'
    ],
    links: { interview: ['m6', 'm1'] }
  }
]);

QA_CONTENT.addBank('manual', [
  { level: 'beginner', topic: 'mt-requirements', q: 'Which of these is a non-functional requirement?',
    options: ['Users can filter their orders by date', 'The order page loads in under 2 seconds on 4G', 'Managers can approve or reject leave requests', 'Customers can save more than one delivery address'], correct: 1,
    why: ['Functional — it describes something the system does.', 'Correct — it describes how well the system performs (performance), with a measurable threshold you can test.', 'Functional — a behaviour the system must provide.', 'Functional — a capability, even though it mentions a quantity.'] },
  { level: 'beginner', topic: 'mt-scenarios-cases', q: 'A test case passes for you but fails for a colleague who followed the same steps on the same build. What is the test case most likely missing?',
    options: ['A more descriptive title for the test case', 'The name of the tester who originally wrote it', 'A screenshot of the final screen after the last step', 'Preconditions and the exact test data to use'], correct: 3,
    why: ['A clearer title helps people find the case, but it does not change how the case runs.', 'Authorship has no effect on the result.', 'Evidence is useful, but it does not make the starting state reproducible.', 'Correct — different starting states (account type, cart contents, settings) or different data explain different results. Spell them out.'] },
  { level: 'beginner', topic: 'mt-equivalence', q: 'A ShopFlow country dropdown offers Pakistan, India and UAE, and each country has a different tax rule. How should you partition this input?',
    options: ['One per country, plus “nothing selected”', 'One partition, since every option is a valid country', 'Two partitions: something selected, nothing selected', 'None, because a dropdown cannot receive invalid input'], correct: 0,
    why: ['Correct — three different tax rules mean the system treats each country differently, so each is its own partition; an empty selection is an invalid one.', 'Valid does not mean equivalent: three different tax rules are three different behaviours.', 'This misses that each country triggers a different rule.', 'Requests can be sent without the UI, and “nothing selected” is often possible even in the UI.'] },
  { level: 'intermediate', topic: 'mt-equivalence', q: 'PayLite charges no fee on transfers up to Rs 10,000, 1% from Rs 10,001 to Rs 50,000, and blocks transfers above Rs 50,000. A tester tries Rs 5,000, Rs 7,500 and Rs 9,000. What is wrong with this set?',
    options: ['Nothing, because three different values give good coverage', 'The amounts are too small to find bugs in a payments system', 'They share one partition; the 1% and blocked ranges are untested', 'Transfers should always be tested with decimal amounts only'], correct: 2,
    why: ['Three values from the same partition test the same rule three times.', 'Size is not the issue — coverage of the different rules is.', 'Correct — pick one value per partition, e.g. 5,000 (no fee), 30,000 (1%) and 60,000 (blocked), then add boundary values.', 'Decimals may be a partition worth testing, but they do not fix the missing ranges.'] },
  { level: 'intermediate', topic: 'mt-boundary', q: 'MediBook lets patients book up to 30 days in advance, inclusive. Today is 1 March, so 31 March is the last allowed day. Which pair of dates best tests the upper boundary?',
    options: ['15 March and 20 March', '1 March and 2 March', '31 March and 1 April', '30 April and 1 May'], correct: 2,
    why: ['Both are comfortably inside the range, so they cannot show where the edge is.', 'These test the lower edge (today and tomorrow), not the 30-day limit.', 'Correct — the last allowed day and the first day that must be refused.', 'Far beyond the limit; an off-by-one error at day 30/31 would go unnoticed.'] },
  { level: 'beginner', topic: 'mt-boundary', q: 'A text field allows 1 to 50 characters. Which lengths form the three-value boundary set for the upper edge?',
    options: ['49, 50, 51', '50, 51, 52', '48, 49, 50', '50, 100, 500'], correct: 0,
    why: ['Correct — the boundary (50) plus the values just below and just above it.', 'Misses 49, the last length below the boundary on the valid side.', 'Misses 51, the first invalid length — the most important check.', 'Far values do not test the edge; an off-by-one at 50/51 would be missed.'] },
  { level: 'beginner', topic: 'mt-bug-reports', q: 'A page shows “Something went wrong” after you click Save. In DevTools you see that the save request failed. What is the most useful evidence to attach?',
    options: ['A phone photo of the screen showing the generic error message', 'A full list of every page the tester visited earlier that day', 'A note on which developer probably wrote the faulty code', 'The failing request and response from the Network tab'], correct: 3,
    why: ['A photo of a generic message shows the symptom, not the cause.', 'Unrelated history adds noise; include only the steps that reproduce the problem.', 'Blame does not help diagnosis and damages collaboration.', 'Correct — the URL, status code, request payload and response body point the developer straight at the failure.'] },
  { level: 'intermediate', topic: 'mt-bug-reports', q: 'A minor layout bug on the promotions page was logged as low severity, low priority. Marketing now plans a major campaign on that page tomorrow. What should change?',
    options: ['Severity goes up to high, because more users will see it', 'Priority rises; severity stays low, as the impact has not changed', 'Both stay the same, because they were already agreed in triage', 'The bug should be closed and reopened as a brand-new defect report'], correct: 1,
    why: ['Severity measures the impact of the defect itself, which has not changed; more visibility affects urgency.', 'Correct — priority reflects business urgency and changes with context; severity reflects impact.', 'Triage decisions should be revisited when the business context changes.', 'Re-logging loses the history; update the priority on the existing report.'] },
  { level: 'intermediate', topic: 'mt-decision-tables', q: 'A ShopFlow decision table has the rule: member = Yes, coupon = Yes → apply only the larger of the two discounts. Which test checks this rule best?',
    options: ['Member (5%) with a 10% coupon: expect 10% only, not 15%', 'Non-member with a 10% coupon: expect the coupon discount', 'Member (5%) without a coupon: expect the member discount only', 'Member with any coupon: check that some discount is shown'], correct: 0,
    why: ['Correct — it targets exactly this rule, and its expected result separates the right outcome (10%) from the wrong “stacked” one (15%).', 'This tests a different rule (member = No, coupon = Yes).', 'This tests a different rule (member = Yes, coupon = No).', 'Right rule, but “some discount” cannot tell a correct 10% from a wrong 15%.'] },
  { level: 'intermediate', topic: 'mt-state-transition', q: 'A PeopleOps leave request moves Draft → Submitted → Approved or Rejected, and an Approved request can be cancelled before the leave starts. Which test checks an invalid transition?',
    options: ['Submit a draft request and check the manager is notified', 'Approve a submitted request and check the balance drops', 'Approve a request that is still in Draft', 'Cancel an approved request before the leave starts'], correct: 2,
    why: ['A valid transition (Draft → Submitted) and its action.', 'A valid transition (Submitted → Approved) and its action.', 'Correct — Approve is not allowed in Draft. Expect a refusal, no balance change and no notification; try it through the API too.', 'A valid transition that the rules explicitly allow.'] },
  { level: 'intermediate', topic: 'mt-exploratory', q: 'Halfway through a 90-minute session on coupon codes, you notice that gift cards behave strangely at checkout. What is the best move?',
    options: ['Drop the coupon charter and explore gift cards for the rest of the time', 'Note it, finish the coupon charter, then propose a gift-card charter', 'Ignore it, because gift cards are outside the current charter', 'Stop testing and wait for a written gift-card specification'], correct: 1,
    why: ['Drifting leaves the coupon mission unfinished and makes coverage hard to report.', 'Correct — capture it with evidence (log a bug now if it clearly is one), keep the session focused, and let the debrief schedule a new charter.', 'Ignoring a possible bug wastes a real finding; a charter focuses a session, it does not blind it.', 'Exploration does not need a full spec, and waiting delays important information.'] },
  { level: 'beginner', topic: 'mt-regression', q: 'Which situation most clearly calls for regression testing?',
    options: ['A bug was reported and nobody has fixed it yet', 'A tester is writing test cases for a brand-new feature', 'Developers are estimating the next sprint', 'The database server was upgraded to a new version'], correct: 3,
    why: ['Nothing has changed yet, so there is nothing to regress — and nothing to retest either.', 'That is test design for new functionality, not regression.', 'Estimation is a planning activity; no change has been made to test.', 'Correct — changes to the environment or dependencies can break working features even when no product code changed.'] },
  { level: 'intermediate', topic: 'mt-regression', q: 'Build 4.1 arrives at 9 am. The login page returns a server error for every user. What should the tester do first?',
    options: ['Run the full regression suite to find all other failures', 'Report the smoke failure and send the build back as untestable', 'Retest every bug fixed in this build anyway', 'Start sanity testing the new coupon feature'], correct: 1,
    why: ['Almost every test depends on login; a full run would only produce noise.', 'Correct — this is exactly what smoke testing is for: the build is not testable, so reject it with evidence.', 'Retests also need login; they would be blocked and wasted.', 'A sanity check needs a testable build — login comes first.'] },
  { level: 'advanced', topic: 'mt-pairwise', q: 'Which statement about pairwise testing is accurate?',
    options: ['It covers every two-way interaction but can miss three-way defects', 'It finds every defect that exhaustive combination testing would find', 'It needs no expected results, because a tool generates the rows', 'It only works when every parameter has exactly two possible values'], correct: 0,
    why: ['Correct — that is why known risky trios are added explicitly, or 3-way coverage is used for critical logic.', 'No — a defect triggered only by a specific three-value combination can slip through.', 'Tools choose inputs only; testers still define what should happen.', 'Parameters can have any number of values; “pair” refers to two parameters at a time.'] },
  { level: 'advanced', topic: 'mt-planning', q: 'Your three-point estimate for a module is O = 5, M = 8 and P = 17 days. The manager asks for “one number we can commit to”. What is the best reply?',
    options: ['8 days, the most likely value, since that is what usually happens', '17 days, the pessimistic value, to be completely safe', 'About 9 days, likely 7–11, naming the risks behind the upper end', '30 days — the sum of all three values, so every scenario is covered'], correct: 2,
    why: ['It ignores the skew towards delay: the PERT estimate (9) is above the most likely value.', 'Padding everything to the worst case wastes time and erodes trust in estimates.', 'Correct — E = (5 + 32 + 17) ÷ 6 = 9 and SD = (17 − 5) ÷ 6 = 2. A range with named risks is honest and still gives a planning number.', 'Adding the three values together is not an estimation method at all.'] },
  { level: 'advanced', topic: 'mt-planning', q: 'Which of these belongs in a test summary report but not in the test plan?',
    options: ['The planned scope and the test approach to be used', 'The entry and exit criteria agreed before testing', 'The schedule, roles and responsibilities for testing', 'Actual results, open defects and residual risks'], correct: 3,
    why: ['Scope and approach are decided in the plan (the report may restate them).', 'The plan defines the criteria; the report says whether they were met.', 'The schedule and roles are planned up front.', 'Correct — results, open defects and remaining risks only exist once testing has happened.'] }
]);

QA_CONTENT.addDrills('manual', [
  {
    id: 'mt-d1', type: 'classify', level: 'intermediate',
    title: 'Smoke, sanity, retest or regression?',
    prompt: 'Read each situation and choose the kind of testing it describes.',
    categories: ['Smoke', 'Sanity', 'Retest', 'Regression'],
    items: [
      { text: 'Build 7.2 just landed. Before anything else, you check that login, search, cart and checkout all load.', cat: 0, why: 'A broad, shallow check that the build is testable — <b>smoke</b>.' },
      { text: 'BUG-301 (wrong VAT on invoices) is marked fixed. You repeat its exact steps and data on the new build.', cat: 2, why: 'Re-running the failed case after the fix is <b>retesting</b> (confirmation testing).' },
      { text: 'After a currency-library upgrade, you re-run the passing tests for invoices, refunds and reports.', cat: 3, why: 'Previously working features re-checked after a change — <b>regression</b>, even though no product code changed.' },
      { text: 'A small fix changed the coupon field. You spend a few minutes checking that coupons now apply sensibly before deeper testing.', cat: 1, why: 'A narrow, focused check of a specific changed area — <b>sanity</b>.' },
      { text: 'The nightly pipeline re-runs 400 automated checkout and account tests that passed last week.', cat: 3, why: 'Re-running previously passing tests to catch breakage — <b>regression</b>, here automated.' },
      { text: 'A developer fixed “password-reset email never arrives”. You request a reset again with the same account.', cat: 2, why: 'Repeating the originally failing scenario to confirm the fix — <b>retest</b>.' },
      { text: 'First build of the day: the pipeline checks the app starts, the home page loads and the API health check responds.', cat: 0, why: 'A quick, broad build verification — <b>smoke</b>.' },
      { text: 'After a hotfix to the date picker, you check for ten minutes that date selection behaves sensibly in the booking form.', cat: 1, why: 'Narrow and focused on the fixed area, before deeper testing — <b>sanity</b>.' }
    ]
  },
  {
    id: 'mt-d2', type: 'classify', level: 'intermediate',
    title: 'Severity vs priority',
    prompt: 'Classify each defect by its most likely severity and priority. Severity is the impact on users or the system; priority is how urgently the business wants it fixed.',
    categories: ['High severity, high priority', 'High severity, low priority', 'Low severity, high priority', 'Low severity, low priority'],
    items: [
      { text: 'The company name is misspelled in the header of the home page.', cat: 2, why: 'No functional impact (low severity), but highly visible and damaging to the brand (high priority).' },
      { text: 'Checkout crashes for every customer paying by card.', cat: 0, why: 'Blocks revenue for everyone — severe and urgent.' },
      { text: 'An admin report used once a year crashes when exported to PDF; the CSV export works.', cat: 1, why: 'A crash is a severe failure of that function, but rare use and a workaround make it less urgent.' },
      { text: 'A tooltip on the settings page has an extra space between two words.', cat: 3, why: 'Cosmetic and hard to notice — low impact, low urgency.' },
      { text: 'Customers can view other people’s orders by changing the order ID in the URL.', cat: 0, why: 'A privacy breach — severe impact that must be fixed immediately.' },
      { text: 'The app crashes when the screen is rotated many times very quickly on the rarely visited Help page.', cat: 1, why: 'A crash is high severity, but the trigger is unusual and the page is rarely used, so it can wait.' },
      { text: 'The login button still shows the old brand colour, and the rebrand launches tomorrow.', cat: 2, why: 'Cosmetic (low severity), but the business needs it right before the launch (high priority).' },
      { text: 'An internal admin page footer shows last year’s copyright date.', cat: 3, why: 'Cosmetic, internal and harmless — low severity, low priority.' }
    ]
  },
  {
    id: 'mt-d3', type: 'order', level: 'beginner',
    title: 'Order the defect life cycle',
    prompt: 'Put the stages of a typical defect life cycle in order, from discovery to closure.',
    items: [
      'New — the tester logs the defect',
      'Assigned — a lead assigns it to a developer',
      'Open — the developer analyses and works on it',
      'Fixed — the change is made and deployed to test',
      'Retest — the tester re-runs the failing steps',
      'Verified — the retest passed on the fixed build',
      'Closed — no further action is needed'
    ],
    explain: 'This is one common path; tools such as Jira let each team name the states differently. Real defects also branch: <b>Reopened</b> if the retest fails (back to the developer), <b>Rejected</b> or <b>Not a bug</b> if it works as designed, <b>Duplicate</b> if it was already reported, and <b>Deferred</b> when the fix is postponed to a later release. Notice that only a passed <b>retest</b> moves a fixed bug towards closure — a fix is not done until the tester confirms it.'
  },
  {
    id: 'mt-d4', type: 'spot', level: 'beginner',
    title: 'Spot the weak lines in a bug report',
    prompt: 'This bug report was written in a hurry. Select every line that is weak or wrong.',
    lines: [
      { text: 'Title: Login broken!!!', flaw: true, why: 'Vague and emotional. Name the feature, symptom and condition, e.g. “Login: ‘Server error 500’ after password reset”.' },
      { text: 'Environment: staging, build 4.2.1, Chrome 129 on Windows 11', flaw: false, why: 'A specific environment and build — exactly what a developer needs.' },
      { text: 'Steps: 1. Reset the password for asma@test.pk 2. Log in with the new password', flaw: false, why: 'Concrete, numbered steps with real test data.' },
      { text: 'Expected: It should work', flaw: true, why: 'Not checkable. State the expected behaviour, e.g. “User lands on the dashboard”.' },
      { text: 'Actual: “Server error 500” page appears, and the old password still works', flaw: false, why: 'Precise observed behaviour. The old password still working is strong evidence that the new password was never saved — part of the same defect, and worth stating.' },
      { text: 'Severity: Low — but please fix today, the CEO noticed it', flaw: true, why: 'Being unable to log in after a password reset is a high-severity failure. Urgency belongs in <b>priority</b>, which the product owner sets — not in severity.' },
      { text: 'Attachments: screen recording and the failing network request (500 response)', flaw: false, why: 'Evidence like this speeds up diagnosis.' },
      { text: 'Reproducibility: happens sometimes I think', flaw: true, why: 'A guess. Give a rate (“3 of 5 attempts”) and any pattern you noticed.' }
    ]
  },
  {
    id: 'mt-d5', type: 'spot', level: 'beginner',
    title: 'Spot the bad test steps',
    prompt: 'This ShopFlow test case checks applying a coupon. Select the lines that are vague, untestable or try to do too much.',
    lines: [
      { text: 'Precondition: logged in as sara@test.pk with an empty cart', flaw: false, why: 'A clear, reproducible starting state.' },
      { text: 'Step 1: Add “Blue Mug” (Rs 1,200) to the cart', flaw: false, why: 'A specific item and price — anyone can repeat it.' },
      { text: 'Step 2: Enter some coupon and apply it', flaw: true, why: '“Some coupon” is not test data. Name it: “Enter SAVE10 and click Apply”.' },
      { text: 'Step 3: Check that the discount is correct', flaw: true, why: 'No expected value. Say what correct means: “Discount line shows −Rs 120; total is Rs 1,080”.' },
      { text: 'Step 4: Click “Remove coupon”', flaw: false, why: 'A clear, single action.' },
      { text: 'Expected (step 4): the discount line disappears and the total returns to Rs 1,200', flaw: false, why: 'An exact, observable expected result.' },
      { text: 'Step 5: Also test all other coupons, payment methods and browsers', flaw: true, why: 'Not a step — it is a whole test plan. Split it into separate cases or a data-driven set.' }
    ]
  },
  {
    id: 'mt-d6', type: 'fill', level: 'intermediate',
    title: 'Fill in the boundary values',
    prompt: 'Type the single value each rule asks for. Digits are easiest.',
    fields: [
      { label: 'Quantity accepts whole numbers 1–10. What is the invalid value just below the range?', accept: ['0', 'zero'], why: 'Two-value BVA for 1–10 is 0, 1, 10, 11; <b>0</b> is the invalid neighbour of the lower boundary.' },
      { label: 'A username must be 3–20 characters. Which length is the invalid neighbour of the lower boundary?', accept: ['2', 'two', '2 characters', '2 chars'], why: '<b>2</b> is just below the minimum of 3, so it must be rejected.' },
      { label: 'Free shipping for subtotals of $50.00 or more; prices step by 1 cent. What is the highest subtotal that still pays shipping?', accept: ['49.99', '$49.99', '49.99$', '$ 49.99', 'usd 49.99'], why: 'The rule is inclusive at $50.00, so <b>$49.99</b> is the last value below the boundary.' },
      { label: 'A bulk discount applies to orders of MORE than 100 items. What is the smallest quantity that gets the discount?', accept: ['101', 'one hundred one', 'one hundred and one'], why: '“More than 100” is exclusive: 100 does not qualify, <b>101</b> does. Test both.' },
      { label: 'Three-value BVA for a 1–10 range: which valid value sits just above the lower boundary?', accept: ['2', 'two'], why: 'Three-value BVA adds the neighbours inside the range: 0, 1, <b>2</b> and 9, 10, 11.' },
      { label: 'A password needs at least 8 characters. Which length must be rejected at the boundary?', accept: ['7', 'seven', '7 characters', '7 chars'], why: '<b>7</b> is the invalid neighbour of the minimum (8). With no maximum stated, also probe a very long password.' }
    ]
  }
]);
