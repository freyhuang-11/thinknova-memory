---
name: feedback-tech-requests-one-at-a-time
description: 给技术的需求一次只发一件、故障优先、能用的东西先别加需求；10-24 需求太散把能用的 MCP 改坏了
metadata:
  type: feedback
---
10-24 技术反馈：「需求给得乱，昨天 MCP 一次成型，这次改来改去越改越挫」，老板转述。

**Why:** 10-23 晚 MCP 在 Claude 网页版已能连；10-24 我一口气给了 8 条（故障 + 产品想法 + 防蒸馏 + 规则 + token），又补续2～续5，其中一条还是误报（多参考图），技术照单改，84c6d94f 上线后网页版反而连不上。

**How to apply:**
1. 东西能用时，先只修阻断故障，不同时塞新功能。
2. 一次只发一件，发之前我自己线上核实（误报会浪费技术一轮）。
3. 故障和产品想法分开发；产品想法先和老板定完、攒成一份，等故障稳定后再发。
4. 发出后有新发现，先判断是不是真要技术动，能等就等下一轮。
相关 [[feedback-tech-doc-new-file-after-sent]] [[feedback-verify-before-relaying]]
