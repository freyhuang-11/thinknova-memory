---
name: reference-thinknova-pipeline-flow
description: "ThinkNova 海报/视频两条完整管线的分步流程(老板亲述,我反复搞不清被骂后写死)——动这两个Agent任何一环前必背这条"
metadata:
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

> 2026-07-08 老板亲述并要求写死:"你和我对了 2 天流程,自己都不知道流程?" —— 动这两条管线任何一环之前,先把本条从头到尾走一遍,不许再把中间产物/子任务张冠李戴。

## 海报管线(offline_store_content,outputType=poster/image)
1. **商家填资料**(商品名/价格活动/店名/位置/卖点/比例/风格…)
2. **上传参考图**(人物/场景/产品,三类)
3. **文生文**:根据商家填的资料生成文案(text_generation)
4. **参考图 + 文生图 → 海报**:有参考图走 edits(图生图),无参考图走 generations(文生图)

## 视频管线(offline_store_video,outputType=video)——六步,一步都不能跳
1. **商家填资料**
2. **上传参考图 / 不上传**(人物/场景/产品,可选)
3. **文生文**:编剧生成台词+分镜(text_generation,deepseek;输出应为 lines 完整语义句 + shots 分镜)
4. **参考图 + 文生图 → 分镜图**:生成六宫格分镜板(storyboard);有参考图走 edits,无走 generations
5. **分镜图裁格 → 首帧**:按格位从分镜板裁出 t=0 首帧格
6. **首帧 + 分镜图 + 参考图 + 文生视频 → 视频**:i2v 请求 = image_url(首帧) + reference_image_urls([分镜图, 商家参考图…])

## 当前实测状态(2026-07-08,老板2天对齐后的认知,别再搞错)
- ✅ **第5步 裁格首帧 = 对的**(只有首帧是对的)
- ❌ **第4步 分镜图 = 还不对**("风景图/分镜图还是不对")—— 视频画面没跟上分镜/台词
- 🔴 **参考图(第2步)已测(0708,平台API)**:链路是**通的**(上传 `POST /assets/reference-upload`→进单 `personReferenceImageAssetId`→喂进 i2i 两张输入图,实证=下载出来就是参考图)。坏在**两处**:①**i2i 调用超时 failed**(`CURL_REQUEST_FAILED` 120s 0字节,同 T0#1 服务器→供应商)②`edit_options` = restyle/strength 0.74/preserve_composition=false → **参考图被重绘74%、特征全丢**。**推翻旧"链路断/图被扔"判断**——图没被扔,是被 restyle 参数重绘掉。imageEditOptions strength **我方可 PUT**。详见 01_问题诊断/管线逐环诊断报告_0708.md + 证据目录
- 编剧(第3步)systemPromptSource=builtin_default(PHP写死),台词 lines 被定长硬切、切在词中间 → i2v 用「；」连接后念错字(实锤:编剧 task_14e033657b1d + i2v task_4e53507318a8)

## 测试铁律
- **必须按完整六步在平台跑**,不许只查单个子任务就下结论(接口通≠功能通)。
- 子任务用 parentTaskNo 串成同一单再看,别把不同单的编剧/分镜/i2v 张冠李戴。
- 只在平台测,不用直连(客户用平台)→ 见 [[project-thinknova-offline-agents]] / [[reference-thinknova-config-powers]]。
