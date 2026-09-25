// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — CATALOG COVERAGE & INGESTION DASHBOARD
// Principle: "NO ADIVINAR. EL FABRICANTE APORTA LA EVIDENCIA.
//              DATOS REALES Y MÉTRICAS DE COBERTURA."
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Database,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Fan,
  Box,
  Sliders,
  Radio,
  Clock,
  ArrowUpRight,
  ExternalLink,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import {
  HardwareOfficialSourceRegistry,
  MasterCatalogCoverageReport,
} from '../services/ingestion/hardwareOfficialSourceRegistry';

interface CatalogCoverageDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CatalogCoverageDashboard: React.FC<CatalogCoverageDashboardProps> = ({ isOpen, onClose }) => {
  const [coverage, setCoverage] = useState<MasterCatalogCoverageReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAdapterId, setSelectedAdapterId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCoverage();
    }
  }, [isOpen]);

  const loadCoverage = async () => {
    setIsLoading(true);
    try {
      const report = await HardwareOfficialSourceRegistry.getCoverageReport();
      setCoverage(report);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const report = await HardwareOfficialSourceRegistry.getCoverageReport();
      setCoverage(report);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none font-mono-tech">
      <div className="w-full max-w-5xl max-h-[92vh] rounded-3xl border border-zinc-700 bg-[#0a0d14] shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#07090f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                  EVO CORE // HARDWARE KNOWLEDGE ENGINE
                </span>
                <span className="px-2 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OFFICIAL EVIDENCE TIER 1
                </span>
              </div>
              <h2 className="font-display font-black text-white text-base sm:text-lg tracking-tight uppercase">
                CATALOG COVERAGE & INGESTION DASHBOARD
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>ACTUALIZAR FUENTES</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {isLoading || !coverage ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-400">Consultando registros y adaptadores oficiales...</p>
            </div>
          ) : (
            <>
              {/* TOP STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#0e121a] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">MODELOS INDEXADOS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-black text-white">{coverage.totalModelsIndexed}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">100% OFICIAL</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans-editorial">
                    {coverage.activeModelsCount} Activos • {coverage.legacyModelsCount} Legacy
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121a] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">ADAPTADORES TIER 1</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-black text-cyan-400">{coverage.adaptersStats.length}</span>
                    <span className="text-[10px] text-cyan-300 font-bold">ONLINE</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans-editorial">
                    Intel, AMD, NVIDIA, ASUS, MSI, etc.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121a] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">CAMPOS CON EVIDENCIA</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-black text-emerald-400">{coverage.totalFieldsWithEvidence}</span>
                    <span className="text-[10px] text-zinc-400">FIELDEVIDENCE</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans-editorial">
                    URLs y datasheets documentados
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121a] border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">DUPLICADOS EVITADOS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-black text-purple-400">{coverage.duplicatesPrevented}</span>
                    <span className="text-[10px] text-purple-300 font-bold">NORMALIZADOS</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-sans-editorial">
                    HardwareNormalizer activo
                  </span>
                </div>
              </div>

              {/* CATEGORY BREAKDOWN PILLS */}
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>COBERTURA POR CATEGORÍA DE HARDWARE</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Recopilación Progresiva</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                  {Object.entries(coverage.modelsPerCategory).map(([cat, count]) => (
                    <div key={cat} className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between">
                      <span className="text-zinc-400 uppercase text-[11px] truncate">{cat}</span>
                      <span className="font-bold text-white font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px]">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OFFICIAL MANUFACTURER SOURCE ADAPTERS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>REGISTRO DE FUENTES OFICIALES (ADAPTERS INDEPENDIENTES)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Sin Scraping Frágil</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coverage.adaptersStats.map((adapter) => (
                    <div
                      key={adapter.sourceId}
                      className="p-4 rounded-2xl border border-zinc-800 bg-[#0e121a] space-y-2.5 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-bold text-white text-sm">{adapter.manufacturer}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {adapter.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 font-mono space-y-1">
                        <div>
                          <span className="text-zinc-500">Dominios oficiales: </span>
                          <span className="text-zinc-300">{adapter.officialDomains.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Categorías: </span>
                          <span className="text-cyan-300 uppercase">{adapter.categoriesSupported.join(', ')}</span>
                        </div>
                        <div className="flex justify-between pt-1 text-[10px]">
                          <span>Modelos activos: <strong className="text-white">{adapter.activeModels}</strong></span>
                          <span>Con evidencia: <strong className="text-emerald-400">{adapter.recordsWithEvidence}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EPISTEMIC AUDIT & GAPS */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>REGLA EPISTÉMICA DE AUDITORÍA:</span>
                </div>
                <p className="text-zinc-400 font-sans-editorial text-[11px] leading-relaxed">
                  EVO CORE no asume datos que el fabricante no declare explícitamente en manuales, CPU Support Lists o datasheets. Si un valor no está publicado o requiere desarme físico no documentado, se mantiene estrictamente como <strong className="text-amber-300 font-mono">UNKNOWN</strong>.
                </p>
                {coverage.knownGaps.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-[10px] text-zinc-500">
                    <span className="text-zinc-400 font-bold uppercase">Brechas Conocidas (Known Gaps):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                      {coverage.knownGaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
