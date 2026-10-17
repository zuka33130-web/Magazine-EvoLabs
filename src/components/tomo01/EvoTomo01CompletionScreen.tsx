import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FlaskConical,
  BarChart3,
  Compass,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { EvoLearningGuideModal } from '../common/EvoLearningGuideModal';
import { EVO_LAB_GUIDES } from '../../data/evoLearningPaths';

export interface EvoTomo01CompletionScreenProps {
  onBackToIndex: () => void;
  onGoToLab: () => void;
  onGoToCampusFormation: () => void;
  onGoToProgress: () => void;
  onReviewExam: () => void;
}

export const EvoTomo01CompletionScreen: React.FC<EvoTomo01CompletionScreenProps> = ({
  onBackToIndex,
  onGoToLab,
  onGoToCampusFormation,
  onGoToProgress,
  onReviewExam,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Retrieve lab guide for Tomo 01 related lab (HotSwap / Master Lab / Telemetría Silicio)
  const labGuide = EVO_LAB_GUIDES['tech-hardware'] || EVO_LAB_GUIDES['tech-boot'];

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      {/* Top Header */}
      <nav className="flex items-center justify-between pb-5 mb-8 border-b border-zinc-800/60 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER AL ÍNDICE DEL TOMO 01</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <span className="w-2 h-2 bg-emerald-400 inline-block rounded-full shadow-[0_0_8px_#34d399]" />
          <span className="tracking-widest uppercase text-white font-bold">
            TOMO 01 // ACREDITACIÓN
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400 font-semibold tracking-wider">TOMO COMPLETADO</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Completion Banner */}
        <header className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0f1118] to-[#08090d] border-2 border-emerald-500/60 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech uppercase font-bold tracking-widest bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
              TOMO 01 COMPLETADO
            </span>
            <span className="text-xs font-mono-tech text-zinc-400">• CONOCÉ TU PC</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight">
              ¡FELICITACIONES!
              <br />
              <span className="text-yellow-400">BASE TÉCNICA E INTERACTIVA COMPLETADA</span>
            </h1>
            <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              Ya recorriste la base teórica e interactiva de este Tomo: 7 capítulos
              metodológicos finalizados y la comprobación final superada con evidencia.
            </p>
          </div>

          {/* Distinction: Tomo Completado vs Recorrido EVO */}
          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 text-xs font-mono-tech space-y-1">
            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider">
              <Info className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>DISTINCIÓN PEDAGÓGICA EVO</span>
            </div>
            <p className="font-sans-editorial text-zinc-300 leading-relaxed text-xs">
              Has alcanzado el estado de <strong className="text-white">TOMO 01 COMPLETADO</strong>{' '}
              (formación editorial, interactiva y evaluación superada). Esto te habilita para
              dar el salto al entorno de comprobación práctica en laboratorio.
            </p>
          </div>

          {/* AHORA PODÉS Quick Actions */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-zinc-400 font-bold block">
              AHORA PODÉS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-tech text-xs">
              <button
                type="button"
                onClick={onGoToLab}
                className="p-4 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold uppercase tracking-wider text-left transition-all shadow-lg hover:shadow-yellow-400/20 flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="block font-black text-sm">1. IR AL LABORATORIO RELACIONADO</span>
                  <span className="block text-[11px] opacity-80">Práctica guiada en banco de silicio</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onGoToCampusFormation}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white hover:border-yellow-400/60 font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="block font-black text-sm">2. CONTINUAR MI FORMACIÓN</span>
                  <span className="block text-[11px] text-zinc-400">Ir al Nivel 2 (Windows y Arranque)</span>
                </div>
                <Compass className="w-5 h-5 text-zinc-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onBackToIndex}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <span>REPASAR CAPÍTULOS DEL TOMO 01</span>
                <BookOpen className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={onGoToProgress}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <span>VER MI PROGRESO EN MI EVO</span>
                <BarChart3 className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </header>

        {/* DEL TOMO AL LABORATORIO Handoff Block */}
        <section
          aria-label="Pase del tomo al laboratorio"
          className="p-8 rounded-2xl bg-[#0f1118] border border-zinc-800 space-y-6"
        >
          <div className="space-y-2 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold uppercase tracking-widest">
              <FlaskConical className="w-4 h-4 text-yellow-400" />
              <span>DEL TOMO AL LABORATORIO</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              LABORATORIO ACTIVO: BANCO DE SILICIO & TELEMETRÍA (HOT-SWAP LAB)
            </h2>
            <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
              “Ahora vas a utilizar en un entorno práctico los conceptos que trabajaste durante el Tomo.”
            </p>
          </div>

          {/* 4 Pedagogical Handoff Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
              <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-wider block">
                1. QUÉ VAS A PRACTICAR:
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Prueba dinámica de componentes en caliente, acople de módulos de memoria, variación
                de interfaces de almacenamiento (SATA vs NVMe) y monitoreo de buses de datos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
              <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-wider block">
                2. QUÉ CONTENIDO DEL TOMO SE UTILIZA:
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Capítulos 01 (identidad y especificaciones), 02 (viaje del dato y latencias de bus)
                y 04 (matriz de limitación y cuellos de botella en tiempo real).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
              <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-wider block">
                3. QUÉ DEBÉS OBSERVAR:
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Cómo impacta el cambio de canal de memoria (Single vs Dual Channel) en el caudal de
                datos y cómo la velocidad del bus PCIe afecta la tasa de transferencia de texturas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
              <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-wider block">
                4. QUÉ DEBÉS COMPROBAR:
              </span>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                Confirmar con el HUD de telemetría si las hipótesis formuladas en la teoría del Tomo
                coinciden exactamente con el comportamiento medido del silicio.
              </p>
            </div>
          </div>

          {/* Action buttons for Lab Entrance */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-zinc-200 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 text-yellow-400" />
              <span>VER GUÍA DEL LABORATORIO</span>
            </button>

            <button
              type="button"
              onClick={onGoToLab}
              className="px-8 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-yellow-400/25 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-black" />
              <span>ENTRAR AL LABORATORIO RELACIONADO →</span>
            </button>
          </div>
        </section>

        {/* Review or Repeat Exam Quick CTA */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-zinc-850 text-xs font-mono-tech text-zinc-400">
          <span>¿Querés repasar las preguntas y fundamentación técnica?</span>
          <button
            type="button"
            onClick={onReviewExam}
            className="text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-wider cursor-pointer underline underline-offset-4"
          >
            REVISAR PRUEBA FINAL EVO
          </button>
        </div>
      </div>

      {/* Lab Guide Modal */}
      {labGuide && (
        <EvoLearningGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          guide={labGuide}
          onEnterLab={() => {
            setIsGuideOpen(false);
            onGoToLab();
          }}
        />
      )}
    </div>
  );
};
