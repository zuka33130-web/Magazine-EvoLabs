import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  HardDrive,
  Cpu,
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  XCircle,
  Database,
  Shield,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
} from "lucide-react";

export const Sector35VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "RAM_THRASHING" | "PARASITIC_FOOTPRINT" | "REGISTRY_MYTH"
  >("RAM_THRASHING");

  // RAM Thrashing State
  const [isBoosterActive, setIsBoosterActive] = useState<boolean>(false);
  const [isAppReopened, setIsAppReopened] = useState<boolean>(false);

  return (
    <div className="rounded-2xl bg-[#080B10] border border-cyan-500/20 overflow-hidden font-mono text-xs">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-cyan-500/20 bg-[#05070A] p-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("RAM_THRASHING")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "RAM_THRASHING"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>RAM BOOSTER THRASHING SIMULATOR</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PARASITIC_FOOTPRINT")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "PARASITIC_FOOTPRINT"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>HUELLA PARASITARIA (ANTES VS DESPUÉS)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("REGISTRY_MYTH")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "REGISTRY_MYTH"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>REGISTRY CLEANER B-TREE BENCHMARK</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* TAB 1: RAM THRASHING SIMULATOR */}
        {activeTab === "RAM_THRASHING" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20">
              <div>
                <span className="text-white font-bold block text-sm">
                  Simulador de la Falacia EmptyWorkingSet()
                </span>
                <span className="text-zinc-400 text-xs">
                  Observa la paradoja: la RAM parece libre, pero el sistema sufre congelamientos por paginación en disco.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBoosterActive(!isBoosterActive);
                    setIsAppReopened(false);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    isBoosterActive
                      ? "bg-red-500/30 text-red-300 border border-red-500/50"
                      : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  {isBoosterActive ? "Resetear Estado Normal" : "¡Presionar 'Liberar RAM'!"}
                </button>
                {isBoosterActive && (
                  <button
                    type="button"
                    onClick={() => setIsAppReopened(!isAppReopened)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    {isAppReopened ? "Minimizar App" : "Volver a Usar la App"}
                  </button>
                )}
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Metric 1: RAM Usage Reported */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase block">Uso de RAM Reportado</span>
                <span
                  className={`text-2xl font-bold ${
                    isBoosterActive && !isAppReopened ? "text-green-400" : "text-amber-400"
                  }`}
                >
                  {isBoosterActive ? (isAppReopened ? "78%" : "22%") : "82%"}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {isBoosterActive && !isAppReopened ? "¡Falsa ilusión de velocidad!" : "Working Set activo en memoria"}
                </span>
              </div>

              {/* Metric 2: Disk I/O Activity */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-red-500/30 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase block">Actividad de Disco (C: Pagefile)</span>
                <span
                  className={`text-2xl font-bold ${
                    isBoosterActive ? "text-red-400 animate-pulse" : "text-zinc-300"
                  }`}
                >
                  {isBoosterActive ? (isAppReopened ? "96% (Lectura)" : "100% (Escritura)") : "1%"}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {isBoosterActive ? "Expulsión/Relectura masiva al SSD" : "I/O en reposo normal"}
                </span>
              </div>

              {/* Metric 3: Page Faults / sec */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-amber-500/30 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase block">Hard Page Faults / seg</span>
                <span
                  className={`text-2xl font-bold ${
                    isBoosterActive && isAppReopened ? "text-red-400" : "text-zinc-300"
                  }`}
                >
                  {isBoosterActive ? (isAppReopened ? "4.820 /s" : "320 /s") : "12 /s"}
                </span>
                <span className="text-[10px] text-zinc-500 block">Peticiones de memoria que van a disco</span>
              </div>

              {/* Metric 4: App Response Latency */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase block">Latencia de Respuesta de la App</span>
                <span
                  className={`text-2xl font-bold ${
                    isBoosterActive && isAppReopened ? "text-red-400" : "text-cyan-300"
                  }`}
                >
                  {isBoosterActive ? (isAppReopened ? "3.850 ms (Congelamiento)" : "0 ms (Minimizada)") : "8 ms"}
                </span>
                <span className="text-[10px] text-zinc-500 block">Tiempo de respuesta a clics del usuario</span>
              </div>
            </div>

            {/* Visual Process Flow */}
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-3">
              <span className="font-bold text-white text-xs uppercase block">
                Mecanismo Físico de Destrucción de Rendimiento:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-cyan-400 font-bold block">1. ESTADO ÓPTIMO NATIVO</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Windows mantiene tus programas abiertos en memoria RAM (nanosegundos de latencia) y llena el resto con caché Standby reutilizable.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-amber-400 font-bold block">2. DISPARO DEL BOOSTER</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    El programa invoca <code className="text-amber-300">EmptyWorkingSet()</code>. Windows obedece expulsando gigabytes de datos al pagefile.sys en el SSD.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-red-400 font-bold block">3. EL CASTIGO DEL RETORNO</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Al volver a usar tu navegador o juego, el procesador se detiene (stall) esperando que el SSD vuelva a leer los datos expulsados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARASITIC FOOTPRINT */}
        {activeTab === "PARASITIC_FOOTPRINT" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Clean Windows */}
              <div className="p-5 rounded-xl bg-[#0D121D] border border-green-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-bold text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instalación Limpia de Windows 11</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-green-950/60 text-green-300 text-[10px] font-bold">
                    ÓPTIMO
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Procesos en reposo:</span>
                    <span className="text-white font-bold">145 procesos</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Servicios de terceros en ejecución:</span>
                    <span className="text-white font-bold">0 servicios</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Tareas programadas no Microsoft:</span>
                    <span className="text-white font-bold">0 tareas</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Drivers en Ring 0 no certificados:</span>
                    <span className="text-white font-bold">0 drivers</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Latencia DPC media (LatencyMon):</span>
                    <span className="text-green-400 font-bold">45 µs (Excelente)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tiempo de arranque en frío:</span>
                    <span className="text-white font-bold">11.2 segundos</span>
                  </div>
                </div>
              </div>

              {/* Box 2: With Optimizer Suite */}
              <div className="p-5 rounded-xl bg-[#0D121D] border border-red-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-bold text-xs uppercase flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Misma PC con Suite "Optimizadora"</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 text-[10px] font-bold">
                    DEGRADADO
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Procesos en reposo:</span>
                    <span className="text-red-400 font-bold">162 procesos (+17)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Servicios de terceros en ejecución:</span>
                    <span className="text-red-400 font-bold">4 servicios automáticos</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Tareas programadas no Microsoft:</span>
                    <span className="text-red-400 font-bold">6 tareas (Scan & Ads)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Drivers en Ring 0 no certificados:</span>
                    <span className="text-red-400 font-bold">2 drivers (.sys)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-400">Latencia DPC media (LatencyMon):</span>
                    <span className="text-red-400 font-bold">420 µs (Riesgo stutter)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tiempo de arranque en frío:</span>
                    <span className="text-red-400 font-bold">16.8 segundos (+5.6 seg)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-zinc-300 space-y-1">
              <span className="text-amber-400 font-bold block text-xs uppercase">
                Conclusión Basada en Datos de Telemetría:
              </span>
              <p className="text-xs leading-relaxed text-zinc-300">
                Instalar software utilitario con la promesa de "limpiar y acelerar" resulta en exactamente lo opuesto:
                más hilos compitiendo por el Scheduler, mayor consumo de memoria no paginada en el kernel y mayor latencia de interrupciones de hardware.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRY MYTH BENCHMARK */}
        {activeTab === "REGISTRY_MYTH" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-4">
              <span className="font-bold text-white text-xs uppercase block">
                Arquitectura del Registro: Algoritmo B-Tree O(log N) vs Búsqueda Lineal O(N)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-black/40 border border-red-500/20 space-y-2">
                  <span className="text-red-400 font-bold block uppercase text-[11px]">
                    El Mito: Lectura Lineal Secuencial
                  </span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Los promotores de optimizadores afirman falsamente que Windows lee las 200.000 claves del registro
                    una por una desde el principio hasta el final. Si eliminas 1.000 claves, supuestamente Windows "ahorra tiempo leyendo".
                  </p>
                  <div className="p-2 rounded bg-red-950/30 border border-red-500/30 text-[10px] text-red-300">
                    Completamente falso en la ingeniería de NT desde 1993.
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-green-500/20 space-y-2">
                  <span className="text-green-400 font-bold block uppercase text-[11px]">
                    La Realidad: Árbol B Indexado en Memoria
                  </span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    El subsistema de configuración (Configuration Manager) indexa las celdas del registro en memoria paginada.
                    La búsqueda de una clave se realiza por hash en tiempo constante O(1) o logarítmico O(log N).
                  </p>
                  <div className="p-2 rounded bg-green-950/30 border border-green-500/30 text-[10px] text-green-300">
                    Tener 10.000 claves huérfanas añade 0.00 milisegundos de latencia.
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison Table */}
            <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/20 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase block text-xs">
                Benchmark de Acceso con RegQueryValueExW (1.000.000 de consultas):
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-zinc-300 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase">
                      <th className="py-2">Estado del Registro</th>
                      <th className="py-2">Claves Totales</th>
                      <th className="py-2">Tiempo de Consulta</th>
                      <th className="py-2">Impacto en CPU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-[11px]">
                    <tr>
                      <td className="py-2 text-white font-bold">Registro "Limpio" (Post-Cleaner)</td>
                      <td className="py-2 text-zinc-400">182.410</td>
                      <td className="py-2 text-cyan-300">14.22 ms</td>
                      <td className="py-2 text-zinc-400">0.00%</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-bold">Registro con 10.000 Claves Huérfanas</td>
                      <td className="py-2 text-zinc-400">192.410</td>
                      <td className="py-2 text-cyan-300">14.24 ms</td>
                      <td className="py-2 text-zinc-400">0.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-zinc-500 pt-1">
                Diferencia medida: 0.02 milisegundos por millón de consultas (indistinguible del ruido térmico del procesador).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
