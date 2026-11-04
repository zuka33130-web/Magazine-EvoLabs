import type { FaultDef } from "../data/faults";
import { cn } from "../utils/cn";

interface Props {
  fault: FaultDef;
  postCode: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function FaultPanel({ fault, postCode, onRetry, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-bench-950/80 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative panel w-full max-w-3xl max-h-[88vh] overflow-y-auto scroll-slim rise-in border-alarm/40 shadow-[0_0_60px_-10px_rgba(255,93,93,0.35)]">
        {/* cabecera */}
        <div className="sticky top-0 z-10 bg-bench-900/95 backdrop-blur border-b border-alarm/30 px-5 py-4 flex items-start gap-3">
          <span className="mt-1 w-3 h-3 rounded-full bg-alarm led-pulse shadow-[0_0_12px_#ff5d5d] shrink-0" />
          <div className="min-w-0">
            <div className="panel-title text-alarm/80">Diagnóstico de fallo</div>
            <h2 className="font-semibold text-[18px] leading-tight">{fault.name}</h2>
            <p className="text-[12px] text-ink-dim mt-0.5">{fault.tagline}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="text-center rounded-md border border-line bg-[#120a0c] px-2.5 py-1">
              <div className="seg text-[22px] leading-none">{postCode}</div>
              <div className="text-[7.5px] font-mono text-ink-faint mt-0.5">PORT 80h</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-8 h-8 rounded-md border border-line text-ink-dim hover:text-ink hover:border-bench-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* indicadores */}
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-[10.5px] px-2 py-1 rounded-sm border border-volt/40 bg-volt-soft text-volt">
              ♪ {fault.beepLabel}
            </span>
            {fault.led && (
              <span className="font-mono text-[10.5px] px-2 py-1 rounded-sm border border-alarm/50 bg-alarm-soft text-alarm">
                LED placa: {fault.led} encendido
              </span>
            )}
            {fault.effect === "collapse" && (
              <span className="font-mono text-[10.5px] px-2 py-1 rounded-sm border border-alarm/50 bg-alarm-soft text-alarm">
                PSU enclavada (SCP/OCP)
              </span>
            )}
          </div>

          <section>
            <h3 className="panel-title mb-2">Síntomas en el banco</h3>
            <ul className="space-y-1.5">
              {fault.symptoms.map((t, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-ink-dim">
                  <span className="text-alarm/80 font-mono shrink-0">▸</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="panel-title mb-2 text-sig">Qué está pasando dentro</h3>
            <ul className="space-y-1.5">
              {fault.whatHappens.map((t, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-ink-dim">
                  <span className="text-sig/70 font-mono shrink-0">▸</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="panel-title mb-2">Mediciones — esperado vs encontrado</h3>
            <div className="rounded-md border border-line overflow-hidden">
              <div className="grid grid-cols-[1.4fr_1fr_1fr] px-3 py-1.5 bg-bench-800/80 font-mono text-[9.5px] tracking-widest text-ink-faint uppercase">
                <span>Punto de prueba</span>
                <span>Esperado</span>
                <span>Encontrado</span>
              </div>
              {fault.measurements.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-[1.4fr_1fr_1fr] gap-2 px-3 py-2 text-[11.5px] font-mono",
                    i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70"
                  )}
                >
                  <span className="text-ink-dim">{m.point}</span>
                  <span className="text-ok/85">{m.expected}</span>
                  <span className="text-alarm font-semibold">{m.found}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="panel-title mb-2 text-ok">Resolución paso a paso</h3>
            <ol className="space-y-2">
              {fault.resolution.map((t, i) => (
                <li key={i} className="flex gap-3 text-[12.5px] leading-snug text-ink-dim">
                  <span className="shrink-0 w-5 h-5 rounded-sm border border-ok/40 bg-ok-soft text-ok font-mono text-[10px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{t}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="sticky bottom-0 bg-bench-900/95 backdrop-blur border-t border-line px-5 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="font-mono text-[11px] px-4 py-2 rounded-md border border-line text-ink-dim hover:text-ink hover:border-bench-600 transition-colors"
          >
            Seguir inspeccionando
          </button>
          <button
            onClick={onRetry}
            className="font-mono text-[11px] font-semibold px-4 py-2 rounded-md border border-ok/50 bg-ok-soft text-ok hover:bg-ok/20 transition-colors"
          >
            ⟳ Reintentar arranque
          </button>
        </div>
      </div>
    </div>
  );
}
