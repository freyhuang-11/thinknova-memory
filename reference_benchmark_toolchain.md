---
name: reference-benchmark-toolchain
description: 触发:找对标 / 拆别人的爆款 / 老板说「拆分别人的视频」→ 先开这张表:哪个平台用哪个工具拿数据和文字稿、哪个 skill 拆、各自卡在哪
metadata:
  type: reference
---
老板 10-21 两次骂我「你明明下载过还用过」「没整理自己的 skills」——找对标前先读这张表,⛔ 重新装工具、⛔ 先去登录网页一条条看。

| 步骤 | 工具 | 在哪 | 现状(10-21 实测) |
|---|---|---|---|
| 拉 YouTube / B 站 / TikTok 数据和字幕 | yt-dlp 2026.08.19 | `03_工作台/_tools/ytdlp_env/Scripts/yt-dlp.exe`(独立环境,10-18 装) | YouTube 拉音频被「不是机器人」拦,**拉自动字幕能用**(10-18 竞品 5 条就是这么拆的) |
| 拉抖音 | 同上 | 同上 | ❌ 403「Fresh cookies needed」,换了新鲜 cookie 也不行(抖音加了签名);分享页 iesdouyin 也不给数据 |
| 抖音替代 | 老板日常 Chrome(claude-in-chrome) | 单条视频页 `douyin.com/video/<id>` | ✅ 能读标题 / 发布时间 / 赞评藏转 / 评论;搜索几次后要「一键登录」(老板本人点);Playwright 档案搜索会弹人机验证 ⛔ 碰 |
| 小红书 | 老板日常 Chrome | xiaohongshu.com | 网页版要扫码登录(老板本人);创作者后台档案只能看自家笔记 |
| 数据 + 文字稿一条龙 | dbskill `dbs-video-extract` | `00_规格与参考/dbskill/skills/dbs-video-extract/` | 要付费 TikHub / 轻抖,**没开通**;⛔ 替老板买 |
| 转写 | faster-whisper small | 本机 | 有音频就能转 |
| 拆 | `dbs-benchmark`(选对标五重过滤)、`dbs-deconstruct`、`dbs-hook`、`cheat-learn-from`(归档在 `~/.claude/skills/_archive_2026-09-28/`) | dbskill / 归档 | 都只拆不抓,要先喂链接或文字稿 |
| 存档 | — | `03_工作台/新内容_外部学习_0929/对标_<日期>_<主题>/` | 只学结构和开头,⛔ 搬画面音频原文案 |

相关:[[feedback-benchmark-trending-each-analysis]] [[reference-content-skills-dbskill-agentmotion]] [[reference-skills-routing]]
