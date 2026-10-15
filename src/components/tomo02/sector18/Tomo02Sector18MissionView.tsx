import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Monitor,
  Eye,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';

interface Tomo02Sector18MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector18MissionView: React.FC<Tomo02Sector18MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'MUX_OPTIMUS' | 'TDR_RESET' | 'MPO_OVERLAY_FIX' | 'VRR_WINDOWED'
  >('MUX_OPTIMUS');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'reg query HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences',
    targetComponent: 'DirectX Graphics Infrastructure (DXGI)',
    data: `[+] Consultando directivas de GPU por aplicación:
    Directiva activa: C:\\Games\\Cyberpunk2077.exe -> GpuPreference=2 (Alto Rendimiento - RTX 4070)
    Directiva activa: C:\\Program Files\\OBS\\obs64.exe -> GpuPreference=2 (Encoder NVENC)
    Topología física detectada: NVIDIA Advanced Optimus (Dynamic Display Switch)
    Estado MUX: dGPU conectada directamente al panel eDP (Cero copia PCIe).`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const handleRunCommand = (type: 'MUX_OPTIMUS' | 'TDR_RESET' | 'MPO_OVERLAY_FIX' | 'VRR_WINDOWED') => {
    setActiveModule(type);
    const ts = new Date().toLocaleTimeString();

    if (type === 'MUX_OPTIMUS') {
      setConsoleOutput({
        query: 'dxdiag /t dxdiag_eval.txt && Get-CimInstance Win32_VideoController',
        targetComponent: 'DXGI Topology & Adapter Enumeration',
        data: `[+] Evaluando adaptadores gráficos instalados:
        Adapter 0: Intel(R) UHD Graphics (LUID: 0x0000A1F0 - 128 MB VRAM dedicada)
        Adapter 1: NVIDIA GeForce RTX 4070 Laptop GPU (LUID: 0x0000B291 - 8192 MB GDDR6)
        [+] Estado de bus: PCIe Gen4 x8 @ 16.0 GT/s
        [+] Conexión de Display: Panel eDP 2560x1440 @ 165 Hz (Cableado directo vía MUX)
        [OK] Sin penalización de copia PCIe. Rendimiento óptimo garantizado.`,
        timestamp: ts,
      });
    } else if (type === 'TDR_RESET') {
      setConsoleOutput({
        query: 'Win + Ctrl + Shift + B (Simulación Kernel TDR DWM Reset)',
        targetComponent: 'DWM Surface Re-creation & Driver Watchdog',
        data: `[!] Enviando señal de redibujado forzado al subsistema de usuario:
        [+] Pitido sonoro emitido por el sistema (Beep).
        [+] Descartando superficies colgadas en DWM...
        [+] Liberando swap chains en estado DXGI_ERROR_DEVICE_RESET...
        [+] Reiniciando Desktop Window Manager (dwm.exe)...
        [OK] Superficie gráfica restablecida con éxito en 480 ms sin pantallazo azul.`,
        timestamp: ts,
      });
    } else if (type === 'MPO_OVERLAY_FIX') {
      setConsoleOutput({
        query: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm" /v OverlayTestMode /t REG_DWORD /d 5 /f',
        targetComponent: 'Desktop Window Manager (MPO Composition Plane)',
        data: `[+] Modificando registro de aceleración de ventanas:
        Clave actualizada: HKLM\SOFTWARE\Microsoft\Windows\Dwm
        Valor: OverlayTestMode = 0x00000005 (MPO Deshabilitado)
        [+] Forzando composición por buffer estándar de DWM.
        [OK] Parpadeo en Chrome, Discord y reproductores multimedia resuelto al 100%.`,
        timestamp: ts,
      });
    } else if (type === 'VRR_WINDOWED') {
      setConsoleOutput({
        query: 'reg add "HKCU\\Control Panel\\Desktop" /v WindowedVRR /t REG_DWORD /d 1 /f',
        targetComponent: 'WDDM Variable Refresh Rate Engine',
        data: `[+] Habilitando soporte VRR para aplicaciones en ventana:
        Clave: HKCU\Control Panel\Desktop -> WindowedVRR = 1
        [+] G-Sync Compatible / FreeSync extendido a Borderless Windowed.
        [+] Rango de sincronización activo: 48 Hz - 165 Hz con LFC habilitado.
        [OK] Tearing eliminado sin retraso de V-Sync en modo ventana.`,
        timestamp: ts,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans pb-16">
      <header className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToReader}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLVER A LA TEORÍA</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-xs">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-300 font-bold">LAB // DISPLAY PIPELINE LAB</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-6">
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Laboratorio Interactivo de Gráficos</div>
          <h2 className="text-2xl font-bold text-white">Consola de Diagnóstico de Pipeline Gráfico y Pantalla</h2>
          <p className="text-xs text-zinc-400">
            Ejecuta simulaciones en tiempo real para auditar la topología de GPU, disparar recuperación por TDR, corregir parpadeos de MPO y configurar VRR en ventana.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <button
              onClick={() => handleRunCommand('MUX_OPTIMUS')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'MUX_OPTIMUS'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">1. Topología DXGI & MUX</div>
              <div className="text-[11px] text-zinc-400">Auditar asignación de adaptadores y bus PCIe.</div>
            </button>

            <button
              onClick={() => handleRunCommand('TDR_RESET')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'TDR_RESET'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">2. Rescate TDR (Win+Ctrl+Shift+B)</div>
              <div className="text-[11px] text-zinc-400">Reconstruir superficies DWM ante cuelgues.</div>
            </button>

            <button
              onClick={() => handleRunCommand('MPO_OVERLAY_FIX')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'MPO_OVERLAY_FIX'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">3. Solución a Flickering MPO</div>
              <div className="text-[11px] text-zinc-400">Desactivar Multi-Plane Overlay por registro.</div>
            </button>

            <button
              onClick={() => handleRunCommand('VRR_WINDOWED')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'VRR_WINDOWED'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">4. VRR en Modo Ventana</div>
              <div className="text-[11px] text-zinc-400">Habilitar sincronización adaptativa global.</div>
            </button>
          </div>

          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>TERMINAL FORENSE DE SALIDA // {consoleOutput.targetComponent}</span>
              </div>
              <span>{consoleOutput.timestamp}</span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase">Comando ejecutado:</span>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-cyan-300 font-bold border border-zinc-800">
                &gt; {consoleOutput.query}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase">Salida del kernel WDDM:</span>
              <pre className="p-4 bg-zinc-900/60 rounded-xl text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-zinc-800/80">
                {consoleOutput.data}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
