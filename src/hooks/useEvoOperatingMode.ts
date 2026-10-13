import { useState, useEffect, useCallback } from 'react';
import { EvoLabOperatingMode } from '../types';

const STORAGE_KEY = 'evo_operating_mode';
const EVENT_NAME = 'evo_operating_mode_change';

export function useEvoOperatingMode(): {
  mode: EvoLabOperatingMode;
  setMode: (mode: EvoLabOperatingMode) => void;
  toggleMode: () => void;
  isPericial: boolean;
  isEsencial: boolean;
} {
  const [mode, setModeState] = useState<EvoLabOperatingMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'pericial' || saved === 'esencial') {
        return saved;
      }
    } catch {
      // localStorage unavailable fallback
    }
    return 'esencial';
  });

  const setMode = useCallback((newMode: EvoLabOperatingMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, { detail: newMode })
      );
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'esencial' ? 'pericial' : 'esencial');
  }, [mode, setMode]);

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<EvoLabOperatingMode>;
      if (customEvent.detail && (customEvent.detail === 'esencial' || customEvent.detail === 'pericial')) {
        setModeState(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'esencial' || e.newValue === 'pericial')) {
        setModeState(e.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, handleModeChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_NAME, handleModeChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return {
    mode,
    setMode,
    toggleMode,
    isPericial: mode === 'pericial',
    isEsencial: mode === 'esencial',
  };
}
