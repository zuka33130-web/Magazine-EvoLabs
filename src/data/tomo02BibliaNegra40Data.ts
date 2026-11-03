export interface ExpedienteTomo02 {
  id: number;
  numberStr: string;
  blockNumber: string;
  blockTitle: string;
  level: 'BÁSICO' | 'INTERMEDIO' | 'AVANZADO';
  title: string;
  hook: string;
  paragraphs: [string, string];
  verifiableData: string;
}

export interface BloqueTomo02 {
  id: string;
  number: string;
  title: string;
  count: number;
  description: string;
  expedientesRange: string;
}

export const BLOQUES_TOMO_02: BloqueTomo02[] = [
  {
    id: 'I',
    number: 'I',
    title: 'NÚCLEO Y ARRANQUE',
    count: 8,
    description: 'Lo que ocurre en tu PC antes, durante y después de que aparece el escritorio. El sistema nunca duerme del todo.',
    expedientesRange: 'Expedientes 001–008',
  },
  {
    id: 'II',
    number: 'II',
    title: 'TU PRIVACIDAD BAJO LA LUPA',
    count: 8,
    description: 'Qué sabe Windows de vos, qué comparte y qué podés controlar realmente desde la configuración oficial del sistema.',
    expedientesRange: 'Expedientes 009–016',
  },
  {
    id: 'III',
    number: 'III',
    title: 'PERSISTENCIA Y SEGURIDAD',
    count: 8,
    description: 'Cómo saber si alguien más está usando tu equipo y qué defensas de fábrica probablemente nunca activaste.',
    expedientesRange: 'Expedientes 017–024',
  },
  {
    id: 'IV',
    number: 'IV',
    title: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    count: 8,
    description: 'Ajustes reales, medibles y reversibles para exprimir cada recurso de tu hardware sin arriesgar la estabilidad del sistema.',
    expedientesRange: 'Expedientes 025–032',
  },
  {
    id: 'V',
    number: 'V',
    title: 'COMANDOS, PERSONALIZACIÓN E IA',
    count: 8,
    description: 'Las herramientas, atajos y funciones de inteligencia artificial que transforman la forma de usar Windows cada día.',
    expedientesRange: 'Expedientes 033–040',
  },
];

