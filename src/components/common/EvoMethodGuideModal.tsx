import React from 'react';
import {
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';
import {
  EvoMethodEngine,
  EVO_METHOD_STAGES,
} from '../../services/evoMethodEngine';

interface EvoMethodGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvoMethodGuideModal: React.FC<EvoMethodGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#080a10] border border-amber-500/40 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                CANON METROLÓGICO // FASE 08
              </span>
              <h2 className="text-lg font-bold text-white font-mono">
                EVO METHOD: PROTOCOLO UNIVERSAL DE APRENDIZAJE TÉCNICO
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {/* Manifesto Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-bold text-sm text-amber-300 font-mono">
              "No se adivina. Se mide. Si no podés transferirlo a un problema nuevo, no lo entendiste."
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed">
              El <strong>EVO METHOD</strong> es la metodología epistemológica de EVO LABS. Convierte cualquier problema técnico
              (hardware, Windows, redes, ciberseguridad, programación, IA o electrónica) en un ciclo reproducible de 9 etapas.
            </p>
          </div>

          {/* 9 Stages Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
              El Ciclo de 9 Etapas:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EVO_METHOD_STAGES.map((st) => (
                <div
                  key={st.stage}
                  className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${st.color}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs uppercase">{st.label}</span>
                      <span className="text-[9px] font-mono opacity-70">Paso {st.order}/9</span>
                    </div>
                    <div className="text-[11px] font-bold text-zinc-200">{st.tagline}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{st.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] font-mono italic text-zinc-300">
                    "{st.keyQuestion}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Rule of Transfer */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300 text-xs uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              La Regla de Oro de la Transferencia
            </div>
            <p className="text-zinc-200 leading-relaxed text-xs">
              La fase 9 (<strong>TRANSFERIR</strong>) no es un trámite de cierre. Es la prueba definitiva: comprobar si el estudiante
              es capaz de extrapolar la ley física o lógica aprendida a una arquitectura o escenario que jamás vio antes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#06080d] border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>DOCUMENTO CANÓNICO EVO_METHOD.md V1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
