---
name: reference-thinknova-video-studio
description: 触发:动商家视频工作台(长视频拼接线 offline_store_video_studio)的任何配置/提示词/宣传口径前必读;含与旧管线的隔离关系与当前未就绪项
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-31T18:16:43.359Z
---

# 商家视频工作台(长视频自动拼接线)· 现状源

权威源:`00_规格与参考\技术侧文档\运营说明_商家视频工作台Agent_2026-08-31.md`(技术 v1.0,08-31 发)。以下只是索引摘要,动手前回源。

## 它是什么
- 新 Agent `offline_store_video_studio`,前台 `/app/business-video-studio`。流程:资料→编剧出镜头时间轴→**逐镜头**生成分镜图(人工审核)→逐镜头生成视频(人工审核)→后期配音+字幕+硬切合成。核心卖点=**先审后花钱、哪段不满意只重做那一段**——就是老板 08-31 要宣传的"长视频自动拼接"。
- 🔴 **与旧管线 `offline_store_video` 完全独立**:页面/任务/案例库/配置/Worker 全不共用。⛔ 旧线的一切实测结论(三链字节账/videoTemplate 黑场句/4000字上限/lineValidation…)**不许外推到新线**,新线的账要重新立。

## 关键口径(对外宣传相关)
- 镜头时长是**动态 3-8 秒**(编剧按内容排),5 秒只是默认参考——⛔对外别说"每段固定5秒"。雷达线 D5/D6 预告文案("short clips joined, swap that part")与实情相符,继续用。
- 🔴 **仍未上线**:老板 08-31 亲口"语音语速情绪还没好"(TTS 层在调);技术文档§7 上线清单(迁移/账号/预检 ready:true/真实联调)未确认完成。**对外维持 coming soon 口径,不承诺时间不演示界面。**

## 运营要点(轮到我配的时候)
- 配置在后台 Agent 的 `config_json.studioWorkflow`;两段提示词:`scriptwriterPrompt`(⛔不写死镜头数;必须要求每镜头台词+durationSeconds,总和=用户选的总时长)、`storyboardPrompt`(必须写"单张完整全屏,不得拼图/网格/字幕/水印;参考图优先于文字臆造")。
- 默认后期配音(voiceover)**不做口型同步**;正脸口播要单独启用 Sync Lipsync 2(加一次调用费)。TTS 超镜头长返回 `SHOT_VOICE_TOO_LONG`→精简台词,系统不裁句。
- 计费:编剧/分镜/每段视频/每段 TTS 各自独立按模型价;拼接字幕封面免费;父任务 credit_cost=0,扣费看子任务。
- 审核重点:镜头总时长=项目时长/台词不虚构/跨镜头人货场一致/分镜无宫格水印/画幅一致。
- 上线后验收:竖屏 9:16 和横屏 16:9 字幕各验一条;首单 15 秒联调过了再放 20/30 秒。

## 关联
[[project-thinknova-language-pack-rollout]](旧视频链,勿混) [[feedback-boss-rulings]](08-31 长拼接宣传口径) [[reference-thinknova-tech-docs-index]]
