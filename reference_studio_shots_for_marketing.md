---
name: reference-studio-shots-for-marketing
description: 营销线用商家视频工作台（studio）生成真实质感镜头做故事片的接口、坑和拼片脚本（10-10 实测）
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-10-10T19:30:20.676Z
---

**用途**：知识片 / 故事片的画面。只取工作台的单镜头视频，配音、字幕、标题、片尾我们自己做。成片角标写「画面由 ThinkNova 视频工作台生成（AI）」，片尾那句「这就是这么出来的」也就是真话。

**接口**：在 `api.thinknova.top/robots.txt` 轻页里跑 fetch，cookie 鉴权。写操作要带 `x-csrf-token`，这个值从任一 GET 的**响应头**拿。
- 建项目：`POST /api/v1/business-video-studio/projects`
  - 必填：industryId、sceneId、caseId（例：ind_food / S06 / food_s06_make）、durationSeconds（20 / 30）、videoModelId 503、ttsModelId 506、ttsVoice、ratio 9:16、subtitleEnabled false。
  - 选填：fields{productName…}、extraRequirement（逐镜头写清画面，加一句「画面里没有任何可读文字」）、referenceAssets[]。
  - 头里要带 Idempotency-Key。
- 改镜头：`PATCH …/projects/{no}/shots/{n}` {visualPrompt}
- 重出分镜：`POST …/shots/{n}/storyboards` {instruction}
- 审过分镜：`…/storyboards/approve` {revisionId}
- 批量出视频：`POST …/projects/{no}/videos`
- 单镜头重出视频：`POST …/shots/{n}/videos`
- 停 / 续：`…/cancel`、`…/resume`

**价**：分镜图 0 分；视频 MiniMax-H3 每镜 4 分。镜头 768×1344，约 6.6 秒。

**下载**：拿 revision 的 taskNo，跑 `03_工作台\新内容_知识片_1012\_dl_task.py OUTDIR name=task_xxx`，走 OSS，按任务号取。

**坑**
- 项目里任何一张图在生成时，整个项目禁止 PATCH（422012）⇒ **先把所有要改的都 PATCH 完，再逐个触发重出**。
- 分镜出完会自动 approved（manualReviewRequired=false），但要手动 POST /videos 才开始出视频。
- 图片模型会误判内容违规（排队人群的远景被拦过）、会超时（PROVIDER_REQUEST_EXCEPTION）。都退分，换个说法重出就行。
- 渲染时 Chrome 会卡死，CDP 超时。工作台查询和本地渲染错开做。
- 测试商家号是多个会话共用的：10-10 19:12 总指挥按老板令取消了全部进行中的项目，包括我们的。动之前在交接档里写清项目号；**重开工作台要老板亲口定**。

**拼片**：`新内容_知识片_1012\make_story.py`，在 K0x 目录里跑 `python ../make_story.py zh|en html,render,mix,finish`。
- spec.SHOTS 写每句旁白对应的镜头号。
- 镜头放在 `studio/shot_<n>.mp4`。
- 模板 `template_story.html`。
- K04 v4 是样板。

和 [[project-thinknova-marketing]]、[[reference-thinknova-video-studio]]（技术侧配置真值）一起看。
