---
name: project-thinknova-brand-product-industry
description: "触发:要加行业/加场景之前,或商家建单报 500 时 → 新场景必须技术注册进合法枚举否则后台保存被剥离;含 admin GET 拿全量真值→隔离实验换维度→找唯一缺键 的诊断法"
metadata:
  node_type: memory
  type: project
---

# 「品牌产品」行业 + 广告 TVC 大片场景(2026-07-24 老板拍板,07-25 全量上线)

## 一、上线状态(已完成)
- ✅ **行业 `brand_product`**:`industryFilters` + `industryOptionPresets` + `promptAssembler.industryPrompts.brand_product`(镜像 retail 的 imagePrompt/videoPrompt 结构)全部落库,服务端回读确认。行业数 22→23。
- ✅ **场景 S14「广告 TVC 大片」**:`businessActions` id=`cinematic_ad` / sceneId=`S14` + `scenePrompts.S14{imagePrompt,videoPrompt}` + `sceneRules.S14` + preview/label/description 六语言。场景数 13→14,**全局全行业可见**。
- ✅ **案例 51 条**:S14 每行业 2 条(大牌 TVC `<ind>_s14_tvc` + 品牌故事 `<ind>_s14_other`,22×2=44)+ 品牌产品各场景 7 条(s01/s02/s03/s06/s08/s11/s13)。全 enabled、sceneIds 正确、封面已回填(四字段 coverImageUrl/previewUrl/thumbnailUrl/previewImageUrl;TVC 44 条复用 2 张通用电影感封面,品牌产品 7 条各单独产品封面)。
- ✅ **videoStyle 第 5 个选项 `ad_film`「广告大片 / Cinematic ad (TVC)」** 已落库(六语言 label + `promptAssembler.businessOptionPrompts.videoStyle.ad_film` 风格串)。
- ✅ **实测出片**(task_d9eb6173c06c,brand_product 广告大片):建单 200 → 编剧 succeeded → rendering;脚本 concept 电影感官向、有人物对镜 + 产品特写,非无人流程片。**S14 / 品牌产品可出片。**
- ⚠️ **S14 案例默认列表排不出来**,必须用 `sceneId=S14` 过滤才列得出。

## 二、🔴🔴 加行业 vs 加场景:权限边界(核心教训)
- **加"新行业"运营能配全**;**加"新场景"必须技术做** —— 后台编辑器只认已注册的场景枚举,保存时会把未注册的 sceneId **静默剥离**(S14 曾被一保存就退回 13),`industryPrompts` 不校验所以新行业留得住。
- 技术已上线的修复(07-25):①场景合法表改读 `businessUi.scenes[]`(不再硬编码 S01-S13)②视频 agent 补 S14 + 六语言标签 + cinematic_ad + scenePrompts/sceneRules ③保存时校验 sceneId 必须引用已注册启用场景 ④后台面板新增场景注册表 + 动态标签 + sceneRules 编辑 ⑤修 opsEditable 保存与运行时同步冲突。
- **教训**:加行业/场景**先查技术文档(配置 JSON 说明书 6.3 等)再动手**——`industryFilters.id` 必须和 `industryPrompts` 键对应,漏了生图层取不到;`sceneRules[SXX]` 缺了父任务组装取不到 → 建单 500。

## 三、🔴 建单 500 诊断法(别猜,已成通用方法)
1. **隔离实验换维度复现**:直连 POST `api.thinknova.top/api/v1/business-video-assets/tasks`(商家域,带商家 CSRF 头),用**老行业 + 同一新场景**复现 → 一样 500,即可排除行业/案例/appearanceMode,锁死是场景。
2. **admin GET 拿全量真值**:`GET /admin/api/v1/agents/{code}` 返回的 `config` = **全量真实值**(掩码只在显示层,`JSON.stringify` 是真的),可安全对象级改 + 核。
3. **找唯一缺键**:对比同类键的完整列表,找出"别的都有、唯独它没有"的那一个。
- **500 的两个已知形态**:①`sceneRules` 缺该场景 → **建单阶段就挂、不建任务记录**,所以任务列表查不到失败单;②案例缺核心设置预设字段(见下)。
- ⚠️ 我曾先猜 appearanceMode 错了一轮 —— **建单 500 一律走上面三步,不猜。**

## 四、🔴🔴 案例必带字段(缺了商家建单 500)
新建案例只给 id / industryId / sceneIds / title / summary / visualHint / enabled / sortOrder **不够**。商家建单会读这 **8 个核心设置预设字段**,缺一就 500(建单提交就报错、连任务都不建):
`paceLevelPreset` + `paceLevelOptions` + `videoStylePreset` + `videoStyleOptions` + `visualFocusPreset` + `visualFocusOptions` + `endingCtaOptions` + `previewAssetType`("image"/"video")。
值可抄正常案例(如 `food_s01_new`)。**另须带** `appearanceModePreset` + `appearanceModeOptions`(老案例都有;漏了表单"出镜方式"显示"不指定")。
可选:`sellingPointPreset`(数组)+ `prefill{offer,productName}`(六语言,商家填单预填)。
> 07-27 已给 601 条案例全量铺预设(含 `scriptwriterPreset`),见 [[project-thinknova-film-types]]。

