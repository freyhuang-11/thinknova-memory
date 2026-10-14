// node sb_build.js <out.pptx>  —— AI 实用课（Codex）：石墨 + 荧光青柠，「软件窗口」做主视觉
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const fa = require("react-icons/fa6");
const sharp = require("sharp");
const { M } = require("./sb_content.js");
const { applyTheme } = require("/root/.claude/skills/synced/cdec9fa1-e952-4345-b773-645b32fed51a_d89cec47-7171-4808-b535-84c2b1004644/pptx/scripts/apply_theme.js");

const OUT = process.argv[2];
const THEME = {
  name: "ThinkNova Codex 实用课",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "16191F", lt1: "FFFFFF", dk2: "5B616E", lt2: "F3F4F0",
    accent1: "C8F031", accent2: "0F766E", accent3: "F26B3A", accent4: "EEF9CF",
    accent5: "A3A9B4", accent6: "262B33", hlink: "0F766E", folHlink: "5B616E",
  },
};
const X = THEME.colors;
const LINE = "E2E4DF", SOFT = "F8F9F6", WARN = "FDEBE3", TEALT = "E3F1EF";
const FONT = THEME.bodyFontFace;

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
  pres.title = "AI 实用课：用 Codex 给自己提效";
  pres.author = "ThinkNova";
  pres.company = "ThinkNova";
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "PAGE", background: { color: C.background1 },
    objects: [
      { text: { text: "AI 实用课 · ThinkNova", options: { x: 0.6, y: 5.2, w: 4, h: 0.25, fontSize: 9, color: C.accent5, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.55, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 8.9, y: 5.2, w: 0.5, h: 0.25, fontSize: 9, color: C.accent5, align: "right" },
  });
  pres.defineSlideMaster({
    title: "DARK", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.55, w: 5.4, h: 1.5, fontSize: 44, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.2, w: 5.4, h: 1.0, fontSize: 16, color: C.accent5, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 8.9, y: 5.2, w: 0.5, h: 0.25, fontSize: 9, color: C.text2, align: "right" },
  });

  // ── 小部件 ──
  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, color: C.text1, fontSize: 14, valign: "top", fontFace: FONT }, o));
  const box = (s, x, y, w, h, fill, line = fill, r = 0.08) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: r, fill: { color: fill }, line: { color: line, width: 0.75 } });
  // 主视觉：软件窗口（顶栏三个圆点 + 标题）
  function win(s, x, y, w, h, { title = "", dark = false, body } = {}) {
    const bg = dark ? X.accent6 : C.background1, bar = dark ? "1E2229" : X.lt2;
    box(s, x, y, w, h, bg, dark ? X.accent6 : LINE);
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: y + 0.34, w: w - 0.04, h: 0.01, fill: { color: dark ? "353B45" : LINE }, line: { color: dark ? "353B45" : LINE, width: 0 } });
    ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: x + 0.16 + i * 0.17, y: y + 0.12, w: 0.11, h: 0.11, fill: { color: c }, line: { color: c, width: 0 } }));
    if (title) T(s, title, { x: x + 0.75, y: y + 0.05, w: w - 0.9, h: 0.25, fontSize: 10, bold: true, color: dark ? C.accent5 : C.text2, valign: "middle" });
    return { x: x + 0.22, y: y + 0.5, w: w - 0.44, h: h - 0.65 };
  }
  // 方形编号牌：石墨底、青柠数字
  function tag(s, x, y, d, n, inv = false) {
    s.addText(String(n), { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y, w: d, h: d, fill: { color: inv ? X.accent1 : X.dk1 }, line: { color: inv ? X.accent1 : X.dk1, width: 0 },
      fontSize: d > 0.45 ? 15 : 12, bold: true, color: inv ? X.dk1 : X.accent1, align: "center", valign: "middle", margin: 0, fontFace: FONT });
  }
  async function ico(s, x, y, d, name, fill = TEALT, fg = X.accent2) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: 0.08, fill: { color: fill }, line: { color: fill, width: 0 } });
    const q = d * 0.24;
    s.addImage({ data: await icon(name, fg), x: x + q, y: y + q, w: d - 2 * q, h: d - 2 * q });
  }
  function note(s, text, y = 4.35, h = 0.62) {
    box(s, 0.6, y, 8.8, h, X.accent4, X.accent4);
    T(s, text, { x: 0.85, y, w: 8.3, h, fontSize: 14, bold: true, valign: "middle" });
  }
  const bullets = (items, fs = 14, color = C.text1) => items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, fontSize: fs, color, paraSpaceAfter: 6 } }));
  const steps = (s, list, x, y, w, H, fs = 15) => {
    const n = list.length, rh = Math.min(0.8, H / n);
    list.forEach((t, i) => {
      const yy = y + i * rh;
      tag(s, x, yy + (rh - 0.42) / 2, 0.42, i + 1, i === n - 1);
      T(s, t, { x: x + 0.62, y: yy, w: w - 0.62, h: rh, fontSize: fs, valign: "middle" });
    });
  };

  // 截图：按比例放进框里，居中
  const sizeOf = require("image-size");
  function shot(s, name, x, y, w, h, border = true) {
    const p = __dirname + "/shots/" + name + ".png";
    const { width, height } = sizeOf(require("fs").readFileSync(p));
    let iw = w, ih = (w * height) / width;
    if (ih > h) { ih = h; iw = (h * width) / height; }
    const ix = x + (w - iw) / 2, iy = y + (h - ih) / 2;
    s.addImage({ path: p, x: ix, y: iy, w: iw, h: ih });
    if (border) s.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w: iw, h: ih, fill: { color: "FFFFFF", transparency: 100 }, line: { color: LINE, width: 0.75 } });
  }

  let part = "";
  const eyebrow = (s) => part && T(s, part, { x: 0.6, y: 0.3, w: 6, h: 0.25, fontSize: 11, bold: true, color: C.accent2 });

  const R = {};
  R.cover = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    s.addText(d.tag, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x: 0.6, y: 1.0, w: 2.3, h: 0.4, fill: { color: X.accent1 }, line: { color: X.accent1, width: 0 }, fontSize: 13, bold: true, color: X.dk1, align: "center", valign: "middle", margin: 0, fontFace: FONT });
    T(s, "ThinkNova", { x: 0.6, y: 4.75, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.accent1 });
    const b = win(s, 6.3, 1.0, 3.3, 3.6, { title: "Codex", dark: true });
    box(s, b.x + 0.5, b.y + 0.05, b.w - 0.5, 0.95, "3A404B", "3A404B");
    T(s, "把这个文件夹里的发票按月份分好，再做一张汇总表", { x: b.x + 0.62, y: b.y + 0.05, w: b.w - 0.72, h: 0.95, fontSize: 11, color: C.background1, valign: "middle" });
    const done = ["读取文件夹", "按月份建好子文件夹", "生成汇总表"];
    for (const [i, t] of done.entries()) {
      const y = b.y + 1.25 + i * 0.45;
      s.addImage({ data: await icon("FaCircleCheck", X.accent1), x: b.x, y: y + 0.06, w: 0.22, h: 0.22 });
      T(s, t, { x: b.x + 0.35, y, w: b.w - 0.4, h: 0.34, fontSize: 12, color: "D7DBE0", valign: "middle" });
    }
  };
  R.divider = async (s, d) => {
    part = `${d.num}  ${d.title}`;
    T(s, d.num, { x: 0.6, y: 0.55, w: 3, h: 1.1, fontSize: 80, bold: true, color: C.accent1, valign: "bottom" });
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
  };
  R.statement = async (s, d) => {
    await ico(s, 0.6, 0.9, 0.6, "FaQuoteLeft", X.accent1, X.dk1);
    T(s, d.big, { x: 0.6, y: 1.7, w: 8.8, h: 1.8, fontSize: 34, bold: true, color: C.background1, valign: "middle" });
    T(s, d.small, { x: 0.6, y: 3.7, w: 8.8, h: 0.9, fontSize: 16, color: C.accent5 });
  };
  R.closing = async (s) => {
    s.addText("谢谢！\n答疑时间", { placeholder: "title" });
    s.addText("thinknova.top", { placeholder: "body" });
    await ico(s, 7.2, 1.6, 1.9, "FaComments", X.accent1, X.dk1);
  };
  R.flow = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.steps.length, gap = 0.32, w = (8.8 - gap * (n - 1)) / n, y = 1.5, h = d.caption ? 2.5 : 3.3;
    d.steps.forEach((st, i) => {
      const x = 0.6 + i * (w + gap), last = i === n - 1;
      box(s, x, y, w, h, last ? X.accent1 : X.lt2);
      tag(s, x + 0.2, y + 0.22, 0.42, i + 1);
      T(s, st.h, { x: x + 0.2, y: y + 0.85, w: w - 0.4, h: 0.55, fontSize: n >= 5 ? 15 : 17, bold: true });
      T(s, st.t, { x: x + 0.2, y: y + 1.42, w: w - 0.4, h: h - 1.55, fontSize: 13, color: last ? X.dk1 : C.text2 });
      if (!last) T(s, "›", { x: x + w, y: y + h / 2 - 0.3, w: gap, h: 0.6, fontSize: 26, bold: true, color: C.accent5, align: "center", valign: "middle" });
    });
    if (d.caption) note(s, d.caption);
  };
  R.cards = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, y = 1.5, h = 3.4;
    for (const [i, it] of d.items.entries()) {
      const x = 0.6 + i * (w + gap);
      box(s, x, y, w, h, C.background1, LINE);
      await ico(s, x + 0.3, y + 0.3, 0.7, it.icon);
      T(s, it.h, { x: x + 0.3, y: y + 1.2, w: w - 0.5, h: 0.6, fontSize: n >= 4 ? 15 : 17, bold: true, valign: "middle" });
      T(s, it.t, { x: x + 0.3, y: y + 1.95, w: w - 0.5, h: h - 2.1, fontSize: n >= 4 ? 13 : 14, color: C.text2 });
    }
  };
  R.grid = async (s, d) => {
    if (d.items.length <= 3) return R.cards(s, d);
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, cols = n === 4 ? 2 : n >= 7 ? 4 : 3, rows = Math.ceil(n / cols);
    const gap = 0.25, w = (8.8 - gap * (cols - 1)) / cols, top = 1.45, H = 3.55, h = (H - gap * (rows - 1)) / rows;
    for (const [i, it] of d.items.entries()) {
      const x = 0.6 + (i % cols) * (w + gap), y = top + Math.floor(i / cols) * (h + gap);
      box(s, x, y, w, h, C.background1, LINE);
      await ico(s, x + 0.2, y + 0.2, 0.5, it.icon);
      T(s, it.h, { x: x + 0.8, y: y + 0.2, w: w - 0.9, h: 0.5, fontSize: cols === 4 ? 14 : 15, bold: true, valign: "middle" });
      T(s, it.t, { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: h - 0.9, fontSize: 13, color: C.text2 });
    }
  };
  R.compare = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    for (const [i, side] of [d.left, d.right].entries()) {
      const x = 0.6 + i * 4.55, w = 4.25, y = 1.45, h = 3.55, good = i === 1;
      box(s, x, y, w, h, good ? X.accent4 : SOFT, good ? X.accent4 : LINE);
      await ico(s, x + 0.25, y + 0.25, 0.5, side.icon, good ? X.dk1 : WARN, good ? X.accent1 : X.accent3);
      T(s, side.h, { x: x + 0.9, y: y + 0.25, w: w - 1.1, h: 0.5, fontSize: 17, bold: true, valign: "middle" });
      s.addText(bullets(side.items, 14), { isTextBox: true, x: x + 0.3, y: y + 1.0, w: w - 0.6, h: h - 1.15, valign: "top", margin: 0, fontFace: FONT });
    }
  };
  R.concept = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    T(s, d.term, { x: 0.6, y: 1.4, w: 4.6, h: 0.45, fontSize: 19, bold: true, color: C.accent2 });
    T(s, d.def, { x: 0.6, y: 1.92, w: 4.6, h: 1.2, fontSize: 14 });
    s.addText("大白话", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x: 0.6, y: 3.2, w: 0.9, h: 0.3, fill: { color: X.dk1 }, line: { color: X.dk1, width: 0 }, fontSize: 11, bold: true, color: X.accent1, align: "center", valign: "middle", margin: 0, fontFace: FONT });
    T(s, d.plain, { x: 0.6, y: 3.6, w: 4.6, h: 1.35, fontSize: 14, color: C.text2 });
    box(s, 5.5, 1.4, 3.9, 3.6, X.accent4, X.accent4);
    await ico(s, 5.75, 1.62, 0.55, d.icon, X.dk1, X.accent1);
    T(s, "打个比方", { x: 6.45, y: 1.62, w: 2.7, h: 0.55, fontSize: 15, bold: true, valign: "middle" });
    T(s, d.analogy, { x: 5.75, y: 2.35, w: 3.45, h: 1.3, fontSize: 14 });
    T(s, "例子", { x: 5.75, y: 3.7, w: 2, h: 0.28, fontSize: 11, bold: true, color: C.accent2 });
    T(s, d.example, { x: 5.75, y: 3.98, w: 3.45, h: 0.95, fontSize: 13, color: C.text1 });
  };
  R.table = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const head = d.head.map((t) => ({ text: t, options: { bold: true, color: X.accent1, fill: { color: X.dk1 }, fontSize: 13 } }));
    const body = d.rows.map((r, ri) => r.map((t, ci) => ({ text: t, options: { fontSize: 13, color: X.dk1, bold: ci === 0, fill: { color: ri % 2 ? SOFT : "FFFFFF" } } })));
    const avail = d.caption ? 2.7 : d.img ? 1.9 : 3.55;
    const rowH = Math.min(d.caption ? 0.6 : 0.5, avail / (d.rows.length + 1));
    const W = d.widths.reduce((a, b) => a + b, 0), colW = d.widths.map((v) => (v * 8.8) / W);
    s.addTable([head, ...body], { x: 0.6, y: 1.45, w: 8.8, colW, rowH, valign: "middle", border: { type: "solid", pt: 0.75, color: LINE }, margin: [0.04, 0.12, 0.04, 0.12], fontFace: FONT });
    if (d.caption) note(s, d.caption);
    if (d.img) {
      const y = 1.45 + rowH * (d.rows.length + 1) + 0.3;
      shot(s, d.img, 0.6, y, 5.2, 4.95 - y);
      box(s, 6.05, y, 3.35, 4.95 - y, X.accent4, X.accent4);
      T(s, d.imgCap, { x: 6.25, y, w: 2.95, h: 4.95 - y, fontSize: 13, bold: true, valign: "middle" });
    }
  };
  R.rules = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const b = win(s, 0.6, 1.35, 6.35, 3.75, { title: "可以直接复制 · 六条沟通准则", dark: true });
    const rh = b.h / 6;
    d.rules.forEach((t, i) => {
      const y = b.y + i * rh;
      T(s, String(i + 1), { x: b.x, y, w: 0.3, h: rh, fontSize: 12, bold: true, color: C.accent1, valign: "middle" });
      T(s, t, { x: b.x + 0.35, y, w: b.w - 0.35, h: rh, fontSize: 12.5, color: "E6E9ED", valign: "middle" });
    });
    const where = d.where;
    where.forEach(([h, t], i) => {
      const y = 1.35 + i * 2.0;
      box(s, 7.15, y, 2.25, 1.75, SOFT, LINE);
      T(s, "贴到 " + h, { x: 7.3, y: y + 0.18, w: 2.0, h: 0.4, fontSize: 14, bold: true, color: C.accent2 });
      T(s, t, { x: 7.3, y: y + 0.65, w: 2.0, h: 1.0, fontSize: 12 });
    });
  };
  R.exercise = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    box(s, 0.6, 1.45, 2.5, 3.55, X.accent1, X.accent1);
    s.addImage({ data: await icon("FaLaptopCode", X.dk1), x: 0.9, y: 1.75, w: 0.85, h: 0.85 });
    T(s, "课堂实操", { x: 0.9, y: 2.85, w: 2.0, h: 0.5, fontSize: 22, bold: true });
    T(s, "打开电脑，\n跟着做一遍", { x: 0.9, y: 3.4, w: 2.0, h: 0.8, fontSize: 14 });
    steps(s, d.steps, 3.45, 1.45, 5.95, 3.55, 15);
  };
  R.shotsteps = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    steps(s, d.steps, 0.6, 1.45, 4.9, 3.55, 15);
    const b = win(s, 5.8, 1.45, 3.6, 3.55, { title: d.imgs ? "真实界面" : "截图" });
    if (d.imgs) {
      const n = d.imgs.length, gh = (b.h + 0.1 - 0.12 * (n - 1)) / n;
      d.imgs.forEach((im, i) => shot(s, im, b.x - 0.1, b.y - 0.05 + i * (gh + 0.12), b.w + 0.2, gh));
    } else {
      s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: SOFT }, line: { color: X.accent5, width: 1, dashType: "dash" } });
      T(s, d.shot, { x: b.x + 0.15, y: b.y, w: b.w - 0.3, h: b.h, fontSize: 13, color: C.accent2, align: "center", valign: "middle" });
    }
  };
  R.workflow = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText("用：" + d.tool, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x: 0.6, y: 1.35, w: Math.min(5.0, 0.6 + d.tool.length * 0.13), h: 0.32, fill: { color: X.dk1 }, line: { color: X.dk1, width: 0 }, fontSize: 11, bold: true, color: X.accent1, align: "center", valign: "middle", margin: 0, fontFace: FONT });
    steps(s, d.steps, 0.6, 1.85, 4.85, 3.15, 15);
    const b = win(s, 5.75, 1.35, 3.65, 2.65, { title: "跟它说清楚" });
    s.addText(bullets(d.tell, 13), { isTextBox: true, x: b.x, y: b.y, w: b.w, h: b.h, valign: "top", margin: 0, fontFace: FONT });
    box(s, 5.75, 4.15, 3.65, 0.85, WARN, WARN);
    s.addImage({ data: await icon("FaTriangleExclamation", X.accent3), x: 5.92, y: 4.42, w: 0.3, h: 0.3 });
    T(s, d.warn, { x: 6.35, y: 4.15, w: 2.9, h: 0.85, fontSize: 13, bold: true, valign: "middle" });
  };
  R.checklist = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, cols = n > 6 ? 2 : 1, per = Math.ceil(n / cols), w = cols === 2 ? 4.25 : 8.8;
    const rowH = Math.min(0.62, 3.55 / per);
    for (const [i, t] of d.items.entries()) {
      const c = Math.floor(i / per), r = i % per, x = 0.6 + c * 4.55, y = 1.45 + r * rowH;
      await ico(s, x, y + (rowH - 0.38) / 2, 0.38, d.bad ? "FaXmark" : "FaCheck", d.bad ? WARN : X.accent1, d.bad ? X.accent3 : X.dk1);
      T(s, t, { x: x + 0.55, y, w: w - 0.6, h: rowH, fontSize: cols === 2 ? 14 : 16, valign: "middle" });
    }
  };
  // Agent 循环：派活 → 想 → 做 → 看结果，没做完回到「想」
  R.loop = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const y = 2.05, h = 1.0;
    const nodes = [
      { x: 0.6, w: 1.85, t: "你派一个活", fill: X.lt2 },
      { x: 2.85, w: 1.95, t: "它想：\n下一步做什么", fill: X.dk1 },
      { x: 5.2, w: 1.95, t: "动手做一步", fill: X.lt2 },
      { x: 7.55, w: 1.85, t: "看结果", fill: X.dk1 },
    ];
    const line = (x1, y1, x2, y2, arrow = true, color = X.dk1) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: y2 < y1, flipH: x2 < x1, line: { color, width: 2, endArrowType: arrow ? "triangle" : undefined } });
    nodes.forEach((nd, i) => {
      const dark = nd.fill === X.dk1;
      s.addText(nd.t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: nd.x, y, w: nd.w, h, fill: { color: nd.fill }, line: { color: nd.fill, width: 0 }, fontSize: 15, bold: true, color: dark ? X.accent1 : X.dk1, align: "center", valign: "middle", margin: 0.05, fontFace: FONT });
      if (i < 3) line(nd.x + nd.w + 0.04, y + h / 2, nodes[i + 1].x - 0.04, y + h / 2);
    });
    // 回环：看结果 → 想下一步
    const lx = 8.475, rx = 3.825, top = 1.55;
    line(lx, y - 0.02, lx, top, false, X.accent2);
    line(lx, top, rx, top, false, X.accent2);
    line(rx, top, rx, y - 0.04, true, X.accent2);
    T(s, "没做完？再想下一步", { x: 4.6, y: 1.27, w: 3.2, h: 0.26, fontSize: 12, bold: true, color: C.accent2, align: "center" });
    // 做完 → 汇报
    line(lx, y + h + 0.04, lx, 3.62);
    s.addText("做完，向你汇报", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: 7.05, y: 3.65, w: 2.35, h: 0.75, fill: { color: X.accent1 }, line: { color: X.accent1, width: 0 }, fontSize: 15, bold: true, color: X.dk1, align: "center", valign: "middle", margin: 0, fontFace: FONT });
    T(s, "就像一个靠谱的员工：自己想、自己做、自己检查，做完再找你", { x: 0.6, y: 3.65, w: 6.3, h: 0.75, fontSize: 15, color: C.text2, valign: "middle" });
  };
  // 可照抄的提示词：深色编辑器窗口
  R.prompt = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const b = win(s, 0.6, 1.3, 8.8, 3.2, { title: "可以照抄 · 把【】里换成你的", dark: true });
    s.addText(d.lines.map((t, i) => ({ text: t || " ", options: { breakLine: i < d.lines.length - 1, color: t.startsWith("先别写") ? X.accent1 : /^\d\./.test(t) ? "C9CED6" : "FFFFFF", bold: t.startsWith("先别写") } })),
      { isTextBox: true, x: b.x, y: b.y - 0.05, w: b.w, h: b.h, fontSize: 12.5, valign: "top", margin: 0, fontFace: FONT, paraSpaceAfter: 0 });
    if (d.tip) note(s, d.tip, 4.62, 0.42);
  };
  R.screens = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
    d.items.forEach((it, i) => {
      const x = 0.6 + i * (w + gap);
      const b = win(s, x, 1.4, w, 3.0, { title: "真实界面" });
      shot(s, it.img, b.x - 0.1, b.y - 0.05, b.w + 0.2, b.h + 0.1);
      T(s, it.cap, { x, y: 4.5, w, h: 0.5, fontSize: 14, bold: true, align: "center", valign: "middle" });
    });
  };
  // 左边要点，右边一张截图
  R.screenlist = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const rh = 3.5 / d.items.length;
    d.items.forEach((t, i) => {
      const y = 1.5 + i * rh;
      tag(s, 0.6, y + 0.05, 0.42, i + 1, i === d.items.length - 1);
      T(s, t, { x: 1.2, y, w: 3.0, h: rh - 0.1, fontSize: 15, valign: "top" });
    });
    const b = win(s, 4.5, 1.4, 4.9, 3.6, { title: "真实界面" });
    shot(s, d.img, b.x - 0.1, b.y - 0.05, b.w + 0.2, b.h + 0.1);
  };
  R.half = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(bullets(d.top, 15), { isTextBox: true, x: 0.6, y: 1.45, w: 8.8, h: 1.4, valign: "top", margin: 0, fontFace: FONT });
    box(s, 0.6, 3.0, 8.8, 2.0, X.dk1, X.dk1);
    await ico(s, 0.9, 3.3, 0.7, "FaVideo", X.accent1, X.dk1);
    T(s, "要做 15 秒营销视频或海报？", { x: 1.85, y: 3.25, w: 7.3, h: 0.45, fontSize: 18, bold: true, color: C.background1 });
    T(s, "ThinkNova：写几句话或传一张产品图就能生成，不用拍、不用剪", { x: 1.85, y: 3.75, w: 7.3, h: 0.45, fontSize: 14, color: C.accent5 });
    T(s, "thinknova.top", { x: 1.85, y: 4.3, w: 4, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
  };

  for (const mod of M) {
    for (const sl of mod.slides) {
      if (sl.type === "mark") { part = sl.part; continue; }
      const dark = ["cover", "divider", "statement", "closing"].includes(sl.type);
      const s = pres.addSlide({ masterName: dark ? "DARK" : "PAGE" });
      if (!R[sl.type]) throw new Error("no renderer " + sl.type);
      await R[sl.type](s, sl);
      if (!dark) eyebrow(s);
      s.addNotes(sl.n || "");
    }
  }
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
