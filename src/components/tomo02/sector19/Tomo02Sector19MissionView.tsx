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
  Zap,
  Battery,
  Activity,
  Layers,
  Sliders,
} from 'lucide-react';

interface Tomo02Sector19MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector19MissionView: React.FC<Tomo02Sector19MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'SCHEME_LIST' | 'BATTERY_AUDIT' | 'REQUESTS_CHECK' | 'ENERGY_REPORT'
  >('SCHEME_LIST');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'powercfg /list && powercfg /getactivescheme',
    targetComponent: 'ACPI Power Scheme Database (powrprof.dll)',
    data: `[+] Consultando esquemas de energía registrados en el sistema:
    GUID: 381b4222-f694-41f0-9685-ff5bb260df2e  (Equilibrado) *
    GUID: a1841308-3541-4fab-bc81-f71556f20b4a  (Economizador)
    GUID: 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c  (Alto rendimiento)
    GUID: e9a42b02-d5df-448d-aa00-03f14749eb61  (Rendimiento máximo)
    [+] Esquema activo: Equilibrado (381b4222...)
    [+] Modulación Speed Shift (HWP): Habilitada y activa por hardware.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const handleRunCommand = (type: 'SCHEME_LIST' | 'BATTERY_AUDIT' | 'REQUESTS_CHECK' | 'ENERGY_REPORT') => {
    setActiveModule(type);
    const ts = new Date().toLocaleTimeString();

    if (type === 'SCHEME_LIST') {
      setConsoleOutput({
        query: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61',
        targetComponent: 'Windows Power Scheme Duplicator',
        data: `[+] Clonando esquema Ultimate Performance (Workstation):
        GUID de esquema de energía: e9a42b02-d5df-448d-aa00-03f14749eb61 (Rendimiento máximo)
        [+] Estado de PCIe ASPM: Deshabilitado (Cero latencia de bus)
        [+] Estado de Core Unparking: 100% de núcleos activos permanentes
        [OK] Esquema añadido al Panel de Control de opciones de energía.`,
        timestamp: ts,
      });
    } else if (type === 'BATTERY_AUDIT') {
      setConsoleOutput({
        query: 'powercfg /batteryreport /output %temp%\\battery-report.html',
        targetComponent: 'ACPI Battery Management & Fuel Gauge',
        data: `[+] Extrayendo telemetría del controlador embebido (EC):
        Química de celda: LION (Polímero de Litio)
        Fabricante: SMP / Celda grado A
        Capacidad de diseño: 70.000 mWh
        Capacidad a carga completa: 64.200 mWh
        Salud real estimada: 91.7% (Degradación: 8.3%)
        Ciclos de carga acumulados: 142 ciclos
        [OK] Batería en estado saludable sin riesgo de hinchamiento.`,
        timestamp: ts,
      });
    } else if (type === 'REQUESTS_CHECK') {
      setConsoleOutput({
        query: 'powercfg /requests',
        targetComponent: 'Power Availability Request Broker (ntoskrnl.exe)',
        data: `[+] Inspeccionando solicitudes activas que bloquean la suspensión:
        [DISPLAY]:
        Ninguno.
        [SYSTEM]:
        [DRIVER] Realtek High Definition Audio (HDAUDIO\\FUNC_01)
        Una secuencia de audio está actualmente en uso.
        [PROCESS] C:\\Program Files\\Spotify\\Spotify.exe
        Reproducción activa en segundo plano.
        [AWAYMODE]:
        Ninguno.
        [EXECUTION]:
        Ninguno.
        [!] Spotify y el stream de audio están impidiendo el reposo del equipo.`,
        timestamp: ts,
      });
    } else if (type === 'ENERGY_REPORT') {
      setConsoleOutput({
        query: 'powercfg /energy /duration 60',
        targetComponent: 'Kernel Energy Efficiency Tracer',
        data: `[+] Monitoreando el sistema durante 60 segundos...
        [+] Errores detectados: 1
        - Temporizadores de plataforma: Temporizador de alta resolución solicitado (1.0 ms) por Discord.exe.
          (Impacto: +8% de drenaje de batería en reposo).
        [+] Advertencias: 2
        - Dispositivo USB no entró en suspensión selectiva (Mouse Gaming 1000 Hz).
        - Directiva de disco: Tiempo de inactividad antes de apagado configurado en Nunca.
        [OK] Análisis completado y guardado en energy-report.html.`,
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
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-300 font-bold">LAB // POWER PLAN A/B & POWERCFG</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-6">
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Laboratorio Interactivo de Energía</div>
          <h2 className="text-2xl font-bold text-white">Consola de Telemetría y Diagnóstico powercfg</h2>
          <p className="text-xs text-zinc-400">
            Monitorea el estado de planes de energía, audita la salud química de la batería, descubre bloqueos de suspensión con /requests y detecta fugas de energía con /energy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <button
              onClick={() => handleRunCommand('SCHEME_LIST')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'SCHEME_LIST'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">1. Esquemas & Ultimate Perf</div>
              <div className="text-[11px] text-zinc-400">powercfg /list y duplicación de perfiles.</div>
            </button>

            <button
              onClick={() => handleRunCommand('BATTERY_AUDIT')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'BATTERY_AUDIT'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">2. Auditoría de Batería</div>
              <div className="text-[11px] text-zinc-400">powercfg /batteryreport y ciclos.</div>
            </button>

            <button
              onClick={() => handleRunCommand('REQUESTS_CHECK')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'REQUESTS_CHECK'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">3. Bloqueos de Suspensión</div>
              <div className="text-[11px] text-zinc-400">powercfg /requests y handles en uso.</div>
            </button>

            <button
              onClick={() => handleRunCommand('ENERGY_REPORT')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'ENERGY_REPORT'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">4. Fugas de Energía /energy</div>
              <div className="text-[11px] text-zinc-400">Rastreo de temporizadores y consumos.</div>
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
              <span className="text-zinc-500 text-[10px] uppercase">Salida del kernel ACPI:</span>
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
