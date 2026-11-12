/* Qadence content · stage "code-git" · lessons 1–8 (JavaScript → TypeScript, Git, collaboration, clean test code).
   Default language path: JavaScript → TypeScript (for Playwright). Python/Java mentioned only as alternatives.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-code-git.js */
QA_CONTENT.addLessons('code-git', [
  {
    id: 'cg-js-basics',
    n: 1,
    level: 'beginner',
    title: 'Programming basics for testers (JavaScript)',
    summary: 'Read and write small JavaScript programs: values, types, variables, comparisons, conditions and loops — run with Node.',
    minutes: 20,
    objectives: [
      'Explain why testers write code and where it is used in day-to-day QA work',
      'Use let/const, strings, numbers and booleans correctly, including the 0.1 + 0.2 trap',
      'Choose === over == and predict how conditions and loops behave',
      'Run a JavaScript file with Node and read its output'
    ],
    body: [
      { t: 'p', html: 'You do not need to become a developer to be a strong tester, but reading and writing a little code changes what you can do. With code you can <b>automate repetitive checks</b>, call an API a hundred times with different data, generate test users, and read a developer’s change in a pull request to see what might break. This stage uses <b>JavaScript</b> first and then <b>TypeScript</b>, because that is what most Playwright projects use. Python and Java are fine alternatives when a team or job post asks for them — the ideas transfer.' },
      { t: 'cards', items: [
        { title: 'UI automation', html: 'Playwright tests are JavaScript or TypeScript files that click, type and assert like a user.' },
        { title: 'API checks', html: 'Small scripts send requests, read JSON and compare status codes and fields.' },
        { title: 'Test data', html: 'Loops and functions build 50 valid users or one carefully broken record in seconds.' },
        { title: 'Reading changes', html: 'Understanding an <code>if</code> or a loop in a diff helps you aim regression testing.' }
      ] },
      { t: 'h', text: 'Values, types and variables' },
      { t: 'code', lang: 'js', title: 'basics.js — run with: node basics.js', code: `const productName = 'Wireless Mouse';   // string
const price = 24.99;                    // number
const inStock = true;                   // boolean
let quantity = 2;                       // let: may be reassigned later
quantity = quantity + 1;

console.log(typeof productName);        // string
console.log(typeof inStock);            // boolean
console.log(\`\${quantity} x \${productName} at $\${price}\`);
// 3 x Wireless Mouse at $24.99
console.log(productName.length);              // 14
console.log(productName.toUpperCase());       // WIRELESS MOUSE
console.log('  qa@shopflow.test '.trim());    // qa@shopflow.test
console.log(productName.includes('Mouse'));   // true` },
      { t: 'p', html: 'Use <code>const</code> by default and <code>let</code> only when the value must change. <code>const</code> stops you from <i>reassigning</i> the name, which prevents a whole class of accidental overwrites. Text lives in <b>strings</b>; backtick strings (<b>template literals</b>) let you insert values with <code>${…}</code>, which is perfect for readable log and error messages. Strings have useful methods for checks: <code>.length</code>, <code>.trim()</code>, <code>.includes()</code>, <code>.startsWith()</code> and <code>.toLowerCase()</code>. Strings are case-sensitive: <code>\'Admin\' === \'admin\'</code> is <code>false</code>. Normalise case only when the requirement says case does not matter — otherwise you may hide a real bug.' },
      { t: 'h', text: 'Numbers and the floating-point trap' },
      { t: 'code', lang: 'js', code: `console.log(0.1 + 0.2);                 // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);         // false
const totalCents = 10 + 20;             // money as whole cents: 30
console.log((totalCents / 100).toFixed(2));   // 0.30 (a string)

console.log(Number('42'));              // 42
console.log(Number('42px'));            // NaN (“not a number”)
console.log(parseInt('42px', 10));      // 42
console.log(Number(''));                // 0  — an empty field becomes zero!
console.log(Number.isNaN(Number('abc'))); // true` },
      { t: 'callout', tone: 'warn', title: 'Never compare money as decimals', html: 'JavaScript numbers are binary floating point, so many decimals are stored inexactly and <code>0.1 + 0.2</code> is not exactly <code>0.3</code>. In test code, keep money in <b>integer minor units</b> (1250 cents or paisa) and format only for display. Also note that <code>NaN === NaN</code> is <code>false</code> — use <code>Number.isNaN()</code> to detect it. If you truly must compare two decimals, check that the difference is tiny, for example <code>Math.abs(actual - expected) &lt; 0.001</code>.' },
      { t: 'h', text: 'Comparisons and conditions' },
      { t: 'table', caption: 'Loose (==) converts types before comparing; strict (===) does not', head: ['Expression', 'Result', 'Why'], rows: [
        ['<code>1 == \'1\'</code>', '<code>true</code>', 'The string is converted to a number first'],
        ['<code>1 === \'1\'</code>', '<code>false</code>', 'Different types, so not equal'],
        ['<code>0 == \'\'</code>', '<code>true</code>', 'Empty string converts to 0 — a classic surprise'],
        ['<code>null == undefined</code>', '<code>true</code>', 'Special rule for loose equality'],
        ['<code>null === undefined</code>', '<code>false</code>', 'Strict: they are different values']
      ] },
      { t: 'p', html: 'In test code always use <code>===</code> and <code>!==</code>. If an API should return the <i>number</i> 200 but returns the <i>string</i> “200”, a loose check hides a real contract bug. Conditions also treat some values as <b>falsy</b>: <code>false</code>, <code>0</code>, <code>\'\'</code>, <code>null</code>, <code>undefined</code> and <code>NaN</code>. Everything else is truthy — including the string <code>\'0\'</code> and an empty array. So <code>if (count)</code> silently skips a cart with zero items; write <code>if (count &gt; 0)</code> when that is what you mean.' },
      { t: 'code', lang: 'js', code: `const statusCode = 404;
if (statusCode >= 200 && statusCode < 300) {
  console.log('Success');
} else if (statusCode === 404) {
  console.log('Not found');            // this branch runs
} else {
  console.log('Other status');
}

const usernames = ['ali', 'sara', 'li'];
for (let i = 0; i < usernames.length; i++) {
  console.log(i, usernames[i]);        // 0 ali, 1 sara, 2 li
}
for (const name of usernames) {        // for...of gives the values
  if (name.length < 3) {
    console.log(\`Too short: \${name}\`); // Too short: li
  }
}` },
      { t: 'p', html: 'Use the classic <code>for</code> loop when you need the index, and <code>for...of</code> when you only need each value — it is shorter and avoids off-by-one mistakes such as <code>i &lt;= usernames.length</code>. Avoid <code>for...in</code> on arrays: it gives you the indexes as strings (“0”, “1”), not the values. To run any of this, install the LTS version of <b>Node.js</b>, save the code as <code>basics.js</code> and run <code>node basics.js</code> in a terminal. Typing <code>node</code> alone opens an interactive prompt where you can test one-liners.' },
      { t: 'callout', tone: 'tip', title: 'Predict, then run', html: 'Before running a snippet, write down what you expect it to print. When reality differs, you have found a gap in your mental model — exactly the habit that makes testers good at spotting bugs.' }
    ],
    example: {
      title: 'Worked example: checking a ShopFlow price feed',
      blocks: [
        { t: 'p', html: 'ShopFlow imports prices from a supplier file where every price arrives as <b>text</b>. Your lead asks for a quick script that flags prices that are not numbers, are negative, or have more than two decimals.' },
        { t: 'code', lang: 'js', title: 'check-prices.js', code: `const prices = [
  { sku: 'MOUSE-01', price: '24.99' },
  { sku: 'KEYB-02', price: '-5' },
  { sku: 'CABLE-03', price: 'free' },
  { sku: 'DESK-04', price: '149.999' },
];

let failures = 0;
for (const item of prices) {
  const value = Number(item.price);
  const decimals = (item.price.split('.')[1] || '').length;
  if (Number.isNaN(value)) {
    console.log(\`FAIL \${item.sku}: "\${item.price}" is not a number\`);
    failures++;
  } else if (value < 0) {
    console.log(\`FAIL \${item.sku}: negative price \${value}\`);
    failures++;
  } else if (decimals > 2) {
    console.log(\`FAIL \${item.sku}: more than 2 decimals (\${item.price})\`);
    failures++;
  } else {
    console.log(\`PASS \${item.sku}\`);
  }
}
console.log(\`\${failures} of \${prices.length} prices failed\`);` },
        { t: 'code', lang: 'text', title: 'Output', code: `PASS MOUSE-01
FAIL KEYB-02: negative price -5
FAIL CABLE-03: "free" is not a number
FAIL DESK-04: more than 2 decimals (149.999)
3 of 4 prices failed` },
        { t: 'p', html: 'Now think like a tester about your own script: what if a price is an empty string? <code>Number(\'\')</code> is <code>0</code>, so an empty price would <b>pass</b>. Add a check such as <code>item.price.trim() === \'\'</code> before the others. Questioning your test code is as important as questioning the product.' }
      ]
    },
    explain: {
      'ur': 'Tester کے لیے coding کا مقصد software بنانا نہیں بلکہ checks کو automate کرنا، test data بنانا اور developer کا code سمجھنا ہے۔ JavaScript میں values کی بنیادی types یہ ہیں: string (متن)، number اور boolean (true یا false)۔ جو value نہیں بدلنی اس کے لیے const اور جو بدلنی ہو اس کے لیے let استعمال کریں۔ موازنے کے لیے ہمیشہ === لکھیں، کیونکہ == پہلے type بدل دیتا ہے: 1 == \'1\' کا جواب true ہے مگر 1 === \'1\' کا false۔ ایک مشہور جال: 0.1 + 0.2 کا جواب 0.30000000000000004 آتا ہے، اس لیے پیسوں کا حساب پیسوں یا cents میں پورے نمبروں سے کریں۔ اپنا code چلانے کے لیے terminal میں node file.js لکھیں اور output خود چیک کریں۔',
      'ur-Latn': 'Tester ke liye coding ka maqsad software banana nahi, balke checks ko automate karna, test data banana aur developer ka code samajhna hai. JavaScript mein values ki basic types yeh hain: string (text), number aur boolean (true ya false). Jo value nahi badalni us ke liye const, aur jo badalni ho us ke liye let use karein. Compare karne ke liye hamesha === likhein, kyun ke == pehle type badal deta hai: 1 == \'1\' true deta hai magar 1 === \'1\' false. Ek mashhoor trap: 0.1 + 0.2 ka jawab 0.30000000000000004 aata hai, is liye paison ka hisaab paisay ya cents mein whole numbers se karein. Apna code chalane ke liye terminal mein node file.js likhein aur output khud check karein.',
      'hi': 'Tester के लिए coding का मक़सद software बनाना नहीं, बल्कि checks को automate करना, test data बनाना और developer का code समझना है। JavaScript में values के मूल types ये हैं: string (text), number और boolean (true या false)। जो value नहीं बदलनी, उसके लिए const और जो बदलनी हो, उसके लिए let इस्तेमाल करें। तुलना के लिए हमेशा === लिखें, क्योंकि == पहले type बदल देता है: 1 == \'1\' का जवाब true है, लेकिन 1 === \'1\' का false। एक मशहूर जाल: 0.1 + 0.2 का जवाब 0.30000000000000004 आता है, इसलिए पैसों का हिसाब पैसे या cents में पूरे numbers से करें। अपना code चलाने के लिए terminal में node file.js लिखें और output ख़ुद जाँचें।',
      'ar': 'الهدف من البرمجة بالنسبة للمختبِر ليس بناء البرنامج، بل أتمتة الفحوص (automation) وتجهيز بيانات الاختبار وفهم كود المطوّرين. في JavaScript الأنواع الأساسية للقيم هي: string (نص) وnumber (رقم) وboolean (صحيح أو خطأ). استخدم const للقيمة التي لن تتغيّر، وlet للقيمة التي ستتغيّر. وللمقارنة اكتب دائمًا === لأن == تحوّل النوع أولًا: فالتعبير 1 == \'1\' يعطي true، بينما 1 === \'1\' يعطي false. ومن الفخاخ الشهيرة أن 0.1 + 0.2 يساوي 0.30000000000000004، لذلك احسب المبالغ المالية بأعداد صحيحة مثل السنتات. لتشغيل الكود اكتب في الطرفية node file.js وتحقّق من الناتج بنفسك.',
      'es': 'Para un tester, programar no significa construir el producto, sino automatizar comprobaciones, preparar datos de prueba y entender el código de los desarrolladores. En JavaScript los tipos básicos de valores son string (texto), number y boolean (true o false). Usa const para valores que no cambian y let para los que sí cambian. Para comparar escribe siempre ===, porque == convierte el tipo primero: 1 == \'1\' da true, pero 1 === \'1\' da false. Una trampa famosa: 0.1 + 0.2 da 0.30000000000000004, así que calcula el dinero con números enteros, por ejemplo en céntimos. Para ejecutar tu código escribe node archivo.js en la terminal y revisa la salida tú mismo.'
    },
    keyTerms: [
      { term: 'const / let', def: 'Ways to declare a variable. const cannot be reassigned; let can. Prefer const unless the value must change.' },
      { term: 'Strict equality (===)', def: 'Compares value and type without conversion. 1 === \'1\' is false. Use it instead of == in test code.' },
      { term: 'Floating point', def: 'How JavaScript stores numbers. Many decimals are inexact, so 0.1 + 0.2 is 0.30000000000000004.' },
      { term: 'Truthy / falsy', def: 'How a value behaves in a condition. Falsy: false, 0, \'\', null, undefined, NaN. Everything else is truthy.' },
      { term: 'Template literal', def: 'A backtick string that can embed values with ${…}, e.g. `Order ${id} failed`.' },
      { term: 'Node.js', def: 'A program that runs JavaScript outside the browser: node file.js. Playwright tests run on Node.' }
    ],
    practice: [
      { q: 'Predict the output of each line, then check with Node: <code>\'5\' + 3</code>, <code>\'5\' - 3</code>, <code>0.1 * 3</code>, <code>typeof NaN</code>.', hint: 'The + operator joins strings; the - operator only works on numbers.', answer: '<code>\'53\'</code> (string concatenation), <code>2</code> (the string is converted to a number), <code>0.30000000000000004</code> (floating point) and <code>\'number\'</code> — NaN is a special numeric value. Mixed-type surprises like these are why test code should convert and compare types explicitly.' },
      { q: 'Write a loop over <code>[\'ali\', \'\', \'a_very_long_username\', \'sara\']</code> that prints every username that is empty or longer than 10 characters.', answer: '<code>for (const u of users) { if (u.length === 0 || u.length &gt; 10) { console.log(`Check: "${u}"`); } }</code> — it prints the empty string and <code>a_very_long_username</code>. <code>for...of</code> gives values directly, and <code>u.length === 0</code> is clearer than relying on <code>\'\'</code> being falsy.' },
      { q: 'A teammate wrote <code>if (unreadCount) { showBadge(); }</code>. The API returns <code>unreadCount</code> as a number. Is there a bug? When would it matter?', hint: 'Which numbers are falsy?', answer: 'With a number, <code>0</code> is falsy, so no badge is shown for zero — probably correct. But if the API ever returns the <b>string</b> <code>\'0\'</code>, that is truthy and a badge appears with “0”. Writing <code>if (unreadCount &gt; 0)</code> states the intent, and a separate test should check the API returns a number.' },
      { q: 'Write an <code>if / else if / else</code> that prints “success” for 2xx status codes, “client error” for 4xx, “server error” for 5xx and “other” otherwise. Test it with 200, 302, 404 and 500.', answer: '<code>if (code &gt;= 200 &amp;&amp; code &lt;= 299) {…} else if (code &gt;= 400 &amp;&amp; code &lt;= 499) {…} else if (code &gt;= 500 &amp;&amp; code &lt;= 599) {…} else {…}</code>. Results: 200 → success, 302 → other, 404 → client error, 500 → server error. Notice you applied boundary thinking: 299/300 and 499/500 are the edges.' }
    ],
    quiz: [
      { q: 'What does console.log(0.1 + 0.2 === 0.3) print in JavaScript?', options: ['true', 'false', 'undefined', 'It throws a TypeError'], correct: 1,
        why: ['Mathematically true, but binary floating point stores 0.1 and 0.2 inexactly, so the sum is 0.30000000000000004.', 'Right — the sum is 0.30000000000000004, which is not strictly equal to 0.3. Keep money in integer cents.', 'A comparison always produces a boolean, never undefined.', 'Adding and comparing numbers is valid; nothing is thrown.'] },
      { q: 'An API should return the status code as the number 200. Which check belongs in your test code?', options: ['status == 200', 'status = 200', 'status == "200"', 'status === 200'], correct: 3,
        why: ['Loose equality would also pass for the string "200", hiding a contract bug.', 'A single = assigns a value; it does not compare anything.', 'Loose comparison with a string — it passes for both 200 and "200", so it proves little.', 'Correct — strict equality checks both the value and the type.'] },
      { q: 'What happens when this runs? const ids = [1, 2]; ids.push(3); console.log(ids);', options: ['It prints [ 1, 2, 3 ] because const only blocks reassignment', 'TypeError: Assignment to constant variable', 'It prints [ 1, 2 ] because const arrays are frozen', 'SyntaxError: push is not allowed on const'], correct: 0,
        why: ['Right — const protects the name from being pointed at a new value; the array itself can still change.', 'That error appears for ids = [9], a reassignment — not for push.', 'const does not freeze objects or arrays; Object.freeze would.', 'push is a normal array method and is valid syntax.'] },
      { q: 'A ShopFlow API returns cartCount as the string "0". The code is: if (cartCount) { show("Cart has items") } else { show("Cart is empty") }. What is shown?', options: ['Cart is empty', 'Nothing — the condition throws', 'Cart has items', 'Cart is empty, but only in strict mode'], correct: 2,
        why: ['That would happen for the number 0, which is falsy — but "0" is a non-empty string.', 'Any value can be used in a condition; nothing is thrown.', 'Correct — every non-empty string, including "0", is truthy. Compare explicitly: Number(cartCount) > 0.', 'Strict mode does not change truthiness rules.'] },
      { q: 'You need to print each browser name in const browsers = ["chromium", "firefox", "webkit"]. Which loop gives you the names directly?', options: ['for (const b in browsers)', 'for (const b of browsers)', 'for (let i = 0; i &lt;= browsers.length; i++)', 'if (browsers) { print(browsers) }'], correct: 1,
        why: ['for...in gives the indexes as strings ("0", "1", "2"), not the names.', 'Right — for...of iterates over the values of an array.', 'This uses &lt;= and runs one step too far, reading browsers[3], which is undefined.', 'An if statement runs once; it does not loop over the items.'] }
    ],
    interview: [
      { q: 'Why should a QA engineer learn programming, even in a mostly manual role?', a: 'Code lets me <b>scale my testing</b>: I can automate stable regression checks, call APIs with many data combinations, generate realistic test data and parse logs instead of reading them by hand. It also helps me <b>read developer changes</b> in pull requests, so my regression testing targets the code that actually changed. I still value exploratory and manual testing — code does not replace judgement. I started with JavaScript because our UI automation uses Playwright, but the same fundamentals transfer to Python or Java if a project needs them.' },
      { q: 'What is the difference between == and === in JavaScript, and which do you use in tests?', a: '<code>==</code> is loose equality: it converts types before comparing, so <code>1 == \'1\'</code> and <code>0 == \'\'</code> are both true. <code>===</code> is strict: value and type must both match. In tests I use <code>===</code> (and framework assertions like <code>toBe</code>) because a loose check can hide real bugs — for example an API returning the string “200” instead of the number 200 would break a typed client but pass a loose comparison.' }
    ],
    takeaways: [
      'Testers code to automate checks, build data and read changes — not to replace thinking.',
      'Prefer <code>const</code>; use <code>let</code> only when a value must change.',
      'Always compare with <code>===</code>; know which values are falsy.',
      '<code>0.1 + 0.2 !== 0.3</code> — keep money in integer cents.',
      'Predict the output, then run it with <code>node file.js</code>.'
    ],
    links: { challenges: ['shopflow-checkout'] }
  },
  {
    id: 'cg-functions-data',
    n: 2,
    level: 'beginner',
    title: 'Functions, arrays, objects and JSON',
    summary: 'Write small functions, query arrays with map/filter/find, work with objects and JSON, and build reusable test data.',
    minutes: 22,
    objectives: [
      'Write functions and arrow functions that take parameters and return values',
      'Use map, filter, find, some and every to check lists of data',
      'Read and copy objects, and convert between objects and JSON text',
      'Build test data with a builder function and check it with a tiny assertion helper'
    ],
    body: [
      { t: 'p', html: 'Almost every automated test does the same three things: it <b>prepares data</b>, <b>performs steps</b>, and <b>checks results</b>. Functions let you name and reuse steps (“log in”, “format a price”). Arrays and objects hold the data — a list of products, one user, an order. JSON is how that data travels between the browser, the API and your test. Master these four ideas and most test code becomes readable. In fact, a Playwright test is itself a function call that receives an object: <code>test(\'adds to cart\', async ({ page }) =&gt; { … })</code> — so you use all of them from the very first line.' },
      { t: 'h', text: 'Functions: reusable steps with inputs and outputs' },
      { t: 'code', lang: 'js', code: `// Function declaration
function formatPrice(cents) {
  return \`$\${(cents / 100).toFixed(2)}\`;
}

// Arrow function: the same idea, shorter syntax
const applyDiscount = (cents, percent) => Math.round(cents * (1 - percent / 100));

// Default parameter: role is 'viewer' unless you pass one
function makeUser(name, role = 'viewer') {
  return { name, role };
}

console.log(formatPrice(2499));                     // $24.99
console.log(formatPrice(applyDiscount(2000, 10)));  // $18.00
console.log(makeUser('Sara'));          // { name: 'Sara', role: 'viewer' }` },
      { t: 'callout', tone: 'warn', title: 'No return means undefined', html: 'A function without <code>return</code> gives back <code>undefined</code>. Arrow functions are a common trap: <code>n =&gt; n * 2</code> returns the result, but <code>n =&gt; { n * 2 }</code> has a body in braces and returns <b>undefined</b>. If a helper “passes” but checks nothing, look for a missing return first. Name functions after the outcome — <code>loginAs(user)</code>, <code>addToCart(sku)</code> — and give each one a single job, so tests read like a list of user steps.' },
      { t: 'h', text: 'Arrays and the methods testers use daily' },
      { t: 'code', lang: 'js', code: `const products = [
  { id: 1, name: 'Mouse', priceCents: 2499, inStock: true },
  { id: 2, name: 'Keyboard', priceCents: 4999, inStock: false },
  { id: 3, name: 'Monitor', priceCents: 15999, inStock: true },
];

const names = products.map(p => p.name);           // ['Mouse', 'Keyboard', 'Monitor']
const available = products.filter(p => p.inStock); // Mouse and Monitor objects
const keyboard = products.find(p => p.id === 2);   // the Keyboard object
const missing = products.find(p => p.id === 99);   // undefined
const anyFree = products.some(p => p.priceCents === 0);  // false
const allPriced = products.every(p => p.priceCents > 0); // true` },
      { t: 'table', caption: 'None of these methods change the original array', head: ['Method', 'Returns', 'Typical test use'], rows: [
        ['<code>map</code>', 'A new array of the same length', 'Extract all product names to compare with what the UI shows'],
        ['<code>filter</code>', 'A new array of matches — possibly empty <code>[]</code>', 'Collect every out-of-stock item or every failed row'],
        ['<code>find</code>', 'The first match, or <code>undefined</code>', 'Pick the order with id 42 from an API response'],
        ['<code>some</code> / <code>every</code>', '<code>true</code> or <code>false</code>', '“Is any price negative?” / “Are all emails valid?”'],
        ['<code>reduce</code>', 'One combined value', 'Add up line totals into a cart subtotal'],
        ['<code>forEach</code>', 'Nothing (<code>undefined</code>)', 'Run a step for each item — but it does not wait for <code>await</code> inside (see the async lesson)']
      ] },
      { t: 'h', text: 'Objects, destructuring and spread' },
      { t: 'code', lang: 'js', code: `const user = { email: 'qa@shopflow.test', role: 'admin', address: { city: 'Lahore' } };

console.log(user.email);           // qa@shopflow.test
console.log(user['role']);         // admin
console.log(user.address.city);    // Lahore
console.log(user.phone);           // undefined (missing key, no error)
console.log(user.phone?.number);   // undefined (optional chaining)

const { email, role } = user;      // destructuring: two new constants
const [first, second] = ['chromium', 'firefox'];
const viewer = { ...user, role: 'viewer' };  // copy, then override one field
console.log(viewer.role, user.role);         // viewer admin` },
      { t: 'p', html: 'Reading a missing key gives <code>undefined</code>, but reading a property <i>of</i> undefined throws: <code>user.phone.number</code> fails with <code>TypeError: Cannot read properties of undefined</code>. Optional chaining (<code>?.</code>) stops early instead. <b>Destructuring</b> pulls fields out by name, and you will see it constantly in Playwright: <code>async ({ page }) =&gt; {…}</code>. The <b>spread</b> syntax <code>{ ...user }</code> makes a <i>shallow</i> copy — nested objects such as <code>address</code> are still shared, so changing <code>viewer.address.city</code> would change <code>user</code> too.' },
      { t: 'h', text: 'JSON: the format APIs speak' },
      { t: 'code', lang: 'js', code: `const body = '{"id": 7, "status": "PAID", "items": [{"sku": "A1", "qty": 2}]}';
const order = JSON.parse(body);          // text -> object
console.log(order.items[0].qty);         // 2

const payload = JSON.stringify({ sku: 'A1', qty: 2 });   // object -> text
console.log(payload);                    // {"sku":"A1","qty":2}

console.log(JSON.stringify({ note: undefined, coupon: null }));  // {"coupon":null}
JSON.parse("{'id': 1}");   // throws SyntaxError: JSON needs double quotes` },
      { t: 'compare', a: { title: 'JavaScript object', items: ['Lives in memory while your code runs', 'Keys may be unquoted; strings may use \' or "', 'Can hold functions, <code>undefined</code> and Dates', 'Read fields directly: <code>order.status</code>'] }, b: { title: 'JSON text', items: ['Plain text in a request, response or file', 'Keys and strings must use double quotes', 'Only strings, numbers, booleans, <code>null</code>, arrays and objects; no comments or trailing commas', 'Must go through <code>JSON.parse</code> before you can read fields'] } },
      { t: 'p', html: '<b>Building test data.</b> Copy-pasting a ten-field user into every test hides what each test is about and breaks everywhere when a field is added. Instead, write a <b>builder</b> (also called a factory): a function that returns a complete, <i>valid</i> object with sensible defaults and lets each test override only what matters — <code>buildUser({ role: \'admin\' })</code> or <code>buildUser({ email: \'\' })</code> for a negative case. Generate unique values such as emails inside the builder so parallel tests do not collide. Builders also make negative testing cheap: one line gives you a user with a 256-character name, an empty email or a missing country, while everything else stays valid — so when the test fails, you know the special field caused it.' }
    ],
    example: {
      title: 'Worked example: a cart builder and a tiny assertion helper',
      blocks: [
        { t: 'p', html: 'Before using a framework, it helps to see what an assertion really is: compare <i>actual</i> with <i>expected</i> and fail loudly with both values in the message. Here we build ShopFlow cart lines and check the subtotal.' },
        { t: 'code', lang: 'js', title: 'cart-check.js — run with: node cart-check.js', code: `function buildCartLine(overrides = {}) {
  return { sku: 'MOUSE-01', priceCents: 2499, qty: 1, ...overrides };
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(\`\${label}: expected \${expected} but got \${actual}\`);
  }
  console.log(\`PASS \${label}\`);
}

const cart = [
  buildCartLine({ qty: 2 }),
  buildCartLine({ sku: 'CABLE-03', priceCents: 999 }),
];
const subtotal = cart.reduce((sum, line) => sum + line.priceCents * line.qty, 0);

assertEqual(cart.length, 2, 'number of lines');
assertEqual(subtotal, 5997, 'cart subtotal in cents');
assertEqual(cart.every(line => line.qty > 0), true, 'all quantities positive');` },
        { t: 'code', lang: 'text', title: 'Output', code: `PASS number of lines
PASS cart subtotal in cents
PASS all quantities positive` },
        { t: 'p', html: 'If the subtotal were wrong, the error would read <code>cart subtotal in cents: expected 6000 but got 5997</code> — a message you can act on. One limit: <code>!==</code> compares objects <b>by reference</b>, so <code>assertEqual({ id: 1 }, { id: 1 }, \'user\')</code> fails even though the contents match. That is why test frameworks offer both <code>toBe</code> (same value or same object) and <code>toEqual</code> (same contents, checked deeply).' }
      ]
    },
    explain: {
      'ur': 'Function ایک دوبارہ استعمال ہونے والی ترکیب ہے: آپ اسے input (parameters) دیتے ہیں اور یہ return کے ذریعے نتیجہ واپس دیتا ہے۔ اگر return لکھنا بھول جائیں تو جواب undefined آتا ہے۔ Array چیزوں کی فہرست ہے اور testers روزانہ اس کے methods استعمال کرتے ہیں: map ہر item کو بدل کر نئی فہرست دیتا ہے، filter شرط پوری کرنے والے items رکھتا ہے، find پہلا ملنے والا item دیتا ہے (نہ ملے تو undefined)، اور some یا every بتاتے ہیں کہ کوئی ایک یا سب items شرط پوری کرتے ہیں۔ Object میں key اور value کے جوڑے ہوتے ہیں۔ API سے آنے والا JSON صرف text ہوتا ہے: JSON.parse اسے object بناتا ہے اور JSON.stringify object کو text۔ مثال: products.filter(p => p.inStock) صرف وہ products دیتا ہے جو stock میں ہیں۔',
      'ur-Latn': 'Function ek dobara use hone wali recipe hai: aap usay input (parameters) dete hain aur woh return ke zariye result wapas deta hai. Agar return likhna bhool jaayein to jawab undefined aata hai. Array cheezon ki list hai aur testers rozana us ke methods use karte hain: map har item ko badal kar nayi list deta hai, filter sirf woh items rakhta hai jo shart poori karein, find pehla matching item deta hai (na mile to undefined), aur some ya every batate hain ke koi ek ya saare items shart poori karte hain. Object mein key aur value ke jore hote hain. API se aane wala JSON sirf text hota hai: JSON.parse usay object banata hai aur JSON.stringify object ko text. Misaal: products.filter(p => p.inStock) sirf woh products deta hai jo stock mein hain.',
      'hi': 'Function एक दोबारा इस्तेमाल होने वाली recipe है: आप उसे input (parameters) देते हैं और वह return के ज़रिए नतीजा वापस देता है। अगर return लिखना भूल जाएँ तो जवाब undefined आता है। Array चीज़ों की सूची है और testers रोज़ उसके methods इस्तेमाल करते हैं: map हर item को बदलकर नई सूची देता है, filter सिर्फ़ शर्त पूरी करने वाले items रखता है, find पहला मिलने वाला item देता है (न मिले तो undefined), और some या every बताते हैं कि कोई एक या सभी items शर्त पूरी करते हैं या नहीं। Object में key और value के जोड़े होते हैं। API से आने वाला JSON सिर्फ़ text होता है: JSON.parse उसे object बनाता है और JSON.stringify object को text। उदाहरण: products.filter(p => p.inStock) सिर्फ़ वे products देता है जो stock में हैं।',
      'ar': 'الدالة (function) وصفة يمكن إعادة استخدامها: تعطيها مدخلات (parameters) فتُرجع نتيجة باستخدام return. وإذا نسيت كتابة return فستكون النتيجة undefined. المصفوفة (array) قائمة من العناصر، ويستخدم المختبِرون دوالّها يوميًا: map تحوّل كل عنصر وتعطي قائمة جديدة، وfilter تُبقي العناصر التي تحقّق الشرط، وfind تُرجع أول عنصر مطابق أو undefined إن لم تجده، وsome وevery تخبرانك هل يحقّق عنصر واحد أو جميع العناصر الشرط. أما الكائن (object) فهو أزواج من المفاتيح والقيم. وJSON القادم من الـ API مجرد نص: JSON.parse يحوّله إلى كائن، وJSON.stringify يحوّل الكائن إلى نص. مثال: products.filter(p => p.inStock) يعطي المنتجات المتوفرة في المخزون فقط.',
      'es': 'Una función es una receta reutilizable: le das entradas (parámetros) y devuelve un resultado con return. Si olvidas el return, el resultado es undefined. Un array es una lista, y los testers usan sus métodos a diario: map transforma cada elemento y devuelve una lista nueva, filter conserva los que cumplen una condición, find devuelve el primer elemento que coincide (o undefined si no hay ninguno), y some o every indican si alguno o todos cumplen la condición. Un objeto guarda pares de clave y valor. El JSON que llega de una API es solo texto: JSON.parse lo convierte en objeto y JSON.stringify convierte un objeto en texto. Ejemplo: products.filter(p => p.inStock) devuelve solo los productos con stock.'
    },
    keyTerms: [
      { term: 'Function / return', def: 'A named, reusable block of code. Parameters are its inputs; return sends a value back. No return means undefined.' },
      { term: 'Arrow function', def: 'Short function syntax: (a, b) => a + b. With braces you must write return yourself.' },
      { term: 'map / filter / find', def: 'Array methods: transform every item, keep matching items, or get the first match (undefined if none).' },
      { term: 'Object', def: 'A collection of key–value pairs, e.g. { email: \'qa@shopflow.test\', role: \'admin\' }.' },
      { term: 'JSON', def: 'A text format for data. JSON.parse turns text into an object; JSON.stringify turns an object into text.' },
      { term: 'Test data builder', def: 'A function that returns a valid default object and lets each test override only the fields it cares about.' }
    ],
    practice: [
      { q: 'Using the <code>products</code> array from the lesson, write one expression that returns the <b>names</b> of products that are out of stock.', hint: 'Chain two methods: first keep, then transform.', answer: '<code>products.filter(p =&gt; !p.inStock).map(p =&gt; p.name)</code> returns <code>[\'Keyboard\']</code>. Filter first so <code>map</code> only works on matching items. Neither method changes the original array.' },
      { q: 'A test runs <code>products.find(p =&gt; p.id === 99).name</code> and crashes. What is the error, and how would you make the failure clearer?', answer: '<code>find</code> returns <code>undefined</code> when nothing matches, so reading <code>.name</code> throws <code>TypeError: Cannot read properties of undefined (reading \'name\')</code>. Store the result first and assert it exists — for example <code>if (!product) throw new Error(\'Product 99 not found in response\')</code>, or in a framework <code>expect(product).toBeDefined()</code> — so the report says what was missing.' },
      { q: 'What does <code>JSON.stringify({ sku: \'A1\', qty: 2, note: undefined })</code> produce? Why might this matter in an API test?', answer: '<code>{"sku":"A1","qty":2}</code> — keys with <code>undefined</code> values are silently dropped. If your test meant to send <code>note</code> as empty, the server never sees the field at all. To test “field present but empty”, send <code>null</code> or <code>\'\'</code> explicitly and know which case you are testing.' },
      { q: 'Write a <code>buildOrder(overrides)</code> builder for a ShopFlow order with <code>sku</code>, <code>qty</code> and <code>currency</code>. Then create one valid order and one negative case with quantity 0.', answer: '<code>function buildOrder(overrides = {}) { return { sku: \'MOUSE-01\', qty: 1, currency: \'PKR\', ...overrides }; }</code><br><code>const valid = buildOrder();</code><br><code>const zeroQty = buildOrder({ qty: 0 });</code><br>Spreading <code>overrides</code> last lets the test replace any default, and the test name can say exactly what is special about the data.' }
    ],
    quiz: [
      { q: 'What does this print? const double = n => { n * 2 }; console.log(double(4));', options: ['8', 'NaN', 'undefined', 'SyntaxError: missing return'], correct: 2,
        why: ['It would print 8 without the braces: n => n * 2.', 'Nothing here produces NaN; 4 * 2 is calculated, just never returned.', 'Correct — braces create a function body, and a body without return gives back undefined.', 'The syntax is valid; JavaScript does not require a return statement.'] },
      { q: 'You need the first order in an API response whose id is 42, or undefined if there is none. Which expression fits?', options: ['orders.find(o => o.id === 42)', 'orders.filter(o => o.id === 42)', 'orders.map(o => o.id === 42)', 'orders.some(o => o.id === 42)'], correct: 0,
        why: ['Right — find returns the first matching item, or undefined if nothing matches.', 'filter always returns an array (possibly empty), not a single order.', 'map returns an array of true/false values, one per order.', 'some only tells you whether a match exists (true/false); it does not give you the order.'] },
      { q: 'What is printed? const res = \'{"status":"PAID"}\'; console.log(res.status);', options: ['PAID', '"PAID"', 'SyntaxError', 'undefined'], correct: 3,
        why: ['That needs JSON.parse(res).status — res is still plain text.', 'Even after parsing, the value would be the string PAID without quotes.', 'Reading a missing property on a string is allowed; nothing is parsed, so nothing fails.', 'Correct — res is a string, and strings have no status property. Parse JSON before reading fields.'] },
      { q: 'Your helper fails when actual !== expected. Why does assertEqual({ id: 1 }, { id: 1 }, "user") throw?', options: ['The number 1 inside an object cannot be compared with !==', 'Objects are compared by reference, so two separate objects are not ===', 'Object keys must be quoted before they can be compared', 'The label must be the first argument of any assertion'], correct: 1,
        why: ['Numbers compare fine; the problem is the two objects, not the values inside.', 'Right — each {} literal creates a new object. Use a deep comparison such as toEqual for contents.', 'Quoting keys changes nothing; { id: 1 } and { "id": 1 } are the same object shape.', 'Argument order is a convention of the helper; it does not affect equality.'] },
      { q: 'Twenty ShopFlow tests each need a user with name, email, role, country and address, but most tests only care about the role. What is the best approach?', options: ['A buildUser(overrides) builder with valid defaults; each test sets only role', 'Paste the full user object into each test so every test is self-contained', 'One shared global user object that each test edits before it runs', 'Copy real customer records from a production database export'], correct: 0,
        why: ['Right — defaults stay valid in one place and each test shows only the data that matters to it.', 'Self-contained but noisy: the important field is hidden, and adding a field means editing twenty tests.', 'Shared mutable data makes tests depend on each other and fail in parallel or in a different order.', 'Production personal data is a privacy risk and changes underneath your tests.'] }
    ],
    interview: [
      { q: 'How do you create and manage test data in your automation code?', a: 'I use <b>builder or factory functions</b> that return a valid object with sensible defaults, and each test overrides only the fields it cares about, such as <code>buildUser({ role: \'admin\' })</code>. Unique values like emails are generated inside the builder so parallel runs do not collide. Where possible I create data through the API in setup rather than through the UI, and I keep tests independent — no shared, mutable user that one test changes and another depends on. I never use real production personal data.' },
      { q: 'What is the difference between JSON and a JavaScript object?', a: 'JSON is a <b>text format</b>; a JavaScript object is a <b>value in memory</b>. JSON requires double-quoted keys and strings and allows only strings, numbers, booleans, null, arrays and objects. An API response body arrives as JSON text, so I call <code>JSON.parse</code> (or <code>await response.json()</code> in Playwright) before reading fields, and <code>JSON.stringify</code> to send an object. I also remember that <code>undefined</code> values are dropped when stringifying.' }
    ],
    takeaways: [
      'Functions name and reuse steps; no <code>return</code> means <code>undefined</code>.',
      '<code>find</code> returns one item or <code>undefined</code>; <code>filter</code> always returns an array.',
      'JSON is text — parse it before reading fields, stringify it before sending.',
      'Spread makes a shallow copy; objects compare by reference.',
      'Builders give every test valid defaults and make the important data visible.'
    ],
    links: { challenges: ['shopflow-checkout'] }
  },
  {
    id: 'cg-git',
    n: 3,
    level: 'beginner',
    title: 'Git fundamentals: commits, branches and diffs',
    summary: 'Track test code with Git: stage and commit changes, read diffs, work on branches, ignore the right files and undo mistakes safely.',
    minutes: 22,
    objectives: [
      'Describe the working tree → staging area → commit flow',
      'Use git status, add, commit, log and diff to save and review changes',
      'Create branches and explain merge vs rebase at a high level',
      'Write clear commit messages, set up .gitignore and choose a safe way to undo'
    ],
    body: [
      { t: 'p', html: '<b>Git</b> is a version control system: it records the history of a project as a series of snapshots called <b>commits</b>. A <b>repository</b> (repo) is a folder whose history Git tracks. Test automation lives in repositories just like product code, so testers use Git every day — to save their own work, to review what developers changed, to run tests against a specific branch, and to find exactly which commit introduced a bug. Hosting services such as GitHub, GitLab and Bitbucket keep a shared <b>remote</b> copy of the repo. You do not need to memorise dozens of commands: about ten cover nearly all daily work, and <code>git status</code> usually tells you what to do next.' },
      { t: 'flow', caption: 'Where a change travels before teammates can see it', steps: ['Edit files (working tree)', 'git add → staging area', 'git commit → local history', 'git push → remote repo'] },
      { t: 'code', lang: 'bash', title: 'The everyday loop', code: `git status                      # what changed? what is staged?
git diff                        # unstaged changes, line by line
git add tests/login.spec.ts     # stage one file for the next commit
git diff --staged               # exactly what the next commit will contain
git commit -m "Update login test for renamed 'Log in' button"
git log --oneline               # short history, newest first
git push                        # send your commits to the remote` },
      { t: 'p', html: 'The <b>staging area</b> lets you choose what goes into a commit, so one commit can hold one logical change even if you edited five files. Run <code>git status</code> constantly — it lists modified, staged and untracked files and even suggests the next command. In <code>git diff</code> output, lines starting with <code>-</code> were removed and lines starting with <code>+</code> were added; the <code>@@ -4,6 +4,6 @@</code> header tells you the line numbers. Reading diffs is a real testing skill: a one-line change to a discount rule tells you exactly where to aim your regression tests.' },
      { t: 'h', text: 'Branches, merge and rebase' },
      { t: 'code', lang: 'bash', code: `git switch -c test/checkout-coupons   # create a branch and move to it
# ...edit, add, commit as usual...
git push -u origin test/checkout-coupons   # publish the branch

git switch main                        # go back to main
git pull                               # get teammates' latest commits
git merge test/checkout-coupons        # bring the branch's commits into main` },
      { t: 'compare', a: { title: 'Merge', items: ['Combines two branches, usually with a new <b>merge commit</b>', 'Keeps history exactly as it happened', 'Safe on shared branches — no commit is rewritten', 'History can look busy with many merge commits'] }, b: { title: 'Rebase', items: ['Replays your commits on top of the latest main', 'Produces a tidy, straight-line history', '<b>Rewrites</b> commit IDs — never rebase commits others have already pulled', 'Follow your team’s convention; use it on your own branch'] } },
      { t: 'h', text: '.gitignore and good commit messages' },
      { t: 'code', lang: 'text', title: '.gitignore for a Playwright project', code: `# dependencies and generated output
node_modules/
test-results/
playwright-report/
blob-report/
playwright/.cache/

# secrets and saved login state - never commit these
.env
playwright/.auth/` },
      { t: 'p', html: 'A <code>.gitignore</code> file lists paths Git should not track. It only affects <b>untracked</b> files: if <code>.env</code> was already committed, adding it to <code>.gitignore</code> changes nothing — you must untrack it with <code>git rm --cached .env</code> (and treat any secret in it as leaked). Write commit messages for the teammate who reads the history in six months: a short summary in the imperative mood (“Add…”, “Fix…”), ideally under about 50 characters, plus a body explaining <i>why</i> when it is not obvious.' },
      { t: 'table', head: ['Weak message', 'Better message', 'Why it is better'], rows: [
        ['fixed stuff', 'Fix flaky cart test by waiting for total to update', 'Says what changed and the reason'],
        ['update login.spec.ts', 'Add test for locked-out user error message', 'Describes behaviour, not just the file'],
        ['WIP final v2', 'Extract buildUser helper from checkout tests', 'Readable in <code>git log --oneline</code> months later']
      ] },
      { t: 'h', text: 'Undoing changes safely' },
      { t: 'table', head: ['Situation', 'Command', 'Notes'], rows: [
        ['Unstage a file but keep your edits', '<code>git restore --staged file</code>', 'Safe — the changes stay in your working tree'],
        ['Discard uncommitted edits to a file', '<code>git restore file</code>', '<b>Permanent</b> — uncommitted work cannot be recovered'],
        ['Fix the last commit before pushing', '<code>git commit --amend</code>', 'Rewrites that commit — only before you push'],
        ['Undo a commit that is already pushed', '<code>git revert &lt;hash&gt;</code>', 'Safe — adds a new commit that reverses it'],
        ['Move a branch back and drop commits', '<code>git reset --hard &lt;hash&gt;</code>', '<b>Dangerous</b> — destroys local work; never on shared branches']
      ] },
      { t: 'callout', tone: 'warn', title: 'Revert shared history, do not rewrite it', html: '<code>git revert</code> undoes a commit by adding a new one, so everyone’s history stays consistent. <code>git reset</code> plus <code>git push --force</code> rewrites history that teammates already have and can wipe out their work. On <code>main</code> or any shared branch, revert. When unsure, run <code>git status</code> and ask before running anything with <code>--hard</code> or <code>--force</code>.' }
    ],
    example: {
      title: 'Worked example: committing a login-test fix cleanly',
      blocks: [
        { t: 'p', html: 'ShopFlow renamed its “Sign in” button to “Log in”, and the login test now fails. You confirm with the product owner that the rename is intentional (otherwise it would be a product bug, not a test fix), create a branch and update the locator. Then you check what Git sees:' },
        { t: 'code', lang: 'text', title: 'git status (hint lines trimmed)', code: `On branch fix/login-button-name
Changes not staged for commit:
        modified:   tests/login.spec.ts

Untracked files:
        .env
        playwright-report/` },
        { t: 'code', lang: 'bash', code: `# Keep secrets and generated reports out of Git
echo ".env" >> .gitignore
echo "playwright-report/" >> .gitignore

# Stage only what belongs in this change, then review it
git add tests/login.spec.ts .gitignore
git diff --staged      # one locator line + two ignore rules

git commit -m "Update login test for renamed 'Log in' button"
git push -u origin fix/login-button-name` },
        { t: 'p', html: 'Notice what you did <b>not</b> do: <code>git add .</code> would have committed the <code>.env</code> file containing the QA password and a folder of generated HTML. Staging by name and reading <code>git diff --staged</code> before every commit takes ten seconds and prevents most Git accidents.' }
      ]
    },
    explain: {
      'ur': 'Git آپ کے code کی پوری تاریخ محفوظ رکھتا ہے۔ ہر commit ایک snapshot ہے جس پر آپ بعد میں واپس جا سکتے ہیں۔ تبدیلی تین جگہوں سے گزرتی ہے: working tree جہاں آپ files بدلتے ہیں، staging area جہاں git add سے آپ چنتے ہیں کہ کیا محفوظ کرنا ہے، اور commit جو git commit سے بنتا ہے۔ git status بتاتا ہے کہ کیا بدلا ہے اور git diff ہر بدلی ہوئی line دکھاتا ہے۔ نئے کام کے لیے الگ branch بنائیں، جیسے git switch -c fix/login-test، تاکہ main محفوظ رہے۔ مثال: login test ٹھیک کرنے کے بعد git add tests/login.spec.ts اور پھر git commit -m "Update login test for renamed button" لکھیں۔ جو commit push ہو چکا ہو اسے git revert سے واپس کریں، reset --hard سے نہیں، اور .env جیسی secret files کو .gitignore میں رکھیں۔',
      'ur-Latn': 'Git aap ke code ki poori history save rakhta hai. Har commit ek snapshot hai jis par aap baad mein wapas ja sakte hain. Change teen jagahon se guzarti hai: working tree jahan aap files badalte hain, staging area jahan git add se aap chunte hain ke kya save karna hai, aur commit jo git commit se banta hai. git status batata hai ke kya badla hai aur git diff har badli hui line dikhata hai. Naye kaam ke liye alag branch banayein, jaise git switch -c fix/login-test, taake main mehfooz rahe. Misaal: login test theek karne ke baad git add tests/login.spec.ts aur phir git commit -m "Update login test for renamed button" likhein. Jo commit push ho chuka ho usay git revert se wapas karein, reset --hard se nahi, aur .env jaisi secret files ko .gitignore mein rakhein.',
      'hi': 'Git आपके code का पूरा इतिहास सुरक्षित रखता है। हर commit एक snapshot है, जिस पर आप बाद में वापस जा सकते हैं। बदलाव तीन जगहों से गुज़रता है: working tree जहाँ आप files बदलते हैं, staging area जहाँ git add से आप चुनते हैं कि क्या सहेजना है, और commit जो git commit से बनता है। git status बताता है कि क्या बदला है और git diff हर बदली हुई line दिखाता है। नए काम के लिए अलग branch बनाएँ, जैसे git switch -c fix/login-test, ताकि main सुरक्षित रहे। उदाहरण: login test ठीक करने के बाद git add tests/login.spec.ts और फिर git commit -m "Update login test for renamed button" लिखें। जो commit push हो चुका हो, उसे git revert से वापस करें, reset --hard से नहीं, और .env जैसी secret files को .gitignore में रखें।',
      'ar': 'يحفظ Git تاريخ الكود بالكامل، وكل commit هو لقطة (snapshot) يمكنك الرجوع إليها لاحقًا. يمرّ التغيير بثلاث مراحل: مجلد العمل (working tree) حيث تعدّل الملفات، ثم منطقة التجهيز (staging area) حيث تختار بالأمر git add ما تريد حفظه، ثم الـ commit الذي يُنشئه الأمر git commit. يُظهر git status ما الذي تغيّر، ويعرض git diff كل سطر تم تعديله. أنشئ فرعًا (branch) مستقلًا لكل عمل جديد، مثل git switch -c fix/login-test، حتى يبقى main آمنًا. مثال: بعد إصلاح اختبار تسجيل الدخول اكتب git add tests/login.spec.ts ثم git commit -m "Update login test for renamed button". وإذا كان الـ commit قد دُفع (push) فتراجع عنه باستخدام git revert وليس reset --hard، واحتفظ بملفات الأسرار مثل .env داخل .gitignore.',
      'es': 'Git guarda todo el historial de tu código. Cada commit es una instantánea (snapshot) a la que puedes volver más tarde. Un cambio pasa por tres zonas: el working tree, donde editas archivos; el staging area, donde eliges con git add qué guardar; y el commit, que creas con git commit. git status te dice qué ha cambiado y git diff muestra cada línea modificada. Crea una rama (branch) para cada trabajo nuevo, por ejemplo git switch -c fix/login-test, para que main quede protegida. Ejemplo: tras arreglar el test de login, escribe git add tests/login.spec.ts y luego git commit -m "Update login test for renamed button". Si el commit ya está publicado con push, deshazlo con git revert y no con reset --hard, y deja los archivos secretos como .env en el .gitignore.'
    },
    keyTerms: [
      { term: 'Repository', def: 'A project folder whose full history Git tracks. A remote repository is the shared copy on a server such as GitHub or GitLab.' },
      { term: 'Staging area', def: 'Also called the index. Holds the changes you selected with git add for the next commit.' },
      { term: 'Commit', def: 'A saved snapshot of staged changes with an author, a message and a unique hash (ID).' },
      { term: 'Branch', def: 'A movable pointer to a line of commits, so work can happen in parallel without touching main.' },
      { term: 'git revert', def: 'Undoes a commit by creating a new commit with the opposite changes. Safe for shared history.' },
      { term: '.gitignore', def: 'A file listing paths Git should not track, such as node_modules/, reports and .env. Does not untrack files already committed.' }
    ],
    practice: [
      { q: 'You changed a test and want teammates to see it. Put these in order and say what each does: <code>git commit</code>, <code>git status</code>, <code>git push</code>, <code>git add</code>, <code>git diff --staged</code>.', answer: '<code>git status</code> (see what changed) → <code>git add</code> (stage the files that belong together) → <code>git diff --staged</code> (review exactly what will be committed) → <code>git commit -m "…"</code> (save the snapshot locally) → <code>git push</code> (send it to the remote).' },
      { q: 'Rewrite these commit messages so they are useful: “changes”, “fix test”, “asdf”. Invent a plausible change for each.', answer: 'For example: “Add boundary tests for coupon expiry date”, “Fix flaky search test by waiting for results list”, “Remove duplicate login steps from checkout tests”. Each starts with an imperative verb, names the behaviour or area, and would make sense in <code>git log --oneline</code>.' },
      { q: 'You ran <code>git add .</code> and <code>git status</code> now shows <code>playwright-report/</code> staged. How do you unstage it and stop it happening again?', hint: 'One command unstages; one file prevents it.', answer: 'Run <code>git restore --staged playwright-report/</code> to unstage it (your files stay on disk), then add <code>playwright-report/</code> to <code>.gitignore</code> and commit that change. Next time, stage files by name and check <code>git status</code> before committing.' },
      { q: 'A diff on a pull request shows <code>-  if (subtotal &gt; 5000) {</code> and <code>+  if (subtotal &gt;= 5000) {</code> in the free-shipping code. What does it mean and what would you test?', answer: 'The free-shipping rule changed from “more than 5000 cents” to “5000 cents or more”. Test the boundary: 4999 (charged), 5000 (now free — the changed behaviour) and 5001 (free). Also check whether the UI text and any API documentation match the new rule.' }
    ],
    quiz: [
      { q: 'You edited login.spec.ts and ran git add login.spec.ts. Which command shows exactly what will go into your next commit?', options: ['git log', 'git diff', 'git status --short', 'git diff --staged'], correct: 3,
        why: ['git log shows commits already made, not the staged change.', 'Plain git diff shows unstaged changes only — after git add it may show nothing.', 'Short status lists which files are staged, but not the actual lines.', 'Correct — it shows the staged changes line by line, which is what the commit will contain.'] },
      { q: 'You pushed a commit to the shared main branch that breaks the test suite, and teammates have already pulled it. What is the safest way to undo it?', options: ['git reset --hard HEAD~1, then git push --force', 'git revert with that commit’s hash, then push', 'Delete the remote repository and push again', 'git restore . and then push'], correct: 1,
        why: ['This rewrites shared history and can destroy teammates’ work when they sync.', 'Right — revert adds a new commit that reverses the change, so nobody’s history is rewritten.', 'Far too destructive and loses history for everyone.', 'git restore only discards uncommitted local edits; the pushed commit is untouched.'] },
      { q: '.env was committed last week. Today you add .env to .gitignore. What happens to the .env file in Git?', options: ['Git removes .env from every past commit on the next push', 'Git stops tracking it and deletes it from the remote on push', 'It stays tracked; untrack it with git rm --cached and rotate its secrets', 'Git shows an error because an ignored file already exists'], correct: 2,
        why: ['.gitignore never rewrites history; the old commits still contain the file.', '.gitignore only affects untracked files, so nothing changes for a tracked one.', 'Correct — untrack it, commit that, and treat any secret it contained as leaked.', 'No error appears; Git simply keeps tracking the file.'] },
      { q: 'Which is the best commit message for a change that adds a test for the locked-out user error?', options: ['Add login test for locked-out user error message', 'fixed stuff in the tests folder today', 'Update login.spec.ts and other files', 'WIP — final version v2 (please review)'], correct: 0,
        why: ['Right — imperative, specific and describes the behaviour being tested.', 'Says nothing about what changed or why.', 'Names a file, not the behaviour; git log already shows which files changed.', 'Status notes like WIP belong in the PR conversation, not in permanent history.'] },
      { q: 'A colleague wants to rebase main, which the whole team pulls from, to make its history tidier. What is the best response?', options: ['Go ahead — rebasing is always cleaner than merging', 'Fine, as long as everyone runs git pull straight after', 'Use git reset --hard instead, which is safer than rebase', 'Avoid it — rebase rewrites commits others already have'], correct: 3,
        why: ['Tidy history is not worth rewriting commits that the whole team depends on.', 'Pulling after a rewrite causes conflicts and duplicated commits rather than fixing them.', 'reset --hard also rewrites history and can destroy work; it is not safer.', 'Correct — keep rebasing to your own unshared branch and follow the team’s merge convention.'] }
    ],
    interview: [
      { q: 'What is the difference between git merge and git rebase?', a: 'Both bring changes from one branch into another. <b>Merge</b> combines the histories, usually with a merge commit, and never rewrites existing commits — so it is safe on shared branches, though history can look busy. <b>Rebase</b> replays my commits on top of the latest base branch, giving a straight-line history, but it creates new commit IDs. So I only rebase my own branch before it is shared, or when the team’s workflow expects it, and I never rebase <code>main</code> or a branch others have pulled.' },
      { q: 'You pushed a commit that broke the build. How do you undo it?', a: 'If the commit is on a shared branch, I use <code>git revert &lt;hash&gt;</code>: it creates a new commit that reverses the change, keeps history consistent for everyone, and can go through the normal PR and CI process. I avoid <code>git reset --hard</code> with <code>push --force</code> on shared branches because it rewrites history teammates already have. Then I investigate why CI did not catch the problem before the merge and add a test if a check was missing.' }
    ],
    takeaways: [
      'Changes flow: working tree → <code>git add</code> → staging → <code>git commit</code> → <code>git push</code>.',
      'Run <code>git status</code> often and <code>git diff --staged</code> before every commit.',
      'Use a branch per change; never rebase or force-push shared branches.',
      'Commit messages describe behaviour and intent, in the imperative mood.',
      'Undo pushed work with <code>git revert</code>; keep <code>.env</code> and reports in <code>.gitignore</code>.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p4'] }
  },
  {
    id: 'cg-async',
    n: 4,
    level: 'intermediate',
    title: 'Promises and async/await',
    summary: 'Understand why browser automation is asynchronous, use promises and async/await correctly, and avoid the missing-await flaky-test bug.',
    minutes: 25,
    objectives: [
      'Explain in plain terms why browser and API steps are asynchronous',
      'Describe promises and predict output order using the event loop',
      'Write async/await code with try/catch and Promise.all',
      'Recognise missing await and await-inside-forEach bugs in test code'
    ],
    body: [
      { t: 'p', html: 'When your test clicks a button, the browser is a separate program, the page may call an API, and the response may take 20 ms or 2 seconds. JavaScript does not freeze while it waits. Instead, slow operations return a <b>promise</b> — an object that says “the result will arrive later”. Every Playwright action (<code>goto</code>, <code>click</code>, <code>fill</code>) and every API call returns a promise, so understanding async code is not optional for automation engineers. Most “random” failures in beginner test suites are really async mistakes. (Playwright for Python and Java offer a synchronous style that hides much of this, but in JavaScript and TypeScript you work with promises directly.)' },
      { t: 'h', text: 'The event loop in plain terms' },
      { t: 'p', html: 'JavaScript runs your code on <b>one main thread</b>, one step at a time. Slow work — timers, network requests, browser commands — is handed to the environment (Node or the browser). When that work finishes, its callback joins a queue. The <b>event loop</b> picks up queued callbacks only when the current code has finished running. Promise callbacks (<b>microtasks</b>) are handled before timer callbacks, which explains the output below. You do not need to memorise the details; you need to know that code after an async call keeps running <i>before</i> the result arrives.' },
      { t: 'code', lang: 'js', code: `console.log('A');
setTimeout(() => console.log('B'), 0);          // timer queue
Promise.resolve().then(() => console.log('C')); // microtask queue
console.log('D');
// Output: A D C B
// Synchronous code first (A, D), then promise callbacks (C), then timers (B)` },
      { t: 'h', text: 'Promises and async/await' },
      { t: 'code', lang: 'js', code: `function fetchOrderStatus(id) {          // simulates a slow API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve('PAID');
      else reject(new Error(\`Invalid order id: \${id}\`));
    }, 100);
  });
}

// Style 1: .then / .catch chains
fetchOrderStatus(7)
  .then(status => console.log('then:', status))      // then: PAID
  .catch(err => console.log('error:', err.message));

// Style 2: async / await reads top to bottom
async function checkOrder() {
  try {
    const status = await fetchOrderStatus(-1);  // pauses checkOrder only
    console.log('await:', status);
  } catch (err) {
    console.log('caught:', err.message);  // caught: Invalid order id: -1
  }
}
checkOrder();` },
      { t: 'cards', items: [
        { title: 'Pending', html: 'The work has started but there is no result yet. Every promise starts here, and code after it keeps running.' },
        { title: 'Fulfilled', html: 'Finished successfully with a value, such as a response or a status. <code>await</code> hands you that value.' },
        { title: 'Rejected', html: 'Failed with an error, such as a timeout or a network failure. <code>await</code> throws it, so <code>try/catch</code> can handle it.' },
        { title: 'async function', html: 'Always returns a promise — even <code>return 5</code> becomes a promise of 5. Callers must <code>await</code> it, and <code>await</code> pauses only that function — not the whole program.' }
      ] },
      { t: 'h', text: 'Forgetting await: the classic flaky-test bug' },
      { t: 'code', lang: 'ts', code: `import { test, expect } from '@playwright/test';

// Broken: three missing awaits
test('apply coupon (broken)', async ({ page }) => {
  await page.goto('/cart');
  page.getByLabel('Coupon code').fill('SAVE10');            // not awaited
  page.getByRole('button', { name: 'Apply' }).click();      // not awaited
  expect(page.getByText('Discount: -$5.00')).toBeVisible(); // not awaited
});

// Fixed: every action and web-first assertion is awaited
test('apply coupon', async ({ page }) => {
  await page.goto('/cart');
  await page.getByLabel('Coupon code').fill('SAVE10');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Discount: -$5.00')).toBeVisible();
});` },
      { t: 'p', html: 'Without <code>await</code>, each line only <i>starts</i> its action and the test immediately moves on. The function can finish before the click or the assertion completes, so the test may <b>pass even though the coupon is broken</b>, or fail at random with confusing errors about a closed page. Playwright’s <b>auto-waiting</b> (locators wait for elements to be visible and enabled; web-first assertions such as <code>toBeVisible()</code> retry until a timeout) only helps if you <code>await</code> it. Auto-waiting will not fix a wrong locator or a genuine race in the app, so a hard-coded <code>page.waitForTimeout(3000)</code> is never the right cure. Note that neither JavaScript nor TypeScript reports a missing <code>await</code> as an error: an unawaited promise is perfectly valid code, which is exactly why this bug survives code review so often.' },
      { t: 'callout', tone: 'tip', title: 'Let tools catch missing awaits', html: 'Enable the ESLint rule <code>@typescript-eslint/no-floating-promises</code> (and <code>playwright/missing-playwright-await</code> from the Playwright ESLint plugin). They flag promises that are created but never awaited — before the flaky test ever reaches CI. Turn them on as errors, not warnings, so a missing <code>await</code> blocks the pull request instead of becoming a nightly mystery.' },
      { t: 'h', text: 'Running things in parallel and handling errors' },
      { t: 'code', lang: 'js', code: `const wait = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

async function setUpUsers() {
  // One after another: about 600 ms
  const a = await wait(300, 'user A');
  const b = await wait(300, 'user B');

  // Independent work in parallel: about 300 ms
  const [c, d] = await Promise.all([wait(300, 'user C'), wait(300, 'user D')]);
  console.log(a, b, c, d);   // user A user B user C user D
}
setUpUsers();` },
      { t: 'callout', tone: 'warn', title: 'await inside forEach does not wait', html: '<code>Promise.all</code> rejects as soon as <i>any</i> promise rejects; use <code>Promise.allSettled</code> when you need every result. And never write <code>items.forEach(async item =&gt; { await … })</code>: <code>forEach</code> ignores the promises, so the code after it runs before the steps finish. Use <code>for (const item of items) { await … }</code> for steps in order, or <code>Promise.all(items.map(…))</code> for independent work.' }
    ],
    example: {
      title: 'Worked example: fixing a flaky ShopFlow coupon test',
      blocks: [
        { t: 'p', html: 'This test passes on a fast laptop, fails about one run in five in CI, and once passed while the coupon service was down. Read it slowly and look for async problems before reading the diagnosis.' },
        { t: 'code', lang: 'ts', title: 'Before', code: `test('applies coupons', async ({ page }) => {
  await page.goto('/cart');
  ['SAVE10', 'WELCOME5'].forEach(async code => {
    await page.getByLabel('Coupon code').fill(code);
    await page.getByRole('button', { name: 'Apply' }).click();
  });
  await page.waitForTimeout(3000);
  expect(await page.getByTestId('discount').textContent()).not.toBe('');
});` },
        { t: 'p', html: '<b>Diagnosis:</b> (1) <code>forEach</code> starts both coupons at once and does not wait, so the two fills race. (2) The 3-second sleep hides the race on a fast machine but is too short on a slow CI runner — and wastes 3 seconds when the app is quick. (3) <code>textContent()</code> takes a single snapshot, so the check does not retry; it can read stale text from before the discount updated.' },
        { t: 'code', lang: 'ts', title: 'After', code: `test('applies coupon SAVE10', async ({ page }) => {
  await page.goto('/cart');
  await page.getByLabel('Coupon code').fill('SAVE10');

  const couponResponse = page.waitForResponse(res => res.url().includes('/api/coupons'));
  await page.getByRole('button', { name: 'Apply' }).click();
  expect((await couponResponse).status()).toBe(200);

  await expect(page.getByTestId('discount')).toHaveText('-$5.00');
});` },
        { t: 'p', html: 'The fixed test awaits every step, starts listening for the coupon response <i>before</i> clicking so a fast reply is not missed, and uses a retrying web-first assertion with an exact expected value. The second coupon gets its own test, so a failure names the coupon that broke.' }
      ]
    },
    explain: {
      'ur': 'Browser میں ہر کام وقت لیتا ہے: page کھلنا، button کا click ہونا، API کا جواب آنا۔ JavaScript اس دوران رُکتا نہیں بلکہ فوراً ایک promise واپس دیتا ہے، یعنی "نتیجہ بعد میں آئے گا"۔ async function کے اندر await لکھنے سے code اس وقت تک رُکتا ہے جب تک وہ کام مکمل نہ ہو جائے۔ اگر آپ await لکھنا بھول جائیں تو test اگلی line پر چلا جاتا ہے، اور کبھی bug کے باوجود pass ہو جاتا ہے یا بلا وجہ fail ہوتا ہے۔ یہی flaky test کی سب سے عام وجہ ہے۔ مثال: await page.getByRole(\'button\', { name: \'Apply\' }).click() درست ہے، await کے بغیر غلط۔ کئی آزاد کام ایک ساتھ چلانے کے لیے Promise.all استعمال کریں، errors کو try/catch سے پکڑیں، اور waitForTimeout جیسی مقررہ انتظار سے بچیں۔',
      'ur-Latn': 'Browser mein har kaam waqt leta hai: page khulna, button ka click hona, API ka jawab aana. JavaScript is dauran rukta nahi balke foran ek promise wapas deta hai, yaani "result baad mein aayega". async function ke andar await likhne se code tab tak rukta hai jab tak woh kaam mukammal na ho jaaye. Agar aap await likhna bhool jaayein to test agli line par chala jata hai, aur kabhi bug ke bawajood pass ho jata hai ya bila wajah fail hota hai. Yehi flaky test ki sab se aam wajah hai. Misaal: await page.getByRole(\'button\', { name: \'Apply\' }).click() sahi hai, await ke baghair ghalat. Kayi independent kaam ek saath chalane ke liye Promise.all use karein, errors ko try/catch se pakrein, aur waitForTimeout jaisi fixed wait se bachein.',
      'hi': 'Browser में हर काम समय लेता है: page खुलना, button का click होना, API का जवाब आना। JavaScript इस दौरान रुकता नहीं, बल्कि तुरंत एक promise लौटा देता है, यानी "नतीजा बाद में आएगा"। async function के अंदर await लिखने से code तब तक रुकता है जब तक वह काम पूरा न हो जाए। अगर आप await लिखना भूल जाएँ, तो test अगली line पर चला जाता है और कभी bug होने के बावजूद pass हो जाता है या बिना वजह fail होता है। यही flaky test की सबसे आम वजह है। उदाहरण: await page.getByRole(\'button\', { name: \'Apply\' }).click() सही है, await के बिना ग़लत। कई स्वतंत्र काम एक साथ चलाने के लिए Promise.all इस्तेमाल करें, errors को try/catch से पकड़ें और waitForTimeout जैसे तय इंतज़ार से बचें।',
      'ar': 'كل عملية في المتصفح تستغرق وقتًا: فتح الصفحة، والنقر على زر، ووصول ردّ الـ API. لا تتوقف JavaScript أثناء ذلك، بل تُرجع فورًا promise، أي وعدًا بأن «النتيجة ستصل لاحقًا». عندما تكتب await داخل دالة async يتوقف تنفيذ تلك الدالة حتى تكتمل العملية. وإذا نسيت await ينتقل الاختبار إلى السطر التالي مباشرة، فقد ينجح رغم وجود خلل أو يفشل بشكل عشوائي، وهذا أشهر أسباب الاختبارات المتقلّبة (flaky tests). مثال: await page.getByRole(\'button\', { name: \'Apply\' }).click() صحيح، أما بدون await فهو خطأ. استخدم Promise.all لتشغيل عمليات مستقلة معًا، والتقط الأخطاء باستخدام try/catch، وتجنّب الانتظار الثابت مثل waitForTimeout.',
      'es': 'En el navegador todo lleva tiempo: abrir una página, hacer clic en un botón o recibir la respuesta de una API. JavaScript no se detiene mientras tanto: devuelve al instante una promise, es decir, «el resultado llegará más tarde». Al escribir await dentro de una función async, esa función espera hasta que la operación termine. Si olvidas el await, el test pasa a la siguiente línea y puede aprobar aunque haya un bug, o fallar al azar. Es la causa más común de tests inestables (flaky). Ejemplo: await page.getByRole(\'button\', { name: \'Apply\' }).click() es correcto; sin await, no. Usa Promise.all para ejecutar tareas independientes a la vez, captura errores con try/catch y evita esperas fijas como waitForTimeout.'
    },
    keyTerms: [
      { term: 'Asynchronous', def: 'Work that finishes later while other code keeps running, such as network calls, timers and browser actions.' },
      { term: 'Promise', def: 'An object representing a future result. It is pending, then either fulfilled with a value or rejected with an error.' },
      { term: 'async / await', def: 'async marks a function that returns a promise; await pauses that function until a promise settles and gives its value.' },
      { term: 'Event loop', def: 'The mechanism that runs queued callbacks after the current code finishes; promise callbacks run before timer callbacks.' },
      { term: 'Floating promise', def: 'A promise that is created but never awaited or handled — the usual cause of missing-await test bugs.' },
      { term: 'Promise.all', def: 'Waits for several promises in parallel and returns all results; rejects as soon as one of them rejects.' }
    ],
    practice: [
      { q: 'Predict the output order, then run it with Node: <code>console.log(\'1\'); setTimeout(() =&gt; console.log(\'2\'), 0); (async () =&gt; { console.log(\'3\'); await null; console.log(\'4\'); })(); console.log(\'5\');</code>', hint: 'An async function runs synchronously until its first await.', answer: '<b>1 3 5 4 2</b>. “1” is synchronous. The async function prints “3” straight away, then pauses at <code>await</code>. “5” is synchronous. The rest of the async function (“4”) runs as a microtask, before the timer callback (“2”).' },
      { q: 'Find every bug: <code>test(\'login\', async ({ page }) =&gt; { await page.goto(\'/login\'); page.getByLabel(\'Email\').fill(\'qa@shopflow.test\'); await page.getByRole(\'button\', { name: \'Sign in\' }).click(); expect(page.getByRole(\'heading\', { name: \'My account\' })).toBeVisible(); });</code>', answer: 'Two missing awaits: the <code>fill</code> (the click can happen before the email is typed) and the web-first assertion (<code>expect(…).toBeVisible()</code> returns a promise; without <code>await</code> the test can end before the check runs, so it may pass while login is broken). Add <code>await</code> to both.' },
      { q: 'Rewrite this so the three products are added <b>in order</b> and the check runs after all of them: <code>skus.forEach(async sku =&gt; { await addToCart(page, sku); }); await expect(cartCount).toHaveText(\'3\');</code>', answer: '<code>for (const sku of skus) { await addToCart(page, sku); }</code> then <code>await expect(cartCount).toHaveText(\'3\');</code>. <code>for...of</code> respects <code>await</code>; <code>forEach</code> does not, so the original assertion raced the additions.' },
      { q: 'A teammate says: “Playwright auto-waits, so I added <code>page.waitForTimeout(2000)</code> just to be safe.” How do you respond?', answer: 'Auto-waiting already waits for elements to be actionable, and web-first assertions retry until their timeout. A fixed sleep adds 2 seconds to every run when the app is fast and still fails when it is slower than 2 seconds. Wait for a <b>condition</b> instead: an awaited <code>expect(locator).toBeVisible()</code> or <code>toHaveText()</code>, or <code>page.waitForResponse()</code> for a specific API call.' }
    ],
    quiz: [
      { q: 'In what order are the letters printed? console.log("A"); setTimeout(() => console.log("B"), 0); Promise.resolve().then(() => console.log("C")); console.log("D");', options: ['A D C B', 'A B C D', 'A C D B', 'A D B C'], correct: 0,
        why: ['Correct — synchronous logs first (A, D), then the promise callback (microtask C), then the timer (B).', 'A 0 ms timer still waits until the current code and microtasks are finished.', 'The .then callback is queued; it cannot run before the synchronous log of D.', 'Promise callbacks run before timer callbacks, so C comes before B.'] },
      { q: 'getCartTotal is an async function that returns 5997. What is stored in total after const total = getCartTotal(); (no await)?', options: ['The number 5997', 'undefined, because nothing was awaited', 'A Promise that resolves to 5997', 'A TypeError: await is required'], correct: 2,
        why: ['You only get the number with await getCartTotal() (or .then).', 'The call does return something — a promise object, not undefined.', 'Correct — async functions always return a promise; await unwraps it.', 'Calling an async function without await is legal; it just gives you the promise.'] },
      { q: 'A Playwright test is missing await before page.getByRole("button", { name: "Pay" }).click(). What is the most likely effect?', options: ['Playwright adds the await automatically, so nothing changes', 'The test moves on before the click finishes, giving flaky or falsely passing results', 'The test always fails at once with a SyntaxError', 'The click runs twice because of auto-waiting'], correct: 1,
        why: ['Nothing adds awaits for you; that is why lint rules exist for floating promises.', 'Right — the click only starts, the next lines race it, and assertions may run too early or not at all.', 'It is valid syntax; the problem is timing, not parsing.', 'Auto-waiting delays an action until the element is ready; it never repeats the action.'] },
      { q: 'Before a test you must create three users through the API; the calls are independent. Which approach is best?', options: ['await each call inside users.forEach(async u => ...)', 'Start the calls without await so they finish faster', 'Start the calls, then wait with page.waitForTimeout(3000)', 'await Promise.all of the three calls, then check each result'], correct: 3,
        why: ['forEach ignores the returned promises, so the test continues before the users exist.', 'Without await the test cannot know when, or whether, the users were created.', 'A guess: too slow when the API is fast, too short when it is slow, and errors go unnoticed.', 'Correct — the calls run in parallel, the test waits for all of them, and a failure rejects loudly.'] },
      { q: 'Inside an async test: try { api.createOrder(badData); } catch (e) { console.log("caught"); }. The request rejects, but "caught" never prints. Why?', options: ['catch blocks do not work inside async functions', 'Rejected promises can only be handled with .then', 'Without await, the promise rejects after the try block has finished', 'createOrder must return a callback instead of a promise'], correct: 2,
        why: ['try/catch works well in async functions — when the promise is awaited.', '.catch is one option, but await inside try/catch works just as well.', 'Correct — write await api.createOrder(badData) so the rejection is thrown inside the try block.', 'Promises are the modern standard; the problem is the missing await.'] }
    ],
    interview: [
      { q: 'Why do Playwright commands need await, and what happens if you forget it?', a: 'Playwright talks to a separate browser process, so every action and web-first assertion is asynchronous and returns a promise. <code>await</code> pauses the test until that step finishes or fails. If I forget it, the step only starts, the next line runs immediately, and the test can end before an assertion runs — so it may <b>pass while the feature is broken</b> or fail randomly. I prevent it with the <code>no-floating-promises</code> lint rule and by reviewing for awaits on every <code>page</code>, <code>locator</code> and <code>expect</code> call.' },
      { q: 'A test passes locally but fails intermittently in CI. Which async causes would you check?', a: 'I would look at a trace of a failing run and check for: missing <code>await</code>s; <code>await</code> inside <code>forEach</code>; fixed sleeps like <code>waitForTimeout</code> that are too short on slower CI machines; non-retrying checks such as reading <code>textContent()</code> once instead of using <code>await expect(locator).toHaveText()</code>; and listeners like <code>waitForResponse</code> started <i>after</i> the click. I would also rule out shared test data and environment issues, because not every intermittent failure is an async bug.' }
    ],
    takeaways: [
      'Browser and API steps are asynchronous and return promises.',
      'Await every Playwright action and web-first assertion — missing await is the classic flaky bug.',
      'Use <code>try/catch</code> around awaited calls; without <code>await</code>, nothing is caught.',
      'Use <code>Promise.all</code> for independent work and <code>for...of</code> for ordered steps — never <code>await</code> in <code>forEach</code>.',
      'Wait for conditions, not fixed times; auto-waiting does not fix wrong locators.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p2', 'p6'] }
  },
  {
    id: 'cg-errors-debugging',
    n: 5,
    level: 'intermediate',
    title: 'Errors, exceptions and debugging',
    summary: 'Read stack traces, recognise common JavaScript and test errors, debug with breakpoints, and decide whether a failure is a test or product bug.',
    minutes: 25,
    objectives: [
      'Read a stack trace and jump to the line in your own code that failed',
      'Recognise TypeError, ReferenceError, SyntaxError, timeouts and assertion failures',
      'Debug with console.log, breakpoints, VS Code and Playwright’s tools',
      'Narrow a failure with binary search and a minimal reproduction, then classify it'
    ],
    body: [
      { t: 'p', html: 'A failing test is not an insult — it is <b>data</b>. Strong testers resist the urge to change code straight away and instead read the error, reproduce the failure, and narrow it down until the cause is obvious. That discipline matters doubly in automation, because a red test can mean three different things: a <b>product bug</b>, a <b>bug in the test</b>, or a problem with <b>data or the environment</b>. Your job is to find out which, with evidence.' },
      { t: 'h', text: 'Reading a stack trace' },
      { t: 'code', lang: 'js', title: 'cart.js', code: `function lineTotal(line) {
  return line.product.priceCents * line.qty;
}

function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

const lines = [
  { product: { priceCents: 2499 }, qty: 2 },
  { qty: 1 },                        // product is missing
];
console.log(cartSubtotal(lines));` },
      { t: 'code', lang: 'text', title: 'node cart.js', code: `/home/qa/shopflow-tests/cart.js:2
  return line.product.priceCents * line.qty;
                      ^

TypeError: Cannot read properties of undefined (reading 'priceCents')
    at lineTotal (/home/qa/shopflow-tests/cart.js:2:23)
    at /home/qa/shopflow-tests/cart.js:6:44
    at Array.reduce (<anonymous>)
    at cartSubtotal (/home/qa/shopflow-tests/cart.js:6:16)
    at Object.<anonymous> (/home/qa/shopflow-tests/cart.js:13:13)
    at Module._compile (node:internal/modules/cjs/loader:1705:14)
    ...` },
      { t: 'p', html: 'Read it top-down. The first line of the error gives the <b>type</b> (<code>TypeError</code>) and the <b>message</b>: something was <code>undefined</code> when the code tried to read <code>priceCents</code>. The “at” lines are the <b>call stack</b>, newest call first: <code>lineTotal</code> at <code>cart.js:2:23</code> (line 2, column 23) was called by <code>cartSubtotal</code>, which was called from line 13. Skip frames from <code>node:internal</code> or <code>node_modules</code> and open the <b>first line in your own code</b>. Here <code>line.product</code> is undefined for the second cart line — the data is missing a field.' },
      { t: 'table', caption: 'Errors you will meet every week', head: ['Error', 'Typical message', 'Usual cause in test code', 'First thing to check'], rows: [
        ['<code>TypeError</code>', '<code>Cannot read properties of undefined (reading \'name\')</code>', '<code>find()</code> matched nothing, an API field is missing, or the property path is wrong', 'Log the object <i>before</i> the dot'],
        ['<code>ReferenceError</code>', '<code>userName is not defined</code>', 'Typo, a variable used outside its scope, or a missing import', 'Spelling, scope and imports'],
        ['<code>SyntaxError</code>', '<code>Unexpected token \'&lt;\', "&lt;html&gt;…" is not valid JSON</code>', 'Parsing a response that is not JSON, such as an HTML error page', 'Log the status code and raw response text'],
        ['Timeout', '<code>Test timeout of 30000ms exceeded</code>, or an <code>expect</code> that timed out after 5000 ms', 'Locator matches nothing, element hidden, wrong page — or the app is genuinely slow or broken', 'Open the trace and look at the page at that moment'],
        ['Assertion failure', '<code>Expected: "PAID"</code> / <code>Received: "PENDING"</code>', 'Product bug, wrong expectation, or unexpected test data', 'Compare expected and received before changing anything']
      ] },
      { t: 'h', text: 'Tools: console.log, breakpoints and the debugger' },
      { t: 'compare', a: { title: 'console.log', items: ['Quick and works everywhere, including CI logs', 'Shows only what you thought to print', 'Each new question means edit, save and rerun', 'Remove debug logs before committing'] }, b: { title: 'Breakpoints / debugger', items: ['Pause execution and inspect <b>every</b> variable at that moment', 'Step line by line to watch values change', 'Best for “why is this value wrong?” questions', 'Add a <code>debugger;</code> statement or click beside a line number'] } },
      { t: 'p', html: 'In <b>VS Code</b>, click left of a line number (or press <kbd>F9</kbd>) to set a breakpoint, open a <b>JavaScript Debug Terminal</b> and run your script — it pauses at the breakpoint. Use <kbd>F10</kbd> to step over, <kbd>F11</kbd> to step into a function, <kbd>F5</kbd> to continue, and inspect values in the Variables and Watch panels. For Playwright, run a test with <code>--debug</code> to step through actions in the Inspector, add <code>await page.pause()</code> to stop at a chosen point, or open a <b>trace</b> to see the DOM, network and console for every step of a CI failure.' },
      { t: 'code', lang: 'bash', code: `node --inspect-brk cart.js                   # pause on line 1; attach a debugger
npx playwright test tests/cart.spec.ts --debug   # step through in the Inspector
npx playwright test --ui                     # UI mode: run, watch and time-travel
npx playwright test --trace on               # record a trace for every test
npx playwright show-trace path/to/trace.zip  # open a trace, e.g. one from CI` },
      { t: 'h', text: 'Narrowing down: binary search and minimal reproduction' },
      { t: 'flow', caption: 'A repeatable debugging loop', steps: ['Reproduce reliably', 'Read the whole error', 'Form one hypothesis', 'Halve the search space', 'Minimal reproduction', 'Fix and add a check'] },
      { t: 'p', html: '<b>Binary-search debugging</b> means cutting the problem in half on every step: does the failure happen with the first half of the data rows? Before or after step 12? In Git history, <code>git bisect</code> automates this — mark one good and one bad commit and it checks out the midpoint for you, so 64 commits take only about six tests. Then build a <b>minimal reproduction</b>: the fewest steps and the smallest data that still fail. A two-line API call that returns the wrong value is far more convincing in a bug report than a 25-step UI test.' },
      { t: 'cards', items: [
        { title: 'Test bug', html: 'Wrong locator, missing <code>await</code>, bad expected value, test depends on another test. The app behaves correctly when you try it by hand.' },
        { title: 'Product bug', html: 'You can reproduce the wrong behaviour manually or with a direct API call, and it contradicts the requirement.' },
        { title: 'Data or environment', html: 'Expired test account, shared data changed by another test, service down, wrong config. Often passes alone and fails in the suite, or fails only in one environment.' }
      ] }
    ],
    example: {
      title: 'Worked example: is it the test or the product?',
      blocks: [
        { t: 'p', html: 'A ShopFlow API test fails in CI with <code>TypeError: Cannot read properties of undefined (reading \'status\')</code>. A quick fix would be to wrap the line in <code>if (order)</code> — but that would hide the failure. Instead, read the test:' },
        { t: 'code', lang: 'js', code: `test('new order appears in order history', async ({ request }) => {
  const createRes = await request.post('/api/orders', { data: buildOrder() });
  const created = await createRes.json();

  const res = await request.get('/api/orders?page=1');
  const orders = await res.json();
  const order = orders.items.find(o => o.id === created.id);

  expect(order.status).toBe('PLACED');   // TypeError thrown here
});` },
        { t: 'p', html: '<b>Hypothesis:</b> <code>find</code> returned <code>undefined</code>, so the new order is not on page 1. A minimal reproduction with two direct API calls confirms it: the order is created, but page 1 lists the <b>oldest</b> orders. The requirement says “order history shows the newest orders first”, so this is a <b>product bug</b> — sorting is reversed — and you report it with the two calls as evidence.' },
        { t: 'code', lang: 'js', title: 'Improve the test so the next failure explains itself', code: `const order = orders.items.find(o => o.id === created.id);
expect(order, \`order \${created.id} should be on page 1 (newest first)\`).toBeDefined();
expect(order.status).toBe('PLACED');` },
        { t: 'p', html: 'The test now fails with a readable message instead of a <code>TypeError</code>. Notice the order of work: read the error, form a hypothesis, reproduce minimally, check the requirement, and only then decide whether the test or the product is wrong.' }
      ]
    },
    explain: {
      'ur': 'Test fail ہو تو فوراً code نہ بدلیں، پہلے error کو غور سے پڑھیں۔ پہلی line میں error کی type اور message ہوتا ہے، جیسے TypeError: Cannot read properties of undefined (reading \'name\')، یعنی .name سے پہلے والی چیز undefined ہے۔ اس کے نیچے stack trace ہوتا ہے: سب سے اوپر والی وہ line کھولیں جو آپ کی اپنی file کی طرف اشارہ کرے، جیسے cart.js:2:23 یعنی line 2۔ چھوٹے سوالوں کے لیے console.log کافی ہے، مگر breakpoint لگا کر code کو روکنا اور ہر variable دیکھنا زیادہ طاقتور ہے۔ مسئلے کو آدھا آدھا کر کے تلاش کریں (binary search) اور کم سے کم steps والی reproduction بنائیں۔ آخر میں فیصلہ کریں: test کی غلطی ہے، product کا bug ہے، یا data اور environment کا مسئلہ۔ ہر fail ہونے والا test لازمی product bug نہیں ہوتا۔',
      'ur-Latn': 'Test fail ho to foran code na badlein, pehle error ko ghaur se parhein. Pehli line mein error ki type aur message hota hai, jaise TypeError: Cannot read properties of undefined (reading \'name\'), yaani .name se pehle wali cheez undefined hai. Us ke neeche stack trace hota hai: sab se upar wali woh line kholein jo aap ki apni file ki taraf ishara kare, jaise cart.js:2:23 yaani line 2. Chhote sawalon ke liye console.log kaafi hai, magar breakpoint laga kar code ko rokna aur har variable dekhna zyada powerful hai. Masle ko aadha aadha kar ke dhoondein (binary search) aur kam se kam steps wali reproduction banayein. Aakhir mein faisla karein: test ki ghalti hai, product ka bug hai, ya data aur environment ka masla. Har fail hone wala test zaroori nahi ke product bug ho.',
      'hi': 'Test fail हो तो तुरंत code न बदलें, पहले error को ध्यान से पढ़ें। पहली line में error का type और message होता है, जैसे TypeError: Cannot read properties of undefined (reading \'name\'), यानी .name से पहले वाली चीज़ undefined है। उसके नीचे stack trace होता है: सबसे ऊपर की वह line खोलें जो आपकी अपनी file की ओर इशारा करे, जैसे cart.js:2:23 यानी line 2। छोटे सवालों के लिए console.log काफ़ी है, लेकिन breakpoint लगाकर code को रोकना और हर variable देखना ज़्यादा ताक़तवर है। समस्या को आधा-आधा करके खोजें (binary search) और कम से कम steps वाली reproduction बनाएँ। आख़िर में तय करें: गलती test की है, product का bug है, या data और environment की समस्या है। हर fail होने वाला test ज़रूरी नहीं कि product bug हो।',
      'ar': 'عندما يفشل الاختبار لا تغيّر الكود فورًا، بل اقرأ رسالة الخطأ بعناية أولًا. يحتوي السطر الأول على نوع الخطأ والرسالة، مثل TypeError: Cannot read properties of undefined (reading \'name\')، أي أن الشيء الذي يسبق .name قيمته undefined. وتحته يأتي الـ stack trace: افتح أعلى سطر يشير إلى ملفك أنت، مثل cart.js:2:23 أي السطر 2. يكفي console.log للأسئلة الصغيرة، لكن وضع breakpoint لإيقاف التنفيذ وفحص كل متغيّر أقوى بكثير. ابحث عن المشكلة بتقسيمها إلى نصفين في كل خطوة (binary search)، وابنِ إعادة إنتاج مصغّرة بأقل عدد من الخطوات. وفي النهاية قرّر: هل الخطأ في الاختبار، أم خلل في المنتج، أم مشكلة في البيانات أو البيئة؟ ليس كل اختبار فاشل خللًا في المنتج.',
      'es': 'Cuando un test falla, no cambies el código de inmediato: primero lee el error con calma. La primera línea indica el tipo y el mensaje, por ejemplo TypeError: Cannot read properties of undefined (reading \'name\'), es decir, lo que va antes de .name es undefined. Debajo aparece el stack trace: abre la primera línea que apunte a tu propio archivo, como cart.js:2:23, que significa línea 2. Para dudas pequeñas basta con console.log, pero un breakpoint que pausa la ejecución y te deja ver cada variable es mucho más potente. Busca el problema dividiéndolo a la mitad en cada paso (binary search) y crea una reproducción mínima. Al final decide: ¿es un fallo del test, un bug del producto o un problema de datos o de entorno? No todo test fallido es un bug del producto.'
    },
    keyTerms: [
      { term: 'Stack trace', def: 'The list of function calls active when an error was thrown, newest first, with file:line:column for each.' },
      { term: 'TypeError', def: 'An operation on the wrong kind of value, e.g. reading a property of undefined or calling something that is not a function.' },
      { term: 'ReferenceError', def: 'Using a name that does not exist in scope, usually a typo or a missing import.' },
      { term: 'Breakpoint', def: 'A marker that pauses execution at a line so you can inspect variables and step through code.' },
      { term: 'Minimal reproduction', def: 'The smallest set of steps and data that still shows the failure. Makes bugs easy to confirm and fix.' },
      { term: 'git bisect', def: 'A Git command that binary-searches history between a good and a bad commit to find the one that introduced a problem.' }
    ],
    practice: [
      { q: 'Using the stack trace in the lesson, answer: which function threw, at which line, and what is the root cause? What would you change — the function or the data?', answer: '<code>lineTotal</code> threw at <code>cart.js</code> line 2, column 23, while <code>cartSubtotal</code> was reducing the list. The root cause is the second cart line, which has no <code>product</code>. If real carts can never lack a product, the <b>test data</b> is wrong; if they can (say, a deleted product), the <b>code</b> needs to handle it and that case deserves its own test.' },
      { q: 'An API test fails with <code>SyntaxError: Unexpected token \'&lt;\', "&lt;html&gt;&lt;bod"... is not valid JSON</code>. What probably happened, and what do you log first?', hint: 'What starts with < ?', answer: 'The response body was <b>HTML</b>, not JSON — typically an error page from a proxy or server (502, 404, a login redirect). Log the <b>status code</b> and the <b>raw text</b> (<code>await response.text()</code>) before parsing. Better still, assert the status first so the test fails with “expected 200, received 502” instead of a parsing error.' },
      { q: 'Classify each failure as test bug, product bug, or data/environment, and say what evidence you would collect: (a) passes alone, fails in the full suite; (b) locator for “Place order” times out, the button now says “Pay now” and the change was not in any ticket; (c) checkout total is wrong when you repeat the steps by hand.', answer: '(a) Likely <b>data/environment</b> — shared state between tests; compare traces from both runs and check shared accounts or data. (b) <b>Unclear until you ask</b>: if the rename was intended, it is a test update; if not, it is a product bug (an unplanned UI change). Check with the product owner before touching the locator. (c) <b>Product bug</b> — reproduced manually; capture steps, expected vs actual totals and the API response.' },
      { q: 'A CSV import of 200 rows fails with “Invalid row” but does not say which one. Describe how you would find the bad row quickly.', answer: 'Binary search: import the first 100 rows. If that fails, split those into 50 and 50; if it passes, the bad row is in the second half. Each step halves the search, so about 8 imports locate one bad row among 200. Then reduce it to a one-row file as a minimal reproduction — and report the unhelpful error message as a separate usability bug.' }
    ],
    quiz: [
      { q: 'A test fails with TypeError: Cannot read properties of undefined (reading "email") on the line const email = user.email; — what does that tell you?', options: ['The email field is empty in the database', 'user is undefined at that point, so .email cannot be read', 'The email property is misspelled in the user object', 'The email value is not a valid string'], correct: 1,
        why: ['An empty email would be read as "" without any error.', 'Correct — the value before the dot is undefined. Find out why user was never set (for example find() matched nothing).', 'A misspelled property gives undefined as the value; it does not throw.', 'JavaScript does not validate string contents when reading a property.'] },
      { q: 'A stack trace has twelve "at" lines. Which one should you usually open first?', options: ['The last line in the trace', 'Any line from inside node_modules', 'The first line that mentions node:internal', 'The topmost line that points to your own file'], correct: 3,
        why: ['The last lines are the oldest calls, usually the runtime starting your program.', 'Library code is rarely the cause; it usually received bad input from your code.', 'node:internal frames are Node’s own machinery, not your bug.', 'Correct — the newest frame in your own code is where your logic met the problem.'] },
      { q: 'A test started failing somewhere in the last 64 commits. You know one good commit and one bad commit. What is the fastest systematic way to find the culprit?', options: ['git bisect, testing the midpoint and halving the range each step', 'Read all 64 diffs carefully from newest to oldest', 'Revert the 64 commits, then re-apply them one at a time', 'Keep rerunning the test until it happens to pass'], correct: 0,
        why: ['Right — binary search needs only about six test runs for 64 commits.', 'Possible, but slow and easy to miss a subtle change.', 'Destructive and slow — up to 64 test cycles.', 'Rerunning hides the problem; it does not locate it.'] },
      { q: 'A Playwright test times out waiting for getByRole("button", { name: "Place order" }). By hand, the same button now reads "Pay now", and no ticket mentions a rename. What should you do first?', options: ['Report a product bug saying the button is broken', 'Increase the timeout to 60 seconds for CI', 'Confirm with the product owner whether the rename was intended', 'Add automatic retries so the test passes eventually'], correct: 2,
        why: ['The button works; whether the label change is a bug depends on what was intended.', 'More time cannot help — no button with that name exists.', 'Correct — if intended, update the locator; if not, it is an unplanned UI change to report.', 'Retries only hide a deterministic failure.'] },
      { q: 'You can reproduce a pricing bug only by running a 25-step UI test. What is the best next step before reporting it?', options: ['Cut it down to the fewest steps and data that still fail', 'Report it now and attach the whole test file without notes', 'Add console.log to all 25 steps and attach the output', 'Increase the timeout and run it again to be sure'], correct: 0,
        why: ['Right — a minimal reproduction (maybe one API call) is faster to confirm, debug and retest.', 'Developers then have to do the narrowing themselves, which delays the fix.', 'Lots of logs without a hypothesis adds noise, not clarity.', 'A wrong price is not a timing problem; a longer timeout changes nothing.'] }
    ],
    interview: [
      { q: 'An automated test fails. How do you decide whether it is a test bug or a product bug?', a: 'I start with evidence, not assumptions. I read the error and stack trace, open the trace or screenshot, and rerun the test alone and in the suite. Then I <b>reproduce the behaviour manually or with a direct API call</b>. If the product misbehaves against the requirement, it is a product bug and I report it with a minimal reproduction. If the product is fine, I look at the test: locator, awaits, expected values, dependencies on other tests. If it fails only in one environment or only in the suite, I check data and configuration. A red test is never automatically a product bug.' },
      { q: 'How do you debug a failing test step by step?', a: 'Reproduce it reliably first. Read the whole error: type, message and the first stack frame in my own code. Form one hypothesis and test it — with a breakpoint or <code>page.pause()</code> to inspect state, or <code>console.log</code> for a quick check. If the cause is not obvious, I halve the search space: half the data, half the steps, or <code>git bisect</code> across commits. Once I find it, I reduce it to a minimal reproduction, fix the right thing (test, data or product via a bug report) and improve the assertion message so the next failure explains itself.' }
    ],
    takeaways: [
      'Read the error type, message and first stack frame in your own code before changing anything.',
      '<code>Cannot read properties of undefined</code> means the value <i>before</i> the dot is undefined.',
      'Use breakpoints and Playwright traces to see state, not just <code>console.log</code> guesses.',
      'Halve the search space and build a minimal reproduction.',
      'A failed test can be a test bug, a product bug or a data/environment issue — prove which.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p4', 'p5'] }
  },
  {
    id: 'cg-typescript',
    n: 6,
    level: 'intermediate',
    title: 'TypeScript essentials for test code',
    summary: 'Use TypeScript types, interfaces and unions to describe test data and page objects, and let tsc catch mistakes before tests run.',
    minutes: 24,
    objectives: [
      'Explain how types catch test-code mistakes before anything runs',
      'Annotate basic types and rely on type inference sensibly',
      'Model test data with interfaces, union types and optional properties',
      'Type a page object method and run tsc --noEmit as a quality gate'
    ],
    body: [
      { t: 'p', html: '<b>TypeScript</b> is JavaScript plus <b>types</b>: labels that say what kind of value a variable, parameter or object holds. The types are checked by the compiler and then removed, so the browser and Node still run plain JavaScript. For test code this pays off quickly. Your editor autocompletes page object methods and API fields, a typo such as <code>\'admn\'</code> is underlined before you run anything, and when a developer renames a field, every test that uses it lights up red. Most Playwright projects use TypeScript, which is why this stage moves from JavaScript to TypeScript.' },
      { t: 'h', text: 'Basic types and inference' },
      { t: 'code', lang: 'ts', code: `let username: string = 'qa_user';
let retries: number = 2;
let isAdmin: boolean = false;
const browsers: string[] = ['chromium', 'firefox', 'webkit'];

// Inference: TypeScript works out the type from the first value
const baseUrl = 'http://localhost:3000';   // type: string
let attempts = 0;                          // type: number
attempts = 'three';
// error TS2322: Type 'string' is not assignable to type 'number'.` },
      { t: 'p', html: 'You rarely need to annotate everything. Let TypeScript <b>infer</b> local variables from their values, and write types where they act as documentation and guard rails: function parameters, return values and shared test data. Avoid <code>any</code> — it switches checking off for that value and quietly spreads through your code. If you truly do not know a type yet (say, a raw API response), <code>unknown</code> is the safer choice because it forces you to check before use.' },
      { t: 'h', text: 'Describing test data with interfaces and unions' },
      { t: 'code', lang: 'ts', code: `type Role = 'customer' | 'admin' | 'support';   // a union of string literals

interface User {
  email: string;
  name: string;
  role: Role;
  phone?: string;              // optional: may be missing
}

const admin: User = { email: 'admin@shopflow.test', name: 'Admin', role: 'admin' };

const typo: User = { email: 'a@shopflow.test', name: 'Ali', role: 'admn' };
// error TS2820: Type '"admn"' is not assignable to type 'Role'. Did you mean '"admin"'?

console.log(admin.phone.length);
// error TS18048: 'admin.phone' is possibly 'undefined'.` },
      { t: 'table', head: ['Feature', 'Example', 'Mistake it catches'], rows: [
        ['Basic types', '<code>let qty: number</code>', 'Assigning text where a number is expected'],
        ['Interface / type alias', '<code>interface User { … }</code>', 'Missing or misspelled fields in test data'],
        ['Union of literals', '<code>\'PAID\' | \'PENDING\'</code>', 'Typos such as <code>\'PIAD\'</code> in statuses or roles'],
        ['Optional property', '<code>phone?: string</code>', 'Using a value that may be <code>undefined</code> without checking'],
        ['Typed function', '<code>addToCart(sku: string, qty: number)</code>', 'Arguments passed in the wrong order or of the wrong type']
      ] },
      { t: 'p', html: '<b>Interfaces</b> and <b>type aliases</b> both describe object shapes; interfaces can be extended, and type aliases can also name unions. Pick one convention per project and stay consistent. An <b>optional property</b> (<code>phone?: string</code>) has the type <code>string | undefined</code>, so TypeScript makes you handle the missing case — exactly the check that would have prevented many <code>Cannot read properties of undefined</code> errors. To narrow a union such as <code>string | number</code>, check it: <code>typeof id === \'number\'</code>.' },
      { t: 'h', text: 'Union types or enums?' },
      { t: 'compare', a: { title: 'Union of string literals', items: ['<code>type Status = \'PAID\' | \'PENDING\'</code>', 'Erased at compile time — no runtime code', 'Plain strings work, with autocompletion', 'Matches JSON values from an API directly'] }, b: { title: 'enum', items: ['<code>enum Status { Paid = \'PAID\' }</code>', 'Generates a real JavaScript object at runtime', 'You must import it and write <code>Status.Paid</code>', 'A plain <code>\'PAID\'</code> string is rejected where <code>Status</code> is expected'] } },
      { t: 'p', html: 'Both work. Many test teams prefer <b>union types</b> because test data and API responses are plain strings anyway, and unions add no runtime code. Use an enum (or an <code>as const</code> object) when you need a real list of values at runtime — for example to loop through every status in a data-driven test. Follow your project’s existing convention rather than mixing both.' },
      { t: 'h', text: 'Let tsc catch mistakes early' },
      { t: 'code', lang: 'bash', code: `npm install --save-dev typescript   # once per project
npx tsc --init                        # create a tsconfig.json
npx tsc --noEmit                      # type-check everything, write no files
npx tsc --noEmit && npx playwright test   # in CI: fail fast on type errors` },
      { t: 'callout', tone: 'warn', title: 'Playwright runs TypeScript but does not type-check it', html: 'Playwright transpiles your <code>.ts</code> files and runs them even when they contain type errors. So a test with a wrong argument type can still run — and fail in confusing ways, or pass by luck. Run <code>npx tsc --noEmit</code> locally and as a CI step, keep <code>"strict": true</code> in <code>tsconfig.json</code>, and treat casts (<code>as</code>), non-null assertions (<code>!</code>) and <code>any</code> as review red flags: each one tells the compiler to stop checking.' }
    ],
    example: {
      title: 'Worked example: typing a ShopFlow page object method',
      blocks: [
        { t: 'p', html: 'A page object wraps the locators and actions of one page so tests read like user steps. Typing its methods documents exactly what each step needs and returns.' },
        { t: 'code', lang: 'ts', title: 'pages/checkout-page.ts', code: `import { expect, type Page } from '@playwright/test';

export interface CheckoutDetails {
  fullName: string;
  city: string;
  payment: 'card' | 'cash-on-delivery';   // union of allowed values
  couponCode?: string;                     // optional
}

export class CheckoutPage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }

  async fillDetails(details: CheckoutDetails): Promise<void> {
    await this.page.getByLabel('Full name').fill(details.fullName);
    await this.page.getByLabel('City').fill(details.city);
    await this.page.getByLabel(details.payment === 'card' ? 'Card' : 'Cash on delivery').check();
    if (details.couponCode) {   // string | undefined: TypeScript makes you check
      await this.page.getByLabel('Coupon code').fill(details.couponCode);
    }
  }

  async placeOrder(): Promise<string> {
    await this.page.getByRole('button', { name: 'Place order' }).click();
    const orderId = this.page.getByTestId('order-id');
    await expect(orderId).toBeVisible();
    return (await orderId.textContent()) ?? '';
  }
}` },
        { t: 'code', lang: 'ts', title: 'tests/checkout.spec.ts', code: `import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout-page';

test('customer can pay cash on delivery', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await page.goto('/checkout');
  await checkout.fillDetails({ fullName: 'Ayesha Khan', city: 'Karachi', payment: 'cash' });
  const orderId = await checkout.placeOrder();
  expect(orderId).toMatch(/^ORD-\\d+$/);
});` },
        { t: 'code', lang: 'text', title: 'npx tsc --noEmit', code: `tests/checkout.spec.ts:7:74 - error TS2322: Type '"cash"' is not assignable to type '"card" | "cash-on-delivery"'.

Found 1 error in tests/checkout.spec.ts:7` },
        { t: 'p', html: 'Without types, <code>\'cash\'</code> would reach the page object, the ternary would pick the <b>Card</b> radio button, and the test would quietly test the wrong payment method. With types, the mistake is caught in the editor before the test runs. The return type <code>Promise&lt;string&gt;</code> also tells every caller to <code>await</code> the method and that an order id comes back.' }
      ]
    },
    explain: {
      'ur': 'TypeScript دراصل JavaScript ہی ہے، بس اس میں types شامل ہیں، یعنی یہ بتانا کہ کسی variable یا object میں کس قسم کی value ہو گی۔ اس کا فائدہ یہ ہے کہ غلطیاں test چلنے سے پہلے ہی editor میں پکڑی جاتی ہیں۔ مثال: اگر interface User میں role کی type \'customer\' | \'admin\' ہو اور آپ غلطی سے \'admn\' لکھ دیں تو TypeScript فوراً error دکھائے گا۔ phone?: string جیسی optional property کا مطلب ہے کہ value موجود نہ بھی ہو، اس لیے TypeScript آپ کو پہلے check کرنے پر مجبور کرتا ہے۔ Union type جیسے \'PAID\' | \'PENDING\' صرف اجازت والی values قبول کرتی ہے۔ یاد رکھیں، Playwright خود types check نہیں کرتا، اس لیے CI میں npx tsc --noEmit ضرور چلائیں، اور any سے بچیں کیونکہ وہ checking بند کر دیتا ہے۔',
      'ur-Latn': 'TypeScript asal mein JavaScript hi hai, bas us mein types shamil hain, yaani yeh batana ke kisi variable ya object mein kis qism ki value hogi. Is ka faida yeh hai ke ghaltiyan test chalne se pehle hi editor mein pakri jaati hain. Misaal: agar interface User mein role ki type \'customer\' | \'admin\' ho aur aap ghalti se \'admn\' likh dein to TypeScript foran error dikhayega. phone?: string jaisi optional property ka matlab hai ke value maujood na bhi ho, is liye TypeScript aap ko pehle check karne par majboor karta hai. Union type jaise \'PAID\' | \'PENDING\' sirf allowed values accept karti hai. Yaad rakhein, Playwright khud types check nahi karta, is liye CI mein npx tsc --noEmit zaroor chalayein, aur any se bachein kyun ke woh checking band kar deta hai.',
      'hi': 'TypeScript असल में JavaScript ही है, बस उसमें types जुड़े हैं, यानी यह बताना कि किसी variable या object में किस तरह की value होगी। इसका फ़ायदा यह है कि गलतियाँ test चलने से पहले ही editor में पकड़ में आ जाती हैं। उदाहरण: अगर interface User में role का type \'customer\' | \'admin\' हो और आप गलती से \'admn\' लिख दें, तो TypeScript तुरंत error दिखाएगा। phone?: string जैसी optional property का मतलब है कि value मौजूद न भी हो, इसलिए TypeScript आपको पहले check करने के लिए मजबूर करता है। Union type जैसे \'PAID\' | \'PENDING\' सिर्फ़ अनुमति वाली values स्वीकार करता है। याद रखें, Playwright ख़ुद types check नहीं करता, इसलिए CI में npx tsc --noEmit ज़रूर चलाएँ, और any से बचें क्योंकि वह checking बंद कर देता है।',
      'ar': 'TypeScript هي في الأساس JavaScript مع إضافة الأنواع (types)، أي تحديد نوع القيمة التي يحملها كل متغيّر أو كائن. والفائدة أن الأخطاء تُكتشف في المحرّر قبل تشغيل الاختبار. مثال: إذا كان نوع role في interface User هو \'customer\' | \'admin\' وكتبت بالخطأ \'admn\' فسيعرض TypeScript خطأً فورًا. والخاصية الاختيارية مثل phone?: string تعني أن القيمة قد تكون غير موجودة، لذلك يُلزمك TypeScript بالتحقق منها أولًا. أما نوع الاتحاد (union) مثل \'PAID\' | \'PENDING\' فيقبل القيم المسموح بها فقط. وتذكّر أن Playwright لا يتحقق من الأنواع بنفسه، لذا شغّل npx tsc --noEmit في CI، وتجنّب any لأنه يوقف التحقق.',
      'es': 'TypeScript es JavaScript con tipos (types): etiquetas que indican qué clase de valor guarda cada variable u objeto. La ventaja es que los errores aparecen en el editor antes de ejecutar el test. Ejemplo: si en interface User el tipo de role es \'customer\' | \'admin\' y escribes \'admn\' por error, TypeScript lo marca al instante. Una propiedad opcional como phone?: string puede faltar, así que TypeScript te obliga a comprobarla antes de usarla. Un union type como \'PAID\' | \'PENDING\' solo acepta los valores permitidos. Recuerda que Playwright no comprueba los tipos por sí mismo, así que ejecuta npx tsc --noEmit en CI y evita any, porque desactiva la comprobación.'
    },
    keyTerms: [
      { term: 'Type annotation', def: 'An explicit type written after a name, e.g. let qty: number or (sku: string) => void.' },
      { term: 'Type inference', def: 'TypeScript working out a type from the value, e.g. let attempts = 0 is inferred as number.' },
      { term: 'Interface', def: 'A named description of an object’s shape: which properties exist and their types.' },
      { term: 'Union type', def: 'A type that allows one of several options, e.g. \'PAID\' | \'PENDING\' or string | number.' },
      { term: 'Optional property', def: 'A property marked with ? that may be missing; its type includes undefined, so you must check it.' },
      { term: 'tsc --noEmit', def: 'Runs the TypeScript compiler as a checker only, reporting type errors without writing output files.' }
    ],
    practice: [
      { q: 'Write an interface <code>Product</code> for ShopFlow test data: a numeric <code>id</code>, a <code>name</code>, <code>priceCents</code>, a list of string <code>tags</code>, and an optional <code>discountPercent</code>.', answer: '<code>interface Product { id: number; name: string; priceCents: number; tags: string[]; discountPercent?: number; }</code> — the <code>?</code> makes the discount optional, so code that reads it must handle <code>undefined</code>. Keeping money as <code>priceCents</code> (an integer) avoids floating-point surprises.' },
      { q: 'Explain and fix: <code>type OrderStatus = \'PENDING\' | \'PAID\'; const order: { id: number; status: OrderStatus } = { id: 1, status: \'Paid\' };</code>', hint: 'String literal types are case-sensitive.', answer: 'TypeScript reports <code>Type \'"Paid"\' is not assignable to type \'OrderStatus\'</code> (and suggests <code>"PAID"</code>). Literal types match exactly, including case. Fix it with <code>status: \'PAID\'</code>. This is the same mistake that would silently break an API test comparing statuses as plain strings.' },
      { q: 'A helper is declared <code>function cartTotal(cart: any) { return cart.lines.reduce((s, l) =&gt; s + l.price * l.qty, 0); }</code>. Why is <code>any</code> risky here? Rewrite the signature.', answer: 'With <code>any</code>, TypeScript checks nothing: a typo like <code>cart.line</code> or a missing <code>qty</code> only fails at runtime. Better: <code>interface CartLine { priceCents: number; qty: number }</code> and <code>function cartTotal(cart: { lines: CartLine[] }): number { … }</code>. Now the editor autocompletes fields and flags wrong data before the test runs.' },
      { q: 'Your project has <code>enum Browser { Chromium = \'chromium\', Firefox = \'firefox\' }</code>. A teammate proposes replacing it with a union type. What changes, and what would you check first?', answer: 'With <code>type Browser = \'chromium\' | \'firefox\'</code>, callers pass plain strings instead of <code>Browser.Chromium</code>, and no runtime object exists. Check first whether any code <b>uses the enum at runtime</b> — for example looping over <code>Object.values(Browser)</code>. If so, replace it with <code>const BROWSERS = [\'chromium\', \'firefox\'] as const</code> and derive the type from it.' }
    ],
    quiz: [
      { q: 'What does TypeScript report for: let attempts = 0; attempts = "three";', options: ['Nothing, because let variables may change to any type', 'A runtime TypeError when the test reaches that line', 'A compile error: string is not assignable to number', 'Only a warning, since inferred types are suggestions'], correct: 2,
        why: ['let allows a new value, but not a new type — attempts was inferred as number.', 'TypeScript reports it before anything runs; at runtime JavaScript would happily store the string.', 'Correct — the type was inferred from 0, so assigning a string is error TS2322.', 'Inferred types are enforced exactly like written ones.'] },
      { q: 'Given interface User { email: string; phone?: string }, which statement is true?', options: ['A User may omit phone, and phone has type string | undefined', 'phone must always be provided, but may be an empty string', 'phone is optional at runtime but required by the compiler', 'The ? lets phone hold a value of any type at all'], correct: 0,
        why: ['Correct — that is why TypeScript asks you to check phone before using it.', 'An empty string would still be a provided value; ? means the property can be missing.', 'It is the compiler that understands ?; at runtime there are no types.', 'The type is still string; ? only adds undefined as a possibility.'] },
      { q: 'A teammate’s pull request passes npx playwright test but contains a type error. How is that possible?', options: ['It is not — Playwright fails the run on any type error', 'Type errors only appear in the browser console', 'The test runner checks types only for page objects', 'Playwright transpiles TypeScript without type-checking it'], correct: 3,
        why: ['Playwright runs tests even with type errors, so a passing run proves nothing about types.', 'Type checking happens at compile time on your machine or in CI, never in the browser.', 'There is no partial type-checking by the runner.', 'Correct — add npx tsc --noEmit to CI so type errors block the merge.'] },
      { q: 'The API documents order status as PENDING, PAID or SHIPPED. Which type best protects your test data?', options: ['status: string', 'status: "PENDING" | "PAID" | "SHIPPED"', 'status: any', 'status?: string'], correct: 1,
        why: ['Any string passes, including typos such as "PIAD".', 'Correct — a union of literals accepts only the documented values and autocompletes them.', 'any turns checking off completely.', 'Optional and still any string — weaker than the first option.'] },
      { q: 'A page object method is declared async addToCart(sku: string, qty: number). Which call does the TypeScript compiler reject?', options: ['await cart.addToCart("MOUSE-01", 2)', 'await cart.addToCart("KEYB-02", 1)', 'cart.addToCart("CABLE-03", 3) with no await', 'await cart.addToCart(2, "MOUSE-01")'], correct: 3,
        why: ['Arguments match the declared types and order.', 'Also valid — a string then a number.', 'A missing await is valid TypeScript; catch it with a lint rule such as no-floating-promises.', 'Correct — the arguments are swapped, so a number is passed where a string is expected.'] }
    ],
    interview: [
      { q: 'Why would you choose TypeScript over JavaScript for a test automation framework?', a: 'Types catch a whole class of mistakes <b>before the tests run</b>: misspelled fields in test data, wrong argument order in page object methods, and values that may be undefined. They also give autocompletion and make refactoring safe — rename a method and the compiler lists every test that needs updating. Playwright supports TypeScript out of the box, but it does not type-check during a run, so I add <code>tsc --noEmit</code> to CI. The cost is a small learning curve, which is worth it for a suite that many people maintain.' },
      { q: 'Would you use an enum or a union type for something like order status in test code?', a: 'Usually a <b>union of string literals</b>, such as <code>\'PENDING\' | \'PAID\' | \'SHIPPED\'</code>. API responses and test data are plain strings, unions match them directly, and they add no runtime code. If I need the list of values at runtime — for a data-driven test over every status — I use an <code>as const</code> array and derive the type from it, or an enum if that is the project’s convention. Consistency with the existing codebase matters more than the choice itself.' }
    ],
    takeaways: [
      'TypeScript is JavaScript plus types that are checked, then removed.',
      'Let inference handle locals; type parameters, returns and shared test data.',
      'Interfaces, unions and optional properties make test data self-checking.',
      'Playwright does not type-check — run <code>npx tsc --noEmit</code> in CI.',
      'Treat <code>any</code>, <code>as</code> and <code>!</code> as red flags in review.'
    ],
    links: { interview: ['p4'] }
  },
  {
    id: 'cg-collab',
    n: 7,
    level: 'intermediate',
    title: 'Pull requests, code review and secret hygiene',
    summary: 'Work through the pull request flow, review test code constructively, resolve simple merge conflicts and keep secrets out of repositories.',
    minutes: 22,
    objectives: [
      'Follow the branch → commit → push → pull request → review → merge workflow',
      'Review test code for correctness, stability and readability, and give useful feedback',
      'Read CI results on a pull request and resolve a basic merge conflict',
      'Keep tokens and passwords out of Git and respond correctly if one leaks'
    ],
    body: [
      { t: 'p', html: 'On a team, nobody pushes straight to <code>main</code>. Changes arrive as <b>pull requests</b> (PRs; GitLab calls them merge requests): a proposal to merge a branch, with a description, a diff, automated <b>CI checks</b> and comments from reviewers. Testers sit on both sides. You open PRs for your own test code, and you read developers’ PRs to understand what changed and plan your testing. A good PR process catches bugs before they merge and spreads knowledge across the team.' },
      { t: 'flow', caption: 'The pull request workflow', steps: ['Create a branch', 'Commit small changes', 'Push the branch', 'Open a PR', 'Review + CI checks', 'Merge'] },
      { t: 'h', text: 'What reviewers look for in test code' },
      { t: 'list', items: [
        '<b>Does it test the right thing?</b> A meaningful assertion tied to the requirement — a test without an <code>expect</code> passes as long as nothing crashes.',
        '<b>Stability:</b> user-facing locators (<code>getByRole</code>, <code>getByLabel</code>, <code>getByTestId</code>), every action awaited, no <code>waitForTimeout</code>.',
        '<b>Independence:</b> each test creates its own data and does not rely on another test running first.',
        '<b>Readability:</b> a name that states the behaviour, clear steps, no copy-pasted setup that belongs in a helper or fixture.',
        '<b>Leftovers:</b> no <code>test.only</code>, <code>page.pause()</code>, stray <code>console.log</code>, secrets or real personal data.'
      ] },
      { t: 'h', text: 'Giving and receiving feedback' },
      { t: 'compare', a: { title: 'Unhelpful review', items: ['“This is wrong.”', '“Why would anyone do it like this?”', 'Blockers and tiny style nits mixed together, unlabeled', 'Approving after a ten-second skim'] }, b: { title: 'Helpful review', items: ['“<code>waitForTimeout(3000)</code> may be flaky on slow CI runners — could we use <code>await expect(total).toHaveText(…)</code>?”', 'Explains the risk and suggests a concrete fix', 'Labels comments: <b>blocker</b>, <b>suggestion</b>, <b>nit</b>, <b>question</b>', 'Points out good patterns too'] } },
      { t: 'p', html: 'Review the <b>code, not the person</b>, and ask questions when you are unsure (“Is this wait needed because of the animation?”). When you receive feedback, assume good intent, reply to every comment — “Fixed in the latest commit” or a short explanation of your choice — and do not resolve a thread silently. Keep PRs small and focused: a reviewer can study 150 lines carefully but will skim 1,500. A clear description (what changed, why, how you tested it, plus a screenshot or trace link) speeds everything up.' },
      { t: 'h', text: 'CI checks and merge conflicts' },
      { t: 'p', html: 'Most teams run <b>CI</b> on every PR: lint, type-check, unit tests and a smoke set of end-to-end tests. Branch protection rules usually require green checks and at least one approval before merging. A red check is information — open the log or trace and find out why before clicking “re-run”. A <b>merge conflict</b> happens when two branches change the same lines. Git cannot guess which version is right, so it marks the spot and asks you to decide:' },
      { t: 'code', lang: 'text', title: 'A conflict while merging fix/checkout-button', code: `<<<<<<< HEAD
  await page.getByRole('button', { name: 'Place order' }).click();
=======
  await page.getByRole('button', { name: 'Pay now' }).click();
>>>>>>> fix/checkout-button

# To resolve: edit the file to the correct final code, delete all three
# marker lines, then: git add <file>, git commit, and rerun the tests.` },
      { t: 'h', text: 'Secret hygiene' },
      { t: 'code', lang: 'ts', title: 'Read secrets from the environment — never hard-code them', code: `const email = process.env.QA_USER_EMAIL;
const password = process.env.QA_USER_PASSWORD;

if (!email || !password) {
  throw new Error('Set QA_USER_EMAIL and QA_USER_PASSWORD (see .env.example)');
}

// .env          -> real values on your machine, listed in .gitignore
// .env.example  -> committed, names only:  QA_USER_EMAIL=  QA_USER_PASSWORD=` },
      { t: 'table', head: ['Where', 'Do', 'Do not'], rows: [
        ['Your machine', 'Keep values in a git-ignored <code>.env</code>, loaded with the dotenv package or Node’s <code>--env-file</code> flag', 'Paste a token into a test file “just for now”'],
        ['CI', 'Store values in the CI secret store, e.g. <code>${{ secrets.QA_USER_PASSWORD }}</code> in GitHub Actions, and pass them as environment variables', 'Print secrets in logs or write them into workflow files'],
        ['Test accounts', 'Use dedicated, low-privilege test accounts for each environment', 'Use your personal login or a production admin account'],
        ['Reports and traces', 'Check what a trace or screenshot contains before sharing it outside the team', 'Attach traces with real tokens to public tickets']
      ] },
      { t: 'callout', tone: 'warn', title: 'If a secret leaks, rotate it first', html: 'Once a token or password is pushed, assume it is <b>compromised</b>. Deleting it in a new commit does not help — it stays in history, in clones, forks and CI caches. First <b>revoke or rotate</b> the secret so the leaked value stops working, then remove it from the code, tell your lead or security team, and check access logs for misuse. Many hosting platforms scan pushes for known secret formats, but treat that as a safety net, not a plan.' }
    ],
    example: {
      title: 'Worked example: reviewing a teammate’s checkout test',
      blocks: [
        { t: 'p', html: 'A teammate opens a PR titled “checkout test”. CI is green. Read the test and decide what you would comment before reading the review below.' },
        { t: 'code', lang: 'ts', code: `test.only('checkout works', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'sara.admin@shopflow.test');
  await page.fill('#password', 'Winter2024!');
  await page.click('.btn-primary');
  await page.goto('/cart');
  await page.click('div.cart > div:nth-child(3) > button');
  await page.waitForTimeout(5000);
  await expect(page).toHaveURL(/order-confirmation/);
});` },
        { t: 'list', items: [
          '<b>Blocker:</b> <code>test.only</code> makes the run execute only this test, so the green CI check covered one test, not the suite. Remove it, and set <code>forbidOnly: !!process.env.CI</code> in the Playwright config so CI fails on it in future.',
          '<b>Blocker:</b> a real password is hard-coded, for an <b>admin</b> account in a customer flow. Read credentials from environment variables, use a customer test account, and rotate this password — it is now in the branch history.',
          '<b>Suggestion:</b> <code>div.cart &gt; div:nth-child(3) &gt; button</code> breaks on any layout change; try <code>getByRole(\'button\', { name: \'Checkout\' })</code>.',
          '<b>Suggestion:</b> replace <code>waitForTimeout(5000)</code> with an awaited web-first assertion on the confirmation page.',
          '<b>Question:</b> the test only checks the URL. Should it also assert the order total and that an order number is shown? Then a name such as “customer can place an order with a saved card” would describe it.'
        ] },
        { t: 'p', html: 'Notice the tone: each comment says what, why and how to fix it, and blockers are clearly separated from suggestions. The biggest find — a “green” CI that ran one test — came from reading the diff, not from trusting the check mark.' }
      ]
    },
    explain: {
      'ur': 'ٹیم میں کوئی بھی براہِ راست main پر code نہیں بھیجتا۔ آپ branch بناتے ہیں، commit اور push کرتے ہیں، پھر pull request (PR) کھولتے ہیں۔ PR پر CI checks چلتے ہیں اور ساتھی review کرتے ہیں، اس کے بعد merge ہوتا ہے۔ Test code کے review میں دیکھیں: کیا اصل assertion موجود ہے، locators مضبوط ہیں، ہر action پر await ہے، اور test.only یا کوئی password تو باقی نہیں رہ گیا۔ Feedback شائستہ اور واضح دیں: مسئلہ، وجہ اور حل بتائیں۔ سب سے اہم اصول: token یا password کبھی Git میں commit نہ کریں۔ انہیں .env file میں رکھیں جو .gitignore میں ہو، اور CI میں secret store استعمال کریں۔ اگر غلطی سے secret push ہو جائے تو صرف delete کرنا کافی نہیں، فوراً اسے rotate کریں کیونکہ وہ history میں موجود رہتا ہے۔',
      'ur-Latn': 'Team mein koi bhi seedha main par code nahi bhejta. Aap branch banate hain, commit aur push karte hain, phir pull request (PR) kholte hain. PR par CI checks chalte hain aur saathi review karte hain, us ke baad merge hota hai. Test code ke review mein dekhein: kya asal assertion maujood hai, locators mazboot hain, har action par await hai, aur test.only ya koi password to baqi nahi reh gaya. Feedback shaista aur wazeh dein: masla, wajah aur hal batayein. Sab se ahem usool: token ya password kabhi Git mein commit na karein. Inhein .env file mein rakhein jo .gitignore mein ho, aur CI mein secret store use karein. Agar ghalti se secret push ho jaaye to sirf delete karna kaafi nahi, foran usay rotate karein kyun ke woh history mein maujood rehta hai.',
      'hi': 'टीम में कोई भी सीधे main पर code नहीं भेजता। आप branch बनाते हैं, commit और push करते हैं, फिर pull request (PR) खोलते हैं। PR पर CI checks चलते हैं और साथी review करते हैं, उसके बाद merge होता है। Test code के review में देखें: क्या असली assertion मौजूद है, locators मज़बूत हैं, हर action पर await है, और कहीं test.only या कोई password तो नहीं छूट गया। Feedback विनम्र और साफ़ दें: समस्या, कारण और समाधान बताएँ। सबसे ज़रूरी नियम: token या password कभी Git में commit न करें। उन्हें .env file में रखें जो .gitignore में हो, और CI में secret store इस्तेमाल करें। अगर गलती से secret push हो जाए, तो सिर्फ़ delete करना काफ़ी नहीं, तुरंत उसे rotate करें क्योंकि वह history में मौजूद रहता है।',
      'ar': 'في الفريق لا يرسل أحد الكود مباشرة إلى main. تُنشئ فرعًا (branch)، ثم تعمل commit وpush، ثم تفتح طلب دمج (pull request). تعمل فحوص CI على الطلب ويراجعه الزملاء، ثم يتم الدمج. عند مراجعة كود الاختبارات تحقّق من: وجود assertion حقيقي، وثبات الـ locators، ووجود await قبل كل إجراء، وعدم بقاء test.only أو أي كلمة مرور. قدّم ملاحظاتك بلطف ووضوح: المشكلة والسبب والحل. وأهم قاعدة: لا تضع أي token أو كلمة مرور في Git أبدًا؛ احفظها في ملف .env المُدرج في .gitignore، واستخدم مخزن الأسرار في CI. وإذا دُفع سرّ بالخطأ فلا يكفي حذفه، بل غيّره (rotate) فورًا لأنه يبقى في السجل (history).',
      'es': 'En un equipo nadie sube código directamente a main. Creas una rama, haces commit y push, y abres un pull request (PR). En el PR se ejecutan los checks de CI y tus compañeros revisan el código; después se hace el merge. Al revisar código de tests, comprueba que haya un assertion real, que los locators sean estables, que cada acción tenga await y que no quede ningún test.only ni contraseñas. Da feedback amable y claro: el problema, el motivo y una solución. La regla más importante: nunca hagas commit de tokens o contraseñas. Guárdalos en un archivo .env incluido en .gitignore y usa el almacén de secretos de CI. Si un secreto se sube por error, borrarlo no basta: rótalo de inmediato, porque sigue en el historial.'
    },
    keyTerms: [
      { term: 'Pull request', def: 'A request to merge one branch into another, with a diff, description, CI results and review comments. Called a merge request in GitLab.' },
      { term: 'Code review', def: 'Teammates reading a change to find bugs, risks and unclear code before it merges, and to share knowledge.' },
      { term: 'CI check', def: 'An automated job (lint, type-check, tests) that runs on a PR and reports pass or fail before merging.' },
      { term: 'Merge conflict', def: 'Two branches changed the same lines; Git marks them with <<<<<<<, ======= and >>>>>>> for a person to resolve.' },
      { term: 'Environment variable', def: 'A named value supplied by the machine or CI at runtime, read in Node with process.env.NAME — the right home for secrets.' },
      { term: 'Secret rotation', def: 'Replacing a password or token with a new one and revoking the old value, so a leaked copy stops working.' }
    ],
    practice: [
      { q: 'Write a short PR description for a change that adds three boundary tests for the ShopFlow coupon expiry date.', answer: '<b>What:</b> Adds boundary tests for coupon expiry: last valid minute (23:59 on the expiry date), first invalid minute (00:00 next day), and a mid-validity date.<br><b>Why:</b> Bug report about coupons expiring a day early; no test covered the edge.<br><b>How tested:</b> Ran the new tests 10 times locally and in CI (links), all green; one test fails on the old build as expected.<br><b>Notes:</b> Uses the existing <code>buildCoupon</code> helper; no new dependencies.' },
      { q: 'Resolve the conflict from the lesson. The product owner confirms the button is now called “Pay now”. What exactly do you do?', answer: 'Edit the file so only <code>await page.getByRole(\'button\', { name: \'Pay now\' }).click();</code> remains, and delete the <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> lines. Then <code>git add</code> the file, <code>git commit</code> to complete the merge, and rerun the affected tests before pushing.' },
      { q: 'Rewrite these review comments so they are helpful: “bad locator”, “why???”, “this test is useless”.', answer: '“<b>Suggestion:</b> this CSS path will break if the layout changes — could we use <code>getByRole(\'button\', { name: \'Apply\' })</code>?”<br>“<b>Question:</b> I am not sure why we reload the page here — is it needed for the cache? A comment would help future readers.”<br>“<b>Blocker:</b> the test has no assertion, so it passes even if the coupon is rejected. Could we assert the discount line shows <code>-$5.00</code>?”' },
      { q: 'While reviewing, you find an API token committed six months ago in an old config file. List your steps in order.', hint: 'What makes a leaked token harmless?', answer: '1) Tell the token owner or security contact privately and get it <b>revoked/rotated</b> — this is what actually removes the risk. 2) Replace it in code with an environment variable and add the file pattern to <code>.gitignore</code> if relevant. 3) Check access logs for misuse since the commit date. 4) Decide with the team whether history rewriting is needed (it does not un-leak the token). 5) Suggest secret scanning in CI to catch the next one.' }
    ],
    quiz: [
      { q: 'You pushed a commit containing a live API token to the shared repository. What should you do first?', options: ['Rotate (revoke) the token, then clean up the code', 'Delete the line in a new commit, which removes it', 'Make the repository private and carry on working', 'Force-push rewritten history and tell nobody'], correct: 0,
        why: ['Correct — a rotated token is useless to anyone who copied it; clean-up comes after.', 'The old commit still contains the token, as do clones, forks and caches.', 'People who already had access, plus any copies, can still use the token.', 'Rewriting history does not reach existing copies, and hiding the leak delays the real fix.'] },
      { q: 'A PR adds a test that navigates and clicks but contains no expect() call at all. What is the main risk?', options: ['It will make the CI pipeline run much more slowly', 'The linter will always reject it before review', 'It passes unless something crashes, so it proves little', 'Playwright refuses to run any test that has no assertion in it'], correct: 2,
        why: ['Speed is not the issue; an assertion-free test may even be fast.', 'Default lint rules do not require assertions, so it may slip through.', 'Correct — without an assertion, a broken feature that does not throw still shows green.', 'Playwright runs such tests happily, which is exactly why reviewers must catch them.'] },
      { q: 'While merging, Git shows <<<<<<< HEAD, then your line, =======, then their line, then >>>>>>> feature/coupons. What should you do?', options: ['Delete the file and re-create it from memory', 'Write the correct final code, remove the markers, then add and commit', 'Leave both versions and all markers in place so that reviewers can choose later', 'Run git push --force to skip the conflict'], correct: 1,
        why: ['Destroys both sides’ work and risks new mistakes.', 'Correct — decide the right result (ask if unsure), delete the marker lines, stage, commit and rerun tests.', 'Marker lines are not valid code; the file would not even run.', 'Force-pushing does not resolve a conflict and can overwrite teammates’ work.'] },
      { q: 'What belongs in the .env.example file that is committed to the repository?', options: ['Real staging passwords so new joiners can start quickly', 'A full copy of your personal .env file', 'Production tokens, base64-encoded for extra safety', 'Variable names with empty or dummy values'], correct: 3,
        why: ['Committed passwords are leaked passwords, even for staging.', 'Your .env holds real secrets; it must stay git-ignored.', 'Base64 is an encoding, not encryption — anyone can decode it.', 'Correct — it documents which variables are needed without exposing values.'] },
      { q: 'A reviewer comments on your PR: "This sleep makes the test slow and flaky." What is the best response?', options: ['Resolve the thread without a reply, because the test passes on your own machine', 'Swap in a condition-based wait, push, and reply with what changed', 'Reply that reviewers should comment only on product code', 'Close the PR and open a new one without the comment'], correct: 1,
        why: ['Passing locally is not evidence against flakiness, and silent resolving hides the discussion.', 'Correct — act on valid feedback and close the loop so the reviewer can re-check quickly.', 'Test code is production code for the team; it deserves the same review.', 'Avoiding feedback wastes everyone’s time and loses the review history.'] }
    ],
    interview: [
      { q: 'What do you look for when reviewing test automation code?', a: 'First, <b>does it test the right behaviour</b> with a meaningful assertion linked to a requirement? Then stability: user-facing locators, every action and assertion awaited, no fixed sleeps. Then independence: own test data, no order dependence, cleanup that runs even after failure. Then readability: behaviour-based names, helpers instead of duplication. Finally hygiene: no <code>test.only</code>, debug leftovers, secrets or real personal data. I label comments as blockers or suggestions and always explain the risk and a possible fix.' },
      { q: 'You find a password committed in the test repository. What do you do?', a: 'I treat it as compromised immediately. I inform the owner or security contact privately and get the password <b>rotated</b>, because deleting it from the code does not remove it from history or existing clones. Then I replace it with an environment variable — a git-ignored <code>.env</code> locally and the CI secret store in pipelines — and add a <code>.env.example</code> with names only. I check whether the account was misused, and suggest secret scanning on pushes so it is caught automatically next time. No blame — the goal is to fix the process.' }
    ],
    takeaways: [
      'Changes reach <code>main</code> through PRs: branch, commit, push, review, CI, merge.',
      'Review test code for assertions, stability, independence, readability and leftovers.',
      'Feedback says what, why and how — and labels blockers vs suggestions.',
      'Resolve conflicts by choosing the correct code, removing markers and rerunning tests.',
      'Secrets live in env vars and secret stores; if one leaks, rotate it first.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p4', 'p5'] }
  },
  {
    id: 'cg-clean-tests',
    n: 8,
    level: 'advanced',
    title: 'Clean test code: naming, structure and patterns',
    summary: 'Write tests that read like specifications: Arrange-Act-Assert, behaviour-based names, DAMP helpers, fixtures, data builders and no hidden logic.',
    minutes: 28,
    objectives: [
      'Structure every test as Arrange-Act-Assert with one behaviour per test',
      'Name tests after behaviour and expected outcome',
      'Balance DRY and DAMP using helpers, fixtures and data builders',
      'Remove test smells: conditional logic, magic numbers, sleeps and dead tests'
    ],
    body: [
      { t: 'p', html: 'Test code is read far more often than it is written — usually by someone in a hurry, looking at a red build. A clean test answers three questions in seconds: <b>what behaviour is checked</b>, <b>with what data</b>, and <b>what result is expected</b>. Messy tests do the opposite: they hide intent behind clever helpers, fail with unclear messages and get skipped instead of fixed. The patterns in this lesson apply to Playwright, API tests and unit tests alike, in TypeScript, Python or Java.' },
      { t: 'h', text: 'Arrange, Act, Assert' },
      { t: 'code', lang: 'ts', code: `test('SAVE10 takes 10% off the cart subtotal', async ({ page }) => {
  // Arrange: a cart with known contents
  const cart = new CartPage(page);
  await cart.openWith([{ sku: 'MOUSE-01', qty: 2 }]);   // 2 x $24.99 = $49.98

  // Act: one user action
  await cart.applyCoupon('SAVE10');

  // Assert: the observable outcome
  await expect(cart.discountLine).toHaveText('-$5.00');
  await expect(cart.total).toHaveText('$44.98');
});` },
      { t: 'p', html: '<b>Arrange</b> sets up the state, <b>Act</b> performs the single action under test, and <b>Assert</b> checks the outcome. Separate the phases with blank lines; the comments are optional once the shape is familiar. One Act per test keeps failures precise. Several assertions are fine when they describe <i>one</i> behaviour — the discount line and the total above are two views of the same result. BDD’s <b>Given / When / Then</b> is the same idea in business language.' },
      { t: 'h', text: 'Names, focus and DAMP over DRY' },
      { t: 'table', head: ['Weak name', 'Better name'], rows: [
        ['<code>test1</code>', 'guest checkout without an email shows “Email is required”'],
        ['<code>coupon test</code>', 'expired coupon shows an error and applies no discount'],
        ['<code>login works</code>', 'locked-out user sees the account-locked message'],
        ['<code>should work correctly</code>', 'cart total updates when quantity changes from 1 to 3']
      ] },
      { t: 'p', html: 'A good name states the <b>condition and the expected result</b>, so a failure report reads like a bug title. <b>DRY</b> (“don’t repeat yourself”) is great for product code, but tests should also be <b>DAMP</b> — “descriptive and meaningful phrases”. Extract the <i>how</i> (clicking through login, building data, calling APIs) into helpers, page objects and fixtures, but keep the <i>what</i> — key data and assertions — visible in the test body. A little repetition is a fair price for a test you can understand without opening five files.' },
      { t: 'compare', a: { title: 'DRY taken too far', items: ['<code>runCheckoutScenario(3, true, false, \'B\')</code> — what does it test?', 'Assertions hidden inside shared helpers', 'One helper change silently alters forty tests', 'Failures point at helper lines, not at a behaviour'] }, b: { title: 'DAMP', items: ['<code>loginAs(customer)</code>, <code>addToCart(\'MOUSE-01\')</code> — helpers named by intent', 'Assertions stay in the test body', 'Important data is visible: <code>buildUser({ country: \'PK\' })</code>', 'A failure points at the line that explains the behaviour'] } },
      { t: 'h', text: 'Helpers, fixtures and data builders' },
      { t: 'code', lang: 'ts', title: 'fixtures.ts — a customer created through the API for each test', code: `import { test as base, expect } from '@playwright/test';

type Customer = { email: string; password: string };

export const test = base.extend<{ customer: Customer }>({
  customer: async ({ request }, use) => {
    const customer = buildUser({ role: 'customer' });     // builder: valid defaults
    await request.post('/api/test-users', { data: customer });   // fast setup via API
    await use(customer);                                   // the test runs here
    await request.delete(\`/api/test-users/\${customer.email}\`);  // cleanup, even after a failure
  },
});
export { expect };` },
      { t: 'p', html: 'A <b>fixture</b> prepares something a test needs and cleans it up afterwards; Playwright runs the code after <code>use()</code> even when the test fails. Combine fixtures with <b>test data builders</b> (from the functions lesson) so every test gets fresh, valid, independent data and overrides only what matters. Prefer setup through the API or database over clicking through the UI — it is faster and keeps the UI test focused on the behaviour it is named after.' },
      { t: 'list', items: [
        '<b>Conditional logic:</b> <code>if (await popup.isVisible()) { … }</code> creates a test that sometimes checks nothing. Make the state deterministic in setup, or write two tests.',
        '<b>Loops of assertions</b> inside one test hide which case failed. Generate one test per data row instead (below).',
        '<b>Magic numbers:</b> <code>expect(total).toBe(4498)</code> — where does 4498 come from? Name it or derive it from the arranged data.',
        '<b>Sleeps and blind retries</b> that mask timing problems instead of waiting for a condition.',
        '<b>Dead tests:</b> commented-out, permanently skipped or covering removed features. Fix them with a ticket or delete them — Git remembers.'
      ] },
      { t: 'code', lang: 'ts', title: 'One test per data row — each case gets its own name and result', code: `const coupons = [
  { code: 'SAVE10', discount: '-$5.00', total: '$44.98' },
  { code: 'WELCOME5', discount: '-$2.50', total: '$47.48' },
];

for (const { code, discount, total } of coupons) {
  test(\`coupon \${code} gives \${discount} on a $49.98 cart\`, async ({ page }) => {
    const cart = new CartPage(page);
    await cart.openWith([{ sku: 'MOUSE-01', qty: 2 }]);

    await cart.applyCoupon(code);

    await expect(cart.discountLine).toHaveText(discount);
    await expect(cart.total).toHaveText(total);
  });
}` },
      { t: 'callout', tone: 'key', title: 'A test is an executable specification', html: 'If a new teammate can read a test name and body and explain the business rule it protects, the test is clean. If they need to open helpers, ask you, or run it to find out, refactor it — the next person reading it may be you, six months from now, with a red build.' }
    ],
    example: {
      title: 'Worked example: refactoring a messy coupon test',
      blocks: [
        { t: 'p', html: 'This test was written in a hurry. It passes most of the time, and nobody wants to touch it. List what is wrong before reading the clean version.' },
        { t: 'code', lang: 'ts', title: 'Before', code: `test('test2', async ({ page }) => {
  await page.goto('https://staging.shopflow.test/login');
  await page.fill('#email', 'qa1@shopflow.test');
  await page.fill('#pwd', 'Passw0rd!');
  await page.click('button');
  await page.goto('https://staging.shopflow.test/cart?add=MOUSE-01&qty=2');
  if (await page.locator('.promo-popup').isVisible()) {
    await page.click('.promo-popup .close');
  }
  await page.fill('#coupon', 'SAVE10');
  await page.click('#apply');
  await page.waitForTimeout(2000);
  expect(await page.locator('.total').textContent()).toBe('$44.98');
  await page.fill('#coupon', 'EXPIRED1');
  await page.click('#apply');
  expect(await page.locator('.err').textContent()).toContain('expired');
});` },
        { t: 'code', lang: 'ts', title: 'After', code: `import { test, expect } from './fixtures';   // provides the customer fixture
import { CartPage, loginAs } from './pages';

test.describe('cart coupons', () => {
  test.beforeEach(async ({ page, customer }) => {
    await loginAs(page, customer);             // promo popup is off for test accounts
  });

  test('SAVE10 takes 10% off a $49.98 cart', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.openWith([{ sku: 'MOUSE-01', qty: 2 }]);

    await cart.applyCoupon('SAVE10');

    await expect(cart.discountLine).toHaveText('-$5.00');
    await expect(cart.total).toHaveText('$44.98');
  });

  test('expired coupon shows an error and applies no discount', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.openWith([{ sku: 'MOUSE-01', qty: 2 }]);

    await cart.applyCoupon('EXPIRED1');

    await expect(cart.couponError).toHaveText('This coupon has expired');
    await expect(cart.total).toHaveText('$49.98');
  });
});` },
        { t: 'compare', a: { title: 'Before', items: ['Name <code>test2</code> says nothing', 'Hard-coded environment URL, password and CSS ids', '<code>if</code> around a popup: some runs check a different flow', 'Fixed sleep and one-shot <code>textContent()</code> checks', 'Two behaviours in one test — the first failure hides the second'] }, b: { title: 'After', items: ['Names state behaviour and expected result', '<code>baseURL</code> from config, credentials from a fixture, user-facing locators in a page object', 'Popup disabled for test accounts, so every run is the same', 'Retrying web-first assertions with exact values', 'One behaviour per test, shared login in <code>beforeEach</code>, key data visible'] } },
        { t: 'p', html: 'The clean version is a few lines longer — and far cheaper to own. When the expired-coupon test fails, the report names the rule that broke, the arranged cart explains the expected totals, and the valid-coupon test still runs and reports its own result.' }
      ]
    },
    explain: {
      'ur': 'صاف (clean) test ایک specification کی طرح پڑھا جاتا ہے۔ ہر test کو تین حصوں میں لکھیں: Arrange (تیاری، جیسے cart میں دو items ڈالنا)، Act (ایک action، جیسے coupon لگانا) اور Assert (نتیجہ چیک کرنا)۔ Test کا نام رویّہ اور متوقع نتیجہ بتائے، جیسے "expired coupon shows an error" نہ کہ test2۔ ایک test میں ایک ہی behaviour رکھیں۔ Tests میں DRY سے زیادہ DAMP اہم ہے: login یا data بنانے جیسا "کیسے" والا کام helpers، fixtures اور builders میں رکھیں، مگر اہم data اور assertions test کے اندر نظر آئیں۔ Test کے اندر if سے بچیں کیونکہ کبھی کچھ check ہی نہیں ہوتا۔ بے وجہ نمبر (magic numbers) کو نام دیں، waitForTimeout ہٹائیں، اور مردہ یا ہمیشہ skip رہنے والے tests کو ٹھیک کریں یا delete کر دیں۔',
      'ur-Latn': 'Clean test ek specification ki tarah parha jata hai. Har test ko teen hisson mein likhein: Arrange (tayyari, jaise cart mein do items daalna), Act (ek action, jaise coupon lagana) aur Assert (result check karna). Test ka naam behaviour aur expected result bataye, jaise "expired coupon shows an error", na ke test2. Ek test mein ek hi behaviour rakhein. Tests mein DRY se zyada DAMP ahem hai: login ya data banane jaisa "kaise" wala kaam helpers, fixtures aur builders mein rakhein, magar ahem data aur assertions test ke andar nazar aayein. Test ke andar if se bachein kyun ke kabhi kuch check hi nahi hota. Be-wajah numbers (magic numbers) ko naam dein, waitForTimeout hatayein, aur murda ya hamesha skip rehne wale tests ko theek karein ya delete kar dein.',
      'hi': 'साफ़ (clean) test एक specification की तरह पढ़ा जाता है। हर test को तीन हिस्सों में लिखें: Arrange (तैयारी, जैसे cart में दो items डालना), Act (एक action, जैसे coupon लगाना) और Assert (नतीजा जाँचना)। Test का नाम behaviour और अपेक्षित नतीजा बताए, जैसे "expired coupon shows an error", न कि test2। एक test में एक ही behaviour रखें। Tests में DRY से ज़्यादा DAMP ज़रूरी है: login या data बनाने जैसा "कैसे" वाला काम helpers, fixtures और builders में रखें, लेकिन ज़रूरी data और assertions test के अंदर दिखें। Test के अंदर if से बचें, क्योंकि कभी-कभी कुछ check ही नहीं होता। बिना मतलब के numbers (magic numbers) को नाम दें, waitForTimeout हटाएँ, और बेकार या हमेशा skip रहने वाले tests को ठीक करें या delete कर दें।',
      'ar': 'الاختبار النظيف (clean test) يُقرأ كأنه مواصفة (specification). اكتب كل اختبار في ثلاثة أجزاء: Arrange (التجهيز، مثل وضع منتجين في السلة)، وAct (إجراء واحد، مثل تطبيق كوبون)، وAssert (التحقق من النتيجة). يجب أن يصف اسم الاختبار السلوك والنتيجة المتوقعة، مثل "expired coupon shows an error" وليس test2. ضع سلوكًا واحدًا فقط في كل اختبار. في الاختبارات يكون مبدأ DAMP أهم من DRY: ضع «كيفية» التنفيذ مثل تسجيل الدخول وتجهيز البيانات في دوال مساعدة وfixtures وbuilders، لكن اترك البيانات المهمة والـ assertions ظاهرة داخل الاختبار. تجنّب if داخل الاختبار لأنه قد لا يتحقق من أي شيء أحيانًا، وأعطِ الأرقام الغامضة (magic numbers) أسماء واضحة، واحذف waitForTimeout، وأصلح الاختبارات الميتة أو المتجاهَلة دائمًا أو احذفها.',
      'es': 'Un test limpio se lee como una especificación. Escribe cada test en tres partes: Arrange (preparar, por ejemplo poner dos productos en el carrito), Act (una sola acción, como aplicar un cupón) y Assert (comprobar el resultado). El nombre debe describir el comportamiento y el resultado esperado, como "expired coupon shows an error", y no test2. Un comportamiento por test. En los tests importa más DAMP que DRY: lleva el «cómo» (login, crear datos) a helpers, fixtures y builders, pero deja visibles en el test los datos clave y los assertions. Evita los if dentro del test, porque a veces no comprueban nada. Pon nombre a los números mágicos, elimina waitForTimeout y arregla o borra los tests muertos o siempre omitidos.'
    },
    keyTerms: [
      { term: 'Arrange-Act-Assert', def: 'Test structure: set up state, perform one action, then check the outcome. Given/When/Then is the BDD equivalent.' },
      { term: 'DAMP', def: '“Descriptive and meaningful phrases”: prefer readable, self-explaining tests over removing every bit of duplication.' },
      { term: 'Fixture', def: 'Reusable setup and teardown that a test requests by name, such as a logged-in page or a fresh test user.' },
      { term: 'Test data builder', def: 'A function or class that creates valid test objects with defaults, letting each test override only relevant fields.' },
      { term: 'Test smell', def: 'A pattern that makes tests fragile or unclear: conditionals, sleeps, magic numbers, shared state, dead tests.' },
      { term: 'Magic number', def: 'An unexplained literal value in code, such as 4498. Name it or derive it so readers know where it comes from.' }
    ],
    practice: [
      { q: 'Rename these tests so a failure reads like a bug title: <code>test_login_3</code>, <code>search works</code>, <code>verify profile</code>.', answer: 'For example: “login with a wrong password three times locks the account for 15 minutes”, “search for ‘mouse’ returns only products with mouse in the name”, “saving a profile with an empty phone number keeps the previous number”. Each names a condition and an expected result. Your exact rules will differ — the pattern is what matters.' },
      { q: 'Reorder these lines into Arrange-Act-Assert and say which phase each belongs to: <code>await expect(cart.total).toHaveText(\'$74.97\')</code>, <code>await cart.setQuantity(\'MOUSE-01\', 3)</code>, <code>await cart.openWith([{ sku: \'MOUSE-01\', qty: 1 }])</code>.', answer: '<b>Arrange:</b> <code>await cart.openWith([{ sku: \'MOUSE-01\', qty: 1 }])</code>. <b>Act:</b> <code>await cart.setQuantity(\'MOUSE-01\', 3)</code>. <b>Assert:</b> <code>await expect(cart.total).toHaveText(\'$74.97\')</code> (3 × $24.99). A good name: “cart total updates when quantity changes from 1 to 3”.' },
      { q: 'Find three smells: <code>for (const p of products) { await page.goto(`/p/${p.id}`); if (p.price &gt; 0) { await expect(page.getByTestId(\'price\')).toHaveText(p.label); } } await expect(page.getByTestId(\'count\')).toHaveText(\'17\');</code>', answer: '(1) A <b>loop of assertions</b> in one test — the first failing product stops the rest and the report does not name it; generate one test per product instead. (2) <b>Conditional logic</b> — products with price 0 are silently not checked; free products deserve their own explicit test. (3) <b>Magic number</b> <code>\'17\'</code> — derive it from the arranged data (<code>String(products.length)</code>) or explain it with a named constant.' },
      { q: 'Your team’s helper <code>completeCheckout(page, opts)</code> takes eight boolean options and contains its own assertions. Forty tests use it. How would you improve it without a risky big-bang rewrite?', answer: 'Move assertions out of the helper and into the tests, so each test shows what it checks. Split the helper into small intent-named steps (<code>fillShipping</code>, <code>choosePayment</code>, <code>placeOrder</code>) on a page object, and replace boolean flags with data builders (<code>buildAddress({ country: \'PK\' })</code>). Migrate a few tests at a time in small PRs, keep the old helper until nothing uses it, then delete it.' }
    ],
    quiz: [
      { q: 'Which test name is best?', options: ['checkout_test_1_regression_suite_smoke_v2', 'checkout should work correctly in all cases', 'verify cart and checkout and payment page', 'guest checkout without email shows "Email is required"'], correct: 3,
        why: ['Describes where the test lives, not what it checks.', '“Correctly” is undefined; a failure would tell you nothing.', 'Lists pages, not a behaviour or an expected result — and hints at several behaviours in one test.', 'Correct — it names the condition and the expected result, so a failure reads like a bug title.'] },
      { q: 'A teammate proposes replacing 12 checkout tests with calls like runScenario("B", true, false) to remove duplication. What is the main risk?', options: ['The tests will run more slowly because every helper adds a function call', 'Intent and key data hide behind flags, so failures are hard to understand', 'Playwright cannot discover tests whose bodies only call one helper function', 'TypeScript cannot infer boolean flag types inside generic helper functions'], correct: 1,
        why: ['A function call costs microseconds; speed is not the concern.', 'Correct — that is DRY taken too far. Keep tests DAMP: intent-named helpers with visible data and assertions.', 'Playwright discovers tests by test() calls, whatever their bodies contain.', 'TypeScript infers boolean parameters without trouble; the problem is readability.'] },
      { q: 'A test contains: if (await page.getByText("Free shipping").isVisible()) { await expect(total).toHaveText("$49.98"); }. What is the problem?', options: ['isVisible() must be given a timeout, or it throws an error', 'Web-first assertions such as toHaveText are not allowed inside if blocks', 'When the banner is absent the test checks nothing, yet still passes', 'The if statement doubles the run time because both paths execute'], correct: 2,
        why: ['isVisible() returns immediately without waiting; it does not throw for a missing element.', 'Assertions work anywhere; the issue is that this one may never run.', 'Correct — and because isVisible() does not wait, which path runs can vary between runs. Control the state instead.', 'Only one branch of an if ever runs.'] },
      { q: 'In Arrange-Act-Assert, which step belongs in Act?', options: ['Clicking Apply coupon on the cart page', 'Creating a test user through the API', 'Checking the discount line shows -$5.00', 'Deleting the test user after the run'], correct: 0,
        why: ['Correct — the single user action whose effect the test verifies.', 'That is Arrange: preparing the state before the action.', 'That is Assert: checking the observable outcome.', 'That is teardown, ideally handled by a fixture after the test.'] },
      { q: 'A reviewer calls the 4498 in expect(total).toBe(4498) a magic number. What is the best fix?', options: ['Add a comment above the line saying the value was checked by hand', 'Generate a random expected value on each run', 'Name or derive it from the arranged data (subtotal − discount)', 'Delete the assertion so the test is less confusing'], correct: 2,
        why: ['Comments go stale and still do not show where the value comes from.', 'A random expectation cannot match a real result — the test becomes meaningless.', 'Correct — e.g. const expectedTotal = 4998 - 500, with the cart and coupon arranged in the same test.', 'Removing the check removes the whole point of the test.'] }
    ],
    interview: [
      { q: 'What makes test code clean and maintainable?', a: 'A clean test reads like a specification. It has a <b>behaviour-based name</b>, follows <b>Arrange-Act-Assert</b> with one action, and checks one behaviour with meaningful, retrying assertions. Setup details live in fixtures, page objects and data builders, while key data and assertions stay visible in the test (DAMP). Each test is independent — own data, cleanup in fixtures — and there is no conditional logic, fixed sleeps or magic numbers. Finally, the suite is curated: dead or permanently skipped tests are fixed or deleted.' },
      { q: 'DRY or DAMP — which do you prefer in tests, and why?', a: 'In product code I lean DRY. In tests I lean <b>DAMP</b>, because a test’s main job is to explain and protect a behaviour, and someone has to understand it quickly when it fails. I still remove duplication of <i>mechanics</i> — login, API setup, locators — into fixtures, helpers and page objects. But I keep the scenario’s important data and every assertion in the test body. A helper with many boolean flags or hidden assertions is a sign that DRY has gone too far.' }
    ],
    takeaways: [
      'Arrange-Act-Assert, one action and one behaviour per test.',
      'Name tests after the condition and the expected result.',
      'DAMP over DRY: hide the how in helpers and fixtures, keep the what visible.',
      'Use builders and fixtures for fresh, independent data with cleanup.',
      'Remove smells: conditionals, loops of assertions, magic numbers, sleeps and dead tests.'
    ],
    links: { challenges: ['shopflow-checkout'], interview: ['p3', 'p5'] }
  }
]);

