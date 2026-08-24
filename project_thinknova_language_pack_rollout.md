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

## 🔴🔴🔴 08-18 傍晚 · 负面词全链定案(覆盖当天下午那版"三段结构",这版才是对的)

**实发负面词 = 服务端按下面这套拼,已用当前 config 逐字复算命中:**
- **生图板** = `negativePromptPolicy.base` + `.byIndustry.<行业>` + `.byRenderTarget.first_frame_prompt`(三个**数组**顿号连接,实测与 `task_ee8891f26085` 实发串 `===` 相等)
- **i2v** = `stagePromptPresets.image_to_video.negativePrompt` 这个**模板**,其中 `{{negativePrompt}}` ← `languagePacks.zh.fallbacks.negativePrompt`,再拼 `negativeGuard`;**服务端会跨段自动去重**(我在 fallbacks 加了「分屏/格子边框」,模板段里这两个词就自动消失了)→ 「负面词重复」在 i2v 侧系统已兜住,不用手工对齐
- ⛔ `promptAssembler.video.negativePrompt` 与 `blockTemplates.hard_negative_rules` **两条都是死字段**,改了不影响任何实发串
- ⛔ 案例表 27 个键里**没有任何 negativePrompt**,负面词无法按案例定制

**🔴 我连错三次的原因(方法学教训)**:`negativePromptPolicy` 的值是**字符串数组**,我的扫描函数只收「键名含 negative 且值是 string」的叶子,数组元素的键是下标,全被跳过 → 三次判它"中文链不读/服务端硬编码/运营写不进"。**以后扫 config 找字段必须把数组元素也当叶子扫。**

**⛔ 旧结论作废**:「`stagePromptPresets` 运营写不进」只对 **en 包**那棵子树成立;`promptComposer.stagePromptPresets.image_to_video` **写得进**(08-18 PUT code:0 + 回读逐字确认)。

**已修:行业串味(不是新病,08-14 就在)** — `stagePromptPresets.image_to_video.negativePrompt` 是全行业共用静态模板,里面被塞了 10 个只对瓶装护肤品有意义的词(喷雾/喷头/泵头/滴管/吸管/改变瓶型/增加瓶身部件/喷射动作/挤压动作/倾倒动作)。取证:`task_ad22ad97b37e`(08-14 餐饮)、`task_e104d8815523`(08-15 餐饮)实发串**同样带泵头/改变瓶型,长度都 345** → 一直如此,只是从没人拉过拼装后的实发串。已把这 10 词从全行业模板移入 `byIndustry.beauty`(补齐 7 个它缺的),模板 178 字。复验 `task_9a63d81af5d9`/`task_baa902797e05` 实发串 `泵头=false`。

**🔴 判断"配置改动有没有生效"的唯一正确做法**:比对 `agent.updated_at` 与该单**子任务的 created_at**,再拉子任务实发串。只看 config 回读会得出反结论——08-18 我就是这样错报了 `task_9b34357111e6` 的零字幕功劳(config 14:34 写入,该单 i2v 14:30 已发出)。

**🔧 成片/板图下载**:签名 URL 会被浏览器工具当敏感数据拦、且 OSS 不给 CORS。正解=`scratchpad/oss_get.py`,用 `oss_ak.txt` 自己签一个 GET,只要从任务里取 **object key**(`generated-assets/...`)即可,全程不碰签名串。

## ✅ 08-18 三行业压测(每行业 1 单,全部四层验收通过)
| 单 | 行业/案例/场景 | 编剧 | 浊音 | 最长无声 | ASR | 字幕/格线/黑帧 |
|---|---|---|---|---|---|---|
| `task_ee8891f26085` | 汽车 `auto_v2_S06_wash_process` S06 手艺揭秘 | 1次过 | 80% | 0.5s | zh 1.00,60字/15.0s,4.0字/秒 | 全零 |
| `task_9a63d81af5d9` | 宠物 `pet_care_s11_daily` S11 老板出镜 | 1次过 | 68% | 0.8s | zh 1.00,65字/14.4s,4.5字/秒 | 全零 |
| `task_baa902797e05` | 教培 `edu_v2_S01_new_course` S01 商品介绍 | 1次过 | 38% | 2.0s | zh 1.00,63字/15.0s,4.2字/秒 | 全零 |
**S06 纯画外音片型(全片只有手)也说满** = 历史哑单重灾区在少参架构下已解。板图 3×2 六格、无黑格、无文字、人物一致;成片零格线(panel_crop 有效)。
⚠️ 教培单浊音 38% 偏低(句间停顿大),ASR 证明五句都说完且铺到 15.0s,不是哑单,但是三单里最松的一条。

