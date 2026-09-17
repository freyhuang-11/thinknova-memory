---
name: reference-skills-routing
description: "触发:动手做任何内容/视频/图/网页/发布之前 → 查这张表,什么场景用什么 skill、用什么脚本、先问哪个第一性问题、什么不许用"
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-09-17T12:08:22.737Z
---

# 场景 → 用什么(skill 32 个 + 运营脚本 14 个,2026-09-17 逐个核对过)

> 老板 08-11:「**你明明有那么多 skills,你知道什么时候用什么嘛**」
> 老板 09-17:「**什么时候用什么 skills,怎么用,第一性原理和对抗式审查以及 steelman 要在每一个地方用上**」
> **按「我正要交出什么产物」查,不按名字查** —— 名字记不住,产物名才是触发词。

## 🔴🔴🔴 动手前三问(每一行场景都要过)

1. **这件事有没有现成的 skill / 脚本?**(答不上来 = 先查本表,别手搓)
2. **这件事的不可再拆事实是什么?**(表里每行第三列写死了该问的那一句 → [[feedback-thinking-protocol]])
3. **这是不是一个方向性判断?** 是 → 先跑 `steelman`,把反方最强版本写给老板看。

🔴 **连试三次同类手段仍不通 = 强制停手转第一性,⛔ 不许试第四次。**
(09-17 实证:Playwright 反检测试了两轮全废,拆到「指纹是浏览器的属性」才一次通。)

### 🔴 DONE 判据(光写规矩不管用,08-08 和 08-11 都证明过)
**每条内容的台账里必须有一行**:`skill: <用了哪个>` 或 `skill: 无 —— 因为＿＿`。
填「无」不犯规,**填不出理由才犯规**。台账 = `03_工作台\YouTube\_cheat\…` / `rednote发布\_台账.md` / `TikTok\_第一批_文案与排期…md`。
⇒ 这样「有没有查过本表」是**可检查的产物**,不是「我记得我想过」。

## 🔴🔴🔴 四条铁规矩(违反一次全链路白做)

1. **`hyperframes` 是视频/动画的强制入口。** 做/改/渲染任何视频、动画、动态图(含 promo、讲解片、
   带字幕的片、标题卡、叠加层)——**先读 `hyperframes`,再动手**。⛔ 不许手搓 ffmpeg + PIL + headless Chrome。
2. **`cheat-score-blind` 是内部 sub-agent,主对话⛔绝对不许调。** 它靠 context 隔离才有意义。
   只能由 cheat-score / cheat-predict / cheat-bump 通过 Task 派发。
3. **顺序不能乱**(见「组合拳」段)。单独调一个中间 skill 拿到的是半成品。
4. 🔴 **发布一律走脚本,一律预约,一天一条**(老板 09-17)。⛔ 不许我在浏览器里一步步点——烧额度。
   ⛔ 有副作用的脚本调试**一律 `--dry`**(09-16 我连跑 8 轮,在小红书草稿箱留了 15 条垃圾)。

---

## 一、内容生产:场景 → skill

### 我要交出一篇小红书笔记
| 产物 | 用 | 先问的第一性问题 |
|---|---|---|
| 一篇笔记 | **`xhs-note`** —— 四柱:选题→标题→**配图**→文案 | 这个人刷到我这条的那一秒,他在找什么? |
| 涨粉/流量/SEO/冷启动方案 | **`xhs-growth`** | 我们现在缺的是曝光,还是缺点进来之后留不住? |
🔴 08-11 血案:**标题是四柱之一,我交了四篇一个标题都没有**。写之前先把四柱列出来打勾。
🔴 出稿后必跑机器闸 `03_工作台\_check_xhs.py`(R1–R22)。⚠️ 闸门版本比我的记忆新——**以闸为准,别按记忆写**。
配套现状:[[project-thinknova-xhs-line]]

### 我要交出一条短视频稿子(国内营销线)
**四件套,按顺序调,⛔别跳步**:
1. **`video-script-style`** —— 台词怎么写(老板 07-31 亲口验收:「以后按照这种写」)
2. **`high-retention-hook`** —— 前 3 秒钩子(管「第一句怎么炸」)
3. **`hkrr-clock`** —— 3 秒之后到片尾每一拍(管「为什么中途划走」)
4. **`hurricane-shot-prompt`** —— 选题→3 条路线→分镜表→生成提示词(**两层工作流,不许跳中间层**)

**第一性问题**:这条片子替观众省掉的是**哪一个具体动作**?(说不出具体动作 = 选题还没定,别急着写台词)

### 我要定选题 / 搞清楚谁在看 / 打分复盘
**`cheat-*` 是一整个闭环,不是十五个独立工具**:

