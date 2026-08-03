# 铁律 · 按触发时机分层(按"什么时候用"排;漏 = 该用时没想起来)
> 这里只放**触发条件 + 一句动作**。案例、字段路径、复盘全在链接文件里,该用时打开。
> 📍 2026-07-31 里程碑:编剧战役收官,全库记忆已按当日现状归并覆盖。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 **权威源(技术文档/线上真值/代码)> 我的记忆**;下关键结论前回源核对,实验结论标「实测·待核」带任务号、不外推 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断"现在/多久前"**先跑 `date`** → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**;模糊回复先确认再动手 → [详](feedback_dont_assume_requirements.md)
2.5 🔴 **例程内能自己拍板的自动跑**,别每天拿老问题问老板 → [详](feedback_dont_assume_requirements.md)(同文件反向边界段)
2.7 🔴 **接"上次的活"先看记忆文件修改时间**;另一会话可能几分钟前刚推翻我的结论 → [详](feedback_parallel_sessions_check_first.md)
2.8 🔴🔴🔴 **老板给的词按他的字面做满,不许自己缩窄定义再报"全部完成"**;拿不准边界先问 → [详](feedback_dont_assume_requirements.md)(「缩窄定义」段)
3. 🔴 **没实地用过不下判断**;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md)
3.2 🔴 **写入被拒先原样重试一次再说**;别把"这条命令能不能发"退回给老板。**唯一硬墙=改我自己的 settings.json 权限段(classifier 死拦,也不许绕,只能给老板贴;08-02 已贴好 36 条 allow)** → [详](feedback_retry_before_escalating.md)
3.5 🔴🔴🔴 **「前台有没有X」只认商家端 config 接口,admin config 不是前台真值;新文档与旧记录冲突以最新覆盖** → [详](reference_thinknova_frontend_truth.md)

