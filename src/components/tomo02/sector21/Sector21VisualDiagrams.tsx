import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Cpu,
  UserCheck,
  FileCode,
  Eye,
} from 'lucide-react';

export const Sector21VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'UAC_TOKEN_SPLIT' | 'HVCI_VBS_ARCHITECTURE' | 'NTFS_DACL_EVALUATION' | 'UEFI_SECURE_BOOT_CHAIN'
  >('UAC_TOKEN_SPLIT');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 21</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              SEGURIDAD, CONTROL DE ACCESO, TOKENS Y BLINDAJE DE KERNEL
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Segregación UAC Dual-Token, Aislamiento por Hipervisor (VBS/HVCI), Evaluación DACL NTFS y Cadena de Confianza UEFI Secure Boot
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('UAC_TOKEN_SPLIT')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'UAC_TOKEN_SPLIT'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              UAC Token Splitting
            </button>
            <button
              onClick={() => setActiveDiagram('HVCI_VBS_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'HVCI_VBS_ARCHITECTURE'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              HVCI & VBS Isolation
            </button>
            <button
              onClick={() => setActiveDiagram('NTFS_DACL_EVALUATION')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'NTFS_DACL_EVALUATION'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              NTFS DACL Evaluation
            </button>
            <button
              onClick={() => setActiveDiagram('UEFI_SECURE_BOOT_CHAIN')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'UEFI_SECURE_BOOT_CHAIN'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              Secure Boot Chain
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: UAC TOKEN SPLIT */}
        {activeDiagram === 'UAC_TOKEN_SPLIT' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>FLUJO DE INICIO DE SESIÓN DE ADMINISTRADOR CON UAC ACTIVO</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">1. Autenticación LSASS</div>
                  <div className="text-emerald-400 font-bold text-sm">Logon Interactive</div>
                  <div className="text-slate-500 mt-2 text-[11px]">SAM / Kerberos valida credenciales y genera Master Token</div>
                </div>
                <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-lg">
                  <div className="text-xs text-amber-400 mb-1">2. Arquitectura LUA Token Splitting</div>
                  <div className="text-amber-300 font-bold text-sm">Dual Token Creation</div>
                  <div className="text-slate-300 mt-2 text-[11px]">
                    • Standard Token (Filtered): SIDs elevados stripped
                    <br />• Elevated Token: Reserved for Consent.exe
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">3. Ejecución Diaria</div>
                  <div className="text-cyan-400 font-bold text-sm">Filtered User Token</div>
                  <div className="text-slate-500 mt-2 text-[11px]">Explorer.exe y apps corren en Medium Integrity Level</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-bold">Detalle de Kernel:</span> Aunque el usuario pertenezca al grupo <code className="text-amber-300">Administrators</code>, UAC elimina los SIDs administrativos del token de ejecución por defecto. Al solicitar elevación, el servicio Application Information Service (<code className="text-cyan-300">appinfo.dll</code>) solicita a <code className="text-cyan-300">consent.exe</code> mostrar el diálogo en el Escritorio Seguro aislado.
            </div>
          </div>
        )}

        {/* DIAGRAM 2: HVCI VBS */}
        {activeDiagram === 'HVCI_VBS_ARCHITECTURE' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>ESTRUCTURA DE AISLAMIENTO BASADA EN VIRTUALIZACIÓN (VBS) Y HVCI</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-300">VTL1 (Virtual Trust Level 1): Secure World</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Secure Kernel, Credential Guard, HVCI Code Integrity Manager</p>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-900 text-purple-200 rounded text-[10px]">Isolated Hardware Space</span>
                </div>
                <div className="text-center text-slate-600 font-bold">▲ Hyper-V Microvisor (SLAT / Memory Protections) ▲</div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-cyan-300">VTL0 (Virtual Trust Level 0): Normal World</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Windows Kernel (ntoskrnl.exe), Third-Party Drivers, User Mode Apps</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">Standard OS Ring 0 / Ring 3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: NTFS DACL EVALUATION */}
        {activeDiagram === 'NTFS_DACL_EVALUATION' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs space-y-3">
              <div className="text-amber-400 font-bold flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>ORDEN SECUENCIAL DE EVALUACIÓN DE ACEs EN DISCRETIONARY ACCESS CONTROL LIST</span>
              </div>
              <div className="p-3 bg-red-950/30 border border-red-800/40 rounded flex items-center justify-between">
                <span>1. Deny ACE Explícito (Ejemplo: DENY 'UsuarioX' Write)</span>
                <span className="text-red-400 font-bold">EVALUADO PRIMERO → Deniega Inmediato</span>
              </div>
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded flex items-center justify-between">
                <span>2. Allow ACE Explícito (Ejemplo: ALLOW 'Administrators' Full Control)</span>
                <span className="text-emerald-400 font-bold">EVALUADO SEGUNDO → Concede Permiso</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between text-slate-400">
                <span>3. ACEs Heredados del Directorio Padre</span>
                <span>EVALUADOS AL FINAL</span>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: SECURE BOOT */}
        {activeDiagram === 'UEFI_SECURE_BOOT_CHAIN' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>CADENA DE CONFIANZA CRIPTOGRÁFICA PRE-OS</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex-1">
                  <div className="text-amber-400 font-bold">Platform Key (PK)</div>
                  <div className="text-[10px] text-slate-500 mt-1">UEFI Firmware Root Trust</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex-1">
                  <div className="text-cyan-400 font-bold">Signature Database (db)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Microsoft Windows Boot Certs</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded flex-1">
                  <div className="text-emerald-300 font-bold">bootmgr.efi & ntoskrnl</div>
                  <div className="text-[10px] text-slate-400 mt-1">Kernel Firmado Ejecutado</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
