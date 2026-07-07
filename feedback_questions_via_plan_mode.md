---
name: feedback-questions-via-plan-mode
description: "需要用户回答/拍板的问题一律用 plan 模式(结构化提问)对话,不散落在回复正文里"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

用户 2026-07-08 明确要求:所有需要他回答的问题,全部用 plan 模式和他对话。

**Why**:问题散在长回复正文里会被淹没,他要么漏答、要么要翻着找;结构化提问(选项+推荐)他扫一眼就能拍板。

**How to apply**:
1. 积累到需要用户决策的点(方向选择/取舍/授权),用 plan 模式 + 结构化提问(AskUserQuestion,给选项、标推荐),一次问清,别一条条零散问;
2. 回复正文里不夹带疑问句等他回答;正文只放结论、进展、证据;
3. 纯汇报/纯执行的轮次不需要 plan 模式;
4. 现存待拍板清单在 `01_问题诊断/待办总表快照` D 组,攒着用 plan 模式集中问。
