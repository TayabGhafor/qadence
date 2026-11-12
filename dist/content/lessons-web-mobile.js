/* Qadence content · stage "web-mobile" · lessons 1–8 (how the web works → usability & localization),
   test bank and practice drills.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-web-mobile.js */
QA_CONTENT.addLessons('web-mobile', [
  /* ------------------------------------------------------------------ 1 */
  {
    id: 'wm-web-basics',
    n: 1,
    level: 'beginner',
    title: 'How the web works for testers',
    summary: 'Follow a page from URL to screen, tell client from server problems, and know where browsers store data so your bug reports point to the right layer.',
    minutes: 18,
    objectives: [
      'Describe the request/response cycle and read every part of a URL',
      'Explain what HTTPS does and does not guarantee',
      'Compare cookies, localStorage and sessionStorage and test each one',
      'Map a symptom to the layer most likely to have failed'
    ],
    body: [
      { t: 'p', html: 'Every time you open a page in <b>ShopFlow</b>, two programs talk. The <b>client</b> — your browser — sends a <b>request</b>; a <b>server</b> sends back a <b>response</b>. The page you see is built from many such exchanges: one for the HTML, more for CSS, JavaScript, images and fonts, and then API calls for data such as prices and stock. Testers who understand these layers write sharper bug reports: “Add to cart does nothing” becomes “clicking Add to cart sends no request; the Console shows a TypeError”.' },
      { t: 'flow', caption: 'What happens when you open https://www.shopflow.example', steps: ['Enter URL', 'DNS finds the server', 'Secure connection (TLS)', 'Send HTTP request', 'Server responds', 'Browser renders', 'JavaScript calls APIs'] },
      { t: 'h', text: 'Reading a URL like a tester' },
      { t: 'table', caption: 'https://www.shopflow.example:443/products/42?color=red#reviews', head: ['Part', 'Example', 'What a tester checks'], rows: [
        ['Scheme', '<code>https</code>', 'Does <code>http://</code> redirect to <code>https://</code>? Is any image or script still loaded over plain HTTP (mixed content)?'],
        ['Host', '<code>www.shopflow.example</code>', 'Different hosts (www, app, api) are different <b>origins</b>, so cookies and storage may not be shared between them.'],
        ['Port', '<code>443</code>', 'Usually hidden: 443 is the default for HTTPS and 80 for HTTP. Test servers often use others, such as 8080.'],
        ['Path', '<code>/products/42</code>', 'Change 42 to an id that does not exist, or one that belongs to another user. Is a proper error or 404 shown?'],
        ['Query string', '<code>?color=red</code>', 'Edit or remove parameters; try spaces, <code>&amp;</code>, Unicode and very long values. Are they encoded and validated?'],
        ['Fragment', '<code>#reviews</code>', 'Handled only by the browser (scrolling, in-page routing). It is <b>never sent</b> to the server.']
      ] },
      { t: 'code', lang: 'http', title: 'One request and its response', code: `GET /api/products/42?currency=USD HTTP/1.1
Host: www.shopflow.example
Accept: application/json
Cookie: session_id=7f3a9c

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

{"id": 42, "name": "Canvas tote", "price": 18.50, "stock": 7}` },
      { t: 'p', html: 'A request has a <b>method</b> — <code>GET</code> reads, <code>POST</code> creates, <code>PUT</code>/<code>PATCH</code> update, <code>DELETE</code> removes — plus headers and sometimes a body. The response starts with a <b>status code</b>: <b>2xx</b> success, <b>3xx</b> redirect, <b>4xx</b> a problem with the request (400 bad input, <b>401</b> not authenticated, <b>403</b> authenticated but not allowed, 404 not found) and <b>5xx</b> a server failure. A <code>200</code> or <code>201</code> alone does not prove the data was saved — reload the page or read it back with a <code>GET</code>.' },
      { t: 'callout', tone: 'info', title: 'HTTP vs HTTPS', html: 'HTTPS is HTTP sent through an encrypted <b>TLS</b> connection. It hides traffic from others on the same Wi-Fi, stops it being changed in transit, and the <b>certificate</b> proves the browser reached the domain shown in the address bar. It does <i>not</i> prove the site is honest or free of security bugs. Check that HTTP redirects to HTTPS, certificates are valid on every subdomain, and no page loads mixed content.' },
      { t: 'cards', items: [
        { title: 'HTML — structure', html: 'Headings, links, form fields, labels and buttons. Typical bugs: a field without a label, or a “button” built from a plain <code>div</code> that the keyboard cannot reach.' },
        { title: 'CSS — presentation', html: 'Layout, colours, fonts and responsive rules. Typical bugs: overlapping or cut-off text, content hidden at certain widths, poor contrast.' },
        { title: 'JavaScript — behaviour', html: 'Clicks, validation, dynamic content and API calls. Typical bugs: buttons that do nothing, Console errors, double submissions, stale data.' },
        { title: 'Server and API — rules', html: 'Business logic, authentication and the database. Typical bugs: 5xx errors, wrong totals, missing permission checks, slow responses.' }
      ] },
      { t: 'h', text: 'Where the browser keeps data' },
      { t: 'table', head: ['Feature', 'Cookies', 'localStorage', 'sessionStorage'], rows: [
        ['Sent to the server?', '<b>Yes</b>, automatically with every matching request', 'No', 'No'],
        ['How long it lasts', 'Until <code>Expires</code>/<code>Max-Age</code>; “session cookies” until the browser session ends', 'Until code or the user clears it', 'Until that tab is closed (survives a reload)'],
        ['Shared between', 'All tabs; scope set by domain and path', 'All tabs of the same origin', 'Only one tab of one origin'],
        ['Typical size', 'About 4 KB per cookie', 'A few MB, browser-dependent', 'A few MB, browser-dependent'],
        ['Readable by JavaScript?', 'Yes, unless marked <b>HttpOnly</b>', 'Yes', 'Yes'],
        ['Typical use', 'Session id, consent choice', 'Theme, saved guest cart', 'Progress in a one-tab wizard']
      ] },
      { t: 'callout', tone: 'warn', title: 'Storage test ideas', html: 'Log out, then check the Application panel: is the session cookie gone, and does the Back button still show private data? Session cookies should be <b>HttpOnly</b> (scripts cannot read them), <b>Secure</b> (sent only over HTTPS) and have a sensible <b>SameSite</b> value. Anything in localStorage or sessionStorage can be read by any script on the page, so tokens or personal data stored there are a risk worth raising.' },
      { t: 'p', html: 'Browsers, CDNs and service workers <b>cache</b> responses to save time. The server controls this with headers such as <code>Cache-Control: max-age=60</code> (reuse for 60 seconds), <code>no-cache</code> (may store, but must check with the server before reuse) and <code>no-store</code> (do not store at all). Caching causes the classic “it’s fixed on the server but I still see the bug” confusion. Retest with a hard reload or DevTools’ <b>Disable cache</b> — and also check what a returning user with a warm cache sees after a release.' },
      { t: 'table', caption: 'What can go wrong at each layer', head: ['Layer', 'Example failure', 'Where you notice it'], rows: [
        ['Network, DNS, TLS', 'Certificate expired or for the wrong domain; request times out', 'Browser warning page; request stuck as pending'],
        ['Server / API', '500 error, wrong data, missing authorization check', 'Network panel: status code and response body'],
        ['HTML', 'Missing label, wrong element type, broken link', 'Elements panel; keyboard and screen-reader checks'],
        ['CSS', 'Overflow, overlap, content hidden at some widths', 'Resizing, zooming, device toolbar'],
        ['JavaScript', 'Uncaught error, click handler missing, race condition', 'Console errors; no request sent when one is expected'],
        ['Storage / cache', 'Stale price; session not cleared on logout', 'Application panel; a hard reload changes the result']
      ] }
    ],
    example: {
      title: 'Worked example: the guest cart that disappears at login',
      blocks: [
        { t: 'p', html: '<b>Report:</b> “In ShopFlow I added two items as a guest, logged in, and my cart was empty.” Instead of guessing, the tester walks through the layers with DevTools open.' },
        { t: 'table', head: ['Check', 'Observation', 'What it tells you'], rows: [
          ['Application → localStorage, before login', '<code>guestCart</code> holds 2 items', 'The guest cart was stored correctly'],
          ['Network, during login', '<code>POST /api/login</code> → 200, but no <code>POST /api/cart/merge</code> request at all', 'The merge call was never sent — this is not a server error'],
          ['Console', "<code>TypeError: Cannot read properties of undefined (reading 'items')</code> at <code>cart.js:88</code>", 'Front-end JavaScript crashed before making the call'],
          ['Application, after login', '<code>guestCart</code> still present; server cart empty', 'Nothing was lost — it was never merged']
        ] },
        { t: 'p', html: '<b>Better bug title:</b> “Guest cart not merged at login: merge request never sent, TypeError at cart.js:88”. It names the layer, gives evidence and saves the developer an hour of searching. Severity is high (customers lose their carts); the product team decides the priority.' }
      ]
    },
    explain: {
      'ur': 'جب آپ کوئی ویب سائٹ کھولتے ہیں تو آپ کا browser (یعنی client) سرور کو ایک request بھیجتا ہے اور سرور ایک response واپس کرتا ہے جس میں status code ہوتا ہے، جیسے 200 (کامیاب)، 404 (نہیں ملا) یا 500 (سرور کی خرابی)۔ HTML صفحے کا ڈھانچہ بناتا ہے، CSS اسے سجاتا ہے اور JavaScript اسے چلاتا ہے۔ Tester کا کام یہ پہچاننا ہے کہ خرابی کس layer میں ہے۔ مثال: “Save” دبانے پر کچھ نہیں ہوا — اگر Network میں request گئی ہی نہیں تو مسئلہ JavaScript میں ہے، اور اگر 500 آیا تو سرور میں۔ یاد رکھیں: cookies اسی سائٹ کی ہر request کے ساتھ سرور کو جاتی ہیں، localStorage براؤزر ہی میں رہتا ہے، اور sessionStorage ٹیب بند ہوتے ہی ختم ہو جاتا ہے۔',
      'ur-Latn': 'Jab aap koi website kholte hain to aap ka browser (yani client) server ko ek request bhejta hai aur server ek response wapas karta hai jis mein status code hota hai, jaise 200 (success), 404 (nahi mila) ya 500 (server ki kharabi). HTML page ka dhaancha banata hai, CSS usay sajata hai aur JavaScript usay chalata hai. Tester ka kaam yeh pehchanna hai ke masla kis layer mein hai. Misaal: “Save” dabane par kuch nahi hua — agar Network tab mein request gayi hi nahi to masla JavaScript mein hai, aur agar 500 aaya to server mein. Yaad rakhein: cookies usi site ki har request ke saath server ko jaati hain, localStorage browser hi mein rehta hai, aur sessionStorage tab band hote hi khatam ho jata hai.',
      'hi': 'जब आप कोई वेबसाइट खोलते हैं, तो आपका browser (यानी client) server को एक request भेजता है और server एक response लौटाता है, जिसमें status code होता है — जैसे 200 (सफल), 404 (नहीं मिला) या 500 (server की गड़बड़ी)। HTML पेज का ढाँचा बनाता है, CSS उसे सजाता है और JavaScript उसे चलाता है। Tester का काम यह पहचानना है कि गड़बड़ी किस layer में है। उदाहरण: “Save” दबाने पर कुछ नहीं हुआ — अगर Network tab में request गई ही नहीं, तो समस्या JavaScript में है; अगर 500 आया, तो server में। याद रखें: cookies उसी साइट की हर request के साथ server को जाती हैं, localStorage browser में ही रहता है, और sessionStorage tab बंद होते ही मिट जाता है।',
      'ar': 'عندما تفتح موقعًا إلكترونيًا يرسل المتصفح (أي العميل client) طلبًا (request) إلى الخادم، فيعيد الخادم استجابة (response) تحتوي على رمز حالة (status code) مثل 200 (نجاح) أو 404 (غير موجود) أو 500 (خطأ في الخادم). لغة HTML تبني هيكل الصفحة، وCSS تنسّقها، وJavaScript تمنحها السلوك. مهمة المختبِر أن يحدّد الطبقة (layer) التي حدث فيها الخلل. مثال: ضغطتَ «حفظ» ولم يحدث شيء؛ إذا لم يظهر أي طلب في تبويب Network فالمشكلة في JavaScript، وإذا ظهر الرمز 500 فالمشكلة في الخادم. وتذكّر: ملفات cookies تُرسَل تلقائيًا مع كل طلب إلى الموقع نفسه، وlocalStorage يبقى داخل المتصفح، أما sessionStorage فيُمحى عند إغلاق التبويب.',
      'es': 'Cuando abres un sitio web, tu navegador (el cliente) envía una petición (request) al servidor y este devuelve una respuesta (response) con un código de estado, como 200 (éxito), 404 (no encontrado) o 500 (error del servidor). HTML construye la estructura de la página, CSS le da estilo y JavaScript le da comportamiento. El trabajo del tester es identificar en qué capa está el fallo. Ejemplo: pulsas «Guardar» y no pasa nada; si en la pestaña Network no aparece ninguna petición, el problema está en JavaScript, y si aparece un 500, está en el servidor. Recuerda: las cookies viajan automáticamente con cada petición al mismo sitio, localStorage se queda en el navegador y sessionStorage se borra al cerrar la pestaña.'
    },
    keyTerms: [
      { term: 'Client / server', def: 'The client (usually a browser or app) asks for something; the server processes the request and sends back a response.' },
      { term: 'Status code', def: 'Three-digit number in every HTTP response: 2xx success, 3xx redirect, 4xx problem with the request, 5xx server failure.' },
      { term: 'Origin', def: 'Scheme + host + port, e.g. https://www.shopflow.example:443. Browsers separate storage and many security rules per origin.' },
      { term: 'Cookie', def: 'Small value the browser stores and automatically sends back with matching requests; often holds a session id.' },
      { term: 'Web storage', def: 'localStorage (kept until cleared) and sessionStorage (one tab, cleared when it closes). Read by JavaScript; never sent automatically.' },
      { term: 'Cache', def: 'A stored copy of a response reused to save time, controlled by headers such as Cache-Control. Stale caches cause confusing results.' }
    ],
    practice: [
      { q: 'Break down <code>https://app.peopleops.example/leave/requests/88?status=pending#history</code>. Which parts reach the server, and what would you try changing?', hint: 'One part never leaves the browser.', answer: 'Scheme <code>https</code>, host <code>app.peopleops.example</code>, default port 443, path <code>/leave/requests/88</code> and query <code>status=pending</code> all reach the server. The fragment <code>#history</code> stays in the browser. Try another employee’s request id (expect 403 or 404 — never their data), an unknown status value, and removing the query entirely.' },
      { q: 'Pick cookie, localStorage or sessionStorage for each: (a) the login session id, (b) a dark-mode preference that should survive restarts, (c) a three-step form whose progress must not leak into other tabs.', answer: '(a) <b>Cookie</b>, ideally HttpOnly and Secure, so it is sent automatically and scripts cannot read it. (b) <b>localStorage</b> — it persists until cleared and needs no server round-trip. (c) <b>sessionStorage</b> — it is scoped to one tab and cleared when that tab closes.' },
      { q: 'After a release, one tester sees the new checkout page and another still sees the old one. List three possible causes and how you would confirm each.', hint: 'Think about every place a copy of the page can live.', answer: '1) <b>Browser cache</b> — repeat with Disable cache or a private window. 2) <b>CDN cache</b> not refreshed — compare response headers (such as Age or a cache-status header) on both machines. 3) A <b>service worker</b> serving the old version — check Application → Service workers. Also confirm both testers use the same environment URL and are not in different feature-flag or A/B groups.' }
    ],
    quiz: [
      { q: 'Which part of https://www.shopflow.example/search?q=bag#filters is never sent to the server?', options: ['The query string ?q=bag', 'The fragment #filters', 'The path /search', 'The host name www.shopflow.example'], correct: 1,
        why: ['The query string is part of the request URL; the server reads it to run the search.', 'Right — the fragment is handled by the browser for scrolling or in-page routing and is not included in the HTTP request.', 'The path tells the server which resource is wanted, so it is always sent.', 'The host is used to find and connect to the server and is sent in the Host header.'] },
      { q: 'A booking wizard keeps its progress only in sessionStorage. A user types the wizard URL into a brand-new tab. What should the tester expect?', options: ['Both tabs share the same progress because storage is per origin', 'The progress is sent to the server with the first request', 'The first tab loses its progress as soon as the second opens', 'The new tab starts without the saved progress'], correct: 3,
        why: ['That describes localStorage. sessionStorage is separated per tab as well as per origin.', 'Web storage is never sent automatically; only cookies travel with requests.', 'Opening another tab does not clear the first tab’s sessionStorage; it is cleared when that tab closes.', 'Right — a new tab gets its own empty sessionStorage, so the wizard starts fresh there.'] },
      { q: 'What does a valid HTTPS connection actually guarantee to the user?', options: ['Traffic is encrypted and the certificate matches the site’s domain', 'The company behind the site has been verified as trustworthy', 'The site has no vulnerabilities such as cross-site scripting', 'User passwords are hashed and stored safely in the server’s database'], correct: 0,
        why: ['Right — TLS encrypts and protects data in transit, and the certificate ties the connection to the domain in the address bar.', 'Many certificates only prove control of a domain; scam sites can have valid HTTPS too.', 'HTTPS protects the connection, not the code; XSS and other flaws are still possible.', 'How the server stores passwords is unrelated to the transport encryption HTTPS provides.'] },
      { q: 'A developer says the wrong-price bug is fixed and deployed, but you still see the old price. What is the best first step?', options: ['Reopen the bug at once and mark the fix as failed', 'Uninstall and reinstall the browser so that every old file is removed', 'Reload with the cache bypassed and compare with the API response', 'Close the bug because the developer has confirmed the fix'], correct: 2,
        why: ['You may be looking at a cached copy; reopening without checking wastes time and trust.', 'Far too drastic — a hard reload, Disable cache or a private window isolates caching in seconds.', 'Right — rule out caching first, and check the API response to see which layer still has the old price.', 'Retesting is the tester’s job; a developer’s confirmation is not evidence that the fix works.'] },
      { q: 'Clicking Save on a profile shows nothing. The Network panel shows POST /api/profile returned 500. Where does the main defect most likely live?', options: ['In the CSS that hides the success message', 'In the server code handling the request', 'In the HTML markup of the Save button', 'In the user’s slow internet connection'], correct: 1,
        why: ['The request reached the server and failed there; styling cannot cause a 500.', 'Right — 5xx means the server failed. Also report that the UI showed no error message, which is a second, front-end bug.', 'The button worked — it sent the request. The failure is in the response.', 'A slow connection shows up as a time-out or a long pending request, not a 500 status from the server.'] }
    ],
    interview: [
      { q: 'What happens when you type a URL and press Enter, and why does it matter for testing?', a: 'The browser looks up the server’s address through DNS, opens a connection (with TLS for HTTPS) and sends an HTTP request. The server returns a response with a status code, headers and a body — usually HTML, which then pulls in CSS, JavaScript and images, and the JavaScript calls APIs for data. As a tester this helps me <b>locate failures</b>: a certificate warning is a TLS problem, a 500 is the server, a Console error with no request sent is front-end code, and stale content may be caching. That makes my bug reports precise and gets them to the right developer faster.' },
      { q: 'Explain cookies, localStorage and sessionStorage, with one test you would run on each.', a: '<b>Cookies</b> are small values sent automatically with matching requests, so they carry sessions; I check the session cookie is HttpOnly and Secure and is removed on logout. <b>localStorage</b> persists per origin until cleared and is never sent to the server; I check what survives logout or a different user signing in on the same browser. <b>sessionStorage</b> is per tab and cleared when the tab closes; I check a multi-step form in one tab does not leak into another. Nothing sensitive should sit in web storage, because any script on the page can read it.' }
    ],
    takeaways: [
      'Every page is many request/response exchanges — find the layer that failed before you report.',
      'The URL fragment never reaches the server; the path and query do, so try tampering with them.',
      'HTTPS means encrypted and the certificate matches the domain — not that the site is trustworthy.',
      'Cookies travel with requests, localStorage persists, sessionStorage lives and dies with its tab.',
      'When a “fixed” bug persists, rule out caching before reopening the ticket.'
    ],
    links: { labs: ['login'], challenges: ['peopleops-login'], interview: ['a1'] }
  },
  /* ------------------------------------------------------------------ 2 */
  {
    id: 'wm-devtools',
    n: 2,
    level: 'beginner',
    title: 'Browser DevTools for testers',
    summary: 'Use the Elements, Console, Network and Application panels to find the layer that failed and attach evidence developers can act on.',
    minutes: 20,
    objectives: [
      'Inspect elements, styles and the accessibility tree of any page',
      'Read Console errors and Network requests to locate a failure',
      'Check storage, throttle the network and emulate devices — knowing their limits',
      'Capture clean, safe evidence (screenshots, HAR files) for bug reports'
    ],
    body: [
      { t: 'p', html: 'Every desktop browser ships with <b>Developer Tools</b>. Open them with <kbd>F12</kbd> or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> (<kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> on a Mac), or right-click any element and choose <b>Inspect</b>. You are not there to fix code — you are there to <b>collect evidence</b> and narrow down which layer failed. Panel names below follow Chrome and Edge; Firefox calls Elements “Inspector” and Application “Storage”, and Safari needs its developer features switched on in Settings first.' },
      { t: 'cards', items: [
        { title: 'Elements', html: 'The live HTML and CSS. Inspect a broken layout, check labels and roles, read the accessibility tree.' },
        { title: 'Console', html: 'JavaScript errors and warnings, failed loads and app messages. The first stop when “nothing happens”.' },
        { title: 'Network', html: 'Every request and response: status, timing, what was sent and what came back.' },
        { title: 'Application', html: 'Cookies, localStorage, sessionStorage, IndexedDB, cache storage and service workers.' },
        { title: 'Device toolbar', html: 'Viewport sizes, touch input and device pixel ratio for quick responsive checks.' }
      ] },
      { t: 'h', text: 'Elements: what is really on the page' },
      { t: 'p', html: 'Inspect a misaligned button and the <b>Styles</b> pane shows which CSS rule wins and which are crossed out. You can edit text in place — paste a 60-character name to preview overflow — but edits are temporary and only on your machine, so they are a way to explore, not proof of a bug. The <b>Accessibility</b> pane shows each element’s computed <b>role</b> and <b>name</b> as assistive technology sees it. An icon-only button with no accessible name, or a clickable <code>div</code> with no role, is a real defect even if it looks fine.' },
      { t: 'h', text: 'Console: errors users never see' },
      { t: 'p', html: 'Red entries are <b>errors</b> — uncaught exceptions, failed resource loads, blocked requests (for example CORS errors). Yellow entries are warnings. When a button “does nothing”, the Console often explains why. Copy the <b>full error text and the file:line</b> into the report. Browser extensions add noise, so confirm errors in a private window or a clean profile. Never paste code from strangers into the Console: it runs with your logged-in session.' },
      { t: 'h', text: 'Network: the conversation with the server' },
      { t: 'table', caption: 'Click any request to open its details', head: ['Where to look', 'What it tells you', 'Tester use'], rows: [
        ['Status column', '2xx, 3xx, 4xx, 5xx — or failed, canceled, pending', 'Decide whether the client or the server failed'],
        ['Headers', 'Method, full URL, request and response headers', 'Quote the exact endpoint; check auth and cache headers'],
        ['Payload', 'Query parameters and the request body that was sent', 'Did the UI send what the user typed?'],
        ['Response / Preview', 'The body returned — data or an error message', 'Spot wrong data or a hidden server error'],
        ['Timing', 'Queueing, waiting for the server, downloading', 'Separate a slow server from a large download'],
        ['Initiator', 'Which script or element triggered the request', 'Helps developers jump to the right code']
      ] },
      { t: 'list', items: [
        '<b>Preserve log</b> keeps requests across page loads and redirects — essential for login flows.',
        '<b>Disable cache</b> fetches everything fresh, but only while DevTools is open.',
        '<b>Throttling</b> simulates slow or offline connections to test spinners, time-outs and retry messages.',
        '<b>Filter</b> by Fetch/XHR to see only API calls, or search for an endpoint name.',
        '<b>Clear</b> the log just before the step you are reproducing, so the evidence stays short and readable.'
      ] },
      { t: 'callout', tone: 'warn', title: 'Simulation is not reality', html: 'Throttling delays traffic inside the browser; it does not reproduce packet loss, a weak mobile signal or switching between networks. The device toolbar changes the viewport and user agent but still renders with your desktop browser’s engine. Use both for fast feedback, then confirm important findings on real browsers, devices and networks.' },
      { t: 'p', html: 'The <b>Application</b> panel lists cookies with their flags (HttpOnly, Secure, SameSite) and expiry, plus localStorage, sessionStorage and IndexedDB. Testers use it to delete a session cookie to imitate an expired session, edit a stored value to see how the app copes with tampered data, or <b>clear site data</b> for a true first-visit test. The <b>device toolbar</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> with DevTools focused) sets the viewport size, touch and pixel ratio for quick responsive checks.' },
      { t: 'h', text: 'Turning findings into evidence' },
      { t: 'flow', caption: 'Capturing network evidence for a bug report', steps: ['Reproduce once', 'Open DevTools first', 'Preserve log, clear', 'Repeat the steps', 'Screenshot + export HAR', 'Remove secrets', 'Attach to the report'] },
      { t: 'callout', tone: 'key', title: 'HAR files contain secrets', html: 'A <b>HAR</b> file (HTTP Archive) records every request with its headers and often its bodies — including cookies, auth tokens and personal data. Some browsers offer a sanitized export; either way, open the file and remove secrets before sharing, or capture it with a test account. Pair it with a screenshot (Chrome’s Command Menu, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, can capture a full-size screenshot) and the exact time, so server logs can be matched.' }
    ],
    example: {
      title: 'Worked example: “Place order sometimes does nothing”',
      blocks: [
        { t: 'p', html: 'A ShopFlow tester sees the <b>Place order</b> button do nothing about one time in five. No message appears. Instead of filing “button broken”, they open DevTools <i>before</i> reproducing, tick Preserve log and filter to Fetch/XHR.' },
        { t: 'table', head: ['Panel', 'Observation'], rows: [
          ['Console', 'No errors on the failed attempts — the front-end did not crash'],
          ['Network', '<code>POST /api/orders</code> is sent every time; failed attempts return <b>504 Gateway Timeout</b> after about 30 seconds'],
          ['Network → Timing', 'Almost all of that time is spent waiting for the server response'],
          ['Application', 'Cart still in localStorage; no order id saved, so the user may retry']
        ] },
        { t: 'code', lang: 'text', title: 'Evidence section of the bug report', code: `Environment: staging, build 2.14.0, Chrome (desktop), Windows 11
Frequency:   4 of 20 attempts, test account qa.buyer01
Request:     POST /api/orders -> 504 Gateway Timeout after ~30 s
             (sanitized HAR attached)
UI:          spinner stops, no error message, button enabled again
Console:     no errors
Last seen:   14:32 PKT - use to match server logs` },
        { t: 'p', html: 'The report now points to two problems: a server-side time-out to investigate, and a UI that hides failures from the user. One more check is needed — a time-out does not prove the order was <i>not</i> created, so look at the order list: a retry might create a duplicate.' }
      ]
    },
    explain: {
      'ur': 'DevTools ہر desktop browser میں موجود ایک ٹول باکس ہے جو F12 دبانے سے کھلتا ہے۔ Tester کو code ٹھیک نہیں کرنا ہوتا بلکہ ثبوت (evidence) جمع کرنا ہوتا ہے کہ خرابی کہاں ہے۔ Elements میں صفحے کا اصل HTML اور CSS نظر آتا ہے، Console میں وہ errors دکھائی دیتے ہیں جو صارف کو نظر نہیں آتے، Network میں ہر request کا status، وقت اور data ہوتا ہے، اور Application میں cookies اور localStorage۔ مثال: “Place order” دبانے پر کچھ نہیں ہوا؛ Network میں دیکھا تو POST /api/orders نے 504 واپس کیا۔ اب bug report میں endpoint، status، وقت اور screenshot لگائیں۔ HAR فائل شیئر کرنے سے پہلے اس میں سے tokens اور ذاتی معلومات ضرور ہٹا دیں۔',
      'ur-Latn': 'DevTools har desktop browser mein mojood ek toolbox hai jo F12 dabane se khulta hai. Tester ko code theek nahi karna hota balke saboot (evidence) jama karna hota hai ke kharabi kahan hai. Elements mein page ka asli HTML aur CSS nazar aata hai, Console mein woh errors dikhte hain jo user ko nazar nahi aate, Network mein har request ka status, time aur data hota hai, aur Application mein cookies aur localStorage. Misaal: “Place order” dabane par kuch nahi hua; Network mein dekha to POST /api/orders ne 504 wapas kiya. Ab bug report mein endpoint, status, time aur screenshot lagayein. HAR file share karne se pehle us mein se tokens aur personal maloomat zaroor hata dein.',
      'hi': 'DevTools हर desktop browser में मौजूद एक toolbox है, जो F12 दबाने पर खुलता है। Tester को code ठीक नहीं करना होता, बल्कि सबूत (evidence) इकट्ठा करना होता है कि गड़बड़ी कहाँ है। Elements में पेज का असली HTML और CSS दिखता है, Console में वे errors दिखते हैं जो user को नज़र नहीं आते, Network में हर request का status, समय और data होता है, और Application में cookies और localStorage। उदाहरण: “Place order” दबाने पर कुछ नहीं हुआ; Network में देखा तो POST /api/orders ने 504 लौटाया। अब bug report में endpoint, status, समय और screenshot जोड़ें। HAR फ़ाइल share करने से पहले उसमें से tokens और निजी जानकारी ज़रूर हटा दें।',
      'ar': 'أدوات المطوّر (DevTools) صندوق أدوات مدمج في كل متصفح مكتبي، ويُفتح بالضغط على F12. ليست مهمة المختبِر إصلاح الكود، بل جمع الأدلة (evidence) التي تحدّد مكان الخلل. تبويب Elements يعرض HTML وCSS الفعليين للصفحة، وConsole يعرض الأخطاء التي لا يراها المستخدم، وNetwork يعرض حالة كل طلب (status) وزمنه وبياناته، وApplication يعرض ملفات cookies وlocalStorage. مثال: ضغطتَ «Place order» ولم يحدث شيء، فوجدتَ في Network أن الطلب POST /api/orders أعاد الرمز 504. أرفِق في تقرير الخلل الـ endpoint والحالة والوقت ولقطة شاشة. وقبل مشاركة ملف HAR احذف منه الـ tokens والبيانات الشخصية.',
      'es': 'Las DevTools son una caja de herramientas incluida en todo navegador de escritorio; se abren con F12. El trabajo del tester no es arreglar código, sino reunir evidencias que muestren dónde está el fallo. Elements muestra el HTML y el CSS reales de la página, Console muestra errores que el usuario no ve, Network muestra el estado (status), el tiempo y los datos de cada petición, y Application muestra las cookies y el localStorage. Ejemplo: pulsas «Place order» y no pasa nada; en Network ves que POST /api/orders devolvió un 504. En el informe de defecto adjunta el endpoint, el estado, la hora y una captura. Antes de compartir un archivo HAR, elimina los tokens y los datos personales.'
    },
    keyTerms: [
      { term: 'DevTools', def: 'Tools built into desktop browsers for inspecting a page, its code, its network traffic and its stored data.' },
      { term: 'Accessibility tree', def: 'The browser’s simplified view of the page (roles, names, states) that screen readers and other assistive technology use.' },
      { term: 'Preserve log', def: 'Network panel option that keeps recorded requests when the page navigates or redirects.' },
      { term: 'Throttling', def: 'Simulating slower or offline network conditions inside the browser. Useful, but not the same as a real weak network.' },
      { term: 'HAR file', def: 'HTTP Archive: a JSON export of recorded network traffic, including headers and often bodies. It may contain secrets.' }
    ],
    practice: [
      { q: 'A “Download invoice” link opens a blank page. Which two panels would you check first, and what would you look for?', answer: '<b>Network</b>: is there a request for the invoice, what status did it return (404, 403, 500?) and what Content-Type came back? <b>Console</b>: any JavaScript error or blocked pop-up message. Together they show whether the server failed, the file was missing, or the front-end never asked for it.' },
      { q: 'How would you use DevTools to test what happens when a session expires while a user is filling a long form?', hint: 'You do not need to wait 30 minutes.', answer: 'Fill most of the form, then in <b>Application → Cookies</b> delete the session cookie (or clear site data). Submit. Expect a clear “session expired” message, a way to sign in again, and ideally the entered data kept. Watch <b>Network</b> for the 401 and check the app does not fail silently or throw the data away.' },
      { q: 'Search shows “No results” for a product that exists. What Network-panel evidence would you add to the bug report?', answer: 'The exact request (e.g. <code>GET /api/search?q=tote%20bag</code>), its status and the response body (for example <code>{"results": []}</code>). That shows whether the UI sent the wrong query (bad encoding, trimmed text) or the server returned nothing for a correct query. Add a screenshot, the time and a sanitized HAR.' }
    ],
    quiz: [
      { q: 'You click Apply coupon and nothing visible happens. Which panel best shows whether a request was actually sent to the server?', options: ['Elements, by checking the coupon field markup', 'Application, by checking the stored cookies', 'Network, filtered to Fetch/XHR', 'Lighthouse, by running a performance audit'], correct: 2,
        why: ['Elements shows structure and styles, not traffic.', 'Cookies may change after a request, but storage does not show whether a call was made.', 'Right — the Network panel lists every request with its status and response.', 'Lighthouse audits page quality; it does not record the request your click made.'] },
      { q: 'You tick Disable cache in the Network panel, then close DevTools and keep testing. What happens to caching?', options: ['It resumes, as the setting only applies while DevTools is open', 'It remains off for all sites until you go back and untick the box', 'Every cached file on your computer is permanently deleted', 'Only cookies are blocked until the browser is restarted'], correct: 0,
        why: ['Right — Disable cache is a DevTools setting; with DevTools closed, the normal cache is used again.', 'The setting is tied to DevTools being open, not a permanent browser preference.', 'Disable cache bypasses the cache; it does not delete it.', 'It has nothing to do with cookies.'] },
      { q: 'Login posts to /login and then redirects to /dashboard. The login request vanishes from the Network list after the redirect. What should you turn on?', options: ['Disable cache', 'Offline throttling', 'The device toolbar', 'Preserve log'], correct: 3,
        why: ['Disable cache changes what is fetched, not what stays in the list.', 'Offline mode would block the login entirely.', 'The device toolbar emulates screen sizes; it does not keep requests.', 'Right — Preserve log keeps requests across navigations and redirects.'] },
      { q: 'What should you do before attaching a HAR file to a shared bug ticket?', options: ['Compress it so that it fits under the tracker’s size limit', 'Remove or mask cookies, tokens and personal data in it', 'Convert it to screenshots so developers can read it', 'Nothing — HAR files only contain timing information'], correct: 1,
        why: ['Size may matter, but the main risk is leaking secrets.', 'Right — HAR files can include session cookies, auth headers and personal data; sanitize them or use test accounts.', 'Developers can import a HAR into DevTools; screenshots lose the detail.', 'HAR files include headers and often request and response bodies, not just timing.'] },
      { q: 'A page looks perfect in Chrome’s device toolbar using an iPhone preset. What can you conclude?', options: ['Only that the layout fits that viewport in Chrome; real iPhone Safari is untested', 'The page is verified for iPhone users, so Safari checks can be skipped', 'The page will look the same on every Android phone as well', 'Touch gestures and scrolling performance are confirmed for iPhone'], correct: 0,
        why: ['Right — the device toolbar changes size and user agent but still renders with Chrome’s Blink engine, not Safari’s WebKit.', 'Emulation is not Safari; WebKit-specific bugs would be missed.', 'Android devices vary in browser, screen and OS version; one preset proves nothing about them.', 'Emulation does not reproduce real touch hardware or device performance.'] }
    ],
    interview: [
      { q: 'How do you use browser DevTools when testing a web application?', a: 'I keep DevTools open while testing important flows. The <b>Console</b> shows JavaScript errors users never see. The <b>Network</b> panel shows each request’s status, payload, response and timing, so I can tell whether the front-end failed to send something or the server returned an error. In <b>Application</b> I check cookies and storage — for example that logout clears the session. I use throttling and the device toolbar for quick checks, knowing they are simulations. For bug reports I attach the failing request, a screenshot, the time and a sanitized HAR, which helps developers reproduce issues quickly.' },
      { q: 'A user says a page is slow. What would you check in the Network panel?', a: 'I reload with Disable cache to see a first-visit load, then sort by time and size. The <b>Timing</b> breakdown shows whether a request spends its time waiting for the server (slow backend) or downloading (large file). I look for very large images or scripts, long chains of requests that wait on each other, failed requests being retried, and slow API calls. I compare with throttling to see the experience on a slower connection, and I report concrete numbers — endpoint, size, duration — rather than “it feels slow”.' }
    ],
    takeaways: [
      'Keep DevTools open while testing — the Console and Network panels show failures users never see.',
      'The Network panel tells you whether the client sent a request and what the server answered.',
      'Use Preserve log for redirects; Disable cache works only while DevTools is open.',
      'Throttling and device emulation are fast simulations, not real networks or devices.',
      'Attach exact requests, screenshots, times and sanitized HAR files to bug reports.'
    ],
    links: { labs: ['login', 'ui'], challenges: ['peopleops-login'], interview: ['m2'] }
  },
  /* ------------------------------------------------------------------ 3 */
  {
    id: 'wm-forms-ui',
    n: 3,
    level: 'beginner',
    title: 'Testing forms, inputs and UI components',
    summary: 'Test fields, validation messages, keyboard use and tricky widgets so forms accept good data, reject bad data helpfully and never submit twice.',
    minutes: 20,
    objectives: [
      'Design validation tests for required, format and length rules',
      'Explain why client-side validation never replaces server-side checks',
      'Test a form with the keyboard only, including tab order and focus',
      'Probe widgets and edge inputs: date pickers, uploads, double-submit, paste, emoji and very long text'
    ],
    body: [
      { t: 'p', html: 'Forms are where users hand data to the system — sign-ups, payments, leave requests, uploads. They are also where many defects hide, because every field has rules, every rule can be implemented in several places, and users type things nobody expected. A good form test checks three things: <b>valid data is accepted and saved correctly</b>, <b>invalid data is rejected with a helpful message</b>, and <b>the form works for every kind of user</b>, including keyboard and screen-reader users.' },
      { t: 'h', text: 'Field validation rules and the tests they need' },
      { t: 'table', caption: 'PeopleOps sign-up and leave forms', head: ['Rule', 'Example', 'Tests to include'], rows: [
        ['Required', 'Work email is required', 'Empty; only spaces; a value cleared again after the error appears'],
        ['Format', 'Email must look like name@domain', '<code>sam@peopleops.example</code>; missing @; two @; spaces; uppercase; a plus address such as <code>sam+qa@peopleops.example</code>'],
        ['Length', 'Display name 2–40 characters', '1, 2, 40 and 41 characters; leading and trailing spaces; does the limit count characters or bytes?'],
        ['Range / allowed values', 'Leave days 0.5–30 in steps of 0.5', '0, 0.5, 30, 30.5, 0.25, a negative number, text'],
        ['Cross-field', 'End date not before start date', 'Same day; end one day earlier; dates across a month or year end']
      ] },
      { t: 'compare', a: { title: 'Client-side validation (browser)', items: ['Instant feedback while the user types', 'HTML attributes such as <code>required</code>, <code>maxlength</code> and <code>type="email"</code>, plus JavaScript checks', 'Improves <b>usability</b>, not security', 'Easily bypassed: DevTools, disabled JavaScript, direct API calls'] }, b: { title: 'Server-side validation (API)', items: ['Runs on every request, whatever client sent it', 'Enforces the real business rules and protects the database', 'The actual <b>control</b> — it must exist even when the UI checks too', 'Test it by sending invalid data straight to the API'] } },
      { t: 'callout', tone: 'warn', title: 'maxlength is not a limit', html: 'A <code>maxlength="40"</code> attribute stops typing at 40 characters in the browser, but the API may still accept 5,000. Remove the attribute in the Elements panel or send the request directly, then check the server rejects it with a clear 4xx error — not a 500, and not silent truncation of the user’s data.' },
      { t: 'h', text: 'Error messages users can act on' },
      { t: 'list', items: [
        'Say <b>what is wrong and how to fix it</b>: “Enter an end date on or after 1 March 2026”, not “Invalid input”.',
        'Appear <b>next to the field</b> and are linked to it, so screen readers announce them.',
        'Do not rely on colour alone — a red border needs text with it.',
        'Keep the user’s other entries; never clear the whole form because one field failed.',
        'Do not leak information: “No account with this email” on a login page lets attackers discover which emails are registered.',
        'Match between the UI and the API, and in every supported language.'
      ] },
      { t: 'h', text: 'Keyboard-only use, tab order and focus' },
      { t: 'p', html: 'Put the mouse aside and complete the form with <kbd>Tab</kbd>, <kbd>Shift</kbd>+<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd> and the arrow keys. The <b>tab order</b> should follow the visual order, and every interactive element needs a <b>visible focus indicator</b>. After a failed submit, focus should move to the first error or to an error summary. Dialogs should keep focus inside while open and return it to the button that opened them when closed. If you can Tab into a widget but not out of it, that is a <b>keyboard trap</b> — a serious accessibility defect.' },
      { t: 'cards', items: [
        { title: 'Dropdowns and comboboxes', html: 'Keyboard selection, type-ahead, very long option lists, the empty or default option, and what is actually submitted (the value, not just the visible label).' },
        { title: 'Date pickers', html: 'Typing versus picking, impossible dates (31 April, 29 February in a non-leap year), min and max dates, locale formats and time zones.' },
        { title: 'File uploads', html: 'Allowed types; size just under, at and over the limit; a renamed file with the wrong content; zero-byte files; long or non-Latin file names; cancel and retry.' },
        { title: 'Checkboxes, radios, toggles', html: 'Default state, clicking the label selects the control, “at least one” rules, and state kept after a validation error.' }
      ] },
      { t: 'h', text: 'Inputs that break forms' },
      { t: 'table', head: ['Input', 'Why it matters', 'What to verify'], rows: [
        ['Double-click / double-submit', 'Two requests can create two orders or payments', 'The button disables after the first click <b>and</b> the server rejects or merges the duplicate'],
        ['Autofill and password managers', 'Values filled without key presses can skip validation logic', 'Validation and button states update; the right fields are filled (correct <code>autocomplete</code> attributes)'],
        ['Copy-paste', 'Pasted text can carry leading or trailing spaces and line breaks', 'Spaces trimmed where sensible; paste allowed in password and confirmation fields'],
        ['Special characters', "Apostrophes, quotes, <code>&lt;</code> and <code>&amp;</code> can break queries or HTML", "A name such as <code>O'Brien</code> saves and displays correctly; <code>&lt;b&gt;</code> shows as text, not bold"],
        ['Emoji and non-Latin text', 'Many emoji are stored as 4-byte characters; scripts such as Urdu run right to left', 'Text saves and displays unchanged everywhere it appears; length counts are sensible'],
        ['Very long input', 'Overflows layouts, database columns and logs', 'A clear limit message, no broken layout, no 500 from the server']
      ] }
    ],
    example: {
      title: 'Worked example: the PeopleOps leave request form',
      blocks: [
        { t: 'p', html: 'The form has <b>Leave type</b> (dropdown, required), <b>Start date</b> and <b>End date</b> (date pickers; end must be on or after start), <b>Reason</b> (optional, max 500 characters), <b>Attachment</b> (PDF or JPG, max 5 MB) and <b>Submit</b>. The tester has 30 minutes.' },
        { t: 'table', head: ['Test idea', 'Expected result'], rows: [
          ['Submit the empty form', 'Errors on Leave type and both dates; focus moves to the first error; Reason is not flagged'],
          ['End date one day before start date', '“End date must be on or after the start date”, shown next to End date'],
          ['Reason with 500 and 501 characters, including pasted line breaks', '500 accepted; 501 blocked or rejected with a message; line breaks handled consistently'],
          ['Attachments of 4.9 MB, 5 MB and 5.1 MB; an .exe renamed to .pdf', 'At or under the limit accepted, over the limit rejected with a size message; renamed file rejected by the server'],
          ['Double-click Submit with the network throttled', 'Exactly one leave request is created'],
          ['Complete everything with the keyboard only', 'Logical tab order, visible focus, date picker usable without a mouse']
        ] },
        { t: 'p', html: 'Most ideas come from the <b>rules</b> (required, range, size) and the rest from <b>how people really behave</b> (pasting, double-clicking, keyboard use). One question to ask the team: does “5 MB” mean 5,000,000 or 5,242,880 bytes? You can practise the same thinking on the form and table in the UI lab.' }
      ]
    },
    explain: {
      'ur': 'فارم ٹیسٹ کرتے وقت تین باتیں دیکھیں: صحیح data قبول ہو کر درست save ہو، غلط data واضح اور مددگار پیغام کے ساتھ رد ہو، اور فارم ہر قسم کے صارف کے لیے کام کرے۔ ہر field کے rules چیک کریں: required، format (جیسے email) اور length۔ یاد رکھیں: browser والی validation صرف سہولت ہے، اصل حفاظت سرور کی validation ہے، کیونکہ API کو براہِ راست بھی request بھیجی جا سکتی ہے۔ مثال: اگر نام کی حد 40 حروف ہے تو 40 اور 41 حروف ٹیسٹ کریں، اور 41 حروف API پر بھی بھیجیں۔ پھر mouse چھوڑ کر صرف keyboard سے فارم مکمل کریں، اور Submit پر دو بار کلک کر کے دیکھیں کہ کہیں دو orders تو نہیں بن گئے۔',
      'ur-Latn': 'Form test karte waqt teen baatein dekhein: sahi data accept ho kar durust save ho, ghalat data wazeh aur madadgaar message ke saath reject ho, aur form har qisam ke user ke liye kaam kare. Har field ke rules check karein: required, format (jaise email) aur length. Yaad rakhein: browser wali validation sirf sahulat hai, asal hifazat server ki validation hai, kyun ke API ko seedha bhi request bheji ja sakti hai. Misaal: agar naam ki limit 40 characters hai to 40 aur 41 characters test karein, aur 41 characters API par bhi bhejein. Phir mouse chor kar sirf keyboard se form mukammal karein, aur Submit par do baar click kar ke dekhein ke kahin do orders to nahi ban gaye.',
      'hi': 'फ़ॉर्म test करते समय तीन बातें देखें: सही data स्वीकार होकर ठीक से save हो, ग़लत data साफ़ और मददगार संदेश के साथ अस्वीकार हो, और फ़ॉर्म हर तरह के user के लिए काम करे। हर field के rules जाँचें: required, format (जैसे email) और length। याद रखें: browser वाली validation सिर्फ़ सुविधा है, असली सुरक्षा server की validation है, क्योंकि API को सीधे भी request भेजी जा सकती है। उदाहरण: अगर नाम की सीमा 40 characters है, तो 40 और 41 characters test करें, और 41 characters API पर भी भेजें। फिर mouse छोड़कर सिर्फ़ keyboard से फ़ॉर्म पूरा करें, और Submit पर दो बार click करके देखें कि कहीं दो orders तो नहीं बन गए।',
      'ar': 'عند اختبار النماذج (forms) تحقّق من ثلاثة أمور: أن البيانات الصحيحة تُقبل وتُحفَظ بدقة، وأن البيانات الخاطئة تُرفض برسالة واضحة تساعد المستخدم، وأن النموذج يعمل مع جميع المستخدمين. افحص قواعد كل حقل: الإلزامية (required) والصيغة (format) مثل البريد الإلكتروني والطول (length). وتذكّر أن التحقق في المتصفح مجرد تسهيل، أما الحماية الحقيقية فهي التحقق في الخادم، لأن أي شخص يستطيع إرسال طلب إلى الـ API مباشرة. مثال: إذا كان الحد الأقصى للاسم 40 حرفًا فاختبر 40 و41 حرفًا، وأرسل الـ 41 إلى الـ API أيضًا. ثم أكمِل النموذج بلوحة المفاتيح وحدها، واضغط زر الإرسال مرتين لتتأكد من عدم إنشاء طلبين.',
      'es': 'Al probar un formulario, comprueba tres cosas: que los datos válidos se aceptan y se guardan bien, que los datos inválidos se rechazan con un mensaje claro y útil, y que el formulario funciona para todo tipo de usuarios. Revisa las reglas de cada campo: obligatorio (required), formato (por ejemplo, email) y longitud. Recuerda que la validación del navegador es solo una comodidad; la protección real es la validación del servidor, porque cualquiera puede enviar una petición directamente a la API. Ejemplo: si el nombre admite como máximo 40 caracteres, prueba 40 y 41, y envía también los 41 a la API. Después completa el formulario solo con el teclado y pulsa Enviar dos veces para comprobar que no se crean dos pedidos.'
    },
    keyTerms: [
      { term: 'Client-side validation', def: 'Checks run in the browser (HTML attributes, JavaScript) for instant feedback. Helpful for users, but easy to bypass.' },
      { term: 'Server-side validation', def: 'Checks the server runs on every request. The real control that protects data, whatever client sent the request.' },
      { term: 'Tab order', def: 'The sequence in which the Tab key moves focus through interactive elements. It should match the visual reading order.' },
      { term: 'Keyboard trap', def: 'A component that keyboard focus can enter but not leave — a serious accessibility defect.' },
      { term: 'Idempotency', def: 'Sending the same request again has the same effect as sending it once — the server-side defence against double submits.' }
    ],
    practice: [
      { q: 'A <b>PayLite</b> sign-up form has a mobile number field: 11 digits, starting with 03. List six inputs you would try.', hint: 'Mix boundaries, formats and real user habits.', answer: 'Valid: <code>03001234567</code>. Boundaries: 10 and 12 digits. Format: starting with 04, letters mixed in, the number with a space or dash (accepted and normalised, or a clear message?), the international form <code>+923001234567</code> (accepted, or clearly explained?). Required: empty and spaces only. Also paste a number with a trailing space and check it is trimmed.' },
      { q: 'How would you prove that a “Pay now” button cannot create two payments?', hint: 'There are two layers to test.', answer: '<b>UI:</b> throttle the network, then double-click and press Enter twice — the button should disable or show progress after the first action. <b>Server:</b> replay the same request twice (from the Network panel or an API tool) and confirm only one payment exists, ideally because the API uses an idempotency key or rejects the duplicate. Check the payment list and the balance, not just the response codes.' },
      { q: 'Write three quick checks for the error message shown when a password is too short.', answer: 'It states the rule (“Use at least 8 characters”) instead of “Invalid password”. It appears next to the password field and is announced by a screen reader because it is linked to the field. It keeps the other fields filled and uses text, not only a red border.' },
      { q: 'Which special inputs would you try in a “Full name” field, and why?', answer: "<code>O'Brien</code> (an apostrophe can break SQL or JavaScript strings), <code>Zoë</code> and <code>محمد علی</code> (non-ASCII and right-to-left text), an emoji (4-byte characters), <code>&lt;b&gt;Sam&lt;/b&gt;</code> (should display as text, not bold — bold would hint at an injection risk), leading and trailing spaces, and 255+ characters. Each one checks a different layer: input, storage or display." }
    ],
    quiz: [
      { q: 'A sign-up form blocks typing more than 40 characters in the name field. What does this prove about the 40-character rule?', options: ['The rule is fully enforced, so no further testing is needed', 'The database column must be exactly 40 characters long', 'The server must already reject longer names', 'Only that the browser stops typing; test the server too'], correct: 3,
        why: ['A browser attribute such as maxlength can be removed or bypassed with a direct request.', 'The UI limit tells you nothing about the database schema.', 'Client and server checks are separate code; one does not imply the other.', 'Right — client-side limits are a usability feature. Send 41+ characters to the API and check they are rejected cleanly.'] },
      { q: 'Which error message is best for a date of birth entered as 31/02/2001?', options: ['“Invalid input. Please check all of the form and try again.”', '“February has only 28 or 29 days — enter a real date.”', '“Error 400: date_of_birth failed to parse.”', '“Something went wrong — please contact support.”'], correct: 1,
        why: ['Generic — the user still does not know which field is wrong or how to fix it.', 'Right — it says what is wrong and how to fix it, in plain language.', 'Technical wording helps developers, not users, and gives no guidance.', 'It sends the user away for a problem they could fix themselves.'] },
      { q: 'Testing with the keyboard only, you can Tab into a chat widget but cannot Tab or Escape out of it. What is this?', options: ['Expected behaviour for embedded widgets', 'A cosmetic issue with low severity', 'A keyboard trap — a serious accessibility defect', 'A tab-order issue that only affects users with a mouse'], correct: 2,
        why: ['Third-party widgets must still let keyboard users leave; embedding is no excuse.', 'Keyboard users get stuck and cannot finish the task — high impact, not cosmetic.', 'Right — focus can enter but not leave, which blocks keyboard users and many assistive-technology users.', 'Tab order does not affect mouse users; it affects keyboard users.'] },
      { q: 'On a slow connection, a user double-clicks Place order. Which result shows the system is correctly protected?', options: ['One order: the button disabled itself and the server rejected the repeat', 'Two orders are created, but the user is able to cancel one of them later', 'One order exists, but only because the second click happened to arrive late', 'An error page appears and no order is created for the customer at all'], correct: 0,
        why: ['Right — protection on both layers: the UI prevents most repeats and the server makes duplicates harmless.', 'Duplicate orders are a defect; relying on users to clean up is not protection.', 'Luck is not protection; the next user may click faster.', 'Blocking a legitimate order is a different defect, not correct handling.'] },
      { q: 'After saving the name “Ayesha 😀”, the profile page shows “Ayesha ??”. Which layer should you suspect first?', options: ['The CSS font size used on the profile page', 'The client-side length validation on the field', 'The browser’s autofill feature filling the form', 'Text encoding or storage of 4-byte characters'], correct: 3,
        why: ['Font size changes how big text looks, not which characters are stored.', 'A length rule would reject or trim the input, not replace characters with question marks.', 'Autofill did not insert the emoji; the user typed it.', 'Right — question marks usually mean the character was lost in encoding or storage, for example a MySQL column using the 3-byte utf8 (utf8mb3) character set instead of utf8mb4.'] }
    ],
    interview: [
      { q: 'How would you test a registration form?', a: 'I start from the rules for each field — required, format, length, allowed values and cross-field rules such as matching passwords — and use equivalence partitions and boundaries to pick inputs. I check that valid data is saved correctly (I read it back rather than trusting the success message), that invalid data gives clear messages next to the field, and that the <b>server</b> rejects invalid data sent directly to the API. Then I test behaviour: keyboard-only use, focus after errors, double-submit, autofill, paste, special characters, emoji and very long input. Finally I check an already-registered email and the confirmation step.' },
      { q: 'Why is client-side validation not enough?', a: 'Client-side validation runs in the user’s browser, which the user controls. Anyone can remove a <code>maxlength</code> in DevTools, disable JavaScript or call the API directly with a script. So client-side checks are a <b>usability</b> feature — fast feedback — while server-side validation is the real <b>control</b> that protects data and business rules. I verify both: the UI message for a good experience, and a direct API request with invalid data to confirm a clean 4xx response and that nothing was saved.' }
    ],
    takeaways: [
      'Test every rule from both sides: valid data accepted and saved, invalid data rejected helpfully.',
      'Client-side validation is for usability; the server must enforce every rule.',
      'Complete important forms with the keyboard only — logical tab order, visible focus, no traps.',
      'Double-submit needs two defences: a disabled button and a server-side duplicate check.',
      'Paste, autofill, apostrophes, emoji and very long input break forms that only saw “happy” data.'
    ],
    links: { labs: ['ui', 'login'], challenges: ['ui-interactions'], interview: ['m1', 'a5'] }
  },
  /* ------------------------------------------------------------------ 4 */
  {
    id: 'wm-cross-browser',
    n: 4,
    level: 'intermediate',
    title: 'Cross-browser and responsive testing',
    summary: 'Choose browsers and viewports from analytics and risk, then check layout, overflow and interactions across engines, sizes, zoom and orientation.',
    minutes: 22,
    objectives: [
      'Explain why rendering engines (Blink, WebKit, Gecko) matter more than browser brands',
      'Build a tiered compatibility matrix from analytics and risk',
      'Test breakpoints, zoom, text scaling and orientation systematically',
      'Recognise what emulation can and cannot show'
    ],
    body: [
      { t: 'p', html: 'Users open the same page in different browsers, on different devices, at different sizes. The HTML and CSS are identical, but each browser’s <b>rendering engine</b> interprets them slightly differently, and each screen gives the layout a different amount of room. <b>Cross-browser testing</b> checks the product works in the browsers you support; <b>responsive testing</b> checks the layout adapts across screen sizes. Neither means “test everything everywhere” — both mean choosing wisely and checking the right things.' },
      { t: 'table', caption: 'Think in engines first, then browsers', head: ['Engine', 'Main browsers', 'Tester notes'], rows: [
        ['<b>Blink</b>', 'Chrome, Edge, Opera, Samsung Internet and other Chromium-based browsers', 'One Blink browser covers much of the rendering, but browsers still differ in version, settings and built-in features'],
        ['<b>WebKit</b>', 'Safari on macOS and iOS', 'iOS browsers have historically been required to use WebKit, so Chrome on an iPhone behaves much like Safari'],
        ['<b>Gecko</b>', 'Firefox', 'A separate engine with its own form controls, font rendering and feature support']
      ] },
      { t: 'h', text: 'Building a compatibility matrix' },
      { t: 'p', html: 'Start from <b>your own product’s analytics</b>: which browsers, versions, operating systems and screen sizes real users have. Combine that with <b>risk</b>: which journeys earn money or carry legal weight, which customers are contractually supported, and where defects have appeared before. Then give each combination a <b>tier</b> that sets how deeply it is tested. The figures below are illustrative for the fictional MediBook clinic app — use your own data, because audiences differ widely by country and product.' },
      { t: 'table', caption: 'Example matrix for MediBook (illustrative analytics, not market data)', head: ['Browser / platform', 'Share of MediBook sessions', 'Tier', 'Coverage each release'], rows: [
        ['Chrome on Android', '48%', '1', 'Full regression on real devices'],
        ['Safari on iPhone', '27%', '1', 'Full regression on real devices'],
        ['Chrome on Windows', '14%', '1', 'Full regression'],
        ['Edge on Windows', '5%', '2', 'Critical journeys: sign-in, booking, payment'],
        ['Firefox on Windows', '3%', '2', 'Critical journeys'],
        ['Samsung Internet', '2%', '3', 'Smoke test; fix reported issues by severity'],
        ['Everything else', '1%', '—', 'Not formally supported; investigate reports']
      ] },
      { t: 'callout', tone: 'tip', title: 'Matrix rules of thumb', html: 'Include at least one browser per engine your users actually have. Cover the <b>oldest supported version</b> as well as the newest. Revisit the matrix regularly as analytics change. And write down what is <b>not</b> covered — a known gap is a risk decision; an unknown gap is a surprise.' },
      { t: 'h', text: 'Breakpoints, viewports, zoom and orientation' },
      { t: 'p', html: 'Responsive layouts switch at <b>breakpoints</b> — widths where CSS media queries change the layout. Bugs hide just either side of them, so ask developers for the real breakpoints and test at, just below and just above each one: boundary value analysis applied to width. Then drag the window slowly from wide to narrow. Content should reflow smoothly, with no jumps or overlaps at in-between sizes that no device preset uses. The viewport meta tag below is what makes phones lay the page out at their real width.' },
      { t: 'code', lang: 'text', title: 'A breakpoint to test at 767, 768 and 769 px', code: `<meta name="viewport" content="width=device-width, initial-scale=1">

/* One column by default; two columns from 768 px wide */
@media (min-width: 768px) {
  .booking { display: grid; grid-template-columns: 1fr 1fr; }
}` },
      { t: 'list', items: [
        '<b>Zoom to 200%</b>: text and controls stay usable, nothing is clipped or overlapping (WCAG 1.4.4 Resize Text).',
        '<b>Reflow at 320 CSS px wide</b> (e.g. a 1280 px window at 400% zoom): normal content fits without sideways scrolling; maps and data tables may be exceptions (WCAG 1.4.10).',
        '<b>Larger default text size</b> in browser or OS settings: labels wrap instead of being cut off.',
        '<b>Orientation</b>: rotate between portrait and landscape mid-task — entered data stays, dialogs and the on-screen keyboard still fit.',
        '<b>Touch vs mouse</b>: hover-only menus need a tap or keyboard alternative, and tap targets must be large enough.'
      ] },
      { t: 'compare', a: { title: 'Layout checks', items: ['Nothing overlaps, is clipped or overflows its container', 'No horizontal scroll bar on normal pages', 'Images scale without distortion; long words and URLs wrap', 'Sticky headers, footers and banners do not cover content or buttons', 'Navigation collapses into a usable menu on small screens'] }, b: { title: 'Interaction checks', items: ['Menus, dropdowns and date pickers open and close correctly', 'Forms still work with the on-screen keyboard showing', 'Hover-only features have a touch alternative', 'Scrolling inside dialogs and carousels works', 'Native controls (date, file, select) behave as expected in each engine'] } },
      { t: 'callout', tone: 'warn', title: 'What emulation cannot tell you', html: 'Resizing a desktop window or using the device toolbar checks <b>layout at a size</b>. It does not reproduce Safari’s WebKit engine, real touch and scrolling, the on-screen keyboard pushing content up, device performance or manufacturer browser quirks. Use emulation for breadth during development, and real browsers and devices (or a device cloud) for tier-1 combinations before release.' },
      { t: 'p', html: 'When you find a difference, isolate it: same page, same data, two browsers side by side. Note the engine and version, viewport size and zoom level, and attach screenshots of both. “Broken on mobile” is not a bug report; “At 375 px wide in Safari on iOS, the Confirm button is hidden behind the sticky cookie banner” is.' }
    ],
    example: {
      title: 'Worked example: MediBook’s booking page across the matrix',
      blocks: [
        { t: 'p', html: 'The team has one day to check a redesigned booking page before release. The tester follows the matrix above instead of grabbing whatever devices are nearby.' },
        { t: 'table', head: ['Combination', 'Finding', 'Action'], rows: [
          ['Chrome on Android, 360 × 800', 'Time-slot buttons wrap neatly; booking completes', 'Pass'],
          ['Safari on a real iPhone', 'After picking a slot, the summary shows “Invalid Date”', 'Bug — date strings parsed differently in WebKit; high severity'],
          ['Chrome desktop at 767, 768 and 769 px', 'At exactly 768 px the summary panel overlaps the form', 'Bug at the breakpoint; screenshot at the exact width'],
          ['Firefox on Windows', 'Custom dropdown arrow missing; still usable', 'Low-severity cosmetic bug'],
          ['Chrome desktop at 200% zoom', '“Confirm booking” is clipped to “Confirm boo…”', 'Accessibility bug (WCAG 1.4.4)']
        ] },
        { t: 'p', html: 'Two of the four bugs would have been missed by checking only Chrome at common device sizes. The Safari date bug is exactly what emulation hides: the device toolbar would have run Chrome’s engine and shown a correct date.' }
      ]
    },
    explain: {
      'ur': 'ایک ہی ویب صفحہ مختلف browsers میں تھوڑا مختلف نظر آ سکتا ہے، کیونکہ ہر browser کا rendering engine الگ ہوتا ہے: Chrome اور Edge میں Blink، Safari میں WebKit اور Firefox میں Gecko۔ سب کچھ ہر جگہ ٹیسٹ کرنا ممکن نہیں، اس لیے اپنے analytics اور risk کی بنیاد پر ایک compatibility matrix بنائیں: کن browsers پر مکمل testing ہو گی اور کن پر صرف اہم journeys۔ Responsive testing میں breakpoints کے بالکل آس پاس چیک کریں۔ مثال: اگر layout 768px پر بدلتا ہے تو 767، 768 اور 769 پر دیکھیں کہ کچھ ایک دوسرے پر چڑھا یا کٹا ہوا تو نہیں۔ یاد رکھیں: Chrome کے device toolbar میں iPhone والا preset اصل Safari نہیں ہوتا۔',
      'ur-Latn': 'Ek hi web page mukhtalif browsers mein thora mukhtalif nazar aa sakta hai, kyun ke har browser ka rendering engine alag hota hai: Chrome aur Edge mein Blink, Safari mein WebKit aur Firefox mein Gecko. Sab kuch har jagah test karna mumkin nahi, is liye apne analytics aur risk ki buniyad par ek compatibility matrix banayein: kin browsers par full testing hogi aur kin par sirf important journeys. Responsive testing mein breakpoints ke bilkul aas paas check karein. Misaal: agar layout 768px par badalta hai to 767, 768 aur 769 par dekhein ke kuch overlap ya kata hua to nahi. Yaad rakhein: Chrome ke device toolbar mein iPhone wala preset asal Safari nahi hota.',
      'hi': 'एक ही वेब पेज अलग-अलग browsers में थोड़ा अलग दिख सकता है, क्योंकि हर browser का rendering engine अलग होता है: Chrome और Edge में Blink, Safari में WebKit और Firefox में Gecko। सब कुछ हर जगह test करना संभव नहीं, इसलिए अपने analytics और risk के आधार पर एक compatibility matrix बनाएँ: किन browsers पर पूरी testing होगी और किन पर सिर्फ़ ज़रूरी journeys। Responsive testing में breakpoints के ठीक आसपास जाँच करें। उदाहरण: अगर layout 768px पर बदलता है, तो 767, 768 और 769 पर देखें कि कुछ overlap या कटा हुआ तो नहीं। याद रखें: Chrome के device toolbar में iPhone वाला preset असली Safari नहीं होता।',
      'ar': 'قد تبدو صفحة الويب نفسها مختلفة قليلًا من متصفح إلى آخر، لأن لكل متصفح محرّك عرض (rendering engine) خاصًا به: Blink في Chrome وEdge، وWebKit في Safari، وGecko في Firefox. لا يمكن اختبار كل شيء في كل مكان، لذلك ابنِ مصفوفة توافق (compatibility matrix) اعتمادًا على بيانات الاستخدام (analytics) والمخاطر: ما المتصفحات التي تحصل على اختبار كامل، وما التي تكفيها الرحلات الأساسية فقط. وفي الاختبار المتجاوب (responsive) افحص ما حول نقاط التحوّل (breakpoints) تمامًا. مثال: إذا تغيّر التصميم عند 768px فاختبر 767 و768 و769 وتأكد من عدم تداخل العناصر أو قصّها. وتذكّر أن إعداد iPhone في أداة Device toolbar داخل Chrome ليس Safari الحقيقي.',
      'es': 'Una misma página web puede verse un poco distinta en cada navegador, porque cada uno usa su propio motor de renderizado (rendering engine): Blink en Chrome y Edge, WebKit en Safari y Gecko en Firefox. Es imposible probarlo todo en todas partes, así que crea una matriz de compatibilidad basada en tus analíticas y en el riesgo: qué navegadores reciben pruebas completas y cuáles solo los recorridos críticos. En las pruebas responsive, revisa justo alrededor de los breakpoints. Ejemplo: si el diseño cambia a 768 px, prueba 767, 768 y 769 y comprueba que nada se solape ni se corte. Recuerda: el preset de iPhone en el device toolbar de Chrome no es Safari real.'
    },
    keyTerms: [
      { term: 'Rendering engine', def: 'The part of a browser that turns HTML and CSS into pixels: Blink (Chrome, Edge), WebKit (Safari), Gecko (Firefox).' },
      { term: 'Compatibility matrix', def: 'A table of supported browser, OS and device combinations with a test depth (tier) for each, based on usage data and risk.' },
      { term: 'Breakpoint', def: 'A viewport width at which a responsive layout changes, defined by CSS media queries.' },
      { term: 'Viewport', def: 'The visible area of the page inside the browser window, measured in CSS pixels.' },
      { term: 'Reflow', def: 'Content rearranging to fit a narrower space without sideways scrolling or loss of information.' }
    ],
    practice: [
      { q: 'PayLite’s analytics show 70% of users on Chrome for Android, 20% on Safari for iPhone and the rest on desktop. A colleague proposes testing only Chrome on Android “because that is most users”. How do you respond?', answer: 'Chrome on Android deserves the deepest coverage, but one user in five is on Safari for iPhone, which uses a different engine (WebKit) — engine-specific bugs there would reach many people. I would make both tier 1 with real-device testing, give desktop browsers a lighter tier focused on critical journeys, and document what is not covered.' },
      { q: 'Developers say the layout changes at 600 px and 1024 px. Which widths would you test, and why?', hint: 'Treat width like any other boundary.', answer: '599, 600, 601 and 1023, 1024, 1025 px — on and either side of each breakpoint — plus a narrow width such as 320 px, a typical phone width and a wide desktop such as 1440 px. Also drag-resize slowly between them to catch in-between sizes that no preset uses.' },
      { q: 'List four things you would check after setting browser zoom to 200% on a checkout page.', answer: 'All text is readable and not clipped; buttons such as “Pay now” stay visible and clickable (not hidden under a sticky footer); form fields and error messages do not overlap; and normal text reflows instead of forcing sideways scrolling. Also check a cookie banner or chat widget does not cover most of the screen.' }
    ],
    quiz: [
      { q: 'Why is Chrome on an iPhone often grouped with Safari in a compatibility matrix?', options: ['iOS browsers have historically had to use Apple’s WebKit engine', 'Chrome and Safari share the same company and codebase', 'iPhones cannot run any browser other than Safari', 'Google stopped releasing updates for Chrome on iOS some years ago'], correct: 0,
        why: ['Right — Apple’s rules have required iOS browsers to use WebKit, so rendering closely matches Safari (some regions now allow exceptions).', 'Chrome is made by Google and Safari by Apple; they are separate products.', 'Other browsers can be installed on an iPhone; they have simply used WebKit underneath.', 'Chrome for iOS is actively maintained; the grouping is about the engine.'] },
      { q: 'What is the best basis for choosing which browsers to test?', options: ['The browsers the testing team personally prefers', 'Every browser and every version released in the last five years', 'Your own product’s usage analytics combined with business risk', 'Global market-share rankings published online'], correct: 2,
        why: ['Personal preference ignores where real users are.', 'Exhaustive coverage is impossible and wastes time on browsers nobody uses.', 'Right — your real users and your highest-risk journeys decide the tiers.', 'Global figures can differ a lot from your audience; use them only when you have no data of your own.'] },
      { q: 'A layout switches from one column to two at 768 px. Which set of widths applies boundary thinking best?', options: ['320, 768 and 1440 px', '767, 768 and 769 px', '700 and 800 px', 'Only 768 px'], correct: 1,
        why: ['Useful device widths, but they do not probe just below and above the switch.', 'Right — on and either side of the breakpoint, where off-by-one media-query bugs show up.', 'Too far from the edge to catch a bug at exactly 768 px.', 'One width cannot show whether the switch happens on the correct side.'] },
      { q: 'A tester resizes desktop Chrome to phone width and reports “mobile layout verified for all users”. What is the main problem with this claim?', options: ['Window resizing does not actually change the page’s viewport width', 'Phone layouts should be tested in landscape only', 'Desktop Chrome cannot render responsive layouts at all', 'It ignores real engines, touch, keyboards and performance'], correct: 3,
        why: ['Resizing does change the viewport; the layout check itself is valid.', 'Portrait is the most common phone orientation; both may need checking.', 'Desktop Chrome applies media queries correctly; that is why resizing is useful.', 'Right — resizing checks layout at a width, not Safari’s engine, real touch, the on-screen keyboard or device performance.'] },
      { q: 'Which check does WCAG success criterion 1.4.4 (Resize Text) describe?', options: ['Images must scale with the width of the screen they appear on', 'The page must finish loading within two seconds after resizing', 'Text can be resized to 200% without losing content or function', 'Body fonts must be at least 16 px on all mobile devices'], correct: 2,
        why: ['Responsive images are good practice but are not what 1.4.4 covers.', 'WCAG does not set page-load time limits.', 'Right — text can be scaled up to 200% without assistive technology and without loss of content or functionality.', 'WCAG does not require a minimum font size in pixels.'] }
    ],
    interview: [
      { q: 'How do you decide which browsers and devices to test a web app on?', a: 'I start with our own analytics — browsers, versions, operating systems and screen sizes real users have — plus any contractual support commitments. I group by <b>rendering engine</b> so Blink, WebKit and Gecko are covered when our users have them, and include the oldest supported version as well as the latest. Then I tier the matrix by risk: tier 1 gets full regression on real browsers and devices, tier 2 gets critical journeys, tier 3 a smoke test. I use emulation for quick breadth, document the gaps, and review the matrix as usage changes.' },
      { q: 'What do you look for in responsive testing?', a: 'I test at and either side of each breakpoint, at narrow widths such as 320 px and at large desktop sizes, and I drag-resize to catch in-between sizes. I check <b>layout</b> — no overlap, clipping, sideways scrolling or covered buttons — and <b>interactions</b>: menus, dialogs, forms with the on-screen keyboard, and touch alternatives to hover. I also check zoom to 200%, larger text settings and orientation changes mid-task. Important findings are confirmed on real devices, because emulation shows size, not real engines or touch.' }
    ],
    takeaways: [
      'Think in rendering engines — Blink, WebKit, Gecko — then browsers and versions.',
      'Build the matrix from your own analytics plus risk, tier it, and write down the gaps.',
      'Treat breakpoints as boundaries: test at, just below and just above each one.',
      'Zoom to 200%, larger text and orientation changes are part of responsive testing.',
      'Emulation checks layout at a size; real browsers and devices confirm the rest.'
    ],
    links: { labs: ['ui'], interview: ['m6'] }
  },
  /* ------------------------------------------------------------------ 5 */
  {
    id: 'wm-mobile-basics',
    n: 5,
    level: 'intermediate',
    title: 'Mobile testing fundamentals',
    summary: 'Know native, hybrid and mobile web apps, Android and iOS differences, fragmentation, test builds, install and update flows, gestures and screens.',
    minutes: 22,
    objectives: [
      'Tell native, hybrid and mobile web apps apart and what each means for testing',
      'Describe key Android and iOS differences and why fragmentation matters',
      'Test installs, updates and uninstalls, including data that must survive an upgrade',
      'Cover gestures, screen sizes, notches and safe areas'
    ],
    body: [
      { t: 'p', html: 'Mobile testing is not web testing on a smaller screen. A phone is a personal device that rings, loses signal, runs low on battery, rotates and is used with one thumb on a bus. Apps are installed and updated through app stores, run on a huge range of hardware and several OS versions, and must follow platform rules for permissions, navigation and background work. This lesson covers the fundamentals; the next one covers interruptions, networks and the app lifecycle.' },
      { t: 'table', head: ['Aspect', 'Native app', 'Hybrid app', 'Mobile web'], rows: [
        ['What it is', 'Built with platform tools and languages (Kotlin or Java for Android, Swift or Objective-C for iOS)', 'Web code (HTML, CSS, JS) running in a WebView inside a native shell, e.g. built with Cordova or Capacitor', 'A website opened in the phone’s browser; a PWA can add offline support and a home-screen icon'],
        ['Installed from', 'App store (or managed enterprise distribution)', 'App store', 'No store — just a URL'],
        ['Device features', 'Full access: camera, sensors, Bluetooth, background work, notifications', 'Through plugins that bridge to native code', 'Only what the browser exposes, which varies by browser and OS'],
        ['Testing focus', 'Platform conventions, lifecycle, permissions, performance, OS versions', 'The native shell <b>and</b> the web content: WebView versions, plugin bridges, offline assets', 'Cross-browser and responsive testing on mobile browsers; network conditions'],
        ['How fixes reach users', 'Store releases; users may delay updating', 'Store releases for the shell; some content may load from the server', 'On the next page load (watch caching)']
      ] },
      { t: 'callout', tone: 'info', title: 'Where do React Native and Flutter fit?', html: 'They let one codebase target both platforms, but the result is installed and run like a native app — not a web page in a WebView. Test them as native apps on <b>both</b> platforms: shared code can still behave differently on Android and iOS because of OS APIs, permissions and platform UI conventions.' },
      { t: 'h', text: 'Android and iOS: differences that change your tests' },
      { t: 'table', head: ['Area', 'Android', 'iOS'], rows: [
        ['Devices', 'Many manufacturers, sizes, chipsets and custom manufacturer (OEM) skins', 'A small range of Apple devices'],
        ['OS versions in use', 'Updates depend on the manufacturer, so several versions stay common', 'Devices tend to update faster, but older supported versions still matter'],
        ['Navigation', 'System Back button or back gesture; every screen must handle it', 'No system Back button; on-screen back controls and the edge swipe'],
        ['Test builds', 'APKs can be sideloaded; app bundles go through Google Play’s internal, closed and open testing tracks', 'TestFlight for beta builds; installing outside the store is tightly controlled'],
        ['Permissions', 'Runtime prompts; after repeated denials the system may stop showing the prompt; changeable in Settings', 'Runtime prompts; after a denial the app usually cannot prompt again and must point users to Settings'],
        ['Background work', 'Manufacturer battery optimisation can stop background tasks on some brands', 'Strict limits on background execution; apps are suspended quickly']
      ] },
      { t: 'p', html: '<b>Fragmentation</b> means your users’ devices differ in OS version, screen size and density, memory, chipset and manufacturer customisations. It is strongest on Android, where the same OS version can behave differently on two brands — one manufacturer’s battery optimisation may stop a background upload that works fine on another. You cannot test every combination, so you choose a representative set from analytics and risk (covered in the devices lesson) and make sure lower-end devices with less memory are part of it.' },
      { t: 'h', text: 'Builds, installs, updates and uninstalls' },
      { t: 'p', html: 'Testers rarely install from the public store. Android builds are shared as files or through Google Play’s testing tracks; iOS builds go through <b>TestFlight</b> or development builds installed on registered devices. Always record the <b>exact build number</b> and OS version in bug reports — “latest build” means nothing a day later. Also test the store-signed release candidate, because release builds can behave differently from debug builds (code shrinking, production endpoints, logging switched off).' },
      { t: 'list', items: [
        '<b>Fresh install</b>: first launch, onboarding, permission prompts, and first launch with no network.',
        '<b>Update over an older version</b>: the user stays signed in (or is told why not), and local data such as drafts, settings and downloads survives any data migration.',
        '<b>Skipped versions</b>: upgrade from the oldest supported version straight to the new one, not only from the previous release.',
        '<b>Forced or recommended update</b>: what happens when the server stops supporting an old app version?',
        '<b>Uninstall and reinstall</b>: what should come back after signing in (server data, purchases) and what is gone? Backups can restore some app data, and iOS keychain items can survive an uninstall.',
        '<b>Low storage</b>: install or update with the device almost full.'
      ] },
      { t: 'h', text: 'Gestures, screens, notches and safe areas' },
      { t: 'cards', items: [
        { title: 'Gestures', html: 'Tap, double-tap, long-press, swipe, pinch-zoom, pull-to-refresh, drag. Each needs visible feedback and must not clash with system gestures such as edge swipes.' },
        { title: 'Screen sizes and density', html: 'Small and large phones, foldables and tablets. Missing image sizes for high-density screens show up as blurry icons and pictures.' },
        { title: 'Notches and safe areas', html: 'Camera cut-outs, rounded corners and the home indicator. Buttons and text must stay inside the safe area in portrait and landscape.' },
        { title: 'On-screen keyboard', html: 'It covers the bottom of the screen. The focused field must stay visible, the right keyboard type should appear (email, number), and Next/Done must work.' },
        { title: 'Accessibility settings', html: 'Large font sizes, display zoom, dark mode, screen readers (TalkBack, VoiceOver) and reduced motion all change layouts and flows.' }
      ] },
      { t: 'callout', tone: 'key', title: 'One thumb, one bus, one bar of signal', html: 'Picture a real user: holding the phone in one hand, in sunlight, on a weak connection, with notifications arriving. Tap targets must be big enough, important actions reachable, and nothing should depend on precise timing. This mindset finds more mobile bugs than any checklist.' }
    ],
    example: {
      title: 'Worked example: a PayLite update that changes local storage',
      blocks: [
        { t: 'p', html: 'PayLite 3.0 moves saved payees from a simple local file to an encrypted on-device database. Versions 2.6, 2.7 and 2.8 are still supported. What could go wrong for real users who update?' },
        { t: 'table', head: ['Test', 'Why'], rows: [
          ['Install 2.6, add 5 payees (including Urdu names and a very long one), update straight to 3.0', 'Oldest supported version; the migration must handle every record'],
          ['Repeat from 2.8', 'The most common upgrade path'],
          ['Update with the device almost full', 'Migration may need temporary space; it must fail safely, not lose payees'],
          ['Kill the app during the first launch after updating', 'An interrupted migration must resume or roll back, never leave half the payees'],
          ['Fresh install of 3.0', 'New users must not hit migration code paths at all'],
          ['Uninstall and reinstall 3.0, then sign in', 'Confirms which data returns from the server and which was device-only']
        ] },
        { t: 'p', html: 'The build number, starting version and data set are part of every test. “Payees missing after update” is not reproducible; “updated from 2.6 to 3.0.0 (build 412) on Android 14, 5 payees, storage 97% full” is. Interview question d5 explores the same thinking.' }
      ]
    },
    explain: {
      'ur': 'Mobile app تین طرح کی ہو سکتی ہے: native (Android یا iOS کے اپنے tools اور زبانوں میں بنی)، hybrid (ویب code جو ایک native shell کے اندر WebView میں چلتا ہے) اور mobile web (فون کے browser میں کھلنے والی ویب سائٹ)۔ ہر قسم کی testing الگ ہے۔ Android پر بہت سی کمپنیوں کے فون، سکرین سائز اور OS versions ہوتے ہیں، اسے fragmentation کہتے ہیں؛ iOS پر devices کم ہیں مگر اصول سخت ہیں۔ Test builds عموماً TestFlight یا Google Play کے testing tracks سے آتی ہیں، اس لیے ہر bug میں build نمبر ضرور لکھیں۔ مثال: app کو پرانے version سے نئے پر update کریں اور دیکھیں کہ صارف کا محفوظ data، جیسے drafts، باقی رہا یا نہیں۔ Gestures، notch اور keyboard بھی چیک کریں۔',
      'ur-Latn': 'Mobile app teen tarah ki ho sakti hai: native (Android ya iOS ke apne tools aur languages mein bani), hybrid (web code jo ek native shell ke andar WebView mein chalta hai) aur mobile web (phone ke browser mein khulne wali website). Har qisam ki testing alag hai. Android par bohat si companies ke phones, screen sizes aur OS versions hote hain, isay fragmentation kehte hain; iOS par devices kam hain magar rules sakht hain. Test builds aam tor par TestFlight ya Google Play ke testing tracks se aati hain, is liye har bug mein build number zaroor likhein. Misaal: app ko purane version se naye par update karein aur dekhein ke user ka saved data, jaise drafts, baqi raha ya nahi. Gestures, notch aur keyboard bhi check karein.',
      'hi': 'Mobile app तीन तरह की हो सकती है: native (Android या iOS के अपने tools और भाषाओं में बनी), hybrid (web code जो एक native shell के अंदर WebView में चलता है) और mobile web (फ़ोन के browser में खुलने वाली वेबसाइट)। हर प्रकार की testing अलग है। Android पर कई कंपनियों के फ़ोन, screen sizes और OS versions होते हैं, इसे fragmentation कहते हैं; iOS पर devices कम हैं, पर नियम सख़्त हैं। Test builds आमतौर पर TestFlight या Google Play के testing tracks से आती हैं, इसलिए हर bug में build number ज़रूर लिखें। उदाहरण: app को पुराने version से नए पर update करें और देखें कि user का saved data, जैसे drafts, बचा रहा या नहीं। Gestures, notch और keyboard भी जाँचें।',
      'ar': 'يمكن أن يكون تطبيق الجوال من ثلاثة أنواع: أصلي (native) مبني بأدوات ولغات Android أو iOS الخاصة، وهجين (hybrid) وهو كود ويب يعمل داخل WebView ضمن غلاف أصلي، وويب الجوال (mobile web) وهو موقع يُفتح في متصفح الهاتف. ولكل نوع طريقة اختبار مختلفة. في Android أجهزة كثيرة من شركات مختلفة بأحجام شاشات وإصدارات نظام متعددة، ويسمى ذلك التجزّؤ (fragmentation)، أما iOS فأجهزته أقل لكن قواعده أكثر صرامة. تصل نسخ الاختبار عادةً عبر TestFlight أو مسارات الاختبار في Google Play، لذا اكتب رقم الـ build في كل تقرير خلل. مثال: حدّث التطبيق من إصدار قديم إلى الجديد وتأكد من بقاء بيانات المستخدم المحفوظة مثل المسودات. وافحص أيضًا الإيماءات (gestures) والنتوء (notch) ولوحة المفاتيح.',
      'es': 'Una app móvil puede ser de tres tipos: nativa (creada con las herramientas y lenguajes de Android o iOS), híbrida (código web que se ejecuta dentro de un WebView en una carcasa nativa) o web móvil (un sitio que se abre en el navegador del teléfono). Cada tipo se prueba de forma distinta. En Android hay muchísimos fabricantes, tamaños de pantalla y versiones del sistema; a eso se le llama fragmentación. En iOS hay menos dispositivos, pero las reglas son más estrictas. Las builds de prueba suelen llegar por TestFlight o por los canales de prueba de Google Play, así que anota siempre el número de build en cada defecto. Ejemplo: actualiza la app desde una versión antigua y comprueba que los datos guardados, como los borradores, siguen ahí. Revisa también los gestos, el notch y el teclado.'
    },
    keyTerms: [
      { term: 'Native app', def: 'Built with the platform’s own tools and languages and installed from an app store, with full access to device features.' },
      { term: 'Hybrid app', def: 'Web code running in a WebView inside a native shell (e.g. Cordova, Capacitor), using plugins for device features.' },
      { term: 'Fragmentation', def: 'The variety of OS versions, screen sizes, hardware and manufacturer customisations among real users’ devices.' },
      { term: 'TestFlight', def: 'Apple’s service for distributing beta builds of iOS apps to internal and external testers.' },
      { term: 'Safe area', def: 'The part of the screen not covered by notches, rounded corners or system bars, where content and controls should stay.' },
      { term: 'Data migration', def: 'Converting locally stored data to a new format during an app update, without losing or corrupting it.' }
    ],
    practice: [
      { q: 'MediBook has a native Android app, a native iOS app and a mobile website. A booking bug is fixed in the shared backend API. Where do you retest, and does anyone need to install anything?', answer: 'Retest the booking flow on all three clients, because each calls the API and may handle the response differently. No app update is needed if the fix is purely server-side — but check that <b>older supported app versions</b> still work with the changed API. The mobile website only needs a reload (watch caching).' },
      { q: 'List five install and update scenarios for a notes app that stores notes only on the device.', hint: 'Think about the data, not just the installer.', answer: 'Fresh install and first launch; update from the previous version with notes present; update from the oldest supported version; update with storage nearly full; app killed during the first launch after updating (interrupted migration). Also clarify what uninstall does — device-only notes are lost unless backed up, so check the app warns users or offers an export.' },
      { q: 'Your app has a “Pay” button fixed to the bottom of the screen. Which screen and gesture checks would you add for modern phones?', answer: 'The button stays above the home indicator and inside the safe area in portrait and landscape; it stays visible (or reachable) when the on-screen keyboard opens; it is large enough to tap with a thumb; the Android back gesture and iOS edge swipe do not trigger it by accident; and it still fits at the largest system font size.' }
    ],
    quiz: [
      { q: 'An app’s screens are HTML pages running in a WebView inside a store-installed shell, with plugins for the camera. What type of app is it?', options: ['Native app', 'Hybrid app', 'Mobile website', 'Progressive web app'], correct: 1,
        why: ['Native apps build their screens with platform UI frameworks, not web pages in a WebView.', 'Right — web content inside a native shell, with plugins bridging to device features.', 'A mobile website runs in the browser and is not installed from a store.', 'A PWA runs in the browser engine and is usually added from the browser; it is not a native shell with plugins.'] },
      { q: 'Why is Android device fragmentation a testing concern?', options: ['Behaviour can differ across OS versions, screens and OEM changes', 'Android apps can only be tested on emulators, not real devices', 'Android apps cannot be updated once they are released to users', 'Each Android device model needs its own separate build of the app'], correct: 0,
        why: ['Right — variety in OS versions, screen sizes, hardware and manufacturer skins means a feature that works on one device can fail on another.', 'Android apps run on real devices; emulators are a supplement, not the only option.', 'Android apps are updated through the store all the time.', 'One build (or app bundle) normally serves all supported devices.'] },
      { q: 'A bug report says “Draft lost after updating the app.” Which detail is most essential to add so others can reproduce it?', options: ['The tester’s preferred phone brand and colour', 'The exact time of day when the update ran', 'Whether the store page was opened on Wi-Fi', 'The from and to versions, with build numbers'], correct: 3,
        why: ['A brand without model, OS and app version does not help anyone reproduce the problem.', 'Time can help match logs, but without versions nobody can repeat the upgrade path.', 'The network used to open the store rarely affects data migration.', 'Right — data migration depends on the exact starting version and the new build; without them nobody can repeat the path.'] },
      { q: 'On iOS, a user denied location access on first launch. Later they tap “Find nearby clinics”. What should the app do?', options: ['Show the system permission prompt again until the user accepts', 'Crash, since location is required for this feature to work', 'Explain why it helps; offer Settings or a manual search', 'Quietly use a location saved earlier by another app'], correct: 2,
        why: ['After a denial, iOS does not show the system prompt again; the app has to guide the user instead.', 'A crash is a severe defect; denied permissions must be handled gracefully.', 'Right — explain the benefit, offer a path to Settings and a fallback such as typing an area or city.', 'Apps cannot read other apps’ data, and silently using location would be a privacy violation.'] },
      { q: 'Which test is specific to a hybrid app rather than a native one?', options: ['Web content and plugins across WebView versions', 'The app icon shown on the device home screen', 'Layout behaviour when the phone is rotated', 'Push notifications arriving while app is closed'], correct: 0,
        why: ['Right — hybrid apps render through the system WebView, so its versions and the plugin bridges are extra risk areas.', 'Every installed app has an icon; this is not hybrid-specific.', 'Rotation matters for native and hybrid apps alike.', 'Push notifications apply to native and hybrid apps alike.'] }
    ],
    interview: [
      { q: 'What is the difference between native, hybrid and mobile web apps from a testing point of view?', a: 'A <b>native</b> app is built with platform tools and installed from a store, so I focus on platform conventions, OS versions, permissions, lifecycle and performance on real devices. A <b>hybrid</b> app is web content inside a native shell’s WebView, so I test both sides: the web UI and the plugin bridges to device features, plus WebView versions and offline assets. A <b>mobile web</b> app runs in the phone’s browser, so it is cross-browser and responsive testing on mobile browsers, with extra attention to networks and caching. The backend rules are the same; the risks around them differ.' },
      { q: 'How would you test an app update?', a: 'I install each supported older version, create realistic data — drafts, settings, offline content, a signed-in session — and update without clearing data. I verify the user stays signed in or is told why, that data survives any migration, and that new features work with old data. I include the oldest supported version, a low-storage device, and killing the app during the first launch after updating. I also test a fresh install and forced-update behaviour when the server drops an old version, and I record exact build numbers for every path.' }
    ],
    takeaways: [
      'Native, hybrid and mobile web apps share a backend but carry different risks — test accordingly.',
      'Android fragmentation and iOS platform rules both shape your test design.',
      'Record exact build numbers and OS versions; test store-signed release builds too.',
      'Updates are high risk: test from older versions with real data, low storage and interruptions.',
      'Check gestures, safe areas, the on-screen keyboard and large font settings on real screens.'
    ],
    links: { labs: ['mobile'], interview: ['d1', 'd5'] }
  },
  /* ------------------------------------------------------------------ 6 */
  {
    id: 'wm-mobile-conditions',
    n: 6,
    level: 'intermediate',
    title: 'Interruptions, network, permissions and app lifecycle',
    summary: 'Test how an app copes when calls, backgrounding, process death, network changes, permission changes, battery saver or full storage interrupt real users.',
    minutes: 24,
    objectives: [
      'Explain app lifecycle states and test state restoration after backgrounding and process death',
      'Design interruption and network-condition tests with clear expected results',
      'Test permissions granted, denied and revoked later',
      'Cover battery saver and low-storage conditions'
    ],
    body: [
      { t: 'p', html: 'In the office, an app runs from start to finish on fast Wi-Fi. In real life, a call arrives mid-payment, the user switches apps to copy an OTP, the train enters a tunnel, the OS closes the app to free memory, and battery saver kicks in. Each is an <b>interruption</b> the app must survive without losing data, repeating actions or confusing the user. Testing these conditions is where mobile testers find many of the bugs that matter most.' },
      { t: 'h', text: 'Lifecycle states in plain words' },
      { t: 'table', caption: 'Plain-language states; Android and iOS use their own names for them', head: ['State', 'What it means', 'Tester question'], rows: [
        ['Foreground (active)', 'The app is visible and receiving input', 'Does everything work normally?'],
        ['Paused / inactive', 'Partly covered: a call screen, system dialog or notification shade on top', 'Do timers, video and input pause and resume correctly?'],
        ['Background', 'Not visible; the user switched apps or went to the home screen', 'Is work in progress (upload, timer) paused, continued or saved?'],
        ['Suspended / stopped', 'Still in memory but not running', 'Does the app resume with fresh data, or show stale content?'],
        ['Terminated (process death)', 'The OS removed the app from memory to reclaim resources', 'When the user returns, are the screen and entered data restored?']
      ] },
      { t: 'callout', tone: 'key', title: 'Process death is the interruption people forget', html: 'When the OS needs memory, it can kill a backgrounded app <b>without warning</b>. Users don’t notice — they come back later and expect to be where they left off. The app should restore the screen and entered data from saved state. If it shows the home screen, a blank form or crashes, that is a defect. Closing and reopening the app yourself is <i>not</i> the same test.' },
      { t: 'p', html: 'On Android, send the app to the background, kill its process with <code>adb shell am kill &lt;package&gt;</code> and return through the recent-apps screen. The developer option <b>Don’t keep activities</b> destroys each screen as soon as you leave it — useful, though not identical to real process death. Revoking a permission in Settings while the app is backgrounded also kills its process on Android, and changing a privacy permission terminates a running iOS app, so both make natural restoration tests. On iOS, the system can also terminate suspended apps; return after a long gap or after opening several heavy apps.' },
      { t: 'code', lang: 'bash', title: 'Android: process death vs force stop', code: `# 1. Open the app, enter data, then press Home (app goes to background)
# 2. Kill the process the way the OS would when memory is low:
adb shell am kill com.paylite.wallet
# 3. Reopen from the recent-apps screen
#    Expect: same screen, same entered data (state restored)

# Compare with a force stop - like the user choosing "Force stop":
adb shell am force-stop com.paylite.wallet
#    Expect: a fresh start; saved screen state is not restored` },
      { t: 'h', text: 'Interruptions to test' },
      { t: 'list', items: [
        '<b>Incoming call</b>, alarm or system dialog during payment, form entry, video or recording.',
        '<b>Tapping a notification</b> mid-task — does the app open the right screen and keep the unfinished task?',
        '<b>App switching</b>: leave to copy an OTP from SMS, then return — the OTP screen and its timer should still make sense.',
        '<b>Screen lock</b> and the device sleeping during a long operation.',
        '<b>Rotation and split-screen</b> mid-task, where supported.',
        '<b>Headphones or Bluetooth</b> disconnecting during audio playback.'
      ] },
      { t: 'h', text: 'Network conditions — and what to verify' },
      { t: 'table', head: ['Condition', 'How to create it', 'What to verify'], rows: [
        ['Offline', 'Airplane mode, or Wi-Fi and mobile data both off', 'A clear offline message; no endless spinner; entered data kept; queued actions sync <b>once</b> when back online'],
        ['Slow or high-latency', 'Network shaping tools, emulator network settings, a weak-signal spot', 'Loading indicators, sensible time-outs, a retry option, no duplicates from impatient taps'],
        ['Switching networks', 'Walk from Wi-Fi onto mobile data; toggle Wi-Fi mid-request', 'Requests retry or resume safely; the user stays signed in; uploads neither restart from zero nor duplicate'],
        ['Wi-Fi with no internet', 'A captive portal (hotel or airport sign-in page) or a router with no uplink', 'The app notices requests failing and does not claim to be online when nothing works'],
        ['Lost mid-request', 'Go offline just after tapping Pay or Upload', 'A clear final state — done once, or not done with a safe retry — never charged twice']
      ] },
      { t: 'h', text: 'Permissions: granted, denied and changed later' },
      { t: 'p', html: 'Permissions are not a one-time yes. Test the first request (is the reason explained <i>before</i> the system dialog?), <b>granted</b>, <b>denied</b> (a useful fallback, no crash, no nagging loop), limited options such as “only this time” or approximate location where the OS offers them, and <b>revoked later in Settings</b> while the app is backgrounded. On return, the app must notice the change and degrade gracefully. Then test the way back: the user enables the permission in Settings and returns — the feature should work without reinstalling.' },
      { t: 'cards', items: [
        { title: 'Battery saver / low power mode', html: 'Background sync, location updates and animations may be restricted. Check critical alerts still arrive, or the app shows when data was last updated.' },
        { title: 'Storage full', html: 'Downloads, photo capture, caching and database writes can fail. Expect a clear message and no corruption of existing data.' },
        { title: 'Low memory', html: 'Open several heavy apps, then return. This often triggers process death, especially on lower-end devices.' },
        { title: 'Clock and time zone changes', html: 'Change the device time or time zone; check OTP timers, schedules, reminders and “last updated” labels.' }
      ] }
    ],
    example: {
      title: 'Worked example: PayLite ID upload under pressure',
      blocks: [
        { t: 'p', html: 'A PayLite user uploads a photo of their ID card for verification. On mobile data the upload takes about 20 seconds. The tester lists conditions, each with a clear expected result, before touching the device.' },
        { t: 'table', head: ['Condition', 'Expected result'], rows: [
          ['Go offline at 60% progress, reconnect after 30 s', 'Upload resumes or restarts automatically; progress is honest; exactly one document saved'],
          ['Switch from Wi-Fi to mobile data mid-upload', 'Upload continues or retries without the user starting again'],
          ['Background the app at 50%, return after 2 minutes', 'Correct progress or result shown; no frozen spinner'],
          ['Background, kill the process, then reopen', 'User returns to the verification screen with a clear status, not a blank form'],
          ['Revoke camera permission in Settings, then return', 'App explains the camera is off and offers gallery upload or a Settings link; no crash'],
          ['Storage almost full while taking the photo', 'Clear message; earlier photos and data not corrupted']
        ] },
        { t: 'p', html: 'Every row ends with the same question: <b>how many documents did the server receive?</b> The answer must be exactly one. Practise this in the Mobile lab and the Offline upload recovery challenge, then compare your plan with interview questions d2, d3 and d6.' }
      ]
    },
    explain: {
      'ur': 'اصل زندگی میں mobile app کو بار بار رکاوٹیں آتی ہیں: call آ جاتی ہے، صارف OTP دیکھنے کے لیے دوسری app کھولتا ہے، نیٹ ورک چلا جاتا ہے، یا OS میموری بچانے کے لیے app کو بند کر دیتا ہے (process death)۔ Tester کو دیکھنا ہوتا ہے کہ ان سب کے بعد صارف کا data محفوظ رہے، کوئی action دو بار نہ ہو، اور app واضح بتائے کہ کیا ہوا۔ مثال: photo upload کے دوران internet بند کریں، پھر چالو کریں — upload دوبارہ شروع ہو یا resume ہو، اور سرور پر صرف ایک ہی photo پہنچے۔ Permissions بھی بدلتی رہتی ہیں: allow، deny، اور بعد میں Settings سے بند کرنا — تینوں ٹیسٹ کریں۔ Battery saver اور بھری ہوئی storage بھی نہ بھولیں۔',
      'ur-Latn': 'Asal zindagi mein mobile app ko baar baar rukawatein aati hain: call aa jati hai, user OTP dekhne ke liye doosri app kholta hai, network chala jata hai, ya OS memory bachane ke liye app ko band kar deta hai (process death). Tester ko dekhna hota hai ke in sab ke baad user ka data mehfooz rahe, koi action do baar na ho, aur app wazeh bataye ke kya hua. Misaal: photo upload ke dauran internet band karein, phir chalu karein — upload dobara shuru ho ya resume ho, aur server par sirf ek hi photo pohanche. Permissions bhi badalti rehti hain: allow, deny, aur baad mein Settings se band karna — teeno test karein. Battery saver aur bhari hui storage bhi na bhoolein.',
      'hi': 'असल ज़िंदगी में mobile app को बार-बार रुकावटें आती हैं: call आ जाती है, user OTP देखने के लिए दूसरी app खोलता है, network चला जाता है, या OS memory बचाने के लिए app को बंद कर देता है (process death)। Tester को देखना होता है कि इन सबके बाद user का data सुरक्षित रहे, कोई action दो बार न हो, और app साफ़ बताए कि क्या हुआ। उदाहरण: photo upload के दौरान internet बंद करें, फिर चालू करें — upload फिर से शुरू हो या resume हो, और server पर सिर्फ़ एक ही photo पहुँचे। Permissions भी बदलती रहती हैं: allow, deny, और बाद में Settings से बंद करना — तीनों test करें। Battery saver और भरी हुई storage भी न भूलें।',
      'ar': 'في الحياة الواقعية يتعرّض تطبيق الجوال لمقاطعات كثيرة: تصل مكالمة، أو يفتح المستخدم تطبيقًا آخر ليقرأ رمز OTP، أو ينقطع الاتصال، أو يُغلق النظام التطبيق لتوفير الذاكرة (process death). على المختبِر أن يتحقق من أن بيانات المستخدم تبقى محفوظة بعد كل ذلك، وأن أي إجراء لا يتكرر مرتين، وأن التطبيق يوضّح ما حدث. مثال: أوقِف الإنترنت أثناء رفع صورة ثم أعِده؛ يجب أن يُستأنف الرفع أو يبدأ من جديد، وأن تصل إلى الخادم صورة واحدة فقط. والأذونات (permissions) تتغير أيضًا: السماح والرفض ثم الإلغاء لاحقًا من الإعدادات، فاختبر الحالات الثلاث. ولا تنسَ وضع توفير البطارية وامتلاء مساحة التخزين.',
      'es': 'En la vida real, una app móvil sufre interrupciones constantes: entra una llamada, el usuario abre otra app para copiar un código OTP, se pierde la conexión o el sistema cierra la app para liberar memoria (process death). El tester debe comprobar que, después de todo eso, los datos del usuario siguen a salvo, ninguna acción se repite y la app explica con claridad qué pasó. Ejemplo: corta internet durante la subida de una foto y vuelve a activarlo; la subida debe reanudarse o reiniciarse, y al servidor debe llegar una sola foto. Los permisos también cambian: concedido, denegado y revocado después en Ajustes; prueba los tres casos. No olvides el modo de ahorro de batería ni el almacenamiento lleno.'
    },
    keyTerms: [
      { term: 'App lifecycle', def: 'The states an app moves through — foreground, background, suspended, terminated — as the user and the OS act on it.' },
      { term: 'Process death', def: 'The OS killing a backgrounded app to reclaim memory. The app should restore the user’s place and data when reopened.' },
      { term: 'State restoration', def: 'Bringing back the screen, inputs and progress a user had before the app was backgrounded or killed.' },
      { term: 'Runtime permission', def: 'Access to sensitive features (camera, location, contacts) that the user grants or denies while the app runs, and can change later.' },
      { term: 'Captive portal', def: 'A Wi-Fi network that shows a sign-in page before allowing internet access; the phone looks connected but requests fail.' }
    ],
    practice: [
      { q: 'Write three interruption tests for a 5-step PeopleOps timesheet form in the mobile app, each with an expected result.', answer: '1) Incoming call on step 3, return after the call → still on step 3 with all data. 2) Background on step 4, kill the process (<code>adb shell am kill</code>), reopen from recent apps → step 4 restored, or a clear message with a saved draft. 3) Lock the screen for 20 minutes on step 5, unlock → if the session expired, a clear message and the data preserved after signing in again.' },
      { q: 'The app shows a spinner forever when the network drops during login. Write the bug title and the expected result.', answer: '<b>Title:</b> “Login spinner never stops when the network drops mid-request (Android 14, build 2.3.1 (88))”. <b>Expected:</b> after a reasonable time-out the spinner stops, a message explains the connection problem, the entered username is kept, and Retry works once the network is back.' },
      { q: 'A user revokes location permission in Settings while the app is in the background, then returns to a map screen. What do you verify?', hint: 'On Android the app’s process is killed in this case and recreated when the user returns.', answer: 'No crash; the app detects the permission is gone and offers a fallback (manual search, or an explanation of why location helps with a Settings link). The screen is restored sensibly after the process is recreated. Re-enabling the permission in Settings and returning makes the feature work again without reinstalling.' },
      { q: 'Beyond a stable network, which conditions would you test for a PayLite payment?', answer: 'Offline before tapping Pay; network lost immediately after tapping Pay (verify the final state — charged once or not at all); a slow network with repeated taps; switching from Wi-Fi to mobile data mid-request; the app backgrounded and killed during payment, then reopened; battery saver on; and the OTP step when the user leaves the app to read the SMS.' }
    ],
    quiz: [
      { q: 'Which test best checks state restoration after process death on Android?', options: ['Swipe the app away from the recent-apps list and reopen it', 'Press Home and then immediately reopen the app from the icon', 'Background it, kill its process with adb, reopen from recents', 'Uninstall and reinstall the app, then sign in again'], correct: 2,
        why: ['Swiping away is the user choosing to close the app; the system generally does not restore the previous screen after that.', 'The process is still alive, so nothing needs restoring.', 'Right — the process dies while backgrounded, just as when the OS reclaims memory, and the app must restore the user’s place.', 'Reinstalling clears local state completely; it tests a fresh start, not restoration.'] },
      { q: 'During a photo upload, the network drops at 70% and returns 20 seconds later. Which outcome is correct?', options: ['The upload silently stops and the user must notice it failed', 'The upload restarts and two copies of the photo are saved', 'The app crashes, but the photo is saved on the server', 'The upload resumes or retries and exactly one photo is saved'], correct: 3,
        why: ['A silent failure leaves the user believing the upload worked.', 'Duplicates are a classic defect after retries; the server should end up with one photo.', 'A crash is a defect even if the data survives.', 'Right — recovery without user effort, an honest status and no duplicate.'] },
      { q: 'A user denied camera access, later enabled it in system Settings and returned to the app. What should happen?', options: ['The camera works without the user reinstalling or restarting it', 'The app asks the user to reinstall it so the new setting applies', 'The app keeps showing the “permission denied” screen', 'The app shows the system permission prompt one more time'], correct: 0,
        why: ['Right — whether the app resumes or is relaunched (both platforms may kill an app when a permission changes), it should check the permission again and the feature should simply work.', 'Reinstalling should never be needed to pick up a permission change.', 'A stale denied screen means the app is not re-checking the permission.', 'The permission is already granted; prompting again is unnecessary and confusing.'] },
      { q: 'What is the most important thing to verify when the network drops right after a user taps Pay?', options: ['The loading spinner keeps animating smoothly until it reconnects', 'The final state is clear and payment happens at most once', 'The app returns to the home screen automatically for safety', 'The on-screen keyboard is dismissed so the user can read'], correct: 1,
        why: ['A smooth spinner is useless if the user never learns what happened.', 'Right — money flows must end in a known state, with no double charge on retry.', 'Jumping away hides the payment status from the user.', 'Keyboard behaviour is minor compared with the payment outcome.'] },
      { q: 'Battery saver is on. Which behaviour is most likely acceptable rather than a defect?', options: ['The app crashes as soon as battery saver mode is switched on', 'A completed payment’s confirmation never appears anywhere', 'The app freezes on the login screen until it is restarted', 'Background sync runs less often, with a “last updated” time'], correct: 3,
        why: ['Crashing is never acceptable behaviour under battery saver.', 'Losing a payment confirmation is a serious defect whatever the power mode.', 'Freezing is a defect; battery saver may slow work but must not hang the UI.', 'Right — the OS limits background work in power-saving modes; less frequent sync with an honest status is reasonable.'] }
    ],
    interview: [
      { q: 'How do you test an app’s behaviour after it is interrupted?', a: 'First I note the exact state — screen, entered data, any operation in progress. Then I interrupt it in several ways: a call or notification, switching apps, locking the screen, rotation and, importantly, <b>process death</b> while backgrounded, which on Android I simulate with <code>adb shell am kill</code> after sending the app to the background. When I return, I check the screen and data are restored or the app clearly explains what happened, nothing is submitted twice, and expired sessions are handled gracefully. I compare representative Android and iOS devices, because lifecycle handling differs.' },
      { q: 'What network conditions do you test for a mobile app?', a: 'Offline, slow or high-latency connections, switching between Wi-Fi and mobile data mid-request, Wi-Fi without real internet (a captive portal), and the connection dropping right after an action such as Pay or Upload. For each I define what to verify: clear messages instead of endless spinners, sensible time-outs and retry, data kept, queued actions synced once, and above all <b>no duplicates</b> — exactly one order, payment or upload on the server. I use network shaping for repeatable tests and a real device on a real weak network before release.' }
    ],
    takeaways: [
      'Interruptions are normal on mobile — calls, app switching, screen lock, rotation, low memory.',
      'Test process death on purpose; closing and reopening the app is not the same test.',
      'For every network condition, verify the final state and that nothing happened twice.',
      'Permissions change over time: test granted, denied, revoked later and re-enabled.',
      'Battery saver, full storage and clock changes are real user conditions, not trivia.'
    ],
    links: { labs: ['mobile'], challenges: ['mobile-resume'], interview: ['d2', 'd3', 'd6'] }
  },
  /* ------------------------------------------------------------------ 7 */
  {
    id: 'wm-devices',
    n: 7,
    level: 'advanced',
    title: 'Emulators, simulators, real devices and device clouds',
    summary: 'Choose between Android emulators, iOS simulators, real devices and device clouds, pick a representative device set, and understand Appium’s architecture.',
    minutes: 25,
    objectives: [
      'Explain how Android emulators, the iOS Simulator and real devices differ',
      'Name what virtual devices cannot tell you',
      'Weigh device-cloud trade-offs and choose a representative device set',
      'Describe Appium’s client–server–driver architecture at a high level'
    ],
    body: [
      { t: 'p', html: 'No team can buy every phone. Instead, mobile testers combine three kinds of target: <b>virtual devices</b> on a computer, a small lab of <b>real devices</b>, and rented devices in a <b>device cloud</b>. Each is good at different things. Knowing exactly what each can and cannot tell you is what lets you say “this release is tested” with confidence — and list the gaps honestly.' },
      { t: 'h', text: 'Emulator vs simulator vs real device' },
      { t: 'table', head: ['Aspect', 'Android emulator', 'iOS Simulator', 'Real device'], rows: [
        ['What it is', 'Emulates a whole Android device: virtual hardware running a real Android system image (via Android Studio)', 'Runs iOS apps built for your Mac in a simulated iOS environment; it does not emulate iPhone hardware. Needs macOS and Xcode', 'The physical phone or tablet your users hold'],
        ['Cost and speed', 'Free; quick to create many OS versions and screen sizes', 'Free with Xcode; fast to start', 'Must be bought, charged, updated and shared'],
        ['Good for', 'Early functional testing, OS-version and screen breadth, automation in CI', 'Early functional testing, layouts, automation in CI on macOS', 'Final confidence: performance, sensors, real networks, manufacturer behaviour'],
        ['Sensors and hardware', 'Simulated location, sensors and camera input — not real hardware behaviour', 'Simulated location and some features; no real camera, NFC or Bluetooth', 'Real camera, GPS, biometrics, NFC, Bluetooth, battery and thermal behaviour'],
        ['Performance', 'Depends on your computer, not on a phone', 'Uses your Mac’s processor — usually far faster than a phone', 'True speed, memory limits and heat'],
        ['Manufacturer behaviour', 'Usually Google’s standard Android images', 'Not applicable — and no device-specific quirks either', 'Real OEM skins, battery optimisation and pre-installed browsers']
      ] },
      { t: 'callout', tone: 'warn', title: 'What virtual devices cannot tell you', html: 'Real sensor and camera behaviour; true performance, memory pressure, battery drain and heat; how touch and gestures feel; real cellular networks, handovers between towers and weak signal; and manufacturer skins with their aggressive background-task limits. If a risk lives in any of these, it needs a <b>real device</b>.' },
      { t: 'h', text: 'Device clouds: renting real devices' },
      { t: 'compare', a: { title: 'Device cloud strengths', items: ['Many real models and OS versions without buying them', 'Parallel runs for automated suites in CI', 'Older or regional devices your team does not own', 'Video, logs and screenshots recorded for each session'] }, b: { title: 'Device cloud trade-offs', items: ['Ongoing cost, often per minute or per parallel session', 'Remote-control lag makes manual gestures feel different', 'Shared devices may not be fully cleaned between sessions', 'Builds and test data leave your network — check security and privacy rules', 'Limited control over SIM cards, real networks and some sensors'] } },
      { t: 'p', html: 'Many teams use all three: emulators and simulators on every developer machine and in CI for fast feedback, a device cloud for breadth before release, and a handful of in-house real devices for exploratory testing, performance checks and anything involving hardware. Some cloud plans offer virtual devices rather than real ones — know which you are paying for, and say which you used in your test summary.' },
      { t: 'h', text: 'Choosing a device set' },
      { t: 'flow', caption: 'Building a device set (compare interview question d1)', steps: ['Read your analytics', 'List supported OS versions', 'Add risk factors', 'Pick representative devices', 'Decide real or virtual', 'Document the gaps', 'Review regularly'] },
      { t: 'table', caption: 'Illustrative device set for MediBook, based on its own analytics', head: ['Device class', 'Why it is in the set', 'Where tested'], rows: [
        ['Popular mid-range Android, current OS', 'Largest group of MediBook users', 'Real device in-house'],
        ['Low-memory Android, oldest supported OS', 'Most likely to hit process death and slow screens', 'Real device in-house'],
        ['Samsung flagship', 'Large user group; OEM skin and battery behaviour', 'Device cloud'],
        ['Recent iPhone, current iOS', 'Main iOS audience', 'Real device in-house'],
        ['Older small-screen iPhone, oldest supported iOS', 'Small layouts and older OS behaviour', 'Device cloud'],
        ['Tablet (Android or iPad)', 'Clinics use tablets at reception desks', 'Emulator/simulator plus one cloud session']
      ] },
      { t: 'h', text: 'Appium at a high level' },
      { t: 'p', html: '<b>Appium</b> is an open-source tool for automating native, hybrid and mobile web apps on Android and iOS through the <b>W3C WebDriver</b> protocol. Your test, written in a language such as Java, Python or JavaScript, uses an Appium <b>client library</b> to send WebDriver commands over HTTP to the <b>Appium server</b>, a Node.js program. The server hands each command to a platform <b>driver</b> — for example <b>UiAutomator2</b> for Android or <b>XCUITest</b> for iOS — which acts on the app on an emulator, simulator or real device. Since Appium 2, drivers are installed separately from the server.' },
      { t: 'flow', caption: 'How one Appium command travels', steps: ['Test + client library', 'WebDriver over HTTP', 'Appium server', 'Platform driver', 'App on the device'] },
      { t: 'callout', tone: 'tip', title: 'Capabilities tell Appium what to start', html: 'A session starts with <b>capabilities</b> such as <code>platformName</code>, <code>appium:automationName</code>, <code>appium:deviceName</code> and <code>appium:app</code>; non-standard ones carry the <code>appium:</code> prefix. The same test can target an emulator, a real device or a cloud device by changing capabilities and the server address — which is why choosing devices is a test-design decision, not just a tooling one.' }
    ],
    example: {
      title: 'Worked example: deciding where each MediBook check runs',
      blocks: [
        { t: 'p', html: 'MediBook’s next release adds video consultations and a redesigned booking form. The tester decides, check by check, where each one runs.' },
        { t: 'table', head: ['Check', 'Where', 'Why'], rows: [
          ['Booking form layout on 8 screen sizes', 'Emulators and simulators', 'Fast breadth; layout does not depend on real hardware'],
          ['Video call quality and camera switching', 'Real devices in-house', 'Needs real cameras, microphones, CPU load and heat'],
          ['Video call on a weak mobile network', 'Real device on a real network', 'Emulated throttling misses real handovers and packet loss'],
          ['Reminders with battery optimisation on', 'Device cloud: two OEM devices', 'Manufacturer background limits exist only on those real devices'],
          ['Automated booking regression', 'Emulators in CI on every merge; cloud real devices nightly', 'Fast feedback first, real-device confidence before release']
        ] },
        { t: 'code', lang: 'json', title: 'Capabilities for the emulator run in CI', code: `{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Android Emulator",
  "appium:app": "/builds/medibook-3.2.0-412.apk"
}` },
        { t: 'p', html: 'The gaps go into the test summary: “Not tested on foldables; iPad checked on the simulator only.” Stakeholders can then accept those risks knowingly instead of discovering them in production.' }
      ]
    },
    explain: {
      'ur': 'Android کا emulator کمپیوٹر پر ایک پورا virtual فون چلاتا ہے، جبکہ iOS کا Simulator، Mac پر iOS کا ماحول دکھاتا ہے مگر iPhone کا hardware نہیں بناتا۔ دونوں مفت اور تیز ہیں، اور ابتدائی testing اور مختلف screen sizes کے لیے بہترین ہیں۔ لیکن یہ اصل camera، sensors، performance، battery، کمزور نیٹ ورک اور مختلف کمپنیوں (OEM) کے تبدیل شدہ Android نہیں دکھا سکتے — اس کے لیے real device چاہیے۔ Device cloud میں آپ کرائے پر بہت سے اصل فون استعمال کر سکتے ہیں، مگر خرچ، تاخیر اور data کی حفاظت کا خیال رکھیں۔ مثال: video call کی quality ہمیشہ اصل فون پر ٹیسٹ کریں۔ Appium میں آپ کا test سرور کو commands بھیجتا ہے اور driver انہیں device پر چلاتا ہے۔',
      'ur-Latn': 'Android ka emulator computer par ek poora virtual phone chalata hai, jab ke iOS ka Simulator, Mac par iOS ka mahol dikhata hai magar iPhone ka hardware nahi banata. Dono free aur tez hain, aur shuru ki testing aur mukhtalif screen sizes ke liye behtareen hain. Lekin yeh asal camera, sensors, performance, battery, kamzor network aur mukhtalif companies (OEM) ke badle hue Android nahi dikha sakte — is ke liye real device chahiye. Device cloud mein aap kiraye par bohat se asal phones istemal kar sakte hain, magar kharch, delay aur data ki hifazat ka khayal rakhein. Misaal: video call ki quality hamesha asal phone par test karein. Appium mein aap ka test server ko commands bhejta hai aur driver unhein device par chalata hai.',
      'hi': 'Android का emulator कंप्यूटर पर एक पूरा virtual फ़ोन चलाता है, जबकि iOS का Simulator, Mac पर iOS का माहौल दिखाता है, पर iPhone का hardware नहीं बनाता। दोनों मुफ़्त और तेज़ हैं, और शुरुआती testing व अलग-अलग screen sizes के लिए बढ़िया हैं। लेकिन ये असली camera, sensors, performance, battery, कमज़ोर network और अलग-अलग कंपनियों (OEM) के बदले हुए Android नहीं दिखा सकते — इसके लिए real device चाहिए। Device cloud में आप किराये पर कई असली फ़ोन इस्तेमाल कर सकते हैं, पर ख़र्च, देरी और data की सुरक्षा का ध्यान रखें। उदाहरण: video call की quality हमेशा असली फ़ोन पर test करें। Appium में आपका test server को commands भेजता है और driver उन्हें device पर चलाता है।',
      'ar': 'يشغّل محاكي Android (emulator) هاتفًا افتراضيًا كاملًا على الحاسوب، بينما يعرض iOS Simulator بيئة iOS على جهاز Mac دون أن يحاكي عتاد iPhone نفسه. كلاهما مجاني وسريع، وممتاز للاختبار المبكر ولتجربة أحجام شاشات كثيرة. لكنهما لا يكشفان سلوك الكاميرا والحساسات الحقيقية، ولا الأداء الفعلي والبطارية والشبكات الضعيفة، ولا تعديلات الشركات المصنّعة (OEM) على Android، ولهذا تحتاج إلى أجهزة حقيقية. تتيح سحابة الأجهزة (device cloud) استئجار أجهزة حقيقية كثيرة، لكن انتبه إلى التكلفة وبطء التحكم عن بُعد وحماية البيانات. مثال: اختبر جودة مكالمات الفيديو دائمًا على هاتف حقيقي. وفي Appium يرسل اختبارك الأوامر إلى الخادم، ثم ينفّذها الـ driver على الجهاز.',
      'es': 'Un emulador de Android ejecuta un teléfono virtual completo en el ordenador, mientras que el Simulator de iOS reproduce el entorno de iOS en un Mac, pero no emula el hardware del iPhone. Ambos son gratuitos y rápidos, ideales para las primeras pruebas y para cubrir muchos tamaños de pantalla. Sin embargo, no muestran el comportamiento real de la cámara y los sensores, el rendimiento, la batería, las redes débiles ni las capas de personalización de los fabricantes (OEM); para eso necesitas dispositivos reales. Una device cloud permite alquilar muchos dispositivos reales, pero ten en cuenta el coste, el retraso del control remoto y la protección de datos. Ejemplo: prueba siempre la calidad de una videollamada en un teléfono real. En Appium, tu prueba envía comandos al servidor y un driver los ejecuta en el dispositivo.'
    },
    keyTerms: [
      { term: 'Emulator', def: 'Software that mimics a device’s hardware so its real operating system can run on a computer — for example, the Android emulator.' },
      { term: 'Simulator', def: 'Software that imitates a platform’s environment without emulating its hardware — for example, the iOS Simulator.' },
      { term: 'Device cloud', def: 'A service that rents remote access to real (and sometimes virtual) devices for manual and automated testing.' },
      { term: 'Appium', def: 'Open-source tool that automates mobile apps through the W3C WebDriver protocol, using platform drivers such as UiAutomator2 and XCUITest.' },
      { term: 'Capabilities', def: 'Key–value settings sent when starting an Appium session, such as platformName and appium:automationName.' }
    ],
    practice: [
      { q: 'For each check, choose emulator/simulator, real device or device cloud, and justify it: (a) a new settings screen on 10 screen sizes, (b) fingerprint login, (c) a crash reported only on one Samsung model you do not own.', answer: '(a) <b>Emulator/simulator</b> — layout breadth, fast and free. (b) <b>Real device</b> — biometrics can be simulated for basic flows, but real sensor behaviour, enrolment changes and failure cases need hardware. (c) <b>Device cloud</b> — rent that exact model and OS version to reproduce the crash, then retest the fix on it.' },
      { q: 'A manager says, “Everything passed on the emulator, so we can skip real devices this release.” Write a short, respectful reply.', answer: 'For example: “The emulator results give us good confidence in the functional flows and layouts. They can’t show performance on low-memory phones, camera and GPS behaviour, real network drops or manufacturer battery limits — and this release changes the camera upload. I suggest a two-hour session on our three tier-1 real devices for those risks. If we skip it, I’ll list those areas as untested in the release notes.”' },
      { q: 'Describe how an Appium “tap Book appointment” command reaches the app.', hint: 'Count the hops from your test code to the screen.', answer: 'The test calls the <b>client library</b> (e.g. Java or Python) → the library sends a W3C WebDriver HTTP request to the <b>Appium server</b> → the server routes it to the session’s <b>driver</b> (UiAutomator2 on Android, XCUITest on iOS) → the driver uses the platform’s automation framework to find the element and tap it on the emulator, simulator or real device. The result travels back the same way.' }
    ],
    quiz: [
      { q: 'Which statement about the iOS Simulator is accurate?', options: ['It emulates iPhone hardware exactly, including the camera', 'It runs on Windows and Linux as well as macOS', 'It measures true iPhone performance and battery use', 'It runs Mac-built apps in a simulated iOS environment'], correct: 3,
        why: ['It does not emulate hardware, and it has no real camera.', 'It ships with Xcode, which runs only on macOS.', 'It uses your Mac’s processor, so performance and battery figures do not represent a phone.', 'Right — the Simulator runs app builds compiled for the Mac inside a simulated iOS environment; it is not hardware emulation.'] },
      { q: 'A background reminder works on the emulator and on a Pixel, but users of one other manufacturer say reminders never arrive. What is the best next step?', options: ['Close the report, since the feature works fine on the emulator', 'Reproduce on that brand’s real device, noting battery settings', 'Advise affected users to switch to a Pixel phone instead', 'Repeat the emulator test with more memory and CPU assigned'], correct: 1,
        why: ['The emulator runs a standard Android image; it cannot show manufacturer-specific battery behaviour.', 'Right — OEM battery optimisation often stops background work; reproduce on the real model and record its power settings.', 'Telling users to change phones is not a fix.', 'More emulator resources do not add the manufacturer’s customisations.'] },
      { q: 'In Appium’s architecture, what does a driver such as UiAutomator2 or XCUITest do?', options: ['It writes test scripts automatically from recorded taps', 'It hosts the device cloud and bills you per session', 'It carries out the server’s commands on the platform', 'It replaces the Appium server, so none is needed'], correct: 2,
        why: ['Appium does not generate scripts; you write them with a client library.', 'Device clouds are separate services; drivers are installed into the Appium server.', 'Right — the server routes each WebDriver command to the platform driver, which uses the native automation framework to act on the app.', 'The driver works behind the server; it does not replace it.'] },
      { q: 'Which risk is a device cloud least suited to cover?', options: ['Real SIM networks, carrier conditions and fine gesture feel', 'Getting access to an older phone model the team does not own', 'Running automated tests in parallel on many devices', 'Getting videos and logs of each test session'], correct: 0,
        why: ['Right — remote devices offer limited control of real SIM and carrier conditions, and remote-control lag changes how gestures feel.', 'This is a core strength of device clouds.', 'Parallel runs are a key reason teams use clouds.', 'Most clouds record sessions with logs and video.'] },
      { q: 'You can test on only five Android devices for a release. Which choice is strongest?', options: ['The five newest and most powerful flagship phones currently on sale', 'A mix from analytics, including a low-memory phone on the oldest OS', 'Five units of the single most popular phone model', 'Whichever phones the developers already happen to own'], correct: 1,
        why: ['Flagships hide the performance and memory problems that users with mid-range phones will hit.', 'Right — real usage plus risk (low memory, oldest supported OS) gives the most representative coverage.', 'Five identical devices add no extra coverage.', 'Convenience is not the same as representativeness.'] }
    ],
    interview: [
      { q: 'When would you use an emulator or simulator, and when a real device?', a: 'I use emulators and simulators for fast, cheap breadth: early functional testing, many OS versions and screen sizes, and automated runs in CI. I switch to <b>real devices</b> whenever the risk involves hardware or real-world conditions: camera, GPS, biometrics, Bluetooth, performance and memory on lower-end phones, battery and heat, real networks, and manufacturer customisations such as aggressive battery optimisation. Before release, tier-1 devices get real-device testing, in-house or through a device cloud, and I state clearly which checks ran only on virtual devices.' },
      { q: 'Explain Appium’s architecture briefly.', a: 'Appium uses a client–server model over the <b>W3C WebDriver</b> protocol. My test uses a client library in Java, Python, JavaScript or another language to send HTTP commands to the Appium server, a Node.js process. The server starts a session from the <b>capabilities</b> I send — platform, automation name, device, app — and routes commands to a platform <b>driver</b>: UiAutomator2 for Android or XCUITest for iOS. The driver uses the native automation framework to act on the app on an emulator, simulator or real device. Since Appium 2, drivers are installed separately, so each setup includes only what it needs.' }
    ],
    takeaways: [
      'Android emulators emulate hardware; the iOS Simulator does not — neither replaces real devices.',
      'Sensors, performance, battery, real networks and OEM quirks need real devices.',
      'Device clouds give breadth and parallel runs at the cost of money, lag and data-handling care.',
      'Choose devices from analytics plus risk, include a low-end phone, and document the gaps.',
      'Appium: client library → Appium server → platform driver → app on the device.'
    ],
    links: { labs: ['mobile'], interview: ['d1', 'd4'] }
  },
  /* ------------------------------------------------------------------ 8 */
  {
    id: 'wm-usability-l10n',
    n: 8,
    level: 'advanced',
    title: 'Usability, localization and internationalization testing',
    summary: 'Apply usability heuristics and check that a product works across languages, scripts, right-to-left layouts, local formats, encodings and time zones.',
    minutes: 25,
    objectives: [
      'Use Nielsen’s 10 heuristics for quick, explainable usability reviews',
      'Explain the difference between internationalization and localization',
      'Test text expansion, RTL layouts and locale formats for dates, numbers and currency',
      'Use pseudo-localization and Unicode-aware checks, and handle time zones'
    ],
    body: [
      { t: 'p', html: 'A feature can pass every functional test and still fail its users: they can’t find it, misread it, or see it in broken Urdu with dates in the wrong order. <b>Usability testing</b> asks whether people can use the product effectively and comfortably. <b>Internationalization and localization testing</b> ask whether it works correctly for people in other languages, scripts, regions and time zones. Both need an eye for detail and empathy for users who are not like the team.' },
      { t: 'h', text: 'Nielsen’s 10 usability heuristics' },
      { t: 'table', head: ['Heuristic', 'What to look for'], rows: [
        ['1. Visibility of system status', 'Spinners, progress and confirmations, so users always know what is happening'],
        ['2. Match between system and the real world', 'The users’ words and familiar concepts, not internal jargon or error codes'],
        ['3. User control and freedom', 'Undo, cancel and back — a clear “emergency exit” from mistakes'],
        ['4. Consistency and standards', 'The same words and patterns everywhere, following platform conventions'],
        ['5. Error prevention', 'Confirmations for destructive actions and constraints that stop mistakes happening'],
        ['6. Recognition rather than recall', 'Options visible; no need to remember information from another screen'],
        ['7. Flexibility and efficiency of use', 'Shortcuts, saved details and sensible defaults for frequent users'],
        ['8. Aesthetic and minimalist design', 'No clutter competing with the information that matters'],
        ['9. Help users recognize, diagnose, and recover from errors', 'Plain-language messages that explain the problem and suggest a fix'],
        ['10. Help and documentation', 'Task-focused help that is easy to find when needed']
      ] },
      { t: 'list', items: [
        '<b>Five-second test</b>: show a screen briefly — can someone say what it is for and what to do next?',
        '<b>Task walk-through</b>: give a colleague outside the team a goal (“book a check-up for Friday”) and watch silently; note hesitations and wrong taps.',
        '<b>Count steps and fields</b> in key tasks; every extra one is a chance for users to give up.',
        '<b>Read every label and message aloud</b>: is it clear, polite and consistent?',
        '<b>Report with evidence</b>: the observation, the heuristic it breaks and the impact — so findings are not dismissed as opinion.'
      ] },
      { t: 'h', text: 'Internationalization vs localization' },
      { t: 'compare', a: { title: 'Internationalization (i18n)', items: ['Engineering the product so it <b>can</b> support many locales without code changes', 'Text kept out of code in resource files; Unicode everywhere', 'Layouts that grow with text and can mirror for right-to-left', 'Dates, numbers and currency formatted by locale-aware libraries', 'Tested early, often with pseudo-localization'] }, b: { title: 'Localization (l10n)', items: ['Adapting the product <b>for</b> one locale, such as ur-PK or ar-SA', 'Translating text and checking it in context on real screens', 'Local formats, currency, units, images and legal text', 'Cultural fit: names, addresses, phone formats, holidays', 'Tested per language, ideally with native speakers'] } },
      { t: 'h', text: 'What to test across languages and regions' },
      { t: 'table', head: ['Area', 'Example', 'What can go wrong'], rows: [
        ['Text expansion', '“Save” becomes “Speichern” in German; short labels can grow a lot', 'Clipped buttons, overlapping text, truncated menu items'],
        ['Right-to-left (RTL)', 'Urdu and Arabic are read right to left', 'Layout not mirrored, back arrows pointing the wrong way, mixed Urdu/English text in the wrong order'],
        ['Dates', 'en-US shows 3/4/2026 for 4 March; en-GB shows 04/03/2026', 'Appointments booked on the wrong day when formats are confused'],
        ['Numbers', '1,234,567.89 (en-US) · 12,34,567.89 (en-IN) · 1.234.567,89 (de-DE)', '“1.234” read as 1.234 instead of 1,234'],
        ['Currency', 'Rs 1,500 · ₹1,50,000.00 · 1.234,50 €', 'Wrong symbol position or decimals, or a currency hard-coded to $'],
        ['Names and addresses', 'Single names, long family names, no postcode', 'Required fields that real people cannot fill in']
      ] },
      { t: 'callout', tone: 'info', title: 'RTL is more than right-aligned text', html: 'With <code>dir="rtl"</code>, the whole layout should mirror: navigation, directional icons (back, next), progress indicators and the order of form elements. Some things must <b>not</b> mirror: logos, media play buttons, clocks, and numbers such as phone numbers and amounts. Urdu is usually written in the Nastaliq style, which needs more line height than Latin text — check that letters are not clipped at the top or bottom.' },
      { t: 'p', html: '<b>Pseudo-localization</b> finds i18n bugs before any translation exists. A tool replaces English text with accented, lengthened versions — “Save” becomes something like “[Šåvé ~~~]” — and can add RTL markers. Any text that stays plain English is hard-coded; a clipped bracket shows a layout that cannot grow; question marks or garbled characters show an encoding problem. It is cheap, fast and catches whole classes of defects at once.' },
      { t: 'code', lang: 'js', title: 'Locale-aware formatting and a Unicode surprise (outputs from Node.js)', code: `const n = 1234567.891;
new Intl.NumberFormat('en-US').format(n);  // "1,234,567.891"
new Intl.NumberFormat('en-IN').format(n);  // "12,34,567.891"
new Intl.NumberFormat('de-DE').format(n);  // "1.234.567,891"

const d = new Date(Date.UTC(2026, 2, 4));  // 4 March 2026 (months start at 0)
new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(d); // "3/4/2026"
new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' }).format(d); // "04/03/2026"

'😀'.length;       // 2 - UTF-16 code units, not visible characters
[...'😀'].length;  // 1 - code points` },
      { t: 'p', html: 'Use <b>UTF-8</b> end to end — forms, APIs, database, exports and emails. Test with Urdu, Hindi, Arabic, accented Latin and emoji, then look everywhere the text reappears: lists, PDFs, CSV exports, notifications. Length limits are tricky: one visible character can be several code units or bytes, so a byte-based “20-character” limit may reject a short Urdu name. For <b>time zones</b>, store times in UTC and display them in the user’s zone. Pakistan (UTC+5) and India (UTC+5:30) do not currently use daylight saving time, but many regions do, so test around clock changes, midnight and month ends.' }
    ],
    example: {
      title: 'Worked example: MediBook in Urdu (ur-PK)',
      blocks: [
        { t: 'p', html: 'MediBook is launching an Urdu interface for clinics in Pakistan. Translation is finished; the tester checks real screens together with a native speaker.' },
        { t: 'table', head: ['Finding', 'Type', 'Why it matters'], rows: [
          ['“Book appointment” button text clipped in Urdu', 'Text expansion / layout', 'Users cannot read the main action'],
          ['Back arrow still points left in the RTL layout', 'RTL mirroring', 'Directional icons must mirror'],
          ['Phone number 0300-1234567 shown with its parts reversed inside Urdu text', 'Bidirectional text', 'Numbers must keep their left-to-right order'],
          ['Reminder for a 9:00 AM appointment arrives at 2:00 PM', 'Time zone', 'Local time was treated as UTC: a 5-hour shift (PKT is UTC+5)'],
          ['Patient name “محمد علی” printed as “???? ???” on the PDF receipt', 'Encoding / fonts', 'The PDF export cannot handle Urdu text'],
          ['Fee shown as “$1,500”', 'Currency', 'Should be in rupees, e.g. Rs 1,500, for this market']
        ] },
        { t: 'p', html: 'None of these is a translator’s mistake. They are internationalization defects — layout, mirroring, encoding, time handling and a hard-coded currency — that pseudo-localization and a short RTL check could have caught weeks earlier, before translation even started.' }
      ]
    },
    explain: {
      'ur': 'Usability کا مطلب ہے کہ لوگ آسانی سے product استعمال کر سکیں؛ اس کے لیے Nielsen کے 10 heuristics، جیسے “system کی status دکھانا” اور “غلطی سے بچاؤ”، فوری جائزے میں مدد دیتے ہیں۔ Internationalization (i18n) کا مطلب ہے product کو اس طرح بنانا کہ وہ بہت سی زبانوں اور علاقوں کو سنبھال سکے، اور localization (l10n) کا مطلب ہے اسے کسی ایک زبان یا ملک کے لیے ڈھالنا، جیسے اردو ترجمہ اور روپے میں قیمت۔ مثال: اردو میں پورا layout دائیں سے بائیں (RTL) ہونا چاہیے، مگر فون نمبر اور رقم کے ہندسے الٹے نہیں ہونے چاہییں۔ تاریخ کا format (3/4/2026 کا مطلب 4 مارچ بھی ہو سکتا ہے اور 3 اپریل بھی)، Unicode والے نام اور time zone (پاکستان UTC+5) بھی ضرور ٹیسٹ کریں۔',
      'ur-Latn': 'Usability ka matlab hai ke log aasani se product istemal kar sakein; is ke liye Nielsen ke 10 heuristics, jaise “system ka status dikhana” aur “ghalti se bachao”, fori jaiza lene mein madad dete hain. Internationalization (i18n) ka matlab hai product ko is tarah banana ke woh bohat si languages aur regions ko sambhal sake, aur localization (l10n) ka matlab hai usay kisi ek zabaan ya mulk ke liye dhaalna, jaise Urdu tarjuma aur rupay mein qeemat. Misaal: Urdu mein poora layout right-to-left (RTL) hona chahiye, magar phone number aur raqam ke digits ulte nahi hone chahiyein. Date ka format (3/4/2026 ka matlab 4 March bhi ho sakta hai aur 3 April bhi), Unicode wale naam aur time zone (Pakistan UTC+5) bhi zaroor test karein.',
      'hi': 'Usability का मतलब है कि लोग आसानी से product इस्तेमाल कर सकें; इसके लिए Nielsen के 10 heuristics, जैसे “system की status दिखाना” और “ग़लती से बचाव”, जल्दी समीक्षा करने में मदद करते हैं। Internationalization (i18n) का मतलब है product को ऐसे बनाना कि वह कई भाषाओं और क्षेत्रों को संभाल सके, और localization (l10n) का मतलब है उसे किसी एक भाषा या देश के लिए ढालना, जैसे हिंदी अनुवाद और रुपये में क़ीमत। उदाहरण: Urdu या Arabic में पूरा layout दाएँ से बाएँ (RTL) होना चाहिए, लेकिन फ़ोन नंबर और रक़म के अंक उलटे नहीं होने चाहिए। तारीख़ का format (3/4/2026 का मतलब 4 मार्च भी हो सकता है और 3 अप्रैल भी), Unicode वाले नाम और time zone (भारत UTC+5:30) भी ज़रूर test करें।',
      'ar': 'تعني قابلية الاستخدام (usability) أن يستطيع الناس استخدام المنتج بسهولة، وتساعد مبادئ Nielsen العشرة، مثل «إظهار حالة النظام» و«منع الأخطاء»، على مراجعة سريعة. أما التدويل (internationalization أو i18n) فيعني بناء المنتج بحيث يستطيع دعم لغات ومناطق كثيرة، والتوطين (localization أو l10n) يعني تكييفه للغة أو بلد محدد، مثل الترجمة العربية وعرض الأسعار بالعملة المحلية. مثال: في العربية يجب أن ينعكس التخطيط كله من اليمين إلى اليسار (RTL)، لكن أرقام الهواتف والمبالغ يجب ألا تنقلب. واختبر أيضًا صيغة التاريخ (فـ 3/4/2026 قد تعني 4 مارس أو 3 أبريل)، والأسماء المكتوبة بـ Unicode، والمناطق الزمنية.',
      'es': 'La usabilidad (usability) significa que las personas pueden usar el producto con facilidad; las 10 heurísticas de Nielsen, como «visibilidad del estado del sistema» y «prevención de errores», ayudan a hacer una revisión rápida. La internacionalización (i18n) consiste en construir el producto para que pueda admitir muchos idiomas y regiones, y la localización (l10n) en adaptarlo a un idioma o país concreto, por ejemplo con la traducción al español y los precios en euros. Ejemplo: en urdu o árabe todo el diseño debe ir de derecha a izquierda (RTL), pero los números de teléfono y los importes no deben invertirse. Prueba también el formato de fecha (3/4/2026 puede ser 4 de marzo o 3 de abril), los nombres en Unicode y las zonas horarias.'
    },
    keyTerms: [
      { term: 'Usability heuristic', def: 'A broad rule of thumb for good interface design, such as Nielsen’s “Visibility of system status”, used for quick expert reviews.' },
      { term: 'Internationalization (i18n)', def: 'Designing and building a product so it can support many languages and regions without code changes.' },
      { term: 'Localization (l10n)', def: 'Adapting an internationalized product for one locale: translation, formats, currency, images and cultural details.' },
      { term: 'Locale', def: 'A language plus region setting, such as ur-PK or en-IN, that controls the language and the formats of dates, numbers and currency.' },
      { term: 'Pseudo-localization', def: 'Replacing UI text with lengthened, accented placeholder text to expose hard-coded strings, layout and encoding bugs early.' },
      { term: 'RTL (right-to-left)', def: 'Scripts such as Urdu and Arabic that are written right to left; the interface layout should mirror to match.' }
    ],
    practice: [
      { q: 'A ShopFlow checkout error says “ERR_PAY_402: Transaction declined by issuer.” Which heuristics does it break, and how would you rewrite it?', answer: 'It breaks <b>Match between system and the real world</b> (an internal code and banking jargon) and <b>Help users recognize, diagnose, and recover from errors</b> (no next step). Better: “Your bank declined this payment. Check your card details or try another card. You have not been charged.”' },
      { q: 'There are no translations yet, but Arabic and Urdu are planned for next quarter. What can you test now?', hint: 'You do not need real translations to find i18n bugs.', answer: 'Run a <b>pseudo-localized</b> build to find hard-coded strings, layouts that cannot grow and encoding problems. Switch the app to RTL (for example <code>dir="rtl"</code> or the platform’s RTL setting) and check mirroring. Enter Urdu and Arabic text in every field and follow it through storage, lists, exports and emails. Check that dates, numbers and currency come from locale-aware formatting, not hard-coded patterns.' },
      { q: 'A booking app shows the date “03/04/2026”. List the questions a tester should ask.', answer: 'Which locale is the user in — is this 3 April (en-GB style) or March 4 (en-US style)? Is the format taken from the user’s locale or hard-coded? Which time zone decides the date for an appointment near midnight? Would a less ambiguous format such as “4 Mar 2026” be clearer? Is the same date shown consistently in emails, SMS and PDFs?' }
    ],
    quiz: [
      { q: 'What is the difference between internationalization and localization?', options: ['i18n makes it ready for many locales; l10n adapts it to one', 'i18n means translating text; l10n means fixing layout bugs', 'They are two different names for exactly the same activity', 'i18n applies to websites, while l10n applies to mobile apps'], correct: 0,
        why: ['Right — internationalization is the engineering groundwork; localization is the per-locale adaptation built on it.', 'Translation is part of localization; layout readiness is part of internationalization.', 'They are related but distinct, and are tested at different times.', 'Both apply to any software, web or mobile.'] },
      { q: 'Which item should usually NOT be mirrored in a right-to-left layout?', options: ['The back arrow in the navigation bar', 'The order of steps in a progress indicator', 'A media play button', 'The position of the side menu'], correct: 2,
        why: ['Back arrows show direction, so they should point the other way in RTL.', 'Progress should flow in the reading direction, so it mirrors.', 'Right — media controls represent the direction of playback and are conventionally not mirrored, like logos and phone numbers.', 'Side menus usually move to the right-hand side in RTL.'] },
      { q: 'In a pseudo-localized build, “Checkout” appears as plain English on one screen while everything else looks like “[Çĥéçķôûţ ~~~]”. What does that indicate?', options: ['The translation file is simply missing the German entry', 'The font cannot display accented characters', 'The screen is too narrow for the longer text', 'The text is hard-coded, not loaded from resources'], correct: 3,
        why: ['Pseudo-localization does not depend on real translations; untouched text means the tool never saw that string.', 'A font problem would show boxes or broken characters, not untouched English.', 'Width problems show up as clipping or overlap, not plain text.', 'Right — the pseudo-localizer only transforms externalized strings, so plain English reveals a hard-coded string that translators would miss too.'] },
      { q: 'A “Display name” field limited to 20 characters rejects a short Urdu name with only 12 visible letters. What is the most likely cause?', options: ['Business rules simply do not allow Urdu names', 'The limit counts bytes, not visible characters', 'The user typed it with the wrong keyboard layout', 'The field accepts only uppercase Latin letters'], correct: 1,
        why: ['Nothing suggests a rule against Urdu; the field accepted the input but counted it wrongly.', 'Right — in UTF-8 each Urdu letter takes two bytes, so a byte-based limit of 20 is reached long before 20 visible characters.', 'The keyboard layout does not change the length of the stored text.', 'Urdu script has no letter case, and nothing suggests such a rule.'] },
      { q: 'A clinic in Lahore books a 9:00 AM appointment, but the reminder SMS says 2:00 PM. Which defect is most likely?', options: ['The SMS provider delays every message by five hours', 'The Urdu translation of the time is incorrect', 'Local time was treated as UTC (a 5-hour shift)', 'The date uses a month-first format, not day-first'], correct: 2,
        why: ['A delay would not change the time written inside the message, and would rarely be exactly five hours.', 'A translation error changes words, not the hour by a fixed amount.', 'Right — Pakistan is UTC+5; treating 9:00 local time as 9:00 UTC and converting it back to local time gives 14:00.', 'Date order affects the day and month, not the hour.'] }
    ],
    interview: [
      { q: 'How would you test an app that is being localized into Arabic or Urdu?', a: 'Before translations arrive, I run a <b>pseudo-localized</b> build to catch hard-coded strings, layouts that cannot expand and encoding problems. Then I switch to RTL and check the layout mirrors — navigation, directional icons, form order — while logos, media controls, phone numbers and amounts do not. I enter Arabic or Urdu text in every field and follow it through storage, search, exports, PDFs and notifications. I check locale formats for dates, numbers and currency, time-zone handling, and font rendering such as Nastaliq line height. Finally I review translated screens in context with a native speaker.' },
      { q: 'How do you give usability feedback without it sounding like personal opinion?', a: 'I tie each finding to <b>evidence</b> and a recognised principle. For example: “Three of five colleagues could not find the reschedule option within a minute — it is hidden in a menu, which goes against <i>recognition rather than recall</i>.” I describe the impact on users and the business, suggest options rather than a finished design, and separate clear defects (an error with no way to recover) from improvement ideas. Nielsen’s heuristics and short task observations keep the discussion about users, not taste.' }
    ],
    takeaways: [
      'Nielsen’s 10 heuristics turn “I don’t like it” into specific, explainable usability findings.',
      'i18n is engineering readiness for many locales; l10n is adapting the product for one.',
      'Pseudo-localization finds hard-coded text, layout and encoding bugs before translation starts.',
      'RTL mirrors the layout — but not logos, media controls, phone numbers or amounts.',
      'Use locale-aware formats, UTF-8 end to end, and store times in UTC.'
    ],
    links: { labs: ['ui'] }
  }
]);

