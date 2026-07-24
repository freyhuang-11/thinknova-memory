---
name: reference-thinknova-prompt-fields
description: "ThinkNova 提示词字段读取图 —— 哪个字段被编剧/生图/i2v 读取,改提示词前必查,防止改在没人读的字段上"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-07-24T20:17:06.056Z
---

# ThinkNova 提示词字段读取图(2026-07-22 实证)

> 🟢 **2026-07-25 再确认(task_4edfd26d6b87 编剧 input + admin GET config 实测)**:
> - **两条管线吃不同字段,别混**:**编剧(脚本/台词)**只吃 `case.visualHint`+`sellingPoints`全文+`screenwriter.systemPrompt`(全局5743字)+`selectedOptions`;**生图/i2v(画面)**才吃 `scenePrompts[场景]`+`industryPrompts[行业]`+`sceneRules[场景]`(14条各~130字)+`industryRules[行业]`(20条各~200字)。→ 想改**台词/脚本**改 visualHint+卖点+systemPrompt;想改**画面效果**改 scene/industry 那几层(生图侧)。「同行业不同场景要不同效果」=生图侧 sceneRules/industryPrompts 的活。
> - **`optionArbitration`/`peoplePolicy` 不在 config、是后端代码运行时注入**(config 全文搜不到):规定 `appearanceMode` 独家决定出不出人(product_only→no_person→旁白)、`visualFocusCanOverridePresence:false`=**一票否决案例 visualHint 的口播锁人意图**。要改这条"谁说了算"只能技术改代码。
> - **sceneRules 缺键会炸建单**:sceneRules 全场景有、独缺 S14 → 商家建单组装期读 `sceneRules[S14]` 取不到 → 500(不进编剧不代表不影响建单;建单会组装生图/i2v侧的prompt)。


> 🔴🔴 **2026-07-24 重大更正——本文件曾有多处错误,已按技术官方文档校正。动手前先读 [[reference-thinknova-tech-docs-index]] 里的原文档 + 拉线上真实 config 核对路径,别只信本表。**
> **已查实的错误**:
> 1. **`opsEditable` 不是只读!存反了。** 技术文档《提示词模板保存与主体仲裁_2026-07-20》明确:`promptComposer.opsEditable`(taskGoal.firstFrame / subjectDefinition.firstFrame)才是**运营可编辑真值层**;`blockTemplates.*` 才是它自动编译出的**镜像(手改会被还原,不是保存失败)**。下表里"opsEditable 整层只读"是 07-22/23 污染会话写反的结论,作废。
> 2. **字段路径可能漏段/过时**:技术文档里编剧在 `promptComposer.**masterPipeline**.scriptwriter.systemPrompt / .staticTemplates.videoTemplate / .lineValidation / .fallbackPolicy`;本表旧写法 `promptComposer.screenwriter.*` 少了 `masterPipeline`。schema 从 07-08 `promptAssembler` → 07-19 `promptComposer.masterPipeline.scriptwriter` 演进过,**以线上真实 config 回读的实际路径为准**,改前必核。
> 3. **businessUi 嵌套 vs 扁平**:admin `config_json` 里案例/场景/卖点在 `businessUi.{referenceCases,businessActions,sellingPointOptions,detailOptionGroups}`;但商家端 `GET /api/v1/business-video-assets/config` 返回的是**扁平化顶层**(referenceCases 等直接在顶层)。引用字段先说清是哪个端点。

**改任何提示词之前,先对照这张表确认落点。** 三次押错字段的教训换来的。

## 字段 → 谁读

| config 字段 | 编剧(screenwriter) | 生图(t2i/i2i) | i2v 提交串 |
|---|---|---|---|
| `businessUi.referenceCases[].visualHint` | ✅ | ✅ | ✗ |
| `businessUi.sellingPointOptions[].promptText` | ✅ **整段全文** | ✅ | ✗ |
| `promptComposer.screenwriter.systemPrompt` | ✅ | ✗ | ✗ |
| `promptComposer.screenwriter.staticTemplates.videoTemplate` | ✗ | ✗ | ✅ |
| `promptAssembler.industryPrompts.<行业>` | **✗ 读不到** | ✅ | ✗ |
| `promptComposer.opsEditable.taskGoal.firstFrame` | 首帧主模板(整段覆盖) | 编译进 blockTemplates 生效 | — |
| `promptComposer.opsEditable.subjectDefinition.firstFrame` | 全局主体仲裁(优先级高于风格/行业/案例) | 生效 | — |

**🔴 `opsEditable` 是运营可编辑真值层(2026-07-20 文档,已纠正旧"只读"错误)**:改 `opsEditable.taskGoal.firstFrame` / `subjectDefinition.firstFrame`,保存时系统自动编译到 `blockTemplates.task_goal.first_frame_prompt`。**别手改 `blockTemplates`——它是派生镜像,手改会被还原(这不是保存失败)**。`firstFrame` 是整段覆盖,改前先复制原文整体改回。案例差异写案例 `visualHint`,别写进全局主体仲裁。旧记忆"opsEditable 只读/PUT静默丢弃"来自污染会话,已作废;若线上 PUT 真被丢弃,那是 admin API 419 或编辑器问题,不代表字段只读——用 UI 编辑器保存法。

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
