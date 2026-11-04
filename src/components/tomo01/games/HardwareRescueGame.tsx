import React, { useState } from 'react';
import { Wrench, Gauge, Activity, Flame, ShieldAlert, CheckCircle2, RefreshCw, ArrowRight, Stethoscope } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface DiagnosticCase {
  id: number;
  caseCode: string;
  symptom: string;
  patientSpecs: string;
  realFault: string;
  measurements: {
    multimeter12V: string;
    multimeter5V: string;
    multimeter3V3: string;
    powerGoodSignal: string;
    postHexCode: string;
    postMeaning: string;
    cpuTempCelsius: number;
    vrmTempCelsius: number;
  };
  options: {
    hypothesis: string;
    action: string;
    isCorrect: boolean;
    technicalJustification: string;
  }[];
}

const CASES: DiagnosticCase[] = [
  {
    id: 1,
    caseCode: 'CASO-EVO-01',
    symptom: 'La PC enciende los ventiladores por medio segundo, la fuente hace un chasquido metálico (clic del relé) y se apaga de inmediato sin dar video.',
    patientSpecs: 'Core i7 13700K, Placa Z790, RTX 3080, Fuente 850W Gold.',
    realFault: 'Cortocircuito en el riel de +12V de alimentación EPS del procesador (VRM en corto)',
    measurements: {
      multimeter12V: '0.00 V (Cae a 0V por disparo de SCP/OCP)',
      multimeter5V: '5.08 V',
      multimeter3V3: '3.34 V',
      powerGoodSignal: '0.0 V (PWR_OK inactivo)',
      postHexCode: '00',
      postMeaning: 'Sin inicialización de microcódigo',
      cpuTempCelsius: 22,
      vrmTempCelsius: 23,
    },
    options: [
      {
        hypothesis: 'La memoria RAM está descolocada en el zócalo',
        action: 'Retirar y limpiar los contactos dorados con alcohol isopropílico',
        isCorrect: false,
        technicalJustification: 'Una RAM descolocada no provoca el apagado instantáneo de la fuente ni hace caer el riel de 12V a cero en milisegundos.',
      },
      {
        hypothesis: 'Cortocircuito franco en riel +12V EPS disparando protección SCP de la fuente',
        action: 'Desconectar el conector EPS de 8 pines de CPU y probar encendido en banco para aislar el VRM',
        isCorrect: true,
        technicalJustification: 'El clic del relé y la caída del riel de 12V demuestran que el circuito de protección contra cortocircuitos (SCP) de la fuente se está activando para proteger los componentes.',
      },
      {
        hypothesis: 'El cable HDMI del monitor está roto',
        action: 'Reemplazar el cable por uno DisplayPort nuevo',
        isCorrect: false,
        technicalJustification: 'El cable de video no tiene relación con el sistema de energía de la fuente ni apaga la máquina.',
      },
    ],
  },
  {
    id: 2,
    caseCode: 'CASO-EVO-02',
    symptom: 'La PC enciende todos los ventiladores y luces RGB al 100%, pero la pantalla queda en negro y la placa madre muestra el display LED trabado.',
    patientSpecs: 'Ryzen 7 7800X3D, Placa B650, 32GB DDR5 (2x16GB), Radeon RX 7800XT.',
    realFault: 'Fallo de entrenamiento de memoria (Memory Training) o contacto sucio en slot RAM',
    measurements: {
      multimeter12V: '12.12 V',
      multimeter5V: '5.01 V',
      multimeter3V3: '3.31 V',
      powerGoodSignal: '5.0 V (PWR_OK activo)',
      postHexCode: '55',
      postMeaning: 'Memory not installed / Memory initialization failed',
      cpuTempCelsius: 38,
      vrmTempCelsius: 41,
    },
    options: [
      {
        hypothesis: 'La placa de video está quemada',
        action: 'Comprar una GPU nueva para descartar',
        isCorrect: false,
        technicalJustification: 'El código POST 55 es universal en arquitectura UEFI para fallas en la detección o inicialización del bus de memoria RAM, no de GPU.',
      },
      {
        hypothesis: 'Fallo de inicialización de memoria RAM en canal principal (Código POST 55)',
        action: 'Probar con un solo módulo en el slot B2 secundario y ejecutar Clear CMOS para reiniciar el perfil EXPO',
        isCorrect: true,
        technicalJustification: 'El código POST 55 confirma que la CPU no logra comunicarse con el módulo SPD de las memorias RAM durante la etapa de POST.',
      },
      {
        hypothesis: 'El disco SSD NVMe se corrompió',
        action: 'Formatear e instalar Windows desde pendrive',
        isCorrect: false,
        technicalJustification: 'La placa madre se traba en el POST de hardware mucho antes de llegar a leer cualquier unidad de almacenamiento.',
      },
    ],
  },
  {
    id: 3,
    caseCode: 'CASO-EVO-03',
    symptom: 'La PC arranca perfecto, inicia Windows con normalidad, pero exactamente a los 40 segundos de iniciar un juego exigente se apaga de golpe.',
    patientSpecs: 'Core i5 12600K, Watercooler 240mm, RTX 3070, Fuente 750W.',
    realFault: 'TjMax Throttling térmico crítico: la bomba de agua del AIO no recibe alimentación o tiene film plástico sin retirar',
    measurements: {
      multimeter12V: '12.05 V',
      multimeter5V: '5.02 V',
      multimeter3V3: '3.32 V',
      powerGoodSignal: '5.0 V (PWR_OK activo)',
      postHexCode: 'AA',
      postMeaning: 'Sistema operativo cargado en Ring 0',
      cpuTempCelsius: 104,
      vrmTempCelsius: 52,
    },
    options: [
      {
        hypothesis: 'Infección por malware o virus minero en Windows',
        action: 'Ejecutar un antivirus forense en modo seguro',
        isCorrect: false,
        technicalJustification: 'Un virus puede subir el uso de CPU, pero el apagado forzado es una protección física de silicio cuando la CPU supera los 100°C (TjMax).',
      },
      {
        hypothesis: 'Disparo de protección térmica de silicio (TjMax > 100°C) por disipación nula',
        action: 'Inspeccionar la bomba AIO en el cabezal, verificar conexión AIO_PUMP y retirar el film protector transparente de la base de cobre',
        isCorrect: true,
        technicalJustification: 'La sonda térmica registró 104°C en el socket de la CPU mientras los VRMs están fríos (52°C), lo que evidencia ausencia total de transferencia térmica en el bloque del procesador.',
      },
      {
        hypothesis: 'La fuente de alimentación no soporta la placa de video',
        action: 'Cambiar la fuente por una de 1200W',
        isCorrect: false,
        technicalJustification: 'La telemetría eléctrica muestra 12.05V estables; el apagado proviene de la interrupción PROCHOT/THERMTRIP de la CPU.',
      },
    ],
  },
];

