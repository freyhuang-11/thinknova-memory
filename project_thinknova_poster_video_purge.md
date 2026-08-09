---
name: project-thinknova-poster-video-purge
description: "触发:海报提示词/海报案例出问题 或 有人说海报里有视频内容 → 08-09 已全库清毒;海报表底细(837条/615条视频克隆/两表同ID不同步)与清理配方"
metadata:
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-09T16:09:30.335Z
---

# 海报案例库视频语言清毒(2026-08-09,老板发现"海报提示词里有视频内容")

## 底细(核实过的事实)
- **海报表(offline_store_content)837 条,其中 615 条与视频库同 ID**——海报库当年从视频库克隆而来(08-03 记录:原13场景是"视频线抄来的意图分类")。**两表独立不同步**:视频侧的停用/修复不会传到海报侧(实证:ks_re_agent_talk 视频侧已停用,海报侧仍启用)。
- 这 615 条是海报库的工作资产(S01 门店海报主体),**不能停用,只能改文本**。
- agent 模板层干净:blockTemplates 的海报主模板(`template` 键)无视频词;video/video_prompt/first_frame_prompt 键是多目标架构里视频目标的模板,不掺海报。

## ✅ 已清毒(08-09)
- 124 条启用案例含视频词(台词97次/镜头66次/口播38次;S01=80,S05=17,S12=16,S04=10,S07=1)
- **123 条手术完成**,全表复扫零残留;1 条保留(ss_livestream_room:"机位/提词器"是直播间实物设备,合法内容)
- 改写词典:台词播报X→文案区写清X / 对镜口播→正面出镜半身像 / 镜头扫过·环视·绕→画面呈现·同框·全景 / 一镜到底→一图看全 / 节奏平稳·中快→构图平稳·饱满 / N格围绕→主图+辅图 / 台词方向=→文字区写
- 海报语境合法词:标题位/文字区/价格区(海报是设计图,排版文字是本分)

## 配方
- 海报案例分页:**`pageSize`(上限60)才有效**,`page_size` 无效(固定20);单条 GET/PUT 与视频表同构,URL 换 agent 码 offline_store_content
- 起草→守卫替换→PUT→全表复扫,家族同文压缩执行(member/recruit/daily/price_video 四族同句)

## 🔴🔴 08-09 深夜 P0 事故与三修复(重大客户 joeylu 测试单 task_c9b2f527362e)
- **事故**:客户只填"新加坡国庆节"(space_stay S09,无价格无时间,传了3张空间照)→成品编造"每晚299元起"+"8月1-31日"+拼错INGAPPRE;3张参考图被缩成右下角小贴块,主画面是无关泳池;版式大红促销与老板给的美图参照(留白/竖排/器物/低饱和)完全相反。
- **根因**:①copy_rules"必须保留价格地址不得遗漏"压过"不得虚构"→无料硬编 ②图生图模板矛盾句"锁定参考图空间"vs"必须重新生成不沿用原图构图"→模型自由发挥+参考图拼贴 ③08-03场景改造时S07-S09"保留不动",S09节日根本没美图化,重大客户恰好测的就是它。
- **三修复已落库(全文本层,回读verified)**:①copy_rules首句→"没填的整块省略,绝不虚构价格/日期/电话/地址;禁'限时优惠/别错过'空话" ②scenePrompts.S09.imagePrompt→美图画册质感(静物主角/留白/竖排衬线标题/低饱和单色系/禁贴纸吊牌爆炸标签倒计时/像杂志封面) ③platformAdapters.image_to_image.poster 矛盾句→"以参考图空间为主画面,可换角度光线,必须一眼认得出是那家店,绝不缩成小图拼贴"。
- **✅ 08-10 凌晨闭环:两轮修复+复烧验证通过**。第一轮(copy_rules/S09/参考图句)后复烧 task_665721631929:上70%美图感成立但底部仍编¥88套餐+假店名地址——**漏网点=`promptAssembler.image.outputTypePrompts.poster` 里还有一份"必须保留价格"**(多层同罪)。第二轮补 4 处:outputTypePrompts.poster 改条件省略 + 海报/视频两 agent 的 business_fact 模板双镜像各加「留空(等号后无内容)=商家未填:画面绝不出现对应信息,绝不编店名/地址/电话/价格/套餐/日期」。复烧 task_63755e3d4034:**零编造+全版面美图感**(竖排书法/静物/留白/低饱和),达标。
- **拒绝编造=两条产品线硬规(6处守卫)**:海报4(copy_rules/outputTypePrompts.poster/business_fact×2)+视频2(business_fact×2)。查同类问题先搜「必须保留|必须准确体现|不得遗漏」——**同一铁律可能在多层各有一份,修一处不算修完**。
- warre_wei 鸳鸯火锅单(task_82dbc761b172)核过:无编造——店名地址=商家资料注入(证据:图prompt里"门店名=吴幺妹;地址=…"),169=客户填。**判编造前先查商家资料注入**:父单input无≠没数据,profile走job注入。
- 小尾巴:新版海报底部三行小字是案例描述语泄漏上画面(如"本地华人风格门店场景"),不算编造待小修;S07/S08 两个"保留场景"未美图化=同类雷待排。
- **海报烧单正解**:POST `/api/v1/business-assets/tasks`(与视频线同构,productName/offer/caseId,**caseId必填**);/offline-store-content/tasks 是另一条路(fields.productOrServiceName 过验证但500,弃用)。商家海报案例列表 `/api/v1/business-assets/reference-cases?industryId=`。
- 海报前台=/zh/app/business-assets;offline-store-content/config 有 fieldSchemas(productOrServiceName*/price/address/activityTime/phone/wechat/extraNotes)。

## ⚠️ 长期
- 两表同 ID 不同步是持续风险:视频侧改案例时,想想海报侧同 ID 条要不要跟(尤其停用/改名)
- 海报侧另有自己的名实/重复问题未体检过(本次只清了视频语言),要做照搬视频侧三维体检法
