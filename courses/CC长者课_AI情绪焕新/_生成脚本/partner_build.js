const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, LevelFormat, Footer, PageNumber,
} = require('docx');

const FONT = 'Microsoft YaHei';
const ACCENT = '1F5C99';
const LIGHT = 'EAF1F8';
const W = 9026; // A4 text width at 1" margins (DXA)

const run = (text, o = {}) => new TextRun({ text, font: { name: FONT, eastAsia: FONT }, size: 22, ...o });
const p = (children, o = {}) => new Paragraph({ spacing: { after: 100, line: 300 }, ...o, children: Array.isArray(children) ? children : [run(children)] });
const h = (text) => new Paragraph({
  spacing: { before: 260, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
  children: [run(text, { bold: true, size: 28, color: ACCENT })],
});
const bullet = (children) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 80, line: 300 }, children: Array.isArray(children) ? children : [run(children)] });
const num = (ref, children) => new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80, line: 300 }, children: Array.isArray(children) ? children : [run(children)] });

const none = { style: BorderStyle.SINGLE, size: 4, color: 'BFCFE0' };
const borders = { top: none, bottom: none, left: none, right: none };
const cell = (children, width, o = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA }, borders,
  margins: { top: 90, bottom: 90, left: 140, right: 140 },
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  children: (Array.isArray(children) ? children : [children]).map(c => typeof c === 'string' ? p(c, { spacing: { after: 40, line: 300 } }) : c),
});

// 两列信息表
const kv = (rows) => {
  const c1 = 2000, c2 = W - c1;
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [c1, c2],
    rows: rows.map(([k, v]) => new TableRow({ children: [
      cell(p([run(k, { bold: true, color: ACCENT })], { spacing: { after: 40 } }), c1, { fill: LIGHT }),
      cell(typeof v === 'string' ? v : v, c2),
    ] })),
  });
};

const cellBullets = (items) => items.map(t => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 40, line: 300 }, children: [run(t)] }));

const half = W / 2;
const duty = new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [half, half],
  rows: [
    new TableRow({ children: [
      cell(p([run('ThinkNova 负责', { bold: true, color: 'FFFFFF' })], { spacing: { after: 40 } }), half, { fill: ACCENT }),
      cell(p([run('社区中心（CC）负责', { bold: true, color: 'FFFFFF' })], { spacing: { after: 40 } }), half, { fill: ACCENT }),
    ] }),
    new TableRow({ children: [
      cell(cellBullets([
        '课程设计、讲师和课件',
        '助教（建议每 5–6 位学员配 1 名）',
        '现场帮学员注册账号，处理技术问题',
        '学员登记表和同意书',
        '课后把出席人数、合照、学员作品（已取得同意）整理给 CC',
      ]), half),
      cell(cellBullets([
        '场地：投影、稳定的 Wi-Fi、桌椅、电源插座',
        '招生和宣传',
        '学员报到',
      ]), half),
    ] }),
  ],
});

const doc = new Document({
  styles: { default: { document: { run: { font: { name: FONT, eastAsia: FONT }, size: 22 } } } },
  numbering: { config: [
    { reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
    { reference: 'n1', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
    { reference: 'n2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
  ] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      run('ThinkNova · thinknova.top    第 ', { size: 18, color: '888888' }),
      new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888', font: { name: FONT, eastAsia: FONT } }),
      run(' 页', { size: 18, color: '888888' }),
    ] })] }) },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [run('「AI 情绪焕新」乐龄 AI 课程', { bold: true, size: 40, color: ACCENT })] }),
      new Paragraph({ spacing: { after: 240 }, children: [run('合作方案  ·  ThinkNova × 社区中心（CC）', { size: 24, color: '555555' })] }),

      new Table({
        width: { size: W, type: WidthType.DXA }, columnWidths: [W],
        rows: [new TableRow({ children: [cell(p([run('带社区长者用 AI 让照片焕然一新、让照片里的人动起来、做一张节日祝福，当天发给家人；同时学会识别 AI 做的假视频，防诈骗。', { size: 24 })], { spacing: { after: 40, line: 320 } }), W, { fill: LIGHT })] })],
      }),

      h('一、课程一览'),
      kv([
        ['对象', '社区乐龄居民，零基础也可以上'],
        ['语言', '华语'],
        ['时长', '约 2 小时，一次上完'],
        ['形式', '讲师示范，学员跟着动手做，助教在旁边一对一帮忙'],
        ['学员带走', '三样自己做的作品：一张焕新的照片、一段会动的视频、一张节日祝福图'],
        ['费用', '每位学员 S$8（AI 使用费，详见第四节）'],
      ]),

      h('二、课上做什么'),
      num('n1', [run('认识 AI：', { bold: true }), run('AI 是一个会画画的助手，你说一句，它画出来')]),
      num('n1', [run('注册账号：', { bold: true }), run('助教帮每位学员注册 ThinkNova')]),
      num('n1', [run('作品一 · 照片焕新：', { bold: true }), run('上传一张照片，让它变清晰、换个背景')]),
      num('n1', [run('作品二 · 照片动起来：', { bold: true }), run('让照片里的人微笑、挥手')]),
      num('n1', [run('作品三 · 节日祝福：', { bold: true }), run('做一张节日祝福图，现场用 WhatsApp 发给家人')]),
      num('n1', [run('防诈骗与安全：', { bold: true }), run('看懂 AI 怎么做出假视频、假声音；收到「亲人」要钱的消息，先打电话确认')]),
      p([run('说明：', { bold: true, color: ACCENT }), run('AI 做出来的人像大约像本人六七成，每次生成都不一样。课上会提前讲清楚，并教学员多做几次、挑最像的。')], { spacing: { before: 80, after: 100, line: 300 } }),

      h('三、对居民的好处'),
      bullet([run('学会一项新的数码技能，', { bold: true }), run('当天就能自己用')]),
      bullet([run('防诈骗：', { bold: true }), run('亲手做过一次，就更容易认出 AI 做的假视频')]),
      bullet([run('和家人多一个话题：', { bold: true }), run('作品现场发给子女、孙子孙女')]),

      h('四、费用和付款'),
      bullet([run('每位学员 S$8，进场时收。', { bold: true })]),
      bullet('S$8 换成 500 积分，存在学员自己的账号里，课后可以继续做（大约可做 80 张图片，或 20 段 6 秒视频）。'),
      bullet('课上练习先用新账号自带的赠送额度。'),
      bullet('付款方式：PayNow 或信用卡。不会自己在网上付款的长者，由助教现场帮忙。'),

      h('五、双方分工'),
      duty,

      h('六、隐私与安全'),
      bullet('收集学员联系方式前，先请本人勾选同意（符合个人资料保护法 PDPA）。'),
      bullet('合照和学员作品要对外使用，先取得本人同意。'),
      bullet('课上提醒学员：分享作品时说明是 AI 做的；不用别人的照片；不要把身份证、银行卡拍进照片。'),
      bullet('课程最后有一张自愿登记表，想了解后续课程的学员可以留下联系方式；不填不影响上课。'),

      h('七、需要双方商定'),
      num('n2', '上课日期、场次和每班人数'),
      num('n2', 'S$8 由谁现场收取、怎么收'),
      num('n2', '学员用什么设备上课：自己的手机、平板，还是场地提供的电脑'),
      num('n2', '宣传方式和报名渠道'),

      new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.CENTER, children: [run('了解 ThinkNova：thinknova.top', { bold: true, color: ACCENT, size: 24 })] }),
    ],
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(process.argv[2], b); console.log('written'); });
