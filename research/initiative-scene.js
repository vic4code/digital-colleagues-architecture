/* One finite, user-controlled vignette. No timer is needed to understand it. */
(() => {
 const scene=document.getElementById('initiative-scene'); if(!scene)return;
 const $=id=>document.getElementById(id);
 let cue='event',beat=2,timer=null;
 const words={event:[['看到新報表','咦，數字更新了。','Event · 收到異動','觀察到報表 v3。'],['聯想到自己的工作','下午要開會，<br>簡報好像還是舊版？','角色 × 工作脈絡','會議在下午，<br>簡報仍引用 v2。']],time:[['快到開會時間','等等，快開會了。','Time · 到點觀察','讀取近期會議與資料。'],['想起在意的事','會前再確認一下，<br>數字有沒有更新？','角色 × 工作脈絡','有新報表 v3，<br>簡報仍引用 v2。']]};
 function render(){
  scene.dataset.beat=beat;scene.dataset.cue=cue;
  const w=beat===2?['想到一件新工作','我先核對簡報，<br>別讓大家拿舊數字討論。','職責 × 現況 → 推導','值得先比對，<br>有差異再提案。']:words[cue][beat];
  ['human-thought-label','human-thought','agent-thought-label','agent-thought'].forEach((id,i)=>$(id).innerHTML=w[i]);
  $('agent-cue').textContent=cue==='event'?'Event · 報表異動':'Time · 會前觀察';
  scene.querySelectorAll('button[data-beat]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.beat===beat)));
  scene.querySelectorAll('button[data-cue]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cue===cue)));
  $('scene-conclusion').textContent=['線索，讓人注意到。','在意的事，讓線索產生意義。','主動性，在於自己產生「值得做的事」。'][beat];
 }
 function stop(){clearTimeout(timer);timer=null;$('scene-replay').textContent='播放這一刻 ↻';}
 function advance(){if(beat<2){beat++;render();timer=setTimeout(advance,2400);}else stop();}
 scene.querySelectorAll('button[data-beat]').forEach(b=>b.addEventListener('click',()=>{stop();beat=+b.dataset.beat;render();}));
 scene.querySelectorAll('button[data-cue]').forEach(b=>b.addEventListener('click',()=>{stop();cue=b.dataset.cue;beat=0;render();}));
 $('scene-replay').addEventListener('click',()=>{if(timer){stop();return;}beat=0;render();$('scene-replay').textContent='暫停 ▪';timer=setTimeout(advance,2400);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(scene);
 render();
})();
