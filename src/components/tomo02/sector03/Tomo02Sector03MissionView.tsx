import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface Tomo02Sector03MissionViewProps {
  onBack: () => void;
  onMissionComplete: () => void;
}

export const Tomo02Sector03MissionView: React.FC<Tomo02Sector03MissionViewProps> = ({
  onBack,
  onMissionComplete,
}) => {
  const [selectedConsoleMap, setSelectedConsoleMap] = useState<Record<string, string>>({});
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSaved] = useState(false);

  const scenarios = [
    {
      id: 'sc1',
      title: 'PC lenta e inaccesible',
      description: 'El sistema responde con extrema lentitud y las ventanas no abren.',
      correctConsole: 'taskmgr.exe',
      consoleName: 'Task Manager (taskmgr.exe)',
      options: ['taskmgr.exe', 'diskmgmt.msc', 'optionalfeatures.exe'],
      correctJustification: 'Permite inspeccionar consumo de CPU, RAM y finalizar el proceso descontrolado con Ctrl+Shift+Esc.',
    },
    {
      id: 'sc2',
      title: 'Driver con error (Triángulo amarillo)',
      description: 'La placa Wi-Fi no funciona y aparece con un signo de exclamación.',
      correctConsole: 'devmgmt.msc',
      consoleName: 'Device Manager (devmgmt.msc)',
      options: ['devmgmt.msc', 'ncpa.cpl', 'regedit.exe'],
      correctJustification: 'Inspecciona el código de error PnP y el Hardware ID del dispositivo.',
    },
    {
      id: 'sc3',
      title: 'Servicio detenido',
      description: 'La cola de impresión no recibe documentos y se detiene en segundo plano.',
      correctConsole: 'services.msc',
      consoleName: 'Services (services.msc)',
      options: ['services.msc', 'eventvwr.msc', 'msconfig.exe'],
      correctJustification: 'Muestra el estado, dependencias y permite reiniciar el servicio Spooler.',
    },
    {
      id: 'sc4',
      title: 'Aplicación se cierra de forma repentina',
      description: 'Un programa de diseño se cierra solo sin mostrar ningún mensaje de error.',
      correctConsole: 'eventvwr.msc',
      consoleName: 'Event Viewer / Reliability Monitor',
      options: ['eventvwr.msc', 'taskschd.msc', 'powercfg.cpl'],
      correctJustification: 'Registra el Event ID 1000/1001 del colapso y el módulo `.dll` defectuoso.',
    },
    {
      id: 'sc5',
      title: 'Disco lleno y ocupación misteriosa',
      description: 'El disco C: indica 0 MB libres pero no se ven carpetas grandes.',
      correctConsole: 'resmon.exe',
      consoleName: 'Resource Monitor / Disk Management',
      options: ['resmon.exe', 'devmgmt.msc', 'sysdm.cpl'],
      correctJustification: 'Inspecciona I/O de disco archivo por archivo y el tamaño de la sombra de instantáneas.',
    },
    {
      id: 'sc6',
      title: 'Problema de red (sitios no cargan)',
      description: 'Las IPs responden a Ping pero los nombres de dominio no abren en el navegador.',
      correctConsole: 'ncpa.cpl',
      consoleName: 'Network Connections (ncpa.cpl)',
      options: ['ncpa.cpl', 'windowssecurity:', 'optionalfeatures.exe'],
      correctJustification: 'Permite revisar y cambiar las direcciones de servidores DNS en IPv4.',
    },
    {
      id: 'sc7',
      title: 'Error grave después de una actualización',
      description: 'El sistema funciona inestable tras la instalación automática de parches del martes.',
      correctConsole: 'perfmon /rel',
      consoleName: 'Reliability Monitor / System Restore',
      options: ['perfmon /rel', 'regedit.exe', 'msinfo32.exe'],
      correctJustification: 'Permite correlacionar la fecha del update con las caídas y ejecutar un punto de restauración.',
    },
  ];

  const handleSelectConsole = (scenarioId: string, consoleCmd: string) => {
    setSelectedConsoleMap((prev) => ({ ...prev, [scenarioId]: consoleCmd }));
  };

  const handleJustificationChange = (scenarioId: string, text: string) => {
    setJustifications((prev) => ({ ...prev, [scenarioId]: text }));
  };

  const correctCount = scenarios.filter((s) => selectedConsoleMap[s.id] === s.correctConsole).length;
  const isAllAnswered = Object.keys(selectedConsoleMap).length === scenarios.length;

  const handleSave = () => {
    setIsSaved(true);
    onMissionComplete();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#60CDFF] font-bold">LABORATORIO CANÓNICO</span>
              <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                LAB: WINDOWS CONTROL ROOM // DIAGNÓSTICO DE ESCENARIOS
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold border border-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            VOLVER AL TEMARIO
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          Analizá cada escenario técnico de falla real. Para cada uno, seleccioná QUÉ CONSOLA ABRIR PRIMERO y justificá brevemente tu elección técnica.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4 font-mono text-xs">
        {scenarios.map((sc, idx) => {
          const selected = selectedConsoleMap[sc.id];
          const isCorrect = selected === sc.correctConsole;

          return (
            <div
              key={sc.id}
              className="p-5 rounded-2xl bg-[#080B10] border border-sky-500/20 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[#60CDFF] font-bold">
                  ESCENARIO {idx + 1}: {sc.title.toUpperCase()}
                </span>
                {selected && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {isCorrect ? 'SELECCIÓN CORRECTA' : 'CONSOLA NO OPTIMA'}
                  </span>
                )}
              </div>

              <p className="text-zinc-200 font-sans text-xs">{sc.description}</p>

              {/* Console Selection Buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-bold block">
                  ¿QUÉ CONSOLA ABRIR PRIMERO?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sc.options.map((optCmd) => {
                    const isOptSelected = selected === optCmd;
                    return (
                      <button
                        key={optCmd}
                        type="button"
                        onClick={() => handleSelectConsole(sc.id, optCmd)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isOptSelected
                            ? optCmd === sc.correctConsole
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                              : 'bg-red-950/60 border-red-500 text-red-200 font-bold'
                            : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/30'
                        }`}
                      >
                        {optCmd}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Justification Note */}
              {selected && (
                <div className="p-3 rounded-xl bg-[#05070A] border border-sky-500/20 font-sans text-xs space-y-1">
                  <span className="font-mono text-[#60CDFF] text-[10px] font-bold block">
                    JUSTIFICACIÓN TÉCNICA CANÓNICA:
                  </span>
                  <p className="text-zinc-300 text-xs">{sc.correctJustification}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lab Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs">
        <span className="text-zinc-400">
          Aciertos: <span className="text-[#60CDFF] font-bold">{correctCount}</span> / {scenarios.length}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isAllAnswered}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isAllAnswered
              ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>{isSubmitted ? 'LABORATORIO REGISTRADO' : 'REGISTRAR LAB EN EXPEDIENTE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
