---
name: reference-thinknova-config-powers
description: "ThinkNova 配置权限地图:我能自己改的全部键 vs 改不动的东西(消化自技术三份说明+实查);提需求前必查,能自改的自己改完再说话"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

> 来源:技术《商家Agent_配置JSON说明书_2026-07-08》《商家Agent完整实现说明_2026-07-08》《merchant-agent-config-guide_2026-07-08.html》(老板 07-08 定为"最终的 json 修改文档",全部归档于 00_规格与参考/技术侧文档/)+ 我方实查。**这三份=promptAssembler+businessUi 层的权威操作手册,但不含 promptComposer(见下,两层并存)。** PUT body 形态=`{"config":{promptAssembler,businessUi}}`。
> **铁规(2026-07-08 用户定,因我多次错乱)**:提任何要求前 ①先查本地图 ②再实查线上键是否存在 ③**能自己改的立即自己改+验证,不许推给技术**;只有键不存在/被服务端并集覆盖/前端不读时才提技术,且必须附"已实查"证据。反向同罪:代码里的东西别自己硬凑。

## ✅ 我能改(admin PUT /agents/{code},当天生效)

**promptAssembler(生成策略,07-08 起全开放)**:
commonPrompts(系统底线/输入综合/补充要求优先级/风控/验收) · image(产品规则/网感/outputTypePrompts.poster+video_first_frame/platformAdapterPrompts 有图无图/negativePrompt) · video(同构+negativePrompt) · scenePrompts S01-S12(图+视频各一) · industryPrompts 逐行业 · businessOptionPrompts(出镜/重点/CTA/风格/节奏/位置强调的逐选项提示词) · layoutGuidance(海报/首帧版式) · **imageEditOptions(restyle strength 0.82/0.74——B6 锁定强度手柄)** · **shotListTemplates(镜头表模板,#42 我可自改)** · copyPlanTemplates(标题/钩子/旁白模板,{变量}替换) · assetVisibilityRules+assetFilterRules(中间产物可见性) · ratioPreferences(默认比例) · **posterCountOptions/posterCountDefault(海报张数)** · videoModelPolicy(强制能力/时长)

**promptComposer(视频提示词机器,一直是我的)**:
languagePolicy.map(14语硬禁令) · blockTemplates/blockOrders(分镜板块) · stagePromptPresets(t2i/i2i/**i2v 1954B 块**) · optionRules/sceneRules/industryRules/industryRuleVariants · negativePromptPolicy · durationPolicies · referenceImagePrompts · caseInjectionPolicy · **🆕screenwriter(编剧键,2026-07-09技术开放)** · ⚠️改上述须**双写 opsEditable 镜像**(video agent)

**🆕promptComposer.screenwriter(编剧,07-09 从PHP搬进config可PUT)**:
`systemPrompt`(覆盖 builtin_default 编剧大脑) · `staticTemplates.businessContext/outputContract(原空)/firstFrameTemplate/videoTemplate` · `textModel.temperature`(默认0.2→建议0.7多样性)。**变量契约**:编剧输出JSON五字段 concept/firstFrameCell/boardCells(6格静态画面给t2i)/cells(6格镜头推进给i2v)/lines(台词只念不入画),模板用{{}}占位消费。**生效验证**:烧单看 input.systemPromptSource=`prompt_composer.screenwriter`(不再是 builtin_default)。⚠️技术默认 firstFrameTemplate 含`字幕/口播重点:{{lines}}`=字幕进图地雷,PUT时必删。草稿在 00_规格与参考/编剧+i2v骨架_改造草稿_v1。

**businessUi(前台展示)**:
referenceCases 全字段(title/summary 六语言对象/visualHint/prefill/预览四字段/enabled/sortOrder) · industryFilters · businessActions · sellingPointOptions · quickRequirementChips · detailOptionGroups(label/sortOrder/enabled 可改;**value/id 不许动**) · placeholderDefaults(六语言已备) · sidebarNav · defaultState · industryOptionPresets

**计费**:pricing_json=真值(poster 过渡态 24;技术切 per_poster 时同一天改) · pricingSchema。冻结→扣减→失败退→成功结算;验计费只看 /credits/transactions 流水。

## ❌ 改不动(全部有实证)

1. ~~编剧系统提示词~~ **已解禁(2026-07-09)**:技术开了 `promptComposer.screenwriter.*` 键,现可 PUT 覆盖 builtin_default → 见上方 ✅ 区。(历史:曾在 PHP 里、无键)
2. **代码默认表被服务端并集**——语言表实证:PUT 干净 5 项回读 6 项,ko 删不掉;schema 白名单(STABLE_VALUE_MAPS)会归一化改写
3. **前端写死**:门店名称/位置/补充要求占位词(config 0 命中)、"价目表展示(测试)/通用·不注入"调试项、海报张数**选择控件**、语言下拉的 Beta 标注文本
4. **管线代码**:worker 派发、参考图数组组装、裁格、ffmpeg 合并、静默回退逻辑
5. **服务器**:env(告警 webhook)、供应商账号、PM2、出网
6. 前端读哪个字段(如 placeholderDefaults 没被读=F5)

## ⚠️ 陷阱
- 说明书示例是**单语言字符串**,线上是六语言对象——照说明书写会毁翻译,永远按线上现状的形态改
- 说明书模板 video.negativePrompt 含"跳变镜头"(毒词,线上已清)——不许从模板恢复
- 禁种子覆盖;改前备份该键原值;一次一小块,改完验证
- 说明书只覆盖 promptAssembler,没写 promptComposer——两层并存,视频板/i2v 走 promptComposer

## 历史错乱案例(镜子)
- 反向错:把 shotListTemplates 文案、海报默认张数(config 有键)写成"要技术改" → 应自改
- 正向错:曾试图 config 收窄语言表(被并集打回)→ 该提技术
