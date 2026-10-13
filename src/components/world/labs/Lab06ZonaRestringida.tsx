import React, { useState } from 'react';
import { Lock, ShieldAlert, Award, Search, CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface MysteryCase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  difficulty: 'NIVEL 2' | 'NIVEL 3' | 'NIVEL MASTER';
  symptoms: string[];
  telemetryClue: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const MYSTERY_CASES: MysteryCase[] = [
  {
    id: 'case-01',
    number: 'EXPEDIENTE FORENSE #01',
    title: 'Fuga Térmica en VRM por Frecuencia PWM Excesiva',
    subtitle: 'La placa madre sufre apagados súbitos bajo carga sostenida a pesar de que el encapsulado del CPU reporta temperaturas nominales.',
    difficulty: 'NIVEL 2',
    symptoms: [
      'El CPU reporta 68°C constantes bajo disipador líquido AIO de 360mm.',
      'La BIOS fue configurada con frecuencia de conmutación VRM PWM forzada al máximo (600 kHz vs 300 kHz estándar).',
      'No hay evento WHEA ni volcado en minidump; el registro de Windows solo muestra el Evento 41 (Kernel-Power corte abrupto).',
      'El gabinete carece de flujo de aire directo hacia los disipadores pasivos de las etapas de potencia (MOSFETs/DrMOS).'
    ],
    telemetryClue: 'Termografía FLIR e instrumental pericial: Las pérdidas por conmutación en los MOSFETs aumentan linealmente con la frecuencia PWM. A 600 kHz, los MOSFETs alcanzan 122°C por fuga térmica y disparan el corte de protección OTP (Over-Temperature Protection) del controlador digital PWM.',
    options: [
      {
        id: 'opt-a',
        text: 'La fuente de alimentación está defectuosa y tiene rizado excesivo en el riel de 12V.',
        isCorrect: false,
        explanation: 'Falso. Las mediciones con osciloscopio en el riel de 12V muestran menos de 25 mV de ripple. La falla es puramente térmica en la etapa de entrega de potencia de la placa madre.'
      },
      {
        id: 'opt-b',
        text: 'Fuga térmica y colapso de eficiencia en MOSFETs por frecuencia PWM desmedida: revertir a 300-350 kHz y restablecer flujo de aire sobre las fases.',
        isCorrect: true,
        explanation: '¡CORRECTO! Doblar la frecuencia de conmutación PWM (de 300 kHz a 600 kHz) duplica las pérdidas de energía por ciclo de conmutación en el silicio de los MOSFETs. Sin disipación activa ni flujo de aire directo, se produce un bucle de fuga térmica (thermal runaway) que activa el corte por sobrecalentamiento OTP.'
      },
      {
        id: 'opt-c',
        text: 'El perfil XMP de la memoria RAM genera inestabilidad de voltaje en el bus VDDQ.',
        isCorrect: false,
        explanation: 'Falso. La inestabilidad de memoria genera pantallazos azules típicos (Memory Management / Page Fault) y errores de verificación en TestMem5, nunca un apagado eléctrico instantáneo sin BSOD.'
      }
    ]
  },
  {
    id: 'case-02',
    number: 'EXPEDIENTE FORENSE #02',
    title: 'Saturación de Cola ISR/DPC al Operar Ratones a 8000 Hz',
    subtitle: 'El juego corre a 300 FPS constantes, pero al mover el mouse rápidamente aparecen tirones críticos y el Núcleo 0 se asfixia.',
    difficulty: 'NIVEL 3',
    symptoms: [
      'Frametime en RivaTuner muestra línea recta a 3.33 ms mientras el personaje se mueve exclusivamente con el teclado.',
      'Al rotar la cámara a alta velocidad con el ratón de 8000 Hz, aparecen picos de frametime que saltan a 28 ms.',
      'El CPU evaluado tiene una arquitectura con frecuencia mononúcleo moderada (baja IPC en un solo hilo).',
      'LatencyMon registra un pico extremo de tiempo acumulado en el controlador del bus USB (usbport.sys / usbxhci.sys).'
    ],
    telemetryClue: '8000 Hz de tasa de sondeo significa 8000 interrupciones por segundo (1 cada 125 microsegundos). Cada evento dispara una rutina de interrupción de hardware (ISR) que se encola inmediatamente en una rutina de servicio diferido (DPC) en el hilo principal del scheduler de Windows.',
    options: [
      {
        id: 'opt-a',
        text: 'El sensor óptico del ratón tiene suciedad física en la lente infrarroja.',
        isCorrect: false,
        explanation: 'Falso. La suciedad física produce pérdidas de seguimiento o saltos angulares, pero no genera saturación de colas ISR/DPC en el kernel ni eleva el uso de CPU a nivel Ring 0.'
      },
      {
        id: 'opt-b',
        text: 'Saturación del despachador de interrupciones Ring 0: el procesador no dispone de suficiente potencia monohilo para procesar 8000 llamadas DPC/s sin asfixiar el bucle del motor del juego.',
        isCorrect: true,
        explanation: '¡CORRECTO! A 8000 Hz, el procesador debe atender una interrupción cada 125 microsegundos. Si la CPU no posee una alta frecuencia mononúcleo, el hilo encargado de despachar las interrupciones del controlador USB monopoliza el tiempo del núcleo, impidiendo que el motor gráfico procese los fotogramas a tiempo. Ajustar el polling rate a 1000 Hz o 2000 Hz elimina el problema al instante.'
      },
      {
        id: 'opt-c',
        text: 'El puerto USB 3.0 no entrega suficiente amperaje y la batería interna del ratón se descarga.',
        isCorrect: false,
        explanation: 'Falso. Si existiera déficit de alimentación eléctrica, el ratón se desconectaría con el sonido característico de desconexión USB de Windows y se apagaría por completo.'
      }
    ]
  },
  {
    id: 'case-03',
    number: 'EXPEDIENTE FORENSE #03',
    title: 'Contienda de Carriles PCIe Compartidos (Ranura PEG vs Zócalos M.2_2)',
    subtitle: 'Una placa de video de gama alta conectada en la ranura principal reporta ancho de banda recortado a la mitad en GPU-Z y benchmarks.',
    difficulty: 'NIVEL MASTER',
    symptoms: [
      'La tarjeta gráfica está montada correctamente en el primer zócalo PCIe x16 (ranura PEG_1).',
      'El usuario instaló una segunda unidad de estado sólido NVMe ultrarrápida en el zócalo M.2_2 de la placa madre.',
      'GPU-Z y HWiNFO64 informan que el enlace opera en PCIe 4.0 x8 en lugar de los 16 carriles nativos.',
      'El ancho de banda de comunicación bidireccional cayó de ~28 GB/s a ~14 GB/s.'
    ],
    telemetryClue: 'El diagrama de bloques del chipset y CPU confirma que la CPU de consumo cuenta con 16 carriles para gráficos y 4 carriles para almacenamiento. Al poblar el zócalo M.2_2, los multiplexores de hardware conmutan mecánicamente las pistas y bifurcan el bus PEG a x8/x8 (8 líneas a la GPU y 8 líneas al SSD).',
    options: [
      {
        id: 'opt-a',
        text: 'La placa de video tiene polvo en los contactos dorados del conector PCIe.',
        isCorrect: false,
        explanation: 'Falso. El polvo puede provocar fallos de negociación o desconexión total, pero no una bifurcación exacta y simétrica de pistas x8/x8 gobernada por la tabla de multiplexación ACPI de la placa base.'
      },
      {
        id: 'opt-b',
        text: 'Bifurcación de carriles PCIe por contienda de bus: mover el segundo SSD NVMe a un zócalo conectado a las líneas del Chipset (PCH) para liberar los 16 carriles PEG para la GPU.',
        isCorrect: true,
        explanation: '¡CORRECTO! En muchas placas madre de gama media/alta, el zócalo M.2 secundario comparte pistas directas con el primer puerto PCIe PEG. Instalar una unidad NVMe allí fuerza al BIOS a bifurcar el enlace x16 en x8/x8 o x8/x4. Reubicar el SSD en una ranura M.2 gobernada por el Chipset restablece los 16 carriles completos hacia la GPU sin pérdida de rendimiento.'
      },
      {
        id: 'opt-c',
        text: 'Es un error visual de la versión instalada de GPU-Z que no detecta correctamente la arquitectura.',
        isCorrect: false,
        explanation: 'Falso. La caída a la mitad en los benchmarks sintéticos de ancho de banda de transferencia de memoria PCIe confirma que el recorte de carriles es una condición física real en las pistas de cobre.'
      }
    ]
  }
];

export const Lab06ZonaRestringida: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<MysteryCase>(MYSTERY_CASES[0]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    const opt = selectedCase.options.find(o => o.id === selectedOptionId);
    if (opt?.isCorrect && !solvedCases.includes(selectedCase.id)) {
      setSolvedCases([...solvedCases, selectedCase.id]);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600/15 via-[#0e1017] to-zinc-900 border-2 border-red-500/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Lock className="w-40 h-40 text-red-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-400 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 06 // DESAFÍOS PERICIALES DE ALTA DIFICULTAD
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// EXPEDIENTES MISTERIOSOS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Zona Restringida & Laboratorio Forense Ciego
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              Casos reales de hardware donde todo parece indicar una falla pero la causa raíz es otra. Analizá los síntomas, leé la telemetría oculta y resolvé el misterio como un verdadero Perito EVO.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-black/70 border border-zinc-800 rounded-xl font-mono-tech text-center">
              <span className="text-[10px] text-zinc-500 block uppercase">CASOS RESUELTOS</span>
              <span className="text-lg font-black text-amber-400">{solvedCases.length} DE 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Case selection */}
        <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-4">
          <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
            EXPEDIENTES ACTIVOS
          </span>

          <div className="space-y-3">
            {MYSTERY_CASES.map((c) => {
              const isSelected = selectedCase.id === c.id;
              const isSolved = solvedCases.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCase(c);
                    handleReset();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none font-mono-tech ${
                    isSelected
                      ? 'bg-red-500/15 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {c.number}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      isSolved 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {isSolved ? '✓ RESUELTO' : c.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-zinc-100 mb-1 leading-snug">
                    {c.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Investigation Desk */}
        <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
          
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono-tech text-red-400 font-bold uppercase tracking-wider block">
              {selectedCase.number} // {selectedCase.difficulty}
            </span>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight mt-0.5">
              {selectedCase.title}
            </h3>
            <p className="text-xs text-zinc-300 font-sans-editorial mt-1">
              {selectedCase.subtitle}
            </p>
          </div>

          {/* Symptoms List */}
          <div className="space-y-2">
            <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase tracking-wider block">
              SÍNTOMAS REPORTADOS POR EL USUARIO:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedCase.symptoms.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-black/60 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-sans-editorial flex items-start gap-2">
                  <span className="text-red-400 font-mono-tech font-bold text-xs mt-0.5">•</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Clue Box */}
          <div className="p-4 bg-red-950/20 border border-red-500/50 rounded-xl space-y-1.5 font-sans-editorial">
            <span className="text-[10.5px] font-mono-tech text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              PISTA PERICIAL // MEDICIÓN DE LABORATORIO CON INSTRUMENTAL
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {selectedCase.telemetryClue}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 font-sans-editorial">
            <span className="text-xs font-mono-tech text-white font-bold uppercase tracking-wider block">
              ¿CUÁL ES EL DIAGNÓSTICO EXACTO Y LA SOLUCIÓN CORRECTA?
            </span>

            <div className="space-y-2">
              {selectedCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isAnswerSubmitted
                          ? opt.isCorrect
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : 'bg-red-500/20 border-red-500 text-white'
                          : 'bg-amber-400/20 border-amber-400 text-white'
                        : isAnswerSubmitted && opt.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? isAnswerSubmitted
                            ? opt.isCorrect ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-red-500 border-red-400 text-white'
                            : 'bg-amber-400 border-amber-400 text-black'
                          : 'border-zinc-700 text-zinc-400'
                      }`}>
                        {opt.id.slice(-1).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-semibold">
                          {opt.text}
                        </p>
                        {isAnswerSubmitted && (
                          <div className={`mt-2 p-2.5 rounded text-xs leading-relaxed ${
                            opt.isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60' : 'bg-red-950/30 text-red-300 border border-red-900/60'
                          }`}>
                            <strong>{opt.isCorrect ? '¡CORRECTO! ' : 'INCORRECTO: '}</strong>
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-between pt-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className={`px-6 py-2.5 rounded-xl font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedOptionId
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                VALIDAR HIPÓTESIS PERICIAL
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold uppercase cursor-pointer"
              >
                REINTENTAR ESTE EXPEDIENTE
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
