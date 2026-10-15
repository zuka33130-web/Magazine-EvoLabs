import React, { useState } from 'react';
import {
  Database,
  Layers,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Terminal,
  FileCode,
  HardDrive,
  Cpu,
  Key,
} from 'lucide-react';

export const Sector11VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'HIVES_MAP' | 'CONTROLSET' | 'SERVICES' | 'CONTEXT_MENU'
  >('HIVES_MAP');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      {/* Central Visual Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Database className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 11</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              WINDOWS REGISTRY KERNEL ARCHITECTURE & HIVES
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Mapeo de colmenas binarias en disco físico, punteros en memoria RAM y ciclo de vida de ControlSets
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('HIVES_MAP')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'HIVES_MAP'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Mapeo de Colmenas (Hives)
            </button>
            <button
              onClick={() => setActiveDiagram('CONTROLSET')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'CONTROLSET'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. ControlSets y Select
            </button>
            <button
              onClick={() => setActiveDiagram('SERVICES')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'SERVICES'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Estructura de Services & Start
            </button>
            <button
              onClick={() => setActiveDiagram('CONTEXT_MENU')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'CONTEXT_MENU'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Menús Contextuales HKCR
            </button>
          </div>
        </div>

        {/* Diagram 1: Hives Map */}
        {activeDiagram === 'HIVES_MAP' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RAM Logical Tree */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  1. ÁRBOL LÓGICO EN MEMORIA (API WIN32)
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-cyan-300 font-bold">HKEY_LOCAL_MACHINE (HKLM)</span>
                    <span className="text-slate-400 text-[10px]">Raíz Máquina</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-emerald-300 font-bold">HKEY_CURRENT_USER (HKCU)</span>
                    <span className="text-slate-400 text-[10px]">Alias → HKU\SID</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-amber-300 font-bold">HKEY_CLASSES_ROOT (HKCR)</span>
                    <span className="text-slate-400 text-[10px]">Fusión HKLM+HKCU Classes</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-purple-300 font-bold">HKEY_USERS (HKU)</span>
                    <span className="text-slate-400 text-[10px]">Todos los SIDs Cargados</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-blue-300 font-bold">HKEY_CURRENT_CONFIG (HKCC)</span>
                    <span className="text-slate-400 text-[10px]">Alias → Hardware Profiles</span>
                  </div>
                </div>
              </div>

              {/* Physical Files on Disk */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  2. ARCHIVOS FÍSICOS EN DISCO (HIVES REALES)
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-200 font-bold">C:\Windows\System32\config\SYSTEM</div>
                    <div className="text-slate-400 text-[10px]">Boot, Drivers, Services, ControlSets</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-200 font-bold">C:\Windows\System32\config\SOFTWARE</div>
                    <div className="text-slate-400 text-[10px]">Apps del sistema, Policies, OLE/COM</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-200 font-bold">C:\Windows\System32\config\SAM y SECURITY</div>
                    <div className="text-slate-400 text-[10px]">Hashes NTLM, Cuentas Locales, LSA Secrets</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-200 font-bold">C:\Users\&lt;Usuario&gt;\NTUSER.DAT</div>
                    <div className="text-slate-400 text-[10px]">Perfil privado montado como HKCU</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400 font-bold">REGLA FORENSE KERNEL:</strong> Cada colmena cuenta con archivos complementarios de registro transaccional (.LOG1 y .LOG2). Si se interrumpe la alimentación durante una escritura, el kernel usa estos logs para revertir la transacción o sanar el archivo.
            </div>
          </div>
        )}

        {/* Diagram 2: ControlSets */}
        {activeDiagram === 'CONTROLSET' && (
          <div className="pt-6 space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                ARQUITECTURA DE SELECCIÓN DE ARRANQUE (HKLM\SYSTEM\Select)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Current</span>
                  <span className="text-cyan-300 text-sm font-bold">0x1</span>
                  <span className="text-slate-500 text-[10px] block mt-1">ControlSet001 (Activo)</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Default</span>
                  <span className="text-emerald-300 text-sm font-bold">0x1</span>
                  <span className="text-slate-500 text-[10px] block mt-1">Para Próximo Inicio</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Failed</span>
                  <span className="text-rose-300 text-sm font-bold">0x0</span>
                  <span className="text-slate-500 text-[10px] block mt-1">Último Fallido</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">LastKnownGood</span>
                  <span className="text-amber-300 text-sm font-bold">0x2</span>
                  <span className="text-slate-500 text-[10px] block mt-1">Copia Sana de Respaldo</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 font-mono">CurrentControlSet:</strong> Es un puntero en tiempo de ejecución. Al arrancar, winload.efi lee la clave <code className="text-cyan-200">Select\Current</code> y apunta CurrentControlSet hacia <code className="text-cyan-200">ControlSet001</code>. Modificar CurrentControlSet es exactamente lo mismo que modificar ControlSet001.
            </div>
          </div>
        )}

        {/* Diagram 3: Services & Start Types */}
        {activeDiagram === 'SERVICES' && (
          <div className="pt-6 space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                VALORES CANÓNICOS DE INICIO (Start Value en Services)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                <div className="p-3 bg-slate-900 rounded border border-red-500/30">
                  <span className="text-red-400 font-bold block text-sm">0 = Boot</span>
                  <p className="text-slate-400 text-[10px] mt-1 leading-normal">Cargado por el Boot Loader del kernel (storahci, disk, nvme).</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-amber-500/30">
                  <span className="text-amber-400 font-bold block text-sm">1 = System</span>
                  <p className="text-slate-400 text-[10px] mt-1 leading-normal">Cargado durante la inicialización del kernel (fltmgr, ndis).</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block text-sm">2 = Auto</span>
                  <p className="text-slate-400 text-[10px] mt-1 leading-normal">Iniciado automáticamente por services.exe (SCM).</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-blue-500/30">
                  <span className="text-blue-400 font-bold block text-sm">3 = Manual</span>
                  <p className="text-slate-400 text-[10px] mt-1 leading-normal">Iniciado por demanda cuando una app o RPC lo solicita.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-700">
                  <span className="text-slate-400 font-bold block text-sm">4 = Disabled</span>
                  <p className="text-slate-500 text-[10px] mt-1 leading-normal">El SCM o el kernel rechaza su inicio por completo.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Context Menu HKCR */}
        {activeDiagram === 'CONTEXT_MENU' && (
          <div className="pt-6 space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">
                JERARQUÍA DE MENÚS CONTEXTUALES DE SHELL
              </span>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                <div className="text-cyan-300 font-bold">HKCR\Directory\Background\shell</div>
                <div className="text-slate-300 pl-4">└── [NombreDelItem] (Valor por defecto: Etiqueta visible en el menú)</div>
                <div className="text-slate-300 pl-8">├── "Icon" = "ruta\al\icono.ico" (Opcional)</div>
                <div className="text-slate-300 pl-8">└── [command]</div>
                <div className="text-emerald-400 pl-12 font-bold">└── (Por defecto) = "powershell.exe -NoExit -Command ..."</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
