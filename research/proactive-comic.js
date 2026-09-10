(() => {
'use strict';
const scenes = {
  "flow-claw-0": {
    "frames": [
      [
        "Office hours: watch customer mail.",
        "上班時間，交代好的責任是留意客戶來信。"
      ],
      [
        "The scheduled heartbeat starts my check.",
        "Heartbeat 排程到了，啟動這次查看。"
      ],
      [
        "I read Outlook: a customer needs an answer today.",
        "我讀 Outlook，發現客戶要求今天答覆。"
      ],
      [
        "I send a private reminder with the mail; no urgent item means silence.",
        "有急事才送私人提醒與原信，沒事就不打擾。"
      ]
    ],
    "setup": "Outlook reader + private inbox / Outlook 讀信工具＋私人收件匣",
    "key": [
      "The check starts without another request; the agent decides whether the mail warrants a reminder.",
      "不用你再叫他查信；檢查會自行啟動，是否提醒則由 agent 判斷。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-0"
  },
  "flow-claw-1": {
    "frames": [
      [
        "The weekday inbox brief is saved for 09:00.",
        "已設定每個上班日 09:00 整理信箱摘要。"
      ],
      [
        "The automation becomes due and dispatches its saved work.",
        "排程到期，派送已存的工作。"
      ],
      [
        "I read new mail and list senders, requests and replies owed.",
        "我讀新信，整理來信者、要求與待回覆事項。"
      ],
      [
        "The brief goes to the configured destination.",
        "摘要送到事先指定的位置。"
      ]
    ],
    "setup": "Outlook reader + report delivery / Outlook 讀信工具＋報告送達管道",
    "key": [
      "The saved schedule starts the inbox brief at the assigned time, without a new message from you.",
      "排程到時就啟動信箱摘要，不必每天重新交辦。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-1"
  },
  "flow-claw-2": {
    "frames": [
      [
        "A contract is marked ready for review.",
        "合約被標成待審查。"
      ],
      [
        "The document integration calls /hooks/agent.",
        "文件系統的整合程式呼叫 /hooks/agent。"
      ],
      [
        "I open the contract with the SharePoint reader.",
        "我用 SharePoint 工具讀取合約。"
      ],
      [
        "I prepare review comments in your private inbox.",
        "我把審查意見整理到你的私人收件匣。"
      ]
    ],
    "setup": "Document-system webhook + SharePoint reader / 文件系統事件接線＋SharePoint 讀取工具",
    "key": [
      "The document event starts the review; you do not have to notice the status change and assign it again.",
      "文件狀態事件啟動審查，不必你先發現變更、再交辦一次。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-2"
  },
  "flow-claw-3": {
    "frames": [
      [
        "I start a long data check with a command.",
        "我用命令列啟動一批耗時資料檢查。"
      ],
      [
        "The command exits; on-exit starts the follow-up.",
        "命令結束，on-exit 啟動後續處理。"
      ],
      [
        "I read its result file.",
        "我讀取檢查結果檔。"
      ],
      [
        "I list the failed records without another prompt.",
        "不用再催，我就列出沒有通過的資料。"
      ]
    ],
    "setup": "Supervised command + result-file reader / 受管理的命令＋結果檔讀取工具",
    "key": [
      "Command completion starts the result review, without waiting for you to ask whether it finished.",
      "命令一結束就接續讀結果，不用等你追問跑完沒。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-3"
  },
  "flow-claw-4": {
    "frames": [
      [
        "A command keeps watching system logs.",
        "一支程式持續讀取系統紀錄。"
      ],
      [
        "It outputs checkout failed, payment timeout, then checkout recovered.",
        "它陸續輸出結帳失敗、付款逾時、結帳恢復。"
      ],
      [
        "Stream collects a batch and passes it to me.",
        "Stream 先收成一批，再把訊息交給我。"
      ],
      [
        "Checkout recovered; payment still needs investigation.",
        "結帳已恢復，但付款仍需要調查。"
      ]
    ],
    "setup": "Log watcher stdout/stderr + configured notification / 紀錄監看程式輸出＋指定通知管道",
    "key": [
      "New watcher output prompts follow-up after batching; the agent interprets the collected messages.",
      "監看程式有新輸出就交給同事處理；先收成一批，再由 agent 判斷狀況。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-4"
  },
  "flow-claw-5": {
    "frames": [
      [
        "A script checks the nightly import status API.",
        "小程式查夜間匯入的狀態 API。"
      ],
      [
        "Running: do not start me. Failed: allow the work.",
        "執行中就不叫我，失敗才允許啟動。"
      ],
      [
        "After failure, I read logs to locate the failed step.",
        "這次失敗了，我讀紀錄找出卡住的步驟。"
      ],
      [
        "I prepare an explanation from the logs.",
        "我依紀錄整理失敗原因。"
      ]
    ],
    "setup": "Custom status-check script + log reader / 自訂狀態檢查程式＋紀錄查詢工具",
    "key": [
      "The checking script decides when to start the agent; a failed import triggers investigation without another request.",
      "檢查 script 決定何時叫 agent；匯入失敗就啟動調查，不必再交辦。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-5"
  },
  "flow-claw-6": {
    "frames": [
      [
        "I check a payment incident through the monitoring API.",
        "我用監控 API 查看付款異常。"
      ],
      [
        "The incident is unresolved; I request a check in five minutes.",
        "還沒恢復，我要求五分鐘後再查。"
      ],
      [
        "Runtime checks the proposal and whether this run succeeded.",
        "Runtime 檢查提案是否合法、這次執行是否成功。"
      ],
      [
        "If accepted, it saves the earlier next-check time.",
        "通過才保存較早的下次檢查時間。"
      ]
    ],
    "setup": "Monitoring API + next_check / 監控 API＋下次檢查時間設定",
    "key": [
      "The agent proposes when to check again; the runtime applies the change only after a successful, valid run.",
      "Agent 自己提出下次何時再查；執行成功且符合限制，runtime 才採用。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-6"
  },
  "flow-claw-7": {
    "frames": [
      [
        "I finish a difficult weekly report.",
        "我完成一份很難整理的週報。"
      ],
      [
        "The completed work qualifies for Workshop review.",
        "這次已完成工作符合 Workshop 回顧條件。"
      ],
      [
        "The review extracts a useful spreadsheet-cleaning method.",
        "回顧整理出有用的試算表清理方法。"
      ],
      [
        "Permitted reporting instructions improve for next time.",
        "更新允許修改的指引，供下次使用。"
      ]
    ],
    "setup": "Completed work + permitted skill files / 已完成工作紀錄＋允許修改的技能檔",
    "key": [
      "Eligible completed work starts a background review that improves permitted instructions for next time.",
      "符合條件的已完成工作會啟動背景回顧，把做法補進允許修改的指引。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-7"
  },
  "flow-claw-8": {
    "frames": [
      [
        "Useful project facts are scattered in stored notes.",
        "專案資訊散落在已保存的筆記。"
      ],
      [
        "The configured Dreaming maintenance starts.",
        "設定好的 Dreaming 記憶整理啟動。"
      ],
      [
        "Stored memory is reviewed and organized.",
        "讀取並整理已有的記憶內容。"
      ],
      [
        "Useful information remains for later work; no inbox search starts.",
        "留下後續有用的資訊，不是去信箱找新任務。"
      ]
    ],
    "setup": "Stored memory + maintenance tools / 已保存記憶＋整理工具",
    "key": [
      "Scheduled maintenance organizes stored memory without a new request; it does not discover external tasks.",
      "記憶整理排程自行啟動，整理已存內容；這一步不是去外部找新任務。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-8"
  },
  "flow-claw-9": {
    "frames": [
      [
        "You assign the quarterly report with a budget.",
        "你交辦季報，並設定預算。"
      ],
      [
        "The goal tool records the assignment.",
        "目標工具記錄這份交辦。"
      ],
      [
        "The objective and budget are stored in conversation state.",
        "目標與預算存入對話狀態。"
      ],
      [
        "Storage alone starts no additional agent turn.",
        "單純保存，不會自己啟動下一輪工作。"
      ]
    ],
    "setup": "Goal storage; automatic restart unverified / 目標儲存；自動再啟動未證實",
    "key": [
      "This stores the assigned goal; storage alone does not start another working turn.",
      "這一步只保存交辦目標；保存本身不會自動啟動下一輪工作。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-claw-9"
  },
  "flow-hermes-0": {
    "frames": [
      [
        "A daily 09:00 Outlook review is saved.",
        "存下一項每天 09:00 查看 Outlook 的工作。"
      ],
      [
        "Cron starts a new work conversation when it is due.",
        "Cron 到期後開啟新的工作對話。"
      ],
      [
        "I read mail with the connected tool and list replies owed.",
        "我用接好的工具讀信，列出待回覆事項。"
      ],
      [
        "Runtime delivers the summary to the configured chat.",
        "Runtime 把摘要送到指定聊天室。"
      ]
    ],
    "setup": "Configured Outlook reader + chat delivery / 已接好的 Outlook 讀信工具＋聊天室送達",
    "key": [
      "Cron starts the saved inbox task and delivery path without waiting for a morning message.",
      "Cron 自行啟動已存的讀信工作與送達流程，不必等你早上開口。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-0"
  },
  "flow-hermes-1": {
    "frames": [
      [
        "A customer submits a support ticket.",
        "客戶送出一張客服單。"
      ],
      [
        "The support system sends its ID through a checked webhook.",
        "客服系統傳來單號，webhook 通過接收檢查。"
      ],
      [
        "I retrieve the actual ticket through the ticket tool.",
        "我用客服單工具讀取真正的問題。"
      ],
      [
        "I prepare a reply draft for you to review.",
        "我準備回覆草稿，交給你確認。"
      ]
    ],
    "setup": "Support webhook + ticket reader / 客服系統 webhook＋案件查詢工具",
    "key": [
      "An accepted ticket event starts the work; the integration supplies the trigger and the agent prepares the response.",
      "通過檢查的客服單事件啟動工作；整合程式送事件，agent 準備回覆。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-1"
  },
  "flow-hermes-2": {
    "frames": [
      [
        "You assign periodic supplier follow-up in this session.",
        "你在這段對話交代定期追供應商回覆。"
      ],
      [
        "Heartbeat becomes eligible; your active requests take priority.",
        "Heartbeat 到可執行時機，仍優先處理你的新要求。"
      ],
      [
        "I search Outlook for the supplier reply.",
        "我搜尋 Outlook，查看供應商是否回覆。"
      ],
      [
        "I remind you if the follow-up needs attention.",
        "需要注意時，我再提醒你。"
      ]
    ],
    "setup": "Session instructions + Outlook search / 對話內交辦＋Outlook 搜尋工具",
    "key": [
      "The session heartbeat revisits the assigned follow-up when eligible, while giving your active requests priority.",
      "Session heartbeat 在可執行時回來追交辦事項，並優先處理你正在提出的要求。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-2"
  },
  "flow-hermes-3": {
    "frames": [
      [
        "You ask me to recheck a large upload every few minutes.",
        "你交代每隔幾分鐘查看大檔案上傳。"
      ],
      [
        "A /loop tick starts the assigned check.",
        "/loop 啟動一輪既定檢查。"
      ],
      [
        "I query the upload status API; unfinished work waits for another tick.",
        "我查上傳狀態，沒好就等下一次。"
      ],
      [
        "Stop when complete or when the configured limit is reached.",
        "上傳完成或達到設定上限，就停止。"
      ]
    ],
    "setup": "Upload-status API + stop condition / 上傳狀態 API＋停止條件",
    "key": [
      "The loop repeats the assigned status check within its stop conditions; it is not choosing a new task.",
      "Loop 在停止條件內重複查交辦的狀態，不必你一直追問；不是自己選新任務。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-3"
  },
  "flow-hermes-4": {
    "frames": [
      [
        "The assigned goal is to make the tests pass.",
        "交辦目標是把測試修到通過。"
      ],
      [
        "After a turn, /goal evaluates progress and remaining limits.",
        "回合結束，/goal 檢查進度與剩餘限制。"
      ],
      [
        "If continuation is allowed, I inspect failures and try a repair.",
        "允許續跑時，我查失敗原因並嘗試修正。"
      ],
      [
        "Tests and goal controls decide whether to continue, wait or finish.",
        "依測試與目標控制，決定繼續、等待或完成。"
      ]
    ],
    "setup": "File editor + test command / 檔案編輯工具＋測試命令",
    "key": [
      "After a turn, goal evaluation decides whether to continue the repair, wait or stop within its limits.",
      "回合結束後，目標評估決定繼續修、等待或停止，並受設定限制。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-4"
  },
  "flow-hermes-5": {
    "frames": [
      [
        "My sales analysis depends on another colleague preparing a CSV.",
        "我的銷售分析要等另一位同事備好 CSV。"
      ],
      [
        "The prerequisite is marked complete.",
        "前置任務被標成完成。"
      ],
      [
        "The next Kanban scan dispatches ready work if capacity permits.",
        "下次 Kanban 掃描，有空間才派送已就緒工作。"
      ],
      [
        "I read the CSV with analysis tools and prepare the summary.",
        "我用分析工具讀 CSV，整理銷售摘要。"
      ]
    ],
    "setup": "Kanban task dependencies + CSV analysis / Kanban 任務依賴＋CSV 分析工具",
    "key": [
      "The dispatcher notices completed prerequisites on a scan and assigns ready work when capacity allows.",
      "Dispatcher 掃描到前置工作完成、也有執行空間時，就派送下一份工作。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-5"
  },
  "flow-hermes-6": {
    "frames": [
      [
        "I finish investigating a report-generation failure.",
        "我查完一件報表產生失敗的問題。"
      ],
      [
        "Enabled review logic checks whether the work qualifies.",
        "已啟用的回顧邏輯檢查這次工作是否符合條件。"
      ],
      [
        "The background review revisits logs and troubleshooting steps.",
        "背景回顧重看紀錄與排查步驟。"
      ],
      [
        "Useful steps go into files it is permitted to update.",
        "有用的步驟寫進允許更新的檔案。"
      ]
    ],
    "setup": "Completed run + restricted file writes / 已完成執行紀錄＋受限制的檔案寫入",
    "key": [
      "Enabled review logic starts a qualifying retrospective without a separate request to document the lesson.",
      "啟用的回顧邏輯會對符合條件的工作啟動回顧，不必另請他整理經驗。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-6"
  },
  "flow-hermes-7": {
    "frames": [
      [
        "Chronos holds the daily 09:00 inbox schedule.",
        "Chronos 管理每天 09:00 的信箱摘要排程。"
      ],
      [
        "Chronos notifies Hermes of this due occurrence.",
        "到期後，Chronos 通知 Hermes 這次工作。"
      ],
      [
        "Hermes claims execution before I read Outlook.",
        "Hermes 先取得執行權，我才讀 Outlook。"
      ],
      [
        "The assigned summary is delivered through the configured route.",
        "交辦的摘要經設定好的管道送達。"
      ]
    ],
    "setup": "Chronos + configured Outlook reader / Chronos 排程＋已接好的 Outlook 讀信工具",
    "key": [
      "The external schedule supplies the wake; Hermes claims that occurrence before doing the assigned work.",
      "外部排程提供喚醒；Hermes 先取得這次工作的執行權，再做交辦事項。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-7"
  },
  "flow-hermes-8": {
    "frames": [
      [
        "A scheduled script reads a stable list of Outlook message IDs.",
        "排程程式讀取固定格式的 Outlook 郵件 ID 清單。"
      ],
      [
        "Same as the saved list: skip the agent on this check.",
        "和上次清單相同，這次就不啟動 agent。"
      ],
      [
        "A later check changes the list; first observation also qualifies.",
        "後來一次查看清單變了；首次觀察也會進處理。"
      ],
      [
        "I read the mail and decide whether a reminder is useful.",
        "這時我才讀信，判斷是否值得提醒。"
      ]
    ],
    "setup": "Custom Outlook polling script + mail reader / 自訂 Outlook 輪詢程式＋讀信工具",
    "key": [
      "The source check runs on schedule; first or changed output starts the agent, while unchanged output skips it.",
      "排程先查資料；首次或內容有變才啟動 agent，沒變就略過。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-hermes-8"
  },
  "flow-ob-0": {
    "frames": [
      [
        "You save a Friday team-progress routine.",
        "你設定週五整理團隊進度的 routine。"
      ],
      [
        "The schedule offers the work to a Bot.",
        "排程到時，把工作交給 Bot。"
      ],
      [
        "I use current permissions to read connected project channels.",
        "我用目前權限讀已連接的專案頻道。"
      ],
      [
        "The progress summary returns to the chosen channel.",
        "進度摘要回傳到指定頻道。"
      ]
    ],
    "setup": "Connected project channel + channel delivery / 已連接的專案頻道＋頻道送達",
    "key": [
      "A saved routine becomes queued work at the scheduled time, without another assignment from you.",
      "既定 routine 到時成為佇列工作，不必你重新派工。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-ob-0"
  },
  "flow-ob-1": {
    "frames": [
      [
        "A number in my report needs a specialist explanation.",
        "報告裡有個數字，需要專家幫忙解釋。"
      ],
      [
        "I use message_bot to ask a permitted data specialist.",
        "我用 message_bot 請獲准協作的資料專家。"
      ],
      [
        "The specialist uses its own tools and permissions to investigate.",
        "專家用自己的工具與權限查來源。"
      ],
      [
        "The specialist returns its explanation through the handoff flow.",
        "專家透過派工流程交回說明。"
      ]
    ],
    "setup": "message_bot + specialist database tool / message_bot 派工＋專家的資料庫工具",
    "key": [
      "One bot delegates through message_bot so the specialist can receive the task without a human handoff.",
      "Bot 用 message_bot 交給專家處理，不必由你在兩位同事間轉述任務。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-ob-1"
  },
  "flow-ob-2": {
    "frames": [
      [
        "A data specialist is investigating a sales figure for me.",
        "資料專家正在幫我查一個銷售數字。"
      ],
      [
        "The specialist completes the investigation.",
        "專家完成調查。"
      ],
      [
        "The result relay carries the answer back to the requesting Bot.",
        "Result relay 把答案送回原本提問的 Bot。"
      ],
      [
        "The requester receives the findings without manual copying.",
        "派工者收到成果，不必由人複製貼上。"
      ]
    ],
    "setup": "message_bot result + requesting conversation / message_bot 成果＋原始求助對話",
    "key": [
      "The result relay returns delegated findings to the requester without manual copying between conversations.",
      "成果自動送回派工者，不必你在對話間複製貼上。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-ob-2"
  },
  "flow-ob-3": {
    "frames": [
      [
        "A Bot owns a long-running database analysis.",
        "一位 Bot 正負責耗時的資料庫分析。"
      ],
      [
        "The lease heartbeat becomes due.",
        "工作租約的 heartbeat 到期。"
      ],
      [
        "It renews ownership of the same work.",
        "它替同一份工作續租執行權。"
      ],
      [
        "No new task or model turn is created by renewal.",
        "續租不會新增任務，也不會叫模型另想一輪。"
      ]
    ],
    "setup": "Queue lease renewal during existing work / 既有工作執行中的佇列續租",
    "key": [
      "This heartbeat renews work ownership; it supports reliable execution but starts no new agent turn.",
      "這個 heartbeat 只續租工作執行權，支援可靠執行；不會啟動新的 agent 回合。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-ob-3"
  },
  "flow-gr-0": {
    "frames": [
      [
        "A cloud automation occurrence record becomes available.",
        "雲端出現一筆自動化執行紀錄。"
      ],
      [
        "The local polling consumer discovers the record.",
        "本機輪詢程式讀到這筆紀錄。"
      ],
      [
        "It validates the request and dispatches the corresponding work.",
        "它檢查要求，派送對應工作。"
      ],
      [
        "This trace starts the work; it does not explain cloud scheduling.",
        "這條路徑啟動工作，不代表已查明雲端如何排程。"
      ]
    ],
    "setup": "Reconstructed cloud receiver + configured repository reader / 重建版雲端接收器＋需配置的程式庫讀取工具",
    "key": [
      "The local consumer discovers a new automation record and starts its work; cloud scheduling is outside this trace.",
      "本機接收程式讀到新自動化紀錄就啟動工作；這條路徑不說明雲端如何排程。"
    ],
    "scope": "Grok reconstruction / Grok 非官方重建版",
    "evidence": "#flow-gr-0"
  },
  "flow-gr-1": {
    "frames": [
      [
        "A connected integration receives a failed-build notice.",
        "已接好的整合程式收到建置失敗通知。"
      ],
      [
        "It queues the event for the existing conversation.",
        "它把事件放進原有對話的佇列。"
      ],
      [
        "When the conversation is idle, a follow-up may begin.",
        "對話閒置時，可開始後續處理。"
      ],
      [
        "With configured log tools, I investigate and report findings.",
        "若已接好紀錄工具，我就查原因、整理發現。"
      ]
    ],
    "setup": "Custom event integration + log reader / 自訂事件接線＋紀錄查詢工具",
    "key": [
      "An incoming background event can resume an idle conversation without a new user message.",
      "背景事件到來，可以接續閒置對話，不必你再送一則訊息。"
    ],
    "scope": "Grok reconstruction / Grok 非官方重建版",
    "evidence": "#flow-gr-1"
  },
  "flow-gr-2": {
    "frames": [
      [
        "I delegate a repository investigation and wait for the result.",
        "我委派程式庫調查，等待對方成果。"
      ],
      [
        "The delegated agent completes and returns its findings.",
        "對方完成，交回調查發現。"
      ],
      [
        "The host checks duplicate completion and requests continuation.",
        "Host 檢查重複完成通知，再要求接續對話。"
      ],
      [
        "I can continue the original work using the returned context.",
        "我取得回傳脈絡，繼續原本的工作。"
      ]
    ],
    "setup": "Delegated agent result + original conversation / 委派 agent 成果＋原始對話",
    "key": [
      "A delegated result requests continuation of the waiting conversation; duplicate completions are checked.",
      "委派成果回來會要求接續等待中的對話，並檢查重複完成通知。"
    ],
    "scope": "Grok reconstruction / Grok 非官方重建版",
    "evidence": "#flow-gr-2"
  },
  "flow-gr-3": {
    "frames": [
      [
        "Several continuation turns have used no counted tools.",
        "連續幾次續跑沒有使用計入的工具。"
      ],
      [
        "Another goal-continuation request arrives.",
        "又收到一次目標續跑要求。"
      ],
      [
        "The handler checks the goal and no-tool threshold.",
        "處理器檢查目標與無工具進展門檻。"
      ],
      [
        "At the threshold it pauses; this guard does not invent work.",
        "達門檻就暫停；這個保護不會自己產生工作。"
      ]
    ],
    "setup": "Continuation request + progress guard / 續跑要求＋進度檢查",
    "key": [
      "This guard stops ineffective continuation after the no-tool threshold; it does not generate new work.",
      "這個控制在無工具進展達門檻時停止無效續跑；本身不會產生新工作。"
    ],
    "scope": "Grok reconstruction / Grok 非官方重建版",
    "evidence": "#flow-gr-3"
  },
  "flow-v-0": {
    "frames": [
      [
        "You start exploration in the Minecraft environment.",
        "你啟動 Minecraft 環境中的探索。"
      ],
      [
        "World state, inventory and task history reach the curriculum.",
        "環境、背包與任務歷史交給 curriculum。"
      ],
      [
        "The curriculum model selects the next exploration task.",
        "Curriculum 模型選下一個探索任務。"
      ],
      [
        "After acting and checking results, the loop chooses again.",
        "執行並檢查成果後，迴圈再選下一件事。"
      ]
    ],
    "setup": "Minecraft state + game-action code / Minecraft 狀態＋遊戲操作程式",
    "key": [
      "The curriculum model chooses the next exploration task from observations and history, without an itemized task list.",
      "Curriculum 模型依觀察與歷史選下一個探索任務，不必你逐件列出要做什麼。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-v-0"
  },
  "flow-v-1": {
    "frames": [
      [
        "An attempted crafting program fails: materials are missing.",
        "合成程式失敗，遊戲回報材料不足。"
      ],
      [
        "The action agent receives environment feedback.",
        "Action agent 收到環境回饋。"
      ],
      [
        "It revises the action program and retries the same task.",
        "它修正操作程式，重試同一任務。"
      ],
      [
        "Stop after verified success or the attempt limit.",
        "驗證成功或嘗試次數用完就停止。"
      ]
    ],
    "setup": "Game feedback + code execution + verification / 遊戲回饋＋程式執行＋成果驗證",
    "key": [
      "Environment feedback drives a revised attempt on the same task, until success or the attempt limit.",
      "環境回饋促使 agent 修正並重試同一任務，直到成功或達到次數上限。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-v-1"
  },
  "flow-cx-0": {
    "frames": [
      [
        "You schedule a weekday 09:00 local project review in the app.",
        "你在 App 設定上班日 09:00 查看本機專案。"
      ],
      [
        "The app starts the task while the machine and app are available.",
        "電腦與 App 可用時，排程啟動工作。"
      ],
      [
        "I read project files and inspect recent changes.",
        "我讀專案檔案，查看近期變更。"
      ],
      [
        "I prepare a progress brief; the schedule does not power on the laptop.",
        "我整理進度摘要；排程不會替筆電開機。"
      ]
    ],
    "setup": "App schedule + local project files / App 排程＋本機專案檔案",
    "key": [
      "The app schedule starts the saved task when its execution environment is available, without a new message.",
      "執行環境可用時，App 排程自行啟動既定工作，不必你再開口。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cx-0"
  },
  "flow-cx-1": {
    "frames": [
      [
        "You assign the goal: make the tests pass.",
        "你交辦目標：把測試修到通過。"
      ],
      [
        "The thread becomes idle with an active goal.",
        "Thread 閒置，且仍有有效目標。"
      ],
      [
        "Runtime may start another eligible turn to continue the repair.",
        "Runtime 可啟動符合條件的下一輪修復。"
      ],
      [
        "Work continues toward that same goal within its controls.",
        "在控制條件內，繼續推進同一個目標。"
      ]
    ],
    "setup": "Goal controls + file editor + test command / 目標控制＋檔案編輯＋測試命令",
    "key": [
      "An active goal can trigger another eligible turn after the thread becomes idle, continuing the same objective.",
      "Thread 閒置後，有效目標可啟動下一個符合條件的回合，繼續同一目標。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cx-1"
  },
  "flow-cx-2": {
    "frames": [
      [
        "The build system reports a deployment failure.",
        "建置系統回報部署失敗。"
      ],
      [
        "Your custom listener receives the event.",
        "你自行接的監聽程式收到事件。"
      ],
      [
        "It starts Codex through exec or App Server.",
        "它透過 exec 或 App Server 啟動 Codex。"
      ],
      [
        "I read logs and prepare a fix; sensing belongs to the integration.",
        "我讀紀錄、準備修正；事件感測由整合程式負責。"
      ]
    ],
    "setup": "Custom build listener + exec/App Server + shell / 自訂建置監聽＋exec/App Server＋命令列工具",
    "key": [
      "Your integration detects the event and starts Codex; exec / App Server provide execution, not the event sensor.",
      "你的整合程式偵測事件並啟動 Codex；exec／App Server 提供執行介面，不負責感測事件。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cx-2"
  },
  "flow-cx-3": {
    "frames": [
      [
        "I finish the assigned build check.",
        "我完成交辦的建置檢查。"
      ],
      [
        "The turn-completion notification invokes your configured script.",
        "回合完成通知呼叫你設定的 script。"
      ],
      [
        "The script displays a desktop reminder.",
        "Script 顯示桌面提醒。"
      ],
      [
        "You learn the result is ready; no new investigation starts.",
        "你知道結果好了；這不會另啟動調查。"
      ]
    ],
    "setup": "Configured notify script + desktop notification / 已設定的 notify 腳本＋桌面通知",
    "key": [
      "Turn completion invokes a configured notification script; it reports the result rather than starting new work.",
      "回合結束呼叫已設定的通知 script，主動告知結果，不會另開工作。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cx-3"
  },
  "flow-cc-0": {
    "frames": [
      [
        "You ask /loop to check a running deployment every five minutes.",
        "你用 /loop 交代每五分鐘查一次部署。"
      ],
      [
        "The session schedule starts the next check.",
        "對話內排程啟動下一次查看。"
      ],
      [
        "I run the deployment-status command.",
        "我執行部署狀態命令。"
      ],
      [
        "I report completion when observed; session controls bound the loop.",
        "看到完成就回報；loop 受 session 執行條件限制。"
      ]
    ],
    "setup": "/loop + deployment-status command / /loop＋部署狀態命令",
    "key": [
      "The schedule revisits the deployment check without repeated prompts; this example repeats an assigned task.",
      "排程自行回來查部署，不必你反覆追問；此情境是在重複既定任務。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-0"
  },
  "flow-cc-1": {
    "frames": [
      [
        "I start a log-watching command through Monitor.",
        "我透過 Monitor 啟動紀錄監看程式。"
      ],
      [
        "The command prints a new error line.",
        "程式輸出一行新錯誤。"
      ],
      [
        "Monitor feeds the line into the conversation as an event.",
        "Monitor 把輸出以事件帶回對話。"
      ],
      [
        "I can read surrounding logs and investigate the error.",
        "我接著讀前後紀錄，調查錯誤。"
      ]
    ],
    "setup": "Monitor + log-watching process + shell / Monitor＋紀錄監看程式＋命令列工具",
    "key": [
      "Monitor output enters the session as events, prompting follow-up without another message from you.",
      "Monitor 輸出以事件進入對話，促成後續處理，不必你再傳訊息。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-1"
  },
  "flow-cc-2": {
    "frames": [
      [
        "A colleague posts that the build failed in a connected Telegram bot.",
        "同事在已連接的 Telegram bot 說建置失敗。"
      ],
      [
        "The Channel delivers that message into my session.",
        "Channel 把訊息送進我的 session。"
      ],
      [
        "With available repository tools, I inspect the failure.",
        "有提供程式庫工具時，我就查失敗原因。"
      ],
      [
        "I can respond through the connected Telegram tools.",
        "我可以透過已連接的 Telegram 工具回覆。"
      ]
    ],
    "setup": "Telegram channel + repository/shell tools / Telegram 頻道＋程式庫與命令列工具",
    "key": [
      "A connected channel brings the external message into the working session without manual forwarding.",
      "已連接的 channel 把外部訊息帶入工作對話，不必手動轉貼。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-2"
  },
  "flow-cc-3": {
    "frames": [
      [
        "You schedule a daily local-folder review in Desktop.",
        "你在 Desktop 排好每天查看本機專案資料夾。"
      ],
      [
        "The schedule starts while the app and computer are available.",
        "App 與電腦可用時，排程啟動。"
      ],
      [
        "I read the local files and inspect recent changes.",
        "我讀本機檔案，查看近期變更。"
      ],
      [
        "I list new changes and unresolved issues.",
        "我列出最新變更與未解問題。"
      ]
    ],
    "setup": "Desktop scheduled task + local file tools / Desktop 排程工作＋本機檔案工具",
    "key": [
      "The desktop schedule starts the local project check when the app and machine are available.",
      "App 與電腦可用時，桌面排程自行啟動本機專案檢查。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-3"
  },
  "flow-cc-4": {
    "frames": [
      [
        "You configure a cloud routine to review new PRs.",
        "你設定有新 PR 就審查的雲端 routine。"
      ],
      [
        "A new PR activates the configured trigger, even with your laptop off.",
        "有人開 PR，已接好的觸發啟動；筆電可關閉。"
      ],
      [
        "The cloud worker reads repository changes in its configured environment.",
        "雲端 worker 在設定的環境讀程式庫變更。"
      ],
      [
        "The review result is produced by that cloud work.",
        "這份雲端工作產生審查結果。"
      ]
    ],
    "setup": "Configured PR trigger + cloud repository access / 已設定的 PR 觸發＋雲端程式庫存取",
    "key": [
      "The configured cloud trigger starts the saved PR review even when your laptop is off.",
      "已設定的雲端觸發自行啟動 PR 審查，筆電關閉也不影響這份雲端工作。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-4"
  },
  "flow-cc-5": {
    "frames": [
      [
        "I edit files during the assigned task.",
        "我在交辦工作中修改檔案。"
      ],
      [
        "A post-edit hook runs your configured check.",
        "編輯後的 hook 執行你指定的檢查。"
      ],
      [
        "At stopping time, a Stop hook may find unfinished work.",
        "準備結束時，Stop hook 可能查到未完成事項。"
      ],
      [
        "It can require follow-up; I continue editing and testing.",
        "它可要求接續，我再修改與測試。"
      ]
    ],
    "setup": "Edit/Stop hooks + check script + editor / 編輯與 Stop hooks＋檢查腳本＋編輯工具",
    "key": [
      "Lifecycle hooks run configured checks; a Stop hook can require follow-up when its script finds unfinished work.",
      "生命週期 hook 自行跑設定的檢查；Stop hook 的 script 發現未完成事項時，可要求接續處理。"
    ],
    "scope": "Configured illustration / 已設定工具與責任的示範",
    "evidence": "#flow-cc-5"
  }
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const players = new Set();
const avatar = `<svg class="comic-avatar" viewBox="0 0 150 150" aria-hidden="true"><path d="M26 145Q28 92 75 93Q122 92 124 145" fill="#ffedd5" stroke="#9a3412" stroke-width="2"/><path d="M65 94L75 108L85 94" fill="white" stroke="#9a3412" stroke-width="2"/><rect x="43" y="22" width="64" height="70" rx="27" fill="#fff" stroke="#44403c" stroke-width="2"/><path d="M42 47Q36 7 77 13Q111 13 108 45L88 33L64 40Z" fill="#44403c"/><circle cx="61" cy="57" r="3" fill="#44403c"/><circle cx="89" cy="57" r="3" fill="#44403c"/><path d="M65 73Q75 82 85 73" fill="none" stroke="#9a3412" stroke-width="2"/><rect x="39" y="122" width="72" height="24" rx="3" fill="#fafaf9" stroke="#78716c"/></svg>`;
function pair(node,en,zh){node.replaceChildren(document.createTextNode(en));const sub=document.createElement('span');sub.className='zh';sub.lang='zh-Hant';sub.textContent=zh;node.append(sub);}
function stopAll(except){for(const p of players)if(p!==except)p.pause();}
function create(details,scene){
 const root=details.querySelector('.comic-mount');
 root.innerHTML=`<div class="proactive-comic"><div class="comic-heading"><span class="comic-small" data-role="scope"></span><button type="button" data-role="close">Close / 收起</button></div><div class="comic-stage" data-step="0"><div class="comic-source"><span class="comic-small">THIS MECHANISM / 此機制</span><strong data-role="name"></strong><span class="comic-envelope" aria-hidden="true">①</span></div><div class="comic-person"><div class="comic-bubble" data-role="speech"></div>${avatar}<span class="comic-small">DIGITAL COLLEAGUE / 數位同事</span></div></div><div class="comic-controls"><button class="comic-play" type="button" data-role="play">Play / 播放</button><button type="button" data-role="prev">← Previous / 上一格</button><button type="button" data-role="next">Next / 下一格 →</button><button type="button" data-role="replay">Restart / 重播</button><span class="comic-count" data-role="count" aria-live="polite" aria-atomic="true"></span><a class="comic-evidence" data-role="evidence">Implementation / 看實作 →</a></div><ol class="comic-frames" data-role="frames"></ol></div>`;
 const el=name=>root.querySelector(`[data-role="${name}"]`);
 let step=0,timer=null;
 function pause(){if(timer!==null)clearTimeout(timer);timer=null;el('play').textContent='Play / 播放';el('play').setAttribute('aria-pressed','false');}
 const player={pause};players.add(player);
 function render(){
  const frame=scene.frames[step];pair(el('speech'),...frame);
  root.querySelector('.comic-stage').dataset.step=String(step);
  root.querySelector('.comic-envelope').textContent=['①','②','③','④'][step];
  el('count').textContent=`${step+1} / 4`;el('prev').disabled=step===0;el('next').disabled=step===3;
  el('frames').replaceChildren(...scene.frames.map((f,i)=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';pair(b,`${i+1}. ${f[0]}`,f[1]);b.setAttribute('aria-current',String(i===step));b.addEventListener('click',()=>{pause();step=i;render();el('frames').querySelectorAll('button')[i].focus({preventScroll:true});});li.append(b);return li;}));
  root.classList.remove('comic-transition');if(!reduced.matches){void root.offsetWidth;root.classList.add('comic-transition');}
 }
 function schedule(){timer=setTimeout(()=>{timer=null;if(step<3){step++;render();}if(step<3)schedule();else pause();},4800);}
 el('scope').textContent=scene.scope+' · No live actions / 不執行真實動作';
 const card=details.closest('.mechanism-item')||details.closest('.supporting-state');
 el('name').textContent=card?.querySelector('.feature-title')?.textContent||details.dataset.comicId;
 el('evidence').href=scene.evidence;
 el('play').addEventListener('click',()=>{if(timer!==null){pause();return;}stopAll(player);if(step===3){step=0;render();}el('play').textContent='Pause / 暫停';el('play').setAttribute('aria-pressed','true');schedule();});
 el('prev').addEventListener('click',()=>{pause();step=Math.max(0,step-1);render();});
 el('next').addEventListener('click',()=>{pause();step=Math.min(3,step+1);render();});
 el('replay').addEventListener('click',()=>{pause();step=0;render();});
 el('close').addEventListener('click',()=>{details.open=false;pause();details.querySelector('summary').focus();});
 details.addEventListener('toggle',()=>{if(!details.open)pause();else stopAll(player);});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();},{threshold:0}).observe(root);
 reduced.addEventListener('change',()=>{pause();root.classList.remove('comic-transition');});
 pause();render();return player;
}
for(const details of document.querySelectorAll('.mechanism-comic')){
 let player=null;
 details.addEventListener('toggle',()=>{if(details.open){stopAll(player);if(!player)player=create(details,scenes[details.dataset.comicId]);}else player?.pause();});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
})();
