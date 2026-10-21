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

- 10-14 补：防压缩丢记忆——压缩或重启后第一件事读 `03_工作台/日报/总指挥_当前状态_滚动.md`；每天 10:07/16:07/00:07 整份覆盖刷新（老板 10-14 21:5x 令）。规程「一a」节。

- 10-20 补（营销线）：会话内定时只在本会话在跑且空闲时响；电脑重启 / Claude 应用重启（10-20 04:35 疑似自动更新）后会话没人打开就整段断档，恢复后不补。老板 10-20 问「心跳为什么一直掉」，给了 A 维持会话内定时 / B 加应用级定时任务，**老板选 A**——会话一恢复第一件事 CronList，没有就按原句重建；查断档用 Windows 事件（6005/6006 开关机、506/507 待机）+ claude 进程 StartTime。

（10-20 从索引下沉）心跳整点 cron `7 * * * *` 全天 24 小时（10-04 老板定：夜间做系统优化、不扰客户、不叫老板）；app 重启或压缩后先 CronList，没有就按原句重建；Windows 定时任务跑固定脚本可以。

- 10-21 起营销线心跳是 3 条：每小时 :23、夜间 1–4 点 :07、**每周一 10:17 Drive 海外同步清理**（流程见 [[reference-drive-sync-overseas]]）。会话 cron 7 天过期，每次 CronList 少哪条就重建哪条。
- 10-21 22:2x 老板说后台只看到每周那条：CronList 实际 3 条都在，但小时 / 夜间两条是 10-20 建的、快到 7 天过期，已删旧重建（642d3bf8 每小时 :23、e0f1f45c 夜间 1–4 点 :07、eb0bde2c 周一 10:17）。新版小时心跳第 6 条：每拍顺手 CronList，少了就重建，建满 6 天主动重建。
