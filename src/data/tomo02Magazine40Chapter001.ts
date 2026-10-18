/**
 * Investigación 001 — manuscrito editorial extendido.
 * Métodos de diagnóstico: no realiza cambios a Windows. Todos los ejemplos son simulados.
 * Los comandos no se ejecutan en la aplicación; se copian solo por decisión del lector.
 */
export type Windows40Page = {
  eyebrow: string;
  title: string;
  subtitle: string;
  paragraphs: readonly string[];
  focus: { label: string; text: string };
  laboratory?: { title: string; why: string; code: string; readout: string };
  visual?: 'flow' | 'cpu' | 'experiment' | 'network' | 'verdict';
  footnote: string;
};

export const EVO_WINDOWS40_001: readonly Windows40Page[] = [
  {
    eyebrow: 'EXPEDIENTE 001 / EL MISTERIO',
    title: '¿QUÉ HACE TU PC CUANDO NO ESTÁS?',
    subtitle: 'Una pantalla quieta no significa un sistema detenido. Aprendé a distinguir mantenimiento, actividad legítima y señales que requieren investigar.',
    paragraphs: [
      'Apagás el monitor, soltás el mouse y la habitación queda en silencio. Unos minutos después, el LED del almacenamiento parpadea; a veces se escucha un ventilador. ¿Windows sigue trabajando? Sí. ¿Eso demuestra que te espían, que hay un virus o que perdés rendimiento? No. Las tres afirmaciones requieren evidencia diferente.',
      'Un equipo moderno funciona como una ciudad con turnos de trabajo. El escritorio es solamente la vidriera. Detrás existen controladores, servicios, tareas temporizadas, procesos de usuario y componentes que esperan eventos. Una impresora puede avisar que terminó, el sistema puede renovar información de red o una aplicación puede sincronizar archivos. Ninguna de esas acciones requiere que tengas una ventana abierta.',
      'El objetivo de esta investigación no es perseguir cada proceso desconocido ni conseguir un supuesto Windows con cero actividad. Es aprender qué medir, cómo vincular una observación con su causa y qué conclusiones están justificadas por los datos. Para eso construiremos un expediente: qué ocurrió, cuándo, qué proceso estaba involucrado, qué operación realizó y cuál fue su resultado.',
      'Hay una distinción decisiva. Un proceso puede estar presente en memoria sin consumir CPU apreciable; puede acumular muchas horas de CPU desde que inició sin trabajar ahora; o puede despertar brevemente para resolver un evento y volver a esperar. La lista de procesos, sin una dimensión temporal, es una fotografía. Para investigar necesitamos una secuencia.'
    ],
    focus: { label: 'LA PREGUNTA CORRECTA', text: 'En lugar de “¿por qué hay tantos procesos?”, preguntá “¿qué actividad cambió en este intervalo, quién la originó y qué evidencia la relaciona con el síntoma?”.' },
    visual: 'flow',
    footnote: 'No se ha tomado ninguna medición de tu PC. Las hipótesis de esta página son ejemplos didácticos.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / ANATOMÍA INVISIBLE',
    title: 'CÓMO TRABAJA WINDOWS SIN TOCAR EL MOUSE',
    subtitle: 'Del programador de hilos al evento que despierta un servicio.',
    paragraphs: [
      'Un proceso es un contenedor de recursos: direcciones de memoria virtual, identificadores de objetos, permisos y uno o más hilos. Los hilos son las unidades que el planificador de Windows elige para ejecutar. Si no tienen trabajo quedan esperando; si reciben un evento pueden pasar al estado listo y luego ocupar un procesador lógico durante un intervalo. El sistema alterna miles de estas decisiones sin mostrar una ventana por cada una.',
      'Los servicios administrados por Service Control Manager pueden arrancar con Windows, iniciarse al solicitarlos una aplicación o activarse ante un evento de hardware, red o sistema. Ver “Detenido” en services.msc no demuestra un problema: muchos están diseñados para permanecer así hasta que hacen falta. Del mismo modo, una instancia de svchost.exe no es automáticamente sospechosa; puede alojar un servicio legítimo.',
      'El Programador de tareas agrega otra capa. Una definición puede solicitar ejecutar algo al iniciar sesión, a determinada hora, después de un evento o bajo condiciones como inactividad. Importa diferenciar tres cosas: que la tarea exista, que esté habilitada y que realmente se haya ejecutado. La mera presencia de una tarea en la biblioteca no prueba que haya hecho algo en el último minuto.',
      'También actúan componentes de almacenamiento y memoria. Windows puede mantener páginas en caché, liberar memoria reclamable o procesar metadatos de archivos. “RAM ocupada” tampoco equivale automáticamente a “RAM desperdiciada”. La memoria disponible incluye páginas que el sistema puede reutilizar sin esperar una escritura al disco. En una auditoría seria, CPU, memoria, disco y red se interpretan como variables distintas.',
      'Por último, actividad no significa daño. Un proceso que realiza una escritura de pocos kilobytes cada varios minutos puede ser perfectamente normal. El problema surge cuando ese patrón cambia, se correlaciona con un síntoma real o se combina con datos de procedencia poco confiables.'
    ],
    focus: { label: 'MODELO MENTAL EVO', text: 'EVENTO → HILO DESPIERTA → EL PLANIFICADOR ASIGNA CPU → EL PROCESO TRABAJA → EL HILO VUELVE A ESPERAR. La duración y la frecuencia importan más que contar iconos.' },
    visual: 'flow',
    footnote: 'Modelo simplificado de ejecución: el comportamiento real depende de versión, directivas, recursos e interrupciones.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / METROLOGÍA',
    title: 'EL ERROR QUE CAMBIA TODOS LOS DIAGNÓSTICOS',
    subtitle: 'CPU acumulada no es CPU instantánea. Working Set no es memoria comprometida.',
    paragraphs: [
      'Abrí PowerShell y ejecutá Get-Process. La columna CPU que devuelve ese cmdlet representa tiempo de procesador acumulado, expresado en segundos, desde que el proceso comenzó a ejecutarse. Un navegador abierto durante diez horas puede acumular miles de segundos de CPU y estar quieto mientras lo mirás. Ordenar por ese número y acusarlo de una sobrecarga actual sería un error de método.',
      'Para estimar el uso durante un período se necesitan dos muestras y una resta. Si un proceso gana 1,5 segundos de CPU mientras transcurren 5 segundos de reloj, utilizó el equivalente de 0,3 procesadores lógicos ocupados de forma continua. En una máquina con 12 procesadores lógicos, eso equivale aproximadamente al 2,5 % de su capacidad lógica total durante ese intervalo. No es una medida perfecta del rendimiento ni distingue tiempo de usuario y kernel; es un indicador reproducible de actividad.',
      'La memoria necesita el mismo cuidado. Working Set indica cuánta memoria física está actualmente asignada al conjunto residente de un proceso; puede incluir páginas compartidas con otros. Private Bytes y memoria comprometida describen cuestiones diferentes. Sumando Working Sets de 30 procesos podés contar varias veces páginas compartidas, de modo que esa suma no representa de forma fiable la RAM total utilizada por Windows.',
      'La capacidad de medición también tiene límites. Los procesos pueden aparecer y desaparecer entre muestras; las lecturas requieren permisos diferentes; los cambios breves pueden quedar ocultos por un promedio de cinco segundos. Un diagnóstico serio anota versión de Windows, plan de energía, aplicaciones abiertas, período observado y horario. Y repite el experimento para comprobar que no vio una coincidencia aislada.',
      'Podés contrastar la observación con Administrador de tareas o Monitor de recursos. Si dos herramientas difieren, verificá que comparan la misma métrica y el mismo intervalo. La palabra “CPU” no garantiza equivalencia matemática.'
    ],
    focus: { label: 'EJEMPLO SIMULADO — NO ES TU EQUIPO', text: 'ΔCPU = 1,5 s; Δtiempo = 5 s; 12 procesadores lógicos. Uso estimado del proceso = (1,5 / 5 / 12) × 100 = 2,5 % de la capacidad lógica total.' },
    visual: 'cpu',
    laboratory: {
      title: 'LAB 01 · DOS FOTOGRAFÍAS, UNA MEDICIÓN',
      why: 'Muestrea procesos durante cinco segundos, sin modificar configuración. La salida se ordena por mayor porcentaje estimado de CPU total.',
      code: '$n = [Environment]::ProcessorCount\n$a = @{}; Get-Process | Where-Object { $null -ne $_.CPU } | ForEach-Object { $a[$_.Id] = $_.CPU }\n$watch = [Diagnostics.Stopwatch]::StartNew()\nStart-Sleep -Seconds 5\n$watch.Stop(); $dt = $watch.Elapsed.TotalSeconds\nGet-Process | Where-Object { $a.ContainsKey($_.Id) -and $null -ne $_.CPU } |\n  ForEach-Object { [pscustomobject]@{Proceso=$_.ProcessName; PID=$_.Id; CpuPctSistema=[math]::Round((($_.CPU - $a[$_.Id]) / $dt / $n)*100,2)} } |\n  Sort-Object CpuPctSistema -Descending | Select-Object -First 12',
      readout: 'No es un contador de CPU instantáneo. Los porcentajes son promedios estimados; procesos que terminan entre muestras no aparecerán. Si la lectura da cero, no significa inactividad universal.'
    },
    footnote: 'Método aproximado basado en diferencias de tiempo de CPU; no es un sustituto de un trazado ETW.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / PLAN DE PRUEBAS',
    title: 'EL EXPERIMENTO QUE SEPARA MITOS DE HECHOS',
    subtitle: 'Tres escenarios, las mismas reglas y ninguna optimización destructiva.',
    paragraphs: [
      'Una sola captura no sirve para saber si un equipo tiene actividad anormal. Diseñá tres escenarios y mantené constantes las condiciones relevantes. Escenario A: reiniciá normalmente, esperá diez minutos para que el sistema estabilice las tareas de inicio y observá cinco minutos sin abrir programas nuevos. Escenario B: abrí las aplicaciones que usás habitualmente y repetí. Escenario C: volvé al escritorio y repetí tras dejar las aplicaciones en segundo plano. Si reiniciar no es conveniente, registrá esa diferencia.',
      'En cada escenario anotá la fecha, duración, consumo medio aproximado, máximos significativos, principales procesos activos y si hubo actividad de disco y red. El nivel de ruido del entorno importa: una actualización, sincronización o análisis en marcha puede cambiar por completo el ensayo. Eso no invalida la captura, pero exige documentarla. Nunca escondas una excepción para que el resultado parezca espectacular.',
      'Definí antes de observar qué considerarías relevante. Por ejemplo: un mismo proceso ocupa CPU reiteradamente durante varios intervalos y ese patrón coincide con una ralentización verificable. “Vi un pico” no satisface ese criterio. La repetición reduce el riesgo de atribuir causalidad a un evento incidental.',
      'La prueba no consiste en deshabilitar 30 servicios para obtener una barra verde. Ese enfoque introduce múltiples variables, puede empeorar seguridad y recuperabilidad y no permite saber qué cambio produjo el efecto. Primero investigamos; una posible intervención viene después, es específica, reversible y se valida con el mismo procedimiento.',
      'Separá siempre observación, hipótesis y conclusión. Observación: “una tarea terminó a las 03:21”. Hipótesis: “puede estar relacionada con el pico”. Evidencia adicional necesaria: historial, PID asociado, intervalo de ejecución y comportamiento de recursos. Conclusión admisible: solamente la que permitan sostener esos datos.'
    ],
    focus: { label: 'PROTOCOLO DE LABORATORIO EVO', text: 'Observá → definí hipótesis → tomá línea de base → repetí → correlacioná fuentes → descartá alternativas → recién entonces concluí.' },
    visual: 'experiment',
    footnote: 'Todos los escenarios se ejecutan en tu equipo si vos decidís hacerlo; esta publicación no captura ni simula tus resultados.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / RASTROS COMPROBABLES',
    title: '¿QUÉ TAREA SE EJECUTÓ MIENTRAS NO MIRABAS?',
    subtitle: 'La diferencia entre una tarea registrada, una ejecución real y un evento incidental.',
    paragraphs: [
      'La biblioteca del Programador de tareas permite inspeccionar definiciones: nombre, ruta, acciones, desencadenadores, condiciones y estado. Pero las definiciones son el plano de una obra, no el registro de lo construido. Para buscar ejecución real necesitás información de última ejecución, último resultado y, cuando está disponible y habilitado, el historial de eventos de la tarea.',
      'Get-ScheduledTask enumera tareas existentes. Get-ScheduledTaskInfo aporta marcas y resultados de ejecución asociados a una definición. Algunas entradas pueden carecer de historial útil, mostrar valores predeterminados o representar tareas que no se ejecutan desde hace tiempo. Interpretá esos casos como falta de evidencia, no como prueba de que alguien borró rastros.',
      'Elegí una tarea relacionada con mantenimiento cuyo nombre puedas verificar en tu propio sistema. Anotá su ruta completa antes de compararla con otras tareas homónimas. Si la ejecución coincide con un pico de disco, es una pista. Para establecer una relación más sólida necesitás duración, operación realizada y actividad asociada en el mismo intervalo.',
      'Windows también tiene trabajo bajo demanda que no proviene del Programador de tareas. Los servicios pueden responder a notificaciones del sistema, cargas de controladores o solicitudes de otras aplicaciones. Por eso un inventario exhaustivo de tareas no equivale a un mapa completo de cada operación del equipo.',
      'No borres tareas ni cambies sus desencadenadores durante este ejercicio. Alterarías el objeto que intentás investigar y podrías romper mantenimiento, controladores o procesos de recuperación.'
    ],
    focus: { label: 'PREGUNTA DE PERITAJE', text: 'Si una tarea dice “Ready”, ¿sabés si ya se ejecutó? No. Necesitás datos de última ejecución y, si existen, evidencias que la relacionen con el período estudiado.' },
    laboratory: {
      title: 'LAB 02 · AUDITAR TAREAS SIN MODIFICARLAS',
      why: 'La consulta evita ejecutar, deshabilitar o modificar tareas. Puede mostrar datos distintos según edición y permisos.',
      code: 'Get-ScheduledTask | Select-Object -First 20 TaskName,TaskPath,State\n\n$task = Get-ScheduledTask | Select-Object -First 1\nif ($task) {\n  $task | Get-ScheduledTaskInfo |\n    Select-Object LastRunTime,LastTaskResult,NextRunTime,NumberOfMissedRuns\n}',
      readout: 'La primera consulta lista definiciones. La segunda pide metadatos de una sola tarea; el resultado no describe CPU, disco ni el contenido de su trabajo.'
    },
    footnote: 'Referencia oficial: Microsoft Learn, Get-ScheduledTaskInfo; sus datos representan información de ejecución de tareas, no auditoría de procesos completa.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / TRÁFICO INVISIBLE',
    title: '¿CON QUIÉN HABLA TU PC?',
    subtitle: 'Una conexión no es sinónimo de espionaje. Una IP tampoco revela por sí sola qué datos se enviaron.',
    paragraphs: [
      'Mientras trabajás o esperás, Windows y las aplicaciones pueden negociar conexiones de red. Hora, licencias, sincronización de archivos, navegación, actualizaciones y notificaciones son causas posibles. La pregunta valiosa no es si hay conexiones —en un equipo conectado suele haberlas— sino qué proceso las abre, con qué destino, cuándo aparecen y cómo se relacionan con el comportamiento observado.',
      'Get-NetTCPConnection permite consultar conexiones TCP y su PID propietario cuando Windows dispone de esa información. Una conexión ESTABLISHED significa que se estableció una sesión TCP; no indica cuánto tráfico pasó, si hubo datos sensibles ni qué contiene un intercambio cifrado. Tampoco enumera todo el tráfico UDP. Y algunos procesos comparten servicios o lanzan ayudantes, por lo que la atribución debe verificarse.',
      'Una dirección IP remota no siempre identifica a una empresa única. El tráfico puede dirigirse a redes de distribución de contenido, intermediarios o infraestructuras compartidas. Consultar geolocalización como si fuera identidad del destinatario lleva a falsos positivos. Si realmente necesitás una atribución más profunda, correlacioná PID, ruta del ejecutable, firma, destino, hora, DNS y contexto.',
      'El paso siguiente, para un laboratorio avanzado, es una captura deliberada con herramientas como Wireshark o Process Monitor, bajo un protocolo que respete privacidad y autorizaciones. Una captura de paquetes puede incluir información de terceros o credenciales: no la publiques sin revisar y anonimizar. No inspecciones tráfico de equipos ajenos ni uses el procedimiento fuera de un entorno bajo tu control.',
      'Una captura puntual no demuestra que una aplicación no se comunique nunca. La ausencia de evidencia en un intervalo solo limita las conclusiones a ese intervalo y a la técnica de observación elegida.'
    ],
    focus: { label: 'VERDAD INCÓMODA', text: '“Mi PC se conectó a Internet” es una observación. “Windows me está espiando” es una hipótesis extraordinariamente más fuerte que requiere demostrar qué salió, por qué y hacia dónde.' },
    visual: 'network',
    laboratory: {
      title: 'LAB 03 · DESTINO Y PROCESO PROPIETARIO',
      why: 'Captura conexiones TCP establecidas en ese momento. No intercepta contenidos ni modifica la red.',
      code: 'Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue |\n  Select-Object -First 20 LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess\n\n# Elegí un PID de la columna OwningProcess\nGet-Process -Id 1234 -ErrorAction SilentlyContinue |\n  Select-Object ProcessName,Id,Path',
      readout: 'Sustituí 1234 por un PID real. Una conexión puede desaparecer antes de consultar el proceso; no interpretes esa desaparición como intrusión.'
    },
    footnote: 'Referencia oficial: Microsoft Learn, Get-NetTCPConnection (NetTCPIP).'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / CASO FORENSE',
    title: 'EL FALSO INTRUSO DE LAS 03:17',
    subtitle: 'Un caso didáctico que muestra por qué la correlación vale más que el susto.',
    paragraphs: [
      'ESCENARIO FICTICIO, NO CAPTURA REAL: Una persona vuelve a su computadora después de cenar. Dice que a las 03:17 se encendió el ventilador aunque nadie tocaba el teclado. En Administrador de tareas hay varios svchost.exe y el disco está activo. Busca en Internet “servicios secretos de Windows” y encuentra un video que recomienda eliminarlos. Nuestro equipo investigador no da ese salto.',
      'Primera hipótesis: una tarea legítima trabajó durante un intervalo. Segunda: un programa del usuario sincronizó archivos. Tercera: una operación de seguridad estaba en ejecución. Cuarta: un proceso inesperado consumió recursos. Ninguna es todavía la respuesta. Se anotan hora aproximada, duración, red activa, estado del equipo y si había trabajos pendientes.',
      'En el ejemplo, el historial de una tarea muestra una ejecución cerca de las 03:17. La medición de CPU tomada después de las 03:20 es baja. Ese dato no prueba que la tarea haya causado el pico: el intervalo observado es distinto. Se revisa el historial de ejecución, duración y los registros relevantes. Si otra prueba confirma actividad de la tarea en ese intervalo, la hipótesis gana respaldo. Si no, permanece abierta.',
      'Un análisis profesional también pregunta qué refutaría cada explicación. Si el ventilador se activó mientras el equipo estaba suspendido, importa estudiar primero si realmente seguía suspendido, si se reanudó y qué condiciones habilitan el encendido. Si había una descarga planificada, hay que correlacionarla. Si un proceso desconocido resulta llamativo, se revisan firma, ubicación y comportamiento antes de concluir que es malicioso.',
      'Veredicto del caso: “hay coincidencia temporal con una tarea” puede ser defendible; “Windows espía a todos de noche” no se desprende de los datos. La investigación termina cuando el grado de certeza coincide con la evidencia, no cuando el título parece suficientemente espectacular.'
    ],
    focus: { label: 'NORMA DE EVIDENCIA EVO', text: 'Una correlación temporal es una pista, no una prueba causal. La identidad del proceso, su operación y el intervalo observado deben coincidir.' },
    visual: 'verdict',
    footnote: 'Caso diseñado para enseñanza. Horarios, síntomas y resultados son ficticios, explícitamente separados de cualquier lectura real.'
  },
  {
    eyebrow: 'EXPEDIENTE 001 / CIERRE Y DESAFÍO',
    title: 'LA VERDAD ES MÁS INTERESANTE QUE EL MITO',
    subtitle: 'De la curiosidad al conocimiento: cómo cerrar un expediente y compartirlo con rigor.',
    paragraphs: [
      'Ya sabemos que Windows no permanece inmóvil cuando dejás de utilizarlo. Sabemos también que una captura aislada no alcanza para diagnosticar un problema. Hay servicios bajo demanda, tareas programadas, memoria reutilizable, hilos en espera, conexiones legítimas y decisiones del kernel que no necesitan mostrar una ventana. El sistema es activo y complejo; la cuestión es cuándo esa actividad se convierte en un problema verificable.',
      'Construí tu conclusión en tres niveles. Confirmado: observaciones directamente respaldadas por la consulta que realizaste. Compatible con los datos: explicaciones plausibles que todavía necesitan pruebas adicionales. No demostrado: afirmaciones para las que no obtuviste evidencia suficiente. Esta clasificación evita que un video viral transforme coincidencias en acusaciones.',
      'DESAFÍO EVO: registrá tres intervalos iguales de cinco minutos. Identificá un proceso con actividad medible y una tarea programada que tenga información de última ejecución. Explicá qué pudiste observar de cada uno, qué no te permite concluir la herramienta y qué dato adicional necesitarías para relacionarlos. Si no encontraste un caso llamativo, ese también es un resultado válido: un laboratorio no existe para fabricar anomalías.',
      'MITO: “cuantos más procesos veo, más lenta está la PC”. VERDAD: el número de procesos por sí solo no mide impacto. MITO: “una conexión TCP prueba robo de información”. VERDAD: falta identificar contenido, contexto y destino. MITO: “una tarea registrada ya se ejecutó”. VERDAD: su definición no equivale a evidencia de ejecución. Cada desmentida se sostiene en mecanismos que ahora podés explicar.',
      'Puente a la Biblia Virtual: profundizá en los sectores de Procesos, Servicios, Programador de tareas, Redes y Windows Performance Forensics. Allí están los mecanismos y laboratorios para llevar este primer expediente a otro nivel. Lo siguiente será aprender a distinguir un proceso residente legítimo de uno mal identificado sin destruir la estabilidad del sistema.'
    ],
    focus: { label: 'GUION PARA VIDEO / 45 SEGUNDOS', text: '“¿Tu PC trabaja mientras dormís? Sí. Pero el truco no es apagar servicios: es demostrar cuál está activo. Hoy medimos procesos, tareas y conexiones. Tres pruebas, cero cambios peligrosos. No lo creas. Comprobalo.”' },
    visual: 'verdict',
    footnote: 'Fuentes para ampliar: Microsoft Learn sobre tareas programadas y conexiones TCP; Microsoft Sysinternals Process Monitor y Process Explorer. Revisar compatibilidad con la versión concreta de Windows.'
  }
] as const;

export const EVO_WINDOWS40_001_REFERENCES = [
  { name: 'Get-ScheduledTaskInfo · Microsoft Learn', url: 'https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/get-scheduledtaskinfo' },
  { name: 'Get-NetTCPConnection · Microsoft Learn', url: 'https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection' },
  { name: 'Process Monitor · Microsoft Sysinternals', url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/procmon' },
  { name: 'Process Explorer · Microsoft Sysinternals', url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer' }
] as const;
