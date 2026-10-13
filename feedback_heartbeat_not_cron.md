---
name: feedback-heartbeat-not-cron
description: "触发:想装定时任务/闹钟/心跳频率 → 现行=总指挥整点 cron 24 小时（10-04 老板定）；各线不装 Claude 定时任务"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-27T08:15:42.582Z
---

# 心跳（2026-10-14 体检后重写，旧版移 archive/retired_20261014/）

- 现行唯一规程：`视频制作平台分析/03_工作台/日报/心跳规程_总指挥.md` v3（cron 表达式、现行 id、重建规矩、每拍清单都只写在那里，本条不再重复）。
- 老板定：每小时一拍，24 小时开（10-04 起），只有老板能改；⛔ 用 ScheduleWakeup 代替 cron。
- 会话重启、压缩上下文后第一件事 CronList，没有就按原句重建；7 天自动过期前主动重建。
- Windows 定时任务跑固定脚本可以（现行：PublishQueue、YouTubeQueue、DailyPulse、EmailConsole；FollowupSend、DailySend 已停）；新建要先报总指挥登记。

**Why:** 老板要总指挥不间断看各线和技术（10-04）；cron 比 ScheduleWakeup 稳（09-29 心跳断过一次）。
**How to apply:** 见规程 v3 第一节。相关 [[reference-commander-knowledge-base]]。
