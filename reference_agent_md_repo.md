---
name: reference-agent-md-repo
description: 国内版 H5 与技术协作走 GitHub 仓库 yaoyingyunlian-create/agent-md（只放文档）；我=项目经理+验收；本地克隆位置与提交规矩
metadata:
  type: reference
---

- 10-20 18:4x 技术（国内版）对老板说「告诉你的 ai，以后用这个协作」：https://github.com/yaoyingyunlian-create/agent-md.git 。本机 git 能直接拉（无需 gh）；本地克隆 `D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/agent-md/`（每次用前 `git pull`）。
- 仓库只放文档：需求、接口约定、验收标准、阻塞项、交付证据；⛔业务源码、密钥/Cookie/CSRF、用户素材、未脱敏日志。
- 当前项目：`docs/thinknova-domestic-h5/`（国内独立 H5 thinknova.kukuda.net，后端同 api.thinknova.top）。角色：**项目经理（我们）**维护需求/优先级/验收并验收开发回传；开发 Agent（另一台电脑）在 H5 源码仓库实现并回写 `delivery/`；技术负责人给源码/部署映射。
- 提交规矩：从最新 main 开分支（docs/{project}-{topic}、delivery/{project}-{task}），一提交一主题，提交信息带项目和任务号，UTF-8+LF，提交前 `git diff --check`；「HTTP 200 / 包名变化 / 构建成功」不算功能完成。
- 10-20 现状：P0-1 通用创作、P0-2 海报场景字段、P0-3 15 秒视频建单、P0-4 任务资产积分反馈；阻塞=技术负责人未给 H5 源码仓库与部署映射（delivery/BLOCKED-独立H5源码与部署映射-2026-10-20.md）。
- 10-20 20:1x 起本机 git 已能推送（凭据已在本机）；提交作者设为「Frey Huang (ThinkNova 总指挥 AI)」；按规矩开分支推送，PR 由技术合并（本机无 gh）。⛔替老板接受邀请或改账号设置。

- 🔴 **10-21 更新**：技术定「项目经理 AI 直接写 main 的 delivery/」（3983d73）——只追加、不改别人内容、新 PM 号接当前最大号（先 ls delivery 查，10-21 撞过 PM-22）；开发也直写 main 回传；不再开分支、不再经老板转。
- 10-21～23：技术侧也有一个 PM AI（yaoyingyunlian-create 提交）在写 PM 单和验收（PM-30/34/36～42/45），会和我撞号（PM-31 撞过）。新号一律先取当前最大号 +1；对方规范和老板 10-14 设计稿冲突时写对齐单（如 PM-46），以设计稿为准。
- 素材可以放仓库 `assets/`（新手引导样片 assets/onboarding/、企业微信客服码 assets/support/）。
