---
name: project-customer-test-line-1110
description: 客户实测线（11-10 总指挥派）：用本机 Codex 按新客户从零实测 ThinkNova 工具包；掉线重连先读实测报告顶部「当前状态」
metadata:
  node_type: memory
  type: project
  originSessionId: dfdde839-3802-479e-a6bb-9deab2cf8013
  modified: 2026-11-10T10:41:53.377Z
---

客户实测线 = 用本机 Codex 模拟新客户（虚构花店）从零装 ThinkNova 工具包 → 做片 → 各平台发布清单，两轮对比（轮次_1 原版 / 轮次_2 装 客户工具包补丁_1108 技能 + AGENTS.md 分工段）。

- 任务书：`03_工作台/客户视角实测_1110/任务书_客户实测线.md`；规矩：`03_工作台/规则总表_我们与客户_1110.md` 二、三节。
- 🔴 进度唯一真值：`03_工作台/客户视角实测_1110/实测报告.md` 顶部「当前状态」——每个关键节点当场更新（总指挥 11-10 令），掉线重连先读它。
- 每轮跑完 SendMessage 给「thinknova新对话」一段话（token、读源码次数、任务号积分、成片路径+check --film、各平台文案、卡点原文）。
- 实跑目录放 git 仓库外的干净文件夹（视频制作平台分析是 git 仓库，Codex 会搜到补丁技能污染原版对照），结果复制回 `轮次_N/`。总指挥已同意。
- 实测坑（11-10）：`--enable skip_host_skill_discovery` 挡不住老板个人技能清单注入（会话记录可证）；`codex exec resume` 子命令没有 `--approve-for-me`，要写成 `codex exec --approve-for-me ... resume <id> "<话>"`；一个额度窗口约 17 万 token，装包+做片一轮就用光；Codex 会调 save_content_rules 写账号。
- 轮次_C（Claude 扮客户 AI，11-10 中午）已出合格片，坑：模型自烧字幕要逐帧看重提；人物镜头只用背后 / 俯拍 / 拍手，侧面平视必露脸；卡 persisting 的单占并发名额；本机内存紧时 check/speech_review 要加 `--model base`；MCP 下载链接要 `curl -L`。
- 轮次_1 结论（11-10 18:39）：不给预算 → 0 积分照片幻灯片；给了预算 → 先报价 + max_credits 建单，但画面只做「照片动起来」、主动关掉视频模型声音改用 Windows 本机 TTS、为过转写检查删掉台词里的店名、读源码 6 次。详见实测报告。
- 定时续跑坑（11-10 18:22）：换新脚本前没停掉旧的「等到点再跑」脚本，两个同时续同一 Codex 会话，旧原话先抢到、新的报 `already has an active writer`。改定时前先 `Get-CimInstance Win32_Process` 查 run_resume / codex 进程并按 PID 停。
- ⛔ 发布到任何平台、⛔ 给技术发邮件、⛔ 改老板 ~/.codex、⛔ 换 Codex 账号（额度用完等恢复时间）。

**Why:** 验证客户 AI 是否按「画面声音交 ThinkNova、拼片字幕交脚本」做出合格成片。
**How to apply:** 接这条线时先读当前状态，再按任务书命令继续；相关口径见 [[feedback-boss-rulings]]。
