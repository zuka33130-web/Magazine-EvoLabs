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
    question: '¿Qué diferencia existe entre cambiar de unidad con "cd D:\" frente a escribir "D:" en la consola CMD?',
    options: [
      {
        label: '`cd D:\\` solo cambia el directorio activo de la unidad D:, mientras que `D:` cambia explícitamente de unidad de disco.',
        isCorrect: true,
        explanation: 'Correcto: en CMD clásico, para cambiar de volumen debes enviar el comando de letra de unidad (`D:`) o usar `cd /d`.',
      },
      {
        label: 'Son comandos idénticos que formatean el disco.',
        isCorrect: false,
        explanation: 'Falso: ninguno de estos comandos formatea discos.',
      },
      {
        label: '`cd D:\\` inicia PowerShell automáticamente.',
        isCorrect: false,
        explanation: 'Falso: `cd` es un comando interno nativo de CMD.',
      },
    ],
  },
  m15: {
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
  m16: {
    question: '¿Cuál es el procedimiento obligatorio del método EVO antes de editar cualquier clave en el Registro de Windows?',
    options: [
      {
        label: 'Exportar la rama o clave modificada a un archivo .reg de respaldo para garantizar rollback inmediato con doble clic.',
        isCorrect: true,
        explanation: 'Excelente: la reversibilidad documentada es la regla de oro de EVO LABS.',
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
  m17: {
    question: '¿Qué ventaja principal ofrece el Administrador de Tareas (Task Manager) al auditar procesos y rendimiento en Windows?',
    options: [
      {
        label: 'Permite visualizar en tiempo real el consumo exacto de CPU, memoria RAM, disco y red por proceso, además de gestionar prioridades y suspender tareas.',
        isCorrect: true,
        explanation: 'Exacto: es el centro de telemetría y control inmediato de procesos en ejecución.',
      },
      {
        label: 'Es una herramienta de desfragmentación física de discos magnéticos.',
        isCorrect: false,
        explanation: 'Falso: el Task Manager no desfragmenta discos.',
      },
      {
        label: 'Modifica directamente el sector de arranque BCD.',
        isCorrect: false,
        explanation: 'Falso: no tiene acceso al almacén de booteo.',
      },
    ],
  },
  m18: {
    question: '¿Qué función cumple el panel Services.msc y por qué es crítico evaluar las dependencias antes de deshabilitar un servicio?',
    options: [
      {
        label: 'Administra los servicios del sistema y sus tipos de inicio (Automático, Manual, Deshabilitado); evaluar dependencias evita romper servicios madre de los cuales dependen otros.',
        isCorrect: true,
        explanation: '¡Correcto! Deshabilitar un servicio crítico sin mirar dependencias puede dejar a Windows sin red o sin audio.',
      },
      {
        label: 'Es el instalador oficial de paquetes MSI de Microsoft.',
        isCorrect: false,
        explanation: 'Falso: para eso se usa msiexec.',
      },
      {
        label: 'Mide la latencia DPC de los controladores del kernel.',
        isCorrect: false,
        explanation: 'Falso: para latencia DPC se emplea LatencyMon.',
      },
    ],
  },
  m19: {
    question: '¿Para qué sirve la herramienta de Configuración del Sistema (Msconfig) en el diagnóstico de Windows?',
    options: [
      {
        label: 'Permite configurar el arranque selectivo (Safe Boot), servicios y opciones avanzadas de diagnóstico de inicio.',
        isCorrect: true,
        explanation: 'Exacto: es ideal para aislar fallas de arranque y servicios de terceros mediante inicio limpio.',
      },
      {
        label: 'Permite crear particiones GPT y formatear en NTFS.',
        isCorrect: false,
        explanation: 'Falso: para particiones se usa Administración de Discos o Diskpart.',
      },
      {
        label: 'Modifica el registro de usuarios de forma remota.',
        isCorrect: false,
        explanation: 'Falso: opera localmente sobre la configuración de booteo e inicio.',
      },
    ],
  },
  m20: {
    question: '¿Cuál es la función principal de la herramienta Administración de Discos (diskmgmt.msc)?',
    options: [
      {
        label: 'Gestionar de forma gráfica volúmenes, particiones, inicialización GPT/MBR y asignación de letras de unidad en NTFS/FAT32.',
        isCorrect: true,
        explanation: 'Correcto: provee un entorno visual estructurado para la administración de almacenamiento.',
      },
      {
        label: 'Ejecutar comandos de consola para purgar archivos temporales.',
        isCorrect: false,
        explanation: 'Falso: no purga archivos temporales.',
      },
      {
        label: 'Actualizar controladores de video de la GPU.',
        isCorrect: false,
        explanation: 'Falso: los drivers se gestionan desde el Administrador de Dispositivos.',
      },
    ],
  },
  m21: {
    question: '¿Qué comandos fundamentales de la utilidad de línea de comandos Diskpart permiten auditar el estado del almacenamiento?',
    options: [
      {
        label: 'list disk, list volume, select disk y detail disk, permitiendo una inspección precisa sin alterar datos por error.',
        isCorrect: true,
        explanation: '¡Excelente! Diskpart es la herramienta CLI estándar para la gestión pericial de discos y volúmenes.',
      },
      {
        label: 'sfc /scannow y dism /restorehealth',
        isCorrect: false,
        explanation: 'Falso: esos comandos pertenecen a la verificación y reparación de archivos del sistema.',
      },
      {
        label: 'ping y ipconfig /all',
        isCorrect: false,
        explanation: 'Falso: son comandos de diagnóstico de red.',
      },
    ],
  },
  m22: {
    question: '¿Por qué es fundamental ejecutar DISM antes de SFC cuando el sistema presenta corrupción en los archivos del sistema operativo?',
    options: [
      {
        label: 'Porque DISM repara el almacén de componentes (WinSxS) del cual SFC bebe para restaurar los binarios protegidos.',
        isCorrect: true,
        explanation: '¡Correcto! Ejecutar SFC sin reparar previamente el almacén WinSxS con DISM suele resultar en errores de reparación irreparables.',
      },
      {
        label: 'Porque DISM desfragmenta físicamente el disco mecánico y SFC acelera el procesador.',
        isCorrect: false,
        explanation: 'Falso: ninguno de los dos comandos realiza optimizaciones físicas de hardware.',
      },
      {
        label: 'Porque DISM modifica directamente las claves de arranque en el Registro SAM.',
        isCorrect: false,
        explanation: 'Falso: DISM opera sobre la imagen y el almacén de componentes del sistema.',
      },
    ],
  },
  m23: {
    question: 'Al auditar el Visor de Eventos (Event Viewer) ante un reinicio inesperado de la computadora sin pantalla azul previa, ¿qué Event ID y canal son clave?',
    options: [
      {
        label: 'Event ID 41 (Kernel-Power) en el registro de Sistema, indicando que el equipo se reinició sin un apagado limpio.',
        isCorrect: true,
        explanation: '¡Exacto! El Event ID 41 es la evidencia fundamental de cortes de energía o fallas críticas de hardware/fuente.',
      },
      {
        label: 'Event ID 0 en el registro de Seguridad.',
        isCorrect: false,
        explanation: 'Falso: el canal de seguridad audita accesos y credenciales de usuario.',
      },
      {
        label: 'Event ID 999 en el canal de Setup.',
        isCorrect: false,
        explanation: 'Falso: el canal Setup registra instalaciones de paquetes de sistema.',
      },
    ],
  },
  m24: {
    question: '¿Qué elementos componen una tarea en el Programador de Tareas (Task Scheduler) y dónde se almacenan sus descriptores?',
    options: [
      {
        label: 'Disparadores (Triggers), Acciones (Actions), Condiciones y Configuración; sus descriptores se almacenan en C:\\Windows\\System32\\Tasks como archivos XML.',
        isCorrect: true,
        explanation: 'Correcto: cada tarea programada es un archivo XML estructurado que define cuándo y cómo se ejecuta un proceso en segundo plano.',
      },
      {
        label: 'Claves binarias en la colmena HKEY_LOCAL_MACHINE\\SAM.',
        isCorrect: false,
        explanation: 'Falso: la colmena SAM almacena credenciales de cuentas de usuario.',
      },
      {
        label: 'Registros temporales en la carpeta C:\\Windows\\Temp.',
        isCorrect: false,
        explanation: 'Falso: Temp almacena temporales de instalación y ejecución.',
      },
    ],
  },
  m25: {
    question: '¿Cuáles son las fuentes principales de persistencia en el inicio automático de Windows (Autoarranque)?',
    options: [
      {
        label: 'La pestaña de inicio del Administrador de Tareas, las claves de registro Run y RunOnce, y las carpetas físicas Startup.',
        isCorrect: true,
        explanation: '¡Excelente! Conocer todas las fuentes de autoarranque permite eliminar software parásito y acelerar el encendido del equipo.',
      },
      {
        label: 'Únicamente el archivo boot.ini ubicado en la raíz del disco.',
        isCorrect: false,
        explanation: 'Falso: boot.ini se utilizaba en arquitecturas heredadas de Windows XP.',
      },
      {
        label: 'La partición EFI de recuperación.',
        isCorrect: false,
        explanation: 'Falso: la partición EFI almacena el gestor de arranque BCD.',
      },
    ],
  },
  m26: {
    question: '¿Cuál es la secuencia lógica recomendada para aislar y diagnosticar una falla de red en Windows?',
    options: [
      {
        label: 'ipconfig /all (configuración local) ➔ ping puerta de enlace ➔ ping 1.1.1.1 (salida IP) ➔ nslookup (resolución DNS) ➔ netstat -ano (conexiones activas).',
        isCorrect: true,
        explanation: '¡Correcto! Seguir esta secuencia de abajo hacia arriba en el modelo OSI permite aislar con precisión matemática cualquier problema de conectividad.',
      },
      {
        label: 'Formatear la tarjeta de red y reinstalar todos los juegos instalados en la PC.',
        isCorrect: false,
        explanation: 'Falso: reinstalar sin diagnóstico es un procedimiento arbitrario y destructivo.',
      },
      {
        label: 'Cambiar el monitor y el cable HDMI por uno de fibra óptica.',
        isCorrect: false,
        explanation: 'Falso: el monitor no interviene en la pila de protocolos de red.',
      },
    ],
  },
  m27: {
    question: '¿Qué ventaja práctica fundamental ofrecen las variables de entorno como %TEMP% o %APPDATA% en la administración de Windows?',
    options: [
      {
        label: 'Permiten acceder de forma dinámica e independiente del usuario o letra de unidad a carpetas clave del sistema y perfiles.',
        isCorrect: true,
        explanation: '¡Exacto! Las variables abstraen la ruta física exacta, facilitando scripts y navegación pericial.',
      },
      {
        label: 'Modifican el sector de arranque BCD de la partición EFI.',
        isCorrect: false,
        explanation: 'Falso: las variables de entorno son punteros de rutas lógicas, no modifican el BCD.',
      },
      {
        label: 'Desfragmentan la memoria RAM física en milisegundos.',
        isCorrect: false,
        explanation: 'Falso: no operan sobre la desfragmentación de memoria.',
      },
    ],
  },
  m28: {
    question: '¿Qué paso lógico debe realizar un administrador si necesita acceder a una carpeta protegida cuyo propietario es un usuario anterior y muestra "Acceso denegado"?',
    options: [
      {
        label: 'Tomar posesión del objeto (Take Ownership) y otorgar permisos explícitos en la ACL mediante icacls.',
        isCorrect: true,
        explanation: '¡Correcto! Cambiar la propiedad y actualizar las ACLs es el procedimiento pericial estándar ante accesos bloqueados.',
      },
      {
        label: 'Formatear el disco en formato FAT32.',
        isCorrect: false,
        explanation: 'Falso: formatear destruye los datos.',
      },
      {
        label: 'Cambiar la resolución de pantalla a 4K.',
        isCorrect: false,
        explanation: 'Falso: la resolución no afecta los permisos NTFS.',
      },
    ],
  },
  m29: {
    question: '¿Cuál es la función principal del Entorno de Recuperación de Windows (WinRE) cuando el sistema operativo principal no puede iniciar?',
    options: [
      {
        label: 'Proveer un entorno operativo de emergencia con herramientas avanzadas (CMD, restauración, desinstalación de parches) para rescatar el equipo.',
        isCorrect: true,
        explanation: '¡Correcto! WinRE es la red de seguridad del sistema para reparar fallas críticas de arranque sin perder datos.',
      },
      {
        label: 'Descargar juegos de alta gama en segundo plano.',
        isCorrect: false,
        explanation: 'Falso: WinRE es un entorno mínimo de rescate de sistema.',
      },
      {
        label: 'Formatear automáticamente todos los discos externos conectados por USB.',
        isCorrect: false,
        explanation: 'Falso: no realiza formateos automáticos destructivos.',
      },
    ],
  },
  m30: {
    question: '¿Cuál es la postura fundamental de EVO Labs frente al formateo y la reinstalación de Windows como solución a problemas de software?',
    options: [
      {
        label: 'Es el último recurso absoluto tras agotar la auditoría pericial y el aislamiento de variables, evitando destruir evidencia y perder tiempo de configuración.',
        isCorrect: true,
        explanation: '¡Correcto! El formateo indiscriminado es la derrota del análisis técnico; el perito forense investiga y repara la causa raíz.',
      },
      {
        label: 'Es la primera tarea que debe realizarse al encender cualquier computadora por primera vez en el día.',
        isCorrect: false,
        explanation: 'Falso: sería un procedimiento absurdo e innecesario.',
      },
      {
        label: 'Es un procedimiento ilegal penado por las leyes internacionales de software.',
        isCorrect: false,
        explanation: 'Falso: no es ilegal, pero representa la falta de diagnóstico técnico.',
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
      resolution: 'Instalación del paquete oficial AMD Chipset Drivers con el controlador 3D V-Cache Performance Optimizer y reinicio. Stuttering eliminado y frametimes estables.',
    },
    practiceDetails: {
      objective: 'Verificar la integridad matemática bit a bit de cualquier archivo o instalador mediante hash SHA-256.',
      dataType: 'SYSTEM_REPORTED',
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
      rootCause: 'El archivo en escritura quedó trunco, pero la estructura del volumen se mantuvo íntegra gracias al diario transaccional.',
      resolution: 'Al reiniciar, el driver de NTFS leyó el archivo $LogFile de forma inmediata (fracción de segundo), descartó la transacción atómica incompleta y montó el disco sin necesidad de chkdsk.',
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
      dataType: 'SYSTEM_REPORTED',
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
    hookQuestion: 'Abrís la consola clásica de comandos (CMD) y sentís que es una herramienta obsoleta de los años 80, o intentás cambiar de unidad escribiendo "cd D:\\" y te quedás atrapado en la misma carpeta. ¿Cuál es el mapa mental y sintáctico exacto de CMD?',
    simpleAnalogy: 'CMD es como una máquina de escribir clásica (solo escupe texto plano línea por línea y procesa cadenas de caracteres sin tipado de datos). Para cambiar de disco necesitas ingresar la letra de la unidad directamente (ej. D:) o usar el modificador /d.',
    evoExplains: 'CMD (cmd.exe) es el intérprete de comandos heredado de MS-DOS. Aunque PowerShell ofrece capacidades de objetos .NET muy superiores, CMD sigue siendo indispensable en scripts batch rápidos y en entornos de rescate de bajo nivel (WinRE, consola de recuperación y bcdboot). Su limitación principal es que no maneja objetos estructurados, sino texto plano frágil.',
    mythVsReality: {
      myth: 'CMD ya no sirve para nada en Windows moderno y todo debe hacerse con interfaz gráfica.',
      reality: 'Muchas herramientas críticas de recuperación (diskpart, bcdedit, sfc, dism, netsh) operan nativamente desde CMD y son la primera línea de defensa cuando el sistema operativo no levanta el entorno gráfico.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE CMD: NAVEGACIÓN, MANIPULACIÓN Y REDIRECCIÓN DE FLUJOS',
      items: [
        '1. Cambio de Unidad y Directorio: `cd /d D:\\Ruta` cambia de volumen y directorio simultáneamente; escribir solo `D:` cambia el directorio activo de la unidad D: sin saltar a ella.',
        '2. Manipulación de Archivos: `mkdir`, `copy`, `move`, `del` (elimina sin enviar a la Papelera de Reciclaje) y `type` (muestra contenido de texto plano).',
        '3. Redirección Estándar: Operador `>` (sobrescribe salida estándar STDOUT), `>>` (añade al final) y `2>` (captura canales de error STDERR).',
        '4. Diagnóstico de Red y Sistema: `ipconfig /all`, `ping`, `tracert`, `netstat -ano` para correlacionar puertos TCP con Process IDs (PID).',
      ],
    },
    diagramTitle: 'SINTAXIS Y REDIRECCIÓN EN CMD // FLUJO DE TEXTO PLANO',
    diagramDescription: 'Esquema de funcionamiento del intérprete de comandos cmd.exe y redirección de flujos STDOUT y STDERR.',
    diagramPendingNote: '',
    evoCase: {
      title: 'El Script Batch que Borró la Raíz del Disco por Falta de Comillas',
      victim: 'Servidor de archivos en estudio contable',
      symptom: 'Script de respaldo nocturno borró carpetas equivocadas.',
      initialHypothesis: 'Infección por ransomware.',
      rootCause: 'Uso de rutas con espacios sin comillas dobles en comandos de consola CMD antigua.',
      resolution: 'Uso obligatorio de comillas dobles en rutas y migración a PowerShell para tareas complejas.',
    },
    practiceDetails: {
      objective: 'Navegar por el árbol de directorios de Windows y generar un reporte de red redirigido mediante CMD.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Actualización del prompt de consola y creación del archivo de salida.',
      steps: [
        '1. Abrí CMD (Ejecutar -> cmd).',
        '2. Ejecutá `cd /d C:\\Windows` y listá los archivos con `dir /a`.',
        '3. Generá un reporte de red silencioso: `ipconfig /all > %TEMP%\\red_cmd.txt 2>&1`.',
      ],
      interpretation: 'Demuestra el dominio de los comandos heredados de consola y la redirección de flujos estándar.',
      howToRollback: 'Inocuo. No modifica datos del sistema.',
    },
  },
  m15: {
    hookQuestion: '¿Por qué la automatización moderna de Windows exige abandonar el texto plano y adoptar el Pipeline de Objetos .NET en PowerShell?',
    simpleAnalogy: 'CMD es como una máquina de escribir clásica; PowerShell es una cinta transportadora industrial inteligente que traslada cajas etiquetadas con códigos de barras (objetos tipados con propiedades de memoria y métodos invocables).',
    evoExplains: 'PowerShell transmite objetos estructurados .NET a través del pipeline, permitiendo filtrar propiedades sin parsear cadenas de texto. Su sintaxis estándar Verbo-Sustantivo (Get-Command, Get-Process) garantiza predictibilidad y potencia en la administración de sistemas.',
    mythVsReality: {
      myth: 'PowerShell es inseguro y requiere abrir permisos totales (Unrestricted) para funcionar.',
      reality: 'El estándar de taller seguro es RemoteSigned, que protege la ejecución de scripts no firmados descargados de internet.',
    },
    technicalDeepDive: {
      title: 'POWERSHELL: OBJETOS .NET, PIPELINE Y CONVENCIÓN VERB-NOUN',
      items: [
        '1. Objetos Tipados vs Texto Plano: Get-Process devuelve instancias de System.Diagnostics.Process con propiedades accesibles como WorkingSet64 y CPU.',
        '2. Sintaxis Verbo-Sustantivo: Get, Set, New, Remove, Stop, Start seguidos de un sustantivo en singular.',
        '3. El Pipeline (|): Encadenamiento de cmdlets para filtrar y manipular datos en memoria sin archivos temporales.',
        '4. ExecutionPolicy: Restricted, RemoteSigned, Bypass.',
      ],
    },
    diagramTitle: 'PIPELINE DE OBJETOS .NET EN POWERSHELL',
    diagramDescription: 'Flujo de objetos tipados entre Get-Process, Where-Object y Select-Object.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Auditoría de Puertos TCP con PowerShell',
      victim: 'Estación de desarrollo web',
      symptom: 'Puerto 80 ocupado por proceso desconocido.',
      initialHypothesis: 'Ataque externo.',
      rootCause: 'Servicio IIS Express colgado.',
      resolution: 'Get-NetTCPConnection -State Listen | Select LocalPort, OwningProcess.',
    },
    practiceDetails: {
      objective: 'Consultar procesos activos y su consumo de memoria usando objetos .NET en PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Propiedades tipadas del proceso.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá `Get-Process explorer | Select ProcessName, WorkingSet64`.',
      ],
      interpretation: 'Muestra el acceso directo a atributos del kernel sin parseo de texto.',
      howToRollback: 'Inocuo.',
    },
  },
  m16: {
    hookQuestion: 'Dicen que tocar el Registro de Windows es como operar a corazón abierto sin anestesia: un valor mal cambiado y la PC entra en bucle infinito de reinicios. ¿Cómo funciona esta base de datos por dentro y cómo intervenirla con seguridad pericial absoluta?',
    simpleAnalogy: 'El archivo de ADN del sistema: un árbol jerárquico de carpetas (claves) y variables (valores). Si conocés la ruta exacta y tenés guardado el antídoto (archivo .reg de respaldo), el riesgo es exactamente cero. (Nota: Se conserva la referencia histórica de telemetría diagnóstica en el deep dive como material complementario de auditoría de políticas).',
    evoExplains: 'El Registro de Windows (regedit.exe) es una base de datos jerárquica indexada en memoria que almacena la configuración del kernel, controladores y servicios a partir de archivos binarios llamados Colmenas (Hives), ubicados en C:\\Windows\\System32\\config\\ y NTUSER.DAT en cada perfil de usuario.',
    mythVsReality: {
      myth: 'Usar programas "Limpiadores de Registro" acelera la computadora eliminando claves obsoletas.',
      reality: 'Los limpiadores de registro automáticos suelen borrar entradas COM/CLSID activas, rompiendo Office, menús contextuales y dependencias del sistema.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE COLMENAS (HIVES), TIPOS DE DATOS Y PROTOCOLO DE ROLLBACK',
      items: [
        '1. Árboles Raíz: HKLM, HKCU, HKCR, HKU, HKCC.',
        '2. Mapeo Físico: Archivos hives en System32\\config y NTUSER.DAT.',
        '3. Tipos de Datos: REG_SZ, REG_DWORD, REG_BINARY.',
        '4. Protocolo de Respaldo EVO: Exportar clave a .reg antes de modificar y restaurar con doble clic o reg.exe import.',
        '5. Referencia Complementaria (Telemetría y Diagnóstico): Configuración de AllowTelemetry en HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection para auditoría de políticas corporativas sin debloaters destructivos.',
      ],
    },
    diagramTitle: 'MAPEO FÍSICO DE COLMENAS Y RESPALDO .REG',
    diagramDescription: 'Esquema de correlación entre ramas lógicas y archivos binarios Hives.',
    diagramPendingNote: '',
    evoCase: {
      title: 'La Pantalla Azul Inaccessible Boot Device por un Limpiador de Registro',
      victim: 'Estación de trabajo contable',
      symptom: 'BSOD Inaccessible Boot Device tras limpieza de registro.',
      initialHypothesis: 'Disco SSD roto.',
      rootCause: 'El limpiador borró entradas del controlador storahci.',
      resolution: 'Carga offline de la colmena SYSTEM y restauración de respaldo .reg.',
    },
    practiceDetails: {
      objective: 'Exportar respaldo de seguridad de clave de registro antes de modificar parámetros.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Creación del archivo .reg en el escritorio.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá `reg.exe export "HKCU\\Control Panel\\Desktop" "$HOME\\Desktop\\Backup_Desktop_EVO.reg" /y`.',
      ],
      interpretation: 'Garantiza reversibilidad atómica y control pericial absoluto.',
      howToRollback: 'Doble clic en Backup_Desktop_EVO.reg para restaurar.',
    },
  },
  m17: {
    hookQuestion: 'Una PC experimenta congelamientos aleatorios y el ventilador suena al máximo. Al abrir el Administrador de Tareas, un proceso desconocido consume el 99% de la CPU. ¿Cómo se audita, identifica y neutraliza este consumo?',
    simpleAnalogy: 'El panel de control general de una fábrica: el Administrador de Tareas es la pantalla central donde ves en tiempo real cuántos obreros (hilos de CPU) trabajan en cada máquina, cuánta materia prima (RAM) consume cada sector y quién está bloqueando la línea de producción.',
    evoExplains: 'El Administrador de Tareas (Task Manager) es el centro de telemetría de procesos y rendimiento en modo usuario (Ring 3). Permite auditar el uso de CPU, Memoria, Disco, Red y GPU por proceso e hilo, gestionar prioridades de ejecución, suspender aplicaciones en segundo plano y analizar los programas configurados en el arranque (Startup). Conocer sus pestañas principales (Procesos, Rendimiento, Historial de aplicaciones, Inicio, Usuarios y Detalles) es el primer paso obligatorio antes de cualquier intervención de optimización.',
    mythVsReality: {
      myth: 'Cerrar procesos al azar en el Administrador de Tareas hace que la PC funcione más rápido y libera memoria permanente.',
      reality: '¡Error crítico! Matar servicios del sistema (como csrss.exe o svchost.exe crítico) puede provocar un pantallazo azul inmediato (BSOD) o corromper sesiones activas. La gestión requiere identificar el PID y el árbol de procesos origen.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE PROCESOS, HILOS Y RENDIMIENTO EN TASKMGR',
      items: [
        '1. Procesos vs Hilos (Threads): Un proceso es un contenedor de recursos (espacio de memoria virtual, handles); los hilos son las unidades de ejecución secuencial que la CPU procesa en los núcleos lógicos.',
        '2. Pestaña Rendimiento (Performance): Métricas en vivo de Reloj Base, Cores/Logical Processors, Handles activos, Threads totales y tiempo de actividad (Uptime).',
        '3. Pestaña Inicio (Startup Impact): Auditoría de entradas de registro y carpetas Run/RunOnce que impactan en el tiempo de arranque (Last BIOS Time).',
        '4. Prioridades de CPU (Base Priority): Niveles Realtime, High, Above Normal, Normal, Below Normal y Low gestionados por el planificador del kernel.',
        '5. Análisis de I/O y Memoria: Diferenciación métrica entre Working Set (RAM física residente) y Commit Charge (memoria virtual asignada).',
      ],
    },
    diagramTitle: 'ANATOMÍA DEL ADMINISTRADOR DE TAREAS Y JERARQUÍA DE PROCESOS',
    diagramDescription: 'Esquema de la estructura de procesos padre/hijo, auditoría de consumo de recursos y árbol de hilos en Task Manager.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #017 — El Proceso Fantasma con Consumo Oculto de CPU',
      victim: 'Estación de trabajo de diseño — Intel Core i7, 32GB RAM',
      symptom: 'La PC mantenía los ventiladores al 100% incluso sin aplicaciones abiertas en el escritorio.',
      initialHypothesis: 'Falla térmica del disipador o presencia de un troyano avanzado.',
      rootCause: 'Al abrir el Administrador de Tareas (Ctrl + Shift + Esc) y ordenar por uso de CPU, se detectó un proceso legítimo de actualización atrapado en un bucle de reintento de descargas que lanzaba múltiples hilos huérfanos.',
      resolution: 'Se finalizó el árbol de procesos desde los detalles del Task Manager y se reinició el servicio dependiente. El consumo de CPU bajó del 98% al 2% en reposo.',
    },
    practiceDetails: {
      objective: 'Auditar los procesos activos con mayor consumo de recursos y examinar el impacto de inicio en el Administrador de Tareas.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Procesos con mayor porcentaje de CPU/RAM y listado de programas de inicio con su impacto medido.',
      steps: [
        '1. Presioná Ctrl + Shift + Esc para abrir el Administrador de Tareas.',
        '2. Hacé clic en "Más detalles" si está en vista compacta y seleccioná la pestaña "Procesos".',
        '3. Ordená las columnas haciendo clic en "CPU" y "Memoria" para identificar a los mayores consumidores.',
        '4. Navegá a la pestaña "Inicio" para auditar qué programas retrasan el arranque del sistema.',
      ],
      interpretation: 'Permite detectar en segundos aplicaciones parásitas o mineros ocultos sin instalar software de terceros.',
      howToRollback: 'Herramienta nativa de consulta y control; no altera configuraciones permanentes al solo inspeccionar.',
    },
  },
  m18: {
    hookQuestion: '¿Por qué al conectar una impresora o intentar compartir archivos en red local aparece un error inesperado, descubriendo que un servicio fundamental estaba deshabilitado?',
    simpleAnalogy: 'Los empleados invisibles de un edificio: los servicios de Windows (Services.msc) son programas que corren en segundo plano sin ventana gráfica, encargados de encender la red, la impresión, el audio y la seguridad. Si despedís a uno por error sin mirar a quién asistía, todo el departamento colapsa.',
    evoExplains: 'El Administrador de Servicios (services.msc) controla el ciclo de vida de los servicios del sistema operativo y de aplicaciones de terceros ejecutados por el Administrador de Control de Servicios (SCM - Service Control Manager). Cada servicio posee un tipo de inicio: Automático (arranca con el kernel), Manual (arranca cuando se le solicita) o Deshabilitado (bloqueado). Modificar servicios sin auditar sus dependencias (pestaña Dependencias) es la causa número uno de rotura de conectividad y periféricos en Windows.',
    mythVsReality: {
      myth: 'Deshabilitar 100 servicios de Windows en services.msc hace que la computadora sea un 50% más rápida.',
      reality: 'Falso y peligroso. Muchos servicios aparentemente innecesarios son requeridos por Windows Update, Microsoft Store, Wi-Fi o Bluetooth. Deshabilitarlos a ciegas rompe características esenciales del sistema.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DEL SCM (SERVICE CONTROL MANAGER) Y TIPOS DE INICIO',
      items: [
        '1. El SCM (services.exe): Subsistema crítico que mantiene la base de datos de servicios y gestiona sus estados (Running, Stopped, Paused).',
        '2. Tipos de Inicio: Automatic (Delayed Start evita saturar el disco en el arranque), Manual (Trigger Start activa el servicio sólo cuando ocurre un evento de hardware o red) y Disabled.',
        '3. Cuentas de Servicio: LocalSystem (privilegios totales de kernel), LocalService y NetworkService (cuentas con privilegios de red limitados).',
        '4. Auditoría de Dependencias: Relación madre-hijo entre servicios. Si el servicio de red depende de NLA (Network Location Awareness), detener NLA corta la conectividad.',
        '5. Control CLI con SC y Net: Gestión de servicios por consola mediante net start / net stop y sc query.',
      ],
    },
    diagramTitle: 'ARQUITECTURA SCM Y MAPA DE DEPENDENCIAS DE SERVICIOS',
    diagramDescription: 'Diagrama del Service Control Manager, estados de ejecución y jerarquía de dependencias entre servicios del sistema.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #018 — La Red Local Rota por un Servicio Deshabilitado',
      victim: 'PC de oficina con acceso a carpetas compartidas corporativas.',
      symptom: 'La máquina no ve ninguna computadora en la red local y da error de protocolo SMB.',
      initialHypothesis: 'Placa de red quemada o antena Wi-Fi defectuosa.',
      rootCause: 'Un optimizador automático había desactivado el servicio "Estación de trabajo" (LanmanWorkstation) y "Función de descubrimiento de recursos".',
      resolution: 'Se abrió services.msc, se cambió el tipo de inicio de Manual a Automático en LanmanWorkstation y se inició el servicio con el botón Play. La red local quedó restaurada al instante.',
    },
    practiceDetails: {
      objective: 'Inspeccionar los servicios del sistema mediante services.msc y consultar su estado y dependencias.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de servicios, estado de ejecución, tipo de inicio y servicios dependientes.',
      steps: [
        '1. Presioná Win + R, escribí services.msc y presioná Enter.',
        '2. Buscá el servicio "Windows Update" (wuauserv) o "Spooler de impresión" (Spooler).',
        '3. Hacé doble clic sobre él para abrir sus Propiedades.',
        '4. Examiná la pestaña "Dependencias" para conocer qué servicios secundarios requiere para funcionar.',
      ],
      interpretation: 'Permite comprender el árbol lógico de servicios antes de aplicar cualquier modificación correctiva.',
      howToRollback: 'Consulta de solo lectura; no modifica estados de servicios si no se pulsa explícitamente Detener o Cambiar inicio.',
    },
  },
  m19: {
    hookQuestion: '¿Cómo se aísla un conflicto de software en el arranque cuando una aplicación mal instalada congela Windows justo antes de mostrar el escritorio?',
    simpleAnalogy: 'El modo de prueba de un avión: si los instrumentos fallan en vuelo, el piloto activa los sistemas mínimos de emergencia (Modo Seguro / Arranque Limpio) para volar con lo justo y necesario descartando interferencias externas.',
    evoExplains: 'La utilidad de Configuración del Sistema (Msconfig.exe) es la herramienta clásica de diagnóstico para controlar las opciones de booteo y servicios del sistema operativo. Permite configurar el Arranque Selectivo, habilitar el Modo Seguro (Safe Boot con opciones Minimal o Network), limitar la cantidad de núcleos en pruebas de estrés y realizar un "Arranque Limpio" (Clean Boot) deshabilitando todos los servicios de terceros de MSCONFIG ➔ Servicios para aislar conflictos de software con precisión quirúrgica.',
    mythVsReality: {
      myth: 'Marcar la casilla "Cantidad de procesadores" en Msconfig ➔ Opciones avanzadas de arranque hace que la PC use todos sus núcleos y arranque más rápido.',
      reality: '¡Mito falso! Por defecto, Windows ya utiliza todos los núcleos disponibles en el arranque. Forzar ese valor en msconfig solo sirve para limitar artificialmente los núcleos en pruebas de diagnóstico.',
    },
    technicalDeepDive: {
      title: 'DIAGNOSTICO DE ARRANQUE Y MODOS SEGUROS EN MSCONFIG',
      items: [
        '1. Pestaña General: Selección entre Inicio Normal, Diagnóstico e Inicio Selectivo.',
        '2. Pestaña Arranque (Boot): Opciones de Safe Boot (Minimal carga drivers básicos de VGA y almacenamiento; Network añade red TCP/IP).',
        '3. Tiempos de Espera (Timeout): Configuración del temporizador del menú de selección de sistemas operativos.',
        '4. Pestaña Servicios (Services): Casilla "Ocultar todos los servicios de Microsoft" para auditar y desactivar software de terceros de forma masiva.',
        '5. Integración con Task Manager: En Windows 10/11, la gestión de programas de inicio se delegó al Administrador de Tareas.',
      ],
    },
    diagramTitle: 'MATRIZ DE CONFIGURACIÓN DE MSCONFIG Y ARRANQUE SEGURO',
    diagramDescription: 'Esquema de las opciones de booteo, arranque limpio y filtrado de servicios de terceros en Msconfig.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #019 — El Arranque Congelado por un Antivirus Desactualizado',
      victim: 'PC de escritorio que se quedaba congelada en la pantalla de bienvenida con círculos giratorios.',
      symptom: 'Imposible llegar al escritorio en modo normal, pero arrancaba correctamente al apagar forzadamente 3 veces.',
      initialHypothesis: 'Disco rígido dañado o corrupción severa de la partición C:.',
      rootCause: 'Un driver de filtro de un antivirus antiguo había quedado corrupto tras una actualización fallida, bloqueando el hilo de inicio de sesión.',
      resolution: 'Se ingresó a WinRE ➔ Símbolo del sistema, se ejecutó msconfig (o se renombró el servicio en el registro) para realizar un inicio limpio, aislando y desinstalando el driver defectuoso. El equipo recuperó su arranque normal.',
    },
    practiceDetails: {
      objective: 'Inspeccionar las opciones de configuración de arranque y servicios en la herramienta Msconfig.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Pestañas de Arranque, Servicios con filtrado de Microsoft y opciones de tiempo de espera.',
      steps: [
        '1. Presioná Win + R, escribí msconfig y presioná Enter.',
        '2. Observá la pestaña "General" y las opciones de inicio.',
        '3. Hacé clic en la pestaña "Servicios", tildá la casilla "Ocultar todos los servicios de Microsoft" para ver qué software de terceros opera en segundo plano.',
        '4. Hacé clic en Cancelar para salir sin realizar cambios.',
      ],
      interpretation: 'Permite auditar el ecosistema de servicios no nativos que interactúan con el kernel durante el arranque.',
      howToRollback: 'Inspección sin cambios; al cancelar o cerrar no se modifica ninguna opción del sistema.',
    },
  },
  m20: {
    hookQuestion: '¿Cómo se estructuran lógicamente los discos y particiones en Windows, y qué diferencia hay entre inicializar una unidad en esquema GPT o MBR?',
    simpleAnalogy: 'Un terreno baldío y su mensura: antes de construir una casa (guardar archivos), tenés que mensurar el terreno, levantar cercos perimetrales (particiones) y armar el sistema de cañerías y pisos (formateo en NTFS o exFAT). Administración de Discos es el plano maestro de mensura visual.',
    evoExplains: 'La consola de Administración de Discos (diskmgmt.msc) es la herramienta gráfica oficial para la gestión de almacenamiento en Windows. Permite inicializar nuevos discos físicos en esquemas GPT (GUID Partition Table, moderno para UEFI) o MBR (Master Boot Record, legado), crear y redimensionar volúmenes lógicos, formatear en sistemas de archivos NTFS, FAT32 o exFAT, cambiar letras de unidad y verificar el estado de salud de las particiones (Sistema, Arranque, Activa, Correcto).',
    mythVsReality: {
      myth: 'Redimensionar o achicar la partición C: con Administración de Discos borra automáticamente todos los programas instalados.',
      reality: 'Falso. Reducir un volumen (Shrink Volume) opera sobre el espacio libre no asignado del sistema de archivos NTFS sin tocar los archivos de usuario ni las aplicaciones existentes, siempre que no haya fragmentación severa.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE ALMACENAMIENTO: GPT, MBR Y VOLÚMENES NTFS',
      items: [
        '1. GPT vs MBR: GPT soporta discos mayores a 2TB, particiones ilimitadas teóricas y redundancia de tabla de partición; MBR está limitado a 2TB y 4 particiones primarias.',
        '2. Estados de Volumen: En línea (Online), Sin conexión (Offline), Correcto (Healthy), En riesgo (At Risk) y No inicializado.',
        '3. Particiones Críticas: Partición ESP (EFI System Partition), Partición MSR (Microsoft Reserved), Partición C: (Sistema operativo) y Partición de Recuperación (WinRE).',
        '4. Asignación de Letras y Montaje: Capacidad de montar particiones NTFS directamente dentro de carpetas vacías sin requerir letra de unidad.',
        '5. Restricciones Gráficas: diskmgmt.msc no puede extender particiones si hay un volumen de recuperación bloqueando el espacio contiguo a la derecha.',
      ],
    },
    diagramTitle: 'MAPA DE DISCO EN DISKMGMT.MSC: PARTICIONES GPT Y VOLÚMENES NTFS',
    diagramDescription: 'Esquema visual de la distribución de particiones en diskmgmt.msc (ESP, C:, Recuperación) y bloques lógicos.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #020 — El Espacio No Asignado que no se dejaba extender',
      victim: 'PC de taller con un SSD de 1TB donde se clonó una partición de 500GB y quedaban 500GB sin usar.',
      symptom: 'Al hacer clic derecho sobre la unidad C: en Administración de Discos, la opción "Extender volumen" aparecía gris y deshabilitada.',
      initialHypothesis: 'El sistema de archivos estaba dañado o el SSD no soportaba más capacidad.',
      rootCause: 'Entre el volumen C: y el espacio no asignado se encontraba ubicada una partición de recuperación (Recovery) de 800MB creada por el fabricante, bloqueando el espacio contiguo.',
      resolution: 'Mediante herramientas de particionado avanzadas, se reubicó la partición de recuperación al final del disco (o se eliminó de forma segura), permitiendo que la opción "Extender volumen" se active y absorba todo el espacio libre en C:. Cero pérdida de datos.',
    },
    practiceDetails: {
      objective: 'Inspeccionar los discos físicos, particiones lógicas y esquemas GPT/MBR mediante la consola diskmgmt.msc.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Estado de los discos (Disco 0, Disco 1...), tipos de partición (EFI, Primaria, Recuperación) y sistemas de archivos.',
      steps: [
        '1. Presioná Win + R, escribí diskmgmt.msc y presioná Enter.',
        '2. Observá la sección inferior para identificar tus discos físicos y su esquema de partición (clic derecho en el disco ➔ Propiedades ➔ Volumen ➔ Estilo de partición: GPT o MBR).',
        '3. Inspeccioná los bloques de partición asignados a C: y las particiones ocultas del sistema.',
        '4. Cerrá la consola sin realizar ninguna modificación.',
      ],
      interpretation: 'Permite auditar con precisión la topología de almacenamiento de la máquina antes de realizar clonaciones o particionados.',
      howToRollback: 'Consola de inspección visual; no aplica cambios automáticos.',
    },
  },
  m21: {
    hookQuestion: '¿Por qué los ingenieros y técnicos avanzados prefieren la línea de comandos de Diskpart por sobre cualquier interfaz gráfica para reparar o preparar particiones de arranque?',
    simpleAnalogy: 'Una sierra mecánica de precisión contra una tijera escolar: la interfaz gráfica es cómoda para tareas sencillas, pero cuando un disco está bloqueado, sin letra asignada o con tablas corruptas, Diskpart es el bisturí láser que permite operar con control absoluto y sin errores de interfaz.',
    evoExplains: 'Diskpart.exe es el intérprete de comandos nativo de Windows para la gestión avanzada de discos, particiones y volúmenes a nivel de bajo nivel. Es la herramienta estándar utilizada en entornos de rescate WinRE y scripts de despliegue automatizado. Con comandos clave como list disk, select disk X, list volume, select volume Y, assign letter=S y clean, el técnico perito puede limpiar tablas de partición defectuosas, montar particiones ESP invisibles para reparar el arranque y gestionar volúmenes de manera rápida y segura.',
    mythVsReality: {
      myth: 'Ejecutar el comando "clean" en Diskpart borra únicamente la papelera de reciclaje del disco seleccionado.',
      reality: '¡Peligro extremo! El comando "clean" borra la tabla de particiones completa del disco seleccionado en milisegundos, convirtiéndolo en espacio no asignado. Debe usarse con extrema precaución y siempre habiendo seleccionado el disco correcto.',
    },
    technicalDeepDive: {
      title: 'SINTAXIS MAESTRA DE DISKPART: COMANDOS Y PROTOCOLO DE SEGURIDAD',
      items: [
        '1. list disk: Muestra todos los discos físicos conectados enumerados desde 0, indicando tamaño y espacio libre disponible.',
        '2. select disk <N>: Establece el foco operativo sobre el disco físico N. Todos los comandos subsiguientes afectarán a este disco.',
        '3. list volume / list partition: Muestra los volúmenes lógicos o particiones del disco seleccionado actualmente.',
        '4. detail disk / detail partition: Revela información forense detallada, incluyendo números de serie, GUID y letras de unidad asignadas.',
        '5. assign letter=<L>: Asigna una letra temporal (ej. S:) a particiones ocultas del sistema como la partición ESP para acceder a los archivos BCD.',
      ],
    },
    diagramTitle: 'FLUJO DE COMANDOS EN DISKPART PARA ASIGNACIÓN Y RESCATE',
    diagramDescription: 'Secuencia de comandos CLI en Diskpart para listar discos, enfocar volúmenes ocultos y asignar letras de acceso.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #021 — El Rescate de la Partición ESP Oculta con Diskpart',
      victim: 'PC de taller con arranque dañado tras actualización de firmware BIOS.',
      symptom: 'El sistema no bootea y la partición de arranque ESP no tiene letra de unidad visible en el Explorador.',
      initialHypothesis: 'Se requiere formatear el disco completo.',
      rootCause: 'La partición EFI estaba intacta pero sin letra asignada, por lo que bcdboot no podía escribir los archivos de configuración.',
      resolution: 'Se ejecutó diskpart ➔ list disk ➔ select disk 0 ➔ list partition ➔ select partition 2 (ESP de 100MB) ➔ assign letter=S:. Con la partición accesible como unidad S:, se reparó el BCD exitosamente en segundos.',
    },
    practiceDetails: {
      objective: 'Ejecutar consultas de solo lectura en Diskpart para listar discos y volúmenes conectados de forma segura.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de discos físicos, estados en línea y volúmenes lógicos con sus respectivas letras y formatos.',
      steps: [
        '1. Abrí CMD o PowerShell como Administrador.',
        '2. Escribí diskpart y presioná Enter para ingresar al intérprete.',
        '3. Ejecutá list disk para observar los discos conectados.',
        '4. Ejecutá list volume para ver las particiones activas y escribí exit para salir de forma segura.',
      ],
      interpretation: 'Demuestra el uso fluido del entorno CLI de bajo nivel sin correr riesgos de borrado gracias a comandos de solo lectura.',
      howToRollback: 'Comandos de consulta pura (list); no ejecutan operaciones de escritura ni alteran particiones.',
    },
  },
  m22: {
    hookQuestion: 'Cuando Windows corrompe archivos del sistema por un apagón o un controlador defectuoso, ejecutar comandos a ciegas como sfc /scannow suele fallar con el mensaje "Protección de recursos de Windows no pudo reparar los archivos dañados": ¿por qué ocurre y cuál es el protocolo profesional correcto?',
    simpleAnalogy: 'Intentar reparar archivos de sistema dañados con SFC cuando el almacén de componentes (WinSxS) también está corrupto es como intentar reparar un libro roto usando páginas de un diccionario impreso en otro idioma; las piezas no coinciden. DISM repara primero la fuente de donde bebe SFC (el almacén WinSxS), y luego SFC repara los archivos individuales del sistema.',
    evoExplains: 'El tridente de reparación de integridad de Windows (DISM, SFC y CHKDSK) opera en distintas capas del almacenamiento y el sistema operativo. CHKDSK escanea la integridad lógica y física del sistema de archivos NTFS en los sectores del disco. DISM (Deployment Image Servicing and Management) repara la imagen base del sistema y el almacén WinSxS utilizando la línea online o una fuente ISO limpia. SFC (System File Checker) escanea los binarios protegidos comparándolos con el almacén local. El protocolo EVO exige respetar estrictamente el orden de intervención: 1) CHKDSK si hay errores de I/O o corrupción de volumen; 2) DISM /Online /Cleanup-Image /RestoreHealth para reparar WinSxS; 3) SFC /scannow para restaurar los binarios del sistema operativo.',
    mythVsReality: {
      myth: 'Ejecutar sfc /scannow una vez al mes acelera la computadora y limpia los virus.',
      reality: 'SFC no es un limpiador ni un antivirus; es un verificador de integridad de binarios firmados por Microsoft. Si no hay archivos de sistema corrompidos, no produce cambios de velocidad.',
    },
    technicalDeepDive: {
      title: 'EL TRIDENTE DE REPARACIÓN: CHKDSK, DISM Y SFC EN PROFUNDIDAD',
      items: [
        'CHKDSK /f /r: Corrige errores de asignación de archivos (f) y localiza sectores dañados recuperando información legible (r). En discos SSD modernos con TRIM, las operaciones de sectores dañados son gestionadas por el controlador FTL interno.',
        'DISM RestoreHealth: Conecta con Windows Update o una imagen WIM montada para rellenar los hashes criptográficos corrompidos en C:\\Windows\\WinSxS.',
        'SFC /scannow: Compara hashes de C:\\Windows\\System32 con las copias resguardadas en WinSxS.',
        'Bitácora CBS.log: Archivo donde se registran detalladamente los fallos y reparaciones de SFC y DISM (ubicado en C:\\Windows\\Logs\\CBS\\CBS.log).',
      ],
    },
    diagramTitle: 'FLUJO DE REPARACIÓN INTEGRAL: DISK ➔ IMAGE STORE ➔ SYSTEM FILES',
    diagramDescription: 'Diagrama de flujo del protocolo de saneamiento de Windows: CHKDSK (volumen) ➔ DISM (almacén WinSxS) ➔ SFC (binarios protegidos).',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #022 — Bucle de Errores SFC Irreparables tras Pantalla Azul por Corte de Luz',
      victim: 'PC de Oficina — Windows 11 Pro, SSD NVMe 500GB',
      symptom: 'El usuario sufrió un apagón repentino y al encender la PC las aplicaciones de Office y Edge crasheaban al instante. Al ejecutar sfc /scannow, el sistema indicaba: "Protección de recursos de Windows encontró archivos dañados pero no pudo reparar algunos de ellos".',
      initialHypothesis: 'El sistema operativo estaba totalmente destruido y requería formateo completo.',
      rootCause: 'El corte de luz interrumpió una escritura en el almacén de componentes WinSxS, dejando metadatos inconsistentes que SFC no podía reparar por cuenta propia.',
      resolution: 'Se ejecutó Dism.exe /Online /Cleanup-Image /RestoreHealth para reconstruir el almacén WinSxS corrompido, y posteriormente se lanzó sfc /scannow. El comando completó el saneamiento al 100% y todas las aplicaciones recuperaron su estabilidad sin perder datos ni configuraciones.',
    },
    practiceDetails: {
      objective: 'Ejecutar el diagnóstico y verificación de integridad del sistema con SFC y DISM desde PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Resultados del escaneo de integridad de archivos y porcentaje de progreso del almacén de componentes.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá la verificación de archivos del sistema sin reparar: sfc /verifyonly.',
        '3. Ejecutá el diagnóstico del almacén con DISM: Dism.exe /Online /Cleanup-Image /CheckHealth.',
        '4. Analizá el informe devuelto en consola para determinar si el almacén requiere restauración.',
      ],
      interpretation: 'Permite auditar el estado de salud de los binarios del sistema operativo de forma segura y no intrusiva antes de aplicar operaciones de reparación.',
      howToRollback: 'Operación de solo lectura (/verifyonly y /checkHealth); no modifica archivos ni requiere reversión.',
    },
  },
  m23: {
    hookQuestion: 'Cuando ocurre un fallo intermitente de hardware o servicio que no deja rastro en pantalla, ¿dónde almacena Windows la evidencia forense exacta del momento del incidente?',
    simpleAnalogy: 'El Visor de Eventos (Event Viewer) es la caja negra y el tacógrafo de un avión comercial: registra absolutamente cada despegue, alerta de presión, fallo de motor y acción del piloto con marca temporal exacta, permitiendo reconstruir el accidente milisegundo a milisegundo.',
    evoExplains: 'El Visor de Eventos (eventvwr.msc) centraliza los registros estructurados en archivos binarios .evtx ubicados en C:\\Windows\\System32\\Winevt\\Logs. Se divide en canales principales: Application (software y servicios de terceros), System (controladores, kernel y servicios de Windows), Security (auditoría de accesos y credenciales) y Setup (instalaciones de paquetes). Para un perito de EVO Labs, los registros masivos son ruido inútil si no se utilizan Event IDs específicos (por ejemplo, Event ID 41 para Kernel-Power indicando apagado inesperado sin BSOD previa, Event ID 1001 para informes de volcado de fallos, o Event ID 7001 para servicios que fallan al iniciar por dependencias).',
    mythVsReality: {
      myth: 'El Visor de Eventos está lleno de errores y advertencias rojas todo el tiempo, por lo que hay que ignorarlo.',
      reality: 'Muchas advertencias son informativas y rutinarias de apps en segundo plano. El perito forense no busca "errores" al azar, sino correlacionar marcas de tiempo (timestamps) exactas con el momento del incidente reportado por el usuario.',
    },
    technicalDeepDive: {
      title: 'ANATOMÍA DE LOS ARCHIVOS EVTX Y EVENT IDS CRÍTICOS',
      items: [
        'Estructura de Canales EVTX: Almacenamiento optimizado basado en registros estructurados con índices rápidos para consultas complejas.',
        'Event ID 41 (Kernel-Power): Indica que el sistema se reinició sin apagarse limpiamente. Si viene precedido por BugcheckCode 0, suele ser un corte físico de energía o falla de fuente de poder.',
        'Event ID 6008: Cierre inesperado del sistema (se registra al reiniciar tras un cuelgue o corte).',
        'Filtros XPath Avanzados: Permiten aislar eventos específicos (ej: *[System[(EventID=41) or (EventID=1001)]]) para auditorías relámpago.',
      ],
    },
    diagramTitle: 'MAPA DE CANALES EVTX Y CORRELACIÓN DE EVENT IDS CRÍTICOS',
    diagramDescription: 'Esquema de los registros Application, System, Security y Setup, destacando los Event IDs fundamentales para peritaje de hardware y software.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #023 — Apagones Fantasma sin Pantalla Azul en Estación de Trabajo',
      victim: 'PC de Diseño Gráfico — AMD Ryzen 9, Fuente de Poder 850W Gold',
      symptom: 'La computadora se apagaba instantáneamente como si le hubieran desconectado el enchufe, de manera completamente aleatoria durante tareas pesadas de render.',
      initialHypothesis: 'Sobrecalentamiento extremo del procesador o cortocircuito en la placa madre.',
      rootCause: 'Al consultar el Visor de Eventos en System, se filtró por Event ID 41 (Kernel-Power) y BugCheckCode 0. Esto confirmó que no hubo una orden de apagado por software ni un bugcheck de kernel, sino un corte repentino de voltaje de 12V que disparaba las protecciones OCP (Over Current Protection) de la fuente de poder defectuosa.',
      resolution: 'Se reemplazó la fuente de alimentación por una unidad con certificación y rieles estables. Los apagones fantasmas cesaron por completo.',
    },
    practiceDetails: {
      objective: 'Consultar los últimos eventos críticos del sistema en PowerShell filtrando por ID de evento clave.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de eventos recientes con marca temporal, nivel de criticidad y mensaje descriptivo del kernel o servicios.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Ejecutá la consulta de eventos del sistema recientes: Get-WinEvent -LogName System -MaxEvents 15 | Select-Object TimeCreated, Id, LevelDisplayName, Message.',
        '3. Filtrá específicamente los eventos de advertencia o error: Get-WinEvent -FilterHashtable @{LogName=\'System\'; Level=1,2} -MaxEvents 10.',
        '4. Analizá los IDs devueltos para identificar anomalías de controladores o servicios.',
      ],
      interpretation: 'Permite extraer de forma rápida la telemetría de errores del sistema operativo sin navegar por la interfaz gráfica del Visor de Eventos.',
      howToRollback: 'Comando de consulta de solo lectura; no altera ningún registro del sistema.',
    },
  },
  m24: {
    hookQuestion: 'Muchos usuarios instalan aplicaciones de terceros que se ejecutan solas en segundo plano, abren navegadores con publicidad o ejecutan scripts de limpieza molestos sin permiso: ¿cómo detecta y controla un perito técnico la persistencia de tareas automáticas en Windows?',
    simpleAnalogy: 'El Programador de Tareas (Task Scheduler) es la agenda de un conserje automatizado: tiene anotado exactamente a qué hora, ante qué evento (al encender la PC, al iniciar sesión, ante un error o cada 3 horas) debe abrir qué puerta, ejecutar qué programa o barrer qué pasillo.',
    evoExplains: 'El Programador de Tareas (taskschd.msc) es el mecanismo legítimo más utilizado tanto por Windows y aplicaciones oficiales como por software malicioso o adware para asegurar la persistencia en el sistema. Una tarea programada consta de 4 elementos fundamentales: Disparador (Trigger: cuándo se ejecuta), Acción (Action: qué programa o script lanza), Condiciones (Conditions: si requiere corriente alterna, red o inactividad) y Configuración (Settings: reintentos y límites de tiempo). En el peritaje forense, auditar la Biblioteca del Programador de Tareas y los archivos XML asociados en C:\\Windows\\System32\\Tasks es obligatorio ante comportamientos sospechosos o molestas ventanas de comandos que parpadean al iniciar sesión.',
    mythVsReality: {
      myth: 'El Programador de Tareas solo sirve para que Windows busque actualizaciones de software.',
      reality: 'Cientos de procesos legítimos (desfragmentación programada, respaldos, telemetría, actualización de antivirus) y también muchos troyanos de persistencia dependen de tareas automáticas para ejecutarse con privilegios elevados sin que el usuario lo note.',
    },
    technicalDeepDive: {
      title: 'ANATOMÍA DE TAREAS PROGRAMADAS Y PERSISTENCIA FORENSE',
      items: [
        'Ubicación de Tareas XML: Todos los descriptores de tareas se almacenan en C:\\Windows\\System32\\Tasks como archivos XML planos.',
        'Privilegios de Ejecución (RunLevel): Las tareas pueden configurarse para correr con privilegios de Usuario estándar o con el token elevado del grupo Administradores / SYSTEM.',
        'Disparadores de Evento: Permiten lanzar scripts o reparaciones automáticamente cuando se registra un Event ID específico en el Visor de Eventos.',
        'Auditoría con PowerShell: El cmdlet Get-ScheduledTask lista de forma estructurada todas las tareas activas y deshabilitadas del sistema.',
      ],
    },
    diagramTitle: 'ESTRUCTURA DE UNA TAREA: DISPARADOR ➔ CONDICIÓN ➔ ACCIÓN',
    diagramDescription: 'Diagrama de bloques de una tarea programada y su método de auditoría pericial en C:\\Windows\\System32\\Tasks.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #024 — Apertura Molesta de Navegador con Publicidad cada 60 Minutos',
      victim: 'PC Personal — Windows 11 Home, Core i5',
      symptom: 'Cada hora exacta, el navegador predeterminado se abría solo mostrando una pestaña de publicidad de dudosa procedencia, a pesar de haber pasado antivirus y antispyware.',
      initialHypothesis: 'Infección profunda del navegador o virus residente en memoria RAM.',
      rootCause: 'Al auditar las tareas programadas con taskschd.msc y revisar el directorio C:\\Windows\\System32\\Tasks, se descubrió una tarea oculta llamada "WinUpdateChecker" configurada para dispararse cada 60 minutos ejecutando un script malicioso de PowerShell escondido en AppData que lanzaba URLs de anuncios.',
      resolution: 'Se deshabilitó y eliminó la tarea programada maliciosa, y se borró el script residente en el directorio de usuario. Problema resuelto de raíz en 3 minutos sin formatear.',
    },
    practiceDetails: {
      objective: 'Auditar y listar las tareas programadas activas del sistema utilizando PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de tareas programadas con su estado (Ready/Disabled), ruta y nombre de la tarea.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Listá todas las tareas activas que no sean de Microsoft: Get-ScheduledTask | Where-Object {$_.Author -notlike \'*Microsoft*\'} | Select-Object TaskName, State, TaskPath.',
        '3. Consultá los detalles de una tarea específica si detectás un nombre anómalo.',
        '4. Verificá los permisos y disparadores asociados.',
      ],
      interpretation: 'Permite detectar rápidamente software publicitario o troyanos de persistencia que se ocultan en el programador de tareas del sistema.',
      howToRollback: 'Comando de inventario y consulta de solo lectura.',
    },
  },
  m25: {
    hookQuestion: 'Cuando una computadora tarda 5 minutos en encender y la barra de tareas se congela al iniciar sesión por la cantidad de aplicaciones que se abren solas, ¿dónde busca Windows todas las fuentes de autoarranque?',
    simpleAnalogy: 'El inicio de Windows es como la puerta de salida de un edificio de oficinas a las 9:00 AM: si 50 personas intentan salir al mismo tiempo por la misma puerta angosta, se produce un embotellamiento monumental. Gestionar el autoarranque es ordenar quién sale primero y quién espera su turno.',
    evoExplains: 'El autoarranque de Windows no se limita a una sola ubicación; se distribuye en múltiples puntos de persistencia que el sistema y las aplicaciones consultan al iniciar sesión: 1) Pestaña "Aplicaciones de inicio" del Administrador de Tareas; 2) Claves del Registro en HKCU y HKLM bajo \\Software\\Microsoft\\Windows\\CurrentVersion\\Run y RunOnce; 3) Carpetas físicas de inicio (Startup Folders en Shell:Startup y Shell:Common Startup); y 4) Controladores y servicios cargados en el inicio del Kernel. Para un análisis exhaustivo y profesional, la herramienta Sysinternals Autoruns es el estándar de la industria, mostrando absolutamente cada ganchillo de persistencia con el que cuenta el sistema operativo.',
    mythVsReality: {
      myth: 'Desactivar todos los programas del inicio automático hace que Windows deje de funcionar.',
      reality: 'El 99% de los programas en el inicio automático (actualizadores de Discord, launchers de juegos, Spotify, Cortana) son totalmente prescindibles para el funcionamiento del sistema operativo y solo consumen recursos en segundo plano.',
    },
    technicalDeepDive: {
      title: 'MAPA DE PERSISTENCIA DEL AUTOARRANQUE EN WINDOWS',
      items: [
        'Claves Run y RunOnce: Ubicadas en HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run y HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run. Ejecutan binarios o comandos al iniciar la sesión del usuario.',
        'Carpetas Startup: %AppData%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup y su equivalente global en ProgramData. Cualquier acceso directo colocado aquí se ejecuta de forma automática.',
        'Task Manager Startup Impact: Evalúa el impacto de inicio (Bajo, Medio, Alto, No medido) midiendo el tiempo de CPU consumido durante la inicialización de la sesión.',
        'Sysinternals Autoruns: Herramienta pericial definitiva que cruza los puntos de autoarranque con bases de datos de reputación de VirusTotal.',
      ],
    },
    diagramTitle: 'MAPA MULTINIVEL DE AUTOARRANQUE: REGISTRO ➔ CARPETAS ➔ TAREAS',
    diagramDescription: 'Esquema de las 4 fuentes principales de persistencia al iniciar sesión en Windows y su auditoría con Autoruns.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #025 — Computadora con Demora de 8 Minutos en el Inicio de Sesión',
      victim: 'Laptop Comercial — Windows 10, Core i3, 8GB RAM, Disco Mecánico HDD',
      symptom: 'Al encender la PC, el escritorio aparecía pero el disco duro se saturaba al 100% durante 8 minutos completos abriendo 14 actualizadores de software diferentes en simultáneo.',
      initialHypothesis: 'El disco duro mecánico está dañado o tiene sectores defectuosos.',
      rootCause: 'Auditoría con el Administrador de Tareas y el Editor del Registro reveló 28 entradas activas en las claves Run y carpetas Startup de programas que el usuario jamás usaba (actualizadores automáticos de impresoras, suites de drivers y launchers olvidados).',
      resolution: 'Se desactivaron todas las entradas innecesarias de inicio mediante el Administrador de Tareas y se limpiaron accesos directos basura de la carpeta Startup. El tiempo de arranque se redujo de 8 minutos a 55 segundos de forma radical.',
    },
    practiceDetails: {
      objective: 'Auditar y listar las aplicaciones configuradas para ejecutarse en el inicio automático mediante PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de entradas de registro en las rutas Run y RunOnce con sus rutas de ejecución asociadas.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Consultá las entradas de autoarranque del equipo local (HKLM): Get-ItemProperty -Path \'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\' | Format-List.',
        '3. Consultá las entradas de autoarranque del usuario actual (HKCU): Get-ItemProperty -Path \'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\' | Format-List.',
        '4. Identificá programas huérfanos o rutas sospechosas.',
      ],
      interpretation: 'Permite auditar de forma limpia y directa el registro de persistencia de inicio sin requerir interfaces gráficas pesadas.',
      howToRollback: 'Comando de consulta de solo lectura; no modifica claves del registro.',
    },
  },
  m26: {
    hookQuestion: 'Cuando un usuario dice "no tengo internet", la falla puede estar en el cable, en el router Wi-Fi, en el servidor DNS, en la configuración IP local o en el bloqueo del proveedor: ¿cómo aísla un perito técnico la falla exacta de red en segundos?',
    simpleAnalogy: 'Diagnosticar una red sin herramientas es como buscar una fuga de agua en una ciudad entera rompiendo todas las calles. Los comandos de red (ipconfig, ping, tracert, nslookup y netstat) son medidores de presión instalados en cada esquina para saber exactamente en qué tramo del acueducto se cortó el flujo.',
    evoExplains: 'El subsistema de red de Windows se diagnostica mediante un protocolo estructurado de abajo hacia arriba en el modelo OSI: 1) ipconfig para verificar la configuración de la tarjeta local, puerta de enlace y DHCP; 2) ping 127.0.0.1 para comprobar la pila IP interna; 3) ping a la puerta de enlace para verificar la conexión con el router local; 4) ping a 8.8.8.8 o 1.1.1.1 para verificar salida a internet a nivel IP; 5) nslookup o resolución DNS para comprobar si el traductor de nombres de dominio funciona; y 6) netstat -ano para auditar qué conexiones activas y puertos abiertos mantienen los procesos locales. Con esta secuencia de 6 pasos, cualquier falla de red se aísla con precisión matemática en menos de un minuto.',
    mythVsReality: {
      myth: 'Si el ícono de red de la barra de tareas tiene un triángulo amarillo, hay que reiniciar el módem de inmediato.',
      reality: 'El triángulo amarillo solo indica pérdida de conectividad lógica o DNS, pero la causa puede ser una IP estática mal configurada, un conflicto DHCP en la PC o una falla en el switch local.',
    },
    technicalDeepDive: {
      title: 'EL ARSENAL DE DIAGNOSTICO DE RED EN CONSOLA',
      items: [
        'Ipconfig /all: Muestra el estado completo de adaptadores, dirección física MAC, asignación DHCP, servidores DNS primario y secundario, y concesión de IP.',
        'Tracert (Trace Route): Envía paquetes ICMP incrementando el TTL (Time To Live) para revelar cada salto y router intermedio hasta el destino, midiendo la latencia de cada nodo.',
        'Nslookup: Consulta directamente a los servidores DNS especificados para verificar la resolución de nombres de host a direcciones IP.',
        'Netstat -ano: Lista todas las conexiones TCP/UDP activas (-a), muestra numéricamente las direcciones (-n) y asocia cada conexión al PID del proceso responsable (-o).',
      ],
    },
    diagramTitle: 'SECUENCIA DE AISLAMIENTO DE RED: IP ➔ GATEWAY ➔ INTERNET ➔ DNS',
    diagramDescription: 'Árbol de decisión de 6 pasos para diagnóstico y aislamiento de fallas de conectividad en entornos Windows.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #026 — Navegador con Error "DNS_PROBE_FINISHED_NXDOMAIN" en una Sola PC',
      victim: 'Estación de Trabajo — Windows 11 Pro, Red Corporativa',
      symptom: 'Todas las demás computadoras de la oficina navegaban perfectamente por internet, pero esta PC específica abría cualquier página web mostrando error de DNS, aunque el icono de red indicaba conexión activa.',
      initialHypothesis: 'El proveedor de internet bloqueó la dirección MAC de la computadora.',
      rootCause: 'Se ejecutó ipconfig /all y se descubrió que tenía configurados servidores DNS estáticos obsoletos (80.80.80.80) que ya no respondían, además de una corrupción en la caché DNS local.',
      resolution: 'Se ejecutó ipconfig /flushdns para limpiar la caché local y se reconfiguró el adaptador para obtener servidores DNS automáticamente por DHCP (o se fijaron 1.1.1.1 y 8.8.8.8). La navegación web se restableció de inmediato.',
    },
    practiceDetails: {
      objective: 'Ejecutar la secuencia completa de diagnóstico de red y vaciado de caché DNS en PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Información detallada de la configuración IP actual y mensaje de confirmación de limpieza de caché DNS.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Consultá el estado completo de los adaptadores de red: ipconfig /all.',
        '3. Limpiá y restablecé la caché de resolución DNS local: ipconfig /flushdns.',
        '4. Realizá una prueba de conectividad hacia el DNS público de Cloudflare: ping 1.1.1.1 -n 4.',
      ],
      interpretation: 'Permite verificar la salud inmediata de la pila de red y solucionar bloqueos frecuentes de resolución de nombres web.',
      howToRollback: 'Comandos de diagnóstico y purga de caché seguros; no alteran configuraciones permanentes de red.',
    },
  },
  m27: {
    hookQuestion: '¿Por qué un técnico avanzado nunca escribe rutas largas como C:\\Users\\Nombre\\AppData\\Local para buscar archivos, sino que utiliza variables mágicas como %TEMP% o %APPDATA%?',
    simpleAnalogy: 'Las variables de entorno son como los códigos postales y abreviaturas oficiales de una gran ciudad: no importa si tu casa se muda de barrio o si el usuario cambia de nombre, enviando la carta a %USERPROFILE% o %TEMP% siempre llega exactamente al buzón correcto.',
    evoExplains: 'Las variables de entorno en Windows son pares de nombre-valor gestionados por el Administrador de Objetos del Kernel que almacenan rutas dinámicas del sistema y de los perfiles de usuario. Conocer y utilizar variables como %TEMP%, %APPDATA%, %LOCALAPPDATA%, %USERPROFILE%, %SYSTEMROOT% y %PROGRAMFILES% permite acceder instantáneamente a directorios ocultos o protegidos sin importar la letra de unidad asignada o el nombre de la cuenta de usuario activa.',
    mythVsReality: {
      myth: 'Las variables de entorno son archivos estáticos que se pueden borrar para liberar espacio en disco.',
      reality: 'Las variables de entorno son punteros lógicos en la memoria RAM del sistema operativo; borrarlas o corromperlas impide que Windows localice carpetas críticas del sistema.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE VARIABLES DE ENTORNO Y COMANDOS DE AUDITORÍA',
      items: [
        'Variables de Sistema vs Usuario: Las variables de sistema (%SystemRoot%, %ProgramFiles%) aplican a todos los usuarios; las de usuario (%AppData%, %Temp%) pertenecen al perfil activo.',
        'Expansión en Consola y Ejecutar: El shell (cmd.exe o powershell.exe) evalúa la variable en tiempo real antes de invocar la ruta subyacente.',
        'Comando Get-ChildItem Env\\: Permite listar todas las variables de entorno activas directamente en PowerShell con sus valores actuales.',
        'Acceso Directo con Win + R: Ingresar directamente %TEMP% o sysdm.cpl abre carpetas y paneles de control sin navegar por menús.',
      ],
    },
    diagramTitle: 'MAPA DE VARIABLES DE ENTORNO: SISTEMA, USUARIO Y SHELL',
    diagramDescription: 'Esquema de resolución de variables de entorno en Windows y su acceso rápido mediante el diálogo Ejecutar (Win + R).',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #027 — Directorio de Datos Corrompido por Cambio Manual de Perfil',
      victim: 'PC de Oficina — Windows 11 Pro',
      symptom: 'El usuario renombró manualmente su carpeta de usuario en C:\\Users\\ y todas las aplicaciones de trabajo perdieron sus configuraciones y credenciales.',
      initialHypothesis: 'Se desinstaló el software corporativo por un virus.',
      rootCause: 'Las rutas apuntaban a perfiles inexistentes porque las variables de entorno asociadas al SID del usuario ya no coincidían con la ruta física renombrada.',
      resolution: 'Se restauró la estructura de directorios y se actualizaron las variables de entorno de perfil mediante el applet sysdm.cpl (Propiedades del sistema ➔ Opciones avanzadas ➔ Variables de entorno). Aplicaciones y accesos restaurados.',
    },
    practiceDetails: {
      objective: 'Inspeccionar las variables de entorno activas del sistema operativo utilizando PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado completo de variables de sistema y usuario con sus rutas de directorio asociadas.',
      steps: [
        '1. Abrí PowerShell.',
        '2. Ejecutá el comando para listar todas las variables activas: Get-ChildItem Env:\\ | Sort-Object Name.',
        '3. Comprobá el valor de una variable específica en consola: Write-Output $env:TEMP.',
        '4. Probá presionar Win + R, escribí %TEMP% y presioná Enter para abrir la carpeta correspondiente.',
      ],
      interpretation: 'Permite comprender cómo el sistema operativo mapea dinámicamente las rutas de almacenamiento de perfiles y servicios.',
      howToRollback: 'Operación de consulta pura; no altera valores de entorno.',
    },
  },
  m28: {
    hookQuestion: '¿Por qué al intentar eliminar un archivo antiguo del sistema aparece el mensaje "Acceso denegado, necesitas permisos de Administrador", incluso estando logueado con la cuenta de Administrador?',
    simpleAnalogy: 'La seguridad de una caja fuerte en un banco: ser el director del banco (Administrador) no significa que tengas la llave de cada caja de seguridad individual si el propietario original puso un candado personal (ACL restrictiva o falta de Propietario).',
    evoExplains: 'El sistema de archivos NTFS de Windows implementa un modelo robusto de seguridad basado en Objetos Asegurables, Listas de Control de Acceso (ACLs / DACLs) y Propietarios (Owner). Cada archivo o carpeta define exactamente qué usuarios o grupos tienen permisos específicos (Lectura, Escritura, Modificación, Control total). Cuando Windows bloquea el acceso a un directorio, no es una falla técnica, sino una regla de seguridad estricta: para saltarla de forma pericial, el operador debe tomar posesión del objeto (Take Ownership) y otorgar permisos explícitos mediante el comando icacls.',
    mythVsReality: {
      myth: 'Si tengo permisos de Administrador en Windows, puedo leer y modificar absolutamente cualquier archivo del sistema sin restricciones.',
      reality: 'Por diseño de seguridad (User Account Control y ACLs de sistema), los administradores no poseen control total por defecto sobre archivos protegidos del sistema o perfiles de otros usuarios hasta que toman posesión explícita.',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE PERMISOS NTFS, DACLS Y COMANDO ICACLS',
      items: [
        'DACL (Discretionary Access Control List): Lista que especifica qué fideicomisarios (usuarios o grupos) tienen acceso permitido o denegado.',
        'Herencia de Permisos: Por defecto, los archivos y subcarpetas heredan los permisos de su carpeta padre a menos que se rompa explícitamente la cadena de herencia.',
        'Tomar Posesión (Take Ownership): El comando takeown /f <ruta> permite que el administrador se convierta en propietario del objeto bloqueado para reasignar ACLs.',
        'Gestión con icacls: Herramienta CLI para respaldar, auditar y restaurar permisos de carpetas y archivos en sistemas corporativos.',
      ],
    },
    diagramTitle: 'JERARQUÍA DE PROPIEDAD, HERENCIA Y ACLS EN NTFS',
    diagramDescription: 'Esquema de evaluación de permisos NTFS, herencia desde la carpeta raíz y resolución de acceso denegado.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #028 — Rescate de Base de Datos Bloqueada en Perfil de Usuario Anterior',
      victim: 'PC de Cliente — Windows 10 Pro',
      symptom: 'El cliente había migrado su disco a otra PC y al intentar rescatar una base de datos SQLite dentro de la carpeta C:\\Users\\AntiguoUsuario\\AppData\\, Windows mostraba "Acceso denegado permanentemente".',
      initialHypothesis: 'El archivo estaba encriptado con BitLocker o dañado.',
      rootCause: 'El archivo pertenecía al SID del usuario anterior y las ACLs de NTFS negaban la lectura a cualquier cuenta nueva.',
      resolution: 'Se abrió CMD como Administrador, se ejecutó takeown /f "C:\\Users\\AntiguoUsuario\\AppData\\*" /r /d y luego icacls "..." /grant Administradores:F /t. Acceso recuperado al instante sin pérdida de datos.',
    },
    practiceDetails: {
      objective: 'Auditar los permisos de acceso NTFS de un archivo o carpeta mediante el comando icacls en consola.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Listado de usuarios y grupos con sus respectivos permisos asignados (R, W, M, F).',
      steps: [
        '1. Abrí PowerShell o CMD como Administrador.',
        '2. Ejecutá la auditoría de permisos de una carpeta protegida: icacls C:\\Windows\\System32.',
        '3. Analizá las entradas devueltas indicando qué grupos tienen control total o lectura.',
        '4. Comprobá cómo funciona el control de acceso en entornos corporativos.',
      ],
      interpretation: 'Permite verificar exactamente qué entidades de seguridad poseen privilegios sobre un recurso del sistema.',
      howToRollback: 'Operación de auditoría de solo lectura; no altera permisos.',
    },
  },
  m29: {
    hookQuestion: '¿Qué hace un técnico profesional cuando una actualización desastrosa de Windows rompe el arranque y la máquina entra en un bucle infinito de pantallas azules (BSOD)?',
    simpleAnalogy: 'La cápsula de escape de una nave espacial: cuando el motor principal falla en el espacio exterior (sistema operativo principal colapsado), la tripulación activa la cápsula de emergencia (WinRE o Modo Seguro) con sistemas autónomos para reparar la nave o volver a base con seguridad.',
    evoExplains: 'El Entorno de Recuperación de Windows (WinRE - Windows Recovery Environment) es un sistema operativo en miniatura basado en WinPE y alojado en una partición oculta de rescate. Permite acceder a herramientas avanzadas de diagnóstico cuando Windows no puede iniciar con normalidad: Símbolo del sistema, Desinstalación de últimas actualizaciones problemáticas, Restauración del sistema a un punto previo (System Restore), Recuperación de imagen del sistema y Reparación automática de inicio. Asimismo, el Modo Seguro (Safe Boot) carga únicamente los controladores esenciales de Microsoft, permitiendo aislar y desinstalar drivers gráficos o de red defectuosos que bloquean el sistema.',
    mythVsReality: {
      myth: 'Usar Puntos de Restauración del Sistema borra tus documentos personales, fotos y videos guardados en el disco.',
      reality: 'Falso. La Restauración del Sistema solo afecta a los archivos del sistema operativo, claves del Registro, controladores y aplicaciones instaladas, respetando intacta la carpeta de usuario (C:\\Users).',
    },
    technicalDeepDive: {
      title: 'ARQUITECTURA DE WINRE, PUNTOS DE RESTAURACIÓN Y BOOTREC',
      items: [
        'WinRE (winre.wim): Imagen de recuperación residente en partición dedicada, invocada automáticamente tras 3 fallos consecutivos de arranque.',
        'Puntos de Restauración (VSS): Instantáneas gestionadas por el Volume Shadow Copy Service que resguardan el estado del Registro y archivos de sistema.',
        'Comandos de Rescate BCD (bootrec): bootrec /fixmbr, bootrec /fixboot, bootrec /scanos y bootrec /rebuildbcd para reconstruir almacenes de arranque dañados.',
        'Entrada a Modo Seguro Forzado: Interrupción del booteo mediante apagado físico reiterado para forzar la pantalla de opciones avanzadas de recuperación.',
      ],
    },
    diagramTitle: 'MAPA DE OPCIONES AVANZADAS DE RECUPERACIÓN (WINRE)',
    diagramDescription: 'Esquema del menú de WinRE y sus herramientas de rescate: Símbolo del sistema, Restaurar Sistema y Desinstalar Actualizaciones.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente #029 — Rescate de Estación con Bucle BSOD tras Parche de Actualización',
      victim: 'PC Corporativa — Windows 11 Pro',
      symptom: 'Tras instalar una actualización acumulativa nocturna, la máquina entraba en un bucle constante de pantalla azul con error 0xc000021a.',
      initialHypothesis: 'Placa madre defectuosa o daño físico en el almacenamiento.',
      rootCause: 'El parche acumulativo había fallado al actualizar un componente crítico del subsistema de usuario (winlogon.exe), corrompiendo la sesión.',
      resolution: 'Se forzó el ingreso a WinRE, se seleccionó "Desinstalar la última actualización de calidad", y el sistema desinstaló el parche defectuoso en 4 minutos, volviendo al escritorio con total normalidad.',
    },
    practiceDetails: {
      objective: 'Verificar el estado del servicio de Restauración del Sistema y los puntos de restauración disponibles mediante PowerShell.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Estado de protección activo en los volúmenes del sistema y puntos de restauración registrados.',
      steps: [
        '1. Abrí PowerShell como Administrador.',
        '2. Consultá el estado de protección del sistema en los discos: Get-ComputerRestorePoint.',
        '3. Verificá si el servicio de instantáneas VSS está activo: Get-Service vss.',
        '4. Analizá la viabilidad de utilizar puntos de restauración ante contingencias.',
      ],
      interpretation: 'Permite comprobar si la máquina cuenta con una red de seguridad activa para revertir cambios accidentales de software.',
      howToRollback: 'Consulta de estado de solo lectura.',
    },
  },
  m30: {
    hookQuestion: '¿Por qué la experiencia acumulada de un perito forense no se mide por cuántas veces formateó una computadora, sino por cuántas fallas críticas logró resolver en menos de 10 minutos sin perder un solo byte de información?',
    simpleAnalogy: 'El médico cirujano veterano frente al estudiante de medicina: el estudiante quiere operar y cortar ante cualquier síntoma leve; el veterano ausculta, analiza los análisis de laboratorio, comprende la fisiología del cuerpo (el Kernel NT) y aplica el tratamiento exacto y mínimamente invasivo.',
    evoExplains: 'El Módulo 30 consolida el cierre del Tomo 02 — La Biblia Negra de Windows integrando la resolución de casos complejos de taller y demoliendo los mitos más peligrosos de internet. A lo largo de este tomo hemos demostrado que los problemas de rendimiento, bloqueos y pantallas azules no se solucionan con "recetas mágicas", debloaters destructivos ni formateos indiscriminados, sino mediante el rigor científico del Método EVO: Medir antes de tocar, aislar variables, respetar la cadena de servicio (DISM/SFC), auditar registros (EVTX, RAC) y asegurar la reversibilidad absoluta de cada intervención.',
    mythVsReality: {
      myth: 'Formatear y reinstalar Windows es la única solución profesional y rápida para cualquier problema complejo de software.',
      reality: 'Formatear es la derrota del técnico analítico; destruye la evidencia, hace perder horas reinstalando programas y configuraciones, y rara vez soluciona la causa raíz si el problema es un controlador obsoleto o una falla de hardware latente.',
    },
    technicalDeepDive: {
      title: 'DECÁLOGO DEL PERITO FORENSE DE EVO LABS',
      items: [
        '1. El síntoma nunca es la causa: Investigar siempre el origen lógico o físico mediante telemetría.',
        '2. Cero dogmas, 100% metrología: Respaldar cada intervención con métricas objetivas (LatencyMon, Perfmon, Task Manager).',
        '3. Reversibilidad sagrada: Nunca aplicar un cambio sin poder deshacerlo.',
        '4. El Archivo EVO como estandarte: Documentar cada bitácora para construir experiencia acumulada y profesional.',
        '5. Preparación para el Tomo 03: Aplicar este mismo criterio pericial al diagnóstico y reparación física de hardware y componentes en taller.',
      ],
    },
    diagramTitle: 'SÍNTESIS MAESTRA: DEL DIAGNOSTICO FORENSE AL ARCHIVO EVO',
    diagramDescription: 'Panel de cierre del Tomo 02 que resume los 30 módulos de ingeniería de Windows y el puente hacia la reparación física en el Tomo 03.',
    diagramPendingNote: '',
    evoCase: {
      title: 'Expediente Maestro #030 — La Estación Salvada del Formateo Injustificado',
      victim: 'Workstation de Producción Musical — Windows 10 Pro, 64GB RAM',
      symptom: 'La estación sufría chasquidos de audio y cortes en grabaciones en vivo. Tres técnicos diferentes habían exigido formatear la máquina y cambiar la placa de audio por una nueva de $800.',
      initialHypothesis: 'Placa de audio profesional defectuosa o incompatibilidad con Windows.',
      rootCause: 'Auditoría pericial con LatencyMon reveló picos de DPC de 6.200 µs causados por un driver de red Wi-Fi en segundo plano que interfería con el búfer ASIO de baja latencia.',
      resolution: 'Se desactivó la tarjeta Wi-Fi integrada en BIOS y se optimizó el plan de energía. Los chasquidos de audio desaparecieron al 100% en 5 minutos. Diagnóstico resuelto sin gastar un centavo en hardware nuevo ni perder configuraciones de audio.',
    },
    practiceDetails: {
      objective: 'Consolidar los conocimientos del Tomo 02 y verificar el dominio de la arquitectura del Kernel NT en la evaluación final.',
      dataType: 'SYSTEM_REPORTED',
      whatToObserve: 'Dominio de los conceptos de hilos, memoria virtual, servicios, registro, recuperación y metrología.',
      steps: [
        '1. Repasá tus notas del Archivo EVO (C:\\EVO_LABS).',
        '2. Respondé la evaluación final del Tomo 02 para certificar tus competencias periciales.',
        '3. Prepárate para el Tomo 03: Reparación de PC // Sistema EVO Labs.',
      ],
      interpretation: 'Certifica formalmente tu transición de operador aficionado a investigador pericial certificado de EVO Labs.',
      howToRollback: 'Consolidación de conocimiento definitivo.',
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
        {currentMod.id === 'm30' && (
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#081220] via-[#050B14] to-black border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,210,255,0.2)] space-y-6 animate-in fade-in duration-300">
            {/* Header with Award & Accreditation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400 flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <span className="font-mono-tech text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                    EVO LABS // CIERRE DE TOMO
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
