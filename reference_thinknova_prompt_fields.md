---
name: reference-thinknova-prompt-fields
description: "触发:要改提示词的第一查 → 拉一条真实任务 input,确认目标字段真被编剧/生图/i2v 读取,别改在没人读的字段上;字段路径以线上回读为准"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-07-28T20:18:01.296Z
---

> 🔴 07-31 里程碑注:编剧长度真值=lineValidation(语义=全片lines总计,PHP动态注入提示词);systemPrompt 择一链=masterPipeline>screenwriter>旧字段>内置,不叠加。详见 project_thinknova_0729_screenwriter_stack。

# ThinkNova 提示词字段读取图(2026-07-22 实证)

## 🔴🔴🔴 2026-08-12 实测定案:`visualHint` 只有 `zh` 键会被喂给编剧,其余语言键是死数据
两条历史单取证(编剧子任务 `input.case` 只有三个键 `{id,title,visualHint}`):
- `task_bcff16537292` copyLanguage=**vi** → 收到的 visualHint 是**中文**(700字)
- `task_0141981872d3` copyLanguage=**en** → 收到的 visualHint 也是**中文**(243字)

→ **改案例提示词只需要写 `visualHint.zh`;写 en/ja/ko/vi/es 是白写**(08-12 我给 12 条剧情片写了整份英文 hint,没人读)。
→ 由此「视频侧 692 条 / 海报侧 820 条 visualHint 缺 ja/ko/vi/es」**不是缺陷**;「海报侧 213 条 en 逐字等于 zh」是脏数据但**不影响出片**。
→ **前台可见的多语言只有 `title`/`summary`/`previewCaption`**,这三个必须六语齐:海报侧已 100%;视频侧真缺口只有 7 条业务案例(drink_second_half / auto_maintenance_package / beauty_hair_color_68 / beauty_nail_99 / fruit_shine_muscat_offer / gold_discount / supermarket_weekend_deals),另 11 条缺的是 `zz_*`/`ks_*` 测试残留,该清库不该补。

## 🔴 2026-08-12 案例预览回填(零烧单配方)
- 案例预览六字段:`previewVideoUrl` + `previewAssetType:'video'` + `previewUrl/thumbnailUrl/coverImageUrl/previewImageUrl`(四个图字段填同一张静帧)。
- 素材来源=账号已有成片,**按 `caseId` 精确对上那条案例自己的成片**(商家端 `GET /api/v1/business-video-assets/tasks?page=&page_size=20` 每项带 caseId),不许借别的案例的图。
- 地址:`https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/` + 资产 `storage_path`(**别用 `public_url`,带签名会过期**);静帧优先用视频资产的 `thumbnail_url` 去掉 query。公共 URL 无签名直读 200 已验。
- ⚠️ **坑:部分 image 资产的 `storage_path` 本身就是绝对 URL(`cos.lingkeai.vip` 域)**,直接拼公共桶前缀会拼出坏地址,必须先判 `^https?://`。
- ⚠️ 一个案例常有多条历史任务,**拿不到视频要回溯更早的任务**(只看最新一条会少救十几条)。
- 现状:视频侧 726 条中有视频预览 **130 条**、有封面 **696 条**;31 条历史任务只出了板图没出成片;**449 条账号里零成功任务,不烧单补不了**。

### 🔴🔴🔴 08-13 我造成的封面事故:图字段里塞了 mp4(已全量修复)
**症状**:老板发现案例封面全是黑屏。
**根因**:回填封面时我拿资产的 `thumbnail_url` 直接写进四个图字段,**但那批资产的 `thumbnail_url` 指向的就是 mp4 本身**(magic bytes `ftypisom`,和 `previewVideoUrl` 同一个地址)。浏览器把视频当图片渲染 → 显示第 0 帧 = 我们那 0.15 秒黑幕。**124 条有封面的里 114 条中招。**
🔴 **教训:写进图字段前必须验它真是图片**(下载看 magic bytes 或用 PIL 打开),不能因为字段名叫 thumbnail 就信它。
**修法(零烧单)**:`ffmpeg -ss 2.5 -i <公网视频URL> -frames:v 1` **远程 seek 抽帧,不用下载整个文件**;传自家公共桶 `previews/all/{caseId}_cover.jpg`;再写回四个图字段,`previewVideoUrl` 保持不动。112 条成功,写回零失败,亮度 79-102 全部正常。
**2 条修不了**:`pet_care_s06_training_class` / `flower_plant_s09_festival` —— 视频在**供应商桶** `1renfile-...myqcloud.com`(07-08),现在 **404 已过期**,印证「供应商桶会过期,案例预览别指它」。已把这 2 条六个预览字段全清空,免得前台显示坏图。

