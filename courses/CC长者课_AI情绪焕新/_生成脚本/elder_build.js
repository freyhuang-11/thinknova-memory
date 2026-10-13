// node elder_build.js <out.pptx>  —— 长者课大字版，正文全部 ≥ 20pt
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const fa = require("react-icons/fa6");
const sharp = require("sharp");
const { S } = require("./elder_content.js");
const { applyTheme } = require("/root/.claude/skills/synced/cdec9fa1-e952-4345-b773-645b32fed51a_d89cec47-7171-4808-b535-84c2b1004644/pptx/scripts/apply_theme.js");

const OUT = process.argv[2];
const THEME = {
  name: "ThinkNova Senior Class",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1C1D3A", lt1: "FFFFFF", dk2: "3D4166", lt2: "FFF4EC",
    accent1: "F0592A", accent2: "5048E5", accent3: "12A594", accent4: "F2B33D",
    accent5: "C9C6F0", accent6: "E5484D", hlink: "5048E5", folHlink: "8A84E8",
  },
};
const HEX = THEME.colors;

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
  pres.layout = "LAYOUT_16x9";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "AI 情绪焕新";
  pres.author = "ThinkNova";
  pres.company = "ThinkNova";
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "SR_CONTENT", background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.28, w: 9, h: 0.75, fontSize: 30, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 9.0, y: 5.1, w: 0.6, h: 0.4, fontSize: 20, color: C.accent5, align: "right" },
  });
  pres.defineSlideMaster({
    title: "SR_DARK", background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.1, w: 5.5, h: 1.8, fontSize: 44, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.05, w: 5.5, h: 1.3, fontSize: 24, color: C.accent5, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });

  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, color: C.text1, fontSize: 22, valign: "top" }, o));
  const card = (s, x, y, w, h, fill = C.background2) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.15, fill: { color: fill }, line: { color: fill, width: 0 } });
  async function badge(s, x, y, d, iconName, fill = C.accent1) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
    const p = d * 0.24;
    s.addImage({ data: await icon(iconName), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  }
  function num(s, x, y, d, n) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 } });
    T(s, String(n), { x, y, w: d, h: d, fontSize: 24, bold: true, color: C.background1, align: "center", valign: "middle" });
  }
  function shot(s, x, y, w, h, label) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: C.background1 }, line: { color: HEX.accent2, width: 2, dashType: "dash" } });
    T(s, label, { x: x + 0.2, y, w: w - 0.4, h, fontSize: 20, color: C.accent2, align: "center", valign: "middle" });
  }

  const R = {};
  R.cover = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    T(s, "ThinkNova", { x: 0.6, y: 4.65, w: 4, h: 0.45, fontSize: 20, bold: true, color: C.accent5 });
    s.addShape(pres.shapes.OVAL, { x: 6.3, y: 1.0, w: 3.2, h: 3.2, fill: { color: C.accent1, transparency: 10 }, line: { color: C.accent1, width: 0 } });
    s.addImage({ data: await icon("FaCameraRetro"), x: 7.1, y: 1.8, w: 1.6, h: 1.6 });
  };
  R.closing = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    s.addText(d.sub, { placeholder: "body" });
    s.addShape(pres.shapes.OVAL, { x: 6.3, y: 1.0, w: 3.2, h: 3.2, fill: { color: C.accent2, transparency: 10 }, line: { color: C.accent2, width: 0 } });
    s.addImage({ data: await icon("FaHeart"), x: 7.1, y: 1.8, w: 1.6, h: 1.6 });
  };
  R.cards = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, gap = 0.3, w = (9 - gap * (n - 1)) / n;
    for (const [i, it] of d.items.entries()) {
      const x = 0.5 + i * (w + gap), y = 1.3;
      card(s, x, y, w, 3.7);
      await badge(s, x + w / 2 - 0.5, y + 0.3, 1.0, it.icon, i === 1 ? C.accent2 : C.accent1);
      T(s, it.h, { x: x + 0.15, y: y + 1.5, w: w - 0.3, h: 0.6, fontSize: 24, bold: true, align: "center" });
      T(s, it.t, { x: x + 0.15, y: y + 2.2, w: w - 0.3, h: 1.3, fontSize: 20, color: C.text2, align: "center" });
    }
  };
  R.big = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    card(s, 0.5, 1.3, 9, 3.7);
    await badge(s, 0.9, 1.75, 1.5, d.icon, C.accent1);
    T(s, d.big, { x: 2.8, y: 1.6, w: 6.4, h: 0.8, fontSize: 32, bold: true, color: C.accent1, valign: "middle" });
    s.addText(d.lines.map((t, i) => ({ text: t, options: { breakLine: i < d.lines.length - 1, paraSpaceAfter: 10 } })),
      { isTextBox: true, x: 2.8, y: 2.6, w: 6.4, h: 2.2, fontSize: 24, color: C.text1, valign: "top", margin: 0 });
  };
  R.steps = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.steps.length, rowH = 3.8 / n;
    d.steps.forEach((t, i) => {
      const y = 1.25 + i * rowH;
      num(s, 0.5, y + (rowH - 0.6) / 2, 0.6, i + 1);
      T(s, t, { x: 1.3, y, w: 4.2, h: rowH, fontSize: 22, valign: "middle" });
    });
    shot(s, 5.8, 1.25, 3.7, 3.8, d.shot);
  };
  R.list = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    const n = d.items.length, H = d.tip ? 2.95 : 3.8, rowH = Math.min(0.95, H / n);
    for (const [i, t] of d.items.entries()) {
      const y = 1.25 + i * rowH;
      card(s, 0.5, y, 9, rowH - 0.12);
      await badge(s, 0.7, y + (rowH - 0.12 - 0.55) / 2, 0.55, d.icon, i % 2 ? C.accent2 : C.accent1);
      T(s, t, { x: 1.5, y, w: 7.85, h: rowH - 0.12, fontSize: 22, valign: "middle" });
    }
    if (d.tip) {
      card(s, 0.5, 4.35, 9, 0.75, C.text1);
      T(s, d.tip, { x: 0.8, y: 4.35, w: 8.4, h: 0.75, fontSize: 22, bold: true, color: C.background1, valign: "middle" });
    }
  };
  R.compare = async (s, d) => {
    s.addText(d.title, { placeholder: "title" });
    shot(s, 0.5, 1.3, 4.0, 3.7, d.left);
    shot(s, 5.5, 1.3, 4.0, 3.7, d.right);
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.65, y: 2.85, w: 0.7, h: 0.6, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 } });
  };

  for (const sl of S) {
    const master = sl.type === "cover" || sl.type === "closing" ? "SR_DARK" : "SR_CONTENT";
    const s = pres.addSlide({ masterName: master });
    await R[sl.type](s, sl);
    s.addNotes(sl.n);
  }
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
