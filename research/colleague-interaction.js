// Demonstration only: no model calls or real messages.
(() => {
  const buttons=[...document.querySelectorAll('[data-interaction]')];
  const replay=document.getElementById('replay-conversation');
  const moods={accept:['準備接手','「好，我來整理。」'],change:['更新工作方向','「好，改成九月。」'],group:['留意群組脈絡','別人已經回答，先安靜。'],handoff:['記得在等誰','「收到後我接著整理。」'],everyday:['記住配合方式','「下次先給三個重點。」']};
  let selected=buttons[0],timer=null;
  function stop(){clearInterval(timer);timer=null;document.querySelectorAll('.utterance').forEach(e=>e.hidden=false);replay.textContent='播放對話 ▷';replay.setAttribute('aria-pressed','false');}
  buttons.forEach(button=>button.addEventListener('click',()=>{
    stop();selected=button;
    buttons.forEach(b=>{b.setAttribute('aria-pressed',String(b===button));document.getElementById(b.getAttribute('aria-controls')).hidden=b!==button;});
    const [mood,note]=moods[button.dataset.interaction];document.getElementById('lab-mood').textContent=mood;document.querySelector('.lab-note').textContent=note;
    const portrait=document.querySelector('.lab-portrait');portrait.classList.remove('state-change');
    requestAnimationFrame(()=>requestAnimationFrame(()=>portrait.classList.add('state-change')));
  }));
  replay.addEventListener('click',()=>{
    if(timer){stop();return;}
    const turns=[...document.getElementById(selected.getAttribute('aria-controls')).querySelectorAll('.utterance')];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){stop();return;}
    turns.forEach((e,i)=>e.hidden=i>0);let next=1;replay.textContent='顯示完整對話';replay.setAttribute('aria-pressed','true');
    timer=setInterval(()=>{turns[next++].hidden=false;if(next>=turns.length)stop();},1800);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();
