import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  FileText,
  Download,
  Share2,
  Printer,
  Lock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Database,
  Cpu,
  Layers,
  Wrench,
  Activity,
  Terminal,
  ExternalLink,
  Copy,
} from 'lucide-react';
import {
  EvoTechnicalIdentityEngine,
  EvoTechnicalIdentityProfile,
  VerifiedClaim,
  EpistemicProvenance,
} from '../../services/evoTechnicalIdentityEngine';
import { EvoWhyThisModal } from './EvoWhyThisModal';

interface EvoTechnicalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvoTechnicalDossierModal: React.FC<EvoTechnicalDossierModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<EvoTechnicalIdentityProfile>(() =>
    EvoTechnicalIdentityEngine.getTechnicalIdentity()
  );
  const [activeTab, setActiveTab] = useState<
    'RESUMEN' | 'CAPACIDADES' | 'EVIDENCIAS' | 'CASOS' | 'LABS' | 'EXAMENES' | 'DIAGNOSTICOS' | 'INFORMES' | 'ACREDITACIONES'
  >('RESUMEN');
  const [inspectingClaim, setInspectingClaim] = useState<VerifiedClaim | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [sharePayload, setSharePayload] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInspectClaim = (claimId: string) => {
    const claim = EvoTechnicalIdentityEngine.getTraceabilityExplanation(claimId);
    if (claim) {
      setInspectingClaim(claim);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = EvoTechnicalIdentityEngine.generateDossierJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evo-expediente-tecnico-${profile.identityId.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleGenerateShareLink = () => {
    const payload = EvoTechnicalIdentityEngine.generateShareablePayload();
    setSharePayload(payload);
    navigator.clipboard?.writeText(payload);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const getProvenanceBadge = (provenance: EpistemicProvenance | string) => {
    switch (provenance) {
      case 'MEASURED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            MEASURED
          </span>
        );
      case 'SYSTEM_REPORTED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            SYSTEM_REPORTED
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CALCULATED
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            SIMULATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-zinc-800 text-zinc-400">
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:z-auto">
        <div className="relative w-full max-w-6xl bg-[#090c13] border border-amber-500/30 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-4 print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800 print:bg-transparent print:border-black gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 print:hidden">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 print:border-black print:text-black">
                    FASE 06 // EXPEDIENTE TÉCNICO VERIFICADO
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{profile.identityId}</span>
                </div>
                <h2 className="text-lg font-bold text-white print:text-black tracking-wide font-mono">
                  EXPEDIENTE DE IDENTIDAD TÉCNICA EVO
                </h2>
              </div>
            </div>

            {/* Quick Export CTAs */}
            <div className="flex items-center gap-2 print:hidden flex-wrap">
              <button
                onClick={handlePrintPdf}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                title="Imprimir o Exportar PDF"
              >
                <Printer className="w-3.5 h-3.5" /> PDF / Imprimir
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                title="Descargar archivo JSON verificable"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>

              <button
                onClick={handleGenerateShareLink}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
                title="Generar payload verificable para compartir"
              >
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Alert */}
          <div className="px-6 py-2.5 bg-zinc-950 border-b border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-zinc-200">Privacidad local por defecto:</strong> Toda evidencia reside exclusivamente en tu navegador. Nada se envía a servidores externos sin tu consentimiento explícito.
              </span>
            </div>
            {copiedLink && (
              <span className="text-emerald-400 font-bold shrink-0 animate-pulse">
                ✓ Payload copiado al portapapeles
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-[#080b10] px-6 overflow-x-auto scrollbar-thin print:hidden">
            {[
              { id: 'RESUMEN', label: 'Resumen Global' },
              { id: 'CAPACIDADES', label: `Capacidades (${profile.metricsSummary.verifiedCapabilities + profile.metricsSummary.demonstratedCapabilities})` },
              { id: 'EVIDENCIAS', label: `Evidencias (${profile.evidencias.length})` },
              { id: 'CASOS', label: `Casos (${profile.casos.length})` },
              { id: 'LABS', label: `Labs (${profile.labs.filter(l => l.isCompleted).length})` },
              { id: 'EXAMENES', label: `Exámenes (${profile.examenes.filter(e => e.isPassed).length})` },
              { id: 'DIAGNOSTICOS', label: `Diagnósticos (${profile.diagnosticos.length})` },
              { id: 'INFORMES', label: `Informes (${profile.informes.length})` },
              { id: 'ACREDITACIONES', label: `Acreditaciones (${profile.acreditaciones.filter(a => a.status === 'EMITIDA').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-3 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible">
            {/* 1. RESUMEN GLOBAL */}
            {activeTab === 'RESUMEN' && (
              <div className="space-y-6">
                {/* ID Card Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                        Rango Pericial Acreditado // Registro Local
                      </div>
                      <h3 className="text-xl font-bold text-white font-mono">{profile.userBadgeRank}</h3>
                      <p className="text-xs text-zinc-400 pt-1">
                        Identificador Técnico Local: <span className="font-mono text-zinc-300">{profile.identityId}</span>
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Registro local de usuario. Su integridad depende del entorno del navegador.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-center">
                        <div className="text-xl font-bold font-mono text-amber-400">
                          {profile.metricsSummary.verifiedCapabilities}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Verificadas</div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-center">
                        <div className="text-xl font-bold font-mono text-emerald-400">
                          {profile.metricsSummary.evidenceItemsCount}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Evidencias</div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-center">
                        <div className="text-xl font-bold font-mono text-cyan-400">
                          {profile.metricsSummary.resolvedCasesCount}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Casos</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8 Pillars Quick Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">1. Capacidades</div>
                    <div className="text-white font-bold">{profile.metricsSummary.verifiedCapabilities + profile.metricsSummary.demonstratedCapabilities} demostradas</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">2. Evidencias</div>
                    <div className="text-white font-bold">{profile.evidencias.length} registradas</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">3. Casos Periciales</div>
                    <div className="text-white font-bold">{profile.casos.length} documentados</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">4. Labs Prácticos</div>
                    <div className="text-white font-bold">{profile.labs.filter(l => l.isCompleted).length} completados</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">5. Exámenes Técnicos</div>
                    <div className="text-white font-bold">{profile.examenes.filter(e => e.isPassed).length} aprobados</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">6. Diagnósticos WMI</div>
                    <div className="text-white font-bold">{profile.diagnosticos.length} capturados</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">7. Informes Forenses</div>
                    <div className="text-white font-bold">{profile.informes.length} expedientes</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                    <div className="text-zinc-500 uppercase text-[10px]">8. Acreditaciones</div>
                    <div className="text-white font-bold">{profile.acreditaciones.filter(a => a.status === 'EMITIDA').length} oficiales</div>
                  </div>
                </div>

                {/* Anti-CV Statement */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <ShieldCheck className="w-4 h-4" /> PRINCIPIO DE IDENTIDAD TÉCNICA VERIFICABLE
                  </div>
                  <p className="leading-relaxed font-sans text-xs">
                    Este documento no es un currículum tradicional ni un perfil social. Es una recopilación estricta y auditable
                    de intervenciones técnicas reales, mediciones empíricas de laboratorio, pruebas de estrés y diagnósticos de hardware.
                    Cada afirmación contiene su nivel de procedencia y justificación en el botón "¿Por qué EVO dice esto?".
                  </p>
                </div>
              </div>
            )}

            {/* 2. CAPACIDADES */}
            {activeTab === 'CAPACIDADES' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400">Matriz de Habilidades Verificadas ({profile.capacidades.length} nodos)</span>
                  <span className="text-amber-400 font-mono text-[11px]">Click en "¿Por qué EVO afirma esto?" para auditar</span>
                </div>

                <div className="space-y-3">
                  {profile.capacidades.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">{cap.name}</span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                              cap.status === 'VERIFICADA'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : cap.status === 'DEMOSTRADA'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : cap.status === 'EN_DESARROLLO'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            {cap.statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{cap.description}</p>
                      </div>

                      <button
                        onClick={() => handleInspectClaim(`claim-cap-${cap.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 hover:border-amber-400/40 text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        ¿POR QUÉ EVO DICE ESTO?
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. EVIDENCIAS */}
            {activeTab === 'EVIDENCIAS' && (
              <div className="space-y-3">
                {profile.evidencias.length > 0 ? (
                  profile.evidencias.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{ev.title}</span>
                          {getProvenanceBadge(ev.provenance)}
                          <span className="text-[10px] text-zinc-400">Origen: {ev.source}</span>
                        </div>
                        <p className="text-zinc-300 font-sans text-xs">{ev.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-amber-400 font-bold">{ev.result || 'Registrado'}</div>
                        <div className="text-[10px] text-zinc-500">{ev.timestamp}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                    Sin evidencias registradas todavía.
                  </div>
                )}
              </div>
            )}

            {/* 4. CASOS */}
            {activeTab === 'CASOS' && (
              <div className="space-y-3">
                {profile.casos.length > 0 ? (
                  profile.casos.map((cs) => (
                    <div
                      key={cs.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{cs.title}</span>
                          <span className="px-2 py-0.5 text-[9px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {cs.isResolved ? 'CERRADO / EXITOSO' : 'EN INVESTIGACIÓN'}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs font-sans">{cs.summary}</p>
                      </div>

                      <button
                        onClick={() => handleInspectClaim(`claim-case-${cs.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        ¿POR QUÉ EVO DICE ESTO?
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                    No hay casos periciales registrados en el repositorio local.
                  </div>
                )}
              </div>
            )}

            {/* 5. LABS */}
            {activeTab === 'LABS' && (
              <div className="space-y-3">
                {profile.labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{lab.title}</span>
                        {getProvenanceBadge(lab.provenance)}
                      </div>
                      <div className="text-zinc-400 text-xs font-sans">
                        Categoría: {lab.category} | Competencia: <strong className="text-cyan-300">{lab.demonstratedCompetency}</strong>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        lab.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {lab.isCompleted ? 'COMPLETADO' : 'PENDIENTE'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 6. EXÁMENES */}
            {activeTab === 'EXAMENES' && (
              <div className="space-y-3">
                {profile.examenes.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-zinc-400 font-bold">{ex.id}</div>
                        <h4 className="text-base font-bold text-white">{ex.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-amber-400">{ex.scorePct}%</span>
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                            ex.isPassed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {ex.isPassed ? 'APROBADO' : 'PENDIENTE'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 space-y-1 text-xs">
                      <span className="text-zinc-400 font-bold uppercase text-[10px]">Tópicos Auditados:</span>
                      <ul className="list-disc pl-4 text-zinc-300 font-sans space-y-0.5">
                        {ex.evaluationTopics.map((top, idx) => (
                          <li key={idx}>{top}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleInspectClaim(`claim-exam-${ex.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 text-[11px] font-mono font-bold transition-all flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      ¿POR QUÉ EVO DICE ESTO?
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 7. DIAGNÓSTICOS */}
            {activeTab === 'DIAGNOSTICOS' && (
              <div className="space-y-3">
                {profile.diagnosticos.length > 0 ? (
                  profile.diagnosticos.map((diag) => (
                    <div
                      key={diag.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm">{diag.title}</span>
                        {getProvenanceBadge(diag.provenance)}
                      </div>
                      <div className="text-zinc-300">
                        Equipo auditado: <strong className="text-amber-300">{diag.deviceAudited}</strong>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {diag.telemetryPointsCount} puntos de telemetría capturados • {diag.capturedAt}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                    Sin diagnósticos WMI o pasaportes de hardware capturados en esta sesión local.
                  </div>
                )}
              </div>
            )}

            {/* 8. INFORMES FORENSES */}
            {activeTab === 'INFORMES' && (
              <div className="space-y-3">
                {profile.informes.length > 0 ? (
                  profile.informes.map((inf) => (
                    <div
                      key={inf.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm">{inf.title}</span>
                        <span className="text-cyan-400 font-bold">Confianza: {inf.confidenceScore}%</span>
                      </div>
                      <p className="text-zinc-300 font-sans">{inf.conclusion.diagnosticoTecnico}</p>
                      <div className="text-[10px] text-zinc-500">
                        Causa Raíz: {inf.conclusion.causaRaizIdentificada}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                    No existen informes periciales generados por el Forensic Engine todavía.
                  </div>
                )}
              </div>
            )}

            {/* 9. ACREDITACIONES */}
            {activeTab === 'ACREDITACIONES' && (
              <div className="space-y-4">
                {profile.acreditaciones.map((ac) => (
                  <div
                    key={ac.id}
                    className="p-5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3 font-mono"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-amber-400 uppercase">{ac.code}</span>
                        <h4 className="text-base font-bold text-white">{ac.title}</h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          ac.status === 'EMITIDA'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                      >
                        {ac.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">{ac.description}</p>

                    <div className="space-y-1 text-xs pt-2 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">Requisitos Satisfechos:</span>
                      <ul className="list-disc pl-4 text-zinc-300 font-sans space-y-0.5">
                        {ac.requirementsSatisfied.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-[#080b10] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
            <span className="text-zinc-500 font-mono">
              EVO LABS SPEC V1.0 // NO ARBITRARY GAMIFICATION // BACKED BY EMPIRICAL PROOF
            </span>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-bold transition-colors"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Inspector Modal "¿Por qué EVO afirma esto?" */}
      <EvoWhyThisModal
        claim={inspectingClaim}
        isOpen={!!inspectingClaim}
        onClose={() => setInspectingClaim(null)}
      />
    </>
  );
};
