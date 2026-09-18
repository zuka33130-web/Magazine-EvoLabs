import React from 'react';
import { Sliders, ArrowRight, ArrowLeft, ShieldCheck, Gamepad2, Monitor } from 'lucide-react';
import { AbExperimentObjective, AbExperimentConditions } from '../../types';

interface Phase03ConditionsStationProps {
  objective: AbExperimentObjective;
  conditions: AbExperimentConditions;
  onChangeConditions: (cond: AbExperimentConditions) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Phase03ConditionsStation: React.FC<Phase03ConditionsStationProps> = ({
  objective,
  conditions,
  onChangeConditions,
  onBack,
  onNext,
}) => {
  const isGamingOrFps =
    objective === 'MEJORAR_ESTABILIDAD_FPS' ||
    objective === 'REDUCIR_STUTTERING' ||
    objective === 'COMPARAR_DOS_CONFIGURACIONES' ||
    objective === 'INVESTIGAR_LIMITACION';

  const updateField = (field: keyof AbExperimentConditions, val: string) => {
    onChangeConditions({
      ...conditions,
      [field]: val,
    });
  };

  const isFormValid = conditions.gameOrApp.trim().length >= 2 && (conditions.duration?.trim().length || 0) >= 2;

  return (
    <section
      id="fase-03-condiciones-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <Sliders className="w-4 h-4 text-yellow-400" />
          <span>FASE 03 // CONDICIONES DEL ENSAYO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          AISLAMIENTO DEL ENTORNO
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Para que una comparación sea válida, la prueba A y la prueba B deben realizarse bajo condiciones prácticamente gemelas. Si el mapa cambia o el clima de la escena cambia, el resultado queda viciado.
        </p>
      </div>

      {/* Regla Fundamental de Aislamiento */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-start gap-3.5 font-mono-tech text-xs">
        <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-yellow-400 uppercase tracking-widest block">
            CRITERIO DE VALIDEZ DE LABORATORIO:
          </span>
          <p className="text-zinc-300 font-sans-editorial text-xs sm:text-sm leading-relaxed">
            MISMA PC • MISMO ESCENARIO • MISMA DURACIÓN • MISMA CARGA
            <br />
            <strong>CAMBIAR ÚNICAMENTE LA VARIABLE A EVALUAR.</strong>
          </p>
        </div>
      </div>

      {/* Formulario de Parámetros del Entorno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
        {/* Programa o Juego Principal */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-yellow-400 font-bold uppercase flex items-center gap-2">
            {isGamingOrFps ? <Gamepad2 className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span>{isGamingOrFps ? 'JUEGO O MOTOR DE BENCHMARK:' : 'APLICACIÓN O ESCENARIO A EVALUAR:'} *</span>
          </label>
          <input
            type="text"
            value={conditions.gameOrApp}
            onChange={(e) => updateField('gameOrApp', e.target.value)}
            placeholder={isGamingOrFps ? 'ej. Counter-Strike 2 / Valorant / Cyberpunk 2077 Benchmark' : 'ej. Escritorio en reposo / Navegador 20 pestañas / Premiere Pro'}
            className="w-full px-4 py-3 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Escenario o Mapa */}
        <div className="space-y-1">
          <label className="text-zinc-300 font-bold uppercase">ESCENARIO, MAPA O ACCIÓN REPETIBLE:</label>
          <input
            type="text"
            value={conditions.sceneOrMap || ''}
            onChange={(e) => updateField('sceneOrMap', e.target.value)}
            placeholder="ej. Mapa Mirage (zona B sin humo) / Benchmark integrado / 3 min sin mover el mouse"
            className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Duración de cada prueba */}
        <div className="space-y-1">
          <label className="text-zinc-300 font-bold uppercase">DURACIÓN DE CADA PASADA: *</label>
          <input
            type="text"
            value={conditions.duration || ''}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="ej. 3 minutos / 1 recorrido completo de benchmark / 5 min de reposo"
            className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Campos Condicionales para Gaming / Gráficos */}
        {isGamingOrFps && (
          <>
            <div className="space-y-1">
              <label className="text-zinc-400 uppercase">RESOLUCIÓN DE PANTALLA:</label>
              <input
                type="text"
                value={conditions.resolution || ''}
                onChange={(e) => updateField('resolution', e.target.value)}
                placeholder="ej. 1920×1080 (o idéntica en A y B)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase">PRESET GRÁFICO / CALIDAD:</label>
              <input
                type="text"
                value={conditions.quality || ''}
                onChange={(e) => updateField('quality', e.target.value)}
                placeholder="ej. Calidad Competitiva Baja / Ultra / Media"
                className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 uppercase">FPS CAP / V-SYNC ACTUAL:</label>
              <input
                type="text"
                value={conditions.fpsCap || ''}
                onChange={(e) => updateField('fpsCap', e.target.value)}
                placeholder="ej. Sin límite / 144 FPS / V-Sync OFF"
                className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </>
        )}

        {/* Programas abiertos en segundo plano */}
        <div className="space-y-1">
          <label className="text-zinc-400 uppercase">PROGRAMAS ABIERTOS DE FONDO:</label>
          <input
            type="text"
            value={conditions.openPrograms || ''}
            onChange={(e) => updateField('openPrograms', e.target.value)}
            placeholder="ej. Discord y Spotify abiertos / Todo cerrado excepto MSI Afterburner"
            className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Estado de Windows */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-zinc-400 uppercase">ESTADO PREVIO DE WINDOWS / NOTAS:</label>
          <input
            type="text"
            value={conditions.windowsState || ''}
            onChange={(e) => updateField('windowsState', e.target.value)}
            placeholder="ej. PC reiniciada hace 10 minutos, sin descargas activas, plan de energía Equilibrado"
            className="w-full px-4 py-2.5 rounded-xl bg-[#13151f] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER A HIPÓTESIS</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isFormValid
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg hover:shadow-yellow-400/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <span>CONTINUAR A MEDICIÓN A (LÍNEA BASE)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
