---
name: project-thinknova-storyboard-test
description: "ThinkNova 故事板跟随性/裁格测试盘子(2026-07-28 老板定)+ 我能自己烧单的方法 + 案例预设矛盾53条等实拉发现"
metadata:
  node_type: memory
  type: project
  originSessionId: current
  modified: 2026-07-27T16:58:19.553Z
---

# 故事板跟随性 · 裁格与否 · omni 一致性(2026-07-28 起,老板定的测试议程)

## 老板要回答的四个问题(一个一个来,每题至少 2 轮同参数重复)
1. **不裁格(`storyboard_board`)时,开幕 0.5 秒黑屏能不能挡住开头的六宫格网格?** grok 和 omni 各验。
2. **到底要不要裁格?哪个模型裁、哪个不裁?**(老板已知配置层做不到按模型分,他去找技术补;我们先出数据)
3. **故事板跟随性**——不要求 100%,**≥70% 是及格线**。
4. **omni 的场景/产品/人物一致性。**

## 🔴 已知硬约束(读结果前必看,别把这些算到策略头上)
- `businessUi.videoGeneration.availableModelIdsByDuration`:**8秒=[470,471] / 10秒=[468,460] / 12秒=[469,471] / 15秒=[415,467]**。
  → **grok 只能 15 秒(415),omni 只能 10 秒(460)**,对照单时长天然对不齐。
- `referencePolicyByDuration`:**只有 10 秒档 `allowStoryboardCrops:true`**,8/12/15 全 false;`reserveFirstFrame:true` 全档;`cropPriority:[hero,scene,product,detail]`。
  → **415(15秒)不管切哪个模式永远只拿 1 张图**;只有 omni(10秒)能拿 2~5 张。「要不要裁格」对两个模型根本不是同一个问题。
- **`i2vReferenceStrategy` 是全局开关**,grok 和 omni 不能各用各的 → 测试必须**分两批**(先整板烧完 grok+omni,再切 panel_crop 重烧同样两单)。
- **468(10秒口播)供应商通道全空,7单0成**,已前台隐藏 → **10 秒口播当前无可用模型**。
- omni 在整板模式有 **`图片/视频下载超时(30s)`** 挂单风险(整板图大),挂了先看错误再重烧,别当模型能力问题。

## 🔴🔴 2026-07-28 实拉 589 案例发现的数据问题(可能是"不跟 storyboard"的根因之一)
**`appearanceModePreset='owner_speaking'` 且 `scriptwriterPreset.shotCount>1` 的案例 = 53 条(内部矛盾)。**
- 机制(**推断·待烧单验证**):i2v 提交串有【口播锁定·最优先】——「若首帧是单人对镜口播:全片一个固定机位长镜头到底,**下方 cells 只取台词、其余镜头描述全作废**」;而后端 `optionArbitration` 规定 **appearanceMode 独家决定出不出人,`visualFocusCanOverridePresence:false`**(visualFocus 一票否决不了)。→ owner_speaking 赢 → 多镜头故事板必然报废。
- 样本:`food_s06_make 制作/出餐过程`、`tcm_s06_full 完整调理过程`、`tcm_s06_moxa`、`tcm_s06_cup`、`fashion_s06_alteration`、`pet_v2_S06_grooming_process`……**几乎全是 S06「展示真实过程」类**。
- 对照:`owner_speaking + shotCount=1` = 44 条(正常口播案例)。
- **63 条缺预设**,其中 8 条是我留的 `zz_tok_probe1~8` CSRF 探针案例 → **待清理**。
- **案例默认画幅是「16:9 横屏」**(fill-info 打开就是横屏)——这就是老板早前说的"而且还是横屏"。门店短视频应默认 9:16 竖屏。**待定位是案例预设还是全局默认。**

## 本轮测试选定的案例与参数(换了个全新场景,避开旧的窑鸡/TVC)
- 行业 **宠物 pet_care** × 场景 **展示真实过程 process_show(=S06)** × 案例 **`pet_v2_S06_grooming_process`「洗澡/美容全过程」**
- 选它的理由:`visualHint` 写得极干净——「沉浸微距·手艺型:全片只用微距与大特写,零远景零全景;**五格微距细节递进**,最后成品大特写收束」→ 天然是量故事板跟随性的标尺。
- **人为改一项**:出镜方式从案例预设的「老板口播」改成「**商品+门店**」,否则触发口播锁定、五格递进作废,跟随性没得测。
- 固定填写:商品名`全套SPA洗护` / 价格`首次体验价 S$29，含免费皮肤检测` / 门店`毛球宠物美容` / 位置`新加坡义顺928号` / 比例**9:16 竖屏**(必须手动改,默认是16:9) / 卖点`项目细致` / 补充要求留空 / 60 积分一单。

## 每单验四项
| # | 验什么 | 怎么判 | 及格线 |
|---|---|---|---|
| a | 开幕网格挡没挡住 | 0–2 秒按 10fps 抽帧,看 0.5 秒黑屏淡出后还有没有网格 | 0.5秒后无网格 |
| b | 故事板跟随性 | 下载该单分镜板 + 成片按镜头抽帧,逐格比「主体/场景/动作」算命中率 | **≥70%** |
| c | omni 三锁一致性 | 成片人物脸/产品/门店 vs 上传参考图 | 逐帧看 |
| d | 配置真生效 | 拉 i2v input 看 `_i2v_reference_strategy` + 实际图张数 | 防白测 |

## 🔴 我现在能自己烧单了(方法,2026-07-28 打通)
**商家端 UI 驱动法**(比拼 API body 稳):
1. 浏览器开 `https://thinknova.top/zh/app/business-video-assets`;
2. JS 点选:行业 → 下一步 → 场景 → 下一步 → 案例 → 「下一步：填写信息」;
3. fill-info 页若卡「加载中…」→ 直接 navigate 到 `/zh/app/business-video-assets/fill-info?industryId=..&scenarioId=..&caseId=..` 强刷;
4. 用原生 value setter + `InputEvent{bubbles:true}` 填 input/textarea;下拉项用 `button/[role=option]/li` 文本精确匹配点击(**同名选项取最后一个,前面那个是当前值的显示按钮**);
5. 先点「确认」(生成方式面板:时长+模型),再点「开始生成」。

**查证接口**:
- 管理端任务列表 = `GET /admin/api/v1/ai-tasks?page=&pageSize=`(路径靠在 admin 页装 fetch 钩子后点「筛选」抓到);
- **任务详情必须用 `task_no` 不能用 `id`**(用 id 返回 `task:null`):`GET /admin/api/v1/ai-tasks/{task_no}` → `data.task.input` 里有 `_reference_image_limit` / `_i2v_reference_strategy` / `referenceImages[]`,`error_message` 同层;
- 商家端案例库 = `GET /api/v1/business-video-assets/reference-cases?page=&pageSize=24`(**筛选参数不生效,得拉全 589 条自己过滤**);商家端配置 = `GET /api/v1/business-video-assets/config`(referenceCases 为空是因为 `external_table`)。
- 模型改名 = `PUT /admin/api/v1/models/{id}`,详见 [[reference-thinknova-multiref-model]]。

配套:[[reference-thinknova-multiref-model]] [[project-thinknova-film-types]] [[reference-thinknova-prompt-fields]] [[feedback-evidence-standard]]
