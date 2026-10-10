import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { FileDown, RefreshCw } from 'lucide-react';

export default function AppLoader({ isPdfGenerating, pdfStat }) {
  const { isRefreshing } = usePWA();

  const showLoader = isRefreshing || isPdfGenerating;
  if (!showLoader) return null;

  const isPdf = isPdfGenerating && !isRefreshing;

  return (
    <div className="app-loader-backdrop" role="status" aria-live="polite">
      <div className="app-loader-card">
        {/* Animated App Icon */}
        <div className="app-loader-logo-wrap">
          <img src="/logo-dark.png" alt="સબસિડી સાથી" className="app-loader-logo" />
        </div>

        <h3 className="app-loader-title">
          {isPdf ? 'સબસિડી અહેવાલ બની રહ્યો છે...' : 'એપ્લિકેશન અપડેટ થઈ રહી છે...'}
        </h3>
        <p className="app-loader-desc">
          {isPdf
            ? (pdfStat || 'તમારો 3 પાનાંનો સત્તાવાર સબસિડી અંદાજ PDF રિપોર્ટ તૈયાર થઈ રહ્યો છે. કૃપા કરીને થોડીવાર રાહ જુઓ.')
            : 'નવીનતમ કોડ અને ડેટા ડાઉનલોડ થઈ રહ્યા છે. કૃપા કરીને થોડીવાર રાહ જુઓ.'}
        </p>

        {/* Animated Progress Bar */}
        <div className="app-loader-bar-wrap">
          <div className="app-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}
