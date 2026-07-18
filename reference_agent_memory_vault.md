---
name: reference-agent-memory-vault
description: 共享记忆库 AgentMemoryVault(Obsidian):位置/分工/每次会话末必须更新平台状态总览
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

老板 2026-07-16 引入 [agent-memory-vault](https://github.com/cindyxu1030/agent-memory-vault),已装到 `D:\SamsoData\Documents\AgentMemoryVault\`,用途=老板可见的项目状态 + Claude/Codex 跨 agent 共享记忆。**跨机同步=私有仓库 github.com/freyhuang-11/agent-memory-vault:我每次开工先 `git pull`、收工把状态更新连带 `git push`**(Codex 机同规则)。老板桌面有「平台进度总览」快捷方式(开 Obsidian 直达总览页)。

**2026-07-18 体系定型(全部实证跑通):**
- **Codex 已 SSH 接入另一台电脑并完整闭环**:读信箱→执行→移已处理→写状态→反向留题;我已答复(organic 提档口径+付费买量四条硬验收,在信箱)。
- **双营销线命名法**:「海外营销」=FB/Reddit/LinkedIn(Codex 主理);「国内营销」=小红书/抖音/视频号/快手(本机营销会话主理)。所有营销文档/状态/信箱条目强制前缀,素材库共用。claude.ai 网页 "THINK NOVA marketing" 聊天=海外线入口之一。
- **信箱.md 三收件栏**:给 Codex(海外)/给国内营销会话/给 Claude(Code);处理完移「已处理」写结果。国内营销会话已确认遵守并实证执行。
- **《_memory/平台操作手册_Claude技法.md》**=全会话统一平台实操技法(419-UI/定价JSON/直连生图/OSS直传/任务查证/红线),新技法沉淀回手册。
- **「新加坡会议」线(07-18 并入体系)**:线下工作坊物料/合伙人 Vicky 渠道会话,产出文档强制「新加坡会议_」前缀;收工写总览、要 Claude Code 做的事写信箱「给 Claude」栏;首个归档包已入库 `_memory/新加坡会议_归档包_2026-07-15.md`。
- **平台状态=只写 vault 总览,私有记忆不再复制状态**(防堆叠矛盾层);技术问题清单也在总览第四节。
- 老板侧:Obsidian 已装并打开 vault,桌面「平台进度总览」快捷方式;旧窗口脱节时丢"同步刷新"口令即可。

**How to apply:**
- **每次工作会话结束更新 `01-Projects/ThinkNova/_memory/平台状态总览.md`**(平台进度唯一真值,老板靠它看进度——他曾抱怨"不知道平台被优化到什么进度",这是解法)。
- 读写规则见 vault 根 AGENTS.md:00-Rules 人类专属绝不直写(提案走 04-Feedback/graduation-queue.md);_memory 可直写;_feedback 记被否决的教训;多 agent 改前重读防冲突。
- 分工:vault=状态/决策/给 Codex 的共享资料;我的 auto-memory=操作细节(419 保存法、OSS 上传、密钥用法)不进 vault。状态类内容单一真值只写 vault,别两处堆叠(记忆铁律 7)。
- 给 Codex 的交付文档可直接放 vault 项目夹,Codex 读 AGENTS.md 同一套规则。
