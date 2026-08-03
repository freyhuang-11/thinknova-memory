---
name: project-thinknova-sea-languages
description: "触发:动输出语言/多语言测试/东南亚语言之前 → 08-04 现状:视频线 vi/id/ms 已上前台(编剧层验证通),海报线三语已回滚(copyLanguage 不进文案层=技术卡);加语言正门配方"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-03T19:41:02.784Z
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

## 08-04 夜班终态(演示日凌晨)
- **视频五语矩阵完成 4/5**:en(44词,台词"Forget every lemon tea you've had"反常识钩子,英文编剧最灵)/es(43词)/ms(33词,曾尾巴3.5秒静默→ms 15s窗min 26→33已修)/id(停顿偏多但可用)全部出片并拷老板桌面;**vi 视频 5 连败**(死因散布 image×2/建单500×1/video×2 ≡ 供应商各层轮流抖非语言问题),第5次 task_9ecabde81891 结果待查。
- **海报 copyLanguage 技术已修**(08-03 发版):ms/id/vi 海报全对零汉字;copyMode(full/minimal/none)同版上线,S10/S11/S14≡minimal、S16≡none 已配——S11 出"干净壁纸"、S16 出"随手拍"全成。
- **中文节奏现值**:15s 窗 60-80(75 过紧曾致编剧终态失败——"别一次收太紧"第二次教训);videoTemplate 320字/816B 含【口播节奏】自然呼吸版(句号换气一拍/钩子后停一拍),实测停顿 0.18-0.8s 有层次。🔴 **动 videoTemplate 必先量最大单字节**:曾连加两段(+141字)顶穿 4096 杀编剧,老板抓的。
- 逐格跟随性硬规实验段已撤(超字节),移入待测池。

## 待办
1. vi 视频补齐(查 task_9ecabde81891;仍败则等供应商稳定后再烧)。
2. 15s 中文 60-80 语速仍略赶(78字/13.5s≡5.8字/秒),进一步收紧走"多测再上"纪律。
3. ms/id 清真敏感规则预埋行业层——未做。
4. th 泰语等 ms/id 稳定后评估。
5. 海报 vi 副标混排小瑕疵(用户 offer 英文原文保留导致)观察即可。

关联 [[project-thinknova-poster-scene-revamp]] [[reference-thinknova-tech-docs-index]]
