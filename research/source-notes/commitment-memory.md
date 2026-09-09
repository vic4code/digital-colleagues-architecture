# OpenClaw commitment recall: positive callable path and limits

Pinned source: 91ea838947d30a65f1299b05fa42071917f2a293. URL prefix https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/

## Actual callable memory path
1. extensions/memory-core/index.ts L267-L273 registers memory_search and memory_get through tool factories.
2. extensions/memory-core/src/memory-tool-contract.ts L88-L101 gives actual tool contracts; L108-L130 builds prompt instruction: before answering prior-work/decisions/dates/people/preferences/todos questions, run search, then get only needed lines. This is prompt-directed tool use, not an automatic extraction scheduler.
3. extensions/memory-core/src/tools.ts L233-L266 parses query and corpus, checks explicit session corpus availability; L556-L590 parses file/path/range and calls readAgentMemoryFile for exact excerpt retrieval.
4. extensions/memory-core/src/memory-search-tool-query.ts L85-L118 selects search sources and calls active.manager.search(query.text,{maxResults,minScore,sessionKey,...}); remaining function applies visibility rules. This proves retrieval execution rather than merely advice to remember.

Model can retrieve a remembered promise if the underlying memory/session source contains it and permitted search finds it. A proactive prompt can request such recall. Retrieval does not itself turn a promise into an authoritative commitment record or verify it remains open.

## Session corpus defaults — distinguish indexing from ordinary search
- src/agents/memory-search.ts L136-L158 DEFAULT_SOURCES = [memory].
- L179-L197 separates sources (indexed) and searchSources (ordinary model ranking). Configured experimental.sessionMemory defaults false, but rememberAcrossConversations can enable indexed sessions separately.
- packages/memory-host-sdk/src/host/config-utils.ts L100-L120 makes rememberAcrossConversations default conditional on private-shaped deployment; do NOT claim session indexing is universally off by default.
- tools.ts L253-L266: corpus=sessions from ordinary model denied unless configured searchSources includes sessions or trusted conversationRecall context exists. Error requests enabling experimental.sessionMemory plus sessions source.
- memory-tool-contract.ts L49-L63 defines memory source files MEMORY.md, USER.md, recursive memory/, optional extra paths; indexed session transcripts added to description when configured.

## Existing explicit persisted reminders: Standing Intent
Do not overstate absence. extensions/memory-core/src/standing-intents-tool.ts L147-L172 exposes intent(create,list,cancel), description, triggerKeywords, scope. Tool description explicitly reserves time-based reminders for scheduled tasks.
extensions/memory-core/index.ts L283-L311 only processes eligible user-trigger turns, calls matchStandingIntents with prompt/provider/channel/account/sender, and prepends matching reminder context. L320-L334 heartbeat/cron hook runs sweepStandingIntents maintenance; this is not a proactive commitment-search loop.

This supports explicit requests like whenever I mention the renewal, remind me to ask Alice. It is not proof that every statement I will send the report Friday is automatically extracted, assigned an owner/due date, tracked through completion and chased later.

## Suggested report boundary
Implemented: prompt-guided recall via callable memory_search/get; optional/controlled transcript corpus; explicit keyword-based standing intents; separate automation schedules.
Our integration proposal: store commitments as business records (source message, responsible person, due date, status, last follow-up, delivery state), query due/open records during proactive work, then retrieve memory for evidence/context. This proposal adds deterministic tracking; do not label it an existing automatic OpenClaw extractor.

Concise phrasing:
EN: Recall can recover what was said. A commitment tracker must also know whether it is still open, who owns it, and when to follow up.
ZH: Memory 能找回說過什麼；承諾追蹤還要知道誰負責、是否已完成、什麼時候該再問。
