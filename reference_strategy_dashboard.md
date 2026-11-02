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

## Frey 待办板（2026-10-08 建）
- 链接：https://claude.ai/artifact/Hk7kr956ogiogUbNBuxtFK（db 集合 `items`，字段 t/p(tn|fde|oth)/due/done/note/src(cmd|boss)/ca/ua）。
- 分工（老板 10-08 定）：FDE/其他两栏老板自己记；我只用 ArtifactData 同步 ThinkNova 条目（doc_id 前缀 tn_）并在日报里提醒到期项。源文件 03_工作台/老板待办板/老板待办板.html。

## 对外 PPT 资料包（2026-10-09）
- GitHub freyhuang-11/website 分支 claude/pensive-galileo-7q3c2s，目录 ppt_input/thinknova/（info.md、README、screenshots、samples）。公开仓库：推前扫供应商名/任务号/本地路径/隐私；只推英文主图（电脑 3–5 + 手机 1–2）。

## 老板工作台（10-31 起，替代给老板甩清单）
- https://claude.ai/artifact/J9Gj6gFfKYeVynjAPLhwgR ：要老板确认的事一条一卡，老板点选项=打勾；数据在页面 db `items`（decision/note/decidedAt）。心跳每拍先 ArtifactData list 读、照办、在 note 追加「总指挥已办」；新待定事项写成新 item，⛔ 改老板选的 decision。老板 10-31：「给我个工作台，我一个一个打勾确认」。


## 11-02 起：老板待办唯一真值 = Google 表（Muse 共管）
- Drive「Frey 待办（总指挥 × Muse 共用）」fileId `1DqUQ5tMExMzm6mQviynTncKM_j6G1gfVVy4moAdvxjg`；待办板 artifact 和工作台只是镜像。
- 规则全文在 `03_工作台/待办同步/同步规则_总指挥与Muse.md`：只加不删、Muse 编号 mu_、每改填修改人+时间、晚的算数。
- **Why:** 老板 11-02 要 Muse 也能管待办，自选 Google 表。**How to apply:** 每拍先读表再镜像；写表前先读最新版，⛔ 整表覆盖掉老板/Muse 的改动。
