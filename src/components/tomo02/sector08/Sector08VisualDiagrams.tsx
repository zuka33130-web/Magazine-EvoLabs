import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  HardDrive,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  RefreshCw,
  Info,
  ArrowDown,
  ArrowRight,
  Database,
} from 'lucide-react';

export const Sector08VisualDiagrams: React.FC = () => {
  const [activeMemoryTab, setActiveMemoryTab] = useState<'MAP' | 'COMMIT' | 'POOLS' | 'LISTS'>('MAP');
  const [selectedBlock, setSelectedBlock] = useState<string | null>('ram_physical');

  return (
    <div className="space-y-8 my-8 text-slate-200">
      {/* Central Visual Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Diagrama Arquitectónico Canónico // Sector 08</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 font-sans">
              WINDOWS MEMORY & COMMIT ARCHITECTURE MAP
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Jerarquía de Memoria Virtual, Commit Limit, Pools del Kernel y Gestión de Páginas en Windows
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveMemoryTab('MAP')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMemoryTab === 'MAP'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Mapa Global (Address Space)
            </button>
            <button
              onClick={() => setActiveMemoryTab('COMMIT')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMemoryTab === 'COMMIT'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Commit Limit vs RAM
            </button>
            <button
              onClick={() => setActiveMemoryTab('POOLS')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMemoryTab === 'POOLS'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Kernel Pools (Paged/Non-Paged)
            </button>
            <button
              onClick={() => setActiveMemoryTab('LISTS')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMemoryTab === 'LISTS'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Page Lists (Standby/Modified/Free)
            </button>
          </div>
        </div>

        {/* Tab 1: Global Address Space Map */}
        {activeMemoryTab === 'MAP' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setSelectedBlock('ram_physical')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBlock === 'ram_physical'
                    ? 'border-blue-500 bg-blue-950/30'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400 font-bold">16 GB</span>
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm">RAM Física Instalada</h4>
                <p className="text-xs text-slate-400 mt-1">DIMMs de silicio ultrarrápido (DDR4/DDR5)</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Hardware Res.: 1.2 GB</span>
                  <span>Usable: 14.8 GB</span>
                </div>
              </div>

              <div 
                onClick={() => setSelectedBlock('virtual_space')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBlock === 'virtual_space'
                    ? 'border-blue-500 bg-blue-950/30'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400 font-bold">128 TB (x64)</span>
                  <Layers className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm">Virtual Address Space</h4>
                <p className="text-xs text-slate-400 mt-1">Direccionamiento lógico único por proceso</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>User Space: 128 TB</span>
                  <span>Kernel: 128 TB</span>
                </div>
              </div>

              <div 
                onClick={() => setSelectedBlock('pagefile_backed')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBlock === 'pagefile_backed'
                    ? 'border-blue-500 bg-blue-950/30'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400 font-bold">Pagefile + RAM</span>
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm">Commit Limit Total</h4>
                <p className="text-xs text-slate-400 mt-1">Promesa máxima de memoria garantizable</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>RAM: 16 GB</span>
                  <span>Pagefile: 8 GB</span>
                </div>
              </div>
            </div>

            {/* Explanation box based on selection */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300">
              {selectedBlock === 'ram_physical' && (
                <div>
                  <h5 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5 font-mono">
                    <Info className="w-3.5 h-3.5" /> 08.01 / 08.16 — RAM FÍSICA Y RECURSO SILICIO
                  </h5>
                  <p>
                    La memoria RAM física suministra las celdas de capacitor donde el procesador lee instrucciones de nanosegundos.
                    Windows gestiona la RAM física no como un contenedor que deba estar vacío, sino como una caché activa. La memoria RAM que figura como "Disponible" incluye la Standby List (caché precargada).
                  </p>
                </div>
              )}
              {selectedBlock === 'virtual_space' && (
                <div>
                  <h5 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5 font-mono">
                    <Info className="w-3.5 h-3.5" /> 08.02 / 08.05 — VIRTUAL ADDRESS SPACE & WORKING SET
                  </h5>
                  <p>
                    En arquitecturas x64, cada proceso recibe un espacio virtual plano de hasta 128 Terabytes. Las direcciones que el programa lee no corresponden con chips físicos directos; la MMU (Memory Management Unit) traduce direcciones virtuales a páginas físicas (Physical Pages) bajo la supervisión del Kernel.
                  </p>
                </div>
              )}
              {selectedBlock === 'pagefile_backed' && (
                <div>
                  <h5 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5 font-mono">
                    <Info className="w-3.5 h-3.5" /> 08.03 / 08.04 — COMMIT LIMIT & COMMITTED MEMORY
                  </h5>
                  <p>
                    El <strong>Commit Limit</strong> es el techo infranqueable de memoria virtual reservada que el sistema promete entregar. Equivale exactamente a: <code className="text-blue-300 font-mono">RAM Física Usable + Capacidad Actual de pagefile.sys</code>. Si los programas solicitan más Commit que este límite, ocurre el error crítico Out of Memory.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Commit Limit vs Physical RAM */}
        {activeMemoryTab === 'COMMIT' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
              <div className="text-slate-400 mb-3 flex justify-between items-center">
                <span>ESTADO DE COMMIT Y MEMORIA VIRTUAL EN TIEMPO REAL (SIMULACIÓN)</span>
                <span className="text-blue-400">RAM: 16.0 GB | Pagefile: 4.0 GB | Commit Limit: 20.0 GB</span>
              </div>

              {/* Progress bar simulation */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Committed Memory (12.4 GB / 20.0 GB)</span>
                    <span className="text-blue-400">62% Commit Usado</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                    <div className="bg-blue-600 h-full w-[45%]" title="En RAM Física" />
                    <div className="bg-amber-600 h-full w-[17%]" title="Respaldado en Pagefile" />
                    <div className="bg-slate-800 h-full w-[38%]" title="Commit Libre" />
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block mb-1">Committed In RAM (Physical)</span>
                    <span className="text-base font-bold text-blue-400">9.0 GB</span>
                    <p className="text-[11px] text-slate-500 mt-1">Páginas activas mapeadas directamente en chips RAM.</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block mb-1">Committed In Pagefile (Disk)</span>
                    <span className="text-base font-bold text-amber-400">3.4 GB</span>
                    <p className="text-[11px] text-slate-500 mt-1">Páginas inactivas o modificadas escritas en C:\pagefile.sys.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs text-amber-200/90 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Error Frecuente:</strong> Desactivar el <code className="font-mono text-amber-300">pagefile.sys</code> creyendo que "con 16 GB de RAM sobra" reduce el Commit Limit a exactamente 16 GB. Cuando aplicaciones pesadas prometen más de 16 GB virtual, el sistema colapsará o cerrará juegos repentinamente sin aviso de falta de RAM física.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Kernel Pools */}
        {activeMemoryTab === 'POOLS' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-blue-400 font-mono text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>08.09 — NON-PAGED POOL (PAGINABLE: NO)</span>
                </div>
                <h5 className="font-semibold text-slate-200 text-sm">Memoria Sagrada del Kernel</h5>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  Estructuras de datos críticas que deben permanecer en RAM física de forma permanente (ISRs, tablas DPC, descriptores de archivos).
                </p>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between"><span>Rango Normal:</span> <span className="text-blue-400">200 MB – 800 MB</span></div>
                  <div className="flex justify-between"><span>Comportamiento:</span> <span>Intocable por Pagefile</span></div>
                  <div className="flex justify-between text-amber-400 font-semibold"><span>Alerta de Leak:</span> <span>&gt; 2.0 GB constante</span></div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-indigo-400 font-mono text-xs font-bold">
                  <Database className="w-4 h-4" />
                  <span>08.08 — PAGED POOL (PAGINABLE: SÍ)</span>
                </div>
                <h5 className="font-semibold text-slate-200 text-sm">Memoria Kernel Paginable</h5>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  Memoria asignada a componentes del sistema y drivers que puede ser trasladada al pagefile cuando el sistema requiere RAM física.
                </p>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between"><span>Rango Normal:</span> <span className="text-indigo-400">300 MB – 1.5 GB</span></div>
                  <div className="flex justify-between"><span>Comportamiento:</span> <span>Enviado a disco bajo presión</span></div>
                  <div className="flex justify-between"><span>Herramienta Diagnóstico:</span> <span className="text-slate-200">PoolMon / RAMMap</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Page Lists */}
        {activeMemoryTab === 'LISTS' && (
          <div className="mt-6 space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-blue-900/40">
                <span className="text-blue-400 font-mono font-bold block mb-1">08.14 — STANDBY LIST</span>
                <h5 className="font-semibold text-slate-200 text-sm mb-1">Caché de Lectura</h5>
                <p className="text-slate-400">Páginas no modificadas mantenidas en RAM. Si otra app pide RAM, se liberan en nanosegundos sin escribir a disco.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-amber-900/40">
                <span className="text-amber-400 font-mono font-bold block mb-1">08.15 — MODIFIED LIST</span>
                <h5 className="font-semibold text-slate-200 text-sm mb-1">Cola de Escritura</h5>
                <p className="text-slate-400">Páginas alteradas en memoria que aguardan ser escritas al pagefile.sys por el hilo de sistema antes de liberarse.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-900/40">
                <span className="text-emerald-400 font-mono font-bold block mb-1">08.16 — FREE LIST</span>
                <h5 className="font-semibold text-slate-200 text-sm mb-1">Páginas Limpias</h5>
                <p className="text-slate-400">Páginas de memoria RAM vacías o con ceros listas para ser asignadas a nuevos procesos de forma inmediata.</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/40">
                <span className="text-purple-400 font-mono font-bold block mb-1">08.13 — COMPRESSION</span>
                <h5 className="font-semibold text-slate-200 text-sm mb-1">Store Comprimido</h5>
                <p className="text-slate-400">Algoritmo XPRESS de Windows que comprime páginas inactivas en RAM con la CPU antes de tocar el almacenamiento SSD/HDD.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
