// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 19: ENERGÍA
// EL MODO DE ENERGÍA "SECRETO": ¿MÁS POTENCIA O MÁS CALOR?

export type RiskLevelSector19 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector19Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector19;
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

export interface Sector19MiniCase {
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

export interface Sector19TestQuestion {
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
  relatedInvestigationCode: string;
}

export const SECTOR_19_INVESTIGATIONS: Sector19Investigation[] = [
  {
    "id": "inv-19-01",
    "code": "19.01",
    "title": "Balanced",
    "subtitle": "El plan equilibrado y la gestión dinámica de energía",
    "targetMechanism": "Windows Balanced Power Scheme & Dynamic P-State Switching",
    "targetComponent": "powrprof.dll / poprutil.dll",
    "commandName": "powercfg /getactivescheme",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Muchos cambian a \"Alto Rendimiento\" creyendo que \"Equilibrado\" hace que los juegos anden lentos; la realidad es todo lo contrario.",
      "mythVsTruth": {
        "mentira": "El plan Equilibrado no permite que el procesador alcance sus frecuencias de boost máximas.",
        "verdad": "Equilibrado utiliza Speed Shift / CPPC por hardware: eleva la frecuencia en microsegundos ante carga y baja a reposo al instante para evitar saturación térmica.",
        "comprobalo": "Ejecutá powercfg /getactivescheme y mirá el GUID 381b4222-f694-41f0-9685-ff5bb260df2e."
      }
    },
    "entende": {
      "queEs": "El esquema de energía estándar que modula voltajes, frecuencias y estados C/P de acuerdo a la demanda inmediata de la CPU.",
      "paraQueSirve": "Maximiza la eficiencia energética sin sacrificar el rendimiento mononúcleo en picos de demanda.",
      "quePasaSiFalta": "Si se elimina, Windows recurre a políticas agresivas que pueden elevar temperaturas innecesariamente."
    },
    "interactua": {
      "cliExample": "powercfg /getactivescheme",
      "psExample": "Get-CimInstance -Namespace root\\cimv2\\power -ClassName Win32_PowerPlan | Where-Object IsActive",
      "syntaxBreakdown": "Muestra el plan de energía actualmente activo en el sistema.",
      "whatToLookFor": "GUID 381b4222... con nombre (Equilibrado / Balanced).",
      "technicalMetrics": "Tiempo de respuesta a transiciones de frecuencia < 1 ms con Intel SST o AMD CPPC."
    },
    "alertaEVO": {
      "reversibilityRule": "powercfg /restoredefaultschemes recupera todos los planes de fábrica si fueron alterados.",
      "safetyWarning": "No fuerces frecuencias mínimas al 100% en portátiles para evitar degradación acelerada de la batería."
    },
    "evidenceBadge": {
      "code": "BALANCED-PLAN",
      "label": "Balanced Scheme"
    }
  },
  {
    "id": "inv-19-02",
    "code": "19.02",
    "title": "Power Saver",
    "subtitle": "Economizador: limitación intencional de TDP y clocks",
    "targetMechanism": "Processor Power Throttling & Core Frequency Clamping",
    "targetComponent": "powrprof.dll / kernel energy management",
    "commandName": "powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Tu batería está en 15% y necesitás terminar un reporte: Economizador recorta la frecuencia máxima del procesador a menos del 70%.",
      "mythVsTruth": {
        "mentira": "El plan Economizador solo baja el brillo de la pantalla unos puntos.",
        "verdad": "Fija el límite máximo de CPU al 50%-70%, deshabilita el turbo boost, suspende la indexación y activa Power Throttling en apps secundarias.",
        "comprobalo": "Abrí el Administrador de Tareas y observá cómo la velocidad del CPU se clava en su frecuencia base o menor."
      }
    },
    "entende": {
      "queEs": "Un perfil restrictivo diseñado para estirar la autonomía a costa de limitar la capacidad de cómputo máxima.",
      "paraQueSirve": "Garantiza supervivencia de la batería en emergencias sin acceso a cargador.",
      "quePasaSiFalta": "El equipo se apagará abruptamente por sobredemanda de energía en picos de consumo."
    },
    "interactua": {
      "cliExample": "powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a",
      "psExample": "Get-CimInstance -Namespace root\\cimv2\\power -ClassName Win32_PowerPlan",
      "syntaxBreakdown": "Activa el esquema Economizador por su GUID nativo.",
      "whatToLookFor": "Consumo del paquete del CPU (Package Power) reducido a menos de 10W.",
      "technicalMetrics": "Ahorro de hasta 40% de energía en cargas ligeras."
    },
    "alertaEVO": {
      "reversibilityRule": "powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e vuelve al plan Equilibrado.",
      "safetyWarning": "Nunca uses este plan para juegos o tareas de renderizado ya que producirá stuttering severo."
    },
    "evidenceBadge": {
      "code": "POWER-SAVER",
      "label": "Saver Scheme"
    }
  },
  {
    "id": "inv-19-03",
    "code": "19.03",
    "title": "High Performance",
    "subtitle": "Alto Rendimiento: eliminación de estados de bajo consumo",
    "targetMechanism": "Processor C-State Disable & Minimum Frequency 100%",
    "targetComponent": "powrprof.dll / poprutil.dll",
    "commandName": "powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Activás \"Alto Rendimiento\" y los ventiladores empiezan a zumbar de inmediato aunque la computadora esté sin hacer nada.",
      "mythVsTruth": {
        "mentira": "Alto Rendimiento hace que el procesador sea 20% más rápido en benchmarks pesados.",
        "verdad": "Mantiene los núcleos en su frecuencia base o turbo sin permitirles dormir (C-States), consumiendo más energía y generando calor residual.",
        "comprobalo": "Revisá la frecuencia del CPU en reposo: nunca baja de la frecuencia nominal."
      }
    },
    "entende": {
      "queEs": "Un perfil que deshabilita los mecanismos de ahorro de energía y fija el estado de rendimiento al 100% permanente.",
      "paraQueSirve": "Minimiza la latencia de conmutación de frecuencias en estaciones de audio digital (DAW) y control industrial.",
      "quePasaSiFalta": "En tareas normales no afecta negativamente; en laptops degrada la salud de la batería con rapidez."
    },
    "interactua": {
      "cliExample": "powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
      "psExample": "Get-CimInstance -Namespace root\\cimv2\\power -ClassName Win32_PowerPlan | Where-Object ElementName -like \"*Alto*\"",
      "syntaxBreakdown": "Aplica el perfil Alto Rendimiento tradicional de Windows.",
      "whatToLookFor": "Mínimo del procesador fijado en 100%.",
      "technicalMetrics": "Latencia DPC de transición de frecuencia reducida a 0 µs (frecuencia estática)."
    },
    "alertaEVO": {
      "reversibilityRule": "Revertir al plan Equilibrado permite a los núcleos enfriarse cuando no hay carga.",
      "safetyWarning": "En verano o con disipación deficiente, puede provocar thermal throttling antes que el plan Equilibrado."
    },
    "evidenceBadge": {
      "code": "HIGH-PERF",
      "label": "High Performance"
    }
  },
  {
    "id": "inv-19-04",
    "code": "19.04",
    "title": "Ultimate Performance",
    "subtitle": "Rendimiento Máximo: el plan oculto de Windows Pro for Workstations",
    "targetMechanism": "Ultimate Performance Power Scheme (Bypass Micro-Latencies)",
    "targetComponent": "powrprof.dll",
    "commandName": "powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Existe un comando mágico que desbloquea un plan de energía \"secreto\" exclusivo para servidores y workstations.",
      "mythVsTruth": {
        "mentira": "Rendimiento Máximo desbloquea núcleos ocultos del procesador y duplica la velocidad.",
        "verdad": "Deshabilita todas las técnicas de conservación de energía de buses PCIe, suspende el parkeo de núcleos y anula micro-latencias.",
        "comprobalo": "Ejecutá el comando duplicatescheme y mirá cómo aparece la opción en el Panel de Control clásico."
      }
    },
    "entende": {
      "queEs": "Un plan concebido para equipos de cómputo continuo sin restricciones de alimentación eléctrica.",
      "paraQueSirve": "Garantiza cero latencia en buses PCIe y procesamiento de datos en tiempo real.",
      "quePasaSiFalta": "Inapreciable para el usuario común; la ganancia en juegos frente a Equilibrado suele ser inferior al 1%."
    },
    "interactua": {
      "cliExample": "powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61",
      "psExample": "powercfg /list",
      "syntaxBreakdown": "Duplica el GUID del plan Ultimate Performance haciéndolo visible en la lista.",
      "whatToLookFor": "Esquema \"Rendimiento máximo\" añadido con éxito.",
      "technicalMetrics": "Core unparking al 100% permanente; PCIe Link State Power Management en Off."
    },
    "alertaEVO": {
      "reversibilityRule": "powercfg -delete <GUID> elimina el esquema creado sin consecuencias.",
      "safetyWarning": "No recomendado en laptops portátiles por el drenaje violento de batería."
    },
    "evidenceBadge": {
      "code": "ULTIMATE-PERF",
      "label": "Ultimate Scheme"
    }
  },
  {
    "id": "inv-19-05",
    "code": "19.05",
    "title": "Modos ocultos",
    "subtitle": "Desbloqueo de más de 30 configuraciones avanzadas en powercfg",
    "targetMechanism": "Power Settings Attributes & Registry Hidden Flags",
    "targetComponent": "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings",
    "commandName": "powercfg /attributes SUB_PROCESSOR <GUID> -ATTRIB_HIDE",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "En las opciones avanzadas de energía solo ves 4 cosas, pero Windows tiene más de 50 configuraciones ocultas por atributos de registro.",
      "mythVsTruth": {
        "mentira": "Windows eliminó la posibilidad de configurar el desaparcamiento de núcleos y el boost del CPU.",
        "verdad": "Microsoft simplemente ocultó las opciones asignando Attributes=1 en el Registro; cambiarlas a 2 las vuelve visibles en la interfaz.",
        "comprobalo": "Desocultá el \"Modo de aumento del rendimiento del procesador\" y regulá el comportamiento de Turbo Boost."
      }
    },
    "entende": {
      "queEs": "Las flags de visibilidad que determinan qué campos de powrprof se exponen en la ventana de propiedades de energía.",
      "paraQueSirve": "Permite ajustar agresividad de turbo boost, umbrales de parkeo de núcleos y suspensiones de USB.",
      "quePasaSiFalta": "Si no se desocultan, solo se pueden modificar mediante comandos crudos de powercfg."
    },
    "interactua": {
      "cliExample": "powercfg -attributes SUB_PROCESSOR be337238-0d82-4146-a960-4f3749d470c7 -ATTRIB_HIDE",
      "psExample": "Get-ChildItem \"HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\" -Recurse | Select-Object PSChildName",
      "syntaxBreakdown": "Remueve el atributo oculto del subgrupo de procesador para mostrar el modo de aumento de rendimiento.",
      "whatToLookFor": "Aparición del menú \"Modo de aumento del rendimiento del procesador\".",
      "technicalMetrics": "Posibilidad de apagar Turbo Boost bajando 15°C las temperaturas en laptops."
    },
    "alertaEVO": {
      "reversibilityRule": "Reemplazar -ATTRIB_HIDE por +ATTRIB_HIDE vuelve a ocultar la opción.",
      "safetyWarning": "Modificar umbrales sin entender la arquitectura puede generar inestabilidad en el scheduler."
    },
    "evidenceBadge": {
      "code": "HIDDEN-POWER",
      "label": "Power Flags"
    }
  },
  {
    "id": "inv-19-06",
    "code": "19.06",
    "title": "powercfg /list",
    "subtitle": "Enumeración completa de esquemas y sus identificadores GUID",
    "targetMechanism": "Power Scheme Database Enumeration",
    "targetComponent": "powrprof.dll / Registry Power Schemes",
    "commandName": "powercfg /list",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Alguien instaló un programa de optimización y ahora tenés 8 planes de energía duplicados con nombres extraños.",
      "mythVsTruth": {
        "mentira": "Los planes de energía se guardan en archivos sueltos en el disco.",
        "verdad": "Residen en el árbol de registro HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\User\\PowerSchemes indexados por GUID.",
        "comprobalo": "Ejecutá powercfg /list en la terminal para ver los GUIDs de todos los esquemas y cuál tiene el asterisco de activo (*)."
      }
    },
    "entende": {
      "queEs": "El comando de consulta que lista todos los perfiles de energía registrados en el sistema.",
      "paraQueSirve": "Permite obtener los identificadores GUID necesarios para automatizaciones y limpiezas por script.",
      "quePasaSiFalta": "Imposibilidad de cambiar perfiles de forma programática o remota."
    },
    "interactua": {
      "cliExample": "powercfg /list",
      "psExample": "powercfg /l",
      "syntaxBreakdown": "Lista todos los esquemas con su GUID y marca con un asterisco el esquema en uso.",
      "whatToLookFor": "El esquema con asterisco \"*\" (activo).",
      "technicalMetrics": "Tiempo de ejecución < 50 ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Comando de solo lectura; totalmente seguro.",
      "safetyWarning": "Anotá el GUID activo antes de probar esquemas experimentales."
    },
    "evidenceBadge": {
      "code": "POWER-LIST",
      "label": "Scheme List"
    }
  },
  {
    "id": "inv-19-07",
    "code": "19.07",
    "title": "/getactivescheme",
    "subtitle": "Auditoría del plan en tiempo real en scripts y telemetría",
    "targetMechanism": "Active Power Scheme Query API",
    "targetComponent": "powrprof.dll / PowerGetActiveScheme",
    "commandName": "powercfg /getactivescheme",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "El software de la batería dice una cosa pero Windows está aplicando otra: la llamada directa al kernel revela la verdad.",
      "mythVsTruth": {
        "mentira": "El deslizador de batería de la barra de tareas cambia el GUID del plan de energía general.",
        "verdad": "En Windows 11, el deslizador cambia un \"Power Mode\" superpuesto (Overlay) sin necesariamente modificar el GUID del esquema base.",
        "comprobalo": "Cambiá el deslizador y ejecutá /getactivescheme para ver que el GUID base se mantiene inalterado."
      }
    },
    "entende": {
      "queEs": "La llamada directa a la función nativa PowerGetActiveScheme del subsistema de energía.",
      "paraQueSirve": "Verificar en scripts y tareas programadas qué política base gobierna el procesador.",
      "quePasaSiFalta": "Incertidumbre técnica sobre si se están aplicando las restricciones térmicas deseadas."
    },
    "interactua": {
      "cliExample": "powercfg /getactivescheme",
      "psExample": "(Get-CimInstance -Namespace root\\cimv2\\power -ClassName Win32_PowerPlan | Where-Object IsActive).InstanceID",
      "syntaxBreakdown": "Consulta el GUID exacto y el nombre localizado del plan activo.",
      "whatToLookFor": "Nombre del esquema entre paréntesis.",
      "technicalMetrics": "Llamada Win32 inmediata a PowerGetActiveScheme."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y de solo lectura.",
      "safetyWarning": "Ninguno."
    },
    "evidenceBadge": {
      "code": "GET-ACTIVE",
      "label": "Active Scheme"
    }
  },
  {
    "id": "inv-19-08",
    "code": "19.08",
    "title": "/energy",
    "subtitle": "El reporte de eficiencia de 60 segundos que detecta fugas de energía",
    "targetMechanism": "Kernel Event Tracing & Power Diagnostics Engine",
    "targetComponent": "powrprof.dll / energy.html report generator",
    "commandName": "powercfg /energy /output %temp%\\energy-report.html",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "La batería dura la mitad de lo prometido: powercfg /energy rastrea el sistema durante 60 segundos y lista cada error de hardware y software.",
      "mythVsTruth": {
        "mentira": "Windows no tiene herramientas para saber qué programa o driver gasta energía en segundo plano.",
        "verdad": "powercfg /energy genera un informe HTML forense detallando timers de alta resolución, drivers que no duermen y dispositivos mal configurados.",
        "comprobalo": "Ejecutá el comando como administrador y abrí el archivo HTML resultante en tu navegador."
      }
    },
    "entende": {
      "queEs": "Una herramienta de diagnóstico forense de energía integrada en el kernel de Windows.",
      "paraQueSirve": "Identifica aplicaciones que aumentan el tick rate del reloj del sistema o impiden C-States profundos.",
      "quePasaSiFalta": "Baterías que se drenan en reposo sin causa aparente."
    },
    "interactua": {
      "cliExample": "powercfg /energy /output %temp%\\energy-report.html",
      "psExample": "Start-Process \"$env:temp\\energy-report.html\"",
      "syntaxBreakdown": "Analiza el equipo durante 60 segundos y guarda los resultados en un reporte web.",
      "whatToLookFor": "Sección \"Errores\" en color rojo (temporizadores de plataforma, USB selective suspend).",
      "technicalMetrics": "Resolución de reloj del sistema recomendada: 15.6 ms (si está en 1.0 ms gasta 10% más batería)."
    },
    "alertaEVO": {
      "reversibilityRule": "Solo genera un archivo de diagnóstico; no modifica configuraciones.",
      "safetyWarning": "Dejá la máquina en reposo durante los 60 segundos del test para no alterar las lecturas."
    },
    "evidenceBadge": {
      "code": "ENERGY-REP",
      "label": "Energy Report"
    }
  },
  {
    "id": "inv-19-09",
    "code": "19.09",
    "title": "/requests",
    "subtitle": "Descubrir qué proceso o driver impide que tu PC se suspenda",
    "targetMechanism": "Power Availability Requests (PowerSetRequest / PowerClearRequest)",
    "targetComponent": "ntoskrnl.exe / powrprof.dll",
    "commandName": "powercfg /requests",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Cerrás la tapa de la laptop, la guardás en la mochila y al sacarla parece un horno prendido: algo bloqueó la suspensión.",
      "mythVsTruth": {
        "mentira": "Si la pantalla se apaga, la computadora siempre entra en suspensión completa.",
        "verdad": "Cualquier aplicación de música, navegador o driver de audio puede emitir una llamada PowerSetRequest(PowerRequestSystem) que bloquea el sueño.",
        "comprobalo": "Ejecutá powercfg /requests cuando la máquina se niegue a suspenderse para ver al culpable con nombre y apellido."
      }
    },
    "entende": {
      "queEs": "El registro de solicitudes activas de DISPLAY, SYSTEM, AWAYMODE y EXECUTION que los procesos envían a Windows.",
      "paraQueSirve": "Diagnostica por qué la pantalla no se apaga sola o por qué la máquina permanece despierta indefinidamente.",
      "quePasaSiFalta": "Riesgo de sobrecalentamiento de notebooks dentro de fundas y mochilas."
    },
    "interactua": {
      "cliExample": "powercfg /requests",
      "psExample": "powercfg -requests",
      "syntaxBreakdown": "Lista solicitudes abiertas en las categorías DISPLAY, SYSTEM y AWAYMODE.",
      "whatToLookFor": "Cualquier proceso listado bajo [SYSTEM] o [DISPLAY] (ej: Chrome, Spotify, audio streams).",
      "technicalMetrics": "Llamada al kernel NtSetInformationProcess / PowerRequest."
    },
    "alertaEVO": {
      "reversibilityRule": "Cerrar la aplicación responsable libera la solicitud de inmediato.",
      "safetyWarning": "Se puede anular una solicitud rebelde con powercfg /requestsoverride."
    },
    "evidenceBadge": {
      "code": "POWER-REQS",
      "label": "Power Requests"
    }
  },
  {
    "id": "inv-19-10",
    "code": "19.10",
    "title": "Battery report",
    "subtitle": "Salud real, desgaste químico y ciclos de la batería",
    "targetMechanism": "ACPI Battery Management & Fuel Gauge Telemetry",
    "targetComponent": "battc.sys / Microsoft ACPI-Compliant Control Method Battery",
    "commandName": "powercfg /batteryreport /output %temp%\\battery-report.html",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows dice que tu batería está al 100%, pero se apaga a los 20 minutos: tu batería sufrió desgaste químico irreversible.",
      "mythVsTruth": {
        "mentira": "Windows solo sabe el porcentaje actual de la batería, no su capacidad real ni su desgaste.",
        "verdad": "El controlador embebido (EC) almacena el historial de miliamperios/hora; powercfg /batteryreport extrae los ciclos y la capacidad de diseño.",
        "comprobalo": "Generá el battery report y compará \"Design Capacity\" frente a \"Full Charge Capacity\"."
      }
    },
    "entende": {
      "queEs": "El informe analítico que lee las tablas ACPI de la batería y calcula el porcentaje de salud química degradada.",
      "paraQueSirve": "Saber con certeza matemática cuándo es momento de reemplazar la batería de una portátil.",
      "quePasaSiFalta": "Apagados repentinos sin advertencia previa."
    },
    "interactua": {
      "cliExample": "powercfg /batteryreport /output %temp%\\battery-report.html",
      "psExample": "Start-Process \"$env:temp\\battery-report.html\"",
      "syntaxBreakdown": "Compila el historial de uso y genera un reporte HTML forense de la batería.",
      "whatToLookFor": "Full Charge Capacity vs Design Capacity, y el contador \"Cycle Count\".",
      "technicalMetrics": "Degradación aceptable: < 20% tras 300 ciclos de carga completos."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y de solo lectura.",
      "safetyWarning": "Si Full Charge Capacity es menor al 40% de la capacidad de diseño, la batería puede hincharse físicamente."
    },
    "evidenceBadge": {
      "code": "BATTERY-REP",
      "label": "Battery Health"
    }
  },
  {
    "id": "inv-19-11",
    "code": "19.11",
    "title": "C-States",
    "subtitle": "Estados de reposo del procesador (C0 activo a C10 profundo)",
    "targetMechanism": "CPU Core & Package Sleep Power States (C0 through C10)",
    "targetComponent": "intelpep.sys / amdppm.sys / ACPI _CST",
    "commandName": "powercfg /energy",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Aunque no toques el mouse, el CPU ejecuta miles de instrucciones por segundo; los C-States apagan circuitos enteros del procesador cuando no hacen falta.",
      "mythVsTruth": {
        "mentira": "Deshabilitar los C-States en el BIOS siempre mejora el rendimiento de los juegos.",
        "verdad": "Deshabilitar C-States impide que los núcleos inactivos se apaguen, limitando el presupuesto térmico del procesador y reduciendo el turbo mononúcleo.",
        "comprobalo": "Utilizá herramientas como ThrottleStop o HWiNFO para observar el porcentaje de tiempo que el CPU pasa en C6 o C7."
      }
    },
    "entende": {
      "queEs": "La jerarquía de estados de ahorro energético: C0 es ejecución completa; C1 corta el reloj; C3 vacía cachés; C6/C7 apaga el voltaje del núcleo.",
      "paraQueSirve": "Permite que un procesador pase de consumir 65W a 0.5W en reposo.",
      "quePasaSiFalta": "Temperaturas elevadas en reposo y ventiladores acelerados permanentemente."
    },
    "interactua": {
      "cliExample": "wmic cpu get Name, CurrentClockSpeed, MaxClockSpeed",
      "psExample": "Get-CimInstance Win32_Processor | Select-Object Name, CurrentClockSpeed, MaxClockSpeed",
      "syntaxBreakdown": "Muestra la velocidad actual de reloj reflejando la modulación por estados.",
      "whatToLookFor": "CurrentClockSpeed por debajo de MaxClockSpeed en reposo.",
      "technicalMetrics": "Tiempo de transición C6 -> C0 < 30 microsegundos."
    },
    "alertaEVO": {
      "reversibilityRule": "Controlado por firmware BIOS y drivers de chipset (amdppm / intelpep).",
      "safetyWarning": "Apagar C-States en laptops reduce la autonomía a menos de la mitad."
    },
    "evidenceBadge": {
      "code": "C-STATES",
      "label": "Core Sleep"
    }
  },
  {
    "id": "inv-19-12",
    "code": "19.12",
    "title": "P-States",
    "subtitle": "Performance States: voltajes y frecuencias operativas",
    "targetMechanism": "ACPI _PSS / DVFS (Dynamic Voltage and Frequency Scaling)",
    "targetComponent": "intelpep.sys / amdppm.sys",
    "commandName": "powercfg /query SCHEME_CURRENT SUB_PROCESSOR",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "El procesador no corre a una sola velocidad fija: salta entre 20 escalones de frecuencia y voltaje llamados P-States.",
      "mythVsTruth": {
        "mentira": "El CPU necesita una orden de Windows cada vez que quiere subir 100 MHz de velocidad.",
        "verdad": "En procesadores modernos, Speed Shift / CPPC decide la frecuencia internamente en el silicio cada 1 milisegundo sin esperar al sistema operativo.",
        "comprobalo": "Observá la frecuencia del CPU en el Administrador de Tareas: cambia de valor en cada refresco de pantalla."
      }
    },
    "entende": {
      "queEs": "Las combinaciones predefinidas de frecuencia y voltaje de operación en estado C0 (activo). P0 es la máxima frecuencia; Pn la mínima.",
      "paraQueSirve": "Ajusta el consumo eléctrico cuadráticamente con respecto a la frecuencia requerida (P = C * V^2 * f).",
      "quePasaSiFalta": "Consumo constante a voltaje máximo sin justificación técnica."
    },
    "interactua": {
      "cliExample": "powercfg /query SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX",
      "psExample": "Get-CimInstance Win32_Processor | Select-Object Name, LoadPercentage",
      "syntaxBreakdown": "Consulta el límite superior de aceleración del procesador en el esquema actual.",
      "whatToLookFor": "PROCTHROTTLEMAX configurado al 100% (0x64).",
      "technicalMetrics": "Tasa de transición de P-States: hasta 1000 conmutaciones por segundo."
    },
    "alertaEVO": {
      "reversibilityRule": "Los P-States se gestionan autónomamente por hardware.",
      "safetyWarning": "Fijar el estado mínimo de procesador al 100% no aumenta los FPS máximos en juegos modernos."
    },
    "evidenceBadge": {
      "code": "P-STATES",
      "label": "DVFS Stepping"
    }
  },
  {
    "id": "inv-19-13",
    "code": "19.13",
    "title": "Speed Shift",
    "subtitle": "Hardware P-States (HWP): la velocidad del silicio autónomo",
    "targetMechanism": "Intel Hardware-Controlled P-states (HWP) / AMD Collaborative Power and Performance Control",
    "targetComponent": "Hardware Autonomous MSRs / intelpep.sys",
    "commandName": "powercfg /energy",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Antes de Speed Shift, Windows tardaba 30 milisegundos en notar la carga y ordenar subir la frecuencia; ahora el silicio lo hace en 1 milisegundo.",
      "mythVsTruth": {
        "mentira": "Windows es más inteligente que el procesador para decidir qué frecuencia de reloj conviene usar.",
        "verdad": "El algoritmo HWP interno de la CPU analiza registros de instrucciones cada ciclo de reloj, respondiendo 30 veces más rápido que el software.",
        "comprobalo": "Revisá en HWiNFO si figura la insignia \"HWP: Yes\" en los cores de tu procesador."
      }
    },
    "entende": {
      "queEs": "El protocolo por el cual el sistema operativo le cede el control de la modulación de frecuencia al propio microprocesador.",
      "paraQueSirve": "Acelera la respuesta al abrir aplicaciones y reduce el consumo al volver a reposo con velocidad relámpago.",
      "quePasaSiFalta": "Retardo perceptible (latencia de rampa) al iniciar tareas de cómputo intensivo."
    },
    "interactua": {
      "cliExample": "wmic cpu get Caption, Description",
      "psExample": "Get-CimInstance Win32_Processor | Select-Object Caption, NumberOfCores",
      "syntaxBreakdown": "Identifica la generación del procesador con soporte nativo HWP.",
      "whatToLookFor": "Intel Core 6ta Gen en adelante o AMD Zen 2 en adelante.",
      "technicalMetrics": "Ramp-up time reducido de ~30 ms a ~1 ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Habilitado por defecto en BIOS y Windows 10/11.",
      "safetyWarning": "Deshabilitar Speed Shift en BIOS degrada el rendimiento de ráfaga y la duración de la batería."
    },
    "evidenceBadge": {
      "code": "SPEED-SHIFT",
      "label": "HWP Autonomous"
    }
  },
  {
    "id": "inv-19-14",
    "code": "19.14",
    "title": "CPPC",
    "subtitle": "Core Performance Order: priorizar los mejores núcleos de silicio",
    "targetMechanism": "Collaborative Processor Performance Control (CPPC v2) Preferred Cores",
    "targetComponent": "amdppm.sys / intelpep.sys / ntoskrnl.exe",
    "commandName": "powercfg /query SCHEME_CURRENT SUB_PROCESSOR",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "No todos los núcleos de tu procesador nacieron iguales en la fábrica; CPPC le dice a Windows cuáles alcanzan mayor frecuencia con menor voltaje.",
      "mythVsTruth": {
        "mentira": "Windows distribuye los hilos de manera totalmente aleatoria entre todos los núcleos disponibles.",
        "verdad": "Mediante CPPC v2, el firmware califica cada núcleo con un ranking; Windows asigna tus juegos y tareas críticas a los dos núcleos \"estrella\" (dorados).",
        "comprobalo": "En Ryzen Master o en la app de Intel, observá las estrellas que marcan los núcleos con mejor calidad de silicio."
      }
    },
    "entende": {
      "queEs": "La especificación ACPI que expone la curva de rendimiento individual y la preferencia de afinidad de cada núcleo físico.",
      "paraQueSirve": "Maximiza el rendimiento monohilo asignando los procesos prioritarios a los núcleos capaces de sostener el boost más alto.",
      "quePasaSiFalta": "Pérdida de hasta un 8% de rendimiento mononúcleo en procesadores con topología híbrida o multi-chiplet."
    },
    "interactua": {
      "cliExample": "powercfg /query SCHEME_CURRENT SUB_PROCESSOR",
      "psExample": "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors",
      "syntaxBreakdown": "Consulta parámetros del procesador y topología lógica.",
      "whatToLookFor": "Procesadores multinúcleo con CPPC habilitado en BIOS.",
      "technicalMetrics": "Diferencial de frecuencia de hasta 200 MHz entre el mejor y el peor núcleo del paquete."
    },
    "alertaEVO": {
      "reversibilityRule": "Configurable en la sección AMD CBS / Intel Advanced CPU Settings del BIOS.",
      "safetyWarning": "Tener el driver de chipset desactualizado puede impedir que Windows lea el orden de núcleos preferidos."
    },
    "evidenceBadge": {
      "code": "CPPC-RANK",
      "label": "Preferred Cores"
    }
  },
  {
    "id": "inv-19-15",
    "code": "19.15",
    "title": "Sleep",
    "subtitle": "Suspender en RAM (S3) vs Standby moderno",
    "targetMechanism": "ACPI S3 State (Suspend to RAM)",
    "targetComponent": "ntoskrnl.exe / ACPI HAL",
    "commandName": "powercfg /availablesleepstates",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Suspender clásico guarda todo en la memoria RAM y apaga el procesador, consumiendo apenas 1 o 2 vatios.",
      "mythVsTruth": {
        "mentira": "Al suspender la computadora, todos los componentes se apagan por completo.",
        "verdad": "La memoria RAM permanece energizada en modo auto-refresh para no perder los datos de la sesión abierta.",
        "comprobalo": "Ejecutá powercfg /a para ver si tu placa madre soporta el estado tradicional S3."
      }
    },
    "entende": {
      "queEs": "El estado ACPI S3 donde el contexto de ejecución se mantiene en la memoria volátil mientras el resto del hardware se desenergiza.",
      "paraQueSirve": "Permite reanudar el trabajo en 2 segundos exactos donde lo habías dejado.",
      "quePasaSiFalta": "Si se corta la energía o la batería llega a cero en modo S3, se pierde el trabajo no guardado."
    },
    "interactua": {
      "cliExample": "powercfg /availablesleepstates",
      "psExample": "powercfg /a",
      "syntaxBreakdown": "Lista todos los estados de suspensión soportados por el firmware y el sistema operativo.",
      "whatToLookFor": "\"Suspensión (S3)\" listado en los estados disponibles en el sistema.",
      "technicalMetrics": "Consumo típico en S3: 1.2W a 2.5W; tiempo de despertar < 2.5s."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y de solo lectura.",
      "safetyWarning": "Mover una laptop mientras está entrando en suspensión puede corromper el disco si no ha terminado el volcado."
    },
    "evidenceBadge": {
      "code": "SLEEP-S3",
      "label": "ACPI S3"
    }
  },
  {
    "id": "inv-19-16",
    "code": "19.16",
    "title": "Hibernate",
    "subtitle": "Hibernar (S4) y el archivo hiberfil.sys en el disco",
    "targetMechanism": "ACPI S4 State (Suspend to Disk) & Fast Startup",
    "targetComponent": "hiberfil.sys / ntoskrnl.exe",
    "commandName": "powercfg /hibernate on",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "El archivo hiberfil.sys pesa 16 GB en tu disco C: es la foto congelada de toda tu memoria RAM.",
      "mythVsTruth": {
        "mentira": "Hibernar gasta batería lentamente mientras la computadora está apagada.",
        "verdad": "En hibernación (S4), el consumo de energía es CERO absoluto; podés quitar la batería y los programas seguirán intactos al encender.",
        "comprobalo": "Buscá el archivo oculto C:\\hiberfil.sys con dir /ah C:\\."
      }
    },
    "entende": {
      "queEs": "El volcado comprimido de la memoria RAM activa en el archivo hiberfil.sys antes de desenergizar el equipo por completo.",
      "paraQueSirve": "Permite apagar la máquina al 100% y reanudar sesiones complejas sin depender de energía residual.",
      "quePasaSiFalta": "Si se desactiva con powercfg /h off, se liberan gigabytes de disco pero se pierde también el Inicio Rápido."
    },
    "interactua": {
      "cliExample": "powercfg /hibernate on",
      "psExample": "Get-Item -Force C:\\hiberfil.sys | Select-Object Name, Length",
      "syntaxBreakdown": "Comprueba la existencia y el tamaño en bytes del archivo hiberfil.sys.",
      "whatToLookFor": "Tamaño de hiberfil.sys equivalente al 40%-80% de la memoria RAM instalada.",
      "technicalMetrics": "Consumo en S4: 0.0W; velocidad de reanudación limitada por la velocidad de lectura secuencial del SSD."
    },
    "alertaEVO": {
      "reversibilityRule": "powercfg -h off desactiva la hibernación y borra hiberfil.sys liberando espacio.",
      "safetyWarning": "En unidades SSD muy pequeñas, hiberfil.sys puede dejar el disco sin espacio crítico para Windows Update."
    },
    "evidenceBadge": {
      "code": "HIBERNATE-S4",
      "label": "ACPI S4"
    }
  },
  {
    "id": "inv-19-17",
    "code": "19.17",
    "title": "Modern Standby",
    "subtitle": "S0 Low Power Idle: la pesadilla de las laptops que se calientan solas",
    "targetMechanism": "ACPI S0ix / Modern Standby (Connected / Disconnected Standby)",
    "targetComponent": "intelpep.sys / Windows Push Notification Service",
    "commandName": "powercfg /sleepstudy",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Guardaste la laptop durmiendo en la mochila y al sacarla estaba hirviendo y con la batería agotada: bienvenida a Modern Standby (S0ix).",
      "mythVsTruth": {
        "mentira": "Modern Standby es idéntico a la suspensión tradicional pero más rápido.",
        "verdad": "En S0ix la computadora nunca se apaga; el CPU sigue encendido en bajo consumo chequeando emails, descargando updates y ejecutando telemetría.",
        "comprobalo": "Ejecutá powercfg /sleepstudy para ver exactamente qué tareas mantuvieron despierta la máquina mientras la tapa estaba cerrada."
      }
    },
    "entende": {
      "queEs": "El estado de reposo estilo smartphone donde el equipo permanece conectado a la red mientras la pantalla está apagada.",
      "paraQueSirve": "Reanuda el sistema en menos de 500 ms y permite escuchar música con la tapa cerrada.",
      "quePasaSiFalta": "Si un driver de red o Wi-Fi no implementa correctamente el protocolo PEP, el procesador se queda en C0 consumiendo 25W dentro de la funda."
    },
    "interactua": {
      "cliExample": "powercfg /sleepstudy /output %temp%\\sleepstudy-report.html",
      "psExample": "Start-Process \"$env:temp\\sleepstudy-report.html\"",
      "syntaxBreakdown": "Genera el informe forense de sesiones de Modern Standby y drenajes anormales de batería.",
      "whatToLookFor": "Sesiones con color rojo o naranja con drenaje superior al 5% por hora.",
      "technicalMetrics": "Drenaje objetivo en reposo: < 1% de batería por cada 8 horas de suspensión."
    },
    "alertaEVO": {
      "reversibilityRule": "Solo lectura; genera un diagnóstico web forense.",
      "safetyWarning": "Para evitar laptops calientes en mochilas, configurá \"Al cerrar la tapa: Hibernar\" en lugar de Suspender."
    },
    "evidenceBadge": {
      "code": "MODERN-STANDBY",
      "label": "S0ix Idle"
    }
  },
  {
    "id": "inv-19-18",
    "code": "19.18",
    "title": "Device power saving",
    "subtitle": "PCIe ASPM, USB Selective Suspend y Link State Management",
    "targetMechanism": "Active State Power Management (ASPM) & USB Selective Suspend",
    "targetComponent": "pci.sys / usbhub.sys / powrprof.dll",
    "commandName": "powercfg /query SCHEME_CURRENT SUB_PCIEXPRESS",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Tu mouse o placa de audio USB se desconecta sola cada 3 minutos de inactividad: Windows apagó el puerto para ahorrar energía.",
      "mythVsTruth": {
        "mentira": "Los puertos USB siempre entregan 5 voltios de forma ininterrumpida sin importar la configuración.",
        "verdad": "La suspensión selectiva de USB corta la energía del puerto individual cuando no detecta tráfico en el bus por cierto tiempo.",
        "comprobalo": "Revisá en las propiedades de tu hub USB en Administrador de Dispositivos la pestaña \"Administración de energía\"."
      }
    },
    "entende": {
      "queEs": "El conjunto de políticas del bus PCIe y USB que colocan enlaces físicos en estados de bajo consumo (L0s, L1, L1.1, L1.2).",
      "paraQueSirve": "Ahorra entre 3 y 8 vatios de energía en reposo en placas madre de escritorio y laptops.",
      "quePasaSiFalta": "Dispositivos de audio DAC o interfaces externas sufren chasquidos, desync o desconexiones súbitas."
    },
    "interactua": {
      "cliExample": "powercfg /query SCHEME_CURRENT SUB_NONE 48e6b7a6-50f5-4782-a5d4-53bb8f07e226",
      "psExample": "Get-PnpDevice -Class USB | Select-Object FriendlyName, Status",
      "syntaxBreakdown": "Consulta la directiva de suspensión selectiva de USB en el esquema actual.",
      "whatToLookFor": "Valor 0x00000000 = Deshabilitado (previene desconexiones de periféricos sensibles).",
      "technicalMetrics": "Latencia de reactivación de enlace PCIe L1: 16 a 64 microsegundos."
    },
    "alertaEVO": {
      "reversibilityRule": "Desactivar USB Selective Suspend en opciones de energía restaura alimentación continua.",
      "safetyWarning": "Deshabilitar ASPM en laptops reduce la duración de la batería hasta en 40 minutos."
    },
    "evidenceBadge": {
      "code": "ASPM-USB",
      "label": "Link State"
    }
  },
  {
    "id": "inv-19-19",
    "code": "19.19",
    "title": "Por qué “máximo rendimiento” no siempre rinde más",
    "subtitle": "El mito del calor, thermal throttling y la trampa del reloj estático",
    "targetMechanism": "Thermal Throttling & Boost Algorithm Power Budget Saturation",
    "targetComponent": "Intel Thermal Velocity Boost / AMD Precision Boost 2",
    "commandName": "powercfg /getactivescheme",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Pusiste \"Rendimiento Máximo\" esperando más FPS en tu juego, pero a los 10 minutos el rendimiento se desploma por sobrecalentamiento.",
      "mythVsTruth": {
        "mentira": "Forzar el CPU al 100% todo el tiempo siempre da más fotogramas por segundo que dejarlo gestionar su frecuencia.",
        "verdad": "Los algoritmos modernos de boost calculan el margen térmico (headroom): si el procesador nunca se enfría, satura su límite térmico y baja de reloj.",
        "comprobalo": "Medí los FPS sostenidos durante 30 minutos con plan Equilibrado frente a Alto Rendimiento."
      }
    },
    "entende": {
      "queEs": "La física de disipación térmica y la interacción con los algoritmos predictivos de frecuencia de los procesadores actuales.",
      "paraQueSirve": "Optimizar el rendimiento sostenido en sesiones prolongadas de trabajo o juego.",
      "quePasaSiFalta": "Thermal throttling agresivo que reduce las frecuencias por debajo de la velocidad base."
    },
    "interactua": {
      "cliExample": "wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature",
      "psExample": "Get-CimInstance -Namespace root\\wmi -ClassName MSAcpi_ThermalZoneTemperature -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Consulta la telemetría térmica reportada por ACPI (en décimas de Kelvin).",
      "whatToLookFor": "Temperaturas estables por debajo de 85°C (358 Kelvin).",
      "technicalMetrics": "Frecuencia sostenida superior en hasta 300 MHz en plan Equilibrado gracias a descansos térmicos entre fotogramas."
    },
    "alertaEVO": {
      "reversibilityRule": "El plan Equilibrado es la configuración óptima recomendada por ingenieros de Intel y AMD.",
      "safetyWarning": "No utilices herramientas de desaparcamiento forzado de núcleos en equipos con disipación estándar."
    },
    "evidenceBadge": {
      "code": "THROTTLE-PARADOX",
      "label": "Thermal Headroom"
    }
  }
];

