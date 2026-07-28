---
name: reference-thinknova-multiref-model
description: "ThinkNova i2v 模型台账与多参考图机制:模型↔时长映射/定位定案/200单成功率诊断/468多参配置/403根因——动模型或时长前必看"
metadata:
  node_type: memory
  type: reference
---

# ThinkNova i2v 模型 · 多参考图台账

## 一、🔴🔴 定位定案(2026-07-28 老板实烧 10 单看片拍板)
| | **grok 415** 口播优先版 · 15秒 | **omni 460** 实景还原版 · 10秒 |
|---|---|---|
| 中文台词 | **没问题**,各类解说都能扛 | **做不了** |
| 英文台词 | — | **可以** |
| 分镜跟随 | **约 80%**(过 ≥70% 及格线) | — |
| 稳定性 | **差:5 单 3 成 2 挂** | **好:5 单 5 成,每条都出得来** |
| 定位 | **口播 / 解说线** | **画面线 + 英文解说** |

- ❌「omni 正常说话没问题、正常台词量没问题」已推翻 → **omni 中文口播做不了**(07-28 看片实测,推翻 07-27 凭能力参数的推断)。
- **同输入不同结果**:两条 omni 同案例同参数同负面词,一条出六宫格一条不出 = **模型随机,当前打法不可控**。
- **omni 台词一多就念不清楚**;绝大部分商家的真实需求是 omni(要场景/人物/产品统一),grok 只在"口播必须说清楚"时优先。

## 二、模型 ↔ 时长映射(老板口径:说 grok1.5 一律指 preview 满血版)
| 时长档 | 模型 |
|---|---|
| **15 秒** | **Grok 1.5 preview(415)= 满血版** |
| **10 秒** | **omni(460)**;Grok 1.5 fast(468)通道挂着 |
| 8 / 12 秒 | veo3.1(470)/ Jimeng3.5(471)等,**已淘汰不用** |

**omni 只有 10 秒** → 做 A/B 对比时"两个模型同时长"不成立,口播/TVC 对比只能是 omni-10秒 vs grok1.5-15秒。

## 三、🔴 核心机制:多参 vs 单参由模型决定
- **单参模型**(415 / 468 未改前):运行时 i2v **只收"截格首帧"1 张**,上传的人物/场景/产品参考图**到不了 i2v**(只进 i2i 分镜板)。
- **多参模型**:i2v 收全部参考图(首帧 + 人物/场景/产品)。
- → 想让 i2v 拿到真人/场景/产品图(锁人物、降 grok 审核拒率),**必须用多参模型**,靠不了商家流程的截格。
- 🔴 **`storyboard_board`(整板)模式下 omni 的多参能力等于零**:limit=5 但实际只喂 1 张(整板本身),用户上传的照片进不了 i2v = 花 omni 的钱用单参的用法。要用 omni 的人物·产品·门店一致性**必须切回 `panel_crop`**。**该开关是全局的,grok 和 omni 不能各用各的**(取舍见 [[project-thinknova-film-types]] 第八节)。
- ❌「DB 列 `max_reference_images`=1 卡死 omni」已推翻 → 运行时 limit 实际是 5,DB 列那个 1 没生效(07-28)。**别再按这条走。**

## 四、🔴 时长档也会锁参考图张数
`businessUi.videoGeneration.referencePolicyByDuration`:**只有「10 秒」档 `allowStoryboardCrops:true`,8/12/15 全是 false**;`reserveFirstFrame:true` 全档;`cropPriority:[hero, scene, product, detail]`。
→ 415 是 15 秒档,**不只是模型单参,时长档也把它锁死在 1 张** —— 这是"preview 后面画面控制不住"的配置层根因。

## 五、🔴 200 单实拉诊断(2026-07-28,参考图张数 / 成功率 / 失败根因)
**怎么查(可复用)**:admin 任务列表接口翻页拿 `task_no` → `GET {任务接口}/{task_no}` → `data.task.input` 里有 **`_reference_image_limit`**、**`_i2v_reference_strategy`**、`referenceImages[]`、`reference_image_urls[]`;`error_message` 在同层。(**用 id 查详情返回 `task:null`,必须用 `task_no`。**)

| 模型 | 运行时 limit | 实际喂进 i2v | 近期成功率 |
|---|---|---|---|
| omni 460 `panel_crop` | 5 | **2~5 张** | 13 成 / 18 |
| omni 460 `storyboard_board` | 5 | **只有 1 张(整板本身)** | 同上 |
| grok preview 415 | **1** | 1 张 | 11 成 / 19 |
| grok fast 468 | 5 | 5 张 | **0 成 / 7 = 全挂** |
| sora 469 | — | 1 张 | 5 成 / 5 |

