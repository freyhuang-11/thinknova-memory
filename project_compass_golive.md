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

## 2026-06-28 R15：多店铺并存(多token) + 实测8项修复
- **多店铺根因**：token 是单文件覆盖式(`tiktok-token.json`)，授权第二家店(Sggoodthingsg)把第一家(jasarielpicks)token 覆盖丢了——两家是不同 open_id 的卖家账号。已改成**多 token 存储** `.data/tiktok-tokens.json`(按 open_id 存多份, activeOpenId)+迁移旧文件+`accessTokenForCipher(cipher)`按店取 token+`allAuthorizedShops()`并集。shop-scoped 调用(商品/达人/类目/邀约/会话)全部按 cipher 取对应店 token。**用户需重新授权 jasarielpicks 才能两店并存**(它 token 已丢)。
- 头像：TikTok 签名 CDN 链接会过期/防盗链裂图 → `/api/avatar?cid=` 后端拉图缓存本地(`.data/avatars/`)再服务，前端走该端点、裂图回落首字母。
- 类目：跟官方 TikTok L1 走(27项 canonical)，同义词归一(保健品→健康保健等)+拼接串拆分；筛选项不再注入达人脏值。
- 移除"建联过"历史徽标(那是老系统状态)；列紧凑缩写；商品状态码→中文胶囊+名截断。版本 v=r16。

## 2026-06-28 R17-R18：达人库可读性 + Chrome 扩展(建联前)从零搭建
- R17(v=r20)：数字面板简化(藏真实/补充内部分层→"当前市场达人N/可联系M")；GMV 改官方 K/M(10K/200K)；内容表现拆成"视频均播""直播均观"两列；回复率 undefined→"-"；GMV 筛选加 <10K/10K-100K/100K-1M/>1M；类目加"其他"兜底(voucher等官方27类之外的)。
- R18(主线)：**Chrome 扩展 `extension/`** (MV3) 从零建成——建联前核心差异化，采集 TikTok 达人内容信号(粉丝/简介/近期文案/主题，API 拿不到的)并入库。后端 `POST /api/creators/ingest`+`ingestExtensionCreators`(librarySource=extension，联系方式不覆盖)已 mock 测通。扩展 DOM 抽取用 data-e2e 选择器+降级，需在用户登录态浏览器眼验。**未做**：内容主题 vs 商家商品类目契合度评分(改评分模型，待用户拍板)。
- **后端稳定性(已诊断，结论修正)**：看门狗其实**正常**——计划任务 `KOL Compass Watchdog` 每 3 分钟在跑(Enabled、零漏跑、wscript→watchdog-launch.vbs→watchdog.ps1 检查 8015/5175 掉了就拉)。后端死亡主因是**我开发会话自己造成的**：反复重启加载新代码 + Bash 后台进程回合结束被回收，授权恰好打进这些窗口。正常运行 3 分钟内自愈。唯一真短板=3分钟恢复窗口，缩短需改任务间隔(系统配置，待用户点头)。会话内起后端用 PowerShell `Start-Process -WindowStyle Hidden` 脱离会话最稳。
- **1B 出单归因**：双重受阻(新店零联盟订单+订单API端点 docs JS渲染拿不到)，暂缓；待真实订单数据 + 实测端点后再做。

## 2026-06-28 R14：导入老库联系方式+建联历史，解锁真数据
- 新店被 TikTok 限流、达人库近空 → 改从老系统 `D:\tiktok-creator-tool\backend\tiktok_creators.db` 导真数据（注意：`creators.db` 是空的，真库是 `tiktok_creators.db` 56MB）。
- **取舍铁律**：老库只取**联系方式(email/wa/ig/wechat，TikTok API 永不返、最值钱) + 建联历史(reply_category/partnership_status)** 为真值；粉丝/GMV/类目过期 → 用户拍板「导入但明标 `metricsEstimated`/估算待刷新」，让 1A 评分立刻能验，TikTok 同步后覆盖。`collaborations.gmv/orders` 全空未导；scraped_creators 7.9万 stub 未导。
- 落地：`scripts/export-legacy-creators.py`(只读，中文区间→数值，派生最强意向) → `.data/legacy-import/sg-creators.json`(1447条) → `POST /api/platform/creators/import-legacy` → `importLegacyCreators`。达人库 →1918。
- `upsertPlatformCreators` 改**非对称合并**：新鲜 TikTok 指标永远赢+清估算标；老库估算不反向覆盖；联系方式/`legacyOutreach` 空值不抹真值。join 键=`username`(==老库 tiktok_username)。
- 前端 r14：达人库估算「估」标 + 历史建联徽标(曾洽谈·有意向/曾合作/曾拒绝)；详情新增「建联前评估」卡(潜力分拆解+历史)。潜力分在 1433 真达人上分布合理(7–70/均49)，1A 验证通过。
- ⚠️ 浏览器可视化没跑通：preview 工具撞 hermes 的 3000 端口；前端样式待用户刷新 5175 眼验。详见 docs/CLAUDE_ACCEPTANCE.md R14。

详见 [[project_compass_migration]] [[reference_tiktok_partner_api]]。
