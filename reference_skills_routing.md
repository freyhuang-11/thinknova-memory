---
name: reference-skills-routing
description: "触发:动手做任何内容/视频/图/网页之前 → 查这张表,什么场景用什么 skill、什么顺序、什么不许用"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-09-14T17:25:00.315Z
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

### 我要做 YouTube Shorts(**全英文 + 老板音色配音**,2026-09-15 老板把这条线交给国内营销)
🔴 **管线现状源 = `03_工作台\YouTube\管线_YouTubeShorts英文配音_2026-09-15.md`,动手前必开。**
⛔ **「华语打新马」已作废** —— 那是我把老板一句 option-pick 当成了定调。
现行 = **全英文 + 老板音色 `S_rbgc0p2a2` / speech_rate 20**(老板 09-15 亲听拍板);
配音走 `_tts.py`(单句) / `_vo.py`(逐拍合成+排时间轴,**让声音决定片长**)。
受众仍是**马来西亚**(实测 100%,英语在马通用,不矛盾)。
⛔ 现有两条英文 Shorts(09-04/09-06,507 播放)**一道闸都没走过**,别拿它们当样板。

| 步 | 用什么 | 硬规矩 |
|---|---|---|
| ①选题 | `cheat-seed` / `cheat-recommend` / `cheat-trends` | 前 5–6 条**主动选七维差异最大**的,别都发最有把握的同款 |
| ②写稿 | **小蓝五条公式** + `video-script-style` | 公式在 `00_规格与参考\提示词参考库\参考_2026-07-20_小蓝内容公式拆解…md`,**第三节已翻译到实体店老板受众,别重翻** |
| ③过闸 | `cheat-score` → **三道闸** | 闸门原文 `对外推介\营销视频_导演台\_cheat\发布闸门.md`:真实性一票否决 / QL≥4 HP≥3 / composite≥6.5(噪声带 6.79)。🔴**改完必须重打分** |
| ④分镜 | `hurricane-shot-prompt` + `high-retention-hook` + `hkrr-clock` | 图形语法可抄小蓝;⚠️她的奶油纸底+衬线宋体与我们蓝白冲突,**老板没拍板前不许套** |
| ⑤出片 | 平台烧单 | 合成前向总指挥申请窗口(1205 未修);⛔不许编客户案例 |
| ⑥验收 | **`03_工作台\YouTube\_check_short.py`** | 机器闸:规格/开场非黑/静音<10%/切镜≥3/字幕。⚠️`成片与封面_固定规则_v1.md` 里假设**有人出镜**的条款(人物居中/盖脸/头顶 y32%)**不适用纯 B-roll** |
| ⑦上传 | `YouTube\upload.py` | **先跑闸门,非零不传**;`--skip-gate` 必须写理由且永久进台账 |
| ⑧复盘 | `YouTube\stats.py` → `cheat-retro` → `cheat-bump` | 🔴**完播率是质量信号,播放量是人气信号**;bump 前不许手动改权重凑分 |

### 我要看 SEO / 搜索数据(2026-09-15 老板把 GSC 也交过来)
| 我在干什么 | 用 |
|---|---|
| 站点真实搜索表现 | **`03_工作台\YouTube\gsc.py`** —— 点击/展示/查询词/页面/国家/sitemap 状态 |
| 爬虫准入 + sitemap 格式 | `03_工作台\周分析\_run.py` |
🔴 **两个源不一样,别混**:`_run.py` 扫的是**我们自己的 sitemap 文件**;GSC 说的是 **Google 实际索引了什么**。
实证:`_run.py` 报「协议/端口错 0 条」,而 GSC 里真实索引着 `http://thinknova.top:443/...`。
⛔ **Index Coverage(未编入索引的原因)和 Crawl Stats 都没有 API**,只能人在网页界面导 CSV——不许编。

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

## 2026-09-07 补录(审计发现的孤儿件)
- 海报构图/排版/标题字数 → `poster-composition`(09-02 建,A 档规则可直接执行)
- 重大方案/要老板拍板前 → `steelman`(章程第 2 条)
- 已归档停用(移到 `~/.claude/skills_archive_2026-09-07/`):hallmark、xiaolan-aroll、xiaolan-broll、media-use;hyperframes 全家保留但描述收窄为「明确要渲染时才触发」。
