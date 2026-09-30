import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { Download, RotateCw } from 'lucide-react';

export default function PWAInstallButton() {
  const { isInstalled, installApp, refreshApp, isRefreshing } = usePWA();

  if (isInstalled) {
    // Show Refresh / Update Button when app is already installed
    return (
      <button
        type="button"
        className={`pwa-action-btn pwa-refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
        onClick={refreshApp}
        title="એપ્લિકેશન અપડેટ કરો / નવીનતમ કોડ લોડ કરો"
        aria-label="એપ્લિકેશન અપડેટ કરો"
      >
        <RotateCw size={16} className={`pwa-btn-icon ${isRefreshing ? 'spinning' : ''}`} aria-hidden="true" />
        <span className="pwa-btn-text">અપડેટ કરો</span>
      </button>
    );
  }

  // Show Install Button when app is not installed
  return (
    <button
      type="button"
      className="pwa-action-btn pwa-install-btn"
      onClick={installApp}
      title="એપ તરીકે ઇન્સ્ટોલ કરો (Install as App)"
      aria-label="એપ ઇન્સ્ટોલ કરો"
    >
      <Download size={16} className="pwa-btn-icon" aria-hidden="true" />
      <span className="pwa-btn-text">ઇન્સ્ટોલ</span>
    </button>
  );
}
