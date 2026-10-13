import React, { useState } from 'react';
import {
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Server,
  Play,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  Info,
} from 'lucide-react';

interface Tomo02Sector06MissionViewProps {
  onBack: () => void;
}

interface Scenario {
  id: string;
  title: string;
  actionText: string;
  targetService: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequence: string;
  }[];
}

const LAB_SCENARIOS: Scenario[] = [
  {
    id: 'sc-dhcp',
    title: 'ESCENARIO 01 // DESHABILITAR CLIENTE DHCP',
    targetService: 'Dhcp (Cliente DHCP)',
    actionText: 'Cambiar el tipo de inicio de "Dhcp" a Deshabilitado y detener el servicio.',
    question: '¿Qué ocurrirá en el sistema si ejecutas esta acción virtual?',
    options: [
      {
        id: 'opt_dhcp_1',
        text: 'El equipo perderá inmediatamente la capacidad de obtener IP dinámica y se desconectará de la red local/Internet.',
        isCorrect: true,
        consequence: 'CORRECTO: Dhcp es un servicio de infraestructura core. Sin él, el adaptador de red no puede solicitar concesión de IP al router.',
      },
      {
        id: 'opt_dhcp_2',
        text: 'Aumentará la velocidad de descarga en un 20%.',
        isCorrect: false,
        consequence: 'INCORRECTO: Deshabilitar DHCP no acelera la red, la destruye.',
      },
    ],
  },
  {
    id: 'sc-spooler',
    title: 'ESCENARIO 02 // DETENER PRINT SPOOLER',
    targetService: 'Spooler (Cola de impresión)',
    actionText: 'Detener el servicio "Spooler" en un equipo sin impresoras físicas conectadas.',
    question: '¿Qué funcionalidad específica quedará inhabilitada?',
    options: [
      {
        id: 'opt_spool_1',
        text: 'No se podrá imprimir en impresoras físicas ni generar documentos PDF mediante la impresora virtual "Microsoft Print to PDF".',
        isCorrect: true,
        consequence: 'CORRECTO: Spooler gestiona tanto impresoras físicas como la cola de renderizado de la impresora PDF virtual.',
      },
      {
        id: 'opt_spool_2',
        text: 'Se apagarán los altavoces de la computadora.',
        isCorrect: false,
        consequence: 'INCORRECTO: El audio depende de AudioSrv, no de Spooler.',
      },
    ],
  },
  {
    id: 'sc-orphan',
    title: 'ESCENARIO 03 // SERVICIO OEM HUÉRFANO',
    targetService: 'OldVendorService (Ruta no encontrada en C:\\Program Files\\OldVendor)',
    actionText: 'Ejecutar la eliminación de la entrada de registro del servicio huérfano con "sc delete OldVendorService".',
    question: '¿Qué precaución pericial debes verificar antes de ejecutar la eliminación?',
    options: [
      {
        id: 'opt_orph_1',
        text: 'Verificar que la ruta del ejecutable no exista en el disco y que ningún otro servicio activo dependa de él.',
        isCorrect: true,
        consequence: 'CORRECTO: "sc delete" es irreversible. Siempre se audita la ruta física y las dependencias previamente.',
      },
      {
        id: 'opt_orph_2',
        text: 'Formatear la computadora de inmediato.',
        isCorrect: false,
        consequence: 'INCORRECTO: No se requiere formatear para limpiar un residuo de servicio.',
      },
    ],
  },
  {
    id: 'sc-search',
    title: 'ESCENARIO 04 // WINDOWS SEARCH ACTIVO EN SSD',
    targetService: 'WSearch (Windows Search)',
    actionText: 'Mantener WSearch en estado "En ejecución" (Automático) en un equipo con SSD NVMe.',
    question: '¿Cuál es el impacto real en el rendimiento de un SSD moderno?',
    options: [
      {
        id: 'opt_srch_1',
        text: 'Impacto insignificante en CPU y SSD, manteniendo búsquedas instantáneas en el menú inicio y explorador.',
        isCorrect: true,
        consequence: 'CORRECTO: En SSDs NVMe de alta velocidad, la indexación en reposo consume recursos mínimos y preserva las búsquedas rápidas.',
      },
      {
        id: 'opt_srch_2',
        text: 'Provoca un 100% de uso de disco permanente que congela los juegos.',
        isCorrect: false,
        consequence: 'INCORRECTO: Eso solo ocurría en discos mecánicos HDD antiguos muy fragmentados.',
      },
    ],
  },
  {
    id: 'sc-bits',
    title: 'ESCENARIO 05 // BITS DETENIDO (MANUAL)',
    targetService: 'bits (Background Intelligent Transfer Service)',
    actionText: 'Observar el servicio BITS en estado "Detenido" y "Manual".',
    question: '¿Es síntoma de un fallo o es el comportamiento normal?',
    options: [
      {
        id: 'opt_bits_1',
        text: 'Comportamiento normal (Trigger Start): BITS permanece detenido en 0 MB de RAM y se inicia solo cuando hay descargas de actualización pendientes.',
        isCorrect: true,
        consequence: 'CORRECTO: BITS es un servicio a demanda. Permanecer detenido cuando no hay transferencias en background es el diseño esperado.',
      },
      {
        id: 'opt_bits_2',
        text: 'Es una falla grave del sistema que requiere reinstalar Windows.',
        isCorrect: false,
        consequence: 'INCORRECTO: Un servicio en Manual detenido no es una falla.',
      },
    ],
  },
];

