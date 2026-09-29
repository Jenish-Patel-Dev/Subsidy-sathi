import { TALUKAS, catOf } from '../data/talukas.js';
import { SECTORS } from '../data/sectors.js';
import { SCHEMES } from '../data/schemes.js';
import { money, pct } from './format.js';

export const SIZE_G = {
  micro: "માઇક્રો એન્ટરપ્રાઇઝ",
  small: "સ્મોલ એન્ટરપ્રાઇઝ",
  medium: "મીડિયમ એન્ટરપ્રાઇઝ",
  large: "લાર્જ ઔદ્યોગિક એકમ",
  mega: "મેગા ઔદ્યોગિક એકમ",
  ultra: "અલ્ટ્રા-મેગા ઔદ્યોગિક એકમ",
};

export const isMSME = (sz) => ["micro", "small", "medium"].includes(sz);

/* ======================= classification ======================= */
export function classify(inp) {
  const s = SECTORS.find((x) => x.id === inp.sector) || SECTORS[0];
  const pm = inp.pm;
  const gfciLarge = inp.land + inp.bld + inp.pm + inp.infra; // Large GR 1.14: includes land
  let size, key;
  const notes = [];
  if (pm <= 2.5) size = "micro";
  else if (pm <= 25) size = "small";
  else if (pm <= 125) size = "medium";
  else size = "large";

  if (size !== "large") {
    key = s.kind === "selected" ? "msme_sel" : "msme_gen";
    if (s.kind === "thrust") {
      notes.push([
        "info",
        "MSME યોજનામાં થ્રસ્ટ સેક્ટર માટે અલગ દર નથી; ફક્ત 5 પસંદગીના થ્રસ્ટ સેક્ટરને ઊંચા દર મળે છે. તેથી સામાન્ય MSME દર લાગુ.",
      ]);
    }
    return { size, key, sector: s, gfciLarge };
  }
  const megaReq = gfciLarge >= 1000 ? 250 + 50 * Math.floor((gfciLarge - 1000) / 200) : null;
  const ultraReq = gfciLarge >= 10000 ? 3000 + 500 * Math.floor((gfciLarge - 10000) / 5000) : null;
  if (s.kind === "general") {
    key = "large_gen";
    if (gfciLarge >= 1000) {
      notes.push([
        "info",
        "મેગા/અલ્ટ્રા-મેગા દરજ્જો ફક્ત થ્રસ્ટ અથવા પસંદગીના થ્રસ્ટ સેક્ટર માટે છે. ₹1,000 કરોડથી વધુ રોકાણ પણ સામાન્ય સેક્ટરમાં લાર્જ શ્રેણીમાં જ ગણાય (para 4-B v).",
      ]);
    }
  } else {
    const sel = s.kind === "selected";
    if (ultraReq !== null && inp.jobs >= ultraReq) {
      size = "ultra";
      key = sel ? "ultra_sel" : "ultra_thr";
    } else if (megaReq !== null && inp.jobs >= megaReq) {
      size = "mega";
      key = sel ? "mega_sel" : "mega_thr";
      if (ultraReq !== null) {
        notes.push([
          "warn",
          `અલ્ટ્રા-મેગા માટે ${ultraReq.toLocaleString("en-IN")} સીધી રોજગારી જોઈએ; તમારી ${inp.jobs.toLocaleString("en-IN")} છે. તેથી મેગા દર લાગુ.`,
        ]);
      }
    } else {
      key = sel ? "large_sel" : "large_thr";
      if (megaReq !== null) {
        notes.push([
          "warn",
          `મેગા દરજ્જા માટે ${money(gfciLarge)} રોકાણ પર ઓછામાં ઓછી ${megaReq.toLocaleString("en-IN")} સીધી રોજગારી જોઈએ (₹1,000 કરોડ પર 250, પછી દર ₹200 કરોડે +50). તમારી ${inp.jobs.toLocaleString("en-IN")} હોવાથી લાર્જ-${sel ? "પસંદગીના " : ""}થ્રસ્ટ દર લાગુ.`,
        ]);
      }
    }
  }
  return { size, key, sector: s, gfciLarge, megaReq, ultraReq, notes };
}

