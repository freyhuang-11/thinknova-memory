---
name: project-overseas-email-outreach
description: 海外邮件营销线（新马英文商户冷邮件）系统位置、运转、操作命令、盲区
metadata: 
  node_type: memory
  type: project
  originSessionId: e964078a-0c52-4eca-9f02-921ff30c7429
  modified: 2026-08-25T15:16:47.002Z
---

# 海外邮件营销线（我主理，独立于 Codex 海外营销）

新马英文实体商户 → 冷邮件 → 导 thinknova.top 注册用100免费积分自己出片。08-24 建成并跑起来。

## 系统
`D:\SamsoData\Documents\视频制作平台分析\03_工作台\邮件推广系统\`。总入口 `run.py`（注入凭据+环境变量），跑 `python run.py console|send|inbox|dashboard`。控制台 http://127.0.0.1:8025。凭据在桌面 `thinknova.txt`（run.py读，绝不打印）。台账 `outreach.db`（sends/replies/suppression）。

## 关键技术教训（反复踩过）
- 🔴 **正则/含中文的代码绝不走 bash heredoc**：`\b` 被 shell 解释成退格0x08，正则全废。用 Write/Edit 直接写文件，或 Python 从文件读。
- 🔴 **CSV 空值被 DuckDB/csv 读成 NULL**：`NOT(regexp(NULL))` 返回 NULL 会误删无邮箱行。过滤放生成阶段，别走 CSV 中转。
- 🔴 **bbox 猜国家会串**：马来bbox混进13万新加坡记录。用 Overture `addresses[1].country` 过滤。
- 翻译用 MyMemory 端点（Google gtx 返429）；langpair 不认 auto，要明确 en/ms/zh-CN。
- Windows 终端打印中文报 UnicodeEncodeError，但文件通常已写入——报错在print不在写文件，核实别重写。

## 基础设施
域名 trythinknova.com→301→thinknova.top（可达）。Workspace sam@trythinknova.com，SPF/DKIM/DMARC/MX齐。WhatsApp群 chat.whatsapp.com/CAHneI38TGLAHkBAOC4zw8。页脚 JIMENG NETWORK TECHNOLOGY PTE.LTD./Suntec Tower 2 Level 7, Singapore 038989。签名 Frey。

## 名单 Overture Maps（免费$0）
新加坡5.07万+马来22.2万唯一邮箱，全量库 03_工作台/可发名单_XX_全量_2026-08-24.csv。已MX检查+剔连锁/加盟/酒店。死地址~5%（没做邮箱验证，短板）。脚本 scratchpad/overture_wide.py（排除法品类）、mxcheck2.py。

## 自动运转
定时任务：10:00 daily-outreach-send（发200封）、22:00 nightly-outreach-report（日报→Obsidian每日输出+通知主对话）。仅应用开着时跑。判定器移植自5173（tiktok-creator-tool/backend/services/reply_classifier.py）。interested+other自动发教程，session已关（英文不碰9.5中文场），红线只看bounce_spam>1%。

## 协作
挂在总指挥（Claude Code）体系下，通过 vault 信箱对接：`AgentMemoryVault/01-Projects/ThinkNova/信箱.md`「给总指挥（来自海外邮件营销线）」栏。已提13个信息需求（积分口径/英文出片能力/注册前台/产品边界/素材），等总指挥回真值再校准话术。现状详见 vault `_memory/海外邮件营销线_现状与运转_2026-08-24.md`。

## 首批数据
300封零SMTP失败，被判垃圾0.33%（域名健康可放量），退订0，死地址5%，真实回复1个。