**失败根因**:
- **468 全挂 = 供应商通道空,不是配置问题**:manxueapi `HTTP 503 No available channel for model grok-imagine-video-1.5-fast under group auto`;1renmanju `pool: no available account`。→ **当前 10 秒口播无可用模型,口播只能走 415 的 15 秒**。已把 468 前台隐藏并改名标注「通道维修中·暂不可用」。
- **omni 的失败 = `图片/视频下载超时(30s)`**(lk888 拉不到我们的图),不是模型读不懂 —— 即老板说的"omni 说图片读取时间太长"。图挂在裸 OSS(见第七节),整板模式图更大更易超时。**修法给技术:CDN 域名或 presigned URL。**
- **415 的失败 = manxueapi `Connection timeout`**(通道抖)。

## 六、现役模型台账
| id | model_code(内部认这个) | 供应商 | 参考图 | 定价 | 前台中文名 | 备注 |
|---|---|---|---|---|---|---|
| 415 | grok-imagine-video-1.5-**preview**(单参) | manxueapi | 1 | 3分/秒 | 口播优先版 · 15秒(讲话最稳) | 15 秒档;manxueapi 曾大面积 503/账号池空 |
| 460 | **omni_flash**-10s(多参 `maxReferenceImages:7`) | lk888 | 多参 | 3分/秒 | 实景还原版 · 10秒(锁人物·产品·门店) | 🔴 待改名加「无中文口播」;**成片右下角有白色四角星水印**(ffmpeg delogo 可去) |
| 468 | grok-imagine-video-1.5-**fast**(单参) | 1renmanju | 1 | 3分/秒 | 口播优先版 · 10秒 | **通道空,前台已隐藏、标注维修中** |
| 459 | **grok-video-3**(文生,10秒) | — | — | **2分/秒最便宜** | 经济实惠版 · 10秒(文字生成) | ✅ 前台可见 |
| 416 | **sora-2** | — | — | — | 广告创意版 · 文字生成视频 | ✅ |
| 469 | **sora-2** | lk888 | 1 | **6分/秒(偏贵待调)** | 广告创意版 · 图片生成视频 | ✅;成本仅 ¥0.1/秒 |
| 467 | grok-imagine-video-1.5 | 1renmanju | 1 | — | 备用通道 · 口播10秒 | ❌ 前台不可见 |
| 470 | **veo3.1** | lk888 | 1 | 4分整段 | 实验版 · 暂不推荐 | ❌ **已淘汰**:第 6 秒把六宫格画进成片(实锤),且不听运镜指令 |
| 471 | **Jimeng3.5 / doubao-seedance**(⚠️两处记名不一致,待核) | lk888 | 1 | 10分整段 | 实验版 · 暂不推荐(低清) | ❌ **已淘汰**:分辨率 496×864 最低 + 场景产品全虚构 |
| 411 | grok 1.5(文生视频,**已停用但是多参样板**) | manxueapi | `max_reference_images=5` | — | — | `model_request_mode=manxue_videos_reference_images_json`,07-12 smoke 验过的多图配置 |

- ⚠️ **模型列表接口的 `credit_price` 是废弃字段(常显示 0),真值只在编辑弹窗的「定价 JSON」里**。
  ❌「看到 credit_price=0 就判模型价被清零 / 服务费要一刀切」已推翻 → 会导致 10 秒多收 30 分(07-27,老板"以 grok1.5 为原型检查"纠正)。
- ❌「agent 的『生图6+按秒模型价+服务费』公式也用于直连文生/图生视频」已推翻 → **直连只吃单模型价格**(07-28)。定价全貌见 [[project-thinknova-film-types]] 第十三节 / [[project-thinknova-pricing-ambassador]]。

## 七、供应商现状与坑
- **通道可用性**:lk888 正常(承 460/469/470/471);**manxueapi 大面积不稳**(503 / `pool: no available account`);**1renmanju 也不行**(老板实测)。415/468 同属 grok 系,通道抖动是首要失败源。老板要求**加新中转站 + 渠道故障转移**(已入 OPS-20260724-04),这是全线阻塞项。
- 🔴 **403 精确根因**:i2v 子任务的 `input.image_url` / `reference_image_urls` 指向
  `https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/generated-assets/provider-input/...`
  = **裸 OSS 原始域名**(非 cdn.thinknova.top)+ **无签名**(`hasQuery=false`,非 presigned);该前缀在原始 OSS 域名上**非公共读** → 供应商无签名 GET = **403 AccessDenied**(`Failed to fetch input URL: 403`)。
  **修法(交技术,3 选 1)**:①给供应商 cdn.thinknova.top 域名 URL;②该前缀设公共读;③给带签名的 presigned GET URL。已入《给技术_OPS-20260724-04》。
