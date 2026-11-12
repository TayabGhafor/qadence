# End-to-end checks

Browser checks used to verify the Qadence frontend. They need `playwright-core` and installed Playwright browsers (not part of the static site):

```bash
npm i -D playwright-core            # once, anywhere on your machine
npx playwright install chromium firefox
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist   # from the sqa-interview-practice folder
node tools/e2e/smoke.js http://127.0.0.1:8765/                   # regression: 22 checks
node tools/e2e/features.js http://127.0.0.1:8765/                # new features: 152 checks
BROWSER=firefox node tools/e2e/features.js http://127.0.0.1:8765/
```

Both scripts clear this site's localStorage in their own browser context; they never touch your normal browser profile.

The app scripts load right after first paint, so both scripts wait for `window.QadenceApp` (set when `js/app.js` has booted) after every navigation instead of relying on the load event.
