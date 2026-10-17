// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 39: LABORATORIO FINAL
// "NO ME DIGAS QUE WINDOWS ESTÁ OPTIMIZADO. DEMOSTRALO."

export type RiskLevelSector39 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector39Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector39;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    queEs: string;
    paraQueSirve: string;
    quePasaSiFalta: string;
  };
  interactua: {
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
  };
  alertaEVO: {
    reversibilityRule: string;
    safetyWarning: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
  };
}

export interface Sector39MiniCase {
  id: string;
  code: string;
  title: string;
  scenario: string;
  userStatement: string;
  initialMistake: string;
  diagnosticQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  technicalVerdict: string;
  lessonLearned: string;
}

export interface Sector39TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
}

export const SECTOR_39_INVESTIGATIONS: Sector39Investigation[] = [
  {
    id: "inv-39-01",
    code: "39.01",
    title: "Fase 1: Captura de Baseline Métrico Inicial",
    subtitle: "Registro de telemetría de punto cero en reposo y bajo carga estándar",
    targetMechanism: "System Baselining & Counter Sampling",
    targetComponent: "typeperf / logman / Data Collector Sets",
    commandName: "logman create counter EVO_Baseline -c \"\\Processor(_Total)\\% Processor Time\" ...",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Si no mides el estado exacto de la máquina antes de tocarla, jamás podrás probar si tu intervención la mejoró, la empeoró o fue un simple efecto placebo.",
      mythVsTruth: {
        mentira: "Basta con mirar el Administrador de Tareas para tener una idea del rendimiento.",
        verdad: "El Administrador de Tareas promedia valores y no guarda un registro histórico reproducible para calcular deltas periciales.",
        comprobalo: "Toma una captura de 60 segundos con typeperf o logman: obtendrás una línea base matemática inmutable contra la cual comparar."
      }
    },
    entende: {
      queEs: "El registro formal e inmutable de los 4 subsistemas (CPU, RAM, Disco y Red) tomado bajo condiciones controladas de temperatura y carga.",
      paraQueSirve: "Establecer la verdad científica previa a cualquier modificación de software o hardware.",
      quePasaSiFalta: "Cualquier discusión sobre si la PC mejoró se convierte en un debate de sensaciones subjetivas ('yo la siento más rápida')."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor(_Total)\\% Processor Time\" \"\\Memory\\Available MBytes\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" -sc 10 -o baseline.csv",
      psExample: "Get-Counter '\\Processor(_Total)\\% Processor Time', '\\Memory\\Available MBytes', '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length' -SampleInterval 2 -MaxSamples 5 | Export-Counter -Path 'baseline.blg' -FileFormat BLG -Force",
      syntaxBreakdown: "Captura 10 muestras de rendimiento de los 3 subsistemas principales y las exporta a un archivo de datos estructurado.",
      whatToLookFor: "Valores promedio estables en reposo: CPU < 5%, Memoria disponible constante, Cola de disco < 0.1.",
      technicalMetrics: "Intervalo de muestreo: 1 segundo; duración mínima recomendada: 60 segundos."
    },
    alertaEVO: {
      reversibilityRule: "Operación de monitoreo pasivo de solo lectura.",
      safetyWarning: "Asegúrate de cerrar navegadores y descargas de fondo durante la captura para evitar ruido en el baseline."
    },
    evidenceBadge: {
      code: "EVO-LAB-3901",
      label: "Metric Baseline Capture"
    }
  },
  {
    id: "inv-39-02",
    code: "39.02",
    title: "Fase 2: Identificación de Cuello de Botella Primario",
    subtitle: "Aislamiento matemático del recurso restrictivo mediante la matriz de contadores",
    targetMechanism: "Theory of Constraints (TOC) & Primary Resource Saturation",
    targetComponent: "Performance Monitor / Resource Monitor / PDH Engine",
    commandName: "resmon.exe / perfmon.msc",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Todo sistema tiene un único cuello de botella limitante a la vez. Si optimizas la memoria RAM cuando el cuello de botella era el disco mecánico, la ganancia real será de exactamente 0.0%.",
      mythVsTruth: {
        mentira: "Una computadora lenta tiene múltiples problemas independientes que hay que atacar todos a la vez.",
        verdad: "La Teoría de Restricciones demuestra que el rendimiento total de un sistema está dictado exclusivamente por el componente más lento de la cadena.",
        comprobalo: "Compara el porcentaje de saturación de los 4 componentes: el que permanezca al 100% mientras los demás esperan es tu objetivo exclusivo."
      }
    },
    entende: {
      queEs: "Procedimiento pericial que descarta los componentes sanos y concentra el 100% del esfuerzo técnico en el subsistema saturado.",
      paraQueSirve: "Evitar perder tiempo y dinero cambiando componentes o tocando servicios que no tienen relación con el síntoma.",
      quePasaSiFalta: "El técnico prueba 10 'optimizaciones' distintas a la vez y no sabe cuál causó qué efecto."
    },
    interactua: {
      cliExample: "typeperf \"\\PhysicalDisk(_Total)\\% Disk Time\" \"\\Processor(_Total)\\% Processor Time\" -sc 5",
      psExample: "$c = Get-Counter '\\PhysicalDisk(_Total)\\% Disk Time', '\\Processor(_Total)\\% Processor Time'; $c.CounterSamples | Select-Object Path, CookedValue",
      syntaxBreakdown: "Evalúa simultáneamente la saturación de I/O frente a la saturación de cómputo.",
      whatToLookFor: "Disparidad extrema: un componente al 99-100% y el otro al 5-10%.",
      technicalMetrics: "Índice de saturación: recurso con más del 90% de ocupación durante la fase de carga."
    },
    alertaEVO: {
      reversibilityRule: "Diagnóstico pasivo sin alteraciones en el sistema.",
      safetyWarning: "No asumas que el cuello de botella es siempre hardware; un software mal diseñado puede saturar un procesador de 16 núcleos."
    },
    evidenceBadge: {
      code: "EVO-LAB-3902",
      label: "Bottleneck Isolation"
    }
  },
  {
    id: "inv-39-03",
    code: "39.03",
    title: "Fase 3: Formulación de Hipótesis Causal con Evidencia",
    subtitle: "Estructura formal: Síntoma → Mecanismo → Evidencia empírica → Causa propuesta",
    targetMechanism: "Scientific Diagnostic Method & Formal Hypothesis Formulation",
    targetComponent: "Expediente Pericial EVO / Documento de Hipótesis",
    commandName: "EVO-Hypothesis-Draft",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "En la ingeniería EVO está prohibido decir 'creo que es un virus'. Cada hipótesis debe redactarse con sujeto, predicado técnico, contador medido y causa propuesta.",
      mythVsTruth: {
        mentira: "La experiencia de un técnico se mide por su intuición o corazonadas.",
        verdad: "La verdadera maestría se demuestra cuando puedes formular una hipótesis falsable sustentada en números antes de tocar el sistema.",
        comprobalo: "Escribe tu hipótesis: 'El servicio SysMain satura el disco mecánico ST1000DM010 con lecturas de 45 MB/s generando una cola de 8.2 en el arranque'."
      }
    },
    entende: {
      queEs: "La declaración técnica formal que explica exactamente por qué ocurre el síntoma basándose en la evidencia física recolectada en la Fase 2.",
      paraQueSirve: "Validar que el técnico entiende la causa de raíz del problema antes de intervenir.",
      quePasaSiFalta: "Se aplican 'recetas mágicas' copiadas de foros de internet que rompen funciones del sistema."
    },
    interactua: {
      cliExample: "echo HIPOTESIS: Driver Realtek rt640x64.sys genera ISR > 1500us provocando DPC Watchdog > hipotesis.txt",
      psExample: "[PSCustomObject]@{ Id='HIP-001'; Sintoma='Audio cruje al mover mouse'; Contador='DPC Latency > 2200us'; Culpable='Driver WiFi 802.11ax con ahorro energetico activo' } | Format-List",
      syntaxBreakdown: "Estructura la hipótesis en una ficha pericial con campos validados.",
      whatToLookFor: "Coherencia entre el síntoma del usuario y el mecanismo de bajo nivel de Windows.",
      technicalMetrics: "Criterio de falsabilidad: una condición numérica clara que confirme o refute la hipótesis."
    },
    alertaEVO: {
      reversibilityRule: "La redacción de la hipótesis es un ejercicio intelectual y documental 100% seguro.",
      safetyWarning: "Si no tienes una métrica numérica que respalde tu hipótesis, vuelve a la Fase 1: no tienes una hipótesis, tienes una adivinanza."
    },
    evidenceBadge: {
      code: "EVO-LAB-3903",
      label: "Empirical Hypothesis Matrix"
    }
  },
  {
    id: "inv-39-04",
    code: "39.04",
    title: "Fase 4: Verificación de Dependencias y Riesgos",
    subtitle: "Mapeo de impacto colateral, servicios dependientes y plan de contingencia",
    targetMechanism: "Service & Component Dependency Tree Analysis",
    targetComponent: "sc qc / Get-Service -DependentServices / Registry ACLs",
    commandName: "sc enumdepend <nombre_servicio>",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Antes de desactivar cualquier servicio o modificar una clave, debes saber qué otros 5 componentes morirán en cadena si lo apagas.",
      mythVsTruth: {
        mentira: "Desactivar servicios innecesarios no tiene consecuencias.",
        verdad: "Muchos servicios tienen dependencias cruzadas en el Service Control Manager; apagar uno puede desactivar el audio, la red o el inicio de sesión.",
        comprobalo: "Corre `sc enumdepend [servicio]`: verás la lista de todos los subsistemas que colapsarán si tocas ese servicio."
      }
    },
    entende: {
      queEs: "Auditoría preventiva que evalúa el árbol genealógico de dependencias y el impacto colateral de la intervención propuesta.",
      paraQueSirve: "Prevenir desastres donde solucionar un problema genera dos problemas nuevos peores que el original.",
      quePasaSiFalta: "El usuario recupera 50 MB de memoria pero se queda sin poder imprimir ni conectarse a redes Wi-Fi."
    },
    interactua: {
      cliExample: "sc enumdepend LanmanWorkstation",
      psExample: "Get-Service LanmanWorkstation | Select-Object -ExpandProperty DependentServices | Select-Object Name, Status",
      syntaxBreakdown: "Lista todos los servicios que dependen del servicio especificado para funcionar.",
      whatToLookFor: "Servicios críticos en la lista de dependientes que puedan verse afectados.",
      technicalMetrics: "Índice de acoplamiento: número de dependientes directos e indirectos."
    },
    alertaEVO: {
      reversibilityRule: "Operación de inspección pasiva.",
      safetyWarning: "Si el servicio tiene más de 3 dependientes críticos del sistema operativo, aborta la desactivación y busca otra alternativa."
    },
    evidenceBadge: {
      code: "EVO-LAB-3904",
      label: "Risk & Dependency Assessment"
    }
  },
  {
    id: "inv-39-05",
    code: "39.05",
    title: "Fase 5: Aplicación de Intervención Única Controlada",
    subtitle: "Regla de oro EVO: Una sola variable modificada a la vez con punto de restauración",
    targetMechanism: "Single-Variable Intervention & VSS Snapshot",
    targetComponent: "Checkpoint-Computer / reg export / Single Action Execution",
    commandName: "Checkpoint-Computer -Description 'EVO-Fase5' ...",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Si cambias tres cosas al mismo tiempo y el sistema mejora, ¿cuál de las tres funcionó? Si empeora, ¿cuál lo rompió? Nunca sabrás la verdad si modificas más de una variable.",
      mythVsTruth: {
        mentira: "Es más rápido aplicar un paquete completo de 20 optimizaciones juntas.",
        verdad: "Modificar múltiples variables viola el método científico: convierte el diagnóstico en una lotería caótica e irreversible.",
        comprobalo: "Crea un punto de restauración, realiza una única modificación quirúrgica y avanza inmediatamente a la Fase 6."
      }
    },
    entende: {
      queEs: "La ejecución estricta y aislada de un único cambio técnico (un driver, un valor de registro o una configuración de servicio) precedido de un snapshot de rollback.",
      paraQueSirve: "Aislar con precisión absoluta la relación de causa y efecto entre tu acción y el comportamiento del sistema.",
      quePasaSiFalta: "Se pierde el control técnico del equipo y no se puede documentar qué arreglo solucionó el caso."
    },
    interactua: {
      cliExample: "reg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power\" \"C:\\backup_pwr.reg\" /y",
      psExample: "Checkpoint-Computer -Description 'EVO_Phase5_Change' -RestorePointType 'MODIFY_SETTINGS'",
      syntaxBreakdown: "Asegura el punto de restauración previo y documenta el cambio exacto a implementar.",
      whatToLookFor: "Confirmación de snapshot de VSS creado exitosamente con código de retorno 0.",
      technicalMetrics: "Tiempo de aplicación de la intervención: < 5 segundos."
    },
    alertaEVO: {
      reversibilityRule: "Cualquier intervención debe tener un script o archivo de reversión preparado ANTES de su ejecución.",
      safetyWarning: "No reinicies la máquina si el punto de restauración falló al crearse; resuelve primero el servicio VSS."
    },
    evidenceBadge: {
      code: "EVO-LAB-3905",
      label: "Single-Variable Intervention"
    }
  },
  {
    id: "inv-39-06",
    code: "39.06",
    title: "Fase 6: Segunda Medición Empírica bajo Carga",
    subtitle: "Repetición del test idéntico bajo las mismas condiciones exactas del baseline",
    targetMechanism: "Reproducible Performance Sampling & Load Replication",
    targetComponent: "typeperf / logman / Benchmark Suite",
    commandName: "typeperf ... -o post_intervention.csv",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Para que una medición sea científicamente válida, las condiciones deben ser exactamente iguales a las de la Fase 1: misma temperatura, mismos programas abiertos y misma duración.",
      mythVsTruth: {
        mentira: "Probar la computadora abriendo el navegador es suficiente para saber si quedó bien.",
        verdad: "El ser humano no puede percibir variaciones de 50 ms ni diferencias de latencia en microsegundos; solo los contadores numéricos dicen la verdad.",
        comprobalo: "Ejecuta exactamente el mismo comando de typeperf utilizado en la Fase 1 y guarda los resultados en `post_intervention.csv`."
      }
    },
    entende: {
      queEs: "La toma de la segunda muestra de telemetría aplicando los mismos estímulos y contadores que en la línea base inicial.",
      paraQueSirve: "Obtener el segundo juego de datos numéricos que permitirá calcular el impacto matemático real de tu intervención.",
      quePasaSiFalta: "Se confía en el testimonio subjetivo del usuario que casi siempre sufre de sesgo de confirmación."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor(_Total)\\% Processor Time\" \"\\Memory\\Available MBytes\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" -sc 10 -o post_intervention.csv",
      psExample: "Get-Counter '\\Processor(_Total)\\% Processor Time', '\\Memory\\Available MBytes', '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length' -SampleInterval 2 -MaxSamples 5 | Export-Counter -Path 'post.blg' -FileFormat BLG -Force",
      syntaxBreakdown: "Registra la segunda serie temporal idéntica para permitir la correlación cruzada de datos.",
      whatToLookFor: "Variación visible en los valores del contador que fue intervenido.",
      technicalMetrics: "Desviación estándar de las muestras post-intervención."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico de solo lectura.",
      safetyWarning: "Si el equipo sufrió un reinicio espontáneo durante la medición, descarta los datos y dirígete al protocolo de reversión (Fase 9)."
    },
    evidenceBadge: {
      code: "EVO-LAB-3906",
      label: "Post-Intervention Sampling"
    }
  },
  {
    id: "inv-39-07",
    code: "39.07",
    title: "Fase 7: Cálculo de Delta (Antes vs Después)",
    subtitle: "Comparación cuantitativa: Δ = Métrica_Post - Métrica_Pre y porcentaje de mejora",
    targetMechanism: "Mathematical Delta Calculation & Metric Comparison",
    targetComponent: "PowerShell Math Processing / CSV Diff Analysis",
    commandName: "EVO-Calculate-Delta",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El delta es el corazón de la Biblia Negra de Windows: el número frío e incontestable que demuestra si tu trabajo sirvió de algo o fue una pérdida de tiempo.",
      mythVsTruth: {
        mentira: "Si el cliente dice que la máquina anda volando, el trabajo fue un éxito.",
        verdad: "Si el delta de tiempo de arranque o de I/O marca 0%, la mejora es puramente psicológica; si el delta marca -45% de tiempo de espera, tienes una victoria probada.",
        comprobalo: "Calcula el delta: `((Valor_Post - Valor_Pre) / Valor_Pre) * 100`. Si la cola de disco bajó de 8.0 a 0.5, el delta es de -93.7% de saturación."
      }
    },
    entende: {
      queEs: "El procesamiento analítico que compara las series temporales de la Fase 1 contra la Fase 6 para obtener la diferencia porcentual neta.",
      paraQueSirve: "Proveer la evidencia matemática irrefutable que figurará en el informe pericial final entregado al cliente.",
      quePasaSiFalta: "No hay forma de auditar la efectividad real de los técnicos en un taller o departamento de IT corporativo."
    },
    interactua: {
      cliExample: "powershell -Command \"$pre = 8.2; $post = 0.4; Write-Host ('Delta de mejora: ' + [math]::Round((($pre - $post) / $pre) * 100, 2) + '%')\"",
      psExample: "$preAvg = 45.2; $postAvg = 12.1; [PSCustomObject]@{ Metrica='Tiempo de respuesta disco (ms)'; Pre=$preAvg; Post=$postAvg; Delta_Neto=($postAvg - $preAvg); Porcentaje_Mejora=\"$([math]::Round((($preAvg - $postAvg)/$preAvg)*100,1))%\" } | Format-Table",
      syntaxBreakdown: "Calcula el delta absoluto y porcentual entre dos valores de línea base y post-intervención.",
      whatToLookFor: "Deltas negativos en métricas de retardo/latencia/colas y deltas positivos en recursos libres (RAM, IOPS).",
      technicalMetrics: "Umbral de significancia estadística EVO: mejora > 15% para descartar variación aleatoria de fondo."
    },
    alertaEVO: {
      reversibilityRule: "Operación de cálculo matemático pasivo.",
      safetyWarning: "No descartes deltas negativos o nulos; un delta de 0% es información valiosa que te indica que la causa raíz está en otro lado."
    },
    evidenceBadge: {
      code: "EVO-LAB-3907",
      label: "Delta Calculation Matrix"
    }
  },
  {
    id: "inv-39-08",
    code: "39.08",
    title: "Fase 8: Veredicto Pericial (Éxito / Fallo / Placebo)",
    subtitle: "Clasificación formal del resultado: Éxito comprobado, Intervención inocua o Placebo",
    targetMechanism: "Evidence-Based Verdict Classification Framework",
    targetComponent: "Expediente Pericial / Taxonomía de Veredicto EVO",
    commandName: "EVO-Verdict-Evaluation",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La honestidad técnica es el activo más valioso de un ingeniero. Si la intervención no mejoró los números, se declara oficialmente como 'Placebo' o 'Inocua' y se retrocede.",
      mythVsTruth: {
        mentira: "Si una optimización no funcionó, hay que ocultárselo al cliente y cobrar igual.",
        verdad: "Un informe pericial honesto que demuestra qué se descartó con datos construye confianza indestructible y autoridad profesional incuestionable.",
        comprobalo: "Aplica la taxonomía: Si Delta > 15% = ÉXITO; si Delta entre -5% y +5% = PLACEBO/INOCUA; si Delta < -10% = DEGRADACIÓN."
      }
    },
    entende: {
      queEs: "La categorización formal del resultado del experimento técnico siguiendo criterios estrictos de significancia empírica.",
      paraQueSirve: "Tomar la decisión informada de conservar la modificación aplicada o activar el protocolo de reversión inmediata.",
      quePasaSiFalta: "Se acumulan decenas de supuestas optimizaciones que en realidad degradaron silenciosamente el sistema operativo."
    },
    interactua: {
      cliExample: "echo VEREDICTO: EXITO COMPROBADO. Delta de arranque reducido en 52% > veredicto.txt",
      psExample: "function Get-EVOVerdict ($deltaPct) { if ($deltaPct -ge 15) { 'ÉXITO COMPROBADO: Intervención efectiva con evidencia matemática.' } elseif ($deltaPct -le -10) { 'DEGRADACIÓN: La intervención perjudicó el rendimiento. Reversión obligatoria.' } else { 'PLACEBO / INOCUA: La intervención no produjo cambio apreciable. Revertir.' } }; Get-EVOVerdict 48.5",
      syntaxBreakdown: "Evalúa el porcentaje de delta frente a los umbrales de la taxonomía pericial EVO y emite el dictamen correspondiente.",
      whatToLookFor: "Clasificación formal en una de las 3 categorías estándar.",
      technicalMetrics: "Criterio de aprobación: Delta positivo > 15% con cero errores colaterales en el Visor de Eventos."
    },
    alertaEVO: {
      reversibilityRule: "La categorización no altera el sistema; define la conducta a seguir.",
      safetyWarning: "Si el veredicto es 'Degradación' o 'Placebo', la regla de oro de la Biblia Negra te obliga a pasar inmediatamente a la Fase 9: no dejes basura inocua en el sistema."
    },
    evidenceBadge: {
      code: "EVO-LAB-3908",
      label: "Forensic Verdict Classification"
    }
  },
  {
    id: "inv-39-09",
    code: "39.09",
    title: "Fase 9: Protocolo de Reversión ante Desviaciones",
    subtitle: "Rollback inmediato si el delta es nulo, negativo o genera inestabilidad colateral",
    targetMechanism: "Controlled State Rollback & VSS Restoration",
    targetComponent: "Restore-Computer / reg import / Service Restoration",
    commandName: "reg import backup.reg / Restore-Computer -RestorePoint <SequenceNumber>",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Revertir una intervención que no dio resultado no es un fracaso: es la aplicación más pura del rigor científico para mantener el sistema operativo limpio e impoluto.",
      mythVsTruth: {
        mentira: "Dejar una optimización aplicada que no hizo nada no le hace mal a nadie.",
        verdad: "Cada cambio de registro o servicio innecesario que dejas atrás añade deuda técnica y puede romper una actualización de Windows dentro de 6 meses.",
        comprobalo: "Si el veredicto fue Placebo o Fallo, restaura el archivo .reg de backup creado en la Fase 5: la máquina vuelve a su estado prístino en 1 segundo."
      }
    },
    entende: {
      queEs: "El procedimiento de limpieza y restauración del estado original garantizado mediante los respaldos atómicos generados en la Fase 5.",
      paraQueSirve: "Mantener el sistema operativo exactamente tan estable como al inicio, libre de residuos de experimentos fallidos.",
      quePasaSiFalta: "Windows termina con decenas de servicios apagados y configuraciones truncadas que causan fallos misteriosos a futuro."
    },
    interactua: {
      cliExample: "reg import C:\\backup_pwr.reg",
      psExample: "Get-ComputerRestorePoint | Select-Object SequenceNumber, Description, CreationTime | Format-Table",
      syntaxBreakdown: "Restaura la rama de registro anterior o identifica el número de secuencia de VSS para restaurar el sistema completo.",
      whatToLookFor: "Confirmación de restauración limpia del Registro o estado del servicio restablecido.",
      technicalMetrics: "Tiempo de rollback: < 2 segundos mediante importación de archivo .reg."
    },
    alertaEVO: {
      reversibilityRule: "La reversión devuelve el sistema al estado exacto previo a la intervención.",
      safetyWarning: "Verifica que el servicio o valor del registro volvió efectivamente a su configuración original antes de cerrar el caso."
    },
    evidenceBadge: {
      code: "EVO-LAB-3909",
      label: "Zero-Debt Rollback Protocol"
    }
  },
  {
    id: "inv-39-10",
    code: "39.10",
    title: "Fase 10: Emisión del Expediente Windows EVO 001",
    subtitle: "Generación del expediente técnico final pericial con hash criptográfico SHA-256",
    targetMechanism: "Cryptographic Hashing & Forensic Case File Documentation",
    targetComponent: "Expediente Windows EVO 001 / Get-FileHash SHA-256 / Audit Delivery",
    commandName: "Get-FileHash Expediente_EVO_001.txt -Algorithm SHA256",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El producto final de un profesional de la Biblia Negra de Windows no es una máquina que 'se siente rápida': es el Expediente Windows EVO 001, firmado criptográficamente con evidencia matemática completa.",
      mythVsTruth: {
        mentira: "Los técnicos solo cobran por arreglar cosas rotas.",
        verdad: "El perito cobra por diagnosticar, medir, documentar y certificar con rigor legal y científico el estado real de un activo informático.",
        comprobalo: "Tu herramienta compila las 10 fases en un documento final y le estampa un hash SHA-256: la prueba pericial queda sellada contra cualquier manipulación."
      }
    },
    entende: {
      queEs: "El artefacto documental cumbre del Tomo 02: el informe pericial estandarizado que consolida la línea base, la hipótesis, la intervención única, el delta matemático y el veredicto final.",
      paraQueSirve: "Demostrar a clientes, empresas o tribunales el resultado exacto, verificable y reproducible de una pericia técnica sobre Windows.",
      quePasaSiFalta: "El trabajo carece de respaldo formal y queda reducido al nivel de un servicio técnico informal sin valor agregado."
    },
    interactua: {
      cliExample: "certutil -hashfile Expediente_EVO_001.txt SHA256",
      psExample: "$exp = Get-FileHash -Path 'C:\\Expediente_Windows_EVO_001.txt' -Algorithm SHA256; [PSCustomObject]@{ Expediente='EVO-001'; Hash_SHA256=$exp.Hash; Sello='CERTIFICADO FORENSE EMITIDO' } | Format-List",
      syntaxBreakdown: "Calcula el hash criptográfico SHA-256 del archivo de expediente pericial para garantizar su integridad e inmutabilidad.",
      whatToLookFor: "Hash hexadecimal de 64 caracteres que sella el documento.",
      technicalMetrics: "Estándar FIPS 180-4 SHA-256; documento inmutable de entrega al cliente."
    },
    alertaEVO: {
      reversibilityRule: "Operación documental pasiva de máxima seguridad.",
      safetyWarning: "Guarda siempre una copia del expediente y su hash en tu archivo histórico de peritajes para futuras referencias o garantías."
    },
    evidenceBadge: {
      code: "EVO-LAB-3910",
      label: "Capstone Dossier Certified"
    }
  }
];

