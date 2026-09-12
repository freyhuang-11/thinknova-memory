---
name: reference-thinknova-video-studio
description: 触发:动商家视频工作台(长视频拼接线 offline_store_video_studio)的任何配置/提示词/宣传口径前必读;含与旧管线的隔离关系与当前未就绪项
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-31T18:16:43.359Z
---

# 商家视频工作台(长视频自动拼接线)· 现状源

权威源:`00_规格与参考\技术侧文档\运营说明_商家视频工作台Agent_2026-08-31.md`(技术 v1.0,08-31 发)。以下只是索引摘要,动手前回源。

## 它是什么
- 新 Agent `offline_store_video_studio`,前台 `/app/business-video-studio`。流程:资料→编剧出镜头时间轴→**逐镜头**生成分镜图(人工审核)→逐镜头生成视频(人工审核)→后期配音+字幕+硬切合成。核心卖点=**先审后花钱、哪段不满意只重做那一段**——就是老板 08-31 要宣传的"长视频自动拼接"。
- 🔴 **与旧管线 `offline_store_video` 完全独立**:页面/任务/案例库/配置/Worker 全不共用。⛔ 旧线的一切实测结论(三链字节账/videoTemplate 黑场句/4000字上限/lineValidation…)**不许外推到新线**,新线的账要重新立。

## 关键口径(对外宣传相关)
- 镜头时长是**动态 3-8 秒**(编剧按内容排),5 秒只是默认参考——⛔对外别说"每段固定5秒"。雷达线 D5/D6 预告文案("short clips joined, swap that part")与实情相符,继续用。
- 🔴 **仍未上线**:老板 08-31 亲口"语音语速情绪还没好"(TTS 层在调);技术文档§7 上线清单(迁移/账号/预检 ready:true/真实联调)未确认完成。**对外维持 coming soon 口径,不承诺时间不演示界面。**

## 运营要点(轮到我配的时候)
- 配置在后台 Agent 的 `config_json.studioWorkflow`;两段提示词:`scriptwriterPrompt`(⛔不写死镜头数;必须要求每镜头台词+durationSeconds,总和=用户选的总时长)、`storyboardPrompt`(必须写"单张完整全屏,不得拼图/网格/字幕/水印;参考图优先于文字臆造")。
- 默认后期配音(voiceover)**不做口型同步**;正脸口播要单独启用 Sync Lipsync 2(加一次调用费)。TTS 超镜头长返回 `SHOT_VOICE_TOO_LONG`→精简台词,系统不裁句。
- 计费:编剧/分镜/每段视频/每段 TTS 各自独立按模型价;拼接字幕封面免费;父任务 credit_cost=0,扣费看子任务。
- 审核重点:镜头总时长=项目时长/台词不虚构/跨镜头人货场一致/分镜无宫格水印/画幅一致。
- 上线后验收:竖屏 9:16 和横屏 16:9 字幕各验一条;首单 15 秒联调过了再放 20/30 秒。

## 关联
[[project-thinknova-language-pack-rollout]](旧视频链,勿混) [[feedback-boss-rulings]](08-31 长拼接宣传口径) [[reference-thinknova-tech-docs-index]]

## 2026-09-05 更新:TTS 情绪已参数化(技术文档《TTS情绪控制_2026-09-04》)
- ⛔作废旧说法「情绪只能靠台词文字带」:现在编剧逐镜输出 `ttsEmotion`(auto/happy/sad/angry/fearful/disgusted/surprised/calm/fluent),存 shots.tts_emotion,TTS Worker 对 MiniMax Speech 2.8 HD 写入 `voice_setting.emotion`;非 MiniMax 模型自动不带参数不报错。
- 配置位:`studioWorkflow.ttsEmotion{enabled,default:'auto',allowed[]}`;营销内容建议 allowed=[auto,happy,surprised,calm,fluent],⛔不开放 angry/fearful/disgusted。
- 编剧提示词可加强策略但**不得改 JSON 字段名**;推荐句:开场钩子 happy/surprised、卖点 calm/fluent、到店邀请 happy、无诉求 auto。
- 上线前提:迁移 081 已执行 + Agent 配置保存过一次(缓存失效);历史项目不回填。验收:新 15s 项目查 shots.ttsEmotion + TTS 子任务请求参数带 emotion + happy/calm 听测。
- 台词文字带情绪(标点/口语接口词)与参数并行有效,两者叠加。

