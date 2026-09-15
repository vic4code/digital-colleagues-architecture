(() => {
 const data=window.FRAMEWORK_MECHANISMS,target=document.getElementById('framework-mechanism-result');if(!data||!target)return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const atlas={openclaw:'flow-claw-0',hermes:'flow-hermes-8',claude:'flow-cc-0',codex:'flow-cx-1',voyager:'flow-v-0',openbot:'flow-ob-0'};
 const pathSourceIndex={openclaw:0,hermes:0,claude:1,codex:0,grok:0,voyager:0,openbot:0};
 function render(key){
  const f=data[key],flow=f.flow;
  target.innerHTML=`<div class="framework-heading"><div><small>${flow.sequence?'REPRESENTATIVE PATH · 一條代表路徑':'EVIDENCE GAP · 待查核'}</small><h3>${esc(f.name)} · ${esc(flow.title)}</h3></div><a class="source" href="#framework-matrix">↑ Framework matrix</a></div><p class="path-scope">${flow.sequence?'Flow / Sequence 是同一路徑的兩種視角。':'此處呈現證據線索，尚未確認可執行路徑。'}</p><div class="flow-switch" role="group" aria-label="Diagram view"><button type="button" data-diagram-view="flow" aria-pressed="true">Flow</button><button type="button" data-diagram-view="sequence" aria-pressed="false" ${flow.sequence?'':'disabled'}>${flow.sequence?'Sequence':'Sequence · Unverified'}</button></div><div data-diagram-panel="flow"><ol class="implementation-flow">${flow.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div>${flow.sequence?`<div data-diagram-panel="sequence" hidden><p class="diagram-scroll-hint">← Scroll horizontally · 窄螢幕可左右滑動 →</p><div class="sequence-scroll" role="region" tabindex="0" aria-label="${esc(f.name)} sequence diagram"><img src="${esc(flow.sequence)}" alt="${esc(f.name+' '+flow.title+' sequence: '+flow.steps.join(' → '))}"></div></div>`:''}<p class="framework-verdict">${esc(flow.note)}</p><div class="path-reading-links"><a class="source" href="${esc(f.items[pathSourceIndex[key]][6])}">Path source · 此路徑依據 ↗</a>${atlas[key]?`<a class="source atlas-link" href="mechanisms.html#${atlas[key]}">Explore all mechanisms · ${esc(f.name)} 機制圖譜 ↗</a>`:''}</div><p class="compact-note">${esc(f.version)}</p>`;
  document.querySelectorAll('[data-framework]').forEach(b=>{const selected=b.dataset.framework===key;b.setAttribute('aria-pressed',String(selected));b.closest('tr')?.classList.toggle('selected-framework',selected);});
  target.querySelectorAll('[data-diagram-view]').forEach(b=>b.addEventListener('click',()=>{target.querySelectorAll('[data-diagram-panel]').forEach(p=>p.hidden=p.dataset.diagramPanel!==b.dataset.diagramView);target.querySelectorAll('[data-diagram-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 }
 document.querySelectorAll('[data-framework]').forEach(b=>b.addEventListener('click',()=>{render(b.dataset.framework);target.scrollIntoView({block:'start'});}));
 render('openclaw');
})();
