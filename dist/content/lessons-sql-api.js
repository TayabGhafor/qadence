/* Qadence content · stage "sql-api" · lessons 1–8 (SQL basics → mocks & microservices),
   plus Test Center bank questions and practice drills for the stage.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-sql-api.js */
QA_CONTENT.addLessons('sql-api', [
  {
    id: 'sa-sql-basics',
    n: 1,
    level: 'beginner',
    title: 'Databases and SQL basics for testers',
    summary: 'Read data straight from a database with SELECT, WHERE, ORDER BY and LIMIT so you can confirm what an application really saved.',
    minutes: 20,
    objectives: [
      'Describe tables, rows, columns, primary keys and foreign keys',
      'Write SELECT queries that filter with WHERE, AND/OR, IN, BETWEEN, LIKE and IS NULL',
      'Sort and trim results with ORDER BY and LIMIT',
      'Follow safe, read-only habits on shared test databases'
    ],
    body: [
      { t: 'p', html: 'A screen that says “Order placed!” only proves the screen was told something. Behind it, the application writes rows into a <b>database</b>, and that stored data is what invoices, reports and the next screen will read. When you can query the database yourself, you can confirm the right values were saved, find test data in seconds and attach hard evidence to a bug report. For most QA roles, reading data with <b>SQL</b> (Structured Query Language) is the database skill that matters most.' },
      { t: 'h', text: 'Tables, rows, columns and keys' },
      { t: 'p', html: 'A relational database stores data in <b>tables</b>. Each <b>row</b> is one record (one customer, one order) and each <b>column</b> is one attribute (name, city, total). A <b>primary key</b> uniquely identifies every row — no two customers share a <code>customer_id</code>, and it is never empty. A <b>foreign key</b> is a column that points to a primary key in another table: <code>orders.customer_id</code> must match an existing <code>customers.customer_id</code>, which links every order to the person who placed it.' },
      { t: 'table', caption: 'customers — sample data used in this lesson', head: ['customer_id (PK)', 'name', 'city', 'email'], rows: [
        ['1', 'Ayesha Khan', 'Lahore', 'ayesha@example.com'],
        ['2', 'Rahul Mehta', 'Mumbai', 'rahul@example.com'],
        ['3', 'Sara Ali', 'Karachi', '<i>NULL</i>'],
        ['4', 'Omar Farooq', 'Lahore', 'omar@example.com']
      ] },
      { t: 'table', caption: 'orders — customer_id is a foreign key to customers', head: ['order_id (PK)', 'customer_id (FK)', 'status', 'total', 'created_at'], rows: [
        ['101', '1', 'PAID', '2500.00', '2026-03-01'],
        ['102', '2', 'PENDING', '1200.00', '2026-03-02'],
        ['103', '1', 'SHIPPED', '800.00', '2026-03-05'],
        ['104', '3', 'CANCELLED', '450.00', '2026-03-07'],
        ['105', '2', 'PAID', '3100.00', '2026-03-09']
      ] },
      { t: 'code', lang: 'sql', title: 'Reading data with SELECT', code: `-- Only the columns you need, from one table
SELECT order_id, status, total
FROM orders;

-- Paid orders, biggest first
SELECT order_id, total
FROM orders
WHERE status = 'PAID'
ORDER BY total DESC;        -- 105 (3100.00), 101 (2500.00)

-- The three most recent orders
SELECT order_id, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 3;                    -- 105, 104, 103

-- Customers with no email on file
SELECT customer_id, name
FROM customers
WHERE email IS NULL;        -- 3, Sara Ali` },
      { t: 'table', caption: 'Filtering rows with WHERE (results use the sample tables above)', head: ['Operator', 'Example', 'Rows returned'], rows: [
        ["<code>=</code> and <code>&lt;&gt;</code> (not equal)", "<code>status = 'PAID'</code>", 'Orders 101, 105'],
        ['<code>AND</code> — both must be true', "<code>status = 'PAID' AND total &gt; 3000</code>", 'Order 105'],
        ['<code>OR</code> — either may be true', "<code>city = 'Lahore' OR city = 'Karachi'</code>", 'Customers 1, 3, 4'],
        ['<code>IN</code> — matches any value in a list', "<code>status IN ('PENDING', 'CANCELLED')</code>", 'Orders 102, 104'],
        ['<code>BETWEEN</code> — a range, <b>both ends included</b>', '<code>total BETWEEN 800 AND 2500</code>', 'Orders 101, 102, 103'],
        ['<code>LIKE</code> — pattern: <code>%</code> any characters, <code>_</code> exactly one', "<code>name LIKE 'A%'</code>", 'Ayesha Khan'],
        ['<code>IS NULL</code> / <code>IS NOT NULL</code>', '<code>email IS NULL</code>', 'Sara Ali']
      ] },
      { t: 'callout', tone: 'key', title: 'NULL means unknown, not empty', html: "NULL is the absence of a value. Any comparison with it gives “unknown”, so the row is left out. <code>WHERE email = NULL</code> returns nothing, and even <code>WHERE email &lt;&gt; 'rahul@example.com'</code> returns only Ayesha and Omar — Sara silently disappears. Use <code>IS NULL</code> and <code>IS NOT NULL</code>, and remember that NULL is different from an empty string <code>''</code> or the number 0." },
      { t: 'callout', tone: 'warn', title: 'AND is evaluated before OR', html: "<code>WHERE status = 'PAID' OR status = 'SHIPPED' AND total &lt; 1000</code> means “every PAID order, <b>or</b> SHIPPED orders under 1000” and returns 101, 103 and 105. If you meant “cheap orders that are paid or shipped”, add brackets: <code>WHERE (status = 'PAID' OR status = 'SHIPPED') AND total &lt; 1000</code> returns only 103. Whenever AND and OR appear together, use brackets." },
      { t: 'h', text: 'Read-only habits on shared databases' },
      { t: 'list', items: [
        'Use a <b>read-only account</b> where one exists. You cannot break what you cannot change.',
        'Select the columns you need, filter on a key, and add <code>LIMIT</code> while exploring. <code>SELECT *</code> over millions of rows slows the shared server for everyone.',
        'Never run <code>UPDATE</code>, <code>DELETE</code> or <code>DROP</code> on a shared database without the team’s agreement. An <code>UPDATE</code> without <code>WHERE</code> changes every row in the table.',
        'Create and change test data through the application or API, so business rules and audit logs still run.',
        'Never query production without explicit permission, and never paste personal data such as emails or phone numbers into tickets or chat.'
      ] },
      { t: 'callout', tone: 'info', title: 'Small dialect differences', html: '<code>LIMIT</code> works in MySQL, PostgreSQL and SQLite. SQL Server uses <code>SELECT TOP 3 …</code> and Oracle uses <code>FETCH FIRST 3 ROWS ONLY</code>. Text matching varies too: <code>LIKE</code> ignores letter case under MySQL’s default settings but is case-sensitive in PostgreSQL. Ask which database your team uses before you trust a result.' }
    ],
    example: {
      title: 'Worked example: checking a ShopFlow “missing order” report',
      blocks: [
        { t: 'p', html: '<b>Report:</b> Rahul (customer 2) says the <i>Open orders</i> tab shows one order, but he believes he has two. The requirement says open orders are those with status <b>PENDING</b> or <b>PAID</b> — not yet shipped and not cancelled. Before blaming the screen, check what the database holds.' },
        { t: 'code', lang: 'sql', title: 'Read-only query on the test database', code: `SELECT order_id, status, total, created_at
FROM orders
WHERE customer_id = 2
  AND status IN ('PENDING', 'PAID')
ORDER BY created_at DESC;` },
        { t: 'table', caption: 'Result', head: ['order_id', 'status', 'total', 'created_at'], rows: [
          ['105', 'PAID', '3100.00', '2026-03-09'],
          ['102', 'PENDING', '1200.00', '2026-03-02']
        ] },
        { t: 'p', html: 'The database holds <b>two</b> open orders, so the data is fine and the defect sits in the API or the UI filter — the tab probably shows only PENDING orders. The bug report now contains the requirement, the exact query, its result and a screenshot of the tab. Next, call the orders API for the same customer to see which layer drops order 105.' }
      ]
    },
    explain: {
      'ur': 'SQL وہ زبان ہے جس سے ہم database سے سوال پوچھتے ہیں۔ Tester کے لیے اس کا سب سے بڑا فائدہ یہ ہے کہ وہ خود دیکھ سکتا ہے کہ app نے data صحیح محفوظ کیا یا نہیں، صرف screen پر بھروسہ نہیں کرنا پڑتا۔ Database میں tables ہوتے ہیں؛ ہر row ایک record ہے اور ہر column ایک خاصیت۔ Primary key ہر row کی منفرد پہچان ہے اور foreign key دو tables کو آپس میں جوڑتی ہے۔ مثال: SELECT status FROM orders WHERE order_id = 101; بتائے گا کہ order 101 کا status کیا ہے۔ یاد رکھیں: خالی value یعنی NULL ڈھونڈنے کے لیے = NULL نہیں بلکہ IS NULL لکھیں۔ اور shared database پر صرف SELECT چلائیں، بغیر اجازت UPDATE یا DELETE کبھی نہیں۔',
      'ur-Latn': 'SQL woh language hai jis se hum database se sawal poochte hain. Tester ke liye iska sab se bara faida yeh hai ke woh khud dekh sakta hai ke app ne data sahi save kiya ya nahi — sirf screen par bharosa nahi karna parta. Database mein tables hotay hain; har row ek record hai aur har column ek attribute. Primary key har row ki unique pehchaan hai, aur foreign key do tables ko aapas mein jorti hai. Misaal: SELECT status FROM orders WHERE order_id = 101; batayega ke order 101 ka status kya hai. Yaad rakhein: khaali value yani NULL dhoondne ke liye = NULL nahi balke IS NULL likhein. Aur shared database par sirf SELECT chalayein — baghair ijazat UPDATE ya DELETE kabhi nahi.',
      'hi': 'SQL वह भाषा है जिससे हम database से सवाल पूछते हैं। Tester के लिए इसका सबसे बड़ा फ़ायदा यह है कि वह ख़ुद देख सकता है कि app ने data सही save किया या नहीं — सिर्फ़ screen पर भरोसा नहीं करना पड़ता। Database में tables होती हैं; हर row एक record है और हर column एक attribute। Primary key हर row की unique पहचान है, और foreign key दो tables को आपस में जोड़ती है। उदाहरण: SELECT status FROM orders WHERE order_id = 101; बताएगा कि order 101 का status क्या है। याद रखें: ख़ाली value यानी NULL ढूँढने के लिए = NULL नहीं, बल्कि IS NULL लिखें। और shared database पर सिर्फ़ SELECT चलाएँ — बिना अनुमति UPDATE या DELETE कभी नहीं।',
      'ar': 'لغة SQL هي الطريقة التي نطرح بها الأسئلة على قاعدة البيانات. أكبر فائدة للمختبِر أنه يستطيع أن يتأكد بنفسه من أن التطبيق حفظ البيانات بشكل صحيح، بدلًا من الاعتماد على ما تعرضه الشاشة فقط. تتكوّن قاعدة البيانات من جداول (tables)؛ كل صف (row) هو سجلّ واحد، وكل عمود (column) خاصية واحدة. المفتاح الأساسي (primary key) يميّز كل صف عن غيره، والمفتاح الأجنبي (foreign key) يربط بين جدولين. مثال: الاستعلام SELECT status FROM orders WHERE order_id = 101; يُظهر حالة الطلب رقم 101. تذكّر: للبحث عن القيمة المفقودة NULL اكتب IS NULL وليس = NULL. وعلى قاعدة بيانات مشتركة استخدم SELECT فقط، ولا تنفّذ UPDATE أو DELETE دون إذن.',
      'es': 'SQL es el lenguaje con el que le hacemos preguntas a una base de datos. Para un tester, su mayor ventaja es comprobar por sí mismo si la aplicación guardó bien los datos, en lugar de confiar solo en lo que muestra la pantalla. Una base de datos tiene tablas; cada fila (row) es un registro y cada columna (column) un atributo. La clave primaria (primary key) identifica cada fila de forma única y la clave foránea (foreign key) une dos tablas. Ejemplo: SELECT status FROM orders WHERE order_id = 101; te dice el estado del pedido 101. Recuerda: para buscar valores ausentes (NULL) escribe IS NULL, no = NULL. Y en una base de datos compartida usa solo SELECT; nunca UPDATE ni DELETE sin permiso.'
    },
    keyTerms: [
      { term: 'Primary key', def: 'A column (or set of columns) whose value uniquely identifies each row in a table and is never NULL.' },
      { term: 'Foreign key', def: 'A column that must match a primary key in another table, linking related rows such as an order to its customer.' },
      { term: 'NULL', def: 'A marker for a missing or unknown value. It is not zero or an empty string, and must be tested with IS NULL.' },
      { term: 'SELECT', def: 'The SQL statement that reads data. It never changes rows, which makes it the tester’s everyday tool.' },
      { term: 'WHERE clause', def: 'The part of a query that filters rows, using conditions such as =, IN, BETWEEN, LIKE and IS NULL.' }
    ],
    practice: [
      { q: "Write a query that lists the <code>customer_id</code>, <code>name</code> and <code>email</code> of customers in Lahore, sorted by name. Which rows come back?", hint: 'Filter on city, then ORDER BY name.', answer: "<code>SELECT customer_id, name, email FROM customers WHERE city = 'Lahore' ORDER BY name;</code> returns <b>1 Ayesha Khan</b> and <b>4 Omar Farooq</b>, in that order (ascending is the default)." },
      { q: "Predict the result: <code>SELECT name FROM customers WHERE email &lt;&gt; 'rahul@example.com';</code> How many rows, and why?", hint: 'Look at Sara’s email.', answer: "<b>Two rows</b> — Ayesha Khan and Omar Farooq. Sara’s email is NULL, so the comparison is “unknown” and her row is excluded. To include her, add <code>OR email IS NULL</code>. Missing NULL rows like this are a classic cause of wrong counts in reports." },
      { q: 'Find orders that are <b>PENDING</b> or <b>CANCELLED</b> with a total from 400 to 1500 inclusive. Write the query and list the matching order ids.', answer: "<code>SELECT order_id, status, total FROM orders WHERE status IN ('PENDING', 'CANCELLED') AND total BETWEEN 400 AND 1500;</code> returns <b>102</b> (PENDING, 1200.00) and <b>104</b> (CANCELLED, 450.00). <code>BETWEEN</code> includes both 400 and 1500." },
      { q: "A teammate on the shared staging database types <code>UPDATE orders SET status = 'PAID';</code> to “quickly fix one test order”. What is wrong, and what should they do instead?", answer: 'There is no <code>WHERE</code>, so <b>every</b> order becomes PAID, breaking other testers’ data. They should not change shared data directly at all: use the application or API to move the order through its normal flow, or ask the team before any direct change. If a direct change is agreed, run a <code>SELECT</code> with the same <code>WHERE</code> first to see exactly which rows would change.' }
    ],
    quiz: [
      { q: 'Which condition correctly finds customers whose email is missing (stored as NULL)?', options: ['<code>WHERE email = NULL</code>', '<code>WHERE email IS NULL</code>', "<code>WHERE email = ''</code>", '<code>WHERE email IS EMPTY</code>'], correct: 1,
        why: ['Any comparison with NULL using = is “unknown”, so this returns no rows at all.', 'Right — IS NULL is the only reliable test for a missing value.', 'This matches empty strings, which are a different value from NULL.', 'IS EMPTY is not standard SQL for this check; the query would fail.'] },
      { q: 'Orders have totals 2500, 1200, 800, 450 and 3100. How many rows does WHERE total BETWEEN 800 AND 2500 return?', options: ['1 — only 1200', '2 — 1200 and 800', '2 — 2500 and 1200', '3 — 2500, 1200 and 800'], correct: 3,
        why: ['BETWEEN is inclusive, so both 800 and 2500 also match.', 'This forgets that the upper end, 2500, is included.', 'This forgets that the lower end, 800, is included.', 'Correct — BETWEEN includes both boundary values, just like “800 ≤ total ≤ 2500”.'] },
      { q: 'What does a foreign key such as orders.customer_id do?', options: ['Requires each value to match an existing customer, linking every order to a real customer', 'Uniquely identifies each order row so that no two orders can share it', 'Creates an index whose only purpose is to make searches and reports on that column run faster', 'Encrypts the customer reference so that testers cannot read it'], correct: 0,
        why: ['Right — a foreign key enforces the link between two tables (referential integrity).', 'That describes a primary key, such as orders.order_id.', 'Indexes are a separate feature; many databases do not create one automatically for a foreign key.', 'Keys are about relationships and uniqueness, not encryption.'] },
      { q: 'A tester wants cheap orders that are either PAID or SHIPPED and writes: WHERE status = \'PAID\' OR status = \'SHIPPED\' AND total < 1000. What actually happens?', options: ['Only SHIPPED orders under 1000 are returned', 'The database rejects the query because brackets are required', 'AND is applied first, so every PAID order is returned plus SHIPPED orders under 1000', 'OR is applied first, so the query returns exactly the cheap PAID or SHIPPED orders the tester intended'], correct: 2,
        why: ['PAID orders are also returned, whatever their total.', 'Mixing AND and OR without brackets is valid SQL; it just may not mean what you think.', 'Correct — AND binds tighter than OR. Brackets around the OR fix the intent.', 'OR does not take precedence over AND; that is the trap.'] },
      { q: 'You need to confirm the status of order 5012 on a shared staging database. What is the safest approach?', options: ['Run SELECT * FROM orders to browse the whole table', 'Run a SELECT of the needed columns filtered by order_id, using a read-only account', 'Run an UPDATE on order 5012 to see whether it succeeds', 'Copy the production orders table into staging first so the data looks realistic and complete'], correct: 1,
        why: ['Unfiltered queries on big tables waste shared resources and expose more data than needed.', 'Right — filtered, minimal and read-only: you get the evidence without risk.', 'Changing data to “test” it corrupts shared test data and is not a read.', 'Copying production data needs explicit permission and usually masking; it is not a way to check one order.'] }
    ],
    interview: [
      { q: 'How do you use SQL in your day-to-day testing?', a: 'Mostly for <b>reading</b> data. After an action in the UI or API, I run a <code>SELECT</code> on the affected tables to confirm the saved values — status, amounts, timestamps and foreign keys — instead of trusting the success message. I also use queries to find suitable test data (for example a customer with no orders), to decide whether a bug is in the data or in the display, and to attach the exact query and result to the bug report. On shared environments I use a read-only account, filter by key and never change data outside the application without agreement.' },
      { q: 'What is the difference between NULL, an empty string and zero?', a: "<b>NULL</b> means the value is missing or unknown; an <b>empty string</b> <code>''</code> is a known text value with no characters; <b>0</b> is a known number. They behave differently: <code>= NULL</code> never matches, so you must use <code>IS NULL</code>, and comparisons such as <code>&lt;&gt;</code> silently skip NULL rows. As a tester I check which one the system stores for optional fields, because a mix of NULL and <code>''</code> often causes filter, search and report bugs." }
    ],
    takeaways: [
      'Don’t trust the success message — read the stored data with SELECT.',
      'Primary keys identify rows; foreign keys link tables.',
      'Use IS NULL, never = NULL — and remember comparisons silently skip NULL rows.',
      'Use brackets whenever AND and OR appear together.',
      'On shared databases: read-only, filtered by key, no changes without agreement.'
    ]
  },
  {
    id: 'sa-api-basics',
    n: 2,
    level: 'beginner',
    title: 'API fundamentals: REST, methods, status codes and JSON',
    summary: 'Read any HTTP request and response with confidence: methods, status codes, headers and JSON — and know what each one really proves.',
    minutes: 22,
    objectives: [
      'Explain what an API is and how REST models resources as URLs',
      'Compare GET, POST, PUT, PATCH and DELETE, including which are safe and idempotent',
      'Interpret the key status codes accurately, especially 401 vs 403',
      'Read headers and JSON bodies and spot common mistakes'
    ],
    body: [
      { t: 'p', html: 'An <b>API</b> (Application Programming Interface) is an agreed way for one program to ask another for data or actions. The ShopFlow website and the ShopFlow mobile app look different, but both call the same API to list products and place orders. Testing the API directly is faster and more stable than clicking through screens, it catches business-rule bugs below the UI, and it checks the rules a user could reach without the UI at all — anyone can send a request with a tool or a script.' },
      { t: 'p', html: 'Most web APIs follow the <b>REST</b> style. Data is organised as <b>resources</b> with URLs — <code>/orders</code> is the collection, <code>/orders/5012</code> is one order, <code>/customers/1/orders</code> is one customer’s orders. You act on a resource with an HTTP <b>method</b>, and every request carries what the server needs, such as an access token, because the server does not remember earlier requests (REST is <i>stateless</i>).' },
      { t: 'h', text: 'Methods and what they promise' },
      { t: 'table', head: ['Method', 'Typical use', 'Safe?', 'Idempotent?', 'Usual success code'], rows: [
        ['<b>GET</b>', 'Read a resource or a list', 'Yes', 'Yes', '200'],
        ['<b>POST</b>', 'Create a resource or trigger an action', 'No', 'No', '201 (or 200 / 202)'],
        ['<b>PUT</b>', 'Replace a resource with the body sent', 'No', 'Yes', '200 or 204'],
        ['<b>PATCH</b>', 'Change only some fields', 'No', 'Not guaranteed', '200 or 204'],
        ['<b>DELETE</b>', 'Remove a resource', 'No', 'Yes', '204 (or 200)']
      ] },
      { t: 'callout', tone: 'key', title: 'Safe vs idempotent', html: '<b>Safe</b> means the request does not change server state (GET, HEAD, OPTIONS). <b>Idempotent</b> means sending the same request once or ten times leaves the server in the same state. Deleting order 5012 twice still leaves it deleted — the second call may return 404, but nothing extra changed. POST is neither, so a double-clicked “Place order” button or an automatic retry can create two orders. That is exactly the kind of test a QA engineer should run.' },
      { t: 'h', text: 'Status codes: what the server is telling you' },
      { t: 'table', caption: 'Families: 1xx information · 2xx success · 3xx redirection · 4xx client error · 5xx server error', head: ['Code', 'Meaning', 'Typical tester example'], rows: [
        ['<b>200</b> OK', 'The request succeeded; the body holds the result', 'GET /orders/5012 returns the order'],
        ['<b>201</b> Created', 'A new resource was created, often with a <code>Location</code> header pointing to it', 'POST /orders creates order 5012'],
        ['<b>204</b> No Content', 'Succeeded, and there is deliberately no body', 'DELETE /cart/items/9 removes the item'],
        ['<b>301</b> / <b>302</b>', 'Redirect — 301 Moved Permanently, 302 Found (temporary); <code>Location</code> gives the new URL', 'An old /v1 URL redirects to /v2'],
        ['<b>400</b> Bad Request', 'The server cannot process the request as sent: malformed JSON, wrong types, missing parameters', 'The body is cut off half-way'],
        ['<b>401</b> Unauthorized', '<b>Not authenticated</b> — credentials are missing, invalid or expired', 'No token, or an expired token'],
        ['<b>403</b> Forbidden', '<b>Authenticated but not allowed</b> to do this', 'A customer calls an admin-only endpoint'],
        ['<b>404</b> Not Found', 'No such resource — also used on purpose to hide resources the caller may not see', 'GET /orders/99999'],
        ['<b>409</b> Conflict', 'The request conflicts with the current state of the resource', 'Registering an email that already exists'],
        ['<b>422</b> Unprocessable Content', 'Well-formed, but the content breaks a rule (some APIs use 400 here — the contract decides)', 'A delivery date in the past'],
        ['<b>429</b> Too Many Requests', 'Rate limit reached; a <code>Retry-After</code> header may say when to try again', '120 requests in a minute when the limit is 100'],
        ['<b>500</b> Internal Server Error', 'An unexpected failure on the server — always worth a bug report', 'A missing field crashes the order service'],
        ['<b>502</b> Bad Gateway', 'A gateway or proxy got an invalid response from the service behind it', 'The gateway gets garbage back from the payment service'],
        ['<b>503</b> Service Unavailable', 'Temporarily unable to handle requests (overload or maintenance); may send <code>Retry-After</code>', 'During a planned deployment window']
      ] },
      { t: 'callout', tone: 'warn', title: 'Two traps testers must not fall into', html: '<b>401 vs 403:</b> 401 means “we don’t know who you are” — fix the credentials. 403 means “we know who you are, and you may not do this” — logging in again will not help. <b>A 2xx code is a claim, not proof:</b> a 201 does not show the right values were stored. Confirm with a <code>GET</code> of the new resource or a read-only database query.' },
      { t: 'h', text: 'Headers and JSON' },
      { t: 'list', items: [
        '<code>Content-Type</code> — the format of the body being sent, e.g. <code>application/json</code>. Responses carry it too; a JSON body labelled <code>text/html</code> is a bug.',
        '<code>Accept</code> — the format the client wants back. If the server cannot provide it, it may answer <b>406 Not Acceptable</b>.',
        '<code>Authorization</code> — credentials, most often <code>Bearer &lt;token&gt;</code>. Never paste a real token into a bug report.',
        '<code>Cache-Control</code> and <code>ETag</code> — caching rules. A client can send <code>If-None-Match</code> with the ETag and get <b>304 Not Modified</b>. Personal data should not be stored by shared caches.',
        '<code>Location</code> — on a 201 or a redirect, the URL of the new or moved resource.'
      ] },
      { t: 'p', html: '<b>JSON</b> is the usual body format. It has <b>objects</b> <code>{ }</code> of key–value pairs, <b>arrays</b> <code>[ ]</code>, and values that are strings in double quotes, numbers, <code>true</code>/<code>false</code> or <code>null</code>. Keys must use double quotes, and trailing commas and comments are not allowed. Types matter: <code>"2400"</code> (a string) is not <code>2400</code> (a number), and a field set to <code>null</code> is not the same as a field that is missing.' }
    ],
    example: {
      title: 'Worked example: reading a ShopFlow create-order exchange',
      blocks: [
        { t: 'code', lang: 'http', title: 'Request, then response', code: `POST /api/v1/orders HTTP/1.1
Host: api.shopflow.test
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access-token>

{
  "customerId": 1,
  "items": [{ "productId": 77, "quantity": 2 }],
  "couponCode": null
}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/orders/5012

{
  "id": 5012,
  "customerId": 1,
  "status": "PENDING",
  "items": [{ "productId": 77, "quantity": 2, "unitPrice": 1200.00 }],
  "total": 2400.00,
  "createdAt": "2026-03-10T09:15:00Z"
}` },
        { t: 'table', head: ['Check', 'Evidence in this exchange', 'Why it matters'], rows: [
          ['Status and headers', '<b>201 Created</b>, <code>Location</code> points to the new order, JSON content type', 'Matches the contract for a create call'],
          ['Body values', 'Status PENDING, total = 2 × 1200.00 = 2400.00, timestamp in UTC', 'Business rules ran, not just “something was saved”'],
          ['Types and safety', '<code>id</code> is a number; no internal or secret fields returned', 'Clients parse it reliably; nothing leaks'],
          ['Persistence', 'Not proven yet — call <code>GET /api/v1/orders/5012</code> or run a read-only query', 'A 201 is the server’s claim, not evidence']
        ] },
        { t: 'p', html: 'Then repeat the request with negative inputs — no token (expect <b>401</b>), quantity 0, a product that does not exist — and send it twice to see whether a duplicate order is created. Each variation is a separate test with its own expected status and message, so a failure points straight at one rule.' }
      ]
    },
    explain: {
      'ur': 'API ایک طریقہ ہے جس سے ایک program دوسرے program سے بات کرتا ہے۔ ہر request میں ایک method ہوتا ہے (GET پڑھنے کے لیے، POST نیا بنانے کے لیے، PUT یا PATCH بدلنے کے لیے، DELETE مٹانے کے لیے)، ایک URL، headers اور اکثر JSON body۔ Response کا status code بتاتا ہے کہ کیا ہوا: 2xx کامیابی، 4xx client کی غلطی، 5xx server کی غلطی۔ مثال: POST /orders پر 201 Created آئے تو order بن گیا، لیکن tester پھر GET /orders/5012 سے تصدیق کرتا ہے کہ data واقعی محفوظ ہوا۔ ایک اہم فرق یاد رکھیں: 401 کا مطلب ہے آپ کی پہچان نہیں ہوئی (token غائب یا expired)، اور 403 کا مطلب ہے پہچان ہو گئی مگر اجازت نہیں۔',
      'ur-Latn': 'API ek tareeqa hai jis se ek program doosre program se baat karta hai. Har request mein ek method hota hai (GET parhne ke liye, POST naya banane ke liye, PUT ya PATCH badalne ke liye, DELETE mitane ke liye), ek URL, headers aur aksar JSON body. Response ka status code batata hai ke kya hua: 2xx success, 4xx client ki ghalti, 5xx server ki ghalti. Misaal: POST /orders par 201 Created aaye to order ban gaya — lekin tester phir GET /orders/5012 se confirm karta hai ke data waqai save hua. Ek ahem farq yaad rakhein: 401 ka matlab hai aap ki pehchaan nahi hui (token missing ya expired), aur 403 ka matlab hai pehchaan ho gayi magar ijazat nahi.',
      'hi': 'API एक तरीक़ा है जिससे एक program दूसरे program से बात करता है। हर request में एक method होता है (GET पढ़ने के लिए, POST नया बनाने के लिए, PUT या PATCH बदलने के लिए, DELETE हटाने के लिए), एक URL, headers और अक्सर JSON body। Response का status code बताता है कि क्या हुआ: 2xx सफलता, 4xx client की ग़लती, 5xx server की ग़लती। उदाहरण: POST /orders पर 201 Created आए तो order बन गया — लेकिन tester फिर GET /orders/5012 से पुष्टि करता है कि data सच में save हुआ। एक ज़रूरी फ़र्क़ याद रखें: 401 का मतलब है आपकी पहचान नहीं हुई (token नहीं है या expire हो गया), और 403 का मतलब है पहचान हो गई पर अनुमति नहीं है।',
      'ar': 'الـ API هي الطريقة التي يتحدث بها برنامج مع برنامج آخر. يحتوي كل طلب (request) على طريقة (method): GET للقراءة، وPOST للإنشاء، وPUT أو PATCH للتعديل، وDELETE للحذف، بالإضافة إلى عنوان URL وترويسات (headers) وغالبًا جسم بصيغة JSON. ويخبرنا رمز الحالة (status code) في الاستجابة بما حدث: 2xx نجاح، و4xx خطأ من جهة العميل، و5xx خطأ في الخادم. مثال: إذا أعاد POST /orders الرمز 201 Created فقد أُنشئ الطلب، لكن المختبِر يتأكد بعدها عبر GET /orders/5012 من أن البيانات حُفظت فعلًا. وتذكّر الفرق المهم: 401 يعني أن هويتك لم تُثبت (رمز دخول مفقود أو منتهي الصلاحية)، و403 يعني أن هويتك معروفة لكن ليست لديك صلاحية.',
      'es': 'Una API es la forma en que un programa habla con otro. Cada petición (request) lleva un método —GET para leer, POST para crear, PUT o PATCH para modificar, DELETE para borrar—, una URL, cabeceras (headers) y, a menudo, un cuerpo en JSON. El código de estado (status code) de la respuesta indica qué pasó: 2xx éxito, 4xx error del cliente, 5xx error del servidor. Ejemplo: si POST /orders devuelve 201 Created, el pedido se creó, pero el tester lo confirma con GET /orders/5012 para ver que los datos se guardaron de verdad. Recuerda una diferencia clave: 401 significa que no estás autenticado (token ausente o caducado) y 403 que sí lo estás, pero no tienes permiso.'
    },
    keyTerms: [
      { term: 'API', def: 'Application Programming Interface — an agreed way for one program to request data or actions from another.' },
      { term: 'Resource', def: 'A thing an API exposes at a URL, such as /orders/5012. REST APIs act on resources with HTTP methods.' },
      { term: 'Idempotent', def: 'Sending the same request once or many times leaves the server in the same state (GET, PUT, DELETE).' },
      { term: 'Status code', def: 'The three-digit result in every response: 2xx success, 3xx redirect, 4xx client error, 5xx server error.' },
      { term: 'Header', def: 'A name–value pair sent with a request or response, such as Content-Type, Accept or Authorization.' },
      { term: 'JSON', def: 'A text format of objects, arrays, strings, numbers, booleans and null — the usual body format for REST APIs.' }
    ],
    practice: [
      { q: 'Choose the most suitable status code for each case and say why: (a) GET <code>/orders/99999</code>, which does not exist; (b) a customer registers with an email that is already taken; (c) a request with no <code>Authorization</code> header calls <code>/orders</code>.', hint: 'One of these depends on the API contract.', answer: '(a) <b>404 Not Found</b>. (b) Commonly <b>409 Conflict</b>, because it clashes with existing data — some APIs use 400 or 422, so the contract decides and your job is to check it is applied consistently. (c) <b>401 Unauthorized</b> — the caller is not authenticated. It would be 403 only if the caller were logged in but lacked permission.' },
      { q: `Find the problems in this JSON body: <code>{ 'name': "Sara", "items": [1, 2,], "active": True }</code>`, answer: 'Three problems: keys must use double quotes (<code>"name"</code>), the trailing comma after <code>2</code> is not allowed, and booleans are lowercase <code>true</code>. A strict parser rejects the whole body, so the API should answer <b>400</b> with a clear message — a 500 would be a bug.' },
      { q: 'A tester double-clicks “Place order” and two identical orders appear. Which HTTP property explains this, and what should happen instead?', answer: 'POST is <b>not idempotent</b>: each call creates a new resource. The system should prevent accidental duplicates — for example the UI disables the button after the first click and the API accepts an idempotency key, so a repeat returns the original order instead of creating another. Report it with both order ids and timestamps.' },
      { q: 'GET <code>/account</code> returns 200 with a JSON body, but the headers say <code>Content-Type: text/html</code> and <code>Cache-Control: public, max-age=3600</code>. What would you report?', answer: 'Two issues. The content type is wrong, which can break clients that rely on it to parse JSON. And <code>public</code> lets shared caches such as proxies keep one user’s private account data for an hour, so another user could be served it. Expected: <code>application/json</code> and <code>Cache-Control: no-store</code> (or at least <code>private</code>) for personal data.' }
    ],
    quiz: [
      { q: 'Which HTTP method is idempotent but not safe?', options: ['GET', 'POST', 'PUT', 'PATCH'], correct: 2,
        why: ['GET is both safe and idempotent — it should not change anything.', 'POST is neither: repeating it can create another resource.', 'Right — PUT changes state, but sending the same PUT again gives the same result.', 'PATCH changes state and is not guaranteed to be idempotent (for example “add 1 to quantity”).'] },
      { q: 'A request to create a user returns 201 Created. What can a tester conclude?', options: ['The server reports it created the resource; stored values still need checking with a GET or a query', 'The data is now guaranteed to be stored correctly with all the right values, so no further checks are needed', 'The request was only queued, and the user will be created later', 'The client must repeat the request with a fresh token to finish'], correct: 0,
        why: ['Correct — 201 is the server’s claim. Confirm persistence and values independently.', 'A bug can still save wrong values, or save nothing behind a hard-coded response.', 'Accepted-for-later is 202 Accepted, not 201.', 'Nothing about 201 asks the client to retry; that would create duplicates.'] },
      { q: 'A logged-in customer with a valid token calls DELETE /admin/products/77, an admin-only endpoint. Which status code fits best?', options: ['401 Unauthorized', '400 Bad Request', '500 Internal Server Error', '403 Forbidden'], correct: 3,
        why: ['401 is for missing or invalid credentials; this caller is authenticated.', 'The request is well-formed; the problem is permission, not syntax.', 'Refusing an unauthorised action is expected behaviour, not a server crash.', 'Right — the caller is known but not allowed. (Some APIs return 404 to hide admin routes.)'] },
      { q: 'Which header tells the server the format of the request body?', options: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], correct: 1,
        why: ['Accept says which format the client wants back in the response.', 'Right — Content-Type describes the body being sent, such as application/json.', 'Authorization carries credentials, not format information.', 'Cache-Control sets caching rules, not body format.'] },
      { q: 'Checkout calls go through an API gateway. Suddenly POST /checkout returns 502 Bad Gateway. What does that most likely indicate?', options: ['The client sent malformed JSON in the request body', 'The customer’s access token has expired and must be refreshed before retrying', 'The client has sent too many requests and is being rate limited', 'The gateway received an invalid response from a service behind it'], correct: 3,
        why: ['Malformed input is a client error, usually 400.', 'An expired token gives 401.', 'Rate limiting is 429 Too Many Requests.', 'Correct — 502 points at an upstream service (for example payments) failing behind the gateway.'] }
    ],
    interview: [
      { q: 'What is the difference between PUT and PATCH?', a: '<b>PUT</b> replaces the whole resource with the body you send, so it is idempotent — the same PUT twice gives the same result. Fields you leave out may be reset or rejected, depending on the API. <b>PATCH</b> applies a partial change, such as updating only the phone number, and is not guaranteed to be idempotent (an operation like “add 1 to quantity” changes the result each time). As a tester I check that PATCH leaves other fields untouched, that a PUT missing required fields is rejected, and that both return the documented status codes.' },
      { q: 'What would you check when testing an endpoint that creates a resource?', a: 'First the happy path: <b>201</b>, a <code>Location</code> header, a response that matches the schema, and a generated id. Then I prove <b>persistence</b> with a GET or a read-only query rather than trusting the 201. Next, negative cases: missing and malformed fields, wrong types, boundary values, unsupported content type, no token (<b>401</b>) and insufficient role (<b>403</b>). I send the same request twice to see whether duplicates appear, and I check that sensitive fields such as password hashes never come back in the response.' }
    ],
    takeaways: [
      'REST APIs expose resources at URLs and act on them with HTTP methods.',
      'GET is safe; GET, PUT and DELETE are idempotent; POST is neither — test repeats and double-submits.',
      '401 = not authenticated; 403 = authenticated but not allowed.',
      'A 2xx code is a claim, not proof — confirm persistence with a GET or a read-only query.',
      'Check headers and JSON types, not just the status code.'
    ],
    links: { labs: ['api'], interview: ['a1'] }
  },
  {
    id: 'sa-sql-joins',
    n: 3,
    level: 'intermediate',
    title: 'Joins, GROUP BY and aggregates',
    summary: 'Combine tables with joins, summarise them with COUNT, SUM and GROUP BY, and use both to hunt duplicates and orphan records.',
    minutes: 24,
    objectives: [
      'Predict the rows returned by INNER, LEFT, RIGHT and FULL joins',
      'Summarise data with COUNT, SUM, AVG, MIN, MAX and GROUP BY',
      'Choose correctly between WHERE and HAVING, and handle NULLs in aggregates',
      'Write queries that find duplicate and orphan records'
    ],
    body: [
      { t: 'p', html: 'Real testing questions rarely live in one table. Which customers have never ordered? How much has each customer spent? Are there orders pointing to customers who do not exist? <b>Joins</b> combine tables through their keys, and <b>aggregates</b> summarise many rows into a few numbers. Together they let you verify reports and dashboards, and they are the fastest way to find <b>data-integrity bugs</b> that no single screen will show you.' },
      { t: 'p', html: 'This lesson reuses the four customers from the previous lesson (Ayesha 1, Rahul 2, Sara 3, Omar 4) with a staging copy of <code>orders</code>. A migration script loaded it <b>without</b> the foreign key, so order 106 points to customer 9, who does not exist — exactly the kind of record joins help you catch. Every result below is small enough to check by hand, which is the habit to build: predict the result first, then run the query and compare.' },
      { t: 'table', caption: 'orders (staging copy loaded by a migration)', head: ['order_id', 'customer_id', 'status', 'total'], rows: [
        ['101', '1', 'PAID', '2500.00'],
        ['102', '2', 'PENDING', '1200.00'],
        ['103', '1', 'SHIPPED', '800.00'],
        ['106', '<b>9</b> (no such customer)', 'PAID', '999.00']
      ] },
      { t: 'code', lang: 'sql', title: 'Join syntax', code: `-- INNER JOIN: only customers who have orders
SELECT c.name, o.order_id, o.total
FROM customers c
INNER JOIN orders o ON o.customer_id = c.customer_id;

-- LEFT JOIN: every customer, plus orders where they exist
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id;

-- Customers who have never ordered
SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;      -- 3 Sara Ali, 4 Omar Farooq` },
      { t: 'table', caption: 'customers c … JOIN orders o ON o.customer_id = c.customer_id', head: ['Join', 'Keeps', 'Rows', 'Result (name – order)'], rows: [
        ['<b>INNER</b>', 'Only rows that match on both sides', '3', 'Ayesha–101, Rahul–102, Ayesha–103'],
        ['<b>LEFT</b>', 'Every customer; order columns are NULL when there is no match', '5', 'The 3 matches + Sara–<i>NULL</i>, Omar–<i>NULL</i>'],
        ['<b>RIGHT</b>', 'Every order; customer columns are NULL when there is no match', '4', 'The 3 matches + <i>NULL</i>–106'],
        ['<b>FULL OUTER</b>', 'Everything from both sides', '6', 'The 3 matches + Sara–<i>NULL</i>, Omar–<i>NULL</i>, <i>NULL</i>–106']
      ] },
      { t: 'callout', tone: 'info', title: 'Support varies', html: 'A RIGHT JOIN is just a LEFT JOIN with the tables swapped, so most teams write LEFT JOIN only. MySQL has no <code>FULL OUTER JOIN</code>; you combine a LEFT JOIN and a RIGHT JOIN with <code>UNION</code> instead. PostgreSQL, SQL Server and recent SQLite versions support all four.' },
      { t: 'h', text: 'Aggregates and GROUP BY' },
      { t: 'p', html: '<code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> collapse many rows into one value. Add <code>GROUP BY</code> and you get one result row <b>per group</b> — per customer, per status, per day. Every selected column that is not inside an aggregate must appear in <code>GROUP BY</code>; strict databases such as PostgreSQL reject the query otherwise, and lenient ones may return misleading values. Testers use grouping constantly: to reconcile a dashboard figure, to count the records a batch job created, or to prove that every order has at least one item.' },
      { t: 'code', lang: 'sql', title: 'Per-customer summary', code: `SELECT c.customer_id,
       c.name,
       COUNT(o.order_id)         AS order_count,
       COALESCE(SUM(o.total), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_spent DESC, c.customer_id;
-- 1 Ayesha Khan  2  3300.00
-- 2 Rahul Mehta  1  1200.00
-- 3 Sara Ali     0     0
-- 4 Omar Farooq  0     0

-- Keep only customers with more than one order
SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count
FROM customers c
INNER JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(o.order_id) > 1;   -- 1 Ayesha Khan, 2` },
      { t: 'compare', a: { title: 'WHERE', items: ['Filters <b>rows</b> before they are grouped', 'Cannot use aggregates: <code>WHERE SUM(total) &gt; 1000</code> is an error', "Example: <code>WHERE status &lt;&gt; 'CANCELLED'</code>"] }, b: { title: 'HAVING', items: ['Filters <b>groups</b> after aggregation', 'Made for aggregates: <code>HAVING SUM(total) &gt; 1000</code>', 'Example: customers whose order count is above 1'] } },
      { t: 'callout', tone: 'key', title: 'NULLs inside aggregates', html: '<code>COUNT(*)</code> counts rows; <code>COUNT(column)</code> skips NULLs. After the LEFT JOIN above, <code>COUNT(*)</code> would give Sara <b>1</b> — the NULL-filled row — while <code>COUNT(o.order_id)</code> correctly gives 0. <code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> also ignore NULLs: ratings 5, 3 and NULL average to <b>4</b>, not 2.67. A <code>SUM</code> over no rows returns NULL, which is why <code>COALESCE(SUM(…), 0)</code> is common.' },
      { t: 'h', text: 'Hunting duplicates and orphans' },
      { t: 'code', lang: 'sql', title: 'Integrity queries every tester should keep', code: `-- Duplicate emails: ignore NULLs, catch letter-case variants
SELECT LOWER(email) AS email_key, COUNT(*) AS copies
FROM customers
WHERE email IS NOT NULL
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- Orphans: orders whose customer does not exist
SELECT o.order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;     -- 106, customer 9

-- Same check with NOT EXISTS (also safe when NULLs appear)
SELECT o.order_id
FROM orders o
WHERE NOT EXISTS (
  SELECT 1 FROM customers c WHERE c.customer_id = o.customer_id
);` },
      { t: 'callout', tone: 'warn', title: 'Two traps that produce wrong numbers', html: '<b>Join fan-out:</b> joining <code>orders</code> to <code>order_items</code> repeats each order once per item. If order 101 has two item rows, <code>SUM(o.total)</code> for Ayesha becomes 5800 instead of 3300. Sum each table at its own level, or aggregate the items in a subquery first. <b>NOT IN with NULLs:</b> if the subquery returns even one NULL, <code>customer_id NOT IN (…)</code> returns no rows at all. Prefer <code>NOT EXISTS</code>. And in <code>GROUP BY</code>, all NULLs fall into one group — filter them out before calling them duplicates.' }
    ],
    example: {
      title: 'Worked example: two ShopFlow revenue reports disagree',
      blocks: [
        { t: 'p', html: 'The operations dashboard says PAID revenue is <b>3,499.00 from 2 orders</b>. The finance export says <b>2,500.00 from 1 order</b>. Before deciding which is wrong, reproduce both numbers with read-only queries. Both teams insist their logic is right, so the tester’s job is to explain the gap with evidence, not to pick a side.' },
        { t: 'code', lang: 'sql', code: `-- Dashboard logic: orders only
SELECT status, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
GROUP BY status;

-- Finance logic: orders joined to customers
SELECT o.status, COUNT(*) AS orders, SUM(o.total) AS revenue
FROM orders o
INNER JOIN customers c ON c.customer_id = o.customer_id
GROUP BY o.status;` },
        { t: 'table', head: ['status', 'Orders only', 'Joined to customers'], rows: [
          ['PAID', '2 orders · 3499.00', '<b>1 order · 2500.00</b>'],
          ['PENDING', '1 order · 1200.00', '1 order · 1200.00'],
          ['SHIPPED', '1 order · 800.00', '1 order · 800.00']
        ] },
        { t: 'p', html: 'Only PAID differs, by exactly 999.00 — order 106. The INNER JOIN silently drops it because customer 9 does not exist. The orphan query confirms it. The real defect is the migration that skipped the foreign key, so the report includes the orphan query, its result and a recommendation to restore the constraint and fix the data. Which report definition is “correct” is a product decision to raise, not to guess.' }
      ]
    },
    explain: {
      'ur': 'JOIN دو tables کو ان کی key کے ذریعے جوڑتا ہے۔ INNER JOIN صرف وہ rows دیتا ہے جن کا دونوں طرف میل ہو، جبکہ LEFT JOIN بائیں table کی ہر row رکھتا ہے اور جہاں میل نہ ہو وہاں NULL ڈال دیتا ہے۔ اسی سے ہم وہ customers ڈھونڈتے ہیں جنہوں نے کبھی order نہیں کیا: LEFT JOIN کے بعد WHERE o.order_id IS NULL۔ GROUP BY کے ساتھ COUNT اور SUM ہر گروپ کا خلاصہ دیتے ہیں، جیسے ہر customer کا کل خرچ۔ یاد رکھیں: WHERE گروپ بننے سے پہلے rows کو چھانتا ہے اور HAVING بعد میں گروپس کو۔ COUNT(*) ہر row گنتا ہے، مگر COUNT(column) اور AVG خالی (NULL) values کو چھوڑ دیتے ہیں۔ Tester کے لیے یہ duplicates اور orphan records پکڑنے کا بہترین طریقہ ہے۔',
      'ur-Latn': 'JOIN do tables ko unki key ke zariye jorta hai. INNER JOIN sirf woh rows deta hai jin ka dono taraf match ho, jab ke LEFT JOIN left table ki har row rakhta hai aur jahan match na ho wahan NULL daal deta hai. Isi se hum woh customers dhoondte hain jinhon ne kabhi order nahi kiya: LEFT JOIN ke baad WHERE o.order_id IS NULL. GROUP BY ke saath COUNT aur SUM har group ka summary dete hain, jaise har customer ka total kharch. Yaad rakhein: WHERE group banne se pehle rows filter karta hai aur HAVING baad mein groups ko. COUNT(*) har row ginta hai, magar COUNT(column) aur AVG NULL values ko chhor dete hain. Tester ke liye yeh duplicates aur orphan records pakarne ka behtareen tareeqa hai.',
      'hi': 'JOIN दो tables को उनकी key के ज़रिए जोड़ता है। INNER JOIN सिर्फ़ वे rows देता है जिनका दोनों तरफ़ मेल हो, जबकि LEFT JOIN बाईं table की हर row रखता है और जहाँ मेल न हो वहाँ NULL भर देता है। इसी से हम वे customers ढूँढते हैं जिन्होंने कभी order नहीं किया: LEFT JOIN के बाद WHERE o.order_id IS NULL। GROUP BY के साथ COUNT और SUM हर group का सारांश देते हैं, जैसे हर customer का कुल ख़र्च। याद रखें: WHERE group बनने से पहले rows को छाँटता है और HAVING बाद में groups को। COUNT(*) हर row गिनता है, लेकिन COUNT(column) और AVG ख़ाली (NULL) values को छोड़ देते हैं। Tester के लिए यह duplicates और orphan records पकड़ने का सबसे अच्छा तरीक़ा है।',
      'ar': 'يربط JOIN بين جدولين عن طريق المفتاح المشترك. يُعيد INNER JOIN الصفوف المتطابقة في الجدولين فقط، بينما يحتفظ LEFT JOIN بكل صفوف الجدول الأيسر ويضع NULL حيث لا يوجد تطابق. بهذه الطريقة نجد العملاء الذين لم يطلبوا شيئًا قط: LEFT JOIN ثم WHERE o.order_id IS NULL. ومع GROUP BY تعطينا الدالتان COUNT وSUM ملخصًا لكل مجموعة، مثل إجمالي إنفاق كل عميل. تذكّر: يصفّي WHERE الصفوف قبل التجميع، ويصفّي HAVING المجموعات بعده. الدالة COUNT(*) تعدّ كل الصفوف، أما COUNT(column) وAVG فتتجاهلان قيم NULL. وهذه أفضل وسيلة للمختبِر لاكتشاف السجلات المكررة والسجلات اليتيمة (orphan records).',
      'es': 'Un JOIN combina dos tablas a través de su clave. INNER JOIN devuelve solo las filas que coinciden en ambos lados, mientras que LEFT JOIN conserva todas las filas de la tabla izquierda y pone NULL donde no hay coincidencia. Así encontramos a los clientes que nunca han pedido: LEFT JOIN y luego WHERE o.order_id IS NULL. Con GROUP BY, COUNT y SUM resumen cada grupo, por ejemplo el gasto total de cada cliente. Recuerda: WHERE filtra filas antes de agrupar y HAVING filtra grupos después. COUNT(*) cuenta todas las filas, pero COUNT(columna) y AVG ignoran los NULL. Para un tester, es la mejor forma de detectar duplicados y registros huérfanos.'
    },
    keyTerms: [
      { term: 'INNER JOIN', def: 'Returns only the rows that have a match in both tables according to the join condition.' },
      { term: 'LEFT JOIN', def: 'Returns every row from the left table, with NULLs in the right table’s columns when there is no match.' },
      { term: 'Aggregate function', def: 'A function such as COUNT, SUM, AVG, MIN or MAX that turns many rows into one value.' },
      { term: 'GROUP BY', def: 'Splits rows into groups that share the same values, so aggregates are calculated per group.' },
      { term: 'HAVING', def: 'Filters groups after aggregation, for example HAVING COUNT(*) > 1.' },
      { term: 'Orphan record', def: 'A row whose foreign key points to a parent row that does not exist, such as an order for a deleted customer.' }
    ],
    practice: [
      { q: 'Using the staging <code>orders</code> table, list each status with its number of orders and total value, keeping only statuses worth more than 1000 in total.', hint: 'The filter is on a SUM, so it cannot go in WHERE.', answer: '<code>SELECT status, COUNT(*) AS orders, SUM(total) AS value FROM orders GROUP BY status HAVING SUM(total) &gt; 1000;</code> returns <b>PAID · 2 · 3499.00</b> and <b>PENDING · 1 · 1200.00</b>. SHIPPED (800.00) is filtered out by HAVING.' },
      { q: 'Predict the result of <code>customers c RIGHT JOIN orders o ON o.customer_id = c.customer_id</code>. How many rows, and which one has a NULL name?', answer: '<b>Four rows</b> — one per order. Orders 101, 102 and 103 match a customer; order <b>106</b> has a NULL name because customer 9 does not exist. Sara and Omar do not appear because a RIGHT JOIN keeps all rows of the right-hand table (orders) only.' },
      { q: 'The <code>customers</code> table contains <code>ali@example.com</code>, <code>Ali@example.com</code> and two rows with a NULL email. Write a query that reports real duplicate emails and explain each part.', answer: "<code>SELECT LOWER(email), COUNT(*) FROM customers WHERE email IS NOT NULL GROUP BY LOWER(email) HAVING COUNT(*) &gt; 1;</code> <code>LOWER</code> groups case variants together (whether a plain GROUP BY does so depends on the column’s collation). <code>WHERE email IS NOT NULL</code> stops the two NULLs, which GROUP BY puts in one group, from looking like a duplicate. <code>HAVING</code> keeps groups with more than one row." },
      { q: 'A sales total built with <code>SUM(o.total)</code> after joining <code>orders</code> to <code>order_items</code> is higher than the finance figure. What is the likely cause and the fix?', answer: '<b>Join fan-out</b>: each order appears once per item row, so its total is added several times. Fix it by summing <code>orders.total</code> without joining items, or by aggregating <code>order_items</code> in a subquery (one row per order) before the join. Then reconcile against a simple <code>SUM(total) FROM orders</code>.' }
    ],
    quiz: [
      { q: 'Customers 1–4 exist. Orders belong to customers 1, 2, 1 and 9 (customer 9 does not exist). How many rows does customers LEFT JOIN orders return?', options: ['5', '3', '4', '6'], correct: 0,
        why: ['Right — 3 matched rows plus one NULL-filled row each for customers 3 and 4.', 'That is the INNER JOIN result; LEFT JOIN also keeps customers without orders.', 'That is the RIGHT JOIN result (every order kept).', 'That is the FULL OUTER JOIN result, which also keeps the orphan order.'] },
      { q: 'What is the difference between WHERE and HAVING?', options: ['They are interchangeable; HAVING is simply the older syntax', 'HAVING filters rows before grouping happens, and WHERE filters the finished groups afterwards', 'WHERE filters rows before grouping; HAVING filters groups after aggregates are calculated', 'HAVING can only be used in queries that also contain a JOIN'], correct: 2,
        why: ['They run at different stages and are not interchangeable.', 'This has the order reversed.', 'Correct — that is why aggregate conditions such as SUM(total) > 1000 belong in HAVING.', 'HAVING works with or without joins; it needs grouping, not a join.'] },
      { q: 'A ratings column holds 5, 3 and NULL for one product. What does AVG(stars) return?', options: ['2.67, because NULL counts as zero', '4, because AVG ignores the NULL', 'NULL, because any NULL makes the result NULL', '0, because the column contains a NULL value'], correct: 1,
        why: ['Aggregates do not treat NULL as zero; that would be (5+3+0)/3.', 'Right — (5+3)/2 = 4. Decide whether that matches the business rule for unrated items.', 'That is how arithmetic like 5 + NULL behaves, not aggregates such as AVG.', 'NULLs are skipped; they do not zero out the result.'] },
      { q: 'You need to find orders whose customer_id has no matching customer. Which query does that?', options: ['<code>SELECT o.order_id FROM orders o INNER JOIN customers c ON c.customer_id = o.customer_id</code>', '<code>SELECT order_id FROM orders WHERE customer_id IS NULL</code>', '<code>SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL</code>', '<code>SELECT o.order_id FROM orders o LEFT JOIN customers c ON c.customer_id = o.customer_id WHERE c.customer_id IS NULL</code>'], correct: 3,
        why: ['An INNER JOIN removes exactly the orders you are looking for.', 'This finds orders with no customer value at all, not ones pointing to a missing customer.', 'This is the reverse question: customers who have no orders.', 'Correct — keep every order, then keep only those where no customer matched.'] },
      { q: 'A tester groups a LEFT JOIN of customers to orders and uses COUNT(*). Sara, who has never ordered, shows a count of 1. Why?', options: ['COUNT(*) counts the NULL-filled row the LEFT JOIN creates; COUNT(o.order_id) would return 0', 'Sara must have a hidden or soft-deleted order somewhere in the orders table that the screen does not show', 'GROUP BY duplicates every customer row once, so all counts are one higher than reality', 'All aggregate functions treat NULL as the value 1'], correct: 0,
        why: ['Correct — count a column from the right table to ignore the NULL-filled row.', 'The 1 comes from the join itself; there is no need to assume hidden data.', 'GROUP BY does not add rows; Ayesha’s count is still 2.', 'Aggregates skip NULLs; COUNT(*) is the one that counts rows regardless.'] }
    ],
    interview: [
      { q: 'Explain the difference between INNER JOIN and LEFT JOIN with a testing example.', a: 'An <b>INNER JOIN</b> returns only rows that match in both tables; a <b>LEFT JOIN</b> returns every row from the left table and fills the right side with NULLs when there is no match. For testing, the LEFT JOIN is powerful for finding gaps: <code>customers LEFT JOIN orders … WHERE o.order_id IS NULL</code> lists customers with no orders, and <code>orders LEFT JOIN customers … WHERE c.customer_id IS NULL</code> finds orphan orders after a migration. I also watch for INNER JOINs in reports, because they silently drop rows with broken links.' },
      { q: 'How would you find duplicate records in a table?', a: 'I decide what “duplicate” means for the business first — same email, same order reference, same person and date. Then I group by those columns and keep groups with more than one row: <code>GROUP BY LOWER(email) HAVING COUNT(*) &gt; 1</code>. I exclude NULLs, because GROUP BY puts them all in one group, and normalise case and spaces where the rule says they should not matter. If duplicates exist, I report the query and counts and check whether a missing UNIQUE constraint or a double-submit in the API caused them.' }
    ],
    takeaways: [
      'INNER JOIN keeps matches only; LEFT JOIN keeps every left row and fills gaps with NULL.',
      'WHERE filters rows before grouping; HAVING filters groups after aggregation.',
      'COUNT(*) counts rows; COUNT(column), SUM and AVG skip NULLs.',
      'LEFT JOIN … WHERE right_key IS NULL finds missing links and orphans.',
      'Watch for join fan-out before you trust a SUM.'
    ]
  },
  {
    id: 'sa-db-testing',
    n: 4,
    level: 'intermediate',
    title: 'Database testing: integrity and verifying persistence',
    summary: 'Prove that actions really persisted, probe constraints and transactions, check migrations, and manage test data safely in shared environments.',
    minutes: 25,
    objectives: [
      'Test NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY and CHECK constraints through the application',
      'Explain transactions and ACID, and design tests for failures half-way through',
      'Verify that an API or UI action persisted exactly the right data and side effects',
      'Plan migration checks and safe test-data setup and cleanup'
    ],
    body: [
      { t: 'p', html: 'The UI and the API show a <i>view</i> of the data; the database is the record of truth. Database testing asks three questions. Did the action store exactly what it should — and nothing more? Do the database rules protect integrity even when the application has a bug? Is the data still correct after migrations, failures and many users working at once? A <b>201 Created</b> or <b>200 OK</b> answers none of these on its own.' },
      { t: 'table', caption: 'Constraints: the database’s own safety net', head: ['Constraint', 'Guarantees', 'How a tester probes it'], rows: [
        ['<b>NOT NULL</b>', 'The column always has a value', 'Create a record without the field; expect a clean 400 or 422, not a 500'],
        ['<b>UNIQUE</b>', 'No two rows share the value', 'Register the same email twice — also with different letter case and in two parallel requests'],
        ['<b>PRIMARY KEY</b>', 'A unique, non-null identity for each row', 'Check ids are generated, never duplicated and never reused when records are created in parallel'],
        ['<b>FOREIGN KEY</b>', 'The value exists in the referenced table', 'Create an order for customer 999999; delete a customer who has orders (expect it blocked or handled by a defined rule)'],
        ['<b>CHECK</b>', 'A rule such as <code>total &gt;= 0</code> holds', 'Send a negative total or an unknown status straight to the API']
      ] },
      { t: 'code', lang: 'sql', title: 'Constraints in a table definition', code: `CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  customer_id INT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  total       DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
  CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED'))
);` },
      { t: 'callout', tone: 'warn', title: 'A rejected insert is good; a raw database error is a bug', html: 'When the database blocks a duplicate email, the constraint did its job. But if the user receives <b>500</b> with text such as <i>duplicate key value violates unique constraint</i>, the API is leaking internals and failing to handle a predictable case. Expect a documented response such as <b>409 Conflict</b> with a friendly message. Also ask which rules live only in application code — some teams skip database constraints, and older MySQL versions accepted <code>CHECK</code> clauses without enforcing them.' },
      { t: 'h', text: 'Transactions and ACID' },
      { t: 'p', html: 'A <b>transaction</b> groups several statements into one all-or-nothing unit. In a PayLite wallet transfer, the debit and the credit must both happen or neither may. <code>COMMIT</code> makes the changes permanent; <code>ROLLBACK</code> undoes everything since <code>BEGIN</code>. Testers check the edges: what happens when the second step fails, when two transfers run at the same moment, or when the service restarts straight after a confirmation. If the debit affects no rows because the balance is too low, the application must roll back rather than carry on.' },
      { t: 'code', lang: 'sql', title: 'PayLite: move 500 from wallet 1 to wallet 2', code: `BEGIN;

UPDATE wallets SET balance = balance - 500
WHERE wallet_id = 1 AND balance >= 500;

UPDATE wallets SET balance = balance + 500
WHERE wallet_id = 2;

COMMIT;   -- both changes become permanent together
-- If anything fails before COMMIT, ROLLBACK undoes both.

-- Tester's invariant: run before and after the transfer
SELECT SUM(balance) AS total_money FROM wallets;` },
      { t: 'cards', items: [
        { title: 'Atomicity', html: 'All statements succeed or none do. <b>Test:</b> force a failure half-way, such as stopping the credit step, and check nothing partial remains.' },
        { title: 'Consistency', html: 'Each transaction moves data from one valid state to another, and constraints hold. <b>Test:</b> total money across wallets is unchanged by a transfer.' },
        { title: 'Isolation', html: 'Concurrent transactions do not see each other’s unfinished work. <b>Test:</b> two users buy the last item at the same moment — only one succeeds.' },
        { title: 'Durability', html: 'Committed data survives crashes and restarts. <b>Test:</b> after a confirmed payment and a service restart, the record is still there.' }
      ] },
      { t: 'h', text: 'Verifying that an action persisted' },
      { t: 'flow', caption: 'Persistence check for any create or update', steps: ['Act via API or UI', 'Capture the new id', 'Read back with GET', 'Query DB read-only', 'Check side effects', 'Clean up test data'] },
      { t: 'list', items: [
        'Every field you sent is stored exactly — including trimming, letter case and special characters. A name such as “عائشہ” or “José” must not come back as “????”.',
        'Server-generated values are right: id, default status, timestamps (usually UTC) and created-by.',
        'Related rows exist: <code>order_items</code>, stock levels, payment records and audit log entries.',
        'Nothing extra: exactly one new order, no duplicate items, and no rows at all for a request that failed.',
        'Money keeps its precision: totals in <code>DECIMAL</code> rather than floating point, rounded as the rules say.'
      ] },
      { t: 'h', text: 'Migrations, test data and shared environments' },
      { t: 'table', head: ['Area', 'What good practice looks like'], rows: [
        ['<b>Data migration</b>', 'Compare row counts, sums, distinct counts and NULL counts between source and target; sample-compare records field by field; check new columns’ defaults, truncated text and character encoding; run the orphan query; rehearse the rollback'],
        ['<b>Test data setup</b>', 'Create your own data through the API or fixtures, with unique values such as <code>qa+1712345678@example.com</code>; use synthetic or masked data, never real customers'],
        ['<b>Cleanup</b>', 'Delete what you created through the API, or rely on a transaction rollback or a database reset in an isolated environment; tag test rows so leftovers are easy to find'],
        ['<b>Shared environments</b>', 'Read-only account, filtered <code>SELECT</code>s, no direct <code>UPDATE</code>/<code>DELETE</code> without agreement, and warn the team before bulk data changes']
      ] },
      { t: 'callout', tone: 'key', title: 'Production is off-limits by default', html: 'Never test on, change or even query production data without explicit permission and a clear reason. Production holds real people’s personal and financial data; one careless query can expose it or slow the live system. If you need realistic data, ask for a masked copy in a test environment.' }
    ],
    example: {
      title: 'Worked example: proving a ShopFlow order was saved correctly',
      blocks: [
        { t: 'p', html: '<code>POST /orders</code> for customer 1: two of product 77 at 1200.00 and one of product 80 at 350.00 (merchandise 2750.00, so shipping is free — well above ShopFlow’s 50.00 free-shipping threshold), plus coupon <b>SAVE10</b>: 10% off <b>merchandise only</b>, and shipping is never discounted. The API returns <b>201</b>, id <b>5013</b> and total <b>2475.00</b> (2750 − 275 + 0.00 shipping). Stock before the call: product 77 = 40, product 80 = 12.' },
        { t: 'code', lang: 'sql', title: 'Read-only verification queries', code: `SELECT order_id, customer_id, status, total, created_at
FROM orders
WHERE order_id = 5013;

SELECT product_id, quantity, unit_price
FROM order_items
WHERE order_id = 5013
ORDER BY product_id;

-- Stock should drop by the quantities ordered
SELECT product_id, stock
FROM products
WHERE product_id IN (77, 80);` },
        { t: 'table', head: ['Check', 'Expected', 'Found'], rows: [
          ['orders row', '1 row, PENDING, total 2475.00 (discount 275.00, shipping 0.00)', '1 row, PENDING, 2475.00 ✓'],
          ['order_items', '(77, 2, 1200.00) and (80, 1, 350.00)', 'Both rows present ✓'],
          ['Stock', '77: 40 → 38 · 80: 12 → 11', '77: 38 ✓ · 80: <b>12 ✗</b>']
        ] },
        { t: 'p', html: 'The response, the GET call and the order rows are all correct, yet stock for product 80 never decreased — a defect no status code could reveal. The bug report includes the request (token redacted), the response, the three queries and the before/after stock values. After reporting, cancel the test order through the API so the shared data stays clean.' }
      ]
    },
    explain: {
      'ur': 'Database testing کا مقصد یہ دیکھنا ہے کہ data صحیح محفوظ ہوا اور database کے اصول اسے خراب ہونے سے بچا رہے ہیں۔ API سے 201 Created آ جانا ثبوت نہیں؛ اصل ثبوت GET request یا read-only SELECT query ہے، جس میں آپ ہر field، status، وقت اور related rows (جیسے order_items اور stock) ملاتے ہیں۔ Constraints جیسے NOT NULL، UNIQUE، FOREIGN KEY اور CHECK غلط data کو روکتے ہیں۔ مثلاً ایک ہی email دو بار register ہو تو API کو صاف error (جیسے 409) دینا چاہیے، 500 نہیں۔ Transaction کا مطلب ہے سب کچھ یا کچھ نہیں: PayLite میں ایک wallet سے پیسے کٹیں اور دوسرے میں نہ پہنچیں تو دونوں تبدیلیاں واپس ہونی چاہییں۔ اور production data پر اجازت کے بغیر کبھی test نہ کریں۔',
      'ur-Latn': 'Database testing ka maqsad yeh dekhna hai ke data sahi save hua aur database ke rules usay kharab hone se bacha rahe hain. API se 201 Created aa jana saboot nahi; asal saboot GET request ya read-only SELECT query hai, jis mein aap har field, status, waqt aur related rows (jaise order_items aur stock) match karte hain. Constraints jaise NOT NULL, UNIQUE, FOREIGN KEY aur CHECK ghalat data ko rokte hain. Maslan ek hi email do baar register ho to API ko saaf error (jaise 409) dena chahiye, 500 nahi. Transaction ka matlab hai sab kuch ya kuch nahi: PayLite mein ek wallet se paise katein aur doosre mein na pohanchein to dono changes wapas honi chahiyein. Aur production data par ijazat ke baghair kabhi test na karein.',
      'hi': 'Database testing का मक़सद यह देखना है कि data सही save हुआ और database के नियम उसे ख़राब होने से बचा रहे हैं। API से 201 Created आ जाना सबूत नहीं है; असली सबूत GET request या read-only SELECT query है, जिसमें आप हर field, status, समय और related rows (जैसे order_items और stock) मिलाते हैं। NOT NULL, UNIQUE, FOREIGN KEY और CHECK जैसे constraints ग़लत data को रोकते हैं। जैसे, एक ही email दो बार register हो तो API को साफ़ error (जैसे 409) देना चाहिए, 500 नहीं। Transaction का मतलब है सब कुछ या कुछ नहीं: PayLite में एक wallet से पैसे कटें और दूसरे में न पहुँचें, तो दोनों बदलाव वापस होने चाहिए। और production data पर बिना अनुमति कभी test न करें।',
      'ar': 'الهدف من اختبار قاعدة البيانات هو التأكد من أن البيانات حُفظت بشكل صحيح، وأن قواعد قاعدة البيانات تحميها من التلف. وصول الرمز 201 Created من الـ API ليس دليلًا كافيًا؛ الدليل الحقيقي هو طلب GET أو استعلام SELECT للقراءة فقط، تقارن فيه كل حقل والحالة والوقت والصفوف المرتبطة مثل order_items والمخزون. القيود (constraints) مثل NOT NULL وUNIQUE وFOREIGN KEY وCHECK تمنع البيانات الخاطئة؛ فمثلًا إذا سُجّل البريد الإلكتروني نفسه مرتين يجب أن يعيد الـ API خطأً واضحًا مثل 409 وليس 500. والمعاملة (transaction) تعني كل شيء أو لا شيء: إذا خُصم المال من محفظة في PayLite ولم يصل إلى الأخرى، فيجب التراجع عن التغييرين معًا. ولا تختبر أبدًا على بيانات الإنتاج دون إذن صريح.',
      'es': 'Las pruebas de base de datos comprueban que los datos se guardaron correctamente y que las reglas de la base de datos los protegen. Recibir 201 Created de la API no es prueba suficiente; la prueba real es un GET o una consulta SELECT de solo lectura, donde comparas cada campo, el estado, la fecha y las filas relacionadas, como order_items y el stock. Las restricciones (constraints) NOT NULL, UNIQUE, FOREIGN KEY y CHECK bloquean datos incorrectos: si alguien registra el mismo email dos veces, la API debe responder con un error claro, como 409, y no con un 500. Una transacción es todo o nada: si en PayLite se descuenta dinero de una billetera y no llega a la otra, ambos cambios deben deshacerse. Y nunca pruebes con datos de producción sin permiso explícito.'
    },
    keyTerms: [
      { term: 'Constraint', def: 'A rule enforced by the database itself, such as NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY or CHECK.' },
      { term: 'Transaction', def: 'A group of statements that succeed or fail together, ended by COMMIT (keep) or ROLLBACK (undo).' },
      { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — the guarantees a reliable transaction provides.' },
      { term: 'Referential integrity', def: 'Every foreign key value points to a row that really exists, so there are no orphan records.' },
      { term: 'Data migration', def: 'Moving or transforming data between schemas or systems, verified by counts, sums, samples and integrity checks.' }
    ],
    practice: [
      { q: 'Design API-level tests for the rule “email must be unique”. How will you confirm the result in the database?', hint: 'Think about case, spaces and timing.', answer: 'Register an email, then: the same email again (expect the documented error, e.g. <b>409</b>, and a friendly message); the same email in different case (<code>Ali@</code> vs <code>ali@</code>) and with leading or trailing spaces, if the rule says those count as equal; and two identical requests sent in parallel. After each, run a read-only <code>SELECT COUNT(*) FROM customers WHERE LOWER(email) = LOWER(…)</code> — it must return <b>1</b>.' },
      { q: '<code>DELETE /customers/4</code> returns <b>204</b>. What do you check afterwards?', answer: '<code>GET /customers/4</code> returns <b>404</b>. In the database, the row is gone — or flagged with <code>deleted_at</code> if the design uses soft delete. Related data follows the agreed rule (deletion blocked, cascaded or anonymised), the orphan query finds nothing, an audit entry exists, and nothing belonging to other customers changed.' },
      { q: 'A migration splits <code>phone</code> into <code>country_code</code> and <code>number</code> for 120,000 customers. List the checks you would run.', answer: 'Row counts match source and target. Every row has both new values, or NULLs only where the source phone was empty. Sample-compare records field by field, including numbers with leading zeros (stored as text, not integers). Check for truncation and odd formats such as spaces or dashes, and confirm the old column is handled as planned. Finally, rehearse the rollback.' },
      { q: 'On a shared staging database, how would you set up and clean up data for an “order history” test without disturbing other testers?', answer: 'Create your own customer through the API with a unique email such as <code>qa+timestamp@example.com</code>, then create the orders you need through the API too. Verify with read-only queries filtered by your customer id. At the end, delete or cancel your data through the API (or rely on the agreed nightly reset), and never reuse or edit someone else’s records.' }
    ],
    quiz: [
      { q: 'Which constraint stops two customers from registering with the same email address?', options: ['NOT NULL', 'FOREIGN KEY', 'CHECK', 'UNIQUE'], correct: 3,
        why: ['NOT NULL only requires a value; two rows can hold the same value.', 'A foreign key links to another table; it does not prevent repeats.', 'CHECK validates each row against a rule; it cannot compare rows with each other.', 'Right — UNIQUE rejects a second row with the same value.'] },
      { q: 'POST /customers with an existing email returns 500 and the body says: duplicate key value violates unique constraint "customers_email_key". What is the best assessment?', options: ['No bug — the database correctly rejected the duplicate, so the behaviour is fine', 'The constraint worked, but the API should return a handled error such as 409 without database details — report it', 'The UNIQUE constraint is the problem and should be removed so the request succeeds', 'Retest with a different email; if that works, close the test as passed'], correct: 1,
        why: ['Data integrity held, but users get a server error and internal details leak.', 'Correct — a predictable case needs a documented status and a safe message.', 'The constraint protects the data; the bug is the unhandled error.', 'A different email avoids the scenario you were asked to test.'] },
      { q: 'During a PayLite transfer, the debit from wallet 1 succeeds, then the service crashes before the credit to wallet 2. If the transfer runs in a correct transaction, what should the tester find?', options: ['Wallet 1 debited and wallet 2 unchanged, waiting for a manual fix', 'Both wallets updated, because the debit had already started', 'Neither wallet changed, because the transaction was rolled back', 'Only wallet 2 credited, because credits are applied first'], correct: 2,
        why: ['That partial state is exactly what atomicity prevents.', 'The credit never ran, so both cannot be updated.', 'Right — without a COMMIT, the debit is undone (atomicity).', 'There is no rule that credits run first, and a partial state is still wrong.'] },
      { q: 'Which is the strongest evidence that “update phone number” really persisted?', options: ['A fresh GET by id, or a read-only SELECT, shows the new number and other fields unchanged', 'The 200 response body echoes the new phone number back, exactly as it was typed into the form', 'A green “Profile updated” message appears on the screen after saving', 'The PATCH request finished in under 500 milliseconds'], correct: 0,
        why: ['Correct — an independent read after the write is real evidence.', 'The echo may just repeat the request body without anything being saved.', 'A message proves only that the UI was told the call succeeded.', 'Speed says nothing about whether data was stored.'] },
      { q: 'A migration moved 120,000 customer records to a new schema. Which check gives the fastest broad confidence that nothing was lost or altered?', options: ['Open five customers in the UI and compare them with your memory of the old screens', 'Confirm the migration script finished without errors and printed “Migration complete” in its log file', 'Compare row counts and aggregates such as sums and NULL counts between source and target, then sample records', 'Run the migration a second time to make sure it gives the same result'], correct: 2,
        why: ['Five records cannot reveal systematic loss or corruption.', 'Scripts can “succeed” while silently skipping or truncating rows.', 'Right — counts and aggregates catch bulk problems; samples catch field-level ones.', 'Re-running may duplicate data and proves nothing about correctness.'] }
    ],
    interview: [
      { q: 'How do you verify that data from an API call was saved correctly?', a: 'I never stop at the status code. After the call I capture the returned id, read the resource back with a <b>GET</b>, and then run a <b>read-only SELECT</b> on the main table and related tables. I compare every field I sent, the server-generated values such as status and timestamps, and side effects such as stock, payments or audit entries. I also check that nothing extra was created — one order, not two. Finally I clean up my test data, and I attach the queries and results to any bug report.' },
      { q: 'What is a transaction, and why should testers care about ACID?', a: 'A transaction is a set of database operations that must succeed or fail as one unit. ACID describes its guarantees: <b>atomicity</b> (all or nothing), <b>consistency</b> (rules still hold), <b>isolation</b> (concurrent work does not interfere) and <b>durability</b> (committed data survives crashes). Testers care because the worst data bugs appear at these edges: a payment debited but not credited, two buyers getting the last item, or a confirmed order lost after a restart. I design tests that fail a step half-way, run actions concurrently and restart services after a commit.' }
    ],
    takeaways: [
      'A 200 or 201 is a claim — prove persistence with a GET and a read-only query.',
      'Probe every constraint through the API and expect a clean error, never a raw 500.',
      'Transactions are all-or-nothing; test what happens when a step fails half-way.',
      'After migrations, compare counts, sums and samples — not just a few screens.',
      'Create and clean up your own test data, and never touch production without permission.'
    ],
    links: { labs: ['api'], interview: ['a1'] }
  },
  {
    id: 'sa-postman',
    n: 5,
    level: 'intermediate',
    title: 'API testing with Postman',
    summary: 'Turn manual API calls into repeatable Postman tests with environments, variables, scripts, chaining and Newman runs in CI.',
    minutes: 25,
    objectives: [
      'Organise requests into collections and folders, with environments and {{variables}}',
      'Write pre-request scripts and pm.test / pm.expect assertions that check more than the status code',
      'Chain requests by saving values such as ids and tokens',
      'Run collections with the Collection Runner and Newman without leaking secrets'
    ],
    body: [
      { t: 'p', html: '<b>Postman</b> is a widely used tool for sending HTTP requests and turning them into repeatable API tests without building a full framework. You usually start by exploring an endpoint by hand — trying a valid body, then a broken one — and then save what you learned as requests with <b>assertions</b>. Run on every build, those requests become regression checks that catch a changed field or a wrong status code within minutes.' },
      { t: 'cards', items: [
        { title: 'Collection', html: 'A saved, shareable group of requests such as “ShopFlow API”. It can hold its own variables, auth settings and scripts.' },
        { title: 'Folder', html: 'Groups related requests inside a collection — Auth, Orders, Payments. A folder script runs for every request inside it.' },
        { title: 'Environment', html: 'A named set of variables — Dev, Staging — so the same requests run anywhere by switching one dropdown.' },
        { title: 'Variables', html: '<code>{{baseUrl}}</code>, <code>{{accessToken}}</code> and <code>{{orderId}}</code> replace hard-coded values in URLs, headers and bodies.' },
        { title: 'Scripts', html: 'JavaScript that runs before a request (pre-request) or after the response (post-response tests), using the <code>pm</code> object.' },
        { title: 'Runner and Newman', html: 'The Collection Runner runs a whole collection inside Postman, optionally with a CSV or JSON data file. Newman runs it from the command line, for CI.' }
      ] },
      { t: 'h', text: 'Environments and variables' },
      { t: 'p', html: 'Write <code>{{baseUrl}}/orders</code> instead of a full URL, and define <code>baseUrl</code> once per environment. Switching from Dev to Staging then changes every request at once, and nobody edits forty URLs by hand. Variables live in different <b>scopes</b>. When the same name exists in several, the narrowest scope wins, so a value set in a script for one run overrides the environment value.' },
      { t: 'table', caption: 'Variable scopes, from broadest to narrowest (narrowest wins)', head: ['Scope', 'Visible in', 'Typical use'], rows: [
        ['<b>Global</b>', 'The whole workspace', 'Rarely needed; values leak easily between projects'],
        ['<b>Collection</b>', 'One collection, in every environment', 'Values that never change between environments, such as an API version'],
        ['<b>Environment</b>', 'Whichever environment is selected', '<code>baseUrl</code>, test user names, tokens marked as secret'],
        ['<b>Data</b>', 'One iteration of a Runner or Newman data file', 'A different email or amount for each CSV row'],
        ['<b>Local</b>', 'A single request run, set from a script', 'Temporary values you do not want saved']
      ] },
      { t: 'callout', tone: 'warn', title: 'Never commit or share secrets', html: 'Tokens, passwords and API keys must not sit in shared collections, exported environment files or Git — repository history keeps them even after you delete them. Keep real values in the local-only value that Postman does not sync to your team (or in a vault), mark them as secret, and inject them in CI from the pipeline’s secret store. Redact tokens from screenshots and bug reports, and rotate any token that leaks.' },
      { t: 'h', text: 'Scripts: pre-request and post-response tests' },
      { t: 'p', html: 'A <b>pre-request script</b> runs before the request is sent — ideal for generating unique data or timestamps. A <b>post-response script</b> (called the <i>Tests</i> tab in older Postman versions) runs after the response arrives. Inside it, <code>pm.test(name, fn)</code> defines a named check and <code>pm.expect</code> makes Chai-style assertions. A failed assertion marks that test as failed; the request itself has still been sent, so a failing test never “undoes” anything on the server.' },
      { t: 'code', lang: 'js', title: 'Pre-request script: unique data for every run', code: `// Pre-request script on "Register customer".
// A unique email lets the test run again without a 409 Conflict.
const stamp = Date.now();
pm.collectionVariables.set('uniqueEmail', 'qa+' + stamp + '@example.com');

// The raw JSON body then uses the variable:
// { "name": "QA Tester", "email": "{{uniqueEmail}}" }` },
      { t: 'code', lang: 'js', title: 'Post-response tests for POST {{baseUrl}}/orders', code: `pm.test('Status is 201 Created', function () {
  pm.response.to.have.status(201);
});

const body = pm.response.json();

pm.test('Order has an id, PENDING status and one item', function () {
  pm.expect(body.id).to.be.a('number');
  pm.expect(body.status).to.eql('PENDING');
  pm.expect(body.items).to.have.lengthOf(1);
});

pm.test('Total equals quantity x unit price', function () {
  const item = body.items[0];
  // closeTo avoids floating-point surprises such as 59.970000000000006
  pm.expect(body.total).to.be.closeTo(item.quantity * item.unitPrice, 0.001);
});

pm.test('Response is JSON and reasonably fast', function () {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
  pm.expect(pm.response.responseTime).to.be.below(1000);
});

// Chain: save the id for the next requests in the folder
pm.environment.set('orderId', body.id);` },
      { t: 'h', text: 'Chaining requests and running in CI' },
      { t: 'flow', caption: 'Each step saves what the next one needs', steps: ['Log in, save accessToken', 'Create order, save orderId', 'GET {{orderId}}', 'Cancel the order', 'GET again, expect CANCELLED'] },
      { t: 'code', lang: 'bash', title: 'Running the collection with Newman', code: `# Install once (needs Node.js)
npm install -g newman

# Run against staging; the token comes from the CI secret store
newman run ShopFlow.postman_collection.json \\
  -e staging.postman_environment.json \\
  --env-var "accessToken=$SHOPFLOW_TOKEN" \\
  --reporters cli,junit \\
  --reporter-junit-export results/newman.xml

# Newman exits with a non-zero code when any test fails,
# so the CI job fails too.` },
      { t: 'callout', tone: 'tip', title: 'Habits of strong Postman suites', html: 'Assert the status <b>and</b> the important fields, types and headers. Give every test a name that says what it proves. Let each run create its own data instead of depending on records someone made by hand. Keep response-time limits generous, because shared test servers vary. Never wrap assertions in <code>if</code> statements that can silently skip them — a skipped check looks exactly like a pass.' }
    ],
    example: {
      title: 'Worked example: a chained ShopFlow order lifecycle',
      blocks: [
        { t: 'p', html: 'The folder <b>Order lifecycle</b> holds five requests. The collection’s auth setting sends <code>Authorization: Bearer {{accessToken}}</code> on every request, so the token is set once, by the login test. Each request’s post-response script asserts its own outcome and saves whatever the next request needs.' },
        { t: 'code', lang: 'js', code: `// 1. Login: post-response script
pm.test('Login returns 200 and a token', function () {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().accessToken).to.be.a('string').and.not.empty;
});
pm.environment.set('accessToken', pm.response.json().accessToken);

// 3. Get order: URL is {{baseUrl}}/orders/{{orderId}}
pm.test('Stored order matches what was created', function () {
  pm.response.to.have.status(200);
  const order = pm.response.json();
  pm.expect(order.id).to.eql(Number(pm.environment.get('orderId')));
  pm.expect(order.status).to.eql('PENDING');
});` },
        { t: 'table', head: ['Request', 'Key assertions'], rows: [
          ['1 · Login', '200; token is a non-empty string; saved to <code>accessToken</code>'],
          ['2 · Create order', '201; numeric id; PENDING; total = quantity × unit price; id saved to <code>orderId</code>'],
          ['3 · Get order', '200; same id and values — the API reads back what it stored'],
          ['4 · Cancel order', '200 or 204, whichever the contract documents'],
          ['5 · Get order again', 'Status is CANCELLED; a second cancel is rejected as the contract says']
        ] },
        { t: 'p', html: 'Add a negative twin for each step — for example <b>Create order</b> with the token removed must return <b>401</b> — and run the folder with Newman on every build. A read-back through the API is good evidence; pair it with a read-only database query when the data rules are critical.' }
      ]
    },
    explain: {
      'ur': 'Postman ایک tool ہے جس سے ہم API کو request بھیجتے ہیں اور پھر انہیں دوبارہ چلنے والے tests میں بدل دیتے ہیں۔ Requests کو collection اور folders میں رکھا جاتا ہے۔ Environment میں variables ہوتے ہیں، جیسے {{baseUrl}}، تاکہ ایک ہی collection کبھی Dev اور کبھی Staging پر چل سکے۔ Post-response script میں pm.test اور pm.expect سے assertion لکھتے ہیں، مثلاً pm.response.to.have.status(201)۔ صرف status کافی نہیں، اہم fields اور ان کی type بھی check کریں۔ Order بنانے کے بعد pm.environment.set سے اس کی id محفوظ کریں اور اگلی request میں {{orderId}} استعمال کریں — اسے chaining کہتے ہیں۔ Newman سے یہی collection CI میں ہر build پر چلتی ہے۔ اور اصل token یا password کبھی shared collection یا Git میں نہ رکھیں۔',
      'ur-Latn': 'Postman ek tool hai jis se hum API ko requests bhejte hain aur phir unhein dobara chalne wale tests mein badal dete hain. Requests ko collection aur folders mein rakha jata hai. Environment mein variables hote hain, jaise {{baseUrl}}, taake ek hi collection kabhi Dev aur kabhi Staging par chal sake. Post-response script mein pm.test aur pm.expect se assertions likhte hain, maslan pm.response.to.have.status(201). Sirf status kaafi nahi — ahem fields aur unki type bhi check karein. Order banane ke baad pm.environment.set se uski id save karein aur agli request mein {{orderId}} use karein; isay chaining kehte hain. Newman se yehi collection CI mein har build par chalti hai. Aur asal token ya password kabhi shared collection ya Git mein na rakhein.',
      'hi': 'Postman एक tool है जिससे हम API को requests भेजते हैं और फिर उन्हें बार-बार चलने वाले tests में बदल देते हैं। Requests को collection और folders में रखा जाता है। Environment में variables होते हैं, जैसे {{baseUrl}}, ताकि एक ही collection कभी Dev और कभी Staging पर चल सके। Post-response script में pm.test और pm.expect से assertions लिखते हैं, जैसे pm.response.to.have.status(201)। सिर्फ़ status काफ़ी नहीं — ज़रूरी fields और उनका type भी check करें। Order बनाने के बाद pm.environment.set से उसकी id save करें और अगली request में {{orderId}} इस्तेमाल करें; इसे chaining कहते हैं। Newman से यही collection CI में हर build पर चलती है। और असली token या password कभी shared collection या Git में न रखें।',
      'ar': 'Postman أداة نرسل بها الطلبات إلى الـ API ثم نحوّلها إلى اختبارات يمكن تكرارها. تُنظَّم الطلبات في مجموعة (collection) ومجلدات. وتحتوي البيئة (environment) على متغيرات مثل {{baseUrl}}، حتى تعمل المجموعة نفسها على بيئة Dev مرة وعلى Staging مرة أخرى. في سكربت ما بعد الاستجابة نكتب التحققات باستخدام pm.test وpm.expect، مثل pm.response.to.have.status(201). رمز الحالة وحده لا يكفي؛ تحقّق أيضًا من الحقول المهمة وأنواعها. بعد إنشاء طلب احفظ رقمه باستخدام pm.environment.set واستعمل {{orderId}} في الطلب التالي، وهذا ما يسمى chaining. وتشغّل أداة Newman المجموعة نفسها في CI مع كل build. ولا تضع أبدًا رمز دخول أو كلمة مرور حقيقية في مجموعة مشتركة أو في Git.',
      'es': 'Postman es una herramienta para enviar peticiones a una API y convertirlas en pruebas repetibles. Las peticiones se organizan en una colección (collection) y en carpetas. El entorno (environment) guarda variables como {{baseUrl}}, para que la misma colección funcione en Dev o en Staging. En el script post-response escribimos aserciones con pm.test y pm.expect, por ejemplo pm.response.to.have.status(201). El código de estado no basta: comprueba también los campos importantes y sus tipos. Después de crear un pedido, guarda su id con pm.environment.set y usa {{orderId}} en la siguiente petición; eso es encadenar (chaining). Con Newman, la misma colección se ejecuta en CI en cada build. Y nunca guardes un token o una contraseña real en una colección compartida ni en Git.'
    },
    keyTerms: [
      { term: 'Collection', def: 'A saved group of Postman requests, with its own variables, auth and scripts, that can be shared and run as a suite.' },
      { term: 'Environment', def: 'A named set of variables, such as baseUrl and tokens, that lets one collection run against Dev, Staging and other targets.' },
      { term: 'Variable scope', def: 'Where a variable lives: global, collection, environment, data or local. The narrowest scope wins when names clash.' },
      { term: 'Pre-request script', def: 'JavaScript that runs before a request is sent, often to create unique data or timestamps.' },
      { term: 'pm.test / pm.expect', def: 'Postman functions for defining a named test and making assertions on the response inside it.' },
      { term: 'Newman', def: 'The command-line runner for Postman collections, used to run API tests in CI pipelines.' }
    ],
    practice: [
      { q: 'Write a post-response test that checks for status 200, a JSON content type and a non-empty <code>items</code> array.', hint: 'One pm.test per idea keeps failures easy to read.', answer: "<code>pm.test('Status is 200', function () { pm.response.to.have.status(200); });</code><br><code>pm.test('Body is JSON', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });</code><br><code>pm.test('Items is a non-empty array', function () { const items = pm.response.json().items; pm.expect(items).to.be.an('array').that.is.not.empty; });</code>" },
      { q: 'Your “Register customer” request passes once, then fails with <b>409 Conflict</b> on every later run. Why, and how do you fix it in Postman?', answer: 'The email in the body is fixed, so the second run tries to register an existing email. Generate a unique value in a <b>pre-request script</b> — e.g. <code>pm.collectionVariables.set(\'uniqueEmail\', \'qa+\' + Date.now() + \'@example.com\')</code> — and use <code>{{uniqueEmail}}</code> in the body (Postman’s built-in <code>{{$randomEmail}}</code> also works). Keep a <b>separate</b> test that deliberately reuses an email and expects 409.' },
      { q: "Review this test: <code>pm.test('works', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 400, 500]); });</code> What is wrong with it?", answer: 'It accepts client and server errors as a pass, so it can never fail for the cases that matter. The name “works” says nothing about what is proven, and nothing checks the body. Assert the single expected code (e.g. <code>pm.response.to.have.status(201)</code>), give the test a specific name, and add assertions on key fields and types.' },
      { q: 'Your team wants the collection to run against staging on every pull request. What do you need, and where does the access token come from?', answer: 'Export the collection and a staging environment file <b>without</b> real secrets, commit them, and add a CI step that runs <code>newman run collection.json -e staging.postman_environment.json --env-var "accessToken=$TOKEN"</code> with JUnit output. The token comes from the CI system’s secret store, never from the repository. Newman’s non-zero exit code on failures makes the pipeline fail.' }
    ],
    quiz: [
      { q: 'Why write {{baseUrl}}/orders instead of the full URL in every request?', options: ['Variables make Postman send the requests noticeably faster', 'The same collection can run against Dev or Staging by switching the environment', 'Postman encrypts any URL that is stored in a variable', 'Newman refuses to run any request that contains a full, hard-coded URL instead of a variable'], correct: 1,
        why: ['Variables do not change request speed.', 'Right — one definition per environment, no hand-editing of many URLs.', 'Variables are not an encryption feature.', 'Newman runs full URLs fine; variables are about reuse.'] },
      { q: 'Which line correctly asserts a 201 status in a Postman post-response script?', options: ['<code>pm.response.to.have.status(201);</code>', '<code>pm.expect(response).status == 201;</code>', '<code>pm.test.status(201);</code>', '<code>pm.response.code.should.equal(201);</code>'], correct: 0,
        why: ['Correct — this is Postman’s built-in status assertion; wrap it in pm.test to name it.', 'This is not valid pm syntax and a bare comparison would not fail the test.', 'pm.test defines a test; it has no status method.', 'Postman scripts use pm.expect or pm.response.to; this “should” form is not available on response.code.'] },
      { q: 'Request 2 needs the order id returned by Request 1. What is the best approach?', options: ['Copy the id from Request 1’s response into Request 2 by hand before every run', 'Hard-code id 5012 in Request 2’s URL, because that order already exists in the staging database', 'Move Request 2 into a separate collection so that it can run on its own', 'Save the id in Request 1’s script with pm.environment.set and use {{orderId}} in Request 2'], correct: 3,
        why: ['Manual copying breaks automation and is easy to get wrong.', 'Fixed ids break as soon as someone changes or deletes that order.', 'Separating the requests removes the dependency’s data instead of passing it.', 'Correct — chaining through a variable keeps every run self-contained.'] },
      { q: 'A teammate exports the staging environment with a real admin token in the shared value and commits it to Git. What is the main risk and the right fix?', options: ['No risk — the repository is private, so the token is safe there', 'The only risk is that the token expires and the CI run fails', 'Anyone with repository access, now or later, can use the token — rotate it and inject secrets at run time', 'Newman will refuse to run the collection, because tokens are not allowed inside exported environment files'], correct: 2,
        why: ['Private repositories are cloned, forked and shared; history keeps the secret forever.', 'Expiry is the least of the problems — the token works until then.', 'Right — treat it as leaked: revoke or rotate it, then keep secrets in local-only values or a vault and pass them in CI.', 'Newman does not inspect files for secrets; it would run happily with the leaked token.'] },
      { q: 'What does Newman add compared with clicking Run in the Postman app?', options: ['It records screenshots of every response for visual testing', 'It runs collections from the command line, so CI can run them on every build and fail on errors', 'It writes the test scripts automatically by reading the API documentation and the example responses', 'It replaces environments, so variables are no longer needed'], correct: 1,
        why: ['Newman reports test results; it does not take screenshots.', 'Correct — command-line runs, reporters such as JUnit and a failing exit code make it CI-friendly.', 'You still write the scripts; Newman only runs them.', 'Newman uses the same environments and variables, passed with -e or --env-var.'] }
    ],
    interview: [
      { q: 'How do you use environments and variables in Postman across test and staging?', a: 'I define a <code>baseUrl</code> per environment and write every request as <code>{{baseUrl}}/…</code>, so the collection is reusable. Values that differ per environment — test users, tokens — live in the environment, with secrets kept in local-only values or a vault and never committed. Ids created during a run are saved with <code>pm.environment.set</code> and reused through <code>{{orderId}}</code>. I make the selected environment obvious before a run, avoid relying on stale values from earlier runs, and in CI pass secrets with Newman’s <code>--env-var</code>.' },
      { q: 'What makes a good Postman test, beyond checking the status code?', a: 'It asserts what the contract promises: the exact status, required fields and their <b>types</b>, important values such as the status or a calculated total, and headers such as <code>Content-Type</code>. It checks what must <b>not</b> be there, such as password hashes. Each test has a name that says what it proves, runs on data it created itself, and never hides assertions inside conditions that might skip them. For critical flows I add negative twins — no token, wrong role, invalid body — and a read-back request to confirm persistence.' }
    ],
    takeaways: [
      'Use {{variables}} and environments — never hard-code URLs, ids or tokens.',
      'pm.test plus pm.expect: assert status, key fields, types and headers — not just the status.',
      'Chain requests with pm.environment.set and {{orderId}}, and let each run create its own data.',
      'Run collections with Newman in CI so a failing assertion fails the build.',
      'Secrets stay out of shared collections and Git — inject them at run time.'
    ],
    links: { labs: ['api'], challenges: ['api-contract'], interview: ['a2', 'a4'] }
  },
  {
    id: 'sa-auth',
    n: 6,
    level: 'intermediate',
    title: 'Authentication vs authorization: 401, 403, tokens and sessions',
    summary: 'Separate “who are you?” from “what may you do?”, test sessions, JWTs and roles, and catch the ownership bugs attackers love.',
    minutes: 26,
    objectives: [
      'Distinguish authentication from authorization and choose 401, 403 or 404 correctly',
      'Compare sessions with cookies and bearer tokens, and test expiry, logout and refresh',
      'Read a JWT and explain why its payload is encoded, not encrypted',
      'Design role-based and ownership (IDOR) tests for an API'
    ],
    body: [
      { t: 'p', html: 'Every protected request answers two separate questions. <b>Authentication</b>: who are you? <b>Authorization</b>: what are you allowed to do? Mixing them up leads to wrong bug reports and missed security holes. Many of the most serious API vulnerabilities are authorization failures — the system knows exactly who you are, and still lets you see or change things that are not yours.' },
      { t: 'compare', a: { title: 'Authentication (authN)', items: ['Proves identity: password, one-time code, token, session cookie', 'Happens first, at login and on every request that carries credentials', 'Failure: <b>401 Unauthorized</b> — missing, invalid, expired or tampered credentials', 'Fix: log in again or refresh the token'] }, b: { title: 'Authorization (authZ)', items: ['Decides permission: roles, ownership, scopes', 'Happens after identity is known, for each action and object', 'Failure: <b>403 Forbidden</b> — or <b>404</b> to hide that the resource exists', 'Logging in again will not help; the rules say no'] } },
      { t: 'table', caption: 'Expected outcomes for a ShopFlow API', head: ['Situation', 'Expected', 'Why'], rows: [
        ['No <code>Authorization</code> header', '<b>401</b>', 'The caller is anonymous'],
        ['Token expired five minutes ago', '<b>401</b>', 'Credentials are no longer valid'],
        ['Token payload edited to say <code>"role": "admin"</code>', '<b>401</b>', 'The signature no longer matches, so the token is invalid'],
        ['Valid customer token calls an admin endpoint', '<b>403</b>', 'Known user, insufficient role'],
        ['User A requests user B’s order', '<b>403</b> or <b>404</b>, per the contract', 'Ownership check fails; 404 hides the order’s existence'],
        ['User A requests their own order', '<b>200</b>', 'Authenticated and authorised']
      ] },
      { t: 'h', text: 'Sessions, cookies and bearer tokens' },
      { t: 'p', html: 'With a <b>server-side session</b>, the server stores the login state and the browser holds only a random session id in a cookie, sent automatically with each request. Good cookies are marked <code>HttpOnly</code> (scripts cannot read them), <code>Secure</code> (HTTPS only) and <code>SameSite</code> (limits cross-site sending). With <b>bearer tokens</b>, common in mobile apps and single-page apps, the client sends <code>Authorization: Bearer &lt;token&gt;</code> itself, and the server validates the token on every call.' },
      { t: 'list', items: [
        '<b>Logout</b> must end the session on the server: replay the old cookie or token afterwards and expect <b>401</b>, unless the contract documents that a short-lived token stays valid until expiry.',
        '<b>Expiry:</b> an idle session times out as specified, and an expired access token is rejected.',
        '<b>Refresh:</b> a refresh token gets a new access token; after logout or a password change the refresh token must stop working.',
        '<b>Leakage:</b> tokens never appear in URLs, logs, error messages or analytics calls.',
        '<b>Brute force:</b> repeated failed logins are slowed down or locked as the requirement says, without revealing whether the email exists.'
      ] },
      { t: 'code', lang: 'text', title: 'Anatomy of a JWT (JSON Web Token)', code: `A JWT is three Base64URL parts joined by dots: header.payload.signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                     <- header
.eyJzdWIiOiJ1c2VyXzEwNDIiLCJyb2xlIjoiY3VzdG9tZXIiLCJp... <- payload
.h3HhSXGtBACHhOlXA4sd3qwImsXjha1NYcOZD4M9o-0             <- signature

Header, decoded:  {"alg": "HS256", "typ": "JWT"}

Payload, decoded (anyone holding the token can read this):
{
  "sub": "user_1042",
  "role": "customer",
  "iat": 1793000000,
  "exp": 1793000900
}

exp - iat = 900 seconds: the token expires 15 minutes after it was issued.
The signature is computed from header + payload with the server's key.
Change one character of the payload and verification must fail.` },
      { t: 'callout', tone: 'warn', title: 'Encoded is not encrypted', html: 'Base64URL is an encoding, not encryption: anyone can decode a standard JWT’s payload and read it. Never put passwords, card numbers or other secrets in it. The signature protects <b>integrity</b> — but only if the server actually verifies it. Test that a token with an edited payload, a token signed with a different key, a token whose header says <code>"alg": "none"</code>, and a token past its <code>exp</code> are all rejected with <b>401</b>.' },
      { t: 'p', html: '<b>OAuth 2.0</b> is a framework for <i>delegated authorization</i>: a client app gets an access token from an authorization server to call an API on a user’s behalf, without ever seeing the user’s password. User-facing apps typically use the Authorization Code flow with PKCE; service-to-service calls use Client Credentials. Access tokens are short-lived, refresh tokens last longer, and <b>scopes</b> limit what a token may do. OAuth itself is not a login protocol — OpenID Connect adds that on top. Testers check that scopes are enforced, redirect URLs must match exactly, and expired or revoked tokens fail.' },
      { t: 'h', text: 'Authorization tests: roles and ownership' },
      { t: 'table', caption: 'Role matrix — test every cell, including the ✗ ones, with a real token for each role', head: ['Action', 'Customer', 'Support agent', 'Admin'], rows: [
        ['View an order they placed', '✓ 200', '✓ 200', '✓ 200'],
        ['View another customer’s order', '✗ 403 or 404', '✓ 200 (read-only)', '✓ 200'],
        ['Refund an order', '✗ 403', '✓ up to 5,000 · above that ✗ 403', '✓ 200'],
        ['Change product prices', '✗ 403', '✗ 403', '✓ 200']
      ] },
      { t: 'p', html: 'An <b>IDOR</b> (Insecure Direct Object Reference) — listed as <b>BOLA</b>, Broken Object Level Authorization, at the top of the OWASP API Security Top 10 — happens when the API checks that you are logged in but not that the object is yours. Log in as Ayesha and create order 5012, then call <code>GET /orders/5012</code> with Rahul’s token. Anything but a refusal is a serious bug. Repeat for PATCH and DELETE, ids in query strings and bodies (<code>?customerId=2</code>), list endpoints, and fields a user must never set, such as <code>"role": "admin"</code> in a profile update.' },
      { t: 'callout', tone: 'key', title: '401 vs 403 vs 404', html: '<b>401</b>: the server cannot identify you — credentials are missing, malformed, expired or tampered with. By the HTTP standard the response should include a <code>WWW-Authenticate</code> header. <b>403</b>: the server knows who you are and refuses. <b>404</b>: some APIs deliberately answer “not found” for other users’ resources, so an attacker cannot even learn that order 5012 exists. 403 and 404 are both acceptable for ownership failures; what matters is that the contract picks one, applies it consistently, and that no data leaks either way.' }
    ],
    example: {
      title: 'Worked example: an auth test matrix for GET /orders/{id}',
      blocks: [
        { t: 'p', html: 'ShopFlow’s contract says: customers may read only their own orders, and other customers’ orders return <b>404</b> to hide them; support agents may read any order. Ayesha owns order 5012. The tester prepares one valid token per role, plus an expired and a tampered token, and sends every request against the same order.' },
        { t: 'table', head: ['#', 'Request', 'Expected', 'Actual'], rows: [
          ['1', 'No <code>Authorization</code> header', '401', '401 ✓'],
          ['2', 'Ayesha’s token, expired', '401', '401 ✓'],
          ['3', 'Ayesha’s token with payload edited to <code>"role": "admin"</code>', '401', '401 ✓'],
          ['4', 'Ayesha’s valid token', '200 with order 5012', '200 ✓'],
          ['5', 'Rahul’s valid token', '404, no data', '<b>200 with Ayesha’s address and items ✗</b>'],
          ['6', 'Support agent’s valid token', '200', '200 ✓']
        ] },
        { t: 'p', html: 'Row 5 is a critical <b>IDOR</b>: authentication works, but the ownership check is missing, so any customer can read any order by changing the number in the URL. The bug report shows both users (tokens redacted), the exact request and the leaked fields, and recommends checking PATCH, DELETE and the order list endpoint for the same flaw.' }
      ]
    },
    explain: {
      'ur': 'Authentication کا سوال ہے: آپ کون ہیں؟ Authorization کا سوال ہے: آپ کو کیا کرنے کی اجازت ہے؟ اگر token موجود نہ ہو، غلط ہو یا expire ہو چکا ہو تو جواب 401 Unauthorized ہونا چاہیے۔ اگر پہچان ہو گئی مگر اجازت نہیں، جیسے customer کسی admin page کو کھولے، تو 403 Forbidden۔ کچھ APIs دوسروں کے data کو چھپانے کے لیے جان بوجھ کر 404 دیتی ہیں۔ JWT کا payload صرف encoded ہوتا ہے، encrypted نہیں، اس لیے کوئی بھی اسے پڑھ سکتا ہے اور اس میں راز نہیں رکھنے چاہییں۔ سب سے اہم test یہ ہے: Ayesha کا order، Rahul کے token سے کھولیں۔ اگر data مل جائے تو یہ سنگین IDOR bug ہے۔',
      'ur-Latn': 'Authentication ka sawal hai: aap kaun hain? Authorization ka sawal hai: aap ko kya karne ki ijazat hai? Agar token maujood na ho, ghalat ho ya expire ho chuka ho to jawab 401 Unauthorized hona chahiye. Agar pehchaan ho gayi magar ijazat nahi — jaise customer kisi admin page ko khole — to 403 Forbidden. Kuch APIs doosron ka data chhupane ke liye jaan boojh kar 404 deti hain. JWT ka payload sirf encoded hota hai, encrypted nahi, is liye koi bhi usay parh sakta hai aur us mein secrets nahi rakhne chahiyein. Sab se ahem test yeh hai: Ayesha ka order Rahul ke token se kholein. Agar data mil jaye to yeh serious IDOR bug hai.',
      'hi': 'Authentication का सवाल है: आप कौन हैं? Authorization का सवाल है: आपको क्या करने की अनुमति है? अगर token मौजूद न हो, ग़लत हो या expire हो चुका हो, तो जवाब 401 Unauthorized होना चाहिए। अगर पहचान हो गई पर अनुमति नहीं — जैसे customer किसी admin page को खोले — तो 403 Forbidden। कुछ APIs दूसरों का data छिपाने के लिए जान-बूझकर 404 देती हैं। JWT का payload सिर्फ़ encoded होता है, encrypted नहीं, इसलिए कोई भी उसे पढ़ सकता है और उसमें secrets नहीं रखने चाहिए। सबसे ज़रूरी test यह है: Ayesha का order Rahul के token से खोलें। अगर data मिल जाए, तो यह गंभीर IDOR bug है।',
      'ar': 'المصادقة (authentication) تجيب عن سؤال: من أنت؟ أما التفويض (authorization) فيجيب عن سؤال: ما المسموح لك أن تفعله؟ إذا كان رمز الدخول (token) مفقودًا أو غير صالح أو منتهي الصلاحية، فيجب أن يكون الرد 401 Unauthorized. وإذا عُرفت هويتك لكن ليست لديك صلاحية، كأن يفتح عميل صفحة خاصة بالمسؤول، فالرد 403 Forbidden. وبعض الواجهات تعيد 404 عمدًا لإخفاء بيانات المستخدمين الآخرين. حمولة JWT مُرمَّزة فقط وليست مشفّرة، لذا يستطيع أي شخص قراءتها، ولا يجوز وضع أسرار فيها. وأهم اختبار هو: افتح طلب عائشة باستخدام رمز راهول؛ فإذا ظهرت البيانات فهذا خلل IDOR خطير.',
      'es': 'La autenticación (authentication) responde a la pregunta: ¿quién eres? La autorización (authorization) responde a otra: ¿qué tienes permitido hacer? Si el token falta, no es válido o ha caducado, la respuesta debe ser 401 Unauthorized. Si el sistema sabe quién eres pero no tienes permiso —por ejemplo, un cliente que abre una página de administrador—, la respuesta es 403 Forbidden. Algunas APIs devuelven 404 a propósito para ocultar datos de otros usuarios. El payload de un JWT solo está codificado, no cifrado: cualquiera puede leerlo, así que no debe contener secretos. La prueba más importante: abre el pedido de Ayesha con el token de Rahul. Si ves sus datos, es un fallo IDOR grave.'
    },
    keyTerms: [
      { term: 'Authentication', def: 'Verifying who the caller is, for example with a password, token or session cookie. Failure means 401.' },
      { term: 'Authorization', def: 'Deciding what an identified caller may do or see, based on roles, ownership or scopes. Failure means 403, or 404 to hide.' },
      { term: 'Bearer token', def: 'A token sent as Authorization: Bearer followed by the token; whoever holds it can use it, so it must be protected.' },
      { term: 'JWT', def: 'JSON Web Token: header.payload.signature in Base64URL. The payload is readable; the signature detects tampering.' },
      { term: 'OAuth 2.0', def: 'A framework for delegated authorization that issues scoped access tokens to client apps without sharing the user’s password.' },
      { term: 'IDOR / BOLA', def: 'An authorization flaw where changing an object id in a request gives access to another user’s data.' }
    ],
    practice: [
      { q: 'Give the expected status code for each: (a) wrong password at login; (b) expired access token; (c) a customer opens the admin user list; (d) user A edits user B’s address; (e) a token whose payload was edited.', hint: 'Ask: does the server know who you are?', answer: '(a) <b>401</b> — authentication failed (some login endpoints use 400, but the message must not reveal whether the email exists). (b) <b>401</b>. (c) <b>403</b> — known user, wrong role. (d) <b>403</b> or <b>404</b>, whichever the contract specifies — and the address must not change. (e) <b>401</b> — the signature check fails, so the token is invalid.' },
      { q: 'You decode a JWT from the PeopleOps HR portal and see <code>"email"</code>, <code>"role": "employee"</code> and <code>"passwordHash"</code> in the payload. What do you report and test?', answer: 'Report a <b>security defect</b>: the payload is readable by anyone holding the token, so a password hash must never be inside it. Then test that editing the role to <code>"admin"</code> gives <b>401</b> (the signature must be verified), that <code>"alg": "none"</code> is rejected, and that an expired token fails.' },
      { q: 'Design IDOR tests for <code>PATCH /addresses/{id}</code>.', answer: 'Create address 77 as user A. As user B: PATCH /addresses/77 (expect 403 or 404, and confirm with A’s token or a read-only query that nothing changed); DELETE /addresses/77; GET /addresses/77. Also try ids in the body (<code>"userId": "A"</code>), sequential and guessed ids, and the list endpoint with filters. Repeat for each role in the matrix.' },
      { q: 'A request that worked yesterday now returns <b>401</b> in Postman. How do you investigate without leaking the token?', answer: 'Check the selected environment and <code>baseUrl</code> first. Then confirm the <code>Authorization</code> header is present, well-formed (<code>Bearer</code> plus a space) and holds a token issued for <b>this</b> environment. Decode the payload locally to check <code>exp</code>, and refresh or log in again if it has expired. Compare with a working request. If the server now knows you but refuses, that would be 403 — a permission change, not a credential issue. Share redacted requests only.' }
    ],
    quiz: [
      { q: 'Which statement correctly describes authentication and authorization?', options: ['Authentication decides what you may do; authorization proves who you are', 'They are two names for the same check, used interchangeably', 'Authentication verifies identity; authorization decides what that identity may access', 'Authorization always happens first, and authentication only runs if the permission check passes'], correct: 2,
        why: ['This reverses the two terms.', 'They are different checks with different failure codes (401 vs 403).', 'Correct — identity first, then permissions for each action and object.', 'Permissions cannot be decided before the system knows who is asking.'] },
      { q: 'A mobile app’s access token expired ten minutes ago. It calls GET /profile with that token. What should the API return?', options: ['403 Forbidden', '422 Unprocessable Content', '404 Not Found', '401 Unauthorized'], correct: 3,
        why: ['403 means “known but not allowed”; an expired token means the caller is not authenticated.', 'Nothing is wrong with the request content; the credentials are the problem.', 'The profile exists; hiding it is not the reason for the failure.', 'Right — expired credentials are an authentication failure. The app should refresh the token.'] },
      { q: 'What is true about the payload of a standard signed JWT?', options: ['It is Base64URL-encoded, so anyone with the token can read it; the signature only detects changes', 'It is encrypted with the server’s secret key, so it is a safe place to keep passwords and card numbers', 'It is hashed, so nobody can turn it back into readable JSON', 'Only the server can see it, because browsers hide token contents'], correct: 0,
        why: ['Correct — encoding is reversible by anyone; never store secrets in the payload.', 'Standard signed JWTs are not encrypted; encrypted tokens (JWE) are a different format.', 'Base64URL is an encoding, not a hash; it decodes instantly.', 'The client holds the token and can decode it freely.'] },
      { q: 'Logged in as Rahul, a tester calls GET /orders/5012 — Ayesha’s order — and receives 200 with her address. How should this be classified?', options: ['Expected behaviour, because any logged-in user may read orders', 'A critical authorization flaw (IDOR/BOLA): ownership is not checked', 'An authentication bug, because the API should have returned 401 Unauthorized for Rahul', 'A caching glitch that will disappear after the next deployment'], correct: 1,
        why: ['Customers must only see their own orders; this leaks personal data.', 'Correct — Rahul is authenticated, but the API never checks the order belongs to him.', 'Rahul’s token is valid, so 401 would be wrong; the failure is authorization.', 'Without evidence of caching, assuming it will disappear hides a serious defect.'] },
      { q: 'Which test best shows that logout really ends a session on the server?', options: ['Save the session cookie, log out, then replay a request with that cookie and expect 401', 'Check that the logout button sends the user back to the login page', 'Confirm the browser no longer shows the cookie in DevTools after the logout redirect completes', 'Log in again straight away and check that the login still works'], correct: 0,
        why: ['Correct — if the old cookie still works, the session was never invalidated on the server.', 'A redirect is UI behaviour; the server session may still be alive.', 'Clearing the browser copy does not stop an attacker who already copied the cookie.', 'This tests login, not whether the old session ended.'] }
    ],
    interview: [
      { q: 'An API request returns 401 in Postman. How would you investigate it?', a: 'I check the basics first: the selected environment and <code>baseUrl</code>. Then I inspect the <code>Authorization</code> header — present, correctly formatted, and holding a token issued for this environment. I decode the token locally to check <code>exp</code> and refresh it if needed, and compare the request with a known working one without sharing the secret. I keep the distinction clear: <b>401</b> is a credential problem, while <b>403</b> means the server knows me but refuses, which points to roles or permissions. I share only redacted requests and responses with the team.' },
      { q: 'How do you test authorization in an API?', a: 'I build a <b>role matrix</b> — actions against roles — and test every cell with a real token for each role, especially the “not allowed” ones, expecting <b>403</b> (or 404 where the contract hides resources). Then I test <b>ownership</b>: create data as user A and try to read, update and delete it as user B, including ids in query strings, bodies and list filters. I check that users cannot raise their own privileges, for example by sending <code>"role": "admin"</code> in a profile update. After every refusal I confirm through a read-only query that nothing changed.' }
    ],
    takeaways: [
      'Authentication = who you are (401 when it fails); authorization = what you may do (403, or 404 to hide).',
      'A JWT payload is encoded, not encrypted — anyone can read it, nobody should be able to change it.',
      'Test expiry, tampering, logout and refresh, not just a valid login.',
      'Swap tokens between users to catch IDOR on GET, PATCH, DELETE and list endpoints.',
      'Test every cell of the role matrix, especially the “not allowed” ones.'
    ],
    links: { labs: ['api', 'login'], challenges: ['peopleops-login'], interview: ['a3'] }
  },
  {
    id: 'sa-api-negative',
    n: 7,
    level: 'advanced',
    title: 'Negative, contract and schema testing',
    summary: 'Prove an API fails safely: invalid input, consistent errors, JSON Schema checks, consumer contracts, idempotent retries, paging and rate limits.',
    minutes: 28,
    objectives: [
      'Design negative tests for missing fields, wrong types, boundaries and malformed requests',
      'Check that error responses are consistent, accurate and leak nothing',
      'Validate responses with JSON Schema and explain consumer-driven contract testing',
      'Test idempotency and retries, pagination, sorting, filtering and rate limiting'
    ],
    body: [
      { t: 'p', html: 'Happy-path tests prove an API <i>can</i> work. Negative tests prove it <b>fails safely and predictably</b> — and most production incidents start with input nobody planned for: a missing field, a string where a number belongs, a retry after a timeout, a client paging past the end. Advanced API testing adds two more layers on top: <b>schema validation</b> (is every response the right shape?) and <b>contract testing</b> (do the consumer and the provider still agree?).' },
      { t: 'h', text: 'Negative inputs, systematically' },
      { t: 'table', caption: 'Negative test ideas for POST /orders', head: ['Category', 'Examples', 'Expected'], rows: [
        ['<b>Missing or empty</b>', 'No <code>items</code>; <code>"items": []</code>; an empty body <code>{}</code>', '400 or 422 naming the field; nothing saved'],
        ['<b>Wrong type</b>', '<code>"quantity": "two"</code>; <code>"productId": true</code>; <code>items</code> sent as an object', '400 with a field-level message, never a 500'],
        ['<b>Boundaries</b>', 'Quantity 0, 1, 99, 100 when the maximum is 99; a 10,000-character note; a very large body', 'Valid values accepted, invalid rejected; an oversized body may get <b>413 Content Too Large</b>'],
        ['<b>Format</b>', 'Malformed JSON; <code>Content-Type: text/plain</code>', '400; <b>415 Unsupported Media Type</b>'],
        ['<b>Extra fields</b>', '<code>"status": "PAID"</code> or <code>"discount": 100</code> added by the client', 'Ignored or rejected — never applied'],
        ['<b>Special characters</b>', "<code>' OR 1=1 --</code>, <code>&lt;script&gt;</code>, Urdu or Arabic text, emoji", 'Stored and returned as plain text; no 500, nothing executed']
      ] },
      { t: 'callout', tone: 'key', title: 'Error responses deserve tests too', html: 'Check the <b>status</b> is the documented one, the body uses the <b>same error format</b> on every endpoint, each invalid field is named with a useful message, and nothing internal leaks — no stack traces, SQL or server paths. Confirm that a rejected request <b>saved nothing</b>. Many teams use the standard <i>Problem Details</i> format (RFC 9457, media type <code>application/problem+json</code>); whatever the format, consistency lets clients handle errors with one piece of code.' },
      { t: 'code', lang: 'json', title: 'A Problem Details-style validation error', code: `{
  "type": "about:blank",
  "title": "Validation failed",
  "status": 422,
  "detail": "2 fields are invalid.",
  "errors": [
    { "field": "items[0].quantity", "message": "must be between 1 and 99" },
    { "field": "deliveryDate", "message": "must not be in the past" }
  ],
  "traceId": "6f1c2a9e"
}` },
      { t: 'h', text: 'Schema validation' },
      { t: 'p', html: 'A <b>JSON Schema</b> describes the shape of a JSON document: types, required fields, allowed values, ranges and formats. Validating every response against it catches renamed or missing fields, values that changed type, unexpected <code>null</code>s and leaked extra fields such as an internal note — problems a status check cannot see. In Postman, <code>pm.response.to.have.jsonSchema(schema)</code> runs the check; code frameworks use libraries such as Ajv. One subtlety: many validators treat <code>format</code> (such as <code>date-time</code>) as a hint unless format checking is switched on.' },
      { t: 'code', lang: 'json', title: 'JSON Schema for an order response', code: `{
  "type": "object",
  "required": ["id", "status", "total", "items", "createdAt"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "integer", "minimum": 1 },
    "customerId": { "type": "integer" },
    "status": { "enum": ["PENDING", "PAID", "SHIPPED", "CANCELLED"] },
    "total": { "type": "number", "minimum": 0 },
    "createdAt": { "type": "string", "format": "date-time" },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["productId", "quantity", "unitPrice"],
        "properties": {
          "productId": { "type": "integer" },
          "quantity": { "type": "integer", "minimum": 1, "maximum": 99 },
          "unitPrice": { "type": "number", "minimum": 0 }
        }
      }
    }
  }
}` },
      { t: 'h', text: 'Contract testing' },
      { t: 'compare', a: { title: 'Schema validation', items: ['Checks one response against a description of its shape and types', 'Usually written from the provider’s API specification', 'Catches type changes, missing required fields and leaked extras', 'Cannot tell which fields a particular client actually relies on'] }, b: { title: 'Consumer-driven contract testing', items: ['Each consumer records the requests it sends and the response fields it needs', 'The provider verifies those expectations against its real code in its own pipeline', 'Catches a breaking change before either side deploys', 'Tools such as Pact automate the contract file, the verification and sharing'] } },
      { t: 'p', html: 'In <b>consumer-driven contract testing</b>, the ShopFlow mobile app (the consumer) runs its tests against a mock of the Orders service, and those tests produce a <b>contract</b>: “GET /orders/5012 with a valid token returns 200 with <code>id</code>, <code>status</code> and a numeric <code>total</code>.” The Orders service (the provider) replays every contract against its real code on each build. If a developer renames <code>total</code> to <code>amount</code>, the provider build fails before release, with no shared end-to-end environment needed. Contracts check the agreement, not the business logic, so they complement functional tests rather than replace them.' },
      { t: 'h', text: 'Idempotency, retries, paging and rate limits' },
      { t: 'cards', items: [
        { title: 'Idempotency and retries', html: 'A client times out after <code>POST /payments</code> and retries — did the customer pay twice? Many APIs accept an <code>Idempotency-Key</code> header: the same key with the same body returns the original result with no second charge, and the same key with a different body is rejected (often 409 or 422, per the contract). Simulate a timeout, retry, then count payments in the database.' },
        { title: 'Pagination', html: 'Check the default page size, first and last pages, an empty page past the end, and size 0, negative or huge sizes (capped or rejected). Metadata such as <code>totalCount</code> must match the records. With stable data, adjacent pages must have no gaps and no duplicates.' },
        { title: 'Sorting and filtering', html: 'Verify ascending and descending order on the real values, plus ties (a secondary sort keeps pages stable), NULLs and letter case. Every returned record must match all filters, and records outside them must never appear. An unknown sort field should give a clear 400, not a 500.' },
        { title: 'Rate limiting', html: 'Exceed the limit within its window and expect <b>429 Too Many Requests</b>, ideally with <code>Retry-After</code>. Check the limit applies per user or key as specified, resets on time, and does not block normal traffic. Well-behaved clients back off instead of hammering the API.' }
      ] }
    ],
    example: {
      title: 'Worked example: negative and contract checks on ShopFlow’s POST /orders',
      blocks: [
        { t: 'table', head: ['#', 'Change to a valid request', 'Expected', 'Actual'], rows: [
          ['1', '<code>"quantity": 0</code>', '422, error names <code>items[0].quantity</code>', '422 ✓'],
          ['2', '<code>"quantity": "two"</code>', '400 with a field message', '<b>500 with a stack trace ✗</b>'],
          ['3', 'Extra field <code>"status": "PAID"</code>', 'Field ignored; order created as PENDING', '<b>Order created as PAID ✗</b>'],
          ['4', 'Same <code>Idempotency-Key</code> sent twice', 'One order; the retry returns the same id', 'One order, same id ✓'],
          ['5', 'Validate the 201 body against the schema', 'Passes', '<b>Fails: total returned as the string "2400.00" ✗</b>']
        ] },
        { t: 'p', html: 'Three separate findings. Row 2 is poor error handling that leaks internals. Row 3 is a security defect — a client can mark its own order as paid (<i>mass assignment</i>). Row 5 is a contract break: the mobile app parses <code>total</code> as a number and would fail. Each goes into its own bug report with the request and response, and the schema check now runs automatically in the collection on every build.' }
      ]
    },
    explain: {
      'ur': 'Negative testing میں ہم جان بوجھ کر غلط input بھیجتے ہیں تاکہ دیکھیں API محفوظ طریقے سے fail ہوتی ہے یا نہیں۔ مثلاً quantity میں "two" بھیجیں تو جواب 400 یا 422 ہونا چاہیے، صاف پیغام کے ساتھ کہ کون سا field غلط ہے، کوئی stack trace نہیں، اور database میں کچھ محفوظ نہ ہو۔ اگر 500 آئے تو یہ bug ہے۔ JSON Schema سے ہر response کی شکل چیک ہوتی ہے: fields، ان کی type اور لازمی values۔ Contract testing میں consumer، جیسے mobile app، لکھتا ہے کہ اسے کیا چاہیے، اور provider ہر build پر اسے verify کرتا ہے۔ Timeout کے بعد retry پر دوہری payment نہیں ہونی چاہیے؛ اس کے لیے Idempotency-Key استعمال ہوتی ہے۔ اور حد سے زیادہ requests پر 429 آنا چاہیے۔',
      'ur-Latn': 'Negative testing mein hum jaan boojh kar ghalat input bhejte hain taake dekhein API mehfooz tareeqe se fail hoti hai ya nahi. Maslan quantity mein "two" bhejein to jawab 400 ya 422 hona chahiye, saaf message ke saath ke kaunsa field ghalat hai, koi stack trace nahi, aur database mein kuch save na ho. Agar 500 aaye to yeh bug hai. JSON Schema se har response ki shape check hoti hai: fields, unki type aur zaroori values. Contract testing mein consumer, jaise mobile app, likhta hai ke usay kya chahiye, aur provider har build par usay verify karta hai. Timeout ke baad retry par double payment nahi honi chahiye; iske liye Idempotency-Key use hoti hai. Aur limit se zyada requests par 429 aana chahiye.',
      'hi': 'Negative testing में हम जान-बूझकर ग़लत input भेजते हैं ताकि देखें कि API सुरक्षित तरीक़े से fail होती है या नहीं। जैसे quantity में "two" भेजें, तो जवाब 400 या 422 होना चाहिए, साफ़ संदेश के साथ कि कौन-सा field ग़लत है, कोई stack trace नहीं, और database में कुछ save न हो। अगर 500 आए तो यह bug है। JSON Schema से हर response का ढाँचा check होता है: fields, उनका type और ज़रूरी values। Contract testing में consumer, जैसे mobile app, लिखता है कि उसे क्या चाहिए, और provider हर build पर उसे verify करता है। Timeout के बाद retry पर दोहरी payment नहीं होनी चाहिए; इसके लिए Idempotency-Key इस्तेमाल होती है। और सीमा से ज़्यादा requests पर 429 आना चाहिए।',
      'ar': 'في الاختبار السلبي (negative testing) نرسل مدخلات خاطئة عمدًا لنرى هل يفشل الـ API بطريقة آمنة. فمثلًا إذا أرسلنا "two" في حقل الكمية، يجب أن يكون الرد 400 أو 422 مع رسالة واضحة تحدد الحقل الخاطئ، ومن دون أي stack trace، ومن دون حفظ أي شيء في قاعدة البيانات. أما ظهور 500 فهو خلل. ويتحقق JSON Schema من شكل كل استجابة: الحقول وأنواعها والقيم الإلزامية. وفي اختبار العقود (contract testing) يحدد المستهلك، مثل تطبيق الجوال، ما يحتاجه، ويتحقق المزوّد من ذلك مع كل build. ويجب ألا تتكرر عملية الدفع عند إعادة المحاولة بعد انتهاء المهلة، ولهذا يُستخدم Idempotency-Key. وعند تجاوز الحد المسموح من الطلبات يجب أن يظهر الرمز 429.',
      'es': 'En las pruebas negativas enviamos a propósito datos incorrectos para ver si la API falla de forma segura. Por ejemplo, si enviamos "two" en la cantidad, la respuesta debe ser 400 o 422, con un mensaje claro que indique qué campo está mal, sin stack trace y sin guardar nada en la base de datos. Un 500 es un defecto. Un JSON Schema comprueba la forma de cada respuesta: campos, tipos y valores obligatorios. En las pruebas de contrato (contract testing), el consumidor —por ejemplo, la app móvil— define lo que necesita y el proveedor lo verifica en cada build. Un reintento tras un timeout no debe cobrar dos veces; para eso se usa la cabecera Idempotency-Key. Y si se superan los límites de peticiones, debe responder 429.'
    },
    keyTerms: [
      { term: 'Negative testing', def: 'Testing with invalid, missing or unexpected input to confirm the system rejects it safely and clearly.' },
      { term: 'JSON Schema', def: 'A JSON document that describes the required shape of other JSON: types, required fields, enums, ranges and formats.' },
      { term: 'Contract testing', def: 'Checking that a consumer and a provider agree on requests and responses, usually driven by the consumer’s expectations.' },
      { term: 'Idempotency key', def: 'A unique value a client sends with a request so the server can recognise retries and avoid duplicate effects.' },
      { term: 'Pagination', def: 'Returning a large result set in pages, controlled by parameters such as page and size or a cursor.' },
      { term: 'Rate limiting', def: 'Restricting how many requests a client may send in a time window; exceeding it returns 429 Too Many Requests.' }
    ],
    practice: [
      { q: 'A field <code>deliveryDate</code> must be an ISO date from today up to 30 days ahead. List your negative and boundary tests.', hint: 'Combine boundaries, types and formats.', answer: 'Boundaries: yesterday (reject), today and today + 30 (accept), today + 31 (reject). Types and formats: a number, <code>true</code>, an empty string, <code>null</code>, a missing field, <code>"31/03/2026"</code>, an impossible date such as <code>"2026-02-30"</code>. Also check time zones near midnight — whose “today”, the user’s or the server’s? Each rejection should be a 4xx naming the field, with nothing saved.' },
      { q: 'Three endpoints return errors as <code>{"error": "bad"}</code>, <code>{"message": "Invalid", "code": 7}</code> and a plain-text stack trace. What do you report?', answer: 'The stack trace is a defect on its own: it leaks internals and suggests an unhandled exception. The other two show an <b>inconsistent error format</b>, which forces every client to special-case each endpoint and hides which field failed. Recommend one documented format (for example Problem Details) with a field-level <code>errors</code> list, and add schema checks for error bodies too.' },
      { q: 'Using the order schema in this lesson, would <code>{"id": "5012", "status": "PENDING", "total": 2400, "items": [...], "createdAt": "2026-03-10T09:15:00Z", "internalNotes": "VIP"}</code> pass? Why?', answer: 'No — two failures. <code>id</code> is a string but the schema requires an integer, and <code>internalNotes</code> is not allowed because of <code>"additionalProperties": false</code>. The second one is also a possible data leak worth raising. (A strict <code>additionalProperties</code> can break consumers when providers add harmless fields, so agree on the rule for responses.)' },
      { q: 'The contract says 100 requests per minute per API key. Design the rate-limit tests.', answer: 'Send 100 requests within a minute and expect all to succeed; the 101st should get <b>429</b> with <code>Retry-After</code>. After the window resets, requests succeed again. A second API key is not affected by the first one’s usage. Check the error body follows the standard format, and that limits on login or payment endpoints are stricter if specified. Run this only where the team agrees, never against shared production.' }
    ],
    quiz: [
      { q: 'POST /orders with "quantity": "two" returns 500 and a stack trace. What should the expected result be?', options: ['500 is acceptable, because the request itself was invalid', '200, with the invalid quantity quietly ignored and the order saved with a default quantity of 1', '404, because no product matches the quantity', '400 (or 422, per the contract) naming the field, with no internals and nothing saved'], correct: 3,
        why: ['5xx means the server failed; invalid input is a client error the API should handle.', 'Silently ignoring bad input hides client bugs and may create wrong orders.', '404 is about missing resources, not invalid field values.', 'Correct — a clear 4xx, a field-level message and no saved data.'] },
      { q: 'What can a JSON Schema check on a response catch that a status-code assertion cannot?', options: ['A response that takes longer than the time limit agreed in the service-level agreement', 'Whether the created record was really stored in the database', 'A field that changed type, went missing or appeared unexpectedly', 'Whether the caller had permission to see the data'], correct: 2,
        why: ['Timing is a performance check, not a schema check.', 'A schema checks the response shape only; persistence needs a GET or a query.', 'Right — shape and type problems pass a status check unnoticed.', 'Authorization needs tests with different users and roles.'] },
      { q: 'Which description fits consumer-driven contract testing?', options: ['The provider publishes a schema and every consumer must adapt whenever it changes', 'Consumers define the interactions they rely on, and the provider verifies them against its real code before deploying', 'A signed agreement between teams that defines uptime targets and support hours', 'End-to-end UI tests that click through every service together in one shared staging environment before each and every release'], correct: 1,
        why: ['That is provider-driven and gives consumers no early warning of breaking changes.', 'Correct — the provider’s pipeline fails if it would break a consumer.', 'That describes a service-level agreement, not a test technique.', 'Contract tests avoid the cost and brittleness of full end-to-end runs.'] },
      { q: 'A client times out after POST /payments and retries with the same Idempotency-Key. What should the tester verify?', options: ['Exactly one payment exists, and the retry returns the original result', 'Two payments exist, and the second is refunded automatically later', 'The retry fails, and the customer is told to start the purchase again', 'Nothing — a timeout is a network problem outside the API'], correct: 0,
        why: ['Correct — the key lets the server recognise the retry and avoid a second charge.', 'Charging and refunding is exactly the duplicate effect idempotency prevents.', 'A safe retry should succeed with the original result, not push the problem to the user.', 'The server may have processed the first request; checking for duplicates is essential.'] },
      { q: 'GET /employees?page=2&size=20 is tested on stable data. Which check catches the classic pagination bug?', options: ['Page 2 returns status 200 OK', 'Page 2 responds in under one second', 'Page 2 always contains exactly 20 records, even when it is the final page', 'Pages 1 and 2 do not overlap, and no records are missing compared with the full sorted list'], correct: 3,
        why: ['A 200 can still contain the wrong records.', 'Speed says nothing about which records appear.', 'The last page may legitimately hold fewer records.', 'Correct — overlaps and gaps between pages are the bug to hunt, often caused by unstable sorting.'] }
    ],
    interview: [
      { q: 'A client times out after creating an order and retries the request. What would you verify?', a: 'I would first check the retry contract — is an <code>Idempotency-Key</code> required? Then I simulate the timeout, retry with the same key, and confirm there is exactly <b>one</b> order and one payment effect, using a read-only database query rather than trusting the response. I also try the same key with a changed payload (expect the documented rejection) and a new key (expect a genuinely new order), and check what the retry returns while the original is still being processed.' },
      { q: 'An employee API supports page, size, filters and sorting. What checks would you include?', a: 'Defaults when parameters are missing; first, last and empty pages; size 0, negative and very large values (capped or rejected). Filters alone and combined, with sorting ascending and descending, including ties and NULLs. I compare the records with the metadata such as <code>totalCount</code>, and with stable data I check adjacent pages for missing or duplicate records. I also check what the contract says should happen when data changes during paging, and that invalid parameters give a clear 400.' },
      { q: 'What is the difference between schema validation and contract testing?', a: 'Schema validation checks a response against a description of its shape — types, required fields, enums — and is usually based on the provider’s specification. <b>Consumer-driven contract testing</b> captures what each consumer actually sends and relies on, and makes the provider verify those expectations in its own pipeline, so a breaking change fails the provider build before release. I use both: schemas catch shape regressions on every response, and contracts protect the specific integrations between services.' }
    ],
    takeaways: [
      'Invalid input must fail safely: a clear 4xx, a consistent error body, no internals, nothing saved.',
      'Validate responses against a JSON Schema to catch type changes and leaked fields.',
      'Contract tests let consumers and providers catch breaking changes before deploying.',
      'Retries must not duplicate effects — test idempotency keys and count the results.',
      'Test paging, sorting, filtering and 429 rate limits at their boundaries.'
    ],
    links: { labs: ['api'], challenges: ['api-contract'], interview: ['a4', 'a5', 'a6'] }
  },
  {
    id: 'sa-mocking',
    n: 8,
    level: 'advanced',
    title: 'Mocks, stubs and testing microservices',
    summary: 'Use test doubles and service virtualization wisely, balance contract, integration and end-to-end tests, and test GraphQL and async events.',
    minutes: 28,
    objectives: [
      'Distinguish stubs, mocks, fakes and spies, and choose the right one',
      'Use service virtualization to test third-party failures such as payment declines and timeouts',
      'Balance unit, component, contract, integration and end-to-end tests for microservices',
      'Test GraphQL responses and asynchronous message flows correctly'
    ],
    body: [
      { t: 'p', html: 'Modern systems depend on services you do not control: payment gateways, SMS providers, shipping-rate APIs and other teams’ microservices. Real dependencies can be slow, costly, rate-limited or simply unable to produce the case you need — a declined card, a timeout, a provider outage — on demand. A <b>test double</b> replaces a real dependency with a stand-in you control, so you can test your own system’s behaviour quickly and repeatably.' },
      { t: 'table', head: ['Double', 'What it does', 'Example', 'Verifies calls?'], rows: [
        ['<b>Stub</b>', 'Returns canned answers to calls', 'A payment stub that always answers “approved”', 'No'],
        ['<b>Mock</b>', 'Is programmed with expected calls; the test fails if they do not happen as expected', 'Expects exactly one charge call for 2475.00', 'Yes'],
        ['<b>Fake</b>', 'A working but simplified implementation', 'An in-memory database or a fake email inbox', 'No — it behaves realistically'],
        ['<b>Spy</b>', 'Records the calls it receives so the test can assert on them afterwards', 'Records sent emails so the test checks one went to the buyer', 'Yes, after the fact']
      ] },
      { t: 'callout', tone: 'info', title: 'Names are used loosely', html: 'Tools and teams blur these terms: a “mock” function in a JavaScript test runner often behaves as a stub or a spy. There is also the <b>dummy</b>, an object passed only to fill a parameter and never used. What matters is knowing whether your double just answers, records, or actively verifies interactions.' },
      { t: 'h', text: 'Service virtualization and third-party payments' },
      { t: 'p', html: '<b>Service virtualization</b> simulates a whole dependent service over the network, with realistic responses, delays, state and faults, so many tests and environments can share it. Tools such as WireMock or Mountebank serve stub mappings like the one below, and browser tests can intercept network calls directly (for example with Playwright’s <code>page.route</code>). For payments, combine a virtualised gateway for hard-to-trigger cases with the provider’s own <b>sandbox</b> for realistic integration — and never use real cards.' },
      { t: 'list', items: [
        '<b>Approved</b> — order becomes PAID, one payment record, one confirmation.',
        '<b>Declined</b> (insufficient funds, expired card) — order stays unpaid, the message is friendly, nothing is recorded as paid.',
        '<b>Timeout after charging</b> — the hardest case: the gateway may have charged. Reconcile through a status check or webhook, and retry only with the same idempotency key.',
        '<b>Duplicate webhook</b> — the same “payment succeeded” event arrives twice; the order is updated once.',
        '<b>Provider unavailable</b> (503) — a clear error, nothing charged, a safe retry later.'
      ] },
      { t: 'code', lang: 'json', title: 'Stub mapping in WireMock’s JSON format: a declined card', code: `{
  "request": {
    "method": "POST",
    "urlPath": "/v1/charges",
    "bodyPatterns": [
      { "matchesJsonPath": { "expression": "$.cardToken", "equalTo": "tok_declined" } }
    ]
  },
  "response": {
    "status": 402,
    "headers": { "Content-Type": "application/json" },
    "jsonBody": {
      "error": { "code": "card_declined", "message": "Insufficient funds" }
    }
  }
}` },
      { t: 'callout', tone: 'warn', title: 'The risk of over-mocking', html: 'A mock encodes <i>your assumption</i> of how the other service behaves. When the real provider renames a field, changes an error code or adds a required header, mock-based tests keep passing while production breaks. Heavy mocking also hides integration bugs in authentication, serialisation, time-outs and configuration. Back your mocks with <b>contract tests</b>, run regular checks against the real sandbox, keep a few true end-to-end journeys, and review mocks whenever a provider publishes changes.' },
      { t: 'h', text: 'Testing microservices: finding the balance' },
      { t: 'table', head: ['Layer', 'What it proves', 'Speed and cost', 'Typical amount'], rows: [
        ['<b>Unit</b>', 'Logic inside one service, with dependencies replaced by doubles', 'Milliseconds, cheap', 'Most tests'],
        ['<b>Component</b>', 'One service through its API, with neighbours stubbed or virtualised', 'Seconds', 'Many'],
        ['<b>Contract</b>', 'Each consumer–provider pair still agrees on requests and responses', 'Seconds; no shared environment', 'One set per integration'],
        ['<b>Integration</b>', 'Real services, databases and brokers work together: auth, serialisation, config', 'Slower; needs an environment', 'Fewer, focused'],
        ['<b>End-to-end</b>', 'Critical user journeys work across the whole system', 'Slowest and most brittle', 'A handful']
      ] },
      { t: 'p', html: 'Many services talk through <b>asynchronous events</b> on a message broker. When ShopFlow’s order service publishes <code>OrderPaid</code>, the email and loyalty services consume it later. Most brokers deliver <b>at least once</b>, so consumers must handle duplicates without double effects. Order is not always guaranteed, failed messages are retried and then parked in a <b>dead-letter queue</b>, and results appear with a delay (<i>eventual consistency</i>). In tests, poll for the expected result with a time-out instead of sleeping for a fixed time.' },
      { t: 'h', text: 'GraphQL basics for testers' },
      { t: 'p', html: '<b>GraphQL</b> exposes one endpoint, usually <code>POST /graphql</code>. Clients ask for exactly the fields they want: <b>queries</b> read, <b>mutations</b> write, and subscriptions push live updates. The trap: many servers return <b>HTTP 200</b> even when an operation fails, putting an <code>errors</code> array in the body, sometimes alongside partial <code>data</code>. Newer servers following the GraphQL-over-HTTP specification may return a 4xx for requests that fail before execution, such as parse or validation errors. Never assert on the status alone — check <code>errors</code> and the shape of <code>data</code>. Also test field-level authorization, query depth or complexity limits, and introspection settings.' },
      { t: 'code', lang: 'http', title: 'A failed GraphQL query that still returns 200', code: `POST /graphql HTTP/1.1
Host: api.shopflow.test
Content-Type: application/json
Authorization: Bearer <rahul-token>

{
  "query": "query GetOrder($id: ID!) { order(id: $id) { id status total } }",
  "variables": { "id": "5012" }
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": { "order": null },
  "errors": [
    {
      "message": "Not authorized to view this order",
      "path": ["order"],
      "extensions": { "code": "FORBIDDEN" }
    }
  ]
}` }
    ],
    example: {
      title: 'Worked example: testing ShopFlow checkout without charging a real card',
      blocks: [
        { t: 'p', html: 'Checkout calls a third-party payment gateway. In the staging environment a virtualised gateway answers based on the card token, so every scenario can be triggered on demand. A nightly run also uses the provider’s sandbox. The table lists each scenario and what ShopFlow itself must do, because the gateway’s behaviour is only the trigger.' },
        { t: 'table', head: ['Scenario', 'Stub behaviour', 'Expected ShopFlow behaviour'], rows: [
          ['Approved', '200 with a charge id', 'Order PAID; one payment row; one <code>OrderPaid</code> event'],
          ['Declined', '402 <code>card_declined</code>', 'Order stays PENDING; friendly message; no payment row'],
          ['Timeout', 'No answer for 30 seconds', '“Payment processing” shown; status check reconciles; a retry uses the same idempotency key, so no double charge'],
          ['Provider down', '503', 'Clear error; nothing charged; safe to retry later'],
          ['Duplicate webhook', 'The same success event delivered twice', 'Order updated once; one confirmation email']
        ] },
        { t: 'p', html: 'Every expectation is checked in ShopFlow’s own database and event log, not just in the UI. To guard against mock drift, a contract test pins down the gateway fields ShopFlow relies on, the nightly sandbox run catches real-provider changes, and one end-to-end smoke test runs per release.' }
      ]
    },
    explain: {
      'ur': 'Test double ایک نقلی service ہے جو اصل dependency کی جگہ لیتی ہے، جیسے payment gateway۔ Stub صرف پہلے سے طے شدہ جواب دیتا ہے، mock یہ بھی check کرتا ہے کہ اسے صحیح طریقے سے call کیا گیا، fake ایک سادہ مگر چلنے والا version ہے (جیسے in-memory database)، اور spy آنے والی calls کو record کرتا ہے۔ اس سے ہم card decline یا timeout جیسے حالات جب چاہیں test کر سکتے ہیں، اصل card کے بغیر۔ لیکن بہت زیادہ mocking خطرناک ہے: اصل service بدل جائے تو tests pass ہوتے رہتے ہیں اور production ٹوٹ جاتی ہے، اس لیے contract tests اور چند end-to-end tests بھی رکھیں۔ GraphQL میں 200 کا مطلب کامیابی نہیں؛ ہمیشہ errors array دیکھیں۔',
      'ur-Latn': 'Test double ek naqli service hai jo asal dependency ki jagah leti hai, jaise payment gateway. Stub sirf pehle se tay shuda jawab deta hai, mock yeh bhi check karta hai ke usay sahi tareeqe se call kiya gaya, fake ek saada magar chalne wala version hai (jaise in-memory database), aur spy aane wali calls ko record karta hai. Is se hum card decline ya timeout jaise halaat jab chahein test kar sakte hain, asal card ke baghair. Lekin bohat zyada mocking khatarnak hai: asal service badal jaye to tests pass hote rehte hain aur production toot jati hai, is liye contract tests aur kuch end-to-end tests bhi rakhein. GraphQL mein 200 ka matlab success nahi; hamesha errors array dekhein.',
      'hi': 'Test double एक नक़ली service है जो असली dependency की जगह लेती है, जैसे payment gateway। Stub सिर्फ़ पहले से तय जवाब देता है, mock यह भी check करता है कि उसे सही तरीक़े से call किया गया, fake एक सरल पर चलने वाला version है (जैसे in-memory database), और spy आने वाली calls को record करता है। इससे हम card decline या timeout जैसी स्थितियाँ जब चाहें test कर सकते हैं, असली card के बिना। लेकिन बहुत ज़्यादा mocking ख़तरनाक है: असली service बदल जाए तो tests pass होते रहते हैं और production टूट जाता है, इसलिए contract tests और कुछ end-to-end tests भी रखें। GraphQL में 200 का मतलब सफलता नहीं है; हमेशा errors array देखें।',
      'ar': 'بديل الاختبار (test double) خدمة مزيّفة تحلّ محلّ اعتمادية حقيقية مثل بوابة الدفع. الـ stub يعيد إجابات مُعدّة مسبقًا فقط، والـ mock يتحقق أيضًا من أنه استُدعي بالطريقة الصحيحة، والـ fake نسخة مبسّطة لكنها تعمل فعلًا مثل قاعدة بيانات في الذاكرة، والـ spy يسجّل الاستدعاءات التي تصله. بهذا نستطيع اختبار حالات مثل رفض البطاقة أو انتهاء المهلة متى شئنا ومن دون بطاقة حقيقية. لكن الإفراط في استخدام الـ mocks خطير: إذا تغيّرت الخدمة الحقيقية تبقى الاختبارات ناجحة بينما يتعطل الإنتاج، لذا احتفظ أيضًا باختبارات العقود وبعض اختبارات end-to-end. وفي GraphQL لا يعني الرمز 200 النجاح؛ افحص دائمًا مصفوفة errors.',
      'es': 'Un doble de prueba (test double) es un servicio de imitación que sustituye a una dependencia real, como una pasarela de pago. Un stub solo devuelve respuestas preparadas; un mock además comprueba que lo llamaron de la forma esperada; un fake es una versión simplificada pero funcional, como una base de datos en memoria; y un spy registra las llamadas que recibe. Así podemos probar un rechazo de tarjeta o un timeout cuando queramos, sin tarjetas reales. Pero abusar de los mocks es peligroso: si el servicio real cambia, las pruebas siguen pasando mientras producción falla, así que mantén también pruebas de contrato y unas pocas pruebas end-to-end. En GraphQL, un 200 no significa éxito: revisa siempre el array errors.'
    },
    keyTerms: [
      { term: 'Test double', def: 'Any stand-in for a real dependency used in testing: dummy, stub, fake, spy or mock.' },
      { term: 'Stub', def: 'A test double that returns predefined responses and does not check how it was called.' },
      { term: 'Mock', def: 'A test double programmed with expected calls; the test fails if the calls do not match.' },
      { term: 'Service virtualization', def: 'Simulating a dependent service over the network, with realistic responses, delays and faults, for shared use in testing.' },
      { term: 'Dead-letter queue', def: 'A queue where messages go after repeated processing failures, so they can be inspected instead of lost.' },
      { term: 'GraphQL', def: 'An API query language with one endpoint, typed schema, queries and mutations; errors are often returned with HTTP 200.' }
    ],
    practice: [
      { q: 'Choose a double for each: (a) replace the SMS provider and assert exactly one code was sent to the right number; (b) a fast in-memory database for service tests; (c) a payment gateway that always approves, so UI flow tests can reach the confirmation page.', hint: 'Does the test need to verify calls, or only receive answers?', answer: '(a) A <b>mock</b> (or a spy you assert on afterwards) — the test is about the interaction itself. (b) A <b>fake</b> — a working, simplified implementation. (c) A <b>stub</b> — it only needs a canned “approved” answer; the payment logic is tested elsewhere.' },
      { q: 'ShopFlow calls a third-party shipping-rate API at checkout. Which scenarios should your virtualised service support?', answer: 'Normal rates for domestic and international addresses; an unknown or unserviceable postcode; a slow response near the time-out and a real time-out; 429 and 503 from the provider; malformed or missing fields in the response; and currency or rounding edge cases. For each, define ShopFlow’s expected behaviour — a fallback rate, a clear message, or blocking checkout — and confirm no wrong charge reaches the order.' },
      { q: 'A GraphQL test asserts only <code>status 200</code>. Rewrite its checks for <code>query { order(id: "5012") { id status total } }</code>.', answer: 'For the owner: <code>errors</code> is absent, <code>data.order.id</code> equals <code>"5012"</code>, <code>status</code> is one of the allowed values and <code>total</code> is a number. For another customer: <code>data.order</code> is <code>null</code> and <code>errors[0].extensions.code</code> is the documented code (e.g. FORBIDDEN), with no order fields leaked. Add a query with an unknown field and expect a validation error — whatever HTTP status the server documents.' },
      { q: 'After payment, an <code>OrderPaid</code> event should trigger a confirmation email. How do you test this without fixed sleeps?', answer: 'Trigger a payment, then <b>poll</b> the email fake or inbox API every second for up to, say, 30 seconds until the email appears, and fail with a clear message on time-out. Then publish the same event twice and check only one email is sent (an idempotent consumer). Send a malformed event and confirm it ends up in the dead-letter queue instead of blocking the queue.' }
    ],
    quiz: [
      { q: 'Which test double is programmed with expected calls and makes the test fail if they do not happen?', options: ['Mock', 'Stub', 'Fake', 'Dummy'], correct: 0,
        why: ['Right — mocks verify interactions, such as “charge called once with 2475.00”.', 'A stub only returns canned answers; it does not check how it was called.', 'A fake is a simplified working implementation, such as an in-memory database.', 'A dummy just fills a parameter and is never really used.'] },
      { q: 'You must test how ShopFlow handles a card decline and a gateway timeout, but the provider’s sandbox cannot produce a timeout on demand. What is the best approach?', options: ['Wait for a real decline to happen in production and study the logs afterwards', 'Use a stub or virtualised gateway that returns a decline and delays its response past the time-out', 'Skip these cases, because the payment provider is responsible for its own failures', 'Use a team member’s real card with a low balance to trigger a genuine decline from the live payment provider'], correct: 1,
        why: ['Waiting for production failures means customers find the bugs first.', 'Correct — virtualization lets you trigger rare failures safely and repeatably.', 'How ShopFlow reacts to provider failures is ShopFlow’s responsibility.', 'Real cards and real money must never be used for testing.'] },
      { q: 'What is the main risk of relying heavily on mocks?', options: ['Tests become much slower than tests against real services, because every mock adds network overhead', 'Mocks are unable to return error responses or delays', 'Mocks drift from the real service, so tests pass while the real integration fails', 'Mocks need production credentials in order to run'], correct: 2,
        why: ['Mocks usually make tests faster, not slower.', 'Mocks can return any error or delay you program — that is their strength.', 'Right — that is why mocks need contract tests and some real integration runs.', 'Mocks exist precisely so tests do not need real credentials.'] },
      { q: 'A GraphQL query returns HTTP 200 with "data": {"order": null} and an "errors" array. What should the test conclude?', options: ['The query succeeded, because the status code is 200', 'The server crashed and the response should be treated as a 500', 'The client should retry the query until the errors disappear', 'The operation failed, at least in part; assert on the errors array and the data, not the status'], correct: 3,
        why: ['Many GraphQL servers return 200 even for failed operations; the status alone proves little.', 'An errors entry is a handled error response, not necessarily a crash.', 'Retrying will not fix an authorization or validation error.', 'Correct — in GraphQL the body tells you whether the operation succeeded.'] },
      { q: 'OrderPaid events are delivered at least once. Which test matters most for the loyalty-points consumer?', options: ['Check that every event arrives in under one millisecond', 'Check that the queue never holds more than one message at a time', 'Deliver the same event twice and verify the points are added only once', 'Turn off broker retries completely so that duplicate messages can never be created in the first place'], correct: 2,
        why: ['Asynchronous delivery has no such guarantee, and the timing is not the main risk.', 'Queues legitimately hold many messages; that is not a correctness check.', 'Correct — at-least-once delivery makes idempotent consumers essential.', 'Removing retries trades duplicates for lost messages; the consumer must still cope.'] }
    ],
    interview: [
      { q: 'What is the difference between a stub and a mock?', a: 'Both replace a real dependency. A <b>stub</b> just returns canned responses so the code under test can run — for example a payment stub that always approves. A <b>mock</b> also carries expectations about how it is called and fails the test if they are not met — for example “charge was called exactly once with 2475.00”. I use stubs when I care about my system’s reaction to an answer, and mocks when the interaction itself is what I am testing. I am careful not to over-mock, because mocks can drift from the real service.' },
      { q: 'How would you approach testing a system built from microservices?', a: 'I aim for a balance: many fast <b>unit</b> and <b>component</b> tests per service with neighbours stubbed; <b>contract tests</b> for every consumer–provider pair so breaking API changes fail before deployment; focused <b>integration</b> tests for real databases, brokers and auth; and a handful of <b>end-to-end</b> journeys such as checkout. For asynchronous flows I test duplicates, ordering and dead-letter handling, and poll with time-outs instead of sleeping. I verify results in each service’s data, not only in the UI.' }
    ],
    takeaways: [
      'Stubs return canned answers, mocks verify calls, fakes are simplified working versions, spies record.',
      'Virtualise third-party services to test declines, timeouts and outages on demand — never with real cards.',
      'Over-mocking hides integration bugs; back mocks with contract tests and a few real end-to-end checks.',
      'In GraphQL, HTTP 200 does not mean success — always check the errors array.',
      'Async consumers must handle duplicates; wait for results by polling with a time-out, not fixed sleeps.'
    ],
    links: { labs: ['api'], challenges: ['api-contract'], interview: ['a5'] }
  }
]);

