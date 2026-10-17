import React, { useState } from "react";
import {
  AlertOctagon,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  Terminal,
  Zap,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const Sector28VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"PANIC_FLOW" | "IRQL_LADDER" | "STOP_ANATOMY">("PANIC_FLOW");
  const [selectedIrql, setSelectedIrql] = useState<number>(2);

  const irqlLevels = [
    { level: 15, name: "HIGH_LEVEL", desc: "Interrupciones de reloj de perfilado, NMI y pánico KeBugCheckEx. Enmascara todo.", safe: false, color: "text-red-400 border-red-500/40 bg-red-950/20" },
    { level: 12, name: "DIRQL (Device IRQL)", desc: "Líneas de interrupción de hardware directo (placas PCIe, SSDs, NICs). Muy breve.", safe: false, color: "text-amber-400 border-amber-500/40 bg-amber-950/20" },
    { level: 2, name: "DISPATCH_LEVEL", desc: "El planificador (scheduler) y las colas de DPC. ¡PELIGRO: Prohibido acceder a memoria paginada!", safe: false, color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/30" },
    { level: 1, name: "APC_LEVEL", desc: "Asynchronous Procedure Calls. Usado para finalización de I/O de archivos.", safe: true, color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/20" },
    { level: 0, name: "PASSIVE_LEVEL", desc: "Ejecución normal de hilos del kernel y modo usuario. Acceso total a memoria virtual paginada.", safe: true, color: "text-blue-400 border-blue-500/40 bg-blue-950/20" },
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Forense de Pánico del Kernel NT
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("PANIC_FLOW")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "PANIC_FLOW"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Flujo KeBugCheckEx
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("IRQL_LADDER")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "IRQL_LADDER"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Escalera IRQL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("STOP_ANATOMY")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "STOP_ANATOMY"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Anatomía Stop Code
          </button>
        </div>
      </div>

      {activeTab === "PANIC_FLOW" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            La secuencia inalterable que ejecuta el microkernel de Windows NT en el milisegundo de detectar una corrupción irrecuperable:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-red-400">
                <span>01. INVARIANTE ROTA</span>
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              </div>
              <div className="text-xs font-bold text-white">Violación de Memoria</div>
              <p className="text-[11px] text-zinc-400">
                Página inválida tocada en IRQL &gt;= 2, excepción no capturada en Ring 0 o error MCE de CPU.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span>02. CONGELAMIENTO</span>
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-white">IPIs a Todos los Cores</div>
              <p className="text-[11px] text-zinc-400">
                KeBugCheckEx eleva el IRQL a HIGH_LEVEL y emite interrupciones a cada núcleo para congelar el reloj.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>03. VOLCADO CRUDO</span>
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-white">Miniport diskdump.sys</div>
              <p className="text-[11px] text-zinc-400">
                Se reemplaza el driver de disco normal por un miniport de emergencia y se escribe la RAM en pagefile.sys.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>04. POST-REBOOT</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-white">Extracción smss.exe</div>
              <p className="text-[11px] text-zinc-400">
                Al reiniciar, el proceso smss lee el pagefile y extrae C:\Windows\Minidump o MEMORY.DMP para análisis.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "IRQL_LADDER" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Haz clic en cada nivel para inspeccionar las restricciones arquitectónicas que gobiernan el código de controladores:
          </p>
          <div className="space-y-2">
            {irqlLevels.map((lvl) => (
              <div
                key={lvl.level}
                onClick={() => setSelectedIrql(lvl.level)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  lvl.color
                } ${selectedIrql === lvl.level ? "ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "opacity-75 hover:opacity-100"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-black/40">
                    IRQL {lvl.level}
                  </span>
                  <span className="font-bold text-sm text-white font-mono">{lvl.name}</span>
                </div>
                <p className="text-xs text-zinc-300 max-w-xl">{lvl.desc}</p>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0 ${lvl.safe ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-red-950 text-red-300 border border-red-500/30"}`}>
                  {lvl.safe ? "Paging Permitido" : "Paging Prohibido"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "STOP_ANATOMY" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            La estructura canónica de los 4 parámetros en el error más representativo del kernel de Windows:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/30 font-mono text-xs space-y-3">
            <div className="text-cyan-400 font-bold text-sm">
              *** STOP: 0x0000000A (0x0000000000000028, 0x0000000000000002, 0x0000000000000000, 0xFFFFF8036B211045)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-cyan-400 block font-bold">Arg 1: Dirección</span>
                <span className="text-zinc-300">0x28 (Puntero nulo + offset de struct en memoria)</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-amber-400 block font-bold">Arg 2: IRQL</span>
                <span className="text-zinc-300">0x02 = DISPATCH_LEVEL (Prohibido acceder a disco)</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-emerald-400 block font-bold">Arg 3: Tipo Operación</span>
                <span className="text-zinc-300">0x00 = Intento de lectura de memoria (Read)</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-purple-400 block font-bold">Arg 4: Instruction Ptr</span>
                <span className="text-zinc-300">0xFFFFF803... RIP de CPU apuntando a la instrucción</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
