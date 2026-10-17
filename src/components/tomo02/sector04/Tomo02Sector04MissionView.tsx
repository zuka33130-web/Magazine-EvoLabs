import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Activity,
  ShieldCheck,
  Search,
  Sliders,
} from 'lucide-react';
import { InteractiveVirtualTaskManager } from './InteractiveVirtualTaskManager';

interface Tomo02Sector04MissionViewProps {
  onBack: () => void;
  onMissionComplete: () => void;
}

export const Tomo02Sector04MissionView: React.FC<Tomo02Sector04MissionViewProps> = ({
  onBack,
  onMissionComplete,
}) => {
  const [labMode, setLabMode] = useState<'simulator' | 'cases'>('simulator');
  const [hypothesesMap, setHypothesesMap] = useState<Record<string, string>>({});
  const [evidenceMap, setEvidenceMap] = useState<Record<string, string>>({});
  const [conclusionsMap, setConclusionsMap] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const cases = [
    {
      id: 'inv_case_1',
      title: 'CASO 1: CPU al 100% persistente',
      symptom: 'Ventilador a máxima velocidad. Task Manager marca 100% de CPU constante.',
      promptHypothesis: '¿Qué hipótesis planteas como causa probable?',
      correctHypothesis: 'Un proceso o hilo individual saturado en bucle infinito o tarea pesada de fondo.',
      promptEvidence: '¿En qué pestaña y columna buscarías la evidencia reina?',
      correctEvidence: 'Pestaña Detalles -> Ordenar por columna CPU y revisar la línea de comandos.',
      conclusionText: 'El hilo fue aislado en Detalles. Se identificó el ejecutable y se verificó si correspondía a un servicio o app de usuario.',
    },
    {
      id: 'inv_case_2',
      title: 'CASO 2: Memoria RAM creciente sin techo',
      symptom: 'El uso de memoria sube continuamente de 2 GB a 14 GB a lo largo de 4 horas.',
      promptHypothesis: '¿Qué hipótesis planteas?',
      correctHypothesis: 'Una fuga de memoria (Memory Leak) en la asignación de memoria privada de un proceso.',
      promptEvidence: '¿En qué columna de Detalles se confirma la fuga?',
      correctEvidence: 'Pestaña Detalles -> Columna "Memoria privada" (Private Bytes) en aumento constante.',
      conclusionText: 'Se confirmó el Memory Leak de Private Bytes. Se reportó al desarrollador de la app para parchear la fuga.',
    },
    {
      id: 'inv_case_3',
      title: 'CASO 3: Disco 100% con baja velocidad MB/s',
      symptom: 'El disco C: marca 100% tiempo activo pero la transferencia dice apenas 1.5 MB/s.',
      promptHypothesis: '¿Qué hipótesis planteas?',
      correctHypothesis: 'Saturación de latencia de tiempo activo por miles de pequeñas peticiones aleatorias 4K.',
      promptEvidence: '¿Qué consola y métrica abres para confirmar las rutas de archivo?',
      correctEvidence: 'Resource Monitor -> Pestaña Disco -> Muestra la latencia en ms y rutas físicas en I/O.',
      conclusionText: 'Resource Monitor confirmó alta latencia (>150 ms) por peticiones aleatorias en un HDD. Se recomendó migración a SSD.',
    },
    {
      id: 'inv_case_4',
      title: 'CASO 4: Uso inesperado de GPU',
      symptom: 'La GPU dedicada marca 80% de uso mientras la laptop está en reposo.',
      promptHypothesis: '¿Qué hipótesis planteas?',
      correctHypothesis: 'Un motor específico de GPU (p. ej. Compute o 3D) está siendo usado por una app de fondo o minero.',
      promptEvidence: '¿Qué pestaña y motor de Task Manager revisás?',
      correctEvidence: 'Pestaña Rendimiento -> GPU -> Desglose por motor (3D, Video Decode, Compute).',
      conclusionText: 'Se identificó que el motor "Compute" estaba siendo usado por una aplicación de aceleración de IA autorizada.',
    },
    {
      id: 'inv_case_5',
      title: 'CASO 5: Múltiples procesos duplicados',
      symptom: 'Ves 20 procesos con el mismo nombre ejecutable en la lista.',
      promptHypothesis: '¿Qué hipótesis planteas?',
      correctHypothesis: 'Arquitectura de aislamiento de pestañas/procesos del programa o instancias múltiples.',
      promptEvidence: '¿Qué columna activas para diferenciar cada instancia?',
      correctEvidence: 'Columna "Línea de comandos" (Command Line) para leer los parámetros individuales.',
      conclusionText: 'La columna Línea de comandos confirmó que cada instancia correspondía a un módulo de extensión o pestaña diferente.',
    },
    {
      id: 'inv_case_6',
      title: 'CASO 6: Inicio de sesión pesado',
      symptom: 'Windows tarda 2 minutos en responder tras ingresar la contraseña.',
      promptHypothesis: '¿Qué hipótesis planteas?',
      correctHypothesis: 'Exceso de aplicaciones con impacto "Alto" configuradas para iniciar sesión automáticamente.',
      promptEvidence: '¿Dónde revisás y deshabilitás estos elementos?',
      correctEvidence: 'Pestaña "Aplicaciones de arranque" (Startup Apps) en Task Manager.',
      conclusionText: 'Se deshabilitaron 5 programas de impacto "Alto" innecesarios, reduciendo el tiempo de arranque a 15 segundos.',
    },
    {
      id: 'inv_case_7',
      title: 'CASO 7: Proceso con nombre extraño',
      symptom: 'Un proceso desconocido en inglés consume CPU y genera desconfianza.',
      promptHypothesis: '¿Qué protocolo de investigación aplicas?',
      correctHypothesis: 'Metodología defensiva de 8 pasos (Nombre, Ruta, Firma, Publisher, Command Line, Parent, Actividad, Contexto).',
      promptEvidence: '¿Cómo descartás que sea malware sin adivinar?',
      correctEvidence: 'Abrir ubicación del archivo -> Propiedades -> Verificar Firma Digital y Ruta en System32.',
      conclusionText: 'Se verificó que el ejecutable residía en C:\Windows\System32 y poseía Firma Digital válida de Microsoft.',
    },
  ];

  const handleHypothesisSelect = (caseId: string, text: string) => {
    setHypothesesMap((prev) => ({ ...prev, [caseId]: text }));
  };

  const handleEvidenceSelect = (caseId: string, text: string) => {
    setEvidenceMap((prev) => ({ ...prev, [caseId]: text }));
  };

  const completedCasesCount = cases.filter(
    (c) => hypothesesMap[c.id] && evidenceMap[c.id]
  ).length;

  const isAllDone = completedCasesCount === cases.length;

  const handleSave = () => {
    setIsSaved(true);
    onMissionComplete();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#60CDFF] font-bold">LABORATORIO PERICIAL DE INVESTIGACIÓN</span>
              <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                LAB: TASK MANAGER INVESTIGATION // METODOLOGÍA CIENTÍFICA
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold border border-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            VOLVER AL TEMARIO
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          Aplica el método científico de investigación pericial: Observá el síntoma, formulá la hipótesis de causa raíz, identificá la evidencia en Task Manager y sacá la conclusión técnica sin ejecutar terminaciones destructivas a ciegas.
        </p>

        {/* Lab Mode Toggle */}
        <div className="flex items-center gap-2 pt-2 font-mono text-xs border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setLabMode('simulator')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              labMode === 'simulator'
                ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                : 'bg-[#11161D] text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SIMULADOR VIRTUAL INTERACTIVO (7 PESTAÑAS)</span>
          </button>

          <button
            type="button"
            onClick={() => setLabMode('cases')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              labMode === 'cases'
                ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                : 'bg-[#11161D] text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>MATRIZ DE 7 CASOS PERICIALES</span>
          </button>
        </div>
      </div>

      {labMode === 'simulator' ? (
        <InteractiveVirtualTaskManager
          onBackToTheory={onBack}
          onScenarioCompleted={() => {
            // Record progress if needed
          }}
        />
      ) : (
        <>
        {/* Cases List */}
        <div className="space-y-4 font-mono text-xs">
        {cases.map((c, idx) => {
          const selectedHyp = hypothesesMap[c.id];
          const selectedEv = evidenceMap[c.id];

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[#60CDFF] font-bold text-xs uppercase">
                  {c.title}
                </span>
                {selectedHyp && selectedEv && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                    INVESTIGADO
                  </span>
                )}
              </div>

              {/* Symptom */}
              <div className="p-3 rounded-xl bg-[#11161D] border border-sky-500/10 text-zinc-300 font-sans text-xs">
                <span className="font-mono text-amber-400 font-bold block mb-1">SÍNTOMA OBSERVADO:</span>
                <p>{c.symptom}</p>
              </div>

              {/* Hypothesis Selection */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-zinc-300 font-bold block">1. FORMULAR HIPÓTESIS:</span>
                <button
                  type="button"
                  onClick={() => handleHypothesisSelect(c.id, c.correctHypothesis)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedHyp
                      ? 'bg-[#0078D4]/20 border-[#00A4EF] text-white font-bold'
                      : 'bg-[#11161D] border-sky-500/10 text-zinc-400 hover:border-sky-500/30'
                  }`}
                >
                  {c.correctHypothesis}
                </button>
              </div>

              {/* Evidence Selection */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-zinc-300 font-bold block">2. BUSCAR EVIDENCIA EN TASK MANAGER:</span>
                <button
                  type="button"
                  onClick={() => handleEvidenceSelect(c.id, c.correctEvidence)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedEv
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-[#11161D] border-sky-500/10 text-zinc-400 hover:border-sky-500/30'
                  }`}
                >
                  {c.correctEvidence}
                </button>
              </div>

              {/* Conclusion */}
              {selectedHyp && selectedEv && (
                <div className="p-3.5 rounded-xl bg-[#05070A] border border-emerald-500/30 font-sans text-xs space-y-1 animate-fadeIn">
                  <span className="font-mono text-emerald-400 font-bold text-[10px] block">
                    3. CONCLUSIÓN PERICIAL Y ACCIÓN RECOMENDADA:
                  </span>
                  <p className="text-zinc-300">{c.conclusionText}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lab Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs">
        <span className="text-zinc-400">
          Casos investigados: <span className="text-[#60CDFF] font-bold">{completedCasesCount}</span> / {cases.length}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isAllDone}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isAllDone
              ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>{isSaved ? 'LABORATORIO GUARDADO' : 'REGISTRAR LAB EN EXPEDIENTE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </>
      )}
    </div>
  );
};
