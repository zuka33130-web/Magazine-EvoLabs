import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  FlaskConical,
  RotateCcw,
  Terminal,
  Shield,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { TOMO_02_MODULES, TomoModuleItem, TOMO_02_META } from '../../data/tomo02Data';

export interface ModuleProgressStatus {
  [moduleId: string]: 'not_started' | 'in_progress' | 'completed';
}

interface Tomo02EditorialIndexProps {
  onBackToCover: () => void;
  onBackToApp?: () => void;
  onOpenA4Magazine: () => void;
  onSelectModule: (moduleIndex: number) => void;
  onStartFinalExam: () => void;
  onOpenCompletionScreen: () => void;
  onOpenWindowsMatrixLab?: () => void;
  moduleProgress: ModuleProgressStatus;
  completedCount: number;
  hasPassedFinalExam: boolean;
}

// Group modules logically into 6 thematic editorial dossiers
const EDITORIAL_SECTIONS = [
  {
    sectionNumber: 'I',
    sectionTitle: 'ARQUITECTURA DE ARRANQUE & DESPLIEGUE',
    sectionSubtitle: 'De la inyección de energía al primer píxel del shell',
    moduleIds: ['m00', 'm01', 'm02'],
  },
  {
    sectionNumber: 'II',
    sectionTitle: 'SISTEMA DE ARCHIVOS & ALMACENAMIENTO',
    sectionSubtitle: 'NTFS, Journaling, System32, SysWOW64 y WinSxS',
    moduleIds: ['m03', 'm04', 'm05'],
  },
  {
    sectionNumber: 'III',
    sectionTitle: 'NÚCLEO, PROCESOS & MEMORIA VIRTUAL',
    sectionSubtitle: 'Ring 0 vs Ring 3, Commit Charge, Drivers y Latencias DPC',
    moduleIds: ['m06', 'm07', 'm08', 'm09'],
  },
  {
    sectionNumber: 'IV',
    sectionTitle: 'CONECTIVIDAD, SERVICIOS & AUTOMATIZACIÓN',
    sectionSubtitle: 'Sockets de red, Svchost, SysMain y el Programador de Tareas',
    moduleIds: ['m10', 'm11', 'm12', 'm13'],
  },
  {
    sectionNumber: 'V',
    sectionTitle: 'TERMINAL, REGISTRO & CIBERSEGURIDAD',
    sectionSubtitle: 'PowerShell, Hives del Registry, UAC y Telemetría racional',
    moduleIds: ['m14', 'm15', 'm16', 'm17', 'm18'],
  },
  {
    sectionNumber: 'VI',
    sectionTitle: 'METROLOGÍA, RECUPERACIÓN & CASOS PERICIALES',
    sectionSubtitle: 'WinRE, BCD, rescate en bajos recursos y casos de taller',
    moduleIds: ['m19', 'm20', 'm21', 'm22', 'm23', 'm24', 'm25', 'm26'],
  },
];

