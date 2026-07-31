---
name: project-thinknova-marketing
description: 国内营销线当前态(07-31收工):介质已换=AI实拍镜头打底+两层字幕;台词写法已定稿(花大几千版);六条成片在桌面;平台文生视频494为首选;压缩后从「待办」接着做
metadata:
  node_type: memory
  type: project
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-07-31T14:12:48.986Z
---

ThinkNova 国内营销线(小红书/抖音/视频号/快手)。Codex=海外线。**我=获客核心(老板07-30令)。**

## 🔴🔴🔴 铁流程(07-31 全天被骂出来的,违一条就是事故)
0. **脚本先给老板过目,他点头才动手**。老板给的话术/链接/参考**一律只是框架**,我扩成台词后必须先给他看。07-31 连犯三次(「你不要自己一拍脑袋就开始做」「你没确认之前你怎么做」「你一下出2条我都没心理准备」)。
1. **样片先行**:新形态先出≤12秒样片→批了才渲整条。免费额度也一样。
2. **查重三张表**:小红书内容.md + 脚本总库现役(V/W/X/Y/Z/P/Q/S2) + 发布记录。
3. **交付前自验**:抽帧联系表通看,孤字/重叠/黑屏自己抓,别留给老板。
4. **烧单前先查单价**,不是只查能力(07-31 直连 Seedance 单条6元 vs 平台0.6元,差十倍被骂)。

## ✅ 介质定案:AI实拍镜头打底(07-31 老板拍桌后的转向)
老板原话:「我一个短视频生成平台,你又是claude,你打不过豆包?我们自己的平台都可以生成」。
**根因=我选错介质**:一直用 CSS 画平面图形(纸底/色块/楷体),质感天然输给 AI 生成的真实影像。
**现行形态**:AI生成实拍空镜当底 + **两层文字**(底部全程口播字幕 + 中部大字卡3张封顶)+ 老板音色旁白 + 顶部常驻主题条。
❌ 已死的画风(别再回头):娱乐版(橙pill+emoji)/ 水墨浅底 / 黑底亮字 / 纸底彩图版——**全部作废,统一走实拍底**。

## ✅ 台词写法定稿(老板验收《花大几千请人拍》48秒:「语气节奏台词都不错,以后按这种写」)
写法在 `~/.claude/skills/video-script-style`,写任何台词先调它。七要点:①口语接口(你想啊/这还没完/说白了/最要命的是)②排比拆成一件一件说③**第一人称"我就填了一句"**④把账算给人看(一条大几千×一月四五条→你自己算算一年多少钱)⑤留口语的不整齐⑥自我指涉当证据("你现在看的这条就是这么来的")⑦**35-50秒,别做20秒**(短了=开头直接跳结尾)。

## 🔴 成片可看性五条(每条渲前对)
1. **顶部常驻主题条**,第一帧就在全片不撤(没有这条=别人说"不知道你在讲什么")
2. **第一句锁人群+给场景**(「开店的都遇到过这一幕…」),禁无主语代词开场
3. **两层文字并行**:底部全程口播字幕逐句同步+关键词标黄(时间戳一律取 ASR 逐字,禁手填);中部大字卡≤3张。**只有大字卡没有全程字幕=音画不同步感的根因**
4. **第一帧就出声**,旁白延迟≤0.1秒
5. **画面时长=素材实际长度**(裁过的要重新 ffprobe,排长了末尾黑屏)

## 🔴 内容红线
- **只做知识普及,禁举案例**(具体商家故事作废),**禁老盯着餐饮**(行业中性说"商品/店")
- **产品在解法位**露出,不喊注册;**不做效果承诺**(「效果还一样好」这类要老板点头)
- 选题必须长在"**小店做内容**"这件事上(时间/成本/精力/不敢出镜),不是泛泛的开店经验——否则"和我们有什么关系"

