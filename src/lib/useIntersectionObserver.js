import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer API
 * Detects when an element enters or leaves the viewport
 * 
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - When to trigger (0-1, default: 0.1 = 10% visible)
 * @param {string} options.rootMargin - Margin around root (default: '200px' = start loading 200px before visible)
 * @param {boolean} options.triggerOnce - Only trigger once (default: false)
 * @returns {[React.RefObject, boolean]} - [ref to attach to element, isVisible state]
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '200px', // Start loading 200px before element is visible
  triggerOnce = false,
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip if already intersected and triggerOnce is true
    if (triggerOnce && hasIntersected) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume visible if not supported
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          setIsIntersecting(isVisible);
          
          if (isVisible && !hasIntersected) {
            setHasIntersected(true);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return [elementRef, isIntersecting, hasIntersected];
}
