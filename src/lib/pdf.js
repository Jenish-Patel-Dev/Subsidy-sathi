import { TALUKAS } from '../data/talukas.js';
import { SIZE_G, getChecks, getSteps } from './calc.js';
import { getOtherList } from '../data/other.js';
import { money, rupees, pct } from './format.js';

const PW = 1240;
const PH = 1754;
const M = 76;
const CW = PW - 2 * M;
const HEAD = 118;
const FOOT = 86;

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
  constructor(title, logoImg = null) {
    this.pages = [];
    this.title = title;
    this.logoImg = logoImg;
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
    this.watermark();
    this.header();
    this.y = HEAD + 36;
    if (this.onNewPage) this.onNewPage();
  }
  watermark() {
    const g = this.g;
    g.save();
    g.translate(PW / 2, PH / 2);
    // Slope from bottom-left corner to top-right corner (negative angle)
    g.rotate(Math.atan2(-PH, PW));
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `700 70px ${FF}`;
    g.fillStyle = 'rgba(14, 75, 71, 0.075)';
    g.fillText('સબસિડી સાથી · SUBSIDY SATHI', 0, 0);
    g.restore();
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
  icon(x, y, s, bg, fg, stripe) {
    const g = this.g;
    g.save();
    g.translate(x, y);
    g.scale(s / 128, s / 128);
    this.rr(0, 0, 128, 128, 30, bg);
    g.fillStyle = fg;
    g.fill(new Path2D('M20 100 V80 L44 68 V80 L68 58 V80 L92 48 V100 Z'));
    this.rr(20, 100, 88, 6, 3, stripe);
    g.beginPath();
    g.arc(98, 30, 15, 0, Math.PI * 2);
    g.fillStyle = C.int;
    g.fill();
    g.strokeStyle = bg === '#FFFFFF' ? '#FFFFFF' : bg;
    g.lineWidth = 4.2;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(90.5, 30.5);
    g.lineTo(96, 36);
    g.lineTo(106, 25.5);
    g.stroke();
    g.restore();
  }
  header() {
    const g = this.g;
    g.fillStyle = C.teal;
    g.fillRect(0, 0, PW, HEAD);

    g.textBaseline = 'alphabetic';

    // Draw application's official brand name logo
    if (this.logoImg) {
      const logoH = 76;
      const aspect = (this.logoImg.naturalWidth || this.logoImg.width || 3.17) / (this.logoImg.naturalHeight || this.logoImg.height || 1);
      const logoW = Math.round(logoH * aspect);
      const logoY = Math.round((HEAD - logoH) / 2);
      g.drawImage(this.logoImg, M, logoY, logoW, logoH);

      const textX = M + logoW + 26;
      g.fillStyle = '#FFFFFF';
      this.font(23, 700);
      g.fillText('વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026', textX, 58);
      g.fillStyle = C.head;
      this.font(17, 500);
      g.fillText('સહાય અને પ્રોત્સાહન અંદાજ અહેવાલ', textX, 90);
    } else {
      this.icon(M, 27, 64, '#FFFFFF', C.teal, C.teal2);
      g.fillStyle = '#FFFFFF';
      this.font(34, 700);
      g.fillText('સબસિડી સાથી', M + 96, 62);
      g.fillStyle = C.head;
      this.font(19, 500);
      g.fillText('Subsidy Sathi · વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026 · સહાય અંદાજ અહેવાલ', M + 96, 94);
    }

    // Right-aligned report generation time
    g.fillStyle = '#FFFFFF';
    this.font(18, 500);
    g.textAlign = 'right';
    g.fillText(this.title, PW - M, 60);
    g.textAlign = 'left';
  }
  footers() {
    const n = this.pages.length;
    this.pages.forEach((c, i) => {
      const g = c.getContext('2d');
      g.strokeStyle = C.line;
      g.lineWidth = 1.8;
      g.beginPath();
      g.moveTo(M, PH - FOOT);
      g.lineTo(PW - M, PH - FOOT);
      g.stroke();

      // Row 1: Legal disclaimer & Page numbering
      g.fillStyle = C.mute;
      g.font = `400 15px ${FF}`;
      g.textBaseline = 'alphabetic';
      g.fillText(
        'આ સરકારી દસ્તાવેજ નથી. ત્રણ GR પર આધારિત સૂચક અંદાજ; મંજૂરી કે ખાતરી નથી. અંતિમ નિર્ણય મંજૂરી સત્તાધિકારીનો.',
        M,
        PH - FOOT + 28
      );
      g.textAlign = 'right';
      g.fillText(`પાનું ${i + 1} / ${n}`, PW - M, PH - FOOT + 28);

      // Row 2: Developer & Contact info
      g.textAlign = 'left';
      g.fillStyle = C.ink;
      g.font = `500 14px ${FF}`;
      g.fillText('Designed & Developed by Naresh Khambhaliya & Jenish Khambhaliya', M, PH - FOOT + 56);
      g.textAlign = 'right';
      g.fillStyle = C.teal2;
      g.fillText('Contact: jgpatel8080@gmail.com', PW - M, PH - FOOT + 56);
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
    this.font(27, 700);
    this.g.fillStyle = C.teal;
    this.g.fillText(strip(t), M, this.y + 27);
    this.y += 42;
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
          } else {
            this.g.fillText(l, xs[k] + PAD, yy);
          }
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
  box(text, fg, bg) {
    const size = 19;
    const LH = 29;
    const ls = this.wrap(text, size, 600, CW - 40);
    const h = ls.length * LH + 26;
    this.ensure(h);
    this.rr(M, this.y, CW, h, 10, bg);
    this.font(size, 600);
    this.g.fillStyle = fg;
    ls.forEach((l, j) => this.g.fillText(l, M + 20, this.y + 13 + size + j * LH));
    this.y += h + 14;
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

export async function generateSubsidyPdf(result, firm = '') {
  try {
    await Promise.all([
      document.fonts.load('400 20px "Noto Sans Gujarati"'),
      document.fonts.load('700 20px "Noto Sans Gujarati"'),
    ]);
    await document.fonts.ready;
  } catch (e) {}

  // Load application's official brand logo
  const loadLogo = async () => {
    const tryLoad = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    let img = await tryLoad('/logo-dark.png');
    if (!img) img = await tryLoad('/logo-light.png');
    if (!img) img = await tryLoad('/favicon.png');
    return img;
  };

  let appLogoImg = null;
  try {
    appLogoImg = await loadLogo();
  } catch (e) {}

  const r = result;
  const { inp, cat, cl, S, R, tot, rows, totCeil } = r;
  const d = TALUKAS[+inp.dist] || TALUKAS[0];
  const now = new Date();
  const dt = now.toLocaleDateString('en-GB').replace(/\//g, '.') + ' ' + now.toTimeString().slice(0, 5);
  const doc = new Doc(dt, appLogoImg);
  const firmClean = (firm || inp.firm || '').trim();
  const chk = getChecks(r);
  const blocked = chk.some((c) => c[0] === 'bad');

  // Title
  if (firmClean) doc.para(firmClean, { size: 38, w: 700, color: C.ink, gap: 2 });
  doc.para('સબસિડી પાત્રતા અને અંદાજ અહેવાલ', {
    size: firmClean ? 24 : 36,
    w: firmClean ? 500 : 700,
    color: firmClean ? C.mute : C.ink,
    gap: 4,
  });
  doc.para(
    `આધાર: MSME સહાય GR (25.09.2026), Large/Mega/Ultra Mega GR, તાલુકા વર્ગીકરણ GR (08.09.2026) · બનાવ્યા તારીખ ${dt}`,
    { size: 17, color: C.mute, gap: 18 }
  );

  // Summary
  if (blocked) {
    doc.box(
      'ભરેલી વિગતો મુજબ કેટલીક પાત્રતા શરતો પૂરી થતી નથી (પાનાં પર ✕ જુઓ). નીચેની રકમ ફક્ત સમજ માટે છે.',
      C.bad,
      C.badSoft
    );
  }
  doc.ensure(150);
  doc.font(20, 600);
  doc.g.fillStyle = C.mute;
  doc.g.fillText('કુલ અંદાજિત નાણાકીય લાભ', M, doc.y + 20);
  doc.y += 30;
  doc.font(60, 700);
  doc.g.fillStyle = C.teal;
  doc.g.fillText(money(r.grand), M, doc.y + 60);
  doc.y += 82;

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
      ['EPF વળતર', `${r.epfYears} વર્ષ`, money(r.epfTotal)],
      ...(r.rentAnnual > 0
        ? [[`ભાડા સહાય (${Math.round(r.rentPct * 100)}% · ${rupees(r.rentAnnual)}/વર્ષ)`, '5 વર્ષ', money(r.rentTotal)]]
        : []),
      { cells: ['કુલ', '', money(r.grand)], style: { bold: true, strong: true } },
    ],
    { size: 20 }
  );

  // Components + bar
  doc.heading('ઘટક 1–3: કેપિટલ, વ્યાજ, પાવર');
  doc.table(
    [{ w: 0.24, bold: true }, { w: 0.52, color: C.mute }, { w: 0.24, align: 'right', bold: true }],
    [
      [
        'કેપિટલ સબસિડી',
        inp.useCap
          ? `EFCI ના ${R.cap}%${cl.size === 'micro' ? ', પહેલા વર્ષે' : `, ${S.years} વર્ષમાં સમાન હપ્તે`}`
          : 'પસંદ કર્યો નથી',
        money(tot.c),
      ],
      [
        'વ્યાજ સબસિડી',
        inp.useInt
          ? `${R.int}%${r.bonus ? ' + 1%' : ''} ટર્મ લોન પર (અસરકારક ${pct(r.subRate * 100)}), મહત્તમ EFCI ના ${R.intCap}% = ${money(r.intCeil)}`
          : 'પસંદ કર્યો નથી',
        money(tot.i),
      ],
      [
        'પાવર ટેરિફ',
        inp.usePow ? `₹${R.pow}/યુનિટ, મહત્તમ EFCI ના ${R.powCap}% = ${money(r.powCeil)}` : 'પસંદ કર્યો નથી',
        money(tot.p),
      ],
      {
        cells: ['કુલ', `કુલ મર્યાદા EFCI ના ${R.total}% = ${money(totCeil)}`, money(tot.all)],
        style: { bold: true, strong: true },
      },
    ],
    { size: 18 }
  );
  doc.ensure(70);
  {
    const W = Math.max(totCeil, tot.all, 1e-9);
    const g = doc.g;
    const y = doc.y;
    const h = 26;
    let x = M;
    doc.rr(M, y, CW, h, 6, C.sunk);
    [
      [tot.c, C.cap],
      [tot.i, C.int],
      [tot.p, C.pow],
    ].forEach(([v, col]) => {
      const w = (v / W) * CW;
      if (w > 0) {
        g.fillStyle = col;
        g.fillRect(x, y, w, h);
        x += w;
      }
    });
    const cx = M + (totCeil / W) * CW;
    g.fillStyle = C.ink;
    g.fillRect(cx - 2, y - 6, 3, h + 12);
    doc.y += h + 12;
    let lx = M;
    doc.font(15, 500);
    [
      ['કેપિટલ', C.cap],
      ['વ્યાજ', C.int],
      ['પાવર', C.pow],
    ].forEach(([t, col]) => {
      g.fillStyle = col;
      g.fillRect(lx, doc.y + 3, 14, 14);
      g.fillStyle = C.mute;
      g.fillText(t, lx + 20, doc.y + 15);
      lx += 34 + g.measureText(t).width;
    });
    g.fillStyle = C.ink;
    g.fillRect(lx + 4, doc.y, 3, 20);
    g.fillStyle = C.mute;
    g.fillText('કુલ મર્યાદા', lx + 14, doc.y + 15);
    doc.y += 32;
  }
  doc.para(
    `EFCI ${money(r.efci)} = બિલ્ડિંગ ${money(inp.bld)} + P&M ${money(inp.pm)} + ઇન્ફ્રાના ${r.infraFactor * 100}%. જમીન EFCI માં ગણાતી નથી.${tot.lost > 1e-5 ? ` વાર્ષિક/કુલ મર્યાદાને કારણે ${money(tot.lost)} મળવાપાત્ર નથી.` : ''}`,
    { size: 17, color: C.mute }
  );
  if (r.bonusInfo) doc.para(r.bonusInfo.why, { size: 17, color: C.ink });
  if (r.rentNote) doc.para(r.rentNote, { size: 17, color: C.warn });

  // Year table
  doc.heading('વર્ષવાર વિતરણ', 320);
  doc.table(
    [
      { w: 0.1 },
      { w: 0.18, align: 'right' },
      { w: 0.18, align: 'right' },
      { w: 0.18, align: 'right' },
      { w: 0.18, align: 'right', bold: true },
      { w: 0.18, align: 'right', color: C.mute },
    ],
    [
      ...rows.map((x) => [
        String(x.y),
        money(x.c),
        money(x.i),
        money(x.p),
        money(x.c + x.i + x.p),
        money(x.annCap),
      ]),
      {
        cells: ['કુલ', money(tot.c), money(tot.i), money(tot.p), money(tot.all), money(totCeil)],
        style: { bold: true, strong: true },
      },
    ],
    { size: 17, zebra: true, head: ['વર્ષ', 'કેપિટલ', 'વ્યાજ', 'પાવર', 'કુલ', 'વાર્ષિક મર્યાદા'] }
  );
  doc.para(
    'વાર્ષિક મર્યાદા નડે ત્યાં ગણતરી પહેલા કેપિટલ, પછી વ્યાજ, પછી પાવર ગણે છે; વધેલી રકમ આગળ લઈ જવાતી નથી. વ્યાજ: મુદ્દલ સમાન હપ્તે ચૂકવાય એમ માનીને. (' +
      S.ref +
      ')',
    { size: 16, color: C.mute }
  );

  // EPF
  doc.heading('EPF વળતર');
  doc.para(
    `${money(r.epfTotal)} · ${r.epfYears} વર્ષમાં · ${rupees(r.epfMonth)} પ્રતિ માસ. નવા કર્મચારીઓ (UAN વગરના) પર નોકરીદાતાના EPF ફાળાના 100%, પ્રતિ કર્મચારી માસિક 12% (બેઝિક+DA) અથવા પુરુષ ₹1,800 / મહિલા ₹2,500 / દિવ્યાંગ ₹3,000, જે ઓછું હોય. દર્શાવેલા બધા કર્મચારી આખો સમયગાળો ચાલુ રહે એમ માન્યું છે.`,
    { size: 18 }
  );

  // Inputs
  doc.heading('તમે ભરેલી વિગતો');
  const flags = [
    inp.women && 'મહિલા ઉદ્યમી',
    inp.women100 && '100% મહિલા ઇક્વિટી',
    inp.startup && 'રજિસ્ટર્ડ સ્ટાર્ટઅપ',
    inp.firstgen && 'પ્રથમ પેઢી',
  ].filter(Boolean);
  const ptype = { new: 'નવો એકમ', exp: 'વિસ્તરણ', div: 'ડાયવર્સિફિકેશન' }[inp.ptype];
  const [yy, mm] = (inp.docp || '').split('-');
  doc.table(
    [{ w: 0.4, color: C.mute }, { w: 0.6, bold: true }],
    [
      ...(firmClean ? [['પેઢી / પ્રોજેક્ટ', firmClean]] : []),
      ['જિલ્લો / તાલુકા', `${d[1]} (${d[0]}) / ${inp.tal}${cat ? ` · Category ${cat}` : ''}`],
      [
        'ઉત્પાદન ક્ષેત્ર',
        `${cl.sector.g} (${{ general: 'સામાન્ય', thrust: 'થ્રસ્ટ સેક્ટર', selected: 'પસંદગીનું થ્રસ્ટ સેક્ટર' }[cl.sector.kind]})`,
      ],
      ['પ્રોજેક્ટ પ્રકાર', ptype + (inp.ptype !== 'new' ? ` · હાલનું GFCI ${money(inp.exist)}` : '')],
      ['અપેક્ષિત DoCP', mm ? `${mm}/${yy}` : '—'],
      ['પ્લાન્ટ અને મશીનરી', money(inp.pm) + (inp.otherPM > 0 ? ` · હાલના/અન્ય એકમોમાં ${money(inp.otherPM)}` : '')],
      ['નવું બિલ્ડિંગ + અન્ય બાંધકામ', money(inp.bld)],
      ['પ્રોજેક્ટ ઇન્ફ્રા', `${money(inp.infra)} · ${inp.infraIn ? 'પરિસરની અંદર' : 'પરિસરની બહાર'}`],
      ['જમીન', money(inp.land)],
      ['EFCI (ગણતરી)', money(r.efci)],
      ['ટર્મ લોન', inp.loan > 0 ? `${money(inp.loan)} · ${pct(inp.rate)} · ${inp.tenure} વર્ષ` : 'નથી'],
      ['કેન્દ્રની સહાય', inp.goiInt > 0 || inp.goiCap > 0 ? `વ્યાજ ${pct(inp.goiInt)} · કેપિટલ ${money(inp.goiCap)}` : 'નથી'],
      ['વાર્ષિક વીજ વપરાશ', `${inp.units.toLocaleString('en-IN')} યુનિટ`],
      ['કુલ સીધી રોજગારી', inp.jobs.toLocaleString('en-IN')],
      ['નવા કર્મચારી (પુ. / મ. / દિ.)', `${inp.em} / ${inp.ef} / ${inp.ed} · સરેરાશ બેઝિક+DA ${rupees(inp.wage)}/માસ`],
      ['ઉદ્યમી', flags.length ? flags.join(', ') : '—'],
      ['GIDC / માન્ય પાર્કની બહાર', inp.outGidc ? 'હા' : 'ના'],
      ['ભાડાના શેડનું માસિક ભાડું', inp.rent > 0 ? rupees(inp.rent) : 'નથી'],
      ['પસંદ કરેલા ઘટક', [inp.useCap && 'કેપિટલ', inp.useInt && 'વ્યાજ', inp.usePow && 'પાવર'].filter(Boolean).join(', ') || 'કોઈ નહીં'],
    ],
    { size: 18, zebra: true }
  );

  // Conditions
  doc.heading('પાત્રતાની શરતો');
  chk.forEach(([k, t]) => doc.status(k, t));

  // Other assistance
  const oth = getOtherList(r);
  if (oth.length) {
    doc.heading('લાગુ પડતી અન્ય સહાય', 320);
    doc.table(
      [{ w: 0.27, bold: true }, { w: 0.43 }, { w: 0.3, color: C.mute }],
      oth.map((o) => [o[0] + (o[4] ? ` (${o[4]})` : ''), o[1], [o[2], o[3]].filter(Boolean).join(' · ')]),
      { size: 17, zebra: true, head: ['સહાય', 'વિગત', 'મર્યાદા / શરત'] }
    );
  }

  // Steps
  doc.heading('આગળનાં પગલાં');
  const stepsList = getSteps(r);
  stepsList.forEach((s, i) => doc.para(`${i + 1}. ${s}`, { size: 18, gap: 4 }));

  // Disclaimer
  doc.heading('અસ્વીકરણ');
  [
    'સબસિડી સાથી ખાનગી, માહિતીલક્ષી સાધન છે; ગુજરાત સરકાર, ઉદ્યોગ કમિશનરેટ, MSME કમિશનરેટ કે DIC દ્વારા બનાવાયેલું, મંજૂર કે તેમની સાથે જોડાયેલું નથી.',
    'આ અહેવાલની રકમ ભરેલી વિગતો પરથી ગણાયેલો સૂચક અંદાજ છે; મંજૂરી, ખાતરી કે PEC/FEC નથી. વાસ્તવિક સહાય Asset Verification, બજેટ અને મંજૂરી સત્તાધિકારીના નિર્ણય પર આધાર રાખે છે.',
    'સત્તાવાર GR અને સરકારનું અર્થઘટન સર્વોપરી છે. ગણતરીમાં બિલ્ડિંગની SOR મર્યાદા, ટેક્નોલોજીની 10% મર્યાદા જેવી વિગતો લાગુ કરી નથી.',
    'આ કાનૂની, કર કે નાણાકીય સલાહ નથી. નિર્ણય પહેલાં ચાર્ટર્ડ એકાઉન્ટન્ટ, સલાહકાર કે સંબંધિત DIC/કમિશનરેટ પાસેથી ખાતરી કરો. અરજીની સમયમર્યાદા સત્તાવાર રીતે ચકાસો.',
  ].forEach((t) => doc.para('• ' + t, { size: 16, color: C.mute, gap: 2 }));

  doc.footers();

  const imgs = [];
  for (const c of doc.pages) {
    imgs.push(await toJpeg(c));
  }

  const filename = `Subsidy-Sathi-${(inp.tal || 'report').replace(/[^A-Za-z0-9]+/g, '-')}-${now.toISOString().slice(0, 10)}.pdf`;
  const pdfBytes = assemble(imgs);

  return { bytes: pdfBytes, filename, pages: doc.pages.length };
}

export async function savePdfBlob({ filename, bytes }) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 1500);
}