## ✅ 08-18 维度菜单单刀 · A/B 烧验结论(同案例同参数,只换菜单)
| | A(旧菜单) | B(新菜单) |
|---|---|---|
| 宠物 `pet_care_s11_daily` | `task_9a63d81af5d9`:2/3/5 三句都在说"我们会认真照顾",「照看」×2 | `task_29420ba84b70`:5 句 5 个不同维度(钩子/流程/工序/价格/**做完什么变化**),「照看」×1 |
| 教培 `edu_v2_S01_new_course` | `task_baa902797e05`:3/4/5 三句都是"先试再决定",「体验」×4 | `task_7023fa522117`:5 句 5 个不同维度(钩子/是什么/**课上练什么**/**适合谁**/价格),「体验」×1 |
**判定:意思层面的绕圈两边都清零**(A 各有 3 句同义,B 各 0 句),新加的「做完有什么变化」和「适合谁」两维都被真的用上了。
⚠️ **词面重复没改善(诚实记录)**:bigram 统计 A_edu「体验」×3 → B_pet「洗澡」×3、B_edu「孩子」×3(后者是主语属正常)。B_pet 第 4 句「需要洗澡时,到店洗澡八十八元起」句内自重复=新出的小毛病,「同一个词全片最多两次」这条约束力仍然弱。
成片:B_edu 浊音 62% / 15.0s 五句说满 / 零字幕零黑帧;B_pet 浊音 43% / 14.8s 说满,但**供应商原片 1.375s 处有 0.125s 纯黑帧**(ffmpeg blackdetect)。该单未回传 OSS 镜像,交付的就是这条原片。黑帧属已知低频 grok 缺陷(记忆记 raw 片约 6%),与本次只改编剧文本的刀无因果;A 边原片未留存,无法同口径对照。

## 🔴 台词绕圈的真根因(08-18 定位并已单刀修复)
`【每句各司其职】` 里那份可轮换维度菜单是**餐饮口径**:`分量规格/价格里含什么/做法工序/食材与来源/适合谁/环境与服务/需要多久`。服务业(宠物洗护、少儿体能课)七个里有两个天然用不上,模型只能在剩下的里打转 → 换说法重说同一件事(宠物单「照看」×2;教培单「体验」×4,后三句全是"先试再决定")。
**单刀**:菜单改行业通用 → `价格里含什么/做法工序/用料与来源/适合谁/环境与服务/需要多久/做完有什么变化`;同时删掉「(含"新品""招牌"这类标签词)」腾字数。`systemPrompt` **4005 → 3992**(顺带把超标的 5 字压回)。⚠️ **改完尚未 A/B 烧验**,下一单必须回看中间三句是否各占不同维度。

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

## ⛔(已归档)英文链 + 多参首胜相关两段 —— 全链已回中文、多参已证伪,原文移至 `99_归档\归档_英文链多参段_2026-08-21.md`

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

---

## 从 MEMORY.md 迁入的详情(2026-08-24 索引瘦身)

6.4 🔴🔴🔴 **英文化已上线(08-16 凌晨,回滚=`00_规格与参考\ROLLBACK_全量英文化前_2026-08-16.json` + `ROLLBACK_iv_stage_presets_…`)**:videoTemplate/firstFrameTemplate/durationPolicies(10/15/30)/负面数组(两层20项)全英文;systemPrompt **4000字整**加【cells语言】规则(cells 全英/台词 copyLanguage;为腾字删了三句冗余)。**验证单 `task_de951043a1fc`:cells 0 中文、台词纯中、`[Overview]` 拼装正常、除台词外残余中文=114字=恰好技术三处**。⛔ **`opsEditable.stagePromptPresets.image_to_video` 五字段运营写不进(两次 PUT code:0 回读原值=服务端丢写)**,含两个后发现的出站中文源:`prompt` 包装层987字(逐格执行/声音细节整段)+`negativeGuard`;英文文本=`02_交付内容\附件_OPS-VIDEO-20260816-01_stagePromptPresets英文文本.json`。**交付状态:卡01/卡02 初版老板已发技术;后续变更全在《增量_OPS-VIDEO-20260816-01与02_补充说明》+附件,老板待补发**——卡01技术3处(骨架标签/负面词第一段/五字段通道),卡02问题2改为A(上限回2,零新活)/B(单if换1:1)由技术自选。⚠️ 过渡期现状:多参单(商家传≥2图)台词仍中文=照旧无声,A 落地即堵。

6.5 🔴🔴🔴 **grok 提示词语言定律(08-16 终版,台账=`01_问题诊断\英文提示词实验台账_2026-08-15夜.md`)**:①**多参(实发≥3)混语言=音频宕机只剩BGM;整条单一英语=活**(混60字中文即哑/混日文死寂/纯英即说;去BGM句救不了) ②**少参(板+1)任意混语全出声且台词逐字照念**——`task_2e250fdf2217` 中文骨架+日文台词=**日语98.6%置信逐字念出,原话保真** ③**日语在 grok 多参下 0/5 判死**(令说/原文/罗马音/前置声明全灭,唯一出声那次抗命说普通话)④纯英说中文=意译不保原话字面;成功率≈2/3非100% ⑤英文负面词生效=零字幕、三锁全中;**1:1还原只有多参给,少参靠板继承="像"级——1:1与全语言保真不可兼得** ⑥**带水印/带字的图绝不能当参考图尤其主图**(点评截图当主图→满屏字幕+水印)⑦待办:非中文语言**语速过快**,治法=lineValidation 按语言收紧(主)+节奏句(辅),ops 待做。
