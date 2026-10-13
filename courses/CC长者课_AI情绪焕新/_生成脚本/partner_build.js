// node build.js <out-dir>  —— CC 长者课合作方案（内部讨论）：同一份内容生成 .docx 和 .md
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, LevelFormat, Footer, PageNumber,
} = require('docx');

// ── 内容 ──
const TITLE = 'CC 长者课合作方案（内部讨论）';
const SUB = '「AI 情绪焕新」 · 社区中心（CC）合作 · 只供内部讨论，不发给 CC';
const LEAD = '在社区中心给长者开「AI 情绪焕新」课：一边积累政府向的曝光，一边把学员转到 ThinkNova 和小生意 AI 课。';
const SECTIONS = [
  { h: '一、我们要什么', table: { head: ['目标', '具体是什么', '看什么'], widths: [1800, 4426, 2800], rows: [
    ['政府向曝光', '和 CC 合作办课，积累背书，以后对接更多社区和政府项目', '出席人数、合照、学员作品、反馈'],
    ['基础转化', '学员付算力费用 ThinkNova；家里有人做生意的，引到小生意 AI 课，再到定制开发（FDE）', '付费人数；登记「家里做生意」的人数'],
  ] } },
  { h: '二、课程是什么', kv: [
    ['名称', 'AI 情绪焕新'],
    ['对象', '社区中老年居民，华语授课'],
    ['时长', '约 2 小时，一次上完，课堂互动多'],
    ['学员带走', '三样作品：一张焕新的照片、一段视频、一张节日祝福'],
    ['内容', 'AI 能做什么 → 照片焕新（修复旧照片、变成任何样子）→ 做视频（打一句话，去任何地方、做任何事）→ 节日祝福 → 发给家人 → 提一句防 AI 诈骗'],
    ['平台入口', '「生成 → 图片改图 / 照片生成视频」；节日祝福用「海报制作 → 节日节气祝福图」'],
    ['课件', 'AI情绪焕新_长者课.pptx，34 页，字号全部 20pt 以上，讲稿在备注里'],
  ] },
  { h: '三、钱怎么收', bullets: [
    [['进场收算力费 S$8', true], '（= US$6 积分包，500 积分），所有对外材料只写新币。'],
    ['付款：PayNow 或信用卡。不会网上付款的长者，现场收款后由管理员在后台给账号加积分。'],
    ['课件里不出现价格。'],
    ['新账号自带 100 积分（45 天有效），课上先用这部分；S$8 买的是课后继续用的额度。对 CC 可以说：「课上体验不额外花钱，算力费是学员回家继续用的」。'],
    ['500 积分大约能做 80 张图（每张 6 积分），或 20 段 6 秒视频（每段 24 积分）。'],
  ] },
  { h: '四、漏斗怎么接', flow: ['CC 长者课', '登记表：家里有人做生意吗？', '小生意 AI 课（付费）', '定制开发（FDE）'],
    after: '另一条路：课后继续用 ThinkNova，买积分包。',
    bullets: [
      [['登记表字段：', true], '姓名；手机号；家里有没有人做生意、做哪一行；想不想了解小生意 AI 课；同意我们用以上信息联系你（勾选）。'],
      ['「同意联系」这一项必须有：新加坡个人资料保护法（PDPA）要求收集联系方式前取得同意。'],
      ['合照、学员作品要对外使用，也要现场取得本人同意。'],
    ] },
  { h: '五、对 CC 怎么讲', bullets: [
    [['学会一项新的数码技能：', true], '自己动手做照片和视频，当天就能发给家人。'],
    [['防诈骗：', true], '课上提醒网上的照片、视频、直播、电话里的声音都可能是 AI 做的，有人要钱先打电话确认。'],
    [['安全使用：', true], '分享时说明是 AI 做的，不乱用别人的照片，不把身份证、银行卡拍进照片。'],
    ['【待确认】能不能对接政府现有的乐龄数码化项目。先查清项目名称和要求，谈判时不要随口提。'],
  ] },
  { h: '六、每场要留的曝光素材', bullets: [
    ['出席人数、助教人数'], ['合照（已取得同意）'], ['学员作品 3–5 个（已取得同意）'], ['学员一句话反馈（文字或视频）'], ['登记表里「家里有人做生意」的人数'],
  ] },
  { h: '七、要定的事', table: { head: ['事项', '状态'], widths: [5426, 3600], rows: [
    ['算力费金额', '已定：S$8'],
    ['PayNow 能不能用', '已确认可以'],
    ['CC 是否允许进场收费、由谁代收', '待和 CC 谈'],
    ['上课日期、场次、每班人数', '待定'],
    ['学员用什么设备（平板、电脑、手机）', '待定'],
    ['助教人数', '建议每 5–6 位学员配 1 名，现场注册最容易卡住'],
    ['课件截图框放真实截图', '待做'],
    ['登记表和同意书', '待做'],
    ['实测：新邮箱验证码多久到、手机网页能不能生成', '待测'],
  ] } },
  { h: '八、风险', table: { head: ['风险', '后果', '对策'], widths: [2700, 2300, 4026], rows: [
    ['生成的人只像本人六七成，每次不一样', '长者失望', '课件已提前讲明；教「先用图片改图做参考图，再做视频」；准备几张效果好的备用照片'],
    ['注册卡在验证码上', '注册用掉大半节课', '多配助教；提前问清验证码流程'],
    ['多人同时生成排队，偶尔报错', '视频要等 3–5 分钟，长者没耐心', '分组轮流点生成（每组 5–6 人），报错再点一次'],
    ['课上反复生成，100 赠送积分用完', '开始扣学员买的 500 积分', '课前实测一节课大概用多少积分；提醒学员挑着生成'],
    ['CC 不允许课上收费', '当场转化归零', '改成课程免费、课后自愿购买，先把合作谈下来，以曝光为主'],
  ] } },
];

