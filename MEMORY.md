# 🔴 铁律(动手前过一遍,历史上都犯过错)

1. **取证**:🔴**核验成片必须逐帧通看(抽帧拼联系表),单帧/播放器截图=假结论**;改配置必拉最终提交串验(写入≠生效);证据=该单真实输入↔真实输出成对+任务号;来源未核实材料不当证据 → [详](feedback_evidence_standard.md)
2. **判断**:没完全了解前不下判断,先实地用过看全貌;逐字复现=硬编码/示例照搬,措辞变=模型行为;接口通≠功能通必实机点击 → [详](feedback_understand_before_judging.md)
3. **指令**:提议≠指令,模糊回复先确认再动手;别把我自己的推测当用户指令 → [详](feedback_dont_assume_requirements.md)
4. **实测**:变量做满再烧单——提示词/配置没补穿,不许下模型结论;改前做满,改后验一 → [详](feedback_prompt_first_then_test.md)
5. **文档**:给技术的文档发出即冻结,新内容走增量(追加原文档须明确告知);给技术=Codex任务卡零修辞 → [详](feedback_tech_doc_delta_delivery.md)
5b. **提问题格式**:正确的样子/现在的样子/怎么复现/为什么判定是问题/要求二选一(给权限或你改)+每项必须回复 → [详](feedback_problem_report_format.md)
5c. **技术文档发文前强制自检 7 条**(排序对定调/五段格式/证据合格/复现可执行/零修辞/不打架/版本唯一)——连续判断错误后立规,一条不过不许发 → [详](feedback_tech_doc_checklist.md)
5d. **范围边界必写反向**:数量/范围/开关类需求只写正向("海报出N张")会串进共用调用致回归(海报多张串到视频分镜图);必附"作用域仅X,不碰Y(共用链路兄弟场景)"+双向验收 → [详](feedback_scope_boundary_explicit.md)
6. **验收**:每轮汇报"验收什么+做了什么";做完先自己验收真实结果再通知 → [详](feedback_handoff_acceptance.md)
7. **记忆**:只留当前状态,过时内容覆盖删除,不堆叠矛盾层 → [详](feedback_memory_keep_current.md)
8. **环境**:禁 taskkill /IM python(按 PID/端口精准杀);密钥不外发不进聊天不打印;ThinkNova 线上 config=唯一真值禁种子覆盖、PUT 改、video 双写 opsEditable 镜像
9. **提问**:需要老板回答/拍板的问题一律 plan 模式结构化问,不散落正文 → [详](feedback_questions_via_plan_mode.md)
10. **提示词参考**:老板发的参考当天归档进提示词参考库(曾丢 3 次),评估后才吸收进规则手册 → [详](reference_prompt_library.md)

