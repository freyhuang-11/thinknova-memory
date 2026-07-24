---
name: reference-thinknova-publish-schemes
description: "ThinkNova 扫码发布配置——各平台深链 scheme 现行值(2026-07-24 真机实测到上传页);位置+机制+每条状态"
metadata:
  node_type: memory
  type: reference
  originSessionId: current
  modified: 2026-07-24T09:09:12.974Z
---

# ThinkNova 扫码发布配置(2026-07-24 落库+真机实测)

## 位置
admin 后台 → **系统配置(`#/settings/configs`)→ 「通用」标签 → 发布辅助·扫码发布配置**。一排表单:分享有效期 + 各平台 Scheme/URL。改后点「**保存发布配置**」(该按钮带 CSRF token,过 419 写保护;裸 fetch/PUT 仍 419)。**改后立即影响商家分享页**。

## 现行值(2026-07-24,reload 回读确认落库)
| 框 | 值 | 落到 | 状态 |
|---|---|---|---|
| 分享有效期(秒) | `259200`(=3天) | — | 未动 |
| 抖音 Scheme | `snssdk1128://studio/create` | 创作/上传页 | ✅ 真机实测进上传页 |
| 小红书 Scheme | `xhsdiscover://post_video_album/` | 相册选视频上传 | ✅ 真机实测(置信最高) |
| 快手 Scheme | `kwai://localalbum/`(原为空) | 本地相册 | ✅ 真机实测进上传页 |
| TikTok Scheme | `snssdk1233://studio/create` | 创作页 | ✅ 真机实测进上传页 |
| Instagram Scheme | `https://www.instagram.com/` | 开 IG app/网页 | ⏳ 待老板真机确认(IG 无 feed/reels 上传深链,只求"进 app") |
| YouTube | `https://www.youtube.com/upload` | 网页上传页 | 未动·本来就对 |
| Facebook | `https://www.facebook.com/reels/create` | reels 创建页 | 未动·本来就对 |

## 🔴 机制铁律(别再纠结)
- **URL scheme 只能把用户送到 app 的"发布/相册/创作入口",没法把下载好的视频自动带进上传框**。要"打开即已选好这条视频"必须接各平台官方分享 SDK(DouyinOpenSDK/KwaiSDK/TikTok Share/IG Sharing)=技术活,不是配置能解决(老板 07-24:技术已给该给的,别为这写技术卡)。
- **IG 最抠**:feed/reels 无公开上传 scheme;`instagram://`(无路径)在真机点不开 app;能强开 app 的是 `instagram://story-camera`(落 Story 相机)或通用链接 `https://www.instagram.com/`。老板只要"能进 IG"不要上传页。
- 这些 scheme 是社区来源、随 app 版本会变 → **改任何一条后必须真机点测**(装了对应 app 的手机),别只信文档。抖音/TikTok 国际版镜像:1128↔1233、极速版 2329。

## 沿革
- 07-16 发布功能上线(C1 P0),Facebook 已改 reels/create;07-24 老板要"都补充齐、最好到上传页",Claude 走 Chrome(老板登录会话)填了 4 平台升级值,老板真机验证 4 个全进上传页,IG 改通用链接待确认。

配套 [[reference-thinknova-paths]] [[project-thinknova-marketing]]
