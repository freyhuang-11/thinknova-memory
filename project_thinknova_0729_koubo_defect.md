---
name: project-thinknova-0729-koubo-defect
description: "触发:动口播单/裁格/i2vReferenceStrategy 之前 → 分层现状(全局整板+口播案例裁格)与口播缺陷链历史;lineValidation 旧表已作废,现值看 screenwriter-stack"
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-30T18:42:17.287Z
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
---

# 口播/裁格现状(07-31 里程碑核定)+ 缺陷链历史

## 🔴 现行分层(07-31 线上真值复核)
- 全局 `i2vReferenceStrategy` = **storyboard_board(整板)**(live+ops 双写);**口播类案例级 = panel_crop**(07-30 我按"只有口播裁格,其余整板"全库归类)。07-29 那次"全局翻 panel_crop"已被此分层取代。
- 首帧裁切失败保护闸(技术新加):裁格失败即停派发。KB8 一例失败/KB9 同案例成功 = 偶发,原因待技术。
- `entranceBlackOverlay` 案例级:473 整板={0.5s},114 裁格=零黑幕,Agent 默认关。
- ⛔ **本文件旧版的 lineValidation 表(45-100 等)、语言范围(砍ko)、419-UI 弹窗保存法全部作废**:长度真值看 [[project-thinknova-0729-screenwriter-stack]];语言终版=zh_cn/en/ja/ko/es;**agent 直连 PUT 带 x-csrf-token 已通,businessUi 也能写**(placeholderDefaults 07-31 实证落库+前台送达),弹窗 textarea 法废弃。

## 缺陷链历史(07-28 取证单 8fd0bb09c351,留档背景)
口播单吃到整板 → 三症状:不一镜到底(videoTemplate 触发条件永假)、人物拉长(整板 1.094 比例被压进 9:16)、英文单不吃中文口径。修复路径=裁格分层+videoTemplate 按输入图判定+lineValidation 语义纠正(全程见 screenwriter-stack)。
- 🔴 **缩窄定义=诚信问题**(老板说"口播类都要裁格",我私自缩成 shotCount==1 还报"全部完成")→ 铁律 2.8,详见 [[feedback-dont-assume-requirements]]。
- 几何拉伸技术卡(OPS-VIDEO-20260729-02,参考图宽高比)草稿在 `02_交付内容\`;裁格分层后口播侧已实际根治,整板侧是否仍需此卡待观察。

关联 [[project-thinknova-0729-screenwriter-stack]] [[reference-thinknova-config-powers]] [[feedback-dont-assume-requirements]]
