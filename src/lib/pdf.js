import { TALUKAS } from '../data/talukas.js';
import { SIZE_G, getChecks, getSteps } from './calc.js';
import { getOtherList } from '../data/other.js';
import { money, rupees, pct } from './format.js';

const PW = 1240;
const PH = 1754;
const M = 76;
const CW = PW - 2 * M;
const HEAD = 118;
const FOOT = 74;

const C = {
  teal: '#0E4B47',
  teal2: '#136B65',
  ink: '#17302E',
  mute: '#587370',
  line: '#D6E2DF',
  sunk: '#EEF4F2',
  mari: '#D99A36',
  mariInk: '#8F5A0C',
  mariSoft: '#FBF1DE',
  ok: '#1D7A4E',
  okSoft: '#E2F2E8',
  warn: '#8F5A0C',
  warnSoft: '#FBF1DE',
  bad: '#B0392E',
  badSoft: '#F9E6E3',
  cap: '#136B65',
  int: '#E2A445',
  pow: '#6F8FC7',
  head: '#CFE5E1',
};

const FF = '"Noto Sans Gujarati","Shruti","Nirmala UI","Gujarati Sangam MN","Gujarati MT",sans-serif';

const strip = (s) =>
  String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

class Doc {
  constructor(title) {
    this.pages = [];
    this.title = title;
    this.newPage();
  }
  newPage() {
    const c = document.createElement('canvas');
    c.width = PW;
    c.height = PH;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, PW, PH);
    this.pages.push(c);
    this.g = g;
    this.header();
    this.y = HEAD + 36;
  }
  font(size, w) {
    this.g.font = `${w || 400} ${size}px ${FF}`;
  }
  rr(x, y, w, h, r, fill) {
    const g = this.g;
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
    g.fillStyle = fill;
    g.fill();
  }
  header() {
    const g = this.g;
    g.fillStyle = C.teal;
    g.fillRect(0, 0, PW, HEAD);
    g.textBaseline = 'alphabetic';
    g.fillStyle = '#fff';
    this.font(32, 700);
    g.fillText('સબસિડી સાથી', M + 10, 62);
    g.fillStyle = C.head;
    this.font(18, 500);
    g.fillText('Subsidy Sathi · વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026 · સહાય અંદાજ અહેવાલ', M + 10, 94);
    this.font(17, 500);
    g.textAlign = 'right';
    g.fillText(this.title, PW - M, 62);
    g.textAlign = 'left';
  }
  footers() {
    const n = this.pages.length;
    this.pages.forEach((c, i) => {
      const g = c.getContext('2d');
      g.strokeStyle = C.line;
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(M, PH - FOOT);
      g.lineTo(PW - M, PH - FOOT);
      g.stroke();
      g.fillStyle = C.mute;
      g.font = `400 16px ${FF}`;
      g.textBaseline = 'alphabetic';
      g.fillText(
        'આ સરકારી દસ્તાવેજ નથી. ત્રણ GR પર આધારિત સૂચક અંદાજ; મંજૂરી કે ખાતરી નથી. અંતિમ નિર્ણય મંજૂરી સત્તાધિકારીનો.',
        M,
        PH - FOOT + 32
      );
      g.textAlign = 'right';
      g.fillText(`પાનું ${i + 1} / ${n}`, PW - M, PH - FOOT + 32);
      g.textAlign = 'left';
    });
  }
  room() {
    return PH - FOOT - 24 - this.y;
  }
  ensure(h) {
    if (h > this.room()) this.newPage();
  }
  wrap(text, size, w, maxW) {
    this.font(size, w);
    const out = [];
    let line = '';
    for (const word of strip(text).split(' ')) {
      const t = line ? line + ' ' + word : word;
      if (this.g.measureText(t).width <= maxW || !line) {
        line = t;
      } else {
        out.push(line);
        line = word;
      }
    }
    if (line) out.push(line);
    return out.length ? out : [''];
  }
  para(text, o = {}) {
    const size = o.size || 20;
    const w = o.w || 400;
    const x = o.x ?? M;
    const maxW = o.maxW || CW;
    const LH = Math.round(size * (o.lh || 1.55));
    const ls = this.wrap(text, size, w, maxW);
    for (const l of ls) {
      this.ensure(LH);
      this.font(size, w);
      this.g.fillStyle = o.color || C.ink;
      this.g.fillText(l, x, this.y + size);
      this.y += LH;
    }
    this.y += o.gap ?? 6;
  }
  heading(t, keep) {
    this.ensure(keep || 200);
    this.y += 16;
    this.font(26, 700);
    this.g.fillStyle = C.teal;
    this.g.fillText(strip(t), M, this.y + 26);
    this.y += 40;
    this.g.fillStyle = C.mari;
    this.g.fillRect(M, this.y, 56, 4);
    this.y += 18;
  }
  table(cols, rows, o = {}) {
    const size = o.size || 18;
    const LH = Math.round(size * 1.5);
    const PAD = 10;
    const xs = [];
    let acc = M;
    cols.forEach((c) => {
      xs.push(acc);
      acc += c.w * CW;
    });
    const drawRow = (cells, style) => {
      const wr = cells.map((cell, k) =>
        this.wrap(cell, size, style.bold ? 600 : cols[k].bold ? 600 : 400, cols[k].w * CW - 2 * PAD)
      );
      const h = Math.max(...wr.map((l) => l.length)) * LH + 2 * PAD;
      if (h > this.room()) {
        this.newPage();
        if (o.head && !style.isHead) drawRow(o.head, { isHead: true, bold: true, bg: C.sunk, color: C.mute });
      }
      if (style.bg) {
        this.g.fillStyle = style.bg;
        this.g.fillRect(M, this.y, CW, h);
      }
      wr.forEach((ls, k) => {
        this.font(size, style.bold ? 600 : cols[k].bold ? 600 : 400);
        this.g.fillStyle = style.color || cols[k].color || C.ink;
        ls.forEach((l, j) => {
          const yy = this.y + PAD + j * LH + size;
          if (cols[k].align === 'right') {
            this.g.textAlign = 'right';
            this.g.fillText(l, xs[k] + cols[k].w * CW - PAD, yy);
            this.g.textAlign = 'left';
          } else this.g.fillText(l, xs[k] + PAD, yy);
        });
      });
      this.g.strokeStyle = style.strong ? C.ink : C.line;
      this.g.lineWidth = style.strong ? 2.5 : 1.5;
      this.g.beginPath();
      this.g.moveTo(M, this.y + h);
      this.g.lineTo(M + CW, this.y + h);
      this.g.stroke();
      this.y += h;
    };
    if (o.head) drawRow(o.head, { isHead: true, bold: true, bg: C.sunk, color: C.mute });
    rows.forEach((r, i) => drawRow(r.cells || r, r.style || { bg: o.zebra && i % 2 ? '#F7FAF9' : null }));
    this.y += 14;
  }
  status(kind, text) {
    const map = {
      ok: [C.ok, C.okSoft, '✓'],
      bad: [C.bad, C.badSoft, '✕'],
      warn: [C.warn, C.warnSoft, '!'],
      info: [C.teal2, C.sunk, 'i'],
    };
    const [fg, bg, sym] = map[kind] || map.info;
    const size = 18;
    const LH = 27;
    const ls = this.wrap(text, size, 400, CW - 48);
    const h = ls.length * LH + 6;
    this.ensure(h);
    const g = this.g;
    g.beginPath();
    g.arc(M + 14, this.y + 16, 13, 0, Math.PI * 2);
    g.fillStyle = bg;
    g.fill();
    g.fillStyle = fg;
    this.font(16, 700);
    g.textAlign = 'center';
    g.fillText(sym, M + 14, this.y + 22);
    g.textAlign = 'left';
    this.font(size, 400);
    g.fillStyle = C.ink;
    ls.forEach((l, j) => g.fillText(l, M + 44, this.y + size + 4 + j * LH));
    this.y += h + 6;
  }
}

