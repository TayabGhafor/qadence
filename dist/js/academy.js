/* Qadence · Learning Lab: catalog, stage pages and lessons.
   Routes: #/academy · #/academy/level/<lvl> · #/academy/stage/<id> · #/academy/lesson/<id> */
(function () {
  'use strict';
  const esc = s => escapeHtml(s == null ? '' : s);
  const root = $id('academy');
  const ROADMAP = window.SQA_LEARNING || { stages: [] };
  const roadStage = id => ROADMAP.stages.find(s => s.id === id);
  const ac = () => state.academy;
  const EXPLAIN_LANGS = QA_I18N.langs.filter(l => l.code !== 'en');
  const filter = { level: 'all', q: '', show: 'all', group: 'all', coll: 'all', view: 'path' };
  let observer = null, scrollHandler = null;

  function status(l) {
    const a = ac();
    if (a.completed[l.id]) return 'done';
    if (a.seen[l.id] || a.quiz[l.id] || a.notes[l.id] || a.practice[l.id]) return 'prog';
    return 'new';
  }
  const statusLabel = s => s === 'done' ? `<span class="lc-status done">${icon('check-circle', 'ic-sm')}${esc(t('common.completed'))}</span>` : s === 'prog' ? `<span class="lc-status prog">${icon('circle-dot', 'ic-sm')}${esc(t('common.inProgress'))}</span>` : `<span class="lc-status">${icon('circle', 'ic-sm')}${esc(t('common.notStarted'))}</span>`;

  /* ───────────── content blocks ───────────── */
  const KW = {
    js: 'const|let|var|function|return|await|async|if|else|for|of|in|new|import|from|export|default|class|extends|try|catch|throw|typeof|interface|type|enum|readonly|private|public|true|false|null|undefined|this',
    sql: 'SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|FULL|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|AS|AND|OR|NOT|IN|IS|NULL|COUNT|SUM|AVG|MIN|MAX|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DISTINCT|BETWEEN|LIKE|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DESC|ASC|CASE|WHEN|THEN|ELSE|END',
    gherkin: 'Feature|Scenario|Scenario Outline|Background|Examples|Given|When|Then|And|But',
    http: 'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|HTTP',
    python: 'def|return|import|from|as|if|elif|else|for|in|while|with|class|try|except|raise|True|False|None|and|or|not|assert|lambda|await|async',
    java: 'public|private|protected|class|void|static|final|new|return|if|else|for|while|try|catch|throw|import|package|extends|implements|true|false|null|this',
    yaml: 'true|false|null', bash: 'npm|npx|git|cd|echo|export|if|then|fi|run'
  };
  function highlight(code, lang) {
    const kwSrc = KW[lang === 'ts' ? 'js' : lang];
    const comment = /^(sql)$/.test(lang) ? '--[^\\n]*' : /^(python|bash|yaml)$/.test(lang) ? '#[^\\n]*' : /^(js|ts|java)$/.test(lang) ? '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/' : null;
    if (lang === 'text' || (!kwSrc && !comment)) return esc(code);
    const parts = [];
    if (comment) parts.push(`(${comment})`); else parts.push('(\\u0000)');
    parts.push(`("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*'|\`(?:\\\\.|[^\`\\\\])*\`)`);
    parts.push(kwSrc ? `\\b(${kwSrc})\\b` : '(\\u0000)');
    parts.push('\\b(\\d+(?:\\.\\d+)?)\\b');
    const re = new RegExp(parts.join('|'), lang === 'sql' ? 'gi' : 'g');
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? 'tok-c' : m[2] ? 'tok-s' : m[3] ? 'tok-k' : 'tok-n';
      out += `<span class="${cls}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }
  const LANG_LABEL = { ts: 'TypeScript', js: 'JavaScript', sql: 'SQL', http: 'HTTP', json: 'JSON', gherkin: 'Gherkin', text: 'Text', bash: 'Terminal', python: 'Python', java: 'Java', yaml: 'YAML' };
  function codeBlock(b) {
    return `<figure class="codeblock" dir="ltr"><div class="codeblock-head"><span class="row" style="gap:10px"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(b.title || LANG_LABEL[b.lang] || b.lang)}</span></span><button class="icon-btn copy" type="button" data-copy aria-label="Copy code">${icon('copy', 'ic-sm')}</button></div><pre tabindex="0"><code>${highlight(b.code, b.lang)}</code></pre></figure>`;
  }
  const CALLOUT_ICON = { tip: 'bulb', warn: 'alert', info: 'info', key: 'key' };
  function blocks(list) {
    return (list || []).map(b => {
      switch (b.t) {
        case 'p': return `<p>${rich(b.html)}</p>`;
        case 'h': return `<h3>${esc(b.text)}</h3>`;
        case 'list': { const tag = b.ordered ? 'ol' : 'ul'; return `<${tag}>${b.items.map(i => `<li>${rich(i)}</li>`).join('')}</${tag}>`; }
        case 'callout': return `<div class="callout callout-${b.tone}">${icon(CALLOUT_ICON[b.tone] || 'info')}<div><b class="title">${esc(b.title)}</b>${rich(b.html)}</div></div>`;
        case 'table': return `<figure><div class="tbl-wrap"><table class="tbl">${b.caption ? `<caption>${esc(b.caption)}</caption>` : ''}<thead><tr>${b.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${rich(String(c))}</th>` : `<td>${rich(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></figure>`;
        case 'code': return codeBlock(b);
        case 'flow': return `<figure class="flow-box"><div class="flow" role="list">${b.steps.map((s, i) => `<div class="flow-step" role="listitem"><i aria-hidden="true">${i + 1}</i><span><span class="sr-only">Step ${i + 1}: </span>${esc(s)}</span></div>`).join('')}</div>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
        case 'compare': return `<div class="compare">${['a', 'b'].map(k => `<div><h4>${esc(b[k].title)}</h4><ul>${b[k].items.map(i => `<li>${rich(i)}</li>`).join('')}</ul></div>`).join('')}</div>`;
        case 'cards': return `<div class="mini-cards">${b.items.map(c => `<div><b>${esc(c.title)}</b>${rich(c.html)}</div>`).join('')}</div>`;
        default: return (window.QA_DIAGRAMS && QA_DIAGRAMS.types.includes(b.t)) ? QA_DIAGRAMS.render(b) : '';
      }
    }).join('');
  }
  QA.renderBlocks = blocks;
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const code = b.closest('.codeblock')?.querySelector('code')?.textContent || '';
    try { await navigator.clipboard.writeText(code); toast('Code copied.', 'copy'); } catch { toast('Copy is not available here — select the code instead.', 'info'); }
  });

  /* ───────────── catalog ───────────── */
  function lessonProgress(l) {
    const a = ac(); if (a.completed[l.id]) return 100;
    let p = a.seen[l.id] ? 12 : 0;
    p += (a.quiz[l.id] ? Object.keys(a.quiz[l.id]).length : 0) / l.quiz.length * 45;
    p += (a.practice[l.id] ? Object.keys(a.practice[l.id]).length : 0) / l.practice.length * 30;
    if (a.notes[l.id]) p += 8;
    return Math.min(95, Math.round(p));
  }
  function lessonCard(l) {
    const s = status(l);
    return `<button type="button" class="lesson-card ${s === 'done' ? 'done' : ''}" data-go="academy/lesson/${l.id}" style="${stageStyle(l.stage)}">
      <span class="lc-top"><span class="lc-seq" title="Step ${l.seq} of ${LESSONS.length} in the recommended path">${String(l.seq).padStart(2, '0')}</span>${lvlBadge(l.level)}</span>
      <h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p>
      <span class="lc-foot"><span>${icon('clock', 'ic-xs')}${esc(t('common.min', { n: l.minutes }))}${ac().bookmarks.includes(l.id) ? ` · ${icon('bookmark', 'ic-xs')}` : ''}</span>${statusLabel(s)}</span>
      ${s === 'prog' ? `<span class="lc-prog" style="--p:${lessonProgress(l)}%"></span>` : ''}
    </button>`;
  }
  function matches(l) {
    if (filter.level !== 'all' && l.level !== filter.level) return false;
    if (filter.group !== 'all' && (GROUP_OF.get(l.id) || {}).id !== filter.group) return false;
    if (filter.coll !== 'all') { const c = COLLECTIONS.find(x => x.id === filter.coll); if (!c || !c.lessons.includes(l.id)) return false; }
    const s = status(l);
    if (filter.show === 'new' && s !== 'new') return false;
    if (filter.show === 'prog' && s !== 'prog') return false;
    if (filter.show === 'done' && s !== 'done') return false;
    if (filter.show === 'saved' && !ac().bookmarks.includes(l.id)) return false;
    if (filter.q) { const hay = (l.title + ' ' + l.summary + ' ' + (l.keyTerms || []).map(k => k.term).join(' ')).toLowerCase(); if (!filter.q.split(/\s+/).every(w => hay.includes(w))) return false; }
    return true;
  }
  function renderCatalog() {
    const st = computeStats();
    const overall = st.totalLessons ? Math.round(st.completed / st.totalLessons * 100) : 0;
    const visCount = LESSONS.reduce((n, l) => n + (l.visuals || []).length, 0);
    root.innerHTML = `
<section class="acad-hero">
  <div><span class="eyebrow">${icon('book', 'ic-sm')}${esc(t('nav.groupLearn'))}</span><h1>${esc(t('acad.title'))}</h1><p>${esc(t('acad.sub'))}</p>
    <div class="acad-hero-stats"><div><b>${LESSONS.length}</b><span>lessons</span></div><div><b>${GROUPS.length}</b><span>topic groups</span></div><div><b>${visCount}</b><span>visual guides</span></div><div><b>${QUESTION_POOL.length}</b><span>MCQs</span></div><div><b>${QA_I18N.langs.length}</b><span>languages</span></div></div>
  </div>
  <div class="ring" style="--size:128px">${ringSvg(overall, 128, 11)}<div class="ring-label"><b>${overall}%</b><span>${esc(t('common.of', { a: st.completed, b: st.totalLessons }))}</span></div></div>
</section>
<div class="acad-collections" role="group" aria-label="Collections">
  ${COLLECTIONS.map(c => { const done = c.lessons.filter(id => ac().completed[id]).length; return `<button type="button" class="coll-card${filter.coll === c.id ? ' on' : ''}" data-coll="${c.id}" aria-pressed="${filter.coll === c.id}"><span class="tile tile-sm">${icon(c.icon)}</span><span class="coll-body"><b>${esc(c.name)}</b><small>${c.lessons.length} lessons · ${done} done</small></span>${barHtml(c.lessons.length ? done / c.lessons.length * 100 : 0, c.name, 'bar-sm')}</button>`; }).join('')}
</div>
<div class="filterbar" role="search">
  <div class="seg" role="group" aria-label="View">${[['path', 'route', t('acad.viewPath')], ['topics', 'layers', t('acad.viewTopics')], ['map', 'compass', t('acad.viewMap')]].map(([v, ic, l]) => `<button type="button" data-view="${v}" aria-pressed="${filter.view === v}">${icon(ic, 'ic-sm')}${esc(l)}</button>`).join('')}</div>
  <div class="seg" role="group" aria-label="${esc(t('acad.levelFilter'))}">${['all', ...LEVELS].map(lv => `<button type="button" data-lvl="${lv}" aria-pressed="${filter.level === lv}">${lv === 'all' ? icon('layers', 'ic-sm') : icon(LEVEL_ICON[lv], 'ic-sm')}${esc(t(lv === 'all' ? 'lvl.all' : 'lvl.' + lv))}</button>`).join('')}</div>
  <label class="sr-only" for="acadGroup">Topic group</label><select class="select" id="acadGroup" style="width:auto"><option value="all">${esc(t('acad.allTopics'))}</option>${GROUPS.map(g => `<option value="${g.id}"${filter.group === g.id ? ' selected' : ''}>${esc(g.name)}</option>`).join('')}</select>
  <label class="sr-only" for="acadShow">Show</label><select class="select" id="acadShow" style="width:auto">${[['all', 'All lessons'], ['new', t('common.notStarted')], ['prog', t('common.inProgress')], ['done', t('common.completed')], ['saved', t('acad.bookmarked')]].map(([v, l]) => `<option value="${v}"${filter.show === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>
  <div class="input-icon">${icon('search')}<label class="sr-only" for="acadFilter">${esc(t('acad.searchPh'))}</label><input class="input" id="acadFilter" type="search" placeholder="${esc(t('acad.searchPh'))}" value="${esc(filter.q)}"></div>
</div>
<p class="filter-summary" id="acadSummary" role="status" aria-live="polite"></p>
<div id="acadList"></div>`;
    renderList();
    const rerender = () => renderList();
    root.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { filter.view = b.dataset.view; root.querySelectorAll('[data-view]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); rerender(); }));
    root.querySelectorAll('[data-lvl]').forEach(b => b.addEventListener('click', () => { filter.level = b.dataset.lvl; root.querySelectorAll('[data-lvl]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); rerender(); }));
    root.querySelectorAll('[data-coll]').forEach(b => b.addEventListener('click', () => { filter.coll = filter.coll === b.dataset.coll ? 'all' : b.dataset.coll; root.querySelectorAll('[data-coll]').forEach(x => { const on = x.dataset.coll === filter.coll; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); rerender(); }));
    $id('acadGroup').addEventListener('change', e => { filter.group = e.target.value; rerender(); });
    let tmr; $id('acadFilter').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { filter.q = e.target.value.trim().toLowerCase(); rerender(); }, 120); });
    $id('acadShow').addEventListener('change', e => { filter.show = e.target.value; rerender(); });
  }
  function sectionHead(kind, id, iconName, kicker, title, desc, done, total, extra) {
    return `<header class="stage-head"><span class="tile tile-lg">${icon(iconName)}</span>
      <div class="stage-head-main"><small>${esc(kicker)}</small><h2 id="sb-${id}">${esc(title)}</h2>${desc ? `<p>${esc(desc)}</p>` : ''}</div>
      <div class="stage-head-meta"><span class="muted tnum" style="font-size:13px;font-weight:650">${done}/${total}</span>${barHtml(total ? done / total * 100 : 0, title + ' progress', 'bar-sm stage-bar')}${extra || ''}</div></header>`;
  }
  function renderList() {
    const box = $id('acadList'); if (!box) return;
    const visible = LESSONS.filter(matches);
    const sum = $id('acadSummary');
    if (sum) sum.textContent = visible.length === LESSONS.length ? `Showing all ${LESSONS.length} lessons in the recommended order.` : `Showing ${visible.length} of ${LESSONS.length} lessons.`;
    if (!visible.length) {
      box.innerHTML = `<div class="empty card">${icon('search', 'ic-xl')}<h3>${esc(t('acad.noResults'))}</h3><button class="btn btn-secondary btn-sm" type="button" id="acadClear">${icon('rotate')}Clear filters</button></div>`;
      $id('acadClear').addEventListener('click', () => { Object.assign(filter, { level: 'all', q: '', show: 'all', group: 'all', coll: 'all' }); renderCatalog(); });
      return;
    }
    if (filter.view === 'map') { box.innerHTML = conceptMap(visible); return; }
    if (filter.view === 'topics') {
      box.innerHTML = GROUPS.map(g => {
        const list = g.lessons.map(id => LESSON_BY_ID.get(id)).filter(l => l && visible.includes(l)).sort((a, b) => a.seq - b.seq);
        if (!list.length) return '';
        const done = g.lessons.filter(id => ac().completed[id]).length;
        return `<section class="stage-block topic-block" aria-labelledby="sb-${g.id}">${sectionHead('group', g.id, g.icon, `Topic · ${g.lessons.length} lessons`, g.name, g.desc, done, g.lessons.length, '')}<div class="lesson-grid">${list.map(lessonCard).join('')}</div></section>`;
      }).join('');
      return;
    }
    const st = computeStats();
    box.innerHTML = STAGE_ORDER.map(sg => {
      const list = visible.filter(l => l.stage === sg);
      if (!list.length) return '';
      const rs = roadStage(sg), x = st.byStage[sg];
      return `<section class="stage-block" style="${stageStyle(sg)}" aria-labelledby="sb-${sg}">
        ${sectionHead('stage', sg, STAGE_META[sg].icon, `${t('acad.stage', { n: STAGE_META[sg].n })}${rs ? ' · ' + rs.weeks : ''}`, stageName(sg), rs ? rs.tagline : '', x.done, x.total, `<div class="stage-actions"><button class="btn btn-secondary btn-sm" type="button" data-go="academy/stage/${sg}">${icon('list')}Overview</button><button class="btn btn-soft btn-sm" type="button" data-go="tests/stage/${sg}">${icon('clipboard')}${esc(t('acad.moduleTest'))}</button></div>`)}
        <div class="lesson-grid">${list.map(lessonCard).join('')}</div>
      </section>`;
    }).join('');
  }
  /* Concept map: every topic group is a "line"; lessons are stops in recommended order. */
  function conceptMap(visible) {
    return `<div class="cmap" role="list">${GROUPS.map(g => {
      const list = g.lessons.map(id => LESSON_BY_ID.get(id)).filter(Boolean).sort((a, b) => a.seq - b.seq);
      if (!list.some(l => visible.includes(l))) return '';
      const done = list.filter(l => ac().completed[l.id]).length;
      return `<section class="cmap-lane" role="listitem" aria-labelledby="cm-${g.id}">
        <div class="cmap-head"><span class="tile tile-sm">${icon(g.icon)}</span><div><h3 id="cm-${g.id}">${esc(g.name)}</h3><small>${done}/${list.length} complete</small></div></div>
        <ol class="cmap-track">${list.map(l => { const s = status(l), dim = !visible.includes(l); return `<li class="cmap-stop ${s}${dim ? ' dim' : ''}"><button type="button" data-go="academy/lesson/${l.id}" title="${esc(l.title)} · ${esc(t('lvl.' + l.level))}"><span class="cmap-dot lvl-dot-${l.level}">${s === 'done' ? icon('check', 'ic-xs') : l.seq}</span><span class="cmap-label">${esc(l.title)}</span></button></li>`; }).join('')}</ol>
      </section>`;
    }).join('')}</div>
    <p class="help" style="margin-top:12px">Numbers are the recommended learning order. Ring colour shows the level: green beginner, blue intermediate, purple advanced. Faded stops don’t match your filters.</p>`;
  }

  /* ───────────── stage page ───────────── */
  function renderStage(sg) {
    if (!STAGE_ORDER.includes(sg)) { renderCatalog(); return; }
    const list = lessonsIn(sg), st = computeStats(), x = st.byStage[sg], rs = roadStage(sg);
    const drills = CONTENT.drills.filter(d => d.stage === sg);
    const scenarios = CONTENT.scenarios.filter(s => s.stages.includes(sg));
    const next = list.find(l => !ac().completed[l.id]);
    root.innerHTML = `
<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="academy">${esc(t('acad.title'))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(stageName(sg))}</span></nav>
<section class="stage-hero" style="${stageStyle(sg)}">
  <div><span class="eyebrow st-eyebrow">${icon(STAGE_META[sg].icon, 'ic-sm')}${esc(t('acad.stage', { n: STAGE_META[sg].n }))}${rs ? ' · ' + esc(rs.weeks) + ' · ' + rs.hours[0] + '–' + rs.hours[1] + ' h (estimate)' : ''}</span>
    <h1>${esc(stageName(sg))}</h1><p>${esc(rs ? rs.outcome : '')}</p>
    <div class="row row-wrap" style="margin-top:16px">${next ? `<button class="btn btn-primary" type="button" data-go="academy/lesson/${next.id}">${icon('play')}${esc(x.done ? t('common.continue') : t('common.start'))}: ${esc(next.title)}</button>` : `<span class="badge badge-success">${icon('check-circle')}Stage complete</span>`}<button class="btn btn-secondary" type="button" data-go="tests/stage/${sg}">${icon('clipboard')}${esc(t('acad.moduleTest'))}</button>${rs ? `<button class="btn btn-ghost" type="button" data-open-stage="${sg}">${icon('route')}${esc(t('acad.roadmapGuide'))}</button>` : ''}</div>
  </div>
  <div class="ring" style="--size:120px">${ringSvg(x.pct, 120, 10)}<div class="ring-label"><b>${x.pct}%</b><span>${x.done}/${x.total}</span></div></div>
</section>
<div class="stage-layout">
  <div class="timeline">${list.map((l, i) => { const s = status(l); return `<button type="button" class="tl-item ${s}" data-go="academy/lesson/${l.id}" style="${stageStyle(sg)}"><span class="tl-dot">${s === 'done' ? icon('check') : i + 1}</span><span class="tl-body"><b>${esc(l.title)}</b><small>${esc(l.summary)}</small></span><span class="tl-meta">${lvlBadge(l.level)}<span class="badge">${icon('clock')}${esc(t('common.min', { n: l.minutes }))}</span></span></button>`; }).join('')}</div>
  <aside class="side-cards">
    ${rs ? `<div class="card aside-card"><h3>Deliverable</h3><p style="font-size:14px">${esc(rs.deliver)}</p><hr class="divider"><h3>Advance when</h3><p style="font-size:14px">${esc(rs.gate)}</p></div>` : ''}
    ${drills.length ? `<div class="card aside-card"><h3>${esc(t('nav.drills'))}</h3><div class="stack">${drills.map(d => `<button type="button" class="lesson-mini" data-go="drills/${d.id}"><span class="tile tile-sm" data-tone="violet">${icon('puzzle')}</span><span class="lm-body"><b>${esc(d.title)}</b><small>${esc(t('drills.' + d.type))}${state.drills[d.id] ? ' · ' + esc(t('drills.best', { n: state.drills[d.id].best })) : ''}</small></span></button>`).join('')}</div></div>` : ''}
    ${scenarios.length ? `<div class="card aside-card"><h3>${esc(t('tests.scenario'))}</h3><div class="stack">${scenarios.map(s => `<button type="button" class="lesson-mini" data-go="tests/scenario/${s.id}"><span class="tile tile-sm" data-tone="gold">${icon('file-search')}</span><span class="lm-body"><b>${esc(s.title)}</b><small>${esc(t('lvl.' + s.level))} · ${s.questions.length} questions</small></span></button>`).join('')}</div></div>` : ''}
  </aside>
</div>`;
  }

  /* ───────────── lesson ───────────── */
  const LANG_GROUPS = [['South Asia', ['ur', 'ur-Latn', 'hi']], ['Middle East', ['ar']], ['East Asia', ['zh', 'ja', 'ko']], ['Europe & Americas', ['es', 'fr', 'de', 'pt']]];
  function explainCode(l) {
    const p = Prefs.get(), has = c => !l || (l.explain && l.explain[c]);
    if (QA_I18N.lang !== 'en' && EXPLAIN_LANGS.some(x => x.code === QA_I18N.lang) && has(QA_I18N.lang)) return QA_I18N.lang;
    if (EXPLAIN_LANGS.some(x => x.code === p.explainLang) && has(p.explainLang)) return p.explainLang;
    return 'ur';
  }
  function explainHtml(l, code) {
    const info = QA_I18N.info(code), text = l.explain && l.explain[code];
    return text ? `<p class="explain-body" lang="${info.code}" dir="${info.dir}">${rich(text)}</p>` : `<p class="muted">Not available in ${esc(info.name)} yet — try another language.</p>`;
  }
  function explainPicker(l, code) {
    return `<div class="lang-pills" role="group" aria-label="${esc(t('acad.explainPick'))}">${LANG_GROUPS.map(([gname, codes]) => `<span class="lang-group" title="${esc(gname)}">${codes.filter(c => EXPLAIN_LANGS.some(x => x.code === c)).map(c => { const x = QA_I18N.info(c); return `<button type="button" data-explain="${c}" aria-pressed="${c === code}" lang="${c}"${l.explain && l.explain[c] ? '' : ' disabled title="Coming soon"'}>${esc(x.native)}</button>`; }).join('')}</span>`).join('')}</div>`;
  }
  function quizHtml(l) {
    const answers = ac().quiz[l.id] || {};
    const done = Object.values(answers).filter(a => a.correct).length;
    return `<div class="quiz-list">${l.quiz.map((q, i) => {
      const a = answers[i];
      return `<fieldset class="quiz-q" id="lq-${l.id}-${i}" data-q="${i}"><legend><span class="num">Q${i + 1}</span><span>${esc(q.q)}</span></legend>
        <div class="opt-list">${q.options.map((o, k) => {
          const cls = a ? (k === q.correct && a.correct ? 'is-correct' : k === a.choice && !a.correct ? 'is-wrong' : '') : '';
          const why = a && ((k === a.choice) || (a.correct && k === q.correct)) ? `<span class="why">${rich(q.why[k])}</span>` : '';
          return `<label class="opt ${cls}"><input type="radio" name="lq-${l.id}-${i}" value="${k}"${a && a.choice === k ? ' checked' : ''}><span class="mark">${'ABCDE'[k]}</span><span class="opt-text">${rich(o)}${why}</span></label>`;
        }).join('')}</div>
        <div class="quiz-foot"><button class="btn btn-secondary btn-sm" type="button" data-check="${i}">${icon('check')}${esc(t('common.check'))}</button><span class="feedback ${a ? (a.correct ? 'ok' : 'bad') : ''}" role="status" aria-live="polite">${a ? (a.correct ? icon('check-circle', 'ic-sm') + esc(t('common.correct')) + (a.firstTry ? ' · first try' : '') : icon('x-circle', 'ic-sm') + esc(t('common.incorrect')) + ' — read why, then try again') : ''}</span></div>
      </fieldset>`;
    }).join('')}</div>
    <div class="quiz-summary" style="margin-top:14px"><b id="quizSummary">${esc(t('acad.quizScore', { a: done, b: l.quiz.length }))}</b><button class="btn btn-ghost btn-sm" type="button" id="quizRetake">${icon('rotate')}${esc(t('common.retry'))}</button></div>`;
  }
  function practiceHtml(l) {
    const marks = ac().practice[l.id] || {};
    return `<div class="ex-list">${l.practice.map((p, i) => `<div class="ex-item ${marks[i] === 'got' ? 'got' : ''}" id="ex-${i}">
      <div class="ex-q"><span class="num">${i + 1}</span><div>${rich(p.q)}</div></div>
      <div class="ex-actions">${p.hint ? `<button class="btn btn-ghost btn-sm" type="button" data-hint="${i}" aria-expanded="false">${icon('bulb')}${esc(t('common.hint'))}</button>` : ''}<button class="btn btn-soft btn-sm" type="button" data-reveal="${i}" aria-expanded="false">${icon('eye')}${esc(t('common.reveal'))}</button>${marks[i] ? `<span class="badge ${marks[i] === 'got' ? 'badge-success' : 'badge-gold'}">${icon(marks[i] === 'got' ? 'check' : 'bookmark')}${esc(marks[i] === 'got' ? t('acad.gotIt') : t('acad.reviewLater'))}</span>` : ''}</div>
      ${p.hint ? `<div class="ex-hint" id="exh-${i}" hidden>${icon('bulb', 'ic-sm')} ${esc(p.hint)}</div>` : ''}
      <div class="ex-answer" id="exa-${i}" hidden><b class="title">Model answer</b>${rich(p.answer)}<div class="ex-actions" style="margin-top:12px"><button class="btn btn-secondary btn-sm" type="button" data-mark="${i}:got">${icon('check')}${esc(t('acad.gotIt'))}</button><button class="btn btn-ghost btn-sm" type="button" data-mark="${i}:review">${icon('bookmark')}${esc(t('acad.reviewLater'))}</button></div></div>
    </div>`).join('')}</div>`;
  }
  function linksHtml(l) {
    const L = l.links || {}, out = [];
    const labNames = (ROADMAP.labs) || {};
    (L.labs || []).forEach(id => out.push(`<button class="btn btn-secondary btn-sm" type="button" data-go="lab/${id}">${icon('flask')}${esc(labNames[id] || id)}</button>`));
    (L.challenges || []).forEach(id => { const c = (typeof challengeData !== 'undefined') && challengeData.find(x => x.id === id); if (c) out.push(`<button class="btn btn-secondary btn-sm" type="button" data-challenge-open="${id}">${icon('trophy')}${esc(c.title.split('·')[0].trim())} challenge</button>`); });
    if ((L.interview || []).length) out.push(`<button class="btn btn-secondary btn-sm" type="button" data-interview-round="${(L.interview || []).join(',')}">${icon('mic')}Interview round (${L.interview.length})</button>`);
    CONTENT.drills.filter(d => d.stage === l.stage).slice(0, 2).forEach(d => out.push(`<button class="btn btn-ghost btn-sm" type="button" data-go="drills/${d.id}">${icon('puzzle')}${esc(d.title)}</button>`));
    return out.join('');
  }
  function completeBarHtml(l) {
    const done = !!ac().completed[l.id];
    return done
      ? `<div><b>${icon('check-circle')} ${esc(t('acad.completed'))}</b><p>Completed ${esc(new Date(ac().completed[l.id]).toLocaleDateString())}. Revisit the quick check any time.</p></div><button class="btn btn-glass btn-sm" type="button" id="lessonUncomplete">${icon('rotate')}Mark as not complete</button>`
      : `<div><b>Finished reading and practising?</b><p>Completing a lesson earns 50 XP. Each quick-check question right first time adds 10 XP.</p></div><button class="btn btn-light" type="button" id="lessonComplete">${icon('check-circle')}${esc(t('acad.markComplete'))}</button>`;
  }
  function renderLesson(id) {
    const l = LESSON_BY_ID.get(id);
    if (!l) { renderCatalog(); toast('That lesson was not found.', 'alert'); return; }
    const a = ac();
    a.last = l.id; if (!a.seen[l.id]) a.seen[l.id] = new Date().toISOString();
    persistSoon();
    const list = lessonsIn(l.stage), idx = list.indexOf(l), prev = LESSONS[LESSONS.indexOf(l) - 1], next = LESSONS[LESSONS.indexOf(l) + 1];
    const code = explainCode(l), g = GROUP_OF.get(l.id), colls = COLLECTIONS.filter(c => c.lessons.includes(l.id));
    const vis = l.visuals || [];
    const quizDone = a.quiz[l.id] ? Object.keys(a.quiz[l.id]).length : 0, quizRight = a.quiz[l.id] ? Object.values(a.quiz[l.id]).filter(x => x.correct).length : 0;
    const pracDone = a.practice[l.id] ? Object.keys(a.practice[l.id]).length : 0;
    const prog = lessonProgress(l);
    const reqs = (REQUIRES[l.id] || []).map(x => LESSON_BY_ID.get(x)).filter(Boolean);
    const secs = [['objectives', 'target', t('acad.objectives')], ['explain', 'translate', t('acad.simpleExplanation')], ['learn', 'book', t('acad.learn')]]
      .concat(vis.length ? [['visuals', 'route', t('acad.visualGuide')]] : [])
      .concat([['terms', 'key', t('acad.keyTerms')], ['example', 'bulb', t('acad.example')], ['practice', 'edit', t('acad.practice')], ['quiz', 'clipboard', t('acad.quiz')], ['interview', 'mic', t('acad.interview')], ['takeaways', 'star', t('acad.takeaways')], ['notes', 'note', t('acad.notes')]]);
    const doneSec = { quiz: quizDone === l.quiz.length, practice: pracDone === l.practice.length, notes: !!a.notes[l.id] };
    const num = k => String(secs.findIndex(s => s[0] === k) + 1).padStart(2, '0');
    const bm = a.bookmarks.includes(l.id);
    root.innerHTML = `
<div class="read-progress" aria-hidden="true"><i id="readBar"></i></div>
<nav class="crumbs" aria-label="Breadcrumb"><button type="button" data-go="academy">${esc(t('acad.title'))}</button>${icon('chevron-right', 'flip-rtl')}<button type="button" data-go="academy/stage/${l.stage}">${esc(stageName(l.stage))}</button>${icon('chevron-right', 'flip-rtl')}<span aria-current="page">${esc(l.title)}</span></nav>
<div class="lesson-layout" style="${stageStyle(l.stage)}">
  <article class="lesson-main" lang="en" dir="ltr" aria-labelledby="lessonTitle">
    <header class="lesson-hero">
      <div class="lesson-hero-grid">
        <div class="lesson-hero-text">
          <div class="lesson-meta"><span class="badge st-badge">${icon(STAGE_META[l.stage].icon)}${esc(t('acad.stage', { n: STAGE_META[l.stage].n }))} · ${idx + 1}/${list.length}</span>${lvlBadge(l.level)}<span class="meta">${icon('clock', 'ic-sm')}${esc(t('common.min', { n: l.minutes }))}</span><span class="meta" title="Position in the recommended path">${icon('route', 'ic-sm')}${esc(t('acad.step', { a: l.seq, b: LESSONS.length }))}</span></div>
          <h1 id="lessonTitle">${esc(l.title)}</h1>
          <p class="summary">${esc(l.summary)}</p>
          <div class="lesson-chips">${g ? `<button type="button" class="chip chip-sm" data-go="academy/topic/${g.id}">${icon(g.icon, 'ic-sm')}${esc(g.name)}</button>` : ''}${colls.map(c => `<button type="button" class="chip chip-sm" data-go="academy/collection/${c.id}">${icon(c.icon, 'ic-sm')}${esc(c.name)}</button>`).join('')}</div>
          <div class="lesson-hero-actions"><a class="btn btn-primary btn-sm" href="#sec-learn" data-jump="learn">${icon('play')}${esc(prog > 12 && prog < 100 ? t('common.continue') : t('common.start'))}</a><a class="btn btn-secondary btn-sm" href="#sec-quiz" data-jump="quiz">${icon('clipboard')}${esc(t('acad.quiz'))}</a><button class="btn btn-ghost btn-sm" type="button" id="bookmarkBtn" aria-pressed="${bm}">${icon('bookmark')}${esc(bm ? t('acad.bookmarked') : t('acad.bookmark'))}</button></div>
        </div>
        <div class="lesson-hero-art" aria-hidden="true"><div class="ring" style="--size:150px">${ringSvg(prog, 150, 10)}<div class="lha-core"><span class="tile tile-lg">${icon(STAGE_META[l.stage].icon)}</span><b>${prog}%</b></div></div></div>
      </div>
      <dl class="glance">
        <div><dt>${icon('book', 'ic-sm')}${esc(t('acad.sections'))}</dt><dd>${secs.length}</dd></div>
        <div><dt>${icon('route', 'ic-sm')}${esc(t('acad.visuals'))}</dt><dd>${vis.length + l.body.filter(b => ['table', 'flow', 'compare', 'cards'].includes(b.t) || (window.QA_DIAGRAMS && QA_DIAGRAMS.types.includes(b.t))).length}</dd></div>
        <div><dt>${icon('edit', 'ic-sm')}${esc(t('acad.practice'))}</dt><dd>${pracDone}/${l.practice.length}</dd></div>
        <div><dt>${icon('clipboard', 'ic-sm')}${esc(t('acad.quiz'))}</dt><dd>${quizRight}/${l.quiz.length}</dd></div>
        <div><dt>${icon('translate', 'ic-sm')}${esc(t('acad.languages'))}</dt><dd>${1 + Object.keys(l.explain || {}).length}</dd></div>
      </dl>
    </header>
    ${reqs.length ? `<section class="prereq" aria-label="Before you start"><span class="prereq-label">${icon('flag', 'ic-sm')}${esc(t('acad.beforeStart'))}</span>${reqs.map(r => `<button type="button" class="chip chip-sm${a.completed[r.id] ? ' is-done' : ''}" data-go="academy/lesson/${r.id}">${icon(a.completed[r.id] ? 'check-circle' : 'circle', 'ic-sm')}${esc(r.title)}</button>`).join('')}</section>` : ''}
    <section class="lesson-sec card" id="sec-objectives" aria-labelledby="h-objectives"><div class="sec-head"><span class="sec-num">${num('objectives')}</span><span class="tile">${icon('target')}</span><h2 id="h-objectives">${esc(t('acad.objectives'))}</h2></div><ul class="objectives">${l.objectives.map(o => `<li>${icon('check-circle', 'ic-sm')}<span>${esc(o)}</span></li>`).join('')}</ul></section>
    <section class="lesson-sec explain-card" id="sec-explain" aria-labelledby="h-explain">
      <div class="explain-head"><div class="sec-head" style="margin:0"><span class="sec-num">${num('explain')}</span><span class="tile" data-tone="gold">${icon('translate')}</span><h2 id="h-explain">${esc(t('acad.simpleExplanation'))}</h2></div><span class="muted" style="font-size:12.5px">English stays primary — pick a language for a plain-words version</span></div>
      ${explainPicker(l, code)}
      <div id="explainBody">${explainHtml(l, code)}</div>
    </section>
    <section class="lesson-sec card" id="sec-learn" aria-labelledby="h-learn"><div class="sec-head"><span class="sec-num">${num('learn')}</span><span class="tile">${icon('book')}</span><h2 id="h-learn">${esc(t('acad.learn'))}</h2></div><div class="prose">${blocks(l.body)}</div></section>
    ${vis.length ? `<section class="lesson-sec card visual-sec" id="sec-visuals" aria-labelledby="h-visuals"><div class="sec-head"><span class="sec-num">${num('visuals')}</span><span class="tile" data-tone="violet">${icon('route')}</span><h2 id="h-visuals">${esc(t('acad.visualGuide'))}</h2><span class="muted" style="font-size:13px">${vis.length} diagram${vis.length > 1 ? 's' : ''} to see the idea at a glance</span></div><div class="visual-grid${vis.length > 1 ? ' two' : ''}">${vis.map(b => window.QA_DIAGRAMS ? QA_DIAGRAMS.render(b) : '').join('')}</div></section>` : ''}
    <section class="lesson-sec card" id="sec-terms" aria-labelledby="h-terms"><div class="sec-head"><span class="sec-num">${num('terms')}</span><span class="tile" data-tone="info">${icon('key')}</span><h2 id="h-terms">${esc(t('acad.keyTerms'))}</h2></div><dl class="terms">${l.keyTerms.map((k, i) => `<div class="term"><dt><span class="term-i">${String(i + 1).padStart(2, '0')}</span><b>${esc(k.term)}</b></dt><dd style="margin:0"><span>${esc(k.def)}</span></dd></div>`).join('')}</dl></section>
    <section class="lesson-sec example-card" id="sec-example" aria-labelledby="h-example"><header><span class="sec-num">${num('example')}</span><span class="tile" data-tone="gold">${icon('bulb')}</span><div><small class="muted" style="font-size:12px;font-weight:700">${esc(t('acad.example'))}</small><h3 id="h-example">${esc(l.example.title)}</h3></div></header><div class="prose">${blocks(l.example.blocks)}</div></section>
    <section class="lesson-sec" id="sec-practice" aria-labelledby="h-practice"><div class="sec-head"><span class="sec-num">${num('practice')}</span><span class="tile" data-tone="violet">${icon('edit')}</span><h2 id="h-practice">${esc(t('acad.practice'))}</h2><span class="muted" style="font-size:13px">Try first, then compare with the model answer.</span></div><div id="practiceBox">${practiceHtml(l)}</div></section>
    <section class="lesson-sec" id="sec-quiz" aria-labelledby="h-quiz"><div class="sec-head"><span class="sec-num">${num('quiz')}</span><span class="tile" data-tone="gold">${icon('clipboard')}</span><h2 id="h-quiz">${esc(t('acad.quiz'))}</h2><span class="muted" style="font-size:13px">${l.quiz.length} questions · every option explained</span></div><div id="quizBox">${quizHtml(l)}</div></section>
    <section class="lesson-sec" id="sec-interview" aria-labelledby="h-interview"><div class="sec-head"><span class="sec-num">${num('interview')}</span><span class="tile" data-tone="info">${icon('mic')}</span><h2 id="h-interview">${esc(t('acad.interview'))}</h2>${(CONTENT.interview || []).some(q => q.lesson === l.id) ? `<button class="link-btn" type="button" data-go="practice/bank/lesson/${l.id}">${icon('arrow-up-right', 'ic-sm')}More in the question bank</button>` : ''}</div><div class="accordion">${l.interview.map(x => `<details class="acc"><summary>${icon('message')}<span>${esc(x.q)}</span>${icon('chevron-down', 'chev')}</summary><div class="acc-body">${rich(x.a)}</div></details>`).join('')}</div></section>
    <section class="lesson-sec card" id="sec-takeaways" aria-labelledby="h-takeaways"><div class="sec-head"><span class="sec-num">${num('takeaways')}</span><span class="tile">${icon('star')}</span><h2 id="h-takeaways">${esc(t('acad.takeaways'))}</h2></div><ul class="takeaways">${l.takeaways.map(x => `<li>${icon('check-circle', 'ic-sm')}<span>${rich(x)}</span></li>`).join('')}</ul>
      ${linksHtml(l) ? `<h3 style="font-size:14px;margin:20px 0 10px">${esc(t('acad.relatedPractice'))}</h3><div class="practise-links">${linksHtml(l)}</div>` : ''}</section>
    <section class="lesson-sec card notes-box" id="sec-notes" aria-labelledby="h-notes"><div class="sec-head"><span class="sec-num">${num('notes')}</span><span class="tile" data-tone="accent">${icon('note')}</span><h2 id="h-notes">${esc(t('acad.notes'))}</h2></div><label class="sr-only" for="lessonNotes">${esc(t('acad.notes'))}</label><textarea class="textarea" id="lessonNotes" maxlength="20000" placeholder="${esc(t('acad.notesPh'))}">${esc(a.notes[l.id] || '')}</textarea><p class="help" id="notesStatus" role="status" aria-live="polite">${a.notes[l.id] ? 'Saved in this browser.' : 'Notes save automatically in this browser.'}</p></section>
    <div class="complete-bar" id="completeBar">${completeBarHtml(l)}</div>
    <nav class="lesson-pager" aria-label="Lesson navigation">${prev ? `<button class="pager-btn" type="button" data-go="academy/lesson/${prev.id}"><small>${icon('arrow-left', 'ic-xs flip-rtl')}${esc(t('acad.prevLesson'))} · step ${prev.seq}</small><b>${esc(prev.title)}</b></button>` : '<span></span>'}${next ? `<button class="pager-btn next" type="button" data-go="academy/lesson/${next.id}"><small>${esc(t('acad.nextLesson'))} · step ${next.seq}${icon('arrow-right', 'ic-xs flip-rtl')}</small><b>${esc(next.title)}</b></button>` : ''}</nav>
  </article>
  <aside class="lesson-aside" aria-label="Lesson navigation">
    <div class="card aside-card"><h3>${esc(t('acad.onThisPage'))}</h3><nav class="toc">${secs.map(([k, ic, label]) => `<a href="#sec-${k}" data-jump="${k}" data-toc="${k}"><span class="toc-n">${num(k)}</span>${esc(label)}${doneSec[k] ? icon('check-circle', 'ic-xs toc-done') : ''}</a>`).join('')}</nav></div>
    <div class="card aside-card"><h3>${esc(t('acad.inStage'))}</h3><div class="stage-list">${list.map(x => `<button type="button" data-go="academy/lesson/${x.id}" class="${a.completed[x.id] ? 'done' : ''}"${x.id === l.id ? ' aria-current="page"' : ''}>${icon(a.completed[x.id] ? 'check-circle' : x.id === l.id ? 'circle-dot' : 'circle')}<span>${esc(x.title)}</span></button>`).join('')}</div></div>
  </aside>
</div>`;
    bindLesson(l);
  }
  function bindLesson(l) {
    const a = ac();
    root.querySelectorAll('[data-jump]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); const sec = $id('sec-' + el.dataset.jump); if (sec) { sec.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' }); const h = sec.querySelector('h2, h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } } }));
    $id('bookmarkBtn').addEventListener('click', e => {
      const on = !a.bookmarks.includes(l.id);
      if (on) a.bookmarks.push(l.id); else a.bookmarks = a.bookmarks.filter(x => x !== l.id);
      e.currentTarget.setAttribute('aria-pressed', String(on));
      e.currentTarget.innerHTML = `${icon('bookmark')}${esc(on ? t('acad.bookmarked') : t('acad.bookmark'))}`;
      save(); toast(on ? 'Lesson bookmarked.' : 'Bookmark removed.', 'bookmark');
    });
    root.querySelectorAll('[data-explain]').forEach(b => b.addEventListener('click', () => {
      const code = b.dataset.explain;
      Prefs.set({ explainLang: code });
      root.querySelectorAll('[data-explain]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $id('explainBody').innerHTML = explainHtml(l, code);
      if (!a.langs.includes(code)) { a.langs.push(code); save(); }
    }));
    const first = explainCode(l); if (!a.langs.includes(first)) { a.langs.push(first); persistSoon(); }
    // practice
    $id('practiceBox').addEventListener('click', e => {
      const h = e.target.closest('[data-hint]'), r = e.target.closest('[data-reveal]'), m = e.target.closest('[data-mark]');
      if (h) { const box = $id('exh-' + h.dataset.hint); box.hidden = !box.hidden; h.setAttribute('aria-expanded', String(!box.hidden)); }
      if (r) { const box = $id('exa-' + r.dataset.reveal); box.hidden = !box.hidden; r.setAttribute('aria-expanded', String(!box.hidden)); r.innerHTML = `${icon(box.hidden ? 'eye' : 'eye-off')}${esc(box.hidden ? t('common.reveal') : t('common.hide'))}`; }
      if (m) {
        const [i, v] = m.dataset.mark.split(':');
        (a.practice[l.id] || (a.practice[l.id] = {}))[i] = v;
        markActive(); save();
        const open = [...root.querySelectorAll('.ex-answer')].map(x => !x.hidden);
        $id('practiceBox').innerHTML = practiceHtml(l);
        root.querySelectorAll('.ex-answer').forEach((x, k) => { if (open[k]) { x.hidden = false; const rb = root.querySelector(`[data-reveal="${k}"]`); if (rb) { rb.setAttribute('aria-expanded', 'true'); rb.innerHTML = `${icon('eye-off')}${esc(t('common.hide'))}`; } } });
        toast(v === 'got' ? 'Nice — marked as understood. +5 XP' : 'Saved for review.', v === 'got' ? 'check-circle' : 'bookmark');
      }
    });
    // quiz
    const quizBox = $id('quizBox');
    quizBox.addEventListener('click', e => {
      const b = e.target.closest('[data-check]');
      if (b) { checkQuestion(l, Number(b.dataset.check)); return; }
      if (e.target.closest('#quizRetake')) {
        delete a.quiz[l.id]; save(); quizBox.innerHTML = quizHtml(l);
        quizBox.querySelector('input')?.focus();
      }
    });
    quizBox.addEventListener('change', e => {
      if (e.target.type !== 'radio') return;
      const fs = e.target.closest('.quiz-q'), fb = fs.querySelector('.feedback');
      if (fb.classList.contains('warn')) { fb.className = 'feedback'; fb.textContent = ''; }
    });
    // notes
    const notes = $id('lessonNotes'), ns = $id('notesStatus');
    notes.addEventListener('input', () => {
      const v = notes.value.slice(0, 20000);
      if (v.trim()) a.notes[l.id] = v; else delete a.notes[l.id];
      ns.textContent = 'Saving…';
      persistSoon(ok => { ns.textContent = ok ? `Saved in this browser · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved — browser storage is blocked or full. Copy your notes somewhere safe.'; });
    });
    notes.addEventListener('blur', () => flushPendingSave());
    // completion
    $id('completeBar').addEventListener('click', e => {
      if (e.target.closest('#lessonComplete')) {
        a.completed[l.id] = new Date().toISOString(); markActive(); save();
        $id('completeBar').innerHTML = completeBarHtml(l);
        const stageDone = lessonsIn(l.stage).every(x => a.completed[x.id]);
        QA.celebrate(stageDone ? `${stageName(l.stage)} complete! +50 XP` : `Lesson complete! +50 XP`);
        root.querySelector('.stage-list [aria-current="page"]')?.classList.add('done');
        $id('completeBar').querySelector('button')?.focus();
      }
      if (e.target.closest('#lessonUncomplete')) { delete a.completed[l.id]; save(); $id('completeBar').innerHTML = completeBarHtml(l); toast('Lesson marked as not complete.', 'rotate'); }
    });
    root.querySelectorAll('[data-challenge-open]').forEach(b => b.addEventListener('click', () => beginChallenge(b.dataset.challengeOpen)));
    root.querySelectorAll('[data-interview-round]').forEach(b => b.addEventListener('click', () => startInterviewRound(b.dataset.interviewRound.split(','), l)));
    // scroll-spy + reading progress
    const tocLinks = [...root.querySelectorAll('[data-toc]')];
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { const k = en.target.id.replace('sec-', ''); tocLinks.forEach(a2 => a2.classList.toggle('active', a2.dataset.toc === k)); } });
      }, { rootMargin: '-30% 0px -60% 0px' });
      root.querySelectorAll('.lesson-sec').forEach(s => observer.observe(s));
    }
    const bar = $id('readBar');
    scrollHandler = () => { const art = root.querySelector('.lesson-main'); if (!art || !bar) return; const r = art.getBoundingClientRect(); const total = r.height - innerHeight; const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1; bar.style.width = (p * 100).toFixed(1) + '%'; };
    window.addEventListener('scroll', scrollHandler, { passive: true }); scrollHandler();
  }
  function checkQuestion(l, i) {
    const a = ac(), q = l.quiz[i], fs = $id(`lq-${l.id}-${i}`);
    const picked = fs.querySelector('input:checked');
    const fb = fs.querySelector('.feedback');
    if (!picked) { fb.className = 'feedback warn'; fb.innerHTML = `${icon('alert', 'ic-sm')}Choose an answer first.`; return; }
    const choice = Number(picked.value);
    const answers = a.quiz[l.id] || (a.quiz[l.id] = {});
    const prev = answers[i];
    const attempts = (prev ? prev.attempts : 0) + 1, correct = choice === q.correct;
    answers[i] = { choice, correct, attempts, firstTry: prev ? prev.firstTry : (correct && attempts === 1) };
    markActive(); save();
    const quizBox = $id('quizBox');
    quizBox.innerHTML = quizHtml(l);
    const nfs = $id(`lq-${l.id}-${i}`);
    nfs.querySelector('[data-check]')?.focus({ preventScroll: true });
    const total = Object.values(a.quiz[l.id]).filter(x => x.correct).length;
    if (correct && total === l.quiz.length) toast(`All ${l.quiz.length} correct — great work!`, 'star');
  }
  function startInterviewRound(ids, l) {
    const qs = ids.map(id => bank.find(q => q.id === id)).filter(Boolean);
    if (!qs.length) return;
    const track = qs[0].track, picked = qs.filter(q => q.track === track).slice(0, 4);
    const go = () => {
      session = { id: 's' + Date.now(), track, revision: false, level: 'all', questions: picked, index: 0, answers: {}, started: new Date().toISOString() };
      state.lastTrack = track; showAnswer = false; showHint = false; state.activeSession = session; save();
      showScreen('practice');
      const tEl = $id('practiceTitle'); if (tEl) tEl.textContent = `Interview round · ${l.title}`;
      const sEl = $id('practiceSub'); if (sEl) sEl.textContent = 'Questions picked for this lesson. Answer first, then compare with the model and scorecard.';
      if (typeof renderPractice === 'function') renderPractice();
    };
    if (session) {
      dialog({ title: 'You have an unfinished interview round', body: `<p>${esc(trackName(session.track))} · question ${session.index + 1} of ${session.questions.length}. Resume it, or replace it with ${picked.length} questions for this lesson?</p>`, actions: [{ label: 'Cancel', value: 'cancel', kind: 'quiet' }, { label: 'Resume unfinished', value: 'resume', kind: 'outline' }, { label: 'Start new round', value: 'new', kind: 'primary' }] })
        .then(v => { if (v === 'resume') showScreen('practice'); else if (v === 'new') go(); });
    } else go();
  }

  /* ───────────── routing ───────────── */
  function cleanup() { if (observer) { observer.disconnect(); observer = null; } if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; } }
  QA.onLeave.academy = () => { cleanup(); flushPendingSave(); };
  QA.views.academy = parts => {
    cleanup();
    const [kind, id] = parts || [];
    if (kind === 'lesson' && id) renderLesson(id);
    else if (kind === 'stage' && id) renderStage(id);
    else { if (kind === 'level' && LEVELS.includes(id)) { filter.level = id; filter.show = 'all'; } if (kind === 'topic' && GROUPS.some(g => g.id === id)) { filter.group = id; filter.view = 'topics'; } if (kind === 'collection' && COLLECTIONS.some(c => c.id === id)) filter.coll = id; renderCatalog(); }
  };
  window.QadenceAcademy = { renderLesson, blocks, status };
})();
