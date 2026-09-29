import React from 'react';
import { getAllOtherCategories } from '../data/other.js';
import { Layers, CheckCircle } from 'lucide-react';

export default function OtherSubsidies({ hidden }) {
  const categories = getAllOtherCategories();

  return (
    <section id="p-other" data-panel="other" hidden={hidden}>
      <h2 className="sec-h">અન્ય સહાય</h2>
      <p className="sec-p">
        કેપિટલ-વ્યાજ-પાવર ઉપરાંતની સહાય. દરેક માટે અરજીની મુદત નક્કી છે: MSME માટે સામાન્ય રીતે 6 મહિના અને લાર્જ/મેગા/અલ્ટ્રા-મેગા માટે 3 મહિના.
      </p>
      <div id="otherAll" style={{ display: 'grid', gap: '20px' }}>
        {categories.map((cat, idx) => (
          <section className="panel" key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Layers size={19} style={{ color: 'var(--brand-700)', flexShrink: 0 }} aria-hidden="true" />
              <h3 style={{ margin: 0 }}>{cat.title}</h3>
            </div>
            <div className="alist">
              {cat.items.map((o, itemIdx) => (
                <div className="aitem" key={itemIdx}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--brand-600)', marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                    <span className="t">{o[0]}</span>
                  </div>
                  <span className="v">{o[1]}</span>
                  {o[2] && (
                    <span className="c">
                      <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{o[2]}</b>
                    </span>
                  )}
                  {o[3] && <span className="c" style={{ color: 'var(--mute)' }}>{o[3]}</span>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
