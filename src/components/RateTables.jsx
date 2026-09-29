import React from 'react';
import { SCHEMES } from '../data/schemes.js';
import { Percent, Info } from 'lucide-react';

const ORDER = [
  'msme_gen',
  'msme_sel',
  'large_gen',
  'large_thr',
  'large_sel',
  'mega_thr',
  'mega_sel',
  'ultra_thr',
  'ultra_sel',
];

const HEADERS = {
  msme_gen: 'MSME માટે કોઈ પણ ઉત્પાદન ક્ષેત્ર (પસંદગીના 5 સિવાય). વ્યાજ: મહિલા, રજિસ્ટર્ડ સ્ટાર્ટઅપ, પ્રથમ પેઢીના ઉદ્યમીને +1%, કુલ મર્યાદામાં.',
  msme_sel: 'સ્પોર્ટ્સ ગુડ્સ, રમકડાં, ફૂટવેર, રોબોટ, ડ્રોન. માઇક્રો: કેપિટલ પહેલા વર્ષે; સ્મોલ-મીડિયમ: 5 વર્ષમાં.',
  large_gen: 'P&M > ₹125 કરોડ, થ્રસ્ટ સેક્ટર બહાર (₹1,000 કરોડથી વધુ પણ).',
  large_thr: 'થ્રસ્ટ સેક્ટર; મેગાની રોજગારી શરત પૂરી ન કરતાં ₹1,000 કરોડ+ પ્રોજેક્ટ પણ.',
  large_sel: 'પસંદગીનાં થ્રસ્ટ સેક્ટર; મેગાની રોજગારી શરત ન પૂરી કરતા પ્રોજેક્ટ પણ.',
  mega_thr: 'GFCI ≥ ₹1,000 કરોડ અને ≥ 250 સીધી રોજગારી (દર ₹200 કરોડે +50).',
  mega_sel: 'પસંદગીનાં થ્રસ્ટ સેક્ટરમાં મેગા એકમ.',
  ultra_thr: 'GFCI ≥ ₹10,000 કરોડ અને ≥ 3,000 સીધી રોજગારી (દર ₹5,000 કરોડે +500). સ્ટેમ્પ ડ્યુટી 100% વળતર.',
  ultra_sel: 'પસંદગીનાં થ્રસ્ટ સેક્ટરમાં અલ્ટ્રા-મેગા એકમ.',
};

export default function RateTables({ hidden }) {
  return (
    <section id="p-rates" data-panel="rates" hidden={hidden}>
      <h2 className="sec-h">સહાયના દર: ઘટક 1, 2 અને 3</h2>
      <p className="sec-p">
        દરેક યોજનામાં એકમ કેપિટલ, વ્યાજ અને પાવર ટેરિફમાંથી કોઈ એક કે સંયોજન લઈ શકે. દરેક ઘટકની અલગ મર્યાદા, વાર્ષિક મર્યાદા અને કુલ મર્યાદા લાગુ પડે. વાર્ષિક મર્યાદાને કારણે ન મળેલી રકમ આગળના વર્ષમાં લઈ જવાતી નથી.
      </p>
      <div className="grid2" id="rateTables">
        {ORDER.map((k) => {
          const S = SCHEMES[k];
          const msme = k.startsWith('msme');

          const renderRow = (c) => {
            const R = S[c];
            const capTxt = msme
              ? `${R.cap}% · માઇક્રોને વર્ષ 1 માં, S&M ને 5 વર્ષમાં`
              : `${R.cap}% · ${S.years} વર્ષ`;
            const annTxt = msme
              ? `S&M ${R.ann}% · માઇક્રો ${R.annMicro[0]}% પછી ${R.annMicro[1]}%`
              : `${R.ann}%`;

            return (
              <tr key={c}>
                <td>
                  <span className={`catpill cat${c}`}>Category {c}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{capTxt}</td>
                <td>
                  {R.int}% · મહત્તમ {R.intCap}%
                </td>
                <td>
                  ₹{R.pow}/યુનિટ · મહત્તમ {R.powCap}%
                </td>
                <td className="n" style={{ fontWeight: 700, color: 'var(--brand-700)' }}>
                  {R.total}%
                </td>
                <td className="n" style={{ color: 'var(--mute)' }}>
                  {annTxt}
                </td>
              </tr>
            );
          };

          return (
            <section className="panel" key={k} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Percent size={18} style={{ color: 'var(--brand-700)', flexShrink: 0 }} aria-hidden="true" />
                <h3 style={{ margin: 0 }}>{S.name}</h3>
              </div>
              <p className="hint" style={{ marginBottom: '12px', lineHeight: 1.55 }}>
                {HEADERS[k]}
              </p>
              <div className="tbl-wrap" style={{ marginTop: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>શ્રેણી</th>
                      <th>કેપિટલ (EFCI)</th>
                      <th>વ્યાજ (ટર્મ લોન)</th>
                      <th>પાવર ટેરિફ</th>
                      <th className="n">કુલ</th>
                      <th className="n">વાર્ષિક</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderRow('A')}
                    {renderRow('B')}
                  </tbody>
                </table>
              </div>
              <p className="note" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Info size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--mute)' }} aria-hidden="true" />
                <span>
                  સમયગાળો {S.years} વર્ષ · EPF {S.epf} વર્ષ
                  {S.abs ? ` · વાર્ષિક મહત્તમ ₹${S.abs} કરોડ` : ''}
                  {S.hpc ? ' · HPC કસ્ટમાઇઝ્ડ પેકેજ' : ''} · {S.ref}
                </span>
              </p>
            </section>
          );
        })}
      </div>
    </section>
  );
}
