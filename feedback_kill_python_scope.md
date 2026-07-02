---
name: feedback-kill-python-scope
description: 重启 tiktok-creator-tool 时不能 taskkill /F /IM python.exe，会误杀 Compass 后端等其他 python 服务
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 13b9c7a4-13f1-46fb-9e52-731156ceefc2
---

重启 tiktok-creator-tool backend 时**不能**用 `taskkill /F /IM python.exe`。

**Why:** 用户本机同时跑多个 python 服务（tiktok-tool 8000、Compass 8015、有时还有 scraper / Hermes 等）。一刀切会把 Compass 后端连带杀掉，5175 前端就拿不到 API。2026-06-29 已经发生一次（运气好 Compass 用的是另一个 pythonw 解释器没被命中）。

**How to apply:** 只杀目标进程：
1. 先 `Get-NetTCPConnection -State Listen -LocalPort 8000 | Select OwningProcess` 拿到 PID
2. `Stop-Process -Id <PID> -Force`
3. 或按工作目录过滤：`Get-Process python | Where-Object { (Get-Process $_.Id).Path -like '*tiktok-creator-tool*' }`

[[reference-compass-paths]] 里有 Compass 端口；任何 backend 重启操作前都要确认杀的是正确进程。
