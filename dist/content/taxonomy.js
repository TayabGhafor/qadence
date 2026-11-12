/* Qadence · curriculum taxonomy: the recommended learning sequence, concept groups for
   filtering, curated collections and prerequisites. Single source of truth for lesson order.
   Mapped against the ISTQB CTFL v4.0.1 syllabus and the topics most asked in QA interviews. */
QA_CONTENT.setTaxonomy({
  /* Recommended order inside each stage (stages themselves follow the career roadmap). */
  path: {
    foundations: ['fd-what-is-testing', 'fd-qa-qc-testing', 'fd-error-defect-failure', 'fd-test-process', 'fd-sdlc-models', 'fd-stlc', 'fd-levels-types', 'fd-static-testing', 'fd-agile-testing', 'fd-tdd-bdd', 'fd-maintenance', 'fd-risk-based'],
    manual: ['mt-requirements', 'mt-scenarios-cases', 'mt-equivalence', 'mt-boundary', 'mt-bug-reports', 'mt-tools', 'mt-decision-tables', 'mt-state-transition', 'mt-whitebox', 'mt-exploratory', 'mt-prioritization', 'mt-regression', 'mt-config-env', 'mt-pairwise', 'mt-planning'],
    'web-mobile': ['wm-web-basics', 'wm-devtools', 'wm-forms-ui', 'wm-cross-browser', 'wm-mobile-basics', 'wm-mobile-conditions', 'wm-devices', 'wm-usability-l10n'],
    'sql-api': ['sa-sql-basics', 'sa-api-basics', 'sa-sql-joins', 'sa-db-testing', 'sa-postman', 'sa-auth', 'sa-rest-soap', 'sa-api-negative', 'sa-sql-advanced', 'sa-mocking'],
    'code-git': ['cg-js-basics', 'cg-functions-data', 'cg-git', 'cg-async', 'cg-errors-debugging', 'cg-typescript', 'cg-oop', 'cg-collab', 'cg-coding-interview', 'cg-clean-tests'],
    automation: ['au-what-to-automate', 'au-playwright-basics', 'au-locators', 'au-waits', 'au-fixtures-data', 'au-frameworks', 'au-selenium', 'au-pom', 'au-flaky', 'au-ci', 'au-bdd-api-visual'],
    quality: ['qb-accessibility', 'qb-security', 'qb-performance', 'qb-nonfunctional', 'qb-perf-metrics', 'qb-privacy', 'qb-release', 'qb-prod-ai'],
    capstone: ['cp-portfolio', 'cp-resume', 'cp-interview-tech', 'cp-interview-behavioral', 'cp-metrics', 'cp-career']
  },
  /* Concept groups — every lesson belongs to exactly one. Used by the Learning Lab "Topics" view and filters. */
  groups: [
    { id: 'fundamentals', icon: 'compass', name: 'Testing fundamentals', desc: 'What testing is, quality, defects, principles, test levels and types, reviews.',
      lessons: ['fd-what-is-testing', 'fd-qa-qc-testing', 'fd-error-defect-failure', 'fd-test-process', 'fd-levels-types', 'fd-static-testing'] },
    { id: 'process', icon: 'route', name: 'SDLC, Agile & DevOps', desc: 'Lifecycles, the STLC, Scrum, test-first development and maintenance.',
      lessons: ['fd-sdlc-models', 'fd-stlc', 'fd-agile-testing', 'fd-tdd-bdd', 'fd-maintenance'] },
    { id: 'design', icon: 'puzzle', name: 'Test design techniques', desc: 'From requirements to sharp test cases: black-box, white-box and experience-based techniques.',
      lessons: ['mt-requirements', 'mt-scenarios-cases', 'mt-equivalence', 'mt-boundary', 'mt-decision-tables', 'mt-state-transition', 'mt-whitebox', 'mt-exploratory', 'mt-pairwise', 'mt-prioritization'] },
    { id: 'management', icon: 'clipboard', name: 'Test management & defects', desc: 'Bug life cycle, tools, regression, environments, planning, risk, metrics and release decisions.',
      lessons: ['mt-bug-reports', 'mt-tools', 'mt-regression', 'mt-config-env', 'mt-planning', 'fd-risk-based', 'cp-metrics', 'qb-release'] },
    { id: 'web-mobile', icon: 'phone', name: 'Web & mobile testing', desc: 'How the web works, DevTools, forms, browsers, devices and localisation.',
      lessons: ['wm-web-basics', 'wm-devtools', 'wm-forms-ui', 'wm-cross-browser', 'wm-mobile-basics', 'wm-mobile-conditions', 'wm-devices', 'wm-usability-l10n'] },
    { id: 'api-data', icon: 'plug', name: 'APIs & databases', desc: 'REST, SOAP and GraphQL, Postman, auth, contracts, mocks and SQL from basics to interview queries.',
      lessons: ['sa-sql-basics', 'sa-api-basics', 'sa-sql-joins', 'sa-db-testing', 'sa-postman', 'sa-auth', 'sa-rest-soap', 'sa-api-negative', 'sa-sql-advanced', 'sa-mocking'] },
    { id: 'code', icon: 'code', name: 'Programming & Git', desc: 'JavaScript/TypeScript, OOP, async code, debugging, Git and coding interview exercises.',
      lessons: ['cg-js-basics', 'cg-functions-data', 'cg-git', 'cg-async', 'cg-errors-debugging', 'cg-typescript', 'cg-oop', 'cg-collab', 'cg-coding-interview', 'cg-clean-tests'] },
    { id: 'automation', icon: 'rocket', name: 'Test automation & CI/CD', desc: 'Playwright and Selenium, locators, waits, fixtures, POM, flaky tests, CI pipelines, BDD and visual tests.',
      lessons: ['au-what-to-automate', 'au-playwright-basics', 'au-locators', 'au-waits', 'au-fixtures-data', 'au-frameworks', 'au-selenium', 'au-pom', 'au-flaky', 'au-ci', 'au-bdd-api-visual'] },
    { id: 'nonfunctional', icon: 'gauge', name: 'Performance, security & accessibility', desc: 'Non-functional quality: accessibility, security, performance, reliability, privacy and AI features.',
      lessons: ['qb-accessibility', 'qb-security', 'qb-performance', 'qb-nonfunctional', 'qb-perf-metrics', 'qb-privacy', 'qb-prod-ai'] },
    { id: 'career', icon: 'briefcase', name: 'Career & interviews', desc: 'Portfolio, resume, technical and behavioural interviews, career paths.',
      lessons: ['cp-portfolio', 'cp-resume', 'cp-interview-tech', 'cp-interview-behavioral', 'cp-career'] }
  ],
  /* Curated collections (a lesson can be in several). */
  collections: [
    { id: 'istqb', icon: 'medal', name: 'ISTQB Foundation prep', desc: 'Lessons mapped to the six chapters of the ISTQB CTFL v4.0 syllabus.',
      lessons: ['fd-what-is-testing', 'fd-qa-qc-testing', 'fd-error-defect-failure', 'fd-test-process', 'fd-sdlc-models', 'fd-stlc', 'fd-levels-types', 'fd-agile-testing', 'fd-tdd-bdd', 'fd-maintenance', 'fd-static-testing', 'mt-requirements', 'mt-equivalence', 'mt-boundary', 'mt-decision-tables', 'mt-state-transition', 'mt-whitebox', 'mt-exploratory', 'mt-prioritization', 'mt-regression', 'mt-planning', 'fd-risk-based', 'mt-config-env', 'mt-bug-reports', 'mt-tools', 'au-what-to-automate'] },
    { id: 'interview', icon: 'mic', name: 'Interview essentials', desc: 'The topics interviewers ask about most for QA Analyst, QA Engineer and SDET roles.',
      lessons: ['fd-qa-qc-testing', 'fd-sdlc-models', 'fd-stlc', 'fd-levels-types', 'fd-static-testing', 'fd-agile-testing', 'mt-scenarios-cases', 'mt-equivalence', 'mt-boundary', 'mt-bug-reports', 'mt-regression', 'mt-planning', 'mt-tools', 'sa-api-basics', 'sa-auth', 'sa-postman', 'sa-rest-soap', 'sa-sql-joins', 'sa-sql-advanced', 'au-locators', 'au-waits', 'au-selenium', 'au-pom', 'au-frameworks', 'au-flaky', 'cg-oop', 'cg-coding-interview', 'qb-performance', 'qb-security', 'cp-interview-tech', 'cp-interview-behavioral'] },
    { id: 'manual-path', icon: 'list-checks', name: 'Manual QA path', desc: 'A focused route for QA Analyst / manual tester roles.',
      lessons: ['fd-what-is-testing', 'fd-qa-qc-testing', 'fd-error-defect-failure', 'fd-sdlc-models', 'fd-stlc', 'fd-levels-types', 'fd-agile-testing', 'mt-requirements', 'mt-scenarios-cases', 'mt-equivalence', 'mt-boundary', 'mt-bug-reports', 'mt-tools', 'mt-decision-tables', 'mt-state-transition', 'mt-exploratory', 'mt-regression', 'wm-web-basics', 'wm-devtools', 'wm-forms-ui', 'wm-mobile-basics', 'sa-api-basics', 'sa-sql-basics', 'qb-accessibility', 'cp-portfolio', 'cp-interview-tech'] },
    { id: 'automation-path', icon: 'rocket', name: 'Automation / SDET path', desc: 'Code, APIs and frameworks for automation engineer and SDET roles.',
      lessons: ['au-what-to-automate', 'cg-js-basics', 'cg-functions-data', 'cg-git', 'cg-async', 'cg-typescript', 'cg-oop', 'cg-coding-interview', 'sa-api-basics', 'sa-postman', 'sa-auth', 'sa-api-negative', 'sa-sql-joins', 'au-playwright-basics', 'au-locators', 'au-waits', 'au-fixtures-data', 'au-selenium', 'au-pom', 'au-flaky', 'au-ci', 'au-bdd-api-visual', 'cg-clean-tests', 'qb-perf-metrics'] }
  ],
  /* Helpful prerequisites ("before this lesson"). */
  requires: {
    'mt-boundary': ['mt-equivalence'], 'mt-decision-tables': ['mt-equivalence'], 'mt-state-transition': ['mt-scenarios-cases'], 'mt-whitebox': ['fd-levels-types'],
    'mt-pairwise': ['mt-decision-tables'], 'mt-regression': ['mt-bug-reports'], 'mt-planning': ['fd-stlc', 'fd-risk-based'], 'mt-prioritization': ['fd-risk-based'],
    'fd-stlc': ['fd-sdlc-models'], 'fd-tdd-bdd': ['fd-agile-testing'], 'fd-maintenance': ['fd-levels-types'], 'fd-risk-based': ['fd-error-defect-failure'],
    'sa-sql-joins': ['sa-sql-basics'], 'sa-db-testing': ['sa-sql-joins'], 'sa-sql-advanced': ['sa-sql-joins'], 'sa-postman': ['sa-api-basics'], 'sa-auth': ['sa-api-basics'],
    'sa-rest-soap': ['sa-api-basics'], 'sa-api-negative': ['sa-postman'], 'sa-mocking': ['sa-api-negative'],
    'cg-async': ['cg-functions-data'], 'cg-typescript': ['cg-functions-data'], 'cg-oop': ['cg-functions-data'], 'cg-coding-interview': ['cg-functions-data'], 'cg-clean-tests': ['cg-oop'],
    'au-playwright-basics': ['cg-async'], 'au-locators': ['wm-devtools'], 'au-waits': ['au-playwright-basics'], 'au-fixtures-data': ['au-playwright-basics'], 'au-selenium': ['au-locators'],
    'au-pom': ['cg-oop', 'au-playwright-basics'], 'au-flaky': ['au-waits'], 'au-ci': ['cg-git'], 'au-bdd-api-visual': ['fd-tdd-bdd', 'sa-postman'],
    'wm-cross-browser': ['wm-web-basics'], 'wm-mobile-conditions': ['wm-mobile-basics'], 'wm-devices': ['wm-mobile-basics'],
    'qb-perf-metrics': ['qb-performance'], 'qb-release': ['fd-risk-based'], 'cp-interview-tech': ['cp-resume']
  }
});