## 五、编剧层仲裁(为何口播变无人流程片)
编剧 prompt 里后端注入 `optionArbitration.peoplePolicy`:**`appearanceMode` 独家决定出不出人**(`product_only` → `presence:no_person` → 旁白 voiceover_os,`visualFocusCanOverridePresence:false`)→ **一票否决案例 visualHint 的口播锁死**。
`systemPromptSource = screenwriter.systemPrompt`(单一全局编剧,无按行业分)。详见 [[reference-thinknova-prompt-fields]]。
- 技术已上线「编剧异步上下文」修复:核心设置语义 + case + businessScenario + referenceRoles 自动进编剧,子任务新增 `writerContext` 可核验;新增 `promptComposer.masterPipeline.scriptwriter.staticTemplates.contextPriority` 运营可配优先级 → 可用来配"口播强意图 > appearanceMode 默认"。

## 六、「品牌产品」行业设计(产品优先)
- **背景**:原有 22 行业全是实体店类目,卖洗衣液/饮料/胶囊这类**自有品牌快消品/线上产品**没对口行业;`custom`(自定义)因"想猜整个场景、不确定性爆炸"出片烂。艾多美(568 杂 SKU)也是这需求,见 [[project-thinknova-dingdian-koubao]]。
- **核心逻辑**:格式固定 = 产品英雄图 + 卖点 +(可选)广告风格;**产品长啥样不靠系统猜,靠用户上传的产品参考图 + 商品名锁定**(品类再杂,不确定性没了——这是 custom 缺的)。
- **串起三件事**:①广告风格(产品 TVC 大片)②产品锁定(多参 i2v 吃产品参考图)③直销/品牌方客群。
- **不用建场景**:`businessActions` 的 `visibleIndustries` 全空 = 全局全行业可见 → 新行业自动继承全部场景。适配产品的:new_item / promotion / bestseller / before_after / process_show / owner_voice / groupbuy;门店类(store_location / price_menu)用不上不碍事。
- **预设建议**:`industryOptionPresets` 是数组,元素 = `{industryId, defaultAppearanceMode, endingCta:[], sellingPoints:[], visualFocus:[]}`;品牌产品 `defaultAppearanceMode = product_only`。
- **行业卡格式**(`industryFilters`):`{enabled, iconKey, iconUrl:"", id, label:六语言, promptTemplate:"", sortOrder}`。品牌产品 iconKey=`box`。⚠️ 前端图标白名单只认约 26 个键,配了不在表里的键会渲染兜底 —— 见 [[project-thinknova-offline-agents]]。

## 七、广告 TVC 大片风格串(老板认可措辞)
`promptAssembler.businessOptionPrompts.videoStyle.ad_film`:
> 广告大片(TVC)风格:电影级戏剧布光,主光加轮廓光雕出主体质感与光影层次;稳定专业运镜(缓慢推拉或环绕,不手持晃动);浅景深虚化背景,大留白考究构图;统一高级的电影感调色;整体极简、时尚、高端,像顶级品牌宣传片,而非日常手机实拍。

- 参考标杆:Apple / 汽车广告 / 星巴克 / Balenciaga TVC。**提示词里别写品牌名**(防 logo/滤镜 artifact),只描述视觉语言。
- 🔴 **广告 TVC 大片是「场景」不是「核心设置视频风格」**——我一开始错加成 videoStyle 选项,老板纠正:要的是**场景/内容类型**;场景是全局的 → 所有行业自动都有 = 对应"每个行业加"。(videoStyle 里的 `ad_film` 作为风格修饰词保留,两者不冲突。)
- TVC 的画面分流派与景别层次规则见 [[project-thinknova-film-types]] 第七节。

## 八、落库机制备忘
- **服务端归一化实测**:`detailOptionGroups` 的 option `value` 会被加组前缀(`ad_film` → `video_style_ad_film`,提示词 key 同步归一化、两边一致仍生效);但 `businessActions.id` / `industryFilters.id` **不归一化**(cinematic_ad / brand_product 原样存)。videoStyle 组用 `id` 不是 `key`;选项格式 = enabled/value/sortOrder/label 六语言,prompt 不内联。
- **写入方式**(现行 API 直 PUT / 案例 PUT reference-cases / 编辑器 InputEvent 备用法)统一见 [[project-thinknova-offline-agents]] 第一节。
- ⚠️ **文生图批量 >~6 张会 45s 超时**(每张 ~3s),分小批发。
- 🔴 **铁律 8.5**:新行业是前端会读的,**先搭一版 → 老板商家端点确认不崩 → 再补案例铺全**,别一梭子(上次铺满崩过建单)。

## 九、待核
- 「核心设置手选后是否真进提示词」尚无干净测试:07-25 的美业口播单口播来自**场景**(owner_voice)不是核心设置,且该单核心设置表单全"不指定"。干净测法 = 场景选非口播(如 S01)+ 手选一个核心设置 + 看编剧是否反映。
- 探针案例 `zz_tok_probe` DELETE 没通,还挂在库里(enabled:false 商家不可见),待 UI 删。
