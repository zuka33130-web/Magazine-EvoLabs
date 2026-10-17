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
  FileText,
  Activity,
} from 'lucide-react';

interface EvoWindowsErrorAnalyzerViewProps {
  onReturnToTools: () => void;
}

interface WindowsErrorRecord {
  codeOrEvent: string;
  source: 'Aplicación' | 'Servicio' | 'Controlador' | 'Sistema';
  name: string;
  description: string;
  culprit: string;
  probableCauses: string[];
  diagnosticTests: string[];
  repairSteps: string[];
  eventViewerPath: string;
  severity: 'CRÍTICO' | 'MODERADO' | 'ADVERTENCIA';
}

const COMMON_WINDOWS_ERRORS: WindowsErrorRecord[] = [
  {
    codeOrEvent: 'EventID 1000',
    source: 'Aplicación',
    name: 'Application Error (AppCrash / Faulting Module)',
    description: 'Una aplicación de usuario dejó de funcionar inesperadamente debido a una excepción no controlada en un módulo o DLL de terceros.',
    culprit: 'DLL corrupta (ej. `ntdll.dll`, `vcruntime140.dll`), plugin incompatible o falta de dependencias de C++ Redistributable.',
    probableCauses: [
      'Librería de Visual C++ Redistributable corrupta o faltante.',
      'Archivo de configuración de la aplicación dañado en `%AppData%`.',
      'Conflicto con overlays de software (Discord, GeForce Experience, MSI Afterburner).'
    ],
    diagnosticTests: [
      'Revisar el Visor de Eventos en Registros de Windows → Aplicación buscando el EventID 1000 y el "Módulo con errores".',
      'Desactivar overlays de terceros en juegos y aplicaciones pesadas.'
    ],
    repairSteps: [
      '1. Reinstalar el paquete completo de Microsoft Visual C++ Redistributable (2015-2022).',
      '2. Ejecutar escaneo de integridad del sistema: `sfc /scannow` desde PowerShell con privilegios administrativos.',
      '3. Borrar la caché local de la aplicación afectada en `%localappdata%`.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de Windows → Aplicación (Filtrar por ID 1000)',
    severity: 'MODERADO',
  },
  {
    codeOrEvent: 'EventID 41',
    source: 'Sistema',
    name: 'Kernel-Power (Reinicio o Apagado Inesperado)',
    description: 'El sistema se reinició sin apagarse limpiamente primero. Este error indica que la energía se cortó de forma abrupta o la fuente de poder activó sus protecciones.',
    culprit: 'Fuente de poder (PSU) inestable, sobrecalentamiento crítico de VRM/CPU o bajón severo de tensión eléctrica.',
    probableCauses: [
      'Fuente de alimentación defectuosa o incapaz de soportar picos transitorios (transient spikes) de GPU/CPU.',
      'Activación de protección OCP/OVP por cortocircuito o sobrecarga.',
      'Corte abrupto de energía o botón de encendido trabado.'
    ],
    diagnosticTests: [
      'Verificar temperaturas de CPU y GPU bajo carga con sensores en tiempo real.',
      'Revisar si el evento 41 viene acompañado del EventID 411 o 43 (Kernel-PnP / Power-Troubleshoot).'
    ],
    repairSteps: [
      '1. Desconectar regletas (extensiones) baratas y conectar la PC directamente a toma mural con puesta a tierra.',
      '2. Verificar conexiones internas de los cables EPS de 8 pines y PCIe en la fuente y placa madre.',
      '3. Realizar prueba de estrés de estabilidad para comprobar si la PSU se protege por amperaje.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de Windows → Sistema (Filtrar por ID 41)',
    severity: 'CRÍTICO',
  },
  {
    codeOrEvent: 'EventID 7034',
    source: 'Servicio',
    name: 'Service Control Manager (Terminación Inesperada de Servicio)',
    description: 'Un servicio crítico del sistema o de un programa instalado se cerró de forma imprevista o devolvió un código de error de salida no nulo.',
    culprit: 'Servicio de terceros (antivirus, controlador de periféricos RGB, updater) con fugas de memoria o bloqueo de hilos.',
    probableCauses: [
      'Servicio en segundo plano corrupto o incompatible con la compilación actual de Windows.',
      'Falta de permisos en carpetas de sistema o registro para el servicio.'
    ],
    diagnosticTests: [
      'Abrir `services.msc`, localizar el servicio que genera el fallo y verificar su tipo de inicio.',
      'Revisar si el servicio depende de otro controlador deshabilitado.'
    ],
    repairSteps: [
      '1. Configurar el servicio problemático en inicio manual o deshabilitarlo si es opcional.',
      '2. Reinstalar el software propietario al que pertenece el servicio.',
      '3. Ejecutar `DISM /Online /Cleanup-Image /RestoreHealth`.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de Windows → Sistema (Filtrar por ID 7034)',
    severity: 'ADVERTENCIA',
  },
  {
    codeOrEvent: '0x80070002',
    source: 'Sistema',
    name: 'ERROR_FILE_NOT_FOUND (Windows Update / Store)',
    description: 'Windows Update o el instalador del sistema no pudo encontrar el archivo especificado en la ruta de caché o repositorio de paquetes.',
    culprit: 'Caché de Windows Update corrupta (`Catroot2` o `SoftwareDistribution`) o archivos de manifiesto ausentes.',
    probableCauses: [
      'Interrupción durante la descarga de una actualización acumulativa.',
      'Bloqueo por software antivirus que impide la escritura en `C:\\Windows\\SoftwareDistribution`.'
    ],
    diagnosticTests: [
      'Intentar aplicar la actualización desde el catálogo offline de Microsoft Update.',
      'Verificar espacio libre en la partición del sistema operativo (mínimo 15 GB libres).'
    ],
    repairSteps: [
      '1. Detener los servicios de actualización con comandos en consola: `net stop wuauserv`, `net stop cryptSvc`, `net stop bits`.',
      '2. Renombrar las carpetas de caché: `ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old`.',
      '3. Reiniciar los servicios y reintentar la búsqueda de actualizaciones.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de aplicaciones y servicios → Microsoft → Windows → Setup',
    severity: 'MODERADO',
  },
  {
    codeOrEvent: '0xC0000005',
    source: 'Aplicación',
    name: 'STATUS_ACCESS_VIOLATION (Excepción de Memoria)',
    description: 'Un proceso intentó leer o escribir en una dirección de memoria virtual que no le pertenece o a la que no tiene permisos asignados.',
    culprit: 'Puntero nulo en código de aplicación, incompatibilidad de arquitectura o celda de RAM inestable.',
    probableCauses: [
      'Inestabilidad en memorias RAM (overclocking o perfil XMP fallido).',
      'Bug en la aplicación al gestionar punteros de memoria dinámicos.'
    ],
    diagnosticTests: [
      'Ejecutar Diagnóstico de Memoria de Windows (`mdsched.exe`).',
      'Verificar si el fallo ocurre en modo limpio de arranque (Clean Boot).'
    ],
    repairSteps: [
      '1. Desactivar temporalmente perfiles XMP/EXPO en la BIOS.',
      '2. Actualizar la aplicación o juego a su última versión parcheada.',
      '3. Deshabilitar mitigaciones DEP/ASLR problemáticas solo si es estrictamente necesario para software legacy.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de Windows → Aplicación',
    severity: 'CRÍTICO',
  },
  {
    codeOrEvent: 'EventID 6008',
    source: 'Sistema',
    name: 'Unexpected Shutdown (Apagado Anómalo previo)',
    description: 'Registra que el apagado anterior del equipo a la hora indicada no fue limpio (por ejemplo, corte de luz, botón mantenido presionado o cuelgue total).',
    culprit: 'Bloqueo absoluto del sistema (hang) provocado por GPU, controlador de video o temperatura extrema.',
    probableCauses: [
      'Inestabilidad de voltaje en núcleos de CPU (Undervolt excesivo).',
      'Fallo de driver de video que congeló el gestor de ventanas de Windows (DWM).'
    ],
    diagnosticTests: [
      'Inspeccionar el evento registrado exactamente 1 segundo antes del 6008 para ver qué error causó el bloqueo.',
      'Comprobar registros de temperatura máxima alcanzada.'
    ],
    repairSteps: [
      '1. Relajar los valores de undervolt o overclock aplicados en CPU/GPU.',
      '2. Actualizar controladores de video con instalación limpia mediante DDU.',
      '3. Revisar integridad de discos con comandos CHKDSK.'
    ],
    eventViewerPath: 'Visor de eventos → Registros de Windows → Sistema (Filtrar por ID 6008)',
    severity: 'ADVERTENCIA',
  },
];

export const EvoWindowsErrorAnalyzerView: React.FC<EvoWindowsErrorAnalyzerViewProps> = ({
  onReturnToTools,
}) => {
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('EventID 1000');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('TODOS');

  const filteredErrors = COMMON_WINDOWS_ERRORS.filter(err => {
    const matchesCat = activeCategoryFilter === 'TODOS' || err.source.toUpperCase() === activeCategoryFilter.toUpperCase();
    const matchesSearch = searchFilter === '' || 
      err.codeOrEvent.toLowerCase().includes(searchFilter.toLowerCase()) ||
      err.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      err.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeError = COMMON_WINDOWS_ERRORS.find(e => e.codeOrEvent === selectedErrorCode) || filteredErrors[0] || COMMON_WINDOWS_ERRORS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR & RETURN BUTTON */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToTools}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Volver a Herramientas</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                  Diagnóstico de Sistema • NT Kernel
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Herramienta Independiente
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                ANALIZAR ERRORES DE WINDOWS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar código, EventID o síntoma..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: ERROR CATALOG / SELECTOR */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Bitácoras y Errores Frecuentes</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredErrors.length} registros
                </span>
              </div>

              {/* CATEGORY TABS */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['TODOS', 'SISTEMA', 'APLICACIÓN', 'SERVICIO'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                      activeCategoryFilter === cat
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* LIST OF ERRORS */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredErrors.map(err => {
                  const isSelected = activeError?.codeOrEvent === err.codeOrEvent;
                  return (
                    <button
                      key={err.codeOrEvent}
                      onClick={() => setSelectedErrorCode(err.codeOrEvent)}
                      className={`w-full text-left p-3 rounded-lg border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/50'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                          {err.codeOrEvent}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            err.severity === 'CRÍTICO'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : err.severity === 'MODERADO'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}
                        >
                          {err.severity}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white line-clamp-1">
                        {err.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">
                        {err.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EVENT VIEWER INSTRUCTION CARD */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>¿Cómo abrir el Visor de Eventos?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Presiona <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">Win + R</code>, escribe{' '}
                <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">eventvwr.msc</code> y pulsa Enter. Navega a{' '}
                <span className="text-slate-200 font-medium">Registros de Windows → Sistema o Aplicación</span> para buscar evidencias reales.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED DIAGNOSIS & GUIDED REPAIR */}
          <div className="lg:col-span-7 space-y-6">
            {activeError ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                        {activeError.codeOrEvent}
                      </span>
                      <span className="text-xs text-slate-400 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded font-medium">
                        {activeError.source}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-2">{activeError.name}</h2>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-center ${
                      activeError.severity === 'CRÍTICO'
                        ? 'bg-red-950/80 text-red-400 border border-red-800'
                        : activeError.severity === 'MODERADO'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-blue-950/80 text-blue-400 border border-blue-800'
                    }`}
                  >
                    Severidad: {activeError.severity}
                  </span>
                </div>

                {/* DESCRIPTION & CULPRIT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-lg space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>¿Qué significa este error?</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{activeError.description}</p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-lg space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>Culpable Habitual</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">{activeError.culprit}</p>
                  </div>
                </div>

                {/* PROBABLE CAUSES */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Causas Raíz Probables</span>
                  </h3>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
                    {activeError.probableCauses.map((cause, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DIAGNOSTIC TESTS */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Pruebas de Diagnóstico y Ubicación</span>
                  </h3>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-3">
                    <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2.5 rounded font-mono">
                      📍 {activeError.eventViewerPath}
                    </div>
                    {activeError.diagnosticTests.map((test, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GUIDED REPAIR STEPS */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span>Soluciones Guiadas Paso a Paso</span>
                  </h3>
                  <div className="bg-slate-950/80 border border-emerald-950/60 rounded-lg p-4 space-y-3">
                    {activeError.repairSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-mono">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                Selecciona un error del catálogo para ver su análisis forense y protocolo de reparación.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
