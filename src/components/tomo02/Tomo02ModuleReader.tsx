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
  Eye,
} from 'lucide-react';
import { TOMO_02_MODULES, TomoModuleItem, TOMO_02_META } from '../../data/tomo02Data';
import { Tomo02ModuleVisual } from './Tomo02VisualEngine';

interface Tomo02ModuleReaderProps {
  moduleIndex: number;
  onBackToIndex: () => void;
  onOpenMagazine?: (page?: number) => void;
  onSelectModule: (index: number) => void;
  onMarkCompleted: (moduleId: string) => void;
  isCompleted: boolean;
  onFinishTomo: () => void;
}

// Module-specific interactive check questions for all modules
export interface CheckQuestion {
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ChapterRichContent {
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

export const MODULE_QUESTIONS: Record<string, CheckQuestion> = {
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
        explanation: 'Excelente: este es el estándar metodológico de la Academia EVO LABS.',
      },
      {
        label: 'Reiniciar la máquina y si sigue fallando, decir que no tiene arreglo.',
        isCorrect: false,
        explanation: 'Falso: la auditoría técnica exige rigor y determinación de causa raíz.',
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
    question: 'Al consultar la MATRIZ VISUAL DEL GLOSARIO (Módulo 25) en la categoría "MEMORIA & VIRTUALIZACIÓN", ¿cuál es la diferencia forense crucial entre "Commit Charge" y "Working Set"?',
    options: [
      {
        label: 'Commit Charge es el límite total de memoria virtual privada prometida por el SO antes de un crash OOM, mientras que Working Set representa las páginas físicas que residen efectivamente en los chips de RAM en este milisegundo.',
        isCorrect: true,
        explanation: '¡Excelente interpretación del visual! Distinguir Commit Charge de Working Set permite diagnosticar con certeza matemática si una máquina sufre falta de RAM física o agotamiento del archivo de paginación.',
      },
      {
        label: 'Commit Charge mide la temperatura de los ventiladores y Working Set la cantidad de accesos directos en el escritorio.',
        isCorrect: false,
        explanation: 'Falso: ambos son conceptos de gestión de memoria virtual del Kernel NT.',
      },
      {
        label: 'Ambos valores son idénticos y siempre tienen que medir exactamente 1024 MB en cualquier procesador.',
        isCorrect: false,
        explanation: 'Falso: Commit y Working Set son variables dinámicas e independientes de la arquitectura de memoria.',
      },
    ],
  },
  m26: {
    question: 'Al examinar el PASAPORTE DEL INVESTIGADOR (Módulo 26) y su checklist de 10 competencias verificadas, ¿cuál es la directiva metodológica definitiva sobre la optimización de Windows?',
    options: [
      {
        label: 'El mejor optimizador de Windows es un investigador con criterio que comprende la arquitectura del kernel NT, usa telemetría nativa para medir antes de tocar y evita scripts destructivos a ciegas.',
        isCorrect: true,
        explanation: '¡Correcto! Has asimilado la metodología técnica de la Academia EVO LABS: evidencia métrica antes que recetas ciegas.',
      },
      {
        label: 'Descargar paquetes de "debloaters" aleatorios de foros para borrar todos los servicios y dejar la RAM vacía.',
        isCorrect: false,
        explanation: 'Falso: los scripts ciegos rompen dependencias críticas del sistema y degradan la estabilidad.',
      },
      {
        label: 'Formatear y reinstalar Windows cada 15 días para evitar que los archivos se cansen.',
        isCorrect: false,
        explanation: 'Falso: formatear sin diagnóstico destruye la evidencia y no soluciona causas raíz.',
      },
    ],
  },
};

export const CHAPTERS_01_TO_09_DATA: Record<string, ChapterRichContent> = {
  m00: {
    hookQuestion:
      '¿Por qué el 90% de los usuarios que intentan "optimizar" Windows terminan rompiendo el sistema con herramientas automáticas o tienen pánico de tocar cualquier carpeta por miedo a "arruinar la computadora"?',
    simpleAnalogy:
      'Abrir el Administrador de Tareas o inspeccionar el Registro sin método es como meter la mano a ciegas en el capó de un auto en marcha con los ojos cerrados: o no tocás nada por miedo o tocás la correa equivocada. El Método EVO Labs te da la linterna, los guantes aislantes, el manual de despiece y la llave de seguridad para que cada intervención sea 100% controlada, medible y reversible.',
    evoExplains:
      'La filosofía operativa de EVO Labs se funda en un pacto inquebrantable contra el miedo irracional: tocar para entender, pero midiendo antes de tocar y asegurando siempre el camino de regreso. Antes de alterar un solo bit, establecemos la "Línea Base" (Baseline): cuánto tarda el arranque UEFI en milisegundos, cuál es el Commit Charge en reposo y qué latencia de interrupciones presenta el hardware. Asimismo, clasificamos el mapa del sistema en 15 carpetas maestras con un semáforo de riesgo estricto (Verde: mantenimiento libre; Amarillo: precaución metódica; Rojo: núcleo intocable). No existe la magia en informática: todo lo que ocurre en Windows obedece a leyes físicas y estructuras de kernel.',
    mythVsReality: {
      myth: 'Windows es un sistema frágil que se rompe solo con mirarlo y para que funcione rápido hay que pasarle "limpiadores" todos los días.',
      reality:
        'El Kernel NT es uno de los motores más robustos de la ingeniería moderna. Lo que degrada a Windows no es el paso del tiempo, sino la instalación indiscriminada de optimizadores basura, controladores defectuosos y servicios huérfanos que saturan la memoria y el arranque.',
    },
    technicalDeepDive: {
      title: 'LOS TRES PILARES DEL MÉTODO CIENTÍFICO EVO & LAS 15 CARPETAS MAESTRAS',
      items: [
        '1. El Pacto de Reversibilidad: Todo cambio en el sistema operativo debe tener un mecanismo de marcha atrás documentado (exportación de clave .reg, copia de seguridad BCD, punto de restauración VSS o respaldo de driver con RAPR).',
        '2. Medición de Línea Base (Baseline): Antes de tocar nada, se registran las métricas oficiales: tiempo de arranque BIOS con Get-CimInstance, latencia de interrupciones con LatencyMon (<1000 µs) y Commit Charge en el Administrador de Tareas.',
        '3. Taxonomía de las 15 Carpetas Maestras: Clasificación por código de riesgo en tres zonas críticas: Zona Roja (System32, SysWOW64, config, Installer), Zona Amarilla (WinSxS, DriverStore, Prefetch, ProgramData) y Zona Verde (Temp, %localappdata%\\Temp, SoftwareDistribution\\Download, Minidump).',
        '4. La Bitácora del Operador: Todo perito de EVO Labs mantiene su cuaderno de laboratorio registrando: Timestamp, Componente, Valor Inicial, Modificación Aplicada y Métrica Resultante.',
      ],
    },
    diagramTitle: 'EL PROTOCOLO CIENTÍFICO EVO // MANIFIESTO ANTI-MIEDO & LAS 15 CARPETAS',
    diagramDescription:
      'Diagrama del flujo metodológico de 7 pasos (Descubrir, Entender, Observar, Practicar, Diagnosticar, Comprobar, Avanzar) y mapa del semáforo de seguridad de las 15 carpetas del sistema.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #000 — El Técnico del "Formateo Preventivo Mensual"',
      victim: 'PC de Oficina Contable — Windows 10 Pro, 16GB RAM, SSD 500GB',
      symptom:
        'El soporte técnico anterior cobraba mensualmente por "formatear y limpiar" la máquina argumentando que Windows se desgasta con el uso diario.',
      initialHypothesis: 'El sistema operativo acumula desgaste físico y requiere reinstalación periódica obligatoria.',
      rootCause:
        'El especialista de EVO Labs midió el baseline: el equipo tenía 18 programas duplicados en el inicio automático y un disco mecánico secundario de respaldo con un cable SATA flojo que generaba reintentos de lectura continuos. El Windows en sí estaba 100% sano.',
      resolution:
        'Se ajustó el cable SATA, se desactivaron los 18 programas residuales del arranque con Autoruns y se documentó la línea base. El equipo mantuvo rendimiento óptimo durante 3 años continuos sin formatear. Ahorro para el cliente: cientos de dólares y cero interrupciones de trabajo.',
    },
    practiceDetails: {
      objective:
        'Medir la línea base (Baseline) oficial de tiempo de actividad y arranque del sistema operativo en PowerShell sin modificar ningún archivo.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve:
        'Fecha y hora exacta del último encendido del equipo y cálculo de tiempo de actividad ininterrumpida.',
      steps: [
        '1. Abrí PowerShell (presioná Win + X y seleccioná Terminal o PowerShell).',
        '2. Ejecutá la orden de consulta de tiempo de inicio: (Get-CimInstance Win32_OperatingSystem).LastBootUpTime.',
        '3. Compará el resultado con el "Tiempo activo" visible en el Administrador de Tareas (pestaña Rendimiento -> CPU).',
        '4. Anotá este valor como tu primer registro pericial de línea base en tu cuaderno de laboratorio.',
      ],
      interpretation:
        'Permite verificar si la máquina realmente se apaga por completo o si está utilizando Inicio Rápido (hibernación de kernel), lo cual explica por qué a veces un "apagado" no limpia problemas residuales de controladores.',
      howToRollback:
        'Comando de telemetría pura de solo lectura. No modifica ningún parámetro del sistema operativo ni requiere reversión.',
    },
  },
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
  m10: {
    hookQuestion: 'Tu navegador dice "No hay conexión a Internet" pero la lucecita del router está verde. O peor: un programa sospechoso envía datos en segundo plano y no sabés a qué servidor se conecta. ¿Cómo seguir la ruta exacta de cada paquete?',
    simpleAnalogy: 'Pensá en el correo postal: la Dirección IP es la dirección de tu casa, el Gateway es la puerta que da a la calle (tu router), el DNS es la guía telefónica que traduce nombres a números, y el Puerto es la ventanilla específica (ej. 443 para web segura o 53 para consultas DNS).',
    evoExplains: 'La pila TCP/IP de Windows gestiona el tráfico entre sockets de User Mode y controladores NDIS del kernel. Toda conexión abierta pasa por estados formales (SYN_SENT, ESTABLISHED, TIME_WAIT) y tiene un PID asignado en el sistema operativo.',
    mythVsReality: {
      myth: 'Ver decenas de conexiones con estado TIME_WAIT en netstat significa que tu computadora está infectada con un troyano espía.',
      reality: 'TIME_WAIT es un estado estándar y saludable de TCP: el sistema espera el doble del tiempo de vida máximo del segmento (2MSL) para garantizar que los paquetes rezagados no interfieran con una nueva conexión.',
    },
    technicalDeepDive: {
      title: 'Pila TCP/IP de Windows, Sockets de Red y Estados de Conexión',
      items: [
        '1. Direccionamiento IP y Rutas: IP Privada (RFC 1918, 192.168.x.x asignada por DHCP en tu red local) vs IP Pública WAN (asignada por el ISP). Tabla de enrutamiento administrada por route print.',
        '2. Resolución DNS y Archivo Hosts: El resolver de Windows consulta en orden: 1° Memoria caché DNS local (ipconfig /displaydns) -> 2° Archivo local C:\\Windows\\System32\\drivers\\etc\\hosts -> 3° Servidores DNS configurados en el adaptador por puerto UDP 53.',
        '3. Protocolos de Transporte (TCP vs UDP): TCP (orientado a conexión, con Three-Way Handshake SYN -> SYN/ACK -> ACK y retransmisión garantizada) vs UDP (sin conexión, orientado a baja latencia y streaming sin acuse de recibo).',
        '4. Estados de Sockets en el Kernel NT: LISTENING (esperando peticiones entrantes), ESTABLISHED (flujo bidireccional activo), CLOSE_WAIT y TIME_WAIT.',
        '5. Auditoría con netstat y TCPView: Correlación del número de puerto local y remoto con el Process ID (PID) exacto que mantiene el socket abierto.',
      ],
    },
    diagramTitle: 'Flujo de Paquete TCP/IP, Sockets y Resolución DNS',
    diagramDescription: 'Recorrido de un paquete desde el socket de la aplicación pasando por tcpip.sys, el resolver DNS y la salida por la Puerta de Enlace (Gateway).',
    diagramPendingNote: 'Infografía de Auditoría de Red en Windows — Diagrama de Three-Way Handshake TCP, resolución DNS (Hosts vs Resolver) y mapa de puertos con netstat y TCPView',
    evoCase: {
      title: 'El Falso "Corte de Internet" por Bloqueo de DNS en el Archivo Hosts',
      victim: 'Estación de trabajo en un estudio de diseño gráfico tras desinstalar un software de prueba.',
      symptom: 'El usuario no puede ingresar a sitios de Adobe ni Google; el diagnóstico de Windows reporta "El servidor DNS no responde", pero Spotify sigue reproduciendo música.',
      initialHypothesis: 'Falla del proveedor de internet (ISP) o placa de red Wi-Fi quemada.',
      rootCause: 'Un script de activación pirata previo inyectó 45 líneas de bloqueo apuntando a "127.0.0.1" dentro del archivo C:\\Windows\\System32\\drivers\\etc\\hosts, secuestrando la resolución de dominios específicos.',
      resolution: 'Restauración del archivo hosts a su plantilla limpia predeterminada de Microsoft y vaciado de caché con ipconfig /flushdns. Navegación web restablecida en 60 segundos.',
    },
    practiceDetails: {
      objective: 'Auditar en tiempo real todas las conexiones TCP activas en estado Established correlacionándolas con su PID y direcciones remotas.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Dirección local, puerto local, dirección remota, puerto remoto y el identificador OwningProcess (PID).',
      steps: [
        '1. Abrí PowerShell o Windows Terminal como Administrador.',
        '2. Ejecutá: Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | Select-Object -First 10.',
        '3. Para identificar el nombre del programa dueño de un PID sospechoso, ejecutá: (Get-Process -Id <PID>).ProcessName.',
      ],
      interpretation: 'Permite identificar de forma pericial qué procesos mantienen tráfico activo y a qué servidores externos se conectan.',
      howToRollback: 'Comando de auditoría de solo lectura. No modifica ningún parámetro de red.',
    },
  },
  m11: {
    hookQuestion: 'Tu PC tarda 45 segundos en responder después de poner la clave. Abrís el Administrador de Tareas y ves 4 programas en "Inicio", pero en la realidad hay más de 30 programas invisibles ejecutándose a la vez. ¿Dónde se esconden?',
    simpleAnalogy: 'La lista de compras vs las notas adhesivas en la heladera: el Administrador de Tareas te muestra solo la lista oficial, pero hay 20 notas adhesivas escondidas en los cajones (Registro, carpetas Startup y tareas) que Windows lee religiosamente cada vez que encendés la máquina.',
    evoExplains: 'Cuando iniciás sesión, Windows no lee una sola lista de programas; revisa más de 20 ubicaciones distintas en el disco y en el Registro. Programas como launchers de juegos, comprobadores de actualización y asistentes de periféricos utilizan estas llaves para arrancar de forma silenciosa.',
    mythVsReality: {
      myth: 'Deshabilitar todos los programas de inicio desde una aplicación "limpiadora" es la mejor forma de tener la PC al máximo rendimiento.',
      reality: 'Deshabilitar a ciegas puede romper sincronizaciones de nube (OneDrive/Google Drive), paneles de control de audio necesarios para el micrófono y controladores de paneles táctiles o iluminación.',
    },
    technicalDeepDive: {
      title: 'Mapeo de Persistencia de Inicio: Claves de Registro, Carpetas Shell y Autoruns',
      items: [
        '1. Claves del Registro de Usuario (HKCU) vs Máquina (HKLM): HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run (arranca para todos los usuarios) vs HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run (arranca solo en el perfil activo).',
        '2. Capa WOW64 en 64 bits: Claves espejo en HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run para aplicaciones legadas compiladas en 32 bits.',
        '3. Carpetas Especiales de Inicio del Shell: shell:startup (AppData\\Roaming\\...\\Startup) y shell:common startup (ProgramData\\...\\Startup).',
        '4. Llaves RunOnce y RunOnceEx: Entradas diseñadas para ejecutarse una única vez tras un reinicio y ser eliminadas automáticamente por el kernel (típicas de instaladores).',
        '5. Autoruns de Sysinternals (Auditoría Integral): Inspecciona Logon, Explorer Shell Extensions, Scheduled Tasks, Boot Drivers, Codecs, Winlogon Notify y AppInit DLLs con verificación de firmas digitales y hash en VirusTotal.',
      ],
    },
    diagramTitle: 'Matriz de Puntos de Persistencia de Inicio en Windows',
    diagramDescription: 'Mapa de las 7 ubicaciones clave del Registro y carpetas Shell que Windows evalúa al iniciar sesión.',
    diagramPendingNote: 'Diagrama de Arquitectura de Puntos de Persistencia — Comparación entre Task Manager Startup vs Autoruns de Sysinternals (Run, RunOnce, Shell Folders, Winlogon)',
    evoCase: {
      title: 'El Bloqueo de 90 Segundos por 4 Updaters Compitiendo en el Arranque',
      victim: 'Notebook con SSD NVMe que experimentaba retrasos severos tras ingresar el PIN.',
      symptom: 'El escritorio cargaba rápido, pero el cursor quedaba en círculo de carga y la barra de tareas no respondía durante 1 minuto y medio.',
      initialHypothesis: 'Falla física del SSD o corrupción del perfil de usuario de Windows.',
      rootCause: 'Cuatro asistentes de actualización en segundo plano (software de impresora, utilidad RGB, launcher y navegador) ejecutaban comprobaciones de red simultáneas e intentaban escribir en disco al mismo tiempo.',
      resolution: 'Desactivación de las entradas en HKLM\\...\\Run y configuración de inicio retrasado (Delayed Start) mediante Autoruns. Tiempo de respuesta post-login reducido de 90s a 2s.',
    },
    practiceDetails: {
      objective: 'Listar todas las entradas de inicio registradas en el sistema operativo mediante el proveedor WMI/CIM de Windows.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Nombre del comando, comando ejecutable completo, ubicación (Registro o Carpeta) y usuario al que afecta.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User | Format-Table -AutoSize.',
        '3. Identificá qué programas están configurados en HKLM (todos los usuarios) y cuáles en HKCU (tu usuario).',
      ],
      interpretation: 'Permite auditar qué software se ejecuta automáticamente sin necesidad de instalar herramientas de terceros.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m12: {
    hookQuestion: 'Abrís services.msc y ves más de 250 servicios con nombres raros como "RpcSs", "DcomLaunch" o "SysMain". Una guía de internet te dice que desactives 50 de ellos para "acelerar los juegos". Lo hacés y de repente te quedás sin audio y sin internet. ¿Cómo funcionan realmente?',
    simpleAnalogy: 'Los empleados de mantenimiento de un rascacielos: no están sentados en las oficinas a la vista (no tienen interfaz gráfica), pero se encargan de los ascensores, el agua y la electricidad. Si echás al técnico de los cables de red para ahorrar espacio, todo el edificio se queda a oscuras.',
    evoExplains: 'Un servicio es un programa sin interfaz gráfica que corre en segundo plano desde que la máquina enciende. Para no gastar memoria abriendo 150 ejecutables individuales, Windows los empaqueta dentro de procesos contenedores llamados svchost.exe (Service Host), agrupados por nivel de seguridad y privilegios.',
    mythVsReality: {
      myth: 'Desactivar el servicio SysMain (antiguo SuperFetch) es obligatorio para que Windows 11 no consuma el 100% de disco.',
      reality: 'SysMain solo provocaba cuellos de botella en discos duros mecánicos HDD antiguos (a 80 MB/s). En unidades SSD NVMe modernas (a 5.000 MB/s) opera en nanosegundos y optimiza la precarga predictiva de programas sin penalización.',
    },
    technicalDeepDive: {
      title: 'Service Control Manager (SCM), Arquitectura svchost y Dependencias',
      items: [
        '1. Service Control Manager (services.exe): El despachante central del kernel. Lee la base de datos de servicios en HKLM\\SYSTEM\\CurrentControlSet\\Services.',
        '2. Cuentas de Servicio y Seguridad: LocalSystem (privilegios casi ilimitados en la máquina local), NetworkService (acceso a recursos de red con identidad del equipo) y LocalService (privilegios mínimos para servicios aislados).',
        '3. Tipos de Inicio: Automático (arranca con el booteo), Automático (Inicio retrasado) (espera a que el sistema termine la carga inicial), Manual (arranca cuando una app invoca su API o mediante Trigger Start) y Deshabilitado.',
        '4. El Árbol de Dependencias: Si desactivás un servicio base como "Llamada a procedimiento remoto (RPC)", todos los servicios que dependen de él (Plug and Play, Audio, Firewall) colapsan en cadena.',
        '5. El Caso SysMain (SuperFetch): En discos mecánicos HDD generaba cuellos de botella por precargar datos a 80 MB/s; en SSDs NVMe modernos (5.000 MB/s) opera en nanosegundos y optimiza la apertura de apps sin penalización.',
      ],
    },
    diagramTitle: 'Arquitectura del Service Control Manager y Procesos svchost',
    diagramDescription: 'Esquema de cómo services.exe despacha grupos de servicios aislados bajo instancias de svchost.exe con diferentes cuentas de seguridad.',
    diagramPendingNote: 'Infografía de Arquitectura de Servicios de Windows — Service Control Manager (SCM), aislamiento svchost por grupos y árbol de dependencias críticas',
    evoCase: {
      title: 'El Colapso de Audio y Red tras Seguir una Guía de "Optimización Extrema"',
      victim: 'PC Gamer donde el usuario deshabilitó 40 servicios para ganar supuestos FPS.',
      symptom: 'El ícono de sonido muestra una cruz roja ("El servicio de audio no se está ejecutando") y los adaptadores de red no detectan cables conectados.',
      initialHypothesis: 'Falla física del chip de audio en la placa madre o ataque de malware.',
      rootCause: 'El usuario deshabilitó "Compilador de extremos de audio de Windows" (AudioEndpointBuilder) y "Detección de hardware shell" (ShellHWDetection), rompiendo la cadena de dependencias de AudioSrv.',
      resolution: 'Restauración del tipo de inicio a "Automático" para los servicios base y reinicio del equipo. Audio y red 100% operativos.',
    },
    practiceDetails: {
      objective: 'Identificar qué servicios configurados en modo Automático no están corriendo actualmente o fallaron al iniciar.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Nombre del servicio (Name), nombre visible (DisplayName), estado y StartType.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: Get-Service | Where-Object {$_.StartType -eq "Automatic" -and $_.Status -ne "Running"} | Select-Object Name, DisplayName, Status, StartType.',
        '3. Para inspeccionar las dependencias de un servicio crítico como AudioSrv, ejecutá: (Get-Service AudioSrv).DependentServices | Select-Object Name, Status.',
      ],
      interpretation: 'Permite auditar servicios que deberían estar operando pero se encuentran detenidos por fallas de configuración o dependencias rotas.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m13: {
    hookQuestion: 'Una aplicación que desinstalaste hace 6 meses sigue abriendo pestañas en tu navegador cada martes a las 14:00, o tu notebook enciende los ventiladores al 100% a las 3 de la mañana mientras duerme en la mochila. ¿Quién le dio la orden?',
    simpleAnalogy: 'El piloto automático con temporizador de un avión: no necesita que el piloto esté en la cabina ni despierto; cuando el reloj marca la hora fijada o un sensor detecta que el avión aterrizó y está conectado al generador de tierra, el sistema ejecuta la rutina de mantenimiento por sí solo.',
    evoExplains: 'El Programador de Tareas (Task Scheduler / taskschd.msc) es el subsistema de cron nativo de Windows gestionado por el servicio Schedule (svchost.exe -k netsvcs). Permite despachar ejecutables o scripts con privilegios de SYSTEM o de usuario según 3 pilares: Triggers (disparadores de tiempo o eventos del Event Log), Actions (comando ejecutable con argumentos) y Conditions/Settings (restricciones de corriente AC, red o estado Idle).',
    mythVsReality: {
      myth: 'Borrar todas las carpetas y tareas dentro del Programador de Tareas acelera el booteo de Windows y ahorra un 20% de batería.',
      reality: 'Borrar tareas del sistema (\\Microsoft\\Windows\\...) rompe el mantenimiento automático, la orden TRIM semanal indispensable para SSDs (Defrag), la sincronización horaria W32Time y la rotación de logs. El protocolo EVO exige auditar y deshabilitar tareas huérfanas de terceros, nunca destruir las tareas del núcleo de Microsoft.',
    },
    technicalDeepDive: {
      title: 'Arquitectura de Task Scheduler: Triggers, Motor XML y Registro',
      items: [
        '1. Almacenamiento Físico y Registro: Las tareas se guardan como archivos XML de definición en C:\\Windows\\System32\\Tasks y se indexan en el Registro en HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache\\Tree.',
        '2. Tipos de Desencadenadores (Triggers): Temporales (calendario diario/semanal), de Sesión (LogonTrigger al iniciar sesión), de Arranque (BootTrigger al encender el kernel) y de Evento (EventTrigger disparado por un Event ID específico en el Visor de Eventos).',
        '3. Condiciones y Políticas de Energía: Parámetros clave como DisallowStartIfOnBatteries, StopIfGoingOnBatteries, IdleSettings y WakeToRun (que permite a una tarea despertar al equipo del estado de suspensión).',
        '4. Tareas Esenciales del Sistema: \\Microsoft\\Windows\\Defrag\\ScheduledDefrag (envía el comando TRIM al controlador del SSD), \\Microsoft\\Windows\\DiskCleanup\\SilentCleanup y \\Microsoft\\Windows\\Time Synchronization\\SynchronizeTime.',
        '5. Auditoría con PowerShell: Get-ScheduledTask permite filtrar de forma quirúrgica por ruta y estado (Ready, Running, Disabled), aislando tareas de software de terceros (Google, Adobe, launchers) sin tocar las de Microsoft.',
      ],
    },
    diagramTitle: 'Flujo de Ejecución del Servicio Task Scheduler (Schedule)',
    diagramDescription: 'Ciclo de vida de una tarea: desde la captura del Trigger, evaluación de condiciones de energía/inactividad (AC/Idle) hasta la invocación de la Acción con credenciales NT AUTHORITY\\SYSTEM o de usuario.',
    diagramPendingNote: 'Infografía de Arquitectura del Programador de Tareas — Árbol de Carpetas (Microsoft vs Terceros), Ciclo de Vida de Triggers, Evaluación de Condiciones de Energía y Matriz de Acciones',
    evoCase: {
      title: 'El "Malware Fantasma" que Despertaba la Notebook a las 3:15 AM',
      victim: 'Laptop corporativa de un desarrollador que amanecía con la batería en 0% y el chasis caliente dentro del maletín.',
      symptom: 'El equipo entraba en suspensión correctamente a la noche, pero los logs mostraban reactivación del sistema a las 03:15:00 exactas todos los días.',
      initialHypothesis: 'Falla de hardware en la batería, virus con acceso remoto persistente o botón de encendido defectuoso.',
      rootCause: 'Una tarea residual de un emulador de Android desinstalado tenía configurada la opción "Reactivar el equipo para ejecutar esta tarea" (WakeToRun = True) junto a un Trigger diario a las 3:15 AM para buscar actualizaciones.',
      resolution: 'Desactivación del parámetro WakeToRun y deshabilitación pericial de la tarea huérfana mediante PowerShell. Suspensión y consumo de batería 100% restablecidos.',
    },
    practiceDetails: {
      objective: 'Auditar y listar todas las tareas programadas activas que NO pertenecen a Microsoft, identificando su nombre, ruta y estado.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Nombre de la tarea (TaskName), ruta (TaskPath), estado (State: Ready/Running) y exclusión del árbol \\Microsoft.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: Get-ScheduledTask | Where-Object {$_.State -ne "Disabled" -and $_.TaskPath -notlike "\\Microsoft*"} | Select-Object TaskName, TaskPath, State | Format-Table -AutoSize.',
        '3. Para inspeccionar qué programa exacto ejecuta una tarea sospechosa, ejecutá: (Get-ScheduledTask -TaskName "NOMBRE_DE_TAREA").Actions.Execute.',
      ],
      interpretation: 'Permite descubrir actualizadores en segundo plano redundantes, telemetría residual de programas desinstalados y scripts de inicio programados por terceros sin afectar el mantenimiento del sistema operativo.',
      howToRollback: 'Consulta de solo lectura. Si necesitás deshabilitar una tarea sospechosa sin borrarla: Disable-ScheduledTask -TaskName "NOMBRE". Para reactivarla: Enable-ScheduledTask -TaskName "NOMBRE".',
    },
  },
  m14: {
    hookQuestion: 'Abrís la consola negra de Windows y sentís que un solo comando mal escrito puede destruir tu disco entero. O copiás un comando de un foro y no sabés si es para CMD o para PowerShell. ¿Cuál es el mapa mental exacto de la terminal moderna?',
    simpleAnalogy: 'CMD es como una máquina de escribir clásica (solo escupe texto plano línea por línea); PowerShell es una cinta transportadora industrial inteligente que traslada cajas etiquetadas con código de barras (objetos tipados con propiedades de memoria y métodos invocables).',
    evoExplains: 'Windows Terminal es el emulador de terminal moderno (la ventana contenedora); dentro de él podés ejecutar pestañas de CMD (cmd.exe, intérprete de comandos heredado de MS-DOS sin tipado) o PowerShell (powershell.exe / pwsh.exe, entorno de automatización profesional sobre .NET). La gran revolución de PowerShell es el Pipeline (|): no transmite cadenas de texto desordenadas, sino objetos estructurados vivos del sistema.',
    mythVsReality: {
      myth: 'Para usar PowerShell como un profesional hay que ejecutar Set-ExecutionPolicy Unrestricted en todo el sistema.',
      reality: 'Unrestricted es un agujero de seguridad crítico que permite la ejecución involuntaria de scripts maliciosos descargados de la web. El estándar pericial seguro es RemoteSigned (permite tus scripts locales pero exige firma criptográfica para código descargado) o utilizar el flag puntual -ExecutionPolicy Bypass al invocar un script específico.',
    },
    technicalDeepDive: {
      title: 'PowerShell vs CMD: El Pipeline de Objetos .NET, Cmdlets y la Variable PATH',
      items: [
        '1. Arquitectura de Intérpretes: CMD procesa texto plano y variables %VAR% sin validación de tipos; Windows PowerShell 5.1 opera sobre .NET Framework CLR; PowerShell 7+ (pwsh) opera sobre .NET Core multiplataforma.',
        '2. El Pipeline de Objetos (|): Get-Process no devuelve texto; devuelve una colección de instancias System.Diagnostics.Process. Podés acceder a propiedades directas como $_.CPU, $_.WorkingSet64 (RAM) o invocar el método Kill() sin necesidad de herramientas de parseo como grep o awk.',
        '3. Sintaxis Estándar Verbo-Sustantivo: Consistencia lingüística en toda la plataforma (Get-Service, Stop-Process, Set-ItemProperty, New-Item, Test-Path).',
        '4. Resolución de Comandos y la Variable PATH: Cuando escribís un comando sin ruta absoluta, Windows busca en el directorio actual y luego recorre en orden cada directorio registrado en la variable de entorno $env:PATH.',
        '5. Niveles de ExecutionPolicy: Restricted (bloqueo total por defecto), RemoteSigned (estándar recomendado de taller), AllSigned y Bypass (parámetro de sesión segura).',
      ],
    },
    diagramTitle: 'Comparación de Pipeline: Flujo de Texto (CMD) vs Flujo de Objetos .NET (PowerShell)',
    diagramDescription: 'Esquema visual que contrasta cómo CMD transmite cadenas de caracteres no tipadas frente a PowerShell, que transfiere instancias de clases .NET con propiedades accesibles por nombre.',
    diagramPendingNote: 'Infografía Técnica — Comparativa CMD vs PowerShell: Arquitectura de Pipes, Tabla de Cmdlets Fundamentales (Get-Help, Get-Command, Get-Member) y Niveles de ExecutionPolicy',
    evoCase: {
      title: 'El Script de Batch que Borró la Carpeta Incorrecta por Espacios en la Ruta',
      victim: 'Servidor local de archivos en un estudio contable con un script nocturno de respaldo en Batch (.bat).',
      symptom: 'El script fallaba silenciosamente y comenzó a vaciar la raíz de la unidad en lugar de la carpeta C:\\Copias de Seguridad\\.',
      initialHypothesis: 'Infección por ransomware que borraba archivos aleatorios.',
      rootCause: 'En CMD tradicional, un espacio sin comillas dobles fragmenta el argumento en tokens separados (C:\\Copias y de), provocando que un comando del /q interpretara rutas truncadas por la naturaleza de texto plano del intérprete.',
      resolution: 'Migración del script a PowerShell utilizando cmdlets nativos con tipado estricto (Copy-Item -Path $source -Destination $target -Recurse) y manejo seguro de variables. Cero errores de sintaxis y respaldo verificado.',
    },
    practiceDetails: {
      objective: 'Inspeccionar las propiedades de un objeto vivo del sistema en memoria utilizando el pipeline y el cmdlet Get-Member.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'TypeName (System.Diagnostics.Process), lista de métodos disponibles y propiedades cuantificables (CPU, WorkingSet64, Handles).',
      steps: [
        '1. Abrí PowerShell o Windows Terminal.',
        '2. Ejecutá: Get-Process explorer | Get-Member -MemberType Property | Select-Object -First 8.',
        '3. Para consultar la memoria RAM física en Megabytes que consume el proceso explorer usando propiedades de objeto: Get-Process explorer | Select-Object ProcessName, @{N="RAM (MB)";E={[math]::round($_.WorkingSet64/1MB, 2)}}.',
      ],
      interpretation: 'Demuestra cómo PowerShell accede directamente a los atributos de bajo nivel de los procesos en el kernel sin recurrir a trucos de parseo de texto.',
      howToRollback: 'Consulta inocua de solo lectura.',
    },
  },
  m15: {
    hookQuestion: 'Dicen que tocar el Registro de Windows es como operar a corazón abierto sin anestesia: un valor mal cambiado y la PC entra en bucle infinito de reinicios. ¿Cómo funciona esta base de datos por dentro y cómo intervenirla con seguridad pericial absoluta?',
    simpleAnalogy: 'El archivo de ADN del sistema: no es un documento de texto gigante, sino un árbol jerárquico de carpetas (claves) y variables (valores). Si conocés la ruta exacta y tenés guardado el frasco con el antídoto (archivo .reg de respaldo), el riesgo es exactamente cero.',
    evoExplains: 'El Registro de Windows (regedit.exe) es una base de datos jerárquica indexada en memoria que almacena la configuración de bajo nivel del kernel, controladores, servicios y perfiles de usuario. No es un único archivo físico: es una abstracción construida a partir de múltiples archivos binarios llamados Colmenas (Hives), ubicados en C:\\Windows\\System32\\config\\ (SAM, SYSTEM, SOFTWARE) y el archivo NTUSER.DAT en la raíz de cada carpeta de usuario.',
    mythVsReality: {
      myth: 'Usar programas "Limpiadores de Registro" acelera la computadora al eliminar 1.000 claves obsoletas.',
      reality: '¡El mito más rentable y dañino de la historia de Windows! El Registro es una estructura B-Tree optimizada en RAM; 1.000 claves vacías ocupan menos de 50 KB y el kernel las ignora en nanosegundos. Los limpiadores automáticos suelen borrar entradas CLSID o COM activas, rompiendo Office, el menú contextual o componentes de arranque.',
    },
    technicalDeepDive: {
      title: 'Arquitectura de Colmenas (Hives), Tipos de Datos y Protocolo de Rollback',
      items: [
        '1. Los 5 Árboles Raíz Lógicos: HKEY_LOCAL_MACHINE (HKLM, configuración global de máquina), HKEY_CURRENT_USER (HKCU, perfil activo mapeado a NTUSER.DAT), HKEY_CLASSES_ROOT (HKCR, asociaciones de extensiones y objetos COM), HKEY_USERS (HKU, almacén de todos los SIDs de usuario) y HKEY_CURRENT_CONFIG (HKCC, hardware en ejecución).',
        '2. Mapeo Físico de Hives: Las colmenas globales residen en C:\\Windows\\System32\\config (SAM, SECURITY, SOFTWARE, SYSTEM). Las preferencias de usuario residen en C:\\Users\\<Usuario>\\NTUSER.DAT y UsrClass.dat (AppData\\Local\\Microsoft\\Windows).',
        '3. Tipos de Datos Principales: REG_SZ (cadena de texto alfanumérica), REG_DWORD (entero de 32 bits, estándar para interruptores 0 y 1), REG_QWORD (entero de 64 bits), REG_BINARY (datos binarios crudos) y REG_EXPAND_SZ (cadenas con variables de entorno expandibles como %SystemRoot%).',
        '4. Protocolo de Respaldo Quirúrgico EVO: Antes de modificar cualquier clave, hacer clic derecho -> Exportar a archivo .reg. El rollback se realiza con doble clic sobre el archivo .reg generado o mediante reg.exe import.',
        '5. Ajuste Técnico Seguro (MenuShowDelay): Modificación del valor MenuShowDelay en HKCU\\Control Panel\\Desktop de 400ms a 0ms para eliminar el retardo artificial de apertura de submenús en el Explorador.',
      ],
    },
    diagramTitle: 'Mapeo Físico de Colmenas del Registro (Hives) en el Sistema de Archivos',
    diagramDescription: 'Esquema de correlación entre las ramas lógicas (HKLM, HKCU) y sus archivos binarios reales en System32\\config y los perfiles de usuario NTUSER.DAT.',
    diagramPendingNote: 'Infografía de Arquitectura del Registro de Windows — Mapeo de Hives Físicos (SAM, SYSTEM, SOFTWARE, NTUSER.DAT), Tipos de Valores (DWORD, SZ, BINARY) y Flujo de Exportación/Rollback .reg',
    evoCase: {
      title: 'La Pantalla Azul Inaccessible Boot Device por un Limpiador de Registro Automático',
      victim: 'Estación de trabajo contable que dejó de arrancar tras ejecutar una utilidad de "limpieza profunda del registro".',
      symptom: 'Pantalla azul BSOD con código de detención INACCESSIBLE_BOOT_DEVICE en cada intento de booteo.',
      initialHypothesis: 'Falla física del disco SSD NVMe o daño en la controladora SATA de la placa madre.',
      rootCause: 'El limpiador clasificó erróneamente como "claves huérfanas" las entradas del controlador de almacenamiento en HKLM\\SYSTEM\\CurrentControlSet\\Services\\storahci, impidiendo que el kernel cargara el controlador de disco durante la fase de arranque.',
      resolution: 'Inicio en Entorno de Recuperación (WinRE), montaje offline de la colmena SYSTEM con reg load HKLM\\OFFLINE_SYSTEM y restauración de la clave storahci desde la copia de respaldo de seguridad. Sistema recuperado al 100% sin formatear.',
    },
    practiceDetails: {
      objective: 'Exportar como respaldo de seguridad la clave de configuración del escritorio del usuario antes de auditar su valor MenuShowDelay.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Creación exitosa del archivo .reg en el escritorio y lectura pericial del valor de retardo en milisegundos.',
      steps: [
        '1. Abrí PowerShell o Windows Terminal.',
        '2. Ejecutá la exportación de seguridad de la clave Desktop a tu escritorio: reg.exe export "HKCU\\Control Panel\\Desktop" "$HOME\\Desktop\\Backup_Desktop_EVO.reg" /y.',
        '3. Consultá el valor actual de MenuShowDelay: Get-ItemPropertyValue -Path "HKCU:\\Control Panel\\Desktop" -Name "MenuShowDelay".',
        '4. Verificá que el archivo Backup_Desktop_EVO.reg exista en tu escritorio.',
      ],
      interpretation: 'Este procedimiento demuestra el estándar profesional de modificación: respaldo atómico de la clave antes de cualquier lectura o edición.',
      howToRollback: 'Para revertir cualquier cambio en esta clave, hacé doble clic sobre el archivo Backup_Desktop_EVO.reg en tu escritorio o ejecutá en PowerShell: reg.exe import "$HOME\\Desktop\\Backup_Desktop_EVO.reg".',
    },
  },
  m16: {
    hookQuestion: 'Ves un video en YouTube con el título "Hacé tu Windows 11 un 500% más rápido borrando toda la telemetría con este script de GitHub". Lo ejecutás, reiniciás, y de golpe no podés abrir la Microsoft Store, no te conecta la VPN del trabajo y Windows Update tira error 0x80070422. ¿Qué recopila realmente Microsoft y cuál es la diferencia entre telemetría diagnóstica y espionaje?',
    simpleAnalogy: 'La caja negra de un avión contra una cámara en el baño: los datos de diagnóstico requeridos son la caja negra que registra a qué velocidad iba el procesador y por qué crasheó el driver de video para que los ingenieros de software puedan parcharlo. Los scripts de debloat masivos intentan desconectar todos los sensores del avión y terminan arrancando el cable del velocímetro y del radar.',
    evoExplains: 'Windows clasifica la telemetría en dos grandes niveles: Requerida (Required Diagnostic Data: hardware specs, versión de build, códigos de BSOD y compatibilidad de parches) y Opcional (Optional Diagnostic Data: sitios web visitados, uso detallado de apps, escritura manual y tinta predictiva). Además, Microsoft ofrece la herramienta oficial gratuita Diagnostic Data Viewer para inspeccionar en formato JSON cada paquete exacto enviado a Redmond.',
    mythVsReality: {
      myth: 'Los scripts de "Debloat" en PowerShell que eliminan 100 servicios y claves de telemetría aumentan los FPS en juegos y hacen que Windows sea impenetrable.',
      reality: '¡Peligro crítico! Esos scripts eliminan dependencias del almacén de componentes (WinSxS), desactivan servicios del Firewall y rompen el Servicio de Transferencia Inteligente en Segundo Plano (BITS). El resultado invariable es la imposibilidad de instalar parches acumulativos mensuales, dejando el sistema expuesto a exploits de día cero.',
    },
    technicalDeepDive: {
      title: 'Arquitectura de Datos de Diagnóstico: AllowTelemetry, Servicio DiagTrack y GPO',
      items: [
        '1. Niveles de Recopilación (AllowTelemetry): En el Registro bajo HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection, AllowTelemetry = 0 (Seguridad/Enterprise), 1 (Básico/Requerido), 2 (Mejorado - descontinuado), 3 (Completo/Opcional). En Windows Home/Pro el mínimo admitido por GUI es 1 (Requerido).',
        '2. El Servicio DiagTrack (Connected User Experiences and Telemetry): corre bajo svchost.exe -k utcsvc. Deshabilitarlo por la fuerza suele causar errores de activación, rotura de Xbox Game Bar y fallos en comprobaciones de compatibilidad de drivers en Windows Update.',
        '3. Diagnostic Data Viewer (Visor Oficial): Permite ver los eventos reales en JSON agrupados en eventos de rendimiento, diagnóstico de periféricos y fallas de software antes del cifrado TLS de envío.',
        '4. Configuración Racional de Privacidad (Cero Riesgo): Desactivar el ID de publicidad personalizada (Advertising ID), el reconocimiento de voz en línea, las sugerencias de contenido y la personalización de escritura manual desde Configuración -> Privacidad y seguridad -> General.',
        '5. Bloqueo Quirúrgico por Directiva de Grupo (GPO): En Windows Pro/Enterprise, configurar Computer Configuration -> Administrative Templates -> Windows Components -> Data Collection and Preview Builds sin alterar archivos binarios ni desinstalar componentes del sistema.',
      ],
    },
    diagramTitle: 'Flujo de Telemetría: Datos Requeridos vs Opcionales y Visor JSON',
    diagramDescription: 'Esquema comparativo entre la canalización del servicio DiagTrack (crashes de kernel, drivers) y la capa opcional de experiencia de usuario, contrastado con los puntos de quiebre provocados por scripts de debloat.',
    diagramPendingNote: 'Infografía de Privacidad Racional en Windows — Comparativa Telemetría Requerida vs Opcional, Arquitectura del Servicio DiagTrack, y Mapa de Riesgo de Scripts de Debloat',
    evoCase: {
      title: 'El Colapso de Windows Update tras un Script de "Optimización Extrema" de YouTube',
      victim: 'PC de diseño gráfico donde el usuario aplicó un script "Windows 11 Debloater Master".',
      symptom: 'Windows Update congelado con error permanente 0x80070422 ("El servicio no puede iniciarse"), Microsoft Store desaparecida y las aplicaciones de Adobe no podían validar la licencia.',
      initialHypothesis: 'Infección por troyano o falla física del disco NVMe.',
      rootCause: 'El script deshabilitó los servicios DiagTrack, WaaSMedicSvc, UsoSvc y eliminó por la fuerza paquetes Appx del sistema que actuaban como dependencias compartidas de autenticación.',
      resolution: 'Restauración de tipos de inicio de servicios a través de PowerShell, reactivación del servicio WaaSMedic y reparación in-place de la imagen de Windows. Windows Update y Store recuperados al 100%.',
    },
    practiceDetails: {
      objective: 'Consultar mediante PowerShell el nivel de telemetría configurado en el Registro de Windows de forma no destructiva.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'El valor de la propiedad AllowTelemetry (1 = Requerido/Básico, 3 = Opcional/Completo).',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá: Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection" -Name "AllowTelemetry" -ErrorAction SilentlyContinue | Select-Object AllowTelemetry.',
        '3. Para auditar el estado del servicio de telemetría sin modificarlo: Get-Service DiagTrack | Select-Object Name, DisplayName, Status, StartType.',
      ],
      interpretation: 'Permite confirmar que el sistema se encuentra en el nivel de telemetría mínimo requerido por el sistema operativo sin haber quebrado servicios esenciales de actualización.',
      howToRollback: 'Consulta inocua de solo lectura. Para configurar la telemetría a nivel mínimo seguro sin tocar el Registro, hacelo desde Configuración -> Privacidad y seguridad -> Diagnóstico y comentarios -> Seleccionar "Enviar solo datos de diagnóstico requeridos".',
    },
  },
  m17: {
    hookQuestion: 'Windows Update se queda clavado en el 23% durante 3 horas. Reiniciás forzadamente la PC, aparece "Deshaciendo cambios" y al día siguiente vuelve a intentar instalar la misma actualización fallida en un bucle infinito. ¿Dónde se trabó y cómo sanear el subsistema de parches?',
    simpleAnalogy: 'Una fábrica de ensamblado y su depósito de materias primas: Windows Update descarga las piezas empaquetadas en un galpón temporal (SoftwareDistribution). Si una caja vino con una tuerca torcida (descarga corrupta), los obreros no pueden terminar el montaje y se quedan parados. Si limpiás el depósito y traés el plano original intacto (DISM), la línea de montaje vuelve a funcionar sin demoras.',
    evoExplains: 'Las actualizaciones acumulativas de Windows (LCU - Latest Cumulative Update) no son archivos sueltos reemplazados; pasan por un ciclo estricto de Staging (puesta en escena), ensamblado en el almacén de componentes (C:\\Windows\\WinSxS) y confirmación tras el reinicio gestionado por el servicio TrustedInstaller (Windows Modules Installer). Cuando una actualización se corrompe en el tránsito, los archivos temporales atascados en SoftwareDistribution bloquean toda la cola.',
    mythVsReality: {
      myth: 'Cuando Windows tira error de archivos corruptos, lo primero que hay que hacer siempre es correr sfc /scannow 5 veces.',
      reality: '¡Error metódico grave! sfc /scannow compara los archivos activos de Windows contra la biblioteca de referencia local (WinSxS). Si la biblioteca misma está corrupta, SFC jamás podrá reparar nada y dará el error "Se encontraron archivos corruptos pero no se pudieron reparar". El orden inquebrantable de la metodología EVO es: 1° DISM (repara la biblioteca de referencia con los servidores limpios de Microsoft) -> 2° SFC (repara los binarios del disco usando la biblioteca ya sana).',
    },
    technicalDeepDive: {
      title: 'Ciclo de Actualización: SoftwareDistribution, WinSxS y Secuencia DISM/SFC',
      items: [
        '1. Anatomía de C:\\Windows\\SoftwareDistribution: Subcarpetas Download (archivos .cab y .esd temporales) y DataStore (base de datos Jet EDB que guarda el historial de transacciones). Si se corrompe la base DataStore.edb, Windows Update entra en bucle de reintento infinito.',
        '2. Latest Cumulative Update (LCU) y Service Stack Update (SSU): El SSU es el motor instalador que actualiza a TrustedInstaller; debe instalarse antes de la LCU para que los parches nuevos puedan procesarse.',
        '3. Delivery Optimization (WUDO / DoSvc): Servicio de distribución peer-to-peer en red local que comparte parches entre máquinas de la misma subred para no saturar la conexión a internet.',
        '4. Protocolo Quirúrgico de Purga de SoftwareDistribution: Detener servicios wuauserv y bits -> Renombrar o vaciar SoftwareDistribution\\Download -> Reiniciar servicios. Windows regenerará la carpeta y descargará una copia limpia del parche.',
        '5. La Cadena de Reparación DISM y SFC: DISM /Online /Cleanup-Image /ScanHealth (diagnóstico) -> DISM /Online /Cleanup-Image /RestoreHealth (reparación del Component Store con fuentes oficiales) -> sfc /scannow (reemplazo de binarios activos dañados).',
      ],
    },
    diagramTitle: 'Cadena de Actualización: SoftwareDistribution, Component Store (WinSxS) y Secuencia DISM/SFC',
    diagramDescription: 'Esquema del flujo de parches desde la descarga en SoftwareDistribution hasta el almacén WinSxS, ilustrando el orden correcto de reparación: DISM repara la fuente y SFC repara los archivos de ejecución.',
    diagramPendingNote: 'Infografía del Ciclo de Windows Update — Depósito SoftwareDistribution, Ensamblado en WinSxS por TrustedInstaller, y Protocolo Oficial de Reparación DISM -> SFC',
    evoCase: {
      title: 'El Bucle Infinito del Código de Error 0x800f0922 en una Actualización de Seguridad',
      victim: 'Estación de trabajo contable que reiniciaba dos veces cada mañana mostrando "No pudimos completar las actualizaciones. Deshaciendo cambios".',
      symptom: 'Consumo continuo de disco al 100%, cola de actualización trabada y logs de CBS indicando fallo en la fase de montaje de la LCU.',
      initialHypothesis: 'Placa madre defectuosa o virus que bloquea actualizaciones.',
      rootCause: 'La base de datos DataStore.edb en SoftwareDistribution se corrompió tras un corte de luz durante una descarga previa, generando sumas de comprobación erróneas en los paquetes temporales.',
      resolution: 'Detención de wuauserv y bits, purga limpia de SoftwareDistribution\\Download y ejecución de DISM /Online /Cleanup-Image /RestoreHealth seguido de sfc /scannow. En el siguiente escaneo, la actualización se descargó intacta y se instaló al 100% en 8 minutos.',
    },
    practiceDetails: {
      objective: 'Ejecutar la verificación de salud del Component Store de Windows mediante DISM y la verificación de integridad de archivos con SFC.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Porcentaje de avance de DISM, reporte de "No se detectaron daños en el almacén de componentes" y resultado final de SFC.',
      steps: [
        '1. Abrí PowerShell o Windows Terminal como Administrador.',
        '2. Ejecutá la comprobación de salud del almacén de componentes: DISM.exe /Online /Cleanup-Image /ScanHealth.',
        '3. Si se detectan daños, ejecutá la reparación: DISM.exe /Online /Cleanup-Image /RestoreHealth.',
        '4. Una vez completado DISM, ejecutá la verificación de archivos del sistema: sfc /scannow.',
      ],
      interpretation: 'Garantiza que la biblioteca de repuestos de Windows (WinSxS) esté 100% íntegra antes de que SFC sustituya cualquier ejecutable dañado del kernel.',
      howToRollback: 'Procedimiento de saneamiento nativo de Microsoft; no elimina datos del usuario ni configuraciones.',
    },
  },
  m18: {
    hookQuestion: 'Te descargás un archivo llamado Factura_Pendiente.pdf desde un correo. Hacés doble clic, la pantalla se oscurece por completo y aparece un cartel amarillo pidiéndote permisos de Administrador. ¿Por qué un "PDF" querría privilegios de administrador y cómo logró camuflarse a simple vista?',
    simpleAnalogy: 'La esclusa de seguridad de un banco y el carnet de acceso: aunque seas el dueño del banco (Administrador), cuando entrás a la sucursal te entregan un carnet de cliente común (Token Restringido). Solo cuando tenés que abrir la bóveda acorazada pasás a una esclusa blindada con luces especiales donde nadie de afuera puede empujarte la mano (Secure Desktop) para mostrar tu carnet de dueño.',
    evoExplains: 'User Account Control (UAC) no es un cartel molesto; es una frontera de seguridad de doble token (Split Token). Cuando iniciás sesión como administrador, Windows te asigna un token filtrado de usuario estándar. Las aplicaciones comunes corren en ese espacio restringido (Ring 3). Solo cuando un proceso requiere cambiar controladores o el Registro del sistema, el sistema congela la sesión de usuario y te traslada al Secure Desktop (un escritorio aislado inmune a inyección de código) para exigir tu autorización explícita.',
    mythVsReality: {
      myth: 'Los técnicos de verdad desactivan el UAC en "No notificarme nunca" para no perder tiempo con cartelitos.',
      reality: '¡Grave negligencia pericial! Poner el UAC en "No notificar nunca" desactiva el Secure Desktop y otorga elevación silenciosa a cualquier proceso hijo. Un simple script malicioso en un macro de Word o una página web maliciosa podrá obtener privilegios de NT AUTHORITY\\SYSTEM e instalar un driver de ring 0 sin que te des cuenta.',
    },
    technicalDeepDive: {
      title: 'Arquitectura de UAC: Split Token, Secure Desktop y Firmas Authenticode',
      items: [
        '1. La Arquitectura Split Token: Creación de dos Access Tokens durante el login mediante LSASS: el Token Elevado (con todos los privilegios administrativos) y el Token Restringido (privilegios estándar).',
        '2. Secure Desktop (ConsentUI): Se ejecuta en una estación de ventanas (Window Station) aislada llamada Winlogon\\Desktop. Los procesos en el escritorio de usuario no tienen permisos de mensajes de Windows (UIPI - User Interface Privilege Isolation) para enviar eventos WM_LBUTTONDOWN simulados por software.',
        '3. Verificación de Firmas Authenticode: Los ejecutables legítimos están firmados con certificados digitales X.509 válidos (marca azul de UAC). Los ejecutables sin firmar o con firma inválida muestran el temido cartel amarillo/rojo de UAC y SmartScreen.',
        '4. La Técnica del Archivo Trampa (Doble Extensión): Cómo los atacantes aprovechan que Windows oculta por defecto las extensiones conocidas para nombrar un archivo Presupuesto.pdf.exe (mostrándolo como Presupuesto.pdf) e inyectar un icono de Adobe Reader.',
        '5. Defender y SmartScreen: Verificación en tiempo de ejecución de reputación basada en la nube y aislamiento perimetral.',
      ],
    },
    diagramTitle: 'Arquitectura UAC: Split Token, Aislamiento Secure Desktop y Firmas Authenticode',
    diagramDescription: 'Diagrama de flujo que ilustra la bifurcación de tokens al iniciar sesión, la barrera infranqueable del Secure Desktop ante troyanos y la anatomía de un archivo trampa con doble extensión.',
    diagramPendingNote: 'Infografía de Ciberseguridad Defensiva — Arquitectura de Tokens UAC (Restringido vs Elevado), Aislamiento de Sesión Secure Desktop, y Anatomía de un Archivo Trampa (.pdf.exe)',
    evoCase: {
      title: 'El Ransomware Detenido por la Ventana de Consentimiento del Secure Desktop',
      victim: 'Estación de trabajo en un departamento de recursos humanos que recibió un supuesto currículum vitae comprimido en ZIP.',
      symptom: 'Al descomprimir y hacer doble clic sobre "CV_Candidato_2026.docx", la pantalla se oscureció repentinamente solicitando elevación para un ejecutable desconocido de nombre aleatorio.',
      initialHypothesis: 'Falla de Word o problema con el visor de documentos.',
      rootCause: 'El archivo era en realidad un ejecutable compilado con icono de Microsoft Word (CV_Candidato_2026.docx.exe). El malware requería privilegios administrativos para detener el servicio VSS (Volume Shadow Copy) y encriptar los archivos del sistema.',
      resolution: 'El usuario denegó el UAC (hizo clic en NO). El malware no pudo elevar sus privilegios, no pudo tocar el kernel ni los respaldos de sombra, y Windows Defender neutralizó el ejecutable en su espacio temporal restringido. Pérdida de datos: Cero.',
    },
    practiceDetails: {
      objective: 'Auditar la firma digital Authenticode de un binario del sistema y habilitar la visualización obligatoria de extensiones de archivo en el Explorador.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Estado de la firma (Status: Valid), emisor del certificado (Microsoft Windows Production PCA) y desenmascaramiento de extensiones en el Explorador.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Verificá la firma criptográfica del binario oficial de PowerShell: Get-AuthenticodeSignature -FilePath "$PSHOME\\powershell.exe" | Select-Object Status, StatusMessage, Path.',
        '3. Para asegurarte de que Windows nunca oculte extensiones engañosas como .exe en el Explorador de Archivos, ejecutá: Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "HideFileExt" -Value 0.',
      ],
      interpretation: 'El comando garantiza que la firma digital del binario sea matemáticamente válida y desactiva la opción peligrosa que oculta extensiones en Windows, desenmascarando instantáneamente archivos maliciosos tipo archivo.pdf.exe.',
      howToRollback: 'Para volver a ocultar las extensiones conocidas (no recomendado en laboratorios periciales): Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "HideFileExt" -Value 1.',
    },
  },
  m19: {
    hookQuestion: '¿Por qué formatear y borrar gigabytes de programas y configuraciones cuando el 90% de los arranques colapsados se deben a 16 KB corruptos en el archivo BCD o un único driver mal instalado?',
    simpleAnalogy: 'Formatear una computadora entera porque no arranca es como demoler una casa de dos pisos porque se trabó la cerradura de la puerta principal. WinRE, BCDboot y la reparación in-place son el juego de ganzúas maestras para cambiar la cerradura dejando todos tus muebles y pertenencias exactamente donde estaban.',
    evoExplains: 'Cuando Windows falla en cargar el escritorio, los técnicos aficionados formatean de inmediato por pereza diagnóstica. Sin embargo, Windows incorpora WinRE (Windows Recovery Environment), un subsistema WinPE independiente en una partición oculta que permite acceder al Registro fuera de línea (offline hive loading), revertir actualizaciones acumulativas pendientes con DISM y reconstruir la partición de arranque ESP con bcdboot. Si el sistema arranca pero está inestable, la instalación In-Place (Upgrade sobre sí mismo) reemplaza el 100% de los archivos del kernel (C:\\Windows\\System32, WinSxS) respetando absolutamente todos tus programas instalados, perfiles de usuario y licencias.',
    mythVsReality: {
      myth: 'Si Windows entra en el bucle "Preparando reparación automática" y da pantalla azul, la única salida es formatear desde cero.',
      reality: 'El 85% de los bucles se deben a una partición ESP desincronizada, un driver incompatible en System32\\drivers o transacciones pendientes en pending.xml. Se resuelven con bcdboot o dism /revertpendingactions sin tocar un solo archivo personal.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE RECUPERACIÓN: BCD, WINRE Y SERVICING IN-PLACE',
      items: [
        'WinRE y WinPE: Entorno de recuperación basado en un archivo WIM (winre.wim) de ~500 MB almacenado en la partición oculta de recuperación tipo 0x27 o GUID de94bba4-06d1-4d40-a16a-bfd50179d6ac. Se carga enteramente en un disco RAM (X:\\).',
        'El Almacén BCD (Boot Configuration Data): Archivo de colmena binaria en la partición ESP FAT32 (\\EFI\\Microsoft\\Boot\\BCD). Contiene los identificadores GUID {bootmgr} y {default}, apuntando a la ruta \\Windows\\system32\\winload.efi y al volumen GUID del sistema.',
        'Bisturí de DISM Offline: Cuando una actualización de Windows se interrumpe y causa BSOD en arranque, el comando dism /image:C:\\ /cleanup-image /revertpendingactions lee el archivo C:\\Windows\\WinSxS\\pending.xml y cancela las transacciones a nivel de sector antes del siguiente boot.',
        'Reparación In-Place (Repair Install): Montar la imagen ISO oficial correspondiente a la build instalada y ejecutar setup.exe desde dentro del sistema. Sustituye todos los binarios corruptos del sistema operativo mientras migra las claves de HKLM\\SOFTWARE, HKCU y los perfiles de C:\\Users mediante el motor de migración de Windows Setup.',
      ],
    },
    diagramTitle: 'PIPELINE FORENSE DE RECUPERACIÓN: DE BCD CORRUPTO A INSTALACIÓN IN-PLACE',
    diagramDescription: 'Esquema interactivo de la jerarquía de particiones GPT (ESP FAT32 vs C: NTFS), reconstrucción del puntero winload.efi mediante bcdboot y la matriz de decisión ante fallas de arranque.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #019 — Bucle Infinito de Reparación Automática tras Corte Eléctrico',
      victim: 'Estación de diseño CAD — Intel Core i7 13700K, 64GB DDR5, SSD NVMe Samsung 990 Pro 2TB',
      symptom: 'La máquina no supera la pantalla de carga de Windows: muestra "Preparando reparación automática" seguido de "Diagnóstico de su PC" y pantalla azul con error 0xc000000e: A required device isn\'t connected or can\'t be accessed.',
      initialHypothesis: 'SSD dañado por sobretensión; formateo completo e instalación de Windows desde cero con pérdida de entornos CAD.',
      rootCause: 'El corte de energía ocurrió mientras Windows escribía metadatos en la partición ESP (EFI System Partition). La colmena BCD (\\EFI\\Microsoft\\Boot\\BCD) quedó con tamaño 0 bytes (corrupción lógica). El SSD y los datos de C: estaban 100% íntegros y sanos.',
      resolution: 'Desde la consola de WinRE se ejecutó diskpart, se localizó la partición ESP de 100 MB, se le asignó la letra S: y se corrió: bcdboot C:\\Windows /s S: /f UEFI /l es-es. El comando regeneró los archivos de arranque limpios en 2.3 segundos. La PC arrancó al escritorio de inmediato con todos los proyectos intactos. Tiempo total: 6 minutos.',
    },
    practiceDetails: {
      objective: 'Revisar la configuración del almacén BCD y verificar la integridad de la partición de recuperación WinRE.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Identificadores {bootmgr} y {current}, partición de arranque, puntero a winload.efi y estado activo de WinRE.',
      steps: [
        '1. Abrí Terminal o PowerShell como Administrador.',
        '2. Consultá el estado de la colmena BCD activa: bcdedit /enum {current}.',
        '3. Verificá que el entorno de recuperación WinRE esté habilitado y reconozca su partición: reagentc /info.',
        '4. Si WinRE aparece deshabilitado (Disabled), reactivalo con: reagentc /enable.',
      ],
      interpretation: 'Bcdedit muestra los punteros que la BIOS/UEFI lee para cargar el kernel. Reagentc /info confirma que la partición de rescate está lista para actuar ante un colapso del sistema.',
      howToRollback: 'Consulta no destructiva de solo lectura. No requiere reversión.',
    },
  },
  m20: {
    hookQuestion: '¿Por qué una PC con procesador de 16 núcleos y gráfica de gama alta puede sufrir micro-congelamientos y chasquidos de sonido mientras una máquina modesta corre con absoluta fluidez?',
    simpleAnalogy: 'Tener una CPU de máxima frecuencia con drivers que sufren latencia DPC es como tener un Ferrari en una autopista donde un camión de basura (el driver de red) se cruza y frena a cero cada 30 segundos. La velocidad máxima no importa si el flujo de datos no es constante y predecible.',
    evoExplains: 'La optimización racional en EVO Labs no consiste en deshabilitar 80 servicios al azar ni aplicar archivos .bat descargados de internet, sino en medir antes de tocar. El rendimiento de tiempo real en Windows está gobernado por las rutinas DPC (Deferred Procedure Calls) e ISR (Interrupt Service Routines). Si un controlador de red, audio o GPU retiene la CPU por más de 1.000 microsegundos en nivel IRQL 2, interrumpe el buffer de audio o el hilo de renderizado del motor gráfico, generando micro-stuttering y caídas de 1% Low FPS. Mediante LatencyMon y la auditoría de planes de energía con powercfg, el técnico aísla el controlador causante con evidencia empírica en lugar de conjeturas.',
    mythVsReality: {
      myth: 'Poner el Plan de Energía en "Máximo Rendimiento" (Ultimate Performance) y desactivar los C-States siempre da más FPS y menos input lag.',
      reality: 'Impedir que los núcleos bajen a estados de reposo C-State aumenta el consumo térmico basal, haciendo que el procesador alcance antes su límite de temperatura (Tjunction) y reduzca su frecuencia Boost sostenida por Thermal Throttling. El plan "Equilibrado" bien calibrado ofrece temperaturas más bajas y frecuencias monohilo más altas.',
    },
    technicalDeepDive: {
      title: 'METROLOGÍA DE SISTEMA: LATENCIA DPC, FRAMETIME Y PLANES ACPI',
      items: [
        'La Arquitectura DPC/ISR: Los dispositivos de hardware lanzan interrupciones físicas (IRQ) que el procesador atiende en DIRQL (Device IRQL). El driver programa una DPC a IRQL 2 (DISPATCH_LEVEL). Todo hilo de juego o audio en IRQL 0 (PASSIVE_LEVEL) queda congelado hasta que la DPC concluye.',
        'Umbrales Clínicos de LatencyMon: <250 µs es excelente para audio profesional y juegos competitivos; 250–500 µs es aceptable; >1.000 µs garantiza chasquidos audibles (buffer underrun) y tirones de frametime.',
        'Controladores Habituales con Fuga de DPC: ndis.sys (tarjeta de red Ethernet/Wi-Fi con ahorro de energía activo), nvlddmkm.sys / amdkmdag.sys (drivers gráficos con gestión de energía P-State inestable) y ACPI.sys (gestión de batería o sensores de placa madre).',
        'Auditoría de Planes de Energía con powercfg: El comando powercfg /energy y powercfg /requests detecta qué procesos o drivers impiden que el procesador duerma o fuerzan ciclos de reloj innecesarios.',
      ],
    },
    diagramTitle: 'METROLOGÍA DE LATENCIA DPC Y ANÁLISIS DE INTERRUPCIONES (LATENCYMON DIDÁCTICO)',
    diagramDescription: 'Medición en tiempo real de colas de interrupción, tiempos de respuesta de drivers críticos (nvlddmkm.sys vs ndis.sys) y comparación de planes de energía ACPI.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #020 — Micro-stuttering Severo y Chasquidos de Audio en Streaming',
      victim: 'PC Gamer/Streamer — AMD Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5 6000MHz',
      symptom: 'En juegos competitivos los FPS promedio marcaban 240+, pero cada 15-20 segundos se producía un congelamiento de 100 ms y la voz en Discord sonaba "robótica" y entrecortada.',
      initialHypothesis: 'Memoria RAM inestable con perfil EXPO o falla de la tarjeta gráfica RTX 4080.',
      rootCause: 'Se ejecutó LatencyMon durante 5 minutos de sesión de juego. El driver ndis.sys (tarjeta de red integrada Intel I225-V 2.5GbE) registró un pico DPC de 3.420 µs. La opción "Energy Efficient Ethernet" y "Green Ethernet" en las propiedades avanzadas del controlador forzaban a la placa de red a entrar y salir de modos de bajo consumo en medio del flujo de paquetes UDP de Discord.',
      resolution: 'En Administrador de Dispositivos ➔ Propiedades del Adaptador Intel ➔ Avanzado: se desactivaron "Energy Efficient Ethernet", "Green Ethernet" e "Interrupt Moderation". La latencia DPC cayó de 3.420 µs a 85 µs estables. El stuttering desapareció por completo y el audio quedó limpio. Gasto económico: $0.',
    },
    practiceDetails: {
      objective: 'Auditar los planes de energía disponibles y comprobar si algún controlador o proceso tiene un bloqueo de energía activo en el sistema.',
      dataType: 'MEASURED',
      whatToObserve: 'Esquema de energía activo (marcado con asterisco *) y bloqueos de suspensión bajo [DRIVER] o [PROCESS].',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Listá todos los esquemas de energía configurados: powercfg /list.',
        '3. Verificá si algún driver está impidiendo el reposo del equipo: powercfg /requests.',
        '4. Medí el tiempo de arranque de la última sesión registrado por el kernel: (Get-CimInstance Win32_OperatingSystem).LastBootUpTime.',
      ],
      interpretation: 'Powercfg /requests revela si un controlador de audio o red tiene un handle abierto perpetuo que evita que la CPU baje a estados térmicos óptimos.',
      howToRollback: 'Procedimiento de solo lectura y diagnóstico metrológico sin riesgo.',
    },
  },
  m21: {
    hookQuestion: '¿Por qué una computadora modesta con 4 GB de RAM y disco duro mecánico se congela por 20 minutos con el disco clavado al 100% de uso cada vez que se enciende?',
    simpleAnalogy: 'Un disco mecánico (HDD) es como un bibliotecario en patines que tiene que buscar libros en una biblioteca de 10 pisos: si 10 personas le piden un libro distinto al mismo tiempo en estantes separados, el bibliotecario pasa el 99% de su tiempo viajando en el ascensor (moviendo los cabezales físicos) y solo el 1% leyendo. Un SSD, en cambio, tiene una copia instantánea de todos los libros frente a sus ojos al mismo tiempo.',
    evoExplains: 'En hardware limitado (procesadores de 2 o 4 núcleos, 4 a 8 GB de memoria RAM y discos HDD mecánicos de 5400/7200 RPM), Windows no colapsa por falta de potencia bruta de cálculo, sino por congestión de entrada/salida (I/O Bottleneck) y saturación de la memoria virtual. Un HDD mecánico apenas puede entregar 75–100 operaciones de E/S por segundo (IOPS) con tiempos de acceso de 12 a 18 milisegundos. Cuando Windows Update, Windows Search Indexer y el antivirus ejecutan lecturas aleatorias simultáneas, la cola de disco (Current Disk Queue Length) supera 3.0 y el sistema operativo se paraliza. La optimización racional en estas máquinas consiste en controlar los servicios de I/O desmedido, desactivar el consumo de VRAM en efectos estéticos de sysdm.cpl y habilitar el descarte de pestañas inactivas en el navegador.',
    mythVsReality: {
      myth: 'Para revivir una PC vieja hay que instalar versiones modificadas "Lite" o "MiniOS" descargadas de foros piratas.',
      reality: 'Las ISOs "modificadas" suelen eliminar las firmas digitales de Windows Update, desactivar la pila de seguridad de Windows Defender y romper la compatibilidad con impresoras y certificados HTTPS. El rendimiento real se rescata configurando el Windows oficial racionalmente y reemplazando el HDD por un SSD SATA de $15.',
    },
    technicalDeepDive: {
      title: 'FORENSIA DE HARDWARE LIMITADO: IOPS MECÁNICOS, VIRTUAL MEMORY Y EFECTOS DWM',
      items: [
        'La Barrera Física de los IOPS: Un disco mecánico de 5400 RPM tiene una latencia de búsqueda mecánica (Seek Time) de 12 ms. 1000 ms / 12 ms = máximo ~83 IOPS. Un SSD SATA básico entrega 80.000 IOPS (1.000 veces más rápido). El 100% de disco en el Administrador de Tareas no significa saturación de megabytes por segundo, sino saturación del tiempo de respuesta del cabezal.',
        'Optimizaciones de Carga Gráfica en sysdm.cpl: El Compositor DWM consume memoria de video (VRAM) compartida en placas integradas Intel HD Graphics. Desactivar "Animaciones en la barra de tareas", "Sombras bajo las ventanas" y "Desplazamiento suave" libera páginas de memoria física y reduce el trabajo de renderizado de la GPU.',
        'Gestión del Archivo de Paginación en 4GB RAM: En equipos de 4GB, el archivo pagefile.sys es el salvavidas contra el cierre abrupto de aplicaciones por Out of Memory (OOM). Si está en un HDD mecánico, el "paging" genera un trillado insoportable de disco; si se coloca en un SSD SATA, el sistema vuelve a ser perfectamente usable.',
        'Ahorro de Memoria en Navegadores (Tab Discarding): Chrome y Edge consumen ~300 MB por pestaña abierta. Habilitar la política nativa de descarte de pestañas inactivas libera hasta el 70% de la memoria física cuando el usuario trabaja con múltiples sitios.',
      ],
    },
    diagramTitle: 'ANOMALÍA DE COLA DE DISCO MECÁNICO (HDD 100%) VS LATENCIA DE SILICIO (SSD)',
    diagramDescription: 'Comparativa de tiempo de respuesta de cabezal mecánico (500 ms en saturación) vs celda NAND flash (0.1 ms), longitud de cola de I/O y perfil de optimización visual en sysdm.cpl.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #021 — Notebook de Oficina Inutilizable con Disco al 100%',
      victim: 'Laptop Lenovo V14 — Intel Core i3 1005G1, 4GB RAM DDR4, HDD mecánico Seagate 1TB 5400 RPM',
      symptom: 'La computadora tardaba 8 minutos en mostrar el escritorio tras encenderse. El Administrador de Tareas mostraba permanentemente: "Disco 100%" con apenas 1.2 MB/s de transferencia, congelando cualquier clic.',
      initialHypothesis: 'Infección por troyano o minero de criptomonedas.',
      rootCause: 'Auditoría en vivo con Resource Monitor (resmon.exe ➔ pestaña Disco): El proceso SearchIndexer.exe y TiWorker.exe (Windows Update) leían miles de archivos pequeños simultáneamente. El tiempo de respuesta del HDD alcanzaba 1.850 ms (casi 2 segundos para responder a cada lectura). La cola de disco superaba 6.8 pedidos en espera continua.',
      resolution: '1) Se pausó temporalmente la indexación en segundo plano y se limitaron las carpetas indexadas a solo Documentos. 2) En sysdm.cpl se ajustó a "Ajustar para obtener el mejor rendimiento" conservando únicamente "Bordes suaves para fuentes de pantalla". 3) Se clonó la unidad mecánica a un SSD SATA de $18. El tiempo de arranque cayó de 8 minutos a 14 segundos, el uso de disco bajó a 1% en reposo y el equipo volvió a ser completamente productivo.',
    },
    practiceDetails: {
      objective: 'Abrir el panel de Rendimiento de Sistema (sysdm.cpl) para optimizar los efectos visuales y auditar el tiempo de respuesta del almacenamiento.',
      dataType: 'SIMULATED',
      whatToObserve: 'Opciones de rendimiento en Efectos Visuales y confirmación de mitigación del consumo gráfico de DWM.',
      steps: [
        '1. Presioná Win + R, escribí SystemPropertiesPerformance.exe y presioná Enter.',
        '2. En la pestaña "Efectos visuales", seleccioná "Personalizar".',
        '3. Desmarcá todas las animaciones y sombras; dejá tildado únicamente "Suavizar bordes para las fuentes de pantalla" (para que el texto se lea nítido sin fatiga visual).',
        '4. Hacé clic en Aplicar y Aceptar.',
      ],
      interpretation: 'Esta configuración alivia el uso de memoria de video compartida en procesadores con gráficos integrados antiguos y elimina los retrasos de renderizado de ventanas en equipos con poca RAM.',
      howToRollback: 'Para volver a la configuración por defecto de Windows: ejecutá nuevamente SystemPropertiesPerformance.exe y seleccioná "Dejar que Windows elija la configuración más adecuada para el equipo".',
    },
  },
  m22: {
    hookQuestion: 'Iniciás sesión en Windows, la pantalla queda completamente negra pero podés mover la flecha del mouse: ¿por qué apagar la PC del botón o formatear de inmediato es el peor error?',
    simpleAnalogy: 'Tener pantalla negra con cursor en Windows es como encender el televisor y ver la luz de encendido y el menú de volumen en pantalla, pero sin imagen del canal: el televisor y la pantalla funcionan perfectamente, lo único que se cayó es la señal del canal. En Windows, si el mouse se mueve, el kernel y el driver de video están vivos; lo único que se colgó es la aplicación de interfaz (explorer.exe).',
    evoExplains: 'El protocolo de crisis ante emergencias técnicas divide los fallos en capas de abstracción. Si hay cursor sobre fondo negro, el Administrador de Ventanas del Escritorio (dwm.exe) y el subsistema gráfico operan con total normalidad; la falla radica en que explorer.exe colapsó por una extensión de shell defectuosa. Reiniciar el driver de video en caliente con Win + Ctrl + Shift + B o abrir el Administrador de Tareas (Ctrl + Shift + Esc) y lanzar explorer.exe resuelve la emergencia en 15 segundos sin perder documentos abiertos. De igual modo, ante un disco mecánico con ruidos o sectores dañados, ejecutar chkdsk /r es destructivo porque estresa los cabezales; el protocolo profesional exige clonar primero y reparar después.',
    mythVsReality: {
      myth: 'Si la pantalla queda negra al iniciar Windows, la tarjeta de video se quemó o el sistema operativo está muerto.',
      reality: 'Si el cursor del mouse es visible y responde al movimiento, el hardware de la GPU, la memoria VRAM y el kernel NT están 100% operativos. Solo colapsó el proceso de interfaz explorer.exe, que puede relanzarse en 3 segundos desde el Administrador de Tareas.',
    },
    technicalDeepDive: {
      title: 'ANATOMÍA DEL SUBSISTEMA DE CRISIS: EXPLORER, DWM Y RECUPERACIÓN DE DRIVER',
      items: [
        'Aislamiento de Sesión Gráfica: dwm.exe corre en sesión aislada con aceleración por hardware. explorer.exe es un proceso cliente de modo usuario en Sesión 1. Su muerte no arrastra al kernel ni a los programas en segundo plano.',
        'Atajo de Recuperación Win + Ctrl + Shift + B: Invoca internamente la API DxgkSubmitCommand al kernel de gráficos dxgkrnl.sys, provocando una señal TDR artificial que purga el búfer de escaneo y reinicia el pipeline de visualización del driver.',
        'La Trampa Mortal de Chkdsk en Discos Degradados: chkdsk /r intenta leer repetitivamente cada sector dañado para reubicarlo. En un disco mecánico con daño físico, esta fricción continua termina por doblar o rayar los platos magnéticos antes de rescatar los datos. El protocolo EVO exige clonación previa con ddrescue.',
        'Diagnóstico Rápido de BSOD: Los códigos Bugcheck son firmas binarias: 0x7B (Inaccessible Boot Device por cambio de modo SATA/NVMe), 0xD1 (Driver IRQL Not Less or Equal por puntero nulo de controlador) y 0x124 (WHEA Uncorrectable Error por falla de silicio o voltaje inestable).',
      ],
    },
    diagramTitle: 'TRIAGE DE EMERGENCIAS TÉCNICAS: PANTALLA NEGRA, BSOD Y DISCO I/O',
    diagramDescription: 'Árbol de decisión ante crisis de sistema: pantalla negra con cursor (DWM vivo), bucle de pantallazos azules y protocolo de rescate de discos mecánicos dañados.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #022 — Pantalla Negra con Cursor tras Actualizar Driver en Laptop Híbrida',
      victim: 'Notebook ASUS ROG — Intel Core i7 12700H, NVIDIA RTX 3070 Ti, 32GB RAM DDR5',
      symptom: 'Al ingresar la contraseña en el inicio de sesión, la pantalla se ponía completamente negra. El mouse se movía y cambiaba a cursor de texto, pero no aparecía la barra de tareas ni el escritorio.',
      initialHypothesis: 'Chip gráfico NVIDIA desoldado o Windows completamente dañado por virus.',
      rootCause: 'El instalador del driver de video había dejado una clave residual en HKCR\\Directory\\shellex que provocaba un Access Violation (0xC0000005) cada vez que explorer.exe intentaba inicializar la barra de tareas.',
      resolution: 'Se presionó Ctrl + Shift + Esc para abrir el Administrador de Tareas, se ejecutó regedit.exe desde Archivo ➔ Ejecutar nueva tarea, se limpió la clave corrupta del menú contextual y se ejecutó start explorer.exe. El escritorio cargó de inmediato con todas las apps abiertas. Tiempo de intervención: 3 minutos.',
    },
    practiceDetails: {
      objective: 'Ejecutar el protocolo de reinicio y auditoría de la shell explorer.exe en caliente mediante PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Parpadeo controlado de la barra de tareas e inicio del nuevo proceso explorer.exe con nuevo PID asignado.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Verificá el PID actual de la shell de Windows: Get-Process explorer | Select-Object Id, ProcessName, StartTime.',
        '3. Ejecutá la secuencia de reinicio de emergencia: Stop-Process -Name explorer -Force ; Start-Process explorer.',
        '4. Comprobá que la barra de tareas y los iconos se reconstruyen al instante sin cerrar aplicaciones abiertas.',
      ],
      interpretation: 'Este comando simula y entrena el protocolo que rescata equipos con pantalla negra o menús congelados sin requerir un reinicio de hardware.',
      howToRollback: 'El propio sistema relanza automáticamente explorer.exe en milisegundos.',
    },
  },
  m23: {
    hookQuestion: 'Llega al taller una PC con una falla desconcertante: "El juego marca 60 FPS fijos pero se siente como diapositivas a 15 FPS" o "El disco C: pierde 20 GB de espacio cada noche": ¿cómo investiga un perito sin tocar nada al azar?',
    simpleAnalogy: 'Un mecánico aficionado que escucha un ruido en el motor cambia las bujías, la batería y la correa a ver si le acierta. Un perito forense de EVO Labs coloca sensores de telemetría, aísla el cilindro que falla y cambia una única pieza de $5 demostrando con métricas antes y después que el problema quedó resuelto.',
    evoExplains: 'El Método Científico EVO en el banco de pruebas se basa en el principio de Aislamiento de Variables: Síntoma ➔ Telemetría Objetiva ➔ Hipótesis ➔ Prueba Aislada ➔ Causa Raíz Demostrada ➔ Resolución. En este módulo analizamos 4 de los expedientes más complejos del taller: 1) El misterio de los 60 FPS mentirosos resuelto al descubrir que los reguladores de voltaje (VRM) de la placa madre alcanzaban 118°C y disparaban el estrangulamiento térmico BD PROCHOT bajando la CPU a 800 MHz; 2) La fuga silenciosa de disco por crash dumps en bucle; 3) La caída total de internet con IP válida por corrupción en la pila de Winsock; y 4) El congelamiento por colisión de dos antivirus simultáneos.',
    mythVsReality: {
      myth: 'Si el contador de FPS marca 60 o 144 cuadros, el juego es 100% fluido y cualquier tirón es "lag de la conexión a internet".',
      reality: 'El promedio de FPS es un promedio matemático ciego. Si de 60 cuadros entregados en un segundo, 59 tardan 8 milisegundos y uno solo tarda 500 milisegundos por estrangulamiento térmico de VRM, el ojo percibe un congelamiento masivo de medio segundo aunque el contador siga marcando 60 FPS.',
    },
    technicalDeepDive: {
      title: 'METODOLOGÍA DE PERITAJE: AISLAMIENTO DE VARIABLES Y CAUSA RAÍZ',
      items: [
        'Señal BD PROCHOT (Bi-Directional Processor Hot): Permite a la placa madre forzar a la CPU a reducir su multiplicador al mínimo (habitualmente 8x = 0.79 GHz) cuando los MOSFETs del circuito de alimentación (VRM) superan su umbral crítico, incluso si la CPU está fría con refrigeración líquida.',
        'Fuga de Archivos Dump (Minidump vs Memory.dmp): Cuando un servicio de kernel crashea y se reinicia en bucle silenciosamente, Windows escribe volcados de depuración continuos en C:\\Windows\\Minidump y C:\\Windows\\LiveKernelReports, devorando decenas de gigabytes en discos SSD.',
        'La Pila Winsock y los Filtros LSP: Winsock2 gestiona la comunicación entre aplicaciones y protocolos de red. Software de seguridad o VPNs desinstalados de forma incompleta dejan entradas huérfanas en el catálogo de transporte que bloquean HTTP/HTTPS aunque el ping a nivel IP funcione.',
        'Deadlock por Filtros NTFS de Antivirus: Dos motores antivirus instalados simultáneamente registran sendos Minifiltros de sistema de archivos en fltmgr.sys. Al abrir un archivo, el Antivirus A bloquea el IRP para escanear y el Antivirus B intenta interceptarlo, provocando un abrazo mortal (deadlock) que congela el Explorador.',
      ],
    },
    diagramTitle: 'EXPEDIENTES FORENSES DE TALLER: DE TELEMETRÍA A RESOLUCIÓN',
    diagramDescription: 'Estudio de 4 casos periciales de laboratorio: VRM Throttling con BD PROCHOT, fuga de dumps en disco, corrupción de Winsock y bloqueo por colisión de antivirus.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #023 — Misterio de los 60 FPS Mentirosos con Caídas a 15 FPS',
      victim: 'PC Gamer — AMD Ryzen 5 5600, Placa Madre A320M económica sin disipadores, RTX 3060',
      symptom: 'El cliente jugaba a 60 FPS fijos limitados con V-Sync, pero cada 40 segundos el juego sufría una congelación brutal de 1 segundo que hacía imposible apuntar.',
      initialHypothesis: 'Tarjeta gráfica RTX 3060 defectuosa o cuello de botella de memoria RAM.',
      rootCause: 'Se ejecutó HWInfo64 con registro de sensores en segundo plano durante la sesión de juego. La temperatura de la CPU marcaba 54°C gracias a un buen cooler, pero el sensor "VRM / Motherboard Temp" trepaba a 116°C. En ese instante, la placa activaba BD PROCHOT y la CPU bajaba de 4.4 GHz a 0.54 GHz durante 2 segundos hasta que los MOSFETs enfriaban a 105°C.',
      resolution: 'Se colocaron pequeños disipadores de aluminio adhesivos sobre los MOSFETs del VRM y se reorientó un ventilador del gabinete para forzar flujo de aire directo sobre la placa madre. La temperatura del VRM no superó los 78°C, la señal BD PROCHOT no volvió a dispararse y el frametime quedó completamente plano a 16.6 ms. Costo del arreglo: $3.',
    },
    practiceDetails: {
      objective: 'Auditar la pila de red Winsock y restablecer la configuración de transporte TCP/IP limpia de Windows.',
      dataType: 'MEASURED',
      whatToObserve: 'Restablecimiento de los catálogos de Winsock e interfaces de red IP con salida de confirmación en consola.',
      steps: [
        '1. Abrí PowerShell o CMD como Administrador.',
        '2. Consultá el estado de la configuración IP actual: ipconfig /all.',
        '3. Ejecutá la orden de restauración de la pila Winsock: netsh winsock reset.',
        '4. Ejecutá la orden de restablecimiento del protocolo TCP/IP: netsh int ip reset.',
      ],
      interpretation: 'Elimina cualquier filtro de red corrupto o inyección de proxy huérfana dejada por malware o VPNs mal desinstalados, restaurando el tráfico web a nivel de sockets.',
      howToRollback: 'El comando restaura los valores oficiales por defecto de Microsoft. Si se utilizaba una IP estática manual, se vuelve a configurar en las propiedades del adaptador de red.',
    },
  },
  m24: {
    hookQuestion: 'Un técnico novato pasa 10 minutos navegando por menús modernos para cambiar una IP o buscar el Administrador de Dispositivos; un especialista presiona 3 teclas y entra directo al núcleo de control: ¿cuáles son los atajos de élite que ahorran cientos de horas de taller?',
    simpleAnalogy: 'Buscar opciones técnicas en la interfaz moderna de Windows es como entrar a un supermercado gigante y recorrer 15 pasillos llenos de carteles publicitarios solo para comprar una botella de agua. Los comandos directos (.cpl, .msc y atajos Win) son la puerta trasera de emergencia para entrar directo al almacén y tomar el agua en 2 segundos.',
    evoExplains: 'El verdadero dominio de Windows consiste en saltarse las capas visuales lentas e ir directo a los applets nativos Win32. Comandos como ncpa.cpl (Conexiones de red), sysdm.cpl (Propiedades del sistema y memoria virtual), devmgmt.msc (Administrador de dispositivos) y diskmgmt.msc (Administrador de discos) se ejecutan directamente en la memoria sin procesar el entorno UWP. Asimismo, Windows incorpora herramientas forenses ocultas de primer nivel como el Monitor de Confiabilidad (perfmon /rel), una línea temporal gráfica que correlaciona cada falla de aplicación o pantalla azul con la fecha y hora exacta en que se instaló un controlador o actualización.',
    mythVsReality: {
      myth: 'El nuevo panel de Configuración de Windows 10/11 reemplazó por completo a los paneles clásicos (.cpl) y estos ya no existen.',
      reality: 'Los applets clásicos .cpl y .msc siguen vivos en C:\\Windows\\System32 porque son indispensables para la administración corporativa y ejecutan directamente código C++ de bajo nivel 10 veces más rápido que la interfaz moderna.',
    },
    technicalDeepDive: {
      title: 'ARSENAL NATIVO WIN32: APPLETS CPL, CONSOLAS MMC Y MONITOR DE CONFIABILIDAD',
      items: [
        'Librerías CPL (Control Panel Libraries): Archivos ejecutables Win32 que exportan la función CPlApplet. Al ejecutarse (ej. ncpa.cpl), cargan los diálogos de red directamente en memoria evitando el consumo de recursos de la aplicación Settings.',
        'Consolas MMC (.msc): Microsoft Management Console hospeda snap-ins modulares en un único arnés administrativo (compmgmt.msc agrupa Visor de Eventos, Discos, Servicios y Usuarios locales).',
        'Monitor de Confiabilidad (perfmon /rel): Lee la base de datos de RAC (Reliability Analysis Component) almacenada en C:\\ProgramData\\Microsoft\\RAC. Asigna un índice del 1.0 al 10.0 y clasifica eventos en: Errores de software, Errores de Windows, Errores varios, Advertencias e Información de parches.',
        'Atajos de Teclado de Productividad Extrema: Win + X (menú rápido de administrador), Win + V (historial de portapapeles en memoria con hasta 25 elementos), Win + Shift + S (captura de pantalla con recorte de precisión) y Ctrl + Shift + Esc (lanzamiento instantáneo del Administrador de Tareas sin pasar por la pantalla de seguridad de Ctrl+Alt+Del).',
      ],
    },
    diagramTitle: 'MATRIZ DE COMANDOS MAESTROS Y MONITOR DE CONFIABILIDAD',
    diagramDescription: 'Matriz de accesos directos Win32 (.cpl y .msc) y reconstrucción didáctica del Monitor de Confiabilidad (perfmon /rel) correlacionando caídas con fechas exactas de instalación.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #024 — Cuelgues Aleatorios en Workstation de Edición de Video',
      victim: 'PC Profesional — Intel Core i9 13900K, 64GB RAM DDR5, RTX 4090',
      symptom: 'La máquina se congelaba con pantalla negra de forma impredecible 2 o 3 veces al día mientras editaba en Premiere Pro. El usuario creía que la RTX 4090 estaba rota.',
      initialHypothesis: 'Tarjeta gráfica de $2000 dañada o memoria RAM con errores.',
      rootCause: 'Se abrió la consola maestra perfmon /rel (Monitor de Confiabilidad). La línea temporal mostró que el índice de estabilidad cayó de 9.9 a 2.3 el día martes 14. En esa fecha exacta figuraba: "Instalación correcta de software RGB Fusion v2.1" seguido de decenas de eventos "El servicio GLedApi.exe dejó de funcionar" que provocaban un bloqueo cruzado en el bus SMBus de la placa madre.',
      resolution: 'Se desinstaló el software de control RGB del fabricante con su desinstalador limpio. El índice de confiabilidad regresó a 10.0 y la máquina completó 48 horas continuas de renderizado sin un solo cuelgue. Diagnóstico resuelto en 4 minutos gracias a perfmon /rel.',
    },
    practiceDetails: {
      objective: 'Abrir el Monitor de Confiabilidad del sistema y auditar la línea temporal de eventos de estabilidad de Windows.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Gráfico histórico del índice de estabilidad (1 a 10) y correlación de eventos críticos con instalaciones recientes.',
      steps: [
        '1. Presioná Win + R, escribí perfmon /rel y presioná Enter.',
        '2. Observá la curva de estabilidad de los últimos 30 días.',
        '3. Hacé clic sobre cualquier columna que tenga un icono rojo de error (X).',
        '4. Revisá en la tabla inferior qué aplicación o driver causó la caída y qué día exacto comenzó el problema.',
      ],
      interpretation: 'Permite diagnosticar con certeza absoluta qué cambio de software provocó inestabilidad en el equipo sin necesidad de formatear ni perder tiempo buscando a ciegas.',
      howToRollback: 'Herramienta nativa de visualización diagnóstica de solo lectura. No modifica configuraciones ni requiere reversión.',
    },
  },
  m25: {
    hookQuestion:
      '¿Por qué dos técnicos discutiendo sobre "falta de memoria" o "lentitud" no logran entenderse si uno se refiere al Working Set y el otro al Commit Charge, o si confunden una interrupción física (ISR) con una llamada diferida (DPC)?',
    simpleAnalogy:
      'Aprender informática sin un glosario riguroso es como intentar arreglar un motor de avión usando palabras como "el cosito que gira" y "la chapita redonda". En el taller aficionado, todo se reduce a "lag" o "falta de RAM". En el laboratorio pericial de EVO Labs, cada fenómeno físico y lógico del Kernel NT tiene un nombre exacto con propiedades medibles en microsegundos y bytes.',
    evoExplains:
      'El Glosario Maestro A-Z no es una lista de definiciones de diccionario para memorizar mecánicamente, sino la cartografía forense del sistema operativo. Un perito no "opina": clasifica la evidencia. Si un cliente afirma que "Windows se quedó sin memoria", el especialista investiga qué componente exacto colapsó: ¿fue el Working Set privado (páginas en RAM física)?, ¿el Commit Charge (compromiso virtual contra pagefile.sys)?, ¿el Non-Paged Pool (fuga en el kernel)? o ¿el espacio libre en el disco? Este módulo condensa los 50 conceptos fundamentales del Kernel NT, traduciendo cada sigla hermética en una analogía cotidiana, una definición rigurosa y un comando nativo de auditoría.',
    mythVsReality: {
      myth: 'Los términos técnicos complejos son solo jerga académica innecesaria para complicar cosas simples.',
      reality:
        'La precisión terminológica es la diferencia entre resolver una falla en 2 minutos o arruinar una máquina. Si un técnico confunde "Paged Pool" con "Non-Paged Pool", cambiará los módulos de RAM creyendo que están rotos cuando en realidad un minifiltro de antivirus está goteando memoria en el Ring 0.',
    },
    technicalDeepDive: {
      title: 'TAXONOMÍA FORENSE DE WINDOWS: LOS 4 PILARES DEL KERNEL NT',
      items: [
        'Memoria Virtual & Paginación: Commit Limit (límite máximo de memoria virtual comprometible = RAM física + tamaño del Pagefile). Working Set (conjunto de páginas físicas actualmente asignadas al proceso). Page Fault (interrupción del procesador cuando un hilo intenta acceder a una página que no está en el Working Set; Soft Fault si está en la lista Standby en RAM, Hard Fault si requiere lectura mecánica del disco).',
        'Kernel, Hilos & Despacho: IRQL (Interrupt Request Level, escala de 0 a 31 que arbitra qué código puede interrumpir a cuál). ISR (Interrupt Service Routine, rutina ultracorta en IRQL alta que atiende al hardware). DPC (Deferred Procedure Call, trabajo pesado diferido ejecutado en IRQL 2 / DISPATCH_LEVEL; si supera 1.000 µs causa dropouts de audio). Context Switch (guardado y restauración del estado de los registros de CPU para alternar la ejecución entre hilos).',
        'Almacenamiento & NTFS: $MFT (Master File Table, base de datos relacional de NTFS donde todo archivo o carpeta es un registro de 1.024 bytes). VSS (Volume Shadow Copy Service, subsistema de instantáneas atómicas de volumen para respaldo y restauración). TRIM (comando ATA/NVMe que notifica al controlador SSD qué bloques LBA ya no contienen datos válidos para que el Garbage Collection los borre en segundo plano).',
        'Seguridad, Privilegios & Objetos: Token de Acceso (estructura de datos que encapsula el SID del usuario, grupos y privilegios). Integrity Level (Untrusted, Low, Medium, High, System; impide que un proceso con nivel inferior inyecte código en uno superior mediante UIPI). ACL / DACL (Discretionary Access Control List, lista de permisos explícitos que define qué operaciones están autorizadas sobre un objeto asegurable).',
      ],
    },
    diagramTitle: 'MATRIZ CONCEPTUAL FORENSE A-Z // RIGOR DE KERNEL & ANALOGÍAS',
    diagramDescription:
      'Explorador interactivo de conceptos clasificados por subsistemas: Memoria, Kernel, Almacenamiento, Red y Seguridad. Incluye definición técnica, analogía cotidiana, impacto pericial y comando de auditoría.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #025 — El Falso Diagnóstico de "Memoria RAM Insuficiente"',
      victim: 'Servidor de Archivos PyME — Windows Server / Windows 11 Pro, 32GB RAM',
      symptom:
        'El soporte técnico anterior recomendó duplicar la memoria a 64GB porque el sistema mostraba "Memoria al 95%" y cerraba servicios críticos con error Out of Memory (OOM).',
      initialHypothesis: '32 GB de RAM física resultaban insuficientes para la cantidad de usuarios conectados.',
      rootCause:
        'Auditoría pericial con PoolMon (Sysinternals) y Get-Process. La RAM física tenía 12 GB en la lista Standby disponibles, pero el Non-Paged Pool (memoria del kernel que nunca puede enviarse a disco) alcanzaba 18 GB debido a una fuga de memoria (tag "Thrd") en un controlador de captura de video obsoleto. El "Commit Charge" había superado el "Commit Limit" porque el administrador había desactivado el archivo de paginación siguiendo una guía de internet.',
      resolution:
        '1) Se actualizó el controlador defectuoso eliminando el goteo en el Non-Paged Pool. 2) Se reconfiguró el archivo de paginación (pagefile.sys) administrado por el sistema, elevando el Commit Limit a 48 GB. El uso de memoria se estabilizó en 18% continuo sin gastar un solo centavo en módulos de RAM adicionales.',
    },
    practiceDetails: {
      objective:
        'Consultar y auditar la taxonomía de comandos nativos de PowerShell utilizando el sistema de ayuda y reflexión interna Get-Help.',
      dataType: 'MEASURED',
      whatToObserve:
        'Descubrimiento de cmdlets organizados por categorías funcionales (Process, Service, Net, Item) y verificación de sintaxis oficial.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá la orden de inventario de cmdlets de procesos y memoria: Get-Command -Noun Process, Service | Select-Object -First 10 Name, CommandType.',
        '3. Consultá la definición técnica oficial de un cmdlet de gestión de procesos: Get-Help Get-Process -Detailed | Select-Object -First 20.',
        '4. Comprobá los contadores de memoria de un proceso real ejecutando: Get-Process explorer | Format-List Name, WS, PM, NPM, VM.',
      ],
      interpretation:
        'Permite verificar en tiempo real las abreviaturas técnicas: WS (Working Set en bytes), PM (Paged Memory), NPM (Non-Paged Memory) y VM (Virtual Memory), aplicando el glosario a la práctica forense diaria.',
      howToRollback:
        'Comandos nativos de consulta y telemetría de solo lectura. No modifican configuraciones ni requieren reversión.',
    },
  },
  m26: {
    hookQuestion:
      '¿Por qué un técnico que memoriza "trucos y recetas" queda obsoleto con cada actualización de Windows, mientras que un investigador pericial que comprende la arquitectura del Kernel NT puede diagnosticar con éxito cualquier falla en cualquier versión presente o futura?',
    simpleAnalogy:
      'Un conductor aficionado que solo aprendió a manejar por una única calle de su barrio se pierde en cuanto cortan una esquina o cambian el sentido de circulación. Un navegante profesional con brújula y carta náutica entiende la topografía del terreno: no importa si hay tormenta, desvíos o niebla, siempre sabe dónde está la costa, cuál es la profundidad del agua y cómo llevar el barco seguro a puerto. El Tomo 02 fue tu carta náutica de Windows.',
    evoExplains:
      'Has llegado a la meta del Tomo 02 — La Biblia Negra de Windows. A lo largo de estos 27 módulos (del 00 al 26) recorriste el sistema operativo capa por capa: desde el encendido del silicio en la placa madre con UEFI y la partición ESP, pasando por la barrera infranqueable entre Ring 3 y Ring 0, la gestión científica de la memoria virtual sin mitos de vaciado, el control de latencias DPC en controladores, la estructura atómica de NTFS y el Registro, hasta las técnicas no destructivas de reparación in-place y el triage de emergencias en vivo. Este último módulo no agrega más teoría: audita tu "Pasaporte del Investigador", consolida tu "Archivo EVO" personal (el repositorio de bitácoras, scripts y mediciones con el que vas a respaldar tus intervenciones profesionales) y establece el puente editorial hacia el TOMO 03: REPARACIÓN DE PC // SISTEMA EVO LABS, donde llevaremos esta misma mentalidad analítica y metodológica al diagnóstico, rescate y reparación integral de hardware y software en taller.',
    mythVsReality: {
      myth: 'Para ser un experto en Windows hay que memorizar de memoria los cientos de miles de claves del Registro y comandos de consola.',
      reality:
        'Nadie memoriza el Registro completo. El verdadero experto domina la arquitectura, sabe qué preguntas hacerle al sistema, qué telemetría observar (perfmon, resmon, eventvwr, LatencyMon) y cómo aislar variables para llegar a la causa raíz demostrable.',
    },
    technicalDeepDive: {
      title: 'LOS 10 MANDAMIENTOS DE LA ARQUITECTURA NT & ESTRUCTURA DEL ARCHIVO EVO',
      items: [
        '1. Medir antes de Modificar: Todo síntoma debe respaldarse con métricas objetivas (microsegundos de DPC, longitud de cola de disco, working set, eventos de bugcheck). Si no podés medir la falla, no podés demostrar que la solucionaste.',
        '2. Principio de Aislamiento de Variables: Cambiar una única variable a la vez. Si aplicás 5 cambios simultáneos y el problema desaparece, no sabés cuál fue la solución ni qué efectos secundarios introdujiste.',
        '3. Reversibilidad Obligatoria: Toda intervención técnica debe tener un camino de vuelta documentado (punto de restauración, copia de clave .reg, exportación de BCD, respaldo de controlador previo).',
        '4. Desconfiar de las Recetas Mágicas: Los debloaters automáticos y scripts "optimizadores" de internet rompen dependencias críticas del sistema (DWM, CBS, WinRE, criptografía) para ganar 100 MB de RAM que Windows gestiona mejor por sí mismo.',
        '5. Respetar la Cadena de Servicio (Servicing Pipeline): DISM repara el almacén de componentes (WinSxS); SFC repara los archivos del sistema usando WinSxS como fuente. Ejecutar SFC sin reparar WinSxS es estéril ante una corrupción de componentes.',
        '6. El Archivo EVO Personal: Carpeta de trabajo profesional (C:\\EVO_LABS) con subcarpetas para Bitacoras_Peritaje, Scripts_PowerShell, Exportaciones_BCD, Dumps_Crash y Líneas_Base_Rendimiento.',
        '7. Fuentes Oficiales de Ingeniería: Windows Internals Part 1 & Part 2 (Mark Russinovich & David Solomon), Documentación de Microsoft Learn, Sysinternals Suite oficial y Repositorio de PowerShell SDK.',
        '8. Puente Hacia el Tomo 03 (Reparación de PC // Sistema EVO Labs): El dominio de llamadas al sistema, controladores y arquitectura del Kernel NT te da la base analítica perfecta para diagnosticar y reparar fallas críticas de hardware, arranque y estabilidad en taller profesional.',
      ],
    },
    diagramTitle: 'PASAPORTE DEL INVESTIGADOR // VERIFICACIÓN DE 27 MÓDULOS',
    diagramDescription:
      'Panel digital de verificación técnica que comprueba las 10 competencias maestras adquiridas, la estructura del Archivo EVO personal y las fuentes de validación de ingeniería de Microsoft.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente Maestro #026 — Auditoría Técnica Integral en Estación de Control Industrial',
      victim: 'Workstation Industrial de Planta — Windows 10 LTSC / Windows 11 Enterprise, Control de Línea Automatizada',
      symptom:
        'El equipo sufría pausas intermitentes de 2 segundos que detenían la sincronización del brazo robótico, costando miles de dólares por hora de paro de producción. Tres técnicos habían sugerido formatear y reinstalar desde cero.',
      initialHypothesis: 'Falla física en el autómata programable (PLC) o tarjeta de red defectuosa.',
      rootCause:
        'El especialista aplicó la metodología del Tomo 02: 1) Ejecutó LatencyMon y descubrió picos de 3.800 µs causados por el driver del adaptador de red Wi-Fi secundario (ndis.sys) en modo ahorro de energía PCIe. 2) Abrió perfmon /rel y correlacionó las caídas con la instalación de un software de monitoreo de terceros que goteaba hilos en el kernel. 3) Verificó la integridad de WinSxS con DISM sin detener la operación de la planta.',
      resolution:
        'Se desactivó el ahorro de energía en la tarjeta de red (fijando C-States estables), se desinstaló el software parásito y se documentó la línea base en el Archivo EVO. Latencia estabilizada en 85 µs continuos. Producción reanudada en 25 minutos sin tocar el disco ni formatear.',
    },
    practiceDetails: {
      objective:
        'Generar la Ficha Técnica Final de tu estación de trabajo en PowerShell, exportando un informe completo de hardware, kernel, tiempo de actividad y estado de almacenamiento a tu Archivo EVO.',
      dataType: 'MEASURED',
      whatToObserve:
        'Salida limpia y formateada con información del sistema operativo, versión de build de Windows, procesador, memoria física total y estado de arranque UEFI.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Creá la carpeta de tu laboratorio profesional si aún no existe: New-Item -ItemType Directory -Path "C:\\EVO_LABS\\Auditoria" -Force.',
        '3. Ejecutá la orden técnica que extrae la radiografía del sistema: Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsHardwareAbstractionLayer, BiosFirmwareType, CsProcessors, CsTotalPhysicalMemory | Format-List | Out-File -FilePath "C:\\EVO_LABS\\Auditoria\\Pasaporte_EVO_Host.txt".',
        '4. Confirmá la generación del archivo de informe leyendo el contenido: Get-Content "C:\\EVO_LABS\\Auditoria\\Pasaporte_EVO_Host.txt".',
      ],
      interpretation:
        'Este archivo representa la primera acta de auditoría de tu Archivo EVO personal, verificando que dispones de las herramientas y el criterio técnico para diagnosticar cualquier entorno Windows según el estándar de la Academia EVO Labs.',
      howToRollback:
        'El archivo generado es un informe de texto de auditoría. Si deseás eliminarlo, ejecutá: Remove-Item "C:\\EVO_LABS\\Auditoria\\Pasaporte_EVO_Host.txt".',
    },
  },
};

