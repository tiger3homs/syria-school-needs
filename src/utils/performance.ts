
// Performance optimization utilities

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Image optimization helper
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality: number = 80): string => {
  if (!url || url.startsWith('data:')) return url;
  
  // For Supabase storage URLs, you can add transformation parameters
  if (url.includes('supabase.co')) {
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    params.set('quality', quality.toString());
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
};

// Local storage with compression for large data
export const compressedStorage = {
  set: (key: string, value: any): void => {
    try {
      const compressed = JSON.stringify(value);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.warn('Failed to store data:', error);
    }
  },
  
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to retrieve data:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// Performance monitoring
export const performanceMonitor = {
  mark: (name: string): void => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string): number | null => {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, 'measure');
        return entries.length > 0 ? entries[entries.length - 1].duration : null;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return null;
      }
    }
    return null;
  }
};

// Lazy loading intersection observer
export const createLazyLoader = (callback: (entry: IntersectionObserverEntry) => void) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }
  return null;
};
