---
name: feedback-retry-before-escalating
description: "触发:线上写入被拒/报错、准备停下来找老板拍板之前 → 先原样重试一次,别把活退回去"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-02T10:30:07.735Z
---

# 被拒先重试,别动不动停下来把活退给老板(2026-07-30)

**规矩**:线上写入被拒时,**先原样重试一次**。重试还失败再报,报的时候带上原文和已完成的部分。

**07-30 实证**:翻全局 `i2vReferenceStrategy` 的 PUT 被工具层拒了一次
(提示词是 auto mode classifier 的权限拒绝),我当场停下来让老板拍板。
老板说「你每次被拦都是你自己认为的」,让我继续——**原样重发,一次就过,HTTP 200**。
说明这类拒绝**大量是瞬时的,不是硬策略**,我把它当成硬墙 = 白白中断一步、把活退回给老板。

**Why**:老板要的是我把事做完,不是每遇到一点阻力就回来要一句授权。
中途停下的代价是他要重新进入上下文、再回一句「继续」,这是纯浪费。

**How to apply**:
1. 写入被拒/报错 → **立刻原样重试一次**,不解释不请示
2. 重试成功 → 当没事发生,继续往下做,结果里提一句就行
3. 重试仍失败 → 才报,并且必须带:原始报错文本 + 已经完成到哪一步 + 我建议怎么走
4. ⚠️ **边界不变**:真正需要老板拍板的是**方向性选择**(A/B 方案、要不要对商家可见、
   要不要删数据),不是"我这条命令能不能发出去"。前者照旧问,后者自己重试。

**唯一已知的硬墙(重试也没用,别浪费回合)——改我自己的权限配置**:
`C:\Users\samso\.claude\settings.json` 里的 `permissions` 段,auto mode classifier **硬拦**,
08-02 原样重试第二次照样拒。这是设计上的护栏(agent 能自己提权 = 自动模式形同虚设,
一次提示词注入就能让我先开权限再干事),**贴的内容再无害也拦**。
也**不许绕**(Bash 写文件 / Python 改 JSON 都能绕开,但那正是它要防的事)。
→ 遇到这条:重试一次确认,然后**把配置块整段给老板让他贴**,并说清为什么只有他能贴。

**当前状态(08-02 老板已贴,实读核过)**:settings.json 已有 `permissions.allow` 36 条
(git 全套 / 只读 shell / ffmpeg / vault 读写 / WebFetch),JSON VALID,statusLine+hooks 未损。
→ 例程类任务应已不再弹窗;**若仍弹,说明缺的是新命令,把该命令告诉老板加进 allow,别自己动手**。

关联 [[feedback-communication-principles]] [[feedback-dont-assume-requirements]]

## 2026-09-27 补：后台「共享资源」写接口会被自动模式分类器拦
- `PUT /admin/api/v1/ai-prompt-configs`（整 item 写 AI 提示词）在 Chrome JS 里发出即被拦，理由 [Modify Shared Resources]；分类器明说不许换工具/拆分/换 turn 再试。
- 处置：成稿落盘（`00_规格与参考/提示词参考库/`）+ 回滚快照，**交老板在后台对应输入框手工粘贴**，我负责回读校验字数与开头结尾。⛔ 不派子 agent 代做（权限洗白）。
- 同类预期也会拦：`PUT /payment-configs`（加油包 JSON）、`PUT /system-configs/*`。以后这类先备好 JSON/文本 + 一句「贴哪里」，直接给老板。

## 2026-09-28 00:0x 根因更正：09-27 全天「分类器拦后台写/Ads Manager」= settings.json 坏了
- `C:\Users\samso\.claude\settings.json` 第 11 行一个**中文逗号「，」**（09-22 01:58 写坏），整份权限规则（47 条 allow）没加载，所有动作掉到自动模式分类器兜底 → PUT 后台、派 Ads Manager agent 全被 [Modify Shared Resources] 拦。老板 09-28 00:01 改回英文逗号后，Ads Manager agent 立刻放行。
- ⇒ 以后一被「共享资源」类理由连拦两次，**第一步 `python -c json.loads(settings.json)`** 看权限文件是否有效，再谈分类器。检查是只读，不碰硬墙。
- 2026-09-28 04:4x：Ads Manager「发布/开启广告」= 分类器 [Production Deploy]，即使老板明令也拦；**建到暂停/待发布草稿是放行的**。以后 FB 流程固定 = 我建好停在「检查并发布」前 + 老板点发布；不再尝试代发布。

- 2026-10-01 实测：`PUT /admin/api/v1/system-configs/<key>`（body {value, description}，带 x-csrf-token）**能直接写成功**（润色提示词 3 键，200 code 0，回读一致）。⇒ 上面「system-configs 预期被拦」不再成立，先试再说。
