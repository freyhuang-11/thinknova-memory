---
name: reference-thinknova-multiref-model
description: "ThinkNova 多参考图 i2v 模型配置实证:单参只喂截格/多参才把参考图给i2v;468配置坑+HTTP400根因(2026-07-24)"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-23T19:02:52.562Z
---

# ThinkNova 多参考图 i2v 模型(2026-07-24 实证)

## 🔴 核心机制(老板定,别再搞错)
**多参 vs 单参由模型决定**:
- **单参模型**(如 415 主力、468 未改前):运行时 i2v **只收"截格首帧"1张**,上传的人物/场景/产品参考图**不到 i2v**(只进 i2i 分镜板)。
- **多参模型**:i2v **收全部参考图**(首帧 + 人物/场景/产品)。
→ 想让 i2v 拿到真人/场景/产品图(锁人物、降 Grok 审核拒率),**必须用多参模型**,靠不了商家流程的截格。

## 涉及模型
- **415** grok-imagine-video-1.5-preview(现役主力 i2v,manxueapi,单参 maxRef=1)
- **468** grok-imagine-video-1.5-fast「Grok 1.5 多图」(manxueapi,要改成真多参的目标)
- **411** grok 1.5(manxueapi,文生视频,**已停用但是多参样板**):`model_request_mode=manxue_videos_reference_images_json` + `max_reference_images=5` = 07-12 smoke 验证过的多图配置(首帧+4张=5项 reference_images 请求体)。

## 468 改多参的坑(2026-07-24 实测)
1. **两个 count 字段别混**:DB 列 `max_reference_images`(控前端可上传张数+运行喂几张)vs 通用协议JSON 里 `referenceImages.maxCount`。老板改了 maxCount→5 但 DB 列还是 1 → 前端仍只让传1张/运行仍单参。**要一起对上。**
2. 🔴 **requestTemplate 的 `image` 字段只收单个字符串,不收数组**:把 `"image":"{{referenceImages}}"`(数组)一填,供应商直接 **HTTP 400** `json: cannot unmarshal array into Go struct field .Alias.image of type string`(实测 task_608b5a90b3b6,i2v modelId=468 fail)。
   - **正解**:`image` 保持 `{{referenceImages.0}}`(单张首帧);**多图另开字段** `{{referenceImages}}`,字段名候选 **`reference_images`**(411 manxue 适配器用的名,最可能)> `images`。以 manxueapi 视频API文档为准(老板说文档有遗漏,待确认)。
3. 分镜板(i2i)本来就吃多参(实测 task_608b5a90b3b6 i2i refImages=3,板正常,老板"验证无数次");问题只在 i2v 请求格式。

## 上传/中转坑
- 直连「图生视频」UI 多图上传被前端 `max_reference_images=1` 卡死(老板已报技术)。
- 我(本会话)传不了本地图:file_upload 只认聊天附件;OSS 上传脚本被 classifier 拦;API 烧单/config PUT 被平台 419 拦。→ **烧单/上传只能老板 UI 操作,我做后台验证+分析**。

配套 [[project-thinknova-dingdian-koubao]] [[reference-grok-content-policy]] [[reference-thinknova-tech-docs-index]]
