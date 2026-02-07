import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/**
 * Throttle function for scroll performance
 */
const throttle = (func, limit) => {
  let inThrottle;
  let lastResult;
  return function(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
};

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for earlier/later triggering
 * @param {boolean} options.triggerOnce - Only animate once
 * @param {number} options.delay - Delay before animation starts (ms)
 * @param {Function} options.onVisible - Callback when element becomes visible
 * @param {Function} options.onHidden - Callback when element becomes hidden
 * @returns {Object} { ref, isVisible, hasAnimated }
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.05,
    rootMargin = '0px 0px 0px 0px',
    triggerOnce = true,
    delay = 0,
    onVisible,
    onHidden
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const handleIntersect = ([entry]) => {
      if (entry.isIntersecting) {
        const show = () => {
          setIsVisible(true);
          setHasAnimated(true);
          onVisible?.();
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(element);
          }
        };

        if (delay > 0) {
          setTimeout(show, delay);
        } else {
          show();
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
        onHidden?.();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    });

    // Use requestAnimationFrame for smoother initialization
    requestAnimationFrame(() => {
      if (ref.current && observerRef.current) {
        observerRef.current.observe(ref.current);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, onVisible, onHidden]);

  return { ref, isVisible, hasAnimated };
};

/**
 * Hook for staggered animations on multiple children
 * @param {number} childCount - Number of children to animate
 * @param {Object} options - Configuration options
 * @param {number} options.staggerDelay - Delay between each child animation (ms)
 * @param {number} options.maxDelay - Maximum total delay cap (ms)
 * @param {string} options.direction - Stagger direction: 'forward', 'reverse', 'center'
 * @returns {Object} { ref, isVisible, getDelay, getStyle }
 */
export const useStaggerAnimation = (childCount, options = {}) => {
  const {
    threshold = 0.05,
    rootMargin = '0px 0px 0px 0px',
    staggerDelay = 100,
    maxDelay = 1000,
    direction = 'forward',
    triggerOnce = true
  } = options;

  const { ref, isVisible, hasAnimated } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce
  });

  const getDelay = useCallback((index) => {
    let calculatedIndex;

    switch (direction) {
      case 'reverse':
        calculatedIndex = childCount - 1 - index;
        break;
      case 'center':
        const center = (childCount - 1) / 2;
        calculatedIndex = Math.abs(index - center);
        break;
      default:
        calculatedIndex = index;
    }

    return Math.min(calculatedIndex * staggerDelay, maxDelay);
  }, [childCount, staggerDelay, maxDelay, direction]);

  const getStyle = useCallback((index) => ({
    transitionDelay: `${getDelay(index)}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
  }), [getDelay, isVisible]);

  return { ref, isVisible, hasAnimated, getDelay, getStyle };
};

/**
 * Hook for parallax scrolling effect
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Parallax speed multiplier (0.1-1)
 * @param {string} options.direction - Direction: 'vertical', 'horizontal', 'both'
 * @param {boolean} options.disabled - Disable parallax (useful for mobile)
 * @returns {Object} { ref, offset, style }
 */
export const useParallax = (options = {}) => {
  const {
    speed = 0.5,
    direction = 'vertical',
    disabled = false
  } = typeof options === 'number' ? { speed: options } : options;

  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const updateOffset = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      const relativeScroll = scrolled - elementTop + windowHeight;

      if (relativeScroll > 0 && rect.top < windowHeight) {
        const yOffset = (scrolled - elementTop) * speed;
        const xOffset = (scrolled - elementTop) * speed * 0.5;

        setOffset({
          x: direction === 'horizontal' || direction === 'both' ? xOffset : 0,
          y: direction === 'vertical' || direction === 'both' ? yOffset : 0
        });
      }
    };

    const handleScroll = throttle(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateOffset);
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateOffset();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, direction, disabled]);

  const style = useMemo(() => ({
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    willChange: 'transform'
  }), [offset.x, offset.y]);

  return { ref, offset, style };
};

/**
 * Hook for scroll progress (0 to 1 as you scroll through element)
 * @param {Object} options - Configuration options
 * @param {Function} options.onProgress - Callback with progress value
 * @param {number} options.precision - Decimal places for progress (default: 2)
 * @returns {Object} { ref, progress, percentage }
 */
export const useScrollProgress = (options = {}) => {
  const { onProgress, precision = 2 } = options;

  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const calculateProgress = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      let newProgress;

      if (elementBottom < 0) {
        newProgress = 1;
      } else if (elementTop > windowHeight) {
        newProgress = 0;
      } else {
        const totalScrollableDistance = elementHeight + windowHeight;
        const scrolledDistance = windowHeight - elementTop;
        newProgress = Math.max(0, Math.min(1, scrolledDistance / totalScrollableDistance));
      }

      const roundedProgress = Number(newProgress.toFixed(precision));
      setProgress(roundedProgress);
      onProgress?.(roundedProgress);
    };

    const handleScroll = throttle(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateProgress);
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onProgress, precision]);

  return {
    ref,
    progress,
    percentage: Math.round(progress * 100)
  };
};

/**
 * Hook for detecting scroll direction
 * @param {number} threshold - Minimum scroll amount to detect direction
 * @returns {Object} { scrollDirection, isScrolling }
 */
export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState('none');
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) >= threshold) {
        setScrollDirection(diff > 0 ? 'down' : 'up');
        lastScrollY.current = currentScrollY;
      }

      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [threshold]);

  return { scrollDirection, isScrolling };
};

/**
 * Hook for element in viewport detection with percentage
 * @param {Object} options - Configuration options
 * @returns {Object} { ref, inView, visiblePercentage }
 */
export const useInView = (options = {}) => {
  const { threshold = 0, rootMargin = '0px' } = options;

  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [visiblePercentage, setVisiblePercentage] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setVisiblePercentage(Math.round(entry.intersectionRatio * 100));
      },
      { threshold: thresholds, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView, visiblePercentage };
};

export default useScrollAnimation;
