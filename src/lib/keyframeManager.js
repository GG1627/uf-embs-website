/**
 * Keyframe Animation Manager
 * Centralizes keyframe animations in a single stylesheet instead of inline <style> tags
 * This improves performance, especially in Firefox
 */

class KeyframeManager {
  constructor() {
    this.stylesheet = null;
    this.registeredKeyframes = new Set();
    this.init();
  }

  init() {
    // Create or get a stylesheet for keyframes
    const styleId = 'dynamic-keyframes-stylesheet';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      this.stylesheet = existingStyle;
    } else {
      this.stylesheet = document.createElement('style');
      this.stylesheet.id = styleId;
      this.stylesheet.type = 'text/css';
      document.head.appendChild(this.stylesheet);
    }
  }

  /**
   * Register a keyframe animation
   * @param {string} name - Animation name (will be prefixed)
   * @param {string} keyframes - CSS keyframes string
   * @returns {string} - The actual animation name to use
   */
  registerKeyframe(name, keyframes) {
    const fullName = `dynamic-${name}`;
    
    // Skip if already registered
    if (this.registeredKeyframes.has(fullName)) {
      return fullName;
    }

    // Add keyframes to stylesheet
    const keyframeRule = `@keyframes ${fullName} { ${keyframes} }`;
    
    if (this.stylesheet.sheet) {
      try {
        this.stylesheet.sheet.insertRule(keyframeRule, this.stylesheet.sheet.cssRules.length);
        this.registeredKeyframes.add(fullName);
      } catch (e) {
        console.warn('Failed to insert keyframe rule:', e);
        // Fallback: append as text (less efficient but works)
        this.stylesheet.textContent += keyframeRule;
        this.registeredKeyframes.add(fullName);
      }
    } else {
      // Fallback for older browsers
      this.stylesheet.textContent += keyframeRule;
      this.registeredKeyframes.add(fullName);
    }

    return fullName;
  }

  /**
   * Create a slide-right animation with custom transform values
   * @param {number} index - Unique index for the animation
   * @param {number} offsetX - X offset in pixels
   * @param {number} offsetY - Y offset in pixels
   * @param {number} rotation - Rotation in degrees
   * @param {number} distance - Distance to slide in rem (default: 28rem)
   * @returns {string} - Animation name to use
   */
  createSlideAnimation(index, offsetX, offsetY, rotation, distance = 28) {
    const name = `slide-right-rotated-${index}`;
    const keyframes = `
      0% {
        transform: translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) rotate(${rotation}deg);
      }
      100% {
        transform: translate3d(calc(-50% + ${offsetX}px + ${distance}rem), calc(-50% + ${offsetY}px), 0) rotate(${rotation}deg);
      }
    `;
    
    return this.registerKeyframe(name, keyframes);
  }
}

// Singleton instance
let keyframeManagerInstance = null;

export const getKeyframeManager = () => {
  if (!keyframeManagerInstance) {
    keyframeManagerInstance = new KeyframeManager();
  }
  return keyframeManagerInstance;
};
