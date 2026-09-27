---
name: reference-content-skills-dbskill-agentmotion
description: 触发:改/审短视频与小红书文案、找对标、老板提「那两个 skill」→ 两个仓库在哪、各是什么、⛔ 都是非商业许可、能搬什么不能搬什么、讨论稿在哪
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-09-26T05:19:40.827Z
---

# 老板 09-26 给的两个 skill（已克隆、已逐份读）

| 仓库 | 本地 | 是什么 | 许可证 |
|---|---|---|---|
| `dontbesilent2025/dbskill` | `00_规格与参考\dbskill\` | 32 个 Claude Code skill,和文案有关 7 个:hook / xhs-title / script-flow / resonate / content / ai-check / content-risk-check。**全是「诊断」不是「代写」** | **CC BY-NC 4.0**,商业用途要单独授权 |
| `erduo1998-cell/agent-motion` | `00_规格与参考\agent-motion\` | 真人口播 MP4+SRT → 抠像 → Three.js 动效片。**不做配音、不改稿**,核心全围绕人物层 | **Motion Craft Community License 1.0**,§10(b) 明写 business promotion = 商业用途,要作者书面授权 |

🔴 **两个都是非商业许可。** 现行口径(等老板拍板):按「读法 ②」——学它的规则、写进我们自己的 `_check_xhs.py`/`_check_short.py`,⛔ 不把它的 skill 文件装进流程跑。要走读法 ①(直接装着跑)先联系作者。

## 能搬的
- dbskill:开头公式(话题+Hook+可信度)、留悬念不给答案、**标题张力 6 项≥2**、逐段「哪一秒划走」检查、**认知落差**这一维、AI 指纹 22 条(短视频段段金句不判)。
- agent-motion:只搬三条设计原则——开场首帧要有动作、画面要有前景/焦点/背景三层、动画跟语义重音不跟每个词。⛔ 不当工具用(我们没真人口播)。

## ⚠️ 结构性限制
dbs-hook 最强三档(晒结果/数据/反差)全要真实结果。我们 ⛔ 零编造且线上转化 0 ⇒ 只够得着最低两档(金句、痛点+悬念)。**不是写法问题,是没可晒的结果**——要老板定哪些真实材料能上屏。

## dontbesilent 两句要记的
- 「发 100 条内容之前,没资格讨论限流问题」(我们小红书 34 条)
- 「平台不关心是不是 AI 做的,关心能不能跑出去」——**和我 09-25「AI 未声明被限流」的待确认假设方向相反**,他是实测,我是二手;我那条权重降。

讨论稿(含拿它们的尺子量篇11/篇12/EN-L 的结果、五条提案、五个待拍板):
`03_工作台\文案质量_两个skill学习与讨论稿_2026-09-26.md`
