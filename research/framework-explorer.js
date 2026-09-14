(() => {
 const data=window.FRAMEWORK_MECHANISMS, target=document.getElementById('framework-mechanism-result');if(!data||!target)return;
 const layers={wake:['↗','喚醒'],select:['✦','選題'],continue:['↻','續行'],learn:['＋','學習／整理']};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(key){
  const f=data[key];
  target.innerHTML=`<div class="framework-heading"><div><small>${esc(f.version)}</small><h3>${esc(f.name)}</h3><p>${esc(f.tag)}</p></div><div class="framework-profile" aria-label="本次查核機制分布">${Object.entries(layers).map(([k,[icon,label]])=>{const n=f.items.filter(r=>r[1]===k).length;return `<span class="${n?'observed':'unmapped'}"><b>${icon}</b>${label}<small>${n?'已列路徑':'本表未列'}</small></span>`}).join('')}</div></div><div class="framework-inventory">${f.items.map(([name,layer,brief,api,path,limit,source])=>`<details class="framework-mechanism"><summary><span class="mechanism-symbol">${layers[layer][0]}</span><span><small>${layers[layer][1]}</small><b>${esc(name)}</b><em>${esc(brief)}</em></span><span class="mechanism-expand" aria-hidden="true">＋</span></summary><div class="framework-evidence"><dl><dt>可用入口</dt><dd><code>${esc(api)}</code></dd><dt>實作怎麼走</dt><dd>${esc(path)}</dd><dt>判定界線</dt><dd>${esc(limit)}</dd></dl><a class="source" href="${esc(source)}">查核來源 ↗</a></div></details>`).join('')}</div><p class="framework-verdict">${esc(f.verdict)}</p>`;
 document.querySelectorAll('[data-framework]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.framework===key)));
 }
 document.querySelectorAll('[data-framework]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.framework)));
 render('openclaw');
})();
