import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isStandaloneApp } from '../lib/pwaDetector.js';

// 1. Strict Environment-Isolated Storage Keys
export const APP_PWA_KEY = 'app_standalone_accepted_v1';
export const APP_WEB_KEY = 'app_web_session_accepted_v1';

// Aliases for full backward compatibility
export const APP_PWA_ACCEPTED_KEY = APP_PWA_KEY;
export const APP_WEB_SESSION_ACCEPTED_KEY = APP_WEB_KEY;
export const APP_PWA_DATE_KEY = 'app_standalone_date_v1';
export const APP_WEB_SESSION_DATE_KEY = 'app_web_session_date_v1';
export const APP_TERMS_VERSION_KEY = 'app_terms_version_v1';

export { isStandaloneApp };

const DEFAULT_VERSION = '1.0.0';

const DisclaimerContext = createContext(null);

export function DisclaimerProvider({ children }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isUpdatedTerms, setIsUpdatedTerms] = useState(false);
  const [appVersion, setAppVersion] = useState(DEFAULT_VERSION);
  const [acceptanceDate, setAcceptanceDate] = useState(null);

  // 2. Clear lingering storage on fresh PWA installation
  useEffect(() => {
    const handleInstalled = () => {
      try {
        localStorage.removeItem(APP_PWA_KEY);
        localStorage.removeItem(APP_PWA_DATE_KEY);
      } catch (e) {}
    };
    window.addEventListener('appinstalled', handleInstalled);
    return () => window.removeEventListener('appinstalled', handleInstalled);
  }, []);

  // 3. Strict Environment-Isolated Status Check
  const checkAcceptance = useCallback((currentVer = DEFAULT_VERSION) => {
    const isApp = isStandaloneApp();
    setIsStandalone(isApp);

    if (isApp) {
      // Installed App (PWA / Mobile APK / Standalone): Checks ONLY localStorage
      try {
        const storedAccepted = localStorage.getItem(APP_PWA_KEY) === 'true';
        const storedDate = localStorage.getItem(APP_PWA_DATE_KEY);
        const storedVer = localStorage.getItem(APP_TERMS_VERSION_KEY);

        // Version update check
        if (storedVer && storedVer !== currentVer && storedAccepted) {
          setIsUpdatedTerms(true);
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
          return;
        }

        if (storedAccepted) {
          const effectiveDate = storedDate || new Date().toISOString();
          if (!storedDate) {
            try { localStorage.setItem(APP_PWA_DATE_KEY, effectiveDate); } catch (e) {}
          }
          setIsAccepted(true);
          setIsModalOpen(false);
          setAcceptanceDate(effectiveDate);
        } else {
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
        }
      } catch (e) {
        setIsAccepted(false);
        setIsModalOpen(true);
      }
    } else {
      // Website / Browser Tab: Checks ONLY sessionStorage (NEVER touches localStorage!)
      try {
        const storedAccepted = sessionStorage.getItem(APP_WEB_KEY) === 'true';
        const storedDate = sessionStorage.getItem(APP_WEB_SESSION_DATE_KEY);
        const storedVer = sessionStorage.getItem(APP_TERMS_VERSION_KEY);

        if (storedVer && storedVer !== currentVer && storedAccepted) {
          setIsUpdatedTerms(true);
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
          return;
        }

        if (storedAccepted) {
          const effectiveDate = storedDate || new Date().toISOString();
          if (!storedDate) {
            try { sessionStorage.setItem(APP_WEB_SESSION_DATE_KEY, effectiveDate); } catch (e) {}
          }
          setIsAccepted(true);
          setIsModalOpen(false);
          setAcceptanceDate(effectiveDate);
        } else {
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
        }
      } catch (e) {
        setIsAccepted(false);
        setIsModalOpen(true);
      }
    }
  }, []);

  // 4. Check version and run initial acceptance check on mount
  useEffect(() => {
    let isMounted = true;

    const fetchVersion = async () => {
      try {
        const res = await fetch(`/version.json?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.version) {
            setAppVersion(data.version);
            checkAcceptance(data.version);
            return;
          }
        }
      } catch (err) {
        // Fallback to default version if offline
      }
      if (isMounted) {
        checkAcceptance(DEFAULT_VERSION);
      }
    };

    fetchVersion();

    return () => {
      isMounted = false;
    };
  }, [checkAcceptance]);

  // 5. Accept Disclaimer Button Action
  const acceptDisclaimer = useCallback(() => {
    const isApp = isStandaloneApp();
    const isoDate = new Date().toISOString();

    if (isApp) {
      // Installed App: Permanently saved in localStorage across app restarts
      try {
        localStorage.setItem(APP_PWA_KEY, 'true');
        localStorage.setItem(APP_PWA_DATE_KEY, isoDate);
        localStorage.setItem(APP_TERMS_VERSION_KEY, appVersion);
      } catch (e) {}
    } else {
      // Website: Saved ONLY in sessionStorage for this browser tab session (NEVER in localStorage!)
      try {
        sessionStorage.setItem(APP_WEB_KEY, 'true');
        sessionStorage.setItem(APP_WEB_SESSION_DATE_KEY, isoDate);
        sessionStorage.setItem(APP_TERMS_VERSION_KEY, appVersion);
      } catch (e) {}
    }

    setIsAccepted(true);
    setIsModalOpen(false);
    setIsReviewMode(false);
    setIsUpdatedTerms(false);
    setAcceptanceDate(isoDate);
  }, [appVersion]);

  // 6. Review Modal Actions (for reviewing terms anytime)
  const openReviewModal = useCallback(() => {
    setIsReviewMode(true);
    setIsModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    if (isReviewMode) {
      setIsModalOpen(false);
      setIsReviewMode(false);
    }
  }, [isReviewMode]);

  // Format acceptance date for audit display
  const getFormattedAuditDate = useCallback(() => {
    if (!acceptanceDate) return null;
    try {
      const d = new Date(acceptanceDate);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ', ' + d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return acceptanceDate;
    }
  }, [acceptanceDate]);

  return (
    <DisclaimerContext.Provider
      value={{
        isStandalone,
        isAccepted,
        isModalOpen,
        isDisclaimerOpen: isModalOpen,
        isReviewMode,
        isUpdatedTerms,
        appVersion,
        acceptanceDate,
        formattedAuditDate: getFormattedAuditDate(),
        acceptDisclaimer,
        openReviewModal,
        closeReviewModal,
      }}
    >
      {children}
    </DisclaimerContext.Provider>
  );
}

export function useDisclaimer() {
  const context = useContext(DisclaimerContext);
  if (!context) {
    throw new Error('useDisclaimer must be used within a DisclaimerProvider');
  }
  return context;
}
