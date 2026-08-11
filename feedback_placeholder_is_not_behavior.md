---
name: feedback-placeholder-is-not-behavior
description: config 里的 placeholder/说明文案 ≠ 实际行为;对外说产品能力前必须 A/B 实测
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-08-11T13:13:15.719Z
---

**config 里的 placeholder、字段说明、提示文案,都是"写给用户看的话",不是"系统实际会做的事"。拿它当实测结论用 = 编造产品能力。**

## 2026-08-11 血案

我从 `placeholderDefaults.default.extraRequirement` 里读到:
> 「台词、卖点、要求都能写在这。**写台词会照着念**(例:"工具每客一换,高温消毒")」

于是我告诉老板:「卖点是——**你写哪一句,它就念哪一句**」,并写进了抖音 dy01 的口播稿。老板照着录了。

**同参数 A/B 实测(task_01b084fb9de9 / task_0f4259df37e0):**

| | 只填那句话 | 那句话 + 「一个字都别改」 |
|---|---|---|
| 编剧出的台词 | 「工具每客一换,**再做**高温消毒」 | 「工具每客一换,高温消毒」 |
| 一字不差? | ❌ 平台自己加了两个字 | ✅ |

**光填进去,平台会改写。** ASR 独立复现了 A 多出的两个字(听成"在座"),双源坐实。
而线上 `globalRules.extraRequirementPlaceholder`(**真正显示在前台的那个**)根本没有"照着念"这句话——两个字段说法不一致。

**How to apply:**
- 🔴 **任何要对外说的产品能力,必须有 A/B 实测任务号撑着。** 没有任务号 = 不许说。
- 判据一句话:**"这句话我是读来的,还是测出来的?"** 读来的一律标「未验」。
- 同一个能力有多个 config 字段描述时,**以最小承诺的那个为准**,并实测确认。

这是铁律 L0-3「接口通≠功能通,必实机」的另一面:**字段写着≠功能是这样**。

相关:[[feedback_source_truth_first_commander]] [[feedback_evidence_standard]] [[reference_thinknova_paths]]
