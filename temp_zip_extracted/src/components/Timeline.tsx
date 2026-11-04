import { PHASES } from "../data/boot";
import type { Snapshot } from "../engine/useBootSim";
import { cn } from "../utils/cn";

interface Props {
  snap: Snapshot;
  onJump: (idx: number) => void;
}

export default function Timeline({ snap, onJump }: Props) {
  const { phaseIndex, phaseProgress, status, fault } = snap;
  const reached = status === "on" ? PHASES.length : phaseIndex;
  const cur = PHASES[Math.min(phaseIndex, PHASES.length - 1)];
  const canJump = status !== "g3";

  return (
    <section className="panel p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="panel-title">Secuencia de arranque · 14 fases</h2>
        <span className="text-[10px] font-mono text-ink-faint">
          {status === "g3" ? "conecta AC para navegar" : "clic = modo revisión"}
        </span>
      </header>

      <div className="flex gap-1.5 overflow-x-auto scroll-slim pb-2">
        {PHASES.map((p, i) => {
          const isFaultPhase = fault !== null && fault.phase === i && status === "fault";
          const done = i < reached || status === "on";
          const current = i === phaseIndex && status !== "on" && status !== "g3";
          return (
            <button
              key={p.id}
              disabled={!canJump}
              onClick={() => onJump(i)}
              title={`${i + 1}. ${p.title}`}
              className={cn(
                "relative shrink-0 rounded-md border px-2.5 py-1.5 text-left transition-all duration-200",
                canJump ? "cursor-pointer hover:-translate-y-0.5" : "cursor-not-allowed opacity-50",
                isFaultPhase
                  ? "border-alarm/70 bg-alarm-soft shadow-[0_0_12px_rgba(255,93,93,0.25)]"
                  : current
                    ? "border-volt/70 bg-volt-soft"
                    : done
                      ? "border-ok/30 bg-ok-soft/50 hover:border-ok/60"
                      : "border-line bg-bench-900/60 hover:border-bench-600"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "font-mono text-[9px] font-bold w-4 text-center rounded-sm py-px",
                    isFaultPhase ? "bg-alarm text-bench-950" : done ? "text-ok" : current ? "text-volt" : "text-ink-faint"
                  )}
                >
                  {isFaultPhase ? "✕" : done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-wide whitespace-nowrap",
                    isFaultPhase ? "text-alarm" : current ? "text-ink" : done ? "text-ink-dim" : "text-ink-faint"
                  )}
                >
                  {p.short}
                </span>
              </div>
              {current && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-volt rounded-b-md transition-[width] duration-150" style={{ width: `${phaseProgress * 100}%` }} />
              )}
            </button>
          );
        })}
      </div>

      {status !== "g3" && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 h-[5px] rounded-sm bg-bench-900 border border-line overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-volt/70 to-volt transition-[width] duration-150"
              style={{ width: `${(reached >= PHASES.length ? 1 : phaseProgress) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-ink-dim whitespace-nowrap">
            {reached >= PHASES.length ? "completado" : `fase ${phaseIndex + 1}/14 · ${(phaseProgress * 100).toFixed(0)}%`} · {cur.short}
          </span>
        </div>
      )}
    </section>
  );
}
