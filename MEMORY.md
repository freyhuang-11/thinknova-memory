# 铁律 · 按触发时机分层(按"什么时候用"排;漏 = 该用时没想起来)
> 这里只放**触发条件 + 一句动作**。案例、字段路径、复盘全在链接文件里,该用时打开。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 **权威源(技术文档/线上真值/代码)> 我的记忆**;下关键结论前回源核对,实验结论标「实测·待核」带任务号、不外推 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断"现在/多久前"**先跑 `date`** → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**;模糊回复先确认再动手 → [详](feedback_dont_assume_requirements.md)
2.5 🔴 **例程内能自己拍板的自动跑**,别每天拿老问题问老板 → [详](feedback_dont_assume_requirements.md)(同文件反向边界段)
2.7 🔴 **接"上次的活"先看记忆文件修改时间**;另一会话可能几分钟前刚推翻我的结论 → [详](feedback_parallel_sessions_check_first.md)
2.8 🔴🔴🔴 **老板给的词按他的字面做满,不许自己缩窄定义再报"全部完成"**;拿不准边界先问,别在报告里用对着我私自定义说的"全部/所有/都" → [详](feedback_dont_assume_requirements.md)(同文件「缩窄定义」段)
3. 🔴 **没实地用过不下判断**;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md)
3.2 🔴 **写入被拒先原样重试一次再说**,大量是瞬时的;别把"这条命令能不能发"退回给老板(方向性选择照旧问) → [详](feedback_retry_before_escalating.md)

3.5 🔴🔴🔴 **「前台有没有X」只认商家端 config 接口,admin config 不是前台真值**(07-30 实证:admin 29 行业 / 前台 22)。**新文档与旧文档冲突时,一律以最新为准并覆盖旧记录** → [详](reference_thinknova_frontend_truth.md)

