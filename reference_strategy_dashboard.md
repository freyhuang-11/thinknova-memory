---
name: reference-strategy-dashboard
description: 战略台（老板每天监控的总览页）在哪、怎么更新；任务唯一总表在哪
metadata:
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-10-04T14:08:18.460Z
---

老板 2026-10-04 令：「把你每天做的事都排一下战略台让我每天监控」「所有任务整理一下不要遗漏」。

- **战略台** = Artifact 页面 https://claude.ai/artifact/KYoLbRRk4VJSp7uahJXwYG （私有，老板自己看）。
  - 源文件：`03_工作台/战略台/data.json`（内容）+ `build.py`（生成）→ `战略台.html`。
  - 更新：改 data.json（更新时间先跑 date）→ `python build.py` → Artifact publish 同一个 `战略台.html` 路径。换路径会变新链接；新会话/压缩后先 Artifact read 该链接再发布。
  - 频率：每天 10:07 / 16:07 / 00:07 三拍必更新，大变化随时更新。
  - 内容块：数字条、要老板定的事、8 个角色（总指挥/营销线/邮件线/评论线/广告 Codex/海外媒体 Codex/技术 dot/自动脚本）、广告线、我的 24 小时节奏、等技术回信、日历、今日完成。
- **任务唯一总表** = `03_工作台/任务总表_总指挥.md`，每拍读、当拍改；战略台内容从它来。
- 相关：[[feedback-heartbeat-not-cron]]（心跳 24 小时）、[[feedback-reach-sibling-sessions]]。
- 旧看板（都已停更，⛔ 别再更新，老板问「战略台/作战台」一律指上面这个新的）：倒计时作战台 Y74PayUH1pMVmyoRo5cdiM（09-24 停）、作战看板 LQPcRe7RsbT3wc3EV7rEgn（09-18 停）、营销作战台 Bmtpv9oAhrSNURbf2bf3kj（09-19 停）。10-05 发现时未向老板确认他说的「战略台」是不是想续用旧的「倒计时作战台」——下次他提到时问一句。
