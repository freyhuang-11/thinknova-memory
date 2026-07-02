---
name: feedback_dont_assume_requirements
description: "别把我自己的建议/推测当成用户指令去执行；区分\"我提议的\"vs\"用户拍板的\""
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

**不要把我自己的分析/建议/推测当成用户的指令去执行、更别写进待办当"需求"。**

**Why:** 2026-07 我在"海外第一版"分析里**自己提议**"默认出图语言改英文",把用户一句模糊的"其他语言的留着一起改"**误读成同意**,就去改了、还写进"需技术"待办。用户后来质问"我没说过类似指令吧"——对。这违反项目 CLAUDE.md 沟通准则第1条(目标不清先讨论别急着动手)。

**How to apply:**
- 提议(我的想法)和指令(用户拍板)**要分清**。用户没明确说的,别当需求执行,尤其配置/提示词这种会落到线上的改动。
- 用户回复模糊时(如"留着一起改"),**先确认我的理解对不对**,再动手,别顺着自己的假设跑。
- 汇报时用词要诚实:"我建议X"不等于"要做X";别把建议悄悄升级成既定事项。
- 交付/待办清单里,"用户拍板的"和"我推测的"要标清楚,后者用户没点头前不算数。

见 [[project_thinknova_offline_agents]]、[[feedback_compass_discussion]]、[[feedback_understand_before_judging]]。
