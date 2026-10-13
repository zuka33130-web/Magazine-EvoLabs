import React from 'react';
import { ToggleLeft, ArrowRight, ArrowLeft, ShieldAlert, Undo2, Check } from 'lucide-react';
import { AbControlledVariable } from '../../types';

interface Phase05ControlledChangeStationProps {
  controlledVariable: AbControlledVariable;
  onChangeVariable: (variable: AbControlledVariable) => void;
  onBack: () => void;
  onNext: () => void;
}

const VARIABLE_PRESETS = [
  'FPS CAP (Limitador de cuadros)',
  'Resolución de renderizado',
  'Preset de calidad gráfica específica (ej. Sombras / Texturas)',
  'Cerrar programa pesado en segundo plano (Navegador / Discord)',
  'Deshabilitar aplicación del Inicio de Windows',
  'Pausar sincronización en segundo plano (OneDrive / Drive)',
  'Modo de baja latencia / Reflex / Anti-Lag',
  'Ajuste de sincronización vertical (V-Sync)',
  'Otro ajuste puntual',
];

export const Phase05ControlledChangeStation: React.FC<Phase05ControlledChangeStationProps> = ({
  controlledVariable,
  onChangeVariable,
  onBack,
  onNext,
}) => {
  const updateField = (field: keyof AbControlledVariable, val: any) => {
    onChangeVariable({
      ...controlledVariable,
      [field]: val,
    });
  };

  const isFormValid =
    controlledVariable.variableType.trim().length >= 2 &&
    controlledVariable.beforeState.trim().length >= 2 &&
    controlledVariable.changeApplied.trim().length >= 2 &&
    controlledVariable.howToRevert.trim().length >= 2;

  return (
    <section
      id="fase-05-cambio-controlado-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <ToggleLeft className="w-4 h-4 text-yellow-400" />
          <span>FASE 05 // CAMBIO CONTROLADO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          LA VARIABLE QUE VAMOS A MODIFICAR
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Ahora que la línea base está registrada, aplicá <strong>un solo cambio</strong> en tu sistema. Todo lo demás debe permanecer exactamente igual.
        </p>
      </div>

      {/* Regla de Seguridad EVO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3.5 font-mono-tech text-xs">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-red-400 uppercase tracking-widest block">
            PROTOCOLO DE SEGURIDAD EVO // CAMBIOS PROHIBIDOS:
          </span>
          <p className="text-zinc-300 font-sans-editorial text-xs sm:text-sm leading-relaxed">
            No aceptamos cambios destructivos o irreversibles: <strong>NO</strong> desactivar antivirus o firewall de Windows, <strong>NO</strong> tocar voltajes ni overclocking riesgoso, <strong>NO</strong> flashear BIOS innecesariamente, <strong>NO</strong> usar "optimizadores" mágicos o limpiadores de registro, y <strong>NO</strong> eliminar servicios críticos del sistema operativo.
          </p>
        </div>
      </div>

      {/* Selección de Tipo de Variable */}
      <div className="space-y-3">
        <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
          SELECCIONÁ O ESCRIBÍ LA VARIABLE A MODIFICAR: *
        </span>

        <div className="flex flex-wrap gap-2">
          {VARIABLE_PRESETS.map((preset) => {
            const isSelected = controlledVariable.variableType === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => updateField('variableType', preset)}
                className={`px-3.5 py-2 rounded-xl border font-mono-tech text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-black font-bold border-yellow-400 shadow-md'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>

        {controlledVariable.variableType === 'Otro ajuste puntual' && (
          <input
            type="text"
            value={controlledVariable.customName || ''}
            onChange={(e) => updateField('customName', e.target.value)}
            placeholder="Especificá qué variable vas a modificar..."
            className="w-full px-4 py-3 rounded-xl bg-[#141622] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400 mt-2"
          />
        )}
      </div>

      {/* Formulario Antes vs Cambio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
        <div className="space-y-1.5 p-4 rounded-2xl bg-black/40 border border-zinc-800">
          <label className="text-zinc-400 uppercase font-bold block">
            ESTADO DE LA VARIABLE EN MEDICIÓN A (ANTES): *
          </label>
          <input
            type="text"
            value={controlledVariable.beforeState}
            onChange={(e) => updateField('beforeState', e.target.value)}
            placeholder="ej. FPS sin límite / 1920×1080 / Discord abierto con hardware acceleration"
            className="w-full px-4 py-2.5 rounded-xl bg-[#141620] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="space-y-1.5 p-4 rounded-2xl bg-black/40 border border-zinc-800">
          <label className="text-yellow-400 uppercase font-bold block">
            CAMBIO APLICADO PARA MEDICIÓN B (DESPUÉS): *
          </label>
          <input
            type="text"
            value={controlledVariable.changeApplied}
            onChange={(e) => updateField('changeApplied', e.target.value)}
            placeholder="ej. FPS limitados a 144 / 1280×720 / Discord totalmente cerrado"
            className="w-full px-4 py-2.5 rounded-xl bg-[#141620] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Reversibilidad y Plan de Retorno */}
      <div className="p-5 rounded-2xl bg-[#131520] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="space-y-0.5">
            <span className="text-white font-bold uppercase block">
              ¿ESTE CAMBIO ES COMPLETAMENTE REVERSIBLE?
            </span>
            <span className="text-zinc-400 text-[11px] font-sans-editorial">
              Un científico siempre puede volver al estado inicial si la prueba falla.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateField('reversible', true)}
              className={`px-4 py-1.5 rounded-lg border font-bold cursor-pointer ${
                controlledVariable.reversible
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-black/40 text-zinc-500 border-zinc-800'
              }`}
            >
              SÍ, ES REVERSIBLE
            </button>
            <button
              type="button"
              onClick={() => updateField('reversible', false)}
              className={`px-4 py-1.5 rounded-lg border font-bold cursor-pointer ${
                !controlledVariable.reversible
                  ? 'bg-red-500/20 text-red-300 border-red-500/50'
                  : 'bg-black/40 text-zinc-500 border-zinc-800'
              }`}
            >
              NO REVERSIBLE
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-yellow-400 font-bold uppercase flex items-center gap-2">
            <Undo2 className="w-4 h-4" />
            <span>CÓMO VOLVER ATRÁS (PASO A PASO EXACTO): *</span>
          </label>
          <input
            type="text"
            value={controlledVariable.howToRevert}
            onChange={(e) => updateField('howToRevert', e.target.value)}
            placeholder="ej. En opciones de video volver a seleccionar Sin Límite / Reabrir Discord desde el escritorio"
            className="w-full px-4 py-2.5 rounded-xl bg-[#141620] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
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
          <span>VOLVER A MEDICIÓN A</span>
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
          <span>CONTINUAR A MEDICIÓN B</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
