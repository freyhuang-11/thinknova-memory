---
name: project-tiktok-creator-tool
description: 现行内部工具的现状快照，最终会被 Compass 替换退役
metadata: 
  node_type: memory
  type: project
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

**路径**：`D:\tiktok-creator-tool`

**定位**：单租户内部工具，FastAPI + SQLAlchemy + SQLite + React/Antd + Vite。日常用了快 1 年，沉淀了大量 edge case 处理。

**数据规模**（2026-06-23 snapshot）：
- `creators` 主库 = **2,360**（2358 SG + 2 other），其中 1,345 有 email，829 有 WA
- `scraped_creators` 中转池 = **79,494**（76,480 MY + 3,014 SG），只 ~3% 有 contact

**核心能力（Compass 还没有的）**：
- Playwright 爬 affiliate.tiktok.com 拿 contact（email + WhatsApp）
- IMAP poller 自动回复 + 10 层规则（bounce / OOO / mis-attribution / 拒绝复述 / AI 兜底）
- WhatsApp Web mis-attribution 6 层防御
- 邮件 300/天 + WA 100/天硬上限，多 SenderAccount 池
- Phone E.164 规范化
- 「待跟进」面板 + cross-product rejection 排除规则

**Why 退役**：自营商家 / 单租户架构撑不住 SaaS 化。Compass 是新底座。

**How to apply**：跟用户讨论 Compass 时，**这套的能力清单可以作为「Compass 需要补齐的功能」参考**，但不能整盘移植（Compass 走 API，这套走爬虫；Compass 多租户，这套单租户）。

**核心规则（不能违反）**：
- 销量 < 50 一律不采集
- 未爬全信息的达人不可以进主库 Creator 表
- 禁止从 CSV 直接灌主库
- .bat 文件必须 CRLF + ASCII
- 重启 backend 用 `cmd /c start "" /B wscript //B vbs` 三层 detach
- 重启 backend **只按 PID 精准杀**，不能 `taskkill /IM python.exe`（会误杀 Compass 等其他 python 服务）

**邮件架构（2026-07-01 切换后）**：
- 域名 jasariellive.com MX = 100% Lark（跟 Google 无关）
- 3 个品牌 sender（NaturElan/Oxeagle/BioOrgan）SMTP 从 `smtp.gmail.com` 切到 **`smtp.larksuite.com:465`**，凭证复用 IMAP 密码
- Lark 公共邮箱 daily cap 450/天/邮箱（当前 daily_limit=300，安全）
- BEME 仍从 `freyhuang19@gmail.com` (personal Gmail) 发，未切
- Google Workspace 里 4 个品牌 user（bemesg/bioorgan/naturelan1/oxeagle1）计划停付/删除
- 回滚备份：`tiktok_creators.db.bak.smtp_switch_20260701_204356`
