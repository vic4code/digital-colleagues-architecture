window.FRAMEWORK_MECHANISMS = {
  "openclaw": {
    "name": "OpenClaw",
    "tag": "共用喚醒管線，多種工作來源",
    "version": "原碼快照 91ea838 · 2026-09-08",
    "verdict": "會調節下次檢查、整理經驗與保存目標。歷史 inferred commitments 已退役，不能由現存 heartbeat 推定自主跟進仍可用。",
    "items": [
      [
        "Heartbeat／Automations",
        "wake",
        "多個入口，共用准入與 turn",
        "agents.defaults.heartbeat.every；openclaw cron；/hooks/wake、/hooks/agent",
        "heartbeat config 投影成 managed job；到期 payload 或 HTTP hook 進 wake admission，再派送 agent turn。/hooks/agent 可直接送獨立 turn。",
        "Heartbeat 不是另一個獨立備援 timer；webhook 投遞與 inbound hook 不同。",
        "https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-execution.ts#L161"
      ],
      [
        "條件、串流、程序結束",
        "wake",
        "條件滿足，才執行工作",
        "Automations schedule：on-exit／stream；condition watcher",
        "監督程序 exit 或 stdout/stderr batch → watcher → 共用 cron execution；trigger script 回傳 fire:false 可跳過 payload。",
        "批次計時器是合併事件；條件腳本決定准入，不替模型創造任務。",
        "https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/automation/cron-jobs/schedules.md#L14"
      ],
      [
        "next_check",
        "continue",
        "Agent 提議下次何時再看",
        "cron tool：next_check（須啟用 pacing）",
        "run-scoped 提議 → 成功與 job/run 身分檢查 → min/max 夾限 → 儲存下次到期。",
        "改的是節律；不是新工作來源。",
        "https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-outcomes.ts#L481"
      ],
      [
        "Durable goals",
        "continue",
        "保存目標，後續 turn 帶回脈絡",
        "create_goal／goal 狀態介面（快照限定）",
        "建立與恢復產生 continuation input；active goal 注入後續 inbound turn。",
        "在已查路徑未證實獨立自動續跑 controller。目標持久化不等於會自行安排每個下一輪。",
        "reading/research/source-notes/openclaw.html"
      ],
      [
        "Dreaming／Skill Workshop",
        "learn",
        "整理記憶，回顧工作經驗",
        "memory-core dreaming 設定；Skill Workshop 設定",
        "managed cron 做記憶整理；合格工作結束後延遲 review，寫入受限技能產物。",
        "日記與技能更新不等於新外部任務；本次未驗證由它們自動建 root goal。",
        "https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/tools/skill-workshop.md#L12"
      ]
    ]
  },
  "hermes": {
    "name": "Hermes",
    "tag": "觀察省成本，目標與看板推進工作",
    "version": "原碼快照 fef0e16 · 2026-09-08",
    "verdict": "核心差異是變化閘、目標評估與就緒派工；self-paced 並不是學會了什麼值得關注。",
    "items": [
      [
        "Cron monitor／Webhook／Heartbeat",
        "wake",
        "有變化才叫模型；事件也可直入",
        "cronjob：monitor_script／monitor_url；/heartbeat；Webhook route",
        "排程 monitor 算輸出 hash → 沒變跳過模型；HTTP 經驗證與過濾成 MessageEvent；heartbeat 先查 session 忙碌與訊息 queue。",
        "hash baseline 在 agent 執行前存，不是成功投遞證明。",
        "https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L2301"
      ],
      [
        "Self-paced loop",
        "continue",
        "結果相似，延長等待",
        "/loop、/proactive",
        "complete_tick 對正規化文字做 SHA-256；同 digest 倍增 interval，變化則回 floor。",
        "會移除日期與數字時長；文字換句話也可能重設節律。不是語意相似度。",
        "https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/loops.py#L583"
      ],
      [
        "Persistent goal",
        "continue",
        "判斷繼續、等待、暫停或完成",
        "/goal",
        "post-turn → gates＋judge＋budget → session queue 接續；等待與錯誤有不同停條件。",
        "人給的目標仍是工作來源；workspace fingerprint 只看 HEAD＋status，不能當內容相同證明。",
        "https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/gateway/run_goals.py#L262"
      ],
      [
        "Kanban readiness",
        "select",
        "依賴完成，認領已就緒任務",
        "Kanban dispatcher／看板任務介面",
        "週期 sweep → promote ready task → claim → spawn worker。",
        "狀態決定哪件已交辦工作可做；polling 只是發現它。",
        "https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/kanban_db_dispatch.py#L1812"
      ],
      [
        "Background review",
        "learn",
        "工作後更新記憶與技能",
        "background review 設定；memory／skill tools",
        "合格 finalizer → 隔離 review → 受限工具白名單更新記憶或技能；禁止 review 自我遞迴。",
        "學的是外部記憶／技能產物，不是更新模型權重；也不證明學到的內容正確。",
        "https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/agent/turn_finalizer.py#L591"
      ]
    ]
  },
  "claude": {
    "name": "Claude Code",
    "tag": "排程、事件、停止攔截與獨立完成評估",
    "version": "官方文件查核 · 2026-09-14",
    "verdict": "最容易漏掉的是 Stop hook：下一輪可以由完成檢查決定，不必等待另一個 cron tick。",
    "items": [
      [
        "Scheduled prompts／Channels",
        "wake",
        "時間到或收到外部訊息，開啟工作",
        "/loop → CronCreate；--channels",
        "session 排程到期送 prompt；Channels 透過 MCP server 將事件送入 session。",
        "傳輸不代表來源：上游可以 polling，再以 MCP notification 送入。",
        "https://code.claude.com/docs/en/channels"
      ],
      [
        "Goal evaluator",
        "continue",
        "另一個模型判斷是否還要做",
        "/goal",
        "每輪完成 → 小模型檢查完成條件 → 達成／不可能則停，否則下一輪；另有 idle check-in 與 retry。",
        "evaluator 看對話證據，不會自行讀檔或跑測試；不是硬性驗收器。",
        "https://code.claude.com/docs/en/goal"
      ],
      [
        "Stop hook",
        "continue",
        "用自己的檢查擋住結束",
        "settings hooks.Stop；decision:block＋reason",
        "turn 想結束 → command／prompt hook → 判斷是否阻止停止 → 回饋給下一輪。",
        "需要 stop_hook_active 等防遞迴設計；Auto mode 只處理授權，不自行啟動下一輪。",
        "https://code.claude.com/docs/en/hooks#stop"
      ]
    ]
  },
  "codex": {
    "name": "Codex",
    "tag": "目標狀態驅動跨 turn 續行",
    "version": "原碼快照 634ebc1 · 版本限定",
    "verdict": "主機管理 goal、預算與 idle 接續；模型仍在已授予的目標內決定下一步。",
    "items": [
      [
        "Active-goal continuation",
        "continue",
        "idle 時，讓未完成目標繼續",
        "/goal；已查核 app-server thread/goal/set",
        "active goal 狀態 → idle 檢查 → 鎖內再確認 → start_turn_if_idle；完成／blocked／預算限制結束續行。",
        "此來源只證明 goal 路徑，不能推成所有 Codex 版本都有同名介面，也不能算自行發現新工作。",
        "https://github.com/openai/codex/blob/634ebc1865c6ac840ed3ba118f040d527bf4b55d/codex-rs/ext/goal/src/runtime.rs#L399"
      ],
      [
        "Host orchestration",
        "wake",
        "宿主決定何時送進下一個 turn",
        "app-server thread／turn 生命週期",
        "我們的 scheduler／event ingress 檢查後，經 adapter 送入 app-server。",
        "這是整合邊界，不算 Codex 原生 heartbeat 或排程器；本表不以缺少此證據斷言產品沒有其他 automation。",
        "reading/research/source-notes/proactive-trigger-mechanisms.html"
      ]
    ]
  },
  "grok": {
    "name": "Grok Build",
    "tag": "保留證據空缺，不拿重建品補勾",
    "version": "原研究 2026-09 鏡像範圍",
    "verdict": "原研究有續行與內部 timer 記載；本輪未取得可重驗的公開建立介面，無法和前四家等強度比較。",
    "items": [
      [
        "目標續行／內部排程線索",
        "continue",
        "已交辦工作接續；公開入口待核對",
        "未驗證可調用的建立介面",
        "原研究記載 biased select 與相對 interval；這只能支持內部控制流線索，不能推出 cron 建立能力。",
        "Grok Bot 非官方重建的 completion revival、automation consumer 不可挪作 Grok Build 證據。",
        "https://github.com/shane01526/agent_initiate/blob/main/2026_09/heartbeat-lifecycle.html"
      ]
    ]
  },
  "voyager": {
    "name": "Voyager",
    "tag": "真正選下一題：curriculum × feedback × skills",
    "version": "研究補充 · 原碼快照 55e45a8",
    "verdict": "這裡多的不是第三種喚醒源，而是選題策略：依環境與能力進展產生下一個任務。",
    "items": [
      [
        "Automatic curriculum",
        "select",
        "從環境與進度，提出下一個任務",
        "Voyager.learn()；CurriculumAgent.propose_next_task()",
        "learn while → 環境／歷史／能力 → propose_next_task → rollout → 更新進度 → 再選題。",
        "在被授予的 Minecraft 探索範圍內選題；不是企業角色的全主動驗證。",
        "https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L295"
      ],
      [
        "Iterative prompting＋critic",
        "continue",
        "失敗回饋，驅動修正與重試",
        "rollout()；CriticAgent.check_task_success()",
        "程式執行 → 環境回饋／錯誤 → critic → 修訂程式，受 rollout 次數限制。",
        "修正同一題與 curriculum 換新題是兩個機制；critic 模型判斷不是確定性證明。",
        "https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L203"
      ],
      [
        "Skill library",
        "learn",
        "成功方法存成技能，下輪取用",
        "SkillManager.add_new_skill()／retrieve_skills()",
        "成功結果 → 技能程式與描述入庫 → 依新任務檢索 → 下次生成程式的 context。",
        "累積可重用程式，不是睡眠時自行思考；失敗不等於學到可靠技能。",
        "https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/skill.py#L57"
      ]
    ]
  },
  "openbot": {
    "name": "OpenBot",
    "tag": "可靠派工與交接，補上長時間運作",
    "version": "工程補充 · 原碼快照 7b94a0b",
    "verdict": "queue／lease／relay 解決工作不丟、不亂重做；它們本身不會替 agent 想出新工作。",
    "items": [
      [
        "Durable routines",
        "wake",
        "到期工作先落地，再認領",
        "create_routine：cron／timezone／instruction",
        "due sweep → occurrence work item → claim／lease → worker → 下一次 occurrence。",
        "lease heartbeat 只續租執行權，不是喚醒模型。",
        "https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/routines/sweep.ts#L135"
      ],
      [
        "Handoff＋result relay",
        "continue",
        "委派出去，結果回來再接上",
        "message_bot",
        "typed task＋權限 → durable hop → recipient turn → answer relay → follow-up；answerIn 擋 relay 遞迴。",
        "交辦與完成事件，不是 recipient 自行產生 root task。",
        "https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/agents/handoff-runner.ts#L391"
      ]
    ]
  }
};