export const SECTOR_19_MINICASES: Sector19MiniCase[] = [
  {
    "id": "case-19-01",
    "code": "MC-19.01",
    "title": "La notebook que se descarga sola dentro de la mochila",
    "scenario": "Un profesional guarda su laptop en la mochila con 100% de batería. Al llegar a la oficina dos horas después, la laptop está ardiendo y la batería está en 12%.",
    "userStatement": "La batería está fallada y tiene un cortocircuito interno.",
    "initialMistake": "Asumir falla de hardware de la celda de litio sin auditar las sesiones de Modern Standby (S0ix).",
    "diagnosticQuestion": "¿Qué comando específico revela qué driver o servicio mantuvo despierto el procesador?",
    "options": [
      {
        "id": "opt-a",
        "text": "powercfg /sleepstudy /output sleep.html y revisar los bloques rojos de mayor consumo durante la suspensión.",
        "isCorrect": true,
        "explanation": "Sleepstudy es el informe forense oficial de Windows para Modern Standby; expone qué componente (ej: Bluetooth, audio o Wi-Fi) impidió entrar en reposo profundo."
      },
      {
        "id": "opt-b",
        "text": "chkdsk C: /f /r para reparar el disco duro.",
        "isCorrect": false,
        "explanation": "El sistema de archivos no tiene relación con el estado de suspensión de los periféricos."
      },
      {
        "id": "opt-c",
        "text": "Descargar un limpiador de registro de internet.",
        "isCorrect": false,
        "explanation": "Peligroso e inútil para la gestión térmica de ACPI."
      }
    ],
    "technicalVerdict": "Un servicio de sincronización en la nube mantuvo activa la conexión Wi-Fi en Modern Standby. Se configuró \"Al cerrar la tapa: Hibernar\" resolviendo el problema.",
    "lessonLearned": "Modern Standby permite actividad en segundo plano; en entornos cerrados sin ventilación, la hibernación (S4) es el único estado seguro con consumo cero."
  },
  {
    "id": "case-19-02",
    "code": "MC-19.02",
    "title": "La placa de sonido USB que hace \"clics\" y se apaga sola",
    "scenario": "Un streamer conecta una interfaz de audio profesional por USB. Cada vez que deja de hablar por un par de minutos, al volver a hablar la interfaz tarda 4 segundos en reaccionar o emite un chasquido ruidoso.",
    "userStatement": "El cable USB de la interfaz está roto por dentro.",
    "initialMistake": "Reemplazar cables analógicos y digitales sin auditar la Suspensión Selectiva de USB de Windows.",
    "diagnosticQuestion": "¿Cuál es la causa y la solución técnica definitiva?",
    "options": [
      {
        "id": "opt-a",
        "text": "La directiva de Suspensión selectiva de USB está cortando la energía del puerto al detectar inactividad; desactivarla en el plan de energía mantiene el bus encendido.",
        "isCorrect": true,
        "explanation": "Windows ahorra energía apagando puertos USB inactivos. Los dispositivos de audio profesional requieren alimentación y reloj de bus continuo."
      },
      {
        "id": "opt-b",
        "text": "Se debe formatear el sistema e instalar Windows en modo Seguro.",
        "isCorrect": false,
        "explanation": "En modo seguro no cargan los controladores de audio necesarios."
      },
      {
        "id": "opt-c",
        "text": "El procesador no tiene suficientes núcleos para procesar la voz.",
        "isCorrect": false,
        "explanation": "El audio PCM de dos canales consume menos del 0.1% de un solo núcleo."
      }
    ],
    "technicalVerdict": "Desactivar la suspensión selectiva de USB en las opciones avanzadas de energía estabilizó la interfaz de audio de forma permanente.",
    "lessonLearned": "El ahorro de energía agresivo en buses USB interrumpe dispositivos de streaming y telemetría en tiempo real."
  },
  {
    "id": "case-19-03",
    "code": "MC-19.03",
    "title": "PC de escritorio trabada que nunca apaga los monitores",
    "scenario": "En las opciones de energía se configuró \"Apagar pantalla tras 10 minutos\", pero los monitores permanecen encendidos toda la noche con el escritorio visible.",
    "userStatement": "Windows 11 tiene un bug que rompió el temporizador de apagado de pantalla.",
    "initialMistake": "Reinstalar drivers gráficos cuando un proceso de usuario está bloqueando activamente el temporizador de display.",
    "diagnosticQuestion": "¿Cómo identificar qué programa está impidiendo el apagado del monitor?",
    "options": [
      {
        "id": "opt-a",
        "text": "Ejecutar powercfg /requests en una consola de comandos para ver las solicitudes activas bajo la categoría [DISPLAY].",
        "isCorrect": true,
        "explanation": "powercfg /requests lista de forma inmediata si un reproductor de video, una pestaña de navegador o un controlador de joystick tiene una solicitud activa de pantalla."
      },
      {
        "id": "opt-b",
        "text": "Desconectar físicamente el cable de red.",
        "isCorrect": false,
        "explanation": "La conexión de red no impide que el temporizador de pantalla apague la señal de video."
      },
      {
        "id": "opt-c",
        "text": "Bajar la resolución de pantalla a 800x600.",
        "isCorrect": false,
        "explanation": "No afecta en nada las directivas de temporización de energía."
      }
    ],
    "technicalVerdict": "Una pestaña en segundo plano con un stream en pausa mantenía una solicitud activa de [DISPLAY]. powercfg /requestsoverride anuló el bloqueo.",
    "lessonLearned": "Las aplicaciones pueden invocar APIs de energía para mantener la pantalla encendida; powercfg /requests es la linterna que las descubre."
  },
  {
    "id": "case-19-04",
    "code": "MC-19.04",
    "title": "La paradoja de los FPS en verano: Más calor, menos rendimiento",
    "scenario": "Un usuario activa el plan \"Rendimiento Máximo\" fijando la frecuencia del CPU al 100% permanente. Tras 20 minutos de juego, los FPS caen de 120 a 45 con tirones insoportables.",
    "userStatement": "El juego tiene una fuga de memoria grave.",
    "initialMistake": "No monitorear las temperaturas del silicio y desconocer el funcionamiento del algoritmo de Turbo Boost.",
    "diagnosticQuestion": "¿Por qué el plan \"Rendimiento Máximo\" rindió menos que el plan \"Equilibrado\"?",
    "options": [
      {
        "id": "opt-a",
        "text": "Al no permitir que los núcleos bajen de voltaje en los cuadros ligeros, la temperatura acumulada saturó el disipador, provocando thermal throttling severo (bajada a 800 MHz).",
        "isCorrect": true,
        "explanation": "El silicio moderno aprovecha los micro-descansos de milisegundos para disipar calor; si se fuerza al 100% constante, el procesador se sobrecalienta y activa el freno de emergencia."
      },
      {
        "id": "opt-b",
        "text": "Porque el plan Rendimiento Máximo solo funciona si se tiene una tarjeta de video de hace 10 años.",
        "isCorrect": false,
        "explanation": "No tiene fundamento técnico de compatibilidad."
      },
      {
        "id": "opt-c",
        "text": "Porque Windows cobra una suscripción adicional para desbloquear los FPS en ese plan.",
        "isCorrect": false,
        "explanation": "Falso por completo."
      }
    ],
    "technicalVerdict": "Restaurar el plan Equilibrado permitió que los núcleos enfriaran entre picos de carga, sosteniendo frecuencias de boost estables de 4.8 GHz sin throttling.",
    "lessonLearned": "El rendimiento del silicio depende de su temperatura; permitir descansos térmicos dinámicos produce mayor velocidad sostenida que forzar clocks estáticos."
  }
];

