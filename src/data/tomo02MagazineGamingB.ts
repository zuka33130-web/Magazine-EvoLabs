import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Gaming II · Investigaciones 163–175. Incluye reto de 20 experimentos y límites de medición. */
export const EVO_MAGAZINE_GAMING_B: EvoMagazineArticle[] = [
  {
    "id": 163,
    "goal": "Identificar qué aplicaciones compiten por RAM, CPU, disco o red mientras jugás.",
    "basics": "Los procesos en segundo plano incluyen navegador, Steam, comunicaciones, sincronización y servicios legítimos. No todos consumen recursos de forma permanente y eliminarlos a la fuerza puede causar pérdida de datos o reinicios automáticos.",
    "steps": [
      {
        "title": "Contá los procesos de la sesión",
        "why": "Una cantidad elevada describe actividad, pero no significa que el equipo sea lento.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Obtendrás el total de procesos visibles para la sesión."
      },
      {
        "title": "Identificá aplicaciones exigentes",
        "why": "Ordená por memoria física residente aproximada, sin finalizar ninguna.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 12 Name,Id,@{N='MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}",
        "expect": "Aparecen procesos con mayor working set; la suma no equivale a RAM física total."
      },
      {
        "title": "Revisá inicios automáticos",
        "why": "Muchos programas de sesión pueden no ser necesarios para jugar, pero hay que identificarlos.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object -First 15 Name,Location",
        "expect": "Verás parte de las entradas automáticas, no servicios o todas las tareas."
      }
    ],
    "tip": "Truco EVO: antes de jugar, cerrá normalmente aplicaciones que reconocés y que no necesitás; compará consumo y frametime, no solo conteos.",
    "warning": "No termines procesos críticos ni componentes de Steam mientras hay una descarga o partida guardada.",
    "challenge": "Identificá tres procesos prescindibles para tu propia sesión y justificá su impacto medido y cómo restaurarlos."
  },
  {
    "id": 164,
    "goal": "Probar si el Modo Juego de Windows influye en tu equipo de forma reproducible.",
    "basics": "El Modo Juego puede ajustar la prioridad de ciertas tareas durante juegos, pero su efecto varía por versión, hardware y carga. Estar habilitado no garantiza un aumento de FPS ni equivale a reducir seguridad.",
    "steps": [
      {
        "title": "Abrí los controles oficiales",
        "why": "Revisá si la función existe y cuál es su estado antes de cualquier cambio.",
        "code": "Start-Process 'ms-settings:gaming-gamemode'",
        "expect": "Se abre la configuración del Modo Juego si tu edición la incluye."
      },
      {
        "title": "Registrá versión y hardware",
        "why": "El efecto no debe extrapolarse entre Windows diferentes.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber; Get-CimInstance Win32_Processor | Select-Object Name",
        "expect": "Los datos ayudan a identificar el entorno de la prueba."
      },
      {
        "title": "Diseñá A/B/A con un juego",
        "why": "Medí misma escena y misma carga; primero estado original A, después alternativa B, finalmente A de nuevo.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Esta cifra controla parte del entorno, pero la métrica de juego se mide aparte."
      }
    ],
    "tip": "Truco EVO: alternar A/B/A reduce el riesgo de confundir cambios por calentamiento o deriva temporal con el Modo Juego.",
    "warning": "No cambies diez opciones más durante la prueba, ni desactives protección en tiempo real.",
    "challenge": "Explicá por qué tres ejecuciones en la misma escena son mejores que una captura aislada de FPS."
  },
  {
    "id": 165,
    "goal": "Elegir un plan de energía por estabilidad, temperatura y consumo, no por su nombre.",
    "basics": "El plan de energía influye en preferencias de ahorro y respuesta, pero las CPU modernas también siguen políticas del firmware y límites térmicos. Alto rendimiento no significa siempre más FPS; puede aumentar consumo y ventilación.",
    "steps": [
      {
        "title": "Registrá el plan actual",
        "why": "Consultá su identificador sin cambiar de plan.",
        "code": "powercfg /getactivescheme",
        "expect": "Observarás el GUID y nombre del esquema activo."
      },
      {
        "title": "Listá esquemas disponibles",
        "why": "La lista no dice qué configuración será mejor para tu aplicación.",
        "code": "powercfg /list",
        "expect": "Pueden existir equilibrado u otros creados por fabricante."
      },
      {
        "title": "Identificá procesador y equipo",
        "why": "Las opciones de frecuencia y energía dependen de hardware y edición.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores; Get-CimInstance Win32_ComputerSystem | Select-Object Model",
        "expect": "Obtendrás modelo de referencia antes de decidir una prueba controlada."
      }
    ],
    "tip": "Truco EVO: medí estabilidad de FPS y ruido/temperatura además del consumo eléctrico si podés obtener datos confiables.",
    "warning": "No fuerces mínimos de CPU al 100% ni alteres BIOS/undervolt por una receta genérica.",
    "challenge": "Escribí qué medirías al comparar un esquema equilibrado con otro admitido por tu equipo."
  },
  {
    "id": 166,
    "goal": "Comprender cómo una GPU integrada utiliza memoria del equipo y compite por ancho de banda.",
    "basics": "Una iGPU comparte RAM con la CPU y puede mostrar memoria asignada y compartida. El uso efectivo depende de canales, frecuencia, configuración y carga; aumentar reserva gráfica en BIOS no agrega unidades de cómputo.",
    "steps": [
      {
        "title": "Inventariá la GPU instalada",
        "why": "Consultá nombre y controlador sin modificar el dispositivo.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,AdapterRAM",
        "expect": "AdapterRAM puede no ser fiable como VRAM física de una GPU integrada."
      },
      {
        "title": "Consultá módulos de RAM",
        "why": "Capacidad y frecuencia reportadas ayudan a interpretar ancho de banda disponible.",
        "code": "Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity,Speed,ConfiguredClockSpeed,DeviceLocator",
        "expect": "Podés encontrar uno o varios módulos; la velocidad no equivale a ancho de banda efectivo."
      },
      {
        "title": "Abrí vista gráfica de uso",
        "why": "Consultá Memoria GPU compartida y la actividad de motores gráficos.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Administrador de tareas depende del driver para exponer contadores; no ofrece todas las métricas."
      }
    ],
    "tip": "Truco EVO: si comparás 1 frente a 2 canales de memoria, documentá RAM y benchmark repetible en idéntica escena.",
    "warning": "No cambies DVMT ni ajustes de BIOS sin conocer compatibilidad, recuperación y efectos secundarios.",
    "challenge": "Explicá por qué una iGPU podría ganar más por ancho de banda que por reservar más RAM en firmware."
  },
  {
    "id": 167,
    "goal": "Evaluar si la memoria física o su configuración está limitando un juego.",
    "basics": "La capacidad insuficiente puede elevar presión de memoria, paginación y pausas; la configuración de canales y velocidad influye en CPU e iGPU. Un porcentaje de RAM alto por sí solo no demuestra problema, porque también existe caché recuperable.",
    "steps": [
      {
        "title": "Calculá RAM disponible aproximada",
        "why": "Usá un dato de Windows y no sumas de procesos para estimar memoria total.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{TotalGiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);LibreGiB=[math]::Round($os.FreePhysicalMemory/1MB,2)}",
        "expect": "Las cifras pueden diferir de la vista Disponible del Administrador de tareas."
      },
      {
        "title": "Consultá memoria comprometida desde la interfaz",
        "why": "Rendimiento > Memoria distingue Confirmada, En uso, Disponible y caché.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Registrá comprometida actual y límite; requieren interpretación distinta a RAM física."
      },
      {
        "title": "Revisá módulos y frecuencia",
        "why": "La clase de memoria describe capacidad y algunos parámetros físicos.",
        "code": "Get-CimInstance Win32_PhysicalMemory | Select-Object BankLabel,Capacity,ConfiguredClockSpeed",
        "expect": "No confirma de manera universal la topología de canales activos."
      }
    ],
    "tip": "Truco EVO: repetí el mismo benchmark con juego y aplicaciones abiertas, anotando pausas y paginación antes de recomendar más RAM.",
    "warning": "No deshabilites el archivo de paginación para 'liberar memoria' ni afirmes doble canal solo por tener dos módulos.",
    "challenge": "Explicá qué evidencia recomendaría agregar RAM y qué otra podría recomendar mejorar su configuración."
  },
  {
    "id": 168,
    "goal": "Calcular correctamente el 1% low a partir de tiempos de cuadro y aprender sus límites.",
    "basics": "En una definición frecuente, el 1% low es la frecuencia equivalente al tiempo promedio del 1% de cuadros más lentos. Algunas herramientas aplican otras convenciones: citá siempre herramienta y definición. Para datos reales necesitás un CSV de frametimes de tu juego.",
    "steps": [
      {
        "title": "Calculá el intervalo teórico",
        "why": "Convertí 100 FPS uniformes a milisegundos por cuadro.",
        "code": "[math]::Round(1000/100,2)",
        "expect": "El resultado de 10 ms es matemático, no una captura real."
      },
      {
        "title": "Usá una muestra didáctica de 100 cuadros",
        "why": "Con 99 cuadros de 10 ms y uno de 50 ms, el 1% más lento equivale al cuadro de 50 ms.",
        "code": "$f=@(1..99 | ForEach-Object {10})+@(50); $slow=$f|Sort-Object -Descending|Select-Object -First ([math]::Ceiling($f.Count*.01)); [math]::Round(1000/(($slow|Measure-Object -Average).Average),2)",
        "expect": "El ejemplo devuelve 20 FPS de 1% low según esta convención, pese a muchos cuadros rápidos."
      },
      {
        "title": "Prepará tu medición real",
        "why": "Guardá en CSV una secuencia de frametimes expresados en ms con una herramienta compatible, anotando duración, escena y ajustes.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate",
        "expect": "El comando solo documenta la pantalla; no genera frametimes y no debe usarse como medición del juego."
      }
    ],
    "tip": "Truco EVO: para comparar 1% low usá muestras extensas y de igual duración; una lista de pocos cuadros produce métricas inestables.",
    "warning": "No confundas el percentil de FPS instantáneos con la media del 1% de frametimes más lentos; verificá la convención de cada herramienta.",
    "challenge": "Calculá manualmente el 1% low didáctico y explicá por qué puede diferir de 100 FPS promedio."
  },
  {
    "id": 169,
    "goal": "Diagnosticar congelamientos breves distinguiendo CPU, disco, shaders y red.",
    "basics": "Una pausa de decenas de milisegundos puede provenir de muchas causas. La pérdida de red afecta el juego online, pero una detención real de renderizado necesita evidencia de frametime; sin captura es imposible atribuir causa con confianza.",
    "steps": [
      {
        "title": "Simulá una pausa de 80 ms",
        "why": "Contrastá el pico con un ritmo de 10 ms por cuadro.",
        "code": "$ms=10,10,10,80,10; [pscustomobject]@{Maximo_ms=($ms|Measure-Object -Maximum).Maximum;Promedio_ms=[math]::Round(($ms|Measure-Object -Average).Average,2)}",
        "expect": "Verás cuánto eleva el pico el promedio de la muestra sintética."
      },
      {
        "title": "Observá disco y memoria",
        "why": "Abrí Monitor de recursos durante una reproducción del problema.",
        "code": "Start-Process resmon.exe",
        "expect": "La vista permite buscar actividad coincidente, sin garantizar que sea la causa."
      },
      {
        "title": "Registrá eventos recientes",
        "why": "Los errores de sistema y controladores pueden correlacionarse con la hora.",
        "code": "Get-WinEvent -LogName System -MaxEvents 12 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Un evento puede ser relevante o incidental; no prueba por sí solo el origen del tirón."
      }
    ],
    "tip": "Truco EVO: registrá la hora exacta del freeze y compará tres capturas del mismo escenario antes de cambiar configuración.",
    "warning": "No desactives servicios gráficos Intel ni alteres drivers sin un diagnóstico que lo justifique.",
    "challenge": "Creá un árbol de causas y una evidencia diferenciadora para disco, CPU, GPU, red y shaders."
  },
  {
    "id": 170,
    "goal": "Separar el papel del SSD en carga de recursos del trabajo de renderizado.",
    "basics": "Un SSD puede acelerar carga de mapas, texturas y lecturas del sistema, pero no multiplica por sí mismo la capacidad de cálculo de GPU o CPU. Algunos juegos sufren tirones por streaming de archivos; eso requiere capturas y correlación de actividad.",
    "steps": [
      {
        "title": "Identificá medios de almacenamiento",
        "why": "Get-PhysicalDisk suele ofrecer tipo de medio si el controlador lo informa.",
        "code": "Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus,Size",
        "expect": "MediaType puede figurar Unspecified; es una pista, no un benchmark."
      },
      {
        "title": "Comprobá espacio libre",
        "why": "Poco espacio disponible puede complicar actualizaciones, cachés y archivos de juego.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,SizeRemaining,Size",
        "expect": "Compará espacio libre entre discos y particiones."
      },
      {
        "title": "Observá E/S mientras cargás un juego",
        "why": "Usá Monitor de recursos en la pestaña Disco para anotar procesos con lecturas.",
        "code": "Start-Process resmon.exe",
        "expect": "Podrás observar actividad, pero un SSD rápido no garantiza ausencia de stuttering."
      }
    ],
    "tip": "Truco EVO: medí por separado tiempo de carga y frametimes durante la partida; son indicadores diferentes.",
    "warning": "No desfragmentes intensivamente SSD ni ejecutes optimizadores milagrosos para ganar FPS.",
    "challenge": "Proponé una prueba que demuestre mejora en carga de mapas sin afirmar mejora en FPS."
  },
  {
    "id": 171,
    "goal": "Aprender a distinguir límites térmicos de ahorro energético o variaciones normales de frecuencia.",
    "basics": "Una CPU puede reducir frecuencia por reposo, límite de potencia, restricciones térmicas o políticas del firmware. Para afirmar thermal throttling necesitás sensores de temperatura y estado de límites confiables, además de una carga reproducible.",
    "steps": [
      {
        "title": "Anotá la CPU y sus frecuencias reportadas",
        "why": "Los valores CIM pueden ser nominales, promedios o desactualizados en algunas plataformas.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,MaxClockSpeed,CurrentClockSpeed",
        "expect": "No interpretes CurrentClockSpeed por sí solo como indicador de temperatura."
      },
      {
        "title": "Consultá el plan energético",
        "why": "El perfil afecta comportamiento de frecuencia, aunque no mide límites térmicos.",
        "code": "powercfg /getactivescheme",
        "expect": "Verás el esquema activo sin modificar el sistema."
      },
      {
        "title": "Registrá el contexto de la caída de FPS",
        "why": "Anotá ventilación, carga, minuto de partida y temperatura medida por una fuente adecuada si existe.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "El fabricante y modelo sirven para localizar límites y sensores documentados."
      }
    ],
    "tip": "Truco EVO: si cae la frecuencia sin subir la temperatura, investigá límites de potencia y carga antes de culpar al calor.",
    "warning": "No fuerces límites térmicos, desarmes equipos energizados ni hagas undervolt sin conocimientos y respaldo.",
    "challenge": "Explicá tres causas distintas de una baja de MHz que no sean fallo del procesador."
  },
  {
    "id": 172,
    "goal": "Construir un protocolo de optimización competitiva sin supersticiones de Registro.",
    "basics": "La optimización para esports prioriza repetibilidad, estabilidad, visibilidad y seguridad. Las pruebas deben conservar hardware, mapa, escena, versión de juego y condiciones equivalentes; pequeñas diferencias pueden ser ruido experimental.",
    "steps": [
      {
        "title": "Registrá tu plataforma",
        "why": "Anotá compilación, procesador y gráficos para poder repetir la prueba.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber; Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion",
        "expect": "Los datos no describen la versión interna del juego; anotala aparte."
      },
      {
        "title": "Registrá energía y procesos",
        "why": "Documentá el contexto de fondo antes del benchmark.",
        "code": "powercfg /getactivescheme; Get-Process | Measure-Object | Select-Object Count",
        "expect": "Obtendrás estado de energía y número de procesos sin modificarlos."
      },
      {
        "title": "Planificá comparaciones A/B/A",
        "why": "Elegí una variable, tres repeticiones por estado y el mismo recorrido de la partida.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfLogicalProcessors",
        "expect": "La CPU se identifica como referencia; medí FPS, 1% low y estabilidad con una captura real."
      }
    ],
    "tip": "Truco EVO: rechazá resultados cuyo efecto sea menor que la variabilidad natural observada en la serie.",
    "warning": "No modifiques servicios esenciales ni arranques scripts masivos mientras medís; aislá variables.",
    "challenge": "Escribí una hipótesis de mejora y el criterio preciso que usarías para refutarla."
  },
  {
    "id": 173,
    "goal": "Comprobar si subir la prioridad de un juego realmente aporta una mejora.",
    "basics": "La clase de prioridad influye en la planificación de hilos, pero no crea capacidad de CPU ni mejora el rendimiento de un juego limitado por GPU. Prioridades extremas pueden afectar audio, escritorio y respuesta de otros componentes.",
    "steps": [
      {
        "title": "Consultá prioridades existentes",
        "why": "La lectura no cambia programación ni interfiere con las aplicaciones.",
        "code": "Get-Process | Select-Object -First 15 Name,Id,PriorityClass",
        "expect": "Algunos procesos pueden requerir permisos para consultar esta propiedad."
      },
      {
        "title": "Revisá capacidad de CPU",
        "why": "El número de procesadores lógicos ayuda a contextualizar la carga de hilos.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors",
        "expect": "No permite predecir ganancia por prioridad."
      },
      {
        "title": "Diseñá una prueba segura sin cambiar prioridades",
        "why": "Primero medí estabilidad de FPS, CPU y frametimes en condiciones normales.",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,Id,CPU",
        "expect": "CPU es tiempo acumulado, no el porcentaje instantáneo del proceso."
      }
    ],
    "tip": "Truco EVO: si no hay contención real por CPU, subir prioridad puede no cambiar nada.",
    "warning": "No apliques prioridad Tiempo real ni fijes cambios persistentes en Registro a procesos del sistema.",
    "challenge": "Explicá por qué elevar prioridad no arregla un cuello de botella de memoria o GPU."
  },
  {
    "id": 174,
    "goal": "Convertir tu propia PC en un banco de pruebas esports con registros reproducibles.",
    "basics": "Un laboratorio útil controla hardware, Windows, energía, juego, mapa, resoluciones, red, periféricos y condiciones de sesión. Los resultados deben citar fecha, herramienta y método; un máximo de FPS aislado no es una evaluación.",
    "steps": [
      {
        "title": "Construí el pasaporte del equipo",
        "why": "Tomá sistema, CPU, GPU y memoria en una ficha inicial.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,TotalVisibleMemorySize; Get-CimInstance Win32_Processor | Select-Object Name; Get-CimInstance Win32_VideoController | Select-Object Name",
        "expect": "Se muestran especificaciones que ayudan a reproducir el entorno."
      },
      {
        "title": "Registrá conectividad y energía",
        "why": "El estado de adaptadores y plan de energía influye en comparaciones.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed; powercfg /getactivescheme",
        "expect": "Esto no reemplaza medir latencia real de una partida."
      },
      {
        "title": "Diseñá tu tabla de pruebas",
        "why": "Elegí mapa y escena constantes; anotá FPS, 1% low, picos de frametime y notas de precisión.",
        "code": "[pscustomobject]@{Fecha=Get-Date;Procesos=(Get-Process|Measure-Object).Count}",
        "expect": "Se genera una muestra de contexto en pantalla; los FPS reales se miden con herramienta externa fiable."
      }
    ],
    "tip": "Truco EVO: nombrá cada expediente por fecha, escenario y único parámetro modificado.",
    "warning": "No publiques archivos con identificadores personales, IP, seriales ni contraseñas incluidas en informes.",
    "challenge": "Diseñá tres ensayos para sensibilidad, resolución y FPS cap sin cambiar dos variables a la vez."
  },
  {
    "id": 175,
    "goal": "Realizar 20 experimentos de gaming para encontrar una configuración estable para tu hardware.",
    "basics": "El reto reúne mediciones controladas y comparables: no busca una configuración universal ni promete duplicar FPS. Cada experimento debe registrar hipótesis, estado anterior, única variable, tres repeticiones, frametimes y efectos secundarios.",
    "steps": [
      {
        "title": "Registrá línea base de Windows",
        "why": "Anotá procesador, gráficos, frecuencia del monitor y plan de energía.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,CurrentRefreshRate,DriverVersion; powercfg /getactivescheme",
        "expect": "Las lecturas sirven como contexto, no son un benchmark de gaming."
      },
      {
        "title": "Prepará variables y pruebas",
        "why": "Planificá veinte pruebas independientes de una sola variable por ensayo.",
        "code": "[pscustomobject]@{Fecha=Get-Date;Procesos=(Get-Process|Measure-Object).Count;RAMLibreKiB=(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory}",
        "expect": "Obtendrás contexto inicial para registrar en una hoja de resultados."
      },
      {
        "title": "Definí criterios de aceptación",
        "why": "Una mejora válida debe repetirse y mantener estabilidad, visibilidad y funciones esenciales.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled",
        "expect": "Verificá que ajustes de rendimiento no hayan debilitado protección ni funcionalidad."
      }
    ],
    "tip": "Truco EVO: el reto incluye 1 resolución, 2 escalado, 3 preset gráfico, 4 texturas, 5 sombras, 6 partículas, 7 antialiasing, 8 filtro, 9 reescalado temporal, 10 HDR del motor, 11 FPS cap, 12 VRR, 13 V-Sync, 14 modo ventana, 15 Modo Juego, 16 plan de energía, 17 apps propias en segundo plano, 18 navegador cerrado normalmente, 19 mouse DPI/sens y 20 repetibilidad de una escena fija.",
    "warning": "No reduzcas seguridad, apagues protección, elimines servicios críticos ni fuerces firmware para conseguir un resultado más atractivo.",
    "challenge": "Completá veinte fichas con objetivo, cambio, métricas y reversión; seleccioná sólo las mejoras que superen la variación natural de la medición."
  }
];
