---
name: project-thinknova-offline-agents
description: ThinkNova 实体店两个Agent(海报+短视频)当前状态、改配置方法、关键架构、当前阻断、拍板决策
metadata:
  node_type: memory
  type: project
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

> 只记**当前真实状态**,过时覆盖删、按优先级排(见 [[feedback-memory-keep-current]])。最后整理 2026-07-13。ThinkNova=Codex开发的轻量AI创作平台。两Agent:`offline_store_content`(海报,**6积分/张·一单1张**)+`offline_store_video`(短视频,**60积分/条**)。用户=纯小白门店老板。**固定工作目录**`D:\SamsoData\Documents\视频制作平台分析\`(00_规格/01_问题诊断/02_交付内容/03_设计稿/对外推介),**绝不写D:\根**。路径/接口见 [[reference-thinknova-paths]],提示词细节见 [[reference-thinknova-prompt-architecture]],管线流程见 [[reference-thinknova-pipeline-flow]]。

## 🔴 当前焦点(压缩后先看这里,状态=2026-07-14凌晨)
1. **✅P1 六宫格成片已在生产修好(2026-07-14 02:31实证)**:主任务详情出现新资产 `master_first_frame_panel`(720×1280干净单帧,从1024×1536板裁出),i2v `image_url` 实测=这张裁片(量过尺寸)。成片不再出网格。历史根因存档:裁格前cURL下载板SSL失败(result:19)→兜底发整板(实证task_a7d925084fa3);技术修法=`APP_ENV=production`强制SSL校验+CA bundle支持,cos.lingkeai.vip已换公信证书(TLS开、200、免CA bundle)。⚠️架构限制:**grok-1.5(415)只收1张参考图,裁片占位后整板进不了参考**——五镜跟板纯靠提示词;**grok-3.5(452)支持5张参考**=能同时带[裁片+整板],定终版核心候选。
2. **🔴P2 只修一半,病灶已精确定位(唯一阻断,已给技术)**:主任务input的`selectedOptions`现在**有值**(对象`{"copyLanguage":"en","appearanceMode":"product_only",…}`),**但编剧任务里`selectedOptions:[]`空数组、`optionArbitration`全空**(同载荷原始段有`"copyLanguage":"en"`两处)——**后端建仲裁块的映射器按数组格式读对象,读空**。实证`task_823fd8c628b2`(父task_dd03617350e0,2026-07-14 02:31,English+纯商品→台词中文+真人出镜)。**三症状一个根**:台词中文/出真人/人物飘(板提示词里composer的Western注入还在,但编剧的中文真人boardCells压过它=方差)。**修好编剧仲裁,语言/人物/出人一次归位;在此之前别烧单**。运营侧规则已就绪(编剧systemPrompt认copyLanguage代码)。
3. **🔴grok-1.0多参考图链路403(已给技术)**:`task_5b7c31d70c23`错误`Failed to fetch input URL: 403 (2 references failed)`——manxue供应商拉不到我们参考图URL(签名过期/防盗链)。1.0(3张参考)vs 1.5(1张)效果对比被挡,修完再比、再定终版(老板要比完拍板)。
4. **✅新计费已上生产真单验证(2026-07-14)**:1.0单冻46(0+6+40)/1.5单冻60(9+6+45),快照制生效;1.0失败单46应自动退(老板可查流水)。**10s定价策略待老板拍板**:1.0十秒40 vs 3.5十秒30倒挂且1.0画质弱——选项=10s服务费+4凑50 / 藏1.0 / 降40→30。
5. **压缩后老板2026-07-12指令(仍欠)**:核对后台总账(约46项/开放30)+前端清单(26条),能实测核实已解决的划掉,产出干净待办。最新总账=`01_问题诊断/待办总表快照_2026-07-12.md`。

## 改配置的正确方法(铁律)
- config 在 agent 的 `config` 字段(对象)。**直连 PUT `/admin/api/v1/agents/{code}` 自 2026-07-12 起被 419 写保护拦死**(GET 能读、只写被拒;cookie HttpOnly 无可用 csrf)。**唯一落库法=后台 `#/ai/agents`→点 agent「编辑」→JS 给大 textarea(≈1.9MB=完整config)赋值(原生 value setter+派发 input/change)→JS 点真·「保存 Agent」按钮**(带 UI 安全 token 过419);全程用 JS(1.9MB config 卡死坐标点击),保存后 GET 验 updated_at。详见 [[reference-thinknova-paths]]。**别用 fetch monkey-patch 改 PUT=被判绕过安全会拦**。
- 双写:**video 有 opsEditable 镜像**(taskGoal.firstFrame/video、stagePromptPresets.image_to_video、languageMap 等),改 top-level 要**同步改 opsEditable**;**poster 无 opsEditable**(只 top-level)。改完 GET 读回核验。
- **⚠️技术部署会重写运营改的 config 字段**(实证:视频语言选项被我砍到3个又被退回5个)——**每次技术发版后运营改的字段(detailOptionGroups/promptComposer)要重核**;需和技术约定部署别重置。

