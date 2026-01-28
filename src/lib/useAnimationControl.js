import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

/**
 * Custom hook to control animations based on visibility
 * Pauses animations when element is off-screen for better performance
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable animation control (default: true)
 * @param {string} options.rootMargin - Margin for intersection observer (default: '50px')
 * @param {number} options.threshold - Threshold for intersection (default: 0)
 * @returns {React.RefObject} - ref to attach to animated element
 */
export function useAnimationControl({
  enabled = true,
  rootMargin = '50px',
  threshold = 0,
} = {}) {
  const [elementRef, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: false,
  });
  const internalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    
    const element = internalRef.current || elementRef.current;
    if (!element) return;
    
    // Get the animation name from computed style
    const computedStyle = window.getComputedStyle(element);
    const animationName = computedStyle.animationName;
    
    if (!animationName || animationName === 'none') return;

    if (isIntersecting) {
      // Element is visible - resume animation
      element.style.animationPlayState = 'running';
    } else {
      // Element is off-screen - pause animation
      element.style.animationPlayState = 'paused';
    }
  }, [isIntersecting, enabled, elementRef]);

  // Return a combined ref callback
  return (node) => {
    internalRef.current = node;
    if (typeof elementRef === 'function') {
      elementRef(node);
    } else if (elementRef && elementRef.current !== undefined) {
      elementRef.current = node;
    }
  };
}
