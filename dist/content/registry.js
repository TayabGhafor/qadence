/* Qadence · content registry.
   Every content file is a classic <script> (works from file:// with no server) that
   registers itself here. English is the source of truth; `explain` adds simple
   explanations in other languages. Nothing in content files runs at render time. */
window.QA_CONTENT = (function () {
  'use strict';
  const C = { lessons: [], bank: [], drills: [], scenarios: [], interview: [], explain: {}, visuals: {}, taxonomy: null };
  const tag = (stage, item) => Object.assign({ stage }, item);
  C.addLessons = (stage, list) => { (list || []).forEach(l => C.lessons.push(tag(stage, l))); };
  C.addBank = (stage, list) => { (list || []).forEach(q => C.bank.push(tag(stage, q))); };
  C.addDrills = (stage, list) => { (list || []).forEach(d => C.drills.push(tag(stage, d))); };
  C.addScenarios = list => { (list || []).forEach(s => C.scenarios.push(s)); };
  /* Interview question bank (Interview prep → Question bank). */
  C.addInterview = list => { (list || []).forEach(q => C.interview.push(q)); };
  /* Extra explanation languages kept in their own files: addExplain('zh', { lessonId: 'text', … }). */
  C.addExplain = (lang, map) => { C.explain[lang] = Object.assign(C.explain[lang] || {}, map || {}); };
  /* Visual guides per lesson: addVisuals({ lessonId: [diagram blocks] }). */
  C.addVisuals = map => { for (const [id, list] of Object.entries(map || {})) C.visuals[id] = (C.visuals[id] || []).concat(list || []); };
  C.setTaxonomy = tx => { C.taxonomy = tx; };
  /* Merge per-language explanations and visuals into the lesson objects (called once by core.js). */
  C.finalize = () => {
    if (C.finalized) return; C.finalized = true;
    const byId = new Map(C.lessons.map(l => [l.id, l]));
    for (const [lang, map] of Object.entries(C.explain)) for (const [id, text] of Object.entries(map)) { const l = byId.get(id); if (l) { l.explain = l.explain || {}; if (!l.explain[lang]) l.explain[lang] = text; } }
    for (const [id, list] of Object.entries(C.visuals)) { const l = byId.get(id); if (l) l.visuals = (l.visuals || []).concat(list); }
  };
  return C;
})();
