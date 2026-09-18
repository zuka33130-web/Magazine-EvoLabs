import React, { useState, useEffect } from 'react';
import {
  TOMO_01_HEADLINES,
  VOLUMES_COLLECTION,
  TOMO_01_CHAPTERS,
  TOMO_01_OUTCOMES,
} from './data/collections';
import { Header } from './components/Header';
import { MagazineCover } from './components/MagazineCover';
import { HorizontalCollection } from './components/HorizontalCollection';
import { EditorialIndex } from './components/EditorialIndex';
import { Chapter01View } from './components/Chapter01View';
import { Chapter02View, Chapter02Station } from './components/Chapter02View';
import { Chapter03View } from './components/Chapter03View';
import { Chapter04View } from './components/Chapter04View';
import { Chapter05View } from './components/Chapter05View';
import { Chapter06View } from './components/Chapter06View';
import { Chapter07View } from './components/Chapter07View';
import { LockedChapterModal } from './components/LockedChapterModal';
import { ChapterUnlockedCelebrationModal } from './components/ChapterUnlockedCelebrationModal';
import { getChapterRequirements, ChapterRequirementInfo } from './utils/chapterPrerequisites';
import { ChapterItem, EvoNarrativeProfile, EvoLabZone, UserHardwarePassport, Tome01DossierSummary } from './types';
import { EvoWorldMap } from './components/world/EvoWorldMap';
import { EvoIntroExperience } from './components/world/EvoIntroExperience';
import { EvoArchiveEntrance } from './components/world/EvoArchiveEntrance';
import { EvoMagazineView } from './components/magazine/EvoMagazineView';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'magazine' | 'world-map' | 'archivo' | 'cover' | 'index' | 'chapter-01' | 'chapter-02' | 'chapter-03' | 'chapter-04' | 'chapter-05' | 'chapter-06' | 'chapter-07'
  >('magazine');
  const [isIntroActive, setIsIntroActive] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<EvoNarrativeProfile>('investigador');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [userPassport, setUserPassport] = useState<UserHardwarePassport | null>(() => {
    try {
      const raw = localStorage.getItem('evo_c01_specs');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Load saved profile
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('evo_narrative_profile') as EvoNarrativeProfile | null;
      if (savedProfile) {
        setActiveProfile(savedProfile);
      }
    } catch {
      // ignore
    }
  }, []);
  
  // Navigation target station for Chapter 02
  const [c02TargetStation, setC02TargetStation] = useState<Chapter02Station | undefined>(undefined);

  // Locked chapter modal state
  const [lockedRequirements, setLockedRequirements] = useState<ChapterRequirementInfo | null>(null);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    completedNumber: string;
    completedTitle: string;
    unlockedNumber: string;
    unlockedTitle: string;
  } | null>(null);

  // Refresh chapters function
  const computeChaptersList = (): ChapterItem[] => {
    try {
      const isC01Done =
        Boolean(localStorage.getItem('evo_c01_completed')?.length) ||
        Boolean(localStorage.getItem('evo_c01_specs'));
      const isC02Unlocked = localStorage.getItem('evo_c02_unlocked') === 'true' || isC01Done;
      const isC02Completed = localStorage.getItem('evo_c02_status') === 'completed';
      const isC03Completed = localStorage.getItem('evo_c03_status') === 'completed';
      const isC03Unlocked = isC02Completed;
      const isC04Completed = localStorage.getItem('evo_c04_status') === 'completed';
      const isC04Unlocked = isC03Completed || localStorage.getItem('evo_c04_unlocked') === 'true';
      const isC05Completed = localStorage.getItem('evo_c05_status') === 'completed';
      const isC05Unlocked = isC04Completed || localStorage.getItem('evo_c05_unlocked') === 'true';

      // Chapter 06 completion strictly requires at least one completed case in evo_c06_cases
      let isC06Completed = false;
      try {
        const rawCases = localStorage.getItem('evo_c06_cases');
        if (rawCases) {
          const parsed = JSON.parse(rawCases);
          if (Array.isArray(parsed)) {
            isC06Completed = parsed.some(
              (c: any) => c && c.completed === true && c.status !== 'INVESTIGANDO'
            );
          }
        }
      } catch {
        isC06Completed = false;
      }

      // Synchronize localStorage flags if state was out of sync
      if (!isC06Completed) {
        if (localStorage.getItem('evo_c06_status') === 'completed') {
          localStorage.removeItem('evo_c06_status');
        }
        if (localStorage.getItem('evo_c07_unlocked') === 'true') {
          localStorage.removeItem('evo_c07_unlocked');
        }
      }

      const isC06Unlocked = isC05Completed || localStorage.getItem('evo_c06_unlocked') === 'true';
      const isC07Unlocked = isC06Completed;

      return TOMO_01_CHAPTERS.map((c) => {
        if (c.number === '01') {
          return { ...c, status: isC01Done ? ('COMPLETADO' as const) : ('DISPONIBLE' as const) };
        }
        if (c.number === '02') {
          if (isC02Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC02Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '03') {
          if (isC03Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC03Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '04') {
          if (isC04Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC04Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '05') {
          if (isC05Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC05Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '06') {
          if (isC06Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC06Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '07') {
          const isC07Completed =
            localStorage.getItem('evo_c07_status') === 'completed' ||
            Boolean(localStorage.getItem('evo_c07_report'));
          if (isC07Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC07Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        return { ...c, status: 'BLOQUEADO' as const };
      });
    } catch {
      return TOMO_01_CHAPTERS;
    }
  };

  // Track dynamically unlocked chapters
  const [chaptersList, setChaptersList] = useState<ChapterItem[]>(computeChaptersList);

  // Sync state whenever local storage changes
  useEffect(() => {
    const handleStorage = () => {
      setChaptersList(computeChaptersList());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isChapter02Unlocked = chaptersList.find((c) => c.number === '02')?.status !== 'BLOQUEADO';

  const handleOpenEdition = () => {
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCover = () => {
    setCurrentView('cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter01 = () => {
    setCurrentView('chapter-01');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter02 = () => {
    setC02TargetStation(undefined);
    setCurrentView('chapter-02');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter03 = () => {
    setCurrentView('chapter-03');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter04 = () => {
    setCurrentView('chapter-04');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter05 = () => {
    setCurrentView('chapter-05');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter06 = () => {
    setCurrentView('chapter-06');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIndex = () => {
    setChaptersList(computeChaptersList());
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger locked chapter requirement inspection
  const handleSelectLockedChapter = (chapter: ChapterItem) => {
    const req = getChapterRequirements(chapter.number, chaptersList);
    setLockedRequirements(req);
    setIsLockedModalOpen(true);
  };

  // Direct navigation from "IR A LO QUE FALTA"
  const handleGoToMissing = (targetChapterNumber: string, targetStationOrSection?: string) => {
    setIsLockedModalOpen(false);

    if (targetChapterNumber === '01') {
      setCurrentView('chapter-01');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '02') {
      if (targetStationOrSection) {
        setC02TargetStation(targetStationOrSection as Chapter02Station);
      }
      setCurrentView('chapter-02');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '03') {
      setCurrentView('chapter-03');
      if (targetStationOrSection) {
        setTimeout(() => {
          const el = document.getElementById(targetStationOrSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (targetChapterNumber === '04') {
      setCurrentView('chapter-04');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '05') {
      setCurrentView('chapter-05');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '06') {
      setCurrentView('chapter-06');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '07') {
      setCurrentView('chapter-07');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default fallback
    setCurrentView('index');
  };

  const handleStartChapter07 = () => {
    setCurrentView('chapter-07');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completion of Chapter 01
  const handleChapterCompleted = () => {
    try {
      localStorage.setItem('evo_c02_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '01',
      completedTitle: 'CONOCÉ TU PC',
      unlockedNumber: '02',
      unlockedTitle: 'CÓMO TRABAJAN JUNTOS',
    });

    setActiveNotice(
      '¡Capítulo 01 completado! Se ha generado tu Pasaporte EVO y desbloqueado el Capítulo 02: CÓMO TRABAJAN JUNTOS.'
    );

    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completion of Chapter 02
  const handleChapter02Completed = () => {
    try {
      localStorage.setItem('evo_c02_status', 'completed');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '02',
      completedTitle: 'CÓMO TRABAJAN JUNTOS',
      unlockedNumber: '03',
      unlockedTitle: 'CUANDO LOS FPS MIENTEN',
    });

    setActiveNotice(
      '¡Capítulo 02 completado! Se ha consolidado tu Mapa de Flujo 001 y desbloqueado el Capítulo 03: CUANDO LOS FPS MIENTEN.'
    );
  };

  // Completion of Chapter 03
  const handleChapter03Completed = () => {
    try {
      localStorage.setItem('evo_c03_status', 'completed');
      localStorage.setItem('evo_c04_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '03',
      completedTitle: 'CUANDO LOS FPS MIENTEN',
      unlockedNumber: '04',
      unlockedTitle: 'ENCONTRÁ EL LÍMITE',
    });

    setActiveNotice(
      '¡Capítulo 03 completado! Se ha generado tu Perfil de Fluidez EVO 001 y desbloqueado el Capítulo 04: ENCONTRÁ EL LÍMITE.'
    );
  };

  // Completion of Chapter 04
  const handleChapter04Completed = () => {
    try {
      localStorage.setItem('evo_c04_status', 'completed');
      localStorage.setItem('evo_c05_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '04',
      completedTitle: 'ENCONTRÁ EL LÍMITE',
      unlockedNumber: '05',
      unlockedTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
    });

    setActiveNotice(
      '¡Capítulo 04 completado! Se ha consolidado tu Matriz de Limitación EVO 001 y desbloqueado el Capítulo 05.'
    );
  };

  // Completion of Chapter 05
  const handleChapter05Completed = () => {
    try {
      localStorage.setItem('evo_c05_status', 'completed');
      localStorage.setItem('evo_c06_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '05',
      completedTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
      unlockedNumber: '06',
      unlockedTitle: 'TALLER EVO // DIAGNÓSTICO EN PROFUNDIDAD',
    });

    setActiveNotice(
      '¡Capítulo 05 completado! Se han consolidado tus Artefactos de Optimización Controlada.'
    );
  };

  // Completion of Chapter 06
  const handleChapter06Completed = () => {
    try {
      localStorage.setItem('evo_c06_status', 'completed');
      localStorage.setItem('evo_c07_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '06',
      completedTitle: 'TALLER EVO // ENCONTRÁ LA FALLA',
      unlockedNumber: '07',
      unlockedTitle: 'LABORATORIO FINAL // OPTIMIZACIÓN A/B',
    });

    setActiveNotice(
      '¡Capítulo 06 completado! Se ha consolidado tu Expediente de Diagnóstico EVO 001 y desbloqueado el Capítulo 07.'
    );
  };

  // Completion of Chapter 07 (Tomo 01 Finale)
  const handleChapter07Completed = () => {
    try {
      localStorage.setItem('evo_c07_status', 'completed');
      localStorage.setItem('evo_tome01_status', 'completed');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setActiveNotice(
      '¡Capítulo 07 completado! Se ha generado tu Informe de Laboratorio EVO 001 y el Dossier del Tomo 01.'
    );
  };

  const handleEnterZone = (zone: EvoLabZone) => {
    if (zone.id === 'zona-3') {
      setCurrentView('archivo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveNotice(
        `Sector ${zone.number} // ${zone.title}: Este sector está siendo preparado con 3 módulos de investigación.`
      );
    }
  };

  const handleOpenVolume = (volume: (typeof VOLUMES_COLLECTION)[0]) => {
    if (!volume.isLocked && volume.id === 'tomo-01') {
      handleOpenEdition();
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('world-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateArchive = () => {
    setCurrentView('archivo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTomo01 = () => {
    setCurrentView('cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTomo01 = () => {
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeProfile = (newProfile: EvoNarrativeProfile) => {
    setActiveProfile(newProfile);
    try {
      localStorage.setItem('evo_narrative_profile', newProfile);
    } catch {
      // ignore
    }
  };

  // Completed chapters count & dossier summary
  const completedChaptersCount = chaptersList.filter((c) => c.status === 'COMPLETADO').length;

  const dossierSummary: Tome01DossierSummary = {
    passport: Boolean(localStorage.getItem('evo_c01_specs')),
    flowMap: localStorage.getItem('evo_c02_status') === 'completed',
    fluidezProfile: localStorage.getItem('evo_c03_status') === 'completed',
    limitMatrix: localStorage.getItem('evo_c04_status') === 'completed',
    activityMap: localStorage.getItem('evo_c05_status') === 'completed',
    optimizationLog: (() => {
      try {
        const rawCases = localStorage.getItem('evo_c06_cases');
        if (rawCases) {
          const parsed = JSON.parse(rawCases);
          return Array.isArray(parsed) && parsed.some((c: any) => c?.completed === true);
        }
        return false;
      } catch {
        return false;
      }
    })(),
    diagnosticCase:
      localStorage.getItem('evo_c07_status') === 'completed' ||
      Boolean(localStorage.getItem('evo_c07_report')),
    labReport:
      localStorage.getItem('evo_c07_status') === 'completed' ||
      Boolean(localStorage.getItem('evo_c07_report')),
    allCompleted: completedChaptersCount >= 7,
  };

  // Fullscreen Cinematic Intro
  if (isIntroActive) {
    return (
      <EvoIntroExperience
        onComplete={(selectedProfile) => {
          if (selectedProfile) {
            handleChangeProfile(selectedProfile);
          }
          try {
            localStorage.setItem('evo_intro_seen', 'true');
          } catch {
            // ignore
          }
          setIsIntroActive(false);
          setCurrentView('magazine');
        }}
        onSkip={() => {
          try {
            localStorage.setItem('evo_intro_seen', 'true');
          } catch {
            // ignore
          }
          setIsIntroActive(false);
          setCurrentView('magazine');
        }}
      />
    );
  }

  // Dedicated Editorial Magazine View (A4 Print-Ready Digital Magazine)
  if (currentView === 'magazine') {
    return (
      <EvoMagazineView
        onBackToApp={handleNavigateHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f6] flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Header: EVO LABS, Tomo 01, Edición 01, con acento ámbar */}
      <Header
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onNavigateArchive={handleNavigateArchive}
        onNavigateTomo01={handleNavigateTomo01}
        onNavigateMagazine={() => setCurrentView('magazine')}
        activeProfile={activeProfile}
        onReplayIntro={() => setIsIntroActive(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentView === 'world-map' && (
          <EvoWorldMap
            passport={userPassport}
            completedChaptersCount={completedChaptersCount}
            onEnterZone={handleEnterZone}
          />
        )}

        {currentView === 'archivo' && (
          <EvoArchiveEntrance
            dossierSummary={dossierSummary}
            onEnterTome01={handleExploreTomo01}
            onEnterMagazine={() => setCurrentView('magazine')}
            onBackToMap={handleNavigateHome}
          />
        )}

        {currentView === 'cover' && (
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-6">
            {/* Cover: Strong headline, subtitle, 3 secondary headlines, single image, single CTA */}
            <MagazineCover
              headlines={TOMO_01_HEADLINES}
              onOpenEdition={handleOpenEdition}
              onOpenA4Magazine={() => setCurrentView('magazine')}
              onBackToWorldMap={handleNavigateHome}
            />

            {/* Horizontal collection of 4 volumes with locked states and real mini-covers */}
            <HorizontalCollection
              volumes={VOLUMES_COLLECTION}
              onOpenVolume={handleOpenVolume}
            />
          </div>
        )}

        {currentView === 'index' && (
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12">
            {/* Editorial Index View for Tomo 01 */}
            <EditorialIndex
              chapters={chaptersList}
              outcomes={TOMO_01_OUTCOMES}
              onBackToCover={() => setCurrentView('archivo')}
              onOpenA4Magazine={() => setCurrentView('magazine')}
              onBackToWorldMap={handleNavigateHome}
              onStartResearch={handleStartChapter01}
              onStartChapter02={handleStartChapter02}
              onStartChapter03={handleStartChapter03}
              onStartChapter04={handleStartChapter04}
              onStartChapter05={handleStartChapter05}
              onStartChapter06={handleStartChapter06}
              onStartChapter07={handleStartChapter07}
              onSelectLockedChapter={handleSelectLockedChapter}
            />
          </div>
        )}

        {currentView === 'chapter-01' && (
          /* CHAPTER 01 FULL INTERACTIVE MODEL VIEW */
          <Chapter01View
            onBackToIndex={handleBackToIndex}
            onChapterCompleted={handleChapterCompleted}
            isChapter02Unlocked={!!isChapter02Unlocked}
          />
        )}

        {currentView === 'chapter-02' && (
          /* CHAPTER 02 FULL INTERACTIVE MODEL VIEW */
          <Chapter02View
            onBackToIndex={handleBackToIndex}
            onChapterCompleted={handleChapter02Completed}
            initialStation={c02TargetStation}
            onOpenChapter03={handleStartChapter03}
          />
        )}

        {currentView === 'chapter-03' && (
          /* CHAPTER 03 FULL INTERACTIVE MODEL VIEW */
          <Chapter03View
            onBackToIndex={handleBackToIndex}
            onOpenChapter02={handleStartChapter02}
            onChapterCompleted={handleChapter03Completed}
          />
        )}

        {currentView === 'chapter-04' && (
          /* CHAPTER 04 FULL INTERACTIVE MODEL VIEW */
          <Chapter04View
            onBackToIndex={handleBackToIndex}
            onOpenChapter03={handleStartChapter03}
            onChapterCompleted={handleChapter04Completed}
          />
        )}

        {currentView === 'chapter-05' && (
          /* CHAPTER 05 FULL INTERACTIVE MODEL VIEW */
          <Chapter05View
            onBackToIndex={handleBackToIndex}
            onOpenChapter04={handleStartChapter04}
            onOpenChapter06={handleStartChapter06}
            onChapterCompleted={handleChapter05Completed}
          />
        )}

        {currentView === 'chapter-06' && (
          /* CHAPTER 06 FULL INTERACTIVE MODEL VIEW */
          <Chapter06View
            onBackToIndex={handleBackToIndex}
            onOpenChapter07={handleStartChapter07}
            onChapterCompleted={handleChapter06Completed}
          />
        )}

        {currentView === 'chapter-07' && (
          /* CHAPTER 07 FULL INTERACTIVE MODEL VIEW */
          <Chapter07View
            onBackToIndex={handleBackToIndex}
            onChapterCompleted={handleChapter07Completed}
          />
        )}
      </main>

      {/* Modal: Locked Chapter Requirements (UX enriquecida y contextual) */}
      <LockedChapterModal
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        requirements={lockedRequirements}
        onGoToMissing={handleGoToMissing}
      />

      {/* Modal: Chapter Unlocked Celebration (Estética sobria, editorial EVO LABS) */}
      {celebrationData && (
        <ChapterUnlockedCelebrationModal
          isOpen={!!celebrationData}
          onClose={() => setCelebrationData(null)}
          completedChapterNumber={celebrationData.completedNumber}
          completedChapterTitle={celebrationData.completedTitle}
          unlockedChapterNumber={celebrationData.unlockedNumber}
          unlockedChapterTitle={celebrationData.unlockedTitle}
          onOpenNextChapter={() => {
            if (celebrationData.unlockedNumber === '02') {
              handleStartChapter02();
            } else if (celebrationData.unlockedNumber === '03') {
              handleStartChapter03();
            } else if (celebrationData.unlockedNumber === '04') {
              handleStartChapter04();
            } else if (celebrationData.unlockedNumber === '05') {
              handleStartChapter05();
            } else if (celebrationData.unlockedNumber === '06') {
              handleStartChapter06();
            } else if (celebrationData.unlockedNumber === '07') {
              handleStartChapter07();
            } else {
              handleBackToIndex();
            }
          }}
        />
      )}

      {/* Subtle Toast / Notification */}
      {activeNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#16171d] border border-yellow-400 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 text-xs font-mono-tech animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-yellow-400 block mb-1">
              EVO LABS // EXPEDIENTE ACTUALIZADO
            </span>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              {activeNotice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveNotice(null)}
            className="text-zinc-400 hover:text-white cursor-pointer p-1"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Minimal Footer: Clean & Unobtrusive */}
      <footer className="border-t border-zinc-800/60 py-8 bg-[#0a0b0d] text-zinc-400 text-xs font-mono-tech">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="font-display font-bold text-white uppercase tracking-tight">
              EVO LABS
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Tomo 01 // Edición 01</span>
          </div>

          <div className="text-zinc-400 text-[11px] tracking-wider uppercase">
            PUBLICACIÓN EDITORIAL DE ARQUITECTURA DE COMPUTADORAS
          </div>
        </div>
      </footer>
    </div>
  );
}
