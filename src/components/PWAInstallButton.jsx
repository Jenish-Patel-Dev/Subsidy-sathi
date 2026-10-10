import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { isStandaloneApp } from '../lib/pwaDetector.js';
import { Download } from 'lucide-react';

export default function PWAInstallButton() {
  const { isInstalled, installApp } = usePWA();

  // If already running inside installed app (Native APK or Standalone PWA), do NOT show install button
  if (isInstalled || isStandaloneApp()) {
    return null;
  }

  // Show Install Icon Button ONLY when visiting via web browser where app is not yet installed
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
