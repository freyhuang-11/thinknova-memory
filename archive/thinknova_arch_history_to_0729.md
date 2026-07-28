---
name: thinknova-arch-archive
description: "ThinkNova 提示词/管线簇过程记录归档 —— 仅供追溯,不参与日常检索"
metadata:
  node_type: memory
  type: archive
---

# 🗄️ 仅供追溯,不参与日常检索

本文只收**未被推翻、但已完成或已沉淀为规则**的过程记录:实验流水、一步步怎么验出来的、已修复问题的诊断链、历史交付物路径。
**已被后来结论推翻的旧说法一律不在此**(已在整理时删除,历史在 git commit 里查)。
日常判断请读:[[reference-thinknova-prompt-architecture]] / [[project-thinknova-offline-agents]] / [[project-thinknova-film-types]] / [[project-thinknova-brand-product-industry]] / [[reference-thinknova-multiref-model]]。

---

# 一、来自 reference_thinknova_prompt_architecture.md

## 1.1 端到端跑通里程碑(2026-07-09)
- **验证单 task_96233**(平台,非直连):F 编剧✅跑通不回退(concept / boardCells / cells 逐子格三件套 / lines)、黑锚板✅、技术白缝裁格✅裁准上中格、板零字幕✅、成片零字幕✅、人物场景锁✅。
- **当时缺口**:成片不跟分镜剧情——只锁人物/场景,微距注入/每格镜头没走。
- **对照 Test D**(直连,裁上中格 + 整板 reference + 手写完整 F 骨架当 prompt):剧情真跟了 → 证明架构对,差的是平台没把 F 骨架接进 i2v。

## 1.2 「问题2」诊断与修复全链(2026-07-09~07-10,已闭环)
- **硬证据**:i2v 子任务 `task_9f4afe` 的 `input.prompt` 里 **0 个【子格】**——编剧算出的 `compiledPlan.videoPrompt`(含【子格】~2950B)被丢弃;i2v 实收旧基座("基于…后台配置…台词只有以下几句…")+ stagePromptPresets 骨架(泛指令"按6格演")。台词从旧基座进了 i2v 所以念对,但每格镜头没进 → 模型锚人物首帧瞎演。
- **上游修复**(技术改 `OfflineStoreContentService.php`):cells 改对象数组、`{{cells}}` 逐子格渲染、firstFrameTemplate 删 `{{lines}}`、firstFrameCell 映射上中=>1。
- **我侧对齐**:编剧 systemPrompt + outputContract 改成**对象数组 8 字段**(position / timeRange / shot / visual 不可空 / voice / line 格式 `[[声线,感情,真人感:「台词」]]` / sfx / move)。
- **下游修复卡**:把 `compiledPlan.videoPrompt` 灌进 `stagePromptPresets.image_to_video` 的 `{{prompt}}`,删旧基座三段;验收 = i2v input.prompt 出现 5 个【子格】+ 成片逐格跟板。技术卡 = `02_交付内容/给技术_问题2下游_把videoPrompt注入i2v_2026-07-09.md`。
- **关键踩坑**:cells 数组里**多行字符串会让 LLM 吐非法 JSON → 编剧回退**,改成每段单行才稳。
- 规格全文 = `00_规格与参考/商家Agent_编剧输出与提示词拼装_运营说明_v2`;桌面成片 = 老陈牛肉面_端到端总验_2026-07-09.mp4。

## 1.3 首帧三锁的发现过程(2026-07-09)
- **实证 task_542dfcb24c65**:入参传了 person 参考图(assetId 1551,扎染男)+ 提示词有人物锁那句,但**首帧裁的是格2 = 整只西瓜(无人脸)** → 成片出一个凭空年轻女性。**人物锁失效 ≠ 没传参考图,是首帧没人。**
- **纠错(亲查 task_cf5bf7ae4451)**:生首帧板的 i2i 输入图 `images`/`image_url` **本来就是人物照片本人**(不是没喂);真凶是 `imageEditOptions.video_first_frame = {mode:restyle, strength:0.74, preserve_composition:false}` 把脸洗掉了、板 prompt 又逼产品进格 → 脸飘。→ 因此删掉了当时准备发给技术的「参考图前移进首帧 i2i」卡:那**不是技术活**,strength 和板 prompt 都在 config。
- **真正卡点**:一次 i2i 要"重构成六宫格板"又"保住某张脸",两者互斥;strength 盲降会毁板结构。故先只上 prompt 保脸。
- **口径 A 精修(老板 07-09 定)**:默认首帧留真人锚点;豁免三条 = 客户明确不要人 / 纯产品案例 / product_only 模式 → 首帧可无人不锁人。

