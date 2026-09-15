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
  function describeComponent(key, expand = false) {
    const component = architectureComponents[architectureMode][key];
    if (!component) return;
    const [title,copy,level,contract] = component;
    $('arch-detail-title').textContent = title;
    $('arch-detail-copy').textContent = copy;
    $('arch-component-contract').textContent = contract;
    $('arch-detail-link').href = 'proactivity.html#architecture/' + architectureMode + '/' + level;
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
    $('arch-mode-note').textContent = mode === 'before' ? 'Existing design · Phase 0.5' : 'Proposed integration · Mechanisms → Components';
    $('arch-original-link').href = mode === 'before' ? '../phases/0.5/reference-architecture.svg' : 'architecture-diagrams/initiative-on-original.svg';
    if (mode === 'before') {
      pinnedComponent = null;
      document.querySelectorAll('.pinned-component,.active-component').forEach(a => a.classList.remove('pinned-component','active-component'));
      $('arch-component-depth').open = false;
      $('arch-detail-title').textContent = 'Before · Existing design';
      $('arch-detail-copy').textContent = 'Controller 接收輸入；workspace 提供脈絡；Codex app-server 執行；MCP 連接來源與動作。';
      $('arch-component-contract').textContent = '選取元件查看既有設計責任；After 顯示新增介面、狀態與控制契約。';
      $('arch-detail-link').href = 'proactivity.html#architecture/before/system';
      document.querySelectorAll('[data-component]').forEach(b => b.setAttribute('aria-pressed','false'));
    }
  }
  function selectComponent(key) {
    setArchitecture('after');
    describeComponent(key, true);
    document.querySelectorAll('[data-component]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.component === key)));
    document.querySelectorAll('[data-arch-node]').forEach(a => a.classList.toggle('active-component', a.dataset.archNode === key));
  }
  document.querySelectorAll('[data-arch-mode]').forEach(b => b.addEventListener('click', () => b.dataset.archMode === 'after' ? selectComponent('discovery') : setArchitecture('before')));
  document.querySelectorAll('[data-component]').forEach(b => b.addEventListener('click', () => selectComponent(b.dataset.component)));
  document.querySelectorAll('[data-arch-node]').forEach(a => {
    a.addEventListener('pointerenter', () => describeComponent(a.dataset.archNode));
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
  const discoveries = {
    legal: ['新公告發布', '角色：契約與法遵支援', '待續約契約可能受影響', '「值得先核對相關契約。」'],
    pm: ['上游交付日期延後', '角色：跨團隊交付協調', '下游里程碑可能受影響', '「值得先檢查下游依賴。」'],
    hr: ['到職流程規範更新', '角色：到離職流程支援', '現有交接清單可能過時', '「值得先核對適用清單。」'],
    architect: ['程式加入新的外部依賴', '角色：維護架構一致性', '可能與既有 ADR 衝突', '「值得先查證設計偏差。」'],
  };
  const caseChecks = {legal: '移除公告或契約關聯 → 不得產生該契約提案', pm: '日期未變或依賴已解除 → 不得重提同一交付風險', hr: '規範不適用或超出資料權限 → 不得產生個案提案', architect: 'Diff 不存在或 ADR 已允許 → 不得提同一漂移'};
  function renderCathay(key) {
    const c = study.cathay[key], d = discoveries[key];
    $('cathay-result').innerHTML = `<div class="cathay-heading"><h3>${c.title}</h3><span>${c.source}</span></div><div class="discovery-story"><div class="discovery-input"><small>Event</small><b>${d[0]}</b><span>${d[1]}</span></div><span class="discovery-link" aria-hidden="true">↗</span><div class="discovery-thought"><small>Context → Proposal</small><span>${d[2]}</span><blockquote>${d[3]}</blockquote></div><div class="discovery-delivery"><small>Human review</small><b>附來源的檢視提案</b><span>Accept / Reject / Snooze</span></div></div><div class="case-validation"><b>Negative control</b><span>${caseChecks[key]}</span></div><p class="scenario-boundary">${c.boundary}</p><details class="detail-level"><summary>Use case × Phase · Output / Validation</summary><div class="cathay-phases">${c.phases.map(([phase,title,behavior,test])=>`<article><small>${phase}</small><b>${title}</b><p>${behavior}</p><details><summary>Validation</summary><p>${test}</p></details></article>`).join('')}</div></details>`;
      document.querySelectorAll('[data-cathay]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cathay===key)));
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
