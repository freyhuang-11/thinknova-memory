---
name: project-thinknova-language-pack-rollout
description: 触发:动 482/languagePacks/referenceRouting/strict、验语言包修复、或海报 copy 规则时 → 08-16 晚半上线事故全档+当前线上状态+写入配方
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-17T21:26:32.913Z
---

# 语言包+动态参考图(08-16 事故→08-17 技术修复→按文档执行)

## ⛔(已作废)08-17 深夜英文链教义 —— 被 08-18 少参定稿整段取代,勿再执行

## 🔴🔴🔴 08-18 下午定稿(覆盖本文件此前一切结论,最新真值)
**老板拍板的架构**:grok 一律走**少参**——不管商家传几张图,图生视频只收到「分镜板 + 1 张参考图」,锁定全部在生图层做进板里。多参已证伪(哑单税不可控)。
**线上配置(08-18 14:30)**:482 = `{promptLanguage:'zh', strictOutboundLanguage:false, allowMerchantMultiReference:false}`;`referenceRouting = {multiReferenceLimit:2, smallReferenceLimit:2}`(双保险,任何路径最多板+1)。**全链回中文,英文包停用**。
**实测**:板+1 配置下连烧 3 单(板独/美业3图/餐饮2图)**零哑单**(浊音 70%/65%/38%)。
**三层提示词现状(全中文)**:编剧 systemPrompt 4000 字(语气规则齐:情绪爆点/机器味/多馋一分/不是念稿/松口加语气词/禁"价格明白"总结腔/谁怎样地说;08-18 新增**换说法重说同一个意思也算重复**治"一只吃两只分着吃"式绕圈);画板 firstFrameTemplate 中文原版+顶部板结构硬规(3×2/禁黑格/锁三图)+零字幕;视频 videoTemplate 中文原版+顶部必须出声硬规,**禁文字规则放在 {{cells}} 之后**(贴画面描述,复刻原版位置)。
**🔑 负面词三段结构(08-18 晚·拉实发串对账定案)**:i2v 实际收到的 negative_prompt = **A + B 两段(
 拼接)**,生图板收到 **C + B**。
- **A = `promptComposer.languagePacks.zh.fallbacks.negativePrompt`(+opsEditable 镜像)** → 只落 i2v;
- **B = 服务端硬编码**(config 全量搜索零命中,含 六宫格/分屏/泵头/格与格粘连 等),运营动不了;
- **C = `promptAssembler.video.negativePrompt`** → 落生图板;
- ⛔ 案例表**没有任何 negativePrompt 字段**(已核 27 个键),负面词不能按案例定制;
- ⛔ `negativePromptPolicy.byRenderTarget` 中文链不读(旧结论保留作废)。
**⚠️ 自我纠错**:`task_9b34357111e6` 的零字幕**不是负面词的功劳**——agent updated_at 14:34:38 晚于该单 i2v 14:30:31,那单发的是旧串。零字幕来自 videoTemplate 里 `{{cells}}` 之后那条禁文字规则。**教训:判断"某次配置改动是否生效"必须比对 agent.updated_at 与子任务 created_at,不能只看 config 回读。**
**08-18 14:55 负面词改版(去重+补充,已回读)**:A(134字)去掉字幕概念的 7 词堆叠压到中英各一组,新增 `无人声/只有背景音乐/口型对不上/静止不动的画面/黑屏/分屏/网格线/格子边框`;C(64字)三种"腔"合并为一,新增 `多指/假塑料质感/摆拍感/空镜/纯黑格/格与格粘连`。

