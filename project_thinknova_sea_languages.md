---
name: project-thinknova-sea-languages
description: "触发:动输出语言/多语言测试/东南亚语言之前 → 08-04 现状:视频线 vi/id/ms 已上前台(编剧层验证通),海报线三语已回滚(copyLanguage 不进文案层=技术卡);加语言正门配方"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-03T15:00:53.519Z
---

# 东南亚语言扩充(2026-08-04 凌晨,老板令:补 SEA 语言+测正确性/流畅性)

## 现状
- **视频 agent(offline_store_video)**:前台语言 8 个 = zh_cn/en/ja/ko/es + **viβ/idβ/msβ(08-04 新增)**。ms 全新配齐:languagePolicy.map.ms + opsEditable.languageMap.ms 双写指令、lineValidation.ms(words 26-46,byDuration 10:18-30/15:26-46)双镜像。**编剧层语言链路已验证通**:ms 单台词真马来语("Baru dilancarkan, teh lemon ini tersedia untuk anda…")。**TTS 语音流畅性未测**——被 video 通道故障阻塞(8/8 video_child_create_failed),通道修复后烧 en/es/vi/id/ms 五语矩阵听感+量语速静默。
- **海报 agent(offline_store_content)**:三语加了又**回滚**(现行仍 5 语)。病根实测闭环:**copyLanguage 没传入文案子任务**(copy input 仅 602B 无语言字段)→ 文案永远中文 → 成图语言全靠 gpt-image-2 现场翻译:en 全对/vi 只翻一角/ms、id 完全不翻。**中英对是模型能力兜底,不是链路对。** 已进技术卡 OPS-POSTER-20260803-02 问题2;修复后重开三语烧验(验收=copy 输出即目标语言)。
- **th 泰语**:languagePolicy.map 有指令,但泰文画面渲染+TTS 双风险,暂不开前台。

## 加语言正门配方(配置JSON说明书(3),07-30)
1. `businessUi.detailOptionGroups.copyLanguage`:`optionsMode:"replace"` 整表替换;新语言 options[] 加条目(六语 label + `beta:true` 标 β);
2. **启用语言必须在 `promptComposer.languagePolicy.map` 有指令**(现 15 语含 ms);`opsEditable.languageMap` 同键镜像双写;
3. 视频线加 `lineValidation.<lang>`(顶层+byLanguage 双镜像,含 byDuration);
4. 商家端 config 回读确认前台可见。
- ⚠️ 但正门配齐≠海报能用(copy 层缺语言注入,见上);视频线配齐即编剧可用。

## 关联烧测单(08-04)
海报五语对照:en task_217afe75f7d9 ✓ / es task_8d7f88339771(未逐字验) / vi task_d6a3ea739705 ✗半 / id task_c91e21fc2ffe ✗ / ms task_e133be5cbf21 ✗。视频:zh task_a8087673c381 / ms task_a7dd93a3cb9f / en task_0141981872d3 全死于通道故障(台词层已出稿可查)。

## 待办
1. video 通道修复后:烧五语视频矩阵,量语速/静默/断句 + 老板耳听流畅性;zh 单同时验句间停顿0.1秒+逐格跟随性硬规+补充说明前置指针(三改动都在库里未验)。
2. 海报 copyLanguage 修复后:重开三语+烧验。
3. ms/id 清真敏感规则(猪肉/酒精不入马来/印尼语物料)预埋行业层——未做。
4. th 泰语等 ms/id 跑通后评估。

关联 [[project-thinknova-poster-scene-revamp]] [[reference-thinknova-tech-docs-index]]
