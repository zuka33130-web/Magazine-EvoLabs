import React from 'react';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowLeft,
  Check,
  Shield,
  Terminal,
  Activity,
} from 'lucide-react';
import { TOMO_02_META } from '../../data/tomo02Data';

interface EvoTomo02CompletionScreenProps {
  onBackToIndex: () => void;
  onGoToLab?: () => void;
  onGoToCampusFormation?: () => void;
  onReviewExam?: () => void;
  onOpenA4Magazine?: () => void;
  score?: number;
}

export const EvoTomo02CompletionScreen: React.FC<EvoTomo02CompletionScreenProps> = ({
  onBackToIndex,
  onGoToLab,
  onGoToCampusFormation,
  onReviewExam,
  onOpenA4Magazine,
  score = 10,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 font-sans-editorial space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center justify-between pb-4 border-b border-cyan-950 font-mono-tech text-xs">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER AL ÍNDICE DEL TOMO 02</span>
        </button>

        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span className="uppercase tracking-widest text-[11px]">TOMO 02 ACREDITADO</span>
        </div>
      </nav>

      {/* Main Diploma / Certificate Banner */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#08121f] via-[#060B14] to-[#04060A] border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(0,210,255,0.15)] overflow-hidden space-y-6">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-tech-grid" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400 flex items-center justify-center">
              <Award className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <span className="font-mono-tech text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                ACADEMIA EVO LABS // CONSTANCIA PERICIAL
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                TOMO 02 SUPERADO CON ÉXITO
              </h1>
            </div>
          </div>

          <div className="text-right font-mono-tech">
            <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-black text-xs uppercase tracking-wider inline-block">
              CALIFICACIÓN: {score} / 10
            </span>
            <span className="text-[10px] text-zinc-500 block mt-1">
              ESTADO: CERTIFICADO REGISTRADO
            </span>
          </div>
        </div>

        {/* Narrative & Praise */}
        <div className="relative z-10 space-y-3 font-sans-editorial">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            Dominaste los secretos internos del Kernel NT y la arquitectura de Windows.
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Has dejado atrás las recetas mágicas de internet y los debloaters destructivos.
            Ahora entendés cómo despierta el silicio en UEFI, por qué existe SysWOW64, cómo
            se comporta la memoria virtual sin mitos y cómo cazar problemas de latencia o arranque
            con telemetría y evidencia medible.
          </p>
        </div>

        {/* Competencies Checklist */}
        <div className="relative z-10 p-5 rounded-2xl bg-black/60 border border-cyan-950 space-y-3 font-mono-tech text-xs">
          <span className="text-cyan-400 font-bold uppercase tracking-wider block">
            COMPETENCIAS PERICIALES ACREDITADAS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Cadena de arranque UEFI, GPT, partición ESP y almacén BCD.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Arquitectura System32 (64-bit) vs SysWOW64 (32-bit).</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Mantenimiento y purga de componentes WinSxS con DISM.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Memoria virtual: Commit Limit, Working Set y Pagefile.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Auditoría de latencias DPC en controladores con LatencyMon.</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Secuencia de recuperación metódica: DISM antes de SFC.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Lab Handoff Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0A1220] to-[#060910] border-2 border-cyan-400/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-widest">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span>LABORATORIO VIRTUAL GUIADO DE WINDOWS</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            WINDOWS MATRIX LAB
          </h3>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Aplicá los conocimientos del Tomo 02 en el simulador interactivo de arquitectura y kernel de Windows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans-editorial pt-1">
            <div className="p-2 rounded bg-black/60 border border-cyan-950/70">
              <strong className="text-cyan-400 font-mono-tech block text-[10px]">▸ QUÉ VA A PRACTICAR:</strong>
              <span className="text-zinc-300">Simulación de microarquitecturas de CPU con versiones de kernel NT.</span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-cyan-950/70">
              <strong className="text-cyan-400 font-mono-tech block text-[10px]">▸ QUÉ CAPÍTULOS UTILIZA:</strong>
              <span className="text-zinc-300">Módulos 01 (Arranque), 06 (Procesos), 07 (Memoria) y 08 (Drivers).</span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-cyan-950/70">
              <strong className="text-cyan-400 font-mono-tech block text-[10px]">▸ QUÉ DEBE OBSERVAR:</strong>
              <span className="text-zinc-300">Reparto de hilos por el Thread Director y latencias de syscalls.</span>
            </div>
            <div className="p-2 rounded bg-black/60 border border-cyan-950/70">
              <strong className="text-cyan-400 font-mono-tech block text-[10px]">▸ QUÉ DEBE COMPROBAR:</strong>
              <span className="text-zinc-300">Comportamiento del scheduler en silicio híbrido frente a monolítico.</span>
            </div>
          </div>
        </div>

        {onGoToLab && (
          <button
            type="button"
            onClick={onGoToLab}
            className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>INGRESAR A WINDOWS MATRIX LAB →</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        )}
      </div>

      {/* Secondary Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech text-xs">
        {onGoToCampusFormation && (
          <button
            type="button"
            onClick={onGoToCampusFormation}
            className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 hover:border-cyan-500/60 text-zinc-300 hover:text-white transition-all text-center cursor-pointer"
          >
            <span className="font-bold block mb-1">ESCUELA EVO // CAMPUS</span>
            <span className="text-[11px] text-zinc-500">Continuar formación en el mapa</span>
          </button>
        )}

        {onOpenA4Magazine && (
          <button
            type="button"
            onClick={onOpenA4Magazine}
            className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 hover:border-cyan-500/60 text-zinc-300 hover:text-white transition-all text-center cursor-pointer"
          >
            <span className="font-bold block mb-1">REVISTA A4 COMPLETA</span>
            <span className="text-[11px] text-zinc-500">Ver 36 páginas diagramadas</span>
          </button>
        )}

        {onReviewExam && (
          <button
            type="button"
            onClick={onReviewExam}
            className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 hover:border-cyan-500/60 text-zinc-300 hover:text-white transition-all text-center cursor-pointer"
          >
            <span className="font-bold block mb-1">REPASAR EVALUACIÓN</span>
            <span className="text-[11px] text-zinc-500">Revisar respuestas y conceptos</span>
          </button>
        )}
      </div>
    </div>
  );
};
