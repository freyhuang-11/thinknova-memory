---
name: reference-thinknova-prompt-architecture
description: "门店内容提示词改造的分层架构与两条铁律(老板2026-07-09拍定):三层职责/海报视频分家/i2v四细节/六宫格描述法/两铁律——动任何提示词前必背"
metadata:
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

老板 2026-07-09 拍定的提示词改造规范(全文=`00_规格与参考/门店内容_提示词改造规范_v1_2026-07-09.md`)。动生图/i2v/编剧任何提示词前先过一遍。配合 [[reference-thinknova-pipeline-flow]] [[reference-thinknova-config-powers]]。

## 两条铁律(违反即回炉)
1. **每段prompt自包含**:编剧/t2i/i2v每次调用无状态,模型只拿到「本段文字+本次传入图」,看不到平台案例/配置/上一环产出。禁引用"后台image_to_video配置""上文/之前编剧"等模型拿不到的东西。→ 当前违规:i2v写"基于后台image_to_video配置"(模型看不到)。
2. **视频场景画面零字幕**(视频专属,**海报不受此限**):台词只念不画进画面;画进分镜图→裁首帧→进视频=严重降质。补充导演信息走格外专用标注带(图1形式:灯光/情绪/摄影/音频各占独立框)。→ 违规根源已定位:config的`first_frame_prompt`写"整板唯一文字=格角落各一行旁白小字",要删。

## 🧩 解耦与骨架案例(2026-07-09 老板定方向,平台编剧实测)
- **策略(老板拍板)**:常用项目留**具体案例**,长尾全挂**骨架型案例**(产品当变量,案例只给镜头结构骨架,具体产品从 productName+编剧带入)。**全行业(26个)video+poster 都要补齐骨架案例**——这是当前执行任务(未完成,压缩后继续)。
- **解耦实测成立(平台编剧,非直连,更忠实且0扣费——编剧在平台成功只i2v失败)**:同一"皮肤前后对比"案例只换 productName:水光针→编剧正确带入"水光针补水/水珠清透"(gpt-5.5);刮脸→"小绒毛不敢素颜/刀片轻轻刮过皮肤光滑"(deepseek-v4-pro,理解很准)。→ **产品当变量通了,不用为每个子产品建案例**。
- **能力边界(实证)**:可视化/动作类项目(刮脸/洗剪吹)编剧+生图画得准;**医美/冷门/看不见的项目(水光针=打针)只能泛化成通用护理,不精准 → 长尾兜底=让用户传参考图**,不是无限建案例。
- **🔴模型约束(老板2026-07-09澄清,非bug)**:编剧模型 deepseek-v4-pro(主,贵/不稳)+ **gpt-5.5(兜底)** 轮换=设计如此。实测 **deepseek明显比5.5生动准确**。→ **我写编剧提示词必须保证在偏弱的 gpt-5.5 上也稳**,不能只按deepseek调。
- **建单坑**:offer(价格/活动)后端**必填**(空→422010"价格/活动必填",也印证F4口径);caseId 必须真实存在(错→500001"参考案例不存在");businessScenario=动机id(before_after/process_show/owner_voice等,非S码)。

