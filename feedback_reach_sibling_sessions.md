---
name: feedback-reach-sibling-sessions
description: 营销线/邮件线/评论线等兄弟会话一直都在——用 ccd_session_mgmt list_sessions + send_message 找并派活，⛔ 别用 ListAgents 判「不在线」
metadata:
  type: feedback
---
兄弟会话（「THINK NOVA marketing」「邮件线」「评论线」，侧栏置顶）是桌面 app 的独立 CCD 会话，平时 isRunning=false 也照样能收消息：`mcp__ccd_session_mgmt__list_sessions` 找 sessionId → `send_message` 投递（会当场开一轮）。ListAgents 只列本会话的子 agent，看不到它们。

**Why:** 2026-09-29 老板：「marketing 这条线一直在的啊，你为什么每次都说他们不在线的，在不在线他们都在你的控制范围内」——我连续几次用 ListAgents 查不到就写「不在线、写交接档」，活没真正派到。

**How to apply:** 要给营销/邮件/评论线派活或同步：先 list_sessions 按标题找 → send_message 直接派，要求它做完回一句；交接档/vault 信箱只做留档，不能代替投递。相关：[[reference-agent-memory-vault]]
