/* Qadence · diagram engine. Turns small data descriptions into theme-aware visuals:
   flowchart (auto-layered, loops routed on the side), cycle, pyramid, matrix (heat map),
   sequence, tree, timeline, layers. Every diagram ships a screen-reader text alternative. */
window.QA_DIAGRAMS = (function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let uid = 0;
  const CH = 7.1;           // approx px per char at 13px
  function wrap(text, max) {
    const words = String(text || '').split(/\s+/).filter(Boolean), lines = [];
    let cur = '';
    words.forEach(w => { if (!cur) cur = w; else if ((cur + ' ' + w).length <= max) cur += ' ' + w; else { lines.push(cur); cur = w; } });
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }
  const tspans = (lines, x, cy, lh) => lines.map((l, i) => `<tspan x="${x}" y="${(cy + (i - (lines.length - 1) / 2) * lh).toFixed(1)}">${esc(l)}</tspan>`).join('');
  const marker = id => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="dg-arrowhead"/></marker>`;
  const srList = items => `<div class="sr-only">${items}</div>`;
  function frame(b, inner, cls, sr) {
    return `<figure class="dg dg-${b.t}${cls ? ' ' + cls : ''}" dir="ltr">${b.title ? `<div class="dg-title">${esc(b.title)}</div>` : ''}<div class="dg-body">${inner}</div>${sr ? srList(sr) : ''}${b.caption ? `<figcaption class="dg-cap">${esc(b.caption)}</figcaption>` : ''}</figure>`;
  }

  /* ───────────── flowchart ───────────── */
  function flowchart(b) {
    const id = 'dg' + (++uid), down = b.dir !== 'right';
    const nodes = b.nodes.map((n, i) => {
      const kind = n.kind || 'step', lines = wrap(n.label, kind === 'decision' ? 16 : 20);
      const tw = Math.max(...lines.map(l => l.length)) * CH;
      let w = Math.max(92, Math.min(200, tw + 30)), h = lines.length * 16 + 22;
      if (kind === 'decision') { w = Math.max(120, tw + 64); h = lines.length * 16 + 46; }
      return { ...n, kind, i, lines, w, h };
    });
    const byId = new Map(nodes.map(n => [n.id, n]));
    const edges = b.edges.filter(e => byId.has(e.from) && byId.has(e.to)).map((e, i) => ({ ...e, i }));
    // DFS to find back-edges (loops)
    const out = new Map(nodes.map(n => [n.id, []]));
    edges.forEach(e => out.get(e.from).push(e));
    const indeg = new Map(nodes.map(n => [n.id, 0])); edges.forEach(e => indeg.set(e.to, indeg.get(e.to) + 1));
    const state = new Map(), order = [];
    const visit = v => { state.set(v, 1); out.get(v).forEach(e => { const s = state.get(e.to); if (s === 1) e.back = true; else if (!s) visit(e.to); }); state.set(v, 2); order.push(v); };
    nodes.filter(n => n.kind === 'start').forEach(n => { if (!state.get(n.id)) visit(n.id); });
    nodes.filter(n => indeg.get(n.id) === 0).forEach(n => { if (!state.get(n.id)) visit(n.id); });
    nodes.forEach(n => { if (!state.get(n.id)) visit(n.id); });
    order.reverse();
    const layer = new Map(nodes.map(n => [n.id, 0]));
    order.forEach(v => out.get(v).forEach(e => { if (!e.back) layer.set(e.to, Math.max(layer.get(e.to), layer.get(v) + 1)); }));
    const layers = [];
    nodes.forEach(n => { const L = layer.get(n.id); (layers[L] || (layers[L] = [])).push(n); });
    // long edges get invisible routing points in each layer they cross, so they never cut through nodes
    let dk = 0;
    edges.forEach(e => {
      if (e.back) return;
      const L1 = layer.get(e.from), L2 = layer.get(e.to);
      if (L2 - L1 < 2) return;
      e.via = [];
      for (let L = L1 + 1; L < L2; L++) {
        const d = { id: '__d' + (dk++), dummy: true, kind: 'dummy', lines: [], w: down ? 16 : 30, h: down ? 30 : 16, i: 1e4 + dk };
        layer.set(d.id, L); (layers[L] || (layers[L] = [])).push(d); byId.set(d.id, d); e.via.push(d);
      }
    });
    // one barycenter pass to reduce crossings
    for (let L = 1; L < layers.length; L++) {
      const prevPos = new Map((layers[L - 1] || []).map((n, k) => [n.id, k]));
      (layers[L] || []).forEach(n => {
        let preds;
        if (n.dummy) { const e = edges.find(x => x.via && x.via.includes(n)); const k = e.via.indexOf(n); const prev = k ? e.via[k - 1].id : e.from; preds = prevPos.has(prev) ? [prevPos.get(prev)] : []; }
        else preds = edges.filter(e => !e.back && e.to === n.id).map(e => (e.via && e.via.length ? e.via[e.via.length - 1].id : e.from)).filter(id => prevPos.has(id)).map(id => prevPos.get(id));
        n.bary = preds.length ? preds.reduce((a, c) => a + c, 0) / preds.length : (n.dummy ? 0 : n.i);
      });
      layers[L] && layers[L].sort((a, c) => a.bary - c.bary || a.i - c.i);
    }
    const GAP_IN = 30, GAP_L = down ? 58 : 70, PAD = 18;
    // place — rows that carry labelled edges get extra room so labels never stack
    const gapAfter = L => {
      const out = edges.filter(e => !e.back && e.label && layer.get(e.from) === L);
      if (!out.length) return GAP_L;
      const perNode = Math.max(...out.map(e => out.filter(x => x.from === e.from).length));
      return GAP_L + (down ? 22 : 34) + (perNode >= 3 ? (down ? 22 : 30) : 0) + (out.length >= 4 ? 14 : 0);
    };
    let cursor = PAD, cross = 0;
    const span = layers.map(ls => (ls || []).reduce((s, n) => s + (down ? n.w : n.h), 0) + GAP_IN * (((ls || []).length) - 1));
    const maxSpan = Math.max(...span);
    layers.forEach((ls, L) => {
      if (!ls) return;
      const thick = Math.max(...ls.map(n => (down ? n.h : n.w)));
      let pos = PAD + (maxSpan - span[L]) / 2;
      ls.forEach(n => {
        if (down) { n.cx = pos + n.w / 2; n.cy = cursor + thick / 2; pos += n.w + GAP_IN; }
        else { n.cy = pos + n.h / 2; n.cx = cursor + thick / 2; pos += n.h + GAP_IN; }
      });
      cursor += thick + gapAfter(L);
      cross = Math.max(cross, pos);
    });
    const lastGap = gapAfter(layers.length - 1);
    let W = down ? maxSpan + PAD * 2 : cursor - lastGap + PAD;
    let H = down ? cursor - lastGap + PAD : maxSpan + PAD * 2;
    const backs = edges.filter(e => e.back);
    const midC = down ? (PAD + maxSpan / 2 + PAD / 2) : (PAD + maxSpan / 2 + PAD / 2);
    backs.forEach(e => { const s = byId.get(e.from); e.side = (down ? s.cx : s.cy) < midC ? 'a' : 'b'; });
    const nA = backs.filter(e => e.side === 'a').length, nB = backs.length - nA;
    const OFF = nA ? 26 + nA * 16 : 0;
    const LBL = backs.some(e => e.label) ? 44 : 0;   // room for loop labels pushed outward
    const allPlaced = [...byId.values()];
    if (down) { W += OFF + (nA && LBL ? LBL : 0) + (nB ? 26 + nB * 16 + LBL : 0); allPlaced.forEach(n => { n.cx += OFF + (nA && LBL ? LBL : 0); }); }
    else { H += OFF + (nA && LBL ? 20 : 0) + (nB ? 26 + nB * 16 + (LBL ? 20 : 0) : 0); allPlaced.forEach(n => { n.cy += OFF + (nA && LBL ? 20 : 0); }); }
    const shape = n => {
      const x = n.cx - n.w / 2, y = n.cy - n.h / 2;
      if (n.kind === 'decision') return `<polygon class="dg-n dg-decision" points="${n.cx},${y} ${x + n.w},${n.cy} ${n.cx},${y + n.h} ${x},${n.cy}"/>`;
      if (n.kind === 'io') return `<polygon class="dg-n dg-io" points="${x + 12},${y} ${x + n.w},${y} ${x + n.w - 12},${y + n.h} ${x},${y + n.h}"/>`;
      const rx = n.kind === 'start' || n.kind === 'end' ? n.h / 2 : 10;
      return `<rect class="dg-n dg-${n.kind}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${n.w.toFixed(1)}" height="${n.h}" rx="${rx}"/>`;
    };
    const placed = [];
    const hits = (x, y, w) => { const r = { x: x - w / 2, y: y - 10, w, h: 20 }; const ov = (b, pad) => Math.min(r.x + r.w, b.x + b.w) - Math.max(r.x, b.x) > pad && Math.min(r.y + r.h, b.y + b.h) - Math.max(r.y, b.y) > pad; return nodes.some(n => ov({ x: n.cx - n.w / 2, y: n.cy - n.h / 2, w: n.w, h: n.h }, 1)) || placed.some(b => ov(b, 0)); };
    const label = (x, y, text) => { const w = text.length * 6.4 + 14; placed.push({ x: x - w / 2 - 2, y: y - 12, w: w + 4, h: 24 }); return `<g class="dg-elabel"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - 10).toFixed(1)}" width="${w.toFixed(1)}" height="20" rx="10"/><text x="${x.toFixed(1)}" y="${(y + 0.5).toFixed(1)}">${esc(text)}</text></g>`; };
    /* Slide the label along its edge (P(t) → [x, y]) until it clears every node and earlier label. */
    const placeLabel = (P, text) => { const w = text.length * 6.4 + 14; for (const tt of [0.5, 0.38, 0.62, 0.28, 0.72, 0.2, 0.8, 0.14, 0.86]) { const [x, y] = P(tt); if (!hits(x, y, w)) return label(x, y, text); } const [x, y] = P(0.5); return label(x, y, text); };
    const cubic = (x0, y0, x1, y1, x2, y2, x3, y3) => t => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]; };
    const maxRight = Math.max(...nodes.map(n => n.cx + n.w / 2)), maxBottom = Math.max(...nodes.map(n => n.cy + n.h / 2));
    const minLeft = Math.min(...nodes.map(n => n.cx - n.w / 2)), minTop = Math.min(...nodes.map(n => n.cy - n.h / 2));
    const dummies = [...byId.values()].filter(n => n.dummy);
    let paths = '', labels = '', ka = 0, kb = 0;
    edges.forEach(e => {
      const s = byId.get(e.from), t = byId.get(e.to);
      if (e.back) {
        const A = e.side === 'a', k = A ? ++ka : ++kb;
        if (down) {
          const lane = A ? minLeft - 18 - k * 16 : maxRight + 18 + k * 16, sgn = A ? -1 : 1;
          const sx = s.cx + sgn * s.w / 2, tx = t.cx + sgn * t.w / 2;
          paths += `<path class="dg-e dg-e-back" d="M${sx},${s.cy} H${lane - sgn * 8} Q${lane},${s.cy} ${lane},${s.cy - 8} V${t.cy + 8} Q${lane},${t.cy} ${lane - sgn * 8},${t.cy} H${tx + sgn * 2}" marker-end="url(#${id}a)"/>`;
          if (e.label) { const lw = e.label.length * 6.4 + 14, lx = lane + sgn * (lw / 2 - 4); labels += placeLabel(tt => [lx, s.cy + (t.cy - s.cy) * tt], e.label); }
        } else {
          const lane = A ? minTop - 18 - k * 16 : maxBottom + 18 + k * 16, sgn = A ? -1 : 1;
          const sy = s.cy + sgn * s.h / 2, ty = t.cy + sgn * t.h / 2;
          paths += `<path class="dg-e dg-e-back" d="M${s.cx},${sy} V${lane - sgn * 8} Q${s.cx},${lane} ${s.cx - 8},${lane} H${t.cx + 8} Q${t.cx},${lane} ${t.cx},${lane - sgn * 8} V${ty + sgn * 2}" marker-end="url(#${id}a)"/>`;
          if (e.label) { const ly = lane + sgn * 12; labels += placeLabel(tt => [s.cx + (t.cx - s.cx) * tt, ly], e.label); }
        }
        return;
      }
      if (e.via && e.via.length) {
        const pts = down ? [[s.cx, s.cy + s.h / 2], ...e.via.map(v => [v.cx, v.cy]), [t.cx, t.cy - t.h / 2 - 2]] : [[s.cx + s.w / 2, s.cy], ...e.via.map(v => [v.cx, v.cy]), [t.cx - t.w / 2 - 2, t.cy]];
        let dd = `M${pts[0][0]},${pts[0][1]}`;
        for (let k2 = 1; k2 < pts.length; k2++) { const [ax, ay] = pts[k2 - 1], [bx, by] = pts[k2]; if (down) { const my = (ay + by) / 2; dd += ` C${ax},${my} ${bx},${my} ${bx},${by}`; } else { const mx = (ax + bx) / 2; dd += ` C${mx},${ay} ${mx},${by} ${bx},${by}`; } }
        paths += `<path class="dg-e" d="${dd}" marker-end="url(#${id}a)"/>`;
        if (e.label) { const [ax, ay] = pts[0], [bx, by] = pts[1]; labels += placeLabel(down ? cubic(ax, ay, ax, (ay + by) / 2, bx, (ay + by) / 2, bx, by) : cubic(ax, ay, (ax + bx) / 2, ay, (ax + bx) / 2, by, bx, by), e.label); }
        return;
      }
      let x1, y1, x2, y2, d;
      if (down) {
        x1 = s.cx; y1 = s.cy + s.h / 2; x2 = t.cx; y2 = t.cy - t.h / 2 - 2;
        if (layer.get(e.to) === layer.get(e.from)) { x1 = s.cx + (t.cx > s.cx ? s.w / 2 : -s.w / 2); y1 = s.cy; x2 = t.cx + (t.cx > s.cx ? -t.w / 2 : t.w / 2); y2 = t.cy; d = `M${x1},${y1} L${x2},${y2}`; }
        else { const my = (y1 + y2) / 2; d = `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`; }
      } else {
        x1 = s.cx + s.w / 2; y1 = s.cy; x2 = t.cx - t.w / 2 - 2; y2 = t.cy;
        const mx = (x1 + x2) / 2; d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
      }
      paths += `<path class="dg-e" d="${d}" marker-end="url(#${id}a)"/>`;
      if (e.label) {
        let P;
        if (down && layer.get(e.to) !== layer.get(e.from)) { const my = (y1 + y2) / 2; P = cubic(x1, y1, x1, my, x2, my, x2, y2); }
        else if (!down) { const mx = (x1 + x2) / 2; P = cubic(x1, y1, mx, y1, mx, y2, x2, y2); }
        else P = tt => [x1 + (x2 - x1) * tt, y1 + (y2 - y1) * tt];
        labels += placeLabel(P, e.label);
      }
    });
    const nodesSvg = nodes.map(n => `<g class="dg-node">${shape(n)}<text class="dg-t dg-t-${n.kind}" x="${n.cx.toFixed(1)}" y="${n.cy}">${tspans(n.lines, n.cx.toFixed(1), n.cy, 16)}</text></g>`).join('');
    const svg = `<svg viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(H)}" width="${Math.ceil(W)}" style="max-width:100%;min-width:${Math.min(Math.ceil(W), Math.round(W * 0.74))}px;height:auto" role="img" aria-labelledby="${id}t"><title id="${id}t">${esc(b.title || 'Flowchart')}</title><defs>${marker(id + 'a')}</defs>${paths}${nodesSvg}${labels}</svg>`;
    const sr = `<p>Flowchart${b.title ? ': ' + esc(b.title) : ''}.</p><ul>${edges.map(e => `<li>${esc(byId.get(e.from).label)} → ${esc(byId.get(e.to).label)}${e.label ? ' (' + esc(e.label) + ')' : ''}</li>`).join('')}</ul>`;
    return frame(b, `<div class="dg-scroll">${svg}</div>`, !down || W > 470 ? 'dg-wide' : '', sr);
  }

  /* ───────────── cycle ───────────── */
  function cycle(b) {
    const id = 'dg' + (++uid), n = b.steps.length, S = 460, C = S / 2, R = n <= 4 ? 150 : 165;
    const pts = b.steps.map((s, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { x: C + R * Math.cos(a), y: C + R * Math.sin(a), a, lines: wrap(s, 14), s }; });
    let arcs = '';
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % n], gap = 0.34 + (n > 6 ? 0.06 : 0);
      const a1 = p.a + gap, a2 = (i + 1 === n ? q.a + 2 * Math.PI : q.a) - gap;
      const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1), x2 = C + R * Math.cos(a2), y2 = C + R * Math.sin(a2);
      arcs += `<path class="dg-e dg-arc" d="M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}" marker-end="url(#${id}a)"/>`;
    });
    const nodes = pts.map((p, i) => {
      const w = Math.max(96, Math.max(...p.lines.map(l => l.length)) * CH + 26), h = p.lines.length * 16 + 34;
      return `<g class="dg-node"><rect class="dg-n dg-cyc" x="${(p.x - w / 2).toFixed(1)}" y="${(p.y - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="16"/><circle class="dg-num" cx="${(p.x - w / 2 + 2).toFixed(1)}" cy="${(p.y - h / 2 + 2).toFixed(1)}" r="11"/><text class="dg-numt" x="${(p.x - w / 2 + 2).toFixed(1)}" y="${(p.y - h / 2 + 2.5).toFixed(1)}">${i + 1}</text><text class="dg-t" x="${p.x.toFixed(1)}" y="${p.y}">${tspans(p.lines, p.x.toFixed(1), p.y + 2, 16)}</text></g>`;
    }).join('');
    const center = b.center ? `<circle class="dg-center" cx="${C}" cy="${C}" r="62"/><text class="dg-t dg-center-t" x="${C}" y="${C}">${tspans(wrap(b.center, 12), C, C, 16)}</text>` : '';
    const svg = `<svg viewBox="0 0 ${S} ${S}" width="${S}" style="max-width:100%;height:auto" role="img" aria-labelledby="${id}t"><title id="${id}t">${esc(b.title || 'Cycle')}</title><defs>${marker(id + 'a')}</defs><circle class="dg-ring" cx="${C}" cy="${C}" r="${R}"/>${arcs}${center}${nodes}</svg>`;
    return frame(b, svg, '', `<p>Cycle: ${b.steps.map(esc).join(' → ')} → back to ${esc(b.steps[0])}.</p>`);
  }

  /* ───────────── pyramid (HTML) ───────────── */
  function pyramid(b) {
    const n = b.levels.length;
    const rows = b.levels.map((lv, i) => { const top = 18 + (i / n) * 82, bot = 18 + ((i + 1) / n) * 82; return `<div class="dg-pyr-row" style="--w:${bot.toFixed(1)}%;--i:${i};--n:${n}"><div class="dg-pyr-band" style="clip-path:polygon(${((bot - top) / 2 / bot * 100).toFixed(2)}% 0, ${(100 - (bot - top) / 2 / bot * 100).toFixed(2)}% 0, 100% 100%, 0 100%)"><b>${esc(lv.label)}</b></div>${lv.note ? `<span class="dg-pyr-note">${esc(lv.note)}</span>` : ''}</div>`; }).join('');
    return frame(b, `<div class="dg-pyr">${rows}</div>`, '', '');
  }

  /* ───────────── matrix (HTML grid) ───────────── */
  function matrix(b) {
    const cols = b.x.ticks.length;
    const head = `<div class="dg-mx-corner"></div>${b.x.ticks.map(t => `<div class="dg-mx-xt">${esc(t)}</div>`).join('')}`;
    const body = b.y.ticks.map((yt, r) => `<div class="dg-mx-yt">${esc(yt)}</div>${b.x.ticks.map((_, c) => { const tone = (b.tones && b.tones[r] && b.tones[r][c]) || 'none'; return `<div class="dg-mx-cell tone-${tone}">${esc(b.cells[r][c])}</div>`; }).join('')}`).join('');
    return frame(b, `<div class="dg-mx-wrap"><div class="dg-mx-ylabel"><span>${esc(b.y.label)}</span></div><div class="dg-mx-main"><div class="dg-mx-xlabel">${esc(b.x.label)} →</div><div class="dg-mx" style="grid-template-columns:minmax(84px,auto) repeat(${cols},minmax(92px,1fr))" aria-hidden="true">${head}${body}</div></div></div>`, cols >= 4 ? 'dg-wide' : '', `<table><caption>${esc(b.title || 'Matrix')}: ${esc(b.y.label)} by ${esc(b.x.label)}</caption><thead><tr><th scope="col">${esc(b.y.label)}</th>${b.x.ticks.map(x => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.y.ticks.map((yt, r) => `<tr><th scope="row">${esc(yt)}</th>${b.x.ticks.map((_, c) => `<td>${esc(b.cells[r][c])}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
  }

  /* ───────────── sequence (SVG) ───────────── */
  function sequence(b) {
    const id = 'dg' + (++uid), A = b.actors.length, PAD = 20, top = 54, rowH = 50;
    let colW = A <= 3 ? 200 : A === 4 ? 170 : 150;
    b.steps.forEach((st, k) => { const span = Math.abs(st.to - st.from); const need = (String(k + 1).length + 2 + st.label.length) * 6.4 + 26; if (span) colW = Math.max(colW, need / span); });
    colW = Math.min(colW, 250);
    const selfPad = b.steps.some(st => st.from === st.to) ? Math.max(...b.steps.filter(st => st.from === st.to).map(st => st.label.length * 6.4 + 60)) : 0;
    const xs = b.actors.map((_, i) => PAD + colW / 2 + i * colW);
    const W = PAD * 2 + colW * A + Math.max(0, selfPad - colW / 2), H = top + 26 + b.steps.length * rowH + 46;
    const boxes = (y) => b.actors.map((a, i) => { const lines = wrap(a, 14), w = Math.min(colW - 22, Math.max(...lines.map(l => l.length)) * CH + 30), h = lines.length * 15 + 20; return `<rect class="dg-actor" x="${(xs[i] - w / 2).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="10"/><text class="dg-t dg-actor-t" x="${xs[i]}" y="${y + h / 2}">${tspans(lines, xs[i], y + h / 2, 15)}</text>`; }).join('');
    const life = xs.map(x => `<line class="dg-life" x1="${x}" y1="${top - 6}" x2="${x}" y2="${H - 46}"/>`).join('');
    let msgs = '';
    b.steps.forEach((s, k) => {
      const y = top + 34 + k * rowH, x1 = xs[s.from], x2 = xs[s.to], lab = `${k + 1}. ${s.label}`;
      if (s.from === s.to) {
        msgs += `<path class="dg-e${s.reply ? ' dg-reply' : ''}" d="M${x1},${y - 8} h34 v16 h-32" marker-end="url(#${id}a)"/><text class="dg-msg" x="${x1 + 40}" y="${y - 12}" text-anchor="start">${esc(lab)}</text>`;
      } else {
        const dir = x2 > x1 ? 1 : -1;
        msgs += `<line class="dg-e${s.reply ? ' dg-reply' : ''}" x1="${x1 + dir * 4}" y1="${y}" x2="${x2 - dir * 6}" y2="${y}" marker-end="url(#${id}a)"/><text class="dg-msg" x="${(x1 + x2) / 2}" y="${y - 9}">${esc(lab)}</text>`;
      }
    });
    const svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;min-width:${Math.round(W * 0.6)}px;height:auto" role="img" aria-labelledby="${id}t"><title id="${id}t">${esc(b.title || 'Sequence diagram')}</title><defs>${marker(id + 'a')}</defs>${life}${boxes(8)}${msgs}${boxes(H - 44)}</svg>`;
    const sr = `<p>Sequence between ${b.actors.map(esc).join(', ')}.</p><ol>${b.steps.map(s => `<li>${esc(b.actors[s.from])} → ${esc(b.actors[s.to])}: ${esc(s.label)}${s.reply ? ' (reply)' : ''}</li>`).join('')}</ol>`;
    return frame(b, `<div class="dg-scroll">${svg}</div>`, W > 440 ? 'dg-wide' : '', sr);
  }

  /* ───────────── tree (HTML org chart) ───────────── */
  function tree(b) {
    const node = (n, depth) => `<li>${n.edge ? `<span class="dg-tree-edge">${esc(n.edge)}</span>` : ''}<div class="dg-tree-node d${depth}">${esc(n.label)}</div>${n.children && n.children.length ? `<ul>${n.children.map(c => node(c, depth + 1)).join('')}</ul>` : ''}</li>`;
    const flat = (n, d) => `<li>${n.edge ? esc(n.edge) + ': ' : ''}${esc(n.label)}${n.children ? `<ul>${n.children.map(c => flat(c, d + 1)).join('')}</ul>` : ''}</li>`;
    const leaves = n => n.children && n.children.length ? n.children.reduce((a, c) => a + leaves(c), 0) : 1;
    return frame(b, `<div class="dg-scroll"><ul class="dg-tr" aria-hidden="true">${node(b.root, 0)}</ul></div>`, leaves(b.root) > 3 ? 'dg-wide' : '', `<ul>${flat(b.root, 0)}</ul>`);
  }

  /* ───────────── timeline & layers (HTML) ───────────── */
  function timeline(b) {
    return frame(b, `<ol class="dg-tl" style="--n:${b.items.length}">${b.items.map((it, i) => `<li><span class="dg-tl-dot">${i + 1}</span><b>${esc(it.label)}</b>${it.sub ? `<span>${esc(it.sub)}</span>` : ''}</li>`).join('')}</ol>`, b.items.length >= 6 ? 'dg-wide' : '', '');
  }
  function layers(b) {
    if (b.nested) {
      const build = i => i >= b.items.length ? '' : `<div class="dg-nest d${i}"><div class="dg-nest-h"><b>${esc(b.items[i].label)}</b>${b.items[i].sub ? `<span>${esc(b.items[i].sub)}</span>` : ''}</div>${build(i + 1)}</div>`;
      return frame(b, build(0), 'dg-nested', '');
    }
    return frame(b, `<div class="dg-stack">${b.items.map((it, i) => `<div class="dg-layer d${i}" style="--i:${i}"><b>${esc(it.label)}</b>${it.sub ? `<span>${esc(it.sub)}</span>` : ''}</div>${i < b.items.length - 1 ? '<div class="dg-layer-arrow" aria-hidden="true"></div>' : ''}`).join('')}</div>`, '', '');
  }

  const R = { flowchart, cycle, pyramid, matrix, sequence, tree, timeline, layers };
  function render(b) { try { return R[b.t] ? R[b.t](b) : ''; } catch (e) { console.error('[diagram]', b && b.t, e); return `<p class="muted">Diagram could not be drawn.</p>`; } }
  /* Wide diagrams that actually overflow become labelled, keyboard-scrollable regions. */
  function enhance(root) {
    (root || document).querySelectorAll('.dg-scroll').forEach(el => {
      const over = el.scrollWidth > el.clientWidth + 2;
      if (over && !el.hasAttribute('tabindex')) { el.tabIndex = 0; el.setAttribute('role', 'region'); const t = el.closest('.dg')?.querySelector('.dg-title'); el.setAttribute('aria-label', (t ? t.textContent + ' — ' : '') + 'scroll sideways to see the whole diagram'); }
      else if (!over && el.getAttribute('role') === 'region') { el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label'); }
    });
  }
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => enhance(), 200); });
  document.addEventListener('qa:screen', () => setTimeout(() => enhance(), 60));
  return { render, enhance, types: Object.keys(R) };
})();
