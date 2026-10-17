import React, { useState } from "react";
import {
  Award,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  FileCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
  HardDrive,
  Copy,
  Check,
} from "lucide-react";

export const Sector39VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "CAPSTONE_10_PHASES" | "DELTA_CALCULATOR" | "DOSSIER_PREVIEW"
  >("CAPSTONE_10_PHASES");

  // State for Delta Calculator
  const [metricName, setMetricName] = useState<string>("Tiempo de Arranque (segundos)");
  const [preValue, setPreValue] = useState<number>(68);
  const [postValue, setPostValue] = useState<number>(14);

  // State for Phase stepper
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const phases = [
    { num: 1, title: "Captura de Baseline Inicial", tag: "PUNTO CERO", desc: "Muestreo inmutable de 60 segundos con typeperf/logman de CPU, RAM, Disco y Red en reposo." },
    { num: 2, title: "Identificación de Restricción", tag: "CUELLO DE BOTELLA", desc: "Aislamiento matemático del único recurso saturado (>90%) según la Teoría de Restricciones." },
    { num: 3, title: "Formulación de Hipótesis", tag: "HIPÓTESIS CAUSAL", desc: "Declaración falsable formal que vincula el síntoma al mecanismo de bajo nivel de Windows." },
    { num: 4, title: "Análisis de Dependencias", tag: "RIESGOS & SCM", desc: "Inspección de árboles de dependientes y servicios para prevenir daños colaterales." },
    { num: 5, title: "Intervención Única", tag: "VARIABLE AISLADA", desc: "Aplicación de un solo cambio precedido de snapshot VSS y respaldo de registro .reg." },
    { num: 6, title: "Segunda Medición de Carga", tag: "POST-INTERVENCIÓN", desc: "Repetición del test idéntico bajo las mismas condiciones exactas de temperatura y carga." },
    { num: 7, title: "Cálculo de Delta", tag: "Δ MATEMÁTICO", desc: "Determinación de la diferencia neta: Δ = Métrica_Post - Métrica_Pre y porcentaje relativo." },
    { num: 8, title: "Veredicto Pericial", tag: "CLASIFICACIÓN", desc: "Dictamen empírico formal: Éxito comprobado (>15%), Intervención inocua o Placebo." },
    { num: 9, title: "Protocolo de Reversión", tag: "DEUDA CERO", desc: "Rollback inmediato si el delta es nulo, negativo o introduce inestabilidades secundarias." },
    { num: 10, title: "Expediente Windows EVO 001", tag: "CERTIFICADO SHA-256", desc: "Sellado criptográfico y entrega formal de la pericia documentada al cliente." },
  ];

  // Delta calculation
  const deltaNet = postValue - preValue;
  const isLowerBetter = !metricName.toLowerCase().includes("iops") && !metricName.toLowerCase().includes("fps") && !metricName.toLowerCase().includes("libre");
  const improvementPct = isLowerBetter
    ? ((preValue - postValue) / preValue) * 100
    : ((postValue - preValue) / preValue) * 100;

  let verdict = "PLACEBO / INOCUA";
  let verdictColor = "text-amber-400 border-amber-500/30 bg-amber-950/20";
  if (improvementPct >= 15) {
    verdict = "ÉXITO COMPROBADO";
    verdictColor = "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";
  } else if (improvementPct <= -10) {
    verdict = "DEGRADACIÓN DETECTADA";
    verdictColor = "text-rose-400 border-rose-500/40 bg-rose-950/20";
  }

  return (
    <div className="bg-[#0B0F17] border border-cyan-500/20 rounded-2xl p-6 font-mono text-xs text-zinc-300 my-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            SECTOR 39 // CAPSTONE FORENSE: EL MÉTODO CIENTÍFICO APLICADO
          </span>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Laboratorio Capstone: Auditoría de 10 Fases y Veredicto</span>
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("CAPSTONE_10_PHASES")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "CAPSTONE_10_PHASES"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Las 10 Fases
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DELTA_CALCULATOR")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "DELTA_CALCULATOR"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Calculadora de Delta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DOSSIER_PREVIEW")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "DOSSIER_PREVIEW"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Expediente EVO 001
          </button>
        </div>
      </div>

      {activeTab === "CAPSTONE_10_PHASES" && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-400">
            Haga clic en cualquiera de las fases para inspeccionar su requerimiento pericial:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {phases.map((p, idx) => {
              const isSel = idx === activePhaseIndex;
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? "bg-cyan-950/50 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-cyan-400">Fase {p.num}</span>
                    <span className="text-[9px] px-1 rounded bg-black/50 text-zinc-400">{p.tag}</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{p.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Card */}
          {(() => {
            const p = phases[activePhaseIndex];
            return (
              <div className="p-5 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block">
                      FASE {p.num} DE 10 // {p.tag}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">{p.title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
                    MÉTODO CIENTÍFICO
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{p.desc}</p>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "DELTA_CALCULATOR" && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-400">
            Ingrese los valores de línea base inicial (Pre) y la segunda medición (Post) para evaluar el veredicto matemático:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Métrica a Evaluar
              </label>
              <select
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                className="w-full p-2 rounded-lg bg-black border border-zinc-700 text-xs text-white"
              >
                <option value="Tiempo de Arranque (segundos)">Tiempo de Arranque (s)</option>
                <option value="Cola Promedio de Disco (Queue)">Cola de Disco (Queue)</option>
                <option value="Latencia DPC (microsegundos)">Latencia DPC (µs)</option>
                <option value="Memoria Libre (MB)">Memoria Libre (MB)</option>
                <option value="Tasa de IOPS">Tasa de IOPS</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Medición Inicial (Pre / Baseline)
              </label>
              <input
                type="number"
                value={preValue}
                onChange={(e) => setPreValue(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-black border border-zinc-700 text-xs text-white font-mono"
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 block">
                Segunda Medición (Post / Test)
              </label>
              <input
                type="number"
                value={postValue}
                onChange={(e) => setPostValue(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-black border border-zinc-700 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Verdict Box */}
          <div className={`p-5 rounded-xl border ${verdictColor} flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div>
              <span className="text-[10px] uppercase font-bold block mb-1">
                VEREDICTO PERICIAL AUTOMÁTICO:
              </span>
              <div className="text-base sm:text-lg font-bold">{verdict}</div>
              <div className="text-xs opacity-90 mt-1">
                Delta Neto: {deltaNet > 0 ? `+${deltaNet}` : deltaNet} | Variación Relativa: {improvementPct.toFixed(1)}%
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold block text-zinc-400 mb-0.5">
                Acción Obligatoria:
              </span>
              <div className="text-xs font-bold text-white">
                {verdict === "ÉXITO COMPROBADO" ? "Conservar cambio y emitir expediente" : "Ejecutar Protocolo de Reversión (Fase 9)"}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "DOSSIER_PREVIEW" && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-black border border-cyan-500/30 space-y-4 font-mono text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">
                EXPEDIENTE WINDOWS EVO 001 // CERTIFICACIÓN PERICIAL
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                SELLADO
              </span>
            </div>

            <div className="space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
              <div><strong className="text-white">FECHA DE EMISIÓN:</strong> {new Date().toISOString()}</div>
              <div><strong className="text-white">PERITO TITULAR:</strong> Ingeniero Forense Certificado Tomo 02</div>
              <div><strong className="text-white">LÍNEA BASE (FASE 1):</strong> Disco mecánico HDD 5400 RPM sat = 100%, Queue = 8.4</div>
              <div><strong className="text-white">HIPÓTESIS (FASE 3):</strong> Saturación de cola I/O por SysMain en almacenamiento rotativo.</div>
              <div><strong className="text-white">INTERVENCIÓN (FASE 5):</strong> Migración atómica a unidad de estado sólido NVMe PCIe 4.0.</div>
              <div><strong className="text-white">DELTA RESULTANTE (FASE 7):</strong> Queue reducida a 0.08 (Mejora: -99.04%).</div>
              <div><strong className="text-white">VEREDICTO FINAL (FASE 8):</strong> ÉXITO COMPROBADO. CERO EFECTO PLACEBO.</div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-zinc-500">
              <span>SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
              <span className="text-cyan-400 font-bold">ESTÁNDAR FIPS 180-4 VERIFICADO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
