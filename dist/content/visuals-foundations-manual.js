/* Qadence visual guides · stages "foundations" and "manual" (20 lessons, 2–3 diagrams each) */
QA_CONTENT.addVisuals({

  /* ---------------- Foundations ---------------- */

  'fd-what-is-testing': [
    {
      t: 'flowchart', title: 'One test, from idea to informed decision', dir: 'down',
      nodes: [
        { id: 'req', label: 'Requirement or user story', kind: 'start' },
        { id: 'design', label: 'Write the test and its expected result' },
        { id: 'run', label: 'Run it and record the actual result' },
        { id: 'match', label: 'Actual matches expected?', kind: 'decision' },
        { id: 'pass', label: 'Mark passed, keep the evidence' },
        { id: 'invest', label: 'Reproduce and investigate' },
        { id: 'log', label: 'Log a defect with steps and evidence' },
        { id: 'report', label: 'Report passed, failed and not tested', kind: 'io' },
        { id: 'decide', label: 'Product owner makes the release call', kind: 'end' }
      ],
      edges: [
        { from: 'req', to: 'design' },
        { from: 'design', to: 'run' },
        { from: 'run', to: 'match' },
        { from: 'match', to: 'pass', label: 'Yes' },
        { from: 'match', to: 'invest', label: 'No' },
        { from: 'invest', to: 'log' },
        { from: 'log', to: 'run', label: 'Fix ready: retest' },
        { from: 'pass', to: 'report' },
        { from: 'log', to: 'report', label: 'Open defects' },
        { from: 'report', to: 'decide' }
      ],
      caption: 'The tester’s output is information — what passed, what failed and what was not tested. The release decision sits with the product owner, and a fixed defect loops back for a retest.'
    },
    {
      t: 'tree', title: 'Test ideas for the PeopleOps login rule',
      root: {
        label: 'Login: 5 failures lock for 15 min',
        children: [
          { label: 'Positive tests', edge: 'Valid input', children: [
            { label: 'Correct email + password → dashboard' },
            { label: 'Email in capitals → ask the PO' }
          ] },
          { label: 'Negative tests', edge: 'Invalid input', children: [
            { label: 'Wrong password → generic error' },
            { label: '5 failures, then correct → still locked' },
            { label: 'Empty fields → rejected by server too' }
          ] }
        ]
      },
      caption: 'Every idea already has an expected result. Negative tests check that the system fails safely, and the capitals case became a question for the product owner instead of a guess.'
    }
  ],

  'fd-qa-qc-testing': [
    {
      t: 'layers', title: 'QA contains QC, and QC contains testing', nested: true,
      items: [
        { label: 'Quality assurance (QA)', sub: 'Process: prevent defects — standards, Definition of Done, retrospectives, training' },
        { label: 'Quality control (QC)', sub: 'Product: detect defects — release checklists, inspecting deliverables' },
        { label: 'Testing', sub: 'The main form of QC: run the software and review its work products' }
      ],
      caption: 'Read it from the outside in: QA shapes how the whole team works, QC examines what was built, and testing is the hands-on part of QC. A job title that says “QA” usually covers all three.'
    },
    {
      t: 'cycle', title: 'How QC findings improve the QA process',
      steps: ['QA: agree the process', 'Team builds the feature', 'QC: testing finds defects', 'Retro: spot the pattern', 'QA: update the process'],
      center: 'Fewer repeat defects',
      caption: 'In the MediBook example, three bugs from missing time-zone rules led the team to add a time-zone line to the story template. QC finds problems in the product; QA uses them so the same kind of defect becomes less likely.'
    }
  ],

  'fd-error-defect-failure': [
    {
      t: 'flowchart', title: 'From human error to failure, and back to the root cause', dir: 'down',
      nodes: [
        { id: 'err', label: 'Error: rule misread as over $10', kind: 'start' },
        { id: 'defect', label: 'Defect: code discounts carts over $10' },
        { id: 'exec', label: 'Defective code executed?', kind: 'decision' },
        { id: 'hidden', label: 'Defect stays hidden, no failure yet' },
        { id: 'env', label: 'Environment fault: full disk, bad config' },
        { id: 'fail', label: 'Failure: $15 cart gets the discount' },
        { id: 'why', label: 'Ask why until you reach the root cause' },
        { id: 'root', label: 'Root cause: unreviewed rule, no examples' },
        { id: 'fix', label: 'Fix the code, add examples and reviews', kind: 'end' }
      ],
      edges: [
        { from: 'err', to: 'defect', label: 'introduces' },
        { from: 'defect', to: 'exec' },
        { from: 'exec', to: 'hidden', label: 'No' },
        { from: 'exec', to: 'fail', label: 'Yes' },
        { from: 'env', to: 'fail', label: 'No code defect' },
        { from: 'fail', to: 'why' },
        { from: 'why', to: 'root' },
        { from: 'root', to: 'fix' }
      ],
      caption: 'The failure is the symptom you see; the defect causes it and the error is the human mistake behind it. Notice the side branches: a defect can hide if its code never runs, and some failures have no code defect at all.'
    },
    {
      t: 'flowchart', title: 'A red test: is it really a product bug?', dir: 'down',
      nodes: [
        { id: 'red', label: 'Automated test fails', kind: 'start' },
        { id: 'exp', label: 'Expected result correct?', kind: 'decision' },
        { id: 'fixtest', label: 'Test defect: fix the test', kind: 'end' },
        { id: 'data', label: 'Test data valid?', kind: 'decision' },
        { id: 'fixdata', label: 'Data problem: reset or recreate data', kind: 'end' },
        { id: 'envq', label: 'Environment healthy?', kind: 'decision' },
        { id: 'envfix', label: 'Environment issue: report it, re-run', kind: 'end' },
        { id: 'repro', label: 'Fails consistently on re-run?', kind: 'decision' },
        { id: 'flaky', label: 'Intermittent: check timing, keep clues', kind: 'end' },
        { id: 'bug', label: 'Product defect: log it with evidence', kind: 'end' }
      ],
      edges: [
        { from: 'red', to: 'exp' },
        { from: 'exp', to: 'fixtest', label: 'No' },
        { from: 'exp', to: 'data', label: 'Yes' },
        { from: 'data', to: 'fixdata', label: 'No' },
        { from: 'data', to: 'envq', label: 'Yes' },
        { from: 'envq', to: 'envfix', label: 'No' },
        { from: 'envq', to: 'repro', label: 'Yes' },
        { from: 'repro', to: 'flaky', label: 'No' },
        { from: 'repro', to: 'bug', label: 'Yes' }
      ],
      caption: 'Rule out the test, the data and the environment before blaming the product — like the PayLite transfer that failed only because the payment service returned 503. Investigations still often uncover a real defect along the way.'
    },
    {
      t: 'tree', title: 'The seven testing principles, grouped',
      root: {
        label: 'Seven testing principles',
        children: [
          { label: 'Limits of testing', children: [
            { label: '1 Shows presence, not absence' },
            { label: '2 Exhaustive testing is impossible' },
            { label: '7 Absence-of-defects fallacy' }
          ] },
          { label: 'Where to aim effort', children: [
            { label: '3 Test early' },
            { label: '4 Defects cluster' },
            { label: '6 Context decides the approach' }
          ] },
          { label: 'Keep tests effective', children: [
            { label: '5 Tests wear out: refresh them' }
          ] }
        ]
      },
      caption: 'Grouping makes all seven easy to recall: three set the limits of what testing can prove, three tell you where to focus, and the pesticide paradox reminds you to refresh tests while keeping regression checks.'
    }
  ],

  'fd-sdlc-models': [
    {
      t: 'matrix', title: 'When the tester gets feedback in each model',
      x: { label: 'SDLC model', ticks: ['Waterfall', 'V-model', 'Iterative', 'Agile'] },
      y: { label: 'Question', ticks: ['Test design starts', 'First test run', 'How often tests run', 'Cost of a late change'] },
      cells: [
        ['In the design phase', 'As each matching document is ready', 'In every iteration', 'At backlog refinement'],
        ['After all coding is done', 'After coding, unit level first', 'End of the first iteration', 'Inside the first sprint'],
        ['Once, in the test phase', 'Once per test level', 'Every iteration, plus regression', 'Continuously, every sprint'],
        ['High', 'High', 'Medium', 'Low']
      ],
      tones: [
        ['none', 'none', 'none', 'none'],
        ['high', 'high', 'mid', 'low'],
        ['none', 'none', 'none', 'none'],
        ['high', 'high', 'mid', 'low']
      ],
      caption: 'All models contain the same activities; what changes is how soon working software meets a test. Shaded rows show where feedback arrives late and change is expensive — the reason to review requirements early in any model.'
    },
    {
      t: 'timeline', title: 'Waterfall: how a misread requirement travels',
      items: [
        { label: 'Requirements', sub: 'The rule is written ambiguously — the cheapest moment to catch it in a review' },
        { label: 'Design', sub: 'The design is built on the misunderstanding' },
        { label: 'Implementation', sub: 'The code faithfully implements the wrong rule' },
        { label: 'Test phase', sub: 'Finally found — rework flows back through design and code' },
        { label: 'Deployment', sub: 'If missed, users find it: hotfix, data repair, support calls' }
      ],
      caption: 'Each phase builds on the one before, so a requirement mistake gets more expensive at every step. Even in Waterfall, a tester who reviews requirements and designs tests early can stop it at the first item.'
    },
    {
      t: 'flowchart', title: 'CI, continuous delivery and continuous deployment', dir: 'down',
      nodes: [
        { id: 'merge', label: 'Developer merges a change', kind: 'start' },
        { id: 'ci', label: 'CI: build and run automated tests' },
        { id: 'green', label: 'All checks pass?', kind: 'decision' },
        { id: 'fixit', label: 'Fix the change and merge again' },
        { id: 'ready', label: 'Build is releasable' },
        { id: 'auto', label: 'Release automatically?', kind: 'decision' },
        { id: 'biz', label: 'Business chooses when to release' },
        { id: 'prod', label: 'Deployed to production' },
        { id: 'watch', label: 'Monitor and smoke-check production', kind: 'end' }
      ],
      edges: [
        { from: 'merge', to: 'ci' },
        { from: 'ci', to: 'green' },
        { from: 'green', to: 'fixit', label: 'No' },
        { from: 'fixit', to: 'ci', label: 'Re-run' },
        { from: 'green', to: 'ready', label: 'Yes' },
        { from: 'ready', to: 'auto' },
        { from: 'auto', to: 'prod', label: 'Yes (deployment)' },
        { from: 'auto', to: 'biz', label: 'No (delivery)' },
        { from: 'biz', to: 'prod', label: 'When chosen' },
        { from: 'prod', to: 'watch' }
      ],
      caption: 'Both practices keep every change releasable; only the last decision differs. With continuous delivery a person chooses when to release; with continuous deployment every green change goes out automatically, so the checks must be trustworthy.'
    }
  ],

  'fd-stlc': [
    {
      t: 'cycle', title: 'The STLC repeats every release or sprint',
      steps: ['Requirement analysis', 'Test planning', 'Test case design', 'Environment setup', 'Test execution', 'Test closure'],
      center: 'Lessons feed next loop',
      caption: 'The lesson’s flow shows one pass; the cycle shows what comes next. Lessons learned at closure sharpen the next round of analysis — in Agile the loop turns per story and per sprint.'
    },
    {
      t: 'flowchart', title: 'Entry and exit criteria as gates', dir: 'down',
      nodes: [
        { id: 'build', label: 'New build deployed to the test env', kind: 'start' },
        { id: 'entry', label: 'Entry criteria met?', kind: 'decision' },
        { id: 'block', label: 'Report the blocker, don’t start' },
        { id: 'exec', label: 'Execute tests, log defects' },
        { id: 'retest', label: 'Retest fixes, run regression' },
        { id: 'exit', label: 'Exit criteria met?', kind: 'decision' },
        { id: 'summary', label: 'Summary report: criteria met', kind: 'io' },
        { id: 'gaps', label: 'Report gaps, risks and options', kind: 'io' },
        { id: 'decide', label: 'Stakeholders decide on release', kind: 'end' }
      ],
      edges: [
        { from: 'build', to: 'entry' },
        { from: 'entry', to: 'block', label: 'No' },
        { from: 'block', to: 'build', label: 'Next build' },
        { from: 'entry', to: 'exec', label: 'Yes' },
        { from: 'exec', to: 'retest' },
        { from: 'retest', to: 'exit' },
        { from: 'exit', to: 'summary', label: 'Yes' },
        { from: 'exit', to: 'gaps', label: 'No' },
        { from: 'summary', to: 'decide' },
        { from: 'gaps', to: 'decide' }
      ],
      caption: 'Entry criteria stop wasted effort on a build that cannot be tested; exit criteria make “done” objective. When exit criteria are not met, the tester neither hides it nor blocks the release alone — the gaps and options go to the stakeholders.'
    },
    {
      t: 'layers', title: 'What the traceability matrix connects',
      items: [
        { label: 'Requirement', sub: 'Each criterion has an ID — is it covered by at least one test?' },
        { label: 'Test cases', sub: 'Which tests must change or re-run when this requirement changes?' },
        { label: 'Latest results', sub: 'Pass, fail, blocked or not run — per requirement, not just per test' },
        { label: 'Defects', sub: 'Which requirements are affected by open bugs?' }
      ],
      caption: 'The RTM starts in requirement analysis, gains test cases during design, and results and defects during execution. Following one row from top to bottom answers the lesson’s three questions: coverage, change impact and bug impact.'
    }
  ],

  'fd-levels-types': [
    {
      t: 'pyramid', title: 'Test levels: the scope grows as you climb',
      levels: [
        { label: 'Acceptance', note: 'Fit for business use? Users, customers, product owner' },
        { label: 'System', note: 'The whole system end to end, against requirements — testers' },
        { label: 'Integration', note: 'Interfaces between components and with external systems' },
        { label: 'Unit (component)', note: 'One function or class in isolation — developers' }
      ],
      caption: 'Each level tests a bigger piece against a different basis, from detailed design at the bottom to business needs at the top. The wide base reflects the common practice of many small, fast unit tests — a guideline, not an ISTQB rule.'
    },
    {
      t: 'tree', title: 'Test types: what are we checking, and why?',
      root: {
        label: 'Test types',
        children: [
          { label: 'Functional', edge: 'What it does', children: [
            { label: 'Rules, calculations, workflows' }
          ] },
          { label: 'Non-functional', edge: 'How well', children: [
            { label: 'Performance' },
            { label: 'Security' },
            { label: 'Usability and accessibility' }
          ] },
          { label: 'Black-box', edge: 'From the spec' },
          { label: 'White-box', edge: 'From the structure' },
          { label: 'Change-related', edge: 'After a change', children: [
            { label: 'Confirmation (retest)' },
            { label: 'Regression' }
          ] }
        ]
      },
      caption: 'A type answers “what and why”, a level answers “at what scale”, so any type can run at any level. Under change-related, retest confirms the fix while regression checks that nothing else broke.'
    },
    {
      t: 'sequence', title: 'Stub or driver? Who calls whom',
      actors: ['Driver', 'Module under test', 'Stub'],
      steps: [
        { from: 0, to: 1, label: 'Driver calls the module (replaces its caller)' },
        { from: 1, to: 2, label: 'Module calls a lower part that isn’t ready' },
        { from: 2, to: 1, label: 'Stub returns a canned answer', reply: true },
        { from: 1, to: 0, label: 'Result goes back; the driver checks it', reply: true }
      ],
      caption: 'A driver sits above the module and calls it; a stub sits below and is called by it. Top-down integration needs stubs for lower modules, bottom-up needs drivers for higher ones — mocks and fakes play the same roles today.'
    }
  ],

  'fd-static-testing': [
    {
      t: 'flowchart', title: 'How a review runs', dir: 'down',
      nodes: [
        { id: 'plan', label: 'Plan: scope, review type, people', kind: 'start' },
        { id: 'kick', label: 'Kick-off: share the work product' },
        { id: 'prep', label: 'Reviewers prepare on their own' },
        { id: 'meet', label: 'Meeting: log issues, don’t fix them' },
        { id: 'fix', label: 'Author fixes the defects found' },
        { id: 'check', label: 'Exit criteria met?', kind: 'decision' },
        { id: 'close', label: 'Report results and close', kind: 'end' }
      ],
      edges: [
        { from: 'plan', to: 'kick' },
        { from: 'kick', to: 'prep' },
        { from: 'prep', to: 'meet', label: 'Findings' },
        { from: 'meet', to: 'fix' },
        { from: 'fix', to: 'check' },
        { from: 'check', to: 'close', label: 'Yes' },
        { from: 'check', to: 'prep', label: 'No: re-review' }
      ],
      caption: 'The steps are the same at any formality — an inspection adds roles, checklists and metrics. Finding and fixing stay separate: the meeting records problems in the work product, and the author fixes them afterwards.'
    },
    {
      t: 'matrix', title: 'Verification and validation, static and dynamic',
      x: { label: 'How', ticks: ['Static (no execution)', 'Dynamic (execution)'] },
      y: { label: 'Checked against', ticks: ['Verification: the spec', 'Validation: user needs'] },
      cells: [
        ['Review a design against the requirements', 'Run system tests against the specification'],
        ['Review a clickable prototype with real users', 'UAT and beta testing with real users']
      ],
      caption: 'All four cells exist, which busts the myth that static means verification and dynamic means validation. Verification asks “built right?”, validation asks “built the right thing?” — a product can pass every verification and still fail validation.'
    },
    {
      t: 'tree', title: 'Which review type fits?',
      root: {
        label: 'How costly is a missed defect?',
        children: [
          { label: 'Informal review', edge: 'Low' },
          { label: 'Main goal of the review?', edge: 'Moderate', children: [
            { label: 'Walkthrough (author-led)', edge: 'Share, educate' },
            { label: 'Technical review', edge: 'Technical decision' }
          ] },
          { label: 'Inspection (trained moderator)', edge: 'Safety or money' }
        ]
      },
      caption: 'Formality follows risk: a quick informal review suits a low-risk story, an inspection with checklists and metrics suits a payment algorithm. Whatever the type, comments target the work product, never the author.'
    }
  ],

  'fd-agile-testing': [
    {
      t: 'cycle', title: 'A sprint through a tester’s eyes',
      steps: ['Refinement: three amigos', 'Sprint Planning', 'Test each story as it lands', 'Daily Scrum', 'Explore + regression', 'Sprint Review', 'Retrospective'],
      center: 'Sprint: 1 month or less',
      caption: 'Testing runs through the whole sprint, not just the last two days — that is the mini-waterfall trap. Refinement is ongoing work rather than a formal Scrum event, and testers belong to the Developers who build the increment.'
    },
    {
      t: 'matrix', title: 'Agile testing quadrants',
      x: { label: 'Purpose', ticks: ['Supports the team', 'Critiques the product'] },
      y: { label: 'Facing', ticks: ['Business-facing', 'Technology-facing'] },
      cells: [
        ['Q2: story tests, examples — automated + manual', 'Q3: exploratory, usability, UAT — manual'],
        ['Q1: unit and component tests — automated', 'Q4: performance, security — tool-supported']
      ],
      caption: 'The left column helps the team build the right thing as it goes; the right column challenges the product itself. The numbers are names, not an order — a balanced sprint draws on all four quadrants.'
    },
    {
      t: 'flowchart', title: 'From story to done: the Ready and Done gates', dir: 'down',
      nodes: [
        { id: 'story', label: 'Story in the backlog', kind: 'start' },
        { id: 'amigos', label: 'Three amigos: questions and examples' },
        { id: 'ready', label: 'Definition of Ready met?', kind: 'decision' },
        { id: 'refine', label: 'Refine: add AC, test data, split it' },
        { id: 'build', label: 'Build and test inside the sprint' },
        { id: 'done', label: 'Definition of Done met?', kind: 'decision' },
        { id: 'fix', label: 'Fix, retest, run regression' },
        { id: 'review', label: 'Show it at the Sprint Review', kind: 'end' }
      ],
      edges: [
        { from: 'story', to: 'amigos' },
        { from: 'amigos', to: 'ready' },
        { from: 'ready', to: 'refine', label: 'No' },
        { from: 'refine', to: 'ready', label: 'Re-check' },
        { from: 'ready', to: 'build', label: 'Yes' },
        { from: 'build', to: 'done' },
        { from: 'done', to: 'fix', label: 'No' },
        { from: 'fix', to: 'done', label: 'Re-check' },
        { from: 'done', to: 'review', label: 'Yes' }
      ],
      caption: 'Ready guards the start of work and Done guards its finish, so both must be checkable. The Definition of Done is part of Scrum; a Definition of Ready is a common team practice that is not in the Scrum Guide.'
    }
  ],

  'fd-risk-based': [
    {
      t: 'matrix', title: 'Risk heat map with the PayLite bill-payment risks',
      x: { label: 'Impact', ticks: ['Low (1)', 'Medium (2)', 'High (3)'] },
      y: { label: 'Likelihood', ticks: ['High (3)', 'Medium (2)', 'Low (1)'] },
      cells: [
        ['3 Medium', '6 High', '9 Critical: biller timeout'],
        ['2 Low: receipt layout', '4 Medium', '6 High: double charge, wrong amount'],
        ['1 Low: bill history sorting', '2 Low', '3 Medium']
      ],
      tones: [
        ['mid', 'high', 'high'],
        ['low', 'mid', 'high'],
        ['low', 'low', 'mid']
      ],
      caption: 'Placing real risks on the grid makes the plan obvious: the hot top-right cells get the earliest and deepest testing, while bill-history sorting sits in the coolest corner and was consciously left untested as residual risk.'
    },
    {
      t: 'flowchart', title: 'From risk workshop to residual-risk report', dir: 'down',
      nodes: [
        { id: 'list', label: 'List risks with PO, devs and support', kind: 'start' },
        { id: 'kind', label: 'Product or project risk?', kind: 'decision' },
        { id: 'manage', label: 'Mitigate, plan contingency, escalate' },
        { id: 'score', label: 'Score likelihood × impact' },
        { id: 'depth', label: 'Set test depth from the risk level' },
        { id: 'next', label: 'Test the highest open risk next' },
        { id: 'time', label: 'Time left and risks remaining?', kind: 'decision' },
        { id: 'report', label: 'Report tested, untested, residual risk', kind: 'io' },
        { id: 'accept', label: 'Stakeholders accept it or act', kind: 'end' }
      ],
      edges: [
        { from: 'list', to: 'kind' },
        { from: 'kind', to: 'manage', label: 'Project' },
        { from: 'kind', to: 'score', label: 'Product' },
        { from: 'score', to: 'depth' },
        { from: 'depth', to: 'next' },
        { from: 'next', to: 'time' },
        { from: 'time', to: 'next', label: 'Yes' },
        { from: 'time', to: 'report', label: 'No' },
        { from: 'manage', to: 'report', label: 'Status' },
        { from: 'report', to: 'accept' }
      ],
      caption: 'Product risks drive what you test and in which order; project risks are managed, not tested. Because the highest risks go first, whatever remains when time runs out is the least risky part — and the report says so plainly.'
    },
    {
      t: 'layers', title: 'From strategy to the release report',
      items: [
        { label: 'Test strategy', sub: 'General approach: levels, types, risk method, tools — long-lived' },
        { label: 'Test plan', sub: 'This release: scope, schedule, people, specific risks and criteria' },
        { label: 'Tests and charters', sub: 'Depth chosen per risk: deep for critical, light or none for low' },
        { label: 'Summary report', sub: 'What was tested, what was not, and the residual risk' }
      ],
      caption: 'Each layer applies the one above it: the strategy sets the approach, the plan applies it to one release, and each risk level decides how deep its tests go. The report closes the loop by stating residual risk in plain words.'
    }
  ],

  /* ---------------- Manual testing ---------------- */

  'mt-requirements': [
    {
      t: 'flowchart', title: 'From a vague story to test ideas', dir: 'down',
      nodes: [
        { id: 'card', label: 'User story card', kind: 'start' },
        { id: 'talk', label: 'Conversation: PO, developer, tester' },
        { id: 'gap', label: 'Vague word, missing limit or error?', kind: 'decision' },
        { id: 'ask', label: 'Ask the PO, write the answer down' },
        { id: 'ac', label: 'Write acceptance criteria with IDs' },
        { id: 'testable', label: 'Each AC specific and pass/fail?', kind: 'decision' },
        { id: 'ideas', label: 'List test ideas for each AC' },
        { id: 'cases', label: 'Expand into test cases, keep the IDs', kind: 'end' }
      ],
      edges: [
        { from: 'card', to: 'talk' },
        { from: 'talk', to: 'gap' },
        { from: 'gap', to: 'ask', label: 'Yes' },
        { from: 'ask', to: 'gap', label: 'Check again' },
        { from: 'gap', to: 'ac', label: 'No' },
        { from: 'ac', to: 'testable' },
        { from: 'testable', to: 'ac', label: 'No: rewrite' },
        { from: 'testable', to: 'ideas', label: 'Yes' },
        { from: 'ideas', to: 'cases' }
      ],
      caption: 'The loops are where testers add value: every vague word or missing limit goes back to the product owner instead of becoming a silent assumption. Carrying the IDs from criterion to test case gives you traceability for free.'
    },
    {
      t: 'timeline', title: 'Anatomy of one Given/When/Then scenario',
      items: [
        { label: 'Given', sub: 'Starting context: Sara is logged in with 10 days of annual leave' },
        { label: 'When', sub: 'One action: she requests 11 working days' },
        { label: 'Then', sub: 'Observable result: “You only have 10 days available”' },
        { label: 'And', sub: 'What must not happen: no leave request is created' }
      ],
      caption: 'Given sets up the state, When is a single action and Then is something a tester can observe. The And line matters as much as the message: a good criterion also states the side effect that must not happen.'
    }
  ],

  'mt-scenarios-cases': [
    {
      t: 'tree', title: 'One feature, five scenarios, many cases',
      root: {
        label: 'Feature: PeopleOps login',
        children: [
          { label: 'Valid login', children: [
            { label: 'Active user reaches the dashboard' }
          ] },
          { label: 'Wrong password', children: [
            { label: 'Registered email, wrong password' },
            { label: 'Unregistered email' },
            { label: 'Error hides which field was wrong' }
          ] },
          { label: 'Lockout after failures', children: [
            { label: 'Lock after the final allowed failure' },
            { label: 'Correct password while locked' }
          ] },
          { label: 'Forgot password' },
          { label: 'Log out' }
        ]
      },
      caption: 'Scenarios in the middle row say what to test and are quick to review for coverage; cases in the bottom row say exactly how, one condition each. Scenarios without cases yet show where writing work remains.'
    },
    {
      t: 'flowchart', title: 'Running a case: Pass, Fail or Blocked', dir: 'down',
      nodes: [
        { id: 'pick', label: 'Pick the test case', kind: 'start' },
        { id: 'pre', label: 'Preconditions and data in place?', kind: 'decision' },
        { id: 'blocked', label: 'Blocked: note what is missing', kind: 'end' },
        { id: 'steps', label: 'Follow the steps with the stated data' },
        { id: 'actual', label: 'Record the actual result', kind: 'io' },
        { id: 'cmp', label: 'Actual matches expected?', kind: 'decision' },
        { id: 'pass', label: 'Pass', kind: 'end' },
        { id: 'fail', label: 'Fail: log a bug, link the case ID', kind: 'end' }
      ],
      edges: [
        { from: 'pick', to: 'pre' },
        { from: 'pre', to: 'blocked', label: 'No' },
        { from: 'pre', to: 'steps', label: 'Yes' },
        { from: 'steps', to: 'actual' },
        { from: 'actual', to: 'cmp' },
        { from: 'cmp', to: 'pass', label: 'Yes' },
        { from: 'cmp', to: 'fail', label: 'No' }
      ],
      caption: 'Blocked is not Fail: it means the case could not run, for example because the account or environment was not ready. A precise expected result is what lets any teammate reach the same verdict at the comparison step.'
    }
  ],

  'mt-equivalence': [
    {
      t: 'timeline', title: 'Partitions of the PayLite amount (balance 300.00)',
      items: [
        { label: 'Below 1.00', sub: 'Invalid: “Minimum transfer is 1.00” (e.g. 0.50)' },
        { label: '1.00 – 300.00', sub: 'Valid: within the limit and the balance (e.g. 50.00)' },
        { label: '300.01 – 500.00', sub: 'Invalid here: inside the limit but above the balance (e.g. 400.00)' },
        { label: 'Above 500.00', sub: 'Invalid: above the 500.00 transfer limit' }
      ],
      caption: 'Read it as a number line from left to right. The limit says 1–500, but the balance rule splits that range in two — partitions come from every rule, not only the limit printed next to the field.'
    },
    {
      t: 'flowchart', title: 'Designing partitions step by step', dir: 'down',
      nodes: [
        { id: 'rules', label: 'Read every rule behind the input', kind: 'start' },
        { id: 'valid', label: 'List the valid partitions' },
        { id: 'invalid', label: 'List invalid: low, high, type, empty' },
        { id: 'split', label: 'Values in one group treated differently?', kind: 'decision' },
        { id: 'divide', label: 'Split it into two partitions' },
        { id: 'pick', label: 'Pick one representative per partition' },
        { id: 'expect', label: 'Write the expected result for each' },
        { id: 'combine', label: 'Combine valid ones; invalid one at a time', kind: 'end' }
      ],
      edges: [
        { from: 'rules', to: 'valid' },
        { from: 'valid', to: 'invalid' },
        { from: 'invalid', to: 'split' },
        { from: 'split', to: 'divide', label: 'Yes' },
        { from: 'divide', to: 'split', label: 'Check again' },
        { from: 'split', to: 'pick', label: 'No' },
        { from: 'pick', to: 'expect' },
        { from: 'expect', to: 'combine' }
      ],
      caption: 'The decision guards the core assumption: if quantities above 5 get bulk pricing, “1–10” is really two partitions. The last step avoids error masking — one invalid value per test, with every other field valid.'
    }
  ],

  'mt-boundary': [
    {
      t: 'timeline', title: 'Boundary values for a 1–10 quantity',
      items: [
        { label: '0', sub: 'Invalid, just below — in both two- and three-value BVA' },
        { label: '1', sub: 'Valid lower boundary' },
        { label: '2', sub: 'Valid, just inside — three-value only' },
        { label: '5', sub: 'Mid value: does the valid partition work at all?' },
        { label: '9', sub: 'Valid, just inside — three-value only' },
        { label: '10', sub: 'Valid upper boundary' },
        { label: '11', sub: 'Invalid, just above — in both two- and three-value BVA' }
      ],
      caption: 'Two-value BVA tests 0, 1, 10 and 11; three-value adds 2 and 9 for high-risk rules. Each value still needs its expected result, such as 0 → “Enter a quantity from 1 to 10”, item not added.'
    },
    {
      t: 'flowchart', title: 'Choosing boundary values for any rule', dir: 'down',
      nodes: [
        { id: 'read', label: 'Read the rule and find each edge', kind: 'start' },
        { id: 'incl', label: 'Inclusive or exclusive is clear?', kind: 'decision' },
        { id: 'ask', label: 'Ask the PO and record the answer' },
        { id: 'step', label: 'Find the smallest step: 1, 0.01, 1 min' },
        { id: 'risk', label: 'High-risk rule: money, limits, security?', kind: 'decision' },
        { id: 'three', label: 'Three-value: edge and both neighbours' },
        { id: 'two', label: 'Two-value: edge and outside neighbour' },
        { id: 'exp', label: 'Write the expected result per value' },
        { id: 'api', label: 'Repeat key values at the API', kind: 'end' }
      ],
      edges: [
        { from: 'read', to: 'incl' },
        { from: 'incl', to: 'ask', label: 'No' },
        { from: 'ask', to: 'step', label: 'Answered' },
        { from: 'incl', to: 'step', label: 'Yes' },
        { from: 'step', to: 'risk' },
        { from: 'risk', to: 'three', label: 'Yes' },
        { from: 'risk', to: 'two', label: 'No' },
        { from: 'three', to: 'exp' },
        { from: 'two', to: 'exp' },
        { from: 'exp', to: 'api' }
      ],
      caption: 'The questions come before the values: is the edge inclusive, and how big is one step? A UI field that blocks typing 11 proves nothing about the server, so the key values are repeated at the API.'
    },
    {
      t: 'timeline', title: 'One rule, two edges: the PayLite transfer fee',
      items: [
        { label: '99.99', sub: '2% fee — the last value below the first edge' },
        { label: '100.00', sub: '1% fee — the first edge, inclusive' },
        { label: '999.99', sub: '1% fee — the last value before the fee drops to zero' },
        { label: '1,000.00', sub: 'No fee — the second edge' }
      ],
      caption: 'A rule with several bands has a boundary between each pair of bands, so test both sides of every edge. Amounts step by 0.01, which is why the neighbours are 99.99 and 999.99 rather than 99 and 999.'
    }
  ],

  'mt-bug-reports': [
    {
      t: 'flowchart', title: 'Bug life cycle with its side paths', dir: 'down',
      nodes: [
        { id: 'new', label: 'New', kind: 'start' },
        { id: 'triage', label: 'Triage: real defect, fix now?', kind: 'decision' },
        { id: 'rejected', label: 'Rejected or Duplicate', kind: 'end' },
        { id: 'deferred', label: 'Deferred to a later release' },
        { id: 'assigned', label: 'Assigned' },
        { id: 'open', label: 'Open: developer analyses and fixes' },
        { id: 'fixed', label: 'Fixed in a test build' },
        { id: 'retest', label: 'Retest: tester re-runs the steps' },
        { id: 'passed', label: 'Retest passed?', kind: 'decision' },
        { id: 'reopened', label: 'Reopened, with build and evidence' },
        { id: 'verified', label: 'Verified' },
        { id: 'closed', label: 'Closed', kind: 'end' }
      ],
      edges: [
        { from: 'new', to: 'triage' },
        { from: 'triage', to: 'assigned', label: 'Yes' },
        { from: 'triage', to: 'rejected', label: 'Not a bug / duplicate' },
        { from: 'triage', to: 'deferred', label: 'Real, but later' },
        { from: 'deferred', to: 'triage', label: 'Re-triaged later' },
        { from: 'assigned', to: 'open' },
        { from: 'open', to: 'fixed' },
        { from: 'fixed', to: 'retest' },
        { from: 'retest', to: 'passed' },
        { from: 'passed', to: 'verified', label: 'Yes' },
        { from: 'passed', to: 'reopened', label: 'No' },
        { from: 'reopened', to: 'assigned', label: 'Back to developer' },
        { from: 'verified', to: 'closed' }
      ],
      caption: 'Interviews probe the branches the happy path hides: a failed retest goes to Reopened and loops back, and triage can end a bug as Rejected, Duplicate or Deferred. Re-running the steps is confirmation testing; regression around the fix comes next.'
    },
    {
      t: 'matrix', title: 'Severity × priority: one example per corner',
      x: { label: 'Priority — urgency, decided by the business', ticks: ['Low priority', 'High priority'] },
      y: { label: 'Severity — impact, assessed by the tester', ticks: ['High severity', 'Low severity'] },
      cells: [
        ['Crash exporting a 50,000+ row annual report', 'Card payment fails for every customer'],
        ['Footer icon 2 px out of line on About page', 'Company name misspelled on the home page']
      ],
      tones: [
        ['mid', 'high'],
        ['low', 'mid']
      ],
      caption: 'The two axes are independent: the misspelled company name breaks nothing yet must be fixed now, while the export crash is severe but rare and has a workaround. Severity is the tester’s impact assessment; priority is the business’s call.'
    },
    {
      t: 'flowchart', title: 'Before you press Submit', dir: 'down',
      nodes: [
        { id: 'seen', label: 'Unexpected behaviour observed', kind: 'start' },
        { id: 'clean', label: 'Repeat it from a clean state' },
        { id: 'repro', label: 'Reproduces every time?', kind: 'decision' },
        { id: 'narrow', label: 'Narrow it: browser, account, data' },
        { id: 'inter', label: 'Note frequency, timestamps, logs' },
        { id: 'dup', label: 'Already reported?', kind: 'decision' },
        { id: 'add', label: 'Add your evidence to that ticket', kind: 'end' },
        { id: 'write', label: 'Title, environment, minimal steps' },
        { id: 'evx', label: 'Expected vs actual, plus evidence' },
        { id: 'submit', label: 'Suggest severity, submit one issue', kind: 'end' }
      ],
      edges: [
        { from: 'seen', to: 'clean' },
        { from: 'clean', to: 'repro' },
        { from: 'repro', to: 'narrow', label: 'Yes' },
        { from: 'repro', to: 'inter', label: 'Sometimes' },
        { from: 'narrow', to: 'dup' },
        { from: 'inter', to: 'dup', label: 'Still report it' },
        { from: 'dup', to: 'add', label: 'Yes' },
        { from: 'dup', to: 'write', label: 'No' },
        { from: 'write', to: 'evx' },
        { from: 'evx', to: 'submit' }
      ],
      caption: 'Reproducing and narrowing first turns “it broke” into steps a developer can follow, and an intermittent bug is still reported with every clue. Checking for duplicates keeps one problem in one ticket.'
    }
  ],

  'mt-decision-tables': [
    {
      t: 'tree', title: 'The micro-loan rules as a decision tree',
      root: {
        label: 'Identity verified?',
        children: [
          { label: 'Reject (R1)', edge: 'No' },
          { label: 'Score ≥ 650?', edge: 'Yes', children: [
            { label: 'Income ≥ 2× instalment?', edge: 'Yes', children: [
              { label: 'Approve (R2)', edge: 'Yes' },
              { label: 'Manual review (R3)', edge: 'No' }
            ] },
            { label: 'Income ≥ 2× instalment?', edge: 'No', children: [
              { label: 'Manual review (R4)', edge: 'Yes' },
              { label: 'Reject (R5)', edge: 'No' }
            ] }
          ] }
        ]
      },
      caption: 'The “No” branch ends at once, which is why the four “not verified” combinations collapse into one rule with don’t-care values. Each leaf is one rule and at least one test; DT-01 uses a strong score and income to prove the verification check really comes first.'
    },
    {
      t: 'flowchart', title: 'Building a decision table you can trust', dir: 'down',
      nodes: [
        { id: 'cond', label: 'List conditions as yes/no questions', kind: 'start' },
        { id: 'act', label: 'List the possible actions' },
        { id: 'all', label: 'Write all 2ⁿ combinations' },
        { id: 'gap', label: 'Any rule with no clear action?', kind: 'decision' },
        { id: 'raise', label: 'Raise it as a requirement gap' },
        { id: 'same', label: 'Same actions, one condition differs?', kind: 'decision' },
        { id: 'merge', label: 'Merge them, mark it don’t care (–)' },
        { id: 'tests', label: 'One test per rule, concrete data' },
        { id: 'bva', label: 'Add boundaries, e.g. 649 and 650', kind: 'end' }
      ],
      edges: [
        { from: 'cond', to: 'act' },
        { from: 'act', to: 'all' },
        { from: 'all', to: 'gap' },
        { from: 'gap', to: 'raise', label: 'Yes' },
        { from: 'raise', to: 'gap', label: 'Answered' },
        { from: 'gap', to: 'same', label: 'No' },
        { from: 'same', to: 'merge', label: 'Yes' },
        { from: 'merge', to: 'same', label: 'Check again' },
        { from: 'same', to: 'tests', label: 'No' },
        { from: 'tests', to: 'bva' }
      ],
      caption: 'Writing every combination before reducing is what exposes gaps such as “is the $100 threshold checked before or after the discount?”. Merge only when the requirement truly makes a condition irrelevant, then pick a concrete value for each “–” when you run the test.'
    }
  ],

  'mt-state-transition': [
    {
      t: 'flowchart', title: 'Login lockout as a state machine', dir: 'down',
      nodes: [
        { id: 's0', label: 'S0 Active, 0 failures', kind: 'start' },
        { id: 's1', label: 'S1 Active, 1 failure' },
        { id: 's2', label: 'S2 Active, 2 failures' },
        { id: 's3', label: 'S3 Locked' },
        { id: 'refused', label: 'Refused: “Account locked”, no login', kind: 'io' },
        { id: 's4', label: 'S4 Logged in', kind: 'end' }
      ],
      edges: [
        { from: 's0', to: 's4', label: 'Correct password' },
        { from: 's0', to: 's1', label: 'Wrong password' },
        { from: 's1', to: 's4', label: 'Correct: counter reset' },
        { from: 's1', to: 's2', label: 'Wrong password' },
        { from: 's2', to: 's4', label: 'Correct: counter reset' },
        { from: 's2', to: 's3', label: 'Wrong: lock + email' },
        { from: 's3', to: 'refused', label: 'Any password (invalid)' },
        { from: 'refused', to: 's3', label: 'Stays locked' },
        { from: 's3', to: 's0', label: 'Admin unlocks' }
      ],
      caption: 'States are boxes and events label the arrows — 7 valid transitions; Refused is an outcome, not a state, because the account stays in S3. That loop is the most important negative test: even the correct password must be refused while locked.'
    },
    {
      t: 'flowchart', title: 'ShopFlow order states, including a forbidden move', dir: 'down',
      nodes: [
        { id: 'pending', label: 'Pending payment', kind: 'start' },
        { id: 'paid', label: 'Paid' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'delivered', label: 'Delivered', kind: 'end' },
        { id: 'cancelled', label: 'Cancelled', kind: 'end' },
        { id: 'returns', label: 'Cancel refused: use the returns flow', kind: 'io' }
      ],
      edges: [
        { from: 'pending', to: 'paid', label: 'Pay' },
        { from: 'pending', to: 'cancelled', label: 'Cancel' },
        { from: 'paid', to: 'shipped', label: 'Ship' },
        { from: 'paid', to: 'cancelled', label: 'Cancel + refund' },
        { from: 'shipped', to: 'delivered', label: 'Deliver' },
        { from: 'shipped', to: 'returns', label: 'Cancel (invalid)' }
      ],
      caption: 'Five valid arrows, covered by three sequences: Pay → Ship → Deliver, Cancel from Pending payment, and Pay → Cancel with a refund check. Every missing arrow is an invalid move to try, such as paying twice — through the API as well as the UI.'
    },
    {
      t: 'timeline', title: 'One test sequence, many transitions',
      items: [
        { label: 'Start: S0 Active, 0 failures', sub: 'A known starting state' },
        { label: 'Wrong password → S1', sub: 'Valid transition' },
        { label: 'Wrong password → S2', sub: 'Valid transition' },
        { label: 'Wrong password → S3 Locked', sub: 'Valid transition — check that the lock email is sent' },
        { label: 'Correct password → still S3', sub: 'Invalid attempt: refused, no login, no state change' },
        { label: 'Admin unlocks → S0', sub: 'Valid transition — failure counter reset' },
        { label: 'Correct password → S4 Logged in', sub: 'Valid transition' }
      ],
      caption: 'One sequence covers five valid transitions plus the critical invalid one, which is why 0-switch coverage usually needs fewer tests than transitions. Check the actions too — the email and the counter reset — not just the final state.'
    }
  ],

  'mt-exploratory': [
    {
      t: 'cycle', title: 'Session-based exploratory testing',
      steps: ['Write a charter', 'Explore for 60–120 min', 'Notes, bugs, questions', 'Debrief with PROOF', 'Pick the next charters'],
      center: 'One charter per session',
      caption: 'The time box, notes and debrief are what separate exploratory testing from ad hoc clicking. The loop closes when ideas from one session become the charters for the next.'
    },
    {
      t: 'tree', title: 'Scripted or exploratory?',
      root: {
        label: 'Regulated or contractual check?',
        children: [
          { label: 'Scripted test cases', edge: 'Yes' },
          { label: 'Rerun often or to be automated?', edge: 'No', children: [
            { label: 'Scripted, then automate', edge: 'Yes' },
            { label: 'New, vague or risky area?', edge: 'No', children: [
              { label: 'Exploratory session + charter', edge: 'Yes' },
              { label: 'Blend: checklist + exploration', edge: 'No' }
            ] }
          ] }
        ]
      },
      caption: 'Neither approach wins everywhere: scripts protect what is known and repeatable, while exploration hunts for what nobody wrote down. Most teams blend both.'
    },
    {
      t: 'timeline', title: 'A PROOF debrief of Ayesha’s session',
      items: [
        { label: 'Past', sub: 'Covered rescheduling and cancellation on mobile in 60 minutes' },
        { label: 'Results', sub: '2 high-severity bugs, 1 question for the PO, 1 usability issue' },
        { label: 'Obstacles', sub: 'A slow test SMS gateway' },
        { label: 'Outlook', sub: 'Two new charters from the ideas list' },
        { label: 'Feelings', sub: 'Low confidence in rescheduling until BUG-2 is fixed' }
      ],
      caption: 'Walking through PROOF in order turns a session sheet into a short, useful conversation. The last line — the tester’s confidence — often helps a release decision more than any pass count.'
    }
  ],

  'mt-regression': [
    {
      t: 'flowchart', title: 'A new build arrives: what runs, in what order', dir: 'down',
      nodes: [
        { id: 'build', label: 'New build on the test environment', kind: 'start' },
        { id: 'smoke', label: 'Smoke: is the build testable?', kind: 'decision' },
        { id: 'reject', label: 'Reject the build, report blockers', kind: 'end' },
        { id: 'retest', label: 'Retest the fixed defect' },
        { id: 'fixed', label: 'Defect really fixed?', kind: 'decision' },
        { id: 'back', label: 'Reopen and send back to the developer' },
        { id: 'sanity', label: 'Sanity: changed area behaves sensibly?', kind: 'decision' },
        { id: 'regress', label: 'Regression by risk and change impact' },
        { id: 'broke', label: 'Anything that worked now broken?', kind: 'decision' },
        { id: 'logreg', label: 'Log the regression with evidence' },
        { id: 'report', label: 'Report results; the PO decides', kind: 'end' }
      ],
      edges: [
        { from: 'build', to: 'smoke' },
        { from: 'smoke', to: 'reject', label: 'No' },
        { from: 'smoke', to: 'retest', label: 'Yes' },
        { from: 'retest', to: 'fixed' },
        { from: 'fixed', to: 'back', label: 'No' },
        { from: 'back', to: 'build', label: 'Next build' },
        { from: 'fixed', to: 'sanity', label: 'Yes' },
        { from: 'sanity', to: 'back', label: 'No' },
        { from: 'sanity', to: 'regress', label: 'Yes' },
        { from: 'regress', to: 'broke' },
        { from: 'broke', to: 'logreg', label: 'Yes' },
        { from: 'broke', to: 'report', label: 'No' },
        { from: 'logreg', to: 'report' }
      ],
      caption: 'This follows the lesson’s hotfix order — smoke, retest, sanity, then regression — and adds what happens when a check fails. A failed retest makes regression on that build wasted effort, and a regression found late still goes to the product owner as facts, not a verdict.'
    },
    {
      t: 'matrix', title: 'Four checks on two axes',
      x: { label: 'Scope', ticks: ['Wider scope', 'Narrow scope'] },
      y: { label: 'Kind of check', ticks: ['Shallow go/no-go', 'Re-run existing tests'] },
      cells: [
        ['Smoke: is the build testable at all?', 'Sanity: does this fix or area behave?'],
        ['Regression: did the change break anything else?', 'Retest: is this defect fixed?']
      ],
      caption: 'Smoke and sanity are quick checks that decide whether deeper testing is worth it; retest and regression re-run tests because something changed. Retest repeats only the failed case, while regression spreads to everything the change could affect.'
    },
    {
      t: 'tree', title: 'Choosing the regression set for the coupon hotfix',
      root: {
        label: 'Fix in discount service, build 5.8.1',
        children: [
          { label: 'Direct impact', children: [
            { label: 'Other coupon types' }
          ] },
          { label: 'Downstream users of the value', children: [
            { label: 'Cart totals, tax and rounding' },
            { label: 'Refunds of discounted orders' }
          ] },
          { label: 'Core journeys', children: [
            { label: 'Checkout with no coupon' }
          ] },
          { label: 'Cheap safety net', children: [
            { label: 'Automated smoke and API suites' }
          ] }
        ]
      },
      caption: 'Each branch is a selection reason — change impact, downstream consumers, core journeys and cheap automated coverage. Grouping areas by reason lets you explain why each one was chosen and what was deliberately left out.'
    }
  ],

  'mt-pairwise': [
    {
      t: 'timeline', title: 'How fast configurations multiply',
      items: [
        { label: '3 browsers', sub: '3 combinations' },
        { label: '× 2 operating systems', sub: '6 combinations' },
        { label: '× 3 payment methods', sub: '18 combinations' },
        { label: '× 2 account types', sub: '36 checkout runs — the pairwise table covers every pair in 9' },
        { label: '× 4 languages', sub: '144 combinations' },
        { label: '× 3 currencies', sub: '432 runs to test every combination' }
      ],
      caption: 'Each new parameter multiplies the total instead of adding to it. With four parameters, the L9-based table already cuts 36 runs to 9 while still pairing every value of every two parameters.'
    },
    {
      t: 'matrix', title: 'Every browser meets every payment method once',
      x: { label: 'Payment method', ticks: ['Card', 'Wallet', 'Cash on delivery'] },
      y: { label: 'Browser', ticks: ['Chrome', 'Firefox', 'Edge'] },
      cells: [
        ['Test 1 · Windows · Guest', 'Test 2 · macOS · Guest', 'Test 3 · Windows · Registered'],
        ['Test 4 · macOS · Registered', 'Test 5 · Windows · Guest', 'Test 6 · Windows · Guest'],
        ['Test 7 · Windows · Guest', 'Test 8 · Windows · Registered', 'Test 9 · macOS · Guest']
      ],
      caption: 'Each of the 9 cells holds exactly one test, so every browser–payment pair is covered with no gaps. The OS and account in each cell show how the same 9 rows also pair those two-value parameters with everything else.'
    },
    {
      t: 'flowchart', title: 'MediBook booking: main, alternate and exception flows', dir: 'down',
      nodes: [
        { id: 'search', label: 'Patient searches by speciality', kind: 'start' },
        { id: 'slot', label: 'Patient selects a slot' },
        { id: 'free', label: 'Slot still free?', kind: 'decision' },
        { id: 'taken', label: 'Exception 3a: slot no longer available' },
        { id: 'confirm', label: 'Confirms within 5 minutes?', kind: 'decision' },
        { id: 'expired', label: 'Exception 4a: hold released, no booking', kind: 'end' },
        { id: 'save', label: 'Appointment saved, slot removed' },
        { id: 'sms', label: 'SMS gateway up?', kind: 'decision' },
        { id: 'sent', label: 'Main: SMS sent, confirmation shown', kind: 'end' },
        { id: 'retry', label: 'Alternate 5a: in-app notice, SMS retried', kind: 'end' }
      ],
      edges: [
        { from: 'search', to: 'slot' },
        { from: 'slot', to: 'free' },
        { from: 'free', to: 'taken', label: 'No' },
        { from: 'taken', to: 'search', label: 'Back to the list' },
        { from: 'free', to: 'confirm', label: 'Yes: held 5 min' },
        { from: 'confirm', to: 'expired', label: 'No' },
        { from: 'confirm', to: 'save', label: 'Yes' },
        { from: 'save', to: 'sms' },
        { from: 'sms', to: 'sent', label: 'Yes' },
        { from: 'sms', to: 'retry', label: 'No' }
      ],
      caption: 'Each branch of the use case is at least one test, and the postconditions — appointment saved, slot gone, SMS sent — are what you check at the end. The 5-minute hold is also a boundary to test just before and just after.'
    }
  ],

  'mt-planning': [
    {
      t: 'flowchart', title: 'From plan to recommendation', dir: 'down',
      nodes: [
        { id: 'scope', label: 'Agree scope, risks and approach', kind: 'start' },
        { id: 'plan', label: 'Write plan with entry/exit criteria' },
        { id: 'wbs', label: 'Break the work into tasks' },
        { id: 'est', label: 'Three-point estimate for each task' },
        { id: 'fits', label: 'Estimate fits the deadline?', kind: 'decision' },
        { id: 'trade', label: 'Negotiate scope or date with the PO' },
        { id: 'run', label: 'Execute, tracking results in the RTM' },
        { id: 'exit', label: 'Exit criteria met?', kind: 'decision' },
        { id: 'ready', label: 'Report: ready, plus residual risks', kind: 'io' },
        { id: 'notready', label: 'Report: not ready, and what is missing', kind: 'io' },
        { id: 'po', label: 'Product owner decides', kind: 'end' }
      ],
      edges: [
        { from: 'scope', to: 'plan' },
        { from: 'plan', to: 'wbs' },
        { from: 'wbs', to: 'est' },
        { from: 'est', to: 'fits' },
        { from: 'fits', to: 'trade', label: 'No' },
        { from: 'trade', to: 'est', label: 'Re-estimate' },
        { from: 'fits', to: 'run', label: 'Yes' },
        { from: 'run', to: 'exit' },
        { from: 'exit', to: 'ready', label: 'Yes' },
        { from: 'exit', to: 'notready', label: 'No' },
        { from: 'ready', to: 'po' },
        { from: 'notready', to: 'po' }
      ],
      caption: 'Estimates feed a real decision: if the range does not fit, scope or the date changes before testing starts, not halfway through. Either way the report ends with a clear recommendation, and the release call belongs to the product owner.'
    },
    {
      t: 'layers', title: 'What a pass rate can hide', nested: true,
      items: [
        { label: 'Planned: 124 tests', sub: '109 passed = 88% of planned' },
        { label: 'Executed: 118 tests', sub: '6 blocked: 4 by the SSO environment, 2 by PO-341' },
        { label: 'Passed: 109 tests', sub: '92% of executed — yet 1 critical defect is still open' }
      ],
      caption: 'Each box sits inside the one before, so a pass rate depends on what you divide by: 92% of executed is only 88% of planned. Neither number cancels the open critical defect — the verdict was still “not ready”.'
    },
    {
      t: 'tree', title: 'Reading the RTM in both directions',
      root: {
        label: 'Requirements traceability matrix',
        children: [
          { label: 'Forward: requirement → tests', children: [
            { label: 'Finds gaps: REQ-4 has no tests' }
          ] },
          { label: 'Backward: test → requirement', children: [
            { label: 'Finds orphan tests to retire' }
          ] },
          { label: 'A requirement changes', children: [
            { label: 'Shows which tests to update, re-run' }
          ] },
          { label: 'Results and defects', children: [
            { label: 'REQ-3 blocked by critical PO-341' }
          ] }
        ]
      },
      caption: 'Forward tracing exposes requirements that no pass rate would reveal, like REQ-4; backward tracing finds tests that no longer trace to anything. One open defect can block other requirements too, as PO-341 does to REQ-3.'
    }
  ]
});