/* ======================= main computation ======================= */
export function compute(inp) {
  const cat = catOf(inp.tal);
  const cl = classify(inp);
  const msme = isMSME(cl.size);
  const S = SCHEMES[cl.key];
  const R = S[cat || "B"];

  // EFCI — MSME GR 1.11 (infra at 50%) · Large GR 1.15 (infra 100% inside premises, 20% outside)
  const infraFactor = msme ? 0.5 : (inp.infraIn ? 1 : 0.2);
  const efci = inp.bld + inp.pm + inp.infra * infraFactor;

  // bonus interest (MSME only: women / startup / first-generation)
  const bonus = msme && (inp.women || inp.startup || inp.firstgen) ? 1 : 0;
  const loanElig = Math.min(inp.loan, efci);
  const subRate = Math.max(0, Math.min(R.int + bonus, inp.rate - 2)) / 100; // unit bears ≥2%

  const N = S.years;
  const capTotal = inp.useCap ? (R.cap / 100) * efci : 0;
  const intCeil = (R.intCap / 100) * efci;
  const powCeil = (R.powCap / 100) * efci;
  const totCeil = (R.total / 100) * efci;
  let cumI = 0;
  let cumP = 0;
  let cumT = 0;
  const rows = [];

  for (let y = 1; y <= N; y++) {
    let c = 0;
    if (inp.useCap) {
      c = cl.size === "micro" ? (y === 1 ? capTotal : 0) : capTotal / N;
    }
    let i = 0;
    if (inp.useInt && y <= inp.tenure) {
      const out = loanElig * (1 - (y - 0.5) / inp.tenure);
      i = out * subRate;
    }
    i = Math.min(i, Math.max(0, intCeil - cumI));
    let p = inp.usePow ? (inp.units * R.pow) / 1e7 : 0;
    p = Math.min(p, Math.max(0, powCeil - cumP));

    const annPct = cl.size === "micro" ? (y === 1 ? R.annMicro[0] : R.annMicro[1]) : R.ann;
    let annCap = (annPct / 100) * efci;
    if (S.abs) annCap = Math.min(annCap, S.abs);
    const allowed = Math.max(0, Math.min(annCap, totCeil - cumT));
    // apply ceilings in order capital → interest → power; no carry forward
    let room = allowed;
    const c2 = Math.min(c, room);
    room -= c2;
    const i2 = Math.min(i, room);
    room -= i2;
    const p2 = Math.min(p, room);
    room -= p2;
    cumI += i2;
    cumP += p2;
    cumT += c2 + i2 + p2;
    rows.push({ y, c: c2, i: i2, p: p2, annCap, lost: c + i + p - (c2 + i2 + p2) });
  }

  const tot = rows.reduce(
    (a, r) => ({ c: a.c + r.c, i: a.i + r.i, p: a.p + r.p, lost: a.lost + r.lost }),
    { c: 0, i: 0, p: 0, lost: 0 }
  );
  tot.all = tot.c + tot.i + tot.p;

  // EPF — MSME GR 7.2 · Large GR 4 (iv) + 6-D
  const epfEach = (cap) => Math.min(0.12 * inp.wage, cap);
  const epfMonth = inp.em * epfEach(1800) + inp.ef * epfEach(2500) + inp.ed * epfEach(3000);
  const epfYears = S.epf;
  const epfTotal = (epfMonth * 12 * epfYears) / 1e7;

  return {
    inp,
    cat,
    cl,
    msme,
    S,
    R,
    efci,
    infraFactor,
    bonus,
    loanElig,
    subRate,
    rows,
    tot,
    totCeil,
    intCeil,
    powCeil,
    epfMonth,
    epfYears,
    epfTotal,
  };
}

