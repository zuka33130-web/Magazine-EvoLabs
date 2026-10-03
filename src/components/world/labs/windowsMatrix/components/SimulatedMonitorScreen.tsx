// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// SIMULATED WINDOWS MONITOR SCREEN — HIGH-FIDELITY TECHNICAL MONITOR
// Not an empty rectangle: Authentic, credible representation of Windows screens
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Power,
  RotateCcw,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Search,
  Sliders,
  Terminal,
  Cpu,
  Layers,
  HardDrive,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Folder,
  X,
  Minus,
  Square,
  Maximize2
} from 'lucide-react';
import { SimulationScreenState } from '../engine/types';

interface SimulatedMonitorScreenProps {
  screenState: SimulationScreenState;
  bsodCode?: string;
  userAvatarName?: string;
  isAudioBroken?: boolean;
  isNetworkBroken?: boolean;
  customOverlayText?: string;
  diskLedActive?: boolean;
  onScreenClick?: () => void;
  className?: string;
}

export const SimulatedMonitorScreen: React.FC<SimulatedMonitorScreenProps> = ({
  screenState,
  bsodCode = 'CRITICAL_PROCESS_DIED',
  userAvatarName = 'Investigador EVO',
  isAudioBroken = false,
  isNetworkBroken = false,
  customOverlayText,
  diskLedActive = false,
  onScreenClick,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState<string>('14:32');
  const [currentDate, setCurrentDate] = useState<string>('Viernes, 24 de Octubre');
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Physical Monitor Bezel */}
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#181a20] via-[#101216] to-[#0a0c0f] p-3 sm:p-4 border-2 border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,210,255,0.08)] relative">
        {/* Top Webcam / Sensor Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-zinc-700" />
          <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700" />
        </div>

        {/* Screen Display Area (Aspect Ratio 16:10 or 16:9) */}
        <div
          onClick={onScreenClick}
          className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-lg overflow-hidden bg-black border border-zinc-800 flex flex-col justify-between font-sans shadow-inner cursor-pointer"
        >
          {/* Subtle CRT / Glass Scanline & Glare Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent z-30" />
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-30" />

          {/* ========================================================
              STATE 1: POWER OFF
          ======================================================== */}
          {screenState === 'power-off' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#050608] text-zinc-600 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700">
                <Power className="w-6 h-6" />
              </div>
              <div className="text-center font-mono-tech">
                <span className="text-xs uppercase tracking-widest block text-zinc-500 font-bold">
                  SIN SEÑAL DE VIDEO
                </span>
                <span className="text-[10px] text-zinc-700">DisplayPort 1.4 // Standby</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 2: UEFI / BIOS
          ======================================================== */}
          {screenState === 'uefi-bios' && (
            <div className="w-full h-full bg-[#0a0f1d] text-zinc-200 p-3 sm:p-4 font-mono-tech text-xs flex flex-col justify-between">
              {/* UEFI Header Bar */}
              <div className="flex items-center justify-between border-b border-cyan-800/80 pb-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">EVO UEFI BIOS UTILITY</span>
                  <span className="text-zinc-500">- Ver. 2.22.1284 x64</span>
                </div>
                <div className="text-zinc-400 flex items-center gap-3 text-[10px]">
                  <span>CPU: 38°C</span>
                  <span>Vcore: 1.21V</span>
                  <span className="text-emerald-400 font-bold">Secure Boot: ENABLED</span>
                </div>
              </div>

              {/* UEFI Main Configuration Area */}
              <div className="grid grid-cols-2 gap-3 flex-1 py-3 text-[10.5px]">
                <div className="p-2.5 rounded bg-black/60 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block uppercase border-b border-cyan-950 pb-1">
                    HARDWARE DETECTADO
                  </span>
                  <div className="space-y-1 text-zinc-300">
                    <div>Procesador: x86-64 Architecture 16-Core</div>
                    <div>Memoria: 32768 MB DDR5-6000 MT/s</div>
                    <div>NVMe Slot 1: Samsung 990 PRO 1TB [OK]</div>
                    <div>SATA Port 1: Vacio</div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-cyan-950 space-y-1.5">
                  <span className="text-amber-400 font-bold block uppercase border-b border-cyan-950 pb-1">
                    PRIORIDAD DE ARRANQUE (BDS)
                  </span>
                  <div className="space-y-1 text-zinc-300">
                    <div className="text-cyan-300 font-bold">1. Windows Boot Manager (NVMe)</div>
                    <div className="text-zinc-500">2. UEFI USB Drive (Generic Flash)</div>
                    <div className="text-zinc-500">3. Disabled</div>
                  </div>
                </div>
              </div>

              {/* Bottom Key Navigation Help */}
              <div className="pt-2 border-t border-cyan-950 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>[F2/DEL] Setup • [F8] Boot Menu • [F10] Save & Exit</span>
                <span className="text-cyan-400 font-bold">POST STATUS: 0x99 (SUCCESS)</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 3: BOOT ORDER
          ======================================================== */}
          {screenState === 'boot-order' && (
            <div className="w-full h-full bg-[#050810] text-zinc-200 p-4 font-mono-tech text-xs flex flex-col justify-between">
              <div className="space-y-1 border-b border-cyan-950 pb-2">
                <span className="text-cyan-400 font-bold uppercase tracking-wider block text-xs">
                  BOOT DEVICE SELECTION MENU
                </span>
                <span className="text-zinc-500 text-[10px]">
                  Por favor seleccione el dispositivo de inicio del sistema:
                </span>
              </div>

              <div className="max-w-md mx-auto w-full my-auto space-y-2">
                <div className="p-3 rounded bg-cyan-950/60 border border-cyan-400 text-white font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Windows Boot Manager (Samsung NVMe SSD 1TB)
                  </span>
                  <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-black">
                    ACTIVO
                  </span>
                </div>
                <div className="p-3 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-600" />
                    UEFI USB Flash Drive (Install Media)
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 text-center">
                Use las teclas ↑ / ↓ para elegir y ENTER para arrancar.
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 4: WINDOWS LOGO & ROTATING SPINNER
          ======================================================== */}
          {screenState === 'boot-spinner' && (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white space-y-8">
              {/* Windows 11 Square Logo */}
              <div className="grid grid-cols-2 gap-1 w-14 h-14">
                <div className="bg-[#0078D4] rounded-[1px]" />
                <div className="bg-[#0078D4] rounded-[1px]" />
                <div className="bg-[#0078D4] rounded-[1px]" />
                <div className="bg-[#0078D4] rounded-[1px]" />
              </div>

              {/* Windows Dotted Spinner Animation */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/90 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse delay-200" />
                <span className="w-2 h-2 rounded-full bg-white/10" />
              </div>

              <div className="font-sans text-xs text-zinc-400 font-medium tracking-wide">
                Preparando Windows...
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 5: LOGIN / LOCK SCREEN
          ======================================================== */}
          {screenState === 'login' && (
            <div className="relative w-full h-full bg-[#0a192f] bg-gradient-to-b from-[#0c2340] via-[#091426] to-[#040812] text-white flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
              <div className="text-left space-y-1">
                <div className="text-4xl sm:text-5xl font-light tracking-tight">{currentTime}</div>
                <div className="text-xs sm:text-sm text-cyan-200/80 font-medium">{currentDate}</div>
              </div>

              {/* Central User Avatar & Password Box */}
              <div className="mx-auto flex flex-col items-center space-y-2 max-w-xs text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-400 border-2 border-white/60 shadow-xl flex items-center justify-center text-white text-xl font-bold">
                  {userAvatarName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-base font-semibold">{userAvatarName}</div>
                <div className="w-48 h-8 rounded-md bg-white/15 backdrop-blur-md border border-white/30 flex items-center px-2.5 text-xs text-white/70 justify-between">
                  <span>••••••••</span>
                  <span className="text-white text-xs font-bold">➔</span>
                </div>
                <span className="text-[10px] text-cyan-300/80">Windows Hello / PIN</span>
              </div>

              {/* Bottom Right Corner Quick Controls */}
              <div className="flex items-center justify-end gap-3 text-white/80">
                <Wifi className="w-4 h-4" />
                <Volume2 className="w-4 h-4" />
                <Power className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 6: DESKTOP / STABLE / STARTUP / SERVICES LOADING
          ======================================================== */}
          {(screenState === 'desktop' ||
            screenState === 'startup' ||
            screenState === 'services-loading' ||
            screenState === 'stable') && (
            <div className="relative w-full h-full bg-gradient-to-br from-[#0c1829] via-[#060c14] to-[#03060a] text-white flex flex-col justify-between overflow-hidden">
              {/* Desktop Wallpaper Bloom */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[90px]" />
                <div className="w-[250px] h-[250px] rounded-full bg-blue-600/10 blur-[80px]" />
              </div>

              {/* Desktop Icons Area */}
              <div className="relative z-10 p-3 sm:p-4 grid grid-cols-1 gap-3 w-24">
                <div className="flex flex-col items-center gap-1 text-center p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <span className="text-[9.5px] font-sans text-zinc-200 drop-shadow">Este equipo</span>
                </div>

                <div className="flex flex-col items-center gap-1 text-center p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[9.5px] font-sans text-zinc-200 drop-shadow">Seguridad</span>
                </div>

                <div className="flex flex-col items-center gap-1 text-center p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="text-[9.5px] font-sans text-zinc-200 drop-shadow">Terminal EVO</span>
                </div>
              </div>

              {/* Startup Notification Toast Banner if in startup/services/stable */}
              {screenState === 'startup' && (
                <div className="absolute top-3 right-3 z-20 p-2.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 shadow-xl flex items-center gap-2.5 max-w-xs animate-bounce">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-left font-sans leading-tight">
                    <span className="text-[10px] font-bold text-cyan-300 block">DESKTOP VISIBLE</span>
                    <span className="text-[9px] text-zinc-300">System still busy: cargando tareas de inicio...</span>
                  </div>
                </div>
              )}

              {screenState === 'stable' && (
                <div className="absolute top-3 right-3 z-20 p-2.5 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 shadow-xl flex items-center gap-2.5 max-w-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left font-sans leading-tight">
                    <span className="text-[10px] font-bold text-emerald-300 block">SYSTEM STABLE</span>
                    <span className="text-[9px] text-zinc-300">Procesos estabilizados. CPU &lt; 2%.</span>
                  </div>
                </div>
              )}

              {/* Start Menu Pop-up if clicked */}
              {startMenuOpen && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-72 sm:w-80 rounded-2xl bg-[#12161f]/95 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl text-left font-sans space-y-3">
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-400">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Escribí acá para buscar...</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Ancladas
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1">
                      <div className="p-2 rounded hover:bg-white/10 cursor-pointer">Terminal</div>
                      <div className="p-2 rounded hover:bg-white/10 cursor-pointer">Servicios</div>
                      <div className="p-2 rounded hover:bg-white/10 cursor-pointer">Eventos</div>
                      <div className="p-2 rounded hover:bg-white/10 cursor-pointer">Ajustes</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Windows 11 Centered Taskbar */}
              <div className="relative z-20 h-10 w-full bg-[#0b0e14]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-3 text-xs">
                {/* Left Widget Area (Weather / System Info) */}
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono-tech">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline">EVO KERNEL NT 10.0</span>
                </div>

                {/* Center Centered Icons */}
                <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStartMenuOpen(!startMenuOpen);
                    }}
                    className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                      <div className="bg-[#00D2FF] rounded-[0.5px]" />
                      <div className="bg-[#00D2FF] rounded-[0.5px]" />
                      <div className="bg-[#00D2FF] rounded-[0.5px]" />
                      <div className="bg-[#00D2FF] rounded-[0.5px]" />
                    </div>
                  </button>
                  <div className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-zinc-300">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-zinc-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-zinc-300">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                {/* Right System Tray */}
                <div className="flex items-center gap-2.5 text-[10px] text-zinc-300">
                  {/* Network Icon (Real or Broken) */}
                  {isNetworkBroken ? (
                    <span title="Sin red // DNS/DHCP Caído">
                      <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    </span>
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-zinc-300" />
                  )}

                  {/* Audio Icon (Real or Broken) */}
                  {isAudioBroken ? (
                    <span title="Audio Deshabilitado // Audiosrv Detenido">
                      <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    </span>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
                  )}

                  <div className="text-right leading-tight font-mono-tech hidden sm:block">
                    <div>{currentTime}</div>
                    <div className="text-[9px] text-zinc-500">24/10/2026</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 7: WINDOWS SETUP (WIZARD & DISK MANAGER)
          ======================================================== */}
          {screenState === 'windows-setup' && (
            <div className="w-full h-full bg-[#081830] text-zinc-100 flex flex-col justify-between p-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-cyan-800/60 pb-2">
                <span className="font-bold text-white tracking-wide">Instalación de Windows</span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Minus className="w-3 h-3" />
                  <Square className="w-3 h-3" />
                  <X className="w-3 h-3" />
                </div>
              </div>

              <div className="my-auto max-w-lg mx-auto w-full p-4 rounded-lg bg-[#0e2448]/90 border border-cyan-500/30 space-y-3 shadow-2xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white">¿Dónde deseas instalar Windows?</h3>
                  <p className="text-[11px] text-zinc-300">
                    Seleccione la unidad y partición de destino para copiar los archivos del sistema:
                  </p>
                </div>

                <div className="space-y-1.5 font-mono-tech text-[10px] max-h-36 overflow-y-auto">
                  <div className="p-2 rounded bg-black/60 border border-cyan-400/80 text-white flex justify-between">
                    <span>Unidad 0 Partición 1: ESP (FAT32)</span>
                    <span className="text-cyan-300">260 MB</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-zinc-800 text-zinc-400 flex justify-between">
                    <span>Unidad 0 Partición 2: MSR (Reservado)</span>
                    <span>16 MB</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-cyan-400/80 text-white flex justify-between">
                    <span>Unidad 0 Partición 3: Windows (NTFS)</span>
                    <span className="text-emerald-400 font-bold">952.8 GB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cyan-900/60 text-[10px]">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-black/60 hover:bg-black border border-zinc-700">Actualizar</button>
                    <button className="px-2 py-1 rounded bg-black/60 hover:bg-black border border-zinc-700">Eliminar</button>
                    <button className="px-2 py-1 rounded bg-black/60 hover:bg-black border border-zinc-700">Formatear</button>
                  </div>
                  <button className="px-4 py-1 rounded bg-[#0078D4] hover:bg-[#0086F0] text-white font-bold">
                    Siguiente ➔
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 flex justify-between">
                <span>Versión del instalador: 10.0.26100.1</span>
                <span>Shift+F10 para consola</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 8: WINRE (WINDOWS RECOVERY ENVIRONMENT)
          ======================================================== */}
          {screenState === 'winre' && (
            <div className="w-full h-full bg-[#005a9e] text-white p-6 font-sans flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-light">Elegir una opción</h2>
              </div>

              <div className="max-w-md mx-auto w-full my-auto space-y-3 font-sans">
                <div className="p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition-colors cursor-pointer">
                  <RotateCcw className="w-5 h-5 text-white" />
                  <div>
                    <span className="font-bold block text-sm">Continuar</span>
                    <span className="text-[11px] text-white/80">Salir y continuar a Windows 11</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition-colors cursor-pointer">
                  <WrenchIcon className="w-5 h-5 text-white" />
                  <div>
                    <span className="font-bold block text-sm">Solucionar problemas</span>
                    <span className="text-[11px] text-white/80">Restablecer equipo o ver opciones avanzadas</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition-colors cursor-pointer">
                  <Power className="w-5 h-5 text-white" />
                  <div>
                    <span className="font-bold block text-sm">Apagar el equipo</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-white/70 text-right">
                Entorno de Recuperación WinRE // Modo de Mantenimiento
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 9: BSOD (BLUE SCREEN OF DEATH)
          ======================================================== */}
          {screenState === 'bsod' && (
            <div className="w-full h-full bg-[#0078D7] text-white p-6 sm:p-8 font-sans flex flex-col justify-between text-left">
              <div className="space-y-4 max-w-2xl">
                <div className="text-5xl sm:text-6xl font-light">:(</div>
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-light leading-snug">
                    Se ha producido un problema en su PC y necesita reiniciarse.
                    Solo estamos recopilando información sobre el error y luego se reiniciará automáticamente.
                  </h2>
                  <div className="text-sm font-light text-white/90">
                    25% completado
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-white/20 text-xs font-mono-tech">
                <div className="flex items-center gap-3">
                  {/* Stylized QR placeholder */}
                  <div className="w-14 h-14 bg-white p-1 rounded-sm grid grid-cols-3 gap-0.5">
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                  </div>
                  <div className="space-y-0.5 text-[10px] text-white/90">
                    <div>Para más información sobre este problema y posibles soluciones, visita:</div>
                    <div className="font-bold text-white">https://www.windows.com/stopcode</div>
                    <div className="text-white font-mono font-bold mt-1">
                      Código para detener: <span className="underline">{bsodCode}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[9px] text-white/70">Crash Dump 0x0000007B</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 10: BLACK SCREEN WITH BLINKING CURSOR
          ======================================================== */}
          {screenState === 'black-screen-cursor' && (
            <div className="w-full h-full bg-black text-white p-4 font-mono-tech text-xs flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <span>_</span>
                <span className="w-2 h-3.5 bg-white animate-pulse" />
              </div>
              <div className="text-[10px] text-zinc-600 text-center font-mono-tech">
                No bootable device or display pipeline detached.
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 11: SAFE MODE
          ======================================================== */}
          {screenState === 'safe-mode' && (
            <div className="relative w-full h-full bg-[#05070a] text-white flex flex-col justify-between p-4 font-mono-tech text-xs">
              <div className="flex justify-between text-zinc-500 text-[10px]">
                <span>Modo seguro</span>
                <span>Modo seguro</span>
              </div>
              <div className="my-auto text-center space-y-1">
                <span className="text-cyan-400 font-bold block text-sm">WINDOWS EN MODO SEGURO</span>
                <span className="text-zinc-400 text-[11px] block">
                  Cargado con controladores mínimos (sin aceleración GPU ni servicios no esenciales).
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[10px]">
                <span>Microsoft (R) Windows (R) Build 26100</span>
                <span>Modo seguro</span>
              </div>
            </div>
          )}

          {/* ========================================================
              STATE 12: COMMAND PROMPT & POWERSHELL
          ======================================================== */}
          {(screenState === 'cmd-console' || screenState === 'powershell-console') && (
            <div className="w-full h-full bg-black text-cyan-300 p-3 sm:p-4 font-mono-tech text-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-zinc-400 text-[10px]">
                <span>{screenState === 'cmd-console' ? 'Símbolo del sistema - Administrador' : 'Administrador: Windows PowerShell'}</span>
                <span>80x25</span>
              </div>
              <div className="flex-1 py-2 space-y-1 text-[11px] overflow-y-auto font-mono-tech leading-snug">
                <div className="text-zinc-500">Microsoft Windows [Versión 10.0.26100.1]</div>
                <div className="text-zinc-500">(c) Microsoft Corporation. Todos los derechos reservados.</div>
                <div className="text-white pt-2">
                  {screenState === 'cmd-console' ? 'X:\\windows\\system32> ' : 'PS C:\\Windows\\System32> '}
                  <span className="text-cyan-400 font-bold">
                    {customOverlayText || 'Get-Service Audiosrv, Dnscache | Select-Object Name, Status'}
                  </span>
                </div>
                <div className="text-emerald-400 pt-1">
                  Status: RUNNING • Type: AUTOMATIC • PID: 1420
                </div>
              </div>
              <div className="text-[10px] text-zinc-600 border-t border-zinc-900 pt-1">
                Presione cualquier tecla para continuar . . .
              </div>
            </div>
          )}

          {/* Custom Overlay message if provided */}
          {customOverlayText && screenState !== 'cmd-console' && screenState !== 'powershell-console' && (
            <div className="absolute bottom-12 left-4 right-4 z-40 p-2 rounded-lg bg-black/85 backdrop-blur-md border border-cyan-400/60 text-cyan-300 text-xs font-mono-tech text-center shadow-lg">
              {customOverlayText}
            </div>
          )}
        </div>

        {/* Physical Monitor Lower Chin & Controls */}
        <div className="mt-2.5 flex items-center justify-between px-2 text-[10px] font-mono-tech text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400 tracking-wider">EVO VISION 27" IPS</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">2560×1440 @ 165Hz</span>
          </div>

          {/* Physical LEDs */}
          <div className="flex items-center gap-3">
            {/* Storage Disk Activity LED */}
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  diskLedActive
                    ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                    : 'bg-zinc-800'
                }`}
              />
              <span className="text-[9px] text-zinc-600">DISK</span>
            </div>

            {/* Power LED */}
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  screenState === 'power-off'
                    ? 'bg-amber-500/80 shadow-[0_0_6px_#f59e0b]'
                    : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                }`}
              />
              <span className="text-[9px] text-zinc-400">PWR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitor Stand Stem & Base */}
      <div className="w-16 h-4 bg-gradient-to-b from-zinc-800 to-zinc-900 border-x border-zinc-700" />
      <div className="w-36 h-2 rounded-t-md bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-600 shadow-md" />
    </div>
  );
};

function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