**🔑 负面词真通道(08-18 回源纠正)**:实际发出去的是 **`promptComposer.languagePacks.zh.fallbacks.negativePrompt`**(+opsEditable 镜像)+ 技术文档指定的 `promptAssembler.video.negativePrompt`;⛔ 我之前一直改的 `negativePromptPolicy.byRenderTarget` **在中文链上根本不被读**——"运营写不进负面词"的旧结论**作废**,是我找错字段。已写入禁字幕词(字幕/subtitles/captions/on-screen text/水印)。
**多语言窗**:byLanguage 13 语齐;08-18 修正 en 回真实语速口径(15s 30-44 词)、ja/ko 补 byDuration(10s 36-56 字)治语速飙快。
**待验**:字幕是否根除(负面词刀后第一单)、台词防重复刀效果。
**⛔ 烧验纪律**:古法窑鸡案例已烧几百单,**永久退休**;每单换案例换行业(美业素材:人2644/精华瓶2132/门店2696)。

## (历史)08-18 通宵闭环 · 英文链多参达标 —— 已被上面的少参定稿取代
**结果**:5 条达标片(桌面 `美业_达标片_台词铺满15秒_task_4ec671de7453.mp4` 等),说普通话+铺满15秒+三锁+板3×2+出站零中文。晨报=`02_交付内容\晨报_通宵闭环结果_2026-08-18.md`,逐单证据在验收台账末节。
**三个真根因(此前全被误判)**:①**en 链 i2v 模板只有 244 字节、里面没有任何"要说话"的指令**(中文模板的【口播节奏】等在英文链整段丢失)=英文单反复哑的结构性根因 ②成片说英语=`Speak naturally in Mandarin:` 前缀被 grok 丢掉照念英文 ③台词只说一半=该前缀被字数校验计数吃掉 40% 预算。
**已落库 10 处**:en 模板补齐(必须出声/节奏/开场/收尾/零字幕,1065字节)|语言改从 concept 的 `Spoken language: X` 读+禁念英文原文|取消逐句前缀(源=`languagePacks.en.scriptwriterInstruction`)|窗 44-58 词(**生效键 `lineValidation.byLanguage.en`,不是 `.en`**)|画板 firstFrameTemplate 顶加 [Board structure] 硬规(3×2/禁黑格/锁三图)→板结构与黑格已解|商品名价格保真|合规话术不入台词|说话人须出镜(含基础提示词【人物与口播】改写)|反哑负面词(en链未生效,写入通道待技术)|cells 预算 2300 字符(i2v 4000 字节硬顶)。
**🔴 实测规律(n=9)**:**人对镜说话 4/4 有声;纯画外音(手部工序)2/5 有声** → 哑单税与"画面有无可见说话人"强相关。提示词层已尽力,再往下只剩案例级改动(手艺揭秘开头加对镜说一句)=**待老板拍板**。

## 🏆 多参首胜配方(2026-08-18 凌晨 `task_f545c881fcf3`,历史记录)
- **482 = `{promptLanguage:'en', strictOutboundLanguage:false, allowMerchantMultiReference:true}`(🔴老板令:多参开关永远开着)**;
- en 附加指令=**原版 335 字**(头"You are a short-video screenwriter…",教 `Speak naturally in Mandarin:` 逐句前缀;⛔我改写的 1070/1388 字包裹版是退化点已废弃,原文可从探针单 task_56828949aadc raw system 尾部再取);
- **lineValidation.en 已放宽 18-60 词(byDuration 10:12-42 / 15:18-60)——26-46 太紧正是编剧连败真凶**;
- 首胜链:编剧 1 次过、cells 0 CJK、mode=multi 实发 3 张、出站 0 CJK、成片说普通话(语义贴台词)。技术当晚修复=校验只查语义字段(position/timeRange 豁免+枚举归一化 1..N)。
- 事故链教训:我两次重写 en 附加指令引入规则互搏(包裹格式 vs "line不加前缀")=七连败退化点;**boss 定论"问题不在技术在你"成立**。恢复成功配置+对症单刀(放宽词数窗)即通。
- 待办:多参稳定性梯队 4 单(S02/S06/S05复现/S08)在跑;稳定后按 §7 开 strict + 三类验证;strict 开启前出站零CJK已实测但未上闸。
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
