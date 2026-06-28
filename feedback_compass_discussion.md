---
name: feedback-compass-discussion
description: 用户在 Compass 讨论中明确给我的沟通 / 工作风格要求
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

# 规则 1：先讨论再操作

**Why**：用户多次说「不要直接操作」「讨论出结果再说」「先记录我这次的回答，我们再讨论」。
**How to apply**：跟 Compass 相关的任何行动前，都要先把方案讲清楚、等用户拍板，再写代码 / 文档。即使用户问「要不要做 X」也是讨论问题，不是 go signal。

# 规则 2：要事实不要假设

**Why**：2026-06-23 我没查 API 就直接给「TikTok 私信 1 天 1 万条」的方案，用户直接 callout：「你思路不对吧，我说了新系统是全 api 走的，你要不要先去查一遍我们有的 api 再和我聊」。
**How to apply**：聊 Compass 任何 TikTok API 能力前，先去 [[reference_tiktok_partner_api]] 拿事实。**用户自己也会搞错**（他说 1 万/天，真实是 1000/周起），要主动校正不是迎合。

# 规则 3：要判断和结论，不要选项列表

**Why**：用户多次说「直接告诉用户并建议更好的办法」「输出说重点，砍掉一切不改变决策的信息」。CLAUDE.md 也写明了。
**How to apply**：给「A/B/C 你选」是偷懒。要给「我建议 A，因为 X，但 Y 时该用 B」。

# 规则 4：跟「我们老系统」对比要克制

**Why**：Compass 是 SaaS 多租户走 API，老系统是单租户走爬虫。**业务流程不同，规则不同**。直接照搬老系统的能力清单会犯方向错误（比如 WhatsApp 老系统有，Compass 不能有）。
**How to apply**：每个「老系统这样做」之前都先问「Compass 适用吗」。

# 规则 5：服务商 mental model

**Why**：用户多次强调「我们是服务商形态」「跨境商家基础 5 店铺」。这是 Compass 整个产品定位的核心。
**How to apply**：思考任何功能时把 mental model 放在「BD 公司服务多个商家，每商家多店铺，团队多角色」上。

# 规则 6：不要主动生成提示词

**Why**：用户说「等他答完关键问题再生成提示词」，明确说**不要提前生成**。
**How to apply**：等用户明确说「现在生成提示词」才生成。

# 规则 7：需要用户判断的，必须走 Plan 模式

**Why**：2026-06-24 用户说「把你需要我做判断的问题全部用 plan 模式来提交给我」「每次需要我判断的都需要用 plan 模式给到我」，并要求写进项目 CLAUDE.md（已写 `D:\SamsoData\Documents\Kol compass\CLAUDE.md`）。
**How to apply**：任何需要用户拍板的事（方案/范围/方向/外部条件确认）→ `EnterPlanMode` → 用 `AskUserQuestion` 把所有待决策项结构化一次性给 → 写 plan 文件 → `ExitPlanMode` 批准。不要用零散文字提问。已明确下达的执行指令、纯汇报不走 plan。

# 规则 5 补充：单商家优先

服务商是终极目标，但**上线排序**=先做单商家多店铺，服务商（多商家）推迟到上线后版本。别往当前版本/DESIGN.md/PRODUCT.md 塞服务商。详见 [[project_compass_migration]]。

[[user_profile]] / [[project_compass_migration]]
