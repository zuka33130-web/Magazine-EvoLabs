import { RAILS, type RailId } from "../data/boot";
import { cn } from "../utils/cn";

interface Props {
  voltages: Record<RailId, number>;
}

export default function VoltagePanel({ voltages }: Props) {
  return (
    <section className="panel p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="panel-title">Raíles de tensión</h2>
        <span className="text-[10px] font-mono text-ink-faint">multímetro · ATX12V ±5%</span>
      </header>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
        {RAILS.map((r) => {
          const v = voltages[r.id];
          const off = v < 0.04;
          const ok = !off && v >= r.min && v <= r.max;
          const bad = !off && !ok;
          const lo = r.min * 0.88;
          const hi = r.max * 1.06;
          const pct = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
          const zLo = Math.max(0, Math.min(1, (r.min - lo) / (hi - lo)));
          const zHi = Math.max(0, Math.min(1, (r.max - lo) / (hi - lo)));
          return (
            <div key={r.id} className="group">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] tracking-wider text-ink-dim group-hover:text-ink transition-colors">
                  {r.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-[15px] font-semibold tabular-nums transition-colors",
                    off ? "text-ink-faint" : bad ? "text-alarm" : ok ? "text-ok" : "text-volt"
                  )}
                >
                  {v.toFixed(r.dec)}
                  <span className="text-[9px] text-ink-faint ml-0.5">V</span>
                </span>
              </div>
              <div className="relative h-[7px] mt-1 rounded-sm bg-bench-900 border border-line overflow-hidden">
                {/* zona nominal */}
                <div
                  className="absolute inset-y-0 bg-ok/15 border-x border-ok/40"
                  style={{ left: `${zLo * 100}%`, width: `${(zHi - zLo) * 100}%` }}
                />
                {/* marcador */}
                {!off && (
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 w-[3px] rounded-sm transition-colors",
                      bad ? "bg-alarm marker-glow" : "bg-volt marker-glow"
                    )}
                    style={{ left: `calc(${pct * 100}% - 1px)` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[8.5px] font-mono text-ink-faint/80 truncate pr-1">{r.note}</span>
                <span
                  className={cn(
                    "text-[8.5px] font-mono shrink-0",
                    off ? "text-ink-faint" : bad ? "text-alarm" : "text-ok/80"
                  )}
                >
                  {off ? "OFF" : bad ? "¡FUERA!" : "OK"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