## 1.4 全板人物锁的发现与验证(2026-07-10)
- **翻车实证 task_cdef306c3dea(染发)**:成片跟对了分镜顺序/内容,但**分镜板每格的服务者不是同一个人**——上中格首帧口播=棕发,右上/右下干活格=黑发盘发另一人;成片 2-4 秒继承了黑发那位。**根子在板(t2i)提示词没锁"全板同一人"**,i2v 虽写"绝不换人"但参考的板自身就不一致。
- **修法**:改 `firstFrameTemplate`(675→906)+ `blockTemplates.task_goal.first_frame_prompt`(1267→1450)+ opsEditable 镜像,加【全板人物锁·铁律】;把"宁可其余格弱化人物"改成"宁可弱化动作复杂度也保人物一致"。
- **验证**:烧 3 单跨行业核板(R1 美业染发 S06 / R2 美业头皮 S07 / R3 汽车精洗 S06),三单新板每格动手的服务者都 = 首帧同一人。板存桌面 `人物锁验证_R1/R2/R3_新板.png`。
- **QA 教训**:老板亲验揪出人物锁,我抽帧太粗夸成"一格不差"被抓 → [[feedback-understand-before-judging]]。

## 1.5 台词长度的调参流水(2026-07-10~07-12,结论已被 lineValidation 取代,证据保留)
- **赶单证据**:汽车 S06 task_3d8b52054427 / 编剧 83bca6cb —— 15 秒念了 **106 字 / 5 句(每句 18-25 字)**,成片明显赶、AI 感重。根因 = systemPrompt 只有弱弱一句"5 句共 60-75 字",没有每句上限、没有输出前重写的硬门。
- **修后验证 task_3d8812fbcdec / 编剧 39afc268**:106 字 → **70 字**、每句 24 → 13、cells 正常填满、全中文汉字数字。
- **踩坑**:第一版铁律写"逐句数字数**写进 lines**"→ 编剧把字数写进台词、lines 乱码、台词全空(task_842fc7e94855 / 1fa8cb69),烧单才抓到。→ **写模型指令别用歧义动词**。
- **只设上限的反面翻车(07-12,whisper + silencedetect 实测 4 条)**:碎花裙 41 字 / 星空顶 51 字 / 风衣 39 / 杨枝甘露 38 —— "只设上限 ≤60"导致编剧写太保守滑到 38-41 字,对 15 秒太薄 → grok 在句间拉出 1.5 秒大空档(杨枝甘露留白 7.4s / 一半静音)。**老板定调:按"碎花裙"走(41 字 + 句间 0.3-0.6 秒短呼吸)**;星空顶塞满=一般,稍微多一点但不能太少。**大空档本质是 grok 分布方差,提示词压小非根治。**
- **静默尾巴**(老板 07-11 看成片提):台词压到 70 字后连续说完约 13 秒、尾巴 2 秒没声 → videoTemplate 改"从容说满整个时长、句间留自然停顿、最后一句落在收尾、绝不提前说完留静默尾巴"。

## 1.6 分镜图≠成片的方差实证(2026-07-11)
- 汽车 owner_speaking 单 **task_7a9729f9514d**:板画了 6 格洗车全流程(口播→擦车顶→刷轮毂→吸座椅→蹲洗轮毂),但**成片从头到尾那人站着举瓶口播 15 秒**,后面动作格 grok 全没演。
- **对比**:同行业同模式上一单 **task_3d8812fbcdec** 成片却跟板了(测漆/擦车真动作)。→ **同提示词同板,grok 时而跟时而塌 = i2v 方差**;首帧是 talking-head 时最易一路停在口播。
- 结论已沉淀为"grok 能力边界"与"根治=分段生成再拼接是架构活"。

