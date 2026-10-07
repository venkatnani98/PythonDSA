(() => {
const D = window.DSA, K = 'dsaLab', $ = s => document.querySelector(s);
const def = {t:{},p:{},bm:[],notes:{},theme:'light',day:1,scratch:'',plan:{},rev:0};
let S = {...def, ...JSON.parse(localStorage.getItem(K) || '{}')};
const save = () => localStorage.setItem(K, JSON.stringify(S));
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const slug = s => s.toLowerCase().replace(/²/g,'2').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const day = n => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };

// ---- build curriculum ----
const mods = D.modules.map((m,n) => ({...m, n, topics: m.topics.map(name => { const id = slug(name);
  return {id, title:name, mid:m.id, key:m.id+'/'+id, ...(D.content[m.id+'/'+id] || {})}; })}));
mods.forEach(m => m.topics.forEach(t => { t.mod = m; t.problems = (t.problems||[]).map((p,i) => ({...p, key:t.key+'/'+i, t})); }));
const allT = mods.flatMap(m => m.topics), allP = allT.flatMap(t => t.problems);

// ---- progress ----
const tp = t => S.t[t.key] || {}, pp = p => S.p[p.key] || {};
const tDone = t => { const x = tp(t); return !!(x.l && x.c && x.e); };
const mast = p => { const x = pp(p); return !!(x.r && x.u && x.v && x.s); };
const mPct = m => m.topics.length ? Math.round(100*m.topics.filter(tDone).length/m.topics.length) : 0;
const total = () => { const n = allT.length+allP.length, d = allT.filter(tDone).length+allP.filter(mast).length; return n ? Math.round(100*d/n) : 0; };
const level = p => { const x = pp(p); return x.r&&x.u&&x.v&&x.s ? '🟩 Mastered' : x.s ? '🟦 Solved' : x.v ? '🟦 Practiced' : x.u ? '🟨 Understood' : x.r ? '🟨 Learning' : '🟥 Not Started'; };
const due = () => allP.filter(p => pp(p).nx && pp(p).nx <= day(0));
function setP(k,f,v){ const x = S.p[k] = S.p[k] || {}; x[f] = v;
  if (f === 's') { if (v) { x.d = day(0); x.st = 0; x.nx = day(1); } else { delete x.d; delete x.nx; delete x.st; } } }
function toggleBm(k){ const i = S.bm.indexOf(k); i<0 ? S.bm.push(k) : S.bm.splice(i,1); save(); }

// ---- small renderers ----
const bar = p => `<div class="pb"><i style="width:${p}%"></i></div>`;
const cb = (ty,key,f,label,on) => `<label class="cb"><input type="checkbox" data-ty="${ty}" data-key="${key}" data-f="${f}" ${on?'checked':''}> ${label}</label>`;
const ul = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const sec = (t,b) => `<section class="card"><h2>${t}</h2>${b}</section>`;
const crumbs = a => `<div class="crumb"><a href="#/">Home</a>${a.map(x => ' → ' + (Array.isArray(x) ? `<a href="${x[1]}">${esc(x[0])}</a>` : esc(x))).join('')}</div>`;
const hl = c => esc(c).replace(/(#.*$)|("[^"\n]*"|'[^'\n]*')|\b(def|return|if|elif|else|while|for|in|not|and|or|is|None|True|False|class|import|from|break|continue|pass)\b|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()/gm,
  (m,c,s,k,n) => `<i class="${c?'c':s?'s':k?'k':n?'n':'f'}">${m}</i>`);
const codeBlock = c => `<div class="code"><button class="cp" data-act="copy">Copy Code</button><pre>${hl(c)}</pre></div>`;
const noteBox = k => `<div class="note"><textarea rows="2" placeholder="My notes…">${esc(S.notes[k]||'')}</textarea><button data-act="note" data-key="${k}">Save Note</button></div>`;
const star = k => `<button class="ic" data-act="bm" data-key="${k}" aria-label="Bookmark">${S.bm.includes(k)?'⭐':'☆'}</button>`;

function dryHtml(t,i){ const d = t.dry; if (!d) return ''; const s = d.steps[i], a = s.a || d.a, n = d.steps.length;
  return `<div class="dry" data-key="${t.key}" data-i="${i}"><p>Input: <code>${esc(d.input)}</code></p>
  <div class="cells">${a.map((v,j) => `<span class="${s.d && (j<s.d[0]||j>s.d[1]) ? 'dim' : ''} ${j===s.m ? (a[j]===d.t?'hit':'mid') : ''}">${v}<small>${j}</small></span>`).join('')}</div>
  <pre>${esc(s.v)}</pre><p><b>Step ${i+1} / ${n}:</b> ${esc(s.n)}</p>
  <button data-act="dry" data-dir="-1" ${i?'':'disabled'}>← Back</button> <button data-act="dry" data-dir="1" ${i<n-1?'':'disabled'}>Next →</button></div>`; }

function probCard(p){ const x = pp(p), i = allP.indexOf(p);
  return `<div class="card prob"><h3><a href="#/problem/${i}">${p.dif} ${esc(p.title)}</a> ${star(p.key)} <small data-lvl="${p.key}">${level(p)}</small></h3>
  <p class="muted">${esc(p.t.mod.title)} → ${esc(p.t.title)}</p><p>${esc(p.q)}</p><pre class="code">${esc(p.ex)}</pre>
  <div class="row">${cb('P',p.key,'r','Read',x.r)}${cb('P',p.key,'u','Understood',x.u)}${cb('P',p.key,'v','Practiced in VSCode',x.v)}${cb('P',p.key,'s','Solved Without Help',x.s)}</div>
  <p class="muted">Think first. Try it on paper or in VSCode. Then reveal one step at a time.</p>
  ${p.hints.map((h,j) => `<details><summary>💡 Show Hint ${j+1}</summary><p>${esc(h)}</p></details>`).join('')}
  <details><summary>🧭 Show Approach</summary><p>${esc(p.approach)}</p></details>
  <details><summary>🐍 Show Solution</summary>${codeBlock(p.sol)}</details>
  <details><summary>🧑‍💻 Practice in VSCode</summary><ol><li>Open your DSA practice folder.</li><li>Create <code>${esc(p.file||'practice.py')}</code></li><li>Try solving without looking at the solution.</li><li>Run the file.</li><li>Test multiple inputs.</li></ol>
  <p class="muted">A browser can't open VSCode for you. Do these steps, then tick "Practiced in VSCode" above.</p></details>${noteBox(p.key)}</div>`; }

// ---- views ----
function modCard(m){ const p = mPct(m), np = m.topics.reduce((a,t) => a+t.problems.length, 0);
  return `<div class="card"><small>Module ${String(m.n+1).padStart(2,'0')}</small><h3>${m.icon} ${m.title} ${p==100?'✅':''}</h3><p>${m.desc}</p>
  <small>${m.topics.length} topics · ${np} problems</small>${bar(p)}<small>${p}% complete</small><br><br><a class="btn" href="#/module/${m.id}">${p?'Continue Learning':'Open Module'}</a></div>`; }

function dash(){ const d = S.day, plan = D.days[d-1], dl = due();
  return `<h1>Python DSA Learning Lab</h1><p class="sub">Learn → Understand → Code → Practice → Master</p>
  <div class="card"><h3>Overall Progress</h3>${bar(total())}<b>${total()}%</b>
  <p>Modules: ${mods.filter(m=>mPct(m)==100).length} / ${mods.length} · Topics: ${allT.filter(tDone).length} / ${allT.length} · Problems: ${allP.filter(mast).length} / ${allP.length}</p></div>
  ${dl.length ? `<div class="card warn"><h3>Review Today</h3><p>${dl.length} problem(s) ready for revision.</p>${dl.map(p => `<div><a href="#/problem/${allP.indexOf(p)}">${esc(p.title)}</a> <button data-act="reviewed" data-key="${p.key}">Reviewed ✓</button></div>`).join('')}</div>` : ''}
  <div class="card"><h3>Today's Plan: Day ${d} — ${plan[0]}</h3><div class="days">${D.days.map((_,i) => `<button data-act="day" data-n="${i+1}" class="${i+1==d?'on':''}">Day ${i+1}</button>`).join('')}</div>
  ${plan[1].map((t,i) => `<div>${cb('plan',d+'|'+i,'x',Array.isArray(t)?`<a href="${t[1]}">${esc(t[0])}</a>`:esc(t),S.plan[d+'|'+i])}</div>`).join('')}</div>
  <h2>Modules</h2><div class="grid">${mods.map(modCard).join('')}</div>`; }

const modView = m => `${crumbs([m.title])}<h1>${m.icon} ${m.title}</h1><p>${m.desc}</p>${bar(mPct(m))}<small>${mPct(m)}% complete</small>
  <div class="card">${m.topics.map(t => `<div class="row">${cb('Tall',t.key,'','',tDone(t))}<a href="#/topic/${m.id}/${t.id}">${esc(t.title)}</a>${t.simple?'':' <small>(content not written yet)</small>'}<small>${t.problems.length?t.problems.length+' problems':''}</small></div>`).join('')}</div>`;

function topicView(m,t){ const i = allT.indexOf(t), pv = allT[i-1], nx = allT[i+1], x = tp(t), R = S.rev, L = u => `#/topic/${u.mid}/${u.id}`;
  let h = `${crumbs([[m.title,'#/module/'+m.id],t.title])}<h1>${esc(t.title)} ${star(t.key)}</h1>${R?'<p class="muted">🔄 Revision mode: key points only.</p>':''}
  <div class="card row">${cb('T',t.key,'l','Learned',x.l)}${cb('T',t.key,'c','Code Understood',x.c)}${cb('T',t.key,'e','Example Understood',x.e)}</div>`;
  if (!t.simple) h += `<div class="card">📝 This topic has no content yet. Add it in <code>data/${m.id}.js</code> as <code>DSA.content["${t.key}"]</code> (see README).</div>`;
  else {
    if (!R) h += sec('1. What Is It?',`<p>${esc(t.simple)}</p>`) + sec('2. Real-Life Analogy',`<p>${esc(t.analogy)}</p>`) + sec('3. Visual Explanation',`<div>${t.visual}</div>`) + sec('4. Step by Step',t.steps.map((s,j) => `<details><summary>Step ${j+1}</summary><p>${esc(s)}</p></details>`).join(''));
    h += sec('Python Code', codeBlock(t.code));
    if (!R) h += sec('Code Explanation',t.lines.map(l => `<details><summary><code>${esc(l[0])}</code></summary><p>${esc(l[1])}</p></details>`).join('')) + (t.dry ? sec('Dry Run', dryHtml(t,0)) : '');
    h += sec('Complexity',`<pre>${esc(t.time)}\nSpace: ${esc(t.space)}</pre><p>${esc(t.cx)}</p><pre>O(1)        🚀 Very Fast\nO(log n)    🚀 Fast\nO(n)        🙂 Fine\nO(n log n)  🙂 Moderate\nO(n²)       😐 Can become slow\nO(2ⁿ)       🐌 Very Slow</pre>`)
      + sec('When Should I Use This?', ul(t.when)) + sec('Common Beginner Mistakes', ul(t.mistakes));
    if (t.interview) h += sec('Interview Notes',`<p>${esc(t.interview)}</p>`);
    if (t.problems.length) h += `<h2>Practice Problems</h2>` + t.problems.map(p => R ? `<div>${p.dif} <a href="#/problem/${allP.indexOf(p)}">${esc(p.title)}</a></div>` : probCard(p)).join('');
  }
  return h + `<div class="card"><h3>My Notes</h3>${noteBox(t.key)}</div>
  <div class="row" style="justify-content:space-between">${pv?`<a class="btn" href="${L(pv)}">← ${esc(pv.title)}</a>`:'<span></span>'}${nx?`<a class="btn" href="${L(nx)}">${esc(nx.title)} →</a>`:''}</div>`; }

const probView = p => crumbs([[p.t.mod.title,'#/module/'+p.t.mid],[p.t.title,`#/topic/${p.t.mid}/${p.t.id}`],p.title]) + probCard(p);

function progView(){ const at = allP.filter(p => Object.values(pp(p)).some(v => v===true)), sv = allP.filter(p => pp(p).s);
  return `<h1>Progress</h1><div class="card"><h3>Overall Completion</h3>${bar(total())}<b>${total()}%</b></div>
  <div class="card"><h3>Module Progress</h3>${mods.map(m => `<div class="mrow"><span>${m.title}</span>${bar(mPct(m))}<b>${mPct(m)}%</b></div>`).join('')}</div>
  <div class="card"><h3>Problem Progress</h3><pre>Problems Attempted:     ${at.length}\nSolved Without Help:    ${sv.length}\nAttempted, not solved:  ${at.length-sv.filter(p=>at.includes(p)).length}\nNot started:            ${allP.length-at.length}\nMastered (all 4 steps): ${allP.filter(mast).length}</pre></div>`; }

const practiceView = () => `<h1>📝 Practice</h1><p><button class="btn" data-act="random">🎲 Random Problem</button></p>
  <div class="card"><h3>Review Today</h3>${due().length ? due().map(p => `<div><a href="#/problem/${allP.indexOf(p)}">${esc(p.title)}</a> <button data-act="reviewed" data-key="${p.key}">Reviewed ✓</button></div>`).join('') : '<p class="muted">Nothing due. Mark a problem "Solved Without Help" to schedule reviews at 1, 3 and 7 days.</p>'}</div>
  <div class="card"><h3>Python Scratchpad</h3><textarea id="scr" rows="12" placeholder="# Write Python here. It is saved in this browser and never executed.">${esc(S.scratch)}</textarea><button data-act="clr">Clear</button></div>
  <div class="card"><h3>All Problems</h3>${allP.map((p,i) => `<div><a href="#/problem/${i}">${p.dif} ${esc(p.title)}</a> <small>${esc(p.t.title)} · ${level(p)}</small></div>`).join('')}</div>`;

const bmView = () => `<h1>⭐ Bookmarks</h1><div class="card">${S.bm.length ? S.bm.map(k => { const t = allT.find(x => x.key==k); if (t) return `<div>📖 <a href="#/topic/${t.mid}/${t.id}">${esc(t.title)}</a></div>`;
  const p = allP.find(x => x.key==k); return p ? `<div>📝 <a href="#/problem/${allP.indexOf(p)}">${esc(p.title)}</a></div>` : ''; }).join('') : '<p class="muted">Nothing bookmarked yet. Press ☆ on a topic or problem.</p>'}</div>`;

const settingsView = () => `<h1>⚙️ Settings</h1><div class="card"><h3>Your progress</h3><p class="row"><button data-act="export">⬇ Export Progress</button><label>Import Progress: <input type="file" id="imp" accept=".json"></label></p>
  <p><button data-act="reset">Reset Progress</button></p></div><div class="card"><h3>Shortcuts</h3><p>N next topic · P previous topic · B bookmark · R random problem</p></div>`;

function searchView(q){ q = q.toLowerCase(); const r = [];
  mods.forEach(m => (m.id+' '+m.title+' '+m.desc).toLowerCase().includes(q) && r.push(`📚 <a href="#/module/${m.id}">${esc(m.title)}</a>`));
  allT.forEach(t => t.title.toLowerCase().includes(q) && r.push(`📖 <a href="#/topic/${t.mid}/${t.id}">${esc(t.title)}</a> <small>${esc(t.mod.title)}</small>`));
  allP.forEach((p,i) => (p.title+' '+p.q).toLowerCase().includes(q) && r.push(`📝 Problem: <a href="#/problem/${i}">${esc(p.title)}</a>`));
  return `<h1>Search: ${esc(q)}</h1><div class="card">${r.length ? r.map(x => `<div>${x}</div>`).join('') : 'No results. Try a shorter word.'}</div>`; }

function random(){ const pool = allP.filter(p => !pp(p).s), src = pool.length ? pool : allP; if (!src.length) return;
  location.hash = '#/problem/' + allP.indexOf(src[Math.floor(Math.random()*src.length)]); }

// ---- router ----
function render(){ const [,r,a,b] = location.hash.split('/').map(decodeURIComponent), m = mods.find(x => x.id==a); let h;
  if (r=='module' && m) h = modView(m);
  else if (r=='topic' && m) { const t = m.topics.find(x => x.id==b); h = t ? topicView(m,t) : '<p>Topic not found.</p>'; }
  else if (r=='problem' && allP[a]) h = probView(allP[a]);
  else if (r=='progress') h = progView();
  else if (r=='practice') h = practiceView();
  else if (r=='bookmarks') h = bmView();
  else if (r=='settings') h = settingsView();
  else if (r=='search') h = searchView(a||'');
  else h = dash();
  $('#main').innerHTML = h; side(); hdr(); document.body.classList.remove('open'); window.scrollTo(0,0); }
function side(){ $('#side').innerHTML = `<a href="#/">🏠 Dashboard</a><b>📚 Modules</b>${mods.map(m => `<a href="#/module/${m.id}" class="${location.hash.includes('/'+m.id+'/')||location.hash.endsWith('/'+m.id)?'on':''}">${String(m.n+1).padStart(2,'0')} ${m.title} ${mPct(m)==100?'✅':''}</a>`).join('')}<b>Tools</b><a href="#/practice">📝 Practice</a><a href="#/progress">📊 Progress</a><a href="#/bookmarks">⭐ Bookmarks</a><a href="#/settings">⚙️ Settings</a>`; }
function hdr(){ $('#hp').textContent = 'Progress: ' + total() + '%'; $('#rv').classList.toggle('on', !!S.rev); }
const applyTheme = () => document.documentElement.dataset.theme = S.theme;

// ---- events ----
document.addEventListener('change', e => { const el = e.target;
  if (el.id == 'imp') { const f = el.files[0]; if (!f) return; const fr = new FileReader();
    fr.onload = () => { try { S = {...def, ...JSON.parse(fr.result)}; save(); applyTheme(); render(); alert('Progress imported ✓'); } catch { alert('That file is not valid progress JSON.'); } }; fr.readAsText(f); return; }
  const {ty,key,f} = el.dataset; if (!ty) return; const v = el.checked;
  if (ty=='T') { S.t[key] = S.t[key] || {}; S.t[key][f] = v; }
  else if (ty=='Tall') S.t[key] = {l:v,c:v,e:v};
  else if (ty=='P') setP(key,f,v);
  else S.plan[key] = v;
  save(); hdr(); side();
  document.querySelectorAll('[data-lvl]').forEach(s => { const p = allP.find(x => x.key==s.dataset.lvl); if (p) s.textContent = level(p); });
  if (ty=='Tall') render(); });
document.addEventListener('input', e => { if (e.target.id=='scr') { S.scratch = e.target.value; save(); }
  if (e.target.id=='q') location.hash = e.target.value.trim() ? '#/search/'+encodeURIComponent(e.target.value.trim()) : '#/'; });
document.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; const {act,key} = b.dataset;
  if (act=='menu') document.body.classList.toggle('open');
  else if (act=='theme') { S.theme = S.theme=='dark' ? 'light' : 'dark'; save(); applyTheme(); }
  else if (act=='rev') { S.rev = S.rev ? 0 : 1; save(); render(); }
  else if (act=='copy') { const ta = document.createElement('textarea'); ta.value = b.nextElementSibling.innerText; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); b.textContent = 'Copied ✓'; setTimeout(() => b.textContent = 'Copy Code', 1200); }
  else if (act=='bm') { toggleBm(key); b.textContent = S.bm.includes(key) ? '⭐' : '☆'; }
  else if (act=='note') { S.notes[key] = b.previousElementSibling.value; save(); b.textContent = 'Saved ✓'; setTimeout(() => b.textContent = 'Save Note', 1200); }
  else if (act=='day') { S.day = +b.dataset.n; save(); render(); }
  else if (act=='reviewed') { const x = S.p[key]; x.st = (x.st||0)+1; if (x.st < 3) x.nx = day([1,3,7][x.st]); else delete x.nx; save(); render(); }
  else if (act=='dry') { const el = b.closest('.dry'), t = allT.find(k => k.key==el.dataset.key); el.outerHTML = dryHtml(t, +el.dataset.i + +b.dataset.dir); }
  else if (act=='random') random();
  else if (act=='clr') { S.scratch = ''; save(); $('#scr').value = ''; }
  else if (act=='export') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'})); a.download = 'dsa-progress.json'; a.click(); }
  else if (act=='reset') { if (confirm('Are you sure?\n\nThis will delete:\n- Topic progress\n- Problem progress\n- Notes\n- Bookmarks\n- Revision history')) { localStorage.removeItem(K); location.hash = '#/'; location.reload(); } } });
document.addEventListener('keydown', e => { if (/INPUT|TEXTAREA/.test(e.target.tagName) || e.ctrlKey || e.metaKey) return;
  const [,r,a,b] = location.hash.split('/'), t = r=='topic' && allT.find(x => x.mid==a && x.id==b), i = allT.indexOf(t), k = e.key.toLowerCase();
  const go = x => x && (location.hash = `#/topic/${x.mid}/${x.id}`);
  if (k=='n' && t) go(allT[i+1]); if (k=='p' && t) go(allT[i-1]); if (k=='r') random(); if (k=='b' && t) { toggleBm(t.key); render(); } });
window.addEventListener('hashchange', render);
applyTheme(); render();
})();
