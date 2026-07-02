---
name: project_compass_data_pitfalls
description: Compass 达人库已知数据坑：老库 username/nickname 写反、大小写重复、头像按 username
metadata: 
  node_type: memory
  type: reference
  originSessionId: f77ccc33-3abf-4e50-8c37-80ff31be3331
---

KOL Compass 平台达人库（`.data/platform-creators.json`）已修的数据坑，再导老库/排查重复时注意：

- **老库 username/nickname 写反**：老库导入里有约 35 条把"人名"存进 username、真 TikTok handle 存进 nickname（如 username=AnnaYoYoYo / nickname=annayeo44）。后果=TikTok 链接 404、头像裂、和平台行不合并成重复。已用「legacy.nickname 命中某平台行 username」做交叉合并（前端 `dedupeStateCreators` 第二遍 + 后端一次性脚本，备份 `.bak-swapfix`）。**再导老库前先校验 username 是否 handle（只含 a-z0-9._）。**
- **去重大小写敏感**：`platformCreatorKeys` 用 `u:<username.toLowerCase()>`，已修。
- **头像按 username 不按 id**：前端达人 id 是重排序号，`/api/avatar?cid=` 必须传 username（大小写不敏感），否则全裂。
- **达人库列表数字=当前店铺市场**（不是全库）：新加坡约 2189 / 越南 425 / 全库约 2575。切店铺会变，不是丢数据。

相关：[[project_compass_scoring]] [[reference_compass_paths]]
