---
name: reference-drive-sync-overseas
description: 给海外营销 Codex 同步素材：老板 Google Drive「ThinkNova_海外营销同步」文件夹；文本走 Drive 插件，视频走老板 Chrome 上传（≤10MB）
metadata:
  type: reference
---
- 文件夹：老板 Drive「ThinkNova_海外营销同步」（id 1yriA9njE8mEPGH7qJAL0kEOyv_bGEkfn），子文件夹「视频」（id 1VkE3MZBKdx8-h39ptx_qU7135kLPQ4MU）。顶层 00_更新说明_YYYY-MM-DD.md 写现行口径和本次新增。
- 文本或文档：Drive 插件 create_file（textContent，parentId 指文件夹）直接传。
- 视频：插件要 base64，太大不可行。改用老板 Chrome：先 ffmpeg 压到 <10MB（crf 25、maxrate 3500k）→ 打开文件夹页 → JS 注入一个 input[type=file] → file_upload 传进去 → 在 elementFromPoint(屏幕中下) 上依次 dispatch dragenter / dragover / drop（DataTransfer 带文件），Drive 就会上传。传完用插件 search_files（parentId）核对。
- 每次同步后在 vault 信箱写一段提醒海外 Codex。
- 海外线主战场（老板 10-15）：FB、LinkedIn、X，可用 IG；每天信箱记一行数据，每周日写周分析。相关 [[feedback-boss-rulings]]
- 🔴 分工（10-18 总指挥确认）：海外线的需求只经总指挥派来、由总指挥审，⛔营销线直接接；成片传「视频」子文件夹后回总指挥一条：文件名、平台、时长、语言、有无 AI 标注、「已查禁语」（上传前逐秒查画面、字幕、口播，⛔ one line / single line / 一句话）。海外线的问题经总指挥转来。

## 10-18 片子流转
- 派活和审稿只走总指挥；营销线自己传 Drive「视频」并回执（文件名、平台、时长、语言、AI 标注、已查禁语）；Codex 从 Drive 取，问题经总指挥转。

## 10-18 海外营销线 Codex 不在本机
- 老板：海外营销线不在这台电脑上 ⇒ 给 Codex 的东西只能通过共享库（vault git）或 Drive，不能写本机路径。营销线自动发布脚本模板已放 vault 01-Projects/ThinkNova/参考脚本_营销线自动发布/。

## 🔴 每周一 Drive 清理（老板 10-21 定）
- 过不过时 ⛔ 营销线自己判，必须先问海外线：每周一在 vault 信箱「给海外营销」栏列出 Drive「ThinkNova_海外营销同步」（含「视频」）每个文件，请它逐条回「已发 / 已排 / 还要用 / 不再需要」。
- 只把它标「不再需要」的用 Drive 插件 update_file 改 parentId 移进同步文件夹下「99_归档」（没有就建）。⛔ trash、⛔ 删除；没回的一律不动，下周再问。
- 动完回总指挥 ≤5 行：移了哪些、还挂着哪些。
- **Why**：10-21 我凭版本号和禁语判过时，差点动海外线已排在用的素材（三张海报 IG 10-21、X 10-23 在用），老板纠正：要看对方发没发。
- 新素材照旧：上传前 ASR + 逐帧查禁语，同文件夹放 `00_说明_*.md`，信箱提醒 Codex，回执总指挥。
