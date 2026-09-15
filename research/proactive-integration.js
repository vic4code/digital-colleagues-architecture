(() => {
 const target=document.getElementById('integration-plan');if(!target)return;
 // Proposed host contracts, not claims that upstream exposes these function names.
 const plans={
  heartbeat:{name:'Scheduled heartbeat',phase:'P1',reference:'OpenClaw · managed heartbeat job',href:'mechanisms.html#flow-claw-0',summary:'把巡檢設定變成可恢復的排程，到期後啟動既有 Agent turn。',steps:[
   {node:'context',component:'AGENTS.md / Workspace',change:'定義巡檢範圍、Schedule 與 Output contract。',state:'heartbeat_spec {scope, interval, output_schema}',output:'可載入的巡檢設定'},
   {node:'scheduler',component:'Polling Scheduler',change:'新增 reconcileSchedule()；保存到期工作，重啟後恢復。',state:'next_due / occurrence_id / last_run',output:'到期 → enqueueWake(occurrence)'},
   {node:'admission',component:'Request Triage',change:'新增 admitWake()；檢查 enabled、paused、idle 與 budget。',state:'admission_result / skip_reason',output:'Admit → Controller；Skip → Audit'},
   {node:'controller',component:'Runtime Controller',change:'將 Wake envelope＋巡檢設定送入 app-server；保存 run 結果。',state:'run_id / occurrence_id / outcome',output:'Agent turn → Fixed output / Skip'}]},
  monitor:{name:'Change-gated monitor',phase:'P1',reference:'Hermes · Cron monitor',href:'mechanisms.html#flow-hermes-8',summary:'先用程式比較來源；有新素材才花模型成本。',steps:[
   {node:'scheduler',component:'Polling Scheduler',change:'到期呼叫 pollSource()，而不是直接啟動模型。',state:'source_id / next_due',output:'向 MCP 要求本次資料'},
   {node:'tools',component:'MCP Tool Servers',change:'提供唯讀 readChanges(cursor)，回傳版本、hash 與可解析來源。',state:'source_version / observed_hash / source_refs',output:'Snapshot / Delta'},
   {node:'admission',component:'Request Triage',change:'新增 compareSnapshot()；unchanged → Skip，changed → 建立待處理 occurrence。',state:'observed_hash 與 processed_cursor 分開保存',output:'Changed → enqueueWake；NoMaterial → Audit'},
   {node:'controller',component:'Runtime Controller',change:'Changed 才組 context、開 turn；成功落地產物後才更新 processed_cursor。',state:'occurrence_id / run_id / processed_cursor',output:'一次變動 → 可追蹤的處理結果'}]},
  event:{name:'Event-triggered run',phase:'P1 → P2',reference:'OpenClaw hooks · Hermes Webhook',href:'mechanisms.html#flow-claw-2',summary:'把來源通知或工作完成事件，可靠地轉成一次可派送工作。',steps:[
   {node:'observe',component:'Event Ingress',change:'新增 normalizeEvent()；驗證來源、去重，轉成統一 Wake envelope。',state:'event_id / source / type / payload_ref / task_id?',output:'持久保存的 Event envelope'},
   {node:'controller',component:'Runtime Controller',change:'新增 routeEvent()；新來源事件送觀察 turn，completion 關聯既有 task 後恢復。',state:'event_id → task_id / session_id / claim',output:'Observation run / Resume task'},
   {node:'admission',component:'Request Triage',change:'派送前檢查角色來源白名單、busy 與 budget；重送不能再開同一工作。',state:'dedup_key / admission_result',output:'Admit / Queue / Skip'},
   {node:'discovery',component:'Codex app-server',change:'透過既有 turn 介面接收 Event context，回傳結果給 Controller。',state:'run_id / artifact_refs / status',output:'Result → State / Audit'}]},
  goal:{name:'Goal continuation',phase:'P2',reference:'Codex · active goal / idle continuation',href:'mechanisms.html#flow-cx-1',summary:'把「做完一輪」接到「驗收後再決定是否繼續」。',steps:[
   {node:'controller',component:'Runtime Controller',change:'新增 Goal state machine；接收 turn completion，讀取 checkpoint。',state:'goal_id / acceptance_criteria / checkpoint / status',output:'Completed turn → Validate'},
   {node:'admission',component:'Request Triage',change:'新增 validateCompletion() 與 budget gate；不採信模型自行宣告完成。',state:'validation_evidence / attempts / budget_used',output:'Complete / Continue / Blocked / Exhausted'},
   {node:'discovery',component:'Codex app-server',change:'Continue 才開下一 turn；帶入未通過的驗收結果與剩餘工作。',state:'thread_id / turn_id / goal_id',output:'下一輪產物與執行結果'},
   {node:'context',component:'Workspace / State contracts',change:'保存部分成果、等待條件與完成證據，恢復時先對帳。',state:'checkpoint / waiting_on / artifact_refs',output:'Resume 不從零開始'}]},
  pacing:{name:'Adaptive pacing',phase:'P1+ · Optional',reference:'OpenClaw · next_check',href:'mechanisms.html#flow-claw-6',summary:'允許 Agent 建議下次查看時機，由宿主驗證後重排。',steps:[
   {node:'discovery',component:'Codex app-server',change:'在 run 輸出附帶 next_check 建議；這只改節律，不建立新目標。',state:'run_id / proposed_delay',output:'Pacing proposal'},
   {node:'admission',component:'Request Triage',change:'新增 validatePacing()；比對 job/run 身分、成功狀態與 pacing_enabled。',state:'job_id / run_id / min_delay / max_delay',output:'Accepted delay / Rejected'},
   {node:'scheduler',component:'Polling Scheduler',change:'限制 delay 上下限，更新 next_due；未接受則保留原排程。',state:'next_due / accepted_delay',output:'受控的下一次喚醒'}]},
  proposal:{name:'Evidence-grounded task proposal',phase:'P3',reference:'Codex · turn/start；OpenClaw · Heartbeat prompt',href:'reading/research/source-notes/phase-task-discovery.html',summary:'沿用 Time / Event 開啟 discovery turn；人設定職責，Agent 依新證據提出未逐件交辦的工作。',steps:[
   {node:'context',component:'AGENTS.md / Memory / State',change:'新增 buildProposalContext()；載入 duty、權限、來源與已提案／退回紀錄。',state:'role_card / source_anchors / proposal_history',output:'角色範圍內的選題 context'},
   {node:'discovery',component:'Codex app-server',change:'新增 discovery prompt：依職責找值得做的新工作；以 outputSchema 回傳 candidate {duty, evidence, suggested_action} 或 Skip。',state:'candidate_id / duty_ref / evidence_refs / action',output:'未逐件交辦的新工作候選'},
   {node:'tools',component:'MCP Tool Servers',change:'查證 candidate 的來源與關聯，回傳可解析證據。',state:'resolved_refs / source_versions',output:'Verified evidence / Unsupported'},
   {node:'admission',component:'Triage → Interaction surface',change:'新增 validateProposal()；檢查相關性、重複與授權，通過才進私有 Inbox。',state:'proposal_id / dedup_key / Accept / Reject / Snooze',output:'Human review → Feedback history'}]}
 };
 // Reading layer: actions first; exact proposed contracts remain expandable.
 const reading={
  heartbeat:{label:'定期巡檢',headline:'時間到了，啟動一次巡檢。',rule:'Schedule 決定何時跑；Workspace 決定這輪檢查什麼。',actions:[['設定巡檢範圍','把要看的來源、檢查頻率與產物格式寫成設定。'],['到期排入工作','保存下次執行時間，服務重啟也能接回排程。'],['判斷能否執行','停用、暫停、忙碌或預算不足，就留下原因並跳過。'],['啟動巡檢並記錄','Controller 帶入巡檢設定，交給 Codex 執行並保存結果。']]},
  monitor:{label:'有變化才執行',headline:'先查資料有沒有變，再決定要不要叫 Agent。',rule:'No change → Skip；有新資料 → Agent turn。',actions:[['定期查來源','Scheduler 到期後先查資料，不直接呼叫模型。'],['取回最新版本','MCP 讀取來源，回傳版本與可追溯的資料連結。'],['比較是否有變','Triage 比對已處理版本；沒有新資料就記錄 Skip。'],['有變才交給 Agent','Controller 把新資料交給 Codex；產物保存成功後，才標記已處理。']]},
  event:{label:'事件到了就處理',headline:'收到事件，先確認來源，再交給 Agent。',rule:'新資料 → 開始觀察；任務完成通知 → 接回既有工作。',actions:[['驗證並接收事件','Ingress 驗證來源、排除重複通知，保存事件。'],['找到對應工作','Controller 判斷要開新工作，還是接回正在等待的任務。'],['檢查權限與預算','Triage 決定立即執行、排隊或跳過；同一事件只派送一次。'],['帶入事件並執行','Codex 使用事件內容執行，結果交回 Controller 保存。']]},
  goal:{label:'做到驗收通過',headline:'每輪做完都驗收；沒達標才繼續。',rule:'有證據才 Complete；否則 Continue、Blocked 或 Exhausted。',actions:[['接回目標與進度','Controller 取回目標、驗收標準，以及上輪完成的部分。'],['驗收這一輪成果','Triage 檢查完成證據與剩餘預算，決定繼續或停止。'],['處理未完成部分','Codex 收到未通過的項目，只繼續剩下的工作。'],['保存續行進度','將成果與等待條件寫回，下次從這裡接續。']]},
  pacing:{label:'調整下次檢查',headline:'Agent 建議何時再看，宿主決定是否採用。',rule:'只能調整檢查間隔；仍受最短／最長間隔限制。',actions:[['建議再檢查時機','Codex 根據本輪結果，提出下次檢查的間隔。'],['檢查間隔是否合理','Triage 驗證建議屬於本輪工作，並套用時間上下限。'],['更新下次排程','Scheduler 保存核准的到期時間，之後再啟動一輪。']]},
  proposal:{label:'自己提出新工作',headline:'依職責與新證據，想到未被交辦的工作。',rule:'Time / Event 開啟觀察；Agent 產生候選工作，人決定是否採用。',actions:[['讀職責與現況','Workspace 提供角色、授權來源，以及過去提案與退回紀錄。'],['產生新工作候選','Codex 推導值得處理的事，附上理由；無適合工作也可 Skip。'],['查證提案依據','MCP 確認來源存在且支持提案，避免把猜測當成事實。'],['檢查後交人決定','Triage 檢查相關性、重複與授權，再送 Inbox 接受、退回或延後。']]}
 };
 Object.entries(plans).forEach(([key,plan])=>{Object.assign(plan,reading[key]);plan.steps.forEach((step,i)=>{[step.action,step.explanation]=plan.actions[i];});});
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(key){
  const plan=plans[key];
  document.getElementById('integration-choice').value=key;
  target.innerHTML=`<div class="integration-heading"><div><small>${esc(plan.name)} · ${esc(plan.phase)}</small><h3>${esc(plan.headline)}</h3><p>${esc(plan.rule)}</p></div></div>
   <ol class="integration-route" aria-label="執行順序；點選步驟查看元件修改">${plan.steps.map(s=>`<li><button type="button" data-integration-node="${s.node}" aria-pressed="false"><b>${esc(s.action)}</b><small>${esc(s.component)}</small></button></li>`).join('')}</ol>
   <details class="integration-contracts"><summary>Implementation table · 展開完整 Code / State / Output</summary><div class="table-scroll integration-delta" role="region" tabindex="0" aria-label="Selected mechanism implementation changes"><table><thead><tr><th>Component · 修改位置</th><th>Code · 新增實作</th><th>State · 要記住什麼</th><th>Output · 交給下一步</th></tr></thead><tbody>${plan.steps.map((s,i)=>`<tr><th scope="row"><button type="button" data-integration-node="${s.node}"><small>STEP ${i+1}</small>${esc(s.component)}</button></th><td>${esc(s.change)}</td><td><code>${esc(s.state)}</code></td><td>${esc(s.output)}</td></tr>`).join('')}</tbody></table></div><p class="compact-note">Function / schema 名稱為本架構的提案契約，需在宿主實作。</p><a class="source" href="${esc(plan.href)}">Reference · ${esc(plan.reference)} ↗</a></details>`;
  document.querySelectorAll('[data-integration]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.integration===key)));
  document.dispatchEvent(new CustomEvent('integrationselect',{detail:plan}));
  target.querySelectorAll('[data-integration-node]').forEach(b=>b.addEventListener('click',()=>{
   document.dispatchEvent(new CustomEvent('integrationnode',{detail:b.dataset.integrationNode}));
   document.querySelector('.arch-layout').scrollIntoView({block:'start'});
  }));
 }
 document.getElementById('integration-choice').addEventListener('change',e=>render(e.target.value));
 const captions={
  'Scheduled heartbeat':[['Workspace','ADD heartbeat_spec'],['Polling Scheduler','ADD persistent next_due'],['Request Triage','ADD admitWake() → Admit / Skip'],['Runtime Controller','ADD Wake envelope → Agent turn → save result']],
  'Change-gated monitor':[['Polling Scheduler','ADD pollSource()'],['MCP Tool Servers','ADD readChanges(cursor)'],['Request Triage','ADD compareSnapshot() → Changed / Skip'],['Runtime Controller','ADD Changed → turn; persist output → advance cursor']],
  'Event-triggered run':[['Event Ingress','ADD normalizeEvent()'],['Runtime Controller','ADD routeEvent() → Observation / Resume task'],['Request Triage','ADD whitelist + dedup + budget → Admit / Queue / Skip'],['Codex app-server','USE turn/start(Event context) → result']],
  'Goal continuation':[['Runtime Controller','ADD Goal state machine + checkpoint'],['Request Triage','ADD validateCompletion() → Continue / Complete / Blocked'],['Codex app-server','USE next turn with validation feedback'],['Workspace / State','ADD checkpoint + waiting_on + artifact_refs']],
  'Adaptive pacing':[['Codex app-server','ADD proposed_delay output'],['Request Triage','ADD validatePacing() + min / max bounds'],['Polling Scheduler','ADD bounded next_due']],
  'Evidence-grounded task proposal':[['Workspace / State','ADD duty + evidence + proposal history'],['Codex app-server','ADD discovery prompt → candidate / Skip'],['MCP Tool Servers','ADD verify evidence_refs'],['Request Triage → Inbox','ADD validateProposal() → Accept / Reject / Snooze']]
 };
 const ns='http://www.w3.org/2000/svg';
 document.addEventListener('integrationpaint',({detail:plan})=>{
  document.querySelectorAll('.implementation-label').forEach(n=>n.remove());
  document.querySelectorAll('#arch-after [data-arch-node]').forEach(a=>{
   a.classList.toggle('not-in-route',!plan.steps.some(s=>s.node===a.dataset.archNode));
  });
  plan.steps.forEach((step,i)=>{
   const a=document.querySelector('#arch-after [data-arch-node="'+step.node+'"]');if(!a)return;
   const r=a.querySelector('rect'),x=+r.getAttribute('x'),y=+r.getAttribute('y'),w=+r.getAttribute('width'),h=+r.getAttribute('height');
   const g=document.createElementNS(ns,'g');g.setAttribute('class','implementation-label');g.setAttribute('pointer-events','none');
   const rect=document.createElementNS(ns,'rect');for(const [k,v] of Object.entries({x:x+2,y:y+2,width:w-4,height:h-4,rx:4,fill:'#e5f1fd'}))rect.setAttribute(k,v);g.append(rect);
   const label=captions[plan.name]?.[i]||[step.component,step.output];
   [[(i+1)+'  '+label[0],y+15,11,'700'],[step.action,y+30,12,'600']].forEach(([value,ty,size,weight])=>{
    const t=document.createElementNS(ns,'text');t.setAttribute('x',x+9);t.setAttribute('y',ty);t.setAttribute('font-size',size);t.setAttribute('font-weight',weight);t.setAttribute('fill','#075ba1');t.textContent=value;g.append(t);
   });a.append(g);a.setAttribute('aria-label','Step '+(i+1)+' '+step.component+': '+step.change);
  });
  if(plan.diagramUrl)URL.revokeObjectURL(plan.diagramUrl);
  const exportSvg=document.querySelector('#arch-after svg').cloneNode(true);
  exportSvg.classList.add('original-architecture');
  exportSvg.setAttribute('viewBox',document.querySelector('#arch-after svg').dataset.fullViewbox || exportSvg.getAttribute('viewBox'));
  plan.diagramUrl=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(exportSvg)],{type:'image/svg+xml'}));
 });
 render('monitor');
})();
