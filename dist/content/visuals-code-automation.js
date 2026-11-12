/* Qadence content · visual guides · stages "code-git" and "automation" (lessons-code-git.js, lessons-automation.js) */
QA_CONTENT.addVisuals({

  /* ───────────── code-git ───────────── */

  'cg-js-basics': [
    {
      t: 'tree', title: 'JavaScript value types',
      root: {
        label: 'A JavaScript value',
        children: [
          {
            label: 'Primitive: one simple value',
            children: [
              { label: "string: 'Wireless Mouse'" },
              { label: 'number: 24.99, 0, NaN' },
              { label: 'boolean: true or false' },
              { label: 'undefined: never set' },
              { label: 'null: empty on purpose' }
            ]
          },
          {
            label: 'Object: a collection',
            children: [
              { label: "object: { role: 'admin' }" },
              { label: "array: ['ali', 'sara']" },
              { label: 'function: formatPrice()' }
            ]
          }
        ]
      },
      caption: "Primitives compare by value, so 'ali' === 'ali' is true; objects, arrays and functions compare by reference. Two quirks: typeof null is 'object', and typeof [] is 'object' too — use Array.isArray() to spot an array."
    },
    {
      t: 'flowchart', title: 'if / else if / else: only one branch runs',
      nodes: [
        { id: 'start', label: 'statusCode = 404', kind: 'start' },
        { id: 'ok', label: 'code >= 200 && code < 300?', kind: 'decision' },
        { id: 'success', label: "Log 'Success'" },
        { id: 'nf', label: 'code === 404?', kind: 'decision' },
        { id: 'notfound', label: "Log 'Not found'" },
        { id: 'other', label: "Log 'Other status'" },
        { id: 'next', label: 'Continue after the if block', kind: 'end' }
      ],
      edges: [
        { from: 'start', to: 'ok' },
        { from: 'ok', to: 'success', label: 'true' },
        { from: 'ok', to: 'nf', label: 'false' },
        { from: 'nf', to: 'notfound', label: 'true' },
        { from: 'nf', to: 'other', label: 'false' },
        { from: 'success', to: 'next' },
        { from: 'notfound', to: 'next' },
        { from: 'other', to: 'next' }
      ],
      caption: "Conditions are checked top to bottom and only the first true branch runs, so 404 skips 'Success' and stops at 'Not found'. With ===, a string '404' from the API would fall through to 'Other status' — exposing a contract bug instead of hiding it."
    },
    {
      t: 'flowchart', title: 'A loop with a back-edge: checking prices',
      nodes: [
        { id: 'init', label: 'failures = 0', kind: 'start' },
        { id: 'more', label: 'Another price left?', kind: 'decision' },
        { id: 'take', label: 'Take the next item' },
        { id: 'valid', label: 'Number, not negative, ≤ 2 decimals?', kind: 'decision' },
        { id: 'pass', label: 'Log PASS' },
        { id: 'fail', label: 'Log FAIL and failures++' },
        { id: 'report', label: "Print 'N of 4 prices failed'", kind: 'end' }
      ],
      edges: [
        { from: 'init', to: 'more' },
        { from: 'more', to: 'take', label: 'yes' },
        { from: 'more', to: 'report', label: 'no' },
        { from: 'take', to: 'valid' },
        { from: 'valid', to: 'pass', label: 'yes' },
        { from: 'valid', to: 'fail', label: 'no' },
        { from: 'pass', to: 'more', label: 'next item' },
        { from: 'fail', to: 'more', label: 'next item' }
      ],
      caption: 'for...of runs the body once per item and jumps back to the check after each one; the loop ends only when no items are left. Each pass handles one price, so a bad row never stops the others from being checked.'
    }
  ],

  'cg-functions-data': [
    {
      t: 'matrix', title: 'What each array method gives back',
      x: { label: 'Method called on 3 products', ticks: ['filter', 'find', 'some', 'every'] },
      y: { label: 'Items that match', ticks: ['All 3 match', 'Only 1 matches', 'None match'] },
      cells: [
        ['[a, b, c]: a new array of 3', 'a: the first match only', 'true', 'true'],
        ['[b]: still an array', 'b: the item itself', 'true', 'false'],
        ['[]: an empty array', 'undefined', 'false', 'false']
      ],
      tones: [
        ['none', 'none', 'none', 'none'],
        ['none', 'none', 'none', 'none'],
        ['mid', 'high', 'none', 'none']
      ],
      caption: 'The bottom row is where test code breaks: find returns undefined, so order.status then throws a TypeError, while filter returns [] — an empty array that is still truthy. Check the length or use toBeDefined() before reading fields.'
    },
    {
      t: 'flowchart', title: 'JSON round trip between test and API',
      nodes: [
        { id: 'obj', label: 'JS object in your test', kind: 'start' },
        { id: 'stringify', label: 'JSON.stringify(object)' },
        { id: 'req', label: 'JSON text in the request body', kind: 'io' },
        { id: 'api', label: 'API processes the request' },
        { id: 'res', label: 'Text in the response body', kind: 'io' },
        { id: 'valid', label: 'Is the body valid JSON?', kind: 'decision' },
        { id: 'parse', label: 'JSON.parse(text)' },
        { id: 'read', label: 'JS object: read order.status', kind: 'end' },
        { id: 'err', label: 'SyntaxError: log status and raw text', kind: 'end' }
      ],
      edges: [
        { from: 'obj', to: 'stringify' },
        { from: 'stringify', to: 'req' },
        { from: 'req', to: 'api' },
        { from: 'api', to: 'res' },
        { from: 'res', to: 'valid' },
        { from: 'valid', to: 'parse', label: 'yes' },
        { from: 'valid', to: 'err', label: 'no, e.g. HTML page' },
        { from: 'parse', to: 'read' }
      ],
      caption: 'JSON is only text on the wire: stringify before sending (fields set to undefined are dropped) and parse before reading fields. When a server sends an HTML error page instead, JSON.parse throws a SyntaxError, so log the status code and raw text first.'
    }
  ],

  'cg-git': [
    {
      t: 'layers', title: 'Where your changes live',
      items: [
        { label: 'Working tree', sub: 'Files you are editing. git diff shows unstaged changes.' },
        { label: 'Staging area', sub: 'git add puts changes here; git diff --staged shows the next commit.' },
        { label: 'Local repository', sub: 'git commit saves a snapshot to your history; git log --oneline lists it.' },
        { label: 'Remote repository (GitHub, GitLab)', sub: 'git push shares your commits; git pull brings in teammates’ commits.' }
      ],
      caption: 'Each command moves a change one level down the stack, and each level has its own way to inspect it. Nothing reaches teammates until git push, so git diff --staged before committing is your last cheap check.'
    },
    {
      t: 'timeline', title: 'A feature branch from start to merge',
      items: [
        { label: 'Update main', sub: 'git switch main, then git pull' },
        { label: 'Create a branch', sub: 'git switch -c test/coupons' },
        { label: 'Commit on the branch', sub: 'small commits; main is untouched' },
        { label: 'Push the branch', sub: 'git push -u origin test/coupons' },
        { label: 'Review in a PR', sub: 'teammates comment; CI checks run' },
        { label: 'Merge into main', sub: 'the branch’s commits join main' }
      ],
      caption: 'The branch is a safe side line: your commits stay off main until the merge. Rebasing is fine for tidying your own branch, but never rewrite commits that teammates have already pulled — on shared branches, revert instead.'
    }
  ],

  'cg-async': [
    {
      t: 'sequence', title: 'What await does during one click',
      actors: ['Test code', 'Browser', 'ShopFlow API'],
      steps: [
        { from: 0, to: 1, label: 'start waitForResponse (not awaited yet)' },
        { from: 0, to: 1, label: 'await click on Apply' },
        { from: 1, to: 2, label: 'POST /api/coupons' },
        { from: 1, to: 0, label: 'click resolves; test moves on', reply: true },
        { from: 2, to: 1, label: '200 OK with the discount', reply: true },
        { from: 1, to: 0, label: 'response promise resolves', reply: true },
        { from: 0, to: 1, label: "await expect(discount).toHaveText('-$5.00')" },
        { from: 1, to: 0, label: 'retries until the text matches', reply: true }
      ],
      caption: 'await pauses only the test function until each promise settles; the browser and the API keep working on their own. Creating the waitForResponse promise before the click means a fast reply cannot slip past unseen.'
    },
    {
      t: 'flowchart', title: 'Is this Playwright call awaited?',
      nodes: [
        { id: 'call', label: 'Playwright call: click, fill, expect', kind: 'start' },
        { id: 'awaited', label: 'Is it awaited?', kind: 'decision' },
        { id: 'pause', label: 'Test pauses until it settles' },
        { id: 'retry', label: 'Auto-waiting and retries apply' },
        { id: 'trust', label: 'A result you can trust', kind: 'end' },
        { id: 'runon', label: 'Test runs on to the next line' },
        { id: 'escape', label: 'Errors are not caught by try/catch' },
        { id: 'flaky', label: 'Flaky failure or a false pass' }
      ],
      edges: [
        { from: 'call', to: 'awaited' },
        { from: 'awaited', to: 'pause', label: 'yes' },
        { from: 'pause', to: 'retry' },
        { from: 'retry', to: 'trust' },
        { from: 'awaited', to: 'runon', label: 'no' },
        { from: 'runon', to: 'escape' },
        { from: 'escape', to: 'flaky' },
        { from: 'flaky', to: 'awaited', label: 'fix: add await' }
      ],
      caption: 'Neither JavaScript nor TypeScript reports a missing await, so the bug survives code review. Turn on the no-floating-promises and missing-playwright-await lint rules as errors to catch it before CI does.'
    },
    {
      t: 'matrix', title: 'Three ways to run steps over a list',
      x: { label: 'Code pattern', ticks: ['for...of + await', 'await Promise.all(map)', 'forEach(async ...)'] },
      y: { label: 'Two 300 ms steps', ticks: ['Order', 'Total time', 'Next line waits?', 'Errors caught?'] },
      cells: [
        ['One after another', 'In parallel', 'All start at once'],
        ['About 600 ms', 'About 300 ms', 'Unknown: nothing waits'],
        ['Yes', 'Yes', 'No: code after it runs early'],
        ['Yes, with try/catch', 'Yes: rejects on first failure', 'No: rejections escape']
      ],
      tones: [
        ['low', 'none', 'high'],
        ['mid', 'low', 'high'],
        ['low', 'low', 'high'],
        ['low', 'low', 'high']
      ],
      caption: 'Use for...of when steps must happen in order, such as filling a form, and Promise.all for independent setup work. forEach ignores the promises its callback returns, so it never belongs in async test code.'
    }
  ],

  'cg-errors-debugging': [
    {
      t: 'cycle', title: 'The debugging loop',
      steps: ['Reproduce the failure', 'Read the error and stack', 'Form one hypothesis', 'Test it: halve the search', 'Fix the root cause', 'Verify and add a check'],
      center: 'Evidence before edits',
      caption: 'If a hypothesis turns out wrong, go round again with a new one instead of changing code at random. Each pass should shrink the search space — fewer data rows, fewer steps, fewer commits with git bisect.'
    },
    {
      t: 'flowchart', title: 'Test bug, product bug or environment?',
      nodes: [
        { id: 'fail', label: 'Automated test fails', kind: 'start' },
        { id: 'read', label: 'Read the error, open the trace' },
        { id: 'repro', label: 'Reproducible by hand or via API?', kind: 'decision' },
        { id: 'req', label: 'Contradicts the requirement?', kind: 'decision' },
        { id: 'product', label: 'Product bug: report a minimal repro', kind: 'end' },
        { id: 'expect', label: 'Test expectation wrong: update it', kind: 'end' },
        { id: 'suite', label: 'Fails only in suite or one env?', kind: 'decision' },
        { id: 'env', label: 'Data or environment issue', kind: 'end' },
        { id: 'testbug', label: 'Test bug: wrong locator or missing await', kind: 'end' }
      ],
      edges: [
        { from: 'fail', to: 'read' },
        { from: 'read', to: 'repro' },
        { from: 'repro', to: 'req', label: 'yes' },
        { from: 'repro', to: 'suite', label: 'no' },
        { from: 'req', to: 'product', label: 'yes' },
        { from: 'req', to: 'expect', label: 'no' },
        { from: 'suite', to: 'env', label: 'yes' },
        { from: 'suite', to: 'testbug', label: 'no' }
      ],
      caption: "Prove which kind of failure it is before changing anything. 'Passes alone, fails in the suite' points to shared data or the environment, and wrapping the failing line in if (order) would only hide the evidence."
    },
    {
      t: 'layers', title: 'Reading a stack trace top-down',
      items: [
        { label: 'Line 1: error type and message', sub: "TypeError: Cannot read properties of undefined (reading 'priceCents')" },
        { label: 'First frame: where it broke', sub: 'at lineTotal (cart.js:2:23) means file cart.js, line 2, column 23. Open it first.' },
        { label: 'Next frames: who called it', sub: 'at cartSubtotal (cart.js:6:16), then the top-level call on line 13' },
        { label: 'Library frames: skip them', sub: 'node:internal and node_modules lines are not your code' }
      ],
      caption: 'The value before the dot is the undefined one: line.product was missing for the second cart line. Start at the first frame in your own code and move down only when you need more context.'
    }
  ],

  'cg-typescript': [
    {
      t: 'layers', title: 'Compile time vs runtime',
      items: [
        { label: 'Your .ts test code', sub: 'Types, interfaces and unions describe users, orders and page objects' },
        { label: 'tsc --noEmit (compile time)', sub: "Catches 'admn', swapped arguments and possibly-undefined values before tests run" },
        { label: 'Types erased: plain JavaScript', sub: 'Interfaces and unions vanish; an enum stays as a real object' },
        { label: 'Node and the browser (runtime)', sub: 'No type checks here: a wrong API response still arrives as plain data' }
      ],
      caption: 'TypeScript protects you only up to the compile step. Data from outside — API responses, files — is not checked at runtime, which is why unknown plus an explicit check is safer than any.'
    },
    {
      t: 'flowchart', title: 'Who catches a type error?',
      nodes: [
        { id: 'write', label: 'Write or change a .ts test', kind: 'start' },
        { id: 'tsc', label: 'Run npx tsc --noEmit?', kind: 'decision' },
        { id: 'errors', label: 'Any type errors?', kind: 'decision' },
        { id: 'fix', label: 'Fix it in the editor' },
        { id: 'run', label: 'npx playwright test' },
        { id: 'safe', label: 'Tests run on type-checked code', kind: 'end' },
        { id: 'transpile', label: 'Playwright transpiles and runs anyway' },
        { id: 'luck', label: 'Wrong type fails oddly or passes by luck', kind: 'end' }
      ],
      edges: [
        { from: 'write', to: 'tsc' },
        { from: 'tsc', to: 'errors', label: 'yes' },
        { from: 'tsc', to: 'transpile', label: 'no, skipped' },
        { from: 'errors', to: 'fix', label: 'yes' },
        { from: 'fix', to: 'errors', label: 're-run tsc' },
        { from: 'errors', to: 'run', label: 'no' },
        { from: 'run', to: 'safe' },
        { from: 'transpile', to: 'luck' }
      ],
      caption: "Playwright strips types without checking them, so a wrong value such as payment: 'cash' still runs. Put npx tsc --noEmit before the test step in CI so type errors fail fast."
    }
  ],

  'cg-collab': [
    {
      t: 'flowchart', title: 'A pull request from open to merge',
      nodes: [
        { id: 'open', label: 'Push branch, open a PR', kind: 'start' },
        { id: 'ci', label: 'CI runs lint, types and tests' },
        { id: 'green', label: 'All checks green?', kind: 'decision' },
        { id: 'fixci', label: 'Read the log or trace, fix, push' },
        { id: 'review', label: 'Reviewer reads the diff' },
        { id: 'changes', label: 'Changes requested?', kind: 'decision' },
        { id: 'reply', label: 'Reply to each comment, push fixes' },
        { id: 'merge', label: 'Approved and green: merge', kind: 'end' }
      ],
      edges: [
        { from: 'open', to: 'ci' },
        { from: 'ci', to: 'green' },
        { from: 'green', to: 'fixci', label: 'no' },
        { from: 'fixci', to: 'ci', label: 're-run CI' },
        { from: 'green', to: 'review', label: 'yes' },
        { from: 'review', to: 'changes' },
        { from: 'changes', to: 'reply', label: 'yes' },
        { from: 'reply', to: 'ci', label: 'new commits' },
        { from: 'changes', to: 'merge', label: 'no, approved' }
      ],
      caption: 'Every new push re-runs CI, so fixes go through the same checks as the first version. Treat a red check as information — read it before clicking re-run — and reply to each comment instead of resolving threads silently.'
    },
    {
      t: 'flowchart', title: 'Resolving a merge conflict',
      nodes: [
        { id: 'merge', label: 'git merge or git pull', kind: 'start' },
        { id: 'same', label: 'Same lines changed on both sides?', kind: 'decision' },
        { id: 'auto', label: 'Git merges automatically', kind: 'end' },
        { id: 'mark', label: 'Git marks the conflict in the file' },
        { id: 'decide', label: 'Decide the correct final code' },
        { id: 'markers', label: 'Delete all three marker lines' },
        { id: 'commit', label: 'git add the file, then git commit' },
        { id: 'rerun', label: 'Rerun the affected tests' },
        { id: 'push', label: 'Push the resolved branch', kind: 'end' }
      ],
      edges: [
        { from: 'merge', to: 'same' },
        { from: 'same', to: 'auto', label: 'no' },
        { from: 'same', to: 'mark', label: 'yes' },
        { from: 'mark', to: 'decide' },
        { from: 'decide', to: 'markers' },
        { from: 'markers', to: 'commit' },
        { from: 'commit', to: 'rerun' },
        { from: 'rerun', to: 'push' }
      ],
      caption: "Git cannot know whether 'Place order' or 'Pay now' is right, so you decide — ask the other author when unsure. Keeping both lines or leaving a stray marker breaks the test, which is why the rerun step matters."
    },
    {
      t: 'flowchart', title: 'A secret was committed: what now?',
      nodes: [
        { id: 'found', label: 'Secret found in a commit', kind: 'start' },
        { id: 'pushed', label: 'Pushed or shared yet?', kind: 'decision' },
        { id: 'amend', label: 'Remove it from the unpushed commit' },
        { id: 'assume', label: 'Assume it is compromised' },
        { id: 'rotate', label: '1. Revoke or rotate it first' },
        { id: 'remove', label: '2. Remove it from code; use env vars' },
        { id: 'tell', label: '3. Tell your lead or security team' },
        { id: 'logs', label: '4. Check access logs for misuse' },
        { id: 'ignore', label: 'Keep .env git-ignored from now on', kind: 'end' }
      ],
      edges: [
        { from: 'found', to: 'pushed' },
        { from: 'pushed', to: 'amend', label: 'not yet' },
        { from: 'pushed', to: 'assume', label: 'yes' },
        { from: 'amend', to: 'ignore' },
        { from: 'assume', to: 'rotate' },
        { from: 'rotate', to: 'remove' },
        { from: 'remove', to: 'tell' },
        { from: 'tell', to: 'logs' },
        { from: 'logs', to: 'ignore' }
      ],
      caption: 'Once pushed, deleting the line in a new commit does not help: the value lives on in history, clones, forks and CI caches. Rotation comes first because it makes the leaked value useless — and if you are unsure whether it was shared, rotate anyway.'
    }
  ],

  'cg-clean-tests': [
    {
      t: 'timeline', title: 'Anatomy of a clean test',
      items: [
        { label: 'Name', sub: 'SAVE10 takes 10% off the cart subtotal: condition plus result' },
        { label: 'Arrange', sub: 'cart with 2 x MOUSE-01 = $49.98, set up by a fixture or the API' },
        { label: 'Act', sub: "one user action: applyCoupon('SAVE10')" },
        { label: 'Assert', sub: 'discount -$5.00 and total $44.98: one behaviour' },
        { label: 'Teardown', sub: 'fixture code after use() cleans up, even on failure' }
      ],
      caption: 'Read left to right, the test is a specification: what is checked, with what data, and what result is expected. Given / When / Then in BDD is the same shape written in business language.'
    },
    {
      t: 'matrix', title: 'Loop of assertions vs one test per row',
      x: { label: 'Approach', ticks: ['Loop inside one test', 'One test per data row'] },
      y: { label: 'When SAVE10 breaks', ticks: ['Other coupons', 'The report says', 'Rerunning the case'] },
      cells: [
        ['Later rows never run', 'Still run and report'],
        ["'coupons work' failed: which?", "'coupon SAVE10 gives -$5.00' failed"],
        ['Rerun every row', 'Run that one test by name']
      ],
      tones: [
        ['high', 'low'],
        ['high', 'low'],
        ['mid', 'low']
      ],
      caption: 'A failed expect stops the test, so a loop of assertions hides every case after the first failure. Generating one named test per data row keeps failures precise: the report reads like a bug title and the other coupons still report their own results.'
    }
  ],

  /* ───────────── automation ───────────── */

  'au-what-to-automate': [
    {
      t: 'pyramid', title: 'The test pyramid',
      levels: [
        { label: 'E2E / UI: few', note: 'Critical journeys only. Slow; a failure could be UI, API, data or network.' },
        { label: 'Integration / API: solid middle', note: 'Rules and data, e.g. POST /api/cart rejects quantity 11. Fast, stable.' },
        { label: 'Unit: most checks', note: 'calculateShipping(49.99) returns 6.00. Milliseconds; points to one function.' }
      ],
      caption: 'Push each check down to the lowest layer that can prove it, and keep the UI layer for proving the pieces work together. The higher the layer, the slower the run and the longer a failure takes to diagnose.'
    },
    {
      t: 'matrix', title: 'Healthy pyramid vs ice-cream cone',
      x: { label: 'Suite shape', ticks: ['Pyramid (healthy)', 'Ice-cream cone'] },
      y: { label: 'Layer or effect', ticks: ['UI / E2E tests', 'API tests', 'Unit tests', 'A full run takes', 'A UI redesign'] },
      cells: [
        ['Few critical journeys', 'Hundreds, plus long manual runs'],
        ['A solid middle layer', 'A handful'],
        ['Most of the checks', 'Almost none'],
        ['Minutes', 'Hours'],
        ['Breaks a few scripts', 'Breaks dozens of scripts']
      ],
      tones: [
        ['low', 'high'],
        ['low', 'high'],
        ['low', 'high'],
        ['low', 'high'],
        ['low', 'high']
      ],
      caption: 'The cone is the pyramid upside down: most checks sit in the slowest, most fragile layer. If a rule can be checked through the API or a unit test, move it there and keep the UI for end-to-end journeys.'
    },
    {
      t: 'flowchart', title: 'Should this check be automated?',
      nodes: [
        { id: 'idea', label: 'A check idea', kind: 'start' },
        { id: 'often', label: 'Runs often or guards a big risk?', kind: 'decision' },
        { id: 'manual', label: 'Check manually as a one-off', kind: 'end' },
        { id: 'stable', label: 'Feature stable for now?', kind: 'decision' },
        { id: 'later', label: 'Not yet: revisit when stable', kind: 'end' },
        { id: 'oracle', label: 'Clear pass/fail result?', kind: 'decision' },
        { id: 'human', label: 'Keep for human judgement', kind: 'end' },
        { id: 'lower', label: 'Can API or unit level prove it?', kind: 'decision' },
        { id: 'below', label: 'Automate below the UI', kind: 'end' },
        { id: 'ui', label: 'Automate as a UI journey', kind: 'end' }
      ],
      edges: [
        { from: 'idea', to: 'often' },
        { from: 'often', to: 'manual', label: 'no' },
        { from: 'often', to: 'stable', label: 'yes' },
        { from: 'stable', to: 'later', label: 'no' },
        { from: 'stable', to: 'oracle', label: 'yes' },
        { from: 'oracle', to: 'human', label: 'no' },
        { from: 'oracle', to: 'lower', label: 'yes' },
        { from: 'lower', to: 'below', label: 'yes' },
        { from: 'lower', to: 'ui', label: 'no' }
      ],
      caption: "A 'yes' all the way down must still pay back: manual cost per run times the number of runs should clearly beat build cost plus ongoing maintenance. A holiday banner that lives for 10 days fails the very first question."
    }
  ],

  'au-playwright-basics': [
    {
      t: 'sequence', title: 'Who talks to whom in a Playwright test',
      actors: ['Test runner', 'Your test', 'Playwright API', 'Browser', 'App server'],
      steps: [
        { from: 0, to: 1, label: 'run test with a fresh context + page' },
        { from: 1, to: 2, label: "await page.goto('/login')" },
        { from: 2, to: 3, label: 'navigate (persistent connection)' },
        { from: 3, to: 4, label: 'GET /login' },
        { from: 4, to: 3, label: 'HTML, CSS, JS', reply: true },
        { from: 2, to: 1, label: 'goto resolves', reply: true },
        { from: 1, to: 2, label: 'await click on Sign in' },
        { from: 2, to: 3, label: 'actionability checks, then click' },
        { from: 3, to: 4, label: 'POST /api/login' },
        { from: 1, to: 2, label: 'await expect(heading).toBeVisible()' },
        { from: 2, to: 1, label: 'retries until visible, then passes', reply: true },
        { from: 1, to: 0, label: 'result + trace for the report', reply: true }
      ],
      caption: 'Your test never touches the browser directly: it calls the Playwright API, which drives a real Chromium, Firefox or WebKit build. The runner gives every test its own fresh page and collects the results for the HTML report.'
    },
    {
      t: 'pyramid', title: 'Locator priority: build on the base',
      levels: [
        { label: 'CSS / XPath: last resort', note: 'Legacy markup only; breaks when a designer adds a wrapper' },
        { label: 'getByTestId', note: 'An agreed data-testid when there is no stable role or text' },
        { label: 'getByText', note: 'Non-interactive text such as messages' },
        { label: 'getByPlaceholder', note: 'Inputs with a placeholder but no label' },
        { label: 'getByLabel', note: 'Form fields with a visible label' },
        { label: 'getByRole: use first', note: 'Role plus accessible name, as users and screen readers see it' }
      ],
      caption: 'The wider the band, the more often you should reach for it. Needing the narrow top band is feedback in itself: the element probably lacks an accessible name, so ask developers for one or for a data-testid.'
    },
    {
      t: 'flowchart', title: 'What happens when a locator is used',
      nodes: [
        { id: 'act', label: 'await locator.click()', kind: 'start' },
        { id: 'count', label: 'How many elements match?', kind: 'decision' },
        { id: 'wait', label: 'Keep re-querying the page' },
        { id: 'timeout', label: 'Timeout error: check the trace', kind: 'end' },
        { id: 'checks', label: 'Actionability checks, then click' },
        { id: 'done', label: 'Next line runs', kind: 'end' },
        { id: 'strict', label: 'Strict mode error: narrow the locator', kind: 'end' }
      ],
      edges: [
        { from: 'act', to: 'count' },
        { from: 'count', to: 'wait', label: 'none yet' },
        { from: 'wait', to: 'count', label: 'retry' },
        { from: 'wait', to: 'timeout', label: 'time is up' },
        { from: 'count', to: 'checks', label: 'exactly one' },
        { from: 'checks', to: 'done' },
        { from: 'count', to: 'strict', label: 'two or more' }
      ],
      caption: 'Locators are lazy and strict: Playwright waits for a match to appear but refuses to guess between several. Narrow a repeated element by scoping it, for example a row filtered with hasText and then its Edit button.'
    }
  ],

  'au-waits': [
    {
      t: 'flowchart', title: 'Auto-waiting before every action',
      nodes: [
        { id: 'click', label: 'await payButton.click()', kind: 'start' },
        { id: 'resolve', label: 'Resolve the locator to one element' },
        { id: 'checks', label: 'Visible, stable, enabled, not covered?', kind: 'decision' },
        { id: 'timeout', label: 'Timeout reached?', kind: 'decision' },
        { id: 'fail', label: 'Fail with a clear error and trace', kind: 'end' },
        { id: 'perform', label: 'Perform the click' },
        { id: 'next', label: 'Next line runs', kind: 'end' }
      ],
      edges: [
        { from: 'click', to: 'resolve' },
        { from: 'resolve', to: 'checks' },
        { from: 'checks', to: 'perform', label: 'all pass' },
        { from: 'checks', to: 'timeout', label: 'not yet' },
        { from: 'timeout', to: 'resolve', label: 'no: retry' },
        { from: 'timeout', to: 'fail', label: 'yes' },
        { from: 'perform', to: 'next' }
      ],
      caption: 'Which checks run depends on the action — fill needs an editable field, click needs the element to receive events. click({ force: true }) skips most of them and hides the overlay or disabled state a real user would hit.'
    },
    {
      t: 'sequence', title: 'waitForResponse: listen before you click',
      actors: ['Test', 'Browser', 'Profile API'],
      steps: [
        { from: 0, to: 1, label: 'saved = waitForResponse(PUT /api/profile)' },
        { from: 0, to: 1, label: 'await click on Save' },
        { from: 1, to: 2, label: 'PUT /api/profile' },
        { from: 1, to: 0, label: 'click resolves', reply: true },
        { from: 2, to: 1, label: '200 OK after 2.4 s on CI', reply: true },
        { from: 1, to: 0, label: 'await saved: response.ok() is true', reply: true },
        { from: 0, to: 1, label: "expect(status).toHaveText('Profile saved')" },
        { from: 1, to: 0, label: 'retries until the message shows', reply: true },
        { from: 0, to: 1, label: 'reload, then expect phone toHaveValue' },
        { from: 1, to: 0, label: 'value persisted, not just displayed', reply: true }
      ],
      caption: 'If you start listening after the click, a fast response may already be gone and the test hangs until it times out. Reloading at the end proves the phone number was saved, not merely shown in a success message.'
    },
    {
      t: 'tree', title: 'What should the test wait for?',
      root: {
        label: 'What does the next step need?',
        children: [
          { edge: 'Visible content', label: 'Web-first assertion: toHaveText' },
          { edge: 'A network reply', label: 'waitForResponse set up before the click' },
          { edge: 'Backend state', label: 'expect.poll on an API call' },
          { edge: 'Several checks', label: 'expect(async () => ...).toPass()' },
          { edge: 'Spinner gone', label: 'Extra check only, after the content' },
          { edge: 'Fixed seconds', label: 'Never: no waitForTimeout' }
        ]
      },
      caption: "Ask what a user would wait for before the next step. Skip waitForLoadState('networkidle') too: apps that poll may never go idle, and a quiet network does not prove the right content rendered."
    }
  ],

  'au-fixtures-data': [
    {
      t: 'timeline', title: 'Life of one test with a custom fixture',
      items: [
        { label: 'Test requests fixtures', sub: 'async ({ page, employee }) => { ... }' },
        { label: 'Setup runs', sub: 'fresh context + page; employee code before use() POSTs a unique record' },
        { label: 'Test body runs', sub: 'receives the value passed to await use(employee)' },
        { label: 'Teardown runs', sub: 'code after use() DELETEs the record, even if the test failed' },
        { label: 'Context closed', sub: 'no cookies, storage or test data left for the next test' }
      ],
      caption: 'Fixtures are set up only for tests that ask for them and torn down in reverse order. Because teardown runs after failures too, cleanup belongs in the fixture rather than at the end of the test body.'
    },
    {
      t: 'layers', title: 'How far isolation reaches', nested: true,
      items: [
        { label: 'Worker process', sub: 'runs test files in parallel with other workers' },
        { label: 'Browser', sub: 'launched once per worker and reused by its tests' },
        { label: 'Browser context: new for every test', sub: 'own cookies, localStorage and sessionStorage, like an incognito profile' },
        { label: 'Page', sub: 'the tab your test drives' }
      ],
      caption: "Everything inside the context is fresh for each test, but the server and database sit outside all of these boxes. Two tests that share an account or a 'Test User' name can still collide — unique data and cleanup are your job."
    },
    {
      t: 'flowchart', title: 'Sign in once, reuse everywhere',
      nodes: [
        { id: 'setup', label: 'setup project runs auth.setup.ts', kind: 'start' },
        { id: 'login', label: 'Sign in through the UI once' },
        { id: 'save', label: 'storageState saved to playwright/.auth', kind: 'io' },
        { id: 'roles', label: 'Several roles needed?', kind: 'decision' },
        { id: 'perrole', label: 'One state file per role' },
        { id: 'project', label: 'Test projects depend on setup' },
        { id: 'tests', label: 'Each test: new context + saved state' },
        { id: 'ready', label: 'Starts signed in, still isolated', kind: 'end' }
      ],
      edges: [
        { from: 'setup', to: 'login' },
        { from: 'login', to: 'save' },
        { from: 'save', to: 'roles' },
        { from: 'roles', to: 'perrole', label: 'yes' },
        { from: 'roles', to: 'project', label: 'no' },
        { from: 'perrole', to: 'project' },
        { from: 'project', to: 'tests' },
        { from: 'tests', to: 'ready' }
      ],
      caption: 'storageState keeps cookies and localStorage (IndexedDB optionally) but not sessionStorage. The file holds live session tokens, so add playwright/.auth to .gitignore — and keep one real UI login test so the login page stays covered.'
    }
  ],

  'au-frameworks': [
    {
      t: 'tree', title: 'How each tool drives the browser',
      root: {
        label: 'Your test code',
        children: [
          {
            label: 'Playwright',
            children: [
              { label: 'Out of process, persistent connection' },
              { label: 'Chromium, patched Firefox, WebKit' }
            ]
          },
          {
            label: 'Cypress',
            children: [
              { label: 'Runs inside the browser with the app' },
              { label: 'Plus a Node process for files, network' }
            ]
          },
          {
            label: 'Selenium WebDriver',
            children: [
              { label: 'W3C WebDriver commands to a driver' },
              { label: 'chromedriver, geckodriver, safaridriver' }
            ]
          }
        ]
      },
      caption: "Architecture explains behaviour: sharing the app's run loop gives Cypress a superb interactive runner but only one tab, while Selenium's driver-per-browser design reaches real Safari. Playwright ships tested browser builds so one API covers all three engines."
    },
    {
      t: 'matrix', title: 'The same login steps in three tools',
      x: { label: 'Tool', ticks: ['Playwright', 'Cypress', 'Selenium (Python)'] },
      y: { label: 'Step', ticks: ['Open the page', 'Type the email', 'Click Sign in', 'Wait and check'] },
      cells: [
        ["await page.goto('/login')", "cy.visit('/login')", 'driver.get(url)'],
        ["await getByLabel('Email').fill(...)", 'cy.get(...).type(...)', 'find_element(...).send_keys(...)'],
        ["await getByRole('button', ...).click()", "cy.contains('button', 'Sign in').click()", 'find_element(...).click()'],
        ['Assertion retries; await it', '.should() retries; no await', 'Explicit WebDriverWait(...).until']
      ],
      tones: [
        ['none', 'none', 'none'],
        ['none', 'none', 'none'],
        ['none', 'none', 'none'],
        ['low', 'low', 'mid']
      ],
      caption: 'The steps map almost one to one; the waiting model is what really differs. Cypress commands are queued, not promises, and Selenium needs an explicit wait for each condition that matters — never mixed with implicit waits.'
    }
  ],

  'au-pom': [
    {
      t: 'layers', title: 'Layers of a Playwright framework',
      items: [
        { label: 'Tests (specs)', sub: 'user intent and every assertion: login.signIn(...), then expect(...)' },
        { label: 'Fixtures', sub: 'hand ready page objects and data to tests: { loginPage, employee }' },
        { label: 'Page objects', sub: 'LoginPage, CheckoutPage: locators defined once, methods named for goals' },
        { label: 'Component objects', sub: 'Header, DataTable: scoped to a root locator, reused on many pages' },
        { label: 'Playwright API', sub: 'page, Locator, getByRole: auto-waiting and web-first assertions' }
      ],
      caption: 'Each layer calls the one below it, so a renamed label is fixed once in a page or component object. Config, base URLs and secrets come from environment variables, outside this stack.'
    },
    {
      t: 'sequence', title: 'One test, delegated down the layers',
      actors: ['Test', 'EmployeesPage', 'DataTable', 'Playwright'],
      steps: [
        { from: 0, to: 1, label: 'employeesPage.goto()' },
        { from: 1, to: 3, label: "page.goto('/employees')" },
        { from: 0, to: 2, label: 'table.search.fill(employee.name)' },
        { from: 2, to: 3, label: 'searchbox inside root: fill' },
        { from: 0, to: 2, label: "table.openRowAction(name, 'Edit')" },
        { from: 2, to: 3, label: "row(name) Edit button: click" },
        { from: 0, to: 3, label: 'expect(Edit heading).toBeVisible()' },
        { from: 3, to: 0, label: 'retries, then passes', reply: true }
      ],
      caption: 'The test states intent, page and component objects turn it into locators, and only Playwright touches the browser. The final check goes straight from the test, because assertions stay in tests.'
    },
    {
      t: 'flowchart', title: 'Should I add an abstraction?',
      nodes: [
        { id: 'dup', label: 'Same locators or steps again', kind: 'start' },
        { id: 'three', label: 'Seen in three or more places?', kind: 'decision' },
        { id: 'inline', label: 'Keep it inline for now', kind: 'end' },
        { id: 'widget', label: 'Widget shared across pages?', kind: 'decision' },
        { id: 'component', label: 'Component object with a root locator', kind: 'end' },
        { id: 'thin', label: 'Wrapper only calls locator.click()?', kind: 'decision' },
        { id: 'skip', label: 'Skip it: use Playwright directly', kind: 'end' },
        { id: 'method', label: 'Page object method named for the goal', kind: 'end' }
      ],
      edges: [
        { from: 'dup', to: 'three' },
        { from: 'three', to: 'inline', label: 'no' },
        { from: 'three', to: 'widget', label: 'yes' },
        { from: 'widget', to: 'component', label: 'yes' },
        { from: 'widget', to: 'thin', label: 'no' },
        { from: 'thin', to: 'skip', label: 'yes' },
        { from: 'thin', to: 'method', label: 'no' }
      ],
      caption: 'Abstract real duplication, keep classes small and prefer composition (a page has a header) over deep inheritance. A reviewer should still understand a spec without opening its page objects.'
    }
  ],

  'au-flaky': [
    {
      t: 'flowchart', title: 'Triage a flaky test',
      nodes: [
        { id: 'flag', label: 'Fails in CI, passes on retry', kind: 'start' },
        { id: 'repro', label: 'Reproduce: --repeat-each, 4 workers' },
        { id: 'traces', label: 'Compare pass and fail traces' },
        { id: 'clear', label: 'Root cause clear?', kind: 'decision' },
        { id: 'quarantine', label: 'Quarantine: tag, ticket, owner, deadline' },
        { id: 'product', label: 'Is the product racing?', kind: 'decision' },
        { id: 'bug', label: 'Report a product bug with the trace', kind: 'end' },
        { id: 'fix', label: 'Fix the cause in test, data or env' },
        { id: 'verify', label: 'Verify with --repeat-each in parallel' },
        { id: 'gate', label: 'Back in the gating run', kind: 'end' }
      ],
      edges: [
        { from: 'flag', to: 'repro' },
        { from: 'repro', to: 'traces' },
        { from: 'traces', to: 'clear' },
        { from: 'clear', to: 'quarantine', label: 'not yet' },
        { from: 'quarantine', to: 'repro', label: 'keep evidence' },
        { from: 'clear', to: 'product', label: 'yes' },
        { from: 'product', to: 'bug', label: 'yes' },
        { from: 'product', to: 'fix', label: 'no' },
        { from: 'fix', to: 'verify' },
        { from: 'verify', to: 'gate' }
      ],
      caption: 'A pass on retry is reported as flaky, not passed — treat it as a work item. Quarantined tests keep running in a non-blocking job so evidence keeps coming, and the deadline forces a decision: fix, rewrite lower or delete.'
    },
    {
      t: 'tree', title: 'Where flakiness comes from',
      root: {
        label: 'Flaky test',
        children: [
          { label: 'Test code', children: [{ label: 'Timing: no wait for real state' }, { label: 'Order dependence, shared state' }] },
          { label: 'Test data', children: [{ label: 'Collisions: email already exists' }] },
          { label: 'Environment', children: [{ label: 'Slow or down: 502 / 503' }, { label: 'Third parties: payments, maps' }] },
          { label: 'Time and randomness', children: [{ label: 'Midnight, time zones, seeds' }] },
          { label: 'The product', children: [{ label: 'A genuine race condition' }] }
        ]
      },
      caption: 'Most causes live in the test, its data or the environment, but not all: a double-submitted order in a trace is a product race that users will hit too. Classify the cause before you choose the fix.'
    },
    {
      t: 'matrix', title: 'Why a little flakiness ruins a suite',
      x: { label: 'Chance each test flakes', ticks: ['0.1%', '0.5%', '1%'] },
      y: { label: 'Tests in the run', ticks: ['10 tests', '50 tests', '200 tests'] },
      cells: [
        ['1.0% of runs red', '4.9% of runs red', '9.6% of runs red'],
        ['4.9% of runs red', '22.2% of runs red', '39.5% of runs red'],
        ['18.1% of runs red', '63.3% of runs red', '86.6% of runs red']
      ],
      tones: [
        ['low', 'low', 'mid'],
        ['low', 'mid', 'high'],
        ['mid', 'high', 'high']
      ],
      caption: 'The chance of a red run is 1 − (1 − p)^n, so small per-test flakiness compounds fast: 50 tests at 1% each turn a run red about 40% of the time. Soon nobody believes a red build — including the one with a real regression.'
    }
  ],

  'au-ci': [
    {
      t: 'flowchart', title: 'A pull request pipeline with a gate',
      nodes: [
        { id: 'push', label: 'Push or pull request', kind: 'start' },
        { id: 'install', label: 'npm ci, lint, type-check' },
        { id: 'unit', label: 'Unit and API tests' },
        { id: 'browsers', label: 'Install browsers --with-deps' },
        { id: 'smoke', label: 'E2E smoke: @smoke on Chromium' },
        { id: 'upload', label: 'Upload report if not cancelled', kind: 'io' },
        { id: 'gate', label: 'All gating checks green?', kind: 'decision' },
        { id: 'merge', label: 'Merge allowed', kind: 'end' },
        { id: 'fix', label: 'Open report and trace, fix, push' }
      ],
      edges: [
        { from: 'push', to: 'install' },
        { from: 'install', to: 'unit' },
        { from: 'unit', to: 'browsers' },
        { from: 'browsers', to: 'smoke' },
        { from: 'smoke', to: 'upload' },
        { from: 'upload', to: 'gate' },
        { from: 'gate', to: 'merge', label: 'yes' },
        { from: 'gate', to: 'fix', label: 'no' },
        { from: 'fix', to: 'push', label: 'new commit' }
      ],
      caption: 'Checks run from fastest to slowest, so a lint or unit failure is reported within minutes. The report is uploaded even when tests fail — exactly when you need its traces and screenshots.'
    },
    {
      t: 'matrix', title: 'Where a check belongs in CI',
      x: { label: 'Run time', ticks: ['Fast (minutes)', 'Slow (an hour or more)'] },
      y: { label: 'Reliability', ticks: ['Stable', 'Flaky'] },
      cells: [
        ['Gate every PR: smoke, unit, API', 'Merge to main or nightly, sharded'],
        ['Non-blocking job plus a fix ticket', 'Quarantine; fix or move down a layer']
      ],
      tones: [
        ['low', 'mid'],
        ['mid', 'high']
      ],
      caption: 'Gates only work if the team trusts them, so blocking suites must be small, fast and stable. A flaky check sits in a non-blocking job only while someone fixes it — never as a permanent home.'
    },
    {
      t: 'flowchart', title: 'Sharding the nightly run',
      nodes: [
        { id: 'sched', label: 'Nightly schedule', kind: 'start' },
        { id: 's1', label: 'Shard 1/4' },
        { id: 's2', label: 'Shard 2/4' },
        { id: 's3', label: 'Shard 3/4' },
        { id: 's4', label: 'Shard 4/4' },
        { id: 'blobs', label: 'Four blob-report artifacts', kind: 'io' },
        { id: 'mergejob', label: 'merge-reports --reporter html' },
        { id: 'report', label: 'One HTML report to triage', kind: 'end' }
      ],
      edges: [
        { from: 'sched', to: 's1' },
        { from: 'sched', to: 's2' },
        { from: 'sched', to: 's3' },
        { from: 'sched', to: 's4' },
        { from: 's1', to: 'blobs' },
        { from: 's2', to: 'blobs' },
        { from: 's3', to: 'blobs' },
        { from: 's4', to: 'blobs' },
        { from: 'blobs', to: 'mergejob' },
        { from: 'mergejob', to: 'report' }
      ],
      caption: 'Each shard runs a quarter of the suite on its own machine with --shard=N/4 and writes a blob report; fail-fast off lets every shard finish. A final job merges the blobs so the team triages in one place each morning.'
    }
  ],

  'au-bdd-api-visual': [
    {
      t: 'cycle', title: 'BDD is a conversation first',
      steps: ['Pick a user story', 'Three Amigos meet', 'Agree concrete examples', 'Write Gherkin scenarios', 'Automate steps (they fail)', 'Build the feature', 'Scenarios pass: living docs'],
      center: 'Shared understanding',
      caption: 'The value is the conversation between product, developer and tester before coding, using examples such as $50.00 versus $49.99 for free shipping. Gherkin written by testers alone after development is just extra syntax.'
    },
    {
      t: 'sequence', title: 'Hybrid test: arrange by API, assert in the UI',
      actors: ['Test', 'Browser', 'Orders API'],
      steps: [
        { from: 0, to: 2, label: 'POST /api/orders with a Bearer token' },
        { from: 2, to: 0, label: '201 Created + { id }', reply: true },
        { from: 0, to: 1, label: "page.goto('/account/orders')" },
        { from: 1, to: 2, label: 'GET the customer’s orders' },
        { from: 2, to: 1, label: 'list including the new id', reply: true },
        { from: 0, to: 1, label: "expect(row with id).toContainText('Pending')" },
        { from: 1, to: 0, label: 'retries until the row shows, then passes', reply: true }
      ],
      caption: 'Creating the order through the API takes milliseconds instead of a full checkout, and the browser is used only for what the customer sees. The checkout journey itself is still covered once, by a dedicated E2E test.'
    },
    {
      t: 'flowchart', title: 'How a screenshot comparison decides',
      nodes: [
        { id: 'shot', label: "toHaveScreenshot('order-summary.png')", kind: 'start' },
        { id: 'base', label: 'Baseline exists?', kind: 'decision' },
        { id: 'write', label: 'Fails and writes a new baseline' },
        { id: 'commit', label: 'Review the image, then commit it', kind: 'end' },
        { id: 'capture', label: 'Stable capture: animations off, masks' },
        { id: 'diff', label: 'Diff within the threshold?', kind: 'decision' },
        { id: 'pass', label: 'Pass', kind: 'end' },
        { id: 'intended', label: 'Intended UI change?', kind: 'decision' },
        { id: 'update', label: 'Review the diff, then --update-snapshots', kind: 'end' },
        { id: 'bug', label: 'Visual bug: report it', kind: 'end' }
      ],
      edges: [
        { from: 'shot', to: 'base' },
        { from: 'base', to: 'write', label: 'no' },
        { from: 'write', to: 'commit' },
        { from: 'base', to: 'capture', label: 'yes' },
        { from: 'capture', to: 'diff' },
        { from: 'diff', to: 'pass', label: 'yes' },
        { from: 'diff', to: 'intended', label: 'no' },
        { from: 'intended', to: 'update', label: 'yes' },
        { from: 'intended', to: 'bug', label: 'no' }
      ],
      caption: 'Baselines are browser- and OS-specific, so create and update them in the same environment as CI, such as one Docker image. Mask dynamic data like dates, and never run --update-snapshots without looking at each diff.'
    }
  ]

});
