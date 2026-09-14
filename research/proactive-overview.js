// A local illustration: switching examples never calls a model or sends a message.
(() => {
  const root = document.querySelector('#proactive-overview');
  if (!root) return;
  const situations = {
    pending: {
      title: '下午要用的檔案，還找不到',
      observation: '讀進度表和最新對話：Alex 說上午交付，目前沒有改期或完成證據，也還沒問過。',
      action: '向 Alex 確認進度',
      message: '「想確認銷售檔案的進度，下午的彙整會用到。」依既有授權發送。',
      memory: '↶ 記住已問過，等待 Alex 回覆。下一輪不重複追問。',
    },
    done: {
      title: 'Alex 已交檔案，而且內容齊全',
      observation: '讀到新附件，確認是同一份工作需要的資料，完成條件已滿足。',
      action: '整理成果，回報正在等的人',
      message: '「檔案已收到並確認完整，已放進下午的彙整。」附上成果連結，不再催 Alex。',
      memory: '↶ 記錄完成證據與成果連結，關閉這件跟進工作。',
    },
    quiet: {
      title: '沒有新進展，剛才已經問過',
      observation: '來源讀取正常。上次追問已送達，目前仍在約定等待期間，沒有新的風險或決策需求。',
      action: '保持安靜，繼續等待',
      message: '不再寄同一則追問，也不為了表現主動而另外通知使用者。',
      memory: '↶ 保留等待狀態與下次檢查時間；回覆或新事件到來時再接續。',
    },
  };
  let wake = 'time';
  let situation = 'pending';
  function render() {
    const current = situations[situation];
    const values = {
      'wake-title': wake === 'time' ? '上午十點到了' : '專案收到一則更新',
      'wake-copy': wake === 'time' ? '排程啟動一輪專案檢查。' : '事件處理程式把更新送入工作回合，不必等到下個檢查時間。',
      'think-title': current.title,
      'think-copy': current.observation,
      'act-title': current.action,
      'act-copy': current.message,
      'remember-copy': current.memory,
    };
    for (const [id, value] of Object.entries(values)) root.querySelector('#' + id).textContent = value;
    root.querySelectorAll('[data-wake]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.wake === wake)));
    root.querySelectorAll('[data-situation]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.situation === situation)));
  }
  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.dataset.wake) wake = button.dataset.wake;
    else if (button.dataset.situation) situation = button.dataset.situation;
    else return;
    render();
  });
})();
