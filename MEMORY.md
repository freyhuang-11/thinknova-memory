# 铁律 · 按触发时机分层

> **【索引宪法 · 违反即返工】**(2026-08-27 立,因为索引胖到 43KB、同一个字数记出 11 个不同的值)
> ① **一条 = 一行,以 `→ [文件]` 收尾。** 写不下 = 正文该下沉,不是该换行。
> ② **四类内容禁止出现在本文件**:`task_` 任务号 / 任何字数·字节·条数的**具体数值** / 三段以上字段全路径 / 「我当时…」复盘叙事。**数值一律写"现拉线上"。**
> ③ **加一条前先指出删哪条**(合并、下沉都算)。
> ④ **作废声明写在细则文件里**,索引只留现行口径。
> ⑤ 收工前量一次本文件大小,超 17KB 当场瘦身。

## 🔴🔴🔴 L-1.5 · 执行前必读路由表
> **动手前先在这张表里找到你要做的事,把对应文件打开再动。找不到对应行 = 先问,别猜。**

| 我要做什么 | 先开哪个 |
|---|---|
| **任何后台写操作** | 🔴 `00_规格与参考\执行手册_后台操作_2026-08-21.md` |
| 烧验证单 | 🔴 `00_规格与参考\烧单前强制自查表_2026-08-18.md` |
| **查任何字数/字节/条数现值** | 🔴 **现拉线上 config,不信记忆里的数** → [[reference-thinknova-tech-docs-index]] |
| 动编剧/台词/长度/字数窗 | [[project-thinknova-0729-screenwriter-stack]] |
| 动 grok/H3/参考图/负面词/提示词(旧管线) | [[project-thinknova-language-pack-rollout]] + [[reference-thinknova-multiref-model]] |
| **动视频工作台/长视频拼接(新管线,与旧线隔离)** | 🔴 [[reference-thinknova-video-studio]] |
| 动片型/案例库/场景表 | [[project-thinknova-film-types]] |
| 动字幕/画面文字口径 | [[feedback-boss-rulings]](散在 4 个字段,必须同改) |
| 做探店片型 | [[reference-competitor-gravity-ai]] |
| 下「前台有没有X」的结论 | [[reference-thinknova-frontend-truth]] |
| 建案例 | [[feedback-case-low-coupling]] |
| 动海报场景/案例/styleRule | [[project-thinknova-poster-scene-revamp]] |
| 海报出问题 | [[project-thinknova-poster-video-purge]] |
| 动输出语言 | [[project-thinknova-sea-languages]] |
| 写小红书 | [[project-thinknova-xhs-line]] |
| 做抖音封面 | [[reference-douyin-cover-benchmark]] |
| 比较两批打分 | [[reference-cheat-gates-calibration]] |
| 做横屏口播片 | [[reference-hengping-x-pipeline]] |
| 用哪个 skill | [[reference-skills-routing]] |
| 谈融资/预算 | [[project-thinknova-investor-plan]] |
| **技术发来新文档** | 🔴 归档进 `00_规格与参考\技术侧文档\` **并当场覆盖冲突的旧记忆** |
| 接「上次的活」 | [[feedback-parallel-sessions-check-first]] |
| **接 ThinkNova 视频平台的活** | 🔴 `03_工作台\交接档_2026-08-26_压缩前状态.md` |
| **接增长/海外/融资的活** | 🔴 交接档末段「08-30 压缩前交接」+ `03_工作台\海外市场探测计划_2026-08-30.md` 第八节 |

## 🔴🔴🔴 L-1 · 唯一入口:[行动闸门](feedback_action_gates.md)
**动手先过闸,每道闸先输出可检查产物**:闸1 现状源 → 闸2 字节账 → 闸3 爆炸半径 → 闸4 attemptCount → 闸5 单条验证+老板过目才铺开。**先读后动,先验后铺。**

## 🔴🔴🔴 L-0.5 · 动手前先查 skill 路由表 → [什么场景用什么 skill](reference_skills_routing.md)
三条铁规矩:①`hyperframes`=任何视频/动画强制入口 ②`cheat-score-blind`=内部 sub-agent 主对话绝不调 ③组合拳顺序不乱(视频稿=video-script-style→high-retention-hook→hkrr-clock→hurricane-shot-prompt)。

## 🔴🔴🔴 L-0.4 · 老板亲口定的口径 → [老板定调集](feedback_boss_rulings.md)
**每次动内容/提示词/画面规则/增长策略前扫一眼。** 现行:从0开始纯线上导流量(线下会已停) / 老库=假用户只做增量 / 总指挥不进流水线 / 小红书=痛点先行品牌只结尾 / 客户内容归客户 / 矛盾按最新覆盖 / 字幕锁死画面文字放行 / S14 极简 / 英语主语言 / 三道关口 / 预设即产品。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 **权威源(技术文档/线上真值/代码)> 我的记忆**;实验结论标「实测·待核」带任务号、不外推 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断「现在/多久前」**先跑 `date`** → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**;模糊回复先确认再动手 → [详](feedback_dont_assume_requirements.md)
2.5 🔴 **例程内能自己拍板的自动跑**,别每天拿老问题问老板 → [详](feedback_dont_assume_requirements.md)
2.7 🔴🔴 **多会话**:接「上次的活」先看记忆改动时间([详](feedback_parallel_sessions_check_first.md));**我是定时任务时只做本职**,「做完还要人接着响应」的活路由回常驻会话 → [详](feedback_scheduled_task_stay_in_lane.md)
2.8 🔴🔴🔴 **老板给的词按字面做满,不许自己缩窄定义再报「全部完成」** → [详](feedback_dont_assume_requirements.md)
2.9 🔴🔴🔴 **「几天没落库/零变化」不许推出「他没干活」**;快照只证明那一秒,不是趋势不是意图 → [详](feedback_silence_is_not_evidence.md)
2.95 🔴🔴🔴 **拿到技术新文档当场三件事:归档 → 找出被推翻的旧记忆 → 改写它。** 只归档不覆盖 = 下次照旧用错口径。
2.97 🔴🔴 **我自己写在注释/交付说明里的话不算规矩**；引用前先能指出老板原话或裁决号，指不出且要大改的先问一句 → [详](feedback_self_authored_notes_are_not_rules.md)
3. 🔴 **没实地用过不下判断**;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md)
3.1 🔴🔴🔴 **config 里的 placeholder/说明文案 ≠ 实际行为**;对外说任何产品能力前必须有 A/B 实测任务号 → [详](feedback_placeholder_is_not_behavior.md)
3.2 🔴 **写入被拒先原样重试一次再说**;唯一硬墙=改我自己的 settings.json 权限段 → [详](feedback_retry_before_escalating.md)
3.5 🔴🔴🔴 **「前台有没有X」只认商家端 config 接口**,admin config 不是前台真值 → [详](reference_thinknova_frontend_truth.md)

## L1 · 改配置/提示词前
4. 🔴 **先查字段读取图**:拉一条真实任务 input,确认目标字段真在里面 → [详](reference_thinknova_prompt_fields.md)
4.3 🔴🔴🔴 **配置字段的语义(每句还是总计?目标还是边界?)不确定 = 先问技术,绝不凭直觉配** → [详](project_thinknova_0729_screenwriter_stack.md)
4.5 🔴 **台词出问题先查 visualHint** → [详](feedback_visualhint_leaks_into_lines.md)
4.6 🔴🔴🔴 **提示词≤4000字,废话重复矛盾全删**;加新规则前先想清挤掉谁 → [详](project_thinknova_0729_screenwriter_stack.md)
4.7 🔴🔴🔴 **关键规则一律前置**;但前置救不了超长提示词,**先减肥再谈位置** → [详](project_thinknova_0729_screenwriter_stack.md)
4.8 🔴 **查「有没有某能力」读结构化字段(`capability`)**,不拿 code/name 正则猜
5. 🔴 **指派式 > 禁令式**;必须禁止时禁令后立刻跟替换项;「写满」类要求必须给贫料出路 → [详](feedback_directive_over_prohibition.md)
5.3 🔴🔴 **微信群【多学一点】= AI 知识 + 最近更新了什么能帮到开店的人**;第三层必须给一句能直接复制去问 GPT 的话;⛔「生成对外文字图片视频」一律不教 → [详](feedback_wechat_learn_safe_zone.md)
5.4 🔴🔴 **微信群=单向输出**:提问全周最多 1 次;「实事」只讲实体商家用 AI 的事件,查不到就不发 → [详](feedback_group_oneway_broadcast.md)
5.5 🔴🔴 **对外文案主语是机器 = 返工**:一律翻成客户视角「这些都不用你想」;自贬话术全禁 → [详](feedback_customer_view_not_machine_view.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 只证明写进库;前台/烧单看见才算上线 → [详](feedback_evidence_standard.md)
6.4 🔴🔴 **英文化已上线**;⛔`opsEditable.stagePromptPresets.image_to_video` 运营写不进(服务端丢写)→ [详](project_thinknova_language_pack_rollout.md)
6.5 🔴🔴🔴 **grok 语言定律**:多参混语言=音频宕机只剩 BGM,整条单一语言才活;⛔带水印/带字的图绝不能当参考图 → [详](project_thinknova_language_pack_rollout.md)
7. 🔴🔴🔴 **三条链上限不同、单位也不同,别混**:编剧 systemPrompt 算**字**、生视频出站算**字节**、生图另有一条更宽的。超限时生视频丢的是台词、生图从尾部硬切。改任何字段前先认清改的是哪条链;**现值现拉线上** → [详](feedback_prompt_change_hard_rules.md)
7.02/7.03 🔴🔴🔴 **`videoTemplate` 两处不许动**:开场纯黑句(删了 grok 开场露六宫格)、首行方括号(去掉立刻重新露格网),A/B 均已证。⛔删任何一句前先问「它为什么在这里」;动它一个字必须同案例 A/B 烧过,不许凭道理推断 → [详](feedback_prompt_change_hard_rules.md#vt-黑场句)
7.05 🔴🔴🔴 **生图链也被截断,且截得很狠**(08-27 实测近一半进不去)——**关键规则必须前置进 `taskGoal.firstFrame` 安全区**;判据字段 `_prompt_truncated` → [详](feedback_prompt_change_hard_rules.md#生图链截断)
7.15 🔴🔴🔴 **动编剧必须同看三处**:systemPrompt + outputContract + 案例 visualHint(最稳=拉 `attempts[0].raw_request` 看模型实收);「编剧连挂」根因常在 `outputContract` → [详](feedback_prompt_change_hard_rules.md#outputcontract)
7.16 🔴🔴 **加规则前先问「模型能用什么方式满足它而不解决问题」**;统计相关 ≠ 因果 ≠ 加禁令能修 → [详](feedback_prompt_change_hard_rules.md)
7.17/7.18 🔴🔴🔴 **验收两条**:①先确认「这指标在修复前是什么值」,没有前值基线的不能当证据 ②**不许拿数值检测器代替人眼看图**(一天栽两次),联系表必须逐格看 → [详](feedback_evidence_standard.md)
7.19 🔴🔴 **`lineValidation` 校验的是剥掉声线外壳后的字数**,不是 `line` 原始长度;核字数前先剥壳 → [详](project_thinknova_0729_screenwriter_stack.md)
7.195 🔴🔴🔴 **编剧「疯狂失败」有一半不是提示词的锅**:回退链里有两个通道基本不可用(一个必定超时收 0 字节、一个只返回「我会…」预告帧)。⛔下「编剧失败=提示词写坏了」的结论前,**先按模型拆 `__attempt_trace`** → [详](feedback_prompt_change_hard_rules.md)
7.196 🔴🔴 **负面词挡不住生图编造**(已实证:词全部送达且是独立字段,模型就是不听)。⛔别再堆同类词,走正面指派。另:**行业专属负面词只进生图链,没进 i2v** → [详](feedback_prompt_change_hard_rules.md)
7.1 🔴🔴 **案例 visualHint 里一个字都不许写声线/语调/节奏**(会压短台词→撞长度下限→连环重试→空台词);声线节奏归全局 `videoTemplate` → [详](feedback_prompt_change_hard_rules.md)
7.2 🔴🔴 **烧单是验证手段不是探索手段**:动手前先读现状源 → [详](feedback_prompt_change_hard_rules.md)
7.5 🔴🔴🔴 **交付件 = 能直接照着发的东西**:旁边不许躺 `.bak`、正文不许混自查注、txt 一律 utf-8-sig;⛔emoji 键帽在记事本是方框,换 ①②③ → [详](feedback_deliverable_is_postable.md)
8. **范围边界必写反向**:附「作用域仅X、不碰Y」+双向验收 → [详](feedback_scope_boundary_explicit.md)
8.5 🔴 **动「前端会读的字段」先改一条验,别一次铺满** → [详](project_thinknova_dingdian_koubao.md)
8.53 🔴🔴 **案例名实一致**:交付不了就改名,不许挂着做不到的承诺 → [详](feedback_case_name_matches_output.md)
8.54 🔴🔴🔴 **文案说的,素材上必须真有**:写完对着素材逐句核;**改文案 > 烧新图**;排雷是逐样打开看不是看文件名 → [详](feedback_name_matches_the_asset.md)
8.55 🔴🔴🔴 **改一个案例只许影响这一个案例**:根因在全局模板时做**显式开关**(全局原句一字不改+窄口径条件);动全局前先扫库量爆炸半径 → [详](feedback_case_change_no_blast_radius.md)
8.6/8.7 🔴🔴 **加行业/加场景先翻技术文档**(新场景必须技术注册进合法枚举,否则建单 500);**500 诊断法**=admin GET 全量真值 → 隔离实验换维度 → 找唯一缺键 → [详](project_thinknova_brand_product_industry.md)
8.75 🔴🔴🔴 **案例 PUT = 整体覆盖不是部分更新**(只传一个字段,其余全被静默清空):GET 整条 → 带全字段 PUT;批量前**存全量数据快照**(不是存「改回去的配方」);**「验」= 回读比字段数,不是看目标字段变没变** → [P0 事故档](../../../../D:/SamsoData/Documents/视频制作平台分析/02_交付内容/给技术_案例表321条被覆盖_恢复说明_2026-08-23.md)
8.8 🔴🔴 **config/案例写入唯一正解:GET 响应头拿 `x-csrf-token` → 带头 PUT**;重 SPA 页会冻死 CDP,fetch 一律在 robots.txt 轻页跑 → [详](reference_thinknova_paths.md)

## L1.9 · 🔴🔴🔴 动后台前先开手册 → [执行手册·后台操作](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/执行手册_后台操作_2026-08-21.md)
含:动手前五问 / 字节硬账 / 真通道与死字段对照表 / 写入配方 / 验证四步(回读≠生效) / 成片四层验收 / 已重复踩过的八个坑。

## L2 · 烧单核验时
8.85 🔴🔴🔴 **烧单前逐条打勾 A–G** → [烧单前强制自查表](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/烧单前强制自查表_2026-08-18.md)
8.9 🔴🔴 **烧单前必报客户视角五要素**(行业/场景/案例/补充信息/验证目标) → [详](feedback_burn_report_format.md);**变量做满再烧** → [详](feedback_prompt_first_then_test.md);**案例轮换着烧**,过关成片抽帧进封面池
9. 🔴 **逐帧通看**(联系表);音频量死寂;单帧截图=假结论;**证据成对**(真实输入↔输出+任务号) → [详](feedback_evidence_standard.md)
9.5 🔴 **烧完先验三件**:`task.model` 实际派发、编剧 source、字数落区间 → [详](project_thinknova_0729_screenwriter_stack.md)

## L3 · 给技术发文档前
12/14. 🔴 **只发技术才能处理的**(逐条自验「我能不能改」);9 段规范,事实/判断/期望分离,一份最多 3 问题;**发文前 7 条自检,发出即冻结,新内容走增量** → [详](reference_tech_doc_submission_spec.md) + [自检](feedback_tech_doc_checklist.md)

## L4 · 汇报沟通时
16/18. **每轮说清「验收什么+做了什么」**;说重点/有据质疑/别奉承/追根因;**要老板拍板用 plan 模式问**;数据新鲜度别贴「过期」也别埋雷 → [详](feedback_communication_principles.md) [plan](feedback_questions_via_plan_mode.md) [新鲜度](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反 = 事故)
20. 🔴 密钥不外发不打印不进 git;🔴 禁 `taskkill /IM python`,按 PID 精准杀 → [详](feedback_kill_python_scope.md)
20.5 🔴🔴 **签名 OSS URL 会把 AccessKeyId 带进产物**(案例快照、渲染出的 HTML 都中过);入库/外发前扫一遍 `LTAI`/`AKID`/`Signature=`
22. 🔴 线上 config=唯一真值,禁种子覆盖;**结构/新字段一律交技术,我只碰纯文本** → [详](feedback_dont_edit_prod_config_structure.md)
22.7 🔴🔴 **上下文唯一杠杆=减少往返**:一段 JS 干完一整套只回摘要;读文字不截图 → [详](feedback_context_budget_discipline.md)
23. **记忆只留当前状态**不堆矛盾层 → [详](feedback_memory_keep_current.md);**老板发的提示词当天归档** → [详](reference_prompt_library.md)

---

# 用户与沟通
- 🔴 [共享记忆库 AgentMemoryVault](reference_agent_memory_vault.md) — 开工 pull+读信箱,收工**只 add 自己的文件(⛔禁 `-A`)**+push 并验证远端真收到
- [用户画像](user_profile.md) — 跨境电商 BD/运营,新加坡;TikTok 达人 SaaS + ThinkNova 双线
- 🔴🔴🔴 [文件放哪](feedback_file_placement.md) — **桌面=`D:\SamsoData\Desktop`,C 盘桌面是假的**(已三犯);桌面只放成片/成图

# ThinkNova(实体店内容 SaaS)

### 动手前必背
- 🔴🔴🔴 [编剧层现状源](project_thinknova_0729_screenwriter_stack.md) — 动编剧/长度/台词/烧验第 0 步;`lineValidation`=全片总计(**现值现拉线上**)
- 🔴🔴 [商家端=前台真值](reference_thinknova_frontend_truth.md)(下「前台有没有」结论前必读) / [技术文档索引](reference_thinknova_tech_docs_index.md)(改 config 第 0 步) / [模型台账+时长映射](reference_thinknova_multiref_model.md)
- 🔴🔴 [提示词字段读取图](reference_thinknova_prompt_fields.md)(谁读得到哪个字段) / [场景·选项·案例写入路由](reference_thinknova_option_scene_rules.md)(optionRules 双写;`product_only`≠无人)
- 🔴 [两条管线流程](reference_thinknova_pipeline_flow.md) / [提示词架构](reference_thinknova_prompt_architecture.md) / [Grok 红线](reference_grok_content_policy.md)(是组合不是敏感词) / [权限地图](reference_thinknova_config_powers.md) / [路径接口](reference_thinknova_paths.md)

### 现行状态
- 🔴🔴 [口播/裁格·格网](project_thinknova_0729_koubo_defect.md) — ✅格网已解(剧情片+`panel_crop`+EMMA 结构);⛔`panel_crop` 不是通用防漏板开关,别全库铺
- 🔴🔴🔴 [片型体系+案例库](project_thinknova_film_types.md) — 场景表 10 个;片型分化已落地;**案例条数现拉线上**
- 🔴🔴🔴 [场景表 = 10 个](reference_thinknova_option_scene_rules.md) — 改场景名必须同时改 `scenes[]` 和 `businessActions` 两张表;`businessScenario` 与案例 `sceneIds[0]` 对不上直接 500001
- 🔴🔴🔴 [视频链定稿](project_thinknova_language_pack_rollout.md) + [双模型台账](reference_thinknova_multiref_model.md) — 动 grok/H3/参考图/负面词前必读;⛔**按案例分流模型做不到**(案例表没有 model 字段)
- 🔴🔴🔴 [多参无人声·最终结论](reference_thinknova_multiref_model.md) — **图越多越不稳,措辞救不了**;解法=实发砍到 2 张;失败形态是音轨被音乐占满**不是静音**
- 🔴🔴🔴 [国内营销线](project_thinknova_marketing.md) — 主战场;**微信群每天出货=唯一硬规定**(知识卡走 HTML 模板,文字绝不走 AI 文生图;发送永远人工过目)
- 🔴🔴🔴 [小红书线现状](project_thinknova_xhs_line.md) — 写小红书前必读;分享 vs 教只差主语(出现「你/应该/别」=返工)
- 🔴🔴 [新加坡线下会议线](project_thinknova_sg_events.md) — 每周六;🔴小红书版邀请函绝不能带二维码
- 🔴🔴🔴 [开场黑场真值](project_thinknova_marketing.md) — 黑不黑**只由案例级 `entranceBlackOverlay` 决定**(Agent 层写了会被清除);微信治法=第一帧定格盖住,不许切
- 🔴🔴🔴 [海报线+P0 编造事故](project_thinknova_poster_video_purge.md)(出问题第 0 步;拒绝编造守卫散 6 处,**修一处不算修完**) / [海报场景改造](project_thinknova_poster_scene_revamp.md)(动场景/styleRule 第 0 步)
- 🔴🔴 **海报两条结构性事实**:⛔案例 `visualHint` **送不到文案模型**;⛔尾部「海报标题:…」串=服务端硬编码,config 搜不到
- 🔴🔴 **语言分两层别混** — 输出语言 9 种;案例文案 i18n 只有 6 个界面语言;⛔`visualHint` **只有 `zh` 键喂编剧**,其余是死数据 → [详](reference_thinknova_prompt_fields.md)
- 🔴🔴 [东南亚语言扩充](project_thinknova_sea_languages.md) — 动输出语言第 0 步;硬教训=动模板必量最大单字节、字数窗别一次收太紧
- 🔴🔴🔴 **参考图与模型两条**:`max_reference_images` **含主图**(剩余名额人→景→产品);**模型 id 500 = MiniMax,字节上限远低于 videoPrompt,选它必挂** → [详](reference_thinknova_multiref_model.md)
- 🔴🔴 [竞品·引力Ai/萍萍拆解](reference_competitor_gravity_ai.md) — 探店片型第 0 步;真差距=TTS 声调+切镜密度+台词结构
- 🔴🔴 [抖音封面对标](reference_douyin_cover_benchmark.md)(天花板是打光不是设计) / [打分校准](reference_cheat_gates_calibration.md)(跨批必须夹带锚点) / [横屏 X 式管线](reference_hengping_x_pipeline.md)(抠像必须分块+断点续跑)
- 🔴 **两把尺+四件套 skill** — `/xhs-note`(最高危违禁词=「搞钱/变现」)、`/xhs-growth`;视频脚本按序四件套 → [国内营销线](project_thinknova_marketing.md)
- 🔴 [定价+推广大使](project_thinknova_pricing_ambassador.md) / [HyperFrames](reference_hyperframes_production.md) / [音色克隆](reference_voice_clone_pipeline.md) / [两个 Agent 主线](project_thinknova_offline_agents.md) / [博客 API](reference_thinknova_blog_ops.md)(缺令牌) / [发布深链](reference_thinknova_publish_schemes.md) / [提示词参考库](reference_prompt_library.md)
- 🔴 **未完待办与待测小池** → [总账](../../../../D:/SamsoData/Documents/视频制作平台分析/03_工作台/待办总账_从记忆迁出_2026-08-24.md);**风格类改动一律「单刀→AB烧验→老板过目→再下一刀」**

### 内容与产品规矩
- [北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) / [内容工具不做合规](feedback_thinknova_content_not_compliance.md) / [案例缺口双查法](feedback_case_gap_dual_check.md) / [小红书交付规矩](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — 建案例前必读,新建必过 3 条自检
- 🔴🔴 **验收四铁律** — ①成片四项齐验(联系表逐帧+片尾死寂+mean 音量+台词逐句读)②门槛不跨片型套用 ③「写满」类指令会挤出被禁话术,须给合法填充材料 ④授权子 agent 挤字数须显式列不可删清单

# 商务与融资
- 🔴🔴🔴 [海外邮件营销线](project_overseas_email_outreach.md) — 我主理的新马英文商户冷邮件线;系统在 `03_工作台\邮件推广系统\`;❗正则/中文代码绝不走 heredoc
- 🔴🔴🔴 **自营 30 天市场计划** = `03_工作台\自营30天市场计划_2026-08-10.md`(只靠自己/按积分充值设计)
- 🔴🔴 [投资人线](project_thinknova_investor_plan.md) — 谈融资/预算前必读;**万万应对分析=内部件绝不外发**

# 其他(休眠)
- [Compass/TikTok 达人线](project_compass.md) / [新加坡鞋包提案](project_sg_footwear_proposal.md) / [小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md)
- 🔴🔴 **两库入口**:本机=`视频制作平台分析\README_从这里开始.md`,Obsidian=书签「① 从这里开始」;**归档=移动不是删除**。skill 台账=`00_规格与参考\SKILLS与规则总台账_2026-08-11.md`(平台成片一律走 ThinkNova 管线)