## L1 · 改配置/提示词前
4. 🔴 **先查字段读取图**:拉一条真实任务 input,确认目标字段真在里面 → [详](reference_thinknova_prompt_fields.md)
4.5 🔴 **台词出问题先查 visualHint** → [详](feedback_visualhint_leaks_into_lines.md)
4.7 🔴🔴🔴 **关键规则一律前置(07-30 老板定为通则)**:提示词一旦过长,后置规则就不被采集——50ml 复发(中段)、黑场失效(91%位置,置顶后网格零帧,两模型两单实证)都是同一个病。写任何长提示词:关键规则放头部,尾部只放次要修饰 → [详](project_thinknova_0729_screenwriter_stack.md)
4.8 🔴 **查"有没有某能力"要读结构化字段(`capability`),不许拿 code/name 做正则猜** —— 07-29 我靠名字正则得出「没有 TTS 模型」,实际有 4 个(text_to_speech 2 + voice_clone 2),整条推理链作废
5. 🔴 **指派式 > 禁令式**;必须禁止时,禁令后面立刻跟替换项 → [详](feedback_directive_over_prohibition.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 只证明写进库;烧单看见新文案才算上线 → [详](feedback_evidence_standard.md)
7. **i2v 4096 字节硬顶**,超出静默截断且仍显示成功;改后必量字节 → [详](reference_thinknova_prompt_architecture.md)
8. **范围边界必写反向**:附"作用域仅X、不碰Y"+双向验收 → [详](feedback_scope_boundary_explicit.md)
8.5 🔴 **动"前端会读的字段"先改一条验,别一次铺满** → [详](project_thinknova_dingdian_koubao.md)
8.6 🔴🔴 **加行业/加场景先翻技术文档**;加新场景必须技术把它注册进合法枚举,否则后台保存时被剥离→商家建单500 → [详](project_thinknova_brand_product_industry.md)
8.7 🔴 **建单500 诊断法·别猜**:admin GET 拿全量真值 → 隔离实验换维度 → 找唯一缺键 → [详](project_thinknova_brand_product_industry.md)
8.8 🔴🔴 **`businessUi` 子树改不进 textarea**:后台弹窗按自己的表单内部状态回写 businessUi 整块,textarea 里的改动被**静默丢弃且回执照报"已保存"**(07-29 实证)。要改语言/选项组只能人工在界面上点 → [详](reference_thinknova_config_powers.md)

## L2 · 烧单核验时
8.9 🔴🔴 **烧单前必报客户视角五要素**(行业/场景/案例/补充信息原文/要验证的画面与台词);测试单不报备=老板眼里的假事故(07-30 实证) → [详](feedback_burn_report_format.md)
9. 🔴 **逐帧通看**(抽帧拼联系表);单帧/播放器截图 = 假结论 → [详](feedback_evidence_standard.md)
10. **变量做满再烧单**;没补穿不许下模型结论 → [详](feedback_prompt_first_then_test.md)
11. **证据成对**:该单真实输入 ↔ 真实输出 + 任务号 → [详](feedback_evidence_standard.md)

## L3 · 给技术发文档前
12. 🔴 **只发技术才能处理的**;发之前逐条自验"我自己能不能改"
13. 🔴 **9段规范**;事实/判断/期望分离,禁把推测写成根因,一份最多3个独立问题 → [详](reference_tech_doc_submission_spec.md)
14. **发文前 7 条自检** → [详](feedback_tech_doc_checklist.md)
15. **发出即冻结**;新内容走增量文件(追加必须明说追加了哪节) → [详](feedback_tech_doc_checklist.md)(同文件"发出之后"段)

## L4 · 汇报沟通时
16. **每轮说清"验收什么 + 做了什么"**;未验收项累积不丢,做完先自验再通知 → [详](feedback_communication_principles.md)
17. **说重点 / 有据质疑 / 别奉承 / 追根因不打补丁 / 先讨论再操作** → [详](feedback_communication_principles.md)
18. **要老板拍板的用 plan 模式结构化问**,不散落正文 → [详](feedback_questions_via_plan_mode.md)
19. **数据新鲜度**:别贴"过期"标,也别埋雷 → [详](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反 = 事故)
20. 🔴 密钥不外发、不打印、不进任何 git 仓库
21. 🔴 禁 `taskkill /IM python`,按 PID/端口精准杀 → [详](feedback_kill_python_scope.md)
22. 🔴 线上 config = 唯一真值,禁种子覆盖;改前必验框身份 + 金额
22.5 🔴 **config 是前端/编剧的契约**:结构/字段/新字段一律交技术,我只碰纯文本字段 → [详](feedback_dont_edit_prod_config_structure.md)
22.7 🔴🔴 **上下文只有一个杠杆:减少往返次数**(实测 1758 次调用×中位数1052 啃满,**没有单一元凶**;判断原因一律读 usage 字段,别拿 jsonl 字符数当依据)。一段 JS 干完一整套只回一行摘要;后台读文字不截图;证据图走 ffmpeg 联系表 → [详](feedback_context_budget_discipline.md)
23. **记忆只留当前状态**,过时的覆盖删除,不堆矛盾层 → [详](feedback_memory_keep_current.md)
24. **老板发的提示词当天归档** → [详](reference_prompt_library.md)

---

# 用户与沟通
- 🔴 [共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — 开工 pull+读信箱,收工 push
- [用户画像](user_profile.md) — 跨境电商 BD/运营,新加坡;TikTok 达人 SaaS + ThinkNova 双线
- [文件放哪](feedback_file_placement.md) — 桌面只放要看的成片/成图

# ThinkNova(实体店内容 SaaS)
### 动手前必背
- 🔴🔴 [商家端=前台真值 + 行业开关 + 时长/输出类型改不了](reference_thinknova_frontend_truth.md) — **下"前台有没有"结论前必读**;含 07-30 我造成的 16 条案例不可见事故
- 🔴🔴 [技术文档档案索引 = 唯一真值](reference_thinknova_tech_docs_index.md) — **改任何 config 字段第0步**;顶部有「口径速查」5 条。**07-29 逐字回源核过**:`i2vReferenceStrategy` **默认且推荐 = `panel_crop`(线上已对齐)**、案例级可配且优先于全局;`deliveryPostProcess` **只有 Agent 全局无案例级**;场景可锁模型;时长 5~30 秒由模型能力 JSON 定默认;**grok 单参 = 用户参考图必然进不去,文档明写是设计如此**;**文档说"运营可维护" ≠ 我改得进去(businessUi 见铁律 8.8)**
- 🔴🔴 [模型台账 + 时长映射](reference_thinknova_multiref_model.md) — **动模型/时长前必看**;含两模型定位定案
- 🔴 [提示词字段读取图](reference_thinknova_prompt_fields.md) — **改提示词第一查**:谁读得到哪个字段
- 🔴🔴 [场景提示词/选项规则/案例写入路由](reference_thinknova_option_scene_rules.md) — **改场景指引或出镜景别选项前必看**;场景规则的活路径是 `promptComposer.screenwriter.systemPrompt` 查表(`promptAssembler.scenePrompts` **烧单实证不喂本编剧**),`promptComposer.optionRules` 有 opsEditable 镜像必须双写,`businessOptionPrompts` 是死的;案例单条 PUT 路由可绕开 businessUi 静默丢弃;**`product_only` 不等于无人**
- 🔴🔴🔴 [编剧层现状:没台词根因+omni中文边界+规则栈顺序](project_thinknova_0729_screenwriter_stack.md) — **抱怨「没台词/台词差」第0步**;整单没台词 = 编剧模型 461 挂→`source:local_fallback`→兜底模板写死无口播(中英一起没,不是提示词问题);omni 中文只崩「数字单位」和「四字紧凑短语」其余念得对;systemPrompt 规则**放中后段会被挤掉,必须置顶**
- 🔴 [两条管线完整流程](reference_thinknova_pipeline_flow.md) — 海报4步/视频6步
- 🔴 [提示词改造架构](reference_thinknova_prompt_architecture.md) — 三层职责 + 4096 字节纪律
- 🔴 [Grok 审核红线实测](reference_grok_content_policy.md) — 红线是组合不是敏感词
- [配置权限地图](reference_thinknova_config_powers.md) — 哪些 config 键我能改
- [路径接口](reference_thinknova_paths.md) — 域名/API/存储/环境坑

### 现行状态
- 🔴🔴 [字节手术 + 无台词开关 + 模型×语言](project_thinknova_0729_byte_surgery.md) — **动 i2v 提示词/查 4096/做无台词/选 omni-grok 之前先看**;`scriptwriterPreset.voiceMode=none` **早就存在**(22条S14 TVC在用);omni **能说英文不能说中文**;i2v 底座两键曾自相矛盾已修;grok15s口播 4793→**3249**
- 🔴🔴 [口播缺陷链 + 裁格定案](project_thinknova_0729_koubo_defect.md) — **动口播/裁格/videoTemplate/烧口播单之前先看这条**;07-29 03:43 **全局 `i2vReferenceStrategy` 已翻 `panel_crop`(live+opsEditable 双写),启用中 103 条 `owner_speaking` 案例全部裁格**;03:49 `lineValidation.en.max`40→50 / `ja.max`85→95 已落库;**未解**=`lineValidation` 无时长维度(交技术)+ `businessUi` 改不进 textarea
- 🔴🔴 [故事板测试盘子](project_thinknova_storyboard_test.md) — **当前主线**;07-28 05:0x n=5 实测定案:grok 开场网格是**双峰(0.17s/2.9s,3:1)不是固定值**·`entranceBlackOverlay` **一直正常执行**(我"判死后处理"那条已自证推翻)·板↔片一致性 **83%**·**人物锁门店锁强、产品锁看产品可辨识度**·460 改名✅已落库并送达·**取证一律走 admin `offline-store-content/tasks/{no}`**(唯一能拿到 6宫格板图 + 供应商裸片)·**批量烧单必须串行间隔≥20秒**;07-29 在烧 5 单验一镜到底/不拉长/三锁/语速,**结论未出**
- ✅ **案例文案去重已铺完(07-30 深夜)**:草稿 508 处改动三分类合并后 **468 处/284 条落库+回读零偏差+前台送达验证**(40 处与当天定向改写冲突主动跳过,20 语种实例线上已不存在);**prefill 同晚升级**:8 个跨行业模板组 93 条占位改「要事实的问句+行业示例」(6语),前台实测送达。铺量配方=`GET reference-cases/{id}` 响应头拿 `x-csrf-token` → admin 域(robots.txt 轻页防冻)PUT;大 JSON 灌浏览器走本地 CORS 服务器(须答 OPTIONS/私网预检);**商家端 reference-cases 列表接口忽略 industryId 参数,别拿它下行业结论** → 见 [案例缺口双查法](feedback_case_gap_dual_check.md) / [片型体系](project_thinknova_film_types.md)
- 🔴🔴 [片型体系](project_thinknova_film_types.md) — 治"视频大差不差";**620条已全量铺完(07-26 05:00,0失败)+601条预设铺完(07-27)**;剩下的是**烧验**:7个片型未烧验(空间漫游/氛围仪式/产品英雄/人物讲述/演示讲解/生活纪实/明快陈列)
- 🔴 [品牌产品行业 + 广告TVC场景](project_thinknova_brand_product_industry.md) — S14 已上线;含建单500 排查法
- 🔴 [定点口播/纯口播线](project_thinknova_dingdian_koubao.md) — 直销 Atomy 第一用户
- 🔴 [国内营销线](project_thinknova_marketing.md) — V式/X式内容;待办=新小红书+新脚本
- 🔴 [定价 + 推广大使](project_thinknova_pricing_ambassador.md) — 海报6/视频60;07-27 定价公式已定案
- 🔴 [HyperFrames 视频生产线](reference_hyperframes_production.md) / 🔴 [老板音色克隆生产线](reference_voice_clone_pipeline.md)
- [实体店两个 Agent(工程主线)](project_thinknova_offline_agents.md) — 三把锁已上线;CTA 未选仍强加召唤=未解
- [扫码发布深链配置](reference_thinknova_publish_schemes.md) — 四平台已真机验证

### 内容与产品规矩
- [北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) / [内容工具不做合规](feedback_thinknova_content_not_compliance.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — **建任何案例前必读**;目标用户是完全不懂的人,绑死品类的案例他不知道怎么用;已有的算了,新建的必须过 3 条自检
- [案例缺口双查法](feedback_case_gap_dual_check.md) / [小红书交付规矩](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md)

# Compass / TikTok 达人线（当前休眠，未推进）
- [Compass 现行状态 + 14 条待办](project_compass.md) — 路径/启动/Partner API/数据坑全在里面;历史见 archive/compass_history_to_0729.md
# 其他
- [新加坡鞋包提案](project_sg_footwear_proposal.md) / [小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md)
