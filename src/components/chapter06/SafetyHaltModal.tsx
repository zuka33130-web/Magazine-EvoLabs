import React from 'react';
import { AlertTriangle, PowerOff, ShieldAlert, ZapOff } from 'lucide-react';

interface SafetyHaltModalProps {
  reason: string;
  onDismiss: () => void;
}

export const SafetyHaltModal: React.FC<SafetyHaltModalProps> = ({ reason, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        id="alerta-seguridad-critica-taller"
        className="max-w-xl w-full rounded-3xl bg-[#14080a] border-2 border-rose-600 p-6 sm:p-8 shadow-2xl space-y-6 text-white"
      >
        <div className="flex items-center gap-3 text-rose-500">
          <ShieldAlert className="w-10 h-10 animate-pulse text-rose-500 flex-shrink-0" />
          <div>
            <span className="font-mono-tech text-xs tracking-widest uppercase font-bold text-rose-400 block">
              PROTOCOLO DE SEGURIDAD CRÍTICA // PARADA INMEDIATA
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              DETENER INVESTIGACIÓN
            </h2>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 font-mono-tech text-xs text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300 uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>CONDICIÓN DETECTADA: {reason.toUpperCase()}</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-sm leading-relaxed">
            Se ha detectado un indicio de riesgo físico, térmico severo o eléctrico.
            En EVO LABS la regla suprema es la integridad física del usuario y la preservación del hardware.
          </p>
        </div>

        <div className="space-y-3 font-mono-tech text-xs text-zinc-300">
          <span className="font-bold text-white uppercase block tracking-wider">
            ACCIONES INMEDIATAS OBLIGATORIAS:
          </span>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/60 border border-zinc-800">
              <PowerOff className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">1. APAGAR INMEDIATAMENTE</strong>
                <p className="text-zinc-400 text-[11px]">
                  Presioná el botón de encendido 5 segundos o apagá la tecla trasera (I/O) de la fuente de poder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/60 border border-zinc-800">
              <ZapOff className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">2. DESCONECTAR DE LA PARED</strong>
                <p className="text-zinc-400 text-[11px]">
                  Desenchufá el cable de alimentación directamente del tomacorriente de la pared.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/60 border border-zinc-800">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">3. NO REPETIR ENCENDIDOS NI PRUEBAS</strong>
                <p className="text-zinc-400 text-[11px]">
                  No ejecutes pruebas de software ni intentes encenderlo mientras persista la sospecha de cortocircuito, líquido o sobrecalentamiento extremo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold uppercase transition-colors shadow-lg cursor-pointer"
          >
            ENTENDIDO // EQUIPO APAGADO CON SEGURIDAD
          </button>
        </div>
      </div>
    </div>
  );
};
