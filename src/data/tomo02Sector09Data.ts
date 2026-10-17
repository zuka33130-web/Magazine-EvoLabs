// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 09: CMD // DE USUARIO A TÉCNICO

export type RiskLevelSector09 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector09Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  commandName: string;
  riskLevel: RiskLevelSector09;
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
    cmdExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
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

export interface Sector09MiniCase {
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

export interface Sector09TestQuestion {
  id: string;
  questionNumber: number;
  category: 'SINTAXIS_REDRECCION' | 'CONTROL_PROCESOS' | 'NETWORKING_CLI' | 'DIAGNOSTICO_SISTEMA';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_09_INVESTIGATIONS: Sector09Investigation[] = [
  {
    id: 'inv-09-01',
    code: '09.01',
    title: 'Navegación',
    subtitle: 'Navegación en la jerarquía de directorios NTFS con cd, dir, cls y letras de unidad',
    commandName: 'cd / dir / cls',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El prompt `C:\\Users\\Alumno>` indica la posición actual en el árbol de almacenamiento.',
      mythVsTruth: {
        mentira: 'Escribir `cd D:\\` cambia de directorio y de unidad de disco al mismo tiempo.',
        verdad: '`cd D:\\` solo cambia el directorio activo de la unidad D:, debes escribir `D:` para cambiar de unidad.',
        comprobalo: 'Abre CMD, escribe `D:` para cambiar de letra de unidad o `cd /d D:\\Proyectos` para cambiar letra y ruta juntas.',
      },
    },
    entende: {
      queEs: 'Comandos internos de CMD integrados en `cmd.exe` para desplazarse entre carpetas y listar nodos.',
      paraQueSirve: 'Navegar la jerarquía de archivos, verificar rutas relativas vs absolutas y limpiar pantalla.',
      quePasaSiFalta: 'Sin manejo de cd/dir no es posible ubicar binarios ni ejecutar scripts en ubicaciones específicas.',
    },
    interactua: {
      cmdExample: 'cd /d "C:\\Program Files\\Windows NT" && dir /a',
      syntaxBreakdown: '`/d` fuerza el cambio de volumen. Las comillas aíslan espacios en nombres de directorio.',
      whatToLookFor: 'El prompt se actualiza reflejando el directorio de trabajo activo (Working Directory).',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. `cd` y `dir` no modifican datos en disco.',
      safetyWarning: 'Comillas dobles son obligatorias cuando la ruta contiene espacios.',
    },
    evidenceBadge: {
      code: 'CMD-NAV-01',
      label: 'DIR_TREE_NAVIGATION',
    },
  },
  {
    id: 'inv-09-02',
    code: '09.02',
    title: 'Archivos',
    subtitle: 'Gestión básica de archivos y carpetas: mkdir, rmdir, copy, move, ren, del, type',
    commandName: 'mkdir / copy / del / type',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Un archivo eliminado con `del` en CMD NO va a la Papelera de Reciclaje.',
      mythVsTruth: {
        mentira: '`del archivo.txt` permite recuperar el archivo desde la papelera si me equivoco.',
        verdad: '`del` realiza una desvinculación directa de la MFT sin pasar por la papelera.',
        comprobalo: 'Crea un archivo de prueba con `echo test > demo.txt` y bórralo con `del demo.txt`. Observa que la papelera permanece vacía.',
      },
    },
    entende: {
      queEs: 'Comandos manipulación de archivos y carpetas del intérprete de comandos.',
      paraQueSirve: 'Crear, copiar, renombrar, inspeccionar contenido en texto plano y eliminar elementos.',
      quePasaSiFalta: 'Es impreciso automatizar la limpieza o estructuración de carpetas de diagnóstico.',
    },
    interactua: {
      cmdExample: 'mkdir C:\\EvoLab\\Test && type nul > C:\\EvoLab\\Test\\log.txt',
      syntaxBreakdown: '`mkdir` crea carpetas compuestas. `type nul >` inicializa un archivo en blanco.',
      whatToLookFor: 'Verifica la existencia del elemento con `dir C:\\EvoLab\\Test`.',
    },
    alertaEVO: {
      reversibilityRule: '`del` y `rmdir /s` eliminan inmediatamente. Usar sobre carpetas de prueba de laboratorio.',
      safetyWarning: 'Jamás ejecutar `del /f /s /q` sobre la raíz C:\\ o carpetas de sistema.',
    },
    evidenceBadge: {
      code: 'CMD-FILE-02',
      label: 'FILE_MANAGEMENT_OPS',
    },
  },
  {
    id: 'inv-09-03',
    code: '09.03',
    title: 'Variables',
    subtitle: 'Variables de entorno globales y dinámicas: %USERNAME%, %TEMP%, %PATH%, set',
    commandName: 'set',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Escribir `%TEMP%` en CMD expande la ruta completa a la carpeta temporal del usuario activo.',
      mythVsTruth: {
        mentira: '`set MI_VAR=123` guarda la variable de forma permanente para todos los reinicios de Windows.',
        verdad: '`set` modifica el bloque de variables solo para la sesión actual del proceso `cmd.exe`.',
        comprobalo: 'Ejecuta `set EVO=100` y luego `echo %EVO%`. Abre una nueva consola CMD y verás que `%EVO%` no existe.',
      },
    },
    entende: {
      queEs: 'Estructuras clave-valor mantenidas en la memoria del entorno del proceso.',
      paraQueSirve: 'Parametrizar scripts, ubicar perfiles de usuario y definir rutas de ejecución con PATH.',
      quePasaSiFalta: 'Incapacidad para escribir scripts portables entre distintos usuarios y máquinas.',
    },
    interactua: {
      cmdExample: 'echo Usuario: %USERNAME% | Ruta Temp: %TEMP%',
      syntaxBreakdown: 'Los signos de porcentaje `%` ordenan al intérprete sustituir la clave por su valor.',
      whatToLookFor: 'La salida muestra los valores expandidos correspondientes a la sesión actual.',
    },
    alertaEVO: {
      reversibilityRule: 'Los cambios con `set` expiran al cerrar la consola CMD.',
      safetyWarning: 'Sobrescribir `%PATH%` accidentalmente impedirá ejecutar comandos sin su ruta completa.',
    },
    evidenceBadge: {
      code: 'CMD-ENV-03',
      label: 'ENV_VARIABLES_EXPANSION',
    },
  },
  {
    id: 'inv-09-04',
    code: '09.04',
    title: 'Redirección',
    subtitle: 'Flujos estándar STDOUT y STDERR: >, >>, 2>, 2>&1',
    commandName: '>',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'El carácter `>` destruye el contenido previo de un archivo; `>>` añade lineas al final.',
      mythVsTruth: {
        mentira: '`dir C:\\Inexistente > log.txt` guardará el mensaje de error dentro de log.txt.',
        verdad: 'El mensaje de error viaja por el canal STDERR (2), no STDOUT (1). Debes usar `2> log.txt` o `2>&1`.',
        comprobalo: 'Prueba `dir C:\\Fantasmas 2> error.log` y observa que `error.log` contiene la falla.',
      },
    },
    entende: {
      queEs: 'Operadores de redirección que desvían los descriptores de salida 1 (STDOUT) y 2 (STDERR).',
      paraQueSirve: 'Generar reportes de diagnóstico silenciosos y registrar fallas de scripts.',
      quePasaSiFalta: 'Los resultados de diagnóstico se pierden en la pantalla al cerrar la consola.',
    },
    interactua: {
      cmdExample: 'ipconfig /all > %TEMP%\\red_report.txt 2>&1',
      syntaxBreakdown: '`>` redirige la salida estándar; `2>&1` une los errores al mismo archivo de reporte.',
      whatToLookFor: 'El comando se ejecuta sin salida en pantalla y crea el archivo `.txt`.',
    },
    alertaEVO: {
      reversibilityRule: '`>` sobrescribe el archivo destino sin confirmación previa.',
      safetyWarning: 'Validar la ruta de destino para evitar sobrescribir archivos del sistema.',
    },
    evidenceBadge: {
      code: 'CMD-REDIR-04',
      label: 'STDOUT_STDERR_REDIRECT',
    },
  },
  {
    id: 'inv-09-05',
    code: '09.05',
    title: 'Pipes',
    subtitle: 'Conexión de procesos en tubería mediante el operador |',
    commandName: '|',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El operador pipe `|` toma la salida en texto de un proceso y la inyecta como entrada al siguiente.',
      mythVsTruth: {
        mentira: '`|` guarda los datos temporalmente en el disco duro antes de enviarlos al segundo comando.',
        verdad: 'La transferencia ocurre en memoria mediante una tubería anónima del Kernel de Windows.',
        comprobalo: 'Ejecuta `tasklist | findstr /i "chrome"`. La búsqueda procesa en tiempo real los datos.',
      },
    },
    entende: {
      queEs: 'Un mecanismo IPC (Inter-Process Communication) en memoria entre dos programas ejecutados en paralelo.',
      paraQueSirve: 'Filtrar, contar o transformar salidas masivas sin necesidad de archivos temporales en disco.',
      quePasaSiFalta: 'Obliga a crear archivos intermediarios pesados para filtrar información.',
    },
    interactua: {
      cmdExample: 'driverquery | findstr /i "kernel"',
      syntaxBreakdown: '`driverquery` emite la lista completa; `findstr` filtra solo filas con la cadena "kernel".',
      whatToLookFor: 'La consola imprime únicamente las líneas de drivers que coinciden con el filtro.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Operación pura en memoria.',
      safetyWarning: 'Comandos con salidas muy grandes combinados con pipes pueden demorar unos segundos.',
    },
    evidenceBadge: {
      code: 'CMD-PIPE-05',
      label: 'ANONYMOUS_PIPE_STREAM',
    },
  },
  {
    id: 'inv-09-06',
    code: '09.06',
    title: 'IF',
    subtitle: 'Evaluación condicional de existencia de archivos, cadenas y códigos de retorno',
    commandName: 'if',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`if exist` permite a un script tomar decisiones antes de ejecutar un comando peligroso.',
      mythVsTruth: {
        mentira: '`if %VAR%==1` funciona correctamente aunque `%VAR%` esté vacía o contenga espacios.',
        verdad: 'Si `%VAR%` está vacía, la sintaxis queda `if ==1`, provocando un error de sintaxis fatal.',
        comprobalo: 'Usa comillas siempre: `if "%VAR%"=="1" echo Ok`.',
      },
    },
    entende: {
      queEs: 'Estructura de control de flujo lógica en los scripts de procesamiento por lotes (.cmd / .bat).',
      paraQueSirve: 'Comprobar presencia de archivos, verificar permisos e interpretar respuestas.',
      quePasaSiFalta: 'Los scripts se ejecutan a ciegas sin validar el estado previo del sistema.',
    },
    interactua: {
      cmdExample: 'if exist C:\\Windows\\System32\\drivers\\etc\\hosts (echo Hosts OK) else (echo Error)',
      syntaxBreakdown: '`if exist` evalúa la ruta. Los paréntesis delimitan los bloques de instrucción.',
      whatToLookFor: 'Imprime "Hosts OK" confirmando la existencia del archivo.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro por sí mismo. Depende de las acciones colocadas dentro del bloque.',
      safetyWarning: 'Probar las condiciones con `echo` antes de poner comandos de borrado.',
    },
    evidenceBadge: {
      code: 'CMD-COND-06',
      label: 'CONDITIONAL_LOGIC_IF',
    },
  },
  {
    id: 'inv-09-07',
    code: '09.07',
    title: 'FOR',
    subtitle: 'Iteración de bucles sobre archivos, conjuntos de datos y salidas de comandos',
    commandName: 'for',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '`for /f` permite leer línea por línea la salida de un comando o archivo de texto.',
      mythVsTruth: {
        mentira: 'El bucle `for %i in (*.log)` se escribe exactamente igual dentro de un archivo script `.cmd`.',
        verdad: 'En archivos de script `.cmd`, las variables del bucle requieren doble signo de porcentaje: `%%i`.',
        comprobalo: 'En CMD interactivo usa `%i`. En un archivo `script.cmd` usa `%%i`.',
      },
    },
    entende: {
      queEs: 'Estructura repetitiva de control de flujo para procesar listas de elementos.',
      paraQueSirve: 'Automatizar tareas masivas como renombrar lotes o parsear logs.',
      quePasaSiFalta: 'Procesamiento manual e ineficiente de múltiples elementos.',
    },
    interactua: {
      cmdExample: 'for %f in (%TEMP%\\*.tmp) do @echo Encontrado: %f',
      syntaxBreakdown: 'Itera sobre todos los archivos `.tmp` en la carpeta temporal e imprime su ruta.',
      whatToLookFor: 'Aparece una fila por cada archivo temporal encontrado.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro si solo lee o usa `echo`. Cuidado al combinarlo con `del` o `move`.',
      safetyWarning: 'Verificar el listado obtenido antes de aplicar un comando destructivo en la iteración.',
    },
    evidenceBadge: {
      code: 'CMD-LOOP-07',
      label: 'FOR_LOOP_ITERATION',
    },
  },
  {
    id: 'inv-09-08',
    code: '09.08',
    title: 'ERRORLEVEL',
    subtitle: 'Captura e interpretación de códigos de salida (Exit Codes) de procesos finalizados',
    commandName: 'errorlevel',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Un `ERRORLEVEL` igual a `0` casi siempre representa ejecución exitosa sin errores.',
      mythVsTruth: {
        mentira: 'Si un comando muestra texto en pantalla, significa que su `ERRORLEVEL` fue 0.',
        verdad: 'Muchos comandos imprimen mensajes de error en pantalla y devuelven `ERRORLEVEL` mayor a 0.',
        comprobalo: 'Ejecuta `ping 10.255.255.1 -n 1 -w 100` y luego `echo %ERRORLEVEL%`. Devuelve 1.',
      },
    },
    entende: {
      queEs: 'Variable especial de CMD que almacena el código numérico retornado por el último programa.',
      paraQueSirve: 'Detectar si la orden previa tuvo éxito (0) o falló (>0) para bifurcar la lógica.',
      quePasaSiFalta: 'Imposibilidad de hacer scripts resilientes que reaccionen ante fallas.',
    },
    interactua: {
      cmdExample: 'ping -n 1 127.0.0.1 > nul && echo %ERRORLEVEL%',
      syntaxBreakdown: '`&&` solo ejecuta el segundo comando si el primero retornó `ERRORLEVEL` igual a 0.',
      whatToLookFor: 'Salida limpia con el valor `0`.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Métrica de lectura de estado.',
      safetyWarning: 'Evaluar `if errorlevel 1` captura cualquier código igual o mayor a 1.',
    },
    evidenceBadge: {
      code: 'CMD-ERR-08',
      label: 'EXIT_CODE_ERRORLEVEL',
    },
  },
  {
    id: 'inv-09-09',
    code: '09.09',
    title: 'CALL',
    subtitle: 'Invocación de subrutinas y scripts secundarios con retorno de control',
    commandName: 'call',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Sin `call`, llamar a un script `.cmd` desde otro termina la ejecución del script principal.',
      mythVsTruth: {
        mentira: 'Escribir `subscript.cmd` dentro de `main.cmd` volverá al script principal al terminar.',
        verdad: 'Sin `call`, el intérprete transfiere el control a `subscript.cmd` y abandona `main.cmd`.',
        comprobalo: 'Usa `call subscript.cmd` para asegurar el retorno al proceso padre.',
      },
    },
    entende: {
      queEs: 'Comando para invocar sub-scripts o etiquetas internas (`:etiqueta`) dentro del mismo archivo.',
      paraQueSirve: 'Modularizar scripts complejos en funciones y reusar código.',
      quePasaSiFalta: 'Pérdida de control de ejecución entre múltiples scripts por lotes.',
    },
    interactua: {
      cmdExample: 'call :MiSubrutina "Parámetro 1"',
      syntaxBreakdown: '`call :etiqueta` salta al bloque especificado y retorna cuando encuentra `goto :eof`.',
      whatToLookFor: 'El control regresa ordenadamente a la línea posterior al `call`.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro en flujo de control.',
      safetyWarning: 'Asegurar que las subrutinas tengan un punto de salida claro para evitar bucles infinitos.',
    },
    evidenceBadge: {
      code: 'CMD-CALL-09',
      label: 'CALL_SUBROUTINE_FLOW',
    },
  },
  {
    id: 'inv-09-10',
    code: '09.10',
    title: 'tasklist',
    subtitle: 'Listado pericial de procesos activos, PID, nombre de sesión y consumo de RAM',
    commandName: 'tasklist',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`tasklist /fi` permite filtrar procesos por uso de memoria, usuario o nombre.',
      mythVsTruth: {
        mentira: '`tasklist` solo muestra aplicaciones con ventana visible en el escritorio.',
        verdad: 'Muestra todos los procesos del usuario, servicios y procesos de sistema visibles.',
        comprobalo: 'Ejecuta `tasklist /fi "MEMUSAGE gt 50000"` para listar procesos con más de 50 MB de RAM.',
      },
    },
    entende: {
      queEs: 'Herramienta de consola para consultar la tabla de procesos activos en el kernel.',
      paraQueSirve: 'Auditar procesos sospechosos, identificar PIDs y relacionar instancias de svchost.',
      quePasaSiFalta: 'Incapacidad de auditar procesos en entornos Server Core o sin GUI.',
    },
    interactua: {
      cmdExample: 'tasklist /v /fo table',
      syntaxBreakdown: '`/v` incluye detalles como el título de la ventana y el usuario ejecutor.',
      whatToLookFor: 'Columnas estructuradas con Image Name, PID, Session Name, Mem Usage y User.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Consulta de lectura.',
      safetyWarning: 'No tiene riesgos de modificación.',
    },
    evidenceBadge: {
      code: 'CMD-TASK-10',
      label: 'TASKLIST_PROCESS_AUDIT',
    },
  },
  {
    id: 'inv-09-11',
    code: '09.11',
    title: 'taskkill',
    subtitle: 'Finalización controlada o forzada de procesos por PID o nombre de imagen',
    commandName: 'taskkill',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'El parámetro `/f` envía una señal de terminación abrupta sin guardar datos.',
      mythVsTruth: {
        mentira: '`taskkill /im notepad.exe` borra el archivo notepad.exe del disco duro.',
        verdad: 'Solo finaliza la instancia en ejecución del proceso en la memoria RAM.',
        comprobalo: 'Abre el Bloc de notas, consulta su PID y ejecuta `taskkill /pid <PID>`.',
      },
    },
    entende: {
      queEs: 'Utilidad para detener procesos colgados o no deseados desde la línea de comandos.',
      paraQueSirve: 'Cerrar procesos trabados y terminar árboles de procesos con el modificador `/t`.',
      quePasaSiFalta: 'Imposibilidad de liberar recursos bloqueados sin reiniciar el sistema.',
    },
    interactua: {
      cmdExample: 'taskkill /im notepad.exe /t',
      syntaxBreakdown: '`/im` especifica el nombre de la imagen; `/t` incluye los procesos hijos.',
      whatToLookFor: 'Mensaje de confirmación "CORRECTO: Se envió la señal de terminación...".',
    },
    alertaEVO: {
      reversibilityRule: 'No se puede revertir la pérdida de datos no guardados del proceso finalizado.',
      safetyWarning: 'Nunca ejecutar `taskkill /f /im svchost.exe` o `lsass.exe` porque provocará una pantalla azul o reinicio.',
    },
    evidenceBadge: {
      code: 'CMD-KILL-11',
      label: 'TASKKILL_PROCESS_TERMINATION',
    },
  },
  {
    id: 'inv-09-12',
    code: '09.12',
    title: 'driverquery',
    subtitle: 'Inventario pericial de controladores y drivers de dispositivo cargados en Kernel',
    commandName: 'driverquery',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`driverquery /v` muestra las direcciones de memoria y tipos de inicio de todos los drivers.',
      mythVsTruth: {
        mentira: 'Un driver listado en `driverquery` con estado "Stopped" significa que está defectuoso.',
        verdad: 'Muchos controladores legítimos de kernel se cargan bajo demanda y se detienen cuando no se usan.',
        comprobalo: 'Ejecuta `driverquery /fo csv > %TEMP%\\drivers.csv` para abrirlo e inspeccionarlo.',
      },
    },
    entende: {
      queEs: 'Comando de auditoría para listar módulos de controladores instalados en el sistema.',
      paraQueSirve: 'Identificar drivers de terceros, versiones obsoletas y nombres de archivos `.sys`.',
      quePasaSiFalta: 'Dificultad para diagnosticar Pantallas Azules (BSOD) causadas por drivers.',
    },
    interactua: {
      cmdExample: 'driverquery /si | findstr /i "False"',
      syntaxBreakdown: '`/si` muestra el estado de firma digital de los controladores.',
      whatToLookFor: 'Muestra drivers sin firma digital válida (False).',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Herramienta de auditoría pasiva.',
      safetyWarning: 'No realiza cambios en los controladores.',
    },
    evidenceBadge: {
      code: 'CMD-DRV-12',
      label: 'DRIVERQUERY_KERNEL_INVENTORY',
    },
  },
  {
    id: 'inv-09-13',
    code: '09.13',
    title: 'sc',
    subtitle: 'Administración del Service Control Manager: sc query, sc qc, sc start, sc stop',
    commandName: 'sc',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: '`sc query` interactúa directamente con la API del Administrador de Control de Servicios.',
      mythVsTruth: {
        mentira: '`sc` y `net start` son exactamente el mismo comando con distinto nombre.',
        verdad: '`sc` es una herramienta de bajo nivel con capacidad de configurar binarios, dependencias y permisos.',
        comprobalo: 'Compara `sc qc wuauserv` con `net start`. `sc qc` muestra la ruta del ejecutable y grupo.',
      },
    },
    entende: {
      queEs: 'Interfaz CLI directa con el Service Control Manager (SCM) de Windows.',
      paraQueSirve: 'Consultar configuración (`qc`), estado (`query`), e iniciar/detener servicios.',
      quePasaSiFalta: 'Incapacidad de diagnosticar parámetros de arranque de servicios de fondo.',
    },
    interactua: {
      cmdExample: 'sc qc wuauserv',
      syntaxBreakdown: '`qc` (Query Config) devuelve el tipo de inicio, binario y cuenta de servicio.',
      whatToLookFor: 'Muestra `BINARY_PATH_NAME`, `START_TYPE` y `SERVICE_START_NAME`.',
    },
    alertaEVO: {
      reversibilityRule: '`sc config` o `sc delete` modifican el registro. Usar `sc query` y `sc qc` para lecturas seguras.',
      safetyWarning: 'No eliminar ni reconfigurar servicios de sistema críticos.',
    },
    evidenceBadge: {
      code: 'CMD-SCM-13',
      label: 'SC_SERVICE_CONTROL_MANAGER',
    },
  },
  {
    id: 'inv-09-14',
    code: '09.14',
    title: 'systeminfo',
    subtitle: 'Resumen exhaustivo de configuración del sistema, hotfixes, RAM y tarjetas de red',
    commandName: 'systeminfo',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`systeminfo` revela la fecha exacta de instalación del sistema operativo y tiempo de encendido.',
      mythVsTruth: {
        mentira: '`systeminfo` requiere permisos de Administrador para ejecutarse.',
        verdad: 'Puede ejecutarse desde una consola de usuario estándar para consultar datos del sistema.',
        comprobalo: 'Ejecuta `systeminfo | findstr /c:"Tiempo de arranque" /c:"Fecha de instalación"`.',
      },
    },
    entende: {
      queEs: 'Utilidad de diagnóstico que recopila información de hardware, BIOS, parches y red.',
      paraQueSirve: 'Generar fichas técnicas rápidas de auditoría e identificar KB de seguridad aplicados.',
      quePasaSiFalta: 'Consulta manual y fragmentada de múltiples paneles de configuración.',
    },
    interactua: {
      cmdExample: 'systeminfo /fo list',
      syntaxBreakdown: '`/fo list` presenta cada métrica en una línea clave-valor limpia.',
      whatToLookFor: 'Muestra versión de OS, Fabricante, BIOS, Memoria Física y Tarjetas de red.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Solo lectura.',
      safetyWarning: 'Puede demorar unos segundos mientras consulta el WMI.',
    },
    evidenceBadge: {
      code: 'CMD-SYS-14',
      label: 'SYSTEMINFO_AUDIT_SUMMARY',
    },
  },
  {
    id: 'inv-09-15',
    code: '09.15',
    title: 'whoami',
    subtitle: 'Identificación pericial de usuario, SID de cuenta, grupos de seguridad y privilegios',
    commandName: 'whoami',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`whoami /priv` enumera los privilegios del Token de Seguridad activo (ej. SeDebugPrivilege).',
      mythVsTruth: {
        mentira: 'Estar en el grupo Administradores significa que la consola CMD actual tiene privilegios elevados.',
        verdad: 'Bajo UAC, la consola corre con token filtrado a menos que se abra como "Ejecutar como Administrador".',
        comprobalo: 'Compara la salida de `whoami /priv` en consola normal vs consola elevada.',
      },
    },
    entende: {
      queEs: 'Herramienta de inspección del Token de Acceso del proceso de consola actual.',
      paraQueSirve: 'Verificar el nivel de elevación real, grupos asignados y SID único del usuario.',
      quePasaSiFalta: 'Incertidumbre sobre si los comandos fallan por falta de permisos o sintaxis.',
    },
    interactua: {
      cmdExample: 'whoami /user /fo table',
      syntaxBreakdown: 'Muestra el nombre de dominio/equipo, nombre de usuario y su Security Identifier (SID).',
      whatToLookFor: 'Cadena SID del tipo `S-1-5-21-...`.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Herramienta de lectura.',
      safetyWarning: 'No altera privilegios.',
    },
    evidenceBadge: {
      code: 'CMD-WHO-15',
      label: 'WHOAMI_TOKEN_PRIVILEGES',
    },
  },
  {
    id: 'inv-09-16',
    code: '09.16',
    title: 'assoc',
    subtitle: 'Mapeo de extensiones de archivo a tipos de documento en el Registro (HKCR)',
    commandName: 'assoc',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '`assoc .txt` revela que la extensión `.txt` está vinculada internamente al File Type `txtfile`.',
      mythVsTruth: {
        mentira: '`assoc` define qué ejecutable abre cada archivo.',
        verdad: '`assoc` relaciona la extensión con una clase (File Type). `ftype` vincula la clase con el ejecutable.',
        comprobalo: 'Ejecuta `assoc .txt` y observa el resultado `.txt=txtfile`.',
      },
    },
    entende: {
      queEs: 'Comando para consultar y modificar asociaciones de extensiones en `HKEY_CLASSES_ROOT`.',
      paraQueSirve: 'Diagnosticar archivos que perdieron su asociación o fueron secuestrados por malware.',
      quePasaSiFalta: 'Imposibilidad de reparar extensiones rotas desde la consola.',
    },
    interactua: {
      cmdExample: 'assoc .log',
      syntaxBreakdown: 'Sin argumentos adicionales, lee la asociación actual en el Registro.',
      whatToLookFor: 'Salida de la forma `.log=txtfile`.',
    },
    alertaEVO: {
      reversibilityRule: '`assoc .ext=` sin valor borra la asociación. Usar solo en modo lectura.',
      safetyWarning: 'No alterar extensiones del sistema como `.exe`, `.dll` o `.bat`.',
    },
    evidenceBadge: {
      code: 'CMD-ASC-16',
      label: 'ASSOC_EXTENSION_MAPPING',
    },
  },
  {
    id: 'inv-09-17',
    code: '09.17',
    title: 'ftype',
    subtitle: 'Vinculación de File Types con los comandos de ejecutable y parámetros (%1)',
    commandName: 'ftype',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '`ftype txtfile` muestra la línea exacta de comandos utilizada al hacer doble clic en un archivo de texto.',
      mythVsTruth: {
        mentira: 'Cambiar el programa predeterminado en la GUI borra las entradas ftype.',
        verdad: 'Windows mantiene la clase ftype en el registro y añade una preferencia de usuario en HKCU.',
        comprobalo: 'Ejecuta `ftype txtfile` para ver el ejecutable registrado.',
      },
    },
    entende: {
      queEs: 'Comando que administra las órdenes de apertura asignadas a las clases de archivo en el registro.',
      paraQueSirve: 'Inspeccionar ejecutables asociados a tipos de archivo y detectar redirecciones maliciosas.',
      quePasaSiFalta: 'Dificultad para auditar secuestros de asociación de ejecutables (vulnerabilidad ftype).',
    },
    interactua: {
      cmdExample: 'ftype txtfile',
      syntaxBreakdown: 'Muestra la cadena de comando con `%1` representando la ruta del archivo abierto.',
      whatToLookFor: '`txtfile=%SystemRoot%\\system32\\NOTEPAD.EXE %1`.',
    },
    alertaEVO: {
      reversibilityRule: 'Modificar `ftype` altera el comportamiento de apertura. Usar solo lectura.',
      safetyWarning: 'Verificar la ruta de ejecutable para confirmar que apunta a binarios legítimos.',
    },
    evidenceBadge: {
      code: 'CMD-FTP-17',
      label: 'FTYPE_COMMAND_BINDING',
    },
  },
  {
    id: 'inv-09-18',
    code: '09.18',
    title: 'ipconfig',
    subtitle: 'Diagnóstico de interfaces de red, IPv4, máscara, Default Gateway y caché DNS',
    commandName: 'ipconfig',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`ipconfig /flushdns` purga la caché del cliente DNS de Windows para resolver problemas de nombre.',
      mythVsTruth: {
        mentira: '`ipconfig /release` borra la configuración de la tarjeta de red para siempre.',
        verdad: 'Solo envía un mensaje DHCPRELEASE al servidor para renunciar a la IP actual; `/renew` pide otra.',
        comprobalo: 'Ejecuta `ipconfig /all` para consultar la dirección MAC, Gateway y servidores DNS.',
      },
    },
    entende: {
      queEs: 'Herramienta fundamental para inspeccionar y reiniciar parámetros TCP/IP y DHCP en interfaces.',
      paraQueSirve: 'Verificar conectividad local, renovar concesiones DHCP y limpiar registros DNS obsoletos.',
      quePasaSiFalta: 'Incapacidad de auditar la dirección IP local y la puerta de enlace.',
    },
    interactua: {
      cmdExample: 'ipconfig /all',
      syntaxBreakdown: '`/all` detalla estado de DHCP, dirección física MAC, servidor DNS y concesiones.',
      whatToLookFor: 'IPv4, Máscara de subred, Puerta de enlace predeterminada.',
    },
    alertaEVO: {
      reversibilityRule: '`/flushdns` es seguro. `/release` interrumpe la red brevemente hasta ejecutar `/renew`.',
      safetyWarning: 'En sesiones remotas (RDP / SSH), ejecutar `/release` provocará la pérdida permanente de la conexión.',
    },
    evidenceBadge: {
      code: 'CMD-IPC-18',
      label: 'IPCONFIG_NETWORK_DIAG',
    },
  },
  {
    id: 'inv-09-19',
    code: '09.19',
    title: 'ping',
    subtitle: 'Prueba de conectividad ICMP Echo, latencia en ms, pérdida de paquetes y TTL',
    commandName: 'ping',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Que un `ping` falle NO significa que el servidor o la computadora de destino estén caídos.',
      mythVsTruth: {
        mentira: 'Si `ping google.com` da "Tiempo de espera agotado", la página web no está funcionando.',
        verdad: 'El servidor web o firewall puede estar bloqueando paquetes ICMP mientras el puerto 443 HTTPS funciona bien.',
        comprobalo: 'Prueba hacer ping a hosts locales o de prueba como `ping 1.1.1.1 -n 2`.',
      },
    },
    entende: {
      queEs: 'Utilidad de diagnóstico de red basada en el protocolo ICMP (Internet Control Message Protocol).',
      paraQueSirve: 'Verificar alcance nivel 3, medir latencia de respuesta y verificar la resolución de nombres.',
      quePasaSiFalta: 'Diagnóstico a ciegas sobre la conectividad básica de red.',
    },
    interactua: {
      cmdExample: 'ping 8.8.8.8 -n 4 -w 1000',
      syntaxBreakdown: '`-n 4` limita las pruebas a 4 eco; `-w 1000` establece el tiempo de espera a 1 segundo.',
      whatToLookFor: 'Tiempo de respuesta en ms, % de paquetes perdidos y valor TTL.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Consulta de red pasiva.',
      safetyWarning: 'No usar `-t` de forma indefinida sin supervisión.',
    },
    evidenceBadge: {
      code: 'CMD-PNG-19',
      label: 'PING_ICMP_DIAGNOSTICS',
    },
  },
  {
    id: 'inv-09-20',
    code: '09.20',
    title: 'tracert',
    subtitle: 'Rastreo pericial de la ruta de saltos de routers entre el cliente y el destino',
    commandName: 'tracert',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`tracert` incrementa progresivamente el campo TTL (Time-To-Live) de 1 en 1 para descubrir cada salto.',
      mythVsTruth: {
        mentira: 'Un salto con asteriscos `* * *` en medio del recorrido indica una falla grave de Internet.',
        verdad: 'Muchos routers intermedios de proveedores deshabilitan las respuestas ICMP Time Exceeded por seguridad.',
        comprobalo: 'Ejecuta `tracert -d 1.1.1.1` para rastrear saltos omitiendo la resolución DNS inversa.',
      },
    },
    entende: {
      queEs: 'Herramienta de diagnóstico de rutas de red para identificar la secuencia de routers atravesados.',
      paraQueSirve: 'Localizar el punto exacto donde la latencia se dispara o el tráfico se interrumpe.',
      quePasaSiFalta: 'Incapacidad para aislar si una falla de red es local, del ISP o del destino.',
    },
    interactua: {
      cmdExample: 'tracert -d -h 10 8.8.8.8',
      syntaxBreakdown: '`-d` no resuelve nombres para acelerar; `-h 10` limita el rastreo a máximo 10 saltos.',
      whatToLookFor: 'Lista numerada de saltos con tiempos en ms e IP de cada router.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Operación de consulta pasiva.',
      safetyWarning: 'Usar el modificador `-d` evita demoras largas por consultas DNS inversas.',
    },
    evidenceBadge: {
      code: 'CMD-TRC-20',
      label: 'TRACERT_HOP_TRACE',
    },
  },
  {
    id: 'inv-09-21',
    code: '09.21',
    title: 'pathping',
    subtitle: 'Combinación pericial de traceroute y análisis estadístico de pérdida por salto',
    commandName: 'pathping',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`pathping` envía múltiples pings a cada router intermedio durante varios minutos para calcular pérdidas.',
      mythVsTruth: {
        mentira: '`pathping` da resultados instantáneos como `ping`.',
        verdad: 'Tarda varios minutos analizando cada salto para ofrecer estadísticas precisas de calidad de enlace.',
        comprobalo: 'Ejecuta `pathping -q 5 8.8.8.8` indicando 5 consultas por salto para acelerar la prueba.',
      },
    },
    entende: {
      queEs: 'Herramienta avanzada de diagnóstico de red que fusiona las capacidades de `tracert` y `ping`.',
      paraQueSirve: 'Medir degradación de línea y congestión en enlaces específicos de red.',
      quePasaSiFalta: 'Incapacidad de medir congestión intermitente en tramos intermedios de red.',
    },
    interactua: {
      cmdExample: 'pathping -n -q 5 -w 500 1.1.1.1',
      syntaxBreakdown: '`-n` omite resolución de nombres; `-q 5` reduce muestras para un informe más rápido.',
      whatToLookFor: 'Tabla final de porcentaje de pérdida de paquetes por cada router.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Solo lectura de red.',
      safetyWarning: 'Sin el modificador `-q` reducido puede demorar hasta 5 minutos.',
    },
    evidenceBadge: {
      code: 'CMD-PTH-21',
      label: 'PATHPING_STATISTICAL_ANALYSIS',
    },
  },
  {
    id: 'inv-09-22',
    code: '09.22',
    title: 'nslookup',
    subtitle: 'Consulta pericial de registros DNS: A, AAAA, MX, CNAME y pruebas de servidores DNS',
    commandName: 'nslookup',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`nslookup` permite probar servidores DNS específicos independientemente de la configuración local.',
      mythVsTruth: {
        mentira: '`nslookup` prueba si la página web está respondiendo.',
        verdad: 'Solo prueba si el Servidor DNS traduce correctamente el nombre de dominio a una IP.',
        comprobalo: 'Ejecuta `nslookup google.com 8.8.8.8` para consultar el dominio directamente a Google DNS.',
      },
    },
    entende: {
      queEs: 'Utilidad interactiva o por comandos para consultar la infraestructura de Servidores de Nombre.',
      paraQueSirve: 'Verificar registros DNS, detectar envenenamiento de DNS y probar servidores DNS alternativos.',
      quePasaSiFalta: 'Diagnóstico ciego de fallas de resolución de nombres de dominio.',
    },
    interactua: {
      cmdExample: 'nslookup -type=A microsoft.com 1.1.1.1',
      syntaxBreakdown: '`-type=A` solicita la dirección IPv4 mapeada por el DNS 1.1.1.1.',
      whatToLookFor: 'Sección "Respuesta no autoritativa" con la IP resuelta.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Consulta de registros de red.',
      safetyWarning: 'No tiene riesgos.',
    },
    evidenceBadge: {
      code: 'CMD-NSL-22',
      label: 'NSLOOKUP_DNS_QUERY',
    },
  },
  {
    id: 'inv-09-23',
    code: '09.23',
    title: 'netstat',
    subtitle: 'Auditoría pericial de sockets de red activos, conexiones TCP/UDP, puertos y PIDs',
    commandName: 'netstat',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`netstat -ano` revela el número de proceso (PID) que abrió cada conexión de red activa.',
      mythVsTruth: {
        mentira: 'Ver un puerto en estado `LISTENING` o `ESTABLISHED` indica un virus en la computadora.',
        verdad: 'Los servicios de Windows y navegadores abren docenas de sockets normales para funcionar.',
        comprobalo: 'Ejecuta `netstat -ano | findstr /i "ESTABLISHED"` y relaciona el PID con `tasklist`.',
      },
    },
    entende: {
      queEs: 'Herramienta de inspección de la tabla de conexiones de red del Kernel de Windows.',
      paraQueSirve: 'Identificar puertos abiertos, servidores escuchando y conexiones salientes sospechosas.',
      quePasaSiFalta: 'Incapacidad de detectar troyanos o servicios expuestos a la red local.',
    },
    interactua: {
      cmdExample: 'netstat -ano -p tcp',
      syntaxBreakdown: '`-a` muestra todas las conexiones; `-n` en formato numérico; `-o` incluye el PID.',
      whatToLookFor: 'Local Address, Foreign Address, State (LISTENING/ESTABLISHED) y PID.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Mapeo pasivo de sockets.',
      safetyWarning: 'Combinar con `tasklist` para verificar el ejecutable dueño del PID.',
    },
    evidenceBadge: {
      code: 'CMD-NST-23',
      label: 'NETSTAT_SOCKET_AUDIT',
    },
  },
  {
    id: 'inv-09-24',
    code: '09.24',
    title: 'arp',
    subtitle: 'Inspección y gestión de la tabla de resolución de direcciones IP a MAC (Address Resolution Protocol)',
    commandName: 'arp',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '`arp -a` muestra la tabla de equivalencias entre direcciones IP locales y direcciones MAC físicas.',
      mythVsTruth: {
        mentira: 'La tabla ARP muestra dispositivos de todo Internet.',
        verdad: 'Solo registra dispositivos pertenecientes al mismo segmento de red de capa 2 (LAN local).',
        comprobalo: 'Ejecuta `arp -a` para ver las direcciones MAC del router y equipos locales.',
      },
    },
    entende: {
      queEs: 'Caché que mapea direcciones lógicas IP (Capa 3) a direcciones físicas MAC (Capa 2).',
      paraQueSirve: 'Identificar la dirección MAC del router local y detectar ataques ARP Spoofing.',
      quePasaSiFalta: 'Incapacidad de verificar la identidad física de dispositivos en la red LAN.',
    },
    interactua: {
      cmdExample: 'arp -a',
      syntaxBreakdown: 'Muestra la tabla ARP completa organizada por interfaz de red.',
      whatToLookFor: 'Dirección IP, Dirección física (MAC) y Tipo (dinámico/estático).',
    },
    alertaEVO: {
      reversibilityRule: '`arp -d *` limpia la caché ARP sin daños; Windows la reconstruye automáticamente.',
      safetyWarning: 'No ingresar entradas estáticas incorrectas con `arp -s`.',
    },
    evidenceBadge: {
      code: 'CMD-ARP-24',
      label: 'ARP_CACHE_TABLE',
    },
  },
  {
    id: 'inv-09-25',
    code: '09.25',
    title: 'route',
    subtitle: 'Inspección de la tabla de enrutamiento IP del Kernel: route print',
    commandName: 'route',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`route print` revela cómo decide Windows por qué interfaz enviar cada paquete IP.',
      mythVsTruth: {
        mentira: 'Windows manda todos los datos por la primera tarjeta de red conectada.',
        verdad: 'Windows consulta la tabla de enrutamiento y elige la ruta con el prefijo más específico y menor métrica.',
        comprobalo: 'Ejecuta `route print` e inspecciona la sección "Rutas IPv4".',
      },
    },
    entende: {
      queEs: 'Herramienta de consulta y modificación de la tabla de enrutamiento estático del sistema.',
      paraQueSirve: 'Diagnosticar problemas en equipos con múltiples tarjetas de red o VPNs activas.',
      quePasaSiFalta: 'Incapacidad de diagnosticar conflictos de enrutamiento de red.',
    },
    interactua: {
      cmdExample: 'route print 0.0.0.0',
      syntaxBreakdown: 'Muestra la ruta por defecto (Default Gateway) y su métrica.',
      whatToLookFor: 'Red de destino 0.0.0.0, Máscara 0.0.0.0, Gateway e Interfaz.',
    },
    alertaEVO: {
      reversibilityRule: '`route print` es seguro. `route add` o `delete` modifican rutas de red.',
      safetyWarning: 'No ejecutar `route delete 0.0.0.0` porque desconectará la computadora de Internet.',
    },
    evidenceBadge: {
      code: 'CMD-RTE-25',
      label: 'ROUTE_PRINT_AUDIT',
    },
  },
  {
    id: 'inv-09-26',
    code: '09.26',
    title: 'sfc',
    subtitle: 'System File Checker: verificación de integridad de archivos protegidos de Windows y reparaciones CBS',
    commandName: 'sfc',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: '`sfc /scannow` compara los hashes de los archivos de sistema activos contra la copia limpia en WinSxS.',
      mythVsTruth: {
        mentira: '`sfc /scannow` arregla cualquier problema técnico o falla de programas de terceros.',
        verdad: 'Solo verifica y reemplaza archivos DLL/EXE nativos protegidos de Windows si están corruptos.',
        comprobalo: 'Ejecuta `sfc /scannow` en una consola elevada y lee el log en `%WINDIR%\\Logs\\CBS\\CBS.log`.',
      },
    },
    entende: {
      queEs: 'Utilidad de protección de recursos de Windows (WRP) que audita e instala copias limpias de sistema.',
      paraQueSirve: 'Reparar DLLs de sistema dañados o modificados por malware.',
      quePasaSiFalta: 'Necesidad de formatear o reinstalar Windows ante corrupción leve de sistema.',
    },
    interactua: {
      cmdExample: 'sfc /scannow',
      syntaxBreakdown: 'Escanea inmediatamente todos los archivos protegidos del sistema.',
      whatToLookFor: 'Mensaje final: "Protección de recursos de Windows no encontró ninguna infracción...".',
    },
    alertaEVO: {
      reversibilityRule: 'Reemplaza archivos dañados por versiones oficiales firmadas.',
      safetyWarning: 'Requiere consola de Administrador. Tarda entre 5 y 15 minutos.',
    },
    evidenceBadge: {
      code: 'CMD-SFC-26',
      label: 'SFC_FILE_INTEGRITY',
    },
  },
  {
    id: 'inv-09-27',
    code: '09.27',
    title: 'DISM',
    subtitle: 'Deployment Image Servicing and Management: reparación de la imagen y almacén de componentes WinSxS',
    commandName: 'DISM',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Si `sfc /scannow` falla diciendo que no pudo reparar archivos, `DISM /RestoreHealth` repara el almacén WinSxS.',
      mythVsTruth: {
        mentira: '`DISM` y `sfc` hacen exactamente lo mismo.',
        verdad: '`DISM` repara la fuente de componentes (WinSxS); `sfc` utiliza WinSxS para reparar Windows.',
        comprobalo: 'Ejecuta `DISM /Online /Cleanup-Image /ScanHealth` para comprobar la salud de la imagen.',
      },
    },
    entende: {
      queEs: 'Herramienta de mantenimiento de imágenes de Windows y del almacén de componentes de la SO.',
      paraQueSirve: 'Reparar la imagen del sistema descargando archivos limpios de Windows Update.',
      quePasaSiFalta: 'Incapacidad de reparar un almacén de componentes (WinSxS) corrupto.',
    },
    interactua: {
      cmdExample: 'DISM /Online /Cleanup-Image /CheckHealth',
      syntaxBreakdown: 'Verifica rápidamente si el almacén de componentes ha sido marcado como corrupto.',
      whatToLookFor: 'Resultado: "No se detectaron daños en el almacén de componentes".',
    },
    alertaEVO: {
      reversibilityRule: 'Descarga e instala componentes limpios de Microsoft.',
      safetyWarning: '`RestoreHealth` requiere conexión activa a Internet o una fuente WIM limpia.',
    },
    evidenceBadge: {
      code: 'CMD-DSM-27',
      label: 'DISM_IMAGE_SERVICING',
    },
  },
  {
    id: 'inv-09-28',
    code: '09.28',
    title: 'chkdsk',
    subtitle: 'Verificación pericial de la estructura del sistema de archivos NTFS/FAT32 y bloques del disco',
    commandName: 'chkdsk',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Ejecutar `chkdsk C:` sin parámetros analiza el disco en MODO LECTURA sin desmontar ni modificar nada.',
      mythVsTruth: {
        mentira: 'Ejecutar `chkdsk /f /r` siempre es seguro y acelera el disco duro.',
        verdad: 'En un disco SSD o HDD con fallas físicas graves, `/r` puede estresar el disco y acelerar su colapso.',
        comprobalo: 'Usa `chkdsk C:` para auditar errores sin riesgo antes de aplicar `/f`.',
      },
    },
    entende: {
      queEs: 'Utilidad de reparación de la Master File Table (MFT), descriptores de seguridad y sectores de disco.',
      paraQueSirve: 'Corregir incoherencias del sistema de archivos provocadas por apagones o cortes de energía.',
      quePasaSiFalta: 'Pérdida de archivos por sectores o descriptores MFT huérfanos.',
    },
    interactua: {
      cmdExample: 'chkdsk C:',
      syntaxBreakdown: 'Modo lectura de 3 fases que comprueba archivos, índices y descriptores.',
      whatToLookFor: '"Windows examinó el sistema de archivos y no encontró problemas."',
    },
    alertaEVO: {
      reversibilityRule: '`chkdsk /f` repara estructuras de archivos. `/r` localiza sectores defectuosos.',
      safetyWarning: '`chkdsk /f` en la unidad C: requerirá reiniciar el equipo para ejecutarse antes del inicio de Windows.',
    },
    evidenceBadge: {
      code: 'CMD-CHK-28',
      label: 'CHKDSK_NTFS_INTEGRITY',
    },
  },
  {
    id: 'inv-09-29',
    code: '09.29',
    title: 'Crear scripts .cmd',
    subtitle: 'Anatomía de scripts de procesamiento por lotes: @echo off, echo, variables, condicionales y logs',
    commandName: 'scripting .cmd',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '`@echo off` en la primera línea de un script oculta la impresión de los comandos ejecutados.',
      mythVsTruth: {
        mentira: 'Un script `.cmd` se ejecuta más lento que escribir los comandos a mano.',
        verdad: 'El intérprete `cmd.exe` procesa las líneas del script en milisegundos con cero latencia humana.',
        comprobalo: 'Crea `test.cmd` con `@echo off`, `echo Hola EVO` y ejecútalo.',
      },
    },
    entende: {
      queEs: 'Archivos de texto con extensión `.cmd` o `.bat` que contienen secuencias de comandos de consola.',
      paraQueSirve: 'Automatizar rutinas de diagnóstico, recolección de logs y tareas repetitivas de mantenimiento.',
      quePasaSiFalta: 'Incapacidad de estandarizar procedimientos periciales de diagnóstico.',
    },
    interactua: {
      cmdExample: '@echo off\necho Auditando red...\nipconfig /all > %TEMP%\\evo_net.txt\necho Reporte guardado en %TEMP%\\evo_net.txt',
      syntaxBreakdown: 'Estructura básica limpia de script de diagnóstico seguro.',
      whatToLookFor: 'Generación limpia del reporte sin spam en la consola.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro mientras los comandos internos sean de lectura.',
      safetyWarning: 'Probar siempre los scripts en un entorno controlado antes de desplegarlos.',
    },
    evidenceBadge: {
      code: 'CMD-BAT-29',
      label: 'BATCH_SCRIPT_ANATOMY',
    },
  },
  {
    id: 'inv-09-30',
    code: '09.30',
    title: 'Crear menú EVO de diagnóstico',
    subtitle: 'Desarrollo de una consola interactiva por menús con comandos reales en Batch',
    commandName: 'Menú EVO .cmd',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '`choice /c 1234` captura opciones del teclado de forma limpia sin requerir presionar Enter.',
      mythVsTruth: {
        mentira: 'Un menú en CMD requiere programación compleja en C++ o C#.',
        verdad: 'Con etiquetas `:menu`, `choice` o `set /p` e `if %ERRORLEVEL%` se construyen menús profesionales.',
        comprobalo: 'Usa `choice /c 123 /m "Seleccione una opción:"` en la consola.',
      },
    },
    entende: {
      queEs: 'Patrón de diseño de scripts interactivos que ofrece un menú numérico de herramientas de diagnóstico.',
      paraQueSirve: 'Crear consolas de soporte rápido para técnicos y alumnos en campo.',
      quePasaSiFalta: 'Soporte técnico caótico sin guías de procedimiento claras.',
    },
    interactua: {
      cmdExample: 'choice /c 123 /m "1. Sistema | 2. Red | 3. Salir"',
      syntaxBreakdown: '`choice` limita la entrada a las teclas válidas y devuelve `ERRORLEVEL` (1, 2 o 3).',
      whatToLookFor: 'Muestra el prompt interactivo y espera la tecla del usuario.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro. Interfaz de usuario pura en consola.',
      safetyWarning: 'Garantizar que todas las opciones remitan a tareas de lectura sin acciones destructivas.',
    },
    evidenceBadge: {
      code: 'CMD-MNU-30',
      label: 'EVO_DIAGNOSTIC_MENU',
    },
  },
];

