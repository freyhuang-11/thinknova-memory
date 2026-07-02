---
name: feedback_repo_rhythm
description: Compass 仓库使用节奏——私密仓库以Claude为中心/记忆常新/最差一天一提交
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f77ccc33-3abf-4e50-8c37-80ff31be3331
---

**用户 2026-07-02 定的长期规矩**（针对 `D:\SamsoData\Documents\Kol compass`，GitHub 私密仓库 `freyhuang-11/KOL-compass`）：

- **私密仓库，不对外放任何信息**；现在这个仓库**以 Claude 为中心**使用（不再主要围着 Codex）。
- **记忆持续保持最新**：过时内容**自动覆盖更新**（呼应 [[feedback_memory_keep_current]]），时刻清楚**当前待办 + 下一步计划**。
- **最差情况：只要有变化，一天至少提交一次 GitHub + 更新一次记忆。** 实操：每轮验收/收工时就 commit（有变化就推），至少日频。

**Why:** 用户要仓库和记忆始终是最新真相源，别积压一堆未提交/过时状态。

**How to apply:**
- 干完一轮有实质改动 → 整理成干净 commit 推送（当前分支 `codex/kol-compass-mvp`）；至少一天一次。
- **密钥/敏感文件绝不提交**：`.env*`、`*.bak`、`.data/`(含店铺 token/达人库)等先 gitignore。私密仓库也不放明文密钥（[[reference_compass_paths]]）。
- 每轮同步更新 [[MEMORY]] 索引、验收台账 `docs/CLAUDE_ACCEPTANCE.md`、`docs/BACKLOG.md`。
- Codex 也可能碰这仓库 → push 前留意分支冲突。