export const Tomo02ModuleReader: React.FC<Tomo02ModuleReaderProps> = ({
  moduleIndex,
  onBackToIndex,
  onOpenMagazine,
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
          {onOpenMagazine && (
            <button
              type="button"
              onClick={() => onOpenMagazine(7 + moduleIndex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-cyan-950 border border-zinc-800 hover:border-cyan-500/50 text-zinc-300 hover:text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
              title="Abrir este contenido en el Magazine A4"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">VER EN MAGAZINE (PÁG. {String(7 + moduleIndex).padStart(2, '0')})</span>
              <span className="sm:hidden">MAGAZINE</span>
            </button>
          )}

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
              <span>ESTÁS ACÁ // MÓDULO {currentMod.moduleNumber} (27 MÓDULOS [00–26])</span>
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
                {nextMod ? `Módulo ${nextMod.moduleNumber}: ${nextMod.title}` : 'Evaluación Final del Tomo 02 y Certificado EVO.'}
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
            6. SOPORTE VISUAL OBLIGATORIO // OBSERVACIÓN & FORENSIA
        ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>OBSERVALO // SOPORTE VISUAL TÉCNICO & FORENSE</span>
          </div>

          <Tomo02ModuleVisual module={currentMod} richData={richData} />
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

        {/* ========================================================
            10. CIERRE SOLEMNE // TOMO 02: LA BIBLIA NEGRA DE WINDOWS
        ======================================================== */}
        {currentMod.id === 'm26' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#081220] via-[#050B14] to-black border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,210,255,0.2)] space-y-6 animate-in fade-in duration-300">
            {/* Header with Award & Accreditation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400 flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <span className="font-mono-tech text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                    ACADEMIA EVO LABS // CIERRE DE TOMO
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    TOMO 02 FINALIZADO: LA BIBLIA NEGRA DE WINDOWS
                  </h2>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono-tech font-bold text-xs uppercase tracking-wider">
                PASAPORTE COMPLETADO 100% // VERIFICACIÓN EVO
              </span>
            </div>

            {/* 1. Qué cambió en tu forma de entender Windows */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-300 font-bold uppercase">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>1. QUÉ CAMBIÓ EN TU FORMA DE ENTENDER WINDOWS:</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed bg-black/60 p-4 rounded-xl border border-cyan-950">
                Has dejado de ser un operador que prueba "recetas ciegas" de internet o apaga la máquina
                desesperadamente ante una pantalla negra. Ahora sabés que detrás de cada clic existe una compuerta
                de Syscalls, un planificador de hilos administrando IRQLs y un subsistema de memoria virtual
                respaldando el Commit Limit. Sos un investigador técnico: medís antes de tocar, aislás variables
                y demostrás la causa raíz con telemetría objetiva.
              </p>
            </div>

            {/* 2. Archivo EVO Consolidado */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-300 font-bold uppercase">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>2. TU ARCHIVO EVO CONSOLIDADO (C:\EVO_LABS):</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed bg-black/60 p-4 rounded-xl border border-cyan-950">
                Tu laboratorio técnico personal ha quedado formalmente constituido en <code className="text-cyan-300 font-mono-tech">C:\EVO_LABS</code>:
                con carpetas organizadas para tus bitácoras técnicas, scripts automatizados de PowerShell,
                respaldos de BCD y Registro, y mediciones basales de LatencyMon. Este archivo es tu respaldo
                profesional ante cualquier cliente o empresa.
              </p>
            </div>

            {/* 3. Puente Editorial al Tomo 03 */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-black to-cyan-950/40 border border-blue-500/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech text-blue-300 font-bold uppercase tracking-wider">
                  3. PUENTE EDITORIAL // PRÓXIMO TOMO:
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/50 text-blue-300 text-[10px] font-mono-tech font-bold">
                  TOMO 03
                </span>
              </div>
              <h3 className="text-white text-base sm:text-lg font-bold uppercase font-display">
                TOMO 03 // REPARACIÓN DE PC: SISTEMA EVO LABS
              </h3>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                El dominio que adquiriste de la arquitectura del Kernel NT te posiciona en el estándar profesional:
                los mismos principios de metrología, telemetría y aislamiento de variables se aplicarán
                en el diagnóstico y resolución de fallas de encendido, cuelgues intermitentes, pantallas azules (BSOD),
                corrupción de almacenamiento y validación de hardware bajo estrés de laboratorio.
              </p>
            </div>

            {/* Final Certificate CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-zinc-400 font-sans-editorial italic">
                “El mejor optimizador de Windows es un especialista con criterio que comprende el kernel.”
              </span>
              <button
                type="button"
                onClick={onFinishTomo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>VER CERTIFICADO EVO Y PASAPORTE →</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </section>
        )}
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