> 🟢🟢 **2026-07-28 03:00 线上回读定案(offline_store_video),路径之争到此为止**:
> - **`promptComposer.screenwriter.staticTemplates.videoTemplate` 真实存在且生效**(实测 541→596 字符,改后 i2v 单读到)。`staticTemplates` 四键 = `businessContext / outputContract / firstFrameTemplate / videoTemplate`。**`masterPipeline.scriptwriter` 下没有 staticTemplates**,别再往那儿找 videoTemplate。
> - **两条路径并存,各管各的**:`promptComposer.screenwriter.*`(静态模板)与 `promptComposer.masterPipeline.scriptwriter.*`(`timeline` / `lineValidation` / `fallbackPolicy` / `textModel`)。旧记忆说"screenwriter 少了 masterPipeline"是**误判**——不是少段,是两个不同子树。
> - **`fallbackPolicy.visualTemplates` 在 config 里、运营可改**(`masterPipeline.scriptwriter.fallbackPolicy` 与 `opsEditable.masterPipeline.scriptwriter.fallbackPolicy` 两处内容完全一致)。旧记忆记成"回退模板是代码、要发技术卡"是**错的**,已纠。
> - **`promptComposer.masterPipeline.i2vReferenceStrategy` 线上 = `panel_crop`**(2026-07-29 03:43:45 由 `storyboard_board` 翻过来,`opsEditable` 镜像双写,全库残留 `storyboard_board` 0);每个 i2v 子任务的 `input._i2v_reference_strategy` 会回显该值,可逐单核。**任务创建时冻结,旧单不重写。**
>   🔴 **这是"全局兜底"不是唯一真值(07-28《时长模型与案例首帧策略》§5)**:真正生效的读取顺序 = **案例 `businessUi.referenceCases[].i2vReferenceStrategy`(external_table 模式下写案例表 `payload_json`) → 案例不填才回落到上面这个全局值**。子任务回显 `null` = 案例没配、走全局,不是故障。取值只有 `panel_crop`(默认且推荐) / `storyboard_board`(仅限已验证不会把网格生成进成片的模型)。只影响商家视频流,不影响海报和独立能力页。
>   🔴 **同层的 `deliveryPostProcess.{entranceBlackOverlay, coverFrame}` 没有案例级**,文档只承认 `promptComposer.masterPipeline` 这一处(手册 v4 §3.5)。
> - **PUT 只需 `{config:…}`**,不必发完整 agent 对象;详见 [[project-thinknova-storyboard-test]] 取证方法第 0.5 条。
> - 🔴🔴 **写得进 ≠ 有权改**(07-29 实证):`promptComposer.*` 走后台弹窗 textarea 落库正常;**`businessUi.*` 整块被弹窗按自己的表单状态回写、textarea 里的修改被静默丢弃且回执报成功**。改 businessUi 只能人工点界面 → [[reference-thinknova-config-powers]] 顶部通道约束。

> 🔴🔴 **2026-07-27 破解"保存了却没生效"之谜(实测,极重要)**:
> **写 `opsEditable.*` 必须同时写对应的 `blockTemplates.*` 镜像,两处一起 PUT 才落库**;只写 opsEditable → PUT 返回 200 OK 但**服务端用镜像盖回去、静默丢弃**(实测 firstFrame 两次都被回滚)。旧记忆"opsEditable 只读"和"blockTemplates 是只读镜像"**都不准确**,真相是**两者必须同步写**。
> 对应关系:`opsEditable.taskGoal.firstFrame` ↔ `blockTemplates.task_goal.first_frame_prompt`。
> **可直接 API 写配置**:`PUT /admin/api/v1/agents/{code}`,body=完整 agent 对象(GET 回来改一个字段再 PUT),带 admin CSRF;比后台编辑器可靠(新版编辑器会因刷新丢暂存改动、且老板点保存会把旧内容存回去)。
> `promptComposer.screenwriter.systemPrompt` 单独写即可生效(无镜像)。
> **六拍骨架同时存在于三处**:opsEditable.taskGoal.firstFrame / blockTemplates.task_goal.first_frame_prompt / screenwriter.systemPrompt——改画面格位配额要考虑全部三处。

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
| `businessUi.referenceCases[].scriptwriterPreset.{shotCount,voiceMode}` | ✅ 决定 cells/lines 段数与有无口播 | ✗ | ✗ |
| `businessUi.referenceCases[].i2vReferenceStrategy` | ✗ | ✗ | ✅ 决定主参考图是裁格首帧还是整板 |
| `promptComposer.masterPipeline.i2vReferenceStrategy` | ✗ | ✗ | ✅ **仅案例未配时的兜底;线上现值 `panel_crop`** |
| `promptComposer.masterPipeline.scriptwriter.lineValidation.<lang>.{metric,min,max}` | ✅ 台词字数/词数校验 | ✗ | ✗ | 
| `promptComposer.masterPipeline.deliveryPostProcess.*` | ✗ | ✗ | ✗(成片后处理层,**只有 Agent 全局**) |
| `promptComposer.stagePromptPresets.{text_to_image,image_to_image,image_to_video}` | ✗ | ✅ | ✅ 三阶段静态提示词,**运营可维护(手册 v4 §5)** |

