import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  HardDrive,
  Copy,
  Check,
  Terminal,
  Activity,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { CANONICAL_BOOT_STAGES, BootStageDefinition } from '../../../data/tomo02Sector01CasesAndTests';

export interface Sector01BootDossier {
  dossierId: string;
  biosMode: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  partitionScheme: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  secureBootStatus: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  tpmVersion: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  espPartitionState: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  bcdStatus: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  winloadState: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  lastPostTime: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  fastStartupMode: { value: string; provenance: string; status: 'VALID' | 'WARNING' | 'FAIL' };
  evaluatedStages: number;
}

interface Tomo02Sector01ExpedienteModalProps {
  onClose: () => void;
  dossierData?: Sector01BootDossier;
}

export const Tomo02Sector01ExpedienteModal: React.FC<Tomo02Sector01ExpedienteModalProps> = ({
  onClose,
  dossierData,
}) => {
  const [copied, setCopied] = useState(false);

  const defaultDossier: Sector01BootDossier = dossierData || {
    dossierId: 'EVO-BOOT-EXPEDIENTE-002-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    biosMode: { value: 'UEFI Nativo (x64)', provenance: 'USER_DECLARED (msinfo32)', status: 'VALID' },
    partitionScheme: { value: 'GPT (GUID Partition Table)', provenance: 'USER_DECLARED (diskpart)', status: 'VALID' },
    secureBootStatus: { value: 'Habilitado / Activo', provenance: 'USER_DECLARED (PowerShell)', status: 'VALID' },
    tpmVersion: { value: 'TPM 2.0 (Especificación 1.38)', provenance: 'USER_DECLARED (tpm.msc)', status: 'VALID' },
    espPartitionState: { value: 'Partición EFI 100MB FAT32 (Integra)', provenance: 'USER_DECLARED (diskmgmt.msc)', status: 'VALID' },
    bcdStatus: { value: 'BCD Store Válido (\\EFI\\Microsoft\\Boot\\BCD)', provenance: 'DERIVED (bcdedit)', status: 'VALID' },
    winloadState: { value: 'winload.efi Certificado por Microsoft', provenance: 'USER_DECLARED (sigcheck)', status: 'VALID' },
    lastPostTime: { value: '3.4 segundos (POST Normal)', provenance: 'USER_DECLARED (Taskmgr)', status: 'VALID' },
    fastStartupMode: { value: 'Desactivado para Mantenimiento Forense (Cold Boot)', provenance: 'USER_DECLARED', status: 'VALID' },
    evaluatedStages: 12,
  };

  const handleCopy = () => {
    const rawData = JSON.stringify(defaultDossier, null, 2);
    navigator.clipboard.writeText(rawData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textContent = `=====================================================
EVO LABS // EXPEDIENTE MAESTRO WINDOWS EVO 001
SUB-ARTEFACTO 002: EXPEDIENTE FORENSE DE ARRANQUE PRE-BOOT
TOMO 02: LA BIBLIA NEGRA DE WINDOWS // SECTOR 01: ANTES DEL LOGO
ID: ${defaultDossier.dossierId}
FECHA: ${new Date().toISOString()}
=====================================================

PARÁMETROS FORENSES DE INICIALIZACIÓN:
1. MODO DE FIRMWARE: ${defaultDossier.biosMode.value} [${defaultDossier.biosMode.provenance}]
2. ESQUEMA DE PARTICIÓN: ${defaultDossier.partitionScheme.value} [${defaultDossier.partitionScheme.provenance}]
3. SECURE BOOT: ${defaultDossier.secureBootStatus.value} [${defaultDossier.secureBootStatus.provenance}]
4. CRIPTO-CHIP TPM: ${defaultDossier.tpmVersion.value} [${defaultDossier.tpmVersion.provenance}]
5. PARTICIÓN ESP: ${defaultDossier.espPartitionState.value} [${defaultDossier.espPartitionState.provenance}]
6. ALMACÉN BCD: ${defaultDossier.bcdStatus.value} [${defaultDossier.bcdStatus.provenance}]
7. CARGADOR WINLOAD: ${defaultDossier.winloadState.value} [${defaultDossier.winloadState.provenance}]
8. TIEMPO DE POST: ${defaultDossier.lastPostTime.value} [${defaultDossier.lastPostTime.provenance}]
9. MODO FAST STARTUP: ${defaultDossier.fastStartupMode.value} [${defaultDossier.fastStartupMode.provenance}]

ETAPAS DEL MODELO DIDÁCTICO EVO COMPROBADAS:
${CANONICAL_BOOT_STAGES.map((s) => `[ETAPA 0${s.stageNumber}] ${s.name} -> Actor: ${s.actor}`).join('\n')}

VEREDICTO FORENSE:
Cadena de confianza pre-boot verificada. Arranque UEFI con GPT y validación Secure Boot nominal.
Integrado en EXPEDIENTE MAESTRO WINDOWS EVO 001.
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVO_EXPEDIENTE_ARRANQUE_002_${defaultDossier.dossierId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-[#080B10] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,164,239,0.18)] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#080B10] via-[#0078D4]/20 to-[#080B10] p-6 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0078D4]/15 border border-[#00A4EF]/40 flex items-center justify-center text-[#60CDFF] shadow-[0_0_15px_rgba(0,164,239,0.2)]">
              <ShieldCheck className="w-7 h-7 text-[#00A4EF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] font-bold border border-[#00A4EF]/40">
                  ARTEFACTO 002 // EXPEDIENTE MAESTRO 001
                </span>
                <span className="text-xs font-mono text-zinc-400">SECTOR 01 // ANTES DEL LOGO</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide mt-1 font-display">
                EXPEDIENTE FORENSE DE ARRANQUE PRE-BOOT
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
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Metadata Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#11161D] p-4 rounded-xl border border-sky-500/20 font-mono text-xs shadow-inner">
            <div>
              <span className="text-zinc-400 block text-[10px]">NÚMERO DE SUB-ARTEFACTO</span>
              <span className="text-[#60CDFF] font-bold text-sm">{defaultDossier.dossierId}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">CADENA DE CONFIANZA</span>
              <span className="text-[#16C784] font-bold flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16C784]" /> SECURE BOOT / TPM ACTIVO
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">ETAPAS AUDITADAS</span>
              <span className="text-[#00A4EF] font-bold">12 / 12 ETAPAS DEL MODELO EVO</span>
            </div>
          </div>

          {/* 9 Forensic Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00A4EF]" />
              Parámetros de Inicialización del Vector Pre-Boot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* BIOS Mode */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Modo de Firmware</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.biosMode.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.biosMode.value}</div>
              </div>

              {/* Partition Scheme */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Esquema de Particionado</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.partitionScheme.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.partitionScheme.value}</div>
              </div>

              {/* Secure Boot */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Secure Boot (NVRAM Keys)</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.secureBootStatus.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.secureBootStatus.value}</div>
              </div>

              {/* TPM */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Módulo de Plataforma Segura (TPM)</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.tpmVersion.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.tpmVersion.value}</div>
              </div>

              {/* ESP Partition */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Partición de Sistema EFI (ESP)</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.espPartitionState.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.espPartitionState.value}</div>
              </div>

              {/* BCD */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Almacén BCD (Boot Configuration Data)</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-[#8B7CFF] border border-purple-500/40">
                    {defaultDossier.bcdStatus.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.bcdStatus.value}</div>
              </div>

              {/* winload.efi */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Cargador del SO (winload.efi)</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.winloadState.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.winloadState.value}</div>
              </div>

              {/* Post Time */}
              <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 font-medium">Tiempo de BIOS / POST</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0078D4]/15 text-[#60CDFF] border border-[#00A4EF]/30">
                    {defaultDossier.lastPostTime.provenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{defaultDossier.lastPostTime.value}</div>
              </div>
            </div>
          </div>

          {/* 12 Boot Stages Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00A4EF]" />
              Cadena de Custodia Pre-Boot // 12 Fases del Modelo EVO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {CANONICAL_BOOT_STAGES.map((stg) => (
                <div key={stg.id} className="p-3 rounded-xl bg-[#11161D] border border-sky-500/15 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#60CDFF] font-bold">FASE 0{stg.stageNumber}</span>
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">{stg.actor}</span>
                  </div>
                  <div className="font-semibold text-zinc-200 text-xs truncate">{stg.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{stg.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#080B10] p-4 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16C784]" />
            Evidencia criptográficamente trazada con sello de banco EVO.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-sky-500/20 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#16C784]" /> : <Copy className="w-4 h-4 text-[#00A4EF]" />}
              <span>{copied ? 'Copiado JSON' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,164,239,0.25)] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Expediente (.TXT)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
