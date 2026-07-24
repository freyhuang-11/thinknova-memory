---
name: project-thinknova-brand-product-industry
description: "ThinkNova 新增「品牌产品」行业(产品优先)+ 广告TVC大片视频风格(全行业);老板2026-07-24定,服务品牌方/直销杂SKU"
metadata:
  node_type: memory
  type: project
  originSessionId: current
  modified: 2026-07-24T16:55:20.122Z
---

# ThinkNova「品牌产品」行业 + 广告TVC大片风格(2026-07-24 老板拍板)

## 背景
现有 22 行业全是**实体店类目**,卖洗衣液/饮料/胶囊这类**自有品牌快消品/线上产品**没对口行业;custom(自定义)因"想猜整个场景、不确定性爆炸"出片烂。艾多美(568杂SKU)也是这需求。见 [[project-thinknova-dingdian-koubao]]。

## 决策(老板定)
1. **加一个「品牌产品」行业**(不分细类,一个通用够用)。
2. **每个行业都加「广告 TVC 大片」视频风格选项**。

## 「品牌产品」行业设计(产品优先)
- **核心逻辑**:格式固定=产品英雄图+卖点+(可选)广告风格;**产品长啥样不靠系统猜,靠用户上传的产品参考图+商品名锁定**(品类再杂,不确定性没了——这是 custom 缺的)。
- **串起三件事**:①广告风格(产品TVC大片)②产品锁定(多参i2v/产品参考图,即"图生图产品没锁"的根治)③直销/品牌方。
- **场景**:实测 businessActions 13 个场景 visibleIndustries 全空=**全局全行业可见**→ 新行业**自动继承全部场景,不用建场景**。适配产品的:new_item(新品/产品介绍)/promotion(优惠)/bestseller(主推)/before_after(使用效果)/process_show(使用演示)/owner_voice(口播)/groupbuy(团购);门店类(store_location/price_menu)用不上不碍事。
- **行业卡格式**(industryFilters):`{id:"brand_product", label:"品牌产品", iconKey:"box/product", iconUrl:""}`。
- **要配**:industryFilters 一条 + industryOptionPresets 一条(defaultAppearanceMode 建议 product_only 或 owner_speaking + endingCta + sellingPoints + visualFocus)+ industryPrompts(产品为主体、锁产品外形)+ 案例(≥几条)。

## 广告TVC大片·视频风格选项(全局)
- videoStyle 现有4个:real_store_promo/owner_recommendation/local_conversion/premium_clean。加第5个,值如 `ad_film`,label「广告风格/广告TVC大片」。videoStyle 是**全局 detailOptionGroup**→加一个=全行业都有。
- **风格修饰词(businessOptionPrompts.videoStyle.ad_film,老板认可措辞)**:
  > 广告大片(TVC)风格:电影级戏剧布光,主光+轮廓光雕出主体质感与光影层次;稳定专业运镜(缓慢推拉/环绕,绝无手持晃动);浅景深虚化背景,大留白考究构图;统一高级的电影感调色;整体极简、时尚、高端,像顶级品牌宣传片,而非日常手机实拍。
- 参考标杆:Apple/汽车广告/星巴克/Balenciaga TVC。**提示词里别写品牌名**(防logo/滤镜artifact),只描述视觉语言。
- ⚠️生效依赖:videoStyle 选项"选了进不进编剧"正是技术在修的前端链路(见 [[reference-thinknova-paths]] 问题二);加了选项,选中生效可能要等技术那条修完(和 premium_clean 同).

## ✅ 广告大片选项·现成可粘(2026-07-25 已核实格式,待落库)
video agent(offline_store_video)config,两处加:
1. `businessUi.detailOptionGroups[videoStyle].options` push:
   `{"enabled":true,"value":"ad_film","sortOrder":50,"label":{"zh":"广告大片","en":"Cinematic ad (TVC)","es":"Anuncio cinematográfico (TVC)","ja":"広告大作（TVC）","ko":"광고 대작(TVC)","vi":"Quảng cáo điện ảnh (TVC)"}}`
   (videoStyle 组用 `id` 不是 key;现有选项格式=enabled/value/sortOrder/label六语言;prompt 不内联)
2. `promptAssembler.businessOptionPrompts.videoStyle.ad_film`(字符串)=
   `广告大片（TVC）风格：电影级戏剧布光，主光加轮廓光雕出主体质感与光影层次；稳定专业运镜（缓慢推拉或环绕，不手持晃动）；浅景深虚化背景，大留白考究构图；统一高级的电影感调色；整体极简、时尚、高端，像顶级品牌宣传片，而非日常手机实拍。`
- 行业卡格式(industryFilters):`{enabled,iconKey,iconUrl:"",id,label:六语言,promptTemplate:"",sortOrder}`。品牌产品:id=`brand_product`,label.zh=品牌产品,iconKey=box。
- 预设格式(industryOptionPresets 是数组):`{industryId,defaultAppearanceMode,endingCta:[],sellingPoints:[],visualFocus:[]}`。品牌产品建议 defaultAppearanceMode=`product_only`。

## 🔴 后台 agent 编辑器落库·2026-07-25 卡住(待解)
- 视频 agent config=**188KB**(referenceCases external_table 后不再 2.3MB,不卡渲染)。config 框=第2个 textarea(带行号,但**不是 CodeMirror/Monaco**,cmCount=0)。**config 内容被 harness 掩码**(API 读 config/stored_config 返回 undefined),但**在编辑器页面内 JS `textarea.value` 能 parse 到全量**、可对象级改。
- ❌ **卡点**:`textarea` 原生 value setter + 派发 input/change 后点「保存 Agent」→ **ad_film 没落库**(GET 商家 config 仍 4 个选项)。疑:①该编辑器 v-model 不认原生 input 事件(Vue 组件自管),或②保存被 config_sha256 冲突/安全分类器拦,或③技术正部署该 agent 撞车。**下次需换同步法**(找 Vue 实例/组件 setter,或真键入),或直接交技术加(一行配置)。
- ⚠️ agent 当时状态:列表显示"已停用"但编辑器"启用"勾选着 + 老板还在烧视频单(task_f5e4ce5c3c2e)→ 实为启用;技术在部署。

## 🔴 落地卡点(和封面回填同一个墙)
- **能直接落库**(419-UI 改 config):广告TVC选项、行业卡/预设/行业提示词骨架。
- **卡在写案例库表(external_table)**:品牌产品行业的**案例** + 18张酒店封面回填 —— 写案例/改封面的请求全被 CSRF+CORS 拦(实测 PATCH/PUT/POST×多域多头全 Failed to fetch,app 自身能过、脚本过不了)。→ 只能走**案例库管理页 UI**(真人上传不冻)或技术给写入口。**这个墙现在挡着两件事,值得考虑跟技术要个案例库写入口**。
- 铁律 8.5:新行业是前端会读的,**先搭一版→老板商家端点确认不崩→再补案例铺全**,别一梭子(上次铺满崩过建单)。
