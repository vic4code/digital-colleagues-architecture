# Remembered-commitment follow-up: OpenClaw integration design

This is a proposed application workflow assembled from inspected framework primitives. No live outreach or end-to-end follow-up test was executed. It is not a claim that OpenClaw includes a built-in commitment tracker.

Example: Alex promised yesterday to upload a sales file this morning. The colleague reads the promise, searches later replies and the designated source, finds no completion evidence, and asks for status or the file link. Lack of evidence is not proof of noncompletion.

## Recall the promise / 找回原本的承諾

Search available memory. Use memory_get for memory-file excerpts; read original conversations or messages with the permitted session-history or source-message tool.
先搜尋可用記憶；memory_get 讀記憶檔片段，對話或郵件原文則用獲准的歷史／來源工具讀取。

Native recall interface; the follow-up responsibility supplies the search purpose.
已有記憶介面；由追蹤職責提供本次搜尋目的。

[Source](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/extensions/memory-core/src/memory-tool-contract.ts#L110-L130)

## Check current evidence / 查最新進度

Read later replies, the task record or the promised artifact using connected tools.
查後續回覆、任務狀態或約定成果；找不到完成證據，不等於對方沒做。

Proposed skill logic and source integration.
需補 Skill 邏輯與資料來源接合。

## Decide whether to ask / 判斷值不值得追問

Let the model weigh the promise, due date, available evidence and previous follow-ups.
由模型綜合承諾、期限、目前證據與先前追問，決定是否值得問。

Proposed prompt/skill; not a fixed rule per person or promise.
需補 prompt／skill；不用替每個人、每件事寫死規則。

## Resolve the person / 確認是對的人

Resolve a known channel identity. The inspected directory branch returns an error and candidates for ambiguous names.
解析已知的 channel 身分；已查核的名錄路徑遇到同名歧義會回傳錯誤與候選人。

Native target resolution; project-owner-to-contact mapping remains our data.
已有收件者解析；專案負責人到聯絡身分的對照仍要有資料。

[Source](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/infra/outbound/target-resolver.ts#L459-L500)

## Prepare or send the question / 準備或送出追問

Generate a grounded question; use authorized channel messaging, or keep a private draft under the current phase policy.
寫出有根據的問題；依已授權的 channel 傳訊，或按目前 phase 規則留為私人草稿。

Native message execution; delivery policy and email connectors are separate.
已有 message 執行；送達政策與 Email connector 分開處理。

[Source](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/agents/tools/message-tool-execution.ts#L597-L635)

## Remember the outcome / 記住問過了、收到什麼結果

Persist the commitment, source IDs, last contact and reply/completion evidence; reconcile later events.
保存承諾、來源 ID、上次聯絡與回覆／完成證據，後續收到新資料再更新。

Proposed business records in Colleague State, not an existing built-in commitment tracker.
需在 Colleague State 補業務紀錄，不宣稱框架已有完整承諾追蹤器。

## Proposed business state / 建議業務狀態

Store records in Colleague State; this is a design sketch, not an implemented schema. Keep unknown due dates and uncertain identity explicit instead of guessing.

```json
{
  "commitment_id": "stable application ID",
  "source_message_ids": [
    "original promise"
  ],
  "owner_identity": "resolved channel/account/person ID or unresolved",
  "promised_outcome": "upload the sales file",
  "due_at": "resolved date/time with timezone or null",
  "evidence_checked_at": "last successful source check",
  "completion_evidence_ids": [],
  "status": "open | unknown | awaiting_reply | completed | cancelled",
  "last_outreach_id": null,
  "delivery_status": "draft | pending | sent | failed",
  "next_contact_not_before": null
}
```

## Proposed acceptance checks

- A later reply says it is done → retrieve that evidence and suppress the follow-up. / 後續已有完成回覆 → 找到證據，不再追問。
- Two contacts named Alex → do not choose arbitrarily; resolve the identity before contact. / 兩位同名 Alex → 不猜收件者，確認身分後才聯絡。
- Already asked and still waiting → retain the pending state; apply the configured contact cadence. / 已問過、還在等 → 保留等待狀態，依設定的聯絡頻率處理。
- The mailbox or task API fails → record unknown status, not “Alex has not done it.” / 信箱或任務 API 讀取失敗 → 記錄狀態未知，不能說 Alex 沒做。
- Delivery fails → retry the same pending message with stable identity; do not generate another independent reminder. / 送達失敗 → 以同一筆待送訊息重試，不另生一份催辦。
- Current phase allows drafts only → prepare the question privately without sending it. / 目前 phase 只允許草稿 → 私下準備追問，不直接寄出。

## Ownership

Use existing Skills, Colleague State, Request Triage & Priority, Runtime Controller, Tools and interaction surface. Memory retrieval provides context; persisted business state governs follow-up identity, evidence and recovery. No separate always-thinking service is required to implement this scenario.

## Existing reminder mechanism

OpenClaw also implements Standing Intent: persistent keyword reminders matched on eligible user-trigger turns. Heartbeat/cron hooks sweep maintenance. This is not an automatic extractor/tracker for every promise. [Callable memory and intent audit](commitment-memory.md) records exact source paths and separates session indexing from session-search eligibility.
