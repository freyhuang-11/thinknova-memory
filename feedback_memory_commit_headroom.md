---
name: feedback-memory-commit-headroom
description: 开重活前看内存的口径——看「已提交内存距上限的余量」，不只看空闲物理内存；用 03_工作台/_tools/_with_lock.py 统一拿锁 + 判余量
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-10-23T07:35:56.774Z
---

老板 10-23 亲口：「内存的事你自己去解决，晚上不够的情况下你想办法留出来」。

- 本机物理 7.8GB、页面文件约 17.7GB，提交上限约 25GB。物理内存紧只会变慢（10-23 01:0x N2 在空闲 0.6GB 时 2 分半渲完）；真正危险的是**已提交内存顶到上限**——那时任何程序（包括老板的 Chrome）申请内存都会失败。
- 开重活一律走 `03_工作台/_tools/_with_lock.py <工作目录> --need <GB> <命令>`：余量 ≥ 预计用量 + 1GB 保底才开工，自动拿放 `_render.lock`。预计用量：ffmpeg 拼片 0.4、HyperFrames 渲染 1.5、Playwright 读后台 0.8。
- 10-23 15:3x 实测大头：Claude 17 个进程合计约 5.3GB 提交（桌面端界面约 1.2GB + 每个会话后台 400–800MB）、Chrome 约 2.2GB、Windows Defender 扫描时从 0.46 涨到 1.25GB、Telegram 约 0.7GB。
- 已跑完 / 卡住的定时任务会话（每天 10 点心跳兜底、每周四数据检查等）进程不退，各占 400–800MB。🔴 老板 10-23 亲口：「这两个你处理把，然后你自己日常心跳处理就可以」→ 心跳里 `list_sessions` 看到这类定时任务的旧运行会话（最后活动 >1 天、isRunning 仍为 true），先 `list_events` 看卡在哪、记下没跑完的活告诉总指挥，再 `stop_session` + `archive_session`。⛔ 碰总指挥、置顶会话（邮件线等）、老板手开的对话；⛔ 强杀进程；⛔ 改 Defender 等安全设置。10-23 实测：两个卡在 PowerShell 调用好几天的会话归档后，提交余量 0.38→2.16GB。

**Why:** 10-23 午后提交余量一度只剩 0.38GB，再开重活会把老板正在用的程序顶崩；只看「空闲物理 ≥0.8GB」既误拦（页面文件够大）又漏判（提交满）。
**How to apply:** 每次重活前用包装脚本；余量不够就排到夜里或等扫描结束；长期不够就把「哪些会话可以归档」列给老板一次让他点。关联 [[feedback-heartbeat-not-cron]]
