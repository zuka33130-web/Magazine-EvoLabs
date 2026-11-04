/* =========================================================
 * Modelo de datos del arranque — raíles, señales y fases UEFI
 * Plataforma de referencia: ATX12V, LGA1700, DDR4, UEFI Aptio
 * ========================================================= */

export type RailId =
  | "v5sb"
  | "v33"
  | "v5"
  | "v12"
  | "vcore"
  | "vccsa"
  | "vddq"
  | "pch";

export interface Rail {
  id: RailId;
  label: string;
  nominal: number;
  min: number;
  max: number;
  dec: number; // decimales
  note: string;
}

export const RAILS: Rail[] = [
  { id: "v5sb", label: "+5VSB", nominal: 5.0, min: 4.75, max: 5.25, dec: 2, note: "Standby · pin 9 ATX · siempre presente con AC" },
  { id: "v33", label: "+3.3V", nominal: 3.3, min: 3.14, max: 3.47, dec: 2, note: "Rail principal ±5% · rizado < 50 mVpp" },
  { id: "v5", label: "+5V", nominal: 5.0, min: 4.75, max: 5.25, dec: 2, note: "Rail principal ±5% · rizado < 50 mVpp" },
  { id: "v12", label: "+12V", nominal: 12.0, min: 11.4, max: 12.6, dec: 2, note: "EPS + PCIe · ±5% · rizado < 120 mVpp" },
  { id: "vcore", label: "VCore", nominal: 1.15, min: 0.6, max: 1.45, dec: 3, note: "VID negociado por SVID · sense remoto en el dado" },
  { id: "vccsa", label: "VCCSA", nominal: 1.05, min: 0.97, max: 1.15, dec: 3, note: "System Agent · controlador de memoria" },
  { id: "vddq", label: "VDDQ", nominal: 1.2, min: 1.14, max: 1.26, dec: 3, note: "Alimentación DRAM DDR4 · VTT = VDDQ/2" },
  { id: "pch", label: "PCH 1V05", nominal: 1.05, min: 1.0, max: 1.1, dec: 3, note: "Núcleo del chipset (buck dedicado)" },
];

export interface SignalDef {
  id: string;
  label: string;
  desc: string;
  /** nivel en el que la señal se considera "activa/afirmando su función" */
  activeWhen: "H" | "L";
}

export const SIGNALS: SignalDef[] = [
  { id: "ps_on", label: "PS_ON#", desc: "A LOW ordena a la fuente encender los raíles principales (pin 14)", activeWhen: "L" },
  { id: "pwr_ok", label: "PWR_OK", desc: "HIGH = raíles estables. Retardo spec: 100–500 ms (pin 8)", activeWhen: "H" },
  { id: "rsmrst", label: "RSMRST#", desc: "El EC lo libera cuando +5VSB es estable", activeWhen: "H" },
  { id: "slp_s5", label: "SLP_S5#", desc: "A LOW = sistema en soft-off (S5)", activeWhen: "L" },
  { id: "slp_s4", label: "SLP_S4#", desc: "A LOW = hibernación (S4)", activeWhen: "L" },
  { id: "slp_s3", label: "SLP_S3#", desc: "A LOW = suspendido en RAM (S3)", activeWhen: "L" },
  { id: "vr_ready", label: "VR_READY", desc: "El VRM del CPU confirma VCore dentro de regulación", activeWhen: "H" },
  { id: "plt_rst", label: "PLTRST#", desc: "Reset de plataforma. AND de todos los power-good", activeWhen: "L" },
  { id: "cpu_rst", label: "CPU_RESET#", desc: "Mientras está a LOW el CPU no ejecuta nada", activeWhen: "L" },
  { id: "prochot", label: "PROCHOT#", desc: "Protección térmica externa, activo a LOW", activeWhen: "L" },
];

export const INITIAL_SIGNALS: Record<string, "H" | "L"> = {
  ps_on: "H",
  pwr_ok: "L",
  rsmrst: "L",
  slp_s5: "L",
  slp_s4: "L",
  slp_s3: "L",
  vr_ready: "L",
  plt_rst: "L",
  cpu_rst: "L",
  prochot: "H",
};

export interface PostCodeStep { code: string; at: number }
export interface LogEvent { at: number; level: "PWR" | "SIG" | "SYS" | "ERR" | "OK"; text: string }
export interface SignalEvent { sig: string; level: "H" | "L"; at: number }

export interface Phase {
  id: string;
  title: string;
  short: string;
  dur: number; // ms simulados
  acpi: string;
  desc: string;
  inside: string[];
  meas: { point: string; expected: string }[];
  failures: string[];
  codes: PostCodeStep[];
  logs: LogEvent[];
  sigEvents: SignalEvent[];
  voltTargets: Partial<Record<RailId, number>>;
  comps: string[]; // componentes "trabajando"
  compsOn: string[]; // componentes alimentados
}

