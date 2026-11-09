# SQA Practice Room

A browser-only SQA interview practice hub for early-career QA Engineers and QA Analysts. The site includes question practice, built-in simulated practice apps, an editable code workspace, submission scoring, weak-topic revision, and progress history.

## Run locally

Open `dist/index.html` in a modern browser. No build step or server is required.

## Demo login

- Username: `Admin`
- Password: `admin@123`

This shared demo login is public by design. It is a frontend navigation gate, not secure authentication. Do not reuse the password for another account.

## Local data

Sign-in state, interview answers, saved workspace drafts, challenge submissions, lab attempts, and progress are stored in this browser's local storage. They do not sync across browsers or devices. Clearing this site's browser storage removes the saved data. Passwords are not saved.

The practice targets use fictional, simulated data inside this page. Code submissions are stored and scored with a transparent heuristic rubric; the Site does not execute arbitrary submitted code. Learners can export submissions and run scripts locally using their own Playwright, Cypress, Selenium, or Postman setup.

## Open source

This project is released under the MIT License. See [LICENSE](LICENSE).