## 🔴 grok只锁首帧 → 三锁(人物/产品/场景)全部只在首帧生效(2026-07-09 老板拍定,实证)
- **机制**:grok-1.5 i2v 只把**首帧 image_url** 当唯一锚,**不吃 `reference_image_urls`**(挂 i2v 的参考图对 grok 无效)。grok 是长期主力,不换,方案只能顺"只认首帧"设计。
- **实证 task_542dfcb24c65**:入参传了 person 参考图(assetId 1551,扎染男)+提示词有人物锁那句,但**首帧裁的是格2=整只西瓜(无人脸)**→ 成片出一个凭空年轻女性,和上传男完全无关。人物锁失效≠没传参考图,是**首帧没人**。
- **规律(进编剧)**:要锁人物→首帧必须有该真人正脸;锁产品→首帧有该产品;锁门店→首帧有该场景。**理想首帧=真人正脸口播近景+手持/紧邻主推产品+门店实景,三者同框**;纯产品特写/纯空镜/纯人像都不能单独当首帧(放后续格)。
- **我已改上线(2026-07-09,offline_store_video)**:`screenwriter.systemPrompt` firstFrameCell 后插「首帧三锁·最高铁律」(上中格三者同框、禁无人纯产品/空镜、有参考图则=参考图那个人/物/店);`staticTemplates.firstFrameTemplate` 给"产品七成人物三成"开**上中格例外**(人物正脸为主体、必须清晰出镜)。→ 解决"大西瓜首帧",消灭无人首帧。PUT 落库回读已确认。
- **纠错(2026-07-09 亲查)**:生首帧板的 i2i(task_cf5bf7ae4451)输入图 `images`/`image_url` **其实就是人物照片本人**(不是没喂),但 `imageEditOptions.video_first_frame={mode:restyle,strength:0.74,preserve_composition:false}` 把脸洗掉了、板prompt又逼产品进格 → 脸飘。`imageEditOptions.video_first_frame`+`firstFrameTemplate` 都在 config,**我能改**;没有"参考图路由到哪阶段"的 config 键(has_referenceRouting:false)。
- **真正卡点=一次 i2i 要"重构成六宫格板"又"保住某张脸",两者互斥**。strength 盲降会毁板结构,故先只上 prompt 保脸(firstFrameTemplate 加「保脸铁律:上中格=输入那张脸,五官发型肤色性别一致,宁可弱化其余格也保首帧脸」,已PUT落库)。**config 压得住 vs 必须拆两次生成(代码)——待烧一单证死**;压不住才给技术,带成片证据。技术卡草稿见 02_交付内容/给技术_参考图前移进首帧i2i_2026-07-09.md(未发,先自验)。
- **PUT端点(实证2026-07-09)**:GET `/admin/api/v1/agents?code=offline_store_video`(列表内联config,by-code详情路由已404);改 `v.config.promptComposer.screenwriter.*`;PUT `/admin/api/v1/agents/offline_store_video` body=整个agent对象JSON(非{config}包裹)。screenwriter 不在 opsEditable 镜像内,无需双写。页内改(harness滤=/base64,原文别外传)。

## 🧹 视频底座扫除已完成(2026-07-09,offline_store_video,全PUT落库+回读确认)
随机行业/案例/场景测试=整个面都可能抽到,不能只改共用底座就完事,但扫描证实**重灾区确在少数底座**:
- **字幕泄漏(铁律2真凶,剧情/字幕乱的根)**:`blockTemplates.layout_rules.first_frame_prompt`+`opsEditable.layoutRules.firstFrame`+`promptAssembler.video.outputTypePrompts.first_frame` 原写"格1/2/4/5角落各一行『旁白』小字""格内角落小字标注镜头序号/台词OS"→ 已改**整板绝对无任何文字**。
- **声线锁死女声**:i2v `stagePromptPresets.image_to_video.prompt`(+ops镜像)"口播＝年轻自然女声…像闺蜜"→ 改**随出镜人物性别(男则男声),不锁死**。
- **中英混写**:`businessOptionPrompts.platform`(9)`.visualFocus`(5)+`optionRules.platform`(6:tiktok/ins/yt/fb/pin/x,+ops镜像)→ 统一中文。**注:languagePolicy.map 的英文=故意的英文输出铁律(输出语言另一层管,按钮组改中文不影响英语出片);industryRules 括号英文=技术词,不动**。
- **优先级**:`conflictResolution.priorityOrder` 从 `[selected_option]` → `[user_extra_requirement, selected_option]`(客户补充要求抬到最高;海报早有,视频漏了)。
- **首帧三锁+客户override**:编剧systemPrompt+firstFrameTemplate+blockTemplates.layout_rules(+ops镜像)都写"首帧格=真人正脸+产品+门店同框;客户补充明确不要人物则遵从、该单不锁人改画外音"。口径=A(默认留真人)+客户可覆盖(老板2026-07-09定)。
- **两首帧路径纠结**:实测板prompt同时含 blockTemplates("产品七分人物三分"六格)与黑锚板(左上黑+上中=首帧)特征→两条都改齐,不赌哪条独活。
- **未动**:26行业质感词/negativePrompt/中文平台词(已中文)。
- **问题2 只修了一半(2026-07-09 端到端总验 task_823936ced8e2 实证)**:
  - ✅ 上游"渲染 videoPrompt":技术改 OfflineStoreContentService.php(cells 对象数组、`{{cells}}` 逐子格渲染、firstFrameTemplate 删`{{lines}}`、firstFrameCell 映射上中=>1);我把编剧 systemPrompt+outputContract 改成**对象数组8字段**(position/timeRange/shot/visual不可空/voice/line格式`[[声线,感情,真人感:「台词」]]`/sfx/move)对齐。总验:编剧 fallback=false、`compiledPlan.videoPrompt` 含**5个【子格】**、首帧三锁命中(板格2=老板正脸+面+店同框)、黑锚板✓、成片零字幕✓、人物/店/产品锁一致✓。config存活(部署没覆盖PUT)。
  - ❌ **下游"注入 i2v"没接**:i2v `input.prompt`(task_473ad576494d)= **0个【子格】**,还是旧基座("后台配置+台词只有以下几句+按6格演",1013字);编剧的 videoPrompt(1174字5子格)被丢。→ 成片**锁不住分镜图**、剧情grok瞎演(只靠首帧锁了人/店/产品)。修法=把 compiledPlan.videoPrompt 灌进 stagePromptPresets.image_to_video 的 `{{prompt}}`,删旧基座三段。技术卡=02_交付内容/给技术_问题2下游_把videoPrompt注入i2v_2026-07-09.md。Test D 已证:videoPrompt进i2v则grok跟。
  - 规格全文=00_规格与参考/商家Agent_编剧输出与提示词拼装_运营说明_v2。桌面成片=老陈牛肉面_端到端总验_2026-07-09.mp4。
