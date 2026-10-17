import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  Compass,
  BookOpen,
  Map,
  ArrowRight,
  X,
  Layers,
  Shield,
  Activity,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export const TutorEvoFloatingButton: React.FC = () => {
  const {
    isTutorOpen,
    setIsTutorOpen,
    openTutorWithTab,
    currentLocation,
  } = useTutorEvo();

  const [isFlyoutOpen, setIsFlyoutOpen] = useState<boolean>(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Close flyout on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setIsFlyoutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isTutorOpen) return null;

  return (
    <div
      ref={flyoutRef}
      className="fixed bottom-3 sm:bottom-6 right-3 sm:right-5 z-40 flex flex-col items-end font-sans-editorial select-none print:hidden no-print"
    >
      {/* Quick Flyout Menu */}
      {isFlyoutOpen && (
        <div className="mb-2 sm:mb-3 w-[calc(100vw-1.5rem)] max-w-[320px] sm:w-80 bg-[#0d121f] border border-zinc-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 text-white">
          <div className="flex items-center justify-between pb-2 mb-2 sm:mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>ASISTENCIA TUTOR EVO</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFlyoutOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                openTutorWithTab('explain');
              }}
              className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2 sm:gap-2.5 text-zinc-200 font-medium cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span>¿Dónde estoy y qué hago ahora?</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                openTutorWithTab('glossary');
              }}
              className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2 sm:gap-2.5 text-zinc-200 font-medium cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>¿Qué significa este concepto? (Glosario)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                openTutorWithTab('map');
              }}
              className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2 sm:gap-2.5 text-zinc-200 font-medium cursor-pointer"
            >
              <Map className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ver mapa del recorrido</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFlyoutOpen(false);
                openTutorWithTab('tour');
              }}
              className="w-full text-left p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2 sm:gap-2.5 text-zinc-200 font-medium cursor-pointer"
            >
              <Layers className="w-4 h-4 text-purple-400 shrink-0" />
              <span>¿Qué es cada sector de EVO LABS?</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
            {currentLocation.currentAction}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsFlyoutOpen(!isFlyoutOpen)}
        className="evo-btn-floating h-8 sm:h-10 px-2.5 sm:px-3.5 rounded-full border border-amber-400/40 text-white shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all duration-200 cursor-pointer backdrop-blur-md bg-black/80 hover:bg-black"
        title="Abrir Tutor EVO: Ayuda, orientación y glosario"
      >
        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black text-[9px] sm:text-[10px]">
          ?
        </span>
        <span className="tracking-wide text-[10px] sm:text-[11px] font-bold">
          TUTOR<span className="hidden sm:inline"> EVO</span>
        </span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
