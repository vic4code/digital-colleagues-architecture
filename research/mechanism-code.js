(()=>{'use strict';
const pane=document.getElementById('mechanism-code'),e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function show(){
 const row=window.MECHANISM_RESEARCH.rows.find(r=>r.id===location.hash.slice(1))||window.MECHANISM_RESEARCH.rows[0];
 const entry=window.IMPLEMENTATION_EXCERPTS.framework.find(x=>x.id===row.id.replace('flow-','code-'));
 pane.innerHTML='<p class="source-kicker">PINNED IMPLEMENTATION</p><h3>Source code · 原始碼</h3>'+(entry?'<p>'+e(entry.explanation)+'</p><div class="code-mapping">Excerpt coverage · 僅證明步驟 '+entry.steps.map(e).join(', ')+'</div><p class="code-file">'+e(entry.path)+'<br>commit '+e(entry.commit.slice(0,12))+'</p>'+entry.excerpts.map(x=>'<div class="excerpt"><a href="'+e(x.url)+'" target="_blank" rel="noopener">Lines '+x.start+'–'+x.end+' · Source ↗</a><pre><code>'+e(x.text)+'</code></pre></div>').join(''):'<p>這個機制尚無已整理的逐字 excerpt。流程為研究整理；請從下方 Source 與完整文件追查，不能把圖當作執行證據。</p>')+'<p class="code-scope">Source inspection · 未執行這個 upstream runtime；沒有 excerpt 的箭頭不宣稱已由此程式片段證明。</p>';
}
window.addEventListener('hashchange',show);show();
})();
