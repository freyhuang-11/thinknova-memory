---
name: reference-thinknova-multiref-model
description: "ThinkNova 多参考图 i2v 模型配置实证:单参只喂截格/多参才把参考图给i2v;468配置坑+HTTP400根因(2026-07-24)"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-23T20:07:17.718Z
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

## ✅ 468 多参跑通的正确配置(2026-07-24 实证)
两个框都要改:
1. **「模型能力 JSON」框**:`"maxReferenceImages": 1` → **`5`**(卡张数的DB闸,在该框底部 `firstFrameAdherence` 前)。
2. **「通用协议 JSON」框**:
   - `requestMapping.referenceImages`:`{"mode":"multi","path":"reference_images","maxCount":5}`(path 从 image 改 reference_images);
   - `requestTemplate`:`"image":"{{referenceImages.0}}"`(单张首帧,string)+ **新增** `"reference_images":"{{referenceImages}}"`(数组)。
- 实证:改后 **HTTP 400 unmarshal 消失,2张参考图进 i2v**(task_fb9776f1fc18)。字段名 `reference_images` 对(技术文档07-12 实证名)。

## 🔴 grok-fast(468)多图时长硬约束(供应商亲口)
`Model grok-imagine-video-1.5-fast supports 15s only for text-to-video or a single reference image; **multiple reference images must use 6s or 10s.**`
→ **多图必须 6s 或 10s,不能 15s**(15s只留单图/文生视频)。测多参烧单**时长选10s**;商家口播若强制15s,多参口播需改用10s输出。

## 单图403特例(别误判)
单图直连单报 `Failed to fetch input URL: 403`(task_334083c07f97):根因=该单把**同一张图同时当首帧+参考图**,同一公网URL(thinknova-previews桶)被供应商连拉两次,第二次被限流/防盗链403。**多图(不同URL各拉一次)不重演**(实证多图单是时长错非403)。非真障碍。

## 上传/中转坑
- 直连「图生视频」UI 多图上传被前端 `max_reference_images=1` 卡死(老板已报技术)。
- 我(本会话)传不了本地图:file_upload 只认聊天附件;OSS 上传脚本被 classifier 拦;API 烧单/config PUT 被平台 419 拦。→ **烧单/上传只能老板 UI 操作,我做后台验证+分析**。

## 🔴 图生图产品没锁 = 和口播锁人物同根(2026-07-24 诊断)
老板反馈最近 agent 图生图产品没锁。诊断(task_608b5a90b3b6 i2i):模型451、**mode=t2i**、refImgsIn=3(产品图传了)、prompt **已有锁定语**(以参考图为准/商品参考图/保持商品不变/上传的商品)。
- **根因不是提示词没写锁**,是**六宫格母版=合成多格图+t2i重画**:gpt-image 照描述"重画一个像的",不是"用你上传这张",产品参考图权重弱→画出通用商品对不上包装。
- **真正的锁=多参 i2v 直接吃产品参考图**(468 多参),i2v拿真实产品图→成片产品=上传那个。**口播锁人物 + 产品锁,统一根治点=多参 i2v。**
- **优化草案(待应用,419写被拦没落库)**:①提示词层把产品描述从泛化改具体锚定"外形比例配色包装材质必须与提供的商品参考图完全一致、不得替换相似款"(只提升相似度,治标);②根治=推进 468 多参(治本)。③或分镜板产品格走 image_to_image 低strength高adherence(母版合成难,备选)。

配套 [[project-thinknova-dingdian-koubao]] [[reference-grok-content-policy]] [[reference-thinknova-tech-docs-index]]
