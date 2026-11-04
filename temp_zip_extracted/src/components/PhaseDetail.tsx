import { PHASES, SIGNALS } from "../data/boot";
import type { Snapshot } from "../engine/useBootSim";
import { cn } from "../utils/cn";

interface Props {
  snap: Snapshot;
  onOpenFault: () => void;
}

export default function PhaseDetail({ snap, onOpenFault }: Props) {
  const ph = PHASES[Math.min(snap.phaseIndex, PHASES.length - 1)];
  const faultHere = snap.fault !== null && snap.fault.phase === snap.phaseIndex && snap.status === "fault";
  const sigChanged = ph.sigEvents.map((e) => {
    const def = SIGNALS.find((s) => s.id === e.sig);
    return { label: def?.label ?? e.sig, level: e.level };
  });

  return (
    <section className="panel p-4 lg:p-5 min-h-0">
      <header className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="panel-title mb-1">
            Ficha técnica · fase {snap.phaseIndex + 1} de 14
          </div>
          <h2 className="font-semibold text-[19px] leading-tight tracking-tight">
            {ph.title}
          </h2>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-volt border border-volt/40 bg-volt-soft rounded-sm px-2 py-1">
          {ph.acpi}
        </span>
      </header>

      {faultHere && (
        <button
          onClick={onOpenFault}
          className="w-full mb-3 text-left rounded-md border border-alarm/60 bg-alarm-soft px-3 py-2 flex items-center gap-2 hover:bg-alarm/20 transition-colors group"
        >
          <span className="w-2 h-2 rounded-full bg-alarm led-pulse shrink-0" />
          <span className="text-[12px] text-alarm font-medium">
            El fallo «{snap.fault!.name}» detiene el POST en esta fase — abrir diagnóstico completo
          </span>
          <span className="ml-auto text-alarm/70 group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      )}

      <p className="text-[13px] leading-relaxed text-ink-dim mb-4">{ph.desc}</p>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <h3 className="panel-title mb-2 text-sig">Dentro del silicio</h3>
          <ul className="space-y-1.5">
            {ph.inside.map((t, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-snug text-ink-dim">
                <span className="text-sig/70 font-mono mt-px shrink-0">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <h3 className="panel-title mb-2 mt-4 text-volt">Qué suele fallar aquí</h3>
          <ul className="space-y-1.5">
            {ph.failures.map((t, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-snug text-ink-dim">
                <span className="text-alarm/70 font-mono mt-px shrink-0">✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="panel-title mb-2">Medidas esperadas en banco</h3>
          <div className="rounded-md border border-line overflow-hidden">
            {ph.meas.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex justify-between gap-3 px-3 py-1.5 text-[11.5px]",
                  i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70"
                )}
              >
                <span className="font-mono text-ink-dim">{m.point}</span>
                <span className="font-mono text-ok/90 text-right shrink-0">{m.expected}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {ph.codes.map((c) => (
              <span key={c.code} className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm border border-alarm/40 text-[#ff8d84] bg-[#1a0f12]" title="código en port 80h">
                {c.code}
              </span>
            ))}
            {sigChanged.map((s, i) => (
              <span key={i} className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm border border-sig/40 text-sig bg-sig-soft">
                {s.label} → {s.level}
              </span>
            ))}
            {ph.codes.length === 0 && sigChanged.length === 0 && (
              <span className="font-mono text-[10px] text-ink-faint">sin códigos POST todavía (el CPU aún no ejecuta)</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
