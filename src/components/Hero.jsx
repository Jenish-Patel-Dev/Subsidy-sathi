import React from 'react';
import { Award, FileText } from 'lucide-react';

export default function Hero() {
  const grList = [
    {
      title: 'MSME સહાય GR',
      ref: 'IMD/WRT/e-file/9/2026/2630/CH · 25.09.2026',
    },
    {
      title: 'Large, Mega, Ultra Mega GR',
      ref: 'IMD/WRT/e-file/9/2026/2320/I',
    },
    {
      title: 'તાલુકા વર્ગીકરણ GR',
      ref: 'IMD/HMR/e-file/9/2026/2211/I · 08.09.2026',
    },
  ];

  return (
    <section className="hero-section" aria-label="યોજના પરિચય અને સરકારી ઠરાવ સંદર્ભ">
      <div className="wrap hero-wrap">
        {/* Eyebrow badge */}
        <div className="hero-eyebrow-wrap">
          <div className="eyebrow">
            <Award size={14} className="eyebrow-icon" aria-hidden="true" />
            <span>વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026 · ઉદ્યોગ અને ખાણ વિભાગ</span>
          </div>
        </div>

        {/* Description text */}
        <p className="hero-desc">
          તમારા પ્રોજેક્ટની વિગત ભરો: કઈ યોજના લાગુ પડે, કેટલી સહાય મળે, અને કઈ શરતો પૂરી કરવી પડે તે ત્રણ GR મુજબ ગણાય છે.
        </p>

        {/* GR Reference Cards */}
        <div className="grs-container" aria-label="સરકારી ઠરાવ સંદર્ભ">
          <div className="grs">
            {grList.map((gr, idx) => (
              <div className="gr-card" key={idx}>
                <div className="gr-card-head">
                  <FileText size={14} className="gr-card-icon" aria-hidden="true" />
                  <span className="gr-card-title">{gr.title}</span>
                </div>
                <div className="gr-card-ref">{gr.ref}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soft curved bottom divider flowing into page content */}
      <div className="hero-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" className="hero-divider-svg">
          <path
            d="M0,0 C360,28 1080,28 1440,0 L1440,32 L0,32 Z"
            fill="var(--paper)"
          />
        </svg>
      </div>
    </section>
  );
}