**🔴 `opsEditable` 是运营可编辑真值层(2026-07-20 文档,已纠正旧"只读"错误)**:改 `opsEditable.taskGoal.firstFrame` / `subjectDefinition.firstFrame`,保存时系统自动编译到 `blockTemplates.task_goal.first_frame_prompt`。**别手改 `blockTemplates`——它是派生镜像,手改会被还原(这不是保存失败)**。`firstFrame` 是整段覆盖,改前先复制原文整体改回。案例差异写案例 `visualHint`,别写进全局主体仲裁。旧记忆"opsEditable 只读/PUT静默丢弃"来自污染会话,已作废;若线上 PUT 真被丢弃,那是 admin API 419 或编辑器问题,不代表字段只读——用 UI 编辑器保存法。

**铁证**:`promptComposer.caseInjectionPolicy.includeFields = ["visualHint"]` —— 案例这一层只有 visualHint 进编剧,title/summary/prefill 都不进。
`promptComposer` 下的 `optionRules` / `sceneRules` / `industryRules` / `blockTemplates` **都不进编剧**(编剧 input 16 个字段里没有它们),它们里面的「到店/私信/扫码」只影响生图与 i2v。

## 编剧 input 的完整进食清单(实证 task_40ca1bd2a775)

```
case         = {id, title, visualHint}      ← 画面风格入口;素材分析开启后画面事实另有入口(分析摘要),案例只提供结构(09-13 22:40 线上实测:旧线 materialAnalysis 已部署但 enabled=false modelId=0 关着;Studio referenceAnalysis enabled=true modelId=505(qwen3.5-omni-flash)已部署已开)
scene        = {id, label}
industry     = {id, label}                  ← 只有 id 和名字,没有行业 prompt
language     = {copyLanguage}
formSnapshot = {ratio, fields, selectedOptions, durationSeconds, segmentCount}
sellingPoints= [promptText全文, label]      ← 卖点整段喂进去,所以卖点文案会漏进台词
extraRequirement / hasReferenceImage / referenceImageCount
materialAnalysis 摘要(仅 masterPipeline.materialAnalysis.enabled=true 且有图;状态看 childTasks.material_analysis / video_prompt_json.materialAnalysisPlan)(09-13 22:40 线上实测:旧线 materialAnalysis 已在线上但 enabled=false modelId=0,此摘要现不产出)
systemPromptSource = "screenwriter.systemPrompt"
```

**要改编剧的画面行为 → 改案例的 visualHint,不是行业 prompt。**
**要改编剧的规则纪律 → 改 systemPrompt。**
**要改视频层的锁 → 改 videoTemplate(注意字节上限(**生视频链**:派发层 4000 先撞上,grok 上游 4096 硬拒;⛔别把它和 systemPrompt 的 4000 **字** 混为一谈))。**

## 硬流程(必须做,不许省)

1. 改之前:拉一条**真实任务的 input**,确认目标字段真的在里面;
2. 改之后:PUT 200 + API 回读 ≠ 生效,必须**再烧一单,拉新任务的 input/提交串**确认新文案真的送达;
3. 只有看到新文案出现在实际任务里,才能说"已上线"。

**Why**:2026-07-22 一晚押错三次 —— `subjectDefinition.video`(写了不进提交串)、`industryPrompts`(编剧读不到)、并且基于第二次的错误前提下了"配置改了不生效,要发技术卡"的结论,差点把自己的错甩给技术。用户原话:"技术把很多东西已经放在里面了,你明明自己都可以改"。

相关:[[feedback-evidence-standard]] [[reference-thinknova-prompt-architecture]]

- 🔴🔴 语言分两层:**输出语言 vs 界面 i18n**;`visualHint` 只有 `zh` 键喂编剧(09-17 从索引下沉)。

## 🔴 `offer` 会被编剧**近乎原样讲出来**（2026-09-20 实测，成对证据）

| | |
|---|---|
| 输入 `offer` | `Bugis Street shop in Singapore, open till ten at night` |
| 成片台词第 4 句 | `The Bugis Street Shop in Singapore is open till 10 at night.` |

任务号 `task_1d5a269ba654`（英文、15s、agent 线）。措辞有轻微改写 ⇒ **是模型行为，不是硬编码照搬**，
但**内容整条穿过来了**，而且进了配音、也会进字幕。