export const PHASES: Phase[] = [
  {
    id: "ac",
    title: "Conexión a la red eléctrica (G3 → S5)",
    short: "AC / 5VSB",
    dur: 2000,
    acpi: "G3 → S5",
    desc:
      "Al enchufar el cable, la fuente activa únicamente el convertidor de standby: el rail +5VSB. El resto de raíles sigue muerto. El sistema entra en S5 («soft off»): la placa está despierta solo lo justo para escuchar el botón de encendido.",
    inside: [
      "El flyback de standby arranca y regula +5VSB (pin 9 del ATX) a 5.00 V ±5%, con el primario a ~390 V DC tras el PFC.",
      "El Super I/O / EC (controlador embebido) se alimenta y queda muestreando el botón de power cada pocos ms.",
      "El rail 3.3V_DUAL (derivado de 5VSB) alimenta la flash SPI del BIOS, el RTC y el circuito de Wake-on-LAN.",
      "La pila CR2032 (~3.0 V) respalda RTC y NVRAM CMOS por si 5VSB desaparece.",
      "Consumo típico en S5: 10–30 mA sobre 5VSB (< 0.2 W).",
    ],
    meas: [
      { point: "Pin 9 ATX (+5VSB)", expected: "4.75–5.25 V" },
      { point: "VCC flash SPI (25Q256)", expected: "3.3 V estables" },
      { point: "Pila CR2032 en vacío", expected: "2.8–3.3 V" },
      { point: "PS_ON# sin pulsar (pin 14)", expected: "3.3–5 V (alto)" },
      { point: "Consumo del primario", expected: "0.5–1.5 W" },
    ],
    failures: [
      "Sin 5VSB: flyback de standby muerto, fusible de entrada abierto u optoacoplador dañado → el equipo «no da señales de vida».",
      "5VSB bajo (4.3 V): electrolíticos secos en el secundario → el EC se reinicia en bucle o hay encendidos erráticos.",
      "Pila < 2.5 V: se pierde fecha/RTC y configuración UEFI (aparecerá «CMOS checksum error» más adelante).",
    ],
    codes: [],
    logs: [
      { at: 0.05, level: "PWR", text: "AC presente: filtro EMI + PFC activo (bus primario ≈ 390 V DC)" },
      { at: 0.22, level: "PWR", text: "Convertidor de standby en regulación: +5VSB = 5.02 V (pin 9 ATX)" },
      { at: 0.42, level: "SIG", text: "RSMRST# → ALTO: el EC valida el rail de standby" },
      { at: 0.58, level: "PWR", text: "3.3V_DUAL activo → flash SPI del BIOS alimentada (3.30 V)" },
      { at: 0.78, level: "SYS", text: "Super I/O / EC en escucha del botón PWR (estado ACPI S5)" },
      { at: 0.92, level: "SYS", text: "RTC sostenido por CR2032: 3.02 V — fecha/hora conservadas" },
    ],
    sigEvents: [{ sig: "rsmrst", level: "H", at: 0.42 }],
    voltTargets: { v5sb: 5.02 },
    comps: ["atx"],
    compsOn: ["ec", "sio", "flash", "bat"],
  },
  {
    id: "pwrbtn",
    title: "Pulsación del botón de encendido",
    short: "Botón PWR",
    dur: 1400,
    acpi: "S5",
    desc:
      "El botón de power es un simple contacto que el EC muestrea. Al cerrarlo, el EC hace antirrebote (~15 ms) y responde bajando PS_ON# a masa: la orden universal «enciende tus raíles» dirigida a la fuente. Sin 5VSB este paso jamás ocurre.",
    inside: [
      "El pulsador del gabinete conecta la entrada PWRBTN# del header de front-panel a GND.",
      "El EC hace debounce de ~15 ms y ejecuta su secuencia de encendido programada en firmware.",
      "Un MOSFET de drenador abierto descarga PS_ON# (pin 14, cable verde) a < 0.8 V.",
      "La fuente muestrea PS_ON# y habilita sus etapas principales. La spec ATX exige mantenerlo bajo ≥ 100 ms.",
    ],
    meas: [
      { point: "PS_ON# sin pulsar", expected: "3.3–5 V" },
      { point: "PS_ON# con botón pulsado", expected: "< 0.8 V" },
      { point: "PWRBTN# en el EC", expected: "flanco H→L de ~20 ms" },
    ],
    failures: [
      "Botón o cable del front-panel roto: puentear los pines PWR del header con un destornillador para descartarlo.",
      "EC sin firmware o sin 5VSB: PS_ON# nunca baja → la fuente está sana pero la placa jamás ordena el arranque.",
      "Header de front-panel mal conectado (PWR confundido con RESET): el botón «no hace nada».",
    ],
    codes: [],
    logs: [
      { at: 0.18, level: "SIG", text: "PWRBTN# → BAJO: pulsación detectada (debounce 15 ms)" },
      { at: 0.5, level: "SYS", text: "EC: secuencia de encendido iniciada (política ACPI S5→S0)" },
      { at: 0.75, level: "SIG", text: "PS_ON# → BAJO (0.4 V): orden de arranque enviada a la PSU" },
    ],
    sigEvents: [{ sig: "ps_on", level: "L", at: 0.75 }],
    voltTargets: {},
    comps: ["fp", "ec"],
    compsOn: [],
  },
  {
    id: "psu",
    title: "Arranque de la fuente: raíles ATX",
    short: "Raíles ATX",
    dur: 2800,
    acpi: "S5 → S0",
    desc:
      "Con PS_ON# a masa, la PSU habilita sus convertidores principales. +12 V, +5 V y +3.3 V suben en milisegundos con soft-start, y cuando todos están dentro de tolerancia un supervisor afirma PWR_OK: el «visto bueno» sin el cual la placa mantiene todo en reset.",
    inside: [
      "El PWM del primario arranca los convertidores (forward/LLC): los raíles suben con soft-start de 1–10 ms.",
      "En fuentes modernas, +5 V y +3.3 V se derivan de +12 V mediante buck DC-DC en el secundario.",
      "Un supervisor compara cada rail contra umbrales y, tras 100–500 ms, afirma PWR_OK (pin 8, cable gris) a +5 V.",
      "Los ventiladores arrancan al 100% unos instantes (autotest) y caen a régimen normal.",
      "El 5VSB sigue vivo: alimenta el EC y la lógica que vigila todo este proceso.",
    ],
    meas: [
      { point: "+12 V", expected: "11.4–12.6 V · rizado < 120 mVpp" },
      { point: "+5 V", expected: "4.75–5.25 V · rizado < 50 mVpp" },
      { point: "+3.3 V", expected: "3.14–3.47 V · rizado < 50 mVpp" },
      { point: "PWR_OK (pin 8)", expected: "sube a ~5 V tras 100–500 ms" },
      { point: "Corriente de arranque 12 V", expected: "pico 3–8 A (carga de capacitores)" },
    ],
    failures: [
      "Rail fuera de tolerancia o rizado excesivo: electrolíticos degradados en secundario → reinicios aleatorios bajo carga.",
      "PWR_OK no llega: supervisor dañado o un cortocircuito aguas abajo hunde un rail → ventiladores giran y paran.",
      "OCP/SCP disparado en < 10 ms: cortocircuito en placa (MOSFET de VRM, MLCC) → la PSU se enclava apagada.",
    ],
    codes: [],
    logs: [
      { at: 0.05, level: "PWR", text: "PSU: soft-start del primario — convertidores principales habilitados" },
      { at: 0.2, level: "PWR", text: "+12V en regulación: 12.06 V (rizado 41 mVpp / límite 120)" },
      { at: 0.33, level: "PWR", text: "+5V estable: 5.05 V (rizado 18 mVpp / límite 50)" },
      { at: 0.45, level: "PWR", text: "+3.3V estable: 3.31 V (rizado 15 mVpp / límite 50)" },
      { at: 0.62, level: "SYS", text: "Ventiladores al 100% (autotest) → régimen normal 40%" },
      { at: 0.84, level: "SIG", text: "PWR_OK → ALTO tras 220 ms: raíles dentro de tolerancia" },
    ],
    sigEvents: [{ sig: "pwr_ok", level: "H", at: 0.84 }],
    voltTargets: { v12: 12.06, v5: 5.05, v33: 3.31 },
    comps: ["atx"],
    compsOn: [],
  },
  {
    id: "sleep",
    title: "PCH y secuencia de estados de sueño",
    short: "SLP / PCH",
    dur: 1800,
    acpi: "S5 → S0",
    desc:
      "Con PWR_OK en alto, el EC y el PCH desactivan en cascada las señales de sleep (SLP_S5#, SLP_S4#, SLP_S3#) y habilitan los reguladores de la placa. Cada buck responde con su power-good individual; el PCH hace un AND de todos antes de liberar ningún reset.",
    inside: [
      "El PCH (chipset) recibe sus raíles directos (1.05 V core, 1.8 V) y sale de su reset interno.",
      "SLP_S5#, SLP_S4# y SLP_S3# suben a HIGH en cadena: la placa declara que abandona los estados de bajo consumo.",
      "Las señales de enable (VR_ON, EN_RAM…) disparan los buck de placa: PCH, memoria y auxiliares del CPU.",
      "Cada regulador devuelve su PWRGD; si uno falta, la secuencia se detiene aquí silenciosamente.",
    ],
    meas: [
      { point: "PCH VCC core", expected: "1.00–1.10 V" },
      { point: "SLP_S3# tras PWR_OK", expected: "> 2.0 V (alto)" },
      { point: "Pin EN del buck de RAM", expected: "3.3 V" },
      { point: "PWRGD de cada buck", expected: "3.3 V uno a uno" },
    ],
    failures: [
      "PCH sin 1.05 V: buck del chipset muerto o en corto → la secuencia muere aquí, sin códigos POST.",
      "Un VRM no devuelve PWRGD: el PCH espera para siempre → medir enable y salida de cada buck en orden.",
      "Cortocircuito en rail de placa: la protección de la fuente o del propio buck lo delata (tensión hundida).",
    ],
    codes: [],
    logs: [
      { at: 0.1, level: "SIG", text: "SLP_S5# → ALTO: saliendo de soft-off" },
      { at: 0.22, level: "SIG", text: "SLP_S4# → ALTO" },
      { at: 0.34, level: "SIG", text: "SLP_S3# → ALTO: plataforma en ruta a S0" },
      { at: 0.52, level: "PWR", text: "Buck PCH: 1.052 V — chipset fuera de reset interno" },
      { at: 0.72, level: "SIG", text: "VR_ON → ALTO: VRM de CPU, RAM y auxiliares habilitados" },
      { at: 0.9, level: "SYS", text: "PCH: AND de power-goods correcto — secuencia de placa OK" },
    ],
    sigEvents: [
      { sig: "slp_s5", level: "H", at: 0.1 },
      { sig: "slp_s4", level: "H", at: 0.22 },
      { sig: "slp_s3", level: "H", at: 0.34 },
    ],
    voltTargets: { pch: 1.052 },
    comps: ["pch", "ec"],
    compsOn: [],
  },
  {
    id: "vrm",
    title: "VRM del CPU: SVID y VCore",
    short: "VCore",
    dur: 2400,
    acpi: "S0",
    desc:
      "El VRM del socket es un convertidor multifase (8–16 fases) cuyo PWM dialoga con el CPU por el bus SVID. El CPU —aún en reset— pide su tensión de arranque (VID); el VRM la sirve con precisión de milivoltios y confirma con VR_READY.",
    inside: [
      "El controlador PWM recibe 12 V del conector EPS 8 pines (capaz de ~30 A) y su VCC lógico de 5 V.",
      "El agente SVID del CPU solicita el VID inicial (aquí 1.150 V) con paquetes de 2 bits de reloj.",
      "Cada fase (driver + MOSFETs high/low + inductor) conmuta a 300–600 kHz, desfasada de las demás.",
      "VCore sube con slew controlado (~10 mV/µs) para evitar overshoot; el lazo mide en el dado (remote sense).",
      "El VRM de memoria entrega VDDQ 1.2 V y VTT 0.6 V; VCCSA alimenta el controlador de memoria del CPU.",
    ],
    meas: [
      { point: "VCore en condensadores del socket", expected: "1.10–1.20 V según VID" },
      { point: "12 V en EPS bajo corriente", expected: "11.6–12.4 V" },
      { point: "Corriente de arranque", expected: "pico 20–40 A breve" },
      { point: "Conmutación por fase", expected: "300–600 kHz" },
      { point: "VDDQ / VTT", expected: "1.20 V / 0.60 V" },
    ],
    failures: [
      "VCore = 0 V: PWM sin VCC/EN, MOSFET en corto u OCP de fase → CPU frío, código 0x00, sin pitidos.",
      "VCore inestable (±80 mV): lazo descompensado o polímeros degradados → cuelgues aleatorios bajo carga.",
      "Conector EPS flojo u oxidado: pin 12 V quemado bajo cargas altas (fallo clásico de minado/OEM).",
    ],
    codes: [],
    logs: [
      { at: 0.08, level: "PWR", text: "VRM CPU: PWM alimentado (12 V EPS + 5 V lógico) — 12 fases listas" },
      { at: 0.28, level: "SYS", text: "Bus SVID: el CPU solicita VID inicial 1.150 V" },
      { at: 0.5, level: "PWR", text: "VCore en rampa: slew 10 mV/µs @ 500 kHz por fase" },
      { at: 0.7, level: "PWR", text: "VCore = 1.152 V (error 2 mV vs VID) · Iout pico 31 A" },
      { at: 0.8, level: "PWR", text: "RAM: VDDQ 1.201 V · VTT 0.600 V · VCCSA 1.051 V" },
      { at: 0.9, level: "SIG", text: "VR_READY → ALTO: VCore regulado, el CPU puede salir de reset" },
    ],
    sigEvents: [{ sig: "vr_ready", level: "H", at: 0.9 }],
    voltTargets: { vcore: 1.152, vccsa: 1.051, vddq: 1.201 },
    comps: ["vrm", "eps"],
    compsOn: ["cpu"],
  },
  {
    id: "reset",
    title: "Liberación de resets: PLTRST# y CPU_RESET#",
    short: "Resets",
    dur: 1400,
    acpi: "S0",
    desc:
      "La última compuerta antes del código: con todos los power-good en orden, el PCH libera PLTRST# y, microsegundos después, CPU_RESET# sube a HIGH. El CPU arranca su máquina de estados y el puerto de códigos POST se inicializa a 0x00.",
    inside: [
      "PLTRST# sube a HIGH: se desactiva el reset de plataforma (chipset, buses, timers).",
      "CPU_RESET# pasa de ~0.2 V a HIGH: el CPU sale de reset y carga su estado inicial.",
      "CS:IP se fija en F000:FFF0 (reset vector: cima de los 4 GB, mapeado a la flash del BIOS).",
      "PERST# se libera en los slots PCIe para que las tarjetas preparen sus enlaces.",
    ],
    meas: [
      { point: "PLTRST#", expected: "flanco L→H a ~3.3 V" },
      { point: "CPU_RESET#", expected: "flanco L→H tras PLTRST#" },
      { point: "PERST# en slots PCIe", expected: "> 2.0 V" },
    ],
    failures: [
      "PLTRST# no se libera aunque todo parezca correcto: falta algún power-good en el AND del PCH → revisar buck por buck.",
      "CPU_RESET# clavado a LOW: pines doblados en el socket o PCH dañado.",
      "Reset en bucle (flancos cada ~2 s): watchdog del PCH reiniciando por fallo aguas abajo.",
    ],
    codes: [{ code: "0x00", at: 0.88 }],
    logs: [
      { at: 0.2, level: "SIG", text: "PLTRST# → ALTO: reset de plataforma liberado" },
      { at: 0.45, level: "SIG", text: "CPU_RESET# → ALTO: el CPU sale de reset" },
      { at: 0.62, level: "SIG", text: "PERST# → ALTO en slots PCIe x16 / x4" },
      { at: 0.88, level: "SYS", text: "Port 80h inicializado: 0x00 · vector de reset F000:FFF0h" },
    ],
    sigEvents: [
      { sig: "plt_rst", level: "H", at: 0.2 },
      { sig: "cpu_rst", level: "H", at: 0.45 },
    ],
    voltTargets: {},
    comps: ["cpu", "pch"],
    compsOn: ["pcie"],
  },
  {
    id: "sec",
    title: "SEC: microcódigo desde la flash SPI",
    short: "SEC / µcode",
    dur: 2600,
    acpi: "S0 · SEC",
    desc:
      "El CPU ejecuta su primera instrucción sin RAM disponible: la busca por SPI en la flash del BIOS. De la misma flash carga el parche de microcódigo que corrige erratas del silicio, y convierte su caché L2 en RAM temporal (Cache-as-RAM) para poder trabajar.",
    inside: [
      "Primera instrucción en FFFF:FFF0h: un salto al firmware SEC (reset vector).",
      "El controlador SPI lee la flash a 20–50 MHz (modo x4); sin RAM, cada fetch viaja por el bus SPI.",
      "La tabla FIT localiza el microcódigo; se carga al RAM interno de microcódigo y se activa por WRMSR.",
      "Cache-as-RAM (NEM, No-Eviction Mode): la L2 hace de pila y memoria de trabajo antes de que exista DRAM.",
      "Arranca el PEI Core: los primeros códigos POST (0x01–0x1F) aparecen en el port 80h.",
    ],
    meas: [
      { point: "CLK de la flash SPI", expected: "20–50 MHz durante el fetch" },
      { point: "CS# de la flash", expected: "ráfagas continuas" },
      { point: "VCC de la flash", expected: "3.3 V estables" },
      { point: "Port 80h", expected: "0x01 → 0x13 progresando" },
    ],
    failures: [
      "BIOS corrupto: el CPU lee 0xFF, triple-fault y reset en bucle → tarjeta POST clavada en 0x00/0xFF, sin pitidos.",
      "Flash sin VCC o CS# muerto: idéntico síntoma → verificar alimentación y continuidad del chip 25Qxxx.",
      "Microcódigo incompatible (tras actualizar BIOS con CPU nuevo): bucle de reset → clear CMOS o flashback.",
    ],
    codes: [
      { code: "0x01", at: 0.1 },
      { code: "0x03", at: 0.3 },
      { code: "0x10", at: 0.55 },
      { code: "0x11", at: 0.7 },
      { code: "0x13", at: 0.85 },
    ],
    logs: [
      { at: 0.08, level: "SYS", text: "SEC: primera instrucción por SPI (flash W25Q256 @ 33 MHz)" },
      { at: 0.3, level: "SYS", text: "FIT localizado: cargando parche de microcódigo (rev 2025-08)" },
      { at: 0.5, level: "SYS", text: "Microcódigo activo (WRMSR 0x79): erratas del silicio parcheadas" },
      { at: 0.68, level: "SYS", text: "Cache-as-RAM inicializada: L2 como memoria temporal (NEM)" },
      { at: 0.85, level: "SYS", text: "PEI Core iniciado — códigos 0x10→0x13 en port 80h" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["cpu", "flash"],
    compsOn: [],
  },
  {
    id: "pei",
    title: "PEI: entrenamiento de memoria (MRC)",
    short: "RAM / MRC",
    dur: 3400,
    acpi: "S0 · PEI",
    desc:
      "La fase más delicada del POST: el Memory Reference Code lee el SPD de cada módulo por SMBus y entrena la DDR4 bit a bit —write leveling, read/write eye training— ajustando retardos con margen de picosegundos. Si falla, el arranque muere aquí con código 0x5x.",
    inside: [
      "SMBus lee el SPD (EEPROM del DIMM, direcciones 0x50–0x57): velocidad, latencias CL-tRCD-tRP, ranks, voltajes.",
      "El controlador de memoria genera patrones de entrenamiento y barre el «ojo» de señal de cada byte lane.",
      "Write leveling alinea DQS con CK; el read training centra el ojo de lectura (margen típico 40–80 ps).",
      "Los parámetros entrenados se guardan en NVRAM para el fast-boot de futuros arranques.",
      "Al terminar, CAR se migra a DRAM: por fin hay memoria principal real (códigos 0x50→0x4F).",
    ],
    meas: [
      { point: "VDDQ en el DIMM", expected: "1.14–1.26 V (DDR4)" },
      { point: "VTT", expected: "≈ VDDQ/2 = 0.60 V" },
      { point: "SCL/SDA del SMBus", expected: "3.3 V con tráfico ~100 kHz" },
      { point: "Respuesta SPD", expected: "ACK en 0x50–0x57 por módulo" },
    ],
    failures: [
      "Código 0x5x + 3 pitidos AMI: módulo muerto, mal asentado o incompatible → probar uno a uno en slot A2.",
      "SPD sin respuesta: pista SMBus cortada o EEPROM quemada → el MRC no sabe qué RAM hay instalada.",
      "Inestable solo en frío: entrenamiento al límite → subir VCCSA/VDDQ ~50 mV o bajar XMP un escalón.",
      "Sin POST con RAM nueva: QVL del fabricante o densidad no soportada por el microcódigo actual.",
    ],
    codes: [
      { code: "0x2C", at: 0.08 },
      { code: "0x31", at: 0.22 },
      { code: "0x50", at: 0.4 },
      { code: "0x51", at: 0.6 },
      { code: "0x53", at: 0.78 },
      { code: "0x4F", at: 0.92 },
    ],
    logs: [
      { at: 0.06, level: "SYS", text: "MRC: leyendo SPD por SMBus (DIMM A1: DDR4-3200 CL16 · 16 GB)" },
      { at: 0.2, level: "SYS", text: "SPD OK: 2×16 GB dual-channel — perfil XMP 3200 (16-18-18-36)" },
      { at: 0.38, level: "PWR", text: "VDDQ 1.201 V · VTT 0.600 V — Vref generadas" },
      { at: 0.55, level: "SYS", text: "Entrenando write leveling (CH A/B · 4 byte lanes)…" },
      { at: 0.72, level: "SYS", text: "Read/write eye training: ojo centrado, margen 62 ps" },
      { at: 0.9, level: "OK", text: "DRAM operativa — CAR migrada a memoria principal (32 GB)" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["ram", "cpu"],
    compsOn: [],
  },
  {
    id: "dxe",
    title: "DXE: chipset y enumeración PCIe",
    short: "DXE / PCI",
    dur: 2400,
    acpi: "S0 · DXE",
    desc:
      "Con RAM disponible arranca el DXE Core: decenas de drivers UEFI toman los buses. Se escanea el árbol PCI Express dispositivo por dispositivo, se asignan direcciones (BAR) y cada enlace negocia anchura y velocidad (Gen3/4, x16…).",
    inside: [
      "El DXE Core instala los protocolos de arquitectura (CPU, Timer, Variable, Firmware Volume…).",
      "Escaneo PCI: lectura de Vendor/Device ID (registro 0x00) en bus 0 y descubrimiento de bridges raíz.",
      "Cada enlace PCIe entrena: detección de receptor, ecualización y negociación (Gen3 x16 = 8 GT/s por lane).",
      "Se asignan BAR (regiones MMIO/IO) y se carga el Option ROM/UEFI driver de cada dispositivo.",
      "Inicialización del SATA/NVMe del chipset, USB xHCI, NIC y audio HD.",
    ],
    meas: [
      { point: "REFCLK PCIe (100 MHz)", expected: "99.9–100.1 MHz diferencial" },
      { point: "Enlace GPU", expected: "Gen3/4 x16 entrenado" },
      { point: "3.3 V aux del slot", expected: "3.14–3.47 V" },
      { point: "Códigos POST", expected: "0x90–0x9F progresando" },
    ],
    failures: [
      "Enlace degrada a x1 o Gen1: slot con pistas dañadas, riser malo o lanes de la GPU tocadas.",
      "Dispositivo no enumerado: Option ROM corrupto → retirar la tarjeta y comparar la secuencia de códigos.",
      "Bloqueo en 0x9x: periférico que no responde al config space → desconectar dispositivos uno a uno.",
    ],
    codes: [
      { code: "0x60", at: 0.1 },
      { code: "0x70", at: 0.3 },
      { code: "0x90", at: 0.5 },
      { code: "0x91", at: 0.65 },
      { code: "0x93", at: 0.8 },
      { code: "0x98", at: 0.92 },
    ],
    logs: [
      { at: 0.08, level: "SYS", text: "DXE Core iniciado (códigos 0x60–0x7F)" },
      { at: 0.3, level: "SYS", text: "Enumeración PCI bus 0: PCH, IMC y root-ports activos" },
      { at: 0.5, level: "SYS", text: "PCIe: enlace GPU entrenado Gen3 x16 @ 8 GT/s (slot PEG0)" },
      { at: 0.68, level: "SYS", text: "BAR asignados: MMIO 32-bit C0000000–DFFFFFFF" },
      { at: 0.85, level: "SYS", text: "Option ROM de GPU cargado (GOP disponible)" },
      { at: 0.95, level: "SYS", text: "USB xHCI: root hub + hubs internos enumerados" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["pch", "pcie"],
    compsOn: ["m2"],
  },
  {
    id: "gop",
    title: "GOP: GPU y primer video",
    short: "Video",
    dur: 2200,
    acpi: "S0 · DXE",
    desc:
      "El momento «da señal»: el driver GOP (Graphics Output Protocol) reserva framebuffer, entrena la salida DisplayPort/HDMI, lee el EDID del monitor y pinta el logo del fabricante. Si el POST llega aquí y no hay imagen, el problema es de GPU o de su enlace.",
    inside: [
      "GOP reserva el framebuffer en la VRAM de la GPU (o memoria compartida si es iGPU).",
      "Se entrena el enlace de display: canal AUX en DisplayPort, EDID por DDC/I²C en HDMI.",
      "El logo OEM se dibuja en el framebuffer; el port 80h muestra la familia 0xB0.",
      "El ventilador de la GPU pasa a control térmico por PWM.",
    ],
    meas: [
      { point: "12 V en slot y conectores GPU", expected: "11.6–12.4 V" },
      { point: "HPD del conector de video", expected: "flanco alto con monitor" },
      { point: "EDID por DDC", expected: "respuesta I²C del monitor" },
      { point: "Códigos POST", expected: "0xB0 → 0xB7" },
    ],
    failures: [
      "0xB2 clavado + 1 largo/2 cortos: GPU muerta, sin alimentar o VRAM inestable → probar otra GPU.",
      "POST OK sin imagen: cable/monitor, entrada equivocada, o GPU legacy sin GOP en UEFI puro (activar CSM).",
      "Artefactos en el logo: VRAM defectuosa → la GPU «posta» pero su memoria falla bajo test.",
    ],
    codes: [
      { code: "0xB0", at: 0.15 },
      { code: "0xB2", at: 0.45 },
      { code: "0xB4", at: 0.75 },
      { code: "0xB7", at: 0.9 },
    ],
    logs: [
      { at: 0.12, level: "SYS", text: "GOP: inicializando GPU (10DE:2484) — framebuffer 16 MB en VRAM" },
      { at: 0.4, level: "SYS", text: "EDID leído: monitor 2560×1440 @ 144 Hz por DisplayPort" },
      { at: 0.7, level: "SYS", text: "Modo gráfico 1920×1080×32 — logo OEM en pantalla" },
      { at: 0.9, level: "OK", text: "Primer video visible (código 0xB7)" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["pcie"],
    compsOn: [],
  },
  {
    id: "stor",
    title: "Almacenamiento: NVMe, SATA y red",
    short: "NVMe/SATA",
    dur: 2000,
    acpi: "S0 · DXE",
    desc:
      "El firmware despierta los dispositivos de arranque: el NVMe entrena su enlace PCIe x4 y expone sus namespaces; cada puerto SATA sincroniza la PHY a 6 Gb/s. Se validan las tablas de partición GPT y la NIC carga su Option ROM.",
    inside: [
      "Driver NVMe: Identify Controller, descubrimiento de namespaces y capacidad formateada.",
      "SATA: handshake OOB (Out-of-Band) y negociación 6/3 Gb/s por puerto.",
      "Lectura de cabeceras GPT/MBR para validar tablas de partición de cada volumen.",
      "Option ROM PXE de la NIC listo para arranque por red si está habilitado.",
    ],
    meas: [
      { point: "Enlace NVMe", expected: "Gen3/4 x4 entrenado" },
      { point: "Link SATA", expected: "6.0 Gb/s + LED de actividad" },
      { point: "5 V en conector SATA power", expected: "4.75–5.25 V" },
      { point: "Códigos POST", expected: "0xA0–0xA2 / 0x9A" },
    ],
    failures: [
      "NVMe no aparece: slot M.2 compartido con SATA deshabilitado en BIOS, o SSD muerto → probar otro slot.",
      "SATA sin link: cable, puerto o PHY; si el HDD no gira, verificar 5 V/12 V del conector de potencia.",
      "GPT corrupto: el disco se ve pero no es booteable → reparar tabla desde un live USB.",
    ],
    codes: [
      { code: "0xA0", at: 0.2 },
      { code: "0xA2", at: 0.5 },
      { code: "0x9A", at: 0.8 },
    ],
    logs: [
      { at: 0.15, level: "SYS", text: "NVMe: SSD 1 TB detectado — enlace Gen4 x4 · namespace 1 (976 GB)" },
      { at: 0.45, level: "SYS", text: "SATA: HDD 2 TB sincroniza a 6 Gb/s — firma GPT válida" },
      { at: 0.75, level: "SYS", text: "PXE: Option ROM de la NIC listo (arranque por red habilitado)" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["m2", "sata"],
    compsOn: [],
  },
  {
    id: "bds",
    title: "BDS: selección del dispositivo de arranque",
    short: "BDS / NVRAM",
    dur: 1600,
    acpi: "S0 · BDS",
    desc:
      "Boot Device Selection: el firmware consulta las variables UEFI en NVRAM (BootOrder, Boot####) y elige el gestor de arranque. Si no encuentra ninguno válido, muestra el clásico «Reboot and Select proper Boot device» y se detiene.",
    inside: [
      "Se lee NVRAM en la flash SPI: BootOrder = «Windows Boot Manager, UEFI: SSD, PXE».",
      "Cada entrada Boot#### apunta a un archivo .EFI (\\EFI\\Microsoft\\Boot\\bootmgfw.efi).",
      "Se monta el ESP (partición FAT32) y Secure Boot verifica la firma del bootloader.",
      "Fallback final: \\EFI\\BOOT\\BOOTX64.EFI; si tampoco existe → mensaje de error y pausa.",
    ],
    meas: [
      { point: "Región NVRAM de la flash", expected: "variables íntegras (checksum)" },
      { point: "Lectura del ESP", expected: "FAT32 sin errores de E/S" },
      { point: "Códigos POST", expected: "0xD0 → 0xD4" },
    ],
    failures: [
      "«No bootable device»: BootOrder vacío, ESP borrado o bootloader dañado → reparar con USB (bcdboot).",
      "Secure Boot rechaza el bootloader: entradas UEFI desincronizadas → reinstalar entradas o ajustar CSM.",
      "NVRAM corrupta: la placa «olvida» el orden de boot → reescribir variables desde el setup.",
    ],
    codes: [
      { code: "0xD0", at: 0.2 },
      { code: "0xD2", at: 0.6 },
      { code: "0xD4", at: 0.85 },
    ],
    logs: [
      { at: 0.15, level: "SYS", text: "BDS: leyendo variables UEFI de NVRAM (BootOrder, Boot0001…)" },
      { at: 0.45, level: "SYS", text: "Entrada elegida: «Windows Boot Manager» (ESP del NVMe)" },
      { at: 0.7, level: "SYS", text: "ESP montado: \\EFI\\Microsoft\\Boot\\bootmgfw.efi localizado" },
      { at: 0.9, level: "OK", text: "Secure Boot: firma del bootloader verificada" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["pch", "flash"],
    compsOn: [],
  },
  {
    id: "osboot",
    title: "Bootloader → kernel",
    short: "Kernel",
    dur: 1800,
    acpi: "BDS → OS",
    desc:
      "El bootloader toma el mando: carga el kernel y sus drivers iniciales, construye las tablas de memoria del sistema y —en el instante solemne del arranque— llama a ExitBootServices(): el firmware entrega las llaves y deja de ser la autoridad de la máquina.",
    inside: [
      "bootmgfw.efi / GRUB leen kernel + initrd del volumen de arranque (ráfagas de 40+ MB/s).",
      "Las tablas ACPI/SMBIOS se transfieren al SO; el bootloader usa servicios UEFI de bloques.",
      "Se construyen las tablas de páginas del kernel y se salta a 64 bits con MMU activa.",
      "ExitBootServices(): se liberan los servicios de arranque; el kernel asume timers, IRQs y DMA.",
    ],
    meas: [
      { point: "Actividad del disco de arranque", expected: "ráfagas de lectura continuas" },
      { point: "CPU", expected: "1 núcleo al 100% (descompresión)" },
      { point: "Códigos POST", expected: "0xE0 → 0xE8" },
    ],
    failures: [
      "Pantallazo en plena carga: ya es terreno del SO — BCD corrupto, driver de arranque dañado.",
      "Disco que desaparece a mitad de carga: VRM del SSD o cable → vigilar si el enlace NVMe/SATA cae.",
      "Kernel panic inmediato: initrd corrupto o parámetros de arranque erróneos.",
    ],
    codes: [
      { code: "0xE0", at: 0.2 },
      { code: "0xE2", at: 0.5 },
      { code: "0xE8", at: 0.85 },
    ],
    logs: [
      { at: 0.15, level: "SYS", text: "bootmgfw.efi en ejecución: cargando kernel + initrd (~40 MB/s)" },
      { at: 0.5, level: "SYS", text: "ACPI/SMBIOS transferidos — tablas de memoria del kernel listas" },
      { at: 0.8, level: "SYS", text: "ExitBootServices(): el firmware cede el control al kernel" },
    ],
    sigEvents: [],
    voltTargets: {},
    comps: ["m2", "cpu"],
    compsOn: [],
  },
  {
    id: "s0",
    title: "Sistema operativo en marcha (S0)",
    short: "S0 / OS",
    dur: 1500,
    acpi: "S0",
    desc:
      "El kernel levanta drivers, planificador y sesión de usuario: el POST terminó. El CPU cae a sus C-states de reposo, VCore desciende al mínimo del VID y el VRM entra en modo ahorro. Un arranque sano de placa moderna: 8–20 segundos en total.",
    inside: [
      "ACPI activo: CPUs en C1E/C6, P-states con Speed Shift y DVFS gobernando VCore.",
      "VCore baja a ~0.68 V en reposo; el VRM reduce frecuencia de conmutación.",
      "Los servicios del sistema toman el hardware: el POST ya es historia.",
      "Total típico: 1–3 s de firmware (fast boot) + 5–15 s de sistema operativo.",
    ],
    meas: [
      { point: "VCore en idle", expected: "0.6–0.8 V" },
      { point: "Consumo del sistema", expected: "40–80 W en escritorio" },
      { point: "Tj del CPU", expected: "35–50 °C con cooler sano" },
      { point: "Código POST final", expected: "0xFF (boot completado)" },
    ],
    failures: [
      "Reinicios al entrar al SO: driver o fuente incapaz de sostener transitorios → probar otra PSU y mínimos.",
      "Temperatura alta en idle: montaje del cooler, pasta térmica o curva de ventilador mal configurada.",
      "Inestabilidad tras minutos: suele ser térmica o de memoria → stress test con monitoreo.",
    ],
    codes: [{ code: "0xFF", at: 0.7 }],
    logs: [
      { at: 0.2, level: "SYS", text: "Kernel: ACPI y P-states activos — CPU en C1E" },
      { at: 0.45, level: "PWR", text: "VCore idle 0.684 V (DVFS) — VRM en modo ahorro" },
      { at: 0.7, level: "OK", text: "POST completado en 14.8 s — sesión de usuario lista" },
      { at: 0.95, level: "OK", text: "Sistema en S0: hardware entregado al sistema operativo" },
    ],
    sigEvents: [],
    voltTargets: { vcore: 0.684 },
    comps: ["cpu"],
    compsOn: ["atx", "vrm", "ram", "pch", "pcie", "m2", "sata", "flash", "ec", "sio", "eps", "fp"],
  },
];

/** eventos ordenados por 'at' para el motor */
export const SORTED_PHASES = PHASES.map((p) => ({
  ...p,
  logs: [...p.logs].sort((a, b) => a.at - b.at),
  sigEvents: [...p.sigEvents].sort((a, b) => a.at - b.at),
  codes: [...p.codes].sort((a, b) => a.at - b.at),
}));

export const TOTAL_DUR = PHASES.reduce((a, p) => a + p.dur, 0);
