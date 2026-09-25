// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — HARDWARE DISCOVERY MODAL
// Rule: "MODELO NO ENCONTRADO // NO SE ADIVINA. SE INVESTIGA."
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Fan,
  HardDrive,
  Tv,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Database,
  Edit3,
  Check,
  RefreshCw,
  Sliders,
  Box,
} from 'lucide-react';
import { SubsystemType, Machine } from '../types';
import { HardwareComponent, HardwareCatalogProvider } from '../services/hardwareCatalog';
import {
  HardwareDiscoveryProvider,
  DiscoveryExecutionResult,
  StructuredExtractionResult,
  DisambiguationOption,
} from '../services/hardwareDiscovery';

interface EvoHardwareDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryFilter?: SubsystemType;
  initialQuery?: string;
  onComponentIncorporated?: (component: HardwareComponent) => void;
  onApplyToMachine?: (component: HardwareComponent) => void;
}

const EXAMPLE_QUERIES = [
  { label: 'ASUS PRIME B760M-A WIFI D4', query: 'ASUS PRIME B760M-A WIFI D4', category: 'motherboard' },
  { label: 'KF556C40BBAK2-32 (Kingston RAM)', query: 'KF556C40BBAK2-32', category: 'ram' },
  { label: 'GV-N5070GAMING OC-12GD (RTX 5070)', query: 'GV-N5070GAMING OC-12GD', category: 'gpu' },
  { label: 'DeepCool AK620 Digital', query: 'DeepCool AK620 Digital', category: 'cooling' },
  { label: 'AMD Ryzen 7 9800X3D', query: 'AMD Ryzen 7 9800X3D', category: 'cpu' },
  { label: 'Crucial T700 CT2000T700SSD3', query: 'Crucial T700 CT2000T700SSD3', category: 'storage' },
  { label: 'B760M ASUS (Múltiples modelos)', query: 'B760M ASUS', category: 'motherboard' },
  { label: 'RTX 5070 (Familia con variantes)', query: 'RTX 5070', category: 'gpu' },
];