| 环节 | skill | 备注 |
|---|---|---|
| 首次搭架子 | `cheat-init` | **必须最先跑**;其余 cheat 在 `.cheat-state.json` 不存在时自动路由到它 |
| 从对标号学 | `cheat-learn-from` | **最早期信号的唯一来源**;冷启动全靠它 |
| 抓热点填候选池 | `cheat-trends` | 解决「我没素材」 |
| 谁在看 | `cheat-persona` | 写进 `audience.md`;🔴 含实绩信号,`cheat-score-blind` 硬禁读 |
| 定选题 | `cheat-seed`(一次一个)/ `cheat-recommend`(从候选池排序) | |
| 轻量打分 | `cheat-score` | 只输出到控制台,不写文件不预测 |
| 锁盲预测 | `cheat-predict` | **写完不可改**,hook 强制 |
| 拍了 / 发了 | `cheat-shoot` / `cheat-publish` | 配对使用:拍了进队列,发了出队列 |
| T+N 复盘 | `cheat-retro` | 🔴 **不复盘的预测等于占星** |
| 升级 rubric | `cheat-bump` | 最高风险动作,5 步强制 + 跨模型审核 |
| 看我现在该干嘛 | `cheat-status` | 无副作用,随时可调 |
| 版本迁移 | `cheat-migrate` | 一次性,平时用不到 |

🔴 **08-11 认账(到 09-17 仍未还清)**:我只用了 `cheat-score` + 闸门 —— 这套的一半,而且是错的那一半。
`cheat-persona` 的 audience.md 至今空的、`cheat-seed` 没用过、`cheat-learn-from` 扒了 8 个号数据没导进 benchmark。
→ **错全出在选题和受众上。分数打得再准,选题对着错的人,越准越白费。** 详见 [[reference-cheat-gates-calibration]]

### 我要交出一条视频 / 动画 / 动态图
🔴 **先读 `hyperframes`(强制入口)**,再按需下钻:

| 下钻到 | 什么时候 |
|---|---|
| `hyperframes-core` | 写合成 HTML 之前必读 —— `data-*` 时间属性、`class="clip"`、轨道、子合成、确定性渲染 |
| `hyperframes-creative` | 设计规格(frame.md/design.md)、配色、字体、旁白、节拍规划、构图 —— **非动效** |
| `hyperframes-animation` | 所有动效:原子动作规则、场景蓝图、转场、7 种运行时适配器、24 种文字动效 |
| `hyperframes-keyframes` | 需要 seek-safe 关键帧、GSAP 时间线、SVG morph、3D 景深时 |
| `hyperframes-cli` | 跑 init/render/preview/lint/**transcribe**/**remove-background**/doctor;**渲染报错也查它** |
| `hyperframes-registry` | 装/找现成的 block 和组件(`hyperframes add` / `catalog`) |

⚠️ **HyperFrames 的 `content_overlap` 闸会挡下压字幕区的元素** —— 09-16 EN-A v2 就是被它挡的,
解法是把元素挪出字幕带(不是关闸)。⛔ **不许为了过闸去改闸门阈值。**

### 我要交出一张海报 / 海报提示词
**`poster-composition`** —— 八条构图规则的可执行版;写/改海报提示词、审成品、配 styleRule 时用。
⚠️ **海报线和视频线是两套行业/场景表**,报数前现拉 → [[reference-thinknova-option-scene-rules]]

### 我要改 ThinkNova 的提示词
**`thinknova-prompts`** —— 总台账 + 操作手册。改编剧 systemPrompt / videoTemplate / i2v 预设 /
案例 visualHint / 负面词**之前**调它。🔴 同时必读 [[feedback-prompt-change-hard-rules]] 九条 + 走[[feedback-action-gates]]闸 2 字节账。
🔴 **提示词改动一律不许我自己拍板,走总指挥。**

### 我要下方向判断 / 要老板拍板 / 要否掉一条老规矩
**`steelman`** —— 立最强反方,打不掉的写进方案里给老板看。
🔴 老板 09-04:「**你是总指挥你一直犯错其他人怎么办,你这条线应该是要最严谨的**」
⛔ 不许假中立收尾(「X 也不是不行,但…」),必须给明确结论 → [[feedback-thinking-protocol]]

### 别的
`status` —— 看 Claude Code 会话状态和额度(老板关心额度时直接调)。

---

## 二、发布与运营:场景 → 脚本(老板口中的「工具」)

