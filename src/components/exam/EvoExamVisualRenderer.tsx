import React from 'react';
import { VisualResourceKey } from './types';
import { Terminal, Activity, Zap, Cpu, Server, HardDrive, ShieldAlert, AlertTriangle } from 'lucide-react';

interface EvoExamVisualRendererProps {
  resourceKey: VisualResourceKey;
  caption?: string;
  accentColor?: string;
}

export const EvoExamVisualRenderer: React.FC<EvoExamVisualRendererProps> = ({
  resourceKey,
  caption,
  accentColor = '#EAB308',
}) => {
  const renderVisual = () => {
    switch (resourceKey) {
      case 'frametime_stutter_graph':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[11px]">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <Activity className="w-4 h-4" />
                <span>TELEMETRÍA DE FRAMETIME // MUESTREO 1000 FRAMES</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-[10px]">
                <span className="text-emerald-400">AVG: 144 FPS (6.9 ms)</span>
                <span className="text-red-400 font-bold">1% LOW: 18 FPS (55.5 ms)</span>
              </div>
            </div>

            {/* SVG Frametime Line Graph */}
            <div className="relative h-32 w-full bg-[#0a0d14] rounded-lg p-2 border border-zinc-900 overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-rows-4 pointer-events-none opacity-20">
                <div className="border-b border-dashed border-zinc-500"></div>
                <div className="border-b border-dashed border-zinc-500"></div>
                <div className="border-b border-dashed border-zinc-500"></div>
                <div></div>
              </div>

              {/* Threshold indicator line 16.6ms */}
              <div className="absolute top-[65%] left-0 right-0 border-t border-yellow-500/40 border-dotted flex justify-end pr-2 text-[9px] text-yellow-500/80">
                16.6 ms (60 Hz target)
              </div>
              <div className="absolute top-[80%] left-0 right-0 border-t border-emerald-500/40 border-dotted flex justify-end pr-2 text-[9px] text-emerald-500/80">
                6.9 ms (144 Hz ideal)
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Regular steady frametime line with 3 sudden severe spikes */}
                <path
                  d="M 0,80 L 30,79 L 60,81 L 90,80 L 110,79 L 120,80 L 125,12 L 130,80 L 160,81 L 190,79 L 220,80 L 250,79 L 255,18 L 260,80 L 290,81 L 320,80 L 350,79 L 355,8 L 360,80 L 400,81"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Area under curve for spikes */}
                <path
                  d="M 120,80 L 125,12 L 130,80 Z"
                  fill="rgba(239, 68, 68, 0.25)"
                />
                <path
                  d="M 250,79 L 255,18 L 260,80 Z"
                  fill="rgba(239, 68, 68, 0.25)"
                />
                <path
                  d="M 350,79 L 355,8 L 360,80 Z"
                  fill="rgba(239, 68, 68, 0.25)"
                />
              </svg>

              <div className="absolute top-2 left-3 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded text-[10px] text-red-300">
                ⚠️ PICO DE LATENCIA: 55.5 ms (Micro-stutter severo)
              </div>
            </div>
          </div>
        );

      case 'latency_hierarchy_chart':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="text-[11px] font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>JERARQUÍA DE TIEMPOS DE ACCESO AL DATO // SILICIO vs ALMACENAMIENTO</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-400 text-[11px]">L1 / L2 / L3 CPU CACHE (SRAM)</div>
                  <div className="text-zinc-400 text-[10px]">Silicio interno en el die de la CPU</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-300">0.8 ~ 12 ns</div>
                  <div className="text-[9px] text-emerald-500/80">Velocidad inmediata de núcleo</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-cyan-400 text-[11px]">MEMORIA RAM (DRAM DDR4/DDR5)</div>
                  <div className="text-zinc-400 text-[10px]">Bus de memoria canal dual directo</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-cyan-300">45 ~ 70 ns</div>
                  <div className="text-[9px] text-cyan-500/80">Nanosegundos (10⁻⁹ s)</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-400 text-[11px]">SSD NVMe PCIe 4.0 / 5.0 (Celdas NAND 3D)</div>
                  <div className="text-zinc-400 text-[10px]">Controlador NVMe / bus PCIe x4</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-amber-300">30 ~ 80 µs</div>
                  <div className="text-[9px] text-amber-500/80">Microsegundos (10⁻⁶ s) (~1000x más lento que RAM)</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-400 text-[11px]">DISCO RÍGIDO MECÁNICO (HDD SATA 7200 RPM)</div>
                  <div className="text-zinc-400 text-[10px]">Brazo mecánico & plato magnético</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-red-300">10 ~ 15 ms</div>
                  <div className="text-[9px] text-red-500/80">Milisegundos (10⁻³ s) (~200.000x más lento que RAM)</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'powershell_acpi_terminal':
        return (
          <div className="bg-[#020408] p-4 rounded-xl border border-zinc-800 text-xs font-mono">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-zinc-800 text-zinc-400 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Windows PowerShell (Admin) — Consulta de Identidad Real</span>
            </div>
            <div className="text-cyan-300 font-bold mb-1">
              PS C:\Windows\System32&gt; Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed
            </div>
            <div className="mt-3 p-3 bg-black/60 rounded border border-zinc-900 text-zinc-300 space-y-1">
              <div className="text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
                <span>Name</span>
                <span>Cores / Threads / Clock</span>
              </div>
              <div className="text-emerald-400 font-semibold flex justify-between pt-1">
                <span>AMD Ryzen 7 5800X 8-Core Processor</span>
                <span>8 / 16 / 3801 MHz</span>
              </div>
            </div>
            <div className="mt-2 text-zinc-500 text-[10px]">
              * La consulta directa lee tablas ACPI y descriptores SMBIOS del silicio, omitiendo nombres de catálogo o etiquetas pegadas al gabinete.
            </div>
          </div>
        );

      case 'atx_24pin_multimeter':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="text-[11px] font-bold text-emerald-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>BANCO DE PRUEBAS // MEDICIÓN DE CONECTOR ATX 24 PINES</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px]">
                MULTÍMETRO EN ESCALA DC 20V
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-purple-500/30">
                <div className="text-purple-400 font-bold text-[11px] mb-1">PIN 9 // CABLE MORADO</div>
                <div className="text-zinc-400 text-[10px] mb-2">+5VSB (Standby)</div>
                <div className="text-lg font-extrabold text-purple-300 font-mono">+5.08 V</div>
                <div className="text-[9px] text-zinc-500 mt-1">Presente con fuente conectada a 220V aún apagada</div>
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-lg border border-emerald-500/30">
                <div className="text-emerald-400 font-bold text-[11px] mb-1">PIN 16 // CABLE VERDE</div>
                <div className="text-zinc-400 text-[10px] mb-2">PS_ON# (Power On)</div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono">0.00 V (A Tierra)</div>
                <div className="text-[9px] text-zinc-500 mt-1">Puente a masa (Pin negro) para forzar encendido</div>
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-lg border border-amber-500/30">
                <div className="text-amber-400 font-bold text-[11px] mb-1">PIN 8 // CABLE GRIS</div>
                <div className="text-zinc-400 text-[10px] mb-2">PWR_OK / Power Good</div>
                <div className="text-lg font-extrabold text-amber-300 font-mono">+5.02 V (PG Estable)</div>
                <div className="text-[9px] text-zinc-500 mt-1">La fuente confirma a la CPU que los voltajes son seguros</div>
              </div>
            </div>
          </div>
        );

      case 'uefi_gpt_boot_tree':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="text-[11px] font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>SECUENCIA DE ARRANQUE // NATIVO UEFI GPT (RING 0 A RING 3)</span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-2 text-[10px]">
              <div className="flex-1 p-2.5 bg-blue-950/30 border border-blue-500/30 rounded-lg">
                <div className="font-bold text-blue-400">1. FIRMWARE UEFI</div>
                <div className="text-zinc-400 mt-1">SEC → PEI → DXE → BDS</div>
                <div className="text-[9px] text-zinc-500 mt-1">Verifica firmas Secure Boot</div>
              </div>
              <div className="flex items-center justify-center text-zinc-600 font-bold">→</div>
              <div className="flex-1 p-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
                <div className="font-bold text-cyan-400">2. ESP PARTITION</div>
                <div className="text-zinc-300 font-bold mt-1">\EFI\Microsoft\Boot\bootmgfw.efi</div>
                <div className="text-[9px] text-zinc-500 mt-1">Lee almacén BCD</div>
              </div>
              <div className="flex items-center justify-center text-zinc-600 font-bold">→</div>
              <div className="flex-1 p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                <div className="font-bold text-emerald-400">3. KERNEL BOOT</div>
                <div className="text-zinc-300 font-bold mt-1">winload.efi → ntoskrnl.exe</div>
                <div className="text-[9px] text-zinc-500 mt-1">Carga HAL & Drivers Boot</div>
              </div>
              <div className="flex items-center justify-center text-zinc-600 font-bold">→</div>
              <div className="flex-1 p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-lg">
                <div className="font-bold text-purple-400">4. USUARIO</div>
                <div className="text-zinc-400 mt-1">smss.exe → winlogon → explorer.exe</div>
                <div className="text-[9px] text-zinc-500 mt-1">Escritorio Ring 3</div>
              </div>
            </div>
          </div>
        );

      case 'latencymon_dpc_output':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[11px]">
              <span className="font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>INFORME DE LATENCYMON // ISR & DPC EXECUTION TIME</span>
              </span>
              <span className="text-red-400 font-bold text-[10px] px-2 py-0.5 bg-red-950 border border-red-500/40 rounded">
                CRITICAL LATENCY DETECTED
              </span>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="p-2 bg-red-950/30 border border-red-500/40 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-red-300">ndis.sys (Network Driver Interface Specification)</div>
                  <div className="text-zinc-400 text-[9px]">Controlador de tarjeta de red Wi-Fi / Ethernet</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-400 text-[11px]">1.842,50 µs</div>
                  <div className="text-[9px] text-red-500">Supera el límite de 1.000 µs (Dropouts)</div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900/60 border border-zinc-800 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-300">nvlddmkm.sys (NVIDIA Windows Kernel Mode Driver)</div>
                  <div className="text-zinc-500 text-[9px]">Controlador gráfico de GPU</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">124,30 µs</div>
                  <div className="text-[9px] text-emerald-600">Dentro de rango seguro</div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900/60 border border-zinc-800 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-300">ntoskrnl.exe (NT Kernel & System)</div>
                  <div className="text-zinc-500 text-[9px]">Núcleo del sistema operativo</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">42,10 µs</div>
                  <div className="text-[9px] text-emerald-600">Excelente</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'laptop_dc_jack_rail':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="text-[11px] font-bold text-purple-400 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>CIRCUITO DE ENTRADA NOTEBOOK // LÍNEA PRINCIPAL VIN (19.5V)</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-black/50 border border-zinc-900 rounded-lg text-[10px]">
              <div className="text-center p-2 bg-zinc-900 rounded border border-zinc-800 w-full sm:w-auto">
                <div className="text-zinc-400">ADAPTADOR</div>
                <div className="font-bold text-purple-400 text-xs">19.5 V DC</div>
              </div>
              <div className="text-zinc-600">→</div>
              <div className="text-center p-2 bg-zinc-900 rounded border border-zinc-800 w-full sm:w-auto">
                <div className="text-zinc-400">DC JACK & FUSIBLE</div>
                <div className="font-bold text-emerald-400 text-xs">FUSE 10A (Continuidad OK)</div>
              </div>
              <div className="text-zinc-600">→</div>
              <div className="text-center p-2 bg-red-950/40 rounded border border-red-500/40 w-full sm:w-auto">
                <div className="text-red-400 font-bold">1ER MOSFET (PQ1)</div>
                <div className="text-[9px] text-red-300">Drenaje: 19.5V | Fuente: 0.0V (Bloqueado)</div>
              </div>
              <div className="text-zinc-600">→</div>
              <div className="text-center p-2 bg-zinc-900 rounded border border-zinc-800 w-full sm:w-auto">
                <div className="text-zinc-400">CHARGER IC</div>
                <div className="text-[9px] text-zinc-500">ACDET / REGN / ACDRV</div>
              </div>
            </div>
          </div>
        );

      case 'dism_sfc_repair_flow':
        return (
          <div className="bg-[#05070a] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="text-[11px] font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>PROTOCOLO OFICIAL DE REPARACIÓN DE IMAGEN Y COMPONENTES</span>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="p-2.5 bg-blue-950/30 border border-blue-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 font-bold mr-2">PASO 1</span>
                  <span className="font-bold text-zinc-200">Dism /Online /Cleanup-Image /RestoreHealth</span>
                </div>
                <span className="text-blue-400 text-[9px]">Sana el Component Store (WinSxS)</span>
              </div>
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold mr-2">PASO 2</span>
                  <span className="font-bold text-zinc-200">sfc /scannow</span>
                </div>
                <span className="text-emerald-400 text-[9px]">Usa el WinSxS sano para parchar el OS en vivo</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = renderVisual();
  if (!content) return null;

  return (
    <div className="my-4">
      {content}
      {caption && (
        <div className="mt-1.5 text-[11px] text-zinc-400 italic text-center">
          {caption}
        </div>
      )}
    </div>
  );
};
