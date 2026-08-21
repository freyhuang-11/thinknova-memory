# 铁律 · 按触发时机分层(按"什么时候用"排;漏 = 该用时没想起来)
> 这里只放**触发条件 + 一句动作**。案例、字段路径、复盘全在链接文件里,该用时打开。

## 🔴🔴🔴 L-1.5 · **执行前必读路由表**(老板 08-21 定:"执行前先看文档,不然每次都会忘")
> **动手前先在这张表里找到你要做的事,把对应文件打开再动。** 找不到对应行 = 先问,别猜。

| 我要做什么 | 先开哪个 |
|---|---|
| **任何后台写操作**(改 config/案例/模型) | 🔴 `00_规格与参考\执行手册_后台操作_2026-08-21.md` — 动手五问 / 字节账 / 真通道 vs 死字段 / 验证四步 / 八个重复踩过的坑 |
| 烧验证单 | 🔴 `00_规格与参考\烧单前强制自查表_2026-08-18.md`(A–I 九节逐条打勾) |
| 动编剧/台词/长度/字数窗 | [[project-thinknova-0729-screenwriter-stack]] |
| 动 grok/H3/参考图/负面词/提示词 | [[project-thinknova-language-pack-rollout]] + [[reference-thinknova-multiref-model]] |
| 动片型/案例库/场景表 | [[project-thinknova-film-types]] |
| 做探店片型 | [[reference-competitor-gravity-ai]](萍萍公式) |
| 改 config 字段(查口径) | [[reference-thinknova-tech-docs-index]] |
| 下"前台有没有X"的结论 | [[reference-thinknova-frontend-truth]] |
| 建案例 | [[feedback-case-low-coupling]](3 条自检) |
| 动海报场景/案例/styleRule | [[project-thinknova-poster-scene-revamp]] |
| 海报出问题 | [[project-thinknova-poster-video-purge]] |
| 动输出语言 | [[project-thinknova-sea-languages]] |
| 写小红书 | [[project-thinknova-xhs-line]] |
| 做抖音封面 | [[reference-douyin-cover-benchmark]] |
| 比较两批打分 | [[reference-cheat-gates-calibration]] |
| 做横屏口播片 | [[reference-hengping-x-pipeline]] |
| 用哪个 skill | [[reference-skills-routing]] |
| 谈融资/预算 | [[project-thinknova-investor-plan]] |
| 接"上次的活" | [[feedback-parallel-sessions-check-first]](先看记忆文件修改时间) |

## 🔴🔴🔴 L-1 · 唯一入口:[行动闸门](feedback_action_gates.md)
**动手先过闸,每道闸先输出可检查产物**:闸1 现状源 → 闸2 字节账(挤掉谁) → 闸3 爆炸半径 → 闸4 attemptCount → 闸5 单条验证+老板过目才铺开。**先读后动,先验后铺**;L0-L5 是细则。

## 🔴🔴🔴 L-0.5 · 动手前先查 skill 路由表 → [什么场景用什么 skill](reference_skills_routing.md)
三条铁规矩:①`hyperframes`=任何视频/动画强制入口 ②`cheat-score-blind`=内部 sub-agent 主对话绝不调 ③组合拳顺序不乱(视频稿=video-script-style→high-retention-hook→hkrr-clock→hurricane-shot-prompt)。08-11 两跟头全是没查表。

## L0 · 每次开口/动手前
0. 🔴🔴🔴 **权威源(技术文档/线上真值/代码)> 我的记忆**;下关键结论前回源核对,实验结论标「实测·待核」带任务号、不外推 → [详](feedback_source_truth_first_commander.md)
1. 🔴 判断"现在/多久前"**先跑 `date`** → [详](feedback_check_time_first.md)
2. 🔴 **提议≠指令**;模糊回复先确认再动手 → [详](feedback_dont_assume_requirements.md)
2.5 🔴 **例程内能自己拍板的自动跑**,别每天拿老问题问老板 → [详](feedback_dont_assume_requirements.md)(同文件反向边界段)
2.7 🔴 **接"上次的活"先看记忆文件修改时间**;另一会话可能几分钟前刚推翻我的结论 → [详](feedback_parallel_sessions_check_first.md)
2.8 🔴🔴🔴 **老板给的词按他的字面做满,不许自己缩窄定义再报"全部完成"**;拿不准边界先问 → [详](feedback_dont_assume_requirements.md)(「缩窄定义」段)
2.9 🔴🔴🔴 **「几天没落库/通道零变化」不许推出「他没干活」**;先排查同步链路,区分不了就如实写。快照证明那一秒的状态,不是趋势不是意图——写到"截至X时仍是N"就句号(已犯两次:08-05 冤枉 Codex、08-14 博客快照) → [详](feedback_silence_is_not_evidence.md)
3. 🔴 **没实地用过不下判断**;接口通≠功能通,必实机 → [详](feedback_understand_before_judging.md)
3.1 🔴🔴🔴 **config 里的 placeholder/说明文案 ≠ 实际行为**;对外说任何产品能力前必须有 A/B 实测任务号。08-11 血案:placeholder 写「写台词会照着念」,实测**光填进去平台会改写**,要加一句「一个字都别改」才一字不差,而老板已照错稿录完片 → [详](feedback_placeholder_is_not_behavior.md)
3.2 🔴 **写入被拒先原样重试一次再说**;别把"这条命令能不能发"退回给老板。**唯一硬墙=改我自己的 settings.json 权限段(classifier 死拦,也不许绕,只能给老板贴;08-02 已贴好 36 条 allow)** → [详](feedback_retry_before_escalating.md)
3.5 🔴🔴🔴 **「前台有没有X」只认商家端 config 接口,admin config 不是前台真值;新文档与旧记录冲突以最新覆盖** → [详](reference_thinknova_frontend_truth.md)

