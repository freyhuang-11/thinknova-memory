---
name: project-thinknova-guide-multilang
description: 教程页 thinknova.top/jiaocheng/ 的现状与改法：技术已部署并加了 9 个语言按钮但正文字典只有 5 语（ja/ko/es/th 回落英文）；我们已有 th/vi/ms/id 配音视频未接入；改页面=改本地源文件交老板转技术
metadata:
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-10-10T09:22:52.114Z
---

# 教程页（店主操作指南）现状 · 2026-10-10 实拉

- 线上：`https://thinknova.top/jiaocheng/`（技术部署，Last-Modified 10-10 08:26Z，提交 80dca9f3「教程 CTA 保持所选语言」）。单文件 HTML，所有文案在页内 `var T = {zh,en,id,ms,vi}`；语言按钮 `L` 有 9 个（zh en ja ko vi es th ms id）。
- 🔴 **选 ja/ko/es/th 时正文整页英文**：`lang = T[selected] ? selected : 'en'`——字典里没有这四语。老板 10-10 截图指出。CTA 跳转和 `<html lang>` 已按所选语言（ja→/ja/，th→/th/，ko/es 落地页存在）。
- 视频：`YT[feat][lang]` 只有 zh/en/id 三套 YouTube ID（studio 只有 zh/en）；id/ms/vi 走英文视频 + 该语言 CC；th/ja/ko/es 没接任何视频。另有技术的 `guide-media/manifest`（api，签名 URL，version 2）会**优先**于 YouTube 播自传视频，长视频章节已有 en/id/ms 的 manifest 视频。
- **我们已有但没接入的配音视频**（`03_工作台/教程视频_0923/youtube_queue.json`，字段 lang/idx/videoId，`idx` 1–6 = `F` 顺序 start/short/long/poster/mobile/studio）：id 6 条（含 studio PVAhua5Ppb0）、ms 6、vi 6、th 6，10-02/10-04 已传 YouTube。
- 源文件：我们 09-23 打包给技术的 `03_工作台/教程视频_0923/ThinkNova_Guide_打包给技术.html`（5 语 × 4 功能）；技术在其上加了 mobile/studio 两章、manifest、CTA 跟语言、竖屏容器。**以后改页面以线上版为底**（scratchpad 已存 jc2.html），别用旧源覆盖技术的改动。
- ✅ 10-10 17:xx 已修好交老板转技术（未部署前线上仍是旧的）：`02_交付内容/教程页_jiaocheng_多语言修复_2026-10-10/index.html` + `说明_给技术.md`。改动=T 补 ja/ko/es/th；YT 接 th/vi/ms/id；小表补项；`guideVideo` 有本语言 YouTube 配音时不被 manifest 英文盖。构建脚本 scratchpad/build_tutorial.py（输入 jc2.html + tut_*_dict.txt，压缩后 scratchpad 可能没了，源以交付目录为准）。部署后要验：9 语各切一遍正文全译、th/vi/ms/id 视频是本语言配音。
- 旧口径仍有效：老板 09-25「教程页就是要每个用户看到自己语言的教程」。

相关：[[reference-thinknova-paths]] [[feedback-email-tech-immediately]]
