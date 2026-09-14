# 主動性：入口、實作、三個 Phase 與觀測

更新：2026-09-14。首頁的技術依據與閱讀索引。保留各來源範圍，不把組合能力當成現成產品保證。

## 1. Time／event，還有其他嗎？

對本架構的**喚醒入口**，time／event 是足夠的工程抽象。人訊息也是事件，但 `wake_source` 要另記 human；內部 completion／idle 也需另記。不要用分類抹掉主動與被動的差異。

**持續執行**另看：程式可以在 while 裡直接走下一步，未必需要新 timer 或 event bus。Voyager 的環境是 context，curriculum 是選題策略，learn loop 是執行控制；不是「到了某個時刻才看環境」。wait_ticks 或重試 sleep 也不是選題 cron。

**想到什麼**是政策層：職責、可見現況、記憶與模型推論。喚醒不等於已經選題，goal 續跑也不等於從對話找出新的跟進工作。

## 2. 不同名詞在實作上負責什麼

| 名詞 | 責任 | 代表路徑與可用入口 |
|---|---|---|
| Polling | 主動讀來源，再比對變化 | Hermes `cronjob` 的 monitor_script／monitor_url → check_monitor → hash 未變跳過模型 |
| Heartbeat | 週期巡檢回合 | OpenClaw `agents.defaults.heartbeat.every` → monitor job → cron timer → wake admission → 一般回合 |
| Cron job | 排定日曆／時間規則 | OpenBot `create_routine` → 持久 nextRunAt → due sweep → queue／claim；Claude Code `/loop` → `CronCreate` |
| Event trigger | 來源推送或完成事件喚起 | 本地 M365 validate／receipt → dispatchAutomation；OpenClaw HTTP wake／agent hooks 依配置啟用 |
| Goal continuation | 接續人定義的目標 | Codex `/goal`、固定版 app-server `thread/goal/set`；Hermes `/goal`；Claude Code `/goal` |
| Environment curriculum | 依環境選下一題 | Voyager `learn()` → `propose_next_task()` → rollout → skill／progress → next loop |

Polling 可以放在 cron 排程的 heartbeat 裡。Lease heartbeat 是續租，不是模型巡檢。

來源（本次讀取原始碼或目前文件）：

