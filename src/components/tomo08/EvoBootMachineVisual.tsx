import React from 'react';
import { BootStep, MachineComponentId } from './bootSequenceData';
import {
  Zap,
  Cpu,
  HardDrive,
  Monitor,
  Shield,
  Layers,
  Activity,
  Terminal,
  Server,
  Power,
  Sliders,
  CheckCircle2,
  Lock,
  Flame,
} from 'lucide-react';

interface EvoBootMachineVisualProps {
  currentStep: BootStep;
  isPoweredOn: boolean;
}

export const EvoBootMachineVisual: React.FC<EvoBootMachineVisualProps> = ({
  currentStep,
  isPoweredOn,
}) => {
  const isComponentActive = (id: MachineComponentId) => {
    return isPoweredOn && currentStep.activeComponents.includes(id);
  };

  const isComponentEverReached = (minStep: number) => {
    return isPoweredOn && currentStep.stepNumber >= minStep;
  };

  return (
    <div className="w-full bg-[#07090e] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden font-mono-tech shadow-2xl select-none">
      {/* Background technical grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Header status bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              !isPoweredOn
                ? 'bg-zinc-600'
                : currentStep.stepNumber === 34
                ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]'
                : 'bg-amber-400 animate-pulse shadow-[0_0_10px_#f59e0b]'
            }`}
          />
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
            ESTADO DE MÁQUINA //{' '}
            <span
              style={{
                color: !isPoweredOn ? '#71717a' : currentStep.layerColor,
              }}
            >
              {!isPoweredOn ? 'OFF (APAGADO)' : currentStep.powerState}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            CAPA:{' '}
            <strong style={{ color: currentStep.layerColor }}>
              {currentStep.layer}
            </strong>
          </span>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">
            ESQUEMÁTICO DE SILICIO & ARRANQUE
          </span>
        </div>
      </div>

      {/* Main visual architecture layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative z-10">
        {/* ========================================================================= */}
        {/* COL 1: HARDWARE FÍSICO Y ENERGÍA (PSU, MOTHERBOARD, VRM, CHIPSET)        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>1. CADENA ELÉCTRICA & PCB</span>
          </div>

          {/* PSU (Fuente de Poder) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('psu')
                ? 'bg-amber-500/10 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : isComponentEverReached(1)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Power
                  className={`w-4 h-4 ${
                    isComponentActive('psu')
                      ? 'text-amber-400 animate-pulse'
                      : isComponentEverReached(1)
                      ? 'text-amber-500/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">FUENTE ATX (PSU)</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber === 0
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 5
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {currentStep.stepNumber === 0
                  ? '0V OFF'
                  : currentStep.stepNumber < 4
                  ? '+5VSB ACTIVE'
                  : '+12V / +5V / +3.3V PWR_OK'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Conmutador primario, rieles de potencia y supervisor de estabilidad PWR_OK.
            </p>
          </div>

          {/* MOTHERBOARD & CHIPSET */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('motherboard')
                ? 'bg-cyan-500/10 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : isComponentEverReached(1)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Sliders
                  className={`w-4 h-4 ${
                    isComponentActive('motherboard')
                      ? 'text-cyan-400 animate-pulse'
                      : isComponentEverReached(1)
                      ? 'text-cyan-500/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">MOTHERBOARD & BUSES</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 6
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                }`}
              >
                {currentStep.stepNumber < 6 ? 'STANDBY / RESET' : 'DMI & PCIe SYNC'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Super I/O, lógica de reset, VRM de fases de potencia y enlace DMI/Infinity Fabric.
            </p>
          </div>

          {/* SPI FLASH FIRMWARE (UEFI) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('firmware')
                ? 'bg-purple-500/10 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                : isComponentEverReached(7)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Shield
                  className={`w-4 h-4 ${
                    isComponentActive('firmware')
                      ? 'text-purple-400 animate-pulse'
                      : isComponentEverReached(7)
                      ? 'text-purple-400/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">FIRMWARE SPI (UEFI)</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 7
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 20
                    ? 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {currentStep.stepNumber < 7
                  ? 'IDLE'
                  : currentStep.stepNumber < 20
                  ? 'SEC / PEI / DXE'
                  : 'HANDOFF EXIT'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Código máquina x86 de bajo nivel, POST, microcódigo y tablas ACPI.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COL 2: COMPONENTES DE PROCESAMIENTO (CPU, RAM, GPU, STORAGE)              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>2. SILICIO & ARQUITECTURA</span>
          </div>

          {/* CPU & IMC */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('cpu')
                ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                : isComponentEverReached(6)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Cpu
                  className={`w-4 h-4 ${
                    isComponentActive('cpu')
                      ? 'text-cyan-400 animate-spin'
                      : isComponentEverReached(6)
                      ? 'text-cyan-400/80'
                      : 'text-zinc-600'
                  }`}
                  style={{ animationDuration: '6s' }}
                />
                <span className="font-bold text-xs text-white">CPU & CONTROLADOR IMC</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 6
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 13
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {currentStep.stepNumber < 6
                  ? 'RESET 0V'
                  : currentStep.stepNumber < 13
                  ? 'CAR / INIT'
                  : 'RING 0 ACTIVE'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Bootstrap processor, ejecución de microcódigo, registros CR0/CR4 y controladores de memoria.
            </p>
          </div>

          {/* MEMORIA RAM */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('ram')
                ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                : isComponentEverReached(11)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Activity
                  className={`w-4 h-4 ${
                    isComponentActive('ram')
                      ? 'text-emerald-400 animate-pulse'
                      : isComponentEverReached(11)
                      ? 'text-emerald-400/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">MEMORIA RAM (DRAM)</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 11
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 13
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {currentStep.stepNumber < 11
                  ? 'UNCONFIGURED'
                  : currentStep.stepNumber < 13
                  ? 'TRAINING SPD'
                  : 'DUAL CHANNEL OK'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Entrenamiento de latencias, lectura SPD y mapeo de direcciones de memoria física.
            </p>
          </div>

          {/* GPU & STORAGE (GRID INTERNO) */}
          <div className="grid grid-cols-2 gap-2">
            {/* GPU */}
            <div
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isComponentActive('gpu')
                  ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : isComponentEverReached(15)
                  ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold text-[11px] text-white">GPU & VIDEO</span>
              </div>
              <span className="text-[9px] text-zinc-400 block font-sans-editorial">
                {currentStep.stepNumber < 15 ? 'VBIOS Off' : 'GOP / Display Active'}
              </span>
            </div>

            {/* STORAGE SSD */}
            <div
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isComponentActive('storage')
                  ? 'bg-teal-500/15 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                  : isComponentEverReached(16)
                  ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-[11px] text-white">SSD NVMe / ESP</span>
              </div>
              <span className="text-[9px] text-zinc-400 block font-sans-editorial">
                {currentStep.stepNumber < 16 ? 'Unmounted' : 'NVMe PCIe Gen4 Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COL 3: SOFTWARE, KERNEL & SISTEMA OPERATIVO WINDOWS                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>3. ARRANQUE & WINDOWS NT</span>
          </div>

          {/* BOOTLOADER / WINLOAD */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('bootManager')
                ? 'bg-blue-500/15 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : isComponentEverReached(21)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Layers
                  className={`w-4 h-4 ${
                    isComponentActive('bootManager')
                      ? 'text-blue-400 animate-pulse'
                      : isComponentEverReached(21)
                      ? 'text-blue-400/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">BOOT MANAGER & WINLOAD</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 21
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 24
                    ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {currentStep.stepNumber < 21
                  ? 'WAITING'
                  : currentStep.stepNumber < 24
                  ? 'BCD / WINLOAD.EFI'
                  : 'LOADED'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Lectura del almacén BCD, Secure Boot y carga de ntoskrnl.exe / hal.dll.
            </p>
          </div>

          {/* KERNEL & DRIVERS */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('kernel') || isComponentActive('drivers')
                ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : isComponentEverReached(24)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Server
                  className={`w-4 h-4 ${
                    isComponentActive('kernel') || isComponentActive('drivers')
                      ? 'text-emerald-400 animate-pulse'
                      : isComponentEverReached(24)
                      ? 'text-emerald-400/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">KERNEL NT & BOOT DRIVERS</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 24
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 28
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-emerald-400/20 text-emerald-300'
                }`}
              >
                {currentStep.stepNumber < 24
                  ? 'NOT IN RAM'
                  : currentStep.stepNumber < 28
                  ? 'PHASE 0/1 INIT'
                  : 'RING 0 OPERATIONAL'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              Controladores BOOT_START (stornvme, ntfs) e inicialización del planificador.
            </p>
          </div>

          {/* SERVICES, SESSION & DESKTOP */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              isComponentActive('services') ||
              isComponentActive('userSession') ||
              isComponentActive('desktop')
                ? 'bg-rose-500/15 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                : isComponentEverReached(28)
                ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    isComponentActive('desktop')
                      ? 'text-emerald-400 animate-bounce'
                      : isComponentActive('userSession') || isComponentActive('services')
                      ? 'text-rose-400 animate-pulse'
                      : isComponentEverReached(28)
                      ? 'text-rose-400/80'
                      : 'text-zinc-600'
                  }`}
                />
                <span className="font-bold text-xs text-white">SESIÓN & ESCRITORIO</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  currentStep.stepNumber < 28
                    ? 'bg-zinc-800 text-zinc-500'
                    : currentStep.stepNumber < 34
                    ? 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {currentStep.stepNumber < 28
                  ? 'NO USER'
                  : currentStep.stepNumber < 33
                  ? 'LOGON / SMSS'
                  : currentStep.stepNumber === 33
                  ? 'EXPLORER.EXE'
                  : 'WINDOWS 100% LISTO'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight font-sans-editorial">
              smss.exe, winlogon, montaje de NTUSER.DAT, DWM y renderizado de Explorer.
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Monitor Display Screen */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span>SALIDA VISUAL EN PANTALLA (MONITOR SIMULADO)</span>
          </span>
          <span className="text-[9px] text-zinc-500 font-mono-tech">
            RESOLUCIÓN:{' '}
            {currentStep.stepNumber < 15
              ? 'SIN SEÑAL'
              : currentStep.stepNumber < 29
              ? '1024x768 (GOP VESA)'
              : 'NATIVA (DIRECTX DWM)'}
          </span>
        </div>

        <div className="w-full bg-black rounded-xl border border-zinc-800 p-4 min-h-[90px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          {!isPoweredOn || currentStep.stepNumber < 15 ? (
            <div className="text-center space-y-1">
              <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">
                [ NO DISPLAY SIGNAL / STANDBY ]
              </span>
              <p className="text-[10px] text-zinc-700 font-sans-editorial">
                El transmisor de video de la GPU aún no ha sido inicializado por el microcódigo.
              </p>
            </div>
          ) : currentStep.stepNumber < 22 ? (
            <div className="text-center space-y-2 animate-in fade-in duration-300">
              <div className="text-cyan-400 font-display font-black text-xl tracking-widest uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                ⚡ EVO LABS ARCHITECTURE
              </div>
              <div className="text-[10px] text-zinc-400 font-mono-tech flex items-center justify-center gap-3">
                <span>POST PASSED</span>
                <span>•</span>
                <span>PRESS DEL/F2 TO ENTER UEFI SETUP</span>
              </div>
            </div>
          ) : currentStep.stepNumber < 31 ? (
            <div className="text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 mx-auto border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
              <div className="text-[11px] text-zinc-300 font-mono-tech tracking-wider uppercase">
                INICIANDO WINDOWS NT SUBSYSTEM...
              </div>
            </div>
          ) : currentStep.stepNumber < 33 ? (
            <div className="text-center space-y-1.5 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-300 text-xs font-bold font-mono-tech">
                EVO
              </div>
              <div className="text-xs font-bold text-white uppercase font-display tracking-wider">
                BIENVENIDO // INICIANDO SESIÓN
              </div>
              <p className="text-[10px] text-zinc-400 font-sans-editorial">
                Cargando registro de usuario NTUSER.DAT y servicios de personalización.
              </p>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between px-4 py-1.5 bg-[#0e121a] rounded-lg border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-[10px]">
                  ⊞
                </div>
                <div>
                  <div className="text-xs font-bold text-white">ESCRITORIO DE WINDOWS LISTO</div>
                  <div className="text-[9px] text-emerald-400 font-mono-tech">
                    ● DWM.EXE & EXPLORER.EXE ACTIVOS // ESTADO BASAL IDLE
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-zinc-400 font-mono-tech hidden sm:inline">
                SISTEMA OPERATIVO 100% OPERATIVO
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
