---
name: feedback-thinknova-burn-division
description: "触发:要烧单/要生成之前 → 验证类烧单我自己烧不请示;只有要老板肉眼拍板效果的成片才交他;封面图我出提示词交 Codex"
metadata:
  node_type: memory
  type: feedback
  modified: 2026-07-29T00:00:00.000Z
---

**默认:烧单我自己做,不请示。**(老板 2026-07-28 03:35 定,04:0x 又因我反复回到"请老板烧"点名批评过一次。)

- **商家 Agent 整单烧单(offline_store_video / offline_store_content)**:验证性质的我自己烧。烧完自己拉后台数据 + 逐帧核质量,把结论给老板,不是把烧单动作给老板。
- **要老板肉眼拍板"效果好不好"的成片**:烧完交他看。
- **直连测试(文生图/图生图/文生视频/图生视频)**:一律我自己烧,不用等。
- **封面图**:我统一出提示词,老板交 **Codex** 生成(不占积分)。

**但烧之前必须满足**(老板 2026-07-29 硬指令):**提示词全部修完再烧**,不许边修边烧。批量烧单串行,间隔 ≥20 秒。

**Why**:烧单是验证动作不是决策动作,请示只是在浪费老板时间;但没修完就烧=白烧积分。

关联:[[feedback-prompt-first-then-test]] [[feedback-evidence-standard]] [[reference-thinknova-paths]]
