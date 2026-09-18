import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Award,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { AbLaboratoryReport } from '../../types';
import {
  generateLaboratoryReportTxt,
  generateLaboratoryReportJson,
} from './abExperimentKnowledge';

interface LaboratoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AbLaboratoryReport;
  onOpenTomeDossier: () => void;
}

export const LaboratoryReportModal: React.FC<LaboratoryReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onOpenTomeDossier,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const txtContent = generateLaboratoryReportTxt(report);
  const jsonContent = generateLaboratoryReportJson(report);

  const handleDownloadTxt = () => {
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INFORME_LAB_EVO_${report.id.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INFORME_LAB_EVO_${report.id.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txtContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0d0e14] border-2 border-yellow-400/80 rounded-3xl text-white shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-800 bg-[#12131b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-widest block">
                ARTEFACTO OFICIAL // TOMO 01
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight">
                INFORME DE LABORATORIO EVO 001
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 font-mono-tech text-xs">
          {/* Header Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-zinc-400">
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">EXPEDIENTE ID:</span>
              <strong className="text-white text-sm">{report.id}</strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">FECHA DE ENSAYO:</span>
              <span className="text-zinc-300">{report.completedAt || report.createdAt}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">RESULTADO:</span>
              <span className="px-2.5 py-1 rounded bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/40">
                {report.outcomeResult}
              </span>
            </div>
          </div>

          {/* 1. Hardware */}
          <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-2">
            <span className="text-yellow-400 uppercase font-bold block text-[11px]">
              1. HARDWARE DE ENSAYO (PASAPORTE EVO)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div>CPU: {report.hardware.cpu || 'No registrada'}</div>
              <div>RAM: {report.hardware.ram || 'No registrada'}</div>
              <div>GPU: {report.hardware.gpu || 'No registrada'}</div>
              <div>ALMACENAMIENTO: {report.hardware.storage || 'No registrado'}</div>
            </div>
          </div>

          {/* 2. Objetivo e Hipótesis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                2. OBJETIVO DEL ENSAYO
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200">
                {report.objectiveCustomText || report.objective}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                3. HIPÓTESIS DEL USUARIO
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200 italic">
                “{report.userHypothesis}”
              </p>
            </div>
          </div>

          {/* 4. Condiciones & Variable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                4. CONDICIONES CONTROLADAS
              </span>
              <div className="space-y-1 text-zinc-300">
                <div>PROGRAMA/JUEGO: {report.conditions.gameOrApp}</div>
                <div>ESCENARIO: {report.conditions.sceneOrMap || 'Idéntico'}</div>
                <div>DURACIÓN: {report.conditions.duration || 'Idéntica'}</div>
                {report.conditions.resolution && <div>RESOLUCIÓN: {report.conditions.resolution}</div>}
                {report.conditions.fpsCap && <div>FPS CAP: {report.conditions.fpsCap}</div>}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                5. VARIABLE MODIFICADA (UNA SOLA)
              </span>
              <div className="space-y-1 text-zinc-300">
                <div>VARIABLE: {report.controlledVariable.customName || report.controlledVariable.variableType}</div>
                <div>ANTES (A): {report.controlledVariable.beforeState}</div>
                <div>DESPUÉS (B): {report.controlledVariable.changeApplied}</div>
                <div>REVERSIBLE: {report.controlledVariable.reversible ? 'SÍ' : 'NO'}</div>
                {report.isReverted && (
                  <div className="text-emerald-400 font-bold flex items-center gap-1 mt-1">
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>EL USUARIO CONFIRMÓ LA REVERSIÓN DEL CAMBIO</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 6. Tabla Comparativa Deltas */}
          <div className="space-y-2">
            <span className="text-yellow-400 uppercase font-bold block text-[11px]">
              6. TELEMETRÍA EMPÍRICA A vs B (DELTAS)
            </span>
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-black/40">
              <table className="w-full text-left font-mono-tech text-xs">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Métrica</th>
                    <th className="p-3">A (Antes)</th>
                    <th className="p-3">B (Después)</th>
                    <th className="p-3">Delta Absoluto</th>
                    <th className="p-3">Delta Relativo</th>
                    <th className="p-3">Impacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {report.deltas.map((d) => {
                    const isImp = d.evaluation === 'MEJORÓ';
                    const isWorse = d.evaluation === 'EMPEORÓ';
                    const sign = d.deltaAbsolute > 0 ? '+' : '';

                    return (
                      <tr key={d.key}>
                        <td className="p-3 font-bold text-white">{d.label}</td>
                        <td className="p-3 text-zinc-400">{d.valueA} {d.unit}</td>
                        <td className="p-3 text-white font-bold">{d.valueB} {d.unit}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              isImp ? 'text-emerald-400' : isWorse ? 'text-rose-400' : 'text-zinc-400'
                            }`}
                          >
                            {isImp && <TrendingUp className="w-3.5 h-3.5" />}
                            {isWorse && <TrendingDown className="w-3.5 h-3.5" />}
                            {!isImp && !isWorse && <Minus className="w-3.5 h-3.5" />}
                            <span>{sign}{d.deltaAbsolute} {d.unit}</span>
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-zinc-300">
                          {d.deltaPercent !== null ? `${d.deltaPercent > 0 ? '+' : ''}${d.deltaPercent}%` : '—'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isImp ? 'bg-emerald-500/20 text-emerald-300' : isWorse ? 'bg-rose-500/20 text-rose-300' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {d.evaluation}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Percepción & Interpretación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                7. PERCEPCIÓN SUBJETIVA
              </span>
              <div className="text-zinc-300">
                <div>ESTADO A: {report.perceptionA || 'Sin registrar'}</div>
                <div>ESTADO B: {report.perceptionB || 'Sin registrar'}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11121a] border border-zinc-800/80 space-y-1.5">
              <span className="text-yellow-400 uppercase font-bold block text-[11px]">
                8. DECISIÓN DEL OPERADOR
              </span>
              <div className="text-zinc-300">
                <div>RESULTADO: <strong>{report.outcomeResult}</strong></div>
                <div>DECISIÓN: <strong>{report.userDecision}</strong></div>
              </div>
            </div>
          </div>

          {/* 9. Conclusión del Usuario */}
          <div className="p-5 rounded-2xl bg-yellow-400/5 border border-yellow-400/30 space-y-2">
            <span className="text-yellow-400 uppercase font-bold block text-[11px]">
              9. CONCLUSIÓN FINAL DEL USUARIO
            </span>
            <p className="font-sans-editorial text-sm sm:text-base text-zinc-100 leading-relaxed italic">
              “{report.userConclusion}”
            </p>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-5 sm:p-6 border-t border-zinc-800 bg-[#12131b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-mono-tech text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR .TXT</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-mono-tech text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORTAR .JSON</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenTomeDossier}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-yellow-400/20"
          >
            <Award className="w-4 h-4 text-black" />
            <span>IR AL DOSSIER FINAL // TOMO 01</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