export const EvoHardwareDiscoveryModal: React.FC<EvoHardwareDiscoveryModalProps> = ({
  isOpen,
  onClose,
  categoryFilter,
  initialQuery = '',
  onComponentIncorporated,
  onApplyToMachine,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<SubsystemType | 'all'>(
    categoryFilter || 'all'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<DiscoveryExecutionResult | null>(null);
  const [editedSpecs, setEditedSpecs] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'review' | 'pipeline' | 'audit'>('review');
  const [committedComponent, setCommittedComponent] = useState<HardwareComponent | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const handleExecuteSearch = async (overrideQuery?: string, disambiguationId?: string) => {
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setCommittedComponent(null);

    try {
      const res = await HardwareDiscoveryProvider.discoverHardware(
        {
          rawInput: searchQuery,
          categoryHint: selectedCategory !== 'all' ? selectedCategory : undefined,
        },
        disambiguationId
      );

      setResult(res);
      if (res.extractedResult) {
        setEditedSpecs({ ...res.extractedResult.specifications });
      }
      setActiveTab('review');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDisambiguation = (option: DisambiguationOption) => {
    handleExecuteSearch(option.exactModel, option.id);
  };

  const handleCommitToCatalog = () => {
    if (!result?.extractedResult) return;

    const finalExtraction: StructuredExtractionResult = {
      ...result.extractedResult,
      specifications: editedSpecs,
      // Recalculate summary if model or specs were updated
      specsSummary:
        result.extractedResult.specsSummary ||
        `${result.extractedResult.manufacturer} ${result.extractedResult.exactModel}`,
    };

    const newComponent = HardwareDiscoveryProvider.commitToCatalog(finalExtraction);
    setCommittedComponent(newComponent);

    if (onComponentIncorporated) {
      onComponentIncorporated(newComponent);
    }
  };

  const handleApplyDirectly = () => {
    if (committedComponent && onApplyToMachine) {
      onApplyToMachine(committedComponent);
      onClose();
    }
  };

  const extracted = result?.extractedResult;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none font-mono-tech">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-3xl border border-zinc-700 bg-[#0a0d14] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#07090f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  HARDWARE DISCOVERY ENGINE // EXTRACTOR DE ESPECIFICACIONES OFICIALES
                </span>
                <span className="px-2 py-0.2 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  TIER 1 PRIMARY
                </span>
              </div>
              <h2 className="font-display font-black text-white text-base sm:text-lg tracking-tight uppercase">
                ¿NO ENCONTRÁS TU COMPONENTE?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Instructions */}
        <div className="p-5 border-b border-zinc-800/80 bg-[#0e121a] space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch()}
                placeholder="ESCRIBÍ MARCA, MODELO O PART NUMBER (ej: ASUS PRIME B760M-A WIFI D4)"
                className="w-full px-4 py-3 pl-11 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-cyan-400 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
              />
              <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              disabled={isSearching || !query.trim()}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>BUSCANDO EN TIERS OFICIALES...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>BUSCAR MODELO EN INTERNET</span>
                </>
              )}
            </button>
          </div>

          {/* Quick chip examples mandated by the rule */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">
              EJEMPLOS Y CLAVES DE IDENTIFICACIÓN:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_QUERIES.map((ex) => (
                <button
                  key={ex.query}
                  type="button"
                  onClick={() => {
                    setQuery(ex.query);
                    handleExecuteSearch(ex.query);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 text-[11px] text-zinc-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Initial State / No Search performed yet */}
          {!result && !isSearching && (
            <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center space-y-4 max-w-xl mx-auto my-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-white text-sm uppercase">
                  EL CATÁLOGO EVO NUNCA DEBE SER UN LÍMITE
                </h3>
                <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                  Cualquier placa base, procesador, placa de video, memoria RAM, SSD o disipador del mundo real puede incorporarse al laboratorio. EVO rastrea el sitio oficial del fabricante, extrae los parámetros físicos reales y te los presenta para verificación.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-amber-400 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  REGLA EPISTÉMICA FUNDACIONAL:
                </div>
                <div className="text-zinc-400">
                  Prohibido inventar o estimar datos por similitud. Si el fabricante no publica un dato específico, EVO lo marca explícitamente como <strong className="text-amber-300">UNKNOWN</strong> para que vos lo confirmes con el manual o la caja física.
                </div>
              </div>
            </div>
          )}

          {/* DISAMBIGUATION STEP: "Encontré varios modelos posibles" */}
          {result?.needsDisambiguation && result.disambiguationCandidates && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-amber-400 text-xs sm:text-sm uppercase tracking-wide">
                    ENCONTRÉ VARIOS MODELOS POSIBLES
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans-editorial">
                    La consulta &quot;{query}&quot; corresponde a una familia con diferencias físicas críticas (generación de RAM, cantidad de ranuras o conectores). Por favor, seleccioná el modelo exacto que tenés en el laboratorio:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.disambiguationCandidates.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1017] hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                          {opt.manufacturer}
                        </span>
                        {opt.partNumber && (
                          <span className="text-cyan-400 font-mono text-[10px]">
                            {opt.partNumber}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                        {opt.exactModel}
                      </h4>

                      <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] text-amber-300">
                        {opt.keyDifferentiator}
                      </div>

                      <div className="text-[10px] text-zinc-400 leading-tight">
                        {opt.specsSummary}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectDisambiguation(opt)}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-500/40 text-cyan-300 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>SELECCIONAR ESTE MODELO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRUCTURED REVIEW STEP */}
          {extracted && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Success Banner or Committed Confirmation */}
              {committedComponent ? (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        INCORPORACIÓN EXITOSA AL CATÁLOGO
                      </span>
                      <h3 className="font-bold text-white text-sm">
                        {committedComponent.model} ha sido indexado permanentemente.
                      </h3>
                    </div>
                  </div>

                  {onApplyToMachine && (
                    <button
                      type="button"
                      onClick={handleApplyDirectly}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
                    >
                      <Zap className="w-4 h-4" />
                      <span>APLICAR A LA MÁQUINA ACTIVA</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0e1422] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                          EXTRACCIÓN COMPLETADA // REVISIÓN DEL TÉCNICO
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          CONFIANZA {extracted.confidencePct}%
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm">
                        {extracted.exactModel}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCommitToCatalog}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>INCORPORAR AL CATÁLOGO EVO</span>
                  </button>
                </div>
              )}

              {/* Verified Sources & Official Link Banner */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    FUENTE OFICIAL VERIFICADA
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    FECHA: {extracted.verifiedSources[0]?.verifiedAt || '2026-09-24'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {extracted.verifiedSources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 flex items-center justify-between gap-2 group transition-all"
                    >
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                              s.tier === 'TIER_1_OFFICIAL'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : s.tier === 'TIER_2_OFFICIAL_DOCS'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            {s.tier.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-white text-[11px] truncate">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono block truncate mt-0.5">
                          {s.domain}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                    </a>
                  ))}
                </div>

                {extracted.partNumber && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-zinc-500">PART NUMBER CERTIFICADO:</span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {extracted.partNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Subsystem Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'review'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  FICHA TÉCNICA ESTRUCTURADA
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pipeline')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'pipeline'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  PIPELINE DE DISCOVERY ({result.pipelineLogs.length} PASOS)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'audit'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  AUDITORÍA EPISTÉMICA
                </button>
              </div>

              {/* TAB 1: Structured Specifications Grid with UNKNOWN warnings */}
              {activeTab === 'review' && (
                <div className="space-y-4">
                  {extracted.unknownFields.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>ADVERTENCIA EPISTÉMICA // NO SE ADIVINA:</strong> Los campos marcados con{' '}
                        <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold">
                          UNKNOWN
                        </span>{' '}
                        no pudieron certificarse en la ficha primaria. Podés editarlos manualmente haciendo clic en las casillas si tenés el manual o la caja física.
                      </div>
                    </div>
                  )}

                  {/* Editable Attribute Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(editedSpecs).map(([key, val]) => {
                      const isUnknown = String(val).toUpperCase().includes('UNKNOWN');

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-xl border transition-all ${
                            isUnknown
                              ? 'bg-amber-950/10 border-amber-500/40'
                              : 'bg-zinc-950/60 border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                              {key}
                            </span>
                            {isUnknown ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                UNKNOWN
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                VERIFICADO
                              </span>
                            )}
                          </div>

                          <input
                            type="text"
                            value={val || ''}
                            onChange={(e) =>
                              setEditedSpecs({
                                ...editedSpecs,
                                [key]: e.target.value,
                              })
                            }
                            className={`w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border text-xs outline-none focus:border-cyan-400 ${
                              isUnknown
                                ? 'border-amber-500/50 text-amber-200'
                                : 'border-zinc-700 text-white'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Discovery Pipeline Log */}
              {activeTab === 'pipeline' && (
                <div className="space-y-2 text-xs">
                  {result.pipelineLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white uppercase text-[11px]">
                            {log.title}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-zinc-400 font-sans-editorial text-[11px]">
                          {log.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Epistemic Audit Log */}
              {activeTab === 'audit' && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] mb-2">
                    REGISTRO DE CONTENCIÓN EPISTÉMICA:
                  </h4>
                  {extracted.epistemicAuditLog.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-zinc-400">
                      <span className="text-cyan-400 font-mono">▸</span>
                      <span>{entry}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#07090f] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DISCOVERY ENGINE OPERATIVO // NINGÚN HARDWARE REAL QUEDA FUERA</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold transition-all cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};
