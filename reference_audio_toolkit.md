---
name: reference-audio-toolkit
description: 片子配乐/音效工具链（10-01 起）：FluidSynth + GeneralUser GS 音色库 + pretty_midi + pedalboard，路径、授权、用法
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-09-30T19:50:50.576Z
---

老板 10-01：「你自己渲染视频的音效尽可能也要调整一下」「可以下载，我允许你下载和使用一切工具」。在这之前配乐全是 numpy 现合成，偏素、条条相似。

- 位置：`D:\SamsoData\Documents\视频制作平台分析\00_规格与参考\工具\音频\`
  - FluidSynth v2.6.1：`fluidsynth\fluidsynth-v2.6.1-win10-x64-cpp11\bin\fluidsynth.exe`（官方 GitHub release）
  - 音色库：`GeneralUser-GS.sf2`（v2.0.3，261 种乐器 + 13 套鼓）。授权 `GeneralUser-GS_LICENSE.txt`：个人或商业音乐创作都可以无限制使用。
  - 冒烟样例：`_smoke_test.py`（pretty_midi 写 MIDI → fluidsynth 渲染 → pedalboard 压缩、混响、限幅），10-01 跑通。
- Python 库装在 `C:\Users\samso\AppData\Local\Python\pythoncore-3.11-64\python.exe`：mido、pretty_midi、pedalboard。⚠️ 默认的 `python` 是 hermes 虚拟环境，那里没装。
- 渲染命令：`fluidsynth.exe -ni -g 0.8 -r 48000 -F out.wav GeneralUser-GS.sf2 in.mid`
- 🔴 渲染配乐也算本机重活，要先拿 `新内容_周0928\_render.lock`。
- ✅ 声音库 v1（10-01 完成）：`04_素材库\声音库_v1\`
  - 8 首配乐 `配乐\bedNN_*.wav`：lo-fi / 尤克里里 / 流行 / 新闻快讯 / 8-bit / 温暖钢琴 / 复古放克 / 电影感铺垫，各 48 秒，-16 LUFS。
  - 每首有 `分轨\`（仅鼓 / 无鼓）和 `结尾\`（从结尾重拍开始，可以接在任意小节后面）。
  - 22 个音效在 `音效\`。
  - 转折点、结尾时间、适合什么片，都写在 `目录.md`；频谱对比图在 `_频谱总览.png`。
  - 规矩：同一周一批片里，每首配乐只用一次。
  - ⚠️ 没人真听过，全是脚本测的。01、06 偏暗；glitch 音效要多压一点。

关联：[[feedback-boss-rulings]] [[reference-hyperframes-production]]

- 补旁白到已成片（10-01 起）：`03_工作台\新内容_周1012\_build\vo_overlay.py <spec.json> [check]`，spec 里写 src/out/lang/lines[[key,开口秒,台词]]；先 check 看超时，叶子 EN rate 30 实测约 2.5 词/秒、ZH rate 20 约 4.5 字/秒（逗号会拖慢）。