⇒ **`offer` 要当「会被念出来的句子」写，不是当「给模型看的背景设定」写。**
⛔ 真实地名、门牌、营业时间、电话、价格**一律不进 `offer`** —— 写进去就是一条
关于不存在的店的公开事实陈述，撞⛔不编造门店/地址那条红线，而且**后期删不掉**。
⇒ 地域只到国家级、不指名；店况不写；`offer` 只讲**产品本身**。

⚠️ 这和 [[feedback-visualhint-leaks-into-lines]] 是同一类病的两个字段：
**凡是会被拉进编剧的字段，写进去的东西都会变成台词。** 发现台词里有不该有的话，
先去源字段搜那句话，⛔ 别急着加禁令。

## 🔴 `sellingPoints` 的标签会被写成**一句自夸台词**（2026-09-20 单变量对照，n=4 阳 / 1 阴）

`selling_point_pro_service`（"专业服务"）每传一次，成片第 2–3 拍就多一句「我们服务好」。

| 任务 | 行业 | 那一拍 |
|---|---|---|
| `2417b8d1f14a` | 花店 | **Our professional service** wraps each bouquet while you wait. |
| `1d5a269ba654` | 手机配件 | **Our professional service** helps you choose. |
| `12293f9af122` | 皮具 | **Professional service** gives each piece careful attention. |
| `66bf6194fdcb` | 餐饮 | We handle every order with care（同义改写，没用字面词） |
| `c2a0a8e651b3` | 餐饮·**对照** | ⛔ **无** ——「You get chicken and rice together in one hot pot.」 |

对照单参数与 `66bf61` **逐字相同，唯一变量 = `sellingPoints` 由 `['selling_point_pro_service']` 改成 `[]`**。
⇒ 那一拍从**空话**（主语=我们、零信息）变成**产品事实**（主语=你、具体）。

🔴 **结论：这不是编剧层的通病，是标签被当成台词素材念出来了。**

🔴 **机制（已对 systemPrompt 原文核过，2026-09-20 总指挥现拉）**：
原文措辞 =「商家填了产品名/卖点/优惠 → 只用这些事实展开；什么都没填 → 只从这个商品名直接对应的用途和使用时机找料」。
⇒ 传了空标签，模型就「有料了」，**贫料规则不触发**，于是拿标签词凑出一句空话。
🔴 **空标签在压制一条写好的规则：传比不传更差。**—— 这不符合直觉，记牢。
⚠️ ⭔ 别外推成「所有 sellingPoints 都别传」：
「专业服务/用心/品质保证」这类**每家店都能说**的 = 零信息量 ⇒ 必凑空话，⭔ 不传；
「30 年老店/只用现宰的」这类**只有这家能说**的 ⇒ 比常识属性强，✅ 传。
默认值 = `[]`。
⇒ **`sellingPoints` 只在那一项确实是这家店的差异点时才传，⛔ 不当默认值每条都传。**
⇒ ✅ **提示词一个字都不用改** —— 这很重要，因为 agent 线 systemPrompt 现行 **4052 字、已超 4000 硬顶**
（记忆里的 3460 是旧值），超顶状态下任何新增条款都得先删一条。

⚠️ **⛔ 别和 `offer` 那条混**：两个病、两个主人。
```
自夸句「Our professional service…」 ← sellingPoints 标签  ⇒ 改输入解决
店况句「we close at three」         ← offer 字段          ⇒ 改标签解决不了,两条片都还在
```
⚠️ 想加全局「用第二人称」条款之前先看：**人称是按场景号定的**
（S01 第三人称、S05/S06/S11 第一人称）⇒ 加全局条款会和三个场景互搏。


## 2026-09-22 04:0x · 🔴🔴🔴 i2v negative_prompt 的真实来源（实证，推翻我之前两次改错的字段）

**公式（烧单实拉 `task_bf58450164e6` 验证）**：
```
input.negative_prompt =
    languagePacks[语言].fallbacks.negativePrompt        <- 第 1 段
    + "\n" +
    stagePromptPresets.image_to_video.negativeGuard     <- 第 2 段
```
**铁证**：实发串第 1 段长度 = 360 = `languagePacks.zh.fallbacks.negativePrompt` 长度 360，逐字吻合；该单 `_prompt_language="zh"` / `_prompt_language_pack="zh"`。

### ⛔ 两个「死配置」（改了不进派发串，别再浪费时间）
1. `stagePromptPresets.image_to_video.prompt` —— 早有记录（project_thinknova_0729_koubo_defect 第25行）
2. `negativePromptPolicy.byRenderTarget.video_prompt` —— **09-22 新证实**。我往它加了 8 个质感词，PUT 200、回读正确，**但烧单实发串一字未变**（556 字符与改前一模一样）。

