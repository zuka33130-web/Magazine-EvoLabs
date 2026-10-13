import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ListFilter,
  Plus,
  Trash2,
  RefreshCw,
  Power,
  RotateCcw,
} from 'lucide-react';
import { StartupAppItem, StartupAuditSummary, StartupCategory } from '../../types';

interface Station02StartupAuditProps {
  initialTotal?: number;
  initialEnabled?: number;
  auditedApps?: StartupAppItem[];
  initialAudit?: StartupAuditSummary;
  onSaveStartupAudit?: (total: number, enabled: number, apps: StartupAppItem[]) => void;
  onSaveAudit?: (summary: StartupAuditSummary) => void;
  onNextStation: () => void;
}

const DEFAULT_SAMPLE_APPS: StartupAppItem[] = [
  {
    id: 'app-1',
    name: 'Steam / Epic Games Launcher',
    publisher: 'Valve Corp. / Epic Games',
    impact: 'ALTO',
    state: 'HABILITADO',
    userUsageOnBoot: 'NO',
    category: 'LAUNCHER',
    isPrescindibleCandidate: true,
  },
  {
    id: 'app-2',
    name: 'Realtek HD Audio Universal Service',
    publisher: 'Realtek Semiconductor',
    impact: 'MEDIO',
    state: 'HABILITADO',
    userUsageOnBoot: 'SI',
    category: 'DRIVER_HARDWARE',
    isPrescindibleCandidate: false,
  },
  {
    id: 'app-3',
    name: 'OneDrive / Google Drive Sync',
    publisher: 'Microsoft / Google',
    impact: 'MEDIO',
    state: 'HABILITADO',
    userUsageOnBoot: 'NO_SE',
    category: 'SINCRONIZACION',
    isPrescindibleCandidate: true,
  },
  {
    id: 'app-4',
    name: 'Windows Security notification icon',
    publisher: 'Microsoft Corporation',
    impact: 'BAJO',
    state: 'HABILITADO',
    userUsageOnBoot: 'SI',
    category: 'SEGURIDAD',
    isPrescindibleCandidate: false,
  },
];

