---
name: reference-thinknova-multiref-model
description: "触发:要动视频模型或时长、或发现\"用户参考图没进 i2v\"时 → 模型↔时长映射/两模型定位定案/maxReferenceImages 规则/200单成功率诊断/403 根因"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-28T20:19:29.433Z
---

# ThinkNova i2v 模型 · 多参考图台账

> 排错流水与历史单号在 `archive/thinknova_arch_history_to_0729.md`。

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

⚠️ **这张表测于 07-28,当时全局 = `storyboard_board`**;07-29 03:43 全局翻 `panel_crop` 后,不显式配置的案例都走上面第一行。要引用"实际喂进 i2v 张数"必须**带任务号并确认该单的 `_i2v_reference_strategy`**。

| grok preview 415 | **1** | 1 张 | 11 成/19 |
| grok fast 468 | 5 | 5 张 | **0 成/7 = 全挂** |
| sora 469 | — | 1 张 | 5 成/5 |

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
