---
name: reference-agent-memory-vault
description: "触发:每次开工第一件事和收工最后一件事 → 开工 pull + 读信箱,收工只 add 自己的文件(⛔禁 git add -A,库是多会话并发写的)、push 并验证远端真收到;平台状态只写 vault 总览,私有记忆不复制状态"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-09-03T17:23:27.976Z
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

🔴🔴 **2026-08-08 血的教训:`git push` 敲完 ≠ 远端收到,收工必须验证。**
- 08-06 的信箱例程把文档全写好了,**但从没提交**,在本地工作区躺了 2 天;08-08 开工 `git pull` 报"本地改动会被覆盖"才发现。**后果是实的**:那条写给 Codex 的指令他根本 pull 不到 → 他"没照做"其实是没收到,差点又误判成执行不力(和 08-05 冤枉 Codex 同一个坑,只是这次源头在我)。
- **收工三连(缺一不可)**:`git add -A && git commit && git push` → `git status --short` 空 → `git rev-list --left-right --count HEAD...origin/master` 得 `0 0`。**没验证过就不算收工。**
- **开工遇到 pull 被本地改动挡住:先 `git diff` 看清楚再决定,一律"先 commit 再 merge",绝不 `checkout --`/`reset --hard` 丢弃**——那可能是上一次例程或另一个会话没提交的真产物。
- **推论(判断别人时用)**:"库里没他的文件"有三种可能——没跑 / 跑了推不上来 / **我自己的指令压根没送到**。第三种最容易被忽略,下 judgment 前先确认自己那条推上去了没。呼应铁律 2.9 [[feedback_silence_is_not_evidence]]。

🔴🔴 **2026-09-04 总指挥当场纠正:vault 是多会话并发写的库,`git add -A` 会把别人写到一半的文件替他定版。**
- 那晚 22:00 冷邮件例程收工时我 `git add -A`,把总指挥当时正在编辑的 `信箱.md` 和 `_memory/平台状态总览.md` 一并提交了。内容没丢(远端核过完整),**但如果他当时写到一半,那半版就被我定死了**。
- **收工只 add 自己这条线的文件,逐个路径写清楚**,绝不 `-A`、绝不 `.`。总指挥同侧执行同一规则(他明说"你那三份日报和线索台账我一个字没碰,留给你自己推")。
- 与上面 08-08 的教训不冲突:**要验证的是"我自己那几个文件推上去了没"**,不是"工作区干净了没"。别人的未提交改动留在工作区是正常状态,不是待清理的脏东西。

**How to apply:**
- **每次工作会话结束更新 `01-Projects/ThinkNova/_memory/平台状态总览.md`**(平台进度唯一真值,老板靠它看进度——他曾抱怨"不知道平台被优化到什么进度",这是解法)。
- 读写规则见 vault 根 AGENTS.md:00-Rules 人类专属绝不直写(提案走 04-Feedback/graduation-queue.md);_memory 可直写;_feedback 记被否决的教训;多 agent 改前重读防冲突。
- 分工:vault=状态/决策/给 Codex 的共享资料;我的 auto-memory=操作细节(419 保存法、OSS 上传、密钥用法)不进 vault。状态类内容单一真值只写 vault,别两处堆叠(记忆铁律 7)。
- 给 Codex 的交付文档可直接放 vault 项目夹,Codex 读 AGENTS.md 同一套规则。
