---
name: project_compass_harvester
description: Compass 内部达人库采集器(达人广场接口轮询)——架构/事实/状态/待办
metadata: 
  node_type: memory
  type: project
  originSessionId: f77ccc33-3abf-4e50-8c37-80ff31be3331
---

**内部工具**(仅 Samso 运营，不发 B 端)：`D:\SamsoData\Documents\Kol compass\harvester\`（独立 Chrome 扩展，跟客户 `extension/` 分开装）。目的：从卖家后台**达人广场**扒 SG 达人建库，突破官方 partner API 的 ~2617 封顶。详见 [[reference_tiktok_partner_api]]。

## 架构（2026-07-01 重写：从"滚 DOM"改成"接口轮询"）
旧版靠无限滚动触发翻页——**会把页面 DOM 堆到几千张卡、渲染器冻死**(CDP evaluate 45s 超时)，还老翻不动。已废弃。新版：
- **`market-inject.js`(MAIN 世界)**：① 钩 fetch/XHR，记住页面自己发的带签名 find URL(`lastFindUrl`)；② **轮询循环**：拿到带签名 URL 后，直接 `fetch(url, {method:POST, body:{pagination:pg}, credentials:include})` 每 ~1.6s 调一次，翻页/轮换，`window.postMessage({__kcm,resp})` 走原管道。**不滚 DOM、不堆卡、不冻。**
- **`harvester.js`(隔离世界)**：只解析 `creator_profile_list`(每字段 `{value}` 取 `.value`；`category.value` 是数组取第一个 `.name`；用户名须合法 handle)→ 去重 → `chrome.runtime.sendMessage` → background。底部面板显示已采数 + **暂停/继续**(暂停 postMessage `{__kcmCtl:{paused}}` 通知 MAIN 停轮询)。
- **`background.js`**：POST `http://127.0.0.1:8015/api/creators/ingest-marketplace`(后端 `ingestMarketplaceCreators`，librarySource=marketplace，EN 类目→中文归一)。

## 关键事实（2026-07-01 真机验证，别再猜）
- find 接口：`POST https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find`，**签名(msToken/X-Bogus/X-Gnarly/X-Tts-Oec-Bsid)全在 URL query，只签 URL 不签 body** → 可带任意 body 重放。
- 响应顶层：`creator_profile_list[]` + `next_pagination.{has_more,next_page,search_key,next_item_cursor}` + `code`(0=success)。
- **翻页 body**：`{pagination:{size:20,page:next_page,search_key,item_cursor:next_item_cursor}}`(字段名 `item_cursor`，验证 A 组通)。`has_more=false` 就重置 `{size:20,page:1}` 重开一轮(推荐重新洗牌)。
- **推荐轮换**：每次调结果都不一样；实测 4 次调 80 个达人 **100% 不重复** → 轮询+去重就能源源不断。
- 达人字段丰富：`units_sold / med_gmv_revenue(_range) / has_collaborated / video_engagement / ec_video_avg_view_cnt / top_follower_age/gender / is_high_sample_dispatch_rate` 等(建联后指标可用)。

## 坑
- **重放 URL 必须从 `performance.getEntriesByType('resource')` 取(带 msToken 的那个），不能用 fetch 钩子抓的**：钩子在 TikTok 签名层内侧，抓到的是**加签名之前**的 URL，拿去重放会被风控拒（code 100000）。`signedFindUrl()` 过滤 `msToken=` 取 performance 里实际发出的已签名 URL。实测 performance URL + window.fetch 重放 5/5 code 0。
- **重载扩展后必须 F5 达人广场页**(否则旧 content script 失效)。
- 签名可能有 TTL：轮询若连续报错(code≠0)→ 面板提示"可能签名过期，F5 刷新"(F5 后页面重发新签名 find，`lastFindUrl` 刷新)。
- 页面只要不滚就停在初始 ~60 卡、不冻；旧版冻死是滚动堆卡所致，新版不碰 DOM。

## 突破推荐池：换词循环（2026-07-01 真机抓到并验证）
- **推荐池有天花板**：不带 query 深翻到 page 280+ 全是重复，SG 库卡在 ~3448。
- **find 接口 body 带 `query` 就按关键词搜**，返回达人跟推荐池 **0 重合**(实测 rec 60 vs "beauty" 59 重合 0)。换词=一批全新达人。
- **筛选 body 形状**(抓真实请求得到)：`{query:"beauty", pagination:{size:20,page:0}, query_type:1, filter_params:{category_list:[{string_list:["601450","子ID"]}]}, algorithm:1}`。
  - `query`=关键词搜索(最好用，简单且0重合)；`filter_params.category_list`=类目筛选，元素是 `{string_list:[父ID,子ID]}` 两级路径(Beauty 父=601450)。注意达人返回的 `category` 是主行业、跟筛选项不一定一致，别拿它验证筛选。
  - 翻页 body 兼容：`{size:20,page,search_key,item_cursor,next_item_cursor}`(两个 cursor 键都塞)。page_size 只接受 12/20。
- **采集器已改成全自动换词循环**(`QUERIES` 60 个类目/品类词，第1个""=推荐池)：每个词深翻(≤60页 MAX_PAGES_PER_QUERY)采尽或到上限→自动换下一个词。实测 4 词各 40 全不重复、合计 141。面板显示「当前采『beauty』」。

## ⏳ 待办
- 词表可继续扩(现 60 个)，或改用 category_list 全类目树遍历更系统。
- 别国：换那个市场的达人广场同套跑(用户暂只 SG，先扫满 SG)。

## 现状
库 ~2670，marketplace 来源在涨。网络确认**直连、达人主页图秒开**(冻死是 DOM 堆卡不是网络)。竞品(达人精灵)大库=爬网页接口；我们=接口轮询广度 + 官方 API 建联后深度。
