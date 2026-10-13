import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Circle,
  Download,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Cpu,
  Layers,
  Gauge,
  Sliders,
  Activity,
  Wrench,
  FileCheck2,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  UserPcSpec,
  Tome01DossierSummary,
  AbLaboratoryReport,
} from '../../types';
import { generateTome01ConsolidatedDossierTxt } from './abExperimentKnowledge';

interface Tome01DossierViewProps {
  specs: Partial<UserPcSpec>;
  summary: Tome01DossierSummary;
  labReport?: AbLaboratoryReport | null;
  onBackToIndex: () => void;
  onReopenLabReport?: () => void;
  onGoToFinalExam?: () => void;
}

export const Tome01DossierView: React.FC<Tome01DossierViewProps> = ({
  specs,
  summary,
  labReport,
  onBackToIndex,
  onReopenLabReport,
  onGoToFinalExam,
}) => {
  const [copied, setCopied] = useState(false);

  const txtDossier = generateTome01ConsolidatedDossierTxt(summary, specs, labReport);

  const handleDownloadTxt = () => {
    const blob = new Blob([txtDossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DOSSIER_EVO_TOMO_01_CONSOLIDADO.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txtDossier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const artifacts = [
    {
      code: 'PASAPORTE EVO (C01)',
      title: 'Identificación Real de Componentes',
      desc: 'CPU, topología de núcleos, módulos RAM, velocidad configurada, GPU y almacenamiento auditados sin adivinanzas.',
      completed: summary.passport,
      icon: Cpu,
    },
    {
      code: 'MAPA DE FLUJO EVO 001 (C02)',
      title: 'Cómo Trabajan los Componentes Juntos',
      desc: 'Ruta de los datos en reposo vs carga, interacción de buses y contención de recursos.',
      completed: summary.flowMap,
      icon: Layers,
    },
    {
      code: 'PERFIL DE FLUIDEZ EVO 001 (C03)',
      title: 'FPS Promedio vs Frametime y 1% Low',
      desc: 'Superación del mito de los FPS promedio. Detección visual y técnica de micro-stuttering.',
      completed: summary.fluidezProfile,
      icon: Gauge,
    },
    {
      code: 'MATRIZ DE LIMITACIÓN EVO 001 (C04)',
      title: 'Encontrá el Límite de tu Sistema',
      desc: 'Diagnóstico del componente limitante (cuello de botella real) mediante escala de carga.',
      completed: summary.limitMatrix,
      icon: Sliders,
    },
    {
      code: 'MAPA DE ACTIVIDAD EVO 001 (C05)',
      title: 'Windows en Movimiento',
      desc: 'Línea base de procesos, servicios y programas de inicio. Identificación de software parásito.',
      completed: summary.activityMap,
      icon: Activity,
    },
    {
      code: 'REGISTRO DE OPTIMIZACIÓN 001 (C05)',
      title: 'Intervención de Software Controlada',
      desc: 'Procedimiento de desactivación seguro, reversible y documentado en reposo.',
      completed: summary.optimizationLog,
      icon: CheckCircle2,
    },
    {
      code: 'EXPEDIENTE DE DIAGNÓSTICO (C06)',
      title: 'Taller EVO // Encontrá la Falla',
      desc: 'Metodología pericial paso a paso: hechos declarados, hipótesis vigentes, pruebas de aislamiento y retest.',
      completed: summary.diagnosticCase,
      icon: Wrench,
    },
    {
      code: 'INFORME DE LABORATORIO A/B (C07)',
      title: 'Optimización Demostrada con Evidencia',
      desc: 'Una prueba, una variable. Mediciones antes y después, deltas matemáticos y juicio crítico.',
      completed: summary.labReport,
      icon: FileCheck2,
    },
  ];

  const completedCount = artifacts.filter((a) => a.completed).length;

  return (
    <div
      id="pantalla-dossier-tomo-01"
      className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 text-white animate-fadeIn"
    >
      {/* Top Banner: Formal Editorial Closing */}
      <header className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#151722] via-[#101117] to-[#0a0b0f] border-2 border-yellow-400 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-yellow-400" />
        </div>

        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <BookOpen className="w-4 h-4" />
          <span>EVO LABS // EXPEDIENTE CONSOLIDADO</span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none text-white">
            TOMO 01 COMPLETADO
          </h1>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-yellow-400 uppercase tracking-wide">
            CONOCÉ TU PC // LABORATORIO FUNDACIONAL
          </h2>

          <p className="font-sans-editorial text-base sm:text-xl text-zinc-200 leading-relaxed pt-2">
            “Empezaste identificando qué había dentro de tu máquina. Terminaste aprendiendo a investigarla. Ahora sabés observar, medir, formular hipótesis, realizar pruebas, comparar resultados y tomar decisiones basadas en evidencia.”
          </p>
        </div>

        {/* Tangible Reward Badge (Editorial, sober, no fake gamification) */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-bold uppercase tracking-wider">
              DOSSIER EVO // TOMO 01
            </span>
            <span className="text-zinc-400">
              {completedCount} de 8 artefactos periciales consolidados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-yellow-400 font-bold uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR DOSSIER (.TXT)</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Grid of 8 Consolidated Artifacts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-mono-tech text-xs text-zinc-400 uppercase tracking-wider">
          <span>ARTEFACTOS DE INVESTIGACIÓN AUDITADOS ({completedCount}/8)</span>
          <span className="text-yellow-400 font-bold">REGISTRO RIGUROSO // TU MÁQUINA REAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-tech text-xs">
          {artifacts.map((art) => (
            <div
              key={art.code}
              className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                art.completed
                  ? 'bg-[#11131b] border-emerald-500/40 shadow-md'
                  : 'bg-black/40 border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      art.completed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    <art.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      {art.code}
                    </span>
                    <h3 className="font-bold text-sm text-white">{art.title}</h3>
                  </div>
                </div>

                {art.completed ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>AUDITADO</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] uppercase shrink-0">
                    PENDIENTE
                  </span>
                )}
              </div>

              <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                {art.desc}
              </p>

              {art.code.includes('C07') && labReport && onReopenLabReport && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={onReopenLabReport}
                    className="text-[11px] text-yellow-400 hover:underline font-bold uppercase inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>CONSULTAR INFORME A/B</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Pasaporte Resumen */}
      <div className="p-6 rounded-3xl bg-[#0e1017] border border-zinc-800 space-y-3 font-mono-tech text-xs">
        <span className="text-yellow-400 uppercase font-bold tracking-widest block text-[11px]">
          RESUMEN TÉCNICO VINCULADO (PASAPORTE EVO):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-zinc-300">
          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase">CPU:</span>
            <strong className="text-white text-xs truncate block">{specs.cpu || 'No registrada'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase">RAM:</span>
            <strong className="text-white text-xs truncate block">{specs.ram || 'No registrada'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase">GPU:</span>
            <strong className="text-white text-xs truncate block">{specs.gpu || 'No registrada'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase">ALMACENAMIENTO:</span>
            <strong className="text-white text-xs truncate block">{specs.storage || 'No registrado'}</strong>
          </div>
        </div>
      </div>

      {/* Puente al Futuro: Previews de Tomo 02 y Mundo EVO */}
      <section className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>ESTO RECIÉN EMPIEZA // PRÓXIMAS PUBLICACIONES</span>
          </div>
          <p className="font-sans-editorial text-sm text-zinc-300">
            Ya conocés tu máquina y sabés cómo opera cada componente. El camino continúa con la investigación a bajo nivel del sistema operativo y la ingeniería aplicada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech">
          {/* Tarjeta Tomo 02 (Preview Bloqueado) */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-3 opacity-90 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">
                PRÓXIMO TOMO // EN PREPARACIÓN
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>BLOQUEADO</span>
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
              TOMO 02 // DOMINÁ WINDOWS
            </h3>

            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              Investigación profunda del sistema operativo: gestión de hilos, planificador de Windows, subsistemas de almacenamiento, mitigación de latencias DPC y seguridad avanzada.
            </p>

            <div className="pt-2 text-[11px] text-zinc-500">
              ESTRENO PRÓXIMO EN EL ECOSISTEMA EVO LABS
            </div>
          </div>

          {/* Tarjeta Mundo EVO Labs (Preview) */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-3 opacity-90 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                ECOSISTEMA EXPANDIDO
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>PRÓXIMAMENTE</span>
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
              EVO LABS // TALLERES AVANZADOS
            </h3>

            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              Laboratorios de arquitectura experimental, perfiles de memoria sub-timings, análisis térmico de gabinetes y construcción de bancos de pruebas para entusiastas e ingenieros.
            </p>

            <div className="pt-2 text-[11px] text-zinc-500">
              CONTENIDO EDITORIAL EN DESARROLLO
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA to return to index or take final exam */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800">
        <span className="font-mono-tech text-xs text-zinc-400">
          Tomo 01 completado formalmente. Tu progreso está guardado en este equipo.
        </span>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onBackToIndex}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>ÍNDICE DEL TOMO 01</span>
          </button>

          {onGoToFinalExam && (
            <button
              type="button"
              onClick={onGoToFinalExam}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-yellow-400/20"
            >
              <span>RENDIR PRUEBA FINAL EVO (70%) →</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
