import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  Terminal,
  Activity,
  Shield,
  Zap,
  HardDrive,
  Network,
  Eye,
  AlertCircle,
  FileCode,
  Sliders,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Key,
  Flame,
  Binary,
  ArrowRight,
  RefreshCw,
  Server,
  Lock,
  BookOpen,
  Award,
  Check,
  Search,
  FolderTree,
  Book,
  Wrench,
} from 'lucide-react';
import { TomoModuleItem, TOMO_02_FOLDERS } from '../../data/tomo02Data';

interface VisualProps {
  module: TomoModuleItem;
  richData?: any;
  compact?: boolean;
}

export const Tomo02ModuleVisual: React.FC<VisualProps> = ({ module, richData, compact = false }) => {
  const [activeFocalPoint, setActiveFocalPoint] = useState<number>(0);
  const moduleId = module.id;

  // Render the specific visual component based on module ID
  const renderVisualGraphic = () => {
    switch (moduleId) {
      case 'm00':
        return <AperturaMethodVisual compact={compact} />;
      case 'm01':
        return <BootPipelineVisual />;
      case 'm02':
        return <GenericKernelVisual module={module} richData={richData} />;
      case 'm03':
        return <NtfsMftVisual />;
      case 'm04':
        return <NvmeStoragePipelineVisual />;
      case 'm05':
        return <GenericKernelVisual module={module} richData={richData} />;
      case 'm06':
        return <RingArchitectureVisual compact={compact} />;
      case 'm07':
        return <MemoryHierarchyVisual />;
      case 'm08':
        return <DpcIsrLatencyVisual />;
      case 'm09':
        return <GenericKernelVisual module={module} richData={richData} />;
      case 'm10':
        return <NetworkSocketsVisual />;
      case 'm11':
        return <AutorunsPersistenceVisual />;
      case 'm12':
        return <ScmServicesVisual />;
      case 'm13':
        return <TaskSchedulerVisual />;
      case 'm14':
        return <EventLogEtwVisual />;
      case 'm15':
        return <RegistryHiveVisual />;
      case 'm16':
        return <TelemetryPipelineVisual />;
      case 'm17':
        return <CbsWinSxSVisual />;
      case 'm18':
        return <UacSecureDesktopVisual />;
      case 'm19':
        return <WinreBcdPipelineVisual />;
      case 'm20':
        return <AdaptiveDpcMetrologyVisual />;
      case 'm21':
        return <LowResourceHddIoVisual />;
      case 'm22':
        return <EmergencyProtocolsVisual />;
      case 'm23':
        return <ForensicCaseStudiesVisual />;
      case 'm24':
        return <EliteToolsMatrixVisual compact={compact} />;
      case 'm25':
        return <GlossaryMatrixVisual compact={compact} />;
      case 'm26':
        return <InvestigatorPassportVisual compact={compact} />;
      default:
        return <GenericKernelVisual module={module} richData={richData} />;
    }
  };

  // Dedicated pedagogical metadata per module
  const visualMeta = getVisualPedagogicalMeta(moduleId, module, richData);

  if (compact) {
    return (
      <div className="w-full h-full flex flex-col justify-start items-stretch overflow-y-auto no-scrollbar p-2 text-xs">
        <div className="w-full flex flex-col justify-start items-stretch min-h-0">
          {renderVisualGraphic()}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-black border border-cyan-900/80 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
      {/* Visual Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-[#060D1A] to-zinc-950 border-b border-cyan-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono-tech text-[10px] font-bold uppercase tracking-wider">
              {visualMeta.badge}
            </span>
            <span className="font-mono-tech text-[10px] text-zinc-400">
              EXPEDIENTE // VISUAL #{module.moduleNumber}
            </span>
          </div>
          <h3 className="font-display font-black text-white text-lg sm:text-xl tracking-tight uppercase">
            {visualMeta.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono-tech text-xs">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>ESTÁNDAR EDITORIAL EVO</span>
          </span>
        </div>
      </div>

      {/* Main Visual Canvas Area */}
      <div className="p-4 sm:p-6 bg-[#04060A] border-b border-cyan-950/80">
        {renderVisualGraphic()}
      </div>

      {/* Structured Pedagogical Explanations (QUÉ ESTÁS VIENDO, QUÉ TENÉS QUE MIRAR, POR QUÉ IMPORTA) */}
      <div className="p-5 sm:p-6 bg-zinc-950/90 space-y-4">
        {/* Qué estás viendo */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-950 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUÉ ESTÁS VIENDO // IDENTIFICACIÓN DEL COMPONENTE:</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
            {visualMeta.whatYouAreSeeing}
          </p>
        </div>

        {/* Qué tenés que mirar (Interactive Focal Points) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-300 font-bold uppercase">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>QUÉ TENÉS QUE MIRAR // PUNTOS CLAVE DE AUDITORÍA:</span>
            </div>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">
              SELECCIONÁ UN PUNTO PARA DETALLE FORENSE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {visualMeta.focalPoints.map((point, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFocalPoint(idx)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  activeFocalPoint === idx
                    ? 'bg-cyan-950/50 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-black/40 border-cyan-950/60 hover:border-cyan-900/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-tech text-[10px] font-bold ${
                      activeFocalPoint === idx
                        ? 'bg-cyan-400 text-black'
                        : 'bg-zinc-800 text-cyan-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-mono-tech text-xs text-white font-bold truncate">
                    {point.label}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug line-clamp-2">
                  {point.instruction}
                </p>
              </button>
            ))}
          </div>

          {/* Active Focal Point Deep Detail */}
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 font-sans-editorial">
            <strong className="font-mono-tech text-[11px] text-cyan-400 uppercase mr-1.5 font-bold">
              [PUNTO {activeFocalPoint + 1} - {visualMeta.focalPoints[activeFocalPoint]?.label}]:
            </strong>
            {visualMeta.focalPoints[activeFocalPoint]?.detail}
          </div>
        </div>

        {/* Por qué importa */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-emerald-200">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400 font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>POR QUÉ IMPORTA // TRASLADO AL BANCO DE PRUEBAS:</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-sans-editorial leading-relaxed">
            {visualMeta.whyItMatters}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   0. MODULE 00: APERTURA & MÉTODO CIENTÍFICO EVO // LAS 15 CARPETAS
========================================================================= */
const AperturaMethodVisual: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [activeTab, setActiveTab] = useState<'METODO' | 'CARPETAS' | 'PACTO'>('METODO');
  const [folderFilter, setFolderFilter] = useState<'TODAS' | 'ROJO' | 'AMARILLO' | 'VERDE'>('TODAS');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f01');

  const filteredFolders = TOMO_02_FOLDERS.filter(
    (f) => folderFilter === 'TODAS' || f.safetyBadge === folderFilter
  );

  const activeFolder =
    TOMO_02_FOLDERS.find((f) => f.id === selectedFolderId) || TOMO_02_FOLDERS[0];

  const methodSteps = [
    { num: '1', title: 'DESCUBRIR', desc: 'Pregunta disparadora y síntoma real que expone el problema en la pantalla.' },
    { num: '2', title: 'ENTENDER', desc: 'Analogía cotidiana sin tecnicismos + fundamento del Kernel NT para captar la causa.' },
    { num: '3', title: 'OBSERVAR', desc: 'Diagrama forense interactivo para ver qué componentes físicos y lógicos intervienen.' },
    { num: '4', title: 'PRACTICAR', desc: 'Auditoría en PowerShell con pasos exactos, qué mirar e interpretación de telemetría.' },
    { num: '5', title: 'DIAGNOSTICAR', desc: 'Expediente pericial de taller: Síntoma ➔ Evidencia ➔ Hipótesis ➔ Causa Raíz.' },
    { num: '6', title: 'COMPROBAR', desc: 'Evaluación de razonamiento crítico e interpretación del visual sin preguntas de memoria.' },
    { num: '7', title: 'AVANZAR', desc: 'Consolidación de competencias en el Archivo EVO y puente editorial al siguiente módulo.' },
  ];

  if (compact) {
    return (
      <div className="w-full space-y-2 font-mono-tech select-none">
        <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-950 pb-1">
          <span className="font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            MÉTODO DETERMINISTA EVO // CADENA DE 7 FASES
          </span>
          <span className="text-zinc-500">SECUENCIA FORENSE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-center text-xs">
          {methodSteps.map((st) => (
            <div
              key={st.num}
              className="p-1.5 rounded-lg bg-zinc-950/90 border border-cyan-950/80 flex flex-col justify-between space-y-0.5"
            >
              <div className="w-4 h-4 mx-auto rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-[9px]">
                {st.num}
              </div>
              <strong className="text-white text-[9.5px] block font-mono-tech">{st.title}</strong>
              <p className="text-[8.5px] text-zinc-400 font-sans-editorial leading-tight line-clamp-2">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-between text-[9.5px] text-cyan-300">
          <span>REGLA FORENSE N° 1: NO LO CREAS, COMPROBALO.</span>
          <span className="text-zinc-400">SI NO PODÉS REVERTIRLO, NO LO TOQUES</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono-tech">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-cyan-950 pb-2.5">
        <div className="flex items-center gap-2 text-cyan-400">
          <Award className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold">RECREACIÓN DIDÁCTICA EVO // PROTOCOLO DE LABORATORIO & CARPETAS</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
          FILOSOFÍA OPERATIVA
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap bg-zinc-950/90 p-2 rounded-xl border border-cyan-950">
        <button
          type="button"
          onClick={() => setActiveTab('METODO')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'METODO'
              ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
              : 'bg-black/60 text-zinc-400 hover:text-white border border-cyan-950'
          }`}
        >
          CADENA METÓDICA DE 7 PASOS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('CARPETAS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'CARPETAS'
              ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
              : 'bg-black/60 text-zinc-400 hover:text-white border border-cyan-950'
          }`}
        >
          SEMÁFORO DE LAS 15 CARPETAS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PACTO')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PACTO'
              ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
              : 'bg-black/60 text-zinc-400 hover:text-white border border-cyan-950'
          }`}
        >
          EL PACTO DE REVERSIBILIDAD
        </button>
      </div>

      {/* Tab 1: 7 Steps Flow */}
      {activeTab === 'METODO' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/60 text-xs text-cyan-200 font-sans-editorial leading-relaxed">
            Cada módulo de La Biblia Negra recorre esta secuencia inalterable. El técnico nunca adivina:
            descubre el síntoma, entiende el kernel, mide la evidencia y comprueba con rigor científico.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {methodSteps.map((st) => (
              <div
                key={st.num}
                className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 hover:border-cyan-800 transition-all space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                    {st.num}
                  </span>
                  <strong className="text-white text-xs">{st.title}</strong>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 15 System Folders */}
      {activeTab === 'CARPETAS' && (
        <div className="space-y-3">
          {/* Sub-filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">FILTRAR POR RIESGO:</span>
            {(['TODAS', 'ROJO', 'AMARILLO', 'VERDE'] as const).map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => setFolderFilter(badge)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  folderFilter === badge
                    ? badge === 'ROJO'
                      ? 'bg-rose-950 border border-rose-500 text-rose-300'
                      : badge === 'AMARILLO'
                      ? 'bg-amber-950 border border-amber-500 text-amber-300'
                      : badge === 'VERDE'
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                    : 'bg-black/60 text-zinc-500 border border-zinc-900'
                }`}
              >
                {badge}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left list (5 cols) */}
            <div className="lg:col-span-5 space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredFolders.map((f) => {
                const isSelected = f.id === activeFolder.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_12px_rgba(0,210,255,0.15)]'
                        : 'bg-black/60 border-cyan-950/70 hover:border-cyan-800 text-zinc-400'
                    }`}
                  >
                    <div className="truncate">
                      <strong className={`text-[11px] block truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {f.path}
                      </strong>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        f.safetyBadge === 'ROJO'
                          ? 'bg-rose-950/80 border border-rose-600/60 text-rose-400'
                          : f.safetyBadge === 'AMARILLO'
                          ? 'bg-amber-950/80 border border-amber-600/60 text-amber-400'
                          : 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-400'
                      }`}
                    >
                      {f.safetyBadge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right dossier (7 cols) */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-black border-2 border-cyan-500/40 space-y-3 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">RUTA DE SISTEMA:</span>
                  <code className="text-white font-bold text-xs select-all">{activeFolder.path}</code>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    activeFolder.safetyBadge === 'ROJO'
                      ? 'bg-rose-950 border border-rose-500 text-rose-300'
                      : activeFolder.safetyBadge === 'AMARILLO'
                      ? 'bg-amber-950 border border-amber-500 text-amber-300'
                      : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  }`}
                >
                  RIESGO: {activeFolder.safetyBadge}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">PROPÓSITO EN EL KERNEL:</span>
                <p className="text-zinc-200 font-sans-editorial text-xs leading-relaxed mt-0.5">
                  {activeFolder.purpose}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">¿SE PUEDE BORRAR O LIMPIAR?:</span>
                <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                  {activeFolder.canDeleteOrClean}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">MÉTODO OFICIAL DE LIMPIEZA:</span>
                <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                  {activeFolder.howToClean}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Forensic Pact */}
      {activeTab === 'PACTO' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-black border border-cyan-500/40 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
            <span className="text-cyan-400 font-bold uppercase">LOS 3 PILARES DEL PACTO DE REVERSIBILIDAD:</span>
            <span className="text-emerald-400 font-bold text-[10px]">CERO PLACEBO // CIENCIA PURA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1.5">
              <strong className="text-cyan-300 text-xs block">1. MEDIR ANTES DE TOCAR</strong>
              <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                Sin línea base (BIOS time, LatencyMon &lt;1000 µs, Commit Charge en reposo), cualquier
                supuesta mejora de velocidad es mero efecto placebo de autosugestión.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1.5">
              <strong className="text-amber-300 text-xs block">2. CAMINO DE REGRESO</strong>
              <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                Toda intervención técnica debe tener un comando de reversión documentado (exportación .reg,
                copia de seguridad BCD o punto de restauración VSS).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1.5">
              <strong className="text-emerald-300 text-xs block">3. AISLAR VARIABLES</strong>
              <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                Modificar un solo parámetro a la vez. Si aplicás diez cambios en simultáneo, no sabés cuál
                solucionó la falla ni cuál introdujo inestabilidad secundaria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   1. MODULE 01: RING ARCHITECTURE & NT KERNEL BOUNDARY
========================================================================= */
const RingArchitectureVisual: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full space-y-1.5 font-mono-tech select-none">
        <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-950 pb-1">
          <span className="font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            ANILLOS DE PRIVILEGIO // AISLAMIENTO DETERMINISTA
          </span>
          <span className="text-zinc-500">TRAP GATE HARDWARE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {/* Ring 3 */}
          <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/40 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold">
              <span>RING 3: USER MODE</span>
              <span className="text-[9px] bg-blue-950 px-1 rounded">AISLADO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              Apps (Chrome, juegos), DLLs cliente y procesos base (explorer.exe).
            </p>
            <div className="text-[9px] text-zinc-400 font-mono-tech pt-0.5 border-t border-blue-900/40 truncate">
              Crash ➔ Afecta sólo al proceso
            </div>
          </div>

          {/* Syscall Gate */}
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/50 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
              <span>CPU TRAP GATE</span>
              <span className="text-[9px] bg-cyan-950 px-1 rounded text-cyan-300">SYSCALL</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              ntdll.dll ➔ KiSystemCall64 conmuta CR3 y salva registros de CPU.
            </p>
            <div className="text-[9px] text-emerald-400 font-mono-tech pt-0.5 border-t border-cyan-900/40 truncate">
              Protección por Hardware x64
            </div>
          </div>

          {/* Ring 0 */}
          <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/40 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold">
              <span>RING 0: KERNEL NT</span>
              <span className="text-[9px] bg-rose-950 px-1 rounded text-rose-300">PRIVILEGIADO</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
              ntoskrnl.exe, HAL.dll, Drivers de GPU, NVMe y Red. Acceso total a RAM.
            </p>
            <div className="text-[9px] text-rose-300 font-mono-tech pt-0.5 border-t border-rose-900/40 truncate">
              Excepción no controlada ➔ BSOD
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ring 3: User Mode */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/30 to-black border border-blue-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs font-bold text-blue-400 uppercase tracking-wider">
              RING 3 // MODO USUARIO (USER MODE)
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono-tech text-[10px]">
              ESPACIO AISLADO
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans-editorial">
            Memoria virtual privada: <code className="text-blue-300">0x00000000'00000000</code> a <code className="text-blue-300">0x00007FFF'FFFFFFFF</code>. Un fallo acá congela solo la app, no el equipo.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-2 rounded bg-zinc-900/90 border border-blue-900/50 text-center font-mono-tech text-[11px] text-zinc-200">
              <span className="block text-blue-400 font-bold">APLICACIONES</span>
              Chrome, Juegos, Office
            </div>
            <div className="p-2 rounded bg-zinc-900/90 border border-blue-900/50 text-center font-mono-tech text-[11px] text-zinc-200">
              <span className="block text-blue-400 font-bold">SUBSISTEMA</span>
              kernel32.dll, user32
            </div>
            <div className="p-2 rounded bg-zinc-900/90 border border-blue-900/50 text-center font-mono-tech text-[11px] text-zinc-200">
              <span className="block text-blue-400 font-bold">PROCESOS BASE</span>
              csrss.exe, explorer.exe
            </div>
          </div>
        </div>

        {/* Transition Gate: Syscall */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-cyan-950/40 to-black border border-cyan-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs font-bold text-cyan-400 uppercase tracking-wider">
              PUERTA DE TRANSICIÓN // HARDWARE TRAP
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono-tech text-[10px]">
              CPU HARDWARE GATE
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/80 border border-cyan-800/80 font-mono-tech text-xs space-y-1 text-cyan-200">
            <div className="flex items-center justify-between">
              <span>Instrucción CPU:</span>
              <strong className="text-white">SYSCALL / SYSENTER (x64)</strong>
            </div>
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span>Despachador:</span>
              <span className="text-cyan-300">ntdll.dll ➔ KiSystemCall64</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span>Copia de seguridad:</span>
              <span className="text-emerald-400">Guarda Stack Pointer & Registers</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 font-sans-editorial">
            El procesador conmuta los bits de privilegio del registro CR3 y pasa el control al Kernel sin ceder punteros directos al hardware.
          </div>
        </div>
      </div>

      {/* Ring 0: Kernel Mode */}
      <div className="p-4 rounded-xl bg-gradient-to-b from-rose-950/20 via-black to-zinc-950 border border-rose-500/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="font-mono-tech text-xs font-bold text-rose-400 uppercase tracking-wider">
              RING 0 // MODO KERNEL (PRIVILEGIADO ABSOLUTO)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-mono-tech text-[10px]">
            BSOD SI OCURRE EXCEPCIÓN NO CONTROLADA
          </span>
        </div>
        <p className="text-xs text-zinc-400 font-sans-editorial">
          Memoria virtual compartida: <code className="text-rose-300">0xFFFF8000'00000000</code> a <code className="text-rose-300">0xFFFFFFFF'FFFFFFFF</code>. Acceso directo a I/O, puertos de bus e interrupciones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono-tech text-[11px]">
          <div className="p-2.5 rounded bg-zinc-900/90 border border-rose-900/50 text-zinc-300">
            <span className="text-rose-400 font-bold block">EXECUTIVE (NTOSKRNL)</span>
            Memory Manager, Process Manager, Security Reference Monitor
          </div>
          <div className="p-2.5 rounded bg-zinc-900/90 border border-rose-900/50 text-zinc-300">
            <span className="text-rose-400 font-bold block">MICROKERNEL</span>
            Planificador de hilos, sincronización multiprocesador, despacho
          </div>
          <div className="p-2.5 rounded bg-zinc-900/90 border border-rose-900/50 text-zinc-300">
            <span className="text-rose-400 font-bold block">DRIVERS DE DISPOSITIVO</span>
            GPU (nvlddmkm.sys), NVMe (stornvme.sys), Red (ndis.sys)
          </div>
          <div className="p-2.5 rounded bg-zinc-900/90 border border-rose-900/50 text-zinc-300">
            <span className="text-rose-400 font-bold block">HAL (HAL.DLL)</span>
            Capa de Abstracción de Hardware: APIC, Timers, ACPI de la placa
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. MODULE 02: MEMORY HIERARCHY & RAM MAP
========================================================================= */
const MemoryHierarchyVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-300">
        <span>MAPEO DE DISTRIBUCIÓN FÍSICA Y CACHÉ (16 GB INSTALADOS)</span>
        <span className="text-zinc-500">MÉTRICA NATIVA DE RESMON & RAMMAP</span>
      </div>

      {/* Memory Bar Visual */}
      <div className="w-full h-12 rounded-xl overflow-hidden flex border border-cyan-800/80 p-0.5 bg-black">
        <div
          style={{ width: '8%' }}
          className="h-full bg-zinc-700 flex flex-col justify-center items-center text-[10px] font-mono-tech text-white border-r border-black"
          title="Hardware Reserved: 1.2 GB"
        >
          <span className="font-bold">RES</span>
          <span className="text-[10px] text-zinc-200 font-bold">1.2 GB</span>
        </div>
        <div
          style={{ width: '37%' }}
          className="h-full bg-cyan-600 flex flex-col justify-center items-center text-[10px] font-mono-tech text-white border-r border-black"
          title="En uso (In Use): 5.9 GB"
        >
          <span className="font-bold">EN USO</span>
          <span className="text-[10px] text-cyan-100 font-bold">5.9 GB</span>
        </div>
        <div
          style={{ width: '10%' }}
          className="h-full bg-amber-600 flex flex-col justify-center items-center text-[10px] font-mono-tech text-white border-r border-black"
          title="Modificada (Modified): 1.6 GB"
        >
          <span className="font-bold">MOD</span>
          <span className="text-[10px] text-amber-100 font-bold">1.6 GB</span>
        </div>
        <div
          style={{ width: '33%' }}
          className="h-full bg-blue-600 flex flex-col justify-center items-center text-[10px] font-mono-tech text-white border-r border-black"
          title="En Espera (Standby Cache): 5.3 GB"
        >
          <span className="font-bold">STANDBY (EN ESPERA)</span>
          <span className="text-[10px] text-blue-100 font-bold">5.3 GB</span>
        </div>
        <div
          style={{ width: '12%' }}
          className="h-full bg-emerald-600 flex flex-col justify-center items-center text-[10px] font-mono-tech text-white"
          title="Libre (Free/Zeroed): 2.0 GB"
        >
          <span className="font-bold">LIBRE</span>
          <span className="text-[10px] text-emerald-100 font-bold">2.0 GB</span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tech">
        <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-900/60">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <span>EN USO (ACTIVE)</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Datos activos de procesos y drivers. No puede ser descartada sin mover a Pagefile.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-blue-900/60">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>STANDBY (SUPERFETCH)</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Copia de archivos de disco para carga instantánea. Si una app pide RAM, se cede en nanosegundos.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-900/60">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>MODIFICADA</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Páginas alteradas en memoria esperando a ser volcadas al disco antes de reutilizar.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-emerald-900/60">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>DISPONIBLE REAL</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            <strong className="text-emerald-300">Standby + Libre = 7.3 GB</strong>. La memoria en espera NO es memoria consumida.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. MODULE 03: PROCESS HIERARCHY & HANDLES (Process Explorer Recreación)
========================================================================= */
const ProcessTreeVisual: React.FC = () => {
  return (
    <div className="space-y-3 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400 pb-1 border-b border-cyan-950">
        <span>ÁRBOL DE PROCESOS CRÍTICOS DE SISTEMA (PROCESS EXPLORER DIDÁCTICO)</span>
        <span className="text-zinc-500 text-[10px]">JERARQUÍA INDESTRUCTIBLE</span>
      </div>

      <div className="p-3 rounded-xl bg-black/90 border border-cyan-900/70 space-y-1.5 text-xs">
        <div className="flex items-center justify-between p-1.5 rounded bg-zinc-950 text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">PID 4</span>
            <span className="font-bold text-white">System</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400">Kernel NT</span>
          </div>
          <span className="text-zinc-400 text-[11px]">Hilos del núcleo (ntoskrnl.exe)</span>
        </div>

        <div className="ml-4 flex items-center justify-between p-1.5 rounded bg-zinc-950/80 text-cyan-200">
          <div className="flex items-center gap-2">
            <span className="text-cyan-600">└─</span>
            <span className="text-zinc-500">PID 328</span>
            <span className="font-bold text-white">smss.exe</span>
            <span className="text-[10px] text-zinc-400">Session Manager Subsystem</span>
          </div>
          <span className="text-zinc-500 text-[10px]">Crea las sesiones 0 y 1</span>
        </div>

        <div className="ml-8 flex items-center justify-between p-1.5 rounded bg-zinc-950/80 text-cyan-200">
          <div className="flex items-center gap-2">
            <span className="text-cyan-600">├─</span>
            <span className="text-zinc-500">PID 480</span>
            <span className="font-bold text-white">csrss.exe</span>
            <span className="text-[10px] text-zinc-400">Client/Server Runtime (Sesión 0)</span>
          </div>
          <span className="text-rose-400 text-[10px]">Proceso Crítico (BSOD si muere)</span>
        </div>

        <div className="ml-8 flex items-center justify-between p-1.5 rounded bg-zinc-950/80 text-cyan-200">
          <div className="flex items-center gap-2">
            <span className="text-cyan-600">└─</span>
            <span className="text-zinc-500">PID 564</span>
            <span className="font-bold text-white">wininit.exe</span>
            <span className="text-[10px] text-zinc-400">Windows Initialization</span>
          </div>
          <span className="text-zinc-500 text-[10px]">Inicia servicios del sistema</span>
        </div>

        <div className="ml-12 flex items-center justify-between p-1.5 rounded bg-zinc-950/80 text-cyan-200">
          <div className="flex items-center gap-2">
            <span className="text-cyan-600">├─</span>
            <span className="text-zinc-500">PID 688</span>
            <span className="font-bold text-white">services.exe</span>
            <span className="text-[10px] text-zinc-400">Service Control Manager (SCM)</span>
          </div>
          <span className="text-emerald-400 text-[10px]">Padre de todos los svchost</span>
        </div>

        <div className="ml-16 flex items-center justify-between p-1.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-200">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">└─</span>
            <span className="text-zinc-500">PID 1024</span>
            <span className="font-bold text-cyan-300">svchost.exe</span>
            <span className="text-[10px] px-1 bg-cyan-900/60 rounded text-cyan-200">-k LocalServiceNetworkRestricted</span>
          </div>
          <span className="text-zinc-400 text-[10px]">Audio, DHCP, Eventos</span>
        </div>
      </div>

      <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
        <strong className="text-cyan-400 font-mono-tech">REGLA FORENSE EVO:</strong> Si un proceso llamado <code className="text-white">svchost.exe</code> tiene como padre a <code className="text-white">explorer.exe</code> o a una carpeta temporal en lugar de <code className="text-white">services.exe</code>, es malware disfrazado con 100% de certeza.
      </div>
    </div>
  );
};

/* =========================================================================
   4. MODULE 04: DPC / ISR LATENCY TIMELINE
========================================================================= */
const DpcIsrLatencyVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>TIMELINE DE ATENCIÓN DE INTERRUPCIÓN (LATENCYMON DIDÁCTICO)</span>
        <span className="text-rose-400 text-[10px]">LÍMITE AUDITIVO CRÍTICO: 1000 µs</span>
      </div>

      <div className="space-y-2">
        {/* Timeline Bar Normal Driver */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between font-mono-tech text-xs">
            <span className="text-emerald-400 font-bold">DRIVER SANO (Ej. NVMe stornvme.sys)</span>
            <span className="text-emerald-300">42 µs [ÓPTIMO]</span>
          </div>
          <div className="w-full bg-black h-4 rounded-full overflow-hidden flex border border-emerald-950">
            <div style={{ width: '4%' }} className="bg-emerald-400 h-full"></div>
            <div className="flex-1 bg-zinc-900"></div>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Atiende la interrupción, programa la DPC y libera la CPU en menos de 50 microsegundos.
          </p>
        </div>

        {/* Timeline Bar Rogue Driver */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-rose-500/40 space-y-1">
          <div className="flex items-center justify-between font-mono-tech text-xs">
            <span className="text-rose-400 font-bold">DRIVER DEFECTUOSO / RETRASO DPC (Ej. ndis.sys / ACPI.sys)</span>
            <span className="text-rose-300">2,410 µs [CRÍTICO // AUDIO DROP]</span>
          </div>
          <div className="w-full bg-black h-4 rounded-full overflow-hidden flex border border-rose-950">
            <div style={{ width: '85%' }} className="bg-gradient-to-r from-amber-500 to-rose-500 h-full"></div>
            <div className="flex-1 bg-zinc-900"></div>
          </div>
          <p className="text-[11px] text-rose-300/90 font-sans-editorial">
            El driver retiene el núcleo en <code className="text-white font-mono">DISPATCH_LEVEL</code> (IRQL 2). El hilo de audio no puede ejecutar y se produce un buffer underrun (chasquido / stuttering en juego).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono-tech">
        <div className="p-2 rounded bg-black border border-cyan-950">
          <span className="text-cyan-400 font-bold block mb-0.5">ISR (Interrupt Service Routine)</span>
          <span className="text-zinc-400 text-[11px]">Se ejecuta a DIRQL. Trabajo mínimo: apagar señal física y encolar DPC.</span>
        </div>
        <div className="p-2 rounded bg-black border border-cyan-950">
          <span className="text-cyan-400 font-bold block mb-0.5">DPC (Deferred Procedure Call)</span>
          <span className="text-zinc-400 text-[11px]">Se ejecuta a IRQL 2. Trabajo pesado. Si tarda &gt;1 ms, rompe tiempo real.</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. MODULE 05: NTFS MFT RECORD 1024-BYTE STRUCTURE
========================================================================= */
const NtfsMftVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>ESTRUCTURA DE UN REGISTRO MFT (1024 BYTES EXACTOS)</span>
        <span className="text-zinc-500 text-[10px]">TODO ARCHIVO ES UN REGISTRO</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-800/80 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono-tech text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/90 border border-cyan-950 text-cyan-300">
            <span className="text-[10px] text-zinc-500 block">OFFSET 0x00</span>
            <strong className="block text-white">CABECERA 'FILE'</strong>
            <span className="text-[10px] text-cyan-400">Firma mágica (4 bytes)</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/90 border border-cyan-950 text-cyan-300">
            <span className="text-[10px] text-zinc-500 block">TIPO 0x10</span>
            <strong className="block text-white">$STANDARD_INFO</strong>
            <span className="text-[10px] text-cyan-400">Marcas de tiempo MACB</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/90 border border-cyan-950 text-cyan-300">
            <span className="text-[10px] text-zinc-500 block">TIPO 0x30</span>
            <strong className="block text-white">$FILE_NAME</strong>
            <span className="text-[10px] text-cyan-400">Nombre UTF-16 y Hardlinks</span>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-200">
            <span className="text-[10px] text-cyan-400 block font-bold">TIPO 0x80 [EL DATO]</span>
            <strong className="block text-white">$DATA</strong>
            <span className="text-[10px] text-emerald-400">Residente vs No residente</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-cyan-400 font-mono-tech font-bold block mb-1">
              ARCHIVO PEQUEÑO (&lt; 700 bytes) // DATO RESIDENTE:
            </span>
            <p className="text-zinc-400 text-[11px] font-sans-editorial">
              El contenido se guarda <em>adentro</em> del mismo registro MFT. Abrir el archivo requiere 0 saltos a sectores externos del disco.
            </p>
          </div>
          <div>
            <span className="text-amber-400 font-mono-tech font-bold block mb-1">
              ARCHIVO GRANDE // DATO NO RESIDENTE (RUNLISTS):
            </span>
            <p className="text-zinc-400 text-[11px] font-sans-editorial">
              El atributo almacena punteros de clúster LCN (Logical Cluster Number). El archivo real se fragmenta en bloques fuera de la MFT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. MODULE 06: STORAGE PIPELINE & NVME QUEUES
========================================================================= */
const NvmeStoragePipelineVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>PIPELINE DE I/O: DE USER-MODE A SILICIO NVME CON TRIM</span>
        <span className="text-emerald-400 text-[10px]">SUBMISSION & COMPLETION QUEUES</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900 space-y-3 font-mono-tech text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <div className="p-2.5 rounded bg-zinc-900 border border-cyan-950 w-full sm:w-auto flex-1">
            <span className="text-cyan-400 font-bold block">1. APP I/O</span>
            <span className="text-zinc-400 text-[10px]">ReadFile / WriteFile</span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-500 hidden sm:block shrink-0" />
          <div className="p-2.5 rounded bg-zinc-900 border border-cyan-950 w-full sm:w-auto flex-1">
            <span className="text-cyan-400 font-bold block">2. NTFS & FILTERS</span>
            <span className="text-zinc-400 text-[10px]">ntfs.sys + antivirus</span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-500 hidden sm:block shrink-0" />
          <div className="p-2.5 rounded bg-zinc-900 border border-cyan-950 w-full sm:w-auto flex-1">
            <span className="text-cyan-400 font-bold block">3. STORPORT</span>
            <span className="text-zinc-400 text-[10px]">stornvme.sys (x64)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-500 hidden sm:block shrink-0" />
          <div className="p-2.5 rounded bg-cyan-950 border border-cyan-500/60 w-full sm:w-auto flex-1">
            <span className="text-cyan-300 font-bold block">4. CONTROLADOR NVMe</span>
            <span className="text-emerald-400 text-[10px]">Doorbell Register</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1.5 font-sans-editorial text-xs">
          <div className="flex items-center justify-between font-mono-tech">
            <span className="text-cyan-400 font-bold">GESTIÓN DE SILICIO & DESASIGNACIÓN TRIM:</span>
            <span className="text-emerald-400">FSCTL_FILE_LEVEL_TRIM</span>
          </div>
          <p className="text-zinc-400 text-[11px]">
            Cuando borrás un archivo en NTFS, el sistema envía un comando TRIM al controlador del SSD avisando qué páginas NAND quedaron huérfanas, permitiendo al Garbage Collector borrarlas antes de que una futura escritura sufra penalización de ciclo read-modify-write.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. MODULE 07: BOOT PIPELINE FROM UEFI TO DESKTOP
========================================================================= */
const BootPipelineVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>FLUJO SECUENCIAL DE ARRANQUE (BOOT ENGINE WINDOWS NT)</span>
        <span className="text-zinc-500 text-[10px]">DE FIRMWARE A ESCRITORIO</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono-tech text-xs text-center">
        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="w-5 h-5 mx-auto rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[10px]">1</span>
          <strong className="block text-white">UEFI POST</strong>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">Chequeo de RAM, CPU y lectura de tabla GPT.</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="w-5 h-5 mx-auto rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[10px]">2</span>
          <strong className="block text-white">bootmgfw.efi</strong>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">Partición ESP FAT32. Lee el archivo BCD.</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="w-5 h-5 mx-auto rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[10px]">3</span>
          <strong className="block text-white">winload.efi</strong>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">Activa modo largo x64, ELAM y carga ntoskrnl.</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="w-5 h-5 mx-auto rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-[10px]">4</span>
          <strong className="block text-white">ntoskrnl.exe</strong>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">Inicializa HAL, drivers de inicio y lanza smss.exe.</p>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/60 space-y-1">
          <span className="w-5 h-5 mx-auto rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px]">5</span>
          <strong className="block text-cyan-300">SESIÓN 1 (USER)</strong>
          <p className="text-[10px] text-zinc-300 font-sans-editorial">winlogon.exe, dwm.exe y shell explorer.exe.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. MODULE 08: REGISTRY HIVE ARCHITECTURE & HBIN BLOCKS
========================================================================= */
const RegistryHiveVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>MAPEO DE COLMENAS: DISCO ➔ MEMORIA POOL (HBIN CELLS)</span>
        <span className="text-zinc-500 text-[10px]">CONFIGURATION MANAGER</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* On Disk Files */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <span className="font-mono-tech text-xs text-cyan-400 font-bold uppercase block">
            EN DISCO: ARCHIVOS COLMENA (%SystemRoot%\System32\config)
          </span>
          <div className="space-y-1.5 font-mono-tech text-xs">
            <div className="p-2 rounded bg-black border border-cyan-950 flex items-center justify-between">
              <span className="text-white">SYSTEM</span>
              <span className="text-[10px] text-zinc-500">+ SYSTEM.LOG1 / LOG2 (WAL)</span>
            </div>
            <div className="p-2 rounded bg-black border border-cyan-950 flex items-center justify-between">
              <span className="text-white">SOFTWARE</span>
              <span className="text-[10px] text-zinc-500">Configuración global de apps</span>
            </div>
            <div className="p-2 rounded bg-black border border-cyan-950 flex items-center justify-between">
              <span className="text-white">NTUSER.DAT</span>
              <span className="text-[10px] text-zinc-500">Perfil del usuario (\Users\...)</span>
            </div>
          </div>
        </div>

        {/* In Memory Structure */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-800/80 space-y-2">
          <span className="font-mono-tech text-xs text-cyan-300 font-bold uppercase block">
            EN RAM: ESTRUCTURA HBIN (HIVE BIN BLOCKS 4096 BYTES)
          </span>
          <div className="p-3 rounded-lg bg-black border border-cyan-900/60 font-mono-tech text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold">NK CELL</span>
              <span className="text-zinc-300">Named Key Cell (Nombre de clave y subclaves)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold">VK CELL</span>
              <span className="text-zinc-300">Value Key Cell (Nombre del valor y tipo de dato)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">DATA CELL</span>
              <span className="text-zinc-300">Contenido crudo (DWORD, String o Binario)</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Windows nunca busca en disco al leer el Registro; consulta la memoria mapeada y vuelca cambios asíncronamente con Flush.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. MODULE 09: EVENT LOG & ETW FORENSICS
========================================================================= */
const EventLogEtwVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>PIPELINE FORENSE DE EVENT VIEWER & ETW (EVENT TRACING FOR WINDOWS)</span>
        <span className="text-zinc-500 text-[10px]">CHUNKS BINARIOS .EVTX 64KB</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900/70 space-y-3 font-mono-tech text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block mb-1">PROVEEDOR ETW</span>
            <span className="text-zinc-400 text-[11px]">Microsoft-Windows-Kernel-Power</span>
          </div>
          <div className="p-3 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block mb-1">SERVICIO EVENTLOG</span>
            <span className="text-zinc-400 text-[11px]">Despacho en svchost.exe</span>
          </div>
          <div className="p-3 rounded bg-cyan-950/40 border border-cyan-500/50">
            <span className="text-cyan-300 font-bold block mb-1">ARCHIVO C:\...\System.evtx</span>
            <span className="text-emerald-400 text-[11px]">Registro Inmutable firmado</span>
          </div>
        </div>

        {/* XML Evtx Mock Display */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
          <div className="text-cyan-400 font-bold">RECONSTRUCCIÓN DE REGISTRO FORENSE CRÍTICO (EVENT ID 41):</div>
          <div className="text-zinc-400">
            &lt;<span className="text-blue-400">Event</span> xmlns="http://schemas.microsoft.com/win/2004/08/events/event"&gt;<br />
            &nbsp;&nbsp;&lt;<span className="text-cyan-300">System</span>&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-emerald-400">EventID</span>&gt;41&lt;/<span className="text-emerald-400">EventID</span>&gt; &lt;!-- Apagado repentino sin cierre limpio --&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-amber-400">BugcheckCode</span>&gt;0x00000124&lt;/<span className="text-amber-400">BugcheckCode</span>&gt; &lt;!-- WHEA_UNCORRECTABLE_ERROR --&gt;<br />
            &nbsp;&nbsp;&lt;/<span className="text-cyan-300">System</span>&gt;<br />
            &lt;/<span className="text-blue-400">Event</span>&gt;
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   10. MODULE 10: NETWORK SOCKETS & TCP MATRIX (TCPView Recreación)
========================================================================= */
const NetworkSocketsVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>MATRIZ DE CONEXIONES Y SOCKETS (TCPVIEW DIDÁCTICO EVO)</span>
        <span className="text-zinc-500 text-[10px]">ESTADOS DEL PROTOCOLO TCP/IP</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-cyan-900/80 bg-black">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 border-b border-cyan-950 text-cyan-400 text-[11px]">
            <tr>
              <th className="p-2.5">PROCESO</th>
              <th className="p-2.5">PID</th>
              <th className="p-2.5">DIRECCIÓN LOCAL</th>
              <th className="p-2.5">DIRECCIÓN REMOTA</th>
              <th className="p-2.5">ESTADO TCP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300 text-[11px]">
            <tr className="hover:bg-cyan-950/20">
              <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                msedge.exe
              </td>
              <td className="p-2.5 text-zinc-400">7420</td>
              <td className="p-2.5 text-cyan-300">192.168.1.45:51280</td>
              <td className="p-2.5 text-blue-300">142.250.190.46:443</td>
              <td className="p-2.5">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                  ESTABLISHED
                </span>
              </td>
            </tr>
            <tr className="hover:bg-cyan-950/20">
              <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                svchost.exe (Dnscache)
              </td>
              <td className="p-2.5 text-zinc-400">1104</td>
              <td className="p-2.5 text-cyan-300">192.168.1.45:53210</td>
              <td className="p-2.5 text-blue-300">1.1.1.1:53 (UDP)</td>
              <td className="p-2.5">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">
                  DATAGRAM (DNS)
                </span>
              </td>
            </tr>
            <tr className="hover:bg-cyan-950/20">
              <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                System (HTTP.sys)
              </td>
              <td className="p-2.5 text-zinc-400">4</td>
              <td className="p-2.5 text-cyan-300">0.0.0.0:80</td>
              <td className="p-2.5 text-zinc-500">0.0.0.0:0</td>
              <td className="p-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">
                  LISTENING
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 text-[11px] text-zinc-400 font-sans-editorial">
        <strong className="text-cyan-400 font-mono-tech">DIAGNÓSTICO INMEDIATO:</strong> Un puerto en <code className="text-white">LISTENING</code> expone un servidor escuchando conexiones entrantes; un socket en <code className="text-white">ESTABLISHED</code> mantiene un canal bidireccional de datos con un servidor remoto.
      </div>
    </div>
  );
};

/* =========================================================================
   11. MODULE 11: SCM SERVICES & MULTI-INSTANCE SVCHOST
========================================================================= */
const ScmServicesVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>ARQUITECTURA DE AISLAMIENTO: SERVICES.EXE Y SVCHOST AGRUPADOS</span>
        <span className="text-zinc-500 text-[10px]">SERVICE CONTROL MANAGER</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
        {/* LocalSystem svchost */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold">SVCHOST #1</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-800/60">LOCAL SYSTEM</span>
          </div>
          <div className="space-y-1 text-[11px] text-zinc-400">
            <div className="p-1.5 rounded bg-black border border-cyan-950 text-zinc-200">
              ▸ DcomLaunch (Llamadas RPC)
            </div>
            <div className="p-1.5 rounded bg-black border border-cyan-950 text-zinc-200">
              ▸ PlugPlay (Hardware PnP)
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 block">Privilegio total sobre el equipo.</span>
        </div>

        {/* NetworkService svchost */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-blue-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-300 font-bold">SVCHOST #2</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[10px] font-bold border border-blue-800/60">NETWORK SERVICE</span>
          </div>
          <div className="space-y-1 text-[11px] text-zinc-400">
            <div className="p-1.5 rounded bg-black border border-blue-950 text-zinc-200">
              ▸ Dnscache (Resolución DNS)
            </div>
            <div className="p-1.5 rounded bg-black border border-blue-950 text-zinc-200">
              ▸ LanmanWorkstation (SMB)
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 block">Acceso de red con identidad de máquina.</span>
        </div>

        {/* LocalService svchost */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-bold">SVCHOST #3</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">LOCAL SERVICE</span>
          </div>
          <div className="space-y-1 text-[11px] text-zinc-400">
            <div className="p-1.5 rounded bg-black border border-emerald-950 text-zinc-200">
              ▸ AudioSrv (Windows Audio)
            </div>
            <div className="p-1.5 rounded bg-black border border-emerald-950 text-zinc-200">
              ▸ EventLog (Registro)
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 block">Privilegio mínimo sin salida de red anónima.</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   12. MODULE 12: WDDM GRAPHICS & DWM PIPELINE
========================================================================= */
const WddmGraphicsVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>PIPELINE WDDM 3.x Y COMPOSICIÓN DWM (DESKTOP WINDOW MANAGER)</span>
        <span className="text-zinc-500 text-[10px]">TDR WATCHDOG 2 SEGUNDOS</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900 space-y-3 font-mono-tech text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">1. APLICACIÓN</span>
            <span className="text-zinc-400 text-[10px]">Direct3D / Vulkan</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">2. DWM.EXE</span>
            <span className="text-zinc-400 text-[10px]">Superficie DirectComposition</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">3. DXGKRNL.SYS</span>
            <span className="text-zinc-400 text-[10px]">Planificador GPU y Memoria VRAM</span>
          </div>
          <div className="p-2.5 rounded bg-cyan-950 border border-cyan-500/50">
            <span className="text-cyan-300 font-bold block">4. DRIVER GPU</span>
            <span className="text-emerald-400 text-[10px]">nvlddmkm.sys / amdkmdag</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-amber-900/40 text-xs font-sans-editorial text-amber-200/90 space-y-1">
          <div className="flex items-center gap-1.5 font-mono-tech font-bold text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>MECANISMO DE RESCATE TDR (TIMEOUT DETECTION AND RECOVERY):</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Si la GPU no responde en 2 segundos a una orden del kernel, Windows no se cuelga con pantalla azul: resetea el driver en caliente, la pantalla parpadea un segundo y emite el evento 4101 en el Visor de Eventos.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   13. MODULE 13: TASK SCHEDULER EXECUTION MATRIX
========================================================================= */
const TaskSchedulerVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>MATRIZ DE DISPARO DEL PROGRAMADOR DE TAREAS (TASK SCHEDULER ENGINE)</span>
        <span className="text-zinc-500 text-[10px]">SERVICIO SCHEDULE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1.5">
          <span className="text-cyan-400 font-bold block">1. TRIGGERS (DISPARADORES)</span>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Hora fija, inicio de sesión, arranque de máquina o evento ETW específico en el registro de Windows.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1.5">
          <span className="text-cyan-400 font-bold block">2. CONDICIONES</span>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Sólo si el equipo está inactivo, si está conectado a la corriente AC o si hay red disponible.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/80 space-y-1.5">
          <span className="text-cyan-300 font-bold block">3. ACCIONES & AISLAMIENTO</span>
          <p className="text-[11px] text-zinc-300 font-sans-editorial">
            Lanza el proceso bajo <code className="text-white">taskhostw.exe</code> con token SYSTEM o de usuario según corresponda.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   14. MODULE 14: AUTORUNS PERSISTENCE VECTOR MATRIX
========================================================================= */
const AutorunsPersistenceVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>VECTORES DE PERSISTENCIA CRÍTICOS (AUTORUNS DIDÁCTICO EVO)</span>
        <span className="text-zinc-500 text-[10px]">AUDITORÍA FORENSE DE ARRANQUE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-tech text-xs">
        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold">CLAVES RUN & RUNONCE</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-800/60">REGISTRO</span>
          </div>
          <code className="text-[10px] text-zinc-400 block bg-black p-1.5 rounded">
            HKLM\Software\Microsoft\Windows\CurrentVersion\Run
          </code>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Punto tradicional de persistencia. Se inicia tras el logon del usuario en Explorer.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold">WINLOGON SHELL & USERINIT</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 text-[10px] font-bold border border-rose-800/60">ALTO RIESGO</span>
          </div>
          <code className="text-[10px] text-zinc-400 block bg-black p-1.5 rounded">
            HKLM\...\Winlogon\Shell = "explorer.exe"
          </code>
          <p className="text-[11px] text-zinc-400 font-sans-editorial">
            Si un malware añade su ejecutable acá, corre antes del escritorio en sesión interactiva.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   15. MODULE 15: REGISTRY LOW-LEVEL TYPES & HEX REPRESENTATION
========================================================================= */
const RegistryHexTypesVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>TIPOS DE DATOS BINARIOS EN REGISTRO DE WINDOWS</span>
        <span className="text-zinc-500 text-[10px]">LITTLE ENDIAN & ENCODING</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="text-cyan-400 font-bold block">REG_DWORD (32 bits)</span>
          <div className="p-1.5 rounded bg-black text-[11px] text-emerald-400">
            dword:00000001
          </div>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">
            Entero de 4 bytes. Almacenado en orden invertido (Little Endian: 01 00 00 00).
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="text-cyan-400 font-bold block">REG_SZ (Cadena)</span>
          <div className="p-1.5 rounded bg-black text-[11px] text-blue-400">
            "C:\Windows\System32"
          </div>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">
            Texto plano terminado en byte nulo (UTF-16LE, 2 bytes por carácter).
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
          <span className="text-cyan-400 font-bold block">REG_BINARY (Hex crudo)</span>
          <div className="p-1.5 rounded bg-black text-[11px] text-amber-400 truncate">
            hex:4d,5a,90,00,03
          </div>
          <p className="text-[10px] text-zinc-400 font-sans-editorial">
            Secuencia arbitraria de bytes para flags binarios o certificados.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   16. MODULE 16: TELEMETRY & DIAGNOSTIC DATA PIPELINE
========================================================================= */
const TelemetryPipelineVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>PIPELINE OFICIAL DE TELEMETRÍA (DIAGTRACK UTC ENGINE)</span>
        <span className="text-zinc-500 text-[10px]">REQUERIDA VS OPCIONAL</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900 space-y-3 font-mono-tech text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">1. EVENTOS ETW</span>
            <span className="text-zinc-400 text-[10px]">Crashes, drivers, CPU</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">2. DIAGTRACK</span>
            <span className="text-zinc-400 text-[10px]">Connected User Experiences</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block">3. BUFFER LOCAL</span>
            <span className="text-zinc-400 text-[10px]">Cifrado y comprimido</span>
          </div>
          <div className="p-2.5 rounded bg-cyan-950 border border-cyan-500/50">
            <span className="text-cyan-300 font-bold block">4. HTTPS TLS 1.3</span>
            <span className="text-emerald-400 text-[10px]">v10.events.data.ms</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
          <strong className="text-cyan-400 font-mono-tech">VERDAD TÉCNICA:</strong> Poner telemetría en "Requerida" tiene impacto basal imperceptible en reposo (&lt;0.1% CPU) y permite recibir parches de seguridad correctos. Destruir el servicio con scripts rompe Windows Update y el Store.
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   17. MODULE 17: CBS SERVICING & WINSXS ARCHITECTURE
========================================================================= */
const CbsWinSxSVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>CBS (COMPONENT-BASED SERVICING) Y HARD LINKS DE WINSXS</span>
        <span className="text-zinc-500 text-[10px]">SISTEMA DE ARCHIVOS NTFS</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900 space-y-3 font-mono-tech text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <span className="text-cyan-400 font-bold block">C:\Windows\WinSxS (ALMACÉN REAL)</span>
            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              Contiene los binarios físicos reales de cada versión y arquitectura. Es la única copia física en el disco.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <span className="text-cyan-400 font-bold block">C:\Windows\System32 (HARD LINKS)</span>
            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              No ocupa espacio extra: son enlaces duros (Hard Links) que apuntan al mismo clúster MFT dentro de WinSxS.
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 font-sans-editorial">
          <strong className="text-cyan-400 font-mono-tech">REGLA FORENSE:</strong> El tamaño que el Explorador reporta para WinSxS es una ilusión óptica matemática por duplicación de punteros. Borrar archivos de acá corrompe Windows irremediablemente.
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   18. MODULE 18: UAC SECURE DESKTOP ISOLATION
========================================================================= */
const UacSecureDesktopVisual: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
        <span>AISLAMIENTO DEL ESCRITORIO SEGURO (UAC & INTEGRITY LEVELS)</span>
        <span className="text-emerald-400 text-[10px]">WINSTA0\DESKTOP_SECURE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-blue-900/60 space-y-2">
          <span className="text-blue-400 font-bold block">ESCRITORIO ESTÁNDAR (WinSta0\Default)</span>
          <div className="p-2 rounded bg-black border border-blue-950 text-zinc-300 text-[11px]">
            Nivel de Integridad: <strong className="text-blue-300">MEDIUM (Medio)</strong><br />
            Explorer.exe, Navegador, Malware en ejecución.
          </div>
          <p className="text-[10px] text-zinc-500 font-sans-editorial">
            Puede enviar mensajes de ventana (PostMessage / SendMessage) a otras apps de igual nivel.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/60 space-y-2">
          <span className="text-cyan-300 font-bold block">ESCRITORIO SEGURO (WinSta0\Desktop_Secure)</span>
          <div className="p-2 rounded bg-black border border-cyan-800 text-cyan-200 text-[11px]">
            Nivel de Integridad: <strong className="text-cyan-400">SYSTEM (consent.exe)</strong><br />
            Pantalla oscurecida aislada por hardware.
          </div>
          <p className="text-[10px] text-emerald-300 font-sans-editorial">
            Ningún proceso en modo usuario puede inyectar clics ni simular teclas. Requiere intervención humana física.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   19. MODULE 19: WINRE, BCD REPAIR & IN-PLACE SERVICING PIPELINE
========================================================================= */
const WinreBcdPipelineVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>ESTRUCTURA DE PARTICIONES GPT Y MATRIZ DE RECUPERACIÓN NO DESTRUCTIVA</span>
        <span className="text-zinc-500 text-[10px]">BCDBOOT & REPAIR IN-PLACE</span>
      </div>

      {/* Partition Map */}
      <div className="p-4 rounded-xl bg-black border border-cyan-900/80 space-y-3">
        <span className="text-[11px] text-zinc-400 font-bold block">
          MAPEO FÍSICO DE UN DISCO GPT SANO // ARRANQUE UEFI:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 text-cyan-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-500">PARTICIÓN 1 (100 MB)</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-800/60">FAT32</span>
            </div>
            <strong className="block text-white text-xs">ESP (EFI SYSTEM)</strong>
            <span className="text-[10px] text-cyan-400">\EFI\Microsoft\Boot\BCD</span>
            <p className="text-[10.5px] text-zinc-300 mt-1 font-sans-editorial">
              Si se corrompe ➔ Error 0xc000000e. Solución: <code>bcdboot C:\Windows /s S: /f UEFI</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 text-cyan-300 sm:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-500">PARTICIÓN 2 (Resto GB)</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[10px] font-bold border border-blue-800/60">NTFS</span>
            </div>
            <strong className="block text-white text-xs">VOLUMEN C: (SISTEMA)</strong>
            <span className="text-[10px] text-blue-300">\Windows\System32\winload.efi</span>
            <p className="text-[10.5px] text-zinc-300 mt-1 font-sans-editorial">
              Tus archivos, programas y usuarios viven acá. Formatear este volumen es el último recurso.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-emerald-950 text-emerald-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-500">PARTICIÓN 3 (~600 MB)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">OCULTA</span>
            </div>
            <strong className="block text-white text-xs">WINRE (RECUPERACIÓN)</strong>
            <span className="text-[10px] text-emerald-400">\Recovery\WindowsRE\winre.wim</span>
            <p className="text-[10.5px] text-zinc-300 mt-1 font-sans-editorial">
              Se carga en RAM X:\ para consola de rescate, DISM offline y puntos de restauración.
            </p>
          </div>
        </div>

        {/* In-Place Repair Flow */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-950/40 to-black border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-cyan-300 block">
              PROTOCOLO DE REPARACIÓN IN-PLACE (UPGRADE SOBRE SÍ MISMO):
            </span>
            <p className="text-[11px] text-zinc-300 font-sans-editorial">
              Montar ISO oficial ➔ Ejecutar <code>setup.exe</code> ➔ Conservar archivos personales y apps.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-center shrink-0">
            <span className="block font-bold text-[10px] uppercase">RESULTADO PERICIAL</span>
            <span className="text-xs">100% Kernel nuevo, 0% datos perdidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   20. MODULE 20: ADAPTIVE PERFORMANCE & DPC METROLOGY (LatencyMon)
========================================================================= */
const AdaptiveDpcMetrologyVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>METROLOGÍA DE LATENCIA DPC Y ANÁLISIS DE INTERRUPCIONES (LATENCYMON DIDÁCTICO)</span>
        <span className="text-rose-400 text-[10px]">UMBRAL DE CORTE: 1000 µs</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900/80 space-y-3">
        {/* Core Latency Bars */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-emerald-900/50 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold">DRIVER DE ALMACENAMIENTO // stornvme.sys</span>
              <span className="text-emerald-300">48 µs [ÓPTIMO // PASA]</span>
            </div>
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '5%' }} className="bg-emerald-400 h-full"></div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-900/50 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyan-400 font-bold">DRIVER GRÁFICO // nvlddmkm.sys</span>
              <span className="text-cyan-300">220 µs [ACEPTABLE]</span>
            </div>
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '22%' }} className="bg-cyan-400 h-full"></div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-rose-900/60 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-rose-400 font-bold">DRIVER DE RED CON AHORRO ENERGÉTICO // ndis.sys</span>
              <span className="text-rose-400 font-bold">2,850 µs [PICO CRÍTICO // AUDIO DROP]</span>
            </div>
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '92%' }} className="bg-gradient-to-r from-amber-500 to-rose-500 h-full"></div>
            </div>
          </div>
        </div>

        {/* ACPI Power Plan Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <span className="text-cyan-400 font-bold block">PLAN EQUILIBRADO (RECOMENDADO EVO)</span>
            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              Permite a los núcleos bajar a estados de reposo C1/C6. Temperaturas menores en reposo y mayor margen térmico para alcanzar frecuencias Turbo Boost máximas.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-amber-950 space-y-1">
            <span className="text-amber-400 font-bold block">PLAN ALTO RENDIMIENTO FORZADO</span>
            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              Traba la CPU en estado C0 a máxima frecuencia y voltaje continuo. Aumenta consumo, calor residual y dispara thermal throttling sin aportar más FPS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   21. MODULE 21: LOW-RESOURCE PC SURVIVAL & STORAGE I/O QUEUE
========================================================================= */
const LowResourceHddIoVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>ANATOMÍA DEL CUELLO DE BOTELLA: HDD MECÁNICO 100% VS SILICIO SSD</span>
        <span className="text-amber-400 text-[10px]">CURRENT DISK QUEUE LENGTH</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900/80 space-y-3">
        {/* Metrology Comparison: HDD vs SSD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-bold">HDD MECÁNICO (5400 RPM)</span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800/60">SATURACIÓN</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div className="flex justify-between">
                <span>Latencia de Búsqueda (Seek):</span>
                <strong className="text-rose-400">12 a 18 ms</strong>
              </div>
              <div className="flex justify-between">
                <span>IOPS Aleatorios 4K:</span>
                <strong className="text-rose-400">~75 IOPS</strong>
              </div>
              <div className="flex justify-between">
                <span>Tiempo de Respuesta en Carga:</span>
                <strong className="text-rose-400">1,850 ms (1.8s)</strong>
              </div>
              <div className="flex justify-between">
                <span>Longitud de Cola de Disco:</span>
                <strong className="text-rose-400">Cola: 6.8 [TRABADO]</strong>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans-editorial">
              El cabezal electromecánico viaja de un sector a otro. El 100% de uso indica que el brazo mecánico no da abasto.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-emerald-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">SSD SATA BÁSICO (NAND FLASH)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/60">FLUIDEZ TOTAL</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div className="flex justify-between">
                <span>Latencia de Acceso a Celda:</span>
                <strong className="text-emerald-400">0.05 a 0.1 ms</strong>
              </div>
              <div className="flex justify-between">
                <span>IOPS Aleatorios 4K:</span>
                <strong className="text-emerald-400">80,000+ IOPS</strong>
              </div>
              <div className="flex justify-between">
                <span>Tiempo de Respuesta en Carga:</span>
                <strong className="text-emerald-400">1.2 ms</strong>
              </div>
              <div className="flex justify-between">
                <span>Longitud de Cola de Disco:</span>
                <strong className="text-emerald-400">Cola: 0.1 [DESPEJADO]</strong>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans-editorial">
              Sin partes móviles. Múltiples órdenes de magnitud en IOPS frente a discos mecánicos resuelven el cuello de botella por tiempo de respuesta.
            </p>
          </div>
        </div>

        {/* Visual Tweaks in sysdm.cpl */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-cyan-300 block">
              AJUSTE DE EFECTOS VISUALES EN SYSDM.CPL (RESCATE DE RAM/VRAM):
            </span>
            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              Desactivar animaciones de minimizado y sombras ahorra hasta 350 MB de memoria gráfica compartida en iGPUs antiguas.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-bold uppercase shrink-0">
            SystemPropertiesPerformance.exe
          </span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   22. MODULE 22: EMERGENCY PROTOCOLS & CRISIS DECISION MATRIX
========================================================================= */
const EmergencyProtocolsVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-rose-400">
        <span>MATRIZ DE ACCIÓN ANTE CRISIS // PROTOCOLOS DE PRIMEROS AUXILIOS</span>
        <span className="text-zinc-500 text-[10px]">REGLA: NO DESTRUIR EVIDENCIA</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Crisis 1 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold">1. PANTALLA NEGRA CON CURSOR</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800/60">DWM VIVO</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-sans-editorial">
            El mouse se mueve: el kernel y el driver de video responden. Lo que colapsó es el shell <code className="text-white">explorer.exe</code>.
          </p>
          <div className="p-2 rounded bg-black border border-amber-950/80 text-[10.5px] space-y-1">
            <div className="text-amber-300 font-bold">ACCIONES DE RESCATE:</div>
            <div className="text-zinc-300">▸ <strong>Win + Ctrl + Shift + B</strong> (Reinicia driver GPU)</div>
            <div className="text-zinc-300">▸ <strong>Ctrl + Shift + Esc</strong> (Abre Taskmgr)</div>
            <div className="text-emerald-400">▸ Archivo ➔ Ejecutar: <code>explorer.exe</code></div>
          </div>
        </div>

        {/* Crisis 2 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-rose-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-rose-400 font-bold">2. BUCLE BSOD EN ARRANQUE</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800/60">BUGCHECK</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-sans-editorial">
            El sistema detiene la CPU para evitar corrupción de almacenamiento. El código Stop revela la causa exacta.
          </p>
          <div className="p-2 rounded bg-black border border-rose-950/80 text-[10.5px] space-y-1">
            <div className="text-rose-300 font-bold">CÓDIGOS FRECUENTES:</div>
            <div className="text-zinc-300">▸ <strong>0x7B:</strong> Controlador almacenamiento/AHCI</div>
            <div className="text-zinc-300">▸ <strong>0xD1:</strong> Driver tocó memoria inválida</div>
            <div className="text-amber-400">▸ <strong>0x124:</strong> WHEA falla de silicio/voltaje</div>
          </div>
        </div>

        {/* Crisis 3 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">3. DISCO RUIDOSO / I/O CORRUPTO</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">ALERTA FÍSICA</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-sans-editorial">
            Sectores pendientes en SMART o chasquidos mecánicos. El error más grave es ejecutar chkdsk /r.
          </p>
          <div className="p-2 rounded bg-black border border-cyan-950/80 text-[10.5px] space-y-1">
            <div className="text-cyan-300 font-bold">ORDEN DE PROCEDIMIENTO:</div>
            <div className="text-rose-400 font-bold">❌ NUNCA chkdsk antes de clonar</div>
            <div className="text-zinc-300">1. Clonar a nivel de bloque (ddrescue)</div>
            <div className="text-emerald-400">2. Extraer datos desde el clon sano</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   23. MODULE 23: FORENSIC CASE STUDIES (INVESTIGACIÓN DE TALLER)
========================================================================= */
const ForensicCaseStudiesVisual: React.FC = () => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>EXPEDIENTES FORENSES DE TALLER // DE TELEMETRÍA A RESOLUCIÓN</span>
        <span className="text-zinc-500 text-[10px]">MÉTODO CIENTÍFICO EVO</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Caso 1 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CASO 01: 60 FPS MENTIROSOS (VRM THROTTLING)</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">HARDWARE</span>
          </div>
          <div className="p-2 rounded bg-black text-[11px] space-y-1 text-zinc-300 font-sans-editorial">
            <div><strong className="text-rose-400 font-mono">Síntoma:</strong> 60 FPS promedio pero micro-pausas constantes de 15 FPS.</div>
            <div><strong className="text-amber-400 font-mono">Telemetría:</strong> CPU marcaba 48°C, pero los MOSFETs de la placa madre alcanzaban 118°C.</div>
            <div><strong className="text-emerald-400 font-mono">Resolución:</strong> La placa disparaba la señal BD PROCHOT bajando la CPU a 800 MHz. Se agregó disipación activa al VRM.</div>
          </div>
        </div>

        {/* Caso 2 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CASO 02: FUGA DE 20 GB DIARIOS EN DISCO</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">ALMACENAMIENTO</span>
          </div>
          <div className="p-2 rounded bg-black text-[11px] space-y-1 text-zinc-300 font-sans-editorial">
            <div><strong className="text-rose-400 font-mono">Síntoma:</strong> Disco C: perdía 20 GB por noche sin descargar archivos.</div>
            <div><strong className="text-amber-400 font-mono">Telemetría:</strong> TreeSize detectó 60 GB en <code className="text-white">C:\Windows\Minidump</code> y LiveKernelReports.</div>
            <div><strong className="text-emerald-400 font-mono">Resolución:</strong> Driver de audio colapsaba en bucle generando un dump completo por minuto. Actualización limpia de driver.</div>
          </div>
        </div>

        {/* Caso 3 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CASO 03: INTERNET CAÍDO CON IP VÁLIDA</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">REDES WINSOCK</span>
          </div>
          <div className="p-2 rounded bg-black text-[11px] space-y-1 text-zinc-300 font-sans-editorial">
            <div><strong className="text-rose-400 font-mono">Síntoma:</strong> Navegadores no abren páginas pero ping a 8.8.8.8 responde perfecto.</div>
            <div><strong className="text-amber-400 font-mono">Telemetría:</strong> Proveedor de servicio estratificado (LSP) de VPN desinstalado quedó huérfano.</div>
            <div><strong className="text-emerald-400 font-mono">Resolución:</strong> Reset de la pila de transporte: <code>netsh winsock reset ; netsh int ip reset</code>.</div>
          </div>
        </div>

        {/* Caso 4 */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CASO 04: DOBLE ANTIVIRUS // DEADLOCK I/O</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">SISTEMA DE ARCHIVOS</span>
          </div>
          <div className="p-2 rounded bg-black text-[11px] space-y-1 text-zinc-300 font-sans-editorial">
            <div><strong className="text-rose-400 font-mono">Síntoma:</strong> PC se congela 30 segundos cada vez que se abre un ejecutable.</div>
            <div><strong className="text-amber-400 font-mono">Telemetría:</strong> Dos minifiltros en NTFS.sys intentaban bloquear el mismo archivo para escaneo simultáneo.</div>
            <div><strong className="text-emerald-400 font-mono">Resolución:</strong> Desinstalación del antivirus redundante con herramienta oficial de limpieza.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   24. MODULE 24: ELITE TOOLS MATRIX & RELIABILITY MONITOR
========================================================================= */
const EliteToolsMatrixVisual: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full space-y-1.5 font-mono-tech select-none">
        <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-950 pb-1">
          <span className="font-bold flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            INSTRUMENTAL DE TALLER // APPLETS CPL & MONITOR DE CONFIABILIDAD
          </span>
          <span className="text-emerald-400 text-[9px] font-bold">PERFMON /REL</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded bg-zinc-950 border border-cyan-950">
            <code className="text-cyan-300 font-bold text-xs block">ncpa.cpl</code>
            <span className="text-[9.5px] text-zinc-400 font-sans-editorial">Adaptadores de Red</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-cyan-950">
            <code className="text-cyan-300 font-bold text-xs block">sysdm.cpl</code>
            <span className="text-[9.5px] text-zinc-400 font-sans-editorial">Propiedades de Sistema</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-cyan-950">
            <code className="text-cyan-300 font-bold text-xs block">devmgmt.msc</code>
            <span className="text-[9.5px] text-zinc-400 font-sans-editorial">Controladores & Dispositivos</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-cyan-950">
            <code className="text-cyan-300 font-bold text-xs block">diskmgmt.msc</code>
            <span className="text-[9.5px] text-zinc-400 font-sans-editorial">Particiones & Volúmenes</span>
          </div>
        </div>

        <div className="p-2 rounded bg-zinc-950 border border-cyan-900/60 flex items-center justify-between text-[10px]">
          <span className="text-zinc-300 font-mono-tech">MONITOR DE ESTABILIDAD:</span>
          <span className="text-emerald-400 font-bold">HISTORIAL DE 1 A 10 SIN INSTALAR NADA</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>MATRIZ DE COMANDOS MAESTROS Y MONITOR DE CONFIABILIDAD</span>
        <span className="text-emerald-400 text-[10px]">PERFMON /REL & APPLETS CPL</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900/80 space-y-3">
        {/* Quick Applets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-0.5">
            <code className="text-cyan-400 font-bold block">ncpa.cpl</code>
            <span className="text-[10px] text-zinc-400">Conexiones de Red Clásicas</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-0.5">
            <code className="text-cyan-400 font-bold block">sysdm.cpl</code>
            <span className="text-[10px] text-zinc-400">Propiedades del Sistema y RAM</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-0.5">
            <code className="text-cyan-400 font-bold block">devmgmt.msc</code>
            <span className="text-[10px] text-zinc-400">Administrador de Dispositivos</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-0.5">
            <code className="text-cyan-400 font-bold block">diskmgmt.msc</code>
            <span className="text-[10px] text-zinc-400">Administrador de Discos</span>
          </div>
        </div>

        {/* Reliability Monitor Preview */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold text-xs">
              LÍNEA TEMPORAL DE CONFIABILIDAD (PERFMON /REL):
            </span>
            <span className="text-[10px] text-zinc-400">ÍNDICE DE ESTABILIDAD: 1 A 10</span>
          </div>

          <div className="p-2.5 rounded-lg bg-black border border-cyan-950 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Lunes: 10/10 [Estable]</span>
              <span>Miércoles: 3.2/10 [Falla Driver RGB]</span>
              <span className="text-emerald-400 font-bold">Viernes: 9.8/10 [Revertido]</span>
            </div>
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden flex">
              <div style={{ width: '40%' }} className="bg-emerald-500 h-full"></div>
              <div style={{ width: '20%' }} className="bg-rose-500 h-full"></div>
              <div style={{ width: '40%' }} className="bg-emerald-500 h-full"></div>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans-editorial">
              Correlaciona caídas de aplicaciones con actualizaciones de Windows o instalación de controladores con fecha y hora exacta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   25. MODULE 25: GLOSSARY MATRIX // DICCIONARIO TÉCNICO A-Z
========================================================================= */
interface GlossaryCardData {
  id: string;
  term: string;
  category: 'MEMORIA' | 'KERNEL' | 'ALMACENAMIENTO' | 'SEGURIDAD';
  categoryLabel: string;
  analogy: string;
  technicalDefinition: string;
  practicalImpact: string;
  auditCommand: string;
}

const GLOSSARY_FORENSIC_ITEMS: GlossaryCardData[] = [
  {
    id: 'commit-charge',
    term: 'Commit Charge',
    category: 'MEMORIA',
    categoryLabel: 'Memoria & Virtualización',
    analogy: 'El límite de crédito total aprobado por el banco: no importa cuánto hayas gastado hoy en efectivo, es el total que el banco se comprometió a respaldar.',
    technicalDefinition: 'Cantidad total de memoria virtual privada que los procesos activos han solicitado y que el kernel NT se ha comprometido a respaldar en RAM física o en el archivo de paginación (pagefile.sys).',
    practicalImpact: 'Si el Commit Charge alcanza el Commit Limit, el Administrador de Memoria rechaza nuevas reservas y lanza fallos Out of Memory (OOM), cerrando programas abruptamente.',
    auditCommand: 'Get-Counter "\\Memory\\Committed Bytes", "\\Memory\\Commit Limit"',
  },
  {
    id: 'working-set',
    term: 'Working Set',
    category: 'MEMORIA',
    categoryLabel: 'Memoria & Virtualización',
    analogy: 'Los libros y papeles que tenés desplegados físicamente arriba de tu escritorio de trabajo en este instante.',
    technicalDefinition: 'Conjunto de páginas de memoria virtual asignadas a un proceso que residen actualmente en los chips físicos de memoria RAM (Private Working Set + Shared Working Set).',
    practicalImpact: 'En el Administrador de Tareas, la columna "Memoria" muestra el Working Set. Si el sistema sufre presión de memoria, el kernel recorta páginas del Working Set y las envía a la lista Standby o a disco.',
    auditCommand: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, WorkingSet64',
  },
  {
    id: 'non-paged-pool',
    term: 'Non-Paged Pool (Pool no paginado)',
    category: 'MEMORIA',
    categoryLabel: 'Memoria & Virtualización',
    analogy: 'Caja fuerte que nunca puede moverse de la habitación bajo ninguna circunstancia.',
    technicalDefinition: 'Rango de memoria del espacio de kernel garantizado para residir siempre en RAM física y que nunca puede ser paginado a disco bajo ninguna circunstancia (utilizado por ISRs y DPCs en IRQL >= DISPATCH_LEVEL).',
    practicalImpact: 'Si un controlador tiene fugas de memoria en el Non-Paged Pool (superando 800 MB), consume la RAM física sin que ningún proceso de usuario figure como culpable en el Administrador de Tareas.',
    auditCommand: 'poolmon.exe -p -b (Buscar tags con mayor asignación de bytes)',
  },
  {
    id: 'page-fault',
    term: 'Page Fault (Fallo de página)',
    category: 'MEMORIA',
    categoryLabel: 'Memoria & Virtualización',
    analogy: 'Buscar un libro en tu estante: si está a mano en la mesa de noche es instantáneo (Soft Fault); si tenés que ir al depósito en el sótano tarda minutos (Hard Fault).',
    technicalDefinition: 'Excepción de hardware generada por la MMU cuando un hilo intenta acceder a una dirección virtual cuya entrada de tabla de páginas (PTE) no es válida. Si la página está en memoria (Standby), es un Soft Fault; si requiere I/O de disco, es un Hard Fault.',
    practicalImpact: 'Una alta tasa de Hard Faults por segundo en discos mecánicos congela el sistema mientras los cabezales leen pagefile.sys.',
    auditCommand: 'Get-Counter "\\Memory\\Page Faults/sec", "\\Memory\\Page Reads/sec"',
  },
  {
    id: 'irql',
    term: 'IRQL (Interrupt Request Level)',
    category: 'KERNEL',
    categoryLabel: 'Kernel & Procesos',
    analogy: 'La jerarquía de prioridades en un hospital: una consulta común (PASSIVE) se interrumpe si entra una ambulancia (DIRQL).',
    technicalDefinition: 'Prioridad de interrupción administrada por el hardware del procesador y la HAL de Windows (0 a 31 en x64). Determina qué código de kernel puede interrumpir al código en ejecución.',
    practicalImpact: 'En IRQL 2 (DISPATCH_LEVEL) o superior, el despachador de hilos está deshabilitado y el código no puede acceder a memoria paginable. Violar esta regla causa el Bugcheck DRIVER_IRQL_NOT_LESS_OR_EQUAL (0xD1).',
    auditCommand: 'windbg.exe -k (Comando de depurador: !irql)',
  },
  {
    id: 'dpc',
    term: 'DPC (Deferred Procedure Call)',
    category: 'KERNEL',
    categoryLabel: 'Kernel & Procesos',
    analogy: 'Tomar la comanda rápido en un restaurante y dejar la cocción del plato para la cocina en segundo plano.',
    technicalDefinition: 'Objeto de kernel que encapsula una función diferida ejecutada en IRQL 2 (DISPATCH_LEVEL). Los controladores de hardware usan DPCs para realizar el trabajo pesado luego de que una ISR rápida reconoció la interrupción física.',
    practicalImpact: 'Si una rutina DPC de un driver de audio o red tarda más de 1.000 microsegundos en finalizar, monopoliza el núcleo de CPU y produce microstuttering, chasquidos de sonido y caídas de FPS.',
    auditCommand: 'LatencyMon.exe (Medición continua de tiempo de ejecución DPC por driver)',
  },
  {
    id: 'syscall',
    term: 'Syscall (Llamada al Sistema)',
    category: 'KERNEL',
    categoryLabel: 'Kernel & Procesos',
    analogy: 'La ventanilla blindada de un banco: los clientes no entran a la bóveda, le entregan una solicitud al cajero.',
    technicalDefinition: 'Instrucción de procesador (SYSCALL en x64) que realiza una transición atómica y segura desde el modo usuario (Ring 3) al modo kernel (Ring 0), delegando la ejecución a ntoskrnl.exe a través de la System Service Dispatch Table (SSDT).',
    practicalImpact: 'Toda operación de red, disco o creación de procesos en Windows requiere cruzar la compuerta de Syscalls. Un exceso de llamadas puede degradar la latencia de CPU.',
    auditCommand: 'Process Monitor (procmon.exe) para interceptar eventos de llamada a APIs de Windows',
  },
  {
    id: 'context-switch',
    term: 'Context Switch (Cambio de contexto)',
    category: 'KERNEL',
    categoryLabel: 'Kernel & Procesos',
    analogy: 'Un ajedrecista profesional jugando 20 partidas simultáneas: en cada tablero debe recordar la posición de las piezas antes de mover.',
    technicalDefinition: 'Operación del kernel mediante la cual el planificador (Scheduler) detiene un hilo, guarda el estado de sus registros de CPU en su Thread Control Block (TCB) y carga el estado de otro hilo para su ejecución.',
    practicalImpact: 'Miles de cambios de contexto innecesarios causados por hilos en bucle gastan ciclos de cómputo en guardar/cargar registros en vez de procesar datos útiles.',
    auditCommand: 'Get-Counter "\\System\\Context Switches/sec"',
  },
  {
    id: 'mft',
    term: '$MFT (Master File Table)',
    category: 'ALMACENAMIENTO',
    categoryLabel: 'Almacenamiento & NTFS',
    analogy: 'El libro de inventario maestro de una biblioteca donde cada libro tiene una ficha de exactamente una carilla.',
    technicalDefinition: 'Archivo de base de datos relacional oculto en el volumen NTFS donde todo archivo o carpeta existe como uno o más registros de 1.024 bytes con sus atributos (nombre, permisos, marcas temporales y punteros a clústeres).',
    practicalImpact: 'Si un archivo mide menos de ~700 bytes, NTFS lo guarda "residente" dentro del propio registro de la MFT sin asignarle clústeres en el disco, acelerando su lectura a cero latencia adicional.',
    auditCommand: 'fsutil fsinfo ntfsinfo C:',
  },
  {
    id: 'trim',
    term: 'TRIM Command',
    category: 'ALMACENAMIENTO',
    categoryLabel: 'Almacenamiento & NTFS',
    analogy: 'Avisarle al camión recolector qué contenedores de basura quedaron vacíos para que los limpie antes de que vuelvas a llenarlos.',
    technicalDefinition: 'Comando de la interfaz ATA/NVMe mediante el cual el sistema de archivos NTFS notifica al controlador del disco SSD qué bloques lógicos (LBA) ya no contienen datos válidos tras una eliminación de archivos.',
    practicalImpact: 'Mantiene alta la velocidad de escritura del SSD y previene la degradación por Write Amplification. Tras ejecutarse TRIM, la recuperación de archivos borrados mediante software forense tradicional resulta físicamente imposible.',
    auditCommand: 'fsutil behavior query DisableDeleteNotify (0 = TRIM Activo y Funcionando)',
  },
  {
    id: 'vss',
    term: 'VSS (Volume Shadow Copy Service)',
    category: 'ALMACENAMIENTO',
    categoryLabel: 'Almacenamiento & NTFS',
    analogy: 'Sacarle una foto panorámica instantánea a una ciudad en movimiento para analizarla con calma mientras la vida sigue.',
    technicalDefinition: 'Subsistema de Windows que coordina a proveedores de almacenamiento y escritores de aplicaciones para crear instantáneas atómicas de solo lectura de un volumen NTFS congeladas en un milisegundo exacto.',
    practicalImpact: 'Permite hacer copias de seguridad de archivos bloqueados en uso (como colmenas del Registro o bases de datos de correo) y sustenta los Puntos de Restauración del Sistema.',
    auditCommand: 'vssadmin list shadows',
  },
  {
    id: 'secure-desktop',
    term: 'Secure Desktop (Escritorio Seguro)',
    category: 'SEGURIDAD',
    categoryLabel: 'Seguridad & Privilegios',
    analogy: 'Una sala de firmas con vidrio antibalas separada del salón público donde nadie puede espiar ni apretar botones por vos.',
    technicalDefinition: 'Escritorio aislado de hardware (Winlogon\\Desktop_Secure) gestionado por consent.exe en Nivel de Integridad SYSTEM. El escritorio de usuario se atenúa y se bloquea el acceso de mensajes de ventana de cualquier proceso Ring 3.',
    practicalImpact: 'Impide que troyanos o scripts utilicen SendKeys, inyecciones de interfaz (UI Spoofing) o capturas de pantalla para pulsar "Aceptar" en diálogos de elevación UAC.',
    auditCommand: 'secpol.msc (Directivas locales -> Opciones de seguridad -> Comportamiento de elevación UAC)',
  },
  {
    id: 'split-token',
    term: 'Token Dividido (Filtered Admin Token)',
    category: 'SEGURIDAD',
    categoryLabel: 'Seguridad & Privilegios',
    analogy: 'Llevar la tarjeta de crédito de la empresa en el bolsillo pero necesitar una clave biométrica cada vez que querés hacer un pago grande.',
    technicalDefinition: 'Mecanismo de UAC por el cual un usuario del grupo Administradores recibe al iniciar sesión dos tokens: un token filtrado estándar (Medium IL) para sus tareas habituales y un token completo (High IL) en reposo que solo se activa tras la confirmación en el Escritorio Seguro.',
    practicalImpact: 'Garantiza que el navegador o un documento infectado nunca se ejecuten con privilegios destructivos de administrador aunque el usuario pertenezca al grupo Administradores.',
    auditCommand: 'whoami /groups (Revisar etiqueta "Grupo obligatorio, Habilitado de forma predeterminada")',
  },
  {
    id: 'integrity-level',
    term: 'Integrity Level (Nivel de Integridad)',
    category: 'SEGURIDAD',
    categoryLabel: 'Seguridad & Privilegios',
    analogy: 'Niveles de autorización de seguridad en una base militar: quien tiene nivel Medio no puede mandar órdenes ni entrar a zonas de nivel Alto.',
    technicalDefinition: 'Etiqueta de seguridad de Windows Vista/7/10/11 (Untrusted, Low, Medium, High, System) que implementa el control de acceso mandatorio (MIC) y la directiva UIPI para restringir la inyección de código y mensajes de ventana.',
    practicalImpact: 'Un proceso con Low IL (como las pestañas aisladas de un navegador web) no puede escribir en archivos de Medium IL ni modificar el Registro del usuario.',
    auditCommand: 'whoami /all | findstr "Integridad"',
  },
  {
    id: 'acl',
    term: 'ACL / DACL (Access Control List)',
    category: 'SEGURIDAD',
    categoryLabel: 'Seguridad & Privilegios',
    analogy: 'La lista de control de entrada en la puerta de un laboratorio con los nombres y las acciones permitidas a cada persona.',
    technicalDefinition: 'Lista de entradas de control de acceso (ACE) almacenada en el Descriptor de Seguridad de un objeto aseguraable (archivo, clave de registro, servicio) que especifica qué SIDs de usuario tienen permiso de lectura, escritura o control total.',
    practicalImpact: 'Cuando Windows muestra el mensaje "Acceso denegado", la DACL del objeto carece de una ACE de concesión para el SID del token del proceso solicitante.',
    auditCommand: 'icacls "C:\\Windows\\System32\\config" (Inspeccionar permisos DACL)',
  },
  {
    id: 'winsxs',
    term: 'WinSxS (Windows Side-by-Side)',
    category: 'ALMACENAMIENTO',
    categoryLabel: 'Almacenamiento & NTFS',
    analogy: 'El depósito central de repuestos originales de una fábrica: los talleres usan piezas enlazadas al depósito sin duplicar el peso.',
    technicalDefinition: 'Almacén de componentes nativo de Windows (Component Store) gestionado por CBS. Es el único lugar donde residen físicamente los binarios del sistema; los archivos en System32 son hardlinks (vínculos duros NTFS) que apuntan a WinSxS.',
    practicalImpact: 'Permite que diferentes programas usen versiones distintas de una misma DLL sin colisiones y respalda la función de reversión de actualizaciones y reparación in-place con DISM.',
    auditCommand: 'dism /online /cleanup-image /analyzecomponentstore',
  },
];

const GlossaryMatrixVisual: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full space-y-2 font-mono-tech select-none">
        <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-950 pb-1">
          <span className="font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            GLOSARIO FUNDACIONAL // 4 PILARES DEL KERNEL NT
          </span>
          <span className="text-zinc-500">DICCIONARIO FORENSE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
              <span>COMMIT CHARGE</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-tight">
              Límite de memoria virtual prometida a los procesos antes de un fallo por memoria agotada (OOM).
            </p>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
              <span>LATENCIA DPC</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-tight">
              Llamadas diferidas a procedimiento. Si superan 1000 µs causan stuttering en juegos y audio.
            </p>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
              <span>TABLA MFT</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-tight">
              Master File Table de NTFS: cada archivo es un registro de 1024 bytes con cabecera y atributos.
            </p>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold">
              <span>SECURE DESKTOP</span>
            </div>
            <p className="text-[9.5px] text-zinc-300 font-sans-editorial leading-tight">
              Escritorio aislado donde corre la confirmación de elevación UAC, inmune a clics falsos de malware.
            </p>
          </div>
        </div>
      </div>
    );
  }
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTermId, setSelectedTermId] = useState<string>('commit-charge');

  const categories = ['TODOS', 'MEMORIA', 'KERNEL', 'ALMACENAMIENTO', 'SEGURIDAD'];

  const filteredItems = GLOSSARY_FORENSIC_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'TODOS' || item.category === activeCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technicalDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.analogy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedItem =
    GLOSSARY_FORENSIC_ITEMS.find((it) => it.id === selectedTermId) || GLOSSARY_FORENSIC_ITEMS[0];

  return (
    <div className="space-y-4 font-mono-tech">
      {/* Top Visual Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-cyan-950 pb-2.5">
        <div className="flex items-center gap-2 text-cyan-400">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold">RECREACIÓN DIDÁCTICA EVO // MATRIZ FORENSE DEL KERNEL A-Z</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
          {filteredItems.length} CONCEPTOS INDEXADOS
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/90 p-3 rounded-xl border border-cyan-950">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                  : 'bg-black/60 text-zinc-400 hover:text-white border border-cyan-950 hover:border-cyan-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar concepto o sigla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/80 border border-cyan-950 focus:border-cyan-500 text-zinc-200 text-[11px] rounded-lg pl-8 pr-3 py-1.5 focus:outline-none placeholder:text-zinc-600 font-mono-tech"
          />
        </div>
      </div>

      {/* Main Interactive Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Quick Terms Selector Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isSelected = item.id === selectedItem.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedTermId(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/70 to-black border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                    : 'bg-zinc-950/70 border-cyan-950/80 hover:border-cyan-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <strong
                      className={`text-xs block truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}
                    >
                      {item.term}
                    </strong>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 block truncate font-sans-editorial">
                    {item.categoryLabel}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                    item.category === 'MEMORIA'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : item.category === 'KERNEL'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : item.category === 'ALMACENAMIENTO'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}
                >
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Forensic Term Dossier (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-black border-2 border-cyan-500/40 space-y-4 shadow-xl">
          {/* Header of Active Term */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-cyan-950 pb-3">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
                EXPEDIENTE DE TAXONOMÍA FORENSE
              </span>
              <h4 className="text-white text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                <span>{selectedItem.term}</span>
                <span className="text-cyan-400 text-xs font-mono-tech font-normal">
                  ({selectedItem.categoryLabel})
                </span>
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold">
              ESTÁNDAR KERNEL NT
            </span>
          </div>

          {/* 1. Everyday Analogy */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/50 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold uppercase">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>ANALOGÍA DIDÁCTICA EVO // PARA ENTENDER DESDE CERO:</span>
            </div>
            <p className="text-xs text-cyan-100 font-sans-editorial leading-relaxed italic">
              “{selectedItem.analogy}”
            </p>
          </div>

          {/* 2. Technical Rigor */}
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ▸ DEFINICIÓN RIGUROSA DE KERNEL NT:
            </span>
            <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed bg-zinc-950/80 p-3 rounded-xl border border-zinc-900">
              {selectedItem.technicalDefinition}
            </p>
          </div>

          {/* 3. Practical Impact */}
          <div className="space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              ▸ MANIFESTACIÓN EN PANTALLA // QUÉ MIRAR:
            </span>
            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed bg-zinc-950/80 p-3 rounded-xl border border-zinc-900">
              {selectedItem.practicalImpact}
            </p>
          </div>

          {/* 4. Audit Command */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-cyan-950 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMANDO O HERRAMIENTA NATIVA DE COMPROBACIÓN:</span>
              </span>
              <span className="text-zinc-600 text-[9px]">POWERSHELL / CMD</span>
            </div>
            <code className="text-[11px] text-cyan-300 font-mono-tech block bg-black/90 p-2 rounded border border-cyan-950/80 overflow-x-auto select-all">
              {selectedItem.auditCommand}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   26. MODULE 26: INVESTIGATOR PASSPORT & FINAL EDITORIAL ENDORSEMENT
========================================================================= */
const InvestigatorPassportVisual: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full space-y-1.5 font-mono-tech select-none">
        <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-950 pb-1">
          <span className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PASAPORTE PERICIAL // PROTOCOLO DE INTERVENCIÓN CERRADO
          </span>
          <span className="text-emerald-400 text-[9px] font-bold">CUSTODIA EVO</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded bg-zinc-950 border border-emerald-950/60 space-y-0.5">
            <span className="text-[9.5px] font-bold text-emerald-300 block">1. LÍNEA BASE</span>
            <span className="text-[9px] text-zinc-400 font-sans-editorial">Registro de DPC, RAM e hilos.</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-emerald-950/60 space-y-0.5">
            <span className="text-[9.5px] font-bold text-emerald-300 block">2. RESPALDO VSS</span>
            <span className="text-[9px] text-zinc-400 font-sans-editorial">Punto de restauración y backup .reg.</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-emerald-950/60 space-y-0.5">
            <span className="text-[9.5px] font-bold text-emerald-300 block">3. INTERVENCIÓN</span>
            <span className="text-[9px] text-zinc-400 font-sans-editorial">Una sola variable con orden pericial.</span>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-emerald-950/60 space-y-0.5">
            <span className="text-[9.5px] font-bold text-emerald-300 block">4. VALIDACIÓN</span>
            <span className="text-[9px] text-zinc-400 font-sans-editorial">Delta medido y comprobación en bitácora.</span>
          </div>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<'COMPETENCIAS' | 'ARCHIVO_EVO' | 'BIBLIOGRAFIA' | 'TOMO_03'>('COMPETENCIAS');
  const [expandedCompetency, setExpandedCompetency] = useState<number | null>(0);

  const competenciesList = [
    {
      num: '01',
      title: 'Arranque UEFI, Partición ESP y Reconstrucción BCD',
      cmd: 'bcdedit /enum {current}',
      why: 'Permite rescatar sistemas con bucles de arranque "0xc000000f" reparando el firmware y el almacén BCD sin formatear.',
    },
    {
      num: '02',
      title: 'Frontera Ring 3 vs Ring 0 y Compuerta Syscall',
      cmd: 'Get-Process | Select-Object Handles, Threads, CPU',
      why: 'Diferencia el código de usuario del código de kernel, aislando fallas de controladores de fallas de aplicaciones comunes.',
    },
    {
      num: '03',
      title: 'Jerarquía de Memoria: Standby, Working Set y Commit',
      cmd: 'Get-Counter "\\Memory\\Committed Bytes", "\\Memory\\Available MBytes"',
      why: 'Erradica el mito de la "RAM vacía" y gestiona científicamente el Commit Limit contra el pagefile.sys.',
    },
    {
      num: '04',
      title: 'Auditoría DPC/ISR en Controladores con LatencyMon',
      cmd: 'LatencyMon.exe -> Iniciar medición de microsegundos (<1000 µs)',
      why: 'Resuelve micro-stuttering y caídas de audio cazando drivers con mala gestión de energía (ej. ndis.sys).',
    },
    {
      num: '05',
      title: 'Estructura de $MFT y Almacenamiento NVMe con TRIM',
      cmd: 'fsutil behavior query DisableDeleteNotify',
      why: 'Mantiene alta la velocidad de escritura flash y previene degradación de SSDs sin perder datos del cliente.',
    },
    {
      num: '06',
      title: 'Arquitectura del Registro y Colmenas en Memoria',
      cmd: 'reg query HKLM\\SYSTEM\\CurrentControlSet\\Control',
      why: 'Comprende que el Registro es una base de datos en RAM (hives) y evita "limpiadores mágicos" destructivos.',
    },
    {
      num: '07',
      title: 'Service Control Manager y Aislamiento svchost',
      cmd: 'tasklist /svc /fi "imagename eq svchost.exe"',
      why: 'Audita los servicios del sistema por PID sin desactivar componentes críticos que rompen la criptografía de Windows.',
    },
    {
      num: '08',
      title: 'Pipeline Gráfico WDDM, DWM y Watchdog TDR',
      cmd: 'Win + Ctrl + Shift + B (Reinicio de Driver de Video en Caliente)',
      why: 'Resuelve emergencias de pantalla negra con cursor en 15 segundos sin apagar la máquina de la tecla.',
    },
    {
      num: '09',
      title: 'Servicing CBS, WinSxS y Reparación In-Place',
      cmd: 'dism /online /cleanup-image /restorehealth ; sfc /scannow',
      why: 'Aplica el orden científico obligatorio: reparar primero el almacén de componentes y luego los archivos de sistema.',
    },
    {
      num: '10',
      title: 'Triage de Crisis y Protocolo No Destructivo',
      cmd: 'Ctrl + Shift + Esc -> Archivo -> Ejecutar nueva tarea -> explorer.exe',
      why: 'Regla de Oro EVO: Diagnosticar antes de tocar, clonar antes de reparar y nunca formatear como primera opción.',
    },
  ];

  return (
    <div className="space-y-4 font-mono-tech">
      {/* Top Banner with Official Serial */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-cyan-950 pb-2.5">
        <div className="flex items-center gap-2 text-cyan-400">
          <Award className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold">RECREACIÓN DIDÁCTICA EVO // PASAPORTE DEL INVESTIGADOR FORENSE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">SERIAL:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
            EVO-NT-T02-2026-CERT
          </span>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black border-2 border-cyan-500/50 space-y-5 shadow-[0_0_35px_rgba(0,210,255,0.15)]">
        {/* Official Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">
              EVO LABS // COMPROBACIÓN EVO
            </span>
            <h3 className="text-white text-lg sm:text-xl font-bold uppercase tracking-tight">
              PASAPORTE DE INVESTIGADOR DE KERNEL NT
            </h3>
            <p className="text-xs text-zinc-400 font-sans-editorial">
              Registro de dominio de los 27 módulos (00 al 26) de arquitectura interna de Windows.
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-black uppercase tracking-wider inline-block">
              ESTADO: 100% AUDITADO
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-bold">
              27 MÓDULOS DE LABORATORIO SUPERADOS
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 flex-wrap border-b border-cyan-950 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('COMPETENCIAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'COMPETENCIAS'
                ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-cyan-950'
            }`}
          >
            10 COMPETENCIAS MAESTRAS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ARCHIVO_EVO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ARCHIVO_EVO'
                ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-cyan-950'
            }`}
          >
            ARCHIVO EVO CONSOLIDADO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BIBLIOGRAFIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'BIBLIOGRAFIA'
                ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-cyan-950'
            }`}
          >
            FUENTES OFICIALES MICROSOFT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TOMO_03')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'TOMO_03'
                ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-cyan-950'
            }`}
          >
            PUENTE AL TOMO 03 // REPARACIÓN DE PC
          </button>
        </div>

        {/* Tab 1: 10 Competencies */}
        {activeTab === 'COMPETENCIAS' && (
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
              SELECCIONÁ CUALQUIER COMPETENCIA PARA AUDITAR LA PRUEBA TÉCNICA:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {competenciesList.map((comp, idx) => {
                const isExp = expandedCompetency === idx;
                return (
                  <div
                    key={comp.num}
                    onClick={() => setExpandedCompetency(isExp ? null : idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isExp
                        ? 'bg-zinc-950 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                        : 'bg-black/60 border-cyan-950 hover:border-cyan-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/40">
                          ✓
                        </span>
                        <strong className="text-white text-xs">{comp.title}</strong>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-bold shrink-0">
                        {isExp ? '−' : '+'}
                      </span>
                    </div>

                    {isExp && (
                      <div className="pt-2 border-t border-cyan-950/80 space-y-1.5 animate-in fade-in duration-150">
                        <div>
                          <span className="text-[10px] text-cyan-300 font-bold uppercase block">
                            COMANDO PERICIAL DE AUDITORÍA:
                          </span>
                          <code className="text-[10.5px] text-cyan-200 bg-black p-1.5 rounded block border border-cyan-950 select-all font-mono-tech">
                            {comp.cmd}
                          </code>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                            POR QUÉ IMPORTA EN EL TALLER:
                          </span>
                          <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed">
                            {comp.why}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Archivo EVO Consolidado */}
        {activeTab === 'ARCHIVO_EVO' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
              <span className="text-xs text-cyan-400 font-bold uppercase block">
                ESTRUCTURA DEL LABORATORIO LOCAL (C:\EVO_LABS):
              </span>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                El "Archivo EVO" es el repositorio físico donde conservás tus registros periciales,
                scripts de PowerShell probados y respaldos antes de cualquier intervención.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 01_Bitacoras_Peritaje</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Expedientes con Síntoma, Evidencia, Hipótesis, Prueba y Conclusión firmada.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 02_Scripts_PowerShell</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Scripts de auditoría nativa de memoria, telemetría de I/O y reinicio de shell.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 03_Respaldos_BCD_Reg</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Exportaciones bcdedit /export y copias .reg de seguridad antes de modificar claves.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 04_Lineas_Base_Métricas</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Registros de LatencyMon en reposo (&lt;1000 µs), Commit Charge inicial y tiempos BIOS.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 05_Dumps_Crash_Reports</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Volcados .dmp analizados con WinDbg para determinar controladores culpables de BSOD.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyan-900/60 space-y-1">
                <span className="text-cyan-300 font-bold block">📁 06_Herramientas_Portables</span>
                <p className="text-[10px] text-zinc-400 font-sans-editorial">
                  Suite Sysinternals oficial firmada (ProcMon, Process Explorer, Autoruns, LatencyMon).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fuentes Oficiales Microsoft */}
        {activeTab === 'BIBLIOGRAFIA' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-950 space-y-2">
              <span className="text-xs text-cyan-400 font-bold uppercase block">
                LOS 4 PILARES OFICIALES DE INGENIERÍA:
              </span>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                Toda afirmación contenida en este Tomo 02 está validada contra la documentación oficial
                de ingeniería de Microsoft y el trabajo de investigación de Mark Russinovich.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black border border-cyan-900/80 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Book className="w-4 h-4 text-cyan-400" />
                  <span>Windows Internals (7th Edition)</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Por Mark Russinovich, David Solomon y Alex Ionescu (Microsoft Press). La obra cumbre
                  sobre el kernel ntoskrnl.exe, el dispatcher y el subsistema de memoria virtual.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-cyan-900/80 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Microsoft Sysinternals Suite</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Herramientas forenses gratuitas oficiales de Microsoft: Process Explorer, ProcMon,
                  Autoruns, RAMMap y Coreinfo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-cyan-900/80 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>Microsoft Learn // Windows Architecture</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Especificaciones oficiales de CBS (Component-Based Servicing), WDDM (Windows Display
                  Driver Model) y arquitectura de seguridad UAC.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-cyan-900/80 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>PowerShell Core & Windows Driver Kit (WDK)</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Documentación de APIs nativas Win32, compuertas de syscalls y estructuras de kernel
                  para depuración con WinDbg.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Puente al Tomo 03 // Reparación de PC */}
        {activeTab === 'TOMO_03' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-black to-cyan-950/40 border border-blue-500/60 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                PRÓXIMO DESTINO EDITORIAL // TOMO 03
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/50 text-blue-300 text-[10px] font-bold">
                REPARACIÓN DE PC // SISTEMA EVO LABS
              </span>
            </div>

            <h4 className="text-white text-base font-bold uppercase">
              DEL NÚCLEO DE SOFTWARE AL DIAGNÓSTICO INTEGRAL DE HARDWARE Y TALLER
            </h4>

            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              Comprender el Kernel NT de Windows te dio la base analítica perfecta para el Tomo 03:
              el dominio de llamadas al sistema, controladores, interrupciones y arquitectura interna
              ahora se une a la metodología pericial de diagnóstico físico, reparación de componentes,
              electrónica y rescate forense en banco de trabajo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 font-mono-tech">
              <div className="p-2.5 rounded bg-black border border-cyan-950">
                <span className="text-cyan-400 font-bold block mb-1">WINDOWS NT (TOMO 02):</span>
                <ul className="text-[10px] text-zinc-400 font-sans-editorial space-y-0.5">
                  <li>• Microkernel híbrido y abstracción HAL.</li>
                  <li>• Gestión de memoria virtual y pools de kernel.</li>
                  <li>• Pila de I/O, controladores y latencias DPC.</li>
                  <li>• Diagnóstico de caídas BSOD y triage lógico.</li>
                </ul>
              </div>
              <div className="p-2.5 rounded bg-black border border-blue-950">
                <span className="text-blue-400 font-bold block mb-1">REPARACIÓN DE PC (TOMO 03):</span>
                <ul className="text-[10px] text-zinc-400 font-sans-editorial space-y-0.5">
                  <li>• Diagnóstico metodológico de hardware en taller.</li>
                  <li>• Líneas de tensión, VRM, fuentes y mediciones.</li>
                  <li>• Aislamiento sistemático: falla de silicio vs software.</li>
                  <li>• Banco de trabajo EVO, instrumental y recuperación.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer of the Passport */}
        <div className="pt-3 border-t border-cyan-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-sans-editorial">
              Certificado EVO emitido por EVO LABS. Competencias verificadas en laboratorio.
            </span>
          </div>
          <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
            EDITORIAL EVO LABS // MAGAZINE TÉCNICO PREMIUM
          </span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GENERIC / FALLBACK BLUEPRINT VISUAL FOR OTHER MODULES
========================================================================= */
const GenericKernelVisual: React.FC<{ module: TomoModuleItem; richData?: any }> = ({
  module,
  richData,
}) => {
  return (
    <div className="space-y-4 font-mono-tech">
      <div className="flex items-center justify-between text-xs text-cyan-400">
        <span>ESQUEMA ESTRUCTURAL DEL KERNEL NT: {module.title}</span>
        <span className="text-zinc-500 text-[10px]">TELEMETRÍA FORENSE DE SISTEMA</span>
      </div>

      <div className="p-4 rounded-xl bg-black border border-cyan-900/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block mb-1">CAPA DE APLICACIÓN</span>
            <span className="text-zinc-400 text-[11px] font-sans-editorial">
              Interfaces Win32 y llamadas a subsistemas cliente.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/80">
            <span className="text-cyan-300 font-bold block mb-1">SUBSISTEMA KERNEL NT</span>
            <span className="text-zinc-300 text-[11px] font-sans-editorial">
              Gestor de recursos y estructuras en memoria protegida.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950 border border-cyan-950">
            <span className="text-cyan-400 font-bold block mb-1">CAPA DE HARDWARE</span>
            <span className="text-zinc-400 text-[11px] font-sans-editorial">
              Controladores HAL y direccionamiento directo a silicio.
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
          {richData?.diagramDescription ||
            `Visualización esquemática de la interacción entre hardware, capas Ring 0 / Ring 3 y flujo de datos del subsistema ${module.title}.`}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   PEDAGOGICAL METADATA HELPER
========================================================================= */
export function getVisualPedagogicalMeta(moduleId: string, module: TomoModuleItem, richData?: any) {
  const defaultMeta = {
    badge: 'DIAGRAMA DE ARQUITECTURA TÉCNICA',
    title: richData?.diagramTitle || `ARQUITECTURA DE SUBSISTEMA // ${module.title}`,
    whatYouAreSeeing:
      richData?.diagramDescription ||
      `Esquema técnico representativo de las estructuras de memoria, fronteras de privilegios y flujos de ejecución del subsistema ${module.title} en el kernel Windows NT.`,
    focalPoints: [
      {
        label: 'Frontera de Privilegio',
        instruction: 'Observá la separación estricta entre espacio de usuario y núcleo.',
        detail:
          'El procesador previene físicamente que código en modo usuario acceda a punteros directos sin validación previa.',
      },
      {
        label: 'Mapeo de Estructuras',
        instruction: 'Seguí el flujo de despacho y asignación de memoria.',
        detail:
          'Toda asignación está respaldada por tablas de páginas administradas por el Memory Manager de Windows.',
      },
      {
        label: 'Puntos de Falla',
        instruction: 'Identificá dónde un error causa un cuelgue aislado vs un BSOD.',
        detail:
          'Los fallos en drivers o llamadas en Ring 0 disparan una comprobación de error (BugCheck) para proteger el almacenamiento.',
      },
    ],
    whyItMatters:
      'Comprender este flujo evita aplicar "trucos" ciegos y permite diagnosticar con exactitud en qué punto de la cadena de ejecución se produce un cuello de botella o una inestabilidad.',
  };

  switch (moduleId) {
    case 'm00':
      return {
        badge: 'RECREACIÓN DIDÁCTICA EVO // PROTOCOLO',
        title: 'MÉTODO DE 7 PASOS & SEMÁFORO DE LAS 15 CARPETAS MAESTRAS',
        whatYouAreSeeing:
          'El flujo metodológico de 7 pasos de EVO LABS y el mapa de seguridad por colores (Verde, Amarillo, Rojo) de las 15 carpetas críticas del sistema operativo Windows.',
        focalPoints: [
          {
            label: 'La Cadena de 7 Pasos',
            instruction: 'Observá la secuencia: Descubrir ➔ Entender ➔ Observar ➔ Practicar ➔ Diagnosticar ➔ Comprobar ➔ Avanzar.',
            detail:
              'Garantiza que el alumno nunca ejecute comandos a ciegas y entienda siempre la causa y el por qué antes de intervenir.',
          },
          {
            label: 'Semáforo de Carpetas',
            instruction: 'Fijate en la distinción entre Zona Roja (System32, config) y Zona Verde (Temp, SoftwareDistribution).',
            detail:
              'Erradica el pánico a explorar Windows clasificando qué rutas son seguras de purgar y cuáles son el corazón intocable del kernel.',
          },
          {
            label: 'El Pacto de Reversibilidad',
            instruction: 'Leé los 3 mandamientos: Medir antes de tocar, camino de regreso documentado y aislar variables.',
            detail:
              'Elimina el efecto placebo y los "optimizadores mágicos", respaldando toda intervención con evidencia empírica medible.',
          },
        ],
        whyItMatters:
          'Establece la disciplina científica fundamental de todo el Tomo 02: el mejor técnico no es el que más archivos borra, sino el que mide con precisión y garantiza la reversibilidad.',
      };

    case 'm01':
      return {
        badge: 'MAPA DE FLUJO SECUENCIAL',
        title: 'PIPELINE COMPLETO DE ARRANQUE: DE UEFI A ESCRITORIO',
        whatYouAreSeeing:
          'Las 5 fases cronológicas obligatorias del arranque de Windows: POST de UEFI, cargador de arranque bootmgfw.efi en la partición ESP, winload.efi, inicialización del kernel ntoskrnl.exe y la transición al escritorio en Sesión 1.',
        focalPoints: [
          {
            label: 'Partición ESP FAT32',
            instruction: 'Mirá el paso 2 donde se ejecuta bootmgfw.efi.',
            detail:
              'Si esta partición de 100 MB se corrompe, el equipo muestra error 0xc000000e sin importar que el Windows esté intacto en la unidad C:.',
          },
          {
            label: 'ELAM (Early Launch Anti-Malware)',
            instruction: 'Fijate en la fase 3 bajo winload.efi.',
            detail:
              'Carga el driver de seguridad antes que cualquier otro controlador para neutralizar rootkits de arranque.',
          },
          {
            label: 'Aislamiento de Sesión 0 y 1',
            instruction: 'Observá la transición final en el paso 5.',
            detail:
              'Los servicios corren en Sesión 0 completamente aislados de la pantalla interactiva del usuario para evitar ataques de inyección DLL.',
          },
        ],
        whyItMatters:
          'Permite reparar arranques fallidos con comandos exactos (bcdboot, bootrec) identificando exactamente en qué fase se interrumpe la carga.',
      };

    case 'm02':
      return {
        badge: 'MAPA DE DESPLIEGUE // INSTALACIÓN',
        title: 'PARTICIONADO GPT, TABLA EFI Y ESTRUCTURA DE MEDIOS',
        whatYouAreSeeing:
          'La estructura obligatoria de particiones para UEFI moderno (GPT, ESP FAT32, MSR y partición NTFS del SO) y el flujo de instalación sin herramientas desestabilizadoras.',
        focalPoints: [
          {
            label: 'Partición EFI System (ESP)',
            instruction: 'Observá la partición FAT32 obligatoria de 100 a 260 MB.',
            detail:
              'Aísla el cargador de arranque del sistema operativo principal, permitiendo arranque seguro Secure Boot.',
          },
          {
            label: 'Alineación de Clústeres',
            instruction: 'Fijate en los límites de sectores 4K nativos.',
            detail:
              'Un particionado manual correcto asegura un rendimiento óptimo de lectura/escritura en unidades NVMe y SSD.',
          },
        ],
        whyItMatters:
          'Evita errores clásicos como instalaciones en modo heredado MBR en placas base UEFI modernas o particiones huérfanas en múltiples discos.',
      };

    case 'm03':
      return {
        badge: 'DIAGRAMA DE ARQUITECTURA EN DISCO',
        title: 'ESTRUCTURA DE REGISTRO MFT DE 1024 BYTES EN SISTEMA NTFS',
        whatYouAreSeeing:
          'El diseño binario exacto de una entrada de la Master File Table ($MFT). Muestra cómo se almacenan la cabecera FILE, los atributos obligatorios ($STANDARD_INFORMATION, $FILE_NAME) y el atributo de contenido ($DATA).',
        focalPoints: [
          {
            label: 'Firma Mágica "FILE"',
            instruction: 'Mirá los primeros 4 bytes en offset 0x00.',
            detail:
              'Permite a herramientas forenses y recuperadores de datos identificar registros válidos incluso si la tabla de particiones está borrada.',
          },
          {
            label: 'Timestamps MACB en $10',
            instruction: 'Observá el atributo $STANDARD_INFORMATION.',
            detail:
              'Almacena fechas de Modificación, Acceso, Creación y MFT alterada. Modificar la fecha de un archivo con software no engaña a los peritos porque el atributo $FILE_NAME mantiene el timestamp original.',
          },
          {
            label: 'Dato Residente vs No Residente',
            instruction: 'Compará los dos bloques explicativos inferiores.',
            detail:
              'Si el archivo pesa menos de 700 bytes, vive dentro de la propia MFT. Si es mayor, se usan listas de corrida (Runlists) que apuntan a clústeres externos LCN.',
          },
        ],
        whyItMatters:
          'Enseña al técnico la diferencia entre fragmentación lógica de clústeres y saturación de la MFT, fundamental para optimizaciones reales de disco sin placebo.',
      };

    case 'm04':
      return {
        badge: 'INFOGRAFÍA DE SUBSISTEMA // PIPELINE DE E/S',
        title: 'PILA DE ALMACENAMIENTO: DE USER-MODE A NVMe CON TRIM',
        whatYouAreSeeing:
          'El recorrido completo que realiza una solicitud de lectura/escritura desde la llamada en modo usuario hasta las Submission y Completion Queues del controlador NVMe sobre el bus PCIe y la orden de desasignación TRIM.',
        focalPoints: [
          {
            label: 'Drivers de Filtro',
            instruction: 'Observá el paso por NTFS y los Minifiltros de sistema de archivos.',
            detail:
              'Antivirus y herramientas de backup se enganchan acá; un filtro lento degrada el rendimiento de I/O aunque el SSD rinda 7000 MB/s en benchmarks.',
          },
          {
            label: 'Colas de Envío NVMe',
            instruction: 'Mirá la comunicación con el registro Doorbell del controlador.',
            detail:
              'NVMe soporta hasta 64,000 colas paralelas con 64,000 comandos cada una, a diferencia del viejo protocolo AHCI de un solo canal.',
          },
          {
            label: 'Comando TRIM en Silicio',
            instruction: 'Fijate en la nota sobre desasignación FSCTL_FILE_LEVEL_TRIM.',
            detail:
              'Evita que las celdas NAND sufran el castigo de lectura-modificación-escritura al reutilizar bloques previamente borrados.',
          },
        ],
        whyItMatters:
          'Permite diagnosticar por qué un SSD NVMe ultrarrápido puede sentirse congelado o lento debido a controladores StorPort obsoletos o minifiltros corruptos.',
      };

    case 'm05':
      return {
        badge: 'CICLO DE VIDA DE SOFTWARE // DLL HELL',
        title: 'QUÉ OCURRE AL INSTALAR: MSI, REGISTRO Y DEPENDENCIAS',
        whatYouAreSeeing:
          'El flujo de despliegue de software en Windows: extracción de binarios en Program Files, registro de DLLs en System32/SysWOW64, claves COM en HKLM\\Software y servicios en el Service Control Manager.',
        focalPoints: [
          {
            label: 'Aislamiento SysWOW64',
            instruction: 'Observá la redirección de ejecutables de 32 bits en Windows de 64 bits.',
            detail:
              'System32 aloja binarios de 64 bits y SysWOW64 los de 32 bits; entender este puente evita fallos de carga DLL (0xc000007b).',
          },
          {
            label: 'Registro de Servicios',
            instruction: 'Fijate en la creación de entradas de arranque automático.',
            detail:
              'Instaladores invasivos suelen agregar servicios en segundo plano y tareas programadas sin consentimiento explícito.',
          },
        ],
        whyItMatters:
          'Capacita al técnico para desinstalar o limpiar software residual de forma manual y quirúrgica sin formatear.',
      };

    case 'm06':
      return {
        badge: 'DIAGRAMA DE ARQUITECTURA NT // ANILLOS DE KERNEL',
        title: 'FRONTERA RING 3 VS RING 0 Y TRANSICIÓN SYSCALL',
        whatYouAreSeeing:
          'La división física del espacio de memoria virtual y la compuerta de hardware (SYSCALL / SYSENTER) que separa las aplicaciones de usuario de las estructuras maestras del núcleo ntoskrnl.exe y los controladores HAL.',
        focalPoints: [
          {
            label: 'Instrucción SYSCALL',
            instruction: 'Mirá la compuerta central de hardware entre ntdll.dll y KiSystemCall64.',
            detail:
              'Es el único punto legal por donde una aplicación de usuario puede solicitar una operación privilegiada al procesador.',
          },
          {
            label: 'Aislamiento de Memoria',
            instruction: 'Fijate en los rangos de direcciones virtuales asignados a Ring 3 vs Ring 0.',
            detail:
              'Si una app de usuario intenta leer 0xFFFF8000..., el hardware de la CPU dispara un fallo de página (Page Fault 0xC0000005) antes de tocar el núcleo.',
          },
          {
            label: 'Ubicación de Drivers',
            instruction: 'Comprobá que los controladores de GPU y red residen en Ring 0.',
            detail:
              'Explica por qué un bug en el driver gráfico provoca una pantalla azul y no un simple cierre de ventana.',
          },
        ],
        whyItMatters:
          'Rompe el mito de que los programas tocan directamente la memoria o el silicio: todo pasa por esta frontera con un costo medible de cambio de contexto (context switch).',
      };

    case 'm07':
      return {
        badge: 'RECREACIÓN DIDÁCTICA EVO // RESMON & RAMMAP',
        title: 'LOS 4 NIVELES DE MEMORIA: FÍSICA, STANDBY Y DISPONIBLE REAL',
        whatYouAreSeeing:
          'El mapa completo de asignación de RAM física en un equipo estándar de 16 GB, reflejando exactamente cómo Resource Monitor y RAMMap clasifican cada megabyte entre Reserva de Hardware, En Uso, Modificada, Standby y Libre.',
        focalPoints: [
          {
            label: 'Caché Standby',
            instruction: 'Mirá el bloque azul (5.3 GB) etiquetado como "En Espera".',
            detail:
              'Contiene archivos y librerías precargadas por SysMain/SuperFetch. Es memoria DISPONIBLE que se cede al instante si una app la pide.',
          },
          {
            label: 'Memoria Modificada',
            instruction: 'Fijate en el bloque ámbar entre En Uso y Standby.',
            detail:
              'Son páginas alteradas por procesos que esperan ser escritas al disco por el Modified Page Writer antes de pasar a la lista de espera o libre.',
          },
          {
            label: 'Métrica Disponible Real',
            instruction: 'Observá la suma de Standby + Libre en el panel inferior.',
            detail:
              'Tener 2 GB "Libres" y 5 GB en "Standby" significa que hay 7 GB listos para usar inmediatamente. Los optimizadores que vacían Standby solo generan tirones de disco.',
          },
        ],
        whyItMatters:
          'Permite diagnosticar al instante si un cliente realmente necesita más RAM o si está siendo víctima de un software limpiador que degrada el rendimiento de su SSD.',
      };

    case 'm08':
      return {
        badge: 'INFOGRAFÍA TÉCNICA // LATENCYMON',
        title: 'TIMELINE DE INTERRUPCIÓN: ISR, COLA DPC Y LATENCIA DE AUDIO',
        whatYouAreSeeing:
          'Comparativa cronológica entre un controlador que atiende interrupciones dentro de la norma (<100 µs) y un controlador defectuoso que retiene el procesador en nivel DISPATCH_LEVEL por más de 2000 µs.',
        focalPoints: [
          {
            label: 'ISR (DIRQL)',
            instruction: 'Mirá la primera fase inmediata al pin físico de interrupción.',
            detail:
              'Tiene la máxima prioridad. No procesa datos pesados; solo encola la solicitud en la lista DPC del núcleo y libera el bus.',
          },
          {
            label: 'DPC Queue (IRQL 2)',
            instruction: 'Observá la barra de tiempo en microsegundos de la rutina DPC.',
            detail:
              'Si el driver de red o Wi-Fi se queda atascado acá por 2 milisegundos, ningún hilo de usuario (como el audio de un juego o DAW) puede ejecutarse en ese núcleo.',
          },
          {
            label: 'Umbral Crítico de 1000 µs',
            instruction: 'Fijate en la línea divisoria roja del gráfico.',
            detail:
              'Superar 1000 µs provoca un "buffer underrun" acústico instantáneo (chasquido, crackle o stuttering severo en pantalla).',
          },
        ],
        whyItMatters:
          'Demuestra científicamente que el "stuttering" en juegos no siempre es falta de GPU o RAM, sino un driver de red o energía mal programado bloqueando la CPU.',
      };

    case 'm09':
      return {
        badge: 'RECREACIÓN DIDÁCTICA FORENSE',
        title: 'ESTRUCTURA BINARIA DE EVENTOS Y REGISTRO CRÍTICO ID 41',
        whatYouAreSeeing:
          'El flujo desde los proveedores del kernel (ETW) hasta los archivos binarios inmutables .evtx de 64 KB y la reconstrucción en XML de un evento forense 41 (Kernel-Power) con código Bugcheck real.',
        focalPoints: [
          {
            label: 'Estructura XML Binaria',
            instruction: 'Mirá la reconstrucción del evento en el recuadro inferior.',
            detail:
              'Los eventos no son texto plano: se almacenan en chunks binarios comprimidos de 64 KB con sumas de comprobación CRC32 para evitar manipulación.',
          },
          {
            label: 'EventID 41 vs Causa Real',
            instruction: 'Observá el campo BugcheckCode dentro del System header.',
            detail:
              'El EventID 41 solo dice que la PC se apagó sin avisar; el dato pericial verdadero está en BugcheckCode (ej. 0x124 indica falla de hardware/silicio).',
          },
          {
            label: 'Canales de Registro',
            instruction: 'Fijate en la separación entre System, Application y Security.',
            detail:
              'Cada canal tiene cuotas de tamaño y políticas de rotación independientes administradas por el servicio eventlog.',
          },
        ],
        whyItMatters:
          'Enseña al técnico a no adivinar diagnósticos ni culpar a la fuente de poder sin antes consultar los códigos hexadecimales del registro forense.',
      };

    case 'm10':
      return {
        badge: 'RECREACIÓN DIDÁCTICA EVO // TCPVIEW',
        title: 'MATRIZ DE CONEXIONES Y ESTADOS DEL PROTOCOLO TCP/IP',
        whatYouAreSeeing:
          'Una recreación de auditoría en vivo al estilo TCPView y netstat, mapeando el proceso exacto y su PID con las direcciones IP de origen, puertos de destino y estados formales del protocolo TCP.',
        focalPoints: [
          {
            label: 'Estado ESTABLISHED',
            instruction: 'Mirá la primera fila con msedge.exe en puerto 443.',
            detail:
              'Indica que el handshake de 3 vías (SYN, SYN-ACK, ACK) se completó y hay un canal activo transmitiendo paquetes cifrados TLS.',
          },
          {
            label: 'Estado LISTENING',
            instruction: 'Fijate en la tercera fila con el PID 4 (System) en puerto 80.',
            detail:
              'Significa que un servicio local tiene un socket abierto esperando que clientes externos se conecten. Es el punto crítico de auditoría de seguridad.',
          },
          {
            label: 'Asociación PID ➔ Proceso',
            instruction: 'Comprobá cómo cada conexión está enlazada a un ID de proceso.',
            detail:
              'Permite identificar inmediatamente qué aplicación o servicio específico está consumiendo ancho de banda o comunicándose con IPs sospechosas.',
          },
        ],
        whyItMatters:
          'Habilita la auditoría de red forense sin depender de antivirus: si hay tráfico sospechoso, el técnico localiza el PID exacto en segundos.',
      };

    case 'm11':
      return {
        badge: 'MAPA FORENSE DE PERSISTENCIA // AUTORUNS',
        title: 'VECTORES DE PERSISTENCIA Y PUNTOS DE ENGANCHE AL ARRANQUE',
        whatYouAreSeeing:
          'Los puntos neurálgicos donde programas legítimos y malware se registran para iniciar automáticamente con Windows, comparando las claves Run tradicionales con los puntos críticos de Winlogon (Shell y Userinit).',
        focalPoints: [
          {
            label: 'Claves Run Estándar',
            instruction: 'Mirá el primer recuadro con la ruta de HKLM CurrentVersion Run.',
            detail:
              'Es el punto visible que muestra el Administrador de Tareas. Desactivar entradas acá es seguro y no rompe Windows.',
          },
          {
            label: 'Winlogon Shell Hijack',
            instruction: 'Observá el segundo recuadro con Shell = "explorer.exe".',
            detail:
              'Si este valor se altera o se añade un segundo ejecutable separado por coma, el sistema ejecutará el binario intruso antes de abrir el escritorio.',
          },
          {
            label: 'Firma Digital Authenticode',
            instruction: 'Fijate en la importancia de verificar que el ejecutable esté firmado.',
            detail:
              'Todo binario de Microsoft en puntos de arranque críticos debe tener firma criptográfica válida verificable con Get-AuthenticodeSignature.',
          },
        ],
        whyItMatters:
          'El Administrador de Tareas solo muestra el 20% de los puntos de arranque; un técnico pericial sabe que el 80% restante vive en estos vectores de persistencia.',
      };

    case 'm12':
      return {
        badge: 'DIAGRAMA DE ARQUITECTURA // SCM',
        title: 'AGRUPACIÓN DE SERVICIOS EN SVCHOST POR CUENTAS DE SEGURIDAD',
        whatYouAreSeeing:
          'La arquitectura del Service Control Manager (services.exe) dividiendo decenas de servicios del sistema en múltiples instancias aisladas de svchost.exe según su nivel de privilegio de seguridad: LocalSystem, NetworkService y LocalService.',
        focalPoints: [
          {
            label: 'svchost #1 (LocalSystem)',
            instruction: 'Mirá la primera columna con servicios de máximo privilegio.',
            detail:
              'DcomLaunch y PlugPlay requieren acceso irrestricto al hardware; corren bajo la cuenta de máxima confianza de Windows.',
          },
          {
            label: 'svchost #2 (NetworkService)',
            instruction: 'Fijate en la columna central para servicios de red.',
            detail:
              'Dnscache tiene privilegios de red pero no puede modificar archivos arbitrarios del sistema operativo.',
          },
          {
            label: 'svchost #3 (LocalService)',
            instruction: 'Observá la columna derecha con AudioSrv.',
            detail:
              'Tiene privilegios reducidos. Si el servicio de audio colapsa por un driver malo, la instancia svchost se reinicia sin tirar abajo la red ni el equipo.',
          },
        ],
        whyItMatters:
          'Explica por qué es normal tener 70+ procesos svchost.exe en el Administrador de Tareas: es una medida de seguridad y estabilidad por diseño, no "bloatware".',
      };

    case 'm13':
      return {
        badge: 'INFOGRAFÍA DE SUBSISTEMA // TASK SCHEDULER',
        title: 'MATRIZ DE DISPARO Y EJECUCIÓN DEL PROGRAMADOR DE TAREAS',
        whatYouAreSeeing:
          'El funcionamiento interno del servicio Schedule (%SystemRoot%\\System32\\Tasks) evaluando triggers temporales, de inactividad o de eventos para despachar acciones bajo taskhostw.exe con privilegios controlados.',
        focalPoints: [
          {
            label: 'Triggers vs Condiciones',
            instruction: 'Compará la columna 1 (Disparador) con la columna 2 (Condición).',
            detail:
              'Una tarea puede estar programada para las 3:00 AM pero solo ejecutarse si la laptop está conectada a la corriente y la pantalla apagada.',
          },
          {
            label: 'Contenedor taskhostw.exe',
            instruction: 'Mirá la columna 3 sobre acciones y aislamiento.',
            detail:
              'Las tareas basadas en DLLs no corren sueltas: se ejecutan dentro del arnés taskhostw.exe bajo el contexto de seguridad configurado.',
          },
          {
            label: 'Almacén XML Nativo',
            instruction: 'Observá la referencia a la carpeta Tasks en System32.',
            detail:
              'Cada tarea es un archivo XML estructurado; auditar esta carpeta revela cualquier tarea huérfana creada por software desinstalado.',
          },
        ],
        whyItMatters:
          'Permite resolver el enigma de computadoras que despiertan solas por la noche o ventiladores que se aceleran al dejar la máquina desatendida.',
      };

    case 'm14':
      return {
        badge: 'HERRAMIENTAS FORENSES // TERMINAL',
        title: 'CMD VS POWERSHELL VS WINDOWS TERMINAL: PIPELINES Y OBJETOS',
        whatYouAreSeeing:
          'La diferencia fundamental entre la consola basada en texto plano heredado (CMD.EXE) y el pipeline orientado a objetos de PowerShell (PSObject), junto al motor moderno de renderizado de Windows Terminal.',
        focalPoints: [
          {
            label: 'Flujo de Objetos vs Texto',
            instruction: 'Mirá la transferencia de propiedades tipadas a través del pipe (|).',
            detail:
              'PowerShell no envía líneas de texto como Bash o CMD; envía objetos .NET con métodos y propiedades accesibles.',
          },
          {
            label: 'Privilegios y ExecutionPolicy',
            instruction: 'Fijate en la directiva de seguridad de ejecución de scripts.',
            detail:
              'RemoteSigned previene la ejecución de scripts no firmados descargados de Internet, protegiendo el entorno de trabajo.',
          },
        ],
        whyItMatters:
          'Permite al operador construir scripts de auditoría y automatización sin romper el sistema ni parsear texto frágil.',
      };

    case 'm15':
      return {
        badge: 'DIAGRAMA DE ARQUITECTURA EN MEMORIA',
        title: 'COLMENAS DEL REGISTRO EN DISCO Y CELDAS HBIN EN MEMORIA',
        whatYouAreSeeing:
          'La correspondencia entre los archivos físicos de colmena en System32/config (SYSTEM, SOFTWARE, NTUSER.DAT) y su estructura en memoria mapeada dividida en bloques HBIN de 4096 bytes con celdas NK, VK y DATA.',
        focalPoints: [
          {
            label: 'Archivos .LOG1 y .LOG2',
            instruction: 'Mirá los archivos de registro transaccional junto a SYSTEM.',
            detail:
              'Windows usa Write-Ahead Logging (WAL): primero escribe en el log y luego altera la colmena para evitar corrupción si se corta la energía.',
          },
          {
            label: 'Celdas NK y VK',
            instruction: 'Fijate en la estructura interna de los bloques HBIN en RAM.',
            detail:
              'Las claves y valores son punteros referenciados por offsets relativos. Borrar claves a lo loco rompe punteros cruzados que ningún cleaner repara.',
          },
          {
            label: 'Asincronía de Escritura',
            instruction: 'Observá la nota sobre el Flush del Configuration Manager.',
            detail:
              'Editar el Registro modifica la memoria RAM inmediatamente; el volcado a disco ocurre en segundo plano por el worker de sistema.',
          },
        ],
        whyItMatters:
          'Desmitifica el mito de los "limpiadores de registro": borrar 200 claves huérfanas en un archivo de 80 MB ahorra 0% de RAM y expone a un pantallazo azul instantáneo.',
      };

    case 'm16':
      return {
        badge: 'DIAGRAMA DE FLUJO // TELEMETRÍA',
        title: 'PIPELINE OFICIAL DE TELEMETRÍA: DIAGTRACK A MICROSOFT CLOUD',
        whatYouAreSeeing:
          'El circuito oficial de telemetría de Windows: desde la generación de eventos de diagnóstico en drivers y apps, pasando por el servicio DiagTrack, el búfer local encriptado y la transmisión segura TLS 1.3 hacia los servidores de análisis.',
        focalPoints: [
          {
            label: 'Servicio DiagTrack (UTC)',
            instruction: 'Mirá el paso 2 en el flujo central.',
            detail:
              'Es el encargado de recopilar fallos de controladores y congelamientos. Opera con prioridad baja para no competir con los juegos ni el usuario.',
          },
          {
            label: 'Nivel Requerido vs Opcional',
            instruction: 'Observá la nota técnica sobre la configuración nativa.',
            detail:
              'En nivel "Requerido", solo se envían datos de compatibilidad de hardware y errores de código, indispensables para que Windows Update entregue parches estables.',
          },
          {
            label: 'Impacto de Scripts Debloat',
            instruction: 'Leé el recuadro inferior sobre destrucción de componentes.',
            detail:
              'Bloquear dominios en el archivo hosts o borrar DiagTrack rompe la tienda, Xbox Live y la descarga de drivers de precisión.',
          },
        ],
        whyItMatters:
          'Permite fundamentar con datos científicos por qué la privacidad se gestiona desde las directivas oficiales y no destrozando servicios del sistema.',
      };

    case 'm17':
      return {
        badge: 'DIAGRAMA DE ARQUITECTURA // COMPONENTE WINSXS',
        title: 'SERVICING STACK (CBS) Y ENLACES DUROS (HARD LINKS) EN WINSXS',
        whatYouAreSeeing:
          'La arquitectura de Component-Based Servicing: cómo TrustedInstaller administra el almacén maestro C:\Windows\WinSxS y proyecta los archivos del sistema hacia C:\Windows\System32 utilizando enlaces duros (Hard Links) de NTFS sin duplicar espacio en disco.',
        focalPoints: [
          {
            label: 'Almacén Único WinSxS',
            instruction: 'Mirá el recuadro izquierdo sobre el repositorio maestro.',
            detail:
              'Todos los archivos binarios de Windows residen físicamente acá. Contiene las versiones actuales y las copias de seguridad para desinstalar parches.',
          },
          {
            label: 'Hard Links hacia System32',
            instruction: 'Observá el recuadro derecho sobre los enlaces en System32.',
            detail:
              'Un Hard Link apunta exactamente al mismo clúster físico de la MFT. Ocupa 0 bytes adicionales en el disco aunque el explorador sume ambos tamaños.',
          },
          {
            label: 'Limpieza Legal con DISM',
            instruction: 'Fijate en la advertencia sobre no borrar carpetas manualmente.',
            detail:
              'La única vía autorizada de purga es dism /online /cleanup-image /startcomponentcleanup, que desasigna parches reemplazados respetando los enlaces.',
          },
        ],
        whyItMatters:
          'Salva instalaciones enteras de Windows de usuarios o técnicos mal informados que intentan "ganar espacio" borrando carpetas de WinSxS a la fuerza.',
      };

    case 'm18':
      return {
        badge: 'DIAGRAMA DE SEGURIDAD // UAC ISOLATION',
        title: 'AISLAMIENTO DEL ESCRITORIO SEGURO Y MODELO DE TOKENS UAC',
        whatYouAreSeeing:
          'La separación física entre la sesión interactiva del usuario (Integridad Media) y el Escritorio Seguro por hardware (WinSta0\Desktop_Secure) ejecutando consent.exe con Nivel de Integridad SYSTEM.',
        focalPoints: [
          {
            label: 'Token Dividido (Split Token)',
            instruction: 'Mirá cómo el usuario administrador inicia con un token filtrado.',
            detail:
              'Incluso una cuenta con privilegios de Administrador opera por defecto en nivel "Medium" para que ningún navegador o troyano herede permisos altos.',
          },
          {
            label: 'Escritorio Seguro Aislado',
            instruction: 'Observá la columna derecha con la pantalla oscurecida.',
            detail:
              'Windows conmuta la estación de ventanas a una superficie protegida donde el software de terceros no puede interceptar clics ni enviar pulsaciones simuladas.',
          },
          {
            label: 'Protección contra Ransomware',
            instruction: 'Leé el detalle de mitigación en la base.',
            detail:
              'Un ransomware puede ejecutarse en modo usuario, pero no puede cifrar el MBR ni deshabilitar Volume Shadow Copies sin este clic físico en el escritorio seguro.',
          },
        ],
        whyItMatters:
          'Demuestra con rigor por qué bajar la barra de UAC a "No notificar nunca" desactiva la principal barrera de defensa de Windows contra infecciones masivas.',
      };

    case 'm19':
      return {
        badge: 'RECREACIÓN DIDÁCTICA FORENSE // WINRE & BCD',
        title: 'ESTRUCTURA DE PARTICIÓN ESP, ALMACÉN BCD Y SERVICING IN-PLACE',
        whatYouAreSeeing:
          'El mapa de particiones GPT de un arranque UEFI: la partición de rescate WinRE (winre.wim en RAM X:\\), la partición del sistema EFI (ESP FAT32 con el BCD) y el volumen C: del sistema operativo.',
        focalPoints: [
          {
            label: 'Almacén BCD en Partición ESP',
            instruction: 'Observá el archivo binario BCD en la partición FAT32 oculta de 100 MB.',
            detail:
              'Si este puntero se borra o corrompe por corte de luz, Windows reporta 0xc000000e aunque C: esté 100% intacto.',
          },
          {
            label: 'Rescate In-Place (Upgrade sobre sí)',
            instruction: 'Mirá el flujo de instalación in-place en el recuadro inferior.',
            detail:
              'Regenera todos los binarios corruptos del kernel en C:\\Windows sin tocar carpetas de usuario (C:\\Users) ni registros de aplicaciones.',
          },
          {
            label: 'Reversión Offline con DISM',
            instruction: 'Fijate en la orden dism /revertpendingactions para emergencias.',
            detail:
              'Cancela actualizaciones acumulativas interrumpidas que provocan bucles infinitos de reparación automática.',
          },
        ],
        whyItMatters:
          'Evita el formateo destructivo: el 85% de las fallas de inicio son reparables en menos de 10 minutos mediante comandos bcdboot o in-place repair.',
      };

    case 'm20':
      return {
        badge: 'METROLOGÍA DE SISTEMA // LATENCYMON',
        title: 'CRONOGRAMA DE INTERRUPCIONES DPC/ISR Y ESTADOS DE ENERGÍA C-STATE',
        whatYouAreSeeing:
          'La línea temporal de ejecución del procesador dividida entre niveles de interrupción: código en Ring 3 (juegos/audio), atención de hardware en DIRQL y la cola DPC a nivel IRQL 2 (DISPATCH_LEVEL).',
        focalPoints: [
          {
            label: 'Driver con Fuga de DPC',
            instruction: 'Mirá la barra roja del controlador ndis.sys superando los 2.000 µs.',
            detail:
              'Provocado por funciones de ahorro de energía mal calibradas (Green Ethernet) que traban el núcleo y vacían el búfer de sonido.',
          },
          {
            label: 'Umbral de Audio Underrun',
            instruction: 'Fijate en la línea límite de 1.000 µs en el encabezado.',
            detail:
              'Superar 1.000 µs vacía el búfer circular de audio de Windows y genera el chasquido acústico y tirones de frametime.',
          },
          {
            label: 'C-States en Plan Equilibrado',
            instruction: 'Observá la comparativa de consumo térmico entre planes.',
            detail:
              'Permitir que los núcleos descansen en C1/C6 mantiene el silicio frío para alcanzar frecuencias Turbo Boost sostenidas más altas.',
          },
        ],
        whyItMatters:
          'Demuestra empíricamente qué controlador específico arruina la fluidez del equipo antes de gastar dinero en periféricos o formatear a ciegas.',
      };

    case 'm21':
      return {
        badge: 'FORENSIA DE HARDWARE // RESMON & IOPS',
        title: 'CUELLO DE BOTELLA DE COLA DE DISCO MECÁNICO (100% HDD) VS LATENCIA SSD',
        whatYouAreSeeing:
          'La saturación física del cabezal electromecánico de un disco duro de 5400 RPM frente a las lecturas aleatorias 4K simultáneas de Windows, contrastada con la respuesta instantánea de un SSD SATA.',
        focalPoints: [
          {
            label: 'Cola de Disco (Queue Length > 2.0)',
            instruction: 'Mirá el indicador de cola saturada (Cola: 6.8).',
            detail:
              'El cabezal físico viaja mecánicamente de un sector a otro. No da abasto a atender pedidos simultáneos y congela la interfaz de usuario.',
          },
          {
            label: 'Tiempo de Respuesta en Carga',
            instruction: 'Compará los 1.850 ms de latencia mecánica con los 1.2 ms de las celdas NAND.',
            detail:
              'El disco al 100% en el Administrador de Tareas no es saturación de megabytes por segundo, sino saturación de tiempo de respuesta de los cabezales.',
          },
          {
            label: 'Optimización Gráfica en sysdm.cpl',
            instruction: 'Observá el atajo a SystemPropertiesPerformance.exe en la base.',
            detail:
              'Desactivar sombras y animaciones innecesarias del Compositor DWM ahorra páginas de memoria RAM y VRAM en equipos con gráficos integrados antiguos.',
          },
        ],
        whyItMatters:
          'Rescata computadoras dadas por "inútiles" o "lentas" mediante un diagnóstico científico que identifica la raíz física del problema.',
      };

    case 'm22':
      return {
        badge: 'ÁRBOL DE DECISIÓN // PROTOCOLO DE CRISIS',
        title: 'TRIAGE DE EMERGENCIAS TÉCNICAS: PANTALLA NEGRA, BSOD Y DISCO I/O',
        whatYouAreSeeing:
          'La matriz formal de primeros auxilios ante las 3 crisis más comunes de Windows: colapso de la shell gráfica (explorer.exe), detención de seguridad por Bugcheck (BSOD) y degradación mecánica del disco.',
        focalPoints: [
          {
            label: 'Pantalla Negra con Cursor',
            instruction: 'Fijate en la tarjeta 1: el mouse responde, DWM y el kernel están sanos.',
            detail:
              'No apagues el equipo de golpe. Reiniciá el driver de video con Win + Ctrl + Shift + B o abrí Taskmgr (Ctrl + Shift + Esc) y lanzá explorer.exe.',
          },
          {
            label: 'Código Stop en BSOD',
            instruction: 'Mirá los códigos Stop en la tarjeta 2: 0x7B, 0xD1 y 0x124.',
            detail:
              'El BSOD no es una tragedia; es una medida de protección de memoria. 0x7B es almacenamiento, 0xD1 es driver defectuoso y 0x124 es falla de silicio (WHEA).',
          },
          {
            label: 'Regla de Oro en Fallas de Disco',
            instruction: 'Leé la advertencia crítica en la tarjeta 3: NUNCA chkdsk antes de clonar.',
            detail:
              'Ejecutar chkdsk /r fuerza al cabezal mecánico dañado a estresarse sobre sectores pendientes, pudiendo rayar la superficie antes de clonar la información.',
          },
        ],
        whyItMatters:
          'Evita el error de novato de formatear o apagar de la tecla ante un fallo de interfaz, preservando la integridad de los archivos del cliente.',
      };

    case 'm23':
      return {
        badge: 'INVESTIGACIÓN PERICIAL // CASOS GUIADOS',
        title: 'EXPEDIENTES FORENSES DE TALLER: DE TELEMETRÍA A RESOLUCIÓN',
        whatYouAreSeeing:
          'Cuatro escenarios periciales resueltos bajo el Método Científico EVO: sobrecalentamiento de VRM con thermal throttling a 800 MHz, fugas masivas de crash dumps en C:\\Windows, desincronización de Winsock y bloqueo por doble antivirus.',
        focalPoints: [
          {
            label: 'VRM Throttling (BD PROCHOT)',
            instruction: 'Mirá el caso 01: CPU a 48°C pero los MOSFETs de la placa a 118°C.',
            detail:
              'La placa base económica disparaba la señal térmica BD PROCHOT trabando la CPU a 0.79 GHz. El perito audita la placa madre, no solo el procesador.',
          },
          {
            label: 'Fuga de Minidumps en Disco',
            instruction: 'Observá el caso 02: 20 GB de archivos .dmp por noche en C:\\Windows\\Minidump.',
            detail:
              'Un controlador secundario colapsando en segundo plano consumía gigabytes de espacio. La solución es actualizar el driver, no cambiar de disco.',
          },
          {
            label: 'Reset de Sockets de Red',
            instruction: 'Fijate en el caso 03: ping funciona pero los navegadores fallan.',
            detail:
              'Cuando un LSP de Winsock queda corrupto tras desinstalar un VPN, la orden netsh winsock reset restaura el catálogo de sockets en 2 segundos.',
          },
        ],
        whyItMatters:
          'Enseña a pensar con lógica forense: cada síntoma tiene una causa raíz demostrable con telemetría objetiva sin inventar explicaciones mágicas.',
      };

    case 'm24':
      return {
        badge: 'HERRAMIENTAS MAESTRAS // ACCESO DIRECTO',
        title: 'MATRIZ DE CONSOLAS WIN32 Y MONITOR DE CONFIABILIDAD',
        whatYouAreSeeing:
          'El arsenal de accesos directos Win32 (.cpl y .msc) y la reconstrucción didáctica del Monitor de Confiabilidad (perfmon /rel) correlacionando caídas con fechas exactas de instalación.',
        focalPoints: [
          {
            label: 'Applets CPL Directos',
            instruction: 'Mirá los accesos directos en el panel superior.',
            detail:
              'Comandos como ncpa.cpl, sysdm.cpl, devmgmt.msc y diskmgmt.msc abren los motores nativos Win32 al instante, saltándose menús lentos.',
          },
          {
            label: 'Línea de Estabilidad RAC',
            instruction: 'Observá la curva de índice de estabilidad (1 a 10) en perfmon /rel.',
            detail:
              'Registra cada caída de aplicación o fallo de hardware. Un colapso de 10 a 3.2 señala con día y hora exactos el inicio del problema.',
          },
          {
            label: 'Correlación Temporal de Fallas',
            instruction: 'Fijate en el evento crítico del día miércoles.',
            detail:
              'Permite demostrar al cliente que la falla no es un misterio sino el resultado directo de una instalación o actualización específica.',
          },
        ],
        whyItMatters:
          'Aumenta la productividad en el banco de pruebas hasta en un 500%, permitiendo diagnosticar en 2 minutos lo que a otros les toma horas de búsqueda ciega.',
      };

    case 'm25':
      return {
        badge: 'DICCIONARIO FORENSE // TAXONOMÍA A-Z',
        title: 'MATRIZ CONCEPTUAL MAESTRA: DE LA ANALOGÍA AL RIGOR DE KERNEL',
        whatYouAreSeeing:
          'La enciclopedia forense interactiva de más de 50 conceptos de Windows, organizada en 4 cuadrantes críticos: Memoria & Paginación, Kernel & Interrupciones, Almacenamiento NTFS y Modelo de Seguridad.',
        focalPoints: [
          {
            label: 'Commit Charge vs Working Set',
            instruction: 'Seleccioná la categoría Memoria y compará Commit con Working Set.',
            detail:
              'Commit Charge es el límite de crédito virtual prometido por el OS antes de un fallo OOM; Working Set son las páginas físicas que residen efectivamente en la RAM en este milisegundo.',
          },
          {
            label: 'DPC e IRQL en el Cuadrante Kernel',
            instruction: 'Fijate en la tarjeta de Deferred Procedure Call (DPC) e IRQL.',
            detail:
              'Explica por qué un controlador defectuoso que pasa más de 1 ms en IRQL 2 (DISPATCH_LEVEL) congela el audio y genera microstuttering en videojuegos.',
          },
          {
            label: 'MFT y TRIM en Almacenamiento',
            instruction: 'Revisá la Master File Table y el comando TRIM en discos NVMe.',
            detail:
              'Demuestra cómo NTFS gestiona metadatos y por qué la desasignación de celdas flash en SSD impide la recuperación forense tradicional una vez ejecutado TRIM.',
          },
        ],
        whyItMatters:
          'Erradica la confusión conceptual entre técnicos novatos: dominar la jerga precisa permite interpretar dumps de memoria, registros de eventos y diálogos de error de Windows al instante.',
      };

    case 'm26':
      return {
        badge: 'COMPROBACIÓN EVO // AUDITORÍA FINAL',
        title: 'PASAPORTE DEL INVESTIGADOR & MAPA DE COMPETENCIAS FORENSES',
        whatYouAreSeeing:
          'El panel de competencias verificadas que consolida los 27 módulos de Windows dominados a lo largo del Tomo 02, el inventario del Archivo EVO personal y las fuentes de ingeniería oficiales de Microsoft.',
        focalPoints: [
          {
            label: '10 Competencias Maestras Verificadas',
            instruction: 'Explorá la lista de competencias desde el arranque UEFI hasta el Triage de Crisis.',
            detail:
              'Verifica que el alumno sabe auditar cada capa con herramientas nativas (DISM, BCDedit, perfmon, LatencyMon) sin recurrir a recetas mágicas.',
          },
          {
            label: 'Archivo EVO Consolidado (C:\\EVO_LABS)',
            instruction: 'Mirá la pestaña del repositorio de bitácoras y scripts periciales.',
            detail:
              'Consolida tus scripts de telemetría de PowerShell, tus líneas base de latencia y tus perfiles de servicio para respaldo técnico profesional.',
          },
          {
            label: 'Puente al Tomo 03: Reparación de PC // Sistema EVO Labs',
            instruction: 'Observá la transición editorial hacia el diagnóstico integral en taller.',
            detail:
              'Conecta la arquitectura interna de Windows NT con el diagnóstico y reparación de hardware, preparando al especialista para el Tomo 03.',
          },
        ],
        whyItMatters:
          'Valida el salto de usuario pasivo a especialista de laboratorio: el mejor optimizador no es un programa, sino un profesional que comprende el kernel y mide con rigor científico.',
      };

    default:
      return defaultMeta;
  }
}
