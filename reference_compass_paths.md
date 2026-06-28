---
name: reference-compass-paths
description: Compass 项目位置、端口、git、启动命令、关键文件
metadata: 
  node_type: memory
  type: reference
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

**根目录**：`D:\SamsoData\Documents\Kol compass`

**关键文件**：
- `server.js`（973 行，Node 原生 http 后端，跑 8015）
- `app.js`（3813 行，单文件前端 SPA）
- `app.css` / `index.html`
- `smoke-test.js`（必须每次改完跑）
- `.env.local`（TikTok App key/secret，不进 git）
- `.data/*.json`（持久化数据，git ignore）

**重要文档**：
- `DESIGN.md` — 视觉设计规范
- `PRODUCT.md` — 产品定位 + 边界
- `README.md` — 启动 + CSV 字段
- `docs/PROJECT_MEMORY.md` — Codex 自己的项目记忆（每阶段更新）
- `docs/CLAUDE_CONTINUE.md` — 给 Codex 的继续指令
- `docs/TIKTOK_API_HANDOFF.md` — TikTok API 接入交接
- `docs/archive/*.full.md` — 历史归档（详细一些）

**端口**：
- 前端：**5175**
- 后端：**8015**
- **禁止占用 5173 / 5174**（那是 tiktok-creator-tool 在用）

**启动**：
- `start-full.bat`（前后端一起）
- `start-5175.bat` / `start-api-8015.bat`（单独启）
- 停：`stop-5175.bat`

**Git**：
- 远端：`https://github.com/freyhuang-11/KOL-compass.git`
- 分支：`codex/kol-compass-mvp`
- 提交规则：先跑 smoke-test，小步 commit/push，push 失败不假装成功

**冒烟截图**（每次 UI 改动 Codex 都重生成）：
- `smoke-dashboard.png` / `smoke-kol-pool.png` / `smoke-kol-detail.png`
- `smoke-outreach.png` / `smoke-cooperations.png` / `smoke-samples.png`
- `smoke-auto-reply.png` / `smoke-templates.png` / `smoke-blacklist.png`
- `smoke-billing.png` / `smoke-team.png` / `smoke-admin.png`
- `smoke-products.png` / `smoke-messages.png` / `smoke-platform-creators.png`

**TikTok OAuth 当前状态**：sandbox 通了，授权店铺 `SANDBOX_VN7651055422359521044`（VN）

[[project_kol_compass]]
