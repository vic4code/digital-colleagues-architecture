(() => {
  const $ = id => document.getElementById(id);
  const aliases = {overview:'human',bridge:'human',agent:'frameworks',proactive:'frameworks',decide:'frameworks',colleague:'scenarios',interaction:'scenarios',collaborate:'scenarios',context:'scenarios',practice:'architecture'};
  const resolve = () => { const target = aliases[location.hash.slice(1)]; if (target) $(target)?.scrollIntoView(); };
  addEventListener('hashchange', resolve); resolve();

  // Before describes the reference design; After is a proposed integration contract.
  const architectureComponents = {
    before: {
      observe: ['Event Ingress', 'Webhook verification、deduplication 與 buffering，接收外部服務事件。', 'ingress', 'Existing design：事件經 inbound integration 交給 runtime。原圖不表示 completion event、proposal routing 或 durable cursor 已接妥。'],
      scheduler: ['Polling Scheduler', 'Cron／heartbeat 提供時間入口；沒有 push 的來源採 bounded polling。', 'ingress', 'Existing design：排程與輪詢是服務整合責任。next_due、occurrence persistence 與重啟恢復契約仍須依部署版本確認。'],
      context: ['AGENTS.md · skills/ · Memory', 'Operating rules、domain workflows 與 daily／curated memory 提供工作脈絡。', 'state', 'Existing design：沿用 workspace 檔案。原圖未定義 role_card projection、goal checkpoint 或 proposal history 的資料契約。'],
      discovery: ['Codex app-server', 'Agent loop、thread／turn lifecycle、MCP client 與 approval events 執行工作。', 'runtime', 'Existing design：Controller 透過 app-server client 派送工作。具備 agent turn 不代表已實作自主選題或可恢復的 goal continuation。'],
      admission: ['Request Triage & Priority', 'Classification、urgency、impact 與 approval need 決定 routing／order。', 'application', 'Existing design：套用 AGENTS.md 與 skills policy。原圖未定義預算計數、completion validator 或 proposal deduplication。'],
      controller: ['Runtime Controller', 'Sessions、workspace loading、approvals 與 dispatch 連接 app-server。', 'runtime', 'Existing design：維持執行與人機互動邊界。此圖描述責任，不是特定 prototype adapter 的部署證明。'],
      tools: ['MCP Tool Servers', 'Vendor APIs 提供來源查詢與 outbound tools。', 'runtime', 'Existing design：每個服務分別接 inbound trigger 與 outbound tool。MCP tool call 本身不建立排程或選出新工作。'],
      client: ['Interaction surface', 'One approved binding 提供同一位數位同事的對話與互動入口。', 'system', 'Existing design：沿用 web／desktop／embodied UI。原圖未定義 proposal inbox 或 accept／reject／defer 的回饋狀態。'],
      identity: ['IDENTITY.md · SOUL.md', 'Identity、persona 與 tone 定義同事身分和表達方式。', 'system', 'Existing design：身分與語氣不授予工具權限；operating rules 與 access boundary 另行約束操作。'],
      renewal: ['Subscription renewal', 'Push TTL 到期前更新訂閱，維持外部事件入口。', 'ingress', 'Existing design：訂閱過期會中止來源通知；原圖沒有描述 renewal retry 與漏接補查的完整狀態契約。'],
      security: ['Access · Permissions · Audit', 'Cross-cutting boundary 約束每層來源、工具與操作。', 'application', 'Existing design：權限與稽核是跨層責任；原圖未提供 observation 到 proposal／outcome 的完整關聯 schema。'],
    },
    after: {
      observe: ['Event Ingress · Event triggers', 'P1–P3：verify → dedup → normalize；保留 event_id 與來源，再交 Controller。', 'ingress', 'Proposed integration · OpenClaw hooks／on-exit／stream、Hermes webhook：將 external、condition、completion event 正規化為 wake envelope。來源資料可靠保存後才推進 source cursor；重送不重複派工。'],
      scheduler: ['Polling Scheduler · Scheduled jobs', 'P1：保存 next_due／occurrence；到期 polling，比對來源後才 dispatch。', 'ingress', 'Proposed integration · OpenClaw automations、Hermes monitor、OpenBot routines：schedule＋timezone → next_due → occurrence key → durable dispatch。P2／P3 延用；Adaptive pacing 可接受有上下限的 next_check，不能改掉工作權限。'],
      context: ['Workspace · Context assembly', 'P1 role_card；P2 goal／checkpoint；P3 duty、evidence anchors 與 proposal history。', 'state', 'Proposed integration · Skill retrieval／memory：每輪驗角色版本，產生有大小上限的 context snapshot；對帳 waiting、已完成與已否決紀錄。role_card、checkpoint、proposal records 是新增契約；Memory files 不等於 durable state store。'],
      discovery: ['Codex app-server · Goal / Task selection', 'P2 執行既定 goal；P3 從職責與現況產生 candidate，查證後輸出 proposal。', 'runtime', 'Proposed integration · Codex continuation／Voyager curriculum 策略參考：context snapshot → candidate → MCP evidence → structured proposal／no_proposal。宿主驗 reference 可解析、符合 schema 與政策；模型不自行宣告驗收通過。Voyager 並非直接安裝的企業選題介面。'],
      admission: ['Triage · Admission / Validation', 'P1 執行前 gate；P2 completion validator；P3 evidence／duplicate／approval gate。', 'application', 'Proposed integration · 本專案控制層：enabled、paused、busy、budget 決定 admission，skip 留原因。P2 以程式完成證據分類 completed／blocked／exhausted；P3 驗 proposal 的來源、重複與工具範圍，再決定入 inbox 或拒絕。'],
      controller: ['Runtime Controller · Durable dispatch', 'P1 claim occurrence；P2 依 completion_event 恢復 goal；P3 派送 selection turn。', 'runtime', 'Proposed integration · OpenBot queue／lease、Codex goal：admission → context snapshot → app-server dispatch → completion_event → checkpoint。啟動 goal 前擋預算；每次續行重新驗政策，取消阻止後續 dispatch。queue／lease 與恢復接線仍待補，不由 app-server 自動保證。'],
      tools: ['MCP Tool Servers · Evidence / Actions', 'Read tools 回傳 source_id、version 與引用；write tools 僅在授權後執行。', 'runtime', 'Proposed integration · Observation／verification：Controller 傳入角色可見範圍；工具回傳可解析 evidence references 供宿主驗證。Approved action 執行前再核對權限與最新資料；結果不確定時先查 execution receipt，再決定是否重試。'],
      client: ['Interaction surface · Proposal inbox', 'P3 proposal 連回證據；accept／reject／defer 各自保存，Human review。', 'system', 'Proposed integration · Feedback loop：proposal_id 關聯原始 evidence 與 outcome；accept 才建立核准工作，reject 記否決範圍，defer 記延後期限。延後不得寫成永久否決；P1 產物與 P2 工作狀態共用原互動入口。'],
      identity: ['Identity · Role projection', 'Identity／persona 沿用；role_card 的職責與權限取自可驗證設定。', 'system', 'Proposed integration · Context assembly：每次 snapshot 記角色版本，讀不到必要設定即停止。Persona 不決定 tool whitelist；P3 的 duty 必須可連回人設定的角色與願景。'],
      renewal: ['Subscription renewal · Source recovery', '記錄 expires_at／renewal status；失敗告警，恢復後從 source cursor 補查。', 'ingress', 'Proposed integration · Event reliability：到期前續訂並有界重試；subscription lag 與 last_received 分開監測。補查仍經 Ingress verification／dedup，不能把來源中斷寫成 no_change。'],
      security: ['State / Audit · Reconciliation', 'P1 run／skip；P2 goal／checkpoint；P3 proposal／feedback，以 correlation ID 串接。', 'application', 'Proposed integration · Durable state：Audit 是原圖責任；State schema 是待補契約。保存 occurrence → event／snapshot → run → proposal／skip → outcome；成果可靠寫入後才提交處理 cursor。權限檢查與預算計數由宿主執行。'],
    },
  };
  let architectureMode = 'before';
  let pinnedComponent = null;
  let activeIntegration = null;
  function describeComponent(key, expand = false) {
    const component = architectureComponents[architectureMode][key];
    if (!component) return;
    const [title,copy,level,contract] = component;
    const delta=architectureMode==='after' && activeIntegration?.steps.find(step=>step.node===key);
    if (architectureMode==='after' && activeIntegration && !delta) return;
    $('arch-detail-title').textContent = delta ? delta.component : title;
    $('arch-detail-copy').textContent = delta ? delta.explanation : copy;
    $('arch-step-label').textContent = delta ? 'STEP '+(activeIntegration.steps.indexOf(delta)+1)+' / '+activeIntegration.steps.length+' · COMPONENT CHANGE' : 'EXISTING DESIGN';
    $('arch-contract-cards').replaceChildren();
    if(delta) {
      const action=document.createElement('strong');action.className='arch-action';action.textContent=delta.action;
      $('arch-contract-cards').append(action);
      const details=document.createElement('details');details.className='arch-code-details';
      const summary=document.createElement('summary');summary.textContent='Code / State · 展開實作細節';details.append(summary);
      for(const [label,value] of [['CODE · 新增實作',delta.change],['STATE · 要記住什麼',delta.state],['OUTPUT · 交給下一步',delta.output]]) {
        const row=document.createElement('div'),labelEl=document.createElement('small'),valueEl=document.createElement('p');
        labelEl.textContent=label;valueEl.textContent=value;row.append(labelEl,valueEl);details.append(row);
      }
      $('arch-contract-cards').append(details);
      const nav=document.createElement('div');nav.className='arch-step-nav';
      const index=activeIntegration.steps.indexOf(delta);
      for(const [offset,label] of [[-1,'← 上一步'],[1,'下一步 →']]) {
       const button=document.createElement('button');button.type='button';button.textContent=label;
       button.disabled=!activeIntegration.steps[index+offset];
       button.addEventListener('click',()=>selectComponent(activeIntegration.steps[index+offset].node));nav.append(button);
      }
      $('arch-contract-cards').append(nav);
    }
    $('arch-component-depth').hidden=!!delta;
    $('arch-component-contract').textContent=contract;
    $('arch-detail-link').href=delta ? activeIntegration.href : 'proactivity.html#architecture/'+architectureMode+'/'+level;
    $('arch-detail-link').textContent=delta ? 'Mechanism reference · '+activeIntegration.reference+' ↗' : '展開元件與實作來源 ↗';
    if (expand) {
      pinnedComponent = key;
      $('arch-component-depth').open = true;
      document.querySelectorAll('[data-original-node]').forEach(a => a.classList.toggle('pinned-component', a.dataset.originalNode === key));
    }
  }
  function setArchitecture(mode) {
    architectureMode = mode;
    $('arch-before').hidden = mode !== 'before'; $('arch-after').hidden = mode !== 'after';
    document.querySelectorAll('[data-arch-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.archMode === mode)));
    $('arch-mode-note').textContent = mode === 'before' ? 'Existing design · Phase 0.5' : 'After · '+(activeIntegration?.name || 'Implementation');
    document.querySelector('.original-workbench').classList.toggle('is-before',mode==='before');
    $('arch-original-link').href = mode === 'before' ? '../phases/0.5/reference-architecture.svg' : (activeIntegration?.diagramUrl || 'architecture-diagrams/initiative-on-original.svg');
    document.querySelector('.architecture-reading-tools a').href=$('arch-original-link').href;
    if (mode === 'before') {
      pinnedComponent = null;
      $('arch-contract-cards').replaceChildren();
      $('arch-component-depth').hidden=false;
      document.querySelectorAll('.pinned-component,.active-component,.route-component').forEach(a => a.classList.remove('pinned-component','active-component','route-component'));
      $('arch-component-depth').open = false;
      $('arch-step-label').textContent='EXISTING DESIGN';
      $('arch-detail-link').textContent='展開元件與實作來源 ↗';
      $('arch-detail-title').textContent = 'Before · Existing design';
      $('arch-detail-copy').textContent = 'Controller 接收輸入；workspace 提供脈絡；Codex app-server 執行；MCP 連接來源與動作。';
      $('arch-component-contract').textContent = '選取元件查看既有設計責任；After 顯示新增介面、狀態與控制契約。';
      $('arch-detail-link').href = 'proactivity.html#architecture/before/system';
      document.querySelectorAll('[data-component]').forEach(b => b.setAttribute('aria-pressed','false'));
    }
  }
  function selectComponent(key) {
    if(activeIntegration && !activeIntegration.steps.some(s=>s.node===key))return;
    setArchitecture('after');
    describeComponent(key, true);
    document.querySelectorAll('.integration-route [data-integration-node]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.integrationNode===key)));
    document.querySelectorAll('[data-component]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.component === key)));
    document.querySelectorAll('[data-arch-node]').forEach(a => a.classList.toggle('active-component', a.dataset.archNode === key));
  }
  function showIntegration(plan) {
    activeIntegration=plan;
    document.dispatchEvent(new CustomEvent('integrationpaint',{detail:plan}));
    selectComponent(plan.steps[0].node);
    document.querySelectorAll('[data-arch-node]').forEach(a=>a.classList.toggle('route-component',plan.steps.some(step=>step.node===a.dataset.archNode)));
    $('arch-mode-note').textContent='After · '+plan.name+' · '+plan.phase;
  }
  document.addEventListener('integrationselect',e=>showIntegration(e.detail));
  document.addEventListener('integrationnode',e=>selectComponent(e.detail));
  document.querySelectorAll('[data-arch-mode]').forEach(b => b.addEventListener('click', () => b.dataset.archMode === 'after' ? (activeIntegration ? showIntegration(activeIntegration) : selectComponent('discovery')) : setArchitecture('before')));
  document.querySelectorAll('[data-component]').forEach(b => b.addEventListener('click', () => selectComponent(b.dataset.component)));
  document.querySelectorAll('[data-arch-node]').forEach(a => {
    a.addEventListener('pointerenter', () => {if(!pinnedComponent)describeComponent(a.dataset.archNode);});
    a.addEventListener('focus', () => describeComponent(a.dataset.archNode));
    a.addEventListener('click', e => { e.preventDefault(); selectComponent(a.dataset.archNode); });
  });
  document.querySelectorAll('[data-original-node]').forEach(a => {
    a.addEventListener('pointerenter', () => describeComponent(a.dataset.originalNode));
    a.addEventListener('focus', () => describeComponent(a.dataset.originalNode));
    a.addEventListener('click', e => { e.preventDefault(); describeComponent(a.dataset.originalNode, true); });
  });
  document.querySelector('.original-architecture').addEventListener('pointerleave', () => {
    if (pinnedComponent) describeComponent(pinnedComponent);
  });

  const study = window.INITIATIVE_STUDY;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cases={
    legal:{title:'法務／法遵：一則公告，牽動哪份契約？',role:'協助檢視待續約契約',trigger:'Event · 公告 N-17 新增附件要求',evidence:[['公告 N-17','適用 A 類委外；需核對附件 X。'],['契約 C-042','分類為 A 類；附件清單沒有 X。']],proposal:'建議檢視 C-042 是否需補附件 X。',why:'公告適用範圍與契約分類相符，現有附件清單有缺口。',deliver:'產出 N-17 條文 × C-042 附件對照，交法遵人員確認適用性。',test:'未交辦 C-042；仍應指出此契約，並附公告段落與附件清單。',negative:'把契約改成不適用的 B 類 → 不應再提 C-042。',repeat:'C-042 × N-17 已評閱 → 不再產生同一提案。'},
    pm:{title:'PM：上游延後，想到哪個下游會受影響？',role:'追蹤跨團隊交付依賴',trigger:'Event · API-17 的交付日由 9/18 延至 9/23',evidence:[['API-17','新的交付日期：9/23。'],['UAT-08','原訂 9/21 開始；依賴 API-17。']],proposal:'建議檢視 UAT-08 的啟動日期。',why:'上游交付晚於下游開始日，且看板有明確依賴關係。',deliver:'產出受影響里程碑、依賴鏈與日期衝突對照，交 PM 決定調整。',test:'只提供日期變動，未交辦 UAT-08；應自行找出這項下游衝突。',negative:'移除 UAT-08 對 API-17 的依賴 → 不應再提此風險。',repeat:'同一日期變更已處理 → 不再提出相同延期建議。'},
    hr:{title:'HR：流程更新，哪份到職清單漏了一項？',role:'維護授權範圍內的到職流程',trigger:'Event · Onboarding SOP 由 v4 更新為 v5',evidence:[['SOP v5','新增設備領用確認步驟。'],['模板 T-03','仍引用 v4；没有設備領用欄位。']],proposal:'建議更新到職模板 T-03。',why:'模板版本落後，且缺少新流程要求的檢查項。',deliver:'產出 T-03 的欄位差異草稿，交流程負責人審閱。',test:'未指定 T-03；應從模板引用關係找出缺項，不使用員工個資。',negative:'T-03 已升至 v5 且欄位齊全 → 不應再提更新。',repeat:'同一模板變更已接受 → 不重複建立草稿提案。'},
    architect:{title:'Architect：新依賴出現，會不會違反既定設計？',role:'維護 ADR 與實作的一致性',trigger:'Event · PR #128 新增服務間資料庫連線',evidence:[['PR #128 diff','Service A 加入直連 Service B DB 的設定。'],['ADR-012（示例）','跨服務資料須走 API；不開放直接 DB 讀取。']],proposal:'建議檢視 PR #128 的資料存取方式。',why:'新增連線與 ADR 的存取約束可能衝突，需要作者確認。',deliver:'產出 diff 行號 × ADR 段落對照與 review 草稿，交架構師判斷。',test:'未交辦 PR #128 的架構檢查；仍應找到對應 ADR，且引用可解析。',negative:'ADR 明確允許這種連線 → 不應再報相同偏差。',repeat:'同一 diff 已被 review → 不再重提同一議題。'}
  };
  const alternateEvidence={legal:[['公告 N-17','只適用 A 類委外。'],['契約 C-042','分類改為 B 類；不在本公告範圍。']],pm:[['API-17','交付日仍為 9/23。'],['UAT-08','已解除 API-17 依賴，可獨立開始。']],hr:[['SOP v5','要求設備領用確認步驟。'],['模板 T-03','已更新 v5；設備領用欄位齊全。']],architect:[['PR #128 diff','新增同一筆跨服務 DB 連線。'],['ADR-012（示例）','已明確允許該服務的此類連線。']]};
  let cathayKey='legal';
  function renderCathay(key,mode='new') {
    cathayKey=key;
    const c=study.cathay[key],d=cases[key],h=escapeHTML;
    const result=mode==='new' ? ['PROPOSAL · 提出新工作',d.proposal,d.why] : mode==='irrelevant' ? ['SKIP · 條件不成立','不產生這件工作的提案',d.negative] : ['SKIP · 已處理','保留處理紀錄，不重提',d.repeat];
    $('cathay-result').innerHTML=`<div class="cathay-heading"><h3>${h(d.title)}</h3><small>示意資料 · 非國泰實際個案</small></div><p class="case-duty"><b>Role</b> ${h(d.role)}<span>人只給職責，未逐件交辦下面的工作。</span></p><div class="case-evidence-flow"><div class="case-inputs"><small>${h(d.trigger)}</small><div class="case-documents">${(mode==='irrelevant'?alternateEvidence[key]:d.evidence).map(([name,fact])=>`<article><b>${h(name)}</b><p>${h(fact)}</p></article>`).join('')}</div>${mode==='handled'?`<p class="case-history"><b>Proposal history</b> ${h(d.repeat)}</p>`:''}</div><span class="case-join" aria-hidden="true">→</span><article class="case-proposal"><small>${h(result[0])}</small><h4>${h(result[1])}</h4><p>${h(result[2])}</p></article></div><div class="case-deliverable"><b>Deliverable · 人會收到什麼？</b><p>${h(mode==='new'?d.deliver:'本輪沒有新提案；稽核留下來源、比對結果與 Skip 原因。')}</p><span>Human review · Accept / Reject / Snooze</span></div><div class="case-test"><div><b>Validation · 改一下資料，看判斷是否跟著改。</b><span>預編案例切換，非即時模型測試。</span></div><div class="scenario-switch" role="group" aria-label="切換驗證條件"><button type="button" data-case-mode="new" aria-pressed="${mode==='new'}">新證據</button><button type="button" data-case-mode="irrelevant" aria-pressed="${mode==='irrelevant'}">條件不成立</button><button type="button" data-case-mode="handled" aria-pressed="${mode==='handled'}">已經處理</button></div><p><b>Pass criterion</b> ${h(mode==='new'?d.test:mode==='irrelevant'?d.negative:d.repeat)}</p></div><details class="detail-level"><summary>Phase 1 → 3 · 同一職能的責任怎麼增加？</summary><div class="cathay-phases">${c.phases.map(([phase,title,behavior,test])=>`<article><small>${h(phase)}</small><b>${h(title)}</b><p>${h(behavior)}</p><details><summary>Validation</summary><p>${h(test)}</p></details></article>`).join('')}</div><p>${h(c.boundary)}</p></details>`;
    document.querySelectorAll('[data-cathay]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cathay===key)));
    $('cathay-result').querySelectorAll('[data-case-mode]').forEach(b=>b.addEventListener('click',()=>renderCathay(cathayKey,b.dataset.caseMode)));
  }
  document.querySelectorAll('[data-cathay]').forEach(b=>b.addEventListener('click',()=>renderCathay(b.dataset.cathay)));
  const traceStories = {
    proposal: ['有看、有依據，提案等人決定', ['收到新的來源資料', '找到角色相關的影響', '通過檢查，送進私有收件匣'], '有提案，不等於已證明有用；還要看人的評閱。'],
    quiet: ['有看，這次沒有值得處理的變化', ['定期檢查確實執行', '比對後沒有新素材', '記下跳過原因，這輪不叫模型'], '安靜是可解釋的結果；處理紀錄能證明它看過。'],
    outage: ['應該醒來，卻沒有留下任何紀錄', ['預定檢查時間已到', '找不到執行或跳過紀錄', '監測發現逾期，檢查排程與訂閱'], '缺少紀錄是故障訊號，不能當成「看過但沒事」。'],
  };
  function renderTrace(key) {
    const t = study.traces[key], [title,steps,meaning] = traceStories[key];
    $('trace-result').innerHTML = `<div class="trace-story"><h4>${title}</h4><ol>${steps.map(x=>`<li>${x}</li>`).join('')}</ol><p>${meaning}</p></div><details class="detail-level"><summary>Trace · 工程紀錄</summary><div class="trace-rows">${t.rows.map(([stage,result])=>`<div><b>${stage}</b><code>${result}</code></div>`).join('')}</div><p>${t.conclusion}</p></details><small>預編觀測示例，非 production log。</small>`;
      document.querySelectorAll('[data-trace]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trace===key)));
  }
  document.querySelectorAll('[data-trace]').forEach(b=>b.addEventListener('click',()=>renderTrace(b.dataset.trace)));
  renderCathay('legal'); renderTrace('proposal');
})();
