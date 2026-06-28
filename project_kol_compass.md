---
name: project-kol-compass
description: 用户正在开发的对外 SaaS，最终会接管所有业务。Codex 是主开发，我是顾问 / 用户合伙人
metadata: 
  node_type: memory
  type: project
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

**路径**：`D:\SamsoData\Documents\Kol compass`（**禁止占用 5173/5174**）

**定位**：对外 TikTok Shop 达人建联 SaaS。客户类型 = **服务商**（BD 公司服务多个商家，每商家多店铺），不是单一商家自营。

**技术栈**：
- 后端：Node.js 原生 http + JSON 文件存储（`.data/*.json`），端口 **8015**
- 前端：原生 HTML/CSS/JS（`app.js` 单文件 ~180KB），端口 **5175**
- 数据：localStorage + JSON 文件（**不够，要切 SQLite**）
- Git：`https://github.com/freyhuang-11/KOL-compass.git`，分支 `codex/kol-compass-mvp`
- 启动：`start-full.bat`
- 冒烟测试：`node smoke-test.js`

**当前真实数据**：
- TikTok Shop sandbox OAuth 已通，授权了 `SANDBOX_VN7651055422359521044`（VN 市场）
- 平台库 = 60 个 VN 真实达人（剩下 SG/MY/TH/PH 都没授权店铺）
- 已接入的 API：商品搜索、商品详情、类目、达人搜索

**业务流程**（客户视角）：
1. 绑定 TikTok Shop 店铺（OAuth）→ ✓ 跑通
2. 同步商品 → ✓ 跑通
3. 进入达人库筛选 → 🚧 在做
4. 发起建联（TikTok 私信 + Email）→ 🚧 在做（**用户当前优先级**）
5. 沟通 / 自动回复 → ❌ 没真实接
6. 寄样 → 只有 UI
7. 合作管理 → 只有 UI（内容追踪 / ROI 没真接 API）

**Codex 当前任务原则（用户给 Codex 的）**：
- 禁触 D:\tiktok-creator-tool（用户已松绑成「允许读 snapshot，写仍禁」）
- 不假装 API 同步成功（未授权要明示）
- 客户侧不能编辑 contact、不能 CSV 导入达人

**沟通现状**：
- Codex 在 UI / 信息架构上完成度比预期好（13 页都搭好了）
- 但功能层面**很多页只是 UI 没接真实业务**（自动回复 / 寄样 / 内容追踪）
- Codex 不懂运营 edge case，需要用户 + 我反复纠正

**How to apply**：
- 跟用户聊 Compass 时**先讨论再操作**，不要主动改代码
- 任何「跟我们老系统不一样」的特性都要单独问一次，因为 Compass 是 SaaS 多租户，规则不同
- 给 Codex 的提示词要分步、自包含、按客户主流程顺序（绑店铺 → 筛达人 → 建联 → ...）

**相关**：[[project_compass_migration]]、[[reference_compass_paths]]、[[reference_tiktok_partner_api]]
