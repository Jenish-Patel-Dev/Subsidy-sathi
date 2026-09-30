import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { Download, RotateCw } from 'lucide-react';

export default function PWAInstallButton() {
  const { isInstalled, installApp, refreshApp, isRefreshing } = usePWA();

  if (isInstalled) {
    // Show Refresh / Update Icon Button when app is already installed
    return (
      <button
        type="button"
        className={`theme-toggle-btn pwa-toggle-btn ${isRefreshing ? 'refreshing' : ''}`}
        onClick={refreshApp}
        title="એપ્લિકેશન અપડેટ કરો / નવીનતમ કોડ લોડ કરો"
        aria-label="એપ્લિકેશન અપડેટ કરો"
      >
        <RotateCw size={19} className={isRefreshing ? 'spinning' : ''} aria-hidden="true" />
      </button>
    );
  }

  // Show Install Icon Button when app is not installed
  return (
    <button
      type="button"
      className="theme-toggle-btn pwa-toggle-btn"
      onClick={installApp}
      title="એપ તરીકે ઇન્સ્ટોલ કરો (Install as App)"
      aria-label="એપ ઇન્સ્ટોલ કરો"
    >
      <Download size={19} aria-hidden="true" />
    </button>
  );
}
