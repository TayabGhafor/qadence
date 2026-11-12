/* Qadence content · stage "foundations" · lessons 1–9 (what testing is → risk-based strategy),
   plus Test Center bank questions and practice drills.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-foundations.js */
QA_CONTENT.addLessons('foundations', [
  {
    id: 'fd-what-is-testing',
    n: 1,
    level: 'beginner',
    title: 'What software testing is — and why it matters',
    summary: 'Explain what testing is for, why late defects cost more, and how testers turn checks into information people use to make release decisions.',
    minutes: 14,
    objectives: [
      'Explain the purpose of software testing in plain language',
      'Describe why defects found late usually cost more to fix',
      'Write both positive and negative tests for a simple feature',
      'Describe what a tester actually does during a normal working day'
    ],
    body: [
      { t: 'p', html: 'Software is written by people, under deadlines, from requirements that are never perfectly clear. Mistakes are normal. <b>Software testing</b> is the set of activities that examine a product — running it, and also reviewing its requirements, designs and code — to <b>find defects, reduce the risk of failure and give people reliable information about quality</b>. Testing does not add quality by itself. It shows the team the current state of the product so they can act on it.' },
      { t: 'cards', items: [
        { title: 'Find defects', html: 'Discover problems before real users, customers or partners run into them.' },
        { title: 'Build confidence', html: 'Collect <b>evidence</b> that important behaviour works, not just a feeling that it probably does.' },
        { title: 'Inform decisions', html: 'Tell the people who decide on a release what passed, what failed and what was <b>not</b> tested.' },
        { title: 'Prevent defects', html: 'Reviewing a requirement early stops a wrong idea from ever becoming wrong code.' },
        { title: 'Meet obligations', html: 'Show that legal, contractual, accessibility or industry rules are satisfied.' }
      ] },
      { t: 'h', text: 'Why late defects cost more' },
      { t: 'p', html: 'A defect is cheapest to fix close to where it was introduced. A wrong rule caught while reading a user story costs a short conversation and an edited sentence. The same wrong rule caught in production means debugging, a code fix, a rebuild, retesting, a hotfix release, support calls, repairing bad data and sometimes refunds or lost customers. More steps and more people are involved at every later stage.' },
      { t: 'table', caption: 'Illustrative only — real effort varies widely by product and team', head: ['Where the defect is found', 'What fixing it involves', 'Typical effort'], rows: [
        ['Requirement review', 'Clarify with the product owner and edit the story', 'Minutes'],
        ['Developer’s own unit tests', 'Change the code and rerun fast tests', 'Minutes to hours'],
        ['System testing', 'Report, debug, fix, rebuild, retest and run regression', 'Hours to days'],
        ['Production', 'Incident, hotfix, data repair, customer support, lost trust', 'Days, plus damage you cannot undo']
      ] },
      { t: 'callout', tone: 'warn', title: 'Be careful with famous multipliers', html: 'You will hear claims such as “a bug costs 100× more in production”. The <b>trend</b> is widely accepted, but exact multipliers come from old, specific studies and vary hugely between projects. In an interview, explain the <b>reason</b> — more rework, more people, real users affected — instead of quoting a number you cannot back up.' },
      { t: 'h', text: 'How software fails in the real world' },
      { t: 'list', items: [
        'Two components disagree on <b>units</b> (one sends imperial, the other expects metric) and a calculation is silently wrong.',
        'Old code is <b>reused</b> in a new context where a number grows larger than its variable can hold, causing an overflow.',
        'A <b>race condition</b> appears only when an operator types faster than the designers expected.',
        'A faulty <b>deployment or configuration</b> switches on dead code, and wrong transactions run for minutes before anyone notices.',
        '<b>Dates and money</b> go wrong: leap years, time zones, daylight saving changes and rounding of currency values.'
      ] },
      { t: 'p', html: 'Notice that many of these were not “hard” bugs to find — they were cases nobody thought to check. Good testers ask <i>what if?</i> and look at the edges: other units, bigger numbers, faster users, different configurations, unusual dates.' },
      { t: 'h', text: 'Positive and negative tests' },
      { t: 'compare', a: { title: 'Positive tests', items: ['Use <b>valid</b> input and the expected path', 'Prove the feature does what it should', 'Example: log in with a registered email and correct password → dashboard opens'] }, b: { title: 'Negative tests', items: ['Use <b>invalid</b> input or unexpected actions', 'Prove the system fails safely, with a clear message and no damage', 'Example: wrong password → “Email or password is incorrect”, no login, attempt counted'] } },
      { t: 'callout', tone: 'key', title: 'What testers actually do all day', html: 'Join the daily stand-up · read new stories and ask questions about acceptance criteria · design test cases and exploratory charters · prepare test data and environments · execute tests and explore · log defects with evidence · retest fixes and run regression · automate checks that repeat · report status honestly, including what was <b>not</b> covered. Testers rarely decide whether to release — they make sure the person who decides is well informed.' }
    ],
    example: {
      title: 'Worked example: first tests for the PeopleOps login',
      blocks: [
        { t: 'p', html: '<b>Requirement:</b> “Employees log in with their work email and password. After <b>5</b> failed attempts the account is locked for <b>15 minutes</b>.” Before testing, write each test with its expected result.' },
        { t: 'table', head: ['Test', 'Type', 'Expected result'], rows: [
          ['Registered email + correct password', 'Positive', 'Dashboard opens; user name shown'],
          ['Registered email + wrong password', 'Negative', 'Generic error that does not reveal which field was wrong; no login'],
          ['5 wrong passwords, then the correct one', 'Negative', 'Account locked message; correct password rejected until 15 minutes pass'],
          ['Email typed in capitals (ANA@PEOPLEOPS.TEST)', 'Positive (edge)', 'Question for the PO: are emails case-insensitive? Record the answer'],
          ['Both fields empty', 'Negative', 'Validation message; the server also rejects an empty request']
        ] },
        { t: 'p', html: 'Suppose the lockout test fails: the 6th attempt with the correct password logs in. The tester reports it with steps and evidence and explains the impact — attackers could keep guessing passwords. Whether to delay the release is a product decision, but now it is an <b>informed</b> one.' }
      ]
    },
    explain: {
      'ur': 'Software testing کا مطلب ہے software کو جانچنا تاکہ users سے پہلے ہم خود مسائل (defects) ڈھونڈ لیں، اور team کو صحیح معلومات دیں کہ product کتنا تیار ہے۔ Testing یہ ثابت نہیں کرتی کہ کوئی bug نہیں ہے، بلکہ یہ بتاتی ہے کہ کہاں مسئلہ ہے اور کیا ابھی test نہیں ہوا۔ جتنی جلدی bug پکڑا جائے، اتنا سستا ٹھیک ہوتا ہے: requirement میں ایک جملہ بدلنا آسان ہے، لیکن production میں وہی غلطی hotfix، data کی درستی اور users کی ناراضی بن جاتی ہے۔ مثال: login form پر صحیح email اور password سے login ہونا <b>positive test</b> ہے، جبکہ غلط password پر واضح error آنا <b>negative test</b> ہے۔ دونوں ضروری ہیں۔',
      'ur-Latn': 'Software testing ka matlab hai software ko check karna taake users se pehle hum khud masle (defects) dhoond lein, aur team ko sahi information dein ke product kitna ready hai. Testing yeh saabit nahi karti ke koi bug nahi hai; yeh batati hai ke kahan problem hai aur kya abhi test nahi hua. Jitni jaldi bug pakra jaye, utna sasta theek hota hai: requirement mein ek line badalna aasaan hai, lekin production mein wohi ghalti hotfix, data repair aur users ki narazgi ban jaati hai. Misaal: login form par sahi email aur password se login hona <b>positive test</b> hai, jab ke ghalat password par saaf error aana <b>negative test</b> hai. Dono zaroori hain.',
      'hi': 'Software testing का मतलब है software को जाँचना ताकि users से पहले हम खुद समस्याएँ (defects) ढूँढ लें, और team को सही जानकारी दें कि product कितना तैयार है। Testing यह साबित नहीं करती कि कोई bug नहीं है; यह बताती है कि कहाँ समस्या है और क्या अभी test नहीं हुआ। जितनी जल्दी bug पकड़ा जाए, उतना सस्ता ठीक होता है: requirement में एक लाइन बदलना आसान है, लेकिन production में वही गलती hotfix, data सुधार और users की नाराज़गी बन जाती है। उदाहरण: login form पर सही email और password से login होना <b>positive test</b> है, जबकि गलत password पर साफ़ error आना <b>negative test</b> है। दोनों ज़रूरी हैं।',
      'ar': 'اختبار البرمجيات (software testing) يعني فحص البرنامج لنكتشف المشكلات (defects) قبل أن يكتشفها المستخدمون، ولنعطي الفريق معلومات صحيحة عن مدى جاهزية المنتج. الاختبار لا يثبت أن البرنامج خالٍ من الأخطاء، بل يوضح أين توجد المشكلات وما الذي لم يُختبر بعد. كلما اكتُشف الخطأ مبكرًا كان إصلاحه أرخص: تعديل جملة في المتطلبات سهل، أما الخطأ نفسه في بيئة الإنتاج فيتحول إلى إصلاح عاجل وتصحيح بيانات واستياء المستخدمين. مثال: تسجيل الدخول ببريد وكلمة مرور صحيحين هو <b>اختبار إيجابي</b> (positive test)، وظهور رسالة خطأ واضحة عند إدخال كلمة مرور خاطئة هو <b>اختبار سلبي</b> (negative test). وكلاهما ضروري.',
      'es': 'Probar software (software testing) significa examinar un producto para encontrar defectos antes que los usuarios y dar al equipo información fiable sobre lo listo que está. Las pruebas no demuestran que no haya errores; muestran dónde hay problemas y qué falta por probar. Cuanto antes se detecta un defecto, más barato es corregirlo: cambiar una frase en un requisito es fácil, pero el mismo error en producción se convierte en un parche urgente, reparación de datos y clientes molestos. Ejemplo: iniciar sesión con un correo y una contraseña correctos es una <b>prueba positiva</b>; comprobar que una contraseña incorrecta muestra un error claro es una <b>prueba negativa</b>. Ambas son necesarias.'
    },
    keyTerms: [
      { term: 'Software testing', def: 'Activities that examine a product and its work products to find defects, reduce risk and provide information about quality.' },
      { term: 'Defect (bug)', def: 'A flaw in a work product, such as code or a requirement, that can make the system behave incorrectly.' },
      { term: 'Positive test', def: 'A test with valid input along the expected path, checking that the feature does what it should.' },
      { term: 'Negative test', def: 'A test with invalid input or unexpected actions, checking that the system rejects them safely and clearly.' },
      { term: 'Expected result', def: 'The behaviour the requirement says should happen, written down before the test is run.' }
    ],
    practice: [
      { q: 'PayLite lets users transfer <b>1 to 50,000 PKR</b>, and only if the balance is sufficient. Write two positive and three negative tests, each with an expected result.', hint: 'Think about valid amounts, the limits, the balance and odd input.', answer: '<b>Positive:</b> transfer 1,000 PKR with a 5,000 balance → success, balance becomes 4,000; transfer exactly 50,000 with enough balance → success. <b>Negative:</b> 0 PKR → “Enter an amount from 1 to 50,000”, nothing sent; 50,001 → same limit message; 3,000 with a 2,000 balance → “Insufficient balance”, no money moves. Text such as “abc” or a negative number are good extra negatives.' },
      { q: 'A manager says, “Developers can test their own code, so why do we need testers?” Give a short, balanced reply.', answer: 'Developers <b>should</b> test their own code — unit tests catch many defects cheaply. But authors share the assumptions that caused their mistakes, so an independent view finds different problems: misunderstood requirements, integration issues, usability and end-to-end flows. Testers also provide release information: what was covered, what failed and what risk remains.' },
      { q: 'During story refinement you notice the ShopFlow coupon story never says whether coupons can be combined. Why is raising it now cheaper than finding it in production?', answer: 'Now it costs one question and an edited acceptance criterion. In production it could mean customers stacking discounts, lost revenue, an emergency fix, retesting, a hotfix release, customer support and possibly honouring wrong prices. The later the stage, the more people and rework are involved.' },
      { q: 'Your manager asks, “Is the build bug-free?” How do you answer honestly?', hint: 'Testing shows presence, not absence.', answer: 'I cannot prove it is bug-free — testing can only show defects that exist. I can say what I tested (for example 42 of 45 planned cases, all critical flows), what passed and failed, which bugs are open with their severity, what I did <b>not</b> test, and the remaining risk. Then the release decision is an informed one.' }
    ],
    quiz: [
      { q: 'What is the main purpose of software testing?', options: ['To prove that the software contains no remaining defects', 'To find defects and give information about quality and risk', 'To fix defects in the code before the product is released', 'To check that developers have followed the project schedule'], correct: 1,
        why: ['Testing can show that defects are present, never that none remain.', 'Right — testing finds problems and gives decision-makers reliable information.', 'Fixing (debugging) is a development activity; testing finds and reports.', 'Schedule tracking is project management, not the purpose of testing.'] },
      { q: 'ShopFlow has a coupon field at checkout. Which of these is a negative test?', options: ['Apply valid code SAVE10 to an eligible cart', 'Apply SAVE10 and check the order total drops by exactly 10%', 'Apply SAVE10, remove it and check the total resets', 'Apply an expired code and check a clear error shows'], correct: 3,
        why: ['A valid code on an eligible cart is the expected path — a positive test.', 'Checking the correct discount is still a positive test.', 'Removing a valid code is a normal action, so this is also positive.', 'Right — invalid input (an expired code) must be rejected safely and clearly.'] },
      { q: 'Why does a defect found in production usually cost more than one found in a requirement review?', options: ['More rework and people, and real users are affected', 'Hosting providers charge extra for changing live code', 'Defects found late are always more severe by nature', 'Production fixes must be written in a different language'], correct: 0,
        why: ['Right — a late fix adds debugging, retesting, releasing, support and repair work.', 'Hosting cost is not the reason; the effort and impact are.', 'Severity depends on impact, not on when the defect is found.', 'The same codebase and language are used; the extra cost is rework and impact.'] },
      { q: 'The release manager asks if you can ship today. Two low-severity bugs are open, and the payment flow was not tested because its environment was down. What is the best response?', options: ['Yes — every executed test passed except two minor bugs', 'No — a product must never be released with open bugs', 'Share what passed, the open bugs and that payments are untested', 'Release now and run the payment tests in production afterwards'], correct: 2,
        why: ['Hiding the untested payment flow gives a false picture of risk.', 'Releasing with known low-severity bugs is common; it is a business decision.', 'Right — give the facts, including gaps, so the decision-maker can weigh the risk.', 'Testing payments on real customers is not a substitute for testing before release.'] },
      { q: 'Which statement about negative testing is true?', options: ['It is only needed once all positive tests have passed', 'It checks that the system handles invalid input safely', 'It means writing tests that are designed to always fail', 'It means testing without reading any of the requirements'], correct: 1,
        why: ['Negative tests are planned alongside positive ones, not only afterwards.', 'Right — the test passes when the system rejects bad input clearly and without damage.', 'A negative test passes when the system behaves correctly with bad input.', 'Negative tests still come from requirements, such as limits and error rules.'] }
    ],
    interview: [
      { q: 'Why is software testing important?', a: 'Because people make mistakes, and some of those mistakes become defects that can cost money, data, reputation or even safety. Testing finds defects early, when they are cheaper to fix, and gives the team <b>evidence</b> about quality instead of guesses. Just as important, it informs decisions: I tell the product owner what passed, what failed, what I did not cover and what risk remains, so a release decision is made with open eyes. I also add value before code exists by reviewing requirements and asking questions.' },
      { q: 'What is the difference between positive and negative testing? Give an example.', a: 'Positive testing uses valid input along the expected path to confirm the feature works — for example, logging in with a registered email and the correct password opens the dashboard. Negative testing uses invalid input or unexpected actions to confirm the system fails <b>safely</b> — a wrong password shows a generic error, does not log in and counts toward lockout. A good test set needs both, because many real failures come from input nobody expected.' }
    ],
    takeaways: [
      'Testing finds defects and provides information; it does not add quality by itself.',
      'Defects get more expensive the later they are found — explain why, not a magic number.',
      'Write positive and negative tests, each with an expected result.',
      'Testers inform release decisions; they report what was <b>not</b> tested too.'
    ],
    links: { labs: ['login', 'bughunt'], challenges: ['peopleops-login'], interview: ['m1'] }
  },
  {
    id: 'fd-qa-qc-testing',
    n: 2,
    level: 'beginner',
    title: 'QA, QC and testing: the tester’s role and mindset',
    summary: 'Tell QA, QC and testing apart, describe the mindset that makes testers effective, and compare QA Analyst, QA Engineer and SDET roles.',
    minutes: 13,
    objectives: [
      'Distinguish quality assurance, quality control and testing with examples',
      'Describe the habits of a good tester: curiosity, skepticism, empathy and evidence',
      'Compare the QA Analyst, QA Engineer and SDET roles',
      'Work with developers and product owners without blame'
    ],
    body: [
      { t: 'p', html: 'Job titles use “QA” for almost everything, but the terms mean different things. <b>Quality assurance (QA)</b> is about the <b>process</b>: setting up ways of working that prevent defects. <b>Quality control (QC)</b> is about the <b>product</b>: examining what was built to detect defects. <b>Testing</b> is the main form of QC — running the software and reviewing its work products to find problems and provide information.' },
      { t: 'table', head: ['Aspect', 'Quality assurance (QA)', 'Quality control (QC)', 'Testing'], rows: [
        ['Focus', 'Process', 'Product', 'Product behaviour and work products'],
        ['Goal', '<b>Prevent</b> defects', '<b>Detect</b> defects', 'Find defects and give information'],
        ['Examples', 'Review checklists, coding standards, Definition of Done, retrospectives, training', 'Release checklists, inspecting deliverables, testing', 'Running test cases, exploratory sessions, reviewing a user story'],
        ['Owned by', 'The whole team, often guided by QA', 'Testers, reviewers and developers', 'Testers, developers, users in UAT']
      ] },
      { t: 'callout', tone: 'key', title: 'A kitchen analogy', html: 'In a restaurant, hygiene rules, tested recipes and staff training are <b>QA</b> — they make good food more likely. Tasting each dish before it leaves the kitchen is <b>QC</b>. The specific act of tasting is the <b>testing</b>. A great kitchen needs both: rules alone cannot catch a salty soup, and tasting alone cannot fix a bad recipe.' },
      { t: 'h', text: 'The tester’s mindset' },
      { t: 'cards', items: [
        { title: 'Curiosity', html: 'Keep asking “what if?” — what if the user goes back, loses signal, pastes emoji, or opens two tabs?' },
        { title: 'Healthy skepticism', html: 'Ask for evidence before believing “it works”. Skeptical about the <b>product</b>, never cynical about <b>people</b>.' },
        { title: 'User empathy', html: 'Think like a first-time user, a hurried user, an older user, or someone using a screen reader.' },
        { title: 'Evidence over assumption', html: 'Steps, screenshots, logs and exact data — not “I think it broke”.' },
        { title: 'Risk focus', html: 'Time is always limited, so test what matters most first.' },
        { title: 'Clear, neutral communication', html: 'Describe what the <b>system</b> does, not what a person did wrong.' }
      ] },
      { t: 'p', html: 'A developer’s main question is “how do I make this work?”. A tester’s question is “how could this fail, and who would it hurt?”. Developers can and should test their own code, but every author has blind spots: they share the same assumptions that caused the mistake. An independent tester brings a different set of assumptions, which is why independence finds different defects.' },
      { t: 'h', text: 'Common QA job titles' },
      { t: 'table', head: ['Role', 'Typical focus', 'Core skills', 'Typical outputs'], rows: [
        ['<b>QA Analyst</b> / manual tester', 'Requirements analysis, test design, exploratory testing, UAT support', 'Test techniques, domain knowledge, bug reporting, basic SQL', 'Test cases, charters, bug reports, test summaries'],
        ['<b>QA Engineer</b>', 'A mix of manual testing, automation, API testing and process improvement', 'Test design plus scripting, API tools, CI basics', 'Automated checks, test plans, quality metrics'],
        ['<b>SDET</b> (Software Development Engineer in Test)', 'Builds test frameworks, tooling and code-level tests', 'Strong programming, design patterns, CI/CD', 'Frameworks, utilities, pipelines, large automated suites']
      ] },
      { t: 'callout', tone: 'info', title: 'Titles vary between companies', html: 'One company’s “QA Engineer” is another’s “SDET” or “Test Analyst”. Read the responsibilities in the job description, not just the title, and grow the skills on both sides: test thinking and coding.' },
      { t: 'h', text: 'Working with developers and the product owner' },
      { t: 'p', html: 'With <b>developers</b>, share findings early and informally, reproduce tricky issues together and ask how a change might affect other areas. With the <b>product owner</b>, clarify acceptance criteria, point out ambiguities and give honest risk information — <b>priority</b> is their business call, while <b>severity</b> is your assessment of impact. With the <b>whole team</b>, remember that quality is shared: testers bring a testing perspective, but nobody “owns” all the bugs or is the only safety net.' },
      { t: 'compare', a: { title: 'Gatekeeper habits (avoid)', items: ['Wait until the end and then “find all the bugs”', 'Write bug titles like “Login broken again!!”', 'Treat the bug count as a score against developers', 'Decide alone that the release must stop'] }, b: { title: 'Collaborative habits (aim for)', items: ['Join refinement and ask “how will we test this?” early', 'Write neutral, reproducible reports with evidence', 'Pair with the developer to reproduce tricky issues', 'Give the product owner clear risk information to decide'] } }
    ],
    example: {
      title: 'Worked example: QA, QC or testing in a MediBook story',
      blocks: [
        { t: 'p', html: 'The product owner writes: “Patients can cancel appointments.” Over one sprint, the team does the following. Classify each activity.' },
        { t: 'table', head: ['Activity', 'Category', 'Why'], rows: [
          ['Team agrees every story must list error and edge cases before it enters a sprint', 'QA', 'A process rule that prevents vague stories'],
          ['Tester asks: “Until when can a patient cancel? Is there a fee? Who is notified?”', 'Testing (static) — part of QC', 'A review of the story that finds missing requirements'],
          ['Tester cancels 25 hours and 2 hours before the slot and checks the fee rules', 'Testing (dynamic) — part of QC', 'Running the product to detect defects'],
          ['Retrospective: three bugs came from missing time-zone rules, so the story template gains a time-zone line', 'QA', 'Improving the process using evidence from QC']
        ] },
        { t: 'p', html: 'Notice the loop: QC finds problems in the product, and QA uses those findings to improve the process, so the same kind of defect becomes less likely next time.' }
      ]
    },
    explain: {
      'ur': 'QA، QC اور testing ملتے جلتے لگتے ہیں لیکن ان میں فرق ہے۔ <b>QA</b> process پر توجہ دیتا ہے تاکہ defects پیدا ہی نہ ہوں، جیسے ہر user story کا review لازمی کرنا۔ <b>QC</b> بنے ہوئے product کو جانچتا ہے تاکہ defects پکڑے جائیں۔ <b>Testing</b> QC کا سب سے اہم حصہ ہے: test cases چلانا، exploratory testing کرنا اور requirements کا review کرنا۔ مثال: restaurant میں صفائی کے اصول اور recipe بنانا QA ہے، اور کھانا باہر جانے سے پہلے چکھنا QC ہے۔ ایک اچھا tester متجسس ہوتا ہے، “اگر ایسا ہو تو کیا ہوگا؟” پوچھتا ہے، user کی جگہ سوچتا ہے، اور ہر بات ثبوت (screenshots، logs) کے ساتھ کرتا ہے، الزام کے ساتھ نہیں۔',
      'ur-Latn': 'QA, QC aur testing milte julte lagte hain lekin in mein farq hai. <b>QA</b> process par focus karta hai taake defects paida hi na hon, jaise har user story ka review lazmi karna. <b>QC</b> banay hue product ko check karta hai taake defects pakre jayein. <b>Testing</b> QC ka sab se ahem hissa hai: test cases chalana, exploratory testing karna aur requirements review karna. Misaal: restaurant mein safai ke usool aur recipe banana QA hai, aur khana bahar jaane se pehle chakhna QC hai. Acha tester curious hota hai, “agar aisa ho to kya hoga?” poochta hai, user ki jagah soch kar dekhta hai, aur har baat saboot (screenshots, logs) ke saath karta hai, ilzaam ke saath nahi.',
      'hi': 'QA, QC और testing मिलते-जुलते लगते हैं, लेकिन इनमें फ़र्क है। <b>QA</b> process पर ध्यान देता है ताकि defects पैदा ही न हों, जैसे हर user story का review ज़रूरी करना। <b>QC</b> बने हुए product को जाँचता है ताकि defects पकड़े जाएँ। <b>Testing</b> QC का सबसे अहम हिस्सा है: test cases चलाना, exploratory testing करना और requirements का review करना। उदाहरण: restaurant में सफ़ाई के नियम और recipe बनाना QA है, और खाना बाहर जाने से पहले चखना QC है। अच्छा tester जिज्ञासु होता है, “अगर ऐसा हो तो क्या होगा?” पूछता है, user की जगह सोचता है, और हर बात सबूत (screenshots, logs) के साथ रखता है, आरोप के साथ नहीं।',
      'ar': 'تبدو مصطلحات QA وQC والاختبار متشابهة، لكن بينها فرقًا واضحًا. <b>ضمان الجودة (QA)</b> يركّز على العملية لمنع ظهور العيوب أصلًا، مثل جعل مراجعة كل قصة مستخدم (user story) إلزامية. <b>ضبط الجودة (QC)</b> يفحص المنتج نفسه لاكتشاف العيوب. و<b>الاختبار</b> هو أهم أشكال ضبط الجودة: تنفيذ حالات الاختبار، والاختبار الاستكشافي، ومراجعة المتطلبات. مثال: في المطعم، وضع قواعد النظافة والوصفات هو QA، وتذوّق الطبق قبل خروجه من المطبخ هو QC. المختبِر الجيد فضولي، يسأل «ماذا لو…؟»، ويفكر كالمستخدم، ويقدّم كل ملاحظة مع دليل مثل لقطات الشاشة والسجلات، لا مع اتهام.',
      'es': 'QA, QC y testing parecen lo mismo, pero no lo son. El <b>aseguramiento de la calidad (QA)</b> se centra en el proceso para prevenir defectos, por ejemplo exigir que cada historia de usuario se revise. El <b>control de calidad (QC)</b> examina el producto para detectar defectos. Y las <b>pruebas</b> son la forma principal de QC: ejecutar casos de prueba, hacer pruebas exploratorias y revisar requisitos. Ejemplo: en un restaurante, definir normas de higiene y recetas es QA; probar el plato antes de que salga de la cocina es QC. Un buen tester es curioso, pregunta «¿y si…?», piensa como el usuario y presenta cada hallazgo con evidencias (capturas, logs), nunca con culpas.'
    },
    keyTerms: [
      { term: 'Quality assurance (QA)', def: 'Process-focused activities that aim to prevent defects, such as standards, reviews, checklists and process improvement.' },
      { term: 'Quality control (QC)', def: 'Product-focused activities that detect defects in what was built; testing is the main form of QC.' },
      { term: 'SDET', def: 'Software Development Engineer in Test: a role centred on coding test frameworks, tools and automated checks.' },
      { term: 'Independence of testing', def: 'Testing by someone other than the author, who brings different assumptions and so finds different defects.' },
      { term: 'Tester mindset', def: 'Curiosity, healthy skepticism, user empathy and reliance on evidence, combined with neutral communication.' }
    ],
    practice: [
      { q: 'Label each as QA, QC or both: (1) adding a code-review rule for every pull request, (2) running a regression suite on a release candidate, (3) a retrospective that changes the story template, (4) reviewing a user story for missing rules.', answer: '(1) <b>QA</b> — a process rule. (2) <b>QC</b> — testing the product. (3) <b>QA</b> — process improvement. (4) <b>QC</b> (static testing of a work product) — and it also feeds QA when the findings improve how stories are written.' },
      { q: 'Rewrite this bug title in a neutral, useful way: “Dev broke the checkout AGAIN!!!”', hint: 'Describe the system behaviour, the condition and the impact.', answer: 'For example: “Checkout: <b>Place order</b> button does nothing on Safari 17 when a saved card is selected.” It names the area, the behaviour, the condition and avoids blame. The body adds steps, expected vs actual, build and evidence.' },
      { q: 'Read this job ad and name the closest title: “Design a Playwright framework in TypeScript, add it to the CI pipeline, mentor developers on writing unit tests, review pull requests.”', answer: 'Closest to an <b>SDET</b> (or an automation-heavy QA Engineer): the work is mainly building test code and tooling. A QA Analyst role would centre on requirements analysis, test design, exploratory testing and UAT support.' }
    ],
    quiz: [
      { q: 'Which activity is quality assurance (QA) rather than quality control (QC)?', options: ['Executing the regression suite on a release candidate', 'Logging a defect found during exploratory testing', 'Introducing a peer-review rule for every user story', 'Checking a finished build against the release checklist'], correct: 2,
        why: ['Running tests on the product detects defects — that is QC.', 'Finding and reporting a defect in the product is QC.', 'Right — a process rule that aims to prevent defects is QA.', 'Inspecting the product against criteria is QC.'] },
      { q: 'What does “healthy skepticism” mean for a tester?', options: ['Asking for evidence before accepting that something works', 'Assuming that developers’ code is usually wrong until proven right', 'Refusing to sign off until every bug is fixed', 'Ignoring requirements whenever they are unclear'], correct: 0,
        why: ['Right — be skeptical of claims about the product and look for evidence.', 'That is cynicism about people, which damages collaboration.', 'Release decisions weigh risk; zero open bugs is rarely the rule.', 'Unclear requirements should be clarified, not ignored.'] },
      { q: 'A developer comments “works on my machine” on your bug. What is the best next step?', options: ['Close the bug because the developer could not reproduce it', 'Tell the manager that the developer is ignoring bugs', 'Reopen the bug with the severity raised to critical', 'Compare environment, data and steps together with evidence'], correct: 3,
        why: ['A failed reproduction is not proof that the bug is gone.', 'Escalating before comparing facts damages trust and solves nothing.', 'Severity reflects impact; raising it to force attention is misuse.', 'Right — differences in browser, data, build or steps usually explain it.'] },
      { q: 'A job ad says: “Build and maintain a TypeScript test framework, integrate it into CI, and review developers’ unit tests.” Which title fits best?', options: ['Manual QA Analyst', 'SDET', 'Business Analyst', 'Scrum Master'], correct: 1,
        why: ['A manual analyst focuses on test design and execution, not framework code.', 'Right — building test frameworks and tooling is the core of an SDET role.', 'A business analyst gathers and documents requirements.', 'A Scrum Master coaches the team on Scrum and removes impediments.'] },
      { q: 'Why is independent testing valuable even when developers test their own code?', options: ['Authors have blind spots about their own assumptions', 'Developers are not allowed to write tests in Agile', 'Independent testers fix defects faster than developers', 'Only independent testers are able to use test tools'], correct: 0,
        why: ['Right — a different person brings different assumptions and finds different defects.', 'Developers are expected to write tests, especially unit tests.', 'Testers report defects; developers usually fix them.', 'Anyone on the team can use test tools.'] }
    ],
    interview: [
      { q: 'What is the difference between QA and QC?', a: 'QA is <b>process-oriented and preventive</b>: it sets up ways of working that make defects less likely — review rules, coding standards, a Definition of Done, retrospectives. QC is <b>product-oriented and detective</b>: it examines what was built to find defects, and testing is its main form. For example, adding “every story lists error cases” to our Definition of Ready is QA; running test cases on the cancellation feature is QC. They feed each other: QC findings show QA where the process needs improving.' },
      { q: 'What qualities make a good tester?', a: 'Curiosity to ask “what if?”, healthy skepticism that asks for evidence, and empathy for different users. Good testers rely on evidence — steps, data, logs — rather than assumptions, and they communicate neutrally, describing what the system does rather than blaming people. They also think about risk, because time is always limited. For example, before testing a payment feature I ask which failures would hurt users most and test those first.' }
    ],
    takeaways: [
      'QA improves the process to prevent defects; QC examines the product to detect them.',
      'Testing is the main form of QC and includes reviewing work products, not only running code.',
      'Good testers are curious, skeptical about claims, empathetic to users and driven by evidence.',
      'QA Analyst, QA Engineer and SDET differ mainly in how much they build test code — titles vary.',
      'Collaborate early and report neutrally; quality belongs to the whole team.'
    ],
    links: { labs: ['bughunt'], challenges: ['bug-report'], interview: ['m4', 'm2'] }
  },
  {
    id: 'fd-error-defect-failure',
    n: 3,
    level: 'beginner',
    title: 'Error, defect, failure and the seven testing principles',
    summary: 'Trace a problem from human error to visible failure, separate root causes from symptoms, and apply the seven testing principles to real decisions.',
    minutes: 16,
    objectives: [
      'Explain the chain from error to defect to failure with an example',
      'Separate a root cause from the symptom you observed',
      'State the seven testing principles and apply each one to a situation',
      'Recognise when a failed test is caused by the test, its data or the environment'
    ],
    body: [
      { t: 'p', html: 'A person makes an <b>error</b> (a mistake): they misread a requirement, forget a case or type the wrong operator. The error can introduce a <b>defect</b> — also called a bug or fault — into a work product such as code, a requirement, a design or even a test script. When the defective part is executed under the right conditions, the system may produce a <b>failure</b>: behaviour you can observe that differs from what was expected.' },
      { t: 'flow', caption: 'From mistake to visible problem — and back to the real fix', steps: ['Human error', 'Defect in a work product', 'Defective part executes', 'Failure observed', 'Root cause fixed'] },
      { t: 'table', head: ['Term', 'What it is', 'ShopFlow example'], rows: [
        ['<b>Error</b> (mistake)', 'A human action that produces a wrong result', 'A developer reads “10% off orders over $100” as “over $10”'],
        ['<b>Defect</b> (bug, fault)', 'A flaw in a work product', 'The code contains <code>if (subtotal &gt; 10)</code>'],
        ['<b>Failure</b>', 'The system deviates from expected behaviour while running', 'A customer with a $15 cart receives the discount'],
        ['<b>Root cause</b>', 'The underlying reason the error was made', 'The story said “over 100” with no currency or examples, and nobody reviewed it']
      ] },
      { t: 'callout', tone: 'info', title: 'Three things beginners miss', html: 'Not every defect causes a failure — a bug in code that never runs can hide for years. Some failures have <b>no code defect</b> at all: a full disk, an expired certificate or a wrong configuration value can do it. And defects live in requirements, designs and tests too, not only in code.' },
      { t: 'h', text: 'Root cause vs symptom' },
      { t: 'p', html: 'The failure is a <b>symptom</b>. Patching only the symptom — say, blocking the discount for $15 carts — leaves the cause in place. Root cause analysis keeps asking “why?”: Why was the discount applied? The condition was wrong. Why? The developer misread the rule. Why? The rule had no examples and was never reviewed. Fixing that root cause — acceptance criteria with examples, plus a quick review — prevents a whole family of similar defects, not just this one.' },
      { t: 'h', text: 'The seven testing principles' },
      { t: 'table', caption: 'The seven principles as described in the ISTQB Foundation syllabus', head: ['Principle', 'What it means', 'What you do about it'], rows: [
        ['1. Testing shows the <b>presence</b> of defects, not their absence', 'Passing tests reduce risk but cannot prove the software is defect-free', 'Report what was tested and what risk remains; never promise “bug-free”'],
        ['2. <b>Exhaustive testing</b> is impossible', 'Apart from trivial cases, you cannot test every input, path and state combination', 'Use risk, priorities and techniques such as partitions and boundaries to choose tests'],
        ['3. <b>Early testing</b> saves time and money', 'Defects removed early do not grow into more defects later', 'Review requirements and designs; test as soon as anything exists'],
        ['4. <b>Defects cluster</b> together', 'A small number of components usually holds most of the defects', 'Use defect history to focus extra testing on known hot spots'],
        ['5. <b>Tests wear out</b> (the pesticide paradox)', 'Repeating the same tests finds fewer and fewer new defects', 'Refresh tests and data, add exploratory testing — while keeping regression checks'],
        ['6. Testing is <b>context dependent</b>', 'A medical device is not tested like a marketing website', 'Fit depth, techniques and documentation to the risk and domain'],
        ['7. <b>Absence-of-defects fallacy</b>', 'Software with few defects can still fail if it does not meet user needs', 'Validate against real needs, not only against the specification']
      ] },
      { t: 'callout', tone: 'tip', title: 'About the 80/20 rule', html: 'Defect clustering is often compared with the Pareto principle (“80% of defects in 20% of modules”). Treat that ratio as an illustration, not a law — the real distribution depends on the product. The useful habit is simply: <b>where bugs were found, look for more</b>.' },
      { t: 'h', text: 'When a failed test is not a product bug' },
      { t: 'list', items: [
        '<b>Test defect</b> — wrong expected result, outdated steps, a broken locator in an automated script.',
        '<b>Test data problem</b> — the account is locked, the coupon expired, the record was deleted by another test.',
        '<b>Environment problem</b> — a service is down, the wrong build is deployed, a configuration value differs.',
        '<b>Timing</b> — the test checks before the page or the data is ready (a flaky test).',
        '<b>Product defect</b> — only after ruling out the above with evidence do you report it as a bug.'
      ] },
      { t: 'callout', tone: 'key', title: 'False positives and false negatives', html: 'A <b>false positive</b> is a test that reports a failure when the product is fine — it wastes time and erodes trust in the suite. A <b>false negative</b> is a test that passes even though a defect exists — more dangerous, because nobody investigates a green result.' }
    ],
    example: {
      title: 'Worked example: a red test in PayLite',
      blocks: [
        { t: 'p', html: 'An automated test “transfer 500 PKR” fails: expected sender balance <b>4,500</b>, actual <b>5,000</b>. Before reporting a bug, the tester investigates step by step.' },
        { t: 'table', head: ['Question', 'Finding'], rows: [
          ['Is the expected result right?', 'Yes — the requirement says the balance drops by the amount sent'],
          ['Is the test data valid?', 'Yes — sender had 5,000 PKR, receiver account active'],
          ['Was the environment healthy?', '<b>No</b> — logs show the payment service returned <code>503</code> during the run'],
          ['Re-run with the service healthy', 'Passes — balance becomes 4,500'],
          ['What did the user see during the outage?', 'The app showed “Transfer successful” although no money moved']
        ] },
        { t: 'p', html: 'The red result was an <b>environment problem</b>, not a transfer-logic bug. But the investigation revealed a real defect: the app reports success when the backend fails. The tester logs that as a separate bug with the 503 evidence. In chain terms: the <b>error</b> was assuming the call always succeeds, the <b>defect</b> is missing error handling, and the <b>failure</b> is a false success message.' }
      ]
    },
    explain: {
      'ur': 'جب کوئی انسان غلطی کرتا ہے تو اسے <b>error</b> کہتے ہیں، مثلاً developer نے requirement غلط سمجھی۔ اس غلطی سے code یا document میں جو خامی آ جاتی ہے وہ <b>defect</b> (bug) ہے۔ جب وہ خراب code چلتا ہے اور system غلط کام کرتا ہے تو وہ <b>failure</b> ہے، جو user کو نظر آتی ہے۔ مثال: requirement تھی کہ 100 ڈالر سے زیادہ پر 10% discount ملے، developer نے 10 لکھ دیا (error سے defect)، اور 15 ڈالر کی cart کو بھی discount مل گیا (failure)۔ یاد رکھیں: testing دکھاتی ہے کہ bugs موجود ہیں، یہ ثابت نہیں کرتی کہ بالکل نہیں ہیں؛ ہر combination test کرنا ناممکن ہے؛ اور test کا fail ہونا ہمیشہ product bug نہیں ہوتا، وجہ test data یا environment بھی ہو سکتی ہے۔',
      'ur-Latn': 'Jab koi insaan ghalti karta hai to usay <b>error</b> kehte hain, maslan developer ne requirement ghalat samjhi. Is ghalti se code ya document mein jo khaami aa jaati hai woh <b>defect</b> (bug) hai. Jab woh kharab code chalta hai aur system ghalat kaam karta hai to woh <b>failure</b> hai, jo user ko nazar aati hai. Misaal: requirement thi ke 100 dollar se zyada par 10% discount mile, developer ne 10 likh diya (error se defect), aur 15 dollar ki cart ko bhi discount mil gaya (failure). Yaad rakhein: testing dikhati hai ke bugs maujood hain, yeh saabit nahi karti ke bilkul nahi hain; har combination test karna na-mumkin hai; aur test ka fail hona hamesha product bug nahi hota, wajah test data ya environment bhi ho sakti hai.',
      'hi': 'जब कोई इंसान गलती करता है तो उसे <b>error</b> कहते हैं, जैसे developer ने requirement गलत समझी। इस गलती से code या document में जो खामी आ जाती है, वह <b>defect</b> (bug) है। जब वह खराब code चलता है और system गलत काम करता है, तो वह <b>failure</b> है, जो user को दिखाई देती है। उदाहरण: requirement थी कि 100 डॉलर से ज़्यादा पर 10% discount मिले, developer ने 10 लिख दिया (error से defect), और 15 डॉलर की cart को भी discount मिल गया (failure)। याद रखें: testing दिखाती है कि bugs मौजूद हैं, यह साबित नहीं करती कि बिल्कुल नहीं हैं; हर combination test करना असंभव है; और test का fail होना हमेशा product bug नहीं होता, कारण test data या environment भी हो सकता है।',
      'ar': 'عندما يرتكب شخص خطأً بشريًا نسمّيه <b>error</b>، مثل أن يفهم المطوّر أحد المتطلبات فهمًا خاطئًا. هذا الخطأ قد يُدخل عيبًا في الشيفرة أو في وثيقة، ويُسمّى <b>defect</b> أو bug. وعندما يُنفَّذ الجزء المعيب ويتصرّف النظام بشكل غير صحيح يراه المستخدم، فهذا <b>failure</b> أي إخفاق. مثال: المتطلب يقول خصم 10% على الطلبات التي تزيد على 100 دولار، فكتب المطوّر 10 بدل 100، فحصلت سلة قيمتها 15 دولارًا على الخصم. وتذكّر: الاختبار يُظهر وجود العيوب ولا يثبت غيابها، والاختبار الشامل لكل الاحتمالات مستحيل، وفشل الاختبار لا يعني دائمًا عيبًا في المنتج، فقد يكون السبب بيانات الاختبار أو البيئة.',
      'es': 'Cuando una persona se equivoca, eso es un <b>error</b>: por ejemplo, un desarrollador entiende mal un requisito. Ese error puede introducir un <b>defecto</b> (bug) en el código o en un documento. Cuando la parte defectuosa se ejecuta y el sistema se comporta mal de forma visible, ocurre una <b>falla</b> (failure). Ejemplo: el requisito dice 10% de descuento en pedidos de más de 100 dólares, el desarrollador escribe 10, y un carrito de 15 dólares recibe el descuento. Recuerda: las pruebas muestran la presencia de defectos, no su ausencia; probarlo todo es imposible; y una prueba fallida no siempre es un bug del producto, porque la causa puede estar en los datos de prueba o en el entorno.'
    },
    keyTerms: [
      { term: 'Error (mistake)', def: 'A human action that produces an incorrect result, such as misreading a requirement.' },
      { term: 'Defect (bug, fault)', def: 'A flaw in a work product — code, requirement, design or test — that can cause a failure.' },
      { term: 'Failure', def: 'An observable event where the system does not do what is expected.' },
      { term: 'Root cause', def: 'The underlying reason a problem happened; fixing it prevents similar defects.' },
      { term: 'Pesticide paradox', def: 'Repeating the same tests finds fewer new defects over time; also called “tests wear out”.' },
      { term: 'False positive', def: 'A test result that reports a failure when the product is actually working correctly.' }
    ],
    practice: [
      { q: 'Label each as error, defect or failure: (a) a business analyst writes “password 8–16 characters” when the security policy says 8–64; (b) the sign-up code rejects passwords longer than 16 characters; (c) a user with a 20-character password from a password manager cannot create an account.', answer: '(a) <b>Error</b> — the human mistake. (b) <b>Defect</b> — the flaw in the code (and also in the requirement document). (c) <b>Failure</b> — the observed wrong behaviour. A likely root cause: requirements are not checked against the security policy during review.' },
      { q: 'A team has run the same 300 regression tests for two years. They always pass, but customers keep finding bugs in newer features. Which principle applies, and what would you change?', hint: 'Think about what repeated tests stop finding.', answer: '<b>Tests wear out</b> (pesticide paradox). Keep the regression suite for its value, but add new tests for new and changed features, vary test data, review old tests for relevance and add exploratory sessions in areas where customers report bugs (which also uses <b>defect clustering</b>).' },
      { q: 'A manager says: “We tested every possible input for the sign-up form.” The form has a name field (up to 50 characters), a country dropdown (195 options) and a date of birth. How do you respond?', answer: 'Kindly point out that <b>exhaustive testing is impossible</b>: 195 countries × thousands of dates × an almost unlimited number of possible names is far too many combinations. Instead explain what <i>was</i> covered using partitions and boundaries (e.g. 0, 1, 50, 51 characters, a leap-day birth date, under-age and over-age dates) and what risk remains.' },
      { q: 'An automated test fails in CI only at night and passes when re-run in the morning. List four causes to check before reporting a product bug.', answer: 'For example: (1) a nightly job or another test changes or deletes the test data; (2) a dependent service is restarted or under maintenance at night; (3) time-related logic — date change at midnight, time zone or daylight saving; (4) timing or slowness causing a flaky wait; (5) a different build deployed. Note that (3) could still be a real product defect — gather evidence first.' }
    ],
    quiz: [
      { q: 'A developer types “less than” where the rule needed “less than or equal to”. In ISTQB terms, what is the typing mistake itself?', options: ['A failure', 'A defect', 'A root cause', 'An error'], correct: 3,
        why: ['A failure is the observed wrong behaviour when the code runs.', 'The defect is the wrong operator that ends up in the code — the result of the mistake.', 'The root cause is why the mistake happened, such as an unclear rule.', 'Right — the human action that produced a wrong result is the error.'] },
      { q: 'A defect sits in a rarely used export function that nobody has run in two years. Which statement is true?', options: ['It is not a defect because no failure has occurred', 'It is a defect that has not yet caused a failure', 'It is a failure because the code itself is wrong', 'It is only an error because a human wrote it'], correct: 1,
        why: ['A defect exists in the work product whether or not it has been triggered.', 'Right — defects cause failures only when the faulty part executes.', 'A failure is observed behaviour at runtime; wrong code alone is a defect.', 'The error was the human mistake; the flaw left in the code is the defect.'] },
      { q: 'The same 200 regression tests have passed for months, yet users keep reporting bugs in new features. Which principle explains this best?', options: ['Defects cluster together', 'Exhaustive testing is impossible in practice', 'Tests wear out (pesticide paradox)', 'The absence-of-defects fallacy'], correct: 2,
        why: ['Clustering is about defects concentrating in a few areas, not about stale tests.', 'True in general, but it does not explain why the same tests stop finding bugs.', 'Right — repeated tests stop finding new defects; new tests and exploration are needed.', 'That fallacy is about building the wrong thing, not about tests missing bugs.'] },
      { q: 'A product passes almost every test against its specification, but users reject it because it does not solve their problem. Which principle is this?', options: ['Absence-of-defects fallacy', 'Testing is context dependent', 'Early testing saves time and money', 'Testing shows the presence of defects'], correct: 0,
        why: ['Right — few defects against the spec does not mean the product meets user needs.', 'Context matters, but the core issue here is meeting real needs.', 'Early testing might have helped, but it does not name this situation.', 'That principle is about what passing tests can prove, not about wrong products.'] },
      { q: 'An automated checkout test fails in CI. The screenshot shows “Coupon expired” for the coupon the test uses. What should you check first?', options: ['Report a defect in the coupon logic right away', 'Rewrite the locators in the test script', 'Whether the test data coupon has really expired', 'Whether the network in the CI environment was down'], correct: 2,
        why: ['Possible, but report only after confirming the coupon should still be valid.', 'The page loaded and showed a message, so locators are not the obvious problem.', 'Right — expired test data is the most likely cause; if the coupon is still valid, then it is a product bug.', 'The app responded with a clear message, so a network outage is unlikely.'] }
    ],
    interview: [
      { q: 'Explain error, defect and failure with an example.', a: 'An <b>error</b> is a human mistake — for example, a developer misreads “discount over $100” as “over $10”. That creates a <b>defect</b> in the code: the condition checks 10 instead of 100. When a customer with a $15 cart checks out, the defect executes and we see a <b>failure</b>: an unexpected discount. Not every defect causes a failure — only when that code runs under those conditions. For prevention, I look at the root cause, such as a requirement without examples that nobody reviewed.' },
      { q: 'Your automated test failed. Does that mean there is a bug in the product?', a: 'Not necessarily. A failed test tells me something differs from the expectation. I check, with evidence: is the expected result still correct for the requirement? Is the test data valid? Was the environment healthy and the right build deployed? Is it a timing or locator issue? I re-run in isolation and read logs and screenshots. If the product really behaves wrongly, I report the bug with that evidence. If not, I fix the test, data or environment, because false failures erode trust in the suite.' }
    ],
    takeaways: [
      'Error (human mistake) → defect (flaw in a work product) → failure (observed wrong behaviour).',
      'Fix root causes, not just symptoms, to prevent whole families of defects.',
      'Testing shows presence, not absence; exhaustive testing is impossible; test early.',
      'Defects cluster, tests wear out, context matters, and few defects ≠ the right product.',
      'A red test can be a test, data or environment problem — investigate before reporting.'
    ],
    links: { labs: ['bughunt'], challenges: ['bug-report'], interview: ['m2', 'm4'] }
  },
  {
    id: 'fd-sdlc-models',
    n: 4,
    level: 'beginner',
    title: 'SDLC models: Waterfall, V-model, iterative and Agile',
    summary: 'Compare the main software development life cycle models and explain where testing fits, how early it starts and what each model means for a tester.',
    minutes: 15,
    objectives: [
      'Name the common SDLC activities and what each one produces',
      'Explain where testing happens in Waterfall, V-model, iterative and Agile models',
      'Map each V-model development stage to its matching test level',
      'Weigh the trade-offs of each model for a given project context'
    ],
    body: [
      { t: 'p', html: 'A <b>software development life cycle (SDLC)</b> model describes how a team moves from an idea to working software and then keeps it running. Most models contain the same activities — requirements, design, implementation, testing, deployment and maintenance — but they differ in the <b>order</b>, how often the activities <b>repeat</b> and how early <b>feedback</b> arrives. For a tester, the model decides when you can start, what you test against and how often you test.' },
      { t: 'flow', caption: 'Typical SDLC activities — Waterfall runs them once, in order', steps: ['Requirements', 'Design', 'Implementation', 'Testing', 'Deployment', 'Maintenance'] },
      { t: 'h', text: 'Waterfall' },
      { t: 'p', html: 'In <b>Waterfall</b>, each phase finishes, usually with a sign-off, before the next begins. Testing is a separate phase after coding. It works when requirements are stable and well understood, or when a contract fixes the scope. The weakness is <b>late feedback</b>: a misunderstood requirement may survive design and coding and only show up in the test phase — or with users. Even here, a tester adds value early by reviewing requirements and designing tests during the design phase.' },
      { t: 'h', text: 'V-model' },
      { t: 'p', html: 'The <b>V-model</b> extends Waterfall by pairing every development stage on the left with a test level on the right. Test planning and design for each level start as soon as the matching document exists, so testers review requirements while they are still cheap to change. Coding sits at the bottom of the V; testing climbs back up the right side.' },
      { t: 'table', caption: 'V-model: each left-side stage has a matching test level', head: ['Development stage (left)', 'Test level (right)', 'Tested against'], rows: [
        ['Business / user requirements', '<b>Acceptance testing</b>', 'User needs and business processes'],
        ['System requirements (specification)', '<b>System testing</b>', 'Functional and non-functional specification'],
        ['Architecture / high-level design', '<b>Integration testing</b>', 'Interfaces and interactions between components'],
        ['Detailed / module design', '<b>Unit (component) testing</b>', 'The design of each individual component']
      ] },
      { t: 'p', html: 'These test levels are not tied to Waterfall. Agile teams also do unit, integration, system and acceptance testing — they simply do them continuously, in small slices, inside each iteration instead of in long separate phases. Knowing the pairs helps you answer “what should this level be tested <b>against</b>?” in any model.' },
      { t: 'h', text: 'Iterative, incremental and Agile' },
      { t: 'p', html: '<b>Iterative and incremental</b> models build the system in repeated cycles, each delivering a working piece; the <b>Spiral</b> model, for example, adds an explicit risk analysis to every cycle. Each iteration includes testing of the new increment <b>plus regression</b> of earlier ones, so the regression load keeps growing — automation becomes important. <b>Agile</b> approaches such as Scrum and Kanban push this further: short iterations (in Scrum, sprints of one month or less, often two weeks), close collaboration, working software and welcoming change. Testing happens continuously inside each iteration, and the whole team owns quality.' },
      { t: 'table', head: ['Model', 'Where testing fits', 'Strengths', 'Weaknesses'], rows: [
        ['Waterfall', 'A separate phase after coding', 'Predictable, well documented, suits stable requirements', 'Late feedback; changes are costly'],
        ['V-model', 'A test level for each development stage; test design starts early', 'Early test planning, clear traceability', 'Still rigid; working software arrives late'],
        ['Iterative / incremental', 'In every iteration, plus regression of earlier increments', 'Early working parts; risks reduced step by step', 'Growing regression load; needs a sound architecture'],
        ['Agile', 'Continuously in every sprint, by the whole team', 'Fast feedback; adapts to change', 'Lighter documentation; needs discipline and automation']
      ] },
      { t: 'callout', tone: 'info', title: 'DevOps and continuous delivery', html: '<b>DevOps</b> extends Agile collaboration into operations. With <b>continuous integration (CI)</b>, every change is merged and built with automated tests. With <b>continuous delivery</b>, every change is kept in a releasable state and released when the business decides. With <b>continuous deployment</b>, every change that passes the pipeline goes to production automatically. Testing becomes a pipeline of automated checks plus monitoring in production.' },
      { t: 'callout', tone: 'key', title: 'One principle in every model', html: 'Whatever the model, <b>start testing activities early</b>: review requirements, ask how something will be tested before it is built, and design tests while the information is fresh. The model changes <i>when</i> code arrives — not the value of early questions.' }
    ],
    example: {
      title: 'Worked example: one feature in three models',
      blocks: [
        { t: 'p', html: '<b>Feature:</b> MediBook sends an SMS reminder 24 hours before each appointment.' },
        { t: 'table', head: ['Model', 'When the tester first sees it', 'What the tester does'], rows: [
          ['Waterfall', 'In the requirements document, months before any code', 'Reviews the requirement, writes test cases during design, executes them in the test phase'],
          ['V-model', 'When system requirements are signed off', 'Designs system tests from the spec (time zones, cancellations) and integration tests with the SMS gateway from the architecture'],
          ['Agile (Scrum)', 'At backlog refinement of the user story', 'Asks about time zones, opt-out and rescheduling; agrees acceptance criteria; tests in the same sprint; adds an automated regression check']
        ] },
        { t: 'p', html: 'The risks do not change between models — time zones, rescheduled appointments, an SMS provider outage. What changes is <b>when</b> they are discovered and therefore how cheaply they are fixed.' }
      ]
    },
    explain: {
      'ur': 'SDLC model بتاتا ہے کہ team ایک idea سے چلتے ہوئے software تک کیسے پہنچتی ہے۔ <b>Waterfall</b> میں سارے phases ایک کے بعد ایک ہوتے ہیں اور testing code مکمل ہونے کے بعد آتی ہے، اس لیے غلطیاں دیر سے پکڑی جاتی ہیں۔ <b>V-model</b> میں ہر development stage کے ساتھ ایک test level جڑا ہوتا ہے: requirements کے ساتھ acceptance testing، system specification کے ساتھ system testing، architecture کے ساتھ integration testing، اور module design کے ساتھ unit testing۔ <b>Agile</b> میں کام چھوٹے sprints میں ہوتا ہے اور testing ہر sprint میں ساتھ ساتھ چلتی ہے۔ مثال: SMS reminder والے feature پر Agile tester پہلے ہی دن پوچھ سکتا ہے کہ مختلف time zone میں reminder کب جائے گا۔',
      'ur-Latn': 'SDLC model batata hai ke team ek idea se chalte hue software tak kaise pohanchti hai. <b>Waterfall</b> mein saare phases ek ke baad ek hote hain aur testing code mukammal hone ke baad aati hai, is liye ghaltiyan der se pakri jaati hain. <b>V-model</b> mein har development stage ke saath ek test level jura hota hai: requirements ke saath acceptance testing, system specification ke saath system testing, architecture ke saath integration testing, aur module design ke saath unit testing. <b>Agile</b> mein kaam chhote sprints mein hota hai aur testing har sprint mein saath saath chalti hai. Misaal: SMS reminder wale feature par Agile tester pehle hi din pooch sakta hai ke mukhtalif time zone mein reminder kab jayega.',
      'hi': 'SDLC model बताता है कि team एक idea से चलते हुए software तक कैसे पहुँचती है। <b>Waterfall</b> में सारे phases एक के बाद एक होते हैं और testing code पूरा होने के बाद आती है, इसलिए गलतियाँ देर से पकड़ी जाती हैं। <b>V-model</b> में हर development stage के साथ एक test level जुड़ा होता है: requirements के साथ acceptance testing, system specification के साथ system testing, architecture के साथ integration testing, और module design के साथ unit testing। <b>Agile</b> में काम छोटे sprints में होता है और testing हर sprint में साथ-साथ चलती है। उदाहरण: SMS reminder वाले feature पर Agile tester पहले ही दिन पूछ सकता है कि अलग time zone में reminder कब जाएगा।',
      'ar': 'نموذج دورة حياة تطوير البرمجيات (SDLC) يصف كيف ينتقل الفريق من فكرة إلى برنامج يعمل. في نموذج <b>الشلال (Waterfall)</b> تأتي المراحل واحدة تلو الأخرى، ويأتي الاختبار بعد اكتمال البرمجة، لذلك تُكتشف الأخطاء متأخرة. في <b>نموذج V</b> ترتبط كل مرحلة تطوير بمستوى اختبار مقابل: المتطلبات مع اختبار القبول، ومواصفات النظام مع اختبار النظام، والتصميم المعماري مع اختبار التكامل، وتصميم الوحدات مع اختبار الوحدة. أما في <b>Agile</b> فيتم العمل في دورات قصيرة (sprints) ويجري الاختبار باستمرار داخل كل دورة. مثال: في ميزة تذكير المواعيد عبر الرسائل القصيرة، يستطيع المختبِر في Agile أن يسأل من اليوم الأول: متى يُرسل التذكير إذا اختلفت المنطقة الزمنية؟',
      'es': 'Un modelo de ciclo de vida de desarrollo (SDLC) describe cómo un equipo pasa de una idea a un software que funciona. En <b>Waterfall</b> (cascada) las fases van una tras otra y las pruebas llegan después de programar, así que los errores se descubren tarde. En el <b>modelo V</b> cada etapa de desarrollo tiene un nivel de prueba asociado: requisitos con pruebas de aceptación, especificación del sistema con pruebas de sistema, arquitectura con pruebas de integración y diseño de módulos con pruebas unitarias. En <b>Agile</b> se trabaja en sprints cortos y se prueba de forma continua dentro de cada uno. Ejemplo: con una función de recordatorio por SMS, un tester ágil puede preguntar desde el primer día qué pasa con las distintas zonas horarias.'
    },
    keyTerms: [
      { term: 'SDLC', def: 'Software development life cycle: the activities and their order used to build, release and maintain software.' },
      { term: 'Waterfall', def: 'A sequential model where each phase is completed before the next begins; testing follows coding.' },
      { term: 'V-model', def: 'A sequential model that pairs each development stage with a test level and starts test design early.' },
      { term: 'Iterative / incremental', def: 'Building software in repeated cycles, each adding a working, tested piece to what already exists.' },
      { term: 'Continuous delivery', def: 'Keeping every change in a releasable state so the business can release at any time.' }
    ],
    practice: [
      { q: 'For a PeopleOps leave-request feature, name the V-model test level for each check: (a) the API call from the leave service to payroll; (b) one function that counts leave days excluding weekends; (c) HR staff approving requests in a realistic workflow; (d) the full system against its specification, including response time.', answer: '(a) <b>Integration testing</b> — the interface between components. (b) <b>Unit (component) testing</b>. (c) <b>Acceptance testing</b> (UAT) — against business needs. (d) <b>System testing</b> — the whole system against the specification, functional and non-functional.' },
      { q: 'A government tax project has fixed, regulated requirements, a fixed-scope contract and must produce audit documents. Which model fits, and what should the tester do early?', hint: 'Stable requirements and traceability matter here.', answer: 'A <b>V-model</b> (or Waterfall) fits: requirements are stable and traceability is needed for audits. The tester should review requirements and specifications as soon as they exist, design tests for each level in parallel and keep a traceability matrix from requirements to tests.' },
      { q: 'You join a Waterfall project during the design phase — no code exists yet. What useful testing work can you do now?', answer: 'Static testing: review the requirements and designs for ambiguity, gaps and contradictions. Write the test plan, identify risks, design test cases and test data from the requirements, plan the test environment and build a traceability matrix. All of this shortens the later test phase and catches defects early.' },
      { q: 'A start-up’s requirements change every week and users want to try early versions. Which model fits, and what changes for the tester?', answer: '<b>Agile</b> (iterative and incremental). The tester joins refinement, helps write acceptance criteria, tests stories within the same sprint, relies on exploratory testing for new features and builds automated regression checks, because every sprint adds to what must keep working.' }
    ],
    quiz: [
      { q: 'In the V-model, which test level is paired with the architecture or high-level design?', options: ['Integration testing', 'User acceptance testing', 'Unit testing', 'System testing'], correct: 0,
        why: ['Right — the architecture defines components and interfaces, which integration testing checks.', 'Acceptance testing pairs with business or user requirements.', 'Unit testing pairs with detailed or module design.', 'System testing pairs with the system requirements specification.'] },
      { q: 'In a Waterfall project, the test phase reveals that a core requirement was misunderstood. Why is this especially costly?', options: ['Waterfall projects do not allow bug reports at all', 'Testers are not permitted to read requirements in Waterfall projects', 'Design and code were already built on the wrong requirement', 'Waterfall forbids any change once coding has started'], correct: 2,
        why: ['Bug reports are a normal part of the Waterfall test phase.', 'Testers can and should review requirements early in any model.', 'Right — the mistake has flowed through design and code, so much work must be redone.', 'Changes are possible through change control; they are just expensive.'] },
      { q: 'What is a key difference between the V-model and plain Waterfall?', options: ['The V-model skips the requirements phase entirely', 'The V-model designs tests alongside each development stage', 'The V-model releases a working product to users every two weeks', 'The V-model removes the need for system testing'], correct: 1,
        why: ['The V-model starts from requirements, like Waterfall.', 'Right — each left-side stage has a test level whose planning starts early.', 'Frequent working releases describe iterative and Agile models.', 'System testing is one of the V-model’s test levels.'] },
      { q: 'A start-up’s requirements change every week, and users want to try early versions. Which approach fits best?', options: ['Waterfall with full sign-off of every phase', 'A V-model with detailed specifications up front', 'One big-bang release after six months of development work', 'Agile with short iterations and frequent feedback'], correct: 3,
        why: ['Sign-offs make weekly changes slow and costly.', 'Detailed up-front specs would be outdated within weeks.', 'Users would wait months and feedback would come very late.', 'Right — short iterations deliver working software and absorb change.'] },
      { q: 'What is the difference between continuous delivery and continuous deployment?', options: ['They are two names for exactly the same practice', 'Continuous delivery skips automated tests to save time', 'Continuous deployment needs manual approval every time', 'Delivery keeps changes releasable; deployment ships them automatically'], correct: 3,
        why: ['They differ in whether the final release step is automatic.', 'Both rely heavily on automated tests in the pipeline.', 'That describes continuous delivery; continuous deployment releases automatically.', 'Right — delivery releases when the business decides; deployment releases every passing change.'] }
    ],
    interview: [
      { q: 'How does testing differ between Waterfall and Agile?', a: 'In Waterfall, testing is mostly a <b>separate phase after coding</b>, driven by a detailed test plan and documented test cases; feedback arrives late, so requirement defects are expensive. In Agile, testing is <b>continuous inside each sprint</b>: testers join refinement, help define acceptance criteria, test stories as they are built, explore new features and grow automated regression because each sprint adds features. Documentation is lighter, and quality is a whole-team responsibility. In both, I review requirements early — that principle does not change.' },
      { q: 'Explain the V-model.', a: 'The V-model is a sequential model where each development stage on the left has a matching test level on the right: <b>requirements ↔ acceptance testing</b>, <b>system specification ↔ system testing</b>, <b>architecture ↔ integration testing</b> and <b>detailed design ↔ unit testing</b>, with coding at the bottom. Its strength is that test planning and design start as soon as each document exists, which finds defects early and gives clear traceability. Its weakness is rigidity: working software still arrives late.' }
    ],
    takeaways: [
      'SDLC models differ in order, repetition and how early feedback arrives.',
      'Waterfall tests after coding; the V-model pairs each stage with a test level and designs tests early.',
      'V-model pairs: requirements–acceptance, specification–system, architecture–integration, design–unit.',
      'Iterative and Agile models test every increment and need growing regression and automation.',
      'Continuous delivery keeps changes releasable; continuous deployment releases them automatically.'
    ],
    links: { interview: ['m6'] }
  },
  {
    id: 'fd-stlc',
    n: 5,
    level: 'beginner',
    title: 'The software testing life cycle (STLC)',
    summary: 'Walk through the six STLC phases with their entry criteria, exit criteria and deliverables, and see how the same cycle runs inside every sprint.',
    minutes: 15,
    objectives: [
      'Name the six STLC phases in order and the purpose of each',
      'Write entry and exit criteria for a testing phase',
      'List the main deliverable that each phase produces',
      'Explain how the STLC runs in small loops inside an Agile sprint'
    ],
    body: [
      { t: 'p', html: 'The <b>software testing life cycle (STLC)</b> is the sequence of activities a team follows to test a product in an organised way. It runs alongside the development life cycle: while developers design and build, testers analyse, plan and prepare. Each phase has <b>entry criteria</b> (what must be ready to start), activities, <b>deliverables</b> and <b>exit criteria</b> (what must be true to finish). Names vary — the ISTQB syllabus describes planning, monitoring and control, analysis, design, implementation, execution and completion — but the ideas are the same.' },
      { t: 'flow', caption: 'The six STLC phases as commonly taught', steps: ['Requirement analysis', 'Test planning', 'Test case design', 'Environment setup', 'Test execution', 'Test closure'] },
      { t: 'table', head: ['Phase', 'Key activities', 'Main deliverables'], rows: [
        ['<b>Requirement analysis</b>', 'Study requirements, identify what is testable, ask questions, agree scope, judge what could be automated', 'Clarification log, list of testable requirements, first version of the traceability matrix'],
        ['<b>Test planning</b>', 'Define scope, approach, schedule, people, environments, risks, entry and exit criteria; estimate effort', 'Test plan, effort estimate'],
        ['<b>Test case design</b>', 'Write test cases, scripts or charters using test techniques; prepare test data; review them', 'Reviewed test cases, test data, updated traceability matrix'],
        ['<b>Environment setup</b>', 'Prepare servers, builds, configuration, accounts and tools; run a smoke test on the environment', 'Ready environment, smoke test result'],
        ['<b>Test execution</b>', 'Run tests, record results, report defects, retest fixes, run regression', 'Execution results, defect reports, daily status'],
        ['<b>Test closure</b>', 'Check exit criteria, summarise results, record lessons learned, archive testware', 'Test summary (closure) report, lessons learned']
      ] },
      { t: 'callout', tone: 'info', title: 'Phases overlap in real life', html: 'Environment setup often runs in parallel with test case design, because another team (such as DevOps) prepares it. Execution may start on one feature while design continues on another. The order shows <b>dependencies</b>, not a strict calendar.' },
      { t: 'h', text: 'Entry and exit criteria' },
      { t: 'p', html: '<b>Entry criteria</b> stop you from wasting effort — there is no point executing tests on a build that does not start. <b>Exit criteria</b> stop you from finishing too early or testing forever: they make “done” objective. Both are agreed during planning. In Agile teams, entry criteria for a story are often called a <b>Definition of Ready</b> and exit criteria a <b>Definition of Done</b>.' },
      { t: 'compare', a: { title: 'Entry criteria for test execution', items: ['The build is deployed and the smoke test passes', 'Test cases are written and reviewed', 'Test data and user accounts are ready', 'The environment is stable and testers have access'] }, b: { title: 'Exit criteria for test execution', items: ['All planned high-priority tests have been executed', 'No open critical or high-severity defects, unless the product owner accepts them', 'Every acceptance criterion has at least one passing test', 'Remaining risks are documented and shared'] } },
      { t: 'callout', tone: 'warn', title: 'Exit criteria are not “zero bugs”', html: 'Releasing with known low-severity defects is normal when the business accepts the risk. If exit criteria are <b>not</b> met, the tester reports exactly what is missing and why. Stakeholders may still decide to release — that is their call, but it should be made with the risk stated clearly.' },
      { t: 'h', text: 'The traceability matrix' },
      { t: 'p', html: 'A <b>requirements traceability matrix (RTM)</b> links each requirement to its test cases, their latest results and any related defects. It answers three practical questions: Is every requirement covered by at least one test? Which tests must I update or re-run when a requirement changes? Which requirements are affected by open bugs? It starts in requirement analysis and is filled in during design and execution.' },
      { t: 'h', text: 'The STLC inside a sprint' },
      { t: 'table', caption: 'A two-week Scrum sprint seen through STLC phases', head: ['Sprint moment', 'STLC phase', 'Tester activity'], rows: [
        ['Backlog refinement', 'Requirement analysis', 'Ask questions, add acceptance criteria and concrete examples'],
        ['Sprint planning', 'Test planning (light)', 'Estimate testing tasks, flag risks, agree test data needs'],
        ['First days of the sprint', 'Design and environment setup', 'Write test ideas and charters, prepare data, automate alongside development'],
        ['As each story is finished', 'Execution', 'Test the story, explore, log and retest bugs, run regression'],
        ['Sprint review and retrospective', 'Closure', 'Share coverage and known issues, suggest process improvements']
      ] },
      { t: 'callout', tone: 'key', title: 'Agile does not delete the STLC', html: 'In Agile the same phases run in <b>small loops</b> — per story and per sprint — with lighter documents. You still analyse, plan, design, prepare, execute and close; you just do it every few days instead of once per project.' }
    ],
    example: {
      title: 'Worked example: exit criteria on release day',
      blocks: [
        { t: 'p', html: 'ShopFlow release 4.2 adds a “Save for later” feature. On day 9 of a 10-day test cycle, the tester checks the agreed criteria.' },
        { t: 'table', head: ['Criterion', 'Type', 'Status on day 9'], rows: [
          ['Build 4.2.0-rc1 deployed to staging and smoke test passes', 'Entry (execution)', 'Met'],
          ['All 50 planned critical tests executed', 'Exit', '48 of 50 — two blocked by a payment sandbox outage'],
          ['No open critical or high-severity defects', 'Exit', '<b>Not met</b> — saved items disappear after logout on iOS (high)'],
          ['Every acceptance criterion traced to a passing test', 'Exit', '11 of 12'],
          ['Test summary report sent to the product owner', 'Exit', 'Pending']
        ] },
        { t: 'p', html: 'Exit criteria are not met. The tester does not quietly “pass” the cycle, and does not decide alone to block the release. The report lists the blocked tests and why, the open high bug with its user impact, and options: fix and retest the iOS bug, run the two blocked tests when the sandbox returns, or release with “Save for later” hidden behind a feature flag. The product owner decides.' }
      ]
    },
    explain: {
      'ur': 'STLC یعنی software testing life cycle، testing کا کام ترتیب سے کرنے کا طریقہ ہے۔ اس کے چھ مراحل ہیں: requirement analysis (requirements سمجھنا اور سوال پوچھنا)، test planning (scope، وقت اور طریقہ طے کرنا)، test case design، test environment setup، test execution (tests چلانا اور bugs report کرنا)، اور test closure (summary report اور سیکھے گئے سبق)۔ ہر مرحلے کے <b>entry criteria</b> ہوتے ہیں، یعنی شروع کرنے سے پہلے کیا تیار ہونا چاہیے، اور <b>exit criteria</b>، یعنی کب کہا جائے کہ کام مکمل ہوا۔ مثال: اگر نئی build پر login page ہی نہیں کھلتا تو execution کے entry criteria پورے نہیں ہوئے۔ Agile میں یہی cycle ہر sprint میں چھوٹے پیمانے پر چلتا ہے۔',
      'ur-Latn': 'STLC yani software testing life cycle, testing ka kaam tarteeb se karne ka tareeqa hai. Is ke chhe marahil hain: requirement analysis (requirements samajhna aur sawal poochna), test planning (scope, waqt aur tareeqa tay karna), test case design, test environment setup, test execution (tests chalana aur bugs report karna), aur test closure (summary report aur seekhe gaye sabaq). Har marhale ke <b>entry criteria</b> hote hain, yani shuru karne se pehle kya ready hona chahiye, aur <b>exit criteria</b>, yani kab kaha jaye ke kaam mukammal hua. Misaal: agar nayi build par login page hi nahi khulta to execution ke entry criteria poore nahi hue. Agile mein yehi cycle har sprint mein chhote paimane par chalta hai.',
      'hi': 'STLC यानी software testing life cycle, testing का काम क्रम से करने का तरीका है। इसके छह चरण हैं: requirement analysis (requirements समझना और सवाल पूछना), test planning (scope, समय और तरीका तय करना), test case design, test environment setup, test execution (tests चलाना और bugs report करना), और test closure (summary report और सीखे गए सबक)। हर चरण के <b>entry criteria</b> होते हैं, यानी शुरू करने से पहले क्या तैयार होना चाहिए, और <b>exit criteria</b>, यानी कब कहा जाए कि काम पूरा हुआ। उदाहरण: अगर नई build पर login page ही नहीं खुलता, तो execution के entry criteria पूरे नहीं हुए। Agile में यही cycle हर sprint में छोटे स्तर पर चलता है।',
      'ar': 'دورة حياة اختبار البرمجيات (STLC) هي طريقة منظّمة لتنفيذ أعمال الاختبار خطوة بخطوة. لها ست مراحل: تحليل المتطلبات وطرح الأسئلة، ثم تخطيط الاختبار (النطاق والوقت والأسلوب)، ثم تصميم حالات الاختبار، ثم تجهيز بيئة الاختبار، ثم تنفيذ الاختبارات والإبلاغ عن العيوب، وأخيرًا إغلاق الاختبار بتقرير ملخّص والدروس المستفادة. لكل مرحلة <b>معايير دخول</b> (entry criteria) تحدد ما يجب أن يكون جاهزًا قبل البدء، و<b>معايير خروج</b> (exit criteria) تحدد متى نعتبر العمل مكتملًا. مثال: إذا كانت صفحة تسجيل الدخول لا تفتح في النسخة الجديدة، فمعايير الدخول للتنفيذ غير متحققة. وفي Agile تتكرر الدورة نفسها بحجم صغير داخل كل sprint.',
      'es': 'El ciclo de vida de las pruebas (STLC) es una forma ordenada de organizar el trabajo de testing. Tiene seis fases: análisis de requisitos (entenderlos y hacer preguntas), planificación (alcance, tiempos y enfoque), diseño de casos de prueba, preparación del entorno, ejecución (ejecutar pruebas y reportar defectos) y cierre (informe resumen y lecciones aprendidas). Cada fase tiene <b>criterios de entrada</b>, lo que debe estar listo para empezar, y <b>criterios de salida</b>, lo que debe cumplirse para darla por terminada. Ejemplo: si en la nueva build ni siquiera abre la página de login, no se cumplen los criterios de entrada para ejecutar. En Agile, el mismo ciclo se repite en pequeño dentro de cada sprint.'
    },
    keyTerms: [
      { term: 'STLC', def: 'Software testing life cycle: the ordered testing activities from requirement analysis to test closure.' },
      { term: 'Entry criteria', def: 'Conditions that must be met before a test activity starts, such as a deployed build that passes a smoke test.' },
      { term: 'Exit criteria', def: 'Agreed conditions that must be met to consider a test activity finished, such as coverage reached and no open critical defects.' },
      { term: 'Traceability matrix (RTM)', def: 'A table linking requirements to test cases, results and defects, used to check coverage and the impact of changes.' },
      { term: 'Test summary report', def: 'A closure document summarising what was tested, results, open defects, deviations and remaining risk.' }
    ],
    practice: [
      { q: 'Name the STLC phase that produces each deliverable: (a) the test plan; (b) the first version of the traceability matrix; (c) the environment smoke test result; (d) defect reports; (e) lessons learned.', answer: '(a) <b>Test planning</b>; (b) <b>Requirement analysis</b>; (c) <b>Environment setup</b>; (d) <b>Test execution</b>; (e) <b>Test closure</b>.' },
      { q: 'Write three entry criteria for executing tests on a new MediBook booking API.', hint: 'What would make execution a waste of time if it were missing?', answer: 'For example: (1) the API build is deployed to the test environment and a health-check or smoke request succeeds; (2) the API contract or specification is available and test cases are reviewed; (3) test data exists — doctors, time slots and patient accounts — and testers have valid credentials. Others: dependent services (SMS, payments) are available or stubbed.' },
      { q: 'A password-rule requirement changes halfway through the test cycle. How does the traceability matrix help?', answer: 'Find the requirement row and you immediately see every linked test case: those need updating, and any already executed must be re-run. You can also see linked defects that may no longer apply. Without an RTM you would search test cases by hand and probably miss some.' },
      { q: 'On release day, one exit criterion is not met: a high-severity defect is still open. What do you do?', answer: 'Report it clearly to the product owner or release manager: the defect, its user impact, how often it occurs and any workaround, plus options (fix and retest, hide the feature, release with a known issue and monitoring). Do not quietly mark the cycle as passed, and do not decide alone — the business decides with the risk stated.' }
    ],
    quiz: [
      { q: 'Which STLC phase produces the test plan?', options: ['Requirement analysis', 'Test planning', 'Test case design', 'Test closure'], correct: 1,
        why: ['Requirement analysis produces questions, testable requirements and the first RTM.', 'Right — scope, approach, schedule, resources and criteria are set in test planning.', 'Design produces test cases and test data, guided by the plan.', 'Closure produces the summary report and lessons learned.'] },
      { q: 'What is the purpose of exit criteria?', options: ['To define objectively when a test activity is finished', 'To decide which tester gets assigned each test case', 'To list the conditions needed before testing starts', 'To record every defect found during test execution'], correct: 0,
        why: ['Right — exit criteria make “done” measurable instead of a feeling.', 'Assigning work is part of planning, not what exit criteria are for.', 'That describes entry criteria.', 'Defects are recorded in defect reports, not in exit criteria.'] },
      { q: 'A new build arrives, but the login page returns a server error on staging. Test execution was planned to start today. What should happen?', options: ['Start running every test that does not need a login', 'Log a separate defect for each of the 40 blocked tests', 'Mark all the planned test cases as failed for today', 'Report that entry criteria are unmet and raise the blocker'], correct: 3,
        why: ['Testing a build that fails its smoke test usually wastes effort and gives misleading results.', 'One blocking defect is enough; 40 duplicates add noise.', 'The tests were not executed, so they are blocked, not failed.', 'Right — the build is not testable; report the blocker so a fixed build can be deployed.'] },
      { q: 'A password-rule requirement changes in the middle of the test cycle. Which artifact helps you find the affected test cases fastest?', options: ['The test closure summary report', 'The defect log', 'The requirements traceability matrix', 'The test environment setup checklist'], correct: 2,
        why: ['The closure report is written at the end and summarises results.', 'The defect log lists bugs, not the tests linked to each requirement.', 'Right — the RTM maps each requirement to its test cases.', 'The environment checklist covers servers and access, not requirement coverage.'] },
      { q: 'In Scrum, when does most of the STLC “requirement analysis” work happen?', options: ['In backlog refinement, while stories are discussed', 'In the sprint retrospective at the end of the sprint', 'After the release, once real users report problems', 'In a separate test phase after all the sprints end'], correct: 0,
        why: ['Right — refinement is where testers question stories and shape acceptance criteria.', 'The retrospective improves the process; it does not analyse new stories.', 'That is far too late — analysis should happen before building.', 'Scrum has no separate test phase; testing happens inside each sprint.'] }
    ],
    interview: [
      { q: 'What is the STLC? Walk me through its phases.', a: 'The STLC is the organised sequence of testing activities. In <b>requirement analysis</b> I study the requirements, ask questions and start the traceability matrix. In <b>test planning</b> we agree scope, approach, schedule, environments, risks and entry/exit criteria. In <b>test case design</b> I write and review test cases and prepare data. In <b>environment setup</b> the environment is prepared and smoke-tested. In <b>execution</b> I run tests, report defects and retest. In <b>closure</b> I check exit criteria, write the summary report and record lessons learned. In Agile, the same loop runs per story and per sprint.' },
      { q: 'What are entry and exit criteria? Give examples.', a: 'Entry criteria are conditions that must be true before an activity starts; exit criteria define when it is finished. For test execution, entry criteria might be: the build is deployed and passes a smoke test, test cases are reviewed, and test data is ready. Exit criteria might be: all high-priority tests executed, no open critical or high-severity defects unless accepted by the product owner, and every acceptance criterion covered. If exit criteria are not met, I report what is missing and the risk — the release decision belongs to stakeholders.' }
    ],
    takeaways: [
      'STLC: requirement analysis → planning → design → environment setup → execution → closure.',
      'Entry criteria prevent wasted effort; exit criteria make “done” objective.',
      'Each phase has a deliverable — test plan, test cases, smoke result, defect reports, summary report.',
      'The traceability matrix shows coverage and what to re-test when a requirement changes.',
      'In Agile the STLC runs in small loops per story and per sprint.'
    ],
    links: { labs: ['login'], challenges: ['peopleops-login'], interview: ['m1', 'm6'] }
  },
  {
    id: 'fd-levels-types',
    n: 6,
    level: 'intermediate',
    title: 'Test levels and test types',
    summary: 'Distinguish the four test levels from the test types that run within them, including integration strategies, box approaches and change-related testing.',
    minutes: 18,
    objectives: [
      'Describe unit, integration, system and acceptance testing and who usually performs each',
      'Compare big-bang and incremental integration, and explain stubs and drivers',
      'Tell functional from non-functional testing and black-, white- and grey-box approaches',
      'Explain confirmation testing and regression testing and when each is needed'
    ],
    body: [
      { t: 'p', html: 'Two different questions describe any test. The <b>test level</b> answers “at what scale?” — one function, a few components talking to each other, the whole system, or the system in its business context. The <b>test type</b> answers “what are we checking, and why?” — features, performance, security, structure, or the effect of a change. Any type can run at any level: performance can be checked for a single algorithm in a unit test or for the whole site in a system-level load test.' },
      { t: 'table', head: ['Level', 'What is tested', 'Typical test basis', 'Usually done by'], rows: [
        ['<b>Unit</b> (component)', 'A single function, class or module in isolation', 'Detailed design, the code itself', 'Developers'],
        ['<b>Integration</b>', 'Interfaces and interactions between components or systems', 'Architecture, interface specs, API contracts', 'Developers and testers'],
        ['<b>System</b>', 'The whole integrated system, end to end', 'System requirements, user stories, use cases', 'Independent testers / QA team'],
        ['<b>Acceptance</b>', 'Whether the system is fit for use in its business context', 'Business needs, contracts, regulations', 'Users, customers, product owner, operations staff']
      ] },
      { t: 'h', text: 'Integration strategies' },
      { t: 'compare', a: { title: 'Big-bang integration', items: ['Combine all components at once and test them together', 'Simple to organise — no stubs or drivers', 'When something fails, it is hard to find which interface is at fault', 'Testing starts late, once everything exists'] }, b: { title: 'Incremental integration', items: ['Add components one at a time or in small groups', 'Defects are easier to locate — the last addition is the suspect', 'Needs stubs and drivers for missing parts', 'Testing can start early'] } },
      { t: 'list', items: [
        '<b>Top-down</b>: start from high-level modules such as the UI or controllers; <b>stubs</b> stand in for lower modules that are not ready. You see a skeleton of the user flow early, but low-level defects appear late.',
        '<b>Bottom-up</b>: start from low-level modules such as data access or calculators; <b>drivers</b> call them because the higher modules do not exist yet. Foundations are solid early, but no complete flow is visible until late.',
        '<b>Sandwich (hybrid)</b>: work from both ends and meet in the middle.',
        '<b>Component vs system integration</b>: component integration checks your own modules together; system integration checks connections to external systems such as a payment gateway or SMS provider.'
      ] },
      { t: 'callout', tone: 'tip', title: 'Stub or driver?', html: 'A <b>stub</b> is <i>called by</i> the module under test — it replaces something below it and returns canned answers. A <b>driver</b> <i>calls</i> the module under test — it replaces something above it. Today, mocks, fakes and service virtualisation tools play the same roles.' },
      { t: 'h', text: 'Forms of acceptance testing' },
      { t: 'cards', items: [
        { title: 'User acceptance (UAT)', html: 'Intended users confirm the system supports their real tasks in a realistic environment.' },
        { title: 'Operational (OAT)', html: 'Operations staff check backup and restore, installation, monitoring, disaster recovery and maintenance tasks.' },
        { title: 'Contractual and regulatory', html: 'Checks against contract acceptance criteria or laws and regulations, such as accessibility or data protection rules.' },
        { title: 'Alpha testing', html: 'Potential users or an independent team test at the <b>developer’s site</b> before release.' },
        { title: 'Beta testing', html: 'Real users test at <b>their own locations</b>, on their own devices, before general release.' }
      ] },
      { t: 'h', text: 'Test types' },
      { t: 'table', head: ['Type', 'Question it answers', 'Examples'], rows: [
        ['<b>Functional</b>', 'What does the system do?', 'Login rules, calculations, workflows, API responses'],
        ['<b>Non-functional</b>', 'How well does it do it?', 'Performance, security, usability, accessibility, reliability, compatibility'],
        ['<b>Black-box</b>', 'Does behaviour match the specification, without looking inside?', 'Equivalence partitions, boundaries, decision tables'],
        ['<b>White-box</b>', 'Is the internal structure exercised?', 'Statement and branch coverage of the code'],
        ['<b>Change-related</b>', 'Did the fix work, and did the change break anything?', 'Confirmation testing and regression testing']
      ] },
      { t: 'p', html: '<b>Grey-box</b> testing sits between the two: the tester has partial knowledge of the internals — the database schema, the API design, the architecture — and uses it to design better tests from the outside. Checking the database row after a UI action, or targeting a known integration point, are grey-box habits. It is a common industry term rather than one of the main test types in the ISTQB Foundation syllabus.' },
      { t: 'compare', a: { title: 'Confirmation testing (retest)', items: ['Re-run the test that failed, after the fix', 'Scope: the specific defect', 'Question: is <b>this</b> defect fixed?'] }, b: { title: 'Regression testing', items: ['Re-run tests in areas that worked before the change', 'Scope: around the change, often broader', 'Question: did the change break <b>anything else</b>? A strong automation candidate'] } }
    ],
    example: {
      title: 'Worked example: levels and types for ShopFlow’s new tax rule',
      blocks: [
        { t: 'p', html: '<b>Change:</b> ShopFlow adds region-based sales tax. A tax service is called by the cart and by the invoice generator; invoices are emailed through an external email provider.' },
        { t: 'table', head: ['Test', 'Level', 'Type'], rows: [
          ['<code>calculateTax(1000, "north")</code> returns the right amount for each region rate', 'Unit', 'Functional; white-box (one test per branch)'],
          ['The cart sends the correct region to the tax service and handles a tax-service timeout', 'Integration (component)', 'Functional, including error handling'],
          ['Order with tax → invoice PDF → email arrives with correct totals', 'System (plus system integration for email)', 'Functional, black-box, end to end'],
          ['Checkout still responds within the agreed time with 200 concurrent users', 'System', 'Non-functional (performance)'],
          ['The finance team confirms invoices meet their reporting needs', 'Acceptance (UAT)', 'Functional; validation of real needs'],
          ['Existing discount, refund and multi-currency tests are re-run', 'System', 'Change-related (regression)']
        ] },
        { t: 'p', html: 'Each row is described by <b>both</b> a level and a type. If a bug is later found in the tax for one region, re-running that test after the fix is <b>confirmation testing</b>; re-running the pricing suite around it is <b>regression testing</b>.' }
      ]
    },
    explain: {
      'ur': 'Test <b>level</b> بتاتا ہے کہ ہم system کا کتنا حصہ test کر رہے ہیں: unit (ایک function اکیلا)، integration (حصوں کا آپس میں ملنا)، system (پورا system) اور acceptance (کیا یہ user اور business کی ضرورت پوری کرتا ہے؟)۔ Test <b>type</b> بتاتا ہے کہ ہم کیا چیک کر رہے ہیں: functional (system کیا کرتا ہے) یا non-functional (کتنا اچھا کرتا ہے، جیسے speed اور security)۔ مثال: discount والا function اکیلے test کرنا unit level ہے، جبکہ 500 users کے ساتھ checkout کی speed دیکھنا system level پر non-functional test ہے۔ Bug fix کے بعد وہی test دوبارہ چلانا <b>retesting</b> (confirmation testing) ہے، اور یہ دیکھنا کہ باقی چیزیں نہیں ٹوٹیں <b>regression testing</b> ہے۔',
      'ur-Latn': 'Test <b>level</b> batata hai ke hum system ka kitna hissa test kar rahe hain: unit (ek function akela), integration (hisson ka aapas mein milna), system (poora system) aur acceptance (kya yeh user aur business ki zaroorat poori karta hai?). Test <b>type</b> batata hai ke hum kya check kar rahe hain: functional (system kya karta hai) ya non-functional (kitna acha karta hai, jaise speed aur security). Misaal: discount wala function akele test karna unit level hai, jab ke 500 users ke saath checkout ki speed dekhna system level par non-functional test hai. Bug fix ke baad wohi test dobara chalana <b>retesting</b> (confirmation testing) hai, aur yeh dekhna ke baaqi cheezein nahi tooteen <b>regression testing</b> hai.',
      'hi': 'Test <b>level</b> बताता है कि हम system का कितना हिस्सा test कर रहे हैं: unit (एक function अकेला), integration (हिस्सों का आपस में जुड़ना), system (पूरा system) और acceptance (क्या यह user और business की ज़रूरत पूरी करता है?)। Test <b>type</b> बताता है कि हम क्या जाँच रहे हैं: functional (system क्या करता है) या non-functional (कितना अच्छा करता है, जैसे speed और security)। उदाहरण: discount वाला function अकेले test करना unit level है, जबकि 500 users के साथ checkout की speed देखना system level पर non-functional test है। Bug fix के बाद वही test दोबारा चलाना <b>retesting</b> (confirmation testing) है, और यह देखना कि बाकी चीज़ें नहीं टूटीं <b>regression testing</b> है।',
      'ar': '<b>مستوى الاختبار</b> (test level) يحدد حجم الجزء الذي نختبره: اختبار الوحدة لدالة واحدة منفردة، واختبار التكامل لتفاعل المكونات معًا، واختبار النظام للنظام كاملًا، واختبار القبول للتأكد من أنه يلبي حاجة المستخدم والعمل. أما <b>نوع الاختبار</b> (test type) فيحدد ماذا نفحص: وظيفي (ماذا يفعل النظام) أو غير وظيفي (مدى جودة أدائه، مثل السرعة والأمان). مثال: اختبار دالة الخصم وحدها هو مستوى الوحدة، أما قياس سرعة الدفع مع 500 مستخدم فهو اختبار غير وظيفي على مستوى النظام. وإعادة تشغيل الاختبار نفسه بعد إصلاح العيب تُسمّى <b>إعادة الاختبار</b> (retesting)، أما التأكد من أن التعديل لم يكسر أجزاء أخرى فهو <b>اختبار الانحدار</b> (regression testing).',
      'es': 'El <b>nivel de prueba</b> indica qué parte del sistema probamos: unitaria (una función aislada), integración (cómo se comunican las piezas), sistema (todo el sistema) y aceptación (¿cubre las necesidades del usuario y del negocio?). El <b>tipo de prueba</b> indica qué comprobamos: funcional (qué hace el sistema) o no funcional (qué tan bien lo hace, como velocidad y seguridad). Ejemplo: probar sola la función de descuento es nivel unitario; medir la velocidad del checkout con 500 usuarios es una prueba no funcional a nivel de sistema. Repetir la misma prueba tras corregir un bug es <b>retesting</b> (prueba de confirmación); comprobar que el cambio no rompió otras cosas es <b>prueba de regresión</b>.'
    },
    keyTerms: [
      { term: 'Test level', def: 'A stage of testing defined by scale and test basis: unit, integration, system or acceptance.' },
      { term: 'Test type', def: 'A group of tests with a specific purpose, such as functional, non-functional, white-box or change-related.' },
      { term: 'Stub', def: 'A stand-in called by the component under test, replacing a lower-level part that is missing.' },
      { term: 'Driver', def: 'A piece of code that calls the component under test, replacing a higher-level part that is missing.' },
      { term: 'Confirmation testing', def: 'Re-running a failed test after a fix to confirm that the specific defect is resolved; also called retesting.' },
      { term: 'Regression testing', def: 'Re-running tests in previously working areas to check that a change has not broken them.' }
    ],
    practice: [
      { q: 'Give the level and type for each: (a) a developer checks that <code>isValidIban()</code> rejects 33 characters; (b) 1,000 virtual users browse MediBook for an hour; (c) a pharmacist uses the new prescription screen in a realistic workflow and signs off; (d) a tester checks that PeopleOps sends correct salary data to the external payroll system.', answer: '(a) <b>Unit</b>, functional (black-box boundary, written by a developer). (b) <b>System</b>, non-functional (performance/load). (c) <b>Acceptance (UAT)</b>, functional — validation of real needs. (d) <b>System integration</b>, functional.' },
      { q: 'In a top-down integration, the checkout screen is ready but the payment module is not. In a bottom-up integration, the payment module is ready but no screen calls it. What do you need in each case?', hint: 'Which one is called, and which one does the calling?', answer: 'Top-down: a <b>stub</b> for the payment module — the checkout calls it and it returns canned responses such as “approved” or “declined”. Bottom-up: a <b>driver</b> — a small test harness or script that calls the payment module with inputs, because the real caller does not exist yet.' },
      { q: 'A developer fixes bug #812: “Discount not applied to bundle products.” What exactly do you test?', answer: '<b>Confirmation testing</b>: repeat the steps of #812 on the fixed build and check bundles now get the discount. Then <b>regression testing</b> around the change: single products with discounts, bundles without discounts, coupon combinations, cart totals, invoices and refunds — whatever shares the pricing code.' },
      { q: 'Which form of acceptance testing is each? (a) Hospital IT checks that a full backup restores in under two hours; (b) 200 selected customers use a new app version on their own phones for two weeks; (c) a bank checks the app meets a central-bank regulation.', answer: '(a) <b>Operational acceptance testing</b>. (b) <b>Beta testing</b> — real users at their own locations. (c) <b>Regulatory acceptance testing</b>.' }
    ],
    quiz: [
      { q: 'In top-down integration, the login screen is ready but the account service below it is not. What replaces the account service during testing?', options: ['A driver', 'A test oracle', 'A stub', 'A smoke test'], correct: 2,
        why: ['A driver calls the module under test; here the missing part is called by it.', 'A test oracle is a source of expected results, not a stand-in component.', 'Right — a stub is called by the login screen and returns canned answers.', 'A smoke test is a quick check of build health, not a replacement component.'] },
      { q: 'A developer fixes a bug where discounts were not applied to bundles. Which testing is needed?', options: ['Only a full regression run of the entire test suite', 'Only re-running the single test that originally failed', 'A new round of acceptance testing by finance', 'Retest the bundle fix, then regress related pricing'], correct: 3,
        why: ['Regression alone may never repeat the exact steps of the original bug.', 'A retest alone cannot show whether the fix broke other pricing rules.', 'UAT is not the standard response to a single defect fix.', 'Right — confirmation testing proves the fix; regression checks nearby areas still work.'] },
      { q: 'Which of these is a non-functional test?', options: ['Checkout responds in 2 seconds for 500 concurrent users', 'Applying coupon SAVE10 reduces the order subtotal by 10%', 'An order cannot be placed when the cart has no items in it', 'Each invoice shows the correct tax amount for every region'], correct: 0,
        why: ['Right — response time under load is about how well the system works.', 'This checks what the system does with a coupon — functional.', 'A business rule about empty carts is functional.', 'Correct tax amounts are a functional requirement.'] },
      { q: 'Selected customers install a pre-release MediBook app on their own phones at home and report problems. What is this?', options: ['Alpha testing', 'Beta testing', 'Operational acceptance testing', 'System integration testing'], correct: 1,
        why: ['Alpha testing happens at the developer’s site.', 'Right — beta testing is done by real users in their own environments before general release.', 'OAT is done by operations staff on backups, recovery and maintenance.', 'System integration testing checks connections between systems.'] },
      { q: 'What best describes grey-box testing?', options: ['Testing with complete access to and coverage of all source code', 'Testing behaviour while using partial knowledge of internals', 'Testing that is performed only by end users before release', 'Testing without any requirements or documentation at all'], correct: 1,
        why: ['Full code access and structural coverage describe white-box testing.', 'Right — e.g. knowing the database schema helps design and verify tests from outside.', 'Testing by end users before release describes acceptance or beta testing.', 'Testing without documentation describes ad hoc testing, not grey-box.'] }
    ],
    interview: [
      { q: 'What is the difference between test levels and test types?', a: 'A <b>test level</b> describes the scale and stage of testing — unit, integration, system, acceptance — each with its own test basis and typical owner. A <b>test type</b> describes the purpose — functional, non-functional such as performance or security, white-box, or change-related such as regression. They combine: a load test of checkout is a <b>system-level non-functional</b> test, while a branch-coverage test of the discount function is a <b>unit-level white-box</b> test.' },
      { q: 'What is the difference between retesting and regression testing?', a: '<b>Retesting</b>, or confirmation testing, means re-running the test that found a defect, after the fix, to confirm that specific defect is resolved. <b>Regression testing</b> means re-running tests in areas that previously worked to check the change did not break them. For a fixed bundle-discount bug, I retest the exact bug steps, then run regression on related pricing: single-item discounts, coupons, totals and refunds. Regression suites are repeated often, so they are strong candidates for automation.' }
    ],
    takeaways: [
      'Levels answer “at what scale?”; types answer “what and why?” — every test has both.',
      'Unit → integration → system → acceptance, each with its own basis and typical owner.',
      'Incremental integration localises defects; stubs are called, drivers do the calling.',
      'Functional = what it does; non-functional = how well; grey-box uses partial internal knowledge.',
      'Retest confirms the fix; regression checks nothing else broke.'
    ],
    links: { labs: ['api', 'ui'], challenges: ['api-contract'], interview: ['m3'] }
  },
  {
    id: 'fd-static-testing',
    n: 7,
    level: 'intermediate',
    title: 'Static testing, reviews, and verification vs validation',
    summary: 'Find defects without running code through reviews and static analysis, choose the right review type, and tell verification from validation.',
    minutes: 17,
    objectives: [
      'Explain static vs dynamic testing and what each finds best',
      'Compare informal reviews, walkthroughs, technical reviews and inspections, and the roles involved',
      'Describe what static analysis tools such as linters and type checkers detect',
      'Distinguish verification from validation with concrete examples'
    ],
    body: [
      { t: 'p', html: '<b>Static testing</b> examines work products <b>without executing</b> them: requirements, user stories, designs, code, test cases, even contracts and help pages. <b>Dynamic testing</b> runs the software and observes its behaviour. They complement each other. Static testing finds <b>defects directly</b> — the ambiguous sentence, the missing rule, the unreachable code — while dynamic testing finds <b>failures</b>, which then have to be traced back to their defects.' },
      { t: 'compare', a: { title: 'Static testing', items: ['No execution — read, analyse, discuss', 'Works on any work product, from day one', 'Finds defects directly: ambiguities, omissions, contradictions, standards violations', 'Techniques: reviews and static analysis tools'] }, b: { title: 'Dynamic testing', items: ['Executes the software', 'Needs something runnable', 'Finds failures: wrong output, crashes, slowness', 'Techniques: test cases, exploratory testing, automated tests'] } },
      { t: 'h', text: 'What reviews catch' },
      { t: 'list', items: [
        '<b>Ambiguity</b> — “fast”, “user-friendly”, “large files”: words nobody can test until they are measurable.',
        '<b>Missing requirements</b> — what happens on a timeout, for a guest user, when the slot is taken meanwhile?',
        '<b>Contradictions</b> — the story allows refunds for 30 days; the policy page says 14.',
        '<b>Design flaws</b> — no retry on a payment call, a single point of failure, an interface that mismatches its caller.',
        '<b>Code issues</b> — deviations from standards, missing error handling, security weaknesses, code that is too complex to maintain or test.'
      ] },
      { t: 'h', text: 'Review types, from informal to formal' },
      { t: 'table', head: ['Type', 'Led by', 'Formality', 'Main purpose'], rows: [
        ['<b>Informal review</b>', 'Anyone — often the author asks a colleague', 'No defined process; results may not be documented', 'Quickly detect problems; get a second pair of eyes'],
        ['<b>Walkthrough</b>', 'The <b>author</b>', 'Low to moderate; may have a scribe', 'Share understanding, educate, gather feedback, find defects'],
        ['<b>Technical review</b>', 'A moderator, with technically qualified reviewers', 'Defined process, documented results', 'Reach consensus and make technical decisions; find defects'],
        ['<b>Inspection</b>', 'A trained moderator — <b>not</b> the author', 'Most formal: roles, checklists, entry and exit criteria, metrics', 'Find as many defects as possible; collect metrics to improve the process']
      ] },
      { t: 'cards', items: [
        { title: 'Author', html: 'Creates the work product and fixes the defects found in it.' },
        { title: 'Moderator (facilitator)', html: 'Runs the review meeting, keeps it effective and mediates between viewpoints.' },
        { title: 'Reviewers', html: 'Find potential defects — testers, developers, domain experts or users.' },
        { title: 'Scribe (recorder)', html: 'Records the anomalies found, decisions and open questions.' },
        { title: 'Review leader', html: 'Takes overall responsibility: who is involved, when and where.' },
        { title: 'Manager', html: 'Decides what is reviewed and provides time and people.' }
      ] },
      { t: 'p', html: 'Choose the review type by <b>risk</b>: a quick informal review suits a low-risk story, while an inspection suits a safety-critical specification or a payment algorithm where a missed defect is expensive. Whatever the type, reviews work best when reviewers prepare on their own first, the meeting focuses on <b>finding</b> problems rather than fixing them on the spot, and comments target the work product — never the author.' },
      { t: 'h', text: 'Static analysis' },
      { t: 'p', html: '<b>Static analysis</b> tools examine code without running it. <b>Linters</b> flag unused variables, likely bugs and style problems. <b>Type checkers</b> such as the TypeScript compiler catch type mismatches and values that may be undefined. <b>Security scanners</b> flag risky patterns, such as SQL built by joining strings. They usually run in the editor and in the CI pipeline. Tools also raise false alarms, so a person still judges each finding.' },
      { t: 'code', lang: 'ts', title: 'Findings a linter and type checker would raise — without running anything', code: 'function applyDiscount(total: number, code: string): number {\n  let rate: number | undefined;\n  if (code == "SAVE10") rate = 0.1;  // linter: use === instead of ==\n  const doubled = total * 2;         // linter: "doubled" is never used\n  return total - total * rate;       // type checker: "rate" is possibly undefined\n}' },
      { t: 'h', text: 'Verification vs validation' },
      { t: 'compare', a: { title: 'Verification — “Are we building the product right?”', items: ['Checks a work product against its <b>specification</b>', 'Reviewing a design against the requirements', 'Checking an API response has every field in its contract', 'Running system tests against the specification'] }, b: { title: 'Validation — “Are we building the right product?”', items: ['Checks against users’ <b>real needs</b> in intended use', 'UAT with the people who will use the system', 'Usability sessions and beta feedback', 'Reviewing a prototype with real users'] } },
      { t: 'callout', tone: 'warn', title: 'A common myth', html: '“Static testing is verification and dynamic testing is validation” is <b>not</b> right. Reviewing a clickable prototype with real users is static <i>and</i> validation; running system tests against the spec is dynamic <i>and</i> verification. A product can pass verification perfectly and still fail validation — the absence-of-defects fallacy.' }
    ],
    example: {
      title: 'Worked example: reviewing a MediBook user story',
      blocks: [
        { t: 'p', html: '<b>Story:</b> “As a patient, I want to book an appointment quickly so that I don’t have to wait.” <b>Acceptance criteria:</b> (1) The patient picks a doctor and a time. (2) The booking is confirmed fast. (3) The patient gets an SMS.' },
        { t: 'table', head: ['Review finding', 'Kind of defect', 'Suggested fix'], rows: [
          ['“Fast” has no measure', 'Ambiguity', 'Agree a measurable target with the PO, such as a confirmation time for most bookings'],
          ['What if someone else takes the slot during booking?', 'Missing requirement', 'Add a criterion: double booking is prevented and a clear message is shown'],
          ['SMS to which number? What if there is no phone number?', 'Missing requirement', 'SMS to the verified number; email as a fallback'],
          ['Can patients book in the past, or a year ahead?', 'Missing boundary', 'Define the booking window and test its edges'],
          ['The privacy policy forbids medical details in SMS', 'Contradiction with policy', 'SMS shows only date, time and clinic']
        ] },
        { t: 'p', html: 'Fifteen minutes of review produced five fixes before a line of code existed. Checking the story against the privacy policy is <b>verification</b>; asking whether patients really need SMS, or would prefer app notifications, is a <b>validation</b> question for the product owner.' }
      ]
    },
    explain: {
      'ur': '<b>Static testing</b> میں ہم software چلائے بغیر چیزیں جانچتے ہیں، جیسے requirements، user stories، design اور code کا review، یا linter جیسے tools۔ <b>Dynamic testing</b> میں software چلا کر اس کا رویہ دیکھتے ہیں۔ Static testing بہت سستی پڑتی ہے کیونکہ غلطی code بننے سے پہلے پکڑی جاتی ہے۔ مثال: story میں لکھا ہے کہ booking “جلدی” confirm ہو، تو review میں tester پوچھتا ہے کہ جلدی سے مراد کتنے seconds ہیں۔ <b>Verification</b> کا سوال ہے: کیا ہم product صحیح طریقے سے بنا رہے ہیں، یعنی specification کے مطابق؟ <b>Validation</b> کا سوال ہے: کیا ہم صحیح product بنا رہے ہیں، یعنی کیا یہ user کی اصل ضرورت پوری کرتا ہے؟',
      'ur-Latn': '<b>Static testing</b> mein hum software chalaye baghair cheezein check karte hain, jaise requirements, user stories, design aur code ka review, ya linter jaise tools. <b>Dynamic testing</b> mein software chala kar uska behaviour dekhte hain. Static testing bohat sasti parti hai kyun ke ghalti code banne se pehle pakri jaati hai. Misaal: story mein likha hai ke booking “jaldi” confirm ho, to review mein tester poochta hai ke jaldi se murad kitne seconds hain. <b>Verification</b> ka sawal hai: kya hum product sahi tareeqe se bana rahe hain, yani specification ke mutabiq? <b>Validation</b> ka sawal hai: kya hum sahi product bana rahe hain, yani kya yeh user ki asal zaroorat poori karta hai?',
      'hi': '<b>Static testing</b> में हम software चलाए बिना चीज़ें जाँचते हैं, जैसे requirements, user stories, design और code का review, या linter जैसे tools। <b>Dynamic testing</b> में software चलाकर उसका व्यवहार देखते हैं। Static testing बहुत सस्ती पड़ती है क्योंकि गलती code बनने से पहले पकड़ी जाती है। उदाहरण: story में लिखा है कि booking “जल्दी” confirm हो, तो review में tester पूछता है कि जल्दी का मतलब कितने seconds है। <b>Verification</b> का सवाल है: क्या हम product सही तरीके से बना रहे हैं, यानी specification के अनुसार? <b>Validation</b> का सवाल है: क्या हम सही product बना रहे हैं, यानी क्या यह user की असली ज़रूरत पूरी करता है?',
      'ar': 'في <b>الاختبار الساكن</b> (static testing) نفحص الأشياء دون تشغيل البرنامج، مثل مراجعة المتطلبات وقصص المستخدم والتصميم والشيفرة، أو استخدام أدوات مثل linter. أما في <b>الاختبار الديناميكي</b> فنشغّل البرنامج ونراقب سلوكه. الاختبار الساكن أرخص كثيرًا لأنه يكشف الخطأ قبل كتابة الشيفرة. مثال: تقول القصة إن الحجز يجب أن يُؤكَّد «بسرعة»، فيسأل المختبِر أثناء المراجعة: كم ثانية نقصد بالسرعة؟ <b>التحقق</b> (verification) يسأل: هل نبني المنتج بالطريقة الصحيحة، أي وفق المواصفات؟ و<b>المصادقة</b> (validation) تسأل: هل نبني المنتج الصحيح، أي هل يلبي حاجة المستخدم الحقيقية؟',
      'es': 'En las <b>pruebas estáticas</b> revisamos sin ejecutar el software: requisitos, historias de usuario, diseño y código, o usamos herramientas como un linter. En las <b>pruebas dinámicas</b> ejecutamos el software y observamos su comportamiento. Las estáticas salen mucho más baratas porque detectan el error antes de escribir código. Ejemplo: la historia dice que la reserva se confirma “rápido”, y en la revisión el tester pregunta cuántos segundos significa eso. La <b>verificación</b> pregunta: ¿estamos construyendo bien el producto, según la especificación? La <b>validación</b> pregunta: ¿estamos construyendo el producto correcto, el que el usuario realmente necesita?'
    },
    keyTerms: [
      { term: 'Static testing', def: 'Testing work products such as requirements, designs or code without executing them, through reviews or static analysis.' },
      { term: 'Walkthrough', def: 'A review led by the author to share understanding, gather feedback and find defects.' },
      { term: 'Inspection', def: 'The most formal review type, led by a trained moderator, with defined roles, checklists, criteria and metrics.' },
      { term: 'Static analysis', def: 'Tool-based examination of code without running it, e.g. linters, type checkers and security scanners.' },
      { term: 'Verification', def: 'Checking that a work product meets its specification: “are we building the product right?”' },
      { term: 'Validation', def: 'Checking that the product meets users’ real needs in intended use: “are we building the right product?”' }
    ],
    practice: [
      { q: 'Review this requirement and list the problems: “The system shall respond quickly and support large file uploads for all users.”', hint: 'Which words can nobody test as written?', answer: '“Quickly” — no measure (how many seconds, for which action, under what load?). “Large” — no size limit; what happens above it? “All users” — guests too? Users on slow mobile networks? Also missing: allowed file types, error messages, and what happens if an upload fails halfway. Each needs a measurable, testable criterion.' },
      { q: 'Name the review type: (a) a developer presents a new checkout design to the team to explain it and collect feedback; (b) a trained moderator runs a formal review of a safety-critical spec with checklists and defect metrics; (c) you ask a colleague to glance over your test cases before lunch.', answer: '(a) <b>Walkthrough</b> — led by the author. (b) <b>Inspection</b> — the most formal type. (c) <b>Informal review</b>.' },
      { q: 'Verification or validation? (a) Checking an API response against the OpenAPI contract; (b) watching five receptionists try the new booking screen; (c) comparing test cases with acceptance criteria; (d) beta feedback says the export does not fit how accountants work.', answer: '(a) <b>Verification</b> — against a specification. (b) <b>Validation</b> — real users, real tasks. (c) <b>Verification</b>. (d) <b>Validation</b> — the product may meet its spec but not the need.' },
      { q: 'A CI pipeline’s linter reports “variable assigned but never used” and the type checker reports “value is possibly undefined”. Is this testing? What happens next?', answer: 'Yes — it is <b>static testing</b> by static analysis. The developer reviews each finding: the possibly-undefined value is a likely real defect (a calculation could produce <code>NaN</code>) and should be fixed; the unused variable is a maintainability issue. Some findings can be false alarms, so a person decides — but teams often make the pipeline fail on serious findings.' }
    ],
    quiz: [
      { q: 'Which activity is static testing?', options: ['Running the regression suite on the nightly build', 'Exploring the checkout page on a mobile phone', 'Executing a load test against the booking API', 'Reviewing a user story for ambiguous wording'], correct: 3,
        why: ['Running tests executes the software — dynamic testing.', 'Exploratory testing runs the product — dynamic.', 'A load test executes the system under load — dynamic.', 'Right — a review examines a work product without executing anything.'] },
      { q: 'Which review type is led by the author, mainly to share understanding and gather feedback?', options: ['Inspection', 'Technical review', 'Walkthrough', 'Informal review'], correct: 2,
        why: ['Inspections are led by a trained moderator who is not the author.', 'Technical reviews are led by a moderator, with technical experts reviewing.', 'Right — in a walkthrough the author guides participants through the work product.', 'Informal reviews have no defined leader or process.'] },
      { q: 'A team checks that the PayLite API response contains every field defined in the API contract. What is this?', options: ['Validation, because it runs against the real, deployed API', 'Verification, because it checks against a specification', 'Validation, because the contract came from the users', 'Neither, because no user interface is involved'], correct: 1,
        why: ['Running against a real API does not make it validation; the reference is a spec.', 'Right — comparing a work product with its specification is verification.', 'Contracts are specifications, so checking against one is verification.', 'Verification applies to any work product, with or without a UI.'] },
      { q: 'What is the main objective of an inspection compared with other review types?', options: ['Finding as many defects as possible, with metrics collected', 'Teaching new team members how the whole system works', 'Quickly getting a second opinion without any defined process', 'Letting the author present ideas and collect opinions'], correct: 0,
        why: ['Right — inspections are formal, checklist-driven and collect metrics to improve the process.', 'Education is a typical walkthrough goal.', 'That describes an informal review.', 'An author-led presentation is a walkthrough.'] },
      { q: 'Five clinic receptionists try the new MediBook booking screen. It matches the specification exactly, but they say their busiest task now takes too many clicks. What has this activity done?', options: ['Verified the screen against its specification', 'Found a defect in the static analysis rules', 'Proved the specification is free of defects', 'Validated the screen against real user needs'], correct: 3,
        why: ['Matching the spec was already known; this session tested fit for real use.', 'No static analysis tool was involved.', 'It showed the opposite — the spec misses a real need.', 'Right — real users doing real tasks is validation, and it found a gap the spec missed.'] }
    ],
    interview: [
      { q: 'What is the difference between verification and validation?', a: '<b>Verification</b> asks “are we building the product right?” — does a work product match its specification? Examples: reviewing a design against requirements, or checking an API response against its contract. <b>Validation</b> asks “are we building the right product?” — does it meet users’ real needs? Examples: UAT, usability sessions, beta feedback. Both matter: a system can match its spec perfectly and still fail users if the spec missed what they need.' },
      { q: 'What is static testing, and why is it valuable?', a: 'Static testing examines work products without executing them — reviews of requirements, stories, designs, code and test cases, plus static analysis tools such as linters and type checkers. It is valuable because it finds defects <b>early and directly</b>: an ambiguous requirement costs a conversation to fix before coding, but a rebuild and retest after. It also finds things dynamic testing struggles with, such as contradictions between documents, maintainability problems and security patterns in code that is rarely executed.' }
    ],
    takeaways: [
      'Static testing finds defects without running code; dynamic testing finds failures by running it.',
      'Reviews catch ambiguities, omissions and contradictions before they become code.',
      'Informal → walkthrough (author-led) → technical review → inspection (most formal, metrics).',
      'Linters, type checkers and security scanners are static analysis — a person still judges findings.',
      'Verification = built right (against spec); validation = the right thing (against real needs).'
    ],
    links: { interview: ['m5', 'm1'] }
  },
  {
    id: 'fd-agile-testing',
    n: 8,
    level: 'intermediate',
    title: 'Testing in Agile and Scrum',
    summary: 'Work as a tester inside Scrum: use the events, three amigos and definitions of ready and done, apply shift-left and shift-right, and map tests to quadrants.',
    minutes: 18,
    objectives: [
      'Explain Scrum accountabilities, events and artifacts from a tester’s point of view',
      'Turn a three amigos conversation into clear acceptance criteria',
      'Use a Definition of Ready and a Definition of Done to protect quality',
      'Classify tests with the Agile testing quadrants and plan testing in a two-week sprint'
    ],
    body: [
      { t: 'p', html: '<b>Agile</b> is a set of values and principles: individuals and interactions, working software, customer collaboration and responding to change. <b>Scrum</b> is the most widely used Agile framework. In Agile, testing is not a phase at the end; it is an activity that runs throughout the sprint, and <b>quality is the whole team’s responsibility</b>. Testers bring the testing perspective — sharp questions, concrete examples, risk thinking, exploratory skill and automation.' },
      { t: 'table', head: ['Scrum element', 'What it is', 'The tester’s contribution'], rows: [
        ['<b>Product Owner</b>', 'Maximises product value; orders the Product Backlog', 'Clarify acceptance criteria; give risk information for prioritisation'],
        ['<b>Scrum Master</b>', 'Helps the team use Scrum well; removes impediments', 'Raise blockers such as an unavailable test environment'],
        ['<b>Developers</b>', 'Everyone who builds the increment', 'Testers belong here — part of the team, not a separate gate'],
        ['<b>Sprint Planning</b>', 'The team selects work and plans how to deliver it', 'Estimate testing work, flag risky stories, plan test data'],
        ['<b>Daily Scrum</b>', 'A short daily sync toward the Sprint Goal', 'Share testing progress and bugs that threaten the goal'],
        ['<b>Sprint Review</b>', 'Inspect the increment with stakeholders', 'Show what was tested and share known issues openly'],
        ['<b>Sprint Retrospective</b>', 'Improve how the team works', 'Suggest fixes, e.g. “stories need examples before planning”']
      ] },
      { t: 'callout', tone: 'info', title: 'What the Scrum Guide says — and does not', html: 'In the Scrum Guide, <b>Developers</b> means everyone who does the work of creating the increment, testers included. Backlog refinement is an ongoing activity, not a formal event. The <b>Definition of Done</b> is part of Scrum; a <b>Definition of Ready</b> is a widely used team practice that is not in the guide. Sprints last one month or less — two weeks is common.' },
      { t: 'h', text: 'Three amigos' },
      { t: 'p', html: 'Before a story is built, three perspectives meet: <b>business</b> (product owner or analyst) — what problem and what value; <b>development</b> — how it could be built and what constraints exist; <b>testing</b> — what could go wrong and how we will know it works. It does not have to be exactly three people. The output is shared understanding and <b>concrete examples</b> that become acceptance criteria, sometimes written in Given/When/Then form.' },
      { t: 'code', lang: 'gherkin', title: 'Examples agreed in a three amigos session', code: 'Feature: Daily transfer limit of 50,000 PKR\n\n  Scenario: Transfer that reaches the limit exactly\n    Given Sara has sent 40,000 PKR today\n    When she sends 10,000 PKR\n    Then the transfer succeeds\n\n  Scenario: Transfer that goes over the limit\n    Given Sara has sent 45,000 PKR today\n    When she sends 10,000 PKR\n    Then the transfer is rejected\n    And she sees "Daily limit of 50,000 PKR exceeded"' },
      { t: 'h', text: 'Definition of Ready and Definition of Done' },
      { t: 'compare', a: { title: 'Definition of Ready (story can start)', items: ['Clear user value and acceptance criteria with examples', 'Dependencies and designs available', 'Small enough to finish within the sprint', 'Test data and environment needs identified'] }, b: { title: 'Definition of Done (increment is done)', items: ['Code reviewed and merged; unit and integration tests pass in CI', 'Acceptance criteria verified and exploratory testing done', 'No open critical or high-severity bugs on the story', 'Regression passes; release notes updated'] } },
      { t: 'h', text: 'Shift-left and shift-right' },
      { t: 'cards', items: [
        { title: 'Shift-left — test earlier', html: 'Review stories, hold three amigos sessions, practise TDD or BDD, run unit tests and static analysis on every commit, test the API before the UI exists. The earlier a defect is found, the less rework it causes.' },
        { title: 'Shift-right — learn from production', html: 'Monitoring and alerts, logs, feature flags, canary releases, A/B tests, production smoke checks and real user feedback. Shift-right does not replace testing before release — it adds a safety net for problems that only real usage, real data and real scale reveal.' }
      ] },
      { t: 'h', text: 'The Agile testing quadrants' },
      { t: 'table', caption: 'Agile testing quadrants (originally described by Brian Marick, popularised by Lisa Crispin and Janet Gregory)', head: ['Quadrant', 'Facing and purpose', 'Typical tests', 'Usually'], rows: [
        ['<b>Q1</b>', 'Technology-facing, supports the team', 'Unit and component tests', 'Automated'],
        ['<b>Q2</b>', 'Business-facing, supports the team', 'Functional and story tests, examples, prototypes', 'Automated and manual'],
        ['<b>Q3</b>', 'Business-facing, critiques the product', 'Exploratory, usability, UAT, alpha and beta testing', 'Manual'],
        ['<b>Q4</b>', 'Technology-facing, critiques the product', 'Performance, load, security, reliability', 'Tool-supported']
      ] },
      { t: 'callout', tone: 'key', title: 'A two-week sprint, tester’s view', html: 'Days 1–2: plan, write test ideas, prepare data. Days 2–8: test each story <b>as soon as it is finished</b>, pair with developers, automate acceptance checks. Days 8–9: exploratory and regression testing on the integrated increment. Day 10: review and retrospective. Watch for the <b>mini-waterfall</b> trap — coding all sprint and cramming testing into the last two days. Smaller stories and limits on work in progress fix it better than overtime.' }
    ],
    example: {
      title: 'Worked example: three amigos on a PayLite story',
      blocks: [
        { t: 'p', html: '<b>Story:</b> “As a PayLite user, I want a daily transfer limit so that a stolen phone cannot empty my wallet.” The product owner, a developer and a tester meet for 20 minutes.' },
        { t: 'table', head: ['Who asked', 'Question', 'Outcome'], rows: [
          ['Tester', 'Is 50,000 PKR inclusive?', 'Yes — a day’s total may reach exactly 50,000; examples at 49,999, 50,000 and 50,001'],
          ['Tester', 'When does “today” reset, and in which time zone?', 'Midnight Pakistan time — new acceptance criterion'],
          ['Developer', 'Do failed or reversed transfers count?', 'Only successful transfers count toward the limit'],
          ['Product Owner', 'Should users raise their own limit?', 'Out of scope — new backlog item'],
          ['Tester', 'Is the limit enforced by the API, not just the app?', 'Yes, server-side — an API test is added']
        ] },
        { t: 'p', html: 'Twenty minutes produced three new acceptance criteria, a clarified boundary, an out-of-scope note and a list of tests — before any code was written. That is <b>shift-left</b> in practice.' }
      ]
    },
    explain: {
      'ur': 'Agile میں testing آخر میں ہونے والا الگ phase نہیں، بلکہ پورے sprint میں ساتھ ساتھ چلتی ہے، اور quality پوری team کی ذمہ داری ہے۔ Story بننے سے پہلے <b>three amigos</b> ملتے ہیں: business (product owner)، developer اور tester، تاکہ مثالوں کے ساتھ acceptance criteria طے ہوں۔ <b>Definition of Done</b> بتاتی ہے کہ story کب واقعی مکمل ہے، مثلاً tests pass ہوں اور کوئی critical bug کھلا نہ ہو۔ <b>Shift-left</b> کا مطلب ہے جلدی test کرنا (story review، unit tests)، اور <b>shift-right</b> کا مطلب ہے production میں monitoring اور feature flags سے سیکھنا۔ مثال: tester refinement میں پوچھتا ہے کہ کیا daily limit ٹھیک 50,000 پر بھی allowed ہے؟',
      'ur-Latn': 'Agile mein testing aakhir mein hone wala alag phase nahi, balke poore sprint mein saath saath chalti hai, aur quality poori team ki zimmedari hai. Story banne se pehle <b>three amigos</b> milte hain: business (product owner), developer aur tester, taake misaalon ke saath acceptance criteria tay hon. <b>Definition of Done</b> batati hai ke story kab waqai mukammal hai, maslan tests pass hon aur koi critical bug khula na ho. <b>Shift-left</b> ka matlab hai jaldi test karna (story review, unit tests), aur <b>shift-right</b> ka matlab hai production mein monitoring aur feature flags se seekhna. Misaal: tester refinement mein poochta hai ke kya daily limit theek 50,000 par bhi allowed hai?',
      'hi': 'Agile में testing आखिर में होने वाला अलग phase नहीं है, बल्कि पूरे sprint में साथ-साथ चलती है, और quality पूरी team की ज़िम्मेदारी है। Story बनने से पहले <b>three amigos</b> मिलते हैं: business (product owner), developer और tester, ताकि उदाहरणों के साथ acceptance criteria तय हों। <b>Definition of Done</b> बताती है कि story कब सच में पूरी है, जैसे tests pass हों और कोई critical bug खुला न हो। <b>Shift-left</b> का मतलब है जल्दी test करना (story review, unit tests), और <b>shift-right</b> का मतलब है production में monitoring और feature flags से सीखना। उदाहरण: tester refinement में पूछता है कि क्या daily limit ठीक 50,000 पर भी allowed है?',
      'ar': 'في Agile لا يكون الاختبار مرحلة منفصلة في النهاية، بل يسير جنبًا إلى جنب مع العمل طوال الـ sprint، والجودة مسؤولية الفريق كله. قبل بناء أي قصة يجتمع <b>«الأصدقاء الثلاثة»</b> (three amigos): ممثل العمل (product owner) والمطوّر والمختبِر، للاتفاق على معايير القبول مع أمثلة واضحة. و<b>تعريف الإنجاز</b> (Definition of Done) يحدد متى تكتمل القصة فعلًا، مثل نجاح الاختبارات وعدم وجود عيب حرج مفتوح. <b>Shift-left</b> يعني الاختبار مبكرًا (مراجعة القصص واختبارات الوحدة)، و<b>shift-right</b> يعني التعلّم من بيئة الإنتاج عبر المراقبة وfeature flags. مثال: يسأل المختبِر أثناء refinement: هل يُسمح بالتحويل إذا بلغ المجموع 50,000 تمامًا؟',
      'es': 'En Agile, las pruebas no son una fase separada al final: avanzan junto al desarrollo durante todo el sprint, y la calidad es responsabilidad de todo el equipo. Antes de construir una historia se reúnen los <b>three amigos</b>: negocio (product owner), desarrollo y testing, para acordar criterios de aceptación con ejemplos concretos. La <b>Definition of Done</b> indica cuándo una historia está realmente terminada, por ejemplo con las pruebas en verde y sin bugs críticos abiertos. <b>Shift-left</b> significa probar antes (revisar historias, pruebas unitarias) y <b>shift-right</b>, aprender de producción con monitorización y feature flags. Ejemplo: en el refinamiento, el tester pregunta si se permite una transferencia que deja el total del día justo en 50.000.'
    },
    keyTerms: [
      { term: 'Three amigos', def: 'A short conversation between business, development and testing perspectives to agree examples and acceptance criteria before building.' },
      { term: 'Definition of Ready', def: 'A team agreement on what a story needs before work starts; a common practice, not part of the Scrum Guide.' },
      { term: 'Definition of Done', def: 'A shared, formal description of the quality an increment must meet to be considered done.' },
      { term: 'Shift-left', def: 'Moving testing activities earlier — reviews, examples, unit tests and static analysis — to prevent defects.' },
      { term: 'Shift-right', def: 'Testing and learning in or near production through monitoring, feature flags, canary releases and user feedback.' },
      { term: 'Agile testing quadrants', def: 'A model that groups tests by whether they face the business or technology and support the team or critique the product.' }
    ],
    practice: [
      { q: 'Place each test in an Agile testing quadrant: (a) unit tests for an interest calculation; (b) an exploratory session on the new onboarding flow; (c) a load test with 1,000 users; (d) automated acceptance tests from Gherkin examples; (e) a usability session with five users; (f) a security scan.', answer: '(a) <b>Q1</b>; (b) <b>Q3</b>; (c) <b>Q4</b>; (d) <b>Q2</b>; (e) <b>Q3</b>; (f) <b>Q4</b>.' },
      { q: 'A team keeps marking stories “done” although edge cases are untested and bugs appear in the next sprint. Write four lines for their Definition of Done.', hint: 'Make each line checkable, not a wish.', answer: 'For example: (1) every acceptance criterion, including listed edge cases, has a passing test; (2) unit and API tests for the story run green in CI; (3) a short exploratory session is done and notes are attached to the story; (4) no open critical or high-severity bugs on the story; (5) the regression suite passes on the integrated build.' },
      { q: 'It is day 8 of a 10-day sprint. Three of five stories are still in development and nothing has been tested. What do you raise now, and what do you suggest for future sprints?', answer: 'Now: raise it at the Daily Scrum — the Sprint Goal is at risk; agree which stories can realistically be finished and tested, and stop starting new work. Future: smaller stories, limits on work in progress so stories finish one by one, testers involved from refinement, and automated checks written alongside the code — so testing flows through the sprint instead of piling up at the end.' },
      { q: 'Name three shift-right practices and the risk each one addresses.', answer: '<b>Monitoring and alerts</b> — detect errors and slowness that real usage reveals. <b>Feature flags</b> — switch a risky feature off instantly without a redeploy. <b>Canary releases</b> — expose a change to a small share of users first, limiting the blast radius. Others: A/B tests (validate value), production smoke checks (confirm a deployment worked).' }
    ],
    quiz: [
      { q: 'According to the Scrum Guide, which group are testers part of?', options: ['The Developers', 'The Product Owner team', 'The Scrum Master role', 'The stakeholders'], correct: 0,
        why: ['Right — Developers means everyone who does the work of creating the increment.', 'There is one Product Owner, accountable for product value and the backlog.', 'The Scrum Master helps the team use Scrum; it is not where testers sit.', 'Stakeholders are outside the Scrum Team; testers are inside it.'] },
      { q: 'In a three amigos session, which question is the tester’s typical contribution?', options: ['How much revenue will this feature bring next quarter?', 'What happens if a transfer exceeds the daily limit?', 'Which database index will make this query faster?', 'Which team member should be assigned this story?'], correct: 1,
        why: ['Business value is the business perspective’s question.', 'Right — testers probe edge cases and failure behaviour to shape acceptance criteria.', 'Implementation detail is the development perspective.', 'Self-organising teams decide who does the work; it is not the testing perspective.'] },
      { q: 'Which test belongs in Q4 of the Agile testing quadrants (technology-facing, critiquing the product)?', options: ['Unit tests for the interest calculation', 'Exploratory testing of the onboarding flow', 'A load test with 1,000 concurrent users', 'Story tests written from acceptance criteria'], correct: 2,
        why: ['Unit tests are Q1 — technology-facing, supporting the team.', 'Exploratory testing is Q3 — business-facing, critiquing the product.', 'Right — performance and load are technology-facing critiques, usually tool-supported.', 'Story tests are Q2 — business-facing, supporting the team.'] },
      { q: 'On day 8 of a 10-day sprint, most stories are still in development and nothing has been tested. What is the best long-term fix?', options: ['Testers work overtime in the last two days of every sprint', 'Move all testing into a separate “testing sprint” afterwards', 'Skip regression testing so there is time for new stories', 'Smaller stories and WIP limits so testing flows daily'], correct: 3,
        why: ['Overtime hides the problem and burns people out; the flow stays broken.', 'A testing sprint delays feedback and recreates a mini-waterfall.', 'Skipping regression trades a schedule problem for a quality risk.', 'Right — finishing stories one by one lets testing happen throughout the sprint.'] },
      { q: 'Which is an example of shift-right testing?', options: ['Reviewing the acceptance criteria during backlog refinement', 'Running unit tests and linters on every commit', 'A canary release to 5% of users, with error monitoring', 'Writing Gherkin scenarios before development'], correct: 2,
        why: ['Reviewing criteria early is shift-left.', 'Fast checks on every commit are shift-left.', 'Right — learning from real production use with a limited blast radius is shift-right.', 'Agreeing examples before coding is shift-left.'] }
    ],
    interview: [
      { q: 'What is the role of a tester in a Scrum team?', a: 'In Scrum, testers are part of the Developers — the team that builds the increment. I join refinement and three amigos sessions to ask questions and turn them into acceptance criteria with examples. During the sprint I test each story as it is finished, explore around it, log and retest bugs, and automate acceptance and regression checks with the developers. I raise risks at the Daily Scrum, share coverage and known issues at the Sprint Review, and suggest process improvements at the retrospective. Quality is shared; my job is to make it visible and help everyone build it in.' },
      { q: 'What is the Definition of Done and how does it relate to testing?', a: 'The Definition of Done is the team’s shared, formal description of the quality an increment must meet before it counts as done. Much of it is about testing: acceptance criteria verified, unit and integration tests passing in CI, exploratory testing done, no open critical bugs, regression passing. It protects quality because a story that misses any item is simply not done — it cannot be shown as complete at the Sprint Review. I help the team keep it specific and checkable.' }
    ],
    takeaways: [
      'In Agile, testing runs throughout the sprint and quality belongs to the whole team.',
      'Testers are part of the Scrum Developers and contribute at every event.',
      'Three amigos turn questions into examples and acceptance criteria before coding.',
      'DoR guards the start of work; DoD guards “done” — keep both checkable.',
      'Shift-left prevents defects early; shift-right learns safely from production; quadrants keep the mix balanced.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['m6', 'm3'] }
  },
  {
    id: 'fd-risk-based',
    n: 9,
    level: 'advanced',
    title: 'Risk-based testing and building a test strategy',
    summary: 'Score product and project risks by likelihood and impact, use them to set test depth, write a strategy and plan, and report residual risk honestly.',
    minutes: 20,
    objectives: [
      'Assess risks by likelihood and impact and place them in a risk matrix',
      'Separate product risks from project risks and choose a response for each',
      'Decide test depth, techniques and order from the risk level',
      'Distinguish a test strategy from a test plan and communicate residual risk honestly'
    ],
    body: [
      { t: 'p', html: 'Time is always limited and exhaustive testing is impossible, so every test team prioritises — the only question is whether it does so <b>deliberately</b>. <b>Risk-based testing</b> uses risk to decide what to test, how deeply, in what order and what to report. A <b>risk</b> is a possible future event with negative consequences. Its level is usually judged from two factors: <b>likelihood</b> (how probable it is) and <b>impact</b> (how bad it would be).' },
      { t: 'h', text: 'Scoring risk' },
      { t: 'p', html: 'Rate each factor on a small scale, such as 1–3, and multiply: <b>risk level = likelihood × impact</b>. When impact is expressed as money, the product is often called <b>risk exposure</b> — a 10% chance of a 500,000 PKR loss is an exposure of 50,000 PKR. Likelihood rises with complex or new code, new technology, many integrations, frequent changes and a history of defects. Impact rises with financial loss, safety, legal or privacy consequences, reputation, and <b>usage</b> — how many people touch the feature and how often. Scores are judgements, not measurements; much of their value comes from the conversation that produces them.' },
      { t: 'table', caption: 'A 3×3 risk matrix — score = likelihood × impact, each rated 1 (low) to 3 (high)', head: ['Likelihood ↓ / Impact →', 'Low impact (1)', 'Medium impact (2)', 'High impact (3)'], rows: [
        ['<b>High</b> likelihood (3)', 'Medium — 3', 'High — 6', '<b>Critical — 9</b>'],
        ['<b>Medium</b> likelihood (2)', 'Low — 2', 'Medium — 4', 'High — 6'],
        ['<b>Low</b> likelihood (1)', 'Low — 1', 'Low — 2', 'Medium — 3']
      ] },
      { t: 'h', text: 'Product risks and project risks' },
      { t: 'compare', a: { title: 'Product (quality) risks — test them', items: ['The product may not meet users’ needs or may fail', 'Wrong tax calculation, slow checkout at peak, a data leak through an API', 'An inaccessible form, a crash on older Android versions', 'Response: more test depth, earlier, with suitable techniques'] }, b: { title: 'Project risks — manage them', items: ['Threats to the project’s ability to deliver', 'Test environment unavailable, builds arriving late, a key tester leaving', 'Unclear requirements, a third-party sandbox that keeps going down', 'Response: mitigation, contingency plans, escalation'] } },
      { t: 'h', text: 'From risk level to test depth' },
      { t: 'table', head: ['Risk level', 'Test depth', 'Example techniques and practices'], rows: [
        ['<b>Critical</b>', 'Earliest and deepest; tests reviewed by a second person', 'Three-value boundaries, decision tables, state transitions, UI <i>and</i> API checks, security or performance tests, automated regression'],
        ['<b>High</b>', 'Thorough, early in the cycle', 'Partitions, two-value boundaries, decision tables for business rules, automated regression'],
        ['<b>Medium</b>', 'Main paths and key negative cases', 'Partitions, typical errors, a time-boxed exploratory charter'],
        ['<b>Low</b>', 'Light — or consciously not tested this time', 'A quick exploratory pass, reliance on unit tests; record it as residual risk']
      ] },
      { t: 'callout', tone: 'tip', title: 'Risk decides order, too', html: 'Test the highest risks <b>first</b>. If time runs out — and it often does — what remains untested is the least risky part, and you can say so with confidence.' },
      { t: 'h', text: 'Test strategy vs test plan' },
      { t: 'compare', a: { title: 'Test strategy — the general approach', items: ['Often organisation- or product-wide, and long-lived', 'Which test levels and types are used, and the risk approach', 'Techniques, automation approach, tools and environments', 'Standard entry/exit criteria and defect management'] }, b: { title: 'Test plan — this project or release', items: ['Scope: what is in and out for this release', 'Schedule, milestones, people and responsibilities', 'Environments and test data for this cycle', 'Specific risks with mitigations, deliverables and criteria'] } },
      { t: 'p', html: 'Standards such as ISO/IEC/IEEE 29119-3 offer templates for both documents, but size should follow context: a regulated medical product may need formal documents, while many Agile teams keep a one-page strategy and a living plan on a wiki. What matters is that the team agrees the approach and can explain <b>why</b> it tests some areas more than others.' },
      { t: 'callout', tone: 'key', title: 'Report residual risk honestly', html: '<b>Residual risk</b> is what remains after testing. Report what was tested and how deeply, what was <b>not</b> tested and why, open defects with their impact, and your confidence. Talk in risks, not just test-case counts: “All 6 critical risks tested and passing; 2 of 9 medium risks untested — PDF export and Arabic locale.” Never say “all tests passed” when part of the plan was not run. Accepting residual risk is the stakeholders’ decision — your job is to make it visible.' }
    ],
    example: {
      title: 'Worked example: a risk-based plan for PayLite bill payments',
      blocks: [
        { t: 'p', html: 'PayLite adds utility bill payments. Two testers have five days. In a 45-minute risk workshop, the product owner, the developer lead and the support lead rate each product risk from 1 to 3.' },
        { t: 'table', head: ['Product risk', 'Likelihood', 'Impact', 'Score', 'Response'], rows: [
          ['Biller API times out and the payment stays “pending” forever', '3', '3', '<b>9 — Critical</b>', 'Stub the biller to simulate timeouts; state-transition tests; check reconciliation'],
          ['A double tap on <b>Pay</b> charges the bill twice', '2', '3', '<b>6 — High</b>', 'Idempotency tests through UI and API, including network drops; automate'],
          ['Wrong amount sent to the biller (rounding, fees)', '2', '3', '<b>6 — High</b>', 'Boundary values on amounts, a decision table for fees, verify the stored amount'],
          ['Receipt layout breaks on small screens', '2', '1', '2 — Low', 'Quick exploratory pass on two devices'],
          ['Bill history sorted in the wrong order', '1', '1', '1 — Low', 'Not tested this release; recorded as residual risk']
        ] },
        { t: 'p', html: 'There is also a <b>project risk</b>: the biller’s sandbox is shared and often down. Mitigation: use the stub for most tests and book sandbox time for end-to-end runs. The closure report reads: “Critical and high risks tested and passing; receipt layout lightly tested; bill history sorting not tested (low risk, accepted by the product owner).”' }
      ]
    },
    explain: {
      'ur': 'ہر چیز test کرنا ناممکن ہے اور وقت ہمیشہ کم ہوتا ہے، اس لیے <b>risk-based testing</b> میں ہم پہلے وہ حصے test کرتے ہیں جہاں خطرہ سب سے زیادہ ہو۔ Risk کو دو چیزوں سے ناپتے ہیں: <b>likelihood</b> (مسئلہ ہونے کا امکان) اور <b>impact</b> (اگر ہو جائے تو نقصان کتنا ہوگا)۔ دونوں کو 1 سے 3 تک نمبر دے کر ضرب دیں۔ مثال: bill کا دو بار charge ہو جانا (امکان 2، نقصان 3، یعنی 6) footer کے typo (3 × 1 = 3) سے پہلے اور زیادہ گہرائی سے test ہوگا۔ Product risk خود software کا خطرہ ہے، جبکہ project risk کام کا خطرہ ہے، جیسے test environment کا دستیاب نہ ہونا۔ آخر میں ایمانداری سے بتائیں کہ کیا test نہیں ہوا اور کون سا risk باقی ہے۔',
      'ur-Latn': 'Har cheez test karna na-mumkin hai aur waqt hamesha kam hota hai, is liye <b>risk-based testing</b> mein hum pehle woh hissay test karte hain jahan khatra sab se zyada ho. Risk ko do cheezon se naapte hain: <b>likelihood</b> (masla hone ka imkaan) aur <b>impact</b> (agar ho jaye to nuqsaan kitna hoga). Dono ko 1 se 3 tak number de kar zarb dein. Misaal: bill ka do baar charge ho jana (imkaan 2, nuqsaan 3, yani 6) footer ke typo (3 × 1 = 3) se pehle aur zyada gehrai se test hoga. Product risk khud software ka khatra hai, jab ke project risk kaam ka khatra hai, jaise test environment ka available na hona. Aakhir mein imaandari se batayein ke kya test nahi hua aur kaun sa risk baaqi hai.',
      'hi': 'हर चीज़ test करना असंभव है और समय हमेशा कम होता है, इसलिए <b>risk-based testing</b> में हम पहले वे हिस्से test करते हैं जहाँ खतरा सबसे ज़्यादा हो। Risk को दो चीज़ों से मापते हैं: <b>likelihood</b> (समस्या होने की संभावना) और <b>impact</b> (अगर हो जाए तो नुकसान कितना होगा)। दोनों को 1 से 3 तक अंक देकर गुणा करें। उदाहरण: bill का दो बार charge हो जाना (संभावना 2, नुकसान 3, यानी 6) footer के typo (3 × 1 = 3) से पहले और ज़्यादा गहराई से test होगा। Product risk खुद software का खतरा है, जबकि project risk काम का खतरा है, जैसे test environment का उपलब्ध न होना। आखिर में ईमानदारी से बताएँ कि क्या test नहीं हुआ और कौन-सा risk बाकी है।',
      'ar': 'اختبار كل شيء مستحيل والوقت محدود دائمًا، لذلك في <b>الاختبار القائم على المخاطر</b> (risk-based testing) نختبر أولًا الأجزاء الأعلى خطرًا. نقيس الخطر بعاملين: <b>الاحتمال</b> (likelihood) أي مدى ترجيح حدوث المشكلة، و<b>الأثر</b> (impact) أي حجم الضرر إن حدثت. نعطي كلًّا منهما درجة من 1 إلى 3 ونضربهما. مثال: خصم الفاتورة مرتين (احتمال 2 وأثر 3، أي 6) يُختبر قبل خطأ إملائي في تذييل الصفحة (3 × 1 = 3) وبعمق أكبر. مخاطر المنتج تخص البرنامج نفسه، أما مخاطر المشروع فتخص سير العمل، مثل عدم توفر بيئة الاختبار. وفي النهاية نذكر بصدق ما لم يُختبر وما الخطر المتبقي.',
      'es': 'Probarlo todo es imposible y el tiempo siempre es limitado, así que en las <b>pruebas basadas en riesgos</b> probamos primero lo más peligroso. El riesgo se mide con dos factores: <b>probabilidad</b> (qué tan posible es que ocurra el problema) e <b>impacto</b> (cuánto daño causaría). Se puntúa cada uno de 1 a 3 y se multiplican. Ejemplo: cobrar una factura dos veces (probabilidad 2, impacto 3, total 6) se prueba antes y con más profundidad que una errata en el pie de página (3 × 1 = 3). Los riesgos de producto afectan al software; los riesgos de proyecto afectan al trabajo, como un entorno de pruebas no disponible. Al final, informa con honestidad qué no se probó y qué riesgo queda.'
    },
    keyTerms: [
      { term: 'Risk', def: 'A possible future event with negative consequences; its level is judged by likelihood and impact.' },
      { term: 'Risk level', def: 'A measure of a risk’s importance, commonly likelihood × impact on a small scale such as 1–3.' },
      { term: 'Product risk', def: 'A risk that the product fails or does not meet needs, such as a wrong calculation or a data leak.' },
      { term: 'Project risk', def: 'A risk to the project’s ability to deliver, such as late builds or an unavailable test environment.' },
      { term: 'Residual risk', def: 'The risk that remains after testing and other mitigations; stakeholders decide whether to accept it.' },
      { term: 'Test strategy', def: 'The general, usually long-lived testing approach for an organisation or product; a test plan applies it to one release.' }
    ],
    practice: [
      { q: 'Score these risks (likelihood × impact, 1–3) and order them: (a) login fails for all users after a release — L2, I3; (b) a typo in the footer — L3, I1; (c) currency conversion is wrong for international orders — L2, I3; (d) the admin report export is slow — L2, I1.', answer: '(a) <b>6</b>, (c) <b>6</b>, (b) <b>3</b>, (d) <b>2</b>. Test (a) and (c) first and most deeply — for ties, consider usage (login affects every user) and how detectable the problem is. Then (b), then (d). The typo is likely but cheap; the scores make that trade-off visible.' },
      { q: 'Product or project risk? (a) The test environment will be unavailable for three days; (b) password reset emails may not be sent; (c) only one tester knows the payments domain; (d) the app may crash on Android 10; (e) the payment provider contract is signed late.', answer: '<b>Project:</b> (a), (c), (e) — they threaten delivery. <b>Product:</b> (b), (d) — they are possible quality problems in the software. Project risks are managed (mitigation, contingency, escalation); product risks are addressed by testing.' },
      { q: 'You planned five days of testing but now have two. How do you decide what to do, and what do you tell stakeholders?', hint: 'Order by risk, then make the gap visible.', answer: 'Re-rank by risk: test critical and high risks first, with the deepest techniques where they matter most; reduce medium risks to main paths; drop low risks. Then tell stakeholders, in writing, exactly which risks were tested, which were tested lightly, which were not tested at all, and what could go wrong as a result — so accepting that residual risk is <b>their</b> informed decision.' },
      { q: 'Rewrite this status line honestly: “Testing complete, all tests passed.” Facts: 120 of 150 planned tests were run and all passed; 30 payment tests were blocked because the payment sandbox was down.', answer: 'For example: “<b>120 of 150</b> planned tests executed, all passed. <b>30 payment tests blocked</b> (payment sandbox down since Tuesday), so payment refunds and failed-card handling are <b>untested</b>. Recommendation: run them when the sandbox returns, or release with payments monitored closely. Decision needed from the product owner.”' }
    ],
    quiz: [
      { q: 'How is risk level most commonly determined in risk-based testing?', options: ['By the number of test cases written for a feature', 'By combining the likelihood and the impact of a problem', 'By how long the developer took to build the feature', 'By the number of defects found in the last release only'], correct: 1,
        why: ['The number of test cases is an output of risk analysis, not its input.', 'Right — likelihood × impact is the standard way to rate risk level.', 'Build time may hint at complexity, but it is not the measure of risk.', 'Defect history raises likelihood, but impact must be considered too.'] },
      { q: 'Which of these is a project risk rather than a product risk?', options: ['Checkout may calculate tax incorrectly for one region', 'The app may crash on older Android versions', 'Personal data may be exposed through an API', 'The test environment may be unavailable next week'], correct: 3,
        why: ['A wrong calculation is a quality problem in the product.', 'A crash is a product risk.', 'A data leak is a serious product (quality and security) risk.', 'Right — it threatens the project’s ability to test and deliver, not the product’s behaviour.'] },
      { q: 'You have only two of the five planned test days left. What is the best risk-based approach?', options: ['Test the highest risks first and report what stays untested', 'Run the test cases in the order they appear in the plan', 'Test the easiest areas first so more test cases pass', 'Insist the release date moves so that every planned test runs'], correct: 0,
        why: ['Right — spend limited time where failure would hurt most and make the gaps visible.', 'Plan order is rarely risk order; critical areas could be left untested.', 'A high pass count from easy tests hides the real risk.', 'You can recommend a delay, but the date is a business decision — and the time left should still go to the highest risks.'] },
      { q: 'What is the main difference between a test strategy and a test plan?', options: ['A strategy lists all test cases; a plan lists all the defects', 'A plan is only for Waterfall teams; a strategy only for Agile ones', 'A strategy is the general approach; a plan applies it to a release', 'They are the same document known by two different names'], correct: 2,
        why: ['Neither document is a list of test cases or defects.', 'Both exist in any model; Agile teams usually keep them lighter.', 'Right — the strategy sets the approach; the plan sets scope, schedule, people and risks for one project or release.', 'They serve different purposes and lifespans.'] },
      { q: '120 of 150 planned tests ran and passed; 30 were blocked because the payment sandbox was down. Which status report is most honest?', options: ['120/150 ran and passed; 30 payment tests blocked, risk open', 'Testing is complete and every test passed — ready to release', 'Testing failed, because 30 of the tests could not be run', '80% pass rate; the remaining tests will run after release'], correct: 0,
        why: ['Right — it gives the facts and names the untested payment risk.', 'This hides 30 unexecuted tests in a critical area.', 'Blocked tests are not failures; this misstates the result and hides that 120 passed.', '“80% pass rate” mixes blocked with passed and quietly moves risk into production.'] }
    ],
    interview: [
      { q: 'What is risk-based testing and how do you apply it?', a: 'Risk-based testing uses risk to decide what to test, how deeply and in what order. With the product owner and developers I list product risks and rate each by <b>likelihood</b> — complexity, change, defect history — and <b>impact</b> — money, safety, data, reputation, usage. Likelihood × impact gives a level. Critical and high risks get early, deep testing with several techniques and automated regression; low risks get a light pass or are consciously skipped. I track project risks separately and manage them. At the end I report coverage <b>by risk</b>, including residual risk.' },
      { q: 'How do you report test results when you could not test everything?', a: 'Honestly and specifically. I state what was tested and how deeply, what passed and failed, which risks are <b>untested</b> and why — for example, “30 payment tests blocked by the sandbox outage” — and what could go wrong as a result. I never say “all tests passed” when part of the plan did not run. I add options, such as running the blocked tests later, a feature flag or extra monitoring, and make clear that accepting the residual risk is the stakeholders’ decision.' }
    ],
    takeaways: [
      'Everyone prioritises; risk-based testing does it deliberately with likelihood × impact.',
      'Product risks are tested; project risks are managed.',
      'Risk level sets depth, techniques and order — test the highest risks first.',
      'A strategy is the general approach; a plan applies it to one release.',
      'Report residual risk in plain words; accepting it is the stakeholders’ call.'
    ],
    links: { labs: ['checkout'], challenges: ['shopflow-checkout'], interview: ['m6', 'm1', 'm3'] }
  }
]);

QA_CONTENT.addBank('foundations', [
  { level: 'beginner', topic: 'fd-what-is-testing',
    q: 'The PeopleOps payslip download works, but it takes 40 seconds. No requirement mentions speed. What should the tester do?',
    options: ['Ignore it because no requirement mentions performance', 'Report it with evidence and ask the PO what is expected', 'Log it as a critical defect and block the release now', 'Speed up the slow database query in the code directly'], correct: 1,
    why: ['Missing requirements are a gap to raise, not a reason to stay silent — testing provides information.', 'Right — share the observation with evidence and let the product owner clarify the expectation.', 'Severity and blocking need impact facts and a business decision, not an assumption.', 'Fixing code is a developer’s job; the tester reports and provides evidence.'] },
  { level: 'beginner', topic: 'fd-what-is-testing',
    q: 'Why should a tester write the expected result before running a test?',
    options: ['So that the test runs faster on the build server', 'Because test tools refuse to run tests without one', 'So the actual result is judged against the requirement', 'So that the test case looks complete during audits'], correct: 2,
    why: ['Expected results have no effect on execution speed.', 'Many tools run tests without one; the reason is about judgement, not tooling.', 'Right — deciding first stops you from accepting whatever the system happens to do.', 'Looking complete is not the point; reliable pass/fail decisions are.'] },
  { level: 'beginner', topic: 'fd-qa-qc-testing',
    q: 'After three releases with date bugs, the team adds a “time zones and date edge cases” checklist to story refinement. What is this?',
    options: ['Quality assurance — improving the process to prevent defects', 'Quality control — testing the product to detect defects', 'Regression testing — re-running old tests after a change', 'Acceptance testing — users confirming the product meets needs'], correct: 0,
    why: ['Right — changing how the team works so the defect type is less likely is QA.', 'No product is being examined here; the process is being changed.', 'Regression testing re-runs tests; this is a refinement checklist.', 'Acceptance testing involves users validating the product, not a process change.'] },
  { level: 'beginner', topic: 'fd-error-defect-failure',
    q: 'Which statement about failures is true?',
    options: ['Every defect in the code will eventually cause a failure', 'Failures can only be caused by defects in the source code', 'A failure is the human mistake that introduced the bug', 'A full disk or bad configuration can also cause failures'], correct: 3,
    why: ['Defects in code that never runs, or only under rare conditions, may never cause a failure.', 'Environment conditions and configuration can cause failures without a code defect.', 'The human mistake is the error; the failure is the observed wrong behaviour.', 'Right — environment and configuration problems can produce failures too.'] },
  { level: 'intermediate', topic: 'fd-error-defect-failure',
    q: 'A login defect is “fixed” by adding a special case for the one account that reported it. Two weeks later, other accounts fail the same way. What went wrong?',
    options: ['The regression suite was too large to run', 'The symptom was fixed but not the root cause', 'The tester should have closed the bug sooner', 'The account should have been deleted instead'], correct: 1,
    why: ['Suite size does not explain why the same failure returned for other users.', 'Right — patching one visible case left the underlying defect in place.', 'Closing sooner would not have fixed anything.', 'Deleting the account would hide the symptom even more and lose user data.'] },
  { level: 'beginner', topic: 'fd-sdlc-models',
    q: 'In which model is testing mainly a separate phase that starts after all coding is finished?',
    options: ['Agile (Scrum)', 'Iterative and incremental', 'Waterfall', 'Continuous deployment'], correct: 2,
    why: ['In Scrum, testing happens continuously inside every sprint.', 'Iterative models test each increment as it is built.', 'Right — Waterfall runs phases in sequence, with testing after implementation.', 'Continuous deployment tests every change automatically in a pipeline.'] },
  { level: 'intermediate', topic: 'fd-stlc',
    q: 'Test case design is finished, but the staging environment will not be ready for three more days. Which response reflects good STLC practice?',
    options: ['Start executing tests on a developer’s laptop and count the results', 'Report the delay as a project risk and adjust the plan', 'Mark the test cycle as complete because design is done', 'Skip environment setup and test directly in production'], correct: 1,
    why: ['Results from an uncontrolled environment can mislead; at most use it for early exploration, not official results.', 'Right — an unavailable environment is a project risk; make it visible and re-plan.', 'Design is only one phase; execution and closure have not happened.', 'Testing in production instead of staging puts real users and data at risk.'] },
  { level: 'intermediate', topic: 'fd-levels-types',
    q: 'A developer writes a test that calls calculateFee() with an amount of 0 specifically to make sure the zero-amount branch in the code is executed. Which level and approach is this?',
    options: ['Unit level, white-box', 'System level, black-box', 'Integration level, grey-box', 'Acceptance level, black-box'], correct: 0,
    why: ['Right — one function in isolation, designed from the code’s branches.', 'The whole system is not involved, and the test is designed from code structure.', 'No interaction between components is being tested.', 'Acceptance testing checks business fitness, usually by users or the PO.'] },
  { level: 'advanced', topic: 'fd-levels-types',
    q: 'The team combines the PeopleOps UI, a leave service and a payroll adapter all at once. Tests fail, and nobody can tell which interface is at fault. What would help most next time?',
    options: ['Add more end-to-end UI tests at the system level', 'Repeat the same big-bang integration more often', 'Leave interface problems for users to find in UAT', 'Integrate incrementally, one component at a time'], correct: 3,
    why: ['More end-to-end tests still would not show which interface broke.', 'Repeating big-bang keeps the same localisation problem.', 'Pushing interface defects to UAT finds them later and more expensively.', 'Right — adding components step by step makes the newest interface the obvious suspect.'] },
  { level: 'intermediate', topic: 'fd-static-testing',
    q: 'Which problem is static analysis most likely to find that dynamic testing could easily miss?',
    options: ['A slow page under real production traffic', 'A confusing layout that frustrates new users', 'A security flaw in code that rarely executes', 'A payment that fails only on one bank’s network'], correct: 2,
    why: ['Performance under load needs dynamic, load-based testing.', 'Usability problems are found by watching people use the product.', 'Right — static analysis reads all code paths, including ones tests rarely execute.', 'Network-specific failures appear only when the system runs in that environment.'] },
  { level: 'advanced', topic: 'fd-static-testing',
    q: 'A safety-critical dosage calculation spec for MediBook must be reviewed, and defects must be counted by type to improve the process. Which review type fits best?',
    options: ['Informal review', 'Inspection', 'Walkthrough', 'Pair programming session'], correct: 1,
    why: ['An informal review has no defined process or metrics.', 'Right — inspections are the most formal, use checklists and roles, and collect defect metrics.', 'A walkthrough is author-led and focuses on understanding and feedback.', 'Pair programming is a development practice, not a formal review of a specification.'] },
  { level: 'intermediate', topic: 'fd-agile-testing',
    q: 'Stories keep entering the sprint without acceptance criteria, and testers discover the rules halfway through. Which practice addresses this most directly?',
    options: ['A longer regression suite at the end of the sprint', 'A testing sprint after every three development sprints', 'More detailed bug reports from the testers', 'A Definition of Ready requiring criteria with examples'], correct: 3,
    why: ['Regression checks existing behaviour; it does not clarify new stories.', 'A testing sprint delays feedback and does not fix unclear stories.', 'Better bug reports help later, but the gap is before work starts.', 'Right — stories must meet the Definition of Ready before entering a sprint.'] },
  { level: 'advanced', topic: 'fd-risk-based',
    q: 'Using likelihood × impact on a 1–3 scale, a data-leak risk in the profile API is rated L2, I3, and a tooltip typo L3, I1. What follows?',
    options: ['Test the typo first because it is more likely to happen', 'Test both equally, because every risk deserves the same depth', 'Test the data-leak risk earlier and more deeply (6 vs 3)', 'Skip both because neither risk has the maximum score'], correct: 2,
    why: ['Likelihood alone ignores the much larger impact of a data leak.', 'Equal depth wastes effort on low risks and under-tests high ones.', 'Right — the higher score earns earlier and deeper testing.', 'A score of 6 is high; skipping it would leave a serious risk untested.'] },
  { level: 'intermediate', topic: 'fd-risk-based',
    q: 'What is residual risk?',
    options: ['The risk that remains after testing and other mitigation', 'A risk that was found during the previous release only', 'The risk caused by testers making mistakes in test cases', 'A risk that is scored low and can always be ignored'], correct: 0,
    why: ['Right — no amount of testing removes all risk; what remains must be reported and accepted.', 'Timing of discovery does not define residual risk.', 'Test mistakes are one source of risk, not the definition.', 'Low risks can be accepted, but residual risk includes anything left untested or unresolved.'] }
]);

QA_CONTENT.addDrills('foundations', [
  {
    id: 'fd-d1',
    type: 'classify',
    title: 'Error, defect or failure?',
    level: 'beginner',
    prompt: 'Sort each statement into the right part of the chain: the human mistake, the flaw it leaves in a work product, or the wrong behaviour someone observes.',
    categories: ['Error (human mistake)', 'Defect (flaw in a work product)', 'Failure (observed wrong behaviour)'],
    items: [
      { text: 'A developer misremembers the leap-year rule.', cat: 0, why: 'A human misunderstanding — the <b>error</b> that starts the chain.' },
      { text: 'The date function treats the year 2100 as a leap year.', cat: 1, why: 'A flaw in the code. (2100 is divisible by 100 but not by 400, so it is <b>not</b> a leap year.)' },
      { text: 'The booking calendar offers 29 February in a year that has no 29 February.', cat: 2, why: 'Wrong behaviour that a user can observe — a <b>failure</b>.' },
      { text: 'A business analyst copies the wrong refund period into a user story.', cat: 0, why: 'The human mistake itself is the <b>error</b>.' },
      { text: 'The user story says refunds are allowed for 3 days instead of 30.', cat: 1, why: 'Defects live in requirements too — this is a flaw in a work product.' },
      { text: 'The SQL query that loads invoices is missing a condition on the user ID.', cat: 1, why: 'A flaw in code: a <b>defect</b>, whether or not it has caused a failure yet.' },
      { text: 'A customer receives another customer’s invoice by email.', cat: 2, why: 'The observed wrong behaviour — the <b>failure</b> (probably caused by the missing condition).' },
      { text: 'The app crashes when a user uploads a 12 MB photo.', cat: 2, why: 'A visible wrong behaviour at runtime — a <b>failure</b>. The defect behind it still has to be found.' }
    ]
  },
  {
    id: 'fd-d2',
    type: 'order',
    title: 'Order the STLC phases',
    level: 'beginner',
    prompt: 'Put the phases of the software testing life cycle in the order they normally begin.',
    items: ['Requirement analysis', 'Test planning', 'Test case design', 'Test environment setup', 'Test execution', 'Test closure'],
    explain: 'First understand <b>what</b> to test (requirement analysis), then decide <b>how</b> (planning), then write the tests (design). The environment must be ready before execution — in practice setup often overlaps with design. Execution produces results and defect reports, and <b>closure</b> checks exit criteria and writes the summary report.'
  },
  {
    id: 'fd-d3',
    type: 'spot',
    title: 'Spot the false statements about testing principles',
    level: 'beginner',
    prompt: 'A new team member wrote these notes about the seven testing principles. Select every statement that is wrong.',
    lines: [
      { text: 'If all our tests pass, we have proved the software has no defects.', flaw: true, why: 'Testing shows the <b>presence</b> of defects, not their absence. Passing tests reduce risk; they prove nothing about defects nobody tested for.' },
      { text: 'Defects often cluster in a small number of modules.', flaw: false, why: 'Correct — defect clustering. Use defect history to focus testing.' },
      { text: 'With careful planning we can test every input combination of a real system.', flaw: true, why: '<b>Exhaustive testing is impossible</b> for anything but trivial cases. Use risk and techniques to choose a small, strong set.' },
      { text: 'Running the same tests again and again finds fewer new defects over time.', flaw: false, why: 'Correct — tests wear out (the pesticide paradox). Refresh tests and data.' },
      { text: 'A safety-critical medical app should be tested exactly like a marketing website.', flaw: true, why: 'Testing is <b>context dependent</b>: risk, regulations and impact change the depth, techniques and documentation.' },
      { text: 'Testing activities should start as early as possible, even before code exists.', flaw: false, why: 'Correct — early testing, such as reviewing requirements, saves time and money.' },
      { text: 'A system with very few defects is guaranteed to satisfy its users.', flaw: true, why: 'The <b>absence-of-defects fallacy</b>: a system can match its spec and still fail to meet real needs.' },
      { text: 'Regression tests are still worth repeating, even though they rarely find new bugs.', flaw: false, why: 'Correct — their job is to catch regressions after changes; a quiet regression suite is a good sign, not a wasted one.' }
    ]
  },
  {
    id: 'fd-d4',
    type: 'fill',
    title: 'Complete the V-model pairs',
    level: 'intermediate',
    prompt: 'For each development stage on the left of the V-model, type the test level that checks it on the right.',
    fields: [
      { label: 'Business / user requirements are checked by … testing', accept: ['acceptance', 'acceptance testing', 'user acceptance', 'user acceptance testing', 'uat'], why: '<b>Acceptance testing</b> checks the system against business needs and user requirements.' },
      { label: 'The system requirements specification is checked by … testing', accept: ['system', 'system testing'], why: '<b>System testing</b> checks the whole integrated system against its functional and non-functional specification.' },
      { label: 'The architecture / high-level design is checked by … testing', accept: ['integration', 'integration testing', 'component integration', 'component integration testing'], why: '<b>Integration testing</b> checks the interfaces and interactions defined by the architecture.' },
      { label: 'The detailed / module design is checked by … testing', accept: ['unit', 'unit testing', 'component', 'component testing', 'module', 'module testing'], why: '<b>Unit (component) testing</b> checks each component against its detailed design.' }
    ]
  }
]);
