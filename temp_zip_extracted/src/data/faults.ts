/* =========================================================
 * Escenarios de fallo inyectables — diagnóstico de nivel técnico
 * ========================================================= */

export type FaultLed = "CPU" | "DRAM" | "VGA" | "BOOT" | null;
export type FaultEffect = "collapse" | "collapse_sb" | "none";

export interface FaultDef {
  id: string;
  name: string;
  tagline: string;
  phase: number; // índice de fase donde se detiene el arranque
  at: number; // progreso 0..1 dentro de la fase
  postCode: string | null; // null = congela el código actual
  beeps: number[]; // duraciones (ms) de cada pitido
  beepLabel: string;
  led: FaultLed;
  effect: FaultEffect;
  /** niveles forzados de señales al dispararse el fallo */
  overrides?: Record<string, "H" | "L">;
  symptoms: string[];
  whatHappens: string[];
  measurements: { point: string; expected: string; found: string }[];
  resolution: string[];
  extraLogs: { level: "ERR" | "SIG" | "PWR" | "SYS"; text: string }[];
}

export const FAULTS: FaultDef[] = [
  {
    id: "sb5_dead",
    name: "Fuente sin +5VSB (standby muerto)",
    tagline: "El equipo «no da señales de vida»: ni LEDs, ni respuesta al botón.",
    phase: 1,
    at: 0.15,
    postCode: "--",
    beeps: [],
    beepLabel: "Sin pitidos (nada está alimentado)",
    led: null,
    effect: "collapse_sb",
    symptoms: [
      "Pulsar el botón no produce absolutamente nada: sin giro de ventiladores, sin LEDs.",
      "El LED de standby de la placa (si existe) permanece apagado.",
      "El problema persiste con otro botón/pulsando el header con destornillador.",
    ],
    whatHappens: [
      "Sin +5VSB, el Super I/O/EC nunca se alimenta: no hay nadie que escuche el botón de power.",
      "PS_ON# permanece en alto por su pull-up: la fuente jamás recibe la orden de encender.",
      "La placa solo conserva RTC por la pila CR2032. Todo lo demás está a 0 V, como desenchufada.",
    ],
    measurements: [
      { point: "Pin 9 ATX (+5VSB)", expected: "4.75–5.25 V", found: "0.00 V" },
      { point: "PS_ON# tras pulsar botón", expected: "< 0.8 V", found: "4.9 V (no conmuta)" },
      { point: "Pila CR2032", expected: "2.8–3.3 V", found: "3.01 V (correcta)" },
      { point: "Consumo del primario", expected: "0.5–1.5 W", found: "0 W" },
    ],
    resolution: [
      "Puentear PS_ON# a GND (pin 14 con 16/17) con la fuente fuera de la placa: si no arranca, la PSU es la culpable.",
      "Abrir la PSU (descargada): revisar fusible de entrada, NTC, flyback de standby y optoacoplador del lazo.",
      "Si la fuente arranca en banco, buscar corto en el rail 5VSB de la placa (EC o SIO en corto la hunden).",
      "Medir resistencia 5VSB↔GND con todo desconectado: < 50 Ω indica corto en placa; localizar con cámara térmica.",
    ],
    extraLogs: [
      { level: "ERR", text: "EC sin alimentación: +5VSB ausente, PWRBTN# no se procesa" },
      { level: "ERR", text: "PS_ON# no conmuta — la PSU nunca recibe orden de arranque" },
    ],
  },
  {
    id: "short_12v",
    name: "Cortocircuito en +12V (MOSFET de VRM)",
    tagline: "Ventiladores «amagan» un giro y la fuente se enclava apagada (SCP).",
    phase: 2,
    at: 0.32,
    postCode: "--",
    beeps: [],
    beepLabel: "Sin pitidos (la protección corta antes)",
    led: null,
    effect: "collapse",
    overrides: { pwr_ok: "L" },
    symptoms: [
      "Al pulsar power: un «tic» en la fuente y un amago de giro de ventiladores (< 10 ms).",
      "No vuelve a encender hasta desconectar AC 30 s (enclavamiento de la protección SCP).",
      "El EPS de 8 pines o el ATX de 24 pines huelen ligeramente a quemado en casos graves.",
    ],
    whatHappens: [
      "Un MOSFET high-side del VRM del CPU está en corto: +12 V queda unido a GND a través de miliohmios.",
      "La corriente se dispara por encima del umbral OCP/SCP de la fuente en microsegundos.",
      "La protección corta TODOS los raíles y enclava el apagado: comportamiento correcto de una PSU sana.",
    ],
    measurements: [
      { point: "Resistencia 12V (EPS) ↔ GND", expected: "> 1 kΩ", found: "0.3 Ω" },
      { point: "Resistencia 12V (ATX24) ↔ GND", expected: "> 10 kΩ", found: "12 kΩ (sano)" },
      { point: "Caída en MOSFETs de fase (diodo)", expected: "0.35–0.55 V", found: "0.002 V en fase 3" },
      { point: "Tensión 12 V al pulsar", expected: "12 V estables", found: "colapsa a 0.4 V en 6 ms" },
    ],
    resolution: [
      "Con todo desconectado, medir resistencia 12V↔GND por zonas: EPS (VRM CPU), 24 pines, conectores PCIe.",
      "La zona en corto se localiza por térmica: inyectar 1 V limitado a 2 A y buscar el componente caliente.",
      "Causa típica: MOSFET high-side o un MLCC del rail 12 V del VRM. Reemplazar y re-verificar resistencia.",
      "Tras reparar: probar la fuente con tester antes de reconectar, y arrancar con tarjeta POST para validar.",
    ],
    extraLogs: [
      { level: "ERR", text: "OCP/SCP: corriente en rail 12V > 60 A — cortocircuito detectado" },
      { level: "PWR", text: "PSU: todos los raíles cortados en 6 ms · enclavamiento activo" },
      { level: "ERR", text: "Causa probable: MOSFET high-side de fase en corto (VRM CPU)" },
    ],
  },
  {
    id: "pg_fail",
    name: "PWR_OK no se afirma (fuente enferma)",
    tagline: "Los raíles suben, pero la placa jamás sale de reset: sin POST.",
    phase: 2,
    at: 0.75,
    postCode: "--",
    beeps: [],
    beepLabel: "Sin pitidos (el CPU nunca arranca)",
    led: null,
    effect: "none",
    overrides: { pwr_ok: "L" },
    symptoms: [
      "Ventiladores giran con normalidad, LEDs de placa encendidos, pero el sistema no «piensa».",
      "La tarjeta POST queda en 0x00 o totalmente apagada (sin actividad en el bus).",
      "Algunas placas reintentan en bucle: se apagan y encienden cada pocos segundos.",
    ],
    whatHappens: [
      "Los raíles alcanzan tensión, pero el supervisor interno de la fuente no afirma PWR_OK (o lo hace a 2 V, inválido).",
      "Sin PWR_OK válido, el EC/PCH mantiene PLTRST# y CPU_RESET# activos: nada sale de reset.",
      "Causas: supervisor/TL494 dañado, rail con rizado excesivo que el supervisor rechaza, o carga que hunde un rail.",
    ],
    measurements: [
      { point: "PWR_OK (pin 8, gris)", expected: "4.5–5.25 V", found: "0.12 V" },
      { point: "+12 V bajo carga", expected: "11.4–12.6 V", found: "12.03 V (aparentemente OK)" },
      { point: "Rizado 5 V", expected: "< 50 mVpp", found: "340 mVpp (excesivo)" },
      { point: "Retardo PWR_OK", expected: "100–500 ms", found: "nunca llega" },
    ],
    resolution: [
      "Probar la fuente con tester de PSU o en otra placa: si PWR_OK no sube en banco, la PSU se repara/reemplaza.",
      "Si en banco PWR_OK es correcto, algo en la placa lo hunde: desconectar cargas por zonas (GPU, discos, RAM).",
      "En la PSU: revisar capacitores del secundario (rizado alto) y el circuito supervisor/PS-ON.",
      "Verificar con osciloscopio: PWR_OK debe subir limpio, sin rebotes, dentro de la ventana 100–500 ms.",
    ],
    extraLogs: [
      { level: "ERR", text: "PWR_OK clavado a 0.12 V fuera de ventana (> 500 ms)" },
      { level: "ERR", text: "PCH mantiene PLTRST# activo: la plataforma no sale de reset" },
    ],
  },
  {
    id: "vrm_dead",
    name: "VRM del CPU muerto (sin VCore)",
    tagline: "El CPU queda frío y en reset: código 0x00, LED CPU, sin pitidos.",
    phase: 4,
    at: 0.45,
    postCode: "0x00",
    beeps: [],
    beepLabel: "Sin pitidos (el CPU no ejecuta nada)",
    led: "CPU",
    effect: "none",
    symptoms: [
      "Ventiladores al 100%, placa con LEDs, pero tarjeta POST clavada en 0x00 y el disipador del CPU frío.",
      "El LED de diagnóstico de la placa (si existe) marca CPU.",
      "No responde a clear CMOS ni a quitar RAM: el fallo está antes de la memoria.",
    ],
    whatHappens: [
      "El controlador PWM del VRM no conmuta (sin VCC, sin EN o dañado): las fases no generan VCore.",
      "Sin VCore, VR_READY nunca se afirma → el PCH jamás libera PLTRST#/CPU_RESET#.",
      "El CPU permanece en reset estático: no ejecuta ni la primera instrucción, no puede emitir códigos ni pitidos.",
    ],
    measurements: [
      { point: "VCore en el socket", expected: "1.10–1.20 V", found: "0.000 V" },
      { point: "VCC del PWM (12 V EPS)", expected: "12 V", found: "12.05 V (llega)" },
      { point: "EN del PWM desde el PCH", expected: "3.3 V", found: "3.31 V (llega)" },
      { point: "Señal PWM en gates", expected: "tren 300–600 kHz", found: "0 V plano" },
      { point: "Drivers de fase (VCC)", expected: "5 V / 12 V", found: "0 V en driver 1" },
    ],
    resolution: [
      "Con sonda/osciloscopio: confirmar VCC y EN del PWM; si están y no hay PWM en gates, el controlador murió.",
      "Medir en modo diodo cada fase: un low-side en corto arrastra la protección y apaga el controlador.",
      "Reemplazar controlador PWM + drivers de la fase afectada (rework con estación de calor).",
      "Tras reparar, verificar VCore con carga sintética y observar el rizado (< 20 mVpp típico) antes de entregar.",
    ],
    extraLogs: [
      { level: "ERR", text: "VRM CPU: sin conmutación en fases — VCore = 0.000 V" },
      { level: "SIG", text: "VR_READY no se afirma → PLTRST# permanece activo" },
      { level: "ERR", text: "CPU en reset permanente: sin fetch, sin POST codes" },
    ],
  },
  {
    id: "bios_corrupt",
    name: "BIOS corrupto (flash SPI)",
    tagline: "Bucle de triple-fault: el CPU resetea en ciclos y el POST no arranca.",
    phase: 6,
    at: 0.25,
    postCode: "0x00",
    beeps: [],
    beepLabel: "Sin pitidos (el firmware nunca llega al speaker)",
    led: null,
    effect: "none",
    symptoms: [
      "El sistema enciende «bien» (raíles, resets liberados) pero la tarjeta POST queda en 0x00 o parpadea 0xFF.",
      "Ciclos de reset cada ~2 s: el watchdog del PCH reinicia la plataforma una y otra vez.",
      "La flash SPI muestra actividad (CLK/CS) pero ningún progreso de código.",
    ],
    whatHappens: [
      "El CPU lee la primera instrucción en FFFF:FFF0h… y obtiene basura (0xFF) de una flash corrupta.",
      "Instrucción inválida → excepción sin handler válido → triple-fault → el CPU fuerza reset interno.",
      "El bucle se repite infinitamente: sin firmware válido no hay SEC, ni microcódigo, ni pitidos.",
    ],
    measurements: [
      { point: "VCC flash SPI", expected: "3.3 V", found: "3.29 V (OK)" },
      { point: "CLK de la flash", expected: "ráfagas a 20–50 MHz", found: "presente (el CPU insiste)" },
      { point: "Contenido leído (CH341A)", expected: "CRC del dump válida", found: "CRC errónea · región 0x0000 borrada" },
      { point: "Ciclo de reset (PLTRST#)", expected: "un solo flanco", found: "flanco cada ~2 s" },
    ],
    resolution: [
      "Clear CMOS y, si la placa lo ofrece, BIOS Flashback (USB sin CPU) o recuperación por dual-BIOS.",
      "Sin recuperación: leer la flash in-circuit con programador CH341A + clip SOIC8/SOP8.",
      "Comparar el dump contra la imagen del fabricante (web del vendor), corregir regiones ME/serial y reescribir.",
      "Si el chip está dañado físicamente: sustituir la 25Qxxx por una nueva ya programada.",
    ],
    extraLogs: [
      { level: "ERR", text: "Fetch en FFFF:FFF0h devuelve 0xFF — flash corrupta o vacía" },
      { level: "ERR", text: "Triple-fault → reset interno — bucle cada ~2 s (watchdog)" },
      { level: "ERR", text: "Microcódigo nunca cargado: SEC no puede comenzar" },
    ],
  },
  {
    id: "ram_dead",
    name: "RAM muerta / sin entrenar",
    tagline: "El POST muere en MRC: código 0x53, 3 pitidos AMI, LED DRAM.",
    phase: 7,
    at: 0.18,
    postCode: "0x53",
    beeps: [500, 500, 500],
    beepLabel: "3 pitidos (AMI: fallo de memoria base 64K)",
    led: "DRAM",
    effect: "none",
    symptoms: [
      "El sistema enciende, pasa por SEC (códigos 0x01–0x13) y se clava en la familia 0x5x.",
      "El speaker emite 3 pitidos; placas modernas muestran LED DRAM o código Q «53».",
      "Sin video: el GOP jamás se inicializa porque no hay memoria donde montar framebuffer.",
    ],
    whatHappens: [
      "El MRC interroga el SPD por SMBus y no obtiene respuesta válida, o entrena y el patrón de verificación falla.",
      "Sin DRAM entrenada no existe memoria principal: CAR no puede migrarse y PEI aborta con código de error.",
      "El firmware no puede continuar: todo lo posterior (DXE, GOP, BDS) requiere RAM funcional.",
    ],
    measurements: [
      { point: "VDDQ en el DIMM", expected: "1.14–1.26 V", found: "1.202 V (alimentación OK)" },
      { point: "ACK SPD en SMBus (0x50)", expected: "ACK del módulo", found: "sin respuesta (NAK)" },
      { point: "SCL/SDA al pulsar reset", expected: "tráfico ~100 kHz", found: "tráfico sin ACK" },
      { point: "CK/DQS en el slot", expected: "tren diferencial", found: "señal ausente en A1" },
    ],
    resolution: [
      "Probar un módulo a la vez en el slot A2 (el primero del canal primario según el manual).",
      "Limpiar contactos del DIMM con alcohol isopropílico; revisar el slot con linterna (polvo/pines).",
      "Probar módulo conocido-bueno: si todo falla, sospechar del controlador de memoria (CPU) o pines del socket doblados.",
      "Si entrena pero cuelga: reducir XMP un escalón, subir VCCSA/VDDQ 50 mV y re-entrenar (borrar CMOS).",
    ],
    extraLogs: [
      { level: "ERR", text: "MRC: SPD sin respuesta en DIMM A1 (SMBus NAK)" },
      { level: "ERR", text: "Entrenamiento de memoria fallido — POST detenido en 0x53" },
      { level: "SIG", text: "Speaker: 3 pitidos AMI (memoria base 64K)" },
    ],
  },
  {
    id: "gpu_dead",
    name: "GPU sin inicializar (VGA)",
    tagline: "El POST avanza pero no hay video: 0xB2, 1 largo + 2 cortos, LED VGA.",
    phase: 9,
    at: 0.5,
    postCode: "0xB2",
    beeps: [900, 300, 300],
    beepLabel: "1 largo + 2 cortos (error de video)",
    led: "VGA",
    effect: "none",
    symptoms: [
      "El POST progresa con normalidad (RAM, PCI enumerado) y se clava en 0xB0–0xB2.",
      "El monitor dice «sin señal»; el speaker emite 1 pitido largo y 2 cortos.",
      "Los ventiladores de la GPU pueden girar al 100% fijos (GPU sin firmware/GOP respondiendo).",
    ],
    whatHappens: [
      "El bus PCI sí ve la GPU (Vendor/Device ID válidos), pero su Option ROM/GOP no se ejecuta correctamente.",
      "Causas típicas: alimentación auxiliar de 6/8 pines ausente, VRM/VRAM de la GPU dañados o slot con lanes muertas.",
      "Sin GOP no hay framebuffer ni EDID: el POST puede continuar «a ciegas», pero el técnico ve pantalla negra.",
    ],
    measurements: [
      { point: "12 V en conector PCIe 8 pines", expected: "11.6–12.4 V", found: "0.0 V (conector sin contacto)" },
      { point: "12 V en el slot (pins traseros)", expected: "11.4–12.6 V", found: "12.02 V (OK)" },
      { point: "3.3 V aux del slot", expected: "3.14–3.47 V", found: "3.31 V (OK)" },
      { point: "Enlace PCIe reportado", expected: "Gen3 x16", found: "Gen1 x1 degradado" },
    ],
    resolution: [
      "Reasentar la GPU y sus conectores de alimentación: el falso contacto del 8 pines es la causa nº1.",
      "Probar en otro slot x16 y, si hay iGPU, arrancar sin la dedicada para confirmar que el resto del POST es sano.",
      "Con otra GPU conocida: si funciona, la GPU original tiene VRM/VRAM muertos → reparación a nivel componente.",
      "Si degrada a x1/Gen1 en todos los slots: sospechar de pistas del slot o de lanes del CPU (socket/pines).",
    ],
    extraLogs: [
      { level: "ERR", text: "GOP: Option ROM de GPU no responde — init abortada en 0xB2" },
      { level: "ERR", text: "12 V ausente en conector auxiliar PCIe de 8 pines" },
      { level: "SIG", text: "Speaker: 1 largo + 2 cortos (fallo de video)" },
    ],
  },
  {
    id: "disk_dead",
    name: "Sin dispositivo de arranque",
    tagline: "El POST es perfecto pero no hay SO: «Reboot and Select proper Boot device».",
    phase: 11,
    at: 0.3,
    postCode: "0xD4",
    beeps: [],
    beepLabel: "Sin pitidos (el POST está sano)",
    led: "BOOT",
    effect: "none",
    symptoms: [
      "POST completo, logo OEM visible, y el mensaje «Reboot and Select proper Boot device or Insert Boot Media».",
      "El LED de diagnóstico de placa marca BOOT.",
      "El setup UEFI no lista entradas de arranque o el disco no aparece en el inventario.",
    ],
    whatHappens: [
      "BDS recorre BootOrder y no encuentra ninguna entrada válida: el ESP no existe, está corrupto o el disco no enlazó.",
      "El fallback \\EFI\\BOOT\\BOOTX64.EFI tampoco aparece → el firmware se rinde y muestra el mensaje.",
      "No es un fallo de hardware del POST: la plataforma está sana; falla la cadena de boot del sistema operativo.",
    ],
    measurements: [
      { point: "NVMe listado en el setup", expected: "presente con capacidad", found: "ausente" },
      { point: "Enlace NVMe (si aparece)", expected: "Gen4 x4", found: "sin entrenar" },
      { point: "BootOrder en NVRAM", expected: "≥ 1 entrada válida", found: "vacío / entradas huérfanas" },
      { point: "5 V / 12 V en SATA power", expected: "nominales", found: "OK en este caso" },
    ],
    resolution: [
      "Entrar al setup: verificar que el disco aparece; si no, revisar slot M.2/cable SATA y BIOS (puertos deshabilitados, RAID/AHCI).",
      "Con USB de instalación: «Reparar equipo → Símbolo» y ejecutar bcdboot C:\\Windows /s S: /f UEFI para reconstruir el ESP.",
      "Revisar Secure Boot/CSM: un cambio reciente puede dejar el bootloader antiguo como «no firmado».",
      "Si el disco no aparece en ningún lado: probarlo en otra máquina y leer SMART — SSD muerto es más común de lo deseado.",
    ],
    extraLogs: [
      { level: "ERR", text: "BDS: BootOrder sin entradas válidas — ESP no localizado" },
      { level: "ERR", text: "Pantalla: «Reboot and Select proper Boot device»" },
    ],
  },
  {
    id: "cmos_low",
    name: "Pila CMOS agotada",
    tagline: "«CMOS checksum error — Press F1»: fecha reseteada y configuración perdida.",
    phase: 11,
    at: 0.3,
    postCode: "0xD0",
    beeps: [],
    beepLabel: "Sin pitidos (aviso por pantalla)",
    led: null,
    effect: "none",
    symptoms: [
      "Cada apagado total: fecha vuelta a 2015/2018, orden de boot olvidado, XMP desactivado.",
      "Mensaje en pantalla: «CMOS checksum error» o «CMOS battery low — press F1 to run SETUP».",
      "El POST es por lo demás completamente normal; no hay riesgo para el hardware.",
    ],
    whatHappens: [
      "La CR2032 cae por debajo de ~2.5 V: el RTC y la NVRAM CMOS pierden coherencia entre sesiones sin AC.",
      "Al arrancar, el firmware recalcula el checksum de la región CMOS y no cuadra → asume configuración corrupta.",
      "BDS se detiene a pedir confirmación (F1) antes de seguir, cargando valores por defecto seguros.",
    ],
    measurements: [
      { point: "CR2032 medida fuera del socket", expected: "2.8–3.3 V", found: "2.13 V (agotada)" },
      { point: "CR2032 bajo carga (en socket)", expected: "> 2.7 V", found: "1.89 V (se hunde)" },
      { point: "Checksum NVRAM", expected: "válido", found: "inválido — defaults cargados" },
      { point: "Drenaje del rail RTC", expected: "< 5 µA", found: "normal (no hay fuga)" },
    ],
    resolution: [
      "Reemplazar la CR2032 (con el equipo desenchufado) y entrar al setup: Load Optimized Defaults.",
      "Reconfigurar orden de boot, fecha/hora y perfil XMP/EXPO de la memoria.",
      "Si la pila nueva se agota en semanas: medir drenaje del circuito RTC (diodo de conmutación en fuga).",
      "En portátiles: la pila puede ser con conector y cable — revisar también el contacto del socket.",
    ],
    extraLogs: [
      { level: "ERR", text: "NVRAM: checksum CMOS inválido — batería 2.13 V" },
      { level: "SYS", text: "Cargando defaults · «Press F1 to run SETUP, F2 to continue»" },
    ],
  },
];

export interface Scenario {
  id: string;
  label: string;
  fault: FaultDef | null;
}

export const SCENARIOS: Scenario[] = [
  { id: "none", label: "Arranque normal — sin fallos", fault: null },
  ...FAULTS.map((f) => ({ id: f.id, label: `Fallo: ${f.name}`, fault: f })),
];