export const Station02StartupAudit: React.FC<Station02StartupAuditProps> = ({
  initialTotal,
  initialEnabled,
  auditedApps,
  initialAudit,
  onSaveStartupAudit,
  onSaveAudit,
  onNextStation,
}) => {
  const total = initialTotal ?? initialAudit?.total ?? 12;
  const enabled = initialEnabled ?? initialAudit?.enabled ?? 6;
  const apps = (auditedApps && auditedApps.length > 0)
    ? auditedApps
    : (initialAudit?.auditedApps && initialAudit.auditedApps.length > 0)
    ? initialAudit.auditedApps
    : DEFAULT_SAMPLE_APPS;

  const [totalApps, setTotalApps] = useState<number>(total);
  const [enabledApps, setEnabledApps] = useState<number>(enabled);
  const [appsList, setAppsList] = useState<StartupAppItem[]>(apps);

  // Selected candidate for controlled disabling
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('app-1');
  const [hasDisabledCandidate, setHasDisabledCandidate] = useState<boolean>(false);

  const handleUpdateApp = (id: string, key: keyof StartupAppItem, value: any) => {
    setAppsList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [key]: value } : app))
    );
  };

  const handleAddCustomApp = () => {
    const newApp: StartupAppItem = {
      id: `app-custom-${Date.now()}`,
      name: 'Nueva aplicación de inicio',
      publisher: 'Editor no especificado',
      impact: 'NO_MEDIDO',
      state: 'HABILITADO',
      userUsageOnBoot: 'NO',
      category: 'APLICACION_USUARIO',
      isPrescindibleCandidate: true,
    };
    setAppsList((prev) => [...prev, newApp]);
    setSelectedCandidateId(newApp.id);
  };

  const handleRemoveApp = (id: string) => {
    setAppsList((prev) => prev.filter((app) => app.id !== id));
  };

  const selectedCandidate = appsList.find((a) => a.id === selectedCandidateId) || appsList[0];

  const handleToggleDisableInUI = () => {
    if (!selectedCandidate) return;
    const nextState = hasDisabledCandidate ? 'HABILITADO' : 'DESHABILITADO';
    handleUpdateApp(selectedCandidate.id, 'state', nextState);
    setHasDisabledCandidate(!hasDisabledCandidate);
  };

  const handleSaveAndProceed = () => {
    if (onSaveStartupAudit) {
      onSaveStartupAudit(totalApps, enabledApps, appsList);
    }
    if (onSaveAudit) {
      onSaveAudit({
        total: totalApps,
        enabled: enabledApps,
        disabled: Math.max(0, totalApps - enabledApps),
        auditedApps: appsList,
      });
    }
    onNextStation();
  };

  return (
    <section
      id="estacion-02-quien-arranca-con-windows"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 02 // 08</span>
          <span>•</span>
          <span>ARRANQUE & PERSISTENCIA</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          02 // ¿QUIÉN ARRANCA CON WINDOWS?
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “Antes de que abras un solo juego, ya hay programas reclamando memoria y ciclos de CPU.”
        </p>
      </div>

      {/* Editorial context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          Cada vez que iniciás tu computadora, Windows procesa una lista de aplicaciones que tienen
          autorización para ejecutarse automáticamente. Algunas son indispensables para tu hardware
          (controladores de sonido, panel de video). Otras son servicios de conveniencia que decidieron
          que debían arrancar con el sistema sin preguntarte.
        </p>
        <p className="text-yellow-400 font-medium">
          Aclaración técnica esencial: La cantidad de aplicaciones de inicio no es un diagnóstico en
          sí misma. Desactivar indiscriminadamente puede romper audio, atajos de teclado o
          actualizaciones de seguridad.
        </p>
      </div>

      {/* Global Count Audit */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400 flex items-center gap-2">
            <ListFilter className="w-4 h-4" />
            RECUENTO DE APLICACIONES DE INICIO
          </span>
          <span className="text-[11px] font-mono-tech text-zinc-400">
            Administrador de tareas → Aplicaciones de inicio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">TOTAL DE APLICACIONES LISTADAS</label>
            <input
              type="number"
              min="0"
              max="100"
              value={totalApps}
              onChange={(e) => setTotalApps(Number(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-yellow-400"
            />
            <span className="text-[10px] text-zinc-500 block">Incluye habilitadas y deshabilitadas</span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">APLICACIONES HABILITADAS (ACTIVAS)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={enabledApps}
              onChange={(e) => setEnabledApps(Number(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-base focus:outline-none focus:border-yellow-400"
            />
            <span className="text-[10px] text-zinc-500 block">Éstas arrancan silenciosamente en cada encendido</span>
          </div>
        </div>
      </div>

      {/* Interactive Audit Table with Rigorous Categories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            AUDITORÍA Y CLASIFICACIÓN POR CATEGORÍA
          </h3>
          <button
            type="button"
            onClick={handleAddCustomApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono-tech font-bold uppercase transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-yellow-400" />
            <span>Agregar aplicación de tu PC</span>
          </button>
        </div>

        <div className="space-y-3 font-mono-tech text-xs">
          {appsList.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded-xl border transition-all ${
                selectedCandidateId === app.id
                  ? 'bg-yellow-400/5 border-yellow-400/60 shadow-lg'
                  : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => handleUpdateApp(app.id, 'name', e.target.value)}
                      className="font-bold text-white text-sm bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-yellow-400 focus:outline-none"
                    />
                    {app.category === 'DRIVER_HARDWARE' && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold uppercase">
                        CRÍTICO / HARDWARE
                      </span>
                    )}
                    {app.category === 'SEGURIDAD' && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                        SEGURIDAD
                      </span>
                    )}
                    {app.category === 'LAUNCHER' && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase">
                        PRESCINDIBLE EN INICIO
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={app.publisher}
                    onChange={(e) => handleUpdateApp(app.id, 'publisher', e.target.value)}
                    placeholder="Editor del software"
                    className="text-zinc-400 text-xs bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateId(app.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                      selectedCandidateId === app.id
                        ? 'bg-yellow-400 text-black'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {selectedCandidateId === app.id ? 'Seleccionada' : 'Elegir para Intervención'}
                  </button>
                  {appsList.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveApp(app.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
                {/* Categoría */}
                <div>
                  <span className="text-zinc-500 block text-[10px] mb-1">CATEGORÍA TÉCNICA</span>
                  <select
                    value={app.category}
                    onChange={(e) =>
                      handleUpdateApp(app.id, 'category', e.target.value as StartupCategory)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                  >
                    <option value="WINDOWS_SISTEMA">WINDOWS / SISTEMA</option>
                    <option value="DRIVER_HARDWARE">DRIVER / HARDWARE</option>
                    <option value="SEGURIDAD">SEGURIDAD</option>
                    <option value="APLICACION_USUARIO">APLICACIÓN DE USUARIO</option>
                    <option value="LAUNCHER">LAUNCHER</option>
                    <option value="SINCRONIZACION">SINCRONIZACIÓN</option>
                    <option value="ACTUALIZADOR">ACTUALIZADOR</option>
                    <option value="DESCONOCIDO">DESCONOCIDO</option>
                  </select>
                </div>

                {/* Impacto */}
                <div>
                  <span className="text-zinc-500 block text-[10px] mb-1">IMPACTO EN INICIO</span>
                  <select
                    value={app.impact}
                    onChange={(e) =>
                      handleUpdateApp(app.id, 'impact', e.target.value as any)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                  >
                    <option value="ALTO">ALTO</option>
                    <option value="MEDIO">MEDIO</option>
                    <option value="BAJO">BAJO</option>
                    <option value="NO_MEDIDO">NO MEDIDO</option>
                  </select>
                </div>

                {/* ¿Lo usás al encender? */}
                <div>
                  <span className="text-zinc-500 block text-[10px] mb-1">¿LO USÁS AL PRENDER?</span>
                  <select
                    value={app.userUsageOnBoot}
                    onChange={(e) =>
                      handleUpdateApp(app.id, 'userUsageOnBoot', e.target.value as any)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                  >
                    <option value="SI">SÍ (Inmediatamente)</option>
                    <option value="NO">NO (Solo a veces)</option>
                    <option value="NO_SE">NO SÉ / NUNCA</option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <span className="text-zinc-500 block text-[10px] mb-1">ESTADO EN INICIO</span>
                  <span
                    className={`inline-block px-2.5 py-1.5 rounded-lg font-bold w-full text-center ${
                      app.state === 'HABILITADO'
                        ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {app.state}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocolo de Intervención Guiada: Deshabilitar sin Desinstalar */}
      {selectedCandidate && (
        <div className="p-5 rounded-2xl bg-[#14151c] border border-amber-400/40 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400">
            <Power className="w-4 h-4" />
            <span>INTERVENCIÓN CONTROLADA // CAMBIO EVO 001</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-xs">
            <div className="p-3 bg-black/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">APLICACIÓN SELECCIONADA</span>
              <span className="text-white font-bold text-sm truncate block mt-1">
                {selectedCandidate.name}
              </span>
              <span className="text-zinc-400 text-[11px] block mt-0.5">
                Editor: {selectedCandidate.publisher}
              </span>
            </div>

            <div className="p-3 bg-black/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">ESTADO ORIGINAL (PRE-CAMBIO)</span>
              <span className="text-yellow-400 font-bold text-sm block mt-1">HABILITADO</span>
              <span className="text-zinc-500 text-[11px] block mt-0.5">
                Carga previa registrada en bitácora
              </span>
            </div>

            <div className="p-3 bg-black/50 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">CÓMO REVERTIR</span>
              <span className="text-emerald-400 font-bold text-xs block mt-1">100% REVERSIBLE</span>
              <span className="text-zinc-400 text-[11px] block mt-0.5 leading-tight">
                Admin de tareas → Inicio → Habilitar
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 font-sans-editorial text-xs text-zinc-300 leading-relaxed space-y-2">
            <p className="font-bold text-white font-mono-tech text-xs uppercase">
              PASO PRÁCTICO EN TU WINDOWS:
            </p>
            <p>
              1. En tu Administrador de tareas, localizá <strong>{selectedCandidate.name}</strong>.
              <br />
              2. Hacé clic derecho y seleccioná <strong>Deshabilitar</strong>.
              <br />
              3. Verificá que el estado cambie a Deshabilitado.
            </p>
            <p className="text-yellow-400 font-medium italic">
              Recordá: Deshabilitar del inicio <strong>no desinstala</strong> el programa. Sigue en tu
              disco y podés abrirlo manualmente con doble clic cuando realmente lo necesites.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono-tech text-zinc-400">
              ¿Ejecutaste la prueba en tu Windows?
            </span>
            <button
              type="button"
              onClick={handleToggleDisableInUI}
              className={`px-4 py-2 rounded-xl font-mono-tech font-bold text-xs uppercase transition-all cursor-pointer ${
                hasDisabledCandidate
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-yellow-400 text-black hover:bg-yellow-300'
              }`}
            >
              {hasDisabledCandidate ? '✓ Deshabilitado registrado' : 'Marcar como Deshabilitado'}
            </button>
          </div>
        </div>
      )}

      {/* TIP EVO // INICIO */}
      <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono-tech space-y-1">
          <span className="font-bold text-yellow-400 block">
            TIP EVO // DESHABILITAR DEL INICIO != DESINSTALAR
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            Eliminar una aplicación del inicio de Windows no borra sus archivos ni arruina tu
            configuración. Simplemente le quita el permiso arbitrario de despertarse sola y consumir
            recursos antes de que vos decidas abrirla.
          </p>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          id="btn-guardar-auditoria-inicio"
          onClick={handleSaveAndProceed}
          className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          GUARDAR AUDITORÍA // CONTINUAR A ESTACIÓN 03 →
        </button>
      </div>
    </section>
  );
};