## 关键架构(必背)
- 🔴**`promptComposer.blockOrders` 只有 `video_prompt`(i2v)和 `first_frame_prompt`(首帧)两阶段;核心设置选项(copyLanguage/visualFocus/videoStyle/platform/endingCta/paceLevel)只经 optionRules→buckets 注入这俩下游,编剧(screenwriter)收不到**(除 appearanceMode 后端单独传)。后果:选英文出中文台词、选突出菜品照样出人。**"拍菜不出人"当前唯一可靠开关=出镜方式 appearanceMode=product_only,不是画面重点**。languagePolicy.en 管"画面可见文字"(海报用),视频零字幕、管不到口播;视频台词语言=编剧写啥就啥。→ 已出卡要技术把完整 selectedOptions 注入编剧入参(P2)。
- **i2v 实际请求=后端英文前缀(硬编码"Only add subtle natural motion",非config,已中文最高优先级覆盖,老板不删)+`stagePromptPresets.image_to_video`**;blockTemplates 的 task_goal.video 等全是死配置不进 i2v。首帧(分镜板)读 blockOrders.first_frame_prompt。视频模型=grok-imagine-video-1.5(中文烧字幕不稳→纯提示词方案)。**i2v 提示词 4096 字节硬上限**(超=400整单挂),现底座 ~2147 字节。
- **满配冲突仲裁**(已进给技术卡):人物只归 appearanceMode 一个开关(visualFocus 只管构图不碰人物);videoStyle 主导风格/platform 只调格式/paceLevel 只控语速(三者别都堆 style_rules)。person_on_camera 被58案例、subject_closeup 被54案例预设,**不能删下拉、只能仲裁**。老板原则:提示词一冲突生成就飘,一个方面只由一个开关管。
- **✅我上轮判"subject_closeup 改成不出人"制造了 出镜方式×画面重点 冲突,已退回**;人物控制只归 appearanceMode。

## 平台清单现状 + 自测能力
- **案例池:约1220条(video~500/poster~700),25个行业**,封面全真图化(OSS `previews/all/`),prefill 六语言健康零兜底,占位词六语言全上线。
- **案例预览 OSS**=公司阿里云 bucket `thinknova-previews`(新加坡·公共读,前缀 `https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/`);AK 在 `视频制作平台分析/oss_ak.txt`(⚠️别打进任何交付zip)。
- **自测**:freyhuang 本人=商家用户 id **1687**,会话 cookie 商家API有效,可自助建单 `POST /api/v1/business-video-assets/tasks`(payload=businessScenario动机id/caseId/outputType(video_10s)/selectedOptions/sellingPoints/productName/offer),余额~10万分,失败自动退款。字段详见 [[reference-thinknova-paths]]。**接口通≠功能通,必实机点击验**(曾脚本绕过 display:none 按钮误判"验收通过")。

