---
name: reference-tiktok-partner-api
description: TikTok Shop Partner API 文档 URL、已知端点、真实 quota、隔离规则。每次跟 Compass 相关都要先校准这里
metadata: 
  node_type: memory
  type: reference
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

# 文档入口

- 总入口：https://partner.tiktokshop.com/docv2/
- Rate limits：https://partner.tiktokshop.com/docv2/page/rate-limits
- Affiliate Seller API overview：https://partner.tiktokshop.com/docv2/page/affiliate-seller-api-overview
- New affiliate messaging APIs：https://partner.tiktokshop.com/docv2/page/new-affiliate-messaging-apis
- Affiliate integration：https://partner.tiktokshop.com/docv2/page/affiliate-integration
- TikTok 官方 blog（2024 affiliate API 发布）：https://developers.tiktok.com/blog/2024-tiktok-shop-affiliate-apis-launch-developer-opportunity

**注意**：所有 partner.tiktokshop.com 页面都是 JS 渲染，WebFetch 拿不到正文。要拿真信息需要本地 headless 渲染或 Codex 实际抓。

# 真实 Quota（最重要 — 用户和我都搞错过）

## TikTok 私信「first-contact 新达人」限制（按周 + 按 GMV 分层）

| 30 天 GMV | 配额 |
|---|---|
| $0 | 0/周 |
| 起步包（新商家） | 1,000 条一次性 |
| $0 - $2k | 2,000/周 |
| $2k - $50k | 7,000/周 |
| > $50k | Unlimited |

- **只算新对话**（first-contact 给从未联系过的达人）
- **达人主动回你 / 你回老对话 → 不计**
- 周日重置
- 来源：https://www.hubfluence.io/blog/tiktok-shop-outreach-message-limits

## API 通用 Rate Limit

- 最小隔离单元：**App ID × 授权 Shop** 组合
- 没有公开固定 QPS，自适应限流（自己跑 429 退避）
- 一些来源：500 req/min（partner tier）；50 req/sec（按 store 独立）
- `36009002` = downstream throttling（不是系统错误，是被节流）

## 已知端点版本约束

- `/affiliate_seller/202508/marketplace_creators/search` — **page_size 只能 12 或 20**

## 2026-06-30 突破：官方 partner API 找达人封顶 ~2617，1万+ 在网页内部接口

- 官方 `marketplace_creators/search`（partner API）对这两个 SG 店**能返回的唯一达人就 ~2617**，空查询+类目查询翻页 0 新增（实测比对现有库确认）。**不是限流，是这接口只暴露这么多。**
- 卖家后台**达人广场(affiliate.tiktok.com/connection/creator)**用的是**另一个网页内部接口**：
  - 列表：`POST /api/v1/oec/affiliate/creator/marketplace/find` → 顶层 `creator_profile_list[12]`（每字段是 `{value,is_authorized,status}`，取 `.value`）；分页 `next_pagination.{has_more,next_page,next_item_cursor,search_key}`。
  - 计数：`/wish_list/search/creator` → `data.total_creator_cnt`。
  - 字段：`handle/nickname/avatar/follower_cnt/selection_region/creator_oecuid/category/main_industry/video_avg_view_cnt/med_gmv_revenue(_range)/units_sold` 等。
  - 认证=浏览器会话签名（msToken/X-Bogus/X-Gnarly）——server 端复刻难。
- **Compass 解法（已做，实测通过）**：扩展在达人广场页钩 `creator/marketplace/find` 响应 → `market.js` 解析 → `/api/creators/ingest-marketplace` 入库（librarySource=marketplace）。**riding 用户本人会话，不签名不爬别人**。BD 翻页/筛选，库自动往 1 万+ 涨。
- 竞品(达人精灵等)的大库=爬网页接口来的，非官方。我们的组合=网页钩广度 + 官方 API 建联后深度(样品/出单/归因)。

## 2026-06-30 实测：达人广场没采完，是限流卡住（别再说"采完了"）

- 空查询(keyword="")是**连续全量爬**：受控翻 10 页拿到 190 唯一达人，**next_page_token 始终有**(没到底)，每页约 18-20 新、几乎无重复 → 广场远不止当前库的 ~2600。
- **限流是真瓶颈**：约每翻 4 页就 `36009002 Too many requests`，要等 ~30s 恢复。采集器原来 5s/次太猛 → 触发自适应限流 → 长退避 → 净增≈0。
- **修法**：`KOL_CREATOR_AUTO_IMPORT_INTERVAL_MS` 默认 5s→**20s**(server.js 已改默认)，稳在限流线下持续爬。要更狠扩库 = 授权更多真实店铺(每店独立 quota 池)。
- 类目分片(shard)搜重复率高；**空查询连续翻页效率最高**。

# Compass 已接 vs 未接

**已接（server.js 里有）**：
- `/product/202309/products/search`
- `/product/202309/products/{id}`
- `/product/202309/categories`
- `/affiliate_seller/202508/marketplace_creators/search`

**未接但 Compass 必需（建联跑通的必需件）**：
- Messaging 发消息（推测 `/affiliate_seller/.../send-message` 或类似）— 没这个 Compass 不能建联
- Messaging 收消息（webhook 或 pull）
- Messaging 会话列表

**未接但战略重要**：
- Affiliate Order search（联盟订单，做 ROI 追踪）
- Affiliate product promotion link 生成（带 affiliate code 的邀请链接）
- Open / Targeted collaboration 创建

## 2026-06-29 实地在官方 docs 渲染页核到的端点清单（Affiliate Seller API，Phase2/3 用）
（partner.tiktokshop.com/docv2/page/affiliate-seller-api-overview，Chrome 渲染读到，确认存在；具体 path/版本待接入时点进每个端点取）
- **样品全流程（官方，零手填）**：`Seller Search Sample Applications`(搜寄样申请) / `Seller Review Sample Applications`(审核) / `Seller Search Sample Applications Fulfillments`(**寄样履约状态**=履约判断来源)
- **内容验收**：`Get Open Collaboration Creator Content Detail`(达人为合作发的内容详情)
- **达人表现**：`Get Marketplace Creator Performance`
- **定向合作 CRUD**：Create/Search/Update/Remove/Query `Target Collaboration`（create 已接）
- **开放合作**：Open Collaboration Settings / Sample Rules / Create/Search/Remove / `Seller Search Affiliate Open Collaboration Product`
- **出单**：Orders 分组存在（具体端点待点进取）
→ 结论：建联后(样品成功率/内容验收/出单归因)有官方 API 支撑，可做到零手填。承诺无 API、不做。

# Marketplace Creator Search 返回字段

- profile / followers / GMV / category / avatar / region
- avg_ec_video_view_count / avg_video_view_count
- avg_ec_live_uv / avg_live_uv
- creator_open_id / selection_region
- **不返 email、不返 WhatsApp** — contact 永远拿不到，必须爬

# 服务商架构下的 quota 计算

- 每个客户的店铺 = 独立 shop_cipher = 独立 quota 隔离
- BD 公司用一个 app_key 服务 50 客户 = 50 个 quota 池可叠加
- 但客户 GMV 决定 quota 上限，新客户全是 starter pack 1000

[[project_compass_migration]] / [[project_kol_compass]]
