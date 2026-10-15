import React, { useState } from "react";
import {
  Activity,
  HardDrive,
  Cpu,
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

export const Sector36VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "BOTTLENECK_MATRIX" | "UPGRADE_DECISION_TREE" | "SATURATION_BENCHMARK"
  >("BOTTLENECK_MATRIX");

  // State for Decision Tree
  const [selectedDisk, setSelectedDisk] = useState<"HDD" | "SSD_SATA" | "SSD_NVME">("HDD");
  const [selectedRAM, setSelectedRAM] = useState<"4GB" | "8GB_SINGLE" | "8GB_DUAL" | "16GB_DUAL">("8GB_SINGLE");
  const [selectedUsage, setSelectedUsage] = useState<"OFICINA" | "GAMING" | "EDICION">("OFICINA");

  // State for Bottleneck Selector
  const [selectedSymptom, setSelectedSymptom] = useState<
    "BOOT" | "APP_LAUNCH" | "ALWAYS" | "GAMES" | "AFTER_HOURS"
  >("BOOT");

  const symptomData = {
    BOOT: {
      title: "Lentitud al Iniciar (Arranque de más de 60 segundos)",
      primarySuspect: "Disco Rígido Mecánico (HDD) o Exceso de Programas de Inicio",
      metricToWatch: "Diagnostics-Performance Event 100 / 'Tiempo de última BIOS' en Task Manager",
      immediateAction: "Deshabilitar programas de inicio en Task Manager; migrar unidad de sistema a SSD.",
      techDetail: "Un HDD debe mover físicamente el cabezal para leer miles de DLLs de arranque en paralelo, saturando la cola a 5.000 ms.",
    },
    APP_LAUNCH: {
      title: "El cursor gira durante segundos al hacer clic en programas",
      primarySuspect: "Latencia de I/O de almacenamiento o falta de memoria disponible",
      metricToWatch: "PhysicalDisk Avg. Disk sec/Read (> 0.050 s) / Disk Active Time 100%",
      immediateAction: "Verificar si la unidad C: tiene menos del 15% de espacio libre o si SysMain está colapsando el disco.",
      techDetail: "La creación de imagen de proceso (CreateProcess) se bloquea esperando que el kernel resuelva la tabla de importaciones (IAT) desde disco.",
    },
    ALWAYS: {
      title: "Lentitud continua incluso en el escritorio sin nada abierto",
      primarySuspect: "Estrangulamiento Térmico (CPU a 0.79 GHz) o Proceso Rogue al 100%",
      metricToWatch: "Frecuencia de CPU en Task Manager (< 1.0 GHz) / Temperatura > 90°C",
      immediateAction: "Limpiar pelusa de disipador y renovar pasta térmica; comprobar si el cargador de la laptop entrega voltaje adecuado.",
      techDetail: "El sensor PROCHOT bloquea el multiplicador en x8 (800 MHz) para evitar que el silicio alcance los 105°C de destrucción.",
    },
    GAMES: {
      title: "El juego marca FPS aceptables pero tiene tirones (micro-stuttering)",
      primarySuspect: "Desborde de VRAM hacia RAM o Memoria en Single Channel",
      metricToWatch: "Frametime 1% Low / Memoria GPU Compartida en uso en Task Manager",
      immediateAction: "Bajar la calidad de texturas para que quepa en la VRAM dedicada; agregar un segundo módulo de RAM para activar Dual Channel.",
      techDetail: "Cuando la GPU satura su VRAM dedicada, transfiere texturas por el bus PCIe a la RAM del sistema, multiplicando la latencia por 20.",
    },
    AFTER_HOURS: {
      title: "La PC vuela al encender, pero tras varias horas se vuelve inservible",
      primarySuspect: "Fuga de Memoria (Memory Leak) en Non-Paged Pool por driver defectuoso",
      metricToWatch: "Memoria 'Grupo no paginado' > 1.5 GB en Task Manager",
      immediateAction: "Usar poolmon.exe para identificar la etiqueta del driver con fuga (tags comunes: Wfpn, Netr, Killer Network).",
      techDetail: "El Non-Paged Pool jamás puede enviarse al pagefile en disco; si un driver pierde memoria, ahoga la RAM física hasta el colapso.",
    },
  };

  const currSymptom = symptomData[selectedSymptom];

  // Logic for Upgrade Decision Tree
  const getRecommendation = () => {
    if (selectedDisk === "HDD") {
      return {
        priority1: "MIGRAR A SSD (SATA O NVME) DE 500 GB / 1 TB",
        p1Reason: "El disco mecánico es un cuello de botella que anula cualquier otro componente. El salto a SSD multiplicará la fluidez del equipo por 10.",
        priority2: selectedRAM === "4GB" ? "Llevar la RAM a 8 GB o 16 GB" : "Configurar RAM en Dual Channel",
        costBenefit: "Retorno de Inversión (ROI): Máximo Absoluto (Costo: ~$30 USD)",
      };
    }
    if (selectedRAM === "4GB") {
      return {
        priority1: "AMPLIAR MEMORIA RAM A 16 GB EN DUAL CHANNEL (2x8 GB)",
        p1Reason: "4 GB es el límite crítico operativo. Con 16 GB eliminarás el archivo de paginación constante y permitirás multitarea fluida.",
        priority2: "Verificar espacio libre en SSD (> 20%)",
        costBenefit: "Retorno de Inversión (ROI): Muy Alto (Costo: ~$25 USD)",
      };
    }
    if (selectedRAM === "8GB_SINGLE") {
      return {
        priority1: "AGREGAR SEGUNDO MÓDULO DE 8 GB (ACTIVAR DUAL CHANNEL)",
        p1Reason: "Tener 1 solo módulo corta a la mitad el ancho de banda del procesador y estrangula a la gráfica integrada.",
        priority2: selectedUsage === "GAMING" ? "Evaluar GPU dedicada con al menos 8 GB VRAM" : "Mantenimiento térmico de CPU",
        costBenefit: "Retorno de Inversión (ROI): Excelente (Costo: ~$20 USD)",
      };
    }
    return {
      priority1: selectedUsage === "GAMING" ? "ACTUALIZAR TARJETA GRÁFICA (GPU DEDICADA)" : "MANTENIMIENTO TÉRMICO Y LIMPIEZA DE SOFTWARE",
      p1Reason: "La base de almacenamiento y memoria es óptima. Para ganar rendimiento en gaming o render, el límite es el chip gráfico o la refrigeración.",
      priority2: "Actualizar procesador a arquitectura con mayor IPC por núcleo",
      costBenefit: "Retorno de Inversión (ROI): Específico de carga de trabajo",
    };
  };

  const rec = getRecommendation();

  return (
    <div className="rounded-2xl bg-[#080B10] border border-cyan-500/20 overflow-hidden font-mono text-xs">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-cyan-500/20 bg-[#05070A] p-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("BOTTLENECK_MATRIX")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "BOTTLENECK_MATRIX"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>MATRIZ DIAGNÓSTICA DE SÍNTOMAS</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("UPGRADE_DECISION_TREE")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "UPGRADE_DECISION_TREE"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>ÁRBOL DE DECISIÓN DE UPGRADE (ROI)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("SATURATION_BENCHMARK")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "SATURATION_BENCHMARK"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>BENCHMARK FÍSICO: HDD VS SSD VS DUAL-CH</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* TAB 1: BOTTLENECK MATRIX */}
        {activeTab === "BOTTLENECK_MATRIX" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0E17] p-3 rounded-xl border border-cyan-500/10">
              <div>
                <span className="text-zinc-400 block text-[11px]">Selecciona el Síntoma Temporal:</span>
                <span className="text-white font-bold">¿En qué momento exacto se percibe la lentitud?</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { key: "BOOT", label: "Arranque" },
                    { key: "APP_LAUNCH", label: "Abrir Apps" },
                    { key: "ALWAYS", label: "Siempre en Reposo" },
                    { key: "GAMES", label: "En Juegos" },
                    { key: "AFTER_HOURS", label: "Tras Horas Encendida" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedSymptom(item.key)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedSymptom === item.key
                        ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#0C121D] via-[#080B10] to-[#0A0F1A] border-2 border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-white font-bold text-sm uppercase">{currSymptom.title}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  DIAGNÓSTICO AISLADO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-amber-400 font-bold block text-[10px] uppercase">
                    Sospechoso de Hardware / Sistema Primario:
                  </span>
                  <p className="text-white font-bold">{currSymptom.primarySuspect}</p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[10px] uppercase">
                    Métrica Cuantitativa a Medir:
                  </span>
                  <p className="text-zinc-300">{currSymptom.metricToWatch}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <span className="text-cyan-300 font-bold block text-xs uppercase">
                  Acción Técnica Inmediata:
                </span>
                <p className="text-zinc-200">{currSymptom.immediateAction}</p>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-white font-bold block mb-0.5">Explicación Física de Ingeniería:</span>
                {currSymptom.techDetail}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPGRADE DECISION TREE */}
        {activeTab === "UPGRADE_DECISION_TREE" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-4">
              <span className="text-white font-bold text-sm block">
                Calculadora de Retorno de Inversión (ROI) en Actualización
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Selector 1: Disco */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-bold uppercase">
                    1. Unidad de Disco Actual:
                  </label>
                  <select
                    value={selectedDisk}
                    onChange={(e) => setSelectedDisk(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="HDD">HDD Mecánico (5400 / 7200 RPM)</option>
                    <option value="SSD_SATA">SSD SATA de 2.5"</option>
                    <option value="SSD_NVME">SSD M.2 NVMe PCIe</option>
                  </select>
                </div>

                {/* Selector 2: RAM */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-bold uppercase">
                    2. Memoria RAM Actual:
                  </label>
                  <select
                    value={selectedRAM}
                    onChange={(e) => setSelectedRAM(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="4GB">4 GB (Límite crítico)</option>
                    <option value="8GB_SINGLE">8 GB Single Channel (1 módulo)</option>
                    <option value="8GB_DUAL">8 GB Dual Channel (2x4 GB)</option>
                    <option value="16GB_DUAL">16 GB Dual Channel (2x8 GB)</option>
                  </select>
                </div>

                {/* Selector 3: Uso */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-bold uppercase">
                    3. Perfil de Uso:
                  </label>
                  <select
                    value={selectedUsage}
                    onChange={(e) => setSelectedUsage(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="OFICINA">Oficina / Estudio / Navegación</option>
                    <option value="GAMING">Gaming / Videojuegos</option>
                    <option value="EDICION">Edición de Video / Render 3D</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#0C121D] via-[#080B10] to-[#0A0F1A] border-2 border-green-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-green-400 font-bold text-xs uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dictamen Pericial de Inversión Recomendada</span>
                </span>
                <span className="text-zinc-400 text-[10px]">{rec.costBenefit}</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-green-950/30 border border-green-500/30 space-y-1">
                  <span className="text-green-300 font-bold text-xs uppercase block">
                    PRIORIDAD NÚMERO 1 ABSOLUTA:
                  </span>
                  <div className="text-white font-bold text-sm">{rec.priority1}</div>
                  <p className="text-zinc-300 text-xs pt-1">{rec.p1Reason}</p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                  <span className="text-cyan-400 font-bold text-[10px] uppercase block">
                    Prioridad Secundaria (Siguiente Paso):
                  </span>
                  <p className="text-zinc-300 text-xs">{rec.priority2}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SATURATION BENCHMARK */}
        {activeTab === "SATURATION_BENCHMARK" && (
          <div className="space-y-6">
            <div className="space-y-3 font-mono text-xs">
              <span className="text-white font-bold uppercase block">
                Comparativa de Capacidad de Entrada/Salida (IOPS) y Latencia Física:
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-zinc-300 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase">
                      <th className="py-2">Medio de Almacenamiento</th>
                      <th className="py-2">IOPS Aleatorias (4K)</th>
                      <th className="py-2">Tiempo de Acceso</th>
                      <th className="py-2">Comportamiento con Win 11</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-[11px]">
                    <tr>
                      <td className="py-2 text-red-400 font-bold">HDD Mecánico (5400 RPM)</td>
                      <td className="py-2 text-zinc-400">~75 - 100 IOPS</td>
                      <td className="py-2 text-red-400 font-bold">12.000 µs (12 ms)</td>
                      <td className="py-2 text-red-300">Colapso al 100% continuo</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-cyan-300 font-bold">SSD SATA 2.5"</td>
                      <td className="py-2 text-zinc-400">~90.000 IOPS</td>
                      <td className="py-2 text-cyan-300 font-bold">100 µs (0.1 ms)</td>
                      <td className="py-2 text-green-300">Fluidez total de oficina</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-green-400 font-bold">SSD NVMe PCIe 4.0</td>
                      <td className="py-2 text-zinc-400">&gt; 700.000 IOPS</td>
                      <td className="py-2 text-green-400 font-bold">20 µs (0.02 ms)</td>
                      <td className="py-2 text-green-300">Respuesta instantánea</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>La Física Inapelable del Acceso a Datos</span>
              </div>
              <p className="text-xs leading-relaxed">
                Un SSD NVMe es <strong className="text-white">600 veces más rápido en latencia</strong> que un disco mecánico.
                El cabezal mecánico requiere rotación y movimiento electromagnético, lo que impone un límite de velocidad que ningún software,
                truco de registro ni formateo podrá acelerar jamás.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
