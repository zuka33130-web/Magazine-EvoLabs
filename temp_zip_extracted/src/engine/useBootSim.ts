import { useEffect, useRef, useState, useCallback } from "react";
import { INITIAL_SIGNALS, RAILS, SORTED_PHASES, type RailId } from "../data/boot";
import { SCENARIOS, type FaultDef } from "../data/faults";
import { ensureAudio, playBeepPattern } from "./audio";

export type SimStatus = "g3" | "s5" | "booting" | "paused" | "on" | "fault";
export type LogLevel = "PWR" | "SIG" | "SYS" | "ERR" | "OK";

export interface LogEntry {
  t: number;
  level: LogLevel;
  text: string;
}

export interface Snapshot {
  status: SimStatus;
  scenarioId: string;
  speed: number;
  sound: boolean;
  phaseIndex: number;
  phaseProgress: number;
  bootClock: number;
  voltages: Record<RailId, number>;
  signals: Record<string, "H" | "L">;
  postCode: string;
  logs: LogEntry[];
  fault: FaultDef | null;
  acpi: string;
  temp: number;
  fan: number;
  amps: number;
  beepFlash: boolean;
  beepTotal: number;
}

function zeroRails(): Record<RailId, number> {
  return { v5sb: 0, v33: 0, v5: 0, v12: 0, vcore: 0, vccsa: 0, vddq: 0, pch: 0 };
}

interface Sim {
  status: SimStatus;
  scenarioId: string;
  speed: number;
  sound: boolean;
  phaseIndex: number;
  elapsed: number;
  bootClock: number;
  voltages: Record<RailId, number>;
  targets: Record<RailId, number>;
  signals: Record<string, "H" | "L">;
  postCode: string;
  logs: LogEntry[];
  fault: FaultDef | null;
  faultArmed: boolean;
  faultTriggered: boolean;
  logPtr: number;
  sigPtr: number;
  codePtr: number;
  animT: number;
  temp: number;
  fan: number;
  amps: number;
  beepFlash: boolean;
  beepTotal: number;
}

const TEMP_T = [27, 27, 28, 29, 33, 35, 42, 47, 50, 51, 51, 50, 52, 46];
const FAN_T = [0, 0, 520, 700, 950, 1050, 1250, 1380, 1420, 1400, 1360, 1320, 1420, 920];
const AMP_T = [0, 0, 2, 3, 27, 9, 17, 12, 19, 10, 8, 6, 9, 4];

function initialSignals(): Record<string, "H" | "L"> {
  return { ...INITIAL_SIGNALS };
}

function createSim(): Sim {
  return {
    status: "g3",
    scenarioId: "none",
    speed: 1,
    sound: true,
    phaseIndex: 0,
    elapsed: 0,
    bootClock: 0,
    voltages: zeroRails(),
    targets: zeroRails(),
    signals: initialSignals(),
    postCode: "--",
    logs: [
      { t: 0, level: "SYS", text: "Sistema desconectado de la red (G3): todo a 0 V" },
      { t: 0, level: "SYS", text: "Acciona el interruptor AC para alimentar el standby (+5VSB)" },
    ],
    fault: null,
    faultArmed: false,
    faultTriggered: false,
    logPtr: 0,
    sigPtr: 0,
    codePtr: 0,
    animT: 0,
    temp: 24,
    fan: 0,
    amps: 0,
    beepFlash: false,
    beepTotal: 0,
  };
}

function scenarioOf(id: string) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

function pushLog(s: Sim, level: LogLevel, text: string) {
  s.logs.push({ t: s.bootClock, level, text });
  if (s.logs.length > 260) s.logs.splice(0, s.logs.length - 260);
}

function enterPhase(s: Sim, idx: number) {
  s.phaseIndex = idx;
  s.elapsed = 0;
  s.logPtr = 0;
  s.sigPtr = 0;
  s.codePtr = 0;
  const ph = SORTED_PHASES[idx];
  Object.assign(s.targets, ph.voltTargets);
  pushLog(s, "SYS", `── FASE ${idx + 1}/14 · ${ph.title} ──`);
}

function advance(s: Sim) {
  if (s.phaseIndex >= SORTED_PHASES.length - 1) {
    s.status = "on";
    return;
  }
  if (s.phaseIndex === 0) {
    // standby listo: el sistema espera en S5 la pulsación del botón
    s.status = "s5";
    s.elapsed = SORTED_PHASES[0].dur;
    pushLog(s, "SYS", "Plataforma en S5 · esperando pulsación del botón de power");
    return;
  }
  enterPhase(s, s.phaseIndex + 1);
}

