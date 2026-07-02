---
name: feedback-thinknova-config-edit-rule
description: 改 ThinkNova Agent 配置/提示词的规矩——已授权直接改线上 admin 配置，但别改错 key
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

在 ThinkNova 项目（见 [[project-thinknova-offline-agents]]）改 Agent 配置/提示词：

**现状（2026-06-29 起）**：用户**已授权我直接改线上 admin 配置**（`admin.thinknova.top/#/ai/agents`→编辑→配置 JSON→保存）。不再需要每次先提议经同意。

**Why**：线上系统配置，改错 key 直接影响生成；技术（Codex）也在同步开发，schema 会变。

**How to apply**：
1. 直接改可以，但**改前想清楚确切 key 路径，严禁改错/写坏 JSON**（保存前确保能 JSON.parse）。
2. 大改动（改提示词组装这种影响面广的）最好先跟用户对一下 old→new 再动。
3. 改完**自己实测复现验证**，别把没验的当成功汇报。
4. 我产出的分析/交付 md 可自由编辑。
5. ⚠️ schema/架构会变（如已迁到 v2、案例库拆 external_table、提示词入口在 v2 后可能搬走）——改前先确认当前结构，别照旧记忆乱改。
