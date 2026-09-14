(() => {
  const states={time:['HEARTBEAT / CRON','Heartbeat / Cron · 時間到了。','Heartbeat 做週期性的情境檢查；Cron 安排定時工作。它們不是同一種設定。'],event:['WEBHOOKS','Webhooks · 外部請求到了。','OpenClaw 的 HTTP webhooks 接受外部請求，觸發對應工作；內部 Hooks 是另一套機制。'],loop:['AGENT LOOP','Agent loop · 這輪工作如何繼續。','接收輸入、組裝上下文、模型推理、執行工具、串流輸出與保存狀態。不是永久不停止的推理。']};
  document.querySelectorAll('[data-trigger]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-trigger]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    ['trigger-tag','trigger-title','trigger-description'].forEach((id,i)=>document.getElementById(id).textContent=states[button.dataset.trigger][i]);
  }));
  const replay=document.getElementById('cover-replay');
  replay?.addEventListener('click',()=>{
    const figure=document.querySelector('.cover-scene');figure.classList.remove('scene-replaying');
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(()=>requestAnimationFrame(()=>figure.classList.add('scene-replaying')));
  });
  document.querySelector('[data-trigger][aria-pressed="true"]')?.click();
  // Preserve destinations from the previous slide-based entry page.
  const legacy={overview:'human',bridge:'agent',proactive:'agent',decide:'agent',frameworks:'agent',interaction:'colleague',collaborate:'colleague',context:'colleague',practice:'colleague'};
  const hash=location.hash.slice(1);if(legacy[hash])document.getElementById(legacy[hash]).scrollIntoView();
})();