export const SECTOR_39_MINICASES: Sector39MiniCase[] = [
  {
    id: "case-39-01",
    code: "CASE-39.01",
    title: "La 'optimización' que aceleró los FPS pero destruyó la estabilidad del sistema",
    scenario: "Un taller técnico le cobró a un streamer por 'optimizar Windows para esports'. El técnico desactivó 35 servicios de Windows, deshabilitó el archivo de paginación (pagefile) y apagó Windows Defender. El cliente jugó 30 minutos y notó 5 FPS más, pero al día siguiente el juego comenzó a cerrarse solo por falta de memoria (Crash to Desktop) y la cámara web dejó de funcionar por dependencias rotas en el SCM.",
    userStatement: "Me cobraron una fortuna por optimizarme la PC para jugar. Al principio parecía que andaba un poco más rápido pero ahora los juegos se cierran solos y no me anda la cámara para transmitir.",
    initialMistake: "Aplicar múltiples cambios destructivos a la vez sin medir deltas, sin verificar dependencias y sin crear un punto de reversión.",
    diagnosticQuestion: "¿Qué principio fundamental de la metodología EVO fue violado de manera más flagrante en este caso?",
    options: [
      {
        id: "opt-1",
        text: "No haber comprado una tarjeta de video más potente.",
        isCorrect: false,
        explanation: "El hardware del cliente era de gama alta; el fallo fue provocado íntegramente por modificaciones erróneas de software."
      },
      {
        id: "opt-2",
        text: "Violación de la Regla de Intervención Única (Fase 5) y falta de análisis de dependencias (Fase 4), destruyendo la estabilidad por una ganancia insignificante no comprobada.",
        isCorrect: true,
        explanation: "Al cambiar 35 variables a la vez sin medir el impacto individual, el técnico rompió el subsistema de memoria virtual y los servicios multimedia de Windows."
      },
      {
        id: "opt-3",
        text: "No haber formateado el disco en formato FAT32.",
        isCorrect: false,
        explanation: "FAT32 es un sistema de archivos obsoleto e inadecuado para Windows moderno."
      }
    ],
    technicalVerdict: "Se ejecutó el Protocolo de Reversión (Fase 9), restaurando los servicios a su estado predeterminado y reactivando el Pagefile administrado por el sistema. La estabilidad volvió al 100%, la webcam funcionó de inmediato y los FPS se mantuvieron constantes sin caídas.",
    lessonLearned: "Nunca sacrifiques la integridad estructural del sistema operativo por ganancias marginales o imperceptibles de rendimiento."
  },
  {
    id: "case-39-02",
    code: "CASE-39.02",
    title: "El efecto placebo del limpiador de memoria RAM en un servidor de base de datos",
    scenario: "Un administrador de sistemas instaló una utilidad que ejecutaba cada 10 minutos un 'vaciamiento de memoria RAM'. El administrador juraba que la base de datos funcionaba mejor porque el uso de memoria en el Administrador de Tareas bajaba del 85% al 20% tras cada limpieza. Sin embargo, las consultas de los usuarios comenzaron a tardar 4 veces más tiempo en responder.",
    userStatement: "Mire cómo baja la memoria de 28 GB a 6 GB cada vez que corre el optimizador. La máquina está mucho más liviana ahora.",
    initialMistake: "Evaluar el rendimiento basándose en una sensación visual subjetiva en lugar de medir el delta real de tiempo de respuesta de las consultas.",
    diagnosticQuestion: "¿Por qué el vaciamiento forzado de memoria RAM degradó el rendimiento real de las aplicaciones a pesar de que el número de memoria bajó?",
    options: [
      {
        id: "opt-1",
        text: "Porque la memoria RAM se desgasta físicamente si se vacía muy seguido.",
        isCorrect: false,
        explanation: "La memoria RAM es estática/dinámica volátil y no sufre degradación física por ciclos de lectura/escritura."
      },
      {
        id: "opt-2",
        text: "Porque al forzar el vaciado del Working Set, Windows expulsa la caché de datos activa al disco; la base de datos se ve obligada a leer todo de nuevo desde el almacenamiento lento, destruyendo el rendimiento.",
        isCorrect: true,
        explanation: "La memoria RAM libre es memoria desperdiciada. Windows y los motores SQL mantienen datos útiles en memoria caché para responder en nanosegundos en lugar de milisegundos."
      },
      {
        id: "opt-3",
        text: "Porque el optimizador consumía el 100% de la placa de video.",
        isCorrect: false,
        explanation: "Las utilidades de memoria no interactúan con el procesador gráfico."
      }
    ],
    technicalVerdict: "Se realizó una medición de línea base (Fase 1 y 6) con contadores PDH: las lecturas de disco habían aumentado un 600% por culpa del 'optimizador'. Se desinstaló la herramienta y el tiempo de respuesta de las consultas bajó de 1.8 segundos a 0.04 segundos (delta de -97.7% de latencia). Veredicto: Placebo perjudicial.",
    lessonLearned: "Un número más bajo en el Administrador de Tareas no significa mejor rendimiento. La telemetría y los deltas matemáticos son los únicos jueces de la verdad técnica."
  },
  {
    id: "case-39-03",
    code: "CASE-39.03",
    title: "La pericia técnica que salvó a una empresa de gastar $10.000 USD en hardware innecesario",
    scenario: "Una empresa de arquitectura reportó que sus 12 computadoras de diseño estaban 'obsoletas' porque tardaban hasta 3 minutos en abrir planos pesados en AutoCAD y Revit. La gerencia ya había aprobado un presupuesto de $10.000 dólares para comprar 12 computadoras nuevas con procesadores de última generación. Un perito formado en la Biblia Negra de Windows fue contratado para auditar los equipos antes de la compra.",
    userStatement: "Los arquitectos no pueden trabajar, cada archivo tarda una eternidad en cargar. Necesitamos cambiar todas las computadoras urgente.",
    initialMistake: "Asumir que la lentitud en la apertura de archivos es un problema de potencia de CPU o GPU sin hacer una captura de línea base métrica.",
    diagnosticQuestion: "¿Qué reveló la captura de línea base métrica (Fase 1 y 2) sobre la causa raíz del cuello de botella?",
    options: [
      {
        id: "opt-1",
        text: "Los procesadores Intel Core i7 estaban funcionando a su máxima capacidad y requerían actualización inmediata.",
        isCorrect: false,
        explanation: "La utilización de CPU durante la apertura de archivos promediaba apenas un 12%."
      },
      {
        id: "opt-2",
        text: "Las computadoras tenían discos mecánicos HDD de 5400 RPM como unidad de sistema, generando una cola de disco de 9.4 y saturación del 100% de I/O, mientras la CPU y RAM estaban prácticamente ociosas.",
        isCorrect: true,
        explanation: "El cuello de botella primario aislado fue exclusivamente la tasa de IOPS del almacenamiento mecánico en lecturas aleatorias de bloques pequeños."
      },
      {
        id: "opt-3",
        text: "El software AutoCAD requería Windows 7 para funcionar bien.",
        isCorrect: false,
        explanation: "AutoCAD moderno está diseñado específicamente para aprovechar la arquitectura de Windows 10 y 11."
      }
    ],
    technicalVerdict: "Se formuló la hipótesis (Fase 3), se clonó un equipo a un SSD NVMe como prueba piloto única (Fase 5) y se midió el delta (Fase 7): el tiempo de apertura del plano cayó de 184 segundos a 9.2 segundos (mejora comprobada del 95%). Se reemplazaron los 12 discos por una fracción ínfima del presupuesto y se emitió el Expediente Windows EVO 001 certificando el veredicto.",
    lessonLearned: "El método científico del Laboratorio Final de la Biblia Negra de Windows transforma problemas subjetivos en ahorros millonarios y prestigio profesional respaldado por la ciencia."
  }
];

