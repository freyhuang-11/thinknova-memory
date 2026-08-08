---
name: feedback-prompt-change-hard-rules
description: 触发:要改任何进 videoPrompt 的字段之前 → 08-08 编剧层全穿事故立的四条硬规:只减不增/先读现状源/案例层不许写声线节奏/看不到全文就别改
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-08T08:40:14.621Z
---

# 改提示词的四条硬规（2026-08-08 编剧层全穿事故后立）

老板原话：「**4096 得规矩是死的现在，必须遵守了**」「编剧层全都穿了」。

## 事故经过
08-08 我在一天内连续动了多处提示词，全部没量总字节：
1. 案例声线句 +104 字 → 编剧重试 3 次、**台词全空**
2. 改纯指派版 +50 字 → 重试 **4 次**、台词仍空
3. 全局 `promptAssembler.video.outputTypePrompts.video` +44 字（306→438 字节）→ **编剧层全穿**

三次都已回滚。

## ✅ 08-08 取到报错原文后的定论（我中途写过一版「字节机制证不出来」，**那版是错的，已撤**）

**取证接口（我曾记错说它返回 null，那是用数字 id 调的）**：
`GET /admin/api/v1/ai-tasks/{task_no}` → `data.task.output.attemptTrace[]`，每条含 modelCode / errorCode / **errorMessage 原文**。用 **task_no**，不是数字 id。

`task_8e08618a9091` 十次尝试原文（老板提醒「10 次报错不一样」才查的）：

| 次 | 模型 | 报错 |
|---|---|---|
| 1-3 | luna | **videoPrompt exceeds 4096 bytes** |
| 4 | deepseek-v4-pro | lines length out of range |
| 5 | deepseek-v4-pro | lines are incomplete sentences |
| 6 | deepseek-v4-pro | **videoPrompt exceeds 4096 bytes** |
| 7 | terra | invalid JSON |
| 8 | terra | **videoPrompt exceeds 4096 bytes** |
| 9 | terra | invalid JSON |
| 10 | deepseek-v4-flash | 成功，最终 videoPrompt **3106 字节** |

**结论：4096 顶穿是真的（10 次里 5 次），但撑爆它的不是我们的固定模板，是编剧自己写的 cells。** 同一单，模型写得啰嗦就 4096+，收敛就 3106，差近 1000 字节全在 cells 上。

## 🔴🔴🔴 系统性真相（46 单实测，08-08）
| 指标 | 值 |
|---|---|
| videoPrompt 中位数 | **3489 B（占 4096 的 85%）** |
| p90 / 最大 | 3955 / **4050**（离墙 46 B） |
| 需重试的单 | **23/46 = 50%** |
| 46 单总尝试次数 | **136（平均 3.0 次/单）** |

**系统被设计成贴着硬顶跑，余量约等于零。** systemPrompt 同一段里两条规则互相打架：「每格90字，**写满不写少**，宁可占字数」vs「cells 总字数**不超过900字**，超了整单作废」。900 字中文≈2700B + videoTemplate 939B = 3639B，余量仅 457B。
👉 **推论（重要）**：一半的稿子不是主力 luna 写的，是掉到 deepseek-flash 等最弱候补写的。**「台词差/情绪平/画面呆」有相当一部分不是提示词没写好，是稿子根本没让好模型写。** 评价提示词效果前，先看这单是第几次尝试、哪个模型出的。

## 💡 字节从哪来（答「挤掉了谁」，且不碰画面描述）
最大单 4050B 拆解：visual 1140 / **line 626** / **voice 564** / 其余 348。
`voice` 与 `line` 的 `[[声线,感情,真人感:…]]` 包头**逐字重复同一套声线描述**；五格合计约 1000B 声线元数据，真台词只约 180B（**元数据是台词的 5 倍，占总预算 25%**）。
而 08-02 已量过 TTS 不渲染逐句情绪（我们 LRA 2.7 vs 竞品 7.9）→ **25% 的预算花在引擎不读的指令上。**
👉 去重可释放约 500-600B，**一个字画面描述都不用动**（老板底线：画面/人物/灯光/运镜/氛围绝不许为省字节砍）。
⚠️ 未定：`voice` 与 `line` 包头**哪个是权威字段**——要么问技术，要么 A/B 烧验，不许猜。