### 🔴 `languagePacks` 只有 `en` 和 `zh` 两个包
不是每种语言一个包。⇒ 印尼语/马来语/泰语/越南语单的负面词**全部 fallback 到 en 包**。
⇒ **改负面词必须改 en**；只改 zh = 只管中文单。两处都要双写 `opsEditable.languagePacks.*`（实测镜像存在且逐字相同）。

### 定位未知字段来源的通法（这次就是这么找到的，很好用）
拉线上 config，对整棵树做递归字符串搜索，拿**实发串里的特征词**去命中路径：
```js
(function walk(o, path){ if (typeof o==='string'){ if(o.indexOf('特征词')>=0) hits.push({path,len:o.length}); return;}
  if(Array.isArray(o)){o.forEach((v,i)=>walk(v,path+'['+i+']'));return;}
  if(o&&typeof o==='object'){Object.keys(o).forEach(k=>walk(o[k],path+'.'+k));} })(cfg,'config');
```
**长度逐字吻合 = 硬证据**，比读文档猜字段可靠得多。

### 09-22 04:0x 已落地（PUT 200，回读+双写全部通过）
- `languagePacks.en.fallbacks.negativePrompt`: 941 -> 1192（+11 词，含 no catchlight in the eyes / no visible pores / no rim light / flat dead-white lighting）
- `languagePacks.zh.fallbacks.negativePrompt`: 360 -> 427（+11 词，含 眼中无高光 / 平光死白 / 没有轮廓光 / 脸上没有明暗过渡）
- **纯追加，一字未删**。回滚 = en 截到前 941 字符、zh 截到前 360 字符 + 同步镜像。
- ⏳ **待验**：下一单 i2v `negative_prompt` 搜 `no catchlight` / `眼中无高光`，出现 = 生效。

## 2026-09-22 · 首帧块顺序前置已实证生效
改后烧单 `task_b98f4811b60e`：`锚点` 从 -1 -> **1889**、`补充要求` 从 -1 -> **2247**。
⚠️ 但 `_prompt_truncated` 仍为 true（16821 -> 7000）：排在末位的 `subject_definition / style_rules / hard_negative_rules` 仍在截断线外。**减肥只是把关键块换进来了，没消灭截断。**


## 2026-09-22 14:xx · 🔴🔴🔴 更正：首帧那一刀「成功」是我误判的 —— 搜块名 ≠ 块内容进来了
**我 09-22 早上报给老板「锚点从 -1 变 1889、补充要求从 -1 变 2247 ⇒ 两块都进了模型」——错的。**
**实测反证**（子 agent 烧 `task_15273190661a`，首帧子任务 `task_e125a0ee96f2`）：
```
_prompt_truncated: true   _prompt_original_bytes: 15853   _prompt_final_bytes: 6999
锚点        @1885  ✅
补充要求    @2227  ✅
自己填的原句 TAGQC0922ZH   -1   ❌   ← 内容根本没进来
subject_definition / style_rules / hard_negative_rules 全 -1
实发串尾部断在半句：「…分镜格与 visualPrompt 都要写成"谁 + 从」
```
⇒ `补充要求`/`锚点` 这两个词出现在保留区，**很可能只是别处（如 task_goal）提到了这两个词**，真正的 `user_extra_requirement` / `visual_anchor` 块内容仍在截断线外。
⇒ 🔴 **判据纪律（新）：验「某块有没有发出去」必须搜自己填进去的、独一无二的具体内容**（例：建单时在 extraRequirement 里埋一个 `TAGQC0922ZH` 这样的哨兵串），**⛔ 不许搜块名/栏目名关键词** —— 块名会在别的块里被提到，一搜就命中，造成「已送达」的假象。
⇒ ⚠️ 连带：「改 extraRequirement 没用」这个老症状 **根因没解决**，09-22 凌晨那一刀只是把块头挪进了保留区。要么继续给 task_goal 减字节，要么请技术抬 7000 上限。

## 2026-09-22 14:xx · ✅ 负面词那一刀：中文侧已实证生效
i2v 子任务 `task_fd21390ab804`：`negative_prompt` 长度 623，`眼中无高光` @361 ✅；`_prompt_language=zh` / `_prompt_language_pack=zh`。首帧子任务也吃到（neg 375，`眼中无高光` @84）。
⏳ **en 包（1192 字，判据 `no catchlight`）至今零验证** —— 那一轮的英文单挂在编剧没走到 i2v。要靠下一条英文单补验。

## 2026-09-22 · 🔴 记忆纠错：i2vReferenceStrategy 线上现值
`promptComposer.masterPipeline.i2vReferenceStrategy` = **`storyboard_board`**（子任务回显一致），**不是**记忆里写的 `panel_crop`。
⇒ 老板点名的「六宫格人脸仅 100–150px、i2v 放大 9–13 倍重建」风险**现在是全局默认打开的**。⚠️ 但六宫格是老板明令的必需设计，⛔ 不许再建议改架构。


