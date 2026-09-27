---
name: project-thinknova-guide-multilang
description: 教程页 guide 要改成「每个用户看到自己语言的配音视频」—— 等技术部署好再动手
metadata:
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-24T17:13:13.571Z
---

# 🔴 待办：guide 改成五语配音（等技术部署后做）

老板 2026-09-25 原话：**「因为我们的教程页就是要每个用户看到自己语言的教程」**
以及 **「不需要，等技术做好了你再改，你记住这个任务就好了」**

⇒ **⛔ 现在不要动手改 HTML。等技术把 guide 部署好、给了上传口子，再改。**

## 要改成什么

现状（已打包给技术的 zip）：
```
12 条视频 = 6 功能 × 中/英双配音
30 条字幕 = 6 功能 × zh/en/id/ms/vi
⇒ 越南用户选越南语，看到的是【英文配音 + 越南语字幕】
```

目标：
```
30 条视频 = 6 功能 × zh/en/id/ms/vi 五语【配音】
⇒ 选哪个语言就听哪个语言
```

## 素材备齐情况（2026-09-25）

| 语言 | 教程 1-4 | 教程 5-6 |
|---|---|---|
| 中文 | ✅ | ✅ |
| 英文 | ✅ | ✅ |
| 印尼 / 马来 / 越南 | ✅ | 🔄 在做（`build_dub_sea.py` 原来只认教程 1-4，译文在 `script_en56.py` 的 `TR56` 里早就有） |

东南亚语用**原生 TTS 音色**，⛔ 不用老板的克隆音色（中文训的，念印尼语掉辅音 `dapat`→`dapas`）：
`id-ID-ArdiNeural` / `ms-MY-OsmanNeural` / `vi-VN-NamMinhNeural`

## ⚠️ 改的时候要注意

HTML 现在的视频索引逻辑是**「中/英双轨 + 五语字幕」**写死的，
换成五语配音**不是换文件就行**，要改 `thinknova_guide.html` 里 `T` 对象的视频映射。
字幕也要重新生成 —— 每条配音的时间轴不同，⛔ 不能沿用英文配音的时间轴。

打包脚本：`03_工作台\教程视频_0923\pack_for_tech.py`

相关：[[reference-thinknova-paths]]
