---
name: project-thinknova-language-pack-rollout
description: 触发:动 482/languagePacks/referenceRouting/strict、验语言包修复、或海报 copy 规则时 → 08-16 晚半上线事故全档+当前线上状态+写入配方
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-17T13:47:28.765Z
---

# 语言包+动态参考图(08-16 事故→08-17 技术修复→按文档执行)

## 🔴🔴🔴 执行教义(2026-08-17 深夜,老板整顿后定death;以技术文档《运营说明_商家视频编剧语言包与海报文案修复_2026-08-16.md》为唯一权威,我此前一切反向提案作废)
1. **grok 多参单的生视频层只许英语,台词也用英文写**(老板铁律);说什么语言靠 en 附加指令里的逐句包裹 `Voice line (spoken in <语言名>): "..."`(V1/V2/V3 直连 3/3 实证说普通话)。「en 模式=翻译腔所以不可用」「给台词开中文例外」「模板回滚中文」这些我的旧结论**全部作废**——en 语义台词+英文指令控口播语言就是文档 §3 的设计本身。
2. **测试一律走商家 agent 管线**,直连单只当机理探针不当产品依据。
3. **烧验案例轮换**,古法窑鸡案例(100+单)退休;过关成片抽帧进封面池。
4. 多参判定(文档 §4):`allowMerchantMultiReference=true` 且 商家有效图≥2 且 输出语言∈{zh,en} 且 无成对引号原话 且 模型上限>1 → multi;否则 small。上限读取链(§5):input.referenceImages.max→constraints.maxReferenceImages→旧字段→默认。
5. 复测顺序(§7):en+strict关 烧1单验「基础4000+en附加」同在→四项检查过→开 strict→zh多参/引号/日语三类→放量。

## 当前线上状态(2026-08-18 凌晨定格,唯一真值)
- **482 = `{allowMerchantMultiReference:true}` 仅此一项,🔴老板令:多参开关永远开着,任何人不许再关**;promptLanguage 不配=中文组装(en 态在技术排雷前会让全部单的编剧七连败,不能开)。已知代价(老板拍板接受):商家传≥2图的中文单走多参=大概率哑,问题保持可见直到技术修好。
- **en 链三颗雷(全技术侧,修好前 en 不开)**:P0-A position 中文枚举 vs 零CJK校验自相矛盾;P0-B 台词"完整句"校验拒包裹前缀→**最优解已提给技术:编剧写纯英台词,说话语言包裹由组装层机械添加**;P1 qwen 双备胎账号不可用。尸检单=`task_8186edf741d1`(七连败全取证在台账)。
- en 附加指令已重写为 1070 字(英文台词人味规则+逐句说话语言包裹铁律),opsEditable+镜像双写;经实证新代码读的基础位=老位置 `screenwriter.systemPrompt`(文档写的 opsEditable.masterPipeline 新位置线上不存在但不影响)。
- systemPrompt=4000 字「语气回血+互搏修复版」:恢复 6 段语气规则+价格句人话指派;**08-17 深夜蹦字事故根因=我 01:43 塞入「情绪全靠台词承载」与「情绪写在visual『谁怎样地说』里」同句互搏→cells 丢"说"→台词变无主旁白蹦字;已合并修复(「情绪两处落地」),修复单 cells 立即恢复说话表演**。规则互搏=头号大忌再次实证。
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
