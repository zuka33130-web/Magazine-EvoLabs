import { EVO_WINDOWS_40_HEADLINES } from './tomo02Magazine40';

/**
 * EVO LABS / Expedientes prácticos Windows 11
 * 001–040 conservan la selección editorial existente.
 * 041–050 cubren técnicas ausentes en la primera selección.
 *
 * Un título NO equivale a capítulo terminado. Los 50 expedientes se publican
 * como laboratorio verificable mientras se desarrolla su revista A4 final.
 */
export const EVO_WINDOWS_50_EXTRA = [
  'El Modo Dios de Windows: abrí el panel de herramientas que casi nadie conoce',
  'Las entradas de inicio escondidas: encontrá lo que Windows carga sin avisar',
  'Servicios que sobran: liberá recursos sin romper Windows ni perder funciones',
  'Recuperá espacio de verdad: el diagnóstico del SSD antes de borrar un byte',
  '¿Basta con Defender? Auditoría de protección real frente a antivirus pagos',
  'Windows 11 para jugar: buscá FPS estables, no números inflados',
  'Decile adiós al input lag imaginario: identificá dónde nace el retraso real',
  'Script maestro EVO: radiografía profesional de Windows en un solo informe',
  '¿Quién devora tu disco? Cazá cachés enormes, duplicados y carpetas olvidadas',
  'Windows limpio sin programas basura: optimización reversible y demostrable',
] as const;

export const EVO_WINDOWS_50_HEADLINES: readonly string[] = [
  ...EVO_WINDOWS_40_HEADLINES,
  ...EVO_WINDOWS_50_EXTRA
];
if (EVO_WINDOWS_50_HEADLINES.length !== 50 ||
    new Set(EVO_WINDOWS_50_HEADLINES).size !== 50) {
  throw new Error('EVO LABS: catálogo de 50 investigaciones incompleto');
}

export const EVO_WINDOWS_50_BLOCKS = [
  {number:'I', title:'EL WINDOWS QUE NO VES',range:[1,8] as const},
  {number:'II', title:'TU PRIVACIDAD BAJO LA LUPA',range:[9,16] as const},
  {number:'III', title:'PERSISTENCIA Y SEGURIDAD',range:[17,24] as const},
  {number:'IV', title:'RENDIMIENTO REAL, SIN MITOS',range:[25,32] as const},
  {number:'V', title:'CONTROL, REPARACIÓN Y TRUCOS',range:[33,40] as const},
  {number:'VI', title:'LOS 10 SECRETOS QUE FALTABAN',range:[41,50] as const},
] as const;
