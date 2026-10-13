import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Zap,
  GitCommit,
  Database,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Sector07VisualDiagramsProps {
  code: string;
}

export const Sector07VisualDiagrams: React.FC<Sector07VisualDiagramsProps> = ({ code }) => {
  const [cacheFlowMode, setCacheFlowMode] = useState<'first' | 'cached'>('first');
  const [decisionStep, setSelectedDecisionStep] = useState<string>('symptom');

  // 07.01 TIMELINE SUPERFETCH -> SYSMAIN
  if (code === '07.01') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 07.01 // LÍNEA DE TIEMPO EVOLUTIVA: SUPERFETCH A SYSMAIN
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            RENOMBRADO OFICIAL WINDOWS 10
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#0E131D] border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px]">2006 (WINDOWS VISTA / 7)</span>
            <div className="text-white font-bold text-sm">SuperFetch</div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Algoritmo inicial de precarga para reducir la latencia de discos mecánicos HDD.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E131D] border border-sky-500/30 space-y-1">
            <span className="text-[#60CDFF] text-[10px]">OCTUBRE 2018 (WIN 10 1809)</span>
            <div className="text-[#60CDFF] font-bold text-sm">Renombrado a SysMain</div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Cambio de nombre de pantalla e integración con compresión de memoria RAM.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E131D] border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 text-[10px]">ACTUALIDAD (WINDOWS 10/11)</span>
            <div className="text-emerald-300 font-bold text-sm">SysMain (svchost)</div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Servicio unificado optimizado para SSDs NVMe y gestión de caché Standby.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 07.04 RAM LIBRE VS CACHÉ
  if (code === '07.04') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 07.04 // MAPA DE ESTADOS DE MEMORIA RAM
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            MEMORIA DISPONIBLE REAL
          </span>
        </div>

        {/* Visual Memory Bar */}
        <div className="space-y-2 font-mono text-xs">
          <div className="text-zinc-300 text-[11px] flex justify-between">
            <span>RAM TOTAL INSTALADA: 16 GB</span>
            <span className="text-[#60CDFF] font-bold">DISPONIBLE: 10 GB (Libre + Standby)</span>
          </div>

          <div className="h-7 w-full rounded-xl bg-black overflow-hidden flex p-0.5 gap-0.5 border border-zinc-800">
            <div className="bg-[#0078D4] h-full rounded-l-lg flex items-center justify-center text-[10px] font-bold text-white px-2" style={{ width: '37.5%' }}>
              EN USO (6 GB)
            </div>
            <div className="bg-emerald-500/40 border border-emerald-500/60 h-full flex items-center justify-center text-[10px] font-bold text-emerald-200 px-2" style={{ width: '56.25%' }}>
              STANDBY / EN CACHÉ (9 GB) [DISPONIBLE]
            </div>
            <div className="bg-zinc-700 h-full rounded-r-lg flex items-center justify-center text-[10px] font-bold text-zinc-300 px-1" style={{ width: '6.25%' }}>
              LIBRE (1 GB)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-center">
            <div className="p-2 rounded bg-[#0078D4]/20 border border-[#00A4EF]/30 text-white">
              <strong>EN USO:</strong> RAM física asignada a procesos activos.
            </div>
            <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
              <strong>STANDBY:</strong> Datos precacheados. Reclamable en 0 ms.
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              <strong>LIBRE:</strong> RAM completamente vacía en ceros.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 07.05 / 07.06 HDD VS SSD NVME
  if (code === '07.05' || code === '07.06') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 07.05 // LATENCIA Y RENDIMIENTO: HDD VS SSD NVME
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#0E131D] border border-amber-500/30 space-y-2">
            <div className="text-amber-400 font-bold flex items-center justify-between">
              <span>DISCO MECÁNICO (HDD)</span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">LATENCIA ALTA</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300 font-sans">
              <p>• <strong>Latencia aleatoria:</strong> 10.000 a 15.000 µs (15 ms)</p>
              <p>• <strong>IOPS aleatorias:</strong> ~100 a 200 IOPS</p>
              <p>• <strong>Efecto SysMain:</strong> Reagrupa lecturas para evitar saltos del cabezal mecánico.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E131D] border border-emerald-500/30 space-y-2">
            <div className="text-emerald-400 font-bold flex items-center justify-between">
              <span>SSD NVME PCIE 4.0</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">ULTRA BAJA LATENCIA</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300 font-sans">
              <p>• <strong>Latencia aleatoria:</strong> ~30 a 50 µs (0.05 ms)</p>
              <p>• <strong>IOPS aleatorias:</strong> +500.000 IOPS</p>
              <p>• <strong>Efecto SysMain:</strong> Operación transparente con &lt; 0.1% uso de disco.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 07.09 DECISION TREE
  if (code === '07.09') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              ÁRBOL DE DECISIÓN PERICIAL EVO LABS FOR SYSMAIN
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedDecisionStep('symptom')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${decisionStep === 'symptom' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            <div className="text-[9px] text-[#60CDFF]">PASO 1</div>
            <div>¿Existe síntoma reproducible?</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecisionStep('evidence')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${decisionStep === 'evidence' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            <div className="text-[9px] text-[#60CDFF]">PASO 2</div>
            <div>¿Hay evidencia en resmon?</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecisionStep('baseline')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${decisionStep === 'baseline' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            <div className="text-[9px] text-[#60CDFF]">PASO 3</div>
            <div>Registrar Baseline &amp; Prueba A/B</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecisionStep('rollback')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${decisionStep === 'rollback' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            <div className="text-[9px] text-emerald-400">PASO 4</div>
            <div>Medir Delta &amp; Revertir</div>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D121C] border border-sky-500/20 text-xs font-mono text-zinc-300 leading-relaxed">
          {decisionStep === 'symptom' && (
            <p><strong>SI NO HAY SÍNTOMA REPRODUCIBLE:</strong> REGLA ABSOLUTA EVO -&gt; NO TOCAR SYSMAIN. Mantener el servicio en su estado predeterminado Automático.</p>
          )}
          {decisionStep === 'evidence' && (
            <p><strong>EVIDENCIA EN RESMON.EXE:</strong> Abre `resmon.exe` -&gt; Pestaña Disco. Confirma si el proceso `svchost.exe (SysMain)` registra colas de espera persistentes por más de 5 minutos.</p>
          )}
          {decisionStep === 'baseline' && (
            <p><strong>PRUEBA CONTROLADA A/B:</strong> Mide tiempo exacto de apertura de app en estado A -&gt; Deshabilita SysMain -&gt; Mide tiempo exacto en estado B.</p>
          )}
          {decisionStep === 'rollback' && (
            <p><strong>DECISIÓN PERICIAL BASADA EN DATA:</strong> Si el Delta demuestra mejora real de tiempo, conserva el ajuste. Si es igual o peor, aplica el protocolo de Reversión (Rollback) a Automático de inmediato.</p>
          )}
        </div>
      </div>
    );
  }

  // CENTRAL VISUAL: WINDOWS MEMORY + STORAGE CACHE FLOW
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 font-sans space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#60CDFF]" />
            <h4 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              VISUAL CENTRAL // WINDOWS MEMORY + STORAGE CACHE FLOW
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400">
            Comparación de la ruta de datos entre la Primera Apertura (Lectura de Disco) vs Aperturas Posteriores (Cache Hit en RAM)
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D121C] border border-zinc-800 font-mono text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCacheFlowMode('first')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${cacheFlowMode === 'first' ? 'bg-[#0078D4] text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            1ª APERTURA (DISCO)
          </button>
          <button
            type="button"
            onClick={() => setCacheFlowMode('cached')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${cacheFlowMode === 'cached' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            APERTURA POSTERIOR (RAM CACHÉ)
          </button>
        </div>
      </div>

      {/* Interactive Cache Flow Diagram */}
      <div className="p-4 rounded-xl bg-[#0C1017] border border-zinc-800 font-mono text-xs space-y-4">
        {cacheFlowMode === 'first' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>RUTA DE PRIMERA APERTURA (SIN CACHÉ PREVIA):</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                APLICACIÓN INICIA
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200 font-bold">
                LECTURA LENTA DE DISCO (SATA/NVMe)
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="p-2.5 rounded bg-[#0078D4]/30 border border-[#00A4EF]/40 text-[#60CDFF] font-bold">
                CARGA A MEMORIA RAM
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-bold">
                APLICACIÓN LISTA (~2.8s)
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans italic text-center pt-1">
              El procesador debe esperar las operaciones de E/S del almacenamiento antes de poder renderizar la interfaz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>RUTA DE APERTURA POSTERIOR (CACHE HIT EN RAM):</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                APLICACIÓN INICIA
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold">
                CACHE HIT EN RAM (STANDBY / PRECARGA)
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold">
                APLICACIÓN LISTA INSTANTÁNEA (~0.3s)
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans italic text-center pt-1">
              SysMain / Standby suministró las páginas de código directamente desde la RAM ultrarrápida, omitiendo la latencia de disco.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
