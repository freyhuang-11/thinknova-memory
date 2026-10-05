---
name: feedback-context-budget-discipline
description: "触发:要点浏览器/要Read图/要分片打印长文本之前 → 合并成一段JS只回一行摘要;判断上下文为何满一律读 usage 字段不看字符数"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f9888687-3c16-4546-9394-03122edbc103
  modified: 2026-09-07
---

**WHAT+DONE**:浏览器截图/长文本操作合并成一段脚本一次执行,只回一行摘要;判断上下文为何满一律读 `usage` 字段(jsonl 字符数是 base64,不等于 token,不能拿来判断)。

**Why**:多次实测证实上下文被顶满不是记忆文件的锅(占比 <0.01%),而是被大量小额工具调用一口一口啃满(单次增量中位数仅 600~1,050 token);最大元凶是浏览器点击截图导航和逐步分片打印长文本。

**How to apply**:
1. 🔴 后台操作一律 `read_page`/`get_page_text`/`javascript_tool` 拿文字,禁止点击工具导航;只在必须给老板看画面时截 1 张。
2. 🔴 证据图走联系表(一条视频压成 1 张 tile 图再 Read),逐帧取证标准见 [[feedback-evidence-standard]]。
3. 🔴 打印前先探字段结构,不整段打印;大段提示词/config 只取命中句 ±60 字,禁止分片打印全文。
4. 🔴 一段 JS/脚本干完一整套流程,只回一行 diff 摘要(旧值→新值+残留计数),禁止"取数→打印→再取数→再打印"。
5. 🔴 探索性查询先列全清单一次问完;诊断类大范围搜索派 subagent,只要结论不要过程。
6. 图片成本按尺寸算不按文件大小(都压到长边 ~1568px,~1,500 token/张),贵的是张数不是单张体积。

## 🔴🔴🔴 2026-09-05 · 额度纪律(老板令:处理额度问题)
1. 并发子 agent 上限 2(老板不在线时上限 1)。
2. 模型分级:机械活(配置 diff/PUT 回读、文件装配、ffmpeg、烧单轮询、上传发布、只读核查)一律 `sonnet`;判断密集型(方案裁定/竞品分析/提示词设计)才用默认模型;Opus 仅在过载时顶替。
3. 单 agent 任务书写明「工具调用≤30次、不等渲染——建单后立即返回任务号,渲染完由总指挥另起轻装 agent 收片」;禁止 agent 内 sleep/计时器轮询。
4. 不 resume 超重 agent:中断写状态到磁盘,新起轻装 agent 从磁盘接;resume 只用于上下文小的 agent。
5. 各线(营销/邮件)同规,共享额度。

关联:[[feedback-memory-keep-current]] [[feedback-evidence-standard]] [[project-thinknova-storyboard-test]]

## 🔴🔴🔴 2026-10-05 · 老板再次点名（「上下文消耗太快，一天要压缩无数次」）
当天的大头（按量）：Gmail `search_threads` 默认视图一次 2–3 万字、`get_thread` 拉带引用的整串、Artifact 整页读回、PDF 带图整读、联系表图十几张、在主会话里做了两份 PDF 方案和一份路演稿的全部排版、一天 20 多封给技术的长信、各线长回执原文进上下文。
规矩（细则写在 `03_工作台/日报/心跳规程_总指挥.md` 的「省上下文」节）：本机检查用 `日报/_beat.py` 一条命令；Gmail 只用 metadata 视图 + pageSize≤3 + newer_than，有新信才读单封；大活（文档、方案、扫描、走查）一律派子 agent，只收结论和路径；给技术一拍最多一封、≤15 行；各线回执 ≤5 行 + 文件路径；战略台只在三个固定拍更新。
