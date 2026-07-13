---
name: project_sg_footwear_proposal
description: "新加坡鞋包自营品牌的客户提案(报价单+功能设计),桌面 HTML→PDF 双语交付"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5c696ffe-3c4e-4234-8a39-8e2e7688a3f6
---

给"新加坡鞋包自营品牌"的客户提案，两套 HTML 文档在桌面，中英文各一份 + 对应 PDF：
- 报价单：`Desktop/quotation (1)/` → quotation.html(中) / quotation-en.html(英) / 各自 .pdf；饼图由 assets/quotation-chart.js(中) 和 quotation-chart-en.js(英) 驱动(ECharts，数据数组硬编码 + 图例百分比硬编码，改金额要两处都改)。旧 `报价单.pdf` 是过时原版。
- 功能设计：`Desktop/function-design/` → function-design.html(中) / function-design-en.html(英) / 各自 .pdf；Mermaid 流程图。旧 `功能设计文档.pdf` 是过时原版。

**当前状态(2026-07 最新一轮)**：总价 **S$120,000**、**8 大模块**(M8=App 商城基础版 20k=商品浏览/购物车下单/优惠展示)、**7 大平台/8 渠道**(社媒含 YouTube+Lemon8 自动发布)。付款 50/50 各 6 万。序号 01–30 连续，各模块小计合计 12 万。

**HTML→PDF 方法(可复用，费了功夫定的)**：预览工具抢 3000 端口用不了，改用无头 Edge 渲染。关键：临时同目录副本注入 `@media print{*{print-color-adjust:exact}}`(否则黑底表头/总价条丢底色)+ `--virtual-time-budget=20000` 等 ECharts/Mermaid 渲染完 + A4。命令见会话历史。验证用 pypdf 抽文本查金额/序号连续/无中文泄漏/图表 xobject 存在/无 raw "flowchart" 泄漏；打印中文会撞 cp1252，改 ascii-safe。

老板要求：中英文永远同步；范围/数量类改动会串共用链路，需正反双向核对。相关铁律 [[feedback_scope_boundary_explicit]]。
