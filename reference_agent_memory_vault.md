---
name: reference-agent-memory-vault
description: 共享记忆库 AgentMemoryVault(Obsidian):位置/分工/每次会话末必须更新平台状态总览
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

老板 2026-07-16 引入 [agent-memory-vault](https://github.com/cindyxu1030/agent-memory-vault),已装到 `D:\SamsoData\Documents\AgentMemoryVault\`,用途=老板可见的项目状态 + Claude/Codex 跨 agent 共享记忆。

**How to apply:**
- **每次工作会话结束更新 `01-Projects/ThinkNova/_memory/平台状态总览.md`**(平台进度唯一真值,老板靠它看进度——他曾抱怨"不知道平台被优化到什么进度",这是解法)。
- 读写规则见 vault 根 AGENTS.md:00-Rules 人类专属绝不直写(提案走 04-Feedback/graduation-queue.md);_memory 可直写;_feedback 记被否决的教训;多 agent 改前重读防冲突。
- 分工:vault=状态/决策/给 Codex 的共享资料;我的 auto-memory=操作细节(419 保存法、OSS 上传、密钥用法)不进 vault。状态类内容单一真值只写 vault,别两处堆叠(记忆铁律 7)。
- 给 Codex 的交付文档可直接放 vault 项目夹,Codex 读 AGENTS.md 同一套规则。
