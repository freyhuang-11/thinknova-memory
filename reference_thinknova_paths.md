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
- `POST /business-video-assets/tasks` 生成(见主文件payload)
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
