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
