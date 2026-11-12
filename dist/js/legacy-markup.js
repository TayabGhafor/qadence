/* Qadence · markup for the ported practice screens (labs, challenges, workspace,
   submissions, interview prep, career roadmap, progress panels, data page).
   Injected before legacy-core.js binds its handlers — element ids and data-attributes
   are part of that contract, so keep them. Uses window.icon from icons.js. */
(function () {
  'use strict';
  const I = (n, c) => window.icon(n, c);
  const head = (eyebrowIcon, eyebrow, title, sub, side, ids) => `<div class="page-head legacy-head"><div><span class="eyebrow">${I(eyebrowIcon, 'ic-sm')}${eyebrow}</span><h1${ids && ids.h ? ` id="${ids.h}"` : ''}>${title}</h1><p${ids && ids.p ? ` id="${ids.p}"` : ''}>${sub}</p></div>${side ? `<div class="actions">${side}</div>` : ''}</div>`;
  const field = (id, label, control) => `<div class="field"><label for="${id}">${label}</label>${control}</div>`;

  const M = {
    learning: `${head('route', 'Career roadmap', 'Your 24-week SQA career roadmap', 'Eight self-paced stages from QA foundations to job applications, based on a two-part SQA career roadmap. Each stage guide links to labs, challenges and interview practice.', `<span class="badge badge-brand">${I('flag')}8 stages · self-paced</span>`)}
<div id="learningOverview"></div><div id="lessonDetail" hidden></div>`,

    challenges: `${head('trophy', 'Hands-on challenges', 'Challenge library', 'Pick a realistic scenario, explore the built-in target app, then submit your test cases, approach and automation draft for rubric feedback.', `<span class="badge badge-outline">${I('layers')}6 in-site scenarios</span>`)}
<div class="challenge-filters card card-flat">
  ${field('challengeTrack', 'Track', '<select class="select" id="challengeTrack"><option value="all">All tracks</option><option>Manual QA</option><option>API testing</option><option>Web automation</option><option>Mobile testing</option></select>')}
  ${field('challengeLevel', 'Difficulty', '<select class="select" id="challengeLevel"><option value="all">All levels</option><option>Foundation</option><option>Intermediate</option><option>Advanced</option></select>')}
  ${field('challengeFramework', 'Framework', '<select class="select" id="challengeFramework"><option value="all">Any framework</option><option>Playwright</option><option>Cypress</option><option>Selenium</option><option>Postman</option></select>')}
</div>
<div class="challenge-library" id="challengeLibrary"></div>`,

    workspace: `<div class="page-head legacy-head workspace-title"><div><span class="eyebrow">${I('terminal', 'ic-sm')}Built-in practice workspace</span><h1 id="workspaceTitle">PeopleOps Portal · Sign-in and session checks</h1><p id="workspaceDescription">Explore this simulated app, then write the tests and explain your choices.</p></div>
  <div class="actions workspace-actions"><span class="save-state" id="draftState" role="status">Saved in this browser</span><button class="btn btn-secondary btn-sm" type="button" id="saveWorkspace">${I('save')}Save draft</button><button class="btn btn-primary btn-sm" type="button" id="submitWorkspace">${I('send')}Submit attempt</button></div></div>
<div class="code-workbench">
  <section class="work-panel target-panel" aria-labelledby="targetTitle">
    <div class="work-head"><span>${I('cursor', 'ic-sm')}Practice target</span><span class="badge badge-brand">In this site</span></div>
    <div class="work-body"><h2 class="work-title" id="targetTitle">PeopleOps Portal</h2><p id="targetScenario" class="muted">Simulated employee sign-in and access control.</p>
      <div class="target-mini" id="targetAppView"></div>
      <button class="link-btn" type="button" id="openFullLab">Open full interactive lab${I('arrow-right', 'ic-sm flip-rtl')}</button>
      <div class="task-list"><b>${I('list-checks', 'ic-sm')}Challenge checklist</b><label class="check-row"><input type="checkbox" data-task-check="valid login"> <span>Valid and invalid login</span></label><label class="check-row"><input type="checkbox" data-task-check="session"> <span>Session and logout behavior</span></label><label class="check-row"><input type="checkbox" data-task-check="protected route"> <span>Protected route access</span></label></div>
    </div>
  </section>
  <section class="work-panel editor-panel" aria-label="Your solution">
    <div class="work-head"><span>${I('code', 'ic-sm')}Your solution</span><label class="fw-pick"><span>Framework</span><select class="select" id="frameworkSelect"><option>Playwright · TypeScript</option><option>Cypress · JavaScript</option><option>Selenium · Python</option><option>Postman</option><option>Manual</option></select></label></div>
    <div class="editor-tabs"><button class="editor-tab active" type="button" data-editor-pane="code">${I('code', 'ic-sm')}Code</button><button class="editor-tab" type="button" data-editor-pane="approach">${I('note', 'ic-sm')}Approach</button><button class="editor-tab" type="button" data-editor-pane="tests">${I('list-checks', 'ic-sm')}Test cases</button></div>
    <div class="editor-pane active" id="pane-code"><label for="scriptEditor">Automation script</label><div class="code-shell"><div class="codeblock-head"><span class="dots"><i></i><i></i><i></i></span><span>draft.spec · not executed</span></div><textarea id="scriptEditor" class="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div><p class="editor-help">${I('info', 'ic-xs')} Draft a script, then run it locally with your selected framework. Qadence stores and reviews your submission; it does not execute arbitrary code.</p></div>
    <div class="editor-pane" id="pane-approach" hidden><label for="approachEditor">Explain your approach</label><textarea id="approachEditor" class="textarea long-editor" placeholder="What risks did you prioritize? Why these locators and assertions? What is out of scope?"></textarea></div>
    <div class="editor-pane" id="pane-tests" hidden><label for="testCasesEditor">Test cases and expected results</label><textarea id="testCasesEditor" class="textarea long-editor" placeholder="1. Given ... When ... Then ..."></textarea></div>
  </section>
  <aside class="work-panel rubric-panel" aria-label="Review guide">
    <div class="work-head"><span>${I('clipboard', 'ic-sm')}Review guide</span><span class="badge">100 points</span></div>
    <div class="work-body">
      <div class="rubric-line"><b>Coverage</b><span>30</span><small>Happy path, negatives, edges</small></div>
      <div class="rubric-line"><b>Assertions</b><span>25</span><small>Prove visible outcomes</small></div>
      <div class="rubric-line"><b>Reliability</b><span>25</span><small>Stable locators and waits</small></div>
      <div class="rubric-line"><b>Approach</b><span>20</span><small>Clear reasoning and trade-offs</small></div>
      <button class="btn btn-soft btn-sm hint-action" type="button" id="workspaceHint">${I('bulb')}Reveal a hint</button>
      <div class="hint-card" id="workspaceHintText" hidden>Start by mapping a valid login, an invalid password, and a direct visit to the protected page after logout. Assert visible results rather than only checking a URL.</div>
      <button class="link-btn" type="button" id="workspaceModelToggle">${I('eye', 'ic-sm')}Request model approach</button>
      <div class="hint-card" id="workspaceModel" hidden>A strong solution checks the primary journey, negative inputs, session boundaries, and recovery. Use user-facing locators, wait for a meaningful state, and explain any test data or coverage limits.</div>
      <div id="submitFeedback" class="submit-feedback" role="status" hidden></div>
    </div>
  </aside>
</div>`,

    submissions: `${head('inbox', 'Your work', 'My submissions', 'Your code, approach, attempts and rubric notes — stored only in this browser. Submitted code is reviewed by a transparent heuristic and never executed.', `<button class="btn btn-secondary btn-sm" type="button" id="exportSubmissions">${I('download')}Export submissions</button>`)}
<div id="submissionList" class="submission-list"></div>`,

    practice: `<div id="interviewHub"></div>
<div id="interviewSession" hidden>
  <div class="page-head legacy-head"><div><span class="eyebrow">${I('mic', 'ic-sm')}Interview prep</span><h1 id="practiceTitle">Practice session</h1><p id="practiceSub">Answer out loud or type a short response. Your session is saved on this device.</p></div><div class="actions"><button class="btn btn-secondary btn-sm" type="button" id="homeBtn">${I('arrow-left', 'flip-rtl')}All tracks</button></div></div>
  <div class="practice-layout">
    <aside class="side-panel card" aria-label="Session">
      <div class="sp-head"><span class="tile tile-sm" data-tone="info">${I('mic')}</span><div><h2 id="sessionTrack">Manual testing</h2><p id="sessionCount">Question 1 of 4</p></div></div>
      <div class="field filter-control"><label for="difficultyFilter">Difficulty</label><select class="select" id="difficultyFilter"><option value="all">Mixed practice</option><option value="Foundation">Foundation</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></div>
      <div class="question-list" id="questionList"></div>
      <button class="btn btn-secondary btn-sm btn-block" type="button" id="newSessionBtn">${I('rotate')}New session</button>
    </aside>
    <article class="question-card card" id="questionCard"></article>
  </div>
</div>`,

    lab: `${head('flask', 'Practice labs', 'Testing playground', 'Six simulated apps with realistic UI, API, checkout and mobile failure paths. Everything runs locally — no data leaves this browser.', `<span class="badge badge-brand">${I('shield')}Safe sandbox · no data sent</span>`)}
<div class="lab-tabs" role="tablist" aria-label="Testing playgrounds">
  <button class="lab-tab active" type="button" role="tab" aria-selected="true" aria-controls="lab-login" data-lab="login">${I('login')}<span><small>01</small>Login form</span></button>
  <button class="lab-tab" type="button" role="tab" aria-selected="false" aria-controls="lab-api" data-lab="api">${I('plug')}<span><small>02</small>API console</span></button>
  <button class="lab-tab" type="button" role="tab" aria-selected="false" aria-controls="lab-checkout" data-lab="checkout">${I('cart')}<span><small>03</small>Checkout flow</span></button>
  <button class="lab-tab" type="button" role="tab" aria-selected="false" aria-controls="lab-mobile" data-lab="mobile">${I('phone')}<span><small>04</small>Mobile lab</span></button>
  <button class="lab-tab" type="button" role="tab" aria-selected="false" aria-controls="lab-ui" data-lab="ui">${I('cursor')}<span><small>05</small>UI playground</span></button>
  <button class="lab-tab" type="button" role="tab" aria-selected="false" aria-controls="lab-bughunt" data-lab="bughunt">${I('bug')}<span><small>06</small>Bug hunt</span></button>
</div>
<div class="lab-panel active" id="lab-login" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm">${I('login')}</span><div><h3>Sign-in validation lab</h3><p class="sub">Exercise required fields, format checks, authentication, and feedback.</p></div></div>
    <div class="demo-form">${field('loginEmail', 'Email address', '<input class="input" id="loginEmail" type="email" placeholder="you@example.com" autocomplete="off">')}${field('loginPassword', 'Password', '<input class="input" id="loginPassword" type="password" placeholder="Enter a password" autocomplete="off">')}<button class="btn btn-primary" type="button" id="loginSubmit">${I('login')}Sign in</button></div>
    <p class="picks-label">Quick scenarios</p><div class="scenario-picks"><button class="chip" type="button" data-login-case="empty">Empty fields</button><button class="chip" type="button" data-login-case="format">Invalid email</button><button class="chip" type="button" data-login-case="wrong">Wrong password</button><button class="chip" type="button" data-login-case="valid">Valid login</button></div></div>
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="info">${I('eye')}</span><div><h3>Expected behavior</h3><p class="sub">Observe the result, decide whether it matches, then try another case.</p></div></div>
    <div class="result-box" id="loginResult" aria-live="polite"><h4>Ready for your first check</h4><p>Use a scenario chip or enter values yourself. Demo credentials: demo.qa@example.com / Test123!</p></div>
    <div class="event-list" id="loginEvents"><div class="event"><b>Test idea</b><span>Check required, malformed, incorrect, and valid inputs.</span></div></div></div>
</div></div>
<div class="lab-panel" id="lab-api" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="gold">${I('plug')}</span><div><h3>API request console</h3><p class="sub">Choose an endpoint and response condition. Think about status, schema, and side effects.</p></div></div>
    <div class="demo-form">${field('apiEndpoint', 'Endpoint', '<select class="select mono" id="apiEndpoint"><option value="orders">GET /api/orders</option><option value="user">GET /api/users/42</option><option value="create">POST /api/orders</option></select>')}${field('apiScenario', 'Simulate response', '<select class="select" id="apiScenario"><option value="200">200 · Success</option><option value="401">401 · Unauthenticated</option><option value="404">404 · Not found</option><option value="500">500 · Server error</option></select>')}<button class="btn btn-primary" type="button" id="sendApi">${I('send')}Send request</button></div></div>
  <div class="demo-card"><div class="demo-title spread"><div class="row"><span class="tile tile-sm" data-tone="info">${I('terminal')}</span><div><h3>Response preview</h3><p class="sub">A simulated response for your test design.</p></div></div><span class="status-code" id="apiStatus">READY</span></div>
    <div class="result-box" id="apiResult" aria-live="polite"><h4>Waiting for request</h4><p>Try success and failure cases. What assertions would you add?</p><pre id="apiJson">// Response appears here</pre></div>
    <div class="event-list"><div class="event"><b>Check</b><span>HTTP status · content type · response schema · error handling</span></div></div></div>
</div></div>
<div class="lab-panel" id="lab-checkout" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="accent">${I('cart')}</span><div><h3>Mini checkout</h3><p class="sub">Explore field validation, coupon rules, and payment outcomes.</p></div></div>
    <div class="demo-form">${field('shipName', 'Full name', '<input class="input" id="shipName" placeholder="Alex Morgan" autocomplete="off">')}${field('shipAddress', 'Delivery address', '<input class="input" id="shipAddress" placeholder="Street and city" autocomplete="off">')}${field('couponCode', 'Coupon code', '<input class="input" id="couponCode" placeholder="Try SAVE10" autocomplete="off">')}${field('paymentOutcome', 'Payment simulation', '<select class="select" id="paymentOutcome"><option value="success">Payment succeeds</option><option value="decline">Card declined</option><option value="timeout">Payment times out</option></select>')}<button class="btn btn-primary" type="button" id="checkoutSubmit">${I('cart')}Place demo order · $48.00</button></div></div>
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="success">${I('clipboard')}</span><div><h3>Order status</h3><p class="sub">Watch for duplicate orders, clear errors, and consistent totals.</p></div></div>
    <div class="result-box" id="checkoutResult" aria-live="polite"><h4>Cart ready</h4><p>1 × Everyday Backpack<br>Subtotal $48.00 · Shipping calculated at checkout</p></div>
    <div class="event-list"><div class="event"><b>Explore</b><span>Empty address · valid/invalid coupon · decline · timeout · retry</span></div></div></div>
</div></div>
<div class="lab-panel" id="lab-mobile" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="violet">${I('phone')}</span><div><h3>Mobile interruption simulator</h3><p class="sub">Toggle app conditions and see what a QA engineer should verify on resume.</p></div></div>
    <div class="mobile-phone"><div class="phone-notch" aria-hidden="true"></div><div class="phone-top"><span>9:41</span><span id="phoneNetworkLabel">${I('wifi', 'ic-xs')} Wi-Fi · 82%</span></div>
      <div class="phone-screen"><h4>Profile photo upload</h4><p id="mobileState">Upload in progress · 64%</p><div class="upload-track"><i id="uploadProgress" style="width:64%"></i></div>
        <div class="phone-toggle"><span>Network connected</span><button class="toggle on" type="button" id="networkToggle" aria-label="Toggle network" aria-pressed="true"><i></i></button></div>
        <div class="phone-toggle"><span>App in foreground</span><button class="toggle on" type="button" id="foregroundToggle" aria-label="Toggle app foreground" aria-pressed="true"><i></i></button></div>
        <div class="phone-toggle"><span>Photo permission</span><button class="toggle on" type="button" id="permissionToggle" aria-label="Toggle photo permission" aria-pressed="true"><i></i></button></div>
        <button class="btn btn-primary btn-sm btn-block" type="button" id="mobileResume">${I('play')}Resume app</button></div></div></div>
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="info">${I('list-checks')}</span><div><h3>What would you verify?</h3><p class="sub">Change one condition at a time and inspect the app state.</p></div></div>
    <div class="result-box" id="mobileResult" aria-live="polite"><h4>Baseline state</h4><p>Photo upload is active. Interrupt the network, background the app, or revoke permission.</p></div>
    <div class="event-list"><div class="event"><b>Checklist</b><span>Progress preserved · retry/resume · no duplicate upload · clear permission state</span></div><div class="event"><b>Device scope</b><span>Repeat critical lifecycle checks on a real iOS and Android device.</span></div></div></div>
</div></div>
<div class="lab-panel" id="lab-ui" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm">${I('cursor')}</span><div><h3>UI Components Playground</h3><p class="sub">Exercise fields, dropdowns, dynamic tables, and user-visible feedback.</p></div></div>
    <div class="demo-form">${field('playgroundEmail', 'Work email', '<input class="input" id="playgroundEmail" type="email" placeholder="name@example.com" autocomplete="off">')}${field('playgroundRole', 'Requested role', '<select class="select" id="playgroundRole"><option value="">Choose a role</option><option>QA Analyst</option><option>SQA Engineer</option><option>Admin</option></select>')}${field('playgroundSearch', 'Filter employee table', '<input class="input" id="playgroundSearch" placeholder="Try typing Alex" autocomplete="off">')}
      <div class="event-list" id="employeeRows"><div class="event"><b>EMP-104</b><span>Alex Carter · Quality Engineering · Active</span></div><div class="event"><b>EMP-217</b><span>Sam Rivera · Product · On leave</span></div><div class="event"><b>EMP-305</b><span>Jordan Lee · Quality Engineering · Active</span></div></div>
      <button class="btn btn-primary btn-sm" type="button" id="playgroundSubmit">${I('send')}Submit request</button>
      <div id="playgroundResult" class="result-box" aria-live="polite"><h4>Ready to explore</h4><p>Try empty fields, malformed email, and an unselected role.</p></div></div></div>
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="gold">${I('bulb')}</span><div><h3>Test ideas</h3><p class="sub">Use this playground to explain validation and interaction coverage.</p></div></div>
    <div class="event-list"><div class="event"><b>01</b><span>Required and format validation</span></div><div class="event"><b>02</b><span>Keyboard navigation through controls</span></div><div class="event"><b>03</b><span>Filtering with matching and no-match values</span></div><div class="event"><b>04</b><span>Accessible labels and clear success/error state</span></div></div>
    <div class="scenario-picks"><button class="chip" type="button" id="playgroundAlert">${I('bell', 'ic-sm')}Trigger confirmation dialog</button><button class="chip" type="button" id="playgroundReset">${I('rotate', 'ic-sm')}Reset sample data</button></div>
    <div id="playgroundNotice" class="result-box" aria-live="polite"><h4>Interaction state</h4><p>Use the controls and observe what changes.</p></div></div>
</div></div>
<div class="lab-panel" id="lab-bughunt" role="tabpanel"><div class="lab-grid">
  <div class="demo-card"><span class="eyebrow seeded">${I('bug', 'ic-sm')}Seeded defect · checkout</span><div class="demo-title"><span class="tile tile-sm" data-tone="danger">${I('bug')}</span><div><h3>ShopFlow Store · Discount calculation</h3><p class="sub">A bug is intentionally present in this practice app. Reproduce it before submitting your report.</p></div></div>
    <div class="bug-cart"><div class="bug-product"><span>Canvas backpack</span><b>$30.00</b></div><div class="bug-product"><span>Insulated bottle</span><b>$18.00</b></div><div class="bug-product"><span>Shipping</span><b>$6.00</b></div><div class="bug-product"><span>Promo code</span><b class="mono">SAVE10</b></div><div class="bug-product total"><span>Displayed discount (seeded bug)</span><b id="bugDiscount">−$5.40</b></div><div class="bug-product total"><span>Displayed total</span><b id="bugTotal">$48.60</b></div><p class="bug-clue">${I('info', 'ic-sm')}Expected rule: the 10% discount applies to merchandise only, not shipping.</p></div>
    <button class="btn btn-secondary btn-sm" type="button" id="bugRecalc">${I('rotate')}Recalculate cart</button></div>
  <div class="demo-card"><div class="demo-title"><span class="tile tile-sm" data-tone="accent">${I('note')}</span><div><h3>Submit a reproducible bug report</h3><p class="sub">Write what you did, what you expected, and what actually happened.</p></div></div>
    <div class="demo-form">${field('bugTitle', 'Title', '<input class="input" id="bugTitle" placeholder="Discount includes shipping charge">')}${field('bugSteps', 'Steps to reproduce', '<textarea class="textarea" id="bugSteps" placeholder="1. Add both products&#10;2. Apply SAVE10&#10;3. Compare discount with merchandise subtotal"></textarea>')}${field('bugExpected', 'Expected result', '<textarea class="textarea" id="bugExpected" placeholder="10% is deducted from $48 merchandise only ($4.80)."></textarea>')}${field('bugActual', 'Actual result', '<textarea class="textarea" id="bugActual" placeholder="The displayed discount is $5.40, which includes shipping."></textarea>')}${field('bugSeverity', 'Severity', '<select class="select" id="bugSeverity"><option>Choose severity</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>')}
      <button class="btn btn-primary btn-sm" type="button" id="submitBugReport">${I('send')}Submit bug report</button>
      <div id="bugReportResult" class="result-box" aria-live="polite"><h4>Report not submitted</h4><p>Complete all required fields after reproducing the issue.</p></div></div></div>
</div></div>`
  };
  for (const [id, html] of Object.entries(M)) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  /* Lab tabs: keep aria-selected in step with the engine's .active toggling (click, openLab, openFullLab). */
  const tabs = document.querySelector('#lab .lab-tabs');
  if (tabs) {
    const sync = () => tabs.querySelectorAll('.lab-tab').forEach(b => { const on = b.classList.contains('active'); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    new MutationObserver(sync).observe(tabs, { subtree: true, attributes: true, attributeFilter: ['class'] });
    tabs.addEventListener('keydown', e => {
      const list = [...tabs.querySelectorAll('.lab-tab')], i = list.indexOf(document.activeElement);
      const m = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: list.length - 1 }[document.dir === 'rtl' && /Arrow/.test(e.key) ? (e.key === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight') : e.key];
      if (i < 0 || m === undefined) return;
      e.preventDefault(); const t = list[(m + list.length) % list.length]; t.click(); t.focus();
    });
    sync();
  }
  /* Editor tabs: mirror the engine's .active state for assistive tech. */
  const etabs = document.querySelector('#workspace .editor-tabs');
  if (etabs) {
    const syncE = () => etabs.querySelectorAll('.editor-tab').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
    new MutationObserver(syncE).observe(etabs, { subtree: true, attributes: true, attributeFilter: ['class'] });
    syncE();
  }

  /* "Back to the lesson" bar used by the career roadmap after it opens a lab, challenge or interview round. */
  const main = document.getElementById('appMain');
  if (main && !document.getElementById('lessonReturn')) {
    const bar = document.createElement('div');
    bar.className = 'lesson-return'; bar.id = 'lessonReturn'; bar.hidden = true;
    const banner = document.getElementById('storageBanner');
    if (banner && banner.parentNode === main) banner.after(bar); else main.prepend(bar);
  }

  const progress = document.getElementById('progress');
  if (progress) progress.innerHTML = '<div id="progressMain"></div><div class="legacy-progress"><section class="panel" id="historyPanel" aria-label="Interview practice history"></section><section class="panel challenge-progress" id="challengeProgress" aria-label="Hands-on practice progress"></section><section class="panel challenge-progress" id="learningProgressPanel" aria-label="Career roadmap progress"></section></div>';
  const settings = document.getElementById('settings');
  if (settings) settings.innerHTML = '<div id="settingsHead"></div><div id="profileSettings"></div>';
})();
