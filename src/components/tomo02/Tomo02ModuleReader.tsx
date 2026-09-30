import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Copy,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  BookOpen,
  Award,
  Clock,
  AlertTriangle,
  Zap,
  Activity,
  Compass,
  Cpu,
  Database,
  FileText,
  Search,
  CheckSquare,
  Flame,
  Info,
  Sliders,
} from 'lucide-react';
import { TOMO_02_MODULES, TomoModuleItem, TOMO_02_META } from '../../data/tomo02Data';

interface Tomo02ModuleReaderProps {
  moduleIndex: number;
  onBackToIndex: () => void;
  onSelectModule: (index: number) => void;
  onMarkCompleted: (moduleId: string) => void;
  isCompleted: boolean;
  onFinishTomo: () => void;
}

// Module-specific interactive check questions for all modules
interface CheckQuestion {
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

interface ChapterRichContent {
  hookQuestion: string;
  simpleAnalogy: string;
  evoExplains: string;
  mythVsReality: {
    myth: string;
    reality: string;
  };
  technicalDeepDive: {
    title: string;
    items: string[];
  };
  diagramTitle: string;
  diagramDescription: string;
  diagramPendingNote: string;
  evoCase: {
    title: string;
    victim: string;
    symptom: string;
    initialHypothesis: string;
    rootCause: string;
    resolution: string;
  };
  practiceDetails: {
    objective: string;
    dataType: 'MEASURED' | 'SYSTEM_REPORTED' | 'SIMULATED' | 'ESTIMATED' | 'UNKNOWN';
    whatToObserve: string;
    steps: string[];
    interpretation: string;
    howToRollback: string;
  };
}

const MODULE_QUESTIONS: Record<string, CheckQuestion> = {
  m00: {
    question: '¿Por qué la metodología EVO exige registrar un baseline métrico antes de aplicar cualquier ajuste a Windows?',
    options: [
      {
        label: 'Porque sin métricas previas verificables, cualquier sensación de mejora es mero efecto placebo.',
        isCorrect: true,
        explanation: 'Exacto: la metrología empírica compara tiempos de arranque, latencia DPC y consumo de Commit antes y después de cada cambio.',
      },
      {
        label: 'Para asegurar que Windows Update no descargue más parches.',
        isCorrect: false,
        explanation: 'Falso: el baseline no interrumpe Windows Update, sino que documenta el estado del sistema.',
      },
      {
        label: 'Porque Windows formatea automáticamente el disco si no hay una bitácora.',
        isCorrect: false,
        explanation: 'Falso: Windows no requiere bitácoras obligatorias; es una disciplina profesional del técnico.',
      },
    ],
  },
  m01: {
    question: '¿Cuál es el rol de la partición EFI System Partition (ESP) en un arranque moderno UEFI?',
    options: [
      {
        label: 'Albergar el archivo bootmgfw.efi y la configuración BCD leída por el firmware.',
        isCorrect: true,
        explanation: 'Correcto: la partición FAT32 de 100MB contiene los cargadores de arranque firmados criptográficamente que UEFI ejecuta.',
      },
      {
        label: 'Guardar la memoria swap de las aplicaciones en segundo plano.',
        isCorrect: false,
        explanation: 'Falso: la memoria swap/virtual se gestiona mediante pagefile.sys en la partición principal de Windows.',
      },
      {
        label: 'Almacenar copias de seguridad de los juegos instalados.',
        isCorrect: false,
        explanation: 'Falso: la partición ESP mide solo 100MB y está restringida a binarios de booteo.',
      },
    ],
  },
  m02: {
    question: '¿Por qué es indispensable verificar el hash criptográfico SHA-256 de una imagen ISO de Windows antes de instalarla?',
    options: [
      {
        label: 'Para garantizar que la imagen proviene intacta de los servidores de Microsoft y no contiene malware ni scripts inyectados.',
        isCorrect: true,
        explanation: 'Excelente: el hash SHA-256 valida la autenticidad matemática bit a bit del instalador del sistema.',
      },
      {
        label: 'Para acelerar la velocidad de lectura del pendrive USB.',
        isCorrect: false,
        explanation: 'Falso: el cálculo de hash es una validación de seguridad de datos, no acelera el hardware USB.',
      },
      {
        label: 'Para evitar tener que conectar la máquina a la corriente eléctrica.',
        isCorrect: false,
        explanation: 'Falso: la instalación de un SO requiere alimentación continua.',
      },
    ],
  },
  m03: {
    question: '¿Qué diferencia crucial existe entre las carpetas C:\\Windows\\System32 y C:\\Windows\\SysWOW64?',
    options: [
      {
        label: 'System32 aloja ejecutables y DLLs nativas de 64 bits, mientras que SysWOW64 aloja librerías de 32 bits.',
        isCorrect: true,
        explanation: '¡Excelente! A pesar de su nombre, SysWOW64 significa "Windows 32-bit on Windows 64-bit" y provee compatibilidad con software legado de 32 bits.',
      },
      {
        label: 'System32 solo se usa en Windows 7 y SysWOW64 en Windows 11.',
        isCorrect: false,
        explanation: 'Falso: ambos coexisten en todas las versiones de 64 bits de Windows.',
      },
      {
        label: 'SysWOW64 es una carpeta temporal que se puede borrar sin consecuencias.',
        isCorrect: false,
        explanation: '¡Peligro! Borrar SysWOW64 destruiría la ejecución de cualquier programa o instalador de 32 bits.',
      },
    ],
  },
  m04: {
    question: '¿Cómo protege el Journaling de NTFS la integridad de los datos ante un corte repentino de energía eléctrica?',
    options: [
      {
        label: 'Registrando transacciones atómicas pendientes en el archivo $LogFile antes de confirmar los cambios en la Master File Table (MFT).',
        isCorrect: true,
        explanation: 'Correcto: ante un reinicio abrupto, NTFS lee el log y hace rollback de operaciones incompletas para evitar inconsistencias de disco.',
      },
      {
        label: 'Guardando una copia de seguridad en la nube de Microsoft OneDrive.',
        isCorrect: false,
        explanation: 'Falso: el Journaling es un mecanismo interno a nivel de bloques en el sistema de archivos local.',
      },
      {
        label: 'Alimentando la placa madre con energía estática residual.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación alguna con almacenamiento de energía.',
      },
    ],
  },
  m05: {
    question: '¿Qué ventaja estructural ofrece el formato MSI frente a un instalador EXE tradicional no estructurado?',
    options: [
      {
        label: 'Es una base de datos relacional estandarizada por Windows Installer con soporte transaccional y rollback garantizado.',
        isCorrect: true,
        explanation: 'Exacto: un archivo MSI sabe exactamente qué archivos y claves escribió, permitiendo desinstalaciones y reparaciones completas.',
      },
      {
        label: 'Permite saltarse la comprobación de firmas digitales del UAC.',
        isCorrect: false,
        explanation: 'Falso: los archivos MSI también son auditados por el UAC y SmartScreen.',
      },
      {
        label: 'Pesa siempre menos de 1 Megabyte.',
        isCorrect: false,
        explanation: 'Falso: el tamaño depende del software empaquetado.',
      },
    ],
  },
  m06: {
    question: '¿Qué ocurre si un operador finaliza por la fuerza el proceso del sistema csrss.exe o wininit.exe?',
    options: [
      {
        label: 'El kernel de Windows detiene la CPU de inmediato con una pantalla azul (BSOD) CRITICAL_PROCESS_DIED para proteger la integridad del sistema.',
        isCorrect: true,
        explanation: 'Correcto: csrss y wininit son subsistemas esenciales del kernel; su muerte provoca un pánico de kernel instantáneo.',
      },
      {
        label: 'La computadora consume un 50% menos de memoria RAM de forma permanente.',
        isCorrect: false,
        explanation: 'Falso: finalizar estos procesos cuelga el equipo en el milisegundo en que se envía la señal.',
      },
      {
        label: 'Windows se reinicia suavemente en modo seguro.',
        isCorrect: false,
        explanation: 'Falso: no hay reinicio suave, ocurre un kernel panic directo.',
      },
    ],
  },
  m07: {
    question: '¿Por qué la creencia de que "la RAM libre es la mejor RAM" es un mito desmentido por la telemetría?',
    options: [
      {
        label: 'Porque Windows utiliza la memoria no ocupada como caché Standby predictivo; si una app la necesita, se desaloja en nanosegundos.',
        isCorrect: true,
        explanation: '¡Exacto! Memoria RAM vacía es silicio eléctrico desaprovechado. Windows mantiene archivos frecuentes en caché de memoria para acelerar su lectura.',
      },
      {
        label: 'Porque la RAM libre calienta más los circuitos integrados de la placa.',
        isCorrect: false,
        explanation: 'Falso: el calor disipado depende de las transiciones de reloj y voltajes, no del contenido lógico de las celdas.',
      },
      {
        label: 'Porque desactivar la RAM hace que el disco NVMe funcione el doble de rápido.',
        isCorrect: false,
        explanation: 'Falso: la RAM es órdenes de magnitud más veloz que cualquier disco NVMe.',
      },
    ],
  },
  m08: {
    question: '¿Qué representa la cadena VEN_xxxx y DEV_xxxx en el Hardware ID de un controlador de Windows?',
    options: [
      {
        label: 'El identificador oficial del fabricante (Vendor) y del modelo de chip (Device) estandarizado por el consorcio PCI/USB.',
        isCorrect: true,
        explanation: 'Excelente: permite saber con precisión quirúrgica el fabricante real del chip físico independientemente de la marca de la computadora.',
      },
      {
        label: 'La fecha de fabricación y la velocidad en Megahertz.',
        isCorrect: false,
        explanation: 'Falso: los Hardware IDs identifican vendor y chip lógicamente, no frecuencias.',
      },
      {
        label: 'El número de serie de la licencia de Windows.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación con el licenciamiento del OS.',
      },
    ],
  },
  m09: {
    question: 'Si una unidad USB aparece en Administrador de Dispositivos pero no en el Explorador de Archivos, ¿cuál es el primer chequeo?',
    options: [
      {
        label: 'Abrir diskmgmt.msc y verificar si la partición tiene una letra de unidad asignada o si el volumen está en estado Offline.',
        isCorrect: true,
        explanation: 'Correcto: la mayoría de estos casos se resuelven asignando una letra de unidad desde Administración de Discos.',
      },
      {
        label: 'Tirar el pendrive a la basura porque el silicio se desmagnetizó.',
        isCorrect: false,
        explanation: 'Falso: los discos flash NAND no son magnéticos y la falla suele ser puramente lógica de asignación de letra.',
      },
      {
        label: 'Formatear la unidad C:\\ de la PC.',
        isCorrect: false,
        explanation: '¡Peligro! Destruiría los datos de tu computadora sin resolver la unidad externa.',
      },
    ],
  },
  m10: {
    question: '¿Qué comando de PowerShell permite auditar qué proceso y PID específico mantiene un puerto TCP en estado de escucha (Listening)?',
    options: [
      {
        label: 'Get-NetTCPConnection -State Listen | Select LocalPort, OwningProcess',
        isCorrect: true,
        explanation: '¡Perfecto! Este cmdlet nativo correlaciona puertos abiertos con el PID exacto del proceso ejecutor.',
      },
      {
        label: 'ipconfig /flushdns',
        isCorrect: false,
        explanation: 'Falso: flushdns vacía la caché de resolución DNS local, no muestra puertos abiertos.',
      },
      {
        label: 'ping 127.0.0.1 -t',
        isCorrect: false,
        explanation: 'Falso: ping verifica la respuesta de la interfaz de loopback.',
      },
    ],
  },
  m11: {
    question: '¿Por qué la herramienta Autoruns de Sysinternals es superior al Administrador de Tareas para auditar el arranque de Windows?',
    options: [
      {
        label: 'Porque inspecciona más de 20 ubicaciones de persistencia (claves Run, Winlogon, AppInit DLLs, Codecs, Drivers y Servicios) con verificación de firmas criptográficas.',
        isCorrect: true,
        explanation: 'Correcto: Task Manager solo muestra las carpetas de inicio básicas y 2 claves de Registro; Autoruns cubre todo el ecosistema de persistencia del kernel.',
      },
      {
        label: 'Porque Autoruns borra todos los virus automáticamente en 2 segundos.',
        isCorrect: false,
        explanation: 'Falso: Autoruns es una herramienta de auditoría e inspección técnica para el especialista, no un antivirus automático.',
      },
      {
        label: 'Porque viene instalado por defecto en el BIOS.',
        isCorrect: false,
        explanation: 'Falso: es una utilidad de la suite oficial Microsoft Sysinternals.',
      },
    ],
  },
  m12: {
    question: 'En un equipo con disco SSD NVMe de alta velocidad, ¿por qué NO se recomienda desactivar el servicio SysMain a ciegas?',
    options: [
      {
        label: 'Porque en SSDs no produce sobrecarga de disco y asiste a la precarga inteligente en memoria de aplicaciones frecuentes.',
        isCorrect: true,
        explanation: 'Correcto: SysMain solo generaba cuellos de botella en discos mecánicos HDD antiguos (100% de uso de disco). En SSDs modernos su impacto en I/O es insignificante.',
      },
      {
        label: 'Porque SysMain contiene el antivirus de Windows Defender.',
        isCorrect: false,
        explanation: 'Falso: Defender corre en su propio servicio WinDefend bajo MsMpEng.exe.',
      },
      {
        label: 'Porque desactivarlo borra los controladores de la tarjeta gráfica.',
        isCorrect: false,
        explanation: 'Falso: SysMain no tiene relación con el subsistema de controladores de video.',
      },
    ],
  },
  m13: {
    question: '¿Cuál es la diferencia entre deshabilitar una tarea programada en taskschd.msc y eliminarla permanentemente?',
    options: [
      {
        label: 'Deshabilitarla conserva los triggers y rutas para reactivarla de inmediato si se pierde alguna función del sistema o de una aplicación.',
        isCorrect: true,
        explanation: 'Excelente: la reversibilidad documentada es la regla cardinal del método EVO.',
      },
      {
        label: 'Eliminarla acelera el procesador un 300%.',
        isCorrect: false,
        explanation: 'Falso: una tarea inactiva consume cero ciclos de CPU.',
      },
      {
        label: 'Deshabilitarla gasta más electricidad que eliminarla.',
        isCorrect: false,
        explanation: 'Falso: no existe diferencia de consumo eléctrico.',
      },
    ],
  },
  m14: {
    question: '¿Cuál es la principal ventaja técnica de PowerShell frente a la consola clásica CMD?',
    options: [
      {
        label: 'PowerShell transmite objetos estructurados .NET a través del pipeline, permitiendo filtrar propiedades sin parsear cadenas de texto.',
        isCorrect: true,
        explanation: '¡Exacto! El manejo de objetos tipados permite encadenar comandos complejos con máxima fiabilidad y cero errores de formato.',
      },
      {
        label: 'PowerShell funciona sin teclado.',
        isCorrect: false,
        explanation: 'Falso: es un entorno CLI de línea de comandos.',
      },
      {
        label: 'PowerShell es exclusivo de consolas de videojuegos.',
        isCorrect: false,
        explanation: 'Falso: es el entorno de automatización profesional de Windows y plataformas modernas.',
      },
    ],
  },
  m15: {
    question: '¿Cuál es el procedimiento obligatorio del método EVO antes de editar cualquier clave en el Registro de Windows?',
    options: [
      {
        label: 'Exportar la rama o clave modificada a un archivo .reg de respaldo para garantizar rollback inmediato con doble clic.',
        isCorrect: true,
        explanation: 'Excelente: la reversibilidad documentada es la regla de oro de la Academia EVO.',
      },
      {
        label: 'Formatear una unidad USB en formato FAT16.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación alguna con la edición de claves de Registro.',
      },
      {
        label: 'Descargar un optimizador de registro de internet.',
        isCorrect: false,
        explanation: '¡Peligro! Los limpiadores de registro automatizados son una de las causas más frecuentes de rotura de dependencias en Windows.',
      },
    ],
  },
  m16: {
    question: '¿Por qué la metodología EVO desaconseja el uso de scripts de "debloat" masivos descargados de internet?',
    options: [
      {
        label: 'Porque eliminan dependencias críticas del almacén de componentes, rompiendo futuras actualizaciones mensuales y servicios de red.',
        isCorrect: true,
        explanation: 'Totalmente: la mayoría de los debloaters son destructivos e irreversibles. La optimización profesional es quirúrgica y reproducible.',
      },
      {
        label: 'Porque Microsoft cobra una multa si desinstalás una app preinstalada.',
        isCorrect: false,
        explanation: 'Falso: no existen tales multas.',
      },
      {
        label: 'Porque los debloaters aumentan la resolución del monitor sin permiso.',
        isCorrect: false,
        explanation: 'Falso: no tocan la resolución de pantalla.',
      },
    ],
  },
  m17: {
    question: '¿Cuál es el orden estricto de saneamiento de archivos del sistema y por qué?',
    options: [
      {
        label: 'Primero DISM /Online /Cleanup-Image /RestoreHealth y luego sfc /scannow, porque DISM repara la biblioteca local con la que luego SFC repara el disco.',
        isCorrect: true,
        explanation: '¡Perfecto! Si ejecutás SFC con la biblioteca de componentes local dañada, SFC no tendrá de dónde extraer los archivos sanos.',
      },
      {
        label: 'Primero SFC y nunca usar DISM porque DISM borra las fotos personales.',
        isCorrect: false,
        explanation: 'Falso: DISM solo repara el almacén de componentes de Windows y no toca datos personales.',
      },
      {
        label: 'Ejecutar chkdsk 10 veces seguidas antes de encender la pantalla.',
        isCorrect: false,
        explanation: 'Falso: chkdsk verifica la estructura del sistema de archivos NTFS, no la integridad de los binarios del kernel.',
      },
    ],
  },
  m18: {
    question: '¿Qué mecanismo de seguridad implementa el Secure Desktop cuando el UAC oscurece la pantalla?',
    options: [
      {
        label: 'Aísla la sesión gráfica para que aplicaciones en segundo plano no puedan inyectar clics falsos ni capturar pulsaciones de teclado.',
        isCorrect: true,
        explanation: 'Correcto: el Secure Desktop impide que un troyano en Ring 3 autorice privilegios de administrador de forma silenciosa.',
      },
      {
        label: 'Baja el brillo del monitor para ahorrar un 80% de energía.',
        isCorrect: false,
        explanation: 'Falso: el oscurecimiento es una frontera de seguridad de aislamiento de sesión de Windows.',
      },
      {
        label: 'Apaga la tarjeta gráfica por 3 segundos.',
        isCorrect: false,
        explanation: 'Falso: la GPU sigue operando normalmente.',
      },
    ],
  },
  m19: {
    question: '¿En qué consiste una reparación In-Place Upgrade de Windows y cuándo es la mejor alternativa antes de formatear?',
    options: [
      {
        label: 'En ejecutar el instalador de la misma versión de Windows desde el entorno activo para reinstalar todos los binarios conservando archivos y aplicaciones intactos.',
        isCorrect: true,
        explanation: 'Exacto: es la técnica definitiva para regenerar el sistema operativo sin perder configuraciones de usuario ni programas.',
      },
      {
        label: 'En borrar toda la partición C:\\ y perder todas las contraseñas.',
        isCorrect: false,
        explanation: 'Falso: eso es un formateo limpio tradicional.',
      },
      {
        label: 'En cambiar físicamente la placa madre de la máquina.',
        isCorrect: false,
        explanation: 'Falso: es un procedimiento puramente lógico de software.',
      },
    ],
  },
  m20: {
    question: '¿Qué mide la herramienta LatencyMon para diagnosticar problemas de sonido y micro-congelamientos en juegos?',
    options: [
      {
        label: 'El tiempo máximo de ejecución de las rutinas DPC (Deferred Procedure Calls) e ISR de los controladores en tiempo real.',
        isCorrect: true,
        explanation: 'Correcto: si un controlador de red, audio o GPU tarda más de 1.000 microsegundos en un DPC, interrumpe el flujo continuo del procesador.',
      },
      {
        label: 'La velocidad de descarga de la conexión a internet.',
        isCorrect: false,
        explanation: 'Falso: LatencyMon mide latencias internas de controladores en el kernel, no el ancho de banda del ISP.',
      },
      {
        label: 'La temperatura física de los ventiladores.',
        isCorrect: false,
        explanation: 'Falso: no es un software de monitoreo de sensores térmicos.',
      },
    ],
  },
  m21: {
    question: 'En una computadora con disco duro mecánico (HDD) que sufre de 100% de uso de disco constante, ¿cuál es el primer paso diagnóstico racional?',
    options: [
      {
        label: 'Auditar con Resource Monitor qué proceso exacto está generando cola de lectura/escritura (I/O) en disco (ej. SearchIndexer o Windows Update).',
        isCorrect: true,
        explanation: '¡Perfecto! Identificar el proceso responsable evita desactivar servicios al azar y diagnostica si el HDD tiene sectores degradados.',
      },
      {
        label: 'Instalar 3 antivirus simultáneos para que compitan entre sí.',
        isCorrect: false,
        explanation: '¡Peligro! Múltiples antivirus colapsan el sistema por bloqueo cruzado de archivos en tiempo real.',
      },
      {
        label: 'Acelerar el ventilador de la fuente de poder.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación con el cuello de botella de I/O mecánico.',
      },
    ],
  },
  m22: {
    question: 'Ante un problema de pantalla negra con cursor visible tras iniciar sesión, ¿qué combinación de teclas reinicia el subsistema de video?',
    options: [
      {
        label: 'Win + Ctrl + Shift + B',
        isCorrect: true,
        explanation: 'Correcto: esta combinación envía una señal de recuperación al subsistema DWM y al controlador gráfico sin forzar el apagado de la máquina.',
      },
      {
        label: 'Alt + F4 + Barra espaciadora',
        isCorrect: false,
        explanation: 'Falso: no reinicia el subsistema de video.',
      },
      {
        label: 'Ctrl + Alt + Supr 15 veces seguidas',
        isCorrect: false,
        explanation: 'Falso: no es el atajo de recuperación de DWM.',
      },
    ],
  },
  m23: {
    question: 'En un expediente forense de taller, ¿cuál es la estructura metódica para resolver un caso reproducible?',
    options: [
      {
        label: 'Síntoma documentado → Telemetría objetiva → Hipótesis inicial → Prueba aislada → Causa raíz demostrada → Resolución reversible.',
        isCorrect: true,
        explanation: 'Excelente: este es el estándar pericial de la Academia EVO LABS.',
      },
      {
        label: 'Reiniciar la máquina y si sigue fallando, decir que no tiene arreglo.',
        isCorrect: false,
        explanation: 'Falso: el peritaje técnico exige rigor y determinación de causa raíz.',
      },
      {
        label: 'Instalar programas aleatorios hasta que alguno funcione.',
        isCorrect: false,
        explanation: 'Falso: la prueba a ciegas contamina la evidencia y empeora las fallas.',
      },
    ],
  },
  m24: {
    question: '¿Qué información crítica brinda el comando perfmon /rel (Monitor de Confiabilidad)?',
    options: [
      {
        label: 'Una línea de tiempo gráfica histórica con el registro diario de fallas de aplicaciones, cuelgues de drivers y actualizaciones instaladas.',
        isCorrect: true,
        explanation: '¡Exacto! El Monitor de Confiabilidad es una de las herramientas nativas más potentes para correlacionar problemas con cambios recientes.',
      },
      {
        label: 'El precio actual de las tarjetas gráficas en el mercado.',
        isCorrect: false,
        explanation: 'Falso: es un monitor interno del sistema operativo.',
      },
      {
        label: 'La velocidad de rotación del disco óptico de DVD.',
        isCorrect: false,
        explanation: 'Falso: perfmon /rel audita eventos de estabilidad del sistema.',
      },
    ],
  },
  m25: {
    question: '¿Qué es el Working Set de un proceso en el Administrador de Memoria de Windows?',
    options: [
      {
        label: 'El conjunto de páginas de memoria RAM física asignadas actualmente al espacio de direcciones de ese proceso para su ejecución activa.',
        isCorrect: true,
        explanation: 'Correcto: el Working Set privado representa la memoria física real que el proceso está utilizando en ese milisegundo.',
      },
      {
        label: 'La cantidad de archivos guardados en el escritorio del usuario.',
        isCorrect: false,
        explanation: 'Falso: el working set es un concepto de gestión de memoria virtual del kernel.',
      },
      {
        label: 'El tamaño del teclado y mouse conectados a la placa.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación con dimensiones de periféricos.',
      },
    ],
  },
  m26: {
    question: '¿Cuál es la máxima conclusión técnica de La Biblia Negra de Windows (Tomo 02)?',
    options: [
      {
        label: 'El mejor optimizador de Windows es un especialista con criterio que comprende la arquitectura del kernel y mide con telemetría antes de tocar.',
        isCorrect: true,
        explanation: '¡Felicitaciones! Has completado la filosofía pericial de la Academia EVO LABS.',
      },
      {
        label: 'Que Windows solo funciona bien si se desinstalan todos los programas.',
        isCorrect: false,
        explanation: 'Falso: el sistema operativo está diseñado para ejecutar cargas de trabajo complejas con estabilidad cuando se gestiona con criterio.',
      },
      {
        label: 'Que los cables de red deben cambiarse todos los días.',
        isCorrect: false,
        explanation: 'Falso: no tiene fundamento técnico.',
      },
    ],
  },
};

const CHAPTERS_01_TO_09_DATA: Record<string, ChapterRichContent> = {
  m01: {
    hookQuestion: 'Apretás el botón de encendido y en 8 segundos aparece tu escritorio. ¿Qué pasó exactamente en esos 8 segundos entre el chispazo de energía en la placa y el primer píxel visible de Windows?',
    simpleAnalogy: 'Pensá en una estación de ferrocarril de alta velocidad: primero se encienden las luces del andén (POST / UEFI), el despachante lee el itinerario oficial en el plano maestro (BCD en la partición ESP), arranca la locomotora principal (winload.efi y ntoskrnl) y finalmente se abren las puertas al público (explorer.exe).',
    evoExplains: 'El paso de BIOS Legacy (16 bits de 1981 con límite de 4 particiones MBR) a UEFI nativo (firmware de 64 bits con tablas de partición GPT y verificación Secure Boot de claves RSA) transformó el booteo de una ruleta rusa a una cadena criptográfica verificable.',
    mythVsReality: {
      myth: 'Si Windows no arranca y da pantalla azul al encender, el disco duro está roto físicamente y hay que formatear todo.',
      reality: 'El 80% de las fallas de arranque son puramente lógicas: un puntero desalineado en el almacén BCD o una partición ESP desconfigurada, reparables en 2 minutos con comandos nativos.',
    },
    technicalDeepDive: {
      title: 'Cadena Ininterrumpida de Control del Kernel NT',
      items: [
        '1. POST & UEFI: El procesador salta al vector de reset, el firmware inicializa buses PCIe/NVMe y busca la partición ESP (100MB FAT32, GUID c12a7328-f81f-11d2-ba4b-00a0c93ec93b).',
        '2. Boot Manager (bootmgfw.efi): Valida firmas digitales de Secure Boot y lee el archivo binario BCD (\\EFI\\Microsoft\\Boot\\BCD).',
        '3. OS Loader (winload.efi): Carga ntoskrnl.exe (el núcleo del kernel), hal.dll (Hardware Abstraction Layer) y los controladores con flag BOOT_START en memoria física.',
        '4. Inicialización del Kernel: ntoskrnl activa la paginación de memoria virtual, monta el registro SYSTEM e invoca a smss.exe (Session Manager).',
        '5. Subsistemas de Usuario: smss.exe levanta csrss.exe (Win32), wininit.exe (que arranca services.exe y lsass.exe) y winlogon.exe, quien tras validar credenciales entrega el control a explorer.exe.',
      ],
    },
    diagramTitle: 'Esquema de Secuencia de Booteo UEFI x64',
    diagramDescription: 'Flujo direccional desde la señal de Power-Good en el socket de la CPU hasta la creación del escritorio en Session 1.',
    diagramPendingNote: 'Infografía de la Cadena de Arranque UEFI x64 — Flujo de control desde el vector de reset de la CPU hasta Session 1 Explorer con claves Secure Boot y verificación BCD',
    evoCase: {
      title: 'El Misterio del Error 0xc000000e tras Clonar a NVMe',
      victim: 'Estación de trabajo de renderizado tras upgrade de disco mecánico a SSD M.2 NVMe.',
      symptom: 'Al encender, pantalla azul de WinRE: "The boot selection failed because a required device is inaccessible. Error 0xc000000e".',
      initialHypothesis: 'El clonado dañó los archivos del sistema operativo o el SSD nuevo vino defectuoso de fábrica.',
      rootCause: 'El software de clonado copió la partición C: pero dejó el archivo BCD apuntando al GUID de disco antiguo que ya no existía en el bus PCIe.',
      resolution: 'Desde CMD en USB de rescate: diskpart para montar la partición ESP de 100MB con letra S: y ejecución de bcdboot C:\\Windows /s S: /f UEFI. Booteo restaurado en 15 segundos.',
    },
    practiceDetails: {
      objective: 'Auditar la configuración activa del Boot Configuration Data (BCD) para verificar la ruta de winload.efi y el disco de booteo.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'El identificador {current}, la propiedad device (partición de Windows) y osdevice.',
      steps: [
        '1. Abrí PowerShell o Windows Terminal con privilegios de Administrador (clic derecho -> Ejecutar como administrador).',
        '2. Escribí el comando nativo bcdedit /enum {current} y presioná Enter.',
        '3. Verificá que la línea "path" apunte a \\WINDOWS\\system32\\winload.efi y que "device" sea partition=C:.',
      ],
      interpretation: 'Si osdevice muestra "partition=C:" y path es winload.efi, la configuración lógica de arranque del kernel está perfectamente sana.',
      howToRollback: 'Comando puramente de consulta. No realiza modificaciones en el sistema.',
    },
  },
  m02: {
    hookQuestion: 'El 90% de los cuelgues y micro-cortes de una computadora nacen en sus primeros 15 minutos de vida: una ISO pirateada o drivers instalados en el orden incorrecto.',
    simpleAnalogy: 'Pensá en levantar una casa de ladrillos: si los cimientos de hormigón (Chipset) están frescos o torcidos, colocar el techo de vidrio (la tarjeta gráfica) va a hacer que toda la estructura cruja y se rompa.',
    evoExplains: 'Windows requiere una jerarquía estricta de controladores: el bus PCIe y los enlaces del chipset deben configurarse antes de que la GPU y los códecs de audio soliciten interrupciones MSI/MSI-X.',
    mythVsReality: {
      myth: 'Instalar una versión "MiniOS", "Lite" o "Ghost" de Windows hace que los juegos tengan el doble de FPS.',
      reality: 'Las versiones modificadas de internet eliminan dependencias del almacén WinSxS, deshabilitan mitigaciones de kernel y bloquean parches de seguridad mensuales, generando inestabilidad severa sin ganancia real de GPU.',
    },
    technicalDeepDive: {
      title: 'Protocolo de Despliegue Limpio y Autenticación Criptográfica',
      items: [
        '1. Verificación SHA-256: Cálculo del digest matemático de 256 bits sobre la imagen ISO oficial descargada del CDN de Microsoft.',
        '2. Particionado GPT Nativo: Creación de esquema GUID Partition Table mediante Rufus o Media Creation Tool en modo UEFI estricto (CSM deshabilitado).',
        '3. Bypass OOBE Limpio: Durante la pantalla de configuración inicial, Shift + F10 -> OOBE\\BYPASSNRO para crear cuenta local sin forzar telemetría obligatoria ni bloatware publicitario.',
        '4. Orden Inquebrantable de Controladores: 1° Chipset INF / Intel ME o AMD Chipset Drivers -> 2° Controladora de almacenamiento IRST/NVMe -> 3° Red LAN y Wi-Fi -> 4° GPU WHQL limpia -> 5° Audio y periféricos.',
      ],
    },
    diagramTitle: 'Matriz de Secuencia de Instalación de Controladores',
    diagramDescription: 'Flujo cronológico de instalación de drivers para evitar colisiones en la tabla de asignación de IRQs.',
    diagramPendingNote: 'Diagrama de Secuencia de Drivers Post-Instalación — Jerarquía de inicialización de buses PCIe, gestión de energía ACPI y asignación de interrupciones MSI-X',
    evoCase: {
      title: 'El Stuttering en Ryzen 7 por Saltarse el Driver de Chipset',
      victim: 'PC Gamer nueva con Ryzen 7 7800X3D y RTX 4080 recién ensamblada.',
      symptom: 'Micro-congelamientos de 50 milisegundos en juegos competitivos a pesar de promediar 240 FPS.',
      initialHypothesis: 'Temperatura excesiva en la GPU o memoria RAM fallada.',
      rootCause: 'El usuario instaló directamente los drivers de NVIDIA sobre el driver de chipset genérico de Windows de 2006, dejando el planificador de núcleos 3D V-Cache sin aprovisionar.',
      resolution: 'Instalación del paquete oficial AMD Chipset Drivers con el controlador 3D V-Cache Performance Optimizer y reinicio. Stuttering reducido a cero microsegundos.',
    },
    practiceDetails: {
      objective: 'Verificar la integridad matemática bit a bit de cualquier archivo o instalador mediante hash SHA-256.',
      dataType: 'MEASURED',
      whatToObserve: 'La cadena alfanumérica en mayúsculas de 64 caracteres generada por el algoritmo criptográfico.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá Get-FileHash -Algorithm SHA256 "C:\\Windows\\System32\\cmd.exe".',
        '3. Observá cómo el algoritmo genera un digest único e irrepetible para ese binario.',
      ],
      interpretation: 'Si un solo byte del archivo hubiera sido modificado por malware o una descarga trunca, el hash resultante cambiaría en un 100% de sus caracteres.',
      howToRollback: 'Comando de auditoría de solo lectura. No altera ningún archivo.',
    },
  },
  m03: {
    hookQuestion: '¿Por qué la carpeta System32 tiene ejecutables de 64 bits y SysWOW64 tiene ejecutables de 32 bits? Parece un chiste de programadores, pero salva millones de programas cada día.',
    simpleAnalogy: 'El truco del traductor invisible: cuando un programa antiguo de 32 bits pide entrar a "System32", Windows lo redirige por debajo de la mesa a "SysWOW64" para que encuentre sus librerías correspondientes sin que el programa se entere ni se rompa.',
    evoExplains: 'SysWOW64 significa "Windows 32-bit on Windows 64-bit". Por compatibilidad histórica con software de los años 90 que tenía rutas hardcodeadas en su código binario, Microsoft mantuvo el nombre System32 para los ejecutables nativos de la arquitectura del sistema operativo.',
    mythVsReality: {
      myth: 'Borrar la carpeta WinSxS libera 20GB de espacio en disco y hace que la PC vuele.',
      reality: 'WinSxS utiliza Hardlinks (enlaces duros NTFS). La carpeta no pesa lo que dice el Explorador porque apunta a los mismos clústeres físicos que System32; borrarla rompe la capacidad de recibir parches y destruye el sistema.',
    },
    technicalDeepDive: {
      title: 'Ecosistema de Carpetas Centrales y Hardlinks NTFS',
      items: [
        '1. C:\\Windows\\System32: Binarios nativos de 64 bits (kernel, ntoskrnl, drivers, DLLs de 64 bits). INTOCABLE.',
        '2. C:\\Windows\\SysWOW64: Capa de compatibilidad y DLLs compiladas en x86 (32 bits). INTOCABLE.',
        '3. C:\\Windows\\WinSxS: Almacén de componentes nativos Side-by-Side. Se purga exclusivamente con DISM /Online /Cleanup-Image /StartComponentCleanup.',
        '4. AppData Local vs Roaming vs LocalLow: Local almacena cachés de sombreadores y temporales de la máquina; Roaming guarda configuraciones que sincronizan en red corporativa.',
        '5. Carpetas Seguras de Limpieza: C:\\Windows\\Temp y %localappdata%\\Temp pueden vaciarse en un 100% sin riesgo.',
      ],
    },
    diagramTitle: 'Mapa de Redirección WoW64 y Enlaces Duros NTFS',
    diagramDescription: 'Esquema de cómo el subsistema WoW64 intercepta las llamadas de procesos x86 hacia System32.',
    diagramPendingNote: 'Infografía de Anatomía del Disco C: — Mapa térmico de carpetas intocables vs carpetas purgables del sistema operativo con arquitectura de Hardlinks',
    evoCase: {
      title: 'El Bucle de Reparación tras "Optimizar" con un Script de YouTube',
      victim: 'Laptop corporativa con Windows 11 donde el usuario intentó liberar espacio a mano.',
      symptom: 'Al reiniciar tras una actualización de seguridad, la PC entra en bucle: "No pudimos completar las actualizaciones. Deshaciendo cambios".',
      initialHypothesis: 'Falla física en las celdas del SSD NVMe.',
      rootCause: 'El usuario forzó la eliminación de carpetas dentro de WinSxS tomando posesión (takeown). Windows no encontró las versiones previas para realizar el delta de parches.',
      resolution: 'Reparación de la imagen del almacén mediante DISM /Online /Cleanup-Image /RestoreHealth utilizando una ISO oficial montada como origen de reparación.',
    },
    practiceDetails: {
      objective: 'Demostrar experimentalmente cómo System32 y WinSxS comparten el mismo enlace duro (Hardlink) en NTFS sin duplicar espacio en disco.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'La lista de múltiples rutas en disco que apuntan al mismo número de inodo/archivo físico.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: fsutil hardlink list "C:\\Windows\\System32\\notepad.exe".',
        '3. Observá cómo la consola devuelve dos o más rutas compartidas (una en System32 y otra en WinSxS).',
      ],
      interpretation: 'Esto demuestra que el archivo existe físicamente una sola vez en los clústeres del disco, confirmando que WinSxS no duplica el peso reportado por el Explorador.',
      howToRollback: 'Comando de diagnóstico inocuo.',
    },
  },
  m04: {
    hookQuestion: '¿Sabías que cuando "borrás" un archivo de 50GB en Windows, en realidad no se borra ni un solo byte físico del disco en ese milisegundo?',
    simpleAnalogy: 'El índice de una biblioteca: borrar un archivo es como arrancar la ficha del fichero central. El libro sigue en el estante físico intacto hasta que alguien coloque un libro nuevo encima.',
    evoExplains: 'NTFS utiliza la Master File Table ($MFT) donde cada archivo tiene un registro de 1024 bytes. Al borrar, simplemente se marca el bit de asignación como "0" (disponible para sobrescribir) y se registra la transacción en el Journal $LogFile.',
    mythVsReality: {
      myth: 'Hay que desfragmentar los discos SSD una vez por semana para que no pierdan velocidad.',
      reality: '¡Peligro mortal para el silicio! Los SSDs no tienen cabezales mecánicos que se muevan; desfragmentar genera millones de escrituras inútiles que desgastan las celdas NAND Flash. En SSDs solo se envía el comando TRIM.',
    },
    technicalDeepDive: {
      title: 'El Motor NTFS: MFT, Journaling y TRIM en Silicio Flash',
      items: [
        '1. Master File Table ($MFT): Base de datos que almacena atributos, permisos ACL, marcas de tiempo y punteros a clústeres (Data Runs).',
        '2. Journaling ($LogFile y $UsnJrnl): Mecanismo atómico de dos fases. Si se corta la luz mientras escribís, NTFS hace rollback de la transacción pendiente sin corromper el volumen.',
        '3. Comando TRIM (DisableDeleteNotify = 0): Informa al controlador del SSD qué clústeres ya no contienen datos válidos para que el Garbage Collection los borre en bloques completos.',
        '4. Compresión CompactOS con compact.exe: Algoritmos LZX y XPRESS16K integrados en el kernel que reducen el peso del sistema en 4GB sin penalización de CPU.',
      ],
    },
    diagramTitle: 'Estructura de Bloques NTFS vs Celdas NAND Flash',
    diagramDescription: 'Comparativa entre la gestión lógica de clústeres en la MFT y la asignación física de páginas y bloques en un SSD NVMe.',
    diagramPendingNote: 'Esquema de Transacción de Journaling NTFS vs Operación TRIM en controladora NVMe con ciclo de vida de un bloque Flash',
    evoCase: {
      title: 'El Corte de Luz que Salvó 500 Horas de Trabajo',
      victim: 'Servidor de renderizado en un taller de animación durante una tormenta eléctrica.',
      symptom: 'Corte abrupto de energía a mitad del guardado de un proyecto de 120GB.',
      initialHypothesis: 'Corrupción total del sistema de archivos y pérdida del volumen NTFS.',
      rootCause: 'El archivo en escritura quedó trunco, pero la estructura del volumen se mantuvo 100% íntegra.',
      resolution: 'Al reiniciar, el driver de NTFS leyó el archivo $LogFile en 300 milisegundos, descartó la transacción atómica incompleta y montó el disco sin necesidad de chkdsk.',
    },
    practiceDetails: {
      objective: 'Verificar el estado activo del comando TRIM en las unidades de estado sólido del equipo.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'El valor de DisableDeleteNotify para NTFS y ReFS.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: fsutil behavior query DisableDeleteNotify.',
        '3. Verificá que NTFSEnableDisableDeleteNotify devuelva 0.',
      ],
      interpretation: 'Un valor de "0" confirma que Windows está enviando las instrucciones TRIM hacia el controlador del SSD correctamente.',
      howToRollback: 'Comando de consulta segura.',
    },
  },
  m05: {
    hookQuestion: 'Hacés doble clic en un instalador, le das "Siguiente, Siguiente" y parece magia. Pero por dentro, ese instalador acaba de meter sus tentáculos en 15 lugares distintos del sistema operativo.',
    simpleAnalogy: 'Mudarse a una casa alquilada: podés dejar tus valijas en una habitación (Program Files), pero además cambiás la cerradura (permisos UAC), le dejás una llave de repuesto al portero (servicios de fondo) y ponés tu nombre en el timbre (Registro).',
    evoExplains: 'Existen 3 arquitecturas de paquetes en Windows: EXE (script opaco sin estándar fijo), MSI (base de datos relacional con rollback transaccional) y MSIX (contenedor desacoplado con virtualización de archivos y registro).',
    mythVsReality: {
      myth: 'Los programas limpiadores y desinstaladores automáticos dejan la PC como si nunca hubieras instalado nada.',
      reality: 'Muchos programas dejan deliberadamente identificadores GUID, licencias y perfiles en AppData y Registro para recordar tus preferencias; los limpiadores automáticos a menudo borran claves compartidas de otros programas sanos.',
    },
    technicalDeepDive: {
      title: 'Disección del Ciclo de Vida de una Instalación de Software',
      items: [
        '1. Copiado de Binarios: Destinos estandarizados C:\\Program Files (64-bit) y C:\\Program Files (x86) (32-bit).',
        '2. Escritura en Registro: Registro de desinstalación en HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall y asociaciones de archivos en HKCR.',
        '3. Persistencia de Servicios: Inyección de servicios automáticos en HKLM\\SYSTEM\\CurrentControlSet\\Services que arrancan en Ring 0 / Ring 3.',
        '4. Tareas Programadas: Creación de comprobadores de actualización en segundo plano en el Programador de Tareas.',
        '5. El "DLL Hell" y su Cura: Manifiestos Side-by-Side (WinSxS) que aíslan versiones específicas de dependencias compartidas.',
      ],
    },
    diagramTitle: 'Comparativa Estructural: EXE vs MSI vs MSIX',
    diagramDescription: 'Matriz de aislamiento, gestión de dependencias, permisos requeridos y capacidad de desinstalación limpia.',
    diagramPendingNote: 'Diagrama del Ciclo de Vida de una Instalación — Huella en Disco, Registro, Servicios y Tareas Programadas con mapa de aislamiento MSIX',
    evoCase: {
      title: 'La Caída del Servidor SQL por Desinstalar un Visor de Fotos',
      victim: 'Servidor de facturación de una empresa de logística.',
      symptom: 'El motor de base de datos dejó de iniciar tras desinstalar una utilidad gratuita de compresión de imágenes.',
      initialHypothesis: 'Infección por ransomware o falla de base de datos.',
      rootCause: 'El desinstalador del visor de fotos borró a ciegas la librería msvcr120.dll de System32 porque asumió que era de su propiedad exclusiva.',
      resolution: 'Reinstalación del paquete oficial Microsoft Visual C++ 2013 Redistributable (x64) y reactivación del servicio SQL.',
    },
    practiceDetails: {
      objective: 'Auditar todos los programas instalados y sus comandos exactos de desinstalación registrados en el sistema.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Nombre formal, versión y la propiedad UninstallString.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá: Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, Publisher | Where-Object {$_.DisplayName} | Sort-Object DisplayName | Select-Object -First 8.',
        '3. Observá cómo Windows mantiene el inventario central de software instalado.',
      ],
      interpretation: 'Esta consulta lee directamente la base de datos de desinstalación sin necesidad de utilidades de terceros.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m06: {
    hookQuestion: 'En tu pantalla hay 180 procesos corriendo en este milisegundo. Si matás uno por error, tu PC muere de golpe con pantalla azul. ¿Cuáles son los intocables y por qué?',
    simpleAnalogy: 'La cabina de mandos de un avión (Ring 0 / Kernel Mode) vs la cabina de pasajeros (Ring 3 / User Mode). Los pasajeros pueden pedir un café (Syscall), pero jamás pueden tocar los controles del timón ni los interruptores del motor directamente.',
    evoExplains: 'El procesador opera con anillos de protección por hardware. Si un proceso de usuario (como Google Chrome o un juego) comete un error de acceso a memoria, solo se cierra esa aplicación; el kernel sigue vivo y el sistema operativo no se cuelga.',
    mythVsReality: {
      myth: 'Cuantos menos procesos se vean en el Administrador de Tareas, más rápida es la computadora.',
      reality: 'Procesos como svchost.exe dividen los servicios en hilos aislados para que una falla en el audio no congele la tarjeta de red. Agruparlos o matarlos a ciegas destruye la tolerancia a fallos.',
    },
    technicalDeepDive: {
      title: 'Jerarquía de Procesos del Kernel y Estructuras EPROCESS',
      items: [
        '1. User Mode (Ring 3) vs Kernel Mode (Ring 0): Frontera protegida por llamadas al sistema (Syscalls) e interrupciones de software.',
        '2. PID (Process ID), PPID (Parent PID) y Handles: Punteros protegidos del kernel a archivos, mutexes, sockets y claves.',
        '3. Procesos Sagrados del Sistema (INTOCABLES):',
        '   - smss.exe: Session Manager Subsystem (primer proceso de User Mode).',
        '   - csrss.exe: Client/Server Runtime Subsystem (API Win32, consola gráfica).',
        '   - wininit.exe: Inicializador de servicios centrales.',
        '   - services.exe: Service Control Manager (gestor de servicios).',
        '   - lsass.exe: Local Security Authority (autenticación y tokens de seguridad).',
        '   - dwm.exe: Desktop Window Manager (renderizado acelerado de ventanas por GPU).',
        '4. Finalizar csrss.exe, wininit.exe o lsass.exe provoca de inmediato un BSOD CRITICAL_PROCESS_DIED para proteger la seguridad del kernel.',
      ],
    },
    diagramTitle: 'Árbol Genealógico de Procesos del Sistema NT',
    diagramDescription: 'Jerarquía de dependencias desde System (PID 4) hasta explorer.exe y aplicaciones de usuario.',
    diagramPendingNote: 'Infografía de Jerarquía de Procesos del Kernel NT — Árbol genealógico de SMSS, WININIT, CSRSS y LSASS con niveles de privilegio y Handles',
    evoCase: {
      title: 'El "Optimizador" que Forzó la Muerte de lsass.exe',
      victim: 'Computadora de oficina con Windows 10.',
      symptom: 'Cuadro de diálogo de Windows: "Su equipo se reiniciará en 1 minuto. El proceso del sistema lsass.exe terminó de forma inesperada con código de estado -1073741819".',
      initialHypothesis: 'Ataque de virus troyano remoto.',
      rootCause: 'Un usuario intentó "liberar RAM" matando el proceso lsass.exe desde una utilidad de terceros creyendo que era un espía.',
      resolution: 'Explicación técnica de que lsass.exe es el corazón de la autenticación local de Windows y no debe finalizarse nunca.',
    },
    practiceDetails: {
      objective: 'Auditar los 10 procesos con mayor cantidad de Handles abiertos en el kernel y su consumo de memoria Working Set.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'ID de proceso (PID), nombre, número de handles y consumo en Megabytes.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá: Get-Process | Sort-Object Handles -Descending | Select-Object -First 10 Id, ProcessName, Handles, @{N="RAM (MB)";E={[math]::round($_.WorkingSet64/1MB,1)}}.',
        '3. Identificá qué procesos mantienen la mayor cantidad de recursos abiertos.',
      ],
      interpretation: 'Un proceso con más de 10.000 handles que crece constantemente en el tiempo puede estar sufriendo una fuga de handles (handle leak).',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m07: {
    hookQuestion: 'Ves 12 GB de RAM "ocupados" sin jugar y entrás en pánico. Tranquilo: la memoria RAM libre no es una medalla de honor, es silicio desperdiciado por el que pagaste dinero.',
    simpleAnalogy: 'El escritorio de un especialista: si tenés una mesa gigante y ponés solo un cuaderno para que se vea "limpia", estás trabajando de forma ineficiente. Windows pone sobre la mesa los libros y herramientas que más usás; si necesitás espacio para una maqueta nueva, retira los libros en nanosegundos.',
    evoExplains: 'Windows clasifica la memoria en 3 estados principales: En Uso (Working Set activo), En Espera (Standby / Caché de archivos leídos a 40.000 MB/s) y Libre (celdas vacías). La memoria en Standby se desaloja instantáneamente si una app la necesita.',
    mythVsReality: {
      myth: 'Desactivar el archivo de paginación (Pagefile) hace que Windows sea más rápido porque lo obliga a usar solo la RAM.',
      reality: '¡Completamente falso y destructor de estabilidad! El Pagefile no es un sustituto lento de la RAM; es el respaldo matemático del Commit Limit. Desactivarlo provoca caídas repentinas por Out-Of-Memory (OOM) y bloquea la creación de volcados Minidump ante pantallas azules.',
    },
    technicalDeepDive: {
      title: 'Arquitectura de Memoria Virtual, Commit Charge y Compresión',
      items: [
        '1. Working Set vs Commit Charge: Working Set es la memoria física asignada ahora mismo; Commit Charge es la memoria virtual privada total prometida a los procesos.',
        '2. Commit Limit: Es la suma matemática de la RAM Física + Tamaño del Pagefile. Si el Commit Charge alcanza el Commit Limit, las apps fallan al solicitar malloc() y el sistema colapsa.',
        '3. Memory Compression: El proceso "System" comprime páginas frías en RAM física con algoritmos ultrarrápidos antes de gastar I/O escribiéndolas al disco.',
        '4. Hard Page Faults vs Soft Page Faults: Soft fault (la página está en el Standby de RAM) tarda 15 nanosegundos; Hard fault (debe leerse de disco) tarda microsegundos.',
      ],
    },
    diagramTitle: 'Mapa de Estados de Páginas de Memoria en Windows NT',
    diagramDescription: 'Flujo de transición de páginas: Active -> Modified -> Standby -> Free -> Zeroed y compresión en RAM.',
    diagramPendingNote: 'Diagrama del Administrador de Memoria de Windows NT — Estados de Páginas (Active, Modified, Standby, Free, Zeroed) y Flujo de Compresión en el proceso System',
    evoCase: {
      title: 'El Crash en Premiere Pro con 32GB de RAM Física',
      victim: 'Estación de edición de video con 32GB de memoria RAM DDR5.',
      symptom: 'Premiere Pro y After Effects se cerraban sin aviso a mitad de la exportación de un proyecto en 4K.',
      initialHypothesis: 'Falla en los módulos de RAM física o problema de drivers de video.',
      rootCause: 'El editor había desactivado el Pagefile siguiendo una guía de internet. Al renderizar, el Commit Charge superó los 32GB y Windows mató la aplicación por superar el Commit Limit.',
      resolution: 'Reactivación del Pagefile administrado automáticamente por el sistema. El Commit Limit subió a 48GB y los renders se completaron sin fallas.',
    },
    practiceDetails: {
      objective: 'Medir la relación real entre memoria física total, memoria física libre, memoria virtual total (Commit Limit) y virtual libre.',
      dataType: 'MEASURED',
      whatToObserve: 'Comparación en Gigabytes de RAM física vs Commit Limit respaldado por Pagefile.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá: Get-CimInstance Win32_OperatingSystem | Select-Object @{N="RAM Total (GB)";E={[math]::round($_.TotalVisibleMemorySize/1MB,2)}}, @{N="RAM Libre (GB)";E={[math]::round($_.FreePhysicalMemory/1MB,2)}}, @{N="Virtual Total (GB)";E={[math]::round($_.TotalVirtualMemorySize/1MB,2)}}, @{N="Virtual Libre (GB)";E={[math]::round($_.FreeVirtualMemory/1MB,2)}}.',
        '3. Observá cómo la memoria virtual total supera a la memoria física.',
      ],
      interpretation: 'La diferencia entre Virtual Total y RAM Total representa la cuota de seguridad que el archivo de paginación le brinda a tus aplicaciones pesadas.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m08: {
    hookQuestion: 'Tu mouse se mueve suave hasta que de golpe se traba medio segundo y el audio hace un "crk" metálico. No es tu CPU lenta: es un driver mal programado secuestrando el procesador.',
    simpleAnalogy: 'El traductor simultáneo en una cumbre diplomática: la placa de red habla en pulsos electromagnéticos y la CPU habla en código binario x86. Si el traductor (driver) se queda pensando 5 segundos, toda la conferencia se congela.',
    evoExplains: 'Las interrupciones de hardware se dividen en ISR (Interrupt Service Routine, lo urgente) y DPC (Deferred Procedure Call, la tarea diferida). Si un driver tarda más de 1 milisegundo (1000 µs) en despachar su DPC, le roba tiempo al búfer de sonido y al hilo de cuadros de video.',
    mythVsReality: {
      myth: 'Hay que instalar programas como Driver Booster para tener siempre la última versión de todos los controladores.',
      reality: '¡Veneno puro para Windows! Esos programas instalan paquetes genéricos no certificados (sin sello WHQL), empaquetan software publicitario y frecuentemente introducen drivers con fugas en el Non-Paged Pool.',
    },
    technicalDeepDive: {
      title: 'Decodificación de Hardware IDs, DriverStore y Latencias DPC',
      items: [
        '1. Hardware ID: Estructura jerárquica PCI\\VEN_10DE&DEV_2484&SUBSYS_146710DE donde VEN = Vendor (10DE = NVIDIA), DEV = Device (2484 = RTX 3070) y SUBSYS = Subsystem del ensamblador.',
        '2. DriverStore (C:\\Windows\\System32\\DriverStore\\FileRepository): Almacén seguro donde Windows guarda los paquetes de drivers firmados criptográficamente.',
        '3. Utilidad PnPUtil (pnputil.exe): Herramienta nativa para enumerar, exportar y eliminar paquetes de controladores obsoletos de forma quirúrgica.',
        '4. Auditoría con LatencyMon: Monitoreo en tiempo real de rutinas DPC/ISR para identificar el driver culpable exacto (ej. ndis.sys, nvlddmkm.sys, acpi.sys).',
      ],
    },
    diagramTitle: 'Flujo de Interrupciones de Hardware e Hilos DPC',
    diagramDescription: 'Ruta de ejecución desde la interrupción física del dispositivo PCIe hasta la atención del hilo por el scheduler del kernel.',
    diagramPendingNote: 'Gráfica de Latencia DPC en Tiempo Real — Comparación entre controlador con latencia sana (<500µs) vs controlador defectuoso (>2000µs) con corte de audio',
    evoCase: {
      title: 'Los Chasquidos de Micrófono por Ahorro de Energía Wi-Fi',
      victim: 'Streamer con micrófono USB profesional y placa Wi-Fi PCIe.',
      symptom: 'Microcortes de audio y chasquidos cada 20 segundos durante transmisiones en vivo.',
      initialHypothesis: 'Micrófono roto o puerto USB con falla de voltaje.',
      rootCause: 'LatencyMon reveló que el driver de red ndis.sys generaba picos de latencia DPC de 4.800 µs debido a la opción "Ahorro de energía agresivo" activada en las propiedades avanzadas del adaptador.',
      resolution: 'Desactivación del ahorro de energía en el Administrador de Dispositivos e instalación del driver WHQL directo del fabricante del chip Wi-Fi. Latencia reducida a 85 µs.',
    },
    practiceDetails: {
      objective: 'Enumerar los controladores de terceros instalados en el DriverStore del equipo mediante la herramienta nativa PnPUtil.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Nombre publicado (oemXX.inf), nombre de archivo original, clase de dispositivo y versión.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: pnputil /enum-drivers.',
        '3. Observá la lista de paquetes de controladores de terceros que residen en el almacén seguro.',
      ],
      interpretation: 'Permite identificar versiones obsoletas de controladores que ya no corresponden a ningún hardware físicamente conectado.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m09: {
    hookQuestion: 'Conectás tu pendrive, la PC hace el sonidito "tutúm", pero abrís "Este equipo" y no aparece por ningún lado. ¿Murió el pendrive o Windows simplemente se olvidó de ponerle un cartel?',
    simpleAnalogy: 'El casillero del gimnasio: tu bolso está guardado físicamente adentro del casillero, pero nadie le colgó el número en la puerta. El pendrive está conectado y energizado por el silicio USB, pero Windows no le asignó una "letra de unidad" para que puedas entrar.',
    evoExplains: 'La cadena de montaje de almacenamiento: Controlador USB -> usbstor.sys -> disk.sys -> volmgr.sys -> Asignación de letra en el espacio de nombres de usuario (D:, E:, F:). Si hay una colisión de firmas GUID o el volumen es RAW, el Explorador lo oculta.',
    mythVsReality: {
      myth: 'Si una cola de impresión se traba, hay que reiniciar la computadora 3 veces para que se destrabe.',
      reality: 'Reiniciar la PC no limpia la cola porque los archivos de sombreado (.SHD y .SPL) quedan guardados en el disco duro. Se resuelve en 10 segundos deteniendo el servicio Spooler, vaciando la carpeta PRINTERS y reiniciándolo.',
    },
    technicalDeepDive: {
      title: 'Diagnóstico de Periféricos: Discos, Audio y Spooler de Impresión',
      items: [
        '1. Administración de Discos (diskmgmt.msc): Asignación de letras de unidad, activación de volúmenes Offline por colisión de firmas y formateo de particiones RAW.',
        '2. Cola de Impresión (Print Spooler): Archivos .SHD (Shadow header) y .SPL (Spool data) en C:\\Windows\\System32\\spool\\PRINTERS.',
        '3. Audio Realtek High Definition vs Genérico Microsoft: Soporte de DSP de hardware, separación de canales frontales e impedancia de auriculares.',
        '4. Protocolo MTP en Smartphones: No monta un sistema de archivos por bloques; canaliza transferencias mediante comandos de objetos abstractos para evitar bloqueos del sistema operativo móvil.',
      ],
    },
    diagramTitle: 'Pila de Controladores de Almacenamiento USB y Spooler',
    diagramDescription: 'Flujo de montaje de volúmenes extraíbles y protocolo de purga de la cola de impresión.',
    diagramPendingNote: 'Infografía de Diagnóstico Periférico — Árbol de decisión ante unidades USB no reconocidas y resolución del Spooler de impresión',
    evoCase: {
      title: 'El Documento Fantasma que Bloqueó la Facturación de una Empresa',
      victim: 'Impresora láser compartida en una oficina contable.',
      symptom: 'Ninguna computadora puede imprimir; los trabajos quedan en estado "En cola / Error" permanentemente.',
      initialHypothesis: 'La placa de red de la impresora se quemó.',
      rootCause: 'Un PDF corrupto de 400 páginas generó un archivo .SPL bloqueado en la carpeta del Spooler del servidor de impresión.',
      resolution: 'Detención del servicio Spooler, eliminación de archivos en C:\\Windows\\System32\\spool\\PRINTERS y reinicio del servicio. Impresión restablecida en 30 segundos.',
    },
    practiceDetails: {
      objective: 'Ejecutar el protocolo oficial de saneamiento y reinicio seguro del servicio de impresión (Spooler).',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Detención controlada del servicio, purga de trabajos atascados y reactivación en estado "Running".',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: Stop-Service Spooler -Force ; Remove-Item "C:\\Windows\\System32\\spool\\PRINTERS\\*" -Force -ErrorAction SilentlyContinue ; Start-Service Spooler ; Get-Service Spooler.',
        '3. Verificá que el estado final sea Status: Running.',
      ],
      interpretation: 'Este comando purga los archivos temporales de impresión dañados y restablece el subsistema de impresión sin reiniciar la computadora.',
      howToRollback: 'El servicio queda activo en su configuración normal de Windows.',
    },
  },
};