## 2026-09-23 · 🔴🔴🔴 技术 09-22 修复到货（三条旧结论作废，⛔ 别再按旧的办事）
**文档已归档**：`00_规格与参考\技术侧文档\运营说明_官网注册与视频生成稳定性修复_2026-09-22.md`
⚠️ **文档自己写明「发布后仍需运营/技术联合验证」⇒ 下面每条都是「技术说已修，待我实证」，⛔ 不许当成已确认就去下结论。**

| 旧结论（⛔ 作废） | 技术说改成了什么 |
|---|---|
| 「首帧提示词从**尾部硬切**，商家填的 extraRequirement 进不去」 | 改成**按块优先级压缩**：①用户补充要求 ②视觉锚点 ③主体定义 ④任务目标 ⑤版式/风格/语言/负面/全局。低优先级块先移除。任务 input 保留**原始/最终字节数 + 被移除块的审计信息**（⚠️ 字段名文档没写，要实拉才知道） |
| 「i2v 四段块**服务端硬编码**，运营一个字都改不了」 | 🔴 **`studioWorkflow.i2vPromptRules` 改成后台可配**：`continuity / actionTiming / firstFrameLock / voiceover.storyboard / voiceover.video / lipSync.storyboard / lipSync.video`，**上限 2000 字节**，`actionTiming` 支持变量 `{{plannedDurationSeconds}} / {{actionDeadlineSeconds}} / {{holdSeconds}}`。旧项目快照无此字段时走原默认，不影响历史项目 |
| 「编剧上游一抖动=整单报废、图/视频子任务**永久挂 pending/queued**、积分退没退未知」 | 超时/连接重置/EOF/SSL/网络不可达等**瞬时故障有界退避重试**，仍不可用则**回退本地模板**继续链路；但「台词不完整句/长度不合规/JSON 结构错」**仍然失败**（不用模板掩盖）。父任务失败后未派发子任务统一标 `canceled`；有冻结积分则**写入退款状态** |

### 另外两条技术顺手修的（我没报过，但对转化重要）
- **未登录点主入口/能力卡 → 直接进注册页**（不再先落登录页）；`redirect/src/invite` 参数全程保留，注册后回原目标页；**邀请码输入框默认折叠**（带 `invite` 参数或点「已有邀请码」才出现）
- **注册奖励文案八语可配**：后台「系统配置 → 站点配置 → 注册奖励文案 JSON」，支持 `zh/en/ja/ko/vi/es/th/ms`，字段 `title/body`，变量 `{{credits}} / {{days}}`；未配置的语言按 en→zh 回退；**仅当赠送积分>0 且有标题才展示**

### ⇒ 技术单 `OPS-AI-20260922-01` 状态更新
三条里**第 1、2、3 条技术都已处理**。⚠️ 但**在我实证通过之前，这张单不算闭环**。实证判据见下。

### 🔴 我的实证判据（⛔ 不许用文档描述代替实测）
- **首帧**：建单时在 `extraRequirement` 埋独一无二哨兵串（如 `TAGFIX0923`），出片后在首帧子任务 `input` 里搜它 —— **出现 = 真修好**。（09-22 同样测法结果是 **-1**：块名在、内容不在）
- **i2v 可配**：往 `i2vPromptRules` 某字段写哨兵串，烧一单看实发 i2v prompt 里有没有
- **编剧失败**：找 09-22 之后的失败父单，看子任务是不是 `canceled`、有没有退款状态字段


## 2026-09-23 04:0x · ✅ 技术 09-22 修复已线上实证（A/B/D 通过，C 缺样本）
实烧 1 单验证（75 积分），证据落盘 `03_工作台\验证_技术0922三项修复_线上实拉_2026-09-23.json`

### A ✅ 首帧按块压缩**真生效**
父单 `task_9f75bd726fe1` / 首帧子任务 `task_54f34e2e0bda`：
- 建单时在 `extraRequirement` 埋哨兵串 `TAGFIX0923` → **实发 prompt 第 2124 字符处命中（≠ -1）**，整段 92 字未被切。09-22 同法测是 **-1**。
- `_prompt_truncated: true`，`_prompt_original_bytes 16603 → _prompt_final_bytes 6029`
- 🔴 **审计字段名 = `_prompt_dropped_blocks`**（技术文档没写，实拉才知道）。本次内容：
  `{prompt:[{layout_rules,2155},{style_rules,1710},{copy_rules,1654},{cta_rules,1284}]}`
  —— 丢的四块全是第⑤优先级，**用户补充要求原样保留**，优先级顺序与文档一致。
- 另有 `_offlineStoreParentStage: "image"`

