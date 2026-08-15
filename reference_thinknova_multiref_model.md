---
name: reference-thinknova-multiref-model
description: "触发:要动视频模型或时长、或发现\"用户参考图没进 i2v\"时 → 模型↔时长映射/两模型定位定案/maxReferenceImages 规则/200单成功率诊断/403 根因"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-28T20:19:41.406Z
---

> 🔴🔴🔴 07-31 定价唯一真值(实证):**改模型价只认 admin 模型编辑弹窗的「定价 JSON」框**(`{currency,billingUnit,creditPrice,baseDurationSeconds,durationPriceStepSeconds}`)——前台 `/api/v1/ai/models?capability=X` 与 agent 的 videoModelOptions 都读它。**`GET /admin/api/v1/models` 列表里的 `credit_price` 字段是死数据**,用 API PUT 改它前台零反应(07-31 白改一轮)。计费公式=**视频模型价×秒数 + 生图6 + 时长服务费(8秒30/10秒24/12秒18/15秒9)**;现值:482=4、484=6(30秒186)、488文生视频=4(原6积分/10秒亏本已修)、460/468=3、481wan=8。分辨率(480p/720p)在能力JSON里是用户可选参数,**定价JSON无分辨率维度=一个模型只能一个价**,要分档只能复制模型(老板 07-31 定:不分)。
> 🔴 07-31 里程碑注:grok 做不到硬切(溶解=能力边界,老板定论),omni 才能硬切;建单选模型字段=videoModelId(modelId 被静默无视);烧完必验 task.model。模型现状详见 project_thinknova_0729_screenwriter_stack。

# ThinkNova i2v 模型 · 多参考图台账

> 排错流水与历史单号在 `archive/thinknova_arch_history_to_0729.md`。

## 🟢🟢🟢 2026-08-13 **已解**:多参考图无人声 = 提示词加一句「不要背景音乐，只要人物讲话声音。」

**EMMA 实测,8 分钟内一次干净 A/B(同剧本、同 2 张图、同图序、同作者):**
| 时间 | 单号 | 图数 | 那句话 | ASR 结果 |
|---|---|---|---|---|
| 14:40 | `task_305bbbcb877e` | 2 | 无 | **零人声** |
| 14:48 | `task_8c4e1dc62036` | 2 | **有** | **正常说满全片** |

🔴 **原话与位置(照抄,别改写)**:`不要背景音乐， 只要人物讲话声音。` —— 放在提示词**最开头**,紧跟图片声明之后(`图一为首帧图，图二为分镜图，使用参考图人物生成视频。` 之后第一句)。

### 为什么是这句、而不是「禁止静音」
⛔ **「禁止静音，禁止只有动作没有对白」完全无效** —— EMMA `task_3f4a586b8b73` 写满这类反静音句,照样零人声。
✅ 有效的那句管的是**音轨内容分配**(不要 BGM、只要人声),不是"要不要有声音"。多图模式下音频管线是活的,但 grok 默认拿 BGM/环境音把音轨填满,人声就被挤没了。**必须显式把 BGM 关掉,人声才出得来。**

### ❌ 当天我下过三条错结论,全部作废(留着防复发)
1. 「参考图 ≥2 就哑」——被我们管线 2 张说话的单打脸。
2. 「门槛卡在 4 张」——EMMA 2 张就哑,门槛不存在。
3. 「分镜板必须排第一张」——成功那单 `图一为首帧图、图二为分镜图`,**板还是第二张**,顺序无关。
🔴 **共同病根:样本只取单侧就下规律。** 下"阈值/规律"类结论前,必须把已产出的正反样本都拉齐(正例和反例各若干)再说 → [[feedback-source-truth-first-commander]]

### 老板 08-13 口径:**多参是我们故意做的**,不是误用
所以"模型表声明 `max_reference_images=1`、运行时 `_reference_image_limit=5`"这条**不作为"用错了"来处理**,而是:明知声明 1 张仍故意超发,超发后供应商不保证行为,掉声音是代价 —— 现在已有提示词解法,代价可控。

