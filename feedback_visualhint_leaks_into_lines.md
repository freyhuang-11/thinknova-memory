---
name: feedback-visualhint-leaks-into-lines
description: "台词里冒出的词,十有八九来自 visualHint 的画面词 —— 因为「台词画面同频铁律」会把画面里的东西拉进台词;查台词问题先查 visualHint"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-07-21T20:19:01.640Z
---

# 台词出问题,先查 visualHint 而不是加禁令(2026-07-22 实证闭环)

编剧的 systemPrompt 里有一条【台词画面同频·铁律】:「台词只说该格画面里正在发生或正在展示的东西」。
这条规则是好的,但它有个副作用:**visualHint 里写进去的任何画面词,都会被拉进台词。**

所以链路是:

```
visualHint 写「第5格…顾客咨询画面」
      ↓ caseInjectionPolicy.includeFields = ["visualHint"] → 整段进编剧
      ↓ 【台词画面同频·铁律】要求台词说画面里的东西
末句必然写成「…到店咨询就好」
```

**模型没有不听话,它是在同时执行两条互相打架的规则,并选择了具体的那条。**

## 铁证(同案例同配置一对一对照)

| | 任务 | 末句 |
| --- | --- | --- |
| 改前 | task_86335cd8d260(03:08) | 想了解安排,**到店咨询**就好。 |
| 改后 | task_ec7e5f76fa9c(04:16) | 三天时间,**正好逛逛**。 |

改动:把该案例 visualHint 里的「顾客咨询画面」换成「顾客与顾问并肩看地图的画面」,并把 CTA 禁令换成末句填空模板。
两单同为 travel_agency_s03_best、endingCta 未选、9:16、steady。

同一轮全库扫查发现的污染量:visualHint 里带行动词的案例 **75 条**,其中最狠的是 30 条直接写「台词…结尾引导咨询应聘 / 结尾引导办卡」——
**这是在 visualHint 里直接给台词下指令**,禁令再多也压不住。

## 规矩

1. **台词出现了不该有的词,第一步去 visualHint 里搜这个词**,别急着加禁令;
2. **visualHint 只写画面,绝不写「台词…」开头的句子**,写了就是越权指挥台词层;
3. visualHint 里避免出现行动名词(咨询/购买/报名/办卡/引导区域),要表达同样的场景就换成动作描写(「并肩看地图」「递上会员卡的手部特写」);
4. 每次批量改完案例,跑一遍行动词扫查再上线。

相关:[[reference-thinknova-prompt-fields]] [[feedback-directive-over-prohibition]] [[feedback-evidence-standard]]
