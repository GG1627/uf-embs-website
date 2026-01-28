import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

/**
 * Hook to lazy render components only when they're near the viewport
 * This dramatically reduces initial render cost and DOM complexity
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.rootMargin - Margin for intersection observer (default: '500px' - start rendering 500px before visible)
 * @param {number} options.threshold - Threshold for intersection (default: 0)
 * @param {boolean} options.triggerOnce - Only trigger once (default: false)
 * @returns {[boolean, React.RefObject]} - [shouldRender, ref]
 */
export function useLazyRender({
  rootMargin = '500px', // Start rendering 500px before element is visible
  threshold = 0,
  triggerOnce = false,
} = {}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [elementRef, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    if (isIntersecting || (triggerOnce && hasIntersected)) {
      setShouldRender(true);
    }
  }, [isIntersecting, hasIntersected, triggerOnce]);

  return [shouldRender, elementRef];
}
