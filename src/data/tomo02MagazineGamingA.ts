import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Gaming I · Investigaciones 151–162. Cálculos didácticos NO se presentan como mediciones de juego. */
export const EVO_MAGAZINE_GAMING_A: EvoMagazineArticle[] = [
  {
    "id": 151,
    "goal": "Entender por qué un monitor de 200 Hz no garantiza que percibas movimiento fluido.",
    "basics": "Hertz indica cuántas veces por segundo puede actualizarse la pantalla, mientras FPS expresa los cuadros que produce el juego. La fluidez también depende de cuándo llega cada cuadro, del refresco variable y de los tiempos de respuesta; una cifra de Hz no determina la latencia completa.",
    "steps": [
      {
        "title": "Identificá los modos de pantalla",
        "why": "Windows publica modos admitidos por el adaptador; no todos están activos.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate,CurrentHorizontalResolution,CurrentVerticalResolution",
        "expect": "CurrentRefreshRate puede mostrar el refresco actual o un valor impreciso según controlador."
      },
      {
        "title": "Calculá el intervalo entre refrescos",
        "why": "Un panel de 200 Hz tiene un intervalo ideal de 5 ms; esto no es tiempo de respuesta del píxel.",
        "code": "[pscustomobject]@{Hz60_ms=[math]::Round(1000/60,2);Hz120_ms=[math]::Round(1000/120,2);Hz200_ms=[math]::Round(1000/200,2)}",
        "expect": "Compararás 16,67 ms, 8,33 ms y 5 ms por intervalo teórico."
      },
      {
        "title": "Comprobá el ajuste real",
        "why": "Abrí Configuración de pantalla avanzada y anotá el Hz seleccionado.",
        "code": "Start-Process 'ms-settings:display-advanced'",
        "expect": "El selector de frecuencia puede variar según monitor, conexión y drivers."
      }
    ],
    "tip": "Truco EVO: estudiá a la vez FPS, frametime y Hz activo; no confundas refresco con tiempo de respuesta de píxel.",
    "warning": "No fuerces resoluciones o overclock del panel fuera de modos admitidos; documentá el valor original.",
    "challenge": "Dibujá una línea temporal donde un monitor de 200 Hz recibe cuadros a 80 FPS y explicá por qué no entrega 200 cuadros distintos."
  },
  {
    "id": 152,
    "goal": "Encontrar qué recurso frena un juego antes de tocar configuraciones.",
    "basics": "Un cuello de botella aparece cuando un componente limita la tasa de trabajo: CPU, GPU, memoria, almacenamiento o sincronización. El componente que muestra más uso no siempre es el único culpable y hay que observar el sistema durante la misma escena de juego.",
    "steps": [
      {
        "title": "Anotá el hardware básico",
        "why": "CIM identifica procesador, GPU y memoria instalados, pero no mide rendimiento en partida.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors; Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion",
        "expect": "Se mostrarán especificaciones del sistema que sirven para contextualizar."
      },
      {
        "title": "Observá carga sin modificar procesos",
        "why": "Abrí el Administrador de tareas en Rendimiento y registrá CPU, GPU y Memoria antes y después.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Los porcentajes pueden variar; medilos cuando el juego reproduzca la misma situación."
      },
      {
        "title": "Registrá espacio disponible",
        "why": "La presión de espacio puede afectar cachés y cargas, pero no equivale a un cuello de botella gráfico.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,SizeRemaining,Size",
        "expect": "Obtendrás espacio por unidad; falta contrastar con frametimes para concluir."
      }
    ],
    "tip": "Truco EVO: si bajar la resolución mejora mucho los FPS podría indicar limitación gráfica, pero repetí la misma escena para confirmarlo.",
    "warning": "No desactives servicios ni drivers de video para diagnosticar un cuello de botella.",
    "challenge": "Creá una tabla CPU/GPU/RAM/FPS para dos resoluciones y explicá qué resultado apoyaría una hipótesis de límite de GPU."
  },
  {
    "id": 153,
    "goal": "Medir los tiempos de cuadro y no depender exclusivamente del contador de FPS.",
    "basics": "FPS promedio resume un intervalo; los frametimes muestran cuándo se entregó cada cuadro. Para investigar tirones se necesitan marcas temporales capturadas por una herramienta compatible, no un comando que solo cuenta procesos.",
    "steps": [
      {
        "title": "Calculá el tiempo ideal",
        "why": "Convertí una tasa estable a milisegundos por cuadro.",
        "code": "[pscustomobject]@{FPS80_ms=[math]::Round(1000/80,2);FPS100_ms=[math]::Round(1000/100,2);FPS144_ms=[math]::Round(1000/144,2)}",
        "expect": "Vas a ver 12,5, 10 y 6,94 ms; son resultados matemáticos, no capturas reales."
      },
      {
        "title": "Simulá un pico aislado",
        "why": "Calculá el promedio de un pequeño conjunto didáctico de tiempos.",
        "code": "$ms=10,10,10,40,10,10; [pscustomobject]@{Promedio_ms=($ms|Measure-Object -Average).Average;Maximo_ms=($ms|Measure-Object -Maximum).Maximum}",
        "expect": "El pico de 40 ms puede ser visible aunque los demás cuadros duren 10 ms."
      },
      {
        "title": "Registrá el entorno real",
        "why": "Consultá Hz activo y prepará una escena de prueba repetible para capturar frametimes con una herramienta de medición.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "La salida no contiene frametimes; una medición del juego requiere capturar cuadros."
      }
    ],
    "tip": "Truco EVO: guardá el CSV de tiempos de cuadro y compará percentiles, no solo el promedio del overlay.",
    "warning": "No presentes un cálculo con datos inventados como si proviniera de un juego real.",
    "challenge": "Explicá por qué una sesión con un pico de 40 ms puede sentirse peor aunque su FPS promedio siga siendo alto."
  },
  {
    "id": 154,
    "goal": "Investigar microtirones como variaciones abruptas de frametime en lugar de perseguir FPS máximos.",
    "basics": "Un microtirón es una irregularidad perceptible de entrega de cuadros. Puede coincidir con compilación de shaders, paginación, interrupciones, CPU saturada o actividad del juego; ninguna de esas causas se confirma con una sola captura.",
    "steps": [
      {
        "title": "Simulá variabilidad de tiempos",
        "why": "Usá una secuencia de ejemplo para practicar detección de picos sin modificar Windows.",
        "code": "$f=8,8,9,8,37,9,8,8; [pscustomobject]@{Media_ms=[math]::Round(($f|Measure-Object -Average).Average,2);Peor_ms=($f|Measure-Object -Maximum).Maximum}",
        "expect": "Un solo cuadro de 37 ms destaca sobre los de 8–9 ms. Los datos son sintéticos."
      },
      {
        "title": "Consultá presión general de memoria",
        "why": "El total de RAM libre ayuda como contexto, pero no prueba stutter ni paginación.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize",
        "expect": "Recibirás valores físicos en KiB, no la causa del tirón."
      },
      {
        "title": "Abrí Monitor de recursos",
        "why": "Durante una sesión controlada observá actividad de disco y procesos, anotando el segundo del síntoma.",
        "code": "Start-Process resmon.exe",
        "expect": "Una coincidencia temporal invita a investigar; no demuestra causalidad por sí sola."
      }
    ],
    "tip": "Truco EVO: marcá hora exacta del tirón y correlacioná registros, captura de frametime y E/S.",
    "warning": "No cambies temporizadores globales, HPET o drivers de video por rumores de microtirones.",
    "challenge": "Diseñá dos pruebas para diferenciar un pico aislado de GPU de una pausa causada por carga de disco."
  },
  {
    "id": 155,
    "goal": "Descomponer la latencia entre entrada, simulación, renderizado, presentación y panel.",
    "basics": "La latencia extremo a extremo empieza con un gesto o pulsación y termina con una imagen visible. No existe un porcentaje único de 'latencia de Windows': cada tramo depende de dispositivo, API, cola de cuadros, monitor y carga.",
    "steps": [
      {
        "title": "Calculá la duración de un cuadro",
        "why": "Con FPS constantes, el presupuesto de frame es aproximadamente 1000/FPS.",
        "code": "[pscustomobject]@{FPS60=[math]::Round(1000/60,2);FPS120=[math]::Round(1000/120,2);FPS200=1000/200}",
        "expect": "Se obtiene el tiempo ideal por cuadro, no la latencia completa del mouse."
      },
      {
        "title": "Consultá el monitor configurado",
        "why": "El controlador informa algunos parámetros de pantalla.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "El refresco no informa cuánto tarda un clic en iluminar píxeles."
      },
      {
        "title": "Identificá la ruta de entrada",
        "why": "Consultá dispositivos apuntadores y anotá periférico, conexión y software configurado.",
        "code": "Get-CimInstance Win32_PointingDevice | Select-Object Name,DeviceID",
        "expect": "Puede haber dispositivos lógicos además del mouse físico."
      }
    ],
    "tip": "Truco EVO: distinguí latencia de entrada medida con hardware de las aproximaciones basadas en frametime.",
    "warning": "No afirmes reducir 10 ms sin una metodología de medición extremo a extremo repetible.",
    "challenge": "Enumerá las etapas desde pulsar el mouse hasta ver el impacto del disparo en el monitor."
  },
  {
    "id": 156,
    "goal": "Comprobar bajo qué condiciones más FPS puede reducir el tiempo de espera para un cuadro.",
    "basics": "A tasas más altas, cada cuadro idealmente ocupa menos tiempo; sin embargo, CPU/GPU saturadas, colas de presentación, sincronización y variabilidad pueden alterar la latencia. Una mejora de FPS promedio no garantiza menos latencia percibida.",
    "steps": [
      {
        "title": "Compará presupuesto de cuadro",
        "why": "Relacioná distintas tasas ideales sin ejecutarlas en un juego.",
        "code": "60,90,120,200 | ForEach-Object { [pscustomobject]@{FPS=$_;MsPorCuadro=[math]::Round(1000/$_,2)} }",
        "expect": "Obtendrás intervalos teóricos cada vez menores."
      },
      {
        "title": "Registrá FPS y frametime objetivo",
        "why": "Calculá el intervalo que debería lograr una configuración limitada a 90 FPS.",
        "code": "[math]::Round(1000/90,2)",
        "expect": "Un resultado de 11,11 ms no prueba que la GPU complete cada cuadro dentro de ese tiempo."
      },
      {
        "title": "Investigá el contexto de sincronización",
        "why": "Comprobá frecuencia reportada y anotá V-Sync, VRR y límites desde los menús del juego.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "Sin medir input-to-photon no se pueden atribuir milisegundos exactos de retraso."
      }
    ],
    "tip": "Truco EVO: compará simultáneamente frametime, FPS y sensación de control con el mismo recorrido de juego.",
    "warning": "No desactives sincronización o protección térmica a ciegas para perseguir el máximo FPS.",
    "challenge": "Planteá cuándo un límite estable podría sentirse mejor que FPS mayores con picos."
  },
  {
    "id": 157,
    "goal": "Auditar promesas de aceleradores gaming y distinguir mejoras reproducibles de placebo.",
    "basics": "Los optimizadores venden ajustes de procesos, RAM y Registro como si todos impactaran FPS. Los cambios deben compararse en una escena repetible con varias mediciones y con revisión de seguridad, compatibilidad y reversión.",
    "steps": [
      {
        "title": "Documentá Windows antes de cualquier prueba",
        "why": "La compilación y edición hacen que algunas recetas no sean aplicables.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,Version",
        "expect": "Se informa la plataforma exacta de referencia."
      },
      {
        "title": "Tomá una muestra de procesos",
        "why": "El conteo solo caracteriza el estado del sistema.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Un número menor no demuestra mejor frametime ni estabilidad."
      },
      {
        "title": "Prepará un ensayo A/B",
        "why": "Anotá FPS promedio, 1% low, temperatura y fallos para A y B; no ejecutes optimizadores de origen dudoso.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled",
        "expect": "El firewall debe seguir protegiendo la PC; un tweak que lo desactive tiene un coste de seguridad."
      }
    ],
    "tip": "Truco EVO: exigí al vendedor datos crudos y metodología, no capturas con un único número verde.",
    "warning": "No instales ejecutables que prometan liberar RAM o tocar automáticamente decenas de claves del Registro.",
    "challenge": "Diseñá un experimento donde una supuesta mejora de FPS pueda descartarse estadísticamente."
  },
  {
    "id": 158,
    "goal": "Distinguir DPI, sensibilidad, polling rate y respuesta real del mouse.",
    "basics": "DPI/CPI mide cuentas de sensor por distancia; polling es frecuencia de informes; la sensibilidad del sistema y del juego transforman movimientos. Estos valores no equivalen directamente a input lag, que requiere medición aparte.",
    "steps": [
      {
        "title": "Identificá los periféricos vistos por Windows",
        "why": "La consulta no siempre refleja el sensor físico ni los perfiles del fabricante.",
        "code": "Get-CimInstance Win32_PointingDevice | Select-Object Name,DeviceID,NumberOfButtons",
        "expect": "Puede listar un mouse lógico y otros dispositivos de entrada."
      },
      {
        "title": "Consultá ajustes de Windows",
        "why": "MouseSensitivity y MouseSpeed describen parámetros del usuario; DPI depende del hardware.",
        "code": "Get-ItemProperty 'HKCU:\\Control Panel\\Mouse' | Select-Object MouseSensitivity,MouseSpeed,MouseThreshold1,MouseThreshold2",
        "expect": "Aparecerán valores almacenados, no Hz de polling ni DPI reales."
      },
      {
        "title": "Calculá eDPI del juego",
        "why": "Ejemplo didáctico: 1600 DPI × 0,37 de sensibilidad = 592 eDPI; la utilidad depende del motor.",
        "code": "[pscustomobject]@{DPI=1600;Sens=0.37;eDPI=1600*0.37}",
        "expect": "Verás 592 eDPI. La cifra no implica que apuntes mejor ni que tengas menor latencia."
      }
    ],
    "tip": "Truco EVO: medí distancia física por giro y errores de precisión antes de decidir que una sensibilidad es mejor.",
    "warning": "No descargues registros de mouse ni softwares para '0 ms' sin conocer el dispositivo y las mediciones.",
    "challenge": "Explicá por qué subir DPI y bajar sensibilidad puede conservar eDPI mientras cambia otro aspecto de la entrada."
  },
  {
    "id": 159,
    "goal": "Comparar frecuencias de refresco sin confundirlas con FPS ni respuesta de píxel.",
    "basics": "60, 120 y 200 Hz corresponden a intervalos de refresco teóricos de 16,67, 8,33 y 5 ms. Percibirás diferencias según movimiento, FPS, estabilidad y panel. Windows solo informa las frecuencias disponibles, no las sensaciones.",
    "steps": [
      {
        "title": "Calculá los tres intervalos",
        "why": "Usá matemática simple para observar el máximo ritmo ideal de actualización.",
        "code": "60,120,200 | ForEach-Object { [pscustomobject]@{Hz=$_;Refresco_ms=[math]::Round(1000/$_,2)} }",
        "expect": "Verás tres intervalos ideales; no son mediciones de ghosting."
      },
      {
        "title": "Verificá el valor reportado",
        "why": "La tarjeta gráfica puede exponer la tasa actual; no siempre es exacta.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "Compará con el valor mostrado en Configuración de pantalla avanzada."
      },
      {
        "title": "Abrí el selector oficial",
        "why": "Si tu monitor ofrece varios modos, anotá cuáles y utilizá solo los admitidos.",
        "code": "Start-Process 'ms-settings:display-advanced'",
        "expect": "Aparecerán opciones de frecuencia según controlador y conexión."
      }
    ],
    "tip": "Truco EVO: para una comparación subjetiva usá el mismo juego, ruta de cámara, FPS limitado y condiciones de luz.",
    "warning": "No fuerces modos personalizados fuera de especificaciones del monitor.",
    "challenge": "Contá cómo diseñarías una comparación de percepción sin decirle al participante qué Hz está activo."
  },
  {
    "id": 160,
    "goal": "Determinar cuándo cambiar resolución altera carga GPU, nitidez y visibilidad.",
    "basics": "El número de píxeles escala con ancho por alto, pero FPS no escala linealmente porque existen efectos gráficos, CPU y ancho de banda. Una resolución menor puede aumentar FPS y empeorar lectura de contornos.",
    "steps": [
      {
        "title": "Calculá la cantidad de píxeles",
        "why": "Compará tres resoluciones habituales sin cambiar la pantalla.",
        "code": "@(@(800,600),@(1280,720),@(1920,1080)) | ForEach-Object { [pscustomobject]@{Resolucion=\"$($_[0])x$($_[1])\";Pixeles=$_[0]*$_[1]} }",
        "expect": "Vas a ver 480000, 921600 y 2073600 píxeles; no son FPS."
      },
      {
        "title": "Consultá la resolución actual",
        "why": "La lectura de CIM informa el modo reportado por el driver.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentHorizontalResolution,CurrentVerticalResolution",
        "expect": "Puede reflejar escritorio y no la resolución interna exclusiva del juego."
      },
      {
        "title": "Planificá una comparación válida",
        "why": "Medí la misma escena con cada modo, fijando las demás opciones y dejando constancia de nitidez.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "El equipo contextualiza resultados; el comando no mide imagen ni FPS."
      }
    ],
    "tip": "Truco EVO: tratá la visibilidad del objetivo como métrica independiente de FPS.",
    "warning": "No cambies drivers gráficos ni parámetros de escalado para una prueba inicial de resolución.",
    "challenge": "Proponé una matriz de resoluciones con FPS promedio, 1% low y legibilidad de objetivos."
  },
  {
    "id": 161,
    "goal": "Aprender por qué limitar FPS a veces mejora consistencia y otras perjudica latencia.",
    "basics": "Un limitador fija un techo de cuadros; en escenarios sobrecargados puede estabilizar frametimes y consumo. La configuración ideal depende de si el límite es interno, del driver o del motor, y de cómo interactúa con VRR/V-Sync.",
    "steps": [
      {
        "title": "Conocé presupuestos de cuadro",
        "why": "Calculá cuánto dura un cuadro ideal en tres límites.",
        "code": "90,120,144 | ForEach-Object { [pscustomobject]@{CapFPS=$_;Objetivo_ms=[math]::Round(1000/$_,2)} }",
        "expect": "Los valores son metas de intervalo, no mediciones de estabilidad."
      },
      {
        "title": "Consultá la pantalla",
        "why": "El Hz activo es una restricción de presentación que influye sobre estrategias de sincronización.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "La lectura puede diferir del modo dentro del juego."
      },
      {
        "title": "Definí un ensayo de límites",
        "why": "Elegí tres caps dentro del menú del juego y medí la misma escena, guardando frametimes reales.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "El comando documenta parte del estado en segundo plano; el juego debe aportar la medición de cuadros."
      }
    ],
    "tip": "Truco EVO: medí 1% low, máximo frametime e input lag por separado antes de elegir un cap.",
    "warning": "No confundas FPS limitados con refresco físico del monitor y no prometas valores óptimos universales.",
    "challenge": "Decidí qué evidencia te haría elegir 90 FPS estables sobre 120 FPS con picos recurrentes."
  },
  {
    "id": 162,
    "goal": "Identificar saturación de CPU y memoria que podría perjudicar una partida.",
    "basics": "La CPU ejecuta lógica, física, IA, trabajo de controladores y preparación de cuadros. El porcentaje global puede ocultar saturación de uno o pocos núcleos; la RAM agotada agrava el problema mediante presión de memoria.",
    "steps": [
      {
        "title": "Consultá la topología",
        "why": "Número de procesadores lógicos no equivale a cuántos núcleos usa el juego.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors",
        "expect": "La CPU puede ser híbrida y exponer varios tipos de núcleo."
      },
      {
        "title": "Observá carga y procesos",
        "why": "El Administrador de tareas ofrece actividad instantánea y vista por procesador lógico.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Durante una partida, anotá carga de CPU, RAM y GPU; una única captura no determina la causa."
      },
      {
        "title": "Tomá una medida de memoria",
        "why": "La memoria disponible depende de cargas abiertas y de caché.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize",
        "expect": "Son valores en KiB para contextualizar la presión."
      }
    ],
    "tip": "Truco EVO: si el juego cae de FPS con GPU baja y un núcleo saturado, investigá cuello de CPU con captura reproducible.",
    "warning": "No fijes afinidad ni deshabilites núcleos siguiendo recetas sin probar rendimiento y estabilidad.",
    "challenge": "Explicá por qué 40% de CPU total podría coexistir con un hilo principal saturado."
  }
];
