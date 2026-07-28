# Compass 线归档，仅供追溯

> 只留**没被推翻**的过程记录：历史决策、已完成的迁移步骤、评分公式推导、竞品验证、采集器接口协议。
> 已被现状推翻的旧结论、已失效的一次性约束、过期数值**已直接删除**（历史在 memory 仓库的 git commit 里，不留副本）——删除清单见最后一节。
> 当前真值一律看 `draft_compass_current.md`。

---

## A 采集器接口协议（唯一真值·改采集器时回来看）

- 数据源：`POST https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find`
- 计数：`/wish_list/search/creator` → `data.total_creator_cnt`
- **翻页 body**：`{pagination:{size:20,page:next_page,search_key,item_cursor:next_item_cursor}}`（字段名是 `item_cursor`）。`has_more=false` 就重置 `{size:20,page:1}` 重开一轮（推荐会重新洗牌）。兼容写法：两个 cursor 键都塞 `{size,page,search_key,item_cursor,next_item_cursor}`。`size` 只接受 **12 / 20**。
- **关键词/筛选 body**：`{query:"beauty", pagination:{size:20,page:0}, query_type:1, filter_params:{category_list:[{string_list:["601450","子ID"]}]}, algorithm:1}`
  - `query` = 关键词搜索（最好用，简单且与推荐池 0 重合）；`filter_params.category_list` 元素是 `{string_list:[父ID,子ID]}` 两级路径，Beauty 父 = `601450`。
  - 达人返回的 `category` 是主行业，跟筛选项不一定一致，别拿它验证筛选。
- **响应**：顶层 `creator_profile_list[]` + `next_pagination.{has_more,next_page,search_key,next_item_cursor}` + `code`（0=success）。每字段是 `{value,is_authorized,status}` → 取 `.value`；`category.value` 是数组取第一个 `.name`；用户名须是合法 handle。
- **达人字段**：`handle / nickname / avatar / follower_cnt / selection_region / creator_oecuid / category / main_industry / video_avg_view_cnt / ec_video_avg_view_cnt / avg_ec_live_uv / med_gmv_revenue(_range) / units_sold / has_collaborated / video_engagement / top_follower_age / top_follower_gender / is_high_sample_dispatch_rate`（建联后指标可用）
- **三层架构**：`market-inject.js`（MAIN 世界：钩 fetch/XHR 记住带签名的 `lastFindUrl`；轮询循环约 1.6s 一次 `fetch(url,{method:POST,body:{pagination:pg},credentials:include})`；`window.postMessage({__kcm,resp})`）→ `harvester.js`（隔离世界：解析 `creator_profile_list`、去重、底部面板显示已采数 + 暂停/继续 `{__kcmCtl:{paused}}`）→ `background.js`（POST 后端 `ingestMarketplaceCreators`，EN 类目→中文归一）。
- **实测**：`signedFindUrl()` 过滤 `msToken=` 取 performance 里实际发出的已签名 URL，performance URL + window.fetch 重放 5/5 `code 0`；推荐轮换每次结果不同，4 次调 80 个达人 100% 不重复；推荐池天花板 = 不带 query 深翻到 page 280+ 全是重复；rec 60 vs "beauty" 59 重合 0；换词循环实测 4 词各 40 全不重复、合计 141。
- 页面只要不滚就停在初始 ~60 卡、不冻（冻死来自旧版滚动堆卡，新版不碰 DOM）。网络确认直连、达人主页图秒开。
- 竞品（达人精灵等）的大库=爬网页接口来的，非官方；我们 = 接口轮询广度 + 官方 API 建联后深度。

## B 出单潜力分权重推导（2026-06-29 拍板）

「出单潜力分」0–100 = 加权，**缺数据项剔除、权重摊回其余**：
- 出单能力 **35%**（TikTok 历史 GMV）
- 类目契合 **25%**（达人内容/类目 vs 店铺商品）
- 内容触达 **20%**（粉丝 + 视频均播）
- 建联效率 **20%**（回复率）
- 有数据才计：带货经验 **18%**（近期挂商品视频数，扩展采集）· 历史履约 **15%**（自有合作回流）
- 契合分在「内容实证不发店铺品类」时直接压到 **12**（与扩展弹窗红灯口径一致）
- 客户侧透明化：达人库表头 + 详情评估卡有 `?`，点开 `openScoreHelp()` 说明
- 指标以 TikTok API 为准，老库指标是估算（合并时被覆盖）→ annayeo44 分数从 78 降到 65 是这个原因，不是 bug
- 1A 验证：潜力分在 1433 个真达人上分布 7–70、均 49，合理

