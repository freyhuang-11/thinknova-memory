---
name: feedback-prompt-conflict-and-hard-checks
description: "触发:改任何提示词层(编剧/识图/画面风格/案例visualHint)之前 → 先扫互搏、认清服务端硬校验、记住 opsEditable 双写坑。2026-09-15 三次翻车的总结。"
metadata:
  node_type: memory
  type: feedback
---

# 改提示词前必过的三关(09-15 立)

## 一、画面出问题的主因是互搏,不是缺要求
实例:案例的「行业镜头语言」要求「暖而干净的食物光、浅景深」,而 videoStyle「纪实生活感」写着「不刻意打光」→ 模型收到相反指令 → 人物与光都不像。
**动画面/台词前,把这四处两两对撞扫一遍**:`optionRules`(各组选项规则) × 案例 `visualHint` 里的行业镜头语言与台词方向 × 编剧 `systemPrompt` 的【场景要点】 × `stagePromptPresets`(t2i/i2i/i2v 三段)。
**Why**:同一件事两处写法相反,模型不会报错,只会给出四不像的结果,而且极难归因。
**How to apply**:新增一条规则 → 先全文搜同义词 → 找到相反条款当场合并,只留一条权威表述(CLAUDE.md 单一权威)。

## 二、编剧 systemPrompt 有服务端硬校验,删了就整单挂
- `lines 条数必须严格等于 shotCount`
- **每条必须是完整句**(报错原文 `OFFLINE_STORE_SCRIPTWRITER_FAILED: scriptwriter lines are incomplete sentences`)
09-14 我重写【台词量】整段时把「每句必须是自然完整的口语句」连带删掉,又加「允许口语的不整齐」→ 模型写半截话 → 重试两次全挂。
**改这段前必须确认这两条还在。**

## 三、opsEditable 双写坑(PUT 200 但不生效)
写 `promptComposer.masterPipeline.materialAnalysis` 会被**静默丢弃**;必须同时写 `promptComposer.opsEditable.masterPipeline.materialAnalysis`。`optionRules` 同理。
⚠️ 反过来:`languagePolicy.map` **可以直接写**(旧记忆说写不进,09-15 实测推翻;两条 agent、9 语言键、opsEditable 镜像全部生效)。
关联:[[reference-thinknova-paths]] [[project-thinknova-0729-screenwriter-stack]]
