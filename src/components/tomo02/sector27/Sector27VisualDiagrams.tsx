import React, { useState } from 'react';
import {
  Wrench,
  Shield,
  Terminal,
  Activity,
  HardDrive,
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Search,
} from 'lucide-react';

export const Sector27VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'HIERARCHY' | 'DISM_SFC_FLOW' | 'RECOVERY_MAP'>('HIERARCHY');

  return (
    <div className="my-6 p-5 rounded-2xl bg-[#090D14] border border-cyan-500/30 text-white space-y-4 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-bold">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <span>Diagramas Didácticos Canónicos // Sector 27</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#05070A] p-1 rounded-xl border border-cyan-500/20 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('HIERARCHY')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'HIERARCHY'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-zinc-400 hover:text-cyan-300'
            }`}
          >
            Jerarquía
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DISM_SFC_FLOW')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'DISM_SFC_FLOW'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-zinc-400 hover:text-cyan-300'
            }`}
          >
            Flujo DISM/SFC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RECOVERY_MAP')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'RECOVERY_MAP'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-zinc-400 hover:text-cyan-300'
            }`}
          >
            WinRE Map
          </button>
        </div>
      </div>

      {activeTab === 'HIERARCHY' && (
        <div className="space-y-3 font-mono text-xs">
          <p className="text-zinc-300">
            Escalafón Pericial de Intervención (Principios de Mínima Invasión):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">NIVEL 1</span>
                <p className="text-sm font-bold text-white mt-1">SFC /Scannow</p>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Verifica integridad de DLLs/EXEs contra WinSxS local.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase">NIVEL 2</span>
                <p className="text-sm font-bold text-white mt-1">DISM RestoreHealth</p>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Repara la fuente WinSxS descargando paquetes de WU o ISO.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase">NIVEL 3</span>
                <p className="text-sm font-bold text-white mt-1">WinRE & BCD</p>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Reparación de sector de arranque, bcdboot y safeboot.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase">NIVEL 4</span>
                <p className="text-sm font-bold text-white mt-1">In-Place Upgrade</p>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Reinstalación limpia del Kernel preservando datos y apps.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DISM_SFC_FLOW' && (
        <div className="p-4 rounded-xl bg-[#05070A] border border-cyan-500/20 font-mono text-xs space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Ciclo de Reparación de Componentes Windows</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-zinc-300">
            <p className="text-cyan-400 font-bold mb-1">Paso 1: sfc /scannow</p>
            <p className="text-[11px]">Escanea c:\windows\system32 vs C:\Windows\WinSxS.</p>
            <p className="text-amber-300 text-[10px] mt-1">
              • Si reporta error insalvable → Pasar inmediatamente a DISM.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-zinc-300">
            <p className="text-cyan-400 font-bold mb-1">Paso 2: DISM /Online /Cleanup-Image /RestoreHealth</p>
            <p className="text-[11px]">Descarga manifiestos limpios desde Microsoft Update para sanar WinSxS.</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-700 text-zinc-300">
            <p className="text-cyan-400 font-bold mb-1">Paso 3: Re-ejecución de SFC</p>
            <p className="text-[11px]">Con WinSxS reparado, SFC ahora sí puede reemplazar DLLs corruptas.</p>
          </div>
        </div>
      )}

      {activeTab === 'RECOVERY_MAP' && (
        <div className="p-4 rounded-xl bg-[#05070A] border border-cyan-500/20 font-mono text-xs space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Entorno de Recuperación Windows (WinRE)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-cyan-500/30">
              <span className="text-cyan-300 font-bold">reagentc /info</span>
              <p className="text-[10px] text-zinc-400 mt-1">Comprueba si la partición WinRE está habilitada.</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-cyan-500/30">
              <span className="text-cyan-300 font-bold">bcdboot C:\Windows /s S: /f UEFI</span>
              <p className="text-[10px] text-zinc-400 mt-1">Regenera el bootloader EFI en la partición FAT32 ocultada.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
