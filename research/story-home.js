(() => {
  const $ = id => document.getElementById(id);
  const aliases = {overview:'human',bridge:'human',agent:'frameworks',proactive:'frameworks',decide:'frameworks',colleague:'scenarios',interaction:'scenarios',collaborate:'scenarios',context:'scenarios',practice:'architecture'};
  const resolve = () => { const target = aliases[location.hash.slice(1)]; if (target) $(target)?.scrollIntoView(); };
  addEventListener('hashchange', resolve); resolve();

  const components = {
    observe: ['Event Ingress · Polling Scheduler', '時間或來源事件喚起觀察。驗證、去重後交給既有 runtime；此時尚未指定新工作。', 'ingress'],
    context: ['AGENTS.md · skills/ · Memory', '補職責、觀察來源與選題指引；保存提案、證據與否決原因，避免每次想到同一件已處理的事。', 'state'],
    discovery: ['Codex app-server · Agent turn', '在既有回合裡，模型讀取職責與證據，推導值得做的工作。允許不提案；不另建一個常駐「靈感服務」。', 'runtime'],
    admission: ['Runtime Controller · Triage', 'Controller 組裝脈絡與派送；Triage／政策檢查範圍、授權與預算。想法由模型提出，動作仍受控。', 'application'],
    tools: ['MCP Tool Servers', '先讀來源、核對想法是否成立，再執行獲准動作。保存結果，供下一次觀察與判斷使用。', 'runtime'],
  };
  Object.assign(components, {
    client: ['Interaction surface', '單一同事介面：對話、提案、審閱與批准。自主發現的工作，也在這裡向人說明。', 'system'],
    identity: ['IDENTITY.md · SOUL.md', '定義同事身分、角色與表達方式；工作範圍由職責、政策與授權決定。', 'system'],
    controller: ['Runtime Controller', '維持 session、載入 workspace、套用政策與派送回合；採用框架承擔 runtime 控制。', 'runtime'],
    scheduler: ['Polling Scheduler', '以時間提供觀察機會；無 push 的來源可做有界輪詢。排程到期，不等於已選出要做的事。', 'ingress'],
    renewal: ['Subscription renewal', '更新外部來源的 push 訂閱期限；訂閱失效會失去觀察訊號，需要監測與補救。', 'ingress'],
    security: ['Access · Permissions · Audit', '來源讀取、提案與外部動作都受身分、範圍與授權約束，並保留稽核證據。', 'application'],
  });
  const contracts = {
    client: '輸入：人的訊息與批准。輸出：提案、成果與狀態。新提案與既有對話要能關聯同一同事。',
    identity: '沿用 workspace 檔案。人設不等於授權；不得從語氣或名字推導業務操作範圍。',
    context: '提案需連回 duty、來源版本、時間與否決紀錄。這是新增資料契約提案，既有 state detail 頁顯示基線責任。',
    controller: '先載入職責與可見來源，再開始選題回合；框架接口與本地 adapter 的實際接線需固定版本驗收。',
    discovery: '輸入：職責與有來源的現況。輸出：工作提案或不提案。推論在既有回合內，不另建模型常駐服務。',
    admission: '輸入：事件或工作提案。檢查範圍、去重、預算與批准條件，再允許對應動作；選題與授權分開。',
    observe: 'Webhook 先驗證、去重、正規化。保留 occurrence 與來源識別；觸發選題時仍需取得足夠現況。',
    scheduler: '保存執行時機、來源與職責關聯；過期、重複及沒有變化時都要有明確政策。',
    renewal: '期限與續訂失敗需可觀測；漏接的來源事件須經核准的補查路徑恢復。',
    tools: '把來源證據帶回模型；寫入前重新核對授權與最新狀態。投遞不確定時先核對，再決定是否重送。',
    security: '串起 observation、proposal、task、run 與 outcome。停用、拒絕與取消必須阻止後續動作。',
  };
  let architectureMode = 'before';
  let pinnedComponent = null;
  function describeComponent(key, expand = false) {
    const [title,copy,level] = components[key];
    $('arch-detail-title').textContent = title;
    $('arch-detail-copy').textContent = copy;
    $('arch-component-contract').textContent = contracts[key];
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
    $('arch-mode-note').textContent = mode === 'before' ? '既有 Phase 0.5 設計圖' : '原圖疊加 · 自主性整合提案';
    $('arch-original-link').href = mode === 'before' ? '../phases/0.5/reference-architecture.svg' : 'architecture-diagrams/initiative-on-original.svg';
    if (mode === 'before') {
      pinnedComponent = null;
      document.querySelectorAll('.pinned-component,.active-component').forEach(a => a.classList.remove('pinned-component','active-component'));
      $('arch-component-depth').open = false;
      $('arch-detail-title').textContent = '先看既有責任';
      $('arch-detail-copy').textContent = 'Controller 接收輸入；workspace 提供脈絡；Codex app-server 執行；MCP 連接來源與動作。';
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
  function renderMechanism(key) {
    const m = study.mechanisms[key];
    $('mechanism-result').innerHTML = `<p class="lab-label">${m.kind}</p><h3>${m.title}</h3><ol class="mechanism-steps">${m.steps.map((step,i)=>`<li><small>0${i+1}</small><b>${step}</b></li>`).join('')}</ol><div class="mechanism-bottom"><div><b>${m.question}</b><p>${m.answer}</p><small>${m.cost}</small></div><details><summary>展開實作路徑</summary><p>${m.interface}</p><pre>${escapeHTML(m.code)}</pre><small>路徑摘要，不是可直接執行程式。</small><a class="source" href="${m.href}">${m.source} ↗</a></details></div>`;
    document.querySelectorAll('[data-mechanism]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.mechanism===key)));
  }
  document.querySelectorAll('[data-mechanism]').forEach(b=>b.addEventListener('click',()=>renderMechanism(b.dataset.mechanism)));
  function renderCathay(key) {
    const c = study.cathay[key];
    $('cathay-result').innerHTML = `<div class="cathay-heading"><h3>${c.title}</h3><span>${c.source}</span></div><div class="cathay-phases">${c.phases.map(([phase,title,behavior,test])=>`<article><small>${phase}</small><b>${title}</b><p>${behavior}</p><details><summary>怎麼驗？</summary><p>${test}</p></details></article>`).join('')}</div><p class="scenario-boundary">${c.boundary}</p>`;
    document.querySelectorAll('[data-cathay]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cathay===key)));
  }
  document.querySelectorAll('[data-cathay]').forEach(b=>b.addEventListener('click',()=>renderCathay(b.dataset.cathay)));
  function renderTrace(key) {
    const t = study.traces[key];
    $('trace-result').innerHTML = `<div class="trace-rows">${t.rows.map(([stage,result])=>`<div><b>${stage}</b><code>${result}</code></div>`).join('')}</div><p>${t.conclusion}</p><small>預編觀測示例，非 production log。</small>`;
    document.querySelectorAll('[data-trace]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trace===key)));
  }
  document.querySelectorAll('[data-trace]').forEach(b=>b.addEventListener('click',()=>renderTrace(b.dataset.trace)));
  renderMechanism('polling'); renderCathay('legal'); renderTrace('proposal');
})();