// ── Word ──
const FONT = 'Microsoft YaHei', ACCENT = 'B8352A', LIGHT = 'FBEAE5', W = 9026;
const run = (text, o = {}) => new TextRun({ text, font: { name: FONT, eastAsia: FONT }, size: 21, ...o });
const runs = (parts) => parts.map((p) => Array.isArray(p) ? run(p[0], { bold: p[1] }) : run(p));
const P = (children, o = {}) => new Paragraph({ spacing: { after: 60, line: 300 }, ...o, children });
const line = { style: BorderStyle.SINGLE, size: 4, color: 'E3CFC9' };
const borders = { top: line, bottom: line, left: line, right: line };
const cell = (children, width, fill) => new TableCell({ width: { size: width, type: WidthType.DXA }, borders,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: fill ? { type: ShadingType.CLEAR, color: 'auto', fill } : undefined, children });
const table = (head, widths, rows) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [
  new TableRow({ tableHeader: true, children: head.map((t, i) => cell([P([run(t, { bold: true, color: 'FFFFFF' })], { spacing: { after: 0 } })], widths[i], ACCENT)) }),
  ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell([P([run(t, { bold: i === 0 })], { spacing: { after: 0, line: 280 } })], widths[i])) })),
] });
const heading = (t) => new Paragraph({ spacing: { before: 280, after: 120 }, keepNext: true, children: [run(t, { bold: true, size: 28, color: ACCENT })] });
const bullet = (parts) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 60, line: 300 }, children: runs(parts) });

const body = [
  P([run(TITLE, { bold: true, size: 40, color: ACCENT })], { spacing: { after: 60 } }),
  P([run(SUB, { size: 21, color: '777777' })], { spacing: { after: 220 } }),
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ children: [cell([P([run(LEAD, { size: 23, bold: true })], { spacing: { after: 0, line: 320 } })], W, LIGHT)] })] }),
];
for (const sec of SECTIONS) {
  body.push(heading(sec.h));
  if (sec.table) body.push(table(sec.table.head, sec.table.widths, sec.table.rows));
  if (sec.kv) body.push(table(['项目', '内容'], [1800, 7226], sec.kv));
  if (sec.flow) {
    const n = sec.flow.length, cw = Math.floor(W / (2 * n - 1)), widths = [];
    const cells = [];
    sec.flow.forEach((t, i) => {
      const last = i === n - 1;
      const w = Math.floor((W - (n - 1) * 400) / n);
      cells.push(new TableCell({ width: { size: w, type: WidthType.DXA }, borders, margins: { top: 100, bottom: 100, left: 100, right: 100 },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: last ? ACCENT : LIGHT }, verticalAlign: 'center',
        children: [P([run(t, { bold: true, color: last ? 'FFFFFF' : '2B1D1A' })], { alignment: AlignmentType.CENTER, spacing: { after: 0, line: 280 } })] }));
      widths.push(w);
      if (!last) {
        const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
        cells.push(new TableCell({ width: { size: 400, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none }, verticalAlign: 'center',
          children: [P([run('→', { bold: true, size: 28, color: ACCENT })], { alignment: AlignmentType.CENTER, spacing: { after: 0 } })] }));
        widths.push(400);
      }
    });
    body.push(new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ children: cells })] }));
    if (sec.after) body.push(P([run(sec.after, { color: '555555' })], { spacing: { before: 100, after: 100 } }));
  }
  if (sec.bullets) sec.bullets.forEach((b) => body.push(bullet(b)));
}

const doc = new Document({
  styles: { default: { document: { run: { font: { name: FONT, eastAsia: FONT }, size: 21 } } } },
  numbering: { config: [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      run('内部讨论 · ThinkNova    第 ', { size: 17, color: '999999' }),
      new TextRun({ children: [PageNumber.CURRENT], size: 17, color: '999999', font: { name: FONT, eastAsia: FONT } }),
      run(' 页', { size: 17, color: '999999' }),
    ] })] }) },
    children: body,
  }],
});

// ── Markdown（同一份内容）──
const plain = (parts) => parts.map((p) => Array.isArray(p) ? (p[1] ? `**${p[0]}**` : p[0]) : p).join('');
const mdTable = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
let md = `# ${TITLE}\n\n> ${SUB}\n>\n> Word / PDF 版：\`CC合作方案_内部讨论.docx / .pdf\`，和本文件同一份内容生成。\n\n**${LEAD}**\n`;
for (const sec of SECTIONS) {
  md += `\n## ${sec.h}\n\n`;
  if (sec.table) md += mdTable(sec.table.head, sec.table.rows) + '\n';
  if (sec.kv) md += mdTable(['项目', '内容'], sec.kv) + '\n';
  if (sec.flow) md += '```\n' + sec.flow.join(' ──→ ') + '\n```\n' + (sec.after ? `\n${sec.after}\n` : '');
  if (sec.bullets) md += (sec.flow ? '\n' : '') + sec.bullets.map((b) => `- ${plain(b)}`).join('\n') + '\n';
}

const outDir = process.argv[2];
Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(path.join(outDir, 'CC合作方案_内部讨论.docx'), b);
  fs.writeFileSync(path.join(outDir, 'CC合作方案_内部.md'), md);
  console.log('written');
});
