# 铁律 · 按触发时机分层(漏的原因是"该用时没想起来",所以按什么时候用来排)

## L0 · 每次开口/动手前(最高频)
1. 🔴 **时间先查再说**:系统只给日期不给时刻,要判断"现在/多久前"先跑 `date` → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**:模糊回复先确认再动手;别把自己的推测当用户指令 → [详](feedback_dont_assume_requirements.md)
3. 🔴 **没完全了解前不下判断**:先实地用过看全貌;接口通≠功能通必实机 → [详](feedback_understand_before_judging.md)

## L1 · 改配置/提示词前(2026-07-22 一晚押错三次)
4. 🔴 **先查字段读取图**:哪个字段被编剧/生图/i2v 读取,改之前先拉一条真实任务 input 确认目标字段在里面 → [详](reference_thinknova_prompt_fields.md)
4.5 🔴 **台词出问题先查 visualHint**:「台词画面同频铁律」会把画面词拉进台词;visualHint 绝不写「台词…」开头的句子 → [详](feedback_visualhint_leaks_into_lines.md)
5. 🔴 **指派式 > 禁令式**:「第2格拍地标全景」有效,「绝不拍册子」无效;必须禁止时禁令后面立刻跟替换项 → [详](feedback_directive_over_prohibition.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 + API 回读只证明写进数据库;必须再烧一单拉真实 input/提交串,看见新文案才算"已上线" → [详](feedback_evidence_standard.md)
7. **i2v 4096 字节硬顶**:超出静默截断且任务仍显示成功;改 videoTemplate 后必量提交串字节+数镜头数 → [详](reference_thinknova_prompt_architecture.md)
8. **范围边界必写反向**:数量/范围/开关类需求只写正向会串进共用链路;必附"作用域仅X,不碰Y"+双向验收 → [详](feedback_scope_boundary_explicit.md)

## L2 · 烧单核验时
9. 🔴 **核验必须逐帧通看**(抽帧拼联系表);单帧/播放器截图=假结论 → [详](feedback_evidence_standard.md)
10. **变量做满再烧单**:提示词/配置没补穿,不许下模型结论;改前做满,改后验一 → [详](feedback_prompt_first_then_test.md)
11. **证据成对**:该单真实输入↔真实输出+任务号;来源未核实材料不当证据 → [详](feedback_evidence_standard.md)

## L3 · 给技术发文档前
12. 🔴 **只发技术才能处理的**:发之前逐条验"我自己能不能改";2026-07-22 曾一稿五节被自己重验砍掉三节
13. **五段格式**:正确的样子/现在的样子/怎么复现/为什么判定是问题/要求二选一+每项必须回复 → [详](feedback_problem_report_format.md)
14. **发文前 7 条自检**(排序对定调/五段格式/证据合格/复现可执行/零修辞/不打架/版本唯一) → [详](feedback_tech_doc_checklist.md)
15. **发出即冻结**:新内容走增量,追加原文档须明确告知 → [详](feedback_tech_doc_delta_delivery.md)

## L4 · 汇报沟通时
16. **每轮汇报"验收什么+做了什么"**;做完先自己验收真实结果再通知 → [详](feedback_handoff_acceptance.md)
17. **说重点/有据质疑/别奉承** → [详](feedback_compass_discussion.md)
18. **需要老板拍板的问题用 plan 模式结构化问**,不散落正文 → [详](feedback_questions_via_plan_mode.md)
19. **数据新鲜度**:自信展示别贴"过期"标,也别埋雷 → [详](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反=事故)
20. 🔴 密钥不外发不进聊天不打印不进任何 git 仓库
21. 🔴 禁 `taskkill /IM python`,按 PID/端口精准杀 → [详](feedback_kill_python_scope.md)
22. 🔴 线上 config = 唯一真值,禁种子覆盖;改前必验框身份+金额(定价曾被 config 覆盖)
23. **记忆只留当前状态**,过时内容覆盖删除,不堆叠矛盾层 → [详](feedback_memory_keep_current.md)
24. **老板发的提示词参考当天归档**(曾丢 3 次) → [详](reference_prompt_library.md)

---

# 用户与沟通
- 🔴 [Reference: 共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — D:\SamsoData\Documents\AgentMemoryVault;**开工 git pull+读总览和信箱,收工更新总览+push**;双营销线(海外=Codex/国内=本机)
- [User profile](user_profile.md) — 跨境电商 BD/运营,新加坡市场;TikTok 达人 SaaS + ThinkNova 双线
- [Feedback: 文件放哪](feedback_file_placement.md) — 桌面只放要看的成片/成图,文档进 02_交付内容

# ThinkNova(实体店内容 SaaS)
### 动手前必背
- 🔴 [Reference: 提示词字段读取图](reference_thinknova_prompt_fields.md) — **改提示词第一查**:编剧只吃 case.visualHint + sellingPoints全文 + systemPrompt;industryPrompts 编剧读不到只进生图;**opsEditable 整层只读(PUT 静默丢弃,已发技术卡)**
- 🔴 [Reference: 两条管线完整流程](reference_thinknova_pipeline_flow.md) — 海报4步/视频6步;动任一环前必背
- 🔴 [Reference: 提示词改造架构](reference_thinknova_prompt_architecture.md) — 三层职责+海报视频分家;4096字节纪律;先保成功率再谈效果
- 🔴 [Reference: Grok审核红线实测](reference_grok_content_policy.md) — **红线是组合不是敏感词**(物体正对镜头+情绪紧绷才拒,单独任一项都过);换词无用;中医忍痛表情实证能过
- [Reference: 配置权限地图](reference_thinknova_config_powers.md) — 能改的 config 键 vs 改不动的;能自改的自己改完再说话

### 现行状态
- [项目:实体店两个Agent(工程主线)](project_thinknova_offline_agents.md) — 视频615案例/海报830;三把锁(人/商品/门店)+无参考图分支+台词口语+台词非字幕已上线;**CTA未选仍强加召唤=唯一未解**
- 🔴 [项目:营销拉新线](project_thinknova_marketing.md) — 内容铁律+分工(Claude成片/老板口播/Codex海外)
- 🔴 [Reference: HyperFrames视频生产线](reference_hyperframes_production.md) — 口播→转写→抠像→合成→交付+关键坑
- [项目:定价+推广大使](project_thinknova_pricing_ambassador.md) — 海报6/视频60;中国兑换码¥108=2000分
- [Reference: 路径接口](reference_thinknova_paths.md) — 域名/API/存储/环境坑

### 内容与产品规矩
- [Feedback: 配置改动规矩](feedback_thinknova_config_edit_rule.md) — 已授权直接改线上;别改错 key
- [Feedback: 北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) — 客户不动脑做出"他自己的内容"
- [Feedback: 内容工具不做合规](feedback_thinknova_content_not_compliance.md) — 吸引导向;只守未成年底线
- [Feedback: 案例缺口双查法](feedback_case_gap_dual_check.md) — 矩阵完整性+外部形态对标
- [Feedback: 小红书内容交付规矩](feedback_xiaohongshu_content_workflow.md) — 每条含"照着填"清单
- [Feedback: 烧单分工](feedback_thinknova_burn_division.md) — agent建单老板做/直连测试我做/封面图我给提示词Codex做

# Compass / TikTok 达人线
- [项目:KOL Compass(接管系统)](project_kol_compass.md) — 对外 SaaS,Codex 开发,5175前端+8015后端
- [项目:tiktok-creator-tool(现行)](project_tiktok_creator_tool.md) — 单租户内部工具,将被 Compass 替换
- [项目:迁移路线+关键决策](project_compass_migration.md) / [核心方向](project_compass_core_direction.md) / [出单潜力分](project_compass_scoring.md)
- [项目:上线接真商家现状](project_compass_golive.md) / [待办](project_compass_backlog.md) / [采集器](project_compass_harvester.md)
- [Reference: 路径+启动](reference_compass_paths.md) / [TikTok Partner API 事实](reference_tiktok_partner_api.md) / [达人库数据坑](project_compass_data_pitfalls.md)
- [Feedback: 仓库使用节奏](feedback_repo_rhythm.md) — 最差一天一提交;密钥不提交

# 其他
- [项目:新加坡鞋包提案](project_sg_footwear_proposal.md) — 12万/8模块/7平台;含无头Edge出PDF复用法
- [项目:小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md) — 一周3次,主攻逻辑