## 1.7 视频底座扫除清单(2026-07-09,全 PUT 落库 + 回读,已完成)
逐项修的位置,供日后排查同类泄漏时定位:
- **字幕泄漏(剧情/字幕乱的根)**:`blockTemplates.layout_rules.first_frame_prompt` + `opsEditable.layoutRules.firstFrame` + `promptAssembler.video.outputTypePrompts.first_frame` 原写"格1/2/4/5 角落各一行『旁白』小字""格内角落小字标注镜头序号/台词 OS" → 改为**整板绝对无任何文字**。另 `first_frame_prompt` 里"整板唯一文字=各角落一行旁白小字"是铁律2 的直接违规源。
- **声线锁死女声**:i2v `stagePromptPresets.image_to_video.prompt`(+ ops 镜像)原写"口播＝年轻自然女声…像闺蜜" → 改随出镜人物性别。
- **中英混写**:`businessOptionPrompts.platform`(9)、`.visualFocus`(5)、`optionRules.platform`(6:tiktok/ins/yt/fb/pin/x,+ ops 镜像)→ 统一中文。**注**:`languagePolicy.map` 的英文=故意的英文输出铁律(输出语言另一层管);`industryRules` 括号英文=技术词,不动。
- **优先级**:`conflictResolution.priorityOrder` 从 `[selected_option]` → `[user_extra_requirement, selected_option]`(海报早有,视频漏了)。
- **两首帧路径纠结**:实测板 prompt 同时含 blockTemplates 六格特征与黑锚板特征 → 两条都改齐,不赌哪条独活。
- **未动**:行业质感词 / negativePrompt / 已中文的平台词。
- 归档文档 = `00_规格与参考/门店内容_提示词底座扫除与首帧三锁_delta_2026-07-09.md`。

## 1.8 案例审计(2026-07-09)
视频/海报案例结构干净(zh 全在 / prefill 全在);海报 216 条 en 未翻 = 全 disabled(非问题,不管);视频 32 条 en 未翻**已翻上线**(enStillCJK 归零);"5 条字幕泄漏"= **误报**(那是"旁白式 OS"念白风格,非画字)。同批修复:i2v 加"每字念完整不吞字漏字、句尾数字咬清楚"。

## 1.9 解耦与骨架案例实测(2026-07-09,结论已沉淀为长尾策略)
- 平台编剧非直连、更忠实且 0 扣费(编剧在平台成功只 i2v 失败),适合做纯编剧实验。
- 同一"皮肤前后对比"案例只换 productName:水光针 → 编剧正确带入"水光针补水/水珠清透";刮脸 → "小绒毛不敢素颜/刀片轻轻刮过皮肤光滑"。→ 产品当变量通了。

## 1.10 07-09 收尾时的零散待办(多数已被后续版本吸收)
firstFrameCell 编剧吐"1"未吐"上中"(已用提示词钉死防裁错格);子格 5 未走;个别叠化帧(后确认=grok 能力边界);编剧模型 provider 不稳(Invalid token / 账号 unavailable);老板 07-09 下的「全量提示词大扫除」指令(所有行业案例 / 细节按钮提示词 / 海报一起)——已由 07-19、07-26 片型化、07-27 全量预设三轮扫除吸收。
- 桌面交付物:`D:\SamsoData\Desktop\咖啡_平台F编剧_端到端成片.mp4` + 分镜板方图/补边 + 裁格首帧;直连对照 `咖啡_裁格版_剧情跟板_D.mp4`。

---

# 二、来自 project_thinknova_offline_agents.md

## 2.1 六宫格裁切与选项进编剧(P1/P2,2026-07-14 生产实证闭环)
- **P1 六宫格裁切已修**:`master_first_frame_panel`(720×1280 裁片)进 i2v。
- **P2 选项进编剧已修**(07-14 03:54 两单):编剧 `optionArbitration` 真收到 `copyLanguage:en / appearanceMode:product_only / presence:no_person / platform:tiktok / paceLevel`,boardCells 写"Unmanned closeup"= 纯商品生效,台词真写英文。**历史根因 = 异步编剧上下文打包漏传 selectedOptions**(技术修)。

## 2.2 英文台词被中文字数规则打碎(2026-07-14,已修)
旧规则"每句 9-12 字 / 中文数字用汉字"砸到英文 → 模型删光空格 + 拦腰截词("Newscriptalert!Gat" / "一九.九")。修法 = 台词长度**按语言分口径**,默数校验同步按语言。(该分语言口径已进当前状态版。)

