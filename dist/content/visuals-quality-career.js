/* Qadence content · visual guides · stages "quality" and "capstone" (14 lessons) */
QA_CONTENT.addVisuals({

  /* ---------------- Quality beyond functional ---------------- */

  'qb-accessibility': [
    {
      t: 'tree', title: 'WCAG 2.2: four principles, then testable criteria',
      root: {
        label: 'WCAG 2.2',
        children: [
          { label: 'Perceivable', children: [{ label: 'Text alternatives' }, { label: 'Captions for video' }, { label: 'Enough contrast' }] },
          { label: 'Operable', children: [{ label: 'Works by keyboard' }, { label: 'No keyboard trap' }, { label: 'Visible focus' }] },
          { label: 'Understandable', children: [{ label: 'Clear labels' }, { label: 'Errors in text' }] },
          { label: 'Robust', children: [{ label: 'Name, role, state exposed' }] }
        ]
      },
      caption: 'Every success criterion sits under one of the four POUR principles. In a bug report, name the criterion it breaks, for example 2.1.2 No Keyboard Trap under Operable.'
    },
    {
      t: 'flowchart', title: 'A practical accessibility pass', dir: 'down',
      nodes: [
        { id: 'start', label: 'Pick one key journey', kind: 'start' },
        { id: 'kb', label: 'Keyboard: reach and leave every control' },
        { id: 'focus', label: 'Focus always visible, never hidden' },
        { id: 'labels', label: 'Labels, accessible names, alt text' },
        { id: 'contrast', label: 'Contrast: 4.5:1 text, 3:1 UI parts' },
        { id: 'zoom', label: 'Zoom 200%, reflow at 400%' },
        { id: 'sr', label: 'Screen reader: name, role, state' },
        { id: 'scan', label: 'Automated scan, e.g. axe' },
        { id: 'fail', label: 'Any failures found?', kind: 'decision' },
        { id: 'log', label: 'Log bug: steps, AT, browser, criterion' },
        { id: 'done', label: 'Record what was checked', kind: 'end' }
      ],
      edges: [
        { from: 'start', to: 'kb' }, { from: 'kb', to: 'focus' }, { from: 'focus', to: 'labels' },
        { from: 'labels', to: 'contrast' }, { from: 'contrast', to: 'zoom' }, { from: 'zoom', to: 'sr' },
        { from: 'sr', to: 'scan' }, { from: 'scan', to: 'fail' },
        { from: 'fail', to: 'log', label: 'Yes' }, { from: 'fail', to: 'done', label: 'No' },
        { from: 'log', to: 'done' }
      ],
      caption: 'The manual checks find the blockers, such as a dropdown that cannot be opened by keyboard. The scan catches easy-to-detect issues fast, but a clean scan never means the page conforms.'
    },
    {
      t: 'pyramid', title: 'WCAG conformance levels',
      levels: [
        { label: 'AAA: enhanced', note: 'e.g. contrast 7:1; W3C does not advise requiring it for whole sites' },
        { label: 'AA: the usual target', note: 'All of A plus contrast 4.5:1, resize, reflow, visible focus' },
        { label: 'A: the minimum', note: 'Keyboard access, no keyboard trap, text alternatives, labels' }
      ],
      caption: 'Each level includes every criterion below it. Most organisations and many regulations target AA, while failures at level A often block some users completely.'
    }
  ],

  'qb-security': [
    {
      t: 'tree', title: 'OWASP Top 10 (2021), grouped by theme',
      root: {
        label: 'OWASP Top 10 (2021)',
        children: [
          { label: 'Access and identity', children: [{ label: 'A01 Broken Access Control' }, { label: 'A07 Identification and Auth Failures' }] },
          { label: 'Untrusted input', children: [{ label: 'A03 Injection (SQL, XSS)' }, { label: 'A10 Server-Side Request Forgery' }] },
          { label: 'Data and integrity', children: [{ label: 'A02 Cryptographic Failures' }, { label: 'A08 Software and Data Integrity Failures' }] },
          { label: 'Design, setup, operations', children: [{ label: 'A04 Insecure Design' }, { label: 'A05 Security Misconfiguration' }, { label: 'A06 Vulnerable and Outdated Components' }, { label: 'A09 Logging and Monitoring Failures' }] }
        ]
      },
      caption: 'The four theme groups are a memory aid of ours, not part of OWASP’s list. Broken Access Control is number one, and testers can probe it with nothing more than two accounts.'
    },
    {
      t: 'sequence', title: 'Testing for IDOR with two accounts',
      actors: ['Aisha (employee)', 'PeopleOps API', 'Permission check'],
      steps: [
        { from: 0, to: 1, label: 'GET /employees/501/payslips (her own)' },
        { from: 1, to: 0, label: '200 OK, only Aisha’s payslip', reply: true },
        { from: 0, to: 1, label: 'Same token, ID changed to 502 (Bilal)' },
        { from: 1, to: 2, label: 'Is 501 allowed to read 502?' },
        { from: 2, to: 1, label: 'No: not owner, not his manager', reply: true },
        { from: 1, to: 0, label: '403 Forbidden (or 404), no data', reply: true },
        { from: 0, to: 1, label: 'Same request with no or expired token' },
        { from: 1, to: 0, label: '401 Unauthorized, no data', reply: true }
      ],
      caption: 'Change only the ID and keep Aisha’s token. A secure API answers 403, or 404 to hide the record, never Bilal’s data; a missing or expired token gets 401 because the caller is not authenticated.'
    },
    {
      t: 'flowchart', title: 'Before and after a security check', dir: 'down',
      nodes: [
        { id: 'idea', label: 'Security test idea', kind: 'start' },
        { id: 'perm', label: 'Explicit permission for this system?', kind: 'decision' },
        { id: 'stop', label: 'Stop: ask for written scope', kind: 'end' },
        { id: 'scope', label: 'Inside agreed scope and environment?', kind: 'decision' },
        { id: 'run', label: 'Run a safe check, ideally in staging' },
        { id: 'data', label: 'Stumbled on real customer data?', kind: 'decision' },
        { id: 'halt', label: 'Stop; do not copy or keep it' },
        { id: 'vuln', label: 'Security issue found?', kind: 'decision' },
        { id: 'report', label: 'Report privately: steps, impact' },
        { id: 'retest', label: 'Retest fix, add to regression', kind: 'end' },
        { id: 'pass', label: 'Record the check and result', kind: 'end' }
      ],
      edges: [
        { from: 'idea', to: 'perm' },
        { from: 'perm', to: 'stop', label: 'No' }, { from: 'perm', to: 'scope', label: 'Yes' },
        { from: 'scope', to: 'stop', label: 'No' }, { from: 'scope', to: 'run', label: 'Yes' },
        { from: 'run', to: 'data' },
        { from: 'data', to: 'halt', label: 'Yes' }, { from: 'data', to: 'vuln', label: 'No' },
        { from: 'halt', to: 'report' },
        { from: 'vuln', to: 'report', label: 'Yes' }, { from: 'vuln', to: 'pass', label: 'No' },
        { from: 'report', to: 'retest' }
      ],
      caption: 'Permission comes before curiosity: without explicit, agreed scope you stop, and aggressive scanners never go near production or third-party sites. Findings and any real data you see go through a private channel, never a public board.'
    }
  ],

  'qb-performance': [
    {
      t: 'timeline', title: 'A fair load-test run, step by step',
      items: [
        { label: 'Workload model', sub: 'Journey mix, rate and think time from analytics or forecasts' },
        { label: 'Baseline at low, known load', sub: 'A reference run to compare later builds fairly' },
        { label: 'Warm up caches', sub: 'Do not measure the cold start by accident' },
        { label: 'Ramp up to expected peak', sub: 'Watch the load generator’s CPU as well as the servers' },
        { label: 'Hold steady and measure', sub: 'p50, p95, p99, throughput, errors and resource use together' },
        { label: 'Ramp down, then repeat', sub: 'Run more than once to see variation; change one thing at a time' },
        { label: 'Report with conditions', sub: 'Build, data set, environment differences and limits' }
      ],
      caption: 'Every step protects the honesty of the result. Skipping the baseline or the think time gives numbers that describe a situation that never happens.'
    },
    {
      t: 'layers', title: 'Why averages hide the slow tail',
      items: [
        { label: 'Example: 100 requests', sub: '90 take 200 ms, 10 take 6 s' },
        { label: 'p50 (median): 200 ms', sub: 'The typical request; half were faster' },
        { label: 'Average: 780 ms', sub: 'Pulled up by slow requests, yet still sounds acceptable' },
        { label: 'p95: 6 s', sub: 'The slow tail appears: one user in ten waits six seconds' },
        { label: 'p99: 6 s here', sub: '99% of requests at or below it; only the slowest 1% exceed it' }
      ],
      caption: 'Median and average both look fine, but p95 exposes users waiting six seconds. Write targets as percentiles, such as p95 ≤ 800 ms, and always read them next to the error rate.'
    },
    {
      t: 'flowchart', title: 'Finding the knee: where the system saturates', dir: 'down',
      nodes: [
        { id: 'base', label: 'Baseline at low, known load', kind: 'start' },
        { id: 'step', label: 'Raise the load one step' },
        { id: 'measure', label: 'Record throughput, p95, errors, CPU' },
        { id: 'rising', label: 'Throughput rising with users?', kind: 'decision' },
        { id: 'gen', label: 'Load generator saturated?', kind: 'decision' },
        { id: 'fixgen', label: 'Add generator capacity, rerun' },
        { id: 'knee', label: 'Knee found: the system is saturating' },
        { id: 'find', label: 'Find the busy resource, e.g. DB CPU' },
        { id: 'report', label: 'Report target met and headroom left', kind: 'end' }
      ],
      edges: [
        { from: 'base', to: 'step' }, { from: 'step', to: 'measure' }, { from: 'measure', to: 'rising' },
        { from: 'rising', to: 'step', label: 'Yes' }, { from: 'rising', to: 'gen', label: 'No' },
        { from: 'gen', to: 'fixgen', label: 'Yes' }, { from: 'gen', to: 'knee', label: 'No' },
        { from: 'fixgen', to: 'step' },
        { from: 'knee', to: 'find' }, { from: 'find', to: 'report' }
      ],
      caption: 'In the ShopFlow test, users rose 50% from 400 to 600 but throughput rose only about 17%, while p95 jumped and database CPU hit 97%. That flattening is the knee.'
    }
  ],

  'qb-nonfunctional': [
    {
      t: 'tree', title: 'ISO/IEC 25010 (2011): characteristics and sub-characteristics',
      root: {
        label: 'Product quality',
        children: [
          { label: 'Functional suitability' },
          { label: 'Performance efficiency' },
          { label: 'Compatibility', children: [{ label: 'Co-existence' }, { label: 'Interoperability' }] },
          { label: 'Usability' },
          { label: 'Reliability', children: [{ label: 'Availability' }, { label: 'Fault tolerance' }, { label: 'Recoverability' }] },
          { label: 'Security' },
          { label: 'Maintainability' },
          { label: 'Portability', children: [{ label: 'Installability' }] }
        ]
      },
      caption: 'Eight characteristics, with a few of their sub-characteristics shown. The 2023 revision has nine, adding Safety and renaming Usability and Portability; ask in refinement which ones matter for this feature.'
    },
    {
      t: 'sequence', title: 'MediBook database failover drill (staging)',
      actors: ['Tester', 'Patients', 'MediBook app', 'Primary DB', 'Standby DB'],
      steps: [
        { from: 0, to: 3, label: '10:00:00 stop the primary database' },
        { from: 1, to: 2, label: 'Book an appointment' },
        { from: 2, to: 1, label: '10:00:05 clear “please try again” message', reply: true },
        { from: 4, to: 0, label: '10:01:25 standby promoted to primary', reply: true },
        { from: 2, to: 4, label: '10:01:40 app reconnects to new primary' },
        { from: 1, to: 2, label: 'Book again' },
        { from: 2, to: 1, label: 'Booking saved: outage lasted 100 s', reply: true },
        { from: 0, to: 4, label: 'Check newest records and duplicates' },
        { from: 4, to: 0, label: '09:59:58 booking present, no duplicates', reply: true }
      ],
      caption: 'Recovery took 100 seconds, inside the 5-minute RTO, and no committed booking was lost, within the 1-minute RPO. The same drill exposed a reminder-SMS job that never reconnected.'
    },
    {
      t: 'flowchart', title: 'Proving a backup by restoring it', dir: 'down',
      nodes: [
        { id: 'ok', label: 'Backup job says “succeeded”', kind: 'start' },
        { id: 'restore', label: 'Restore into a separate environment' },
        { id: 'rto', label: 'Restored within the RTO?', kind: 'decision' },
        { id: 'rpo', label: 'Newest records within the RPO?', kind: 'decision' },
        { id: 'works', label: 'App works on the restored data?', kind: 'decision' },
        { id: 'defect', label: 'Raise a defect with timings and gaps' },
        { id: 'proven', label: 'Backup proven: record the drill', kind: 'end' }
      ],
      edges: [
        { from: 'ok', to: 'restore' }, { from: 'restore', to: 'rto' },
        { from: 'rto', to: 'rpo', label: 'Yes' }, { from: 'rto', to: 'defect', label: 'No: too slow' },
        { from: 'rpo', to: 'works', label: 'Yes' }, { from: 'rpo', to: 'defect', label: 'No: too much lost' },
        { from: 'works', to: 'proven', label: 'Yes' }, { from: 'works', to: 'defect', label: 'No' }
      ],
      caption: 'A green backup message only proves a file was written. RTO limits how long recovery takes, RPO limits how much data is lost, and both are checked by a real restore.'
    }
  ],

  'qb-perf-metrics': [
    {
      t: 'flowchart', title: 'Does the page pass Core Web Vitals?', dir: 'down',
      nodes: [
        { id: 'field', label: 'Field data from real users (RUM, CrUX)', kind: 'io' },
        { id: 'p75', label: 'Take p75, mobile and desktop separately' },
        { id: 'lcp', label: 'LCP ≤ 2.5 s?', kind: 'decision' },
        { id: 'inp', label: 'INP ≤ 200 ms?', kind: 'decision' },
        { id: 'cls', label: 'CLS ≤ 0.1?', kind: 'decision' },
        { id: 'pass', label: 'Passes Core Web Vitals', kind: 'end' },
        { id: 'lab', label: 'Debug in lab: Lighthouse, DevTools' },
        { id: 'ship', label: 'Ship fix, watch field data' }
      ],
      edges: [
        { from: 'field', to: 'p75' }, { from: 'p75', to: 'lcp' },
        { from: 'lcp', to: 'inp', label: 'Yes' }, { from: 'lcp', to: 'lab', label: 'No' },
        { from: 'inp', to: 'cls', label: 'Yes' }, { from: 'inp', to: 'lab', label: 'No' },
        { from: 'cls', to: 'pass', label: 'Yes' }, { from: 'cls', to: 'lab', label: 'No' },
        { from: 'lab', to: 'ship' }, { from: 'ship', to: 'field', label: 'Re-check' }
      ],
      caption: 'All three metrics must be good at the 75th percentile of real page loads. Lab tools help find the cause, but only field data, such as the 28-day CrUX window, confirms the fix.'
    },
    {
      t: 'layers', title: 'From user experience down to root cause',
      items: [
        { label: 'Field data: RUM, CrUX', sub: 'What real users experience; Core Web Vitals are judged here at p75' },
        { label: 'Lab page tests: Lighthouse, DevTools', sub: 'Reproducible runs for debugging; no real input, so TBT stands in for INP' },
        { label: 'API load tests: k6, JMeter', sub: 'Back-end p95, throughput and errors under load; thresholds can gate CI' },
        { label: 'Diagnostics: traces, plans, profiles', sub: 'Explain why: slow queries, N+1, CPU-bound code, exhausted pools' }
      ],
      caption: 'Each layer answers a different question. A fast API can still sit inside a slow page, so measure at the top and dig downwards to the cause.'
    },
    {
      t: 'flowchart', title: 'Tracing a slow result to its bottleneck', dir: 'down',
      nodes: [
        { id: 'slow', label: 'p95 climbs under load', kind: 'start' },
        { id: 'db', label: 'Database CPU high?', kind: 'decision' },
        { id: 'query', label: 'Slow queries: check EXPLAIN, indexes' },
        { id: 'many', label: 'Query count grows with list size?', kind: 'decision' },
        { id: 'n1', label: 'N+1: fetch all items in one query' },
        { id: 'cpu', label: 'App CPU near 100%?', kind: 'decision' },
        { id: 'prof', label: 'CPU-bound code: profile it' },
        { id: 'timeouts', label: 'Timeouts while CPU is low?', kind: 'decision' },
        { id: 'pool', label: 'Check pools and third-party calls' },
        { id: 'cache', label: 'Check caching: cache hit ratio' },
        { id: 'rerun', label: 'Fix one thing, rerun the same test', kind: 'end' }
      ],
      edges: [
        { from: 'slow', to: 'db' },
        { from: 'db', to: 'query', label: 'Yes' }, { from: 'db', to: 'many', label: 'No' },
        { from: 'many', to: 'n1', label: 'Yes' }, { from: 'many', to: 'cpu', label: 'No' },
        { from: 'cpu', to: 'prof', label: 'Yes' }, { from: 'cpu', to: 'timeouts', label: 'No' },
        { from: 'timeouts', to: 'pool', label: 'Yes' }, { from: 'timeouts', to: 'cache', label: 'No' },
        { from: 'query', to: 'rerun' }, { from: 'n1', to: 'rerun' }, { from: 'prof', to: 'rerun' },
        { from: 'pool', to: 'rerun' }, { from: 'cache', to: 'rerun' }
      ],
      caption: 'Confirm the cause with evidence such as a query plan, traces or pool metrics before proposing a fix. Change one thing at a time so the rerun shows what actually helped.'
    }
  ],

  'qb-privacy': [
    {
      t: 'cycle', title: 'Personal data lifecycle: test every stage',
      steps: ['Collect only what’s needed', 'Use for the stated purpose', 'Store with access control', 'Share only as agreed', 'Keep per retention policy', 'Delete or anonymise'],
      center: 'Test each stage',
      caption: 'Each stage maps to a principle: minimisation, purpose limitation, security, storage limitation. A deletion must reach every copy, including caches, search indexes, analytics and third parties.'
    },
    {
      t: 'flowchart', title: 'Choosing safe test data', dir: 'down',
      nodes: [
        { id: 'need', label: 'Need data for a test', kind: 'start' },
        { id: 'synth', label: 'Can synthetic data do the job?', kind: 'decision' },
        { id: 'gen', label: 'Generate synthetic data with edge cases' },
        { id: 'owner', label: 'Data owner approved a masked copy?', kind: 'decision' },
        { id: 'mask', label: 'Mask direct and indirect identifiers' },
        { id: 'reid', label: 'Could people still be re-identified?', kind: 'decision' },
        { id: 'pseudo', label: 'Still personal data: restrict access' },
        { id: 'use', label: 'Use only in a controlled test env', kind: 'end' }
      ],
      edges: [
        { from: 'need', to: 'synth' },
        { from: 'synth', to: 'gen', label: 'Yes' }, { from: 'synth', to: 'owner', label: 'No' },
        { from: 'owner', to: 'mask', label: 'Yes' }, { from: 'owner', to: 'gen', label: 'No: build synthetic' },
        { from: 'gen', to: 'use' }, { from: 'mask', to: 'reid' },
        { from: 'reid', to: 'pseudo', label: 'Yes' }, { from: 'reid', to: 'use', label: 'No' },
        { from: 'pseudo', to: 'use' }
      ],
      caption: 'Synthetic data is the safe default. If birth dates, postcodes or a lookup key remain, the data is only pseudonymised and is still personal data, so it needs access control.'
    }
  ],

  'qb-release': [
    {
      t: 'flowchart', title: 'Go / no-go: QA recommends, the owner decides', dir: 'down',
      nodes: [
        { id: 'sum', label: 'QA presents the release test summary', kind: 'start' },
        { id: 'crit', label: 'Open Critical or High defects?', kind: 'decision' },
        { id: 'accept', label: 'Owner accepts them with a workaround?', kind: 'decision' },
        { id: 'ops', label: 'Rollback rehearsed, monitoring ready?', kind: 'decision' },
        { id: 'gaps', label: 'Untested gaps or known issues left?', kind: 'decision' },
        { id: 'mitig', label: 'Propose flag, canary, monitoring' },
        { id: 'own', label: 'Owner accepts the residual risk?', kind: 'decision' },
        { id: 'go', label: 'Go: record decision and owner', kind: 'end' },
        { id: 'cond', label: 'Go with conditions: flag and triggers', kind: 'end' },
        { id: 'nogo', label: 'No-go: fix, retest, re-plan', kind: 'end' }
      ],
      edges: [
        { from: 'sum', to: 'crit' },
        { from: 'crit', to: 'accept', label: 'Yes' }, { from: 'crit', to: 'ops', label: 'No' },
        { from: 'accept', to: 'ops', label: 'Yes' }, { from: 'accept', to: 'nogo', label: 'No' },
        { from: 'ops', to: 'gaps', label: 'Yes' }, { from: 'ops', to: 'nogo', label: 'No' },
        { from: 'gaps', to: 'go', label: 'No' }, { from: 'gaps', to: 'mitig', label: 'Yes' },
        { from: 'mitig', to: 'own' },
        { from: 'own', to: 'cond', label: 'Yes' }, { from: 'own', to: 'nogo', label: 'No' }
      ],
      caption: 'QA brings evidence and a recommendation; the product or business owner makes the call and accepts any residual risk. Record every outcome with who decided and which risks were accepted.'
    },
    {
      t: 'timeline', title: 'A flagged canary rollout (PayLite v2.8)',
      items: [
        { label: 'Deploy the tested build, flag off', sub: 'The exact artifact that was tested; new-bill-pay switched off' },
        { label: 'Smoke test both flag states', sub: 'Turning the flag off must really restore the old behaviour' },
        { label: 'Flag on for 5% of users', sub: 'Canary: watch the payment error rate on agreed dashboards' },
        { label: 'Halt trigger ready', sub: 'Errors above 1% for 10 minutes: flag off, no redeploy needed' },
        { label: 'Run the 4 blocked cases', sub: 'When the biller sandbox returns; report by 12 Nov' },
        { label: 'Widen the rollout in steps', sub: 'Expand only while the metrics stay healthy' }
      ],
      caption: '“Go with conditions” becomes concrete steps. The halt trigger is a number plus a time window, so anyone on call knows exactly when to switch the flag off.'
    },
    {
      t: 'matrix', title: 'Triaging an open defect before release',
      x: { label: 'Reach: users and journeys affected', ticks: ['Rare edge case', 'Some users', 'Main journey'] },
      y: { label: 'Impact', ticks: ['Wrong money or data', 'Broken, has workaround', 'Cosmetic'] },
      cells: [
        ['Fix first, or flag the feature off', 'Usually no-go until fixed', 'No-go'],
        ['Release; document it, fix next', 'Go with conditions: notes, support', 'Owner decides: is the workaround enough?'],
        ['Release; backlog', 'Release; fix in a patch', 'Low severity, may still be high priority']
      ],
      tones: [['high', 'high', 'high'], ['low', 'mid', 'high'], ['low', 'low', 'mid']],
      caption: 'Typical starting points, not rules: workaround quality, fix risk and options such as a flag then adjust the call. A company-name typo on the home page is low severity yet often high priority.'
    }
  ],

  'qb-prod-ai': [
    {
      t: 'layers', title: 'Observability: zoom in from symptom to cause',
      items: [
        { label: 'Alerts: tell a human', sub: 'Rules on user-facing symptoms, not on every internal blip' },
        { label: 'Metrics: is something wrong?', sub: 'Request rate, error rate, latency percentiles over time' },
        { label: 'Traces: where does the time go?', sub: 'One request through every service, with timings per step' },
        { label: 'Logs: what exactly happened?', sub: 'Timestamped events; a correlation ID ties them to one request' }
      ],
      caption: 'An alert fires on a metric, a trace shows which service is slow or failing, and the logs for that request explain why. Synthetic checks and canaries rely on these signals.'
    },
    {
      t: 'flowchart', title: 'Shipping a change to an AI feature', dir: 'down',
      nodes: [
        { id: 'change', label: 'New prompt or model version', kind: 'start' },
        { id: 'run', label: 'Run eval set: several samples per case' },
        { id: 'rules', label: 'Rule checks: must and must-not include' },
        { id: 'rubric', label: 'Rubric score with a calibrated judge' },
        { id: 'human', label: 'Human review of sampled outputs' },
        { id: 'better', label: 'Any category worse than baseline?', kind: 'decision' },
        { id: 'hold', label: 'Hold: fix, add failures to eval set' },
        { id: 'canary', label: 'Ship via canary with monitoring', kind: 'end' }
      ],
      edges: [
        { from: 'change', to: 'run' }, { from: 'run', to: 'rules' }, { from: 'rules', to: 'rubric' },
        { from: 'rubric', to: 'human' }, { from: 'human', to: 'better' },
        { from: 'better', to: 'hold', label: 'Yes' }, { from: 'better', to: 'canary', label: 'No' },
        { from: 'hold', to: 'run', label: 'Retest' }
      ],
      caption: 'Compare each category, not just the overall score. ShopFlow Assist v2 was friendlier but fell from 100% to 85% on prompt injection, so it was held and the failing cases joined the eval set.'
    },
    {
      t: 'cycle', title: 'A safe chaos experiment',
      steps: ['Define the steady state', 'Hypothesis: it still holds', 'Set stop conditions', 'Inject a realistic failure', 'Compare with steady state', 'Fix and learn, then repeat'],
      center: 'Small blast radius',
      caption: 'Start in a test environment with a small blast radius and clear stop conditions, such as checkout success dropping. Move to production experiments only when the team is mature and prepared.'
    }
  ],

  /* ---------------- Capstone and career ---------------- */

  'cp-portfolio': [
    {
      t: 'flowchart', title: 'Trace one requirement through every layer', dir: 'down',
      nodes: [
        { id: 'req', label: 'Requirement: free shipping from $50.00', kind: 'start' },
        { id: 'manual', label: 'Manual BVA: $49.99, $50.00, $50.01' },
        { id: 'bug', label: 'Bug report for any failed case' },
        { id: 'api', label: 'API: request quote, then GET the cart' },
        { id: 'sql', label: 'Read-only SQL on the stored order' },
        { id: 'agree', label: 'Do UI, API and database agree?', kind: 'decision' },
        { id: 'inv', label: 'Investigate and write up the mismatch' },
        { id: 'auto', label: 'Automated check runs in CI' },
        { id: 'readme', label: 'One honest evidence row in README', kind: 'end' }
      ],
      edges: [
        { from: 'req', to: 'manual' }, { from: 'manual', to: 'bug' }, { from: 'bug', to: 'api' },
        { from: 'api', to: 'sql' }, { from: 'sql', to: 'agree' },
        { from: 'agree', to: 'auto', label: 'Yes' }, { from: 'agree', to: 'inv', label: 'No' },
        { from: 'inv', to: 'auto' }, { from: 'auto', to: 'readme' }
      ],
      caption: 'Use the same cart and order IDs at every layer. Agreement is strong evidence; disagreement is an investigation to write up, not automatic proof that one layer is wrong.'
    },
    {
      t: 'timeline', title: 'Building the capstone, in order',
      items: [
        { label: 'Pick a permitted app', sub: 'Practice demo, open source or your own, with resettable seed data' },
        { label: 'Write the test plan', sub: 'Scope, top risks, out of scope, entry and exit criteria' },
        { label: 'Design cases, log bugs', sub: 'Techniques with expected results; label seeded defects' },
        { label: 'Add API and SQL checks', sub: 'Status, auth and ownership; read-only queries; no secrets' },
        { label: 'Automate critical journeys', sub: 'Independent tests that run green in CI on every push' },
        { label: 'Write the test summary', sub: 'Passed, failed, blocked, residual risk and limitations' },
        { label: 'README and privacy pass', sub: 'Tell the story; remove tokens, company data and real personal data' }
      ],
      caption: 'Each step produces evidence a reviewer can open. Finish one journey well rather than starting many, and do the privacy pass before anything goes public.'
    }
  ],

  'cp-resume': [
    {
      t: 'flowchart', title: 'Writing an honest impact bullet', dir: 'down',
      nodes: [
        { id: 'verb', label: 'Action verb: Designed, Built, Logged', kind: 'start' },
        { id: 'what', label: 'What you tested: a practice checkout' },
        { id: 'how', label: 'How: boundary values, decision tables' },
        { id: 'result', label: 'Result: e.g. 24 cases, 5 defects logged' },
        { id: 'proof', label: 'Can you show proof of that number?', kind: 'decision' },
        { id: 'keep', label: 'Keep it and link the evidence', kind: 'end' },
        { id: 'swap', label: 'Use a count you can show instead' }
      ],
      edges: [
        { from: 'verb', to: 'what' }, { from: 'what', to: 'how' }, { from: 'how', to: 'result' },
        { from: 'result', to: 'proof' },
        { from: 'proof', to: 'keep', label: 'Yes' }, { from: 'proof', to: 'swap', label: 'No' },
        { from: 'swap', to: 'proof', label: 'Recheck' }
      ],
      caption: 'Every number must survive the interview question “How did you measure that?”. Counts of cases, checks and documented defects pass; invented claims like “improved quality by 40%” do not.'
    },
    {
      t: 'flowchart', title: 'Tailoring your resume to one job ad', dir: 'down',
      nodes: [
        { id: 'ad', label: 'Read the job ad', kind: 'start' },
        { id: 'split', label: 'Split must-haves from nice-to-haves' },
        { id: 'match', label: 'Match each item to your evidence' },
        { id: 'real', label: 'Do you have real evidence for it?', kind: 'decision' },
        { id: 'top', label: 'Move that bullet near the top' },
        { id: 'gap', label: 'Don’t claim it; plan to learn it' },
        { id: 'words', label: 'Use the ad’s own terms, if true' },
        { id: 'trim', label: 'Remove tools you barely know' },
        { id: 'ats', label: 'Simple layout: one column, real text', kind: 'end' }
      ],
      edges: [
        { from: 'ad', to: 'split' }, { from: 'split', to: 'match' }, { from: 'match', to: 'real' },
        { from: 'real', to: 'top', label: 'Yes' }, { from: 'real', to: 'gap', label: 'No' },
        { from: 'top', to: 'words' }, { from: 'gap', to: 'words' },
        { from: 'words', to: 'trim' }, { from: 'trim', to: 'ats' }
      ],
      caption: 'Same person, same evidence, reordered to match what this employer asked for. A simple single-column layout helps an applicant tracking system read it, and then a person reads what gets through.'
    },
    {
      t: 'pyramid', title: 'The application funnel',
      levels: [
        { label: 'Offer', note: 'Get it in writing; compare the whole package' },
        { label: 'Interviews', note: 'Technical and behavioural rounds; practise with mock interviews' },
        { label: 'Replies and screening calls', note: 'Referrals from people you know can help; silence is common' },
        { label: 'Tailored applications', note: 'A starting routine: 5–8 a week, each tracked in a simple sheet' }
      ],
      caption: 'Each level is smaller than the one below, and silence at the wide end is normal for entry-level roles. After two weeks without replies, review your targeting and evidence before sending more.'
    }
  ],

  'cp-interview-tech': [
    {
      t: 'flowchart', title: 'Answering an open test-design prompt', dir: 'down',
      nodes: [
        { id: 'prompt', label: '“How would you test a login?”', kind: 'start' },
        { id: 'clarify', label: 'Ask clarifying questions' },
        { id: 'enough', label: 'Enough context to rank risks?', kind: 'decision' },
        { id: 'assume', label: 'State your assumptions aloud' },
        { id: 'risks', label: 'Top risks: takeover, lockout, leaks' },
        { id: 'cats', label: 'Pick the test categories that matter' },
        { id: 'tests', label: 'Representative tests, data, evidence' },
        { id: 'prio', label: 'Prioritise: first hour vs left out' },
        { id: 'limits', label: 'Name limits and what you’d do next', kind: 'end' }
      ],
      edges: [
        { from: 'prompt', to: 'clarify' }, { from: 'clarify', to: 'enough' },
        { from: 'enough', to: 'risks', label: 'Yes' }, { from: 'enough', to: 'assume', label: 'No' },
        { from: 'assume', to: 'risks' }, { from: 'risks', to: 'cats' }, { from: 'cats', to: 'tests' },
        { from: 'tests', to: 'prio' }, { from: 'prio', to: 'limits' }
      ],
      caption: 'Clarifying questions are what good testers do on day one, not a weakness. Interviewers score the structure and the prioritisation, not the number of ideas.'
    },
    {
      t: 'tree', title: 'Handling a live question honestly',
      root: {
        label: 'Live question or task',
        children: [
          { label: 'Start simple, state assumptions', edge: 'I know it', children: [{ label: 'Narrate each step aloud', children: [{ label: 'Improve, then add negative cases' }] }] },
          { label: 'Say what you do know', edge: 'Partly', children: [{ label: 'Reason toward an answer aloud', children: [{ label: 'Say how you would verify it' }] }] },
          { label: 'Admit it plainly', edge: 'Not at all', children: [{ label: 'Share a related concept', children: [{ label: 'Explain how you would find out' }] }] }
        ]
      },
      caption: 'Silence and bluffing both hide your reasoning. “I don’t remember the HAVING syntax, but I need to group by email and keep groups with more than one row” earns real credit.'
    }
  ],

  'cp-interview-behavioral': [
    {
      t: 'timeline', title: 'A STAR answer: the tight-deadline story',
      items: [
        { label: 'S: change landed a day before demo', sub: 'Four-person team project, checkout change' },
        { label: 'T: half a day to judge what is safe', sub: 'My responsibility in one sentence' },
        { label: 'A: listed the changed areas' },
        { label: 'A: ran smoke and decline cases first' },
        { label: 'A: targeted regression on cart totals' },
        { label: 'A: posted status: 18 run, 1 failed', sub: 'Named what was not retested: coupons' },
        { label: 'R: demoed with coupons hidden', sub: 'Fixed the failure the next day' },
        { label: 'Reflect: ask for change notes earlier' }
      ],
      caption: 'Action takes up most of the answer and says “I”, not only “we”. The result is honest, with numbers the candidate can back up and what was left untested.'
    },
    {
      t: 'tree', title: 'A story bank that covers most questions',
      root: {
        label: 'Story bank: 5–6 true stories',
        children: [
          { label: 'A bug you missed', children: [{ label: 'Shows ownership' }] },
          { label: 'A disagreement', children: [{ label: 'Shows evidence over argument' }] },
          { label: 'A tight deadline', children: [{ label: 'Shows risk-based priorities' }] },
          { label: 'Learning a new tool', children: [{ label: 'Shows how you learn' }] },
          { label: 'A process you improved', children: [{ label: 'Shows initiative' }] },
          { label: 'Your proudest finding', children: [{ label: 'Shows testing judgement' }] }
        ]
      },
      caption: 'Learning projects, university work and non-QA jobs all count, as long as you say where each story comes from. One prepared story can be adapted to many different questions.'
    },
    {
      t: 'cycle', title: 'Preparing a behavioural answer',
      steps: ['Pick a true experience', 'Shape it as STAR', 'Make Action the longest part', 'Practise aloud and time it', 'Get feedback in a mock', 'Refine and reuse'],
      center: 'Honest and specific',
      caption: 'Each round of practice makes the story tighter. Keep the facts true; polish only the structure and the clarity.'
    }
  ],

  'cp-metrics': [
    {
      t: 'flowchart', title: 'Calculating and reading DRE', dir: 'down',
      nodes: [
        { id: 'ship', label: 'Release ships', kind: 'start' },
        { id: 'window', label: 'Fix the window, e.g. 90 days after' },
        { id: 'before', label: 'Found before release: 45', kind: 'io' },
        { id: 'after', label: 'Escaped within the window: 5', kind: 'io' },
        { id: 'calc', label: 'DRE = 45 ÷ (45 + 5) × 100 = 90%' },
        { id: 'sev', label: 'Classify escapes by severity' },
        { id: 'usage', label: 'Launch usage similar to past releases?', kind: 'decision' },
        { id: 'flag', label: 'Note it: a quiet launch flatters DRE' },
        { id: 'trend', label: 'Compare the trend across releases' },
        { id: 'dash', label: 'Add a one-line reading to the dashboard', kind: 'end' }
      ],
      edges: [
        { from: 'ship', to: 'window' }, { from: 'window', to: 'before' }, { from: 'window', to: 'after' },
        { from: 'before', to: 'calc' }, { from: 'after', to: 'calc' }, { from: 'calc', to: 'sev' },
        { from: 'sev', to: 'usage' },
        { from: 'usage', to: 'trend', label: 'Yes' }, { from: 'usage', to: 'flag', label: 'No' },
        { from: 'flag', to: 'trend' }, { from: 'trend', to: 'dash' }
      ],
      caption: 'Always state the window so releases are comparable. One escaped payment bug outweighs ten typos, so read DRE next to escaped defects by severity.'
    },
    {
      t: 'matrix', title: 'Turning vanity numbers into useful ones',
      x: { label: 'Version of the metric', ticks: ['Vanity', 'Useful'] },
      y: { label: 'Topic', ticks: ['Test volume', 'Test results', 'Defects', 'Coverage', 'Speed'] },
      cells: [
        ['“1,200 test cases”', 'Critical journeys with linked tests'],
        ['“97% passed”', 'Which tests failed or skipped, and why'],
        ['Bugs per tester', 'Escaped severity 1–2 defects in 90 days'],
        ['“90% code coverage” as a target', 'Requirements coverage, with pass status'],
        ['Deployments per week alone', 'Lead time paired with change failure rate']
      ],
      tones: [['high', 'low'], ['high', 'low'], ['high', 'low'], ['high', 'low'], ['high', 'low']],
      caption: 'A useful metric answers a question someone will act on, and is paired so it cannot be gamed alone. Goodhart’s law: once a number becomes a target, people optimise the number.'
    },
    {
      t: 'layers', title: 'What code coverage really tells you', nested: true,
      items: [
        { label: 'Code executed by tests', sub: 'What code coverage measures: the code ran, not that it was checked' },
        { label: 'Code whose results are asserted', sub: 'A test that asserts nothing still raises coverage' }
      ],
      caption: 'Verified code is only a part of executed code, so high coverage is necessary but not sufficient. Code coverage can never reveal a feature that was never built; requirements coverage finds that gap.'
    }
  ],

  'cp-career': [
    {
      t: 'tree', title: 'Common QA career paths',
      root: {
        label: 'QA tester, 1–2 years in',
        children: [
          { label: 'Automation / SDET' },
          { label: 'Performance' },
          { label: 'Security', children: [{ label: 'Pen testing: specialist training' }] },
          { label: 'Accessibility' },
          { label: 'QA lead', children: [{ label: 'QA manager' }] },
          { label: 'Quality coach' },
          { label: 'Sideways moves', children: [{ label: 'BA, product, DevOps, development' }] }
        ]
      },
      caption: 'There is no single ladder, and titles vary: an SDET in one company is a QA Automation Engineer in another. Read the responsibilities, and grow evidence toward the problems you enjoy.'
    },
    {
      t: 'cycle', title: 'A continuous-learning loop',
      steps: ['Choose one direction', 'Set a concrete output', 'Learn from primary sources', 'Get feedback', 'Update portfolio honestly'],
      center: 'One focus per quarter',
      caption: 'One direction per quarter beats five tools at once. Each loop ends with visible evidence, such as a small suite, a demo or a write-up, before you choose the next step.'
    },
    {
      t: 'timeline', title: 'Leadership grows before the title',
      items: [
        { label: 'Get mentored', sub: 'Bring concrete questions to someone more experienced' },
        { label: 'Mentor a newer tester', sub: 'Pair on test design; review bug reports kindly and specifically' },
        { label: 'Shape work early', sub: 'Join refinement and sharpen acceptance criteria' },
        { label: 'Pair with developers', sub: 'Unit and API tests together; run a bug bash before release' },
        { label: 'Improve how the team learns', sub: 'Suggest blameless reviews; start a community of practice' },
        { label: 'Own strategy as a lead', sub: 'Test strategy, risk reporting and release input' }
      ],
      caption: 'An illustrative path: the order varies from person to person. Influence on quality culture starts long before anyone calls you a lead.'
    }
  ]
});
