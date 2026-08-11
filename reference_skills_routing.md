---
name: reference-skills-routing
description: "触发:动手做任何内容/视频/图/网页之前 → 查这张表,什么场景用什么 skill、什么顺序、什么不许用"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-08-11T14:27:00.993Z
---

# Skills 路由表(34 个,2026-08-11 全量清点)

> 老板 08-11:「**你明明有那么多 skills,你知道什么时候用什么嘛**」「都给我好好整理一下,
> 什么场景用什么 skills,遵守什么规则,这些都很重要,我们现在有太多 skills 了」。
> **按"我正要干什么"查,不按名字查** —— 名字记不住,场景才是触发点。

## 🔴🔴🔴 三条铁规矩(违反一次全链路白做)

1. **`hyperframes` 是强制入口。** 凡是**做/改/渲染任何视频、动画、动态图**(含 promo、讲解片、
   带字幕的片、标题卡、叠加层、幻灯片)——**先读 `hyperframes`,再动手**。它自己写着 "Mandatory entry point"。
   🔴 我一直在手搓 ffmpeg + PIL + headless Chrome,踩了 `drawtext` 段错误、`color=` 无 `d=` 挂死、
   cv2 读不了中文路径一堆坑 —— **这些坑本来不用踩**。
2. **`cheat-score-blind` 是内部 sub-agent,主对话里绝对不许调。** 它靠 context 隔离才有意义,
   主对话调用等于自己给自己打分,校准全废。只能由 cheat-score / cheat-predict / cheat-bump 通过 Task 派发。
3. **顺序不能乱**(见下面「组合拳」段)。单独调一个中间 skill 拿到的东西是半成品。

---

## 场景 → 用什么

### 我要写小红书
| 我在干什么 | 用 |
|---|---|
| 写/改**一篇**笔记 | **`xhs-note`** —— 四柱:选题→标题→**配图**→文案(含违禁词五级扫描 + AI味黑名单) |
| 涨粉 / 流量 / SEO / 冷启动 | **`xhs-growth`**(不是写单篇) |
🔴 08-11 血案:标题是四柱之一,**我交了四篇一个标题都没有**。写之前先把四柱列出来打勾。
配套现状:[[project_thinknova_xhs_line]]

### 我要写短视频稿子(国内营销线)
**四件套,按顺序调,别跳步**:
1. **`video-script-style`** —— 台词怎么写(老板 07-31 亲口验收:「以后按照这种写」)
2. **`high-retention-hook`** —— 前 3 秒钩子(管"第一句怎么炸")
3. **`hkrr-clock`** —— 3 秒之后到片尾每一拍(管"为什么中途划走")
4. **`hurricane-shot-prompt`** —— 选题→3条路线→分镜表→生成提示词(**两层工作流,不许跳中间层**)

### 我要定选题 / 搞清楚谁在看 / 打分复盘
**`cheat-*` 是一整个闭环,不是十一个独立工具**:

| 环节 | skill | 备注 |
|---|---|---|
| 首次搭架子 | `cheat-init` | **必须最先跑**;其余 cheat 在 `.cheat-state.json` 不存在时自动路由到它 |
| 从对标号学 | `cheat-learn-from` | **最早期信号的唯一来源**;冷启动全靠它 |
| 抓热点填候选池 | `cheat-trends` | 解决"我没素材" |
| 谁在看 | `cheat-persona` | 写进 `audience.md`;🔴 含实绩信号,`cheat-score-blind` 硬禁读 |
| 定选题 | `cheat-seed`(一次一个)/ `cheat-recommend`(从候选池排序) | |
| 轻量打分 | `cheat-score` | 只输出到控制台,不写文件不预测 |
| 锁盲预测 | `cheat-predict` | **写完不可改**,hook 强制 |
| 拍了 / 发了 | `cheat-shoot` / `cheat-publish` | 配对使用:拍了进队列,发了出队列 |
| T+N 复盘 | `cheat-retro` | 🔴 **不复盘的预测等于占星** |
| 升级 rubric | `cheat-bump` | 最高风险动作,5 步强制 + 跨模型审核 |
| 看我现在该干嘛 | `cheat-status` | 无副作用,随时可调 |

🔴 **08-11 认账**:我只用了 `cheat-score` + 闸门(这套的一半,而且是错的那一半)。
**`cheat-persona` 的 audience.md 至今空的、`cheat-seed` 没用过、`cheat-learn-from` 扒了 8 个号
数据没导进 benchmark、`cheat-predict` 只打分没锁预测。**
→ **错全出在选题和受众上。分数打得再准,选题对着错的人,越准越白费。**
详见 [[reference_cheat_gates_calibration]]

### 我要做视频 / 动画 / 动态图
🔴 **先读 `hyperframes`(强制入口)**,再按需下钻:

