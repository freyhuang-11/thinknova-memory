---
name: reference-studio-shots-for-marketing
description: 营销线故事片的镜头怎么出——10-11 起老板定走「生图 448 + 图生视频 482」（⛔ 工作台），接口、价、坑、拼片脚本
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-10-11T19:26:18.175Z
---

**现行（老板 10-11 22:3x 定，总指挥转）**：知识片 / 故事片镜头一律 **生图 448 出首帧 → 图生视频 482 出 6 秒**，⛔ 工作台（老板：工作台不稳定）。配音、字幕、标题、片尾我们自己做。角标写「画面由 ThinkNova 生成（AI）」。
⛔ 片里说「这条视频的画面就是打一句话出来的」：镜头是按详细提示词逐镜生成的，这么说是假话。

**接口**：在 `api.thinknova.top/robots.txt` 同源页跑 fetch（cookie 鉴权）；写操作带 `x-csrf-token`（从任一 GET 的响应头取）+ `Idempotency-Key`。
- 生图：`POST /api/v1/ai/tasks {capability:'text_to_image', modelId:448, input:{prompt, ratio:'9:16', size:'1024x1536', quality:'high'}}`，6 分 / 张，约 1 分钟。
- 图生视频：`{capability:'image_to_video', modelId:482, input:{prompt, ratio:'9:16', resolution:'720p', durationSeconds:6, referenceImages:[首帧 publicUrl]}}`。482 按秒计费，4 分 / 秒，6 秒 = 24 分；约 2 分钟；出片 720×1280，带环境声。
- 查任务：`GET /api/v1/ai/tasks/{id}` → `data.task.status` / `assets[0].publicUrl`；列表 `?pageSize=&page=`。
- 下载：`新内容_知识片_1012\_dl_task.py OUTDIR name=task_xxx`。逐帧联系表：`_shot_sheet.py <studio 目录> [镜头号]`。

**每镜 30 分**（工作台是 4 分 / 镜）。10-12 下周 6 条共 702 分：多复用已出的镜头，末句画面回到第 1 镜。

**提示词要点**：首帧写死人物外貌（同一条里多镜反复用同一段描述），结尾固定加「no readable text… phone screen faces away」；视频提示词开头写「Continue exactly from this frame…」，并写明不说话、不出字幕、没有音乐。真实人物（A2 老板娘）只拍手和店，在提示词里写死「faces out of frame」。

**坑**
- 482 供应商偶尔报 `Provider task failed: Internal Error`，平台**不自动重试**（尝试 1/3 就直接判失败，积分退回）⇒ 失败就原样重提一次。
- 同时提交多条时，偶尔某条返回 `Internal server error`、没建单 ⇒ 先查列表确认没有，再单独重提；提交之间隔 1.5 秒。
- 生图会不听话：两镜里人物不一致（B2 地铁两张出成两个不同的女生，台词是「他」）、镜头上摇带到脸（A2）⇒ **首帧和每段视频都要逐帧看**；带到脸可以裁画面上方去掉，不必重出。
- Chrome：JS 里 await 长于约 40 秒会 CDP 超时 ⇒ 提交用 `fetch(...).then(存 window 变量)`，另起一个短调用去读；页签会被别的会话关掉 ⇒ 每次先 tabs_context，自己新开一个。

**拼片**：每条一个目录（`新内容_知识片_1012\<键>_<名>\`，从 A1 复制 make.py / tts_k.py / lock_k.py，改 TAG 和锁名），spec 写 LINES / TXT（hook / end1 / end2 / endq / who / ai）/ SHOTS / SUBSPLIT；在目录里跑 `python ../make_story.py zh|en html,render,mix,finish`。
- 中文字幕会断在词中间（「餐 / 馆」「Th / inkNova」），**每条渲完都打印 timeline.json 里的 subs 看一遍**，有断错就加 SUBSPLIT；每屏 ≤10 字（含空格）。
- EN 片尾产品句长了会压到 AI 小字：模板里 `.en #eai` 已下移到 1420。

旧做法（工作台 studio 项目接口、422012 PATCH 坑）见 [[reference-thinknova-video-studio]]。和 [[project-thinknova-marketing]]、[[feedback-knowledge-film-live-feel]] 一起看。

## 🔴 10-23 老板亲口（营销线对话）
- 「你这边生营销视频我不限制你啊」→ 营销视频用平台生成**不设烧单上限**（覆盖心跳里「新烧单每周 ≤6 单」对营销片的限制）；仍要逐帧验、失败重提别狂刷。
- 角色设定板两种版式（老板 10-23 给样张）：①横向四栏（正 / 侧 / 背全身 + 最右脸部特写）＝要换装时用；②上排正脸近景 + 侧脸近景、下排正 / 侧 / 背全身＝不换装时用。🔴 每个角色只出**一张**、出完就用它锁形象，⛔ 两种都做、⛔ 重复出（10-23 老板：「你都有3视图了为什么还要5视图。这是用在不同场景下的锁定形象用的啊」）。
- 剧情连贯（老板 10-23）：「关于剧情连贯性的问题可以用首尾帧衔接」→ 连续场景的下一镜，首帧＝上一镜视频的最后一帧（截帧 → `POST /api/v1/assets/reference-upload` 上传 → 当首帧参考）。
- 生图 448 带参考图：`input.referenceImages:[url…]`（模型 max_reference_images=14，10-23 实测任务里收到）。图生视频现有 482「全能导演版」（≤6 张参考、6–15 秒）和 503「实景还原版」（≤9 张参考），都是 4 分 / 秒。
- 「人物一致性的问题上传形象的3视图啊」→ 固定角色（如 N3 猫老板）先出一张三视图（正 / 侧 / 背）当参考图，之后每镜首帧带着三视图生成；⛔ 再用 HyperFrames 代码画角色片（老板：「这种东西不是应该拿 thinknova 去生成嘛」）。
