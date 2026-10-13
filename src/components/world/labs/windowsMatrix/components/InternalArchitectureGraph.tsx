// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// INTERNAL ARCHITECTURE GRAPH — REAL KERNEL & SUBSYSTEM PIPELINE
// Visualizes what happens inside Windows concurrently behind the simulated monitor
// ============================================================================

import React from 'react';
import {
  Cpu,
  Layers,
  Terminal,
  Activity,
  HardDrive,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowDown,
  GitBranch,
  Server
} from 'lucide-react';
import { InternalArchitectureNode } from '../engine/types';

interface InternalArchitectureGraphProps {
  currentStepName: string;
  activeNodes: string[];
  completedNodes?: string[];
  blockedNodes?: string[];
  parallelBranches?: {
    name: string;
    items: string[];
  }[];
  failedNodeId?: string;
  phaseName: string;
  cpuPercent?: number;
  ramUsedMb?: number;
  diskActivityPercent?: number;
  simulatedTimestamp?: string;
  simulatedPid?: number;
  className?: string;
}

export const InternalArchitectureGraph: React.FC<InternalArchitectureGraphProps> = ({
  currentStepName,
  activeNodes,
  completedNodes = [],
  blockedNodes = [],
  parallelBranches,
  failedNodeId,
  phaseName,
  cpuPercent = 2.4,
  ramUsedMb = 2380,
  diskActivityPercent = 0.5,
  simulatedTimestamp = 'T+0.000s',
  simulatedPid,
  className = ''
}) => {
  // Master Architecture Tree Representation
  const CORE_HIERARCHY = [
    {
      tierId: 'firmware-loader',
      title: 'FIRMWARE & BOOTLOADER // ESP & EFI ENVIRONMENT',
      badge: 'PRE-KERNEL',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
      nodes: [
        { id: 'hw-power', label: 'PWR_OK / Reset', proc: 'Hardware', desc: 'Voltaje ATX estabilizado' },
        { id: 'uefi-bds', label: 'UEFI Firmware', proc: 'ROM SPI', desc: 'POST & Memory Training' },
        { id: 'esp-fat32', label: 'ESP FAT32', proc: 'GPT Partition', desc: '\\EFI\\Microsoft\\Boot\\' },
        { id: 'bcd-hive', label: 'BCD Hive', proc: 'Registry Store', desc: 'Boot Configuration Data' },
        { id: 'winload-loader', label: 'winload.efi', proc: 'OS Loader', desc: 'Paging & Kernel Transfer' }
      ]
    },
    {
      tierId: 'ring0',
      title: 'RING 0 // NÚCLEO NT (NTOSKRNL & HAL)',
      badge: 'PRIVILEGIADO',
      badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
      nodes: [
        { id: 'ntoskrnl-core', label: 'ntoskrnl.exe', proc: 'PID 4 (Ring 0)', desc: 'Kernel NT Principal' },
        { id: 'hal-core', label: 'hal.dll', proc: 'HAL ACPI', desc: 'Abstracción de Hardware' },
        { id: 'stornvme-sys', label: 'stornvme.sys', proc: 'Boot Driver', desc: 'Controlador de Almacenamiento' },
        { id: 'system-hive', label: 'SYSTEM Hive', proc: 'HKLM\\SYSTEM', desc: 'Colmena de Configuración' },
        { id: 'memory-manager', label: 'Memory Mgr', proc: 'Paging Pool', desc: 'Gestor de Memoria Virtual' }
      ]
    },
    {
      tierId: 'session0',
      title: 'SESIÓN 0 // SUBSISTEMA DE SERVICIOS Y SEGURIDAD',
      badge: 'AISLADO',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
      nodes: [
        { id: 'smss-process', label: 'smss.exe', proc: 'PID ~340', desc: 'Session Manager Subsystem' },
        { id: 'csrss-session0', label: 'csrss.exe (S0)', proc: 'PID ~480', desc: 'Client/Server Runtime' },
        { id: 'wininit-core', label: 'wininit.exe', proc: 'PID ~560', desc: 'Inicializador del Sistema' },
        { id: 'services-scm', label: 'services.exe', proc: 'SCM Master', desc: 'Service Control Manager' },
        { id: 'lsass-security', label: 'lsass.exe', proc: 'Security Token', desc: 'Local Security Authority' }
      ]
    },
    {
      tierId: 'session1',
      title: 'SESIÓN 1 // ENTORNO DE USUARIO & SHELL',
      badge: 'INTERACTIVO',
      badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
      nodes: [
        { id: 'winlogon-process', label: 'winlogon.exe', proc: 'Session 1', desc: 'Gestor de Inicio de Sesión' },
        { id: 'profsvc-service', label: 'ProfSvc / Hive', proc: 'NTUSER.DAT', desc: 'Perfil de Usuario (HKCU)' },
        { id: 'explorer-shell', label: 'explorer.exe', proc: 'Shell UI', desc: 'Barra de Tareas & Escritorio' },
        { id: 'dwm-compositor', label: 'dwm.exe', proc: 'DirectX 3D', desc: 'Desktop Window Manager' },
        { id: 'run-registry', label: 'Startup Apps', proc: 'HKCU Run', desc: 'Programas de Inicio / Tray' }
      ]
    }
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#090c12]/95 border border-cyan-950 shadow-2xl flex flex-col justify-between font-mono-tech select-none space-y-4 ${className}`}>
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D2FF]" />
          <span className="font-bold text-white text-xs sm:text-sm tracking-wider uppercase">
            WINDOWS INTERNO // CAPA ARQUITECTÓNICA VIVA
          </span>
          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            {simulatedTimestamp}
          </span>
          {simulatedPid !== undefined && simulatedPid > 0 && (
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
              PID: <strong className="text-white">{simulatedPid}</strong>
            </span>
          )}
        </div>

        {/* Real-time Hardware Metrology Meters */}
        <div className="flex items-center gap-2.5 text-[10.5px]">
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-cyan-950">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">CPU:</span>
            <span className="text-white font-bold">{cpuPercent.toFixed(1)}%</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-cyan-950">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-400">RAM:</span>
            <span className="text-white font-bold">{ramUsedMb} MB</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-cyan-950">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">DISK:</span>
            <span className="text-white font-bold">{diskActivityPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Tier Flow Architecture */}
      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {CORE_HIERARCHY.map((tier) => (
          <div
            key={tier.tierId}
            className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2 relative"
          >
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="font-bold text-zinc-300">{tier.title}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${tier.badgeColor}`}>
                {tier.badge}
              </span>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
              {tier.nodes.map((node) => {
                const isActive = activeNodes.includes(node.id);
                const isCompleted = completedNodes.includes(node.id);
                const isFailed = failedNodeId === node.id;
                const isBlocked = blockedNodes.includes(node.id);

                let cardStyle = 'bg-zinc-950/50 border-zinc-900/80 text-zinc-600 opacity-50';
                let indicator = 'bg-zinc-700';
                let statusLabel = 'WAITING';

                if (isFailed) {
                  cardStyle =
                    'bg-rose-950/60 border-rose-500 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.5)] opacity-100 ring-2 ring-rose-400 animate-pulse';
                  indicator = 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
                  statusLabel = 'FAILED';
                } else if (isBlocked) {
                  cardStyle =
                    'bg-amber-950/30 border-dashed border-amber-600/70 text-amber-300/80 opacity-75';
                  indicator = 'bg-amber-500';
                  statusLabel = 'BLOCKED';
                } else if (isActive) {
                  cardStyle =
                    'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,210,255,0.4)] opacity-100 ring-2 ring-cyan-400';
                  indicator = 'bg-cyan-400 shadow-[0_0_8px_#00d2ff] animate-ping';
                  statusLabel = 'ACTIVE';
                } else if (isCompleted) {
                  cardStyle =
                    'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 opacity-90 shadow-sm';
                  indicator = 'bg-emerald-400 shadow-[0_0_6px_#10b981]';
                  statusLabel = 'COMPLETED';
                }

                return (
                  <div
                    key={node.id}
                    className={`p-2 rounded-lg border transition-all duration-300 flex flex-col justify-between space-y-1 relative ${cardStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate text-[10px]">{node.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${indicator}`} />
                    </div>
                    <div className="text-[8.5px] font-mono truncate text-zinc-400">{node.proc}</div>
                    <div className="flex items-center justify-between pt-0.5 text-[8px] font-mono-tech border-t border-white/5">
                      <span className="truncate text-zinc-400">{node.desc}</span>
                      <span className="font-black text-[7.5px] opacity-75">{statusLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Parallel Branches Viewer (If present in current step) */}
        {parallelBranches && parallelBranches.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-zinc-950 to-black border-2 border-cyan-500/50 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-cyan-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                EJECUCIÓN EN PARALELO MULTI-HILO (RAMAS ASÍNCRONAS)
              </span>
              <span className="text-[9.5px] text-zinc-400 font-mono">SCM DISPATCHER ACTIVE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {parallelBranches.map((branch, bIdx) => (
                <div
                  key={bIdx}
                  className="p-2.5 rounded-lg bg-black/70 border border-cyan-950 space-y-1.5 text-[10px]"
                >
                  <span className="font-bold text-cyan-300 block truncate uppercase text-[9.5px]">
                    {branch.name}
                  </span>
                  <div className="space-y-1 text-zinc-300 font-mono-tech">
                    {branch.items.map((it, itIdx) => (
                      <div key={itIdx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Node Legend */}
      <div className="pt-2 border-t border-cyan-950/80 flex flex-wrap items-center justify-between text-[10px] text-zinc-400 gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00D2FF]" />
            <span className="text-cyan-300 font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            <span className="text-emerald-300">COMPLETED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="text-zinc-500">WAITING</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#F43F5E]" />
            <span className="text-rose-400 font-bold">FAILED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-300">BLOCKED</span>
          </div>
        </div>

        <span className="text-zinc-500">
          Etapa actual: <strong className="text-white">{currentStepName}</strong>
        </span>
      </div>
    </div>
  );
};
