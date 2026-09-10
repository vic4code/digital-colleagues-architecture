# Loop and graph implementation audit — 2026-09-09

Loop & graph: where do they appear?
Loop 與 graph：它們實際出現在哪裡？
A loop repeats work and decides whether to continue. A graph describes dependencies and possible next steps; it can contain loops. Neither supplies environmental observations by itself.
Loop 決定是否再做一輪；graph 描述工作之間的依賴與下一步，也可以包含迴圈。要知道外界發生什麼，仍要接資料來源或監聽程式。
Terminology follows
LangChain’s Graph Engineering discussion
. These are design concepts, not universal capability phases or native feature names for every framework.
Framework
Loop implementation / 反覆工作
Graph-like orchestration / 流程依賴
OpenClaw
Heartbeat / Automations revisit assigned checks. next_check lets an eligible run propose its next check time, which the runtime bounds.
Task Flow persists multi-step state; a controller advances it. Optional Lobster executes deterministic pipelines with approval/resume. Saving wait state does not register a timer or event listener.
Hermes
/loop repeats session work; /goal decides whether an assigned objective needs continuation. Self-paced /loop compares response digests and backs off; it is not an information-gain calculation.
Kanban stores parent-child task links. recompute_ready requires all parents done/archived before promotion; dispatcher then claims eligible work.
Codex
/goal: idle hook → active-goal checks → start_turn_if_idle. App schedules provide a separate return-to-work mechanism.
External orchestration can call exec / App Server. A native general-purpose graph planner is not established by the code inspected here.
Claude Code
/loop / CronCreate; Monitor for supported script-based monitoring.
Hooks constrain lifecycle transitions. These paths do not establish a native general-purpose graph planner.
Example: your colleague checks the inbox again later (loop). If an invoice arrives, they extract the details, wait for a reviewer and only then continue processing (workflow). A schedule or incoming-mail adapter starts the work.
白話例子：同事過一陣子再查看信箱，是 loop。發現發票後，先整理資料、等審核人回覆、再往下處理，是有順序與等待條件的流程。至於何時開始，仍靠排程或收信事件。
OpenClaw Task Flow
 ·
Task Flow documented contract
 ·
Optional Lobster implementation
 ·
Hermes dependency readiness

- [OpenClaw Task Flow](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/plugins/runtime/runtime-taskflow.ts#L157-L184)
- [Task Flow documented contract](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/automation/taskflow.md#L22-L73)
- [Optional Lobster implementation](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/extensions/lobster/src/lobster-tool.ts#L14-L24)
- [Hermes dependency readiness](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/kanban_db.py#L2002-L2062)

Task Flow is orchestration state, not a scheduler. Lobster is optional. Hermes Kanban readiness is dependency scheduling, not proof of autonomous graph topology discovery. No claim of adopting LangGraph follows from a graph-shaped flow.
