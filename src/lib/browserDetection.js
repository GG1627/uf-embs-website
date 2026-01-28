/**
 * Browser and performance detection utilities
 * Used to optimize performance for specific browsers (especially Firefox)
 */

/**
 * Detects if the current browser is Firefox
 * @returns {boolean}
 */
export const isFirefox = () => {
  if (typeof window === 'undefined') return false;
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

/**
 * Detects if the current browser is Chrome/Chromium
 * @returns {boolean}
 */
export const isChrome = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('chrome') > -1 && ua.indexOf('edge') === -1;
};

/**
 * Detects if the current browser is Safari
 * @returns {boolean}
 */
export const isSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1;
};

/**
 * Gets the performance tier of the device
 * @returns {'low' | 'medium' | 'high'}
 */
export const getPerformanceTier = () => {
  if (typeof window === 'undefined') return 'medium';
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || 4;
  
  // Low-end: <= 4 cores or <= 4GB RAM
  if (hardwareConcurrency <= 4 || deviceMemory <= 4) {
    return 'low';
  }
  
  // High-end: > 8 cores and > 8GB RAM
  if (hardwareConcurrency > 8 && deviceMemory > 8) {
    return 'high';
  }
  
  return 'medium';
};

/**
 * Checks if backdrop-filter is supported
 * Firefox has poor performance with backdrop-filter even if supported
 * @returns {boolean}
 */
export const shouldUseBackdropFilter = () => {
  if (typeof window === 'undefined') return false;
  // Disable backdrop-filter in Firefox for better performance
  if (isFirefox()) return false;
  
  // Check if CSS.supports is available
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('backdrop-filter', 'blur(10px)');
  }
  
  return false;
};

/**
 * Gets optimized particle count based on browser and device
 * @param {number} defaultCount - Default particle count
 * @returns {number}
 */
export const getOptimizedParticleCount = (defaultCount) => {
  const tier = getPerformanceTier();
  const firefox = isFirefox();
  
  // Firefox gets reduced particles
  if (firefox) {
    if (tier === 'low') {
      return Math.floor(defaultCount * 0.3); // 30% for low-end Firefox
    } else if (tier === 'medium') {
      return Math.floor(defaultCount * 0.5); // 50% for medium Firefox
    } else {
      return Math.floor(defaultCount * 0.7); // 70% for high-end Firefox
    }
  }
  
  // Other browsers: reduce only on low-end devices
  if (tier === 'low') {
    return Math.floor(defaultCount * 0.6);
  }
  
  return defaultCount;
};

/**
 * Checks if CSS filters should be simplified
 * Firefox handles complex filters poorly
 * @returns {boolean}
 */
export const shouldSimplifyFilters = () => {
  return isFirefox();
};
