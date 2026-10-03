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
      className="fixed bottom-5 right-5 z-[100] flex flex-col items-end font-sans-editorial select-none print:hidden no-print"
    >
      {/* Quick Flyout Menu */}
      {isFlyoutOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-[#0d121f] border border-zinc-700/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 text-white">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>ASISTENCIA TUTOR EVO</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFlyoutOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
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
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2.5 text-zinc-200 font-medium"
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
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2.5 text-zinc-200 font-medium"
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
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2.5 text-zinc-200 font-medium"
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
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 border border-transparent transition-all flex items-center gap-2.5 text-zinc-200 font-medium"
            >
              <Layers className="w-4 h-4 text-purple-400 shrink-0" />
              <span>¿Qué es cada sector de EVO LABS?</span>
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
            {currentLocation.currentAction}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsFlyoutOpen(!isFlyoutOpen)}
        className="group px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs font-mono tracking-wider uppercase shadow-2xl flex items-center gap-2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border border-amber-300"
        style={{
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.45)',
        }}
        title="Abrir Tutor EVO: Ayuda, orientación y glosario"
      >
        <span className="w-5 h-5 rounded-full bg-black text-amber-400 flex items-center justify-center font-black text-xs">
          ?
        </span>
        <span className="tracking-wide">TUTOR EVO</span>
        <Sparkles className="w-3.5 h-3.5 text-black group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
