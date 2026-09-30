---
name: reference-audio-toolkit
description: 片子配乐/音效工具链（10-01 起）：FluidSynth + GeneralUser GS 音色库 + pretty_midi + pedalboard，路径、授权、用法
metadata:
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-09-30T18:03:21.085Z
---

老板 10-01：「你自己渲染视频的音效尽可能也要调整一下」「可以下载，我允许你下载和使用一切工具」。在这之前配乐全是 numpy 现合成，偏素、条条相似。

- 位置：`D:\SamsoData\Documents\视频制作平台分析\00_规格与参考\工具\音频\`
  - FluidSynth v2.6.1：`fluidsynth\fluidsynth-v2.6.1-win10-x64-cpp11\bin\fluidsynth.exe`（官方 GitHub release）
  - 音色库：`GeneralUser-GS.sf2`（v2.0.3，261 种乐器 + 13 套鼓）。授权 `GeneralUser-GS_LICENSE.txt`：个人或商业音乐创作都可以无限制使用。
  - 冒烟样例：`_smoke_test.py`（pretty_midi 写 MIDI → fluidsynth 渲染 → pedalboard 压缩、混响、限幅），10-01 跑通。
- Python 库装在 `C:\Users\samso\AppData\Local\Python\pythoncore-3.11-64\python.exe`：mido、pretty_midi、pedalboard。⚠️ 默认的 `python` 是 hermes 虚拟环境，那里没装。
- 渲染命令：`fluidsynth.exe -ni -g 0.8 -r 48000 -F out.wav GeneralUser-GS.sf2 in.mid`
- 🔴 渲染配乐也算本机重活，要先拿 `新内容_周0928\_render.lock`。
- 用法方向：做一个可复用的声音库（6–8 种风格不同的配乐 + 一套音效），每条片挑不同的，同一批不重样。

关联：[[feedback-boss-rulings]] [[reference-hyperframes-production]]
