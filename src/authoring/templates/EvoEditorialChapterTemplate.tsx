import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { ChapterSchema, EditorialSectionSchema } from '../schema';
import { EvoAssessmentTemplate } from './EvoAssessmentTemplate';
import { EvoEvidenceResultTemplate } from './EvoEvidenceResultTemplate';

interface EvoEditorialChapterTemplateProps {
  chapter: ChapterSchema;
  onCompleteChapter?: () => void;
  onNextChapter?: () => void;
}

export const EvoEditorialChapterTemplate: React.FC<EvoEditorialChapterTemplateProps> = ({
  chapter,
  onCompleteChapter,
  onNextChapter,
}) => {
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>({});

  const allCheckpointsPassed =
    chapter.checkpoints.length === 0 ||
    chapter.checkpoints.every((chk) => completedCheckpoints[chk.id] === true);

  const handleCheckCompleted = (checkId: string, isCorrect: boolean) => {
    setCompletedCheckpoints((prev) => ({
      ...prev,
      [checkId]: isCorrect,
    }));
  };

  const renderSection = (sec: EditorialSectionSchema) => {
    switch (sec.layout) {
      case 'CODE_TERMINAL':
        return (
          <div key={sec.id} className="space-y-3 my-6">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              {sec.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{sec.contentText}</p>
            {sec.codeSnippet && (
              <div className="rounded-xl bg-black/80 border border-zinc-800 p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
                <div className="text-[10px] text-zinc-500 pb-2 border-b border-zinc-900 flex justify-between">
                  <span>{sec.codeSnippet.language}</span>
                  {sec.codeSnippet.caption && <span>{sec.codeSnippet.caption}</span>}
                </div>
                <pre className="pt-2">{sec.codeSnippet.code}</pre>
              </div>
            )}
          </div>
        );

      case 'COMPARISON':
        return (
          <div key={sec.id} className="space-y-3 my-6">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              {sec.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{sec.contentText}</p>
            {sec.comparisonData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <span className="font-bold text-xs text-amber-400 uppercase font-mono">
                    {sec.comparisonData.itemA.title}
                  </span>
                  <ul className="text-xs text-zinc-300 list-disc pl-4 space-y-1">
                    {sec.comparisonData.itemA.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <span className="font-bold text-xs text-cyan-400 uppercase font-mono">
                    {sec.comparisonData.itemB.title}
                  </span>
                  <ul className="text-xs text-zinc-300 list-disc pl-4 space-y-1">
                    {sec.comparisonData.itemB.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 'CALLOUT':
        return (
          <div key={sec.id} className="space-y-3 my-6">
            <h3 className="text-base font-bold text-white font-mono">{sec.title}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{sec.contentText}</p>
            {sec.technicalCallout && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  {sec.technicalCallout.title}
                </div>
                <p className="font-sans leading-relaxed text-zinc-200">
                  {sec.technicalCallout.text}
                </p>
              </div>
            )}
          </div>
        );

      case 'NARRATIVE':
      default:
        return (
          <div key={sec.id} className="space-y-2 my-6">
            <h3 className="text-base font-bold text-white font-mono">{sec.title}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{sec.contentText}</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 py-6 text-zinc-100">
      {/* Chapter Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>CAPÍTULO {chapter.chapterNumber.toString().padStart(2, '0')} // {chapter.type}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">Lectura estimada: {chapter.readingTimeMin} min</span>
        </div>
        <h1 className="text-2xl font-black text-white font-mono tracking-tight">{chapter.title}</h1>
        <p className="text-sm text-zinc-300 font-sans italic">{chapter.subtitle}</p>

        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
          <span>Versión: v{chapter.version}</span>
          <span>•</span>
          <span>Skills: {chapter.targetSkills.join(', ')}</span>
        </div>
      </div>

      {/* Sections Flow */}
      <div className="space-y-6">
        {chapter.sections.map((sec) => renderSection(sec))}
      </div>

      {/* Embedded Checkpoints */}
      {chapter.checkpoints.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-amber-400 font-mono uppercase tracking-wider">
            Comprobaciones de Aprendizaje (Checkpoints)
          </h3>
          {chapter.checkpoints.map((chk) => (
            <EvoAssessmentTemplate
              key={chk.id}
              check={chk}
              onCheckCompleted={(isCorrect) => handleCheckCompleted(chk.id, isCorrect)}
            />
          ))}
        </div>
      )}

      {/* Evidence Generated */}
      {chapter.evidenceGenerated && chapter.evidenceGenerated.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
            Evidencia Obtenida en este Capítulo
          </h3>
          {chapter.evidenceGenerated.map((ev) => (
            <EvoEvidenceResultTemplate key={ev.id} evidence={ev} />
          ))}
        </div>
      )}

      {/* Chapter Completion Bar */}
      <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-400">
          {allCheckpointsPassed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4" /> Todos los checkpoints superados
            </span>
          ) : (
            <span className="text-amber-400 font-mono font-bold">
              Completa los checkpoints para avanzar
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onCompleteChapter && (
            <button
              onClick={onCompleteChapter}
              disabled={!allCheckpointsPassed}
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:pointer-events-none text-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Marcar Completado</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {onNextChapter && (
            <button
              onClick={onNextChapter}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Siguiente Capítulo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
