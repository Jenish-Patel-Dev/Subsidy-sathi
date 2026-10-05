import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isStandaloneApp } from '../lib/pwaDetector.js';

export const APP_WEB_SESSION_ACCEPTED_KEY = 'ss_web_session_accepted';
export const APP_WEB_SESSION_DATE_KEY = 'ss_web_session_date';
export const APP_PWA_ACCEPTED_KEY = 'ss_pwa_accepted';
export const APP_PWA_DATE_KEY = 'ss_pwa_date';
export const APP_TERMS_VERSION_KEY = 'ss_terms_version';

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

  // 1. Initial State Check based on Strict Environment Isolation
  const checkAcceptance = useCallback((currentVer = DEFAULT_VERSION) => {
    const standalone = isStandaloneApp();
    setIsStandalone(standalone);

    if (standalone) {
      // INSTALLED PWA MODE (Persistent in localStorage)
      try {
        const pwaAccepted = localStorage.getItem(APP_PWA_ACCEPTED_KEY) === 'true';
        const pwaDate = localStorage.getItem(APP_PWA_DATE_KEY);
        const storedVer = localStorage.getItem(APP_TERMS_VERSION_KEY);

        // Version update gate check
        if (storedVer && storedVer !== currentVer && pwaAccepted) {
          setIsUpdatedTerms(true);
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
          return;
        }

        if (pwaAccepted) {
          const effectiveDate = pwaDate || new Date().toISOString();
          if (!pwaDate) {
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
      // WEBSITE / BROWSER TAB MODE (SessionStorage only - NEVER touch localStorage!)
      try {
        const webAccepted = sessionStorage.getItem(APP_WEB_SESSION_ACCEPTED_KEY) === 'true';
        const webDate = sessionStorage.getItem(APP_WEB_SESSION_DATE_KEY);
        const storedVer = sessionStorage.getItem(APP_TERMS_VERSION_KEY);

        if (storedVer && storedVer !== currentVer && webAccepted) {
          setIsUpdatedTerms(true);
          setIsAccepted(false);
          setIsModalOpen(true);
          setAcceptanceDate(null);
          return;
        }

        if (webAccepted) {
          const effectiveDate = webDate || new Date().toISOString();
          if (!webDate) {
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

  // 2. Fetch Live Version on App Launch & Check Version Gate
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

    // 3. Listen for appinstalled event to reset PWA acceptance on fresh installation
    const handleAppInstalled = () => {
      try {
        localStorage.removeItem(APP_PWA_ACCEPTED_KEY);
        localStorage.removeItem(APP_PWA_DATE_KEY);
      } catch (e) {}
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      isMounted = false;
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkAcceptance]);

  // 4. Accept Disclaimer Action
  const acceptDisclaimer = useCallback(() => {
    const standalone = isStandaloneApp();
    const isoDate = new Date().toISOString();

    if (standalone) {
      // Save permanently in localStorage for Installed PWA
      try {
        localStorage.setItem(APP_PWA_ACCEPTED_KEY, 'true');
        localStorage.setItem(APP_PWA_DATE_KEY, isoDate);
        localStorage.setItem(APP_TERMS_VERSION_KEY, appVersion);
      } catch (e) {}
    } else {
      // Save in sessionStorage only for Website session (DO NOT touch localStorage)
      try {
        sessionStorage.setItem(APP_WEB_SESSION_ACCEPTED_KEY, 'true');
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

  // 5. Open Modal in Review Mode (for reviewing anytime from Settings / Tab)
  const openReviewModal = useCallback(() => {
    setIsReviewMode(true);
    setIsModalOpen(true);
  }, []);

  // 6. Close Modal (Only permitted when in Review Mode)
  const closeReviewModal = useCallback(() => {
    if (isReviewMode) {
      setIsModalOpen(false);
      setIsReviewMode(false);
    }
  }, [isReviewMode]);

  // Format acceptance date for audit log display
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
