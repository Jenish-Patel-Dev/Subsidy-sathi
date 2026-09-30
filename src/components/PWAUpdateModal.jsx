import React from 'react';
import { usePWA } from '../context/PWAContext.jsx';
import { Sparkles, RefreshCw, X } from 'lucide-react';

export default function PWAUpdateModal() {
  const { updateAvailable, updateApp, dismissUpdate } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="pwa-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pwa-update-title">
      <div className="pwa-modal-card">
        {/* Close Button */}
        <button
          type="button"
          className="pwa-modal-close-btn"
          onClick={dismissUpdate}
          aria-label="બંધ કરો"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="pwa-modal-icon-wrap">
          <Sparkles size={28} className="pwa-modal-icon" />
        </div>

        {/* Content */}
        <h3 id="pwa-update-title" className="pwa-modal-title">
          નવું અપડેટ ઉપલબ્ધ છે!
        </h3>
        <p className="pwa-modal-desc">
          સબસિડી સાથી એપ્લિકેશનનું નવું વર્ઝન લાઈવ થઈ ગયું છે. નવીનતમ ફેરફારો, સુવિધાઓ અને સચોટ ગણતરીઓ મેળવવા માટે કૃપા કરીને અત્યારે જ અપડેટ કરો.
        </p>

        {/* Buttons */}
        <div className="pwa-modal-actions">
          <button
            type="button"
            className="pwa-modal-update-btn"
            onClick={updateApp}
          >
            <RefreshCw size={16} />
            <span>અત્યારે જ અપડેટ કરો</span>
          </button>
          <button
            type="button"
            className="pwa-modal-later-btn"
            onClick={dismissUpdate}
          >
            પછીથી
          </button>
        </div>
      </div>
    </div>
  );
}