QA_CONTENT.addBank('sql-api', [
  { level: 'beginner', topic: 'sa-sql-basics',
    q: "Customers: Ayesha (Lahore), Rahul (Mumbai), Sara (Karachi, email NULL) and Omar (Lahore). How many rows does SELECT name FROM customers WHERE city = 'Lahore' OR email IS NULL return?",
    options: ['2 — Ayesha and Omar', '3 — Ayesha, Sara and Omar', '1 — Sara only', '4 — every customer'], correct: 1,
    why: ['This ignores the OR: Sara matches the second condition.', 'Right — Ayesha and Omar match the city, and Sara matches IS NULL.', 'This ignores the city condition, which two customers satisfy.', 'Rahul is in Mumbai and has an email, so he matches neither condition.'] },
  { level: 'beginner', topic: 'sa-sql-basics',
    q: 'In a LIKE pattern, which wildcard matches exactly one character?',
    options: ['% (percent sign)', '* (asterisk)', '_ (underscore)', '? (question mark)'], correct: 2,
    why: ['% matches any number of characters, including none.', '* is not a standard SQL LIKE wildcard.', 'Right — for example LIKE \'_mar\' matches “Omar” but not “Ammar”.', '? is a wildcard in some file systems, not in standard SQL LIKE.'] },
  { level: 'beginner', topic: 'sa-api-basics',
    q: 'DELETE /cart/items/9 succeeds, and the response deliberately has no body. Which status code fits best?',
    options: ['204 No Content', '201 Created', '202 Accepted', '304 Not Modified'], correct: 0,
    why: ['Right — success with deliberately no body is exactly what 204 means.', '201 is for creating a resource, not deleting one.', '202 means the request was accepted for later processing, not completed.', '304 is a caching answer to a conditional GET.'] },
  { level: 'intermediate', topic: 'sa-api-basics',
    q: 'A registration API returns 200 OK with the body {"error": "Email already exists"}. What is the main problem?',
    options: ['Nothing — the message is clear, so the status code does not matter', 'The status claims success while the body reports failure, so clients and monitoring treat it as a success', 'The response should be 500, because the server could not complete the request', 'The error text should be moved into a custom response header instead of the body'], correct: 1,
    why: ['Clients, retries, logs and dashboards rely on the status code, not on reading message text.', 'Correct — a documented 4xx such as 409 Conflict lets every client handle the case reliably.', 'A duplicate email is a predictable client-side conflict, not a server failure.', 'Moving the text does not fix the misleading 200.'] },
  { level: 'intermediate', topic: 'sa-sql-joins',
    q: 'The orders table holds (customer 1, PAID, 2500), (customer 2, PENDING, 1200) and (customer 1, SHIPPED, 800). What does SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id return?',
    options: ['Two rows: customer 1 → 2, customer 2 → 1', 'Three rows, one for each order, each with a count of 1', 'One row with a count of 3', 'Two rows: customer 1 → 3300, customer 2 → 1200'], correct: 0,
    why: ['Right — one row per group, counting the orders in each.', 'GROUP BY collapses rows that share a customer_id.', 'That would be COUNT(*) without GROUP BY.', 'Those are SUM(total) values, not counts.'] },
  { level: 'advanced', topic: 'sa-sql-joins',
    q: 'WHERE customer_id NOT IN (SELECT customer_id FROM blocked_customers) unexpectedly returns no rows at all. What is the most likely cause?',
    options: ['NOT IN works only with text columns, not with numeric ids', 'The subquery needs an index before NOT IN can return results', 'The database caches subquery results, so new rows are not seen', 'The subquery returns at least one NULL, which makes every NOT IN comparison unknown'], correct: 3,
    why: ['NOT IN works with any comparable type, numbers included.', 'Indexes affect speed, never which rows are returned.', 'Query results are not served from a stale cache this way.', 'Correct — x NOT IN (2, NULL) is never true. Filter out NULLs or use NOT EXISTS.'] },
  { level: 'intermediate', topic: 'sa-db-testing',
    q: 'POST /orders returns 201 with id 7001, but a SELECT for order 7001 on the test database returns no rows. What should you check before reporting a persistence bug?',
    options: ['That you are querying the same environment and database the API writes to, and whether the write happens asynchronously', 'Nothing more — a 201 without a row is always a critical bug, so report it at once', 'Send the POST again several times until a row finally appears in the table', 'Insert the missing row by hand so that the next test step can continue'], correct: 0,
    why: ['Correct — wrong database, wrong schema or a queue-based write are common, quick-to-check causes.', 'It may well be a bug, but ruling out your own setup first keeps the report accurate.', 'Repeating the POST may create duplicate orders and hides the real problem.', 'Writing data by hand hides the defect and corrupts shared test data.'] },
  { level: 'advanced', topic: 'sa-db-testing',
    q: 'Two customers press “Buy” on the last item in stock at the same moment, and both purchases succeed. Which ACID property, about how concurrent transactions interact, has most likely failed?',
    options: ['Durability', 'Isolation', 'Atomicity', 'Availability'], correct: 1,
    why: ['Durability is about committed data surviving crashes, not concurrent access.', 'Right — each transaction read the stock before the other’s update was applied. Proper isolation or locking prevents the oversell.', 'Atomicity is about all-or-nothing within one transaction.', 'Availability is not part of ACID at all.'] },
  { level: 'intermediate', topic: 'sa-postman',
    q: 'Where in Postman would you generate a unique email address just before a “Register customer” request is sent?',
    options: ['In the post-response script of the same request', 'In the collection’s documentation description', 'In the request’s pre-request script', 'In a global variable typed in by hand before every run'], correct: 2,
    why: ['Post-response scripts run after the request — too late to change its body.', 'Documentation is not executed.', 'Right — pre-request scripts run before sending, so the body can use the new value.', 'Typing values by hand defeats repeatable automation and is easy to forget.'] },
  { level: 'intermediate', topic: 'sa-postman',
    q: "orderId is 5000 in the selected environment, and the request’s pre-request script runs pm.variables.set('orderId', 7001). Which value does {{orderId}} use when that request is sent?",
    options: ['5000, because environment values always take priority', 'Whichever of the two variables was created first', 'Neither — Postman reports a variable conflict error', '7001, because the narrowest scope wins'], correct: 3,
    why: ['Environment is broader than local, so it loses the tie.', 'Creation order does not decide which value is used.', 'Postman resolves clashes by scope; it does not raise an error.', 'Correct — pm.variables.set creates a local variable, and local beats data, environment, collection and global.'] },
  { level: 'intermediate', topic: 'sa-auth',
    q: 'Support agents may refund up to 5,000. An agent with a valid token requests a refund of 7,500. According to that role rule, what should the API do?',
    options: ['Return 401, because the agent must log in again', 'Return 403 and refund nothing, because the agent’s role does not allow this amount', 'Refund 5,000 automatically and return 200', 'Return 500, because the amount is above the limit'], correct: 1,
    why: ['The agent is authenticated; logging in again changes nothing.', 'Correct — a known user without permission for this action is an authorization failure.', 'Silently changing the amount breaks the request and the audit trail.', 'An enforced rule is expected behaviour, not a server error.'] },
  { level: 'advanced', topic: 'sa-auth',
    q: 'Which cookie attribute prevents JavaScript running on the page from reading the session cookie?',
    options: ['Secure', 'SameSite', 'HttpOnly', 'Max-Age'], correct: 2,
    why: ['Secure only stops the cookie being sent over plain HTTP.', 'SameSite limits sending the cookie on cross-site requests.', 'Right — HttpOnly hides the cookie from document.cookie, reducing the damage of a script injection.', 'Max-Age controls how long the cookie lives.'] },
  { level: 'advanced', topic: 'sa-api-negative',
    q: 'A client reuses an Idempotency-Key from a successful 500.00 payment, but this time the body says 900.00. What is the most appropriate behaviour?',
    options: ['Process it as a brand-new payment of 900.00', 'Return the original 500.00 result as if nothing had changed', 'Reject it with the documented error (such as 409 or 422) and charge nothing extra', 'Charge the 400.00 difference and return 200'], correct: 2,
    why: ['Reusing a key for a different operation must not create a new charge.', 'Silently returning the old result hides a client bug and confuses the caller.', 'Correct — same key with a different payload signals a client error; nothing extra is charged.', 'Guessing the client’s intent and charging money is never safe.'] },
  { level: 'intermediate', topic: 'sa-api-negative',
    q: 'A client sends a JSON body with Content-Type: text/plain to an endpoint that accepts only application/json. Which status code fits best?',
    options: ['415 Unsupported Media Type', '406 Not Acceptable', '404 Not Found', '405 Method Not Allowed'], correct: 0,
    why: ['Right — 415 means the server will not accept the request body’s format.', '406 is about the Accept header: the server cannot produce the format the client asked for.', 'The endpoint exists; the problem is the body format.', '405 means the HTTP method is not supported on that URL.'] },
  { level: 'intermediate', topic: 'sa-mocking',
    q: 'Service tests use an in-memory database that really stores and queries data but disappears when the test ends. What kind of test double is it?',
    options: ['Stub', 'Spy', 'Mock', 'Fake'], correct: 3,
    why: ['A stub returns canned answers; it does not really store and query data.', 'A spy records calls for later assertions.', 'A mock verifies expected interactions.', 'Right — a fake is a working but simplified implementation.'] }
]);

