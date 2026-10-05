/**
 * Robust Standalone PWA Detection Helper
 * Checks cross-platform standalone indicators:
 * 1. Query parameter (?mode=pwa)
 * 2. iOS Safari navigator.standalone
 * 3. Android WebAPK launch referrer
 * 4. W3C display-mode: standalone
 */
export const isStandaloneApp = () => {
  try {
    if (typeof window === 'undefined') return false;

    // 1. Explicit query parameter from manifest start_url
    if (window.location.search && window.location.search.includes('mode=pwa')) {
      return true;
    }
    // 2. iOS Safari Add-to-Home-Screen standalone mode
    if (window.navigator && window.navigator.standalone === true) {
      return true;
    }
    // 3. Android WebAPK launch referrer
    if (document.referrer && document.referrer.includes('android-app://')) {
      return true;
    }
    // 4. Standard W3C display-mode media query
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
