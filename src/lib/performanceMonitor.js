/**
 * Performance Monitoring Utility
 * Tracks and reports performance metrics, especially useful for Firefox optimization
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      timeToInteractive: null,
      totalBlockingTime: null,
    };
    this.observers = [];
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.search.includes('perf=true'));
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Monitor paint metrics
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
              this.logMetric('First Contentful Paint', entry.startTime);
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('Paint observer not supported:', e);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
          this.logMetric('Largest Contentful Paint', this.metrics.largestContentfulPaint);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // Long Tasks (for Total Blocking Time)
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              // Task longer than 50ms blocks the main thread
              console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Long task observer not supported in all browsers
      }
    }

    // Monitor page load
    if (document.readyState === 'complete') {
      this.measurePageLoad();
    } else {
      window.addEventListener('load', () => this.measurePageLoad());
    }
  }

  /**
   * Measure page load time
   */
  measurePageLoad() {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.pageLoad = navigation.loadEventEnd - navigation.fetchStart;
      this.logMetric('Page Load Time', this.metrics.pageLoad);
    }
  }

  /**
   * Log a performance metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value in milliseconds
   */
  logMetric(name, value) {
    if (!this.isEnabled) return;
    
    const color = value < 1000 ? 'green' : value < 2500 ? 'orange' : 'red';
    console.log(
      `%c⚡ ${name}: ${value.toFixed(2)}ms`,
      `color: ${color}; font-weight: bold;`
    );
  }

  /**
   * Get all collected metrics
   * @returns {Object} Performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get performance report
   * @returns {string} Formatted performance report
   */
  getReport() {
    const metrics = this.getMetrics();
    const report = [
      '=== Performance Report ===',
      `Page Load: ${metrics.pageLoad ? metrics.pageLoad.toFixed(2) + 'ms' : 'N/A'}`,
      `First Contentful Paint: ${metrics.firstContentfulPaint ? metrics.firstContentfulPaint.toFixed(2) + 'ms' : 'N/A'}`,
      `Largest Contentful Paint: ${metrics.largestContentfulPaint ? metrics.largestContentfulPaint.toFixed(2) + 'ms' : 'N/A'}`,
      '=======================',
    ].join('\n');
    
    return report;
  }

  /**
   * Log performance report
   */
  logReport() {
    if (!this.isEnabled) return;
    console.log(this.getReport());
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let monitorInstance = null;

export const getPerformanceMonitor = () => {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
};

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  const monitor = getPerformanceMonitor();
  monitor.init();
  
  // Log report after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.logReport();
    }, 2000); // Wait 2 seconds for all metrics to be collected
  });
}
