// node build.js brief|full <out.pptx>
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const fa = require("react-icons/fa6");
const sharp = require("sharp");
const { M } = require("./content.js");
const { applyTheme } = require("/root/.claude/skills/synced/cdec9fa1-e952-4345-b773-645b32fed51a_d89cec47-7171-4808-b535-84c2b1004644/pptx/scripts/apply_theme.js");

const VARIANT = process.argv[2];
const OUT = process.argv[3];
const FULL = VARIANT === "full";

const THEME = {
  name: "ThinkNova AI Course",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1C1D3A", lt1: "FFFFFF", dk2: "4A4E73", lt2: "F1F0FA",
    accent1: "FF6A3D", accent2: "5048E5", accent3: "12A594", accent4: "F2B33D",
    accent5: "B9B6E8", accent6: "E5484D", hlink: "5048E5", folHlink: "8A84E8",
  },
};
const HEX = THEME.colors;

// ── 课表 ──
const AGENDA = {
  brief: [
    ["09:30", "AI 是怎么工作的", "无记忆的「接话高手」· 工具调用 · Agent"],
    ["10:30", "必懂的 AI 核心概念", "Skill · Harness · MCP · RAG · Memory · Hooks"],
    ["11:45", "午休", ""],
    ["13:00", "Claude Code 与 Codex 上手", "两个 AI 助手怎么用、怎么选 + 现场演示"],
    ["14:30", "让 AI 守规矩 · 搭工作流", "规则四层力度 · 记忆铁律 · 七步法"],
    ["15:30", "实战：AI 视频生成", "AI 漫剧生产线 · ThinkNova 视频 Agent"],
    ["16:30", "GitHub 与总结", "让 AI 的记忆永不丢失 · 结业"],
  ],
  full: [
    ["第 1 天", [
      ["09:30", "AI 是怎么工作的"],
      ["11:00", "核心概念（上）"],
      ["13:30", "核心概念（下）"],
      ["14:45", "Claude Code 上手"],
      ["16:15", "实操 1：AI 员工手册"],
    ]],
    ["第 2 天", [
      ["09:30", "Codex 与对比"],
      ["10:45", "让 AI 守规矩"],
      ["13:00", "搭建 AI 工作流"],
      ["14:15", "实战：AI 视频生成"],
      ["16:00", "GitHub · 总结结业"],
    ]],
  ],
};
const SECTION_TIME = {
  brief: { m1: "09:30", m2: "10:30", m3: "13:00", m5: "14:30", m6: "15:00", m7: "15:30", m8: "16:30", end: "16:45" },
  full: { m1: "第 1 天 · 09:30", m2: "第 1 天 · 11:00", m3: "第 1 天 · 14:45", m4: "第 2 天 · 09:30", m5: "第 2 天 · 10:45", m6: "第 2 天 · 13:00", m7: "第 2 天 · 14:15", m8: "第 2 天 · 16:00", end: "第 2 天 · 16:30" },
};
const SECTION_OVERRIDE = { brief: { m3: { title: "Claude Code 与 Codex 上手", sub: "两个会自己动手的 AI 同事" }, m4: null } };