## 🛠 平台产素材(唯一通道,总指挥转达老板令:图和视频一律用自己平台)
- **纯文生视频**:页面 `/zh/app/capabilities/text_to_video`;API `POST https://api.thinknova.top/api/v1/ai/tasks`,body `{capability:'text_to_video', modelId:<id>, input:{prompt, ratio:'9:16', resolution:'720p', durationSeconds:10}}`,头带 `x-csrf-token`(任意 GET 响应头取)+`x-thinknova-locale`。查 `GET /api/v1/ai/tasks/{id}?assets=1`(正则捞 `.mp4` 最稳);列表 `GET /api/v1/ai/tasks?capability=text_to_video&page=1&pageSize=20`。
- **文生图**:同接口 `capability:'text_to_image', modelId:493`(gpt-image-2,**5积分/张,中文字准确**,能直接出带文案的营销海报)。
- 🔴🔴🔴 **查模型必须用 `GET /api/v1/ai/models`(不带参数)**。**加 `?capability=text_to_image` 会把默认模型 448 过滤掉**,只返回 493——07-31 我因此断言"448不存在",被老板截图打脸。**不带过滤才是真值**。
- **文生图台账(07-31 22:0x 真值)**:**448 = 老板设的默认**(provider lk888,**6分/张 per_image**,ratio 1:1/2:3/3:2/3:4/4:3/9:16/16:9,`size` 可到 3840,`quality` auto/high/medium/low,参考图最多14张)> 493(ttapi,5分/张)、491(kie)。图生图 492(5分/张)。
- **视频台账(同次真值,覆盖旧记录)**:文生视频 **494 grok-imagine=4分/秒(不是3,已涨价)**、416 sora-2=4分/秒、480 wan2.7=18分/秒;图生视频 460 omni_flash-10s=3分/秒(最便宜)、489/469/484=6、481=8。**488 grokTT 已下架**。
  🔴 **每次烧前拉一次真值核价,别信这张表**。
- **商家整片链路**(带编剧台词的):`POST /api/v1/business-video-assets/tasks`,必填 businessScenario/caseId/industryId/outputType/durationSeconds/productName/offer/selectedOptions;选模型只认 `videoModelId`。15秒75分/10秒60分/30秒180分,**30秒不推荐**(台词念两遍)。
- 🔴🔴🔴 **CDP 超时 ≠ 页面脚本没跑**:Chrome 里跑建单 JS 报 `Runtime.evaluate timed out`(常因脚本内 sleep>45秒),**fetch 照样发出去了**。07-31 我因此重复烧三镜白费120积分。**铁律:超时后先查任务列表确认已建单数再决定重发**;建单脚本内不要 sleep,间隔在外面等。
- ⚠️ **重 SPA 页会冻死 CDP** → fetch 一律在 `thinknova.top/robots.txt` 轻页跑。
- ⚠️ **信箱要全文扫**(令写在「给国内营销」栏,不在「给 Claude Code」栏,我漏过一次)。

## 🎬 制作流水线(照抄即可)
1. 台词(video-script-style)→ 老板确认
2. TTS:`scratchpad/vo3/*.py` 调 `volc_tts.tts()`,**末尾加缓冲字"嗯。"再剪掉**(TTS 会吃最后一个字);**多音字一律绕开**(得→要/卡→难/露脸→出镜/说服→告诉/照着→按)
3. ASR 拿逐字时间戳:`vo3/c2/volc_asr*.py`,字幕时间戳全部来自它
4. 烧镜头(494,画面提示词里**明令不出现任何文字**,所有字由图形层加)
5. comp:HyperFrames html,video 铺底 + 两层文字;渲 `npx --yes hyperframes@0.7.62 render . --experimental-fast-capture=false -o renders/X.mp4`
6. ffmpeg 合音轨(`adelay=100|100` + `apad=whole_dur=总长`)→ 抽帧自验 → 交付 D 盘桌面
**技术坑**:GSAP `fromTo` 默认 immediateRender(from里opacity>0会从第0帧漏出,加 `immediateRender:false`);`tl.call()` 在逐帧渲染下不可靠(改预建div+opacity切换);多video块末块差一帧会卡渲染。

## 📦 07-31 产出(六条成片全在 `D:\SamsoData\Desktop\`)
理由层29s / 不用出镜也能做视频30s(含真实界面录屏)/ 帮开店的人做内容22s / 一条视频有几步67s(长科普,七步三小时时间条)/ **花大几千请人拍48s(老板验收通过=样板)** / 熬夜找素材34s。
素材:`hf-test/my-video/d1/`(d1-d3店铺空镜、studio摄影棚、post后期、edit修图、ui界面录屏、p1-p3新海报、v1-v3成品切片、vend结尾片)。
新海报三张(理疗/健身/宠物,gpt-image-2生,中文准确)在 `scratchpad/posters/`。