export const HardwareRescueGame: React.FC = () => {
  const [currentCaseIdx, setCurrentCaseIdx] = useState<number>(0);
  const [activeInstrument, setActiveInstrument] = useState<'MULTIMETER' | 'POST_CARD' | 'THERMAL_PROBE'>('MULTIMETER');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  const currentCase = CASES[currentCaseIdx];

  const handleSelectCase = (idx: number) => {
    setCurrentCaseIdx(idx);
    setSelectedOptionIdx(null);
    setActiveInstrument('MULTIMETER');
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                JUEGO TÉCNICO // LABORATORIO PERICIAL
              </span>
              <ProvenanceBadge provenance="MEDIDO" sourceOrFormula="Instrumental de Banco de Prueba" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              HARDWARE RESCUE: DIAGNÓSTICO DEDUCTIVO CON INSTRUMENTAL
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              "No lo creas. Comprobalo." Equipos reales con fallas complejas. Usá el multímetro, el lector POST y la cámara térmica para diagnosticar la causa raíz sin cambiar piezas al azar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {CASES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCase(idx)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                  currentCaseIdx === idx
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {c.caseCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Briefing & Patient Info */}
        <div className="space-y-5">
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-mono-tech text-xs uppercase font-bold text-emerald-400">
                ORDEN DE TRABAJO // {currentCase.caseCode}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                BANCO DE TALLER
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                Síntoma Reportado por el Cliente:
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans bg-black/40 p-3 rounded-lg border border-zinc-800/80">
                "{currentCase.symptom}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                Configuración del Hardware:
              </span>
              <p className="text-xs text-zinc-400 font-mono">
                {currentCase.patientSpecs}
              </p>
            </div>
          </div>

          {/* Instrument Selector */}
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-3">
            <span className="font-mono-tech text-xs uppercase font-bold text-zinc-300 block">
              HERRAMIENTAS DE MEDICIÓN
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveInstrument('MULTIMETER')}
                className={`w-full p-2.5 rounded-lg border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeInstrument === 'MULTIMETER'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 font-bold'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Gauge className="w-4 h-4 text-yellow-400" />
                <span>Multímetro Digital (Rieles ATX)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInstrument('POST_CARD')}
                className={`w-full p-2.5 rounded-lg border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeInstrument === 'POST_CARD'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Lector de Códigos POST (Debug LED)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInstrument('THERMAL_PROBE')}
                className={`w-full p-2.5 rounded-lg border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeInstrument === 'THERMAL_PROBE'
                    ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>Cámara Térmica Infrarroja</span>
              </button>
            </div>
          </div>
        </div>

        {/* Central Column: Instrument Readout Display */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
                  LECTURAS EN VIVO DEL INSTRUMENTAL
                </h3>
              </div>
              <ProvenanceBadge provenance="MEDIDO" sourceOrFormula="Sondas Físicas Calibradas" />
            </div>

            {/* Instrument View */}
            {activeInstrument === 'MULTIMETER' && (
              <div className="bg-black/60 border border-yellow-500/30 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-yellow-400 pb-2 border-b border-zinc-800">
                  <span>MULTÍMETRO DIGITAL TRUE-RMS</span>
                  <span>ESCALA: 20V DC</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 block">RIEL +12V</span>
                    <span className="text-xl font-mono font-bold text-white">{currentCase.measurements.multimeter12V}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 block">RIEL +5V</span>
                    <span className="text-xl font-mono font-bold text-white">{currentCase.measurements.multimeter5V}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 block">RIEL +3.3V</span>
                    <span className="text-xl font-mono font-bold text-white">{currentCase.measurements.multimeter3V3}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 block">POWER_GOOD (PG)</span>
                    <span className="text-xl font-mono font-bold text-cyan-400">{currentCase.measurements.powerGoodSignal}</span>
                  </div>
                </div>
              </div>
            )}

            {activeInstrument === 'POST_CARD' && (
              <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-cyan-400 pb-2 border-b border-zinc-800">
                  <span>ANALIZADOR POST / DEBUG LED DISPLAY</span>
                  <span>BUS LPC / SPI</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-zinc-950 border-2 border-red-600 rounded-xl flex items-center justify-center font-mono font-black text-4xl text-red-500 tracking-wider shadow-lg shadow-red-950/60 animate-pulse">
                    {currentCase.measurements.postHexCode}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Interpretación de Microcódigo UEFI:</span>
                    <p className="text-sm font-mono text-white">
                      {currentCase.measurements.postMeaning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeInstrument === 'THERMAL_PROBE' && (
              <div className="bg-black/60 border border-red-500/30 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-red-400 pb-2 border-b border-zinc-800">
                  <span>CÁMARA TERMOGRÁFICA FLIR</span>
                  <span>RANGO: -10°C A +150°C</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Temperatura Núcleo CPU (TjMax)</span>
                    <div className={`text-3xl font-mono font-black ${currentCase.measurements.cpuTempCelsius >= 95 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                      {currentCase.measurements.cpuTempCelsius}°C
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Temperatura Fases VRM Placa</span>
                    <div className="text-3xl font-mono font-black text-amber-400">
                      {currentCase.measurements.vrmTempCelsius}°C
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Decisions */}
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <span className="font-mono-tech text-xs uppercase font-bold text-zinc-200 block">
                DICTAMEN TÉCNICO // EMITÍ TU CONCLUSIÓN PERICIAL
              </span>

              <div className="space-y-2">
                {currentCase.options.map((option, idx) => {
                  const isSelected = selectedOptionIdx === idx;

                  let cardStyle = 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700';
                  if (isSelected) {
                    cardStyle = option.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100'
                      : 'bg-red-950/40 border-red-500 text-red-100';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOptionIdx(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer space-y-1.5 ${cardStyle}`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Hipótesis: {option.hypothesis}</span>
                        {isSelected && (
                          option.isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> DICTAMEN CORRECTO
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <ShieldAlert className="w-4 h-4" /> RECHAZADO POR EVIDENCIAS
                            </span>
                          )
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Acción Correctiva: {option.action}
                      </div>

                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-300 font-sans leading-relaxed">
                          <strong className="font-mono text-zinc-100 block mb-0.5">Demostración Pericial:</strong>
                          {option.technicalJustification}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
