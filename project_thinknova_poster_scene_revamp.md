---
name: project-thinknova-poster-scene-revamp
description: 触发:动海报 agent 场景/案例/styleRule 之前 → 08-03 场景改造现状:三新场景已上线烧验、案例表与视频线独立、场景注册与案例写入配方
metadata: 
  node_type: memory
  type: project
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-08-02T17:47:42.661Z
---

# 海报场景改造(2026-08-03 凌晨,老板拍板"换场景是方向,全面调整")

## 🔴 独立性结论(老板问的第一件事,已实证)
- **海报/视频两条线完全独立**:reference-cases 是两张表(同名 id 如 food_s01_new 两边内容完全不同;视频线 587 条 hint 重写一个字没漏到海报端);businessUi.scenes / businessActions / scenePrompts 也各自一份。**改海报不碰视频,反之亦然。**

## ✅ 已上线(全部烧验通过)
1. **styleRule 重写**(opsEditable.styleRule + blockTemplates.style_rules 双写):撤掉被全量数据推翻的「低饱和莫兰迪主色」条款;新增**词表黑白名单**(白:扫码/电话/到店/体验/免费/套餐/报名/开业/招生;黑:到手价/无门槛/领券/立减/下单/爆款/直播/入会/狂欢/秒杀)+**价格数字字号不许超过主标题**。
2. **scenePrompts S01-S13 全部重写**(原来每条就一句促销腔,零版式语言):每条改为版式+内容重点;**补上 S13 缺失的键**(团购 26 条案例此前无场景提示词)。
3. **S11 口播场景改名**:label「老板/员工口播」→「老板/员工出镜」六语(海报无声音)。
4. **三个内容营销新场景注册上线**:S14 `xhs_cover` 小红书封面 / S15 `wechat_cover` 公众号首图 / S16 `moments_daily` 朋友圈日常图。各配 1 条餐饮试点案例:`food_s14_xhs_cover` / `food_s15_wechat_cover` / `food_s16_moments`(**封面图都还没传,待案例库管理页上传**)。
5. **烧验 3 单全过**:task_b5ca2b787ab4(小红书封面·柠檬茶,效果极好:数字清单标题/手写体贴纸/价格字号小/零促销词)、task_a06ca6e3abb2(公众号首图 16:9 编辑感,合格)、task_cb55d49fe469(朋友圈 3:4,见下待办)。送达已验:image 子任务 prompt 5366B 含 S14 场景词+新词表+价格字号规则+案例 hint,旧低饱和条款已消失。成图在老板桌面。

## 🔴 配方(下次直接用)
- **场景注册运营自己能做**(技术留了口子,S14 视频线时代"保存剥离"的问题已不存在):`businessUi.scenes` push {id,label{zh,en},goal,sortOrder,enabled} + `businessUi.businessActions` push(完整六语 label/description/preview + iconKey + visibleIndustries:[] + sceneId)+ `scenePrompts.SXX{imagePrompt,videoPrompt:''}`,csrf-PUT 整 agent → admin 回读不剥离,**商家端 config 立即可见,建单不 500**(海报线没有 sceneRules 依赖)。
- **案例单条写入:PUT 裸案例对象,绝不要包 `{item:...}`**——包一层会创建全空壳案例(踩过)。donor 抄 `food_s01_new`;title/summary 六语(zh,en,ja,ko,vi,es),visualHint 只有 zh/en,prefill={offer,productName}(非分语言)。
- 建单:POST `/api/v1/business-assets/tasks`,outputType 固定 `poster`,selectedOptions.outputRatio ∈ {1:1,3:4,4:3,9:16,16:9}。
- 成图下载:签名 URL 直下常失败/多文件下载被 Chrome 拦;**去掉 query 直连 OSS 公共桶路径**(thinknova-previews.oss-ap-southeast-1)PowerShell Invoke-WebRequest 稳。

## ⚠️ 待办/待拍板
1. **S16 朋友圈"随手拍"做不像**:成图仍是完整海报排版(标题+卖点列表+CTA 标签),copy 层强制生成结构,案例 hint 压不过。两条路等老板:①接受定位改成"朋友圈轻海报"②要真随手拍需压 copy 层(标题/卖点/CTA 不生成)= 找技术。
2. 三条新案例传封面图(案例库管理页上传,自动写 coverImageUrl)。
3. 新场景铺其他行业案例(等老板看图拍板再铺,铁律 8.5)。
4. copy_rules「价格必须保留」opsEditable 无入口,仍待问技术。

关联 [[reference-thinknova-paths]] [[project-thinknova-brand-product-industry]] [[feedback-case-low-coupling]]
