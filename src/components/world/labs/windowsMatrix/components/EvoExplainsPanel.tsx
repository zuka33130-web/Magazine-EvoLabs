// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// EVO EXPLAINS PANEL — PEDAGOGICAL ENGINE (6 CORE QUESTIONS & 3 DEPTH TIERS)
// Answers: 1. Qué veo, 2. Qué pasa, 3. Por qué, 4. Cómo compruebo, 5. Qué pasa si cambio, 6. Cómo vuelvo
// ============================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Terminal,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Info,
  Layers,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface EvoExplainsPanelProps {
  stepTitle: string;
  simpleExplanation: string;
  deepArchitecture: string;
  rightNowAction: string;
  processOrFile: string;
  inputRequirements: string;
  outputArtifact: string;
  failureSymptom: string;
  verificationCommand: string;
  verificationExpected: string;
  analogicQuestion?: string;
  onOpenGlossaryTerm?: (term: string) => void;
  onOpenSimpleTutor?: () => void;
  onCopySnippet?: (text: string) => void;
  copiedSnippet?: string | null;
  className?: string;
}

export type DepthLevel = 'ENTENDER' | 'PROFUNDIZAR' | 'HACER';

export const EvoExplainsPanel: React.FC<EvoExplainsPanelProps> = ({
  stepTitle,
  simpleExplanation,
  deepArchitecture,
  rightNowAction,
  processOrFile,
  inputRequirements,
  outputArtifact,
  failureSymptom,
  verificationCommand,
  verificationExpected,
  analogicQuestion,
  onOpenGlossaryTerm,
  onOpenSimpleTutor,
  onCopySnippet,
  copiedSnippet,
  className = ''
}) => {
  const [depth, setDepth] = useState<DepthLevel>('ENTENDER');
  const [localCopied, setLocalCopied] = useState<boolean>(false);

  const isCopied = copiedSnippet === verificationCommand || localCopied;

  const handleCopy = () => {
    if (onCopySnippet) {
      onCopySnippet(verificationCommand);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(verificationCommand);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#0a0d14]/95 border border-cyan-900/60 shadow-2xl flex flex-col justify-between font-sans-editorial select-none space-y-4 ${className}`}>
      {/* Top Header & Depth Selector Controls */}
      <div className="space-y-3 border-b border-cyan-950 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]" />
            <span className="font-mono-tech text-xs font-bold text-cyan-400 uppercase tracking-widest">
              EVO EXPLICA // TUTOR PEDAGÓGICO
            </span>
          </div>

          {/* Simple Tutor Button */}
          {onOpenSimpleTutor && (
            <button
              type="button"
              onClick={onOpenSimpleTutor}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono-tech font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>EXPLICÁMELO SIMPLE</span>
            </button>
          )}
        </div>

        {/* 3-Tier Depth Selector Buttons */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-xl border border-cyan-950 font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setDepth('ENTENDER')}
            className={`py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
              depth === 'ENTENDER'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ENTENDER
          </button>
          <button
            type="button"
            onClick={() => setDepth('PROFUNDIZAR')}
            className={`py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
              depth === 'PROFUNDIZAR'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            PROFUNDIZAR
          </button>
          <button
            type="button"
            onClick={() => setDepth('HACER')}
            className={`py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
              depth === 'HACER'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            HACER
          </button>
        </div>
      </div>

      {/* Dynamic Content based on selected Depth */}
      <div className="flex-1 space-y-3.5 text-xs overflow-y-auto max-h-[400px] pr-1">
        {/* TIER 1: ENTENDER (Simple, No Jargon, Real Analogy) */}
        {depth === 'ENTENDER' && (
          <div className="space-y-3">
            {/* 1. ¿Qué estoy viendo? */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-950 space-y-1">
              <span className="text-[10.5px] font-mono-tech font-bold text-cyan-400 uppercase tracking-wider block">
                1. ¿QUÉ ESTOY VIENDO?
              </span>
              <h4 className="text-white font-bold text-sm font-display tracking-tight">
                {stepTitle}
              </h4>
              <p className="text-zinc-300 text-xs leading-relaxed pt-1">
                {simpleExplanation}
              </p>
            </div>

            {/* 2. ¿Qué está pasando ahora mismo? */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <span className="text-[10.5px] font-mono-tech font-bold text-cyan-300 uppercase tracking-wider block">
                2. ¿QUÉ ESTÁ PASANDO ADENTRO?
              </span>
              <p className="text-zinc-200 text-xs leading-relaxed">
                {rightNowAction}
              </p>
            </div>

            {/* 3. Pregunta orientadora */}
            {analogicQuestion && (
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 space-y-1">
                <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-wider block">
                  PREGUNTA CLAVE DE REFLEXIÓN:
                </span>
                <p className="text-[11.5px] italic text-zinc-200 leading-snug">
                  “{analogicQuestion}”
                </p>
              </div>
            )}
          </div>
        )}

        {/* TIER 2: PROFUNDIZAR (Kernel Architecture, Syscalls, Binaries) */}
        {depth === 'PROFUNDIZAR' && (
          <div className="space-y-3">
            {/* Architecture Card */}
            <div className="p-3.5 rounded-xl bg-black/80 border border-cyan-950 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400 border-b border-cyan-950 pb-1">
                <span className="font-bold">ARQUITECTURA DE BAJO NIVEL</span>
                <span className="text-zinc-400">{processOrFile}</span>
              </div>
              <p className="text-zinc-200 text-xs font-sans-editorial leading-relaxed">
                {deepArchitecture}
              </p>
            </div>

            {/* In / Out Specs */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono-tech">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
                <span className="text-cyan-400 font-bold block uppercase text-[9.5px]">ENTRADA (INPUT):</span>
                <p className="text-zinc-300 font-sans-editorial text-[10.5px] leading-tight">
                  {inputRequirements}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1">
                <span className="text-emerald-400 font-bold block uppercase text-[9.5px]">SALIDA (OUTPUT):</span>
                <p className="text-zinc-300 font-sans-editorial text-[10.5px] leading-tight">
                  {outputArtifact}
                </p>
              </div>
            </div>

            {/* If it fails */}
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-200 space-y-1">
              <span className="text-[10px] font-mono-tech text-rose-400 font-bold uppercase tracking-wider block">
                SI ESTE COMPONENTE FALLA (SÍNTOMA):
              </span>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-snug">
                {failureSymptom}
              </p>
            </div>
          </div>
        )}

        {/* TIER 3: HACER (Commands, Proof of Fix, Verification) */}
        {depth === 'HACER' && (
          <div className="space-y-3">
            {/* Terminal Command for Verification */}
            <div className="p-3.5 rounded-xl bg-[#060810] border border-cyan-900/80 font-mono-tech text-xs space-y-2">
              <div className="flex items-center justify-between text-cyan-400 pb-1 border-b border-cyan-950">
                <span className="font-bold flex items-center gap-1.5 text-[11px]">
                  <Terminal className="w-3.5 h-3.5" />
                  ORDEN DE COMPROBACIÓN REAL
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 text-[10px] font-bold border border-cyan-500/40 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-2.5 rounded bg-black/90 text-cyan-300 text-xs overflow-x-auto select-all leading-tight border border-cyan-950">
                <code>{verificationCommand}</code>
              </pre>

              <div className="space-y-1 pt-1 text-[11px] font-sans-editorial">
                <strong className="text-cyan-300 font-mono-tech text-[10px] block uppercase">
                  RESULTADO ESPERADO EN MÁQUINA SALUDABLE:
                </strong>
                <p className="text-zinc-300 leading-snug">{verificationExpected}</p>
              </div>
            </div>

            {/* Forensic Rule */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/60 text-xs font-mono-tech">
              <span className="text-cyan-400 font-bold block mb-0.5 text-[10.5px]">
                REGLA DE VERIFICACIÓN FORENSE:
              </span>
              <p className="text-zinc-300 text-[11px] font-sans-editorial leading-snug">
                Nunca des por sentado que una falla se arregló sin ejecutar la orden de comprobación y contrastar el valor numérico devuelto.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Term Glossary Opener */}
      <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[10.5px] font-mono-tech">
        <span className="text-zinc-400">
          ¿Encontraste una palabra que no conocés?
        </span>
        {onOpenGlossaryTerm && (
          <button
            type="button"
            onClick={() => onOpenGlossaryTerm(stepTitle)}
            className="text-cyan-400 hover:text-cyan-300 font-bold uppercase underline cursor-pointer"
          >
            [ ¿QUÉ SIGNIFICA? ]
          </button>
        )}
      </div>
    </div>
  );
};