## 📦 对外交付包(07-31,给同事的 Codex 用)
`02_交付内容/thinknova-video-kit/` + 同名 .zip(55KB)。六步流水线全套:skills×6、TTS/ASR 可跑脚本、ThinkNova 素材 API(建单+轮询+下载)、HyperFrames 合成模板、技术坑清单、验收法、《花大几千》范例源码+台词。
🔴 **零密钥**:走 `config.example.json`,音色 ID 是占位符(同事必须自己克隆,不许用老板音色);已扫描确认无 key/无 S_rbgc0p2a2。
⚠️ `来源与授权.md`:hurricane-shot-prompt 是外来材料本地化版,标注**内部自用不外传**——整包再往外给之前要老板点头。

## 📕 小红书(两个 skill 已装)
- `~/.claude/skills/xhs-note` = 写单篇笔记,**四根柱子:选题→标题→配图→文案**(三内容柱50/30/20+五类高爆选题;标题≤15字五开法;封面五要素五版式+**493出中文封面**;文案具体化+勾评论)+**违禁词五级扫描**+AI味词黑名单
  🔴 原库腔调是美妆学生党号(姐妹们/绝绝子/emoji轰炸),**只学结构不学腔调**——我们读者是三四十岁开店老板
- `~/.claude/skills/xhs-growth` = 涨粉/SEO/冷启动策略(本地化自 vivy-yi/xiaohongshu-skills **132技能库**,全量在 `00_规格与参考/xiaohongshu-skills/skills/` 九大类)
🔴 **132库里文案真货是 `seeding-copywriting`(18KB,PAS/能力→好处→结果/异议处理/风险反转)和 `trust-building`(35KB,80/20给价值)**;`copywriting-skills` 只有4.4KB全是废话,别读它(07-31 老板骂"你只看了一个skills"的根因)
🔴 新克隆(07-31):`guizang-social-card-skill`(**小红书图文卡片生成,28版式10主题,HTML→PNG,AGPL+商业授权**,接进产品要谈授权)、`autoclaw-xhs`、`XiaohongshuSkills`(自动发布)
🔴 最高危:**「搞钱/变现」违禁词**——"帮小店多卖钱"必须改"顾客更愿意进店"。
🔴 冷启动关键:**先囤10-15篇再开始发**,每天3篇测5种类型;我们现在正卡在"边想边发、量太少"。
🔴 SEO:每篇标题必须含核心词(开实体店/小店经营/实体店引流/门店文案/店铺短视频/夫妻店/开店第一年);关键词从搜索下拉+底部相关搜索+爆款标题共性来。
人设=**帮小店做内容的人**(07-30定);病根=知识号教学腔(CES:评论×4关注×8,收藏×1)。16-20活人版在桌面txt待发。

## 🎯 方法论 skill(全部已装,写脚本按顺序调)
`video-script-style`(台词写法·老板定稿)→ `high-retention-hook`(前3秒钩子·钩子OS四步+留存优先级8档+10原型库+四审七测)→ `hkrr-clock`(全片留存·HKRR+12点钟,整点12/3/6/9四大刺激)→ `hurricane-shot-prompt`(分镜五列表+生成提示词八段,拆自豆包 High-Retention-Video-Hook 原版)。
样本拆解:痒点5件套(马师傅)/意外收获>赠品(强哥)/口播四句话(小林哥)/六个第一性原理(章章说画)。
原版归档:`00_规格与参考/参考_High-Retention-Video-Hook_豆包原版.md`、`high-retention-video-script`(影视飓风HKRR,CC BY-NC只用理论)、`adam-video-hooks-skill`(MIT)、`xiaolan-prompt-bank`(CC BY-NC-SA)。

## 🔊 音色
S_rbgc0p2a2 = 混合样本版(16s平静+16s牢骚清洁版,剩11次重训),speech_rate 20(1.2倍速),整段一次 TTS 零断句。详见 [[reference-voice-clone-pipeline]]。

## 📤 已上报待总指挥回
**商家成片没有字幕也没有封面**(实测抽帧确认),内容生产"最后一公里"断了——中文短视频无字幕完播率低、发布必须选封面。已写信箱(commit 568b9eb),等他定接不接、字幕烧录还是给SRT、封面抽帧还是生成。

## 待办
1. 🔴 六条成片老板过目 → 定哪几条发、发哪里
2. 🔴 小红书:按 xhs-growth 先囤10篇再开发;16-20活人版待发
3. 老板欠录:3分钟大实话(桌面脚本)
4. BGM 仍缺(SFX 是合成临时货);对照实验7条数据回填;X只发视频号
