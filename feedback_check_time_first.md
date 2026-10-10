---
name: feedback-check-time-first
description: "触发:要说\"现在/刚才/多久之前\"、或要判断某单跑了多久之前 → 先跑 date 取真实时刻,不许凭感觉猜;写记忆用绝对时间戳"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-10-10T09:16:36.281Z
---

**WHAT+DONE**:判断"现在/今天几号/多久之前"必须先取系统真实时间戳,不许凭感觉猜、不许用文件 mtime / 会话早先的 date / git log 时间 / 记忆印象代替。

```bash
date "+%Y-%m-%d %H:%M:%S %A"
```

🔴 本机时区就是新加坡时间(+0800),直接跑 `date` 即真值,不需要 `TZ=` 换算(Git Bash 的 `TZ=Asia/Singapore date` 因缺 tzdata 会回落 GMT,不能用来验证)。

🔴 任何一句带"今天/昨天/几号/星期几/多久前"的话出口之前,当场跑一次 `date`;核验烧单用当前时间减任务 `created_at`,不要单看 `created_at` 或文件 mtime 猜。

🔴 **心跳台账每写一行前也要跑 `date`**（10-10 下午连续五行把 14:5x–15:3x 的事记成 15:4x–17:3x，是凭上一拍时间往后估的）；用 `$(date +%H:%M)` 直接拼进去，别手打。

**Why**:系统提示只给日期不给时刻,反复出现"拿文件 mtime/旧 date 倒推现在"的错误,直接影响当天该发哪张卡这类实际判断。

关联 [[feedback-memory-keep-current]]