## 2.3 时长写死 15 秒的清除(2026-07-14,已修)
- **根因实锤**:`seconds:10` 参数 vs 全链提示词写死 15 秒(板 t2i"规划一条 15 秒" + 编剧 15s 预算 5 句 + i2v 15 秒总览)→ 10 秒片"没结束"。
- **修法**:`videoTemplate` 里 4 处"15秒"写死 → `总时长{{durationSeconds}}秒` 占位符(依赖后端替换)+ "每镜等分/说满全片/片尾收尾"相对措辞;i2v 预设 + ops 镜像"铺满整个 15 秒"→"铺满全片";"参考图=完整分镜板"→ 条件式"若还提供了参考图…"(单参模型收不到板,原句是对模型撒谎)。
- **验证(07-14 05:18 两单)**:`{{durationSeconds}}` 双向替换成功(15秒/10秒)、[视频总览] 无乱码、条件参考图/声线新规都进提交全文;15s 中文台词满分。
- **`durationPolicies` = 死钩子**(实测 dp10"节奏收紧"没进 i2v,写了无效无害)。

## 2.4 质感加厚 v3 + 字节手术(2026-07-14,数值仅供参考,后续多次改动)
老板点名"语气情绪眼神停顿呼吸真实感 + 人物肤质光感镜头问题一直在这" → i2v 底座重写(2142→2091B 反而更厚)+ videoTemplate 去重(2160→1782B),**拼装从 4075/4096(余 21B!)降到 ~3646(余 450B)**。加厚内容(镜头呼吸/眼神三点走位/换气与情绪弧/距离感)已进当前状态版视觉纪律。
- **底座谎话已治**:"输入里有一张六宫格分镜板" → "首帧图=第一镜画面;若另给参考图,那是分镜规划板"(单参模型输入实为裁片)。
- **商品名一字不差铁律**(07-14 05:45 上线):治"情侣水晶吊坠被删成水晶吊坠"(字数硬约束逼模型砍商品名),含商品名句放宽 16 字/12 词。

## 2.5 纯口播模式与两条成片实测(2026-07-15,配方已进 film-types)
- **配方定型单 task_8825d5504f5e**(板完美)。
- **v2 禁令版 task_b6829c0f52d5**:纯口播成立(同背景/对镜/无杂画面)但**第一个硬切点换人**(0-3 秒女生=首帧裁片,3 秒后变男生到结尾)——grok 在切点弃首帧人物。应急=掐前 3 秒即 12 秒完美口播。
- **v1 无禁令版 task_04d8e6f775cb**:人物全程一致但画面闹(悬浮 ThinkNova 大字 + 价格标签 + 手机 UI = 破零字幕)。
- → 结论"一镜到底不硬切 = 无换人风险"已进当前状态版。
- **视频分析法**(已成通用流程):成片 URL 在任务详情(自家 OSS 无签名直下)→ curl 下载 → ffmpeg 1fps 抽帧 → faster-whisper 转写 → Read 看帧。

## 2.6 4096 爆单的字节手术(2026-07-15)
02:44 出现 4096 爆单 → 字节手术 + **cells 短写法**解决(03:04 单 3995 贴地过,短写法生效后宽裕)。静态当时削到 videoTemplate 1840B / preset 1992B。

## 2.7 案例兜底冗余清理(2026-07-14,老板拍板)
视频 22 条 + 海报 27 条 `*_gen_s??` 全部 `enabled=false` 下架 —— 07-10 批量加的"通用兜底骨架"预览图全部借用同行业兄弟案例原图 + 标题近义 + 场景本有覆盖(49/49 撞车、0 条垫真空缺),违反解耦。复验:餐饮/家具 S03 已无重复卡。教训已进当前状态版。

## 2.8 海报「运营指引上画面」修复(2026-07-15)
老板会议海报 3 单出现"科技感视觉/干净舒适空间"角标,根因两条:①卖点池指引整句("突出环境干净舒适、氛围放松。")被编剧照抄成角标 ②extraRequirement 风格词(科技感蓝色主调)被画成文字(实证 task_807042e57bb2)。修 = `blockTemplates.copy_rules.template` 加两条(规则已进当前状态版海报段)。

## 2.9 E1-E36 提示词/管线实验(07-03~07-08)定标 digest
未被推翻、已沉淀为规则的:①中文台词基线 70-75 字 / 5-6 句 @15s + "从容不赶时间充裕"(加字 → 模型赶稿吞字)②**首帧裁片 = t=0 像素锚 = 唯一锁真人脸机制** ③**@语法每提必挂**(相似度 60→85%)④负面词只禁"新增字幕水印"不泛化禁"文字" ⑤**grok 口播只念中/英/日**(谚文泰文台词被翻回中文即兴念)→ 视频语言选项收窄 zh_cn/en/ja,海报保留全语言 ⑥**分镜板必留**(客户生成前确认剧情=剧情预览)⑦拟真肤质写进 videoPrompt ⑧声线负面组永驻 negative_prompt(机器人腔/播音腔/平直节奏/僵硬表情)。
- 语言规则后续升级 = 直接认 `copyLanguage` 代码,不靠编剧把"英文"和"en"对上。