// Assemble minimal PDF bytes from JPEG canvas images
function assemble(imgs) {
  const enc = new TextEncoder();
  const parts = [];
  const offs = [];
  let len = 0;
  const push = (x) => {
    const b = typeof x === 'string' ? enc.encode(x) : x;
    parts.push(b);
    len += b.length;
  };
  push(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));
  const obj = (n, body) => {
    offs[n] = len;
    push(`${n} 0 obj\n`);
    body();
    push('\nendobj\n');
  };
  const n = imgs.length;
  const info = 3 + 3 * n;
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push(`<< /Type /Pages /Kids [${imgs.map((_, i) => `${3 + 3 * i} 0 R`).join(' ')}] /Count ${n} >>`));
  imgs.forEach((im, i) => {
    const p = 3 + 3 * i;
    const c = p + 1;
    const x = p + 2;
    const cs = `q 595.28 0 0 841.89 0 0 cm /Im${i} Do Q`;
    obj(p, () =>
      push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${i} ${x} 0 R >> >> /Contents ${c} 0 R >>`
      )
    );
    obj(c, () => push(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`));
    obj(x, () => {
      push(
        `<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.bytes.length} >>\nstream\n`
      );
      push(im.bytes);
      push('\nendstream');
    });
  });
  obj(info, () => push('<< /Title (Subsidy Sathi Report) /Producer (Subsidy Sathi) >>'));
  const xref = len;
  const total = info + 1;
  let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, '0') + ' 00000 n \n';
  push(x + `trailer\n<< /Size ${total} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const out = new Uint8Array(len);
  let o = 0;
  parts.forEach((b) => {
    out.set(b, o);
    o += b.length;
  });
  return out;
}

const toJpeg = (c) =>
  new Promise((res, rej) =>
    c.toBlob(
      (b) =>
        b ? b.arrayBuffer().then((a) => res({ bytes: new Uint8Array(a), w: c.width, h: c.height }), rej) : rej(new Error('jpeg')),
      'image/jpeg',
      0.9
    )
  );

export async function generateSubsidyPdf(result) {
  try {
    await document.fonts.ready;
  } catch (e) {}

  const { inp, cat, cl, S, R, tot, rows, totCeil } = result;
  const d = TALUKAS[+inp.dist] || TALUKAS[0];
  const now = new Date();
  const dt = now.toLocaleDateString('en-GB').replace(/\//g, '.') + ' ' + now.toTimeString().slice(0, 5);
  const doc = new Doc(dt);
  const chk = getChecks(result);

  // Title
  doc.para('સબસિડી પાત્રતા અને અંદાજ અહેવાલ', { size: 34, w: 700, color: C.ink, gap: 4 });
  doc.para(
    `આધાર: MSME સહાય GR (25.09.2026), Large/Mega/Ultra Mega GR, તાલુકા વર્ગીકરણ GR (08.09.2026) · તારીખ ${dt}`,
    { size: 17, color: C.mute, gap: 18 }
  );

  // Grand summary
  doc.font(20, 600);
  doc.g.fillStyle = C.mute;
  doc.g.fillText('કુલ અંદાજિત નાણાકીય લાભ', M, doc.y + 20);
  doc.y += 30;
  doc.font(58, 700);
  doc.g.fillStyle = C.teal;
  doc.g.fillText(money(result.grand), M, doc.y + 58);
  doc.y += 80;

  doc.para(`${S.name} · ${SIZE_G[cl.size]} · ${cl.sector.g} · ${cat ? 'Category ' + cat : 'શ્રેણી પસંદ નથી'}`, {
    size: 20,
    w: 600,
    color: C.teal2,
    gap: 12,
  });

  doc.table(
    [{ w: 0.58 }, { w: 0.17, color: C.mute }, { w: 0.25, align: 'right', bold: true }],
    [
      ['કેપિટલ + વ્યાજ + પાવર (ઘટક 1–3)', `${S.years} વર્ષ`, money(tot.all)],
      ['EPF વળતર', `${result.epfYears} વર્ષ`, money(result.epfTotal)],
      ...(result.rentAnnual > 0
        ? [[`ભાડા સહાય (${Math.round(result.rentPct * 100)}% · ${rupees(result.rentAnnual)}/વર્ષ)`, '5 વર્ષ', money(result.rentTotal)]]
        : []),
      { cells: ['કુલ', '', money(result.grand)], style: { bold: true, strong: true } },
    ],
    { size: 20 }
  );

  // Components
  doc.heading('ઘટક 1–3: કેપિટલ, વ્યાજ, પાવર');
  doc.table(
    [{ w: 0.24, bold: true }, { w: 0.52, color: C.mute }, { w: 0.24, align: 'right', bold: true }],
    [
      [
        'કેપિટલ સબસિડી',
        inp.useCap ? `EFCI ના ${R.cap}%${cl.size === 'micro' ? ', પહેલા વર્ષે' : `, ${S.years} વર્ષમાં સમાન હપ્તે`}` : 'પસંદ કર્યો નથી',
        money(tot.c),
      ],
      [
        'વ્યાજ સબસિડી',
        inp.useInt ? `${R.int}%${result.bonus ? ' + 1%' : ''} ટર્મ લોન પર, મહત્તમ EFCI ના ${R.intCap}% = ${money(result.intCeil)}` : 'પસંદ કર્યો નથી',
        money(tot.i),
      ],
      [
        'પાવર ટેરિફ',
        inp.usePow ? `₹${R.pow}/યુનિટ, મહત્તમ EFCI ના ${R.powCap}% = ${money(result.powCeil)}` : 'પસંદ કર્યો નથી',
        money(tot.p),
      ],
      { cells: ['કુલ', `કુલ મર્યાદા EFCI ના ${R.total}% = ${money(totCeil)}`, money(tot.all)], style: { bold: true, strong: true } },
    ],
    { size: 18 }
  );

  // Conditions
  doc.heading('પાત્રતાની શરતો');
  chk.forEach(([k, t]) => doc.status(k, t));

  // Steps
  doc.heading('આગળનાં પગલાં');
  const steps = getSteps(result);
  steps.forEach((s, i) => doc.para(`${i + 1}. ${s}`, { size: 18, gap: 4 }));

  doc.footers();

  const imgs = [];
  for (const c of doc.pages) {
    imgs.push(await toJpeg(c));
  }

  const pdfBytes = assemble(imgs);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const filename = `Subsidy-Sathi-${(inp.tal || 'report').replace(/[^A-Za-z0-9]+/g, '-')}-${now.toISOString().slice(0, 10)}.pdf`;

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
