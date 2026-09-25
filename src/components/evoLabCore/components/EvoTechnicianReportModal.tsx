import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  User,
  Hash,
  Terminal,
} from 'lucide-react';
import { EvoCase } from '../types';

interface EvoTechnicianReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evoCase: EvoCase;
}

export const EvoTechnicianReportModal: React.FC<EvoTechnicianReportModalProps> = ({
  isOpen,
  onClose,
  evoCase,
}) => {
  const [clientName, setClientName] = useState('Cliente Particular');
  const [orderNumber, setOrderNumber] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [technicianNotes, setTechnicianNotes] = useState(
    'Intervención completada en banco metrológico. Se comprobaron temperaturas, voltajes y estabilidad de bus sin anomalías residuales.'
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl border border-zinc-700 bg-[#0c1017] shadow-2xl flex flex-col font-mono-tech overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#07090f] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                EVO LABS // INFORME PERICIAL DE TALLER
              </span>
              <h3 className="font-display font-black text-white text-base sm:text-lg">
                EXPEDIENTE TÉCNICO FORMAL (A4 PRINT READY)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white text-zinc-900 print:p-0 print:bg-white print:text-black">
          {/* Header Masthead */}
          <div className="border-b-2 border-zinc-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-zinc-900">
                EVO LABS METROLOGY & HARDWARE CLINIC
              </div>
              <p className="text-xs text-zinc-600 font-sans-editorial">
                Certificación Forense de Ensayos, Diagnóstico Causal y Arquitectura de Silicio
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-zinc-900">EXPEDIENTE: {evoCase.id}</div>
              <div className="text-zinc-600">Fecha: {new Date().toLocaleDateString('es-AR')}</div>
            </div>
          </div>

          {/* Client & Order Form (Editable in screen, static in print) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">CLIENTE / TITULAR:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2 py-1 font-bold text-zinc-900 outline-none print:border-none print:p-0"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">N° DE ORDEN DE SERVICIO:</span>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded px-2 py-1 font-bold text-zinc-900 outline-none print:border-none print:p-0"
              />
            </div>
          </div>

          {/* Machine Under Examination */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 border-b border-zinc-300 pb-1">
              1. SILICIO BAJO EXAMEN (IDENTIFICACIÓN FÍSICA)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">PROCESADOR:</span>
                <span className="font-bold text-zinc-900 truncate block">{evoCase.machine?.cpu?.model || 'Desconocido'}</span>
              </div>
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">MEMORIA:</span>
                <span className="font-bold text-zinc-900 block">{evoCase.machine?.ram?.sizeGb} GB ({evoCase.machine?.ram?.configuredSpeedMts} MT/s)</span>
              </div>
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">PLACA DE VIDEO:</span>
                <span className="font-bold text-zinc-900 truncate block">{evoCase.machine?.gpu?.model}</span>
              </div>
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">FUENTE DE PODER:</span>
                <span className="font-bold text-zinc-900 block">{evoCase.machine?.psu?.wattageW}W</span>
              </div>
            </div>
          </div>

          {/* Symptom & Diagnostic Findings */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 border-b border-zinc-300 pb-1">
              2. SÍNTOMA DECLARADO & EXPEDIENTE DE INVESTIGACIÓN
            </h4>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-2">
              <p>
                <strong>Observación inicial:</strong> {evoCase.repairSession?.symptomRaw || evoCase.title}
              </p>
              {evoCase.repairSession?.hypotheses && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase block">Hipótesis Causal Confirmada:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    {evoCase.repairSession.hypotheses
                      .filter((h) => h.status === 'CONFIRMED' || h.status === 'PROBABLE')
                      .map((h, i) => (
                        <li key={i} className="text-zinc-800">
                          <strong>{h.title}:</strong> {h.rationale}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Intervention and Verification notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 border-b border-zinc-300 pb-1">
              3. INTERVENCIÓN TÉCNICA Y PROTOCOLO DE VERIFICACIÓN
            </h4>
            <textarea
              rows={3}
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-xs font-sans-editorial text-zinc-800 outline-none print:border-none print:p-0"
            />
          </div>

          {/* Forensic Legal & Pedagogical Footer */}
          <div className="pt-6 border-t-2 border-zinc-900 flex items-center justify-between text-[10px] text-zinc-600">
            <div>
              <strong>FILOSOFÍA EVO:</strong> NO SE ADIVINA. SE MIDE. • Cada intervención ha sido respaldada por telemetría.
            </div>
            <div className="text-right font-bold">
              Firma del Perito Responsable: ____________________
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
