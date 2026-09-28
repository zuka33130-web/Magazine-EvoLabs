import { useState, useEffect } from 'react';

export type LabAestheticMode = 'elite' | 'classic';

const STORAGE_KEY = 'evo_lab_aesthetic_mode';
const EVENT_NAME = 'evo_lab_aesthetic_mode_changed';

export const getLabAestheticMode = (): LabAestheticMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'classic') return 'classic';
    return 'elite'; // default is the ultra-refined elite lettering mode
  } catch {
    return 'elite';
  }
};

export const setLabAestheticMode = (mode: LabAestheticMode): void => {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { mode } }));
  } catch {
    // ignore
  }
};

export const toggleLabAestheticMode = (): LabAestheticMode => {
  const current = getLabAestheticMode();
  const next: LabAestheticMode = current === 'elite' ? 'classic' : 'elite';
  setLabAestheticMode(next);
  return next;
};

export const useLabAestheticMode = () => {
  const [mode, setModeState] = useState<LabAestheticMode>(getLabAestheticMode);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ mode: LabAestheticMode }>;
      if (custom.detail?.mode) {
        setModeState(custom.detail.mode);
      } else {
        setModeState(getLabAestheticMode());
      }
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const toggle = () => {
    const next = toggleLabAestheticMode();
    setModeState(next);
  };

  const setMode = (m: LabAestheticMode) => {
    setLabAestheticMode(m);
    setModeState(m);
  };

  return {
    mode,
    isElite: mode === 'elite',
    toggle,
    setMode,
  };
};
