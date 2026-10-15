import React, { useState } from 'react';
import {
  RotateCcw,
  RefreshCw,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  HardDrive,
  FileCode,
  Package,
} from 'lucide-react';

export const Sector20VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'SERVICING_STACK_ATOMIC' | 'WINSXS_HARDLINKS' | 'ROLLBACK_TRIGGER_FLOW' | 'HRESULT_ANATOMY'
  >('SERVICING_STACK_ATOMIC');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <RefreshCw className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 20</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              SERVICING STACK, WINSXS, ARQUITECTURA CBS Y ROLLBACK ATÓMICO
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Transacciones atómicas Poqexec, enlaces duros NTFS en WinSxS, detección de fallas de boot y decodificación de errores HRESULT
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('SERVICING_STACK_ATOMIC')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'SERVICING_STACK_ATOMIC'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Servicing Stack Atómico
            </button>
            <button
              onClick={() => setActiveDiagram('WINSXS_HARDLINKS')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'WINSXS_HARDLINKS'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              2. WinSxS &amp; Hard Links
            </button>
            <button
              onClick={() => setActiveDiagram('ROLLBACK_TRIGGER_FLOW')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'ROLLBACK_TRIGGER_FLOW'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Rollback Automático
            </button>
            <button
              onClick={() => setActiveDiagram('HRESULT_ANATOMY')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'HRESULT_ANATOMY'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              4. Anatomía HRESULT
            </button>
          </div>
        </div>

        {/* Diagram 1: Servicing Stack Atomic */}
        {activeDiagram === 'SERVICING_STACK_ATOMIC' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[CICLO DE VIDA DEL SERVICING STACK]:</strong> Cuando se instala un parche acumulativo (LCU), Windows no reemplaza archivos al vuelo. Prepara la transacción en memoria y delega a Poqexec.exe la sustitución de binarios bloqueados durante la fase previa al inicio de sesión.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold">1. Staging</div>
                <div className="text-[11px] text-slate-400">TiWorker descarga paquetes CAB a SoftwareDistribution y descomprime manifiestos.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold">2. Validación CBS</div>
                <div className="text-[11px] text-slate-400">CBS.log verifica firmas SHA-256 y dependencias cruzadas con el almacén WinSxS.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-amber-800/40 rounded-xl space-y-1">
                <div className="text-amber-400 font-bold">3. Poqexec en Boot</div>
                <div className="text-[11px] text-slate-400">Durante el reinicio, Poqexec procesa PendingFileRenameOperations en modo exclusivo.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-emerald-800/40 rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">4. Commit Final</div>
                <div className="text-[11px] text-slate-400">Se actualiza el registro UBR y el paquete pasa a estado &quot;Installed&quot;.</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: WinSxS Hardlinks */}
        {activeDiagram === 'WINSXS_HARDLINKS' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[WINSXS &amp; HARD LINKS DE NTFS]:</strong> La carpeta WinSxS parece ocupar 20 GB, pero en realidad comparte los mismos bloques de disco que System32 mediante enlaces duros. Borrar WinSxS a mano rompe las referencias MFT y destruye el sistema operativo.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 font-mono font-bold text-xs">C:\Windows\WinSxS (Almacén Canónico)</div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>- Contiene los archivos físicos reales en disco.</div>
                  <div>- Múltiples versiones de cada DLL para rollback seguro.</div>
                  <div>- Limpieza oficial: únicamente con DISM /StartComponentCleanup.</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="text-emerald-400 font-mono font-bold text-xs">C:\Windows\System32 (Hard Links NTFS)</div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>- Punteros en la Master File Table (MFT) que apuntan a WinSxS.</div>
                  <div>- Ocupan 0 bytes adicionales en el disco físico.</div>
                  <div>- Permiten que las aplicaciones encuentren las DLLs donde esperan.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: Rollback Trigger Flow */}
        {activeDiagram === 'ROLLBACK_TRIGGER_FLOW' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[FLUJO DE ROLLBACK AUTOMÁTICO]:</strong> Si un parche genera un pantallazo azul (BSOD) durante el primer inicio, Windows protege al usuario revirtiendo la transacción automáticamente tras dos intentos fallidos.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-rose-800/40 rounded-xl space-y-1">
                <div className="text-rose-400 font-bold">1. Falla de Arranque</div>
                <div className="text-[11px] text-slate-400">El kernel detecta BSOD (ej: 0x7B INACCESSIBLE_BOOT_DEVICE). Contador BootStatusPolicy = 1.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-amber-800/40 rounded-xl space-y-1">
                <div className="text-amber-400 font-bold">2. Segundo Reintento</div>
                <div className="text-[11px] text-slate-400">Falla consecutiva detectada. El cargador de boot deriva el flujo al entorno de rescate WinRE.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-emerald-800/40 rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">3. Reversión CBS</div>
                <div className="text-[11px] text-slate-400">WinRE ejecuta Poqexec en modo reversa y restaura los binarios anteriores resguardados en WinSxS.</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: HRESULT Anatomy */}
        {activeDiagram === 'HRESULT_ANATOMY' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[ANATOMÍA DE ERRORES HRESULT DE 32 BITS]:</strong> Los códigos hexadecimales como 0x80070002 o 0x800F081F no son aleatorios; siguen un estándar matemático estricto definido por Microsoft.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold">Bit 31: Severidad (0x8)</div>
                <div className="text-[11px] text-slate-400">1 = Error crítico no recuperable. Indica que la operación fue abortada.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl space-y-1">
                <div className="text-amber-400 font-bold">Bits 16-26: Facilidad (0x007 / 0x00F)</div>
                <div className="text-[11px] text-slate-400">0x007 = Error de API Win32 nativa; 0x00F = Error del subsistema CBS / Servicing.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">Bits 0-15: Código de Error</div>
                <div className="text-[11px] text-slate-400">0x0002 = ERROR_FILE_NOT_FOUND; 0x081F = CBS_E_SOURCE_MISSING.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
