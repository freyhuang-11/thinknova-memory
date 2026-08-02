---
name: reference_thinknova_blog_ops
description: ThinkNova 官网博客运营接口手册要点(2026-08-01 技术交付)——纯 API 无后台页面、需 blog.write 服务令牌、双语必填才能发布、封面必须是平台资产编号。写/发官网博客前必读。
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-02T10:27:42.555Z
---

# 官网博客运营(2026-08-01 技术交付,本期纯 API 无后台页面)

全文归档:`D:\SamsoData\Documents\视频制作平台分析\00_规格与参考\技术文档_博客运营API_2026-08-01.md`

## 线上现状(2026-08-01 免令牌公开接口实测)
- 已上线并可读。**分类只有 1 个**:`local-store-marketing`(实体店内容营销)。
- **标签 10 个**:local-store-content / poster / short-video / customer-faq / multilingual / customer-objections / price-explainer / process-video / small-business / content-workflow。
- **已发文章 4 篇,全部 07-30 发布**:multilingual-faq-cards-local-stores / ai-content-workflow-busy-local-store-owners / how-to-explain-prices-with-process-poster-short-video / ai-poster-short-video-ideas-local-stores。
- 🔴 **四篇 `cover_image_url` 全是 null = 一张封面都没有**(SEO 字段倒是都填了)。🔴 **封面不是我的活(老板 08-02 定),是海外营销 Codex 的**,做法我已写进共享库信箱「给 Codex」栏。
- 🔴 **08-02 更正**:旧版指南写"不能上传图片到博客接口",我据此在 07-31 告诉 Codex"只能重新文生图";**新版明写了 `POST /assets/upload` 直传接口**,本地图片直接传就能拿 asset_no。旧结论作废,以最新版文档为准。

## 🔴 开工前的硬前提
- **写接口要 Bearer 服务令牌且必须含 `blog.write` 权限**,由系统管理员用 `php think app:service-token` 创建,**只在创建时完整显示一次**。我手上没有 → 要发博客必须先找老板/技术要令牌。
- 令牌 = 密钥:不打印、不发群、不进任何 git 仓库(含共享记忆库)。
- 写接口 base:`https://api.thinknova.top/admin/api/v1/blog`
- **公开读接口不需要令牌**(`/api/v1/blog/categories|tags|articles|articles/{slug}`)→ **发布后我能自己验收**,不用等人给权限。

## 内容侧硬约束(直接影响我怎么写稿)
- **中英双语全填才允许发布**:title/summary/content 的 zh 与 en 缺一不可,分类还得是启用状态。写稿时中英同步产出,别只写中文。
- 正文提交 **Markdown 原文**,不提交 HTML。摘要 ≤500 字符,标题 ≤255。
- **封面只能填 `cover_asset_no`(平台已有公开图片资产编号),不能填外链**。先 `POST /assets/upload` 上传拿 `data.asset.asset_no`;封面只收图片(MP4 能存但文章页不展示视频封面);**用横图,16:9 或 3:2**,否则列表裁切伤主体。
- SEO 字段留空会自动取标题/摘要;发布后自动生成 canonical / OG / BlogPosting / sitemap。别堆关键词。

## 操作要点(容易踩的)
- **文章句柄是 `article_no` 不是 `slug`**;更新/发布/下线/删除全用它。
- `PUT` 会**覆盖标签关联** → 每次都要传当前完整 `tag_codes`,无标签传 `[]`。
- `slug` 可改但**旧链接不跳转**,发布后改要同步外部投放链接。
- `published_at` 按 **UTC**:中国时间 09:00 = `T01:00:00Z`。
- 删除只允许草稿/已下线;已发布必须先 `POST /articles/{no}/offline`。
- 分类一篇文章只能一个;禁用分类 = 其下已发布文章立即从官网隐藏(标签禁用不下线文章)。
- **创建文章网络异常后禁止盲目重试**(会产生重复文章),先按 slug 或列表确认。
- 报错码:401003 缺令牌 / 403003 令牌无效或缺权限 / 404020 不存在 / 409020 code·slug 重复或有关联不能删 / 422020 字段或封面不合法 / 422021 发布校验没过。排查留 `request_id`。

关联:[[reference_thinknova_paths]] [[reference_thinknova_tech_docs_index]] [[project_thinknova_marketing]]
