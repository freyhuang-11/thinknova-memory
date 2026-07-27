---
name: reference-thinknova-multiref-model
description: "ThinkNova 多参考图 i2v 模型配置实证:单参只喂截格/多参才把参考图给i2v;468配置坑+HTTP400根因(2026-07-24)"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-27T19:30:41.709Z
---

# ThinkNova 多参考图 i2v 模型(2026-07-24 实证)

## 🔴🔴 2026-07-28 定位定案(老板实烧 10 单看片后拍板,推翻旧说法)
| | **grok 415** 口播优先版·15秒 | **omni 460** 实景还原版·10秒 |
|---|---|---|
| 中文台词 | **没问题**,各类解说都能扛 | **做不了**(老板实测) |
| 英文台词 | — | **可以** |
| 分镜跟随 | **约 80%**(过 ≥70% 及格线) | — |
| 稳定性 | **差:5单3成2挂** | **好:5单5成,每条都出得来** |
| 定位 | **口播/解说线** | **画面线 + 英文解说** |

🔴 **作废旧记忆「omni 正常说话没问题」**——omni 中文台词不行,这是老板 07-28 看片实测。
🔴 **整板模式下 omni 的多参能力等于零**:limit=5 但实际只喂 1 张(整板),= 花 omni 的钱用 grok 的用法。
🔴 **同输入不同结果**:两条 omni 同案例同参数同负面词,一条出六宫格一条不出 = 模型随机,当前打法不可控。
详见 [[project-thinknova-storyboard-test]](含六宫格根因=videoTemplate 那句按裁格模式写的)。

## 🔴 核心机制(老板定,别再搞错)
**多参 vs 单参由模型决定**:
- **单参模型**(如 415 主力、468 未改前):运行时 i2v **只收"截格首帧"1张**,上传的人物/场景/产品参考图**不到 i2v**(只进 i2i 分镜板)。
- **多参模型**:i2v **收全部参考图**(首帧 + 人物/场景/产品)。
→ 想让 i2v 拿到真人/场景/产品图(锁人物、降 Grok 审核拒率),**必须用多参模型**,靠不了商家流程的截格。

## 🔴🔴 2026-07-28 实拉 200 单诊断(参考图张数/成功率/失败根因)
**怎么查(可复用)**:admin 任务列表接口翻页拿 `task_no` → `GET {任务接口}/{task_no}` → `data.task.input` 里有 **`_reference_image_limit`**、**`_i2v_reference_strategy`**、`referenceImages[]`、`reference_image_urls[]`;`error_message` 在同层。(用 id 查详情返回 `task:null`,**必须用 task_no**。)

| 模型 | 运行时 limit | 实际喂进 i2v | 近期成功率 |
|---|---|---|---|
| omni 460 `panel_crop` | 5 | **2~5 张** | 13成/18 |
| omni 460 `storyboard_board` | 5 | **只有 1 张(整板本身)** | 同上 |
| grok preview 415 | **1** | 1 张 | 11成/19 |
| grok fast 468 | 5 | 5 张 | **0成/7 = 全挂** |
| sora 469 | — | 1 张 | 5成/5 |

**结论**:
1. ❌ 我曾怀疑"DB 列 `max_reference_images`=1 卡死 omni" —— **错的**,运行时 limit 实际是 5,DB 列那个 1 没生效。别再按这条走。
2. 🔴 **`storyboard_board`(整板)模式下 omni 只收到 1 张图 = 整板本身,用户上传的照片进不了 i2v**。要测/要用 omni 的人物·产品·门店一致性,**必须切回 `panel_crop`**,否则等于没喂参考图。**该开关是全局的,grok 和 omni 不能各用各的。**
3. 🔴 **`businessUi.videoGeneration.referencePolicyByDuration`:只有「10秒」档 `allowStoryboardCrops:true`,8/12/15 全是 false**;`reserveFirstFrame:true` 全档;`cropPriority:[hero,scene,product,detail]`。→ 415 是 15 秒档,**不只是模型单参,时长档也把它锁死在 1 张**,这是"preview 后面画面控制不住"的配置层根因。
4. 🔴 **468 全挂 = 供应商通道空,不是配置问题**:manxueapi `HTTP 503 No available channel for model grok-imagine-video-1.5-fast under group auto`;1renmanju `pool: no available account`。→ **当前 10 秒口播无可用模型,口播只能走 415 的 15 秒**。已把 468 前台隐藏并改名标注「通道维修中·暂不可用」。
5. 🔴 **omni 的失败 = `图片/视频下载超时(30s)`(lk888 拉不到我们的图)**,不是模型读不懂——即老板说的"omni 说图片读取时间太长"。图挂在**裸 OSS `generated-assets/provider-input/`**(见下方 403 那节同源问题),整板模式图更大更易超时。**修法给技术:CDN 域名或 presigned URL。**
6. 415 的失败 = manxueapi `Connection timeout`(通道抖)。

