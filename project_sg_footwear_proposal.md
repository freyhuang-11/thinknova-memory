---
name: project_sg_footwear_proposal
description: "触发:要改新加坡鞋包提案的报价单/功能设计之前 → 文件位置与双语交付口径;改金额要同时改 HTML 和 chart.js 两处硬编码"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5c696ffe-3c4e-4234-8a39-8e2e7688a3f6
  modified: 2026-09-11T06:13:39.330Z
---

给"新加坡鞋包自营品牌"的客户提案，两套 HTML 文档在桌面，中英文各一份 + 对应 PDF：
- 报价单：`Desktop/quotation (1)/` → quotation.html(中) / quotation-en.html(英) / 各自 .pdf；饼图由 assets/quotation-chart.js(中) 和 quotation-chart-en.js(英) 驱动(ECharts，数据数组硬编码 + 图例百分比硬编码，改金额要两处都改)。旧 `报价单.pdf` 是过时原版。
- 功能设计：`Desktop/function-design/` → function-design.html(中) / function-design-en.html(英) / 各自 .pdf；Mermaid 流程图。旧 `功能设计文档.pdf` 是过时原版。

**🔴 当前状态(2026-09-09 大转向,推翻之前 12 万/8 模块版)**：重定位为**纯 AI 营销**——AI 生成海报+视频→自动发布 7 平台→引流官网。**7 大模块**(M1 商品与素材接入=轻量:上传/官网抓取/可选API,不建数据中台 / M2 AI内容生成引擎[核心] / M3 多平台自动发布+官网引流 / M4 内容管理与排期 / M5 AI用量与费用看板 / M6 部署上线+首年维护 / M7 项目管理与培训)。**App 商城、ERP/CRM、数据中台、数据分析归因 全部砍掉**。序号 01–29,各模块小计合计 7 万。
- **两笔钱分开**:系统建设费 **S$70,000**(一次性,含首年维护) vs AI 生成费(按量预充值,客户用多少扣多少)。付款 50/50 各 3.5 万。
- **🔴🔴 价格进不同文档**:**功能设计文档=零价格**(第9节只讲计费"机制":两类费用分开/预充值/用量看板/三条保障,写「具体价格商务另议」,无 0.5/0.2 无月度表);**报价单=有 70k 建设费+模块拆分,但 AI 单价(视频≈0.5/海报≈0.2)不写**,注「按量预充值、单价商务另议」。老板要单独跟客户谈价。
- 四份文件+PDF 已全部切到此版并核对(0 ERP/CRM、0 App、报价单无 0.5/0.2、饼图7块渲染OK)。12 万旧版备份在本会话 scratchpad `backup_120k_*`。

**🔴 报价单标准格式(2026-09-11 老板拍板「以后 quotation 就这个格式」,所有新报价单套用)**：
- ①**我方抬头**(doc-head 右上,固定不变)：JIMENG NETWORK TECHNOLOGY PTE. LTD. / UEN 202451052R / 114 Lavender Street #12-78 CT Hub 2 S338729
- ②**致/To 客户块**(info-grid 第一格,逐单改)：客户公司全名 / UEN / Attn: 对方 director (职务)
- ③**文末「确认与签收 / Acceptance & Acknowledgement」双栏签字区**：左=报价方授权签字(姓名/职务/盖章/日期空白)，右=客户确认签收(预填对方 director 姓名+职务,留签字/公司盖章/日期)
- 中英两份都要;功能设计文档不放价格、不放签字。
- 本单客户值：FABULOUS GENERAL TRADING AND CONSULTANT PTE. LTD. / UEN 202120103R / Cheng Choon Lee (Director)。⚠️客户已从「新加坡鞋包自营品牌」变 FABULOUS，但功能设计封面/页脚仍写鞋包品牌——待老板定要不要改(已问,老板未答)。

**🔴 HTML→PDF 方法(可复用)**：**用 Chrome 不用 Edge**——`C:\Users\samso\AppData\Local\Google\Chrome\Application\chrome.exe`。原因:老板 Edge 浏览器开着时,`msedge --headless` 会被打包应用转发给运行中的实例、静默 exit 0 不出文件(Edge 是 packaged app)。Chrome 是独立 binary、老板没开→干净。命令:`chrome --headless=new --disable-gpu --no-sandbox --user-data-dir=<scratchpad临时> --virtual-time-budget=20000 --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf=<输出> file:///<url,空格转%20>`；同目录临时副本注入 `@media print{*{print-color-adjust:exact}}`(否则黑底丢色)+ A4。输出先写 scratchpad 再 cp 到「quotation (1)」(路径带空格括号)。验证用 pypdf 抽文本(cp1252 撞中文→ascii-safe)查金额/序号连续/图表 xobject 存在/无 raw flowchart。

老板要求：中英文永远同步；范围/数量类改动会串共用链路，需正反双向核对。相关铁律 [[feedback_scope_boundary_explicit]]。
