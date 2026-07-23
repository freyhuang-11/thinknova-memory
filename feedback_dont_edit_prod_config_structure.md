---
name: feedback-dont-edit-prod-config-structure
description: "线上 config 是前端/编剧依赖的契约,不是提示词草稿——结构/字段类改动一律交技术,自己只碰纯文本字段(2026-07-24 技术+老板严重反馈)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: current
  modified: 2026-07-23T16:21:18.442Z
---

2026-07-24 技术当着老板发火:「每次一改就出错」「频繁改架构不出错才怪」「你ai就没认真看文档」「以后用自然语言吧」。老板转达并认同「你自己有很大的问题」。**这条是硬红线,违反=又给老板惹麻烦。**

## 我的两处实锤硬错(认账,别再犯)
1. 往案例 `prefill` 塞 `extraRequirement`=**前端不认的自造字段**,极可能撞坏建单前端(已回退)。
2. videoTemplate 堆到 2665 字节**撑爆 4096**→编剧回退出废片(07-20 教过又犯)。

**根因**:把线上 config 当成能随便改的提示词草稿,但它是**前端+编剧都依赖的契约**。改契约里的结构/字段前没吃透技术文档 → 出错。

## 铁律(定死)
1. 🔴 **结构/字段/新字段一律不自己在线上改**——写成需求交技术定数据结构。我只碰"**纯文本提示词**"这类我完全懂的字段(如 systemPrompt/visualHint 正文、videoTemplate 文案)。
2. 🔴 **动字段前先把技术那份文档逐条读完**(位置待老板指:vault?微信?目录?——问到后补进 [[reference-thinknova-config-powers]] 并读完)。
3. 🔴 **改前量字节、改后回读、先改一条验证不崩再铺开**(呼应 [[project-thinknova-dingdian-koubao]] 今日3坑 + MEMORY 铁律8.5)。
4. 🔴 **配置类变更先用自然语言**把"改什么/为什么"讲清给老板或技术确认,**不再直接甩 JSON 上线**。

## 别甩锅但要守事实(backbone)
一般性批评该认的认,但**具体故障别为了认错而乱背锅误导排查方向**:2026-07-24「案例全没了」当面复现=前端 `/fill-info` 路由守卫静默重定向弹回首步清空选择,后台 referenceCases 530 条完好,与 config/我的改动无关→只能改前端。认账(改法有问题)与守事实(这个bug非我config)可以并存。见 [[project-thinknova-dingdian-koubao]] 阻塞段。