/* ---------------------------------------------------------------- Test bank */
QA_CONTENT.addBank('web-mobile', [
  { level: 'beginner', topic: 'wm-web-basics', q: 'A logged-in PeopleOps employee opens the URL of another employee’s payslip and is correctly blocked. Which status code fits best?', options: ['401 Unauthorized', '400 Bad Request', '403 Forbidden', '500 Internal Server Error'], correct: 2,
    why: ['401 means not authenticated — but this user is signed in.', '400 means the request itself is malformed; the URL is valid.', 'Right — the user is authenticated but not authorized for that resource. (Some APIs deliberately return 404 to hide that it exists.)', '500 is a server failure, not a deliberate access decision.'] },
  { level: 'intermediate', topic: 'wm-web-basics', q: 'A response includes the header Cache-Control: no-cache. What does this tell the browser?', options: ['Store it if you like, but revalidate before each reuse', 'Never store this response anywhere, not even briefly', 'Reuse the stored copy for an hour without checking again', 'Delete every cookie that was set for this website'], correct: 0,
    why: ['Right — no-cache allows storing but requires checking with the server before a stored copy is reused.', 'That is <code>no-store</code>. The two names are easy to confuse, so read them carefully.', 'That would be something like <code>max-age=3600</code>.', 'Cache-Control is about cached responses; it does not touch cookies.'] },
  { level: 'beginner', topic: 'wm-devtools', q: 'Where in DevTools would you confirm that the session cookie has the HttpOnly and Secure flags set?', options: ['Console, by typing a command', 'Elements → Styles', 'Network → Timing', 'Application → Cookies'], correct: 3,
    why: ['Scripts in the Console cannot even see HttpOnly cookies, so they cannot confirm the flag.', 'Styles show CSS rules, not cookies.', 'Timing shows how long a request took, not cookie attributes.', 'Right — the Application panel (Storage in Firefox) lists each cookie with its HttpOnly, Secure, SameSite and expiry values.'] },
  { level: 'intermediate', topic: 'wm-devtools', q: 'A request shows as failed in the Network panel and the Console says it was blocked by CORS policy. What is the most accurate summary for the bug report?', options: ['The server crashed and returned a 500 Internal Server Error', 'The browser blocked it: the API does not allow this origin', 'The user’s internet connection dropped during the request', 'The button’s CSS stopped the click from reaching the page'], correct: 1,
    why: ['A 500 would appear as a status code, not as a CORS block.', 'Right — the browser enforced CORS because the API’s response did not permit the page’s origin. Developers fix this in the server’s CORS configuration.', 'A dropped connection gives a network error without a CORS message.', 'The click worked — a request was attempted.'] },
  { level: 'beginner', topic: 'wm-forms-ui', q: 'Which name is most likely to expose a database query built unsafely from user input?', options: ["O'Brien", 'Sam Lee', 'SAM', 'sam123'], correct: 0,
    why: ['Right — a single quote can break or alter a query (or a JavaScript string) that pastes input in directly instead of using parameters.', 'Plain letters and a space rarely break anything.', 'Uppercase letters test case handling, not query safety.', 'Letters and digits are safe characters for most queries.'] },
  { level: 'intermediate', topic: 'wm-forms-ui', q: 'A password manager fills the login form, but the Sign in button stays disabled until the user types a character. What is the most likely cause?', options: ['The password manager has saved an old, outdated password value', 'The server already rejected the credentials silently', 'Validation runs only on key presses, which autofill skips', 'The browser is serving a stale cached copy of the page'], correct: 2,
    why: ['A wrong password would fail on submit; it would not keep the button disabled.', 'Nothing has been submitted yet, so the server has not seen the credentials.', 'Right — autofill sets values without key presses, so logic tied only to key events never runs. Listening for input or change events usually fixes it.', 'A cached page would still enable the button if the logic were correct.'] },
  { level: 'intermediate', topic: 'wm-cross-browser', q: 'Your analytics show users on Chrome, Edge, Samsung Internet and Safari. With time for only two browsers, which pair covers both rendering engines in use?', options: ['Chrome and Edge', 'Edge and Samsung Internet', 'Chrome and Samsung Internet', 'Chrome and Safari'], correct: 3,
    why: ['Both use Blink, so WebKit users go untested.', 'Both are Blink-based browsers.', 'Both are Blink-based browsers.', 'Right — Chrome covers Blink and Safari covers WebKit; the others can follow when time allows.'] },
  { level: 'advanced', topic: 'wm-cross-browser', q: 'Which check best verifies WCAG success criterion 1.4.10 (Reflow) on a desktop web page?', options: ['Load the page over the slowest network profile you support', 'Zoom a 1280 px window to 400%; check for sideways scroll', 'Switch the operating system to dark mode and reload', 'Print the page to PDF and check that nothing is cut'], correct: 1,
    why: ['Network speed is unrelated to reflow.', 'Right — 1280 px at 400% zoom equals a 320 CSS px viewport; normal content should fit without horizontal scrolling.', 'Dark mode changes colours, not reflow.', 'Printing tests print styles, not reflow at narrow widths.'] },
  { level: 'beginner', topic: 'wm-mobile-basics', q: 'What is TestFlight used for?', options: ['Measuring the app’s performance on Android phones and tablets', 'Recording network traffic from a phone', 'Distributing beta builds of iOS apps to testers', 'Automating UI tests on iOS simulators'], correct: 2,
    why: ['TestFlight is an Apple service; it does not target Android.', 'Network capture uses proxy tools or DevTools-style inspectors, not TestFlight.', 'Right — TestFlight delivers pre-release iOS builds to internal and external testers.', 'UI automation on iOS uses XCUITest, directly or through tools such as Appium.'] },
  { level: 'intermediate', topic: 'wm-mobile-basics', q: 'After an update, signed-in users are logged out and their offline drafts are gone. Fresh installs work fine. What was most likely under-tested?', options: ['Upgrades from older versions with local data', 'The onboarding screens shown on the very first launch', 'The screenshots and text on the store listing page', 'Fresh installs on brand-new devices with no data'], correct: 0,
    why: ['Right — only existing users are affected, so the upgrade path with real local data (sessions, drafts) was not covered.', 'Onboarding affects new users, who are fine.', 'Store listing content cannot delete local data.', 'Fresh installs already work; the gap is in upgrades.'] },
  { level: 'intermediate', topic: 'wm-mobile-conditions', q: 'On the OTP screen, a user switches to the SMS app to copy the code and returns after 40 seconds. The OTP is valid for 5 minutes, but the app is back on the login screen. What should you report?', options: ['Nothing, since users should never leave the app during login', 'A performance problem inside the separate SMS app', 'A server outage that stopped the OTP from being delivered', 'State loss: a short app switch should keep the OTP screen'], correct: 3,
    why: ['Leaving the app to read an SMS is normal, expected behaviour.', 'The SMS app worked — the user copied the code.', 'The OTP arrived; the problem appeared after returning to the app.', 'Right — a short trip to the background should keep the screen and progress; report it with device, OS, build and timing, and check whether the app restarts its flow on resume.'] },
  { level: 'advanced', topic: 'wm-devices', q: 'Which statement about Appium 2 and later is correct?', options: ['Drivers such as UiAutomator2 come bundled and cannot be removed', 'Platform drivers are installed separately from the Appium server', 'Tests must be written in JavaScript because the server runs on Node.js', 'Appium can automate only native apps, not hybrid or web apps'], correct: 1,
    why: ['Since Appium 2, drivers are not bundled; you install the ones you need.', 'Right — drivers such as UiAutomator2 and XCUITest are installed separately, for example with the Appium command-line tool.', 'Client libraries exist for several languages, including Java, Python and JavaScript; the server’s language does not limit yours.', 'Appium automates native, hybrid and mobile web apps.'] },
  { level: 'intermediate', topic: 'wm-usability-l10n', q: 'A “Delete account” button acts immediately, with no confirmation and no undo. Which of these heuristics does it most directly violate?', options: ['Error prevention', 'Aesthetic and minimalist design', 'Help and documentation', 'Flexibility and efficiency of use'], correct: 0,
    why: ['Right — a destructive action needs a confirmation step to prevent costly slips. (The missing undo also breaks User control and freedom.)', 'Visual clutter is not the problem here.', 'Documentation cannot replace a safety check on a destructive action.', 'Efficiency matters, but not at the cost of irreversible mistakes.'] },
  { level: 'advanced', topic: 'wm-usability-l10n', q: 'A German admin enters a price of “1.234,50” and the system saves 1.23. What is the root problem?', options: ['German users are expected to type prices in US format', 'The font being used cannot display a comma correctly', 'Input is parsed as en-US, not by the user’s locale', 'The database rounds every price to two decimal places'], correct: 2,
    why: ['Forcing a foreign format on users is a localization defect, not a fix.', 'Fonts affect display, not the stored value.', 'Right — read as en-US, “1.234” is one point two three four and the rest is dropped; input must be parsed using the user’s locale, or the expected format clearly enforced.', 'Rounding to two decimals turns 1.234 into 1.23, but does not explain why one thousand became one.'] }
]);

