# Compass 达人线 · 重启唯一入口
> 停在 2026-07-04。过程记录见 `draft_compass_archive.md`。

## 1 跑到哪
- 执行派 SaaS，不跟数据派拼库；建联地基**已够**，两柱①建联前选人②建联后管理(投流决策/ROI)**未开工**。
- 通：绑真实店→同步商品→达人库(潜力分)→建联**出站**+SMTP+翻译+采集器；没通：**入站收消息**、寄样、订单/ROI 归因、多租户 DB。
- 验差异化只需 **Level-1**(一个店·Custom App·本地免审)；Level-2 送审往后放(部署交别人、Partner Center 归 BD)。铁律：本机只拿数据不加负载；**无 API 不承诺不做**；WhatsApp 不做。

## 2 路径/启动/凭证（唯一真值·勿改字）
- 根 `D:\SamsoData\Documents\Kol compass`；`server.js`→`127.0.0.1:8015`；`app.js`(单文件 SPA)→`5175`；**禁占 5173/5174**
- 启 `start-full.bat`(或 `start-5175.bat`/`start-api-8015.bat`，停 `stop-5175.bat`)；`node smoke-test.js` 改完必跑；会话内起后端 `Start-Process -WindowStyle Hidden`
- **只按 PID/端口精准杀**，禁 `taskkill /IM python.exe`；看门狗任务 `KOL Compass Watchdog` 每 3 分钟拉活(`watchdog-launch.vbs`→`watchdog.ps1`)
- `.data/`(gitignore)：`platform-creators.json` 达人库·`tiktok-tokens.json` 多店 token(open_id+activeOpenId)·`avatars/`·`legacy-import/sg-creators.json`
- `.env.local` 不进 git；Custom App·达人合作 **app key `6kf8nfnogjh46`**；`TIKTOK_SHOP_REDIRECT_URI=http://127.0.0.1:8015/api/tiktok/callback`
- 真实店 **jasarielpicks**(SG,cipher `ROW_Nvq02g…`)、Sggoodthingsg 已授权；`/api/health`→configured=true
- `KOL_CREATOR_AUTO_IMPORT_ENABLED=false`(手动触发)；`KOL_CREATOR_AUTO_IMPORT_INTERVAL_MS` 5s→**20s**；部署时 `app.js` 的 `API_BASE` 改公网
- 私密仓 `github.com/freyhuang-11/KOL-compass` 分支 `codex/kol-compass-mvp`；有变化一天至少 commit+更新记忆；`.env*`/`*.bak`/`.data/` 不提交
- `docs/`：`BACKLOG.md` 待办·`CLAUDE_ACCEPTANCE.md` 验收·`DEPLOY_GO_LIVE.md` 部署
- 老库(退役中) `D:\tiktok-creator-tool\backend\tiktok_creators.db` 56MB(`creators.db` 空)
- 潜力分 `app.js`：`creatorPotentialScore`/`scoreTier`/`openScoreHelp`；**≥65 绿/40–64 蓝/<40 灰**(权重见 archive)

## 3 采集器 harvester（内部用，破官方 ~2617 封顶）
- `<根>\harvester\` 独立 Chrome 扩展(与客户 `extension/` 分开装)，接口轮询不滚 DOM；SG 已采 **1.7 万+**；换词循环(`QUERIES` 60 词/词≤60 页)；**字段形状见 archive「采集器接口协议」**
- 源 `POST https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find`：签名全在 URL query、**不签 body**→可任意 body 重放；`size` 只接受 12/20
- 🔴 重放 URL 必须从 `performance.getEntriesByType('resource')` 取带 `msToken=` 那条；fetch 钩子拿的是**加签前** URL，重放被拒 `code 100000`
- 入库 `/api/creators/ingest-marketplace`；客户扩展走 `/api/creators/ingest`(librarySource=marketplace/extension，不覆盖联系方式)

## 4 Partner API 关键约束
- 文档 `partner.tiktokshop.com/docv2/` **JS 渲染，WebFetch 拿不到**，须 Chrome 渲染
- 私信 **first-contact** 配额(周×近30天GMV)：$0=0／起步包 1000 一次性／$0–2k=2000／$2k–50k=7000／>$50k 无限；**只算新对话**，周日重置
- 隔离单元=**App ID × 授权 Shop**；无公开 QPS，自行 429 退避；`36009002`=被节流非故障
- `/affiliate_seller/202508/marketplace_creators/search`：page_size 只能 12/20；SG 两店**只能返 ~2617 达人**(非限流)→大库走网页接口；**不返 email/WhatsApp**
- 已接：`/product/202309/`{products/search,products/{id},categories}、`marketplace_creators/search`、OAuth、定向合作 create、`createCreatorConversation`、`sendCreatorImMessage`
- 未接必需：入站收消息(webhook/pull)、会话列表。战略：Affiliate Order search／promotion link／Open Collaboration／`Sample Applications`(Search/Review/`Fulfillments`=履约来源)／`Creator Content Detail`／`Creator Performance`

## 5 数据坑（一句一条）
- 老库 35 条 username/nickname 写反；再导先校验 username 只含 `a-z0-9._`；去重须小写 `platformCreatorKeys`=`u:<username.toLowerCase()>`
- 头像走 `/api/avatar?cid=`：传 username 不传 id(id 是重排序号)否则全裂；CDN 链接会过期/防盗链，裸 fetch 需 UA+Referer+超时
- 达人库数字=当前店铺市场非全库，切店会变≠丢数据
- token 曾单文件覆盖式，授权第二店会覆盖丢第一店(已改多 token)
- 老库指标是估算 `metricsEstimated`，TikTok 同步后覆盖→分数降不是 bug
- `upsertPlatformCreators` 非对称合并：新鲜指标赢、估算不反覆盖、contact/`legacyOutreach` 空值不抹真值，join=`username`
- 类目按官方 L1 27 项+"其他"兜底；达人 `category` 是主行业，别拿它验筛选
- 采集器重载后必须 F5 广场页；连续 `code≠0`=签名过期→F5
- 头像灰/计数偏少=已修 bug 与前端旧快照，非负载问题；冻死=滚 DOM 堆卡；后端老死=会话反复重启+后台进程被回收，非看门狗坏

## 6 待办（14 条）
1. 补**入站收消息**(会话列表/读消息/webhook)
2. 换翻译(阻断)：MyMemory 额度全站共享，用尽客户可见→LibreTranslate/DeepL
3. `platform-creators.json` 全量读写→服务器迁 SQLite/PG 增量 upsert
4. 前端全量载入→服务端分页
5. 头像缓存磁盘膨胀
6. 内容主题×商品**类目契合度评分**(改模型，待拍板)
7. 采集词表扩容(现 60)或改类目树遍历
8. 别国市场采集(暂只 SG)
9. **重新授权 jasarielpicks**(token 已丢，两店并存前提)
10. 出单归因暂缓，等真实联盟订单+实测订单端点
11. 达人评估列/筛选：带货视频+评论率+购买意向／历史合作／履约率／回复率
12. 看门狗 3 分钟恢复窗口缩短(待点头)
13. 待拍板：代发邮箱池入 M1?／冷启动池／私信批量风控／跨客户拒绝互见／分级切池
14. Level-2：公网 https→生产 key→审核发布→入站消息
