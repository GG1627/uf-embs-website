/**
 * Advanced Image Preloader with Priority Queue
 * Manages image preloading with priority and browser-specific optimizations
 */

class ImagePreloader {
  constructor() {
    this.preloadedImages = new Set();
    this.loadingQueue = [];
    this.maxConcurrent = 3; // Load 3 images at a time
    this.currentlyLoading = 0;
  }

  /**
   * Preload an image with priority
   * @param {string} url - Image URL
   * @param {string} priority - 'high' | 'low' | 'auto'
   * @returns {Promise<void>}
   */
  async preload(url, priority = 'auto') {
    // Skip if already preloaded
    if (this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    // Skip if already in queue
    if (this.loadingQueue.some(item => item.url === url)) {
      return Promise.resolve();
    }

    const priorityValue = priority === 'high' ? 1 : priority === 'low' ? 3 : 2;
    
    return new Promise((resolve, reject) => {
      this.loadingQueue.push({
        url,
        priority: priorityValue,
        resolve,
        reject,
      });

      // Sort queue by priority (lower number = higher priority)
      this.loadingQueue.sort((a, b) => a.priority - b.priority);
      
      this.processQueue();
    });
  }

  /**
   * Process the loading queue
   */
  async processQueue() {
    if (this.currentlyLoading >= this.maxConcurrent || this.loadingQueue.length === 0) {
      return;
    }

    const item = this.loadingQueue.shift();
    this.currentlyLoading++;

    try {
      await this.loadImage(item.url);
      this.preloadedImages.add(item.url);
      item.resolve();
    } catch (error) {
      console.warn(`Failed to preload image: ${item.url}`, error);
      item.reject(error);
    } finally {
      this.currentlyLoading--;
      this.processQueue(); // Process next item
    }
  }

  /**
   * Load a single image
   * @param {string} url - Image URL
   * @returns {Promise<void>}
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      // Check if image is already in DOM
      const existingImg = document.querySelector(`img[src="${url}"]`);
      if (existingImg && existingImg.complete) {
        resolve();
        return;
      }

      // Use link preload for better performance
      if (!document.querySelector(`link[rel="preload"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.setAttribute('fetchpriority', 'high');
        
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload: ${url}`));
        
        document.head.appendChild(link);
      } else {
        // Already preloading via link tag, just wait a bit
        setTimeout(resolve, 100);
      }
    });
  }

  /**
   * Preload multiple images with priorities
   * @param {Array<{url: string, priority?: string}>} images - Array of image objects
   * @returns {Promise<void[]>}
   */
  async preloadBatch(images) {
    const promises = images.map(({ url, priority = 'auto' }) => 
      this.preload(url, priority)
    );
    return Promise.allSettled(promises);
  }

  /**
   * Check if an image is already preloaded
   * @param {string} url - Image URL
   * @returns {boolean}
   */
  isPreloaded(url) {
    return this.preloadedImages.has(url);
  }
}

// Singleton instance
let preloaderInstance = null;

export const getImagePreloader = () => {
  if (!preloaderInstance) {
    preloaderInstance = new ImagePreloader();
  }
  return preloaderInstance;
};
