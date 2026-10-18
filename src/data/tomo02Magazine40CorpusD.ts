import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';
/** Memoria, CPU, latencia, optimización y Registro · 026–033. */
export const EVO_WINDOWS40_CORPUS_D: EvoWindowsResearch[] = [
  {
    "number": 26,
    "premise": [
      "Windows parece usar una cantidad enorme de RAM incluso cuando apenas hay ventanas abiertas. ¿Es un desperdicio? No necesariamente: memoria asignada a procesos, caché del sistema, memoria compartida, standby, páginas comprimidas y reservas del hardware no son la misma categoría. Un equipo con mucha caché puede estar aprovechando RAM disponible para acelerar lecturas.",
      "Lo que importa es si las aplicaciones sufren presión real de memoria, si aumenta el compromiso, si se producen fallos duros de página y si la experiencia empeora. La investigación convierte 'RAM ocupada' en un diagnóstico reproducible."
    ],
    "mechanisms": [
      "La memoria física se divide en páginas de distintos estados, incluida memoria en uso y memoria disponible/reutilizable. 'Working Set' se refiere a páginas residentes de un proceso y puede contener páginas compartidas. 'Private Bytes' expresa compromiso privado del proceso, no cuántos chips de RAM ocupa de forma exclusiva en ese instante.",
      "El compromiso de memoria virtual utiliza un límite relacionado con RAM y espacio de paginación, mientras cachés standby pueden ceder páginas cuando la carga las exige. La memoria reservada por firmware o GPU integrada reduce lo disponible para Windows y no representa una app que 'roba' memoria."
    ],
    "traps": [
      "Sumar Working Set de todas las apps sobrecuenta páginas compartidas. Afirmar que Windows usa 'X GB en reposo' sin edición, build, RAM total, cachés y servicios habilitados mezcla sistemas no comparables. Tampoco una cifra grande de caché equivale automáticamente a fuga.",
      "El botón 'liberar RAM' de una herramienta puede forzar expulsión de cachés útiles y aumentar el trabajo posterior de disco. Que después muestre más memoria libre no prueba mejor rendimiento."
    ],
    "protocol": [
      "Medí al inicio de sesión y después de diez minutos de trabajo normal. Consultá RAM física, memoria disponible y commit; anotá el conjunto de apps abiertas. Abrí un archivo o aplicación propia, repetí y observá qué parte de la memoria cambia.",
      "Para identificar a una app, contrastá memoria privada y Working Set de procesos con su comportamiento durante varias muestras, no con una sola foto. Si la presión aumenta, observá hard faults y aplicaciones que crecen sin liberar memoria al cesar el trabajo."
    ],
    "interpretation": [
      "Si Windows libera caché al iniciar una aplicación grande sin ralentización, ese comportamiento es un uso productivo de recursos. Si la memoria disponible cae persistentemente y coinciden picos de E/S y tiempos de respuesta, la presión puede ser real y merece identificar causa.",
      "Un equipo con GPU integrada puede reservar parte de memoria para gráficos; no extrapoles cifras de otro PC. El caso siempre debe consignar total físico, disponible, reservado y carga."
    ],
    "conclusion": [
      "El lector se lleva un lenguaje preciso: disponible, en uso, comprometida, residente, privada, caché. Esta distinción desarma recomendaciones simplistas y orienta mejoras legítimas como cerrar una aplicación que realmente crece o ampliar memoria cuando hay presión comprobada.",
      "No se optimiza memoria persiguiendo el máximo de 'libre'. Se optimiza la experiencia y el margen de trabajo manteniendo sus mecanismos de caché."
    ],
    "lab": {
      "title": "LAB 026 · INVENTARIO DE MEMORIA",
      "why": "Consulta RAM y contadores si están disponibles; no vacía cachés ni modifica archivo de paginación.",
      "code": "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory,TotalVirtualMemorySize,FreeVirtualMemory\nGet-Process | Sort-Object PrivateMemorySize64 -Descending | Select-Object -First 12 Name,Id,@{N='PrivateMB';E={[math]::Round($_.PrivateMemorySize64/1MB,1)}},@{N='WS_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}",
      "readout": "Los valores WMI de memoria suelen estar en KiB; no compares con MB sin convertir. PrivateMemorySize64 no equivale a RAM física exclusiva."
    },
    "insight": "Disponible no significa desperdiciada, y Working Set no representa lo mismo que memoria privada ni compromiso global.",
    "challenge": "Compará RAM disponible antes/después de abrir una aplicación y explicá el papel de la caché sin borrar nada.",
    "video": "¿Windows se come tu RAM? Primero aprendé cuánto es caché y cuánto es presión real.",
    "sources": [
      {
        "name": "Memory Performance Information — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/memory/memory-performance-information"
      },
      {
        "name": "Virtual Memory — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/memory/virtual-memory"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ]
  },
  {
    "number": 27,
    "premise": [
      "La frase 'desactivá pagefile.sys y Windows volará' aparece en casi todos los repertorios de optimizaciones extremas. Suena convincente: si tenés mucha RAM, el disco debería dejar de intervenir. Pero Windows utiliza memoria virtual con una política de compromiso, y el archivo de paginación puede elevar el límite disponible para procesos, permitir ciertos volcados de fallos y ofrecer flexibilidad de gestión.",
      "Este expediente no busca encontrar una configuración universal, sino entender compromisos y riesgos mediante métricas. Nadie debería borrar pagefile.sys sin saber cuánta memoria compromete su carga y qué recuperación necesita."
    ],
    "mechanisms": [
      "El compromiso de memoria corresponde a páginas para las que el sistema promete respaldo físico o de almacenamiento a demanda. 'Committed Bytes' y 'Commit Limit' indican uso y límite. La capacidad total de RAM y las unidades utilizadas no determinan por sí solas ese límite. Además, no toda página comprometida reside simultáneamente en RAM.",
      "Un hard fault significa que la página requerida no estaba disponible en memoria y necesita recuperarse de almacenamiento o archivo mapeado. No implica necesariamente pagefile.sys: puede proceder de un ejecutable o archivo mapeado. La actividad de pagefile y fallos duros necesita contexto."
    ],
    "traps": [
      "Ver pagefile.sys en el disco no significa que Windows esté 'escribiendo toda la RAM' a cada instante. Tampoco poner un archivo de paginación fijo mejora universalmente rendimiento. Un cambio mal diseñado puede provocar fallos de asignación y dejar al sistema sin volcados útiles tras un BSOD.",
      "El tamaño correcto depende de cargas, límites de compromiso, almacenamiento, políticas y necesidades de diagnóstico. Las publicaciones con un número exacto para todas las PC no son evidencia."
    ],
    "protocol": [
      "Medí Total, Committed Bytes y Commit Limit bajo carga real y en reposo. Anotá tamaño configurado del pagefile y si el sistema lo administra. No cambies nada en esta fase. Repetí durante una aplicación que consume memoria y observá cómo crece el compromiso.",
      "Si la carga requiere muchos datos simultáneos y el compromiso se acerca al límite, el riesgo es asignación fallida, no simplemente 'menor FPS'. Si el sistema mantiene amplio margen, no hay razón automática para tocarlo."
    ],
    "interpretation": [
      "El cociente Compromiso/Límite informa margen, no demuestra por sí solo actividad de swap ni rendimiento. Para atribuir demoras por memoria combiná uso de disco, fallos duros, tiempo de respuesta y aplicaciones que aumentan compromiso.",
      "Que una máquina funcione hoy sin archivo de paginación no demuestra que sea óptimo para todas sus cargas futuras, actualizaciones o recuperaciones de fallos."
    ],
    "conclusion": [
      "La conclusión técnica es preservar el mecanismo por defecto salvo una necesidad medida y documentada. La virtualización de memoria es un componente de confiabilidad, no una molestia creada para gastar SSD.",
      "El lector ahora puede explicar por qué 'tengo 32 GB' no es un argumento suficiente para modificar el compromiso y qué datos mostraría antes de aceptar un cambio."
    ],
    "lab": {
      "title": "LAB 027 · LÍMITE DE COMPROMISO",
      "why": "Muestra configuración y métricas de compromiso sin tocar pagefile.",
      "code": "Get-CimInstance Win32_PageFileUsage | Select-Object Name,AllocatedBaseSize,CurrentUsage,PeakUsage\nGet-CimInstance Win32_OperatingSystem | Select-Object TotalVirtualMemorySize,FreeVirtualMemory\nGet-Counter '\\Memory\\Committed Bytes','\\Memory\\Commit Limit' -MaxSamples 1 -ErrorAction SilentlyContinue",
      "readout": "El valor Commit Limit y la demanda de memoria virtual necesitan interpretarse juntos. Algunos contadores pueden faltar en Windows modificado; registrá esa limitación."
    },
    "insight": "Pagefile no es sinónimo de swap constante; tiene función en compromiso y diagnóstico de fallos.",
    "challenge": "Compará demanda comprometida y límite durante una carga conocida sin cambiar configuración.",
    "video": "Desactivar pagefile parece rápido... hasta que el compromiso supera lo que permitiste.",
    "sources": [
      {
        "name": "Virtual Memory — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/memory/virtual-memory"
      },
      {
        "name": "Get-Counter — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-counter"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ]
  },
  {
    "number": 28,
    "premise": [
      "Una app abre consumiendo 600 MB; después de varias horas aparece utilizando 3 GB y sigue creciendo aunque ya no trabajes en ella. Podría existir una fuga, pero también una caché intencional, crecimiento de pestañas, recursos compartidos o una carga que cambia. La distinción exige observar evolución, patrón y posibilidad de recuperación.",
      "El expediente ofrece un protocolo práctico para sospechar correctamente una fuga de memoria, sin confundir el Working Set con el compromiso privado y sin reiniciar una aplicación antes de conservar los datos."
    ],
    "mechanisms": [
      "Una aplicación asigna objetos, buffers, memoria virtual y a veces recursos gráficos. La memoria privada comprometida puede crecer por cachés administradas que se reducen bajo presión; el Working Set sube o baja según las decisiones del gestor de memoria. Una fuga auténtica implica pérdida de referencias o incapacidad de liberar recursos que ya no se necesitan.",
      "Hay fugas de memoria gestionada, nativa, handles y recursos de controladores; cada una se revela con métricas diferentes. El contador de handles puede indicar objetos no cerrados, pero también crece legítimamente con documentos, conexiones y pestañas."
    ],
    "traps": [
      "No diagnostiques una fuga por dos fotos separadas mientras la carga cambió. Tampoco sumar RAM total del proceso con GPU dedicada tiene sentido sin definir qué mide el contador. Una app que retiene caché útil no es necesariamente defectuosa.",
      "Cerrar a la fuerza un proceso en medio de una auditoría puede causar pérdida de datos y borrar la serie histórica. Si la app trabaja con archivos críticos, prepará guardado y condiciones de prueba antes de experimentar."
    ],
    "protocol": [
      "Definí una operación repetible en una aplicación propia: abrir y cerrar el mismo documento cinco veces. Medí PrivateMemorySize64, WorkingSet64, handles y tiempo tras cada ciclo, dejando intervalos comparables. Tomá línea de base antes de la primera operación.",
      "Tras terminar cada ciclo, observá si el consumo se estabiliza, se recupera bajo presión legítima o crece monótonamente. Si un recurso aumenta, intentá reproducir en otra ejecución de la app sin cambiar simultáneamente extensiones, drivers y versión."
    ],
    "interpretation": [
      "Un crecimiento monótono en ciclos iguales refuerza la hipótesis de retención, pero todavía no prueba que sea un bug: puede tratarse de cachés diferidas. La demostración exige relacionar objetos asignados con rutas de liberación y usar herramientas de perfilado específicas.",
      "Si la memoria privada aumenta y el Working Set disminuye, el proceso puede seguir comprometiendo páginas que dejaron de estar residentes. El diagnóstico se hace con ambas curvas, no con la cifra que resulte más dramática."
    ],
    "conclusion": [
      "Una fuga se descubre con un experimento que puede repetirse y con contadores adecuados. Cuando el lector presente el problema a un desarrollador, ya no dirá 'devora RAM', sino que aportará pasos, versión, serie de muestras y métrica observada.",
      "Esa ficha de reproducción puede acelerar una corrección más que cualquier optimizador de memoria. La calidad de la evidencia convierte al usuario en colaborador técnico real."
    ],
    "lab": {
      "title": "LAB 028 · CURVA DE UN PROCESO",
      "why": "Mide tu aplicación identificada por PID; no la cierra ni fuerza GC.",
      "code": "$pidObjetivo=1234 # Sustituí por PID propio y seguro\n1..6 | ForEach-Object { $p=Get-Process -Id $pidObjetivo -ErrorAction SilentlyContinue; if($p){ [pscustomobject]@{Hora=Get-Date;PID=$p.Id;PrivateMB=[math]::Round($p.PrivateMemorySize64/1MB,1);WorkingMB=[math]::Round($p.WorkingSet64/1MB,1);Handles=$p.Handles} }; Start-Sleep -Seconds 10 }",
      "readout": "Es una serie de observaciones; no verifica pérdidas de memoria por sí misma. Evitá reciclar un PID de otro proceso o medir cargas distintas."
    },
    "insight": "Fuga, caché y memoria residente tienen firmas diferentes; una captura no las distingue.",
    "challenge": "Repetí cinco ciclos de la misma acción y compará la pendiente de memoria privada frente a Working Set.",
    "video": "¿Tu navegador come RAM? No culpes a una cifra: buscá la curva.",
    "sources": [
      {
        "name": "Memory Performance Information — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/memory/memory-performance-information"
      },
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  },
  {
    "number": 29,
    "premise": [
      "Un juego muestra 120 FPS promedio, pero el mouse se siente irregular y el audio se corta un instante. A veces la causa no está en el motor del juego ni en la GPU: rutinas de interrupción (ISR), llamadas diferidas (DPC) y otros componentes de kernel pueden ocupar recursos críticos en momentos poco oportunos. La latencia no se resuelve con el número de FPS promedio.",
      "Este expediente explica qué parte puede atribuirse a Windows y controladores, qué métricas hacen falta y por qué capturas de LatencyMon requieren interpretación experta. No deshabilitaremos dispositivos ni controladores para perseguir un valor ideal."
    ],
    "mechanisms": [
      "Una ISR responde a una interrupción de hardware y suele realizar trabajo inmediato; un DPC pospone una parte para un nivel adecuado de ejecución. DPCs prolongados pueden retrasar otras operaciones en el mismo contexto y repercutir en tareas sensibles a tiempos, como audio en ciertas condiciones.",
      "El tiempo de DPC e ISR no equivale directamente a latencia de entrada a pantalla ni mide por sí solo el jitter de un juego. La cadena de interacción incluye dispositivo de entrada, controlador, planificador, CPU, cola gráfica, GPU y monitor. Cada segmento necesita instrumentación específica."
    ],
    "traps": [
      "Un proceso llamado System con CPU visible no identifica automáticamente un controlador culpable. Los picos de una herramienta no justifican eliminar drivers de red, audio o vídeo. Desactivar mitigaciones de seguridad para ganar microsegundos sin medir efectos introducirá variables y riesgos.",
      "Un informe que anuncia 'latencia cero' confunde conceptos. La latencia depende de hardware, frecuencia de trabajo, carga y métodos de captura; hay que definir si hablamos de DPC, ISR, frametime o click-to-photon."
    ],
    "protocol": [
      "Elegí una escena reproducible y registrá frametime, stutter y audio bajo la misma configuración. Consultá contadores disponibles de interrupciones/DPC sin cambiar drivers. Si necesitas más precisión, Windows Performance Recorder/Analyzer permite trazar CPU, DPC/ISR con filtros y un intervalo documentado.",
      "Anotá modelo de red, audio, almacenamiento y GPU solo como contexto; no modifiques servicios gráficos. Para comparar condiciones, cambiá una sola variable reversible e idealmente repetí en orden alternado A/B/A."
    ],
    "interpretation": [
      "Un pico DPC correlacionado con una interrupción de audio merece una investigación dirigida; no implica que el mismo controlador cause cada frame lento. La atribución requiere trazas ETW que vinculen duración, módulo y contexto.",
      "Si no se reproduce el problema durante la captura, el resultado es inconcluso, no señal de un Windows impecable. El método debe registrar qué observó y qué intervalo quedó sin cobertura."
    ],
    "conclusion": [
      "El lector podrá diferenciar FPS, frametime, DPC, ISR y latencia de extremo a extremo. Dejará de perseguir optimizaciones globales y aprenderá a formular una hipótesis concreta respaldada por telemetría adecuada.",
      "Una buena optimización puede consistir en encontrar una actualización de controlador que arregle un defecto medido, pero no se recomienda alterar gráficos sin una prueba que lo justifique."
    ],
    "lab": {
      "title": "LAB 029 · LATENCIA DEL SISTEMA",
      "why": "Lecturas de sistema no invasivas; para atribución de driver se recomienda trazado ETW dirigido.",
      "code": "Get-Counter '\\Processor(_Total)\\% DPC Time','\\Processor(_Total)\\% Interrupt Time' -SampleInterval 1 -MaxSamples 5 -ErrorAction SilentlyContinue\nGet-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,LastBootUpTime",
      "readout": "Los contadores pueden faltar o usar nombres localizados. No equivalen a latencia click-to-photon ni identifican un módulo sin un trazado específico."
    },
    "insight": "Stutter, DPC e ISR son mediciones distintas. No hay 'ajuste mágico de 0 ms'.",
    "challenge": "Relacioná un tirón reproducible con una captura de intervalos, y explicá qué instrumento faltaría para atribuirlo al driver.",
    "video": "120 FPS y aun así tirones: quizás el problema ocurre entre dos cuadros.",
    "sources": [
      {
        "name": "Windows Performance Recorder — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-recorder"
      },
      {
        "name": "Windows Performance Analyzer — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-analyzer"
      },
      {
        "name": "Get-Counter — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-counter"
      }
    ]
  },
  {
    "number": 30,
    "premise": [
      "Una PC se siente más rápida recién instalada que seis meses después. Parece una ley inevitable de Windows, pero hay muchas explicaciones: aplicaciones de inicio, extensiones, almacenamiento casi lleno, cargas nuevas, temperatura, cambios de controladores o incluso una percepción alterada por expectativas. Windows no se degrada automáticamente por el calendario.",
      "El expediente propone una auditoría longitudinal: medir el mismo trabajo y comparar entornos. Sin línea de base ni control de variables, los 'antes/después' de optimizadores venden correlación como causalidad."
    ],
    "mechanisms": [
      "El inicio de sesión carga servicios y apps declaradas de inicio; navegadores acumulan extensiones, y un equipo puede ejecutar más software con el tiempo. El almacenamiento pierde margen para cachés y escritura cuando está muy lleno. La gestión térmica puede reducir frecuencia sostenida bajo carga, especialmente en equipos compactos.",
      "El registro crece con instalaciones, pero su tamaño no determina universalmente la lentitud. Drivers, políticas, firmware y actualizaciones cambian el recorrido de cada operación. Una instalación limpia también carece de apps que luego serán necesarias, por lo que compararla es engañoso si las cargas no coinciden."
    ],
    "traps": [
      "La promesa de 'restaurar la velocidad del primer día' rara vez controla mismos programas, red, temperatura y tiempos de arranque. Una mejora por deshabilitar todo puede ocultar que se sacrificó funcionalidad, seguridad o recuperación.",
      "Eliminar archivos de sistema, historial y tareas sin plan puede producir 'velocidad' momentánea y fallos después. La mejora genuina tiene que conservar las funciones definidas como obligatorias."
    ],
    "protocol": [
      "Elegí tres tareas reproducibles: inicio hasta escritorio utilizable, apertura de una app y un archivo propio, y una carga sostenida corta. Documentá fecha, versión, energía, temperatura si disponés de sensores y recursos en reposo. No compares un inicio en frío con un retorno desde hibernación.",
      "Inventariá software de inicio y programas instalados. Si identificás un nuevo consumidor, registrá carga y origen. Cambiá una variable por vez con reversión disponible; repetí en orden A/B/A y aceptá que algunas variaciones sean ruido."
    ],
    "interpretation": [
      "Una caída gradual de espacio libre, junto con picos de actividad de disco y tiempo de respuesta, sugiere revisar almacenamiento, pero no prueba que sea la causa sin mediciones comparables. Una app lenta solo con red activa merece diagnóstico de conectividad antes que 'limpieza de Windows'.",
      "La ausencia de evidencia de degradación también cuenta: quizá cambió la carga, la resolución, la configuración de juego o la percepción. La conclusión de que 'Windows envejece' se rechaza si el experimento no la sostiene."
    ],
    "conclusion": [
      "El lector obtiene un protocolo de mantenimiento preventivo basado en síntomas y mediciones, no en rituales mensuales. La performance duradera depende más de conservar configuraciones estables y entender las cargas que de scripts agresivos.",
      "EVO LABS enseña que optimizar es comparar sobre condiciones controladas, no contar servicios desactivados."
    ],
    "lab": {
      "title": "LAB 030 · AUDITORÍA LONGITUDINAL",
      "why": "Registro de contexto y aplicaciones iniciales. Sin limpiar ni deshabilitar.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,OsBuildNumber,OsLastBootUpTime\nGet-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location,User\nGet-Volume -ErrorAction SilentlyContinue | Select-Object DriveLetter,FileSystemLabel,SizeRemaining,Size",
      "readout": "El listado de inicio puede ser incompleto frente a tareas, apps y políticas. Convertí unidades y registrá fecha antes de comparar."
    },
    "insight": "La lentitud se demuestra con una carga constante y un síntoma repetible, no con el paso del tiempo.",
    "challenge": "Medí tres operaciones hoy y conservá una base para repetirlas en un mes con igual procedimiento.",
    "video": "¿Windows se vuelve lento con los meses? Solo si podés demostrar qué cambió.",
    "sources": [
      {
        "name": "Autoruns — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      }
    ]
  },
  {
    "number": 31,
    "premise": [
      "Windows trae servicios, apps y componentes que quizás nunca abras. ¿Se están robando rendimiento? La presencia instalada y el consumo efectivo son magnitudes diferentes. Una app preinstalada que no se ejecuta ocupa almacenamiento, pero no necesariamente CPU; un servicio en ejecución puede esperar sin trabajar durante casi todo el día.",
      "La investigación enseña a cuantificar costo incremental de una función y evaluar consecuencias de quitarla. El debate deja de ser ideológico ('bloatware sí/no') y pasa a ser contable: memoria privada, CPU, disco, arranque, dependencia y reversión."
    ],
    "mechanisms": [
      "Windows dispone de servicios bajo demanda, paquetes de aplicaciones, trabajos programados, componentes de sistema y apps de terceros. Un programa instalado puede registrar una tarea automática o un proceso residente; otro solo inicia al usuario pedirlo. La arquitectura de servicios activados por eventos dificulta deducir costo desde el estado 'Running'.",
      "Algunos componentes comparten proceso y recursos, mientras otros se aíslan. Atribuir el Working Set total de svchost a un servicio concreto puede sobreestimar su costo. La comparación requiere el mismo intervalo y las mismas funciones del sistema habilitadas."
    ],
    "traps": [
      "'Servicio en ejecución = RAM desperdiciada' ignora que la memoria disponible puede ser reclamada y los hilos suelen estar esperando. 'Lo eliminé y gané 500 MB' ignora caché y cambios de la sesión después del reinicio.",
      "Una lista universal de servicios innecesarios es especialmente riesgosa para redes, Bluetooth, autenticación, audio, controladores y recuperación. Incluso si hoy no usás una función, una actualización o periferia puede necesitarla mañana."
    ],
    "protocol": [
      "Clasificá elementos en instalados, inicio automático, presentes y activos medibles. Tomá línea de base diez minutos después del inicio, medí intervalos idénticos y registrá origen del ejecutable. Identificá una app opcional y medí con ella abierta/cerrada de forma normal, sin tocar servicios del sistema.",
      "Para recomendar quitar algo, exigí tres pruebas: beneficio observable en una tarea relevante, ausencia de regresión funcional y mecanismo de reversión. Un recorte que rompe notificaciones o recuperación debe contabilizarse como costo."
    ],
    "interpretation": [
      "Una aplicación desinstalada puede liberar espacio en disco sin cambiar frametime. Un servicio ocioso puede conservar algo de memoria pero no explicar un 100 % de CPU. No confundas indicadores de estética del sistema con rendimiento.",
      "La carga real cambia según uso y hardware. Una herramienta de debloat que arroje un porcentaje de optimización sin línea de base ni pruebas A/B no ofrece evidencia."
    ],
    "conclusion": [
      "El lector aprende a diferenciar 'cosas instaladas' de 'trabajo activo' y a evaluar cambios por su impacto real. Así evita sacrificar funcionalidad por perseguir un contador inventado.",
      "El buen Windows minimalista no es el de menos íconos o servicios; es el que cumple objetivos medibles con estabilidad."
    ],
    "lab": {
      "title": "LAB 031 · COSTO DEL SOFTWARE INSTALADO",
      "why": "Inventario pasivo de programas de inicio y servicios.",
      "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command\nGet-Service | Group-Object Status | Select-Object Name,Count\nGet-Process | Sort-Object PrivateMemorySize64 -Descending | Select-Object -First 10 Name,Id,PrivateMemorySize64",
      "readout": "El recuento de servicios en estado Running no mide CPU ni RAM individual. Seleccioná una app opcional para un ensayo controlado."
    },
    "insight": "Instalado, iniciado y consumidor activo no significan lo mismo.",
    "challenge": "Encontrá una app realmente opcional y documentá el costo medido frente a tres funciones que no debe romper.",
    "video": "¿Windows viene cargado? Contar iconos no te dice qué te está frenando.",
    "sources": [
      {
        "name": "Get-Service — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service"
      },
      {
        "name": "Autoruns — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      },
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      }
    ]
  },
  {
    "number": 32,
    "premise": [
      "Windows minimalista suena como una promesa de liberación: menos servicios, menos tareas, menor RAM, más FPS. El peligro aparece cuando 'menos' se convierte en objetivo sin especificar qué trabajo debe seguir funcionando. Un sistema de juegos, otro de producción y uno de hospital requieren funciones y tolerancias muy diferentes.",
      "El expediente establece un método de optimización medible con presupuesto de riesgo: qué podés desactivar de forma reversible, qué no conviene tocar y qué prueba demostraría beneficio. No ofrece un script destructivo universal."
    ],
    "mechanisms": [
      "La experiencia de Windows depende de scheduler, servicios, drivers, políticas, seguridad, conectividad y tareas de mantenimiento. Una intervención en un punto puede cambiar otras funciones de forma diferida. Por eso la optimización se trata como un experimento con dependencias y pruebas de regresión.",
      "Rendimiento implica latencias, tiempos de carga, percentiles, memoria disponible y comportamiento bajo uso real. El número de servicios o porcentaje de RAM en reposo es solo contexto. Algunas funciones consumen pocos recursos pero protegen contra fallos o permiten recuperarse."
    ],
    "traps": [
      "Borrar Defender, Update, servicios gráficos o tareas de mantenimiento para 'ganar rendimiento' puede introducir exposición y dejar sin soporte el equipo; no es una recomendación profesional. Un Windows sin seguridad y sin actualizaciones no constituye una línea de base equivalente.",
      "Una mejora de un solo benchmark puede proceder de ruido térmico, caché o variación de servidores. Exigí múltiples repeticiones y control de variables; no atribuyas efectos a cinco cambios simultáneos."
    ],
    "protocol": [
      "Definí objetivos explícitos, por ejemplo 'reducir P95 de arranque de app' o 'mejorar percentil bajo de frametime sin perder red, audio, seguridad ni recuperación'. Guardá la configuración y una vía de retorno. Medí una condición A, introducí un cambio reversible autorizado, medí B y volvé a A para contrastar.",
      "Antes de cambiar nada elaborá tabla de dependencia: componente, función, razón de uso, riesgos, prueba, retorno. Empezá por aplicaciones de inicio de terceros y configuración de las propias apps, no por controladores o servicios críticos."
    ],
    "interpretation": [
      "Si una intervención muestra una ganancia menor que la variabilidad natural, se considera no demostrada. Si mejora una métrica pero rompe actualización, autenticación o estabilidad, su beneficio neto puede ser negativo.",
      "Es obligatorio reportar el costo: tiempos de recuperación, capacidad de revertir, funciones perdidas y mantenimiento futuro. Una optimización no es un concurso de desactivar más casillas."
    ],
    "conclusion": [
      "El lector se lleva una regla general de ingeniería: mínimo cambio, máxima trazabilidad, métricas definidas y retorno seguro. Esa disciplina diferencia una puesta a punto profesional de una lista viral de 'códigos ocultos'.",
      "El resultado más valioso puede ser concluir que no hay nada que desactivar porque la PC cumple los objetivos. Saber no tocar también es técnica."
    ],
    "lab": {
      "title": "LAB 032 · PLAN DE PRUEBA A/B",
      "why": "Consultas para documentar entorno sin cambiar servicios ni seguridad.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,OsBuildNumber,OsLastBootUpTime\nGet-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,Id,CPU",
      "readout": "Este laboratorio prepara la línea de base; no 'optimiza' al ejecutarse. CPU se expresa en tiempo acumulado y exige segunda muestra para hablar de carga."
    },
    "insight": "Minimalista significa cumplir funciones con menor costo medido, no quitar piezas hasta perder estabilidad.",
    "challenge": "Diseñá una intervención reversible en una app propia, tres métricas y una condición clara de rollback.",
    "video": "¿Cuántos servicios podés borrar? Esa es la pregunta equivocada. ¿Qué ganás sin perder?",
    "sources": [
      {
        "name": "Windows Performance Recorder — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-recorder"
      },
      {
        "name": "Windows Performance Analyzer — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-analyzer"
      },
      {
        "name": "Get-Service — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service"
      },
      {
        "name": "Autoruns — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ]
  },
  {
    "number": 33,
    "premise": [
      "El Registro de Windows parece una bóveda de interruptores secretos. En realidad es una base jerárquica de configuración usada por el sistema y muchas aplicaciones. Sus claves almacenan parámetros, pero no constituyen una lista uniforme de 'ajustes para acelerar'; algunas entradas documentadas son necesarias, otras dependen de edición y otras se ignoran.",
      "Esta investigación enseña a explorar el Registro como un técnico: distinguir colmenas, vistas 32/64 bits, políticas, tipos de datos, permisos y fuentes de verdad. El primer experimento será solo de lectura."
    ],
    "mechanisms": [
      "HKLM contiene configuraciones de equipo y componentes; HKCU representa la vista del usuario activo; HKCR expone una vista combinada de asociaciones de clases. Las colmenas físicas y la representación visible no se corresponden uno a uno. Windows aplica redirección y vistas distintas en ciertas rutas de 32/64 bits.",
      "Los tipos REG_DWORD, REG_QWORD, REG_SZ, REG_EXPAND_SZ, REG_MULTI_SZ y valores binarios tienen semánticas diferentes. Una clave puede ser preferencia histórica de una aplicación y no política vigente. Algunas configuraciones se administran mediante GPO, CSP u otras interfaces."
    ],
    "traps": [
      "Un valor ausente no significa automáticamente deshabilitado: muchas funciones tienen un predeterminado interno y algunas políticas solo se interpretan si se escriben explícitamente. Copiar claves de otro Windows puede generar un estado sin efecto o un conflicto difícil de diagnosticar.",
      "Modificar claves sin exportación previa, saber de permisos y plan de retorno puede afectar arranque, inicio de sesión y dispositivos. Los vídeos que cambian diez DWORD por minuto no establecen causalidad."
    ],
    "protocol": [
      "Elegí una preferencia no sensible visible en Configuración; buscá su documentación antes de consultar la ubicación del Registro. Registrá ruta, tipo, valor, origen y comportamiento, pero no la cambies durante la investigación. Si es una clave de políticas, verificá si la interfaz informa administración organizativa.",
      "Podés comparar HKCU con HKLM y consultar versiones de vistas 32/64 bits en equipos donde el componente lo requiera. Documentá exactamente qué usuario y proceso efectuó la consulta."
    ],
    "interpretation": [
      "Un valor devuelve evidencia del dato almacenado, no garantiza que un componente lo respete en ese momento. Para confirmar efecto se necesita probar el comportamiento de la función y revisar la documentación del proveedor.",
      "Las rutas pueden cambiar entre compilaciones. Una guía que no especifica build, arquitectura y contexto de usuario puede ser técnicamente incorrecta aun cuando su sintaxis funcione."
    ],
    "conclusion": [
      "El lector domina el Registro cuando puede explicar qué clave lee, quién la gestiona, cómo se interpreta y cómo se valida un cambio. No cuando recuerda cincuenta DWORD de Internet.",
      "El Registro es una herramienta de ingeniería y una fuente de evidencia, no una caja de trucos para saltarse el método."
    ],
    "lab": {
      "title": "LAB 033 · MAPA DEL REGISTRO",
      "why": "Consultas de lectura en claves no sensibles. No crea ni modifica valores.",
      "code": "Get-Item 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' | Select-Object Name,SubKeyCount,ValueCount\nGet-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' | Select-Object ProductName,CurrentBuild,DisplayVersion\nGet-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object Hidden,HideFileExt",
      "readout": "Los valores describen estado registrado; algunas claves antiguas no son autoridad suficiente sobre la versión vigente. Contrastá con Get-ComputerInfo y Configuración."
    },
    "insight": "Una clave no es un mecanismo de optimización; su efecto depende de quién la consume y en qué versión.",
    "challenge": "Seleccioná dos preferencias de interfaz y documentá dónde se interpretan, sin cambiarlas.",
    "video": "Regedit no es magia: es un mapa. ¿Sabés quién lee cada llave?",
    "sources": [
      {
        "name": "Get-ItemProperty — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-itemproperty"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ]
  }
];
