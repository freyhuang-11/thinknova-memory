---
name: project-compass-golive
description: Compass 上线接真商家的现状、阻断项、交接分工（2026-06-28 核过代码）
metadata: 
  node_type: memory
  type: project
  originSessionId: f77ccc33-3abf-4e50-8c37-80ff31be3331
---

2026-06-28 核 `server.js`/Partner Center 后的上线现状（接真实商家）：

- TikTok 那个是**服务商「达人建联」服务，状态=草稿**；服务商注册审核已过，但发品审核/应用审核未做、未发布。
- 系统当前连 **sandbox**（店铺 `SANDBOX_VN*`），`.env.local` 是 sandbox key/secret——**连不了真店**。
- 后端在 `127.0.0.1:8015`（仅本机）。**TikTok 应用审核要公网 https**，localhost 过不了。

**上线阻断项（按序）**：①部署到公网+域名+https ②拿生产 App key/secret ③TikTok 发品/应用审核+发布+批准 ④补**入站收消息**（现在只有出站 `createCreatorConversation`/`sendCreatorImMessage`，入站列会话/读消息/事件webhook 完全没实现，但 TikTok 支持）。

**已接 API**：OAuth、店铺、商品、类目、达人搜索、建联出站(定向邀约create+私信send)、SMTP、翻译。**没接**：入站收消息、寄样API、订单/ROI、多租户账号+DB。

**分工（用户已定）**：部署/开发**交给其他人**（用户有 Linux 云主机+域名，云厂商待定）；BD 自己做 Partner Center 那几步；我维护产品+手册。

**交接手册**：`D:\SamsoData\Documents\Kol compass\docs\DEPLOY_GO_LIVE.md`（Caddy 自动https + pm2 + env + Partner Center 步骤 + 待开发项 + 冒烟）。前端 `app.js` 的 `API_BASE` 部署时必须从 127.0.0.1 改公网。

## 2026-06-28 突破：真实店已接通（本地验证环境就绪）
- 走对了路：不走重的「公共服务/服务商对外审核」，而是建 **自定义应用(Custom App)·达人合作**——**测试版对 25 个授权用户开放、无需应用审核即可用**，目标市场含 SG。
- **本地回调可用**（不用部署）：`TIKTOK_SHOP_REDIRECT_URI=http://127.0.0.1:8015/api/tiktok/callback`，在本机授权即可。新 app key=`6kf8nfnogjh46`（secret 在本地 `.env.local`，旧 sandbox 备份在 `.env.local.sandbox.bak`）。
- **已授权真实店 jasarielpicks（SG·本地店，cipher ROW_Nvq02g…）**，真实商品已能拉取。`/api/health` configured=true、seller_name=jasarielpicks。
- 启示：**验证差异化只需 Level-1（自己一个店、Custom App、本地）**，Level-2（对外卖、公共应用送审）才需要部署+重审核，往后放。
- 已做 Wave 1A：达人库「出单潜力分」(app.js `creatorPotentialScore`)。下一步：拉 SG 真实达人验证潜力分（自动抓取已关 `KOL_CREATOR_AUTO_IMPORT_ENABLED=false`，需手动触发一次）。
- 多店铺「+添加店铺」入口已修（之前藏在平台设置）。

详见 [[project_compass_migration]] [[reference_tiktok_partner_api]]。