- [OpenClaw timer-scheduler.ts，91ea838](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)：`armTimer` 以 next due 計算 delay，透過 setTimeout 進 onTimer。與 [既有完整鏈](openclaw.md) 合讀。
- [OpenClaw Heartbeat 官方文件](https://docs.openclaw.ai/gateway/heartbeat)：目前文件支持主 session／隔離配置，不能把 session 所在位置當成所有 heartbeat 的定義。
- [Hermes monitor.py，fef0e16](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L113)：先讀來源再比 hash；baseline 在模型執行前保存，不是投遞成功證據。[同 commit 的 cronjob tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py)提供入口；[目前 Cron 文件](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)另記 webhook route 的 `cron_job` 可事件觸發，兩個版本分開看。
- [OpenBot worker，7b94a0b](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/worker/src/index.ts#L88)：定期 due sweep；[完整入口與持久性](openbot.md)。
- [Voyager learn，55e45a8](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L295)：迭代驅動的選題與 rollout；不是固定時刻喚醒。
- [Claude Code 排程](https://code.claude.com/docs/en/scheduled-tasks)、[goal](https://code.claude.com/docs/en/goal)：2026-09-14 文件；`CronCreate` 可呼叫，goal evaluator 依對話證據評估，不獨立執行 validator。Session 排程不能直接當作持久無人值守服務。外部事件另見 [channels](https://code.claude.com/docs/en/channels)：以 `--channels` 啟用 MCP 來源；Telegram channel 底下可以 polling，event 是模型接收方式而非來源端全無輪詢。
- [Codex 與其他固定路徑](proactive-trigger-mechanisms.md)：沿用原研究 SHA，未把新文件行為套回舊碼。

## 3. 架構：原圖＋W0–W7

Before／After 沿用 [Phase 0.5 原架構](../../phases/0.5/reference-architecture.svg)。原圖是設計，不代表每項都已部署。After 以虛線疊加責任；hover／點擊展開維持。

| 階段 | 我們的元件落點 | 契約／缺口 |
|---|---|---|
| W0 | Scheduler／Event Ingress | wake_source 與 occurrence identity |
| W1a | Event Normalizer／來源 adapter | 先讀本期 metadata／差異；不先塞完整 context |
| W1b | Triage Policy | enabled、paused；具名 skip／admitted 結果；零模型 |
| W2 | Persona／Skill Loader | role_card 投影、sha、讀不到停止；原 repo 指出待補 |
| W3 | Session Mapper＋State | 對帳、waiting ownership、cursor；原 repo 指出缺口 |
| W4 | Context Loader／MCP | 事件錨點命中才檢索；計量與截斷稽核 |
| W5 | App-server Client | 依 P1／P2／P3 執行，唯一模型回合邊界 |
| W6 | Interaction Client／proposal store | 獨立硬閘、私有 inbox、不推播、不外寄 |
| W7 | Audit／State | journal、kanban diff、audit；cursor 最後原子更新 |

「零模型」仍消耗 I/O、CPU、儲存與網路。原設計必讀約 4,000 字、總載入 32,000 字是字數預算，非 token，也不是各框架共同上限。

W5 不能靠文字宣稱硬預算：啟動自主 goal 前先檢查，宿主計數並控制後續入口；進行中回合能否取消需按 adapter 驗收。

## 4. 三個 Phase：以技術完成度切

依使用者貼出的 Notion 導讀，以及本次 GitHub 讀取的 `2026_08/scenerios/scenario-legal.md` §§6–8。取回檔案 blob SHA：`8f1abe9e5ca261fe6f94d94ed25de42a4dd7de1e`（blob，不是 commit）。

| Phase | 人給什麼 | 達標核心 | 原專案狀態 |
|---|---|---|---|
| 1 固定節律 | 時間與固定產物 | 稽核、鎖、持久 occurrence、確定性准入／零模型檢查 | 有驗證版；結果依原報告，本次未重跑 |
| 2 半主動／目標驅動 | 目標與完成標準 | 程式 validator、token／時間／回合上限、blocked／exhausted 狀態 | 規劃 |
| 3 全主動／自主跟進 | 願景、角色、權限、知識庫 | 自行找工作、來源錨點、獨立硬閘、私有 inbox、接受／退回／延後 | 規劃 |

P1–P3 不是本架構 repo 的部署 Phase 0–4。Time／event 都可以服務三個 Phase；差別是誰決定內容、目標、跟進與停止。

**框架對照判準**：每格說出可用的 config／CLI／tool／RPC 名稱。有 scheduler struct、內部 handler 或只讀 API，不足以計為可建立能力。框架提供零件，不代表滿足整個 Phase。

- P1：OpenClaw、Hermes、Claude Code、OpenBot 有可借用的排程／監看入口。持久性與零模型分流各自驗收。
- P2：Hermes、Codex、Claude Code 有 goal 入口；本地 completion validator 與三軸硬上限仍要接。OpenClaw 固定查核的 durable goal 不自動證明採用 profile 有完整續跑鏈。
- P3：原研究的「五家歸零」限其嚴格對話推斷判準與快照，不是全市場定論。OpenClaw retired inferred commitments 不算現役；職責 prompt 的組合提案、Voyager 的環境 curriculum 都不是完整企業自主跟進契約。
- Grok Build（原 repo 研究）與 Grok Bot 非官方重建（本地補充）分列，不互相借用介面證據。

## 5. 國泰情境與可觀測性

情境為原四職能規劃的國泰適用假設，未讀實際契約、人事或看板資料。

| 職能 | P1 | P2 | P3 |
|---|---|---|---|
| 法務／法遵 | 到期清單、公告差異 | 補齊指定送審資料 | 公告變更→想到應檢視的關聯契約 |
| PM | 到期依賴清單 | 整理指定交付缺口 | 日期推遲→想到下游影響 |
| 人資 | 到離職交接清單 | 指定流程檢核包 | 規範變更→想到需檢視的流程 |
| 架構師 | repo／CI 差異 | 指定變更的 review 材料 | diff→想到與 ADR 的偏差 |

主動性 trace：`wake_source → occurrence/event → role_sha/anchor → proposal 或 skip → inbox/feedback → outcome/cursor`。來源錨點、決策摘要與政策結果可記；不需要存模型隱藏思考鏈。

- 正常靜默：有 W0、NoMaterial 或其他具名 skip、零模型呼叫。
- 喚醒失效：應有 occurrence，卻無 W0／skip；獨立觀測器比對排程與來源延遲，不能靠 agent 自己報正常。
- 有用提案率：有用／已評閱；未讀另列。召回率要有人工標註或抽查的機會分母。
- 無證據與重複率：分母包含 W6 擋下的所有生成提案。標題已讀與內容開啟分開；接受、退回、延後分開。
- 穩定性：重送、重啟、並發、角色變更、訂閱到期、cursor 更新前後中斷、超額與取消都注入測試。

## 來源與改判紀錄

- [Notion 導讀](https://app.notion.com/p/cathay-ai/Agent-3d1ee105f483806eb7fbd265166f8772)：連線未能讀取；使用者已於對話提供全文。
- [scenario-legal 原文](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)：本次透過 GitHub 讀取並核對三個 Phase 與界線。
- [wake-cycle 設計](https://github.com/shane01526/agent_initiate/blob/main/2026_09/wake-cycle-design.html)與[簡版](https://github.com/shane01526/agent_initiate/blob/main/2026_09/wake-cycle-brief.html)：原文索引；W 階段狀態採使用者提供的導讀與既有研究。
- 原頁用了部署 Phase 0–4 → 本次改為主動性 Phase 1–3，原因：使用者指定的 Phase 是技術成熟度。
- 原頁將「能選題」放在整體核心 → 本次恢復 time／event 為入口主軸，同時把喚醒、執行控制與選題分層。
- 「自主跟進業界為零」→ 限受查框架、快照與嚴格判準；不擴張成 Voyager 不會選題，也不把 goal 續跑算新跟進。