## 2.10 icon 白名单实锤过程(2026-07-14)
读商家前端 bundle 发现图标白名单仅 ~26 键 → 25 行业 vs ~10 可用键**数学上无差异化**,这才是"行业卡图标一直重复"的根因(此前一直以为是 config 没配)。已给技术 29 个 lucide 键清单 + 确认行业卡组件读 `industryFilters[].iconKey`(旧规范里 industryFilters 本无 icon 字段)。

## 2.11 给技术的四件套文档(2026-07-14 待出,老板要求格式=基于现有系统/会遇到什么问题/怎么调整/最终效果)
①`segmentDurationSeconds` 进编剧 user JSON + 分时长台词预算 ②分时长提示词变体挂 `durationPolicies` ③参考图装配按模型"含首帧总图数"阶梯,裁片副本别再占位 ④新模型启用验证路径(先修稳定性再灰度)。**大动装配前老板要求谨慎,文档先行。**
- 备注:③的现状已被 07-28 的 200 单诊断刷新,以 [[reference-thinknova-multiref-model]] 为准。

---

# 三、来自 project_thinknova_film_types.md

## 3.1 全量片型化的批处理技法(2026-07-26,可复用)
- 工单存 `window.__work` + 游标 `__wi`,**每批 40 条**(GET detail → 改 visualHint → PUT),**单批 <45s 防 CDP 超时**。
- detail 解析必须双形态兼容:`j.item || (j.data && j.data.item)`。
- 557 条批量写入 0 失败 + 63 条当晚已先铺/跳过(S14×44 + 口播锁死的 S11 们)。
- 铺法节奏:**先 3 个试点片型各改 1 条烧验,过了再全量脚本铺 + 每场景抽烧回归**(铁律:先小范围验证)。

## 3.2 欢喜大排档实测(2026-07-27 晚,P4 店内 / P5 手撕鸡 / P6 门头真图)
- **生图板上从来没有门头**(当时格1 是纯黑)→ 成片里的门头 **100% 靠多参把 P6 原图直接喂进 i2v**,和板无关(老板判断,已用板图证实)。→ 这是后来废除纯黑铁律、把格1 改开场格的直接动因。
- **产品还原修好了**:加"参考图优先于文字"后,板上砂锅里是**手撕鸡块**(=P5),不再是编剧文字里的"整只窑鸡"。根因 = 编剧看不到参考图只看文字 → 【产品形态交给参考图·硬规】。
- **同批上线的修复**:i2v 层色彩纪律、走入式方向写死、环境招牌挂画菜单文字虚化、任何一格不得空白。

## 3.3 整板模式第一次尝试失败(2026-07-27 23:33 → 23:45 修正)
- **失败**:只开 `storyboard_board` + 黑屏,**没给模型任何"离开网格"的指令** → grok 整片全是六宫格(废片);omni 报"图片读取时间太长"(板图 1024×1536 太大)。
- **修正**:加 `storyboardClarification`【输入图是分镜参考板·不是画面内容】+ `negativeGuard` 补网格类负面词;黑屏 0.3→0.5 秒(老板试过 1 秒觉得没必要)。
- 现行配置与取舍已进 [[project-thinknova-film-types]] 第八节。

## 3.4 整板模式的动机证据(task_9054ba5a95dd,omni TVC)
板图非常高级(纯净暗场/光束/石台/浓稠挂丝/手搓泡沫/水面涟漪),成片却掉档:多出水泥墙横梁、黑位发灰、光束散、**手搓泡沫和水面两格直接没了**,还自行补了想象的厂房环境。根因 = i2v 只把裁格(第 1 格)当首帧、后 9 秒自己演,整板虽传但只是 reference 不主宰。老板原话:"有区别没关系,但离得太远了"。

