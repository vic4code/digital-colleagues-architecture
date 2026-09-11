# OpenClaw inferred commitments：曾有實作，現已完整退役

查核：2026-09-11。歷史文件與目前主線分開引用；這不是目前可開啟的功能。

## 結論與版本

使用者提供的描述確實有官方歷史文件依據，但「CLI 還可列出／dismiss、SQLite 保留舊資料」只適用中間階段。不能沿用成目前操作指引。

| 階段 | 可驗證的事實 | 固定來源 |
|---|---|---|
| 功能存在 | 隱藏抽取、儲存候選、heartbeat check-in；預設關閉 | [2026-07-15 文件](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md) |
| 已宣告退役、仍有清理介面 | 不再抽取／投遞；doctor 移除設定；保留 maintenance CLI 與 inert rows | [移除前文件快照](https://github.com/openclaw/openclaw/blob/a808b0d96a5b6ba935702917d311ab0c17b973ac/docs/concepts/commitments.md) |
| 刪除子系統 | 2026-08-10 commit 刪掉 extraction、runtime、CLI、文件、相關測試；commit 當時仍說資料待後續清理 | [移除 commit](https://github.com/openclaw/openclaw/commit/4b0151682ef4cbcf5360fd79cc73b44c62a0c911) |
| 本次查核主線 | 文件標記 removed in v2026.8.1；CLI 也不在；migration 丟棄舊表與資料 | [主線文件固定快照](https://github.com/openclaw/openclaw/blob/d36ca99e50d161d117e747ed18482ae715c53b8b/docs/automation/index.md) |

版本標籤 v2026.8.1 是目前文件的標法，不能拿它推定上述所有變更均在 8 月 1 日完成。Git commit 日期與版本名稱是不同證據。

## 當時實際做什麼

agent 回覆後，系統可以在隔離 context 執行無工具的背景 extraction，挑出高信心的自然跟進機會。候選綁定 agent、session、channel／收件目標，帶 due window、check-in 建議與非指令 metadata。到期由相同 scope 的 heartbeat 判斷送一次 check-in 或以 `HEARTBEAT_OK` dismiss。

原設計的限制包括：opt-in；`maxPerDay` 預設 3，範圍是 **per agent session、rolling day**，不是全系統每日三次；due time 至少延後一個 heartbeat interval；到期 commitment turn 無 OpenClaw tools；不重播原始對話；`target: "none"` 不外送。抽取也不是宣稱每次回覆必跑，文件原文是 may run。[歷史設計文件](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md)

這是 conversation-bound check-in，不能直接等同「追查交付物、確認 Alex 是否已完成、寄信給 Alex」的工作承諾管理器。尤其無工具投遞回合無法現場查最新完成證據。

## 現在的程式證據

固定主線：`d36ca99e50d161d117e747ed18482ae715c53b8b`。

- [schema repair](https://github.com/openclaw/openclaw/blob/d36ca99e50d161d117e747ed18482ae715c53b8b/src/state/openclaw-state-db-schema-repair.ts#L368) 偵測符合舊 schema 的表並登記 `commitments-retirement-v7`。
- [table retirement](https://github.com/openclaw/openclaw/blob/d36ca99e50d161d117e747ed18482ae715c53b8b/src/state/openclaw-state-db-table-retirements.ts#L290) 檢查 schema、foreign keys 與其他依賴，再以 savepoint 執行 `DROP TABLE commitments`。不符合預期的資料庫會拒絕破壞性 migration；不是無條件刪任意同名表。
- 目前替代基礎是 Automations、Heartbeat、Standing Orders、Tasks／Task Flow 與 memory。它們提供排程、職責、執行及回憶，**不會自動復活被移除的推斷承諾抽取器**。[官方總覽](https://docs.openclaw.ai/automation)

## 退役原因：知道與不知道

查到的退役文件與移除 commit 沒有提供產品實驗指標或完整決策理由。不能寫成「因為太吵／成本高／效果差所以移除」。歷史確有 [large queues responsiveness 修正](https://github.com/openclaw/openclaw/commit/1a34950d9c517325f61d7e9b2367c839845c64d9)，但也不足以證明退役原因。

我們的設計推論是：無工具 check-in 適合關心近況，卻不足以支撐查證與交付工作；通知需要價值與時機判斷。這是適用性分析，不是作者公開的退役理由，也不是主動性不可行的證據。

## 對本研究的修正

保留原本「OpenClaw 可提供 runtime primitives，但業務承諾狀態需補」的判斷；補上「曾存在且已退役的特定子系統」。Standing Intent 關鍵字記憶、Standing Orders 職責、inferred commitments、Tasks 執行紀錄要分開；名称相近不代表同一功能。

查核方式：官方文件、GitHub 歷史與固定 SHA 原始碼靜態閱讀。沒有執行 migration，也沒有操作使用者的 OpenClaw 資料庫。
