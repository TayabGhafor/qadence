/* Qadence content · interview-focused additions (batch B):
   sql-api   → sa-rest-soap (n 9), sa-sql-advanced (n 10)
   code-git  → cg-oop (n 11), cg-coding-interview (n 12)
   automation → au-locators (n 12), au-selenium (n 13)
   plus their test-bank questions, drills sa-d6 / cg-d5 / au-d6 and visual guides.
   Schema: tools/CONTENT_SCHEMA.md · validate: node tools/validate-content.js --file lessons-additions-b.js */
QA_CONTENT.addLessons('sql-api', [
  {
    id: 'sa-rest-soap',
    n: 9,
    level: 'intermediate',
    title: 'REST, SOAP and GraphQL compared',
    summary: 'Compare REST, SOAP and GraphQL APIs, read a request in each style and adapt your assertions and tools to the style under test.',
    minutes: 22,
    objectives: [
      'Explain the REST constraints in plain terms and recognise a RESTful design',
      'Read a SOAP envelope, its WSDL contract and a SOAP fault',
      'Explain GraphQL queries, mutations, over-fetching and under-fetching',
      'Adapt assertions and tools to the API style you are testing'
    ],
    body: [
      { t: 'p', html: 'Most APIs you test will be <b>REST</b>, but many teams also run <b>SOAP</b> services — common in banking, insurance, telecom and older enterprise integrations — and a growing number of front-ends talk to a <b>GraphQL</b> API. Interviewers ask “What is the difference between REST and SOAP?” constantly. The honest answer is that they are not versions of one thing: REST is an <i>architectural style</i>, SOAP is a <i>messaging protocol</i> and GraphQL is a <i>query language</i>. Each choice changes what a correct response looks like, so it changes your assertions.' },
      { t: 'h', text: 'REST: an architectural style' },
      { t: 'p', html: 'REST (Representational State Transfer) is a set of design constraints, not a standard you can download. A REST API models data as <b>resources</b> with URLs, such as <code>/orders/5012</code>, and acts on them with HTTP methods. In practice many “REST APIs” are simply HTTP + JSON APIs that follow most of the constraints — that is fine for testing, because you test the documented contract either way. The six constraints in plain terms:' },
      { t: 'list', items: [
        '<b>Client–server</b> — the UI and the data store are separate, so each can change independently.',
        '<b>Stateless</b> — every request carries everything the server needs, such as a token; the server keeps no session between calls.',
        '<b>Cacheable</b> — responses say whether they may be cached, through headers like <code>Cache-Control</code> and <code>ETag</code>.',
        '<b>Uniform interface</b> — resources are identified by URLs and changed through representations (usually JSON) with standard methods and status codes.',
        '<b>Layered system</b> — the client cannot tell whether it talks to the server itself or to a gateway, cache or load balancer in between.',
        '<b>Code on demand</b> (optional) — the server may send executable code; APIs rarely use it.'
      ] },
      { t: 'h', text: 'SOAP: a protocol with a strict contract' },
      { t: 'p', html: 'SOAP is a W3C messaging protocol. Every message is an XML <b>Envelope</b> with an optional <b>Header</b> (security tokens, transaction ids) and a mandatory <b>Body</b> holding the request or response. The contract is a <b>WSDL</b> (Web Services Description Language) file that lists the operations, message formats, XSD data types and endpoint address; tools read it to generate request templates or client code. Over HTTP, SOAP typically uses <b>POST</b> to one URL per service, and the operation is named inside the Body (SOAP 1.1 also sends a <code>SOAPAction</code> header). SOAP is not tied to HTTP, and it has extension standards such as <b>WS-Security</b> for message-level signatures, encryption and username tokens. Errors come back as a <b>Fault</b> element.' },
      { t: 'code', lang: 'text', title: 'SOAP 1.1 request and fault (PayLite AccountService)', code: `POST /paylite/AccountService HTTP/1.1
Host: api.paylite.test
Content-Type: text/xml; charset=utf-8
SOAPAction: "http://paylite.test/account/GetBalance"

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:acc="http://paylite.test/account">
  <soapenv:Header/>
  <soapenv:Body>
    <acc:GetBalanceRequest>
      <acc:walletId>W-1042</acc:walletId>
    </acc:GetBalanceRequest>
  </soapenv:Body>
</soapenv:Envelope>

--- response when the wallet does not exist ---
HTTP/1.1 500 Internal Server Error
Content-Type: text/xml; charset=utf-8

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <soapenv:Fault>
      <faultcode>soapenv:Client</faultcode>
      <faultstring>Wallet W-1042 not found</faultstring>
    </soapenv:Fault>
  </soapenv:Body>
</soapenv:Envelope>` },
      { t: 'h', text: 'GraphQL: one endpoint, the client picks the fields' },
      { t: 'p', html: 'GraphQL is a query language and runtime with a <b>typed schema</b>. Clients usually send every operation as <code>POST /graphql</code> with a JSON body holding the <code>query</code> and its <code>variables</code>. <b>Queries</b> read, <b>mutations</b> write and <b>subscriptions</b> push live updates. The response mirrors the shape of the query, which solves <b>over-fetching</b> (a REST endpoint returns 40 fields when the screen needs 2) and <b>under-fetching</b> (the app needs five round trips to build one screen). The trade-offs: HTTP caching is harder when everything is a POST to one URL, deep nested queries can overload the server, and many servers return <b>HTTP 200</b> even when part of the query failed — with partial <code>data</code> next to an <code>errors</code> array.' },
      { t: 'code', lang: 'http', title: 'A GraphQL query with partial success', code: `POST /graphql HTTP/1.1
Host: api.shopflow.test
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "query Order($id: ID!) { order(id: $id) { id status total customer { name } } }",
  "variables": { "id": "5012" }
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "order": { "id": "5012", "status": "PAID", "total": 2400, "customer": null }
  },
  "errors": [
    { "message": "Not authorized to read customer", "path": ["order", "customer"] }
  ]
}` },
      { t: 'table', caption: 'REST, SOAP and GraphQL side by side', head: ['Aspect', 'REST', 'SOAP', 'GraphQL'], rows: [
        ['What it is', 'An architectural style (a set of constraints)', 'A messaging protocol (W3C)', 'A query language and runtime with a typed schema'],
        ['Message format', 'Usually JSON; XML and others possible', 'XML only, inside an Envelope', 'JSON request (query + variables) and JSON response'],
        ['Endpoints', 'Many URLs, one per resource', 'Usually one URL per service; the operation is named in the Body', 'Usually a single endpoint such as <code>/graphql</code>'],
        ['Operations', 'HTTP methods: GET, POST, PUT, PATCH, DELETE', 'Operations defined in the WSDL, typically sent with POST', '<code>query</code>, <code>mutation</code>, <code>subscription</code>'],
        ['Contract', 'Optional, often an OpenAPI description', 'WSDL with XSD types, used by almost every SOAP service', 'The schema itself, often readable through introspection'],
        ['Errors', 'HTTP status codes plus an error body', 'A <b>Fault</b> element; SOAP 1.1 returns it with HTTP 500', 'An <code>errors</code> array, often with HTTP 200 and partial data'],
        ['Caching', 'Straightforward for GET with HTTP caching headers', 'Rarely cached at the HTTP level', 'Harder: mostly POSTs to one URL, so caching moves into clients']
      ] },
      { t: 'h', text: 'What changes for testers' },
      { t: 'cards', items: [
        { title: 'Testing REST', html: 'Assert status code, headers and body together. Cover each method on each resource, idempotency of PUT and DELETE, and the OpenAPI contract. Status codes carry meaning, so a wrong code is a real defect.' },
        { title: 'Testing SOAP', html: 'Validate responses against the WSDL and XSD: namespaces, required elements and data types. Test faults (<code>Client</code> blames the request, <code>Server</code> blames the service) and WS-Security rules, such as an expired timestamp being rejected.' },
        { title: 'Testing GraphQL', html: 'Never stop at 200. Assert that <code>errors</code> is absent — or holds the expected code — and that <code>data</code> has exactly the requested fields. Test field-level authorization, nullability, variable validation and limits on query depth.' },
        { title: 'Same in all three', html: 'Authentication and authorization, negative inputs, performance, and proving persistence with a follow-up read. A success response is a claim, not proof that the right data was stored.' }
      ] },
      { t: 'callout', tone: 'tip', title: 'Tools you will hear about', html: '<b>Postman</b> sends all three: raw XML bodies for SOAP (it can also import a WSDL) and a GraphQL body mode that loads the schema. <b>SoapUI</b> imports a WSDL and generates a sample request for every operation. <b>REST Assured</b> is a Java library for API tests in code. Playwright’s <code>request</code> fixture sends any HTTP call from TypeScript — a GraphQL or SOAP call is just a POST with the right body and headers. Pick the tool your team already maintains; the assertions matter more than the tool.' }
    ],
    example: {
      title: 'Worked example: one negative test, three API styles',
      blocks: [
        { t: 'p', html: 'ShopFlow exposes order lookup three ways: a public REST API, a SOAP service used by a warehouse partner, and a GraphQL API for the new web app. The tester checks one rule everywhere: <i>looking up an order that does not exist returns a clear “not found” error and leaks nothing</i>. The rule is the same; the evidence differs by style.' },
        { t: 'table', head: ['Check', 'REST', 'SOAP 1.1', 'GraphQL'], rows: [
          ['Request', '<code>GET /orders/99999</code>', 'POST to <code>/OrderService</code> with GetOrder and orderId 99999', '<code>query { order(id: "99999") { id status } }</code>'],
          ['Expected status', '<b>404</b>', '<b>500</b> — normal for a SOAP 1.1 fault', 'Usually <b>200</b> — confirm in the contract'],
          ['Error evidence', 'JSON body such as <code>{"code": "ORDER_NOT_FOUND"}</code>', 'A Fault with faultcode <code>Client</code> and a clear faultstring', '<code>data.order</code> is null and <code>errors[0].extensions.code</code> is NOT_FOUND'],
          ['Must not happen', 'A 500, a stack trace, or 200 with an empty body', 'faultcode <code>Server</code>, or a stack trace in faultstring', 'Another customer’s order, or SQL text in <code>message</code>']
        ] },
        { t: 'code', lang: 'ts', title: 'The GraphQL row as a Playwright API test', code: `import { test, expect } from '@playwright/test';

test('unknown order returns NOT_FOUND, not a fake success', async ({ request }) => {
  const res = await request.post('/graphql', {
    data: {
      query: 'query Order($id: ID!) { order(id: $id) { id status } }',
      variables: { id: '99999' },
    },
  });

  expect(res.status()).toBe(200);                    // what this API's contract says
  const body = await res.json();
  expect(body.data.order).toBeNull();
  expect(body.errors).toHaveLength(1);
  expect(body.errors[0].extensions.code).toBe('NOT_FOUND');
  expect(body.errors[0].message).not.toContain('SELECT');   // no SQL leaking out
});` },
        { t: 'p', html: 'Three different status codes, one rule. A test that only asserted “status is 2xx” would pass a broken GraphQL response, and a tester who treated SOAP’s 500 as a crash would file a false bug. Read each style’s contract first, then assert the evidence that style actually provides.' }
      ]
    },
    explain: {
      'ur': 'API کے تین مشہور انداز ہیں۔ <b>REST</b> میں ہر چیز ایک resource ہے جس کا اپنا URL ہوتا ہے، جیسے /orders/5012، اور آپ GET، POST، DELETE جیسے HTTP methods سے کام کرتے ہیں؛ جواب JSON اور status code کے ساتھ آتا ہے۔ <b>SOAP</b> ایک سخت protocol ہے: ہر پیغام XML کے Envelope میں ہوتا ہے اور اس کا contract ایک WSDL فائل میں لکھا ہوتا ہے۔ غلطی ہو تو Fault واپس آتا ہے، اور SOAP 1.1 میں یہ HTTP 500 کے ساتھ آتا ہے۔ <b>GraphQL</b> میں عموماً ایک ہی endpoint ہوتا ہے اور client خود بتاتا ہے کہ اسے کون سے fields چاہییں۔ مثال: order کا صرف status اور total مانگیں تو بس وہی ملے گا۔ Tester کے لیے سبق: GraphQL میں 200 کا مطلب ہمیشہ کامیابی نہیں، اس لیے errors array بھی ضرور چیک کریں۔',
      'ur-Latn': 'API ke teen mashhoor andaaz hain. <b>REST</b> mein har cheez ek resource hai jiska apna URL hota hai, jaise /orders/5012, aur aap GET, POST, DELETE jaise HTTP methods se kaam karte hain; jawab JSON aur status code ke saath aata hai. <b>SOAP</b> ek sakht protocol hai: har message XML ke Envelope mein hota hai aur us ka contract ek WSDL file mein likha hota hai. Ghalti ho to Fault wapas aata hai, aur SOAP 1.1 mein woh HTTP 500 ke saath aata hai. <b>GraphQL</b> mein aksar ek hi endpoint hota hai aur client khud batata hai ke usay kaun se fields chahiye. Misaal: order ka sirf status aur total maangein to bas wohi milega. Tester ke liye sabaq: GraphQL mein 200 ka matlab hamesha kamyabi nahi, is liye errors array bhi zaroor check karein.',
      'hi': 'API के तीन मशहूर तरीक़े हैं। <b>REST</b> में हर चीज़ एक resource है जिसका अपना URL होता है, जैसे /orders/5012, और आप GET, POST, DELETE जैसे HTTP methods से काम करते हैं; जवाब JSON और status code के साथ आता है। <b>SOAP</b> एक सख़्त protocol है: हर message XML के Envelope में होता है और उसका contract एक WSDL फ़ाइल में लिखा होता है। गलती होने पर Fault लौटता है, और SOAP 1.1 में वह HTTP 500 के साथ आता है। <b>GraphQL</b> में अक्सर एक ही endpoint होता है और client खुद बताता है कि उसे कौन-से fields चाहिए। उदाहरण: order का सिर्फ़ status और total माँगें तो बस वही मिलेगा। Tester के लिए सबक: GraphQL में 200 का मतलब हमेशा सफलता नहीं है, इसलिए errors array भी ज़रूर जाँचें।',
      'ar': 'هناك ثلاثة أنماط شائعة لواجهات API. في <b>REST</b> كل شيء مورد (resource) له عنوان URL خاص، مثل /orders/5012، وتتعامل معه بطرق HTTP مثل GET وPOST وPUT وDELETE، ويأتي الرد عادةً بصيغة JSON مع status code. أما <b>SOAP</b> فهو بروتوكول صارم: كل رسالة داخل Envelope بصيغة XML، وتُرسل غالبًا بطريقة POST، وعقدها مكتوب في ملف WSDL. وعند حدوث خطأ يعود عنصر Fault، وفي SOAP 1.1 يأتي مع HTTP 500. وفي <b>GraphQL</b> توجد غالبًا نقطة نهاية (endpoint) واحدة، ويحدد العميل الحقول التي يريدها بالضبط. مثال: إذا طلبت status وtotal فقط لطلب ما، فستحصل عليهما فقط. الدرس للمختبِر: في GraphQL لا يعني الرمز 200 النجاح دائمًا، لذلك افحص مصفوفة errors أيضًا.',
      'es': 'Hay tres estilos de API muy comunes. En <b>REST</b> todo es un recurso con su propia URL, como /orders/5012, y se trabaja con métodos HTTP como GET, POST, PUT y DELETE; la respuesta suele ser JSON con un status code. <b>SOAP</b> es un protocolo estricto: cada mensaje va dentro de un Envelope XML, normalmente se envía con POST y su contrato está descrito en un archivo WSDL. Si algo falla, vuelve un Fault, y en SOAP 1.1 llega con HTTP 500. En <b>GraphQL</b> suele haber un único endpoint y el cliente pide exactamente los campos que necesita. Ejemplo: si pides solo status y total de un pedido, recibes solo eso. La lección para el tester: en GraphQL un 200 no siempre significa éxito, así que revisa también el array errors.'
    },
    keyTerms: [
      { term: 'REST', def: 'An architectural style: resources at URLs, standard HTTP methods, stateless requests and, usually, JSON bodies.' },
      { term: 'SOAP', def: 'An XML messaging protocol: every message is an Envelope with an optional Header and a mandatory Body.' },
      { term: 'WSDL', def: 'Web Services Description Language: the XML contract listing a SOAP service’s operations, messages, data types and address.' },
      { term: 'SOAP Fault', def: 'The standard error element inside a SOAP Body, with a code (Client or Server in SOAP 1.1) and a readable reason.' },
      { term: 'GraphQL', def: 'A query language for APIs with a typed schema and usually one endpoint, where clients request exactly the fields they need.' },
      { term: 'Over- and under-fetching', def: 'Receiving more data than a screen needs, or too little, so that extra requests are required to build it.' }
    ],
    practice: [
      { q: 'Read the SOAP request in this lesson. Name the operation, where its input sits, and three things you would assert on a successful response.', answer: 'The operation is <b>GetBalance</b>, named by the <code>GetBalanceRequest</code> element in the Body (and by the <code>SOAPAction</code> header). The input is <code>walletId</code> inside the Body. On success assert: (1) HTTP 200 and a Body holding a <code>GetBalanceResponse</code>, with no Fault; (2) the response validates against the XSD in the WSDL — required elements, correct namespace, a decimal balance; (3) the business values — the wallet id echoes W-1042, the balance and currency match the test data. Then send an unknown wallet and expect a Fault with faultcode <code>Client</code>.' },
      { q: 'ShopFlow’s mobile home screen calls <code>GET /customers/7</code> (38 fields, the screen shows 2), then <code>GET /customers/7/orders</code>, then <code>GET /orders/{id}</code> for each of the three latest orders. Name the two problems and write one GraphQL query that replaces the five calls.', hint: 'One problem is about too much data, the other about too many round trips.', answer: '<b>Over-fetching</b>: 36 unused fields travel over a mobile network. <b>Under-fetching</b>: one call is not enough, so the app makes five round trips. One query fixes both, for example <code>query { customer(id: "7") { name avatarUrl orders(last: 3) { id status total } } }</code>. Real field and argument names come from the schema — read it before you write tests.' },
      { q: 'List five checks for the GraphQL mutation <code>createOrder(input: { productId, quantity })</code> beyond “status is 200”.', answer: '(1) A valid input returns <code>data.createOrder.id</code> and no <code>errors</code>, and a follow-up query or read-only DB check proves the order persisted. (2) <code>quantity: 0</code> or a string returns a validation error in <code>errors</code> and creates nothing. (3) A missing or expired token is rejected the way the contract says (HTTP 401 or an UNAUTHENTICATED error code). (4) A customer cannot create an order on another customer’s behalf. (5) Requesting a field that does not exist fails schema validation. Bonus: sending the same mutation twice behaves as specified.' },
      { q: 'PayLite is replacing its SOAP <code>GetBalance</code> operation with <code>GET /wallets/{id}/balance</code>. Which checks would you plan for the migration?', answer: 'Compare old and new responses for the same wallets: values, decimal precision, currency and rounding. Map every Fault to its REST equivalent — unknown wallet → 404, bad input → 400, missing credentials → 401, someone else’s wallet → 403 (or 404 by design). Replace WS-Security tests with token tests. Confirm consumers still on SOAP keep working until the cut-over date, performance is no worse, and monitoring that parsed Faults now reads status codes.' }
    ],
    quiz: [
      { q: 'Which statement about SOAP is accurate?', options: ['It is an architectural style that any JSON API can follow', 'It is an XML messaging protocol whose contract is usually a WSDL', 'It needs a separate URL for every operation, like REST resources', 'It can only be sent over HTTP, using the GET method'], correct: 1,
        why: ['That describes REST. SOAP is a protocol with a fixed XML message format.', 'Right — every SOAP message is an XML Envelope, and the WSDL lists its operations, messages and types.', 'SOAP services usually expose one URL and name the operation inside the Body.', 'SOAP is not tied to HTTP, and over HTTP it typically uses POST.'] },
      { q: 'A GraphQL response is HTTP 200. data.order is filled in except customer, which is null, and errors holds one entry whose path is ["order", "customer"]. What does this mean?', options: ['The whole query failed, so every field in data should be ignored', 'The server crashed internally, so the response should have been a 500', 'The query fully succeeded, because the status code is 200', 'Partial success: the order resolved, but the customer field failed'], correct: 3,
        why: ['The order fields resolved normally; only the field named in path failed.', 'A handled field error is not a crash, and GraphQL servers often return 200 for it.', 'In GraphQL the status alone proves little — the errors array reports a failure.', 'Right — GraphQL can return partial data, and path shows exactly which field failed and why it is null.'] },
      { q: 'Which REST constraint means the server keeps no client session between requests, so every request must carry its own token?', options: ['Stateless', 'Cacheable', 'Layered system', 'Uniform interface'], correct: 0,
        why: ['Right — each request is self-contained; the server does not remember earlier calls.', 'Cacheable is about responses declaring whether they may be cached.', 'Layered system means intermediaries such as gateways can sit between client and server.', 'Uniform interface is about URLs, representations and standard methods.'] },
      { q: 'In a negative test you omit walletId from a SOAP 1.1 GetBalance request. The response is HTTP 500 with a Fault: faultcode Client, faultstring “walletId is required”. How should you read it?', options: ['A server crash — log a critical defect because the status is 500', 'A pass for the server — it answered, so the test proves nothing', 'Expected behaviour — SOAP 1.1 sends faults with HTTP 500, and Client blames the request', 'A protocol violation — SOAP faults must always use HTTP 400'], correct: 2,
        why: ['In SOAP 1.1 a fault normally travels with HTTP 500; the faultcode tells you who is at fault.', 'The test proved something useful: the missing field was rejected with a clear, correct fault.', 'Right — check the faultcode and faultstring, not just the status, to judge a SOAP response.', 'SOAP 1.1 specifies HTTP 500 for faults; 400 is not required.'] },
      { q: 'A mobile home screen needs a customer’s name, their last three orders and each order’s status. With the REST API it makes five calls. Which GraphQL benefit addresses this most directly?', options: ['Browsers and CDNs cache every GraphQL response automatically', 'One query can fetch the related data in a single round trip', 'Errors are always returned with HTTP 4xx status codes', 'Read queries do not need any authentication'], correct: 1,
        why: ['GraphQL makes HTTP caching harder, not automatic, because most calls are POSTs to one URL.', 'Right — that is the under-fetching problem GraphQL was designed to solve.', 'Many GraphQL servers return errors with HTTP 200.', 'Authentication still applies to every operation.'] }
    ],
    interview: [
      { q: 'What is the difference between REST and SOAP?', a: '<b>REST</b> is an architectural style: resources identified by URLs, standard HTTP methods, stateless requests, usually JSON, and status codes that signal the outcome. <b>SOAP</b> is a protocol: every message is an XML Envelope, the contract is a WSDL with XSD types, requests are typically POSTs to one endpoint, and errors come back as Faults — in SOAP 1.1 with HTTP 500. SOAP brings standards such as WS-Security for message-level signing and encryption, which is one reason banks and insurers still use it; REST is lighter and dominates public and mobile APIs. As a tester, with REST I lean on status codes, methods and the OpenAPI spec; with SOAP I validate against the WSDL and test faults and security headers.' },
      { q: 'How would you test a GraphQL API differently from a REST API?', a: 'The transport is still HTTP, so authentication, performance and negative testing carry over, but the assertions change. There is usually one endpoint, so I cover <b>operations</b> — each query and mutation — rather than URLs. I never stop at the status code: many servers return 200 when a resolver fails, so I assert that <code>errors</code> is absent or holds the expected code, and that <code>data</code> has exactly the requested fields. I test field-level authorization (another customer’s email inside a nested query), variable validation, nullability and partial data, plus abuse cases such as very deep queries, which should hit a depth or complexity limit.' }
    ],
    takeaways: [
      'REST is an architectural style built on resources, HTTP methods and status codes.',
      'SOAP is an XML protocol with a WSDL contract; Faults signal errors, in SOAP 1.1 with HTTP 500.',
      'GraphQL usually has one endpoint and clients choose the fields; check the errors array, not just 200.',
      'Match your assertions to the style: status codes for REST, schema and faults for SOAP, data and errors for GraphQL.'
    ],
    links: { labs: ['api'], challenges: ['api-contract'], interview: ['a1', 'a4'] }
  },
  {
    id: 'sa-sql-advanced',
    n: 10,
    level: 'advanced',
    title: 'SQL interview queries: subqueries, ranking and window functions',
    summary: 'Solve the SQL questions interviewers ask most — Nth highest salary, duplicates, self-joins, EXISTS — and explain ties, NULLs and dialect differences.',
    minutes: 28,
    objectives: [
      'Find the second and Nth highest value three ways and explain how each handles ties',
      'Find and safely remove duplicate rows with GROUP BY … HAVING and ROW_NUMBER',
      'Write self-joins and correlated subqueries, and choose between EXISTS and IN',
      'Explain UNION vs UNION ALL, DELETE vs TRUNCATE vs DROP, and what indexes change'
    ],
    body: [
      { t: 'p', html: 'SQL rounds for QA roles often include the same few puzzles: the second highest salary, duplicate rows, an employee who earns more than their manager, and “what is the difference between…” questions. Interviewers care less about memorised syntax than about how you handle <b>ties, NULLs and empty results</b> — exactly the edge cases a tester should think about. Every query below uses the PeopleOps <code>employees</code> table and runs on PostgreSQL and SQLite; dialect differences are noted. Predict each result before you read the comment.' },
      { t: 'table', caption: 'employees (PeopleOps test data)', head: ['emp_id', 'name', 'dept', 'salary', 'manager_id'], rows: [
        ['1', 'Ayesha', 'Engineering', '9000', '<i>NULL</i>'],
        ['2', 'Bilal', 'Engineering', '7500', '1'],
        ['3', 'Chen', 'Engineering', '7500', '1'],
        ['4', 'Divya', 'QA', '6000', '1'],
        ['5', 'Omar', 'QA', '6400', '4'],
        ['6', 'Sara', 'QA', '5200', '4']
      ] },
      { t: 'h', text: 'Second and Nth highest salary' },
      { t: 'code', lang: 'sql', title: 'Three ways to get the second highest salary', code: `-- 1) DISTINCT + LIMIT/OFFSET (MySQL, PostgreSQL, SQLite)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;          -- 7500   (Nth highest: OFFSET N-1)

-- 2) Subquery with MAX (works in almost every database)
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);   -- 7500

-- 3) DENSE_RANK window function (also returns the people)
SELECT name, salary
FROM (
  SELECT name, salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) AS ranked
WHERE rnk = 2;             -- Bilal 7500, Chen 7500` },
      { t: 'table', caption: 'ROW_NUMBER() OVER (ORDER BY salary DESC, emp_id) · RANK() and DENSE_RANK() OVER (ORDER BY salary DESC)', head: ['name', 'salary', 'ROW_NUMBER', 'RANK', 'DENSE_RANK'], rows: [
        ['Ayesha', '9000', '1', '1', '1'],
        ['Bilal', '7500', '2', '2', '2'],
        ['Chen', '7500', '3', '<b>2</b>', '<b>2</b>'],
        ['Omar', '6400', '4', '<b>4</b> (gap)', '<b>3</b> (no gap)'],
        ['Divya', '6000', '5', '5', '4'],
        ['Sara', '5200', '6', '6', '5']
      ] },
      { t: 'callout', tone: 'key', title: 'Ties decide the answer', html: 'Before writing, ask: “second highest <i>salary</i>, or second highest-paid <i>person</i>?” With 9000, 7500, 7500 the second distinct salary is 7500 — paid to two people. Without <code>DISTINCT</code>, <code>LIMIT 1 OFFSET 2</code> returns 7500 again instead of the third highest, 6400. Agree what “no answer” looks like too: the MAX version returns one row containing NULL, the LIMIT version returns no rows. And window functions are computed <i>after</i> WHERE, so a rank alias can only be filtered in an outer query or a CTE.' },
      { t: 'h', text: 'Duplicates, self-joins and correlated subqueries' },
      { t: 'code', lang: 'sql', title: 'Find and remove duplicate sign-ups', code: `-- signups (id, email): 1 asha, 2 bilal, 3 asha, 4 chen, 5 bilal, 6 asha
SELECT email, COUNT(*) AS copies
FROM signups
GROUP BY email
HAVING COUNT(*) > 1;            -- asha 3, bilal 2

-- Show every extra copy, keeping the lowest id per email
SELECT id, email
FROM (
  SELECT id, email,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM signups
) AS numbered
WHERE rn > 1;                   -- ids 3, 5, 6

-- Remove the extras (own test data only, inside a transaction)
DELETE FROM signups
WHERE id NOT IN (SELECT MIN(id) FROM signups GROUP BY email);   -- keeps 1, 2, 4
-- MySQL rejects a subquery on the table being deleted from;
-- wrap it: (SELECT keep_id FROM (SELECT MIN(id) AS keep_id ...) AS k)` },
      { t: 'code', lang: 'sql', title: 'Self-join, correlated subquery, EXISTS', code: `-- Self-join: who earns more than their manager?
SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.emp_id = e.manager_id
WHERE e.salary > m.salary;      -- Omar 6400, manager Divya 6000

-- Correlated subquery: paid above their own department's average
SELECT e.name, e.dept, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary)
                  FROM employees x
                  WHERE x.dept = e.dept);   -- Ayesha, Divya, Omar

-- EXISTS: managers with at least one report
SELECT m.name
FROM employees m
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.manager_id = m.emp_id);
-- Ayesha, Divya

-- NOT EXISTS: people who manage nobody
SELECT m.name
FROM employees m
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.manager_id = m.emp_id);
-- Bilal, Chen, Omar, Sara` },
      { t: 'p', html: 'A <b>self-join</b> treats one table as two: <code>e</code> is the employee and <code>m</code> is the manager row it points to. A <b>correlated subquery</b> refers to the outer row (<code>x.dept = e.dept</code>), so it is conceptually evaluated once per employee. <b>EXISTS</b> only asks “is there at least one matching row?” and can stop at the first match; <b>IN</b> compares a value with a list, and modern optimisers often run both the same way. The real difference is NULL: Ayesha’s <code>manager_id</code> is NULL, so <code>emp_id NOT IN (SELECT manager_id FROM employees)</code> returns <i>no rows</i>, while NOT EXISTS correctly returns the four non-managers.' },
      { t: 'h', text: 'Comparisons interviewers love' },
      { t: 'compare',
        a: { title: 'UNION', items: ['Combines two result sets and <b>removes duplicate rows</b>', 'Needs a sort or hash step to find duplicates, so it is slower on big sets', 'Use it for a distinct list, such as every email that appears in either table', 'Both queries need the same number of columns with compatible types'] },
        b: { title: 'UNION ALL', items: ['Combines two result sets and <b>keeps every row</b>, duplicates included', 'No de-duplication step, so it is faster', 'Use it for totals and reconciliation, where a row present in both sources must count twice', 'Column names in the result come from the first query'] } },
      { t: 'table', caption: 'SQLite has no TRUNCATE; a DELETE without WHERE is optimised internally instead.', head: ['Aspect', 'DELETE', 'TRUNCATE', 'DROP'], rows: [
        ['Removes', 'Rows matching WHERE, or all rows', 'All rows; the table stays', 'The table itself: structure, data, indexes'],
        ['WHERE clause', 'Yes', 'No', 'No'],
        ['Category', 'DML', 'DDL in most databases', 'DDL'],
        ['Rollback', 'Yes, inside a transaction', 'Depends: PostgreSQL and SQL Server can roll it back in a transaction; MySQL and Oracle commit implicitly', 'Depends on the database, like TRUNCATE'],
        ['Row triggers', 'Fire for each deleted row', 'Do not fire', 'Not applicable'],
        ['Identity / auto-increment', 'Not reset', 'Usually reset (MySQL, SQL Server); PostgreSQL only with <code>RESTART IDENTITY</code>', 'Gone with the table']
      ] },
      { t: 'callout', tone: 'info', title: 'Indexes and dialects', html: '<b>Indexes</b> are lookup structures — usually B-trees — that make WHERE, JOIN and ORDER BY on the indexed columns fast, at the cost of storage and slower writes. They change speed, never the rows returned; a <b>unique</b> index also rejects duplicate values, which is worth a test of its own. <code>EXPLAIN</code> (<code>EXPLAIN QUERY PLAN</code> in SQLite) shows whether a slow query uses one. <b>Dialects:</b> LIMIT/OFFSET works in MySQL, PostgreSQL and SQLite; SQL Server uses <code>TOP</code> or <code>OFFSET … FETCH</code>, and Oracle 12c+ uses <code>FETCH FIRST n ROWS ONLY</code>. Window functions need MySQL 8.0+ or SQLite 3.25+.' }
    ],
    example: {
      title: 'Worked example: is the “top 2 earners per department” report right?',
      blocks: [
        { t: 'p', html: 'The PeopleOps dashboard shows the two highest earners in each department. For Engineering it lists Ayesha (9000) and Bilal (7500). The tester knows Chen also earns 7500, so instead of trusting the screen she writes an independent query against the same test database.' },
        { t: 'code', lang: 'sql', title: 'Independent check with DENSE_RANK per department', code: `SELECT dept, name, salary, rnk
FROM (
  SELECT dept, name, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
) AS ranked
WHERE rnk <= 2
ORDER BY dept, rnk, name;` },
        { t: 'table', head: ['dept', 'name', 'salary', 'rnk'], rows: [
          ['Engineering', 'Ayesha', '9000', '1'],
          ['Engineering', 'Bilal', '7500', '2'],
          ['Engineering', '<b>Chen</b>', '7500', '2'],
          ['QA', 'Omar', '6400', '1'],
          ['QA', 'Divya', '6000', '2']
        ] },
        { t: 'p', html: 'The query returns <b>five</b> rows; the dashboard shows four. A developer confirms the report uses <code>ROW_NUMBER() … WHERE rn &lt;= 2</code>, which breaks the Bilal/Chen tie arbitrarily — on another day Chen could appear instead of Bilal. Whether ties should be shown is a <b>business rule</b>, so the tester reports the evidence (both queries and both results) and asks the product owner to decide, rather than declaring one version correct.' }
      ]
    },
    explain: {
      'ur': 'SQL interview میں چند سوال بار بار آتے ہیں۔ سب سے مشہور: “دوسری سب سے زیادہ salary نکالیں”۔ اگر salaries 9000، 7500، 7500، 6400 ہوں تو دوسری سب سے زیادہ salary 7500 ہے اور تیسری 6400 — لیکن DISTINCT کے بغیر LIMIT 1 OFFSET 2 غلطی سے 7500 دے گا۔ اس لیے پہلے پوچھیں کہ ties کا کیا کرنا ہے۔ <b>DENSE_RANK</b> برابر salaries کو ایک ہی rank دیتا ہے اور بیچ میں gap نہیں چھوڑتا، اس لیے Nth highest کے لیے بہترین ہے۔ Duplicate records ڈھونڈنے کے لیے GROUP BY email HAVING COUNT(*) > 1 لکھیں۔ Self-join میں ایک ہی table کو دو نام دے کر جوڑتے ہیں، جیسے employee اور اس کا manager۔ ہر query چلانے سے پہلے نتیجے کا اندازہ لگائیں، پھر ملا کر دیکھیں۔',
      'ur-Latn': 'SQL interview mein kuch sawal baar baar aate hain. Sab se mashhoor: “second highest salary nikaalein”. Agar salaries 9000, 7500, 7500, 6400 hon to second highest 7500 hai aur third highest 6400 — lekin DISTINCT ke baghair LIMIT 1 OFFSET 2 ghalti se 7500 dega. Is liye pehle poochein ke ties ka kya karna hai. <b>DENSE_RANK</b> barabar salaries ko ek hi rank deta hai aur beech mein gap nahi chhorta, is liye Nth highest ke liye behtareen hai. Duplicate records dhoondne ke liye GROUP BY email HAVING COUNT(*) > 1 likhein. Self-join mein ek hi table ko do naam de kar jorte hain, jaise employee aur us ka manager. Har query chalane se pehle result ka andaaza lagayein, phir mila kar dekhein.',
      'hi': 'SQL interview में कुछ सवाल बार-बार आते हैं। सबसे मशहूर: “second highest salary निकालें”। अगर salaries 9000, 7500, 7500, 6400 हों तो second highest 7500 है और third highest 6400 — लेकिन DISTINCT के बिना LIMIT 1 OFFSET 2 गलती से 7500 देगा। इसलिए पहले पूछें कि ties का क्या करना है। <b>DENSE_RANK</b> बराबर salaries को एक ही rank देता है और बीच में gap नहीं छोड़ता, इसलिए Nth highest के लिए सबसे अच्छा है। Duplicate records ढूँढने के लिए GROUP BY email HAVING COUNT(*) > 1 लिखें। Self-join में एक ही table को दो नाम देकर जोड़ते हैं, जैसे employee और उसका manager। हर query चलाने से पहले नतीजे का अंदाज़ा लगाएँ, फिर मिलाकर देखें।',
      'ar': 'تتكرر بعض الأسئلة كثيرًا في مقابلات SQL، وأشهرها: «أوجد ثاني أعلى راتب». إذا كانت الرواتب 9000 و7500 و7500 و6400، فثاني أعلى راتب هو 7500 وثالثها 6400، لكن LIMIT 1 OFFSET 2 بدون DISTINCT سيعيد 7500 خطأً. لذلك اسأل أولًا: كيف نتعامل مع القيم المتساوية (ties)؟ الدالة <b>DENSE_RANK</b> تعطي الرواتب المتساوية الترتيب نفسه دون ترك فجوة، لذا فهي الأنسب لإيجاد N-th أعلى قيمة. ولإيجاد السجلات المكررة اكتب GROUP BY email HAVING COUNT(*) > 1. وفي الـ self-join نربط الجدول بنفسه باسمين مختلفين، مثل الموظف ومديره. توقّع النتيجة قبل تشغيل أي استعلام، ثم قارن.',
      'es': 'En las entrevistas de SQL algunas preguntas se repiten mucho. La más famosa: «obtén el segundo salario más alto». Si los salarios son 9000, 7500, 7500 y 6400, el segundo más alto es 7500 y el tercero 6400, pero LIMIT 1 OFFSET 2 sin DISTINCT devuelve 7500 por error. Por eso, pregunta primero qué hacer con los empates (ties). <b>DENSE_RANK</b> da el mismo puesto a salarios iguales sin dejar huecos, así que es ideal para el N-ésimo más alto. Para encontrar duplicados escribe GROUP BY email HAVING COUNT(*) > 1. En un self-join unes una tabla consigo misma con dos alias, como el empleado y su manager. Antes de ejecutar una consulta, predice el resultado y luego compáralo.'
    },
    keyTerms: [
      { term: 'Correlated subquery', def: 'A subquery that refers to the outer query’s current row, such as x.dept = e.dept, so it is evaluated once per outer row.' },
      { term: 'Window function', def: 'A function such as ROW_NUMBER or DENSE_RANK computed over a set of rows with OVER (…), without collapsing them into one row.' },
      { term: 'DENSE_RANK', def: 'Ranks rows so that ties share a rank and the next rank follows without a gap: 1, 2, 2, 3.' },
      { term: 'Self-join', def: 'Joining a table to itself under two aliases, for example employees e joined to employees m on e.manager_id = m.emp_id.' },
      { term: 'EXISTS', def: 'True as soon as the subquery finds one row. NOT EXISTS is the NULL-safe way to check that no matching row exists.' },
      { term: 'Index', def: 'A lookup structure, usually a B-tree, that speeds up searches on columns. It changes speed, never the rows returned.' }
    ],
    practice: [
      { q: 'Using this lesson’s <code>employees</code> table, write a query for the <b>third highest distinct salary</b> and predict the result. What does your query return if the table holds only one employee?', hint: 'DISTINCT, then skip two values — or filter on DENSE_RANK = 3.', answer: '<code>SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2;</code> returns <b>6400</b> (the distinct list is 9000, 7500, 6400, 6000, 5200). Without DISTINCT it would wrongly return 7500. With one employee, this version returns <i>no rows</i>, while a <code>MAX(salary) … WHERE salary &lt; (subquery)</code> version returns one row containing NULL. Both are defensible — agree with the interviewer which one the caller expects.' },
      { q: 'Write a query that lists the highest-paid employee in each department, including ties, and predict the rows.', answer: '<code>SELECT dept, name, salary FROM (SELECT dept, name, salary, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk FROM employees) AS r WHERE rnk = 1;</code> → Engineering: Ayesha 9000; QA: Omar 6400. If two people shared a department’s top salary, both would appear, which is why RANK or DENSE_RANK beats ROW_NUMBER here. Without window functions: <code>WHERE e.salary = (SELECT MAX(x.salary) FROM employees x WHERE x.dept = e.dept)</code>.' },
      { q: 'A double-click bug created duplicate rows in <code>signups</code>. Which two queries would you run before deleting anything, and how would you remove the extras safely on a test database?', answer: 'First measure: <code>SELECT email, COUNT(*) FROM signups GROUP BY email HAVING COUNT(*) &gt; 1;</code>. Then list exactly which rows would go, with the <code>ROW_NUMBER() OVER (PARTITION BY email ORDER BY id)</code> query and <code>rn &gt; 1</code>. Only then, inside a transaction on your own test data, delete those ids, re-check the counts and commit. On shared or production data, report the duplicates and the root cause instead of deleting them, and add a test that a unique constraint now rejects the second sign-up.' },
      { q: 'Explain why <code>SELECT name FROM employees WHERE emp_id NOT IN (SELECT manager_id FROM employees);</code> returns no rows for this lesson’s table, then fix it.', answer: 'Ayesha’s <code>manager_id</code> is NULL, so the subquery list contains a NULL. <code>x NOT IN (1, 4, NULL)</code> is never true — it is either false or unknown — so every row is filtered out. Fix: <code>SELECT m.name FROM employees m WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.manager_id = m.emp_id);</code> returns Bilal, Chen, Omar and Sara. Adding <code>WHERE manager_id IS NOT NULL</code> inside the subquery also works.' }
    ],
    quiz: [
      { q: 'Salaries in the table are 9000, 7500, 7500 and 6400. What does SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2 return?', options: ['6400, the third highest distinct salary', 'No rows, because OFFSET skips duplicates', '7500, because the duplicate takes a place', '9000, because OFFSET counts from the lowest'], correct: 2,
        why: ['That needs DISTINCT; without it the second 7500 occupies a position.', 'OFFSET skips rows, not duplicate values, and there are enough rows to return one.', 'Right — the ordered rows are 9000, 7500, 7500, 6400; skipping two lands on the second 7500.', 'ORDER BY salary DESC puts the highest first, and OFFSET counts from the top of that order.'] },
      { q: 'Which ranking function gives tied salaries the same rank and leaves no gap after the tie?', options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'COUNT(*) OVER ()'], correct: 0,
        why: ['Right — 9000, 7500, 7500, 6400 are ranked 1, 2, 2, 3.', 'RANK also shares ranks on ties but then leaves a gap: 1, 2, 2, 4.', 'ROW_NUMBER numbers every row uniquely, so tied rows get different numbers.', 'COUNT(*) OVER () returns the same total on every row; it does not rank anything.'] },
      { q: 'A tester runs SELECT name, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees WHERE rnk = 2 and gets an error. Why?', options: ['DENSE_RANK can only be used together with GROUP BY', 'Every window function needs a PARTITION BY clause', 'The alias must be written in double quotes in WHERE', 'WHERE runs before window functions, so rnk does not exist there'], correct: 3,
        why: ['Window functions work without GROUP BY — that is their point.', 'PARTITION BY is optional; without it the whole result is one window.', 'Quoting does not help, because the alias is not visible to WHERE at all.', 'Right — compute the rank in a subquery or CTE, then filter on it in the outer query.'] },
      { q: 'A double-submit bug created duplicate sign-ups. Which query lists each duplicated email together with its number of copies?', options: ['SELECT DISTINCT email FROM signups;', 'SELECT email, COUNT(*) FROM signups GROUP BY email HAVING COUNT(*) > 1;', 'SELECT email, COUNT(*) FROM signups WHERE COUNT(*) > 1 GROUP BY email;', 'SELECT email FROM signups ORDER BY email LIMIT 2;'], correct: 1,
        why: ['DISTINCT hides duplicates instead of finding them, and gives no counts.', 'Right — GROUP BY makes one row per email, and HAVING keeps only groups with more than one row.', 'WHERE filters rows before grouping, so aggregates are not allowed there; this is an error.', 'This simply returns the first two emails in alphabetical order.'] },
      { q: 'You must empty a large staging table before each nightly test run but keep the table, its columns and its indexes. Which statement is accurate?', options: ['DROP TABLE is the right choice, because it removes rows fastest', 'TRUNCATE accepts a WHERE clause, so you can keep some rows', 'DELETE without WHERE always resets the auto-increment counter', 'TRUNCATE empties the whole table and keeps its structure'], correct: 3,
        why: ['DROP removes the table itself — columns, indexes and all — so the next run has nothing to insert into.', 'TRUNCATE has no WHERE clause; it always removes every row.', 'DELETE does not reset identity or auto-increment counters; TRUNCATE often does, depending on the database.', 'Right — TRUNCATE is the usual fast way to empty a table and keep it. Whether it can be rolled back depends on the database.'] }
    ],
    interview: [
      { q: 'How do you find the second highest salary? What if there are ties?', a: 'First I clarify what “second highest” means: the second <i>distinct</i> salary, or the second person in the list? With 9000, 7500, 7500 the answers differ. For the distinct value, <code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees)</code> works in almost every database and returns NULL when there is no second value. <code>SELECT DISTINCT salary … ORDER BY salary DESC LIMIT 1 OFFSET 1</code> works in MySQL, PostgreSQL and SQLite and generalises to the Nth with <code>OFFSET N-1</code>. If I need the people too, I compute <code>DENSE_RANK() OVER (ORDER BY salary DESC)</code> in a subquery and filter <code>rnk = 2</code>, which returns both tied employees.' },
      { q: 'What is the difference between DELETE, TRUNCATE and DROP?', a: '<b>DELETE</b> is DML: it removes the rows matching a WHERE clause (or all rows), fires row triggers and can be rolled back inside a transaction. <b>TRUNCATE</b> removes all rows at once and keeps the table; it has no WHERE, is much faster on big tables and usually resets identity counters — but rollback depends on the database: PostgreSQL and SQL Server can roll it back inside a transaction, while MySQL and Oracle commit it implicitly. <b>DROP</b> removes the table itself: structure, data, indexes and permissions. As a tester I use these only on my own test data, and I check whether our test setup truncates shared tables.' }
    ],
    takeaways: [
      'Clarify ties first — second distinct value or second person? DENSE_RANK handles ties cleanly.',
      'Window functions run after WHERE, so filter on a rank in an outer query or CTE.',
      'Find duplicates with GROUP BY … HAVING COUNT(*) &gt; 1 and list the extra copies with ROW_NUMBER.',
      'Prefer NOT EXISTS to NOT IN when the subquery can return NULL.',
      'Know the dialect: LIMIT/OFFSET vs TOP or FETCH FIRST, and TRUNCATE rollback differs by database.'
    ],
    links: { interview: ['a6'] }
  }
]);

