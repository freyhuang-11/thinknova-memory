---
name: feedback-memory-keep-current
description: 记忆维护规矩——只保留当前真实状态，过时内容直接覆盖删除，不堆叠矛盾层
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

每次更新记忆时**只保留最新真实状态**，把过时/已被推翻的内容**直接覆盖删除**，不要在文件里一层层叠加历史结论（尤其不要保留"我先以为 A，后来发现 B，又改成 C"这种演进叙事）。

**Why**：旧结论和新结论并存会让我记忆混乱、读到自相矛盾的事实、可能照着过时信息行动。

**How to apply**：① 改记忆=重写该事实为现状，删掉旧版，而不是 append；② 一个文件里发现互相矛盾的两段，删旧留新；③ 定期对长文件做整理（旧的"最新状态 2026-xx"叠了好几层就合并成一段当前状态）。用户 2026-06-29 明确要求，切记。相关项目 [[project-thinknova-offline-agents]]。
