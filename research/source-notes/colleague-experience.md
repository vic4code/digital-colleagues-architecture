# 同事感怎麼做：持續負責一件事，直到有結果

更新：2026-09-11。這份文件整合 OpenClaw 歷史與現況、Grok Bot 官方產品描述和 0.18 非官方重建碼。架構、資料欄位與驗收是本專案提案，尚未實作。

## 我們要的體驗

「Alex 說今天會補檔案。」隔天數位同事能接得上：知道是哪份檔案、查到現在的狀態、在授權範圍處理；真需要我決定時才找我，而且問過一次後不會忘記自己還在等。

同事感的可操作定義是：**你不必反覆交代背景，也不必代替它記得下一步；工作有進度、有證據、有交代。** 親切語氣可以改善體驗，但不替代持續責任。

| 使用者感受 | 要有的設計 | 失敗時會像什麼 |
|---|---|---|
| 你記得我們在做什麼 | 可追溯的工作／承諾、來源、關係人與近期脈絡 | 每次從頭問起 |
| 你接手後會繼續 | 持久狀態、事件／排程／completion 喚醒、恢復等待工作 | 聊完就消失 |
| 你知道下一步 | 職責、最新證據、依賴與可用工具；模型做有限範圍判斷 | 只反覆提醒 |
| 你知道何時找我 | 工作與通知分開、去重、安靜時段、必要升級 | 每次檢查都發訊息 |
| 你做完有交代 | 執行結果與送達紀錄、完成證據、明確的下一位 owner | 只有「收到」 |
| 你越來越懂配合 | 保存被確認的偏好、修正與工作 routine | 每次糾正同一件事 |

## Grok Bot 有沒有相關設計？有，但證據分兩層