/* ---------------------------------------------------------------- Drills */
QA_CONTENT.addDrills('web-mobile', [
  {
    id: 'wm-d1', type: 'classify', level: 'beginner',
    title: 'Cookie, localStorage or sessionStorage?',
    prompt: 'Each statement describes exactly one kind of browser storage. Assign it to the right one.',
    categories: ['Cookie', 'localStorage', 'sessionStorage'],
    items: [
      { text: 'Sent to the server automatically with every matching request', cat: 0, why: 'Only cookies travel with requests. Web storage stays in the browser unless code sends it.' },
      { text: 'Can be marked HttpOnly so page scripts cannot read it', cat: 0, why: '<b>HttpOnly</b> is a cookie attribute. Anything in localStorage or sessionStorage is always readable by scripts on the page.' },
      { text: 'Has an Expires or Max-Age attribute set by the server', cat: 0, why: 'Cookies get their lifetime from <code>Expires</code> or <code>Max-Age</code>; web storage has no expiry setting.' },
      { text: 'Keeps a dark-mode choice after the browser restarts, and is never sent to the server', cat: 1, why: 'localStorage persists until cleared and is not sent with requests.' },
      { text: 'Shared by every tab on the same origin and kept until code or the user clears it', cat: 1, why: 'localStorage is per origin and shared across tabs, with no automatic expiry.' },
      { text: 'Survives a page reload, but is gone once the tab is closed', cat: 2, why: 'sessionStorage lasts for the life of the tab, including reloads.' },
      { text: 'A brand-new tab on the same site cannot see it, even though the origin is the same', cat: 2, why: 'sessionStorage is scoped to a single tab as well as to the origin.' },
      { text: 'Good for one-tab wizard progress that must not leak into other tabs', cat: 2, why: 'Tab scope makes sessionStorage the natural fit for per-tab, temporary progress.' }
    ]
  },
  {
    id: 'wm-d2', type: 'order', level: 'beginner',
    title: 'Capture network evidence for a bug report',
    prompt: 'Put the steps for capturing clean, safe network evidence in the right order.',
    items: [
      'Reproduce the bug once and write down the exact steps',
      'Open DevTools on the Network panel before repeating the steps',
      'Turn on Preserve log and clear the existing entries',
      'Repeat the steps until the bug appears',
      'Inspect the failing request, then export a HAR file and take a screenshot',
      'Remove tokens, cookies and personal data from the HAR',
      'Attach the sanitized HAR, screenshot and time to the bug report'
    ],
    explain: 'DevTools must be open, with <b>Preserve log</b> on, <i>before</i> the failing steps run — requests made earlier are not recorded, and redirects would wipe the list. Clearing first keeps the evidence short. Sanitizing comes before attaching, because HAR files can contain session cookies, auth headers and personal data.'
  },
  {
    id: 'wm-d3', type: 'spot', level: 'intermediate',
    title: 'Weak claims in a responsive test summary',
    prompt: 'This is part of a release test summary for a booking page. Select every line whose claim is not justified by the testing described.',
    lines: [
      { text: 'Checked the booking page at 767, 768 and 769 px around the 768 px breakpoint.', flaw: false, why: 'Sound boundary thinking: on and either side of the breakpoint.' },
      { text: 'Verified on iPhone using Chrome’s device toolbar, so Safari testing is not needed.', flaw: true, why: 'The device toolbar still renders with Chrome’s Blink engine. Safari uses WebKit, so WebKit-specific bugs are untested.' },
      { text: 'Zoomed to 200% in Chrome on Windows; all labels and buttons stayed readable and usable.', flaw: false, why: 'A concrete, honest check of text resizing on a named browser.' },
      { text: 'Tested on the five newest flagship phones, which represents all our users.', flaw: true, why: 'Flagships hide memory and performance problems; a representative set comes from analytics and includes lower-end devices.' },
      { text: 'Rotated a real Android phone mid-booking; the entered data was kept.', flaw: false, why: 'A real-device orientation check with a stated result.' },
      { text: 'The layout looked fine at 1920 px, so smaller screens will be fine too.', flaw: true, why: 'Responsive bugs appear at narrow widths and breakpoints; a wide screen says nothing about them.' },
      { text: 'Not tested: foldables and Samsung Internet — listed as known gaps for the release decision.', flaw: false, why: 'Documenting gaps honestly is good practice, not a weakness.' },
      { text: 'Throttled the network to a slow profile in DevTools, so performance on real mobile networks is confirmed.', flaw: true, why: 'Throttling is a simulation; it does not reproduce packet loss, weak signal or network switching on real mobile networks.' }
    ]
  },
  {
    id: 'wm-d4', type: 'fill', level: 'beginner',
    title: 'Which DevTools panel answers it?',
    prompt: 'Type the name of the DevTools panel (Chrome/Edge names; Firefox names are accepted too) that best answers each question.',
    fields: [
      { label: 'Did clicking Save actually send a request, and what status came back?', accept: ['network', 'network panel', 'network tab', 'the network panel', 'the network tab', 'network monitor'], why: 'The <b>Network</b> panel lists every request with its method, URL, status and response.' },
      { label: 'Is the session cookie marked HttpOnly and Secure?', accept: ['application', 'application panel', 'application tab', 'storage', 'storage panel', 'storage tab', 'storage inspector'], why: 'The <b>Application</b> panel (Storage in Firefox) shows each cookie with its flags and expiry.' },
      { label: 'Which JavaScript error appeared when the button did nothing?', accept: ['console', 'console panel', 'console tab', 'the console', 'js console', 'javascript console', 'web console'], why: 'Uncaught errors, with file and line, appear in the <b>Console</b>.' },
      { label: 'Which CSS rule makes the Pay button overlap the footer?', accept: ['elements', 'elements panel', 'elements tab', 'the elements panel', 'styles', 'styles pane', 'inspector', 'inspector panel', 'inspector tab'], why: 'Inspect the button in <b>Elements</b> (Inspector in Firefox); the Styles pane shows which rules apply and which win.' },
      { label: 'What accessible name does a screen reader get for the icon-only search button?', accept: ['elements', 'elements panel', 'accessibility', 'accessibility pane', 'accessibility panel', 'accessibility tab', 'accessibility tree', 'inspector', 'accessibility inspector'], why: 'The <b>Accessibility</b> pane inside Elements (or Firefox’s Accessibility Inspector) shows the computed role and name.' },
      { label: 'What is stored in localStorage under the key guestCart?', accept: ['application', 'application panel', 'application tab', 'storage', 'storage panel', 'storage tab', 'storage inspector'], why: 'Local Storage entries are listed per origin in the <b>Application</b> panel (Storage in Firefox).' }
    ]
  }
]);
