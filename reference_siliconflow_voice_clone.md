---
name: reference-siliconflow-voice-clone
description: "老板音色克隆生产线(硅基流动CosyVoice2):key路径/音色URI/调用法/验收法;情绪指令治\"丧\";AI声明不毁流量(马师傅实证)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-07-25T19:17:13.142Z
---

# 硅基流动·老板音色克隆(2026-07-26 建成,试听已出待老板验收)

**用途**:口播旁白不用老板录——脚本→老板音色出音频→配V式画面,老板零动作。见 [[project-thinknova-marketing]]。

## 关键真值
- **API key**:`D:\SamsoData\Documents\视频制作平台分析\siliconflow_key.txt`(老板曾贴进聊天,如介意可后台重置)
- **音色URI**:`speech:laoban:d9igivlsssvc738s2no0:novqbnqrfavskltjlbby`(模型 FunAudioLLM/CosyVoice2-0.5B 零样本克隆)
- **克隆样本**:W_cfr.mp4 的 0.50–10.60s(scratchpad/vo3/ref_boss.wav);参考文本必须贴**实际语音**不是脚本稿(老板会即兴改词)
- 脚本:scratchpad/vo3/ 下 clone_upload.py / tts_test.py / asr_check.py(urllib 直调,asr-venv 的 python 跑)

## 调用法
- 合成:POST api.siliconflow.cn/v1/audio/speech,{model, voice=URI, input, response_format:mp3, speed}
- 🔴 **情绪指令治"丧"**:input 前缀 `用精神饱满、带笑意、像跟隔壁店老板聊天一样的语气说这段话<|endofprompt|>`——实测指令不会被念出来(回转写验证过)。老板原声情绪丧,克隆后情绪由我指定
- 回转写验收(免费):POST /v1/audio/transcriptions,model FunAudioLLM/SenseVoiceSmall,multipart
- 成本:~$7.15/百万UTF-8字节,一条300字脚本≈4分钱;上传克隆免费

## 背景判断
- 本机(7.8G内存/无独显 Iris Xe)跑不动开源TTS本地推理,已排除;不够像的升级路=MiniMax 99元/音色专属克隆
- **AI生成声明不毁流量**:马师傅《挠痒痒营销法》挂"内容由AI生成"声明,一天4.8万赞(07-25发,07-26实地抓取)。发布时照规矩勾声明
- 数字人(形象克隆)未做:老板说"只给口播和你做的画面也可以",等他想出镜再一次录制补(即梦/剪映分身,拍摄清单我给)