### B ✅ `studioWorkflow.i2vPromptRules` 已在线上，七项都有默认值
`continuity 243 / actionTiming 285（含三个变量）/ firstFrameLock 183 / voiceover.storyboard 365 / voiceover.video 386 / lipSync.storyboard 198 / lipSync.video 219` 字节，均远低于 2000 上限。
🔴 **坑**：`studioWorkflow` **顶层还有一个同名旧字段 `continuity`（仅 15 字节）**，与 `i2vPromptRules.continuity` 不是一个东西 —— **改的时候别改错层**。
⏳ 「改后新项目是否生效」本轮未写入验证，仍待验。

### C ⏳ 编剧失败子任务终态 —— **缺修复后样本，未验到**
近 50 条（09-21 19:18~09-23 03:42）：succeeded 39 / failed 8 / canceled 2 / pending 1。
唯一编剧失败父单 `task_354f20f80c0d` 是**修复前**的（09-22 13:30），其 `credit_status=refunded` 但 output 里**没有 refund*/credit* 专用字段**。
⚠️ 09-22 14:01 的 `task_6e65247fdf03` 失败点是 **video 子任务**（H3 余额不足），不是编剧故障、套不上这条验收；但它的 `material_analysis` 占位子任务**仍停在 pending 没被置 canceled** —— 遗留疑点，样本不对口，**不足以判定修复失效**。
⇒ 等真实编剧故障出现再验，⛔ 不要为了验它故意制造失败单。

### D ✅ 注册奖励八语已配满 + 注册入口断点已修
- 配置项实际叫 **`signup_offer_copy`**（`GET /admin/api/v1/site-configs → data.item`，另有 `signup_offer_copy_json` 格式化副本）
- **8 语全配**：zh/en/ja/ko/vi/es/th/ms，各有 title+body
- 匿名拉 `thinknova.top/zh` SSR HTML：奖励区块已渲染，`{{credits}}` 已替换成 100
- **注册入口已修**：匿名首页三个主入口 href 全是 `/zh/auth/register?redirect=...`，直达注册页并带回跳（不再先落登录页）。⚠️ 顶栏仍只有「登录」一个按钮


## 2026-09-23 05:xx · 🔴🔴🔴 i2vPromptRules 已改写上线 + 三条旧结论作废

### 写入路由（这次才摸清，⛔ 以后别再摸一遍）
- 🔴 **admin API 的 base 是 `https://api.thinknova.top`**。打 `admin.thinknova.top/admin/api/...` 会返回 **SPA 的 HTML**（200 + text/html），不是 404，很容易误判成"接口不存在"。
- `GET/PUT https://api.thinknova.top/admin/api/v1/agents/{code}`，cookie 鉴权，响应头拿 `x-csrf-token`。
- PUT body = `{name_zh, name_en, metadata, config}`，其中 `config` 传**改过的 stored_config 整体**。
- 返回对象里 `data.agent` 同时有 `config`（生效值）和 `stored_config`（运营编辑值），**两处都要改，回读两处都要验**。
- ⛔ **不要读 cookie 名或 csrf 值再打印** —— 会被分类器判 Credential Materialization 拦下。做法：GET→改→PUT 全部在一次 JS 里做完，只返回状态和校验结果。

### `i2vPromptRules` 只在 `offline_store_video_studio`（长视频制作·20秒起）
七个 agent 逐个扫过，只有它 `hasI2VR=true`。
⇒ 🔴 **改它只影响长视频线。15 秒线（`offline_store_video`）走 `stagePromptPresets.image_to_video`，而那个 `.prompt` 是死配置** ⇒ **15 秒线的 i2v 提示词运营目前改不了**，要问技术。

### 🔴 三条旧结论作废
1. ⛔ **「首帧是 2x3 分镜板、人脸只有 100-150px」作废**。实测 **941x1672 单张竖图**（gpt-image-2），`storyboardPrompt` 的「不得多宫格」已生效。
2. **i2v 输出只有 768P**（6/6）⇒ 941x1672 进去是**降采样**。毛孔类要求写再好也会丢一部分，**要问技术能不能出 1080P**。
3. **i2v 完全不下发 `negative_prompt`**（6/6 无该 key）⇒ ⛔ 所有要求只能写**正面指派句**，「不要什么」这条路彻底没有。
4. **`lipSyncModelId = 0`**，`lipSync.storyboard`/`lipSync.video` 是死字段（6/6 不下发）⇒ **「正脸口播一镜到底」在长视频线跑不起来**，⛔ 确认前不许对客户承诺。

### 「语气/情感」的正确归宿 ≠ i2v 字段
- **语气/语速** = `studioWorkflow.ttsPacing`（按语言分 characters/words 两套速率，`speed.min 1 / max 1.15`）
- **情绪档** = `studioWorkflow.ttsEmotion`，现 `default:"auto"`，可选 `auto/happy/surprised/calm/fluent`。**09-23 未动，等老板定调**。
- **表情层面的情感**（画外音模式下人物不说话，情绪只能靠脸）⇒ 写进 `voiceover.storyboard` / `voiceover.video`。

