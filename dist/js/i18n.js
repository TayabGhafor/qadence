/* Qadence · i18n engine. English is primary and the source of truth: any key missing in
   another language falls back to English, so partial translations never break a screen.
   Other languages are added by js/i18n-dict.js via QA_I18N.add(code, {...}). */
window.QA_I18N = (function () {
  'use strict';
  const PREFS = 'sqaPracticeRoom.prefs.v1';
  const langs = [
    { code: 'en', name: 'English', native: 'English', dir: 'ltr', short: 'EN' },
    { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl', short: 'اردو' },
    { code: 'ur-Latn', name: 'Roman Urdu', native: 'Roman Urdu', dir: 'ltr', short: 'RU' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr', short: 'हि' },
    { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl', short: 'ع' },
    { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr', short: 'ES' },
    { code: 'fr', name: 'French', native: 'Français', dir: 'ltr', short: 'FR' },
    { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr', short: 'DE' },
    { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr', short: 'PT' },
    { code: 'zh', name: 'Chinese', native: '中文', dir: 'ltr', short: '中' },
    { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr', short: '日' },
    { code: 'ko', name: 'Korean', native: '한국어', dir: 'ltr', short: '한' }
  ];
  const dict = { en: {} };
  let lang = 'en';
  try { const p = JSON.parse(localStorage.getItem(PREFS) || 'null'); if (p && langs.some(l => l.code === p.lang)) lang = p.lang; } catch (e) {}

  function add(code, entries) { dict[code] = Object.assign(dict[code] || {}, entries || {}); }
  function t(key, vars) {
    let s = (dict[lang] && dict[lang][key]) || dict.en[key];
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }
  /* Pluralised helper: t2('lessons', n) uses key "lessons.one" / "lessons.other". */
  function tn(key, n, vars) { return t(`${key}.${n === 1 ? 'one' : 'other'}`, Object.assign({ n }, vars || {})); }
  function info(code) { return langs.find(l => l.code === (code || lang)) || langs[0]; }
  function apply(root) {
    const r = root || document;
    r.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-i18n-en')) el.setAttribute('data-i18n-en', el.textContent);
      if (!dict.en[k]) dict.en[k] = el.getAttribute('data-i18n-en');
      el.textContent = t(k);
    });
    r.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.getAttribute('data-i18n-placeholder'); if (!dict.en[k]) dict.en[k] = el.getAttribute('placeholder') || ''; el.setAttribute('placeholder', t(k)); });
    r.querySelectorAll('[data-i18n-aria]').forEach(el => { const k = el.getAttribute('data-i18n-aria'); if (!dict.en[k]) dict.en[k] = el.getAttribute('aria-label') || ''; el.setAttribute('aria-label', t(k)); });
  }
  function setDocLang() {
    const l = info();
    document.documentElement.setAttribute('lang', l.code);
    document.documentElement.setAttribute('dir', l.dir);
    document.querySelectorAll('[data-lang-label]').forEach(el => { el.textContent = l.short; });
  }
  function set(code) {
    if (!langs.some(l => l.code === code)) return;
    lang = code;
    try { const p = JSON.parse(localStorage.getItem(PREFS) || 'null') || {}; p.lang = code; localStorage.setItem(PREFS, JSON.stringify(p)); } catch (e) {}
    setDocLang(); apply();
    document.dispatchEvent(new CustomEvent('qa:lang', { detail: { lang: code } }));
  }
  return { langs, dict, add, t, tn, apply, set, info, setDocLang, get lang() { return lang; } };
})();
window.t = window.QA_I18N.t;
window.tn = window.QA_I18N.tn;

/* English UI strings for dynamic views (static markup strings are read from the HTML itself). */
QA_I18N.add('en', {
  'lvl.beginner': 'Beginner', 'lvl.intermediate': 'Intermediate', 'lvl.advanced': 'Advanced', 'lvl.all': 'All levels',
  'stage.foundations': 'QA foundations', 'stage.manual': 'Manual testing', 'stage.web-mobile': 'Web & mobile', 'stage.sql-api': 'SQL & APIs',
  'stage.code-git': 'Code & Git', 'stage.automation': 'Automation & CI', 'stage.quality': 'Quality breadth', 'stage.capstone': 'Career & capstone',
  'common.min': '{n} min', 'common.start': 'Start', 'common.continue': 'Continue', 'common.resume': 'Resume', 'common.review': 'Review', 'common.retry': 'Try again',
  'common.next': 'Next', 'common.previous': 'Previous', 'common.back': 'Back', 'common.close': 'Close', 'common.save': 'Save', 'common.saved': 'Saved',
  'common.cancel': 'Cancel', 'common.done': 'Done', 'common.complete': 'Complete', 'common.completed': 'Completed', 'common.inProgress': 'In progress',
  'common.notStarted': 'Not started', 'common.viewAll': 'View all', 'common.open': 'Open', 'common.check': 'Check', 'common.reveal': 'Show answer',
  'common.hide': 'Hide answer', 'common.hint': 'Hint', 'common.score': 'Score', 'common.correct': 'Correct', 'common.incorrect': 'Not quite',
  'common.questions': '{n} questions', 'common.of': '{a} of {b}', 'common.xp': '{n} XP', 'common.level': 'Level {n}', 'common.all': 'All',
  'common.lessons.one': '{n} lesson', 'common.lessons.other': '{n} lessons', 'common.search': 'Search', 'common.new': 'New', 'common.edit': 'Edit',
  'common.delete': 'Delete', 'common.yes': 'Yes', 'common.no': 'No', 'common.today': 'Today', 'common.none': 'None yet',
  'dash.greetMorning': 'Good morning, {name}', 'dash.greetAfternoon': 'Good afternoon, {name}', 'dash.greetEvening': 'Good evening, {name}',
  'dash.sub': 'Small steps every day add up. Here is what to do next.', 'dash.continue': 'Continue learning', 'dash.startHere': 'Start here',
  'dash.nextLesson': 'Up next', 'dash.levelProgress': 'Level progress', 'dash.streak': 'Day streak', 'dash.weekly': 'Weekly goal',
  'dash.lessonsDone': 'Lessons completed', 'dash.testsTaken': 'Tests taken', 'dash.avgScore': 'Average test score', 'dash.drillsDone': 'Drills solved',
  'dash.byLevel': 'Your path by level', 'dash.recommended': 'Recommended for you', 'dash.activity': 'Activity', 'dash.recentTests': 'Recent test results',
  'dash.badges': 'Badges', 'dash.quick': 'Quick actions', 'dash.weak': 'Topics to revisit', 'dash.noWeak': 'No weak topics yet — take a test to find them.',
  'dash.goalText': '{done} of {goal} lessons this week', 'dash.allBadges': 'All badges',
  'acad.title': 'Learning Lab', 'acad.sub': 'Every SQA concept from beginner to advanced. Learn it, see it, practise it, then check yourself.',
  'acad.searchPh': 'Filter lessons…', 'acad.stage': 'Stage {n}', 'acad.moduleTest': 'Stage quiz', 'acad.roadmapGuide': 'Roadmap guide',
  'acad.objectives': 'What you will learn', 'acad.learn': 'Learn', 'acad.example': 'Worked example', 'acad.explainIn': 'Explained in {lang}',
  'acad.explainPick': 'Simple explanation in', 'acad.keyTerms': 'Key terms', 'acad.practice': 'Practice', 'acad.quiz': 'Quick check',
  'acad.interview': 'Interview corner', 'acad.takeaways': 'Key takeaways', 'acad.notes': 'My notes', 'acad.notesPh': 'Write what you learned, questions to ask, or evidence to save…',
  'acad.markComplete': 'Mark lesson complete', 'acad.completed': 'Lesson completed', 'acad.nextLesson': 'Next lesson', 'acad.prevLesson': 'Previous lesson',
  'acad.relatedPractice': 'Practise this', 'acad.yourAnswer': 'Your answer (optional)', 'acad.gotIt': 'I got it', 'acad.reviewLater': 'Review later',
  'acad.quizScore': '{a} of {b} correct', 'acad.bookmark': 'Bookmark', 'acad.bookmarked': 'Bookmarked', 'acad.onThisPage': 'On this page',
  'acad.inStage': 'In this stage', 'acad.noResults': 'No lessons match your filters.', 'acad.levelFilter': 'Level',
  'tests.title': 'Test Center', 'tests.sub': 'Check what you know with stage quizzes, level exams and scenario-based case studies. Every answer is explained.',
  'tests.quick': 'Quick quiz', 'tests.stage': 'Stage quizzes', 'tests.level': 'Level exams', 'tests.scenario': 'Scenario tests', 'tests.custom': 'Build your own test',
  'tests.history': 'Test history', 'tests.start': 'Start test', 'tests.timed': 'Timed', 'tests.untimed': 'Untimed', 'tests.submit': 'Submit test',
  'tests.question': 'Question {a} of {b}', 'tests.flag': 'Flag for review', 'tests.flagged': 'Flagged', 'tests.result': 'Your result', 'tests.passed': 'Passed',
  'tests.failed': 'Keep practising', 'tests.reviewAnswers': 'Review answers', 'tests.byTopic': 'By topic', 'tests.retake': 'Retake', 'tests.newTest': 'New test',
  'tests.selectAll': 'Select all that apply', 'tests.levelExam': '{level} exam', 'tests.answered': '{a}/{b} answered', 'tests.timeLeft': 'Time left', 'tests.passMark': 'Pass mark {n}%', 'tests.unanswered': '{n} unanswered',
  'drills.title': 'Practice drills', 'drills.sub': 'Short interactive exercises: sort, order, spot and fill. Instant feedback, unlimited retries.',
  'drills.classify': 'Sort it', 'drills.order': 'Put in order', 'drills.spot': 'Spot the flaw', 'drills.fill': 'Fill the blank', 'drills.checkAnswers': 'Check answers',
  'drills.best': 'Best {n}%', 'drills.moveUp': 'Move up', 'drills.moveDown': 'Move down',
  'prof.title': 'Profile', 'prof.sub': 'Your learner profile, goals and preferences. Saved only in this browser.', 'prof.name': 'Display name',
  'prof.role': 'Target role', 'prof.levelSelf': 'Experience level', 'prof.goal': 'Weekly lesson goal', 'prof.bio': 'About me', 'prof.avatar': 'Avatar colour',
  'prof.language': 'Explanation language', 'prof.theme': 'Theme', 'prof.themeLight': 'Light', 'prof.themeDark': 'Dark', 'prof.themeSystem': 'System',
  'prof.profiles': 'Learner profiles on this device', 'prof.addProfile': 'Add profile', 'prof.switch': 'Switch', 'prof.active': 'Active',
  'prof.saved': 'Profile saved.', 'prof.memberSince': 'Learning since {date}', 'prof.achievements': 'Achievements',
  'progress.title': 'Progress', 'progress.sub': 'Everything you have learned, practised and tested — in one place.',
  'settings.title': 'Data & privacy', 'settings.sub': 'Know exactly what this site keeps, and manage your learning records.',
  'search.empty': 'No matches. Try another word.',
  'iv.title': 'Ace your QA interview', 'iv.tabBank': 'Question bank', 'iv.tabFlash': 'Flashcards', 'iv.tabMock': 'Mock interview', 'iv.tabRounds': 'Practice rounds', 'iv.confident': '{n} confident', 'iv.shortAnswer': 'Short answer', 'iv.modelAnswer': 'Model answer', 'iv.followups': 'Follow-ups to expect', 'iv.avoid': 'Avoid saying', 'iv.reviewLater': 'Review later', 'iv.imConfident': 'I’m confident', 'iv.howConfident': 'How confident are you?', 'iv.topAsked': 'Top {n} most asked', 'iv.showAnswer': 'Show answer', 'iv.stillLearning': 'Still learning', 'iv.knewIt': 'I knew it', 'iv.startMock': 'Start mock interview', 'iv.veryCommon': 'Very common', 'iv.common': 'Common', 'iv.occasional': 'Occasional', 'acad.viewPath': 'Path', 'acad.viewTopics': 'Topics', 'acad.viewMap': 'Concept map', 'acad.visualGuide': 'Visual guide', 'acad.simpleExplanation': 'Simple explanation', 'acad.beforeStart': 'Before you start', 'acad.step': 'Step {a} of {b}', 'acad.allTopics': 'All topics', 'acad.sections': 'Sections', 'acad.visuals': 'Visuals', 'acad.languages': 'Languages',
  'ob.eyebrow': 'Welcome to Qadence', 'ob.title': 'Let’s personalise your learning', 'ob.sub': 'Takes 20 seconds. Everything stays in this browser.', 'ob.name': 'What should we call you?', 'ob.namePh': 'Your name', 'ob.choose': 'Choose…', 'ob.level': 'Where are you starting?', 'ob.perWeek': '{n} lessons / week', 'ob.start': 'Start my path', 'ob.skip': 'Skip for now', 'search.lessons': 'Lessons', 'search.drills': 'Drills', 'search.tests': 'Scenario tests'
});
