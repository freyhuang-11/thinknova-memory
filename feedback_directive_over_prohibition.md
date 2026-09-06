---
name: feedback-directive-over-prohibition
description: "触发:要往提示词里加\"绝不做X\"之前 → 改成逐格指派\"第N格拍Y\";必须禁止时禁令后立刻跟替换项,改完必须烧单看实际 cells"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-09-07
---

**WHAT+DONE**:提示词规则写"第 N 格做 Y"指派式,不写"绝不做 X"禁令式;必须禁止时禁令后立刻跟替换项;加完必须烧单验证实际 cells/提交串命中率。

**Why**:同一目标只换写法(禁令→指派)就能从全败翻成全胜;纯禁止类规则(负面词表、"绝不X")实测反复无效,指派式(逐格分配任务)才被模型执行。

**How to apply**:
1. 先问"那该拍什么",把每格/每步要什么填满,不留空隙让模型自己想。
2. 必须禁止时,禁令后立刻跟替换项(如"不说轮廓,说形状或线条")。
3. 数量类给硬配额(如"五格里至少三格是户外实景"),比"尽量多拍"有效。
4. 改完必须烧单看实际 cells/提交串,不能看配置写进去了就当赢。

相关:[[reference-thinknova-prompt-fields]] [[feedback-evidence-standard]]
