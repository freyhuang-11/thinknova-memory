---
name: reference-thinknova-frontend-truth
description: "触发:要下任何「前台有没有X / 商家看得到什么」的结论之前 → 必须拉商家端 config 接口,admin config ≠ 前台真值"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-29T19:14:06.799Z
---

# 商家端才是前台真值(2026-07-30 被老板当场纠正)

## 🔴🔴 admin config ≠ 前台。判断「前台有没有」只认这个接口
```
GET https://api.thinknova.top/api/v1/business-video-assets/config   (带商家 cookie)
```
返回**扁平化顶层**(无 businessUi 包裹):`industryFilters / businessActions / outputTypes /
videoGeneration / defaultState / detailOptionGroups / sellingPointOptions /
availableBusinessActionIdsByIndustry / videoModelOptions / referenceCasesSource …`

**07-30 实测**:admin `businessUi.industryFilters` **29 条**,前台只出 **23 条(含「全部」= 22 个真行业)**。
差的 6 条全是 `enabled:false`,后端不下发:
`coworking_office(共享办公) / leisure_hotel(休闲住宿) / property_agency(房产中介) /
insurance_finance(保险理财) / fengshui_metaphysics(风水玄学) / styling_aesthetics(形象穿搭)`

→ 🔴 **`enabled` 是文档明确允许运营改的字段(手册 6.3:label/sortOrder/enabled 可改,只有 id 不要改)**,
所以「上一个行业」不用新建 id,翻 `enabled` 就行。老板 07-30:「行业id 你肯定是可以自己加的」。

## 🔴 我 07-30 造成的事故(已知未修)
按老板「案例回到自己行业」的指示,把 19 条 `ks_*` 案例改了 `industryId`。事后才发现:
- 文档 6.4 明写 `referenceCases.industryId` = **不要改**
- 目标行业里 **4 个前台是关闭的** → 迁进去的 **16 条案例商家完全看不到**
- 只有 `travel_agency`(旅行社)那 3 条是可见的
**两条出路**:①把这 4 个行业 `enabled` 打开(顺带 57 条原生案例也停用着) ②把 16 条迁回 knowledge_share。**等老板定。**

## 🔴 时长/输出类型:运营改不了,别再试
- `businessUi.videoGeneration.allowedDurations` **后端强制升序归一化**。07-30 实测写 `[15,10]`,
  PUT 回 200/code0,**回读变回 `[10,15]`**。想靠调顺序改默认时长 = 无效。
- 前台卡片上那个「**10秒短视频**」来自 `outputTypes[0].id = "video_10s"`,前台按 id 渲染。
  🔴 **`outputTypes` 在 admin config 里根本不存在,是后端生成的**,只注册了 `video_10s` 一个。
  把 `defaultState.outputType` 改成 `video_15s` = 指向未注册枚举 = 重演建单 500。**必须交技术。**
- ⛔ **已作废的老规格**:归档《实体店内容生成预设选项与内置Prompt配置》第 6/7 条
  「视频默认 10 秒,用户侧统一只展示 10 秒短视频;15 秒不在用户侧展示」——
  **被 07-24 手册(5~30 秒运营可配)和老板 07-30「默认 15 秒、明天上 30 秒」双重推翻,不要再引用。**

## 🔴🔴 加「预设选项值」的唯一正确姿势(07-30 打通,含后端映射表红线)
**后端有一张业务选项映射表**,不在表里的值保存时报:
`422 / code 422010 / "Unmapped business option value: group=visualFocus value=space_tour"`
- ✅ **`videoStyle` / `paceLevel` 可以自己加新值** —— 后端会**自动加组前缀**落库:
  `cinematic_showcase` → `video_style_cinematic_showcase`;`slow_immersive` → `pace_level_slow_immersive`
- ❌ **`visualFocus` 加不进去**(后端写死映射)。`endingCta` 未测,大概率同样(CTA 驱动实际行为)。
- 🔴 **必须两步走**:①只加选项值 PUT → ②回读拿**归一化后的真实键** → ③用真实键写
  `optionRules[组][真实键]` **live + opsEditable 双写**。
  直接用原始值当规则键 = **规则被静默剥掉**(回读 false),07-30 踩过。
- 选项对象最小字段:`{value,label{6语},sortOrder,enabled}`。
- 📌 `appearance_mode_menu_board_display「价目表展示(测试)」` 就是这么来的 —— **测试值挂在前台没清**。

## 07-30 已落地(前台接口验证送达)
- `coworking_office` → label「**企业服务**」+ `enabled:true` + `sortOrder:35`,前台行业 22→23
- 19 条案例迁入企业服务(17 条 `coworking_office_*` 原在 space_stay + 2 条 `ks_biz_*`),覆盖 13 场景
- space_stay 启用案例 49→32(不再是四行业混装)
- 16 条 `ks_re/fin/fs/style_*` **迁回 knowledge_share**(目标行业前台关着,迁过去等于隐藏)
- 新预设值 5 个:videoStyle +电影感大片/纪实生活感/明快陈列/氛围仪式感(4→8),paceLevel +慢速沉浸/节奏卡点(3→5),规则均双写

## 预设现状(07-30 实测,回应「预设没补充」)
- **案例级预设是有差异的**:581 条启用案例里 pace 3 种 / style 4 种 / focus 9 种 /
  appearanceMode 5 种 / scriptwriterPreset 5 种 / sellingPoint 几十种组合。「所有案例预设一样」不成立。
- **但选项库确实没扩过**:`detailOptionGroups` 9 组,值的数量还是老样子
  (videoStyle 4 / paceLevel 3 / visualFocus 9 / appearanceMode 5 / endingCta 5 / platform 11),
  `sellingPointOptions` 31 条。**昨天说要补的新预设值一个都没加。**
- `optionRules` 覆盖率满(live + opsEditable 双份都在),缺的只有 `copyLanguage`(语言不需要画面规则)
  和 `endingCta.none`(本来就是"不要CTA")。→ **要补的是选项值本身,不是规则。**

关联 [[reference-thinknova-tech-docs-index]] [[reference-thinknova-option-scene-rules]] [[feedback-case-low-coupling]]
