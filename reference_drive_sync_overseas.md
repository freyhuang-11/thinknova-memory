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
