---
name: reference-voice-clone-pipeline
description: "触发:要合成老板音色之前 → 火山豆包复刻2.0=现行:音色ID/key路径/资源号/情绪参数/免费额度;硅基流动线已废"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6862e621-cd1a-482c-a813-ec6d018d14ad
  modified: 2026-07-31T05:58:40.961Z
---

# 老板音色克隆生产线(2026-07-26 建成,火山豆包复刻2.0)

**用途**:口播旁白不用老板录——脚本→老板音色出音频→配V式画面。见 [[project-thinknova-marketing]]。

## 🔴 定稿配方(07-26老板拍板,直接用别再调)
- **S_rbgc0p2a2(v2新样本)+ speech_rate:20(=1.2倍速)+ 不加情绪参数**(情绪档老板听不出区别,克隆音色对emotion不敏感)
- **配套内容方向=大量输出知识**:老板原话"用我这种声音就只能大量的输出知识了"——冷静干货流,对标李冶/马师傅(都不兴奋照样爆);不硬凹兴奋,不用平台配音音色

## 关键真值(火山·现行)
- **音色ID**:`S_rbgc0p2a2`(剩11次重训);**现行样本=混合版**(scratchpad/vo3/ref_boss_mix.wav=16s平静[照稿念]+16s牢骚[真情绪]拼接,07-31第三训)——单一平静样本=机器人,单一牢骚样本=全程亢奋,混合才有起伏
- 🔴 **样本审核坑**:训练样本被平台ASR转写审核,**脏话=拒收(43001124 ASRTextAuditReject)**;修法=火山flash ASR拿逐字时间戳→ffmpeg aselect逐词切净重拼(ref_boss_v3_clean.wav 的做法)
- **API Key**:`D:\SamsoData\Documents\视频制作平台分析\volcengine_speech_key.txt`(新版控制台,长期有效)
- **合成**:POST `openspeech.bytedance.com/api/v3/tts/unidirectional`,头=Content-Type/X-Api-Key/**X-Api-Resource-Id: `seed-icl-2.0`**(实测唯一通的;volc.megatts.default/voiceclone都不行)/X-Api-Request-Id(uuid);体={"req_params":{"text","speaker":"S_rbgc0p2a2","audio_params":{"format":"mp3","sample_rate":24000}}};返回=流式JSON行拼base64
- **情绪参数**(治"丧"):audio_params 里加 `"enable_emotion":true,"emotion":"happy","emotion_scale":1-5(默认4)`(文档6561/1257584)
- **训练**:POST `/api/v3/tts/voice_clone`(同头,Resource-Id同seed-icl-2.0);**首次建音色必须控制台UI+老板亲手选文件**(API空speaker_id报55000000;工具安全门拦本地文件注入,fetch localhost被Chrome私网拦截);**已有speaker_id后重训全自动API可跑**(07-26实测,传speaker_id=S_rbgc0p2a2即可);extra_params可带disable_volume_normalization=true(更贴样本)
- **样本迭代**:v1=W原片29s(丧,机器人味);v2=老板照录音脚本录36s(2026-07-26,微信m4a→掐静音24k wav);老板"一录音就僵",终极样本=真实聊天/电话时顺手录的
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