/* ======================= eligibility checks ======================= */
export function getChecks(r) {
  const { inp, cl, msme } = r;
  const out = [];
  const [yy, mm] = (inp.docp || "2027-03").split("-").map(Number);
  const d = new Date(yy, (mm || 1) - 1, 1);
  const START = new Date(2026, 5, 1);
  const END = new Date(2031, 4, 31);
  const PREV = new Date(2027, 9, 4);

  if (d < START) {
    out.push([
      "bad",
      "01.06.2026 પહેલાં ઉત્પાદન શરૂ થયું હોય તો ફક્ત અગાઉની (આત્મનિર્ભર ગુજરાત) યોજના લાગુ પડે; આ યોજના પસંદ કરી શકાય નહીં.",
    ]);
  } else if (d > END) {
    out.push(["bad", "વાણિજ્યિક ઉત્પાદન 31.05.2031 સુધીમાં શરૂ થવું જરૂરી છે."]);
  } else {
    out.push(["ok", "DoCP યોજનાના અમલ સમયગાળા (01.06.2026 થી 31.05.2031) માં છે."]);
    if (d <= PREV) {
      out.push([
        "info",
        "તમે અગાઉની યોજના પણ પસંદ કરી શકો, પરંતુ તે માટે GR તારીખથી 6 મહિનામાં વિકલ્પ આપવો પડે અને 04.10.2027 સુધીમાં ઉત્પાદન શરૂ થવું જોઈએ. પસંદગી અફર છે.",
      ]);
    }
  }

  if (!r.cat) {
    out.push(["warn", "તાલુકા પસંદ કરો. હાલ Category-B ના દર બતાવ્યા છે."]);
  }

  if (inp.ptype !== "new") {
    const add = inp.bld + inp.pm + inp.infra;
    const ratio = inp.exist > 0 ? (add / inp.exist) * 100 : 0;
    const need = inp.ptype === "exp" ? 50 : msme && cl.size !== "medium" ? 25 : 50;
    const pmShare = add > 0 ? (inp.pm / add) * 100 : 0;
    out.push([
      ratio >= need ? "ok" : "bad",
      `${inp.ptype === "exp" ? "વિસ્તરણ" : "ડાયવર્સિફિકેશન"} માટે હાલના GFCI ના ઓછામાં ઓછા ${need}% નવું રોકાણ જોઈએ; તમારું ${pct(ratio)} છે.`,
    ]);
    out.push([
      pmShare >= 60 ? "ok" : "bad",
      `નવા રોકાણમાંથી ઓછામાં ઓછું 60% પ્લાન્ટ-મશીનરીમાં જોઈએ; તમારું ${pct(pmShare)} છે.`,
    ]);
    if (inp.ptype === "exp") {
      out.push([
        "info",
        "વિસ્તરણમાં સ્થાપિત ક્ષમતા ઓછામાં ઓછી 50% વધવી જોઈએ, અને છેલ્લાં 3 નાણાકીય વર્ષમાંથી કોઈ એકમાં હાલની ક્ષમતાનો 75% ઉપયોગ થયેલો હોવો જોઈએ.",
      ]);
    }
    out.push(["info", "પાવર ટેરિફ ફક્ત વધારાના વપરાશ પર મળે; સબ-મીટર લગાવવું પડે. EPF ફક્ત વધારાના કર્મચારીઓ પર."]);
  }

  if (!msme && cl.sector.etp) {
    out.push(["warn", "કેમિકલ અને ફાર્મા એકમો માટે પૂર્વશરત: પોતાનો ETP અથવા CETP ની સુવિધા હોવી જરૂરી."]);
  }

  (cl.notes || []).forEach((n) => out.push(n));

  if (r.S.hpc) {
    out.push(["info", "મેગા/અલ્ટ્રા-મેગા પ્રોજેક્ટ માટે મુખ્યમંત્રીના અધ્યક્ષપદ હેઠળની High Power Committee કસ્ટમાઇઝ્ડ પેકેજ નક્કી કરી શકે."]);
  }

  if (inp.loan > r.efci && inp.useInt) {
    out.push(["info", `વ્યાજ સબસિડી ફક્ત EFCI માટે વિતરિત લોન પર મળે; ગણતરીમાં લોન ${money(r.efci)} સુધી લીધી છે.`]);
  }

  if (inp.useInt && inp.rate - 2 < r.R.int + r.bonus) {
    out.push(["info", `એકમે ઓછામાં ઓછું 2% વ્યાજ ભોગવવું પડે, તેથી અસરકારક વ્યાજ સબસિડી ${pct(r.subRate * 100)} ગણી છે.`]);
  }

  out.push(["info", "કુલ કર્મચારીઓમાં ઓછામાં ઓછા 85% અને મેનેજર/સુપરવાઇઝરમાં 60% ગુજરાતના નિવાસી હોવા જોઈએ."]);
  out.push(["info", "આ જ GFCI પર રાજ્યની બીજી કોઈ યોજનામાંથી સહાય લીધી હોય તો પાત્ર નથી. કેન્દ્ર + રાજ્યની કુલ સહાય EFCI થી વધવી ન જોઈએ."]);

  return out;
}

