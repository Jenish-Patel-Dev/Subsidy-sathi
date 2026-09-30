import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PWAContext = createContext(null);

export function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  // Check if currently running in standalone mode (PWA installed)
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    const matchMediaHandler = (e) => {
      setIsInstalled(e.matches);
    };

    const mql = window.matchMedia('(display-mode: standalone)');
    if (mql.addEventListener) {
      mql.addEventListener('change', matchMediaHandler);
    } else {
      mql.addListener(matchMediaHandler);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', matchMediaHandler);
      } else {
        mql.removeListener(matchMediaHandler);
      }
    };
  }, []);

  // Register Service Worker and track updates
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwRegistration(reg);

          // Check if there is already a waiting worker
          if (reg.waiting) {
            setUpdateAvailable(true);
          }

          // Listen for new worker installation
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update is ready and waiting
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Check for service worker updates periodically (every 15 minutes)
          const interval = setInterval(() => {
            reg.update().catch(() => {});
          }, 15 * 60 * 1000);

          return () => clearInterval(interval);
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped or failed:', err);
        });

      // Handle controller change (when SKIP_WAITING is invoked)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger PWA installation
  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If browser doesn't support beforeinstallprompt (e.g. iOS Safari)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert(
          'આ એપને ઇન્સ્ટોલ કરવા માટે:\n૧. નીચે આપેલા શેર (Share) બટન પર ક્લિક કરો.\n૨. "Add to Home Screen" પસંદ કરો.'
        );
      } else {
        alert(
          'આ એપને ઇન્સ્ટોલ કરવા માટે બ્રાઉઝરના મેનુ (⋮) માંથી "Install App" અથવા "Add to Home Screen" પસંદ કરો.'
        );
      }
    }
  }, [deferredPrompt]);

  // Apply new update (send SKIP_WAITING to waiting worker)
  const updateApp = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }, [swRegistration]);

  // Manually refresh/check for updates (for installed PWA)
  const refreshApp = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (swRegistration) {
        await swRegistration.update();
      }
      // If caches exist, clear stale items and reload
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
    } catch (e) {
      console.warn('Manual refresh check error:', e);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }, [swRegistration]);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isInstalled,
        canInstall: !!deferredPrompt || (!isInstalled && typeof window !== 'undefined'),
        installApp,
        updateAvailable,
        updateApp,
        refreshApp,
        isRefreshing,
        dismissUpdate,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