QA_CONTENT.addDrills('sql-api', [
  {
    id: 'sa-d1', type: 'classify', level: 'intermediate',
    title: 'Authentication, authorization or neither?',
    prompt: 'Sort each API problem by what actually went wrong. Ask yourself first: does the server know who the caller is?',
    categories: ['Authentication problem (401)', 'Authorization problem (403 or 404)', 'Neither — validation or server issue'],
    items: [
      { text: 'The request has no Authorization header at all', cat: 0, why: 'The server cannot identify the caller, so this is <b>401</b>.' },
      { text: 'The access token expired twenty minutes ago', cat: 0, why: 'Expired credentials are no longer valid: <b>401</b>. The client should refresh the token.' },
      { text: 'A customer’s valid token is used to call DELETE /admin/users/12', cat: 1, why: 'The caller is known but lacks the admin role: <b>403</b>.' },
      { text: 'Rahul’s valid token is used to read Ayesha’s order 5012', cat: 1, why: 'An ownership check: <b>403</b> or <b>404</b>, per the contract. Returning the order would be an IDOR bug.' },
      { text: 'The token payload was edited to say role admin, so the signature no longer matches', cat: 0, why: 'A tampered token is invalid, so the caller is not authenticated: <b>401</b>.' },
      { text: 'A support agent with a valid token tries to change product prices', cat: 1, why: 'The role matrix does not allow it: <b>403</b>.' },
      { text: 'A logged-in customer orders a quantity of -3', cat: 2, why: 'Identity and permission are fine; the input is invalid. Expect <b>400</b> or <b>422</b>.' },
      { text: 'A valid request crashes the order service with a null reference error', cat: 2, why: 'This is a server defect (<b>500</b>), not an auth issue.' }
    ]
  },
  {
    id: 'sa-d2', type: 'fill', level: 'intermediate',
    title: 'Pick the status code',
    prompt: 'Type the most suitable HTTP status code for each situation. The number alone is enough.',
    fields: [
      { label: 'POST /orders creates a new order and returns its id', accept: ['201', '201 created', 'created'], why: '<b>201 Created</b>, ideally with a <code>Location</code> header pointing to the new order.' },
      { label: 'DELETE /cart/items/9 succeeds and the response has no body', accept: ['204', '204 no content', 'no content'], why: '<b>204 No Content</b> — success, deliberately without a body. (200 with a body is also common.)' },
      { label: 'A customer with a valid token calls an admin-only endpoint', accept: ['403', '403 forbidden', 'forbidden'], why: '<b>403 Forbidden</b> — authenticated but not allowed. 401 would mean the caller is not authenticated.' },
      { label: 'Registering an email that already exists, where the contract treats it as a conflict', accept: ['409', '409 conflict', 'conflict'], why: '<b>409 Conflict</b> — the request clashes with existing data.' },
      { label: 'A client sends 120 requests in one minute when the limit is 100', accept: ['429', '429 too many requests', 'too many requests'], why: '<b>429 Too Many Requests</b>, ideally with a <code>Retry-After</code> header.' },
      { label: 'The API gateway receives an invalid response from the upstream payment service', accept: ['502', '502 bad gateway', 'bad gateway'], why: '<b>502 Bad Gateway</b> — the problem is in a service behind the gateway, not in the client’s request.' }
    ]
  },
  {
    id: 'sa-d3', type: 'spot', level: 'beginner',
    title: 'Spot the risky SQL on a shared database',
    prompt: 'A new tester saved these statements to run on the shared staging database. Select every line that is wrong or risky.',
    lines: [
      { text: 'SELECT order_id, status, total FROM orders WHERE order_id = 5013;', flaw: false, why: 'A filtered, read-only query that selects only the needed columns — a model habit.' },
      { text: 'SELECT name FROM customers WHERE email = NULL;', flaw: true, why: 'A comparison with NULL is never true, so this always returns nothing. Use <code>IS NULL</code>.' },
      { text: "UPDATE orders SET status = 'CANCELLED';", flaw: true, why: 'No <code>WHERE</code>: every order in the shared database is cancelled. Change data through the app or API, and never without agreement.' },
      { text: 'SELECT COUNT(*) FROM orders WHERE customer_id = 2;', flaw: false, why: 'A cheap, read-only count on a key — perfectly safe.' },
      { text: 'SELECT * FROM audit_log;', flaw: true, why: 'An unfiltered scan of a huge table slows the shared server for everyone. Select columns, filter, and add <code>LIMIT</code>.' },
      { text: "SELECT customer_id, name FROM customers WHERE city = 'Lahore' ORDER BY name LIMIT 20;", flaw: false, why: 'Filtered, sorted and limited — a safe exploratory query.' },
      { text: "DELETE FROM customers WHERE email LIKE '%@example.com';", flaw: true, why: 'Test accounts usually share that domain, so this deletes other testers’ data too. Clean up only your own records, through the API.' },
      { text: 'SELECT o.order_id FROM orders o LEFT JOIN customers c ON c.customer_id = o.customer_id WHERE c.customer_id IS NULL;', flaw: false, why: 'A read-only orphan check — exactly the kind of integrity query testers should run.' }
    ]
  },
  {
    id: 'sa-d4', type: 'spot', level: 'intermediate',
    title: 'Review a Postman test script',
    prompt: 'These lines come from the post-response script of POST {{baseUrl}}/orders. Select the lines that are flawed.',
    lines: [
      { text: "pm.test('Status is 201 Created', function () { pm.response.to.have.status(201); });", flaw: false, why: 'A specific, named assertion on the documented status.' },
      { text: 'const body = pm.response.json();', flaw: false, why: 'Parses the JSON body once for the assertions that follow.' },
      { text: "pm.environment.set('accessToken', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.x9F2');", flaw: true, why: 'A hard-coded token is saved with the collection and can end up in Git. Get it from a login request or inject it as a secret at run time.' },
      { text: "pm.test('Order saved', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201, 400]); });", flaw: true, why: 'It passes on a 400 error, and no status code can prove the order was saved. Assert 201 alone, and verify persistence with a GET.' },
      { text: "pm.test('Status is PENDING', function () { pm.expect(body.status).to.eql('PENDING'); });", flaw: false, why: 'Checks an important business value, not just the status code.' },
      { text: "if (pm.response.code === 201) { pm.test('Has numeric id', function () { pm.expect(body.id).to.be.a('number'); }); }", flaw: true, why: 'When the status is wrong the test is silently skipped, and a skipped check looks like a pass. Assert unconditionally.' },
      { text: "pm.test('Responds in under 1000 ms', function () { pm.expect(pm.response.responseTime).to.be.below(1000); });", flaw: false, why: 'A generous, clearly named response-time check.' },
      { text: "pm.environment.set('orderId', body.id);", flaw: false, why: 'Chains the new id to the next request instead of hard-coding it.' }
    ]
  },
  {
    id: 'sa-d5', type: 'order', level: 'intermediate',
    title: 'Verify an API-created record',
    prompt: 'Put these steps for proving that POST /orders really created the right order into the correct order.',
    items: [
      'Select the right environment and prepare unique test data',
      'Send POST /orders with a valid body and a valid token',
      'Assert 201, the Location header and the response body fields',
      'Save the returned id and read the order back with GET /orders/{id}',
      'Run a read-only SELECT on orders and order_items for that id',
      'Check side effects such as stock and the audit log, then clean up the test data'
    ],
    explain: 'Unique data first makes the test repeatable. Response checks are the cheapest evidence, so they come next. The GET proves the API reads back what it stored, and the read-only query proves the stored values and related rows directly — a <b>201 alone is not proof of persistence</b>. Side effects and cleanup come last, so the shared environment stays usable for everyone.'
  }
]);
