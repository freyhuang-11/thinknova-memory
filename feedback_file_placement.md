---
name: feedback-file-placement
description: "触发:要写文件到桌面、或老板说「桌面上有X」之前 → 桌面=D 盘 SamsoData/Desktop(不是C盘),只放成片成图;文档一律进 视频制作平台分析 对应子目录并在总表加行"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
  modified: 2026-09-07
---

**WHAT+DONE**:桌面指 D 盘 `SamsoData\Desktop`(不是 C 盘系统默认残留),只放成片成图;文档一律进 `视频制作平台分析` 对应子目录并在总表加行。

🔴🔴 别猜,跑 `[Environment]::GetFolderPath('Desktop')` 一秒出真值;压缩摘要里带的路径也不可信,写桌面前必核一遍。

**桌面(`D:\SamsoData\Desktop`)只放要给老板当场看的测试成片(mp4)/成图(海报)。** 其他一切文档(给技术交付/诊断/清单/报告)一律进 `D:\SamsoData\Documents\视频制作平台分析\` 对应子目录:
- 给技术/交付类 → `02_交付内容\`
- 诊断/待办 → `01_问题诊断\`
- 规格与参考 → `00_规格与参考\`

**How to apply**:生成文档前先想清归属子目录,别默认桌面;新增文档在 `README_从这里开始.md` 总表加一行,旧版被取代就移进 `_归档` 并删该行。参见 [[reference-thinknova-paths]]。
