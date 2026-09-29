import React from 'react';
import { RULES_DATA } from '../data/rules.js';
import { ShieldCheck, BookOpen } from 'lucide-react';

export default function Rules({ hidden }) {
  return (
    <section id="p-rules" data-panel="rules" hidden={hidden}>
      <h2 className="sec-h">નિયમો અને શરતો</h2>
      <p className="sec-p">
        યોજનાનો અમલ 01.06.2026 થી 31.05.2031 (5 વર્ષ). આ સમયગાળામાં વાણિજ્યિક ઉત્પાદન શરૂ થવું જરૂરી છે.
      </p>
      <div className="grid2" id="rulesGrid">
        {RULES_DATA.map((card, idx) => (
          <section className="panel" key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShieldCheck size={19} style={{ color: 'var(--brand-700)', flexShrink: 0 }} aria-hidden="true" />
              <h3 style={{ margin: 0 }}>{card.title}</h3>
            </div>
            <dl className="defs">
              {card.items.map(([a, b], itemIdx) => (
                <div key={itemIdx}>
                  <dt>{a}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  );
}
