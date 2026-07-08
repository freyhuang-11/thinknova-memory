---
name: feedback-scope-boundary-explicit
description: "给技术的数量/范围/开关类需求,必须显式写反向边界(仅作用于X,禁止碰Y),否则会串进共用调用导致回归"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

给技术写"数量/范围/开关"类需求时,只写正向("海报出 N 张")不够,**必须同时写反向边界**:作用域=仅 X;明确**不作用于 Y**(列出共用链路上的兄弟场景)。

**Why**:共用调用/函数是"串味"高发点。实现者拿到"按张数出 N 版"会取最省事的改法——把 n 参数加在共用的 t2i 出图调用上。海报和视频的分镜板走的是同一个出图调用,于是海报多张逻辑串进视频,视频分镜图(六宫格母版,本该恒 1 张)也跟着出多张 → 回归 bug。根因不是技术乱改,是我从 0626 到 0708 多份多张规格从没声明"视频分镜图恒 1 张"。

**How to apply**:任何涉及数量/范围/开关/多版的需求卡,附一行硬边界——"作用域=仅 outputType=X;共用链路上的 Y(此处=视频分镜图中间产物)不受影响,恒为默认值"。并给双向验收(X 生效 + Y 不受影响,两条同时成立)。参见 [[reference-thinknova-config-powers]] 的"反向错/正向错"镜子、[[feedback-tech-doc-checklist]] 的发文自检。
