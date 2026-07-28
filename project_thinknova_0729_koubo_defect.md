---
name: project-thinknova-0729-koubo-defect
description: "触发:要动口播单/i2vReferenceStrategy/videoTemplate/烧口播验证之前 → 先看这条:owner_speaking+shotCount=5 的 50 条案例仍走整板,是口播不一镜到底与人物拉长的共同上游"
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-28T19:27:39.934Z
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
---

# 口播单缺陷链(2026-07-29 实测定案,商家单 `task_8fd0bb09c351`)

## 取证单
- 商家单 `task_8fd0bb09c351`(tracyyapbiz@gmail.com,2026-07-28 19:30:31),案例 **`fashion_v2_S10_styling_tip`**
- i2v 子任务 `task_e370d51de4a3`,模型 `grok-imagine-video-1.5-preview`(前台「口播优先版 · 15秒」)
- 关键输入:`appearanceMode=owner_speaking`、`shotCount=5`、`copyLanguage=en`、`_i2v_reference_strategy=storyboard_board`、`size=720x1280`、`ratio=9:16`、`seconds=15`
- 成片实测:**15.04 秒足秒**、720×1280、无 SAR/DAR 异常

## 🔴 缺陷链(一个上游,三个症状)
**上游:口播单吃到整板 `storyboard_board`。**

1. **不一镜到底** ← `videoTemplate` 的【口播锁定·最优先】原文是「**若首帧是单人对镜口播**:…长镜头到底;**否则**按下方镜头顺序推进」。首帧永远是六宫格板 → **这个条件从来不成立** → 每单口播都掉进 else → 逐镜推进。
   实测画面分布:0–3s 人物讲述 / **3–9s 布料手部空镜** / 9–12s 折衣中景 / 12–15s 人物讲述 → **15 秒里只有 6 秒有人在讲**。老板说的"15秒出了10秒的内容"就是这个,**不是时长不够,是内容密度**。
2. **人物被拉长** ← 参考图(六宫格板)实测 **1312×1199 = 比例 1.094**,出片 **720×1280 = 0.5625**,**差 1.94 倍**。第 0 帧就是整板被非等比压进 9:16(横向压到 51.4%)。实测**同一镜头内渐进形变**:t=9.6s 比例正常 → t=11.4s 头/颈/躯干明显变窄拉长。ffprobe 全程无 SAR/DAR 异常 → **不是播放器,是画面内容本身被生成成拉长的**。
3. **英文单不吃语速修复** ← `copyLanguage=en`,编剧提示词明写台词长度看 `lineLengthTarget` 的 metric(characters / words)。07-29 上午那四条**全是中文字数口径**,对 words 口径一条不生效。

## 🔴 我自己判错的那一步(根因中的根因)
07-28 我把 **46 条 `shotCount=1` 的口播案例**设成 `panel_crop` + `entranceBlackOverlay.enabled=false`,
但**另有 50 条 `owner_speaking + shotCount=5` 我"故意没动"**,理由写的是「多镜头仍需整板定顺序」。
**`fashion_v2_S10_styling_tip` 正落在这 50 条里。**
→ 这单证明那个判断是错的:**只要是 owner_speaking,整板就会同时打断口播锁定并带来几何拉伸,多镜头顺序不值这个代价。**
→ 技术官方文档对 `i2vReferenceStrategy` 的口径以 [[reference-thinknova-tech-docs-index]] 为准,动手前回源核。

## 已落库的修复(2026-07-29 上午,admin 弹窗直写,GET 回读全部 true)
线上 config **139,084 字符**,五大块齐全(businessUi 61,177 / promptAssembler 12,051 / systemPrompt 7,834)。
1. `promptComposer.screenwriter.staticTemplates.videoTemplate`(**无 opsEditable 镜像**,1595→1646 字节):
   口播锁定条件改为「**只要cells里有人对镜说话,不论输入图是单张还是多格分镜板**」+「绝不插入无人空镜或产品特写」;
   同时删掉【画面】段里与【以首帧为准】重复的「有人则同脸同发同衣不换人」腾字节。
2. `promptComposer.referenceImagePrompts.product`(**无镜像**,302→365 字节):锁色从清单里提出来写成硬约束「颜色、材质、明度必须与图完全一致,不因场景灯光而改变」。
3. `promptComposer.screenwriter.systemPrompt`(**无镜像**,7764→7834):补 words 口径「8秒22-26词、10秒27-32词、12秒33-38词、15秒42-48词」。

⚠️ **这三刀是补丁,不是根治**。根治 = 把那 50 条 owner_speaking 切成 panel_crop(或按技术文档口径),以及技术侧修参考图比例。

## 🔴🔴 i2v 4096 字节余量已经很薄
本单拼装后实测 **3,602 字节 / 4,096**,加完上面三刀约 **3,716,余量只剩 380**。
**再往 i2v 链路(videoTemplate / stagePromptPresets.image_to_video / referenceImagePrompts)加任何字之前,必须先量、先腾。**

## 🔴 大 config 写入的正确姿势(2026-07-29 实测,取代"让老板粘贴")
接口 PUT 被服务端写保护 419 拦(不是我的工具问题),弹窗是唯一通道。**别用人工粘贴**——
1. admin `#/ai/agents` → 找到 `offline_store_video` 行 → 点「编辑」
2. `document.querySelectorAll('textarea')[1]` 就是 config 编辑器(约 196KB 美化 JSON)
3. **直接 `JSON.parse(ta.value)` → 在页面里改 → `HTMLTextAreaElement.prototype` 的 value setter 赋值 → 派发 `input` + `change` 事件**(必须派发,否则 Vue 不收)
4. **保存前先 `JSON.parse(ta.value)` 自检 + 逐条断言改动在位**,确认不是空白再点「保存 Agent」
5. 保存后立刻 GET 回读,核字符数 + 五大块长度
→ 这样做**没有重演 07-29 凌晨那次 139KB→45KB 的丢数据事故**;那次的成因是弹窗渲染空白时又点了一次保存。

## 待办
1. 50 条 `owner_speaking + shotCount=5` 是否切 `panel_crop` —— **等技术文档回源核对结论**
2. 烧组4(grok 15s 口播)验:一镜到底 / 不拉长 / 锁色三样,同单可一起验三锁(人物+门店+产品各一张参考图)
3. 技术卡两张已起草待发:`02_交付内容\给技术_OPS-VIDEO-20260729-02_i2v参考图宽高比与出片不匹配.md`、`给技术_OPS-ADMIN-20260729-01_Agent配置弹窗保存静默丢数据.md`

关联:[[project-thinknova-storyboard-test]] [[project-thinknova-film-types]] [[reference-thinknova-prompt-fields]] [[reference-thinknova-tech-docs-index]] [[reference-thinknova-multiref-model]]
