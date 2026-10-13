// node elder_build.js <out.pptx>  —— 长者课大字版：节日红 + 暖金，拍立得相框做主视觉，正文全部 ≥ 20pt
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const fa = require("react-icons/fa6");
const sharp = require("sharp");
const { S } = require("./elder_content.js");
const { applyTheme } = require("/root/.claude/skills/synced/cdec9fa1-e952-4345-b773-645b32fed51a_d89cec47-7171-4808-b535-84c2b1004644/pptx/scripts/apply_theme.js");

const OUT = process.argv[2];
const THEME = {
  name: "ThinkNova 情绪焕新",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "2B1D1A", lt1: "FFFFFF", dk2: "6B4A42", lt2: "FBEAE5",
    accent1: "B8352A", accent2: "F4B740", accent3: "DCF8C6", accent4: "1F8A5B",
    accent5: "D9C3BC", accent6: "8E2219", hlink: "B8352A", folHlink: "8E2219",
  },
};
const X = THEME.colors;
const SH = () => ({ type: "outer", blur: 8, offset: 3, angle: 60, color: "000000", opacity: 0.22 });

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

// unDraw 插画（MIT），主色换成课程红；返回透明底 PNG 和宽高比
const fs = require("fs");
const illCache = {};
async function ill(name) {
  if (illCache[name]) return illCache[name];
  const p = __dirname + "/node_modules/undraw-svg/svgs/" + name + ".svg";
  const svg = fs.readFileSync(p, "utf8").replace(/currentColor/g, "#B8352A").replace(/#6c63ff/gi, "#B8352A");
  const img = sharp(Buffer.from(svg), { density: 200 });
  const m = await img.metadata();
  const buf = await img.resize({ width: 1200 }).png().toBuffer();
  return (illCache[name] = { data: "image/png;base64," + buf.toString("base64"), r: m.width / m.height });
}
// 每页用哪张插画（按标题）
const ILL = {
  "AI 情绪焕新": ["grandma", "traveling", "gift-joy"],
  "先认识一下：请举手": "happy-announcement",
  "今天每个人带走三样作品": ["organize-photos", "dancing", "gift-joy"],
  "AI 是什么？": "making-art",
  "AI 能做的事，比你想的多": ["vintage", "selfie-fun", "traveling"],
  "同桌互相看一看": "together",
  "照片焕新": "couple-photo",
  "这样跟 AI 说，最好用": "typing",
  "先知道这一点": "taking-selfie",
  "给同桌看看你的作品": "photo-sharing",
  "走进视频": "adventure",
  "小窍门：先做一张「参考图」": "photo-session",
  "想去哪里、做什么，打出来就行": "texting",
  "做视频要耐心": "in-no-time",
  "大家来投票": "winners",
  "节日祝福": "happy-new-year",
  "这样填就可以": "complete-form",
  "做生意的，也能用": "business-shop",
  "现在就发给家人": "love-messages",
  "小心：骗子也在用 AI": "warning",
  "三条使用提醒": "security",
  "遇到问题怎么办": "questions",
  "家里有人做生意吗？": "teacher",
  "谢谢大家！\n我们一起合照": "group-selfie",
};
(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "AI 情绪焕新";
  pres.author = "ThinkNova";
  pres.company = "ThinkNova";
  const C = pres.SchemeColor;

  const titlePh = (color) => ({ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 8.8, h: 0.8, fontSize: 34, bold: true, color, align: "left", valign: "middle", margin: 0 }, text: "" } });
  pres.defineSlideMaster({ title: "LIGHT", background: { color: C.background1 }, objects: [titlePh(C.text1)],
    slideNumber: { x: 9.1, y: 5.15, w: 0.6, h: 0.3, fontSize: 14, color: C.accent5, align: "right" } });
  pres.defineSlideMaster({ title: "ACT", background: { color: C.accent2 }, objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.95, w: 8.8, h: 0.85, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } }],
    slideNumber: { x: 9.1, y: 5.15, w: 0.6, h: 0.3, fontSize: 14, color: C.text2, align: "right" } });
  pres.defineSlideMaster({ title: "RED", background: { color: C.accent1 }, objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.35, w: 5.2, h: 1.5, fontSize: 54, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 3.0, w: 5.2, h: 1.3, fontSize: 24, color: C.background1, align: "left", valign: "top", margin: 0 }, text: "" } }],
  });

  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, color: C.text1, fontSize: 24, valign: "top", fontFace: THEME.bodyFontFace }, o));
  const rad = (a) => (a * Math.PI) / 180;
  // 把相对中心 (dx, dy) 的点按 angle（顺时针）转过去
  const rot = (cx, cy, dx, dy, a) => [cx + dx * Math.cos(rad(a)) - dy * Math.sin(rad(a)), cy + dx * Math.sin(rad(a)) + dy * Math.cos(rad(a))];

  // 主视觉：拍立得相框。label = 截图占位说明；iconName = 装饰图标；cap = 相框下方手写说明
  async function polaroid(s, cx, cy, w, h, a, { label, iconName, cap, tint = X.lt2, iconColor = X.accent1 } = {}) {
    s.addShape(pres.shapes.RECTANGLE, { x: cx - w / 2, y: cy - h / 2, w, h, rotate: a, fill: { color: C.background1 }, line: { color: "E9DDD8", width: 0.75 }, shadow: SH() });
    const p = Math.min(0.16, w * 0.06), pb = cap ? 0.62 : Math.max(0.4, h * 0.16);
    const iw = w - 2 * p, ih = h - p - pb, oy = (p - pb) / 2;
    const [ix, iy] = rot(cx, cy, 0, oy, a);
    const inner = { x: ix - iw / 2, y: iy - ih / 2, w: iw, h: ih, rotate: a };
    if (label) {
      s.addText(label, { ...inner, shape: pres.shapes.RECTANGLE, fill: { color: "FBF6F4" }, line: { color: X.accent5, width: 1.5, dashType: "dash" },
        fontSize: 20, color: C.text2, align: "center", valign: "middle", margin: 0.15, fontFace: THEME.bodyFontFace });
    } else {
      s.addShape(pres.shapes.RECTANGLE, { ...inner, fill: { color: tint }, line: { color: tint, width: 0 } });
      if (iconName) { const q = 0.12; await art(s, iconName, ix - iw / 2 + q, iy - ih / 2 + q, iw - 2 * q, ih - 2 * q, a); }
    }
    if (cap) {
      const [kx, ky] = rot(cx, cy, 0, h / 2 - pb / 2, a);
      s.addText(cap, { x: kx - iw / 2, y: ky - 0.25, w: iw, h: 0.5, rotate: a, fontSize: 20, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0, fontFace: THEME.bodyFontFace });
    }
  }
  async function art(s, name, x, y, w, h, rotate = 0) {
    const im = await ill(name);
    let iw = w, ih = w / im.r;
    if (ih > h) { ih = h; iw = h * im.r; }
    s.addImage({ data: im.data, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih, rotate });
  }
  async function dot(s, x, y, d, iconName, fill = X.accent1, fg = "FFFFFF") {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
    const q = d * 0.25;
    s.addImage({ data: await icon(iconName, fg), x: x + q, y: y + q, w: d - 2 * q, h: d - 2 * q });
  }
  function num(s, x, y, d, n, fill = C.accent1) {
    s.addText(String(n), { shape: pres.shapes.OVAL, x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 }, fontSize: 26, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, fontFace: THEME.bodyFontFace });
  }
  function pill(s, text, x, y, w, h, fill = C.accent2, color = C.text1) {
    s.addText(text, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: h / 2, x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, fontSize: 24, bold: true, color, align: "center", valign: "middle", margin: 0.1, fontFace: THEME.bodyFontFace });
  }

  const R = {};
  R.cover = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    T(s, "ThinkNova", { x: 0.7, y: 4.75, w: 4, h: 0.4, fontSize: 20, bold: true, color: C.accent2 });
    const [a1, a2, a3] = ILL[d.title];
    await polaroid(s, 7.1, 1.95, 2.4, 2.7, -9, { iconName: a1, tint: "FFFFFF" });
    await polaroid(s, 8.4, 3.05, 2.3, 2.6, 7, { iconName: a2, tint: "FFFFFF" });
    await polaroid(s, 6.7, 3.8, 2.1, 2.35, -2, { iconName: a3, tint: "FFFFFF" });
  };
  R.closing = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    await polaroid(s, 7.6, 2.75, 3.4, 3.6, 5, { iconName: ILL[d.title], cap: "今天的合照", tint: "FFFFFF" });
  };
  R.chapter = async (s, d) => {
    pill(s, d.k, 0.7, 0.85, 1.6, 0.55);
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    await polaroid(s, 7.5, 2.8, 3.4, 3.7, -6, { iconName: ILL[d.title], tint: "FFFFFF" });
  };
  R.cards = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, y = 1.4, h = 3.75;
    const pics = ILL[d.title];
    for (const [i, it] of d.items.entries()) {
      const x = 0.6 + i * (w + gap);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.background1 }, line: { color: "EFE4E0", width: 0.75 }, shadow: SH() });
      await art(s, pics[i], x + 0.2, y + 0.18, w - 0.4, 1.35);
      T(s, it.h, { x: x + 0.1, y: y + 1.65, w: w - 0.2, h: 0.55, fontSize: 22, bold: true, align: "center", valign: "middle" });
      T(s, it.t, { x: x + 0.1, y: y + 2.3, w: w - 0.2, h: 1.3, fontSize: 20, color: C.text2, align: "center" });
    }
  };
  R.big = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    T(s, d.big, { x: 0.6, y: 1.55, w: 6.2, h: 1.3, fontSize: 32, bold: true, color: C.accent1, valign: "middle" });
    s.addText(d.lines.map((t, i) => ({ text: t, options: { breakLine: i < d.lines.length - 1, paraSpaceAfter: 8 } })),
      { isTextBox: true, x: 0.6, y: 3.0, w: 6.0, h: 1.9, fontSize: 26, color: C.text1, valign: "top", margin: 0 });
    s.addShape(pres.shapes.OVAL, { x: 6.75, y: 1.3, w: 3.0, h: 3.0, fill: { color: X.lt2 }, line: { color: X.lt2, width: 0 } });
    await art(s, ILL[d.title], 6.6, 1.55, 3.1, 3.2);
  };
  R.steps = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.steps.length, top = 1.4, H = 3.75, rowH = H / n;
    d.steps.forEach((t, i) => {
      const y = top + i * rowH;
      num(s, 0.6, y + (rowH - 0.62) / 2, 0.62, i + 1);
      T(s, t, { x: 1.45, y, w: 4.75, h: rowH, fontSize: 24, valign: "middle" });
    });
    await polaroid(s, 7.95, 3.1, 2.95, 3.4, 2.5, { label: d.shot });
  };
  R.list = async (s, d) => {
    s.addText(d.title, { placeholder: d.act ? "title" : "title" });
    if (d.act) {
      s.addText([{ text: "  互动时间", options: {} }], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.25, x: 0.6, y: 0.35, w: 2.0, h: 0.5, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, fontFace: THEME.bodyFontFace });
    }
    const n = d.items.length, wide = n >= 4; // 四条以上：文字占满宽，插画缩到右上角
    const top = d.act ? 2.05 : 1.45, H = (d.tip ? 4.25 : 5.05) - top, rowH = Math.min(1.0, H / n), tw = wide ? 7.9 : d.act ? 5.2 : 5.5;
    for (const [i, t] of d.items.entries()) {
      const y = top + i * rowH;
      if (d.act) num(s, 0.6, y + (rowH - 0.6) / 2, 0.6, i + 1, C.text1);
      else s.addShape(pres.shapes.OVAL, { x: 0.75, y: y + (rowH - 0.26) / 2, w: 0.26, h: 0.26, fill: { color: i % 2 ? X.accent2 : X.accent1 }, line: { color: X.accent1, width: 0 } });
      T(s, t, { x: d.act ? 1.5 : 1.25, y, w: tw, h: rowH, fontSize: 24, valign: "middle" });
    }
    if (wide) await art(s, ILL[d.title], 7.6, 0.12, 1.9, 1.25);
    else if (d.act) {
      s.addShape(pres.shapes.OVAL, { x: 6.85, y: 1.6, w: 2.9, h: 2.9, fill: { color: C.background1 }, line: { color: C.background1, width: 0 } });
      await art(s, ILL[d.title], 6.95, 1.75, 2.7, 2.6);
    } else await art(s, ILL[d.title], 6.75, 1.35, 2.85, 3.4);
    if (d.tip) pill(s, d.tip, 0.6, 4.4, Math.min(wide ? 8.8 : 5.95, 0.9 + d.tip.length * 0.36), 0.62, d.act ? C.background1 : C.accent2, C.text1);
  };
  // 像 WhatsApp 一样的对话气泡：老人一看就懂「这是要打出来的话」
  R.say = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const top = 1.45, rowH = 0.88;
    await art(s, ILL[d.title], 0.5, 1.4, 2.6, 2.8);
    for (const [i, t] of d.items.entries()) {
      const y = top + i * rowH, w = Math.min(6.2, 0.7 + t.length * 0.31);
      s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.18, x: 9.4 - w, y, w, h: 0.7, fill: { color: C.accent3 }, line: { color: "BFE5A6", width: 0.75 }, shadow: { type: "outer", blur: 3, offset: 1, angle: 90, color: "000000", opacity: 0.15 },
        fontSize: 22, color: C.text1, align: "left", valign: "middle", margin: [0, 14, 0, 14], fontFace: THEME.bodyFontFace });
    }
    if (d.tip) pill(s, d.tip, 0.6, 4.4, Math.min(8.8, 0.9 + d.tip.length * 0.36), 0.62);
  };
  R.compare = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    await polaroid(s, 2.75, 3.1, 3.5, 3.5, -3, { label: d.left, cap: "原来" });
    await polaroid(s, 7.25, 3.1, 3.5, 3.5, 3, { label: d.right, cap: "AI 做好的" });
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.55, y: 2.75, w: 0.9, h: 0.65, fill: { color: X.accent1 }, line: { color: X.accent1, width: 0 } });
  };

  for (const sl of S) {
    const red = ["cover", "closing", "chapter"].includes(sl.type);
    const s = pres.addSlide({ masterName: red ? "RED" : sl.act ? "ACT" : "LIGHT" });
    await R[sl.type](s, sl);
    s.addNotes(sl.n);
  }
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
