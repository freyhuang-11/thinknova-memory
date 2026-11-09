---
name: project-customer-toolkit-quality
description: 客户 AI 用 MCP+工具包出片质量差（Emily、Gloria 客诉）的诊断、老板口径、技能包位置和下一步——动客户工具包/技能/给客户 AI 的规矩前必读
metadata:
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-11-09T14:19:31.972Z
---

**老板口径（11-09）**
- 第一步完成标准：客户自己的 AI 拿客户资料，做出结构正确、画面正确、配音字幕正确的成片，才算完成。
- 我们只帮客户绑定社媒账号、更新工具包；⛔ 替客户做内容（不给 Emily/Gloria 代做片）。
- 产品片和门店片都是卖货，道理一样，不另起一套结构。
- 核心问题（老板原话意）：客户 AI 写提示词时没有我们那么多规则和负面提示词。我们营销线自己发的片同样是 448 生图 + 图生视频、自己写提示词，结果正常，靠的是积累的规则。

**诊断证据**
- Emily（diamondwanqi，Mac）：3 段 15 秒不剪、每段 12 秒静音、模型自带小字幕、无开头结尾；评估 03_工作台/客户前置_1031/Emily_片段_1108/质量与结构评估_1109.md。
- Gloria（gloriaxie18，卖 LYNE/zyia 产品）：8 个任务里 5 个 text_to_video 0 参考图 → 产品包装被重画；海报是 Codex 自带 GPT 生图 → 人头反；没拼片没字幕；她用豆包做的对照片有卖点大字、产品一致。MCP 任务 input 只有她 AI 写的 prompt + 参考图，没有负面词。
- 我们营销线规则在：memory reference_studio_shots_for_marketing（首帧写死外貌、结尾固定 no readable text/phone screen faces away、视频提示词以 Continue exactly from this frame 开头、三视图锁角色、末帧接首帧、逐帧看、失败原样重提一次、503 人物别让递向镜头）、vault _memory/营销视频知识库.md（不能做/效果好/画面坑）、skills hurricane-shot-prompt / video-script-style / high-retention-hook / hkrr-clock。

**已做**
- 技能包 03_工作台/客户工具包补丁_1108/skills/门店成片/SKILL.md（〇节三条硬规矩：只用 ThinkNova 工具、有产品门店必须照片做首帧、字幕=配音；6 拍；15 秒剪 3 镜；按台词剪；验收）+ render/templates/门店成片_6拍.json；11-09 实测 198 分出 31 秒 8 镜（桌面 技能包测试片_花店_1109_待老板看.mp4）。
- 技术 v3.1.6（18f509e）做了成片检查 --film、字幕 9 字、FFmpeg 解码、下载重试；技能初版只有 12 行，已回信贴原稿；Gloria 加急 6 条（技术总表 23～28）已发。

**下一步（老板 11-09 22:4x 指向）**
- 把营销线实际用的「镜头提示词规则 + 负面词 + 画面坑」整理成工具包技能（客户 AI 每写一条 edit_image / animate_image 提示词都要套），不是只教结构；先在我方账号按「客户 AI 视角」实测，再交技术。
- 可选：请技术确认 MCP 任务是否在服务器端补预设/负面词；服务器端统一套规则是更稳的兜底。

相关：[[feedback-boss-rulings]] [[reference-studio-shots-for-marketing]] [[feedback-directive-over-prohibition]]