## L0.6 · 🔴🔴🔴 三道关口:方案 → 文案 → 才许渲图(老板 2026-08-15 定)
**关口一:每周内容开工前先交"三条线方案"(讲什么/为什么/素材有无),老板点头才许写稿**——08-13~15 三批十八条抖音稿全是方案层跑偏写到成稿才被看见;方案被否废十分钟,成稿被否废一整批。
**关口二:「所有要渲染作图的内容是沟通没问题了才做」——文本→点头→才渲卡/封面/成图**;08-13~15 连犯三次(微信七卡/小红书封面/抖音封面)全是没过目先渲完。交付形态=纯文本过目件,渲卡脚本改好**不执行**。同源=闸5。

## L0.8 · 🔴🔴🔴 预设即产品(老板 2026-08-13 定调)
**「商家 90% 以上用默认设置,把工作做进预设是我们系统的意义。」** 三推论:①**验证必须走默认路径**——烧单手动传了某个 selectedOptions 就等于没验那维度的默认值(08-13 血案:手动传 appearanceMode 验好了,默认 product_only 实际出片两人剧无人入镜)②**预设错=全量事故**,四个 Preset 真进提示词(prefill 只是灰字),改必须连源模板一起改 ③新建案例先问"默认值对不对"再问"选项全不全"。