export const Tomo02EditorialIndex: React.FC<Tomo02EditorialIndexProps> = ({
  onBackToCover,
  onBackToApp,
  onOpenA4Magazine,
  onSelectModule,
  onStartFinalExam,
  onOpenCompletionScreen,
  onOpenWindowsMatrixLab,
  moduleProgress,
  completedCount,
  hasPassedFinalExam,
}) => {
  const totalModules = TOMO_02_MODULES.length;
  const isAllModulesDone = completedCount >= totalModules;

  const getModuleStatusBadge = (modId: string) => {
    const status = moduleProgress[modId] || 'not_started';
    if (status === 'completed') {
      return {
        label: 'TERMINADO ✓',
        style: 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400',
      };
    }
    if (status === 'in_progress') {
      return {
        label: 'EN CURSO',
        style: 'bg-cyan-950/60 border border-cyan-400/60 text-cyan-300',
      };
    }
    return {
      label: 'NO INICIADO',
      style: 'bg-zinc-950 border border-zinc-800 text-zinc-500',
    };
  };

  return (
    <div id="pantalla-indice-tomo02" className="w-full min-h-screen py-6 sm:py-10 lg:py-14 font-sans-editorial">
      {/* Top Editorial Nav Bar */}
      <nav className="flex items-center justify-between pb-5 mb-8 sm:mb-12 border-b border-cyan-950/80 font-mono-tech text-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToCover}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-300 uppercase tracking-widest transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← PORTADA TOMO 02</span>
          </button>

          {onBackToApp && (
            <>
              <span className="text-zinc-700">•</span>
              <button
                type="button"
                onClick={onBackToApp}
                className="text-zinc-400 hover:text-cyan-300 uppercase tracking-widest transition-colors cursor-pointer"
              >
                MAPA MUNDO EVO
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
          <span className="text-white font-bold uppercase tracking-widest hidden sm:inline">
            TOMO 02 // ÍNDICE MAESTRO
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-cyan-400 font-extrabold tracking-wider">
            {completedCount} / {totalModules} MÓDULOS TERMINADOS
          </span>
        </div>
      </nav>

      {/* Main Magazine Header & Editorial Opening */}
      <header className="mb-8 sm:mb-10 max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 tracking-widest uppercase font-semibold">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>EVO LABS // GUÍA DE PERITAJE DE KERNEL & ARQUITECTURA</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[0.93]">
          LA BIBLIA NEGRA DE WINDOWS
        </h1>

        <p className="font-sans-editorial text-lg sm:text-xl text-cyan-200/90 max-w-2xl leading-relaxed italic">
          “El lado oculto de Windows. Descubrilo.”
        </p>

        {/* Cómo usar este Tomo */}
        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-cyan-950/80 space-y-2 text-xs font-sans-editorial text-zinc-300">
          <span className="font-mono-tech font-bold text-cyan-400 uppercase tracking-wider block text-[11px]">
            CÓMO USAR ESTE TOMO // CADENA DE APRENDIZAJE EVO:
          </span>
          <p className="leading-relaxed">
            Este Tomo no es una lista de trucos ni un manual de recetas mágicas. Cada capítulo sigue la cadena metódica oficial:
            <strong className="text-white font-semibold"> GANCHO → EXPLICACIÓN SIMPLE → DETALLE TÉCNICO → IMAGEN / DIAGRAMA → EJEMPLO REAL → PRÁCTICA EVO → COMPROBALO</strong>.
            Avanzá en orden, ejecutá las auditorías en tu terminal y medí siempre tu baseline antes de cualquier intervención.
          </p>
        </div>
      </header>

      {/* Direct A4 Magazine Access Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0A0E18] to-[#060910] border border-cyan-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 shadow-xl">
        <div className="flex items-center gap-3.5">
          <span className="w-3 h-3 bg-cyan-400 inline-block shadow-[0_0_10px_#00D2FF]" />
          <div>
            <span className="font-mono-tech text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              EDICIÓN FACSIMILAR // A4 VERTICAL COMPLETA
            </span>
            <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight">
              REVISTA A4 LA BIBLIA NEGRA — 36 Páginas Diagramadas
            </h3>
            <p className="text-xs text-zinc-300 font-sans-editorial max-w-2xl mt-0.5">
              Lectura continua con infografías de Kernel, tablas de carpetas, esquemas de procesos y hoja de auditoría imprimible.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenA4Magazine}
          className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 shadow-lg hover:shadow-cyan-400/30"
        >
          ABRIR REVISTA A4 →
        </button>
      </div>

      {/* FINAL EXAM & COMPLETION HANDOFF BANNER */}
      {(isAllModulesDone || hasPassedFinalExam) && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0c1220] to-[#080b12] border-2 border-cyan-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-cyan-400 tracking-widest">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>
                {hasPassedFinalExam
                  ? 'TOMO 02 // COMPLETADO Y ACREDITADO'
                  : 'EVALUACIÓN PERICIAL // HABILITADA'}
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {hasPassedFinalExam
                ? '¡TOMO 02 SUPERADO CON ÉXITO!'
                : 'PRUEBA FINAL DE KERNEL & SISTEMA'}
            </h3>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {hasPassedFinalExam
                ? 'Has demostrado criterio técnico y conocimiento metódico del sistema operativo. Podés acceder a la acreditación y al laboratorio Windows Matrix.'
                : 'Completaste los 26 módulos de La Biblia Negra. Demostrá tus conocimientos resolviendo el examen pericial con casos reales de taller.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {hasPassedFinalExam && (
              <button
                type="button"
                onClick={onOpenCompletionScreen}
                className="px-6 py-3.5 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-cyan-400/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-black" />
                <span>VER CIERRE & LABORATORIO →</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartFinalExam}
              className={`px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                hasPassedFinalExam
                  ? 'bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white hover:border-cyan-400'
                  : 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-xl'
              }`}
            >
              {hasPassedFinalExam ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>REPETIR EVALUACIÓN</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>REALIZAR PRUEBA FINAL EVO →</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Modules Directory Stream + Lateral Editorial Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 6 Thematic Editorial Sections */}
        <div className="lg:col-span-8 space-y-10">
          {EDITORIAL_SECTIONS.map((sec) => (
            <div
              key={sec.sectionNumber}
              className="p-5 sm:p-7 rounded-2xl bg-[#090D15]/80 border border-cyan-950 space-y-5"
            >
              {/* Section Header */}
              <div className="border-b border-cyan-950/80 pb-3">
                <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 mb-1">
                  <span className="font-bold">SECCIÓN {sec.sectionNumber}</span>
                  <span className="text-zinc-500">{sec.moduleIds.length} MÓDULOS</span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  {sec.sectionTitle}
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  {sec.sectionSubtitle}
                </p>
              </div>

              {/* Modules in this Section */}
              <div className="space-y-3">
                {sec.moduleIds.map((modId) => {
                  const modIndex = TOMO_02_MODULES.findIndex((m) => m.id === modId);
                  const mod = TOMO_02_MODULES[modIndex];
                  if (!mod) return null;
                  const statusInfo = getModuleStatusBadge(mod.id);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => onSelectModule(modIndex)}
                      className="p-4 rounded-xl bg-zinc-950/60 border border-cyan-950 hover:border-cyan-500/70 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tech text-xs font-black text-cyan-400 group-hover:text-cyan-300">
                            [{mod.moduleNumber}]
                          </span>
                          <span className="font-mono-tech text-[10px] text-zinc-400 uppercase">
                            {mod.categoryTag}
                          </span>
                          <span className="text-zinc-600 font-mono-tech text-[10px]">•</span>
                          <span className="font-mono-tech text-[10px] text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mod.readTime}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold ${statusInfo.style}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-200 uppercase transition-colors">
                          {mod.title}
                        </h3>

                        <p className="text-xs text-zinc-400 font-sans-editorial line-clamp-2">
                          {mod.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectModule(modIndex);
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-900 group-hover:bg-cyan-400 text-zinc-300 group-hover:text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-cyan-950 group-hover:border-cyan-400"
                      >
                        <span>ABRIR</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Lateral Column: Editorial Manifesto, Key Rules & Associated Lab */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Associated Lab Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0A1220] to-[#060A12] border-2 border-cyan-500/40 space-y-3.5 font-mono-tech">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>LABORATORIO VIRTUAL GUIADO DE WINDOWS</span>
            </div>

            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              WINDOWS MATRIX LAB
            </h3>

            <div className="space-y-2.5 text-[11px] text-zinc-300 font-sans-editorial">
              <div className="p-2 rounded bg-black/50 border border-cyan-950/70">
                <span className="font-mono-tech font-bold text-cyan-400 uppercase block text-[10px]">
                  ▸ QUÉ VA A PRACTICAR:
                </span>
                <p className="text-zinc-300">
                  Simulación de microarquitecturas de CPU (Híbrido vs 3D V-Cache vs Monolítico) frente a versiones de kernel NT y switches de mitigación.
                </p>
              </div>

              <div className="p-2 rounded bg-black/50 border border-cyan-950/70">
                <span className="font-mono-tech font-bold text-cyan-400 uppercase block text-[10px]">
                  ▸ QUÉ CAPÍTULOS UTILIZA:
                </span>
                <p className="text-zinc-300">
                  Módulo 01 (Arranque), Módulo 06 (Procesos & Ring 0), Módulo 07 (Memoria Virtual), Módulo 08 (Drivers & DPC).
                </p>
              </div>

              <div className="p-2 rounded bg-black/50 border border-cyan-950/70">
                <span className="font-mono-tech font-bold text-cyan-400 uppercase block text-[10px]">
                  ▸ QUÉ DEBE OBSERVAR:
                </span>
                <p className="text-zinc-300">
                  Reparto de hilos en núcleos P y E por el Thread Director, latencias de syscalls y comportamiento del working set.
                </p>
              </div>

              <div className="p-2 rounded bg-black/50 border border-cyan-950/70">
                <span className="font-mono-tech font-bold text-cyan-400 uppercase block text-[10px]">
                  ▸ QUÉ DEBE COMPROBAR:
                </span>
                <p className="text-zinc-300">
                  La correlación directa entre arquitectura física de silicio y planificación del planificador (scheduler) del sistema.
                </p>
              </div>
            </div>

            {onOpenWindowsMatrixLab && (
              <button
                type="button"
                onClick={onOpenWindowsMatrixLab}
                className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>INGRESAR AL LAB DE WINDOWS →</span>
              </button>
            )}
          </div>

          {/* Reader Pact & Core Methodology */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-950 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-cyan-400 uppercase">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>EL PACTO EDITORIAL EVO</span>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              <div className="p-2.5 rounded bg-black/60 border border-cyan-950 space-y-1">
                <span className="font-bold text-white font-mono-tech text-[11px] block">
                  1. CERO SCRIPTS MÁGICOS
                </span>
                <p className="text-[11px] text-zinc-400">
                  Cada ajuste se explica con su comando nativo de PowerShell o clave de registro visible.
                </p>
              </div>

              <div className="p-2.5 rounded bg-black/60 border border-cyan-950 space-y-1">
                <span className="font-bold text-white font-mono-tech text-[11px] block">
                  2. REVERSIBILIDAD TOTAL
                </span>
                <p className="text-[11px] text-zinc-400">
                  Todo parámetro modificado incluye la instrucción exacta para volver a su estado de fábrica.
                </p>
              </div>

              <div className="p-2.5 rounded bg-black/60 border border-cyan-950 space-y-1">
                <span className="font-bold text-white font-mono-tech text-[11px] block">
                  3. MEDICIÓN DE BASELINE
                </span>
                <p className="text-[11px] text-zinc-400">
                  Medí con LatencyMon y Commit Charge antes de tocar. Si no se puede medir, no es optimización.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Code Notice */}
          <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 text-[11px] font-mono-tech text-zinc-400 space-y-2">
            <span className="text-zinc-300 font-bold block uppercase">
              CÓDIGO DE SEGURIDAD DEL KERNEL:
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-bold">VERDE:</span>
                <span>Comandos seguros y 100% inocuos.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-400 font-bold">AMARILLO:</span>
                <span>Requiere precaución y baseline previo.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-rose-400 font-bold">ROJO:</span>
                <span>Zona Kernel/BCD. No tocar sin backup.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