## C 核心方向与竞品验证（2026-06-28，未被推翻）

- **市场两派**：① 数据分析派 Kalodata（2 亿画像/500 天）、EchoTik（新加坡，营销称 10 亿其实灌水、数据被吐槽不准、明说"找到后无执行工具"）、蝉妈妈类——核心是选品/数据，不做执行。② 建联/执行派 Cruva、Reacher（美区，全漏斗强对手）、达连/达秘/Proboost（中国跨境，速度 + 基础 CRM）、花漾（全链路、1000 万库、6 年）。
- Compass 属执行派，**别去跟数据派拼数据库**（灌水 + 不准 + 追不上的沟）。执行派护城河是 workflow/管理，小、可竞争。
- "10 亿达人"是营销数字，不要当事实。
- **TikTok 原生已给（站肩上别重造）**：达人履约率 CFR、达人样品分 4 维（履约/勤奋/出单/内容质量）、Manage Creators（近 90 天 GMV/产出/打标签）、GMV Max（算法自动投流）。
- **我们的刀（组合，不是单点）**：
  - 建联前 = TikTok 通用分之上加「针对这个商家商品」的产品级契合度（扩展抓达人近 30 天内容有没有本品类货 + 评论率 + 购买意向）+ SEA 跨语言 + 自有回复率/履约率（越用越准）。
  - 建联后 = 投流决策支持：每条达人视频拉早期信号（点击率/评论速度/完播/自然出单）对标基准（**CTR 2–3%、RPM $25–60**）+ 两笔成本（广告费 + 佣金）→ 给"值得投/再看/不投"。这是没人做成干净决策工具的真空（Reacher 凑量、Cruva 事后测、GMV Max 黑箱）。+ 出单/ROI 归因（联盟订单 API）+ 复投/防流失（开放合作 58% 三月流失没人管）。
- **诚实边界**：脚本/服务器爬不行（扛不住持续看每个达人最近内容）→ 用 Chrome 扩展（BD 已登录会话内读前端、限速、灰区、随 TikTok 改版长期维护），竞品就是扩展；GMV Max 在自动投流本身 → 我们做投前决策 + 投后关系/履约管理，不做"替你自动投"；CFR/样品分能否走 API 拿还是只在后台 UI = 待验证，拿不到就扩展抓；护城河（自有回复/履约/出单数据 + 大达人库）要时间，冷启动靠 SG/MY 现成数据当楔子；Cruva/Reacher 是真对手，赢点是组合刀 + SEA。
- 竞品事实另见项目 `docs/STRATEGY.md`。

## D 已拍板的产品/架构决策（2026-06-23 / 06-24，仍有效）

| 决策 | 内容 |
|---|---|
| 最终归宿 | Compass 完全正常后，tiktok-creator-tool 退役 |
| 客户类型 | 最终目标=**服务商**（BD 公司多客户多店铺）；上线排序：MVP 先做**单商家多店铺**，服务商层推迟到正式上线后的版本更新，当前版本/`DESIGN.md`/`PRODUCT.md` 里不塞服务商 |
| 多租户层级 | 账号 → 店铺（跨境基础 5+） → 团队成员（BD/运营/客服） |
| contact 池 | 全平台公共池，后面用收费模式分级开放 |
| 服务器化 | 会上服务器；**爬虫服务独立**（xvfb + Chrome 方向） |
| WhatsApp | 完全不做（一人一账号撑不住 10 万 MY 达人量） |
| Email 角色 | 备用渠道，BD 手动选「特别想合作但私信不回」才用，**不自动从私信升级** |
| TikTok 私信 | 主战场 |
| 平台管理端 | 只对开发者/平台运营可见，客户后台不暴露 |
| 决策辅助 | 先做轻量层（评分卡 / 类似达人推荐基于 SQL 上下浮 10–20%），重量层等服务器化 |
| 自动回复 | 双通道（私信短规则 5 条 + 邮件长规则 8 条），初版只做规则 1–5 + Fallback，AI 兜底 v2 |
| 寄样 | 没有「auto 补地址」环节，BD 手动新增寄样 + 录地址 |
| 客户侧红线 | 客户不能编辑 contact、不能 CSV 导入达人 |

