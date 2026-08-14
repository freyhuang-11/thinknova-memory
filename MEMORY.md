# 铁律 · 按触发时机分层(按"什么时候用"排;漏 = 该用时没想起来)
> 这里只放**触发条件 + 一句动作**。案例、字段路径、复盘全在链接文件里,该用时打开。
> 📍 2026-07-31 里程碑:编剧战役收官。📍 2026-08-08:立行动闸门,规矩改成"先产出再动手"。

## 🔴🔴🔴 L-1 · 唯一入口:[行动闸门](feedback_action_gates.md)
**动手之前先过闸,每道闸要求先输出一个可检查的产物,输出不出来就不许往下走。**
闸1 现状源(读了什么/现状是什么) → 闸2 字节账(Δ与挤掉了谁) → 闸3 爆炸半径(命中几条) → 闸4 attemptCount(不是看成片) → 闸5 单条验证+老板过目才许铺开。
**通则:先读后动,先验后铺。** 下面 L0-L5 是细则,闸门是调用它们的时机表。

## 🔴🔴🔴 L-0.5 · 动手之前先问「有没有现成的 skill」
**34 个 skill 的路由表 → [什么场景用什么 skill](reference_skills_routing.md)**(老板 08-11:「你明明有那么多 skills,你知道什么时候用什么嘛」)。
三条铁规矩:①**`hyperframes` 是做任何视频/动画的强制入口**(我一直手搓 ffmpeg,坑本来不用踩)②`cheat-score-blind` 是内部 sub-agent,主对话绝不许调 ③组合拳顺序不能乱(写视频稿=video-script-style→high-retention-hook→hkrr-clock→hurricane-shot-prompt)。
🔴 08-11 两个跟头都是没查表栽的:封面手搓、选题受众拍脑袋(cheat-persona/seed/learn-from/trends 全没用)。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 **权威源(技术文档/线上真值/代码)> 我的记忆**;下关键结论前回源核对,实验结论标「实测·待核」带任务号、不外推 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断"现在/多久前"**先跑 `date`** → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**;模糊回复先确认再动手 → [详](feedback_dont_assume_requirements.md)
2.5 🔴 **例程内能自己拍板的自动跑**,别每天拿老问题问老板 → [详](feedback_dont_assume_requirements.md)(同文件反向边界段)
2.7 🔴 **接"上次的活"先看记忆文件修改时间**;另一会话可能几分钟前刚推翻我的结论 → [详](feedback_parallel_sessions_check_first.md)
2.8 🔴🔴🔴 **老板给的词按他的字面做满,不许自己缩窄定义再报"全部完成"**;拿不准边界先问 → [详](feedback_dont_assume_requirements.md)(「缩窄定义」段)
2.9 🔴🔴🔴 **「某条线几天没落库/独立通道连续零变化」都不许推出「他没干活」**;先排查同步链路(git分叉/DNS/push失败),区分不了就如实写区分不了,别升级老板。**已犯两次**:08-05「库里没文件→暗示没跑」冤枉 Codex 连错两天;08-14「公开博客接口四次快照 total=6→暗示倾向没做」,结果 08-13 01:55 他一次发 15 篇+回填 4 张挂 14 天的封面,**距我 08-13 例程只差 13 分钟**。**快照证明那一秒的状态,不是趋势也不是意图——写到"截至X时仍是N"就句号,别接"所以只剩没做"** → [详](feedback_silence_is_not_evidence.md)
3. 🔴 **没实地用过不下判断**;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md)
3.1 🔴🔴🔴 **config 里的 placeholder/说明文案 ≠ 实际行为**;对外说任何产品能力前必须有 A/B 实测任务号。08-11 血案:placeholder 写「写台词会照着念」,实测**光填进去平台会改写**,要加一句「一个字都别改」才一字不差,而老板已照错稿录完片 → [详](feedback_placeholder_is_not_behavior.md)
3.2 🔴 **写入被拒先原样重试一次再说**;别把"这条命令能不能发"退回给老板。**唯一硬墙=改我自己的 settings.json 权限段(classifier 死拦,也不许绕,只能给老板贴;08-02 已贴好 36 条 allow)** → [详](feedback_retry_before_escalating.md)
3.5 🔴🔴🔴 **「前台有没有X」只认商家端 config 接口,admin config 不是前台真值;新文档与旧记录冲突以最新覆盖** → [详](reference_thinknova_frontend_truth.md)