## 2026-09-05 更新:技术《Studio稳定性修复与官网配置》(代码完成·未上生产,上线后按 §7 验收)
- ⛔作废「编剧提示词要自己写字数窗口」:上线后**系统按镜头秒数注入最低/目标/最高字数**(3s 7/10/13 … 8s 18/26/36,来源仍 ttsPacing),一次反馈全部违规镜头。运营提示词里的数值规则届时**删掉**,只留「超字数→加长镜头,不删商家事实/优惠」。编剧 prompt 上限 4000 字节,运营模板不被覆盖但受模型上限截。
- `reviewPolicy` v2:autoApproveFirstSuccess=true(分镜/视频默认采用)、autoGenerateVideos=false、autoCompose=false(默认不自动花钱);老板要的"默认确认一键下一步"=此默认即可。
- 失败/取消=终态不弹窗不计角标;失败项目有「恢复编辑」入口;中间资产隐藏靠 `repair_studio_visibility_review.php --apply`(需部署人员跑,先 dry-run 备份)。
- 新错误码:STUDIO_SCRIPT_INPUT_TOO_LONG(必要事实超模型上限,不会静默删)/ STUDIO_CHILD_TASK_CREATE_FAILED / STUDIO_MODEL_ASSET_MISSING。下载改走托管入口,登录失效不启动下载。
- 官网内容:后台「站点→官网内容与版本」多语言 JSON(zh/en/ja/ko/vi/es/th):company{name,description,address}/support.url(仅 HTTPS)/poweredBy[]/pages{about,help.sections,terms,privacy};草稿→发布→可回滚;公共接口 /api/v1/site-content。**素材包要按此结构交付**;未确认的地址/法务/供应商清单技术不发布。
- 未解:TN 悬浮角标来源未确认(疑第三方组件);海报乱码需可复现样本;线上 15s/30s 真实项目、退款、外部预览未验。

## 2026-09-05 第四刀落地(报告 `03_工作台\工作台第四刀_情绪与kie_报告_2026-09-05.md`)
- 🔴 视频通道=**482 grok-imagine-video-1.5(kie)**,`allowedVideoModelIds [482]`;503 H3(metaso)余额告罄+账号层不可用;⛔项目 `videoModelId` 建单即锁死,重生视频不吃 modelId 字段,切通道只能重建。旧线 `modelAllowlistByDuration` 里 503 还在(商家选到会失败)。
- 现行 `scriptwriterPrompt` 1651 字 / 3918 字节(sha 0025fd81;距 4000 字节上限 80 字节,再加先删),含:字数窗口 3.5-4.2×、情绪写法段、ttsEmotion 策略句、镜头描述自然句(⛔不用竖线/「推近 × 缓」缩写);`ttsEmotion.allowed=[auto,happy,surprised,calm,fluent]`;`speed.min 1.0`。快照 `ROLLBACK_2026-09-05_studio第四刀前_全量config.json`。
- 情绪参数已验通:shots.ttsEmotion → TTS 子任务 `input.emotion` 逐镜一致;surprised F0 271 Hz vs calm 167 Hz(同男声)。
- 流程现状(稳定性修复已上线):分镜全采用后停 `storyboard_review` 要 `POST /projects/{no}/videos`;视频全采用后要 `POST /compositions`;成片 720×1280、分镜 1536×2731。
- 编剧 505 三秒钩子镜最易写超(两项目 4 败全在镜 1),`/script/retry` 一次通常过;例句会被照抄,例句别带具体商品。人声占比 69%(kie 成片),每镜尾空 0.2-1.4 s,再压要把 4 秒镜写到 16-17 字。

