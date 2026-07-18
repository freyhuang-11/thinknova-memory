---
name: reference-hyperframes-production
description: HyperFrames视频生产线——口播正片/纯动效成片的完整工作流、关键坑、文件位置(营销线核心产能)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
---

**ThinkNova营销视频生产线(2026-07-16建成,已产出5条成片)**:老板录口播/生成素材 → 我用 HyperFrames(npm,配小蓝prompt bank方法论)全自动合成交付。

## 工作流
1. **口播正片**(①②那类):老板录口播(纯色墙+半身构图+光亮)→ faster-whisper转写(scratchpad/asr-venv,词级时间戳+opencc繁转简+FIX错字表)→ `hyperframes remove-background`抠像(CPU约0.9s/帧,75s≈35分钟)→ 生成器拼合成(gen_finals.py)→ render → 桌面交付。
2. **纯动效成片**(③④⑤那类):素材库成片+录屏直接拼,零实拍,无声版交老板配音。
3. 项目在 `scratchpad/hf-test/my-video`(会话级!丢了`npx hyperframes init --example blank`重建,合成html备份在 对外推介/ 无,**重要合成应拷回项目目录**)。

## 定稿模板(小蓝式,demo5版,老板拍板)
浅蓝白舞台(#F5F9FD渐变+蓝点阵)+ ThinkNova蓝#2E6BFF/橙#FF7A29 + **人像下半区白描边**(drop-shadow四向6px白)+ **头顶元素一拍一换**(chip+大字/白卡/成片卡/清单/等式/CTA)+ **短句字幕悬头顶y600**(深蓝+白光晕)+ 蓝块slam(金句2-4次)。小蓝方法论:字幕分档/锁人声/两色封顶/砸4-6帧/字微呼吸/永不盖脸;背景=固定舞台元素轮换,不整场切换。

## 🔴 关键坑(都踩过)
- **8GB内存机器渲不动"75s全程透明人像"**:alpha源强制提取成PNG序列,Chrome解码位图累积~3GB后固定帧号卡死(878帧),换采帧模式/清缓存均无效。**解法=三层合成(07-18定型,正片①②实证)**:①底版comp(去掉person+slam,轻量jpg输入)正常渲;②砸字层单独comp渲透明webm(--format webm);③ffmpeg叠人像+白描边(alpha膨胀dilation×6≈CSS白描边)+叠砸字层。脚本=_合成源文件/gen_layers.py(自动拆层)+run_queue2.sh(全流水线含composite滤镜图)。
- **data-media-start+data-duration不得超过源片时长**:提帧在源片末尾截断,渲染到缺帧时刻就60s无进展被看门狗杀掉(报"capture stalled"),留≥0.5s余量。
- **视频嵌进带data-start的div会被冻结成静帧**——视频必须顶层直挂+自带id+样式圆角边框(border-radius/border直接写在video上)。
- 非1080×1920的视频当全屏背景会摆不满→先ffmpeg预缩放到1080×1920再喂。
- 中文字体必须 `@font-face src:local('Microsoft YaHei')` 否则报错掉字;emoji可用。
- 每个常驻层独立data-track-index(同轨重叠报错);根目录只能有一个含composition-id的html(多了会重复发声)。
- 渲染≈时长的8-15倍(75s片约10分钟);check的对比度/遮挡报错可用data-layout-allow-*标注豁免。
- 抠像质量取决于录制背景干净度;杂背景会保留门框/柱子残块。
- transcribe需装whisper-cpp(没装),用scratchpad/asr-venv的faster-whisper代替;PYTHONIOENCODING=utf-8必须。

## 素材库(对外推介/营销视频_导演台/成品素材库)
01海报7张(行业_内容_task短号命名)/ 02视频成品=15s AI口播成片(奶茶小吃餐饮美甲服装家政KTV+甜品/女装新增;美睫理疗花店已投单生成)/ 03界面录屏(抖音用素材.mp4=32s全流程)/ 04操作长片3版 / 05视频截帧8张。台账=_命名与用法.md。
