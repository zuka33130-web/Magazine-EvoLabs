import type { Snapshot } from "../engine/useBootSim";
import { cn } from "../utils/cn";

function ledForPhase(phaseIndex: number): string | null {
  if (phaseIndex >= 4 && phaseIndex <= 6) return "CPU";
  if (phaseIndex === 7) return "DRAM";
  if (phaseIndex === 8 || phaseIndex === 9) return "VGA";
  if (phaseIndex >= 10 && phaseIndex <= 12) return "BOOT";
  return null;
}

export default function StatusStrip({ snap }: { snap: Snapshot }) {
  const running = snap.status === "booting" || snap.status === "paused";
  const faultLed = snap.status === "fault" ? snap.fault?.led ?? null : null;
  const phaseLed = running ? ledForPhase(snap.phaseIndex) : snap.status === "on" ? null : null;
  const codeActive = snap.postCode !== "--";

  return (
    <section className="panel px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
      {/* POST code */}
      <div className="flex items-center gap-3">
        <div className="rounded-md border border-line bg-[#120a0c] px-3 py-1.5 shadow-[inset_0_0_18px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-[#5a3538] tracking-widest">P80</span>
            <span className={cn("seg text-[30px] leading-none tabular-nums", !codeActive && "seg-off")}>
              {snap.postCode}
            </span>
          </div>
        </div>
        <div className="leading-tight">
          <div className="panel-title">Port 80h</div>
          <div className="text-[9px] font-mono text-ink-faint">código POST</div>
        </div>
      </div>

      {/* beeps + debug LEDs */}
      <div className="flex items-center gap-4">
        <div className="leading-tight">
          <div className="panel-title mb-1">Speaker</div>
          <div className="flex items-center gap-1.5 h-4">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                snap.beepFlash ? "bg-alarm beep-flash shadow-[0_0_8px_#ff5d5d]" : "bg-bench-600"
              )}
            />
            <span className="text-[9.5px] font-mono text-ink-dim">
              {snap.status === "fault" && snap.fault
                ? snap.fault.beepLabel
                : snap.beepFlash
                  ? "pitido…"
                  : "silencio"}
            </span>
          </div>
        </div>
        <div className="leading-tight">
          <div className="panel-title mb-1">Debug LED</div>
          <div className="flex items-center gap-1.5">
            {(["CPU", "DRAM", "VGA", "BOOT"] as const).map((led) => {
              const lit = faultLed === led || phaseLed === led;
              const isFault = faultLed === led;
              return (
                <span key={led} className="flex flex-col items-center gap-0.5">
                  <span
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border transition-colors",
                      lit
                        ? isFault
                          ? "bg-alarm border-alarm led-pulse shadow-[0_0_10px_#ff5d5d]"
                          : "bg-volt border-volt led-pulse shadow-[0_0_8px_#ffb224]"
                        : "bg-bench-800 border-line"
                    )}
                  />
                  <span className="text-[7px] font-mono text-ink-faint">{led}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACPI state */}
      <div className="leading-tight">
        <div className="panel-title mb-1">Estado ACPI</div>
        <span
          className={cn(
            "inline-block font-mono text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-sm border",
            snap.status === "fault"
              ? "text-alarm border-alarm/50 bg-alarm-soft"
              : snap.status === "on"
                ? "text-ok border-ok/40 bg-ok-soft"
                : snap.status === "g3"
                  ? "text-ink-faint border-line bg-bench-900"
                  : "text-volt border-volt/40 bg-volt-soft"
          )}
        >
          {snap.acpi}
        </span>
      </div>

      {/* telemetría */}
      <div className="flex items-center gap-4 ml-auto">
        {[
          { l: "Tj CPU", v: snap.status === "g3" ? "—" : `${snap.temp.toFixed(0)}°C`, warn: snap.temp > 80 },
          { l: "FAN", v: snap.status === "g3" ? "—" : `${snap.fan} rpm`, warn: false },
          { l: "VRM Iout", v: snap.status === "g3" ? "—" : `${snap.amps.toFixed(1)} A`, warn: snap.amps > 35 },
          { l: "Reloj POST", v: `${(snap.bootClock / 1000).toFixed(1)} s`, warn: false },
        ].map((t) => (
          <div key={t.l} className="text-right leading-tight">
            <div className="panel-title">{t.l}</div>
            <div className={cn("font-mono text-[14px] font-semibold tabular-nums", t.warn ? "text-alarm" : "text-ink")}>
              {t.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