🔴 **老板 09-17 定:「不管是 youtube 还是 tiktok 小红书都要用工具自动发布,不然我们的额度扛不住」**
⇒ 下面每一条线都有脚本。**⛔ 看到「我在浏览器里一步步点」= 我走错路了,回来查这张表。**
根目录 = `D:\SamsoData\Documents\视频制作平台分析\03_工作台\`

| 我要做 | 跑什么 | 硬规矩 |
|---|---|---|
| 发 YouTube | `YouTube\upload.py` → `_publish.py` | 官方 API;**先跑闸门,非零不传**;`--skip-gate` 必须写理由并永久进台账 |
| 验 YouTube 成片 | `YouTube\_check_short.py` | 机器闸:规格/开场非黑/静音<10%/切镜≥3/字幕 |
| YouTube 配音 | `YouTube\_tts.py`(单句)/ `_vo.py`(逐拍合成+排时间轴) | 老板音色 `S_rbgc0p2a2` / speech_rate 20;**让声音决定片长** |
| 看 YouTube 数据 | `YouTube\stats.py` → `cheat-retro` → `cheat-bump` | 🔴 完播率=质量信号,播放量=人气信号;bump 前不许手动改权重凑分 |
| 看 SEO / 搜索 | `YouTube\gsc.py` | ⛔ Index Coverage 和 Crawl Stats **没有 API**,只能人在网页导 CSV——不许编 |
| 查爬虫准入/sitemap | `周分析\_run.py` | 🔴 它扫的是**我们自己的 sitemap 文件**;GSC 说的是 **Google 实际索引了什么**。两个源别混 |
| 发小红书 | `rednote发布\_auto\publish.py` | Playwright + 持久化登录态;🔴 提交键是**闭合 shadow root**,DOM 找不到 → 截图找红像素点坐标 |
| 发 TikTok | `TikTok\_auto\tt_post.py` | 🔴 **CDP 连老板自己的 Chrome**,先双击 `_auto\start_chrome_debug.bat`;job 没 `schedule` **直接拒跑** |
| 发博客 | `博客发布\_pub7.py` | create → 配封面 → 预约;一天一篇 |
| 发冷邮件 | `邮件推广系统\run.py` | cap 在 `MB_CAPS`;⚠️**只抬 cap 不抬 `DAILY_TARGET` = 白抬** |
| 出稿前过机器闸 | `_check_xhs.py` / `_check_dy.py` / `群内容\_check_week.py` | 三条线出稿前必跑;⛔ 不许为了过闸改阈值 |

### 🔴 发布线的第一性问题(每次发之前问一遍)
**「这条内容会被推给谁?那批人存在吗?」**
- 09-17 直播 0 观众就是这一问没问:YouTube 开播只推给**最近跟频道互动过的人**,我们互动≈0 ⇒ **种子集合是空集**。
  再好的直播技巧都乘以 0 ⇒ 正确动作是**先停直播、只发短视频**。
- 同理:TikTok **站内重复内容 → 0 播放**(跨平台搬运不罚,站内重复罚);⛔ `#fyp`/`#foryou` 无用。

### 🔴🔴 CDP 连 Chrome 的两条硬事实(09-17 实测,本机 Chrome **153**)
- **Chrome ≥136 会无声忽略「默认配置目录」上的 `--remote-debugging-port`。**
  证据:进程命令行里参数明明在,`netstat` 里端口就是不监听,不报错不提示。
  ⇒ **必须显式给一个非默认的 `--user-data-dir`**(Google 堵的洞:防恶意程序用 CDP 读默认配置的 cookie)。
  ⇒ **代价:非默认目录 = 全新浏览器身份,没有登录态,TikTok 要老板本人在那个窗口登录一次。**
- **Chrome 单实例**:已经开着 Chrome 时再带参数启动,参数被整个吃掉,只在旧进程开个新窗口。
- ⛔ **我这边的安全闸会拦下「复制浏览器配置目录」和「启动带调试端口的 Chrome」**(判定为凭据窃取形态,拦得对)。
  ⇒ **这一步只能老板自己跑** `_auto\start_chrome_debug.bat`;⛔ 不许绕。
- 🟡 **更根本的解法是 TikTok 官方 Content Posting API**(Direct Post),彻底不用浏览器;
  ⚠️ 要开发者应用 + 审核,未过审只能发私密 —— 没验证过,是线索不是结论。

### 🔴🔴 TikTok「预约发布」整条链路(09-17 逐层探出来的,脚本 `_auto\_schedule.py`)
1. **不是按钮,是 `input[value="schedule"]` 单选**;⛔ JS `.click()` 无效(React 只认可信事件)⇒ 必须 `pg.mouse.click(坐标)`。
2. **勾它会弹授权框**「允许平台保存你的视频供预约发布之用?」,在点「允许」之前
   **`.TUXModal-overlay` 盖住整页,所有点击都打在遮罩上** —— 这就是「点了没反应」的真因。
   ✅ 老板 09-17 当面同意点「允许」。⛔ 旁边就是「取消」,只认文字恰好等于「允许」的 button。
