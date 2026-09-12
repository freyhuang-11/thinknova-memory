---
name: reference-thinknova-home-inspiration-library
description: 商家端「灵感创作·一键做同款」与官网首页案例的真实机制（资产发布到首页 + 审核 + 标签 + 原提示词）、后台接口、现状数字与填充计划入口——做首页/灵感库/案例填充前必读（2026-09-13 实测）。
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-12T17:58:40.834Z
---

# 灵感库 = 发布到首页的资产（2026-09-13 实测）

- **商家端**：`GET /api/v1/assets/home?page&page_size` → 条目字段 `asset_no / asset_type / capability_code / model_code / task_prompt / inspiration_tags / published_to_home / home_publish_status`。「一键做同款」= 把 `task_prompt` 塞回生成框，**所以提示词是我们放进去的**。官网首页「发现/人像/插画/场景」同源，按 `inspiration_tags` 分栏。
- **后台**：`GET /admin/api/v1/home-assets?home_publish_status=pending|approved&page&page_size`（列表含 `user_email`、`task_no`、`task_prompt`、审核时间/备注）；来源列有「后台上传」= 后台可直接传成片。审核/编辑/上传的写接口未探（写操作被权限分类器拦，老板手点）。
- **现状 09-13**：65 条，视频 17 / 图片 43+；10 条无提示词；标签只有「跳舞」；23 条来自测试账号 `inspect_…@example.com`（建议下架）。
- **计划**：`03_工作台\灵感库与首页案例填充计划_2026-09-13.md`（两周、每天烧 8 条、一次一条、每条=提示词验证）；48 条案例草案 `02_交付内容\直连页灵感案例库_v1_2026-09-13.md/.json`（16 行业×3，v2 四段式）。
- 老板口径：**不限实体店**，16 行业全覆盖；视频为主、要有吸引力；自己资产库里好的 + 看到好的重生成，都进去。
- ⛔ 直连页 = 无编剧层、无画布；要让客户拿到想要的内容只能靠案例数量 + 提示词质量。

关联：[[reference-competitor-quantv-playbook]] [[feedback-case-name-matches-output]] [[project-thinknova-film-types]]
