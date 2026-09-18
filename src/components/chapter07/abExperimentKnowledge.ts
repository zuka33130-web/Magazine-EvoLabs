import {
  AbExperimentObjective,
  AbMetricDefinition,
  AbMetricSnapshot,
  AbMetricDelta,
  AbLaboratoryReport,
  UserPcSpec,
  Tome01DossierSummary,
} from '../../types';

export interface ObjectivePreset {
  id: AbExperimentObjective;
  title: string;
  shortDesc: string;
  defaultMetrics: string[];
  exampleHypothesis: string;
  exampleConditions: string;
  exampleVariable: string;
  exampleA: string;
  exampleB: string;
  specialGuideTitle?: string;
  specialGuideText?: string;
}

export const OBJECTIVE_PRESETS: ObjectivePreset[] = [
  {
    id: 'MEJORAR_ESTABILIDAD_FPS',
    title: 'MEJORAR ESTABILIDAD DE FPS',
    shortDesc: 'Alinear frametime y elevar el 1% Low evitando caídas bruscas.',
    defaultMetrics: ['fpsAvg', 'onePctLow', 'frametimeAvg', 'frametimeMax'],
    exampleHypothesis: 'Creo que limitar los FPS a la tasa de refresco (o usar un cap estable) reducirá los picos de frametime y elevará el 1% Low.',
    exampleConditions: 'Mismo mapa, misma partida o recorrido de prueba, misma resolución y calidad gráfica.',
    exampleVariable: 'FPS Cap en motor del juego o panel del controlador.',
    exampleA: 'FPS sin límite (unlocked).',
    exampleB: 'FPS limitados a 144 FPS estables.',
    specialGuideTitle: 'EXPERIMENTO EVO // ESTABILIDAD & CARGA',
    specialGuideText: 'Más FPS máximos no siempre significan mejor experiencia. Si el frametime fluctúa constantemente entre 5 ms y 35 ms, el juego se sentirá entrecortado aunque el contador diga 200 FPS.',
  },
  {
    id: 'REDUCIR_STUTTERING',
    title: 'REDUCIR STUTTERING',
    shortDesc: 'Eliminar micro-tirones y congelamientos puntuales al jugar o trabajar.',
    defaultMetrics: ['onePctLow', 'frametimeMax', 'frametimeAvg', 'ramUsedGb'],
    exampleHypothesis: 'Creo que cerrar el navegador con pestañas pesadas antes de jugar evitará que el juego acceda al archivo de paginación y elimine los tirones.',
    exampleConditions: 'Mismo escenario de juego exigente donde solían ocurrir los micro-tirones.',
    exampleVariable: 'Navegador web cerrado vs abierto en segundo plano.',
    exampleA: 'Juego corriendo con 15 pestañas de Chrome/Discord en segundo plano.',
    exampleB: 'Juego corriendo únicamente con el cliente del juego abierto.',
    specialGuideTitle: 'EXPERIMENTO EVO // ANÁLISIS DE INTERRUPCIONES',
    specialGuideText: 'El micro-stuttering suele responder a falta de RAM holgada, contención de disco o hilos en segundo plano interrumpiendo el render. No toques la calidad gráfica hasta aislar la causa real.',
  },
  {
    id: 'REDUCIR_CONSUMO_RAM',
    title: 'REDUCIR CONSUMO DE RAM',
    shortDesc: 'Medir el impacto de servicios, launchers o aplicaciones en reposo.',
    defaultMetrics: ['ramUsedGb', 'processesCount', 'cpuPct'],
    exampleHypothesis: 'Creo que deshabilitar launchers secundarios del inicio reducirá el uso de memoria en reposo en más de 800 MB.',
    exampleConditions: 'PC encendida hace 5 minutos, en reposo en el escritorio, sin programas de usuario abiertos.',
    exampleVariable: 'Launchers en inicio de Windows.',
    exampleA: 'Inicio normal con Steam, Epic, Discord y Spotify cargando con Windows.',
    exampleB: 'Inicio limpio con dichos programas configurados en inicio manual.',
    specialGuideTitle: 'EXPERIMENTO EVO // REGLA DE RAM',
    specialGuideText: 'Importante: RAM libre por sí sola NO demuestra una mejora de rendimiento. Windows cachea memoria intencionalmente para agilizar aperturas. Lo que buscamos es evitar contención cuando una tarea pesada la necesita.',
  },
  {
    id: 'REDUCIR_ACTIVIDAD_REPOSO',
    title: 'REDUCIR ACTIVIDAD EN REPOSO',
    shortDesc: 'Investigar procesos y telemetría de fondo que consumen ciclos de CPU y disco.',
    defaultMetrics: ['cpuPct', 'diskPct', 'processesCount', 'ramUsedGb'],
    exampleHypothesis: 'Creo que pausar la sincronización continua de almacenamiento en la nube bajará el uso de disco del 80% a menos del 5% en reposo.',
    exampleConditions: 'Escritorio de Windows en reposo durante 3 minutos continuos.',
    exampleVariable: 'Sincronización en segundo plano (OneDrive / Google Drive / etc.).',
    exampleA: 'Cliente de sincronización activo indexando carpetas.',
    exampleB: 'Cliente pausado o cerrado.',
    specialGuideTitle: 'EXPERIMENTO EVO // WINDOWS EN MOVIMIENTO',
    specialGuideText: 'Conectar con lo aprendido en el Capítulo 05: no asumas que "menos procesos" significa automáticamente mejor PC. Muchos procesos son hilos inactivos de seguridad esenciales.',
  },
  {
    id: 'MEJORAR_TIEMPO_RESPUESTA',
    title: 'MEJORAR TIEMPO DE RESPUESTA',
    shortDesc: 'Evaluar latencia de entrada o tiempo de apertura de aplicaciones.',
    defaultMetrics: ['latencyMs', 'frametimeAvg', 'frametimeMax', 'cpuPct'],
    exampleHypothesis: 'Creo que activar el modo de baja latencia o desactivar V-Sync con triple buffer reducirá la sensación de arrastre del ratón.',
    exampleConditions: 'Mismo juego o prueba de puntería en condiciones idénticas de tasa de cuadros.',
    exampleVariable: 'Ajuste de sincronización vertical o reflex/low-latency.',
    exampleA: 'V-Sync activado por defecto a 60 Hz.',
    exampleB: 'V-Sync desactivado con limitador de cuadros fijado.',
  },
  {
    id: 'COMPARAR_DOS_CONFIGURACIONES',
    title: 'COMPARAR DOS CONFIGURACIONES',
    shortDesc: 'Enfrentar dos ajustes específicos para medir si la diferencia es real o imperceptible.',
    defaultMetrics: ['fpsAvg', 'onePctLow', 'tempC', 'gpuPct'],
    exampleHypothesis: 'Creo que bajar la calidad de Sombras de Ultra a Media duplicará el 1% Low sin alterar la nitidez visible del juego.',
    exampleConditions: 'Mismo benchmark integrado o misma escena estática bajo carga.',
    exampleVariable: 'Calidad de sombras (Ultra vs Media).',
    exampleA: 'Preset con sombras en Ultra.',
    exampleB: 'Preset con sombras en Media (todas las demás opciones idénticas).',
  },
  {
    id: 'INVESTIGAR_LIMITACION',
    title: 'INVESTIGAR UNA LIMITACIÓN',
    shortDesc: 'Comprobar si una reducción de carga gráfica escala los cuadros (prueba de cuello de botella).',
    defaultMetrics: ['fpsAvg', 'onePctLow', 'gpuPct', 'cpuPct'],
    exampleHypothesis: 'Creo que si reduzco la resolución de 1080p a 720p, los FPS NO aumentarán porque el procesador ya está al 100% de uso.',
    exampleConditions: 'Mismo juego y misma zona densa de mapa con muchos jugadores.',
    exampleVariable: 'Resolución de renderizado (1920×1080 vs 1280×720).',
    exampleA: 'Resolución 1920×1080 (100% render scale).',
    exampleB: 'Resolución 1280×720 (o 67% render scale).',
    specialGuideTitle: 'EXPERIMENTO EVO // RESOLUCIÓN VS RENDIMIENTO (CAPÍTULO 04)',
    specialGuideText: 'Si al bajar de 1080p a 720p tus FPS promedio apenas se mueven y el 1% Low sigue estancado, acabás de demostrar empíricamente que tu limitación actual es la CPU o la memoria, no la GPU.',
  },
  {
    id: 'OTRO',
    title: 'OTRO EXPERIMENTO PERSONALIZADO',
    shortDesc: 'Diseñá tu propia prueba de laboratorio con hipótesis y variables libres.',
    defaultMetrics: ['fpsAvg', 'ramUsedGb', 'cpuPct'],
    exampleHypothesis: 'Escribí qué esperás observar al realizar tu modificación específica.',
    exampleConditions: 'Definí las condiciones que mantendrás idénticas en ambas pruebas.',
    exampleVariable: 'Definí qué única variable vas a alterar.',
    exampleA: 'Estado antes del cambio.',
    exampleB: 'Estado tras el cambio.',
  },
];

