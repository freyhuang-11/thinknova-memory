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

## 🔴 2026-09-11 接手 · token 到手、链路已通

- **token**：老板直接给的（`ops-blog`, id=5, scope=`blog.write`, 到期 2027-09-09）。
  存 `00_规格与参考\_secretslog_token.txt`（该盘非 git），脚本读文件、**全程不 print**。
  ⚠️ **它是明文贴进对话的，已在聊天记录里** → 自动化跑通后应让技术重签、把这个作废。
- **脚本**：`03_工作台\博客发布\_blog.py`（list / draft / show）。

### 🔴 建稿字段（实测，猜错会 422）
- ⛔ `category_id` / `tag_ids` **不认** → 要 **`category_code`** / **`tag_codes`**（422020 会明确告诉你）
- 现有分类只有 1 个：`local-store-marketing`
- 标签词表 10 个：`local-store-content` `poster` `short-video` `customer-faq` `multilingual`
  `customer-objections` `price-explainer` `process-video` `small-business` `content-workflow`

### 现有 55 篇的"对的样子"（实读一篇反推）
**中英双语**字段：`title_zh/en`、`summary_zh/en`、`seo_title_zh/en`、`seo_description_zh/en`、`content_zh_md/en_md`。
**slug** = 英文关键词连字符 + `YYYY-MM`。
**正文固定七段**（AEO/问答式结构，给 AI 搜索抓的）：
`# 标题` → `## 简短答案` → `## 适用行业` → `## 操作步骤`(5 步编号) → `## 示例输出`
→ `## ThinkNova 能做什么`（**含免责：商家自己核对价格政策语言，不承诺销售结果**）→ `## 常见问题`(4 问，`###`)
篇幅参考：中文 ~700-770 字 / 英文 ~2000-2300 字符。
现状：55 篇（53 published + 我建的 2 draft），全在 `local-store-marketing` 分类下。

## 🔴🔴🔴 总指挥 09-11 规则（现拉线上核过，按这个写，别再问）

**发布五道硬门槛**（缺一发不出去）
1. **双语缺一不可**：title / summary / content 的 zh 与 en 都要有，缺一个 **422021**。别想先发中文回头补。
2. **封面必须有**，只收 `cover_asset_no`（先 `POST /assets/upload` 拿 `data.asset.asset_no`），**不收外链**；
   **必须横图 16:9 或 3:2**，否则列表裁切伤主体；只收图片。
3. 正文提交 **Markdown 原文，不提交 HTML**。
4. **SEO 字段建议留空** —— 留空会自动取标题和摘要，别堆关键词。发布后自动生成 canonical/OG/BlogPosting/sitemap。
5. `category_code` 只有 `local-store-marketing` 一个；`tag_codes` 从固定 10 个里挑 **3–4 个**，别新建。

**规格**：正文 ~765 字符（不是长文，别写三千字）／标题 19 字上下、直接是长尾问句或 how-to、不玩修辞／摘要 90 字上下。
「简短答案」**第一段就把答案说完**，后面才展开 —— 这是给搜索摘要抓的。
**slug** = 英文长尾关键词连字符 + `-YYYY-MM`；可改但**旧链接不跳转**，改了要同步外部投放链接。

**节奏**：现有是**每次 2 篇、隔天发**。建议一周 3 次 × 2 篇 = 6 篇，排**工作日上午**（本地商家开店前刷手机）。
博客是 SEO 慢线，不跟小红书/微信抢时段。
🔴 **`published_at` 走 UTC** —— 中国时间 09:00 = `T01:00:00Z`。**最容易错，定时脚本里写死转换**。

**🔴 五个坑（都有代价换来的）**
- **句柄是 `article_no` 不是 `slug`**，更新/发布/下线/删除全用它；拿 slug 去调 **404020**。
- **`PUT` 会覆盖标签关联** → 每次 PUT 都要传当前完整 `tag_codes`，无标签传 `[]`，**漏传就清空**。
- **创建文章网络异常后禁止盲目重试**（会产生重复文章）→ 先按 slug 或列表确认再决定。
- 删除只允许草稿/已下线；已发布必须先 `POST /articles/{no}/offline`。
- 分类禁用 = 其下已发布文章**立即从官网隐藏**（标签禁用不会下线文章）。
- 错误码：401003 缺令牌／403003 令牌无效或缺权限／404020 不存在／409020 code·slug 重复／
  422020 字段或封面不合法／422021 发布校验没过。排查留 `request_id`。
- **公开读接口不需要令牌** → 发完能自己验收，别等人给权限。

**受众口径（总指挥判断，老板可推翻）**：⛔ **不为新马华人圈另开一条博客线** ——
博客吃英文长尾搜索且双语强制，再分线只会稀释本来就只有 53 篇的站点权重。
✅ **结构照旧、骨架照旧、例子换成新马**：地名币种行业词换新马（新币/令吉、咖啡店、小贩摊、车行、诊所），
长尾词往 `singapore`/`malaysia`/`local business` 靠（竞争度比纯通用词低），中文用新马华人说法、不用国内网感词。
一篇同时吃英文长尾和华人圈搜索。