- **上传坑**:直连「图生视频」UI 多图上传被前端 `max_reference_images=1` 卡死(老板已报技术)。我这边传不了本地图(file_upload 只认聊天附件、OSS 上传脚本被 classifier 拦)→ **烧单/上传老板 UI 操作,我做后台验证 + 分析**。

## 八、模型改名 / 命名规矩
- 🔴 **中英文名都是客户看的(有外国客户),不能拿英文名塞技术身份**。**内部识别靠「模型 ID + `model_code`」**——后台列表本来就显示、且是真身份,不会因改名丢失。
- 🔴🔴 **定位轴 = 「口播稳」vs「画面像」,不是「有没有台词」**(老板 07-28 纠正取反的命名):名字按「画面像」轴写,**不要写成「无旁白 / Cinematic no voiceover」**;但**必须把中文口播限制写进括号**。
- **改名接口**:`PUT https://api.thinknova.top/admin/api/v1/models/{id}`,body = GET 回来的**完整模型对象**改 `display_name_zh` / `display_name_en` / `frontend_visible` 再 PUT,带 admin CSRF(从「更新模型」按钮 fetch 钩子抓)。列表 `GET /admin/api/v1/models?page=1&pageSize=100`。
- ⚠️ **别从弹窗保存**(弹窗里的值可能是刷新前的旧数据),走 API 用刚 GET 的最新对象 PUT。单条模型无 GET 端点、只有列表接口。

## 九、468 改多参的正确配置(2026-07-24 实证,通道恢复后可复用)
**两个框都要改**:
1. **「模型能力 JSON」框**:`"maxReferenceImages": 1` → **`5`**(卡张数的 DB 闸,在该框底部 `firstFrameAdherence` 前)。
2. **「通用协议 JSON」框**:
   - `requestMapping.referenceImages` = `{"mode":"multi","path":"reference_images","maxCount":5}`(path 从 `image` 改 `reference_images`);
   - `requestTemplate`:`"image":"{{referenceImages.0}}"`(**单张首帧,必须是 string**)+ **新增** `"reference_images":"{{referenceImages}}"`(数组)。
- **两个 count 字段别混**:DB 列 `max_reference_images`(控前端可上传张数 + 运行喂几张)vs 通用协议 JSON 里 `referenceImages.maxCount`。**两个必须一起对上**,只改一个 → 前端仍只让传 1 张 / 运行仍单参。
- 🔴 `requestTemplate` 的 `image` 字段**只收单个字符串,不收数组**:填 `"image":"{{referenceImages}}"` → 供应商直接 **HTTP 400** `json: cannot unmarshal array into Go struct field .Alias.image of type string`。
- **实证**:改后 HTTP 400 消失,2 张参考图进 i2v(task_fb9776f1fc18)。字段名 `reference_images` 正确(技术文档 07-12 实证名,411 manxue 适配器同名)。
- **分镜板(i2i)本来就吃多参**(实测 i2i refImages=3,板正常),问题只在 i2v 请求格式。

## 十、🔴 grok-fast(468)多图时长硬约束(供应商亲口)
> `Model grok-imagine-video-1.5-fast supports 15s only for text-to-video or a single reference image; multiple reference images must use 6s or 10s.`

→ **多图必须 6s 或 10s,不能 15s**(15s 只留单图/文生视频)。测多参烧单**时长选 10s**;商家口播若强制 15s,多参口播需改用 10s 输出。

## 十一、🔴 图生图产品没锁 = 和口播锁人物同根
诊断(i2i 子任务):模型 451、**mode=t2i**、参考图确实传了 3 张、prompt **已有锁定语**(以参考图为准/保持商品不变)。
- **根因不是提示词没写锁**,是**六宫格母版 = 合成多格图 + t2i 重画**:gpt-image 照描述"重画一个像的",不是"用你上传这张",产品参考图权重弱 → 画出通用商品对不上包装。
- **真正的锁 = 多参 i2v 直接吃产品参考图**,i2v 拿到真实产品图 → 成片产品 = 上传那个。**口播锁人物 + 产品锁,统一根治点 = 多参 i2v。**
- 治标手段(提示词层):产品描述从泛化改具体锚定"外形比例配色包装材质必须与提供的商品参考图完全一致、不得替换相似款";另有备选=分镜板产品格走 image_to_image 低 strength 高 adherence。
- ⚠️ 编剧侧配套硬规:**禁止编剧写产品形态词**(它看不到参考图),见 [[reference-thinknova-prompt-architecture]]。

配套 [[project-thinknova-dingdian-koubao]] [[reference-grok-content-policy]] [[reference-thinknova-tech-docs-index]] [[project-thinknova-storyboard-test]]