- **纠错2(2026-07-09,老板点破)**:"参考图前移"不是技术活——生首帧 i2i 的输入图 `images`/`image_url` **本来就是人物照片本人**(不是没喂);真凶是 `imageEditOptions.video_first_frame.strength=0.74` 洗脸,而 strength+板prompt 都在 config、**都是我能改的**。已删该技术卡。人物锁靠"strength调低+保脸prompt+首帧三锁"自己解决,烧单验。
- **案例审计(2026-07-09)**:视频500/海报720案例结构干净(zh全在/prefill全在);海报216条en未翻=全disabled(非问题);视频32条en未翻(多tcm,小活待翻);"5条字幕泄漏"=误报(那是"旁白式OS"念白风格,非画字)。**已拍板并上线**:口径=A精修(默认首帧真人锚点;豁免三条:客户明确不要人/纯产品案例/product_only模式→首帧可无人不锁人)。视频32条en未翻**已翻上线(enStillCJK归零)**;海报216未翻=全disabled不管。**吃字**修复:i2v加"每字念完整不吞字漏字句尾数字咬清楚"。全部PUT落库。归档:00_规格与参考/门店内容_提示词底座扫除与首帧三锁_delta_2026-07-09.md。

## 三层职责(仅视频线)
- **编剧**:演什么(每格画面+台词+结构化标注 灯光/情绪/摄影/音频),同场景每次尽量不同(多样性)。builtin PHP,待技术开键。
- **生图t2i/i2i**:画得对且真(主体/六宫格白缝/负面/**首帧真实感灯光种子**),**不写死画面、不画任何字、不放语气**。我PUT。
- **i2v**:怎么动+念——**四细节**(①画面按六格②人物微距肤质零磨皮五指+**眼神明亮不呆滞**③声音口播声线+**有情绪/抑扬顿挫/高低起伏/停顿/不机器人**+音频④灯光延续首帧光源不平光)+**参考图三锁(人物/产品/场景,按上传条件注入)**+运镜只硬切+六宫格描述法+零字幕+自包含。我PUT+**双写opsEditable**。
- 核心:生图/i2v只给框架护栏风格,具体画面台词交编剧→**既去冲突又保多样性**。

## 海报≠视频(双向边界,防串)
- 海报是另一套:静态营销图,**本来就要有文字**(标题/价格/CTA),铁律2不适用;CTA要正确文案不是枚举值;**按客户需求(场景/行业/卖点/风格/CTA)定制,不同需求出不同海报**;无六宫格/分镜/i2v/语气概念。
- 反向:改视频不碰海报链路,改海报不套视频零字幕/分镜。

## 六宫格描述法
按内容不按位置:"输入含一张2×3六宫格分镜板,按6格顺序演,第1格即开场(=首帧)";不纠结哪张图是首帧/整板(老板都分不清顺序)。问题3(i2v角色错标)就这么修。

## 🏁 2026-07-09 里程碑:平台端到端跑通(F编剧+黑锚板+白缝裁格),但卡问题2
**验证单 task_96233(平台,非直连)**:F编剧✅跑通不回退(concept/boardCells/cells逐子格三件套/lines)、黑锚板✅(左上黑+5内容格)、**技术白缝裁格✅裁准上中格**、板零字幕✅、成片零字幕✅、人物场景锁✅。**但成片不跟分镜剧情**(只锁人物/场景,微距注入/两女碰杯等每格镜头没走)。
- **根因=问题2未修(硬证据)**:i2v `task_9f4afe` 的 input.prompt 里 **0个【子格】**——编剧的 F videoPrompt(compiledPlan.videoPrompt,含【子格】~2950B)被算出但丢弃;i2v实际收到旧基座("基于…后台配置…台词只有以下几句…")+stagePromptPresets骨架(泛指令"按6格演")。台词从旧基座进了i2v所以念对,但每格镜头没进→模型锚人物首帧瞎演。
- **给技术(问题2修复卡)**:i2v的prompt改用编剧`videoPrompt`(compiledPlan.videoPrompt,含【子格】),替换旧基座;删旧基座"台词只有以下几句"行+"后台配置"句;骨架与编剧【收尾说明】重复可清;总字节≤4096。验收:i2v input.prompt出现5个【子格】、成片逐格跟板。
- 对比:直连**Test D**(裁上中格+整板reference+**手写完整F骨架当prompt**)剧情真跟了——证明架构对,差的就是平台没把F骨架接进i2v。

## 我已PUT上线(2026-07-09,offline_store_video)
- **肤质强化**:firstFrameTemplate板 + i2v骨架 都加"绝不网红滤镜脸/瓷娃娃/蜡面/塑料/磨皮/AI假皮"+毛孔雀斑细纹唇纹碎发。
- **编剧升F格式**:`screenwriter.systemPrompt`=F视效总监版(输出JSON:concept/firstFrameCell/boardCells数组/**cells数组每段单行(JSON安全,关键:多行字符串会让LLM吐非法JSON→回退,已改单行)**/lines);`firstFrameTemplate`=黑锚板(左上纯黑+5格{{boardCells}}+强肤质/光影/色泽/无字);`videoTemplate`=`【视频总览】{{cells}}【收尾说明】`。
- **实证{{cells}}拼装成功**:编剧cells逐子格 → videoTemplate拼出compiledPlan.videoPrompt含【子格】(config层就能拼F,不用技术改拼装)——**但这份videoPrompt被i2v丢弃(问题2)**。

