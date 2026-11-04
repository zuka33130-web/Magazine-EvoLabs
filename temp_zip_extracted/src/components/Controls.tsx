import { SCENARIOS } from "../data/faults";
import type { Snapshot } from "../engine/useBootSim";
import { cn } from "../utils/cn";

interface Props {
  snap: Snapshot;
  acOn: boolean;
  onAC: (on: boolean) => void;
  onPower: () => void;
  onPause: () => void;
  onStep: () => void;
  onSpeed: (v: number) => void;
  onSound: () => void;
  onScenario: (id: string) => void;
  onReference: () => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export default function Controls({ snap, acOn, onAC, onPower, onPause, onStep, onSpeed, onSound, onScenario, onReference }: Props) {
  const status = snap.status;
  const powerDisabled = status === "g3";

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {/* AC switch */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAC(!acOn)}
          role="switch"
          aria-checked={acOn}
          className={cn(
            "relative w-[52px] h-[26px] rounded-full border transition-colors duration-300",
            acOn ? "bg-volt-soft border-volt/60" : "bg-bench-900 border-line"
          )}
        >
          <span
            className={cn(
              "absolute top-[2px] w-[20px] h-[20px] rounded-full transition-all duration-300",
              acOn ? "left-[28px] bg-volt shadow-[0_0_10px_rgba(255,178,36,0.7)]" : "left-[2px] bg-bench-600"
            )}
          />
        </button>
        <div className="leading-none">
          <div className="font-mono text-[10px] font-semibold tracking-widest text-ink-dim">AC</div>
          <div className={cn("font-mono text-[8.5px]", acOn ? "text-volt" : "text-ink-faint")}>{acOn ? "CONECTADO" : "SIN RED"}</div>
        </div>
      </div>

      {/* escenario de fallo */}
      <label className="flex items-center gap-2">
        <span className="panel-title">Escenario</span>
        <select
          value={snap.scenarioId}
          onChange={(e) => onScenario(e.target.value)}
          className="bg-bench-900 border border-line rounded-md px-2.5 py-1.5 font-mono text-[11px] text-ink max-w-[240px] hover:border-bench-600 focus:outline-none focus:border-sig/60 transition-colors"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {/* reproducción */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPause}
          disabled={status !== "booting" && status !== "paused"}
          title={status === "paused" ? "Reanudar" : "Pausa"}
          className={cn(
            "w-8 h-8 rounded-md border font-mono text-[12px] transition-colors",
            status === "booting" || status === "paused"
              ? "border-line text-ink hover:border-sig/60 hover:text-sig"
              : "border-line/60 text-ink-faint/50 cursor-not-allowed"
          )}
        >
          {status === "paused" ? "▶" : "⏸"}
        </button>
        <button
          onClick={onStep}
          disabled={!(status === "booting" || status === "paused" || status === "s5")}
          title="Avanzar una fase"
          className={cn(
            "h-8 px-2 rounded-md border font-mono text-[11px] transition-colors",
            status === "booting" || status === "paused" || status === "s5"
              ? "border-line text-ink hover:border-volt/60 hover:text-volt"
              : "border-line/60 text-ink-faint/50 cursor-not-allowed"
          )}
        >
          ⏭ fase
        </button>
        <div className="flex rounded-md border border-line overflow-hidden ml-1">
          {SPEEDS.map((v) => (
            <button
              key={v}
              onClick={() => onSpeed(v)}
              className={cn(
                "px-2 h-8 font-mono text-[10.5px] transition-colors border-r border-line last:border-r-0",
                snap.speed === v ? "bg-volt-soft text-volt" : "text-ink-faint hover:text-ink-dim"
              )}
            >
              {v}×
            </button>
          ))}
        </div>
        <button
          onClick={onSound}
          title="Pitidos del speaker"
          className={cn(
            "w-8 h-8 rounded-md border font-mono text-[12px] transition-colors",
            snap.sound ? "border-line text-sig hover:border-sig/60" : "border-line/60 text-ink-faint/60 hover:text-ink-dim"
          )}
        >
          {snap.sound ? "♪" : "✕♪"}
        </button>
        <button
          onClick={onReference}
          className="h-8 px-3 rounded-md border border-line font-mono text-[10.5px] text-ink-dim hover:text-ink hover:border-bench-600 transition-colors"
        >
          ⚙ Referencia
        </button>
      </div>

      {/* botón POWER */}
      <div className="flex items-center gap-2.5 ml-auto">
        <div className="text-right leading-tight hidden sm:block">
          <div className="font-mono text-[9px] tracking-widest text-ink-faint">POWER</div>
          <div className={cn("font-mono text-[9px]", status === "on" ? "text-ok" : status === "fault" ? "text-alarm" : "text-ink-dim")}>
            {status === "g3" && "conecta AC primero"}
            {status === "s5" && "listo para arrancar"}
            {status === "booting" && "POST en curso…"}
            {status === "paused" && "en pausa"}
            {status === "on" && "apagado normal"}
            {status === "fault" && "reintentar"}
          </div>
        </div>
        <button
          onClick={onPower}
          disabled={powerDisabled}
          aria-label="Botón de encendido"
          className={cn(
            "relative w-[54px] h-[54px] rounded-full border-2 transition-all duration-300 flex items-center justify-center",
            powerDisabled
              ? "border-line/60 text-ink-faint/50 cursor-not-allowed"
              : status === "on"
                ? "border-ok/70 text-ok bg-ok-soft shadow-[0_0_22px_rgba(61,220,151,0.35)] hover:shadow-[0_0_30px_rgba(61,220,151,0.5)] active:scale-95"
                : status === "fault"
                  ? "border-alarm/70 text-alarm bg-alarm-soft led-pulse hover:shadow-[0_0_26px_rgba(255,93,93,0.4)] active:scale-95"
                  : "border-line text-ink-dim hover:border-volt/70 hover:text-volt hover:shadow-[0_0_22px_rgba(255,178,36,0.25)] active:scale-95"
          )}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 3v8" />
            <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