export const SECTOR_19_TEST_BANK: Sector19TestQuestion[] = [
  {
    "id": "q-19-01",
    "questionNumber": 1,
    "category": "Planes de Energía",
    "question": "¿Por qué el plan \"Equilibrado\" (Balanced) es el recomendado oficialmente para la gran mayoría de equipos modernos?",
    "options": [
      {
        "id": "opt-a",
        "text": "Porque utiliza tecnologías como Speed Shift y CPPC para alcanzar las máximas frecuencias en microsegundos y bajar a reposo inmediatamente para preservar el margen térmico."
      },
      {
        "id": "opt-b",
        "text": "Porque limita la velocidad del procesador a la mitad para que no gaste electricidad."
      },
      {
        "id": "opt-c",
        "text": "Porque es el único plan que permite conectarse a internet por cable."
      },
      {
        "id": "opt-d",
        "text": "Porque desactiva los ventiladores de la computadora permanentemente."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "El plan Equilibrado aprovecha la modulación autónoma por hardware de los CPUs modernos, permitiendo picos de boost instantáneos sin acumular calor innecesario en reposo.",
    "relatedInvestigationCode": "19.01"
  },
  {
    "id": "q-19-02",
    "questionNumber": 2,
    "category": "Comandos powercfg",
    "question": "¿Qué comando de Windows genera un informe forense HTML detallando el desgaste químico, capacidad de diseño y ciclos de la batería?",
    "options": [
      {
        "id": "opt-a",
        "text": "powercfg /batteryreport"
      },
      {
        "id": "opt-b",
        "text": "netsh wlan show interfaces"
      },
      {
        "id": "opt-c",
        "text": "ipconfig /all"
      },
      {
        "id": "opt-d",
        "text": "sfc /scannow"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "powercfg /batteryreport consulta las tablas ACPI y el controlador embebido de la batería para compilar un reporte histórico de degradación y ciclos.",
    "relatedInvestigationCode": "19.10"
  },
  {
    "id": "q-19-03",
    "questionNumber": 3,
    "category": "Diagnóstico de Suspensión",
    "question": "Si una computadora se niega a suspenderse o la pantalla no se apaga sola, ¿qué comando revela el proceso o driver que está bloqueando la acción?",
    "options": [
      {
        "id": "opt-a",
        "text": "powercfg /requests"
      },
      {
        "id": "opt-b",
        "text": "ping 127.0.0.1"
      },
      {
        "id": "opt-c",
        "text": "taskkill /f /im explorer.exe"
      },
      {
        "id": "opt-d",
        "text": "format C:"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "powercfg /requests lista de forma inmediata las solicitudes de energía activas (PowerSetRequest) en las categorías DISPLAY, SYSTEM y AWAYMODE.",
    "relatedInvestigationCode": "19.09"
  },
  {
    "id": "q-19-04",
    "questionNumber": 4,
    "category": "Estados ACPI",
    "question": "¿Cuál es la diferencia fundamental entre el estado de suspensión S3 (Sleep) y el estado S4 (Hibernate)?",
    "options": [
      {
        "id": "opt-a",
        "text": "En S3 la sesión se guarda en la memoria RAM (consumo bajo pero constante); en S4 la sesión se escribe en el disco hiberfil.sys y el consumo es cero absoluto."
      },
      {
        "id": "opt-b",
        "text": "En S3 se borran todos los programas abiertos; en S4 se guardan solo los documentos de Word."
      },
      {
        "id": "opt-c",
        "text": "S3 solo funciona en computadoras portátiles y S4 solo en servidores."
      },
      {
        "id": "opt-d",
        "text": "No existe ninguna diferencia técnica entre ambos estados."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "S3 mantiene los chips de RAM energizados con auto-refresh; S4 realiza un volcado completo de la memoria a disco no volátil y desenergiza todo el hardware.",
    "relatedInvestigationCode": "19.15"
  },
  {
    "id": "q-19-05",
    "questionNumber": 5,
    "category": "Modern Standby",
    "question": "¿Qué riesgo presenta Modern Standby (S0ix) cuando una laptop se transporta dentro de una funda o mochila cerrada?",
    "options": [
      {
        "id": "opt-a",
        "text": "Que el equipo continúe ejecutando tareas de red y procesos de fondo sin ventilación adecuada, provocando sobrecalentamiento y agotamiento de la batería."
      },
      {
        "id": "opt-b",
        "text": "Que la pantalla se rompa por la presión del aire."
      },
      {
        "id": "opt-c",
        "text": "Que el teclado se desconfigure a idioma japonés."
      },
      {
        "id": "opt-d",
        "text": "Que se borre la cuenta de usuario de Windows."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "En Modern Standby el procesador permanece en estado activo de bajo consumo (S0 Low Power Idle); si una tarea o driver falla al dormir, puede consumir decenas de vatios en un espacio sin flujo de aire.",
    "relatedInvestigationCode": "19.17"
  },
  {
    "id": "q-19-06",
    "questionNumber": 6,
    "category": "C-States",
    "question": "¿Qué ocurre técnicamente cuando un núcleo de procesador entra en el estado C6 o C7?",
    "options": [
      {
        "id": "opt-a",
        "text": "Vuelca el contenido de sus registros y cachés, y reduce el voltaje del núcleo prácticamente a cero, apagando el consumo casi por completo."
      },
      {
        "id": "opt-b",
        "text": "Aumenta su velocidad al doble para terminar rápido las tareas."
      },
      {
        "id": "opt-c",
        "text": "Envía un mensaje de error al Visor de Eventos de Windows."
      },
      {
        "id": "opt-d",
        "text": "Se desinstala del Administrador de Dispositivos."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "Los C-States profundos (C6/C7) guardan el estado de ejecución y cortan la alimentación eléctrica de los transistores del núcleo para ahorrar energía masivamente.",
    "relatedInvestigationCode": "19.11"
  },
  {
    "id": "q-19-07",
    "questionNumber": 7,
    "category": "Hardware Autonomous P-States",
    "question": "¿Qué ventaja aporta Intel Speed Shift (HWP) o AMD CPPC frente al control tradicional de frecuencias por software?",
    "options": [
      {
        "id": "opt-a",
        "text": "El hardware del procesador conmuta voltajes y frecuencias en ~1 milisegundo de forma autónoma, sin esperar el ciclo de sondeo de ~30 ms del sistema operativo."
      },
      {
        "id": "opt-b",
        "text": "Permite que la computadora funcione sin ventiladores ni disipador."
      },
      {
        "id": "opt-c",
        "text": "Elimina la necesidad de tener memoria RAM instalada."
      },
      {
        "id": "opt-d",
        "text": "Deshabilita todos los procesos de Windows Defender."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "Speed Shift transfiere la lógica de modulación de frecuencia al propio microprocesador, respondiendo 30 veces más rápido ante ráfagas de carga.",
    "relatedInvestigationCode": "19.13"
  },
  {
    "id": "q-19-08",
    "questionNumber": 8,
    "category": "Diagnóstico de Eficiencia",
    "question": "¿Qué información crítica revela la herramienta powercfg /energy tras su análisis de 60 segundos?",
    "options": [
      {
        "id": "opt-a",
        "text": "Temporizadores de plataforma de alta resolución que no vuelven a 15.6 ms, drivers que impiden estados de bajo consumo y directivas ineficientes."
      },
      {
        "id": "opt-b",
        "text": "La velocidad de la conexión de fibra óptica."
      },
      {
        "id": "opt-c",
        "text": "El número de serie de la placa de video."
      },
      {
        "id": "opt-d",
        "text": "La lista de contraseñas de las redes Wi-Fi guardadas."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "powercfg /energy analiza las solicitudes de temporización, la configuración de suspensión selectiva y los módulos de kernel que generan drenaje continuo de energía.",
    "relatedInvestigationCode": "19.08"
  },
  {
    "id": "q-19-09",
    "questionNumber": 9,
    "category": "Periféricos y Buses",
    "question": "¿Cuál es la consecuencia de tener activada la \"Suspensión selectiva de USB\" en interfaces de audio profesional o equipos de medición?",
    "options": [
      {
        "id": "opt-a",
        "text": "Que el puerto USB corte la energía o el reloj de sincronización ante breves pausas de uso, generando desync, ruidos o demoras al reactivarse."
      },
      {
        "id": "opt-b",
        "text": "Que la computadora se prenda fuego."
      },
      {
        "id": "opt-c",
        "text": "Que el volumen del micrófono aumente automáticamente al 100%."
      },
      {
        "id": "opt-d",
        "text": "Que se dañe la memoria interna del mouse."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "La suspensión selectiva de USB desenergiza endpoints inactivos; los dispositivos profesionales que requieren streaming isócrono continuo sufren desconexiones.",
    "relatedInvestigationCode": "19.18"
  },
  {
    "id": "q-19-10",
    "questionNumber": 10,
    "category": "Termodinámica y Clocks",
    "question": "¿Por qué forzar un procesador al 100% permanente en un plan de \"Máximo Rendimiento\" puede disminuir los FPS en sesiones largas de juego?",
    "options": [
      {
        "id": "opt-a",
        "text": "Porque satura el presupuesto térmico acumulado del disipador, obligando a los algoritmos de seguridad de la CPU a activar thermal throttling."
      },
      {
        "id": "opt-b",
        "text": "Porque los juegos prefieren correr en procesadores lentos."
      },
      {
        "id": "opt-c",
        "text": "Porque Windows apaga la tarjeta de video cuando el procesador está al 100%."
      },
      {
        "id": "opt-d",
        "text": "Porque el cable de corriente no soporta tanta velocidad continua."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "Sin períodos de relajación térmica en reposo, el disipador alcanza su límite de saturación de calor, provocando que la CPU reduzca drásticamente sus frecuencias de boost.",
    "relatedInvestigationCode": "19.19"
  }
];
