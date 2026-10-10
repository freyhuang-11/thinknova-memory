# 铁律 · 按触发时机分层
> 【索引宪法 · 违反即返工】(2026-08-27 立)
> ① 一条 = 一行,以 `→ [文件]` 收尾。 写不下 = 正文该下沉,不是该换行。
> ② 禁入本文件:`task_` 号 / 具体数值(写「现拉线上」)/ 三段以上全路径 / 复盘叙事。
> ③ 加一条前先指出删哪条(合并、下沉都算)。
> ④ 作废声明写在细则文件里,索引只留现行口径。
> ⑤ 收工前量一次本文件大小,超 17KB 当场瘦身。

## 🔴🔴🔴 L-1.5 · 执行前必读路由表
> 动手前先在这张表里找到你要做的事,把对应文件打开再动。找不到对应行 = 先问,别猜。
| 我要做什么 | 先开哪个 |
|---|---|
| 任何后台写操作 | 🔴 `00_规格与参考\执行手册_后台操作_2026-08-21.md` |
| 烧验证单 | 🔴 `00_规格与参考\烧单前强制自查表_2026-08-18.md` |
| 查任何字数/字节/条数现值 | 🔴 现拉线上 config,不信记忆里的数 → [[reference-thinknova-tech-docs-index]] |
| 动编剧/台词/长度/字数窗 | [[project-thinknova-0729-screenwriter-stack]] |
| 动 grok/H3/参考图/负面词/提示词(旧管线) | [[project-thinknova-language-pack-rollout]] + [[reference-thinknova-multiref-model]] |
| 动视频工作台/长视频拼接(新管线,与旧线隔离) | 🔴 [[reference-thinknova-video-studio]] |
| 动片型/案例库/场景表 | [[project-thinknova-film-types]] |
| 改任何提示词(编剧/识图/画面风格/案例) | 🔴 [[feedback-prompt-conflict-and-hard-checks]] — 先扫互搏、认硬校验、opsEditable 双写 |
| 动字幕/画面文字口径 | [[feedback-boss-rulings]](散在 4 个字段,必须同改) |
| 下「前台有没有X」的结论 | [[reference-thinknova-frontend-truth]] |
| 建案例 | [[feedback-case-low-coupling]] |
| 动海报场景/案例/styleRule | [[project-thinknova-poster-scene-revamp]] |
| 海报出问题 | [[project-thinknova-poster-video-purge]] |
| 动输出语言 | [[project-thinknova-sea-languages]] |
| **用哪个 skill / 发布跑哪个脚本** | 🔴 [[reference-skills-routing]] — 场景表逐行带「先问的第一性问题」 |
| **下方向判断 / 给老板拍板 / 否掉一条老规矩** | 🔴 先跑 `steelman` → [[feedback-thinking-protocol]] |
| YouTube 上传（教程队列 / 宣传片定时）/ 看 GSC / 改教程页 | 🔴 教程页现状与改法 → [[project-thinknova-guide-multilang]]；教程=`教程视频_0923\youtube_queue_upload.py`（Windows 任务 15:05）；宣传片=YouTube 目录 `_promo_upload_skipS4.py`（清单+状态在 `宣传片清单_1003-1014\`）；旧管线 `管线_YouTubeShorts英文配音_2026-09-15.md` |
| 接国内营销线的活 / 周日档·周一档 | 🔴 派活=ccd_session_mgmt send_message 到「THINK NOVA marketing」会话，⛔ 别说「不在线」 → [详](feedback_reach_sibling_sessions.md)；只给主题/受众/约束⛔不教怎么做 → [详](feedback_brief_marketing_what_not_how.md) ＋ 🔴 03_工作台 下 `交接档_2026-09-27_压缩前_营销线.md` + [[feedback-boss-rulings]] 顶部 |
| 技术发来新文档 | 🔴 归档进 `00_规格与参考\技术侧文档\` 并当场覆盖冲突的旧记忆；🔴🔴 老板转来的=已部署（10-03 两次被纠正），⛔ 按文档里「未部署」字样判断，当场线上核+补配置；🔴🔴 10-09 起⛔ 给技术邮箱发信（含 dot、[TN-AUTO]），问题汇总报老板由他定 → [详](feedback_email_tech_immediately.md) |
| 接「上次的活」 | [[feedback-parallel-sessions-check-first]] |
| 更新战略台 / 找任务清单 / 老板问「各角色在干嘛」 | 🔴 战略台链接+更新法、任务唯一总表 → [详](reference_strategy_dashboard.md) |
| 想装闹钟/定时任务 / 心跳频率 | 🔴 [[feedback-heartbeat-not-cron]] — 整点 cron 7 * 全天 24 小时（10-04 老板定，夜间做系统优化、不扰客户不叫老板）；app 重启先重建；Windows 任务跑固定脚本=可 |
| **回 WhatsApp 客户 / 扫新客户 / 任何获客判断 / 报价** | 🔴🔴🔴 先看 [现行口径（10-02 整理）](feedback_current_growth_rules_0930.md)（市场·对外口径·价格·WA·带线 六节）+ [WA 操作](reference_whatsapp_ops.md) + [⛔别只看未读](feedback_wa_unread_hides_customers.md) |
| **FB 投流 / 调广告 / 接总指挥的活** | 🔴🔴🔴 [投流实数](reference_thinknova_fb_ads_truth.md) + 03_工作台 下最新 `交接档_*_总指挥.md` — 地域现拉；我建到草稿、老板点发布 |
| **谈收入 / 算转化 / 做增长判断** | 🔴🔴🔴 [收入真值](reference_thinknova_revenue_truth.md) — 大多是测试数据；付费全来自老板线下演示 |
| **说「找不到 / 没有这个东西」** | 🔴🔴🔴 [先搜会话记录](feedback_search_transcripts_too.md) — `*.jsonl` 可直接 grep |
| **转述子 agent 结论 / 下根因** | 🔴🔴🔴 [verify-before-relaying](feedback_verify_before_relaying.md) — 自己跑一遍再报；没证据就说不知道 |
| 烧 agent/海报线单、写 offer/sellingPoints | 🔴 [[reference-thinknova-paths]] 09-19/09-20 段 — 输入侧红线·海报线建单配对 |
| **做对外内容 / 投流素材（出片规格）** | 🔴🔴 [现行口径](feedback_current_growth_rules_0930.md) 第二、三节 + 03_工作台 `客户需求点库_2026-10-02.md`（痛点轮换）+ `新内容_品牌_0927\_自由版v2须知.md`（老板定稿风格与口径）+ [[reference-content-skills-dbskill-agentmotion]] ＋ 🔴 派一批片前先填角度矩阵，四列不许重 → [详](feedback_content_angle_variety.md) ＋ 🔴 每次数据分析必带「对标同类爆款」一节（老板 10-07）→ [详](feedback_benchmark_trending_each_analysis.md) |

## 🔴🔴🔴 L-1 · 唯一入口:[行动闸门](feedback_action_gates.md)
六道闸依次过:**闸0 三件套** → 现状源 → 字节账 → 爆炸半径 → attemptCount → 单条验证+老板过目才铺开。
🔴🔴🔴 **闸 0(开口也算动手)= 三件套**:第一性=「该怎么做」;steelman=「方向对不对」,给老板前必跑;对抗审查=「这句能不能说」。跑完说不出放弃了什么=没跑 → [详](feedback_thinking_protocol.md) [逐句筛](feedback_adversarial_review_before_reply.md)

## 🔴🔴🔴 L-0.5 · 动手前先问「有没有现成 skill/脚本」 → [场景路由表](reference_skills_routing.md)
`hyperframes`=视频/动画入口 ／ 🔴 发布走脚本+预约+一天一条，⛔ 浏览器手点 ／ ⛔ 有副作用的脚本先 `--dry`

## 🔴🔴🔴 L-0.4 · 老板亲口定的口径 → [老板定调集](feedback_boss_rulings.md)
直播/知识类内容只给两个出口(平台或定制开发)，⛔不教观众去别处试 → [详](feedback_livestream_positioning.md)
动内容/提示词/画面规则/增长策略前扫一眼;索引不复述。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 权威源> 我的记忆 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断时间先跑 `date` → [详](feedback_check_time_first.md) ／ 🔴🔴🔴 提议≠指令,老板的词按字面做满,⛔不许缩窄定义再报「全部完成」 → [详](feedback_dont_assume_requirements.md)
2.5 🔴🔴 例程内自己拍板,别拿老问题问老板;🔴🔴🔴 问「X 还在不在做」先 grep vault 总览 → [详](feedback_parallel_sessions_check_first.md) [详](feedback_scheduled_task_stay_in_lane.md) ／ 🔴🔴🔴 零变化≠他没干活 → [详](feedback_silence_is_not_evidence.md)
2.97 🔴🔴 自己写的注释不算规矩 → [详](feedback_self_authored_notes_are_not_rules.md) ／ 🔴🔴🔴 派子 agent 先贴 vault 任务书模板五行 → [详](feedback_deliverable_is_postable.md)
3. 🔴 没实地用过不下判断;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md) ／ 🔴🔴🔴 config 里的 placeholder/说明文案 ≠ 实际行为 → [详](feedback_placeholder_is_not_behavior.md)
3.2 🔴 被「共享资源」拦两次先 `json.loads(settings.json)` 查权限文件;唯一硬墙=改自己的 settings.json → [详](feedback_retry_before_escalating.md)
3.5 🔴🔴🔴 「前台有没有X」只认商家端 config 接口,admin config 不是前台真值 → [详](reference_thinknova_frontend_truth.md)

## L1 · 改配置/提示词前
4. 🔴 先查字段读取图,拉真实任务 input 确认字段真在 → [详](reference_thinknova_prompt_fields.md) ／ 🔴🔴🔴 字段语义不确定=先问技术 → [详](project_thinknova_0729_screenwriter_stack.md) ／ 🔴 台词出问题先查 visualHint → [详](feedback_visualhint_leaks_into_lines.md)
4.6 🔴🔴🔴 提示词有字数上限(现拉线上),关键规则前置;查「有没有某能力」读 `capability` 不拿正则猜 → [详](project_thinknova_0729_screenwriter_stack.md)
5. 🔴 指派式>禁令式 → [详](feedback_directive_over_prohibition.md) ／ 🔴🔴 文案主语是机器=返工 → [详](feedback_customer_view_not_machine_view.md) ／ 微信线（09-15 停）→ [A/B/C](feedback_wechat_learn_safe_zone.md) [单向](feedback_group_oneway_broadcast.md)
6. 🔴 落库≠送达 → [详](feedback_evidence_standard.md) ／ 🔴🔴 ⛔`opsEditable.stagePromptPresets.image_to_video` 写不进 ／ 🔴🔴🔴 grok 混语言=只剩 BGM → [详](project_thinknova_language_pack_rollout.md)
7. 🔴🔴🔴 改提示词前必读那九条 → [详](feedback_prompt_change_hard_rules.md) ／ 🔴🔴🔴 验收先有修复前基线,⛔不许用检测器代替人眼 → [详](feedback_evidence_standard.md) ／ 🔴🔴🔴 交付件=能直接发 → [详](feedback_deliverable_is_postable.md)
8. 范围边界必写反向+双向验收 → [详](feedback_tech_doc_checklist.md) ／ 🔴 动前端读的字段先改一条验 → [详](project_thinknova_dingdian_koubao.md) ／ 🔴🔴🔴 报技术单前先穷举自己这一侧 → [详](feedback_tech_doc_checklist.md)
8.5 🔴🔴🔴 案例三条:名实一致、素材必须真有、改一个只影响一个 → [详](feedback_case_name_matches_output.md) [详](feedback_case_change_no_blast_radius.md) ／ 🔴🔴 加行业/场景先翻技术文档 → [详](project_thinknova_brand_product_industry.md)
8.7 🔴🔴🔴 案例 PUT=整体覆盖(全字段) → [详](feedback_boss_rulings.md) ／ 🔴🔴🔴 列表接口先读 `pagination.total`,pageSize 上限现拉 → [详](reference_thinknova_option_scene_rules.md) ／ 🔴🔴 中间态≠跑通,只认终态
8.8 🔴🔴 工作台:提示词上限按**字节**算(现拉线上)、规矩前置、voiceover 不许写正脸说话 → [详](reference_thinknova_video_studio.md) ／ 🔴🔴 写入走 `x-csrf-token` → [详](reference_thinknova_paths.md)

## L2 · 烧单核验时
8.9 🔴🔴 烧单前报客户视角五要素 → [详](feedback_burn_report_format.md) [详](feedback_evidence_standard.md)
9. 🔴 逐帧通看+量死寂,单帧截图=假结论 → [详](feedback_evidence_standard.md) ／ 🔴 烧完验三件:`task.model`/编剧 source/字数 → [详](project_thinknova_0729_screenwriter_stack.md)

## L3 · 给技术发文档前
12/14. 🔴 给技术只发技术才能处理的 → [详](reference_tech_doc_submission_spec.md) [自检](feedback_tech_doc_checklist.md)

## L4 · 汇报沟通时
16/18. 每轮说清「验收什么+做了什么」 → [详](feedback_communication_principles.md) [plan](feedback_questions_via_plan_mode.md) [新鲜度](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反 = 事故)
20. 🔴 密钥不外发不打印;按 PID 杀进程 → [详](feedback_kill_python_scope.md) ／ 🔴🔴 外发前扫 `LTAI`/`AKID`/`Signature=` ／ 🔴🔴🔴 heredoc 吃反斜杠,路径用正斜杠 → [详](feedback_no_backslash_in_heredoc.md)
22. 🔴 线上 config=唯一真值,禁种子覆盖 → [详](feedback_dont_edit_prod_config_structure.md) ／ 🔴🔴 上下文唯一杠杆=减少往返:一段 JS 干完一整套只回摘要 → [详](feedback_context_budget_discipline.md)
23. 记忆只留当前状态 → [详](feedback_memory_keep_current.md) ／ 🔴 规则写 WHAT+DONE → [详](feedback_rule_hygiene.md);老板发的提示词当天归档 → [详](reference_prompt_library.md) ／ 🔴 归因只记来源事故不记谁抓谁 → [详](feedback_attribution_record_source_not_who.md)
---

# 用户与沟通
- 🔴 [AgentMemoryVault](reference_agent_memory_vault.md) — 开工 pull+读信箱,收工只 add 自己的文件并验远端
- [用户画像](user_profile.md) — 跨境电商 BD/运营,新加坡;TikTok 达人 SaaS + ThinkNova 双线
- 🔴🔴 [回复老板一律中文](feedback_reply_in_chinese.md) — 含提问选项和文件说明;对外素材按投放语言
- 🔴🔴🔴 [文件放哪](feedback_file_placement.md) — 桌面=`D:\SamsoData\Desktop`,C 盘桌面是假的;桌面只放成片/成图

# ThinkNova(实体店内容 SaaS)

### 动手前必背
- 🔴🔴🔴 [编剧层现状源](project_thinknova_0729_screenwriter_stack.md) — 动编剧/长度/台词/烧验第 0 步;`lineValidation`=全片总计、且校验的是剥掉声线外壳后的字数
- 🔴🔴 [商家端=前台真值](reference_thinknova_frontend_truth.md) / [技术文档索引](reference_thinknova_tech_docs_index.md) / [模型台账](reference_thinknova_multiref_model.md)
- 🔴🔴 [提示词字段读取图](reference_thinknova_prompt_fields.md) / [场景·选项·案例写入路由](reference_thinknova_option_scene_rules.md)
- 🔴 [两条管线](reference_thinknova_pipeline_flow.md) / [提示词架构](reference_thinknova_prompt_architecture.md) / [Grok 红线](reference_grok_content_policy.md) / [权限地图](reference_thinknova_config_powers.md) / [路径](reference_thinknova_paths.md)

### 现行状态(索引只写「什么时候看哪个」,事实在文件里)
- 🔴🔴🔴 [国内营销线](project_thinknova_marketing.md)(主战场;10-11 起：对标库+评论区选题、四步流水线、3+4 对照实验;⏸微信 09-15 停;出稿跑 `_check_*.py`) ／ [发布与渲染的坑](reference_publish_ops_gotchas.md) ／ [工作台出镜头](reference_studio_shots_for_marketing.md) ／ [小红书](project_thinknova_xhs_line.md)
- [活动线](project_thinknova_sg_events.md)(08-30 停线下会)
- 🔴🔴🔴 [片型+案例库](project_thinknova_film_types.md) ／ [视频线与海报线是两套表](reference_thinknova_option_scene_rules.md) — **条数一律现拉线上**
- 🔴🔴🔴 [视频链定稿](project_thinknova_language_pack_rollout.md) + [双模型/多参](reference_thinknova_multiref_model.md) — 动 grok/参考图/负面词前必读
- 🔴🔴🔴 [海报线](project_thinknova_poster_video_purge.md) ／ [场景改造](project_thinknova_poster_scene_revamp.md) — 09-01 已移交总指挥
- 🔴 [配乐工具链](reference_audio_toolkit.md)（FluidSynth + 真实乐器音色库，10-01 起替代纯代码合成）
- 🔴🔴 [口播/裁格](project_thinknova_0729_koubo_defect.md) / [东南亚语言](project_thinknova_sea_languages.md) / [竞品](reference_competitor_gravity_ai.md) / [定价+大使](project_thinknova_pricing_ambassador.md) / [HyperFrames](reference_hyperframes_production.md) / [音色克隆](reference_voice_clone_pipeline.md)
- [抖音封面](reference_douyin_cover_benchmark.md) / [打分校准](reference_cheat_gates_calibration.md) / [横屏X](reference_hengping_x_pipeline.md) / [两个 Agent](project_thinknova_offline_agents.md) / [博客 API](reference_thinknova_blog_ops.md) / [发布深链](reference_thinknova_publish_schemes.md) / [提示词库](reference_prompt_library.md)
- 🔴🔴🔴 后台接口在 `api.thinknova.top` 同源页跑 fetch（cookie 鉴权）→ [详](reference_thinknova_paths.md)
- 🔴 待办总账 → `03_工作台\待办总账_从记忆迁出_2026-08-24.md`

### 内容与产品规矩
- [零动脑](feedback_thinknova_zero_brain_northstar.md) / [不做合规](feedback_thinknova_content_not_compliance.md) / [缺口双查](feedback_case_gap_dual_check.md) / [小红书交付](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md) / 🔴[烧单≤6单/周](feedback_burn_budget_weekly_cap.md) / 🔴[先分析再做·只提前1周](feedback_analyze_before_making.md) / 🔴[知识片要活人感](feedback_knowledge_film_live_feel.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — 建案例前必读,新建必过 3 条自检
- 🔴🔴 验收四铁律:成片四项齐验 / 门槛不跨片型 / 「写满」须给合法填充 / 子 agent 挤字数须列不可删清单 → [详](feedback_evidence_standard.md)

# 商务与融资
- 🔴🔴🔴 [海外邮件营销线](project_overseas_email_outreach.md) — 新马英文冷邮件,系统在 `03_工作台\邮件推广系统\`;❗正则/中文代码绝不走 heredoc
- 🔴🔴 [投资人线](project_thinknova_investor_plan.md) — 谈融资/预算前必读，内部件不外发；海外探测计划 08-30 版第八节

# 其他
- 休眠:[Compass](project_compass.md)/[鞋包](project_sg_footwear_proposal.md)/[小孩数学](project_kid_math_tutoring.md)+[课程表](reference_kid_math_roadmap.md)/自营 30 天计划(03_工作台 下 08-10 版)
- 🔴🔴 两库入口=本机 `README_从这里开始.md`+Obsidian 书签「① 从这里开始」;归档=移动不是删除;skill 台账见 `00_规格与参考\`
