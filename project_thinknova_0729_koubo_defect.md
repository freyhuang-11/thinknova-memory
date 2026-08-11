---
name: project-thinknova-0729-koubo-defect
description: "触发:动口播单/裁格/i2vReferenceStrategy 之前 → 分层现状(全局整板+口播案例裁格)与口播缺陷链历史;lineValidation 旧表已作废,现值看 screenwriter-stack"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-11T11:21:51.226Z
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
---

# 口播/裁格现状(07-31 里程碑核定)+ 缺陷链历史

## 🔴🔴🔴 08-11 定案:「分镜格网漏进成片首帧」不是裁切失败,是整板当首帧(旧写「KB8 裁切偶发」误导,作废)
- **机制(取证 task_6bdc98077bfb / 8d09aa45d930 重症 vs 3c7109642cf8 / d5172f8606e2 干净)**:这四单 `_i2v_reference_strategy` 全＝`storyboard_board`,`image_url`＝`reference_image_urls[0]`＝**那张 3×2 六宫格板本身**,**全程没有裁格动作**。grok 是 i2v,第0帧就等于输入图 → 板直接入画。重症单实测板滞留 **0.25→2.5 秒**(fps=4 逐帧),0.5 秒黑幕根本盖不住。
- **重症 vs 干净:案例层配置逐字相同**(strategy 都缺省继承全局 board、entranceBlackOverlay 都 {true,0.5,0.12,1}、firstFramePrompt/videoTemplate/negative_prompt 全同、storyboardPanelIndex 都=1)→ **纯模型随机,不存在"抄干净样本配置"这条路**。
- **两处矛盾指令(根因)**:①`negative_prompt` 第1行(**后端硬编码,不在任何 agent config 里**)含「忽略分镜板结构」「多个首帧格折叠成单一画面」= 反向命令模型**保住格子**,和第2行「网格/分格/六宫格/分镜板」互搏 → 50% 抛硬币。②`storyboardGuard`＝「开场按顶部【开场硬规】」指向的锚点在 08-01 字节手术后被改名成「[总览]」→ **悬空指针**。
- **08-11 我做的修复(在我们这层)**:videoTemplate 恢复并前置具名 **【开场硬规·最高优先】** 段,改指派式(「板是拍摄计划表不是画面;第0帧起就是摄影机架进左上第1格那个场景里往外拍的实拍单画面,铺满整幅一层到底;整块板/格线/白缝/缩小复本任何时刻都不入画」),悬空指针消除。363→439字,videoPrompt 实测 3116/3123B 余量 ~980B。回滚存档 `00_规格与参考/ROLLBACK_videoTemplate_0811_grid.json`。
- **验证 2/2 通过**:`task_80bd0ce125ec`(餐饮 food_beverage_s02_dialog_duo)+`task_12c49cf1803d`(时装 fashion_s02_dialog_duo),fps=10/1s 与 fps=4/4s 联系表逐帧零格线,黑幕后直接单一全屏、2.25秒溶解换镜多镜头保留。⚠️ **n=2 对 50% 基线只是弱证据(纯运气 p=0.25),下批必须补 5-8 单复核**。
- **仍无解时的确定性方案(老板拍板)**:案例级 `i2vReferenceStrategy:"panel_crop"` = 入参就没有格子,100% 根除;代价 = videoTemplate 的「输入图为单张实拍时:全片唯一镜头、不切镜」分支会命中 → **对话剧塌成一镜到底**。07-28 技术卡 OPS-VIDEO-20260728-03 已把它写成"方案B、A 失效就转"。
- 建单 500 排查补充:**caseId 对应案例 enabled:false 时 POST /business-video-assets/tasks 直接 500001**(不是参数错);outputType 现行唯一合法值＝`video`(`video_10s` 会报"不再支持30秒")。

## 🔴 现行分层(07-31 线上真值复核)
- 全局 `i2vReferenceStrategy` = **storyboard_board(整板)**(live+ops 双写);**口播类案例级 = panel_crop**(07-30 我按"只有口播裁格,其余整板"全库归类)。07-29 那次"全局翻 panel_crop"已被此分层取代。
- 首帧裁切失败保护闸(技术新加):裁格失败即停派发。~~KB8 一例失败/KB9 同案例成功 = 偶发~~ ⛔ **08-11 作废:board 策略下压根不裁格,"网格入片"与这条保护闸无关,见文首 08-11 段**。
- `entranceBlackOverlay` 案例级:473 整板={0.5s},114 裁格=零黑幕,Agent 默认关。
- ⛔ **本文件旧版的 lineValidation 表(45-100 等)、语言范围(砍ko)、419-UI 弹窗保存法全部作废**:长度真值看 [[project-thinknova-0729-screenwriter-stack]];语言终版=zh_cn/en/ja/ko/es;**agent 直连 PUT 带 x-csrf-token 已通,businessUi 也能写**(placeholderDefaults 07-31 实证落库+前台送达),弹窗 textarea 法废弃。

## 缺陷链历史(07-28 取证单 8fd0bb09c351,留档背景)
口播单吃到整板 → 三症状:不一镜到底(videoTemplate 触发条件永假)、人物拉长(整板 1.094 比例被压进 9:16)、英文单不吃中文口径。修复路径=裁格分层+videoTemplate 按输入图判定+lineValidation 语义纠正(全程见 screenwriter-stack)。
- 🔴 **缩窄定义=诚信问题**(老板说"口播类都要裁格",我私自缩成 shotCount==1 还报"全部完成")→ 铁律 2.8,详见 [[feedback-dont-assume-requirements]]。
- 几何拉伸技术卡(OPS-VIDEO-20260729-02,参考图宽高比)草稿在 `02_交付内容\`;裁格分层后口播侧已实际根治,整板侧是否仍需此卡待观察。

关联 [[project-thinknova-0729-screenwriter-stack]] [[reference-thinknova-config-powers]] [[feedback-dont-assume-requirements]]
