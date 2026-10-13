import React from 'react';
import {
  Sparkles,
  Award,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface TutorPreFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'EXAM' | 'LAB';
  tomoTitle?: string;
}

export const TutorPreFlightModal: React.FC<TutorPreFlightModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  tomoTitle = 'Tomo 01 // Conocé tu PC',
}) => {
  if (!isOpen) return null;

  const isExam = type === 'EXAM';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isExam ? 'Guía Previa al Examen Final' : 'Guía Previa al Laboratorio'}
      className="fixed inset-0 z-[145] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans-editorial select-none"
    >
      <div className="bg-[#0b0f19] border border-zinc-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            isExam ? 'bg-amber-500/15' : 'bg-cyan-500/15'
          }`}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isExam
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
            }`}
          >
            {isExam ? <Award className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
          </div>
          <div>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                isExam ? 'text-amber-400' : 'text-cyan-400'
              }`}
            >
              ORIENTACIÓN TUTOR EVO // {isExam ? 'EXAMEN FINAL' : 'LABORATORIO VIRTUAL'}
            </span>
            <h3 className="text-xl font-extrabold text-white">{tomoTitle}</h3>
          </div>
        </div>

        {isExam ? (
          /* EXAM PRE-FLIGHT */
          <div className="space-y-4 pt-2">
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              Antes de comenzar, Tutor EVO te explica cómo funciona la comprobación pericial:
            </p>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Qué se evalúa:</strong> Razonamiento real, interpretación de telemetría y diagnósticos de silicio (no memoria vacía).
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Formato:</strong> 15 preguntas aleatorias seleccionadas del banco oficial de 30 preguntas del Tomo.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Aprobación:</strong> Con 75% o más alcanzás la distinción EVO <strong className="text-emerald-400">“TEORÍA COMPROBADA”</strong>.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Sin límite de intentos:</strong> Si necesitás repasar, Tutor EVO te indicará exactamente qué capítulos revisar.
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConfirm();
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>COMENZAR EXAMEN FINAL</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        ) : (
          /* LAB PRE-FLIGHT */
          <div className="space-y-4 pt-2">
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              Antes de ingresar al laboratorio, Tutor EVO te da el marco metodológico:
            </p>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">¿Qué es?</strong> Banco virtual de pruebas donde podés intercambiar procesadores, tarjetas gráficas y memorias.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">¿Qué vas a hacer?</strong> Probar configuraciones balanceadas y desbalanceadas para observar cuellos de botella en vivo.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Qué observar:</strong> Frametimes, frecuencias efectivas de reloj, temperaturas y utilización porcentual.
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConfirm();
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>INGRESAR AL LABORATORIO</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
