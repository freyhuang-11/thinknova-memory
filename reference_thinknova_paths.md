---
name: reference-thinknova-paths
description: ThinkNova 平台的域名/接口/项目id/存储等固定坐标
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ae79179-08eb-4ee4-a0c1-aeeabe1f4300
---

ThinkNova 实体店双Agent的固定坐标(配合 [[project-thinknova-offline-agents]])。

## 域名
- 商家前端:`https://www.thinknova.top`(工作台 `/zh/app`;视频 `/zh/app/business-video-assets`,海报 `/zh/app/business-assets`)
- 后台:`https://admin.thinknova.top`(freyhuang19@gmail.com=super_admin)
- API:`https://api.thinknova.top`

## 后台 API(cookie 鉴权,base `/admin/api/v1`)
- `GET /agents` 列表(含每个agent的 config 对象,字段名是 `config` 不是 config_json;offline_store_video=id4/offline_store_content=id3)
- `PUT /agents/{code}` 保存(body=完整agent对象)
- `GET /ai-tasks` 任务列表(prompt字段截断到280;有capability/status/model_name/prompt);任务详情接口按id/no返回null,读全prompt从后台任务中心弹窗DOM或列表

## 商家 API(cookie 同会话有效,base `/api/v1`)
- `GET /auth/me` → freyhuang=user id 1687
- `GET /credits/balance` → available~10万
- `GET /credits/transactions?page=&page_size=` → 积分流水明细(type=task_freeze/补扣/退回,含 balance_after)——**验计费用流水,别用余额差猜**
- `GET /business-video-assets/config`(带 `x-thinknova-locale` 头 zh/en/ja/ko/vi/es)/ `GET /business-assets/config`
- `POST /business-video-assets/tasks` 建单(**纯API建单,别点UI**;header 加 `x-thinknova-locale:zh`)。body:
  ```
  {businessScenario, caseId, industryId, outputType, productName, offer, selectedOptions{}, sellingPoints[]}
  ```
  - `businessScenario`=**内容类型action id**(new_item/promotion/bestseller/price_menu/process_show/festival…对应S01/S02…),**不是行业id**(填行业报"生意场景不存在")
  - `caseId`=referenceCases[].id(如 food_v2_S01_service_intro);`industryId`=food_beverage 等
  - `productName`=商品名(**必填**;不是 productOrServiceName——那是内部编剧字段),`offer`=价格/活动(**必填**,空串也被拒)
  - `outputType`=video_10s / video_30s_compound;`selectedOptions`={copyLanguage,videoRatio,videoStyle,appearanceMode,visualFocus,endingCta,paceLevel};`sellingPoints`=[selling_point_...]
  - 返回 `data.task.taskNo`;成功码 code:0。字段全在 GET config(referenceCases/businessActions/detailOptionGroups/defaultState)里查
- 子任务链:admin `GET https://api.thinknova.top/admin/api/v1/ai-tasks/{id}?payload_only=1`(cookie),用 `input.parentTaskNo` 串同一单;编剧看 `input.systemPromptSource`+`output.dynamicJson`(台词lines);i2v 看 `input.prompt`/`negative_prompt`/`reference_image_urls`
- `GET /business-video-assets/tasks/{taskNo}` 任务详情(含成品URL)

## 成品存储
输出URL在 `thinknova.oss-cn-beijing.aliyuncs.com`(需鉴权,直下403) / `imagemax2.zhoushurencz1.top`(图片直下) / `1renfile-1256831266.cos.ap-chengdu.myqcloud.com`(视频mp4直下)。

## Stitch(桌面版设计)
- MCP工具 mcp__stitch__*。项目id `7645298167327483745`
- 设计系统资产:**de3066bd37a14171a910147397094225 = Ethereal Editorial(站点蓝#2563eb,用这个)**;a288846070fc4ae491c8731db4b76ceb = 会渲染成Indigo AI靛紫(别用)
- HTML源码可从 list_screens 每屏的 htmlCode.downloadUrl 下载(bash中文文件名会乱,用PowerShell Invoke-WebRequest)

## 环境坑
- 输出含 query string 或 cookie 类内容会被 harness 安全过滤拦(返回只回结构化布尔/长度,别回原文)
- PowerShell 打包别用 `Remove-Item 通配符`(被拦),用 Compress-Archive -Force
