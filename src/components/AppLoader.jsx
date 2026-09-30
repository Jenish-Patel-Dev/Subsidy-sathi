import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';

export default function AppLoader() {
  const { isRefreshing } = usePWA();

  if (!isRefreshing) return null;

  return (
    <div className="app-loader-backdrop" role="status" aria-live="polite">
      <div className="app-loader-card">
        {/* Animated App Icon */}
        <div className="app-loader-logo-wrap">
          <img src="/logo-dark.png" alt="સબસિડી સાથી" className="app-loader-logo" />
        </div>

        <h3 className="app-loader-title">એપ્લિકેશન અપડેટ થઈ રહી છે...</h3>
        <p className="app-loader-desc">નવીનતમ કોડ અને ડેટા ડાઉનલોડ થઈ રહ્યા છે. કૃપા કરીને થોડીવાર રાહ જુઓ.</p>

        {/* Animated Progress Bar */}
        <div className="app-loader-bar-wrap">
          <div className="app-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}
