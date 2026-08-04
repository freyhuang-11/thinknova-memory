---
name: project-thinknova-sea-languages
description: "触发:动输出语言/多语言测试/东南亚语言之前 → 08-04 现状:视频线 vi/id/ms 已上前台(编剧层验证通),海报线三语已回滚(copyLanguage 不进文案层=技术卡);加语言正门配方"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-04T15:28:48.056Z
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

## ✅ 08-04 午后:老板新令四项执行完毕(登录恢复后)
1. **✅ 输出语言泰语+去β已上线双前台**:视频+海报两 agent copyLanguage 均 = 9 语全无β(zh_cn/en/ja/ko/es/vi/id/ms/th),商家端 config 回读双确认。th 选项 label {zh:泰语,en:ไทย,ja:タイ語,ko:태국어,es:Tailandés,vi:Tiếng Thái} sortOrder 90。视频 agent th lineValidation 已写四镜像(masterPipeline+opsEditable × 顶层+byLanguage):`{metric:characters, 15s:50-90, 10s:35-60}` **标待复测**(老板令不测试直接上,但泰文 TTS/渲染从没烧验过,首个泰语单出问题先查这)。languagePolicy.map.th(303字)+opsEditable.languageMap.th 后端原本就有。
2. **✅ 界面语言技术需求已口头交老板转技术**:补 th/ms/id 三个前端 i18n 语言包(UI 现 zh/en/ja/ko/vi/es 六个,输出语言九个,缺这三个对齐)。
3. **✅ grok 多参餐饮单 = 成功且结论重大**:task_d9eda0289fc3(探店案例/古法窑鸡/15s/zh,scene=2935 P5门头+product=2926 P6砂锅鸡,旧asset_id复用免重传,派发482确认/编剧gpt-5.6-luna无回退)。**成片逐帧结论:①门头文字级锁定——「Huan xi 欢喜大排档」真实招牌+广东美食黄灯箱直接进片(比分镜板还准,分镜板只到风格级);②产品近乎复刻P6(同陶煲/鸡爪/芝麻/香菜);③15秒切了约5个镜头(门头出场→递煲→产品特写→吃鸡→店内收尾),旧"grok不硬切/一镜到底"的短板被多参明显缓解;④人物全程一致**。多参上线前后判若两个模型,探店片型可以拿这个当标杆配方。成片在老板桌面 grok多参测_欢喜大排档砂锅鸡15秒_task_d9eda0289fc3.mp4。P4 店内图无对应参考位,弃。
4. **✅ vi 视频解禁**:第5单败于**供应商 402 TT API 欠费**(03:32,积分全退;vi 累计6败全是基建层,语言链路零失败),欠费当天上午恢复后补烧 task_bcff16537292 **一次成功**:多镜头推进、画面自动越南本地化(整鸡+香蕉叶+陶杯),停顿 1.0-1.36s×3 无死尾。⚠️ vi 台词逐字未验(见下条接口变化),编剧 source=text_model 无回退。成片在老板桌面 语言测_越南语15秒_task_bcff16537292.mp4。
5. 🔴 **接口变化(08-04 下午发现)**:商家端 `GET /api/v1/ai/tasks/{子任务no}` 现在对子任务一律返回 task:null(旧法失效)——**子任务取证改走 admin `GET /admin/api/v1/ai-tasks?keyword={taskNo}` 列表**(有 model_name/scriptwriter_fallback/prompt截断280);主任务 `?assets=1` 的 output.childTasks.scriptwriter 内嵌 source/fallbackReason 仍可判回退。台词全文两路都拿不到=验语言只能靠听成片或分镜。
2. 15s 中文 60-80 语速仍略赶(78字/13.5s≡5.8字/秒),进一步收紧走"多测再上"纪律。
3. ms/id 清真敏感规则预埋行业层——未做。
4. th 泰语等 ms/id 稳定后评估。
5. 海报 vi 副标混排小瑕疵(用户 offer 英文原文保留导致)观察即可。

关联 [[project-thinknova-poster-scene-revamp]] [[reference-thinknova-tech-docs-index]]
