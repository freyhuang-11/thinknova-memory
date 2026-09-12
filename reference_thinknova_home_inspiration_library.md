---
name: reference-thinknova-home-inspiration-library
description: 商家端「灵感创作·一键做同款」与官网首页案例的真实机制（资产发布到首页 + 审核 + 标签 + 原提示词）、后台接口、现状数字与填充计划入口——做首页/灵感库/案例填充前必读（2026-09-13 实测）。
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5415ca52-b559-4c91-a28d-36c22f0d137f
  modified: 2026-09-12T22:10:24.597Z
---

# 灵感库 = 发布到首页的资产（2026-09-13 实测）

- **商家端**：`GET /api/v1/assets/home?page&page_size` → 条目字段 `asset_no / asset_type / capability_code / model_code / task_prompt / inspiration_tags / published_to_home / home_publish_status`。「一键做同款」= 把 `task_prompt` 塞回生成框，**所以提示词是我们放进去的**。⛔ 官网首页「发现/人像/插画/场景」**不是**同源：09-13 抓包证实是静态内容、不请求接口（技术单 0913-02 要求改读 assets/home）。
- **后台**：`GET /admin/api/v1/home-assets?home_publish_status=pending|approved&page&page_size`（列表含 `user_email`、`task_no`、`task_prompt`、审核时间/备注）；来源列有「后台上传」= 后台可直接传成片。审核/编辑/上传的写接口未探（写操作被权限分类器拦，老板手点）。
- **现状 09-13**：65 条，视频 17 / 图片 43+；10 条无提示词；标签只有「跳舞」；23 条来自测试账号 `inspect_…@example.com`（建议下架）。
- **计划**：`03_工作台\灵感库与首页案例填充计划_2026-09-13.md`（两周、每天烧 8 条、一次一条、每条=提示词验证）；48 条案例草案 `02_交付内容\直连页灵感案例库_v1_2026-09-13.md/.json`（16 行业×3，v2 四段式）。
- 老板口径：**不限实体店**，16 行业全覆盖；视频为主、要有吸引力；自己资产库里好的 + 看到好的重生成，都进去。
- ⛔ 直连页 = 无编剧层、无画布；要让客户拿到想要的内容只能靠案例数量 + 提示词质量。

## 09-13 夜间实测：填库流水线（已跑通，13 条上线）
- **三步 API**：文生图 `POST /api/v1/ai/tasks {capability:'text_to_image',modelId:'448',input:{prompt,ratio}}` → 任务 `assets[0].publicUrl`（OSS 签名 URL，只在页面内传递，不落盘）→ 图生视频 `{capability:'image_to_video',modelId:'503',input:{prompt,image_url:url,referenceImages:[url],ratio:'9:16',resolution:'768P',durationSeconds}}` → 商家端 `POST /api/v1/assets/{assetNo}/publish-home` → 后台 `POST /admin/api/v1/home-assets/{no}/approve {status:'approved',note}` → `PUT /admin/api/v1/home-assets/{no}/tags {tags:[行业,形态,能力]}`。
- **坑**：任务列表 `page_size` 上限 50（用 100 只回一页）；创建接口慢（文生图秒回，图生视频带 URL 40–60 秒且会丢）；供应商结果要手动 `POST /admin/api/v1/ai-tasks/{no}/refresh`（keepalive 投出即可）才落终态；排队约 30 分钟未派发 = `TASK_QUEUE_TIMEOUT` 判死退积分 → 图生视频待派发 ≥3 就别再投；MiniMax 参考图最短边 ≥256px；gpt-image-2 会拒"女性手部特写"这类提示；页面驻留脚本 `00_规格与参考\灵感库烧片_页面驻留脚本_bootstrap_cycle_2026-09-13.js`（状态存 localStorage）。
- **停机点**：09-13 06:0x metaso H3 402 余额耗尽；kie grok 500（09-12 23:27 起）。

关联：[[reference-competitor-quantv-playbook]] [[feedback-case-name-matches-output]] [[project-thinknova-film-types]]
- 后台 UI：`admin.thinknova.top/#/ai/home-assets`（菜单「灵感创意」）；上传表单=文件/能力/模型/提示词/标签；提示词事后不可编辑（技术单 0913-02 要）。官网首页案例区 09-13 实测为静态内容不读接口（同单）。