3. 授权后才出现两个 **readonly** 框(日期/时间)⇒ ⛔ 改 value 无效,必须点开浮层选。
4. **日历 `span.day` 的 DOM 顺序 = 日期顺序**,今天那格带 `selected`
   ⇒ 目标 index = 今天 index + 相差天数(⛔ 别按文字找:月末那几格是下月的 1/2/3,会撞车)。
5. 🔴 **收起的时间浮层 width>0 但 height=0**,容器带 `tiktok-timepicker-invisible`
   ⇒ 只判 width 会把「收起」当成「打开」,后面全部点空。**必须判 height。**
   分钟只有 **5 分一档**;要点的是整行 `.tiktok-timepicker-option`,不是里面的 `-text` span。
6. 🔴 **设完日期后日历还开着**,这时点时间框只是把日历关掉 ⇒ 先 Esc 收起再开时间。
7. 🔴🔴 **预约模式下提交键叫「预约发布」,不叫「发布」**;同排还有「保存草稿」「放弃」。
   ⇒ 只认 `<button>` + 文字恰好相等 + **必须只有一颗**,多了就停手。
8. 🔴🔴 **`keyboard.type(中文, delay=12)` 会掉字**(实测「你不用会写马来文,写你会的」→「你不用会来文,你会的」)
   ⇒ delay 调到 45、分句打、**打完必须回读比对,对不上重打,三次不过就拒发**。⛔ 错字发出去比不发更糟。

### 🔴 三个已知的网页端坑(都写进脚本了,别重踩)
- **TikTok `#标签`⛔不能混在正文里一次打完** —— 井号被联想吞掉 ⇒ 正文先打完,标签一个一个打→等 2 秒→Esc→补空格。
- **⛔ 不许用模糊查找去点「发布」** —— 09-17 工具把「**放弃**」认成「发布」,差点丢光已填内容
  ⇒ 只认 `textContent` 恰好等于「发布」的那颗 button。
- **`page.viewport_size` 在持久化上下文里是 None** ⇒ 尺寸只认 `innerWidth/innerHeight`。

---

## 三、组合拳(顺序错了等于白做)

- **做一条营销视频**:`cheat-seed` 定选题 → `video-script-style` 写台词 → `high-retention-hook` 磨前 3 秒
  → `hkrr-clock` 排全片留存 → `hurricane-shot-prompt` 出分镜和提示词 → `cheat-predict` 锁预测
  → 拍完 `cheat-shoot` → 发完 `cheat-publish` → T+3 `cheat-retro`
- **做一条合成片**:`hyperframes`(入口)→ `hyperframes-core`(合同)→ `hyperframes-creative`(设计)
  → `hyperframes-animation`(动效)→ `hyperframes-cli`(渲染)→ `_check_short.py`(机器闸)→ `upload.py`
- **写一篇小红书**:`xhs-note` 四柱 → 图从 ThinkNova 烧 → `_check_xhs.py` 过闸 → `publish.py` **预约**发 → 要数据 → `cheat-retro`
- **给老板一个方案**:第一性拆解 → `steelman` 立反方 → 对抗式审查逐句 → 才许发出 → [[feedback-thinking-protocol]]

---

## 四、🔴 诚实清点(09-17 重记,上一版停在 08-11)

**今天(09-17)我跑了博客/YouTube/小红书/TikTok 四条线,`skill` 一个都没调。**
写小红书没走 `xhs-note` 四柱(直接照着 `_check_xhs.py` 的闸条倒推);TikTok 选题没走 `cheat-seed`;
八条成片没有一条锁过 `cheat-predict` 盲预测 ⇒ **发完也没法复盘,数据回来只能靠感觉解释。**
→ 这正是 08-11 那次认账的同一个病:**闸门(打分)在用,选题和受众(cheat-seed/persona)一直空着。**

**子 agent 也一个没派。** [[feedback-action-gates]] 附「并行」写着:扫描类/调研类/逐条改写类丢给子 agent,
**写配置和烧单我自己来**。09-17 八条 TikTok 成片的压制、七个 job 文件的生成,都是我串行自己干的。

**已归档但仍能被加载**(`~/.claude/skills_archive_2026-09-07/`):`hallmark` · `media-use` · `xiaolan-aroll` · `xiaolan-broll`
⚠️ **「归档」≠「用不了」** —— 09-17 实测 `hallmark` 仍然正常加载。要做落地页/重设计时它照样可用。

🔴 **规矩:动手之前先问一句「这件事有没有现成的 skill 或脚本」。** 手搓之前,先在本表里找不到对应行,才许手搓。

关联:[[feedback-thinking-protocol]] [[feedback-action-gates]] [[reference-cheat-gates-calibration]] [[project-thinknova-xhs-line]] [[project-thinknova-marketing]] [[feedback-boss-rulings]]
