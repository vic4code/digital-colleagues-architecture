(() => {
 const target=document.getElementById('framework-inventory');const data=window.FRAMEWORK_MECHANISMS;if(!target||!data)return;
 const mapping={claw:'openclaw',hermes:'hermes',cc:'claude',cx:'codex',v:'voyager',ob:'openbot'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){const row=window.MECHANISM_RESEARCH.rows.find(r=>r.id===location.hash.slice(1))||window.MECHANISM_RESEARCH.rows[0];const f=data[mapping[row.framework]];target.hidden=!f;if(!f){target.replaceChildren();return;}target.innerHTML=`<p class="eyebrow">FRAMEWORK INVENTORY</p><h3>${esc(f.name)} · 已查核機制與介面</h3><p>${esc(f.verdict)}</p><small>${esc(f.version)}</small>${f.items.map(([name,layer,brief,api,path,boundary,source])=>`<details><summary><b>${esc(name)}</b><span>${esc(brief)}</span></summary><dl><dt>Interface</dt><dd><code>${esc(api)}</code></dd><dt>Execution path</dt><dd>${esc(path)}</dd><dt>Evidence boundary</dt><dd>${esc(boundary)}</dd></dl><a href="${esc(source)}">Source ↗</a></details>`).join('')}`;}
 addEventListener('hashchange',render);render();
})();