export const EXPEDIENTES_TOMO_02: ExpedienteTomo02[] = [
  {
    id: 1,
    numberStr: '001',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'BÁSICO',
    title: '¿Qué hace tu PC cuando no estás?',
    hook: 'Mientras la pantalla está apagada, Windows sigue despierto.',
    paragraphs: [
      'Windows ejecuta tareas de «mantenimiento automático» a diario (por defecto a las 2:00 a. m.) definidas en el Programador de tareas. Si el equipo está en suspensión, usa temporizadores de activación (wake timers) para despertarlo brevemente.',
      'Durante esa ventana limpia archivos temporales, optimiza unidades, ejecuta un análisis de Windows Defender y aplica actualizaciones pendientes, todo sin que veas una sola ventana en pantalla.',
    ],
    verifiableData:
      'Abrí el Programador de tareas (taskschd.msc) → Microsoft → Windows → Maintenance para ver y reprogramar el horario exacto del mantenimiento automático de tu equipo.',
  },
  {
    id: 2,
    numberStr: '002',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'BÁSICO',
    title: 'Tu PC ejecuta decenas de procesos: ¿qué están haciendo realmente?',
    hook: 'Cada proceso es una fotografía de lo que tu sistema necesita para funcionar.',
    paragraphs: [
      'Con Ctrl+Shift+Esc abrís el Administrador de tareas. La pestaña «Detalles» muestra nombre, PID, descripción y consumo real de CPU, memoria y disco de cada proceso activo.',
      'La pestaña «Rendimiento» desglosa en tiempo real el uso de CPU, memoria comprometida (Commit Charge), disco, red y GPU, el panel de diagnóstico más completo que trae Windows de fábrica.',
    ],
    verifiableData:
      'Clic derecho sobre cualquier proceso → «Abrir ubicación del archivo» para confirmar que el ejecutable es legítimo y no malware disfrazado con un nombre similar.',
  },
  {
    id: 3,
    numberStr: '003',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'INTERMEDIO',
    title: 'El misterio de svchost.exe: ¿por qué hay tantos procesos iguales?',
    hook: 'Un mismo nombre, decenas de instancias: así protege Windows sus propios servicios.',
    paragraphs: [
      'svchost.exe (Service Host) es el proceso genérico que aloja servicios de Windows compilados como bibliotecas DLL en lugar de ejecutables independientes.',
      'Desde Windows 10 (build 1703), si el equipo tiene más de 3.5 GB de RAM, cada servicio corre en su propia instancia aislada de svchost.exe: si uno falla, no arrastra a los demás.',
    ],
    verifiableData:
      'En el Administrador de tareas, expandí cualquier «Host de servicio» haciendo clic en la flecha para ver qué servicios concretos aloja cada instancia, con nombre y descripción real.',
  },
  {
    id: 4,
    numberStr: '004',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'INTERMEDIO',
    title: 'Windows trabaja solo: las tareas que se ejecutan sin abrir ventanas',
    hook: 'Backups, sincronización e indexado corren en silencio todo el tiempo.',
    paragraphs: [
      'Servicios como Windows Search (indexado para búsquedas rápidas), BITS (transferencia inteligente en segundo plano para actualizaciones) y la sincronización de OneDrive funcionan sin interfaz visible.',
      'Podés auditarlos desde services.msc o viendo el historial de actividad del Monitor de recursos, que separa el consumo por servicio y no solo por proceso.',
    ],
    verifiableData:
      'Ejecutá resmon.exe (Monitor de recursos) → pestaña CPU → expandí «Servicios» para ver qué servicio específico está consumiendo recursos en segundo plano ahora mismo.',
  },
  {
    id: 5,
    numberStr: '005',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'AVANZADO',
    title: 'Antes del escritorio: todo lo que Windows hace sin que lo veas',
    hook: 'El arranque real empieza mucho antes de ver el logo de Windows.',
    paragraphs: [
      'La secuencia real es: firmware UEFI → Gestor de arranque (bootmgfw.efi) lee la BCD (Boot Configuration Data) → cargador winload.efi → núcleo ntoskrnl.exe y el HAL.',
      'Luego arrancan smss.exe (gestor de sesiones), csrss.exe y wininit.exe, después services.exe inicia todos los servicios y lsass.exe gestiona la autenticación, hasta que winlogon.exe finalmente lanza explorer.exe.',
    ],
    verifiableData:
      'Ejecutá «bcdedit /enum» en una consola como administrador para ver la configuración real de arranque de tu equipo: partición EFI, tiempo de espera y sistema por defecto.',
  },
  {
    id: 6,
    numberStr: '006',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'INTERMEDIO',
    title: '¿Qué pasa si desaparece explorer.exe? El escritorio no es Windows',
    hook: 'Podés matar el escritorio y el sistema sigue vivo.',
    paragraphs: [
      'explorer.exe es solo la «shell» gráfica: escritorio, barra de tareas y Explorador de archivos. No es el sistema operativo, es una capa visual sobre él.',
      'Si lo finalizás desde el Administrador de tareas, el núcleo, los servicios e incluso los programas que ya estaban abiertos siguen funcionando; solo desaparecen el escritorio y la barra de tareas.',
    ],
    verifiableData:
      'Para recuperarlo sin reiniciar: Administrador de tareas → Archivo → Ejecutar nueva tarea → escribí «explorer.exe» y confirmá.',
  },
  {
    id: 7,
    numberStr: '007',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'AVANZADO',
    title: 'Los dos Windows: el que ves y el que trabaja detrás',
    hook: 'Una capa gráfica liviana se apoya sobre un núcleo robusto que nunca ves.',
    paragraphs: [
      'Por un lado está la capa de presentación: DWM (Desktop Window Manager), explorer.exe y las apps Win32/UWP que usás a diario.',
      'Por otro, el núcleo NT (ntoskrnl.exe), el HAL (capa de abstracción de hardware) y los controladores en modo kernel, que gestionan memoria, procesos y seguridad sin ninguna interfaz visible.',
    ],
    verifiableData:
      'Si la interfaz se congela pero el mouse responde, el problema suele estar en DWM o en explorer.exe, no en el núcleo: cerrar sesión (no apagar) suele resolverlo.',
  },
  {
    id: 8,
    numberStr: '008',
    blockNumber: 'I',
    blockTitle: 'NÚCLEO Y ARRANQUE',
    level: 'INTERMEDIO',
    title: 'Los errores invisibles de Windows: aprendé a leer sus pistas',
    hook: 'Windows documenta cada fallo; casi nadie va a leerlo.',
    paragraphs: [
      'El Visor de eventos (eventvwr.msc) guarda registros de Aplicación, Seguridad y Sistema, cada uno con códigos de evento específicos y marcas de tiempo exactas.',
      'El Monitor de confiabilidad (ejecutá «perfmon /rel») traduce esos registros en una línea de tiempo visual con fallos de aplicaciones, drivers y actualizaciones fallidas.',
    ],
    verifiableData:
      'Filtrá el registro de Sistema por el Id. de evento 41 (apagados inesperados) o 1001 (Windows Error Reporting) para diagnosticar cuelgues recurrentes.',
  },
  {
    id: 9,
    numberStr: '009',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'INTERMEDIO',
    title: '¿Windows envía tus datos a Microsoft? Vamos a comprobarlo',
    hook: 'Sí, pero podés ver exactamente qué nivel y por qué.',
    paragraphs: [
      'Windows recopila «datos de diagnóstico» en nivel Requerido u Opcional, configurable en Configuración → Privacidad y seguridad → Diagnóstico y comentarios.',
      'La app oficial «Visor de datos de diagnóstico» (Diagnostic Data Viewer, disponible en Microsoft Store) permite revisar en texto plano exactamente qué eventos se enviaron desde tu equipo.',
    ],
    verifiableData:
      'Instalá «Diagnostic Data Viewer» desde Microsoft Store y activalo en Configuración → Privacidad para auditar cada dato que tu PC envió realmente.',
  },
  {
    id: 10,
    numberStr: '010',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'BÁSICO',
    title: '¿Tu micrófono puede estar activo sin que lo notes?',
    hook: 'Desde Windows 11 un ícono te avisa; antes, nadie lo hacía.',
    paragraphs: [
      'Configuración → Privacidad y seguridad → Micrófono muestra qué apps lo usaron recientemente, con fecha y hora, y permite revocar el acceso por aplicación o de forma global.',
      'Windows 11 además despliega un indicador visual en la bandeja del sistema cada vez que el micrófono o la cámara están en uso activo en ese momento.',
    ],
    verifiableData:
      'Desactivá el acceso al micrófono para apps que no lo necesiten a diario y reactivalo puntualmente solo cuando vayas a usarlo.',
  },
  {
    id: 11,
    numberStr: '011',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'BÁSICO',
    title: '¿Quién puede acceder a tu cámara? Investigá los permisos',
    hook: 'Cada app instalada pidió permiso alguna vez; pocos revisan quién lo sigue teniendo.',
    paragraphs: [
      'Configuración → Privacidad y seguridad → Cámara lista cada aplicación con acceso concedido y el momento exacto del último uso registrado.',
      'También existe un interruptor maestro para bloquear el acceso a nivel de todo el sistema operativo, independientemente de los permisos individuales de cada app.',
    ],
    verifiableData:
      'Si tu notebook tiene cubierta física de cámara, usala: es la única protección que ningún permiso de software puede sortear.',
  },
  {
    id: 12,
    numberStr: '012',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'AVANZADO',
    title: 'Todo lo que Windows recuerda de vos: historial, actividad y Recall',
    hook: 'De la línea de temporal al polémico Recall con inteligencia artificial.',
    paragraphs: [
      'Windows guarda tu actividad reciente en la Vista de tareas (línea de temporal) y tu historial de portapapeles con Win+V.',
      'En equipos Copilot+ con NPU dedicada existe además Recall, que toma capturas periódicas de pantalla para búsquedas con IA. Desde su rediseño, es estrictamente «opt-in»: no guarda nada hasta que lo activás a mano, exige Windows Hello para abrirse y puede desinstalarse por completo desde Características opcionales.',
    ],
    verifiableData:
      'En equipos compatibles, revisá Configuración → Privacidad y seguridad → Recall y capturas para confirmar que está apagado si no lo usás, y borrá el historial acumulado desde ahí mismo.',
  },
  {
    id: 13,
    numberStr: '013',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'AVANZADO',
    title: 'Windows se conecta solo a Internet: ¿con quién está hablando?',
    hook: 'Tu PC dialoga con servidores incluso sin abrir el navegador.',
    paragraphs: [
      'Servicios como «Experiencias de usuario conectadas y telemetría» (DiagTrack), Windows Update y la sincronización de OneDrive generan tráfico constante en segundo plano.',
      'Podés verlo en vivo abriendo el Monitor de recursos (resmon.exe) → pestaña Red → «Conexiones de red activas», proceso por proceso.',
    ],
    verifiableData:
      'Resmon.exe muestra la IP remota y el puerto exacto con el que se está comunicando cada proceso de tu equipo en este instante.',
  },
  {
    id: 14,
    numberStr: '014',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'BÁSICO',
    title: 'El portapapeles también guarda secretos',
    hook: 'Cada Ctrl+C queda archivado más tiempo del que pensás.',
    paragraphs: [
      'Win+V activa el historial de portapapeles, que guarda múltiples elementos copiados (texto e imágenes) en memoria, no solo el último.',
      'Con «Clipboard Sync» esos elementos pueden sincronizarse entre dispositivos vinculados a la misma cuenta Microsoft, por lo que una contraseña copiada podría viajar más lejos de lo esperado.',
    ],
    verifiableData:
      'En Configuración → Sistema → Portapapeles usá el botón «Borrar datos del portapapeles» y desactivá la sincronización en la nube si manejás información sensible.',
  },
  {
    id: 15,
    numberStr: '015',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'AVANZADO',
    title: '¿Qué ocurre cuando rechazás la telemetría de Windows?',
    hook: 'No podés apagarla del todo en Home o Pro, pero sí reducirla al mínimo permitido.',
    paragraphs: [
      'En ediciones Enterprise y Educación, la directiva de grupo «Allow Telemetry» permite bajar el nivel hasta «Security», es decir, solo los datos esenciales de seguridad.',
      'En Home y Pro, el mínimo disponible es «Requerido», que Microsoft define como indispensable para el funcionamiento básico del sistema operativo y no puede desactivarse por completo.',
    ],
    verifiableData:
      'Usá gpedit.msc (en Pro/Enterprise) → Plantillas administrativas → Componentes de Windows → Recopilación de datos y vistas previas, para fijar el nivel mínimo permitido por tu edición.',
  },
  {
    id: 16,
    numberStr: '016',
    blockNumber: 'II',
    blockTitle: 'TU PRIVACIDAD BAJO LA LUPA',
    level: 'BÁSICO',
    title: 'Privacidad bajo investigación: descubrí qué comparte tu PC',
    hook: 'El Id. de publicidad es la llave que conecta tus apps con anunciantes.',
    paragraphs: [
      'Windows asigna un «Id. de publicidad» único por usuario que las aplicaciones pueden usar para mostrar publicidad personalizada entre apps distintas.',
      'También puede compartir tu ubicación aproximada, historial de voz si usás dictado y datos de uso de aplicaciones si no restringís cada permiso de forma manual.',
    ],
    verifiableData:
      'Configuración → Privacidad y seguridad → General → desactivá «Permitir que las apps muestren anuncios personalizados usando tu Id. de publicidad».',
  },
  {
    id: 17,
    numberStr: '017',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'AVANZADO',
    title: '¿Hay alguien dentro de tu PC? Las señales que realmente importan',
    hook: 'El malware moderno no «rompe» nada; se queda quieto y mira.',
    paragraphs: [
      'Señales reales de compromiso: procesos desconocidos que consumen CPU o red estando en reposo, tareas programadas que no creaste, cuentas de usuario que no reconocés o programas que se inician solos.',
      'El Administrador de tareas y el Programador de tareas son la primera línea de revisión, pero no la única: muchas amenazas evitan deliberadamente aparecer ahí.',
    ],
    verifiableData:
      'Las herramientas gratuitas de Sysinternals (de Microsoft) Autoruns y Process Explorer muestran absolutamente todo lo que arranca con Windows, incluso lo que el Administrador de tareas no lista.',
  },
  {
    id: 18,
    numberStr: '018',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'AVANZADO',
    title: '¿Alguien inició sesión en Windows mientras no estabas?',
    hook: 'Cada inicio de sesión, exitoso o fallido, queda registrado con fecha y hora exacta.',
    paragraphs: [
      'El Visor de eventos guarda en el registro de «Seguridad» los eventos con Id. 4624 (inicio de sesión exitoso) y 4625 (fallido), junto al nombre de usuario y el tipo de sesión.',
      'Si la sesión fue remota, el mismo registro incluye la dirección IP de origen, un dato clave para detectar accesos no autorizados.',
    ],
    verifiableData:
      'Filtrá el registro de Seguridad por Id. de evento 4624 y 4625 para armar una línea de tiempo exacta de todos los accesos recientes a tu equipo.',
  },
  {
    id: 19,
    numberStr: '019',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'INTERMEDIO',
    title: 'Candados que Windows ya trae pero casi nadie activa',
    hook: 'BitLocker, Windows Hello y Smart App Control: seguridad de fábrica apagada por defecto.',
    paragraphs: [
      'BitLocker cifra el disco completo (disponible en ediciones Pro y Enterprise); Windows Hello reemplaza la contraseña por PIN, huella o reconocimiento facial, atado al chip de seguridad TPM del equipo.',
      'Smart App Control, por su parte, bloquea de forma proactiva aplicaciones no firmadas o de reputación desconocida antes de que lleguen a ejecutarse.',
    ],
    verifiableData:
      'Verificá el estado real de BitLocker ejecutando «manage-bde -status» en una consola como administrador: muchos equipos lo tienen disponible pero nunca activado.',
  },
  {
    id: 20,
    numberStr: '020',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'AVANZADO',
    title: 'El Registro: la puerta trasera favorita de cualquier malware persistente',
    hook: 'Dos claves del Registro deciden qué se ejecuta cada vez que iniciás sesión.',
    paragraphs: [
      'Las claves HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run y su equivalente en HKLM son el mecanismo de persistencia más usado tanto por software legítimo como por programas maliciosos.',
      'Garantizan ejecución automática en cada inicio de sesión sin requerir ninguna confirmación visible del usuario, por eso son el primer lugar que revisa cualquier analista de seguridad.',
    ],
    verifiableData:
      'Abrí regedit y revisá ambas claves Run: cualquier entrada que apunte a una carpeta temporal (AppData\\Local\\Temp) merece sospecha inmediata.',
  },
  {
    id: 21,
    numberStr: '021',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'AVANZADO',
    title: 'Autoruns: la lupa que usan los profesionales de seguridad',
    hook: 'La herramienta gratuita de Microsoft que ve lo que el Administrador de tareas no muestra.',
    paragraphs: [
      'Autoruns, parte de la Sysinternals Suite de Microsoft, lista cada punto de persistencia del sistema: claves Run, tareas programadas, servicios, drivers, extensiones del explorador y complementos de Office.',
      'Todo aparece ordenado por pestañas en una sola ventana, con la posibilidad de deshabilitar cualquier entrada sospechosa sin eliminarla de forma permanente.',
    ],
    verifiableData:
      'Descargalo gratis desde el sitio oficial de Sysinternals/Microsoft Learn, activá «Verify Code Signatures» y «Hide Microsoft Entries» para que solo queden visibles los elementos de terceros.',
  },
  {
    id: 22,
    numberStr: '022',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'INTERMEDIO',
    title: 'Defender sin publicidad: lo que tu antivirus incluido ya hace por vos',
    hook: 'Microsoft Defender dejó de ser «el antivirus gratis» y hoy compite de igual a igual.',
    paragraphs: [
      'Incluye protección en tiempo real, Acceso controlado a carpetas (defensa anti-ransomware), Protección contra vulnerabilidades y un análisis sin conexión (Defender Offline) que arranca fuera de Windows para limpiar amenazas profundas.',
      'Suma también un Firewall con reglas avanzadas de entrada y salida, configurable sin instalar ningún software de terceros.',
    ],
    verifiableData:
      'Activá «Acceso controlado a carpetas» en Seguridad de Windows → Protección contra virus y amenazas para blindar tus carpetas de Documentos e Imágenes contra ransomware.',
  },
  {
    id: 23,
    numberStr: '023',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'AVANZADO',
    title: 'Tu red también tiene una biblia negra',
    hook: 'SMBv1, RDP sin cifrar y puertos abiertos: tres puertas que conviene cerrar.',
    paragraphs: [
      'SMBv1 es un protocolo obsoleto, explotado en ataques masivos como WannaCry, que Windows moderno permite desactivar desde «Activar o desactivar las características de Windows».',
      'El Escritorio remoto (RDP) expuesto directamente a Internet sin VPN es uno de los vectores de ataque más comunes; siempre debería ir protegido con autenticación a nivel de red (NLA).',
    ],
    verifiableData:
      'Ejecutá «Dism /Online /Disable-Feature /FeatureName:SMB1Protocol» en una consola como administrador para eliminar ese protocolo heredado de tu equipo.',
  },
  {
    id: 24,
    numberStr: '024',
    blockNumber: 'III',
    blockTitle: 'PERSISTENCIA Y SEGURIDAD',
    level: 'INTERMEDIO',
    title: 'Windows Sandbox: probá lo peligroso sin arriesgar nada',
    hook: 'Un Windows desechable dentro de tu propio Windows, listo en segundos.',
    paragraphs: [
      'Windows Sandbox, disponible en ediciones Pro y Enterprise, crea un entorno aislado y temporal basado en virtualización ligera para ejecutar archivos o instaladores sospechosos.',
      'Al cerrarlo, absolutamente todo lo que ocurrió adentro desaparece sin dejar ningún rastro en tu sistema real.',
    ],
    verifiableData:
      'Activalo desde «Activar o desactivar las características de Windows» marcando «Windows Sandbox» (requiere virtualización habilitada en la BIOS/UEFI).',
  },
  {
    id: 25,
    numberStr: '025',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'BÁSICO',
    title: 'Las apps que arrancan con Windows sin pedir permiso',
    hook: 'Cada programa que instalás pelea por un lugar en tu arranque.',
    paragraphs: [
      'El Administrador de tareas (pestaña Inicio) muestra cada aplicación configurada para abrirse automáticamente al encender el equipo.',
      'Junto a cada una aparece un «impacto de inicio» estimado (Bajo, Medio o Alto), calculado según el uso real de CPU y disco que generó durante los últimos arranques.',
    ],
    verifiableData:
      'Desactivá únicamente las apps con impacto «Alto» que no uses a diario; nunca desactives procesos del sistema operativo ni de tu antivirus.',
  },
  {
    id: 26,
    numberStr: '026',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'INTERMEDIO',
    title: 'Services.msc: el panel que decide qué respira y qué no',
    hook: 'No todos los servicios «en ejecución» son necesarios para vos.',
    paragraphs: [
      'Servicios como «Fax», el servicio de Biometría (si no usás huella digital) o el de Bluetooth (si tu equipo no tiene el hardware) pueden pasarse a «Manual» sin afectar la estabilidad del sistema.',
      'Esto libera memoria residente y reduce procesos de fondo activos permanentemente desde el arranque.',
    ],
    verifiableData:
      'Antes de modificar cualquier servicio, anotá su estado actual (clic derecho → Propiedades) para poder revertir el cambio si algo deja de funcionar correctamente.',
  },
  {
    id: 27,
    numberStr: '027',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'AVANZADO',
    title: 'El archivo de paginación: la memoria RAM que vive en tu disco',
    hook: 'Cuando la RAM no alcanza, Windows improvisa espacio en el SSD o disco.',
    paragraphs: [
      'El archivo de paginación (pagefile.sys) extiende la memoria RAM disponible usando espacio de almacenamiento como respaldo temporal.',
      'Windows lo administra de forma automática, pero en equipos con poca RAM y un SSD rápido, fijar un tamaño personalizado puede reducir la fragmentación y mejorar la respuesta bajo carga sostenida.',
    ],
    verifiableData:
      'Configuración avanzada del sistema → Rendimiento → Opciones avanzadas → Memoria virtual, para revisar o ajustar manualmente el tamaño asignado por unidad.',
  },
  {
    id: 28,
    numberStr: '028',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'BÁSICO',
    title: 'Storage Sense: la limpieza automática que casi nadie activa',
    hook: 'Windows puede limpiarse solo, pero viene apagado de fábrica.',
    paragraphs: [
      'Storage Sense (Configuración → Sistema → Almacenamiento) borra automáticamente archivos temporales, vacía la papelera después de determinada cantidad de días y elimina versiones antiguas de Windows tras una actualización.',
      'Todo esto ocurre sin intervención manual, liberando espacio de forma periódica y silenciosa.',
    ],
    verifiableData:
      'Configurá Storage Sense para ejecutarse «durante poco espacio en disco» y activá la limpieza automática de la carpeta de Descargas si no la revisás seguido.',
  },
  {
    id: 29,
    numberStr: '029',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'AVANZADO',
    title: 'El plan de energía oculto que Windows no muestra por defecto',
    hook: 'Existe un cuarto plan de energía, más agresivo que «Máximo rendimiento».',
    paragraphs: [
      'Además de Equilibrado, Ahorro de energía y Máximo rendimiento, los equipos compatibles pueden desbloquear el plan «Rendimiento máximo» (Ultimate Performance), pensado originalmente para estaciones de trabajo.',
      'Este plan reduce al mínimo las microtransiciones de ahorro de energía del procesador, priorizando la respuesta inmediata por sobre el consumo eléctrico.',
    ],
    verifiableData:
      'En una consola como administrador ejecutá «powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61» para agregarlo a tus planes de energía disponibles.',
  },
  {
    id: 30,
    numberStr: '030',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'INTERMEDIO',
    title: 'GPU Scheduling: la función que descarga trabajo de tu procesador',
    hook: 'Una casilla en Configuración puede reducir la latencia de tus juegos.',
    paragraphs: [
      'La «Programación de GPU acelerada por hardware» (Configuración → Sistema → Pantalla → Gráficos) delega parte de la gestión de la cola de fotogramas al propio chip gráfico en lugar de al controlador por software.',
      'En GPUs y drivers recientes compatibles, esto puede reducir perceptiblemente la latencia de entrada durante los juegos.',
    ],
    verifiableData:
      'Combinala con el «Modo de juego» (Configuración → Juegos) para priorizar los recursos del sistema hacia la aplicación en pantalla completa activa.',
  },
  {
    id: 31,
    numberStr: '031',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'BÁSICO',
    title: 'Los efectos visuales que le cuestan rendimiento a tu PC',
    hook: 'Cada transparencia y animación consume ciclos de GPU que podrías ahorrar.',
    paragraphs: [
      'Sistema → Configuración avanzada del sistema → Rendimiento permite elegir «Ajustar para obtener el mejor rendimiento», lo que desactiva animaciones, sombras, transparencias y efectos de desvanecimiento.',
      'En equipos con GPU integrada modesta, estos efectos generan microcortes perceptibles que desaparecen al desactivarlos.',
    ],
    verifiableData:
      'Si no querés perder toda la estética, elegí «Personalizar» y desmarcá solo «Animar controles y elementos dentro de las ventanas» y los efectos de transparencia.',
  },
  {
    id: 32,
    numberStr: '032',
    blockNumber: 'IV',
    blockTitle: 'RENDIMIENTO Y OPTIMIZACIÓN EXTREMA',
    level: 'AVANZADO',
    title: 'SysMain y Prefetch: la memoria que aprende tus costumbres',
    hook: 'Windows observa qué abrís siempre y lo precarga antes de que lo pidas.',
    paragraphs: [
      'El servicio SysMain (antes llamado Superfetch) analiza tus patrones de uso y precarga en RAM las aplicaciones que abrís con mayor frecuencia, acelerando su inicio.',
      'En discos mecánicos el impacto es notable; en SSD muy rápidos con poca RAM disponible, algunos usuarios avanzados prefieren desactivarlo para liberar memoria para otras tareas.',
    ],
    verifiableData:
      'No lo desactives a ciegas: probá primero con «net stop sysmain» de forma temporal y compará el comportamiento antes de deshabilitarlo en services.msc de forma permanente.',
  },
  {
    id: 33,
    numberStr: '033',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'INTERMEDIO',
    title: 'Los tres comandos que reparan Windows sin reinstalar nada',
    hook: 'SFC, DISM y CHKDSK: el trío que todo técnico ejecuta primero.',
    paragraphs: [
      '«sfc /scannow» verifica y repara archivos de sistema corruptos usando una copia de respaldo local; «DISM /Online /Cleanup-Image /RestoreHealth» repara la imagen base de Windows cuando SFC no alcanza por sí solo.',
      '«chkdsk C: /f /r» revisa y corrige errores del sistema de archivos y sectores dañados del disco, el último recurso cuando el sistema se vuelve inestable.',
    ],
    verifiableData:
      'Ejecutalos siempre en este orden —DISM, luego SFC, luego CHKDSK— desde una consola como administrador para resolver la mayoría de los errores de sistema sin formatear.',
  },
  {
    id: 34,
    numberStr: '034',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'BÁSICO',
    title: 'GodMode: la carpeta que junta todas las configuraciones de Windows',
    hook: 'Un truco de hace más de una década que todavía funciona.',
    paragraphs: [
      'Creando una carpeta nueva y renombrándola exactamente como «GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}», su ícono cambia automáticamente.',
      'Al abrirla aparecen más de 200 configuraciones del Panel de control organizadas en categorías, todas accesibles desde un único lugar sin navegar menús.',
    ],
    verifiableData:
      'Es un acceso directo a paneles ya existentes, no una función nueva ni oculta real: es 100% seguro y totalmente reversible con solo borrar la carpeta.',
  },
  {
    id: 35,
    numberStr: '035',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'BÁSICO',
    title: 'Los atajos de teclado que muy pocos usuarios conocen',
    hook: 'Windows tiene decenas de combinaciones que ahorran minutos reales por día.',
    paragraphs: [
      'Win+. (o Win+;) abre el panel de emojis y símbolos; Win+Shift+S activa al instante la Herramienta de recorte; Win+V abre el historial completo del portapapeles.',
      'Win+X despliega el menú de acceso rápido a herramientas administrativas, y Win+Shift+flechas mueve una ventana entre monitores conservando su tamaño relativo.',
    ],
    verifiableData:
      'Win+Ctrl+Shift+B fuerza un reinicio del driver gráfico sin reiniciar la PC, muy útil cuando la pantalla se congela o parpadea de forma repentina.',
  },
  {
    id: 36,
    numberStr: '036',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'INTERMEDIO',
    title: 'PowerToys: el kit de herramientas no oficial que Microsoft sí mantiene',
    hook: 'Gratis, de código abierto y mantenido por el propio equipo de Windows.',
    paragraphs: [
      'PowerToys incluye FancyZones (organización avanzada de ventanas en zonas personalizadas), PowerRename (renombrado masivo con expresiones regulares) y un selector de color de precisión.',
      'Suma también PowerToys Run (buscador ultrarrápido con Alt+Espacio) y utilidades para desarrolladores como el editor del archivo Hosts y Peek para previsualizar archivos.',
    ],
    verifiableData:
      'Descargalo gratis desde Microsoft Store o directamente desde el repositorio oficial microsoft/PowerToys; todas sus funciones se activan desde un único panel central.',
  },
  {
    id: 37,
    numberStr: '037',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'INTERMEDIO',
    title: 'Windows Terminal: la consola que unificó todo en una sola ventana',
    hook: 'CMD, PowerShell y WSL conviven ahora en pestañas, con perfiles personalizables.',
    paragraphs: [
      'Windows Terminal, preinstalado desde Windows 11, permite abrir simultáneamente Símbolo del sistema, PowerShell, PowerShell 7 y distribuciones de Linux (WSL) en pestañas o paneles divididos.',
      'Admite temas visuales, fuentes con ligaduras tipográficas y perfiles en formato JSON totalmente personalizables para cada tipo de flujo de trabajo.',
    ],
    verifiableData:
      'El archivo «settings.json» (se abre con Ctrl+, desde la Terminal) te permite definir un perfil que arranque directamente en una carpeta de trabajo específica.',
  },
  {
    id: 38,
    numberStr: '038',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'AVANZADO',
    title: 'WSL: un Linux real corriendo dentro de tu Windows',
    hook: 'No es una máquina virtual tradicional: es un subsistema con kernel Linux real.',
    paragraphs: [
      'El Subsistema de Windows para Linux (WSL2) ejecuta un kernel Linux real mediante virtualización ligera, no una emulación ni una capa de compatibilidad.',
      'Permite correr distribuciones completas como Ubuntu, Debian o Kali con acceso de archivos compartido con Windows y uso de GPU para cargas de trabajo de inteligencia artificial.',
    ],
    verifiableData:
      'Instalalo con un solo comando desde una consola como administrador: «wsl --install»; reiniciá el equipo y elegí tu distribución desde Microsoft Store.',
  },
  {
    id: 39,
    numberStr: '039',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'INTERMEDIO',
    title: 'Copilot en Windows: la IA que ya vive dentro del sistema operativo',
    hook: 'De la barra de tareas a cada aplicación de Office, la IA generativa es parte del sistema.',
    paragraphs: [
      'Copilot se integra directamente en la barra de tareas (Win+C) para responder preguntas, cambiar configuraciones mediante lenguaje natural y resumir contenido.',
      'En equipos Copilot+ con NPU dedicada se suman funciones que corren localmente, como generación de imágenes en vivo y búsquedas con Recall bajo demanda del usuario.',
    ],
    verifiableData:
      'Configuración → Privacidad y seguridad → Copilot te permite revisar y limitar exactamente qué datos del sistema puede leer la IA para responder tus consultas.',
  },
  {
    id: 40,
    numberStr: '040',
    blockNumber: 'V',
    blockTitle: 'COMANDOS, PERSONALIZACIÓN E IA',
    level: 'AVANZADO',
    title: 'Dev Home y Hyper-V: el modo desarrollador que Windows escondía',
    hook: 'Un hipervisor de nivel empresarial incluido gratis en tu copia de Windows Pro.',
    paragraphs: [
      'Activando «Configuración para desarrolladores» (Configuración → Privacidad y seguridad), Windows habilita la instalación de apps fuera de la Store y el Modo de desarrollador completo.',
      'Hyper-V, el hipervisor nativo de Microsoft, permite crear máquinas virtuales completas sin instalar ningún software de virtualización de terceros.',
    ],
    verifiableData:
      'Activá Hyper-V desde «Activar o desactivar las características de Windows» (requiere Windows Pro/Enterprise y virtualización habilitada en la BIOS/UEFI).',
  },
];

export const OFFICIAL_PDF_URL = '/assets/aistudio/Arena___Benchmark___Compare_the_Best_AI_Models_ecb29d35.pdf';
