---
name: project_compass_scoring
description: Compass 出单潜力分算法维度 + 合作档位阈值（用户拍板）
metadata: 
  node_type: memory
  type: project
  originSessionId: f77ccc33-3abf-4e50-8c37-80ff31be3331
---

KOL Compass「出单潜力分」(0–100) = 加权，缺数据项剔除、权重摊回其余：
- 出单能力 35%(TikTok 历史 GMV) · 类目契合 25%(达人内容/类目 vs 店铺商品) · 内容触达 20%(粉丝+视频均播) · 建联效率 20%(回复率)
- 有数据才计：带货经验 18%(近期挂商品视频数，扩展采集) · 历史履约 15%(自有合作回流)

**合作档位（用户 2026-06-29 拍板）**：≥65 建议建联(绿) / 40–64 可考虑(蓝) / <40 谨慎(灰)。统一在 app.js `scoreTier()`。客户侧透明化：达人库表头 + 详情评估卡有 ? 问号点开 `openScoreHelp()` 说明。

注意：契合分在「内容实证不发店铺品类」时直接压到 12（与扩展弹窗红灯口径一致）。指标以 TikTok API 为准，老库指标是估算（合并时被覆盖）→ 这是 annayeo44 分数从 78 降到 65 的原因，不是 bug。详见 [[project_compass_data_pitfalls]]。