- **差异化候选（还没拍板完，对应 current 待办 13）**：① 平台代发邮箱池（客户零配置发邮件，背后平台 SenderAccount 多账号轮询）② 冷启动池（SG/MY 数据当新客户起步资源）+ 持续 enrich 服务 ③ TikTok 私信批量能力 + 风控。已明确认可的两条是「服务商架构」和「决策辅助层」。
- **冷启动数据覆盖**（源自老系统库）：SG 客户绑店立刻有起步池 ✓；MY 有 76,480 profile 但 contact 仅 ~3% 🟡；TH/VN/PH/US/UK/SA/MX **完全空**，要从 Partner API 从 0 跑。
- 建议 UI 加 contact 状态 chip：🟢 已就绪 / 🟡 待补充 / 灰 业绩待补充。
- 服务商 quota 计算：每客户店铺 = 独立 shop_cipher = 独立 quota；一个 app_key 服 50 客户 = 50 个 quota 池叠加；但客户 GMV 决定上限，新客户全是 starter pack 1000。新客户第一周 ≤1000 条 ≈ 140/天。
- 未决：服务商模式下「客户 A 拒过这个达人」要不要让客户 B 看到（同账号内不需隔离，跨客户待确认）。

## E 已完成的迁移/迭代步骤（2026-06-28 ~ 07-02）

- **Custom App 路线突破**：不走重的「公共服务/服务商对外审核」，改建**自定义应用（Custom App）·达人合作**——测试版对 25 个授权用户开放、无需应用审核，目标市场含 SG；本地回调即可授权，不用部署。启示：验证差异化只需 Level-1，Level-2 往后放。多店铺「+添加店铺」入口已从平台设置里挪出来修好。
- **R14 老库导入（解锁真数据）**：新店被 TikTok 限流、达人库近空 → 从老系统 `backend\tiktok_creators.db` 导（注意 `creators.db` 是空的，真库是 `tiktok_creators.db` 56MB）。取舍铁律 = 只取**联系方式（email/wa/ig/wechat，TikTok API 永不返，最值钱）+ 建联历史（reply_category/partnership_status）**为真值；粉丝/GMV/类目过期 → 导入但标 `metricsEstimated`，TikTok 同步后覆盖。`collaborations.gmv/orders` 全空未导；scraped_creators 7.9 万 stub 未导。链路：`scripts/export-legacy-creators.py`（只读，中文区间→数值，派生最强意向）→ `.data/legacy-import/sg-creators.json`（1447 条）→ `POST /api/platform/creators/import-legacy` → `importLegacyCreators`。`upsertPlatformCreators` 改非对称合并，join 键 = `username`（== 老库 `tiktok_username`）。前端加「估」标 + 历史建联徽标（曾洽谈·有意向/曾合作/曾拒绝）+「建联前评估」卡（潜力分拆解 + 历史）。
- **R15 多店铺并存**：根因 = token 是单文件 `tiktok-token.json` 覆盖式，授权第二家店把第一家 token 覆盖丢（两家是不同 open_id 的卖家账号）。改成多 token 存储 `.data/tiktok-tokens.json`（按 open_id 存 + activeOpenId）+ 迁移旧文件 + `accessTokenForCipher(cipher)` 按店取 token + `allAuthorizedShops()` 并集；shop-scoped 调用（商品/达人/类目/邀约/会话）全部按 cipher 取对应店 token。
- **头像**：TikTok 签名 CDN 链接会过期/防盗链裂图 → `/api/avatar?cid=` 后端拉图缓存 `.data/avatars/` 再服务，前端走该端点、裂图回落首字母；裸 fetch 加 UA+Referer+超时。
- **类目**：跟官方 TikTok L1 走（27 项 canonical），同义词归一（保健品→健康保健等）+ 拼接串拆分；筛选项不再注入达人脏值；加「其他」兜底（voucher 等 27 类之外的）。
- **R17 达人库可读性**：数字面板简化为「当前市场达人 N / 可联系 M」；GMV 改官方 K/M（10K/200K）；内容表现拆「视频均播」「直播均观」两列；回复率 undefined→"-"；GMV 筛选加 <10K / 10K-100K / 100K-1M / >1M；移除「建联过」历史徽标（那是老系统状态）；列紧凑缩写；商品状态码→中文胶囊 + 名截断。
- **R18 客户 Chrome 扩展 `extension/`**（MV3，建联前核心差异化）：采集 TikTok 达人内容信号（粉丝/简介/近期文案/主题，API 拿不到的）入库，后端 `POST /api/creators/ingest` + `ingestExtensionCreators`（librarySource=extension，联系方式不覆盖）已 mock 测通；DOM 抽取用 data-e2e 选择器 + 降级，需在登录态浏览器眼验。
- **后端稳定性诊断（结论修正）**：看门狗其实正常（计划任务每 3 分钟在跑、Enabled、零漏跑）；后端死亡主因是开发会话自己造成的（反复重启加载新代码 + Bash 后台进程回合结束被回收，授权恰好打进这些窗口），正常运行 3 分钟内自愈；唯一真短板 = 3 分钟恢复窗口，缩短需改任务间隔（系统配置，待用户点头）。
- **官方 API 采集限流实测**：约每翻 4 页就 `36009002 Too many requests`，等 ~30s 恢复；采集器原 5s/次太猛 → `KOL_CREATOR_AUTO_IMPORT_INTERVAL_MS` 默认改 20s 稳住。要更狠扩库 = 授权更多真实店铺（每店独立 quota 池）。
- **07-02 性能决策**：本机不再加负载，先让采集器拿数据；性能/规模问题等上正式服务器解决，别在本机打补丁。最关键待服务器项 = `.data/platform-creators.json` 单文件全量读写（采集器每 3.5s 回流一次）→ 迁真数据库（SQLite/Postgres）增量 upsert；其余见 `docs/BACKLOG.md`「性能/规模问题」节（前端全量载入→服务端分页、采集器须在登录态浏览器跑的约束、头像缓存磁盘膨胀）。
- **出单归因 1B 受阻**：新店零联盟订单 + 订单 API 端点 docs 是 JS 渲染拿不到 → 暂缓，待真实订单数据 + 实测端点。
- **未跑通的小事**：浏览器可视化 preview 工具撞 hermes 的 3000 端口，前端样式靠手动刷 5175 眼验（详见 `docs/CLAUDE_ACCEPTANCE.md` R14）。
- **翻译服务（06-27 记为阻断级）**：现用 MyMemory 免费 API，额度全站共享，用尽后客户也会看到「额度已用完」，上正式前必须替换。候选：自建 LibreTranslate（倾向）/ 商用 API（DeepL/Google/火山）。
- **竞品情报（06-24）**：很多机构用「**达秘**」做达人建联，需对标。商家核心诉求 = 履约率 + 出单率 → 应做成达人库的评估列/筛选（近 1 月视频有无相关商品 + 评论率 + 评论区购买意向提问 / 历史合作数据 / 履约率 / 批量建联回复率），落地前必查 Partner API 能拿到哪些，不假设。

