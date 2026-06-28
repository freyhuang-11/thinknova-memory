---
name: project-thinknova-offline-agents
description: ThinkNova 平台「实体店内容生成/短视频生成」两个 Agent 的问题整理与交付 Codex 工作
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

ThinkNova（https://www.thinknova.top/，工作台 /zh/app）是技术用 Codex 开发的轻量 AI 创作平台。用户聚焦其中两个 Agent：**实体店内容生成 Agent（海报，agentCode=offline_store_content，路由 /zh/app/business-assets）** 和 **实体店短视频生成 Agent（agentCode=offline_store_video，路由 /zh/app/business-video-assets）**。流程：选场景(S01-S12) → 选行业 → 填商品信息 → 生成海报或10秒短视频。目标用户是纯小白门店老板。

**固定工作目录（铁律）**：本项目所有文件读写一律放在 `D:\SamsoData\Documents\视频制作平台分析\`（子目录 00_规格与参考/01_问题诊断/02_交付内容/03_设计稿/对外推介），临时 html/png 也归到子目录；**绝不**写 D:\ 根目录（会 EPERM）。该目录根有 CLAUDE.md 同此约定，但 CWD=D:\ 时未必自动加载，故记于此。

**我的角色**：整理用户发现的问题、优化措辞、对照规格文档判断合理性，产出可直接交给 Codex 的文件。**关键约束**：不可直接改系统配置/代码；要改必须先提议 old→new 经用户同意，且严禁改错参数 key。详见 [[feedback-thinknova-config-edit-rule]]。

**配置文件**（技术给的，内容是 JSON）：海报/视频各一份「编排配置.md」，外加独立 `offline-store-agent.prompt-composer-v2.json`。视频配置分 `opsEditable`（运营改这层）和 `promptComposer`（运行时结构，不建议直接改）；高频规则优先改 `docs/offline-store-video-ops.override.json`。

**已定决策**：① 默认模型=Grok（用户不选时后端默认走 grok i2v，prompt 不露技术词）；② 海报+短视频默认比例都改 9:16。

**产出文件**（在 D:\SamsoData\Documents\视频制作平台分析\）：`ThinkNova_问题清单_给Codex_v2.md`（诊断）、`ThinkNova_交付Codex_修改包_v1.md`（可落地改动+实测结论）。规格依据是同目录 4 份《实体店…》提示词规格 md + stitch_exports 设计稿。

**已实测确认的核心 Bug**：海报「开始生成」按钮置灰无法点击（伴 Nuxt 水合不匹配 `Hydration mismatch` + /zh/app/* 深链刷新 500）；参考案例不随场景联动（只按行业、写死7条、无 sceneId）；案例 visualHint 写死了产品名和价格会污染下一步；30秒长视频生不出+计费不符；上传图未接成 i2v 首帧导致人像不一致。

**真实默认模型**：图片=gpt-image-2，视频=grok-imagine-1.0-video(图生视频i2v)。提示词应英文结构化(模型遵循度高)、中文只留叠字/字幕。

**已定决策**：场景下线S10教程避坑、新增S13团购套餐/到店核销、S07前后对比改行业限定；定价三档 $29.8/$99.8/$198（视频¥1/条grok成本、有抽卡、按生成次数计，基础约60视频+100海报）；设计(Stitch账户中心)+两agent"拿出来"暂缓，等功能/提示词更新好再做。

**本轮已产出（D:\SamsoData\Documents\视频制作平台分析\）**：批次1审计+场景定稿、批次2A按行业选项卖点、批次2B案例库(12行业×9高频场景×2条)、批次3A场景层提示词(按真实模型+三段脚本)、批次3B社媒12平台、批次3CD语言西越+真人本人+行为指令、批次4工程总清单(防漏改)、定价方案、验收报告。下一步：等用户验收 → 交技术Codex落地 → 我用账号端到端回测。