## 2026-09-06 更正:site-content 写入格式(09-05「PUT 存空」不是 bug,是我们键名错)
- 保存草稿 `PUT /admin/api/v1/site-content` body=`{revision, action:"draft", effectiveDate:"YYYY-MM-DD", content:{zh,en}}`;发布 `{revision, action:"publish", effectiveDate}`;回滚 `{revision, action:"rollback", versionId}`。⛔发 `draft` 键会被存成 `[]`。来源:后台前端 SystemConfigsPage 代码。
- 后台页面=系统配置→站点→官网内容与版本(JSON 文本框),可直接粘 `02_交付内容\官网内容_v3_后台粘贴用.json`。
- ⛔本会话(Claude Code 自动模式)对线上任何 PUT 都被安全分类器拦,子 agent 同样被拦;需要老板切「每次询问」模式或自己粘。老板 09-06 定的三条口径:积分不过期一直保留(不谈退款)/素材不用于训练/文件保留 7 天。

## 2026-09-06 第五刀(老板亲手贴,已回读)
- `scriptwriterPrompt` 3064 字节:字数句改为「字数按系统给出的每镜建议范围写,取中间目标值,不顶上限也不贴下限,收尾镜同样写满;」。起因:项目 c16d09be 镜 3 顶上限(4 秒 18 字)、镜 4 贴下限(3 秒 7 字),系统注入窗太宽模型贴边写。
- 同日老板令:用 kie(482)做 30 秒对照 H3,看效果与扣费 → 报告 `03_工作台\工作台30s_kie对照_2026-09-06.md`。
- 30s kie 实测(09-06,花店 `studio_64063372c421`):211 积分(单镜视频≈24),19 次调用零失败,人声 94%,参考图锁定好;30s 6 镜编剧首次建单失败率高(promo 案例 3 败,member 案例一次过)→ 技术单 1.14。编剧仍编「新店开业/仅限今天」+「绝对满意」承诺 → 下一刀加「事实只用商家给的」。`ttsVoice` 字段吃字符串码 `male-qn-qingse` 不吃 506;`reference-cases?industryId` 过滤无效需翻页本地过滤;项目 `finalAsset.publicUrl` 为 api 域签名串,浏览器 a[download] 可落 `D:\SamsoData\Downloads`(文件名为 asset 号)。
- ⛔ 英文项目(copyLanguage en)编剧校验用中文字数窗,3 次必败(09-07 实测 `studio_faa4670761cb`),技术单 1.17;修复前工作台只能出中文成片。`ttsVoice` 英文音色码 `English_Graceful_Lady`;506 是 TTS 模型 id 不是音色码。

