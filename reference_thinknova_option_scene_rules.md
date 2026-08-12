---
name: reference-thinknova-option-scene-rules
description: 触发:要改「场景指引」或「选项(出镜/景别/风格)如何影响编剧」之前 → 活真值路径 + 旧的同名死配置 + 案例单条写入路由
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-12T21:10:37.837Z
---

# 场景提示词 / 选项规则 / 案例写入(2026-07-29 实证 · 08-12 大改)

## 🔴🔴🔴 2026-08-12 视频线场景表 14 → 10(老板拍板,已全量上线并前台验证)

| sceneId | 前台名 | 由来 | 案例/启用 |
|---|---|---|---|
| S01 | **商品介绍** | 原新品上新 + 合并 S03 爆款招牌 | 153 / 129 |
| S02 | **活动介绍** | 原做优惠 + 合并 S09 节日 + S13 团购 | 152 / 129 |
| S04 | **信息公告** | 原价目表 + 合并 S12 通知招聘 | 79 / 68 |
| S05 | **探店打卡** | 原「介绍门店位置」改造成第三方代看视角 | 60 / 51 |
| S06 | **手艺揭秘** | 原「展示真实过程」 | 48 / 37 |
| S07 | **前后对比** | 原样 | 37 / 27 |
| S08 | **剧情短片** | **复用顾客评价的注册位**(原 27 条顾客评价迁去 S05) | 12 / 12 |
| S10 | **教程避坑** | 原样 | 59 / 50 |
| S11 | **老板出镜** | 原「老板/员工口播」去黑话 | 63 / 48 |
| S14 | **广告大片** | 原「广告大片(纯画面配乐)」去括号 | 44 / 44 |

**下架**:S03 / S09 / S12 / S13 在 `scenes[]` 和 `businessActions` 双双 `enabled:false`(**不删,留着当以后加场景的空位**)。案例迁移 239 条,零残留。回滚底稿 `ROLLBACK_scenes_actions_0812.json`。

### 🔴🔴 改场景名必须同时改两张表(它们都进编剧!)
编剧子任务 `input` 里两个都有,来源不同:
- `scene:{id:'S02', label:'活动介绍'}` ← 来自 **`businessUi.scenes[]`**(内部注册表,还带 `goal`/`copyMode`/`sortOrder`/`enabled`)
- `writerContext.businessScenario:{id:'promotion', label:'活动介绍'}` ← 来自 **`businessUi.businessActions[]`**(商家前台看到的,label 六语)
→ **只改一张 = 编剧收到两个打架的名字。**08-12 之前两张表的名字一直不一样(scenes 写「限时优惠/折扣促销」、actions 写「做优惠活动」),已统一。

### 🔴🔴🔴 【场景要点】改成用 sceneId 精确匹配(08-12)
旧版用「新品=/促销=/招牌=」这类**简称**,靠模型去模糊匹配两个 label —— **一改名就可能全表失配**。现已改成 `S01=/S02=/S04=…` 十条,精确、且比写场景名更省字。**以后改场景名不用再动这张表。**

### 🔴🔴🔴 08-13 场景迁移后的连锁反应(踩过才知道)
- **`businessScenario` 必须和案例当前 `sceneIds[0]` 对应,对不上直接建单 500001**。我拿 S02 的 `promotion` 配已迁到 S08 的案例,连挂两次才反应过来。**场景迁移后,任何写死 businessScenario 的脚本/收藏/外部调用都会挂。**
- S08 的 action id 仍是 `customer_review`(label 已改「剧情短片」)——**id 不跟着改名走**,查 action id 一律从 `businessActions` 按 `sceneId` 反查,别按名字猜。

### ⛔ 08-12 实测:`sceneRules` 和 `scenePrompts` 的内容都不进编剧
编剧 `input.systemPromptSource='screenwriter.systemPrompt'`,`input.scene` 只有 `{id,label}` 两个键。
→ **场景级规则唯一有效的地方还是 systemPrompt 的【场景要点】**。
→ 但 **`sceneRules[SXX]` 结构必须存在**(缺了父任务组装取不到 → 建单 500),内容写什么无所谓。加场景时"配齐但可以简写"。

## 🔴 三条活真值路径(改这里才有用)

| 要改什么 | 活路径 | 镜像 | 证据 |
|---|---|---|---|
| **场景级台词规则** | 🔴 `promptComposer.screenwriter.systemPrompt`(**无 opsEditable 镜像**),用编剧实收的**场景中文名**做查表 | 无 | 编剧 payload 只有 `scene:{id,label}`,别无场景信息 |
| **案例级提示词** | `businessUi.referenceCases[].visualHint`(片型锚点+内容锚点) | — | 逐字出现在编剧 payload 的 `case.visualHint` 与 `writerContext.case.visualAnchor` |
| **选项→编剧指令** | `promptComposer.optionRules.<组>.<值>.{bucket,tag,text}` | 🔴 **有 `opsEditable.optionRules` 必须双写** | 编剧实收 `subject_definition ⟦镜头同时带商品或服务主体与门店环境…⟧` 逐字来自这里 |
| **单条案例预设** | `PUT /admin/api/v1/agents/offline_store_video/reference-cases/{id}` | — | 200/code 0,回读生效;**绕开了 businessUi textarea 静默丢弃的老毛病** |

