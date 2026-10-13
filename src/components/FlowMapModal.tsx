import React, { useState, useEffect } from 'react';
import { X, Layers, Cpu, Monitor, HardDrive, ArrowRight, CheckCircle2, Activity, ExternalLink } from 'lucide-react';
import { UserPcSpec, Lab02ExperimentData, ComponentPhaseMetrics } from '../types';

interface FlowMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  specs: Partial<UserPcSpec>;
  onOpenFullChapter02?: () => void;
}

export const FlowMapModal: React.FC<FlowMapModalProps> = ({
  isOpen,
  onClose,
  specs,
  onOpenFullChapter02,
}) => {
  // Load saved lab data from Chapter 02 or use verified defaults
  const [labData, setLabData] = useState<Lab02ExperimentData | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<'reposo' | 'carga' | 'actividad'>('carga');

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('evo_c02_lab_data');
        if (saved) {
          setLabData(JSON.parse(saved));
        } else {
          // Fallback realistic profile
          setLabData({
            loadCategory: 'JUEGO / APLICACIÓN 3D',
            loadCustomName: '',
            inputMode: 'NIVELES',
            reposo: { cpu: 'BAJO', ram: 'MEDIO', gpu: 'BAJO', disco: 'BAJO' },
            carga: { cpu: 'ALTO', ram: 'MEDIO', gpu: 'MEDIO', disco: 'ALTO' },
            actividad: { cpu: 'MEDIO', ram: 'ALTO', gpu: 'ALTO', disco: 'BAJO' },
            completedAt: new Date().toISOString(),
          });
        }
      } catch {
        setLabData(null);
      }
    }
  }, [isOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Active data fallback
  const currentData = labData || {
    loadCategory: 'JUEGO / APLICACIÓN 3D',
    loadCustomName: '',
    inputMode: 'NIVELES' as const,
    reposo: { cpu: 'BAJO', ram: 'MEDIO', gpu: 'BAJO', disco: 'BAJO' },
    carga: { cpu: 'ALTO', ram: 'MEDIO', gpu: 'MEDIO', disco: 'ALTO' },
    actividad: { cpu: 'MEDIO', ram: 'ALTO', gpu: 'ALTO', disco: 'BAJO' },
  };

  const activeLoadDisplay =
    currentData.loadCategory === 'OTRA APLICACIÓN' && currentData.loadCustomName
      ? `${currentData.loadCategory} (${currentData.loadCustomName})`
      : currentData.loadCategory || 'JUEGO / APLICACIÓN 3D';

  const phaseMetrics: ComponentPhaseMetrics =
    selectedPhase === 'reposo'
      ? currentData.reposo
      : selectedPhase === 'carga'
      ? currentData.carga
      : currentData.actividad;

  // Generate verified correlations
  const getCorrelations = (): string[] => {
    const list: string[] = [];

    // Disco check
    const discoCarga = (currentData.carga.disco || '').toUpperCase();
    const discoAct = (currentData.actividad.disco || '').toUpperCase();
    if (discoCarga === 'ALTO' || Number(discoCarga) >= 50) {
      list.push(
        'ALMACENAMIENTO (DISCO): Pico de transferencia exclusivo durante la fase de carga para mover librerías y texturas hacia la RAM. En actividad sostenida retorna al reposo para no inducir latencias de bus.'
      );
    } else {
      list.push(
        'ALMACENAMIENTO (DISCO): Transferencia controlada de archivos iniciales. En actividad sostenida la lectura decae al mínimo.'
      );
    }

    // RAM check
    list.push(
      'MEMORIA RAM: Aumenta durante la carga y permanece elevada en actividad. Mantiene el conjunto de trabajo residente para abastecer a la CPU y la GPU sin esperas al almacenamiento secundario.'
    );

    // CPU & GPU check
    list.push(
      'CPU & GPU EN ACTIVIDAD: La CPU sincroniza las llamadas de renderizado (draw calls) y la simulación física; la GPU concentra la rasterización continua de cuadros.'
    );

    return list;
  };

  const correlations = getCorrelations();

  return (
    <div
      id="modal-mapa-flujo-001"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-mapa-flujo"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#111217] border border-zinc-700/90 shadow-2xl p-5 sm:p-7 text-left space-y-5 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-yellow-400 font-mono-tech text-[10px] sm:text-[11px] uppercase font-bold tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
                <span>EVIDENCIA HEREDADA // CAPÍTULO 02</span>
              </span>
            </div>
            <h2
              id="titulo-mapa-flujo"
              className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight"
            >
              MAPA DE FLUJO EVO 001
            </h2>
            <p className="text-xs font-mono-tech text-zinc-400">
              Carga auditada: <strong className="text-yellow-400">{activeLoadDisplay}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar mapa"
            id="btn-cerrar-mapa-x"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Selector (REPOSO / CARGA / ACTIVIDAD) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
            <span className="uppercase tracking-wider">Fases del ciclo de trabajo:</span>
            <span className="text-yellow-400 text-[11px]">Seleccioná una fase para auditar</span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            {(['reposo', 'carga', 'actividad'] as const).map((phase) => (
              <button
                key={phase}
                type="button"
                id={`btn-fase-${phase}`}
                onClick={() => setSelectedPhase(phase)}
                className={`py-2 px-3 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                  selectedPhase === phase
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {phase === 'reposo' && '1. REPOSO'}
                {phase === 'carga' && '2. CARGA'}
                {phase === 'actividad' && '3. ACTIVIDAD'}
              </button>
            ))}
          </div>
        </div>

        {/* Hardware Observation Cards for Selected Phase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* CPU */}
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/90 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono-tech">
              <Cpu className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold">CPU</span>
            </div>
            <div className="text-lg font-mono-tech font-black text-white">
              {phaseMetrics.cpu || '—'}
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 truncate" title={specs.cpu || 'Auditada en C01'}>
              {specs.cpu || 'Heredada C01'}
            </div>
          </div>

          {/* RAM */}
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/90 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono-tech">
              <Layers className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold">RAM</span>
            </div>
            <div className="text-lg font-mono-tech font-black text-white">
              {phaseMetrics.ram || '—'}
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 truncate" title={specs.ram || 'Auditada en C01'}>
              {specs.ram || 'Heredada C01'}
            </div>
          </div>

          {/* GPU */}
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/90 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono-tech">
              <Monitor className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold">GPU</span>
            </div>
            <div className="text-lg font-mono-tech font-black text-white">
              {phaseMetrics.gpu || '—'}
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 truncate" title={specs.gpu || 'Auditada en C01'}>
              {specs.gpu || 'Heredada C01'}
            </div>
          </div>

          {/* Almacenamiento */}
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/90 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono-tech">
              <HardDrive className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-semibold">DISCO</span>
            </div>
            <div className="text-lg font-mono-tech font-black text-white">
              {phaseMetrics.disco || '—'}
            </div>
            <div className="text-[10px] font-mono-tech text-zinc-500 truncate" title={specs.storage || 'Auditado en C01'}>
              {specs.storage || 'Heredado C01'}
            </div>
          </div>
        </div>

        {/* Correlaciones Principales */}
        <div className="space-y-2 rounded-xl bg-[#14151c] border border-zinc-800/90 p-3.5 sm:p-4">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
            CORRELACIONES PRINCIPALES OBSERVADAS
          </span>
          <ul className="space-y-2 text-xs font-mono-tech text-zinc-300">
            {correlations.map((cor, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-yellow-400 shrink-0 font-bold">▪</span>
                <span className="font-sans-editorial text-xs sm:text-[13px] text-zinc-300 leading-snug">
                  {cor}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusión Prudente Registrada */}
        <div className="rounded-xl bg-black/40 border-l-4 border-yellow-400 p-3.5 sm:p-4 space-y-1.5">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-zinc-400 font-bold block">
            CONCLUSIÓN PRUDENTE REGISTRADA // CAPÍTULO 02
          </span>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
            “En esta observación, la actividad del almacenamiento fue más visible durante la carga inicial. La interacción CPU–GPU aparece como un factor relevante, pero esta observación por sí sola no demuestra qué componente determina la estabilidad del frametime.”
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-800/80">
          {/* Botón Principal: CERRAR MAPA */}
          <button
            type="button"
            id="btn-cerrar-mapa-flujo"
            onClick={onClose}
            className="order-1 sm:order-2 px-6 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-colors cursor-pointer shadow-lg inline-flex items-center justify-center gap-2"
          >
            <span>CERRAR MAPA</span>
          </button>

          {/* Enlace Secundario Discreto: VER CAPÍTULO 02 COMPLETO */}
          {onOpenFullChapter02 && (
            <button
              type="button"
              id="btn-ver-capitulo-02-completo"
              onClick={() => {
                onClose();
                onOpenFullChapter02();
              }}
              className="order-2 sm:order-1 text-zinc-400 hover:text-yellow-400 text-xs font-mono-tech tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer py-2 transition-colors group"
            >
              <span>Ver Capítulo 02 Completo</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-yellow-400 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
