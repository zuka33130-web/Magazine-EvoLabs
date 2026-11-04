import { useState } from "react";
import { ATX_PINS, BEEPS_AMI, BEEPS_AWARD, POST_RANGES, TOLERANCES } from "../data/reference";
import { cn } from "../utils/cn";

type Tab = "atx" | "tol" | "beeps" | "post";

const TABS: { id: Tab; label: string }[] = [
  { id: "atx", label: "Conector ATX" },
  { id: "tol", label: "Tolerancias" },
  { id: "beeps", label: "Pitidos" },
  { id: "post", label: "Códigos POST" },
];

export default function ReferenceModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("atx");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-bench-950/80 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative panel w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rise-in">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <div>
            <div className="panel-title">Referencia rápida</div>
            <h2 className="font-semibold text-[17px]">Manual de banco del técnico</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-auto w-8 h-8 rounded-md border border-line text-ink-dim hover:text-ink hover:border-bench-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "font-mono text-[10.5px] px-3 py-1.5 rounded-t-md border border-b-0 transition-colors",
                tab === t.id ? "border-line bg-bench-800 text-volt" : "border-transparent text-ink-faint hover:text-ink-dim"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scroll-slim bg-bench-800/40 border-t border-line px-5 py-4">
          {tab === "atx" && (
            <div>
              <p className="text-[12px] text-ink-dim mb-3">
                Pines clave del conector ATX de 24 pines. Para arrancar una fuente en banco: puentear{" "}
                <span className="font-mono text-sig">PS_ON# (pin 14, verde)</span> a cualquier{" "}
                <span className="font-mono">COM</span>.
              </p>
              <div className="rounded-md border border-line overflow-hidden">
                <div className="grid grid-cols-[46px_14px_90px_1fr] px-3 py-1.5 bg-bench-900 font-mono text-[9.5px] tracking-widest text-ink-faint uppercase">
                  <span>Pin</span><span />
                  <span>Señal</span><span>Función</span>
                </div>
                {ATX_PINS.map((p, i) => (
                  <div key={p.pin} className={cn("grid grid-cols-[46px_14px_90px_1fr] gap-2 px-3 py-1.5 font-mono text-[11.5px] items-center", i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70")}>
                    <span className="text-ink-dim">{p.pin}</span>
                    <span className="w-3 h-3 rounded-sm border border-line" style={{ background: p.color }} />
                    <span className="text-volt">{p.name}</span>
                    <span className="text-ink-dim">{p.use}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "tol" && (
            <div>
              <p className="text-[12px] text-ink-dim mb-3">
                Tolerancias según especificación ATX12V. Medir siempre <em>bajo carga</em>: una fuente puede dar
                tensiones perfectas en vacío y hundirse con el sistema trabajando.
              </p>
              <div className="rounded-md border border-line overflow-hidden">
                <div className="grid grid-cols-4 px-3 py-1.5 bg-bench-900 font-mono text-[9.5px] tracking-widest text-ink-faint uppercase">
                  <span>Rail</span><span>Nominal</span><span>Mín–Máx</span><span>Rizado / timing</span>
                </div>
                {TOLERANCES.map((t, i) => (
                  <div key={t.rail} className={cn("grid grid-cols-4 gap-2 px-3 py-1.5 font-mono text-[11.5px]", i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70")}>
                    <span className="text-volt">{t.rail}</span>
                    <span className="text-ink">{t.nom}</span>
                    <span className="text-ink-dim">{t.min} – {t.max}</span>
                    <span className="text-sig">{t.ripple}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "beeps" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <h3 className="panel-title mb-2">AMI (pitidos cortos)</h3>
                <div className="rounded-md border border-line overflow-hidden">
                  {BEEPS_AMI.map((b, i) => (
                    <div key={b.code} className={cn("grid grid-cols-[56px_1fr] gap-2 px-3 py-1.5 text-[11.5px]", i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70")}>
                      <span className="font-mono text-volt">{b.code}</span>
                      <span className="text-ink-dim">{b.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="panel-title mb-2">Award / Phoenix (patrones)</h3>
                <div className="rounded-md border border-line overflow-hidden">
                  {BEEPS_AWARD.map((b, i) => (
                    <div key={b.code} className={cn("px-3 py-1.5 text-[11.5px]", i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70")}>
                      <span className="font-mono text-volt">{b.code}</span>
                      <span className="text-ink-dim"> — {b.meaning}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-ink-faint mt-3 leading-relaxed">
                  Sin speaker conectado no hay pitidos: muchas placas modernas sustituyen el buzzer por LEDs de
                  diagnóstico (CPU · DRAM · VGA · BOOT). Verifica siempre el header «SPK».
                </p>
              </div>
            </div>
          )}

          {tab === "post" && (
            <div>
              <p className="text-[12px] text-ink-dim mb-3">
                Rangos típicos del port 80h en firmware AMI Aptio. El código donde se <em>clava</em> la tarjeta POST
                localiza la etapa muerta.
              </p>
              <div className="rounded-md border border-line overflow-hidden">
                <div className="grid grid-cols-[110px_80px_1fr] px-3 py-1.5 bg-bench-900 font-mono text-[9.5px] tracking-widest text-ink-faint uppercase">
                  <span>Rango</span><span>Etapa</span><span>Significado</span>
                </div>
                {POST_RANGES.map((r, i) => (
                  <div key={r.range} className={cn("grid grid-cols-[110px_80px_1fr] gap-2 px-3 py-1.5 text-[11.5px]", i % 2 === 0 ? "bg-bench-900/70" : "bg-bench-850/70")}>
                    <span className="font-mono text-[#ff8d84]">{r.range}</span>
                    <span className="font-mono text-sig">{r.phase}</span>
                    <span className="text-ink-dim">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
