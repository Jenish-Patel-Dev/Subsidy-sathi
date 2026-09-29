import React from 'react';
import { SIZE_G, getChecks, getSteps } from '../lib/calc.js';
import { getOtherList } from '../data/other.js';
import { money, rupees } from '../lib/format.js';
import {
  Sparkles,
  BarChart3,
  Users2,
  CheckCircle2,
  Gift,
  ArrowRightCircle,
  AlertTriangle,
  Check,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function ResultPanel({ result }) {
  const { cat, cl, S, R, rows, tot, totCeil } = result;

  const chk = getChecks(result);
  const blocked = chk.some((c) => c[0] === 'bad');
  const W = Math.max(totCeil, tot.all, 1e-9);
  const w = (v) => (v / W * 100).toFixed(2) + '%';

  // year chart calculations
  const n = rows.length;
  const cw = 640;
  const ch = 190;
  const pl = 44;
  const pr = 8;
  const pt = 12;
  const pb = 26;
  const maxY = Math.max(...rows.map((x) => Math.max(x.annCap, x.c + x.i + x.p)), 1e-9);
  const bw = (cw - pl - pr) / n;
  const yS = (v) => pt + (ch - pt - pb) * (1 - v / maxY);

  const microNote =
    cl.size === 'micro'
      ? `માઇક્રો: કેપિટલ સબસિડી પહેલા વર્ષે એકસાથે; વાર્ષિક મર્યાદા વર્ષ-1 માં ${R.annMicro[0]}%, પછી ${R.annMicro[1]}%.`
      : `વાર્ષિક મર્યાદા EFCI ના ${R.ann}%${S.abs ? `, અને વધુમાં વધુ ₹${S.abs} કરોડ પ્રતિ વર્ષ` : ''}.`;

  const steps = getSteps(result);

  return (
    <div className="res" id="res" aria-live="polite">
      {/* Panel 1: Hero Overview */}
      <section className="panel hero-card">
        <div className="tags">
          <span className="tag acc" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} aria-hidden="true" />
            <span>{S.name}</span>
          </span>
          <span className="tag">{SIZE_G[cl.size]}</span>
          <span className="tag">{cl.sector.g}</span>
          {cat ? <span className={`catpill cat${cat}`}>Category {cat}</span> : null}
          {result.bonus ? <span className="tag" style={{ background: 'var(--c-int-soft)', color: 'var(--c-int)' }}>+1% વધારાનું વ્યાજ</span> : null}
        </div>

        {blocked && (
          <div
            style={{
              margin: '14px 0 0',
              color: 'var(--bad)',
              background: 'var(--bad-soft)',
              border: '1px solid var(--bad-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>નીચેની શરતો પૂરી થતી નથી, તેથી આ યોજનામાં સહાય મળવાપાત્ર નથી. આંકડા ફક્ત સમજ માટે છે.</span>
          </div>
        )}

        <div className="hero-num">
          <span className="big">{money(tot.all)}</span>
          <span className="of">
            {S.years} વર્ષમાં અંદાજિત કેપિટલ + વ્યાજ + પાવર સહાય · કુલ મર્યાદા {money(totCeil)} (EFCI ના {R.total}%)
          </span>
        </div>

        <div className="meter" role="img" aria-label="કુલ મર્યાદા સામે મળતી સહાય">
          <div className="bar">
            <div className="seg-c" style={{ width: w(tot.c), background: 'var(--c-cap)' }} title={`કેપિટલ: ${money(tot.c)}`}></div>
            <div className="seg-c" style={{ width: w(tot.i), background: 'var(--c-int)' }} title={`વ્યાજ: ${money(tot.i)}`}></div>
            <div className="seg-c" style={{ width: w(tot.p), background: 'var(--c-pow)' }} title={`પાવર: ${money(tot.p)}`}></div>
            <div className="cap" style={{ left: `calc(${w(totCeil)} - 2px)` }} title={`કુલ મર્યાદા: ${money(totCeil)}`}></div>
          </div>
          <div className="scale">
            <span>0</span>
            <span>કુલ મર્યાદા {R.total}% EFCI</span>
          </div>
        </div>

        <div className="comp">
          <div>
            <span className="k">
              <i
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: 'var(--c-cap)',
                  marginRight: '6px',
                }}
              ></i>
              કેપિટલ સબસિડી
            </span>
            <b style={{ color: 'var(--c-cap)' }}>{money(tot.c)}</b>
            <small>
              EFCI ના {R.cap}%{cl.size === 'micro' ? ', પહેલા વર્ષે' : `, ${S.years} વર્ષમાં સમાન હપ્તે`}
            </small>
          </div>
          <div>
            <span className="k">
              <i
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: 'var(--c-int)',
                  marginRight: '6px',
                }}
              ></i>
              વ્યાજ સબસિડી
            </span>
            <b style={{ color: 'var(--c-int)' }}>{money(tot.i)}</b>
            <small>
              {R.int}%{result.bonus ? ' + 1%' : ''} ટર્મ લોન પર, મહત્તમ EFCI ના {R.intCap}% ({money(result.intCeil)})
            </small>
          </div>
          <div>
            <span className="k">
              <i
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: 'var(--c-pow)',
                  marginRight: '6px',
                }}
              ></i>
              પાવર ટેરિફ
            </span>
            <b style={{ color: 'var(--c-pow)' }}>{money(tot.p)}</b>
            <small>₹{R.pow}/યુનિટ, 5 વર્ષ સુધી (મહત્તમ ₹1 કરોડ/વર્ષ)</small>
          </div>
        </div>
      </section>

      {/* Panel 2: વાર્ષિક વિગત અને ચાર્ટ */}
      <section className="panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ margin: 0 }}>
            <BarChart3 size={19} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
            <span>વાર્ષિક વિગત ({S.years} વર્ષ)</span>
          </h3>
          <div className="chart-legend" style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--mute)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--c-cap)' }}></span>
              કેપિટલ
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--c-int)' }}></span>
              વ્યાજ
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--c-pow)' }}></span>
              પાવર
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '2px', background: 'var(--ink)' }}></span>
              મર્યાદા
            </span>
          </div>
        </div>

        <svg className="chart" viewBox={`0 0 ${cw} ${ch}`} preserveAspectRatio="xMidYMid meet">
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = pt + (ch - pt - pb) * (1 - p);
            return (
              <g key={i}>
                <line x1={pl} x2={cw - pr} y1={y.toFixed(1)} y2={y.toFixed(1)} stroke="var(--line)" strokeWidth="1" />
                <text x={pl - 6} y={(y + 4).toFixed(1)} textAnchor="end">
                  ₹{(p * maxY).toFixed(1)}
                </text>
              </g>
            );
          })}

          {rows.map((x, i) => {
            const x0 = pl + i * bw + 4;
            const bwi = bw - 8;
            let cur = 0;
            const segs = [
              { v: x.c, color: 'var(--c-cap)' },
              { v: x.i, color: 'var(--c-int)' },
              { v: x.p, color: 'var(--c-pow)' },
            ];

            return (
              <g key={x.y}>
                {segs.map((seg, sIdx) => {
                  if (seg.v <= 0) return null;
                  const yTop = yS(cur + seg.v);
                  const yBot = yS(cur);
                  const h = Math.max(0, yBot - yTop);
                  cur += seg.v;
                  return (
                    <rect
                      key={sIdx}
                      x={x0.toFixed(1)}
                      y={yTop.toFixed(1)}
                      width={bwi.toFixed(1)}
                      height={h.toFixed(1)}
                      fill={seg.color}
                      rx="2"
                    />
                  );
                })}
                <line
                  x1={(x0 - 3).toFixed(1)}
                  x2={(x0 + bwi + 3).toFixed(1)}
                  y1={yS(x.annCap).toFixed(1)}
                  y2={yS(x.annCap).toFixed(1)}
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <text x={(x0 + bwi / 2).toFixed(1)} y={ch - 8} textAnchor="middle">
                  વ{x.y}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>વર્ષ</th>
                <th className="n">કેપિટલ</th>
                <th className="n">વ્યાજ</th>
                <th className="n">પાવર</th>
                <th className="n">કુલ</th>
                <th className="n">વાર્ષિક મર્યાદા</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.y}>
                  <td>વર્ષ {x.y}</td>
                  <td className="n">{money(x.c)}</td>
                  <td className="n">{money(x.i)}</td>
                  <td className="n">{money(x.p)}</td>
                  <td className="n" style={{ fontWeight: 600 }}>{money(x.c + x.i + x.p)}</td>
                  <td className="n" style={{ color: 'var(--mute)' }}>{money(x.annCap)}</td>
                </tr>
              ))}
              <tr className="tot">
                <td>કુલ</td>
                <td className="n">{money(tot.c)}</td>
                <td className="n">{money(tot.i)}</td>
                <td className="n">{money(tot.p)}</td>
                <td className="n" style={{ color: 'var(--brand-700)' }}>{money(tot.all)}</td>
                <td className="n">{money(totCeil)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="note">
          {microNote} વાર્ષિક મર્યાદા નડે ત્યાં આ ગણતરી પહેલા કેપિટલ, પછી વ્યાજ, પછી પાવર ગણે છે. વ્યાજ: લોનની મુદ્દલ સમાન હપ્તે ચૂકવાય એમ માનીને, વર્ષના સરેરાશ બાકી પર. ({S.ref})
        </p>
      </section>

      {/* Panel 3: EPF વળતર */}
      <section className="panel">
        <h3>
          <Users2 size={19} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
          <span>EPF વળતર</span>
        </h3>
        <div className="hero-num" style={{ marginTop: 0 }}>
          <span className="big" style={{ fontSize: '28px', color: 'var(--ok)' }}>
            {money(result.epfTotal)}
          </span>
          <span className="of">
            {result.epfYears} વર્ષમાં · {rupees(result.epfMonth)} પ્રતિ માસ
          </span>
        </div>
        <p className="note">
          નવા કર્મચારીઓ પર નોકરીદાતાના EPF ફાળાના 100%, પ્રતિ કર્મચારી માસિક 12% (બેઝિક+DA) અથવા પુરુષ ₹1,800 / મહિલા ₹2,500 / દિવ્યાંગ ₹3,000, જે ઓછું હોય. GR માં આ ઘટક 1-2-3 થી અલગ બતાવેલું છે, તેથી અહીં ઉપરની કુલ રકમમાં ઉમેર્યું નથી. કેન્દ્ર/રાજ્યની બીજી યોજનામાંથી EPF વળતર લીધું હોય તે સમયગાળા માટે પાત્ર નથી.
        </p>
      </section>

      {/* Panel 4: પાત્રતાની શરતો */}
      <section className="panel">
        <h3>
          <CheckCircle2 size={19} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
          <span>પાત્રતાની શરતો</span>
        </h3>
        <ul className="checks">
          {chk.map(([k, t], idx) => {
            let IconComponent = Info;
            if (k === 'ok') IconComponent = Check;
            else if (k === 'bad') IconComponent = X;
            else if (k === 'warn') IconComponent = AlertCircle;

            return (
              <li key={idx}>
                <span className={`dot d-${k}`}>
                  <IconComponent size={14} strokeWidth={2.6} aria-hidden="true" />
                </span>
                <span>{t}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Panel 5: આગળનાં પગલાં (Adjusted in right side to equalize height) */}
      <section className="panel">
        <h3>
          <ArrowRightCircle size={19} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
          <span>આગળનાં પગલાં</span>
        </h3>
        <ol className="steps">
          {steps.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

{/* Full-width Section: તમને લાગુ પડતી અન્ય સહાય */}
export function ApplicableOtherSubsidies({ result }) {
  const other = getOtherList(result);

  return (
    <section className="panel checker-full-panel" aria-label="તમને લાગુ પડતી અન્ય સહાય">
      <h3>
        <Gift size={19} style={{ color: 'var(--brand-700)' }} aria-hidden="true" />
        <span>તમને લાગુ પડતી અન્ય સહાય</span>
      </h3>
      <div className="alist">
        {other.map((o, idx) => (
          <div className="aitem" key={idx}>
            <span className="t">{o[0]}</span>
            <span className="v">{o[1]}</span>
            {o[2] && (
              <span className="c">
                <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{o[2]}</b>
              </span>
            )}
            {o[4] && <span className="amt">{o[4]}</span>}
            {o[3] && <span className="c">{o[3]}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