QA_CONTENT.addBank('code-git', [
  { level: 'beginner', topic: 'cg-js-basics', q: 'What does this print? console.log("5" + 3, "5" - 3);', options: ['53 2', '8 2', '53 NaN', '8 8'], correct: 0,
    why: ['Correct — + with a string joins text ("53"); - only works on numbers, so "5" is converted and 5 - 3 is 2.', '+ does not convert the string to a number; it concatenates instead.', 'The - operator converts "5" to the number 5, so the result is 2, not NaN.', 'Only the subtraction converts to numbers; the addition joins strings.'] },
  { level: 'beginner', topic: 'cg-js-basics', q: 'What does console.log(typeof null, typeof []) print?', options: ['null array', 'object array', 'object object', 'null object'], correct: 2,
    why: ['typeof never returns "null" or "array".', 'Arrays are objects to typeof; use Array.isArray() to detect them.', 'Correct — typeof null is "object" (a long-standing quirk) and arrays are objects too. Check null with === null.', 'typeof null is "object", not "null".'] },
  { level: 'beginner', topic: 'cg-functions-data', q: 'What is result? const result = [10, 25, 40].filter(n => n > 20).map(n => n / 5);', options: ['[ 2, 5, 8 ]', '[ 5, 8 ]', '[ 25, 40 ]', '[ true, true ]'], correct: 1,
    why: ['That would be map without the filter — 10 is removed first.', 'Correct — filter keeps 25 and 40, then map divides each by 5.', 'That is the filtered list before map runs.', 'map returns the callback’s results (numbers), and filter returns the items themselves, not booleans.'] },
  { level: 'intermediate', topic: 'cg-functions-data', q: 'What does this print? const user = { name: "Sara", address: { city: "Lahore" } }; const copy = { ...user }; copy.address.city = "Karachi"; console.log(user.address.city);', options: ['Lahore', 'undefined', 'A TypeError', 'Karachi'], correct: 3,
    why: ['That would be true for a deep copy; spread copies only the top level.', 'address exists on both objects — it is the same object.', 'Nothing is undefined here, so no error is thrown.', 'Correct — spread makes a shallow copy, so user and copy share one address object. Use structuredClone() for a deep copy.'] },
  { level: 'beginner', topic: 'cg-git', q: 'Which command creates a new branch called test/search and switches to it?', options: ['git branch --switch test/search', 'git commit -b test/search', 'git switch -c test/search', 'git merge test/search'], correct: 2,
    why: ['git branch has no --switch option; git branch test/search would create it without switching.', 'git commit records changes; it does not create branches.', 'Correct — -c creates the branch and switches to it (older equivalent: git checkout -b test/search).', 'merge brings another branch’s commits into the current one; it creates nothing.'] },
  { level: 'intermediate', topic: 'cg-git', q: 'You ran git restore tests/cart.spec.ts on a file with an hour of uncommitted edits. What happened?', options: ['The uncommitted edits are discarded; Git cannot recover them', 'The edits are moved into the staging area for safety', 'Git records a revert commit that you can undo later', 'Nothing happens, because restore only ever affects staged files'], correct: 0,
    why: ['Correct — those edits were never committed, so Git has no copy. Your editor’s local history may help; commit small and often.', 'Unstaging is git restore --staged; plain restore overwrites the working file.', 'Revert works on commits; restore never creates one.', 'Without --staged, restore changes the working tree file.'] },
  { level: 'intermediate', topic: 'cg-async', q: 'What is wrong here? const total = page.getByTestId("total").textContent(); expect(total).toBe("$44.98");', options: ['getByTestId locators are unable to read any text content', 'toBe must be replaced by toEqual when comparing strings', 'textContent can only be called on page, never on a locator', 'total is a Promise because textContent() was not awaited'], correct: 3,
    why: ['Locators can read text with textContent(), innerText() or a web-first assertion.', 'toBe works for strings; toEqual matters for objects and arrays.', 'Locator.textContent() exists and is the usual way to read text.', 'Correct — the comparison is against a Promise. Better still: await expect(page.getByTestId("total")).toHaveText("$44.98"), which also retries.'] },
  { level: 'intermediate', topic: 'cg-async', q: 'What does this print, in order? async function f() { return 1; } f().then(v => console.log("then", v)); console.log("sync");', options: ['then 1, followed by sync', 'sync, followed by then 1', 'Only sync — the promise never resolves', 'Only then 1 — sync is skipped'], correct: 1,
    why: ['A .then callback always runs later, after the current synchronous code.', 'Correct — the synchronous log runs first; the promise callback runs as a microtask afterwards.', 'f() returns an already-resolved promise; its callback does run.', 'Synchronous code is never skipped because of a pending promise.'] },
  { level: 'intermediate', topic: 'cg-errors-debugging', q: 'An API script runs JSON.parse(body) and throws SyntaxError: Unexpected end of JSON input. What is the most likely cause?', options: ['The response body was empty (for example a 204)', 'The JSON body contained a trailing comma in an array', 'The script forgot to import the global JSON object', 'The server answered with status 200 and valid JSON'], correct: 0,
    why: ['Correct — parsing an empty string fails this way. Check the status and raw text before parsing.', 'A trailing comma gives an “Unexpected token” error at that position instead.', 'JSON is a built-in global; it never needs importing.', 'Valid JSON parses without error.'] },
  { level: 'advanced', topic: 'cg-errors-debugging', q: 'A cart test passes alone but fails in the full suite with Expected: 1 item, Received: 3 items. What is the most likely cause?', options: ['A product bug in how the cart counts its line items', 'The CI machine is slower, so the cart has not loaded yet', 'Another test reuses this user and leaves items behind', 'A missing type annotation on the cart page object method'], correct: 2,
    why: ['If counting were broken, the test would also fail when run alone.', 'Slowness causes timeouts, not extra items in the cart.', 'Correct — passes alone, fails in the suite points to shared state. Give each test its own user or reset the cart in a fixture.', 'Type annotations do not exist at runtime and cannot add cart items.'] },
  { level: 'intermediate', topic: 'cg-typescript', q: 'What does tsc report for: interface Order { id: number; status: "PAID" | "PENDING" } const o: Order = { id: "42", status: "PAID" };', options: ['Nothing, because TypeScript converts "42" into the number 42 automatically', 'A runtime TypeError when the test runs', 'An error saying that status is missing', 'An error: string is not assignable to number'], correct: 3,
    why: ['TypeScript never converts values; it only checks them.', 'Type checking happens before running; at runtime there are no types.', 'status is present and has an allowed value.', 'Correct — id is declared as number but a string was given (error TS2322).'] },
  { level: 'advanced', topic: 'cg-typescript', q: 'Which setup gives the strongest type safety for a Playwright TypeScript suite?', options: ['Rely on npx playwright test to report type errors', '"strict": true plus npx tsc --noEmit as a required CI check', 'Type page objects as any so that the tests compile faster', 'Switch off strict mode to cut down noise from optional properties in test data'], correct: 1,
    why: ['Playwright runs tests without type-checking, so type errors slip through.', 'Correct — strict mode enables the useful checks, and a required CI step stops type errors from merging.', 'any disables checking exactly where tests need it most.', 'Optional-property errors are the checks that prevent “cannot read properties of undefined”.'] },
  { level: 'intermediate', topic: 'cg-collab', q: 'CI on your pull request is red: one end-to-end test failed with a timeout. What should you do first?', options: ['Click re-run until the check turns green', 'Merge anyway, since a single timeout is almost certainly just flakiness', 'Open the log or trace and find out why it failed', 'Ask for approval and disable the failing test'], correct: 2,
    why: ['Rerunning without looking can hide a real regression your change introduced.', 'Assuming flakiness without evidence is how real bugs reach production.', 'Correct — the trace shows the page at the moment of failure; then decide whether it is your change, the test or the environment.', 'Disabling a test to merge removes coverage and hides the cause.'] },
  { level: 'advanced', topic: 'cg-clean-tests', q: 'How should you remove the conditional from this test? if (await cookieBanner.isVisible()) { await cookieBanner.getByRole("button", { name: "Accept" }).click(); }', options: ['Set the consent state in setup, and test the banner in its own test', 'Wrap the if statement in try/catch so that it can never fail', 'Add waitForTimeout(2000) before the if so the banner always shows', 'Pass a longer timeout to isVisible() so the result becomes reliable every time'], correct: 0,
    why: ['Correct — deterministic state (e.g. a consent cookie or storage state for test users) means every run follows the same path; the banner gets its own explicit test.', 'Swallowing errors hides problems and keeps the test non-deterministic.', 'A sleep slows every run and still does not guarantee the banner’s state.', 'isVisible() checks immediately and does not wait, so a timeout does not make it reliable.'] }
]);