export const AVAILABLE_METRICS: AbMetricDefinition[] = [
  {
    key: 'fpsAvg',
    label: 'FPS Promedio (AVG)',
    unit: 'FPS',
    higherIsBetter: true,
    category: 'FPS',
    placeholder: 'ej. 160',
    description: 'Tasa promedio de cuadros por segundo durante la prueba.',
  },
  {
    key: 'onePctLow',
    label: '1% Low FPS',
    unit: 'FPS',
    higherIsBetter: true,
    category: 'FPS',
    placeholder: 'ej. 90',
    description: 'Promedio del 1% de los cuadros más lentos. Mide la verdadera fluidez y consistencia.',
  },
  {
    key: 'frametimeAvg',
    label: 'Frametime Promedio',
    unit: 'ms',
    higherIsBetter: false,
    category: 'FPS',
    placeholder: 'ej. 6.9',
    description: 'Tiempo promedio que tarda la máquina en renderizar y entregar cada cuadro.',
  },
  {
    key: 'frametimeMax',
    label: 'Frametime Máximo (Pico)',
    unit: 'ms',
    higherIsBetter: false,
    category: 'FPS',
    placeholder: 'ej. 34.2',
    description: 'El peor cuadro registrado. Revela tirones perceptibles en pantalla.',
  },
  {
    key: 'ramUsedGb',
    label: 'RAM Utilizada',
    unit: 'GB',
    higherIsBetter: false,
    category: 'RAM',
    placeholder: 'ej. 7.4',
    description: 'Cantidad de memoria de trabajo en uso por el sistema y las aplicaciones.',
  },
  {
    key: 'cpuPct',
    label: 'Uso de CPU',
    unit: '%',
    higherIsBetter: false,
    category: 'WINDOWS',
    placeholder: 'ej. 45',
    description: 'Porcentaje global de procesamiento consumido por el procesador.',
  },
  {
    key: 'gpuPct',
    label: 'Uso de GPU',
    unit: '%',
    higherIsBetter: true, // In gaming, high GPU usage shows it is utilized
    category: 'FPS',
    placeholder: 'ej. 97',
    description: 'Carga de trabajo del chip gráfico dedicado.',
  },
  {
    key: 'diskPct',
    label: 'Actividad de Disco',
    unit: '%',
    higherIsBetter: false,
    category: 'WINDOWS',
    placeholder: 'ej. 8',
    description: 'Porcentaje de tiempo que la unidad de almacenamiento está respondiendo peticiones.',
  },
  {
    key: 'processesCount',
    label: 'Cantidad de Procesos',
    unit: 'proc',
    higherIsBetter: false,
    category: 'WINDOWS',
    placeholder: 'ej. 165',
    description: 'Número total de procesos ejecutándose en segundo y primer plano.',
  },
  {
    key: 'tempC',
    label: 'Temperatura Máxima',
    unit: '°C',
    higherIsBetter: false,
    category: 'GENERAL',
    placeholder: 'ej. 73',
    description: 'Pico térmico alcanzado por el componente más caliente durante la prueba.',
  },
  {
    key: 'bootTimeSec',
    label: 'Tiempo de Arranque',
    unit: 's',
    higherIsBetter: false,
    category: 'WINDOWS',
    placeholder: 'ej. 18.5',
    description: 'Segundos desde el encendido hasta el escritorio interactivo.',
  },
  {
    key: 'latencyMs',
    label: 'Latencia de Entrada',
    unit: 'ms',
    higherIsBetter: false,
    category: 'GENERAL',
    placeholder: 'ej. 14.0',
    description: 'Tiempo de respuesta del sistema ante comandos de periféricos.',
  },
];