| 下钻到 | 什么时候 |
|---|---|
| `hyperframes-core` | 写合成 HTML 之前必读 —— `data-*` 时间属性、`class="clip"`、轨道、子合成、确定性渲染 |
| `hyperframes-creative` | 设计规格(frame.md/design.md)、配色、字体、旁白、节拍规划、构图 —— **非动效** |
| `hyperframes-animation` | 所有动效:原子动作规则、场景蓝图、转场、7 种运行时适配器、24 种文字动效 |
| `hyperframes-keyframes` | 需要 seek-safe 关键帧、GSAP 时间线、SVG morph、3D 景深时 |
| `hyperframes-cli` | 跑 init/render/preview/lint/**transcribe**/**remove-background**/doctor;**渲染报错也查它** |
| `hyperframes-registry` | 装/找现成的 block 和组件(`hyperframes add` / `catalog`) |

### 我要处理素材(抽帧 / 裁切 / 抠像 / 配乐 / 字幕 / 配音)
**`media-use`** —— 一个 skill 管所有素材需求。核心动词 `resolve`(bgm/sfx/image/icon/logo/voice/grade/lut),
**操作类**(剪/重构图/拼接/静音剪/转码)看它的 `references/operations.md`。

🔴 **本机实测状态(2026-08-11 跑 `--doctor`)**:
- ✅ `ffmpeg` / `ffprobe` 8.1.1 · ✅ node v24 · ✅ 19 个内置音效
- ❌ **`heygen` 没装** → **免费路径全不可用**(bgm / image / icon / voice TTS / avatar 视频全走不了)
- → 现在能用的是:**operations.md 的本地 ffmpeg 配方**(剪、重构图、拼接、静音剪/取精华片段、
  scenedetect 选帧)、`hyperframes` CLI 的 `transcribe` 和 `remove-background`
- 要开免费路径得先装:`curl -fsSL https://static.heygen.ai/cli/install.sh | bash` 再 `heygen auth login --oauth`
  (**装之前问老板** —— 会绑账号)

🔴 **`media-use` 不是封面生成器。** 它给的是抽帧/抠像/放大/**scenedetect 自动选帧**这些零件,
**版式还是要自己搭**。但 scenedetect 正好是我 08-11 栽的那个跟头(选错帧,眼睛被绿反光盖住)。

### 我要剪口播原片 / 做配图字幕层
| | |
|---|---|
| `xiaolan-aroll` | 口播粗剪:去静音停顿、剪掉喊「卡」的废 take、去重复 retake,**全自动但出 EDL 日志** |
| `xiaolan-broll` | 整条片的 b-roll 动画层 + 逐词弹出卡拉OK字幕,交**带 alpha 的 ProRes MOV 叠加层**(A-roll 不烧进成片) |
🔴 `xiaolan-broll` **一次都没用过**,而抖音封面/成片正缺这种叠加层。

### 我要动 ThinkNova 的提示词
**`thinknova-prompts`** —— 总台账 + 操作手册。改编剧 systemPrompt / videoTemplate / i2v 预设 /
案例 visualHint / 负面词**之前**调它:现行值在哪、写入配方、纪律、历史归档路径。

### 我要做网页 / 落地页 / 重设计
**`hallmark`** —— 反 AI 味设计。三个动词:`audit`(只诊断不改)/ `redesign` / `study`(从截图或 URL 提取设计 DNA)。

### 别的
`status` —— 看 Claude Code 会话状态和额度。`cheat-migrate` —— state 版本升级,平时用不到。

---

## 组合拳(顺序错了等于白做)

- **做一条营销视频**:`cheat-seed` 定选题 → `video-script-style` 写台词 → `high-retention-hook` 磨前3秒
  → `hkrr-clock` 排全片留存 → `hurricane-shot-prompt` 出分镜和提示词 → `cheat-predict` 锁预测
  → 拍完 `cheat-shoot` → 发完 `cheat-publish` → T+3 `cheat-retro`
- **做一条合成片**:`hyperframes`(入口)→ `hyperframes-core`(合同)→ `hyperframes-creative`(设计)
  → `hyperframes-animation`(动效)→ `media-use`(素材)→ `hyperframes-cli`(渲染)
- **写一篇小红书**:`xhs-note` 四柱 → 图从 ThinkNova 烧 → 发完要数据 → `cheat-retro`

## 🔴 我实际用过的 vs 没用过的(08-11 诚实清点)

**用过**:`cheat-score` · `hyperframes` CLI 的 remove-background 一条命令 · `xiaolan-aroll` 一次 ·
`hallmark` · `xhs-note` · `video-script-style` · `hurricane-shot-prompt` · `thinknova-prompts`

**没用过但今天正好该用的**:`media-use`(手搓了 ffmpeg 一整天) · `xiaolan-broll`(封面叠加层) ·
`cheat-persona` / `cheat-seed` / `cheat-learn-from` / `cheat-trends`(选题受众全靠拍脑袋) ·
`hyperframes-*` 六个下钻(一个没读过)

🔴 **规矩:动手之前先问一句「这件事有没有现成的 skill」。**
今天两个跟头都是这么栽的 —— 封面手搓、选题拍脑袋。

相关:[[reference_cheat_gates_calibration]] [[project_thinknova_xhs_line]] [[project_thinknova_marketing]] [[reference_douyin_cover_benchmark]]
