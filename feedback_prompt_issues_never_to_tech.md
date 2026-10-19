---
name: feedback-prompt-issues-never-to-tech
description: 出片效果问题（声音、台词、角色、画面）凡是提示词能管的一律自己改，⛔ 写进给技术的文档；技术只管流程
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-10-19T09:25:29.847Z
---

成片里出的效果问题，只要发给模型的文字能影响，就是我的活，自己改提示词、自己烧单验，⛔ 推给技术或写成「模型做不到」。技术只管流程类：超时、截短、交付校验、封面、响度、重试。

**Why:** 10-19 17:4x 老板（重话、说过无数遍）：「角色用同一个声音就是提示词没解决，技术不解决提示词的问题只解决流程」。那次我把「两角色同一个声音」写成「模型按句随机配声、编剧层管不到」报了技术。实际上发给视频模型的文本开头写着「全片真人口播」、固定段写「口播是自然真人声」，整段当成一个人在说，从没说过两个角色要用两个声音——问题出在提示词。

**How to apply:**
- 先把发给模型的最终文本拉出来（admin task 详情 `plan.videoPrompt.imageToVideoPrompt` + `imageToVideoStageStaticPrompt`），逐句找是哪句把模型带偏了，再改模板（`staticTemplates.videoTemplate`、`stagePromptPresets.image_to_video.prompt`，config 和 stored_config、opsEditable 一起改）。
- 改公共模板 = 影响所有案例：写成条件句（「多人对戏时…」），单人口播不受影响；改前量最长那单的字节（grok 硬上限 4096B）。
- 下「模型做不到」的结论之前，先把提示词变量做满再烧单。相关 [[feedback-prompt-change-hard-rules]] [[project-thinknova-short-drama]] [[feedback-tech-list-only-actionable]]
