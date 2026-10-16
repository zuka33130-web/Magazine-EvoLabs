import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Download,
  Copy,
  Check,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
  ExternalLink,
  Layers,
  Fingerprint,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { TOMO_02_MASTER_SECTORS } from '../../data/tomo02MasterSectors';

interface Tomo02MasterExpedienteModalProps {
  onClose: () => void;
  onOpenSector00?: () => void;
  onOpenSector01?: () => void;
  moduleProgress?: Record<string, 'not_started' | 'in_progress' | 'completed'>;
}

export const Tomo02MasterExpedienteModal: React.FC<Tomo02MasterExpedienteModalProps> = ({
  onClose,
  onOpenSector00,
  onOpenSector01,
  moduleProgress = {},
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tree' | 'raw'>('tree');

  const dossierMasterId = 'EVO-WIN-EXPEDIENTE-001-CANONICAL';

  const sectorStates = TOMO_02_MASTER_SECTORS.map(sector => ({
    sector,
    status: moduleProgress[sector.sectorId] || 'not_started' as const,
  }));
  const completedSectors = sectorStates.filter(item => item.status === 'completed').length;
  const inProgressSectors = sectorStates.filter(item => item.status === 'in_progress').length;
  const statusText = (status: string) => status === 'completed' ? 'AVANCE COMPLETO' : status === 'in_progress' ? 'EN CURSO' : 'SIN AVANCE REGISTRADO';
  const buildReport = () => [
    'EVO LABS // EXPEDIENTE MAESTRO WINDOWS EVO 001',
    'TOMO 02: LA BIBLIA NEGRA DE WINDOWS',
    'FECHA UTC: ' + new Date().toISOString(),
    'SECTORES CON AVANCE COMPLETO: ' + completedSectors + ' / ' + sectorStates.length,
    'SECTORES EN CURSO: ' + inProgressSectors,
    '',
    ...sectorStates.map(({ sector, status }) => 'Sector ' + sector.sectorNumber + ' - ' + sector.title + ': ' + statusText(status)),
    '',
    'Registro de avance de la aplicación, NO certificación individual ni verificación automática de evidencia.',
    'La procedencia y el contenido de la evidencia deben revisarse en cada sector.',
  ].join('\n');

  const handleCopy = () => {
    void navigator.clipboard.writeText(buildReport()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => setCopied(false));
  };

  const handleDownload = () => {
    const blob = new Blob([buildReport()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EXPEDIENTE_MAESTRO_WINDOWS_EVO_001.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#080B10] border border-[#00A4EF]/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#11161D] via-[#0078D4]/20 to-[#11161D] p-5 sm:p-6 border-b border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 flex items-center justify-center text-[#60CDFF]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] font-bold border border-[#00A4EF]/40">
                  EXPEDIENTE MAESTRO
                </span>
                <span className="text-[11px] font-mono text-zinc-400">TOMO 02 // BIBLIA NEGRA DE WINDOWS</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-0.5">
                EXPEDIENTE WINDOWS EVO 001
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-sky-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Metadata Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#11161D] p-4 rounded-xl border border-sky-500/20 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">ID EXPEDIENTE MAESTRO</span>
              <span className="text-[#60CDFF] font-bold">{dossierMasterId}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">SUB-ARTEFACTOS ACTIVOS</span>
              <span className="text-[#16C784] font-bold flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {completedSectors} / {sectorStates.length} CON AVANCE COMPLETO
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">ESTADO REGISTRADO</span>
              <span className="text-[#60CDFF] font-bold">{inProgressSectors} EN CURSO</span>
            </div>
          </div>

          {/* Artefacts Hierarchy Tree */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00A4EF]" />
              Árbol de Artefactos de la Obra (EXPEDIENTE WINDOWS EVO 001)
            </h3>

            <div className="space-y-3">
              {/* Artefacto 001: Pasaporte */}
              <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/30 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16C784]" />
                    <span className="font-mono text-xs font-bold text-[#60CDFF]">
                      ARTEFACTO 001 // PASAPORTE WINDOWS EVO 001
                    </span>
                    <span className="px-2 py-0.2 rounded bg-emerald-950/50 text-[10px] font-mono text-[#16C784] border border-emerald-500/40">
                      SECTOR 00
                    </span>
                  </div>
                  {onOpenSector00 && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSector00();
                      }}
                      className="text-xs font-mono text-[#00A4EF] hover:text-[#60CDFF] flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>Abrir en Sector 00</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-300">
                  Ficha de identidad del sistema operativo: Edición real, Build, Arquitectura x64/ARM64, Licencia, Tipo de cuenta, Modelo de Privilegios UAC y Línea Base (Baseline).
                </p>
              </div>

              {/* Artefacto 002: Pre-Boot Expediente */}
              <div className="p-4 rounded-xl bg-[#11161D] border border-[#00A4EF]/50 space-y-2 shadow-[0_0_15px_rgba(0,164,239,0.15)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00A4EF] animate-pulse" />
                    <span className="font-mono text-xs font-bold text-white">
                      ARTEFACTO 002 // EXPEDIENTE FORENSE DE ARRANQUE PRE-BOOT
                    </span>
                    <span className="px-2 py-0.2 rounded bg-[#0078D4]/30 text-[10px] font-mono text-[#60CDFF] border border-[#00A4EF]/50 font-bold">
                      SECTOR 01
                    </span>
                  </div>
                  {onOpenSector01 && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSector01();
                      }}
                      className="text-xs font-mono text-[#60CDFF] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>Abrir en Sector 01</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-300">
                  Guía de inspección del vector de arranque: Modo Firmware UEFI, partición ESP FAT32, Almacén BCD, Módulo TPM 2.0, Secure Boot, winload.efi y 12 fases del modelo EVO.
                </p>
              </div>

              {/* Futuros Artefactos (003 - 040) */}
              <div className="p-4 rounded-xl bg-[#080B10]/80 border border-sky-500/10 space-y-2 opacity-75">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 font-bold">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>SECTORES 02–39 // ESTADO DE AVANCE</span>
                </div>
                <p className="text-xs text-zinc-500">
                  El progreso registrado no equivale a evidencia validada. Consultá cada sector para revisar misión, test y procedencia de las observaciones.
                </p>
                <details className="mt-3 text-xs text-zinc-300">
                  <summary className="cursor-pointer text-sky-300">Ver estado de los 40 sectores</summary>
                  <div className="mt-3 grid gap-1 sm:grid-cols-2">
                    {sectorStates.map(({ sector, status }) => <div key={sector.sectorId} className="p-2 rounded border border-sky-500/10">
                      Sector {sector.sectorNumber} · {sector.title}: <span className="text-sky-300">{statusText(status)}</span>
                    </div>)}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#080B10] p-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00A4EF]" />
            <span>Consolidado oficial de evidencias de La Biblia Negra de Windows.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-zinc-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#00A4EF]" />}
              {copied ? 'Copiado' : 'Copiar Registro'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,164,239,0.3)]"
            >
              <Download className="w-4 h-4" />
              Descargar Expediente (.TXT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
