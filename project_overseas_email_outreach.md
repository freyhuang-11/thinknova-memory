---
name: project-overseas-email-outreach
description: 海外邮件营销线（新马英文商户冷邮件）系统位置、运转、操作命令、盲区
metadata: 
  node_type: memory
  type: project
  originSessionId: e964078a-0c52-4eca-9f02-921ff30c7429
  modified: 2026-08-29T08:09:44.465Z
---

# 海外邮件营销线（我主理，独立于 Codex 海外营销）

新马英文实体商户 → 冷邮件 → 导 thinknova.top 注册用100免费积分自己出片。08-24 建成并跑起来。

## 系统
`D:\SamsoData\Documents\视频制作平台分析\03_工作台\邮件推广系统\`。总入口 `run.py`（注入凭据+环境变量），跑 `python run.py console|send|inbox|dashboard`。控制台 http://127.0.0.1:8025。凭据在桌面 `thinknova.txt`（run.py读，绝不打印）。台账 `outreach.db`（sends/replies/suppression）。

## 🔴🔴 发信架构（08-28 重构，唯一现状）
- **发信只有一条命令**：`python run.py daily_send`。`daily_send.py` = 唯一引擎，自己做：找最新全量名单→剔已联系+抑制→随机抽新马各半→静默/窗口(9-18)/STOP守卫→DB互斥锁→把今天补到 `DAILY_TARGET`(08-28起=300，老板定「不用压」；单箱cap 400)。**幂等**：一天多次调只补到目标、不重复打扰同一人。
- **发信主驱动 = 常驻控制台**(`console.py` 每 600s 一轮调 `daily_send`)。**agent 型定时任务发长信不可靠**(08-29 血案:10:07 任务实际 15:46 才跑、发了 0——agent 结束时把它拉起的发信子进程回收了)，所以主驱动放常驻进程、不放 agent 任务。定时任务 `daily-outreach-send`(10:07) 降级为**备份**(mutex 保证不双发)。⛔绝不直接调 send.py 或手传名单路径。控制台每轮还做:收信+自动回复+兜底清扫漏网回信+红线。
- **名单已挪进** `邮件推广系统\名单数据\`(不再在 03_工作台 根)。daily_send 运行时自动发现最新 `可发名单_<MY/SG>_全量_*.csv`，别写死路径。
- 去重双保险：daily_send 建名单时剔已联系 + send.py `already_sent(email,campaign)`；campaign 名固定 `daily_YYYYMMDD`。

## 关键技术教训（反复踩过）
- 🔴 **Windows 上 socket 端口锁不可靠**：默认允许多进程绑同端口，`SO_EXCLUSIVEADDRUSE` 在多 launcher 环境也挡不住 → 改用 **SQLite 单行互斥锁**(`sendlock` 表，死进程/超6h接管，`pid_alive` 用 OpenProcess 0x1000)。
- 🔴 **本机每个 `python` 调用在进程表显示成 2 个**(D:\hermes venv 启动器 + pythoncore 真解释器)。"2 个 daily_send / 2 个 send.py" = 一条逻辑管线，别当成并发误杀。判并发看 sendlock 持有者 + 输出行数，不数进程。
- 🔴 **电脑睡眠会挂起所有进程+跳过定时任务**：老板"电脑不关"≠不睡眠；发送窗口设 9-18 就是防睡醒后深夜发。send.py 已加逐封静默守卫(跨午夜自停)。
- 🔴 **正则/含中文的代码绝不走 bash heredoc**：`\b` 被 shell 解释成退格0x08，正则全废。用 Write/Edit 直接写文件。
- 🔴 **CSV 空值被 DuckDB/csv 读成 NULL**：`NOT(regexp(NULL))` 返回 NULL 会误删无邮箱行。过滤放生成阶段。
- 🔴 **bbox 猜国家会串**：马来bbox混进13万新加坡记录。用 Overture `addresses[1].country` 过滤。
- 翻译用 MyMemory 端点（Google gtx 返429）；langpair 不认 auto，要明确 en/ms/zh-CN。
- Windows 终端打印中文报 UnicodeEncodeError 但文件通常已写入；跑 py 一律带 `PYTHONIOENCODING=utf-8`。

## 基础设施
域名 trythinknova.com→301→thinknova.top（可达）。Workspace sam@trythinknova.com，SPF/DKIM/DMARC/MX齐。WhatsApp群 chat.whatsapp.com/CAHneI38TGLAHkBAOC4zw8。页脚 JIMENG NETWORK TECHNOLOGY PTE.LTD./Suntec Tower 2 Level 7, Singapore 038989。签名 Frey。

## 名单 Overture Maps（免费$0）
新加坡5.07万+马来22.2万唯一邮箱，全量库 03_工作台/可发名单_XX_全量_2026-08-24.csv。已MX检查+剔连锁/加盟/酒店。死地址~5%（没做邮箱验证，短板）。脚本 scratchpad/overture_wide.py（排除法品类）、mxcheck2.py。

## 自动运转
发信主驱动 = **常驻控制台**(run.py console, 8025)每轮调 `daily_send`(300/天，新马各半)+收信+自动回复+兜底+红线。定时任务 10:07 daily-outreach-send 是备份；22:09 nightly-outreach-report(日报→Obsidian+通知主对话)。仅应用开着+机器醒着时跑。判定器移植自5173(tiktok-creator-tool/backend/services/reply_classifier.py)。interested+other自动发教程，session已关(英文不碰9.5中文场)，红线只看bounce_spam>1%。DAILY_TARGET/SEND_WINDOW 在 run.py 可调。

## 协作
挂在总指挥（Claude Code）体系下，通过 vault 信箱对接：`AgentMemoryVault/01-Projects/ThinkNova/信箱.md`「给总指挥（来自海外邮件营销线）」栏。已提13个信息需求（积分口径/英文出片能力/注册前台/产品边界/素材），等总指挥回真值再校准话术。现状详见 vault `_memory/海外邮件营销线_现状与运转_2026-08-24.md`。

## 首批数据
300封零SMTP失败，被判垃圾0.33%（域名健康可放量），退订0，死地址5%，真实回复1个。

## 08-27 实跑口径修正（重要，别再按 200 封硬发）
- 🔴 **日发量已被主动降到 50+50，不是任务书写的 120+80**。8/26 是 24+16（日志 `[24/24]` `[16/16]`、failed=0 → 是 limit 设小，**不是被中断**，别当故障排查）；8/27 名单预过滤每国只抽 100 条、MY 进程 limit=50。**接这条线先查 `_daily/` 当天名单条数和正在跑的进程 limit，别按老任务书铺量。**
- 🔴 **`prefilter_daily.py` + `_daily/<国>_<日期>.csv` 是新增的一层**：从全量名单剔掉 sends(sent/queued)+suppression 后随机抽 N 条。跨 campaign 不重复打扰同一人。
- 🔴 **两个会话会撞车**：8/27 19:21:44 另一会话起了 MY 发送，和定时任务同一分钟。**动手前先 `Get-CimInstance Win32_Process` 查 `run.py send` 进程**，已有就别重起同国进程。`already_sent` 按 campaign+status in('sent','queued') 去重，dry_run 不挡真发。
- 🔴 **定时任务会晚点补跑**：8/27 这次 10:00 的任务 19:21 才触发（电脑没开机）。晚跑要重算时间账——50 封×75-210s≈2 小时，起跑晚于 22:00 就会撞 00:00-09:00 静默硬闸。
- **死地址率实测 5.5%（19/343）**，逐条核实全是「查无此人/邮箱停用/收件箱满」，零条内容被拒。脚本内置「硬退信>3% 立刻停发」告警**会误报**，按老板口径死地址不算，别被它吓停。**但名单该洗了——每 18 个地址 1 个是死的**。
- 真实回复累计 3 个：`pedasmanja78@gmail.com` 回「yes」(interested，已自动发教程，待人工跟)、`punjabirasoimy@gmail.com` 回「我们没那家分店」(名单地址写错)。