## L1 · 改配置/提示词前
4. 🔴 **先查字段读取图**:拉一条真实任务 input,确认目标字段真在里面 → [详](reference_thinknova_prompt_fields.md)
4.3 🔴🔴🔴 **配置字段的语义(每句还是总计?目标还是边界?)不确定=先问技术,绝不凭直觉配**——lineValidation「总计」被我当「每句」配,一字之差造出电报体+连环回退+语速慢三症,烧十几单才定位 → [详](project_thinknova_0729_screenwriter_stack.md)
4.5 🔴 **台词出问题先查 visualHint** → [详](feedback_visualhint_leaks_into_lines.md)
4.6 🔴🔴🔴 **提示词≤4000字(字数),言简意赅目的明确,废话重复矛盾全删(07-31 老板通则)**;同一文档两条规则打架时模型行为不可预测,加新规则前先想清挤掉谁 → [详](project_thinknova_0729_screenwriter_stack.md)
4.7 🔴🔴🔴 **关键规则一律前置(07-30 老板通则)**;但前置救不了超长提示词——11095字时置顶也没用,**先减肥再谈位置** → [详](project_thinknova_0729_screenwriter_stack.md)
4.8 🔴 **查"有没有某能力"读结构化字段(`capability`),不拿 code/name 正则猜**
5. 🔴 **指派式 > 禁令式**;必须禁止时禁令后立刻跟替换项;「写满」类要求必须给贫料出路,否则模型拿空话注水 → [详](feedback_directive_over_prohibition.md)
5.3 🔴🔴 **微信群【多学一点】新口径(08-15 老板改)**:讲 **AI 类知识 + 最近更新了什么能帮到开店的人**(政策/工资单/GST 那类全废——老板:「其他东西你要他们知道来有什么用」);**第三层必须给一句能直接复制去对 GPT 说的话**,不是"你可以去做X";**凡"生成对外文字图片视频"仍一律不教**(=教他们绕过我们);⛔ **免责句「以XXX为准」全部作废**(老板:「我们是给咨询」),渲卡自检已反转成"出现就报错";不要明日预告;**事件类须近4-6周,数据/调研类不适用时效线** → [详](feedback_wechat_learn_safe_zone.md)
5.4 🔴🔴 **微信群=单向输出**:提问全周最多1次(周五点单日),冷场也不许加互动;「实事」只讲**实体商家用AI的事件**(主角是开店的人,不是技术),查不到就不发 → [详](feedback_group_oneway_broadcast.md)
5.5 🔴🔴 **对外文案主语是机器 = 返工**:禁「都不是人写的/AI生成的/机器做的」,一律翻成客户视角「这些都不用你想」;自贬话术全禁(平台的「AI生成」标注照勾,那是字段不是文案) → [详](feedback_customer_view_not_machine_view.md)
6. 🔴 **落库 ≠ 送达**:PUT 200 只证明写进库;前台/烧单看见才算上线 → [详](feedback_evidence_standard.md)
6.4 🔴🔴🔴 **英文化已上线(08-16 凌晨,回滚=`00_规格与参考\ROLLBACK_全量英文化前_2026-08-16.json` + `ROLLBACK_iv_stage_presets_…`)**:videoTemplate/firstFrameTemplate/durationPolicies(10/15/30)/负面数组(两层20项)全英文;systemPrompt **4000字整**加【cells语言】规则(cells 全英/台词 copyLanguage;为腾字删了三句冗余)。**验证单 `task_de951043a1fc`:cells 0 中文、台词纯中、`[Overview]` 拼装正常、除台词外残余中文=114字=恰好技术三处**。⛔ **`opsEditable.stagePromptPresets.image_to_video` 五字段运营写不进(两次 PUT code:0 回读原值=服务端丢写)**,含两个后发现的出站中文源:`prompt` 包装层987字(逐格执行/声音细节整段)+`negativeGuard`;英文文本=`02_交付内容\附件_OPS-VIDEO-20260816-01_stagePromptPresets英文文本.json`。**交付状态:卡01/卡02 初版老板已发技术;后续变更全在《增量_OPS-VIDEO-20260816-01与02_补充说明》+附件,老板待补发**——卡01技术3处(骨架标签/负面词第一段/五字段通道),卡02问题2改为A(上限回2,零新活)/B(单if换1:1)由技术自选。⚠️ 过渡期现状:多参单(商家传≥2图)台词仍中文=照旧无声,A 落地即堵。
6.5 🔴🔴🔴 **grok 提示词语言定律(08-16 终版,台账=`01_问题诊断\英文提示词实验台账_2026-08-15夜.md`)**:①**多参(实发≥3)混语言=音频宕机只剩BGM;整条单一英语=活**(混60字中文即哑/混日文死寂/纯英即说;去BGM句救不了) ②**少参(板+1)任意混语全出声且台词逐字照念**——`task_2e250fdf2217` 中文骨架+日文台词=**日语98.6%置信逐字念出,原话保真** ③**日语在 grok 多参下 0/5 判死**(令说/原文/罗马音/前置声明全灭,唯一出声那次抗命说普通话)④纯英说中文=意译不保原话字面;成功率≈2/3非100% ⑤英文负面词生效=零字幕、三锁全中;**1:1还原只有多参给,少参靠板继承="像"级——1:1与全语言保真不可兼得** ⑥**带水印/带字的图绝不能当参考图尤其主图**(点评截图当主图→满屏字幕+水印)⑦待办:非中文语言**语速过快**,治法=lineValidation 按语言收紧(主)+节奏句(辅),ops 待做。
7. 🔴🔴🔴 **出站 videoPrompt 上限 4000 字节 = 死规矩(08-21 技术实测确认:grok 和 H3 都是 4000,不是只有 grok;旧记「4096只是grok的限制/minimax走maxBytes」作废)**:videoPrompt = videoTemplate(现 1660B)+ 编剧写的 cells;撑爆它的是 cells。**超限时系统丢的是台词**(实测出现过出站串零台词、模型自己编到乱码)。现行安全值=systemPrompt 里 cells 预算 **620 字**,实测产出稳定 3100–3700B,最近 15 单零丢失。**改任何进 videoPrompt 的字段只许减字,要加先删等量**;两个都要量:编剧产出 `compiledPlan.videoPrompt` 与实发 `child_tasks[video].input.prompt` → [详](feedback_prompt_change_hard_rules.md)
7.02 🔴🔴🔴 **`videoTemplate` 里「开场0.15秒纯黑」是设计不是 bug,永远不许删(08-21 血案)** — 它的作用是**盖住拼板出现那一瞬**,给模型一个「黑完直接进第1格」的起手锚点。我把它换成「不加黑场不淡入」后,**grok 开场直接从拼板开始播,露 1.5 秒六宫格**(2/2 复现);H3 理解力强不依赖这个锚点,0/2 不受影响。A/B 同案例同模型单变量已证因果:改坏的 `task_e7314b975cc9` 0–1.5秒整屏六宫格 vs 回滚后 `task_75272b48f513` 第一帧即单格全屏。⛔ **删提示词里任何一句之前先问「它为什么在这里」**;⛔ **动 videoTemplate 必须先存回滚文件**——这次没存,只能靠历史任务 `input.prompt` 反推原文才救回来 → [回滚记录](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/ROLLBACK_videoTemplate_黑场句_2026-08-21.md)
7.05 🔴🔴🔴 **生图链(text_to_image)也被 4000 字节截断,08-19夜~08-20 技术新上,一刀切套错了链** — 原文 12000–14200 → 一律砍到 4000,**从尾部硬切在句中**;拼装顺序 globalRule→taskGoal.firstFrame→案例visualHint→**firstFrameTemplate(尾)**,于是【零文字】【板结构】【参考图优先】【拟真肤质】【色泽/表情/光影铁律】**整段被砍光** = 「板上突然全是字幕」的根因。⛔**判据字段 `input._prompt_truncated`/`_prompt_original_bytes`,08-19 及以前根本不存在**。✅已解:把零文字+板结构两条前置进 `taskGoal.firstFrame`(369→647字,三处镜像),验证单 `task_07b8030fb728` 出板零文字;回滚=`ROLLBACK_taskGoal_firstFrame_2026-08-21.txt`。⚠️连带实锤:**商家 storeName/offer/extraRequirement 根本没进生图 prompt**(只有产品名进)=「门头编店名」真因,待发技术 → [手册十](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/执行手册_后台操作_2026-08-21.md)
7.1 🔴🔴 **案例 visualHint 里一个字都不许写声线/语调/节奏**:实证同案例三版(原状重试1有台词/加声线重试3无台词/纯指派重试4无台词)——换气停顿类指令→编剧压短台词→撞 lineValidation 下限→连环重试→空台词。**声线节奏归全局 videoTemplate【口播节奏】段** → [详](feedback_prompt_change_hard_rules.md)
7.2 🔴🔴 **烧单是验证手段不是探索手段**:动手前先读现状源(screenwriter-stack→koubo-defect→线上config),08-08 全天跳过这步走了三条弯路(声线/镜头/架构分层记忆里本来就有) → [详](feedback_prompt_change_hard_rules.md)
7.5 🔴🔴🔴 **交付件 = 能直接照着发的东西(08-16 老板连打两次)**:旁边不许躺 `.bak`(挪进 `_历史版本\`)、正文里不许混我的自查注和复盘(搬进 `_说明.md`)、txt 一律 **utf-8-sig**;⛔ **emoji 键帽 `1️⃣`–`5️⃣` 在记事本是方框**(三码位组合),换 **①②③④⑤** → [详](feedback_deliverable_is_postable.md)
8. **范围边界必写反向**:附"作用域仅X、不碰Y"+双向验收 → [详](feedback_scope_boundary_explicit.md)
8.5 🔴 **动"前端会读的字段"先改一条验,别一次铺满** → [详](project_thinknova_dingdian_koubao.md)
8.53 🔴🔴 **案例名实一致:场景+案例名承诺的=成片生成的**;交付不了就改名,不许挂着做不到的承诺;烧单验收多一问"这是不是标题说的那个东西" → [详](feedback_case_name_matches_output.md)
8.55 🔴🔴🔴 **改一个案例只许影响这一个案例**:案例问题只在案例层解;根因在全局模板时做**显式开关**(全局原句一字不改+窄口径条件,暗号埋进目标案例),动全局前先扫库量爆炸半径,命中>1就收窄;改完烧对照单证明没带偏 → [详](feedback_case_change_no_blast_radius.md)
8.6 🔴🔴 **加行业/加场景先翻技术文档**;新场景必须技术注册进合法枚举,否则商家建单500 → [详](project_thinknova_brand_product_industry.md)
8.7 🔴 **建单500 诊断法**:admin GET 全量真值 → 隔离实验换维度 → 找唯一缺键 → [详](project_thinknova_brand_product_industry.md)
8.8 🔴🔴 **config/案例写入唯一正解:GET 响应头拿 `x-csrf-token` → 带头 PUT(agent 整体/案例单条/businessUi 都通,07-31 解锁)**;419-UI 弹窗法废弃;重 SPA 页会冻死 CDP,fetch 一律在 robots.txt 轻页跑 → [详](reference_thinknova_paths.md)

## L1.9 · 🔴🔴🔴 动后台前先开手册 → [执行手册·后台操作](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/执行手册_后台操作_2026-08-21.md)
老板 08-21 定:「你一直在丢规则,把技术给你的规范整理进执行手册,每次执行后台操作前看一下」。手册含:动手前五问 / 4000字节硬账 / 真通道与死字段对照表 / 写入配方 / 验证四步(回读≠生效) / 成片四层验收 / 已重复踩过的八个坑。

## L2 · 烧单核验时
8.85 🔴🔴🔴 **烧单前逐条打勾 → [烧单前强制自查表](../../../../D:/SamsoData/Documents/视频制作平台分析/00_规格与参考/烧单前强制自查表_2026-08-18.md)**(老板 08-18 定「新问题可以有,老问题不许反复」):A字节账(≤3600预留4000硬顶)B配置键要在真实任务里确认生效(byLanguage.en 才是真键;stagePromptPresets/languagePolicy.map 写不进)C查规则互搏 D改对该链模板(en 链模板在 languagePacks.en.masterPipeline...) E案例+行业双轮换 F四层验收全做(含下载板图看图) G一次一单、失败先查根因
8.9 🔴🔴 **烧单前必报客户视角五要素**(行业/场景/案例/补充信息/验证目标) → [详](feedback_burn_report_format.md);**变量做满再烧** → [详](feedback_prompt_first_then_test.md);🔴 **烧验案例轮换(老板 08-17 定)**:古法窑鸡案例已 100+ 单退休,验证烧单换着案例/行业烧,过关成片抽帧进封面池(一鱼两吃)
9. 🔴 **逐帧通看**(联系表);音频量死寂;单帧截图=假结论;**证据成对**(真实输入↔输出+任务号,串行≥20秒) → [详](feedback_evidence_standard.md)
9.5 🔴 **烧完先验三件:task.model 实际派发、编剧 source、字数落区间** → [详](project_thinknova_0729_screenwriter_stack.md)

## L3 · 给技术发文档前
12. 🔴 **只发技术才能处理的**(逐条自验"我能不能改");**9段规范**,事实/判断/期望分离,一份最多3问题 → [详](reference_tech_doc_submission_spec.md)
14. **发文前 7 条自检;发出即冻结,新内容走增量** → [详](feedback_tech_doc_checklist.md)

## L4 · 汇报沟通时
16. **每轮说清"验收什么+做了什么"**;说重点/有据质疑/别奉承/追根因/先讨论再操作 → [详](feedback_communication_principles.md)
18. **要老板拍板用 plan 模式问** → [详](feedback_questions_via_plan_mode.md);**数据新鲜度别贴"过期"也别埋雷** → [详](feedback_data_freshness_framing.md)

## L5 · 环境红线(违反 = 事故)
20. 🔴 密钥不外发不打印不进 git;🔴 禁 `taskkill /IM python`,按 PID 精准杀,临时服务器用完即杀 → [详](feedback_kill_python_scope.md)
22. 🔴 线上 config=唯一真值,禁种子覆盖;464 不主动加白;408/409 未经老板同意不启用;**结构/新字段一律交技术,我只碰纯文本** → [详](feedback_dont_edit_prod_config_structure.md)
22.7 🔴🔴 **上下文唯一杠杆=减少往返**:一段 JS 干完一整套只回摘要;读文字不截图;证据走联系表 → [详](feedback_context_budget_discipline.md)
23. **记忆只留当前状态**不堆矛盾层 → [详](feedback_memory_keep_current.md);**老板发的提示词当天归档** → [详](reference_prompt_library.md)

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
- 🔴🔴🔴 [片型体系+案例库现状](project_thinknova_film_types.md) — **08-18 片型分化两刀已落地**:场景要点升为最高优先级 + 545 条案例按场景改写【台词方向】(七场景验收全过,回滚配方已存);⛔`panel_crop`=一镜到底模式**不是通用防漏板开关**,别全库铺。场景表 10 个/案例 734+861;三档定档
- 🔴 [故事板取证](project_thinknova_storyboard_test.md) / [字节手术+无台词开关](project_thinknova_0729_byte_surgery.md)(voiceMode=none 早就有,22条TVC在用) / [品牌产品+TVC场景](project_thinknova_brand_product_industry.md)(S14已上线;建单500排查法) / [定点口播线](project_thinknova_dingdian_koubao.md)(Atomy)
- 🔴🔴🔴 [国内营销线](project_thinknova_marketing.md) — **主战场·08-10 重启**:定位=「一个人+AI」实录老板出镜;变现分层=抖音小红书引流→微信群转化→线下会成交;cheat-on-content 打分→盲预测→T+3复盘;🔴微信群每天出货=唯一硬规定;标签固定选题必变;AI标注必勾
- 🔴🔴 [新加坡线下会议线](project_thinknova_sg_events.md) — 🔴首场 2026-08-22(周六)14:00-17:00 Suntec Tower2 L7,之后每周六;成品=v7.pptx 21页+邀请函中英12张(带码发朋圈/无码发小红书IG,🔴小红书版绝不能有二维码);主线=「生产+发送内容才是核心」禁自贬话术
- 🔴🔴🔴 **微信群每日运营=全线唯一硬规定(08-10 拍板,08-11 起每天出货)** — 形态=知识卡(HTML模板渲染,**文字绝不走AI文生图**)+群文案,落款「整理·ThinkNova」必留,AI视频实事不许编;模板/样卡/7天包在 `03_工作台\群内容\`;**发送永远人工老板过目**
- 🔴🔴🔴 [小红书线现状](project_thinknova_xhs_line.md) — **写小红书前必读**:人设=给实体店做图片的人·一天一店一篇;分享vs教只差主语(出现"你/应该/别"=返工);封面=经营类底图+大字,底图走 S14 新烧
- 🔴🔴 [抖音封面对标](reference_douyin_cover_benchmark.md)(做封面前打开真图看,29张已存;差距=头占41.5%/元素4-9个/亮背景托暗人/**选帧**;天花板是打光不是设计) / 🔴🔴 [打分闸门与校准](reference_cheat_gates_calibration.md)(**比较两批分数前必读**:跨批不可直接比,必须夹带锚点测漂移)
- 🔴 **两把尺+四件套 skill** — 小红书笔记 `/xhs-note`(违禁词最高危=「搞钱/变现」),冷启动 `/xhs-growth`;视频脚本按序 `video-script-style`→`high-retention-hook`→`hkrr-clock`→`hurricane-shot-prompt` → [国内营销线](project_thinknova_marketing.md)
- 🔴🔴🔴 [横屏 X 式管线](reference_hengping_x_pipeline.md) — **做横屏口播片第0步必读**:规则定过五次散在五处、cut.py 抬头写「小蓝那套」但实现零抠像(断的);抠像必须 20帧/块+降到1440×810+断点续跑+等内存回落+TIMEOUT 240;示意图锁 0–55% 带内可绕开「人压素材vs避让」那条未裁定的规矩
- 🔴 [定价+推广大使](project_thinknova_pricing_ambassador.md)(海报6/视频60;omni·wan·sora=3分/秒,grok系=4分/秒) / [HyperFrames](reference_hyperframes_production.md) / [音色克隆](reference_voice_clone_pipeline.md) / [两个Agent工程主线](project_thinknova_offline_agents.md)
- 🔴🔴 [竞品·引力Ai/萍萍拆解](reference_competitor_gravity_ai.md) — **探店片型第0步必读**:萍萍台词公式(钩子→价格锚→短句→三连催单,催单待老板放行);真差距=TTS声调+切镜密度+台词结构;omni已砍;探店案例=`food_beverage_s01_tandian`
- 🔴🔴🔴 [海报线现状+P0编造事故闭环 08-10](project_thinknova_poster_video_purge.md) — 海报出问题第0步:**拒绝编造6处守卫已上线(修一处不算修完,同铁律多层各一份)**;判编造先查商家资料注入;海报烧单走 business-assets(caseId必填);837条底细/615视频克隆/123清毒;S07/S08未美图化待排
- 🔴🔴 [海报场景改造 08-03](project_thinknova_poster_scene_revamp.md) — **动海报场景/案例/styleRule 第0步必读**:美图式「渠道×版式」16场景;S11/S16 轻内容被 copy 层压住(08-15 技术已支持 copyMode,待周六配+验);场景注册/迁移/PUT 配方全在文内
- 🔴🔴🔴 **08-13 案例库大整改收官** — 场景表 14→10、109 条归位/改名/清黑话、预设修正(S11 shotCount 1→5、S08 统一 customer_pickup)、两线 CTA 默认全取消;探店打卡四形态定案(达人代看=萍萍式放 S05) → [片型](project_thinknova_film_types.md)
- 🔴🔴 **海报去重 bug(08-13 查清,08-15 技术已修 label/promptText 分离,待周六验收)** — offer 被服务端填进标题/价格/卖点三槽位;⛔结构性事实记住两条:**案例 visualHint 送不到文案模型**(其 input.state 无 caseId/visualHint,视觉字段管不了文案);尾部「海报标题:…」串=服务端硬编码,config 搜不到。全档 → 合订本 `02_交付内容\给技术_合订本_四问题_2026-08-14.md`
- 🔴🔴🔴 **多参无人声 · 最终结论(08-13 受控实测)** — **图越多越不稳,措辞救不了**(2图 2/3、3图 1/3、4图 0/3);✅解法=技术把 i2v 实发砍到 2 张(实测生效,同配置从 0/3 → 2/2 说满);🔴失败形态**不是静音,是音轨被音乐占满**(浊音 80–93% 无停顿),报现象别说"零人声";⛔当晚八条错结论全是单侧取样当规律 → [多参台账](reference_thinknova_multiref_model.md) [取证纪律](feedback_source_truth_first_commander.md)
- 🔴🔴🔴 **08-14 线上真值(动任何提示词前先对这三个数)**:`systemPrompt` **3996** / `videoTemplate` **414(原版)** / `firstFrameTemplate` **894**。我 08-13 的四刀已全量回滚,现只保留三条经过单刀验证的:①【素材优先级】商家成句台词**一字不增删**(端到端验证:77字原话未改;短台词则原话打头再用商家自己的信息补满)②画板模板**对话剧角色区分**(同性两人靠发型+衣着颜色拉开,已验 1 单,人物参考图仍锁得住)③画板模板**同框多商品必须可辨识不同**(未烧验)。
- ✅✅ **「其他行业」= `industryId: custom` 已补齐(08-13)** — 视频10/海报16 条,每个启用场景各1条,**零空场景零缺封面零重复**(约375积分)。🔴`custom` **不在 `industryFilters` 表里**,统计行业覆盖必须单独加它。🔴**给 custom 烧样图必须显式禁行业指向 + 禁编造项目价格**(第一版没写→模型自己默认成美业还编了16个项目16个价格),**封面按版式配 `outputRatio`** → [片型](project_thinknova_film_types.md)
- 🔴🔴 **08-15 技术已修五问题(合订本 08-14 发出当天回2份运营说明)→ 欠线上验收** — ①minimax截断→**拒单**(422010不建单不冻积分;上限=能力JSON `input.fields.prompt.maxBytes` UTF-8字节现1200,调前先问上游;列表接口看不到,在编辑弹窗)②编剧信封已剥+格式异常只重试1次+新增 `masterPipeline.scriptwriter.textModel.maxOutputTokens`(线上值**字符串"4096"**;⛔老路径 `screenwriter.textModel` 仍并存,**动编剧参数认 masterPipeline 新路径**)③海报 label/promptText 分离 ④copyMode 三档已支持**要运营配场景** ⑤copyLanguage 已进文案层。**⚠️编剧验收第1单 `task_364bf8eb1c92` 未过**(3次尝试,invalid JSON 复现;可能Worker未重启,补2单再定论);海报③④⑤归周六。回执存 `00_规格与参考\技术侧文档\`
- 🔴🔴🔴 [视频链定稿(08-21 最新)](project_thinknova_language_pack_rollout.md) + [双模型台账](reference_thinknova_multiref_model.md) — **动 grok/H3/参考图/负面词/提示词前必读**。现行基线:**中文全链 + 板+1 + 默认模型 482 grok**(`is_default`),白名单 10/15秒都是 `[482,503]`;systemPrompt **4001字**、cells 预算 **620字**、videoTemplate **1660B**、firstFrameTemplate **1172字**;`referenceRouting` 2/2 全局共用。**503 = metaso H3「实景还原版」**:锁定强(瓶身标签全程一致)、能真硬切(工序片 5 刀 vs grok 0 刀)、多参 9 张;但**发音准确率低**(探店 86.7% vs grok 96.1%)、码率低、气更散。⛔ **案例表没有 model 字段 → 按案例分流模型做不到**,只有全局 `is_default` 和按时长的 `defaultModelByDuration`。窑鸡案例永久退休。
- 🔴 **08-16 晚海报三项验收 2 过 1 半**(copyMode=none✅/ms✅/分离半过,offer 一值三槽进急件2;copy 主提示词=服务端硬编码,运营唯一通道=`languagePolicy.map.<lang>`,map.ms 已加商品名原文+卖点条目两规则烧验过)→ 细节全在 [语言包 rollout 档](project_thinknova_language_pack_rollout.md) 海报节。剩余大项:303条重复封面≈1818积分待批、S14-16 铺行业(copyMode 已通)、paceLevel 问技术;
- 🔴 **未完待办** — ①🔴🔴 **台词语气退化(老板 08-16 深夜:对话剧调优期最好,现在变差)**:头号嫌疑=08-16 凌晨为塞【cells语言】删的 4 段语气规则(朋友安利/情绪爆点/机器味句),次嫌=08-15 技术把编剧温度 0.7→0.6 → 排查案=`03_工作台\台词语气退化排查_2026-08-16.md`,等技术稳定后单刀 A/B 烧对照;②周六海报侧清单其余项 → `03_工作台\周六待处理_海报侧问题清单_2026-08-16.md`;③公告栏上线后场景改名要发第一条公告;④⚠️ 6 条案例 `prefill.offer` 写的是说明文案,烧样图前必须换真实文案;⑤**黑场不关了(老板 08-21 定)** — ⚠️黑场有**两层**别混:(a)**`videoTemplate` 里的「开场0.15秒纯黑」= 提示词层,是设计,永远不许删**(见 7.02);(b)`deliveryPostProcess.entranceBlackOverlay` = 服务端后处理层,agent config 四处配 `{enabled:false,seconds:0}` 无效,服务端有自己一套默认 `{enabled:true,seconds:0.5,holdSeconds:0.12,opacity:1}`(多出的两个键 agent/商家 config 里都没有)。实测成片开头黑 0.208 秒。不再投入。
- 🔴🔴🔴 **场景表 = 10 个(08-12 老板拍板,前台+烧单双验)** — S01商品介绍/S02活动介绍/S04信息公告/S05探店打卡/S06手艺揭秘/S07前后对比/**S08剧情短片**/S10教程避坑/S11老板出镜/S14广告大片;下架 S03/S09/S12/S13 **留作空位不删**。🔴**改场景名必须同时改 `scenes[]` 和 `businessActions` 两张表(两个 label 都进编剧)**;【场景要点】已改 **sceneId 精确匹配**;⛔`sceneRules`/`scenePrompts` 内容不进编剧但结构必须在(缺了建单500);🔴`businessScenario` 与案例 `sceneIds[0]` 对不上直接 500001 → [场景规则](reference_thinknova_option_scene_rules.md)
- ✅ **格网已解+EMMA 结构上线(08-12)** — 解法=剧情片+`panel_crop`+窄口径暗号「分镜推进」(避开「单张实拍=一镜到底」分支,全局原句未动);EMMA=排他锁+角色卡常驻+情绪写在visual+时间非均分 → [口播裁格](project_thinknova_0729_koubo_defect.md)
- 🔴🔴 **语言分两层别混** — 输出语言 9 种(两侧齐);案例文案 i18n 只有 6 个界面语言,**两侧都没有 th/id/ms**;⛔**`visualHint` 只有 `zh` 键喂编剧,其余语言键是死数据**(vi/en 单实测收到的都是中文),前台可见的只有 title/summary/previewCaption → [字段读取图](reference_thinknova_prompt_fields.md)
- 🔴🔴 [东南亚语言扩充 08-04](project_thinknova_sea_languages.md) — **动输出语言第0步必读**:9语无β已上线双前台;界面 i18n(th/ms/id)已交技术;两条硬教训(动模板必量最大单字节/字数窗别一次收太紧)
- 🔴 **待测/待办小池**:①编剧层反呆板三刀草案(`03_工作台/编剧层反呆板手术方案_待测试_2026-08-04.md`,**风格类改动一律"单刀→AB烧验→老板过目→再下一刀"**)②门头做进核心设置待定 ③10秒单临时走15秒 ④门头/产品锁不死=模型问题等换模型 ⑤🔴 **`video-shotcraft` 只做平台演示片+路演片(老板 08-13 批,"不是这周")**。✅08-15 深扫定论:License 已查清(Remotion ≤3人公司免费,超了 $25/月1席,不是拦路虎);⛔旧记「零中文文档」作废——**152张镜头卡全是中文**,`references/shots/` 纯 Markdown 不装就能抄;审美规则 25 条可移植进验收话语 → 全文 `提示词参考库\参考_2026-08-15_video-shotcraft深扫_镜头卡与License定论.md`
- 🔴🔴 **08-14 外部参考入库 → [提示词参考库](reference_prompt_library.md)**(`参考_2026-08-14_漫剧五宫格四件套_硬切与口型.md`)。另一条可抄的:**videoPrompt 只写动态、静态全归 firstFrame**(他们给 grok 4096 只用 1200,正对我们字节账痛点)。
- 🔴🔴 **锁图三单 08-15(中文提示词基线,案例 `food_v2_S01_service_intro`,482/15秒,古法窑鸡)** — A 锁菜品 `task_0718ec760d69`(菜品图2926):**无台词**=多参无声老病(板+1图);B 锁场景 `task_c07b7fdf5b5b`(场景图2934);C 双锁 `task_e104d8815523`:**成片莫名出大量字幕=首次出现**(「画面绝不出现文字」被破,中文提示词下)。老板看片定性:老问题+新问题,→ 成为英文化实验的对照基线。参考图:桌面 p1人像/p2美业大堂/p3精华瓶/p4店内/p5门头/P6砂锅鸡(p4p5P6同一家欢喜大排档;已传:2926=P6菜品、2934=p4场景)。🔴商家链路参考图只有人/景/物三槽,5张挂不进,要多图槽找技术
- 🔴🔴 **硬切实验 08-14(实测·待核,每边1单)** — 拉大相邻格景别差异度**救不了 grok 硬切,反而更糟**(对照 `task_ad22ad97b37e` 最长叠化 500ms vs 实验 `task_8d656c18aef8` 2583ms;编剧100%照做=grok自己不切)→ 07-31「grok不硬切=能力边界」暂时站得住,案例已回滚。🔴只测了半个配方:**「板内纯黑格=冻结锚」未测**(我们六格全内容,`entranceBlackOverlay` 是成片叠加层不在板里)。📏判叠化用 `scratchpad/cutdet2.py`(逐帧灰度差),**⚠️别用 ffmpeg scene_score——叠化摊在十几帧会被整段滤掉,差点报反结论**
- 🔴 **模型 id 500 = MiniMax(`minimax-h3`/1renmanju)**,08-14 改名「效果最佳版·10/15秒(画面与多语言最好·较慢)」。🔴`max_reference_images`=1 但实发 2 张=配置字段是死的;⚠️待落定:定价没配(`billing_unit=per_task`)、失败退积分口径(20% 失败率,老板定「商家自己选」不做降级链);前台 5 模型名互相打架待统一。🔴**08-15 官方 API 情报**(仓库扫描,实测·待核):官方端点 `api.minimax.io /v2/video_generation`,content 多模态数组支持**首帧/尾帧/参考图/参考视频四种 role**,**无 prompt 长度限制、零重试设计** → 1200 字节上限和单图大概率都是中转砍的,拿官方 key 直连对照=待老板拍板 → 全文 `00_规格与参考\提示词参考库\参考_2026-08-15_AI演歪了8仓库扫描_含MiniMaxH3官方API情报.md`(其余 7 仓库 7 跳过:5/6/7 无 license 商用不可用、8=浏览器自动化发布封号风险实锤)
- 🔴 [官网博客 API](reference_thinknova_blog_ops.md)(缺 blog.write 令牌) / [扫码发布深链](reference_thinknova_publish_schemes.md)(四平台已真机验证)

### 内容与产品规矩
- [北极星-零动脑](feedback_thinknova_zero_brain_northstar.md) / [内容工具不做合规](feedback_thinknova_content_not_compliance.md) / [案例缺口双查法](feedback_case_gap_dual_check.md) / [小红书交付规矩](feedback_xiaohongshu_content_workflow.md) / [烧单分工](feedback_thinknova_burn_division.md)
- 🔴🔴 [案例一律低耦合](feedback_case_low_coupling.md) — 建案例前必读;新建必过 3 条自检

# 商务与融资
- 🔴🔴🔴 **自营30天市场计划**=`03_工作台\自营30天市场计划_2026-08-10.md`(只靠自己/按积分充值设计;分佣挂首充+种子店3-5家陪跑+周周线下会;joeylu=P0测试号)
- 🔴🔴 [投资人线](project_thinknova_investor_plan.md) — **谈融资/预算前必读**(S$100k/60-40两阶段;成本要确切数字)。材料:路演v5.pptx+讲稿、BP 08-09.docx(**勿再改**)、单位经济表08-10.xlsx;**万万应对分析=内部件绝不外发**

# 其他(休眠)
- [Compass/TikTok达人线](project_compass.md) / [新加坡鞋包提案](project_sg_footwear_proposal.md) / [小孩数学网课](project_kid_math_tutoring.md) + [课程总表](reference_kid_math_roadmap.md)
- 🔴🔴 **验收四铁律** — ①成片四项齐验(联系表逐帧+片尾死寂+mean音量+台词逐句读) ②门槛不跨片型套用 ③「写满」类指令会挤出被禁话术,须给合法填充材料 ④授权子agent挤字数须显式列合规不可删清单
- 🔴🔴 **两库入口**:本机=`视频制作平台分析\README_从这里开始.md`,Obsidian=书签「① 从这里开始」;**归档=移动不是删除**(`99_归档\`/`_archive\`)。**skill 路由表**=`00_规格与参考\SKILLS与规则总台账_2026-08-11.md`(全部保留不停用;但**平台成片一律走 ThinkNova 管线**,hyperframes 只在明确要 HTML 动画/演示片时才用)