## 涉及模型
> 🔴🔴 **2026-07-27 全面更新,以下为当前真值(旧内容已纠)**
>
> ## 平台「模型 ↔ 时长」映射(老板口径,说 grok1.5 一律指 preview 满血版)
> | 时长档 | 模型 |
> |---|---|
> | **15 秒** | **Grok 1.5 preview(415)= 满血版**,老板说"grok1.5"就是它 |
> | **10 秒** | **omni(460)** 或 **Grok 1.5 fast(468)** |
> | 8/12 秒 | veo3.1(470)/ Jimeng3.5(471)等,已淘汰不用 |
> **omni 只有 10 秒**;做 A/B 对比时"两个模型同时长"不成立,口播/TVC 对比只能是 omni10秒 vs grok1.5-15秒。
>
> ## 🔴 模型改名(2026-07-27 已上线·客户按"要不要人说话"选)
> 🔴 **中英文名都是客户看的(有外国客户),不能拿英文名塞技术身份**(老板 07-27 纠正)。**内部识别靠「模型ID + `model_code`」**——后台列表本来就显示、且是真身份不会因改名丢失。
> 🔴🔴 **定位轴 = 「口播稳」vs「画面像」,不是「有没有台词」**(老板 07-28 纠正我取反的名字):
> - **omni(460)= 多参 `maxReferenceImages:7`**,协议 `{{referenceImages}}` 数组 → **能锁人物/产品/门店一致性,大量行业必须用它**。
>   🔴🔴 **中文口播:做不了(2026-07-28 老板看片拍板,已作数)**。本行旧文「它照样会说话、正常台词量没问题」**是错的,已作废**——那是 07-27 凭能力参数推的,07-28 实测成片推翻。**英文解说可以。**
>   命名注意:名字仍按「画面像」轴写(不要写成「无旁白/Cinematic no voiceover」,那是 07-27 被纠正过的取反命名),但**必须把中文口播限制写进括号**。
> - **grok(415 preview / 468 fast)= 单参** → **讲话更稳**,但**后面的画面控制不住**(单参只喂截格首帧,上传图进不了 i2v)。
> - **绝大部分商家的真实需求是 omni**(要场景/人物/产品统一);grok 只在"口播必须说清楚"时优先。
>
> | id | model_code(我们认这个) | 中文 | English | 前台 |
> |---|---|---|---|---|
> | 460 | **omni_flash**-10s(多参7) | 🔴**待改名**:现「实景还原版 · 10秒(锁人物·产品·门店)」→ 目标「**实景还原版 · 10秒(锁人物产品门店 · 无中文口播)**」 | 现「True to Your Photos · 10s (locks people, product & store)」→ 目标「**True to Your Photos · 10s (locks people, product & store · no Chinese voiceover)**」 | ✅ |
> | 415 | grok-imagine-video-1.5-**preview**(单参) | 口播优先版 · 15秒(讲话最稳) | Speech First · 15s (most reliable talking) | ✅ |
> | 468 | grok-imagine-video-1.5-**fast**(单参) | 口播优先版 · 10秒(讲话最稳) | Speech First · 10s (most reliable talking) | ✅(07-27打开前台) |
> | 459 | **grok-video-3**(文生,10秒,**2分/秒最便宜**) | 经济实惠版 · 10秒(文字生成) | Budget Saver · 10s (Text-to-Video) | ✅ |
> | 416 | **sora-2** | 广告创意版 · 文字生成视频 | Creative Ad · Text-to-Video | ✅ |
> | 469 | **sora-2** | 广告创意版 · 图片生成视频 | Creative Ad · Image-to-Video | ✅ |
> | 467 | grok-1.5-preview | 备用通道 · 口播10秒 | Backup Channel · Talking 10s | ❌ |
> | 470 | **veo3.1** | 实验版 · 暂不推荐 | Experimental · Not Recommended | ❌ |
> | 471 | **doubao-seedance** | 实验版 · 暂不推荐(低清) | Experimental · Not Recommended (low-res) | ❌ |
>
> 🔴 **算价别串场**(老板 07-28 纠正):**直连文生视频/图生视频只吃单模型价格,没有「生图6+服务费」公式**;那套公式只属于 **agent 管线**。我曾拿 agent 公式去算 459 直连价 = 串场错误。
> **改名接口**见下方;弹窗里的值可能是页面刷新前的旧数据,**别从弹窗保存,走 API 用刚 GET 的最新对象 PUT**。
> **为什么这么命名**:omni 音画不同步+台词一多就念不清 → 名字里写死「无旁白」,客户选它就不指望台词,不用再教育。
> **改名接口**:`PUT https://api.thinknova.top/admin/api/v1/models/{id}`,body=GET 回来的完整模型对象改 `display_name_zh/display_name_en/frontend_visible` 再 PUT,带 admin CSRF(从「更新模型」按钮 fetch 钩子抓)。列表 `GET /admin/api/v1/models?page=1&pageSize=100`。
>
> ## 现役模型台账(2026-07-27 实拉)
> | id | 名 | 供应商 | 参考图 | 定价JSON | 备注 |
> |---|---|---|---|---|---|
> | 415 | Grok 1.5 preview | manxueapi | 单参1 | 3分/秒 | 15秒档;⭐默认模型;manxueapi 曾大面积 503/账号池空 |
> | 460 | omni | lk888 | **多参(limit 3~5)** | **3分/秒** | 10秒;**有白色四角星水印**;lk888 实测 15成0败 |
> | 468 | Grok 1.5 fast → 改名「Grok 1.5 1ren」 | **已迁 1renmanju** | 单参1 | 3分/秒 | 10秒;前台 frontend_visible=❌ 选不到 |
> | 467 | grok-imagine-video-1.5 | 1renmanju | 单参1 | — | 前台不可见 |
> | 469 | sora-2 | lk888 | 单参1 | **6分/秒(偏贵待调)** | 成本仅¥0.1/秒 |
> | 470 veo3.1 / 471 Jimeng3.5 | lk888 | 单参1 | 4/10分整段 | **均已淘汰**(veo画网格、Jimeng分辨率496×864) |
> ⚠️ **模型列表接口的 `credit_price` 是废弃字段(常显示0),真值只在编辑弹窗的「定价 JSON」里**——我曾据此误判"模型价被清零"。