## 🔴 顶穿的诊断判据（08-08 实证，最灵敏）
**看编剧 `attemptCount`**（主任务 `output.childTasks.scriptwriter.attemptCount`）：
| 值 | 含义 |
|---|---|
| **1** | 正常 |
| **3-4** | 已在撞边界（台词被压短/变空） |
| **10** | **确认顶穿**，每次尝试都被杀 |

实证：全局字段 +44 字（306→438 字节）后，storyboard 单 attemptCount = **10**。回滚后恢复。
**每次改完提示词，第一件事就是烧一单看 attemptCount，不是看成片。**

## 硬规

### 1. 只减不增
**改任何进 videoPrompt 的字段，只许减字。必须加就先删等量的字。** 加字前必须能回答"这几个字挤掉了谁"。

### 2. 动手前先读现状源，别拿烧单当探索手段
08-08 我全天都在「看到现象 → 直接改配置 → 烧单」，跳过了 L1 铁律第一步。代价：
- 在案例层反复试声线 → 其实节奏归全局【口播节奏】段管
- 在案例层改镜头运动 → 其实被全局「禁止镜头切换」压着
- 架构（全局 storyboard_board + 口播案例 panel_crop）记忆里本来就有，我没调用

**烧单是验证手段不是探索手段。现状从记忆和配置里读。**
必读顺序：[[project-thinknova-0729-screenwriter-stack]] → [[project-thinknova-0729-koubo-defect]] → 线上 config。

### 3. 案例 visualHint 里一个字都不许写声线/语调/节奏
**实证（同案例三次对照）**：
| 版本 | 案例字数 | 编剧重试 | 台词 |
|---|---|---|---|
| 原状 | 968 | 1 | 有 |
| 加声线（带禁令） | 1072 | 3 | **无** |
| 加声线（纯指派） | 1018 | **4** | **无** |

机制推断：「换气/停顿/留出」类指令让编剧压短台词 → 撞 lineValidation 下限（中文 15 秒 62 字）→ 连环重试 → 产出空台词。
**声线和节奏归全局 videoTemplate 的【口播节奏】段管，案例层不许碰。**

### 4. ✅ 改之前必须先看拼装后全文——**接口一直都有，是我记错了**（08-08 更正）
~~旧结论：没有任何接口能返回拼装后的完整 videoPrompt，属蒙眼飞行，已列待发技术卡。~~ **作废，技术卡不用发。**

**正解**：`GET /admin/api/v1/ai-tasks/{task_no}` → `data.task.output.compiledPlan.videoPrompt` = **发给 grok 的完整原文**（同一响应还有 `attemptTrace[]` 带每次报错原文、`dynamicJson.cells`）。
🔴 **必须用 task_no，用数字 id 会返回 `task:null`** —— 我当初就是用数字 id 试的，于是把"这接口没用"写进了记忆，然后被自己的错记忆挡了好几天。

**拼装格式（实读）**：videoTemplate 全文 + 每格一段
`【子格<位置>｜<时间段>】 景别机位:… ／画面核心:<visual>／人声:<voice>／开口台词:<line>／音效:<sfx>／运镜:<move>`

👉 **改任何提示词之前，先拉一条真实单的 compiledPlan.videoPrompt 读一遍**。今天所有真发现（声线重复、字节分布、余量）全是从这段全文里读出来的，不是猜出来的。

## 附：今日验证通过、可保留的改动
- 前后对比案例（`home_v2_S07_before_after`）：全局暗号开关 +案例具体化 + 镜头指派式 → 三项验证通过，对照单证明爆炸半径 0
- 补台词方向段（`food_s06_make`）：编剧重试 1 次、台词 68 字落窗、内容合规 → 修法验证通过，可推 83 条启用中案例（需剔除 S14 TVC 类）

关联 [[feedback-case-change-no-blast-radius]] [[feedback-directive-over-prohibition]] [[project-thinknova-0729-screenwriter-stack]]
