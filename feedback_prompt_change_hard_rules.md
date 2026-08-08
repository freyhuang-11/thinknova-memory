---
name: feedback-prompt-change-hard-rules
description: 触发:要改任何进 videoPrompt 的字段之前 → 08-08 编剧层全穿事故立的四条硬规:只减不增/先读现状源/案例层不许写声线节奏/看不到全文就别改
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-08T07:48:51.630Z
---

# 改提示词的四条硬规（2026-08-08 编剧层全穿事故后立）

老板原话：「**4096 得规矩是死的现在，必须遵守了**」「编剧层全都穿了」。

## 事故经过
08-08 我在一天内连续动了多处提示词，全部没量总字节：
1. 案例声线句 +104 字 → 编剧重试 3 次、**台词全空**
2. 改纯指派版 +50 字 → 重试 **4 次**、台词仍空
3. 全局 `promptAssembler.video.outputTypePrompts.video` +44 字（306→438 字节）→ **编剧层全穿**

三次都已回滚。根因不是措辞，是**字节预算**：videoTemplate 939 字节 + cells 2.4-3.0KB 已经贴到 3.3-3.9KB，任何加字都在往 4096 硬顶上撞。

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

### 4. 看不到全文就别改（🔴 现存盲区）
**没有任何接口能返回拼装后的完整 videoPrompt**：admin `ai-tasks` 列表 `prompt` 截断在 280 字；商家端 `plan.videoPrompt` 只给摘要 shotList；`/admin/api/v1/ai-tasks/{id}` 返回 null。
只有 admin 主任务详情页的「组装溯源」能看到，但那是前端页面。
→ **在拿到全文接口之前，任何加字改动都是蒙眼飞行。已列为待发技术卡：要一个返回拼装后完整 prompt 的接口，或让 admin 列表不截断。**

## 附：今日验证通过、可保留的改动
- 前后对比案例（`home_v2_S07_before_after`）：全局暗号开关 +案例具体化 + 镜头指派式 → 三项验证通过，对照单证明爆炸半径 0
- 补台词方向段（`food_s06_make`）：编剧重试 1 次、台词 68 字落窗、内容合规 → 修法验证通过，可推 83 条启用中案例（需剔除 S14 TVC 类）

关联 [[feedback-case-change-no-blast-radius]] [[feedback-directive-over-prohibition]] [[project-thinknova-0729-screenwriter-stack]]
