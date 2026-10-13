import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { AdvancedSectorContent, SectorLearningEvidence, SectorQuestion } from '../../../data/tomo02AdvancedTypes';
import { isSectorEvidenceComplete } from '../../../data/tomo02AdvancedProgress';
import { TOMO_02_MASTER_SECTORS } from '../../../data/tomo02MasterSectors';
import { safeStorage } from '../../../utils/safeStorage';
import { LabEvoCommand } from '../../magazine/LabEvoCommand';
import { useTutorEvo } from '../../tutor/TutorEvoContext';
import { Tomo02FinalExperiment } from './Tomo02FinalExperiment';
const WindowsLab = React.lazy(() => import('../../world/labs/windowsMatrix/EvoWindowsMatrixLab').then((m) => ({ default: m.EvoWindowsMatrixLab })));
const XRayLab = React.lazy(() => import('../../world/labs/windowsMatrix/EvoWindowsXRayLab').then((m) => ({ default: m.EvoWindowsXRayLab })));
const CaseLibrary = React.lazy(() => import('./Tomo02CaseLibrary').then((m) => ({ default: m.Tomo02CaseLibrary })));
export const SectorChoice: React.FC<{ question: SectorQuestion; value?: number | null; onSelect: (value: number) => void; label: string }> = ({ question, value, onSelect, label }) => <fieldset className="space-y-3 border border-cyan-900 rounded-xl p-4">
  <legend className="px-2 text-cyan-300 font-bold text-sm">{label}</legend>
  <p className="text-sm">{question.question}</p>
  {question.choices.map((choice, index) => <button type="button" key={index} aria-pressed={value === index} onClick={() => onSelect(index)} className={`block w-full text-left p-3 rounded-lg border text-sm ${value === index ? choice.correct ? 'border-emerald-400 bg-emerald-950/30' : 'border-amber-400 bg-amber-950/30' : 'border-zinc-700 hover:border-cyan-400'}`}>{String.fromCharCode(65 + index)}. {choice.text}</button>)}
  {value != null && question.choices[value] && <p role="status" className={`text-sm ${question.choices[value].correct ? 'text-emerald-300' : 'text-amber-300'}`}>{question.choices[value].correct ? 'Criterio correcto: ' : 'Revisá la hipótesis: '}{question.choices[value].feedback}</p>}
</fieldset>;

