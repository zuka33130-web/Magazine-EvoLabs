import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Search,
  Cpu,
  RefreshCw,
  HardDrive,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface EvoBsodRepairViewProps {
  onReturnToTools: () => void;
}

interface BugcheckInfo {
  code: string;
  name: string;
  description: string;
  culprit: string;
  probableCauses: string[];
  eliminationTests: string[];
  repairSteps: string[];
  severity: 'CRÍTICO' | 'MODERADO' | 'ADVERTENCIA';
}

const COMMON_BUGCHECKS: BugcheckInfo[] = [
  {
    code: '0x0000000A',
    name: 'IRQL_NOT_LESS_OR_EQUAL',
    description: 'Un controlador o proceso en modo kernel intentó acceder a una dirección de memoria sin privilegios o con IRQL incorrecto.',
    culprit: 'Controlador de red (Wi-Fi/Ethernet), GPU o RAM inestable por XMP/EXPO.',
    probableCauses: [
      'Inestabilidad de frecuencias RAM (XMP/EXPO demasiado agresivo).',
      'Controlador de dispositivo obsoleto o corrupto (tarjeta de red o audio).',
      'Conflicto de IRQ entre hardware PCI-Express.'
    ],
    eliminationTests: [
      'Desactivar temporalmente XMP/EXPO en la BIOS y probar estabilidad.',
      'Actualizar controladores de red y chipset de la placa madre.',
      'Ejecutar Diagnóstico de Memoria de Windows o MemTest86.'
    ],
    repairSteps: [
      '1. Ingresar en Modo Seguro si el sistema lo permite.',
      '2. Desinstalar el último driver instalado o actualizado.',
      '3. Ejecutar en consola administrativa: `sfc /scannow` y `dism /online /cleanup-image /restorehealth`.'
    ],
    severity: 'CRÍTICO',
  },
  {
    code: '0x0000001A',
    name: 'MEMORY_MANAGEMENT',
    description: 'El administrador de memoria del kernel detectó una corrupción grave en las tablas de páginas o asignación RAM.',
    culprit: 'Módulos de memoria RAM defectuosos, contactos sucios o sobre-voltaje en IMC.',
    probableCauses: [
      'Módulo RAM con celdas dañadas o mal asentado en el slot DIMM.',
      'Perfil de overclocking de RAM inestable.',
      'Corrupción en el archivo de paginación (pagefile.sys).'
    ],
    eliminationTests: [
      'Limpiar contactos de los módulos RAM con goma limpia-contactos e insertar en slots alternativos (canales A2/B2).',
      'Probar con un único módulo de RAM a la vez.'
    ],
    repairSteps: [
      '1. Restablecer valores predeterminados de fábrica (JEDEC) en la BIOS para la RAM.',
      '2. Ejecutar `mdsched.exe` (Diagnóstico de memoria de Windows) con examen extendido.',
      '3. Recrear el archivo de paginación de Windows.'
    ],
    severity: 'CRÍTICO',
  },
  {
    code: '0x00000050',
    name: 'PAGE_FAULT_IN_NONPAGED_AREA',
    description: 'El sistema solicitó datos de memoria que no existían o no estaban residentes en memoria no pagada.',
    culprit: 'Antivirus de terceros, servicio de Windows dañado o driver de almacenamiento NVMe.',
    probableCauses: [
      'Controlador de almacenamiento NVMe/SATA desactualizado.',
      'Antivirus de terceros incompatible con la última compilación de Windows.',
      'Sector defectuoso en la unidad de almacenamiento principal.'
    ],
    eliminationTests: [
      'Verificar estado S.M.A.R.T. de la unidad SSD/HDD.',
      'Desinstalar software antivirus de terceros para descartar interferencia en Ring 0.'
    ],
    repairSteps: [
      '1. Actualizar el firmware del SSD NVMe desde la herramienta oficial del fabricante.',
      '2. Comprobar integridad de disco con `chkdsk C: /f /r` desde un medio de recuperación.',
      '3. Reparar imagen del sistema operativo.'
    ],
    severity: 'MODERADO',
  },
  {
    code: '0x000000EF',
    name: 'CRITICAL_PROCESS_DIED',
    description: 'Un proceso esencial del sistema operativo (como `csrss.exe` o `wininit.exe`) terminó inesperadamente.',
    culprit: 'Corrupción severa del sistema de archivos, fallo de hardware en SSD o malware en kernel.',
    probableCauses: [
      'Pérdida súbita de energía durante actualización de Windows.',
      'Fallo intermitente en el bus PCIe del SSD NVMe.',
      'Archivos del sistema crítico modificados o eliminados.'
    ],
    eliminationTests: [
      'Verificar conexiones físicas de alimentación y datos del SSD.',
      'Comprobar logs del Visor de Eventos de Windows previos al fallo.'
    ],
    repairSteps: [
      '1. Arrancar en Modo Seguro o Entorno de Recuperación (WinRE).',
      '2. Ejecutar restauración del sistema a un punto anterior funcional.',
      '3. Ejecutar reparación profunda de componentes con comandos DISM y SFC.'
    ],
    severity: 'CRÍTICO',
  },
  {
    code: '0x0000001E',
    name: 'KMODE_EXCEPTION_NOT_HANDLED',
    description: 'Un programa en modo kernel generó una excepción que el manejador de errores no pudo capturar.',
    culprit: 'Driver incompatible, BIOS desactualizada o incompatibilidad de hardware reciente.',
    probableCauses: [
      'Versión de BIOS incompatible con nuevos procesadores o tarjetas gráficas.',
      'Driver de tarjeta gráfica (NVIDIA/AMD) corrupto.'
    ],
    eliminationTests: [
      'Actualizar la BIOS de la placa madre a la versión más estable.',
      'Realizar instalación limpia de drivers de video usando DDU (Display Driver Uninstaller).'
    ],
    repairSteps: [
      '1. Identificar el archivo binario (.sys) mencionado en la pantalla azul.',
      '2. Reemplazar o actualizar dicho controlador.',
      '3. Verificar estabilidad térmica del procesador.'
    ],
    severity: 'ADVERTENCIA',
  },
];

