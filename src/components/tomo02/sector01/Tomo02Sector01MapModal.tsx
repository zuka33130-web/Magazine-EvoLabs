import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  Layers,
  HardDrive,
  Shield,
  Activity,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { CANONICAL_BOOT_STAGES } from '../../../data/tomo02Sector01CasesAndTests';

interface Tomo02Sector01MapModalProps {
  onClose: () => void;
  userBootMode?: string;
  userSecureBoot?: string;
  userTpm?: string;
  userVirt?: string;
}

export const Tomo02Sector01MapModal: React.FC<Tomo02Sector01MapModalProps> = ({
  onClose,
  userBootMode = 'UEFI (Nativo)',
  userSecureBoot = 'Activado (Enabled)',
  userTpm = 'TPM 2.0 (Listo para uso)',
  userVirt = 'Habilitado (VT-x / SVM)',
}) => {
  const [copied, setCopied] = useState(false);

  const artifactData = {
    artifactId: 'EVO-BOOT-MAP-001-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    title: 'BOOT & FIRMWARE MAP EVO 001',
    edition: 'La Biblia Negra de Windows // Sector 01',
    systemConfig: {
      bootMode: userBootMode,
      secureBoot: userSecureBoot,
      tpmVersion: userTpm,
      virtualization: userVirt,
      partitionStyle: 'GPT (GUID Partition Table)',
      primaryLoader: '\\EFI\\Microsoft\\Boot\\bootmgfw.efi',
    },
    bootPipeline: CANONICAL_BOOT_STAGES.map((s) => ({
      stage: s.stageNumber,
      name: s.name,
      actor: s.actor,
      possibleFailure: s.possibleFailure,
    })),
    timestamp: new Date().toISOString(),
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(artifactData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090c12] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#06080d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono-tech font-black text-sm">
              001
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech font-bold text-cyan-400 uppercase tracking-widest">
                  ARTEFACTO PERICIAL OFICIAL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono-tech text-emerald-400 font-bold">
                  EXPEDIENTE EXPANDIDO
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
                BOOT & FIRMWARE MAP EVO 001
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIADO' : 'EXPORTAR JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Identity & Firmware Configuration Box */}
          <div className="p-4 rounded-xl bg-[#0d131f] border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
              <span className="text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                PARÁMETROS DE FIRMWARE Y SEGURIDAD PRE-BOOT
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">
                ORIGEN: SYSTEM_REPORTED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400">MODO DE FIRMWARE</div>
                <div className="text-xs font-mono-tech font-bold text-cyan-300">{userBootMode}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400">SECURE BOOT</div>
                <div className="text-xs font-mono-tech font-bold text-emerald-400">{userSecureBoot}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400">CHIP CRIPTOGRÁFICO</div>
                <div className="text-xs font-mono-tech font-bold text-yellow-400">{userTpm}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono-tech text-zinc-400">VIRTUALIZACIÓN VT-X</div>
                <div className="text-xs font-mono-tech font-bold text-purple-400">{userVirt}</div>
              </div>
            </div>
          </div>

          {/* 13 Canonical Boot Stages Flow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono-tech text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                MAPA CANÓNICO DE 13 ETAPAS DE ARRANQUE
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">
                CADENA COMPLETA DE DESPLIEGUE
              </span>
            </div>

            <div className="space-y-2">
              {CANONICAL_BOOT_STAGES.map((stg) => (
                <div
                  key={stg.id}
                  className="p-3.5 rounded-xl bg-[#0a0f18] border border-zinc-800/80 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-tech"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-black flex items-center justify-center shrink-0">
                      {stg.stageNumber}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">{stg.name}</div>
                      <div className="text-[11px] text-zinc-400 font-sans-editorial">{stg.description}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                      Actor: {stg.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#06080d] flex items-center justify-between shrink-0">
          <span className="text-xs font-mono-tech text-zinc-400">
            ARTEFACTO INTEGRADO AL EXPEDIENTE WINDOWS EVO 001
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20"
          >
            CERRAR MAPA
          </button>
        </div>

      </div>
    </div>
  );
};
