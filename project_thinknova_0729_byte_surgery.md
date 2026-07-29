---
name: project-thinknova-0729-byte-surgery
description: 触发:动 i2v 提示词/查 4096 字节/做无台词预设/选 omni-grok 模型之前 → 07-29 字节手术定案 + voiceMode 开关早已存在 + 模型×语言矩阵
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-29T10:14:36.007Z
---

# 2026-07-29 i2v 字节手术 + 无台词开关(现行状态)

## 🔴🔴 最重要的一条教训:入口不在 config,在案例表
我搜 agent config 里 `ambient_only` 只有 2 次,就断言「无台词没有入口、要技术卡」——**错**。
真正的开关是**案例级** `scriptwriterPreset = {shotCount, voiceMode}`,`voiceMode` 支持 `dialogue|none`。
675 条实测分布:**dialogue 579 / none 22 / 未设 74**。那 22 条 `none` 全是 **S14 广告TVC**(每行业一条,全部启用)——**这套机器早在生产上跑着**。
→ 通则:**查"有没有这个能力"必须同时查 agent config + 案例表 + 模型表三个源**,查一个就下结论必错。关联 [[feedback-source-truth-first-commander]]

## 🔴 omni 是「能说英文、不能说中文」(老板口述,07-29)
所以「不能说话」**不是模型的二值属性,是模型 × 语言的矩阵**。
- `voiceMode` 是**案例级** → 同一条案例中文要静音、英文要说话,**案例级开关做不到**。
- ~~模型表没有任何 audio/voice/speech 能力位~~ 🔴**这条 07-29 晚被推翻,是我拿模型名做正则、没查 `capability` 字段造成的假结论**。按 `capability` 统计,模型表里有 **`text_to_speech` 2 个 + `voice_clone` 2 个**,配音模型是存在的。基于「没有配音路径」做的一切推理作废。
- 模型表 44 条、38 个字段(`supported_sizes/ratios/resolutions/durations/source_modes` + `instruction_role/instruction_prompt/max_reference_images/fallback_model_ids`…)。**能力分布查 `capability` 字段,不要用 code/name 正则猜。**
- **技术卡建议(很轻)**:同构新增 `supported_voice_languages`(omni 填 `["en"]`);派发前若 `copyLanguage` 不在列表 → 强制 `voiceMode=none`,复用已在跑的 `fallbackPolicy.ambient_only` + `visualTemplates`。加 1 字段 + 1 判断,不新造内容。
- ⚠️ **「场景级模型设置」我在线上没找到**:`businessUi.videoGeneration` 只有 `allowedDurations / modelAllowlistByDuration / defaultModelByDuration / referencePolicyByDuration`,**全按时长切,没有按场景**;案例表也无 model 字段。老板提到的"场景级"待核。

## 🔴 i2v 底座曾有两个键自相矛盾(已修)
`promptComposer.stagePromptPresets.image_to_video` 下:
- `storyboardGuard`:「输入**仅一张图片**=第1镜的首帧画面」
- `storyboardClarification`:「输入的这张图是**六格分镜参考板**、**绝不是成片画面**」
两句同时拼进同一条提示词。翻 `panel_crop` 后**首帧确实已是裁好的单格 720×1280**,Guard 口径才对,Clarification 前段 640 字节是基于旧「整板当首帧」的过期叙事。
**两个键都有 `opsEditable` 镜像,必须双写;`videoTemplate` 无镜像。**

## 字节手术结果(07-29,已落库回读确认)
| 键 | 改前 | 改后 |
|---|---|---|
| `stagePromptPresets.image_to_video.storyboardGuard` | 210B | **65B** |
| `…storyboardClarification` | 1182B | **489B** |
| `screenwriter.staticTemplates.videoTemplate` | 1646B | **1451B** |
| config 总字符 | 139,139 | **138,490** |

**真实 i2v 提交串(同输入对照):**
- grok 415 / 15秒中文口播:**4793 ❌超697 → 3249 ✅余847**
- omni 460 / 10秒正常场景:**4650 ❌超554 → 3199 ✅余897**
- grok-fast 468 / 10秒:一直只有 1200B(它走精简拼装,字节从不紧张)

**关键动作**:「绝不自行添加装饰、道具、多余人物或额外场景」原在 **4483 字节**处(超限区),已挪进 `videoTemplate` 的【画面】段(约 3200 字节处)。这句是治「出现没提到的东西」的。

**49 条画面规则逐条审计:保留 43,丢 6。** 已补回「不晃动/不推拉/挂画」3 词(+25B)。
故意不补的 3 条:「离开网格布局」(panel_crop 后是错的)、「按板第2到第6格演进」(cells 本身就是那6格,vt 有「按下方子格顺序推进」)、「绝不高饱和艳丽塑料感」(「调色克制不塑料」已覆盖)。

## 07-29 烧单实况
| 单 | 模型 | 结果 |
|---|---|---|
| task_0c869923933c / 95969a81a6ae / cd24921b0b9f | 415 grok | ❌ 无渠道(502 lk888 无可用渠道分组 / No active provider account) |
| task_50f581ec0267 | **468** | ❌ 503 No available channel for **grok-imagin…** → **468 底层也是 grok**,不是 omni |
| task_0cffd88f6ce9 | 460 omni | ✅ 出片 |
| task_ae6041192843(手术后复烧) | 415 | ❌ 仍无渠道,但 **i2v 3249 ✅**,字节雷已拆 |
| task_0b842e18a73c(手术后复烧) | 460 | 生成中,i2v 3199 ✅ |

**grok 415/468 全天无渠道 → 一镜到底/裁格/语速/人物拉长 四条今天零结论,不许拿 omni 的结果替它下判断。**

## `task_0cffd88f6ce9` 逐帧定案(omni 460,10秒,联系表 `0729_烧单核验/SHEET_D460.jpg`)
- ✅ **产品锁色成功**:20 帧瓶身透明玻璃+银盖+白标蓝字全程一致。**但不能归功于我改的锁色句**——查了 `referenceImagePrompts.product` **根本不在 i2v 提交串里**(它进 i2i/策略层),产品锁住是首帧板本来就画对了。
- 🔴 **画面飘 + 出现没提到的东西**:背景连续形变(走廊→人像海报柜台→白台面→白毛衣女人→香水试管货架),中段冒出多余人物和道具。
- ✅ **有台词**(转写:「芯诗妍蓝铜胜肽肌底液50ml…商品细节…质地先看清,选择之前慢慢看…做完护肤正好用上它」),说满 0→10 秒,语速正常。**但 omni 中文台词乱是老板明令要避免的,这单台词不作数。**
- 「没跟分镜板」**不是配错也不是板没传**(板作为 ref1 1330×1182 传了,首帧 720×1280 裁格正确,「按分镜板第2到第6格演进」在 3942B 在限内):是**案例片型**写死「沉浸微距·手艺型:全片只用微距与大特写,零远景零全景…五格微距细节递进」——忠实执行出来就是一条连续推近。**选案例要看片型。**

## 待办
1. 盯 `task_0b842e18a73c` 出片 → 抽帧验防加戏那句挪进限内后还加不加戏
2. grok 渠道恢复后复烧 15 秒口播,验一镜到底/裁格/三锁/语速
3. 技术卡 2 张:①`lineValidation` 缺时长维度 ②`supported_voice_languages` 模型×语言
4. 案例 675 条文案去重(508 条改写草稿待老板过目)

关联 [[project-thinknova-0729-koubo-defect]] [[reference-thinknova-prompt-architecture]] [[project-thinknova-storyboard-test]]