# 用户与沟通
- 🔴 [Reference: 共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — D:\SamsoData\Documents\AgentMemoryVault;**开工 git pull+读总览和信箱,收工更新 ThinkNova/_memory/平台状态总览.md+push**(状态只写 vault 不进私有记忆);双营销线命名法(海外=Codex/国内=本机会话);Codex 已跨机闭环;技术问题清单在总览第四节
- [User profile](user_profile.md) — 跨境电商 BD/运营,新加坡市场;TikTok 达人 SaaS + ThinkNova 双线
- [Feedback: Compass 讨论沟通风格](feedback_compass_discussion.md) — 说重点/有据质疑/别奉承
- [Feedback: 数据新鲜度呈现立场](feedback_data_freshness_framing.md) — 自信展示别贴"过期"标,也别埋雷;别过度诚实
- [Feedback: 文件放哪](feedback_file_placement.md) — 桌面只放要看的测试成片/成图,文档进项目子目录(02_交付内容等)

# ThinkNova(实体店内容 SaaS)
- 🔴 [Reference: 两条管线完整流程](reference_thinknova_pipeline_flow.md) — 海报4步/视频6步(填资料→上传参考图→文生文→参考图+文生图=分镜图→裁格首帧→首帧+分镜图+参考图+文生视频);动任一环前必背;当前:首帧✓/分镜图✗/参考图未测。老板2天对齐后骂"你自己都不知道流程"立此
- [项目:实体店两个Agent(工程主线)](project_thinknova_offline_agents.md) — ✅P1裁格+P2选项进编剧都已修(生产实证);✅英文=lineValidation 11语言分口径已上线(EN 25-40词实证过);gen兜底案例49条已下架;1.0参考图403未闭环;改config走新版json-editor三步法(对象级+parse校验+PUT200,裸文本正则已禁,详见vault操作手册§8)
- 🔴 [项目:营销拉新线](project_thinknova_marketing.md) — 当前态+记分板+内容铁律(五触发/点名老板/零品牌/去导流/大字报打直球/清单不操作);Claude做成片,老板录口播+发+配音,Codex海外文案+封面
- 🔴 [Reference: HyperFrames视频生产线](reference_hyperframes_production.md) — 口播→转写→抠像→小蓝式合成→交付全流程+关键坑(嵌套视频冻结/字体local/预缩放)+素材库台账
- [项目:定价+推广大使](project_thinknova_pricing_ambassador.md) — 计费=服务费+模型价拼装(07-14全面调价:海报6/视频60/直连图6·i2v45已上线);中国兑换码¥108=2000分;佣金档位、成本毛利
- [Reference: 路径接口](reference_thinknova_paths.md) — 域名/API/存储/Stitch/环境坑
- 🔴 [Reference: 提示词改造架构](reference_thinknova_prompt_architecture.md) — **动任何生图/i2v/编剧提示词前必背**:两铁律(自包含/视频场景零字幕)+三层职责+海报视频分家双向边界+**07-19现行态:按秒镜头清单(六宫格描述法已废,板到不了grok)/lineValidation 11语言/到店沉默标准(老板07-20:提示词不教不禁不提,自然偶发OK每条必现=错;禁词自检实证无效已撤,现役=选项文案只喂画面/输出零标签/英文纯净三铁律,详见vault总览14)/去高饱和原相机直出/复读=废片/Luna现役;**07-20晚:先保成功率再谈效果(老板)——4096字节截断静默不报错必量提交串、videoTemplate已瘦到436字砍掉grok做不到的硬切类规则、六宫格整板实测能按格推进(推翻裁格旧依据,仅漏开头0.25秒)、人脸配额压审核待验**
- [Reference: 配置权限地图](reference_thinknova_config_powers.md) — **提需求前必查**:我能改的全部config键 vs 改不动的(实证);能自改的自己改完再说话;说明书陷阱(单语言示例/跳变镜头毒词/并集机制);07-20:行业=建单现选非存储资料、S10教程入口已启用、新行业id全套自配实证(知识普及/住宿空间)
- [Feedback: 配置改动规矩](feedback_thinknova_config_edit_rule.md) — 已授权直接改线上;别改错 key
- [Feedback: 内容工具不做合规](feedback_thinknova_content_not_compliance.md) — 吸引导向;只守未成年底线
- [Feedback: 小红书内容交付规矩](feedback_xiaohongshu_content_workflow.md) — 每条含"照着填"生图清单+直接写进小红书内容.md不散聊天
- [Feedback: 北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) — 客户不动脑做出"他自己的内容";按钮全预设;提示词以我为主
- [Feedback: 案例缺口双查法](feedback_case_gap_dual_check.md) — 矩阵完整性+外部形态对标;商家图片五用途框架

# Compass / TikTok 达人线
- [项目:tiktok-creator-tool(现行系统)](project_tiktok_creator_tool.md) — 单租户内部工具,最终被 Compass 替换
- [项目:KOL Compass(接管系统)](project_kol_compass.md) — 对外 SaaS,Codex 开发,5175 前端+8015 后端
- [项目:迁移路线+关键决策](project_compass_migration.md) — 服务商架构+全 API+决策辅助
- [项目:核心方向(竞品验证后)](project_compass_core_direction.md) — 建联前分析+建联后管理是核心;不跟数据派拼库
- [项目:出单潜力分算法+档位](project_compass_scoring.md) — 6维度权重+档位(用户拍板)
- [项目:待办/产品方向](project_compass_backlog.md) — 达人评估维度、竞品达秘,详见 docs/BACKLOG.md
- [项目:上线接真商家现状](project_compass_golive.md) — 阻断项,交接手册 docs/DEPLOY_GO_LIVE.md
- [项目:内部达人库采集器](project_compass_harvester.md) — harvester/;坑=重载必F5
- [Reference: Compass 路径+启动](reference_compass_paths.md) — 路径/端口/git
- [Reference: TikTok Partner API 事实](reference_tiktok_partner_api.md) — 真实 quota/端点/文档 URL
- [Reference: 达人库数据坑](project_compass_data_pitfalls.md) — 老库字段写反/大小写重复/列表数=当前市场
- [Feedback: 仓库使用节奏](feedback_repo_rhythm.md) — 记忆常新/最差一天一提交/密钥不提交
- [Feedback: 重启 backend 禁 taskkill /IM python](feedback_kill_python_scope.md) — 按 PID/端口精准杀

# 其他
- [项目:新加坡鞋包提案](project_sg_footwear_proposal.md) — 桌面报价单+功能设计,中英双语HTML→PDF;当前12万/8模块/7平台+App商城;含无头Edge出PDF复用法
- [项目:小孩数学网课](project_kid_math_tutoring.md) — 一周3次、主攻逻辑、HTML 课件(桌面)
- [Reference: 数学网课课程总表](reference_kid_math_roadmap.md) — 逐课主题路线
