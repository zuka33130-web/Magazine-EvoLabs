import { useEffect, useState } from "react";
import Controls from "./components/Controls";
import FaultPanel from "./components/FaultPanel";
import LogConsole from "./components/LogConsole";
import MonitorCard from "./components/MonitorCard";
import Motherboard from "./components/Motherboard";
import PhaseDetail from "./components/PhaseDetail";
import ReferenceModal from "./components/ReferenceModal";
import SignalPanel from "./components/SignalPanel";
import StatusStrip from "./components/StatusStrip";
import Timeline from "./components/Timeline";
import VoltagePanel from "./components/VoltagePanel";
import { useBootSim } from "./engine/useBootSim";

export default function App() {
  const sim = useBootSim();
  const { snap } = sim;
  const acOn = snap.status !== "g3";
  const [showRef, setShowRef] = useState(false);
  const [showFault, setShowFault] = useState(false);

  useEffect(() => {
    if (snap.status === "fault") setShowFault(true);
  }, [snap.status, snap.fault]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bench-grid pointer-events-none" aria-hidden />

      <div className="relative max-w-[1440px] mx-auto px-3 sm:px-5 py-4 lg:py-6 space-y-4">
        {/* ---------- cabecera / consola de mandos ---------- */}
        <header className="panel px-4 sm:px-5 py-4">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-lg border border-volt/40 bg-volt-soft flex items-center justify-center shadow-[0_0_18px_rgba(255,178,36,0.15)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb224" strokeWidth="1.6">
                  <rect x="6" y="6" width="12" height="12" rx="1.5" />
                  <rect x="9.5" y="9.5" width="5" height="5" fill="#ffb224" stroke="none" opacity="0.85" />
                  {[8, 12, 16].map((p) => (
                    <g key={p}>
                      <line x1={p} y1="2.5" x2={p} y2="6" />
                      <line x1={p} y1="18" x2={p} y2="21.5" />
                      <line x1="2.5" y1={p} x2="6" y2={p} />
                      <line x1="18" y1={p} x2="21.5" y2={p} />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="leading-tight">
                <h1 className="text-[21px] font-bold tracking-tight">
                  POST<span className="text-volt">·</span>LAB
                </h1>
                <p className="text-[10.5px] font-mono text-ink-dim tracking-wide">
                  Simulador de arranque de PC · hardware al descubierto
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <Controls
                snap={snap}
                acOn={acOn}
                onAC={sim.setAC}
                onPower={sim.power}
                onPause={sim.pauseToggle}
                onStep={sim.stepPhase}
                onSpeed={sim.setSpeed}
                onSound={sim.toggleSound}
                onScenario={sim.setScenario}
                onReference={() => setShowRef(true)}
              />
            </div>
          </div>
        </header>

        {/* ---------- guía de inicio ---------- */}
        {snap.status === "g3" && (
          <div className="panel border-l-2 border-l-volt px-4 py-3 rise-in">
            <p className="text-[12.5px] text-ink-dim leading-relaxed">
              <span className="font-semibold text-ink">Protocolo de banco:</span>{" "}
              <span className="text-volt font-mono text-[11.5px]">1.</span> conecta el interruptor{" "}
              <span className="font-mono text-volt">AC</span> (la fuente activará el standby +5VSB) →{" "}
              <span className="text-volt font-mono text-[11.5px]">2.</span> pulsa{" "}
              <span className="font-mono text-volt">POWER</span> (el EC bajará PS_ON#) →{" "}
              <span className="text-volt font-mono text-[11.5px]">3.</span> observa raíles, señales, códigos POST y la
              consola del firmware. Elige un <span className="font-semibold text-ink">escenario de fallo</span> para
              practicar diagnósticos reales.
            </p>
          </div>
        )}

        {/* ---------- franja de estado ---------- */}
        <StatusStrip snap={snap} />

        {/* ---------- zona principal ---------- */}
        <main className="grid lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <section className="panel p-3 sm:p-4">
              <header className="flex items-center justify-between mb-2 px-1">
                <h2 className="panel-title">Placa base · vista superior</h2>
                <span className="text-[10px] font-mono text-ink-faint">
                  {snap.status === "fault" && snap.fault
                    ? `⛔ ${snap.fault.name}`
                    : snap.status === "on"
                      ? "sistema operativo en marcha"
                      : "los componentes se iluminan según su estado"}
                </span>
              </header>
              <Motherboard
                phaseIndex={snap.phaseIndex}
                status={snap.status}
                faultId={snap.fault?.id ?? null}
                voltages={snap.voltages}
              />
            </section>
            <Timeline snap={snap} onJump={sim.jumpTo} />
          </div>

          <div className="lg:col-span-5 space-y-4 min-w-0">
            <MonitorCard snap={snap} />
            <VoltagePanel voltages={snap.voltages} />
            <SignalPanel signals={snap.signals} />
          </div>
        </main>

        {/* ---------- ficha técnica + consola ---------- */}
        <div className="grid lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-7 min-w-0">
            <PhaseDetail snap={snap} onOpenFault={() => setShowFault(true)} />
          </div>
          <div className="lg:col-span-5 min-w-0 flex">
            <div className="flex-1 flex">
              <LogConsole logs={snap.logs} />
            </div>
          </div>
        </div>

        <footer className="pb-4 text-center">
          <p className="text-[10px] font-mono text-ink-faint/80">
            Simulación didáctica de la secuencia de arranque x86 / UEFI · tolerancias según ATX12V · códigos POST y
            pitidos de referencia AMI Aptio · valores de laboratorio típicos, no sustituyen el manual del fabricante
          </p>
        </footer>
      </div>

      {/* ---------- modales ---------- */}
      {showFault && snap.fault && (
        <FaultPanel
          fault={snap.fault}
          postCode={snap.postCode}
          onRetry={() => {
            setShowFault(false);
            sim.power();
          }}
          onClose={() => setShowFault(false)}
        />
      )}
      {showRef && <ReferenceModal onClose={() => setShowRef(false)} />}
    </div>
  );
}
