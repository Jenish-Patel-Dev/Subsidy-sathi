import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import { compute, classify, getChecks, getSteps, isMSME } from '../src/lib/calc.js';
import { getOtherList } from '../src/data/other.js';
import { TALUKAS } from '../src/data/talukas.js';
import { SECTORS } from '../src/data/sectors.js';
import { SCHEMES } from '../src/data/schemes.js';
import { money, rupees, pct } from '../src/lib/format.js';

// Read original HTML script to run side-by-side
const html = fs.readFileSync('subsidy-sathi.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  throw new Error('Could not find script block in subsidy-sathi.html');
}

// Prepare original environment
const originalScript = scriptMatch[1];
const sandbox = {
  console,
  Math,
  Date,
  isFinite,
  parseFloat,
  String,
  Object,
  Array,
};
vm.createContext(sandbox);

// Execute data and logic up to helper functions in sandbox
vm.runInContext(`
${originalScript.slice(0, originalScript.indexOf('/* ======================= form setup ======================= */'))}
globalThis.rupees = rupees;
globalThis.pct = pct;
`, sandbox);

console.log('Original sandbox initialized successfully.');

const testCases = [
  {
    name: '1. Default Small MSME (Botad, t5)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't5',
      ptype: 'new',
      exist: 10,
      docp: '2027-03',
      pm: 6,
      bld: 2,
      infra: 0.2,
      land: 0.5,
      infraIn: true,
      loan: 6,
      rate: 10,
      tenure: 7,
      units: 800000,
      jobs: 40,
      wage: 15000,
      em: 30,
      ef: 10,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '2. Micro MSME (pm <= 2.5)',
    inp: {
      dist: '0',
      tal: 'Dholera',
      sector: 'gen',
      ptype: 'new',
      exist: 0,
      docp: '2027-06',
      pm: 1.5,
      bld: 0.8,
      infra: 0.1,
      land: 0.2,
      infraIn: true,
      loan: 1.2,
      rate: 9,
      tenure: 5,
      units: 200000,
      jobs: 15,
      wage: 12000,
      em: 10,
      ef: 5,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: false,
      rent: 15000,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '3. Medium MSME (pm <= 125)',
    inp: {
      dist: '5',
      tal: 'Netrang',
      sector: 't7',
      ptype: 'new',
      exist: 0,
      docp: '2028-01',
      pm: 60,
      bld: 20,
      infra: 4,
      land: 10,
      infraIn: true,
      loan: 50,
      rate: 8.5,
      tenure: 8,
      units: 2500000,
      jobs: 150,
      wage: 16000,
      em: 100,
      ef: 40,
      ed: 10,
      women: true,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '4. Large General Sector (pm > 125, general sector)',
    inp: {
      dist: '1',
      tal: 'Rajula',
      sector: 'gen',
      ptype: 'new',
      exist: 0,
      docp: '2027-12',
      pm: 180,
      bld: 50,
      infra: 10,
      land: 20,
      infraIn: true,
      loan: 120,
      rate: 9.5,
      tenure: 10,
      units: 6000000,
      jobs: 220,
      wage: 18000,
      em: 150,
      ef: 70,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '5. Large Thrust Sector (pm > 125, thrust sector, jobs < mega)',
    inp: {
      dist: '15',
      tal: 'Mundra',
      sector: 't1',
      ptype: 'new',
      exist: 0,
      docp: '2028-05',
      pm: 250,
      bld: 80,
      infra: 15,
      land: 30,
      infraIn: false,
      loan: 200,
      rate: 9.0,
      tenure: 8,
      units: 12000000,
      jobs: 200,
      wage: 20000,
      em: 140,
      ef: 60,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '6. Mega Thrust Sector (gfci >= 1000, jobs >= megaReq)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't2',
      ptype: 'new',
      exist: 0,
      docp: '2029-03',
      pm: 600,
      bld: 250,
      infra: 100,
      land: 150,
      infraIn: true,
      loan: 600,
      rate: 8.5,
      tenure: 10,
      units: 20000000,
      jobs: 300,
      wage: 22000,
      em: 200,
      ef: 100,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '7. Ultra-Mega Thrust Sector (gfci >= 10000, jobs >= ultraReq)',
    inp: {
      dist: '13',
      tal: 'Jodiya',
      sector: 't3',
      ptype: 'new',
      exist: 0,
      docp: '2030-01',
      pm: 6000,
      bld: 2500,
      infra: 1000,
      land: 1000,
      infraIn: true,
      loan: 6000,
      rate: 8.0,
      tenure: 12,
      units: 80000000,
      jobs: 3200,
      wage: 25000,
      em: 2200,
      ef: 1000,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '8. Expansion Project (ptype: exp)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't5',
      ptype: 'exp',
      exist: 8,
      docp: '2027-03',
      pm: 5,
      bld: 2,
      infra: 0.5,
      land: 1,
      infraIn: true,
      loan: 4,
      rate: 10,
      tenure: 6,
      units: 500000,
      jobs: 30,
      wage: 15000,
      em: 20,
      ef: 10,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '9. Diversification Project (ptype: div)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't5',
      ptype: 'div',
      exist: 15,
      docp: '2027-03',
      pm: 4,
      bld: 1,
      infra: 0.2,
      land: 0.5,
      infraIn: true,
      loan: 3,
      rate: 9.5,
      tenure: 5,
      units: 400000,
      jobs: 25,
      wage: 14000,
      em: 15,
      ef: 10,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '10. MSME with Women + Startup + Firstgen, rent > 0, 100% women equity',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't5',
      ptype: 'new',
      exist: 0,
      docp: '2027-03',
      pm: 2,
      bld: 0.5,
      infra: 0.1,
      land: 0,
      infraIn: true,
      loan: 1.5,
      rate: 9,
      tenure: 5,
      units: 150000,
      jobs: 20,
      wage: 15000,
      em: 10,
      ef: 10,
      ed: 0,
      women: true,
      women100: true,
      startup: true,
      firstgen: true,
      outGidc: true,
      rent: 25000,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
  {
    name: '11. Zero Loan (loan = 0)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 't5',
      ptype: 'new',
      exist: 0,
      docp: '2027-03',
      pm: 5,
      bld: 2,
      infra: 0.2,
      land: 0.5,
      infraIn: true,
      loan: 0,
      rate: 0,
      tenure: 1,
      units: 300000,
      jobs: 20,
      wage: 15000,
      em: 15,
      ef: 5,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: false,
      usePow: true,
    },
  },
  {
    name: '12. Selected Thrust Sector MSME (s1 - Sports Goods)',
    inp: {
      dist: '7',
      tal: 'Botad',
      sector: 's1',
      ptype: 'new',
      exist: 0,
      docp: '2027-03',
      pm: 4,
      bld: 2,
      infra: 0.5,
      land: 0.5,
      infraIn: true,
      loan: 4,
      rate: 9.5,
      tenure: 6,
      units: 400000,
      jobs: 30,
      wage: 15000,
      em: 20,
      ef: 10,
      ed: 0,
      women: false,
      women100: false,
      startup: false,
      firstgen: false,
      outGidc: true,
      rent: 0,
      useCap: true,
      useInt: true,
      usePow: true,
    },
  },
];

console.log(`Running tests for ${testCases.length} cases...`);

// Define computeOriginal inside sandbox once
vm.runInContext(`
  function computeOriginal(inpTest) {
    const cat = catOf(inpTest.tal);
    const cl = classify(inpTest);
    const msme = isMSME(cl.size);
    const S = SCHEMES[cl.key];
    const R = S[cat || "B"];
    const infraFactor = msme ? 0.5 : (inpTest.infraIn ? 1 : 0.2);
    const efci = inpTest.bld + inpTest.pm + inpTest.infra * infraFactor;
    const bonus = msme && (inpTest.women || inpTest.startup || inpTest.firstgen) ? 1 : 0;
    const loanElig = Math.min(inpTest.loan, efci);
    const subRate = Math.max(0, Math.min(R.int + bonus, inpTest.rate - 2)) / 100;

    const N = S.years;
    const capTotal = inpTest.useCap ? R.cap/100 * efci : 0;
    const intCeil = R.intCap/100 * efci, powCeil = R.powCap/100 * efci, totCeil = R.total/100 * efci;
    let cumI = 0, cumP = 0, cumT = 0;
    const rows = [];
    for(let y = 1; y <= N; y++){
      let c = 0;
      if(inpTest.useCap){ c = cl.size === "micro" ? (y === 1 ? capTotal : 0) : capTotal / N; }
      let i = 0;
      if(inpTest.useInt && y <= inpTest.tenure){ const out = loanElig * (1 - (y - 0.5)/inpTest.tenure); i = out * subRate; }
      i = Math.min(i, Math.max(0, intCeil - cumI));
      let p = inpTest.usePow ? inpTest.units * R.pow / 1e7 : 0;
      p = Math.min(p, Math.max(0, powCeil - cumP));

      let annPct = cl.size === "micro" ? (y === 1 ? R.annMicro[0] : R.annMicro[1]) : R.ann;
      let annCap = annPct/100 * efci;
      if(S.abs) annCap = Math.min(annCap, S.abs);
      const allowed = Math.max(0, Math.min(annCap, totCeil - cumT));
      let room = allowed;
      const c2 = Math.min(c, room); room -= c2;
      const i2 = Math.min(i, room); room -= i2;
      const p2 = Math.min(p, room); room -= p2;
      cumI += i2; cumP += p2; cumT += c2 + i2 + p2;
      rows.push({y, c:c2, i:i2, p:p2, annCap, lost:(c+i+p)-(c2+i2+p2)});
    }
    const tot = rows.reduce((a,r)=>({c:a.c+r.c,i:a.i+r.i,p:a.p+r.p,lost:a.lost+r.lost}),{c:0,i:0,p:0,lost:0});
    tot.all = tot.c + tot.i + tot.p;

    const epfEach = (cap) => Math.min(0.12 * inpTest.wage, cap);
    const epfMonth = inpTest.em*epfEach(1800) + inpTest.ef*epfEach(2500) + inpTest.ed*epfEach(3000);
    const epfYears = S.epf;
    const epfTotal = epfMonth * 12 * epfYears / 1e7;

    return {inp: inpTest, cat, cl, msme, S, R, efci, infraFactor, bonus, loanElig, subRate, rows, tot, totCeil, intCeil, powCeil, epfMonth, epfYears, epfTotal};
  }
`, sandbox);

function runOriginalCompute(inp) {
  sandbox.inpTest = inp;
  return vm.runInContext('computeOriginal(inpTest)', sandbox);
}

for (const tc of testCases) {
  console.log(`Checking ${tc.name}...`);
  const expected = runOriginalCompute(tc.inp);
  const actual = compute(tc.inp);

  // Assert classification
  assert.strictEqual(actual.cl.size, expected.cl.size, `cl.size mismatch in ${tc.name}`);
  assert.strictEqual(actual.cl.key, expected.cl.key, `cl.key mismatch in ${tc.name}`);
  assert.strictEqual(actual.cat, expected.cat, `cat mismatch in ${tc.name}`);
  assert.strictEqual(actual.msme, expected.msme, `msme mismatch in ${tc.name}`);

  // Assert EFCI and ceilings
  assert(Math.abs(actual.efci - expected.efci) < 1e-9, `efci mismatch in ${tc.name}`);
  assert(Math.abs(actual.loanElig - expected.loanElig) < 1e-9, `loanElig mismatch in ${tc.name}`);
  assert(Math.abs(actual.subRate - expected.subRate) < 1e-9, `subRate mismatch in ${tc.name}`);
  assert(Math.abs(actual.totCeil - expected.totCeil) < 1e-9, `totCeil mismatch in ${tc.name}`);
  assert(Math.abs(actual.intCeil - expected.intCeil) < 1e-9, `intCeil mismatch in ${tc.name}`);
  assert(Math.abs(actual.powCeil - expected.powCeil) < 1e-9, `powCeil mismatch in ${tc.name}`);

  // Assert Totals
  assert(Math.abs(actual.tot.all - expected.tot.all) < 1e-9, `tot.all mismatch in ${tc.name}`);
  assert(Math.abs(actual.tot.c - expected.tot.c) < 1e-9, `tot.c mismatch in ${tc.name}`);
  assert(Math.abs(actual.tot.i - expected.tot.i) < 1e-9, `tot.i mismatch in ${tc.name}`);
  assert(Math.abs(actual.tot.p - expected.tot.p) < 1e-9, `tot.p mismatch in ${tc.name}`);
  assert(Math.abs(actual.tot.lost - expected.tot.lost) < 1e-9, `tot.lost mismatch in ${tc.name}`);

  // Assert EPF
  assert(Math.abs(actual.epfMonth - expected.epfMonth) < 1e-9, `epfMonth mismatch in ${tc.name}`);
  assert.strictEqual(actual.epfYears, expected.epfYears, `epfYears mismatch in ${tc.name}`);
  assert(Math.abs(actual.epfTotal - expected.epfTotal) < 1e-9, `epfTotal mismatch in ${tc.name}`);

  // Assert Rows
  assert.strictEqual(actual.rows.length, expected.rows.length, `rows.length mismatch in ${tc.name}`);
  for (let r = 0; r < actual.rows.length; r++) {
    const actRow = actual.rows[r];
    const expRow = expected.rows[r];
    assert.strictEqual(actRow.y, expRow.y);
    assert(Math.abs(actRow.c - expRow.c) < 1e-9, `row ${r} c mismatch`);
    assert(Math.abs(actRow.i - expRow.i) < 1e-9, `row ${r} i mismatch`);
    assert(Math.abs(actRow.p - expRow.p) < 1e-9, `row ${r} p mismatch`);
    assert(Math.abs(actRow.annCap - expRow.annCap) < 1e-9, `row ${r} annCap mismatch`);
    assert(Math.abs(actRow.lost - expRow.lost) < 1e-9, `row ${r} lost mismatch`);
  }

  // Check string format outputs
  assert.strictEqual(money(actual.tot.all), sandbox.money(expected.tot.all));
  assert.strictEqual(money(actual.tot.c), sandbox.money(expected.tot.c));
  assert.strictEqual(money(actual.tot.i), sandbox.money(expected.tot.i));
  assert.strictEqual(money(actual.tot.p), sandbox.money(expected.tot.p));
  assert.strictEqual(rupees(actual.epfMonth), sandbox.rupees(expected.epfMonth));
  assert.strictEqual(money(actual.epfTotal), sandbox.money(expected.epfTotal));

  // Check validation checks
  sandbox.rTest = expected;
  const expChecks = vm.runInContext('checks(rTest)', sandbox);
  const actChecks = getChecks(actual);
  assert.strictEqual(actChecks.length, expChecks.length, `checks count mismatch in ${tc.name}`);
  for (let i = 0; i < actChecks.length; i++) {
    assert.strictEqual(actChecks[i][0], expChecks[i][0], `check ${i} type mismatch`);
    assert.strictEqual(actChecks[i][1], expChecks[i][1], `check ${i} text mismatch`);
  }

  // Check other subsidies
  const expOther = vm.runInContext('otherList(rTest)', sandbox);
  const actOther = getOtherList(actual);
  assert.strictEqual(actOther.length, expOther.length, `otherList length mismatch in ${tc.name}`);
  for (let i = 0; i < actOther.length; i++) {
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(actOther[i])),
      JSON.parse(JSON.stringify(expOther[i])),
      `otherList item ${i} mismatch in ${tc.name}`
    );
  }

  // Check steps
  const expSteps = vm.runInContext('steps(rTest)', sandbox);
  const actSteps = getSteps(actual);
  assert.deepStrictEqual(
    JSON.parse(JSON.stringify(actSteps)),
    JSON.parse(JSON.stringify(expSteps)),
    `steps mismatch in ${tc.name}`
  );
}

console.log('\nAll 12 test cases passed with 100% exact match!');