/**
 * Mathematical delta calculation for real measurements
 */
export function calculateMetricDeltas(
  metricsA: AbMetricSnapshot,
  metricsB: AbMetricSnapshot,
  metricDefs: AbMetricDefinition[]
): AbMetricDelta[] {
  const deltas: AbMetricDelta[] = [];

  for (const def of metricDefs) {
    const valA = metricsA[def.key];
    const valB = metricsB[def.key];

    // Only compute if BOTH values were genuinely recorded by the user
    if (valA !== null && valA !== undefined && !isNaN(valA) &&
        valB !== null && valB !== undefined && !isNaN(valB)) {
      const diff = Number((valB - valA).toFixed(2));
      let pct: number | null = null;
      if (valA !== 0) {
        pct = Number(((diff / Math.abs(valA)) * 100).toFixed(1));
      }

      // Evaluate whether change is an improvement
      let evaluation: 'MEJORÓ' | 'EMPEORÓ' | 'IGUAL' = 'IGUAL';
      if (Math.abs(diff) > 0.001) {
        if (def.higherIsBetter) {
          evaluation = diff > 0 ? 'MEJORÓ' : 'EMPEORÓ';
        } else {
          evaluation = diff < 0 ? 'MEJORÓ' : 'EMPEORÓ';
        }
      }

      deltas.push({
        key: def.key,
        label: def.label,
        unit: def.unit,
        valueA: valA,
        valueB: valB,
        deltaAbsolute: diff,
        deltaPercent: pct,
        higherIsBetter: def.higherIsBetter,
        evaluation,
      });
    }
  }

  return deltas;
}

