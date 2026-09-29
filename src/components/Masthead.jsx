import React, { useState, useEffect } from 'react';
import { Award, FileText, Sun, Moon } from 'lucide-react';

export default function Masthead() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('sd-theme') || 'auto';
    } catch {
      return 'auto';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('sd-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
    <header className="mast">
      <div className="wrap">
        {/* Top bar: Eyebrow badge and theme toggle */}
        <div className="mast-top-bar">
          <div className="eyebrow">
            <Award size={14} className="eyebrow-icon" aria-hidden="true" />
            <span>વિકસિત ગુજરાત ઔદ્યોગિક નીતિ 2026 · ઉદ્યોગ અને ખાણ વિભાગ</span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="થીમ બદલો (Dark / Light)"
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>

        {/* Main hero row: Logo, Titles, Description */}
        <div className="mast-main-row">
          <div className="mast-logo-wrap" aria-hidden="true">
            <svg viewBox="0 0 128 128" width="38" height="38">
              <rect width="128" height="128" rx="28" fill="#0E4B47" />
              <path d="M20 100 V80 L44 68 V80 L68 58 V80 L92 48 V100 Z" fill="#FFFFFF" />
              <rect x="20" y="100" width="88" height="6" rx="3" fill="#136B65" />
              <circle cx="98" cy="30" r="15" fill="#E2A445" />
              <path d="M90.5 30.5 L96 36 L106 25.5" fill="none" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="mast-title-area">
            <h1>
              <span>સબસિડી સાથી</span>
              <span className="sub-title-en">Subsidy Sathi</span>
            </h1>
            <p>તમારા પ્રોજેક્ટની વિગત ભરો: કઈ યોજના લાગુ પડે, કેટલી સહાય મળે, અને કઈ શરતો પૂરી કરવી પડે તે ત્રણ GR મુજબ ગણાય છે.</p>
          </div>
        </div>

        {/* GR Reference Cards: Responsive grid on desktop, horizontal snap-scroll on mobile */}
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
    </header>
  );
}
