---
name: reference-thinknova-tech-docs-index
description: "触发:要动任何 config 字段的第 0 步 → 按此表定位官方原文档 + 拉线上真实 config 回读核对,记忆只是索引不是真值"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-28T19:33:38.669Z
---

🔴🔴 **铁律:这些技术官方文档=唯一真值。我的其它记忆是索引和实测增量,不能替代文档、更不能盖掉文档。动任何 config 字段前:①按下表翻对应原文档 ②拉线上真实 config 回读核对字段路径 ③再动。** 之前反复出错的根因=我把自己漂移/污染的记忆当真值,没回文档核(技术:「那么多文档你没好好看过」,2026-07-24 老板转达)。

**文档位置**:`D:\xwechat_files\wxid_5aowhntcmaoh12_6db1\msg\file\2026-07\`(老板微信收的技术文档;老板每次发新的当天归档,见 [[reference-prompt-library]])。

## 🔴 口径速查(最常被我记错的三条,2026-07-29 逐字回源核过)
1. **`i2vReferenceStrategy` 默认值 = `panel_crop`**,文档原话「**这是默认且推荐的方式**」(手册 v4 §3.5)。`storyboard_board` 有硬门槛:「**只建议对已验证不会把网格生成进成片的模型使用**」。→ grok 415(无网格率仅 ~75%)**不该用整板**;omni 460(100% 零网格)可以。
2. **该字段案例级可配且优先于全局**:`businessUi.referenceCases[].i2vReferenceStrategy` > `promptComposer.masterPipeline.i2vReferenceStrategy`,案例不填才回落(07-28 文档 §5)。**不是全局一刀切。**
3. **案例级只有 `i2vReferenceStrategy` 一个字段**;`deliveryPostProcess`(`entranceBlackOverlay`/`coverFrame`)只有 **Agent 全局** `promptComposer.masterPipeline` 这一处(手册 v4 §3.5)。

## 档案索引(按管的东西找)

| 文档 | 日期 | 管什么 | 关键事实 |
|---|---|---|---|
| **配置JSON说明书(1)** | 07-08 | config_json 全结构(权威) | 顶层=`pricingSchema`+`promptAssembler`+`businessUi`;可改=label/title/description/visualHint 等文案;**不可改键名**=id/value/sceneId/industryId;安全规则=先备份/小步改/改完刷新验 |
| **编剧输出与提示词拼装_运营说明** | 07-09 v2 | 编剧输出JSON+拼装 | 编剧输出5字段=concept/firstFrameCell/boardCells/cells/lines;**台词只进视频(cells[].line→videoPrompt)不进板;lines只做字数校验不进prompt**;config键=`systemPrompt`/`staticTemplates.{firstFrameTemplate,videoTemplate,outputContract}` |
| **编剧输出与提示词拼装规格_开发任务** | 07-09 | 上条的代码实现 | cells=对象数组(position/timeRange/shot/visual/voice/line/sfx/move);`{{cells}}`逐子格渲染;代码文件 `OfflineStoreContentService.php` |
| **自定义图标链接** | 07-11 | 行业卡图标 | `businessUi.industryFilters[].iconUrl`(+保留iconKey兜底);只影响展示;**误改id/结构会导致"行业消失"→恢复备份** |
| **offline-store-video 3问题+多参考图计划** | 07-12 | i2v多图/custom行业/能力页 | 🔴**4096 UTF-8字节保护在编剧阶段+worker派发阶段都做,超限裁"静态/修饰性前缀"、保参考图锁定+时长+精确台词+分镜guard**;custom行业执行时回退`life_service`;grok1.5=image_to_video;`optionArbitration`:appearanceMode独占人物出镜/visualFocus控构图/videoStyle主风格/paceLevel控语速台词长 |
| **Pricing JSON 定价说明书** | 07-14 v1 | 价格 | 🔴价格**只在`pricing_json`不在config_json**;`poster_service_fee`/`video_service_fee.{10,15}`;模型价在`ai_models.credit_price`/`duration_credit_prices`别复制;最终价=服务费+实际模型费;后端快照为准 |
| **编剧多语言与回退配置** | 07-19 | 多语言字数+回退 | 路径`promptComposer.masterPipeline.scriptwriter`;`lineValidation`(zh字符60-75/en词25-40…)+`fallbackPolicy`(mode=ambient_only无口播/allowCta=false);清理旧"只允许中文/60-75"硬编码 |
| **提示词模板保存与主体仲裁** | 07-20 | 首帧模板+主体仲裁 | 🔴**`promptComposer.opsEditable.taskGoal.firstFrame`(首帧主模板)/`subjectDefinition.firstFrame`(全局主体仲裁)=运营可编辑真值**;`blockTemplates.*`=自动编译的镜像**手改会被还原(不是保存失败)**;firstFrame整段覆盖需先复制原文;案例差异写案例visualHint |
| **失败提示与编剧回退镜头模板** | 07-21 | 失败文案+回退分镜 | 商家端失败显示中文可行动提示(不露Provider task failed);`fallbackPolicy.visualTemplates.{product_only,no_person,default}`各5格;product_only/no_person每格必写"不出现人物";只改Config JSON别碰Pricing |
| **前台场景过滤与补充要求说明** | 07-23 | 空场景隐藏+placeholder | `businessActions[].visibleIndustries`(空数组=全行业可见);补充要求placeholder新文案;详见 [[project-thinknova-dingdian-koubao]] |
| **运营提交技术需求文档规范与模板** | 07-23 | 给技术的卡格式 | 9段结构,已存 [[reference-tech-doc-submission-spec]] |
| 🆕🆕**商家视频案例预设与分镜配置运营说明** | 07-26 | 案例预设回填+可变段数+无台词(=OPS-20260726-01 三件套发货) | 🔴**案例级 `scriptwriterPreset:{shotCount:1-7, voiceMode:dialogue|none}`**(超范围保存被拒);全局默认 `promptComposer.masterPipeline.scriptwriter.timeline.{defaultShotCount:5,minShotCount:1,maxShotCount:7}`;**预设回填已修**(选案例自动回填核心设置,手动改不被覆盖,换案例才重回填);优先级=案例scriptwriterPreset>Agent timeline>系统默认5+dialogue;🔴**前台不向用户展示「镜头段数」和「是否口播」选择器**(§4),两值只由案例+Agent 配置控制;🔴**边界:shotCount只控编剧时间轴,分镜板仍3列×2行5个boardCells不变、时长/模型/参考图/计费不变、30秒是独立产品别把shotCount填30**;voiceMode=none不生成台词字幕时间轴(环境音靠模型不保证);模板示例含新preset值 cinematic_showcase/product_detail/dynamic(是否已加进选项组待线上核);验收=编剧cells数=shotCount、none时lines空;FAQ:预设用稳定value别用中文、不可见选项不回填 |
| 🆕🆕**运营手册_商家Agent后台配置 v1.0** | 07-24(2026-07-27收到完整版) | 四配置位+新增3.5分镜首图与成片后处理 | 🔴🔴 §3.5 分镜首图与成片后处理,位置 `promptComposer.masterPipeline`:`i2vReferenceStrategy`= **`panel_crop`(原文「**这是默认且推荐的方式**」:裁分镜板首格当 i2v 主参考,多参模型再附完整板)/ `storyboard_board`(整板直接当主参考、不裁格、**也不重复提交同一张图**;原文「**只建议对已验证不会把网格生成进成片的模型使用**」)**。→ 我们的 grok 415 未过此门槛,口播案例应走 panel_crop;线上全局却设成 storyboard_board = 偏离项。🔴**成片后处理(`deliveryPostProcess`,只有 Agent 全局、无案例级)**:`deliveryPostProcess.entranceBlackOverlay{enabled:true,seconds:0.3}`——**不裁切、不改动原视频时间线和音轨,只在成片开头 seconds 内叠加黑色遮罩并淡出**(取代旧 `headReplacement` 的"裁掉前N秒换黑屏";旧配置仍可读但按新方式执行),默认0.3秒、缺省启用;`coverFrame{enabled:true,position:middle,format:jpg}`=处理后成片中间帧提封面上传OSS写缩略图,缺省启用;两个 enabled 都设 false 即关闭后处理,不影响生成和计费。<br>🔴 `videoGeneration.modelAllowlistByDuration`/`defaultModelByDuration` 是**对象**(键=时长字符串,值=模型ID/数组),不是数组;`defaultVideoModelId` 只是"没配按时长默认"时的兜底。文档示例出现**模型ID 480**(我没见过,待查)。`allowedDurations` 可配 **5~30秒**(不只10/12/15),但模型能力JSON没声明的时长前台不显示。⚠️ 同文档 §9「变更边界」还留着一句"开放 10/15 秒以外的新视频时长需技术" = **被 §3.3 和 07-28 文档覆盖的旧表述,以 5~30 运营可配为准**。<br>🔴 默认模型分两个:`defaultTextToImageModelId`(用户没传参考图)vs `defaultImageModelId`(传了参考图);编剧文本模型在 `masterPipeline.scriptwriter.textModel.modelId`。<br>🔴 **运营可维护清单含 `promptComposer.stagePromptPresets`(文生图/图生图/图生视频三阶段静态提示词)** ← 改生图层提示词的正门。还含 opsEditable/subtitle/videoGeneration/industryFilters/businessActions/detailOptionGroups/industryOptionPresets/defaultState。<br>字幕:`promptComposer.subtitle`,编剧存字幕时间轴、原片不烧录、用户成片页自选生成带字幕副本。<br>后台有**「配置变更历史」+快照比对**;保存后必点「重新从服务端读取」验证未被 schema 归一化删除。<br>案例封面走上传(≤12MB,JPEG/PNG/WebP),别手拼OSS链接;重复案例ID会被拒绝不静默覆盖。 |
| 🆕🆕🆕**运营说明_商家视频时长模型与案例首帧策略 v1.0** | **07-28**(老板当天发) | 时长/模型三层优先级 + **案例级首帧策略** | 归档:`00_规格与参考\运营说明_商家视频时长模型与案例首帧策略_2026-07-28.md`。适用 Agent = **`offline_store_video`(商家视频)**;`offline_store_content` 是商家海报,本文档不适用(手册 v4 §1 已明确两个 code 的分工)。<br>🔴🔴 **`i2vReferenceStrategy` 不再只是全局开关 —— 案例级可配**:`businessUi.referenceCases[].i2vReferenceStrategy`(外部案例库模式改案例表 `payload_json`),**案例级 > Agent 全局 `promptComposer.masterPipeline.i2vReferenceStrategy`**;不填才用全局。只影响商家视频流,不影响海报/独立能力页。<br>🔴 **三层优先级**:①场景级首选模型(锁死,前台连时长和模型选择框都不显示,后端强制不可绕过)②Agent 可选时长×模型白名单 ③Agent 全局首帧策略。<br>🔴 **场景锁模型**:`businessUi.businessActions[].preferredVideoModelId`(+可选 `preferredVideoDurationSeconds`,**不建议填**,优先维护模型能力 JSON 的默认时长)。**该模型必须同时在本 Agent 时长-模型白名单内、且其默认时长在可选时长里,否则锁定失效静默回退用户选择。**<br>🔴 **时长**:`businessUi.videoGeneration.{allowedDurations, modelAllowlistByDuration}`,可配 **5~30 秒**,不再固定 10/15;模型必须在能力 JSON 声明支持该时长才会出现在该时长下;同 `model_code` 多条记录前台只展示默认或权重最高的一条;**保存 Agent 立即生效,无需发布**。<br>🔴 **模型能力 JSON**:`constraints.{durations, defaultDurationSeconds, maxReferenceImages}`;**默认时长由模型自己定,前台不再强行优先 15 秒**。<br>🔴🔴 **多参规则(直接解释我的"参考图没进 i2v")**:提交几张由**所选模型的 maxReferenceImages** 决定 —— **只支持 1 张的模型(grok 415)= 永远只提交主首帧图,用户上传的人物/场景/产品图 100% 送不进去,这是设计如此不是 bug**;≥2 张才按剩余名额加完整分镜板 + 用户上传图;不凑数。文档明说「模型是否真正锁人物/构图/分镜顺序仍取决于供应商能力,配置只能决定提交什么和顺序」。<br>🔴 **任务创建时冻结模型/时长/案例策略,改配置只影响新任务,旧任务不重写。**<br>验收:新建一条测试任务,在任务详情核对模型ID/时长/**`_i2v_reference_strategy`**/参考图数量。<br>FAQ:配了不裁格仍裁格 → 查案例来源 `external_table`(改案例表 payload_json)/`inline`(改 Config JSON)/`hybrid`(同ID内联覆盖外部表)。 |
| **运营手册_商家Agent后台配置(旧摘要)** | 07-24 | 后台四配置位+案例库管理页(权威操作手册) | 🔴**四配置位各管各的别复制真值**:①Config JSON(提示词/行业/场景/默认模型/时长/字幕开关)②Pricing JSON(仅Agent服务费)③模型管理(能力/时长/参考图数/协议/价格)④**案例库管理页「管理案例库与封面图」**(案例标题/预填/提示词/封面);🔴**大案例库必须 `businessUi.referenceCasesSource:external_table`**(inline禁用于大库=后台编辑器卡顿+服务端CPU峰值,hybrid仅少量覆盖);🔴**封面走案例库管理页上传→自动写`coverImageUrl`,别手工拼OSS链接**,分页读取不打开几MB完整config;新字段 `businessUi.videoGeneration.{allowedDurations,modelAllowlistByDuration,defaultModelByDuration}`;确认 opsEditable/stagePromptPresets/subtitle 运营可维护、scriptwriter路径`promptComposer.masterPipeline.scriptwriter` |

## schema 演进(别踩:路径随版本变过,以线上回读为准)
- 07-08 用 `promptAssembler`(commonPrompts/image/video/scenePrompts/industryPrompts/shotListTemplates…)——偏海报/旧管线。
- 07-19+ 视频编剧走 `promptComposer.masterPipeline.scriptwriter.*`(systemPrompt/staticTemplates/lineValidation/fallbackPolicy)+ `promptComposer.opsEditable.*`+`caseInjectionPolicy`。
- 🟢 **2026-07-28 线上回读结案:两条路径并存,不是"少一段"**。`promptComposer.screenwriter.staticTemplates.{businessContext,outputContract,firstFrameTemplate,videoTemplate}` = 静态模板(videoTemplate 确在此,masterPipeline 下没有 staticTemplates);`promptComposer.masterPipeline.scriptwriter.{timeline,lineValidation,fallbackPolicy,textModel}` = 编剧策略。另 `promptComposer.masterPipeline.i2vReferenceStrategy` 线上 = `storyboard_board`。详见 [[reference-thinknova-prompt-fields]] 顶部定案块。

## 两个表示层别混
- admin `config_json`(ai_agents 表):案例/场景在 `businessUi.{referenceCases,businessActions,...}`。
- 商家端 `GET /api/v1/business-video-assets/config`:**扁平化顶层**(referenceCases/businessActions 直接在顶层,无 businessUi 包裹)。引用字段先说清哪个端点。

配套:[[reference-thinknova-prompt-fields]] [[reference-thinknova-config-powers]] [[feedback-dont-edit-prod-config-structure]] [[reference-thinknova-prompt-architecture]]