export interface SimApi {
  snap: Snapshot;
  setAC: (on: boolean) => void;
  power: () => void;
  pauseToggle: () => void;
  stepPhase: () => void;
  setSpeed: (v: number) => void;
  toggleSound: () => void;
  setScenario: (id: string) => void;
  jumpTo: (idx: number) => void;
}

export function useBootSim(): SimApi {
  const sim = useRef<Sim>(createSim());
  const [snap, setSnap] = useState<Snapshot>(() => publish(sim.current));

  function publish(s: Sim): Snapshot {
    const voltages = { ...s.voltages };
    // rizado / ruido visible en los raíles activos
    RAILS.forEach((r, i) => {
      const v = voltages[r.id];
      if (v > 0.04) {
        const wob =
          Math.sin(s.animT * 0.013 + i * 1.7) * 0.0035 +
          (Math.random() - 0.5) * 0.004;
        voltages[r.id] = v + wob * Math.max(0.6, v * 0.6);
      }
    });
    const ph = SORTED_PHASES[Math.min(s.phaseIndex, SORTED_PHASES.length - 1)];
    const acpi =
      s.status === "g3"
        ? "G3 · OFF MECÁNICO"
        : s.status === "s5"
          ? "S5 · SOFT OFF"
          : s.status === "on"
            ? "S0 · OS EN MARCHA"
            : s.status === "fault"
              ? "S0 · DETENIDO (FALLO)"
              : ph.acpi.toUpperCase();
    return {
      status: s.status,
      scenarioId: s.scenarioId,
      speed: s.speed,
      sound: s.sound,
      phaseIndex: s.phaseIndex,
      phaseProgress: Math.min(1, s.elapsed / ph.dur),
      bootClock: s.bootClock,
      voltages,
      signals: { ...s.signals },
      postCode: s.postCode,
      logs: s.logs.slice(),
      fault: s.fault,
      acpi,
      temp: s.temp + (Math.random() - 0.5) * 0.4,
      fan: Math.max(0, Math.round(s.fan + (Math.random() - 0.5) * 14)),
      amps: Math.max(0, s.amps + (Math.random() - 0.5) * 0.5),
      beepFlash: s.beepFlash,
      beepTotal: s.beepTotal,
    };
  }

  function triggerFault(s: Sim, f: FaultDef) {
    s.faultTriggered = true;
    s.fault = f;
    s.status = "fault";
    if (f.effect === "collapse") {
      s.targets = zeroRails();
    } else if (f.effect === "collapse_sb") {
      s.targets = { ...s.targets, v5sb: 0 };
      s.signals.rsmrst = "L";
    }
    if (f.overrides) Object.assign(s.signals, f.overrides);
    if (f.postCode !== null) s.postCode = f.postCode;
    pushLog(s, "ERR", `⛔ FALLO INYECTADO: ${f.name}`);
    f.extraLogs.forEach((l) => pushLog(s, l.level, l.text));
    s.beepTotal = f.beeps.length;
    if (f.beeps.length > 0) {
      playBeepPattern(f.beeps, s.sound, () => {
        s.beepFlash = true;
        window.setTimeout(() => {
          s.beepFlash = false;
        }, 190);
      });
    }
  }

  function tick(dtReal: number) {
    const s = sim.current;
    s.animT += dtReal;
    const dt = dtReal * (s.status === "booting" ? s.speed : 0);

    // rampa de tensión (tiempo real: las caídas por protección se ven caer)
    const k = 1 - Math.exp(-dtReal / 210);
    RAILS.forEach((r) => {
      const v = s.voltages[r.id];
      const t = s.targets[r.id];
      s.voltages[r.id] = v + (t - v) * k;
    });

    // telemetría
    const collapse = s.fault?.effect === "collapse";
    const idx = Math.min(s.phaseIndex, TEMP_T.length - 1);
    const tT = s.status === "g3" ? 24 : collapse ? s.temp : TEMP_T[idx];
    const tF = s.status === "g3" || collapse ? 0 : s.status === "s5" ? 0 : FAN_T[idx];
    const tA = s.status === "g3" || collapse ? 0 : s.status === "s5" ? 0 : AMP_T[idx];
    const k2 = 1 - Math.exp(-dtReal / 900);
    s.temp += (tT - s.temp) * k2;
    s.fan += (tF - s.fan) * k2;
    s.amps += (tA - s.amps) * k2;

    if (s.status === "booting") {
      s.elapsed += dt;
      s.bootClock += dt;
      const ph = SORTED_PHASES[s.phaseIndex];
      const progress = Math.min(1, s.elapsed / ph.dur);

      while (s.logPtr < ph.logs.length && ph.logs[s.logPtr].at <= progress) {
        const ev = ph.logs[s.logPtr++];
        pushLog(s, ev.level, ev.text);
      }
      while (s.sigPtr < ph.sigEvents.length && ph.sigEvents[s.sigPtr].at <= progress) {
        const ev = ph.sigEvents[s.sigPtr++];
        s.signals[ev.sig] = ev.level;
      }
      while (s.codePtr < ph.codes.length && ph.codes[s.codePtr].at <= progress) {
        s.postCode = ph.codes[s.codePtr++].code;
      }

      const f = scenarioOf(s.scenarioId).fault;
      if (f && s.faultArmed && !s.faultTriggered && s.phaseIndex === f.phase && progress >= f.at) {
        triggerFault(s, f);
      } else if (progress >= 1) {
        advance(s);
      }
    }

    setSnap(publish(s));
  }

  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(120, now - last);
      last = now;
      tick(dt);
    }, 33);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAC = useCallback((on: boolean) => {
    const s = sim.current;
    ensureAudio();
    if (on) {
      const keepLogs: LogEntry[] = s.status === "g3" ? s.logs.slice(0, 2) : [];
      s.status = "booting";
      s.voltages = zeroRails();
      s.targets = zeroRails();
      s.signals = initialSignals();
      s.postCode = "--";
      s.logs = keepLogs;
      s.fault = null;
      s.faultTriggered = false;
      s.faultArmed = true;
      s.bootClock = 0;
      s.beepTotal = 0;
      pushLog(s, "PWR", "Interruptor AC → ON: la fuente recibe red");
      enterPhase(s, 0);
    } else {
      s.status = "g3";
      s.targets = zeroRails();
      s.signals = initialSignals();
      s.postCode = "--";
      s.fault = null;
      s.faultArmed = false;
      s.faultTriggered = false;
      s.beepTotal = 0;
      s.phaseIndex = 0;
      s.elapsed = 0;
      pushLog(s, "PWR", "Interruptor AC → OFF (G3): todos los raíles caen a 0 V");
    }
  }, []);

  const toS5 = useCallback((reason: string) => {
    const s = sim.current;
    s.status = "s5";
    const z = zeroRails();
    s.targets = { ...z, v5sb: 5.02 };
    s.signals = initialSignals();
    s.signals.rsmrst = "H";
    s.postCode = "--";
    s.fault = null;
    s.faultArmed = false;
    s.faultTriggered = false;
    s.beepTotal = 0;
    s.phaseIndex = 0;
    s.elapsed = SORTED_PHASES[0].dur;
    pushLog(s, "SIG", "SLP_S5# → BAJO: plataforma en soft-off · solo vive +5VSB");
    pushLog(s, "SYS", reason);
  }, []);

  const startBoot = useCallback(() => {
    const s = sim.current;
    if (s.status !== "s5") return;
    s.faultArmed = true;
    s.faultTriggered = false;
    s.bootClock = 0;
    s.status = "booting";
    const sc = scenarioOf(s.scenarioId);
    if (sc.fault) pushLog(s, "SYS", `Escenario activo: «${sc.fault.name}»`);
    enterPhase(s, 1);
  }, []);

  const power = useCallback(() => {
    ensureAudio();
    const s = sim.current;
    if (s.status === "s5") {
      pushLog(s, "SYS", "Pulsado botón de encendido del gabinete…");
      startBoot();
    } else if (s.status === "booting" || s.status === "paused") {
      toS5("Apagado forzado (pulsación larga de 4 s): raíles principales caen");
    } else if (s.status === "on") {
      toS5("Apagado normal solicitado por el SO (ACPI S0→S5)");
    } else if (s.status === "fault") {
      toS5("Reintento de arranque tras el fallo — plataforma de vuelta a S5");
    }
  }, [startBoot, toS5]);

  const pauseToggle = useCallback(() => {
    const s = sim.current;
    if (s.status === "booting") s.status = "paused";
    else if (s.status === "paused") s.status = "booting";
  }, []);

  const stepPhase = useCallback(() => {
    const s = sim.current;
    if (s.status === "s5") {
      startBoot();
    }
    if (s.status !== "booting" && s.status !== "paused") return;
    // completar la fase actual instantáneamente
    const ph = SORTED_PHASES[s.phaseIndex];
    Object.assign(s.targets, ph.voltTargets);
    RAILS.forEach((r) => {
      if (ph.voltTargets[r.id] !== undefined) s.voltages[r.id] = ph.voltTargets[r.id]!;
    });
    for (; s.logPtr < ph.logs.length; s.logPtr++) pushLog(s, ph.logs[s.logPtr].level, ph.logs[s.logPtr].text);
    for (; s.sigPtr < ph.sigEvents.length; s.sigPtr++) s.signals[ph.sigEvents[s.sigPtr].sig] = ph.sigEvents[s.sigPtr].level;
    if (ph.codes.length) s.postCode = ph.codes[ph.codes.length - 1].code;
    s.elapsed = ph.dur;
    s.bootClock += 60;
    const f = scenarioOf(s.scenarioId).fault;
    if (f && s.faultArmed && !s.faultTriggered && s.phaseIndex === f.phase && f.at <= 1) {
      triggerFault(s, f);
      return;
    }
    advance(s);
    if (s.status === "booting") s.status = "paused";
  }, [startBoot]);

  const setSpeed = useCallback((v: number) => {
    sim.current.speed = v;
  }, []);

  const toggleSound = useCallback(() => {
    const s = sim.current;
    s.sound = !s.sound;
    if (s.sound) ensureAudio();
  }, []);

  const setScenario = useCallback((id: string) => {
    const s = sim.current;
    s.scenarioId = id;
    if (s.status === "g3") {
      pushLog(s, "SYS", `Escenario seleccionado: ${scenarioOf(id).label}`);
      return;
    }
    // reiniciar a S5 con el nuevo escenario
    s.logs = [];
    s.voltages = { ...zeroRails(), v5sb: 5.02 };
    pushLog(s, "SYS", `Escenario seleccionado: ${scenarioOf(id).label}`);
    toS5("Plataforma reiniciada a S5 — pulsa POWER para ejecutar el escenario");
    // fijar tensiones de standby ya alcanzadas
    s.voltages = { ...zeroRails(), v5sb: 5.02 };
  }, [toS5]);

  const jumpTo = useCallback((idx: number) => {
    const s = sim.current;
    if (s.status === "g3") return;
    ensureAudio();
    s.voltages = zeroRails();
    s.targets = zeroRails();
    s.signals = initialSignals();
    s.postCode = "--";
    s.logs = [];
    s.fault = null;
    s.faultArmed = false;
    s.faultTriggered = true; // modo revisión: no re-dispara el fallo
    s.beepTotal = 0;
    s.elapsed = 0;
    pushLog(s, "SYS", "Modo revisión: reconstruyendo estado hasta la fase seleccionada…");
    for (let i = 0; i < idx; i++) {
      const ph = SORTED_PHASES[i];
      Object.assign(s.targets, ph.voltTargets);
      RAILS.forEach((r) => {
        if (ph.voltTargets[r.id] !== undefined) s.voltages[r.id] = ph.voltTargets[r.id]!;
      });
      ph.sigEvents.forEach((ev) => (s.signals[ev.sig] = ev.level));
      if (ph.codes.length) s.postCode = ph.codes[ph.codes.length - 1].code;
      pushLog(s, "SYS", `Fase ${i + 1} · ${ph.short} — aplicada`);
    }
    s.phaseIndex = idx;
    s.elapsed = 0;
    s.logPtr = 0;
    s.sigPtr = 0;
    s.codePtr = 0;
    s.status = "paused";
    const ph = SORTED_PHASES[idx];
    Object.assign(s.targets, ph.voltTargets);
    pushLog(s, "SYS", `── En pausa al inicio de: FASE ${idx + 1}/14 · ${ph.title} ──`);
    pushLog(s, "SYS", "Usa ▶ para reproducir esta fase o ⏭ para saltar a la siguiente");
  }, []);

  return { snap, setAC, power, pauseToggle, stepPhase, setSpeed, toggleSound, setScenario, jumpTo };
}
