---
name: feedback-tech-doc-delta-delivery
description: "给技术的文档一经发出就冻结,后续变化只出增量文件,不回改原文档"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

给技术(或任何外部协作方)的交付文档,**发出去之后就冻结,不再原地更新**。

**Why:** 2026-07-03 我在已交付的《给技术_本轮优化汇总》上继续追加/改数字,用户指出:文档已经给过去了,再改原文档,重发时对方分不清哪些是新的、哪些已经看过,会造成重复和版本混乱。

**How to apply:**
- 已发出的交付文档 = 冻结快照;新内容单独出《给技术_增量更新_日期》文件,开头注明"之前那份无变化/只看这份"。
- 内部台账(如 待办与技术清单)可以持续原地更新,那是自己的总账,不外发。
- 关联 [[feedback-handoff-acceptance]] [[project-thinknova-offline-agents]]