## F Level-2（对外卖）路线遗留

- TikTok 那边的「达人建联」服务是**服务商类目、状态=草稿**；服务商注册审核已过，但发品审核/应用审核未做、未发布。
- 应用审核要**公网 https**，localhost 过不了。
- 交接手册 `docs/DEPLOY_GO_LIVE.md`：Caddy 自动 https + pm2 + env + Partner Center 步骤 + 待开发项 + 冒烟。前端 `app.js` 的 `API_BASE` 部署时必须从 127.0.0.1 改公网。
- 分工（用户已定）：部署/开发**交给其他人**（用户有 Linux 云主机 + 域名，云厂商待定）；BD 自己做 Partner Center 那几步；我维护产品 + 手册。
- 冒烟截图集（每次 UI 改动重生成）：`smoke-dashboard / kol-pool / kol-detail / outreach / cooperations / samples / auto-reply / templates / blacklist / billing / team / admin / products / messages / platform-creators .png`。
- 其他文档：`docs/PROJECT_MEMORY.md`、`docs/CLAUDE_CONTINUE.md`、`docs/TIKTOK_API_HANDOFF.md`、`docs/archive/*.full.md`、`README.md`（启动 + CSV 字段）、`DESIGN.md`（视觉规范）、`PRODUCT.md`（定位 + 边界）。

## G 老系统 tiktok-creator-tool（退役中；能力清单 = Compass 要补齐的参考）