// ── 图标 ──
const iconCache = {};
async function icon(name, color = "FFFFFF") {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  let Comp = fa[name];
  if (!Comp) { console.warn("missing icon", name); Comp = fa.FaCircle; }
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = FULL ? "AI 实战课（2 天完整版）" : "AI 实战课（1 天精华版）";
  pres.author = "ThinkNova";
  pres.company = "ThinkNova";
  const C = pres.SchemeColor;

  // ── 版式 ──
  const footer = [
    { text: { text: "AI 实战课 · ThinkNova", options: { x: 0.5, y: 5.22, w: 5, h: 0.28, fontSize: 9, color: C.text2, margin: 0 } } },
  ];
  pres.defineSlideMaster({
    title: "TN_CONTENT", background: { color: C.background1 },
    objects: [
      ...footer,
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 9, h: 0.62, fontSize: 24, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 8.9, y: 5.2, w: 0.6, h: 0.3, fontSize: 9, color: C.text2, align: "right" },
  });
  pres.defineSlideMaster({
    title: "TN_COVER", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.35, w: 6.4, h: 1.2, fontSize: 40, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 2.7, w: 6.4, h: 0.6, fontSize: 18, color: C.accent5, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "TN_SECTION", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.05, w: 8.8, h: 0.9, fontSize: 34, bold: true, color: C.background1, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 16, color: C.accent5, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 8.9, y: 5.2, w: 0.6, h: 0.3, fontSize: 9, color: C.accent5, align: "right" },
  });
  pres.defineSlideMaster({
    title: "TN_STATEMENT", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.0, w: 8.4, h: 2.3, fontSize: 34, bold: true, color: C.background1, align: "center", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 1.0, y: 3.55, w: 8.0, h: 1.1, fontSize: 16, color: C.accent5, align: "center", valign: "top", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 8.9, y: 5.2, w: 0.6, h: 0.3, fontSize: 9, color: C.accent5, align: "right" },
  });

  // ── 小部件 ──
  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, color: C.text1, fontSize: 14, valign: "top" }, o));
  const card = (s, x, y, w, h, fill = C.background2, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });
  async function badge(s, x, y, d, iconName, fill = C.accent2) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
    const p = d * 0.25;
    s.addImage({ data: await icon(iconName), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  }
  function numDot(s, x, y, d, n, fill = C.accent1, fs = 14) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
    T(s, String(n), { x, y, w: d, h: d, fontSize: fs, bold: true, color: C.background1, align: "center", valign: "middle" });
  }
  function arrow(s, x1, y1, x2, y2, color = HEX.accent5, width = 1.75) {
    const o = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color, width, endArrowType: "triangle" } };
    if (y2 < y1) o.flipV = true;
    if (x2 < x1) o.flipH = true;
    s.addShape(pres.shapes.LINE, o);
  }
  function seg(s, x1, y1, x2, y2, color = HEX.accent5, width = 1.75) {
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color, width } });
  }
  const bullets = (items, fs = 15, color = C.text1) => items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, fontSize: fs, color, paraSpaceAfter: 6 } }));

  // ── 页面类型 ──
  const R = {};
  R.cover = async (s) => {
    s.addText("AI 实战课", { placeholder: "title" });
    s.addText("Claude Code × Codex × AI 视频生成", { placeholder: "body" });
    T(s, FULL ? "2 天完整版" : "1 天精华版", { x: 0.6, y: 3.5, w: 2.2, h: 0.42, fontSize: 14, bold: true, color: C.text1, fill: { color: C.accent1 }, align: "center", valign: "middle" });
    T(s, "主办 · ThinkNova", { x: 0.6, y: 4.6, w: 4, h: 0.35, fontSize: 13, color: C.accent5 });
    s.addShape(pres.shapes.OVAL, { x: 6.9, y: 0.7, w: 3.6, h: 3.6, fill: { color: C.accent2, transparency: 20 }, line: { color: C.accent2, width: 0 } });
    s.addShape(pres.shapes.OVAL, { x: 8.0, y: 3.0, w: 2.2, h: 2.2, fill: { color: C.accent1, transparency: 10 }, line: { color: C.accent1, width: 0 } });
    s.addImage({ data: await icon("FaWandMagicSparkles"), x: 8.0, y: 1.8, w: 1.4, h: 1.4 });
    return "封面。自我介绍 2 分钟：我们是谁（ThinkNova，做 AI 营销视频的团队），为什么讲这堂课（我们每天都在用 AI 干活，踩过很多坑）。";
  };
  R.agenda = async (s, d) => {
    s.addText(FULL ? "两天课程安排" : "今天的安排", { placeholder: "title" });
    if (!FULL) {
      const rows = AGENDA.brief, h = 0.5, y0 = 1.15;
      rows.forEach(([t, h1, h2], i) => {
        const y = y0 + i * (h + 0.06), isBreak = !h2;
        card(s, 0.5, y, 9, h, isBreak ? C.background1 : C.background2);
        T(s, t, { x: 0.7, y, w: 1.0, h, fontSize: 14, bold: true, color: isBreak ? C.text2 : C.accent2, valign: "middle" });
        T(s, h1, { x: 1.8, y, w: 3.4, h, fontSize: 15, bold: !isBreak, color: isBreak ? C.text2 : C.text1, valign: "middle" });
        if (h2) T(s, h2, { x: 5.2, y, w: 4.2, h, fontSize: 12, color: C.text2, valign: "middle" });
      });
      return "过一遍今天的安排。9:30 开始，17:00 结束，中午 75 分钟午休，下午有一次茶歇。";
    }
    for (const [di, [day, rows]] of AGENDA.full.entries()) {
      const x = 0.5 + di * 4.65, w = 4.35;
      T(s, day, { x, y: 1.1, w, h: 0.45, fontSize: 18, bold: true, color: di ? C.accent1 : C.accent2 });
      rows.forEach(([t, h1], i) => {
        const y = 1.65 + i * 0.66;
        card(s, x, y, w, 0.56);
        T(s, t, { x: x + 0.2, y, w: 0.9, h: 0.56, fontSize: 13, bold: true, color: di ? C.accent1 : C.accent2, valign: "middle" });
        T(s, h1, { x: x + 1.15, y, w: w - 1.3, h: 0.56, fontSize: 15, color: C.text1, valign: "middle" });
      });
    }
    T(s, "每天 9:30–17:00 · 午休 12:30–13:30 · 上下午各一次茶歇", { x: 0.5, y: 4.95, w: 9, h: 0.25, fontSize: 11, color: C.text2 });
    return "两天安排：第一天打基础（原理、概念、Claude Code），第二天讲方法和实战（规则、工作流、AI 视频、GitHub）。两天各有一次动手实操。";
  };
  R.section = async (s, d) => {
    T(s, d.num, { x: 0.6, y: 0.9, w: 3, h: 1.0, fontSize: 54, bold: true, color: C.accent1, valign: "bottom" });
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    if (d.time) T(s, d.time, { x: 0.6, y: 3.75, w: 2.6, h: 0.4, fontSize: 13, bold: true, color: C.background1, fill: { color: C.accent2 }, align: "center", valign: "middle" });
    return `进入第 ${Number(d.num)} 部分：${d.title}。${d.sub}。`;
  };
  R.statement = async (s, d) => {
    s.addText(d.big, { placeholder: "title" });
    s.addText(d.small, { placeholder: "body" });
  };
  R.concept = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    T(s, d.term, { x: 0.5, y: 1.12, w: 4.8, h: 0.45, fontSize: 18, bold: true, color: C.accent2 });
    T(s, d.def, { x: 0.5, y: 1.65, w: 4.75, h: 1.25, fontSize: 15 });
    T(s, "大白话", { x: 0.5, y: 3.0, w: 1.2, h: 0.3, fontSize: 12, bold: true, color: C.accent1 });
    T(s, d.plain, { x: 0.5, y: 3.32, w: 4.75, h: 1.4, fontSize: 14, color: C.text2 });
    card(s, 5.55, 1.1, 3.95, 3.9);
    await badge(s, 5.8, 1.3, 0.6, d.icon, C.accent1);
    T(s, "打个比方", { x: 6.55, y: 1.3, w: 2.7, h: 0.6, fontSize: 15, bold: true, valign: "middle" });
    T(s, d.analogy, { x: 5.8, y: 2.05, w: 3.45, h: 1.3, fontSize: 14 });
    T(s, "例子", { x: 5.8, y: 3.4, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.accent2 });
    T(s, d.example, { x: 5.8, y: 3.7, w: 3.45, h: 1.2, fontSize: 12, color: C.text2 });
  };
  R.cards = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, gap = 0.3, w = (9 - gap * (n - 1)) / n;
    for (const [i, it] of d.items.entries()) {
      const x = 0.5 + i * (w + gap), y = 1.35;
      card(s, x, y, w, 3.0);
      await badge(s, x + 0.3, y + 0.3, 0.7, it.icon, i % 2 ? C.accent1 : C.accent2);
      T(s, it.h, { x: x + 0.3, y: y + 1.2, w: w - 0.6, h: 0.75, fontSize: 17, bold: true, valign: "top" });
      T(s, it.t, { x: x + 0.3, y: y + 1.95, w: w - 0.6, h: 0.95, fontSize: 14, color: C.text2 });
    }
  };
  R.grid = async (s, d) => {
    if (d.items.length <= 3) return R.cards(s, d);
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, cols = n <= 3 ? n : n === 4 ? 2 : 3, rows = Math.ceil(n / cols);
    const gap = 0.25, w = (9 - gap * (cols - 1)) / cols, top = 1.15, H = 3.85, h = (H - gap * (rows - 1)) / rows;
    for (const [i, it] of d.items.entries()) {
      const x = 0.5 + (i % cols) * (w + gap), y = top + Math.floor(i / cols) * (h + gap);
      card(s, x, y, w, h);
      await badge(s, x + 0.2, y + 0.22, 0.52, it.icon, i % 2 ? C.accent1 : C.accent2);
      T(s, it.h, { x: x + 0.88, y: y + 0.22, w: w - 1.05, h: 0.52, fontSize: 15, bold: true, valign: "middle" });
      T(s, it.t, { x: x + 0.88, y: y + 0.8, w: w - 1.05, h: h - 0.95, fontSize: 13, color: C.text2 });
    }
  };
  R.compare = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    for (const [i, side] of [d.left, d.right].entries()) {
      const x = 0.5 + i * 4.65, w = 4.35, fill = i ? C.accent1 : C.accent2;
      card(s, x, 1.2, w, 3.8);
      await badge(s, x + 0.3, 1.45, 0.62, side.icon, fill);
      T(s, side.h, { x: x + 1.1, y: 1.45, w: w - 1.3, h: 0.62, fontSize: 17, bold: true, color: fill, valign: "middle" });
      s.addText(bullets(side.items, 15), { isTextBox: true, x: x + 0.3, y: 2.35, w: w - 0.6, h: 2.5, valign: "top", margin: 0 });
    }
  };
  R.flow = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.steps.length, colW = 9 / n, dot = n >= 6 ? 0.5 : 0.6, cy = 1.6;
    const hs = n >= 7 ? 12 : n >= 6 ? 13 : 15, ts = n >= 6 ? 11 : 13;
    d.steps.forEach((st, i) => {
      const cx = 0.5 + i * colW + colW / 2;
      if (i < n - 1) arrow(s, cx + dot / 2 + 0.08, cy + dot / 2, cx + colW - dot / 2 - 0.08, cy + dot / 2);
      numDot(s, cx - dot / 2, cy, dot, i + 1, i === n - 1 ? C.accent1 : C.accent2, n >= 6 ? 13 : 15);
      T(s, st.h, { x: cx - colW / 2 + 0.05, y: cy + dot + 0.2, w: colW - 0.1, h: 0.5, fontSize: hs, bold: true, align: "center" });
      T(s, st.t, { x: cx - colW / 2 + 0.08, y: cy + dot + 0.72, w: colW - 0.16, h: 1.15, fontSize: ts, color: C.text2, align: "center" });
    });
    if (d.caption) {
      card(s, 0.5, 4.15, 9, 0.8);
      T(s, d.caption, { x: 0.75, y: 4.15, w: 8.5, h: 0.8, fontSize: 13, color: C.text1, valign: "middle" });
    }
  };
  R.pipeline = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.steps.length, gap = 0.35, w = (9 - gap * (n - 1)) / n, y = 1.2, h = 2.55;
    for (const [i, st] of d.steps.entries()) {
      const x = 0.5 + i * (w + gap);
      card(s, x, y, w, h);
      await badge(s, x + w / 2 - 0.35, y + 0.25, 0.7, st.icon, i === n - 1 ? C.accent1 : C.accent2);
      T(s, st.h, { x: x + 0.1, y: y + 1.1, w: w - 0.2, h: 0.45, fontSize: 15, bold: true, align: "center" });
      T(s, st.t, { x: x + 0.15, y: y + 1.6, w: w - 0.3, h: 0.9, fontSize: 12, color: C.text2, align: "center" });
      if (i < n - 1) arrow(s, x + w + 0.04, y + h / 2, x + w + gap - 0.04, y + h / 2, HEX.accent2, 2);
    }
    if (d.caption) {
      card(s, 0.5, 4.05, 9, 0.85, C.text1);
      T(s, d.caption, { x: 0.75, y: 4.05, w: 8.5, h: 0.85, fontSize: 14, bold: true, color: C.background1, valign: "middle" });
    }
  };
  R.loop = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const y = 1.85, h = 0.95;
    const nodes = [
      { x: 0.5, w: 1.9, t: "你给一个目标", f: C.background2, c: C.text1 },
      { x: 2.9, w: 2.0, t: "AI 想：下一步做什么", f: C.accent2, c: C.background1 },
      { x: 5.4, w: 2.0, t: "系统执行工具", f: C.background2, c: C.text1 },
      { x: 7.9, w: 1.6, t: "AI 看结果", f: C.accent2, c: C.background1 },
    ];
    nodes.forEach((nd, i) => {
      card(s, nd.x, y, nd.w, h, nd.f);
      T(s, nd.t, { x: nd.x + 0.1, y, w: nd.w - 0.2, h, fontSize: 14, bold: true, color: nd.c, align: "center", valign: "middle" });
      if (i < 3) arrow(s, nd.x + nd.w + 0.05, y + h / 2, nodes[i + 1].x - 0.05, y + h / 2, HEX.dk2, 2);
    });
    // 回环：看结果 → 想下一步
    seg(s, 8.7, y, 8.7, 1.35, HEX.accent1, 2);
    seg(s, 3.9, 1.35, 8.7, 1.35, HEX.accent1, 2);
    arrow(s, 3.9, 1.35, 3.9, y - 0.02, HEX.accent1, 2);
    T(s, "没完成？再来一轮", { x: 5.0, y: 1.05, w: 2.6, h: 0.28, fontSize: 12, bold: true, color: C.accent1, align: "center" });
    // 完成分支
    arrow(s, 3.9, y + h + 0.02, 3.9, 3.45, HEX.dk2, 2);
    card(s, 2.9, 3.45, 2.0, 0.75, C.accent1);
    T(s, "完成 → 向你汇报", { x: 2.9, y: 3.45, w: 2.0, h: 0.75, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle" });
    T(s, "关键：用哪个工具、用几次、什么时候停——都由 AI 自己决定", { x: 5.4, y: 3.45, w: 4.1, h: 0.75, fontSize: 14, color: C.text2, valign: "middle" });
  };
  R.layers = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.layers.length, gap = 0.12, top = 1.15, H = 3.85, h = Math.min(0.85, (H - gap * (n - 1)) / n);
    d.layers.forEach((L, i) => {
      const y = top + i * (h + gap);
      card(s, 0.5, y, 9, h);
      card(s, 0.5, y, 2.6, h, i === n - 1 && n > 4 ? C.text1 : C.accent2);
      T(s, L.name, { x: 0.65, y, w: 2.3, h, fontSize: 15, bold: true, color: C.background1, valign: "middle" });
      T(s, L.desc, { x: 3.35, y, w: 6.0, h, fontSize: 14, color: C.text1, valign: "middle" });
    });
  };
  R.table = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const head = d.head.map((t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 }, fontSize: 13 } }));
    const body = d.rows.map((r, ri) => r.map((t, ci) => ({ text: t, options: { fontSize: 13, color: C.text1, bold: ci === 0, fill: { color: ri % 2 ? C.background1 : C.background2 } } })));
    const rowH = Math.min(0.48, 3.85 / (d.rows.length + 1));
    s.addTable([head, ...body], { x: 0.5, y: 1.15, w: 9, colW: d.widths, rowH, valign: "middle", border: { type: "solid", pt: 0.75, color: HEX.accent5 }, margin: [0.04, 0.1, 0.04, 0.1], fontFace: THEME.bodyFontFace });
  };
  R.checklist = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, cols = n > 6 ? 2 : 1, per = Math.ceil(n / cols), w = cols === 2 ? 4.35 : 9;
    const rowH = Math.min(0.68, 3.85 / per);
    for (const [i, t] of d.items.entries()) {
      const c = Math.floor(i / per), r = i % per, x = 0.5 + c * 4.65, y = 1.15 + r * rowH;
      card(s, x, y, w, rowH - 0.1);
      await badge(s, x + 0.15, y + (rowH - 0.1 - 0.36) / 2, 0.36, "FaCheck", C.accent3);
      T(s, t, { x: x + 0.65, y, w: w - 0.8, h: rowH - 0.1, fontSize: cols === 2 ? 14 : 16, valign: "middle" });
    }
  };
  R.exercise = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    card(s, 0.5, 1.15, 2.5, 3.85, C.accent2);
    s.addImage({ data: await icon("FaChalkboardUser"), x: 0.8, y: 1.45, w: 0.8, h: 0.8 });
    T(s, "课堂实操", { x: 0.8, y: 2.5, w: 2.0, h: 0.5, fontSize: 20, bold: true, color: C.background1 });
    T(s, d.time, { x: 0.8, y: 3.05, w: 2.0, h: 0.4, fontSize: 15, color: C.background1 });
    const n = d.steps.length, rowH = Math.min(0.75, 3.85 / n);
    d.steps.forEach((t, i) => {
      const y = 1.15 + i * rowH;
      numDot(s, 3.3, y + (rowH - 0.45) / 2, 0.45, i + 1, C.accent1, 14);
      T(s, t, { x: 3.95, y, w: 5.55, h: rowH, fontSize: 15, valign: "middle" });
    });
  };
  R.promo = async (s) => {
    s.addText("ThinkNova：给小生意做营销视频和海报", { placeholder: "title" });
    const who = ["实体店老板", "网店卖家", "靠服务赚钱的人"];
    who.forEach((w, i) => T(s, w, { x: 0.5 + i * 1.9, y: 1.12, w: 1.75, h: 0.4, fontSize: 13, bold: true, color: C.accent2, fill: { color: C.background2 }, align: "center", valign: "middle" }));
    card(s, 0.5, 1.75, 4.4, 3.25, C.text1);
    T(s, "写几句话\n或传一张产品图", { x: 0.8, y: 2.0, w: 3.9, h: 1.2, fontSize: 24, bold: true, color: C.background1 });
    T(s, "15 秒营销视频 / 海报\n自动生成", { x: 0.8, y: 3.3, w: 3.9, h: 1.0, fontSize: 18, bold: true, color: C.accent1 });
    const feats = [
      ["FaVideo", "不用拍，不用剪"], ["FaStore", "卖什么都能用"],
      ["FaGraduationCap", "有新手引导和教程"], ["FaGift", "注册送体验积分"],
    ];
    for (const [i, [ic, t]] of feats.entries()) {
      const x = 5.2 + (i % 2) * 2.2, y = 1.75 + Math.floor(i / 2) * 1.67;
      card(s, x, y, 2.05, 1.5);
      await badge(s, x + 0.2, y + 0.2, 0.55, ic, i % 2 ? C.accent1 : C.accent2);
      T(s, t, { x: x + 0.2, y: y + 0.85, w: 1.75, h: 0.55, fontSize: 14, bold: true });
    }
  };
  R.cta = async (s) => {
    s.addText("现在就试试", { placeholder: "title" });
    T(s, "thinknova.top", { x: 0.5, y: 1.15, w: 9, h: 0.8, fontSize: 36, bold: true, color: C.accent1, align: "center", valign: "middle" });
    const steps = [["FaUserPlus", "打开官网，免费注册"], ["FaHandPointer", "选一个场景"], ["FaWandMagicSparkles", "写几句话或传图，点生成"]];
    for (const [i, [ic, t]] of steps.entries()) {
      const x = 0.5 + i * 3.1, y = 2.3;
      card(s, x, y, 2.8, 2.3);
      await badge(s, x + 1.05, y + 0.3, 0.7, ic, i === 2 ? C.accent1 : C.accent2);
      T(s, `第 ${i + 1} 步`, { x, y: y + 1.15, w: 2.8, h: 0.35, fontSize: 12, bold: true, color: C.accent2, align: "center" });
      T(s, t, { x: x + 0.15, y: y + 1.5, w: 2.5, h: 0.7, fontSize: 15, bold: true, align: "center" });
      if (i < 2) arrow(s, x + 2.84, y + 1.15, x + 3.06, y + 1.15, HEX.accent2, 2);
    }
    T(s, "积分与活动以官网当天为准 · AI 生成内容请按平台规则标注", { x: 0.5, y: 4.8, w: 9, h: 0.3, fontSize: 10, color: C.text2, align: "center" });
  };
  R.closing = async (s) => {
    s.addText("谢谢！\n答疑时间", { placeholder: "title" });
    s.addText("thinknova.top", { placeholder: "body" });
    return "答疑。";
  };

  // ── 组装 ──
  let secNo = 0;
  for (const mod of M) {
    const slides = mod.slides.filter((sl) => FULL || sl.b);
    let sec = mod.section;
    const ov = SECTION_OVERRIDE[VARIANT] && SECTION_OVERRIDE[VARIANT][mod.id];
    if (ov === null) sec = null; else if (ov) sec = Object.assign({}, sec, ov);
    const secTitle = sec ? sec.title : mod.id === "open" ? "开场" : "Claude Code 与 Codex 上手";
    pres.addSection({ title: secTitle });
    if (sec) {
      secNo++;
      const s = pres.addSlide({ masterName: "TN_SECTION", sectionTitle: secTitle });
      const note = await R.section(s, { num: String(secNo).padStart(2, "0"), title: sec.title, sub: sec.sub, time: SECTION_TIME[VARIANT][mod.id] });
      s.addNotes(note);
    }
    for (const sl of slides) {
      const master = { cover: "TN_COVER", statement: "TN_STATEMENT", cta: "TN_CONTENT", closing: "TN_STATEMENT" }[sl.type] || "TN_CONTENT";
      const s = pres.addSlide({ masterName: master, sectionTitle: secTitle });
      if (!R[sl.type]) throw new Error("no renderer " + sl.type);
      const auto = await R[sl.type](s, sl);
      s.addNotes(sl.n || auto || "");
    }
  }
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