## L0.8 · 🔴🔴🔴 预设即产品(老板 2026-08-13 定调)
**「商家 90% 以上会用系统默认设置生成内容,所以我们要提前把很多工作做进预设,这是我们系统的意义。」**
→ 推论一:**验证必须走默认路径**。08-13 血案:我验剧情片时手动传 `appearanceMode:'product_store'` 覆盖了案例预设,2 单都好;而默认预设是 `product_only`,实际出片「无人物入镜」——**一部两个人的小剧场画面里一个人都没有**,五句对白全成画外音。**烧单时凡是手动传了某个 selectedOptions,就等于没验那个维度的默认值。**
→ 推论二:**预设错 = 全量事故**。案例预设跨行业/跨场景照抄时,`appearanceModePreset`/`visualFocusPreset`/`videoStylePreset`/`paceLevelPreset` 是真进提示词的(prefill 只是灰字提示不影响出片)。08-13 那 23 条剧情片的病灶在**源模板本身**,11 条复制品把错误等比放大。**改的时候必须连源模板一起改。**
→ 推论三:**新建案例先问"默认值对不对",再问"选项全不全"**。

## L1 · 改配置/提示词前
4. 🔴 **先查字段读取图**:拉一条真实任务 input,确认目标字段真在里面 → [详](reference_thinknova_prompt_fields.md)
4.3 🔴🔴🔴 **配置字段的语义(每句还是总计?目标还是边界?)不确定=先问技术,绝不凭直觉配**——lineValidation「总计」被我当「每句」配,一字之差造出电报体+连环回退+语速慢三症,烧十几单才定位 → [详](project_thinknova_0729_screenwriter_stack.md)
4.5 🔴 **台词出问题先查 visualHint** → [详](feedback_visualhint_leaks_into_lines.md)
4.6 🔴🔴🔴 **提示词≤4000字(字数),言简意赅目的明确,废话重复矛盾全删(07-31 老板通则)**;同一文档两条规则打架时模型行为不可预测,加新规则前先想清挤掉谁 → [详](project_thinknova_0729_screenwriter_stack.md)
4.7 🔴🔴🔴 **关键规则一律前置(07-30 老板通则)**;但前置救不了超长提示词——11095字时置顶也没用,**先减肥再谈位置** → [详](project_thinknova_0729_screenwriter_stack.md)
4.8 🔴 **查"有没有某能力"读结构化字段(`capability`),不拿 code/name 正则猜**
5. 🔴 **指派式 > 禁令式**;必须禁止时禁令后立刻跟替换项;「写满」类要求必须给贫料出路,否则模型拿空话注水 → [详](feedback_directive_over_prohibition.md)
5.3 🔴🔴 **微信群【多学一点】安全区**:只讲账/货/人/政策,**凡"生成文字图片视频"一律不教**(=教他们绕过我们);不要明日预告;实事须近4-6周且主角是"用AI的做生意的人";免责句必须印在卡上(卡会被单独转发) → [详](feedback_wechat_learn_safe_zone.md)
5.4 🔴🔴 **微信群=单向输出**:提问全周最多1次(周五点单日),冷场也不许加互动;「实事」只讲**实体商家用AI的事件**(主角是开店的人,不是技术),查不到就不发 → [详](feedback_group_oneway_broadcast.md)
5.5 🔴🔴 **对外文案主语是机器 = 返工**:禁「都不是人写的/AI生成的/机器做的」,一律翻成客户视角「这些都不用你想」;自贬话术全禁(平台的「AI生成」标注照勾,那是字段不是文案) → [详](feedback_customer_view_not_machine_view.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 只证明写进库;前台/烧单看见才算上线 → [详](feedback_evidence_standard.md)
7. 🔴🔴🔴 **i2v videoPrompt 4096字节硬顶=死规矩(08-08 老板重申)**:videoPrompt=videoTemplate(939B)+**编剧自写的 cells**;撑爆它的是 cells 不是固定模板。**改任何进 videoPrompt 的字段只许减字,必须加就先删等量**;加字前要能答"挤掉了谁"。**✅ 改之前必读拼装后全文:`GET /admin/api/v1/ai-tasks/{task_no}` → `output.compiledPlan.videoPrompt`(必须用 task_no,数字id返null);同一响应的 `attemptTrace[]` 有每次报错原文。旧写"没接口=蒙眼飞行/待发技术卡"作废** → [详](feedback_prompt_change_hard_rules.md)
7.1 🔴🔴 **案例 visualHint 里一个字都不许写声线/语调/节奏**:实证同案例三版(原状重试1有台词/加声线重试3无台词/纯指派重试4无台词)——换气停顿类指令→编剧压短台词→撞 lineValidation 下限→连环重试→空台词。**声线节奏归全局 videoTemplate【口播节奏】段** → [详](feedback_prompt_change_hard_rules.md)
7.2 🔴🔴 **烧单是验证手段不是探索手段**:动手前先读现状源(screenwriter-stack→koubo-defect→线上config),08-08 全天跳过这步走了三条弯路(声线/镜头/架构分层记忆里本来就有) → [详](feedback_prompt_change_hard_rules.md)
8. **范围边界必写反向**:附"作用域仅X、不碰Y"+双向验收 → [详](feedback_scope_boundary_explicit.md)
8.5 🔴 **动"前端会读的字段"先改一条验,别一次铺满** → [详](project_thinknova_dingdian_koubao.md)
8.53 🔴🔴 **案例名实一致:场景+案例名承诺的=成片生成的**;交付不了就改名,不许挂着做不到的承诺;烧单验收多一问"这是不是标题说的那个东西" → [详](feedback_case_name_matches_output.md)
8.55 🔴🔴🔴 **改一个案例只许影响这一个案例**:案例问题只在案例层解;根因在全局模板时做**显式开关**(全局原句一字不改+窄口径条件,暗号埋进目标案例),动全局前先扫库量爆炸半径,命中>1就收窄;改完烧对照单证明没带偏 → [详](feedback_case_change_no_blast_radius.md)
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
- 🔴 [共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — 开工 pull+读信箱,收工 push **并验证远端真收到**(08-08 事故:例程产物躺本地 2 天,指令没送到 Codex)
- [用户画像](user_profile.md) — 跨境电商 BD/运营,新加坡;TikTok 达人 SaaS + ThinkNova 双线
- 🔴🔴🔴 [文件放哪](feedback_file_placement.md) — **桌面=`D:\SamsoData\Desktop`,C盘桌面是假的(已三犯:07-12/07-28/07-31,老板骂"天天乱放")**;桌面只放成片/成图,文档进视频制作平台分析子目录

# ThinkNova(实体店内容 SaaS)
### 动手前必背
- 🔴🔴🔴 [编剧层 07-31 里程碑版](project_thinknova_0729_screenwriter_stack.md) — **动编剧/长度/台词/烧验第0步·唯一现状源**:lineValidation=全片总计唯一真值(**线上真值 zh 15秒 min60/max80、10秒 min40/max48,metric=characters含标点**;旧记的62-75已作废)、systemPrompt≤4000字零数字、PHP注入、标准验收配方、战役教训六条、判读手册
- 🔴🔴 [商家端=前台真值](reference_thinknova_frontend_truth.md) — 下"前台有没有"结论前必读;**08-11 线上真值:输出语言 9 种 zh_cn/en/ja/ko/es/vi/id/ms/th 全部无 beta(技术早已做完,旧记的"6语/界面i18n待技术"作废,别再当待办报)**;**08-12 实测:成片页没有任何字幕入口(0字幕/0 track/API 无 subtitle 字段)=入口没上,别对外说"有字幕功能"**;placeholder 配置化读取链;agent 直连 PUT 解锁
- 🔴🔴 [技术文档档案索引 = 唯一真值](reference_thinknova_tech_docs_index.md) — 改 config 字段第0步;顶部「口径速查」
- 🔴🔴 [模型台账 + 时长映射](reference_thinknova_multiref_model.md) — 动模型/时长前必看;grok 做不到硬切,omni 才能(07-31 老板定论)
- 🔴 [提示词字段读取图](reference_thinknova_prompt_fields.md) — 改提示词第一查:谁读得到哪个字段
- 🔴🔴 [场景提示词/选项规则/案例写入路由](reference_thinknova_option_scene_rules.md) — 场景规则活路径=screenwriter.systemPrompt 查表;optionRules 双写;案例单条 PUT;product_only≠无人
- 🔴 [两条管线完整流程](reference_thinknova_pipeline_flow.md) — 海报4步/视频6步
- 🔴 [提示词改造架构](reference_thinknova_prompt_architecture.md) — 三层职责+4000字令+4096新语义+镜像双写
- 🔴 [Grok 审核红线实测](reference_grok_content_policy.md) — 红线是组合不是敏感词
- [配置权限地图](reference_thinknova_config_powers.md) / [路径接口](reference_thinknova_paths.md) — csrf-PUT 正解/轻页法/CORS服务器法都在 paths

### 现行状态
- 🔴🔴 [口播/裁格·格网](project_thinknova_0729_koubo_defect.md) — ✅**格网已解**(剧情片+`panel_crop`,08-12 验 2/2 零格线)。⛔ 旧记「panel_crop 出现 0 次」**作废**:真值 **123 条案例在用**(案例字段要查案例表接口,不能搜 agent config)
- 🔴🔴 [片型体系+案例库现状](project_thinknova_film_types.md) — 场景表 10 个/案例 726+861;三档定档;08-13 大整改全文在此
- 🔴 [故事板取证](project_thinknova_storyboard_test.md) / [字节手术+无台词开关](project_thinknova_0729_byte_surgery.md)(voiceMode=none 早就有,22条TVC在用) / [品牌产品+TVC场景](project_thinknova_brand_product_industry.md)(S14已上线;建单500排查法) / [定点口播线](project_thinknova_dingdian_koubao.md)(Atomy)
- 🔴🔴🔴 [国内营销线](project_thinknova_marketing.md) — **主战场 · 08-10 整条线重启**:旧内容(小红书10篇/G系列)**已全部归档**;新定位=**「一个人+AI,怎么把内容真的做出来」实录,老板出镜**;**变现分层=抖音小红书零推销引流 → 微信群转化 → 线下会成交**;接入 **cheat-on-content**(打分→盲预测→T+3复盘,rubric 换 tutorial-builder);🔴**微信群 08-11 起每天出货=全线唯一硬规定**;口诀**标签固定选题必变**(荣哥611条同选题=0赞);封面**四个锚不变风格随便变**;🔴**AI标注必勾**(不勾自动降权)
- 🔴🔴 [新加坡线下会议线](project_thinknova_sg_events.md) — **🔴首场定档 2026-08-22(周六)14:00-17:00**(Suntec Tower2 L7 + 线上同步,免费,之后每周六);台上=14点讲/15点动手/16点起自由答疑可早走;成品=`AI分享会_新加坡_v7.pptx` 21页 + 邀请函**中英12张**(带码发朋圈WhatsApp FB/无码发小红书IG);🔴🔴🔴全场主线=**「生产内容+发送内容才是核心」,禁用一切自贬话术**;🔴小红书版海报**绝不能有二维码**(放哪都判导流);台上禁说"上半场/下半场"
- 🔴🔴🔴 **微信群每日运营=全线唯一硬规定(08-10 拍板,08-11 起每天出货)** — 形态=知识卡(HTML模板渲染,**文字绝不走AI文生图**)+群文案,落款「整理·ThinkNova」必留,AI视频实事不许编;模板/样卡/7天包在 `03_工作台\群内容\`;**发送永远人工老板过目**
- 🔴🔴🔴 [小红书线现状](project_thinknova_xhs_line.md) — **写小红书前必读**:人设=给实体店做图片的人·一天一家店一篇讲完(不连载);**四稿死因**(教学腔/身份不可持续/语气滑回教);**分享vs教只差主语**(出现"你/应该/别"=返工);**封面两套语言**(vlog纯照片 vs 经营类底图+大字,我们属后者);六篇开头必须六种进入方式;底图必须走 S14 新烧,旧促销海报不能用
- 🔴🔴 [抖音封面对标](reference_douyin_cover_benchmark.md)(做封面前打开真图看,29张已存;差距=头占41.5%/元素4-9个/亮背景托暗人/**选帧**;天花板是打光不是设计) / 🔴🔴 [打分闸门与校准](reference_cheat_gates_calibration.md)(**比较两批分数前必读**:跨批不可直接比,必须夹带锚点测漂移)
- 🔴 **两把尺+四件套 skill** — 写小红书笔记用 `/xhs-note`(四柱:选题→标题→配图→文案+违禁词五级扫描,最高危=「搞钱/变现」),涨粉冷启动用 `/xhs-growth`(先囤10篇再发);写视频脚本按序调 `video-script-style`→`high-retention-hook`→`hkrr-clock`→`hurricane-shot-prompt` → [国内营销线](project_thinknova_marketing.md)
- 🔴 [定价+推广大使](project_thinknova_pricing_ambassador.md)(海报6/视频60;omni·wan·sora=3分/秒,grok系=4分/秒) / [HyperFrames](reference_hyperframes_production.md) / [音色克隆](reference_voice_clone_pipeline.md) / [两个Agent工程主线](project_thinknova_offline_agents.md)
- 🔴🔴 [竞品·引力Ai/萍萍拆解](reference_competitor_gravity_ai.md) — **探店片型第0步必读**:一镜一图vs一片一图;萍萍台词公式(钩子→第2句价格锚→短句→三连催单,催单被我们总纲禁着待老板放行);真差距=声调起伏(TTS)+切镜密度(grok不硬切)+台词结构;**omni老板定论砍掉**(中文转英语/画面字乱码/产品锁不住);A/B实测7格撞4096墙;探店案例=`food_beverage_s01_tandian`(条件式门头/固定男声/案例级黑幕/特写≤七成)
- 🔴🔴🔴 [海报线现状+P0编造事故闭环 08-10](project_thinknova_poster_video_purge.md) — 海报出问题第0步:**拒绝编造6处守卫已上线(修一处不算修完,同铁律多层各一份)**;判编造先查商家资料注入;海报烧单走 business-assets(caseId必填);837条底细/615视频克隆/123清毒;S07/S08未美图化待排
- 🔴🔴 [海报场景改造 08-03](project_thinknova_poster_scene_revamp.md) — **动海报场景/案例/styleRule 第0步必读**:场景表已整体换成美图式「渠道×版式」16场景(老板拍板);340条案例迁入S01门店海报;对照烧验3成1败(S11/S16轻内容场景被copy层海报结构压住=待技术);styleRule词表黑白名单;两线案例表独立;场景注册/批量迁移/pageSize=60/裸对象PUT配方全在文内;待办=copy层场景开关技术卡/健康医疗封面44条只用9张图待重生成/铺行业待拍板
- 🔴🔴🔴 **08-13 案例库大整改收官** — 场景表 14→10、109 条案例归位/改名/清黑话、预设修正(S11 `shotCount 1→5` 治编剧连挂、S08 统一 `customer_pickup`)、两条线 CTA 默认全取消、死库存清理、封面 696/726。**探店打卡四形态定案(达人代看=萍萍式,和剧情短片规则相反所以放 S05)** → [片型](project_thinknova_film_types.md)
- 🔴🔴🔴 **08-13 海报去重 bug 查清=服务端多槽位填充,已出技术卡 `OPS-POSTER-20260813-01`(待老板转技术)** — 商家填的 offer 被当 `price` 同时填进①`copyPlanTemplates.title="{productName}{priceSeparator}{price}"` ②`business_fact` 的价格 ③卖点数组,成品图上同一句出现 3 次;**模型没乱加,是把每个槽位都老实画了**。另挖出独立真 bug:`sellingPointOptions[].promptText`(给模型的指导语)被凑数塞进 `business_fact` 卖点=**被当成要画到图上的文案**,违反自己的「描述词围栏」,随时会爆编造。⛔ **案例 visualHint 的去重规则送不到文案模型**(文案子任务 `input.state` 里没有 caseId/visualHint)——**规则写在视觉字段却指望它管文案 = 结构性错配**。尾部「海报标题:…卖点:…CTA:…」那串**是服务端硬编码,config 里搜不到,运营改不了**。
- 🔴🔴🔴 **多参无人声 · 最终结论(08-13 受控实测)** — **图越多越不稳,提示词措辞救不了**:同案例同参数、判定口径=5句说满且中途无长断 → **2图 2/3、3图 1/3、4图 0/3**。措辞全试过(硬锁/软锁/合并成一句/完全不提/禁BGM/去音效)**没有一个能救 4 图**。⛔ 当晚我下过并被自己推翻的结论共八条(≥2就哑/门槛在4/板排第一/sfx是BGM对应物/黑边pad是元凶/人物图+场景图必哑/删字数规则害台词变差/模板感来自各司其职)——全是**单侧取样当规律** → [多参台账](reference_thinknova_multiref_model.md) [取证纪律](feedback_source_truth_first_commander.md)
  ✅ **解法=技术把 i2v 参考图上限砍到 2 张(08-13 实测生效)**:商家传 3 张、编剧仍收到 `referenceImageCount:3`,但 **i2v 实发只有 2 张**;回滚提示词后同配置连烧 2 单**全程说满 15 秒**(此前同配置 0/3)。
  🔴 **失败形态不是静音**,是**音轨被连续音乐占满**(浊音占比 80–93% 且几乎无停顿;正常说话是 40–62% 带规律停顿)——报现象别说"零人声"。
- 🔴🔴 **编剧层返回格式不稳 → 技术卡 `OPS-VIDEO-20260813-03`(待转发)**:模型返回自然语言前言或 `[]` 而非 JSON,同一单重试 4–6 次;返回被包成 `{"text":"<真JSON字符串>","progress":100}`,疑似没剥干净导致"JSON 完整却判条数不符"。**已排除我方提示词**(回滚到基线仍复现)。我方 `textModel` 只有 `temperature`,**未设 `max_tokens`**。
- 🔴🔴🔴 **08-14 线上真值(动任何提示词前先对这三个数)**:`systemPrompt` **3996** / `videoTemplate` **414(原版)** / `firstFrameTemplate` **894**。我 08-13 的四刀已全量回滚,现只保留三条经过单刀验证的:①【素材优先级】商家成句台词**一字不增删**(端到端验证:77字原话未改;短台词则原话打头再用商家自己的信息补满)②画板模板**对话剧角色区分**(同性两人靠发型+衣着颜色拉开,已验 1 单,人物参考图仍锁得住)③画板模板**同框多商品必须可辨识不同**(未烧验)。
- ✅✅ **「其他行业」= `industryId: custom` 已补齐(08-13)** — 视频10/海报16 条,每个启用场景各1条,**零空场景零缺封面零重复**(约375积分)。🔴`custom` **不在 `industryFilters` 表里**,统计行业覆盖必须单独加它。🔴**给 custom 烧样图必须显式禁行业指向 + 禁编造项目价格**(第一版没写→模型自己默认成美业还编了16个项目16个价格),**封面按版式配 `outputRatio`** → [片型](project_thinknova_film_types.md)
- 🔴 **未完待办** — ①**两张技术卡待老板转发**:`OPS-VIDEO-20260813-03`(编剧返回格式)、`OPS-POSTER-20260813-01`(海报多槽位重复);还有一张 `OPS-POSTER-20260803-02`(海报copy层场景开关)写好一直没发;②周六 08-16 海报侧 → `03_工作台\周六待处理_海报侧问题清单_2026-08-16.md`;③公告栏上线后场景改名要发第一条公告;④⚠️ 6 条案例 `prefill.offer` 写的是说明文案,烧样图前必须换真实文案;⑤🔴🔴 **成片开头 0.5 秒黑场(`entranceBlackOverlay`)绝不能去(老板 08-14 定)**——i2v 的主图就是那张六宫格分镜板,**不挡住第一帧,成片第一页就是一张拼板图**。⛔ 我曾提议去掉,理由是「格网已用 `panel_crop` 解决」——**混淆了两件事**:`panel_crop` 治的是格线跑进画面,黑场挡的是首帧本身就是板。**代价照单接受**:成片首帧必为黑 → 插 PPT/社媒抓封面都会黑。**真正该做的是给每条成片配一张非黑封面图**(抽 0.3–0.6 秒后的帧),而不是动黑场
- 🔴🔴🔴 **场景表 = 10 个(08-12 老板拍板,前台+烧单双验)** — S01商品介绍/S02活动介绍/S04信息公告/S05探店打卡/S06手艺揭秘/S07前后对比/**S08剧情短片**/S10教程避坑/S11老板出镜/S14广告大片;下架 S03/S09/S12/S13 **留作空位不删**。🔴**改场景名必须同时改 `scenes[]` 和 `businessActions` 两张表(两个 label 都进编剧)**;【场景要点】已改 **sceneId 精确匹配**;⛔`sceneRules`/`scenePrompts` 内容不进编剧但结构必须在(缺了建单500);🔴`businessScenario` 与案例 `sceneIds[0]` 对不上直接 500001 → [场景规则](reference_thinknova_option_scene_rules.md)
- ✅ **格网已解 + EMMA 结构上线(08-12)** — 规律=**第1格双人/多人中景才漏板**(特写/单人 0 中招),对话剧片型 08-10 才铺进来所以"以前没有"是真的;解法=剧情片+`panel_crop`,用**窄口径暗号「分镜推进」**避开 videoTemplate「单张实拍=一镜到底」分支(123 条在吃),全局原句一字未改;EMMA=排他锁+角色卡常驻+情绪写在 visual+时间非均分 → [口播裁格](project_thinknova_0729_koubo_defect.md)
- 🔴🔴 **语言分两层别混** — 输出语言 9 种(两侧齐);案例文案 i18n 只有 6 个界面语言,**两侧都没有 th/id/ms**;⛔**`visualHint` 只有 `zh` 键喂编剧,其余语言键是死数据**(vi/en 单实测收到的都是中文),前台可见的只有 title/summary/previewCaption → [字段读取图](reference_thinknova_prompt_fields.md)
- 🔴🔴 [东南亚语言扩充 08-04](project_thinknova_sea_languages.md) — **动输出语言第0步必读**:✅泰语+全语言去β已上线双前台(9语无β,th lineValidation=characters 四镜像,标待复测);界面语言 i18n 需求(th/ms/id)已交老板转技术;✅grok多参双参单成功=门头文字级锁定+15秒约5镜头(探店标杆配方,判若两模型);✅vi补烧一次成功已解禁;子任务取证接口已变(商家端子任务详情返回null,改走admin列表);两条硬教训(动模板必量最大单字节/字数窗别一次收太紧)
- 🔴 **待测/待办小池**:①编剧层反呆板三刀草案(`03_工作台/编剧层反呆板手术方案_待测试_2026-08-04.md`,**风格类改动一律"单刀→AB烧验→老板过目→再下一刀"**)②门头做进核心设置待定 ③10秒单临时走15秒 ④门头/产品锁不死=模型问题等换模型 ⑤🔴 **`video-shotcraft` 做平台演示片 + 路演片(老板 08-13 批准,但"不是这周")** —— 只做**这两样**,内容线(抖音/小红书)不用它(横屏1920×1080无9:16预设、主体是产品截图、零中文支持文档、且会变成 HyperFrames 之外的第二套栈)。🔴 **动手第一步先查 Remotion 商用授权**(个人/小团队免费,**公司可能要付费**,我们是公司),没查清不许开工。装法 `npx skills add Vincentwei1021/video-shotcraft`(Apache-2.0,本地渲染不上传素材)。**白拿项:它 152 张镜头配方卡=一套有名字的镜头词汇,即使不装也该抄来当共享语言**(老板痛点:「不然我永远不知道怎么给你解释」)
- 🔴🔴 **08-14 外部参考入库 → [提示词参考库](reference_prompt_library.md)**(`参考_2026-08-14_漫剧五宫格四件套_硬切与口型.md`)。**最值钱一条待验:它主张 grok 出叠化不是能力边界,是相邻格差异度不够**(解法=相邻格景别跨≥2档/机位≥30°/焦点切换,三选二不越轴)——若成立,我们 07-31「grok 做不到硬切」的定论要改,竞品「切镜密度」差距有解。另:**videoPrompt 只写动态、静态全归 firstFrame**(他们 4096 只用 1200,对着我们字节账痛点)。
- 🔴 **模型 id 500 = MiniMax(`minimax-h3`,供应商 1renmanju)**,08-14 改名 **「效果最佳版·10/15秒(画面与多语言最好·较慢)」**/`Best Quality · 10/15s`(原名「海螺全能王」露供应商品牌已换掉);**支持 10/15 两档**。🔴 **`max_reference_images` 线上仍是 1 = 多参没打开**(要改就得 DB 列 + 协议 JSON `referenceImages.maxCount` 一起改,468 踩过同一个坑),所以名字里现在**不能**写「锁人物产品门店」。⚠️ 上架待落定两件:**定价没配**(`duration_credit_prices` 空、`billing_unit=per_task` 与 grok 系按秒不同)、**失败退不退积分**(老板报 20% 失败率;老板 08-14 定「让商家自己选」,不做自动降级链)。前台现有 5 个模型名字互相打架(482/460/481/484/500),**待统一梳一版** → [模型台账](reference_thinknova_multiref_model.md)
- 🔴 [官网博客 API](reference_thinknova_blog_ops.md)(缺 blog.write 令牌) / [扫码发布深链](reference_thinknova_publish_schemes.md)(四平台已真机验证)

### 内容与产品规矩
- [北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) / [内容工具不做合规](feedback_thinknova_content_not_compliance.md) / [案例缺口双查法](feedback_case_gap_dual_check.md) / [小红书交付规矩](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — 建案例前必读;新建必过 3 条自检

# 商务与融资
- 🔴🔴🔴 **自营30天市场计划**=`03_工作台\自营30天市场计划_2026-08-10.md`(老板前提:只靠自己/万万不考虑/艾多美已放弃/年费订阅动不了→按积分充值设计);分佣挂首充+种子店3-5家免费陪跑+08-22起周周线下会;joeylu=P0事故测试号
- 🔴🔴 [投资人线](project_thinknova_investor_plan.md) — **谈融资/预算/会展/投流前必读**(S$100k/60-40两阶段;成本必须确切数字;三个询价待办)。现行材料:路演 v5.pptx 15页+讲稿、BP 2026-08-09.docx(**老板令勿再改**)、单位经济表 08-10.xlsx(黄格假设待填);**万万渠道应对分析=内部件绝不外发**

# 其他(休眠)
- [Compass/TikTok达人线](project_compass.md) / [新加坡鞋包提案](project_sg_footwear_proposal.md) / [小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md)
- 🔴🔴🔴 **编剧层现状** — systemPrompt **3999 字**(六条全局规则:禁复读/例词守卫/末句字数≥均句/末格留白0.4秒/情绪写两个可见部位/开场禁叠化;场景要点按 sceneId;`shotCount=1` 兜底句);**片尾死寂已解决**,音高漂移三刀失败终结(归音色克隆或TTS层)→ [编剧层](project_thinknova_0729_screenwriter_stack.md)
- 🔴🔴 **验收四铁律** — ①**成片验收四项齐验**:联系表逐帧+片尾死寂+mean音量+台词逐句读 ②**门槛不能跨片型套用**(拿单人口播的死寂门槛套对话剧=误杀) ③**「写满」类指令会把被禁话术挤出来**,必须同时给合法填充材料 ④**授权子agent挤字数时必须显式列出合规不可删清单**(曾误删"绝不承诺疗效")
- 🔴🔴 **两库入口**:本机=`视频制作平台分析\README_从这里开始.md`,Obsidian=书签「① 从这里开始」;**归档=移动不是删除**(`99_归档\`/`_archive\`)。**skill 路由表**=`00_规格与参考\SKILLS与规则总台账_2026-08-11.md`(全部保留不停用;但**平台成片一律走 ThinkNova 管线**,hyperframes 只在明确要 HTML 动画/演示片时才用)