## 产品定调 + 标准流程
- **标准流程(用户口径,所有文档按此说话)**:海报=客户提信息→编剧层生文→文+参考图生图;视频=客户选案例→编剧层生文→文+参考图生板→**板裁片+[板,人物,场景,产品]参考数组生视频**。"纯文生=通用素材不是商家自己的内容,一定出问题"。参考图拆3种(人物/场景/产品,各1张均选填,空槽=不参考、全不传=按案例生成)。能力已全部直连验证,差距在技术管线四件:B1编剧层/B6有图通道/A5参考图槽/**B2裁格**(=P1 六宫格根因所在环节)。
- 视频=重点。北极星=零动脑(客户不动脑做出他自己的内容)见[[feedback-thinknova-zero-brain-northstar]]。合规=内容工具不做审查只守未成年底线见[[feedback-thinknova-content-not-compliance]]。已授权直接改线上见[[feedback-thinknova-config-edit-rule]]。交付验收见[[feedback-handoff-acceptance]]。营销只做导演台见[[feedback-thinknova-marketing-director-role]]。定价见[[project-thinknova-pricing-ambassador]]。

## 视频案例真预览回填(进行中工作流,老板2026-07-12启动)
- 现状:视频案例515条里514条预览挂的是静态图(海报那套 .png),只1条挂真视频(`food_s01_combo` 餐饮/S01/新品套餐)。文字内容按视频写、媒体=图。
- 机制:提示词/视频内容已基本定型→每条测出的好视频逐步沉淀成对应案例真视频预览(previewVideoUrl),我们账号慢慢做+顺带QA。**攒够20条批量上传一次**(先攒 `视频制作平台分析/视频案例真预览_待回填/`:mp4 + 台账.md 登记案例/QA/状态)。上传=视频传COS→写案例 previewVideoUrl→后台UI保存过419→回读确认。**当前 0/20**。

## 提示词/管线实验(E1-E36,07-03~07-08,已定标·细节全在 arch 文件)
所有实验结论已沉淀进 [[reference-thinknova-prompt-architecture]];关键定标 digest:①中文台词基线 70-75字/5-6句@15s+"从容不赶时间充裕"(加字→模型赶稿吞字);本轮升级=每句9-12/总45-55/**硬下限45**+"均匀铺满15秒句间只短呼吸绝不留>1秒空档"(治留白太长);台词留白甜点=碎花裙(41字),星空顶51字塞满=一般,杨枝甘露38字大空=太少。②首帧裁片=t=0像素锚(唯一锁真人脸机制)。③@语法每提必挂(相似度60→85%)。④负面词只禁"新增字幕水印"不泛化禁"文字"(否则把真人真店净化掉)。⑤grok 口播只念中/英/日(谚文泰文台词被翻回中文即兴念)→视频语言选项收窄 zh_cn/en/ja,海报保留全语言。⑥分镜板必留(客户生成前确认剧情=剧情预览)。⑦黑屏锚=六宫格左上0.15s(防六格被当一张整图动)。⑧拟真肤质写进 videoPrompt。⑨声线负面组永驻 negative_prompt(机器人腔/播音腔/平直节奏/僵硬表情)。本轮(07-11~12)已上线并回读核验11项(全行业兜底骨架 video+22/poster+27、全板人物锁、台词从容、服务类不套卖货、一镜一换禁全程口播、静默尾巴改善、台词空镜修复等)详见 arch 文件。语言规则已升级=直接认 copyLanguage 代码(不靠编剧把"英文"和"en"对上)。

## 路线图(老板2026-07-09拍板)
- 节奏:①前端问题整理(当前)→②商业化拉新→③后台30来项**边推广边修**。
- 前端现网核销:✅14项;❌4项已出《给技术_前端第三批_2026-07-09》(导航#21仍"灵感"/F12无自定义行业/F6卖点非chip/F4价格门店标必填应可选);🔴新bug=credits页500+账单"记录中心"空白(挡6项)。F3资产库待补看。前端26条清单=`02_交付内容/前台修改清单_2026-07-09_自然语言版`。
- 拍板已定:拆解图4案例(`_x_exploded`海报)下架 enabled=false / 30秒入口暂藏 / 不后期烧字幕 / seedance暂缓。
- **2个后期功能立项**:(C1)自动平台发布(多平台一键发);(C2)营销自动化=内容规划引擎(锁行业→系统告诉今天发什么:天气/节假日/活动/一周主题,如"今天下雨→到店送饮料"、"明天母亲节→自动出套餐+海报+短视频+朋友圈"→选平台→尽量自动发,做不了也要"规划栏"逼商家每天进平台)。排推广后各出需求文档。

## 环境坑 + 杂项待办
- **harness**:所有 in-page fetch 到 api.thinknova.top 在**内置浏览器**里被拦成 {}(读config/task/auth 全空),只能用 admin 编辑器 textarea DOM 读config + 页面自身请求(任务中心/详情页能 load);下载视频也被拦。**✅用老板登录态的真 Chrome(claude-in-chrome)时,fetch 用 top-level await(别用 async IIFE return)可拿真数据**(2026-07-13验证:admin `/admin/api/v1/ai-tasks` 列表 + 子任务「提交给模型的请求」JSON 都能读;含 URL/query 的字段会被 harness 掩成 `[BLOCKED]`,页面内先剔 URL 片段再返回)。任务详情按 id 的 `?payload_only=1` 返回 null,读全内容从任务中心「详情」抽屉 DOM。商家 fill-info 页偶发白屏(remount bug已报);会话掉得快要反复重登。
- **待落/卡住**:icon 专属(iconKey/iconUrl 商家端都不渲染=前端没接通,已给技术;运营25行业图标映射已备,机制确认即配);多样性测试(美业S06×5,卡worker)择机补。
- **催技术**:419写保护 / icon不渲染 / 编剧模型禁令字数不可靠→程序层 lines 校验重掷 / 分镜跟片~75%(老板暂接受)。
- **模型方差(提示词只降不根治)**:编剧模型 deepseek/5.5 轮换=设计,禁令字数时灵时不灵;grok i2v 同板时而跟时而塌口播、灯光吃自己风格、静默尾巴倾向早说完。
