(()=>{'use strict';
const $=id=>document.getElementById(id), study=window.PROACTIVITY_STUDY;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageNames={overview:'Overview · 研究全貌',human:'Human cognition · 人的思考',taxonomy:'Mechanisms · 觸發與執行',architecture:'Architecture · 架構整合',scenarios:'Scenarios · 工作情境',verification:'Verification · 驗收與穩定性'};
const levelNames={system:'System context',application:'Application components',ingress:'Event ingress',runtime:'Runtime boundary',state:'State & artifacts'};
let page='overview', mode='before', level='system', chosen='application', scenarioIndex=0;
function route(){
 const parts=location.hash.slice(1).split('/'), nextPage=parts[0]||'overview';page=Object.hasOwn(pageNames,nextPage)?nextPage:'overview';
 document.querySelectorAll('[data-page]').forEach(el=>el.hidden=el.dataset.page!==page);
 document.querySelectorAll('.study-nav nav a').forEach(a=>{if(a.hash.slice(1).split('/')[0]===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('breadcrumb').innerHTML='<a href="#overview">Research map</a> <span> / '+esc(pageNames[page])+'</span>';
 if(page==='architecture'){
  mode=parts[1]==='after'?'after':'before';level=Object.hasOwn(levelNames,parts[2])?parts[2]:'system';
  $('breadcrumb').innerHTML+=' / '+esc(mode==='before'?'Before':'After')+' / '+esc(levelNames[level]);renderArchitecture(parts[3]);
 }
 if(page==='scenarios')renderScenario(scenarioIndex);
 document.title=pageNames[page]+'｜數位同事研究';
}
function renderArchitecture(requested){
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 $('architecture-root').disabled=level==='system';
 $('architecture-summary').textContent=mode==='before'?'Before · 已有 event ingress、task state 與 OpenClaw adapter。Source inspection 顯示路徑存在；不代表 production 驗證通過。':'After · 重用既有元件，新增情境排程配置、業務跟進紀錄與驗收。藍色虛線是 proposed integration，不是已完成接線。';
 $('architecture-diagram').innerHTML=window.ARCHITECTURE_DIAGRAMS[mode+'-'+level];
 const keys=[...$('architecture-diagram').querySelectorAll('g.node>title')].map(t=>t.textContent);
 $('architecture-node-list').innerHTML=keys.map(key=>'<button data-node="'+key+'">'+esc(study.nodes[key].name)+'</button>').join('');
 $('architecture-node-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectNode(b.dataset.node,true)));
 $('architecture-diagram').querySelectorAll('a').forEach(a=>{
  const href=a.getAttribute('href')||a.getAttribute('xlink:href')||'', key=href.replace('#node-','');
  a.setAttribute('tabindex','0');a.setAttribute('aria-label',study.nodes[key]?.name+' · 開啟實作細節');
  a.addEventListener('click',e=>{e.preventDefault();selectNode(key,true);});
  a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(key,true);}});
  if(study.nodes[key]?.status==='External')a.querySelectorAll('path,polygon').forEach(p=>{p.setAttribute('stroke','#7b849c');p.setAttribute('stroke-width','2');p.setAttribute('fill','#f2f2f8');});
 });
 $('svg-download').href='architecture-diagrams/'+mode+'-'+level+'.svg';$('png-download').href='architecture-diagrams/'+mode+'-'+level+'.png';
 $('diagram-caveat').textContent=level==='system'?'¹ Native wake / next check：先核對固定的 OpenClaw 版本、profile、排程接口與狀態讀寫契約。此圖為邏輯整合關係，沒有表示 distributed deployment。':level==='application'?'² Admission 表示接入控制責任，並非 assertAutomationAdmission → dispatchAutomation 的直接函式呼叫。請看右側原始碼。':level==='state'?'此層顯示資料責任與關聯；task association 不是 store 間的直接函式呼叫。':'箭頭顯示邏輯責任；外部核心與本 repo 的程式碼邊界分開呈現。';
 selectNode(keys.includes(requested)?requested:keys.includes(chosen)?chosen:keys[0],false);
}
function selectNode(key,update){
 const n=study.nodes[key];if(!n)return;chosen=key;
 if(update)history.replaceState(null,'','#architecture/'+mode+'/'+level+'/'+key);
 $('architecture-node-list').querySelectorAll('[data-node]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.node===key)));
 $('architecture-diagram').querySelectorAll('g.node').forEach(g=>g.classList.toggle('selected-node',g.querySelector('title')?.textContent===key));
 const code=n.source&&window.IMPLEMENTATION_EXCERPTS.prototype[n.source];
 $('component-detail').innerHTML='<span class="badge '+n.status.toLowerCase()+'">'+n.status+' · '+({Existing:'原始碼已有',External:'外部套件',Proposed:'整合提案'}[n.status])+'</span><h2>'+esc(n.name)+'</h2><h3>'+esc(n.cn)+'</h3><p>'+esc(n.text)+'</p>'+
 (n.child?'<a class="study-primary" href="#architecture/'+mode+'/'+n.child+'">Expand components · 展開元件 →</a>':'')+
 (n.links||[]).map(([title,url])=>'<a href="'+esc(url)+'">'+esc(title)+' ↗</a>').join('')+
 (code?'<p class="source-meta">VERBATIM SOURCE · '+esc(code.path)+':'+code.start+'–'+code.end+'<br>commit '+code.commit.slice(0,12)+'</p><pre><code>'+esc(code.text)+'</code></pre><p class="fine">固定版本摘錄。完整 runtime 行為仍需要 integration test。</p>':'<p class="fine">此節點未內嵌原始碼摘錄；請沿來源或子元件繼續追查。</p>');
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>location.hash='architecture/'+b.dataset.mode+'/'+level+(chosen?'/'+chosen:'')));
$('architecture-root').addEventListener('click',()=>location.hash='architecture/'+mode+'/system');
function renderScenario(i){scenarioIndex=i;const s=study.scenarios[i];
 $('scenario-tabs').innerHTML=study.scenarios.map((v,k)=>'<button data-scenario="'+k+'" aria-pressed="'+(k===i)+'">'+esc(v.name)+'<small>'+esc(v.cn)+'</small></button>').join('');
 $('scenario-tabs').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>renderScenario(Number(b.dataset.scenario))));
 $('scenario-detail').innerHTML='<div class="scenario-stage"><div class="scenario-clock">'+esc(s.time)+'<small>'+esc(s.cue)+'</small></div><div><h2>「'+esc(s.question)+'」</h2><div class="scenario-chain">'+s.chain.map((c,k)=>(k?'<i aria-hidden="true">→</i>':'')+'<span>'+esc(c)+'</span>').join('')+'</div></div></div><div class="scenario-columns"><article><h3>Observation · 看什麼</h3><p>'+esc(s.observe)+'</p></article><article><h3>Action · 做什麼</h3><p>'+esc(s.action)+'</p></article><article><h3>Acceptance · 怎樣算完成</h3><p>'+esc(s.oracle)+'</p></article></div><div class="scenario-delta"><p><b>Before · </b>'+esc(s.existing)+'</p><p><b>After · </b>'+esc(s.delta)+'</p><p>'+s.mechanisms.map((id,k)=>'<a href="mechanisms.html#'+id+'">Framework '+(k+1)+' · Flow / Sequence / Code ↗</a>').join('　')+'</p></div>';
}
// Illustrative business policy, deliberately separate from upstream source.
function meetingCheck({readFailed,evidenceAvailable,alreadyContacted}){
 if(readFailed)return {action:'RETRY',reason:'Read failed · 保留未知狀態，安排重試；不能當成缺件。'};
 if(evidenceAvailable)return {action:'PREPARE',reason:'Evidence available · 整理 briefing 並附來源；是否已投遞需另行驗證。'};
 if(alreadyContacted)return {action:'WAIT',reason:'Already contacted · 等待回覆，這次不重複追問。'};
 return {action:'ASK',reason:'Missing evidence · 向指定 owner 追問缺件；保留跟進紀錄。'};
}
$('fixture-code').textContent=meetingCheck.toString();
$('run-fixture').addEventListener('click',()=>{const result=meetingCheck({readFailed:$('fixture-read-fail').checked,evidenceAvailable:$('fixture-ready').checked,alreadyContacted:$('fixture-asked').checked});$('fixture-result').textContent=result.action+' → '+result.reason;});
window.addEventListener('hashchange',()=>{route();$('study-main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});route();
})();
