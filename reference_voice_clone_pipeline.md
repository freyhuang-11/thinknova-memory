---
name: reference-voice-clone-pipeline
description: 老板音色克隆生产线(火山豆包复刻2.0=现行):音色S_rbgc0p2a2/key路径/seed-icl-2.0资源号/情绪参数/免费额度;硅基流动线已废
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-07-25T20:13:32.962Z
---

# 老板音色克隆生产线(2026-07-26 建成,火山豆包复刻2.0)

**用途**:口播旁白不用老板录——脚本→老板音色出音频→配V式画面。见 [[project-thinknova-marketing]]。

## 关键真值(火山·现行)
- **音色ID**:`S_rbgc0p2a2`(赠送槽位,剩10个,剩14次重训);样本=W_cfr.mp4 0.40–29.80s(29秒,喊卡前最干净段)
- **API Key**:`D:\SamsoData\Documents\视频制作平台分析\volcengine_speech_key.txt`(新版控制台,长期有效)
- **合成**:POST `openspeech.bytedance.com/api/v3/tts/unidirectional`,头=Content-Type/X-Api-Key/**X-Api-Resource-Id: `seed-icl-2.0`**(实测唯一通的;volc.megatts.default/voiceclone都不行)/X-Api-Request-Id(uuid);体={"req_params":{"text","speaker":"S_rbgc0p2a2","audio_params":{"format":"mp3","sample_rate":24000}}};返回=流式JSON行拼base64
- **情绪参数**(治"丧"):audio_params 里加 `"enable_emotion":true,"emotion":"happy","emotion_scale":1-5(默认4)`(文档6561/1257584)
- **训练**:POST `/api/v3/tts/voice_clone`(同头);但**赠送槽位只能走控制台UI上传**(API空speaker_id报55000000;custom_speaker_id=后付费要下单);UI文件选择器必须老板亲手点(工具安全门拦本地文件注入,fetch localhost也被Chrome私网拦截)
- **免费额度**:2万字符+10音色槽,后付费不用不花钱;**额度快尽先问老板再充**
- 脚本:scratchpad/vo3/volc_tts.py(tts函数可复用)/volc_clone.py

## 已废弃
- **硅基流动 CosyVoice2 零样本**(07-26老板验收"一塌糊涂,情绪乱"):零样本过不了口播质量线;且账号余额已尽(免费ASR也402)。key仍在 视频制作平台分析/siliconflow_key.txt
- 本机开源TTS:7.8G内存无独显,排除

## 背景
- 路线来源:老板发抖音教程(猫掉了,WorkBuddy+火山复刻"有感情无喘息");WorkBuddy角色=我,值钱的是引擎
- **AI生成声明不毁流量**:马师傅《挠痒痒营销法》挂AI声明一天4.8万赞(07-26实抓)
- 数字人(形象)未做,等老板想出镜再录(即梦/剪映分身)
- 07-26试听待验收:桌面 火山试听1_平读.mp3 / 火山试听2_开心情绪.mp3(文本=痒点钩子试写)