interface Props {
  content: AdvancedSectorContent;
  completed?: boolean;
  onBack: () => void;
  onNavigate: (number: string) => void;
  onComplete: (id: string) => void;
}
export const Tomo02AdvancedSectorView: React.FC<Props> = ({ content, completed, onBack, onNavigate, onComplete }) => {
  const meta = TOMO_02_MASTER_SECTORS.find((sector) => sector.sectorNumber === content.number)!;
  const storageKey = `evo_tomo02_sector${content.number}_learning_v1`;
  const [evidence, setEvidence] = useState<SectorLearningEvidence>(() => {
    try {
      const saved = JSON.parse(safeStorage.getItem(storageKey) || '{}');
      return { answers: typeof saved.answers === 'object' && saved.answers !== null ? saved.answers : {},
        decision: Number.isInteger(saved.decision) ? saved.decision : null, note: typeof saved.note === 'string' ? saved.note : '', finalExperiment: saved.finalExperiment === true };
    } catch { return { answers: {}, decision: null, note: '' }; }
  });
  const [tab, setTab] = useState<'learn' | 'practice' | 'check'>('learn');
  const [labOpen, setLabOpen] = useState(false);
  const { updateLocation, saveCurrentLocationHistory, openTutorWithTab } = useTutorEvo();
  useEffect(() => { safeStorage.setItem(storageKey, JSON.stringify(evidence)); }, [storageKey, evidence]);
  useEffect(() => {
    updateLocation({ academySection: 'APRENDER', tomoNumber: '02', tomoTitle: 'La Biblia Negra de Windows', chapterNumber: content.number,
      chapterTitle: meta.title, activityTitle: `Sector ${content.number} · ${meta.title}`, activityType: tab === 'check' ? 'comprobacion' : tab === 'practice' ? 'practica' : 'lectura',
      whatIs: content.objective, whatFor: content.mission, currentAction: tab === 'learn' ? 'Leé el mecanismo y su aplicación; consultá los comandos de lectura.' : tab === 'practice' ? 'Resolvé el escenario y registrá evidencia con procedencia.' : 'Justificá ambas comprobaciones antes de completar el sector.',
      whatToLookFor: content.verification, whyItMatters: content.pitfalls[0], nextStep: content.number === '39' ? 'Exportá el expediente y revisá los requisitos del examen del tomo.' : `Continuá al Sector ${Number(content.number) + 1}.` });
  }, [content, meta.title, tab, updateLocation]);
  useEffect(() => { saveCurrentLocationHistory('tomo-02', '02', `Sector ${content.number} · ${meta.title}`); }, [content.number, meta.title, saveCurrentLocationHistory]);
  const eligible = isSectorEvidenceComplete(content, evidence);
  return <article className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 font-sans-editorial text-zinc-100" data-sector={content.number}>
    <header className="space-y-4 border-b border-cyan-900 pb-5">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-cyan-300 text-sm"><ArrowLeft className="w-4 h-4" />Volver al índice del Tomo 02</button>
      <p className="font-mono-tech text-cyan-400 text-xs uppercase">{meta.level} · Sector {content.number} · {completed ? 'Completado' : 'En estudio'}</p>
      <h1 className="font-display text-3xl sm:text-4xl font-black uppercase">{meta.title}</h1>
      <p className="text-zinc-400 text-sm">{meta.subtitle}</p>
      <p className="text-cyan-200 text-base">{content.objective}</p>
      <div className="rounded-xl border border-amber-400/30 p-3 text-sm text-amber-200"><ShieldAlert className="inline w-4 h-4 mr-2" />{content.prerequisites}</div>
      <button type="button" onClick={() => openTutorWithTab('explain')} className="text-xs font-bold text-amber-300 flex gap-2 items-center"><Sparkles className="w-4 h-4" />Tutor EVO · Explicar este sector</button>
    </header>
    <nav aria-label="Etapas del sector" className="flex flex-wrap gap-2">
      {([['learn', 'Entender y aplicar'], ['practice', 'Práctica y diagnóstico'], ['check', 'Comprobalo']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={tab === value} onClick={() => setTab(value)} className={`px-4 py-2 text-sm font-bold border rounded-xl ${tab === value ? 'bg-cyan-400 text-black border-cyan-400' : 'border-zinc-700 text-zinc-300 hover:border-cyan-400'}`}>{label}</button>)}
    </nav>
    {tab === 'learn' && <div className="space-y-6">
      <details className="border border-zinc-800 rounded-xl p-4"><summary className="text-sm text-cyan-300 cursor-pointer">Temario canónico preservado ({meta.investigationsList.length || 'protocolo'})</summary><ul className="grid sm:grid-cols-2 gap-2 mt-3 text-xs text-zinc-300">{meta.investigationsList.map((item) => <li key={item.id}>{item.id} · {item.title}</li>)}</ul>{meta.methodology && <p className="mt-3 text-xs">{content.number === '37' ? 'Consulta la biblioteca de casos disponibles en Práctica; el corpus se muestra con su tamaño real.' : meta.methodology}</p>}</details>
      {content.lessons.map((lesson) => <section key={lesson.heading} className="space-y-3"><h2 className="text-xl font-display text-cyan-300 font-bold flex gap-2 items-center"><BookOpen className="w-5 h-5" />{lesson.heading}</h2><p className="text-sm sm:text-base leading-relaxed text-zinc-300">{lesson.text}</p></section>)}
      {content.commands.map((command, index) => <section key={index} className="space-y-2">
        <p className="text-xs text-amber-300">{command.shell} · {command.simulationOnly ? 'Solo simulación' : 'Consulta/diagnóstico'} · {command.admin ? 'Puede requerir administrador' : 'Permisos de lectura necesarios'} · Salida de ejemplo DIDÁCTICA</p>
        {command.simulationOnly ? <div className="border border-amber-500/40 rounded-xl p-4 space-y-3"><h3 className="font-bold text-amber-300">{command.purpose}</h3><pre className="overflow-x-auto text-xs bg-black p-3 text-cyan-300"><code>{command.code}</code></pre><p className="text-sm">{command.interpretation}</p><p className="text-xs text-zinc-400">Resultado didáctico: {command.example}. Solo para ensayar en una VM descartable; no hay importación ni ejecución en este lector.</p></div> : <LabEvoCommand title={command.purpose} command={command.code} shellType={command.shell === 'REG' ? 'REG' : command.shell === 'CMD' ? 'CMD' : 'POWERSHELL'} queHace={command.purpose} queDevuelve={command.example} queDatoMirar={command.interpretation} queSignifica="Este navegador no ejecuta el comando ni comprueba tu sistema. Una salida real debe registrarse con contexto y procedencia." outputSample={command.example} tip={content.rollback} />}
      </section>)}
      <p className="text-xs text-zinc-400">Los ejemplos no son mediciones de tu equipo. Las consultas de diagnóstico pueden generar logs; eso no las convierte en una reparación.</p>
    </div>}
    {tab === 'practice' && <div className="space-y-5">
      <h2 className="text-xl font-black text-cyan-300">Procedimiento y diagnóstico</h2>
      <ol className="list-decimal pl-5 space-y-3 text-sm text-zinc-300">{content.procedure.map((step) => <li key={step}>{step}</li>)}</ol>
      <SectorChoice label="Simulación segura · ninguna acción modifica Windows" question={{ question: content.scenario, choices: content.decisions }} value={evidence.decision} onSelect={(decision) => setEvidence({ ...evidence, decision })} />
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <section className="border border-emerald-900 p-4 rounded-xl"><h3 className="font-bold text-emerald-300 mb-2">Cómo comprobar el resultado</h3>{content.verification}</section>
        <section className="border border-amber-900 p-4 rounded-xl"><h3 className="font-bold text-amber-300 mb-2">Cómo revertir</h3>{content.rollback}</section>
      </div>
      <section className="text-sm border border-rose-900 rounded-xl p-4"><h3 className="font-bold text-rose-300">Errores a evitar</h3><ul className="list-disc pl-5 mt-2 space-y-2">{content.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul></section>
      {content.lab && <section className="space-y-3"><button type="button" onClick={() => setLabOpen(!labOpen)} className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-sm">{labOpen ? 'Cerrar laboratorio' : `Abrir ${content.lab.label}`}</button>{labOpen && <React.Suspense fallback={<p role="status">Cargando laboratorio existente…</p>}>{content.lab.scenario === 'xray' ? <XRayLab initialScenario="crash-repair" /> : <WindowsLab key={content.lab.scenario} initialScenario={content.lab.scenario} />}</React.Suspense>}</section>}
      {content.number === '37' && <React.Suspense fallback={<p role="status">Cargando biblioteca de expedientes…</p>}><CaseLibrary /></React.Suspense>}
      {content.number === '39' && <Tomo02FinalExperiment onEvidence={(note) => setEvidence({ ...evidence, note, finalExperiment: true })} onEvidenceInvalidated={() => setEvidence((current) => ({ ...current, finalExperiment: false }))} />}
      <label className="block space-y-2 text-sm text-cyan-300">Misión: {content.mission}<textarea value={evidence.note} onChange={(event) => setEvidence({ ...evidence, note: event.target.value })} rows={5} className="block w-full bg-black/50 border border-zinc-700 rounded-xl p-3 text-white" placeholder="Registrá contexto, prueba, resultado y límite. Es evidencia declarada por el estudiante, no telemetría verificada." /></label>
    </div>}
    {tab === 'check' && <div className="space-y-4">
      {content.questions.map((question, index) => <SectorChoice key={index} label={`Comprobación ${index + 1}`} question={question} value={evidence.answers[index]} onSelect={(value) => setEvidence({ ...evidence, answers: { ...evidence.answers, [index]: value } })} />)}
      <p className="text-sm text-zinc-400">Para registrar finalización: resolvé el escenario, ambas comprobaciones y escribí la evidencia de la misión. En el Sector 39 también se requiere exportar el expediente completo. Se registra aprendizaje autoevaluado; no certifica el equipo ni aprueba el tomo.</p>
      <button type="button" disabled={!eligible} onClick={() => onComplete(meta.sectorId)} className="flex gap-2 items-center px-4 py-3 bg-cyan-400 text-black font-bold rounded-xl text-sm disabled:opacity-40"><CheckCircle2 className="w-4 h-4" />{completed ? 'Sector completado · evidencia conservada' : 'Completar sector con evidencia'}</button>
    </div>}
    <footer className="flex flex-wrap justify-between gap-3 border-t border-cyan-900 pt-5">
      {Number(content.number) > 11 ? <button type="button" onClick={() => onNavigate(String(Number(content.number) - 1))} className="text-sm text-cyan-300">← Sector anterior</button> : <button type="button" onClick={onBack} className="text-sm text-cyan-300">Índice y sectores anteriores</button>}
      {Number(content.number) < 39 && <button type="button" onClick={() => onNavigate(String(Number(content.number) + 1))} className="text-sm text-cyan-300 flex gap-2 items-center">Sector siguiente<ArrowRight className="w-4 h-4" /></button>}
    </footer>
    <p className="text-xs text-zinc-400">Referencia técnica: {content.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">{reference.label}</a>)}</p>
  </article>;
};