## 3.5 A/B/C/D 四单原始任务号(2026-07-26)
- **A** task_f89345e40456(默认):明亮实拍五拍慢推 = 基线
- **B** task_fd1ae015bf7a(补充要求推一镜口播):编剧 5 格全固定机位口播;成片失败 = 供应商 timeout(偶发非内容)
- **C** task_28451afb863b(补充要求推 TVC):戏剧光/暗场光束/英雄产品全穿透到成片;快剪与短句台词被固定机制卡住 = 技术项
- **D** task_18d7f6f58afe(零补充要求纯案例基因):编剧 5 格固定机位口播对口型
- A/C 成片对比已放老板桌面 `D:\SamsoData\Desktop\片型对比_0726\`

## 3.6 07-26 分批落库记录
04:00 落 44 条 S14(22 `_tvc` 戏剧光型 + 22 `_other` 纪录型)+ `brand_product_s11_owner`(一镜口播型),全部 200 + 回读;当时剩余 ~495 条待铺,05:00 全量完成。

---

# 四、来自 project_thinknova_brand_product_industry.md

## 4.1 S14 建单 500 的完整定位过程(2026-07-25,方法已提炼进当前状态版)
- **症状**:brand_product / 所有行业的广告 TVC 大片(S14)烧单报 500(`code 500001, Internal server error`,如 request_id `req_5367afe3e549`),其它场景都正常。
- **隔离实验**:直连 POST 商家建单接口,用**老行业 beauty + 同一新场景 S14** 复现 → 一样 500 → 排除行业/案例/appearanceMode,锁死是场景。
- **admin GET 读全量 config 核实**:`promptComposer.sceneRules` S01~S13 全在、**唯独缺 S14** → 父任务组装读 `sceneRules[S14]` 取不到 → 500(建单阶段就挂、**不建任务记录**,所以任务列表查不到失败单);`promptAssembler.industryPrompts` 28 行业都有、**唯独缺 brand_product** → 生图层取不到。
- **两者命运不同**:`industryPrompts.brand_product` 运营端补得上(该键不校验);`sceneRules.S14` **运营端一保存就被剥离退回 13**(编辑器只认已注册场景枚举)→ 必须技术注册。已给技术精确 spec。

## 4.2 案例 + 封面全落地过程(2026-07-25,51 条)
- **写入路径**:`PUT https://api.thinknova.top/admin/api/v1/agents/{code}/reference-cases/{caseId}`,**从 admin 域**带 `X-CSRF-TOKEN` 就能过(200)。token 靠 fetch hook 从 app 自身写请求里钩(存 `window.__tok`,值掩码但可用)。
- **UI 建案例法(备用)**:admin→智能体→编辑→管理案例库与封面图→新增案例→JS 填「案例 ID input(placeholder `beauty_service_001`)」+「JSON textarea」(InputEvent 同步)→ JS 点「创建案例」(**这个按钮 JS `.click()` 能触发,和「保存 Agent」不同**)。但批量别用 UI:每次创建重渲染增长的案例列表 → 渲染器卡死 / 45s 超时。
- **封面回填**:文生图生成(`generated-assets` 裸地址永久公开)→ GET 案例 + 加 coverImageUrl / previewUrl / thumbnailUrl / previewImageUrl 四字段 + PUT。抽查 5/5 有封面。
- ⚠️ 文生图批量 >~6 张会 45s 超时(每张 ~3s),分小批发;Chrome 扩展当晚间歇断连,重试即可。

## 4.3 编辑器同步法的关键发现(2026-07-25)
config textarea 用**原生 value setter 赋值后必须派发 `InputEvent('input',{inputType:'insertText'})`**——**普通 `Event` 不同步、渲染层不认**,这是此前"内容存不进去"的原因。判定标准 = `dlg.innerText` 里能看到新内容,再由老板真人点「保存 Agent」。

## 4.4 编剧仲裁翻车样本(2026-07-25)
美业口播单编剧收到 `appearanceMode=product_only`(前端预设回填 bug 没送 owner_speaking)→ concept 变"(过程)拍服务流程"、5 格全"画面无人脸"。这是 `peoplePolicy` 一票否决案例 visualHint 的实证样本。

---

# 五、来自 reference_thinknova_multiref_model.md

## 5.1 468 多参改造的排错链(2026-07-24)
- **HTTP 400 实证 task_608b5a90b3b6**(i2v modelId=468 fail):`"image":"{{referenceImages}}"` → 供应商返回 `json: cannot unmarshal array into Go struct field .Alias.image of type string`。
- **验证通过单 task_fb9776f1fc18**:改后 400 消失,2 张参考图进 i2v。
- **同单 i2i 侧**:refImages=3,板正常(老板"验证无数次")→ 证明分镜板本来就吃多参,问题只在 i2v 请求格式。
- 正确配置已进当前状态版第九节。

