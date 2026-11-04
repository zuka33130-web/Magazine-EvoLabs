/* Tablas de referencia rápida para el técnico */

export interface PinRow { pin: number; color: string; name: string; use: string }

export const ATX_PINS: PinRow[] = [
  { pin: 1, color: "#e8873a", name: "+3.3V", use: "Alimentación placa (±5%)" },
  { pin: 3, color: "#111820", name: "COM", use: "Masa de retorno" },
  { pin: 4, color: "#d64545", name: "+5V", use: "USB, lógica 5 V (±5%)" },
  { pin: 8, color: "#9aa4ad", name: "PWR_OK", use: "Gris: HIGH = raíles OK (100–500 ms)" },
  { pin: 9, color: "#8a5cc9", name: "+5VSB", use: "Morado: standby siempre vivo con AC" },
  { pin: 11, color: "#e5c93b", name: "+12V", use: "Amarillo: VRM CPU/GPU (±5%)" },
  { pin: 13, color: "#e8873a", name: "+3.3V", use: "+ sense remoto en algunas fuentes" },
  { pin: 14, color: "#4caf6d", name: "PS_ON#", use: "Verde: a GND = orden de encendido" },
  { pin: 16, color: "#9aa4ad", name: "COM", use: "Masa (retorno de PS_ON#)" },
];

export interface TolRow { rail: string; nom: string; min: string; max: string; ripple: string }

export const TOLERANCES: TolRow[] = [
  { rail: "+3.3V", nom: "3.30 V", min: "3.14 V", max: "3.47 V", ripple: "< 50 mVpp" },
  { rail: "+5V", nom: "5.00 V", min: "4.75 V", max: "5.25 V", ripple: "< 50 mVpp" },
  { rail: "+12V", nom: "12.00 V", min: "11.40 V", max: "12.60 V", ripple: "< 120 mVpp" },
  { rail: "+5VSB", nom: "5.00 V", min: "4.75 V", max: "5.25 V", ripple: "< 50 mVpp" },
  { rail: "PWR_OK", nom: "≈5 V", min: "2.0 V (VIL máx.)", max: "—", ripple: "retardo 100–500 ms" },
  { rail: "PS_ON#", nom: "0 V activo", min: "—", max: "0.8 V activo", ripple: "ancho ≥ 100 ms" },
];

export const BEEPS_AMI = [
  { code: "1", meaning: "Fallo de refresco DRAM" },
  { code: "2", meaning: "Error de paridad de memoria" },
  { code: "3", meaning: "Fallo memoria base 64K (RAM)" },
  { code: "4", meaning: "Fallo del timer de sistema" },
  { code: "5", meaning: "Fallo de CPU" },
  { code: "6", meaning: "Fallo Gate A20" },
  { code: "7", meaning: "Excepción de modo virtual" },
  { code: "8", meaning: "Fallo de lectura/escritura en VRAM" },
  { code: "9", meaning: "Checksum de ROM BIOS incorrecto" },
  { code: "10", meaning: "Error de registro CMOS" },
  { code: "11", meaning: "Caché del CPU defectuosa" },
];

export const BEEPS_AWARD = [
  { code: "1 largo, 2 cortos", meaning: "Error de video (GPU/VRAM)" },
  { code: "1 largo, 3 cortos", meaning: "Fallo de memoria (reseat/limpiar)" },
  { code: "Largos continuos", meaning: "RAM no detectada o mal asentada" },
  { code: "Cortos continuos", meaning: "Problema de alimentación/PSU" },
  { code: "Agudos repetidos", meaning: "CPU: sobretemperatura o mal montado" },
];

export const POST_RANGES = [
  { range: "0x01–0x0F", phase: "SEC", desc: "Microcódigo, init del CPU" },
  { range: "0x10–0x1F", phase: "PEI core", desc: "CPU pre-memoria" },
  { range: "0x2C–0x3F", phase: "PEI", desc: "Detección/instalación de RAM" },
  { range: "0x50–0x5F", phase: "PEI/MRC", desc: "Inicialización de memoria (0x5x = fallo RAM)" },
  { range: "0x60–0x6F", phase: "DXE core", desc: "Arranca el DXE" },
  { range: "0x70–0x7F", phase: "DXE", desc: "Protocolos de arquitectura" },
  { range: "0x90–0x9F", phase: "DXE", desc: "Bus PCI / USB (0x9x = periférico)" },
  { range: "0xA0–0xAF", phase: "DXE", desc: "IDE/SATA/NVMe" },
  { range: "0xB0–0xBF", phase: "DXE", desc: "Video / GOP (0xB2 = fallo VGA)" },
  { range: "0xD0–0xDF", phase: "BDS", desc: "NVRAM, boot device selection" },
  { range: "0xE0–0xEF", phase: "BDS→OS", desc: "Intentos de arranque del SO" },
  { range: "0xF0–0xFF", phase: "Recovery", desc: "Recuperación / errores fatales (0xFF = fin OK en muchas placas)" },
];
