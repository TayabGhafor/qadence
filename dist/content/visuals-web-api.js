/* Qadence content · visual guides · stages "web-mobile" and "sql-api" (except sa-rest-soap, sa-sql-advanced) */
QA_CONTENT.addVisuals({

  /* ───────────── Web & mobile ───────────── */

  'wm-web-basics': [
    {
      t: 'sequence', title: 'One page, many requests',
      actors: ['Browser', 'DNS resolver', 'Web server', 'API server', 'Database'],
      steps: [
        { from: 0, to: 1, label: 'Where is www.shopflow.example?' },
        { from: 1, to: 0, label: 'IP address', reply: true },
        { from: 0, to: 2, label: 'TLS handshake: certificate checked' },
        { from: 0, to: 2, label: 'GET /products/42 (the HTML)' },
        { from: 2, to: 0, label: '200 OK + HTML', reply: true },
        { from: 0, to: 2, label: 'GET CSS, JS, images, fonts' },
        { from: 2, to: 0, label: 'Files (or reused from cache)', reply: true },
        { from: 0, to: 3, label: 'JS calls GET /api/products/42' },
        { from: 3, to: 4, label: 'Read product 42' },
        { from: 4, to: 3, label: 'price 18.50, stock 7', reply: true },
        { from: 3, to: 0, label: '200 JSON: price and stock', reply: true }
      ],
      caption: 'A single page is built from many exchanges, and each one shows up as its own row in the Network panel. Find the first arrow that is missing or wrong, and you know which layer to name in the bug report.'
    },
    {
      t: 'flowchart', title: 'Which layer failed?',
      nodes: [
        { id: 'seen', label: 'Something on the page is wrong', kind: 'start' },
        { id: 'reload', label: 'Same after a hard reload?', kind: 'decision' },
        { id: 'cache', label: 'Stale cache: check Cache-Control', kind: 'end' },
        { id: 'req', label: 'Expected request in Network panel?', kind: 'decision' },
        { id: 'front', label: 'Front-end JS: read Console errors', kind: 'end' },
        { id: 'status', label: 'Response status?', kind: 'decision' },
        { id: 'server', label: 'Server or API failure', kind: 'end' },
        { id: 'client', label: 'Compare payload with the contract', kind: 'end' },
        { id: 'data', label: 'Response data correct?', kind: 'decision' },
        { id: 'logic', label: 'Server logic or stored data bug', kind: 'end' },
        { id: 'render', label: 'Display bug: HTML, CSS or JS', kind: 'end' }
      ],
      edges: [
        { from: 'seen', to: 'reload' },
        { from: 'reload', to: 'cache', label: 'No, it changed' },
        { from: 'reload', to: 'req', label: 'Yes' },
        { from: 'req', to: 'front', label: 'No' },
        { from: 'req', to: 'status', label: 'Yes' },
        { from: 'status', to: 'server', label: '5xx' },
        { from: 'status', to: 'client', label: '4xx' },
        { from: 'status', to: 'data', label: '2xx' },
        { from: 'data', to: 'logic', label: 'No' },
        { from: 'data', to: 'render', label: 'Yes' }
      ],
      caption: 'Rule out caching first, then let the Network panel split the problem: no request points to the front end, and the status code splits the rest. Put the layer you land on into the bug title.'
    },
    {
      t: 'matrix', title: 'What survives each action?',
      x: { label: 'Where the data lives', ticks: ['Session cookie', 'localStorage', 'sessionStorage'] },
      y: { label: 'User action', ticks: ['Reload the page', 'New tab (typed URL)', 'Close the tab', 'Restart the browser'] },
      cells: [
        ['Kept', 'Kept', 'Kept'],
        ['Shared: sent with requests', 'Shared (same origin)', 'Not shared: new tab starts empty'],
        ['Kept while the browser stays open', 'Kept', 'Cleared'],
        ['Usually cleared; session restore may keep it', 'Kept until code or the user clears it', 'Cleared, unless the tab is restored']
      ],
      tones: [
        ['low', 'low', 'low'],
        ['low', 'low', 'high'],
        ['low', 'low', 'high'],
        ['mid', 'low', 'mid']
      ],
      caption: 'Green means the data is still there, red means it is gone, and amber depends on browser settings such as session restore. Use these actions as test steps when a cart, login or wizard loses data.'
    }
  ],

  'wm-devtools': [
    {
      t: 'tree', title: 'Which panel answers my question?',
      root: {
        label: 'What is the symptom?',
        children: [
          { edge: 'Looks wrong', label: 'Elements', children: [{ label: 'Winning CSS rule, role and name' }] },
          { edge: 'Nothing happens', label: 'Console', children: [{ label: 'Copy error text and file:line' }] },
          { edge: 'Wrong data, slow', label: 'Network', children: [{ label: 'Status: client or server?' }, { label: 'Payload: what the UI sent' }, { label: 'Timing: server wait or download' }] },
          { edge: 'State lost/stale', label: 'Application', children: [{ label: 'Cookies, flags, stored values' }] },
          { edge: 'Small screens', label: 'Device toolbar', children: [{ label: 'Quick check; confirm on a device' }] }
        ]
      },
      caption: 'Start from the symptom, not the panel. Firefox calls Elements “Inspector” and Application “Storage”, but the questions stay the same.'
    },
    {
      t: 'flowchart', title: 'Capturing clean network evidence',
      nodes: [
        { id: 'once', label: 'Bug seen once: open DevTools first', kind: 'start' },
        { id: 'redir', label: 'Login or redirects involved?', kind: 'decision' },
        { id: 'keep', label: 'Tick Preserve log, then clear' },
        { id: 'clear', label: 'Clear the log' },
        { id: 'repeat', label: 'Filter Fetch/XHR; repeat the steps' },
        { id: 'fail', label: 'Did it fail this time?', kind: 'decision' },
        { id: 'capture', label: 'Screenshot, export HAR, note the time' },
        { id: 'clean', label: 'Remove tokens, cookies, personal data' },
        { id: 'attach', label: 'Attach with build, browser, frequency', kind: 'end' }
      ],
      edges: [
        { from: 'once', to: 'redir' },
        { from: 'redir', to: 'keep', label: 'Yes' },
        { from: 'redir', to: 'clear', label: 'No' },
        { from: 'keep', to: 'repeat' },
        { from: 'clear', to: 'repeat' },
        { from: 'repeat', to: 'fail' },
        { from: 'fail', to: 'repeat', label: 'No' },
        { from: 'fail', to: 'capture', label: 'Yes' },
        { from: 'capture', to: 'clean' },
        { from: 'clean', to: 'attach' }
      ],
      caption: 'Set up the panel before you reproduce, so the evidence is short and complete. If it does not fail, repeat and record the frequency (for example 4 of 20); and treat every HAR file as containing secrets until you have cleaned it.'
    },
    {
      t: 'matrix', title: 'Simulation is not reality',
      x: { label: 'DevTools feature', ticks: ['Network throttling', 'Device toolbar'] },
      y: { label: 'Ask', ticks: ['Good for', 'Cannot reproduce', 'Confirm on'] },
      cells: [
        ['Spinners, time-outs, retry messages', 'Layout at a viewport size, touch, pixel ratio'],
        ['Packet loss, weak signal, switching networks', 'Other engines, on-screen keyboard, real performance'],
        ['Real networks: mobile data, poor Wi-Fi', 'Real browsers and devices, or a device cloud']
      ],
      tones: [['low', 'low'], ['high', 'high'], ['mid', 'mid']],
      caption: 'Both features give fast feedback, but the red row lists what they cannot show: the device toolbar still renders with your desktop browser’s engine. Confirm important findings on real networks and devices before sign-off.'
    }
  ],

  'wm-forms-ui': [
    {
      t: 'sequence', title: 'Client checks help, server checks protect',
      actors: ['User', 'Browser checks', 'API server', 'Database', 'Script or Postman'],
      steps: [
        { from: 0, to: 1, label: 'Submits email sam@ (no domain)' },
        { from: 1, to: 0, label: 'Inline error, no request sent', reply: true },
        { from: 0, to: 1, label: 'Fixes email, submits again' },
        { from: 1, to: 2, label: 'POST /leave-requests' },
        { from: 2, to: 3, label: 'Insert after rules pass' },
        { from: 3, to: 2, label: 'Saved', reply: true },
        { from: 2, to: 1, label: '201 Created', reply: true },
        { from: 1, to: 0, label: 'Success message', reply: true },
        { from: 4, to: 2, label: 'POST 5,000-char reason, no UI' },
        { from: 2, to: 4, label: '400/422 field error, nothing saved', reply: true }
      ],
      caption: 'Steps 1–2 never reach the server: client checks exist for instant feedback. Steps 9–10 skip the browser entirely, so only server-side validation stops bad data — test both paths.'
    },
    {
      t: 'flowchart', title: 'Two defences against double-submit',
      nodes: [
        { id: 'ui', label: 'Test 1: double-click Submit, slow network', kind: 'start' },
        { id: 'dis', label: 'Button disabled after first click?', kind: 'decision' },
        { id: 'b1', label: 'Bug: UI defence missing', kind: 'end' },
        { id: 'api', label: 'Test 2: send the same POST twice' },
        { id: 'dup', label: 'Server rejects or merges the duplicate?', kind: 'decision' },
        { id: 'b2', label: 'Bug: duplicate record created', kind: 'end' },
        { id: 'one', label: 'Exactly one record: both defences hold', kind: 'end' }
      ],
      edges: [
        { from: 'ui', to: 'dis' },
        { from: 'dis', to: 'b1', label: 'No' },
        { from: 'dis', to: 'api', label: 'Yes' },
        { from: 'api', to: 'dup' },
        { from: 'dup', to: 'b2', label: 'No' },
        { from: 'dup', to: 'one', label: 'Yes' }
      ],
      caption: 'The disabled button handles impatient clicks, but automatic retries and direct API calls bypass the UI. Test the server on its own by sending the same request twice — only its duplicate check guarantees one record.'
    },
    {
      t: 'flowchart', title: 'Keyboard-only pass',
      nodes: [
        { id: 'tab', label: 'Put the mouse aside; press Tab', kind: 'start' },
        { id: 'focus', label: 'Visible focus on every control?', kind: 'decision' },
        { id: 'b1', label: 'Bug: no visible focus', kind: 'end' },
        { id: 'order', label: 'Tab order follows the visual order?', kind: 'decision' },
        { id: 'b2', label: 'Bug: illogical tab order', kind: 'end' },
        { id: 'trap', label: 'Can Tab out of every widget?', kind: 'decision' },
        { id: 'b3', label: 'Bug: keyboard trap (serious)', kind: 'end' },
        { id: 'submit', label: 'Submit with one invalid field' },
        { id: 'err', label: 'Focus moves to the first error?', kind: 'decision' },
        { id: 'b4', label: 'Bug: focus lost after submit', kind: 'end' },
        { id: 'pass', label: 'Pass: usable by keyboard alone', kind: 'end' }
      ],
      edges: [
        { from: 'tab', to: 'focus' },
        { from: 'focus', to: 'b1', label: 'No' },
        { from: 'focus', to: 'order', label: 'Yes' },
        { from: 'order', to: 'b2', label: 'No' },
        { from: 'order', to: 'trap', label: 'Yes' },
        { from: 'trap', to: 'b3', label: 'No' },
        { from: 'trap', to: 'submit', label: 'Yes' },
        { from: 'submit', to: 'err' },
        { from: 'err', to: 'b4', label: 'No' },
        { from: 'err', to: 'pass', label: 'Yes' }
      ],
      caption: 'Each question is a separate pass/fail check, so every failure becomes a precise bug report. A keyboard trap locks keyboard users in completely, which makes it a serious accessibility defect.'
    }
  ],

  'wm-cross-browser': [
    {
      t: 'matrix', title: 'MediBook coverage by engine and OS',
      x: { label: 'Operating system', ticks: ['Windows', 'macOS', 'Android', 'iOS'] },
      y: { label: 'Browser (engine)', ticks: ['Chrome (Blink)', 'Edge (Blink)', 'Firefox (Gecko)', 'Safari (WebKit)', 'Samsung Internet (Blink)'] },
      cells: [
        ['Tier 1: full regression (14%)', 'Gap: not covered', 'Tier 1: real devices (48%)', 'Gap; historically WebKit, like Safari'],
        ['Tier 2: critical journeys (5%)', 'Gap: not covered', 'Gap: not covered', 'Gap: not covered'],
        ['Tier 2: critical journeys (3%)', 'Gap: not covered', 'Gap: not covered', 'Gap: not covered'],
        ['Not available', 'Gap: not covered', 'Not available', 'Tier 1: real devices (27%)'],
        ['Not available', 'Not available', 'Tier 3: smoke test (2%)', 'Not available']
      ],
      tones: [
        ['high', 'none', 'high', 'none'],
        ['mid', 'none', 'none', 'none'],
        ['mid', 'none', 'none', 'none'],
        ['none', 'none', 'none', 'high'],
        ['none', 'none', 'low', 'none']
      ],
      caption: 'Illustrative MediBook analytics: red is tier 1, amber tier 2, green tier 3, and every engine users have gets at least one covered cell. The plain cells are gaps — fine when they are a written-down risk decision, dangerous when nobody noticed them.'
    },
    {
      t: 'timeline', title: 'Testing around a 768 px breakpoint',
      items: [
        { label: '320 px', sub: 'Reflow: no sideways scroll' },
        { label: '360–414 px', sub: 'Common phones: one column' },
        { label: '767 px', sub: 'Just below: still one column' },
        { label: '768 px', sub: 'At the breakpoint: two columns' },
        { label: '769 px', sub: 'Just above: layout holds' },
        { label: '1280 px', sub: 'Laptop; also try 200% zoom' },
        { label: 'Drag slowly', sub: 'In-between widths no preset uses' }
      ],
      caption: 'This is boundary value analysis applied to width: test at, just below and just above every breakpoint, then drag between them. In the worked example the overlap appeared at exactly 768 px.'
    },
    {
      t: 'flowchart', title: 'Isolating a cross-browser difference',
      nodes: [
        { id: 'spot', label: 'Difference spotted', kind: 'start' },
        { id: 'emu', label: 'Found in emulation?', kind: 'decision' },
        { id: 'real', label: 'Reproduce on a real browser or device' },
        { id: 'note', label: 'Note the browser, version and OS' },
        { id: 'side', label: 'Same page and data in a second engine' },
        { id: 'one', label: 'Only one engine affected?', kind: 'decision' },
        { id: 'eng', label: 'Engine-specific bug: name the engine' },
        { id: 'ours', label: 'Shared bug: likely in our own code' },
        { id: 'report', label: 'Report: viewport, zoom, both screenshots', kind: 'end' }
      ],
      edges: [
        { from: 'spot', to: 'emu' },
        { from: 'emu', to: 'real', label: 'Yes' },
        { from: 'emu', to: 'note', label: 'No' },
        { from: 'real', to: 'side' },
        { from: 'note', to: 'side' },
        { from: 'side', to: 'one' },
        { from: 'one', to: 'eng', label: 'Yes' },
        { from: 'one', to: 'ours', label: 'No' },
        { from: 'eng', to: 'report' },
        { from: 'ours', to: 'report' }
      ],
      caption: 'Confirm emulation findings on the real thing, then compare engines side by side to see whether the bug belongs to one engine or to your own code. “Broken on mobile” becomes “At 375 px in Safari on iOS, Confirm is hidden behind the cookie banner”.'
    }
  ],

  'wm-mobile-basics': [
    {
      t: 'tree', title: 'What kind of app is it?',
      root: {
        label: 'How does the user get it?',
        children: [
          { edge: 'Opens a URL', label: 'Mobile web (a PWA can add offline)', children: [{ label: 'Test: browsers, responsive, network' }] },
          {
            edge: 'From an app store', label: 'What draws the screens?',
            children: [
              { edge: 'WebView', label: 'Hybrid (Cordova, Capacitor)', children: [{ label: 'Test: shell, WebView, plugin bridges' }] },
              { edge: 'No WebView', label: 'Native, React Native or Flutter', children: [{ label: 'Test: lifecycle, permissions, both OSes' }] }
            ]
          }
        ]
      },
      caption: 'Two questions classify most apps and set the testing focus. React Native and Flutter apps install and run like native apps, so test them as native on both Android and iOS.'
    },
    {
      t: 'flowchart', title: 'Testing an update that migrates data',
      nodes: [
        { id: 'pick', label: 'Start version: oldest or most common', kind: 'start' },
        { id: 'inst', label: 'Install it; add realistic local data' },
        { id: 'cond', label: 'Condition: normal, full storage, kill' },
        { id: 'upd', label: 'Update to the new build' },
        { id: 'kept', label: 'Data, settings and sign-in kept?', kind: 'decision' },
        { id: 'bug', label: 'Bug: log start version, build, data set', kind: 'end' },
        { id: 'more', label: 'More versions or conditions?', kind: 'decision' },
        { id: 'fresh', label: 'Then: fresh install skips migration', kind: 'end' }
      ],
      edges: [
        { from: 'pick', to: 'inst' },
        { from: 'inst', to: 'cond' },
        { from: 'cond', to: 'upd' },
        { from: 'upd', to: 'kept' },
        { from: 'kept', to: 'bug', label: 'No' },
        { from: 'kept', to: 'more', label: 'Yes' },
        { from: 'more', to: 'inst', label: 'Yes: next path' },
        { from: 'more', to: 'fresh', label: 'No' }
      ],
      caption: 'Loop through every upgrade path that matters: oldest supported and most common version, low storage, and a kill during the first launch. Check a fresh install separately — new users must never hit migration code.'
    }
  ],

  'wm-mobile-conditions': [
    {
      t: 'flowchart', title: 'App lifecycle and process death',
      nodes: [
        { id: 'launch', label: 'App launched', kind: 'start' },
        { id: 'fg', label: 'Foreground (active)' },
        { id: 'pause', label: 'Paused: call screen or dialog on top' },
        { id: 'bg', label: 'Background: user switched apps' },
        { id: 'susp', label: 'Suspended: in memory, not running' },
        { id: 'dead', label: 'Terminated by the OS (process death)' },
        { id: 'back', label: 'User returns: state restored?', kind: 'decision' },
        { id: 'bug', label: 'Bug: blank form, home screen or crash', kind: 'end' }
      ],
      edges: [
        { from: 'launch', to: 'fg' },
        { from: 'fg', to: 'pause', label: 'Interrupted' },
        { from: 'pause', to: 'fg', label: 'Dismissed' },
        { from: 'fg', to: 'bg', label: 'Home or switch' },
        { from: 'bg', to: 'fg', label: 'Returns' },
        { from: 'bg', to: 'susp', label: 'OS stops it' },
        { from: 'susp', to: 'fg', label: 'Resume' },
        { from: 'susp', to: 'dead', label: 'Memory needed' },
        { from: 'dead', to: 'back', label: 'User returns' },
        { from: 'back', to: 'fg', label: 'Yes' },
        { from: 'back', to: 'bug', label: 'No' }
      ],
      caption: 'Every loop back to Foreground is a test: does the app resume with the right screen and fresh data? The path through process death is the one people forget — reopening the app yourself is not the same test, so use adb shell am kill on Android.'
    },
    {
      t: 'flowchart', title: 'Permissions change over time',
      nodes: [
        { id: 'need', label: 'Feature needs the camera', kind: 'start' },
        { id: 'why', label: 'Explain why, then the system prompt' },
        { id: 'ans', label: 'User’s answer?', kind: 'decision' },
        { id: 'works', label: 'Feature works' },
        { id: 'deny', label: 'Fallback offered: no crash, no nagging', kind: 'end' },
        { id: 'revoke', label: 'Later: revoked in Settings' },
        { id: 'notice', label: 'App notices on return?', kind: 'decision' },
        { id: 'bug', label: 'Bug: crash or dead feature', kind: 'end' },
        { id: 'grace', label: 'Explains and degrades gracefully' },
        { id: 'enable', label: 'User re-enables it in Settings' }
      ],
      edges: [
        { from: 'need', to: 'why' },
        { from: 'why', to: 'ans' },
        { from: 'ans', to: 'works', label: 'Allow or once' },
        { from: 'ans', to: 'deny', label: 'Deny' },
        { from: 'works', to: 'revoke' },
        { from: 'revoke', to: 'notice' },
        { from: 'notice', to: 'bug', label: 'No' },
        { from: 'notice', to: 'grace', label: 'Yes' },
        { from: 'grace', to: 'enable' },
        { from: 'enable', to: 'works', label: 'Return' }
      ],
      caption: 'A permission is not a one-time yes: test allow, deny, revoke later and re-enable, and the feature must work again without a reinstall. On Android, revoking a permission while the app is backgrounded also kills its process — a free restoration test.'
    },
    {
      t: 'sequence', title: 'Signal lost right after tapping Pay',
      actors: ['User', 'PayLite app', 'Mobile network', 'Payments API'],
      steps: [
        { from: 0, to: 1, label: 'Taps Pay' },
        { from: 1, to: 2, label: 'POST /payments' },
        { from: 2, to: 3, label: 'Request delivered' },
        { from: 3, to: 2, label: 'Charged: payment p-901', reply: true },
        { from: 2, to: 1, label: 'Response lost in a tunnel', reply: true },
        { from: 1, to: 0, label: 'Shows “Checking payment…”', reply: true },
        { from: 0, to: 1, label: 'Taps Pay again' },
        { from: 1, to: 0, label: 'Button stays disabled while pending', reply: true },
        { from: 1, to: 3, label: 'Back online: GET payment status' },
        { from: 3, to: 1, label: 'p-901 already PAID', reply: true },
        { from: 1, to: 0, label: 'Paid once: clear final state', reply: true }
      ],
      caption: 'The server charged once, but the app never heard back. A good app shows an honest pending state, blocks a second Pay and reconciles when the network returns — and the tester confirms exactly one payment on the server.'
    }
  ],

  'wm-devices': [
    {
      t: 'matrix', title: 'Which target can catch this risk?',
      x: { label: 'Test target', ticks: ['Android emulator', 'iOS Simulator', 'Real device'] },
      y: { label: 'Risk', ticks: ['Layout on many sizes', 'Camera, GPS, NFC', 'Speed, memory, heat', 'OEM background limits', 'Weak cellular signal'] },
      cells: [
        ['Good: fast breadth', 'Good: fast breadth', 'Good, but slow to scale'],
        ['Simulated input only', 'No real camera, NFC or Bluetooth', 'Real hardware behaviour'],
        ['Reflects your computer', 'Mac CPU: faster than phones', 'True speed, memory and heat'],
        ['Stock Google images', 'Not applicable', 'Real skins and battery limits'],
        ['Shaped speed, no real handovers', 'Shaped speed, no real handovers', 'Real towers, handovers, loss']
      ],
      tones: [
        ['low', 'low', 'mid'],
        ['high', 'high', 'low'],
        ['high', 'high', 'low'],
        ['high', 'none', 'low'],
        ['high', 'high', 'low']
      ],
      caption: 'Red cells are blind spots: if a risk lives there, only a real device — in-house or in a device cloud — gives real evidence. Virtual devices win for fast layout breadth and for automation in CI.'
    },
    {
      t: 'sequence', title: 'Appium: from test code to a tap',
      actors: ['Test + client lib', 'Appium server', 'Platform driver', 'App on device'],
      steps: [
        { from: 0, to: 1, label: 'New session + capabilities (HTTP)' },
        { from: 1, to: 2, label: 'Load UiAutomator2 or XCUITest' },
        { from: 2, to: 3, label: 'Install and launch the app' },
        { from: 1, to: 0, label: 'Session id', reply: true },
        { from: 0, to: 1, label: 'Find element, click (WebDriver)' },
        { from: 1, to: 2, label: 'Pass command to the driver' },
        { from: 2, to: 3, label: 'Tap via OS automation' },
        { from: 3, to: 2, label: 'UI updated', reply: true },
        { from: 2, to: 1, label: 'Result', reply: true },
        { from: 1, to: 0, label: 'HTTP response: success or error', reply: true }
      ],
      caption: 'Your test never touches the phone directly: W3C WebDriver commands travel over HTTP to the Appium server, which hands them to a platform driver. Change the capabilities and server address, and the same test targets an emulator, a real device or a cloud device.'
    },
    {
      t: 'flowchart', title: 'Where should this check run?',
      nodes: [
        { id: 'check', label: 'New check to run', kind: 'start' },
        { id: 'hw', label: 'Needs real hardware, sensors or heat?', kind: 'decision' },
        { id: 'lab', label: 'Real device in-house', kind: 'end' },
        { id: 'net', label: 'Needs a real cellular network?', kind: 'decision' },
        { id: 'field', label: 'Real device on a real network', kind: 'end' },
        { id: 'oem', label: 'Depends on an OEM or rare model?', kind: 'decision' },
        { id: 'cloud', label: 'Real device in a device cloud', kind: 'end' },
        { id: 'virt', label: 'Emulator or simulator, also in CI', kind: 'end' }
      ],
      edges: [
        { from: 'check', to: 'hw' },
        { from: 'hw', to: 'lab', label: 'Yes' },
        { from: 'hw', to: 'net', label: 'No' },
        { from: 'net', to: 'field', label: 'Yes' },
        { from: 'net', to: 'oem', label: 'No' },
        { from: 'oem', to: 'cloud', label: 'Yes' },
        { from: 'oem', to: 'virt', label: 'No' }
      ],
      caption: 'Ask the most demanding question first; checks that need nothing special run fast on virtual devices. Whatever you choose, list the uncovered devices as gaps in the test summary, as the MediBook team did.'
    }
  ],

  'wm-usability-l10n': [
    {
      t: 'layers', title: 'Localization rests on internationalization',
      items: [
        { label: 'l10n: one locale, e.g. ur-PK', sub: 'Translation in context, rupees, local images and legal text' },
        { label: 'i18n: locale-aware formats', sub: 'Dates, numbers, currency and time zones via Intl or libraries' },
        { label: 'i18n: flexible, mirrorable layout', sub: 'Grows with longer text; mirrors for right-to-left scripts' },
        { label: 'i18n: no hard-coded text', sub: 'Strings live in resource files, not in code' },
        { label: 'i18n: Unicode end to end', sub: 'UTF-8 in forms, API, database, PDFs and exports' }
      ],
      caption: 'Each locale sits on top of the same internationalization layers. In the MediBook Urdu example every defect — clipping, mirroring, encoding, time zone, currency — lived in an i18n layer, not in the translation.'
    },
    {
      t: 'tree', title: 'Reading a pseudo-localized screen',
      root: {
        label: 'The pseudo-localized screen shows…',
        children: [
          { edge: 'Plain English', label: 'Hard-coded string', children: [{ label: 'Move text to resource files' }] },
          { edge: 'Clipped ] bracket', label: 'Layout cannot grow', children: [{ label: 'Allow wrapping, flexible widths' }] },
          { edge: '? or garbled text', label: 'Encoding problem', children: [{ label: 'UTF-8 end to end' }] },
          { edge: 'No mirroring', label: 'RTL not supported', children: [{ label: 'Mirror layout, not logos or numbers' }] }
        ]
      },
      caption: 'Pseudo-localization runs before any translation exists, so each symptom points straight at an internationalization defect. One cheap pass catches whole classes of bugs at once.'
    },
    {
      t: 'cycle', title: 'A quick usability review loop',
      center: 'Usability review',
      steps: ['Pick a key task', 'Give a user the goal', 'Watch silently', 'Note hesitations, wrong taps', 'Map each to a heuristic', 'Report observation + impact', 'Retest after the fix'],
      caption: 'Naming the heuristic an observation breaks turns “I don’t like it” into a finding the team can act on. Run the loop again after fixes — usability improves in rounds.'
    }
  ],

  /* ───────────── SQL & API ───────────── */

  'sa-sql-basics': [
    {
      t: 'timeline', title: 'Logical order of a SELECT',
      items: [
        { label: 'FROM (and JOIN)', sub: 'Pick the tables' },
        { label: 'WHERE', sub: 'Filter rows; no aliases yet' },
        { label: 'GROUP BY', sub: 'Form groups (next lesson)' },
        { label: 'HAVING', sub: 'Filter groups (next lesson)' },
        { label: 'SELECT', sub: 'Choose columns, name aliases' },
        { label: 'ORDER BY', sub: 'Sort; aliases usable here' },
        { label: 'LIMIT', sub: 'Keep the first rows' }
      ],
      caption: 'You write SELECT first, but the database logically starts at FROM. That is why a column alias works in ORDER BY but not in WHERE, and why LIMIT trims only after sorting.'
    },
    {
      t: 'matrix', title: 'Which rows does each WHERE keep?',
      x: { label: 'The row’s email', ticks: ['Rahul: rahul@…', 'Ayesha: ayesha@…', 'Sara: NULL'] },
      y: { label: 'WHERE condition', ticks: ["email = 'rahul@…'", "email <> 'rahul@…'", 'email = NULL', 'email IS NULL'] },
      cells: [
        ['TRUE: kept', 'FALSE: dropped', 'UNKNOWN: dropped'],
        ['FALSE: dropped', 'TRUE: kept', 'UNKNOWN: dropped'],
        ['UNKNOWN: dropped', 'UNKNOWN: dropped', 'UNKNOWN: dropped'],
        ['FALSE: dropped', 'FALSE: dropped', 'TRUE: kept']
      ],
      tones: [
        ['low', 'none', 'high'],
        ['none', 'low', 'high'],
        ['high', 'high', 'high'],
        ['none', 'none', 'low']
      ],
      caption: 'Only TRUE keeps a row. Any comparison with NULL is UNKNOWN (red), so Sara silently vanishes even from the not-equal query — IS NULL is the only way to find her.'
    },
    {
      t: 'flowchart', title: 'Before you query a shared database',
      nodes: [
        { id: 'need', label: 'Need to check some data', kind: 'start' },
        { id: 'prod', label: 'Is it production?', kind: 'decision' },
        { id: 'stop', label: 'Stop: explicit permission only', kind: 'end' },
        { id: 'ro', label: 'Use a read-only account if one exists' },
        { id: 'change', label: 'Need to change data?', kind: 'decision' },
        { id: 'api', label: 'Use the app or API, or agree with the team' },
        { id: 'sel', label: 'SELECT needed columns, filter by key' },
        { id: 'lim', label: 'Add LIMIT while exploring' },
        { id: 'share', label: 'Share results without personal data', kind: 'end' }
      ],
      edges: [
        { from: 'need', to: 'prod' },
        { from: 'prod', to: 'stop', label: 'Yes' },
        { from: 'prod', to: 'ro', label: 'No' },
        { from: 'ro', to: 'change' },
        { from: 'change', to: 'api', label: 'Yes' },
        { from: 'change', to: 'sel', label: 'No' },
        { from: 'sel', to: 'lim' },
        { from: 'lim', to: 'share' }
      ],
      caption: 'Most damage on shared databases comes from a careless UPDATE or a huge SELECT *. Changes go through the application or API, so business rules and audit logs still run.'
    }
  ],

  'sa-api-basics': [
    {
      t: 'tree', title: 'Status code families',
      root: {
        label: 'HTTP status code',
        children: [
          { edge: '2xx', label: 'Success', children: [{ label: '200 OK, 201 Created, 204 No Content' }] },
          { edge: '3xx', label: 'Redirect or cache', children: [{ label: '301, 302 redirect; 304 not modified' }] },
          {
            edge: '4xx', label: 'Problem with the request',
            children: [
              { label: '400 / 422: invalid input' },
              { label: '401: not authenticated' },
              { label: '403: authenticated, not allowed' },
              { label: '404: missing, or hidden on purpose' }
            ]
          },
          { edge: '5xx', label: 'Server failed', children: [{ label: '500, 502, 503: report it' }] }
        ]
      },
      caption: 'The first digit says where the problem lies: 4xx is a problem with the request (or the caller), 5xx means the server failed. Inside 4xx, 401 asks “who are you?” while 403 says “we know you, and no”.'
    },
    {
      t: 'matrix', title: 'Safe vs idempotent',
      x: { label: 'Effect on server state', ticks: ['Safe (read only)', 'Not safe (changes data)'] },
      y: { label: 'Same request repeated', ticks: ['Idempotent', 'Not idempotent'] },
      cells: [
        ['GET, HEAD, OPTIONS: retry freely', 'PUT, DELETE: repeats end in the same state'],
        ['Empty: every safe method is idempotent', 'POST (PATCH not guaranteed): repeats can duplicate']
      ],
      tones: [['low', 'mid'], ['none', 'high']],
      caption: 'The red cell is where double clicks and automatic retries create duplicates, so always send a POST twice. A second DELETE may return 404, yet the server state is unchanged — that is still idempotent.'
    },
    {
      t: 'layers', title: 'Anatomy of an API exchange',
      items: [
        { label: 'Method + path + query', sub: 'POST /api/v1/orders — what to do, to which resource' },
        { label: 'Request headers', sub: 'Content-Type, Accept, Authorization: Bearer token' },
        { label: 'Request body (JSON)', sub: 'customerId, items, couponCode: null — GET usually has none' },
        { label: 'Status line', sub: '201 Created — a claim, not proof of persistence' },
        { label: 'Response headers', sub: 'Location: /api/v1/orders/5012, Content-Type' },
        { label: 'Response body (JSON)', sub: 'id, status PENDING, total 2400.00 — check values and types' }
      ],
      caption: 'Read an exchange top to bottom and check every layer, not just the status. Persistence is proven only by a follow-up GET or a read-only database query.'
    }
  ],

  'sa-sql-joins': [
    {
      t: 'matrix', title: 'Which rows each join keeps',
      x: { label: 'customers JOIN orders', ticks: ['INNER', 'LEFT', 'RIGHT', 'FULL OUTER'] },
      y: { label: 'Kind of row', ticks: ['Matches (3 pairs)', 'Sara, Omar: no orders', 'Order 106: no customer', 'Rows returned'] },
      cells: [
        ['Kept', 'Kept', 'Kept', 'Kept'],
        ['Dropped', 'Kept, order columns NULL', 'Dropped', 'Kept, order columns NULL'],
        ['Dropped silently', 'Dropped silently', 'Kept, customer columns NULL', 'Kept, customer columns NULL'],
        ['3', '5', '4', '6']
      ],
      tones: [
        ['low', 'low', 'low', 'low'],
        ['none', 'mid', 'none', 'mid'],
        ['high', 'high', 'mid', 'mid'],
        ['none', 'none', 'none', 'none']
      ],
      caption: 'Green rows appear in full and amber rows appear padded with NULLs. The red cells silently drop orphan order 106 and its 999.00 — exactly how the two revenue reports came to disagree.'
    },
    {
      t: 'tree', title: 'Which join do I need?',
      root: {
        label: 'What must the result contain?',
        children: [
          { edge: 'Only matches', label: 'INNER JOIN' },
          { edge: 'Every left row', label: 'LEFT JOIN', children: [{ label: 'NULLs where nothing matches' }] },
          { edge: 'Missing links', label: 'LEFT JOIN … WHERE right key IS NULL', children: [{ label: 'Customers who never ordered' }, { label: 'Orphans: orders LEFT JOIN customers' }] },
          { edge: 'Everything', label: 'FULL OUTER JOIN', children: [{ label: 'MySQL: LEFT UNION RIGHT' }] }
        ]
      },
      caption: 'Start from the question, not the syntax. LEFT JOIN plus IS NULL is the tester’s favourite pattern for orphans and missing links; RIGHT JOIN is just a LEFT JOIN with the tables swapped.'
    },
    {
      t: 'timeline', title: 'Rows flowing through GROUP BY and HAVING',
      items: [
        { label: 'FROM + INNER JOIN', sub: '3 joined rows' },
        { label: 'WHERE', sub: 'Drops rows (none here)' },
        { label: 'GROUP BY customer', sub: '2 groups' },
        { label: 'COUNT per group', sub: 'Ayesha 2, Rahul 1' },
        { label: 'HAVING COUNT > 1', sub: 'Drops Rahul’s group' },
        { label: 'Result', sub: 'Ayesha Khan, 2' }
      ],
      caption: 'WHERE removes rows before grouping; HAVING removes whole groups after the aggregates are calculated. Predict the count at each step before you run the query, then compare.'
    }
  ],

  'sa-db-testing': [
    {
      t: 'sequence', title: 'Proving order 5013 was really saved',
      actors: ['Tester', 'ShopFlow API', 'Database'],
      steps: [
        { from: 0, to: 1, label: 'POST /orders: 2 × p77, 1 × p80, SAVE10' },
        { from: 1, to: 2, label: 'Write order, items, stock changes' },
        { from: 1, to: 0, label: '201 Created, id 5013, total 2475.00', reply: true },
        { from: 0, to: 1, label: 'GET /orders/5013' },
        { from: 1, to: 0, label: '200: same values (API read-back)', reply: true },
        { from: 0, to: 2, label: 'Read-only SELECT orders, order_items' },
        { from: 2, to: 0, label: '1 order, 2 item rows: correct', reply: true },
        { from: 0, to: 2, label: 'SELECT stock for products 77, 80' },
        { from: 2, to: 0, label: '77: 38 correct; 80: still 12 (bug)', reply: true },
        { from: 0, to: 1, label: 'Cancel order 5013 (cleanup)' }
      ],
      caption: 'The 201 and the GET both looked perfect; only the read-only stock query exposed the defect. A status code is the server’s claim — the database is the record of truth.'
    },
    {
      t: 'flowchart', title: 'A wallet transfer as one transaction',
      nodes: [
        { id: 'begin', label: 'BEGIN', kind: 'start' },
        { id: 'debit', label: 'Debit wallet 1 by 500 if balance ≥ 500' },
        { id: 'rows', label: 'Exactly 1 row updated?', kind: 'decision' },
        { id: 'rb1', label: 'ROLLBACK: nothing changes', kind: 'end' },
        { id: 'credit', label: 'Credit wallet 2 by 500' },
        { id: 'ok', label: 'Credit succeeded?', kind: 'decision' },
        { id: 'rb2', label: 'ROLLBACK: the debit is undone too', kind: 'end' },
        { id: 'commit', label: 'COMMIT: both changes permanent' },
        { id: 'inv', label: 'Check: SUM(balance) unchanged', kind: 'end' }
      ],
      edges: [
        { from: 'begin', to: 'debit' },
        { from: 'debit', to: 'rows' },
        { from: 'rows', to: 'rb1', label: 'No: low balance' },
        { from: 'rows', to: 'credit', label: 'Yes' },
        { from: 'credit', to: 'ok' },
        { from: 'ok', to: 'rb2', label: 'No: failure' },
        { from: 'ok', to: 'commit', label: 'Yes' },
        { from: 'commit', to: 'inv' }
      ],
      caption: 'Atomicity means the debit and the credit happen together or not at all. Force both failure branches on purpose, and check that the total money across wallets is the same after every outcome.'
    },
    {
      t: 'flowchart', title: 'Probing a constraint through the API',
      nodes: [
        { id: 'send', label: 'Send rule-breaking data via the API', kind: 'start' },
        { id: 'saved', label: 'Read-only query: was it saved?', kind: 'decision' },
        { id: 'nb', label: 'Bug: rule not enforced', kind: 'end' },
        { id: 'resp', label: 'Documented 4xx, e.g. 409?', kind: 'decision' },
        { id: 'leak', label: 'Bug: raw 500 or leaked DB error', kind: 'end' },
        { id: 'held', label: 'Rule held, with a clean message' },
        { id: 'var', label: 'Tried case variants and parallel calls?', kind: 'decision' },
        { id: 'done', label: 'Constraint verified', kind: 'end' }
      ],
      edges: [
        { from: 'send', to: 'saved' },
        { from: 'saved', to: 'nb', label: 'Yes' },
        { from: 'saved', to: 'resp', label: 'No' },
        { from: 'resp', to: 'leak', label: 'No' },
        { from: 'resp', to: 'held', label: 'Yes' },
        { from: 'held', to: 'var' },
        { from: 'var', to: 'send', label: 'No' },
        { from: 'var', to: 'done', label: 'Yes' }
      ],
      caption: 'A rejected insert is good news; a raw database error in the response is a bug. Repeat with different letter case and two parallel requests — duplicates often slip through only under concurrency.'
    }
  ],

  'sa-postman': [
    {
      t: 'layers', title: 'Variable scopes: the lower layer wins',
      items: [
        { label: 'Global', sub: 'Whole workspace — rarely needed, leaks between projects' },
        { label: 'Collection', sub: 'Same in every environment, e.g. an API version' },
        { label: 'Environment', sub: 'Selected environment: baseUrl, test users, secret tokens' },
        { label: 'Data', sub: 'One Runner or Newman iteration: a CSV row' },
        { label: 'Local', sub: 'One request run, set by a script; not saved' }
      ],
      caption: 'Scopes run from broadest at the top to narrowest at the bottom. When the same name exists in several, the lower layer wins — a data-file email overrides the environment’s value for that iteration.'
    },
    {
      t: 'flowchart', title: 'One Collection Runner or Newman run',
      nodes: [
        { id: 'start', label: 'Start: collection, environment, data row 1', kind: 'start' },
        { id: 'pre', label: 'Pre-request: collection, folder, request' },
        { id: 'send', label: 'Send request, variables resolved', kind: 'io' },
        { id: 'tests', label: 'Post-response pm.test checks' },
        { id: 'more', label: 'More requests?', kind: 'decision' },
        { id: 'rows', label: 'More data rows?', kind: 'decision' },
        { id: 'next', label: 'Load the next data row' },
        { id: 'report', label: 'Report: CLI and JUnit XML' },
        { id: 'failed', label: 'Any test failed?', kind: 'decision' },
        { id: 'red', label: 'Non-zero exit code: CI job fails', kind: 'end' },
        { id: 'green', label: 'Exit code 0: build passes', kind: 'end' }
      ],
      edges: [
        { from: 'start', to: 'pre' },
        { from: 'pre', to: 'send' },
        { from: 'send', to: 'tests' },
        { from: 'tests', to: 'more' },
        { from: 'more', to: 'pre', label: 'Yes' },
        { from: 'more', to: 'rows', label: 'No' },
        { from: 'rows', to: 'next', label: 'Yes' },
        { from: 'rows', to: 'report', label: 'No' },
        { from: 'next', to: 'pre' },
        { from: 'report', to: 'failed' },
        { from: 'failed', to: 'red', label: 'Yes' },
        { from: 'failed', to: 'green', label: 'No' }
      ],
      caption: 'Each data row repeats the whole collection. A failed assertion does not stop the run — it is counted, reported and turns Newman’s exit code non-zero, which is what fails the CI job.'
    }
  ],

  'sa-auth': [
    {
      t: 'flowchart', title: '401, 403, 404 or 200?',
      nodes: [
        { id: 'req', label: 'GET /orders/5012 arrives', kind: 'start' },
        { id: 'cred', label: 'Credentials present?', kind: 'decision' },
        { id: 'none', label: '401: no credentials', kind: 'end' },
        { id: 'valid', label: 'Signature valid, not expired?', kind: 'decision' },
        { id: 'bad', label: '401: expired or tampered', kind: 'end' },
        { id: 'role', label: 'Role allows this action?', kind: 'decision' },
        { id: 'e403', label: '403 Forbidden', kind: 'end' },
        { id: 'exists', label: 'Order exists?', kind: 'decision' },
        { id: 'e404', label: '404 Not Found', kind: 'end' },
        { id: 'own', label: 'Caller owns it or may see all?', kind: 'decision' },
        { id: 'hide', label: '403, or 404 to hide (per contract)', kind: 'end' },
        { id: 'ok', label: '200 OK with the order', kind: 'end' }
      ],
      edges: [
        { from: 'req', to: 'cred' },
        { from: 'cred', to: 'none', label: 'No' },
        { from: 'cred', to: 'valid', label: 'Yes' },
        { from: 'valid', to: 'bad', label: 'No' },
        { from: 'valid', to: 'role', label: 'Yes' },
        { from: 'role', to: 'e403', label: 'No' },
        { from: 'role', to: 'exists', label: 'Yes' },
        { from: 'exists', to: 'e404', label: 'No' },
        { from: 'exists', to: 'own', label: 'Yes' },
        { from: 'own', to: 'hide', label: 'No' },
        { from: 'own', to: 'ok', label: 'Yes' }
      ],
      caption: 'Authentication comes first: missing, expired or tampered credentials — even a payload edited to say admin — mean 401. Only a caller the server has identified can get 403, and logging in again will not change it.'
    },
    {
      t: 'sequence', title: 'Access token, refresh and logout',
      actors: ['App', 'Auth server', 'Orders API'],
      steps: [
        { from: 0, to: 1, label: 'POST /login (email, password)' },
        { from: 1, to: 0, label: 'Access token (15 min) + refresh token', reply: true },
        { from: 0, to: 2, label: 'GET /orders, Bearer access token' },
        { from: 2, to: 0, label: '200 OK', reply: true },
        { from: 0, to: 2, label: 'Same call 15 minutes later' },
        { from: 2, to: 0, label: '401: access token expired', reply: true },
        { from: 0, to: 1, label: 'Refresh with the refresh token' },
        { from: 1, to: 0, label: 'New access token', reply: true },
        { from: 0, to: 1, label: 'Logout: server revokes the tokens' },
        { from: 0, to: 1, label: 'Try the old refresh token' },
        { from: 1, to: 0, label: 'Rejected: no new token issued', reply: true }
      ],
      caption: 'An expired access token earns a 401 and a refresh; after logout the refresh token must stop working. Also replay the old access token at the API — expect 401 unless the contract says it stays valid until expiry.'
    },
    {
      t: 'sequence', title: 'OAuth 2.0 authorization code flow with PKCE',
      actors: ['User', 'Client app', 'Auth server', 'API'],
      steps: [
        { from: 0, to: 1, label: 'Taps “Connect account”' },
        { from: 1, to: 2, label: 'Redirect: client id, scopes, PKCE challenge' },
        { from: 0, to: 2, label: 'Signs in and approves the scopes' },
        { from: 2, to: 1, label: 'Redirect back with a one-time code', reply: true },
        { from: 1, to: 2, label: 'Code + PKCE verifier (back channel)' },
        { from: 2, to: 1, label: 'Access token (+ refresh token)', reply: true },
        { from: 1, to: 3, label: 'API call with Bearer access token' },
        { from: 3, to: 1, label: 'Data, limited to granted scopes', reply: true }
      ],
      caption: 'The client app never sees the user’s password: it trades a short-lived, single-use code for tokens. Testers check exact redirect URL matching, enforced scopes, codes that work only once, and that expired or revoked tokens fail.'
    }
  ],

  'sa-api-negative': [
    {
      t: 'tree', title: 'Where a bad request should be stopped',
      root: {
        label: 'Invalid request to POST /orders',
        children: [
          { edge: 'Can’t be read', label: '400 or 415', children: [{ label: 'Malformed JSON, wrong Content-Type' }] },
          { edge: 'Readable, invalid', label: '400 or 422, field named', children: [{ label: 'Missing field, wrong type' }, { label: 'Out of range: quantity 0 or 100' }] },
          { edge: 'Valid but sneaky', label: 'Ignore or reject, never apply', children: [{ label: 'Extra field "status": "PAID"' }, { label: 'Script tag, SQL quote: stored as text' }] },
          { edge: 'Too much', label: '413 or 429', children: [{ label: 'Huge body (413), too fast (429)' }] }
        ]
      },
      caption: 'Grouping by where the request should fail gives every negative test an exact expected result. In every branch also confirm that nothing was saved and no stack trace leaked.'
    },
    {
      t: 'sequence', title: 'Idempotency-Key: one charge, however many retries',
      actors: ['Client', 'Payments API', 'Database'],
      steps: [
        { from: 0, to: 1, label: 'POST /payments, Idempotency-Key k-77' },
        { from: 1, to: 2, label: 'Save payment p-901 with key k-77' },
        { from: 1, to: 0, label: '201 lost: client times out', reply: true },
        { from: 0, to: 1, label: 'Retry: same key, same body' },
        { from: 1, to: 2, label: 'Look up key k-77' },
        { from: 2, to: 1, label: 'Found: p-901', reply: true },
        { from: 1, to: 0, label: 'Original result p-901, no new charge', reply: true },
        { from: 0, to: 1, label: 'Same key k-77, different amount' },
        { from: 1, to: 0, label: 'Rejected: 409 or 422 per contract', reply: true },
        { from: 0, to: 2, label: 'Tester: read-only count of payments' },
        { from: 2, to: 0, label: 'Exactly 1', reply: true }
      ],
      caption: 'The key lets the server recognise a retry and replay the original result instead of charging again. Reusing a key with a different body must be rejected, and the final proof is a count in the database.'
    },
    {
      t: 'flowchart', title: 'Consumer-driven contract testing',
      nodes: [
        { id: 'cons', label: 'Consumer tests run against a provider mock', kind: 'start' },
        { id: 'file', label: 'Contract: requests + fields the app needs', kind: 'io' },
        { id: 'share', label: 'Contract shared with the provider' },
        { id: 'verify', label: 'Provider build replays it on real code' },
        { id: 'met', label: 'Every expectation met?', kind: 'decision' },
        { id: 'deploy', label: 'Both sides safe to deploy', kind: 'end' },
        { id: 'fail', label: 'Provider build fails before release' },
        { id: 'fix', label: 'Fix the provider or agree a new contract' }
      ],
      edges: [
        { from: 'cons', to: 'file' },
        { from: 'file', to: 'share' },
        { from: 'share', to: 'verify' },
        { from: 'verify', to: 'met' },
        { from: 'met', to: 'deploy', label: 'Yes' },
        { from: 'met', to: 'fail', label: 'No' },
        { from: 'fail', to: 'fix' },
        { from: 'fix', to: 'verify', label: 'Re-verify' }
      ],
      caption: 'If a developer renames total to amount, the provider’s own build fails before release — no shared end-to-end environment needed. Contracts check the agreement, not the business logic, so functional tests are still required.'
    }
  ],

  'sa-mocking': [
    {
      t: 'matrix', title: 'Choosing a test double',
      x: { label: 'Double', ticks: ['Stub', 'Mock', 'Fake', 'Spy'] },
      y: { label: 'Question', ticks: ['How does it answer?', 'Does it check calls?', 'Choose it when…'] },
      cells: [
        ['Canned answers', 'Programmed answers', 'Real logic, simplified', 'Canned or real answers'],
        ['No', 'Yes: fails if calls differ', 'No', 'Records; the test asserts later'],
        ['You need a fixed reply, e.g. declined card', 'The call is the outcome: one charge', 'You need realistic state: in-memory DB', 'You check calls afterwards: email sent']
      ],
      caption: 'What matters is whether your double just answers, records, or actively verifies. Teams use the names loosely — a “mock” function in a JavaScript test runner often behaves as a stub or a spy.'
    },
    {
      t: 'layers', title: 'Service virtualization in staging',
      items: [
        { label: 'Tests: UI, API, end-to-end', sub: 'Pick a scenario by card token: approved, declined, timeout' },
        { label: 'ShopFlow checkout (real code)', sub: 'Unchanged, except the gateway URL in its config' },
        { label: 'Virtual payment gateway', sub: 'WireMock or Mountebank over the network, shared by teams' },
        { label: 'Stub mappings', sub: 'Match a request → 200, 402, 503 or a 30-second delay' }
      ],
      caption: 'The system under test talks to the virtual gateway exactly as it would to the real one, so declines, timeouts and outages can be triggered on demand. Back it with contract tests and a nightly sandbox run to catch mock drift.'
    },
    {
      t: 'flowchart', title: 'Checking a GraphQL response',
      nodes: [
        { id: 'resp', label: 'POST /graphql returns', kind: 'start' },
        { id: 'status', label: 'HTTP status?', kind: 'decision' },
        { id: 'pre', label: 'Parse or validation error (newer servers)', kind: 'end' },
        { id: 'errs', label: 'errors array present?', kind: 'decision' },
        { id: 'data', label: 'Any data returned?', kind: 'decision' },
        { id: 'partial', label: 'Partial result: check each field', kind: 'end' },
        { id: 'refused', label: 'Operation refused: read message, code', kind: 'end' },
        { id: 'shape', label: 'data shape and values correct?', kind: 'decision' },
        { id: 'pass', label: 'Pass', kind: 'end' },
        { id: 'bug', label: 'Bug: wrong data despite 200', kind: 'end' }
      ],
      edges: [
        { from: 'resp', to: 'status' },
        { from: 'status', to: 'pre', label: '4xx' },
        { from: 'status', to: 'errs', label: '200' },
        { from: 'errs', to: 'data', label: 'Yes' },
        { from: 'errs', to: 'shape', label: 'No' },
        { from: 'data', to: 'partial', label: 'Some' },
        { from: 'data', to: 'refused', label: 'null' },
        { from: 'shape', to: 'pass', label: 'Yes' },
        { from: 'shape', to: 'bug', label: 'No' }
      ],
      caption: 'Many GraphQL servers answer HTTP 200 even when an operation fails, so the errors array decides the result. The lesson’s example — 200 with order null and a FORBIDDEN error — is a refused operation, not a success.'
    }
  ]
});
