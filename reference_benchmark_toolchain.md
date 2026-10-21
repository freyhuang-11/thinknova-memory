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
| 小红书 | **rednote 发布档案(已登录)** | `新内容_外部学习_0929/对标_1022_换方向/_rn_search.py`(搜)+ `_rn_note.py`(在搜索页点开卡片读正文/赞藏评/评论) | ✅ 10-22 实测能用;⛔ 直接开笔记链接(缺 xsec_token 显示「暂时无法浏览」);老板日常 Chrome 的 xiaohongshu.com 没登录 |
| 数据 + 文字稿一条龙 | dbskill `dbs-video-extract` | `00_规格与参考/dbskill/skills/dbs-video-extract/` | 要付费 TikHub / 轻抖,**没开通**;⛔ 替老板买 |
| 转写 | faster-whisper small | 本机 | 有音频就能转 |
| 拆 | `dbs-benchmark`(选对标五重过滤)、`dbs-deconstruct`、`dbs-hook`、`cheat-learn-from`(归档在 `~/.claude/skills/_archive_2026-09-28/`) | dbskill / 归档 | 都只拆不抓,要先喂链接或文字稿 |
| 存档 | — | `03_工作台/新内容_外部学习_0929/对标_<日期>_<主题>/` | 只学结构和开头,⛔ 搬画面音频原文案 |

相关:[[feedback-benchmark-trending-each-analysis]] [[reference-content-skills-dbskill-agentmotion]] [[reference-skills-routing]]

## 选对标的口径(老板 10-21 纠正)
- 只找**和我们同类**的:AI 做的 / 没有真人出镜的。真人出镜片哪怕数据好也只借选题,⛔ 当对标。
- 抖音单条页读字幕:`video.currentTime` 跳秒 + zoom 字幕条;窗口最小化(outerWidth=0)时视频不加载,只能读数据和评论。
