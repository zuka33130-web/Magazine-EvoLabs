/**
 * EVO LABS / 50 descubrimientos verificables de Windows 11.
 * Texto editorial y código de consultas: nunca se ejecutan desde la web.
 * Las imágenes de pantalla, mediciones y resultados sólo pueden provenir
 * de capturas reales aportadas por el lector, nunca de ejemplos fabricados.
 */
export type EvoWindowsFieldLab = {
  number: number;
  discovery: string;  // Hallazgo real que justifica el título
  mechanism: string;  // Mecanismo del sistema, no eslogan
  preparation: string; // Estado inicial / permisos / qué anotar
  experiment: readonly string[]; // Pasos manuales del laboratorio
  command: string;  // PowerShell 5.1 o comando nativo, no ejecutado por la app
  evidence: string;  // Cómo reconocer el resultado real
  pitfall: string;   // Falsos positivos y atribuciones no justificadas
  action: string;    // Decisión útil, condicionada a observación
  recovery: string;  // Reversión o indicación de que no se altera el sistema
  challenge: string; // Un caso práctico a resolver
  references: readonly {name:string;url:string}[];
  reviewStatus: 'lab-verificable'; // No se confunde con capítulo editorial certificado
};
export const wiki=(path:string)=>'https://learn.microsoft.com/en-us/'+path;
export const support=(path:string)=>'https://support.microsoft.com/en-us/windows/'+path;
export const ref=(name:string,url:string)=>({name,url});
