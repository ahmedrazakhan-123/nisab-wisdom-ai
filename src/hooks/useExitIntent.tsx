import { useState, useEffect, useCallback } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  threshold?: number;
  delay?: number;
  onExitIntent?: () => void;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    enabled = true,
    threshold = 5,
    delay = 1000,
    onExitIntent
  } = options;

  const [isTriggered, setIsTriggered] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    if (!enabled || hasShown) return;
    
    // Check if mouse is leaving from the top of the viewport
    if (event.clientY <= threshold) {
      setIsTriggered(true);
      if (onExitIntent) {
        setTimeout(onExitIntent, delay);
      }
    }
  }, [enabled, hasShown, threshold, delay, onExitIntent]);

  const handleScroll = useCallback(() => {
    if (!enabled || hasShown) return;
    
    // Trigger on scroll up (indicating user might be leaving)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop < 100) {
      setIsTriggered(true);
      if (onExitIntent) {
        setTimeout(onExitIntent, delay);
      }
    }
  }, [enabled, hasShown, delay, onExitIntent]);

  const handleVisibilityChange = useCallback(() => {
    if (!enabled || hasShown) return;
    
    // Trigger when user switches tabs
    if (document.hidden) {
      setIsTriggered(true);
      if (onExitIntent) {
        setTimeout(onExitIntent, delay);
      }
    }
  }, [enabled, hasShown, delay, onExitIntent]);

  useEffect(() => {
    if (!enabled) return;

    // Check if exit intent was already shown in this session
    const sessionShown = sessionStorage.getItem('nisab-exit-intent-shown');
    if (sessionShown) {
      setHasShown(true);
      return;
    }

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, handleMouseLeave, handleScroll, handleVisibilityChange]);

  const markAsShown = useCallback(() => {
    setHasShown(true);
    sessionStorage.setItem('nisab-exit-intent-shown', 'true');
  }, []);

  const reset = useCallback(() => {
    setIsTriggered(false);
    setHasShown(false);
    sessionStorage.removeItem('nisab-exit-intent-shown');
  }, []);

  return {
    isTriggered,
    hasShown,
    markAsShown,
    reset
  };
}