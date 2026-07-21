---
name: reference-thinknova-prompt-fields
description: "ThinkNova 提示词字段读取图 —— 哪个字段被编剧/生图/i2v 读取,改提示词前必查,防止改在没人读的字段上"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-07-21T20:19:08.988Z
---

# ThinkNova 提示词字段读取图(2026-07-22 实证)

**改任何提示词之前,先对照这张表确认落点。** 三次押错字段的教训换来的。

## 字段 → 谁读

| config 字段 | 编剧(screenwriter) | 生图(t2i/i2i) | i2v 提交串 |
|---|---|---|---|
| `businessUi.referenceCases[].visualHint` | ✅ | ✅ | ✗ |
| `businessUi.sellingPointOptions[].promptText` | ✅ **整段全文** | ✅ | ✗ |
| `promptComposer.screenwriter.systemPrompt` | ✅ | ✗ | ✗ |
| `promptComposer.screenwriter.staticTemplates.videoTemplate` | ✗ | ✗ | ✅ |
| `promptAssembler.industryPrompts.<行业>` | **✗ 读不到** | ✅ | ✗ |
| `promptComposer.opsEditable.subjectDefinition.video` | ✗ | ✗ | **✗ 实测不进提交串** |
| `promptComposer.opsEditable.*` | **✗ 整层只读** | ctaRule/styleRule 进生图 | ✗ |

**`opsEditable` 是只读的**:PUT 提交后被服务端静默丢弃(两次独立复现,响应仍 `saved:true`)。其 `notes` 写着"运营主要改这一层"与实际相反。已发技术卡。其中 `layoutRules` / `industryRules` 不进任何链路,`ctaRule` / `styleRule` 只进生图。

**铁证**:`promptComposer.caseInjectionPolicy.includeFields = ["visualHint"]` —— 案例这一层只有 visualHint 进编剧,title/summary/prefill 都不进。
`promptComposer` 下的 `optionRules` / `sceneRules` / `industryRules` / `blockTemplates` **都不进编剧**(编剧 input 16 个字段里没有它们),它们里面的「到店/私信/扫码」只影响生图与 i2v。

## 编剧 input 的完整进食清单(实证 task_40ca1bd2a775)

```
case         = {id, title, visualHint}      ← 画面指令唯一入口
scene        = {id, label}
industry     = {id, label}                  ← 只有 id 和名字,没有行业 prompt
language     = {copyLanguage}
formSnapshot = {ratio, fields, selectedOptions, durationSeconds, segmentCount}
sellingPoints= [promptText全文, label]      ← 卖点整段喂进去,所以卖点文案会漏进台词
extraRequirement / hasReferenceImage / referenceImageCount
systemPromptSource = "screenwriter.systemPrompt"
```

**要改编剧的画面行为 → 改案例的 visualHint,不是行业 prompt。**
**要改编剧的规则纪律 → 改 systemPrompt。**
**要改视频层的锁 → 改 videoTemplate(注意 4096 字节上限)。**

## 硬流程(必须做,不许省)

1. 改之前:拉一条**真实任务的 input**,确认目标字段真的在里面;
2. 改之后:PUT 200 + API 回读 ≠ 生效,必须**再烧一单,拉新任务的 input/提交串**确认新文案真的送达;
3. 只有看到新文案出现在实际任务里,才能说"已上线"。

**Why**:2026-07-22 一晚押错三次 —— `subjectDefinition.video`(写了不进提交串)、`industryPrompts`(编剧读不到)、并且基于第二次的错误前提下了"配置改了不生效,要发技术卡"的结论,差点把自己的错甩给技术。用户原话:"技术把很多东西已经放在里面了,你明明自己都可以改"。

相关:[[feedback-evidence-standard]] [[reference-thinknova-prompt-architecture]]