QA_CONTENT.addDrills('code-git', [
  {
    id: 'cg-d1', type: 'classify', level: 'beginner',
    title: 'Commit it or keep it out of Git?',
    prompt: 'You are about to commit a Playwright project. Decide whether each item belongs in the repository or must stay out of Git.',
    categories: ['Commit it', 'Keep it out of Git'],
    items: [
      { text: 'tests/checkout.spec.ts', cat: 0, why: 'Test code is the point of the repository — commit it.' },
      { text: '.env containing QA_USER_PASSWORD=Winter2024!', cat: 1, why: 'Real secrets never go into Git. Keep <code>.env</code> in <code>.gitignore</code>; if it was ever pushed, rotate the password.' },
      { text: '.env.example listing variable names with empty values', cat: 0, why: 'It documents which variables are needed without exposing any values.' },
      { text: 'playwright.config.ts', cat: 0, why: 'Shared configuration (projects, baseURL, retries) must be versioned so everyone and CI run the same way.' },
      { text: 'node_modules/', cat: 1, why: 'Dependencies are reinstalled from <code>package.json</code> and the lock file; committing them bloats the repo.' },
      { text: 'playwright-report/ and test-results/', cat: 1, why: 'Generated output from each run — share it as a CI artifact, not in Git.' },
      { text: 'package-lock.json', cat: 0, why: 'The lock file pins exact dependency versions so every machine installs the same thing.' },
      { text: 'playwright/.auth/user.json (saved login state)', cat: 1, why: 'Stored cookies and tokens work like a password for that account — keep them out of Git.' }
    ]
  },
  {
    id: 'cg-d2', type: 'order', level: 'beginner',
    title: 'From idea to merged test',
    prompt: 'Put these steps for contributing a new test in the correct order.',
    items: [
      'Update main: git switch main, then git pull',
      'Create a branch: git switch -c test/coupon-expiry',
      'Write the test and run it locally until it passes for the right reason',
      'Stage the files and review them with git diff --staged',
      'Commit with a clear message such as “Add boundary tests for coupon expiry”',
      'Push the branch and open a pull request with a description',
      'Address review comments, wait for green CI checks, then merge'
    ],
    explain: 'Start from an up-to-date <code>main</code> so your branch has the latest code, keep work on a branch, review your own staged diff before committing, and let review plus CI act as the final gate before merging. “Passes for the right reason” means you have also seen it fail when the behaviour is broken.'
  },
  {
    id: 'cg-d3', type: 'spot', level: 'intermediate',
    title: 'Spot the async bugs',
    prompt: 'This Playwright test is flaky and once passed while the coupon service was down. Select every line that contains a bug.',
    lines: [
      { text: "test('coupon SAVE10 gives 10% off', async ({ page }) => {", flaw: false, why: 'A clear behaviour-based name and an async test function — fine.' },
      { text: "  await page.goto('/cart');", flaw: false, why: 'Navigation is awaited.' },
      { text: "  page.getByLabel('Coupon code').fill('SAVE10');", flaw: true, why: '<b>Missing await.</b> The click on the next line can happen before the code is typed.' },
      { text: "  await page.getByRole('button', { name: 'Apply' }).click();", flaw: false, why: 'A user-facing locator and an awaited action — fine.' },
      { text: '  await page.waitForTimeout(3000);', flaw: true, why: '<b>Hard-coded sleep.</b> Too slow when the app is fast, too short on a slow CI runner. Wait for a condition instead.' },
      { text: "  expect(page.getByTestId('discount')).toHaveText('-$5.00');", flaw: true, why: '<b>Unawaited web-first assertion.</b> It returns a promise; without <code>await</code> the test can finish before it is checked — which is how it passed with the service down.' },
      { text: "  await expect(page.getByTestId('total')).toHaveText('$44.98');", flaw: false, why: 'Awaited, retrying assertion with an exact expected value — correct.' },
      { text: '});', flaw: false, why: 'End of the test.' }
    ]
  },
  {
    id: 'cg-d4', type: 'fill', level: 'beginner',
    title: 'Predict the output',
    prompt: 'Type exactly what Node prints for each line. Predict first, then check with node -e if you are unsure.',
    fields: [
      { label: 'console.log(0.1 + 0.2 === 0.3)', accept: ['false'], why: 'The sum is 0.30000000000000004 because of binary floating point. Keep money in integer cents.' },
      { label: "console.log('5' + 3)", accept: ['53', "'53'", '"53"'], why: 'With a string involved, + concatenates: "5" + 3 is the string 53.' },
      { label: 'console.log(typeof NaN)', accept: ['number', "'number'", '"number"'], why: 'NaN (“not a number”) is a special numeric value, so typeof says number. Detect it with Number.isNaN().' },
      { label: 'console.log([4, 8, 15].find(n => n > 5))', accept: ['8'], why: '<code>find</code> returns the <b>first</b> matching item, not all of them — use <code>filter</code> for that.' },
      { label: "console.log(Boolean('0'))", accept: ['true'], why: 'Any non-empty string is truthy, including "0". Only the empty string is falsy.' },
      { label: 'console.log([10, 20].filter(n => n > 50).length)', accept: ['0'], why: '<code>filter</code> returns an empty array when nothing matches (never undefined), and its length is 0.' }
    ]
  }
]);