export const SECTOR_09_MINICASES: Sector09MiniCase[] = [
  {
    id: 'case-09-a',
    code: 'CASO 09-A',
    title: 'El script fantasma que sobreescribía los informes',
    scenario: 'Un técnico en soporte creó un script de diagnóstico que ejecutaba `systeminfo > C:\\Logs\\reporte.txt`. Al correrlo varias veces al día para auditar errores intermitentes, notó que siempre perdía el historial de las pruebas anteriores.',
    userStatement: '“Corro el script cada hora pero mi archivo reporte.txt solo tiene los datos de la última ejecución.”',
    initialMistake: 'Utilizar el operador de redirección `>` en lugar del operador de adición `>>`.',
    diagnosticQuestion: '¿Cómo debe corregirse la redirección para conservar todo el historial de eventos?',
    options: [
      {
        id: 'c9_a1',
        text: 'Cambiar el operador a `systeminfo >> C:\\Logs\\reporte.txt` para concatenar los reportes al final del archivo.',
        isCorrect: true,
        explanation: '`>>` agrega líneas al final del archivo existente sin destruir el contenido previo.',
      },
      {
        id: 'c9_a2',
        text: 'Agregar `/f` al comando systeminfo.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se reemplazó `>` por `>>` en el script. El archivo de informe ahora conserva el registro completo acumulado de cada auditoría.',
    lessonLearned: 'Usa `>` para crear/sobrescribir y `>>` para acumular historial de auditoría en archivos de texto.',
  },
  {
    id: 'case-09-b',
    code: 'CASO 09-B',
    title: 'El enigma de la redirección que no guardaba los errores',
    scenario: 'Un especialista intentó guardar los errores de un comando `dir` en un archivo con `dir C:\\CarpetaProtegida > errores.log`. A pesar de que la consola mostró un mensaje de acceso denegado, el archivo `errores.log` quedó completamente en blanco.',
    userStatement: '“El comando falló en pantalla pero el archivo errores.log se creó vacío.”',
    initialMistake: 'Creer que `>` captura la salida de errores (STDERR / Canal 2).',
    diagnosticQuestion: '¿Por qué el mensaje de error no se guardó en el archivo y cuál es la sintaxis correcta?',
    options: [
      {
        id: 'c9_b1',
        text: 'Porque `>` solo redirige la salida estándar (STDOUT / Canal 1). Para capturar errores se debe usar `2> errores.log` o `> errores.log 2>&1`.',
        isCorrect: true,
        explanation: 'Los mensajes de error viajan por el descriptor 2 (STDERR). `2>` desvía específicamente ese flujo.',
      },
      {
        id: 'c9_b2',
        text: 'Porque la consola CMD no permite guardar errores en archivos de texto.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se actualizó la orden a `dir C:\\CarpetaProtegida > reporte.log 2>&1`. Tanto los datos como los mensajes de error quedaron registrados.',
    lessonLearned: 'Redirige STDERR (2>) para capturar fallas y excepciones en scripts desatendidos.',
  },
  {
    id: 'case-09-c',
    code: 'CASO 09-C',
    title: 'El puerto bloqueado y la búsqueda del PID en netstat',
    scenario: 'Un servidor local reportaba que el puerto 8080 estaba ocupado por otra aplicación desconocida. El técnico corrió `netstat -a` pero vio decenas de líneas con IPs sin saber cuál programa era el responsable.',
    userStatement: '“Veo que el puerto 8080 está LISTENING pero no sé qué programa de Windows lo tiene tomado.”',
    initialMistake: 'Usar `netstat -a` sin el modificador `-o` para obtener el Process Identifier (PID).',
    diagnosticQuestion: '¿Qué combinación de comandos y modificadores identifica con precisión el ejecutable culpable?',
    options: [
      {
        id: 'c9_c1',
        text: 'Ejecutar `netstat -ano | findstr :8080` para obtener el PID y luego `tasklist /fi "PID eq <PID>"` para ver el proceso.',
        isCorrect: true,
        explanation: '`-o` revela el PID asociado a cada socket de red. `findstr` aisla la fila y `tasklist` revela el ejecutable.',
      },
      {
        id: 'c9_c2',
        text: 'Ejecutar `ipconfig /flushdns` para liberar los puertos de red.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Con `netstat -ano | findstr :8080` se obtuvo el PID 4328, perteneciente a un servicio web secundario no autorizado (`node.exe`). Se terminó el proceso liberando el puerto.',
    lessonLearned: 'Mapea siempre sockets a PIDs con `netstat -ano` para auditar qué programas escuchan en la red.',
  },
  {
    id: 'case-09-d',
    code: 'CASO 09-D',
    title: 'El bucle sin fin por falta de EXIT CODE en CALL',
    scenario: 'Un script por lotes ejecutaba un sub-script secundario. Al terminar la tarea secundaria, la consola se cerraba abruptamente en lugar de volver al menú principal del script padre.',
    userStatement: '“Llamo a mi sub-script y al terminar la ventana de CMD se cierra sola.”',
    initialMistake: 'Invocó el sub-script directamente sin la orden `call` o colocó `exit` en lugar de `goto :eof` en la subrutina.',
    diagnosticQuestion: '¿Cómo debe estructurarse la llamada para garantizar el retorno al script principal?',
    options: [
      {
        id: 'c9_d1',
        text: 'Invocar el sub-script con `call subscript.cmd` y asegurar que la subrutina finalice con `goto :eof` o `exit /b`.',
        isCorrect: true,
        explanation: '`call` mantiene la pila de ejecución. `exit /b` o `goto :eof` retornan el control al invocador en lugar de cerrar el proceso `cmd.exe`.',
      },
      {
        id: 'c9_d2',
        text: 'Colocar `@echo off` al principio de cada archivo.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se corrigió la invocación a `call` y se cambió `exit` por `exit /b 0` en el sub-script, logrando un flujo fluido.',
    lessonLearned: 'Usa `call` para sub-scripts y `exit /b` para salir de subrutinas sin cerrar el intérprete principal.',
  },
  {
    id: 'case-09-e',
    code: 'CASO 09-E',
    title: 'La falsa alarma de fallas en SFC /scannow',
    scenario: 'Un técnico ejecutó `sfc /scannow` para intentar reparar un problema de audio. El comando finalizó informando que "encontró archivos dañados y los reaparó con éxito", pero el audio siguió sin funcionar.',
    userStatement: '“SFC me dijo que reparó Windows pero mi problema de sonido no se solucionó.”',
    initialMistake: 'Asumir que SFC repara problemas de controladores de hardware de terceros o configuraciones de audio.',
    diagnosticQuestion: '¿Qué verifica realmente SFC y por qué no solucionó la falla de audio?',
    options: [
      {
        id: 'c9_e1',
        text: 'SFC verifica únicamente los archivos binarios protegidos nativos del sistema operativo Windows. No instala ni repara controladores de audio de terceros ni configuraciones de dispositivos.',
        isCorrect: true,
        explanation: 'SFC no es una herramienta universal para hardware o drivers de fabricantes externos.',
      },
      {
        id: 'c9_e2',
        text: 'SFC requiere ejecutarse siempre junto con chkdsk /r.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'SFC reparó DLLs menores del sistema sin relación al driver de audio. La falla se solucionó reinstalando el controlador de la placa de sonido con `devmgmt.msc`.',
    lessonLearned: 'Aplica herramientas con propósito específico: SFC para binarios de SO, no para drivers o hardware.',
  },
];

export const SECTOR_09_TEST_BANK: Sector09TestQuestion[] = [
  {
    id: 't09-q01',
    questionNumber: 1,
    category: 'SINTAXIS_REDRECCION',
    question: '¿Qué descriptor de salida desvía el operador `2>` en la línea de comandos de Windows?',
    options: [
      { id: 'opt_1', text: 'Canal de errores estándar (STDERR)' },
      { id: 'opt_2', text: 'Canal de entrada estándar (STDIN)' },
      { id: 'opt_3', text: 'Salida de pantalla (STDOUT)' },
      { id: 'opt_4', text: 'Registro de eventos de Windows' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'En el modelo I/O de consola, 1 representa STDOUT y 2 representa STDERR. `2>` redirige exclusivamente los errores.',
    relatedInvestigationCode: '09.04',
  },
  {
    id: 't09-q02',
    questionNumber: 2,
    category: 'CONTROL_PROCESOS',
    question: '¿Qué parámetro de `taskkill` fuerza la terminación inmediata e incondicional de un proceso en memoria?',
    options: [
      { id: 'opt_1', text: '/F' },
      { id: 'opt_2', text: '/T' },
      { id: 'opt_3', text: '/STOP' },
      { id: 'opt_4', text: '/KILL' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'El parámetro `/F` fuerza la finalización del proceso sin esperar respuesta de guardado.',
    relatedInvestigationCode: '09.11',
  },
  {
    id: 't09-q03',
    questionNumber: 3,
    category: 'NETWORKING_CLI',
    question: '¿Qué comando de consola muestra la tabla de equivalencias entre direcciones IP locales y direcciones MAC físicas en Capa 2?',
    options: [
      { id: 'opt_1', text: 'arp -a' },
      { id: 'opt_2', text: 'ipconfig /all' },
      { id: 'opt_3', text: 'netstat -r' },
      { id: 'opt_4', text: 'route print' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: '`arp -a` consulta la caché ARP local que vincula direcciones IP con sus correspondientes direcciones MAC de hardware.',
    relatedInvestigationCode: '09.24',
  },
  {
    id: 't09-q04',
    questionNumber: 4,
    category: 'DIAGNOSTICO_SISTEMA',
    question: 'Si `sfc /scannow` informa que no puede reparar archivos porque el almacén de componentes está corrupto, ¿qué comando debe ejecutarse primero?',
    options: [
      { id: 'opt_1', text: 'DISM /Online /Cleanup-Image /RestoreHealth' },
      { id: 'opt_2', text: 'chkdsk C: /f /r' },
      { id: 'opt_3', text: 'taskkill /f /im explorer.exe' },
      { id: 'opt_4', text: 'ipconfig /flushdns' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'DISM /RestoreHealth repara la imagen del almacén de componentes (WinSxS) para que SFC tenga una fuente limpia de reparación.',
    relatedInvestigationCode: '09.27',
  },
  {
    id: 't09-q05',
    questionNumber: 5,
    category: 'SINTAXIS_REDRECCION',
    question: '¿Qué variable especial de CMD almacena el código numérico de retorno de la última orden ejecutada?',
    options: [
      { id: 'opt_1', text: '%ERRORLEVEL%' },
      { id: 'opt_2', text: '%EXITCODE%' },
      { id: 'opt_3', text: '%STATUS%' },
      { id: 'opt_4', text: '%RESULT%' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: '`%ERRORLEVEL%` es la variable del entorno que captura el entero devuelto por el proceso previo (0 = éxito, >0 = error).',
    relatedInvestigationCode: '09.08',
  },
];
