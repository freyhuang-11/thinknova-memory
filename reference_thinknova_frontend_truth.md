---
name: reference-thinknova-frontend-truth
description: "触发:要下任何「前台有没有X / 商家看得到什么」的结论之前 → 必须拉商家端 config 接口,admin config ≠ 前台真值"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-07-29T18:55:46.336Z
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

## 预设现状(07-30 实测,回应「预设没补充」)
- **案例级预设是有差异的**:581 条启用案例里 pace 3 种 / style 4 种 / focus 9 种 /
  appearanceMode 5 种 / scriptwriterPreset 5 种 / sellingPoint 几十种组合。「所有案例预设一样」不成立。
- **但选项库确实没扩过**:`detailOptionGroups` 9 组,值的数量还是老样子
  (videoStyle 4 / paceLevel 3 / visualFocus 9 / appearanceMode 5 / endingCta 5 / platform 11),
  `sellingPointOptions` 31 条。**昨天说要补的新预设值一个都没加。**
- `optionRules` 覆盖率满(live + opsEditable 双份都在),缺的只有 `copyLanguage`(语言不需要画面规则)
  和 `endingCta.none`(本来就是"不要CTA")。→ **要补的是选项值本身,不是规则。**

关联 [[reference-thinknova-tech-docs-index]] [[reference-thinknova-option-scene-rules]] [[feedback-case-low-coupling]]
