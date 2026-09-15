(() => {
 const scene=document.getElementById('initiative-scene');if(!scene)return;
 const $=id=>document.getElementById(id);
 const copy={time:['快到會議時間','Time · scheduled check','Time → Agent turn'],event:['看到報表更新','Event · report.updated','Event → Agent turn']};
 scene.querySelectorAll('button[data-cue]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.cue;scene.dataset.cue=key;
  $('human-thought-label').textContent=copy[key][0];$('agent-thought-label').textContent=copy[key][1];$('agent-cue').textContent=copy[key][2];
  scene.querySelectorAll('button[data-cue]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
})();