## 5.2 403 定位单(2026-07-24)
实测 task_334083c07f97 的 i2v 子任务 `input.image_url` / `reference_image_urls` = `https://thinknova-previews.oss-ap-southeast-1.aliyuncs.com/generated-assets/provider-input/2026/07/...`,裸 OSS 域名 + `hasQuery=false`(无签名)→ 该前缀非公共读 → 供应商 403 AccessDenied。已入《给技术_OPS-20260724-04》。

## 5.3 全线断供事故(2026-07-24 下午)
当天两个 i2v 模型同时烧不出来:一个是通道无可用渠道分组(早上 02:20 还能成、下午 17:48 掉),另一个是 OSS 403。编剧被打断、`compiledPlan` 不落库。→ 老板要求**加新中转站 + 渠道故障转移**(OPS-20260724-04),定性为全线阻塞项。

## 5.4 图生图产品没锁的诊断单(2026-07-24)
task_608b5a90b3b6 的 i2i:模型 451、mode=t2i、refImgsIn=3(产品图确实传了)、prompt 已有锁定语(以参考图为准/商品参考图/保持商品不变/上传的商品)→ 排除"提示词没写锁",定位到"六宫格母版 = 合成多格图 + t2i 重画"这个机制性根因。结论已进当前状态版第十一节。

## 5.5 多参样板 411(已停用)
`model_request_mode = manxue_videos_reference_images_json` + `max_reference_images=5`,07-12 smoke 验证过的多图配置(首帧 + 4 张 = 5 项 reference_images 请求体)。字段名 `reference_images` 的出处即此。

---

# 六、查表附录(**现行有效**,从当前状态版移出以控体积;需要时来这里抄)

> ⚠️ 本节不是过期内容,是**仍然生效的操作配方与全文措辞**。当前状态版里已留指针。

## 6.1 视觉纪律全文(现行,config 已落库)
- **色彩**:原相机直出——饱和克制、肤色准确、白平衡正常,质感靠光影层次;绝不高饱和滤镜感也绝不灰暗。i2v 层另有:饱和度克制 / 不加戏 / 只画提示词提到的元素。
- **肤质**:绝不网红滤镜脸/瓷娃娃/蜡面/塑料/磨皮/AI 假皮;要毛孔、雀斑、细纹、唇纹、碎发。
- **灯光**:统一主光源;亮面/暗面/投影三层次;鼻影、颧骨高光、颈影、发丝轮廓光;产品高光反射;背景略暗做纵深;绝不平光死白惨白。
- **人物**:干净耐看的真实店员,非网红脸;眼神三点走位(看产品→看动作→回镜头);**全板人物锁**=每个出现服务者的格都是首帧那位,五官/发色/发型/发长/肤色/服装配饰全格严格一致,禁换脸换发色换发型换人,顾客出现时动手的仍是首帧那位,**无论是否上传人物照都生效**;宁可弱化动作复杂度也保人物一致。
- **声线**:与出镜人物相符的真人声(不锁死性别);微笑入声、换气轻而真实、重点词前半拍微顿、尾音自然落;情绪弧=发现→惊喜→认可→真心推荐;距离感近贴耳、远变轻;每字念完整不吞字漏字、句尾数字咬清楚;负面组永驻 negative_prompt(机器人腔/播音腔/平直节奏/僵硬表情)。
- **镜头**:手持微晃、镜头呼吸、景别特写/近景/中景切换、曝光高光不死白。**走入式方向写死**:摄影机在店外朝店内推进、人物背向镜头走入,禁止从门内向外走。
- **物性(07-27 生图层【统一纪律·真实感】)**:稠液挂壁不像水、食物热气油脂、汤汁挂勺;人物去 AI 化(皮肤质感/手指结构/表情自然);光感与饱和度克制;**包装文字虚化不可辨、不编假字**;环境招牌挂画菜单文字虚化;任何一格不得空白。
- **格位配额(触发式,默认单不受影响)**:选门店环境或传场景参考图 → 格1 门头/店内全景开场、格4 主体与环境同框,并锁参考图真实装修;产品格必须与参考图外形/摆盘/色泽/器皿一致。**实测生效**(格1 从人脸特写变店内全景)。
- **负面词**只禁"新增字幕水印",不泛化禁"文字"。