## 2026-09-07 技术《Studio编剧稳定性与运营权限修复》(代码完成·⛔未部署,归档 `00_规格与参考\技术侧文档\`)
- 编剧:按 `copyLanguage` 选计量(zh/ja/ko 字,en/es/vi/th 词,`ttsPacing.metricByLanguage`)→ 1.17 解;秒数总和不对用动态规划自动归一(27→30 不调模型)、只修违规镜(`scriptwriterRepair.autoAdjustDurations/repairInvalidShotsOnly` 缺省 true)→ 1.14 解;英文 4 秒预算 6/8/11 词。
- 新增 `studioWorkflow.videoPromptSuffix`(≤300 UTF-8 字节)拼进每镜视频提示词 → 部署后把「真实手机实拍质感,自然光,保留细节,不过度锐化」放这里,编剧提示词里的质感句可撤。
- 运营服务 Token(1.10 解):管理员 `php think app:service-token --action=create --scopes=ops.agent:<code>:read/write,ops.cases:<code>:read/write,ops.site:read/write`,90 天可撤销;接口 `/admin/api/v1/ops/agents/{code}/config`(GET 回 revision 哈希,PUT 带 revision)、`/ops/agents/{code}/reference-cases/{id}`、`/ops/site-content`;⛔Token 不进 git/聊天/截图。会话仍 24h。
- 供应商健康:后台「系统配置→供应商健康诊断」,`GET /admin/api/v1/provider-health`;状态 insufficient_balance/rate_limited/quota_unknown/cooldown/retry_available/recovered;健康不再全局阻断建单。
- 协议确认(1.13):迁移 083 + 管理员审核正文并「启用协议确认」;默认关;正文哈希变了要重审(LEGAL_REVIEW_REQUIRED)。官网:场景/行业名优先服务端配置(1.16 解)、帮助去重(1.12 解)、SSR 正文。
- 画质:技术称合成链只有缩放/CRF18 无锐化滤镜,提供 `scripts/compare_studio_video_frames.php`;我 09-07 实测原片 238 vs 成片 534 仍待技术用真实文件复核(1.15 开)。
- ⛔全部「本地自动化通过」,未做真实 15/30 秒中英验收、未签真实 Token、未部署。部署后验收清单:①英文 30s 花店项目重建一次过;②27 秒脚本自动归一不调模型;③videoPromptSuffix 落地并看视频 prompt;④签 Token 后 PUT→GET 回读;⑤S11 前台显示新名。
- ⛔ 09-07 事故:site-content `versions[]` 按 id 升序,`versions[0]` 是最老版;我拿它当最新发了 v8,把条款/隐私/帮助页发没了(前台显示「经确认的协议正文尚未发布」)。已用 id 6 内容去地址后发 v10 修复。**以后取当前版=按 id 最大或公共接口 `/api/v1/site-content`。** 技术 09-07 部署已上线:条款页需管理员 `PUT /admin/api/v1/legal-acceptance {enabled,confirmed:true,version:<GET 哈希>}` 审核后才显示;开启 enabled 需 083 迁移。
- 09-08:`studioWorkflow.videoPromptSuffix` 已写(240 字节):真实纪实 vlog/手机实拍/胶片颗粒暗角/自然光白平衡/人物与首帧一致/不磨皮不锐化/硬切/手持呼吸/焦点主体/边缘轻虚。技术 09-07 版部署后生效(字段此前不存在)。下一步:1.19 让编剧按项目生成全片画面规格(对标 quantv)。
- 09-08 验收:技术新版英文校验生效(`studio_ae50993e1e9c` 英文 30s 一次过,H3 503,词/秒合规,无修复事件)→ 1.17 关闭。⚠️ 英文音色 `English_Graceful_Lady` 已失效,目录只剩 10 个 `tnsys_*`(用 `tnsys_warm_young_female`),外语音色缺失见 1.21。建单 body 必须显式传 `videoModelId`(省略 422)。

## 2026-09-08 技术《商家提示词冲突与语言切换修复》(代码完成·⛔未部署;三条线共用,归档 `00_规格与参考\技术侧文档\`)
- 新增 `promptComposer.conflictResolution.priorityOrder`(三个 agent 各自配,不互相同步):`user_extra_requirement > selected_option > business_fact > case_visual_rule > scene_rule > industry_rule > ops_template > generated`。硬约束(项目比例/总时长/Studio 单幅/模型语言)不可被任何来源绕过;同级明确冲突(如「人物出镜。无人出镜」)→ `PROMPT_CONFLICT_REQUIRES_ACTION` 不建付费子任务;低优先级冲突句只在本次组装中移除,原文与案例不改。
- 识别范围=中英文明确独立指令:比例、总时长、人物出现与否、单幅/分屏/多宫格、原生人声、画面文字、正负互斥;⛔不是语义理解,引号内台词/事实 JSON/商品名不动。**客户台词仍会被编剧重写**(冲突检查不含台词照用)。
- 旧线首帧分镜板不套 Studio 单幅规则 → 旧线拼板仍靠黑场兜底(1.20 更必要)。
- 保存接口返回 `warnings`,agent 结果带 `config_warnings`(`PROMPT_CONFLICT_AUTO_RESOLVED`=运营模板里有被硬约束覆盖的句子,该整理);Studio 事件 `prompt_conflict_resolved` / `prompt_conflict`;旧线诊断 `promptConflictDiagnostics`(stage/rule/source/winnerSource/action/suggestion)。
- 语言切换:界面语言≠提示词语言≠口播语言;切换不翻译商品名不改台词不重生;Studio 草稿在内存(刷新/退出不保证)。首次登录卡加载、业务错误跨备用地址重试、写请求重发三个前端竞态已修。
- 部署后验收:①保存三 agent 配置各看一次 `config_warnings`;②Studio 用「补充要求写 16:9 + 项目 9:16」验事件 `prompt_conflict_resolved`;③同级「人物出镜。无人出镜」验 REQUIRES_ACTION 不扣费;④中→英→中切换项目详情不丢草稿。