/* ======================= next steps ======================= */
export function getSteps(r) {
  const { inp, cl, msme } = r;
  const invP = msme
    ? inp.pm <= 50
      ? "DoCP પછી 12 મહિના"
      : "DoCP પછી 18 મહિના"
    : cl.gfciLarge <= 1000
    ? "DoCP પછી 18 મહિના"
    : cl.gfciLarge <= 10000
    ? "DoCP પછી 24 મહિના"
    : cl.gfciLarge <= 100000
    ? "DoCP પછી 36 મહિના"
    : "DoCP પછી 48 મહિના";

  if (msme) {
    return [
      `01.01.2026 પછી ખરીદેલી અને ચૂકવેલી અસ્કયામતો જ EFCI માં ગણાય; રોકાણનો સમયગાળો ${invP} સુધી.`,
      "Udyam Registration / IEM અથવા જરૂરી લાઇસન્સ મેળવો.",
      "ઉત્પાદન શરૂ થયાથી (પ્રથમ વેચાણ બિલ) 6 મહિનામાં Provisional Eligibility Certificate (PEC) માટે અરજી કરો. PEC EFCI ના 40% સુધી મળે.",
      "રોકાણ પૂરું થયે 6 મહિનામાં Final Eligibility Certificate (FEC). મોડું થાય તો 2 વર્ષ સુધી પ્રમાણસર કપાત સાથે; પછી અરજી માન્ય નથી.",
      `મંજૂરી: ${cl.size === "medium" ? "MSME કમિશનર" : "જનરલ મેનેજર, જિલ્લા ઉદ્યોગ કેન્દ્ર (GM-DIC)"}. GPCB પ્રમાણપત્ર જરૂરી.`,
      "સહાયના સમયગાળા સુધી ઉત્પાદન સતત ચાલુ રાખવું પડે; શરતભંગ પર 18% વ્યાજ સાથે વસૂલાત.",
    ];
  }

  const comm =
    cl.gfciLarge <= 1000
      ? "₹1,000 કરોડ સુધીની સમિતિ"
      : cl.gfciLarge <= 10000
      ? "₹1,000–10,000 કરોડની સમિતિ"
      : "₹10,000 કરોડથી વધુની સમિતિ";

  return [
    "ઉદ્યોગ કમિશનર પાસે નોંધણી (Registration) ફરજિયાત: DoCP પહેલાં અથવા GR તારીખથી 3 મહિનામાં, જે મોડું હોય. પછી નોંધણી માન્ય નથી.",
    `01.01.2026 પછી ખરીદેલી અને ચૂકવેલી અસ્કયામતો જ ગણાય; રોકાણનો સમયગાળો ${invP} સુધી.`,
    "DoCP થી 3 મહિનામાં PEC (EFCI ના 40% સુધી) અથવા સીધું FEC માટે અરજી.",
    "રોકાણ પૂરું થયે 3 મહિનામાં FEC. મોડું થાય તો 1 વર્ષ સુધી પ્રમાણસર કપાત; પછી અરજી માન્ય નથી.",
    `FEC મંજૂરી: ${comm}. દાવા દર 3 મહિને ઉદ્યોગ કમિશનરને.`,
    "નીતિ સમયગાળામાં એક એકમ વધુમાં વધુ 2 વખત સહાય લઈ શકે.",
  ];
}
