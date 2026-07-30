---
name: project-thinknova-storyboard-test
description: "触发:查故事板/生图锁/i2v取证,或烧单取证前 → 取证接口手册(admin offline-store-content/tasks/{no} 唯一全料入口)+板层已定案结论+两模型定位"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-30T18:44:17.515Z
---

# 故事板/生图/i2v · 取证手册与定案(07-31 里程碑清账版)
> 过程流水与旧实验 → `archive/storyboard_test_history_to_0729.md`。裁格/黑幕/提示词/长度现状 → [[project-thinknova-0729-screenwriter-stack]](唯一现状源)。

## ① 取证/接口手册(日常用,仍全部有效)
- 🔴 admin base=`https://api.thinknova.top/admin/api/v1`;`admin.thinknova.top/...` 会返回 SPA 兜底假 200,必查 content-type。
- 🔴 **取证总管道**:`GET /admin/api/v1/offline-store-content/tasks/{taskNo}` → allAssets/intermediateArtifacts/childTasksBlock/plan/configSnapshot/firstFramePanels——**唯一能拿 6宫格板图+供应商裸片**的入口。一眼判策略:allAssets 有 720×1280 裁格图=panel_crop;只有板图=storyboard_board。运行时真值:i2v rawRequest.input 的 `_i2v_reference_strategy`/`_reference_image_limit`/`reference_asset_roles`。
- 商家侧子任务:`GET /api/v1/ai/tasks/{no}?assets=1`(input/output/assets);主任务 childTasks{scriptwriter,image,video};键名 camelCase/snake 摆动两种都试。
- **案例库**:`GET/PUT /agents/offline_store_video/reference-cases/{id}` 单条路由(**upsert 可建新,分页上限20/页**);写法=GET 响应头拿 `x-csrf-token` → 整对象 PUT。🔴 列表接口 `i2vReferenceStrategy` 返回不全,核验逐条 GET;**商家端 reference-cases 列表忽略 industryId 参数**。
- **agent config**:`GET /agents/{code}` → `data.agent.config`;🔴 **直连 PUT 带 x-csrf-token 已通(07-31 解锁,含 businessUi),419-UI 弹窗法/剪贴板人工法全部废弃**。镜像铁律不变:blockTemplates/opsEditable 双写。
- **建单**:`POST /api/v1/business-video-assets/tasks` + csrf 头 + `x-thinknova-locale:zh`;**必填 durationSeconds(07-30 起)**;选模型字段=`videoModelId`(modelId 被静默无视);复用旧单参数=`GET tasks/{no}` → data.detail.business。烧完必验 task.model。批量烧单串行≥20秒。
- **大 JSON 灌浏览器**:本地 CORS 服务器(必须答 OPTIONS+`Access-Control-Allow-Private-Network`,127.0.0.1 免混合内容拦截);**重 SPA 页会冻死 CDP,一律在 robots.txt 轻页跑 fetch**。落盘=页面 `<a download>` → `D:\SamsoData\Downloads`。
- 抽帧:`ffmpeg -vf "fps=2,scale=240:-1,tile=6x5"`;音频死寂:`silencedetect=noise=-35dB:d=0.4`。打印含 `=` 换 `≡`,签名 URL 不打印。
- 🔴 任务创建时冻结模型/策略快照 → 改配置后对照必须重新烧单。
- 🔴 模型表 `GET /models?pageSize=200`;`/models/{id}` GET 503 只有 PUT 可用(从列表拿整对象改后 PUT)。464=最贵模型,**不要主动加回白名单**。

## ② 已定案(仍成立的结论)
- **三锁承诺(n=5)**:人物锁 4/4、门店锁 5/5、板↔片一致性 ≈83%;**锁强弱取决于产品可辨识度**(结构全露强/被包装遮中等),演示选品挑前者。**不能承诺**:门头招牌汉字(AI 必乱码,拼音反而行)。
- **同质化根因**=六拍骨架全局写死+世界观锁死(整套场景图当产品图)——已由片型体系 620 条差异化+案例去重 468 处治理;「正面指令压倒禁令」铁律由此而来。
- **网格问题已终结**:开场硬规前置+案例级黑幕双保险(grok 双时长零帧实证);grok 网格双峰(0.17s/2.9s)是历史病理记录。
- **appearanceMode > visualFocus > videoStyle > paceLevel > 骨架 > visualHint** 的画面影响力序;板层不吃 appearanceMode(人物到 i2v 才删)。
- **两模型定位(待改名)**:grok=口播/中文台词稳、**做不到硬切(溶解=能力边界)**、稳定性差会 502/503(失败退积分);omni=分镜执行准可硬切、有四角星水印、中文只崩数字单位与四字紧凑短语。
- 编剧回退率历史:07-23 36.8%→07-28 20%→07-31 战役后失败即退款不再静默。

## ③ 未验/待办(仍开放)
- 三锁双参验证:`db787156c4c0` 在跑(人物3858+场景3859,grok482)——验管线是否提交2张;锁强度白天评。
- omni 吃板真测(videoModelId=460)未做;门头锁 vs 招牌文字虚化互斥未验;visualHint「五格/六格」口径统一未做(板3×2=6格 vs boardCells 固定5,两层本就不同,非矛盾)。
- 7 片型烧验(与案例预览回填流水线合一:烧→验→OSS→previewVideoUrl 回填,07-31 双单已跑通)。

关联 [[project-thinknova-0729-screenwriter-stack]] [[project-thinknova-film-types]] [[reference-thinknova-multiref-model]] [[reference-thinknova-paths]]