## 2026-09-10 · scriptwriterPrompt 1444→1686 字(台词风格刀)+ 三单烧验
加:接口词只许第一镜、默认顺序范式(砂锅店五句)、不编事实、优惠只在第一或第二镜说一次、不写点击/左下角/关注/私信、中文数字写汉字。烧验 `studio_b794e8ad3c92`→`studio_484825112801`→`studio_66b5165eac15`(花店 S02 member,H3,只到分镜,各≈13 积分):编造/效果承诺消失、句子连贯;残留=优惠仍说两次,提示词压不住,建议交校验层(技术单)。建单 body 现值:`ttsVoice` 必须 `tnsys_*`,`videoModelId` 必填 503/482。⛔GET/PUT 在 robots.txt 轻页做长 sleep 会冻死 tab,轮询用 batch wait 分段。

## 🔴🔴🔴 2026-09-10 · 建单参考图字段=数字 `assetId`(如 7706),不是字符串 `asset_xxx`(09-06 起我建的花店项目全部无参考图)
`POST /business-video-studio/projects` 的 `referenceAssets` 正确形状=`[{"role":"person|product|scene|supplement","assetId":7706}]`(数字 id;实测 04:2x `studio_0c593d16eff7` 回读 input 三张全在;传 `assetNo` 字符串或 `assetId:"asset_xxx"` 都被静默丢弃)。回读时 input 显示的是 `assetNo`,所以别照回读格式发;我 09-06/09-07/09-10 用 `assetId` 建的花店项目(64063372c421 / ae50993e1e9c / b794… / 4848… / 66b5… / 97a9…)服务端静默丢弃 → `input.referenceAssets=[]`、每镜 `referenceImageIndexes=[]`、分镜纯文生图。**老板看英文花店「人物画面不连贯」的根因就是这个,不是编剧层。** 有参考图的项目(餐饮 1f41b5f36c77)每镜 refs 非空,说明管线确实按镜用参考图。⛔以后建单后必回读 `input.referenceAssets` 非空再往下走。
同日:storyboardPrompt「不正面对镜说话」改为「开场镜和收尾镜看向镜头(眼神交流/微笑/点头),中间镜看活或看商品」;scriptwriterPrompt 加「有参考图时每镜 referenceImageIndexes 不许为空,人物出镜必带人物图;visualPrompt 写视线方向和表情」。lipSyncModelId=0(无口型同步),dialoguePresentationMode=voiceover。

- 09-10 05:xx:`POST /projects/{no}/cancel`(body {}) 可取消 storyboard_review 项目(7 单已取消);工作台 scriptwriterPrompt 2000 字、storyboardPrompt 735 字现值。