## L1 · 改配置/提示词前
4. 🔴 **先查字段读取图**:拉一条真实任务 input,确认目标字段真在里面 → [详](reference_thinknova_prompt_fields.md)
4.3 🔴🔴🔴 **配置字段的语义(每句还是总计?目标还是边界?)不确定=先问技术,绝不凭直觉配**——lineValidation「总计」被我当「每句」配,一字之差造出电报体+连环回退+语速慢三症,烧十几单才定位 → [详](project_thinknova_0729_screenwriter_stack.md)
4.5 🔴 **台词出问题先查 visualHint** → [详](feedback_visualhint_leaks_into_lines.md)
4.6 🔴🔴🔴 **提示词≤4000字(字数),言简意赅目的明确,废话重复矛盾全删(07-31 老板通则)**;同一文档两条规则打架时模型行为不可预测,加新规则前先想清挤掉谁 → [详](project_thinknova_0729_screenwriter_stack.md)
4.7 🔴🔴🔴 **关键规则一律前置(07-30 老板通则)**;但前置救不了超长提示词——11095字时置顶也没用,**先减肥再谈位置** → [详](project_thinknova_0729_screenwriter_stack.md)
4.8 🔴 **查"有没有某能力"读结构化字段(`capability`),不拿 code/name 正则猜**
5. 🔴 **指派式 > 禁令式**;必须禁止时禁令后立刻跟替换项;「写满」类要求必须给贫料出路,否则模型拿空话注水 → [详](feedback_directive_over_prohibition.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 只证明写进库;前台/烧单看见才算上线 → [详](feedback_evidence_standard.md)
7. **i2v videoPrompt 4096字节硬顶,07-31 起超限=杀该次编剧尝试(不再静默截断)**;videoTemplate 已压 564字余量充足,再加字仍要量 → [详](reference_thinknova_prompt_architecture.md)
8. **范围边界必写反向**:附"作用域仅X、不碰Y"+双向验收 → [详](feedback_scope_boundary_explicit.md)
8.5 🔴 **动"前端会读的字段"先改一条验,别一次铺满** → [详](project_thinknova_dingdian_koubao.md)
8.6 🔴🔴 **加行业/加场景先翻技术文档**;新场景必须技术注册进合法枚举,否则商家建单500 → [详](project_thinknova_brand_product_industry.md)
8.7 🔴 **建单500 诊断法**:admin GET 全量真值 → 隔离实验换维度 → 找唯一缺键 → [详](project_thinknova_brand_product_industry.md)
8.8 🔴🔴 **config/案例写入唯一正解:GET 响应头拿 `x-csrf-token` → 带头 PUT(agent 整体/案例单条/businessUi 都通,07-31 解锁)**;419-UI 弹窗法废弃;重 SPA 页会冻死 CDP,fetch 一律在 robots.txt 轻页跑 → [详](reference_thinknova_paths.md)

## L2 · 烧单核验时
8.9 🔴🔴 **烧单前必报客户视角五要素**(行业/场景/案例/补充信息原文/验证目标) → [详](feedback_burn_report_format.md)
9. 🔴 **逐帧通看**(ffmpeg 联系表);音频用 silencedetect 量死寂;单帧截图=假结论 → [详](feedback_evidence_standard.md)
9.5 🔴 **烧完先验三件:task.model 实际派发(videoModelId 才可信)、编剧 source(回退/被劫持单作废重烧)、字数落区间** → [详](project_thinknova_0729_screenwriter_stack.md)
10. **变量做满再烧单**;没补穿不许下模型结论 → [详](feedback_prompt_first_then_test.md)
11. **证据成对**:真实输入↔真实输出+任务号;批量烧单串行≥20秒 → [详](feedback_evidence_standard.md)

## L3 · 给技术发文档前
12. 🔴 **只发技术才能处理的**;发之前逐条自验"我自己能不能改"
13. 🔴 **9段规范**;事实/判断/期望分离,一份最多3个独立问题 → [详](reference_tech_doc_submission_spec.md)
14. **发文前 7 条自检** → [详](feedback_tech_doc_checklist.md)
15. **发出即冻结**;新内容走增量文件 → [详](feedback_tech_doc_checklist.md)("发出之后"段)

## L4 · 汇报沟通时
16. **每轮说清"验收什么 + 做了什么"**;做完先自验再通知 → [详](feedback_communication_principles.md)
17. **说重点 / 有据质疑 / 别奉承 / 追根因不打补丁 / 先讨论再操作** → [详](feedback_communication_principles.md)
18. **要老板拍板的用 plan 模式结构化问** → [详](feedback_questions_via_plan_mode.md)
19. **数据新鲜度**:别贴"过期"标,也别埋雷 → [详](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反 = 事故)
20. 🔴 密钥不外发、不打印、不进任何 git 仓库
21. 🔴 禁 `taskkill /IM python`,按 PID/端口精准杀;临时本地服务器用完即按 PID 杀 → [详](feedback_kill_python_scope.md)
22. 🔴 线上 config = 唯一真值,禁种子覆盖;改前必验框身份+金额;464 不主动加白;408/409 未经老板同意不启用
22.5 🔴 **config 结构/字段/新字段一律交技术,我只碰纯文本字段** → [详](feedback_dont_edit_prod_config_structure.md)
22.7 🔴🔴 **上下文唯一杠杆=减少往返**:一段 JS 干完一整套只回摘要;读文字不截图;证据走联系表;成片老板自己看不用发他 → [详](feedback_context_budget_discipline.md)
23. **记忆只留当前状态**,过时覆盖删除不堆矛盾层 → [详](feedback_memory_keep_current.md)
24. **老板发的提示词当天归档** → [详](reference_prompt_library.md)

---

# 用户与沟通
- 🔴 [共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — 开工 pull+读信箱,收工 push
- [用户画像](user_profile.md) — 跨境电商 BD/运营,新加坡;TikTok 达人 SaaS + ThinkNova 双线
- 🔴🔴🔴 [文件放哪](feedback_file_placement.md) — **桌面=`D:\SamsoData\Desktop`,C盘桌面是假的(已三犯:07-12/07-28/07-31,老板骂"天天乱放")**;桌面只放成片/成图,文档进视频制作平台分析子目录

# ThinkNova(实体店内容 SaaS)
### 动手前必背
- 🔴🔴🔴 [编剧层 07-31 里程碑版](project_thinknova_0729_screenwriter_stack.md) — **动编剧/长度/台词/烧验第0步·唯一现状源**:lineValidation=全片总计唯一真值(zh 62-75)、systemPrompt≤4000字零数字、PHP注入、标准验收配方、战役教训六条、判读手册
- 🔴🔴 [商家端=前台真值](reference_thinknova_frontend_truth.md) — 下"前台有没有"结论前必读;语言终版 zh_cn/en/ja/ko/es 无beta;placeholder 配置化读取链;agent 直连 PUT 解锁
- 🔴🔴 [技术文档档案索引 = 唯一真值](reference_thinknova_tech_docs_index.md) — 改 config 字段第0步;顶部「口径速查」
- 🔴🔴 [模型台账 + 时长映射](reference_thinknova_multiref_model.md) — 动模型/时长前必看;grok 做不到硬切,omni 才能(07-31 老板定论)
- 🔴 [提示词字段读取图](reference_thinknova_prompt_fields.md) — 改提示词第一查:谁读得到哪个字段
- 🔴🔴 [场景提示词/选项规则/案例写入路由](reference_thinknova_option_scene_rules.md) — 场景规则活路径=screenwriter.systemPrompt 查表;optionRules 双写;案例单条 PUT;product_only≠无人
- 🔴 [两条管线完整流程](reference_thinknova_pipeline_flow.md) — 海报4步/视频6步
- 🔴 [提示词改造架构](reference_thinknova_prompt_architecture.md) — 三层职责+4000字令+4096新语义+镜像双写
- 🔴 [Grok 审核红线实测](reference_grok_content_policy.md) — 红线是组合不是敏感词
- [配置权限地图](reference_thinknova_config_powers.md) / [路径接口](reference_thinknova_paths.md) — csrf-PUT 正解/轻页法/CORS服务器法都在 paths

### 现行状态(07-31 里程碑)
- ✅ **编剧战役收官**:回退语义=失败即退款;终验双单全项过并已挂进案例预览(口播 9b3b28 一镜到底/非口播 8e6ea1 画外音);案例体检 587 条 hint 100% 双标记(六语);声线三件套新规。残留=三锁双参验证在跑(db787156c4c0)、30秒上线分档、7 片型烧验(与预览回填流水线合一)、KB8 裁切偶发原因(技术)
- 🔴🔴 [口播/裁格现状](project_thinknova_0729_koubo_defect.md) — 全局 storyboard_board+口播案例 panel_crop 分层;首帧裁切保护闸;旧 lineValidation 表已作废
- 🔴 [故事板取证手册](project_thinknova_storyboard_test.md) — **取证接口唯一真值**(admin offline-store-content/tasks/{no} 拿板图裸片)+三锁 n=5 承诺+两模型定位
- ✅ 案例文案去重 468 处/284 条+prefill 问句化 93 条已铺完送达(07-30);[案例缺口双查法](feedback_case_gap_dual_check.md)
- 🔴🔴 [片型体系](project_thinknova_film_types.md) — 620条铺完;剩 7 片型烧验
- 🔴 [字节手术+无台词开关](project_thinknova_0729_byte_surgery.md) — voiceMode=none 早就存在(22条TVC在用);omni 中文边界看 screenwriter-stack
- 🔴 [品牌产品行业+TVC场景](project_thinknova_brand_product_industry.md) — S14 已上线;建单500 排查法
- 🔴 [定点口播线](project_thinknova_dingdian_koubao.md) — 直销 Atomy 第一用户
- 🔴🔴 [国内营销线](project_thinknova_marketing.md) — **主战场·07-31收工态**:介质已换=**AI实拍空镜打底+两层字幕(底部全程口播字幕+中部大字卡)+老板音色**,所有平面画风(娱乐版/水墨/黑底/纸底彩图)全废;**台词写法已定稿**(《花大几千请人拍》48s老板验收通过,skill=video-script-style);当天出六条成片在D盘桌面;素材一律走平台文生视频**494「经济实惠文K」**;🔴铁流程=**脚本先给老板过目才动手**/样片先行/烧前查单价/CDP超时先查列表再重发
- 🔴 [小红书两把尺](project_thinknova_marketing.md) — 写笔记用 `/xhs-note`(**四柱:选题→标题→配图→文案**+违禁词五级扫描+AI味黑名单),涨粉SEO冷启动用 `/xhs-growth`(本地化自132技能库);最高危=「搞钱/变现」违禁词;冷启动要先囤10篇再发
- 🔴 [做视频四件套skill](project_thinknova_marketing.md) — 写脚本按顺序调:`video-script-style`(台词)→`high-retention-hook`(前3秒)→`hkrr-clock`(全片留存)→`hurricane-shot-prompt`(分镜+生成提示词)
- 🔴 [定价+推广大使](project_thinknova_pricing_ambassador.md) — 海报6/视频60;07-30 重定价:omni/wan/sora=3分/秒,grok系=4分/秒;价格三口径待技术
- 🔴 [HyperFrames 生产线](reference_hyperframes_production.md) / 🔴 [音色克隆生产线](reference_voice_clone_pipeline.md)
- [实体店两个 Agent(工程主线)](project_thinknova_offline_agents.md) — CTA 未选强加已在 07-31 提示词层修复
- 🔴🔴 [竞品·引力Ai/萍萍拆解](reference_competitor_gravity_ai.md) — **探店片型第0步必读**:一镜一图vs一片一图;萍萍台词公式(钩子→第2句价格锚→短句→三连催单,催单被我们总纲禁着待老板放行);真差距=声调起伏(TTS)+切镜密度(grok不硬切)+台词结构;**omni老板定论砍掉**(中文转英语/画面字乱码/产品锁不住);A/B实测7格撞4096墙;探店案例=`food_beverage_s01_tandian`(条件式门头/固定男声/案例级黑幕/特写≤七成)
- 🔴🔴 [海报场景改造 08-03](project_thinknova_poster_scene_revamp.md) — **动海报场景/案例/styleRule 第0步必读**:场景表已整体换成美图式「渠道×版式」16场景(老板拍板);340条案例迁入S01门店海报;对照烧验3成1败(S11/S16轻内容场景被copy层海报结构压住=待技术);styleRule词表黑白名单;两线案例表独立;场景注册/批量迁移/pageSize=60/裸对象PUT配方全在文内;待办=copy层场景开关技术卡/健康医疗封面44条只用9张图待重生成/铺行业待拍板
- 🔴🔴 [东南亚语言扩充 08-04](project_thinknova_sea_languages.md) — **动输出语言第0步必读**:视频线 vi/id/ms 已上前台(编剧层通,TTS 待通道修复后测);海报线三语已回滚(copyLanguage 不进文案层=技术卡问题2,"中英对是模型翻译兜底不是链路对");加语言正门配方(optionsMode:replace+languagePolicy.map+lineValidation);待办=五语流畅性矩阵/清真规则/th 评估
- 🔴 **08-03 遗留待办**:①门头做进核心设置(客户自选,待技术/老板定)②OPS-VIDEO-20260803-01 技术卡已写好老板拍板发(lineValidation缺时长维度+storyboardGuard 37字节截断)③10秒单临时规避走15秒④海报 copy_rules「价格必留」opsEditable无入口待问技术⑤门头/产品锁不死=模型问题等老板换模型再测
- 🔴 [官网博客运营 API](reference_thinknova_blog_ops.md) — 写/发官网博客前必读;纯 API 无后台页、要 blog.write 令牌(我手上没有)、**中英双语全填才准发**、封面必须平台资产编号横图、公开读接口免令牌可自验
- [扫码发布深链配置](reference_thinknova_publish_schemes.md) — 四平台已真机验证

### 内容与产品规矩
- [北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) / [内容工具不做合规](feedback_thinknova_content_not_compliance.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — 建案例前必读;新建必过 3 条自检
- [案例缺口双查法](feedback_case_gap_dual_check.md) / [小红书交付规矩](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md)

# Compass / TikTok 达人线(休眠)
- [Compass 现状+14 条待办](project_compass.md) — 历史见 archive/compass_history_to_0729.md
# 其他
- [新加坡鞋包提案](project_sg_footwear_proposal.md) / [小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md)
