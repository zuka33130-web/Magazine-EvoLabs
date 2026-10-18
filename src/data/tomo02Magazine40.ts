import { EVO_MAGAZINE_200_TITLES } from './tomo02Magazine200';

/** Selección editorial revisada de 40 investigaciones Windows (200 originales preservados). */
export const EVO_WINDOWS_40_IDS = [
  52,1,3,8,4,110,118,25,
  54,55,56,61,53,65,71,75,
  76,80,81,82,84,87,96,95,
  15,102,13,14,34,108,101,199,
  17,18,24,23,31,48,182,50,
] as const;

export const EVO_WINDOWS_40_HEADLINES = [
  '¿Qué hace tu PC cuando no estás?',
  'Tu PC ejecuta decenas de procesos: ¿qué están haciendo realmente?',
  'El misterio de svchost.exe: ¿por qué hay tantos procesos iguales?',
  'Windows trabaja solo: las tareas que se ejecutan sin abrir ventanas',
  'Antes del escritorio: todo lo que Windows hace sin que lo veas',
  '¿Qué pasa si desaparece explorer.exe? El escritorio no es Windows',
  'Los dos Windows: el que ves y el que trabaja detrás',
  'Los errores invisibles de Windows: aprendé a leer sus pistas',
  '¿Windows envía tus datos a Microsoft? Vamos a comprobarlo',
  '¿Tu micrófono puede estar activo sin que lo notes?',
  '¿Quién puede acceder a tu cámara? Investigá los permisos',
  'Todo lo que Windows recuerda de vos: historial, actividad y Recall',
  'Windows se conecta solo a Internet: ¿con quién está hablando?',
  'El portapapeles también guarda secretos',
  '¿Qué ocurre cuando rechazás la telemetría de Windows?',
  'Privacidad bajo investigación: descubrí qué comparte tu PC',
  '¿Hay alguien dentro de tu PC? Las señales que realmente importan',
  '¿Alguien inició sesión en Windows mientras no estabas?',
  'Las cuentas que olvidaste: ¿quién puede entrar a tu computadora?',
  '¿Quién tiene permisos de administrador en tu PC?',
  '¿Tenés acceso remoto habilitado sin saberlo?',
  'El proceso que se hace pasar por Windows: cómo reconocerlo',
  'Los eventos que pueden revelar un acceso no autorizado',
  '¿Podés confiar en ese instalador? Firmas, reputación y protección real',
  'CPU al 100%: descubrí quién está frenando tu PC',
  '¿Cuánta RAM necesita Windows realmente?',
  '¿Desactivar pagefile.sys acelera Windows o puede empeorarlo?',
  'La aplicación que devora tu RAM: cómo detectar una fuga de memoria',
  '¿Microtirones sin explicación? Investigá DPC e ISR',
  '¿Por qué Windows se vuelve más lento con el tiempo?',
  'Windows viene cargado de cosas que nunca usás: ¿realmente consumen recursos?',
  'Windows minimalista: ¿hasta dónde podés optimizar sin romperlo?',
  'Regedit: el mapa secreto de la configuración de Windows',
  'Los ajustes mágicos del Registro: ¿mejoran tu PC o venden humo?',
  '¿Tu Windows está dañado? Reparalo con DISM y SFC',
  'WinSxS: la carpeta gigante que nunca deberías borrar manualmente',
  'TPM y Secure Boot: la seguridad que empieza antes de Windows',
  'PowerShell: creá tu propio diagnóstico profesional de Windows',
  'El día que Windows no arranque, vas a querer saber esto',
  'La auditoría definitiva: descubrí lo que realmente hace Windows',
] as const;

export const EVO_WINDOWS_40_SECTIONS = [
  { number: '01', title: 'EL WINDOWS QUE NUNCA VES', subtitle: 'Procesos, arranque, servicios y mecanismos del núcleo', image: 'kernel', range: [0,8] as const },
  { number: '02', title: '¿WINDOWS SABE DEMASIADO?', subtitle: 'Privacidad, permisos y telemetría sin conspiraciones', image: 'privacy', range: [8,16] as const },
  { number: '03', title: '¿HAY ALGUIEN EN TU PC?', subtitle: 'Seguridad, permisos, señales e investigación forense', image: 'security', range: [16,24] as const },
  { number: '04', title: 'EL VERDADERO RENDIMIENTO', subtitle: 'CPU, memoria, latencia y optimización comprobada', image: 'performance', range: [24,32] as const },
  { number: '05', title: 'TOMÁ EL CONTROL', subtitle: 'Registro, reparación, PowerShell y recuperación', image: 'repair', range: [32,40] as const },
] as const;

export type EvoWindows40Article = {
  number: number;
  originalId: number;
  title: string;
  originalTitle: string;
  block: number;
  published: boolean;
};

export const EVO_WINDOWS_40_ARTICLES: EvoWindows40Article[] = EVO_WINDOWS_40_IDS.map((originalId, i) => ({
  number: i + 1,
  originalId,
  title: EVO_WINDOWS_40_HEADLINES[i],
  originalTitle: EVO_MAGAZINE_200_TITLES[originalId - 1],
  block: Math.floor(i / 8) + 1,
  // No publicar como desarrollado lo que todavía es una guía inicial.
  published: i === 0,
}));

export const EVO_WINDOWS_40_EDITORIAL_POLICY = {
  plannedInvestigations: 40,
  originalTitlesPreserved: 200,
  minNarrativeQuality: 'Teoría contrastada, arquitectura del sistema, método de medición, experimentos de solo lectura, datos de ejemplo rotulados, hipótesis alternativas, resultados reproducibles y fuentes.',
  neverFabricate: 'No presentar diagramas, ejemplos o escenarios ficticios como telemetría del lector.',
} as const;
