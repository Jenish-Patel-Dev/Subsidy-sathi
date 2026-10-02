import React, { useState, useEffect, useMemo } from 'react';
import NavBar from './components/NavBar.jsx';
import Hero from './components/Hero.jsx';
import BottomNav from './components/BottomNav.jsx';
import CheckerForm from './components/CheckerForm.jsx';
import ResultPanel, { ApplicableOtherSubsidies } from './components/ResultPanel.jsx';
import RateTables from './components/RateTables.jsx';
import OtherSubsidies from './components/OtherSubsidies.jsx';
import TalukaGrid from './components/TalukaGrid.jsx';
import Rules from './components/Rules.jsx';
import Footer from './components/Footer.jsx';
import { TALUKAS } from './data/talukas.js';
import { compute } from './lib/calc.js';
import { money } from './lib/format.js';
import { ChevronDown, ShieldAlert, ExternalLink } from 'lucide-react';
import { PWAProvider } from './context/PWAContext.jsx';
import PWAUpdateModal from './components/PWAUpdateModal.jsx';
import AppLoader from './components/AppLoader.jsx';

const VALID_TABS = ['check', 'rates', 'other', 'taluka', 'rules'];

function isPageReload() {
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload' || navEntries[0].type === 'back_forward';
    }
    if (window.performance && window.performance.navigation) {
      const type = window.performance.navigation.type;
      return type === 1 || type === 2; // TYPE_RELOAD or TYPE_BACK_FORWARD
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function getInitialTab() {
  const isReload = isPageReload();

  if (isReload) {
    // On page reload (or browser back/forward), stay on the active tab
    try {
      const saved = sessionStorage.getItem('sd-tab');
      if (saved && VALID_TABS.includes(saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    const hash = (window.location.hash || '').replace('#', '');
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
  } else {
    // Fresh visit / opening site freshly: always land on Home page ('check')
    try {
      sessionStorage.removeItem('sd-tab');
      localStorage.removeItem('sd-tab');
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {
      // ignore
    }
    return 'check';
  }

  return 'check';
}

function parseNum(val) {
  const v = parseFloat(val);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const botadIndex = TALUKAS.findIndex((d) => d[0] === 'Botad');

  const [formValues, setFormValues] = useState({
    dist: String(botadIndex >= 0 ? botadIndex : 0),
    tal: 'Botad',
    sector: 't5',
    ptype: 'new',
    exist: '10',
    docp: '2027-03',
    pm: '6',
    bld: '2',
    infra: '0.2',
    land: '0.5',
    infraIn: true,
    loan: '6',
    rate: '10',
    tenure: '7',
    units: '800000',
    jobs: '40',
    wage: '15000',
    em: '30',
    ef: '10',
    ed: '0',
    women: false,
    women100: false,
    startup: false,
    firstgen: false,
    outGidc: true,
    rent: '0',
    useCap: true,
    useInt: true,
    usePow: true,
  });

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    try {
      sessionStorage.setItem('sd-tab', tabId);
      localStorage.removeItem('sd-tab');
    } catch (e) {
      // ignore
    }
    window.location.hash = tabId;

    // Smooth scroll to content top if user has scrolled down
    const mainEl = document.querySelector('main');
    if (mainEl && window.scrollY > 150) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mainEl.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').replace('#', '');
      if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
        try {
          sessionStorage.setItem('sd-tab', hash);
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const computedResult = useMemo(() => {
    const inp = {
      dist: formValues.dist,
      tal: formValues.tal,
      sector: formValues.sector,
      ptype: formValues.ptype,
      exist: parseNum(formValues.exist),
      docp: formValues.docp,
      pm: parseNum(formValues.pm),
      bld: parseNum(formValues.bld),
      infra: parseNum(formValues.infra),
      land: parseNum(formValues.land),
      infraIn: !!formValues.infraIn,
      loan: parseNum(formValues.loan),
      rate: parseNum(formValues.rate),
      tenure: Math.max(1, Math.round(parseNum(formValues.tenure) || 1)),
      units: parseNum(formValues.units),
      jobs: parseNum(formValues.jobs),
      wage: parseNum(formValues.wage),
      em: parseNum(formValues.em),
      ef: parseNum(formValues.ef),
      ed: parseNum(formValues.ed),
      women: !!formValues.women,
      women100: !!formValues.women100,
      startup: !!formValues.startup,
      firstgen: !!formValues.firstgen,
      outGidc: !!formValues.outGidc,
      rent: parseNum(formValues.rent),
      useCap: !!formValues.useCap,
      useInt: !!formValues.useInt,
      usePow: !!formValues.usePow,
    };
    return compute(inp);
  }, [formValues]);

  return (
    <PWAProvider>
      {/* 1. Unified Top Navigation Bar (Desktop Sticky Navbar + Mobile Sticky App Bar) */}
      <NavBar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* 2. Hero Section (Shown ONLY on Home / first menu tab: "મારી પાત્રતા") */}
      {activeTab === 'check' && <Hero />}

      {/* 3. Main Content Area */}
      <main className="wrap">
        {/* CHECKER TAB */}
        <section id="p-check" data-panel="check" hidden={activeTab !== 'check'}>
          {/* Top 2-Column Grid with Equal Height */}
          <div className="checker">
            <CheckerForm
              formValues={formValues}
              onChange={handleFieldChange}
            />
            <ResultPanel result={computedResult} />
          </div>

          {/* Bottom Full-Width Section: Applicable Other Subsidies */}
          <div className="checker-full-width">
            <ApplicableOtherSubsidies result={computedResult} />
          </div>
        </section>

        {/* RATES TAB */}
        <RateTables hidden={activeTab !== 'rates'} />

        {/* OTHER TAB */}
        <OtherSubsidies hidden={activeTab !== 'other'} />

        {/* TALUKA TAB */}
        <TalukaGrid hidden={activeTab !== 'taluka'} />

        {/* RULES TAB */}
        <Rules hidden={activeTab !== 'rules'} />

        {/* In-Page App Disclaimer (Visible below active page content on screens <= 950px where bottom nav is active) */}
        <div className="app-disclaimer-note" role="note" aria-label="ડિસ્ક્લેમર નોંધ">
          <div className="app-disclaimer-top">
            <ShieldAlert size={18} className="app-disclaimer-icon" aria-hidden="true" />
            <div className="app-disclaimer-text">
              આ સાધન ત્રણ GR ના લખાણ પર આધારિત સૂચક અંદાજ આપે છે. અંતિમ પાત્રતા અને રકમ Asset Verification, PEC/FEC અને મંજૂરી સત્તાધિકારીના નિર્ણય મુજબ રહેશે. અર્થઘટનમાં મતભેદ હોય તો MSME માટે SLEC અને લાર્જ એકમો માટે para 12(c) ની સમિતિનો નિર્ણય આખરી ગણાય.
            </div>
          </div>
          <div className="app-disclaimer-link-wrap">
            <span className="app-disclaimer-link-label">સત્તાવાર સરકારી સંદર્ભ:</span>{' '}
            <a
              href="https://ic.gujarat.gov.in/industrial-policy.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="app-gov-link"
              title="ઉદ્યોગ કમિશનરશ્રીની કચેરી - ઔદ્યોગિક નીતિ પોર્ટલ (ic.gujarat.gov.in)"
            >
              <span>ic.gujarat.gov.in/industrial-policy.aspx</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>

      {/* 4. Mobile Fixed Bottom Navigation Menu (< 768px) */}
      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* 5. Mobile Sticky Total Bar */}
      {activeTab === 'check' && (
        <div className="mobile-sticky-bar" aria-label="મોબાઈલ કુલ સહાય સારાંશ">
          <div>
            <div style={{ fontSize: '12px', color: 'var(--mute)', fontWeight: 600 }}>કુલ અંદાજિત સહાય</div>
            <div style={{ font: '700 20px var(--f-num)', color: 'var(--brand-700)', lineHeight: 1.2 }}>
              {money(computedResult.tot.all)}
            </div>
          </div>
          <button
            type="button"
            className="mobile-sticky-btn"
            onClick={() => {
              document.getElementById('res')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>પરિણામ જુઓ</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 6. Footer */}
      <Footer />

      {/* 7. PWA Update Notification Popup */}
      <PWAUpdateModal />

      {/* 8. Fullscreen App Loader (For refresh & update transitions) */}
      <AppLoader />
    </PWAProvider>
  );
}
