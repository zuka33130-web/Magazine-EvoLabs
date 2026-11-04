import { SIGNALS } from "../data/boot";
import { cn } from "../utils/cn";

interface Props {
  signals: Record<string, "H" | "L">;
}

export default function SignalPanel({ signals }: Props) {
  return (
    <section className="panel p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="panel-title">Señales de control</h2>
        <span className="text-[10px] font-mono text-ink-faint">analizador lógico · H≈3.3V / L≈0.2V</span>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5">
        {SIGNALS.map((s) => {
          const lvl = signals[s.id] ?? "L";
          const active = lvl === s.activeWhen;
          const notable = ["ps_on", "pwr_ok", "vr_ready", "plt_rst", "cpu_rst", "prochot"].includes(s.id);
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1 border transition-colors duration-300",
                active
                  ? notable
                    ? "border-volt/40 bg-volt-soft/60"
                    : "border-sig/30 bg-sig-soft/60"
                  : "border-transparent"
              )}
              title={s.desc}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  active ? (notable ? "bg-volt led-pulse" : "bg-sig") : "bg-bench-600"
                )}
              />
              <span className={cn("font-mono text-[11px] tracking-wide w-[86px] shrink-0", active ? "text-ink" : "text-ink-dim")}>
                {s.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] font-bold w-6 text-center rounded-sm border py-px",
                  lvl === "H" ? "text-sig border-sig/50 bg-sig-soft" : "text-ink-faint border-line bg-bench-900"
                )}
              >
                {lvl}
              </span>
              <span className="text-[9px] font-mono text-ink-faint truncate hidden xl:block">{s.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
