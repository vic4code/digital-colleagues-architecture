(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const names = ['從人到 Agent', '人怎麼想起', '從行為到工程', '觸發與判斷', '同一個工作情境', 'Framework 的價值', '另一種能力', '合作的細節', '共用脈絡', '從一件事開始'];
  const dialog = document.getElementById('sources-dialog');
  const sourceButton = document.getElementById('open-sources');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  let current = 0;
  let wake = 'time';
  let decision = 'pending';
  const sourceNotes = {
 human: ['研究區分意圖的監測與自發提取；內在思考另涉及記憶、模擬與認知控制。', [['https://pubmed.ncbi.nlm.nih.gov/16131267/','前瞻記憶：監測與自發提取','Einstein et al., 2005 · 實驗研究'],['https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/','內在生成的思考','Andrews-Hanna et al., 2014 · 綜述']]],
 bridge: ['工程對照是本研究的設計抽象，不是神經科學的等價模型。', [['mechanisms.html','完整機制圖譜','七個框架：情境、流程、分支與來源']]],
    overview: ['這份簡報整理兩條研究主線。主動工作關注執行機會與接續；同事互動關注共同工作時的回應與協調。', [['reading/research/proactive-work.html','主動工作','觸發、判斷、執行與框架比較'],['reading/research/colleague-interaction.html','同事互動','接話、修正、群組參與與交接']]],
    proactive: ['time／event 是本研究採用的高層工程抽象。持續執行的迴圈不必每一步都等待 timer；不代表程式一定使用 event bus。', [['reading/research/source-notes/proactive-trigger-mechanisms.html','觸發與進階機制','七個框架的固定版本呼叫路徑'],['reading/research/source-notes/loop-graph-implementation.html','Loop 與 workflow','區分喚醒、持續執行和流程狀態']]],
    decide: ['互動案例是假設已接好來源、收件人身分與授權的設計示範。先確認最新證據；沒有找到完成證據，不等於斷言對方沒做。', [['reading/research/source-notes/commitment-followup-design.html','Alex 承諾跟進情境','狀態、完成證據、收件人與送達'],['reading/research/source-notes/colleague-experience.html','共同責任與狀態','區分 memory、work、execution／delivery']]],
    frameworks: ['這是代表機制對照，不是產品能力排名。Grok Bot 採非官方重建來源；Claude Code goal 評估器只讀對話呈現的證據，並不自行跑驗證。', [['reading/research/source-notes/proactive-trigger-mechanisms.html','完整固定版本與限制','變化比對、pacing、completion、goal、curriculum'],['reading/research/source-notes/openclaw-inferred-commitments.html','OpenClaw commitments 歷史','曾存在，現已退役；不能當作目前功能'],['reading/research/source-notes/prioritization.html','更多研究型方法','反思、任務選擇與 learning progress']]],
    interaction: ['同事互動是獨立的體驗議題，不以訊息量或排程頻率衡量。這裡是本專案的互動契約提案，並非宣稱所有框架已實現。', [['reading/research/colleague-interaction.html','互動設計與驗收','接手、修正、進度、群組與交接'],['reading/research/source-notes/initiative-grok.html','Grok Bot 重建的回應政策','背景工作與使用者等待成果的差異']]],
    collaborate: ['示意對話不是官方產品錄影。改方向需要實際更新工作狀態；已執行的外部動作不會因為收到新訊息就自動撤回。', [['reading/research/colleague-interaction.html','合作情境與證據','OpenClaw steering／group policy、Grok 回應政策'],['show-me-colleague-interaction.html','展開全部互動情境','完整對話、機制說明與驗收條件']]],
    context: ['共用狀態是我們的設計整合，不是某個 framework 原生的完整資料模型。記憶、工作責任和送達證據各有不同用途。', [['reading/research/source-notes/colleague-experience.html','共同脈絡與工作閉環','狀態、證據與下一次接續'],['reading/research/source-notes/commitment-followup-design.html','承諾跟進資料設計','工作版本、未知狀態、等待與恢復']]],
    practice: ['建議先驗收一個完整工作情境，再依成本、時效與可靠性問題增加機制。既有 phase 與權限邊界仍然適用。', [['reading/research/proactive-work.html','主動工作研究','原七框架比較與採用順序'],['reading/research/colleague-interaction.html','同事互動研究','獨立於訊息量的合作驗收'],['reading/research/source-notes/README.html','研究來源索引','官方文件、固定來源與歷史驗證']]],
  };
  function indexFromHash() {
    const id = location.hash.slice(1);
    const aliases = {'colleague-experience':'interaction','proactive-overview':'proactive','trigger-mechanisms':'frameworks'};
    const index = slides.findIndex(slide => slide.id === (aliases[id] || id));
    return index < 0 ? 0 : index;
  }
  function renderSlide(announce = true) {
    current = indexFromHash();
    for (let i = 0; i < slides.length; i++) slides[i].hidden = i !== current;
    if (document.activeElement?.closest('.slide[hidden]')) document.getElementById('presentation').focus({preventScroll:true});
    document.querySelectorAll('[data-chapter]').forEach(item => {
      if (item.tagName !== 'A') return;
      if (item.dataset.chapter === slides[current].dataset.chapter) item.setAttribute('aria-current','page');
      else item.removeAttribute('aria-current');
    });
    document.getElementById('slide-number').textContent = String(current + 1).padStart(2,'0');
    document.getElementById('slide-total').textContent = String(slides.length).padStart(2,'0');
    document.getElementById('slide-name').textContent = names[current];
    document.getElementById('progress-fill').style.width = ((current + 1) / slides.length * 100) + '%';
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (announce) document.getElementById('slide-announcement').textContent = `第 ${current + 1} 頁，共 ${slides.length} 頁：${names[current]}`;
    window.scrollTo({top:0,behavior:'instant'});
  }
  function go(index) {
    if (index < 0 || index >= slides.length) return;
    location.hash = slides[index].id;
  }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  window.addEventListener('hashchange', () => renderSlide());
  document.addEventListener('keydown', event => {
    if (dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable=true]')) return;
    const destinations = {ArrowRight:current + 1,ArrowLeft:current - 1,PageDown:current + 1,PageUp:current - 1,Home:0,End:slides.length - 1};
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  });
  sourceButton.addEventListener('click', () => {
    const [intro,originalLinks] = sourceNotes[slides[current].id];
    const links = [['library.html','完整研究目錄','五個主題，直接閱讀研究全文、圖表與來源'],['mechanisms.html','完整機制圖譜','直接在前端看流程、分支、時序與程式來源'],...originalLinks];
    document.getElementById('sources-title').textContent = names[current];
    document.getElementById('source-intro').textContent = intro;
    const container = document.getElementById('source-links');
    container.replaceChildren();
    for (const [href,title,description] of links) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = title + ' ↗';
      const label = document.createElement('span');
      label.textContent = description;
      link.append(label);
      container.append(link);
    }
    dialog.showModal();
    document.getElementById('close-sources').focus();
  });
  document.getElementById('close-sources').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => sourceButton.focus());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  const fullscreen = document.getElementById('fullscreen');
  if (!document.fullscreenEnabled) fullscreen.hidden = true;
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      document.getElementById('slide-announcement').textContent = '目前瀏覽器無法切換全螢幕，仍可使用方向鍵翻頁。';
    }
  });
  document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? '離開全螢幕' : '全螢幕'; });
  const decisions = {
    pending:['下午要用的檔案還找不到，也沒有完成或改期的記錄。','向 Alex 確認進度','「想確認銷售檔案的進度，下午彙整會用到。」','記住已問過，等回覆；下次不重複追問。'],
    done:['檔案已收到，內容也符合這次彙整需要。','整理成果，回報結果','「資料已確認完整，放進下午的彙整了。」','保存完成證據，關閉這件跟進工作。'],
    quiet:['來源正常，剛剛已經問過，目前沒有新變化。','保持安靜，繼續等待','不重寄同一則追問，也不額外發一則無事報告。','保留等待狀態；有回覆或到下次時間再查看。'],
  };
  function renderDecision() {
    const values = decisions[decision];
    ['observation','decision-action','action-copy','decision-memory'].forEach((id,i) => {document.getElementById(id).textContent = values[i];});
    const display = document.getElementById('wake-display');
    display.replaceChildren();
    if (wake === 'time') {
      display.append('10');
      const colon = document.createElement('span');colon.textContent = ':';display.append(colon,'00');
    } else display.textContent = '更新';
    document.getElementById('wake-description').textContent = wake === 'time' ? '查看專案進度' : '專案收到一則新訊息';
    document.querySelectorAll('[data-wake]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.wake === wake)));
    document.querySelectorAll('[data-decision]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.decision === decision)));
  }
  document.querySelectorAll('[data-wake]').forEach(button => button.addEventListener('click', () => {wake = button.dataset.wake;renderDecision();}));
  document.querySelectorAll('[data-decision]').forEach(button => button.addEventListener('click', () => {decision = button.dataset.decision;renderDecision();}));
  const interactions = {
    change:['你改了方向，','它就跟得上。','同一件工作，接住新的意思。','不是嘴上答應，是最後交出的資料真的改了。','你 · 工作途中','先不要用八月的，改成九月資料。','數位同事 · 接住修正','好，改用九月。八月版本還沒寄出，我會替換草稿。','最後交付','九月版本，資料期間已標在標題。'],
    accept:['接手有交代，','做完有成果。','讓人知道它接住了這件事。','「收到」只是開始，成果送到人手上才算交代。','你 · 交辦','幫我整理下午開會的資料。','數位同事 · 接手','我先整理最新進度與未決事項，做成會前摘要。','完成之後','摘要與來源連結已備好，兩個待決事項放在最前面。'],
    group:['看見對話，','不一定要插話。','先分清楚，誰已經回答了。','有人已給出完整答案，就不重複搶話。','Bob · 群組提問','下午會議的資料在哪裡？','Alice · 已經回答','放在專案資料夾了，這是九月版本的連結。','數位同事的選擇','沒有新增價值，保持安靜。這是示意說明，不是發出的訊息。'],
    handoff:['交接之後，','仍然接得下去。','知道現在等誰，以及收到後要做什麼。','訊息送出不是完成，還要記住等待與接續。','數位同事 · 已授權交接','Alex，下午要彙整九月報告，能在一點前補上銷售數字嗎？','Alex · 回覆','可以，十二點半給你。','數位同事接續','好，收到後我會放進會前摘要。'],
    everyday:['自然接話，','也記得怎麼配合。','日常交流不必每句都變成新任務。','明確的偏好，下一次真的用上。','你 · 回饋','剛剛整理得很清楚。以後會前摘要也先給三個重點。','數位同事 · 回應','好，之後會前摘要先列三個重點，再放細節。','下一次合作','沿用這個摘要方式；你改偏好時，再一起調整。'],
  };
  document.querySelectorAll('[data-interaction]').forEach(button => button.addEventListener('click', () => {
    const values = interactions[button.dataset.interaction];
    const secondTurn = document.getElementById('speaker-two').parentElement;
    const humanReply = ['group','handoff'].includes(button.dataset.interaction);
    secondTurn.classList.toggle('human',humanReply);
    secondTurn.classList.toggle('colleague',!humanReply);
    const title = document.getElementById('title-collaborate');
    const accent = document.createElement('span');accent.className='accent';accent.textContent=values[1];
    title.replaceChildren(document.createTextNode(values[0]),document.createElement('br'),accent);
    ['interaction-principle','interaction-takeaway','speaker-one','message-one','speaker-two','message-two','outcome-label','message-three'].forEach((id,i) => {document.getElementById(id).textContent=values[i+2];});
    document.querySelectorAll('[data-interaction]').forEach(candidate => candidate.setAttribute('aria-pressed',String(candidate === button)));
  }));
  const cues = {time:['10:00 · 快到開會時間','時間線索把「稍後要做的事」帶回注意中；想起之後仍要判斷。'],event:['看見 Alex · 想起那份檔案','相關的人、訊息或情境可能喚回意圖，不必一直刻意監控。'],inner:['整理會議內容 · 聯想到缺少的資料','內在思考可以連到記憶中的未完事項；不代表每次聯想都會導致行動。']};
  document.querySelectorAll('[data-cue]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('scene-cue').textContent=cues[button.dataset.cue][0];document.getElementById('cue-caption').textContent=cues[button.dataset.cue][1];document.getElementById('recall-label').textContent={time:'時間，喚回一件還沒做完的事',event:'相關的人，喚回先前的約定',inner:'整理思緒，聯想到缺少的資料'}[button.dataset.cue];document.querySelectorAll('[data-cue]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
  renderSlide(false);
})();