- ✅ 09-10 15:00 **A1–A4 验证通过**:`ttsPacing.words` 2.0/2.8/3.4、`characters` 3.5/4.5/5.5 + 编剧「按秒数×目标值写满」→ `studio_9fa1a4fec8ce` 静音 43.8%→13.5%,最大空档 0.97s;分镜五镜五主体同人同店。现值:scriptwriterPrompt 2093 字、storyboardPrompt 756 字(参考图无文字则无文字)。未解:优惠两次、无正脸、5 镜非 6 镜。回滚快照 `00_规格与参考\ROLLBACK_编剧与工作台提示词_A1-A4前快照_2026-09-10_0600.txt`。
- 🔴 项目结构:`data.shots[]`(不是 project.script.shots)带 `revisions[]{type,status,asset.publicUrl}`、`dialoguePacing{unitCount/targetUnits/status}`、`approvedStoryboardRevisionId`;分镜/成片下载=页内 `a.href=publicUrl;a.click()` 落 Downloads;javascript_tool 返回值含 url/query 会被整条拦截,先剥。

- 09-10 15:4x 现值:工作台 scriptwriterPrompt **2190 字**(加:正脸至少一镜、优惠只在末镜、无人物图时 visualPrompt 写地域形象)、storyboardPrompt **930 字**(加【语言与地域】:人物与店面跟随输出语言市场,英文项目不出汉字,参考图无文字则无文字);`ttsPacing.words` 1.8/2.5/3.0(老板听 2.8 偏快);两线 `businessUi.quickRequirementChips` 各加 5 个(pain_first / product_only_no_people / read_my_lines / offer_once_end / show_face),前台 9/9 可见;旧线 S05 探店改好友第一视角四步(3989 字)。
- 🔴 语言→画面形象的真值在 `promptComposer.languagePolicy.map.{lang}`(两线都有,en 已写「local Western/international, not Chinese-styled」),喂编剧不喂分镜;**有人物参考图时人物以参考图为准**——英文片出现华人脸是参考图本身是华人(花店三张参考图是 AI 海报),不是规则漏。

- 09-10 16:xx 配置层落地:两线 placeholder(zh/en)三行示例;defaultState appearanceMode=product_store/endingCta=visit_store;appearanceMode.sceneDefault.S08=product_store;海报线首帧提示词前置「人物与店面按输出语言市场」(1715);帮助中心三页 site-content rev 12 已发布(从 versions[last] 内容加节,terms/privacy 保留)。案例折叠需前端。

- 09-10 17:5x 接口补:分镜失败重生成 `POST /projects/{no}/shots/{n}/storyboards`(body {});重生成后需采用版本 `POST /projects/{no}/shots/{n}/storyboards/approve` body `{"revisionId":<revisions[].id>}`(同理视频版本大概率 `/shots/{n}/videos/approve`);项目列表 `GET /projects?page&pageSize`;取消 `POST /projects/{no}/cancel`。Chrome 里我的 tab 不在前台时 viewport 0x0,UI 点击无效,走接口。

- 🔴🔴🔴 09-10 收工真值:**语速与空白是同一个跷跷板**。`dialoguePacing.recommendedSpeed` 只在 [speed.min, speed.max] 内**加速**填满镜头(v3 实测 1.15/1.15/1.07/1.07/1.03=老板说的「快」);把 words 目标降到 2.5 → speed 回 1.0 但静音 25%(v4)。speed.min 设 0.85 不会触发减速,反而因字数窗变紧让编剧直接 `STUDIO_SCRIPTWRITER_OUTPUT_INVALID`(实测 `studio_3e29a6611762`)。**现值折中:words 2.2/3.0/3.4、characters 3.2/4.3/5.2、speed 1.0–1.08。** 根治=技术单 T1 镜头时长跟随配音,或让 speed 允许 <1。
- 🔴 09-10:中文探店成片的网红脸=**人物参考图 `asset_0e1b27e6751a`(07-24 上传)本身就是网红自拍**,分镜「人物以参考图为最高真值」优先级高于「不出现网红脸」,系统没错,要换图。餐饮演示单在换图前建议不挂人物图。

