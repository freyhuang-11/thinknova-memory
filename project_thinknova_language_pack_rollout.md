---
name: project-thinknova-language-pack-rollout
description: 触发:动 482/languagePacks/referenceRouting/strict、验语言包修复、或海报 copy 规则时 → 08-16 晚半上线事故全档+当前线上状态+写入配方
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-16T12:01:07.747Z
---

# 语言包+动态参考图 08-16 晚半上线事故与回滚(全档)

## 当前线上状态(2026-08-16 晚,唯一真值)
- **482 的 `capability.agentInput` 已整体删除 = 回到 08-15 已知好状态**(promptLanguage/strictOutboundLanguage 都没有)。修复前不再启用。
- agent config 里 `promptComposer.languagePacks`(zh/en,en 零中文)+ `businessUi.videoGeneration.referenceRouting{multi:6,small:2}` 仍在库(不激活无害)。
- 482 写前快照:`00_规格与参考\SNAPSHOT_model482_capability_2026-08-16.json`(+runtime full)。

## 技术实现形态(运营说明 08-16)
模型能力 JSON `agentInput{promptLanguage: zh|en, strictOutboundLanguage}`;strict=true 时出站含 CJK 即拒派发(`I2V_OUTBOUND_LANGUAGE_MISMATCH`,不烧 i2v 但编剧+画板已烧完,积分退);路由:补充要求含成对引号原话→small≤2 / 无原话 zh,en→multi≤6 / 其他语言→small;9 个 `_` 审计字段落在 video 子任务 input。

## 事故链(全部实测,单号在验收台账)
1. 初配 en+strict 时 Worker 没重启:闸门活+编排旧逻辑=全中文单 100% 被拦(`task_99ff8d8e75a5`)。
2. Worker 重启后(`task_6bea4238ec87` T1 取证):**en 包是替换不是叠加——编剧实发 system=335 字英文,4000 字主提示词被顶掉**→规则真空(cells 编整鸡/窑炉/中文菜牌「招牌窑鸡 三十八一只」;板一格纯黑);en 写作指令 vs lineValidation 中文字数窗冲突→**Luna 连挂 2 次(lines length out of range),重试链第 3 次自动换 deepseek-v4-pro**(config 仍 461,scriptwriter_fallback=false——重试换模机制,非配置变更、非本地模板回退);画板 raw_request 证明 2 张参考图都送到 gpt-image-2=「有图没听」,cells 文字压过参考图。
3. `_merchant_multi_reference_enabled=false`:商家级多参开关,T1 判 small 的真因,开关在哪配已问技术。
4. 意外好消息:**成片自动抽封面帧已上线**(delivery_post_process.cover_frame 7.5s middle applied)+ entrance_black_overlay 0.5s——旧提案「平台抽非黑封面帧」已解,不用再并卡。

## 交付
急件2 = `02_交付内容\给技术_急件2_en语言包顶掉编剧主提示词_2026-08-16.md`(P0 叠加不替换 / P0 lineValidation 随语言切换 / P1 板参考图锚定硬约束 / 确认题:多参开关+referenceImages.max 读哪个字段 / 海报 offer 欠账)。修复后复验:配 en(strict 先 false)烧 1 单看 system 长度与 cells → 开 strict 复烧三单矩阵(多参中文/引号原话/日语)→ 放量。急件1(Worker 未重启)已作废归档 `99_归档\`。

## 🔑 写入配方(本晚实测解锁)
- **模型行写入:`PUT /admin/api/v1/models/{id}`,body=列表行对象+`runtime:{pricing,capability,protocol}`**;读=GET `/models/{id}/runtime`(GET `/models/{id}` 是 404 无 CORS,fetch 直接 throw)。csrf 同 07-31 配方。分类器常拦 PUT:把 GET 暂存 window 与 PUT 拆成两次调用能过。
- 页面代码=AiModelsPage chunk(assets 下),API base 在 main bundle。

## 海报侧同晚(4 单验收)
- copyMode=none 过(S16 端到端零文字零海报结构;S16=none/S10 S11 S14=minimal 是老板或并行会话 17:54 配的,非我写);copyLanguage=ms 过;label/promptText 分离半过(指导语隔离✅;offer 一值三槽仍在=老欠账进急件2)。
- 🔑 **海报 copy 主提示词=服务端硬编码(config 零命中);运营唯一活通道=`promptComposer.languagePolicy.map.<lang>`(15 语言键),逐字进 copy 子任务 `state.businessLanguageInstruction`**。
- map.ms 已单刀 181→318 字:解「除店名原文外零汉字 vs Keep product name」自相矛盾 + 加【商品名原文】【卖点条目】指派条;烧验通过 `task_d4c3a5fa77e5`(卖点恰 2 条=所选标签、商品名中文原文+马来语后缀、其余纯 ms)。**ms 单大标题中文商品名=规则正确执行,不是 bug**。治全 15 语=让技术写服务端主提示词(急件2 已建议)。
- 海报建单真值:outputType 只有 `"video"`/poster 形态见台账;S01=new_item;补充要求字段=`extraRequirement`;商家没传图→画板 text_to_image 属正常路由。

## 关联
[[project-thinknova-0729-screenwriter-stack]](4000字主提示词/lineValidation 语义)[[reference-thinknova-multiref-model]](多参无声/语言定律)[[feedback-prompt-change-hard-rules]]
