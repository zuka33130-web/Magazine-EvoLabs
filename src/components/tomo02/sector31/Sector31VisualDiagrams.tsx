import React, { useState } from "react";
import {
  Activity,
  Terminal,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  Sliders,
  Filter,
} from "lucide-react";

export const Sector31VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "PROCEXP_HIERARCHY" | "PROCMON_FILTER_FLOW" | "RAMMAP_PAGE_LISTS"
  >("PROCEXP_HIERARCHY");

  // State for Process Explorer demo
  const [selectedProcess, setSelectedProcess] = useState<string>("legit_svchost");

  // State for ProcMon filter simulation
  const [dropFilteredEvents, setDropFilteredEvents] = useState<boolean>(true);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Forense Visual: Sysinternals Deep Internals
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("PROCEXP_HIERARCHY")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "PROCEXP_HIERARCHY"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1. Árbol Genealógico Process Explorer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PROCMON_FILTER_FLOW")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "PROCMON_FILTER_FLOW"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2. Filtro Minifiltro ProcMon
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("RAMMAP_PAGE_LISTS")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "RAMMAP_PAGE_LISTS"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3. Listas de Páginas RAMMap
          </button>
        </div>
      </div>

      {/* TAB 1: PROCEXP HIERARCHY */}
      {activeTab === "PROCEXP_HIERARCHY" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Validación de Árbol de PIDs y Linaje de svchost.exe
            </h5>
            <p className="text-xs text-zinc-300">
              Process Explorer revela el árbol genealógico real. Los procesos del sistema tienen un linaje estricto que nunca debe romperse. Haz clic en un proceso para auditar su legitimidad:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "system_root",
                name: "System (PID 4)",
                parent: "None (Kernel Thread Container)",
                verified: true,
                color: "border-cyan-500/30 text-cyan-400",
                desc: "Contenedor de hilos de Ring 0. Siempre PID 4 en Windows NT moderno.",
              },
              {
                id: "legit_svchost",
                name: "services.exe → svchost.exe (PID 1240)",
                parent: "services.exe (PID 680)",
                verified: true,
                color: "border-emerald-500/30 text-emerald-400",
                desc: "Legítimo: Nació como hijo de services.exe en Session 0 con parámetro -k.",
              },
              {
                id: "fake_svchost",
                name: "cmd.exe → svchost.exe (PID 5912)",
                parent: "cmd.exe (PID 3320)",
                verified: false,
                color: "border-red-500/50 text-red-400",
                desc: "¡ALERTA IMPOSTOR! svchost.exe jamás puede nacer de cmd.exe ni powershell.exe.",
              },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProcess(p.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProcess === p.id
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-[#0A0E17] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono font-bold ${p.color}`}>{p.name}</span>
                  {p.verified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mb-2">Padre: {p.parent}</div>
                <p className="text-[11px] text-zinc-300 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-cyan-500/30 font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400">
              Regla de oro pericial: <span className="text-cyan-300 font-bold">Un svchost huérfano o hijo de un proceso de usuario es 100% sospechoso.</span>
            </span>
            <span className="text-[10px] text-zinc-500">Process Explorer v17+</span>
          </div>
        </div>
      )}

      {/* TAB 2: PROCMON FILTER FLOW */}
      {activeTab === "PROCMON_FILTER_FLOW" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Simulación del Minifiltro PROCMON24.SYS y Buffer de Memoria
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Observa cómo influye activar "Drop Filtered Events" en el consumo de memoria del sistema:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDropFilteredEvents(!dropFilteredEvents)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                dropFilteredEvents
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Drop Filtered Events: {dropFilteredEvents ? "ACTIVADO (Seguro)" : "DESACTIVADO (Peligro)"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">Tasa de Eventos de Kernel:</span>
              <div className="text-xl font-bold text-white">~450.000 / seg</div>
              <p className="text-[10px] text-zinc-500">Llamadas a Registry (RegQueryValue) y File I/O interceptadas en Ring 0.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">Memoria RAM Asignada:</span>
              <div className={`text-xl font-bold ${dropFilteredEvents ? "text-emerald-400" : "text-red-400"}`}>
                {dropFilteredEvents ? "32 MB (Estable)" : "3.8 GB (Creciendo)"}
              </div>
              <p className="text-[10px] text-zinc-500">
                {dropFilteredEvents
                  ? "Los eventos descartados se liberan inmediatamente en el pool de kernel."
                  : "Sin Drop Filtered Events, cada operación se acumula en RAM hasta colapsar el sistema."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">Filtro de Diagnóstico:</span>
              <div className="text-sm font-bold text-cyan-300">Process Name is app.exe</div>
              <p className="text-[10px] text-zinc-500">Aislar únicamente el PID bajo investigación para un análisis quirúrgico.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAMMAP PAGE LISTS */}
      {activeTab === "RAMMAP_PAGE_LISTS" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Arquitectura de Listas de Páginas de Memoria Física en NT (RAMMap)
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Windows clasifica cada marco de página (Page Frame) de 4 KB en una de 6 listas dinámicas. La memoria en estado <strong>Standby</strong> es caché viva de disco; eliminarla a la fuerza degrada el rendimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold block text-[11px]">1. ACTIVE LIST</span>
              <span className="text-white text-base font-bold">8.2 GB</span>
              <p className="text-[10px] text-zinc-400 leading-tight">Páginas activamente leídas o escritas por hilos de programas en ejecución.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-500/30 space-y-1">
              <span className="text-cyan-400 font-bold block text-[11px]">2. STANDBY LIST</span>
              <span className="text-white text-base font-bold">6.1 GB</span>
              <p className="text-[10px] text-zinc-400 leading-tight">Caché de archivos respaldada en disco. Reutilizable en 0 nanosegundos.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-amber-500/30 space-y-1">
              <span className="text-amber-400 font-bold block text-[11px]">3. MODIFIED LIST</span>
              <span className="text-white text-base font-bold">450 MB</span>
              <p className="text-[10px] text-zinc-400 leading-tight">Páginas con cambios pendientes de ser volcadas a disco por el Lazy Writer.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-purple-500/30 space-y-1">
              <span className="text-purple-400 font-bold block text-[11px]">4. FREE & ZEROED</span>
              <span className="text-white text-base font-bold">1.2 GB</span>
              <p className="text-[10px] text-zinc-400 leading-tight">Páginas limpias listas para nueva asignación inmediata sin residuo previo.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