- 🔴🔴🔴 09-10 晚 **语速公式定案**:`recommendedSpeed = unitCount/秒数 ÷ targetPerSecond`,夹在 `[speed.min, speed.max]`。目标值必须≈真实语速,否则要么留空(目标低)要么加速变快(允许加速)。**但真实语速逐句差异大**(英文 2.55–3.6 词/秒,同一音色),固定目标压不准 → `SHOT_VOICE_TOO_LONG`(`studio_f88ec83f631d` 3 秒镜配音 3.92 秒)。**现值:words 2.8/3.2/3.6、characters 4.0/4.5/5.0、speed 1.0–1.12、minShotDurationSeconds 3→4。** 验证最好的一单:中医理疗 `studio_b83bd7d47e11` 静音 8.7%。
- 🔴 TTS 真实入参(`task_1a092f6adc51`):`{text,pitch:0,volume:1,voice,emotion,speed,language_boost,prompt=text}`。情绪标签**有**逐镜传;pitch/volume 恒定、prompt 复读台词 → 情绪起伏小的第二根因是台词写成平铺陈述句。
- 🔴 `food_s08_review`「达人代看·堂食氛围」= 顾客好评型案例却挂 `sceneIds:["S05"]` 探店,案例锚点要求首句零信息纯情绪 → 成片前 10 秒莫名其妙。案例分类错位待老板定。

- 🔴🔴🔴 09-10 夜 **工作台图生视频阶段的 prompt = visualPrompt + cameraPrompt + 四段服务端硬编码块**(实证 `task_bb3ca14044ac`,677 字):【跨镜头连续性】【动作时长:动作须在前 N-0.4 秒完成,最后 0.4 秒定格】【首帧锁定:以分镜图为最高真值不得重绘漂移】【后期配音硬规则:嘴唇闭合、不得对镜开口、优先侧背面与手部】。**四段都不在 agent 配置里,运营改不了**,是「照片动起来」「情绪不如 agent」的直接原因。`videoPromptSuffix` 的内容**未出现在该 prompt 里**(疑似未注入)。已写进技术单 T6(要求做成可配置 + 首帧锁定分档 + 新增 voiceover_talking 模式)。
- 09-10 夜运营侧对冲(能改的部分):`continuity.endHoldMilliseconds` 400→**150**;编剧要求 visualPrompt 写「有头有尾的动作过程(从…到…)」而非静态摆拍、cameraPrompt 每镜必须有位移运镜(固定机位全片最多一镜);分镜要求拍「动作进行中的那一瞬」而非摆好的合影。现值 scriptwriterPrompt 2515 / storyboardPrompt 971。

