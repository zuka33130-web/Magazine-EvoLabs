import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TutorMode,
  TutorLocation,
  TutorEvoContextValue,
} from './types';

const STORAGE_KEY_TUTOR_MODE = 'evo_tutor_mode_v1';
const STORAGE_KEY_ONBOARDING_DISMISSED = 'evo_tutor_onboarding_dismissed_v1';
const STORAGE_KEY_LAST_LOCATION = 'evo_tutor_last_location_v1';

const DEFAULT_LOCATION: TutorLocation = {
  academySection: 'MUNDO EVO',
  tomoTitle: 'Academia EVO LABS',
  whatIs: 'Centro principal de navegación y exploración de EVO LABS.',
  whatFor: 'Permite visualizar todos los Tomos, acceder al recorrido guiado y retomar tu progreso.',
  currentAction: 'Seleccioná un Tomo de la colección o hacé clic en "Continuar mi recorrido".',
  whyItMatters: 'Comprender el mapa global de la Academia te ayuda a trazar tu plan de estudio sin perderte.',
  nextStep: 'Ingresá al Tomo 01 (Conocé tu PC) para aprender la base del silicio y componentes.',
  activityType: 'mundo',
};

const TutorEvoContext = createContext<TutorEvoContextValue | null>(null);

export const TutorEvoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<TutorMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TUTOR_MODE);
      return saved === 'libre' ? 'libre' : 'guiado';
    } catch {
      return 'guiado';
    }
  });

  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [activeTutorTab, setActiveTutorTab] = useState<'explain' | 'glossary' | 'map' | 'tour'>('explain');
  const [selectedGlossaryKey, setSelectedGlossaryKey] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<TutorLocation>(DEFAULT_LOCATION);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      // If user came with direct query params like ?volume=02 or ?mode=magazine, skip onboarding
      const url = new URL(window.location.href);
      if (
        url.searchParams.get('volume') ||
        url.searchParams.get('view') ||
        url.searchParams.get('mode') ||
        url.searchParams.get('pdf') ||
        url.searchParams.get('print') === 'true'
      ) {
        return false;
      }
      return localStorage.getItem(STORAGE_KEY_ONBOARDING_DISMISSED) !== 'true';
    } catch {
      return false;
    }
  });

  const [lastSavedLocation, setLastSavedLocation] = useState<{
    tomoNumber: string;
    tomoTitle: string;
    chapterTitle: string;
    viewId: string;
    timestamp: string;
  } | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LAST_LOCATION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isReturningUser = Boolean(
    lastSavedLocation && localStorage.getItem(STORAGE_KEY_ONBOARDING_DISMISSED) === 'true'
  );

  const setMode = (newMode: TutorMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY_TUTOR_MODE, newMode);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLocation = useCallback((partial: Partial<TutorLocation>) => {
    setCurrentLocation((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const openTutorWithTerm = (termKey: string) => {
    setSelectedGlossaryKey(termKey);
    setActiveTutorTab('glossary');
    setIsTutorOpen(true);
  };

  const openTutorWithTab = (tab: 'explain' | 'glossary' | 'map' | 'tour') => {
    setActiveTutorTab(tab);
    setIsTutorOpen(true);
  };

  const startZeroKnowledgeTour = () => {
    setMode('guiado');
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING_DISMISSED, 'true');
    } catch (err) {
      console.error(err);
    }
    openTutorWithTab('tour');
  };

  const dismissOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING_DISMISSED, 'true');
    } catch (err) {
      console.error(err);
    }
  };

  const saveCurrentLocationHistory = (viewId: string, tomoNumber?: string, chapterTitle?: string) => {
    const record = {
      tomoNumber: tomoNumber || '01',
      tomoTitle: tomoNumber === '02' ? 'La Biblia Negra de Windows' : 'Conocé tu PC',
      chapterTitle: chapterTitle || 'Inicio de Recorrido',
      viewId,
      timestamp: new Date().toISOString(),
    };
    setLastSavedLocation(record);
    try {
      localStorage.setItem(STORAGE_KEY_LAST_LOCATION, JSON.stringify(record));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TutorEvoContext.Provider
      value={{
        mode,
        setMode,
        isTutorOpen,
        setIsTutorOpen,
        activeTutorTab,
        setActiveTutorTab,
        selectedGlossaryKey,
        setSelectedGlossaryKey,
        currentLocation,
        updateLocation,
        openTutorWithTerm,
        openTutorWithTab,
        isOnboardingOpen,
        setIsOnboardingOpen,
        startZeroKnowledgeTour,
        dismissOnboarding,
        isReturningUser,
        lastSavedLocation,
        saveCurrentLocationHistory,
      }}
    >
      {children}
    </TutorEvoContext.Provider>
  );
};

export const useTutorEvo = (): TutorEvoContextValue => {
  const ctx = useContext(TutorEvoContext);
  if (!ctx) {
    throw new Error('useTutorEvo must be used within a TutorEvoProvider');
  }
  return ctx;
};