QA_CONTENT.addLessons('code-git', [
  {
    id: 'cg-oop',
    n: 11,
    level: 'intermediate',
    title: 'OOP concepts for test automation',
    summary: 'Explain classes, encapsulation, inheritance, polymorphism and abstraction with test-code examples, and see how a page-object framework uses each.',
    minutes: 24,
    objectives: [
      'Create classes and objects in TypeScript with fields, constructors and methods',
      'Explain the four OOP pillars with an automation example for each',
      'Distinguish overloading from overriding in TypeScript, JavaScript and Java',
      'Prefer composition over deep inheritance when designing page and component objects'
    ],
    body: [
      { t: 'p', html: 'Interviewers for automation roles nearly always ask: “Explain OOP with examples from your framework.” Page objects, API clients and test-data builders are all <b>classes</b>, so this is not theory — it decides whether a UI change costs one edit or forty. A <b>class</b> is a blueprint: it declares fields (data) and methods (behaviour). An <b>object</b> is one instance built from it, with its own data. <code>new LoginPage(page)</code> creates an object that drives this test’s browser page; another test creates its own.' },
      { t: 'code', lang: 'ts', title: 'A class, an object and a private field', code: `class Cart {
  private items: { sku: string; priceCents: number; qty: number }[] = [];

  add(sku: string, priceCents: number, qty = 1): void {
    if (qty < 1) throw new Error('qty must be at least 1');
    this.items.push({ sku, priceCents, qty });
  }

  get totalCents(): number {
    return this.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  }
}

const cart = new Cart();          // an object: one instance of the class
cart.add('TOTE-01', 4000, 2);
cart.add('MUG-07', 1250);
console.log(cart.totalCents);     // 9250
// cart.items = [];               // compile error: 'items' is private` },
      { t: 'h', text: 'The four pillars' },
      { t: 'table', head: ['Pillar', 'Plain meaning', 'In a test framework'], rows: [
        ['<b>Encapsulation</b>', 'Keep data and the code that changes it together; hide the internals behind a few public methods', 'Locators are private fields of a page object; tests call <code>signIn()</code> instead of touching selectors'],
        ['<b>Inheritance</b>', 'A class reuses and extends another with <code>extends</code> — an “is-a” relationship', '<code>LoginPage extends BasePage</code> to reuse <code>open()</code> and the page URL handling'],
        ['<b>Polymorphism</b>', 'One call, different behaviour depending on the object that receives it', '<code>open()</code> calls <code>expectLoaded()</code>, and every page runs its own check'],
        ['<b>Abstraction</b>', 'Expose <i>what</i> something does and hide <i>how</i>, using interfaces and abstract classes', 'An <code>abstract</code> BasePage forces each page to define its URL and load check; an interface describes an API client a stub can replace']
      ] },
      { t: 'h', text: 'Encapsulation, inheritance and polymorphism in a page object' },
      { t: 'code', lang: 'ts', title: 'pages/base-page.ts', code: `import { type Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}
  abstract readonly path: string;               // every page must declare its URL

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();                  // runs the subclass's version
  }

  protected abstract expectLoaded(): Promise<void>;
}

export class LoginPage extends BasePage {
  readonly path = '/login';
  private readonly signInButton = this.page.getByRole('button', { name: 'Sign in' });

  protected async expectLoaded(): Promise<void> {
    await expect(this.signInButton).toBeVisible();
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.signInButton.click();
  }
}` },
      { t: 'p', html: 'An <code>abstract</code> class cannot be instantiated; it exists to be extended, and its <code>abstract</code> members must be implemented by every subclass, so the compiler stops anyone from forgetting a page’s load check. <code>protected</code> means subclasses can use <code>page</code> but tests cannot; <code>private</code> hides the locator even from subclasses. <code>open()</code> is written once in BasePage, yet each page’s own <code>expectLoaded()</code> runs — that is <b>polymorphism through overriding</b>. Keep BasePage thin: only what every page genuinely shares, never a bag of generic helpers.' },
      { t: 'h', text: 'Overriding vs overloading' },
      { t: 'compare',
        a: { title: 'Overriding', items: ['A subclass replaces a method it inherited, keeping the <b>same name and signature</b>', 'Chosen at <b>runtime</b> from the object’s actual class (dynamic dispatch)', 'Works in Java, JavaScript and TypeScript; Java marks it with <code>@Override</code>, TypeScript can use the <code>override</code> keyword', 'Example: <code>LoginPage.expectLoaded()</code> replaces the abstract BasePage version'] },
        b: { title: 'Overloading', items: ['Several methods with the <b>same name but different parameter lists</b> in one class', 'Java chooses the version at <b>compile time</b> from the argument types, e.g. <code>click(By)</code> vs <code>click(WebElement)</code>', '<b>JavaScript has no overloading</b>: a second method with the same name replaces the first', 'TypeScript allows several overload <i>signatures</i> but only one implementation, which checks its arguments'] } },
      { t: 'code', lang: 'java', title: 'Java: overriding and overloading side by side', code: `abstract class BasePage {
    abstract String title();                          // abstraction: no body here
    String describe() { return "Page: " + title(); }
}

class LoginPage extends BasePage {                   // inheritance
    @Override
    String title() { return "Login"; }               // overriding: chosen at runtime
}

class Report {
    // overloading: same name, different parameters, chosen at compile time
    static String format(int passed) { return passed + " passed"; }
    static String format(int passed, int failed) {
        return passed + " passed, " + failed + " failed";
    }
}

public class Demo {
    public static void main(String[] args) {
        BasePage page = new LoginPage();             // declared type BasePage
        System.out.println(page.describe());        // Page: Login
        System.out.println(Report.format(12));      // 12 passed
        System.out.println(Report.format(12, 3));   // 12 passed, 3 failed
    }
}` },
      { t: 'h', text: 'Abstraction and composition over inheritance' },
      { t: 'p', html: 'An <b>interface</b> is a contract with no implementation: any class that <code>implements</code> it promises those methods. Tests can then depend on the contract — a real API client or a stub — instead of a concrete class. <b>Inheritance</b> models “is-a”; <b>composition</b> models “has-a”. A product page <i>has</i> a header, a cart page <i>has</i> a data table. Putting header methods into BasePage gives them to pages without a header, and a deep chain such as AdminPage → ManagerPage → EmployeePage → BasePage makes every change ripple downwards. Prefer small <b>component objects</b> that pages hold as fields, and keep inheritance to one shallow level.' },
      { t: 'code', lang: 'ts', title: 'pages/header.ts — an interface and a component', code: `import { type Page, type Locator } from '@playwright/test';

export interface Loadable {
  waitUntilLoaded(): Promise<void>;
}

export class HeaderComponent {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('banner');       // scoped to the site header
  }

  async search(term: string): Promise<void> {
    await this.root.getByRole('searchbox').fill(term);
    await this.root.getByRole('searchbox').press('Enter');
  }
}

export class ProductPage implements Loadable {
  readonly header: HeaderComponent;             // composition: a page HAS a header

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
  }

  async waitUntilLoaded(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart' }).waitFor();
  }
}` },
      { t: 'callout', tone: 'tip', title: 'Answering “Where do you use OOP in your framework?”', html: 'Walk through one real example per pillar: private locators with intention-revealing methods (<b>encapsulation</b>), a thin BasePage (<b>inheritance</b>), an overridden load check (<b>polymorphism</b>), interfaces for API clients or data builders (<b>abstraction</b>) — and finish with why you chose components over a deeper hierarchy (<b>composition</b>). Concrete code you wrote beats textbook definitions every time.' }
    ],
    example: {
      title: 'Worked example: refactoring copy-pasted PeopleOps page objects',
      blocks: [
        { t: 'p', html: 'The PeopleOps suite has <code>LeavePage</code>, <code>PayslipPage</code> and <code>ProfilePage</code>. Each was copied from the previous one, so each has its own <code>logout()</code>, its own header search, and a different way of checking that the page loaded — one waits for a heading, one sleeps for two seconds, one checks nothing. Tests also reach into the pages for raw selectors.' },
        { t: 'table', head: ['Smell', 'OOP idea', 'Refactor'], rows: [
          ['Header search and logout copied into three pages', 'Composition', 'One <code>HeaderComponent</code>; each page has a <code>header</code> field'],
          ['Three different “is it loaded?” checks, one a fixed sleep', 'Inheritance + polymorphism', 'A thin <code>BasePage.open()</code> calls an abstract <code>expectLoaded()</code> that every page must implement'],
          ['Tests use <code>page.locator("#days")</code> directly', 'Encapsulation', 'Locators become private fields; tests call <code>requestDays(3)</code>'],
          ['Slow UI setup creates leave data for every test', 'Abstraction', 'A <code>LeaveApi</code> interface with a real API client, and a stub for fast component tests']
        ] },
        { t: 'code', lang: 'ts', title: 'tests/leave.spec.ts after the refactor', code: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { LeavePage } from '../pages/leave-page';

test('employee submits a leave request', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();                         // BasePage.open → LoginPage.expectLoaded
  await login.signIn('asha@peopleops.test', process.env.ASHA_PASSWORD ?? '');

  const leave = new LeavePage(page);
  await leave.open();                         // same method, LeavePage's own check
  await leave.header.search('annual leave');  // composition: the page has a header
  await leave.requestDays(3);
  await expect(leave.statusBadge).toHaveText('Pending approval');
});` },
        { t: 'p', html: 'The test now reads like the user’s journey. When the header’s search box changes, one component changes; when someone adds a page, the compiler forces it to implement <code>expectLoaded()</code>. The refactor removed a fixed sleep, three copies of the header code and every raw selector in the tests — without building a deep class hierarchy.' }
      ]
    },
    explain: {
      'ur': 'OOP یعنی Object-Oriented Programming میں ہم code کو classes اور objects میں منظم کرتے ہیں۔ Class ایک نقشہ ہے اور object اس نقشے سے بنی اصل چیز، جیسے new LoginPage(page)۔ چار بنیادی ستون ہیں: <b>Encapsulation</b> — locators کو page object کے اندر private رکھیں اور test کو صرف signIn() جیسا method دیں؛ <b>Inheritance</b> — LoginPage مشترکہ کام BasePage سے وراثت میں لیتا ہے؛ <b>Polymorphism</b> — ایک ہی call، جیسے expectLoaded()، ہر page پر اپنا الگ check چلاتی ہے؛ <b>Abstraction</b> — interface یا abstract class بتاتی ہے کہ کیا کرنا ہے، کیسے نہیں۔ Java میں overloading (ایک نام، مختلف parameters) compile time پر اور overriding runtime پر طے ہوتی ہے۔ اچھا اصول: inheritance کم رکھیں اور header یا date picker جیسے حصوں کے لیے composition استعمال کریں۔',
      'ur-Latn': 'OOP yaani Object-Oriented Programming mein hum code ko classes aur objects mein organize karte hain. Class ek naqsha hai aur object us naqshe se bani asal cheez, jaise new LoginPage(page). Chaar buniyadi sutoon hain: <b>Encapsulation</b> — locators ko page object ke andar private rakhein aur test ko sirf signIn() jaisa method dein; <b>Inheritance</b> — LoginPage mushtarka kaam BasePage se wirasat mein leta hai; <b>Polymorphism</b> — ek hi call, jaise expectLoaded(), har page par apna alag check chalati hai; <b>Abstraction</b> — interface ya abstract class batati hai ke kya karna hai, kaise nahi. Java mein overloading (ek naam, mukhtalif parameters) compile time par aur overriding runtime par tay hoti hai. Achha usool: inheritance kam rakhein aur header ya date picker jaise hisson ke liye composition istemal karein.',
      'hi': 'OOP यानी Object-Oriented Programming में हम code को classes और objects में व्यवस्थित करते हैं। Class एक नक्शा है और object उस नक्शे से बनी असली चीज़, जैसे new LoginPage(page)। चार बुनियादी स्तंभ हैं: <b>Encapsulation</b> — locators को page object के अंदर private रखें और test को सिर्फ़ signIn() जैसा method दें; <b>Inheritance</b> — LoginPage साझा काम BasePage से विरासत में लेता है; <b>Polymorphism</b> — एक ही call, जैसे expectLoaded(), हर page पर अपना अलग check चलाती है; <b>Abstraction</b> — interface या abstract class बताती है कि क्या करना है, कैसे नहीं। Java में overloading (एक नाम, अलग parameters) compile time पर और overriding runtime पर तय होती है। अच्छा नियम: inheritance कम रखें और header या date picker जैसे हिस्सों के लिए composition इस्तेमाल करें।',
      'ar': 'في البرمجة كائنية التوجه (OOP) ننظّم الكود في classes وobjects. الـ class مخطط، والـ object نسخة حقيقية منه، مثل new LoginPage(page). هناك أربعة مبادئ أساسية: <b>Encapsulation</b> — أبقِ الـ locators خاصة (private) داخل page object وقدّم للاختبار method مثل signIn() فقط؛ <b>Inheritance</b> — يرث LoginPage الوظائف المشتركة من BasePage؛ <b>Polymorphism</b> — الاستدعاء نفسه، مثل expectLoaded()، ينفّذ فحصًا مختلفًا لكل صفحة؛ <b>Abstraction</b> — الـ interface أو الـ abstract class يحدد ماذا يجب أن يُفعل لا كيف. في Java يُحدَّد الـ overloading (الاسم نفسه مع parameters مختلفة) وقت الترجمة، ويُحدَّد الـ overriding وقت التشغيل. قاعدة جيدة: قلّل الوراثة واستخدم composition لأجزاء مثل الـ header أو منتقي التاريخ.',
      'es': 'En la programación orientada a objetos (OOP) organizamos el código en clases y objetos. Una clase es un plano y un objeto es una instancia real creada a partir de él, como new LoginPage(page). Hay cuatro pilares: <b>Encapsulation</b> — mantén los locators privados dentro del page object y ofrece al test solo métodos como signIn(); <b>Inheritance</b> — LoginPage hereda de BasePage el comportamiento común; <b>Polymorphism</b> — la misma llamada, como expectLoaded(), ejecuta una comprobación distinta en cada página; <b>Abstraction</b> — una interface o clase abstracta dice qué hacer, no cómo. En Java, el overloading (mismo nombre, distintos parámetros) se resuelve al compilar y el overriding en tiempo de ejecución. Buena regla: usa poca herencia y prefiere la composición para piezas como el header o un selector de fechas.'
    },
    keyTerms: [
      { term: 'Class and object', def: 'A class is a blueprint of fields and methods; an object is one instance of it, such as new LoginPage(page).' },
      { term: 'Encapsulation', def: 'Keeping data and the code that changes it together, and hiding the internals behind a small public interface.' },
      { term: 'Inheritance', def: 'A class reusing and extending another with extends — an “is-a” relationship, such as a LoginPage that is a BasePage.' },
      { term: 'Polymorphism', def: 'One call, different behaviour depending on the receiving object — in test code mostly through overriding inherited methods.' },
      { term: 'Abstraction', def: 'Exposing what something does while hiding how, typically with interfaces and abstract classes.' },
      { term: 'Composition', def: 'Building an object from other objects — a “has-a” relationship, such as a page that has a header component.' }
    ],
    practice: [
      { q: 'Name the OOP principle each line shows: (a) <code>private readonly signInButton: Locator</code>; (b) <code>class CartPage extends BasePage</code>; (c) <code>BasePage.open()</code> calling <code>this.expectLoaded()</code>, which each page implements differently; (d) <code>interface Loadable { waitUntilLoaded(): Promise&lt;void&gt; }</code>.', answer: '(a) <b>Encapsulation</b> — the locator is hidden inside the page object and tests use its methods. (b) <b>Inheritance</b> — CartPage reuses what BasePage provides. (c) <b>Polymorphism</b> through overriding — the same call runs each subclass’s own check at runtime. (d) <b>Abstraction</b> — the interface states <i>what</i> a page must offer, not <i>how</i>.' },
      { q: 'In Java, <code>LoginPage</code> has <code>login(String user, String pass)</code> and <code>login(User user)</code>, and it overrides <code>isLoaded()</code> from <code>BasePage</code>. Which is overloading, which is overriding, and when is each resolved?', answer: 'The two <code>login</code> methods are <b>overloading</b>: same name, different parameter lists, in one class; the compiler picks one from the argument types at <b>compile time</b>. <code>isLoaded()</code> is <b>overriding</b>: same signature as the parent’s method, and the JVM picks the version from the object’s actual class at <b>runtime</b>, so <code>BasePage p = new LoginPage(); p.isLoaded()</code> runs LoginPage’s version. Mark it with <code>@Override</code> so the compiler catches a misspelt name.' },
      { q: 'A teammate writes two TypeScript functions named <code>formatResult</code>, one with one parameter and one with two, and the compiler complains. Why, and what is the TypeScript way?', hint: 'TypeScript compiles to JavaScript, which keeps only one function per name.', answer: 'JavaScript has no overloading, so TypeScript reports <i>Duplicate function implementation</i>. Write <b>overload signatures</b> followed by one implementation that handles both shapes: <code>function formatResult(passed: number): string;</code> <code>function formatResult(passed: number, failed: number): string;</code> <code>function formatResult(passed: number, failed?: number): string { … }</code>. Often a single optional parameter or a union type is simpler still.' },
      { q: 'Product, Search and Cart pages in ShopFlow share a header with search and a cart link; the Checkout page has a different, minimal header. Design this with composition and explain why it beats putting header methods in BasePage.', answer: 'Create a <code>HeaderComponent</code> scoped to the header’s root locator, with <code>search(term)</code> and <code>openCart()</code>. Product, Search and Cart pages each <i>have</i> a <code>header</code> field; Checkout has its own small <code>CheckoutHeader</code>, or none. In BasePage every page — Checkout included — would inherit methods that make no sense for it, and any header change would touch the base of the whole hierarchy. Composition gives each page exactly the parts it really has, and the component can be reused and tested on its own.' }
    ],
    quiz: [
      { q: 'A page object keeps its locators private and exposes only signIn(email, password) to tests. Which OOP principle does this mainly show?', options: ['Encapsulation', 'Inheritance', 'Overloading', 'Composition'], correct: 0,
        why: ['Right — data and the code that uses it live together, and the internals hide behind a small public method.', 'Inheritance is about one class extending another; nothing here extends anything.', 'Overloading means several methods with the same name and different parameters.', 'Composition means one object holding others, such as a page holding a header component.'] },
      { q: 'In Java, a Report class has format(int passed) and format(int passed, int failed). What is this, and when is the method chosen?', options: ['Overriding, chosen at runtime from the object’s class', 'Inheritance, chosen when the subclass is first loaded', 'Overloading, chosen at compile time from the arguments', 'Abstraction, chosen at runtime through an interface'], correct: 2,
        why: ['Overriding needs a subclass redefining a parent method with the same signature.', 'Both methods live in one class; nothing is inherited.', 'Right — same name, different parameter lists; the compiler picks the version from the argument types.', 'No interface or abstract method is involved here.'] },
      { q: 'BasePage.open() navigates and then calls this.expectLoaded(). LoginPage and CartPage each override expectLoaded(). A test calls cartPage.open(). Which check runs?', options: ['BasePage’s own expectLoaded, because open() is defined in BasePage', 'CartPage’s expectLoaded, because the call goes to the object’s class', 'Both versions, first BasePage’s and then CartPage’s', 'Neither, because a base class cannot call abstract methods'], correct: 1,
        why: ['Where open() is written does not matter; this refers to the CartPage object.', 'Right — this is polymorphism through overriding: the runtime type decides which version runs.', 'An override replaces the parent version; the parent’s runs only if the subclass calls super.expectLoaded() itself.', 'Calling an abstract method from the base class is the template-method pattern, and it is allowed.'] },
      { q: 'In plain JavaScript, a class declares two methods named click, one with one parameter and one with two. What happens?', options: ['The engine picks the version whose parameter count matches', 'The file fails to load with a duplicate-method syntax error', 'Both methods run, one after the other, on every call', 'The second definition replaces the first, so only it exists'], correct: 3,
        why: ['JavaScript has no overloading; it never chooses by parameter count.', 'Duplicate method names in a class are legal JavaScript, so there is no error — which is why this bug is easy to miss.', 'Only one method can exist under a name.', 'Right — the last definition wins. TypeScript would flag a duplicate implementation; JavaScript silently keeps the last one.'] },
      { q: 'A teammate builds AdminPage extends ManagerPage extends EmployeePage extends BasePage so admins can reuse employee methods. A small change to EmployeePage breaks admin tests. Which advice fits best?', options: ['Prefer composition and keep any inheritance shallow', 'Add another level, AdminBasePage, to isolate admin changes from the rest', 'Copy every employee method into AdminPage so it inherits nothing', 'Make every EmployeePage method static so nothing can override it'], correct: 0,
        why: ['Right — deep hierarchies make every change ripple downwards; components give each page only what it needs.', 'Another level deepens the hierarchy and the coupling.', 'Copying code trades a coupling problem for a duplication problem.', 'Static methods remove polymorphism and still couple every caller to EmployeePage.'] }
    ],
    interview: [
      { q: 'Explain the OOP concepts you use in your automation framework.', a: 'In our Playwright framework each page is a <b>class</b>, and tests create <b>objects</b> from them. <b>Encapsulation</b>: locators are private fields and tests call intention-revealing methods such as <code>signIn()</code>, so a UI change is fixed in one place. <b>Inheritance</b>: a thin <code>BasePage</code> holds what every page truly shares — its URL and an <code>open()</code> method — and pages extend it. <b>Polymorphism</b>: <code>open()</code> calls <code>expectLoaded()</code>, which each page overrides with its own check. <b>Abstraction</b>: interfaces describe what API clients and data builders provide, so a test can use a real client or a stub. And we prefer <b>composition</b>: header, table and date-picker components are objects inside pages, not more base classes.' },
      { q: 'What is the difference between method overloading and method overriding?', a: '<b>Overloading</b> means several methods in one class with the same name but different parameter lists — for example <code>click(By locator)</code> and <code>click(WebElement element)</code> in a Java helper. The compiler chooses one from the argument types, at compile time. <b>Overriding</b> means a subclass provides its own version of an inherited method with the same signature — for example <code>LoginPage.isLoaded()</code> replacing <code>BasePage.isLoaded()</code> — and the version is chosen at runtime from the object’s actual class. JavaScript has no overloading (the last definition wins), TypeScript offers overload signatures with a single implementation, and overriding works in all three.' }
    ],
    takeaways: [
      'A class is a blueprint; an object is one instance of it with its own data.',
      'Encapsulation hides locators behind intention-revealing methods; abstraction states what, not how.',
      'Overriding is resolved at runtime; Java overloading at compile time; JavaScript has no overloading.',
      'Keep BasePage thin and prefer composition (component objects) over deep inheritance.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions'], interview: ['p4'] }
  },
  {
    id: 'cg-coding-interview',
    n: 12,
    level: 'intermediate',
    title: 'Coding exercises asked in QA interviews',
    summary: 'Solve the classic QA coding exercises — strings, arrays, duplicates, FizzBuzz, anagrams — talk through your approach and test your own code’s edge cases.',
    minutes: 28,
    objectives: [
      'Follow a repeatable approach: clarify, give examples, code, then test edge cases',
      'Solve the string and array exercises interviewers ask most often, in JavaScript',
      'Explain the cost of a solution with simple Big-O intuition',
      'Test your own solution with empty, single, duplicate, null and Unicode inputs'
    ],
    body: [
      { t: 'p', html: 'Many QA and SDET interviews include one or two short coding exercises. They are rarely algorithm puzzles; they are small string and array problems that show whether you can turn an idea into working code. Interviewers watch <b>how you think</b>: do you ask questions, choose sensible names, and — most important for a tester — <b>test your own code</b>? A candidate who writes a plain loop and then immediately tries the empty string makes a better impression than one who produces a clever one-liner and stops.' },
      { t: 'flow', caption: 'The same six steps work for every exercise in this lesson', steps: ['Clarify inputs and outputs', 'Write 2–3 examples', 'Explain the approach', 'Code it simply', 'Test edge cases', 'Discuss Big-O'] },
      { t: 'h', text: 'Strings: reverse, palindrome, frequency, anagram' },
      { t: 'code', lang: 'js', title: 'String exercises', code: `function reverse(str) {
  return [...str].reverse().join('');      // spread splits by code point
}

function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === [...clean].reverse().join('');
}

function charFrequency(str) {
  const counts = {};
  for (const ch of str) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

function isAnagram(a, b) {
  const norm = s => [...s.toLowerCase().replaceAll(' ', '')].sort().join('');
  return norm(a) === norm(b);
}

console.log(reverse('QA rocks'));                            // 'skcor AQ'
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
console.log(charFrequency('test'));                          // { t: 2, e: 1, s: 1 }
console.log(isAnagram('Listen', 'Silent'));                  // true` },
      { t: 'p', html: '<code>[...str]</code> splits a string by Unicode code point, so an emoji such as 👍 stays whole; <code>str.split("")</code> splits by UTF-16 unit and cuts it into two broken halves. Neither handles a letter built from a base character plus an accent mark — <code>normalize()</code> or <code>Intl.Segmenter</code> does. The palindrome check keeps only a–z and 0–9, which also strips letters such as ñ, so “Ñaña” would wrongly pass; a Unicode-aware pattern such as <code>/[^\\p{L}\\p{N}]/gu</code> fixes that. The anagram check sorts both strings, which is O(n log n); comparing character counts is O(n).' },
      { t: 'h', text: 'Arrays: duplicates, unique values, second max' },
      { t: 'code', lang: 'js', title: 'Array exercises', code: `function findDuplicates(arr) {
  const seen = new Set();
  const dups = new Set();
  for (const x of arr) {
    if (seen.has(x)) dups.add(x);
    else seen.add(x);
  }
  return [...dups];
}

const unique = arr => [...new Set(arr)];    // keeps first-seen order

function secondMax(nums) {
  let max = -Infinity;
  let second = -Infinity;
  for (const n of nums) {
    if (n > max) {
      second = max;
      max = n;
    } else if (n > second && n < max) {
      second = n;
    }
  }
  return second === -Infinity ? null : second;   // null: no distinct second value
}

console.log(findDuplicates([3, 1, 3, 2, 1, 3]));   // [3, 1]
console.log(unique([3, 1, 3, 2, 1, 3]));           // [3, 1, 2]
console.log(secondMax([5, 9, 7, 9]));              // 7
console.log(secondMax([4, 4]));                    // null` },
      { t: 'table', caption: 'Big-O describes how the work grows as the input grows', head: ['Solution', 'Time', 'Why'], rows: [
        ['Reverse, palindrome, frequency count', 'O(n)', 'One pass over the characters, plus a reversed copy'],
        ['Anagram by sorting', 'O(n log n)', 'Sorting dominates; counting characters instead gives O(n)'],
        ['Duplicates with nested loops', 'O(n²)', 'Every element is compared with every other: 10× more data means about 100× more work'],
        ['Duplicates or unique values with a Set', 'O(n)', 'Set <code>has</code> and <code>add</code> take constant time on average'],
        ['Second max in a single pass', 'O(n)', 'Sorting first also works, but costs O(n log n) and still needs duplicate handling'],
        ['Look up a value by key in a Map', 'O(1)', 'Constant time on average, whatever the size']
      ] },
      { t: 'h', text: 'FizzBuzz and the swap question' },
      { t: 'code', lang: 'js', title: 'FizzBuzz, then swapping two variables', code: `for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');   // check 15 first
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}

// Swap two variables: clear, and works for any type
let a = 'left', b = 'right';
[a, b] = [b, a];                        // a = 'right', b = 'left'

// The arithmetic "trick" (numbers only)
let x = 1, y = 2;
x = x + y; y = x - y; x = x - y;        // x = 2, y = 1` },
      { t: 'callout', tone: 'warn', title: 'Clarity beats tricks', html: 'Interviewers sometimes ask for a swap “without a temporary variable”. Know the arithmetic version, then explain its limits: it works only for numbers, and above <code>Number.MAX_SAFE_INTEGER</code> (2^53 − 1) it silently loses precision; the XOR version works only on 32-bit integers. Then say: “In real code I would write <code>[a, b] = [b, a]</code>, because anyone can read it.” The same goes for one-liners — a readable loop you can explain and test beats a clever chain you cannot.' },
      { t: 'h', text: 'Test your own code' },
      { t: 'table', head: ['Edge case', 'Example input', 'Ask or decide'], rows: [
        ['Empty', '<code>""</code>, <code>[]</code>', 'Return <code>""</code>, <code>[]</code>, <code>null</code> — or throw? <code>reverse("")</code> should return <code>""</code>'],
        ['Single element', '<code>[7]</code>', 'There is no second max — return <code>null</code>?'],
        ['Duplicates and ties', '<code>[9, 9, 7]</code>', 'Second <i>distinct</i> value (7) or second position (9)?'],
        ['null or wrong type', '<code>reverse(null)</code>', 'Currently a TypeError — validate, or document the contract'],
        ['Case and spaces', '“Listen” vs “silent”', 'Case-insensitive? Ignore spaces and punctuation?'],
        ['Negative and huge numbers', '<code>[-3, -1]</code>, 2^53', 'Never start a max at 0; mind precision beyond the safe-integer limit'],
        ['Unicode', '👍, “café”, “Ñaña”', 'Split by code point, normalise accents, avoid ASCII-only patterns']
      ] },
      { t: 'callout', tone: 'tip', title: 'Talk while you code', html: 'Narrate decisions (“I’ll use a Set because lookups are constant time”), state assumptions, and say what you are checking. If you get stuck, write the brute-force version first — a working O(n²) answer beats an unfinished clever one — then improve it. Before saying “done”, trace your examples through the code line by line and mention the tests you would add in production. Silence makes interviewers guess; narration lets them give you hints.' }
    ],
    example: {
      title: 'Worked example: “find the first non-repeating character”',
      blocks: [
        { t: 'p', html: 'The interviewer asks: “Return the first character that appears only once in a string.” The candidate clarifies before typing. <i>Case-sensitive?</i> Yes. <i>What if every character repeats?</i> Return <code>null</code>. <i>Unicode?</i> It should work for emoji too. Agreed examples: “swiss” → “w” and “aabb” → <code>null</code>.' },
        { t: 'code', lang: 'js', title: 'Solution with the checks the candidate ran aloud', code: `function firstUnique(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (const ch of str) {
    if (counts.get(ch) === 1) return ch;
  }
  return null;                    // agreed: no unique character → null
}

console.log(firstUnique('swiss'));    // 'w'
console.log(firstUnique('aabb'));     // null
console.log(firstUnique(''));         // null
console.log(firstUnique('Aa'));       // 'A' (case-sensitive, as agreed)
console.log(firstUnique('👍a👍'));    // 'a'` },
        { t: 'p', html: 'Talking points: the first loop counts with a <code>Map</code> in O(n); the second returns the first character whose count is 1, also O(n). The whole solution is O(n) time, with extra space for one entry per distinct character; a nested-loop version would be O(n²). <code>for…of</code> iterates by code point, so the emoji case works. The candidate ran all five checks aloud — including the empty string and the case-sensitive pair — before saying “done”, which is exactly the habit the interviewer was looking for.' }
      ]
    },
    explain: {
      'ur': 'QA interview میں coding کے سوال عموماً آسان ہوتے ہیں، جیسے string الٹی کرنا، palindrome چیک کرنا یا array میں duplicates ڈھونڈنا۔ Interviewer یہ دیکھتا ہے کہ آپ کیسے سوچتے ہیں۔ طریقہ یاد رکھیں: پہلے سوال واضح کریں، دو تین مثالیں لکھیں، اپنا approach بول کر بتائیں، سادہ code لکھیں، پھر خود test کریں۔ مثال: reverse("QA") کا جواب "AQ" ہے — لیکن خالی string، ایک حرف، null اور emoji کے ساتھ کیا ہو گا؟ یہی edge cases ایک tester کی اصل طاقت ہیں۔ Big-O سے بتائیں کہ input بڑا ہونے پر code کتنا سست ہو گا: ایک loop یعنی O(n)، loop کے اندر loop یعنی O(n²)۔ چالاک one-liner کے بجائے صاف اور پڑھنے میں آسان code بہتر ہے۔',
      'ur-Latn': 'QA interview mein coding ke sawal aam tor par aasaan hote hain, jaise string ulti karna, palindrome check karna ya array mein duplicates dhoondna. Interviewer yeh dekhta hai ke aap kaise sochte hain. Tareeqa yaad rakhein: pehle sawal clear karein, do teen examples likhein, apna approach bol kar batayein, saada code likhein, phir khud test karein. Misaal: reverse("QA") ka jawab "AQ" hai — lekin khaali string, ek character, null aur emoji ke saath kya hoga? Yehi edge cases ek tester ki asal taaqat hain. Big-O se batayein ke input bara hone par code kitna slow hoga: ek loop yaani O(n), loop ke andar loop yaani O(n²). Chalaak one-liner ke bajaye saaf aur parhne mein aasaan code behtar hai.',
      'hi': 'QA interview में coding के सवाल आमतौर पर आसान होते हैं, जैसे string उलटना, palindrome जाँचना या array में duplicates ढूँढना। Interviewer यह देखता है कि आप कैसे सोचते हैं। तरीक़ा याद रखें: पहले सवाल साफ़ करें, दो-तीन उदाहरण लिखें, अपना approach बोलकर बताएँ, सरल code लिखें, फिर खुद test करें। उदाहरण: reverse("QA") का जवाब "AQ" है — लेकिन खाली string, एक character, null और emoji के साथ क्या होगा? यही edge cases एक tester की असली ताक़त हैं। Big-O से बताएँ कि input बड़ा होने पर code कितना धीमा होगा: एक loop यानी O(n), loop के अंदर loop यानी O(n²)। चालाक one-liner की जगह साफ़ और आसानी से पढ़ा जाने वाला code बेहतर है।',
      'ar': 'أسئلة البرمجة في مقابلات QA بسيطة عادةً، مثل عكس سلسلة نصية (string)، أو التحقق من palindrome، أو إيجاد العناصر المكررة في مصفوفة. ما يهم المُقابِل هو طريقة تفكيرك. تذكّر الخطوات: وضّح السؤال أولًا، واكتب مثالين أو ثلاثة، واشرح طريقتك بصوت مسموع، واكتب كودًا بسيطًا، ثم اختبره بنفسك. مثال: reverse("QA") تعيد "AQ"، لكن ماذا يحدث مع سلسلة فارغة، أو حرف واحد، أو null، أو emoji؟ هذه الحالات الحدّية (edge cases) هي نقطة قوة المختبِر. واستخدم Big-O لتوضيح كيف يتباطأ الكود مع كبر المدخلات: حلقة واحدة تعني O(n)، وحلقة داخل حلقة تعني O(n²). الكود الواضح أفضل من سطر واحد «ذكي».',
      'es': 'Las preguntas de programación en entrevistas de QA suelen ser sencillas: invertir un string, comprobar un palíndromo o encontrar duplicados en un array. Al entrevistador le importa cómo piensas. Recuerda el método: aclara la pregunta, escribe dos o tres ejemplos, explica tu enfoque en voz alta, escribe código simple y pruébalo tú mismo. Ejemplo: reverse("QA") devuelve "AQ", pero ¿qué pasa con un string vacío, un solo carácter, null o un emoji? Esos casos límite (edge cases) son la gran fortaleza de un tester. Usa Big-O para explicar cuánto se ralentiza el código cuando crece la entrada: un bucle es O(n) y un bucle dentro de otro, O(n²). Un código claro vale más que un one-liner ingenioso.'
    },
    keyTerms: [
      { term: 'Edge case', def: 'An input at the extremes or unusual end of the range: empty, a single item, duplicates, null, very large values or special characters.' },
      { term: 'Big-O notation', def: 'A way to describe how running time or memory grows with input size n, ignoring constants: O(1), O(n), O(n log n), O(n²).' },
      { term: 'Set', def: 'A JavaScript collection of unique values with fast has and add — ideal for duplicate and uniqueness checks.' },
      { term: 'Map', def: 'A key–value collection that keeps insertion order and accepts any key type; well suited to counting occurrences.' },
      { term: 'Brute force', def: 'The simplest correct solution, often slow. A good starting point that you optimise once it works.' },
      { term: 'Surrogate pair', def: 'Two UTF-16 code units that together form one character, such as many emoji; split("") breaks them apart.' }
    ],
    practice: [
      { q: 'Write <code>countVowels(str)</code> in JavaScript and list the edge cases you would test.', answer: '<code>function countVowels(str) { let n = 0; for (const ch of str.toLowerCase()) if ("aeiou".includes(ch)) n++; return n; }</code>. Tests: <code>""</code> → 0; <code>"rhythm"</code> → 0; <code>"AEIOU"</code> → 5 (case); <code>"Queue"</code> → 4 (repeated vowels); spaces and punctuation are ignored. Ask whether “y” or accented vowels such as “é” count. <code>null</code> throws a TypeError — decide whether to validate it or document the contract.' },
      { q: 'Without using <code>Set</code>, remove duplicates from <code>[3, 1, 3, 2, 1]</code> while keeping first-seen order. What is the Big-O of your solution?', hint: 'filter() with indexOf() is short — but think about how often indexOf scans the array.', answer: '<code>arr.filter((x, i) =&gt; arr.indexOf(x) === i)</code> returns <code>[3, 1, 2]</code>. It is O(n²), because <code>indexOf</code> scans the array for every element. A loop with a Map or object of seen values is O(n). Mention both, then say that in real code <code>[...new Set(arr)]</code> is clearest. Bonus: <code>indexOf</code> never finds <code>NaN</code>, so the filter version drops every <code>NaN</code>, while a Set keeps one.' },
      { q: 'Asked to find the largest number in an array without <code>Math.max</code>, a candidate starts with <code>let max = 0</code>. Which inputs break it, and how do you fix it?', answer: '<code>[-5, -2]</code> returns 0, a number that is not even in the array, and <code>[]</code> also returns 0 instead of signalling “no answer”. Start from the first element or <code>-Infinity</code>, and decide what an empty array returns — <code>null</code>, <code>undefined</code> or an error — then test it. Note too that <code>Math.max()</code> with no arguments returns <code>-Infinity</code>, and <code>Math.max(...hugeArray)</code> can throw a RangeError on very large arrays.' },
      { q: 'Talk through FizzBuzz for 1 to 15 as you would in an interview: your clarifying questions, the key decision in the code and the outputs you would spot-check.', answer: 'Clarify: is the range inclusive? Print, or return an array? Key decision: check divisibility by <b>15 first</b> (or build the string from the 3 and 5 parts) — if you test 3 first, 15 prints “Fizz”. Spot-check 1 → 1, 3 → Fizz, 5 → Buzz, 15 → FizzBuzz and a plain number such as 7. Mention that it is O(n), and that keeping the rules in a list makes new rules (7 → “Bazz”) easy to add.' }
    ],
    quiz: [
      { q: 'Why can "👍ok".split("").reverse().join("") return a broken string?', options: ['reverse() only works on arrays of numbers', 'split("") removes non-ASCII characters first', 'join("") inserts commas between all of the characters', 'split("") cuts the emoji into two UTF-16 halves'], correct: 3,
        why: ['reverse() reverses any array, whatever its contents.', 'Nothing is removed — the emoji is split, not dropped.', 'join("") uses an empty separator, so no commas appear.', 'Right — the emoji is a surrogate pair, and reversing swaps its halves into invalid characters. [...str] splits by code point instead.'] },
      { q: 'Your secondMax returns 9 for [9, 9, 7], but the interviewer expected 7. What is the best response?', options: ['Insist 9 is right, since it is the second element after sorting', 'Ask if “second max” means second distinct value, then fix and retest', 'Switch to sorting, because sorting always handles duplicates correctly', 'Remove 9 from the test data, since duplicate values are unrealistic'], correct: 1,
        why: ['The requirement is ambiguous; arguing instead of clarifying is the weak move.', 'Right — clarify the rule, adjust the condition (for example n &lt; max), and rerun the duplicate case.', 'Sorting gives [9, 9, 7]; the second element is still 9 unless you de-duplicate.', 'Duplicates are realistic — two employees can share a salary. Test data should include them.'] },
      { q: 'You find duplicates by comparing every element with every other element in two nested loops. Roughly how does the work grow as the array grows?', options: ['O(n) — linearly with the length', 'O(log n) — it halves on each step', 'O(n²) — with the square of the length', 'O(1) — constant, whatever the size'], correct: 2,
        why: ['One pass is O(n); two nested passes multiply.', 'O(log n) comes from repeatedly halving the problem, as in binary search.', 'Right — 10 times more elements means about 100 times more comparisons. A Set brings it down to O(n).', 'The work clearly depends on how many elements there are.'] },
      { q: 'Which swap of a and b is clearest and works for numbers, strings and objects alike?', options: ['[a, b] = [b, a];', 'a = a + b; b = a - b; a = a - b;', 'a = a ^ b; b = a ^ b; a = a ^ b;', 'a = b; b = a;'], correct: 0,
        why: ['Right — destructuring is readable and works for any type.', 'Works only for numbers, and loses precision above Number.MAX_SAFE_INTEGER.', 'XOR works only on 32-bit integers in JavaScript, and few readers recognise it at a glance.', 'After a = b the original value of a is lost, so both end up holding b’s value.'] },
      { q: 'You finished isPalindrome with two minutes left. Which set of inputs shows the best testing instinct?', options: ['"racecar" and "level", two classic palindromes', 'Ten more long palindromes to show it is reliable', '"", "a", "Racecar", "A man, a plan…" and "ab"', 'Only the interviewer’s own example, to save time'], correct: 2,
        why: ['Two similar happy-path inputs test the same thing twice.', 'More inputs of the same kind add little; vary the input instead.', 'Right — empty, single character, mixed case, punctuation and spaces, and a non-palindrome each cover a different partition.', 'One example cannot reveal edge-case bugs.'] }
    ],
    interview: [
      { q: 'How do you approach a coding question in an interview?', a: 'I treat it like a mini test assignment. First I <b>clarify</b>: input types, empty or null input, case sensitivity, what to return when there is no answer. Then I write two or three <b>examples</b>, including an edge case, and confirm the expected outputs. I describe a simple approach out loud — often brute force first — and mention its Big-O. I write <b>small, clean</b> code with clear names, and finally I <b>test it myself</b>: I trace my examples, then try empty input, one element, duplicates and unusual characters. If time allows, I discuss an optimisation, such as replacing nested loops with a Set to go from O(n²) to O(n).' },
      { q: 'Write a function to check whether two strings are anagrams. What would you test?', a: 'Normalise both strings, then compare their sorted characters: <code>const norm = s =&gt; [...s.toLowerCase().replaceAll(" ", "")].sort().join(""); return norm(a) === norm(b);</code> — O(n log n), while counting characters in a Map gives O(n). Before coding I ask whether case and spaces matter. Tests: “Listen”/“Silent” (true), “abc”/“abd” (false), different lengths, “Dormitory”/“Dirty room” (spaces), two empty strings, and repeated letters such as “aab”/“abb” (false — a length-only or set-only check would wrongly pass), plus accented or non-Latin text if the product supports it.' }
    ],
    takeaways: [
      'Clarify, give examples, code simply, then test your own code — out loud.',
      'Edge cases first: empty, single element, duplicates, null, case and Unicode.',
      'Sets and Maps turn many O(n²) nested-loop solutions into O(n).',
      'Readable code beats clever tricks; explain the trick only when asked.'
    ],
    links: { interview: ['m5'] }
  }
]);

QA_CONTENT.addLessons('automation', [
  {
    id: 'au-locators',
    n: 12,
    level: 'intermediate',
    title: 'XPath and CSS selectors that survive change',
    summary: 'Write CSS selectors and XPath expressions that hit the right element, rank locator strategies by robustness and check them in DevTools first.',
    minutes: 25,
    objectives: [
      'Read a page as a DOM tree of elements, attributes and text',
      'Write CSS selectors with ids, classes, attributes, combinators and :nth-child',
      'Write relative XPath with attributes, text(), contains(), starts-with() and axes',
      'Rank locator strategies by robustness and verify a selector in DevTools before using it'
    ],
    body: [
      { t: 'p', html: 'Every UI automation tool needs a way to find elements. Playwright prefers role and label locators, but Selenium suites, legacy apps and interviews still revolve around <b>CSS selectors</b> and <b>XPath</b>: “Write an XPath for the button next to this label”, “What is the difference between absolute and relative XPath?”, “CSS or XPath — which and why?”. The page is a <b>DOM tree</b>: elements nest inside elements, each with attributes (id, class, name, data-testid) and text. A good locator identifies exactly one element by something meaningful that will not change when the layout does.' },
      { t: 'code', lang: 'text', title: 'Sample DOM used in this lesson (PeopleOps leave form, directly inside body)', code: `<form id="leave-form" class="card form">
  <label for="days">Number of days</label>
  <input id="days" name="days" type="number" data-testid="leave-days">
  <div class="row">
    <span class="label">Status</span>
    <span class="value badge badge-pending">Pending approval</span>
  </div>
  <table class="requests">
    <tbody>
      <tr><td>REQ-101</td><td>Annual</td><td><button>Cancel</button></td></tr>
      <tr><td>REQ-102</td><td>Sick</td><td><button>Cancel</button></td></tr>
    </tbody>
  </table>
  <button type="submit" class="btn btn-primary">Submit request</button>
</form>` },
      { t: 'h', text: 'CSS selectors' },
      { t: 'table', head: ['Selector', 'Matches', 'In the sample'], rows: [
        ['<code>#days</code>', 'The element with id="days"', 'The days input'],
        ['<code>.badge</code>', 'Any element whose class list includes badge', 'The status badge'],
        ['<code>input[name="days"]</code>', 'An input whose name attribute equals days', 'The days input'],
        ['<code>[data-testid="leave-days"]</code>', 'An agreed test-id attribute', 'The days input'],
        ['<code>[class*="badge-"]</code>', 'Attribute <i>contains</i> a substring', 'The badge (badge-pending)'],
        ['<code>[id^="leave"]</code>, <code>[type$="mit"]</code>', 'Attribute <i>starts with</i> / <i>ends with</i>', 'The form; the submit button'],
        ['<code>form .value</code>', 'Descendant at any depth (a space)', 'The badge'],
        ['<code>div.row &gt; span</code>', 'Direct children only (&gt;)', 'Both spans in the row'],
        ['<code>label + input</code>', 'The element immediately after a sibling (+)', 'The days input'],
        ['<code>tr:nth-child(2) td:first-child</code>', 'Position among all siblings', 'The REQ-102 cell']
      ] },
      { t: 'p', html: 'Standard CSS cannot match by visible text, and it cannot step up to a parent — except through <code>:has()</code>, which modern browsers support (<code>tr:has(td)</code> selects rows that contain cells). <code>:nth-child(n)</code> counts <i>all</i> siblings whatever their tag, while <code>:nth-of-type(n)</code> counts only siblings of the same tag. Notice the <code>&lt;tbody&gt;</code> in the sample: browsers insert it even when the HTML source omits it, so <code>table &gt; tr</code> matches nothing in a real DOM. Always build selectors from what DevTools shows, not from the page source.' },
      { t: 'h', text: 'XPath' },
      { t: 'table', head: ['XPath', 'Meaning', 'In the sample'], rows: [
        ['<code>/html/body/form/div/span[2]</code>', 'Absolute path from the root, one step per level', 'The badge — until anyone adds a wrapper'],
        ['<code>//input[@id="days"]</code>', 'Relative: any input, anywhere, with that attribute', 'The days input'],
        ['<code>//button[text()="Submit request"]</code>', 'Exact match on the element’s own text node', 'The submit button'],
        ['<code>//span[contains(@class, "badge")]</code>', 'Attribute contains a substring', 'The badge'],
        ['<code>//td[starts-with(text(), "REQ-")]</code>', 'Text starts with a prefix', 'Both request-id cells'],
        ['<code>//span[text()="Status"]/following-sibling::span</code>', 'Axis: later siblings of the label', 'The badge next to “Status”'],
        ['<code>//td[text()="REQ-102"]/following-sibling::td/button</code>', 'From a unique cell to a button in the same row', 'Cancel for REQ-102'],
        ['<code>//button[text()="Cancel"]/ancestor::tr</code>', 'Axis: walk up to the enclosing row', 'Both rows'],
        ['<code>//input[@id="days"]/parent::form</code>', 'Axis: the direct parent (same as <code>/..</code>)', 'The form']
      ] },
      { t: 'callout', tone: 'warn', title: 'XPath traps', html: 'Browsers implement <b>XPath 1.0 only</b>, so <code>ends-with()</code>, <code>matches()</code> and <code>lower-case()</code> are not available. <code>text()</code> matches only an element’s <i>own</i> text nodes: if the word sits inside a child span, or has extra spaces, <code>//button[text()="Save"]</code> finds nothing — use <code>//button[normalize-space(.)="Save"]</code>. <code>//button[text()="Cancel"][2]</code> means “the second Cancel button <i>within the same parent</i>” and matches nothing here, while <code>(//button[text()="Cancel"])[2]</code> means “the second Cancel button in the document”. And <code>contains(@class, "btn")</code> also matches <code>btn-primary</code>.' },
      { t: 'compare',
        a: { title: 'CSS selectors', items: ['Short, readable, and the same syntax front-end developers use', 'Cannot match by visible text in standard CSS', 'Cannot step to a parent or earlier sibling, except via <code>:has()</code>', 'Playwright’s CSS engine also pierces open shadow DOM'] },
        b: { title: 'XPath', items: ['Can match by text and walk in any direction: parent, ancestor, siblings', 'Verbose, and browsers implement only XPath 1.0', 'Does not pierce shadow DOM', 'Absolute paths are the most brittle locators of all'] } },
      { t: 'h', text: 'Ranking locators by robustness' },
      { t: 'table', head: ['Rank', 'Strategy', 'Example', 'Breaks when…'], rows: [
        ['1', 'Role + accessible name', '<code>getByRole("button", { name: "Submit request" })</code>', 'The visible name changes — which users would notice too'],
        ['2', 'Label, placeholder or visible text', '<code>getByLabel("Number of days")</code>', 'The wording changes'],
        ['3', 'Dedicated test id', '<code>[data-testid="leave-days"]</code>', 'Someone removes the attribute — it is an agreed contract'],
        ['4', 'Stable id or name', '<code>#days</code>, <code>input[name="days"]</code>', 'A framework generates ids such as <code>input-4f9a</code> on every build'],
        ['5', 'Short relative CSS or XPath anchored on stable text', '<code>//tr[td[normalize-space()="REQ-102"]]//button</code>', 'The structure near the anchor changes'],
        ['6', 'Styling classes, positions, absolute paths', '<code>.btn-primary</code>, <code>div:nth-child(3)</code>, <code>/html/body/…</code>', 'Any styling or layout change']
      ] },
      { t: 'p', html: 'Playwright recommends <b>user-facing locators</b> because they mirror how people and assistive technology find things: by role (“button”), accessible name (“Submit request”) and label. They survive refactors of markup and CSS, and double as a light accessibility check — if <code>getByRole</code> cannot find your button, a screen-reader user may struggle too. CSS and XPath remain available through <code>page.locator()</code> for legacy markup. Selenium offers <code>By.id</code>, <code>By.name</code>, <code>By.cssSelector</code>, <code>By.xpath</code> and <code>By.linkText</code>, plus Selenium 4 relative locators (above, below, near, toLeftOf, toRightOf); the same robustness ranking applies.' },
      { t: 'callout', tone: 'tip', title: 'Check every selector in DevTools first', html: 'Before a selector goes into code, prove it matches exactly one element. In the <b>Elements</b> panel press <kbd>Ctrl</kbd>+<kbd>F</kbd> (<kbd>Cmd</kbd>+<kbd>F</kbd> on macOS) and type a CSS selector or XPath — DevTools highlights the matches and shows “1 of 1”. In the <b>Console</b>, <code>$$("css")</code> returns every match as an array, <code>$x("//xpath")</code> does the same for XPath, and <code>$("css")</code> returns the first match. These helpers exist only in DevTools, not in test code.' }
    ],
    example: {
      title: 'Worked example: repairing three broken locators after a redesign',
      blocks: [
        { t: 'p', html: 'After a redesign of the PeopleOps leave page, three Selenium tests fail with <code>NoSuchElementException</code> or click the wrong button. The feature still works by hand, so the tester inspects the new DOM in DevTools and repairs each locator, checking every candidate with <code>$x()</code> or <code>$$()</code> until it matches exactly one element.' },
        { t: 'table', head: ['Old locator', 'Why it broke', 'Repaired locator'], rows: [
          ['<code>/html/body/div[2]/form/div[3]/span[2]</code>', 'A new wrapper div shifted every index on the path', '<code>//span[normalize-space()="Status"]/following-sibling::span</code>, and a request for <code>data-testid="leave-status"</code>'],
          ['<code>//button[text()="Cancel"][2]</code>', 'Both Cancel buttons used to share one parent; now each row has its own, so <code>[2]</code> matches nothing', '<code>//tr[td[normalize-space()="REQ-102"]]//button[normalize-space()="Cancel"]</code>'],
          ['<code>.btn.btn-primary</code>', 'The redesign gave three buttons that class, so the first one was clicked', '<code>#leave-form button[type="submit"]</code>, or <code>getByRole</code> in Playwright']
        ] },
        { t: 'code', lang: 'java', title: 'Selenium (Java): the repaired locators', code: `By status    = By.xpath("//span[normalize-space()='Status']/following-sibling::span");
By cancel102 = By.xpath("//tr[td[normalize-space()='REQ-102']]//button[normalize-space()='Cancel']");
By submit    = By.cssSelector("#leave-form button[type='submit']");

wait.until(ExpectedConditions.elementToBeClickable(cancel102)).click();` },
        { t: 'code', lang: 'ts', title: 'Playwright: the same intent with user-facing locators', code: `const row = page.getByRole('row').filter({ hasText: 'REQ-102' });
await row.getByRole('button', { name: 'Cancel' }).click();
await page.getByRole('button', { name: 'Submit request' }).click();` },
        { t: 'p', html: 'Each repair anchors on something meaningful — the “Status” label, the request id, the form and the button type — instead of on position or styling. The tester also asked developers to add <code>data-testid="leave-status"</code>, because the badge has no accessible name of its own, and noted the redesign’s duplicate primary buttons as a possible usability issue.' }
      ]
    },
    explain: {
      'ur': 'ہر web page ایک DOM tree ہے: elements، ان کے attributes اور text۔ Locator اس tree میں صحیح element تک پہنچنے کا پتا ہے۔ <b>CSS selector</b> مختصر اور پڑھنے میں آسان ہے، جیسے #days یا input[name="days"]۔ <b>XPath</b> لمبا ہے مگر text سے ڈھونڈ سکتا ہے اور اوپر نیچے چل سکتا ہے، جیسے //td[text()="REQ-102"]/following-sibling::td/button۔ Absolute XPath جیسے /html/body/div[2]/span سے بچیں، کیونکہ ایک نیا div بھی اسے توڑ دیتا ہے۔ سب سے مضبوط locators وہ ہیں جو user کی نظر سے ہوں: Playwright میں getByRole اور getByLabel، پھر data-testid، اور سب سے آخر میں class یا position۔ Code میں لکھنے سے پہلے DevTools Console میں $$() یا $x() سے چیک کریں کہ صرف ایک element ملے۔',
      'ur-Latn': 'Har web page ek DOM tree hai: elements, un ke attributes aur text. Locator is tree mein sahi element tak pohanchne ka pata hai. <b>CSS selector</b> mukhtasar aur parhne mein aasaan hai, jaise #days ya input[name="days"]. <b>XPath</b> lamba hai magar text se dhoond sakta hai aur upar neeche chal sakta hai, jaise //td[text()="REQ-102"]/following-sibling::td/button. Absolute XPath jaise /html/body/div[2]/span se bachein, kyunke ek naya div bhi usay tor deta hai. Sab se mazboot locators woh hain jo user ki nazar se hon: Playwright mein getByRole aur getByLabel, phir data-testid, aur sab se aakhir mein class ya position. Code mein likhne se pehle DevTools Console mein $$() ya $x() se check karein ke sirf ek element mile.',
      'hi': 'हर web page एक DOM tree है: elements, उनके attributes और text। Locator इस tree में सही element तक पहुँचने का पता है। <b>CSS selector</b> छोटा और पढ़ने में आसान है, जैसे #days या input[name="days"]। <b>XPath</b> लंबा है पर text से ढूँढ सकता है और ऊपर-नीचे चल सकता है, जैसे //td[text()="REQ-102"]/following-sibling::td/button। Absolute XPath जैसे /html/body/div[2]/span से बचें, क्योंकि एक नया div भी उसे तोड़ देता है। सबसे मज़बूत locators वे हैं जो user की नज़र से हों: Playwright में getByRole और getByLabel, फिर data-testid, और सबसे आख़िर में class या position। Code में लिखने से पहले DevTools Console में $$() या $x() से जाँचें कि सिर्फ़ एक element मिले।',
      'ar': 'كل صفحة ويب هي شجرة DOM: عناصر وخصائصها (attributes) ونصوصها. والـ locator هو العنوان الذي يوصلك إلى العنصر الصحيح في هذه الشجرة. <b>CSS selector</b> قصير وسهل القراءة، مثل #days أو input[name="days"]. أما <b>XPath</b> فأطول، لكنه يستطيع البحث بالنص والتنقل صعودًا ونزولًا، مثل //td[text()="REQ-102"]/following-sibling::td/button. تجنّب الـ absolute XPath مثل /html/body/div[2]/span، لأن إضافة div واحد تكسره. أقوى الـ locators هي التي تحاكي نظرة المستخدم: getByRole وgetByLabel في Playwright، ثم data-testid، وفي النهاية الـ class أو الموضع. قبل كتابته في الكود، تحقّق في Console أدوات المطوّر باستخدام $$() أو $x() من أنه يطابق عنصرًا واحدًا فقط.',
      'es': 'Cada página web es un árbol DOM: elementos, sus atributos y su texto. Un locator es la dirección que lleva al elemento correcto dentro de ese árbol. Un <b>CSS selector</b> es corto y fácil de leer, como #days o input[name="days"]. <b>XPath</b> es más largo, pero puede buscar por texto y moverse hacia arriba y hacia los lados, como //td[text()="REQ-102"]/following-sibling::td/button. Evita el XPath absoluto como /html/body/div[2]/span: basta un div nuevo para romperlo. Los locators más robustos reflejan lo que ve el usuario: getByRole y getByLabel en Playwright, luego data-testid y, como último recurso, clases o posiciones. Antes de usarlo en el código, comprueba en la consola de DevTools con $$() o $x() que coincide con un solo elemento.'
    },
    keyTerms: [
      { term: 'DOM', def: 'Document Object Model: the browser’s live tree of elements, attributes and text that scripts and locators query.' },
      { term: 'CSS selector', def: 'A pattern such as #days, .badge or input[name="days"] that matches elements by id, class, attribute and position.' },
      { term: 'XPath', def: 'A path language for the DOM, such as //input[@id="days"], that can also match text and walk to parents and siblings.' },
      { term: 'Absolute vs relative XPath', def: 'Absolute starts at the root (/html/body/…) and breaks easily; relative starts with // and anchors on meaningful attributes or text.' },
      { term: 'XPath axis', def: 'A direction to move from a node, such as parent::, ancestor::, following-sibling:: or preceding-sibling::.' },
      { term: 'data-testid', def: 'A custom attribute added for tests, giving a stable hook that does not depend on styling or layout.' }
    ],
    practice: [
      { q: 'Using the sample DOM, write a CSS selector and an XPath for: (a) the days input; (b) the status badge; (c) the Cancel button in the REQ-101 row.', answer: '(a) CSS <code>#days</code> or <code>[data-testid="leave-days"]</code>; XPath <code>//input[@id="days"]</code>. (b) CSS <code>.row .badge</code>; XPath <code>//span[normalize-space()="Status"]/following-sibling::span</code>. (c) CSS cannot match by text, so it needs position: <code>.requests tr:nth-child(1) button</code>. The XPath <code>//tr[td[normalize-space()="REQ-101"]]//button</code> is better, because it anchors on the request id instead of the row order.' },
      { q: 'Explain the difference between <code>//button[text()="Cancel"][2]</code> and <code>(//button[text()="Cancel"])[2]</code> on the sample DOM.', hint: 'Does the [2] apply inside each parent, or to the whole result list?', answer: 'In the first, <code>[2]</code> belongs to the step, so it means “a Cancel button that is the second Cancel button <i>within its own parent</i>”. Each cell holds one button, so it matches nothing. In the second, the parentheses build the full result list first and <code>[2]</code> picks the second item in document order — the REQ-102 Cancel button. Both are positional, though; <code>//tr[td[normalize-space()="REQ-102"]]//button</code> says what you actually mean.' },
      { q: 'Rank these from most to least robust and justify the top and bottom: <code>.btn-primary</code>, <code>getByRole("button", { name: "Submit request" })</code>, <code>/html/body/form/button</code>, <code>[data-testid="submit-leave"]</code>, <code>#leave-form button[type="submit"]</code>.', answer: '1) <code>getByRole(…)</code> — tied to what users see and to accessibility. 2) <code>[data-testid="submit-leave"]</code> — an agreed contract, unaffected by styling. 3) <code>#leave-form button[type="submit"]</code> — short and anchored on stable attributes. 4) <code>.btn-primary</code> — styling classes are shared by many buttons and change with redesigns. 5) <code>/html/body/form/button</code> — absolute; any new wrapper breaks it. Some teams swap 1 and 2 by convention; what matters is that layout and styling never decide whether a test passes.' },
      { q: 'How would you confirm in DevTools that <code>//span[contains(@class,"badge")]</code> matches exactly one element, and what would you do if it matched three?', answer: 'In the Console run <code>$x("//span[contains(@class,\'badge\')]")</code> and check the array length, or paste the XPath into the Elements panel search (<kbd>Ctrl</kbd>+<kbd>F</kbd>) and look for “1 of 1”. If it matches three — say, a badge in every request row — anchor on context instead: <code>//span[normalize-space()="Status"]/following-sibling::span</code>, or scope to a unique container. Avoid tacking on <code>[1]</code>, which makes the locator depend on order.' }
    ],
    quiz: [
      { q: 'What is the main difference between /html/body/form/input and //input[@id="days"]?', options: ['The first is a CSS selector and the second is an XPath', 'The first is an absolute path from the root; the second is relative', 'The first is faster to evaluate, so it is preferred for stable tests', 'The second works only in Firefox, while the first works everywhere'], correct: 1,
        why: ['Both are XPath; CSS selectors do not use leading slashes.', 'Right — the absolute path depends on every level of the structure, while the relative one finds the input anywhere by its id.', 'Any speed difference is negligible, and the absolute path is far more brittle.', 'Both are standard XPath 1.0, which every major browser supports.'] },
      { q: 'Which CSS selector matches an input whose data-testid attribute is exactly leave-days?', options: ['[data-testid="leave-days"]', '#leave-days', '.leave-days', 'input:data-testid(leave-days)'], correct: 0,
        why: ['Right — square brackets match an attribute; = requires an exact value.', '# matches an id, and this element’s id is days.', 'A dot matches a class name, not a data attribute.', 'This is not valid CSS; attributes are matched with square brackets.'] },
      { q: 'A table has a Cancel button in every row. You need the Cancel button in the row containing REQ-102. Which XPath is most robust?', options: ['(//button)[2]', '/html/body/form/table/tbody/tr[2]/td[3]/button', '//button[text()="Cancel"][2]', '//tr[td[normalize-space()="REQ-102"]]//button'], correct: 3,
        why: ['It depends on the order of every button on the page; one new button anywhere above breaks it.', 'Absolute and positional — a wrapper or a reordered row breaks it.', 'The [2] applies within each parent, so with one button per cell it matches nothing.', 'Right — it anchors on the unique request id and finds the button inside that row, wherever the row sits.'] },
      { q: 'XPath //button[text()="Save"] finds nothing, although DevTools shows a Save button. The word Save sits inside a span element within the button. Why?', options: ['XPath cannot select button elements in HTML pages', 'text() is case-insensitive, so it matched another element', 'text() checks only the button’s own text, not its child span', 'The expression needs a leading dot, as in .//button[text()="Save"]'], correct: 2,
        why: ['XPath can select any element.', 'text() comparisons are case-sensitive, and nothing matched at all.', 'Right — use //button[normalize-space(.)="Save"] to compare the full text, including descendants.', 'A leading dot makes the search relative to a context node; it does not change how text() works.'] },
      { q: 'Why does Playwright recommend getByRole over CSS or XPath for most elements?', options: ['Role locators run faster because they skip the DOM tree entirely', 'They match how users and assistive technology perceive the page', 'CSS and XPath are not supported by Playwright at all', 'Role locators never need an accessible name to work'], correct: 1,
        why: ['Role locators still query the page; speed is not the reason.', 'Right — locators based on role and accessible name survive markup changes and double as an accessibility check.', 'page.locator() accepts both CSS and XPath for legacy cases.', 'The accessible name is what makes a role locator precise, e.g. { name: "Submit request" }.'] }
    ],
    interview: [
      { q: 'What is the difference between absolute and relative XPath, and which do you use?', a: 'An <b>absolute XPath</b> starts at the root with a single slash and lists every level, such as <code>/html/body/div[2]/form/span[2]</code>; one extra wrapper div breaks it. A <b>relative XPath</b> starts with <code>//</code> and anchors on something meaningful, such as <code>//span[normalize-space()="Status"]/following-sibling::span</code>. I use relative XPath only, and only when CSS or user-facing locators cannot express what I need — typically matching by text, or walking from a label to its value with an axis such as <code>following-sibling</code> or <code>ancestor</code>. I check every expression in DevTools with <code>$x()</code> to make sure it matches exactly one element.' },
      { q: 'CSS selector or XPath — which would you choose, and why?', a: 'Where I can, neither: in Playwright I start with <code>getByRole</code>, <code>getByLabel</code> or a <code>data-testid</code>, because those survive redesigns. Between the two, I default to <b>CSS</b>: it is shorter, easier to review and the same syntax developers use. I switch to <b>XPath</b> when I need what CSS cannot do — match by visible text, or move up to a parent or ancestor, although CSS <code>:has()</code> now covers some of that. Browsers implement only XPath 1.0, and XPath does not pierce shadow DOM, while Playwright’s CSS engine does. Whichever I pick, I anchor on stable attributes or text, never on position or styling classes.' }
    ],
    takeaways: [
      'Read the DOM as a tree and anchor locators on meaningful attributes or text, never on position.',
      'CSS is short and readable; XPath adds text matching and axes such as parent and following-sibling.',
      'Avoid absolute XPath, styling classes and indexes; prefer role, label and data-testid.',
      'Prove every selector matches exactly one element in DevTools ($$ and $x) before using it.'
    ],
    links: { labs: ['ui'], challenges: ['ui-interactions'], interview: ['p1', 'p4'] }
  },
  {
    id: 'au-selenium',
    n: 13,
    level: 'intermediate',
    title: 'Selenium WebDriver essentials: waits, TestNG and Grid',
    summary: 'Understand WebDriver architecture, synchronise with explicit waits, fix common exceptions, structure tests with TestNG and scale them on Selenium Grid.',
    minutes: 30,
    objectives: [
      'Explain how a Selenium command travels from test code to the browser',
      'Choose between implicit, explicit and fluent waits — and never mix implicit with explicit',
      'Diagnose NoSuchElement, StaleElementReference, ElementNotInteractable and Timeout exceptions',
      'Use TestNG annotations, hard and soft assertions, data providers and Selenium Grid'
    ],
    body: [
      { t: 'p', html: 'Selenium WebDriver is the long-standing open-source standard for browser automation, and many enterprise suites — especially in Java — are built on it. Interviews ask how it works, how you wait, which exceptions you have fixed, how TestNG is organised and how Grid runs tests in parallel. The architecture first: your test calls a <b>language binding</b> (the Selenium client library), which sends each command as an HTTP request defined by the <b>W3C WebDriver</b> standard to a <b>browser driver</b> such as chromedriver or geckodriver. The driver controls the browser and returns the result. Since Selenium 4.6, <b>Selenium Manager</b> finds or downloads a matching driver automatically.' },
      { t: 'flow', caption: 'Every command is a separate round trip. Apart from page loads, WebDriver does not wait for elements or state — synchronisation is your job.', steps: ['Test code (Java)', 'Selenium client binding', 'W3C WebDriver HTTP call', 'Browser driver', 'Browser acts', 'Response returns'] },
      { t: 'code', lang: 'java', title: 'Inside a test method (Selenium 4, TestNG assertions)', code: `WebDriver driver = new ChromeDriver();       // Selenium Manager resolves chromedriver
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
try {
    driver.get("https://peopleops.test/login");
    driver.findElement(By.id("email")).sendKeys("asha@peopleops.test");
    driver.findElement(By.id("password")).sendKeys(System.getenv("ASHA_PASSWORD"));
    driver.findElement(By.cssSelector("button[type='submit']")).click();

    WebElement heading = wait.until(
        ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
    Assert.assertEquals(heading.getText(), "Dashboard");   // TestNG: actual, expected

    // findElements returns an empty list instead of throwing
    List<WebElement> alerts = driver.findElements(By.cssSelector("[role='alert']"));
    Assert.assertTrue(alerts.isEmpty(), "no error banner expected");
} finally {
    driver.quit();                                 // always close the browser
}` },
      { t: 'h', text: 'Waits: implicit, explicit and fluent' },
      { t: 'table', head: ['Wait', 'How it works', 'Good for', 'Watch out'], rows: [
        ['<b>Implicit</b><br><code>driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5))</code>', 'A global setting: every <code>findElement</code> polls up to the timeout until the element is <i>present</i> in the DOM', 'Very small, simple suites', 'Waits for presence only, not visibility or clickability; <code>findElements</code> waits the full timeout before returning an empty list'],
        ['<b>Explicit</b><br><code>new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.elementToBeClickable(By.id("save")))</code>', 'Waits for one specific condition, polling every 500 ms by default and ignoring NotFoundException while it polls', 'Any meaningful state: visible, clickable, text present, URL contains, overlay gone', 'Throws <code>TimeoutException</code> if the condition never becomes true'],
        ['<b>Fluent</b><br><code>new FluentWait&lt;&gt;(driver).withTimeout(Duration.ofSeconds(30)).pollingEvery(Duration.ofSeconds(2)).ignoring(NoSuchElementException.class)</code>', 'An explicit wait with your own timeout, polling interval and ignored exceptions — WebDriverWait is built on it', 'Slow back-end jobs, custom conditions written as lambdas', 'Import <code>org.openqa.selenium.NoSuchElementException</code>, not the <code>java.util</code> class of the same name'],
        ['<b>Thread.sleep</b>', 'Pauses for a fixed time, whatever the page does', 'Almost never', 'Too slow on fast runs and still too short on slow ones']
      ] },
      { t: 'callout', tone: 'warn', title: 'Never mix implicit and explicit waits', html: 'Selenium’s documentation warns that combining them causes unpredictable wait times — an implicit wait of 10 seconds plus an explicit wait of 15 can time out after 20 seconds, because each poll of the explicit wait may itself wait implicitly. Keep the implicit wait at its default of 0 and use explicit waits for every condition that matters. If a legacy suite sets an implicit wait, remove it in one deliberate change and run the whole suite.' },
      { t: 'h', text: 'Exceptions you will meet — and real fixes' },
      { t: 'table', head: ['Exception', 'Usual cause', 'Real fix'], rows: [
        ['<code>NoSuchElementException</code>', 'Wrong locator, element not rendered yet, or it lives inside an iframe', 'Check the locator in DevTools; wait with ExpectedConditions; switch into the frame first'],
        ['<code>StaleElementReferenceException</code>', 'The element was found, then the DOM re-rendered it (sorting, AJAX refresh, navigation)', 'Find it again after the change; keep <code>By</code> locators in page objects instead of stored WebElements'],
        ['<code>ElementNotInteractableException</code>', 'The element exists but is hidden, disabled or has no size', 'Wait for <code>elementToBeClickable</code>; act on the visible control; scroll it into view'],
        ['<code>ElementClickInterceptedException</code>', 'Another element — spinner, overlay, cookie banner — would receive the click', 'Wait for <code>invisibilityOfElementLocated</code> on the overlay, or close the banner'],
        ['<code>TimeoutException</code>', 'An explicit wait’s condition never became true', 'Read which condition failed: wrong expectation, a real bug, or a timeout too short for this environment'],
        ['<code>NoSuchFrame</code> / <code>NoAlertPresent</code> / <code>NoSuchWindow</code>', 'Switching to something that is not there yet', 'Wait with <code>frameToBeAvailableAndSwitchToIt</code>, <code>alertIsPresent</code> or <code>numberOfWindowsToBe</code>']
      ] },
      { t: 'code', lang: 'java', title: 'Alerts, frames, windows and Actions', code: `// JavaScript alert or confirm dialog
Alert alert = wait.until(ExpectedConditions.alertIsPresent());
String message = alert.getText();
alert.accept();                                   // or alert.dismiss()

// iframe: switch in, work inside it, switch back out
wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.id("payment-frame")));
driver.findElement(By.id("card-number")).sendKeys("4111111111111111");
driver.switchTo().defaultContent();

// New tab or window
String original = driver.getWindowHandle();
driver.findElement(By.linkText("Help centre")).click();
wait.until(ExpectedConditions.numberOfWindowsToBe(2));
for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(original)) driver.switchTo().window(handle);
}
driver.close();                                   // closes only the current window
driver.switchTo().window(original);

// Actions: hover over a menu, then a keyboard chord
WebElement menu = driver.findElement(By.id("profile-menu"));
new Actions(driver).moveToElement(menu).perform();
new Actions(driver).keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).perform();` },
      { t: 'h', text: 'TestNG and Selenium Grid' },
      { t: 'cards', items: [
        { title: 'Lifecycle annotations', html: '<code>@BeforeSuite</code> → <code>@BeforeTest</code> (once per &lt;test&gt; tag in testng.xml) → <code>@BeforeClass</code> → <code>@BeforeMethod</code> → <code>@Test</code>, then the matching <code>@After…</code> methods in reverse. Use <code>@BeforeMethod</code> for a fresh browser per test.' },
        { title: '@Test attributes', html: '<code>priority</code>, <code>groups</code> (smoke, regression), <code>dependsOnMethods</code>, <code>enabled</code>, <code>timeOut</code>, <code>invocationCount</code> and <code>expectedExceptions</code>. Use dependencies sparingly — they hide independent failures.' },
        { title: '@DataProvider', html: 'Returns <code>Object[][]</code>, and the test runs once per row with those parameters — ideal for boundary and negative data. <code>parallel = true</code> runs the rows concurrently.' },
        { title: 'Hard assertions', html: '<code>Assert.assertEquals(actual, expected)</code> stops the test at the first failure. Mind the order: TestNG takes <i>actual</i> first, JUnit takes <i>expected</i> first.' },
        { title: 'Soft assertions', html: '<code>SoftAssert</code> records failures and carries on; nothing is reported until you call <code>assertAll()</code>, so forgetting that call makes failures disappear.' },
        { title: 'testng.xml', html: 'Defines suites, tests, classes, groups, parameters and parallel settings such as <code>parallel="methods" thread-count="4"</code>. Listeners add screenshots on failure and custom reports.' }
      ] },
      { t: 'code', lang: 'java', title: 'A data-driven TestNG test with hard and soft assertions', code: `public class LeaveRequestTest {
    private WebDriver driver;

    @BeforeMethod
    public void setUp() { driver = new ChromeDriver(); }

    @AfterMethod(alwaysRun = true)
    public void tearDown() { if (driver != null) driver.quit(); }

    @DataProvider(name = "invalidDays")
    public Object[][] invalidDays() {
        return new Object[][] { {"0", "Enter at least 1 day"}, {"31", "Maximum is 30 days"} };
    }

    @Test(dataProvider = "invalidDays", groups = "regression")
    public void rejectsInvalidDays(String days, String expectedError) {
        LeavePage leave = new LeavePage(driver).open();
        leave.requestDays(days);
        Assert.assertEquals(leave.errorText(), expectedError);  // hard: stops here if wrong

        SoftAssert soft = new SoftAssert();
        soft.assertFalse(leave.isSubmitted(), "no request should be created");
        soft.assertEquals(leave.balanceText(), "10 days available");
        soft.assertAll();                                       // reports every soft failure
    }
}` },
      { t: 'p', html: '<b>Selenium Grid</b> runs tests on remote browsers. A hub (router) receives each new session request and sends it to a <b>node</b> with the requested browser and platform; Grid 4 can run as one <i>standalone</i> process, as hub and nodes, or fully distributed, and official Docker images make nodes easy to start. Tests switch from <code>new ChromeDriver()</code> to <code>new RemoteWebDriver(gridUrl, new ChromeOptions())</code>. Parallelism comes from the runner: <code>parallel="methods" thread-count="4"</code> in testng.xml runs four methods at once, and a <code>ThreadLocal</code> driver holder gives each thread its own browser. Choose Selenium when the team works in Java, C# or Python, already has a working framework and Grid, or must drive real Safari or share the protocol with Appium; for a new TypeScript web suite, Playwright’s built-in auto-waiting and tracing are strong reasons to prefer it.' }
    ],
    example: {
      title: 'Worked example: de-flaking a PeopleOps approval test',
      blocks: [
        { t: 'p', html: 'A Selenium test “manager approves leave” fails about once a day in CI. The old version set <code>implicitlyWait(10 s)</code> globally, used <code>WebDriverWait</code> as well, slept for 3 seconds after clicking Approve, and read the status from a <code>WebElement</code> saved before the click. Failures alternated between <code>StaleElementReferenceException</code> and <code>ElementClickInterceptedException</code>.' },
        { t: 'table', head: ['Problem', 'Cause', 'Fix'], rows: [
          ['Unpredictable timeouts', 'Implicit and explicit waits mixed', 'Implicit wait removed; explicit waits only'],
          ['Click intercepted', 'A loading spinner covers the table while it refreshes', 'Wait for <code>invisibilityOfElementLocated</code> on the spinner'],
          ['Stale status cell', 'The table re-renders after approval, replacing the saved element', 'Store a <code>By</code> locator and wait on a fresh lookup'],
          ['Slow and still flaky', '<code>Thread.sleep(3000)</code>', 'Replaced by a condition: <code>textToBe(status, "Approved")</code>']
        ] },
        { t: 'code', lang: 'java', title: 'The fixed test', code: `@Test
public void managerApprovesLeave() {
    // the implicit wait stays at its default of 0: explicit waits only
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    String row = "//tr[td[normalize-space()='REQ-101']]";
    By approve = By.xpath(row + "//button[normalize-space()='Approve']");
    By status = By.xpath(row + "/td[@data-col='status']");

    driver.get(baseUrl + "/leave-requests");
    wait.until(ExpectedConditions.elementToBeClickable(approve)).click();
    wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".spinner")));

    // The table re-renders after approval, so wait on a fresh lookup by locator
    // instead of reusing a WebElement found before the click.
    wait.until(ExpectedConditions.textToBe(status, "Approved"));
    Assert.assertEquals(driver.findElement(status).getText(), "Approved");
}` },
        { t: 'p', html: 'Every wait now names the state the test actually needs, so a failure message says <i>what</i> never happened — “spinner still visible” or “status never became Approved” — instead of a generic stale element. The test also got faster, because it no longer sleeps for 3 seconds on every run.' }
      ]
    },
    explain: {
      'ur': 'Selenium WebDriver میں آپ کا test ہر command — جیسے click — ایک HTTP request کی صورت میں browser driver (مثلاً chromedriver) کو بھیجتا ہے، اور driver browser کو چلاتا ہے۔ Selenium خود elements کا انتظار نہیں کرتا، اس لیے waits سمجھنا ضروری ہے۔ <b>Explicit wait</b> بہترین ہے: مثلاً WebDriverWait کے ساتھ 10 سیکنڈ تک انتظار کریں جب تک Save button clickable نہ ہو جائے۔ Implicit wait ہر findElement پر لاگو ہوتا ہے؛ دونوں کو ملانے سے انتظار کا وقت غیر متوقع ہو جاتا ہے، اس لیے انہیں کبھی نہ ملائیں اور Thread.sleep سے بچیں۔ اگر page دوبارہ render ہو تو StaleElementReferenceException آتا ہے، تب element دوبارہ ڈھونڈیں۔ TestNG سے tests منظم کریں (@BeforeMethod، @Test، @DataProvider، SoftAssert)، اور Selenium Grid سے کئی browsers پر tests ایک ساتھ چلائیں۔',
      'ur-Latn': 'Selenium WebDriver mein aap ka test har command — jaise click — ek HTTP request ki shakal mein browser driver (maslan chromedriver) ko bhejta hai, aur driver browser ko chalata hai. Selenium khud elements ka intezar nahi karta, is liye waits samajhna zaroori hai. <b>Explicit wait</b> behtareen hai: maslan WebDriverWait ke saath 10 second tak intezar karein jab tak Save button clickable na ho jaye. Implicit wait har findElement par lagu hota hai; dono ko milane se intezar ka waqt unpredictable ho jata hai, is liye inhein kabhi na milayein aur Thread.sleep se bachein. Agar page dobara render ho to StaleElementReferenceException aata hai, tab element dobara dhoondein. TestNG se tests organize karein (@BeforeMethod, @Test, @DataProvider, SoftAssert), aur Selenium Grid se kai browsers par tests ek saath chalayein.',
      'hi': 'Selenium WebDriver में आपका test हर command — जैसे click — एक HTTP request के रूप में browser driver (जैसे chromedriver) को भेजता है, और driver browser को चलाता है। Selenium अपने आप elements का इंतज़ार नहीं करता, इसलिए waits समझना ज़रूरी है। <b>Explicit wait</b> सबसे अच्छा है: जैसे WebDriverWait के साथ 10 सेकंड तक इंतज़ार करें जब तक Save button clickable न हो जाए। Implicit wait हर findElement पर लागू होता है; दोनों को मिलाने से इंतज़ार का समय अनिश्चित हो जाता है, इसलिए इन्हें कभी न मिलाएँ और Thread.sleep से बचें। अगर page दोबारा render हो तो StaleElementReferenceException आता है, तब element फिर से ढूँढें। TestNG से tests व्यवस्थित करें (@BeforeMethod, @Test, @DataProvider, SoftAssert), और Selenium Grid से कई browsers पर tests एक साथ चलाएँ।',
      'ar': 'في Selenium WebDriver يرسل اختبارك كل أمر — مثل click — على شكل طلب HTTP إلى browser driver (مثل chromedriver)، والـ driver هو الذي يتحكم في المتصفح. لا ينتظر Selenium العناصر من تلقاء نفسه، لذا فإن فهم الـ waits ضروري. أفضلها <b>explicit wait</b>: مثلًا انتظر حتى 10 ثوانٍ باستخدام WebDriverWait إلى أن يصبح زر Save قابلًا للنقر. أما الـ implicit wait فيُطبَّق على كل findElement، ودمج النوعين يجعل مدة الانتظار غير متوقعة، فلا تدمجهما أبدًا وتجنّب Thread.sleep. إذا أُعيد رسم الصفحة يظهر StaleElementReferenceException، فابحث عن العنصر من جديد. نظّم الاختبارات باستخدام TestNG (@BeforeMethod و@Test و@DataProvider وSoftAssert)، وشغّلها على عدة متصفحات في وقت واحد عبر Selenium Grid.',
      'es': 'En Selenium WebDriver, tu test envía cada comando —como click— como una petición HTTP a un browser driver (por ejemplo chromedriver), y el driver controla el navegador. Selenium no espera a los elementos por sí solo, así que entender los waits es clave. Lo mejor es un <b>explicit wait</b>: por ejemplo, esperar hasta 10 segundos con WebDriverWait a que el botón Save sea clickable. El implicit wait se aplica a cada findElement; mezclar ambos produce tiempos de espera impredecibles, así que nunca los mezcles y evita Thread.sleep. Si la página se vuelve a renderizar aparece StaleElementReferenceException: busca el elemento otra vez. Organiza los tests con TestNG (@BeforeMethod, @Test, @DataProvider, SoftAssert) y ejecútalos en varios navegadores a la vez con Selenium Grid.'
    },
    keyTerms: [
      { term: 'W3C WebDriver', def: 'The web standard that defines how a client sends commands such as find element and click to a browser driver over HTTP.' },
      { term: 'Browser driver', def: 'A browser-specific program, such as chromedriver or geckodriver, that receives WebDriver commands and controls the browser.' },
      { term: 'Selenium Manager', def: 'A tool bundled since Selenium 4.6 that finds or downloads the matching driver (and, in recent versions, the browser) automatically.' },
      { term: 'Explicit wait', def: 'WebDriverWait plus a condition such as elementToBeClickable; it polls until the condition holds or the timeout is reached.' },
      { term: 'SoftAssert', def: 'A TestNG assertion object that collects failures and reports them all when assertAll() is called.' },
      { term: 'Selenium Grid', def: 'A server that routes WebDriver sessions to remote nodes with different browsers and platforms, enabling parallel runs.' }
    ],
    practice: [
      { q: 'Write a FluentWait that polls every 2 seconds for up to 60 seconds until a report’s status cell (id <code>report-status</code>) reads “Ready”, ignoring NoSuchElementException while the page refreshes.', hint: 'Return null from the lambda to keep polling; return the element when the condition holds.', answer: '<code>Wait&lt;WebDriver&gt; wait = new FluentWait&lt;&gt;(driver).withTimeout(Duration.ofSeconds(60)).pollingEvery(Duration.ofSeconds(2)).ignoring(NoSuchElementException.class);</code> then <code>WebElement cell = wait.until(d -&gt; { WebElement c = d.findElement(By.id("report-status")); return c.getText().equals("Ready") ? c : null; });</code>. Returning <code>null</code> (or <code>false</code>) means “keep polling”. Import <code>org.openqa.selenium.NoSuchElementException</code> — <code>java.util</code> has a class with the same name — and consider ignoring <code>StaleElementReferenceException</code> too if the cell is re-rendered.' },
      { q: 'A test saves the first table row as a WebElement, clicks “Sort by date” and then reads the saved row. It throws StaleElementReferenceException. Explain why and fix it.', answer: 'Sorting re-renders the table: the old row was removed from the DOM and replaced, so the saved reference points at nothing. Fix: keep a <code>By</code> locator, wait for the change, then look the row up again — for example <code>wait.until(ExpectedConditions.stalenessOf(oldRow))</code> followed by <code>driver.findElement(firstRow)</code>, or a condition on the fresh element such as <code>textToBe(firstDateCell, expectedDate)</code>. In page objects, store locators and find elements when a method runs. Catching the exception and retrying blindly hides real re-render bugs.' },
      { q: 'Your lead asks you to run 300 TestNG tests in parallel on Chrome and Firefox. Outline the framework changes.', answer: 'Start a Selenium Grid (standalone to try it, then hub and nodes or Docker containers per browser). Create drivers with <code>new RemoteWebDriver(gridUrl, options)</code>, picking <code>ChromeOptions</code> or <code>FirefoxOptions</code> from a testng.xml parameter. Hold the driver in a <code>ThreadLocal&lt;WebDriver&gt;</code> so threads never share a browser, and quit it in <code>@AfterMethod(alwaysRun = true)</code>. Set <code>parallel="methods"</code> (or classes) with a sensible <code>thread-count</code>. Make tests independent — unique test data, no static shared state, no <code>dependsOnMethods</code> chains — and add a listener that saves screenshots on failure.' }
    ],
    quiz: [
      { q: 'In Selenium 4, how does a command such as click() reach the browser?', options: ['The test injects JavaScript into the page, which then clicks the element directly', 'The browser polls the test runner for its next command every 500 ms', 'The binding sends a W3C WebDriver request to the browser driver', 'Selenium Grid must relay every command, even for local runs'], correct: 2,
        why: ['WebDriver commands go through the driver, which uses the browser’s automation support rather than injected page scripts.', 'The flow runs the other way: the client sends commands and waits for responses.', 'Right — client binding → W3C WebDriver HTTP request → chromedriver or geckodriver → browser, and the response comes back the same way.', 'Grid is optional; a local ChromeDriver talks to chromedriver directly.'] },
      { q: 'A suite sets an implicit wait of 10 seconds globally and also uses 15-second WebDriverWaits in page objects. Some failures take far longer than 15 seconds to report. What is the best fix?', options: ['Raise the explicit wait to 30 seconds so it outlasts the implicit one', 'Replace both kinds of wait with Thread.sleep for predictable timing', 'Add a retry listener that reruns each failed test three times', 'Set the implicit wait to zero and rely on explicit waits only'], correct: 3,
        why: ['Longer timeouts make failures slower still and keep the unpredictable interaction.', 'Fixed sleeps are slow on fast runs and still too short on slow ones.', 'Retries hide the timing problem instead of removing it.', 'Right — Selenium warns that mixing the two causes unpredictable waits; explicit waits alone are precise.'] },
      { q: 'Which exception means a WebElement you found earlier is no longer attached to the current DOM?', options: ['StaleElementReferenceException', 'NoSuchElementException', 'ElementNotInteractableException', 'TimeoutException'], correct: 0,
        why: ['Right — the page re-rendered or navigated after you found the element; look it up again.', 'That means the locator matched nothing when you searched.', 'That means the element exists but cannot be interacted with, e.g. it is hidden or disabled.', 'That comes from an explicit wait whose condition never became true.'] },
      { q: 'A test checks five fields on a profile page and should report every wrong field in one run, not just the first. Which TestNG approach fits?', options: ['Five Assert.assertEquals calls, which carry on after a failure', 'A SoftAssert object, ending with soft.assertAll()', '@Test(priority = 5) so that each check is retried', 'A @DataProvider returning the five expected values in one row'], correct: 1,
        why: ['Hard assertions stop the test at the first failure, so later fields are never checked.', 'Right — SoftAssert collects every failure and assertAll() reports them together.', 'priority controls the order of test methods; it does not retry or collect failures.', 'A data provider runs a test once per row; it does not change how failures are reported.'] },
      { q: 'Your Java team must run 600 Selenium tests on Chrome, Firefox and Edge within a short CI window. What is the standard approach?', options: ['Run TestNG in parallel against Selenium Grid nodes for each browser', 'Run all the tests one after another on one laptop with longer timeouts', 'Switch every wait to Thread.sleep so tests finish at a fixed time', 'Use a 60-second implicit wait so fewer tests fail on slow pages'], correct: 0,
        why: ['Right — Grid routes sessions to nodes per browser, and TestNG’s parallel settings run many sessions at once.', 'Sequential runs on one machine are the slowest option, and longer timeouts make them slower.', 'Sleeps add time and flakiness; they never make a suite faster.', 'A long implicit wait slows every negative check and hides timing problems.'] }
    ],
    interview: [
      { q: 'What is the difference between implicit, explicit and fluent waits?', a: 'An <b>implicit wait</b> is a global setting: every <code>findElement</code> polls up to the timeout until the element is present in the DOM. It cannot wait for visibility or clickability, and it makes <code>findElements</code> wait the full timeout before returning an empty list. An <b>explicit wait</b> — <code>WebDriverWait</code> with <code>ExpectedConditions</code> — waits for one specific condition such as <code>elementToBeClickable</code>, polling every 500 ms and throwing <code>TimeoutException</code> if it never happens. A <b>fluent wait</b> is an explicit wait where I also choose the polling interval and the exceptions to ignore. I keep the implicit wait at zero and use explicit waits only, because Selenium warns that mixing them makes wait times unpredictable — and I never use <code>Thread.sleep</code>.' },
      { q: 'How do you handle StaleElementReferenceException?', a: 'It means the element I hold was removed or re-rendered after I found it — typically after sorting, an AJAX refresh or navigation. I don’t catch and retry blindly. I find the element again after the change, ideally after waiting for the new state: <code>stalenessOf(oldElement)</code>, or a condition on a fresh lookup such as <code>textToBe(locator, "Approved")</code>. In page objects I store <code>By</code> locators and look elements up when a method runs, instead of caching WebElements in fields. If a page re-renders unexpectedly — a list refreshing every second, say — I raise it with the developers, because users may see flicker or lose their input too.' },
      { q: 'Explain the Selenium WebDriver architecture.', a: 'The test calls a <b>language binding</b> — the Selenium client library for Java, Python, C# and so on. Each command, such as <code>findElement</code> or <code>click</code>, becomes an HTTP request in the <b>W3C WebDriver</b> protocol, sent to a <b>browser driver</b>: chromedriver, geckodriver, msedgedriver or safaridriver. The driver uses the browser’s automation support to perform the action and returns a JSON response. Selenium Manager (4.6+) resolves the right driver automatically. With <b>Selenium Grid</b>, the same request goes to a remote hub that routes the session to a node with the requested browser, which is how teams run tests in parallel across browsers and platforms.' }
    ],
    takeaways: [
      'A Selenium command travels: binding → W3C WebDriver HTTP request → browser driver → browser.',
      'Use explicit waits for meaningful conditions; never mix implicit and explicit waits, and avoid Thread.sleep.',
      'Fix exceptions at the cause: re-locate stale elements, wait out overlays, switch into frames.',
      'TestNG organises tests (lifecycle, groups, data providers, soft assertions); Grid runs them in parallel.'
    ],
    links: { labs: ['ui', 'login'], challenges: ['peopleops-login'], interview: ['p2', 'p6'] }
  }
]);

/* ---------- Test bank (2 new MCQs per lesson) ---------- */
QA_CONTENT.addBank('sql-api', [
  { level: 'intermediate', topic: 'sa-rest-soap',
    q: 'A partner sends you the WSDL for its PolicyService. What can you learn from it before writing a single test?',
    options: ['The production database password used by the service', 'Live response times measured on the production servers', 'A set of real customer records to reuse as test data', 'The operations, message formats, data types and endpoint address'], correct: 3,
    why: ['A WSDL describes the interface and never holds credentials — if one did, that would be a security bug.', 'A WSDL is a static contract; performance has to be measured.', 'The WSDL defines data types, not data. Use synthetic test data.', 'Right — tools can generate a sample request for every operation straight from the WSDL.'] },
  { level: 'intermediate', topic: 'sa-rest-soap',
    q: 'Why is HTTP caching harder for a typical GraphQL API than for a REST API?',
    options: ['Most queries are POSTs to one URL, so the URL no longer identifies the data', 'GraphQL responses are XML documents, which browsers refuse to cache', 'The GraphQL specification forbids the Cache-Control header', 'GraphQL servers keep a session per client, which breaks shared caches'], correct: 0,
    why: ['Right — HTTP caches key on method and URL; with one POST endpoint, caching moves into client libraries or persisted queries.', 'GraphQL responses are JSON, not XML.', 'Nothing forbids caching headers; they simply help less when everything is a POST to one URL.', 'GraphQL over HTTP is normally stateless, just like REST.'] },
  { level: 'intermediate', topic: 'sa-sql-advanced',
    q: 'You combine customer emails from crm_contacts and shop_customers and must count every row from both sources, including people present in both. Which operator should you use?',
    options: ['UNION, because it keeps every row from both queries', 'INTERSECT, because it returns rows found in either query', 'UNION ALL, because it keeps duplicates instead of removing them', 'A CROSS JOIN, because set operators cannot combine two tables'], correct: 2,
    why: ['UNION removes duplicate rows, so people in both systems would be counted once.', 'INTERSECT returns only rows present in <i>both</i> queries.', 'Right — UNION ALL keeps every row, and it is faster because it skips de-duplication.', 'A cross join pairs every row with every other row — a very different result. Set operators combine result sets without trouble.'] },
  { level: 'advanced', topic: 'sa-sql-advanced',
    q: 'A developer adds an index on orders.customer_id. What changes for SELECT * FROM orders WHERE customer_id = 7?',
    options: ['It may return different rows, because the index filters the data', 'The same rows come back, potentially much faster', 'The query fails unless it names the index explicitly', 'Rows now come back in a guaranteed customer_id order'], correct: 1,
    why: ['Indexes never change which rows match a query.', 'Right — an index is an access path; results stay identical, and EXPLAIN shows whether it is used.', 'The optimiser chooses indexes automatically; queries do not need to name them.', 'Without ORDER BY, row order is never guaranteed, index or not.'] }
]);

QA_CONTENT.addBank('code-git', [
  { level: 'intermediate', topic: 'cg-oop',
    q: 'In a TypeScript subclass constructor, which call must run before you can use this?',
    options: ['this.init()', 'base(page)', 'super(page)', 'parent.constructor()'], correct: 2,
    why: ['There is no built-in init(), and this cannot be used before the parent constructor has run.', 'base is the C# keyword, not TypeScript or JavaScript.', 'Right — super(…) runs the parent constructor; touching this before it is an error.', 'This is not valid syntax for calling a parent constructor.'] },
  { level: 'intermediate', topic: 'cg-oop',
    q: 'BasePage is declared abstract with an abstract expectLoaded() method. A teammate writes new BasePage(page) in a test. What happens in TypeScript?',
    options: ['It compiles and runs an empty expectLoaded()', 'It compiles, but fails only in headed mode', 'It silently creates a LoginPage instead', 'A compile error: an abstract class cannot be instantiated'], correct: 3,
    why: ['An abstract method has no body to run, and the class cannot be instantiated at all.', 'Headed or headless mode has nothing to do with the type system.', 'TypeScript never substitutes a different class.', 'Right — abstract classes exist to be extended; tsc reports error TS2511.'] },
  { level: 'beginner', topic: 'cg-coding-interview',
    q: 'What does [...new Set([3, 1, 3, 2, 1])] return in JavaScript?',
    options: ['[3, 1, 2]', '[1, 2, 3]', '[3, 1, 3, 2, 1]', '[2]'], correct: 0,
    why: ['Right — a Set keeps the first occurrence of each value, in insertion order.', 'A Set does not sort; the order of first appearance is kept.', 'The Set removes the repeated 3 and 1.', 'That would be “values that appear exactly once” — a different problem.'] },
  { level: 'beginner', topic: 'cg-coding-interview',
    q: 'A FizzBuzz solution checks i % 3 first, then i % 5, then i % 15. What does it print for 15?',
    options: ['FizzBuzz', 'Buzz', 'Fizz', '15'], correct: 2,
    why: ['The i % 15 branch is never reached, because the i % 3 branch matches first.', '15 % 3 is checked before 15 % 5.', 'Right — the first matching branch wins, so check 15 (or both conditions) first.', '15 is divisible by 3, so a branch matches before the number itself is printed.'] }
]);

QA_CONTENT.addBank('automation', [
  { level: 'beginner', topic: 'au-locators',
    q: 'In the DevTools Console, which command returns every element matching the XPath //button?',
    options: ['$("//button")', 'document.xpath("//button")', '$x("//button")', '$$("//button")'], correct: 2,
    why: ['$() takes a CSS selector and returns only the first match.', 'There is no document.xpath(); the standard API is document.evaluate().', 'Right — $x() evaluates an XPath and returns an array of matches.', '$$() takes a CSS selector, so an XPath string is invalid there.'] },
  { level: 'intermediate', topic: 'au-locators',
    q: 'A div with class steps contains, in order, an h3 heading and then paragraphs One and Two. Which element does div.steps p:nth-child(2) match?',
    options: ['Paragraph One, because it is the second child overall', 'Paragraph Two, because it is the second paragraph', 'Nothing, because nth-child only works on list items', 'The h3, because counting starts at zero'], correct: 0,
    why: ['Right — :nth-child counts all siblings and the h3 is child 1. Use p:nth-of-type(2) to get paragraph Two.', 'That is what p:nth-of-type(2) would match.', ':nth-child works on any element.', 'CSS counting starts at 1, and the selector also requires a p element.'] },
  { level: 'intermediate', topic: 'au-selenium',
    q: 'Which TestNG feature runs the same test method once for each row of test data?',
    options: ['@BeforeMethod', 'SoftAssert', '@Test(priority = 1)', '@DataProvider'], correct: 3,
    why: ['@BeforeMethod runs setup before each test; it does not supply data.', 'SoftAssert collects assertion failures; it does not repeat tests.', 'priority only controls the order of test methods.', 'Right — the provider returns Object[][], and each row becomes one invocation with those parameters.'] },
  { level: 'intermediate', topic: 'au-selenium',
    q: 'Clicking Save throws ElementClickInterceptedException, and the failure screenshot shows a loading overlay covering the page. What is the best fix?',
    options: ['Increase the implicit wait to 60 seconds', 'Wait until the overlay is invisible, then click Save', 'Click with JavaScript so the overlay no longer matters', 'Add Thread.sleep(5000) before every click in the suite'], correct: 1,
    why: ['An implicit wait only waits for elements to be present; the button is present, just covered.', 'Right — invisibilityOfElementLocated on the overlay waits for the same condition a user waits for.', 'A JavaScript click bypasses what a real user experiences and can hide a genuine bug, such as an overlay that never disappears.', 'Fixed sleeps slow every test and still fail when the overlay takes longer than 5 seconds.'] }
]);

/* ---------- Drills ---------- */
QA_CONTENT.addDrills('sql-api', [
  {
    id: 'sa-d6', type: 'fill', level: 'intermediate',
    title: 'Name the SQL keyword',
    prompt: 'Type the SQL clause, keyword or function that fits each description. Capitalisation does not matter.',
    fields: [
      { label: 'Filters groups after GROUP BY, e.g. keep only emails with COUNT(*) > 1', accept: ['HAVING', 'having count(*) > 1'], why: '<b>HAVING</b> filters groups after aggregation. WHERE filters rows before grouping and cannot use aggregates.' },
      { label: 'Combines two result sets and keeps duplicate rows', accept: ['UNION ALL'], why: '<b>UNION ALL</b> keeps every row. Plain UNION removes duplicates and does extra work to find them.' },
      { label: 'Window function that ranks ties equally with no gap afterwards (1, 2, 2, 3)', accept: ['DENSE_RANK', 'DENSE_RANK()', 'dense rank', 'dense_rank() over'], why: '<b>DENSE_RANK()</b>. RANK() would give 1, 2, 2, 4 and ROW_NUMBER() 1, 2, 3, 4.' },
      { label: 'Words inside OVER (…) that restart the numbering for each department', accept: ['PARTITION BY', 'PARTITION', 'partition by dept'], why: '<b>PARTITION BY dept</b> splits the rows into groups, and the window function restarts in each one.' },
      { label: 'NULL-safe way to say “no matching row in the subquery”: NOT ____ (SELECT 1 …)', accept: ['EXISTS', 'NOT EXISTS'], why: '<b>NOT EXISTS</b> stays correct when the subquery returns NULLs; NOT IN returns no rows at all if any value is NULL.' },
      { label: 'Command that removes every row but keeps the table, and has no WHERE clause', accept: ['TRUNCATE', 'TRUNCATE TABLE'], why: '<b>TRUNCATE</b> empties the table and keeps its structure. DELETE accepts WHERE; DROP removes the table itself. Whether TRUNCATE can be rolled back depends on the database.' }
    ]
  }
]);

QA_CONTENT.addDrills('code-git', [
  {
    id: 'cg-d5', type: 'spot', level: 'intermediate',
    title: 'Spot the bugs in a candidate’s solutions',
    prompt: 'A candidate wrote these one-line JavaScript solutions in a coding interview. Select every line that returns a wrong result for some realistic input.',
    lines: [
      { text: "function isPalindrome(s) { return s === s.split('').reverse(); }", flaw: true, why: 'It compares a string with an <b>array</b>, so it always returns <code>false</code> — even for “level”. Add <code>.join("")</code> after <code>reverse()</code>.' },
      { text: "function reverse(s) { let out = ''; for (let i = s.length; i >= 0; i--) out += s[i]; return out; }", flaw: true, why: 'Off by one: <code>s[s.length]</code> is <code>undefined</code>, so <code>reverse("abc")</code> returns “undefinedcba”. Start at <code>s.length - 1</code>.' },
      { text: 'const unique = arr => [...new Set(arr)];', flaw: false, why: 'Correct and idiomatic: a Set keeps the first occurrence of each value, in order.' },
      { text: 'function countChars(s) { const c = {}; for (const ch of s) c[ch] = (c[ch] || 0) + 1; return c; }', flaw: false, why: 'A correct frequency count, and <code>for…of</code> keeps emoji whole.' },
      { text: 'function isAnagram(a, b) { return a.length === b.length; }', flaw: true, why: 'Equal length is necessary but not sufficient: “abc” and “xyz” would pass. Compare sorted characters or character counts.' },
      { text: 'function max(nums) { let m = 0; for (const n of nums) if (n > m) m = n; return m; }', flaw: true, why: 'Starting at 0 fails for all-negative input: <code>max([-5, -2])</code> returns 0, which is not even in the array, and an empty array also returns 0. Start from the first element or <code>-Infinity</code> and decide what empty input returns.' },
      { text: "function fizz(i) { if (i % 15 === 0) return 'FizzBuzz'; if (i % 3 === 0) return 'Fizz'; if (i % 5 === 0) return 'Buzz'; return String(i); }", flaw: false, why: 'Checks 15 first, so multiples of both 3 and 5 correctly return “FizzBuzz”.' },
      { text: '[a, b] = [b, a];', flaw: false, why: 'A destructuring swap — clear, and it works for any type.' },
      { text: 'function hasDuplicates(arr) { return new Set(arr).size !== arr.length; }', flaw: false, why: 'Correct: a Set drops repeated values, so a smaller size means at least one value repeats.' }
    ]
  }
]);

QA_CONTENT.addDrills('automation', [
  {
    id: 'au-d6', type: 'classify', level: 'beginner',
    title: 'CSS selector, XPath or user-facing locator?',
    prompt: 'Sort each locator by its kind. They all target the PeopleOps leave form from the locators lesson.',
    categories: ['CSS selector', 'XPath expression', 'Playwright role or label locator'],
    items: [
      { text: 'div.row > span.value', cat: 0, why: 'Class selectors and the <code>&gt;</code> child combinator are CSS.' },
      { text: "//span[text()='Status']/following-sibling::span", cat: 1, why: 'Starts with <code>//</code> and uses an axis (<code>following-sibling::</code>) — stepping between siblings like this is XPath.' },
      { text: "getByRole('button', { name: 'Submit request' })", cat: 2, why: 'A Playwright user-facing locator: role plus accessible name.' },
      { text: "input[name='days']", cat: 0, why: 'Square-bracket attribute matching without <code>@</code> is CSS; XPath would write <code>//input[@name="days"]</code>.' },
      { text: "//tr[td[normalize-space()='REQ-102']]//button", cat: 1, why: 'Nested predicates and functions such as <code>normalize-space()</code> are XPath.' },
      { text: "getByLabel('Number of days')", cat: 2, why: 'Finds the input through its visible label, the way a user would.' },
      { text: "[data-testid='leave-days']", cat: 0, why: 'A CSS attribute selector. Playwright’s <code>getByTestId("leave-days")</code> targets the same attribute.' },
      { text: "(//button[text()='Cancel'])[2]", cat: 1, why: 'Parentheses with a position index select the second match in the document — an XPath idiom, and a positional, brittle one.' }
    ]
  }
]);

/* ---------- Visual guides ---------- */
QA_CONTENT.addVisuals({
  'sa-rest-soap': [
    { t: 'sequence', title: 'The same lookup in REST and SOAP',
      actors: ['Test client', 'REST API', 'SOAP service'],
      steps: [
        { from: 0, to: 1, label: 'GET /orders/5012' },
        { from: 1, to: 0, label: '200 OK + JSON order', reply: true },
        { from: 0, to: 1, label: 'GET /orders/99999' },
        { from: 1, to: 0, label: '404 + JSON error body', reply: true },
        { from: 0, to: 2, label: 'POST /OrderService (Envelope: GetOrder)' },
        { from: 2, to: 0, label: '200 OK + GetOrderResponse in Body', reply: true },
        { from: 0, to: 2, label: 'POST GetOrder with an unknown orderId' },
        { from: 2, to: 0, label: '500 + soap:Fault (faultcode Client)', reply: true }
      ],
      caption: 'REST puts the resource in the URL and the outcome in the status code. SOAP posts an envelope to one endpoint and reports errors as a Fault — in SOAP 1.1 with HTTP 500, even when the client is at fault.' },
    { t: 'layers', title: 'GraphQL: one endpoint in front of many sources',
      items: [
        { label: 'Client query', sub: 'Asks for exactly the fields a screen needs, e.g. order { id status customer { name } }' },
        { label: 'POST /graphql', sub: 'A single endpoint; the query and its variables travel in the JSON body' },
        { label: 'Schema and validation', sub: 'The typed schema rejects unknown fields; depth and complexity limits stop abusive queries' },
        { label: 'Resolvers', sub: 'One function per field; each can fail on its own and add an entry to errors' },
        { label: 'Services and databases', sub: 'Data from several back ends is merged into one response shaped like the query' }
      ],
      caption: 'Because every field has its own resolver, part of a query can fail while the rest succeeds. That is why a 200 response can carry an errors array next to partial data.' }
  ],
  'sa-sql-advanced': [
    { t: 'timeline', title: 'The order a SELECT is evaluated',
      items: [
        { label: 'FROM and JOIN', sub: 'Build the working set of rows' },
        { label: 'WHERE', sub: 'Filter rows — aggregates and window results do not exist yet' },
        { label: 'GROUP BY', sub: 'Collapse rows into groups' },
        { label: 'HAVING', sub: 'Filter groups, e.g. COUNT(*) > 1' },
        { label: 'SELECT list', sub: 'Compute expressions, aliases and window functions such as DENSE_RANK' },
        { label: 'DISTINCT', sub: 'Remove duplicate result rows' },
        { label: 'ORDER BY', sub: 'Sort — aliases from the SELECT list can be used here' },
        { label: 'LIMIT / OFFSET', sub: 'Skip and take rows from the sorted result' }
      ],
      caption: 'This logical order explains two classic mistakes: WHERE cannot see a window-function alias such as rnk, and LIMIT/OFFSET without DISTINCT counts duplicate rows. Wrap a ranking in a subquery or CTE to filter on it.' },
    { t: 'tree', title: 'Which query pattern?',
      root: { label: 'What does the question ask for?', children: [
        { label: 'Nth highest value', edge: 'Ranking', children: [
          { label: 'Value only: DISTINCT + LIMIT/OFFSET', edge: 'Just the number' },
          { label: 'People too: DENSE_RANK subquery', edge: 'With ties' }
        ] },
        { label: 'Duplicate rows', edge: 'Data quality', children: [
          { label: 'GROUP BY … HAVING COUNT(*) > 1', edge: 'Count them' },
          { label: 'ROW_NUMBER() … WHERE rn > 1', edge: 'List extras' }
        ] },
        { label: 'Compare rows of one table', edge: 'Same table', children: [
          { label: 'Self-join with two aliases' }
        ] },
        { label: 'No matching row exists', edge: 'Absence', children: [
          { label: 'NOT EXISTS (NULL-safe)' }
        ] }
      ] },
      caption: 'Start from what the interviewer actually wants — a value, the people, the extra copies or the missing rows — and the pattern follows. Clarify ties and NULLs before writing anything.' }
  ],
  'cg-oop': [
    { t: 'sequence', title: 'Polymorphism at runtime: cartPage.open()',
      actors: ['Test', 'BasePage.open()', 'CartPage', 'Browser page'],
      steps: [
        { from: 0, to: 1, label: 'cartPage.open()' },
        { from: 1, to: 3, label: 'page.goto("/cart")' },
        { from: 3, to: 1, label: 'Cart page loaded', reply: true },
        { from: 1, to: 2, label: 'this.expectLoaded() → CartPage version' },
        { from: 2, to: 3, label: 'expect(cart heading).toBeVisible()' },
        { from: 3, to: 2, label: 'Heading visible', reply: true },
        { from: 2, to: 1, label: 'Load check passed', reply: true },
        { from: 1, to: 0, label: 'open() resolves', reply: true }
      ],
      caption: 'open() is written once in BasePage, yet this.expectLoaded() runs CartPage’s override because the object is a CartPage. That runtime choice is polymorphism; Java overloading, by contrast, is fixed at compile time.' },
    { t: 'layers', title: 'Inheritance for the base, composition for the parts',
      items: [
        { label: 'Test specs', sub: 'Describe user journeys: login.open(), leave.requestDays(3), leave.header.search()' },
        { label: 'Page objects', sub: 'LoginPage, LeavePage, ProductPage — each extends a thin BasePage (is-a)' },
        { label: 'Thin BasePage', sub: 'Only what every page shares: page handle, path, open(), abstract expectLoaded()' },
        { label: 'Component objects', sub: 'HeaderComponent, DatePicker, DataTable — held as fields by pages (has-a)' },
        { label: 'Playwright Page and Locator API', sub: 'The browser automation layer underneath everything' }
      ],
      caption: 'Tests talk only to page objects. Pages inherit a small base and compose reusable components, so a header change touches one class instead of every page.' }
  ],
  'cg-coding-interview': [
    { t: 'flowchart', title: 'Solving a coding question out loud', dir: 'down',
      nodes: [
        { id: 'read', label: 'Read the problem', kind: 'start' },
        { id: 'clear', label: 'Inputs, outputs and limits clear?', kind: 'decision' },
        { id: 'ask', label: 'Ask: empty? null? case? ties?' },
        { id: 'examples', label: 'Write 2–3 examples, one an edge case' },
        { id: 'approach', label: 'Say a simple approach and its Big-O' },
        { id: 'code', label: 'Code it with clear names' },
        { id: 'trace', label: 'Trace the examples line by line' },
        { id: 'pass', label: 'Edge cases pass?', kind: 'decision' },
        { id: 'fix', label: 'Fix the bug and retest' },
        { id: 'done', label: 'Discuss optimisations', kind: 'end' }
      ],
      edges: [
        { from: 'read', to: 'clear' },
        { from: 'clear', to: 'ask', label: 'No' },
        { from: 'ask', to: 'clear' },
        { from: 'clear', to: 'examples', label: 'Yes' },
        { from: 'examples', to: 'approach' },
        { from: 'approach', to: 'code' },
        { from: 'code', to: 'trace' },
        { from: 'trace', to: 'pass' },
        { from: 'pass', to: 'fix', label: 'No' },
        { from: 'fix', to: 'trace' },
        { from: 'pass', to: 'done', label: 'Yes' }
      ],
      caption: 'Two loops matter: ask until the rules are clear, and fix-and-retest until your own edge cases pass. Interviewers value those loops as much as the final code.' },
    { t: 'tree', title: 'Which data structure fits?',
      root: { label: 'What must you remember while looping?', children: [
        { label: 'Have I seen this value?', edge: 'Membership', children: [{ label: 'Set: duplicates, unique values' }] },
        { label: 'How many times?', edge: 'Counts', children: [{ label: 'Map or object: frequency, anagrams' }] },
        { label: 'Best value so far?', edge: 'Extremes', children: [{ label: 'Variables: max and second max' }] },
        { label: 'Order of characters?', edge: 'Sequence', children: [{ label: 'Array: reverse, palindrome' }] }
      ] },
      caption: 'Most QA coding exercises are one loop plus the right thing to remember. Choosing a Set or a Map is what turns an O(n²) nested-loop answer into O(n).' }
  ],
  'au-locators': [
    { t: 'pyramid', title: 'Locator robustness: rely most on the base',
      levels: [
        { label: 'Absolute XPath, positions', note: 'Almost never: /html/body/div[2]/… breaks on any layout change' },
        { label: 'Styling classes, nth-child', note: 'Fragile: shared between elements and renamed in redesigns' },
        { label: 'Relative CSS/XPath on stable text', note: 'Fine when anchored on a label, a request id or a stable attribute' },
        { label: 'data-testid, stable id or name', note: 'Agreed contracts that ignore styling and layout' },
        { label: 'Role, label and visible text', note: 'Use most: user-facing, survives refactors, checks accessibility' }
      ],
      caption: 'The wider the layer, the more of your suite should use it. Strategies at the narrow top are a last resort — and each one is a prompt to ask developers for a role, a label or a test id.' },
    { t: 'tree', title: 'The sample DOM as a tree',
      root: { label: 'form#leave-form', children: [
        { label: 'label "Number of days"' },
        { label: 'input#days [data-testid]' },
        { label: 'div.row', children: [
          { label: 'span.label "Status"' },
          { label: 'span.badge "Pending approval"' }
        ] },
        { label: 'table > tbody', children: [
          { label: 'tr: REQ-101 · Annual · Cancel' },
          { label: 'tr (second row)', children: [
            { label: 'td "REQ-102"' },
            { label: 'td "Sick"' },
            { label: 'td > button "Cancel"' }
          ] }
        ] },
        { label: 'button[type=submit]' }
      ] },
      caption: 'XPath axes move around this tree: from td "REQ-102", following-sibling::td reaches the Cancel cell; from a button, ancestor::tr climbs to its row; from span "Status", following-sibling::span reaches the badge. Note the tbody the browser inserts.' }
  ],
  'au-selenium': [
    { t: 'sequence', title: 'One findElement and click, end to end',
      actors: ['Test (Java)', 'Selenium client', 'chromedriver', 'Chrome'],
      steps: [
        { from: 0, to: 1, label: 'driver.findElement(By.id("save"))' },
        { from: 1, to: 2, label: 'POST /session/{id}/element' },
        { from: 2, to: 3, label: 'Locate the element in the page' },
        { from: 3, to: 2, label: 'Element found', reply: true },
        { from: 2, to: 1, label: 'JSON: element reference', reply: true },
        { from: 1, to: 0, label: 'WebElement', reply: true },
        { from: 0, to: 1, label: 'element.click()' },
        { from: 1, to: 2, label: 'POST /session/{id}/element/{eid}/click' },
        { from: 2, to: 3, label: 'Dispatch a real click' },
        { from: 2, to: 1, label: '200 OK, value null', reply: true }
      ],
      caption: 'Each Selenium call is its own HTTP round trip in the W3C WebDriver protocol. Nothing here waits for the button to be ready — that is what explicit waits are for.' },
    { t: 'flowchart', title: 'How an explicit wait polls', dir: 'down',
      nodes: [
        { id: 'start', label: 'wait.until(condition)', kind: 'start' },
        { id: 'eval', label: 'Evaluate the condition' },
        { id: 'exc', label: 'Exception thrown?', kind: 'decision' },
        { id: 'ign', label: 'An ignored type, e.g. NotFound?', kind: 'decision' },
        { id: 'prop', label: 'Exception propagates to the test', kind: 'end' },
        { id: 'ok', label: 'Result true or non-null?', kind: 'decision' },
        { id: 'ret', label: 'Return the result; test continues', kind: 'end' },
        { id: 'time', label: 'Timeout reached?', kind: 'decision' },
        { id: 'sleep', label: 'Sleep for the polling interval (500 ms)' },
        { id: 'fail', label: 'Throw TimeoutException', kind: 'end' }
      ],
      edges: [
        { from: 'start', to: 'eval' },
        { from: 'eval', to: 'exc' },
        { from: 'exc', to: 'ign', label: 'Yes' },
        { from: 'exc', to: 'ok', label: 'No' },
        { from: 'ign', to: 'time', label: 'Yes' },
        { from: 'ign', to: 'prop', label: 'No' },
        { from: 'ok', to: 'ret', label: 'Yes' },
        { from: 'ok', to: 'time', label: 'No' },
        { from: 'time', to: 'fail', label: 'Yes' },
        { from: 'time', to: 'sleep', label: 'No' },
        { from: 'sleep', to: 'eval' }
      ],
      caption: 'WebDriverWait polls every 500 ms by default and treats NotFoundException as “not yet”. A fluent wait changes the interval and the ignored exceptions; an implicit wait inside each poll would distort this timing.' },
    { t: 'layers', title: 'TestNG scopes, outermost to innermost', nested: true,
      items: [
        { label: 'Suite', sub: '@BeforeSuite / @AfterSuite run once for the whole testng.xml run' },
        { label: 'test tag in testng.xml', sub: '@BeforeTest / @AfterTest run once per test tag, e.g. once per browser' },
        { label: 'Test class', sub: '@BeforeClass / @AfterClass run once per class' },
        { label: 'Test method', sub: '@BeforeMethod / @AfterMethod wrap every @Test, e.g. a fresh browser' }
      ],
      caption: 'Put setup at the narrowest scope that keeps tests independent: a browser per method is safest, while expensive shared services can start once per suite.' }
  ]
});
