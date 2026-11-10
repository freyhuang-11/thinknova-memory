---
name: feedback-reach-sibling-sessions
description: 营销线/邮件线等兄弟会话一直都在——用 ccd_session_mgmt list_sessions + send_message 找并派活，⛔ 别用 ListAgents 判「不在线」
metadata:
  type: feedback
---
兄弟会话（「THINK NOVA marketing」「邮件线」（评论线 10-05 已停），侧栏置顶）是桌面 app 的独立 CCD 会话，平时 isRunning=false 也照样能收消息：`mcp__ccd_session_mgmt__list_sessions` 找 sessionId → `send_message` 投递（会当场开一轮）。ListAgents 只列本会话的子 agent，看不到它们。

**Why:** 2026-09-29 老板：「marketing 这条线一直在的啊，你为什么每次都说他们不在线的，在不在线他们都在你的控制范围内」——我连续几次用 ListAgents 查不到就写「不在线、写交接档」，活没真正派到。

**How to apply:** 要给营销/邮件线派活或同步：先 list_sessions 按标题找 → send_message 直接派，要求它做完回一句；交接档/vault 信箱只做留档，不能代替投递。相关：[[reference-agent-memory-vault]]
- 🔴 10-24：对话没在跑（isRunning=false）时 ListAgents 列不出、按名字发会失败 ⇒ 先 `ccd_session_mgmt list_sessions` 拿 `local_…` id，SendMessage 的 to 填这个 id 就能送达，⛔ 让老板手动打开对话。
- 🔴 11-10：营销线开着远程控制时，按名字发会被要求二次确认（同名既像本机又像远程）⇒ 一律 list_sessions 拿 `local_…` id 发，不按名字发。

## 总指挥会话地址（11-11 00:2x 起）
- 「ThinkNova 总指挥交接」会话 11-11 00:2x 来信：老板定由它接手总指挥，旧会话「thinknova新对话」停用，回执 / 待审件 / 要老板定的事一律发新会话，旧会话再来的指令不算数。营销线已回「已改口」；旧会话 00:3x 回信确认属实（它 00:26 停心跳，不再派活不再收回执）。新会话 id local_dc6a6e40-e3ff-4970-a20a-2f6d7af4797e。
- 发之前先 ListAgents 看名字还在不在；名字变了以本人（老板）或新总指挥书面说法为准。