## 🔴🔴 `promptAssembler.scenePrompts` **不喂商家视频编剧**(07-29 烧单实证)
我 07-29 重写了它 14 条 `videoPrompt` 并新增 S13,落库成功——**但烧 `task_e5cef7d8ac53` 验证,编剧 payload(2469字)里 `imagePrompt`/`videoPrompt` 两个键都不存在,新文案一个字没进去**。它属于别的管线(海报/旧 promptAssembler)。
→ **这就是「落库≠送达」最贵的一课:配置回读成功 + 字段名看着对 = 什么都不证明,只有烧单看编剧 payload 才算数。**
→ 已把场景规则改落到 `screenwriter.systemPrompt` 末尾的「【场景任务·按场景名对号入座】」段(14 行,按中文场景名匹配)。

**写案例的正确姿势**:`GET` 同一路径拿 `data.item` → 从**响应头**取 `x-csrf-token` → 整条 `Object.assign` 后 `PUT`。只传改动字段会丢其它字段。

## ⚠️ 同名但**不生效**的旧配置(别改错地方)
`promptAssembler.businessOptionPrompts.appearanceMode` 也有一份四个值的文案,措辞更弱(product_only 写「不要无关人物」),**编剧收到的不是它**。promptAssembler 下偏旧管线的键还有 `video.outputTypePrompts.first_frame`(写着「分镜故事板」),活的是 `opsEditable.taskGoal.firstFrame`(「分镜制作板」)。**判活死的方法:拿一条真实任务的 child input_payload 逐字比对。**

## 🔴 `appearanceMode` 四个值的真实语义(全库 675 条分布)
| 值 | 编剧收到的原文 | 条数 |
|---|---|---|
| `product_only` 只拍商品 | 「镜头只围绕商品或服务主体,不要加入**无关**人物。」**≠ 完全无人** | 187→206 |
| `owner_speaking` 老板口播 | 「**真人(老板/员工/技师)正面出镜口播或讲解**,亲和可信…」 | 114→95 |
| `product_store` 商品+门店 | 「镜头同时带商品或服务主体与门店环境,建立真实的门店现场感。」**不禁止出人** | 305 |
| `customer_pickup` 顾客拿货 | 「可拍顾客到店互动或取货动作,但主角仍是商品或服务。」 | 45 |

🔴 **要真正"全片无人"必须靠案例 `visualHint` 写死**,`appearanceMode` 任何一个值都做不到。文档 §3.2 的「纯画面」模板 = `product_only` + `visualFocusPreset:product_detail` + `voiceMode:none` **三件套一起**才成立。

## 07-29 已落库的改动
1. ✅**已送达**:`opsEditable.taskGoal.firstFrame` 删除写死的「15秒」(10 秒单也发 15 秒);`blockTemplates` 镜像同步。烧单验证 i2i 提示词已不含「15秒」。
2. ✅**已落库**:19 条案例 `appearanceModePreset: owner_speaking → product_only`——它们 `visualHint` 是「沉浸微距·只用微距大特写零人物全身」+ `visualFocusPreset: hands_on_process`,却要求真人正面出镜。剩 2 条 `person_on_camera` 的**故意不动**(两个预设自洽):`tcm_s03_lead` / `edu_v2_S03_signature_course`。**送达未验**。
3. ✅**已落库**:`screenwriter.systemPrompt` 追加「【场景任务·按场景名对号入座】」14 行(7901→8656 字)。**送达未验**(`task_b77cb79d3570` 在跑)。
4. ⚪**无效但无害**:`scenePrompts` 14 条重写 + 新增 S13 —— 见上,不喂本编剧,留着不影响。

## 🔴🔴 教训:2026-07-29 一天内连犯 5 次同类错
「查一个源 → 下结论 → 被真值打脸」。当天错的 5 条:①无台词要技术卡(其实案例级 voiceMode 早就有)②那单是 S10(其实 S03)③product_store=不出人(其实不是)④正则把「绝不出现**无人**镜头」当成「无人」⑤场景目的编剧收不到(其实 scenePrompts 早就进了)。
→ **下任何「系统缺少X能力」的结论前,必须同时查:agent config + 案例表 + 模型表 + 一条真实任务的 child input_payload。** 关联 [[feedback-source-truth-first-commander]] [[project-thinknova-0729-byte-surgery]]
