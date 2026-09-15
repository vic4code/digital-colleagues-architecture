# Phase goals：Task discovery 的實作路徑

2026-09-15 · Primary-source review 與整合設計。本文沒有宣稱已完成各框架端到端 P3 驗證。

## 核心修正

**Schedule 可以由人設定；每次產生的新工作仍可以由 Agent 決定。**

Time／Event 是觸發入口；Task ownership 是 Phase 的區別。P1 人指定工作，P2 人指定目標而 Agent 拆解步驟，P3 人給角色與觀察範圍而 Agent 產生未逐件交辦的新工作。

「缺少專用 task-discovery tool」不能推出「框架無法組合 task discovery」。能執行帶角色、觀察與工具的普通 agent turn，就有組合入口；是否可靠仍須驗證。

## 共用 Discovery contract

以下為 proposed integration，非框架原生 schema：

- Input：role／permissions、當輪 observation、來源版本、已完成與已提案紀錄。
- Model：產生 candidate，使用授權工具核對 evidence；無值得做的工作可回 no-op。
- Host：驗 evidence reference、權限與重複；保存 proposal，再進 human review。
- Feedback：accept／reject／defer 分別記錄；核准的新工作另進 execution，不把「提出」當「完成」。

同一個 discovery prompt 可以由 schedule 或來源事件啟動。這裡人交辦的是觀察職責，不是每一個將被發現的具體工作。

## Framework recipes

### Hermes · Scheduled discovery skill

固定原碼 `fef0e16` 的 callable tool 名為 `cronjob_manage`，toolset 為 `cronjob`。建立動作接受 schedule 與 prompt／skills；可以把 prompt 寫成角色觀察任務，由 skill 定義候選工作與證據格式。monitor_script／monitor_url 是可選的來源變化 gate。這支持組合 discovery，尚非 turnkey proposal lifecycle。[Cron tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)

待補：candidate schema、跨輪去重、source watermark、人工回饋。monitor baseline 在模型成功前保存，不得用作提案已處理或已投遞的證明。預設 heartbeat 防止無根據忙碌的提示，不等同禁止自訂 cron 依證據提出工作。[Monitor](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py)

### Claude Code · Custom loop.md

`.claude/loop.md` 可替換 bare `/loop` 的巡檢 prompt；`CronCreate` 接受 prompt，channels 提供事件注入。可配置為觀察授權來源、依職責生成 proposal。官方預設維護 prompt 已涵蓋特定範圍的 bug hunts／simplification，但不授權範圍外新 initiative。[Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks), [Channels](https://code.claude.com/docs/en/channels)

待補：proposal persistence、dedup、review UI；選定 session／desktop／cloud 執行生命週期。普通 session loop 不能直接當全天候部署證明。

### Codex · Discovery turn

宿主 Scheduler／Ingress 組裝 role＋observation＋history，經 `thread/start`／resume 後呼叫 `turn/start`。以 `outputSchema` 收 candidates／no-op；透過 MCP 查證。這是一般 agent turn 的用途，不需要先給出每一個具體 goal。[App-server](https://developers.openai.com/codex/app-server/)

待補：host scheduler、context snapshot、references validator、proposal store、人審。Structured output 約束格式，不證明來源與判斷正確。核准後再把選中工作送 execution／goal continuation。

### Voyager · Native curriculum

`CurriculumAgent.propose_next_task(events, chest_observation)` 正常路徑依環境與進度以模型產生下一題，另有固定起始任務與庫存條件分支。這已是 native environment-based task discovery；不是只有已交辦工作續行。[Curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)

企業化需更換 environment adapter、curriculum 目標、工具與驗收，再接 evidence／proposal／human review。Minecraft 能力不能直接換算完整企業 P3。

### OpenBot · Routine discovery prompt

`create_routine(instruction, cron, timezone, channelId)` 把單次 firing 的 instruction 交給 agent turn。可以設定角色觀察與提案 instruction，由工具取得來源；queue／lease 支撐可靠派工。[Routine interface](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)

待補：candidate dedup、proposal state、human feedback。原 routine reply 會投到 channel；私有 inbox 要另接。派工成功不代表提案有用，等待人回覆也不能直接視為原生可恢復審批流程。

### OpenClaw · Role-based discovery 與已退役功能

自訂 heartbeat prompt／工具可承載角色觀察，產生新 candidate；這是組合路線。預設 heartbeat 的不推斷舊對話待辦規則，不能改寫成已自動提供 conversation-inferred follow-up。[Heartbeat](https://docs.openclaw.ai/gateway/heartbeat)

歷史 inferred commitments 曾在回覆後執行隔離 extraction，保存候選，之後由 heartbeat check-in 投遞。被移除的是這個 extractor／delivery 子系統；不是被一般 heartbeat 自動接替。已查退役文件未提供完整決策理由，不能自行斷言因成本或騷擾被砍。[Historical design](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md), [Removal commit](https://github.com/openclaw/openclaw/commit/4b0151682ef4cbcf5360fd79cc73b44c62a0c911)

完整版本脈絡與資料清理證據見 [Inferred commitments audit](openclaw-inferred-commitments.md)。

### Grok Build · Evidence gap

原研究有續行與內部計時器線索，但目前查核未取得可重驗的建立介面；不據此填寫可直接使用的 discovery recipe，也不推斷整個產品不可能做到。[原研究快照](https://github.com/shane01526/agent_initiate/blob/main/2026_09/heartbeat-lifecycle.html)

## 判準要分開

- **Role-based task discovery**：從角色與現況生成未逐件交辦的新工作。上述普通 observation turn 可組合此能力。
- **Conversation-inferred follow-up**：從對話自行抽取、持久保存，之後到期再跟進。這是較窄的產品機制。
- **Goal continuation**：完成既定工作的新步驟，不能因步驟由模型產生就算 P3。

原研究「受查框架未確認現役完整 inferred follow-up」的限定結論，不能外推成「所有框架都不能提出新工作」。
