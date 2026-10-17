import { WINDOWS_AUDIT_EXAMPLE } from './tomo02AuditExample';
import { AdvancedSectorContent } from './tomo02AdvancedTypes';

// Lessons, examples and decision scenarios are educational; none executes on the host.
export const TOMO_02_ADVANCED_CONTENT: AdvancedSectorContent[] = [
  {
    "number": "11",
    "objective": "Auditar una configuración del Registro, distinguir el ámbito correcto y diseñar un cambio reversible sin tocar hives protegidos.",
    "prerequisites": "Windows 10/11; PowerShell de 64 bits. Para la práctica real usá exclusivamente una clave de prueba de tu usuario; respaldá antes cualquier modificación.",
    "lessons": [
      {
        "heading": "De la clave al hive",
        "text": "El Registro es una base jerárquica de configuración; un hive combina archivos persistentes y estructuras cargadas en memoria. HKLM contiene configuración de máquina y HKCU apunta al perfil del usuario cuyo token ejecuta el proceso. HKU expone los perfiles cargados; HKCC deriva del perfil de hardware actual. HKCR combina asociaciones de clases de usuario y máquina: no es un archivo independiente. Un error de asociación puede estar en HKCU aunque HKLM parezca correcto."
      },
      {
        "heading": "Persistencia y ámbito",
        "text": "SYSTEM contiene ControlSets y servicios; CurrentControlSet referencia el conjunto activo. SOFTWARE guarda configuración de programas y Windows; SAM y SECURITY son datos protegidos de cuentas y seguridad, no objetivos de limpieza. DEFAULT no equivale al perfil de todos los usuarios; NTUSER.DAT respalda parte de HKCU. Run y RunOnce controlan inicios concretos; Explorer, Policies, Environment y Uninstall tienen consumidores diferentes. Una política puede reaplicar un valor que cambiaste manualmente."
      },
      {
        "heading": "Tipos y vista de 32/64 bits",
        "text": "REG_DWORD son 32 bits, REG_QWORD 64; REG_SZ es texto y REG_BINARY bytes. Tipo, nombre y ámbito forman parte del contrato con la aplicación. La redirección WOW64 puede mostrar una vista distinta a programas de 32 bits. Consultá ambas vistas antes de diagnosticar un valor ausente. Un export .reg conserva valores de la rama, pero no es una imagen completa con permisos del hive."
      },
      {
        "heading": "Menú contextual reversible",
        "text": "Diseñá ADD-EVO-MENU.reg en HKCU\\Software\\Classes\\*\\shell\\EVO y un REMOVE-EVO-MENU.reg que elimine solamente esa clave. La acción puede mostrar la ruta seleccionada con notepad, no ejecutar scripts como administrador. Comprobá comillas para rutas con espacios, Windows 11 puede mostrarlo en “Mostrar más opciones”. Antes de importar inspeccioná cada línea; importar un export no elimina valores añadidos después del respaldo."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "reg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\"",
        "purpose": "Inventariar inicios del usuario sin cambiar nada.",
        "example": "OneDrive    REG_SZ    \"C:\\...\\OneDrive.exe\" /background",
        "interpretation": "Registrá nombre, tipo y ruta. Una entrada no demuestra que el proceso esté activo ni que sea malicioso.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-ItemProperty -LiteralPath \"HKCU:\\Environment\" | Select-Object TEMP,TMP",
        "purpose": "Distinguir valores persistentes del entorno del usuario.",
        "example": "TEMP: %USERPROFILE%\\AppData\\Local\\Temp",
        "interpretation": "Compará con $env:TEMP en una nueva sesión: el entorno de un proceso ya iniciado puede conservar valores anteriores.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Identificá el programa consumidor, usuario, tipo y vista del Registro.",
      "Consultá la rama y guardá el estado anterior, incluyendo si el valor no existía.",
      "En una VM creá solamente la clave EVO del menú contextual; conservá export y procedimiento de eliminación.",
      "Reiniciá el consumidor o una sesión de Explorer cuando corresponda; comprobá que el menú abre el archivo esperado.",
      "Simulá reg add/reg delete sobre la clave de prueba; verificá el árbol antes y después de REMOVE-EVO-MENU.reg."
    ],
    "verification": "Compará consulta inicial/final y comportamiento de Explorer; tras revertir la clave EVO debe desaparecer sin alterar otras asociaciones.",
    "pitfalls": [
      "No borrar SAM/SECURITY ni cambiar propietario para forzar acceso.",
      "No confundir HKCU del administrador elevado con el usuario afectado."
    ],
    "rollback": "Eliminá solamente la clave de prueba creada; restaurá valores anteriores y su tipo. Un cambio en un hive de sistema exige respaldo recuperable y WinRE, no una colección de “tweaks”.",
    "mission": "Documentá ámbito, ruta, tipo, valor previo, valor nuevo y prueba de reversión del menú EVO.",
    "scenario": "Un menú aparece solamente en una cuenta. La rama HKLM está vacía, pero existe una asociación en HKCU.",
    "decisions": [
      {
        "text": "Tomar propiedad de SAM",
        "feedback": "SAM no controla el menú y es un hive protegido.",
        "correct": false
      },
      {
        "text": "Borrar HKCR completo",
        "feedback": "Perderías asociaciones ajenas; HKCR es una vista combinada.",
        "correct": false
      },
      {
        "text": "Consultar HKCU\\Software\\Classes y probar el consumidor",
        "feedback": "La evidencia ubica el ámbito de usuario; no requiere cambiar hives de sistema.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Por qué dos procesos pueden ver valores diferentes bajo Software?",
        "choices": [
          {
            "text": "El Registro genera valores aleatorios",
            "feedback": "Las vistas son deterministas.",
            "correct": false
          },
          {
            "text": "Pueden usar distintas vistas WOW64",
            "feedback": "La arquitectura del proceso determina parte de la redirección.",
            "correct": true
          },
          {
            "text": "Todo valor pertenece siempre a HKLM",
            "feedback": "HKCU y otras raíces tienen ámbitos propios.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Un import de una exportación revierte cualquier cambio posterior?",
        "choices": [
          {
            "text": "No; los valores nuevos pueden permanecer",
            "feedback": "La importación fusiona los valores presentes, no reconstruye toda la rama.",
            "correct": true
          },
          {
            "text": "Sí, restaura todos los permisos del hive",
            "feedback": "Un .reg no es un respaldo completo de seguridad y hive.",
            "correct": false
          },
          {
            "text": "Sí, elimina automáticamente los valores extra",
            "feedback": "Una exportación no contiene esa instrucción de eliminación.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/win32/sysinfo/registry"
      }
    ]
  },
  {
    "number": "12",
    "objective": "Relacionar disco, partición, volumen y letra; identificar una instalación UEFI y practicar particionado sin perder datos.",
    "prerequisites": "Inventario de discos y copia de seguridad verificada. BitLocker: recuperá y comprobá acceso a la clave antes de cambiar el arranque; nunca la pegues en EVO.",
    "lessons": [
      {
        "heading": "Cuatro objetos diferentes",
        "text": "El disco es el dispositivo; una partición delimita sectores; un volumen presenta un sistema de archivos; una letra es un punto de montaje. Un volumen puede no tener letra y seguir siendo esencial. GPT usa cabeceras y tablas redundantes; MBR tiene restricciones históricas de tamaño y particiones primarias. UEFI normalmente arranca desde una ESP FAT32, no desde C:. MSR y Recovery tienen funciones distintas y no son espacio “desperdiciado”."
      },
      {
        "heading": "Sistema de archivos y capacidad",
        "text": "NTFS aporta permisos y journaling; FAT32 tiene límite de archivo de 4 GiB menos un byte; exFAT sirve para intercambios grandes pero no reemplaza todas las garantías de NTFS. Reducir un volumen depende de archivos no movibles; ampliar requiere disposición compatible, normalmente espacio contiguo en el mismo disco. Storage Spaces agrega dispositivos en pools: un disco físico no equivale a un volumen del pool."
      },
      {
        "heading": "Salud antes de intervenir",
        "text": "SMART y Get-PhysicalDisk aportan señales, no garantía de que un medio esté sano. TRIM comunica bloques libres al SSD; no sirve para recuperar datos. BitLocker cifra volúmenes y puede pedir recuperación tras cambios de firmware. Disk Management y DiskPart son dos interfaces sobre objetos de almacenamiento: seleccionar el disco equivocado cambia el alcance de todos los comandos posteriores."
      },
      {
        "heading": "clean no es mantenimiento",
        "text": "DiskPart clean elimina metadatos de particiones del disco seleccionado; clean all sobrescribe todos sus sectores accesibles. No son comandos para acelerar una PC. Creación, eliminación, formato y asignación de letra se practican primero en un disco virtual descartable. En un equipo con errores de lectura, priorizá imagen y recuperación antes de CHKDSK o pruebas que escriban."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-Disk | Select-Object Number,FriendlyName,PartitionStyle,Size,OperationalStatus",
        "purpose": "Identificar dispositivos y estilo de partición.",
        "example": "Number 0 | GPT | 512110190592 | Online",
        "interpretation": "No uses Number por sí solo: corroborá modelo y tamaño. El número puede cambiar al conectar dispositivos.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "diskpart\nlist disk\nlist volume\nexit",
        "purpose": "Inspeccionar discos y volúmenes; no selecciona ni modifica.",
        "example": "Volume 0 | C | NTFS | Partition\nVolume 2 | FAT32 | System",
        "interpretation": "Identificá ESP/Recovery por función y esquema; no asignes letras ni borres particiones desde esta consulta.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Inventariá discos por modelo, capacidad y estado; guardá mapa de particiones y cifrado.",
      "Diferenciá ESP, MSR, Windows y Recovery antes de elegir un destino.",
      "En el simulador de instalación, elegí un disco virtual descartable; compará crear/formatear con eliminar tabla.",
      "Antes de reducir o ampliar, verificá respaldo, espacio contiguo y limitaciones del sistema de archivos.",
      "Confirmá que datos, arranque y recuperación siguen accesibles tras cualquier práctica real autorizada."
    ],
    "verification": "Un mapa final debe conservar las particiones de sistema necesarias y todos los archivos de la copia; el tamaño informado por Get-Volume debe concordar con el diseño.",
    "pitfalls": [
      "No ejecutar clean sobre el disco de trabajo ni confiar en una letra para identificar el disco.",
      "No “desfragmentar” SSD por receta ni interpretar SMART sano como ausencia de riesgo."
    ],
    "rollback": "Cancelar en el simulador restaura su estado. En un disco real clean o formato no tienen undo fiable: detené escrituras y recurrí a la copia o a una imagen forense.",
    "mission": "Entregá un mapa disco → partición → volumen → montaje y justificá qué particiones no se pueden eliminar.",
    "scenario": "Hay dos discos del mismo tamaño. El instalador muestra Disco 1 con la copia del cliente y Disco 0 vacío.",
    "decisions": [
      {
        "text": "Ejecutar clean en ambos",
        "feedback": "Destruye las tablas que querés preservar.",
        "correct": false
      },
      {
        "text": "Identificar por modelo y conexión, preservar Disco 1 y practicar solo en el virtual",
        "feedback": "La selección debe verificarse por identidad, no por posición.",
        "correct": true
      },
      {
        "text": "Formatear la ESP para liberar espacio",
        "feedback": "La ESP es necesaria para la cadena UEFI.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿C: identifica inequívocamente el disco físico?",
        "choices": [
          {
            "text": "No; es un punto de montaje de un volumen",
            "feedback": "Las letras pueden variar, especialmente en WinRE.",
            "correct": true
          },
          {
            "text": "Sí, implica GPT",
            "feedback": "La letra no determina el estilo de partición.",
            "correct": false
          },
          {
            "text": "Sí, siempre es Disco 0",
            "feedback": "La letra depende del montaje y puede cambiar; no identifica el número del dispositivo.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Qué efecto tiene clean?",
        "choices": [
          {
            "text": "Comprueba SMART",
            "feedback": "No realiza diagnóstico de salud.",
            "correct": false
          },
          {
            "text": "Solo libera temporales",
            "feedback": "No es una limpieza de archivos.",
            "correct": false
          },
          {
            "text": "Elimina metadatos de particionado del disco seleccionado",
            "feedback": "Es destructivo para el mapa, aunque no sobrescriba todos los datos.",
            "correct": true
          }
        ]
      }
    ],
    "lab": {
      "scenario": "install",
      "label": "Instalación y particionado virtual"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-server/administration/windows-commands/diskpart"
      }
    ]
  },
  {
    "number": "13",
    "objective": "Elegir entre reparación in-place, restablecimiento y reinstalación; preparar una recuperación verificable.",
    "prerequisites": "ISO oficial compatible con edición, arquitectura e idioma; respaldo externo comprobado, energía estable y clave de recuperación del cifrado accesible.",
    "lessons": [
      {
        "heading": "El método determina lo conservado",
        "text": "Una instalación limpia reconstruye Windows y normalmente requiere reinstalar aplicaciones; no garantiza conservar archivos. Reset “Conservar mis archivos” conserva ciertos archivos personales, pero elimina aplicaciones y restablece configuración: no es backup. “Quitar todo” es destructivo. Una reparación in-place iniciada desde Windows puede conservar aplicaciones y archivos cuando medio y versión son compatibles; si el instalador no ofrece esa opción, no avances suponiendo que sí."
      },
      {
        "heading": "UEFI, OOBE y drivers",
        "text": "El USB oficial debe arrancarse en el modo coherente con el disco. Durante OOBE se configuran cuenta, privacidad y conectividad; disponibilidad de opciones varía por edición y build. Tras instalar, obtené controladores OEM apropiados, verificá dispositivos, ejecutá Windows Update y registrá versión final. No reutilices automáticamente todo Driver Store antiguo si la falla era un driver."
      },
      {
        "heading": "Recuperación sin reinstalar",
        "text": "WinRE es un entorno separado con Reparación de inicio, Restaurar sistema y consola. La partición Recovery puede estar presente pero WinRE deshabilitado; comprobá reagentc. Un punto de restauración revierte ciertos cambios del sistema, no todos los documentos. VSS coordina instantáneas y Previous Versions depende de una fuente realmente disponible; no presupongas historial si nunca se configuró."
      },
      {
        "heading": "Un respaldo debe arrancar o restaurar",
        "text": "Probá abrir archivos del respaldo y recuperá una muestra a otra ubicación. Guardá licencias, configuraciones de aplicaciones y métodos de acceso antes de reinstalar. “Formatear sin perder datos” suele significar haberlos copiado previamente, no que el formato sea inocuo. Windows.old puede ayudar tras algunos métodos, pero tiene plazo y condiciones: nunca debe ser tu único plan de recuperación."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "reagentc /info",
        "purpose": "Comprobar registro y ubicación de WinRE.",
        "example": "Windows RE status: Enabled\nWindows RE location: ...Recovery...",
        "interpretation": "Enabled demuestra registro, no que la recuperación haya sido probada. Una ubicación vacía requiere investigación.",
        "admin": true,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber,OsArchitecture",
        "purpose": "Relacionar el medio con el sistema actual.",
        "example": "WindowsProductName: Windows ...\nOsBuildNumber: ...",
        "interpretation": "Usá edición/build/arquitectura junto con idioma y compatibilidad del medio. Un nombre comercial aislado no basta.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Probá restaurar un archivo del respaldo externo; registrá software y versión.",
      "Elegí el método con una matriz explícita de archivos, aplicaciones y configuración que conserva.",
      "Simulá instalación UEFI y OOBE antes de aceptar eliminación de particiones.",
      "Tras instalar verificá controladores, actualizaciones, activación y acceso a datos sin copiar secretos al expediente.",
      "Probá WinRE y guardá un estado de referencia de la nueva instalación."
    ],
    "verification": "La recuperación se considera validada cuando una muestra vuelve a abrirse, los dispositivos funcionan y el sistema puede reiniciar; no por alcanzar el escritorio una vez.",
    "pitfalls": [
      "No confiar en “Conservar mis archivos” como única copia.",
      "No iniciar un medio incompatible sin revisar qué opciones conservará."
    ],
    "rollback": "Usá la imagen completa o copia externa. Una instalación limpia no se revierte con un punto de restauración de la instalación eliminada.",
    "mission": "Compará tres métodos de recuperación y elegí uno para una app crítica que debe conservarse; documentá respaldo y prueba posterior.",
    "scenario": "Windows inicia y una app licenciada debe mantenerse. El medio compatible ofrece conservar aplicaciones y archivos.",
    "decisions": [
      {
        "text": "Respaldar y evaluar reparación in-place",
        "feedback": "Conservar apps exige validar la opción del instalador y disponer de recuperación.",
        "correct": true
      },
      {
        "text": "Depender solo de Windows.old",
        "feedback": "No es un respaldo independiente ni siempre se crea.",
        "correct": false
      },
      {
        "text": "Usar Quitar todo esperando conservar apps",
        "feedback": "Esa opción no conserva las aplicaciones.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Qué elimina Reset con Conservar mis archivos?",
        "choices": [
          {
            "text": "Solo el historial del navegador",
            "feedback": "El alcance es mucho mayor.",
            "correct": false
          },
          {
            "text": "Nada",
            "feedback": "Es un restablecimiento del sistema.",
            "correct": false
          },
          {
            "text": "Las aplicaciones instaladas y parte de la configuración",
            "feedback": "Archivos personales conservados no implican apps intactas.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿Un punto de restauración sustituye una copia de documentos?",
        "choices": [
          {
            "text": "Sí, siempre tiene todos los documentos",
            "feedback": "No existe esa garantía.",
            "correct": false
          },
          {
            "text": "No, protege determinados estados del sistema",
            "feedback": "Su propósito no es respaldar todos los archivos del usuario.",
            "correct": true
          },
          {
            "text": "Sí, sobrevive a cualquier formato",
            "feedback": "Puede desaparecer al reemplazar la instalación.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "install",
      "label": "Instalación Windows y OOBE"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://support.microsoft.com/windows/recovery-options-in-windows-31ce2444-7de3-818c-d626-e3b5a3024da5"
      }
    ]
  },
  {
    "number": "14",
    "objective": "Decidir cuándo detener el uso de un medio y escoger una fuente de recuperación sin sobrescribir evidencia.",
    "prerequisites": "Destino distinto del origen; historial/versiones previamente configurados. Un medio con fallas físicas requiere imagen por un especialista antes de exploraciones intensivas.",
    "lessons": [
      {
        "heading": "Borrar no siempre sobrescribe",
        "text": "La Papelera ofrece recuperación lógica hasta vaciarla; Shift+Delete omite esa vía. En NTFS se liberan referencias y clusters, aunque algunos contenidos persistan hasta ser reutilizados. Quick Format reconstruye metadatos sin prometer recuperar la MFT anterior. Seguir usando Windows sobre el mismo disco puede sobrescribir archivos perdidos con cachés, actualizaciones o el propio programa de recuperación."
      },
      {
        "heading": "El SSD cambia la expectativa",
        "text": "Con TRIM, el controlador puede descartar páginas de bloques liberados; la recolección interna y el cifrado reducen aún más la posibilidad de recuperar datos. No hay garantía de éxito por apagar rápidamente ni por utilizar una herramienta cara. En HDD la recuperación puede ser más viable si los sectores no se sobrescribieron, pero una falla mecánica exige detener intentos, no repetir scans."
      },
      {
        "heading": "Primero las fuentes existentes",
        "text": "File History conserva versiones si estaba configurado; Previous Versions depende de puntos/instantáneas válidos; OneDrive tiene papelera e historial con políticas y plazos. Restaurá primero a un directorio alternativo, compará contenido y luego decidí reemplazar. Una copia sincronizada también puede replicar borrados: verificar versiones históricas es distinto de asumir que la sincronización es backup."
      },
      {
        "heading": "Windows File Recovery",
        "text": "winfr requiere origen y destino diferentes y sus modos dependen del sistema de archivos y daño. Consultá winfr /? de la versión instalada antes de aplicar /regular o /extensive. Instalalo o preparalo en otro entorno antes del incidente; no escribas herramientas en el disco afectado. Registrar hashes de archivos recuperados ayuda a comprobar integridad, pero no prueba que un archivo parcial sea utilizable."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "winfr /?",
        "purpose": "Consultar modos de la herramienta ya instalada.",
        "example": "Usage: winfr source-drive: destination-folder ...",
        "interpretation": "Si no está instalada, no la descargues sobre el medio afectado. La ayuda es consulta, no recuperación.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-FileHash -LiteralPath \"E:\\Recuperados\\informe.pdf\" -Algorithm SHA256",
        "purpose": "Comprobar una copia recuperada en el destino.",
        "example": "Algorithm: SHA256\nHash: [64 caracteres hexadecimales]",
        "interpretation": "Solo permite comparar con otra copia conocida; abrí también el archivo y validá su estructura.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Detené escrituras al origen; anotá tipo de medio y momento del borrado.",
      "Buscá Papelera e historial/versiones desde otro dispositivo cuando sea posible.",
      "Recuperá una muestra a otro volumen, nunca al origen.",
      "Si no hay copia, evaluá imagen y herramienta adecuada según NTFS, HDD/SSD y daño.",
      "Abrí las muestras, contrastá hashes si existen y documentá archivos recuperados y faltantes."
    ],
    "verification": "El éxito se demuestra con archivos íntegros abiertos en un destino independiente; una lista de nombres no prueba recuperación del contenido.",
    "pitfalls": [
      "No ejecutar CHKDSK /f, formato o inicialización como primer paso de rescate.",
      "No prometer recuperar un SSD después de TRIM."
    ],
    "rollback": "La estrategia de recuperación evita cambios al origen. Si sobrescribiste sectores no existe reversión garantizada; escalá sin más escrituras.",
    "mission": "Construí un árbol de recuperación para un archivo eliminado: copia/versiones → imagen → recuperación a otro volumen; registrá límites.",
    "scenario": "Se borró un documento del SSD del sistema y el usuario quiere instalar allí mismo un recuperador.",
    "decisions": [
      {
        "text": "Garantizar recuperación completa por ser Quick Format",
        "feedback": "Ni el formato rápido ni el tipo de medio garantizan contenido intacto.",
        "correct": false
      },
      {
        "text": "Instalar y guardar recuperados en C:",
        "feedback": "Genera escrituras adicionales sobre la evidencia.",
        "correct": false
      },
      {
        "text": "Detener escrituras y revisar copias/versiones desde otro medio",
        "feedback": "Instalar en el origen puede ocupar los clusters que buscás recuperar.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Dónde deben escribirse archivos recuperados?",
        "choices": [
          {
            "text": "En la misma carpeta perdida",
            "feedback": "Puede reemplazar sectores de otros archivos.",
            "correct": false
          },
          {
            "text": "En un destino distinto del origen",
            "feedback": "Evita sobrescribir contenido todavía recuperable.",
            "correct": true
          },
          {
            "text": "En la MFT",
            "feedback": "La MFT es metadata del sistema de archivos, no un destino de rescate.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Qué demuestra un nombre de archivo encontrado?",
        "choices": [
          {
            "text": "Que se encontró metadata, no necesariamente contenido íntegro",
            "feedback": "Validá contenido y estructura antes de declarar éxito.",
            "correct": true
          },
          {
            "text": "Que TRIM estaba desactivado",
            "feedback": "Un nombre no permite inferir ese estado.",
            "correct": false
          },
          {
            "text": "Que todos los bytes están sanos",
            "feedback": "Los clusters pueden haberse reutilizado.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://support.microsoft.com/windows/recover-lost-files-on-windows-61f5b28a-f5ec-3cc2-0f8e-a63cb4e1d4c4"
      }
    ]
  },
  {
    "number": "15",
    "objective": "Aislar una falla PnP y escoger un controlador compatible con evidencia, no por ser el más reciente.",
    "prerequisites": "Conocé modelo, hardware ID, edición/build y paquete anterior; no desconectes almacenamiento ni red crítica sin recuperación.",
    "lessons": [
      {
        "heading": "Cómo se construye un dispositivo",
        "text": "El bus enumera un dispositivo; PnP compara Hardware IDs y Compatible IDs con archivos INF, asigna una instancia y carga la pila. El Instance Path identifica esa instancia; Class GUID agrupa funciones. Bus driver, function driver y filtros cooperan: un fallo puede estar en un filtro, no en el chip. SYS contiene código; INF declara instalación y CAT valida el catálogo firmado."
      },
      {
        "heading": "Driver Store y procedencia",
        "text": "Driver Store mantiene paquetes preparados. pnputil enumera paquetes publicados; no todas las entradas son drivers activos. Preferí OEM para funciones integradas específicas y fabricante del chip para paquetes compatibles documentados. Windows Update puede reemplazar versiones. Registrá proveedor, fecha, versión, firma e ID antes de atribuir una regresión."
      },
      {
        "heading": "Interpretar códigos y revertir",
        "text": "Code 28 indica controlador no instalado; Code 10 que el dispositivo no pudo iniciar; Code 19 apunta a configuración; Code 31 a problemas de carga; Code 43 es una falla reportada por el dispositivo/driver, no una condena automática del hardware. Probá una sola versión conocida, reiniciá y repetí la función que falla. Disable/Enable difiere de desinstalar: quitar el paquete puede impedir reinstalación offline."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "pnputil /enum-drivers",
        "purpose": "Inventariar paquetes terceros.",
        "example": "Published Name: oem42.inf\nProvider Name: ...",
        "interpretation": "No borres oem42.inf solo por existir; relacioná el paquete con el dispositivo.",
        "admin": true,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-CimInstance Win32_PnPSignedDriver | Select-Object DeviceName,DeviceID,DriverVersion,DriverProviderName",
        "purpose": "Relacionar ID y versión.",
        "example": "DeviceName: Adaptador de red\nDriverVersion: ...",
        "interpretation": "Compará con la versión previa al incidente; no confundas fecha del INF con antigüedad real.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Registrá ID, código de error y versión actual en Device Manager.",
      "Correlacioná la primera falla con el cambio de paquete y eventos PnP.",
      "Probá rollback o paquete compatible en una VM; conservá instalador previo.",
      "Reiniciá y verificá funcionamiento y ausencia del mismo error."
    ],
    "verification": "El dispositivo debe ejecutar su función bajo la misma carga antes/después; “sin triángulo amarillo” es necesario pero no suficiente.",
    "pitfalls": [
      "No usar actualizadores genéricos por cantidad de drivers detectados.",
      "No eliminar filtros del Registro a ciegas."
    ],
    "rollback": "Rollback o reinstalación del paquete conocido; mantené medio offline y WinRE para drivers de arranque.",
    "mission": "Identificá un dispositivo de prueba por ID y documentá un plan de rollback con criterio de éxito.",
    "scenario": "La NIC dejó de funcionar después de reemplazar su paquete y ahora muestra Code 10.",
    "decisions": [
      {
        "text": "Reemplazar inmediatamente la placa",
        "feedback": "Code 10 no prueba daño físico.",
        "correct": false
      },
      {
        "text": "Comparar ID/versiones y probar rollback controlado",
        "feedback": "La secuencia temporal permite una hipótesis de regresión comprobable.",
        "correct": true
      },
      {
        "text": "Borrar todo Driver Store",
        "feedback": "Perderías paquetes de dispositivos sanos.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un INF firmado garantiza compatibilidad funcional?",
        "choices": [
          {
            "text": "No; certifica aspectos del paquete, no todos los escenarios",
            "feedback": "Validá ID, versión y operación real.",
            "correct": true
          },
          {
            "text": "Sí, evita reinicios",
            "feedback": "Algunos cambios requieren reiniciar.",
            "correct": false
          },
          {
            "text": "Sí, cualquier INF sirve",
            "feedback": "La enumeración necesita coincidencias concretas.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Code 28 significa hardware destruido?",
        "choices": [
          {
            "text": "Significa disco lleno",
            "feedback": "No es el significado del código.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "No implica esa causa.",
            "correct": false
          },
          {
            "text": "No; falta un controlador adecuado",
            "feedback": "Es un estado de instalación.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/drivers/install/"
      }
    ]
  },
  {
    "number": "16",
    "objective": "Separar transporte, cola, puerto y driver al reparar impresoras y periféricos.",
    "prerequisites": "Una cola de prueba y permiso del dueño; detener Spooler afecta a otros usuarios y trabajos.",
    "lessons": [
      {
        "heading": "El trayecto de una impresión",
        "text": "Una aplicación genera el trabajo, Spooler lo administra, el driver lo traduce y un puerto dirige la entrega. USB, WSD y TCP/IP estándar son transportes distintos. “Offline” puede resultar de IP cambiada, puerto incorrecto o estado del dispositivo; no confirma que el servicio esté detenido. Probá una página de prueba para separar aplicación de cola."
      },
      {
        "heading": "USB y energía",
        "text": "Un dispositivo USB necesita alimentación, enumeración, negociación y driver. Probá cable/puerto y observá Device Manager; un hub comparte energía y ancho de banda. HID usa clases estándar, pero funciones adicionales pueden necesitar software OEM. Audio USB combina endpoints y buffers: un clic puede ser energía, driver o latencia, no necesariamente micrófono roto."
      },
      {
        "heading": "Bluetooth y reversión",
        "text": "Bluetooth depende de radio, driver, servicio y perfil del accesorio. Una radio ausente del árbol PnP es distinta de un accesorio no emparejado. Registrá el estado antes de quitar emparejamientos o desactivar ahorro de energía. Reiniciar Spooler no cambia el puerto de una impresora; vaciar su carpeta de spool elimina trabajos, por eso aquí se simula esa acción."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-Printer | Select-Object Name,DriverName,PortName,PrinterStatus",
        "purpose": "Auditar cola y transporte.",
        "example": "Name: Oficina | PortName: IP_192.0.2.50",
        "interpretation": "Correlacioná el puerto con la dirección real; el ejemplo no es una medición.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-Service Spooler; Get-PnpDevice -PresentOnly | Where-Object Class -in \"USB\",\"Bluetooth\",\"HIDClass\"",
        "purpose": "Diferenciar servicio y enumeración.",
        "example": "Spooler: Running\nClass: Bluetooth | Status: OK",
        "interpretation": "Running no garantiza entrega; un dispositivo ausente requiere revisar radio o conexión.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Comprobá alimentación, enlace y una página de prueba.",
      "Compará puerto, dirección y driver; inspeccioná trabajos bloqueados.",
      "Aislá la aplicación con una cola/prueba conocida sin borrar todos los trabajos.",
      "Para USB/Bluetooth cambiá una sola variable y repetí la tarea."
    ],
    "verification": "Verificá impresión o audio sostenido y reconexión después de reiniciar; registrá qué trabajo se preservó.",
    "pitfalls": [
      "No limpiar spool sin avisar que elimina trabajos pendientes.",
      "No deshabilitar todos los hubs USB: podés perder teclado y recuperación."
    ],
    "rollback": "Restaurá puerto/driver anterior o política de energía original; reemparejá solo el accesorio de prueba.",
    "mission": "Dibujá aplicación → cola → driver → puerto → dispositivo y señalá la primera evidencia de falla.",
    "scenario": "Spooler está Running, pero el puerto de la cola conserva la IP anterior de la impresora.",
    "decisions": [
      {
        "text": "Verificar dirección y corregir solo el puerto tras guardar su valor",
        "feedback": "La ruta de entrega no coincide con el dispositivo.",
        "correct": true
      },
      {
        "text": "Eliminar todos los trabajos de todas las colas",
        "feedback": "No resuelve la causa y pierde trabajos.",
        "correct": false
      },
      {
        "text": "Reiniciar Spooler indefinidamente",
        "feedback": "No cambia la dirección del puerto.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Qué distingue Device Manager de una cola?",
        "choices": [
          {
            "text": "Administra direcciones DNS",
            "feedback": "Device Manager trabaja con dispositivos PnP; DNS es un servicio de resolución de nombres.",
            "correct": false
          },
          {
            "text": "Muestra cada documento pendiente",
            "feedback": "Eso corresponde a la cola.",
            "correct": false
          },
          {
            "text": "Enumera dispositivos, no los trabajos de impresión",
            "feedback": "Son capas de diagnóstico diferentes.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿USB no reconocido prueba falla del driver?",
        "choices": [
          {
            "text": "Sí, siempre",
            "feedback": "No distingue esas capas.",
            "correct": false
          },
          {
            "text": "No; también puede ser cable, alimentación o enumeración",
            "feedback": "Aislá el transporte antes del paquete.",
            "correct": true
          },
          {
            "text": "Prueba falta de RAM",
            "feedback": "No hay esa evidencia.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "17",
    "objective": "Diagnosticar enlace, IP, ruta, DNS y servicio sin recurrir a un reset indiscriminado.",
    "prerequisites": "Registrá configuración, VPN/proxy y si la red usa DHCP; no liberes una conexión remota de administración.",
    "lessons": [
      {
        "heading": "Capas y límites de cada prueba",
        "text": "La NIC negocia el enlace; MAC identifica capa local, ARP resuelve vecinos IPv4, IP enruta, TCP establece conexiones y UDP no ofrece esa sesión. Una IP 169.254 indica autoconfiguración IPv4 de enlace local, a menudo tras no obtener DHCP; no descarta conectividad IPv6. Gateway permite salir a otras redes y DNS traduce nombres. Que una puerta responda ICMP no demuestra que una aplicación funcione."
      },
      {
        "heading": "Velocidad, Wi-Fi y pérdidas",
        "text": "Un enlace a 100 Mbps puede limitar un servicio más rápido: cable, pares, puerto o negociación son hipótesis. 1/2.5 Gbps es tasa de enlace, no rendimiento garantizado. En Wi-Fi compará señal, canal, interferencia y banda bajo igual ubicación. Medí varias muestras de RTT, pérdida y jitter; un salto intermedio que limita respuestas ICMP no prueba que descarte el tráfico reenviado."
      },
      {
        "heading": "Políticas y diagnóstico controlado",
        "text": "VPN cambia rutas y DNS; proxy cambia el trayecto de aplicaciones. El perfil Público/Privado condiciona reglas de firewall, no calidad del cable. Un reset de red puede eliminar configuración y requerir reinstalar VPN; preservá datos antes de intervenir. Separá Connected without Internet de “no resuelve nombres” probando una IP y un nombre del mismo servicio."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "ipconfig /all\nroute print\nnetsh wlan show interfaces",
        "purpose": "Inventariar dirección, rutas y enlace Wi-Fi.",
        "example": "IPv4: 169.254.x.x | Gateway: vacío",
        "interpretation": "Revisá DHCP y enlace local; no concluyas falla de DNS si no hay ruta.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Resolve-DnsName example.com; Test-NetConnection example.com -Port 443",
        "purpose": "Diferenciar resolución y TCP.",
        "example": "Name: example.com\nTcpTestSucceeded: True",
        "interpretation": "TCP correcto no demuestra autenticación ni HTTP sano; un fallo DNS es distinto de firewall TCP.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Revisá cable/enlace y velocidad negociada.",
      "Registrá IP, máscara/prefijo, gateway y rutas; compará DHCP con configuración esperada.",
      "Probá resolución, destino TCP y luego aplicación; aislá VPN/proxy con autorización.",
      "Repetí muestras en igual contexto y restaurá cualquier cambio temporal."
    ],
    "verification": "Documentá la capa que falla y una prueba equivalente exitosa; no uses un único ping como certificado de toda la red.",
    "pitfalls": [
      "No desactivar firewall global para probar una regla.",
      "No usar reset de red sin inventario y plan para VPN/IP fija."
    ],
    "rollback": "Restaurá IP/DNS/rutas/proxy anteriores; si la red es administrada, coordiná con su responsable.",
    "mission": "Armá una tabla enlace → IP → gateway → DNS → TCP → aplicación con resultado y límite de cada prueba.",
    "scenario": "Una IP externa responde y TCP a 443 conecta, pero Resolve-DnsName falla para el mismo nombre.",
    "decisions": [
      {
        "text": "Forzar 100 Mbps",
        "feedback": "Cambiar tasa no demuestra ni corrige DNS.",
        "correct": false
      },
      {
        "text": "Reinstalar la GPU",
        "feedback": "No interviene en la resolución.",
        "correct": false
      },
      {
        "text": "Investigar servidor DNS, sufijos y VPN",
        "feedback": "La evidencia separa resolución del transporte que sí funciona.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿169.254.x.x garantiza acceso a Internet?",
        "choices": [
          {
            "text": "Sí, porque hay IP",
            "feedback": "Una dirección no garantiza gateway.",
            "correct": false
          },
          {
            "text": "No; suele ser dirección IPv4 de enlace local",
            "feedback": "Buscá DHCP y rutas, considerando IPv6 por separado.",
            "correct": true
          },
          {
            "text": "Demuestra virus",
            "feedback": "No identifica una causa maliciosa.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Un ping exitoso demuestra que HTTPS funciona?",
        "choices": [
          {
            "text": "No; verifica otra prueba/protocolo",
            "feedback": "Probá TCP/TLS y la aplicación.",
            "correct": true
          },
          {
            "text": "Sí, valida credenciales",
            "feedback": "ICMP no autentica usuarios.",
            "correct": false
          },
          {
            "text": "Sí, todos los puertos están abiertos",
            "feedback": "No evalúa todos los puertos.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-server/networking/"
      }
    ]
  },
  {
    "number": "18",
    "objective": "Aislar frecuencia, GPU, presentación y color en fallas de pantalla o fluidez.",
    "prerequisites": "Conocé monitor, cable, puerto, resolución y driver; preservá ajustes de color y modo visible para poder volver.",
    "lessons": [
      {
        "heading": "Quién renderiza y quién presenta",
        "text": "En equipos híbridos una dGPU puede renderizar y la iGPU presentar. La preferencia por aplicación selecciona GPU dentro de las capacidades del equipo, no evita todos los límites térmicos. Game Mode, HAGS y optimizaciones de ventana cambian caminos de planificación/presentación y su efecto depende de build, driver y aplicación. Hacé A/B, no actives todo al mismo tiempo."
      },
      {
        "heading": "Hz, FPS y sincronización",
        "text": "Hz es la tasa del monitor; FPS son cuadros producidos. V-Sync reduce tearing con posibles cambios en cola/latencia; VRR ajusta refresco dentro de un rango compatible. Fullscreen y borderless pueden usar rutas distintas. Para un bloqueo en 30/60 Hz comprobá ancho de banda de cable/puerto, resolución, color y EDID antes de atribuirlo a Windows."
      },
      {
        "heading": "Color y fallas",
        "text": "HDR necesita pantalla, señal y contenido compatibles; Auto HDR no vuelve HDR nativo a cualquier aplicación. Tone mapping y profundidad de color afectan la percepción, y SDR puede verse lavado con configuración incorrecta. Generic PnP no prueba mala pantalla: es un descriptor genérico. Ante parpadeo/pantalla negra probá cable y modo conocido; Win+Ctrl+Shift+B reinicia el camino gráfico pero no repara su causa."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate",
        "purpose": "Registrar GPU y modo reportado.",
        "example": "CurrentRefreshRate: 60",
        "interpretation": "En equipos híbridos o sesiones remotas el reporte puede ser incompleto; contrastá con Configuración avanzada de pantalla.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "dxdiag",
        "purpose": "Inspeccionar DirectX, GPU y drivers en la herramienta nativa.",
        "example": "Display: nombre y versión del controlador",
        "interpretation": "Guardá un informe y fecha; diagnosticar no significa reemplazar el driver automáticamente.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Registrá resolución, Hz, profundidad, HDR, monitor/cable y GPU de la aplicación.",
      "Probá un cable/puerto conocido o un modo de menor ancho de banda.",
      "Variá una sola opción como VRR o HAGS; repetí escena y medición de frametime.",
      "Restaurá el modo original si la imagen o latencia empeoran."
    ],
    "verification": "Comprobá señal estable y distribución de frametimes bajo igual escena; FPS promedio no resume stutter.",
    "pitfalls": [
      "No comparar A/B con resoluciones o escenas diferentes.",
      "No confundir Hz reportados con FPS reales del juego."
    ],
    "rollback": "Volvé al modo visible anterior; si perdiste imagen, esperá la reversión automática del ajuste de pantalla o usá Modo seguro.",
    "mission": "Registrá dos configuraciones de presentación y defendé conservar o revertir según evidencia.",
    "scenario": "Un monitor funciona a 144 Hz en 1080p, pero queda a 30 Hz al cambiar a 4K por HDMI antiguo.",
    "decisions": [
      {
        "text": "Forzar HAGS para agregar ancho de banda",
        "feedback": "HAGS no cambia el límite del cable.",
        "correct": false
      },
      {
        "text": "Comprobar ancho de banda de puerto/cable y formato de señal",
        "feedback": "La combinación resolución/frecuencia exige más transporte.",
        "correct": true
      },
      {
        "text": "Afirmar que la RAM limita los Hz",
        "feedback": "No hay prueba de esa relación.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿144 Hz significa que el juego produce 144 FPS?",
        "choices": [
          {
            "text": "No; son métricas diferentes",
            "feedback": "El monitor y el renderizador tienen límites distintos.",
            "correct": true
          },
          {
            "text": "Solo cuando HDR está activo",
            "feedback": "HDR no define ese vínculo.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "Puede presentar cuadros repetidos.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Cómo comparar HAGS?",
        "choices": [
          {
            "text": "Mirar solo un cuadro",
            "feedback": "No captura variación temporal.",
            "correct": false
          },
          {
            "text": "Cambiar HAGS, resolución y driver juntos",
            "feedback": "No permite atribuir el resultado.",
            "correct": false
          },
          {
            "text": "Misma carga, driver y condiciones; cambiar solo HAGS",
            "feedback": "Una comparación controlada aísla la variable.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "19",
    "objective": "Relacionar política de energía, estados de reposo y bloqueos de suspensión con rendimiento medido.",
    "prerequisites": "Notebook conectada o batería documentada; registrá esquema original y no cambies firmware ni C-States desde EVO.",
    "lessons": [
      {
        "heading": "Una política no es una frecuencia fija",
        "text": "Balanced ajusta respuesta según carga; High/Ultimate Performance cambian decisiones, no crean capacidad de CPU. P-States/CPPC/Speed Shift gestionan rendimiento; C-States descansan núcleos. Desactivar reposo puede aumentar temperatura y reducir boost sostenido. En máquinas administradas o Modern Standby los esquemas disponibles pueden diferir de los de escritorio."
      },
      {
        "heading": "Dormir no es hibernar",
        "text": "Sleep conserva estado según plataforma; Hibernate guarda memoria en almacenamiento. Modern Standby S0 de baja potencia no es S3 clásico y permite actividad limitada. Un driver, streaming o tarea puede solicitar mantener el sistema despierto. /requests identifica solicitudes; no anules todas sin comprender su consumidor."
      },
      {
        "heading": "Medir batería y carga",
        "text": "/energy detecta condiciones de política y dispositivos, no diagnostica automáticamente cada falla. Battery report compara capacidad de diseño/reportada e historial; el desgaste y calibración afectan lecturas. Analizá consumo, temperatura y duración junto con latencias de la misma tarea. “Máximo rendimiento” puede empeorar autonomía sin mejorar el resultado objetivo."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "powercfg /list\npowercfg /getactivescheme\npowercfg /requests",
        "purpose": "Identificar política y bloqueadores.",
        "example": "Active scheme: Balanced\nDISPLAY: proceso de reproducción",
        "interpretation": "Una solicitud legítima no es un proceso parásito.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "powercfg /a",
        "purpose": "Consultar estados de suspensión soportados.",
        "example": "Standby (S0 Low Power Idle) disponible\nS3 no disponible",
        "interpretation": "Diferenciá capacidad de plataforma de un error de configuración.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Registrá esquema, alimentación y estados soportados.",
      "Identificá solicitudes de energía y comparalas con actividad del usuario.",
      "Medí duración/temperatura de la misma carga con una única política de prueba.",
      "Restaurá el GUID original y confirmá suspensión al cerrar la tarea."
    ],
    "verification": "La mejora requiere igual carga y alimentación; para sleep verificá que la solicitud desaparezca y el estado soportado se alcance.",
    "pitfalls": [
      "No anular indiscriminadamente power requests.",
      "No copiar GUIDs “ocultos” como solución universal."
    ],
    "rollback": "Restaurá el esquema original con su GUID y configuraciones anotadas; no uses un reset global si necesitás preservar ajustes del fabricante.",
    "mission": "Documentá política inicial, bloqueo observado, prueba y retorno al comportamiento esperado.",
    "scenario": "La PC no suspende mientras un reproductor declara una solicitud DISPLAY.",
    "decisions": [
      {
        "text": "Cerrar la reproducción y verificar que desaparezca la solicitud",
        "feedback": "Aísla una causa funcional sin alterar toda la política.",
        "correct": true
      },
      {
        "text": "Borrar todos los planes",
        "feedback": "Perderías configuración y no demostrarías la causa.",
        "correct": false
      },
      {
        "text": "Deshabilitar C-States",
        "feedback": "No elimina la solicitud de la aplicación.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿High Performance garantiza más rendimiento sostenido?",
        "choices": [
          {
            "text": "Sí, elimina throttling",
            "feedback": "La protección térmica continúa.",
            "correct": false
          },
          {
            "text": "Sí, aumenta los núcleos",
            "feedback": "La política no agrega núcleos ni capacidad física; modifica decisiones de energía.",
            "correct": false
          },
          {
            "text": "No; depende de carga, temperatura y plataforma",
            "feedback": "Debe medirse el resultado.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿S0 Low Power Idle es igual a S3?",
        "choices": [
          {
            "text": "Sí, son nombres equivalentes",
            "feedback": "Tienen funcionamiento distinto.",
            "correct": false
          },
          {
            "text": "No; son modelos diferentes",
            "feedback": "Los estados soportados dependen de la plataforma.",
            "correct": true
          },
          {
            "text": "S3 siempre puede forzarse por Registro",
            "feedback": "No se puede inventar soporte de firmware.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/design/device-experiences/powercfg-command-line-options"
      }
    ]
  },
  {
    "number": "20",
    "objective": "Diagnosticar una actualización por build, KB, reinicio pendiente y logs antes de tocar el almacén de componentes.",
    "prerequisites": "Respaldo, espacio libre y energía estable; equipos administrados requieren respetar políticas de actualización.",
    "lessons": [
      {
        "heading": "Paquetes y fases",
        "text": "Una cumulative update integra correcciones; feature update cambia versión funcional. Servicing Stack coordina instalación y Component Store conserva versiones/componentes. CBS registra transacciones. Un KB identifica un paquete publicado, pero Get-HotFix no enumera necesariamente todo lo instalado. Optional Updates y drivers no deben confundirse con parches obligatorios de seguridad."
      },
      {
        "heading": "Un porcentaje no diagnostica",
        "text": "Descarga, preparación, aplicación y reinicio tienen tiempos distintos. Buscá códigos, timestamp y Pending restart. SoftwareDistribution almacena descargas/estado; renombrarla no repara por sí sola CBS ni Driver Store. Un reset indiscriminado puede perder estado útil y debe hacerse solo con un procedimiento documentado tras conservar logs."
      },
      {
        "heading": "Correlación y rollback",
        "text": "Si la falla comenzó después de Update, identificá si cambió una KB, build o driver. Desinstalar una actualización no siempre está disponible; un rollback de feature update tiene ventanas y requisitos. Repetí la carga tras una intervención para separar coincidencia temporal de causalidad. Conservá protección y plan de actualización posterior."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10 HotFixID,InstalledOn",
        "purpose": "Reconocer KB recientes.",
        "example": "HotFixID: KB... | InstalledOn: ...",
        "interpretation": "La lista puede omitir clases de paquetes; contrastá Historial de actualizaciones y build.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-WinEvent -LogName \"Microsoft-Windows-WindowsUpdateClient/Operational\" -MaxEvents 20 | Select-Object TimeCreated,Id,Message",
        "purpose": "Leer evidencia del cliente Update.",
        "example": "Id: 20 | Error de instalación: 0x...",
        "interpretation": "Código y fase delimitan el problema; un evento aislado no prescribe reset.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Anotá build, KB/driver y fase exacta del error.",
      "Revisá espacio y reinicio pendiente; dejá terminar la operación activa.",
      "Preservá eventos y logs CBS antes de cualquier reparación.",
      "Usá el banco de reparación para decidir entre reinicio, reparación de componentes o rollback específico."
    ],
    "verification": "Confirmá instalación/build e historial; verificá reinicio y repetí la función que fallaba antes de cerrar el incidente.",
    "pitfalls": [
      "No cortar energía porque un porcentaje no se mueve.",
      "No borrar WinSxS o SoftwareDistribution como primera prueba."
    ],
    "rollback": "Usá rollback compatible o imagen recuperable; no prometas quitar un paquete permanente o recuperar una feature update fuera de su ventana.",
    "mission": "Prepará una cronología KB/build → error → fase → intervención → reinicio → prueba.",
    "scenario": "El sistema registra paquete instalado, pero muestra reinicio pendiente y continúa ejecutando la build previa.",
    "decisions": [
      {
        "text": "Instalar varios boosters",
        "feedback": "Añade variables ajenas.",
        "correct": false
      },
      {
        "text": "Borrar WinSxS",
        "feedback": "Destruye componentes necesarios.",
        "correct": false
      },
      {
        "text": "Completar un reinicio controlado antes de diagnosticar corrupción",
        "feedback": "La transacción aún requiere la fase de arranque.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Get-HotFix es inventario exhaustivo de Update?",
        "choices": [
          {
            "text": "Sí, cada driver siempre aparece",
            "feedback": "Los drivers tienen otro inventario.",
            "correct": false
          },
          {
            "text": "No; contrastá otras fuentes",
            "feedback": "No representa todas las clases de paquetes.",
            "correct": true
          },
          {
            "text": "Solo sirve para GPU",
            "feedback": "Get-HotFix consulta determinadas actualizaciones del sistema, no un inventario exclusivo de GPU.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Un evento de error basta para borrar caches?",
        "choices": [
          {
            "text": "No; hay que identificar código y fase",
            "feedback": "La reparación debe responder a evidencia específica.",
            "correct": true
          },
          {
            "text": "Sí, aunque Update siga aplicando",
            "feedback": "Interrumpir una transacción aumenta riesgo.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "No todas las fallas son descarga/caché.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "repair",
      "label": "Banco de fallas y reparación"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/deployment/update/"
      }
    ]
  },
  {
    "number": "21",
    "objective": "Comprender las fronteras de seguridad y diagnosticar bloqueos preservando las protecciones.",
    "prerequisites": "Consultas locales permitidas; políticas de empresa y Tamper Protection pueden impedir cambios deliberadamente.",
    "lessons": [
      {
        "heading": "No todas las protecciones son antivirus",
        "text": "Defender examina contenido y comportamiento; Firewall controla tráfico; SmartScreen reputación/origen; PUA software potencialmente no deseado. Cloud Protection puede aportar señales adicionales. Controlled Folder Access protege escrituras en carpetas; un bloqueo legítimo requiere comprobar aplicación, firma y evento antes de conceder una excepción. Dos antivirus con filtros activos pueden aumentar conflictos y latencia."
      },
      {
        "heading": "Arranque e integridad",
        "text": "Secure Boot verifica etapas de arranque confiables; TPM almacena/protege material criptográfico y estados; no reemplaza backup. Memory Integrity/HVCI usa aislamiento basado en virtualización para endurecer código de kernel, con requisitos de hardware y drivers. No la desactives automáticamente por una advertencia: identificá el paquete incompatible y consultá actualización OEM."
      },
      {
        "heading": "Quién tiene permiso",
        "text": "SID identifica cuentas; el token reúne identidad, grupos y privilegios; ACL autoriza acceso al objeto. UAC entrega consentimiento para elevación, no convierte cualquier archivo en confiable. SYSTEM, Administrator y TrustedInstaller tienen ámbitos y roles diferentes. Integrity Levels añaden restricciones; tomar propiedad de archivos del sistema para forzar un acceso puede destruir mantenimiento y seguridad."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-MpComputerStatus | Select-Object AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureLastUpdated",
        "purpose": "Consultar Defender.",
        "example": "RealTimeProtectionEnabled: True",
        "interpretation": "Puede haber antivirus de terceros o gestión central: interpretá el contexto, no fuerces activación/desactivación.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "whoami /user\nwhoami /groups",
        "purpose": "Identificar token efectivo sin modificar permisos.",
        "example": "SID: S-1-... | Mandatory Label: ...",
        "interpretation": "El grupo Administradores no significa que esta sesión esté elevada.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Identificá qué frontera bloquea: reputación, antivirus, carpeta, firewall o ACL.",
      "Verificá firma/origen y correlacioná el evento con la operación.",
      "En un escenario virtual probá una excepción mínima y su retiro, sin apagar defensas globalmente.",
      "Repetí la tarea y confirmá que las protecciones permanecen activas."
    ],
    "verification": "Un arreglo preserva protección y permite solo la operación legítima prevista; no se valida por esconder alertas.",
    "pitfalls": [
      "No desactivar Defender, UAC o firewall por receta.",
      "No publicar claves TPM/BitLocker o tokens en un expediente."
    ],
    "rollback": "Retirá únicamente la excepción de prueba; restaurá reglas/permisos anteriores desde un respaldo documentado.",
    "mission": "Explicá SID → token → ACL y justificá una autorización mínima para la operación observada.",
    "scenario": "Una app desconocida pide desactivar antivirus para acceder a Documentos y hay un bloqueo de Controlled Folder Access.",
    "decisions": [
      {
        "text": "Deshabilitar todas las protecciones",
        "feedback": "Elimina defensa y no identifica legitimidad.",
        "correct": false
      },
      {
        "text": "Verificar firma, origen y evento antes de autorizar algo",
        "feedback": "La alerta define una frontera concreta que no debe apagarse globalmente.",
        "correct": true
      },
      {
        "text": "Tomar propiedad de Windows",
        "feedback": "No controla ese acceso y altera seguridad.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Ser miembro de Administradores prueba elevación actual?",
        "choices": [
          {
            "text": "No; examiná el token efectivo",
            "feedback": "UAC puede usar un token filtrado.",
            "correct": true
          },
          {
            "text": "Solo si hay SSD",
            "feedback": "El almacenamiento no define el token.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "La pertenencia no garantiza elevación.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Secure Boot reemplaza un antivirus?",
        "choices": [
          {
            "text": "Sí, respalda todos los archivos",
            "feedback": "Secure Boot verifica confianza de arranque; no crea copias recuperables de documentos.",
            "correct": false
          },
          {
            "text": "Sí, elimina malware de usuario",
            "feedback": "Una cadena de arranque confiable no analiza todas las acciones de programas durante la sesión.",
            "correct": false
          },
          {
            "text": "No; protege otra etapa",
            "feedback": "El arranque confiable no analiza todas las acciones en sesión.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/security/"
      }
    ]
  },
  {
    "number": "22",
    "objective": "Auditar conexiones y permisos de privacidad sin confundir tráfico con evidencia de espionaje.",
    "prerequisites": "Permiso del dueño; omití de informes públicos IPs personales, rutas de usuario y datos de cuenta.",
    "lessons": [
      {
        "heading": "Diagnóstico, privacidad y alcance",
        "text": "Diagnostic Data ayuda a mantenimiento del producto; Advertising ID, ubicación, cámara, micrófono e historial son controles distintos. Revisá cada permiso y el consumidor real en Configuración. Cuenta Microsoft y OneDrive añaden sincronización; desactivar un permiso no desinstala ni vacía una cuenta. Diagnostic Data Viewer muestra clases de datos cuando está disponible/configurado; no representa todo el tráfico del sistema."
      },
      {
        "heading": "PID → proceso → destino",
        "text": "Get-NetTCPConnection vincula sockets TCP al PID. Relacioná ese PID con proceso, ruta y firma durante la misma ventana: los PIDs se reutilizan. Remote IP, puerto y frecuencia requieren contexto: una CDN aloja muchos servicios y una firma válida no garantiza buen comportamiento. UDP, procesos finalizados y contenido TLS no quedan descritos completamente por una tabla TCP."
      },
      {
        "heading": "Qué no prueba SRUDB",
        "text": "SRUDB.dat almacena contabilidad de recursos y red de aplicaciones según build/configuración. No es una grabación de mensajes ni demuestra qué contenido salió. Una consulta de conexiones es una fotografía, no un historial completo. La conclusión prudente puede ser “destino esperado” o “evidencia insuficiente”; no conviertas un host desconocido en acusación automática."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-NetTCPConnection -State Established | Select-Object LocalPort,RemoteAddress,RemotePort,OwningProcess",
        "purpose": "Inventariar sesiones TCP actuales.",
        "example": "RemotePort: 443 | OwningProcess: 4242",
        "interpretation": "El puerto no revela contenido; correlacioná inmediatamente PID y proceso.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-Process -Id 4242 | Select-Object Id,ProcessName,Path",
        "purpose": "Identificar consumidor de un PID de la muestra.",
        "example": "ProcessName: navegador | Path: ...",
        "interpretation": "4242 es didáctico; reemplazalo por el PID observado. Acceso denegado/proceso finalizado deben registrarse, no inventarse.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Capturá permiso de privacidad y aplicación afectada.",
      "Tomá varias muestras TCP y correlacioná PID/ruta/firma en la misma ventana.",
      "Contrastá destino con función y documentación del programa.",
      "Cambiá solo un permiso desde la interfaz y verificá comportamiento esperado."
    ],
    "verification": "El informe diferencia tráfico observado, atribución a proceso y contenido desconocido; explica límites temporales y de cifrado.",
    "pitfalls": [
      "No leer tráfico cifrado como si contuviera datos conocidos.",
      "No editar/borrar SRUDB para “apagar telemetría”."
    ],
    "rollback": "Restaurá el permiso desde Configuración si una función legítima deja de operar; preservá el estado previo y políticas administradas.",
    "mission": "Creá una ficha PID/proceso/destino/frecuencia/contexto y separá observación de interpretación.",
    "scenario": "Un navegador firmado conecta a una CDN por 443; no se capturó contenido ni comportamiento anómalo.",
    "decisions": [
      {
        "text": "Registrar la conexión y declarar desconocido el contenido",
        "feedback": "La tabla solo prueba una sesión TCP atribuible en ese momento.",
        "correct": true
      },
      {
        "text": "Borrar SRUDB",
        "feedback": "Pierde registros y no detiene el socket.",
        "correct": false
      },
      {
        "text": "Afirmar extracción de documentos",
        "feedback": "No hay evidencia del contenido.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Una IP remota desconocida demuestra espionaje?",
        "choices": [
          {
            "text": "Sí, aunque no haya proceso",
            "feedback": "La atribución aún sería incompleta.",
            "correct": false
          },
          {
            "text": "Sí, si usa 443",
            "feedback": "HTTPS es transporte común.",
            "correct": false
          },
          {
            "text": "No; necesita contexto y evidencia adicional",
            "feedback": "CDNs y servicios comparten destinos.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿SRUDB contiene todos los mensajes enviados?",
        "choices": [
          {
            "text": "Sí, contiene cada contraseña",
            "feedback": "SRUDB registra contabilidad de recursos, no un repositorio completo de contenidos y credenciales.",
            "correct": false
          },
          {
            "text": "No; registra contabilidad de recursos",
            "feedback": "No es una captura de contenidos.",
            "correct": true
          },
          {
            "text": "Es la configuración del firewall",
            "feedback": "Las reglas de firewall pertenecen a otro subsistema; SRUDB conserva contabilidad de recursos.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/privacy/"
      }
    ]
  },
  {
    "number": "23",
    "objective": "Explicar actividad en reposo relacionando tareas, mantenimiento y recursos antes de intervenir.",
    "prerequisites": "Definí reposo operativo: sin tareas del usuario pero con mantenimiento permitido; mismo intervalo y alimentación.",
    "lessons": [
      {
        "heading": "Reposo no significa inactividad absoluta",
        "text": "Update, Defender, indexación, Store, OneDrive y mantenimiento pueden usar CPU/disco/red sin ventanas visibles. TRIM y puntos de restauración también forman parte del mantenimiento. Un pico breve en una ventana programada difiere de actividad sostenida que coincide con un síntoma. Medí duración, propietario y completitud de la tarea."
      },
      {
        "heading": "Programación y disparadores",
        "text": "Scheduled Tasks usa triggers de horario, inicio, evento o idle y condiciones de energía/red. El historial puede estar deshabilitado; su ausencia no demuestra que no se ejecutó. OEM/browser updaters tienen tareas propias. LastTaskResult 0 registra éxito reportado por la tarea, no necesariamente salud de todo Windows."
      },
      {
        "heading": "Diseñar un Idle Watch",
        "text": "Elegí un intervalo de diez minutos, capturá procesos, I/O, tareas y eventos con timestamps y compará con una segunda ventana. Get-Process CPU es acumulativo: usá diferencias de muestras para hablar de tasa. Una prueba válida identifica que una tarea termina y baja consumo; desactivar toda actividad de mantenimiento no es una optimización."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-ScheduledTask | Select-Object TaskPath,TaskName,State",
        "purpose": "Reconocer tareas y ámbito.",
        "example": "TaskPath: \\Microsoft\\Windows\\... | State: Ready",
        "interpretation": "Ready no significa ejecución actual; revisá triggers y última ejecución.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-ScheduledTaskInfo -TaskName \"ScheduledDefrag\" -TaskPath \"\\Microsoft\\Windows\\Defrag\\\"",
        "purpose": "Consultar una tarea concreta.",
        "example": "LastRunTime: ... | LastTaskResult: 0",
        "interpretation": "Nombre/ruta dependen del sistema; un objeto ausente exige inventario, no crear una tarea nueva.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Anotá qué significa reposo y fijá ventana de observación.",
      "Tomá muestras con timestamps de proceso, tarea y uso.",
      "Correlacioná Update/escaneo/indexación y permití terminar tareas legítimas.",
      "Si una tarea de tercero es sospechosa, revisá ejecutable/firma y probá un cambio autorizado solo en esa tarea."
    ],
    "verification": "Diferenciá actividad transitoria programada de consumo sostenido y repetí el intervalo bajo condiciones equivalentes.",
    "pitfalls": [
      "No confundir CPU acumulada con porcentaje instantáneo.",
      "No desactivar mantenimiento, TRIM o protección globalmente."
    ],
    "rollback": "Restaurá trigger/condiciones originales de la tarea de prueba; no borres su XML sin copia.",
    "mission": "Entregá un Idle Watch de diez minutos con timestamps y una hipótesis falsable.",
    "scenario": "Un pico de disco coincide con mantenimiento y termina a los tres minutos; no hay síntoma del usuario.",
    "decisions": [
      {
        "text": "Concluir falla del SSD por un pico",
        "feedback": "No demuestra daño físico.",
        "correct": false
      },
      {
        "text": "Borrar todas las tareas",
        "feedback": "Rompe actualizaciones y mantenimiento.",
        "correct": false
      },
      {
        "text": "Registrar y repetir la observación sin desactivar la tarea",
        "feedback": "El patrón es compatible con mantenimiento transitorio.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Ready significa tarea ejecutándose?",
        "choices": [
          {
            "text": "Sí, usa CPU siempre",
            "feedback": "No equivale a Running.",
            "correct": false
          },
          {
            "text": "No; es un estado de disponibilidad",
            "feedback": "Correlacioná ejecución y resultados.",
            "correct": true
          },
          {
            "text": "Significa malware",
            "feedback": "No expresa procedencia.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Reposo exige CPU cero permanentemente?",
        "choices": [
          {
            "text": "No; Windows puede mantener y proteger el sistema",
            "feedback": "Evaluá duración y efecto sobre la carga.",
            "correct": true
          },
          {
            "text": "Sí, si hay 16 GB",
            "feedback": "La capacidad no elimina mantenimiento.",
            "correct": false
          },
          {
            "text": "Sí, cualquier pico es falla",
            "feedback": "No es un criterio válido.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "services",
      "label": "Servicios y actividad de fondo"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "24",
    "objective": "Escoger aislamiento adecuado para experimentar con Windows y comprender sus límites de red y recuperación.",
    "prerequisites": "Virtualización soportada, RAM/disco suficientes y edición compatible; los laboratorios del navegador no son máquinas virtuales reales.",
    "lessons": [
      {
        "heading": "Recursos virtuales y ejecución",
        "text": "El host administra recursos; el guest ve vCPU, vRAM, disco y NIC virtuales. Reservar más vCPU de las disponibles puede aumentar espera, no acelerar. Un hipervisor arbitra ejecución privilegiada; Hyper-V, VirtualBox y VMware tienen requisitos y compatibilidades que cambian por versión. La presencia de VBS/Hyper-V puede modificar cómo funciona otro hipervisor."
      },
      {
        "heading": "Red y snapshot",
        "text": "NAT permite salidas mediante el host; bridged conecta al guest como participante de la red física. Aislamiento de red exige revisar adaptadores, carpetas compartidas y portapapeles. Un snapshot/checkpoint conserva un estado y discos diferenciales, pero no sustituye backup ni revierte sistemas externos o credenciales expuestas."
      },
      {
        "heading": "Sandbox y WSL no son equivalentes",
        "text": "Windows Sandbox es un entorno desechable disponible en ediciones compatibles; cerrarlo pierde su estado. WSL1 traduce interfaces y WSL2 usa un kernel Linux en virtualización ligera. WSL no es Windows completo para probar drivers NT. Usá un guest Windows para ensayos de particionado/Registro y evitá conectar datos sensibles del host a una muestra sospechosa."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,VirtualizationFirmwareEnabled,SecondLevelAddressTranslationExtensions",
        "purpose": "Consultar capacidades reportadas.",
        "example": "VirtualizationFirmwareEnabled: True",
        "interpretation": "Capacidad no prueba instalación de hipervisor ni memoria suficiente.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "wsl --list --verbose",
        "purpose": "Reconocer distribuciones y arquitectura WSL.",
        "example": "NAME: Ubuntu | VERSION: 2",
        "interpretation": "WSL2 no es una VM Windows; la consulta no instala ni cambia versiones.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Elegí guest según la operación y requisitos de edición/hardware.",
      "Desconectá datos sensibles y definí red NAT/aislada.",
      "Creá checkpoint y registrá su alcance antes de experimentar.",
      "Revertí y comprobá el estado de archivos/configuración dentro del guest."
    ],
    "verification": "La reversión debe reproducir el estado del guest y declarar recursos externos que no revierte.",
    "pitfalls": [
      "No tratar snapshots como backups independientes.",
      "No usar bridged para una muestra que requiere aislamiento."
    ],
    "rollback": "Descartá el entorno virtual o restaurá checkpoint; cambios en host/red/servidores externos requieren su propio plan.",
    "mission": "Compará Sandbox, guest Windows y WSL2 para tres operaciones: app desconocida, particionado, script Linux.",
    "scenario": "Querés ensayar un cambio de Registro sin exponer documentos del host.",
    "decisions": [
      {
        "text": "Usar bridged con todas las carpetas compartidas",
        "feedback": "Amplía exposición innecesaria.",
        "correct": false
      },
      {
        "text": "Usar guest aislado con checkpoint y sin carpetas compartidas",
        "feedback": "El rollback y alcance quedan controlados.",
        "correct": true
      },
      {
        "text": "Asumir que WSL es Windows NT completo",
        "feedback": "Su kernel/interfaz no equivale al guest requerido.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un checkpoint revierte un correo enviado?",
        "choices": [
          {
            "text": "No; el servidor externo no forma parte del estado local",
            "feedback": "Aislar primero evita efectos fuera de la VM.",
            "correct": true
          },
          {
            "text": "Solo si se asignan más vCPU",
            "feedback": "Los recursos no cambian el alcance.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "No controla ese servidor.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Más vCPU siempre mejora la VM?",
        "choices": [
          {
            "text": "Sí, elimina latencia de disco",
            "feedback": "CPU y disco son recursos diferentes.",
            "correct": false
          },
          {
            "text": "Sí, no hay límite",
            "feedback": "El host tiene recursos finitos.",
            "correct": false
          },
          {
            "text": "No; puede aumentar contención del host",
            "feedback": "Dimensioná y medí según carga.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/security/application-security/application-isolation/windows-sandbox/"
      }
    ]
  },
  {
    "number": "25",
    "objective": "Preparar acceso remoto limitado, autenticado y recuperable sin exponer RDP a Internet.",
    "prerequisites": "Autorización del propietario, canal confiable y método local alternativo; edición compatible para hospedar RDP.",
    "lessons": [
      {
        "heading": "Cliente y host",
        "text": "mstsc es un cliente; poder abrirlo no demuestra que esta edición pueda hospedar RDP. El host necesita servicio/configuración, usuarios autorizados y reglas limitadas. NLA autentica antes de establecer la sesión completa; verificá identidad del host y certificado, no descartes advertencias sin análisis. Una sesión remota puede cambiar representación de GPU/audio."
      },
      {
        "heading": "Red y frontera",
        "text": "Probá LAN o una VPN administrada; gateway y firewall condicionan el transporte. No abras 3389 a todo Internet ni uses un NAT abierto como atajo. Una regla debe restringir perfil, origen y alcance, y no equivale a conceder derechos de inicio de sesión. Si alterás la NIC/VPN durante administración remota podés perder tu única vía de recuperación."
      },
      {
        "heading": "Elegir asistencia",
        "text": "Quick Assist facilita una sesión consentida; Remote Assistance y RDP tienen interacción y requisitos distintos. PowerShell Remoting usa WSMan/WinRM y endpoints con autorización, no es RDP en modo texto. Verificá registro de sesión, consentimiento y cierre. Evitá copiar credenciales a archivos o enviarlas en capturas del expediente."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "mstsc /?",
        "purpose": "Consultar opciones del cliente.",
        "example": "/v:server | /admin | ...",
        "interpretation": "La ayuda no habilita el servidor RDP ni sus permisos.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Test-NetConnection -ComputerName 192.0.2.10 -Port 3389",
        "purpose": "Verificar transporte a un host de laboratorio.",
        "example": "TcpTestSucceeded: True",
        "interpretation": "192.0.2.10 es un ejemplo; TCP disponible no verifica identidad, NLA ni autorización.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Confirmá autorización, edición y nombre del host.",
      "Conectá mediante LAN/VPN y verificá identidad/certificado.",
      "Probá con un usuario limitado y documentá alcance de firewall.",
      "Cerrá la sesión, retirando el acceso temporal, y verificá el método local."
    ],
    "verification": "Deben cumplirse transporte, identidad, autenticación y autorización; abrir el puerto solo valida una capa.",
    "pitfalls": [
      "No publicar 3389 ni deshabilitar NLA globalmente.",
      "No cambiar red/firewall sin acceso alternativo."
    ],
    "rollback": "Restaurá únicamente regla/usuario temporal; coordiná una sesión local para recuperar errores de conectividad.",
    "mission": "Escribí un plan de acceso remoto con cuatro controles y una salida segura.",
    "scenario": "El cliente llega a 3389, pero la cuenta no tiene derecho de inicio de sesión remoto.",
    "decisions": [
      {
        "text": "Revisar autorización de esa cuenta sin abrir más puertos",
        "feedback": "Transporte ya funciona; el problema está en derechos de acceso.",
        "correct": true
      },
      {
        "text": "Exponer el puerto en el router",
        "feedback": "No resuelve permisos y aumenta exposición.",
        "correct": false
      },
      {
        "text": "Desactivar NLA para todos",
        "feedback": "Reduce seguridad y no concede correctamente el derecho.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿mstsc instalado prueba capacidad de hospedar RDP?",
        "choices": [
          {
            "text": "Sí, si hay Wi-Fi",
            "feedback": "El transporte no define edición.",
            "correct": false
          },
          {
            "text": "Sí, son la misma función",
            "feedback": "El cliente no habilita el servidor.",
            "correct": false
          },
          {
            "text": "No; cliente y host son roles distintos",
            "feedback": "Depende de edición y configuración del host.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿TCP a 3389 exitoso valida toda la sesión?",
        "choices": [
          {
            "text": "Sí, valida usuario",
            "feedback": "No realiza ese inicio de sesión.",
            "correct": false
          },
          {
            "text": "No; falta identidad y autorización",
            "feedback": "La prueba de puerto es parcial.",
            "correct": true
          },
          {
            "text": "Sí, acepta certificados",
            "feedback": "No valida la identidad del host.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-server/remote/remote-desktop-services/"
      }
    ]
  },
  {
    "number": "26",
    "objective": "Resolver fallas de aplicaciones antiguas identificando arquitectura, dependencias y permisos antes de elevar privilegios.",
    "prerequisites": "Instalador/origen confiable y licencia; una app antigua puede requerir aislamiento, no debilitar Windows.",
    "lessons": [
      {
        "heading": "Arquitectura y ABI",
        "text": "WOW64 permite muchas aplicaciones de 32 bits en Windows de 64 bits con redirección de archivos/Registro. No significa que pueda cargar un driver de kernel de 32 bits ni ejecutar cualquier programa de 16 bits en x64. Una app x86 y una DLL x64 no comparten ABI; una dependencia ausente puede requerir runtime oficial de arquitectura adecuada."
      },
      {
        "heading": "Compatibilidad no es emulación total",
        "text": "Los shims de Compatibility Mode alteran comportamientos concretos, no recrean toda una versión de Windows. DPI virtualization puede evitar tamaños incorrectos; desactivar fullscreen optimizations modifica presentación, no repara una dependencia faltante. Run as Administrator cambia permisos y superficie de riesgo: no lo uses para ocultar un acceso negado cuya carpeta debería corregirse."
      },
      {
        "heading": "Diagnóstico y criterio de salida",
        "text": "Registrá mensaje exacto, arquitectura, módulo y evento Application. Consultá documentación del software y runtimes oficiales; no descargues DLL sueltas. Si exige driver obsoleto/inseguro o sistema sin soporte, considerá VM aislada y migración. Probá una opción por vez con archivo de trabajo de prueba."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-WinEvent -FilterHashtable @{LogName=\"Application\";Id=1000} -MaxEvents 5 | Select-Object TimeCreated,Message",
        "purpose": "Consultar fallos de aplicación.",
        "example": "Faulting module: ...\nException code: ...",
        "interpretation": "El módulo puede ser víctima; cruzá con dependencia y acción reproducible.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "where.exe programa.exe",
        "purpose": "Comprobar qué ejecutable resuelve PATH.",
        "example": "C:\\Herramientas\\programa.exe",
        "interpretation": "Usá el nombre real; varias rutas pueden explicar ejecutar otra versión.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Reproducí con archivo de prueba y anotá mensaje/error.",
      "Identificá arquitectura y dependencias oficiales.",
      "Probá un shim/DPI o permiso mínimo, uno por vez.",
      "Validá apertura, guardado e impresión; si requiere sistema inseguro, aislá o migrá."
    ],
    "verification": "Que aparezca la ventana no demuestra compatibilidad completa; probá el flujo de trabajo importante.",
    "pitfalls": [
      "No bajar DLL aleatorias ni desactivar controles del sistema.",
      "No elevar todas las aplicaciones por defecto."
    ],
    "rollback": "Retirá el shim/elevación o restaurá configuración previa; conservá el instalador y los datos originales.",
    "mission": "Documentá app/arquitectura/dependencia/error y una prueba funcional completa.",
    "scenario": "Una app x86 falla tras copiarle una DLL x64 de un sitio no oficial.",
    "decisions": [
      {
        "text": "Reemplazar todas las DLL de System32",
        "feedback": "Rompe componentes de otras aplicaciones.",
        "correct": false
      },
      {
        "text": "Forzar administrador",
        "feedback": "No corrige incompatibilidad ABI.",
        "correct": false
      },
      {
        "text": "Retirar la copia y reparar el runtime oficial x86 compatible",
        "feedback": "La arquitectura y procedencia deben coincidir con la aplicación.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿WOW64 permite drivers x86 de kernel en x64?",
        "choices": [
          {
            "text": "Sí, todos",
            "feedback": "No existe esa equivalencia.",
            "correct": false
          },
          {
            "text": "No; las reglas del kernel son diferentes",
            "feedback": "La compatibilidad de aplicaciones no autoriza drivers de otra arquitectura.",
            "correct": true
          },
          {
            "text": "Solo con más RAM",
            "feedback": "No es una limitación de capacidad.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Compatibility Mode emula un Windows completo?",
        "choices": [
          {
            "text": "No; aplica compatibilidades específicas",
            "feedback": "No reproduce cada API o driver antiguo.",
            "correct": true
          },
          {
            "text": "Sí, garantiza todas las DLL",
            "feedback": "Las dependencias siguen siendo necesarias.",
            "correct": false
          },
          {
            "text": "Sí, equivale a una VM",
            "feedback": "Una VM tiene otro alcance.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/win32/winprog64/running-32-bit-applications"
      }
    ]
  },
  {
    "number": "27",
    "objective": "Aplicar un árbol de diagnóstico que diferencie integridad del sistema, almacenamiento y una falla de aplicación.",
    "prerequisites": "Backup y acceso WinRE antes de reparar; logs preservados y un síntoma reproducible.",
    "lessons": [
      {
        "heading": "Síntoma antes que receta",
        "text": "Definí cuándo empezó, qué cambió y una prueba reproducible. Síntoma → hipótesis → evidencia → prueba → descarte → reparación → validación evita encadenar comandos sin atribución. Event Viewer aporta eventos; Reliability Monitor correlaciona fallos y cambios. Modo seguro reduce componentes cargados y puede aislar un tercero, pero que funcione allí no identifica automáticamente al culpable."
      },
      {
        "heading": "SFC, DISM y CHKDSK",
        "text": "SFC verifica/repara archivos protegidos; DISM examina/repara el almacén de componentes que puede alimentar esa reparación. CHKDSK comprueba estructura del sistema de archivos, no repara un Windows lógico ni garantiza salud física. /f escribe correcciones y /r implica lectura extensa: en un medio que falla, respaldá o obtené imagen antes. No ejecutes los tres para cualquier síntoma."
      },
      {
        "heading": "Reparación y demostración",
        "text": "Usá primero consultas/verificación. Ante corrupción confirmada, un procedimiento compatible puede reparar Component Store y luego archivos protegidos; /Source debe coincidir con edición/build. WinRE cambia letras y alcance: una orden offline debe apuntar al Windows identificado. Conservar logs CBS/DISM permite verificar qué se hizo; una reparación sin volver a probar el síntoma no cierra el caso."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "sfc /verifyonly",
        "purpose": "Verificar archivos protegidos sin solicitar reparación.",
        "example": "Windows Resource Protection encontró/no encontró violaciones",
        "interpretation": "Es evidencia de integridad protegida, no prueba de hardware sano.",
        "admin": true,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "DISM /Online /Cleanup-Image /CheckHealth",
        "purpose": "Consultar si hay corrupción previamente marcada.",
        "example": "No component store corruption detected",
        "interpretation": "CheckHealth es rápido y no hace un análisis exhaustivo; un resultado normal no descarta toda falla.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Reproducí y fechá el síntoma; preservá eventos.",
      "Separá app, driver, archivo protegido y medio físico mediante una prueba mínima.",
      "Ensayá reparación en el laboratorio; prepará respaldo/WinRE para cambios reales.",
      "Repetí la carga y compará logs/resultado; si falla la hipótesis, reformulala."
    ],
    "verification": "Validá el síntoma original, reinicio y funciones afectadas; registrá “no resuelto” si la reparación de integridad no cambia la falla.",
    "pitfalls": [
      "No estresar un disco físicamente fallando con /r antes de imagen.",
      "No confundir un comando exitoso con una causa demostrada."
    ],
    "rollback": "Revertí el cambio específico o usá punto/imagen compatible. En WinRE identificá volumen y cifrado antes de cualquier escritura.",
    "mission": "Construí un expediente con hipótesis falsable, prueba, descarte e intervención única.",
    "scenario": "SFC no informa violaciones; la app falla solo después de instalar un plugin.",
    "decisions": [
      {
        "text": "Ejecutar CHKDSK /r como reparación del plugin",
        "feedback": "No atiende ese componente y carga el medio.",
        "correct": false
      },
      {
        "text": "Aislar el plugin y reproducir con la misma app",
        "feedback": "La integridad protegida y cronología orientan a una extensión.",
        "correct": true
      },
      {
        "text": "Formatear sin respaldo",
        "feedback": "Es una intervención destructiva sin descarte.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿SFC verifica todas las apps de terceros?",
        "choices": [
          {
            "text": "No; su alcance son archivos protegidos de Windows",
            "feedback": "Probá la aplicación y sus dependencias por separado.",
            "correct": true
          },
          {
            "text": "Solo escanea SMART",
            "feedback": "No es una herramienta de salud física.",
            "correct": false
          },
          {
            "text": "Sí, toda DLL",
            "feedback": "No cubre cualquier archivo.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿WinRE garantiza que Windows siga en C:?",
        "choices": [
          {
            "text": "Solo cambia en HDD",
            "feedback": "No depende de HDD/SSD.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "WinRE puede asignar letras diferentes; identificá la partición Windows antes de apuntar un comando offline.",
            "correct": false
          },
          {
            "text": "No; identificá el volumen antes de órdenes offline",
            "feedback": "Las letras pueden diferir.",
            "correct": true
          }
        ]
      }
    ],
    "lab": {
      "scenario": "repair",
      "label": "Windows Repair Bench"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/manufacture/desktop/repair-a-windows-image"
      }
    ]
  },
  {
    "number": "28",
    "objective": "Leer un BugCheck como evidencia y separar módulo implicado de causa raíz.",
    "prerequisites": "Volcados pueden contener datos sensibles; preservalos con acceso restringido, no los subas a EVO.",
    "lessons": [
      {
        "heading": "Qué registra un crash",
        "text": "Un BugCheck detiene el sistema para evitar continuar en un estado inválido. Stop Code y argumentos describen una clase de falla; Minidump y MEMORY.DMP tienen alcances distintos. Configuración de dump, espacio y pagefile influyen en qué se genera. Una foto del código sin argumentos/contexto limita mucho la conclusión."
      },
      {
        "heading": "No todos los códigos tienen una sola causa",
        "text": "IRQL_NOT_LESS_OR_EQUAL, MEMORY_MANAGEMENT, DPC_WATCHDOG, VIDEO_TDR, CRITICAL_PROCESS_DIED y SYSTEM_SERVICE_EXCEPTION delimitan caminos, no piezas únicas. WHEA registra errores de hardware reportados por la plataforma, pero su origen puede involucrar firmware, alimentación o estabilidad además de componente físico. Un driver en la pila puede recibir corrupción causada antes por otro."
      },
      {
        "heading": "Análisis y correlación",
        "text": "Con WinDbg y símbolos adecuados, !analyze -v produce hipótesis, pila y datos de contexto. Correlacioná versiones de drivers, eventos, carga y repetición. Kernel-Power 41 registra un apagado no limpio y no prueba fuente averiada. No uses Driver Verifier globalmente en una PC de producción: puede provocar crashes y exige plan de arranque/reversión."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-WinEvent -FilterHashtable @{LogName=\"System\";Id=1001} -MaxEvents 10 | Select-Object TimeCreated,ProviderName,Message",
        "purpose": "Buscar eventos asociados a BugCheck.",
        "example": "The computer has rebooted from a bugcheck ...",
        "interpretation": "El ID depende del proveedor; distinguí el mensaje de otros eventos 1001.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-ChildItem -LiteralPath \"C:\\Windows\\Minidump\" -Filter *.dmp | Select-Object Name,Length,LastWriteTime",
        "purpose": "Inventariar dumps sin analizarlos ni enviarlos.",
        "example": "...dmp | Length: ... | LastWriteTime: ...",
        "interpretation": "Ausencia puede significar configuración/espacio/fallo de escritura, no ausencia de BSOD.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Preservá código, argumentos, timestamp y dump si existe.",
      "Correlacioná cambio reciente y carga con eventos/driver.",
      "En Windows X-Ray probá hipótesis de hardware/driver sin tocar la PC.",
      "Aplicá una intervención justificada y repetí la condición de falla."
    ],
    "verification": "Exigí estabilidad en la carga original y registro de recurrencia; un reinicio exitoso aislado es evidencia limitada.",
    "pitfalls": [
      "No declarar culpable al primer .sys de una pila.",
      "No activar Verifier indiscriminadamente sin recuperación."
    ],
    "rollback": "Volvé al driver/configuración anterior; si una herramienta de estrés impide arrancar, usá el procedimiento de desactivación en Modo seguro/WinRE documentado previamente.",
    "mission": "Explicá qué demuestra y qué no demuestra un código, un módulo y un evento 41.",
    "scenario": "El dump menciona ntoskrnl.exe; el incidente empezó tras cambiar un driver y solo aparece bajo esa función.",
    "decisions": [
      {
        "text": "Correlacionar pila, argumentos y driver antes de atribuir causa",
        "feedback": "El kernel puede estar registrando el efecto, no originándolo.",
        "correct": true
      },
      {
        "text": "Culpar a la fuente por evento 41",
        "feedback": "El evento no demuestra esa causa.",
        "correct": false
      },
      {
        "text": "Reemplazar ntoskrnl.exe descargado de Internet",
        "feedback": "Rompe el sistema y no atiende causalidad.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un módulo en la pila es siempre la causa?",
        "choices": [
          {
            "text": "Sí, si es Microsoft",
            "feedback": "La procedencia no cambia ese razonamiento.",
            "correct": false
          },
          {
            "text": "Sí, por aparecer último",
            "feedback": "El orden no garantiza causalidad.",
            "correct": false
          },
          {
            "text": "No; puede ser víctima de corrupción previa",
            "feedback": "La pila necesita contexto y descarte.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿Kernel-Power 41 prueba una PSU dañada?",
        "choices": [
          {
            "text": "Sí, mide los rieles",
            "feedback": "El evento 41 informa apagado no limpio y no contiene una medición eléctrica de los rieles.",
            "correct": false
          },
          {
            "text": "No; informa apagado/reinicio no limpio",
            "feedback": "Exige evidencia eléctrica independiente.",
            "correct": true
          },
          {
            "text": "Siempre prueba malware",
            "feedback": "No identifica ese origen.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "xray",
      "label": "Windows X-Ray: fallas de kernel"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/drivers/debugger/bug-check-code-reference2"
      }
    ]
  },
  {
    "number": "29",
    "objective": "Distinguir latencia de drivers, renderizado, memoria y red al investigar stutter.",
    "prerequisites": "Misma escena, duración, driver y plan de energía; herramientas opcionales se consultan si ya están disponibles, no se instalan desde EVO.",
    "lessons": [
      {
        "heading": "Interrupciones y trabajo diferido",
        "text": "Una ISR responde a una interrupción y debe ser breve; una DPC difiere trabajo a un contexto de kernel. Ejecuciones prolongadas pueden demorar audio y otras tareas sensibles. IRQL no es prioridad de usuario: gobierna restricciones de ejecución. Un pico atribuido a ndis.sys puede pertenecer a la pila de red, no identificar por sí solo el fabricante responsable."
      },
      {
        "heading": "Síntomas diferentes",
        "text": "FPS bajo sostenido difiere de stutter episódico, freeze, input lag o network lag. Fallos de página duros pueden traer datos desde disco; shader compilation, presión de VRAM, temperatura, potencia y tareas de fondo también producen pausas. Una gráfica de FPS promedio esconde la distribución temporal y no permite culpar DPC automáticamente."
      },
      {
        "heading": "Captura y descarte",
        "text": "LatencyMon orienta con tiempos/reportes; WPR/WPA permite correlacionar CPU, interrupciones y espera con timestamps. Registrá el intervalo exacto del síntoma y repetí muestras. Probá un driver/dispositivo autorizado cada vez, preservando conectividad y configuración. Si captura y síntoma no coinciden, “evidencia insuficiente” es una conclusión válida."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "wpr -profiles",
        "purpose": "Consultar perfiles disponibles de Windows Performance Recorder.",
        "example": "GeneralProfile ...",
        "interpretation": "Perfiles/herramienta dependen del entorno instalado; listar no crea una traza.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-WinEvent -FilterHashtable @{LogName=\"System\";StartTime=(Get-Date).AddMinutes(-10)} -MaxEvents 40 | Select-Object TimeCreated,ProviderName,Id",
        "purpose": "Correlacionar eventos con el intervalo observado.",
        "example": "TimeCreated: ... | ProviderName: ...",
        "interpretation": "Eventos sin una traza temporal no miden directamente duración ISR/DPC.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Clasificá la pausa y registrá escena/tiempo.",
      "Repetí muestras de frametime y anota actividad/red/temperatura conocida.",
      "Capturá con herramienta instalada y correlacioná interrupciones, CPU y esperas.",
      "Probá una sola causa y aceptá descarte si no reproduce una mejora."
    ],
    "verification": "La validación exige reducir la recurrencia/distribución de pausas, sin degradar audio, red o estabilidad bajo la misma carga.",
    "pitfalls": [
      "No confundir DPC alto aislado con causa de todos los tirones.",
      "No desactivar dispositivos críticos para bajar un número."
    ],
    "rollback": "Restaurá driver y energía/dispositivos originales; cerrá capturas y eliminá solo trazas de prueba si ya están respaldadas.",
    "mission": "Clasificá tres pausas y explicá cuál necesitaría una traza y cuál evidencia todavía falta.",
    "scenario": "Hay un pico DPC fuera del intervalo del tirón; durante el tirón se observa compilación de shaders.",
    "decisions": [
      {
        "text": "Desactivar toda la red definitivamente",
        "feedback": "Introduce efectos ajenos sin prueba.",
        "correct": false
      },
      {
        "text": "Culpar al driver con el número máximo",
        "feedback": "No hay coincidencia temporal.",
        "correct": false
      },
      {
        "text": "Correlacionar tiempos y probar la hipótesis de compilación",
        "feedback": "Un evento fuera de ventana no explica automáticamente el síntoma.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿FPS promedio alto descarta stutter?",
        "choices": [
          {
            "text": "Sí, resume todo",
            "feedback": "No describe la cola temporal.",
            "correct": false
          },
          {
            "text": "No; faltan distribución y tiempos de cuadros",
            "feedback": "Picos breves pueden coexistir con un promedio alto.",
            "correct": true
          },
          {
            "text": "Solo con VRR",
            "feedback": "VRR no elimina cualquier pausa.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿ISR y DPC son procesos de usuario?",
        "choices": [
          {
            "text": "No; son mecanismos de ejecución de kernel",
            "feedback": "Tienen restricciones e IRQL propios.",
            "correct": true
          },
          {
            "text": "Son siempre virus",
            "feedback": "Son mecanismos normales del sistema.",
            "correct": false
          },
          {
            "text": "Sí, se reparan cerrando Explorer",
            "feedback": "No equivalen a ese proceso.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "scheduler",
      "label": "Scheduler y cargas de CPU"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/drivers/kernel/introduction-to-dpcs"
      }
    ]
  },
  {
    "number": "30",
    "objective": "Diseñar capturas de rendimiento reproducibles y leer correlaciones sin inventar causalidad.",
    "prerequisites": "Intervalo y carga definidos; registrá versión, alimentación y timestamps. Una traza puede contener rutas y actividad sensible.",
    "lessons": [
      {
        "heading": "Contadores y tasas",
        "text": "PerfMon y Data Collector Sets muestrean contadores de CPU, memoria, disco y red. Algunos son tasas, otros cantidades o promedios derivados; una CPU acumulada no es porcentaje instantáneo. Memory Available, Commit y hard faults contestan preguntas distintas. Latencia de disco elevada con poco throughput puede indicar espera; no se reduce a “MB/s”."
      },
      {
        "heading": "ETW y registros temporales",
        "text": "ETW reúne providers, sessions y eventos con timestamps; WPR configura capturas y WPA analiza CPU, I/O y esperas. Una sesión puede perder eventos por buffers o carga, lo que limita conclusiones. Elegí el perfil que responde a la hipótesis; capturar todos los providers indefinidamente aumenta ruido y tamaño."
      },
      {
        "heading": "Correlación entre subsistemas",
        "text": "PresentMon estudia presentación de cuadros cuando está disponible; no mide por sí solo temperatura o causa de cada pico. Alineá ventanas con CPU/GPU/disco/red y contexto de la aplicación. Compará mediana, dispersión y valores extremos bajo condiciones iguales; una mejora en promedio puede esconder peores percentiles o estabilidad."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-Counter -ListSet * | Select-Object -First 10 CounterSetName",
        "purpose": "Reconocer contadores instalados y localizados.",
        "example": "CounterSetName: [nombres del idioma local]",
        "interpretation": "Las rutas de contadores pueden estar traducidas; no copies nombres ingleses sin inventario.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "wpr -status",
        "purpose": "Verificar si hay una captura activa.",
        "example": "No recording in progress",
        "interpretation": "No iniciar/detener una sesión ajena sin conocer su propietario y alcance.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Definí hipótesis, métrica, unidad e intervalo de muestreo.",
      "Inventariá contadores/perfiles y registrá carga reproducible.",
      "Capturá una ventana corta antes y después de una intervención única.",
      "Compará series equivalentes y documentá eventos perdidos, ruido y resultado."
    ],
    "verification": "El informe debe incluir unidades, muestras, timestamps y límites; una captura debe poder repetirse por otro técnico.",
    "pitfalls": [
      "No comparar muestras de distintas cargas o idiomas sin revisar rutas.",
      "No afirmar que correlación implica causalidad."
    ],
    "rollback": "Conservá configuración de Data Collector y cerrá solo tu sesión; revertí intervención si empeora cualquier métrica relevante.",
    "mission": "Diseñá una captura de cinco minutos: hipótesis → contadores → timestamps → criterio de comparación.",
    "scenario": "El promedio mejora, pero los cuadros más lentos empeoran y la carga de la segunda prueba era distinta.",
    "decisions": [
      {
        "text": "Declarar optimización por el promedio",
        "feedback": "Ignora regresiones y confusores.",
        "correct": false
      },
      {
        "text": "Repetir con condiciones iguales y comparar distribución",
        "feedback": "Sin igualdad de carga ni percentiles no se atribuye mejora.",
        "correct": true
      },
      {
        "text": "Borrar la primera traza",
        "feedback": "Elimina la línea base.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un contador CPU acumulado expresa uso instantáneo?",
        "choices": [
          {
            "text": "No; necesitás diferencias y tiempo",
            "feedback": "La tasa requiere una ventana de muestreo.",
            "correct": true
          },
          {
            "text": "Solo expresa temperatura",
            "feedback": "Son magnitudes diferentes.",
            "correct": false
          },
          {
            "text": "Sí, ya es porcentaje",
            "feedback": "Un contador de tiempo acumulado necesita diferencia entre muestras y duración del intervalo para derivar una tasa.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Eventos ETW perdidos importan?",
        "choices": [
          {
            "text": "Solo si el archivo es pequeño",
            "feedback": "Tamaño no garantiza integridad de eventos.",
            "correct": false
          },
          {
            "text": "No, se inventan al exportar",
            "feedback": "No se reconstruyen automáticamente.",
            "correct": false
          },
          {
            "text": "Sí; limitan lo observado",
            "feedback": "Hay que declarar completitud de la captura.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/test/wpt/"
      }
    ]
  },
  {
    "number": "31",
    "objective": "Elegir instrumentos Sysinternals y filtrar evidencia antes de intervenir sobre procesos o inicio.",
    "prerequisites": "Herramientas oficiales ya disponibles y consentimiento para capturas; no aceptar binarios de sitios de terceros.",
    "lessons": [
      {
        "heading": "Cada instrumento responde una pregunta",
        "text": "Process Explorer relaciona procesos, handles y módulos; Process Monitor captura actividad de archivos/Registro/procesos con filtros. Autoruns inventaría puntos de persistencia; TCPView relaciona conexiones. RAMMap clasifica uso de memoria; Sigcheck verifica firma y metadatos; Handle identifica referencias a objetos; Streams enumera ADS. Ninguno certifica automáticamente que toda entrada desconocida sea malware."
      },
      {
        "heading": "Filtrar antes de concluir",
        "text": "En Procmon elegí proceso, ruta y resultado; reproducí una operación pequeña y detené la captura. NAME NOT FOUND suele ser una búsqueda normal y ACCESS DENIED puede ser un fallback esperado. Correlacioná el último acceso fallido con el flujo real. Autoruns puede deshabilitar una entrada reversible, pero borrarla pierde el camino de rollback y puede impedir arranque."
      },
      {
        "heading": "Privilegios y PsTools",
        "text": "Algunas consultas exigen elevación para ver otros procesos. PsTools puede administrar sistemas remotos y ejecutar acciones con gran alcance: se estudia su modelo, no se utiliza como atajo de permisos. VirusTotal/u otros servicios pueden enviar hashes o muestras; no cargues archivos del cliente sin consentimiento. Guardá capturas con filtros y contexto."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "sigcheck.exe -nobanner -a -h \"C:\\Windows\\System32\notepad.exe\"",
        "purpose": "Inspeccionar un binario con Sigcheck oficial instalado.",
        "example": "Verified: Signed | SHA256: ...",
        "interpretation": "La firma prueba integridad/procedencia del firmante, no toda la conducta del proceso.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "handle.exe -?",
        "purpose": "Consultar sintaxis del instrumento instalado.",
        "example": "Usage: handle ...",
        "interpretation": "Cerrar handles por fuerza puede corromper trabajo; aquí se consulta ayuda, no se ejecuta -c.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Elegí instrumento según proceso, inicio, I/O, memoria o red.",
      "Definí filtro y ventana de captura, preservando privacidad.",
      "Reproducí la operación y distinguí fallos esperados de bloqueos causales.",
      "Deshabilitá solo una entrada de prueba autorizada y restaurala si no cambia el síntoma."
    ],
    "verification": "Conservá ruta, proceso, resultado y tiempo del evento que explica el síntoma; descartá ruido con una segunda prueba.",
    "pitfalls": [
      "No borrar entradas de Autoruns por no reconocer el nombre.",
      "No cerrar handles ni procesos críticos de producción."
    ],
    "rollback": "Rehabilitá la entrada exacta y reiniciá su consumidor; preservá export previo y una vía de arranque segura.",
    "mission": "Planteá un filtro Procmon para una app que no guarda: proceso, ruta, resultado y ventana.",
    "scenario": "Procmon registra varios NAME NOT FOUND antes de que la aplicación abra correctamente su archivo de configuración.",
    "decisions": [
      {
        "text": "Ver el flujo completo y el acceso final exitoso",
        "feedback": "Los intentos de búsqueda pueden ser normales.",
        "correct": true
      },
      {
        "text": "Concluir malware por cualquier acceso fallido",
        "feedback": "El resultado no identifica intención.",
        "correct": false
      },
      {
        "text": "Borrar todas las rutas no encontradas",
        "feedback": "No tiene sentido como reparación.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Signed significa comportamiento garantizado seguro?",
        "choices": [
          {
            "text": "Significa archivo sin permisos",
            "feedback": "La firma y las ACL son mecanismos distintos; Signed no describe quién tiene acceso al archivo.",
            "correct": false
          },
          {
            "text": "Sí, nunca falla",
            "feedback": "Un binario firmado puede tener bugs.",
            "correct": false
          },
          {
            "text": "No; valida aspectos de firma/procedencia",
            "feedback": "Analizá también función y contexto.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿Deshabilitar y borrar en Autoruns son equivalentes?",
        "choices": [
          {
            "text": "Sí, ambos recuperan solos",
            "feedback": "Borrar pierde información.",
            "correct": false
          },
          {
            "text": "No; deshabilitar conserva una vía más directa de retorno",
            "feedback": "Registrá siempre la entrada original.",
            "correct": true
          },
          {
            "text": "Borrar siempre acelera",
            "feedback": "Una entrada puede ser necesaria y el tiempo depende de la carga; borrar no demuestra mejora.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/sysinternals/"
      }
    ]
  },
  {
    "number": "32",
    "objective": "Seguir una operación desde user mode hasta kernel, identificar gestores y explicar límites de observación.",
    "prerequisites": "Lectura de arquitectura y herramientas de consulta; EVO no ejecuta código de kernel ni cambia privilegios.",
    "lessons": [
      {
        "heading": "De syscall a objeto",
        "text": "En Windows NT, la aplicación usa APIs que pueden llegar a system calls para servicios del Executive. Object Manager representa objetos y handles; Security Reference Monitor comprueba derechos contra token y descriptores. Un handle es una referencia con acceso definido, no una dirección libre para tocar memoria. Session y contexto de seguridad afectan lo visible."
      },
      {
        "heading": "Gestores que cooperan",
        "text": "Process Manager crea procesos/hilos; Thread Scheduler asigna CPU y realiza context switches. Memory Manager administra espacios virtuales, compromiso y páginas; Cache Manager coordina caché de archivos con Memory/I/O Manager. Configuration Manager administra Registro; PnP y Power Manager coordinan dispositivos y estados. HAL abstrae detalles de plataforma: no es un driver genérico que se reemplaza para optimizar."
      },
      {
        "heading": "Fronteras e interpretación",
        "text": "User mode y kernel mode separan privilegios y manejo de fallas; Ring 3/0 describe niveles de ejecución en arquitecturas que los implementan, no todos los detalles de NT. Kernel y Executive tienen funciones distintas. Un aumento de handles puede indicar trabajo legítimo o una fuga; necesitás tendencia y tipo. Más context switches no es siempre peor: depende de carga y latencia requerida."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-Process | Select-Object Id,ProcessName,HandleCount,Threads,WorkingSet64",
        "purpose": "Observar cantidades expuestas por procesos.",
        "example": "HandleCount: 580 | WorkingSet64: ...",
        "interpretation": "Muestreá tendencia, no declares fuga por una cantidad aislada; Threads es una colección.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "whoami /all",
        "purpose": "Reconocer identidad, grupos y privilegios de la sesión.",
        "example": "Privileges: ... | Groups: ...",
        "interpretation": "No enumera todos los objetos del kernel ni concede esos privilegios automáticamente.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Elegí una operación: abrir archivo, asignar memoria o leer Registro.",
      "Dibujá API → syscall → gestores → comprobación de permisos → resultado.",
      "Observá handles/working set antes y después bajo carga equivalente.",
      "Contrastá crecimiento sostenido con liberación al cerrar el trabajo."
    ],
    "verification": "Explicá qué gestor interviene y qué medición realmente lo evidencia; no confundas esquemas didácticos con trazas de kernel.",
    "pitfalls": [
      "No escribir memoria kernel ni alterar HAL para “acelerar”.",
      "No interpretar handles elevados como fuga sin serie temporal."
    ],
    "rollback": "Las consultas no cambian arquitectura; cerrá únicamente la app de prueba y verificá liberación de recursos.",
    "mission": "Anotá el recorrido de abrir un archivo y una condición de acceso denegado con token/ACL.",
    "scenario": "Un proceso aumenta handles al abrir 100 documentos y vuelve a su línea base al cerrarlos.",
    "decisions": [
      {
        "text": "Reemplazar HAL",
        "feedback": "No atiende referencias de objetos de usuario.",
        "correct": false
      },
      {
        "text": "Declarar fuga por el pico",
        "feedback": "No considera liberación.",
        "correct": false
      },
      {
        "text": "Registrar asignación y liberación; no diagnosticar fuga",
        "feedback": "La tendencia y retorno son compatibles con uso legítimo.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Un handle concede acceso ilimitado a cualquier objeto?",
        "choices": [
          {
            "text": "Sí, equivale a administrador",
            "feedback": "No implica ese privilegio.",
            "correct": false
          },
          {
            "text": "No; referencia un objeto con derechos definidos",
            "feedback": "El control de acceso sigue aplicando.",
            "correct": true
          },
          {
            "text": "Es siempre una dirección física",
            "feedback": "No es esa representación.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Un context switch prueba mal rendimiento?",
        "choices": [
          {
            "text": "No; evaluá carga y latencia",
            "feedback": "Es un mecanismo normal del scheduler.",
            "correct": true
          },
          {
            "text": "Solo existe en GPU",
            "feedback": "Los hilos de CPU también cambian contexto.",
            "correct": false
          },
          {
            "text": "Sí, cada cambio es falla",
            "feedback": "No es una interpretación válida.",
            "correct": false
          }
        ]
      }
    ],
    "lab": {
      "scenario": "scheduler",
      "label": "Planificador y silicio"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/drivers/kernel/overview-of-windows-components"
      }
    ]
  },
  {
    "number": "33",
    "objective": "Entender metadata, permisos y enlaces NTFS para investigar archivos sin destruir referencias.",
    "prerequisites": "Volumen NTFS y carpeta de prueba; no tomar propiedad del sistema ni seguir enlaces sin conocer destino.",
    "lessons": [
      {
        "heading": "Un archivo no es solo sus bytes",
        "text": "La MFT conserva File Records y atributos; clusters guardan contenido no residente. Nombre, timestamps, seguridad y streams forman parte de metadata. Un archivo puede existir y no verse por filtros/atributos de Explorer, ACL o porque se observa otro punto de montaje. Journaling mejora consistencia de operaciones, no garantiza rescatar contenido borrado."
      },
      {
        "heading": "Identidad y autorización",
        "text": "ACL describe derechos asociados a SIDs; Owner puede modificar aspectos de seguridad, pero no equivale a acceso irrestricto a cada contenido. Get-Acl e icacls permiten examinar herencia y reglas. Cambiar propietario para evitar un acceso denegado puede romper aplicaciones y mantenimiento. Separá falta de permiso de archivo inexistente."
      },
      {
        "heading": "Enlaces y streams",
        "text": "Hard links apuntan a un mismo archivo dentro del volumen; borrar un nombre no necesariamente elimina sus bytes si queda otra referencia. Junctions y symbolic links redirigen mediante reparse points con límites distintos. Alternate Data Streams añaden flujos con nombre; Zone.Identifier suele marcar origen descargado, no prueba malware. Copiar a otro sistema de archivos puede perder streams o semántica de enlaces."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-Item -LiteralPath \"C:\\EVO_Prueba\\archivo.txt\" -Stream *",
        "purpose": "Enumerar streams de un archivo de prueba.",
        "example": "Stream: :$DATA\nStream: Zone.Identifier",
        "interpretation": "Solo funciona con soporte del proveedor/sistema de archivos; un ADS no implica contenido malicioso.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "fsutil hardlink list \"C:\\EVO_Prueba\\archivo.txt\"",
        "purpose": "Inspeccionar referencias hard link.",
        "example": "\\EVO_Prueba\\archivo.txt\n\\EVO_Prueba\\alias.txt",
        "interpretation": "Dos nombres pueden referir al mismo contenido; no sumes tamaño físico por cada referencia.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Creá una carpeta de prueba, anotá sistema de archivos y permisos.",
      "Identificá metadata, streams y enlaces sin eliminarlos.",
      "Compará dos nombres de un hard link y las consecuencias de borrar solo una referencia en el escenario seguro.",
      "Antes de copiar/restaurar, comprobá contenido, permisos y streams necesarios."
    ],
    "verification": "Una restauración válida preserva las propiedades requeridas, no solamente el nombre y cantidad de bytes.",
    "pitfalls": [
      "No seguir reparse points en limpiezas recursivas indiscriminadas.",
      "No cambiar Owner/ACL de Windows para hacer desaparecer un error."
    ],
    "rollback": "Recreá solo enlaces/ACL de la carpeta de prueba desde estado registrado; datos borrados exigen copia válida.",
    "mission": "Distingí hard link, junction, symlink y ADS con un ejemplo y un límite de cada uno.",
    "scenario": "Explorer informa dos archivos de 100 MB que son hard links al mismo contenido.",
    "decisions": [
      {
        "text": "Borrar uno esperando liberar siempre 100 MB",
        "feedback": "Mientras quede otra referencia el contenido sigue vivo.",
        "correct": false
      },
      {
        "text": "Verificar referencias y contabilizar el contenido compartido",
        "feedback": "El mismo contenido no debe sumarse como dos copias físicas completas.",
        "correct": true
      },
      {
        "text": "Formatear para quitar duplicados",
        "feedback": "Es destructivo y no corresponde al fenómeno.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Zone.Identifier demuestra malware?",
        "choices": [
          {
            "text": "No; suele indicar información de origen",
            "feedback": "Interpretá contenido, firma y contexto.",
            "correct": true
          },
          {
            "text": "Garantiza cifrado",
            "feedback": "No es un indicador de cifrado.",
            "correct": false
          },
          {
            "text": "Sí, todo ADS es malicioso",
            "feedback": "ADS es una capacidad de NTFS.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Borrar un hard link siempre elimina el archivo completo?",
        "choices": [
          {
            "text": "Solo en SSD",
            "feedback": "La semántica no depende del tipo de medio.",
            "correct": false
          },
          {
            "text": "Sí, todos los nombres desaparecen",
            "feedback": "Cada hard link es una referencia independiente; otras referencias pueden conservar el archivo.",
            "correct": false
          },
          {
            "text": "No; puede quedar otra referencia",
            "feedback": "Contá enlaces antes de inferir liberación.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/win32/fileio/file-management"
      }
    ]
  },
  {
    "number": "34",
    "objective": "Medir Component Store y diferenciar tamaño aparente de espacio recuperable sin borrar WinSxS.",
    "prerequisites": "Windows con respaldo y mantenimiento fuera de una actualización activa; consultas elevadas.",
    "lessons": [
      {
        "heading": "Componentes y mantenimiento",
        "text": "WinSxS conserva versiones y componentes que CBS usa para instalar, reparar y revertir paquetes. Side-by-Side permite convivir versiones requeridas por consumidores distintos. No es una carpeta de temporales que el usuario deba vaciar. Un archivo con referencias hard link puede aparecer bajo varias rutas sin ocupar varias copias físicas completas."
      },
      {
        "heading": "Tamaño informado y recuperable",
        "text": "Explorer puede sumar tamaños lógicos de nombres y producir una impresión incorrecta. DISM AnalyzeComponentStore diferencia categorías de tamaño, paquetes recuperables y recomendación de limpieza. Un número grande no diagnostica corrupción. CBS logs muestran mantenimiento; no borres registros durante un incidente que requiere evidencia."
      },
      {
        "heading": "Limpieza con consecuencias",
        "text": "StartComponentCleanup elimina determinadas versiones reemplazadas mediante el servicio de mantenimiento; /ResetBase reduce posibilidades de desinstalar updates existentes y no tiene una reversión simple. Se enseña como simulación, no receta ejecutable. Priorizar datos de usuario respaldados y cachés soportadas es diferente de destruir la fuente de reparación de SFC."
      }
    ],
    "commands": [
      {
        "shell": "CMD",
        "code": "DISM /Online /Cleanup-Image /AnalyzeComponentStore",
        "purpose": "Analizar tamaño y recomendación.",
        "example": "Component Store Cleanup Recommended: Yes/No",
        "interpretation": "Leé tamaño real/categorías y paquetes recuperables; no equipares tamaño de Explorer con espacio recuperable.",
        "admin": true,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "DISM /Online /Cleanup-Image /CheckHealth",
        "purpose": "Consultar corrupción previamente marcada.",
        "example": "No component store corruption detected",
        "interpretation": "Tamaño y salud son preguntas distintas.",
        "admin": true,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Anotá build y estado de Update; preservá logs si hay incidente.",
      "Compará tamaño de Explorer con análisis DISM.",
      "En la simulación elegí limpieza soportada solo tras revisar consecuencias; descartá borrado manual y ResetBase automático.",
      "Si una intervención real está autorizada, verificá servicing y espacio antes/después."
    ],
    "verification": "El éxito no es únicamente liberar espacio: Update y verificación de archivos deben seguir funcionando y el plan de rollback conservar su alcance.",
    "pitfalls": [
      "Jamás borrar WinSxS manualmente ni cambiar su propietario.",
      "No prometer desinstalar todas las KB después de ResetBase."
    ],
    "rollback": "Una operación irreversible requiere imagen recuperable anterior; detener una simulación no cambia el sistema real.",
    "mission": "Explicá tamaño aparente, tamaño real y recuperable con una salida DISM de ejemplo.",
    "scenario": "Explorer calcula 20 GB y DISM muestra mucho menos recuperable, con hard links compartidos.",
    "decisions": [
      {
        "text": "Usar el análisis soportado y preservar el almacén",
        "feedback": "El tamaño lógico no equivale a una copia física independiente.",
        "correct": true
      },
      {
        "text": "Aplicar ResetBase como primera prueba",
        "feedback": "Recorta rollback sin responder a la medición.",
        "correct": false
      },
      {
        "text": "Borrar todo WinSxS",
        "feedback": "Rompe servicing y reparación.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿WinSxS es solo cache descartable?",
        "choices": [
          {
            "text": "Solo guarda fotos",
            "feedback": "WinSxS guarda componentes y versiones que CBS usa en mantenimiento y reparación de Windows.",
            "correct": false
          },
          {
            "text": "Sí, Windows lo recrea siempre",
            "feedback": "No es recuperable de esa forma garantizada.",
            "correct": false
          },
          {
            "text": "No; participa en servicing y reparación",
            "feedback": "Su contenido tiene contratos con CBS.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿ResetBase conserva toda posibilidad de desinstalar updates?",
        "choices": [
          {
            "text": "Sí, siempre",
            "feedback": "No preserva toda reversión.",
            "correct": false
          },
          {
            "text": "No; puede impedir revertir paquetes existentes",
            "feedback": "Exige comprender y aceptar ese alcance.",
            "correct": true
          },
          {
            "text": "Es solo lectura",
            "feedback": "Es una operación de mantenimiento modificadora.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows-hardware/manufacture/desktop/manage-the-component-store"
      }
    ]
  },
  {
    "number": "35",
    "objective": "Auditar la huella de un optimizador y medir su efecto sin depender de promesas comerciales.",
    "prerequisites": "Línea base y software de prueba confiable; instaladores de terceros se ensayan fuera de producción.",
    "lessons": [
      {
        "heading": "Promesa y mecanismo",
        "text": "Registry cleaners eliminan entradas sin demostrar un cuello de botella; RAM boosters pueden expulsar working sets y provocar más lecturas después. Game/Internet boosters suelen cambiar servicios, prioridades o TCP; no crean ancho de banda ni garantizan latencia. Driver boosters pueden reemplazar paquetes específicos OEM. One-click repair mezcla intervenciones y elimina atribución de causa."
      },
      {
        "heading": "La huella también cuesta",
        "text": "Inventariá services, tasks, startup, drivers, conexiones y ramas propias de Registro. Un programa que promete menos procesos puede agregar actualizadores, filtros y monitoreo. No uses Win32_Product para inventariar: su consulta puede desencadenar comprobación/reconfiguración de instaladores MSI. Usá las listas de aplicaciones y las claves Uninstall como fuentes con límites."
      },
      {
        "heading": "A/B y salida limpia",
        "text": "Medí tarea representativa con mismas condiciones antes/después, incluyendo estabilidad, memoria, I/O y demora de apertura. Un working set menor no prueba menos compromiso ni mejor respuesta. Para desinstalar preferí el mecanismo soportado, revisá reinicio y residuos documentados; no borres globalmente carpetas/Registro ni recrees dependencias del propio optimizador."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-CimInstance Win32_Service | Select-Object Name,StartMode,PathName",
        "purpose": "Inventariar servicios y binarios.",
        "example": "Name: VendorUpdater | StartMode: Auto",
        "interpretation": "Compará snapshots; un nombre nuevo requiere relacionarlo con el instalador.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-ItemProperty \"HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*\",\"HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*\" | Select-Object DisplayName,DisplayVersion,Publisher",
        "purpose": "Consultar software registrado sin Win32_Product.",
        "example": "DisplayName: ... | Publisher: ...",
        "interpretation": "No incluye todas las apps/instalaciones de usuario; contrastá Configuración y alcance de HKCU.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Guardá inventario y medición antes de cualquier prueba.",
      "En un entorno descartable instalá solo el software evaluado y observá su huella.",
      "Repetí tarea bajo mismas condiciones; medí efectos secundarios.",
      "Desinstalá por mecanismo soportado y confirmá retorno al estado esperado."
    ],
    "verification": "Exigí mejora reproducible de la tarea y ausencia de degradaciones; no aceptes un panel que solo se califica a sí mismo.",
    "pitfalls": [
      "No usar número de entradas “limpiadas” como evidencia de rendimiento.",
      "No medir solo RAM libre después de expulsar caches."
    ],
    "rollback": "Revertí cada tweak documentado o restaurá imagen; desinstalar la app no garantiza que todos sus cambios se reviertan.",
    "mission": "Construí un informe antes/después con huella, métrica y veredicto conservar/revertir.",
    "scenario": "El booster baja working set, pero la segunda apertura tarda más y aparecen nuevos servicios.",
    "decisions": [
      {
        "text": "Instalar otro booster para corregirlo",
        "feedback": "Agrega variables y dependencia.",
        "correct": false
      },
      {
        "text": "Declarar éxito por RAM libre",
        "feedback": "No mide utilidad de la memoria ni respuesta.",
        "correct": false
      },
      {
        "text": "Rechazar la mejora declarada y comparar tarea/huella",
        "feedback": "La métrica aislada oculta el costo de recargar páginas y servicios.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿Más RAM libre prueba mayor fluidez?",
        "choices": [
          {
            "text": "Sí, es el único criterio",
            "feedback": "No describe la tarea.",
            "correct": false
          },
          {
            "text": "No; caches útiles pueden haber sido expulsadas",
            "feedback": "Medí respuesta y presión de memoria.",
            "correct": true
          },
          {
            "text": "Sí, elimina todos los faults",
            "feedback": "Expulsar páginas del working set puede obligar a recargarlas al reutilizarlas y aumentar latencia.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Win32_Product es ideal para inventario inocuo?",
        "choices": [
          {
            "text": "No; puede desencadenar validaciones MSI",
            "feedback": "Usá fuentes de inventario apropiadas con límites.",
            "correct": true
          },
          {
            "text": "Solo funciona para GPU",
            "feedback": "Win32_Product enumera productos MSI y puede activar validaciones; no es un inventario de gráficos.",
            "correct": false
          },
          {
            "text": "Sí, nunca tiene efectos",
            "feedback": "Puede reconfigurar productos.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "36",
    "objective": "Localizar el recurso limitante según cuándo aparece la lentitud y justificar una mejora concreta.",
    "prerequisites": "Síntoma reproducible, inventario mínimo y carga representativa; no inventar sensores no disponibles.",
    "lessons": [
      {
        "heading": "La pregunta inicial divide el árbol",
        "text": "Separá arranque, apertura, uso continuo, juegos, copias, Internet y degradación después de horas. Startup/services/tasks pueden demorar login; apertura puede depender de almacenamiento y caché; lentitud web puede ser DNS/red, no CPU. El mismo porcentaje de uso significa cosas distintas según duración y latencia observada."
      },
      {
        "heading": "Presión y esperas",
        "text": "CPU sostenida exige proceso/hilos/carga; RAM requiere compromiso, disponible y hard faults; disco requiere tiempo activo y latencia, no solo throughput. GPU/iGPU incluye memoria compartida y presentación. Temperatura/power necesitan una fuente real: no inferir throttling por una sensación. Drivers y eventos ayudan a correlacionar una degradación tras horas."
      },
      {
        "heading": "Actualizar según evidencia",
        "text": "En una PC de 4 GB/HDD puede existir presión de memoria y espera de I/O simultáneas; pasar a SSD no crea RAM y agregar RAM no cura un enlace a 100 Mbps. En 8 GB, SSD pequeño o iGPU, evaluá la carga y margen real. Elegí un cambio con costo, hipótesis y prueba posterior; “optimizar Windows” no reemplaza identificar el límite."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory; Get-CimInstance Win32_LogicalDisk -Filter \"DriveType=3\" | Select-Object DeviceID,Size,FreeSpace",
        "purpose": "Reconocer capacidad y margen.",
        "example": "FreePhysicalMemory: [KiB]\nFreeSpace: [bytes]",
        "interpretation": "Son unidades y fotografías distintas; no compararlas como porcentaje sin convertir.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 8 ProcessName,CPU,WorkingSet64",
        "purpose": "Orientar investigación por consumidores.",
        "example": "CPU: [segundos acumulados]",
        "interpretation": "Para uso actual necesitás diferencias temporales o una herramienta de tasa.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Definí cuándo está lenta y una tarea con duración medible.",
      "Observá recurso/espera durante esa misma ventana y buscá confusores.",
      "Probá una intervención única reversible o un escenario de actualización.",
      "Repetí tarea y validá que no empeore estabilidad, batería ni otra función."
    ],
    "verification": "Justificá el cambio por un límite medido y mejora reproducible; si falta sensor o captura, marcá dato desconocido.",
    "pitfalls": [
      "No diagnosticar “CPU lenta” solo por sumar CPU acumulada.",
      "No comprar piezas según porcentajes genéricos de bottleneck."
    ],
    "rollback": "Restaurá ajustes/driver anterior o configuración de prueba; conservá imagen antes de cambios de almacenamiento.",
    "mission": "Entregá árbol síntoma → intervalo → recurso → prueba → mejora propuesta → costo y validación.",
    "scenario": "Una PC tarda al abrir apps y muestra alta latencia de disco; al mismo tiempo el uso de CPU es bajo.",
    "decisions": [
      {
        "text": "Comprar CPU porque toda lentitud es procesador",
        "feedback": "No atiende la evidencia.",
        "correct": false
      },
      {
        "text": "Investigar I/O, presión de memoria y salud del medio",
        "feedback": "Una espera puede bloquear la tarea con CPU baja.",
        "correct": true
      },
      {
        "text": "Vaciar Registro",
        "feedback": "No identifica la espera.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿CPU baja descarta un cuello de botella?",
        "choices": [
          {
            "text": "No; la tarea puede esperar I/O o sincronización",
            "feedback": "El límite puede estar en otro recurso.",
            "correct": true
          },
          {
            "text": "Solo en Windows antiguo",
            "feedback": "Es un fenómeno general.",
            "correct": false
          },
          {
            "text": "Sí, todo está sano",
            "feedback": "No es una conclusión suficiente.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Qué justifica una actualización?",
        "choices": [
          {
            "text": "Un porcentaje fijo universal",
            "feedback": "La carga modifica la relación entre recursos.",
            "correct": false
          },
          {
            "text": "Una puntuación de marketing",
            "feedback": "No prueba el caso propio.",
            "correct": false
          },
          {
            "text": "Una limitación observada y prueba representativa",
            "feedback": "Relaciona capacidad con tarea concreta.",
            "correct": true
          }
        ]
      }
    ],
    "lab": {
      "scenario": "repair",
      "label": "Diagnóstico de fallas reproducibles"
    },
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "37",
    "objective": "Consultar expedientes existentes y transferir un método de descarte a un incidente nuevo.",
    "prerequisites": "La biblioteca identifica ejemplos didácticos y sus fuentes; no presenta casos simulados como mediciones de clientes reales.",
    "lessons": [
      {
        "heading": "De receta a expediente",
        "text": "Una base resuelta necesita síntoma, hipótesis, prueba, evidencia, descarte, causa, solución y validación. El nombre comercial del error no basta. Buscá por contexto y evidencia: misma pantalla negra puede provenir de boot, señal, driver o energía. Un resultado encontrado orienta una prueba, no autoriza ejecutar su solución en otra máquina."
      },
      {
        "heading": "Cobertura y honestidad",
        "text": "Las categorías Boot, Update, Drivers, Disk, RAM, CPU, GPU, Network, Wi-Fi, Audio, Bluetooth, USB, Printer, Display, HDR, Power, Services, Apps, Security, BSOD, Stutter y Recovery ordenan casos. El lector integra el corpus disponible de sectores anteriores, Repair Lab y los nuevos sectores; muestra su cantidad real y fuente. No inventa cientos de expedientes ni reescribe contenido ya funcional."
      },
      {
        "heading": "Transferencia y mantenimiento",
        "text": "Compará dos hipótesis del mismo síntoma y elegí una prueba que las diferencie. Conservá las pruebas negativas y límites: un caso sin dump o sensor puede quedar inconcluso. Exportá la ficha del incidente con resultado y rollback para alimentar una biblioteca de trabajo local. Una solución sin validación temporal debe figurar como propuesta, no como caso cerrado."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Get-FileHash -LiteralPath \"C:\\EVO_Prueba\\expediente.json\" -Algorithm SHA256",
        "purpose": "Identificar una versión del expediente exportado.",
        "example": "Hash: [SHA256 del archivo]",
        "interpretation": "No certifica verdad técnica; identifica esos bytes para comparación.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-Content -LiteralPath \"C:\\EVO_Prueba\\expediente.json\" -Raw | ConvertFrom-Json | Select-Object symptom,conclusion",
        "purpose": "Leer una ficha de trabajo propia.",
        "example": "symptom: ... | conclusion: ...",
        "interpretation": "Usá solo archivos propios; estructura y campos dependen del expediente.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Buscá síntoma y filtrá fuente/categoría.",
      "Leé evidencia y descarte antes de revelar la resolución.",
      "Anotá diferencias con tu caso y elegí la próxima prueba mínima.",
      "Registrá resolución o evidencia insuficiente y verificá antes de cerrar."
    ],
    "verification": "La ficha debe explicar por qué una causa se sostiene y qué alternativa fue descartada; citar una receta no es validación.",
    "pitfalls": [
      "No aplicar comandos de otro caso sin revisar build, datos y riesgo.",
      "No confundir una narración didáctica con telemetría del equipo propio."
    ],
    "rollback": "Las consultas a la biblioteca no cambian Windows; cualquier intervención debe llevar su plan específico de retorno.",
    "mission": "Compara dos expedientes parecidos y defendé una prueba que diferencia sus causas.",
    "scenario": "Encontraste un caso de DNS, pero tu equipo ni siquiera tiene gateway configurado.",
    "decisions": [
      {
        "text": "Revisar primero dirección y ruta antes de trasladar la solución DNS",
        "feedback": "El contexto muestra una falla anterior a resolución externa.",
        "correct": true
      },
      {
        "text": "Etiquetar el caso resuelto al encontrar un título parecido",
        "feedback": "No se probó nada en este contexto.",
        "correct": false
      },
      {
        "text": "Copiar automáticamente el cambio DNS",
        "feedback": "No crea una ruta ni demuestra la hipótesis.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un expediente resuelto prueba la causa en otra PC?",
        "choices": [
          {
            "text": "Sí, si el título dice forense",
            "feedback": "El rótulo no sustituye evidencia.",
            "correct": false
          },
          {
            "text": "Sí, si el síntoma tiene igual nombre",
            "feedback": "Un síntoma puede tener causas distintas.",
            "correct": false
          },
          {
            "text": "No; su contexto guía nuevas pruebas",
            "feedback": "Reproducibilidad exige verificar condiciones.",
            "correct": true
          }
        ]
      },
      {
        "question": "¿Cómo tratar evidencia insuficiente?",
        "choices": [
          {
            "text": "Inventar el sensor faltante",
            "feedback": "Viola procedencia y reproducibilidad.",
            "correct": false
          },
          {
            "text": "Documentarla y definir la próxima prueba",
            "feedback": "Es un resultado legítimo del método.",
            "correct": true
          },
          {
            "text": "Eliminar la ficha",
            "feedback": "Perderías prueba, contexto y límites; conservá el expediente y documentá qué falta medir.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  },
  {
    "number": "38",
    "objective": "Construir una auditoría PowerShell de solo lectura con resultados estructurados y errores controlados.",
    "prerequisites": "PowerShell 5.1 o posterior; scripts revisados y carpeta de salida propia. No cambiar execution policy global ni descargar código remoto.",
    "lessons": [
      {
        "heading": "Del comando al módulo",
        "text": "Separá recolectores System, Process, Memory, Services, Startup, Network, Driver, Event, Privacy y Health. Cada uno declara alcance, unidades, timestamp y error. PC Lenta consume esas evidencias, no un puntaje mágico. Get-CimInstance ofrece objetos tipados; validá propiedades ausentes sin inventar valores."
      },
      {
        "heading": "Salida útil y privada",
        "text": "JSON preserva estructura; CSV aplana filas; TXT explica contexto. Un log debe registrar errores y versión del recolector, no contraseñas ni dumps. Direcciones, nombres de usuario y rutas personales deben revisarse antes de compartir. Get-Process CPU acumula segundos; documentá qué mediste para no exportarlo como porcentaje instantáneo."
      },
      {
        "heading": "Dry-run y reversión",
        "text": "Un script de auditoría no necesita modificar configuración. -WhatIf/ShouldProcess requiere que el script respete esos mecanismos; no protege llamadas arbitrarias a ejecutables. Para exportar, elegí una carpeta propia y no sobrescribas informes anteriores. Un bloque try/catch con -ErrorAction Stop controla fallos; con acceso denegado exportá el estado de error, no un éxito vacío."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "try {\n  $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop\n  [pscustomobject]@{ schema=1; timestamp=(Get-Date).ToString(\"o\"); build=$os.BuildNumber; freeMemoryKiB=$os.FreePhysicalMemory; origin=\"SYSTEM_REPORTED\" } | ConvertTo-Json\n} catch {\n  [pscustomobject]@{ schema=1; status=\"ERROR\"; error=$_.Exception.Message } | ConvertTo-Json\n}",
        "purpose": "Crear un recolector real de lectura.",
        "example": "{\"schema\":1,\"build\":\"...\",\"freeMemoryKiB\":...,\"origin\":\"SYSTEM_REPORTED\"}",
        "interpretation": "La salida real proviene de CIM; no copies los valores de ejemplo como si fueran de tu PC.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "PowerShell",
        "code": "Get-Service | Select-Object Name,Status,StartType | ConvertTo-Csv -NoTypeInformation",
        "purpose": "Serializar una colección consultada.",
        "example": "\"Name\",\"Status\",\"StartType\"\n...",
        "interpretation": "CSV sirve para filas; conservá timestamp/contexto por separado. La consulta no cambia servicios.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Definí schema, campos, unidades y errores para un recolector.",
      "Probalo con una consulta de lectura y un objeto de ejemplo conocido.",
      "Simulá acceso denegado y propiedad ausente; exigí salida explícita de error/desconocido.",
      "Exportá a archivo nuevo y volvé a leerlo; compará tipos y cantidad de filas."
    ],
    "verification": "Un script funciona cuando maneja éxito y fallos, conserva semántica/unidades y no modifica el sistema; una consola sin errores no basta.",
    "pitfalls": [
      "No instalar agentes ni ejecutar comandos de reparación desde el recolector.",
      "No interpretar -WhatIf como sandbox universal."
    ],
    "rollback": "Consultas no requieren reversión de Windows; eliminá solo informes de prueba propios y restaurá un archivo únicamente desde copia si lo sobrescribiste.",
    "mission": "Diseñá un recolector con salida JSON, schema, procedencia, timestamp y error controlado; probá dos caminos.",
    "scenario": "Una consulta CIM da acceso denegado y el script devuelve JSON vacío marcado como éxito.",
    "decisions": [
      {
        "text": "Elevar y modificar todas las políticas",
        "feedback": "No es una solución mínima ni segura.",
        "correct": false
      },
      {
        "text": "Completar con hardware estimado y SYSTEM_REPORTED",
        "feedback": "La procedencia sería falsa.",
        "correct": false
      },
      {
        "text": "Devolver status ERROR y conservar el mensaje sin fabricar datos",
        "feedback": "El consumidor debe distinguir fallo de colección de una máquina sin recursos.",
        "correct": true
      }
    ],
    "questions": [
      {
        "question": "¿-WhatIf evita cualquier efecto de un script?",
        "choices": [
          {
            "text": "Sí, es aislamiento del sistema",
            "feedback": "No es una VM ni sandbox.",
            "correct": false
          },
          {
            "text": "No; depende de cómo implemente ShouldProcess",
            "feedback": "Llamadas ajenas pueden no respetarlo.",
            "correct": true
          },
          {
            "text": "Solo evita consultas CIM",
            "feedback": "Su función no es bloquear lecturas.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Cómo exportar un dato no disponible?",
        "choices": [
          {
            "text": "Con estado desconocido/error y su causa",
            "feedback": "No fabricar un valor medido.",
            "correct": true
          },
          {
            "text": "Como el de otra PC",
            "feedback": "No representa esta fuente.",
            "correct": false
          },
          {
            "text": "Como cero siempre",
            "feedback": "Cero puede ser una medición válida diferente.",
            "correct": false
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/powershell/scripting/developer/cmdlet/supporting-shouldprocess"
      }
    ]
  },
  {
    "number": "39",
    "objective": "Cerrar un experimento Windows con baseline, intervención única, segunda medición y veredicto defendible.",
    "prerequisites": "Respaldo cuando corresponda, tarea repetible, unidad definida y permiso para cualquier intervención real. Podés completar el experimento con datos simulados etiquetados.",
    "lessons": [
      {
        "heading": "Antes de medir",
        "text": "Escribí síntoma, contexto e hipótesis falsable. Baseline debe incluir versión, alimentación, carga, métrica/unidad y al menos tres muestras comparables. Elegí menor/mayor es mejor antes de ver el resultado. Si comparás arranque, no mezcles cold boot con fast startup; si comparás app, no mezcles caché caliente y fría."
      },
      {
        "heading": "Intervención y control",
        "text": "Cambiar driver, energía y servicios juntos impide atribuir un delta. Elegí una variable y guardá su valor previo con plan de rollback. La segunda medición replica condiciones y cantidad de muestras. La mediana reduce influencia de un extremo, pero no lo borra: revisá dispersión y fallos de estabilidad. Los números ingresados en el navegador no son telemetría verificada."
      },
      {
        "heading": "Veredicto y expediente",
        "text": "Calculá mediana después menos antes y porcentaje relativo cuando baseline no sea cero; no ocultes unidades ni dirección de mejora. Conservá/revertí según magnitud, estabilidad y limitaciones, o declará inconcluso cuando las condiciones no sean equivalentes. EXPEDIENTE WINDOWS EVO 001 reúne procedencia, evidencia, descarte, intervención, muestras, delta y conclusión. Completar este sector no aprueba automáticamente el examen final del tomo."
      }
    ],
    "commands": [
      {
        "shell": "PowerShell",
        "code": "Measure-Command { Get-Service | Out-Null } | Select-Object TotalMilliseconds",
        "purpose": "Medir una consulta repetible de ejemplo.",
        "example": "TotalMilliseconds: [valor de tu ejecución]",
        "interpretation": "Repetí al menos tres veces y controlá contexto; mide esa consulta, no “velocidad de Windows”.",
        "admin": false,
        "simulationOnly": false
      },
      {
        "shell": "CMD",
        "code": "ver",
        "purpose": "Registrar versión básica como parte del contexto.",
        "example": "Microsoft Windows [Version ...]",
        "interpretation": "Complementá build, driver/carga/alimentación; este dato aislado no hace equivalentes las pruebas.",
        "admin": false,
        "simulationOnly": false
      }
    ],
    "procedure": [
      "Definí síntoma, hipótesis, métrica, dirección y contexto.",
      "Tomá al menos tres muestras de baseline y documentá procedencia.",
      "Registrá una intervención y cómo revertirla.",
      "Repetí muestras equivalentes; calculá medianas, delta y limitaciones.",
      "Elegí conservar, revertir o inconcluso y exportá el expediente."
    ],
    "verification": "El resultado se valida con evidencia comparable y estabilidad, no por un porcentaje favorable ingresado; declará límites y datos desconocidos.",
    "pitfalls": [
      "No certificar mediciones ingresadas como detección automática.",
      "No marcar el tomo completo por terminar un solo experimento."
    ],
    "rollback": "Restaurá la única variable intervenida y repetí la carga; si no podés explicar la reversión, no realices el cambio real.",
    "mission": "Completá y exportá EXPEDIENTE WINDOWS EVO 001 con muestras, contexto, intervención y veredicto.",
    "scenario": "La segunda medición es más rápida, pero se cambió simultáneamente driver, energía y resolución.",
    "decisions": [
      {
        "text": "Afirmar que el driver causó todo el delta",
        "feedback": "Se cambiaron varias variables.",
        "correct": false
      },
      {
        "text": "Declarar inconclusa la atribución y repetir con una sola variable",
        "feedback": "El resultado no separa las causas de la mejora.",
        "correct": true
      },
      {
        "text": "Borrar muestras lentas para aprobar",
        "feedback": "Eliminar selectivamente muestras lentas sesga el resultado e impide reproducir la comparación original.",
        "correct": false
      }
    ],
    "questions": [
      {
        "question": "¿Un delta favorable prueba causalidad por sí solo?",
        "choices": [
          {
            "text": "No; requiere condiciones comparables y control de variables",
            "feedback": "El diseño del experimento determina alcance.",
            "correct": true
          },
          {
            "text": "Solo si tiene dos decimales",
            "feedback": "Precisión visual no valida la prueba.",
            "correct": false
          },
          {
            "text": "Sí, siempre",
            "feedback": "Puede haber confusores y ruido.",
            "correct": false
          }
        ]
      },
      {
        "question": "¿Datos escritos por el estudiante son telemetría automática?",
        "choices": [
          {
            "text": "Sí, al marcar completado",
            "feedback": "El progreso no transforma evidencia.",
            "correct": false
          },
          {
            "text": "Sí, porque se exportan a JSON",
            "feedback": "El formato no modifica la fuente.",
            "correct": false
          },
          {
            "text": "No; deben etiquetarse como ingresados o simulados",
            "feedback": "La procedencia debe reflejar cómo se obtuvieron.",
            "correct": true
          }
        ]
      }
    ],
    "lab": null,
    "references": [
      {
        "label": "Documentación técnica Microsoft",
        "url": "https://learn.microsoft.com/windows/"
      }
    ]
  }
];

const registryLesson = TOMO_02_ADVANCED_CONTENT.find((sector) => sector.number === '11')!;
registryLesson.commands.push({ shell: 'REG', simulationOnly: true,
  purpose: 'ADD-EVO-MENU.reg · ejemplo para una VM descartable',
  code: String.raw`Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Classes\*\shell\EVO]
@="EVO: abrir con Bloc de notas"

[HKEY_CURRENT_USER\Software\Classes\*\shell\EVO\command]
@="notepad.exe \"%1\""`,
  example: 'Un menú EVO del usuario abre el archivo seleccionado con Bloc de notas.',
  interpretation: 'Inspeccioná ámbito HKCU y comillas del argumento. Solo en una VM con snapshot, sin reemplazar una clave EVO preexistente. No se ejecuta/importa desde esta web.',
});
registryLesson.commands.push({ shell: 'REG', simulationOnly: true,
  purpose: 'REMOVE-EVO-MENU.reg · retirar únicamente la clave de prueba',
  code: String.raw`Windows Registry Editor Version 5.00

[-HKEY_CURRENT_USER\Software\Classes\*\shell\EVO]`,
  example: 'La clave EVO y su comando dejan de aparecer; otras asociaciones permanecen.',
  interpretation: 'La eliminación de una rama es modificadora. Comprobá que fue creada para la prueba y que tenés respaldo; si existía antes, restaurá su contenido en vez de eliminarla.',
});

const auditLesson = TOMO_02_ADVANCED_CONTENT.find((sector) => sector.number === '38')!;
auditLesson.commands.push({ shell: 'PowerShell', code: WINDOWS_AUDIT_EXAMPLE,
  purpose: 'Auditoría modular de lectura con exportación opcional y -WhatIf',
  example: '{"schema":1,"sections":[{"name":"System","status":"OK","origin":"SYSTEM_REPORTED"}]}',
  interpretation: 'Guardá el texto como script propio revisado. Sin OutputDirectory solo muestra la consulta; con -WhatIf no escribe archivos. Startup aquí inventaría tareas, no todos los mecanismos de inicio; Privacy cuenta conexiones sin exportar destinos. WindowsHealth reporta espacio, no ejecuta SFC/DISM. Compará snapshots para PC Lenta; no genera un diagnóstico mágico. Puede haber secciones ERROR por módulos/permisos/ausencia de eventos. Revisá rutas/nombres antes de compartir. Nunca cambies políticas globales para ejecutar el ejemplo.',
});

export function getAdvancedSector(number: string): AdvancedSectorContent | undefined {
  return TOMO_02_ADVANCED_CONTENT.find((sector) => sector.number === number);
}
