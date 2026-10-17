import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
  FlaskConical,
  RotateCcw,
  Check,
  Compass,
  Map,
  HelpCircle,
} from 'lucide-react';
import { ChapterItem } from '../types';
import { TutorReturningUserBanner } from './tutor/TutorReturningUserBanner';
import { TutorTomo01TourModal } from './tutor/TutorTomo01TourModal';
import { TutorTomo01WelcomeModal } from './tutor/TutorTomo01WelcomeModal';
import { TutorProgressMapModal } from './tutor/TutorProgressMapModal';
import { TutorPreFlightModal } from './tutor/TutorPreFlightModal';
import { useTutorEvo } from './tutor/TutorEvoContext';
import { useEvoAccess } from '../auth/EvoAccessContext';
import {
  isTomo01ExamPassed,
  areAllTomo01ChaptersComplete,
  isTomo01Complete,
} from '../utils/tomo01Progress';

interface EditorialIndexProps {
  chapters: ChapterItem[];
  outcomes: string[];
  onBackToCover: () => void;
  onOpenA4Magazine?: () => void;
  onOpenLab?: () => void;
  onBackToWorldMap?: () => void;
  onStartResearch: () => void;
  onStartChapter02?: () => void;
  onStartChapter03?: () => void;
  onStartChapter04?: () => void;
  onStartChapter05?: () => void;
  onStartChapter06?: () => void;
  onStartChapter07?: () => void;
  onSelectLockedChapter?: (chapter: ChapterItem) => void;
  onStartFinalExam?: () => void;
  onOpenCompletionScreen?: () => void;
}