export const EvoBsodRepairView: React.FC<EvoBsodRepairViewProps> = ({
  onReturnToTools,
}) => {
  const [selectedBugcheckCode, setSelectedBugcheckCode] = useState<string>('0x0000000A');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [symptomContext, setSymptomContext] = useState<string>('gaming');
  const [bootState, setBootState] = useState<string>('normal');

  const activeBugcheck = COMMON_BUGCHECKS.find(b => b.code === selectedBugcheckCode) || COMMON_BUGCHECKS[0];

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono-tech select-none text-zinc-100">
      
      {/* HEADER DE NAVEGACIÓN Y TÍTULO EXCLUSIVO */}
      <div className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            type="button"
            onClick={onReturnToTools}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase transition-all border border-zinc-800 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>REGRESAR A HERRAMIENTAS</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 font-bold">
              ● HERRAMIENTA INDEPENDIENTE // REPARACIÓN
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              SOLUCIONAR PANTALLAZOS AZULES
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 font-sans-editorial max-w-3xl leading-relaxed">
            Asistente forense y de reparación para excepciones del Kernel NT. Decodifica códigos Bugcheck, aísla módulos culpables y aplica protocolos de recuperación paso a paso.
          </p>
        </div>
      </div>

      {/* PANEL PRINCIPAL DE DIAGNÓSTICO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Asistente / Entradas de Código STOP */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5 shadow-xl">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Search className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Seleccionar Código STOP / Bugcheck
              </h2>
            </div>

            {/* Lista rápida de códigos */}
            <div className="space-y-2">
              {COMMON_BUGCHECKS.map((item) => {
                const isSelected = item.code === selectedBugcheckCode;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setSelectedBugcheckCode(item.code)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500/60 text-white shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono-tech text-sky-300">
                        {item.code}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.severity === 'CRÍTICO' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        item.severity === 'MODERADO' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <span className="text-xs font-sans font-semibold text-white truncate">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contexto y Síntomas */}
            <div className="space-y-3 pt-3 border-t border-zinc-900">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                2. Momento en que ocurre la falla:
              </label>
              <select
                value={symptomContext}
                onChange={(e) => setSymptomContext(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-sky-400 transition-colors"
              >
                <option value="gaming">Durante juegos pesados o carga gráfica</option>
                <option value="startup">Al encender la PC o cargar Windows</option>
                <option value="idle">Aleatoriamente en reposo o navegación</option>
                <option value="update">Inmediatamente después de una actualización</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                3. Estado de arranque actual:
              </label>
              <select
                value={bootState}
                onChange={(e) => setBootState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-sky-400 transition-colors"
              >
                <option value="normal">Windows arranca con normalidad intermitente</option>
                <option value="safe-mode">Acceso disponible a Modo Seguro</option>
                <option value="bootloop">Bucle de reinicios (Bootloop continuo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Diagnóstico Detallado, Causas y Plan de Reparación */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ficha Bugcheck Activo */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 flex-wrap border-b border-zinc-900 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-sky-400 font-mono-tech px-2.5 py-1 rounded bg-sky-950/80 border border-sky-800">
                    BUGCHECK: {activeBugcheck.code}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold uppercase">
                    SEVERIDAD: {activeBugcheck.severity}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase mt-2">
                  {activeBugcheck.name}
                </h2>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                Diagnóstico del Kernel NT:
              </span>
              <p className="text-sm text-zinc-200 font-sans-editorial leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                {activeBugcheck.description}
              </p>
            </div>

            {/* Culpable probable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Componente Culpable Probable</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans">
                  {activeBugcheck.culprit}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                  <Layers className="w-4 h-4" />
                  <span>Causas Raíz Frecuentes</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 font-sans list-disc pl-4">
                  {activeBugcheck.probableCauses.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pruebas de Descarte */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <Search className="w-4 h-4" />
                <span>Pruebas de Descarte Recomendadas</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {activeBugcheck.eliminationTests.map((test, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">0{idx + 1}.</span>
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedimiento de Reparación Paso a Paso */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase">
                <Wrench className="w-4 h-4" />
                <span>Protocolo de Reparación Seguro (Paso a Paso)</span>
              </div>
              <div className="space-y-2">
                {activeBugcheck.repairSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-900/50 text-xs text-zinc-200 font-sans flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de Retorno inferior */}
            <div className="pt-4 border-t border-zinc-900 flex justify-end">
              <button
                type="button"
                onClick={onReturnToTools}
                className="py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.2)] flex items-center gap-2"
              >
                <span>VOLVER AL CATÁLOGO DE HERRAMIENTAS</span>
                <ArrowLeft className="w-4 h-4 text-black rotate-180" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
