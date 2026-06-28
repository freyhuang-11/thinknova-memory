---
name: feedback-thinknova-config-edit-rule
description: 改 ThinkNova Agent 配置/提示词的规矩——先提议经同意，不可直接改
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

在 ThinkNova 项目（见 [[project-thinknova-offline-agents]]）改任何系统配置、prompt、md/json 编排文件前：

**Why**：这些是线上系统配置，改错参数 key 会直接影响生成效果；技术（Codex）也在同步开发。

**How to apply**：
1. 不要直接编辑系统配置文件。要改，先给出"确切 key 路径 + old→new"提议，用户同意后才动。
2. 改时核对 key 名，严禁改错参数。
3. 优先在 `opsEditable` / `*-ops.override.json` 层改，不直接动 `promptComposer` 运行时结构。
4. 我自己产出的分析/交付 md 文件（问题清单、修改包）可自由编辑，不受此限。
5. 用户授权可用其账号在站点实测生成能力来复现/定位问题。
