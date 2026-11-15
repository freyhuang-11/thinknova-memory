---
name: feedback-send-videos-in-chat
description: 做出来的视频/成片一律用 SendUserFile 直接发进对话框，不要只报路径
metadata:
  node_type: memory
  type: feedback
  originSessionId: dfdde839-3802-479e-a6bb-9deab2cf8013
  modified: 2026-11-15T13:36:51.613Z
---

做出来的视频（成片、测试片、原片）当场用 SendUserFile 发进对话框（display: render），附一句说明；不要只在文字里写文件路径。

**Why:** 老板 2026-11-15 说「你做出来视频直接发在对话框里，不然我找不到」——中文长路径他翻不到。
**How to apply:** 每出一条片就发，不攒到最后；作废的片不发，或标明作废。相关：[[project-customer-test-line-1110]]
