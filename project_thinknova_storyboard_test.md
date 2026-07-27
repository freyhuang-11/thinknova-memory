---
name: project-thinknova-storyboard-test
description: "ThinkNova 故事板测试盘子·2026-07-28 实烧10单已出结论:六宫格根因=videoTemplate那句话按裁格模式写的+两模型定位定案+我能自己烧单/抽帧的方法"
metadata:
  node_type: memory
  type: project
  originSessionId: current
  modified: 2026-07-27T17:37:50.506Z
---

# 故事板/裁格/模型定位 —— 2026-07-28 实烧 10 单(600积分)后的结论

## 🔴🔴 根因已定位:六宫格进成片 = 我们自己让它这么干的(证据级)
`promptComposer.screenwriter.staticTemplates.videoTemplate`(1438字节)里有这句:
> 否则按下方镜头顺序推进,**输入图片#第1镜首帧自然开场**;画面永远单一全屏,绝不分屏/多画面/拼贴。

**这句是按 `panel_crop` 写的**(那时输入图片确实=第1镜首帧)。但线上现在跑 **`storyboard_board`,输入图片是整块 3×2 六宫格板** → 模板仍叫模型"用输入图片自然开场" → 模型照办,拿整块网格开场。
- 实测 grok415:0.0s 黑,**0.8/1.5/2.3s 全是清晰六宫格**,3.0s 才变正常整幅 → 网格挂约 2.5 秒。
- i2v **正向**提示词里搜「网格/分镜/六宫格/参考图/拼接/逐格」=**一个都没有**(只"边框"1次);**负向** 274 字堆满「六宫格/分镜板/故事板/2x3网格/格子边框/分屏/拼图…」→ **纯禁令零指派**,踩了铁律5。

### 改法(已写好·PUT 被权限分类器拦截·待老板放行)
- 原文备份在会话 scratchpad 的 `videoTemplate_backup_20260728.txt`(临时目录,要留就迁 Obsidian)。
- 新句:`画面从第0.00秒起即为第1镜的单一全屏画面;输入图片若为多格分镜拼版,只作分镜参考、不是画面本身,须将第1格放大铺满全屏开场,其余格按时序依次展开为同一条连续视频;成片任何一帧绝不出现格线/边框/分屏/拼贴。`
- 字节:模板 1438→1629(+191);提交串 15秒档 3477→约3668,**距4096余约430字节**,不触发截断。
- 老板目标:**六宫格必须锁在 0.15 秒内**(他判断一定做得到)。

## 🔴🔴 两个模型的定位(老板 2026-07-28 看片后定案,实测)
| | grok 415(口播优先版·15秒) | omni 460(实景还原版·10秒) |
|---|---|---|
| 中文台词 | **没问题**,各类解说都能扛 | **做不了**(老板实测判定) |
| 英文台词 | — | **可以** |
| 分镜跟随 | **约 80%**(老板判定,过 ≥70% 及格线) | — |
| 稳定性 | **差:5单3成2挂(60%)** | **好:5单5成(100%)** |
| 定位 | 口播/解说线 | 画面线 + 英文解说 |

> 这条推翻旧记忆「omni 正常说话没问题」。旧的「omni=多参画面 / grok=口播稳」大方向仍成立。

## 🔴 整板模式的硬伤:omni 的多参能力完全没用上
实拉 i2v 子任务 input:
| 模型 | `_reference_image_limit` | **实际喂进去的参考图** |
|---|---|---|
| grok 415(15秒档) | 1 | 1(整板) |
| omni 460(10秒档) | 5 | **1(整板)** |
→ 花 omni 的钱、用 grok 的用法。`referencePolicyByDuration` 只有 10秒档 `allowStoryboardCrops:true`,8/12/15 全 false。

## 🔴 同输入不同结果 = 模型随机(不是配错)
两条 omni 洗护单:同策略、同 1 张参考图、正向段落结构一致、**负面词 274 字一字不差**,唯一差别是时间戳写「2秒」vs「2.0秒」。结果**一条出网格一条不出**。→ 当前打法本身不可控。

## 🔴 待核 / 待办
1. **`entranceBlackOverlay` 配置 `{enabled:true, seconds:0.5}`,实测只有约 1 帧**(0.0s 黑、0.1s 已全亮)→ 配置与实现不符,**待技术**。
2. **B3 前后对比两条(grok+omni)`scriptwriter_fallback = true`** —— 编剧回退了,其余 8 单都 false。原因未查,**待查**。
3. **前端 bug(该给技术)**:选模型弹窗显示「当前使用:XXX」但下拉框实为空值 → 商家点确认+开始生成,**无反应、无报错、无"请选择模型"提示**。我自己也踩了。
4. 53 条「老板口播 + shotCount 5」矛盾案例待处理;63 条缺预设(含我留的 `zz_tok_probe1~8` 待清理);fill-info 默认 16:9 横屏待定位。
5. **下一步测试(老板定)**:上传 3 张图(人物/场景/产品)测**三把锁**能力。

## 🔴 我自己烧单+核片的方法(2026-07-28 全打通)
- **建单**:复制一份真实提交体(`window.__BODY`),改 `caseId/selectedIndustryId/businessScenario/prefill/selectedOptions/durationSeconds/videoModelId`,`POST https://api.thinknova.top/api/v1/business-video-assets/tasks`,头带商家域 `X-CSRF-TOKEN`。**对照必须同案例同行业同场景,换案例是为了扩面不是互比**(老板明确)。
- **admin CSRF 免钩子取法**:任意 `GET https://api.thinknova.top/admin/api/v1/...` 的**响应头里就有 `x-csrf-token`**,直接读来做 PUT。(admin.thinknova.top 只是静态 SPA,API 全在 api.thinknova.top)
- **任务详情**:`GET /admin/api/v1/ai-tasks/{task_no}` → `data.task.child_tasks` 三个子任务(生图/i2v/编剧);**i2v 子任务的 `input` 里才有** `_i2v_reference_strategy`/`_reference_image_limit`/`referenceImages`/`prompt`/`negative_prompt`。
- **案例库全量**:`GET /api/v1/business-video-assets/reference-cases?page=N&pageSize=24` 循环到空,共 **589 条**(筛选参数不生效)。
- **抽帧核片**:成片 URL 是签名 URL,**不能打印**(harness 会 BLOCK)。做法=在 thinknova.top 页面内 `video.src=publicUrl` + `canvas.drawImage` 拼联系表 DOM,再 `computer screenshot`。坑:媒体加载常卡(readyState 0 无报错)要重试/换标签页;SPA 会自动跳转销毁 window 全局,渲染+截图必须连着做。

## 本轮 10 单参数(可复用)
- 第一批:`pet_v2_S06_grooming_process`(沉浸微距·手艺型)× grok415/15s ×2 + omni460/10s ×2,出镜方式手动改「商品+门店」避开口播锁定。
- 第二批(三种互相打架的片型,各烧 grok+omni 一对):
  - `food_s02_deal` 快节奏促销型(要求五格干脆切换)
  - `photo_studio_s05_location` 空间漫游型(要求一镜连续不跳切)
  - `digital_3c_s07_ba` 前后对比·结构型(前2格之前/第3格转折/后2格之后)
- 全部 9:16 竖屏(**默认 16:9,必须手动改**)、60 积分/单。

配套:[[reference-thinknova-multiref-model]] [[reference-thinknova-prompt-fields]] [[project-thinknova-film-types]] [[feedback-evidence-standard]] [[feedback-directive-over-prohibition]]