export const Tomo02Sector06MissionView: React.FC<Tomo02Sector06MissionViewProps> = ({ onBack }) => {
  const [activeScenarioIdx, setActiveScenarioIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [scId: string]: string }>({});
  const [showConsequences, setShowConsequences] = useState<{ [scId: string]: boolean }>({});

  const currentScenario = LAB_SCENARIOS[activeScenarioIdx];
  const selectedOptId = selectedAnswers[currentScenario.id];
  const isRevealed = showConsequences[currentScenario.id];

  const handleSelectOption = (optId: string) => {
    if (isRevealed) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentScenario.id]: optId }));
  };

  const handleApplyVirtualAction = () => {
    if (!selectedOptId) return;
    setShowConsequences((prev) => ({ ...prev, [currentScenario.id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#60CDFF] tracking-wider uppercase block">
              LABORATORIO CANÓNICO // SECTOR 06
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              SERVICE DEPENDENCY MAP (SIMULADOR DE DEPENDENCIAS)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Predicción pericial de impacto operacional antes de aplicar cambios virtuales en la consola services.msc.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-zinc-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            VOLVER AL SECTOR
          </button>
        </div>

        {/* Scenario Tabs */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0D121C] border border-zinc-800 overflow-x-auto font-mono text-xs">
          {LAB_SCENARIOS.map((sc, idx) => {
            const isActive = idx === activeScenarioIdx;
            const isDone = !!showConsequences[sc.id];

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${isActive ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]' : isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
              >
                <span>ESCENARIO 0{idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Active Scenario Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-5 text-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-[#60CDFF] tracking-wider uppercase">
                {currentScenario.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                SIMULACIÓN VIRTUAL SEGURA
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D131F] border border-sky-500/20 space-y-1 font-mono">
              <span className="text-zinc-400 text-[10px] block">SERVICIO OBJETIVO: {currentScenario.targetService}</span>
              <span className="text-white font-bold text-xs">ACCIÓN SOLICITADA: {currentScenario.actionText}</span>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-[#60CDFF]" />
              <span>{currentScenario.question}</span>
            </div>

            <div className="space-y-2">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptId === opt.id;
                let style = 'bg-[#0E131D] border-zinc-800 text-zinc-300 hover:border-sky-500/40 hover:bg-[#121824]';

                if (isRevealed) {
                  if (opt.isCorrect) {
                    style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    style = 'bg-red-950/40 border-red-500 text-red-200';
                  }
                } else if (isSelected) {
                  style = 'bg-[#0078D4]/20 border-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.2)]';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${style}`}
                  >
                    <div className="mt-0.5">
                      {isRevealed && opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isRevealed && isSelected && !opt.isCorrect ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#00A4EF] bg-[#00A4EF]' : 'border-zinc-600'}`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="leading-snug text-xs">{opt.text}</p>
                      {isRevealed && (
                        <p
                          className={`text-[11px] mt-1 font-mono ${opt.isCorrect ? 'text-emerald-400' : 'text-zinc-400'}`}
                        >
                          {opt.consequence}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {!isRevealed && (
            <button
              type="button"
              disabled={!selectedOptId}
              onClick={handleApplyVirtualAction}
              className={`w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${selectedOptId ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)] hover:brightness-110' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
            >
              <span>EJECUTAR SIMULACIÓN VIRTUAL Y VERIFICAR CONSECUENCIA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {isRevealed && (
            <div className="p-4 rounded-xl bg-[#090D14] border border-emerald-500/40 space-y-2 font-mono text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>EVALUACIÓN DE IMPACTO COMPLETADA</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed font-sans">
                Has demostrado la capacidad de predecir las consecuencias operacionales de modificar un servicio antes de tocar un sistema real.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