export const EditorialIndex: React.FC<EditorialIndexProps> = ({
  chapters,
  outcomes,
  onBackToCover,
  onOpenA4Magazine,
  onOpenLab,
  onBackToWorldMap,
  onStartResearch,
  onStartChapter02,
  onStartChapter03,
  onStartChapter04,
  onStartChapter05,
  onStartChapter06,
  onStartChapter07,
  onSelectLockedChapter,
  onStartFinalExam,
  onOpenCompletionScreen,
}) => {
  const { openTutorWithTab, setMode, lastSavedLocation } = useTutorEvo();
  const { canAccess, openUpgradeModal, isFreeUser } = useEvoAccess();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [preFlightType, setPreFlightType] = useState<'EXAM' | 'LAB' | null>(null);

  const completedCount = chapters.filter((c) => c.status === 'COMPLETADO').length;
  const isAllChaptersDone = areAllTomo01ChaptersComplete();
  const hasPassedFinalExam = isTomo01ExamPassed();
  const isTomo01FullyDone = isTomo01Complete();

  // Identify latest active chapter for returning user fallback
  const latestActiveChapter = useMemo(() => {
    const firstAvailable = chapters.find((c) => c.status === 'DISPONIBLE');
    if (firstAvailable) return firstAvailable;
    const completedOnes = chapters.filter((c) => c.status === 'COMPLETADO');
    if (completedOnes.length > 0) return completedOnes[completedOnes.length - 1];
    return chapters[0];
  }, [chapters]);

  // Compute exact resume destination using stored Tutor EVO real location
  const resumeTarget = useMemo(() => {
    if (lastSavedLocation && lastSavedLocation.tomoNumber === '01') {
      if (lastSavedLocation.viewId && lastSavedLocation.viewId.startsWith('chapter-')) {
        const num = lastSavedLocation.viewId.replace('chapter-', '');
        const matching = chapters.find((c) => c.number === num);
        if (matching) {
          return {
            type: 'chapter' as const,
            chapterNumber: matching.number,
            chapterTitle: matching.title,
          };
        }
      } else if (lastSavedLocation.viewId === 'tomo01-quiz') {
        return {
          type: 'exam' as const,
          chapterNumber: '07',
          chapterTitle: 'Examen Final Pericial',
        };
      } else if (lastSavedLocation.viewId === 'hotswap-lab') {
        return {
          type: 'lab' as const,
          chapterNumber: '01',
          chapterTitle: 'Laboratorio de Hardware',
        };
      }
    }
    return {
      type: 'chapter' as const,
      chapterNumber: latestActiveChapter.number,
      chapterTitle: latestActiveChapter.title,
    };
  }, [lastSavedLocation, chapters, latestActiveChapter]);

  const handleStartChapterByNumber = (chNum: string) => {
    if (chNum === '01') onStartResearch();
    else if (chNum === '02' && onStartChapter02) onStartChapter02();
    else if (chNum === '03' && onStartChapter03) onStartChapter03();
    else if (chNum === '04' && onStartChapter04) onStartChapter04();
    else if (chNum === '05' && onStartChapter05) onStartChapter05();
    else if (chNum === '06' && onStartChapter06) onStartChapter06();
    else if (chNum === '07' && onStartChapter07) onStartChapter07();
    else onStartResearch();
  };

  const handleResumeWhereILeft = () => {
    if (resumeTarget.type === 'chapter') {
      handleStartChapterByNumber(resumeTarget.chapterNumber);
    } else if (resumeTarget.type === 'exam' && onStartFinalExam) {
      onStartFinalExam();
    } else if (resumeTarget.type === 'lab' && onOpenLab) {
      onOpenLab();
    } else {
      handleStartChapterByNumber(latestActiveChapter.number);
    }
  };

  const getChapterDisplayStatus = (cap: ChapterItem) => {
    if (cap.status === 'COMPLETADO') {
      return { label: 'TERMINADO ✓', style: 'bg-zinc-900 border border-emerald-500/60 text-emerald-400' };
    }
    const isStarted =
      typeof window !== 'undefined' &&
      localStorage.getItem(`evo_c${cap.number}_started`) === 'true';

    if (isStarted) {
      return { label: 'EN CURSO', style: 'bg-yellow-400/20 border border-yellow-400 text-yellow-300' };
    }

    if (cap.status === 'DISPONIBLE') {
      return { label: 'NO INICIADO', style: 'bg-zinc-900 border border-zinc-700 text-zinc-300' };
    }

    return { label: 'BLOQUEADO', style: 'bg-black/60 border border-zinc-800 text-zinc-500' };
  };
  return (
    <div id="pantalla-indice-editorial" data-evo-tour="index" className="w-full min-h-screen py-6 sm:py-10 lg:py-14">
      
      {/* Editorial Navigation Top Bar */}
      <nav className="flex items-center justify-between pb-5 mb-10 sm:mb-14 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToCover}
            data-evo-tour="cover"
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-portada"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A PORTADA</span>
          </button>

          {onBackToWorldMap && (
            <>
              <span className="text-zinc-600 text-xs font-mono-tech">•</span>
              <button
                type="button"
                onClick={onBackToWorldMap}
                className="inline-flex items-center gap-1.5 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
              >
                <span>MAPA MUNDO</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="tracking-widest uppercase text-white font-bold">
            TOMO 01 // ÍNDICE
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-yellow-400 font-bold tracking-wider">7 CAPÍTULOS</span>
        </div>
      </nav>

      {/* Main Magazine Index Header: Spacious, high contrast */}
      <header className="mb-6 sm:mb-8 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 mb-2.5 tracking-widest uppercase font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
          <span>TOMO 01 // GUÍA EDITORIAL</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-[0.93] mb-4">
          CONOCÉ TU PC
        </h1>

        <p className="font-sans-editorial text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed italic mb-4">
          “De mirar especificaciones a entender realmente cómo trabaja tu máquina.”
        </p>

        {/* Herramientas de apoyo (visualmente subordinadas) */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono-tech text-zinc-400">
          <button
            type="button"
            onClick={() => setIsTourOpen(true)}
            className="hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tour de interfaz</span>
          </button>
          <span className="text-zinc-700">•</span>
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mapa de recorrido</span>
          </button>
          <span className="text-zinc-700">•</span>
          <button
            type="button"
            onClick={() => openTutorWithTab('explain')}
            className="hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            <span>Glosario y conceptos</span>
          </button>
        </div>
      </header>

      {/* Returning User Banner */}
      {(completedCount > 0 || (lastSavedLocation && lastSavedLocation.tomoNumber === '01')) && (
        <div className="mb-6">
          <TutorReturningUserBanner
            lastChapterNumber={resumeTarget.chapterNumber}
            lastChapterTitle={resumeTarget.chapterTitle}
            completedCount={completedCount}
            onContinue={handleResumeWhereILeft}
            onOpenMap={() => setIsMapOpen(true)}
          />
        </div>
      )}

      {/* Direct A4 Magazine Access Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-yellow-400/15 via-[#141720] to-[#10121a] border border-yellow-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-xl">
        <div className="flex items-center gap-3.5">
          <span className="w-3 h-3 bg-yellow-400 inline-block shadow-[0_0_10px_#facc15]" />
          <div>
            <span className="font-mono-tech text-[10px] text-yellow-400 font-bold uppercase tracking-wider block">
              EDICIÓN FACSIMILAR // 46 PÁGINAS A4
            </span>
            <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight">
              REVISTA A4 // CONOCÉ TU PC
            </h3>
            <p className="text-xs text-zinc-300 font-sans-editorial max-w-2xl mt-0.5">
              Lectura continua en formato facsimilar A4 con esquemas de silicio, telemetría de frametime, buses y descarga PDF.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onOpenA4Magazine && (
            <button
              type="button"
              onClick={onOpenA4Magazine}
              className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/30"
            >
              ABRIR REVISTA A4 →
            </button>
          )}
          {onOpenLab && (
            <button
              type="button"
              data-evo-tour="laboratory"
              onClick={onOpenLab}
              className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/50 text-yellow-300 font-mono-tech font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              IR AL LABORATORIO →
            </button>
          )}
        </div>
      </div>

      {/* FINAL EXAM & COMPLETION HANDOFF BANNER */}
      {(isAllChaptersDone || hasPassedFinalExam) && (
        <div data-evo-tour="exam" className="p-6 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-[#181a24] to-[#10121a] border-2 border-yellow-400 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-widest">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>
                {hasPassedFinalExam
                  ? 'TOMO 01 // COMPLETADO Y CERTIFICADO'
                  : 'FASE FINAL // EVALUACIÓN DISPONIBLE'}
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {hasPassedFinalExam ? '¡TOMO 01 SUPERADO CON ÉXITO!' : 'TOMO 01 // PRUEBA FINAL EVO'}
            </h3>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {hasPassedFinalExam
                ? 'Has demostrado dominio de los conceptos y metodología de este Tomo. Podés acceder al cierre oficial y al laboratorio práctico asociado.'
                : 'Completaste los 7 capítulos del Tomo 01. Demostrá tus conocimientos en la prueba final con método pericial.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {hasPassedFinalExam && onOpenCompletionScreen && (
              <button
                type="button"
                onClick={onOpenCompletionScreen}
                className="px-6 py-3.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-yellow-400/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-black" />
                <span>VER CIERRE Y LABORATORIO →</span>
              </button>
            )}

            {onStartFinalExam && (
              isFreeUser ? (
                <button
                  type="button"
                  onClick={() => openUpgradeModal('Examen Final // Certificación Oficial Tomo 01')}
                  className="px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 shadow-lg"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>REQUIERE PLAN // CERTIFICACIÓN OFICIAL</span>
                </button>
              ) : (
                <button
                  type="button"
                  data-evo-tour="exam"
                  onClick={onStartFinalExam}
                  className={`px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasPassedFinalExam
                      ? 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-yellow-400'
                      : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-xl'
                  }`}
                >
                  {hasPassedFinalExam ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>REPETIR PRUEBA FINAL</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>REALIZAR PRUEBA FINAL EVO →</span>
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Two Column Layout: Main Chapters Stream vs. Lateral Key Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Stream: 7 Chapters with Clear Visual Hierarchy & Quick Scan (8 cols) */}
        <section className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 text-[11px] font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>MAPA DE INVESTIGACIÓN // 7 CAPÍTULOS</span>
            <span className="text-yellow-400 font-semibold">{completedCount} / 7 CAPÍTULOS TERMINADOS</span>
          </div>

          <div className="space-y-6">
            {chapters.map((cap) => {
              const isAvailable = cap.status === 'DISPONIBLE';
              const isCompleted = cap.status === 'COMPLETADO';
              const statusObj = getChapterDisplayStatus(cap);

              if (cap.number === '01') {
                /* CAPÍTULO 01 - PROTAGONISTA / PUNTO DE ENTRADA HERO */
                return (
                  <article
                    key={cap.number}
                    id={`capitulo-${cap.number}`}
                    data-evo-tour="chapter"
                    className={`relative rounded-2xl border-2 p-6 sm:p-8 shadow-2xl transition-all duration-300 group ${
                      isCompleted
                        ? 'border-yellow-400/60 bg-gradient-to-br from-[#121318] via-[#101115] to-[#0c0d10]'
                        : 'border-yellow-400 bg-gradient-to-br from-[#181920] via-[#13141a] to-[#0c0d11] shadow-yellow-400/5'
                    }`}
                  >
                    {/* Header badge & status */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-tech uppercase font-black tracking-widest bg-yellow-400 text-black">
                          {cap.categoryTag || 'PUNTO DE PARTIDA'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-black tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          DEMO // INCLUIDO EN PLAN GRATIS
                        </span>
                        <span className="text-[11px] font-mono-tech text-yellow-400 font-bold tracking-wider hidden sm:inline">
                          {isCompleted ? 'EVIDENCIA REGISTRADA' : 'COMENZÁ POR ACÁ'}
                        </span>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest ${statusObj.style}`}>
                        {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{statusObj.label}</span>
                      </span>
                    </div>

                    {/* Main content grid for Chapter 01 */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                      
                      {/* Big Number + High Impact Visual */}
                      <div className="flex items-center gap-5 shrink-0">
                        <span className="font-mono-tech font-black text-5xl sm:text-6xl text-yellow-400 tracking-tighter leading-none w-16">
                          {cap.number}
                        </span>

                        <div data-evo-tour="visual" className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-900 border-2 border-yellow-400/60 shadow-xl shrink-0">
                          <img
                            src={cap.visualImage}
                            alt="Visual de microprocesador y zócalo de silicio"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Titles */}
                      <div className="flex-1 space-y-1">
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-snug">
                          {cap.title}
                        </h2>
                        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-snug">
                          {cap.subtitle}
                        </p>
                      </div>

                    </div>

                    {/* Quick Scan Microcopy: APRENDÉS / HACÉS / DESBLOQUEA */}
                    <div data-evo-tour="practice" className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-black/50 border border-zinc-800 mb-6 text-xs font-mono-tech">
                      <div className="space-y-1">
                        <span className="text-yellow-400 font-bold block tracking-wider uppercase text-[10px]">
                          1. APRENDÉS:
                        </span>
                        <p className="font-sans-editorial text-zinc-200 text-xs leading-snug">
                          {cap.aprende}
                        </p>
                      </div>

                      <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-white font-bold block tracking-wider uppercase text-[10px]">
                          2. HACÉS:
                        </span>
                        <p className="font-sans-editorial text-zinc-200 text-xs leading-snug">
                          {cap.hace}
                        </p>
                      </div>

                      <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
                        <span className="text-yellow-300 font-bold block tracking-wider uppercase text-[10px]">
                          3. DESBLOQUEA:
                        </span>
                        <p className="font-sans-editorial text-zinc-200 text-xs leading-snug">
                          {cap.desbloquea}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Ficha técnica completada. Podés volver a consultar o editar tu Pasaporte.'
                          : 'Capítulo activo para iniciar tu diagnóstico pericial.'}
                      </span>

                      <button
                        type="button"
                        id="btn-comenzar-investigacion"
                        data-evo-tour="check"
                        onClick={onStartResearch}
                        className={`inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-mono-tech text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xl group/btn ${
                          isCompleted
                            ? 'bg-zinc-850 hover:bg-zinc-750 text-zinc-300 border border-zinc-750 font-bold'
                            : 'bg-yellow-400 text-black hover:bg-yellow-300 font-black shadow-yellow-400/20 hover:shadow-yellow-400/30'
                        }`}
                      >
                        <span>{isCompleted ? 'REVISAR INVESTIGACIÓN' : 'COMENZAR INVESTIGACIÓN'}</span>
                        <ArrowRight className={`w-4 h-4 ${isCompleted ? 'text-zinc-400' : 'text-black'} group-hover/btn:translate-x-1 transition-transform`} />
                      </button>
                    </div>

                  </article>
                );
              }

              /* CAPÍTULOS 02 AL 07 - BLOQUEADOS CON ALTO CONTRASTE, DESEO EDITORIAL Y CURIOSIDAD */
              const accent = cap.accentColor || '#71717a';

              const isLocked = !isAvailable && !isCompleted;

              if (isLocked) {
                return (
                  <article
                    key={cap.number}
                    id={`capitulo-${cap.number}`}
                    onClick={() => {
                      if (onSelectLockedChapter) {
                        onSelectLockedChapter(cap);
                      }
                    }}
                    className="rounded-xl border border-zinc-900/60 bg-[#0b0d12]/40 p-4 transition-all duration-300 group relative overflow-hidden cursor-pointer hover:border-zinc-700 hover:bg-[#0e1118]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-zinc-950/80 text-zinc-500 border border-zinc-900">
                        {cap.categoryTag}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLockedChapter?.(cap);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest bg-zinc-950 border border-zinc-900 text-zinc-500 group-hover:text-yellow-400/80 group-hover:border-yellow-400/40 transition-colors cursor-pointer"
                        title="Ver requisitos para desbloquear este capítulo"
                      >
                        <Lock className="w-2.5 h-2.5 text-zinc-500 group-hover:text-yellow-400/80 transition-colors" />
                        <span>BLOQUEADO • REQUISITOS</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono-tech font-black text-2xl text-zinc-600 group-hover:text-zinc-400 shrink-0 w-8 transition-colors">
                        {cap.number}
                      </span>
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
                        <img
                          src={cap.visualImage}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center grayscale"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-sm sm:text-base text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight truncate">
                          {cap.title}
                        </h4>
                        <p className="text-zinc-500 text-[11px] truncate">
                          Requisito: {cap.number === '02' ? 'Completar Cap. 01' : `Completar Cap. 0${parseInt(cap.number) - 1}`}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={cap.number}
                  id={`capitulo-${cap.number}`}
                  className={`rounded-2xl border bg-[#121318] p-5 sm:p-6 transition-all duration-300 group relative overflow-hidden ${
                    isAvailable
                      ? 'border-yellow-400/70 hover:border-yellow-400 hover:bg-[#161720]'
                      : isCompleted
                      ? 'border-zinc-700 hover:border-zinc-500'
                      : 'border-zinc-800'
                  }`}
                >
                  {/* Subtle top color line for visual identity without excessive color */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: accent }}
                  />

                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-[10px] font-mono-tech uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800"
                        style={{ color: accent }}
                      >
                        {cap.categoryTag}
                      </span>
                      {cap.number === '02' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-black tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          DEMO // INCLUIDO EN PLAN GRATIS
                        </span>
                      ) : isFreeUser ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          CONTENIDO PREMIUM
                        </span>
                      ) : null}
                    </div>

                    {isCompleted ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest ${statusObj.style}`}>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{statusObj.label}</span>
                      </span>
                    ) : isAvailable ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest ${statusObj.style}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span>{statusObj.label}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLockedChapter?.(cap);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-semibold tracking-widest bg-black/60 border border-zinc-700/80 text-zinc-300 group-hover:text-yellow-400 group-hover:border-yellow-400/60 transition-colors cursor-pointer"
                        title="Ver requisitos para desbloquear este capítulo"
                      >
                        <Lock className="w-3 h-3 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
                        <span>BLOQUEADO • VER REQUISITOS</span>
                      </button>
                    )}
                  </div>

                  {/* Main Row: High-visibility Number + Vibrant Mini-Visual + High Contrast Title */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-4">
                    
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                      
                      {/* Bold prominent number */}
                      <span className="font-mono-tech font-black text-3xl sm:text-4xl text-zinc-300 group-hover:text-white tracking-tighter leading-none shrink-0 w-12 transition-colors">
                        {cap.number}
                      </span>

                      {/* Editorial Mini-Visual: crisp, clear, suggestive */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shrink-0 shadow-lg group-hover:border-zinc-500 transition-all duration-300">
                        <img
                          src={cap.visualImage}
                          alt={`Detalle editorial del capítulo ${cap.number}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Clear, bold Title & Punchy Subtitle */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-yellow-300 transition-colors uppercase tracking-tight leading-snug">
                          {cap.title}
                        </h3>
                        <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors leading-relaxed">
                          {cap.subtitle}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Scannable Microcopy Grid: High Legibility (APRENDÉS / HACÉS / DESBLOQUEA) */}
                  <div className="pt-3.5 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-black/30 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
                    <div className="space-y-1">
                      <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                        APRENDÉS:
                      </span>
                      <p className="font-sans-editorial text-zinc-300 text-xs leading-snug group-hover:text-zinc-200">
                        {cap.aprende}
                      </p>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800/80 pt-2 sm:pt-0 sm:pl-3">
                      <span className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                        HACÉS:
                      </span>
                      <p className="font-sans-editorial text-zinc-300 text-xs leading-snug group-hover:text-zinc-200">
                        {cap.hace}
                      </p>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800/80 pt-2 sm:pt-0 sm:pl-3">
                      <span className="font-mono-tech text-[10px] uppercase tracking-wider font-bold block" style={{ color: accent }}>
                        DESBLOQUEA:
                      </span>
                      <p className="font-sans-editorial text-zinc-200 text-xs leading-snug font-medium">
                        {cap.desbloquea}
                      </p>
                    </div>
                  </div>

                  {/* Chapter 02 Actions */}
                  {cap.number === '02' && (isAvailable || isCompleted) && onStartChapter02 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Mapa de Flujo registrado. Podés volver a investigar el flujo.'
                          : 'Capítulo desbloqueado. Listo para investigar cómo colaboran tus componentes.'}
                      </span>
                      <button
                        type="button"
                        id="btn-comenzar-capitulo-02"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartChapter02();
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                      >
                        <span>{isCompleted ? 'REVISAR CAPÍTULO 02' : 'COMENZAR CAPÍTULO 02'}</span>
                        <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Chapter 03 Actions */}
                  {cap.number === '03' && (isAvailable || isCompleted) && onStartChapter03 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Telemetría registrada. Podés volver a consultar el análisis.'
                          : isFreeUser
                          ? 'Capítulo Premium. Desbloqueá con Tomo 01 o Plan Complete.'
                          : 'Capítulo desbloqueado. Listo para investigar la estabilidad real de cuadros.'}
                      </span>
                      {isFreeUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpgradeModal('Tomo 01 · Capítulo 03: CUANDO LOS FPS MIENTEN');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 transition-all cursor-pointer shadow-lg group/btn"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>REQUIERE ACCESO // VER PLANES</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-comenzar-capitulo-03"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChapter03();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                        >
                          <span>{isCompleted ? 'REVISAR CAPÍTULO 03' : 'COMENZAR CAPÍTULO 03'}</span>
                          <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Chapter 04 Actions */}
                  {cap.number === '04' && (isAvailable || isCompleted) && onStartChapter04 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Matriz de Limitación consolidada. Podés volver a consultar el análisis.'
                          : isFreeUser
                          ? 'Capítulo Premium. Desbloqueá con Tomo 01 o Plan Complete.'
                          : 'Capítulo desbloqueado. Listo para diagnosticar qué componente limita tu sistema.'}
                      </span>
                      {isFreeUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpgradeModal('Tomo 01 · Capítulo 04: ENCONTRÁ EL LÍMITE');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 transition-all cursor-pointer shadow-lg group/btn"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>REQUIERE ACCESO // VER PLANES</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-comenzar-capitulo-04"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChapter04();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                        >
                          <span>{isCompleted ? 'REVISAR CAPÍTULO 04' : 'COMENZAR CAPÍTULO 04'}</span>
                          <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Chapter 05 Actions */}
                  {cap.number === '05' && (isAvailable || isCompleted) && onStartChapter05 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Expediente de optimización consolidado. Podés volver a revisar las 8 estaciones.'
                          : isFreeUser
                          ? 'Capítulo Premium. Desbloqueá con Tomo 01 o Plan Complete.'
                          : 'Laboratorio desbloqueado. Listo para investigar procesos, servicios y realizar tu primera intervención controlada.'}
                      </span>
                      {isFreeUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpgradeModal('Tomo 01 · Capítulo 05: WINDOWS EN MOVIMIENTO');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 transition-all cursor-pointer shadow-lg group/btn"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>REQUIERE ACCESO // VER PLANES</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-comenzar-capitulo-05"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChapter05();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                        >
                          <span>{isCompleted ? 'REVISAR CAPÍTULO 05' : 'COMENZAR CAPÍTULO 05'}</span>
                          <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Chapter 06 Actions */}
                  {cap.number === '06' && (isAvailable || isCompleted) && onStartChapter06 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Expediente pericial consolidado. Podés volver a ingresar al taller para nuevos casos.'
                          : isFreeUser
                          ? 'Capítulo Premium. Desbloqueá con Tomo 01 o Plan Complete.'
                          : 'Taller EVO desbloqueado. Listo para diagnosticar fallas reales paso a paso con rigor técnico.'}
                      </span>
                      {isFreeUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpgradeModal('Tomo 01 · Capítulo 06: TALLER EVO');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 transition-all cursor-pointer shadow-lg group/btn"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>REQUIERE ACCESO // VER PLANES</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-comenzar-capitulo-06"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChapter06();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                        >
                          <span>{isCompleted ? 'REVISAR CAPÍTULO 06' : 'COMENZAR CAPÍTULO 06'}</span>
                          <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Chapter 07 Actions */}
                  {cap.number === '07' && (isAvailable || isCompleted) && onStartChapter07 && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        {isCompleted
                          ? 'Laboratorio final e Informe EVO 001 completados. Podés revisar el Dossier del Tomo 01.'
                          : isFreeUser
                          ? 'Capítulo Premium. Desbloqueá con Tomo 01 o Plan Complete.'
                          : 'Laboratorio final desbloqueado. Listo para realizar tu experimento A/B con evidencia.'}
                      </span>
                      {isFreeUser ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpgradeModal('Tomo 01 · Capítulo 07: LABORATORIO FINAL');
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 transition-all cursor-pointer shadow-lg group/btn"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>REQUIERE ACCESO // VER PLANES</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-comenzar-capitulo-07"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChapter07();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group/btn"
                        >
                          <span>{isCompleted ? 'REVISAR LABORATORIO FINAL' : 'COMENZAR LABORATORIO FINAL'}</span>
                          <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Locked Chapter Requirements CTA Row */}
                  {isLocked && onSelectLockedChapter && (
                    <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                      <span className="text-xs font-mono-tech text-zinc-400">
                        Capítulo bloqueado. Consultá qué actividades te faltan completar.
                      </span>
                      <button
                        type="button"
                        id={`btn-ver-requisitos-${cap.number}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLockedChapter(cap);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/60 transition-all cursor-pointer group/lockbtn shrink-0"
                      >
                        <Lock className="w-3.5 h-3.5 text-zinc-400 group-hover/lockbtn:text-yellow-400" />
                        <span>VER REQUISITOS // DESBLOQUEO</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover/lockbtn:opacity-100 group-hover/lockbtn:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  )}

                </article>
              );
            })}
          </div>

        </section>

        {/* Right Lateral Sticky Column: Clean, punchy takeaways (4 cols) */}
        <aside data-evo-tour="progress" className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-[#121318] p-6 sm:p-7 space-y-6 sticky top-6 shadow-xl">
            
            {/* Header */}
            <div className="space-y-2 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>VALOR EDITORIAL</span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight uppercase leading-snug">
                AL TERMINAR ESTE TOMO VAS A PODER
              </h2>
            </div>

            {/* 6 Concise Outcomes with high contrast */}
            <ul className="space-y-3.5">
              {outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-snug">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>

            {/* Evidencia Real Statement */}
            <div className="pt-4 border-t border-zinc-800/80 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
              <p className="font-mono-tech text-xs text-yellow-400 font-medium leading-relaxed">
                “Cada capítulo desbloquea evidencia real sobre tu propia máquina.”
              </p>
            </div>

            {/* Mini Progress Counter */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span>PROGRESO TOMO 01</span>
                <span className="text-yellow-400 font-bold">
                  {completedCount} / 7 CAPÍTULOS TERMINADOS
                </span>
              </div>

              {(isAllChaptersDone || hasPassedFinalExam) && onStartFinalExam && (
                <button
                  type="button"
                  onClick={hasPassedFinalExam && onOpenCompletionScreen ? onOpenCompletionScreen : onStartFinalExam}
                  className="w-full py-2.5 px-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{hasPassedFinalExam ? 'VER CIERRE DEL TOMO' : 'PRUEBA FINAL EVO'}</span>
                </button>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* Tutor Real Interface Tour Modal */}
      <TutorTomo01TourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onFinishTour={() => setIsTourOpen(false)}
        onStartChapter01={onStartResearch}
      />

      {/* Tutor Welcome Zero Knowledge Modal */}
      <TutorTomo01WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onStartZeroKnowledge={() => {
          setIsWelcomeOpen(false);
          setIsTourOpen(true);
        }}
        onExploreFreely={() => {
          setIsWelcomeOpen(false);
          setMode('libre');
        }}
        onStartChapter01={onStartResearch}
      />

      {/* Real Progress Map Modal */}
      <TutorProgressMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        chapters={chapters}
        currentChapterNumber={latestActiveChapter.number}
        onSelectChapter={handleStartChapterByNumber}
        onOpenExam={onStartFinalExam}
        onOpenLab={onOpenLab}
      />

      {/* Pre-Flight Guidance Modals */}
      {preFlightType && (
        <TutorPreFlightModal
          isOpen={!!preFlightType}
          onClose={() => setPreFlightType(null)}
          onConfirm={() => {
            if (preFlightType === 'EXAM' && onStartFinalExam) {
              onStartFinalExam();
            } else if (preFlightType === 'LAB' && onOpenLab) {
              onOpenLab();
            }
          }}
          type={preFlightType}
          tomoTitle="Tomo 01 // Conocé tu PC"
        />
      )}

    </div>
  );
};
