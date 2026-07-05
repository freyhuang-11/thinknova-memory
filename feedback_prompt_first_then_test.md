---
name: feedback-prompt-first-then-test
description: "烧积分实测前先把提示词/配置层可控变量做满;没做穿提示词不许下'模型能力'结论"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

在平台/直连烧积分做实测之前,先把提示词和配置层能补的变量全部补到位,再开测。

**Why:** 2026-07-06 多语言矩阵测试:语言注入只上了一版通用弱补丁就连跑 7 单(约 250 积分),看到日/泰/阿正文仍中文就下了"模型能力梯度"结论——被用户点破"你语言上的提示词补齐了吗你就生成"。半成品提示词跑出的失败,分不清是提示词未尽还是模型边界,结论不可用,积分白烧。

**How to apply:**
- 测试前自查:这个维度的提示词/config 是否已做到当前能做的最强?没有就先补再测。
- 下结论区分两类:"提示词未尽(可修)" vs "模型边界(架构级)";只有提示词做穿后仍失败,才允许写"模型能力"结论。
- 同理适用:改完 config 必须单点验证(4096 事故同日教训,见 [[project-thinknova-offline-agents]]),两条合成一条纪律——**改前做满,改后验一**。
- 关联 [[feedback-understand-before-judging]] [[feedback-tech-doc-delta-delivery]]