## 6.2 案例预设合法值枚举(2026-07-27 快照,以 `businessUi.detailOptionGroups` 现值为准)
- `appearanceMode`:product_only / owner_speaking / product_store / customer_pickup / appearance_mode_menu_board_display
- `videoStyle`:real_store_promo / owner_recommendation / local_conversion / premium_clean(+07-25 新增 ad_film,服务端归一化为 `video_style_ad_film`)
- `visualFocus`:price_focus / freshness_focus / arrival_focus / location_focus / subject_closeup / before_after / hands_on_process / store_environment / person_on_camera
- `paceLevel`:steady / medium_high / fast_promo

## 6.3 整板模式必配提示词原文(现行)
`stagePromptPresets.image_to_video.storyboardClarification` 顶部【输入图是分镜参考板·不是画面内容】:
> 这是 3 列×2 行六格参考板,不是成片画面;成片必须在开头第一秒内完全离开网格布局,立刻推近到第 1 格并铺满全屏,之后按 2-6 格演进但每刻只有一个画面。

`negativeGuard` 需补:六宫格 / 分镜板 / 故事板 / 2x3 网格 / 多画面并列 / 边框分割。

## 6.4 468(单参→多参)配置配方(07-24 实证,通道恢复后可复用)
**两个框都要改**:
1. **「模型能力 JSON」**:`"maxReferenceImages": 1` → **`5`**(卡张数的 DB 闸,在该框底部 `firstFrameAdherence` 前)。
2. **「通用协议 JSON」**:
   - `requestMapping.referenceImages` = `{"mode":"multi","path":"reference_images","maxCount":5}`(path 从 `image` 改 `reference_images`);
   - `requestTemplate`:`"image":"{{referenceImages.0}}"`(单张首帧,string)+ **新增** `"reference_images":"{{referenceImages}}"`(数组)。
- **两个 count 字段必须一起对上**:DB 列 `max_reference_images`(控前端可上传张数+运行喂几张)vs 通用协议 JSON 的 `referenceImages.maxCount`;只改一个 → 前端仍只让传 1 张 / 运行仍单参。
- 🔴 `requestTemplate` 的 `image` 只收单个字符串:填数组 → 供应商 **HTTP 400** `json: cannot unmarshal array into Go struct field .Alias.image of type string`。
- **供应商亲口的时长约束**:`Model grok-imagine-video-1.5-fast supports 15s only for text-to-video or a single reference image; multiple reference images must use 6s or 10s.`

## 6.5 后台编辑器落库法(备用通道,完整步骤)
admin→智能体→编辑→JS 给 config textarea(**第 2 个,以 businessUi 开头**;带行号但不是 CodeMirror/Monaco,cmCount=0)用**原生 value setter** 赋值 → 派发 **`InputEvent('input',{inputType:'insertText'})`** + `change`(⚠️普通 `Event` 不同步、渲染层不认,这是早期"存不进去"的原因)→ 用 `dlg.innerText` 确认渲染层含新内容 → **老板真人点「保存 Agent」**(我程序化 `.click()` 不触发这个按钮;但案例库的「创建案例」按钮 JS 可点)→ 点「重新从服务端读取」→ GET 商家 config 回读验证。视频 agent config ≈188KB(referenceCases 转 external_table 后不再 2.3MB,不卡渲染)。

## 6.7 C1 一键发布 P0 方案细节(现行,07-14 定案)
成片页「发布」按钮 → 二维码 → 手机 H5(保存素材 / 复制文案 / 打开 App 深链),**零平台审核、全平台通用**。深链只承诺"打开 App",**不承诺直达发布页**(scheme 非官方会失效,做成运营可改配置)。两个坑:①微信内置浏览器要做引导浮层 ②iOS 用 share sheet / 长按。
**P1 = 聚合商(Ayrshare 类,一个 API 外包全部平台审核,月费几百刀)> 自建直连(TikTok/Meta/YouTube 三场审核)**,本期不做。国内平台(抖音要 ICP 备案+能力审批;小红书、视频号无 API)全走 P0。
文档 = `02_交付内容/给技术_C1一键发布P0_扫码半自动_2026-07-14.md`;定位资料包 = `02_交付内容/给Codex_平台定位资料包_新加坡线下会议_2026-07-14.md`。

## 6.6 环境杂项(现行)
- 商家 fill-info 页偶发白屏(remount bug 已报);会话掉得快要反复重登;Chrome 扩展会间歇断连,重试即可。
- 文生图批量 >~6 张会 45s 超时(每张 ~3s),分小批发。
- 探针案例 `zz_tok_probe` DELETE 没通,仍挂在库里(enabled:false 商家不可见),待 UI 删。
