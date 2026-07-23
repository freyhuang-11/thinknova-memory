---
name: reference-thinknova-tech-docs-index
description: "技术官方文档档案索引=ThinkNova config/pipeline 的唯一真值;动任何字段前先按此定位原文档+拉线上核对,记忆只是索引不是真值(2026-07-24 老板+技术要求)"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-23T16:29:18.523Z
---

🔴🔴 **铁律:这些技术官方文档=唯一真值。我的其它记忆是索引和实测增量,不能替代文档、更不能盖掉文档。动任何 config 字段前:①按下表翻对应原文档 ②拉线上真实 config 回读核对字段路径 ③再动。** 之前反复出错的根因=我把自己漂移/污染的记忆当真值,没回文档核(技术:「那么多文档你没好好看过」,2026-07-24 老板转达)。

**文档位置**:`D:\xwechat_files\wxid_5aowhntcmaoh12_6db1\msg\file\2026-07\`(老板微信收的技术文档;老板每次发新的当天归档,见 [[reference-prompt-library]])。

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

## schema 演进(别踩:路径随版本变过,以线上回读为准)
- 07-08 用 `promptAssembler`(commonPrompts/image/video/scenePrompts/industryPrompts/shotListTemplates…)——偏海报/旧管线。
- 07-19+ 视频编剧走 `promptComposer.masterPipeline.scriptwriter.*`(systemPrompt/staticTemplates/lineValidation/fallbackPolicy)+ `promptComposer.opsEditable.*`+`caseInjectionPolicy`。
- **我记忆里曾写 `promptComposer.screenwriter.*`(少 masterPipeline),可能是更新版或我记漏——改前必拉线上 config 看实际路径,不认死记忆。** 见 [[reference-thinknova-prompt-fields]](已标注更正)。

## 两个表示层别混
- admin `config_json`(ai_agents 表):案例/场景在 `businessUi.{referenceCases,businessActions,...}`。
- 商家端 `GET /api/v1/business-video-assets/config`:**扁平化顶层**(referenceCases/businessActions 直接在顶层,无 businessUi 包裹)。引用字段先说清哪个端点。

配套:[[reference-thinknova-prompt-fields]] [[reference-thinknova-config-powers]] [[feedback-dont-edit-prod-config-structure]] [[reference-thinknova-prompt-architecture]]