## 待办(2026-07-09 收尾,压缩前记)
- 🔴 **问题2**(技术):i2v接编剧videoPrompt——这修好平台就跟Test D一样跟剧情。
- firstFrameCell编剧吐"1"未吐"上中"(提示词钉死,防裁错格);子格5未走;个别叠化帧(grok老毛病);声音待老板耳审;编剧模型provider不稳(Invalid token/账号unavailable,回退频发,要技术保供应商)。
- 🟡 **全量提示词大扫除(老板07-09指令)**:所有行业案例、细节按钮提示词(businessOptionPrompts/scenePrompts/industryPrompts)、**海报也一起**,需改的全改。大工程,压缩后带全上下文执行。
- 桌面交付物:`D:\SamsoData\Desktop\咖啡_平台F编剧_端到端成片.mp4` + 分镜板方图/补边 + 裁格首帧;直连对照 `咖啡_裁格版_剧情跟板_D.mp4`(Test D,真跟剧情样板)。

## 改动归属(旧,保留)
- 我PUT:生图去冲突+删旁白画字 / i2v补四细节+六宫格描述+修角色错标。
- **编剧键已开(2026-07-09)**:`promptComposer.screenwriter.*` 我可PUT。变量契约+地雷见 [[reference-thinknova-config-powers]]。