### 待办
- EMMA 继续测其它组合(老板安排)。
- ⚠️ **我们自己的管线还没加这句** —— videoTemplate/编剧层要不要加,等 EMMA 测完更多组合再定;加之前必须算 4096 字节账(挤掉谁),并单条 A/B。

---

## 2026-08-13 排查过程与接口事实(根因已解,以下留作方法与坐标)

**症状**:同案例同提示词,只改图片数 —— 4 张图的成片**一句人声都没有**(画面正常、环境音正常 mean −15.1dB,不是静音文件)。老板原话「不按台词说话」,实测比这重:**是完全不说**。

**已排除**:台词逐字进了 i2v 提示词(程序化比对 5/5 命中);2804 字节远低于 4096;编剧 `source=text_model` 没回退。**组装层无辜,是供应商侧行为。**

### 实测矩阵(distinct = 去重后 grok 实际收到几张图 = `image_url` ∪ `reference_image_urls`)
| 单 | distinct | 结构 | 人声 |
|---|---|---|---|
| `task_7a36e19d7e74` | **1** | 板 + [板] | ✅ 5句一字不差 |
| `task_7da9bf1ee568`(父 `task_72b026b79287`) | **2** | 板 + [板, 人物] | ✅ 全程15秒说满 |
| `task_3e03be93be9e`(父 `task_a14f0c864b9a`) | **4** | 板 + [板, 人, 景, 物] | ❌ 零人声 |
| 老板手写 4 单(`4953f42e399a`/`d4347f800b6f`/`3f4a586b8b73`/`11efb272deab`) | **2** | 首帧 + [首帧, 分镜图] | ❌ 3哑 + 1只蹦「好 谢谢」 |

🔴 **别把它简化成"张数超过N就哑"——我 08-13 就这么下过一次结论,当场被自己的下一单打脸。** 老板手写单 distinct=2 全哑,我们管线 distinct=2 却说话,**结构相同结果相反**。已知差异:①老板单是双人对话/我们是单人口播 ②老板单 `image_url` 是真实首帧照片/我们是分镜拼板 ③提示词格式(引号台词 vs 「开口台词:」)。**三个变量都没隔离,谁是主因未定。**

🔴 **提示词层压不住**:老板 `task_3f4a586b8b73` 的提示词已明写「禁止静音,禁止只有动作没有对白,禁止只做表情不说话」→ **照样零人声**。别再往提示词里加反静音句。