- `D:\tiktok-creator-tool`：FastAPI + SQLAlchemy + SQLite + React/Antd + Vite，单租户，日常用了近 1 年，沉淀大量 edge case。占用端口 5173/5174。
- 数据（2026-06-23 snapshot）：`creators` 主库 **2,360**（2358 SG + 2 other），1,345 有 email、829 有 WA；`scraped_creators` 中转池 **79,494**（76,480 MY + 3,014 SG），只 ~3% 有 contact。
- 能力：Playwright 爬 affiliate.tiktok.com 拿 contact（email + WhatsApp）；IMAP poller 自动回复 + 10 层规则（bounce / OOO / mis-attribution / 拒绝复述 / AI 兜底）；WhatsApp Web mis-attribution 6 层防御；邮件 300/天 + WA 100/天硬上限、多 SenderAccount 池；Phone E.164 规范化；「待跟进」面板 + cross-product rejection 排除规则。
- 为什么退役：自营商家/单租户架构撑不住 SaaS 化。**不能整盘移植**（Compass 走 API + 多租户，这套走爬虫 + 单租户）。
- 核心规则：销量 < 50 一律不采集；未爬全信息的达人不可进主库 Creator 表；禁止 CSV 直灌主库；`.bat` 必须 CRLF + ASCII；重启 backend 用 `cmd /c start "" /B wscript //B vbs` 三层 detach，且只按 PID 精准杀。
- 邮件架构（2026-07-01 切换后）：域名 jasariellive.com MX = 100% Lark；3 个品牌 sender（NaturElan/Oxeagle/BioOrgan）SMTP 从 `smtp.gmail.com` 切到 **`smtp.larksuite.com:465`**，凭证复用 IMAP 密码；Lark 公共邮箱 450/天/邮箱（当前 daily_limit=300，安全）；BEME 仍从 `freyhuang19@gmail.com` 发，未切；Google Workspace 4 个品牌 user（bemesg/bioorgan/naturelan1/oxeagle1）计划停付/删除；回滚备份 `tiktok_creators.db.bak.smtp_switch_20260701_204356`。

## H 仓库使用节奏（2026-07-02 定的长期规矩）

- 私密仓库，不对外放任何信息；这个仓库**以 Claude 为中心**使用。
- 记忆持续保持最新，过时内容自动覆盖更新，时刻清楚当前待办 + 下一步。
- 最差情况：只要有变化，一天至少提交一次 GitHub + 更新一次记忆（每轮验收/收工就 commit）。
- 每轮同步更新 MEMORY 索引、`docs/CLAUDE_ACCEPTANCE.md`、`docs/BACKLOG.md`。
- Codex 也可能碰这仓库 → push 前留意分支冲突。

## I 已删除项（被现状推翻，按新规不留副本）

- **sandbox 时期全部结论**：「OAuth 只通到 sandbox」「授权店 `SANDBOX_VN7651055422359521044`」「平台库 = 60 个 VN 达人」「`.env.local` 是 sandbox key/secret、连不了真店」「备份 `.env.local.sandbox.bak`」→ 被 06-28 Custom App + 真实店 jasarielpicks 推翻。
- **过期库存量**：1918 / 2189(SG) / 425(VN) / 2575(全库) / ~2670 / SG 卡在 ~3448 → 被 07-02「SG 已采 1.7 万+」推翻。
- **过期代码体量**：`server.js` 973 行、`app.js` 3813 行 / ~180KB → R14–R18 之后早已不准。
- **「Messaging 发消息未接（推测端点 `/affiliate_seller/.../send-message`）」** → 实际已接 `createCreatorConversation` / `sendCreatorImMessage`（取带具体函数名的 golive 记录为准）。
- **「空查询连续翻页效率最高、类目分片重复率高」(06-30)** → 被 07-01 实测推翻（推荐池 page 280+ 全重复、有天花板；换词与推荐池 0 重合才是最优）。
- **旧采集器方案「靠无限滚动触发翻页」** → 已废弃重写为接口轮询（冻死教训保留在 current 数据坑）。
- **已完成/失效的排期与一次性约束**：业务流程「筛达人🚧在做 / 建联🚧在做」、给 Codex 的 Step 1/2/3 排期、「等老板答完剩下问题再让我生成提示词，不要提前生成」、「禁触 `D:\tiktok-creator-tool`」（已松绑，且 R14 已实际只读导入）。
- **以 Codex 为中心的协作描述**（Codex 是主开发、提示词要分步自包含、对 Codex UI 完成度的评价等）→ 被 07-02「仓库以 Claude 为中心」覆盖。