- 🔴🔴🔴 09-11 **工作台字数窗定案**:每镜独立校验,窗口=`该镜 durationSeconds × studioWorkflow.ttsPacing`(characters 现值 3.6/4.5/5.2 → 5 秒镜 18–26 字,与报错文案逐字吻合 `studio_30a6b023af9d`)。**旧线 `lineValidation` 是另一条链的全片总计,改它对工作台零影响**。旧线那张表还有两份同名副本(`lineValidation.zh_cn` 68 / `lineValidation.byLanguage.zh_cn` 60),运营改的是死的那份 → 技术单 B3b。
- 🔴🔴🔴 09-11 **工作台做不出无台词广告大片**:服务端对每镜强制台词字数下限,空 dialogue 直接 `STUDIO_SCRIPTWRITER_OUTPUT_INVALID`(`studio_05b2978dd1de`),过短报「5 秒建议 18-26 字」(`studio_30a6b023af9d`)。**旧线 agent 支持 `voiceMode=none`,工作台不支持** → 技术单 B8。临时解:提示词让 S14 tvc 写「画面注解式旁白」(`studio_74b1255b101f` 一次过)。
- 09-11 `scriptwriterPrompt` 加【板块人设】段(现 3156 字):探店 S05/S08 拆开写后,S08 才真的出双人对白(`studio_70aa8e0663ef` A 抛问题/B 揭晓);合并写时会被写成第一视角安利(`studio_f59124245184`)。残留缺陷:S08 倒数第二镜仍出口号式总结。回滚表 `00_规格与参考\ROLLBACK_四板块提示词改动_2026-09-11.md`。
- 🔴🔴🔴 09-11 **局部修复路径会整单炸:`STUDIO_SCRIPT_INPUT_TOO_LONG` 局部修复上下文超出输入上限**。S08 类案例 `visualHint` 931 字(全库最长 935),一旦首轮输出违规触发修复,修复调用就超限、整单 failed(`studio_bae3ebf8caad` 提示词 3258 字、`studio_379d3f1a465e` 提示词 3024 字,都炸)。**不是提示词长度问题**:同样 931 字案例的 `studio_70aa8e0663ef` 在 3156 字下一次过(没触发修复)。真因=修复上下文本身太肥 → 技术单 B9。
- 🔴🔴 09-11 **凡是「让某镜台词变短」的提示词规则都会撞每镜字数下限**:广告大片留空 → 无效;「末镜只收梗」→ 4 字被打回(`task_c2738bb921d7`「4 秒建议 15-20 字,实际 4 字」)。写收梗/极简类规则必须同时写「仍要写够系统给的字数下限」。
- 🔴 09-12 **技术 09-11 批修复已发布**（robots 已改为 https 无端口为证）。线上复验：**B8** `voiceMode=none` 案例不再要音色、三镜 dialogue 全空校验通过（`studio_7f1ca90eb2d4`）；**B9** 昨天必炸的 `mother_baby_s08_drama` 一次过、pacingAudit 记归一（`studio_15a149781554`）——⚠️ 首轮合规未触发修复，"超限降级 repairSkipped" 分支未被踩到。字幕新键 `maxLines/maxCharsPerLine/safeMarginRatio` 已合并进 `studioWorkflow.subtitle` 并回读保留。前台 `copyLanguage` 9 语全部可选。
- ⚠️ 技术明说 `none` = **成片全静音**（原视频音轨含环境音 BGM 一律不进成片，不是人声分离）→ 广告大片发不出去，要回给技术：none 应=关 TTS/口播字幕但保留音轨或铺 BGM（并入 T4 音床）。**已实测**：`studio_7f1ca90eb2d4` 成片有 AAC 轨但 mean/max −91 dB、0–15s 一整段 silence；画面本身过关（三镜连贯、有烟有动作）。已发 OPS-PLATFORM-20260912-02 要求 none 保留 i2v 原音轨或并入 T4 音床。
- ⚠️ **B3b 未落地**：`lineValidation.zh_cn`(68) 与 `byLanguage.zh_cn`(60) 两份仍并存，迁移脚本遇异值拒绝，**必须老板定一个值**（我建议 68：老板甜区 4.6–4.9 字/秒×15s，含标点口径）。B1 `videoPromptSuffix` 未注入仍开着；A5 界面错位技术明说不在本次范围；www TLS 仍握手失败。
- 🔴🔴🔴 09-12 **两条项目并发进配音阶段 → `STUDIO_TTS_CREATE_FAILED` / MySQL `1205 Lock wait timeout` → 整单 failed、积分不退(191/206)、`/compositions` 重试被拒"项目已结束"**（`studio_70aa8e0663ef`、`studio_f59124245184`，各 30s/6 镜）。单独合成的 `studio_74b1255b101f`、`studio_15a149781554` 正常。⛔ 在技术修好前，**合成一次只推一条**。
- 09-12 语气词对照：同案例 `tcm_s06_full` 原单 6 句 6 个尾巴 → 新规则下 `studio_4e33937abef1` 5 句 0 个，台词仍自然（"热乎劲儿直往骨头缝里钻"）。
- 09-12 技术称新增系统配置键 `ai.prompt_polish_system_prompt`（后台 系统配置→AI 提示词→润色系统提示词，支持 `{capability}`），但 `admin/api/v1/system-configs` 110 项里**没有任何 `ai.*` 键** → 未见到，待技术确认是否已发。