export const Tomo02ModuleReader: React.FC<Tomo02ModuleReaderProps> = ({
  moduleIndex,
  onBackToIndex,
  onSelectModule,
  onMarkCompleted,
  isCompleted,
  onFinishTomo,
}) => {
  const currentMod = TOMO_02_MODULES[moduleIndex] || TOMO_02_MODULES[0];
  const totalModules = TOMO_02_MODULES.length;
  const isFirst = moduleIndex === 0;
  const isLast = moduleIndex === totalModules - 1;

  const nextMod = !isLast ? TOMO_02_MODULES[moduleIndex + 1] : null;
  const richData = CHAPTERS_01_TO_09_DATA[currentMod.id];

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);

  const checkQ = MODULE_QUESTIONS[currentMod.id] || {
    question: `Respecto a "${currentMod.title}": ¿Cuál es la directiva fundamental del método EVO para este componente?`,
    options: [
      {
        label: `Medir la línea base con herramientas nativas y aplicar solo cambios con reversibilidad documentada.`,
        isCorrect: true,
        explanation: `Correcto: en ${currentMod.title}, todo ajuste debe verificarse con telemetría objetiva sin recurrir a recetas ciegas.`,
      },
      {
        label: 'Desactivar todo lo que no se use para tener la mayor cantidad de memoria libre.',
        isCorrect: false,
        explanation: 'Falso: desactivar servicios o funciones a ciegas degrada la estabilidad y rompe dependencias críticas.',
      },
      {
        label: 'Borrar los archivos temporales cada 5 minutos mediante un script en bucle.',
        isCorrect: false,
        explanation: 'Falso: los archivos temporales en uso bloquean procesos y borrarlos en bucle desgasta el controlador del SSD.',
      },
    ],
  };

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedSnippet(code);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
    setHasCheckedAnswer(true);
    if (checkQ.options[idx].isCorrect && !isCompleted) {
      onMarkCompleted(currentMod.id);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinishTomo();
    } else {
      setSelectedOption(null);
      setHasCheckedAnswer(false);
      onSelectModule(moduleIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setSelectedOption(null);
      setHasCheckedAnswer(false);
      onSelectModule(moduleIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full min-h-screen py-6 sm:py-8 lg:py-12 max-w-4xl mx-auto px-4 sm:px-6 font-sans-editorial">
      {/* Top Sticky Navigation Bar */}
      <nav className="sticky top-14 z-30 bg-[#06080E]/95 backdrop-blur-md border border-cyan-950/80 rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 flex items-center justify-between gap-4 font-mono-tech text-xs shadow-xl">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">← ÍNDICE DEL TOMO 02</span>
          <span className="sm:hidden">← ÍNDICE</span>
        </button>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px] truncate">
          <span className="text-cyan-400 font-bold">MÓDULO {currentMod.moduleNumber}</span>
          <span className="text-zinc-600">/</span>
          <span className="truncate hidden md:inline text-white">{currentMod.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold">
              <Check className="w-3 h-3" />
              <span>TERMINADO</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onMarkCompleted(currentMod.id)}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
            >
              MARCAR TERMINADO
            </button>
          )}
        </div>
      </nav>

      {/* Main Module Content Card with 9-Part Pedagogical Chain */}
      <div className="bg-[#090D15] border border-cyan-950 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        
        {/* ========================================================
            1. SITUATIONAL ORIENTATION (ESTÁS ACÁ)
        ======================================================== */}
        <section className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between border-b border-cyan-950/80 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>ESTÁS ACÁ // MÓDULO {currentMod.moduleNumber} DE {totalModules - 1}</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">{currentMod.categoryTag}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans-editorial">
            <div>
              <span className="font-mono-tech font-bold text-cyan-300 uppercase block text-[10px]">
                ▸ QUÉ VAS A APRENDER:
              </span>
              <p className="text-zinc-300 leading-snug">{currentMod.title}: {currentMod.subtitle}</p>
            </div>
            <div>
              <span className="font-mono-tech font-bold text-cyan-300 uppercase block text-[10px]">
                ▸ POR QUÉ IMPORTA:
              </span>
              <p className="text-zinc-300 leading-snug">
                {currentMod.scientificFact || 'Evita fallas críticas de kernel y permite diagnosticar con evidencia métrica.'}
              </p>
            </div>
            <div>
              <span className="font-mono-tech font-bold text-amber-300 uppercase block text-[10px]">
                ▸ QUÉ HACÉS AHORA:
              </span>
              <p className="text-zinc-300 leading-snug">
                Leé la explicación sin tecnicismos, analizá el detalle del kernel y realizá la práctica de auditoría en tu terminal.
              </p>
            </div>
            <div>
              <span className="font-mono-tech font-bold text-emerald-300 uppercase block text-[10px]">
                ▸ QUÉ VIENE DESPUÉS:
              </span>
              <p className="text-zinc-300 leading-snug">
                {nextMod ? `Módulo ${nextMod.moduleNumber}: ${nextMod.title}` : 'Evaluación Pericial Final del Tomo 02 y Certificación.'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. GANCHO EDITORIAL
        ======================================================== */}
        <section className="space-y-3 border-b border-cyan-950/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-bold text-[10px] uppercase">
              GANCHO // {currentMod.categoryTag}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold ${
                (currentMod.safetyBadge || 'VERDE') === 'VERDE'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : currentMod.safetyBadge === 'AMARILLO'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              SEGURIDAD: {currentMod.safetyBadge || 'VERDE'}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase leading-[0.95]">
            <span className="text-cyan-400 block text-lg sm:text-xl font-mono-tech mb-1">
              MÓDULO {currentMod.moduleNumber}
            </span>
            {currentMod.title}
          </h1>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-black to-zinc-950 border border-cyan-900/60 space-y-1">
            <span className="font-mono-tech text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              PREGUNTA DISPARADORA // EL DILEMA DEL TALLER:
            </span>
            <p className="font-sans-editorial text-base sm:text-lg text-cyan-100 font-medium italic leading-relaxed">
              “{richData?.hookQuestion || currentMod.subtitle}”
            </p>
          </div>
        </section>

        {/* ========================================================
            3. EXPLICACIÓN SIMPLE & ANALOGÍA COTIDIANA
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>EXPLICACIÓN SIMPLE // ANALOGÍA DIDÁCTICA</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-cyan-950 space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans-editorial">
            <p className="text-cyan-200/90 font-medium">
              {richData?.simpleAnalogy || currentMod.summary}
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {currentMod.summary}
            </p>
          </div>
        </section>

        {/* ========================================================
            4. EVO EXPLICA & MITO VS REALIDAD
        ======================================================== */}
        {richData && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-black/60 border border-cyan-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>EVO EXPLICA // ¿POR QUÉ PASA?</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                {richData.evoExplains}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-amber-900/50 space-y-2 font-sans-editorial">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 font-bold uppercase">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>MITO VS REALIDAD</span>
              </div>
              <div className="text-xs space-y-1.5">
                <div className="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300">
                  <strong className="block font-mono-tech text-[10px] text-rose-400 uppercase font-bold">MITO POPULAR:</strong>
                  {richData.mythVsReality.myth}
                </div>
                <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                  <strong className="block font-mono-tech text-[10px] text-emerald-400 uppercase font-bold">REALIDAD TÉCNICA:</strong>
                  {richData.mythVsReality.reality}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            5. DETALLE TÉCNICO & ARQUITECTURA DEL KERNEL
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>DETALLE TÉCNICO // ARQUITECTURA DE KERNEL & ESTRUCTURAS</span>
          </div>

          <div className="p-5 rounded-2xl bg-black/70 border border-cyan-900/80 font-mono-tech space-y-3">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
              {richData?.technicalDeepDive.title || 'CRITERIO TÉCNICO Y ESPECIFICACIÓN DEL SUBSISTEMA'}
            </span>

            <div className="space-y-2 text-xs">
              {richData ? (
                richData.technicalDeepDive.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950 text-zinc-300 leading-relaxed font-sans-editorial text-xs">
                    <span className="text-cyan-400 font-mono-tech font-bold mr-1.5">▸</span>
                    {item}
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-zinc-950 text-zinc-300 font-sans-editorial text-xs">
                  {currentMod.scientificFact || currentMod.summary}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            6. IMAGEN / DIAGRAMA ESQUEMÁTICO
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>IMAGEN / DIAGRAMA ESQUEMÁTICO</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#04060A] border-2 border-dashed border-cyan-900/80 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-tech text-[10px] uppercase font-bold">
              <span>{richData?.diagramTitle || 'DIAGRAMA ESTRUCTURAL DEL KERNEL'}</span>
            </div>
            
            <div className="font-mono-tech text-xs text-cyan-400 max-w-xl mx-auto py-2 leading-relaxed">
              [ IMAGEN EVO PENDIENTE: {richData?.diagramPendingNote || `Infografía técnica de alta precisión para ${currentMod.title} — Estructuras en memoria, llamadas Syscall y jerarquía de componentes`} ]
            </div>

            <p className="text-[11px] text-zinc-500 font-sans-editorial max-w-lg mx-auto">
              {richData?.diagramDescription || 'Visualización esquemática de la interacción entre hardware, capas Ring 0 / Ring 3 y flujo de datos del subsistema.'}
            </p>
          </div>
        </section>

        {/* ========================================================
            7. CASO REAL / CASO EVO DE TALLER
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>CASO REAL // EXPEDIENTE PERICIAL DE TALLER</span>
          </div>

          {richData ? (
            <div className="p-5 rounded-2xl bg-zinc-950/90 border border-cyan-950 space-y-3 font-sans-editorial text-xs sm:text-sm">
              <div className="border-b border-cyan-950/80 pb-2">
                <span className="font-mono-tech text-[10px] text-cyan-400 font-bold uppercase block">EXPEDIENTE FORENSE:</span>
                <h4 className="font-display font-bold text-white text-base">{richData.evoCase.title}</h4>
                <p className="text-zinc-400 text-xs mt-0.5">Equipo: {richData.evoCase.victim}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950/80">
                  <strong className="text-rose-400 font-mono-tech block text-[10px] uppercase mb-1">SÍNTOMA REPORTADO:</strong>
                  <span className="text-zinc-300">{richData.evoCase.symptom}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950/80">
                  <strong className="text-amber-400 font-mono-tech block text-[10px] uppercase mb-1">HIPÓTESIS DESCARTADA:</strong>
                  <span className="text-zinc-300">{richData.evoCase.initialHypothesis}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950/80 sm:col-span-2">
                  <strong className="text-cyan-400 font-mono-tech block text-[10px] uppercase mb-1">CAUSA RAÍZ DEMOSTRADA:</strong>
                  <span className="text-zinc-300">{richData.evoCase.rootCause}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 sm:col-span-2 text-emerald-200">
                  <strong className="text-emerald-400 font-mono-tech block text-[10px] uppercase mb-1">RESOLUCIÓN METÓDICA:</strong>
                  <span>{richData.evoCase.resolution}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-950 space-y-2 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
              <p>
                <strong className="text-white font-semibold">Situación pericial típica: </strong>
                {currentMod.forensicGoal || `Un usuario reporta comportamiento anómalo relacionado con ${currentMod.title}. Sin recurrir a conjeturas, el técnico ejecuta la comprobación de línea base para aislar la variable causante.`}
              </p>
            </div>
          )}
        </section>

        {/* ========================================================
            8. PRÁCTICA EVO // OBJETIVO, PASOS, COMANDO Y REVERSIBILIDAD
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-cyan-400 px-1">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>PRÁCTICA EVO // AUDITORÍA TÉCNICA PASO A PASO</span>
            </span>

            {richData && (
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                TIPO DE DATO: {richData.practiceDetails.dataType}
              </span>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-cyan-900/80 space-y-4 font-sans-editorial text-xs">
            {richData && (
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <strong className="font-mono-tech text-cyan-400 text-[11px] uppercase shrink-0">OBJETIVO:</strong>
                  <span className="text-zinc-200">{richData.practiceDetails.objective}</span>
                </div>
                <div className="flex items-start gap-2">
                  <strong className="font-mono-tech text-cyan-400 text-[11px] uppercase shrink-0">QUÉ OBSERVAR:</strong>
                  <span className="text-zinc-200">{richData.practiceDetails.whatToObserve}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 space-y-1">
                  <strong className="font-mono-tech text-amber-400 text-[10px] uppercase block">PASOS A EJECUTAR:</strong>
                  {richData.practiceDetails.steps.map((st, i) => (
                    <div key={i} className="text-zinc-300 text-[11px]">{st}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Terminal Command Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span>COMANDO DE EJECUCIÓN (POWERSHELL / CMD):</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      currentMod.powershellCommand ||
                        currentMod.forensicCommand ||
                        currentMod.practicalCommand ||
                        ''
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  {copiedSnippet ===
                  (currentMod.powershellCommand ||
                    currentMod.forensicCommand ||
                    currentMod.practicalCommand ||
                    '') ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPIAR COMANDO</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/90 font-mono-tech text-xs sm:text-sm text-cyan-300 border border-cyan-900/80 overflow-x-auto select-all">
                <code>
                  {currentMod.powershellCommand ||
                    currentMod.forensicCommand ||
                    currentMod.practicalCommand ||
                    '# Auditoría nativa de Windows'}
                </code>
              </pre>
            </div>

            {/* Interpretation & Rollback */}
            {richData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-black/70 border border-cyan-950">
                  <strong className="font-mono-tech text-cyan-400 text-[10px] uppercase block mb-1">CÓMO INTERPRETAR EL RESULTADO:</strong>
                  <span className="text-zinc-300 text-[11px]">{richData.practiceDetails.interpretation}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/70 border border-emerald-950/60">
                  <strong className="font-mono-tech text-emerald-400 text-[10px] uppercase block mb-1">CÓMO REVERTIR SI HUBO CAMBIOS:</strong>
                  <span className="text-zinc-300 text-[11px]">{richData.practiceDetails.howToRollback}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Takeaways Summary */}
        <section className="p-5 rounded-2xl bg-black/50 border border-cyan-950 space-y-3 font-mono-tech text-xs">
          <span className="text-cyan-400 font-bold uppercase tracking-wider block">
            CONCLUSIONES CLAVE PARA EL OPERADOR:
          </span>
          <div className="space-y-2">
            {currentMod.keyTakeaways.map((kt, i) => (
              <div key={i} className="flex items-start gap-2 text-zinc-300">
                <span className="text-cyan-400 font-bold">▸</span>
                <span className="leading-relaxed font-sans-editorial text-xs sm:text-sm">
                  {kt}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            9. COMPROBALO (VALIDACIÓN INTERACTIVA DE DIAGNÓSTICO)
        ======================================================== */}
        <section className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1120] to-[#060a14] border-2 border-cyan-500/50 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>COMPROBÁ LO QUE APRENDISTE // EVALUACIÓN DE CRITERIO</span>
          </div>

          <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug">
            {checkQ.question}
          </h3>

          <div className="space-y-2.5">
            {checkQ.options.map((opt, optIdx) => {
              const isChosen = selectedOption === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer font-sans-editorial text-xs sm:text-sm leading-relaxed ${
                    isChosen
                      ? opt.isCorrect
                        ? 'bg-emerald-950/60 border-emerald-400 text-white'
                        : 'bg-rose-950/60 border-rose-400 text-white'
                      : 'bg-zinc-950/80 border-cyan-950 hover:border-cyan-500/50 text-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5 ${
                        isChosen
                          ? opt.isCorrect
                            ? 'bg-emerald-400 text-black'
                            : 'bg-rose-400 text-black'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Card */}
          {hasCheckedAnswer && selectedOption !== null && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono-tech space-y-1.5 animate-in fade-in duration-200 ${
                checkQ.options[selectedOption].isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold uppercase">
                {checkQ.options[selectedOption].isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡RESPUESTA CORRECTA!</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-rose-400" />
                    <span>RESPUESTA INCORRECTA</span>
                  </>
                )}
              </div>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {checkQ.options[selectedOption].explanation}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ========================================================
          10. NAVEGACIÓN & MARCAR TERMINADO // FOOTER BAR
      ======================================================== */}
      <footer className="mt-8 pt-6 border-t border-cyan-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono-tech text-xs">
        <div>
          {!isFirst ? (
            <button
              type="button"
              onClick={handlePrev}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← MÓDULO ANTERIOR</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onMarkCompleted(currentMod.id)}
            className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'MÓDULO TERMINADO ✓' : 'MARCAR COMO TERMINADO'}</span>
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLast ? 'FINALIZAR TOMO 02 →' : 'SIGUIENTE MÓDULO →'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </footer>
    </article>
  );
};
