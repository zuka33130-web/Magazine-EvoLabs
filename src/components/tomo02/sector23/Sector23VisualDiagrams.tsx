import React, { useState } from 'react';
import {
  Clock,
  Shield,
  HardDrive,
  Globe,
  Terminal,
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';

export const Sector23VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'AUTOMATIC_MAINTENANCE_ORCHESTRATOR' | 'DEFENDER_IDLE_SWEEP' | 'SSD_TRIM_GARBAGE_COLLECTION' | 'NCSI_ACTIVE_PROBING_FLOW'
  >('AUTOMATIC_MAINTENANCE_ORCHESTRATOR');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Clock className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 23</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              LO QUE WINDOWS HACE CUANDO NO ESTÁS MIRANDO
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Mantenimiento Automático, Escaneos de Defender en Idle, Comando TRIM en SSDs y Sondeos NCSI
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('AUTOMATIC_MAINTENANCE_ORCHESTRATOR')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'AUTOMATIC_MAINTENANCE_ORCHESTRATOR'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>1. Mantenimiento Idle</span>
            </button>
            <button
              onClick={() => setActiveDiagram('DEFENDER_IDLE_SWEEP')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'DEFENDER_IDLE_SWEEP'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>2. Defender Idle</span>
            </button>
            <button
              onClick={() => setActiveDiagram('SSD_TRIM_GARBAGE_COLLECTION')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'SSD_TRIM_GARBAGE_COLLECTION'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>3. TRIM & SSD</span>
            </button>
            <button
              onClick={() => setActiveDiagram('NCSI_ACTIVE_PROBING_FLOW')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'NCSI_ACTIVE_PROBING_FLOW'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>4. Sondeos NCSI</span>
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: AUTOMATIC MAINTENANCE */}
        {activeDiagram === 'AUTOMATIC_MAINTENANCE_ORCHESTRATOR' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Concepto Clave: </span>
              El Mantenimiento Automático de Windows evalúa temporizadores de inactividad de usuario (Idle Timeout) para iniciar un bloque consolidado de tareas sin interrumpir el flujo interactivo.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>1. IDLE DETECTED</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Sin eventos de mouse/teclado por 10 min o reloj programado (02:00 AM).
                </p>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300">
                  Trigger: On Idle State
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>2. TASK SCHEDULER</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Invocación maestra de ProcessIdleTasks y orquestador de mantenimiento.
                </p>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300">
                  advapi32.dll!ProcessIdleTasks
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>3. SUBSYSTEM SWEEP</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Defender, Indexación, TRIM, Paging Flush y parches de Windows Update.
                </p>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300">
                  MsMpEng + SearchIndexer
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>4. USER RETURNS</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Detección de input: pausa inmediata o degradación de prioridad de CPU.
                </p>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300">
                  StopOnIdleEnd = True
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 2: DEFENDER IDLE SWEEP */}
        {activeDiagram === 'DEFENDER_IDLE_SWEEP' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Análisis Táctico: </span>
              MsMpEng.exe monitorea constantemente los contadores de CPU y entrada de usuario. Al detectar reposo, activa el escaneo rápido de firmas de malware asignando cuotas de CPU controladas.
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold">Estado del Usuario</span>
                <span className="text-slate-400">Acción de Defender</span>
                <span className="text-slate-400">Consumo de CPU</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400">Interacción Activa (Gaming/Edición)</span>
                <span>Análisis en idle Pausado / Solo Real-Time Shield</span>
                <span className="text-slate-400">&lt; 1-3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400">Inactividad Detectada (10+ min)</span>
                <span>Ejecución de MpCmdRun -Scan -ScanType 1</span>
                <span className="text-cyan-400">25-50% (ScanAvgCPULoadFactor)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400">Movimiento de Mouse Detectado</span>
                <span>Detención Inmediata de Escaneo Programado</span>
                <span className="text-slate-400">Retorno Instantáneo a 0%</span>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: SSD TRIM */}
        {activeDiagram === 'SSD_TRIM_GARBAGE_COLLECTION' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Arquitectura de Almacenamiento: </span>
              A diferencia de la desfragmentación tradicional de platillos magnéticos, TRIM envía comandos ATA/NVMe para invalidar bloques de memoria NAND eliminados por el sistema de archivos NTFS/ReFS.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold">1. Eliminación NTFS</div>
                <p className="text-slate-400">
                  El usuario borra un archivo. NTFS marca las entradas en la MFT pero no borra físicamente la celda NAND.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold">2. Comando TRIM</div>
                <p className="text-slate-400">
                  En idle, Optimize-Volume / defrag.exe envía la orden TRIM a la controladora AHCI/NVMe.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold">3. Garbage Collection</div>
                <p className="text-slate-400">
                  La controladora del SSD limpia las celdas invalidadas dejándolas listas para escrituras inmediatas a máxima velocidad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: NCSI ACTIVE PROBING */}
        {activeDiagram === 'NCSI_ACTIVE_PROBING_FLOW' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Flujo de Red: </span>
              Network Location Awareness (NLA) invoca sondeos periódicos en segundo plano hacia endpoints de prueba para actualizar la bandera de conectividad del sistema.
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-cyan-300">Prueba de Sondeo HTTP NCSI:</span>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-400">
                GET http://www.msftconnecttest.com/connecttest.txt<br />
                Respuesta esperada: "Microsoft Connect Test" (200 OK)<br />
                Si respuesta == OK -&gt; Estado Visual: Red Conectada (Internet Access)<br />
                Si bloqueado/timeout -&gt; Estado Visual: Signo de Exclamación / Sin Internet
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