/**
 * Text Report Generator for INFORME DE LABORATORIO EVO 001
 */
export function generateLaboratoryReportTxt(report: AbLaboratoryReport): string {
  const lines: string[] = [
    '======================================================================',
    'EVO LABS // INFORME DE LABORATORIO EVO 001',
    'SISTEMA CENTRAL: EXPERIMENTACIÓN CONTROLADA A/B',
    'TOMO 01 // CAPÍTULO 07: LABORATORIO FINAL',
    '======================================================================',
    `ID EXPERIMENTO:       ${report.id}`,
    `FECHA DE CREACIÓN:    ${report.createdAt}`,
    `FECHA DE CIERRE:      ${report.completedAt || new Date().toLocaleString('es-AR')}`,
    `ESTADO:               ${report.completed ? 'COMPLETADO Y AUDITADO' : 'EN CURSO'}`,
    '----------------------------------------------------------------------',
    '1. HARDWARE DE ENSAYO (PASAPORTE EVO)',
    '----------------------------------------------------------------------',
    `CPU:             ${report.hardware.cpu || 'No registrada'}`,
    `RAM:             ${report.hardware.ram || 'No registrada'}`,
    `GPU:             ${report.hardware.gpu || 'No registrada'}`,
    `ALMACENAMIENTO:  ${report.hardware.storage || 'No registrado'}`,
    '----------------------------------------------------------------------',
    '2. OBJETIVO DEL ENSAYO',
    '----------------------------------------------------------------------',
    `OBJETIVO:        ${report.objectiveCustomText || report.objective}`,
    '----------------------------------------------------------------------',
    '3. HIPÓTESIS DEL USUARIO (QUÉ SE ESPERABA ANTES DE MEDIR)',
    '----------------------------------------------------------------------',
    `“${report.userHypothesis}”`,
    '',
    'REGLA FUNDAMENTAL EVO: UNA HIPÓTESIS NO ES UNA CONCLUSIÓN.',
    'Se formula para ser probada empíricamente, no para autoconvencerse.',
    '----------------------------------------------------------------------',
    '4. CONDICIONES CONTROLADAS DEL ENSAYO',
    '----------------------------------------------------------------------',
    `APLICACIÓN/JUEGO:   ${report.conditions.gameOrApp || 'No especificada'}`,
    `RESOLUCIÓN:         ${report.conditions.resolution || 'Misma condición'}`,
    `CALIDAD GRÁFICA:    ${report.conditions.quality || 'Misma condición'}`,
    `FPS CAP / V-SYNC:   ${report.conditions.fpsCap || 'Idéntico'} / ${report.conditions.vsync || 'Idéntico'}`,
    `ESCENARIO / MAPA:   ${report.conditions.sceneOrMap || 'Mismo escenario'}`,
    `DURACIÓN DEL TEST:  ${report.conditions.duration || 'Idéntica duración'}`,
    `CONDICIÓN DE CARGA: ${report.conditions.loadCondition || 'Idéntica carga'}`,
    `PROGRAMAS ABIERTOS: ${report.conditions.openPrograms || 'Idénticos'}`,
    `ESTADO DE WINDOWS:  ${report.conditions.windowsState || 'Idéntico'}`,
    report.conditions.notes ? `NOTAS ADICIONALES:  ${report.conditions.notes}` : '',
    '----------------------------------------------------------------------',
    '5. VARIABLE CONTROLADA MODIFICADA (UNA SOLA VARIABLE)',
    '----------------------------------------------------------------------',
    `VARIABLE:            ${report.controlledVariable.customName || report.controlledVariable.variableType}`,
    `ESTADO ANTES (A):    ${report.controlledVariable.beforeState}`,
    `CAMBIO APLICADO (B): ${report.controlledVariable.changeApplied}`,
    `REVERSIBLE:          ${report.controlledVariable.reversible ? 'SÍ' : 'NO'}`,
    `CÓMO VOLVER ATRÁS:   ${report.controlledVariable.howToRevert}`,
    report.isReverted ? 'ESTADO TRAS EL TEST: EL USUARIO REVIRTIÓ EL CAMBIO.' : '',
    '----------------------------------------------------------------------',
    '6. MEDICIÓN A (LÍNEA BASE) VS MEDICIÓN B (DESPUÉS DEL CAMBIO)',
    '----------------------------------------------------------------------',
  ];

  if (report.deltas.length === 0) {
    lines.push('No se registraron pares de métricas comparables.');
  } else {
    report.deltas.forEach((d) => {
      const sign = d.deltaAbsolute > 0 ? '+' : '';
      const pctStr = d.deltaPercent !== null ? ` (${d.deltaPercent > 0 ? '+' : ''}${d.deltaPercent}%)` : '';
      lines.push(
        `${d.label.padEnd(26)} A: ${String(d.valueA).padEnd(8)} → B: ${String(d.valueB).padEnd(8)} DELTA: ${sign}${d.deltaAbsolute} ${d.unit}${pctStr} [${d.evaluation}]`
      );
    });
  }

  lines.push('');
  lines.push('----------------------------------------------------------------------');
  lines.push('7. PERCEPCIÓN SUBJETIVA (SEPARADA DE LA TELEMETRÍA)');
  lines.push('----------------------------------------------------------------------');
  lines.push(`ESTADO A:  ${report.perceptionA || 'Sin registro perceptual'}`);
  lines.push(`ESTADO B:  ${report.perceptionB || 'Sin registro perceptual'}`);

  lines.push('');
  lines.push('----------------------------------------------------------------------');
  lines.push('8. INTERPRETACIÓN TÉCNICA MULTIDIMENSIONAL');
  lines.push('----------------------------------------------------------------------');
  lines.push(`LO QUE CAMBIÓ:           ${report.interpretation.whatChanged || 'No registrado'}`);
  lines.push(`LO QUE NO CAMBIÓ:        ${report.interpretation.whatDidNotChange || 'No registrado'}`);
  lines.push(`LO QUE AÚN NO SABEMOS:   ${report.interpretation.whatWeStillDoNotKnow || 'No registrado'}`);

  lines.push('');
  lines.push('----------------------------------------------------------------------');
  lines.push('9. CONCLUSIÓN Y DECISIÓN FINAL DEL OPERADOR');
  lines.push('----------------------------------------------------------------------');
  lines.push(`RESULTADO DEL ENSAYO:    ${report.outcomeResult}`);
  lines.push(`DECISIÓN TOMADA:         ${report.userDecision}`);
  lines.push(`CONCLUSIÓN DEL USUARIO:  “${report.userConclusion}”`);
  lines.push('');
  lines.push('======================================================================');
  lines.push('EVO LABS // CIENCIA APLICADA A TU HARDWARE');
  lines.push('No asumimos ni creemos rumores. Medimos antes y después.');
  lines.push('======================================================================');

  return lines.filter((l) => l !== undefined).join('\n');
}