### 顺带记住的坑
- `studioWorkflow` 顶层的 `continuity` 是**对象** `{enabled,useStoryboardAnchors,maxAnchorImages:1,endHoldMilliseconds:200}`，⛔ 和 `i2vPromptRules.continuity`（字符串）不是一回事。对它做 `new Blob([x]).size` 会得到 15（"[object Object]"），别被这个 15 骗了。
- `videoPromptSuffix` 里本来就写着「保留皮肤毛孔细节,不磨皮不锐化」，但它是**死配置**（6/6 不进派发串）⇒ 09-23 把同样的意思搬进了 `firstFrameLock`（实证活着的管道）。
- 单镜头时长 **min3 / max5 / 默认4**（⛔ 不是旧记忆里的 4-6 默认 5）。
- 回滚：`03_工作台\ROLLBACK_i2vPromptRules_2026-09-23.json`；改稿全文 `03_工作台\交付_2026-09-23_凌晨全线.md` 第三节。
- ⚠️ **七个字段一单都没烧验**，全是纸面推演。验法：先烧基线 → 一次只改一条 → 人眼逐帧比。


## 2026-09-23 · 🔴 提示词润色（Polish prompt）—— 字段、接口、五语实测

### 字段
`ai.prompt_polish_system_prompt`，在 **`GET/PUT https://api.thinknova.top/admin/api/v1/system-configs/<key>`**，body `{value, description}`。
🔴 **这张表的 PUT 是整体覆盖** —— 只传 `value` 会把 `description` 清空（09-23 栽过一次，已还原）。**必须带全字段。**
⚠️ **无镜像字段**（site-configs / agents 里的 "polish" 只是营销文案，不是这个）。

### 🔴 润色接口（实测出来的，⛔ 别再探）
**`POST https://api.thinknova.top/api/v1/ai/prompt-polish`**
body: `{"prompt": "...", "capability": "text_to_video"}`
鉴权：cookie + **`x-csrf-token`**（从任一 GET 的**响应头**取；不带一律 `419001 Security verification failed`）
⚠️ 419 是在路由之前拦的 ⇒ **不带 token 时所有路径都返回 419，分不出哪个存在**。探路径必须先拿 token。
⛔ 试过不存在的：`/api/v1/ai/polish-prompt`、`/api/v1/prompt/polish`、`/api/v1/ai/polish`

### 09-23 21:0x 五语实测结果（改成英文提示词之后）
| 输入 | 输出正文 | 镜头标签 | 混中文 |
|---|---|---|---|
| 印尼语 | 印尼语 ✅ | `Shot 1`（英文） | 否 |
| 马来语 | 马来语 ✅ | `Shot 1`（英文） | 否 |
| 越南语 | 越南语 ✅ | **`Cảnh 1`** ✅ | 否 |
| 中文 | 中文 ✅ | **`镜头1`** ✅ | — |

⇒ **老板原来的 bug（英文输入出中文提示词）已修好。**
⚠️ **遗留**：印尼语/马来语的**镜头标签仍是英文 `Shot 1`**，因为提示词里那条只举了中英两个例子
（`"Shot 1 (0-4s):" in English, the equivalent in Chinese`），模型对越南语自己推出来了、对印尼马来没推。
🔴 **老板 09-23 21:1x 已拍板：不改，就这样。**（理由成立：`Shot 1 (0-4s)` 是通用影视术语，而且这是喂给生成模型的串，不是给客户读的文案。）

### 顺带
- 改后 1299 字 → 4782 字，**超了「提示词 ≤4000 字」通则**；但按 token 算反而更短（约 1500 → 1100），英文比中文省 token。**「4000 是硬限还是通则」未核实**。
- 🔴 **老板 09-23 亲手改了篇幅那段**，原来只卡中文字数，他补上了英文词数：
  `Length: video prompts stay within 600 Chinese characters or 800 English words; image prompts within 300 Chinese characters or 400 English words.`
  **理由（老板原话）：「提示词不够的情况下输出内容是不够的」** —— 英文按中文字数卡会太短，镜头描述写不开。
  ⇒ 以后写多语言提示词的长度限制，**中文按字、英文按词，两套数，⛔ 不要只写一个数。**
- 回滚：`03_工作台\ROLLBACK_提示词润色_2026-09-23.json`；报告 `03_工作台\改写_提示词润色_中文转英文_2026-09-23.md`
- ⚠️ 老板截图里还发现：**英文界面下「运动模式 *」等字段名仍是中文**，前台有中文残留未翻。
