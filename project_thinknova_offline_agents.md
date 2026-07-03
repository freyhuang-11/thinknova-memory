---
name: project-thinknova-offline-agents
description: ThinkNova 实体店两个Agent(海报+短视频)当前状态、改配置方法、已修问题、拍板决策、交付物
metadata:
  node_type: memory
  type: project
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

> 只记**当前真实状态**,过时内容已覆盖删(见 [[feedback-memory-keep-current]])。最后整理 2026-07-03。ThinkNova=Codex开发的轻量AI创作平台。两个Agent:`offline_store_content`(海报,6积分/张)+`offline_store_video`(短视频,35积分/条)。目标用户=纯小白门店老板。**固定工作目录**:`D:\SamsoData\Documents\视频制作平台分析\`(子目录00_规格/01_问题诊断/02_交付内容/03_设计稿/对外推介),**绝不写D:\根**。路径/接口见 [[reference-thinknova-paths]]。

## 改配置的正确方法(铁律)
- config 在 agent 的 config 字段(对象)。**用 API PUT 改**:`PUT /admin/api/v1/agents/{code}`,body=GET回来的完整agent对象(含config对象),cookie鉴权。**别用后台大textarea手改**——739KB config 会崩标签页。
- 双写:**video有opsEditable镜像**(taskGoal.firstFrame/video、stagePromptPresets.image_to_video),改top-level要**同时改opsEditable**;**poster无opsEditable**(只top-level)。改完重新GET/agents读回核验。

## i2v视频提示词根因(本轮最大发现)
- **i2v实际读 `promptComposer.stagePromptPresets.image_to_video.prompt`,不是blockTemplates.task_goal.video**(我之前改错地方→视频一直"静态图微动")。已改对、实测视频真动起来、有钩子-展示-落点。
- t2i首帧(分镜板)读blockOrders.first_frame_prompt块组装(blockTemplates.task_goal.first_frame_prompt),t2i的stagePreset为空。
- 当前i2v = 覆盖后端英文前缀 + **严格按分镜板每格标注的时段/景别/运镜/动作推进(2/3/4段不固定)** + 镜头稳定·严禁重复复制(治"2块屏幕") + 台词底部字幕原样保留 + 行业锁定+业务演绎+防穿模。
- 后端硬编码英文前缀"Only add subtle natural motion"在代码里(非config),已中文最高优先级覆盖;**用户已决定不删此项**。视频模型=grok-imagine-video(中文烧字幕不稳,用户选纯提示词方案)。
- 分镜首帧:**2–4镜不固定**、每格加"画面动态"参数、台词取自业务信息且渲染成干净底部字幕(gpt-image出字比grok稳)。

## 全量提示词审查(07-03晚,已修9处上线)
- 修掉的层间矛盾:①首帧layout_rules禁字幕↔要台词字幕→改"只允许参数标注+底部字幕两类文字"②首帧负面词海报时代残留("无标题区"逼加标题区)→换分镜板专用③S07硬编码三镜固定时段→灵活④补S10 sceneRule⑤style_rules硬编码"美业="→按行业⑥durationPolicies.10残留三幕固定时段→"有几格分几段"⑦video S12全15条案例visualHint"留出醒目文字区"(海报式,zh+en)→动作氛围⑧海报layout_rules正面要求"预留二维码位"(冒二维码残余根因)→门店名落款+禁二维码。
- **negativePromptPolicy在promptComposer里**(不在config顶层);opsEditable镜像范围很大(layoutRules/sceneRules/styleRule/durationPolicies全套),改这些都要双写。
- 审查结论:场景13个盖住基础商户动机;缺口=招聘启事、会员储值(待拍板)。行业15个够用;缺口=母婴、花店(待拍板)。案例结构缺口+prefill英文没翻(poster 442/472、video 200/269)+54条无prefill,见待办清单C2节。

## 已修其他
- 海报冒二维码/微信/地址=**模型脑补(不在config)**;已加负面规则(禁二维码/微信/公众号/编造地址/编造联系方式)+4个endingCta改"纯文案区禁二维码"。
- S12(开业/周年/通知)缺口补齐,video+poster各15条。补充要求extraRequirement确实进提示词(实测已进画面)。

## 案例大扩充(07-03深夜,用户授权自主执行)
- **当前案例数:video 355、poster 548(共903),行业17个**。新增:①招聘启事→塞S12,30条 ②会员储值→塞S02,30条 ③poster S10教程15条 ④poster S04价目+3、video S04价目+10、珠宝S07×2 ⑤**行业+2:母婴mother_baby/花店flower_plant**(筛选器6语言+规则+负面词+各14案例×双agent=56条,花店海报实测端到端通过) ⑥门店日常`{ind}_s11_daily`×17(对标抖音来客"门店日常/员工故事"缺口)。
- 场景对标结论(稿定/爱设计×抖音来客):13场景框架齐,不加新场景,缺口全案例级解决。
- **拼接去重6处已清**(不烙文字/一致性叠写/durationPolicies与i2v撞车/无转化信息移位/海报同义负面/标题价格叠写);正负配对是保护性设计已甄别保留。
- **⚠️海报管线不读sceneRules/industryRules(死配置,实测新老任务均无)**→已进给技术待确认;海报行业质感靠案例visualHint承载。
- **prefill 全量健康**:696条en未翻已全部翻译(1284处字段)、54+15条无prefill补齐、7条无卖点补齐。0残留。
- 实测(成片级):视频首帧prompt 7项修复全生效、海报prompt 4项全生效。视频成片=字幕烧上且取自业务信息✅、叙事完整✅;残余模型瑕疵=①同句字幕出现两行(格底位置泄漏)②同款杯复制两杯→已加i2v【字幕唯一性】补丁(现1303字,含一次一行/全画面底部/转场先隐后现/禁双影叠化),待复验。海报成片=零二维码零编造联系方式、达商用标准✅。
- 未做待拍板:母婴/花店行业单开;分镜板720×1280→1080×1920(需技术确认size上限)。

## 自测能力(重要)
- **freyhuang本人=商家用户id 1687**,会话cookie在商家API也有效,可自助生成:`POST /api/v1/business-video-assets/tasks`,payload={businessScenario(场景id promotion/notice等),caseId,outputType(video_10s/poster),selectedOptions,sellingPoints,productName,offer,storeName,extraRequirement}。余额~10万分。生成商偶发失败自动退款。成品输出在imagemax2.zhoushurencz1.top/1renfile*.cos/thinknova.oss。

## 拍板决策(2026-07-03)
- **参考图拆3种**:人物/场景/产品,每类1张、均选填、**空槽=该元素不参考、全不传=按案例生成**。需后端收3张+config预留3个提示词位。
- **海报客户自选1/2/4张**(后端出N版);**一键分享去除**。
- **案例预览**:海报案例=图、视频案例=真视频;**741案例目前0预览图**。分工=技术只加"口子"(previewImageUrl/previewVideoUrl/previewCoverUrl字段+前端挑参考页渲染+存储固化),**生成+回填我用我们账号慢慢做、顺带QA**。

## 交付物
- **桌面版新界面交付包**:`03_设计稿\商家双Agent_桌面版开发交付包_20260703.zip`(10屏截图+html源码+设计令牌+README+技术清单)。Stitch项目7645298167327483745,设计系统"Ethereal Editorial",**只用蓝#2563eb(禁紫/靛;a288资产会出Indigo紫→用de3066资产)**。Stitch生成常客户端超时但服务端会落库,轮询取;海报页尤其爱超时。
- 给技术(02_交付内容\):`给技术_本轮优化汇总_2026-07-03.md`(汇总所有技术项,A1i2v英文前缀/A2海报计费已按用户删)、`给技术_案例预览口子_2026-07-03.md`。清单:`01_问题诊断\待办与技术清单_2026-07-03.md`(A3前端i18n/A4加油包schema/A5参考图3槽/A6页面系统审计/A7案例预览)。

## 产品定调
- 视频=重点,标准管线"首帧+提示词→i2v单次",质量方差在提示词。海报≠视频(免费工具多、要差异化,海报做商家真会贴的商业单图)。北极星=零动脑,见[[feedback-thinknova-zero-brain-northstar]]。合规=内容工具不做审查、只守未成年底线,见[[feedback-thinknova-content-not-compliance]]。已授权直接改线上,见[[feedback-thinknova-config-edit-rule]]。交付验收见[[feedback-handoff-acceptance]]。定价见[[project-thinknova-pricing-ambassador]]。