export const SECTOR_39_TEST_BANK: Sector39TestQuestion[] = [
  {
    id: "q-39-01",
    questionNumber: 1,
    category: "Methodology & Baselining",
    question: "En la metodología pericial del Laboratorio Final, ¿cuál es el propósito mandatorio de capturar una 'Línea Base' (Baseline Métrico) en la Fase 1?",
    options: [
      { id: "A", text: "Para saber cuántos gigabytes de espacio libre quedan en el disco rígido." },
      { id: "B", text: "Para establecer un registro numérico inmutable y reproducible del rendimiento del sistema en reposo y carga antes de realizar cualquier intervención técnica." },
      { id: "C", text: "Para comprobar si la clave de producto de Windows es original." },
      { id: "D", text: "Para actualizar la lista de definiciones del antivirus." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El baseline métrico es el punto cero de referencia empírica indispensable. Sin un registro cuantitativo previo, resulta matemáticamente imposible calcular el delta de mejora o verificar si una intervención fue efectiva o un simple efecto placebo."
  },
  {
    id: "q-39-02",
    questionNumber: 2,
    category: "Scientific Method",
    question: "¿Por qué la Fase 5 exige aplicar estrictamente una 'Intervención Única Controlada' en lugar de múltiples cambios combinados?",
    options: [
      { id: "A", text: "Porque Windows no permite hacer dos cambios en la misma sesión." },
      { id: "B", text: "Porque modificar más de una variable a la vez destruye la relación de causa y efecto, impidiendo saber qué cambio produjo la mejora o provocó un fallo secundario." },
      { id: "C", text: "Porque se consumiría demasiada batería en la computadora portátil." },
      { id: "D", text: "Porque los antivirus bloquean las intervenciones múltiples." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El método científico exige el aislamiento de variables individuales. Si se modifican 3 configuraciones simultáneamente, se desconoce cuál de ellas fue responsable del resultado, violando el principio de reproducibilidad y determinismo de la ingeniería forense."
  },
  {
    id: "q-39-03",
    questionNumber: 3,
    category: "Quantitative Analysis",
    question: "¿Cómo se define y calcula matemáticamente el 'Delta' de rendimiento en la Fase 7?",
    options: [
      { id: "A", text: "Delta = (Horas de trabajo) * (Precio del servicio)." },
      { id: "B", text: "Delta = Cantidad de programas desinstalados." },
      { id: "C", text: "Delta = Diferencia cuantitativa entre la métrica post-intervención y la métrica de línea base previa (Δ = Métrica_Post - Métrica_Pre)." },
      { id: "D", text: "Delta = La temperatura ambiente dividida por la temperatura del procesador." }
    ],
    correctOptionId: "C",
    technicalExplanation: "El delta (Δ) es la variación matemática exacta entre el valor posterior a la intervención y el valor basal previo. Permite expresar en términos absolutos o porcentuales la reducción de latencia, el aumento de ancho de banda o la liberación de colas de espera."
  },
  {
    id: "q-39-04",
    questionNumber: 4,
    category: "Forensic Integrity",
    question: "Si tras aplicar una supuesta optimización de registro el delta de rendimiento medido en la Fase 7 se encuentra entre -2% y +2%, ¿cuál es la conducta técnica obligatoria según la Fase 8 y 9?",
    options: [
      { id: "A", text: "Dejar la optimización aplicada porque no parece hacer daño." },
      { id: "B", text: "Clasificar el veredicto como PLACEBO / INOCUA y activar inmediatamente el Protocolo de Reversión (Fase 9) para no dejar deuda técnica innecesaria en el sistema." },
      { id: "C", text: "Reiniciar la máquina 5 veces hasta que los números suban." },
      { id: "D", text: "Decirle al cliente que la máquina anda un 50% más rápido." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Una intervención con delta dentro del margen de error estadístico (±5%) es inocua o placebo. La regla pericial de la Biblia Negra de Windows exige revertir todo cambio que no demuestre una ventaja cuantificable probada para mantener el registro libre de deuda técnica."
  },
  {
    id: "q-39-05",
    questionNumber: 5,
    category: "Final Output Certification",
    question: "¿Cuál es el elemento pericial que confiere inmutabilidad y validez legal/técnica al 'Expediente Windows EVO 001' emitido en la Fase 10?",
    options: [
      { id: "A", text: "El tamaño del archivo en megabytes." },
      { id: "B", text: "La firma criptográfica mediante un hash irreversible SHA-256 generado sobre el archivo final de conclusiones y mediciones." },
      { id: "C", text: "La marca de agua con el logotipo de Windows." },
      { id: "D", text: "El color del texto en la consola de comandos." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El cálculo del hash SHA-256 (FIPS 180-4) genera una huella criptográfica de 256 bits única. Cualquier alteración posterior de un solo carácter en el informe alteraría por completo el hash, garantizando la inmutabilidad y autenticidad del expediente pericial ante cualquier auditoría."
  }
];
