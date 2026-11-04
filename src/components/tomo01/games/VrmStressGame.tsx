import React, { useState, useEffect } from 'react';
import { Flame, Sliders, Activity, ShieldAlert, CheckCircle2, RefreshCw, BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

export const VrmStressGame: React.FC = () => {
  const [phasesCount, setPhasesCount] = useState<number>(8); // 4, 8, 12, 16
  const [switchingFreqKhz, setSwitchingFreqKhz] = useState<number>(400); // 300 to 800 kHz
  const [fanSpeedPct, setFanSpeedPct] = useState<number>(50); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);
  const [currentLoadAmps, setCurrentLoadAmps] = useState<number>(80);
  const [vrmTempCelsius, setVrmTempCelsius] = useState<number>(45);
  const [maxRecordedTemp, setMaxRecordedTemp] = useState<number>(45);
  const [gameResult, setGameResult] = useState<'IDLE' | 'SURVIVED' | 'THERMAL_SHUTDOWN'>('IDLE');
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Physics calculation
  // Current per phase: I_phase = I_total / N
  // Conduction Loss per phase: P_cond = (I_phase)^2 * R_ds_on (R_ds_on ~ 3.5 mOhm = 0.0035 Ohm)
  // Switching Loss per phase: P_sw = V_in * I_phase * f_sw * (t_rise + t_fall)
  // Cooling capacity = FanSpeed% * heatsink factor
  const rDsOn = 0.0032; // Ohms
  const currentPerPhase = currentLoadAmps / phasesCount;
  const conductionLossTotal = phasesCount * Math.pow(currentPerPhase, 2) * rDsOn;
  const switchingLossTotal = phasesCount * (12.0 * currentPerPhase * (switchingFreqKhz * 1000) * 1.5e-8);
  const totalHeatWatts = conductionLossTotal + switchingLossTotal;

  // Temperature update during loop
  useEffect(() => {
    if (!isPlaying) return;

    if (secondsRemaining <= 0) {
      setIsPlaying(false);
      setGameResult('SURVIVED');
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((s) => s - 1);

      // Random transient spike every few seconds
      const isSpike = Math.random() > 0.6;
      const targetAmps = isSpike
        ? Math.floor(Math.random() * 80) + 160 // 160 to 240A spike
        : Math.floor(Math.random() * 40) + 70; // 70 to 110A base

      setCurrentLoadAmps(targetAmps);

      setVrmTempCelsius((prevTemp) => {
        const coolingPower = (fanSpeedPct / 100) * 28.0; // Dissipation power
        const netHeat = totalHeatWatts - coolingPower;
        const deltaT = netHeat * 0.12;
        const newTemp = Math.max(35, Math.min(125, prevTemp + deltaT));

        setMaxRecordedTemp((m) => Math.max(m, newTemp));

        if (newTemp >= 105) {
          setIsPlaying(false);
          setGameResult('THERMAL_SHUTDOWN');
        }

        return Math.round(newTemp);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining, phasesCount, switchingFreqKhz, fanSpeedPct, totalHeatWatts]);

  const handleStartGame = () => {
    setSecondsRemaining(20);
    setVrmTempCelsius(45);
    setMaxRecordedTemp(45);
    setGameResult('IDLE');
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSecondsRemaining(20);
    setVrmTempCelsius(45);
    setMaxRecordedTemp(45);
    setCurrentLoadAmps(80);
    setGameResult('IDLE');
  };

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400">
                JUEGO TÉCNICO // GESTIÓN TÉRMICA EN TIEMPO REAL
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Ley de Joule P=I²·R + Pérdidas de Conmutación PWM" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              VRM THERMAL RUNAWAY: EQUILIBRIO DE FASES
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              Controlá las fases de alimentación de una placa madre bajo picos transitorios de hasta 240 Amperios. Evitá que los MOSFETs alcancen los 105°C (TjMax) para salvar la PC de un apagado térmico repentino.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-300 font-mono text-xs font-bold hover:bg-orange-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showGuide ? 'OCULTAR GUÍA' : '¿CÓMO SE JUEGA?'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guía de Juego */}
      {showGuide && (
        <div className="border border-orange-500/30 bg-orange-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-orange-400">
            <Flame className="w-4 h-4" />
            <span>CÓMO JUGAR Y DOMINAR ESTE RETO DE ELECTRÓNICA</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Fórmula Maestra (I²·R):</strong> Al aumentar el número de fases (de 4 a 12 o 16), dividís la corriente entre más etapas DrMOS. Como las pérdidas por conducción son cuadráticas ($I^2$), duplicar las fases reduce el calor por fase a la cuarta parte.
            </li>
            <li>
              <strong className="text-white font-mono">Frecuencia PWM:</strong> Una frecuencia de conmutación muy alta (700-800 kHz) da una señal eléctrica más limpia, pero dispara las pérdidas por conmutación térmica en los transistores.
            </li>
            <li>
              <strong className="text-white font-mono">Ventilación activa:</strong> Subí el ventilador si ves picos superiores a 85°C. Si alcanzás los 105°C, la placa se apagará por protección OTP (Over-Temperature Protection).
            </li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              PARÁMETROS DEL VRM
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              {isPlaying ? `Tiempo: ${secondsRemaining}s` : 'En espera'}
            </span>
          </div>

          {/* Phases count */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">
              Fases VCore Activas (N):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 8, 12, 16].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhasesCount(p)}
                  className={`p-2 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                    phasesCount === p
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  {p} Fases
                </button>
              ))}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              Corriente por fase: <strong className="text-white">{currentPerPhase.toFixed(1)} Amperios</strong>
            </div>
          </div>

          {/* Switching frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Frecuencia PWM:</span>
              <span className="text-cyan-400 font-bold">{switchingFreqKhz} kHz</span>
            </div>
            <input
              type="range"
              min="300"
              max="800"
              step="50"
              value={switchingFreqKhz}
              onChange={(e) => setSwitchingFreqKhz(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>300 kHz (Frío)</span>
              <span>500 kHz (Balance)</span>
              <span>800 kHz (Caliente)</span>
            </div>
          </div>

          {/* Fan speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Flujo de Aire Disipador (PWM):</span>
              <span className="text-emerald-400 font-bold">{fanSpeedPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={fanSpeedPct}
              onChange={(e) => setFanSpeedPct(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-zinc-800 flex gap-2">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handleStartGame}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-bold uppercase transition-all cursor-pointer shadow-lg shadow-orange-500/20"
              >
                INICIAR PRUEBA DE ESTRÉS (20s)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
              >
                ABORTAR PRUEBA
              </button>
            )}
          </div>
        </div>

        {/* Meters and Gauge Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Real-time Temperature */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              vrmTempCelsius >= 95
                ? 'bg-red-950/40 border-red-500/60 text-red-200'
                : vrmTempCelsius >= 80
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                : 'bg-black/60 border-zinc-800 text-zinc-100'
            }`}>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                TEMPERATURA MOSFETS
              </span>
              <span className="text-4xl font-mono font-black">
                {vrmTempCelsius}°C
              </span>
              <p className="text-[10px] font-mono">
                Límite TjMax: 105°C
              </p>
            </div>

            {/* Current CPU Demand */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                DEMANDA DE CORRIENTE CPU
              </span>
              <span className="text-4xl font-mono font-black text-cyan-400">
                {currentLoadAmps} <span className="text-sm font-sans text-cyan-300">A</span>
              </span>
              <p className="text-[10px] font-mono text-zinc-400">
                Consumo a 1.2V Core
              </p>
            </div>

            {/* Total Thermal Heat */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                CALOR DISIPADO (JOULE)
              </span>
              <span className="text-4xl font-mono font-black text-orange-400">
                {totalHeatWatts.toFixed(1)} <span className="text-sm font-sans text-orange-300">W</span>
              </span>
              <p className="text-[10px] font-mono text-zinc-400">
                Pérdidas totales del VRM
              </p>
            </div>
          </div>

          {/* Thermal Bar */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Margen Térmico Restante:</span>
              <span className={`font-bold ${105 - vrmTempCelsius < 15 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {Math.max(0, 105 - vrmTempCelsius)}°C hasta corte por sobrecalentamiento
              </span>
            </div>

            <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  vrmTempCelsius >= 95 ? 'bg-red-500' : vrmTempCelsius >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (vrmTempCelsius / 105) * 100)}%` }}
              />
            </div>

            {/* Victory / Defeat message */}
            {gameResult === 'SURVIVED' && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-white uppercase">
                    ¡PRUEBA DE ESTRÉS SUPERADA!
                  </h4>
                  <p className="text-xs text-emerald-300/80">
                    Los MOSFETs soportaron la carga sin superar la temperatura de seguridad (Pico: {maxRecordedTemp}°C).
                  </p>
                </div>
              </div>
            )}

            {gameResult === 'THERMAL_SHUTDOWN' && (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-white uppercase">
                    APAGADO TÉRMICO CRÍTICO (OTP ACTIVADO)
                  </h4>
                  <p className="text-xs text-red-300/80">
                    La temperatura alcanzó los 105°C. Aumentá el número de fases o el flujo de aire para distribuir mejor la corriente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
