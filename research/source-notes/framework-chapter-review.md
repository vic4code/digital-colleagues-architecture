# 第二章：以框架機制為單位重整 · 2026-09-14

## 改判

原章節以 Polling、Heartbeat、Cron、Event、Loop 作主導覽，只解釋使用者列出的例子，未把既有研究的主要機制呈現出來。本版先列每家框架的機制，再歸納喚醒、選題、續行、學習／整理四個問題。分類是分析工具，不是框架對外宣稱的四種功能。

## 查核與界線

重讀 [機制盤點](mechanism-inventory.md)、[OpenClaw 原碼審查](openclaw.md)、[Hermes 原碼審查](hermes.md)、[觸發與續行](proactive-trigger-mechanisms.md)。重新取回 16 個原碼／文件連結，逐段核對 OpenClaw pacing 成功條件、Hermes digest backoff、Codex idle goal 的鎖與派送、Voyager skill 儲存與檢索。來源可取回不等於每個機制已實跑；本輪沒有執行任何上游 agent 工作。

Claude Code 補查官方 [goal](https://code.claude.com/docs/en/goal)、[Stop hook](https://code.claude.com/docs/en/hooks#stop)、[Channels](https://code.claude.com/docs/en/channels) 文件；文件是 2026-09-14 查核，其他來源各自標固定 commit，不能統稱最新版本。

Grok Build 保留原研究與公開介面空缺；不以 Grok Bot 非官方重建冒充。OpenClaw 的 Durable goal 持久化與自動續跑分開判讀；歷史 inferred commitments 退役亦不被 heartbeat 替代。Kanban readiness 是從現有工作選擇可執行項，與 Voyager 產生新探索任務不同。

## 頁面驗證

7 個框架逐一切換，檢查機制與來源展開；320／768／1440 寬度無水平溢位。直接開 file URL 可用，術語對照仍可展開，Chrome 零 page errors。視覺沿用 Cream 配色、相同線條與留白，主要介面只保留機制名稱與一句行為。