/**
 * JSON Report Generator
 */
export function generateLaboratoryReportJson(report: AbLaboratoryReport): string {
  return JSON.stringify(
    {
      schema: 'EVO_LABORATORY_REPORT_SCHEMA_V1',
      generatedAt: new Date().toISOString(),
      report,
    },
    null,
    2
  );
}

/**
 * Generates the full consolidated dossier for TOMO 01 in TXT
 */
export function generateTome01ConsolidatedDossierTxt(
  summary: Tome01DossierSummary,
  specs: Partial<UserPcSpec>,
  labReport?: AbLaboratoryReport | null
): string {
  const lines: string[] = [
    '======================================================================',
    'EVO LABS // DOSSIER OFICIAL TOMO 01 // CONOCÉ TU PC',
    'PUBLICACIÓN TÉCNICA EDITORIAL DE ARQUITECTURA DE COMPUTADORAS',
    '======================================================================',
    `FECHA DE EMISIÓN:  ${new Date().toLocaleString('es-AR')}`,
    'ESTADO DEL TOMO:   TOMO 01 COMPLETADO ✓',
    '======================================================================',
    'ÍNDICE DE ARTEFACTOS GENERADOS CON TU PROPIA MÁQUINA:',
    '======================================================================',
    `[${summary.passport ? '✓ COMPLETADO' : '○ PENDIENTE'}] PASAPORTE EVO (C01)              - Identificación de componentes`,
    `[${summary.flowMap ? '✓ COMPLETADO' : '○ PENDIENTE'}] MAPA DE FLUJO EVO 001 (C02)        - Cómo viajan los datos en reposo y carga`,
    `[${summary.fluidezProfile ? '✓ COMPLETADO' : '○ PENDIENTE'}] PERFIL DE FLUIDEZ EVO 001 (C03)     - FPS vs Frametime y 1% Low`,
    `[${summary.limitMatrix ? '✓ COMPLETADO' : '○ PENDIENTE'}] MATRIZ DE LIMITACIÓN EVO 001 (C04)   - Detección del componente limitante`,
    `[${summary.activityMap ? '✓ COMPLETADO' : '○ PENDIENTE'}] MAPA DE ACTIVIDAD EVO 001 (C05)     - Procesos, servicios y Windows en reposo`,
    `[${summary.optimizationLog ? '✓ COMPLETADO' : '○ PENDIENTE'}] REGISTRO DE OPTIMIZACIÓN 001 (C05) - Primera intervención de software`,
    `[${summary.diagnosticCase ? '✓ COMPLETADO' : '○ PENDIENTE'}] EXPEDIENTE DE DIAGNÓSTICO (C06)     - Aislamiento metódico de fallas`,
    `[${summary.labReport ? '✓ COMPLETADO' : '○ PENDIENTE'}] INFORME DE LABORATORIO A/B (C07)   - Demostración científica con evidencia`,
    '======================================================================',
    'RESUMEN TÉCNICO DE LA PC (PASAPORTE EVO):',
    '----------------------------------------------------------------------',
    `CPU:             ${specs.cpu || 'No registrada'}`,
    `RAM:             ${specs.ram || 'No registrada'}`,
    `GPU:             ${specs.gpu || 'No registrada'}`,
    `ALMACENAMIENTO:  ${specs.storage || 'No registrado'}`,
    '======================================================================',
    'CONCLUSIÓN DEL TOMO 01:',
    '“Empezaste identificando qué había dentro de tu máquina.',
    'Terminaste aprendiendo a investigarla.',
    'Ahora sabés observar, medir, formular hipótesis, realizar pruebas,',
    'comparar resultados y tomar decisiones basadas en evidencia.”',
    '======================================================================',
    'PRÓXIMO PASO: TOMO 02 // DOMINÁ WINDOWS (PRÓXIMAMENTE)',
    '======================================================================',
  ];

  if (labReport) {
    lines.push('');
    lines.push('----------------------------------------------------------------------');
    lines.push('ÚLTIMO EXPERIMENTO DE LABORATORIO (A/B) CONSOLIDADO:');
    lines.push(`OBJETIVO:        ${labReport.objectiveCustomText || labReport.objective}`);
    lines.push(`VARIABLE:        ${labReport.controlledVariable.customName || labReport.controlledVariable.variableType}`);
    lines.push(`RESULTADO:       ${labReport.outcomeResult}`);
    lines.push(`DECISIÓN:        ${labReport.userDecision}`);
    lines.push(`CONCLUSIÓN:      “${labReport.userConclusion}”`);
    lines.push('----------------------------------------------------------------------');
  }

  return lines.join('\n');
}