### 官方文档根因(子agent 08-13 查,带源)
- 🔴🔴 **xAI 官方:`image` + `reference_images` 是非法组合,返回 400**(https://docs.x.ai/developers/model-capabilities/video/generation)。三模式互斥:`prompt`=t2v / `prompt+image`=i2v / `prompt+reference_images`=**R2V**。
  **而我们两个都传**(image_url=分镜板,reference_image_urls=板+商家图),却没收到 400 → **中转商在替我们改写请求、按图数自动选模式**。
- 🔴 **中转商 = kie.ai**(`tempfile.aiquickdraw.com` 是它的临时文件域名,文件 3 天删)。其 grok-imagine 文档**零 audio/voice/dialogue 参数**,且 prompt 标注 "Language: English"(我们传中文能出中文台词属**未文档化行为**,随时可能变)。
- 🔴🔴🔴 **R2V 的语音要靠 `reference_audios`/`voice_id` 驱动,不是靠提示词写台词** —— 我们从来没传过。官方 26 个预置音色(ara/eve/orion…)**没有任何一条标注支持中文,查不到,不许假设**。(https://docs.x.ai/developers/model-capabilities/video/reference-to-video)
- ⚠️ **R2V 官方封顶 720p;时长多家第三方写 2–10s**。我们要 15 秒 —— **参考图一多可能不止丢声音,时长和清晰度也在被降级**,这是同一根因的另外两个症状,验的时候一起看。
- 【查不到,别编】GitHub/Reddit/X 上无人复现此问题;预置音色语言表;kie.ai 能否透传 voice_ids。

### 关键接口事实(08-13 实测)
- 🔴 **`reference_image_urls[0]` 恒等于 `image_url` 本身**(分镜板被重复放进参考图数组)→ **算"grok 到底看到几张图"必须去重**,直接读 `reference_image_urls.length` 会算多一张。
- 🔴 **商家只上传 1 张,服务端实发 2 张;上传 3 张,实发 4 张** —— 服务端自己加一张。
- `promptComposer.opsEditable.masterPipeline.i2vReferenceStrategy` **只有 `storyboard_board` 一个值**,config 里**没有「不给 i2v 传商家参考图」这个选项**,要技术加。
- ✅ **`businessUi.videoGeneration.referencePolicyByDuration.{10,15}.allowStoryboardCrops` 现在两档都是 `true`** —— ⛔ 本文件 §四 旧写「只有10秒档 true,8/12/15 全 false」**已作废**。

### 自查配方(可复用)
成片有没有真人声:`ffmpeg -i x.mp4 -vn -ac 1 -ar 16000 x.wav` → `PYTHONIOENCODING=utf-8 python asr2.py x.wav`(scratchpad,faster-whisper tiny,本地免key)。**必须同时看 `volumedetect` 的 mean_volume** —— 有声音但 ASR 零输出 = 有环境音无人声,和静音文件是两码事。

### ❌ 作废的旧结论
「08-04 grok多参**双参**单成功」——翻原单 `task_db787156c4c0`,video 子任务**实发参考图 = 1 张**,不是 2 张。**它不能当"两张也行"的证据。** 另一单 `task_793a8d1ad7a7`(4张)整单 failed。

### 待办 · 老板 08-13 亲自去问 kie.ai 客服(四问,最值钱=能否透传 `reference_audios`)
**答复回来前不要动线上配置。** 按答复分三条路:

| 客服回答 | 接着做 |
|---|---|
| 能透传 `voice_ids` **且支持中文** | 最省事:出技术卡让服务端多图时补该参数,烧 1 单验中文音色质量 |
| 能透传但**音色不支持中文** | 此路作废 → 走「参考图不传给 i2v」 |
| **不能透传/不答** | 走「参考图不传给 i2v」+ 同步启动换模型评估 |

**「参考图不传给 i2v」方案(不依赖客服,但要技术)**:分镜板本身就是用商家参考图生成的(板上的人 = 人物参考图那个人),**人物锁在画板阶段已完成,i2v 再传一遍是多余的**。让 i2v 只收板 → 回到 distinct=1 的必出声状态。阻碍见上:`i2vReferenceStrategy` 没有这个枚举值。

**换模型备选**(子agent 08-13 查,带源):**Kling O3 / Video 3.0 Omni** —— 明确支持中/英/日/韩/西 5 语唇形 + 每角色最多 4 张参考图 + 最多 6 分镜 + 15 秒,是唯一**四项全中**的;定价按有无音频分三档,说明音频是一等公民。**Seedance 2.0** —— 参考资产容量最大(9图+3视频+3音频),音素级中文唇形。⚠️ 换模型 = 全线重标定(时长映射/价格/门头锁定/审核红线全部重测),先在对方 playground 手工跑一条中文对白 + 2 张参考图,别先动我们的线。

## 一、🔴🔴 定位定案(2026-07-28 老板实烧 10 单看片拍板)
| | **grok 415** 口播优先版·15秒 | **omni 460** 实景还原版·10秒 |
|---|---|---|
| 中文台词 | **没问题**,各类解说都能扛 | **做不了** |
| 英文台词 | — | **可以** |
| 分镜跟随 | **约 80%**(过 ≥70% 及格线) | — |
| 稳定性 | **差:5 单 3 成 2 挂** | **好:5 单 5 成** |
| 定位 | **口播/解说线** | **画面线 + 英文解说** |

- ❌「omni 正常说话没问题、正常台词量没问题」已推翻 → **omni 中文口播做不了**(07-28 看片实测,推翻 07-27 凭能力参数的推断)。
- **同输入不同结果**:两条 omni 同案例同参数同负面词,一条出六宫格一条不出 = **模型随机,当前打法不可控**。omni 台词一多就念不清楚。
- **绝大部分商家的真实需求是 omni**(要场景/人物/产品统一);grok 只在"口播必须说清楚"时优先。

## 二、模型 ↔ 时长映射(老板口径:说 grok1.5 一律指 preview 满血版)
- **15 秒** = **Grok 1.5 preview(415)满血版**
- **10 秒** = **omni(460)**;Grok 1.5 fast(468)通道挂着
- **8 / 12 秒** = veo3.1(470)/ Jimeng3.5(471)等,**已淘汰不用**

**omni 只有 10 秒** → "两个模型同时长"的 A/B 不成立,口播/TVC 对比只能是 omni-10秒 vs grok1.5-15秒。

**官方时长机制(07-28 文档 §1~§4,以此为准)**:
- `businessUi.videoGeneration.allowedDurations` **可配 5~30 秒任意整数**,不再固定 10/15;前台只显示"已勾选 且 至少一个模型在能力 JSON 声明支持"的时长。**保存 Agent 立即生效,无需发布。**(手册 v4 §9"10/15 秒以外需技术"是被覆盖的旧表述。)
- 模型能力 JSON `constraints.{durations, defaultDurationSeconds, maxReferenceImages}`;**默认时长由模型自己声明,前台不再强行优先 15 秒**。
- **三层优先级**:①**场景级首选模型** `businessUi.businessActions[].preferredVideoModelId` —— 一旦设,**前台连时长和模型选择框都不显示,后端强制不可绕过**,用该模型的能力 JSON 默认时长;可选 `preferredVideoDurationSeconds` 覆盖但**文档不建议填**。②Agent 可选时长 × `modelAllowlistByDuration` 白名单,用户在其中选。③(首帧策略这层)案例不填才用 Agent 全局。
- 🔴 **场景锁模型的失效条件**:该模型必须**同时**在本 Agent 时长-模型白名单内、且其默认时长在可选时长里,否则**锁定失效、静默回退用户选择逻辑**。我们所有模型 `base_duration_seconds=0`(未配默认时长)→ **锁场景前必须先给模型配默认时长**。
- 同 `model_code` 的多条模型记录,**前台只展示默认或权重最高的一条**。
- 🔴 **任务创建时冻结模型/时长/案例策略,改配置只影响新任务,旧任务不重写** → 对照实验必须重新烧单。

## 三、🔴 核心机制:多参 vs 单参由模型决定
> 官方口径:《运营说明_商家视频时长模型与案例首帧策略》v1.0 / 2026-07-28 §6。
- **张数由"所选模型的最大参考图数量"决定**(模型能力 JSON `constraints.maxReferenceImages`)。
  - **只支持 1 张**(415):**只提交主首帧图** → 上传的人物/场景/产品图 **100% 进不了 i2v**,**这是设计如此不是 bug**(只进 i2i 分镜板)。
  - **支持 2 张及以上**:**主首帧图优先**,再按剩余名额加入完整分镜图和用户上传的角色/场景/商品参考图;**用户上传不足不会凑数生成无关图**。
- 文档明说:**模型是否真正锁人物/构图/分镜顺序仍取决于供应商能力,配置只能决定提交什么参考图和顺序。**
- → 想让 i2v 拿到真人/场景/产品图(锁人物、降 grok 审核拒率),**必须用多参模型**,靠不了商家流程的截格。
- 🔴 **`storyboard_board` 下主首帧图 = 整板本身,且文档明写"不重复提交同一张图"**(手册 v4 §3.5) → 整板模式白白吃掉一个参考位。要 omni 的人物·产品·门店一致性**用 `panel_crop`**。
  ⚠️ 我曾实测"整板模式下 omni 实际只喂 1 张"(200 单诊断,**未留任务号**);文档 §6 说剩余名额仍会加用户上传图 → **以文档为准**,这条实测**需带任务号重核**再谈。
- 🔴 **该开关不是全局一刀切**:案例级 `businessUi.referenceCases[].i2vReferenceStrategy` 优先于全局(07-28 文档 §5)→ **grok 案例和 omni 案例可以各用各的**,按"模型会不会把网格生成进成片"分配(见 [[project-thinknova-film-types]] 八)。❌ 旧说法「全局开关,grok 和 omni 不能各用各的」已被文档推翻。
  ✅ **线上全局(07-29 03:43 起)= `panel_crop`**。→ **omni 案例现在默认也走裁格**,多参位不再被整板白吃;要让 omni 走整板必须在该案例上**显式**写 `storyboard_board`。
- ❌「DB 列 `max_reference_images`=1 卡死 omni」已推翻 → 运行时 limit 实际是 5,DB 列那个 1 没生效(07-28)。**别再按这条走。**

## 四、时长档字段 `referencePolicyByDuration`(文档未收录,已降级)
线上 config 有 `businessUi.videoGeneration.referencePolicyByDuration`:只有「10 秒」档 `allowStoryboardCrops:true`,8/12/15 全 false;`reserveFirstFrame:true` 全档;`cropPriority:[hero, scene, product, detail]`。
🔴 **三份官方文档(07-24 手册 v4 / 07-26 案例预设 / 07-28 时长模型)全部没有这个字段**,且 07-28 §6 把提交张数的决定权**明确只归给模型 `maxReferenceImages`**。
→ **按文档:415 只吃 1 张纯粹是模型能力,不是时长档锁的。** ❌ 旧说法「15 秒档也把 415 锁死在 1 张 = preview 画面控制不住的配置层根因」**降级为未经文档确认的猜测,不许当根因外传**;要用它先找技术确认该字段还生效不。

## 五、🔴 200 单实拉诊断(2026-07-28)
**怎么查(可复用)**:admin 任务列表翻页拿 `task_no` → `GET {任务接口}/{task_no}` → `data.task.input` 里有 **`_reference_image_limit`**、**`_i2v_reference_strategy`**、`referenceImages[]`、`reference_image_urls[]`;`error_message` 同层。(**用 id 查详情返回 `task:null`,必须用 `task_no`。**)

| 模型 | 运行时 limit | 实际喂进 i2v | 近期成功率 |
|---|---|---|---|
| omni 460 `panel_crop` | 5 | **2~5 张** | 13 成/18 |
| omni 460 `storyboard_board` | 5 | **只有 1 张(整板本身)** | 同上 |
| grok preview 415 | **1** | 1 张 | 11 成/19 |
| grok fast 468 | 5 | 5 张 | **0 成/7 = 全挂** |
| sora 469 | — | 1 张 | 5 成/5 |

⚠️ **这张表测于 07-28,当时全局 = `storyboard_board`**;07-29 03:43 全局翻 `panel_crop` 后,不显式配置的案例都走 `panel_crop` 那一行。要引用"实际喂进 i2v 张数"必须**带任务号并确认该单的 `_i2v_reference_strategy`**。

**失败根因**:
- **468 全挂 = 供应商通道空,不是配置问题**:manxueapi `HTTP 503 No available channel for model grok-imagine-video-1.5-fast under group auto`;1renmanju `pool: no available account`。→ **当前 10 秒口播无可用模型,口播只能走 415 的 15 秒**。已把 468 前台隐藏并改名「通道维修中·暂不可用」。
- **omni 的失败 = `图片/视频下载超时(30s)`**(lk888 拉不到我们的图),不是模型读不懂 —— 即老板说的"omni 说图片读取时间太长"。整板模式图更大更易超时。**修法给技术:CDN 域名或 presigned URL。**
- **415 的失败 = manxueapi `Connection timeout`**(通道抖)。

## 六、现役模型台账
| id | model_code(内部认这个) | 供应商 | 参考图 | 定价 | 前台名 | 备注 |
|---|---|---|---|---|---|---|
| 415 | grok-imagine-video-1.5-**preview** | manxueapi | 单参 1 | 3分/秒 | 口播优先版·15秒(讲话最稳) | 15 秒档;manxueapi 曾大面积 503/账号池空 |
| 460 | **omni_flash**-10s(`maxReferenceImages:7`) | lk888 | 多参 | 3分/秒 | 实景还原版·10秒(锁人物·产品·门店) | 🔴待改名加「无中文口播」;**右下角白色四角星水印**(ffmpeg delogo 可去) |
| 468 | grok-imagine-video-1.5-**fast** | 1renmanju | 单参 1 | 3分/秒 | 口播优先版·10秒 | **通道空,前台已隐藏、标注维修中** |
| 459 | **grok-video-3**(文生,10秒) | — | — | **2分/秒最便宜** | 经济实惠版·10秒(文字生成) | ✅ |
| 416 | **sora-2** | — | — | — | 广告创意版·文字生成视频 | ✅ |
| 469 | **sora-2** | lk888 | 1 | **6分/秒(偏贵待调)** | 广告创意版·图片生成视频 | ✅;成本仅 ¥0.1/秒 |
| 467 | grok-imagine-video-1.5 | 1renmanju | 1 | — | 备用通道·口播10秒 | ❌不可见 |
| 470 | **veo3.1** | lk888 | 1 | 4分整段 | 实验版·暂不推荐 | ❌**已淘汰**:第 6 秒把六宫格画进成片,且不听运镜指令 |
| 471 | **Jimeng3.5 / doubao-seedance**(⚠️两处记名不一致,待核) | lk888 | 1 | 10分整段 | 实验版·暂不推荐(低清) | ❌**已淘汰**:496×864 最低+场景产品全虚构 |
| 411 | grok 1.5 文生(**已停用但是多参样板**) | manxueapi | `max_reference_images=5` | — | — | `model_request_mode=manxue_videos_reference_images_json`,07-12 smoke 验过 |

- ⚠️ **模型列表接口的 `credit_price` 是废弃字段(常显示 0),真值只在编辑弹窗的「定价 JSON」里**。
  ❌「credit_price=0 就是模型价被清零 → 服务费一刀切」已推翻(会导致 10 秒多收 30 分;07-27 老板"以 grok1.5 为原型检查"纠正)。
  ❌「agent 的『生图6+按秒模型价+服务费』公式也用于直连文生/图生视频」已推翻 → **直连只吃单模型价格**(07-28)。定价全貌见 [[project-thinknova-film-types]] / [[project-thinknova-pricing-ambassador]]。

## 七、供应商现状与坑
- **通道**:lk888 正常(承 460/469/470/471);**manxueapi 大面积不稳**(503 / `pool: no available account`);**1renmanju 也不行**(老板实测)。415/468 同属 grok 系,**通道抖动是首要失败源**。老板要求**加新中转站+渠道故障转移**(OPS-20260724-04),全线阻塞项。
- 🔴 **403 精确根因**:i2v 子任务的 `input.image_url` / `reference_image_urls` 指向 `https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/generated-assets/provider-input/...` = **裸 OSS 原始域名**(非 cdn.thinknova.top)+**无签名**(`hasQuery=false`);该前缀在原始 OSS 域名上**非公共读** → 供应商无签名 GET = **403 AccessDenied**。
  **修法(交技术,3 选 1)**:①给 cdn.thinknova.top 域名 URL ②该前缀设公共读 ③给 presigned GET URL。已入《给技术_OPS-20260724-04》。
- **上传坑**:直连「图生视频」UI 多图上传被前端 `max_reference_images=1` 卡死(已报技术)。我这边传不了本地图 → **烧单/上传老板 UI 操作,我做后台验证+分析**。

## 八、模型改名 / 命名规矩
- 🔴 **中英文名都是客户看的(有外国客户),不能拿英文名塞技术身份**。**内部识别靠「模型 ID + `model_code`」**(后台列表本来就显示,改名丢不了)。
- 🔴🔴 **定位轴 = 「口播稳」vs「画面像」,不是「有没有台词」**(老板 07-28 纠正取反的命名):名字按「画面像」轴写,**不要写成「无旁白/Cinematic no voiceover」**,但**必须把中文口播限制写进括号**。
- **改名接口**:`PUT /admin/api/v1/models/{id}`,body=GET 回来的**完整模型对象**改 `display_name_zh`/`display_name_en`/`frontend_visible`,带 admin CSRF;列表 `GET /admin/api/v1/models?page=1&pageSize=100`。⚠️ **别从弹窗保存**(弹窗值可能是刷新前的旧数据);单条模型无 GET 端点。

## 九、改单参模型为多参(配方在归档「468 多参配置」)
要点三条,详细字段与 JSON 见归档:①**两个 count 字段必须一起对上**——DB 列 `max_reference_images` vs 通用协议 JSON 的 `referenceImages.maxCount`,只改一个无效;②`requestTemplate` 的 `image` **只收字符串不收数组**(填数组 → 供应商 HTTP 400 unmarshal),多图必须另开 `reference_images` 数组字段;③**分镜板(i2i)本来就吃多参**,问题只在 i2v 请求格式。
- 🔴 **grok-fast 多图时长硬约束(供应商亲口)**:`multiple reference images must use 6s or 10s`,15s 只留单图/文生视频。→ 测多参烧单**时长选 10s**;商家口播若强制 15s,多参口播需改 10s 输出。

## 十、🔴 图生图产品没锁 = 和口播锁人物同根
诊断(i2i 子任务):模型 451、**mode=t2i**、参考图确实传了 3 张、prompt **已有锁定语**(以参考图为准/保持商品不变)。
- **根因不是提示词没写锁**,是**六宫格母版 = 合成多格图 + t2i 重画**:gpt-image 照描述"重画一个像的",不是"用你上传这张",参考图权重弱 → 画出通用商品对不上包装。
- **真正的锁 = 多参 i2v 直接吃产品参考图**。**口播锁人物 + 产品锁,统一根治点 = 多参 i2v。**
- 治标:提示词把产品描述改成"外形比例配色包装材质必须与提供的商品参考图完全一致、不得替换相似款";备选:分镜板产品格走 image_to_image 低 strength 高 adherence。
- ⚠️ 编剧侧配套硬规:**禁止编剧写产品形态词**(它看不到参考图),见 [[reference-thinknova-prompt-architecture]]。

配套 [[project-thinknova-dingdian-koubao]] [[reference-grok-content-policy]] [[reference-thinknova-tech-docs-index]] [[project-thinknova-storyboard-test]]


## 🔴 2026-08-16 · 多参掉人声「主因未定」——三份证据打架,别拿任何一份当定论

共享库信箱 08-15(老板指定写给总指挥)给的解法是:提示词最开头照抄「不要背景音乐, 只要人物讲话声音。」,
证据 `task_305bbbcb877e`(无 → 零人声)vs `task_8c4e1dc62036`(有 → 说满),**每边 n=1**。
但我手上两批更靠后的证据指向别的主因:
- **08-13 受控实测(每档 n=3)**:同措辞下 **2图 2/3、3图 1/3、4图 0/3**;技术把 i2v 实发砍到 2 张后同配置 **0/3 → 2/2** → **图数是梯度变量,措辞救不了**。
- **08-15 夜英文提示词台账(日语 n=5)**:多参降级模式下**混语言 = 音频宕机只剩 BGM,整条单一英语 = 活**,**日语多参 0/5 判死**。

→ **三者可能都真、同指一个「音轨分配」机制,主因未定。三份证据全部保留,不许删任何一份、不许拿其中一份当结论对外说。**
→ **定因方案(待老板拍板,要烧积分)**:固定图数 + 固定语言,**只切换那一句话**做一次隔离 A/B(每边 ≥3 单)。已摆进 08-16 例程报告。
→ 一致的部分(可以直接用):**失败形态不是静音,是音轨被 BGM/环境音占满**;自查必须 `volumedetect` 的 mean_volume + ASR 转写两个一起看,有声音但 ASR 零输出 = 有环境音无人声,**报现象时不许说成「零音频」**。

### 上游三条硬事实(08-15 信箱首次落库,来源 kie/xAI 文档,标「待核」的部分照标)
- 🔴 xAI 官方:`image` + `reference_images` 是**非法组合返 400**;三模式互斥(`prompt`=t2v / `prompt+image`=i2v / `prompt+reference_images`=R2V)。**我们两个都传却没收到 400 → 中转商在替我们改写请求、按图数自动选模式。**
- 🔴 中转商 = **kie.ai**(`tempfile.aiquickdraw.com` 是其临时文件域名,**文件 3 天删**);其 grok-imagine 文档**零 audio/voice/dialogue 参数**,prompt 标注 `Language: English` → **我们传中文出中文台词属未文档化行为,随时可能变**。
- ⚠️ **R2V 官方封顶 720p**,时长多家第三方写 2–10s,而我们要 15 秒 → **参考图一多可能不止丢声音,时长和清晰度也在被降级,验的时候一起看**。
