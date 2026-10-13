import React, { useState } from 'react';
import {
  X,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  BookOpen,
  Wrench,
  HelpCircle,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Code,
  Eye,
} from 'lucide-react';
import { EvoContentFactory } from '../../authoring/factory';
import { ValidationReport } from '../../authoring/validator';
import {
  TomoSchema,
  ChapterSchema,
  LabSchema,
  CaseSchema,
  SkillSchema,
} from '../../authoring/schema';
import { EvoEditorialChapterTemplate } from '../../authoring/templates/EvoEditorialChapterTemplate';
import { EvoInteractiveLabTemplate } from '../../authoring/templates/EvoInteractiveLabTemplate';
import { EvoTechnicalCaseTemplate } from '../../authoring/templates/EvoTechnicalCaseTemplate';

interface EvoContentFactoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvoContentFactoryModal: React.FC<EvoContentFactoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [registry, setRegistry] = useState(() => EvoContentFactory.getRegistry());
  const [validationReport, setValidationReport] = useState<ValidationReport>(() =>
    EvoContentFactory.validateAll()
  );
  const [activeTab, setActiveTab] = useState<
    'VALIDACION' | 'TOMOS' | 'LABS' | 'CASOS' | 'SKILLS' | 'PREVIEW'
  >('VALIDACION');
  const [previewMode, setPreviewMode] = useState<'EDITORIAL' | 'LAB' | 'CASE'>('EDITORIAL');

  if (!isOpen) return null;

  const handleRunValidation = () => {
    const report = EvoContentFactory.validateAll();
    setValidationReport(report);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'STABLE':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            STABLE
          </span>
        );
      case 'REVIEW':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            REVIEW
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            DRAFT
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#080b11] border border-cyan-500/40 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FASE 07 // AUTHORING SYSTEM & LAB FACTORY
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {validationReport.stats.tomosCount} Tomos • {validationReport.stats.skillsCount} Skills
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                FABRICA DE CONTENIDOS Y LABORATORIOS EVO
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunValidation}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Validar Esquemas</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#06080d] px-6 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('VALIDACION')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'VALIDACION'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Validador de Esquemas</span>
            {validationReport.isValid ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-red-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('TOMOS')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'TOMOS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Tomos ({registry.tomos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LABS')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'LABS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>3. Labs ({registry.labs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CASOS')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'CASOS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>4. Casos ({registry.cases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SKILLS')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SKILLS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>5. Grafo de Skills ({registry.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-4 py-3 text-xs font-bold font-mono transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PREVIEW'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>6. Preview de Templates</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: VALIDATOR REPORT */}
          {activeTab === 'VALIDACION' && (
            <div className="space-y-6">
              {/* Validation Status Card */}
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  validationReport.isValid
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/20 border-red-500/40 text-red-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm">
                    {validationReport.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <span>
                      {validationReport.isValid
                        ? 'ESQUEMAS VALIDADOS: 100% CONFORMES'
                        : `ERRORES DETECTADOS: ${validationReport.errorsCount}`}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans">
                    Verificación de campos requeridos, ausencia de IDs duplicados, enlaces rotos, formato semver y resolución de dependencias.
                  </p>
                </div>

                <div className="text-right font-mono text-xs text-zinc-400 shrink-0">
                  <div>Errores: <strong className={validationReport.errorsCount > 0 ? 'text-red-400' : 'text-emerald-400'}>{validationReport.errorsCount}</strong></div>
                  <div>Advertencias: <strong className="text-amber-400">{validationReport.warningsCount}</strong></div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs font-mono text-center">
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-white">{validationReport.stats.tomosCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Tomos</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-cyan-400">{validationReport.stats.chaptersCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Capítulos</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-amber-400">{validationReport.stats.labsCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Labs</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-rose-400">{validationReport.stats.casesCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Casos</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-purple-400">{validationReport.stats.skillsCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Skills</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-emerald-400">{validationReport.stats.checksCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Checks</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="text-lg font-bold text-blue-400">{validationReport.stats.evidencesCount}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Evidencias</div>
                </div>
              </div>

              {/* Error list if any */}
              {validationReport.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono text-red-400 uppercase">Errores Críticos:</h4>
                  {validationReport.errors.map((err, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs font-mono text-red-200">
                      [{err.entityType}] {err.entityId} → Campo "{err.field}": {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TOMOS */}
          {activeTab === 'TOMOS' && (
            <div className="space-y-4">
              {registry.tomos.map((tomo) => (
                <div key={tomo.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold uppercase">TOMO {tomo.tomoNumber}</span>
                        <span className="text-zinc-500">• {tomo.id}</span>
                        {getStatusBadge(tomo.status)}
                      </div>
                      <h4 className="text-base font-bold text-white pt-1">{tomo.title}</h4>
                    </div>
                    <span className="text-zinc-400">v{tomo.version}</span>
                  </div>

                  <p className="text-zinc-300 font-sans">{tomo.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-zinc-800 text-zinc-400">
                    <div>Horas Estimadas: <strong className="text-white">{tomo.estimatedHours}h</strong></div>
                    <div>Prerrequisitos: <strong className="text-white">{tomo.prerequisiteTomoIds.join(', ') || 'Ninguno'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LABS */}
          {activeTab === 'LABS' && (
            <div className="space-y-4">
              {registry.labs.map((lab) => (
                <div key={lab.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold uppercase">{lab.labType}</span>
                        <span className="text-zinc-500">• {lab.id}</span>
                        {getStatusBadge(lab.status)}
                      </div>
                      <h4 className="text-base font-bold text-white pt-1">{lab.title}</h4>
                    </div>
                    <span className="text-zinc-400">v{lab.version}</span>
                  </div>

                  <p className="text-zinc-300 font-sans">{lab.objective}</p>
                  <div className="text-[11px] text-zinc-400">
                    Pasos configurados: <strong className="text-cyan-300">{lab.steps.length}</strong> | Herramientas: {lab.toolsRequired.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CASOS */}
          {activeTab === 'CASOS' && (
            <div className="space-y-4">
              {registry.cases.map((cs) => (
                <div key={cs.id} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold uppercase">CASO // {cs.difficulty}</span>
                        <span className="text-zinc-500">• {cs.id}</span>
                        {getStatusBadge(cs.status)}
                      </div>
                      <h4 className="text-base font-bold text-white pt-1">{cs.title}</h4>
                    </div>
                    <span className="text-zinc-400">v{cs.version}</span>
                  </div>

                  <p className="text-zinc-300 font-sans">{cs.scenario}</p>
                  <div className="text-[11px] text-zinc-400">
                    Síntomas: {cs.symptoms.join(' | ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SKILLS */}
          {activeTab === 'SKILLS' && (
            <div className="space-y-3">
              {registry.skills.map((sk) => (
                <div key={sk.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{sk.id}</span>
                      <span className="px-2 py-0.2 rounded bg-black/40 border border-zinc-800 text-[9px] text-zinc-400">{sk.domain}</span>
                    </div>
                    <h4 className="text-white font-bold">{sk.name}</h4>
                    <p className="text-zinc-400 font-sans text-xs">{sk.description}</p>
                  </div>

                  <div className="text-right text-[10px] text-zinc-500 shrink-0">
                    <div>Prerrequisitos: {sk.prerequisites.join(', ') || 'Ninguno'}</div>
                    <div>Desbloquea: {sk.unlocks.join(', ') || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: TEMPLATE PREVIEWS */}
          {activeTab === 'PREVIEW' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs w-fit">
                <button
                  onClick={() => setPreviewMode('EDITORIAL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    previewMode === 'EDITORIAL' ? 'bg-cyan-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Editorial Chapter Template
                </button>
                <button
                  onClick={() => setPreviewMode('LAB')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    previewMode === 'LAB' ? 'bg-cyan-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Interactive Lab Template
                </button>
                <button
                  onClick={() => setPreviewMode('CASE')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    previewMode === 'CASE' ? 'bg-cyan-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Technical Case Template
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800">
                {previewMode === 'EDITORIAL' && registry.chapters[0] && (
                  <EvoEditorialChapterTemplate chapter={registry.chapters[0]} />
                )}

                {previewMode === 'LAB' && registry.labs[0] && (
                  <EvoInteractiveLabTemplate lab={registry.labs[0]} />
                )}

                {previewMode === 'CASE' && registry.cases[0] && (
                  <EvoTechnicalCaseTemplate caseObj={registry.cases[0]} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#06080d] border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>
            EVO AUTHORING SPEC // CONTENT-DRIVEN ARCHITECTURE // ZERO HARDCODED RIGIDITY
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors"
          >
            Cerrar Fábrica
          </button>
        </div>
      </div>
    </div>
  );
};
