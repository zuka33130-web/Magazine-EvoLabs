import type { Snapshot } from "../engine/useBootSim";
import { cn } from "../utils/cn";

/** Lo que ve el técnico en el monitor: sin señal, logo UEFI, resumen POST, cargador del SO… */
export default function MonitorCard({ snap }: { snap: Snapshot }) {
  const { phaseIndex, status, fault, phaseProgress } = snap;

  let screen: React.ReactNode;
  let label: string;

  const noSignal = (msg?: string) => (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <span className="font-mono text-[13px] tracking-[0.3em] text-ink-dim">{msg ?? "SIN SEÑAL"}</span>
      <span className="font-mono text-[9px] text-ink-faint">DP-1 · 2560×1440 · comprobar cable/GPU</span>
    </div>
  );

  if (status === "g3" || status === "s5") {
    screen = noSignal();
    label = "monitor en espera";
  } else if (fault && fault.id === "disk_dead") {
    screen = (
      <div className="h-full flex flex-col justify-center px-6 font-mono text-[10.5px] leading-relaxed text-[#c9c9c9]">
        <p>Reboot and Select proper Boot device</p>
        <p>or Insert Boot Media in selected Boot device</p>
        <p>and press a key</p>
        <span className="inline-block w-2 h-3 bg-[#c9c9c9] mt-2 beep-flash" />
      </div>
    );
    label = "BDS: sin dispositivo de arranque";
  } else if (fault && fault.id === "cmos_low") {
    screen = (
      <div className="h-full flex flex-col justify-center px-6 font-mono text-[10px] leading-relaxed text-[#c9c9c9]">
        <p className="text-volt">American Megatrends</p>
        <p className="mt-1">CMOS checksum error - Defaults loaded</p>
        <p>CMOS battery low</p>
        <p className="mt-2">Press F1 to Run SETUP, F2 to continue</p>
        <span className="inline-block w-2 h-3 bg-[#c9c9c9] mt-2 beep-flash" />
      </div>
    );
    label = "aviso CMOS: espera pulsación";
  } else if (fault || phaseIndex < 9) {
    screen = noSignal(fault ? "SIN SEÑAL" : undefined);
    label = fault ? `POST detenido en fase ${fault.phase + 1} · la GPU no inicializó` : "la GPU aún no emite video (GOP)";
  } else if (phaseIndex === 9) {
    screen = (
      <div className="h-full relative flex flex-col items-center justify-center">
        <span className="font-bold text-[20px] tracking-[0.25em] text-white/90">
          POST<span className="text-volt">·</span>LAB
        </span>
        <span className="font-mono text-[8.5px] text-white/40 mt-1 tracking-widest">UEFI FIRMWARE · REV 2.4</span>
        <div className="absolute bottom-2 left-4 right-4 font-mono text-[8px] text-white/35 space-y-0.5">
          {phaseProgress > 0.3 && <p>CPU: Intel-class @ 3.6 GHz · 32 GB OK</p>}
          {phaseProgress > 0.6 && <p>GOP: framebuffer 1920×1080 · EDID detectado</p>}
        </div>
      </div>
    );
    label = "GOP activo: logo del fabricante";
  } else if (phaseIndex <= 11) {
    screen = (
      <div className="h-full flex flex-col justify-center px-6 font-mono text-[9.5px] leading-relaxed text-white/75">
        <p className="text-white/90 font-semibold tracking-widest text-[10px] mb-1.5">POST·LAB UEFI</p>
        <p>CPU ......... OK · microcódigo 2025-08</p>
        <p>Memoria ..... 32 GB DDR4-3200 (dual channel)</p>
        <p>NVMe ........ SSD 1 TB · Gen4 x4</p>
        <p>SATA ........ HDD 2 TB · 6 Gb/s</p>
        {phaseIndex >= 11 && <p className="text-volt mt-1">Boot: Windows Boot Manager…</p>}
      </div>
    );
    label = "resumen POST / BDS";
  } else {
    screen = (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
        <span className="font-mono text-[9px] text-white/50 tracking-widest">
          {status === "on" ? "ESCRITORIO LISTO" : "CARGANDO SISTEMA OPERATIVO"}
        </span>
      </div>
    );
    label = status === "on" ? "sesión iniciada · S0" : "bootloader → kernel";
  }

  return (
    <section className="panel p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="panel-title">Monitor del técnico</h2>
        <span className="text-[10px] font-mono text-ink-faint">{label}</span>
      </header>
      <div className="rounded-lg border-4 border-[#1a2634] bg-black overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[21/9] bg-[#05070a] overflow-hidden">
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 3px)",
            }}
          />
          <div className={cn("absolute inset-0 transition-opacity duration-500", status === "g3" ? "opacity-40" : "opacity-100")}>
            {screen}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="font-mono text-[8.5px] text-ink-faint">DELL-REF 24" · DisplayPort</span>
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "g3" || status === "s5" ? "bg-volt/80" : "bg-ok led-pulse"
          )}
        />
      </div>
    </section>
  );
}
