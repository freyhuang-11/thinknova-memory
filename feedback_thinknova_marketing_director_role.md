---
name: feedback-thinknova-marketing-director-role
description: "ThinkNova营销分工——Claude只做\"导演台\"(脚本+拍摄方法+分镜+流程图示),不产成片"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
---

2026-07-08 用户定调 ThinkNova 营销线的分工方式。

**要求**:营销视频这块,Claude 只交付"导演台"式产物,**不生成成片**——
- 脚本(口播台词)
- 视频怎么拍(设备/机位/景别/光线/时长)
- 分镜/流程图示,**精确到什么时候放哪张图、说哪句话**(像导演的分镜表/拍摄板)

**Why**:用户审核不到 Claude 生成的视频(不在同一环境),而且不认为 AI 拼的成片是好视频。真人素材由老板自己拍。

**How to apply**:
- 出可拍摄的分镜表(镜号|时间|景别机位|画面拍什么/放哪张素材|口播|字幕|导演提示)+ 可视化 storyboard 图示。
- 后期(字幕/调色/配乐/图片插入时点)可由 Claude 承接,但交付形式是"指令+时间轴",不是替用户定稿成片。
- 别再花力气用 ffmpeg 拼成片给用户看。见 [[project-thinknova-marketing]]。

**关联教训**:之前用 01_问题诊断\实验成片 的老工程调试片当"平台成品"拼样片,被用户否——素材来源要实地核实,这也是转向"只做导演台"的直接诱因。