- ~~415 现役主力 i2v(manxueapi,单参 maxRef=1)~~ → 见上表
- ~~468 在 manxueapi~~ → **已迁 1renmanju**
- **411** grok 1.5(manxueapi,文生视频,**已停用但是多参样板**):`model_request_mode=manxue_videos_reference_images_json` + `max_reference_images=5` = 07-12 smoke 验证过的多图配置(首帧+4张=5项 reference_images 请求体)。

## 468 改多参的坑(2026-07-24 实测)
1. **两个 count 字段别混**:DB 列 `max_reference_images`(控前端可上传张数+运行喂几张)vs 通用协议JSON 里 `referenceImages.maxCount`。老板改了 maxCount→5 但 DB 列还是 1 → 前端仍只让传1张/运行仍单参。**要一起对上。**
2. 🔴 **requestTemplate 的 `image` 字段只收单个字符串,不收数组**:把 `"image":"{{referenceImages}}"`(数组)一填,供应商直接 **HTTP 400** `json: cannot unmarshal array into Go struct field .Alias.image of type string`(实测 task_608b5a90b3b6,i2v modelId=468 fail)。
   - **正解**:`image` 保持 `{{referenceImages.0}}`(单张首帧);**多图另开字段** `{{referenceImages}}`,字段名候选 **`reference_images`**(411 manxue 适配器用的名,最可能)> `images`。以 manxueapi 视频API文档为准(老板说文档有遗漏,待确认)。
3. 分镜板(i2i)本来就吃多参(实测 task_608b5a90b3b6 i2i refImages=3,板正常,老板"验证无数次");问题只在 i2v 请求格式。