**官方產品描述：** Grok Bot 被定位為工作 teammate；官方提到接回先前對話、跟進停滯交接、依使用方式保留脈絡，以及從示範與修正形成 routine。官方也描述 Bot 間交接、群組協作與需要判斷才找人。這支持產品方向，沒有公開證明其內部承諾抽取演算法、成功率或與重建版本的一致性。[官方 Grok Bot](https://x.ai/news/introducing-grok-bot)

**可閱讀的機制：** 本研究固定檢視 `b-nnett/grok-bot-0.18-reconstructed@a9f633e09d49a85829b8236331b9e21f7e612634`。它是非官方重建且帶擴充；以下是該 repo 行為，不冒充官方 backend。

| 機制 | 程式／prompt 證據 | 對同事感的意義 |
|---|---|---|
| 從需求辨識持續工作 | [automation.ts L19–35](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/automations/automation.ts#L19)：prompt 鼓勵辨識隱含 recurring needs；明確就建立 routine，不確定則提出 | 不要求使用者先學 cron；用意圖安排下一次工作 |
| 背景做事與發話分離 | [system-prompt.ts L82–100](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/runner/system-prompt.ts#L82)：hidden wake 先工作；SendMessage 才是對外訊息 | 每次醒來不必打招呼，但人在等的結果必須回報 |
| 完成事件接回原工作 | [completion-revivals.ts L99](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/completion-revivals.ts#L99)：接入背景／subagent 結果，再排入 continuation | 不必靠使用者說「繼續」才取回成果 |
| 有根據地往前想 | [system-prompt.ts L236–248](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/runner/system-prompt.ts#L236)：initiative 依觀察訊號與交辦範圍推導下一步 | 有限責任內的主動性，不是任意擴大任務 |
| 可執行的後續回合 | [automation-run-path.ts L178](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/automation-run-path.ts#L178)：routine context 排入背景 runner，允許 silence | 不只寫一段「要主動」的 prompt，還有喚醒與執行路徑 |

prompt 中的「應該」不是 deterministic guarantee。尚未證明原產品有通用的「每次對話抽取承諾 → 查證完成 → 自動找到人 → 主動寄信」完整鏈。`SendMessage` 是對目前使用者的交談介面，`SendToAgent` 是 Bot 協作；兩者都不能直接當作寄信給 Alex 的證據。詳見 [initiative 查核](initiative-grok.md) 與 [重建來源限制](grok-reconstructed.md)。

## OpenClaw 與 Grok Bot 的差異

| 路徑 | 未來要做的事如何產生 | 到時做什麼 | 限制 |
|---|---|---|---|
| OpenClaw 舊 inferred commitments | 隱藏 extraction 推斷短期 check-in | 無工具 heartbeat 決定問候或 dismiss | 已移除；不等於工作交付追蹤 |
| OpenClaw 現行基礎 | 職責／automation 指令，加上執行時模型判斷 | 喚醒、讀來源、tools、task／flow | 業務承諾辨識與 reconcile 需自行接合 |
| Grok Bot 重建 | 模型辨識持續需求，建立 routine；事件與 completion 接續 | 背景執行工作，再決定是否 SendMessage | 重建證據，非完整官方實作保證 |
| 本專案提案 | 職責內顯式工作＋有來源的推斷候選 | 查證 → 推進／等待／提問 → 留下證據與狀態 | 候選不是授權；無來源的猜測不可直接變成對外行動 |

OpenClaw 的歷史資料保留說法已過時；目前 migration 會清掉識別出的舊 commitment table。不要照舊文重新設定 `commitments.enabled`。詳見 [版本與原始碼查核](openclaw-inferred-commitments.md)。

## 建議的完整工作循環

1. **接住脈絡。** 收到對話、信件或事件，取出與現有職責相關的工作候選。辨識 explicit request、agent 自己承諾、他人承諾、弱推斷機會；保留來源 ID 與不確定性。
2. **承接責任。** 明確交辦或既有職責可以成為工作；弱推斷先保留 candidate 或一次簡短提案。confidence 只代表理解把握，不是操作授權。界定 owner、期待成果與完成條件。
3. **安排再看。** 已知時間就排程，等待外部改變就訂閱事件，背景工作就等待 completion。低頻 heartbeat 可兜底檢查；不需要一直思考的常駐 LLM。
4. **讀最新證據。** 喚醒後先合併新訊息與交付物，確認是否已完成、取消、改期或換人。來源故障保留 unknown；缺乏完成證據不代表對方沒做。
5. **選擇下一步。** 可自行完成就執行；缺依賴就等待；缺判斷才提問；有必要且已授權才向關係人跟進。多工作排序沿用 [prioritization](prioritization.md)。
6. **決定是否通知。** 使用者正在等的成果、阻塞決策、實質風險變化應回報；無新增資訊的例行檢查安靜結束。重複提醒依上次送達與等待狀態抑制。
7. **結案或延續。** 寫入完成證據、執行結果與送達狀態；仍未完成則留下下一個 trigger。修正偏好與 routine，不讓同一錯誤每次重來。

抽取可先放在正常回合的結構化狀態更新，不必一開始複製 OpenClaw 的獨立隱藏 pass。若後續評估發現漏接，再加入異步 extractor；兩種方式都走同一個驗證／去重入口，避免生成兩份工作。這是本專案選擇，沒有宣稱是 Grok Bot 的未公開設計。

## 狀態要分三種保存

| 資料 | 回答的問題 | 建議內容 |
|---|---|---|
| Memory | 我們之前知道什麼？ | 偏好、關係、事實、來源、修正；不是完成狀態權威 |
| Work / commitment | 現在由誰負責、還缺什麼？ | stable ID、來源、owner、outcome、due_at／timezone、evidence、status、next_check_at、依賴、scope |
| Execution / delivery | 這次做了與送了什麼？ | run ID、工具結果、outbox ID、delivery receipt、retry、last_outreach、awaiting_reply |

沿用 [commitment-followup-design](commitment-followup-design.md) 的 schema，補 `origin_kind`、`authority_ref`、`confidence`、`success_criteria` 與 `revision`。狀態建議：`candidate → open → waiting / in_progress → completed / cancelled`，`unknown` 表示觀測不足；`awaiting_reply` 不等於已完成。不得只靠聊天紀錄裡一句「我會記得」管理工作。

同時到來的 mail event 與 timer 必須 claim 同一工作 revision，送信採 stable action ID／outbox 並查送達結果。若外部 connector 無 idempotency，timeout 後先查送件紀錄或轉待確認，不能保證 exactly-once 也不能盲目重寄。這補在既有 Runtime Controller、Colleague State 與 Tools，不另建一個不受控的思考服務。

## Alex 情境：可觀察的差異

| 時點／新證據 | 工作狀態與動作 | 對人的訊息 |
|---|---|---|
| 昨天：Alex 說今天會給檔案 | 建候選，解析人與檔案；既有責任包含追蹤才接成工作 | 必要時確認缺失的成果／期限；不捏造時間 |
| 今日期限前已收到附件 | 關聯同一工作並驗證交付物，符合條件則完成 | 使用者在等就附連結回報；不再催 Alex |
| 到期仍無證據，工具正常 | 檢查原 thread、交付處，依權限準備或送一次具體追問 | 「想確認銷售檔案進度，今天彙整會用到」；不直接斷言未交 |
| 已問過但沒有回覆 | 保存 awaiting_reply 與下次可聯絡時間 | 下一個 heartbeat 不再重複同一句 |
| 來源工具故障 | unknown，保留待重查；時效風險必要時升級 | 「目前無法確認」，不能說 Alex 沒做 |
| Alex 回覆改到明天 | 更新 due／revision，撤掉過時提醒 | 只在影響決策或既有回報責任時告知 |

## 採用順序與驗收

沿用原 P0–P4 建置優先序，不變更 ADR 或 phase 權限：P0 補工作、證據與送達狀態；P1 先做一個限定職責的定時 follow-up；P2 接 mail／task 事件以改善時效；P3 接 completion 續跑；P4 才擴大隱含需求候選與可修正的 routines。若 P1 的工作本就需要背景執行，提早做最低限度 completion 回接；P0–P4 不應成為阻擋完整單一情境的僵硬瀑布。

驗收要量工作閉環，不能只量模型主動說了幾句：

- 承諾漏接率與錯建率：由人工標註的對話集比較；弱暗示不可強制建工作。
- 過時跟進率：已有完成／改期證據時，仍催問的比例。
- 接續成功率：completion 到來後，有沒有接回同一工作並交付結果。
- 重複外送數：並行喚醒、重啟、timeout 後是否重送同一 action。
- 打擾品質：有新增證據／需要決策的通知比例，加上使用者有用／無用回饋；不可只以低發送量算成功。
- 閉環率與延遲：接受的工作是否按責任交付或明確升級；使用者等待的成果不能被 silence 吃掉。
- 糾正保留：改收件人、偏好、截止時間後，下一輪是否使用新 revision。

第一個完整切片以 Alex 情境為準：完成、改期、重複喚醒、來源故障、同名收件人、外送 timeout、使用者正在等、僅能草稿八種情況都要涵蓋。門檻由試跑 baseline 和業務風險訂定；本次沒有虛構成功率，也未執行真人郵件 E2E。
