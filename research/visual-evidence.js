window.VISUAL_EVIDENCE={
 human:[
  {type:'實驗研究 → 情境轉譯',claim:'意圖的提取可能依賴監測，也可能由適當線索自發喚回。',limit:'10:00、Alex 與報表是說明案例；研究未驗證這個具體工作情境。',sources:[['Einstein et al., 2005 · 五個實驗','https://pubmed.ncbi.nlm.nih.gov/16131267/']]},
  {type:'實驗研究',claim:'前瞻記憶研究支持自發提取既有意圖，不必始終刻意監測。',limit:'不等於人會可靠記住每一件承諾，也不證明腦內有固定排程器。',sources:[['Einstein et al., 2005','https://pubmed.ncbi.nlm.nih.gov/16131267/']]},
  {type:'綜述 + 本研究的概念整合',claim:'內在思考涉及記憶、未來模擬與認知控制；圖中把它抽象為情境判斷。',limit:'兩個交疊區域只是構圖，不是解剖位置、腦網路數量或已驗證因果模型。',sources:[['Andrews-Hanna et al., 2014 · 綜述','https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/']]},
  {type:'本專案情境設計',claim:'追問、交付、等待是用來解釋工作選擇的三個示例。',limit:'不是心理學研究證明人只會做這三種動作。',sources:[['設計推論與研究依據','reading/research/source-notes/human-to-agent.html']]},
  {type:'本專案功能對照',claim:'把未完事項保留給下一次，是後續 agent 設計採用的工作閉環。',limit:'此處不主張人類記憶與資料庫寫入等價。',sources:[['人到 Agent 的功能對照','reading/research/source-notes/human-to-agent.html']]}
 ],
 agent:[
  {type:'固定版本文件 + 工程抽象',claim:'OpenClaw Heartbeat 提供週期性查看；事件也可請求喚醒。',limit:'time／event 是本研究的高層分類，不宣稱所有框架的全部能力都只有 cron。',sources:[['OpenClaw Heartbeat · 固定文件','https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/gateway/heartbeat.md'],['hooks.ts L261','https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/gateway/server/hooks.ts#L261']]},
  {type:'來源支持的整合提案',claim:'本情境將來源工具、記憶與工作狀態組合成一次查看。',limit:'「報表工具已接好」是示範假設，不是每個 framework 開箱即有。',sources:[['整合設計及其固定來源','reading/research/source-notes/commitment-followup-design.html']]},
  {type:'文件行為 → 情境轉譯',claim:'Heartbeat 可以產生有用回覆，也可以保持安靜。',limit:'圖中的決策節點不是獨立判斷服務，也不保證判斷一定正確。',sources:[['OpenClaw Heartbeat · 固定文件','https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/gateway/heartbeat.md']]},
  {type:'本專案情境設計',claim:'依工作證據選擇詢問、交付或等待，並受既有授權限制。',limit:'動畫不執行工具、不發送訊息；三條路徑不是完整產品能力清單。',sources:[['承諾跟進與送達設計','reading/research/source-notes/commitment-followup-design.html']]},
  {type:'本專案狀態設計',claim:'工作狀態、完成證據與送達狀態分開保存，讓下一輪可接續。',limit:'這個資料模型是提案，不宣稱任一框架已原生實現全部欄位。',sources:[['狀態、責任與證據設計','reading/research/source-notes/colleague-experience.html']]}
 ],
 team:[
  {type:'非官方重建程式碼 → 情境轉譯',claim:'被使用者交辦的回合與背景回合採不同回應政策。',limit:'Grok 重建碼不是官方 backend 證明；對話文字是本研究示例。',sources:[['Grok 重建 system-prompt.ts L82','https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/runner/system-prompt.ts#L82']]},
  {type:'官方文件 + 本專案修正契約',claim:'OpenClaw queue 支援 steer、followup、collect、interrupt；示範把新指示帶入工作。',limit:'已執行的外部動作不會被自動撤銷；revision 設計是本專案提案。',sources:[['OpenClaw queue · 官方文件','https://docs.openclaw.ai/concepts/queue'],['互動契約','reading/research/colleague-interaction.html']]},
  {type:'本專案互動設計',claim:'改方向後，應確認最新版本與 owner，再決定下一步。',limit:'這是驗收目標，尚未用真人群組或官方產品測量。',sources:[['同事互動的設計與驗收','reading/research/colleague-interaction.html']]},
  {type:'官方產品描述 + 本專案設計',claim:'Grok Bot 官方將跟進、協作與交接列為產品方向；泳道是本研究的示意。',limit:'產品描述不證明內部演算法、交接成功率或具體資料模型。',sources:[['xAI · Introducing Grok Bot','https://x.ai/news/introducing-grok-bot'],['研究證據分層','reading/research/source-notes/colleague-experience.html']]},
  {type:'本專案驗收契約',claim:'交接之後留下責任、等待條件與完成證據，讓合作可持續。',limit:'發送成功不等於工作完成；這是我們提出的驗收要求。',sources:[['交接與持續責任','reading/research/source-notes/commitment-followup-design.html']]}
 ]};