## ✅ 468 多参跑通的正确配置(2026-07-24 实证)
两个框都要改:
1. **「模型能力 JSON」框**:`"maxReferenceImages": 1` → **`5`**(卡张数的DB闸,在该框底部 `firstFrameAdherence` 前)。
2. **「通用协议 JSON」框**:
   - `requestMapping.referenceImages`:`{"mode":"multi","path":"reference_images","maxCount":5}`(path 从 image 改 reference_images);
   - `requestTemplate`:`"image":"{{referenceImages.0}}"`(单张首帧,string)+ **新增** `"reference_images":"{{referenceImages}}"`(数组)。
- 实证:改后 **HTTP 400 unmarshal 消失,2张参考图进 i2v**(task_fb9776f1fc18)。字段名 `reference_images` 对(技术文档07-12 实证名)。

## 🔴 grok-fast(468)多图时长硬约束(供应商亲口)
`Model grok-imagine-video-1.5-fast supports 15s only for text-to-video or a single reference image; **multiple reference images must use 6s or 10s.**`
→ **多图必须 6s 或 10s,不能 15s**(15s只留单图/文生视频)。测多参烧单**时长选10s**;商家口播若强制15s,多参口播需改用10s输出。

## 🔴 403 精确根因(2026-07-24 实测纠正,旧"同图连拉两次"猜测作废)
实测 task_334083c07f97 i2v 子任务 input.image_url/reference_image_urls =
`https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/generated-assets/provider-input/2026/07/...`
- **裸 OSS 原始域名**(非 cdn.thinknova.top)+ **无签名(hasQuery=false,非 presigned)**。
- `generated-assets/provider-input/` 前缀在原始 OSS 域名上**非公共读** → 供应商无签名 GET = **403 AccessDenied**(`Failed to fetch input URL: 403`)。
- **修法(交技术,3选1)**:①给供应商 cdn.thinknova.top 域名 URL;②该前缀设公共读;③给带签名的 presigned GET URL。已入《给技术_OPS-20260724-04》。
- ⚠️旧记的"同图连拉两次/防盗链"是错的猜测,已作废。

## 🔴 供应商当前不稳(2026-07-24 下午实测,待核是否已恢复)
- **415(走 lk888)**:`Provider returned HTTP 502: lk888 submit failed (code=403): 无可用渠道分组`——lk888 该模型**无可用渠道**(早上02:20还能成、下午17:48掉);编剧被打断、compiledPlan 不落库。
- **468**:OSS 403(见上)。→ 当天两个 i2v 模型**都烧不出来**,生成全线断。老板要求**加新中转站+渠道故障转移**(已入 OPS-04)。这是全线阻塞项。

## 上传/中转坑
- 直连「图生视频」UI 多图上传被前端 `max_reference_images=1` 卡死(老板已报技术)。
- 我(本会话)传不了本地图:file_upload 只认聊天附件;OSS 上传脚本被 classifier 拦;API 烧单/config PUT 被平台 419 拦。→ **烧单/上传只能老板 UI 操作,我做后台验证+分析**。

## 🔴 图生图产品没锁 = 和口播锁人物同根(2026-07-24 诊断)
老板反馈最近 agent 图生图产品没锁。诊断(task_608b5a90b3b6 i2i):模型451、**mode=t2i**、refImgsIn=3(产品图传了)、prompt **已有锁定语**(以参考图为准/商品参考图/保持商品不变/上传的商品)。
- **根因不是提示词没写锁**,是**六宫格母版=合成多格图+t2i重画**:gpt-image 照描述"重画一个像的",不是"用你上传这张",产品参考图权重弱→画出通用商品对不上包装。
- **真正的锁=多参 i2v 直接吃产品参考图**(468 多参),i2v拿真实产品图→成片产品=上传那个。**口播锁人物 + 产品锁,统一根治点=多参 i2v。**
- **优化草案(待应用,419写被拦没落库)**:①提示词层把产品描述从泛化改具体锚定"外形比例配色包装材质必须与提供的商品参考图完全一致、不得替换相似款"(只提升相似度,治标);②根治=推进 468 多参(治本)。③或分镜板产品格走 image_to_image 低strength高adherence(母版合成难,备选)。

配套 [[project-thinknova-dingdian-koubao]] [[reference-grok-content-policy]] [[reference-thinknova-tech-docs-index]]
