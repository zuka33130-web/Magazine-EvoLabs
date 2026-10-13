import React from 'react';
import {
  Compass,
  CheckCircle2,
  BookOpen,
  Zap,
  Gauge,
  Monitor,
  Bot,
  Trophy,
  FileCheck2,
  Activity,
  Layers,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';

interface EvoPublicHowToUseProps {
  onNavigateTomos: () => void;
  onNavigateLabs: () => void;
  onNavigateTools: () => void;
  onNavigateAnalyze: () => void;
  onNavigateMiEvo: () => void;
}

export const EvoPublicHowToUse: React.FC<EvoPublicHowToUseProps> = ({
  onNavigateTomos,
  onNavigateLabs,
  onNavigateTools,
  onNavigateAnalyze,
  onNavigateMiEvo,
}) => {
  const methodSteps = [
    { step: '01', verb: 'OBSERVAR', desc: 'Identificá el síntoma en el sistema o hardware sin prejuicios ni suposiciones previas.' },
    { step: '02', verb: 'ENTENDER', desc: 'Comprendé los buses, dependencias y protocolos de silicio que interactúan en la falla.' },
    { step: '03', verb: 'HIPOTETIZAR', desc: 'Formulá una causa probable basada en la física de los componentes y el Kernel NT.' },
    { step: '04', verb: 'INTERVENIR', desc: 'Realizá una sola modificación controlada en el banco de pruebas o configuración.' },
    { step: '05', verb: 'MEDIR', desc: 'Registrá la variable con instrumental metrológico real en tiempo exacto.' },
    { step: '06', verb: 'COMPARAR', desc: 'Contrastá la medición contra la línea de base original o valores de referencia nominales.' },
    { step: '07', verb: 'COMPROBAR', desc: 'Validá si la hipótesis se demostró con rigor empírico o fue refutada.' },
    { step: '08', verb: 'DOCUMENTAR', desc: 'Registrá el hallazgo en el expediente pericial con procedencia de datos garantizada.' },
    { step: '09', verb: 'TRANSFERIR', desc: 'Aplicá el principio a nuevos escenarios, arquitecturas y diagnósticos del mundo real.' },
  ];

  const operationalPillars = [
    {
      step: '1',
      title: 'CÓMO APRENDER // 12 TOMOS CANÓNICOS',
      color: 'text-amber-400',
      badge: 'TOMOS',
      desc: 'Accedé a los 12 tomos canónicos. Cada tomo desglosa arquitectura de silicio, kernel, subsistemas y fallas reales.',
      actionLabel: 'IR A TOMOS →',
      onAction: onNavigateTomos,
    },
    {
      step: '2',
      title: 'CÓMO EXPERIMENTAR // LABORATORIOS & SIMULADORES',
      color: 'text-cyan-400',
      badge: 'LABORATORIOS',
      desc: 'Experimentá en bancos de trabajo reales como Hot-Swap Lab, Windows Matrix Lab y Boot Lab para validar hipótesis de hardware.',
      actionLabel: 'IR A LABORATORIOS →',
      onAction: onNavigateLabs,
    },
    {
      step: '3',
      title: 'CÓMO USAR // HERRAMIENTAS TÉCNICAS',
      color: 'text-emerald-400',
      badge: 'HERRAMIENTAS',
      desc: 'Utilizá el instrumental metrológico independiente: calculador de latencias en nanosegundos, auditor de servicios NT y telemetría.',
      actionLabel: 'VER HERRAMIENTAS →',
      onAction: onNavigateTools,
    },
    {
      step: '4',
      title: 'CÓMO ANALIZAR // TU PROPIA PC',
      color: 'text-purple-400',
      badge: 'ANALIZAR',
      desc: 'Ejecutá el motor pericial de diagnóstico seguro para auditar tu procesador, memorias, almacenamiento y coherencia térmica.',
      actionLabel: 'ANALIZAR MI PC →',
      onAction: onNavigateAnalyze,
    },
    {
      step: '5',
      title: 'CÓMO CONSULTAR // TUTOR EVO',
      color: 'text-pink-400',
      badge: 'TUTOR CONTEXTUAL',
      desc: 'El Tutor EVO te acompaña en cada tomo, laboratorio y diagnóstico, guiándote en la formulación de hipótesis sin dar respuestas servidas.',
      actionLabel: 'CONSULTAR EN APP',
      onAction: onNavigateTomos,
    },
    {
      step: '6',
      title: 'EVIDENCIA & PROGRESO // MI EVO',
      color: 'text-blue-400',
      badge: 'EXPEDIENTE TÉCNICO',
      desc: 'Tus exámenes finales aprobados, diagnósticos validados y horas de laboratorio quedan acreditados en tu pasaporte pericial único.',
      actionLabel: 'VER MI EVO →',
      onAction: onNavigateMiEvo,
    },
  ];

  const ecosystemEngines = [
    { name: 'EVO CORE', role: 'Motor pericial de simulación y diagnóstico de circuitos y buses.', status: 'ACTIVO', where: 'Analizar mi PC / Labs' },
    { name: 'EVO AGENT & TUTOR', role: 'Asistente técnico transversal para interpretación de esquemáticos.', status: 'ACTIVO', where: 'Toda la plataforma' },
    { name: 'INTERACTIVE DIGITAL TWIN', role: 'Modelo gemelo digital de hardware con pasaporte técnico.', status: 'ACTIVO', where: 'Mi EVO / Pasaporte' },
    { name: 'SKILL GRAPH & ADAPTIVE PATH', role: 'Grafo de habilidades y rutas formativas dinámicas.', status: 'ACTIVO', where: 'Campus / Escuela' },
    { name: 'CASE & FORENSIC ENGINE', role: 'Repositorio de casos periciales reales y generador forense.', status: 'ACTIVO', where: 'Consola técnica' },
    { name: 'EVIDENCE & TELEMETRY INTEGRITY', role: 'Validación estricta de telemetría SYSTEM_REPORTED vs UNKNOWN.', status: 'ACTIVO', where: 'Analizar mi PC / Exámenes' },
  ];

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* HEADER PRINCIPAL */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-mono-tech tracking-widest text-amber-400 uppercase font-black">
            METODOLOGÍA Y GUÍA OPERATIVA
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          CÓMO FUNCIONA EVO LABS
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-2xl">
          Conocé el método pericial de 9 pasos, los 6 pilares de uso operativo y la arquitectura completa del ecosistema técnico.
        </p>
      </div>

      {/* GUÍA OPERATIVA: 6 PILARES CON ACCESO DIRECTO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
            GUÍA OPERATIVA // PASO A PASO
          </h2>
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">6 PUERTAS DE ACCESO</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono-tech text-xs">
          {operationalPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${p.color}`}>{p.badge}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">0{p.step}</span>
                </div>
                <h3 className="font-display font-bold text-sm text-white uppercase">{p.title}</h3>
                <p className="text-zinc-300 font-sans-editorial leading-relaxed text-xs">
                  {p.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={p.onAction}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{p.actionLabel}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* EL MÉTODO EVO: 9 PASOS CIENTÍFICOS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tech text-amber-400 font-black uppercase tracking-widest">
            METODOLOGÍA DE INGENIERÍA
          </span>
        </div>
        <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
          EL MÉTODO EVO // 9 PASOS PERICIALES
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial max-w-2xl">
          El proceso riguroso aplicado en cada laboratorio para aislar síntomas, medir magnitudes físicas y comprobar hipótesis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono-tech text-xs pt-2">
          {methodSteps.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5 shadow-md">
              <span className="text-[10px] text-zinc-500 font-mono block font-black">FASE {m.step}</span>
              <strong className="text-amber-400 text-sm block font-display uppercase">{m.verb}</strong>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ECOSISTEMA EVO: MATRIZ DE MOTORES Y SERVICIOS */}
      <div className="space-y-4 pt-2">
        <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
          ECOSISTEMA EVO // MOTORES Y CAPACIDADES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-tech text-xs">
          {ecosystemEngines.map((eng, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm uppercase">{eng.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                  {eng.status}
                </span>
              </div>
              <p className="text-zinc-300 font-sans-editorial text-xs">{eng.role}</p>
              <div className="text-[10px] text-zinc-500 border-t border-zinc-900 pt-1.5">
                Ubicación: <strong className="text-zinc-400">{eng.where}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
