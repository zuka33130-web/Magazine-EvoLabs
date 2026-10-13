import React, { useState } from 'react';
import { X, Cpu, Zap, Edit3, CheckCircle2, ShieldCheck, Sparkles, Activity, Terminal, Globe } from 'lucide-react';
import { Machine } from '../types';
import { MachineAdapter } from '../services/machineAdapter';
import { EvoCaseRepository } from '../services/caseRepository';
import { HardwareComponent } from '../services/hardwareCatalog';
import { EvoAutoDetectPcModal } from '../../common/EvoAutoDetectPcModal';
import { EvoHardwareDiscoveryModal } from './EvoHardwareDiscoveryModal';
import { UserHardwarePassport } from '../../../types';

interface EvoMachineSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMachine: (machine: Machine) => void;
  onOpenGlobalAutoDetectModal?: () => void;
}

export const EvoMachineSelectorModal: React.FC<EvoMachineSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectMachine,
  onOpenGlobalAutoDetectModal,
}) => {
  const [mode, setMode] = useState<'options' | 'manual'>('options');
  const [showLiveScanner, setShowLiveScanner] = useState<boolean>(false);
  const [showDiscovery, setShowDiscovery] = useState<boolean>(false);

  // Manual custom machine form
  const [customAlias, setCustomAlias] = useState('Mi PC Personalizada');
  const [customCpu, setCustomCpu] = useState('AMD Ryzen 5 5600');
  const [customGpu, setCustomGpu] = useState('NVIDIA GeForce RTX 3060 12GB');
  const [customRamGb, setCustomRamGb] = useState<number>(16);
  const [customRamSpeed, setCustomRamSpeed] = useState<number>(3200);
  const [customStorageGb, setCustomStorageGb] = useState<number>(1000);
  const [customPsuW, setCustomPsuW] = useState<number>(600);

  if (!isOpen) return null;

  const handleChooseReference = () => {
    const ref = MachineAdapter.createReferenceBenchmarkMachine();
    EvoCaseRepository.setActiveMachine(ref);
    onSelectMachine(ref);
    onClose();
  };

  const handleChooseDetected = () => {
    const detected = MachineAdapter.loadExistingMachine();
    if (detected.isDetected) {
      EvoCaseRepository.setActiveMachine(detected);
      onSelectMachine(detected);
      onClose();
    } else {
      setShowLiveScanner(true);
    }
  };

  const handleHardwareDetected = (passport: UserHardwarePassport) => {
    const machine = MachineAdapter.fromDetectedHardware(passport);
    EvoCaseRepository.setActiveMachine(machine);
    onSelectMachine(machine);
    setShowLiveScanner(false);
    onClose();
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    const blank = MachineAdapter.createBlankMachine(customAlias);

    const manualMachine: Machine = {
      ...blank,
      cpu: {
        ...blank.cpu,
        model: customCpu || 'CPU Manual',
        provenance: 'ESTIMATED',
      },
      gpu: {
        ...blank.gpu,
        model: customGpu || 'GPU Manual',
        isDedicated: !customGpu.toLowerCase().includes('integrada'),
        provenance: 'ESTIMATED',
      },
      ram: {
        ...blank.ram,
        sizeGb: customRamGb || 16,
        configuredSpeedMts: customRamSpeed || 3200,
        provenance: 'ESTIMATED',
      },
      storage: {
        ...blank.storage,
        capacityGb: customStorageGb || 1000,
        provenance: 'ESTIMATED',
      },
      psu: {
        ...blank.psu,
        wattageW: customPsuW || 600,
        provenance: 'ESTIMATED',
      },
    };

    EvoCaseRepository.setActiveMachine(manualMachine);
    onSelectMachine(manualMachine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-[#0e1219] shadow-2xl flex flex-col font-mono-tech overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#080a0d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                SUJETO DE ENSAYO EN BANCO
              </span>
              <h2 className="font-display font-black text-white text-base sm:text-lg tracking-tight uppercase">
                ¿QUÉ MÁQUINA TENEMOS HOY?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {mode === 'options' ? (
            <div className="space-y-4">
              {/* Option 1: Detect this PC */}
              <button
                type="button"
                onClick={handleChooseDetected}
                className="w-full p-4 rounded-xl border border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-left transition-all cursor-pointer flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase">
                        MÉTODO 1 (RECOMENDADO)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-400 text-black">
                        EN VIVO
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-sm sm:text-base">
                      DETECTAR ESTA PC (SIN INSTALAR NADA)
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                      Lee CPU, GPU, memoria RAM efectiva/SPD y discos mediante consulta local WMI de solo lectura.
                    </p>
                  </div>
                </div>
                <span className="text-emerald-400 text-lg font-bold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              {/* Option 2: Reference Calibrated PC */}
              <button
                type="button"
                onClick={handleChooseReference}
                className="w-full p-4 rounded-xl border border-zinc-800 hover:border-amber-400/50 bg-zinc-900/60 hover:bg-amber-400/5 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      MÉTODO 2 // BANCO DE REFERENCIA
                    </span>
                    <h3 className="font-display font-bold text-white text-sm sm:text-base">
                      USAR PC DE LABORATORIO CALIBRADA
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed mt-0.5">
                      Carga el modelo de referencia medido empíricamente (Intel Core i3-1220P // 16GB DDR5 5600 MT/s).
                    </p>
                  </div>
                </div>
                <span className="text-zinc-500 group-hover:text-amber-400 text-lg font-bold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              {/* Option 3: Manual Input */}
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="w-full p-4 rounded-xl border border-zinc-800 hover:border-cyan-400/50 bg-zinc-900/60 hover:bg-cyan-400/5 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase">
                      MÉTODO 3 // PERSONALIZADO
                    </span>
                    <h3 className="font-display font-bold text-white text-sm sm:text-base">
                      ARMAR / INGRESAR MANUALMENTE
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed mt-0.5">
                      Ingresá los componentes específicos que querés evaluar. Los datos ausentes se marcarán como UNKNOWN.
                    </p>
                  </div>
                </div>
                <span className="text-zinc-500 group-hover:text-cyan-400 text-lg font-bold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              {/* Option 4: Hardware Discovery Engine */}
              <button
                type="button"
                onClick={() => setShowDiscovery(true)}
                className="w-full p-4 rounded-xl border border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 text-left transition-all cursor-pointer flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase">
                        HARDWARE DISCOVERY ENGINE
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        TIER 1
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-sm sm:text-base">
                      INVESTIGAR COMPONENTE EN INTERNET
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                      ¿No encontrás tu componente? Escribí marca, modelo o Part Number exacto para extraer la ficha técnica oficial.
                    </p>
                  </div>
                </div>
                <span className="text-cyan-400 text-lg font-bold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white text-xs uppercase">
                  ESPECIFICACIÓN MANUAL DE SILICIO
                </span>
                <button
                  type="button"
                  onClick={() => setMode('options')}
                  className="text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Volver a opciones
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Nombre / Alias:</label>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Procesador (CPU):</label>
                  <input
                    type="text"
                    value={customCpu}
                    onChange={(e) => setCustomCpu(e.target.value)}
                    placeholder="Ej. AMD Ryzen 5 5600"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Placa de Video (GPU):</label>
                  <input
                    type="text"
                    value={customGpu}
                    onChange={(e) => setCustomGpu(e.target.value)}
                    placeholder="Ej. RTX 3060 12GB"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Memoria RAM (GB):</label>
                  <input
                    type="number"
                    value={customRamGb}
                    onChange={(e) => setCustomRamGb(parseInt(e.target.value, 10) || 16)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Velocidad RAM (MT/s):</label>
                  <input
                    type="number"
                    value={customRamSpeed}
                    onChange={(e) => setCustomRamSpeed(parseInt(e.target.value, 10) || 3200)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase">Fuente de Poder (Watts):</label>
                  <input
                    type="number"
                    value={customPsuW}
                    onChange={(e) => setCustomPsuW(parseInt(e.target.value, 10) || 600)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('options')}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold cursor-pointer shadow-md"
                >
                  CARGAR EN EL LABORATORIO
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Integrated Live Scanner Modal */}
      <EvoAutoDetectPcModal
        isOpen={showLiveScanner}
        onClose={() => setShowLiveScanner(false)}
        onHardwareDetected={handleHardwareDetected}
      />

      {/* Integrated Hardware Discovery Engine */}
      <EvoHardwareDiscoveryModal
        isOpen={showDiscovery}
        onClose={() => setShowDiscovery(false)}
        onComponentIncorporated={(comp) => {
          if (comp.category === 'cpu') setCustomCpu(comp.model);
          else if (comp.category === 'gpu') setCustomGpu(comp.model);
          else if (comp.category === 'ram') {
            const cap = Number(String(comp.specifications.capacity || '').replace(/\D/g, ''));
            if (cap) setCustomRamGb(cap);
            const spd = Number(String(comp.specifications.speed || '').replace(/\D/g, ''));
            if (spd) setCustomRamSpeed(spd);
          } else if (comp.category === 'psu') {
            const w = Number(String(comp.specifications.wattage || '').replace(/\D/g, ''));
            if (w) setCustomPsuW(w);
          }
        }}
      />
    </div>
  );
};
